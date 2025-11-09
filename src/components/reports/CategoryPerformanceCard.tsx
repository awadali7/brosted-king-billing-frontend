interface CategoryPerformanceCardProps {
    categories: Array<{
        category_name: string;
        unique_items: string;
        total_quantity_sold: string;
        total_revenue: string;
        number_of_orders: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

const colors = [
    "#eb1700",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
];

export default function CategoryPerformanceCard({
    categories,
    formatCurrency,
}: CategoryPerformanceCardProps) {
    const totalRevenue = categories.reduce(
        (sum, cat) => sum + parseFloat(cat.total_revenue),
        0
    );

    let currentAngle = 0;
    const pieSlices = categories.map((cat, i) => {
        const percentage = (parseFloat(cat.total_revenue) / totalRevenue) * 100;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        return {
            ...cat,
            percentage,
            startAngle,
            endAngle: currentAngle,
            color: colors[i % colors.length],
        };
    });

    const createDonutSlice = (startAngle: number, endAngle: number) => {
        const outerRadius = 80;
        const innerRadius = 55;

        const outerStart = polarToCartesian(100, 100, outerRadius, endAngle);
        const outerEnd = polarToCartesian(100, 100, outerRadius, startAngle);
        const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
        const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);

        const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

        return `
            M ${outerStart.x} ${outerStart.y}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}
            L ${innerEnd.x} ${innerEnd.y}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}
            Z
        `;
    };

    const polarToCartesian = (
        centerX: number,
        centerY: number,
        radius: number,
        angle: number
    ) => {
        const angleInRadians = ((angle - 90) * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    };

    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>📂</span>Category Performance
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div className="flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
                        {pieSlices.map((slice, i) => (
                            <path
                                key={i}
                                d={createDonutSlice(
                                    slice.startAngle,
                                    slice.endAngle
                                )}
                                fill={slice.color}
                            />
                        ))}
                        <text
                            x="100"
                            y="95"
                            textAnchor="middle"
                            className="text-xs fill-gray-500 dark:fill-[#A1A1AA]"
                        >
                            Total
                        </text>
                        <text
                            x="100"
                            y="110"
                            textAnchor="middle"
                            className="text-sm fill-gray-900 dark:fill-[#FAFAFA] font-semibold"
                        >
                            {formatCurrency(totalRevenue)}
                        </text>
                    </svg>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                    {pieSlices.map((slice, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded flex-shrink-0"
                                style={{ backgroundColor: slice.color }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">
                                        {slice.category_name}
                                    </p>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-[#A1A1AA]">
                                        {slice.percentage.toFixed(1)}%
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                    {formatCurrency(slice.total_revenue)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
