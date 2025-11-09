interface ProfitMetricsCardProps {
    profit: {
        gross_profit: number;
        gross_profit_margin: string;
        net_profit: number;
        net_profit_margin: string;
    };
    formatCurrency: (amount: string | number) => string;
}

export default function ProfitMetricsCard({
    profit,
    formatCurrency,
}: ProfitMetricsCardProps) {
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>📈</span>Profit Summary
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-[#A1A1AA]">
                            Gross Profit
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A]">
                            Margin: {profit.gross_profit_margin}%
                        </p>
                    </div>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(profit.gross_profit)}
                    </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                    <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Net Profit
                        </p>
                        <p className="text-xs text-gray-600 dark:text-[#A1A1AA]">
                            Margin: {profit.net_profit_margin}%
                        </p>
                    </div>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(profit.net_profit)}
                    </p>
                </div>
            </div>
        </div>
    );
}
