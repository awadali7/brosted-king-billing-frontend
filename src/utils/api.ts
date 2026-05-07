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
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
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

    // Handle 304 Not Modified - no body, return null or throw error
    // In practice, we should prevent 304 by using cache: 'no-store'
    if (response.status === 304) {
        throw new ApiError(304, "Not Modified", {
            detail: "Resource not modified. Please refresh or clear cache.",
        });
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
            cache: "no-store", // Prevent caching to avoid 304 responses
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
        const headers: Record<string, string> = {};

        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
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
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
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
            return api.get("/categories");
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
        async getBills(params?: {
            page?: number;
            limit?: number;
            payment_status?: string;
            start_date?: string;
            end_date?: string;
        }) {
            return api.get("/bills", params);
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
        async deleteBill(billId: number) {
            return api.delete(`/bills/${billId}`);
        },
        async printBill(billId: number) {
            return api.get(`/bills/${billId}/print`);
        },
        async sendBillEmail(billId: number) {
            return api.post(`/bills/${billId}/send-email`);
        },
    },
    combos: {
        /**
         * Get all combos
         */
        async getCombos() {
            return api.get("/combos");
        },
        /**
         * Get available combos only
         */
        async getAvailableCombos() {
            return api.get("/combos", { available: true });
        },
        /**
         * Get a single combo by ID
         */
        async getCombo(comboId: number) {
            return api.get(`/combos/${comboId}`);
        },
        /**
         * Delete a combo by ID
         */
        async deleteCombo(comboId: number) {
            return api.delete(`/combos/${comboId}`);
        },
    },
    settings: {
        /**
         * Get all settings
         */
        async getSettings() {
            // Use cache: 'no-store' to ensure fresh data and prevent 304 responses
            const response = await fetch(`${API_URL}/settings`, {
                method: "GET",
                headers: getAuthHeaders(),
                cache: "no-store", // Always fetch fresh settings
            });
            return handleResponse(response);
        },
        /**
         * Update a specific setting
         * @param key - Setting key to update
         * @param value - New value for the setting
         */
        async updateSetting(key: string, value: string | number | boolean) {
            return api.put(`/settings/${key}`, { value });
        },
    },
    dashboard: {
        /**
         * Get dashboard statistics
         * @param date - Optional date (YYYY-MM-DD format)
         */
        async getStats(date?: string) {
            const params: Record<string, any> = {};
            if (date) params.date = date;
            return api.get("/dashboard", params);
        },
    },
    reports: {
        /**
         * Get sales report
         * @param start_date - Start date (YYYY-MM-DD format)
         * @param end_date - End date (YYYY-MM-DD format)
         */
        async getSalesReport(start_date?: string, end_date?: string) {
            const params: Record<string, any> = {};
            if (start_date) params.start_date = start_date;
            if (end_date) params.end_date = end_date;
            return api.get("/reports/sales", params);
        },
        /**
         * Get daily report
         * @param date - Date (YYYY-MM-DD format)
         */
        async getDailyReport(date?: string) {
            const params: Record<string, any> = {};
            if (date) params.date = date;
            return api.get("/reports/daily", params);
        },
        /**
         * Get monthly report
         * @param year - Year
         * @param month - Month (1-12)
         */
        async getMonthlyReport(year?: number, month?: number) {
            const params: Record<string, any> = {};
            if (year) params.year = year;
            if (month) params.month = month;
            return api.get("/reports/monthly", params);
        },
        /**
         * Get items performance report
         * @param start_date - Start date (YYYY-MM-DD format)
         * @param end_date - End date (YYYY-MM-DD format)
         */
        async getItemsPerformance(start_date?: string, end_date?: string) {
            const params: Record<string, any> = {};
            if (start_date) params.start_date = start_date;
            if (end_date) params.end_date = end_date;
            return api.get("/reports/items", params);
        },
        /**
         * Get profit & loss statement
         * @param start_date - Start date (YYYY-MM-DD format)
         * @param end_date - End date (YYYY-MM-DD format)
         */
        async getProfitLoss(start_date?: string, end_date?: string) {
            const params: Record<string, any> = {};
            if (start_date) params.start_date = start_date;
            if (end_date) params.end_date = end_date;
            return api.get("/reports/profit-loss", params);
        },
        /**
         * Get GST/Tax report
         * @param start_date - Start date (YYYY-MM-DD format)
         * @param end_date - End date (YYYY-MM-DD format)
         */
        async getGSTReport(start_date?: string, end_date?: string) {
            const params: Record<string, any> = {};
            if (start_date) params.start_date = start_date;
            if (end_date) params.end_date = end_date;
            return api.get("/reports/gst", params);
        },
    },
};

// Export API_URL for direct use if needed
export { API_URL, ApiError };
