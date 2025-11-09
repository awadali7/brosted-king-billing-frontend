"use client";

import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Extract the current page from the URL
    const activePage = pathname.split("/")[1] || "dashboard";

    const handleNavigate = (page: string) => {
        // Navigate to the page - the URL will automatically update
        switch (page) {
            case "dashboard":
                router.push("/dashboard");
                break;
            case "pos":
                router.push("/pos");
                break;
            case "menu":
                router.push("/menu");
                break;
            case "tables":
                router.push("/tables");
                break;
            case "reservations":
                router.push("/reservations");
                break;
            case "orders":
                router.push("/orders");
                break;
            case "delivery":
                router.push("/delivery");
                break;
            case "payments":
                router.push("/payments");
                break;
            case "customer":
                router.push("/customer");
                break;
            case "invoice":
                router.push("/invoice");
                break;
            case "testimonial":
                router.push("/testimonial");
                break;
            case "users":
                router.push("/users");
                break;
            case "reports":
                router.push("/reports");
                break;
            case "settings":
                router.push("/settings");
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
                <main className="flex-1  overflow-auto bg-white dark:bg-[#0F0F0F]">
                    <div className="">{children}</div>
                </main>
            </div>
        </div>
    );
}
