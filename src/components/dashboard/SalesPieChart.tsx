"use client";

import React, { useState, useEffect } from "react";

interface TopItem {
    item_name: string;
    quantity_sold: string;
    revenue: string;
}

interface SalesPieChartProps {
    items: TopItem[];
}

export default function SalesPieChart({ items }: SalesPieChartProps) {
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

    if (items.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 dark:text-[#A1A1AA] text-4xl mb-3">
                    📊
                </div>
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    No sales data available
                </p>
            </div>
        );
    }

    // Calculate total revenue
    const totalRevenue = items.reduce(
        (sum, item) => sum + parseFloat(item.revenue),
        0
    );

    // Generate colors for each item
    const colors = [
        "#eb1700", // Red
        "#f97316", // Orange
        "#eab308", // Yellow
        "#84cc16", // Lime
        "#06b6d4", // Cyan
    ];

    // Calculate percentages and cumulative angles
    let cumulativePercentage = 0;
    const itemsWithAngles = items.map((item, index) => {
        const revenue = parseFloat(item.revenue);
        const percentage = (revenue / totalRevenue) * 100;
        const startAngle = cumulativePercentage * 3.6; // Convert to degrees
        cumulativePercentage += percentage;
        const endAngle = cumulativePercentage * 3.6;

        return {
            ...item,
            percentage,
            startAngle,
            endAngle,
            color: colors[index % colors.length],
        };
    });

    // Create conic-gradient for pie chart
    const createGradient = () => {
        let gradient = "conic-gradient(";
        itemsWithAngles.forEach((item, index) => {
            gradient += `${item.color} ${item.startAngle}deg ${item.endAngle}deg`;
            if (index < itemsWithAngles.length - 1) {
                gradient += ", ";
            }
        });
        gradient += ")";
        return gradient;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Pie Chart */}
            <div className="relative flex items-center justify-center">
                <div
                    className="w-48 h-48 rounded-full shadow-lg"
                    style={{
                        background: createGradient(),
                    }}
                >
                    {/* Center circle for donut effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-white dark:bg-[#18181B] flex flex-col items-center justify-center shadow-inner">
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Total
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                                {currencySymbol}
                                {totalRevenue.toFixed(0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2 w-full">
                {itemsWithAngles.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">
                                    {item.item_name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                    {item.quantity_sold} sold
                                </p>
                            </div>
                        </div>
                        <div className="text-right ml-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                {item.percentage.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                {currencySymbol}
                                {parseFloat(item.revenue).toFixed(0)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
