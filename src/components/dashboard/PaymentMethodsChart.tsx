"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Banknote, Smartphone, DollarSign } from "lucide-react";

interface PaymentMethod {
    payment_method: string;
    count: string;
    total: string;
}

interface PaymentMethodsChartProps {
    data: PaymentMethod[];
}

export default function PaymentMethodsChart({
    data,
}: PaymentMethodsChartProps) {
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

    if (data.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 dark:text-[#A1A1AA] text-4xl mb-3">
                    💳
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1">
                    No Payment Data
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    Payment methods will appear here
                </p>
            </div>
        );
    }

    const getIcon = (method: string) => {
        switch (method.toLowerCase()) {
            case "cash":
                return Banknote;
            case "card":
                return CreditCard;
            case "upi":
                return Smartphone;
            default:
                return DollarSign;
        }
    };

    const getColor = (method: string) => {
        switch (method.toLowerCase()) {
            case "cash":
                return {
                    bg: "bg-green-50 dark:bg-green-900/10",
                    text: "text-green-600 dark:text-green-400",
                    border: "border-green-200 dark:border-green-900/30",
                };
            case "card":
                return {
                    bg: "bg-blue-50 dark:bg-blue-900/10",
                    text: "text-blue-600 dark:text-blue-400",
                    border: "border-blue-200 dark:border-blue-900/30",
                };
            case "upi":
                return {
                    bg: "bg-purple-50 dark:bg-purple-900/10",
                    text: "text-purple-600 dark:text-purple-400",
                    border: "border-purple-200 dark:border-purple-900/30",
                };
            default:
                return {
                    bg: "bg-gray-50 dark:bg-gray-900/10",
                    text: "text-gray-600 dark:text-gray-400",
                    border: "border-gray-200 dark:border-gray-900/30",
                };
        }
    };

    // Calculate total for percentages
    const totalAmount = data.reduce(
        (sum, item) => sum + parseFloat(item.total),
        0
    );

    return (
        <div className="space-y-4">
            {data.map((method, index) => {
                const Icon = getIcon(method.payment_method);
                const colors = getColor(method.payment_method);
                const amount = parseFloat(method.total);
                const percentage = ((amount / totalAmount) * 100).toFixed(1);

                return (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border ${colors.border} ${colors.bg} transition-all duration-200 hover:shadow-md`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${colors.text} bg-white dark:bg-[#18181B]`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] capitalize">
                                        {method.payment_method}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-[#A1A1AA]">
                                        {method.count} transaction
                                        {parseInt(method.count) !== 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-[#FAFAFA]">
                                    {currencySymbol}
                                    {amount.toFixed(2)}
                                </p>
                                <p
                                    className={`text-xs font-medium ${colors.text}`}
                                >
                                    {percentage}%
                                </p>
                            </div>
                        </div>
                        <div className="w-full bg-white dark:bg-[#27272A] rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${colors.text.replace(
                                    "text-",
                                    "bg-"
                                )}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
