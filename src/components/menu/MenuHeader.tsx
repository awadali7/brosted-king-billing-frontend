"use client";

import React from "react";
import { Plus, Package } from "lucide-react";

interface MenuHeaderProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateClick?: () => void;
    onCreateComboClick?: () => void;
    activeTab?: "items" | "combos";
    onTabChange?: (tab: "items" | "combos") => void;
    itemsCount?: number;
    combosCount?: number;
}

export default function MenuHeader({
    searchQuery,
    onSearchChange,
    onCreateClick,
    onCreateComboClick,
    activeTab = "items",
    onTabChange,
    itemsCount = 0,
    combosCount = 0,
}: MenuHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-gray-200 dark:border-[#3F3F46]">
            <div className=" mx-auto px-4 py-3">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                    {/* Left Side - Tab Switch */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onTabChange?.("items")}
                            className={`
                                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                                ${
                                    activeTab === "items"
                                        ? "border-[#eb1700] text-[#eb1700]"
                                        : "border-transparent text-gray-600 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#FAFAFA] hover:border-gray-300 dark:hover:border-[#52525B]"
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <span>📂</span>
                                <span>Menu Items</span>
                                {itemsCount > 0 && (
                                    <span className="ml-1 rounded-full bg-gray-100 dark:bg-[#27272A] px-2 py-0.5 text-xs">
                                        {itemsCount}
                                    </span>
                                )}
                            </span>
                        </button>
                        <button
                            onClick={() => onTabChange?.("combos")}
                            className={`
                                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                                ${
                                    activeTab === "combos"
                                        ? "border-[#eb1700] text-[#eb1700]"
                                        : "border-transparent text-gray-600 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#FAFAFA] hover:border-gray-300 dark:hover:border-[#52525B]"
                                }
                            `}
                        >
                            <span className="flex items-center gap-2">
                                <span>🎁</span>
                                <span>Combo Deals</span>
                                {combosCount > 0 && (
                                    <span className="ml-1 rounded-full bg-gray-100 dark:bg-[#27272A] px-2 py-0.5 text-xs">
                                        {combosCount}
                                    </span>
                                )}
                            </span>
                        </button>
                    </div>

                    {/* Right Side - Search and Buttons */}
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
                            onClick={onCreateComboClick}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0F0F0F] border-2 border-[#eb1700] text-[#eb1700] hover:bg-[#eb1700] hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25  dark:focus:ring-offset-[#0F0F0F]"
                        >
                            <Package className="w-4 h-4" />
                            Add Combo
                        </button>
                        <button
                            onClick={onCreateClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[#eb1700] hover:bg-[#c41400] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25  dark:focus:ring-offset-[#0F0F0F]"
                        >
                            <Plus className="w-4 h-4" />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-3">
                    {/* Tab Switch */}
                    <div className="flex items-center gap-4 border-b border-gray-200 dark:border-[#3F3F46]">
                        <button
                            onClick={() => onTabChange?.("items")}
                            className={`
                                py-2 px-1 border-b-2 font-medium text-sm transition-colors flex-1
                                ${
                                    activeTab === "items"
                                        ? "border-[#eb1700] text-[#eb1700]"
                                        : "border-transparent text-gray-600 dark:text-[#A1A1AA]"
                                }
                            `}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>📂</span>
                                <span>Items</span>
                                {itemsCount > 0 && (
                                    <span className="rounded-full bg-gray-100 dark:bg-[#27272A] px-2 py-0.5 text-xs">
                                        {itemsCount}
                                    </span>
                                )}
                            </span>
                        </button>
                        <button
                            onClick={() => onTabChange?.("combos")}
                            className={`
                                py-2 px-1 border-b-2 font-medium text-sm transition-colors flex-1
                                ${
                                    activeTab === "combos"
                                        ? "border-[#eb1700] text-[#eb1700]"
                                        : "border-transparent text-gray-600 dark:text-[#A1A1AA]"
                                }
                            `}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>🎁</span>
                                <span>Combos</span>
                                {combosCount > 0 && (
                                    <span className="rounded-full bg-gray-100 dark:bg-[#27272A] px-2 py-0.5 text-xs">
                                        {combosCount}
                                    </span>
                                )}
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onCreateComboClick}
                                className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#0F0F0F] border-2 border-[#eb1700] text-[#eb1700] hover:bg-[#eb1700] hover:text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25  dark:focus:ring-offset-[#0F0F0F]"
                            >
                                <Package className="w-4 h-4" />
                                <span className="hidden sm:inline">Combo</span>
                            </button>
                            <button
                                onClick={onCreateClick}
                                className="flex items-center gap-1 px-3 py-2 bg-[#eb1700] hover:bg-[#c41400] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25  dark:focus:ring-offset-[#0F0F0F]"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Item</span>
                            </button>
                        </div>
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
