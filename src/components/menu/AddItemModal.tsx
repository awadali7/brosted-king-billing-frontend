"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Link } from "lucide-react";
import { api } from "@/utils/api";
import { CategoryInfo, MenuItem } from "@/types/menu";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editItem?: MenuItem | null;
}

interface FormData {
    name: string;
    description: string;
    make_price: number;
    price: number;
    category_id: number;
    image_url: string | null;
}

type FormErrors = {
    [K in keyof FormData]?: string;
};

export default function AddItemModal({
    isOpen,
    onClose,
    onSuccess,
    editItem,
}: AddItemModalProps) {
    const [categories, setCategories] = useState<CategoryInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        description: "",
        make_price: 0,
        price: 0,
        category_id: 0,
        image_url: null,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [currencySymbol, setCurrencySymbol] = useState("₹");

    // Load currency symbol from localStorage
    useEffect(() => {
        const settingsStr = localStorage.getItem("settings");
        if (settingsStr) {
            try {
                const settings = JSON.parse(settingsStr);
                if (settings.currency_symbol?.value) {
                    setCurrencySymbol(settings.currency_symbol.value);
                }
            } catch (error) {
                console.error("Error parsing settings:", error);
            }
        }
    }, []);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await api.menu.getCategories();
                setCategories(response.data);
                if (response.data.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        category_id: response.data[0].id,
                    }));
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setCategoriesLoading(false);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    // Populate form when editing
    useEffect(() => {
        if (editItem && isOpen) {
            setFormData({
                name: editItem.name || "",
                description: editItem.description || "",
                make_price: editItem.make_price || 0,
                price: editItem.price || 0,
                category_id: editItem.category_id || 0,
                image_url: editItem.image_url || null,
            });
        } else if (isOpen && !editItem) {
            // Reset form for new item
            setFormData({
                name: "",
                description: "",
                make_price: 0,
                price: 0,
                category_id: 0,
                image_url: null,
            });
        }
    }, [editItem, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "make_price" ||
                name === "price" ||
                name === "category_id"
                    ? Number(value)
                    : value,
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Item name is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        if (formData.make_price <= 0)
            newErrors.make_price = "Make price must be greater than 0";
        if (formData.price <= 0)
            newErrors.price = "Price must be greater than 0";
        if (formData.price <= formData.make_price)
            newErrors.price = "Price must be greater than make price";
        if (!formData.category_id)
            newErrors.category_id = "Category is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            if (editItem) {
                // Update existing item
                await api.menu.updateItem(editItem.id, formData);
            } else {
                // Create new item
                await api.menu.createItem(formData);
            }

            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error(
                `Error ${editItem ? "updating" : "creating"} item:`,
                err
            );
            // Handle error (you might want to show a toast notification)
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
            make_price: 0,
            price: 0,
            category_id: categories[0]?.id || 0,
            image_url: null,
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            {editItem ? "Edit Menu Item" : "Add Menu Item"}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="modal-scroll p-4 space-y-4 max-h-[calc(85vh-120px)]"
                >
                    {/* Item Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Item Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter item name"
                            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent ${
                                errors.name
                                    ? "border-red-300 dark:border-red-600"
                                    : "border-gray-300 dark:border-[#3F3F46]"
                            } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter item description"
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent resize-none ${
                                errors.description
                                    ? "border-red-300 dark:border-red-600"
                                    : "border-gray-300 dark:border-[#3F3F46]"
                            } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Category *
                        </label>
                        {categoriesLoading ? (
                            <div className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#27272A] animate-pulse">
                                Loading...
                            </div>
                        ) : (
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent ${
                                    errors.category_id
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA]`}
                            >
                                <option value={0}>Select a category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.category_id && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Cost ({currencySymbol}) *
                            </label>
                            <input
                                type="number"
                                name="make_price"
                                value={formData.make_price || ""}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent ${
                                    errors.make_price
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]`}
                            />
                            {errors.make_price && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.make_price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Price ({currencySymbol}) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price || ""}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent ${
                                    errors.price
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]`}
                            />
                            {errors.price && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.price}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Profit Display */}
                    {formData.make_price > 0 && formData.price > 0 && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                    Profit:
                                </span>
                                <span className="text-sm font-bold text-green-900 dark:text-green-100">
                                    {currencySymbol}
                                    {(
                                        formData.price - formData.make_price
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Image URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Link className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url || ""}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:border-transparent transition-all"
                            />
                        </div>
                        {formData.image_url && (
                            <div className="mt-2">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-full h-24 object-cover rounded-lg border border-gray-300 dark:border-[#3F3F46]"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#27272A]">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-gray-300 dark:border-[#3F3F46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#eb1700] hover:bg-[#c41400] disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25 focus:outline-none focus:ring-2 focus:ring-[#eb1700] focus:ring-offset-2 dark:focus:ring-offset-[#18181B]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {editItem ? "Updating..." : "Creating..."}
                            </div>
                        ) : editItem ? (
                            "Update"
                        ) : (
                            "Create"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
