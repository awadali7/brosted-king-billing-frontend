"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { api } from "@/utils/api";
import {
    MenuResponse,
    MenuCategory,
    MenuItem,
    ItemResponse,
} from "@/types/menu";
import MenuHeader from "@/components/menu/MenuHeader";
import CategoryFilters from "@/components/menu/CategoryFilters";
import MenuGrid from "@/components/menu/MenuGrid";
import LoadingState from "@/components/menu/LoadingState";
import ErrorState from "@/components/menu/ErrorState";
import AddItemModal from "@/components/menu/AddItemModal";
import AddComboModal from "@/components/menu/AddComboModal";
import DeleteConfirmModal from "@/components/menu/DeleteConfirmModal";

export default function MenuPage() {
    const [activeTab, setActiveTab] = useState<"items" | "combos">("items");
    const [menuData, setMenuData] = useState<MenuResponse | null>(null);
    const [combosData, setCombosData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<
        number | undefined
    >();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddComboModalOpen, setIsAddComboModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [editingCombo, setEditingCombo] = useState<any | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<MenuItem | any | null>(
        null
    );
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteItemType, setDeleteItemType] = useState<"item" | "combo">(
        "item"
    );

    const fetchMenu = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.menu.getMenu();
            setMenuData(response);
        } catch (err: any) {
            setError(err.message || "Failed to fetch menu");
            console.error("Error fetching menu:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCombos = async () => {
        try {
            const response = await api.combos.getCombos();
            setCombosData(response.data || []);
        } catch (err: any) {
            console.error("Error fetching combos:", err);
        }
    };

    useEffect(() => {
        fetchMenu();
        fetchCombos();
    }, []);

    // Debounced search for better performance
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 150);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryFilter = (categoryId?: number) => {
        setSelectedCategory(categoryId);
    };

    const handleCreateItem = () => {
        setIsAddModalOpen(true);
    };

    const handleCreateCombo = () => {
        setIsAddComboModalOpen(true);
    };

    const handleItemCreated = () => {
        // Refresh the menu data after creating/updating an item
        fetchMenu();
        setEditingItem(null);
    };

    const handleComboCreated = () => {
        // Refresh the combos data after creating/updating a combo
        fetchCombos();
        setEditingCombo(null);
    };

    const handleEditItem = async (item: MenuItem) => {
        try {
            // Fetch full item details from API
            const response: ItemResponse = await api.menu.getItem(item.id);
            setEditingItem(response.data);
            setIsAddModalOpen(true);
        } catch (error) {
            console.error("Error fetching item details:", error);
            // Fallback to basic item data if API fails
            setEditingItem(item);
            setIsAddModalOpen(true);
        }
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingItem(null);
    };

    const handleDeleteItem = (item: MenuItem) => {
        setDeletingItem(item);
        setDeleteItemType("item");
        setIsDeleteModalOpen(true);
    };

    const handleEditCombo = async (combo: any) => {
        try {
            // Fetch full combo details from API
            const response = await api.combos.getCombo(combo.id);
            setEditingCombo(response.data);
            setIsAddComboModalOpen(true);
        } catch (error) {
            console.error("Error fetching combo details:", error);
            // Fallback to basic combo data if API fails
            setEditingCombo(combo);
            setIsAddComboModalOpen(true);
        }
    };

    const handleDeleteCombo = (combo: any) => {
        setDeletingItem(combo);
        setDeleteItemType("combo");
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;

        try {
            setDeleteLoading(true);

            if (deleteItemType === "combo") {
                const response = await api.combos.deleteCombo(deletingItem.id);

                // Check for API response status
                if (response.success === false) {
                    toast.error(response.message || "Failed to delete combo");
                    return;
                }

                // Refresh combos data after deleting
                await fetchCombos();
                toast.success(response.message || "Combo deleted successfully");
            } else {
                const response = await api.menu.deleteItem(deletingItem.id);

                // Check for API response status
                if (response.success === false) {
                    toast.error(response.message || "Failed to delete item");
                    return;
                }

                // Refresh menu data after deleting
                await fetchMenu();
                toast.success(response.message || "Item deleted successfully");
            }

            setIsDeleteModalOpen(false);
            setDeletingItem(null);
        } catch (err: any) {
            console.error(`Error deleting ${deleteItemType}:`, err);

            // Handle error response from API
            let errorMessage = `Failed to delete ${deleteItemType}. Please try again.`;

            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.data?.detail) {
                errorMessage = err.data.detail;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setDeletingItem(null);
    };

    // Filter and flatten items based on search and category
    const filteredItems = useMemo(() => {
        if (!menuData) return [];

        let items = menuData.data.categories.flatMap((cat) =>
            cat.items.map((item) => ({
                ...item,
                categoryName: cat.category_name,
                categoryId: cat.category_id,
            }))
        );

        // Apply search filter
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            items = items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchLower) ||
                    item.description.toLowerCase().includes(searchLower)
            );
        }

        // Apply category filter
        if (selectedCategory !== undefined) {
            items = items.filter(
                (item) => item.categoryId === selectedCategory
            );
        }

        return items;
    }, [menuData, debouncedSearch, selectedCategory]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F0F]">
            <MenuHeader
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
                onCreateClick={handleCreateItem}
                onCreateComboClick={handleCreateCombo}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                itemsCount={
                    menuData?.data.categories.reduce(
                        (total, cat) => total + cat.items.length,
                        0
                    ) || 0
                }
                combosCount={combosData.length}
            />

            {activeTab === "items" && (
                <CategoryFilters
                    selectedCategory={selectedCategory}
                    onCategoryFilter={handleCategoryFilter}
                />
            )}

            {loading && <LoadingState />}

            {error && <ErrorState error={error} />}

            {!loading && !error && activeTab === "items" && menuData && (
                <MenuGrid
                    menuData={menuData}
                    selectedCategory={selectedCategory}
                    allItems={filteredItems}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                />
            )}

            {!loading && !error && activeTab === "combos" && (
                <div className="p-6">
                    {combosData.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎁</div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                                No Combos Available
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                                Create combo deals to offer bundled items to
                                your customers
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {combosData.map((combo) => (
                                <div
                                    key={combo.id}
                                    className="bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-[#3F3F46] p-4 hover:shadow-lg transition-all relative group"
                                >
                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() =>
                                                handleEditCombo(combo)
                                            }
                                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                            title="Edit combo"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteCombo(combo)
                                            }
                                            className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                            title="Delete combo"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">
                                                {combo.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                                                {combo.description}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                combo.is_available
                                                    ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                                    : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {combo.is_available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="text-sm text-gray-600 dark:text-[#A1A1AA]">
                                            Items included:
                                        </div>
                                        {combo.items.map(
                                            (item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-gray-700 dark:text-[#FAFAFA]">
                                                        {item.item_name} x{" "}
                                                        {item.quantity}
                                                    </span>
                                                    <span className="text-gray-500 dark:text-[#A1A1AA]">
                                                        ₹
                                                        {parseFloat(
                                                            item.total_price
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-[#3F3F46] pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-[#A1A1AA] line-through">
                                                    ₹
                                                    {parseFloat(
                                                        combo.total_items_make_price
                                                    ).toFixed(2)}
                                                </div>
                                                <div className="text-xl font-bold text-[#eb1700]">
                                                    ₹
                                                    {parseFloat(
                                                        combo.price
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                                    Profit
                                                </div>
                                                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                    +₹
                                                    {parseFloat(
                                                        combo.profit
                                                    ).toFixed(2)}{" "}
                                                    ({combo.profit_percentage}%)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Item Modal */}
            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSuccess={handleItemCreated}
                editItem={editingItem}
            />

            {/* Add/Edit Combo Modal */}
            <AddComboModal
                isOpen={isAddComboModalOpen}
                onClose={() => {
                    setIsAddComboModalOpen(false);
                    setEditingCombo(null);
                }}
                onSuccess={handleComboCreated}
                editCombo={editingCombo}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                item={deletingItem}
                loading={deleteLoading}
                itemType={deleteItemType}
            />
        </div>
    );
}
