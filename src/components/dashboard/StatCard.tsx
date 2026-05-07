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
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {value}
                    </h3>
                    {subtitle && (
                        <p className="text-xs text-gray-500">
                            {subtitle}
                        </p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={`text-xs font-medium ${
                                    trend.isPositive
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {trend.isPositive ? "↑" : "↓"} {trend.value}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`p-3 rounded-lg bg-gray-50 ${iconColor}`}
                >
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
