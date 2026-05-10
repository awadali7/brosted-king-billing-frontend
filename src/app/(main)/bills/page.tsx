"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import * as XLSX from "xlsx";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Trash2,
    Receipt,
    Plus,
    Download,
    X,
} from "lucide-react";
import ViewBillModal from "@/components/bills/ViewBillModal";
import EditBillModal from "@/components/bills/EditBillModal";
import AddBillModal from "@/components/bills/AddBillModal";
import DeleteConfirmModal from "@/components/menu/DeleteConfirmModal";

interface BillItem {
    id: number;
    item_id: number;
    item_name: string;
    item_type: "menu_item" | "combo";
    quantity: number;
    unit_price: string | number;
    total_price: string | number;
}

interface Bill {
    id: number;
    bill_number: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    subtotal: string | number;
    discount_percentage: string | number;
    discount_amount: string | number;
    tax_percentage: string | number;
    tax_amount: string | number;
    total_amount: string | number;
    payment_method: string;
    payment_status: string;
    split_cash_amount?: string | number;
    split_upi_amount?: string | number;
    split_card_amount?: string | number;
    split_other_amount?: string | number;
    notes?: string;
    created_at: string;
    items: BillItem[];
}

const STATUS_FILTERS = ["all", "paid", "pending", "cancelled"] as const;

const statusColors: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
};

const methodIcons: Record<string, string> = {
    cash: "💵",
    card: "💳",
    upi: "📱",
    other: "🔄",
    split: "🔀",
};

function toISODate(d: Date) {
    return d.toISOString().split("T")[0];
}

export default function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [restaurantName, setRestaurantName] = useState("Restaurant");

    const [showAddModal, setShowAddModal] = useState(false);
    const [viewBill, setViewBill] = useState<Bill | null>(null);
    const [editBill, setEditBill] = useState<Bill | null>(null);
    const [deleteBill, setDeleteBill] = useState<Bill | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Export state
    const [showExportPanel, setShowExportPanel] = useState(false);
    const [exportPreset, setExportPreset] = useState<"last7" | "month" | "custom">("last7");
    const [exportFrom, setExportFrom] = useState("");
    const [exportTo, setExportTo] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const exportPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const s = JSON.parse(settingsStr);
                if (s.currency_symbol?.value) setCurrencySymbol(s.currency_symbol.value);
                if (s.restaurant_name?.value) setRestaurantName(s.restaurant_name.value);
            } catch {}
        }
    }, []);

    // Close export panel on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (exportPanelRef.current && !exportPanelRef.current.contains(e.target as Node)) {
                setShowExportPanel(false);
            }
        };
        if (showExportPanel) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showExportPanel]);

    const fetchBills = useCallback(async () => {
        try {
            setLoading(true);
            let response;

            if (search.trim()) {
                response = await api.bills.searchBills(search.trim());
                setBills(response.data || []);
                setTotalPages(1);
                setTotalItems(response.count || 0);
            } else {
                const params: Record<string, any> = { page, limit: 15 };
                if (statusFilter !== "all") params.payment_status = statusFilter;
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;
                response = await api.bills.getBills(params);
                setBills(response.data || []);
                setTotalPages(response.pagination?.total_pages || 1);
                setTotalItems(response.pagination?.total_items || 0);
            }
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Failed to fetch bills");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, startDate, endDate, page]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, startDate, endDate]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    const handleEdit = async (data: any) => {
        if (!editBill) return;
        try {
            await api.bills.updateBill(editBill.id, data);
            toast.success("Bill updated successfully");
            setEditBill(null);
            fetchBills();
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Failed to update bill");
            throw err;
        }
    };

    const handleDelete = async () => {
        if (!deleteBill) return;
        try {
            setIsDeleting(true);
            await api.bills.deleteBill(deleteBill.id);
            toast.success("Bill deleted successfully");
            setDeleteBill(null);
            fetchBills();
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Failed to delete bill");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleExport = async () => {
        let from = exportFrom;
        let to = exportTo;
        const today = new Date();

        if (exportPreset === "last7") {
            const d = new Date(today);
            d.setDate(d.getDate() - 6);
            from = toISODate(d);
            to = toISODate(today);
        } else if (exportPreset === "month") {
            from = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
            to = toISODate(today);
        } else {
            if (!from || !to) {
                toast.error("Please select both From and To dates");
                return;
            }
            if (from > to) {
                toast.error("From date must be before To date");
                return;
            }
        }

        try {
            setIsExporting(true);
            const response = await api.bills.getBills({
                start_date: from,
                end_date: to,
                limit: 9999,
            });
            const data: Bill[] = response.data || [];

            if (data.length === 0) {
                toast.error("No bills found for the selected period");
                return;
            }

            // Build rows
            const rows = data.map((b) => ({
                "Bill #": b.bill_number,
                "Customer Name": b.customer_name || "",
                "Phone": b.customer_phone || "",
                "Email": b.customer_email || "",
                "Items": b.items.map((i) => `${i.item_name} x${i.quantity}`).join(", "),
                "Items Count": b.items.length,
                [`Subtotal (${currencySymbol})`]: parseFloat(String(b.subtotal)).toFixed(2),
                "Discount %": parseFloat(String(b.discount_percentage)).toFixed(2),
                [`Discount (${currencySymbol})`]: parseFloat(String(b.discount_amount)).toFixed(2),
                "Tax %": parseFloat(String(b.tax_percentage)).toFixed(2),
                [`Tax (${currencySymbol})`]: parseFloat(String(b.tax_amount)).toFixed(2),
                [`Total (${currencySymbol})`]: parseFloat(String(b.total_amount)).toFixed(2),
                "Payment Method": b.payment_method,
                "Status": b.payment_status,
                "Date": new Date(b.created_at).toLocaleDateString(),
                "Notes": b.notes || "",
            }));

            const ws = XLSX.utils.json_to_sheet(rows);

            // Column widths
            ws["!cols"] = [
                { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 24 },
                { wch: 40 }, { wch: 10 }, { wch: 14 }, { wch: 12 },
                { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 14 },
                { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 24 },
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Bills");

            const label =
                exportPreset === "last7" ? "Last7Days"
                : exportPreset === "month" ? "ThisMonth"
                : `${from}_to_${to}`;

            XLSX.writeFile(wb, `${restaurantName}_Bills_${label}.xlsx`);
            toast.success(`Exported ${data.length} bills`);
            setShowExportPanel(false);
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Export failed");
        } finally {
            setIsExporting(false);
        }
    };

    const fmt = (val: string | number) =>
        `${currencySymbol}${parseFloat(String(val)).toFixed(2)}`;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Receipt className="w-6 h-6 text-[#eb1700]" />
                        Bills
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalItems} bill{totalItems !== 1 ? "s" : ""} found
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Export Button */}
                    <div className="relative" ref={exportPanelRef}>
                        <button
                            onClick={() => setShowExportPanel((v) => !v)}
                            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export Excel
                        </button>

                        {showExportPanel && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-gray-900">Export Bills to Excel</span>
                                    <button onClick={() => setShowExportPanel(false)} className="text-gray-400 hover:text-gray-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Preset buttons */}
                                <div className="flex gap-2 mb-3">
                                    {(["last7", "month", "custom"] as const).map((preset) => (
                                        <button
                                            key={preset}
                                            onClick={() => setExportPreset(preset)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                exportPreset === preset
                                                    ? "bg-[#eb1700] text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            {preset === "last7" ? "Last 7 Days" : preset === "month" ? "This Month" : "Custom"}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom date range */}
                                {exportPreset === "custom" && (
                                    <div className="space-y-2 mb-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">From</label>
                                            <input
                                                type="date"
                                                value={exportFrom}
                                                onChange={(e) => setExportFrom(e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">To</label>
                                            <input
                                                type="date"
                                                value={exportTo}
                                                onChange={(e) => setExportTo(e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Preset date preview */}
                                {exportPreset !== "custom" && (
                                    <p className="text-xs text-gray-400 mb-3">
                                        {exportPreset === "last7"
                                            ? `${toISODate(new Date(Date.now() - 6 * 86400000))} → ${toISODate(new Date())}`
                                            : `${toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} → ${toISODate(new Date())}`}
                                    </p>
                                )}

                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-center gap-2 bg-[#eb1700] hover:bg-[#c41400] disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {isExporting ? (
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    {isExporting ? "Exporting..." : "Download Excel"}
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Bill
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                if (e.target.value === "") setSearch("");
                            }}
                            placeholder="Search by bill #, customer name, phone..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#eb1700] hover:bg-[#c41400] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Search
                    </button>
                </form>

                {/* Status + Date filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex gap-1.5 flex-wrap">
                        {STATUS_FILTERS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                                    statusFilter === s
                                        ? "bg-[#eb1700] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 ml-auto items-center">
                        <span className="text-xs text-gray-400">From</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                        />
                        <span className="text-xs text-gray-400">To</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                        />
                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(""); setEndDate(""); }}
                                className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#eb1700]" />
                    </div>
                ) : bills.length === 0 ? (
                    <div className="text-center py-16">
                        <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No bills found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto overflow-y-auto max-h-[520px]">
                        <table className="w-full">
                            <thead className="sticky top-0 z-10">
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill #</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Items</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Payment</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bills.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-mono font-semibold text-[#eb1700]">{bill.bill_number}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{bill.customer_name || "—"}</p>
                                            {bill.customer_phone && (
                                                <p className="text-xs text-gray-500">{bill.customer_phone}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <span className="text-sm text-gray-600">
                                                {bill.items.length} item{bill.items.length !== 1 ? "s" : ""}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="text-sm font-semibold text-gray-900">{fmt(bill.total_amount)}</span>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className="text-sm text-gray-600 capitalize">
                                                {methodIcons[bill.payment_method] || ""} {bill.payment_method}
                                            </span>
                                            {bill.payment_method === "split" && (
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {[
                                                        parseFloat(String(bill.split_cash_amount || 0)) > 0 && `Cash: ${fmt(bill.split_cash_amount!)}`,
                                                        parseFloat(String(bill.split_upi_amount || 0)) > 0 && `UPI: ${fmt(bill.split_upi_amount!)}`,
                                                        parseFloat(String(bill.split_card_amount || 0)) > 0 && `Card: ${fmt(bill.split_card_amount!)}`,
                                                        parseFloat(String(bill.split_other_amount || 0)) > 0 && `Other: ${fmt(bill.split_other_amount!)}`,
                                                    ].filter(Boolean).join(" · ")}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[bill.payment_status] || "bg-gray-100 text-gray-600"}`}>
                                                {bill.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="text-xs text-gray-500">
                                                {new Date(bill.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end">
                                                <button
                                                    onClick={() => setViewBill(bill)}
                                                    title="View"
                                                    className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditBill(bill)}
                                                    title="Edit"
                                                    className="p-1.5 text-gray-400 hover:text-[#eb1700] transition-colors rounded-md hover:bg-red-50"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteBill(bill)}
                                                    title="Delete"
                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!search && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddModal && (
                <AddBillModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={() => {
                        toast.success("Bill created successfully");
                        setShowAddModal(false);
                        fetchBills();
                    }}
                />
            )}

            {viewBill && <ViewBillModal bill={viewBill} onClose={() => setViewBill(null)} />}

            {editBill && (
                <EditBillModal
                    bill={editBill}
                    onClose={() => setEditBill(null)}
                    onSave={handleEdit}
                />
            )}

            {deleteBill && (
                <DeleteConfirmModal
                    isOpen={!!deleteBill}
                    onClose={() => setDeleteBill(null)}
                    onConfirm={handleDelete}
                    loading={isDeleting}
                    item={{ name: deleteBill.bill_number }}
                />
            )}
        </div>
    );
}
