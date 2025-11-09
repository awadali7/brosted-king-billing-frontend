interface RevenueBreakdownCardProps {
    bills: {
        total: number;
        subtotal: number;
        tax_collected: number;
        discounts_given: number;
        count: string;
    };
    extraIncome: number;
    totalRevenue: number;
    formatCurrency: (amount: string | number) => string;
}

export default function RevenueBreakdownCard({
    bills,
    extraIncome,
    totalRevenue,
    formatCurrency,
}: RevenueBreakdownCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>💵</span>Revenue Breakdown
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                            Bills Revenue
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                            {bills.count} bills
                        </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                        {formatCurrency(bills.total)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                        Subtotal
                    </p>
                    <p className="text-sm text-gray-700 dark:text-[#A1A1AA]">
                        {formatCurrency(bills.subtotal)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                        Tax Collected
                    </p>
                    <p className="text-sm text-gray-700 dark:text-[#A1A1AA]">
                        {formatCurrency(bills.tax_collected)}
                    </p>
                </div>
                {extraIncome > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                            Extra Income
                        </p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(extraIncome)}
                        </p>
                    </div>
                )}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA]">
                        Total Revenue
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalRevenue)}
                    </p>
                </div>
            </div>
        </div>
    );
}
