"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import {
    CategoryInfo,
    CategoriesResponse,
    MenuItem,
    Combo,
    CombosResponse,
} from "@/types/menu";
import POSLayout from "@/components/pos/POSLayout";
import CategoryGrid from "@/components/pos/CategoryGrid";
import ComboGrid from "@/components/pos/ComboGrid";
import MenuItemsGrid from "@/components/pos/MenuItemsGrid";
import OrderSidebar from "@/components/pos/OrderSidebar";
import LoadingState from "@/components/pos/LoadingState";
import ErrorState from "@/components/pos/ErrorState";
import PaymentModal, { PaymentData } from "@/components/pos/PaymentModal";
import BillSuccessModal from "@/components/pos/BillSuccessModal";

export default function PosPage() {
    const [activeTab, setActiveTab] = useState<"categories" | "combos">(
        "categories"
    );
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [combos, setCombos] = useState<Combo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryInfo | null>(null);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [itemsError, setItemsError] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<
        Array<{
            id: number;
            name: string;
            price: number;
            quantity: number;
            total: number;
            type?: "item" | "combo";
        }>
    >([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isBillSuccessModalOpen, setIsBillSuccessModalOpen] = useState(false);
    const [isProcessingBill, setIsProcessingBill] = useState(false);
    const [isPrintingBill, setIsPrintingBill] = useState(false);
    const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
    const [createdBill, setCreatedBill] = useState<{
        id: number;
        bill_number: string;
        total_amount: number;
        customer_phone?: string;
    } | null>(null);

    useEffect(() => {
        fetchCategories();
        fetchCombos();

        // Test toast on mount (remove after testing)
        setTimeout(() => {
            toast.info("POS System Ready");
        }, 1000);
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response: CategoriesResponse = await api.get("/categories");
            setCategories(response.data);
        } catch (err: any) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const fetchCombos = async () => {
        try {
            const response: CombosResponse = await api.combos.getCombos();
            setCombos(response.data);
        } catch (err: any) {
            console.error("Error fetching combos:", err);
            // Don't set error for combos, just log it
        }
    };

    const fetchItems = async (categoryId: number) => {
        try {
            setItemsLoading(true);
            setItemsError(null);
            const response = await api.menu.getItemsByCategory(
                categoryId,
                true
            );
            setItems(response.data);
        } catch (err: any) {
            console.error("Error fetching items:", err);
            setItemsError(err.message || "Failed to fetch items");
        } finally {
            setItemsLoading(false);
        }
    };

    const handleCategorySelect = (category: CategoryInfo) => {
        setSelectedCategory(category);
        fetchItems(category.id);
    };

    const handleAddToOrder = (item: MenuItem) => {
        const existingItem = orderItems.find(
            (orderItem) => orderItem.id === item.id && orderItem.type === "item"
        );

        if (existingItem) {
            // Update quantity if item already exists
            setOrderItems((prev) =>
                prev.map((orderItem) =>
                    orderItem.id === item.id && orderItem.type === "item"
                        ? {
                              ...orderItem,
                              quantity: orderItem.quantity + 1,
                              total: (orderItem.quantity + 1) * orderItem.price,
                          }
                        : orderItem
                )
            );
        } else {
            // Add new item to order
            setOrderItems((prev) => [
                ...prev,
                {
                    id: item.id,
                    name: item.name,
                    price:
                        typeof item.price === "number"
                            ? item.price
                            : parseFloat(item.price),
                    quantity: 1,
                    total:
                        typeof item.price === "number"
                            ? item.price
                            : parseFloat(item.price),
                    type: "item",
                },
            ]);
        }
    };

    const handleAddComboToOrder = (combo: Combo) => {
        const existingCombo = orderItems.find(
            (orderItem) =>
                orderItem.id === combo.id && orderItem.type === "combo"
        );

        const comboPrice =
            typeof combo.price === "number"
                ? combo.price
                : parseFloat(combo.price);

        if (existingCombo) {
            // Update quantity if combo already exists
            setOrderItems((prev) =>
                prev.map((orderItem) =>
                    orderItem.id === combo.id && orderItem.type === "combo"
                        ? {
                              ...orderItem,
                              quantity: orderItem.quantity + 1,
                              total: (orderItem.quantity + 1) * orderItem.price,
                          }
                        : orderItem
                )
            );
        } else {
            // Add new combo to order
            setOrderItems((prev) => [
                ...prev,
                {
                    id: combo.id,
                    name: combo.name,
                    price: comboPrice,
                    quantity: 1,
                    total: comboPrice,
                    type: "combo",
                },
            ]);
        }
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        setOrderItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity, total: quantity * item.price }
                    : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setOrderItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearOrder = () => {
        setOrderItems([]);
    };

    const handleProceedToPayment = () => {
        if (orderItems.length === 0) return;
        setIsPaymentModalOpen(true);
    };

    const handleCreateBill = async (paymentData: PaymentData) => {
        try {
            setIsProcessingBill(true);

            // Prepare bill items
            const billItems = orderItems.map((item) => ({
                item_id: item.id,
                item_type: (item.type === "combo" ? "combo" : "menu_item") as
                    | "menu_item"
                    | "combo",
                quantity: item.quantity,
            }));
            console.log(billItems, "billItems =====>");

            // Create bill
            const billResponse = await api.bills.createBill({
                customer_name: paymentData.customer_name || undefined,
                customer_phone: paymentData.customer_phone || undefined,
                customer_email: paymentData.customer_email || undefined,
                discount_percentage: paymentData.discount_percentage,
                tax_percentage: paymentData.tax_percentage,
                payment_method: paymentData.payment_method,
                notes: paymentData.notes || undefined,
                items: billItems,
            });

            console.log(billResponse, "billResponse =====>");

            // Check for API response status (handle both success field or direct error response)
            if (billResponse.success === false || !billResponse.data) {
                const errorMessage =
                    billResponse.message || "Failed to create bill";
                toast.error(errorMessage);
                setIsProcessingBill(false);
                return;
            }

            // Store the created bill data
            setCreatedBill({
                id: billResponse.data.id,
                bill_number: billResponse.data.bill_number,
                total_amount: parseFloat(billResponse.data.total_amount) || 0,
                customer_phone: paymentData.customer_phone || undefined,
            });

            // Show success message
            toast.success(billResponse.message || "Bill created successfully");

            // Close payment modal and show success modal
            setIsPaymentModalOpen(false);
            setIsBillSuccessModalOpen(true);
        } catch (err: any) {
            console.error("Error creating bill:", err);

            // Handle error response from API (ApiError or network error)
            let errorMessage = "Failed to create bill. Please try again.";

            if (err.data?.message) {
                // ApiError with message from backend
                errorMessage = err.data.message;
            } else if (err.data?.detail) {
                // ApiError with detail from backend
                errorMessage = err.data.detail;
            } else if (err.message) {
                // JavaScript error or network error
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsProcessingBill(false);
        }
    };

    const handlePrintBill = async () => {
        if (!createdBill) return;

        try {
            setIsPrintingBill(true);

            // Get bill data from API
            const billData = await api.bills.printBill(createdBill.id);

            // Create printable receipt content
            const printContent = createReceiptHTML(billData.data);

            // Open print dialog
            const printWindow = window.open(
                "",
                "_blank",
                "width=300,height=600"
            );
            if (printWindow) {
                printWindow.document.write(printContent);
                printWindow.document.close();

                // Wait for content to load, then print
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();

                    // Close print window after printing
                    setTimeout(() => {
                        printWindow.close();
                    }, 500);
                };
            }

            // Show success toast
            toast.success("Bill sent to printer!");
            console.log("Bill printed successfully");
        } catch (err: any) {
            console.error("Error printing bill:", err);

            // Handle error response from API
            let errorMessage = "Failed to print bill. Please try again.";

            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.data?.detail) {
                errorMessage = err.data.detail;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsPrintingBill(false);
        }
    };

    // Helper function to create receipt HTML for thermal printer
    const createReceiptHTML = (billData: any) => {
        // Get settings from localStorage
        const settingsStr = localStorage.getItem("settings");
        let currencySymbol = "₹";
        let restaurantName = "Restaurant Name";
        let restaurantAddress = "Restaurant Address";
        let restaurantPhone = "Phone: +91 1234567890";

        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                currencySymbol = settings.currency_symbol?.value || "₹";
                restaurantName =
                    settings.restaurant_name?.value || "Restaurant Name";
                restaurantAddress =
                    settings.restaurant_address?.value || "Restaurant Address";
                restaurantPhone =
                    settings.restaurant_phone?.value || "Phone: +91 1234567890";
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }

        return `
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
                            : ""
                    }
                    ${
                        billData.customer_phone
                            ? `<div><strong>Phone:</strong> ${billData.customer_phone}</div>`
                            : ""
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
                        .join("")}
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
                            : ""
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
                            : ""
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
                            : ""
                    }
                </div>
            </body>
            </html>
        `;
    };

    const handleSendWhatsApp = async () => {
        if (!createdBill || !createdBill.customer_phone) return;

        try {
            setIsSendingWhatsApp(true);

            // Get bill data from API
            const billData = await api.bills.printBill(createdBill.id);

            // Get restaurant info from settings
            const settingsStr = localStorage.getItem("settings");
            let restaurantName = "Restaurant";
            let currencySymbol = "₹";
            let reviewLink = "";

            if (settingsStr) {
                try {
                    const settings = JSON.parse(settingsStr);
                    restaurantName =
                        settings.restaurant_name?.value || "Restaurant";
                    currencySymbol = settings.currency_symbol?.value || "₹";
                    reviewLink = settings.review_link?.value || "";
                } catch (error) {
                    console.error("Error parsing settings:", error);
                }
            }

            // Format WhatsApp message
            const message = `
*${restaurantName}*
Thank you for your order! 🍽️

*Bill #:* ${billData.data.bill_number}
*Date:* ${new Date(billData.data.created_at).toLocaleString()}

*Order Details:*
${billData.data.items
    .map(
        (item: any) =>
            `${item.item_name} x ${
                item.quantity
            } - ${currencySymbol}${parseFloat(item.total_price).toFixed(2)}`
    )
    .join("\n")}

━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ${currencySymbol}${parseFloat(billData.data.subtotal).toFixed(2)}
${
    billData.data.discount_amount > 0
        ? `*Discount (${
              billData.data.discount_percentage
          }%):* -${currencySymbol}${parseFloat(
              billData.data.discount_amount
          ).toFixed(2)}\n`
        : ""
}${
                billData.data.tax_amount > 0
                    ? `*Tax (${
                          billData.data.tax_percentage
                      }%):* ${currencySymbol}${parseFloat(
                          billData.data.tax_amount
                      ).toFixed(2)}\n`
                    : ""
            }*TOTAL:* ${currencySymbol}${parseFloat(
                billData.data.total_amount
            ).toFixed(2)}
*Payment Method:* ${billData.data.payment_method.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━

Thank you! Visit us again! 😊
${
    reviewLink
        ? `\n\n⭐ *Love our food?*\nPlease leave us a review:\n${reviewLink}`
        : ""
}
            `.trim();

            // Clean phone number (remove spaces, dashes, and ensure it has country code)
            let phoneNumber = createdBill.customer_phone.replace(
                /[\s\-\(\)]/g,
                ""
            );

            // If phone doesn't start with country code, assume India (+91)
            if (!phoneNumber.startsWith("+") && !phoneNumber.startsWith("91")) {
                // Remove leading 0 if present
                phoneNumber = phoneNumber.replace(/^0/, "");
                phoneNumber = "91" + phoneNumber;
            }

            // Open WhatsApp with the message
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                message
            )}`;
            window.open(whatsappUrl, "_blank");

            // Show success toast
            toast.success("Opening WhatsApp...");
        } catch (err: any) {
            console.error("Error sending WhatsApp:", err);

            // Handle error response
            let errorMessage = "Failed to send WhatsApp message.";

            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.data?.detail) {
                errorMessage = err.data.detail;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setIsSendingWhatsApp(false);
        }
    };

    const handleBillSuccessClose = () => {
        setIsBillSuccessModalOpen(false);
        setCreatedBill(null);
        setOrderItems([]);
        setSelectedCategory(null);
        setItems([]);
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={fetchCategories} />;
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <>
            <POSLayout
                sidebar={
                    orderItems.length > 0 ? (
                        <OrderSidebar
                            items={orderItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onClearOrder={handleClearOrder}
                            onProceedToPayment={handleProceedToPayment}
                        />
                    ) : null
                }
            >
                {!selectedCategory ? (
                    <div>
                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="border-b border-gray-200 dark:border-[#3F3F46]">
                                <nav className="-mb-px flex gap-6">
                                    <button
                                        onClick={() =>
                                            setActiveTab("categories")
                                        }
                                        className={`
                                        py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${
                                            activeTab === "categories"
                                                ? "border-[#eb1700] text-[#eb1700]"
                                                : "border-transparent text-gray-600 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#FAFAFA] hover:border-gray-300 dark:hover:border-[#52525B]"
                                        }
                                    `}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>📂</span>
                                            <span>Categories</span>
                                            {categories.length > 0 && (
                                                <span className="ml-1 rounded-full bg-gray-100 dark:bg-[#27272A] px-2 py-0.5 text-xs">
                                                    {categories.length}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("combos")}
                                        className={`
                                        py-3 px-1 border-b-2 font-medium text-sm transition-colors
                                        ${
                                            activeTab === "combos"
                                                ? "border-[#eb1700] text-[#eb1700]"
                                                : "border-transparent text-gray-600 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#FAFAFA] hover:border-gray-300 dark:hover:border-[#52525B]"
                                        }
                                    `}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>🎁</span>
                                            <span>Combo Deals</span>
                                            {combos.length > 0 && (
                                                <span className="ml-1 rounded-full bg-gray-100 dark:bg-[#27272A] px-2 py-0.5 text-xs">
                                                    {combos.length}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "categories" ? (
                            <CategoryGrid
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategorySelect={handleCategorySelect}
                            />
                        ) : (
                            <ComboGrid
                                combos={combos}
                                onAddToOrder={handleAddComboToOrder}
                            />
                        )}
                    </div>
                ) : (
                    <div>
                        {/* Back to Categories Button */}
                        <div className="mb-6 flex gap-3 items-center">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setItems([]);
                                    setItemsError(null);
                                }}
                                className="flex items-center gap-2 text-[#eb1700] hover:text-[#c41400] font-medium transition-colors"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA] mt-2">
                                {selectedCategory.name}
                            </h1>
                        </div>

                        {/* Items Loading State */}
                        {itemsLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-[#A1A1AA]">
                                        Loading items...
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Items Error State */}
                        {itemsError && (
                            <div className="text-center py-12">
                                <div className="text-red-500 text-6xl mb-4">
                                    ⚠️
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                                    Error Loading Items
                                </h3>
                                <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                                    {itemsError}
                                </p>
                                <button
                                    onClick={() =>
                                        fetchItems(selectedCategory.id)
                                    }
                                    className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Items Grid */}
                        {!itemsLoading && !itemsError && (
                            <MenuItemsGrid
                                items={items}
                                onAddToOrder={handleAddToOrder}
                            />
                        )}
                    </div>
                )}
            </POSLayout>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleCreateBill}
                orderTotal={subtotal}
                orderSubtotal={subtotal}
                isProcessing={isProcessingBill}
            />

            {/* Bill Success Modal */}
            {createdBill && (
                <BillSuccessModal
                    isOpen={isBillSuccessModalOpen}
                    onClose={handleBillSuccessClose}
                    billNumber={createdBill.bill_number}
                    billId={createdBill.id}
                    total={createdBill.total_amount}
                    customerPhone={createdBill.customer_phone}
                    onPrint={handlePrintBill}
                    onWhatsApp={handleSendWhatsApp}
                    isPrinting={isPrintingBill}
                    isSendingWhatsApp={isSendingWhatsApp}
                />
            )}
        </>
    );
}
