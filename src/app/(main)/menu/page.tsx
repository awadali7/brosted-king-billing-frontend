"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import DeleteConfirmModal from "@/components/menu/DeleteConfirmModal";

export default function MenuPage() {
    const [menuData, setMenuData] = useState<MenuResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<
        number | undefined
    >();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    useEffect(() => {
        fetchMenu();
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

    const handleItemCreated = () => {
        // Refresh the menu data after creating/updating an item
        fetchMenu();
        setEditingItem(null);
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
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;

        try {
            setDeleteLoading(true);
            await api.menu.deleteItem(deletingItem.id);
            // Refresh the menu data after deleting
            fetchMenu();
            setIsDeleteModalOpen(false);
            setDeletingItem(null);
        } catch (error) {
            console.error("Error deleting item:", error);
            // Handle error (you might want to show a toast notification)
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
            />

            <CategoryFilters
                selectedCategory={selectedCategory}
                onCategoryFilter={handleCategoryFilter}
            />

            {loading && <LoadingState />}

            {error && <ErrorState error={error} />}

            {!loading && !error && menuData && (
                <MenuGrid
                    menuData={menuData}
                    selectedCategory={selectedCategory}
                    allItems={filteredItems}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                />
            )}

            {/* Add/Edit Item Modal */}
            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSuccess={handleItemCreated}
                editItem={editingItem}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                item={deletingItem}
                loading={deleteLoading}
            />
        </div>
    );
}
