"use client";

import React, { useState, useEffect } from "react";
import { Combo } from "@/types/menu";

interface ComboCardProps {
    combo: Combo;
    onAddToOrder?: (combo: Combo) => void;
}

export default function ComboCard({ combo, onAddToOrder }: ComboCardProps) {
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
        <div
            className={`
                bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-4 transition-all duration-200 hover:shadow-lg hover:scale-105 hover:border-[#eb1700]/30 dark:hover:border-[#eb1700]/30 cursor-pointer
                ${!combo.is_available ? "opacity-50" : ""}
            `}
            onClick={() => combo.is_available && onAddToOrder?.(combo)}
        >
            <div className="mb-3">
                {/* Header with icon and availability badge */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center text-white text-lg">
                            🎁
                        </div>
                        {!combo.is_available && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">
                                Unavailable
                            </span>
                        )}
                    </div>
                </div>

                {/* Combo Name */}
                <h3 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1 line-clamp-1">
                    {combo.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mb-3 line-clamp-2 min-h-[2rem]">
                    {combo.description}
                </p>
            </div>

            {/* Items Count */}
            <div className="mb-3 pb-3 border-b border-gray-100 dark:border-[#27272A]">
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-[#A1A1AA]">
                    <span>📦</span>
                    <span>
                        {combo.items.length} item
                        {combo.items.length !== 1 ? "s" : ""} included
                    </span>
                </div>
                {/* Show first 2 items */}
                <div className="mt-2 space-y-1">
                    {combo.items.slice(0, 2).map((item, index) => (
                        <div
                            key={index}
                            className="text-xs text-gray-500 dark:text-[#71717A] flex items-center gap-1"
                        >
                            <span className="text-[#eb1700]">•</span>
                            <span>
                                {item.quantity}x {item.item_name}
                            </span>
                        </div>
                    ))}
                    {combo.items.length > 2 && (
                        <div className="text-xs text-gray-400 dark:text-[#52525B]">
                            +{combo.items.length - 2} more...
                        </div>
                    )}
                </div>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-lg font-bold text-[#eb1700]">
                        {currencySymbol}
                        {typeof combo.price === "number"
                            ? combo.price.toFixed(2)
                            : parseFloat(combo.price).toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                        Save{" "}
                        {typeof combo.profit_percentage === "number"
                            ? combo.profit_percentage.toFixed(0)
                            : parseFloat(combo.profit_percentage).toFixed(0)}
                        %
                    </div>
                </div>
                {combo.is_available && onAddToOrder && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToOrder(combo);
                        }}
                        className="bg-[#eb1700] hover:bg-[#c41400] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                        Add to Order
                    </button>
                )}
            </div>
        </div>
    );
}
