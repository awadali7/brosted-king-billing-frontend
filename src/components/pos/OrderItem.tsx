"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

interface OrderItemProps {
    item: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        total: number;
    };
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export default function OrderItem({
    item,
    onUpdateQuantity,
    onRemove,
}: OrderItemProps) {
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
    const handleIncrement = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        } else {
            onRemove(item.id);
        }
    };

    const handleRemove = () => {
        onRemove(item.id);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {currencySymbol}
                        {item.price.toFixed(2)} each
                    </p>
                </div>
                <button
                    onClick={handleRemove}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDecrement}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Decrease quantity"
                    >
                        <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Increase quantity"
                    >
                        <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                </div>
                <span className="text-sm font-semibold text-[#eb1700]">
                    {currencySymbol}
                    {item.total.toFixed(2)}
                </span>
            </div>
        </div>
    );
}
