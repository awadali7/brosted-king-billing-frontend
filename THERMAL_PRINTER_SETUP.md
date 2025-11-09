# Thermal Receipt Printer Setup Guide

## 🖨️ Printer Specifications
- **Model:** Pozone PP610US
- **Paper Width:** 80mm
- **Print Speed:** 230mm/s
- **Power Input:** 24V DC 2.5A
- **Interface:** RS232 + USB
- **Command Set:** ESC/POS Compatible
- **Certifications:** FE CE CB ROHS

## ✅ How It Works Now

When you click the **"Print Bill"** button in the BillSuccessModal:

1. **Fetches bill data** from the backend API
2. **Formats the receipt** specifically for 80mm thermal paper
3. **Opens browser print dialog** with the formatted receipt
4. **Sends to printer** configured in your system

## 🎨 Receipt Format

The receipt includes:

### Header Section
- Restaurant Name (bold, centered)
- Restaurant Address
- Restaurant Phone Number
- Dashed line separator

### Bill Details
- Bill Number
- Date & Time
- Customer Name (if provided)
- Customer Phone (if provided)

### Items Section
```
Item                Qty    Amount
----------------------------------
Chicken Burger       2     ₹500.00
French Fries         1     ₹150.00
```

### Totals Section
- Subtotal
- Discount (if applied)
- Tax
- **TOTAL** (bold, large)
- Payment Method

### Footer
- "Thank You! Visit Again!" message
- Notes (if any)

## 🔧 Printer Setup Steps

### 1. **Connect the Printer**

**Via USB:**
```bash
# The printer will be detected automatically by your OS
# Check if it's connected (Linux/Mac):
lsusb

# Windows: Check Device Manager > Printers
```

**Via RS232:**
- Connect RS232 cable to your computer
- Install RS232 driver if needed
- Configure COM port settings

### 2. **Install Printer Drivers**

**Windows:**
1. Download Pozone PP610US driver from manufacturer
2. Run the installer
3. Select USB or RS232 port
4. Test print from Windows settings

**Mac:**
1. System Preferences > Printers & Scanners
2. Click "+" to add printer
3. Select Pozone PP610US
4. Choose driver (Generic or ESC/POS)

**Linux:**
```bash
# Install CUPS
sudo apt-get install cups

# Add printer
sudo lpadmin -p PozonePrinter -E -v usb://Pozone/PP610US -m drv:///generic-escp.ppd

# Set as default
sudo lpadmin -d PozonePrinter
```

### 3. **Configure Browser Print Settings**

**Chrome/Edge:**
1. Settings > Advanced > Printing
2. Set Pozone PP610US as default printer
3. Enable "Print using system dialog" for more options

**Firefox:**
1. about:config
2. Search for `print.print_printer`
3. Set to your Pozone printer name

### 4. **Set Paper Size**

In your printer settings, configure:
- **Paper Width:** 80mm
- **Paper Length:** Continuous/Roll
- **Margins:** 0mm (or minimal)
- **Orientation:** Portrait

## 🎯 Usage in the App

### Quick Print Flow:
```
1. Complete order in POS
   ↓
2. Click "Proceed to Payment"
   ↓
3. Fill payment details
   ↓
4. Click "Create Bill"
   ↓
5. Success modal appears
   ↓
6. Click "Print Bill"
   ↓
7. Print dialog opens
   ↓
8. Receipt prints on thermal printer
```

### Features:
- ✅ Optimized for 80mm thermal paper
- ✅ Professional receipt format
- ✅ Fast printing (230mm/s)
- ✅ Automatic paper cutting (if printer supports)
- ✅ No ink/toner required
- ✅ Monospaced font for alignment
- ✅ Dashed line separators

## ⚙️ Advanced Configuration

### Silent Printing (No Dialog)

If you want to skip the print dialog and print directly, you can modify the code to use the Print API:

```typescript
// In handlePrintBill function, add:
if ('print' in window && navigator.userAgent.includes('Chrome')) {
    // Auto-print without dialog (Chrome only)
    printWindow.print();
}
```

**Note:** This requires browser permissions and may not work in all browsers.

### Custom Paper Width

If you have a different paper width (58mm, 80mm, etc.), update the CSS:

```css
@page {
    size: 58mm auto;  /* Change to your paper width */
}
body {
    width: 58mm;      /* Match paper width */
}
```

### Add Logo/QR Code

To add a logo or QR code to the receipt:

1. Convert logo to base64 or host it online
2. Add to receipt HTML:

```html
<div class="header">
    <img src="data:image/png;base64,YOUR_LOGO_BASE64" 
         alt="Logo" 
         style="width: 60px; height: auto;">
    <div class="restaurant-name">Restaurant Name</div>
</div>
```

## 🐛 Troubleshooting

### Issue: Printer not detected
**Solution:**
- Check USB/RS232 connection
- Restart printer
- Check power supply (24V DC 2.5A)
- Install/update drivers

### Issue: Nothing prints
**Solution:**
- Check if printer is online in system settings
- Verify paper is loaded correctly
- Check printer is set as default
- Test print from system settings

### Issue: Text is too small/large
**Solution:**
- Adjust `font-size` in CSS (line 369)
- Current: `font-size: 12px;`
- Try: `14px` for larger or `10px` for smaller

### Issue: Receipt is cut off
**Solution:**
- Verify paper width setting (80mm)
- Check printer margins
- Adjust CSS width to match paper

### Issue: Alignment problems
**Solution:**
- Use monospaced font (Courier New)
- Ensure `display: flex` for item rows
- Adjust spacing in CSS

### Issue: Print dialog doesn't open
**Solution:**
- Check browser popup blocker
- Allow popups for your domain
- Try different browser

## 📝 Maintenance Tips

1. **Regular Cleaning:**
   - Clean print head weekly with alcohol wipes
   - Remove paper dust
   - Keep printer in clean, dry environment

2. **Paper Storage:**
   - Store thermal paper in cool, dry place
   - Avoid direct sunlight
   - Use within 2-3 years

3. **Power Management:**
   - Use correct power adapter (24V DC 2.5A)
   - Enable auto-sleep mode
   - Turn off when not in use for long periods

4. **Driver Updates:**
   - Check manufacturer website quarterly
   - Update drivers for better compatibility
   - Keep firmware up to date

## 🔗 Additional Resources

- [ESC/POS Command Reference](https://reference.epson-biz.com/modules/ref_escpos/index.php)
- [Thermal Printer Best Practices](https://www.thermal-printer.com/best-practices)
- Browser Print API Documentation

## 💡 Future Enhancements

Potential improvements for better thermal printing:

1. **Direct ESC/POS Commands** - Bypass browser print dialog
2. **Auto-print** - Print immediately after bill creation
3. **Print Queue** - Handle multiple prints
4. **Custom Templates** - Different receipt formats
5. **Barcode/QR Code** - For bill tracking
6. **Multiple Copies** - Print customer + kitchen copies
7. **Network Printing** - Share printer across devices

---

**Need Help?** Check the troubleshooting section or contact support!

