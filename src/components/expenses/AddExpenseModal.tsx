"use client";

import React, { useEffect, useState } from "react";
import { X, Receipt, Calendar } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";

type ExpenseCategory = {
    id: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_active?: boolean;
};

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editExpense?: {
        id: number;
        amount: string | number;
        category_id: number;
        description: string;
        date: string;
        payment_method: string;
        vendor_name?: string;
        receipt_number?: string;
        notes?: string;
    } | null;
}

export default function AddExpenseModal({
    isOpen,
    onClose,
    onSuccess,
    editExpense = null,
}: AddExpenseModalProps) {
    const [formData, setFormData] = useState({
        amount: "",
        category_id: "",
        description: "",
        date: "",
        payment_method: "",
        vendor_name: "",
        receipt_number: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
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
            toast.error("Failed to load categories");
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                amount: "",
                category_id: "",
                description: "",
                date: new Date().toISOString().split("T")[0],
                payment_method: "",
                vendor_name: "",
                receipt_number: "",
                notes: "",
            });
            setErrors({});
        } else if (isOpen && editExpense) {
            setFormData({
                amount: String(editExpense.amount ?? ""),
                category_id: String(editExpense.category_id ?? ""),
                description: editExpense.description ?? "",
                date: editExpense.date
                    ? editExpense.date.split("T")[0] || editExpense.date
                    : new Date().toISOString().split("T")[0],
                payment_method: editExpense.payment_method ?? "",
                vendor_name: editExpense.vendor_name ?? "",
                receipt_number: editExpense.receipt_number ?? "",
                notes: editExpense.notes ?? "",
            });
        } else if (isOpen && !formData.date) {
            setFormData((prev) => ({
                ...prev,
                date: new Date().toISOString().split("T")[0],
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, editExpense]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = "Valid amount is required";
        }
        if (!formData.category_id) {
            newErrors.category_id = "Category is required";
        }
        if (!formData.date) {
            newErrors.date = "Date is required";
        }
        if (!formData.payment_method) {
            newErrors.payment_method = "Payment method is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setLoading(true);
            const payload = {
                amount: Number(formData.amount),
                category_id: Number(formData.category_id),
                description: formData.description,
                date: formData.date,
                payment_method: formData.payment_method,
                vendor_name: formData.vendor_name || undefined,
                receipt_number: formData.receipt_number || undefined,
                notes: formData.notes || undefined,
            };
            let response;
            if (editExpense?.id) {
                response = await api.put(
                    `/expenses/${editExpense.id}`,
                    payload
                );
            } else {
                response = await api.post("/expenses", payload);
            }
            if (response?.success === false) {
                const msg =
                    response?.message ||
                    (editExpense
                        ? "Failed to update expense"
                        : "Failed to add expense");
                toast.error(msg);
                setErrors({ submit: msg });
                return;
            }
            toast.success(
                response?.message ||
                    (editExpense
                        ? "Expense updated successfully"
                        : "Expense added successfully")
            );
            onSuccess();
            onClose();
        } catch (err: any) {
            let msg =
                err?.data?.message ||
                err?.data?.detail ||
                err?.message ||
                (editExpense
                    ? "Failed to update expense"
                    : "Failed to add expense");
            toast.error(msg);
            setErrors({ submit: msg });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            {editExpense ? "Edit Expense" : "Add Expense"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="modal-scroll flex-1 p-4 space-y-4"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Amount *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                    errors.amount
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]`}
                            />
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.amount}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Category *
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                disabled={categoriesLoading}
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                    errors.category_id
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] disabled:opacity-50`}
                            >
                                <option value="">
                                    {categoriesLoading
                                        ? "Loading..."
                                        : "Select category"}
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Payment Method *
                            </label>
                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                    errors.payment_method
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA]`}
                            >
                                <option value="">Select method</option>
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                                <option value="bank_transfer">
                                    Bank Transfer
                                </option>
                            </select>
                            {errors.payment_method && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.payment_method}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Date *
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                        errors.date
                                            ? "border-red-300 dark:border-red-600"
                                            : "border-gray-300 dark:border-[#3F3F46]"
                                    } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA]`}
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {errors.date && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Vendor Name
                            </label>
                            <input
                                type="text"
                                name="vendor_name"
                                value={formData.vendor_name}
                                onChange={handleInputChange}
                                placeholder="State Electricity Board"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Receipt Number
                            </label>
                            <input
                                type="text"
                                name="receipt_number"
                                value={formData.receipt_number}
                                onChange={handleInputChange}
                                placeholder="INV-2025-001"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Monthly electricity bill"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Paid on time"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none resize-none"
                        />
                    </div>

                    {/* Error */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.submit}
                            </p>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#27272A]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-gray-300 dark:border-[#3F3F46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#eb1700] hover:bg-[#c41400] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25 focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:ring-offset-2 dark:focus:ring-offset-[#18181B]"
                    >
                        {loading
                            ? "Saving..."
                            : editExpense
                            ? "Update Expense"
                            : "Save Expense"}
                    </button>
                </div>
            </div>
        </div>
    );
}
