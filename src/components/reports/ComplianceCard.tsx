interface ComplianceCardProps {
    compliance: {
        reporting_period: string;
        total_transactions: string;
        taxable_turnover: number;
        tax_payable: number;
    };
    taxLiability: {
        total_collected: number;
        payment_due: number;
        status: string;
    };
    formatCurrency: (amount: string | number) => string;
}

export default function ComplianceCard({
    compliance,
    taxLiability,
    formatCurrency,
}: ComplianceCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>📋</span>Tax Compliance Summary
            </h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA] mb-1">
                            Reporting Period
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            {compliance.reporting_period}
                        </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA] mb-1">
                            Total Transactions
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            {compliance.total_transactions}
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mb-1">
                        Taxable Turnover
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(compliance.taxable_turnover)}
                    </p>
                </div>

                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Tax Liability
                        </p>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                taxLiability.status === "paid"
                                    ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                    : "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                            }`}
                        >
                            {taxLiability.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-600 dark:text-[#A1A1AA]">
                                Collected
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                {formatCurrency(taxLiability.total_collected)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                                Payment Due
                            </p>
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                {formatCurrency(taxLiability.payment_due)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
