"use client";

import { usePathname } from "next/navigation";

interface HeaderProps {
    user: {
        username: string;
        full_name?: string;
        role: string;
    };
    onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
    console.log(user, "user ====>");

    // Get current path from URL
    const pathname = usePathname();

    // Extract the page name from the pathname (e.g., "/dashboard" -> "dashboard")
    const activePage = pathname.split("/")[1] || "dashboard";

    // Page display mapping
    const pageDisplayNames: Record<string, string> = {
        dashboard: "Dashboard",
        pos: "Point of Sale",
        menu: "Menu Management",
        orders: "Orders",
        reservations: "Reservations",
        delivery: "Delivery",
        payments: "Payments",
        invoice: "Invoice",
        customer: "Customer Management",
        testimonial: "Testimonials",
        users: "User Management",
        reports: "Reports",
        settings: "Settings",
    };

    const currentPageName = pageDisplayNames[activePage] || "Dashboard";

    return (
        <header className="h-16 bg-white dark:bg-[#0F0F0F] border-b border-gray-200 dark:border-[#3F3F46] px-6">
            <div className="h-full flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA]">
                        {currentPageName}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-[#A1A1AA] mt-1">
                        {activePage === "dashboard" &&
                            "Overview of your restaurant"}
                        {activePage === "pos" &&
                            "Select categories and manage orders"}
                        {activePage === "menu" &&
                            "Manage your menu items and categories"}
                        {activePage === "orders" &&
                            "View and manage all orders"}
                        {activePage === "reservations" &&
                            "Manage table reservations"}
                        {activePage === "delivery" &&
                            "Track and manage deliveries"}
                        {activePage === "payments" &&
                            "View payment history and transactions"}
                        {activePage === "invoice" &&
                            "Generate and manage invoices"}
                        {activePage === "customer" &&
                            "Manage customer information"}
                        {activePage === "testimonial" &&
                            "View and manage customer testimonials"}
                        {activePage === "users" &&
                            "Manage user accounts and permissions"}
                        {activePage === "reports" &&
                            "View analytics and reports"}
                        {activePage === "settings" &&
                            "Configure your restaurant and billing preferences"}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button
                        aria-label="Notifications"
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-[#A1A1AA] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {(user?.full_name || user?.username)
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                                {user?.full_name || user?.username}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-[#A1A1AA] capitalize">
                                {user?.role}
                            </p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="ml-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold bg-[#eb1700] hover:bg-[#c41400] active:bg-[#a01100] transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
