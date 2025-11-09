interface TopSellingItemsTableProps {
    items: Array<{
        item_name: string;
        item_type: string;
        total_quantity_sold: string;
        total_revenue: string;
        number_of_orders: string;
        average_price: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

const rankColors = [
    "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    "bg-gray-200 dark:bg-gray-700/20 text-gray-700 dark:text-gray-400",
    "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
];

export default function TopSellingItemsTable({
    items,
    formatCurrency,
}: TopSellingItemsTableProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 flex items-center gap-2">
                <span>🏆</span>Top Selling Items
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-[#3F3F46]">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Rank
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Item Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Type
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Qty Sold
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Orders
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Revenue
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                Avg Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-100 dark:border-[#27272A] hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                            rankColors[i] ||
                                            "bg-gray-100 dark:bg-[#27272A] text-gray-600 dark:text-[#A1A1AA]"
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                                    {item.item_name}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            item.item_type === "combo"
                                                ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400"
                                                : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                        }`}
                                    >
                                        {item.item_type === "combo"
                                            ? "Combo"
                                            : "Menu Item"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                    {item.total_quantity_sold}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-[#A1A1AA]">
                                    {item.number_of_orders}
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(item.total_revenue)}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-gray-700 dark:text-[#A1A1AA]">
                                    {formatCurrency(item.average_price)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
