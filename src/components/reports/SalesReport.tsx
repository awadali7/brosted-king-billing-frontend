import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { downloadCSV } from "@/utils/downloadCSV";
import SummaryCard from "./SummaryCard";
import ReportPeriodHeader from "./ReportPeriodHeader";
import PaymentMethodsCard from "./PaymentMethodsCard";
import HourlySalesCard from "./HourlySalesCard";
import TopSellingItemsTable from "./TopSellingItemsTable";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface SalesData {
    period: { start_date: string; end_date: string };
    summary: {
        total_bills: string;
        total_revenue: string;
        average_bill_value: string;
        total_tax_collected: string;
    };
    by_payment_method: Array<{
        payment_method: string;
        transaction_count: string;
        total_amount: string;
    }>;
    top_selling_items: Array<{
        item_name: string;
        item_type: string;
        total_quantity_sold: string;
        total_revenue: string;
        number_of_orders: string;
        average_price: string;
    }>;
    hourly_pattern: Array<{
        hour: string;
        transaction_count: string;
        total_revenue: string;
    }>;
}

export default function SalesReport() {
    const [data, setData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.reports.getSalesReport();
            if (response.success) setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch sales report");
            toast.error("Failed to load sales report");
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
            ["Total Bills", data.summary.total_bills],
            ["Total Revenue", formatCurrency(data.summary.total_revenue)],
            [
                "Average Bill Value",
                formatCurrency(data.summary.average_bill_value),
            ],
            ["Tax Collected", formatCurrency(data.summary.total_tax_collected)],
            [],
            ["Top Selling Items", ""],
            ["Item Name", "Type", "Quantity Sold", "Revenue"],
            ...data.top_selling_items.map((item) => [
                item.item_name,
                item.item_type === "combo" ? "Combo" : "Menu Item",
                item.total_quantity_sold,
                formatCurrency(item.total_revenue),
            ]),
        ];

        downloadCSV("sales-report", headers, rows);
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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">
                        Report Period
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    emoji="💰"
                    label="Revenue"
                    value={formatCurrency(data.summary.total_revenue)}
                    description="Total Revenue"
                    colorScheme="green"
                />
                <SummaryCard
                    emoji="🧾"
                    label="Bills"
                    value={data.summary.total_bills}
                    description="Total Bills Generated"
                    colorScheme="blue"
                />
                <SummaryCard
                    emoji="📊"
                    label="Average"
                    value={formatCurrency(data.summary.average_bill_value)}
                    description="Average Bill Value"
                    colorScheme="purple"
                />
                <SummaryCard
                    emoji="🏛️"
                    label="Tax"
                    value={formatCurrency(data.summary.total_tax_collected)}
                    description="Total Tax Collected"
                    colorScheme="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentMethodsCard
                    paymentMethods={data.by_payment_method}
                    formatCurrency={formatCurrency}
                />
                <HourlySalesCard
                    hourlyPattern={data.hourly_pattern}
                    formatCurrency={formatCurrency}
                />
            </div>

            <TopSellingItemsTable
                items={data.top_selling_items}
                formatCurrency={formatCurrency}
            />
        </div>
    );
}
