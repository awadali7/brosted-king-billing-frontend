"use client";

import React from "react";
import { MenuItem } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuItemsGridProps {
    items: MenuItem[];
    onAddToOrder?: (item: MenuItem) => void;
}

export default function MenuItemsGrid({
    items,
    onAddToOrder,
}: MenuItemsGridProps) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                    🍽️
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Items Found
                </h3>
                <p className="text-gray-600">
                    No menu items available in this category.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
                <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToOrder={onAddToOrder}
                />
            ))}
        </div>
    );
}
