"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>({});
    const [isClient, setIsClient] = useState(false);

    // ✅ Load user only on client side
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== "undefined") {
            try {
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    setUser(JSON.parse(userStr));
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                setUser({});
            }
        }
    }, []);

    // ✅ Extract current page from pathname safely
    const activePage = useMemo(() => {
        if (typeof pathname !== "string") return "dashboard";
        try {
            const parts = pathname.split("/").filter(Boolean);
            return parts.length > 0 ? parts[parts.length - 1] : "dashboard";
        } catch (error) {
            console.error("Error parsing pathname:", error);
            return "dashboard";
        }
    }, [pathname]);

    // ✅ Centralized navigation handler
    const handleNavigate = (page: string) => {
        const routes: Record<string, string> = {
            dashboard: "/dashboard",
            pos: "/pos",
            menu: "/menu",
            tables: "/tables",
            reservations: "/reservations",
            orders: "/orders",
            delivery: "/delivery",
            payments: "/payments",
            customer: "/customer",
            invoice: "/invoice",
            testimonial: "/testimonial",
            users: "/users",
            reports: "/reports",
            settings: "/settings",
        };

        router.push(routes[page] || "/dashboard");
    };

    // ✅ Logout handler
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        router.push("/auth/login");
    };

    // ✅ Prevent rendering until mounted to avoid SSR mismatches
    if (!isClient) {
        return (
            <div className="flex min-h-screen items-center justify-center text-gray-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-[#0F0F0F]">
            {/* Sidebar */}
            <Sidebar
                activePage={activePage}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header user={user} onLogout={handleLogout} />

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-white dark:bg-[#0F0F0F]">
                    <div>{children}</div>
                </main>
            </div>
        </div>
    );
}
