"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/utils/api";
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    BarChart3,
    Package,
    Plus,
    Calendar,
} from "lucide-react";

import RecentBillsTable from "@/components/dashboard/RecentBillsTable";
import SalesPieChart from "@/components/dashboard/SalesPieChart";
import PaymentMethodsPieChart from "@/components/dashboard/PaymentMethodsPieChart";

interface DashboardData {
    date: string;
    today: {
        revenue: number;
        extra_income: number;
        total_income: number;
        expenses: number;
        profit: number;
        profit_margin: string;
        bills: {
            total: number;
            paid: number;
            pending: number;
            average: number;
        };
    };
    this_month: {
        revenue: number;
        extra_income: number;
        total_income: number;
        expenses: number;
        profit: number;
        profit_margin: string;
        bills: {
            total: number;
            paid: number;
        };
    };
    top_selling_items: Array<{
        item_name: string;
        quantity_sold: string;
        revenue: string;
    }>;
    recent_bills: Array<{
        id: number;
        bill_number: string;
        customer_name: string;
        total_amount: string;
        payment_status: string;
        payment_method: string;
        created_at: string;
    }>;
    payment_methods_today: Array<{
        payment_method: string;
        count: string;
        total: string;
    }>;
    hourly_trend_today: Array<{
        hour: string;
        bills_count: string;
        revenue: string;
    }>;
    quick_stats: {
        total_menu_items: number;
        total_categories: number;
        total_customers: number;
    };
    alerts: Array<any>;
}

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        // Default to today's date in YYYY-MM-DD format
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    useEffect(() => {
        // Load currency symbol from settings
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.currency_symbol?.value) {
                    setCurrencySymbol(settings.currency_symbol.value);
                }
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }

        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.dashboard.getStats(selectedDate);
            console.log("Dashboard data:", response);
            setDashboardData(response.data);
        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message || "Failed to load dashboard data");
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    // Refetch data when date changes
    useEffect(() => {
        if (selectedDate) {
            fetchDashboardData();
        }
    }, [selectedDate, fetchDashboardData]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const handleTodayClick = () => {
        const today = new Date();
        setSelectedDate(today.toISOString().split("T")[0]);
    };

    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0F0F0F] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-[#A1A1AA]">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0F0F0F] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA] mb-2">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                        {error || "Something went wrong"}
                    </p>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { today, this_month, quick_stats } = dashboardData;

    return (
        <div className="h-screen bg-gray-50 dark:bg-[#0F0F0F] overflow-y-auto scroll-smooth">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
                {/* Header with Date Filter */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 sticky top-0 bg-gray-50 dark:bg-[#0F0F0F] z-10 pb-4">
                    {/* <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mt-1">
                            {formatDisplayDate(selectedDate)}
                        </p>
                    </div> */}
                    <div className="flex items-center gap-2">
                        {/* Date Picker */}
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#18181B] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-colors"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {/* Today Button */}
                        <button
                            onClick={handleTodayClick}
                            className="px-4 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] rounded-lg hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                        >
                            Today
                        </button>
                        {/* New Order Button */}
                        <button
                            onClick={() => router.push("/pos")}
                            className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Order
                        </button>
                    </div>
                </div>

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Revenue
                            </span>
                            <DollarSign className="w-4 h-4 text-[#eb1700]" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {today.revenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            {today.bills.total} orders
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Profit
                            </span>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {today.profit.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            {today.profit_margin}% margin
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Avg Order
                            </span>
                            <ShoppingBag className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {today.bills.average.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            per transaction
                        </p>
                    </div>

                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Menu Items
                            </span>
                            <Package className="w-4 h-4 text-orange-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {quick_stats.total_menu_items}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            {quick_stats.total_categories} categories
                        </p>
                    </div>
                </div>

                {/* Pie Charts Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Sales Pie Chart - Left */}
                    <div className="bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                Top Selling Items
                            </h3>
                            <TrendingUp className="w-4 h-4 text-[#eb1700]" />
                        </div>
                        <SalesPieChart
                            items={dashboardData.top_selling_items}
                        />
                    </div>

                    {/* Payment Methods - Right */}
                    <div className="bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                Payment Methods
                            </h3>
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                        </div>
                        <PaymentMethodsPieChart
                            data={dashboardData.payment_methods_today}
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Recent Activity
                        </h3>
                        <button
                            onClick={() => router.push("/reports")}
                            className="text-xs text-[#eb1700] hover:text-[#c41400] font-medium transition-colors"
                        >
                            View All →
                        </button>
                    </div>
                    <RecentBillsTable
                        bills={dashboardData.recent_bills.slice(0, 5)}
                    />
                </div>
            </div>
        </div>
    );
}
