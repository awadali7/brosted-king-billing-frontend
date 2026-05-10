"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, MessageCircle } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { printService } from "@/utils/print-service";

interface BillItem {
    id: number;
    item_name: string;
    item_type: string;
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
}

interface Bill {
    id: number;
    bill_number: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    subtotal: string | number;
    discount_percentage: string | number;
    discount_amount: string | number;
    tax_percentage: string | number;
    tax_amount: string | number;
    total_amount: string | number;
    payment_method: string;
    payment_status: string;
    split_cash_amount?: string | number;
    split_upi_amount?: string | number;
    split_card_amount?: string | number;
    split_other_amount?: string | number;
    notes?: string;
    created_at: string;
    items: BillItem[];
}

interface ViewBillModalProps {
    bill: Bill;
    onClose: () => void;
}

const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function ViewBillModal({ bill, onClose }: ViewBillModalProps) {
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [isPrinting, setIsPrinting] = useState(false);
    const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.currency_symbol?.value) {
                    setCurrencySymbol(settings.currency_symbol.value);
                }
            } catch {}
        }
    }, []);

    const fmt = (val: string | number) =>
        `${currencySymbol}${parseFloat(String(val)).toFixed(2)}`;

    const handlePrint = async () => {
        try {
            setIsPrinting(true);
            const billData = await api.bills.printBill(bill.id);
            await printService.printBill(billData.data);
            toast.success("Bill sent to printer!");
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Failed to print");
        } finally {
            setIsPrinting(false);
        }
    };

    const handleWhatsApp = async () => {
        if (!bill.customer_phone) return;
        try {
            setIsSendingWhatsApp(true);
            const billData = await api.bills.printBill(bill.id);
            const settingsStr = localStorage.getItem("settings");
            let restaurantName = "Restaurant";
            let sym = currencySymbol;
            let reviewLink = "";
            if (settingsStr) {
                try {
                    const s = JSON.parse(settingsStr);
                    restaurantName = s.restaurant_name?.value || "Restaurant";
                    sym = s.currency_symbol?.value || "₹";
                    reviewLink = s.review_link?.value || "";
                } catch {}
            }

            const message = `
*${restaurantName}*
Thank you for your order!

*Bill #:* ${billData.data.bill_number}
*Date:* ${new Date(billData.data.created_at).toLocaleString()}

*Order Details:*
${billData.data.items
    .map(
        (item: any) =>
            `${item.item_name} x ${item.quantity} - ${sym}${parseFloat(item.total_price).toFixed(2)}`
    )
    .join("\n")}

━━━━━━━━━━━━━━━━━━━━
*Subtotal:* ${sym}${parseFloat(billData.data.subtotal).toFixed(2)}
${billData.data.discount_amount > 0 ? `*Discount (${billData.data.discount_percentage}%):* -${sym}${parseFloat(billData.data.discount_amount).toFixed(2)}\n` : ""}${billData.data.tax_amount > 0 ? `*Tax (${billData.data.tax_percentage}%):* ${sym}${parseFloat(billData.data.tax_amount).toFixed(2)}\n` : ""}*TOTAL:* ${sym}${parseFloat(billData.data.total_amount).toFixed(2)}
*Payment:* ${billData.data.payment_method.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━

Thank you! Visit us again!${reviewLink ? `\n\n⭐ Leave us a review:\n${reviewLink}` : ""}
            `.trim();

            let phone = bill.customer_phone.replace(/[\s\-\(\)]/g, "");
            if (!phone.startsWith("+") && !phone.startsWith("91")) {
                phone = phone.replace(/^0/, "");
                phone = "91" + phone;
            }
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
            toast.success("Opening WhatsApp...");
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Failed to open WhatsApp");
        } finally {
            setIsSendingWhatsApp(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {bill.bill_number}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {new Date(bill.created_at).toLocaleString()}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Status + Payment */}
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[bill.payment_status] || ""}`}>
                            {bill.payment_status}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                            {bill.payment_method}
                        </span>
                    </div>

                    {/* Customer */}
                    {(bill.customer_name || bill.customer_phone || bill.customer_email) && (
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                            {bill.customer_name && <p className="text-sm text-gray-900 font-medium">{bill.customer_name}</p>}
                            {bill.customer_phone && <p className="text-sm text-gray-600">{bill.customer_phone}</p>}
                            {bill.customer_email && <p className="text-sm text-gray-600">{bill.customer_email}</p>}
                        </div>
                    )}

                    {/* Items */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Items</p>
                        <div className="space-y-2">
                            {bill.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{item.item_type.replace("_", " ")} × {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">{fmt(item.total_price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span><span>{fmt(bill.subtotal)}</span>
                        </div>
                        {parseFloat(String(bill.discount_amount)) > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount ({bill.discount_percentage}%)</span>
                                <span>-{fmt(bill.discount_amount)}</span>
                            </div>
                        )}
                        {parseFloat(String(bill.tax_amount)) > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Tax ({bill.tax_percentage}%)</span>
                                <span>{fmt(bill.tax_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-bold pt-1 border-t border-gray-200">
                            <span className="text-gray-900">Total</span>
                            <span className="text-[#eb1700]">{fmt(bill.total_amount)}</span>
                        </div>
                    </div>

                    {/* Split Payment Breakdown */}
                    {bill.payment_method === "split" && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Split Payment Breakdown</p>
                            <div className="bg-blue-50 rounded-lg p-3 space-y-1.5">
                                {[
                                    { label: "Cash", val: bill.split_cash_amount },
                                    { label: "UPI", val: bill.split_upi_amount },
                                    { label: "Card", val: bill.split_card_amount },
                                    { label: "Other", val: bill.split_other_amount },
                                ]
                                    .filter((r) => parseFloat(String(r.val || 0)) > 0)
                                    .map((r) => (
                                        <div key={r.label} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{r.label}</span>
                                            <span className="font-semibold text-gray-900">
                                                {currencySymbol}{parseFloat(String(r.val)).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {bill.notes && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
                            <p className="text-sm text-gray-700">{bill.notes}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-200 flex gap-2">
                    <button
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Printer className="w-4 h-4" />
                        {isPrinting ? "Printing..." : "Print"}
                    </button>
                    {bill.customer_phone && (
                        <button
                            onClick={handleWhatsApp}
                            disabled={isSendingWhatsApp}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <MessageCircle className="w-4 h-4" />
                            {isSendingWhatsApp ? "Sending..." : "WhatsApp"}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
