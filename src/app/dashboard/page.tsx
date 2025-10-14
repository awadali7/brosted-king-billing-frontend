"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/utils/api";
import MainLayout from "@/components/MainLayout";

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
    top_expenses_this_month: Array<{
        category: string;
        color: string;
        total: string;
        count: string;
    }>;
    last_7_days_trend: Array<{
        date: string;
        bills: string;
        revenue: string;
    }>;
    quick_stats: {
        total_menu_items: number;
        total_categories: number;
        total_customers: number;
    };
}

interface ComparisonData {
    daily: {
        today: number;
        yesterday: number;
        change: number;
        growth_percentage: string;
    };
    monthly: {
        this_month: number;
        last_month: number;
        change: number;
        growth_percentage: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(
        null
    );
    const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token) {
            router.push("/auth/login");
        } else if (userData) {
            setUser(JSON.parse(userData));
            loadDashboardData();
        }
    }, [router, selectedDate]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboard, comparison] = await Promise.all([
                api.get(`/dashboard?date=${selectedDate}`),
                api.get("/dashboard/comparison"),
            ]);

            if (dashboard.success) {
                setDashboardData(dashboard.data);
            }
            if (comparison.success) {
                setComparisonData(comparison.data);
            }
        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        api.logout();
    };

    const formatCurrency = (value: number | string) => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <MainLayout user={user} currentPage="dashboard">
            {dashboardData && (
                <>
                    {/* Today's Overview */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-500">
                                    {new Date(
                                        dashboardData.date
                                    ).toLocaleDateString("en-IN", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Revenue Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <select className="text-xs text-gray-500 border-none bg-transparent focus:outline-none">
                                        <option>Last 30 day</option>
                                        <option>Last 7 day</option>
                                        <option>Today</option>
                                    </select>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-1">
                                    Revenue
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                    {formatCurrency(
                                        dashboardData.today.revenue
                                    )}
                                </p>
                                {comparisonData && (
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                comparisonData.daily.change >= 0
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {comparisonData.daily.change >= 0
                                                ? "↑"
                                                : "↓"}{" "}
                                            {comparisonData.daily
                                                .growth_percentage || 0}
                                            %
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            from yesterday
                                        </span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Average values of sales
                                </p>
                            </div>

                            {/* Total Income Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                    </div>
                                    <select className="text-xs text-gray-500 border-none bg-transparent focus:outline-none">
                                        <option>Last 30 day</option>
                                        <option>Last 7 day</option>
                                        <option>Today</option>
                                    </select>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-1">
                                    Total Income
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                    {formatCurrency(
                                        dashboardData.today.total_income
                                    )}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                        ↑ 15.2%
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        from yesterday
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Revenue + Extra Income
                                </p>
                            </div>

                            {/* Expenses Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                            />
                                        </svg>
                                    </div>
                                    <select className="text-xs text-gray-500 border-none bg-transparent focus:outline-none">
                                        <option>Last 30 day</option>
                                        <option>Last 7 day</option>
                                        <option>Today</option>
                                    </select>
                                </div>
                                <h3 className="text-sm font-medium text-gray-600 mb-1">
                                    Expenses
                                </h3>
                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                    {formatCurrency(
                                        dashboardData.today.expenses
                                    )}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                        ↓ 5.8%
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        from yesterday
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Today's expenditure
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bills & Monthly Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Today's Bills */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Today's Bills
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Total Bills
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {dashboardData.today.bills.total}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Paid
                                    </span>
                                    <span className="text-lg font-semibold text-green-600">
                                        {dashboardData.today.bills.paid}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        Pending
                                    </span>
                                    <span className="text-lg font-semibold text-orange-600">
                                        {dashboardData.today.bills.pending}
                                    </span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Average Bill
                                        </span>
                                        <span className="text-lg font-bold text-blue-600">
                                            {formatCurrency(
                                                dashboardData.today.bills
                                                    .average
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* This Month's Summary */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-sm p-6 border border-orange-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                This Month's Performance
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Revenue
                                    </p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {formatCurrency(
                                            dashboardData.this_month.revenue
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Total Income
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                        {formatCurrency(
                                            dashboardData.this_month
                                                .total_income
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Expenses
                                    </p>
                                    <p className="text-xl font-bold text-red-600">
                                        {formatCurrency(
                                            dashboardData.this_month.expenses
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Profit
                                    </p>
                                    <p
                                        className={`text-xl font-bold ${
                                            dashboardData.this_month.profit >= 0
                                                ? "text-emerald-600"
                                                : "text-orange-600"
                                        }`}
                                    >
                                        {formatCurrency(
                                            dashboardData.this_month.profit
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Total Bills
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {dashboardData.this_month.bills.total}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Profit Margin
                                    </p>
                                    <p
                                        className={`text-xl font-bold ${
                                            parseFloat(
                                                dashboardData.this_month
                                                    .profit_margin
                                            ) >= 0
                                                ? "text-emerald-600"
                                                : "text-orange-600"
                                        }`}
                                    >
                                        {dashboardData.this_month.profit_margin}
                                        %
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-600"
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
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData.quick_stats.total_menu_items}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Menu Items
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData.quick_stats.total_categories}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Categories
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {dashboardData.quick_stats.total_customers}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Customers
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Top Selling Items & Top Expenses */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Top Selling Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-orange-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                                Top Selling Items
                            </h3>
                            {dashboardData.top_selling_items.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.top_selling_items.map(
                                        (item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {item.item_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty:{" "}
                                                            {item.quantity_sold}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-green-600">
                                                    {formatCurrency(
                                                        parseFloat(item.revenue)
                                                    )}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    No sales data available
                                </p>
                            )}
                        </div>

                        {/* Top Expenses */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                                    />
                                </svg>
                                Top Expenses (This Month)
                            </h3>
                            {dashboardData.top_expenses_this_month.length >
                            0 ? (
                                <div className="space-y-3">
                                    {dashboardData.top_expenses_this_month.map(
                                        (expense, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                        style={{
                                                            backgroundColor:
                                                                expense.color,
                                                        }}
                                                    >
                                                        {expense.count}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {expense.category}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {expense.count}{" "}
                                                            transactions
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-red-600">
                                                    {formatCurrency(
                                                        parseFloat(
                                                            expense.total
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    No expense data available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Recent Bills */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Bills
                        </h3>
                        {dashboardData.recent_bills.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                                Bill #
                                            </th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                                Customer
                                            </th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                                Amount
                                            </th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                                Payment
                                            </th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                                Status
                                            </th>
                                            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.recent_bills.map(
                                            (bill) => (
                                                <tr
                                                    key={bill.id}
                                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                                >
                                                    <td className="py-3 px-4">
                                                        <span className="font-mono text-sm font-medium text-blue-600">
                                                            {bill.bill_number}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-900">
                                                        {bill.customer_name}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            parseFloat(
                                                                bill.total_amount
                                                            )
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                                                            {
                                                                bill.payment_method
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded-full capitalize ${
                                                                bill.payment_status ===
                                                                "paid"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-orange-100 text-orange-700"
                                                            }`}
                                                        >
                                                            {
                                                                bill.payment_status
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-xs text-gray-500">
                                                        {formatDate(
                                                            bill.created_at
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No recent bills
                            </p>
                        )}
                    </div>

                    {/* 7-Day Trend */}
                    {dashboardData.last_7_days_trend.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Last 7 Days Trend
                            </h3>
                            <div className="space-y-2">
                                {dashboardData.last_7_days_trend.map(
                                    (day, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="text-sm text-gray-600">
                                                {new Date(
                                                    day.date
                                                ).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        Bills
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {day.bills}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        Revenue
                                                    </p>
                                                    <p className="text-sm font-semibold text-green-600">
                                                        {formatCurrency(
                                                            parseFloat(
                                                                day.revenue
                                                            )
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </MainLayout>
    );
}
