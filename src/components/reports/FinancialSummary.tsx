interface FinancialSummaryProps {
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
    formatCurrency: (amount: string | number) => string;
}

export default function FinancialSummary({
    income,
    expenses,
    profit,
    formatCurrency,
}: FinancialSummaryProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Income Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">💵</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
                        Income
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(income.total_income)}
                </h3>
                <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-600">
                        Bills: {formatCurrency(income.from_bills)}
                    </p>
                    <p className="text-xs text-gray-600">
                        Extra: {formatCurrency(income.extra_income)}
                    </p>
                </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">💸</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
                        Expenses
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(expenses.total_expenses)}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                    {expenses.records_count} records
                </p>
            </div>

            {/* Profit Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">📈</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
                        Profit
                    </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                    {formatCurrency(profit.net_profit)}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                    Margin: {profit.profit_margin}%
                </p>
            </div>
        </div>
    );
}
