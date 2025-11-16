"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { Plus, Eye, Pencil, Trash2, Tag } from "lucide-react";
import DeleteConfirmModal from "@/components/menu/DeleteConfirmModal";
import AddCategoryModal from "@/components/expenses/AddCategoryModal";
import ViewCategoryModal from "@/components/expenses/ViewCategoryModal";

type ExpenseCategory = {
    id: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
};

type CategoriesResponse = {
    success: boolean;
    message: string;
    data: ExpenseCategory[];
    count: number;
};

export default function CategoriesPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<ExpenseCategory | null>(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewCategory, setViewCategory] = useState<ExpenseCategory | null>(
        null
    );

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ExpenseCategory | null>(
        null
    );
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get<CategoriesResponse>(
                "/expenses/categories"
            );
            if (!res.success) throw new Error(res.message || "Failed to fetch");
            setCategories(res.data || []);
        } catch (err: any) {
            const msg = err?.message || "Failed to load categories";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAdd = () => {
        setEditingCategory(null);
        setIsAddOpen(true);
    };
    const handleEdit = (cat: ExpenseCategory) => {
        setEditingCategory(cat);
        setIsAddOpen(true);
    };
    const handleView = (cat: ExpenseCategory) => {
        setViewCategory(cat);
        setIsViewOpen(true);
    };
    const handleDelete = (cat: ExpenseCategory) => {
        setDeleteTarget(cat);
        setIsDeleteOpen(true);
    };
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleteLoading(true);
            await api.delete(`/expenses/categories/${deleteTarget.id}`);
            toast.success("Category deleted");
            setIsDeleteOpen(false);
            setDeleteTarget(null);
            fetchCategories();
        } catch (err: any) {
            toast.error(err?.message || "Failed to delete category");
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-600 dark:text-[#A1A1AA]">
                Loading categories...
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-5xl mb-3">⚠️</div>
                    <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                        {error}
                    </p>
                    <button
                        onClick={fetchCategories}
                        className="bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#eb1700]" />
                    Expense Categories
                </h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-4">
                {categories.length === 0 ? (
                    <div className="py-12 text-center text-gray-600 dark:text-[#A1A1AA]">
                        No categories yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-600 dark:text-[#A1A1AA] border-b border-gray-200 dark:border-[#3F3F46]">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Description</th>
                                    <th className="py-2 pr-4">Color</th>
                                    <th className="py-2 pr-4">Icon</th>
                                    <th className="py-2 pr-4">Status</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr
                                        key={cat.id}
                                        className="border-b border-gray-100 dark:border-[#27272A]"
                                    >
                                        <td className="py-3 pr-4 text-gray-900 dark:text-[#FAFAFA]">
                                            {cat.name}
                                        </td>
                                        <td className="py-3 pr-4 text-gray-700 dark:text-[#A1A1AA]">
                                            {cat.description || "-"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="inline-flex items-center gap-2">
                                                <span
                                                    className="inline-block w-4 h-4 rounded"
                                                    style={{
                                                        background:
                                                            cat.color || "#ccc",
                                                    }}
                                                />
                                                <span className="text-gray-700 dark:text-[#A1A1AA]">
                                                    {cat.color || "-"}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 text-gray-700 dark:text-[#A1A1AA]">
                                            {cat.icon || "-"}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span
                                                className={`px-2 py-0.5 rounded text-xs ${
                                                    cat.is_active
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-700 dark:bg-[#27272A] dark:text-[#A1A1AA]"
                                                }`}
                                            >
                                                {cat.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleView(cat)
                                                    }
                                                    className="px-2 py-1 rounded border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEdit(cat)
                                                    }
                                                    className="px-2 py-1 rounded border border-gray-300 dark:border-[#3F3F46] text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(cat)
                                                    }
                                                    className="px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-[#3F1D1D] transition-colors"
                                                    title="Delete"
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

            {/* Add/Edit Modal */}
            <AddCategoryModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={() => {
                    setIsAddOpen(false);
                    setEditingCategory(null);
                    fetchCategories();
                }}
                editCategory={
                    editingCategory
                        ? {
                              id: editingCategory.id,
                              name: editingCategory.name,
                              description: editingCategory.description || "",
                              color: editingCategory.color || "#FF6B6B",
                              icon: editingCategory.icon || "bolt",
                              is_active:
                                  editingCategory.is_active === undefined
                                      ? true
                                      : editingCategory.is_active,
                          }
                        : null
                }
            />

            {/* View Modal */}
            <ViewCategoryModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setViewCategory(null);
                }}
                category={viewCategory}
            />

            {/* Delete Modal */}
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
                              name: deleteTarget.name,
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
