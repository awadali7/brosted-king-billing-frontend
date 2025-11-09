"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Banknote, Smartphone, DollarSign } from "lucide-react";

interface PaymentMethod {
    payment_method: string;
    count: string;
    total: string;
}

interface PaymentMethodsPieChartProps {
    data: PaymentMethod[];
}

export default function PaymentMethodsPieChart({
    data,
}: PaymentMethodsPieChartProps) {
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
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    No payment data available
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
                return "#10b981"; // Green
            case "card":
                return "#3b82f6"; // Blue
            case "upi":
                return "#a855f7"; // Purple
            default:
                return "#6b7280"; // Gray
        }
    };

    // Calculate total amount
    const totalAmount = data.reduce(
        (sum, item) => sum + parseFloat(item.total),
        0
    );

    // Calculate total transactions
    const totalTransactions = data.reduce(
        (sum, item) => sum + parseInt(item.count),
        0
    );

    // Calculate percentages and cumulative angles
    let cumulativePercentage = 0;
    const methodsWithAngles = data.map((method) => {
        const amount = parseFloat(method.total);
        const percentage = (amount / totalAmount) * 100;
        const startAngle = cumulativePercentage * 3.6; // Convert to degrees
        cumulativePercentage += percentage;
        const endAngle = cumulativePercentage * 3.6;

        return {
            ...method,
            percentage,
            startAngle,
            endAngle,
            color: getColor(method.payment_method),
        };
    });

    // Create conic-gradient for pie chart
    const createGradient = () => {
        let gradient = "conic-gradient(";
        methodsWithAngles.forEach((method, index) => {
            gradient += `${method.color} ${method.startAngle}deg ${method.endAngle}deg`;
            if (index < methodsWithAngles.length - 1) {
                gradient += ", ";
            }
        });
        gradient += ")";
        return gradient;
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Pie Chart */}
            <div className="relative flex items-center justify-center">
                <div
                    className="w-40 h-40 rounded-full shadow-lg"
                    style={{
                        background: createGradient(),
                    }}
                >
                    {/* Center circle for donut effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-[#18181B] flex flex-col items-center justify-center shadow-inner">
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Total
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-[#FAFAFA]">
                                {totalTransactions}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                bills
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2">
                {methodsWithAngles.map((method, index) => {
                    const Icon = getIcon(method.payment_method);
                    return (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: method.color }}
                                />
                                <Icon
                                    className="w-4 h-4 flex-shrink-0"
                                    style={{ color: method.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 dark:text-[#FAFAFA] capitalize truncate">
                                        {method.payment_method}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                        {method.count} bill
                                        {parseInt(method.count) !== 1
                                            ? "s"
                                            : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right ml-2">
                                <p className="text-xs font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {method.percentage.toFixed(1)}%
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                    {currencySymbol}
                                    {parseFloat(method.total).toFixed(0)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
