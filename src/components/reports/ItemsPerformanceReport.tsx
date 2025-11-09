import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { downloadCSV } from "@/utils/downloadCSV";
import SummaryCard from "./SummaryCard";
import ReportPeriodHeader from "./ReportPeriodHeader";
import ItemPerformanceTable from "./ItemPerformanceTable";
import CategoryPerformanceCard from "./CategoryPerformanceCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface ItemsPerformanceData {
    period: {
        start_date: string;
        end_date: string;
    };
    summary: {
        total_items_sold: number;
        total_quantity_sold: number;
        total_revenue: number;
        total_profit: number;
        profit_margin: string;
    };
    top_performers: {
        by_revenue: Array<any>;
        by_quantity: Array<any>;
        by_profit: Array<any>;
    };
    low_performers: Array<any>;
    category_performance: Array<any>;
}

type PerformanceView = "revenue" | "quantity" | "profit" | "low";

export default function ItemsPerformanceReport() {
    const [data, setData] = useState<ItemsPerformanceData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<PerformanceView>("revenue");

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.reports.getItemsPerformance();
            if (response.success) setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch items performance report");
            toast.error("Failed to load items performance report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatCurrency = (amount: string | number) =>
        `₹${parseFloat(String(amount)).toFixed(2)}`;
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    if (loading) return <LoadingState />;
    if (error || !data)
        return (
            <ErrorState
                error={error || "No data available"}
                onRetry={fetchReport}
            />
        );

    const views = [
        { id: "revenue" as PerformanceView, label: "By Revenue", emoji: "💰" },
        {
            id: "quantity" as PerformanceView,
            label: "By Quantity",
            emoji: "📦",
        },
        { id: "profit" as PerformanceView, label: "By Profit", emoji: "💵" },
        { id: "low" as PerformanceView, label: "Low Performers", emoji: "📉" },
    ];

    const getCurrentItems = () => {
        switch (activeView) {
            case "revenue":
                return data.top_performers.by_revenue;
            case "quantity":
                return data.top_performers.by_quantity;
            case "profit":
                return data.top_performers.by_profit;
            case "low":
                return data.low_performers;
            default:
                return [];
        }
    };

    const handleDownload = () => {
        if (!data) return;

        const headers = [
            "Item Name",
            "Type",
            "Quantity",
            "Revenue",
            "Profit",
            "Margin %",
        ];
        const items = getCurrentItems();
        const rows = items.map((item: any) => [
            item.item_name,
            item.item_type === "combo" ? "Combo" : "Menu Item",
            item.total_quantity_sold,
            formatCurrency(item.total_revenue),
            formatCurrency(item.total_profit),
            item.profit_percentage.toFixed(2),
        ]);

        downloadCSV(`items-performance-${activeView}`, headers, rows);
        toast.success("Report downloaded successfully");
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-[#A1A1AA]">
                        Report Period
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mt-1">
                        {formatDate(data.period.start_date)} -{" "}
                        {formatDate(data.period.end_date)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-[#eb1700] text-white rounded-lg hover:bg-[#c41400] transition-colors text-sm font-medium"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Download
                    </button>
                    <button
                        onClick={fetchReport}
                        className="p-2 text-gray-600 dark:text-[#A1A1AA] hover:text-[#eb1700] transition-colors"
                        title="Refresh"
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
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    emoji="🛍️"
                    label="Items"
                    value={data.summary.total_items_sold.toString()}
                    description="Unique Items Sold"
                    colorScheme="blue"
                />
                <SummaryCard
                    emoji="📦"
                    label="Quantity"
                    value={data.summary.total_quantity_sold.toString()}
                    description="Total Quantity Sold"
                    colorScheme="purple"
                />
                <SummaryCard
                    emoji="💰"
                    label="Revenue"
                    value={formatCurrency(data.summary.total_revenue)}
                    description="Total Revenue"
                    colorScheme="green"
                />
                <SummaryCard
                    emoji="💵"
                    label="Profit"
                    value={formatCurrency(data.summary.total_profit)}
                    description={`Margin: ${data.summary.profit_margin}%`}
                    colorScheme="orange"
                />
            </div>

            {/* Category Performance */}
            <CategoryPerformanceCard
                categories={data.category_performance}
                formatCurrency={formatCurrency}
            />

            {/* Performance Tabs */}
            <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
                <div className="border-b border-gray-200 dark:border-[#3F3F46] mb-6">
                    <nav className="-mb-px flex gap-6">
                        {views.map((view) => (
                            <button
                                key={view.id}
                                onClick={() => setActiveView(view.id)}
                                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeView === view.id
                                        ? "border-[#eb1700] text-[#eb1700]"
                                        : "border-transparent text-gray-600 dark:text-[#A1A1AA] hover:text-gray-900 dark:hover:text-[#FAFAFA]"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span>{view.emoji}</span>
                                    {view.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                <ItemPerformanceTable
                    title={views.find((v) => v.id === activeView)?.label || ""}
                    emoji={views.find((v) => v.id === activeView)?.emoji || ""}
                    items={getCurrentItems()}
                    formatCurrency={formatCurrency}
                    showProfit={true}
                />
            </div>
        </div>
    );
}
