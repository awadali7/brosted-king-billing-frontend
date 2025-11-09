interface TaxProjectionsCardProps {
    projections: {
        daily_average: string;
        monthly_projection: string;
        quarterly_projection: string;
        yearly_projection: string;
    };
    formatCurrency: (amount: string | number) => string;
}

export default function TaxProjectionsCard({
    projections,
    formatCurrency,
}: TaxProjectionsCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>🔮</span>Tax Collection Projections
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mb-1">
                        Daily Avg
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(projections.daily_average)}
                    </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mb-1">
                        Monthly
                    </p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(projections.monthly_projection)}
                    </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mb-1">
                        Quarterly
                    </p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(projections.quarterly_projection)}
                    </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-[#A1A1AA] mb-1">
                        Yearly
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(projections.yearly_projection)}
                    </p>
                </div>
            </div>
        </div>
    );
}
