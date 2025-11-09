"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";

interface Bill {
    id: number;
    bill_number: string;
    customer_name: string;
    total_amount: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
}

interface RecentBillsTableProps {
    bills: Bill[];
}

export default function RecentBillsTable({ bills }: RecentBillsTableProps) {
    const [currencySymbol, setCurrencySymbol] = useState("₹");

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    if (bills.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 dark:text-[#A1A1AA] text-4xl mb-3">
                    📄
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1">
                    No Bills Yet
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    Bills will appear here once created
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-[#3F3F46]">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Bill #
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Customer
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Amount
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Payment
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Status
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Date
                        </th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-[#A1A1AA] uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill) => (
                        <tr
                            key={bill.id}
                            className="border-b border-gray-100 dark:border-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                        >
                            <td className="py-3 px-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                                    {bill.bill_number}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm text-gray-700 dark:text-[#A1A1AA]">
                                    {bill.customer_name || "Guest"}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {currencySymbol}
                                    {parseFloat(bill.total_amount).toFixed(2)}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-sm text-gray-700 dark:text-[#A1A1AA] capitalize">
                                    {bill.payment_method}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                        bill.payment_status
                                    )}`}
                                >
                                    {bill.payment_status}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className="text-xs text-gray-600 dark:text-[#A1A1AA]">
                                    {formatDate(bill.created_at)}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                                <button
                                    className="p-1.5 text-gray-400 hover:text-[#eb1700] transition-colors"
                                    title="View Bill"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
