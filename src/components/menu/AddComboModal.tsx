"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/utils/api";

interface ComboItem {
    item_id: number;
    quantity: number;
    item_name?: string;
    price?: number;
    make_price?: number;
}

interface AddComboModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editCombo?: any | null;
}

interface MenuItem {
    id: number;
    name: string;
    price: string;
    make_price: string;
    category_name: string;
}

export default function AddComboModal({
    isOpen,
    onClose,
    onSuccess,
    editCombo = null,
}: AddComboModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        make_price: "",
        price: "",
        image_url: "",
        is_available: true,
    });
    const [comboItems, setComboItems] = useState<ComboItem[]>([]);
    const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch available menu items
    useEffect(() => {
        if (isOpen) {
            fetchAvailableItems();
        }
    }, [isOpen]);

    const fetchAvailableItems = async () => {
        try {
            setLoadingItems(true);
            const response = await api.get("/items");
            setAvailableItems(response.data || []);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoadingItems(false);
        }
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen && editCombo) {
            // Editing existing combo - map the items from API response
            setFormData({
                name: editCombo.name || "",
                description: editCombo.description || "",
                make_price: editCombo.make_price || "",
                price: editCombo.price || "",
                image_url: editCombo.image_url || "",
                is_available:
                    editCombo.is_available !== undefined
                        ? editCombo.is_available
                        : true,
            });

            // Map items from API response format to form format
            const mappedItems = (editCombo.items || []).map((item: any) => ({
                item_id: item.item_id,
                quantity: item.quantity,
            }));
            setComboItems(mappedItems);
        } else if (!isOpen) {
            // Reset form
            setFormData({
                name: "",
                description: "",
                make_price: "",
                price: "",
                image_url: "",
                is_available: true,
            });
            setComboItems([]);
            setErrors({});
        }
    }, [isOpen, editCombo]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleAddItem = () => {
        setComboItems((prev) => [...prev, { item_id: 0, quantity: 1 }]);
    };

    const handleRemoveItem = (index: number) => {
        setComboItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleItemChange = (
        index: number,
        field: "item_id" | "quantity",
        value: number
    ) => {
        setComboItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Combo name is required";
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
        }
        if (comboItems.length === 0) {
            newErrors.items = "At least one item is required";
        }
        if (comboItems.some((item) => item.item_id === 0)) {
            newErrors.items = "Please select items for all entries";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const comboData = {
                name: formData.name,
                description: formData.description,
                make_price: parseFloat(formData.make_price) || 0,
                price: parseFloat(formData.price),
                is_available: formData.is_available,
                image_url: formData.image_url || null,
                items: comboItems.map((item) => ({
                    item_id: item.item_id,
                    quantity: item.quantity,
                })),
            };

            let response;
            if (editCombo) {
                // Update existing combo
                response = await api.put(`/combos/${editCombo.id}`, comboData);
            } else {
                // Create new combo
                response = await api.post("/combos", comboData);
            }

            // Check for API response status
            if (response.success === false) {
                const errorMessage = response.message || "Failed to save combo";
                toast.error(errorMessage);
                setErrors({ submit: errorMessage });
                return;
            }

            // Show success toast
            toast.success(
                response.message ||
                    (editCombo
                        ? "Combo updated successfully"
                        : "Combo created successfully")
            );

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Error saving combo:", err);

            // Handle error response from API
            let errorMessage = "Failed to save combo. Please try again.";

            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.data?.detail) {
                errorMessage = err.data.detail;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Calculate total make price and suggested price
    const totalMakePrice = comboItems.reduce((sum, item) => {
        const menuItem = availableItems.find((mi) => mi.id === item.item_id);
        if (menuItem) {
            return sum + parseFloat(menuItem.make_price) * item.quantity;
        }
        return sum;
    }, 0);

    const totalRegularPrice = comboItems.reduce((sum, item) => {
        const menuItem = availableItems.find((mi) => mi.id === item.item_id);
        if (menuItem) {
            return sum + parseFloat(menuItem.price) * item.quantity;
        }
        return sum;
    }, 0);

    const profit = parseFloat(formData.price || "0") - totalMakePrice;
    const profitPercentage =
        totalMakePrice > 0 ? (profit / totalMakePrice) * 100 : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            {editCombo
                                ? "Edit Combo Deal"
                                : "Create Combo Deal"}
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
                    {/* Combo Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                            Combo Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Family Meal Deal"
                            className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
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
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Perfect combo for 4 people"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none resize-none"
                        />
                    </div>

                    {/* Items Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA]">
                                Items in Combo *
                            </label>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#eb1700] hover:bg-[#c41400] text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                                Add Item
                            </button>
                        </div>

                        {loadingItems ? (
                            <div className="text-center py-4 text-gray-500 dark:text-[#A1A1AA]">
                                Loading items...
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {comboItems.map((comboItem, index) => {
                                    const selectedItem = availableItems.find(
                                        (item) => item.id === comboItem.item_id
                                    );
                                    return (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-[#0F0F0F] rounded-lg"
                                        >
                                            {/* Item Select */}
                                            <div className="flex-1">
                                                <select
                                                    value={comboItem.item_id}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "item_id",
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] focus:outline-none"
                                                >
                                                    <option value={0}>
                                                        Select an item...
                                                    </option>
                                                    {availableItems.map(
                                                        (item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.name} - ₹
                                                                {parseFloat(
                                                                    item.price
                                                                ).toFixed(2)}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {selectedItem && (
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-[#A1A1AA]">
                                                        {
                                                            selectedItem.category_name
                                                        }{" "}
                                                        • Make: ₹
                                                        {parseFloat(
                                                            selectedItem.make_price
                                                        ).toFixed(2)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quantity */}
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={comboItem.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(
                                                            index,
                                                            "quantity",
                                                            parseInt(
                                                                e.target.value
                                                            ) || 1
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] focus:outline-none"
                                                    placeholder="Qty"
                                                />
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveItem(index)
                                                }
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })}

                                {comboItems.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-[#A1A1AA]">
                                        No items added. Click "Add Item" to
                                        start
                                    </div>
                                )}
                            </div>
                        )}

                        {errors.items && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.items}
                            </p>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Make Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Make Price (Cost)
                            </label>
                            <input
                                type="number"
                                name="make_price"
                                value={formData.make_price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-[#A1A1AA]">
                                Auto calculated: ₹{totalMakePrice.toFixed(2)}
                            </p>
                        </div>

                        {/* Selling Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Selling Price *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className={`w-full px-3 py-2 rounded-lg border transition-all focus:outline-none ${
                                    errors.price
                                        ? "border-red-300 dark:border-red-600"
                                        : "border-gray-300 dark:border-[#3F3F46]"
                                } bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA]`}
                            />
                            {errors.price && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.price}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Profit Display */}
                    {comboItems.length > 0 && formData.price && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-4 border border-green-200 dark:border-green-900/30">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-600 dark:text-[#A1A1AA] text-xs mb-1">
                                        Total Make Price
                                    </div>
                                    <div className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                        ₹{totalMakePrice.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 dark:text-[#A1A1AA] text-xs mb-1">
                                        Regular Price
                                    </div>
                                    <div className="font-semibold text-gray-500 dark:text-[#A1A1AA] line-through">
                                        ₹{totalRegularPrice.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 dark:text-[#A1A1AA] text-xs mb-1">
                                        Profit
                                    </div>
                                    <div
                                        className={`font-bold ${
                                            profit >= 0
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        ₹{profit.toFixed(2)} (
                                        {profitPercentage.toFixed(1)}%)
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image URL and Availability */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Image URL (Optional)
                            </label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-[#3F3F46] bg-white dark:bg-[#27272A] text-gray-900 dark:text-[#FAFAFA] placeholder-gray-500 dark:placeholder-[#A1A1AA] focus:outline-none"
                            />
                        </div>

                        {/* Availability Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#A1A1AA] mb-1">
                                Availability
                            </label>
                            <div className="flex items-center h-10">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_available: !prev.is_available,
                                        }))
                                    }
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        formData.is_available
                                            ? "bg-green-600"
                                            : "bg-gray-300 dark:bg-gray-600"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            formData.is_available
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </button>
                                <span className="ml-3 text-sm text-gray-700 dark:text-[#FAFAFA]">
                                    {formData.is_available
                                        ? "Available"
                                        : "Unavailable"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
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
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {editCombo ? "Updating..." : "Creating..."}
                            </div>
                        ) : editCombo ? (
                            "Update Combo"
                        ) : (
                            "Create Combo"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
