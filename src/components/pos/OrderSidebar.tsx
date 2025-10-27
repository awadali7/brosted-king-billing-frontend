"use client";

import React from "react";
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
}

export default function OrderSidebar({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearOrder,
}: OrderSidebarProps) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + tax;

    return (
        <div className="w-80 bg-white dark:bg-[#0F0F0F] border-l border-gray-200 dark:border-[#3F3F46] flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] flex items-center gap-2">
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
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA] mt-0.5">
                    {items.length} item{items.length !== 1 ? "s" : ""} in order
                </p>
            </div>

            {/* Order Items */}
            <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-[#A1A1AA] text-4xl mb-3">
                            🛒
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1">
                            No items in order
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
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
                <div className="p-6 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#18181B]">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-[#A1A1AA]">
                                Subtotal
                            </span>
                            <span className="text-gray-900 dark:text-[#FAFAFA]">
                                ₹{subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-[#A1A1AA]">
                                Tax (18%)
                            </span>
                            <span className="text-gray-900 dark:text-[#FAFAFA]">
                                ₹{tax.toFixed(2)}
                            </span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-[#3F3F46] pt-2">
                            <div className="flex justify-between text-base font-semibold">
                                <span className="text-gray-900 dark:text-[#FAFAFA]">
                                    Total
                                </span>
                                <span className="text-[#eb1700]">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-[#eb1700] hover:bg-[#c41400] text-white font-medium py-3 px-4 rounded-lg transition-colors">
                        Proceed to Payment
                    </button>
                </div>
            )}
        </div>
    );
}
