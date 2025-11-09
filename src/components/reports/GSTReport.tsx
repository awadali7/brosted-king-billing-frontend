import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import { downloadCSV } from "@/utils/downloadCSV";
import SummaryCard from "./SummaryCard";
import ReportPeriodHeader from "./ReportPeriodHeader";
import TaxBreakdownCard from "./TaxBreakdownCard";
import PaymentMethodsCard from "./PaymentMethodsCard";
import TaxProjectionsCard from "./TaxProjectionsCard";
import ComplianceCard from "./ComplianceCard";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface GSTData {
    period: {
        start_date: string;
        end_date: string;
        days: number;
    };
    summary: {
        configured_tax_rate: number;
        effective_tax_rate: string;
        total_bills: string;
        total_taxable_amount: number;
        total_tax_collected: number;
        total_discounts: number;
        total_with_tax: number;
    };
    breakdown: {
        by_tax_rate: Array<{
            tax_percentage: string;
            bill_count: string;
            taxable_amount: string;
            tax_collected: string;
            total_amount: string;
        }>;
        by_payment_method: Array<{
            payment_method: string;
            transaction_count: string;
            taxable_amount: string;
            tax_collected: string;
            total_amount: string;
        }>;
    };
    projections: {
        daily_average: string;
        monthly_projection: string;
        quarterly_projection: string;
        yearly_projection: string;
    };
    tax_liability: {
        total_collected: number;
        payment_due: number;
        status: string;
    };
    compliance: {
        reporting_period: string;
        total_transactions: string;
        taxable_turnover: number;
        tax_payable: number;
    };
}

export default function GSTReport() {
    const [data, setData] = useState<GSTData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.reports.getGSTReport();
            if (response.success) setData(response.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch GST/Tax report");
            toast.error("Failed to load GST/Tax report");
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
            ["Tax Rate", `${data.summary.effective_tax_rate}%`],
            [
                "Taxable Amount",
                formatCurrency(data.summary.total_taxable_amount),
            ],
            ["Tax Collected", formatCurrency(data.summary.total_tax_collected)],
            ["Total With Tax", formatCurrency(data.summary.total_with_tax)],
            ["Tax Payable", formatCurrency(data.compliance.tax_payable)],
            [
                "Monthly Projection",
                formatCurrency(data.projections.monthly_projection),
            ],
            [
                "Yearly Projection",
                formatCurrency(data.projections.yearly_projection),
            ],
        ];

        downloadCSV("gst-tax-report", headers, rows);
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

            {/* Tax Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    emoji="🧾"
                    label="Bills"
                    value={data.summary.total_bills}
                    description="Total Transactions"
                    colorScheme="blue"
                />
                <SummaryCard
                    emoji="💰"
                    label="Taxable"
                    value={formatCurrency(data.summary.total_taxable_amount)}
                    description="Taxable Amount"
                    colorScheme="purple"
                />
                <SummaryCard
                    emoji="🏛️"
                    label="Tax"
                    value={formatCurrency(data.summary.total_tax_collected)}
                    description={`${data.summary.effective_tax_rate}% rate`}
                    colorScheme="orange"
                />
                <SummaryCard
                    emoji="✅"
                    label="Total"
                    value={formatCurrency(data.summary.total_with_tax)}
                    description="With Tax"
                    colorScheme="green"
                />
            </div>

            {/* Breakdown & Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TaxBreakdownCard
                    byTaxRate={data.breakdown.by_tax_rate}
                    formatCurrency={formatCurrency}
                />
                <ComplianceCard
                    compliance={data.compliance}
                    taxLiability={data.tax_liability}
                    formatCurrency={formatCurrency}
                />
            </div>

            {/* Projections */}
            <TaxProjectionsCard
                projections={data.projections}
                formatCurrency={formatCurrency}
            />

            {/* Payment Methods */}
            <PaymentMethodsCard
                paymentMethods={data.breakdown.by_payment_method}
                formatCurrency={formatCurrency}
            />
        </div>
    );
}
