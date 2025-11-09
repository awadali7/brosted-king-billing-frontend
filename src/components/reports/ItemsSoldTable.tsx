interface ItemsSoldTableProps {
    items: Array<{
        item_name: string;
        item_type: string;
        quantity_sold: string;
        revenue: string;
    }>;
    formatCurrency: (amount: string | number) => string;
}

export default function ItemsSoldTable({
    items,
    formatCurrency,
}: ItemsSoldTableProps) {
    const downloadCSV = () => {
        // Create CSV content
        const headers = ["#", "Item Name", "Type", "Quantity Sold", "Revenue"];
        const rows = items.map((item, i) => [
            i + 1,
            item.item_name,
            item.item_type === "combo" ? "Combo" : "Menu Item",
            item.quantity_sold,
            formatCurrency(item.revenue),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `items-sold-${
            new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] flex items-center gap-2">
                    <span>🛒</span>Items Sold Today
                </h3>
                <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#eb1700] text-white rounded-lg hover:bg-[#c41400] transition-colors text-sm font-medium"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Download CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-[#3F3F46]">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-[#FAFAFA]">
                                #
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
                                Revenue
                            </th>
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
                                    {item.quantity_sold}
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(item.revenue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
