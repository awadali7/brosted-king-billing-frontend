// API utility for making HTTP requests to the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions {
    headers?: Record<string, string>;
    method?: string;
    body?: string;
}

class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data: any
    ) {
        super(`API Error ${status}: ${statusText}`);
        this.name = "ApiError";
    }
}

const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

const getPublicHeaders = (): Record<string, string> => {
    return {
        "Content-Type": "application/json",
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { detail: response.statusText };
        }
        throw new ApiError(response.status, response.statusText, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export const api = {
    /**
     * GET request
     * @param endpoint - API endpoint (e.g., '/categories/')
     * @param params - Optional query parameters
     */
    async get<T = any>(
        endpoint: string,
        params?: Record<string, any>
    ): Promise<T> {
        const url = new URL(`${API_URL}${endpoint}`);

        if (params) {
            Object.keys(params).forEach((key) => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, String(params[key]));
                }
            });
        }

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    },

    /**
     * POST request
     * @param endpoint - API endpoint
     * @param data - Data to send in request body
     */
    async post<T = any>(endpoint: string, data?: any): Promise<T> {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return handleResponse(response);
    },

    /**
     * PUT request (full update)
     * @param endpoint - API endpoint
     * @param data - Data to send in request body
     */
    async put<T = any>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        return handleResponse(response);
    },

    /**
     * PATCH request (partial update)
     * @param endpoint - API endpoint
     * @param data - Data to send in request body
     */
    async patch<T = any>(endpoint: string, data: any): Promise<T> {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        return handleResponse(response);
    },

    /**
     * DELETE request
     * @param endpoint - API endpoint
     */
    async delete<T = any>(endpoint: string): Promise<T> {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        return handleResponse(response);
    },

    /**
     * Upload file(s) with multipart/form-data
     * @param endpoint - API endpoint
     * @param formData - FormData object with file(s)
     */
    async upload<T = any>(endpoint: string, formData: FormData): Promise<T> {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData, browser will set it with boundary
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers,
            body: formData,
        });

        return handleResponse(response);
    },

    /**
     * Logout - Clear all auth data
     */
    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
        }
    },

    // Menu API methods
    menu: {
        /**
         * Get menu items with optional category filter and search
         * @param category_id - Optional category ID to filter by
         * @param search - Optional search term
         */
        async getMenu(category_id?: number, search?: string) {
            const params: Record<string, any> = {};
            if (category_id !== undefined) {
                params.category_id = category_id;
            }
            if (search) {
                params.search = search;
            }
            return api.get("/menu", params);
        },
        async getCategories() {
            return api.get("/menu/categories");
        },
        async createItem(itemData: any) {
            return api.post("/items", itemData);
        },
        async updateItem(itemId: number, itemData: any) {
            return api.put(`/items/${itemId}`, itemData);
        },
        async getItem(itemId: number) {
            return api.get(`/items/${itemId}`);
        },
        async deleteItem(itemId: number) {
            return api.delete(`/items/${itemId}`);
        },
        async getItemsByCategory(categoryId: number, available?: boolean) {
            const params: Record<string, any> = { category_id: categoryId };
            if (available !== undefined) {
                params.available = available;
            }
            return api.get("/items", params);
        },
    },
    bills: {
        async createBill(billData: any) {
            return api.post("/bills", billData);
        },
        async getTodayBills() {
            return api.get("/bills/today");
        },
        async searchBills(query: string) {
            return api.get(`/bills/search?q=${encodeURIComponent(query)}`);
        },
        async getBill(billId: number) {
            return api.get(`/bills/${billId}`);
        },
        async updateBill(billId: number, billData: any) {
            return api.put(`/bills/${billId}`, billData);
        },
        async printBill(billId: number) {
            return api.get(`/bills/${billId}/print`);
        },
        async sendBillEmail(billId: number) {
            return api.post(`/bills/${billId}/send-email`);
        },
    },
};

// Export API_URL for direct use if needed
export { API_URL, ApiError };
