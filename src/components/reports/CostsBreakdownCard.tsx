interface CostsBreakdownCardProps {
    cogs: {
        total: number;
        percentage_of_revenue: string;
    };
    operatingExpenses: {
        total: number;
        percentage_of_revenue: string;
    };
    totalExpenses: number;
    totalExpensesPercentage: string;
    formatCurrency: (amount: string | number) => string;
}

export default function CostsBreakdownCard({
    cogs,
    operatingExpenses,
    totalExpenses,
    totalExpensesPercentage,
    formatCurrency,
}: CostsBreakdownCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>💸</span>Costs Breakdown
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                            Cost of Goods Sold
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                            {cogs.percentage_of_revenue}% of revenue
                        </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                        {formatCurrency(cogs.total)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                            Operating Expenses
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                            {operatingExpenses.percentage_of_revenue}% of
                            revenue
                        </p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-[#A1A1AA]">
                        {formatCurrency(operatingExpenses.total)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Total Expenses
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                            {totalExpensesPercentage}% of revenue
                        </p>
                    </div>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(totalExpenses)}
                    </p>
                </div>
            </div>
        </div>
    );
}
