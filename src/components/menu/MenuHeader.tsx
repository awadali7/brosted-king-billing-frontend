"use client";

import React from "react";
import { Plus } from "lucide-react";

interface MenuHeaderProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateClick?: () => void;
}

export default function MenuHeader({
    searchQuery,
    onSearchChange,
    onCreateClick,
}: MenuHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-gray-200 dark:border-[#3F3F46]">
            <div className="max-w-7xl mx-auto px-4 py-3">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                    <h1 className="text-2xl font-medium text-gray-900 dark:text-[#FAFAFA]">
                        Menu
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="w-80">
                            <input
                                type="text"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={onSearchChange}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-[#3F3F46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-all text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]"
                            />
                        </div>
                        <button
                            onClick={onCreateClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[#eb1700] hover:bg-[#c41400] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25 focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:ring-offset-2 dark:focus:ring-offset-[#0F0F0F]"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-medium text-gray-900 dark:text-[#FAFAFA]">
                            Menu
                        </h1>
                        <button
                            onClick={onCreateClick}
                            className="flex items-center gap-1 px-3 py-2 bg-[#eb1700] hover:bg-[#c41400] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25 focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:ring-offset-2 dark:focus:ring-offset-[#0F0F0F]"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Item</span>
                        </button>
                    </div>
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Search menu..."
                            value={searchQuery}
                            onChange={onSearchChange}
                            className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-[#3F3F46] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-all text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
