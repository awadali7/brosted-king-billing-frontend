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
                <div className="text-gray-400 text-4xl mb-3">
                    💳
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No Payment Data
                </h3>
                <p className="text-xs text-gray-500">
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
                    bg: "bg-green-50",
                    text: "text-green-600",
                    border: "border-green-200",
                };
            case "card":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-600",
                    border: "border-blue-200",
                };
            case "upi":
                return {
                    bg: "bg-purple-50",
                    text: "text-purple-600",
                    border: "border-purple-200",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-600",
                    border: "border-gray-200",
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
                                    className={`p-2 rounded-lg ${colors.text} bg-white}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 capitalize">
                                        {method.payment_method}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        {method.count} transaction
                                        {parseInt(method.count) !== 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">
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
                        <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
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
