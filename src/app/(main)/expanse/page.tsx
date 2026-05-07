"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import {
    Calendar,
    DollarSign,
    Receipt,
    Wallet,
    Filter,
    ChevronLeft,
    ChevronRight,
    Plus,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
import DeleteConfirmModal from "@/components/menu/DeleteConfirmModal";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import AddCategoryModal from "@/components/expenses/AddCategoryModal";
import ViewExpenseModal from "@/components/expenses/ViewExpenseModal";

type ExpenseRecord = {
    id: number;
    amount: string;
    category_id: number;
    category_name?: string;
    category_color?: string;
    category_icon?: string;
    description: string;
    date: string; // ISO
    payment_method: "cash" | "card" | "upi" | string;
    vendor_name?: string;
    receipt_number?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
};

type ExpenseApiResponse = {
    success: boolean;
    message: string;
    data: ExpenseRecord[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
    };
};

type ExpenseCategory = {
    id: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_active?: boolean;
};

export default function ExpansePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);

    // Filters
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    // removed search filter

    const [records, setRecords] = useState<ExpenseRecord[]>([]);
    const [pagination, setPagination] = useState<
        ExpenseApiResponse["pagination"]
    >({
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: limit,
    });
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ExpenseRecord | null>(
        null
    );
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(
        null
    );
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewExpense, setViewExpense] = useState<ExpenseRecord | null>(null);

    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (!settingsStr) return;
        try {
            const settings = JSON.parse(settingsStr);
            if (settings.currency_symbol?.value) {
                setCurrencySymbol(settings.currency_symbol.value);
            }
        } catch {
            // ignore
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get<{
                success: boolean;
                message: string;
                data: ExpenseCategory[];
                count: number;
            }>("/expenses/categories");
            if (res.success && res.data) {
                // Filter only active categories
                setCategories(res.data.filter((cat) => cat.is_active));
            }
        } catch (err: any) {
            console.error("Failed to fetch categories:", err);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const fetchExpenses = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const params: Record<string, any> = {
                page,
                limit,
            };
            if (selectedDate) params.date = selectedDate;
            if (categoryId) params.category_id = categoryId;
            if (paymentMethod) params.payment_method = paymentMethod;
            // removed search param

            const res = await api.get<ExpenseApiResponse>("/expenses", params);
            if (!res.success) {
                throw new Error(res.message || "Failed to fetch expenses");
            }
            setRecords(res.data || []);
            setPagination(res.pagination);
        } catch (err: any) {
            const message = err?.message || "Failed to load expense records";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, selectedDate, categoryId, paymentMethod]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const totals = useMemo(() => {
        const total = records.reduce(
            (sum, r) => sum + Number(r.amount || 0),
            0
        );
        const count = records.length;
        const byMethod = records.reduce<Record<string, number>>((acc, r) => {
            const key = r.payment_method || "other";
            acc[key] = (acc[key] || 0) + Number(r.amount || 0);
            return acc;
        }, {});
        return { total, count, byMethod };
    }, [records]);

    const handleToday = () => {
        const today = new Date();
        setSelectedDate(today.toISOString().split("T")[0]);
    };

    const canPrev = page > 1;
    const canNext = page < (pagination?.total_pages || 1);

    const handleAddExpense = () => {
        setEditingExpense(null);
        setIsAddOpen(true);
    };
    const handleAddCategory = () => {
        setIsAddCategoryOpen(true);
    };
    const handleView = (id: number) => {
        const rec = records.find((r) => r.id === id) || null;
        setViewExpense(rec);
        setIsViewOpen(true);
    };
    const handleEdit = (id: number) => {
        const rec = records.find((r) => r.id === id) || null;
        setEditingExpense(rec);
        setIsAddOpen(true);
    };
    const handleDelete = (id: number) => {
        const record = records.find((r) => r.id === id) || null;
        setDeleteTarget(record);
        setIsDeleteOpen(true);
    };
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleteLoading(true);
            await api.delete(`/expenses/${deleteTarget.id}`);
            toast.success("Expense deleted");
            setIsDeleteOpen(false);
            setDeleteTarget(null);
            fetchExpenses();
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete expense");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading expenses...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Error Loading Expenses
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={fetchExpenses}
                        className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 overflow-y-auto scroll-smooth">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
                {/* Header with filters - mirrors Income style */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 bg-gray-50 z-10 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-colors"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                            onClick={handleToday}
                            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Today
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters((s) => !s)}
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                            title="Toggle Filters"
                        >
                            <Filter className="w-4 h-4" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                        <button
                            onClick={handleAddCategory}
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                            title="Add Category"
                        >
                            <Plus className="w-4 h-4" />
                            Add Category
                        </button>
                        <button
                            onClick={handleAddExpense}
                            className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                            title="Add Expense"
                        >
                            <Plus className="w-4 h-4" />
                            Add Expense
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => {
                                        setPage(1);
                                        setCategoryId(e.target.value);
                                    }}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900"
                                >
                                    <option value="">All categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Payment method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => {
                                        setPage(1);
                                        setPaymentMethod(e.target.value);
                                    }}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900"
                                >
                                    <option value="">All payments</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">
                                Total Expenses (page)
                            </span>
                            <DollarSign className="w-4 h-4 text-[#eb1700]" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {currencySymbol}
                            {totals.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {totals.count} records
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">
                                Cash
                            </span>
                            <Wallet className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {currencySymbol}
                            {(totals.byMethod.cash || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            by payment method
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">
                                Card
                            </span>
                            <Receipt className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {currencySymbol}
                            {(totals.byMethod.card || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            by payment method
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">
                                UPI
                            </span>
                            <Receipt className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                            {currencySymbol}
                            {(totals.byMethod.upi || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            by payment method
                        </p>
                    </div>
                </div>

                {/* Records table */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Expense Records
                        </h3>
                        <span className="text-xs text-gray-500">
                            Page {pagination.current_page} of{" "}
                            {pagination.total_pages} • {pagination.total_items}{" "}
                            total
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-600 border-b border-gray-200">
                                    <th className="py-2 pr-4">Sl No</th>
                                    <th className="py-2 pr-4">Date</th>
                                    <th className="py-2 pr-4">Amount</th>
                                    <th className="py-2 pr-4">Category</th>
                                    <th className="py-2 pr-4">Payment</th>
                                    <th className="py-2 pr-4">Description</th>
                                    <th className="py-2 pr-4">Vendor</th>
                                    <th className="py-2 pr-4">Receipt #</th>
                                    <th className="py-2 pr-4">Notes</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            className="py-6 text-center text-gray-500"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((r, index) => {
                                        const date = new Date(r.date);
                                        const displayDate =
                                            date.toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            });
                                        return (
                                            <tr
                                                key={r.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 pr-4 text-gray-600">
                                                    {(page - 1) * limit +
                                                        index +
                                                        1}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-900">
                                                    {displayDate}
                                                </td>
                                                <td className="py-3 pr-4 font-semibold text-gray-900">
                                                    {currencySymbol}
                                                    {Number(r.amount).toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span
                                                        className="inline-block px-2 py-0.5 rounded text-gray-900"
                                                        style={{
                                                            background:
                                                                r.category_color ||
                                                                "#F3F4F6",
                                                        }}
                                                        title={
                                                            r.category_name ||
                                                            "Category"
                                                        }
                                                    >
                                                        {r.category_name ||
                                                            `#${r.category_id}`}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 uppercase">
                                                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                                        {r.payment_method}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700">
                                                    <span
                                                        className="block max-w-[200px] truncate"
                                                        title={r.description}
                                                    >
                                                        {r.description}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700">
                                                    {r.vendor_name || "-"}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700">
                                                    {r.receipt_number || "-"}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700">
                                                    {r.notes || "-"}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(r.id)
                                                            }
                                                            className="px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(r.id)
                                                            }
                                                            className="px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    r.id
                                                                )
                                                            }
                                                            className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <button
                            disabled={!canPrev}
                            onClick={() => canPrev && setPage((p) => p - 1)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                                canPrev
                                    ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <div className="text-xs text-gray-500">
                            Showing {(page - 1) * limit + 1}-
                            {Math.min(page * limit, pagination.total_items)} of{" "}
                            {pagination.total_items}
                        </div>
                        <button
                            disabled={!canNext}
                            onClick={() => canNext && setPage((p) => p + 1)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                                canNext
                                    ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    : "border-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => {
                    if (deleteLoading) return;
                    setIsDeleteOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDelete}
                item={
                    deleteTarget
                        ? {
                              id: deleteTarget.id,
                              name:
                                  deleteTarget.description ||
                                  `Expense #${deleteTarget.id}`,
                              image_url: null,
                          }
                        : null
                }
                loading={deleteLoading}
                itemType="item"
            />
            {/* Add/Edit Expense Modal */}
            <AddExpenseModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={() => {
                    setIsAddOpen(false);
                    setEditingExpense(null);
                    fetchExpenses();
                }}
                editExpense={
                    editingExpense
                        ? {
                              id: editingExpense.id,
                              amount: editingExpense.amount,
                              category_id: editingExpense.category_id,
                              description: editingExpense.description,
                              date: editingExpense.date,
                              payment_method: editingExpense.payment_method,
                              vendor_name: editingExpense.vendor_name || "",
                              receipt_number:
                                  editingExpense.receipt_number || "",
                              notes: editingExpense.notes || "",
                          }
                        : null
                }
            />
            {/* Add Category Modal */}
            <AddCategoryModal
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                onSuccess={() => {
                    setIsAddCategoryOpen(false);
                    // Optionally refetch categories if later made dynamic
                    toast.success("Category list will reflect on next fetch");
                }}
            />
            {/* View Expense Modal */}
            <ViewExpenseModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setViewExpense(null);
                }}
                expense={viewExpense}
            />
        </div>
    );
}
