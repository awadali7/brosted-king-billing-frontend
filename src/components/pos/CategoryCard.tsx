"use client";

import React from "react";
import { CategoryInfo } from "@/types/menu";

interface CategoryCardProps {
    category: CategoryInfo;
    isSelected: boolean;
    onSelect: (category: CategoryInfo) => void;
}

export default function CategoryCard({
    category,
    isSelected,
    onSelect,
}: CategoryCardProps) {
    return (
        <div
            onClick={() => onSelect(category)}
            className={`
                bg-white dark:bg-[#18181B] rounded-lg border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105
                ${
                    isSelected
                        ? "border-[#eb1700] bg-[#FEF2F2] dark:bg-[#2D1A1A] shadow-lg"
                        : "border-gray-200 dark:border-[#3F3F46] hover:border-[#eb1700]/30 dark:hover:border-[#eb1700]/30"
                }
            `}
        >
            <div className="text-center">
                <div
                    className={`
                        w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl
                        ${
                            isSelected
                                ? "bg-[#eb1700] text-white"
                                : "bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#A1A1AA]"
                        }
                    `}
                >
                    🍽️
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                    {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mb-4 line-clamp-2">
                    {category.description}
                </p>
                <div
                    className={`
                        text-xs px-3 py-1 rounded-full font-medium
                        ${
                            isSelected
                                ? "bg-[#eb1700]/10 text-[#eb1700] dark:bg-[#eb1700]/20 dark:text-[#eb1700]"
                                : "bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#A1A1AA]"
                        }
                    `}
                >
                    {isSelected ? "Selected" : "Click to select"}
                </div>
            </div>
        </div>
    );
}
