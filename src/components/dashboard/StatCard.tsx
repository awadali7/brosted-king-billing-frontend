"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "text-[#eb1700]",
    trend,
}: StatCardProps) {
    return (
        <div className="bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-[#A1A1AA] mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA] mb-2">
                        {value}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-[#71717A]">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={`text-xs font-medium ${
                                    trend.isPositive
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {trend.isPositive ? "↑" : "↓"} {trend.value}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`p-3 rounded-lg bg-gray-50 dark:bg-[#27272A] ${iconColor}`}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
