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
                bg-white rounded-lg border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105
                ${
                    isSelected
                        ? "border-[#eb1700] bg-[#FEF2F2] shadow-lg"
                        : "border-gray-200 hover:border-[#eb1700]/30"
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
                                : "bg-gray-100 text-gray-600"
                        }
                    `}
                >
                    🍽️
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                </p>
                <div
                    className={`
                        text-xs px-3 py-1 rounded-full font-medium
                        ${
                            isSelected
                                ? "bg-[#eb1700]/10 text-[#eb1700]"
                                : "bg-gray-100 text-gray-600"
                        }
                    `}
                >
                    {isSelected ? "Selected" : "Click to select"}
                </div>
            </div>
        </div>
    );
}
