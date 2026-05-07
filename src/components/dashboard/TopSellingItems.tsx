"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

interface TopItem {
    item_name: string;
    quantity_sold: string;
    revenue: string;
}

interface TopSellingItemsProps {
    items: TopItem[];
}

export default function TopSellingItems({ items }: TopSellingItemsProps) {
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
                <div className="text-gray-400 text-4xl mb-3">
                    📊
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No Sales Data
                </h3>
                <p className="text-xs text-gray-500">
                    Start selling to see top items
                </p>
            </div>
        );
    }

    // Calculate max quantity for progress bar
    const maxQuantity = Math.max(
        ...items.map((item) => parseInt(item.quantity_sold))
    );

    return (
        <div className="space-y-4">
            {items.map((item, index) => {
                const quantity = parseInt(item.quantity_sold);
                const percentage = (quantity / maxQuantity) * 100;

                return (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#eb1700]/10 text-[#eb1700] text-xs font-bold">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {item.item_name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {quantity} sold
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-[#eb1700] ml-2">
                                {currencySymbol}
                                {parseFloat(item.revenue).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[#eb1700] to-[#c41400] h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
