"use client";

import React, { useEffect, useState } from "react";
import { X, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface AddMenuCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editCategory?: {
        id: number;
        name: string;
        description?: string;
    } | null;
}

export default function AddMenuCategoryModal({
    isOpen,
    onClose,
    onSuccess,
    editCategory = null,
}: AddMenuCategoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: "", description: "" });
            setErrors({});
        } else if (isOpen && editCategory) {
            setFormData({
                name: editCategory.name || "",
                description: editCategory.description || "",
            });
        }
    }, [isOpen, editCategory]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setLoading(true);
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
            };
            let response;
            if (editCategory?.id) {
                response = await api.put(
                    `/categories/${editCategory.id}`,
                    payload
                );
            } else {
                response = await api.post("/categories", payload);
            }
            if (response?.success === false) {
                const msg =
                    response?.message ||
                    (editCategory
                        ? "Failed to update category"
                        : "Failed to add category");
                toast.error(msg);
                setErrors({ submit: msg });
                return;
            }
            toast.success(
                response?.message ||
                    (editCategory
                        ? "Category updated successfully"
                        : "Category added successfully")
            );
            onSuccess();
            onClose();
        } catch (err: any) {
            const msg =
                err?.data?.message ||
                err?.data?.detail ||
                err?.message ||
                (editCategory
                    ? "Failed to update category"
                    : "Failed to add category");
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
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Tag className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {editCategory ? "Edit Category" : "Add Category"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="modal-scroll flex-1 p-4 space-y-4"
                >
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Category name"
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                    errors.name
                                        ? "border-red-300"
                                        : "border-gray-300"
                                } bg-white text-gray-900 placeholder-gray-500`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Short description"
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">
                                {errors.submit}
                            </p>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#eb1700] hover:bg-[#c41400] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25 focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:ring-offset-2"
                    >
                        {loading
                            ? "Saving..."
                            : editCategory
                            ? "Update Category"
                            : "Save Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}
