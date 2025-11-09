interface TaxBreakdownCardProps {
    byTaxRate: Array<{
        tax_percentage: string;
        bill_count: string;
        taxable_amount: string;
        tax_collected: string;
        total_amount: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

export default function TaxBreakdownCard({
    byTaxRate,
    formatCurrency,
}: TaxBreakdownCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>📊</span>Tax Rate Breakdown
            </h3>
            <div className="space-y-3">
                {byTaxRate.map((rate, i) => (
                    <div
                        key={i}
                        className="p-4 bg-gray-50 dark:bg-[#27272A] rounded-lg"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {rate.tax_percentage}% Tax Rate
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                    {rate.bill_count} bills
                                </p>
                            </div>
                            <span className="px-3 py-1 bg-[#eb1700] text-white text-xs font-bold rounded-full">
                                {formatCurrency(rate.tax_collected)}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="text-gray-500 dark:text-[#A1A1AA]">
                                    Taxable Amount
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {formatCurrency(rate.taxable_amount)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 dark:text-[#A1A1AA]">
                                    With Tax
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {formatCurrency(rate.total_amount)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
