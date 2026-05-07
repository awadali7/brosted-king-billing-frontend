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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔮</span>Tax Collection Projections
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                        Daily Avg
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(projections.daily_average)}
                    </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                        Monthly
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                        {formatCurrency(projections.monthly_projection)}
                    </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                        Quarterly
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(projections.quarterly_projection)}
                    </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">
                        Yearly
                    </p>
                    <p className="text-lg font-bold text-green-600">
                        {formatCurrency(projections.yearly_projection)}
                    </p>
                </div>
            </div>
        </div>
    );
}
