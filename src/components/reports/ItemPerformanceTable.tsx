interface ItemPerformanceTableProps {
    title: string;
    emoji: string;
    items: Array<{
        item_name: string;
        item_type: string;
        total_quantity_sold: string;
        total_revenue: string;
        total_profit: number;
        profit_percentage: number;
        category_name: string | null;
    }>;
    formatCurrency: (amount: string | number) => string;
    showProfit?: boolean;
}

export default function ItemPerformanceTable({
    title,
    emoji,
    items,
    formatCurrency,
    showProfit = true,
}: ItemPerformanceTableProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>{emoji}</span>
                {title}
            </h3>
            {items.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-[#A1A1AA] py-8">
                    No items found
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-[#3F3F46]">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                    #
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                    Item
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                    Category
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                    Qty
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                    Revenue
                                </th>
                                {showProfit && (
                                    <>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                            Profit
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                            Margin
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr
                                    key={i}
                                    className="border-b border-gray-100 dark:border-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-[#A1A1AA]">
                                        {i + 1}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                                                {item.item_name}
                                            </p>
                                            <span
                                                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                                                    item.item_type === "combo"
                                                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                                                        : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                                }`}
                                            >
                                                {item.item_type === "combo"
                                                    ? "Combo"
                                                    : "Item"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-[#A1A1AA]">
                                        {item.category_name || "—"}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                        {item.total_quantity_sold}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(item.total_revenue)}
                                    </td>
                                    {showProfit && (
                                        <>
                                            <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                                {formatCurrency(
                                                    item.total_profit
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-[#A1A1AA]">
                                                {item.profit_percentage.toFixed(
                                                    2
                                                )}
                                                %
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
