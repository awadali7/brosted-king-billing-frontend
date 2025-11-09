"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
    item: MenuItem & { categoryName?: string };
    onEdit?: (item: MenuItem) => void;
    onDelete?: (item: MenuItem) => void;
}

export default function MenuItemCard({
    item,
    onEdit,
    onDelete,
}: MenuItemCardProps) {
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
        <div className="group cursor-pointer bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] hover:border-[#eb1700]/30 dark:hover:border-[#eb1700]/30 hover:shadow-sm transition-all duration-200 overflow-hidden">
            {/* Compact image */}
            <div className="aspect-square bg-gray-50 dark:bg-[#27272A] relative overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-300 dark:text-[#A1A1AA]"
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

                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(item);
                            }}
                            className="p-1.5 bg-white dark:bg-[#18181B] rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#eb1700] hover:text-white"
                            title="Edit item"
                        >
                            <Edit className="w-3 h-3 text-gray-600 dark:text-[#A1A1AA] hover:text-white" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item);
                            }}
                            className="p-1.5 bg-white dark:bg-[#18181B] rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-red-500 hover:text-white"
                            title="Delete item"
                        >
                            <Trash2 className="w-3 h-3 text-gray-600 dark:text-[#A1A1AA] hover:text-white" />
                        </button>
                    )}
                </div>
            </div>

            {/* Ultra-compact content */}
            <div className="p-3">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] line-clamp-1 flex-1">
                        {item.name}
                    </h3>
                    <span className="text-sm font-semibold text-[#eb1700] ml-2">
                        {currencySymbol}
                        {item.price.toFixed(2)}
                    </span>
                </div>
                {item.description && (
                    <p className="text-xs text-gray-500 dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
                        {item.description}
                    </p>
                )}
                {item.categoryName && (
                    <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#A1A1AA] rounded-full">
                            {item.categoryName}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
