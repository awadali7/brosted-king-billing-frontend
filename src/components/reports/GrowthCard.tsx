interface GrowthCardProps {
    currentRevenue: string;
    previousRevenue: string;
    growthPercentage: string;
    formatCurrency: (amount: string | number) => string;
}

export default function GrowthCard({
    currentRevenue,
    previousRevenue,
    growthPercentage,
    formatCurrency,
}: GrowthCardProps) {
    const isPositive = parseFloat(growthPercentage) >= 0;

    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>📊</span>Monthly Growth
            </h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                            Current Month
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {formatCurrency(currentRevenue)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#27272A] rounded-lg">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                            Previous Month
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {formatCurrency(previousRevenue)}
                        </p>
                    </div>
                </div>
                <div
                    className={`flex items-center justify-between p-4 rounded-lg ${
                        isPositive
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-red-50 dark:bg-red-900/20"
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">
                            {isPositive ? "📈" : "📉"}
                        </span>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Growth Rate
                            </p>
                            <p
                                className={`text-2xl font-bold ${
                                    isPositive
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {isPositive ? "+" : ""}
                                {growthPercentage}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
