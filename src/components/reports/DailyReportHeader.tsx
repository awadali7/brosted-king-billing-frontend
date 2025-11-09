interface DailyReportHeaderProps {
    date: string;
    onRefresh: () => void;
    formatDate: (date: string) => string;
}

export default function DailyReportHeader({
    date,
    onRefresh,
    formatDate,
}: DailyReportHeaderProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-4 flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-[#A1A1AA]">
                    Report Date
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mt-1">
                    {formatDate(date)}
                </p>
            </div>
            <button
                onClick={onRefresh}
                className="p-2 text-gray-600 dark:text-[#A1A1AA] hover:text-[#eb1700] transition-colors"
                title="Refresh"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
            </button>
        </div>
    );
}
