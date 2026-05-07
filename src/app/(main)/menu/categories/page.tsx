"use client";

import React, { useCallback, useEffect, useState } from "react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import {
    Plus,
    RefreshCcw,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";
import AddMenuCategoryModal from "@/components/menu/AddMenuCategoryModal";
import DeleteConfirmModal from "@/components/menu/DeleteConfirmModal";
import ViewCategoryModal from "@/components/expenses/ViewCategoryModal";

type Category = {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
};

type CategoriesResponse = {
    success: boolean;
    message: string;
    data: Category[];
    count?: number;
};

export default function MenuCategoriesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // Optional client-side pagination (simple)
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(categories.length / pageSize));
    const canPrev = page > 1;
    const canNext = page < totalPages;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewCategory, setViewCategory] = useState<Category | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await api.get<CategoriesResponse>("/categories");
            if (!res?.success) {
                throw new Error(res?.message || "Failed to fetch categories");
            }
            setCategories(res.data || []);
        } catch (err: any) {
            const message = err?.message || "Failed to load categories";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const pagedCategories = categories.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const handleView = (cat: Category) => {
        setViewCategory(cat);
        setIsViewOpen(true);
    };
    const handleEdit = (cat: Category) => {
        setEditingCategory(cat);
        setIsAddOpen(true);
    };
    const handleDelete = (cat: Category) => {
        setDeleteTarget(cat);
        setIsDeleteOpen(true);
    };
    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleteLoading(true);
            await api.delete(`/categories/${deleteTarget.id}`);
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Loading menu categories...
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
                        Error Loading Categories
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error}
                    </p>
                    <button
                        onClick={fetchCategories}
                        className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="h-screen bg-gray-50 overflow-y-auto scroll-smooth">
                <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
                    {/* Header actions - mirrors Expanse style */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sticky top-0 bg-gray-50 z-10 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="pl-3 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-colors"
                                    onChange={(e) => {
                                        const q = e.target.value.toLowerCase();
                                        if (!q) {
                                            // refetch to reset if needed
                                            fetchCategories();
                                        } else {
                                            setCategories((prev) =>
                                                prev.filter(
                                                    (c) =>
                                                        c.name
                                                            .toLowerCase()
                                                            .includes(q) ||
                                                        (c.description || "")
                                                            .toLowerCase()
                                                            .includes(q)
                                                )
                                            );
                                            setPage(1);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchCategories}
                                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100"
                                title="Refresh"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Refresh
                            </button>
                            <button
                                onClick={() => {
                                    setEditingCategory(null);
                                    setIsAddOpen(true);
                                }}
                                className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                title="Add Category"
                            >
                                <Plus className="w-4 h-4" />
                                Add Category
                            </button>
                        </div>
                    </div>

                    {/* Categories table - styled like Expanse */}
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Menu Categories
                            </h3>
                            <span className="text-xs text-gray-500">
                                {categories.length} total
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-600 border-b border-gray-200">
                                        <th className="py-2 pr-4">ID</th>
                                        <th className="py-2 pr-4">Name</th>
                                        <th className="py-2 pr-4">
                                            Description
                                        </th>
                                        <th className="py-2 pr-4">Created</th>
                                        <th className="py-2 pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedCategories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-6 text-center text-gray-500"
                                            >
                                                No categories found
                                            </td>
                                        </tr>
                                    ) : (
                                        pagedCategories.map((c) => {
                                            const created = c.created_at
                                                ? new Date(
                                                      c.created_at
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "-";
                                            return (
                                                <tr
                                                    key={c.id}
                                                    className="border-b border-gray-100"
                                                >
                                                    <td className="py-3 pr-4 text-gray-900">
                                                        {c.id}
                                                    </td>
                                                    <td className="py-3 pr-4 font-semibold text-gray-900">
                                                        {c.name}
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-700">
                                                        {c.description || "-"}
                                                    </td>
                                                    <td className="py-3 pr-4 text-gray-700">
                                                        {created}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleView(
                                                                        c
                                                                    )
                                                                }
                                                                className="px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                                                title="View"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        c
                                                                    )
                                                                }
                                                                className="px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        c
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
                                Page {page} of {totalPages}
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
            </div>
            {/* Add/Edit Category Modal */}
            <AddMenuCategoryModal
                isOpen={isAddOpen}
                onClose={() => {
                    setIsAddOpen(false);
                    setEditingCategory(null);
                }}
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
                          }
                        : null
                }
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
                              name: deleteTarget.name,
                              image_url: null,
                          }
                        : null
                }
                loading={deleteLoading}
                itemType="item"
            />
            {/* View Category Modal */}
            <ViewCategoryModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setViewCategory(null);
                }}
                category={
                    viewCategory
                        ? {
                              id: viewCategory.id,
                              name: viewCategory.name,
                              description: viewCategory.description || "",
                              created_at: viewCategory.created_at,
                              // Optional fields not present for menu category:
                              color: undefined,
                              icon: undefined,
                              is_active: undefined,
                              updated_at: undefined,
                          }
                        : null
                }
            />
        </>
    );
}
