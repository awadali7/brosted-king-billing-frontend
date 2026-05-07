interface SummaryCardProps {
    emoji: string;
    label: string;
    value: string;
    description: string;
    colorScheme: "green" | "blue" | "purple" | "orange";
}

const colors = {
    green: "from-green-50 to-green-100 border-green-200",
    blue: "from-blue-50 to-blue-100 border-blue-200",
    purple: "from-purple-50 to-purple-100 border-purple-200",
    orange: "from-orange-50 to-orange-100 border-orange-200",
};

export default function SummaryCard({
    emoji,
    label,
    value,
    description,
    colorScheme,
}: SummaryCardProps) {
    return (
        <div
            className={`bg-gradient-to-br ${colors[colorScheme]} rounded-xl border p-4`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
                    {label}
                </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
                {value}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
                {description}
            </p>
        </div>
    );
}
