interface DailyBreakdownChartProps {
    dailyData: Array<{
        date: string;
        bill_revenue: string;
        net_profit: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

export default function DailyBreakdownChart({
    dailyData,
    formatCurrency,
}: DailyBreakdownChartProps) {
    const maxRevenue = Math.max(
        ...dailyData.map((d) => parseFloat(d.bill_revenue))
    );

    const activeDays = dailyData.filter((d) => parseFloat(d.bill_revenue) > 0);

    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>📅</span>Daily Breakdown
            </h3>
            <div className="space-y-2">
                {activeDays.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-[#A1A1AA] py-8">
                        No sales data for this month
                    </p>
                ) : (
                    activeDays.map((day, i) => {
                        const width =
                            (parseFloat(day.bill_revenue) / maxRevenue) * 100;
                        const date = new Date(day.date);
                        const dayNum = date.getDate();

                        return (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-[#FAFAFA]">
                                        Day {dayNum}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                        {formatCurrency(day.bill_revenue)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-[#27272A] rounded-full h-2">
                                    <div
                                        className="bg-[#eb1700] h-2 rounded-full transition-all"
                                        style={{ width: `${width}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
