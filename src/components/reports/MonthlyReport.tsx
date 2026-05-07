import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { downloadCSV } from "@/utils/downloadCSV";
import SummaryCard from "./SummaryCard";
import MonthlyReportHeader from "./MonthlyReportHeader";
import FinancialSummary from "./FinancialSummary";
import GrowthCard from "./GrowthCard";
import DailyBreakdownChart from "./DailyBreakdownChart";
import PaymentMethodsCard from "./PaymentMethodsCard";
import TopSellingItemsTable from "./TopSellingItemsTable";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface MonthlyData {
    period: {
        year: number;
        month: number;
        start_date: string;
        end_date: string;
    };
    summary: {
        bills: {
            total_bills: string;
            total_revenue: string;
            total_subtotal: string;
            total_tax: string;
            total_discounts: string;
            average_bill_value: string;
            paid_bills: string;
            pending_bills: string;
        };
        income: {
            from_bills: number;
            extra_income: number;
            total_income: number;
        };
        expenses: {
            total_expenses: number;
            records_count: string;
        };
        profit: {
            net_profit: number;
            profit_margin: string;
        };
        growth: {
            previous_month_revenue: string;
            revenue_growth_percentage: string;
        };
    };
    daily_breakdown: Array<{
        date: string;
        bill_revenue: string;
        extra_income: string;
        expenses: string;
        net_profit: string;
    }>;
    top_selling_items: Array<{
        item_name: string;
        item_type: string;
        total_quantity: string;
        total_revenue: string;
        number_of_orders: string;
    }>;
    payment_methods_breakdown: Array<{
        payment_method: string;
        transaction_count: string;
        total_amount: string;
    }>;
}

export default function MonthlyReport() {
    const [data, setData] = useState<MonthlyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.reports.getMonthlyReport();
            if (response.success) setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch monthly report");
            toast.error("Failed to load monthly report");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatCurrency = (amount: string | number) =>
        `₹${parseFloat(String(amount)).toFixed(2)}`;

    const handleDownload = () => {
        if (!data) return;

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const headers = ["Metric", "Value"];
        const rows = [
            [
                "Period",
                `${monthNames[data.period.month - 1]} ${data.period.year}`,
            ],
            ["Total Bills", data.summary.bills.total_bills],
            ["Total Revenue", formatCurrency(data.summary.bills.total_revenue)],
            [
                "Average Bill",
                formatCurrency(data.summary.bills.average_bill_value),
            ],
            ["Tax Collected", formatCurrency(data.summary.bills.total_tax)],
            ["Net Profit", formatCurrency(data.summary.profit.net_profit)],
            ["Profit Margin", `${data.summary.profit.profit_margin}%`],
            ["Growth", `${data.summary.growth.revenue_growth_percentage}%`],
        ];

        downloadCSV("monthly-report", headers, rows);
        toast.success("Report downloaded successfully");
    };

    if (loading) return <LoadingState />;
    if (error || !data)
        return (
            <ErrorState
                error={error || "No data available"}
                onRetry={fetchReport}
            />
        );

    const { bills } = data.summary;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Report Period
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                        {
                            [
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                            ][data.period.month - 1]
                        }{" "}
                        {data.period.year}
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
                        className="p-2 text-gray-600 hover:text-[#eb1700] transition-colors"
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

            {/* Bills Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    emoji="🧾"
                    label="Bills"
                    value={bills.total_bills}
                    description="Total Bills"
                    colorScheme="blue"
                />
                <SummaryCard
                    emoji="💰"
                    label="Revenue"
                    value={formatCurrency(bills.total_revenue)}
                    description="Total Revenue"
                    colorScheme="green"
                />
                <SummaryCard
                    emoji="📊"
                    label="Average"
                    value={formatCurrency(bills.average_bill_value)}
                    description="Average Bill"
                    colorScheme="purple"
                />
                <SummaryCard
                    emoji="🏛️"
                    label="Tax"
                    value={formatCurrency(bills.total_tax)}
                    description="Tax Collected"
                    colorScheme="orange"
                />
            </div>

            {/* Financial Summary */}
            <FinancialSummary
                income={data.summary.income}
                expenses={data.summary.expenses}
                profit={data.summary.profit}
                formatCurrency={formatCurrency}
            />

            {/* Growth & Daily Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GrowthCard
                    currentRevenue={bills.total_revenue}
                    previousRevenue={data.summary.growth.previous_month_revenue}
                    growthPercentage={
                        data.summary.growth.revenue_growth_percentage
                    }
                    formatCurrency={formatCurrency}
                />
                <DailyBreakdownChart
                    dailyData={data.daily_breakdown}
                    formatCurrency={formatCurrency}
                />
            </div>

            {/* Payment Methods */}
            <PaymentMethodsCard
                paymentMethods={data.payment_methods_breakdown}
                formatCurrency={formatCurrency}
            />

            {/* Top Selling Items */}
            <TopSellingItemsTable
                items={data.top_selling_items.map((item) => ({
                    item_name: item.item_name,
                    item_type: item.item_type,
                    total_quantity_sold: item.total_quantity,
                    total_revenue: item.total_revenue,
                    number_of_orders: item.number_of_orders,
                    average_price: (
                        parseFloat(item.total_revenue) /
                        parseFloat(item.total_quantity)
                    ).toString(),
                }))}
                formatCurrency={formatCurrency}
            />
        </div>
    );
}
