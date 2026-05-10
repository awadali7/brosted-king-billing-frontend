"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: PaymentData) => void;
    orderTotal: number;
    orderSubtotal: number;
    isProcessing?: boolean;
}

export interface PaymentData {
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    discount_percentage: number;
    tax_percentage: number;
    payment_method: "cash" | "card" | "upi" | "other" | "split";
    split_payments?: { cash: number; upi: number; card: number; other: number };
    notes?: string;
}

export default function PaymentModal({
    isOpen,
    onClose,
    onConfirm,
    orderTotal,
    orderSubtotal,
    isProcessing = false,
}: PaymentModalProps) {
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [taxPercentage, setTaxPercentage] = useState(18);
    const [splitAmounts, setSplitAmounts] = useState({ cash: 0, upi: 0, card: 0, other: 0 });
    const [formData, setFormData] = useState<PaymentData>({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        discount_percentage: 0,
        tax_percentage: 18,
        payment_method: "cash",
        notes: "",
    });

    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.currency_symbol?.value) {
                    setCurrencySymbol(settings.currency_symbol.value);
                }
                if (settings.tax_percentage?.value !== undefined) {
                    setTaxPercentage(settings.tax_percentage.value);
                    setFormData((prev) => ({
                        ...prev,
                        tax_percentage: settings.tax_percentage.value,
                    }));
                }
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }
    }, []);

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            // Get current tax percentage from settings for reset
            const settingsStr = localStorage.getItem("settings");
            let defaultTaxPercentage = 18;

            if (settingsStr) {
                try {
                    const settings = JSON.parse(settingsStr);
                    if (settings.tax_percentage?.value !== undefined) {
                        defaultTaxPercentage = settings.tax_percentage.value;
                    }
                } catch (error) {
                    console.error("Error parsing settings:", error);
                }
            }

            setFormData({
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                discount_percentage: 0,
                tax_percentage: defaultTaxPercentage,
                payment_method: "cash",
                notes: "",
            });
            setSplitAmounts({ cash: 0, upi: 0, card: 0, other: 0 });
        }
    }, [isOpen]);

    const discountAmount = orderSubtotal * (formData.discount_percentage / 100);
    const subtotalAfterDiscount = orderSubtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (formData.tax_percentage / 100);
    const finalTotal = subtotalAfterDiscount + taxAmount;

    const splitTotal = splitAmounts.cash + splitAmounts.upi + splitAmounts.card + splitAmounts.other;
    const splitRemaining = Math.round((finalTotal - splitTotal) * 100) / 100;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.payment_method === "split") {
            if (splitTotal === 0) {
                alert("Please enter split payment amounts.");
                return;
            }
            if (Math.abs(splitRemaining) > 0.01) {
                const fmt = (v: number) => `${currencySymbol}${v.toFixed(2)}`;
                alert(`Split amounts must equal total. ${splitRemaining > 0 ? `${fmt(splitRemaining)} still remaining.` : `${fmt(Math.abs(splitRemaining))} over total.`}`);
                return;
            }
            onConfirm({ ...formData, split_payments: splitAmounts });
            return;
        }
        onConfirm(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] sm:max-h-[75vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Complete Payment
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden"
                >
                    {/* Scrollable Content */}
                    <div className="modal-scroll p-4 space-y-4 flex-1">
                        {/* Customer Information & Discount - 2 Column Grid */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Customer Information (Optional)
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customer_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customer_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.customer_phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customer_phone: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        placeholder="919876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.customer_email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customer_email: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={formData.discount_percentage}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                discount_percentage:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Payment Method
                            </h3>
                            <div className="grid grid-cols-5 gap-2">
                                {(["cash", "card", "upi", "other", "split"] as const).map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, payment_method: method });
                                            if (method !== "split") setSplitAmounts({ cash: 0, upi: 0, card: 0, other: 0 });
                                        }}
                                        className={`px-2 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                                            formData.payment_method === method
                                                ? "bg-[#eb1700] text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {method === "split" ? "Split" : method}
                                    </button>
                                ))}
                            </div>

                            {formData.payment_method === "split" && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2">
                                    <p className="text-xs font-semibold text-gray-600">Enter amount per payment method:</p>
                                    {(["cash", "upi", "card", "other"] as const).map((m) => (
                                        <div key={m} className="flex items-center gap-2">
                                            <label className="text-sm text-gray-700 capitalize w-10">{m}</label>
                                            <div className="relative flex-1">
                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">{currencySymbol}</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={splitAmounts[m] || ""}
                                                    onChange={(e) => setSplitAmounts((prev) => ({ ...prev, [m]: parseFloat(e.target.value) || 0 }))}
                                                    placeholder="0"
                                                    className="w-full pl-6 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className={`flex justify-between text-sm font-semibold pt-2 border-t border-gray-200 ${
                                        splitRemaining === 0 ? "text-green-600" : splitRemaining < 0 ? "text-red-600" : "text-orange-600"
                                    }`}>
                                        <span>Remaining</span>
                                        <span>
                                            {splitRemaining === 0
                                                ? `${currencySymbol}0.00 ✓`
                                                : splitRemaining > 0
                                                ? `${currencySymbol}${splitRemaining.toFixed(2)} to collect`
                                                : `${currencySymbol}${Math.abs(splitRemaining).toFixed(2)} over`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notes: e.target.value,
                                    })
                                }
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent resize-none"
                                placeholder="Add any notes..."
                            />
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                Order Summary
                            </h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Subtotal
                                </span>
                                <span className="text-gray-900">
                                    {currencySymbol}
                                    {orderSubtotal.toFixed(2)}
                                </span>
                            </div>
                            {formData.discount_percentage > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Discount ({formData.discount_percentage}
                                        %)
                                    </span>
                                    <span className="text-green-600">
                                        -{currencySymbol}
                                        {discountAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {taxPercentage > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Tax ({taxPercentage}%)
                                    </span>
                                    <span className="text-gray-900">
                                        {currencySymbol}
                                        {taxAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-[#eb1700]">
                                        {currencySymbol}
                                        {finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Fixed at Bottom */}
                    <div className="flex gap-3 p-4 border-t border-gray-200 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2.5 bg-[#eb1700] hover:bg-[#c41400] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? "Processing..." : "Create Bill"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
