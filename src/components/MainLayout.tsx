"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
    children: React.ReactNode;
    user: any;
    currentPage?: string;
}

export default function MainLayout({
    children,
    user,
    currentPage = "dashboard",
}: MainLayoutProps) {
    const router = useRouter();
    const [activePage, setActivePage] = useState(currentPage);

    const handleNavigate = (page: string) => {
        setActivePage(page);
        // Add navigation logic here
        switch (page) {
            case "dashboard":
                router.push("/dashboard");
                break;
            case "billing":
                router.push("/billing");
                break;
            case "menu":
                router.push("/menu");
                break;
            case "categories":
                router.push("/categories");
                break;
            case "combos":
                router.push("/combos");
                break;
            case "expenses":
                router.push("/expenses");
                break;
            case "income":
                router.push("/income");
                break;
            case "reports":
                router.push("/reports");
                break;
            case "settings":
                router.push("/settings");
                break;
            case "users":
                router.push("/users");
                break;
            default:
                router.push("/dashboard");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
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
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
