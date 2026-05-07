"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import OrderItem from "./OrderItem";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
}

interface OrderSidebarProps {
    items: OrderItem[];
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
    onClearOrder: () => void;
    onProceedToPayment: () => void;
}

export default function OrderSidebar({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearOrder,
    onProceedToPayment,
}: OrderSidebarProps) {
    const [taxPercentage, setTaxPercentage] = useState(18); // Default 18%
    const [currencySymbol, setCurrencySymbol] = useState("₹"); // Default ₹

    useEffect(() => {
        // Get settings from localStorage
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.tax_percentage?.value !== undefined) {
                    setTaxPercentage(settings.tax_percentage.value);
                }
                if (settings.currency_symbol?.value) {
                    setCurrencySymbol(settings.currency_symbol.value);
                }
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * (taxPercentage / 100);
    const total = subtotal + tax;

    return (
        <div className="w-full md:w-80 bg-white md:border-l border-gray-200 flex flex-col h-auto md:h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-[#eb1700]" />
                        Current Order
                    </h2>
                    {items.length > 0 && (
                        <button
                            onClick={onClearOrder}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Clear all items"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                    {items.length} item{items.length !== 1 ? "s" : ""} in order
                </p>
            </div>

            {/* Order Items */}
            <div className="modal-scroll flex-1 p-4 sm:p-6">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-3">
                            🛒
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            No items in order
                        </h3>
                        <p className="text-xs text-gray-500">
                            Add items from the menu to get started
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <OrderItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemoveItem}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Order Summary */}
            {items.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                Subtotal
                            </span>
                            <span className="text-gray-900">
                                {currencySymbol}
                                {subtotal.toFixed(2)}
                            </span>
                        </div>
                        {taxPercentage > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Tax ({taxPercentage}%)
                                </span>
                                <span className="text-gray-900">
                                    {currencySymbol}
                                    {tax.toFixed(2)}
                                </span>
                            </div>
                        )}
                        <div className="border-t border-gray-200 pt-2">
                            <div className="flex justify-between text-base font-semibold">
                                <span className="text-gray-900">
                                    Total
                                </span>
                                <span className="text-[#eb1700]">
                                    {currencySymbol}
                                    {total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onProceedToPayment}
                        className="w-full bg-[#eb1700] hover:bg-[#c41400] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                        Proceed to Payment
                    </button>
                </div>
            )}
        </div>
    );
}
