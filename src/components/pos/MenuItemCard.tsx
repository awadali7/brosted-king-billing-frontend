"use client";

import React, { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";

// Helper function to format numbers safely
const formatPrice = (value: any): string => {
    if (typeof value === "number") {
        return value.toFixed(2);
    }
    if (typeof value === "string") {
        const num = parseFloat(value);
        return isNaN(num) ? value : num.toFixed(2);
    }
    return String(value);
};

interface POSMenuItemCardProps {
    item: MenuItem;
    onAddToOrder?: (item: MenuItem) => void;
}

export default function POSMenuItemCard({
    item,
    onAddToOrder,
}: POSMenuItemCardProps) {
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
    return (
        <div className="group cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-[#eb1700]/30 hover:shadow-sm transition-all duration-200 overflow-hidden">
            {/* Image */}
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-2 left-2">
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.is_available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {item.is_available ? "Available" : "Unavailable"}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 flex-1">
                        {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-[#eb1700] ml-2">
                        {currencySymbol}
                        {formatPrice(item.price)}
                    </span>
                </div>

                {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                    </p>
                )}

                {/* Profit Information */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>
                        Cost: {currencySymbol}
                        {formatPrice(item.make_price)}
                    </span>
                    <span>
                        Profit: {currencySymbol}
                        {formatPrice(item.profit)} (
                        {formatPrice(item.profit_percentage)}%)
                    </span>
                </div>

                {/* Add to Order Button */}
                {item.is_available && onAddToOrder && (
                    <button
                        onClick={() => onAddToOrder(item)}
                        className="w-full bg-[#eb1700] hover:bg-[#c41400] text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25 focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:ring-offset-2"
                    >
                        Add to Order
                    </button>
                )}

                {!item.is_available && (
                    <div className="w-full bg-gray-100 text-gray-500 text-sm font-medium py-2 px-3 rounded-lg text-center">
                        Currently Unavailable
                    </div>
                )}
            </div>
        </div>
    );
}
