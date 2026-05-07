"use client";

import React from "react";
import { CategoryInfo } from "@/types/menu";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
    categories: CategoryInfo[];
    selectedCategory: CategoryInfo | null;
    onCategorySelect: (category: CategoryInfo) => void;
}

export default function CategoryGrid({
    categories,
    selectedCategory,
    onCategorySelect,
}: CategoryGridProps) {
    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                    📂
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Categories Found
                </h3>
                <p className="text-gray-600">
                    Create some categories in the menu section to get started.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Select Category
                </h2>
                <p className="text-gray-600">
                    Choose a category to view and add items to the order
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-3 sm:p-4 md:p-5 gap-4 sm:gap-6">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        isSelected={selectedCategory?.id === category.id}
                        onSelect={onCategorySelect}
                    />
                ))}
            </div>
        </>
    );
}
