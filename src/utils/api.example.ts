/**
 * API Utility Usage Examples
 *
 * This file contains examples of how to use the api utility in your components
 */

import { api, ApiError } from "./api";

// ============================================
// GET Request Examples
// ============================================

// Simple GET request
async function getCategories() {
    try {
        const categories = await api.get("/categories/");
        console.log(categories);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("API Error:", error.status, error.data);
        }
    }
}

// GET with query parameters
async function getMenuItems() {
    try {
        const items = await api.get("/menu-items/", {
            category: 1,
            available: true,
            search: "pizza",
        });
        console.log(items);
    } catch (error) {
        console.error("Error fetching menu items:", error);
    }
}

// GET single item
async function getMenuItem(id: number) {
    try {
        const item = await api.get(`/menu-items/${id}/`);
        console.log(item);
    } catch (error) {
        console.error("Error fetching menu item:", error);
    }
}

// ============================================
// POST Request Examples
// ============================================

// Create new category
async function createCategory() {
    try {
        const newCategory = await api.post("/categories/", {
            name: "Beverages",
            description: "Hot and cold drinks",
        });
        console.log("Category created:", newCategory);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("Validation errors:", error.data);
        }
    }
}

// Create menu item
async function createMenuItem() {
    try {
        const newItem = await api.post("/menu-items/", {
            name: "Margherita Pizza",
            description: "Classic pizza with tomato and mozzarella",
            price: "12.99",
            category: 1,
            available: true,
        });
        console.log("Menu item created:", newItem);
    } catch (error) {
        console.error("Error creating menu item:", error);
    }
}

// Login example
async function login(login: string, password: string) {
    try {
        const response = await api.post("/auth/login/", { login, password });

        if (response.success && response.data) {
            // Store token and user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            return response.data;
        } else {
            throw new Error(response.message || "Login failed");
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw new Error(
                error.data.message || error.data.detail || "Login failed"
            );
        }
        throw error;
    }
}

// ============================================
// PUT Request Examples (Full Update)
// ============================================

async function updateCategory(id: number) {
    try {
        const updated = await api.put(`/categories/${id}/`, {
            name: "Updated Category Name",
            description: "Updated description",
        });
        console.log("Category updated:", updated);
    } catch (error) {
        console.error("Error updating category:", error);
    }
}

// ============================================
// PATCH Request Examples (Partial Update)
// ============================================

async function updateMenuItemPrice(id: number) {
    try {
        const updated = await api.patch(`/menu-items/${id}/`, {
            price: "15.99",
        });
        console.log("Menu item price updated:", updated);
    } catch (error) {
        console.error("Error updating price:", error);
    }
}

async function toggleAvailability(id: number, available: boolean) {
    try {
        const updated = await api.patch(`/menu-items/${id}/`, { available });
        console.log("Availability updated:", updated);
    } catch (error) {
        console.error("Error updating availability:", error);
    }
}

// ============================================
// DELETE Request Examples
// ============================================

async function deleteCategory(id: number) {
    try {
        await api.delete(`/categories/${id}/`);
        console.log("Category deleted successfully");
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status === 404) {
                console.error("Category not found");
            } else if (error.status === 403) {
                console.error("Not authorized to delete");
            }
        }
    }
}

async function deleteMenuItem(id: number) {
    try {
        await api.delete(`/menu-items/${id}/`);
        console.log("Menu item deleted successfully");
    } catch (error) {
        console.error("Error deleting menu item:", error);
    }
}

// ============================================
// File Upload Examples
// ============================================

async function uploadMenuItemImage(itemId: number, file: File) {
    try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("menu_item", itemId.toString());

        const result = await api.upload("/menu-items/upload-image/", formData);
        console.log("Image uploaded:", result);
    } catch (error) {
        console.error("Error uploading image:", error);
    }
}

// ============================================
// Logout Example
// ============================================

function logout() {
    api.logout();
    // User will be redirected to login automatically
}

// ============================================
// React Component Examples
// ============================================

/*
// Example in a React component

import { useState, useEffect } from 'react';
import { api, ApiError } from '@/utils/api';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get('/categories/');
      setCategories(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.data.detail || 'Failed to load categories');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await api.delete(`/categories/${id}/`);
      // Reload categories after successful delete
      loadCategories();
    } catch (err) {
      alert('Failed to delete category');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <button onClick={() => handleDelete(category.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
*/

// ============================================
// TypeScript Types Example
// ============================================

/*
// Define your data types

interface Category {
  id: number;
  name: string;
  description: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: number;
  available: boolean;
  image?: string;
}

// Use with typed API calls
async function getTypedCategories() {
  const categories = await api.get<Category[]>('/categories/');
  // categories is now typed as Category[]
}

async function getTypedMenuItem(id: number) {
  const item = await api.get<MenuItem>(`/menu-items/${id}/`);
  // item is now typed as MenuItem
}
*/

export {};
