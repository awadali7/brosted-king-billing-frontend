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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>{emoji}</span>
                {title}
            </h3>
            {items.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    No items found
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    #
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Item
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                    Category
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                    Qty
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                    Revenue
                                </th>
                                {showProfit && (
                                    <>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                            Profit
                                        </th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
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
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        {i + 1}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.item_name}
                                            </p>
                                            <span
                                                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                                                    item.item_type === "combo"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {item.item_type === "combo"
                                                    ? "Combo"
                                                    : "Item"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {item.category_name || "—"}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                        {item.total_quantity_sold}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right font-bold text-green-600">
                                        {formatCurrency(item.total_revenue)}
                                    </td>
                                    {showProfit && (
                                        <>
                                            <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                                {formatCurrency(
                                                    item.total_profit
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-700">
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
