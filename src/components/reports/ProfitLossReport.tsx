import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { downloadCSV } from "@/utils/downloadCSV";
import SummaryCard from "./SummaryCard";
import ReportPeriodHeader from "./ReportPeriodHeader";
import RevenueBreakdownCard from "./RevenueBreakdownCard";
import CostsBreakdownCard from "./CostsBreakdownCard";
import ProfitMetricsCard from "./ProfitMetricsCard";
import GrowthCard from "./GrowthCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface ProfitLossData {
    period: {
        start_date: string;
        end_date: string;
        days: number;
    };
    revenue: {
        bills: {
            total: number;
            subtotal: number;
            tax_collected: number;
            discounts_given: number;
            count: string;
        };
        extra_income: {
            total: number;
        };
        total_revenue: number;
    };
    costs: {
        cost_of_goods_sold: {
            total: number;
            percentage_of_revenue: string;
        };
        operating_expenses: {
            total: number;
            percentage_of_revenue: string;
        };
        total_expenses: number;
        total_expenses_percentage: string;
    };
    profit: {
        gross_profit: number;
        gross_profit_margin: string;
        net_profit: number;
        net_profit_margin: string;
    };
    comparison: {
        previous_period_revenue: string;
        revenue_growth_percentage: string;
    };
    analysis: {
        averages: {
            daily_revenue: string;
            daily_expenses: string;
            daily_profit: string;
        };
    };
}

export default function ProfitLossReport() {
    const [data, setData] = useState<ProfitLossData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const fetchReport = async (start?: string, end?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.reports.getProfitLoss(start, end);
            if (response.success) setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch profit & loss report");
            toast.error("Failed to load profit & loss report");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (fromDate && toDate && fromDate > toDate) {
            toast.error("From date must be before To date");
            return;
        }
        fetchReport(fromDate || undefined, toDate || undefined);
    };

    const handleClear = () => {
        setFromDate("");
        setToDate("");
        fetchReport();
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

    const handleDownload = () => {
        if (!data) return;

        const headers = ["Metric", "Value"];
        const rows = [
            [
                "Period",
                `${formatDate(data.period.start_date)} - ${formatDate(
                    data.period.end_date
                )}`,
            ],
            ["Total Revenue", formatCurrency(data.revenue.total_revenue)],
            ["Total Expenses", formatCurrency(data.costs.total_expenses)],
            ["COGS", formatCurrency(data.costs.cost_of_goods_sold.total)],
            [
                "Operating Expenses",
                formatCurrency(data.costs.operating_expenses.total),
            ],
            ["Gross Profit", formatCurrency(data.profit.gross_profit)],
            ["Net Profit", formatCurrency(data.profit.net_profit)],
            ["Net Profit Margin", `${data.profit.net_profit_margin}%`],
            ["Revenue Growth", `${data.comparison.revenue_growth_percentage}%`],
        ];

        const filename = `profit-loss-statement_${data.period.start_date}_to_${data.period.end_date}`;
        downloadCSV(filename, headers, rows);
        toast.success("Report downloaded successfully");
    };

    if (loading) return <LoadingState />;
    if (error || !data)
        return (
            <ErrorState
                error={error || "No data available"}
                onRetry={() => fetchReport(fromDate || undefined, toDate || undefined)}
            />
        );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                            Report Period
                        </h3>
                        <p className="text-sm font-semibold text-gray-900">
                            {formatDate(data.period.start_date)} -{" "}
                            {formatDate(data.period.end_date)}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-end gap-2 ml-auto">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleApply}
                            className="px-4 py-2 bg-[#eb1700] text-white rounded-lg hover:bg-[#c41400] transition-colors text-sm font-medium"
                        >
                            Apply
                        </button>
                        {(fromDate || toDate) && (
                            <button
                                onClick={handleClear}
                                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-[#eb1700] text-white rounded-lg hover:bg-[#c41400] transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                        <button
                            onClick={() => fetchReport(fromDate || undefined, toDate || undefined)}
                            className="p-2 text-gray-600 hover:text-[#eb1700] transition-colors"
                            title="Refresh"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    emoji="💰"
                    label="Revenue"
                    value={formatCurrency(data.revenue.total_revenue)}
                    description={`${data.revenue.bills.count} bills`}
                    colorScheme="green"
                />
                <SummaryCard
                    emoji="💸"
                    label="Expenses"
                    value={formatCurrency(data.costs.total_expenses)}
                    description={`${data.costs.total_expenses_percentage}% of revenue`}
                    colorScheme="orange"
                />
                <SummaryCard
                    emoji="📈"
                    label="Profit"
                    value={formatCurrency(data.profit.net_profit)}
                    description={`${data.profit.net_profit_margin}% margin`}
                    colorScheme="blue"
                />
                <SummaryCard
                    emoji="📊"
                    label="Daily Avg"
                    value={formatCurrency(data.analysis.averages.daily_profit)}
                    description={`Over ${data.period.days} days`}
                    colorScheme="purple"
                />
            </div>

            {/* Revenue vs Expenses & Profit */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RevenueBreakdownCard
                    bills={data.revenue.bills}
                    extraIncome={data.revenue.extra_income.total}
                    totalRevenue={data.revenue.total_revenue}
                    formatCurrency={formatCurrency}
                />
                <CostsBreakdownCard
                    cogs={data.costs.cost_of_goods_sold}
                    operatingExpenses={data.costs.operating_expenses}
                    totalExpenses={data.costs.total_expenses}
                    totalExpensesPercentage={
                        data.costs.total_expenses_percentage
                    }
                    formatCurrency={formatCurrency}
                />
                <ProfitMetricsCard
                    profit={data.profit}
                    formatCurrency={formatCurrency}
                />
            </div>

            {/* Growth Comparison */}
            <GrowthCard
                currentRevenue={data.revenue.total_revenue.toString()}
                previousRevenue={data.comparison.previous_period_revenue}
                growthPercentage={data.comparison.revenue_growth_percentage}
                formatCurrency={formatCurrency}
            />

            {/* Daily Averages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📅</span>Daily Averages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                            Avg Daily Revenue
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(
                                data.analysis.averages.daily_revenue
                            )}
                        </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                            Avg Daily Expenses
                        </p>
                        <p className="text-xl font-bold text-orange-600">
                            {formatCurrency(
                                data.analysis.averages.daily_expenses
                            )}
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                            Avg Daily Profit
                        </p>
                        <p className="text-xl font-bold text-green-600">
                            {formatCurrency(
                                data.analysis.averages.daily_profit
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
