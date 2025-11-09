interface HourlySalesCardProps {
    hourlyPattern: Array<{
        hour: string;
        transaction_count: string;
        total_revenue: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

export default function HourlySalesCard({
    hourlyPattern,
    formatCurrency,
}: HourlySalesCardProps) {
    const maxRevenue = Math.max(
        ...hourlyPattern.map((h) => parseFloat(h.total_revenue))
    );

    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>🕐</span>Hourly Sales Pattern
            </h3>
            <div className="space-y-3">
                {hourlyPattern.map((hour, i) => {
                    const width =
                        (parseFloat(hour.total_revenue) / maxRevenue) * 100;
                    return (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#FAFAFA]">
                                    {hour.hour}:00
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {formatCurrency(hour.total_revenue)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-[#27272A] rounded-full h-2">
                                <div
                                    className="bg-[#eb1700] h-2 rounded-full transition-all"
                                    style={{ width: `${width}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA] mt-1">
                                {hour.transaction_count} transactions
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
