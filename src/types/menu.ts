export interface MenuItem {
    id: number;
    name: string;
    description: string;
    make_price: number;
    price: number;
    profit?: number;
    profit_percentage?: number;
    category_id: number;
    is_available: boolean;
    image_url: string | null;
    category_name?: string;
}

export interface MenuCategory {
    category_id: number;
    category_name: string;
    items: MenuItem[];
}

export interface CategoryInfo {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export interface CategoriesResponse {
    success: boolean;
    message: string;
    data: CategoryInfo[];
    count: number;
}

export interface MenuResponse {
    success: boolean;
    message: string;
    data: {
        categories: MenuCategory[];
        total_items: number;
    };
}

export interface MenuFilters {
    category_id?: number;
    search?: string;
}

export interface ItemResponse {
    success: boolean;
    message: string;
    data: MenuItem;
}

// Bill-related types
export interface BillItem {
    item_id: number;
    item_type: "menu_item" | "combo";
    quantity: number;
    name?: string;
    price?: number;
}

export interface Bill {
    id: number;
    bill_number: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    discount_percentage: number;
    tax_percentage: number;
    payment_method: "cash" | "card" | "upi" | "other";
    payment_status: "pending" | "paid" | "cancelled";
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
    items: BillItem[];
    created_at: string;
    updated_at: string;
}

export interface BillResponse {
    success: boolean;
    message: string;
    data: Bill;
}

export interface BillsResponse {
    success: boolean;
    message: string;
    data: Bill[];
    count: number;
}

export interface CreateBillRequest {
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    discount_percentage: number;
    tax_percentage: number;
    payment_method: "cash" | "card" | "upi" | "other";
    items: BillItem[];
}
