"use client";

import { useState } from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from "framer-motion";
import {
    Home,
    ShoppingCart,
    Utensils,
    Calendar,
    FileText,
    Truck,
    CreditCard,
    User,
    Receipt,
    Star,
    Users,
    BarChart3,
    Settings,
    ChevronLeft,
    Search,
    LogOut,
    BookOpen,
    Package,
    ClipboardList,
} from "lucide-react";

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: any;
    badge?: string | number;
    isNew?: boolean;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

// Grouped menu items with sections for better UX
const menuSections: MenuSection[] = [
    {
        title: "Main",
        items: [
            { id: "dashboard", label: "Dashboard", icon: Home },
            { id: "pos", label: "POS", icon: ShoppingCart, badge: "Hot" },
        ],
    },
    {
        title: "Menu",
        items: [
            { id: "menu", label: "Menu", icon: Utensils },
            {
                id: "menuCategories",
                label: "Menu Categories",
                icon: ClipboardList,
            },
        ],
    },

    {
        title: "System",
        items: [
            { id: "reports", label: "Reports", icon: BarChart3 },
            { id: "settings", label: "Settings", icon: Settings },
        ],
    },
    {
        title: "Finance",
        items: [
            { id: "income", label: "Income", icon: CreditCard },
            { id: "expanse", label: "Expanse", icon: Receipt },
            {
                id: "categories",
                label: "Expanse Categories",
                icon: ClipboardList,
            },
        ],
    },
];

// Animation Variants
const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
};

const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 500, damping: 15 },
    },
    hover: { scale: 1.1 },
};

const buttonVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
};

const logoVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.05,
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.5 },
    },
};

const notificationDotVariants = {
    initial: { scale: 0 },
    animate: {
        scale: [1, 1.2, 1],
        transition: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut" as const,
        },
    },
};

export default function Sidebar({
    activePage,
    onNavigate,
    onLogout,
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const settings = localStorage?.getItem("settings");
    const settingsData = settings ? JSON.parse(settings) : null;
    const restaurantName = settingsData?.restaurant_name?.value;
    console.log(restaurantName);
    return (
        <motion.div
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-white dark:bg-[#0F0F0F] border-r border-gray-200 dark:border-[#3F3F46] min-h-screen sticky top-0 flex flex-col overflow-hidden"
        >
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            variants={logoVariants}
                            initial="rest"
                            whileHover="hover"
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-red-900/30"
                        >
                            <BookOpen className="w-5 h-5 text-white" />
                        </motion.div>
                        <AnimatePresence mode="wait">
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-w-0"
                                >
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-[#FAFAFA] truncate">
                                        {restaurantName
                                            ? restaurantName
                                            : "Billing System"}
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                                        POS System
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="relative p-2 rounded-lg transition-all duration-200 group overflow-hidden"
                            title={
                                isCollapsed
                                    ? "Expand sidebar"
                                    : "Collapse sidebar"
                            }
                        >
                            {/* Animated background on hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-[#eb1700]/10 to-[#c41400]/10 dark:from-[#eb1700]/20 dark:to-[#c41400]/20 rounded-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                transition={{
                                    type: "spring" as const,
                                    stiffness: 300,
                                    damping: 20,
                                }}
                            />

                            {/* Glow effect on hover */}
                            <motion.div
                                className="absolute inset-0 rounded-lg"
                                initial={{
                                    boxShadow: "0 0 0px rgba(235, 23, 0, 0)",
                                }}
                                whileHover={{
                                    boxShadow: "0 0 15px rgba(235, 23, 0, 0.3)",
                                }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Icon with enhanced animations */}
                            <motion.div
                                animate={{
                                    rotate: isCollapsed ? 180 : 0,
                                }}
                                transition={{
                                    type: "spring" as const,
                                    stiffness: 200,
                                    damping: 15,
                                }}
                                className="relative z-10"
                            >
                                <motion.div
                                    whileHover={{
                                        x: isCollapsed ? 2 : -2,
                                    }}
                                    transition={{
                                        type: "spring" as const,
                                        stiffness: 400,
                                        damping: 10,
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-[#A1A1AA] group-hover:text-[#eb1700] dark:group-hover:text-[#eb1700] transition-colors duration-200" />
                                </motion.div>
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Navigation Menu - Scrollable */}
                <motion.nav
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 overflow-y-auto px-3 pb-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
                >
                    {menuSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            variants={itemVariants}
                            className="space-y-1"
                        >
                            {/* Section Header */}
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.h3
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: sectionIndex * 0.05,
                                        }}
                                        className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-[#71717A] uppercase tracking-wider"
                                    >
                                        {section.title}
                                    </motion.h3>
                                )}
                            </AnimatePresence>
                            {isCollapsed && sectionIndex > 0 && (
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    className="border-t border-gray-200 dark:border-[#3F3F46] my-2"
                                />
                            )}

                            {/* Menu Items */}
                            {section.items.map((item, itemIndex) => {
                                const IconComponent = item.icon;
                                const isActive = activePage === item.id;

                                return (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        className="relative group"
                                    >
                                        <motion.button
                                            variants={buttonVariants}
                                            initial="rest"
                                            whileHover="hover"
                                            whileTap="tap"
                                            onClick={() => onNavigate(item.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 relative overflow-hidden ${
                                                isActive
                                                    ? "bg-[#FEF2F2] dark:bg-[#2D1A1A] text-[#eb1700] shadow-sm font-semibold"
                                                    : "text-gray-700 dark:text-[#A1A1AA] hover:bg-gray-50 dark:hover:bg-[#27272A] hover:text-gray-900 dark:hover:text-[#FAFAFA] hover:shadow-sm"
                                            }`}
                                            title={
                                                isCollapsed
                                                    ? item.label
                                                    : undefined
                                            }
                                        >
                                            {/* Active Indicator */}
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ scaleY: 0 }}
                                                        animate={{ scaleY: 1 }}
                                                        exit={{ scaleY: 0 }}
                                                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#eb1700] rounded-r-full origin-top"
                                                    />
                                                )}
                                            </AnimatePresence>

                                            <motion.div
                                                animate={
                                                    isActive
                                                        ? { scale: [1, 1.1, 1] }
                                                        : {}
                                                }
                                                transition={{ duration: 0.3 }}
                                            >
                                                <IconComponent
                                                    className={`w-5 h-5 ${
                                                        isCollapsed
                                                            ? "mx-auto"
                                                            : ""
                                                    } flex-shrink-0`}
                                                />
                                            </motion.div>

                                            <AnimatePresence>
                                                {!isCollapsed && (
                                                    <>
                                                        <motion.span
                                                            initial={{
                                                                opacity: 0,
                                                                x: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                x: -10,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                            className="font-medium text-sm flex-1 truncate"
                                                        >
                                                            {item.label}
                                                        </motion.span>

                                                        {/* Badges */}
                                                        {item.badge && (
                                                            <motion.span
                                                                variants={
                                                                    badgeVariants
                                                                }
                                                                initial="initial"
                                                                animate="animate"
                                                                whileHover="hover"
                                                                className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                                                                    typeof item.badge ===
                                                                    "number"
                                                                        ? "bg-[#eb1700] text-white"
                                                                        : "bg-gradient-to-r from-[#eb1700] to-[#c41400] text-white"
                                                                }`}
                                                            >
                                                                <motion.span
                                                                    animate={
                                                                        typeof item.badge ===
                                                                        "string"
                                                                            ? {
                                                                                  scale: [
                                                                                      1,
                                                                                      1.05,
                                                                                      1,
                                                                                  ],
                                                                                  opacity:
                                                                                      [
                                                                                          1,
                                                                                          0.8,
                                                                                          1,
                                                                                      ],
                                                                              }
                                                                            : {}
                                                                    }
                                                                    transition={{
                                                                        repeat: Infinity,
                                                                        duration: 2,
                                                                    }}
                                                                >
                                                                    {item.badge}
                                                                </motion.span>
                                                            </motion.span>
                                                        )}

                                                        {/* New Badge */}
                                                        {item.isNew && (
                                                            <motion.span
                                                                variants={
                                                                    badgeVariants
                                                                }
                                                                initial="initial"
                                                                animate="animate"
                                                                whileHover="hover"
                                                                className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#10B981] to-[#059669] text-white flex-shrink-0"
                                                            >
                                                                New
                                                            </motion.span>
                                                        )}
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>

                                        {/* Notification Dot for collapsed state */}
                                        <AnimatePresence>
                                            {isCollapsed &&
                                                item.badge &&
                                                typeof item.badge ===
                                                    "number" && (
                                                    <motion.div
                                                        variants={
                                                            notificationDotVariants
                                                        }
                                                        initial="initial"
                                                        animate="animate"
                                                        exit={{ scale: 0 }}
                                                        className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#eb1700] rounded-full"
                                                    />
                                                )}
                                        </AnimatePresence>

                                        {/* Tooltip for collapsed state */}
                                        {isCollapsed && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    x: -5,
                                                    scale: 0.95,
                                                }}
                                                whileHover={{
                                                    opacity: 1,
                                                    x: 0,
                                                    scale: 1,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 shadow-lg pointer-events-none"
                                            >
                                                {item.label}
                                                {item.badge && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            delay: 0.1,
                                                        }}
                                                        className="ml-2 px-1.5 py-0.5 bg-[#eb1700] text-white text-xs rounded-full"
                                                    >
                                                        {item.badge}
                                                    </motion.span>
                                                )}
                                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ))}
                </motion.nav>

                {/* Footer - Logout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#18181B]/50"
                >
                    <motion.button
                        variants={buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[#EF4444] hover:bg-red-50 dark:hover:bg-[#7F1D1D] rounded-lg transition-colors hover:text-[#DC2626] dark:hover:text-[#F87171] hover:shadow-sm group"
                        title={isCollapsed ? "Log out" : undefined}
                    >
                        <motion.div
                            whileHover={{ rotate: 12 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <LogOut
                                className={`w-5 h-5 ${
                                    isCollapsed ? "mx-auto" : ""
                                }`}
                            />
                        </motion.div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-medium text-sm"
                                >
                                    Log out
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}
