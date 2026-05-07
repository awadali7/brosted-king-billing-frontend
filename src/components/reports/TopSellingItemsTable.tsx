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
    "bg-yellow-100 text-yellow-700",
    "bg-gray-200 text-gray-700",
    "bg-orange-100 text-orange-700",
];

export default function TopSellingItemsTable({
    items,
    formatCurrency,
}: TopSellingItemsTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏆</span>Top Selling Items
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Rank
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Item Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                Type
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                Qty Sold
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                Orders
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                Revenue
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                Avg Price
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                            rankColors[i] ||
                                            "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {i + 1}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                    {item.item_name}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            item.item_type === "combo"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {item.item_type === "combo"
                                            ? "Combo"
                                            : "Menu Item"}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                    {item.total_quantity_sold}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-gray-700">
                                    {item.number_of_orders}
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-bold text-green-600">
                                    {formatCurrency(item.total_revenue)}
                                </td>
                                <td className="py-3 px-4 text-sm text-right text-gray-700">
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
