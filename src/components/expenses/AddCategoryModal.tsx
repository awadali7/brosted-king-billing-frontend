"use client";

import React, { useEffect, useState } from "react";
import { X, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editCategory?: {
        id: number;
        name: string;
        description?: string;
        color: string;
        icon: string;
        is_active: boolean;
    } | null;
}

export default function AddCategoryModal({
    isOpen,
    onClose,
    onSuccess,
    editCategory = null,
}: AddCategoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: "",
                description: "",
                is_active: true,
            });
            setErrors({});
        } else if (isOpen && editCategory) {
            setFormData({
                name: editCategory.name || "",
                description: editCategory.description || "",
                is_active:
                    editCategory.is_active === undefined
                        ? true
                        : editCategory.is_active,
            });
        }
    }, [isOpen, editCategory]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
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
                is_active: Boolean(formData.is_active),
            };
            let response;
            if (editCategory?.id) {
                response = await api.put(
                    `/expenses/categories/${editCategory.id}`,
                    payload
                );
            } else {
                response = await api.post("/expenses/categories", payload);
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
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Tag className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            Add Expense Category
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Utilities"
                            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                errors.name
                                    ? "border-red-300 dark:border-red-600"
                                    : "border-gray-300 dark:border-[#3F3F46]"
                            } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA]`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Electricity, water, gas bills"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="is_active"
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_active: e.target.checked,
                                }))
                            }
                            className="h-4 w-4 rounded border-gray-300 dark:border-[#3F3F46] text-[#eb1700] focus:ring-[#eb1700]"
                        />
                        <label
                            htmlFor="is_active"
                            className="text-sm text-gray-700 dark:text-[#A1A1AA]"
                        >
                            Active
                        </label>
                    </div>

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
                        {loading ? "Saving..." : "Save Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}
