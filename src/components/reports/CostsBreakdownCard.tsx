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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>💸</span>Costs Breakdown
            </h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Cost of Goods Sold
                        </p>
                        <p className="text-xs text-gray-500">
                            {cogs.percentage_of_revenue}% of revenue
                        </p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(cogs.total)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Operating Expenses
                        </p>
                        <p className="text-xs text-gray-500">
                            {operatingExpenses.percentage_of_revenue}% of
                            revenue
                        </p>
                    </div>
                    <p className="text-sm text-gray-700">
                        {formatCurrency(operatingExpenses.total)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-100 to-red-50 rounded-lg border-2 border-red-200">
                    <div>
                        <p className="text-base font-semibold text-gray-900">
                            Total Expenses
                        </p>
                        <p className="text-xs text-gray-500">
                            {totalExpensesPercentage}% of revenue
                        </p>
                    </div>
                    <p className="text-xl font-bold text-red-600">
                        {formatCurrency(totalExpenses)}
                    </p>
                </div>
            </div>
        </div>
    );
}
