"use client";

import { useState } from "react";

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "billing", label: "Billing", icon: "🧾" },
    { id: "menu", label: "Menu", icon: "🍽️" },
    { id: "categories", label: "Categories", icon: "🏷️" },
    { id: "combos", label: "Combos", icon: "📦" },
    { id: "expenses", label: "Expenses", icon: "💸" },
    { id: "income", label: "Income", icon: "💰" },
    { id: "reports", label: "Reports", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
    { id: "users", label: "Users", icon: "👥" },
];

export default function Sidebar({
    activePage,
    onNavigate,
    onLogout,
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={`bg-white shadow-lg transition-all duration-300 ${
                isCollapsed ? "w-16" : "w-64"
            } min-h-screen sticky top-0`}
        >
            <div className="p-4">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                Restaurant
                            </h1>
                            <p className="text-xs text-gray-500">Billing</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="ml-auto p-1 hover:bg-gray-100 rounded"
                    >
                        <svg
                            className={`w-4 h-4 text-gray-600 transition-transform ${
                                isCollapsed ? "rotate-180" : ""
                            }`}
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
                    </button>
                </div>

                {/* Search */}
                {!isCollapsed && (
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                activePage === item.id
                                    ? "bg-orange-50 text-orange-600 border border-orange-200"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {!isCollapsed && (
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        {!isCollapsed && (
                            <span className="font-medium">Log out</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
