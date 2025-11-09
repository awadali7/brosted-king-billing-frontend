"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Printer, X, MessageCircle } from "lucide-react";

interface BillSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    billNumber: string;
    billId: number;
    total: number;
    customerPhone?: string;
    onPrint: () => void;
    onWhatsApp?: () => void;
    isPrinting?: boolean;
    isSendingWhatsApp?: boolean;
}

export default function BillSuccessModal({
    isOpen,
    onClose,
    billNumber,
    billId,
    total,
    customerPhone,
    onPrint,
    onWhatsApp,
    isPrinting = false,
    isSendingWhatsApp = false,
}: BillSuccessModalProps) {
    const [currencySymbol, setCurrencySymbol] = useState("₹");

    // Ensure total is a number
    const totalAmount =
        typeof total === "number" ? total : parseFloat(total) || 0;

    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.currency_symbol?.value) {
                    setCurrencySymbol(settings.currency_symbol.value);
                }
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#18181B] rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                        Bill Created Successfully
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                        Payment Successful!
                    </h3>
                    <p className="text-gray-600 dark:text-[#A1A1AA] mb-6">
                        Your bill has been created successfully
                    </p>

                    {/* Bill Details */}
                    <div className="bg-gray-50 dark:bg-[#0F0F0F] rounded-lg p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-[#A1A1AA]">
                                Bill Number
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                {billNumber}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-[#A1A1AA]">
                                Bill ID
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                #{billId}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-[#3F3F46] pt-2 mt-2">
                            <div className="flex justify-between">
                                <span className="text-gray-900 dark:text-[#FAFAFA] font-semibold">
                                    Total Amount
                                </span>
                                <span className="text-[#eb1700] font-bold text-lg">
                                    {currencySymbol}
                                    {totalAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onPrint}
                            disabled={isPrinting}
                            className="w-full flex items-center justify-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Printer className="w-4 h-4" />
                            {isPrinting ? "Printing..." : "Print Bill"}
                        </button>

                        {/* WhatsApp Button - Only show if customer phone is provided */}
                        {customerPhone && onWhatsApp && (
                            <button
                                onClick={onWhatsApp}
                                disabled={isSendingWhatsApp}
                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MessageCircle className="w-4 h-4" />
                                {isSendingWhatsApp
                                    ? "Sending..."
                                    : "Send via WhatsApp"}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                        >
                            Close & New Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
