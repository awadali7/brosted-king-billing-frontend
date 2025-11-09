import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import SummaryCard from "./SummaryCard";
import DailyReportHeader from "./DailyReportHeader";
import FinancialSummary from "./FinancialSummary";
import HourlySalesCard from "./HourlySalesCard";
import ItemsSoldTable from "./ItemsSoldTable";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface DailyData {
    date: string;
    summary: {
        bills: {
            total_bills: string;
            revenue: string;
            subtotal: string;
            tax_collected: string;
            discounts: string;
            average_bill: string;
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
    };
    items_sold: Array<{
        item_name: string;
        item_type: string;
        quantity_sold: string;
        revenue: string;
    }>;
    hourly_breakdown: Array<{
        hour: string;
        bills_count: string;
        revenue: string;
    }>;
}

export default function DailyReport() {
    const [data, setData] = useState<DailyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.reports.getDailyReport();
            if (response.success) setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch daily report");
            toast.error("Failed to load daily report");
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
            month: "long",
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

    const { bills } = data.summary;

    return (
        <div className="space-y-6">
            <DailyReportHeader
                date={data.date}
                onRefresh={fetchReport}
                formatDate={formatDate}
            />

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
                    value={formatCurrency(bills.revenue)}
                    description="Total Revenue"
                    colorScheme="green"
                />
                <SummaryCard
                    emoji="📊"
                    label="Average"
                    value={formatCurrency(bills.average_bill)}
                    description="Average Bill"
                    colorScheme="purple"
                />
                <SummaryCard
                    emoji="🏛️"
                    label="Tax"
                    value={formatCurrency(bills.tax_collected)}
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

            {/* Hourly Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HourlySalesCard
                    hourlyPattern={data.hourly_breakdown.map((h) => ({
                        hour: h.hour,
                        transaction_count: h.bills_count,
                        total_revenue: h.revenue,
                    }))}
                    formatCurrency={formatCurrency}
                />
                <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                        <span>📋</span>Bills Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                                    Paid Bills
                                </p>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                                {bills.paid_bills}
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                                    Pending Bills
                                </p>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                                {bills.pending_bills}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Sold */}
            <ItemsSoldTable
                items={data.items_sold}
                formatCurrency={formatCurrency}
            />
        </div>
    );
}
