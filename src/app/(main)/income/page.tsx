"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/utils/api";
import AddIncomeModal from "../../../components/income/AddIncomeModal";
import ViewIncomeModal from "../../../components/income/ViewIncomeModal";
import DeleteConfirmModal from "../../../components/menu/DeleteConfirmModal";
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

type IncomeRecord = {
    id: number;
    amount: string;
    source: "catering" | "delivery" | "events" | "tips" | "other" | string;
    description: string;
    date: string; // ISO
    payment_method: "cash" | "card" | "upi" | string;
    notes: string;
    created_at: string;
    updated_at: string;
};

type IncomeApiResponse = {
    success: boolean;
    message: string;
    data: IncomeRecord[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
    };
};

export default function IncomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // Filters
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const [source, setSource] = useState<string>("");
    // removed filters: paymentMethod, search

    const [records, setRecords] = useState<IncomeRecord[]>([]);
    const [pagination, setPagination] = useState<
        IncomeApiResponse["pagination"]
    >({
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: limit,
    });
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewId, setViewId] = useState<number | null>(null);
    const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(
        null
    );
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<IncomeRecord | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const fetchIncome = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const params: Record<string, any> = {
                page,
                limit,
            };
            if (selectedDate) params.date = selectedDate;
            if (source) params.source = source;
            // removed params: payment_method, search

            // Backend base URL is configured in NEXT_PUBLIC_API_URL, endpoint expected at /income
            const res = await api.get<IncomeApiResponse>("/income", params);
            if (!res.success) {
                throw new Error(res.message || "Failed to fetch income");
            }
            setRecords(res.data || []);
            setPagination(res.pagination);
        } catch (err: any) {
            const message = err?.message || "Failed to load income records";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, selectedDate, source]);

    useEffect(() => {
        fetchIncome();
    }, [fetchIncome]);

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

    const handleAddIncome = () => {
        setIsAddOpen(true);
    };

    const handleView = (id: number) => {
        setViewId(id);
        setIsViewOpen(true);
    };

    const handleEdit = (id: number) => {
        const record = records.find((r) => r.id === id) || null;
        setEditingIncome(record);
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
            await api.delete(`/income/${deleteTarget.id}`);
            toast.success("Income deleted");
            setIsDeleteOpen(false);
            setDeleteTarget(null);
            fetchIncome();
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete income");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0F0F0F] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-[#A1A1AA]">
                        Loading income...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0F0F0F] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA] mb-2">
                        Error Loading Income
                    </h2>
                    <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                        {error}
                    </p>
                    <button
                        onClick={fetchIncome}
                        className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-[#0F0F0F] overflow-y-auto scroll-smooth">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
                {/* Header with filters - mirrors Dashboard style */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 bg-gray-50 dark:bg-[#0F0F0F] z-10 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg bg-white dark:bg-[#18181B] text-gray-900 dark:text-[#FAFAFA] focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-colors"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                            onClick={handleToday}
                            className="px-4 py-2 text-sm border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] rounded-lg hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                        >
                            Today
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={source}
                                onChange={(e) => {
                                    setPage(1);
                                    setSource(e.target.value);
                                }}
                                className="text-sm border border-gray-300 dark:border-[#3F3F46] rounded-lg px-3 py-2 bg-white dark:bg-[#18181B] text-gray-900 dark:text-[#FAFAFA]"
                            >
                                <option value="">All sources</option>
                                <option value="catering">Catering</option>
                                <option value="delivery">Delivery</option>
                                <option value="events">Events</option>
                                <option value="tips">Tips</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button
                            onClick={handleAddIncome}
                            className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Income
                        </button>
                    </div>
                </div>

                {/* Summary cards - compact, similar to dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Total Income (page)
                            </span>
                            <DollarSign className="w-4 h-4 text-[#eb1700]" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {totals.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            {totals.count} records
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Cash
                            </span>
                            <Wallet className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {(totals.byMethod.cash || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            by payment method
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Card
                            </span>
                            <Receipt className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {(totals.byMethod.card || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            by payment method
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#18181B] rounded-lg p-4 border border-gray-200 dark:border-[#3F3F46]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                UPI
                            </span>
                            <Receipt className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                            {currencySymbol}
                            {(totals.byMethod.upi || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-[#71717A] mt-1">
                            by payment method
                        </p>
                    </div>
                </div>

                {/* Records table */}
                <div className="bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Income Records
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-[#71717A]">
                            Page {pagination.current_page} of{" "}
                            {pagination.total_pages} • {pagination.total_items}{" "}
                            total
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-600 dark:text-[#A1A1AA] border-b border-gray-200 dark:border-[#3F3F46]">
                                    <th className="py-2 pr-4">Date</th>
                                    <th className="py-2 pr-4">Amount</th>
                                    <th className="py-2 pr-4">Source</th>
                                    <th className="py-2 pr-4">Payment</th>
                                    <th className="py-2 pr-4">Description</th>
                                    <th className="py-2 pr-4">Notes</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-6 text-center text-gray-500 dark:text-[#71717A]"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((r) => {
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
                                                className="border-b border-gray-100 dark:border-[#27272A]"
                                            >
                                                <td className="py-3 pr-4 text-gray-900 dark:text-[#FAFAFA]">
                                                    {displayDate}
                                                </td>
                                                <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                                    {currencySymbol}
                                                    {Number(r.amount).toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="py-3 pr-4 capitalize">
                                                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-[#27272A] text-gray-700 dark:text-[#A1A1AA]">
                                                        {r.source}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 uppercase">
                                                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-[#27272A] text-gray-700 dark:text-[#A1A1AA]">
                                                        {r.payment_method}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700 dark:text-[#A1A1AA]">
                                                    {r.description}
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700 dark:text-[#A1A1AA]">
                                                    {r.notes}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(r.id)
                                                            }
                                                            className="px-2 py-1 rounded border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(r.id)
                                                            }
                                                            className="px-2 py-1 rounded border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
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
                                                            disabled={
                                                                deletingId ===
                                                                r.id
                                                            }
                                                            className={`px-2 py-1 rounded border transition-colors ${
                                                                deletingId ===
                                                                r.id
                                                                    ? "border-gray-200 dark:border-[#27272A] text-gray-400 cursor-not-allowed"
                                                                    : "border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-[#3F1D1D]"
                                                            }`}
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
                                    ? "border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A]"
                                    : "border-gray-200 dark:border-[#27272A] text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </button>
                        <div className="text-xs text-gray-500 dark:text-[#71717A]">
                            Showing {(page - 1) * limit + 1}-
                            {Math.min(page * limit, pagination.total_items)} of{" "}
                            {pagination.total_items}
                        </div>
                        <button
                            disabled={!canNext}
                            onClick={() => canNext && setPage((p) => p + 1)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${
                                canNext
                                    ? "border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A]"
                                    : "border-gray-200 dark:border-[#27272A] text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Income Modal */}
            <AddIncomeModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={() => {
                    setIsAddOpen(false);
                    setEditingIncome(null);
                    fetchIncome();
                }}
                editIncome={
                    editingIncome
                        ? {
                              id: editingIncome.id,
                              amount: editingIncome.amount,
                              source: editingIncome.source,
                              description: editingIncome.description,
                              date: editingIncome.date,
                              payment_method: editingIncome.payment_method,
                              notes: editingIncome.notes,
                          }
                        : null
                }
            />
            {/* View Income Modal */}
            <ViewIncomeModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setViewId(null);
                }}
                incomeId={viewId}
            />
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
                                  `Income #${deleteTarget.id}`,
                              image_url: null,
                          }
                        : null
                }
                loading={deleteLoading}
                itemType="item"
            />
        </div>
    );
}
