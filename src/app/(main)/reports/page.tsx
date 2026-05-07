"use client";

import React, { useState } from "react";
import SalesReport from "@/components/reports/SalesReport";
import DailyReport from "@/components/reports/DailyReport";
import MonthlyReport from "@/components/reports/MonthlyReport";
import ItemsPerformanceReport from "@/components/reports/ItemsPerformanceReport";
import ProfitLossReport from "@/components/reports/ProfitLossReport";
import GSTReport from "@/components/reports/GSTReport";

type ReportTab =
    | "sales"
    | "daily"
    | "monthly"
    | "items-performance"
    | "profit-loss"
    | "gst-tax";

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<ReportTab>("sales");

    const tabs = [
        {
            id: "sales" as ReportTab,
            label: "Sales Report",
            emoji: "💰",
            description: "View overall sales data",
        },
        {
            id: "daily" as ReportTab,
            label: "Daily Report",
            emoji: "📅",
            description: "Daily sales breakdown",
        },
        {
            id: "monthly" as ReportTab,
            label: "Monthly Report",
            emoji: "📊",
            description: "Monthly performance",
        },
        {
            id: "items-performance" as ReportTab,
            label: "Items Performance Report",
            emoji: "🏆",
            description: "Best & worst selling items",
        },
        {
            id: "profit-loss" as ReportTab,
            label: "Profit & Loss Statement",
            emoji: "📈",
            description: "Financial overview",
        },
        {
            id: "gst-tax" as ReportTab,
            label: "GST/Tax Report",
            emoji: "🧾",
            description: "Tax calculations",
        },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "sales":
                return <SalesReport />;
            case "daily":
                return <DailyReport />;
            case "monthly":
                return <MonthlyReport />;
            case "items-performance":
                return <ItemsPerformanceReport />;
            case "profit-loss":
                return <ProfitLossReport />;
            case "gst-tax":
                return <GSTReport />;
        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-white">
            {/* Tab Navigation - Fixed */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pt-6">
                <div className="px-6">
                    <nav className="-mb-px flex gap-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                                    ${
                                        activeTab === tab.id
                                            ? "border-[#eb1700] text-[#eb1700]"
                                            : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    <span>{tab.emoji}</span>
                                    <span>{tab.label}</span>
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-6 py-6">{renderTabContent()}</div>
        </div>
    );
}
