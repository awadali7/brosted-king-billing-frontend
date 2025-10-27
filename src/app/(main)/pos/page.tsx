"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { CategoryInfo, CategoriesResponse, MenuItem } from "@/types/menu";
import POSLayout from "@/components/pos/POSLayout";
import CategoryGrid from "@/components/pos/CategoryGrid";
import MenuItemsGrid from "@/components/pos/MenuItemsGrid";
import OrderSidebar from "@/components/pos/OrderSidebar";
import LoadingState from "@/components/pos/LoadingState";
import ErrorState from "@/components/pos/ErrorState";

export default function PosPage() {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryInfo | null>(null);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [itemsError, setItemsError] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<
        Array<{
            id: number;
            name: string;
            price: number;
            quantity: number;
            total: number;
        }>
    >([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response: CategoriesResponse = await api.get("/categories");
            setCategories(response.data);
        } catch (err: any) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async (categoryId: number) => {
        try {
            setItemsLoading(true);
            setItemsError(null);
            const response = await api.menu.getItemsByCategory(
                categoryId,
                true
            );
            setItems(response.data);
        } catch (err: any) {
            console.error("Error fetching items:", err);
            setItemsError(err.message || "Failed to fetch items");
        } finally {
            setItemsLoading(false);
        }
    };

    const handleCategorySelect = (category: CategoryInfo) => {
        setSelectedCategory(category);
        fetchItems(category.id);
    };

    const handleAddToOrder = (item: MenuItem) => {
        const existingItem = orderItems.find(
            (orderItem) => orderItem.id === item.id
        );

        if (existingItem) {
            // Update quantity if item already exists
            setOrderItems((prev) =>
                prev.map((orderItem) =>
                    orderItem.id === item.id
                        ? {
                              ...orderItem,
                              quantity: orderItem.quantity + 1,
                              total: (orderItem.quantity + 1) * orderItem.price,
                          }
                        : orderItem
                )
            );
        } else {
            // Add new item to order
            setOrderItems((prev) => [
                ...prev,
                {
                    id: item.id,
                    name: item.name,
                    price:
                        typeof item.price === "number"
                            ? item.price
                            : parseFloat(item.price),
                    quantity: 1,
                    total:
                        typeof item.price === "number"
                            ? item.price
                            : parseFloat(item.price),
                },
            ]);
        }
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        setOrderItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity, total: quantity * item.price }
                    : item
            )
        );
    };

    const handleRemoveItem = (id: number) => {
        setOrderItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClearOrder = () => {
        setOrderItems([]);
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={fetchCategories} />;
    }

    return (
        <POSLayout
            sidebar={
                orderItems.length > 0 ? (
                    <OrderSidebar
                        items={orderItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onClearOrder={handleClearOrder}
                    />
                ) : null
            }
        >
            {!selectedCategory ? (
                <CategoryGrid
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                />
            ) : (
                <div>
                    {/* Back to Categories Button */}
                    <div className="mb-6 flex gap-3 items-center">
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setItems([]);
                                setItemsError(null);
                            }}
                            className="flex items-center gap-2 text-[#eb1700] hover:text-[#c41400] font-medium transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA] mt-2">
                            {selectedCategory.name}
                        </h1>
                    </div>

                    {/* Items Loading State */}
                    {itemsLoading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-[#A1A1AA]">
                                    Loading items...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Items Error State */}
                    {itemsError && (
                        <div className="text-center py-12">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                                Error Loading Items
                            </h3>
                            <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                                {itemsError}
                            </p>
                            <button
                                onClick={() => fetchItems(selectedCategory.id)}
                                className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Items Grid */}
                    {!itemsLoading && !itemsError && (
                        <MenuItemsGrid
                            items={items}
                            onAddToOrder={handleAddToOrder}
                        />
                    )}
                </div>
            )}
        </POSLayout>
    );
}
