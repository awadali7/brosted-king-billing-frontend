"use client";

import React, { useEffect, useState } from "react";
import { X, Receipt } from "lucide-react";

interface ViewExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense: {
        id: number;
        amount: string;
        category_id: number;
        category_name?: string;
        category_color?: string;
        category_icon?: string;
        description: string;
        date: string;
        payment_method: string;
        vendor_name?: string;
        receipt_number?: string;
        notes?: string;
        created_at: string;
        updated_at: string;
    } | null;
}

export default function ViewExpenseModal({
    isOpen,
    onClose,
    expense,
}: ViewExpenseModalProps) {
    const [currencySymbol, setCurrencySymbol] = useState("₹");

    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (!settingsStr) return;
        try {
            const settings = JSON.parse(settingsStr);
            if (settings.currency_symbol?.value) {
                setCurrencySymbol(settings.currency_symbol.value);
            }
        } catch {
            // ignore
        }
    }, []);

    if (!isOpen || !expense) return null;

    const displayDate = new Date(expense.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const created = new Date(expense.created_at).toLocaleString("en-US");
    const updated = new Date(expense.updated_at).toLocaleString("en-US");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto modal-scroll">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46] sticky top-0 bg-white dark:bg-[#18181B] z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Expense Details
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-sm">
                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Amount
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA] font-semibold text-lg">
                            {currencySymbol}
                            {Number(expense.amount).toFixed(2)}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Date
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {displayDate}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Category
                        </div>
                        <div className="col-span-2">
                            <span
                                className="inline-block px-2 py-1 rounded text-gray-900 dark:text-[#FAFAFA]"
                                style={{
                                    background:
                                        expense.category_color || "#F3F4F6",
                                }}
                            >
                                {expense.category_name || `#${expense.category_id}`}
                            </span>
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Payment Method
                        </div>
                        <div className="col-span-2">
                            <span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-[#27272A] text-gray-700 dark:text-[#A1A1AA] uppercase text-xs">
                                {expense.payment_method}
                            </span>
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Description
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA] whitespace-pre-wrap">
                            {expense.description}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Vendor
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {expense.vendor_name || "-"}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Receipt #
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {expense.receipt_number || "-"}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Notes
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA] whitespace-pre-wrap">
                            {expense.notes || "-"}
                        </div>

                        <div className="col-span-3 border-t border-gray-200 dark:border-[#3F3F46] my-2"></div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Created
                        </div>
                        <div className="col-span-2 text-gray-700 dark:text-[#A1A1AA] text-xs">
                            {created}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA] font-medium">
                            Updated
                        </div>
                        <div className="col-span-2 text-gray-700 dark:text-[#A1A1AA] text-xs">
                            {updated}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#27272A] sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-gray-300 dark:border-[#3F3F46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

