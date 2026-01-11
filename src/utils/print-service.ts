/**
 * Print Service - Handles different printer types
 * Supports: USB Serial, Network, and Browser fallback
 */

import { ESCPOSPrinter, createReceipt } from './escpos-printer';

export type PrinterType = 'usb-serial' | 'network' | 'browser';

export interface PrinterConfig {
    type: PrinterType;
    networkIp?: string;
    networkPort?: number;
}

export class PrintService {
    private config: PrinterConfig;

    constructor() {
        // Load config from localStorage
        const savedConfig = localStorage.getItem('printer_config');
        if (savedConfig) {
            this.config = JSON.parse(savedConfig);
        } else {
            // Default to browser printing
            this.config = {
                type: 'browser',
            };
        }
    }

    // Save printer configuration
    saveConfig(config: PrinterConfig): void {
        this.config = config;
        localStorage.setItem('printer_config', JSON.stringify(config));
    }

    // Get current configuration
    getConfig(): PrinterConfig {
        return this.config;
    }

    // Check if Web Serial API is available
    isWebSerialSupported(): boolean {
        return 'serial' in navigator;
    }

    // Print bill using configured method
    async printBill(billData: any): Promise<void> {
        const settings = this.getSettings();

        switch (this.config.type) {
            case 'usb-serial':
                await this.printUSBSerial(billData, settings);
                break;
            case 'network':
                await this.printNetwork(billData, settings);
                break;
            case 'browser':
            default:
                await this.printBrowser(billData, settings);
                break;
        }
    }

    // Print via USB Serial (Web Serial API)
    private async printUSBSerial(billData: any, settings: any): Promise<void> {
        if (!this.isWebSerialSupported()) {
            throw new Error(
                'Web Serial API not supported. Please use Chrome or Edge browser.'
            );
        }

        try {
            const printer = createReceipt(billData, settings);
            await printer.printUSB();
        } catch (error: any) {
            if (error.name === 'NotFoundError') {
                throw new Error('No printer selected. Please select a printer.');
            }
            throw error;
        }
    }

    // Print via Network
    private async printNetwork(billData: any, settings: any): Promise<void> {
        if (!this.config.networkIp) {
            throw new Error('Network printer IP not configured');
        }

        const printer = createReceipt(billData, settings);
        await printer.printNetwork(
            this.config.networkIp,
            this.config.networkPort || 9100
        );
    }

    // Print via Browser (fallback method)
    private async printBrowser(billData: any, settings: any): Promise<void> {
        const currencySymbol = settings?.currency_symbol?.value || '₹';
        const restaurantName =
            settings?.restaurant_name?.value || 'Restaurant Name';
        const restaurantAddress =
            settings?.restaurant_address?.value || 'Restaurant Address';
        const restaurantPhone =
            settings?.restaurant_phone?.value || 'Phone: +91 1234567890';

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Receipt #${billData.bill_number}</title>
                <style>
                    @media print {
                        @page {
                            size: 80mm auto;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            padding: 0;
                        }
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        width: 80mm;
                        padding: 5mm;
                        margin: 0 auto;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                        border-bottom: 2px dashed #000;
                        padding-bottom: 10px;
                    }
                    .restaurant-name {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .info {
                        font-size: 10px;
                    }
                    .bill-details {
                        margin: 10px 0;
                        font-size: 11px;
                    }
                    .items {
                        margin: 10px 0;
                        border-top: 1px dashed #000;
                        border-bottom: 1px dashed #000;
                        padding: 10px 0;
                    }
                    .item-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 5px 0;
                    }
                    .item-name {
                        flex: 1;
                    }
                    .item-qty {
                        width: 30px;
                        text-align: center;
                    }
                    .item-price {
                        width: 60px;
                        text-align: right;
                    }
                    .totals {
                        margin-top: 10px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 3px 0;
                    }
                    .total-row.grand {
                        font-size: 14px;
                        font-weight: bold;
                        border-top: 2px solid #000;
                        padding-top: 5px;
                        margin-top: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 15px;
                        padding-top: 10px;
                        border-top: 2px dashed #000;
                        font-size: 11px;
                    }
                    .thank-you {
                        font-weight: bold;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="restaurant-name">${restaurantName}</div>
                    <div class="info">${restaurantAddress}</div>
                    <div class="info">${restaurantPhone}</div>
                </div>

                <div class="bill-details">
                    <div><strong>Bill #:</strong> ${billData.bill_number}</div>
                    <div><strong>Date:</strong> ${new Date(
                        billData.created_at
                    ).toLocaleString()}</div>
                    ${
                        billData.customer_name
                            ? `<div><strong>Customer:</strong> ${billData.customer_name}</div>`
                            : ''
                    }
                    ${
                        billData.customer_phone
                            ? `<div><strong>Phone:</strong> ${billData.customer_phone}</div>`
                            : ''
                    }
                </div>

                <div class="items">
                    <div class="item-row" style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px;">
                        <div class="item-name">Item</div>
                        <div class="item-qty">Qty</div>
                        <div class="item-price">Amount</div>
                    </div>
                    ${billData.items
                        .map(
                            (item: any) => `
                        <div class="item-row">
                            <div class="item-name">${item.item_name}</div>
                            <div class="item-qty">${item.quantity}</div>
                            <div class="item-price">${currencySymbol}${parseFloat(
                                item.total_price
                            ).toFixed(2)}</div>
                        </div>
                    `
                        )
                        .join('')}
                </div>

                <div class="totals">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${currencySymbol}${parseFloat(
            billData.subtotal
        ).toFixed(2)}</span>
                    </div>
                    ${
                        billData.discount_amount > 0
                            ? `
                        <div class="total-row">
                            <span>Discount (${
                                billData.discount_percentage
                            }%):</span>
                            <span>-${currencySymbol}${parseFloat(
                                  billData.discount_amount
                              ).toFixed(2)}</span>
                        </div>
                    `
                            : ''
                    }
                    ${
                        billData.tax_amount > 0
                            ? `
                        <div class="total-row">
                            <span>Tax (${billData.tax_percentage}%):</span>
                            <span>${currencySymbol}${parseFloat(
                                  billData.tax_amount
                              ).toFixed(2)}</span>
                        </div>
                    `
                            : ''
                    }
                    <div class="total-row grand">
                        <span>TOTAL:</span>
                        <span>${currencySymbol}${parseFloat(
            billData.total_amount
        ).toFixed(2)}</span>
                    </div>
                    <div class="total-row">
                        <span>Payment Method:</span>
                        <span style="text-transform: uppercase;">${
                            billData.payment_method
                        }</span>
                    </div>
                </div>

                <div class="footer">
                    <div class="thank-you">Thank You! Visit Again!</div>
                    ${
                        billData.notes
                            ? `<div style="font-size: 10px; margin-top: 5px;">Note: ${billData.notes}</div>`
                            : ''
                    }
                </div>
                <script>
                    window.onload = function() {
                        // Auto print when page loads
                        window.print();
                        // Close window after printing (or cancel)
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank', 'width=300,height=600');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
        } else {
            throw new Error('Failed to open print window. Check popup blocker.');
        }
    }

    // Get settings from localStorage
    private getSettings(): any {
        const settingsStr = localStorage.getItem('settings');
        if (settingsStr) {
            try {
                return JSON.parse(settingsStr);
            } catch (error) {
                console.error('Error parsing settings:', error);
            }
        }
        return {};
    }
}

// Export singleton instance
export const printService = new PrintService();

