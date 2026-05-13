/**
 * ESC/POS Thermal Printer Utility
 * Generates proper ESC/POS commands for line-by-line printing
 * No browser print dialog - direct printer communication
 */

// ESC/POS Commands
const ESC = '\x1B';
const GS = '\x1D';

export class ESCPOSPrinter {
    private encoder: TextEncoder;
    private commands: number[] = [];

    constructor() {
        this.encoder = new TextEncoder();
    }

    // Initialize printer
    init(): this {
        this.addRaw([0x1B, 0x40]); // ESC @ - Initialize printer
        return this;
    }

    // Text alignment
    align(alignment: 'left' | 'center' | 'right'): this {
        const alignCodes = { left: 0, center: 1, right: 2 };
        this.addRaw([0x1B, 0x61, alignCodes[alignment]]);
        return this;
    }

    // Text size (1-8 for width and height)
    setTextSize(width: number = 1, height: number = 1): this {
        const size = ((width - 1) << 4) | (height - 1);
        this.addRaw([0x1D, 0x21, size]);
        return this;
    }

    // Bold text
    bold(enable: boolean = true): this {
        this.addRaw([0x1B, 0x45, enable ? 1 : 0]);
        return this;
    }

    // Underline text
    underline(mode: 0 | 1 | 2 = 1): this {
        this.addRaw([0x1B, 0x2D, mode]); // 0=off, 1=1dot, 2=2dot
        return this;
    }

    // Add text
    text(text: string): this {
        const encoded = this.encoder.encode(text);
        this.addRaw(Array.from(encoded));
        return this;
    }

    // Add text and newline
    println(text: string = ''): this {
        this.text(text);
        this.newline();
        return this;
    }

    // Newline
    newline(lines: number = 1): this {
        for (let i = 0; i < lines; i++) {
            this.addRaw([0x0A]); // Line feed
        }
        return this;
    }

    // Horizontal line (dashed)
    drawLine(char: string = '-', length: number = 32): this {
        this.println(char.repeat(length));
        return this;
    }

    // Draw double line
    drawDoubleLine(length: number = 32): this {
        this.println('='.repeat(length));
        return this;
    }

    // Left-right text (for labels and values)
    leftRight(left: string, right: string, width: number = 32): this {
        const spaces = width - left.length - right.length;
        this.println(left + ' '.repeat(Math.max(0, spaces)) + right);
        return this;
    }

    // Three column text (item, qty, price)
    threeColumn(
        col1: string,
        col2: string,
        col3: string,
        width: number = 32
    ): this {
        const col1Width = Math.floor(width * 0.5); // 50% for item name
        const col2Width = Math.floor(width * 0.15); // 15% for qty
        const col3Width = width - col1Width - col2Width; // Rest for price

        const truncCol1 = col1.padEnd(col1Width).substring(0, col1Width);
        const truncCol2 = col2.padStart(col2Width).substring(0, col2Width);
        const truncCol3 = col3.padStart(col3Width).substring(0, col3Width);

        this.println(truncCol1 + truncCol2 + truncCol3);
        return this;
    }

    // QR Code
    qrCode(data: string, size: number = 6): this {
        // Store QR code data
        this.addRaw([0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00]); // Model
        this.addRaw([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, size]); // Size

        // Store data
        const qrData = this.encoder.encode(data);
        const len = qrData.length + 3;
        this.addRaw([
            0x1D,
            0x28,
            0x6B,
            len & 0xff,
            (len >> 8) & 0xff,
            0x31,
            0x50,
            0x30,
        ]);
        this.addRaw(Array.from(qrData));

        // Print QR code
        this.addRaw([0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30]);
        return this;
    }

    // Barcode
    barcode(data: string, type: number = 73): this {
        // Type 73 = CODE39
        this.addRaw([0x1D, 0x68, 0x50]); // Barcode height
        this.addRaw([0x1D, 0x77, 0x02]); // Barcode width
        this.addRaw([0x1D, 0x6B, type]); // Barcode type
        this.text(data);
        this.addRaw([0x00]); // Null terminator
        return this;
    }

    // Feed paper and cut
    feedAndCut(lines: number = 3): this {
        this.newline(lines);
        this.addRaw([0x1D, 0x56, 0x00]); // Full cut
        return this;
    }

    // Partial cut
    partialCut(lines: number = 3): this {
        this.newline(lines);
        this.addRaw([0x1D, 0x56, 0x01]); // Partial cut
        return this;
    }

    // Open cash drawer
    openDrawer(): this {
        this.addRaw([0x1B, 0x70, 0x00, 0x19, 0xFA]); // Drawer kick pulse
        return this;
    }

    // Add raw bytes
    private addRaw(bytes: number[]): void {
        this.commands.push(...bytes);
    }

    // Get final buffer
    getBuffer(): Uint8Array {
        return new Uint8Array(this.commands);
    }

    // Clear commands
    clear(): this {
        this.commands = [];
        return this;
    }

    // Print to USB printer (Web Serial API)
    async printUSB(): Promise<void> {
        if (!('serial' in navigator)) {
            throw new Error(
                'Web Serial API not supported. Use Chrome/Edge browser.'
            );
        }

        try {
            // Request port
            const port = await (navigator as any).serial.requestPort();
            await port.open({ baudRate: 9600 });

            // Write data
            const writer = port.writable.getWriter();
            await writer.write(this.getBuffer());
            writer.releaseLock();

            // Close port
            await port.close();
        } catch (error) {
            console.error('USB Print Error:', error);
            throw error;
        }
    }

    // Print via network printer
    async printNetwork(ip: string, port: number = 9100): Promise<void> {
        try {
            const buffer = this.getBuffer();
            const blob = new Blob([buffer as BlobPart], { type: 'application/octet-stream' });
            const response = await fetch(`http://${ip}:${port}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                body: blob,
            });

            if (!response.ok) {
                throw new Error('Network print failed');
            }
        } catch (error) {
            console.error('Network Print Error:', error);
            throw error;
        }
    }

    // Download as file (for testing)
    downloadAsFile(filename: string = 'receipt.bin'): void {
        const blob = new Blob([this.getBuffer() as BlobPart], {
            type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Helper function to create receipt
export function createReceipt(billData: any, settings: any): ESCPOSPrinter {
    const printer = new ESCPOSPrinter();
    const currencySymbol = settings?.currency_symbol?.value || '₹';

    printer
        .init()
        // Header
        .align('center')
        .setTextSize(2, 2)
        .bold(true)
        .println(settings?.restaurant_name?.value || 'Restaurant')
        .bold(false)
        .setTextSize(1, 1)
        .println(settings?.restaurant_address?.value || '')
        .println(settings?.restaurant_phone?.value || '')
        .drawLine('-', 32)
        .newline()

        // Bill details
        .align('left')
        .leftRight('Bill #:', billData.bill_number, 32)
        .leftRight(
            'Date:',
            new Date(billData.created_at).toLocaleString(),
            32
        );

    // Customer info
    if (billData.customer_name) {
        printer.leftRight('Customer:', billData.customer_name, 32);
    }
    if (billData.customer_phone) {
        printer.leftRight('Phone:', billData.customer_phone, 32);
    }

    printer.newline().drawLine('=', 32);

    // Items header
    printer.bold(true).threeColumn('Item', 'Qty', 'Price', 32).bold(false);

    printer.drawLine('-', 32);

    // Items
    billData.items.forEach((item: any) => {
        printer.threeColumn(
            item.item_name,
            item.quantity.toString(),
            `${currencySymbol}${parseFloat(item.total_price).toFixed(2)}`,
            32
        );
    });

    printer.drawLine('=', 32);

    // Totals
    printer
        .leftRight(
            'Subtotal:',
            `${currencySymbol}${parseFloat(billData.subtotal).toFixed(2)}`,
            32
        )
        .leftRight(
            `Discount:`,
            `-${currencySymbol}${parseFloat(billData.discount_amount).toFixed(2)}`,
            32
        )
        .leftRight(
            `Tax (${billData.tax_percentage}%):`,
            `${currencySymbol}${parseFloat(billData.tax_amount).toFixed(2)}`,
            32
        )
        .drawLine('-', 32)
        .bold(true)
        .setTextSize(2, 2)
        .leftRight(
            'TOTAL:',
            `${currencySymbol}${parseFloat(billData.total_amount).toFixed(2)}`,
            16
        )
        .setTextSize(1, 1)
        .bold(false)
        .newline()
        .leftRight(
            'Payment:',
            billData.payment_method.toUpperCase(),
            32
        );

    // Footer
    printer
        .newline()
        .drawLine('=', 32)
        .align('center')
        .bold(true)
        .println('Thank You! Visit Again!')
        .bold(false);

    if (billData.notes) {
        printer.newline().println(`Note: ${billData.notes}`);
    }

    // QR Code for bill (optional)
    // printer.newline().align('center').qrCode(`BILL:${billData.bill_number}`);

    // Cut paper
    printer.feedAndCut(4);

    return printer;
}

