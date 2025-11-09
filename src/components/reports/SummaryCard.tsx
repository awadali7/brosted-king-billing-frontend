interface SummaryCardProps {
    emoji: string;
    label: string;
    value: string;
    description: string;
    colorScheme: "green" | "blue" | "purple" | "orange";
}

const colors = {
    green: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30",
    blue: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30",
    purple: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30",
    orange: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800/30",
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
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                    {label}
                </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                {value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-[#A1A1AA] mt-1">
                {description}
            </p>
        </div>
    );
}
