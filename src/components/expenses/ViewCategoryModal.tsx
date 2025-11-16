"use client";

import React from "react";
import { X, Tag } from "lucide-react";

interface ViewCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: {
        id: number;
        name: string;
        description?: string;
        color?: string;
        icon?: string;
        is_active?: boolean;
        created_at?: string;
        updated_at?: string;
    } | null;
}

export default function ViewCategoryModal({
    isOpen,
    onClose,
    category,
}: ViewCategoryModalProps) {
    if (!isOpen || !category) return null;

    const created =
        category.created_at &&
        new Date(category.created_at).toLocaleString("en-US");
    const updated =
        category.updated_at &&
        new Date(category.updated_at).toLocaleString("en-US");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Tag className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Category Details
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Name
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {category.name}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Description
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {category.description || "-"}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Color
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <span
                                className="inline-block w-4 h-4 rounded"
                                style={{ background: category.color || "#ccc" }}
                            />
                            <span className="text-gray-900 dark:text-[#FAFAFA]">
                                {category.color || "-"}
                            </span>
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Icon
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {category.icon || "-"}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Status
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {category.is_active ? "Active" : "Inactive"}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Created
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {created || "-"}
                        </div>

                        <div className="text-gray-600 dark:text-[#A1A1AA]">
                            Updated
                        </div>
                        <div className="col-span-2 text-gray-900 dark:text-[#FAFAFA]">
                            {updated || "-"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#27272A]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-gray-300 dark:border-[#3F3F46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
