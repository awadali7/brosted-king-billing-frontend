"use client";

import React from "react";
import { MenuResponse, MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuGridProps {
    menuData: MenuResponse;
    selectedCategory: number | undefined;
    allItems: (MenuItem & { categoryName?: string; categoryId?: number })[];
    onEditItem?: (item: MenuItem) => void;
    onDeleteItem?: (item: MenuItem) => void;
}

export default function MenuGrid({
    menuData,
    selectedCategory,
    allItems,
    onEditItem,
    onDeleteItem,
}: MenuGridProps) {
    if (allItems.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400 dark:text-[#A1A1AA] text-sm">
                No menu items found
            </div>
        );
    }

    return (
        <div className="  mx-auto px-4 py-4">
            {selectedCategory === undefined ? (
                // Show all items in one compact grid
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {allItems.map((item) => (
                        <MenuItemCard
                            key={item.id}
                            item={item}
                            onEdit={onEditItem}
                            onDelete={onDeleteItem}
                        />
                    ))}
                </div>
            ) : (
                // Show by category - group filtered items by category
                <div className="space-y-8">
                    {menuData.data.categories
                        .filter((category) =>
                            allItems.some(
                                (item) =>
                                    item.categoryId === category.category_id
                            )
                        )
                        .map((category) => {
                            const categoryItems = allItems.filter(
                                (item) =>
                                    item.categoryId === category.category_id
                            );

                            return (
                                <div key={category.category_id}>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-[#FAFAFA] mb-4">
                                        {category.category_name}
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                        {categoryItems.map((item) => (
                                            <MenuItemCard
                                                key={item.id}
                                                item={item}
                                                onEdit={onEditItem}
                                                onDelete={onDeleteItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
