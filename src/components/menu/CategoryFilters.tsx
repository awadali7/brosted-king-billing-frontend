"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { CategoryInfo } from "@/types/menu";

interface CategoryFiltersProps {
    selectedCategory: number | undefined;
    onCategoryFilter: (categoryId?: number) => void;
}

export default function CategoryFilters({
    selectedCategory,
    onCategoryFilter,
}: CategoryFiltersProps) {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.menu.getCategories();
                setCategories(response.data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch categories");
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto px-4 py-2">
                <div className="flex gap-1 overflow-x-auto pb-2">
                    <div className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-[#27272A] text-gray-400 dark:text-[#A1A1AA] animate-pulse">
                        Loading categories...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto px-4 py-2">
                <div className="text-center text-red-500 dark:text-red-400 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-2">
            <div className="flex gap-1 overflow-x-auto pb-2">
                <button
                    onClick={() => onCategoryFilter(undefined)}
                    className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                        selectedCategory === undefined
                            ? "bg-[#eb1700] text-white shadow-sm"
                            : "bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#A1A1AA] hover:bg-gray-200 dark:hover:bg-[#3F3F46]"
                    }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryFilter(category.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                            selectedCategory === category.id
                                ? "bg-[#eb1700] text-white shadow-sm"
                                : "bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#A1A1AA] hover:bg-gray-200 dark:hover:bg-[#3F3F46]"
                        }`}
                        title={category.description}
                    >
                        {category.name}
                        {category.item_count && (
                            <span className="ml-1 text-sm opacity-75">
                                ({category.item_count})
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
