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
    payment_method: "cash" | "card" | "upi" | "other";
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

            // Reset form data to initial values
            setFormData({
                customer_name: "",
                customer_phone: "",
                customer_email: "",
                discount_percentage: 0,
                tax_percentage: defaultTaxPercentage,
                payment_method: "cash",
                notes: "",
            });
        }
    }, [isOpen]);

    const discountAmount = orderSubtotal * (formData.discount_percentage / 100);
    const subtotalAfterDiscount = orderSubtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (formData.tax_percentage / 100);
    const finalTotal = subtotalAfterDiscount + taxAmount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white dark:bg-[#18181B] rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] sm:max-h-[75vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46] bg-white dark:bg-[#18181B]">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                        Complete Payment
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
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
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">
                                Customer Information (Optional)
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
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
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
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
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        placeholder="919876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
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
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
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
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">
                                Payment Method
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {(
                                    ["cash", "card", "upi", "other"] as const
                                ).map((method) => (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() =>
                                            setFormData({
                                                ...formData,
                                                payment_method: method,
                                            })
                                        }
                                        className={`
                                            px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize
                                            ${
                                                formData.payment_method ===
                                                method
                                                    ? "bg-[#eb1700] text-white"
                                                    : "bg-gray-100 dark:bg-[#27272A] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-200 dark:hover:bg-[#3F3F46]"
                                            }
                                        `}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
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
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#0F0F0F] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent resize-none"
                                placeholder="Add any notes..."
                            />
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 dark:bg-[#0F0F0F] rounded-lg p-4 space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                                Order Summary
                            </h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-[#A1A1AA]">
                                    Subtotal
                                </span>
                                <span className="text-gray-900 dark:text-[#FAFAFA]">
                                    {currencySymbol}
                                    {orderSubtotal.toFixed(2)}
                                </span>
                            </div>
                            {formData.discount_percentage > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-[#A1A1AA]">
                                        Discount ({formData.discount_percentage}
                                        %)
                                    </span>
                                    <span className="text-green-600 dark:text-green-400">
                                        -{currencySymbol}
                                        {discountAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {taxPercentage > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-[#A1A1AA]">
                                        Tax ({taxPercentage}%)
                                    </span>
                                    <span className="text-gray-900 dark:text-[#FAFAFA]">
                                        {currencySymbol}
                                        {taxAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 dark:border-[#3F3F46] pt-2 mt-2">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-gray-900 dark:text-[#FAFAFA]">
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
                    <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-white dark:bg-[#18181B]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors disabled:opacity-50 font-medium"
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
