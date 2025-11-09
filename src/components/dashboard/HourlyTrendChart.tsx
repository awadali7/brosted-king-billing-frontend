"use client";

import React from "react";

interface HourlyData {
    hour: string;
    bills_count: string;
    revenue: string;
}

interface HourlyTrendChartProps {
    data: HourlyData[];
}

export default function HourlyTrendChart({ data }: HourlyTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 dark:text-[#A1A1AA] text-4xl mb-3">
                    📈
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1">
                    No Data Available
                </h3>
                <p className="text-xs text-gray-500 dark:text-[#A1A1AA]">
                    Sales data will appear here
                </p>
            </div>
        );
    }

    // Calculate max revenue for scaling
    const maxRevenue = Math.max(...data.map((d) => parseFloat(d.revenue)));

    const formatHour = (hour: string) => {
        const hourNum = parseInt(hour);
        const period = hourNum >= 12 ? "PM" : "AM";
        const displayHour =
            hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
        return `${displayHour} ${period}`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-48">
                {data.map((item, index) => {
                    const height =
                        (parseFloat(item.revenue) / maxRevenue) * 100;
                    const billCount = parseInt(item.bills_count);

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-2"
                        >
                            <div className="relative w-full flex items-end justify-center h-full group">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                    <div className="bg-gray-900 dark:bg-[#0F0F0F] text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                                        <p className="font-semibold">
                                            {formatHour(item.hour)}
                                        </p>
                                        <p className="text-gray-300 dark:text-[#A1A1AA]">
                                            {billCount} bill
                                            {billCount !== 1 ? "s" : ""}
                                        </p>
                                        <p className="text-[#eb1700] font-semibold">
                                            ₹
                                            {parseFloat(item.revenue).toFixed(
                                                2
                                            )}
                                        </p>
                                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900 dark:bg-[#0F0F0F] rotate-45" />
                                    </div>
                                </div>

                                {/* Bar */}
                                <div
                                    className="w-full bg-gradient-to-t from-[#eb1700] to-[#ff5c4d] rounded-t-lg transition-all duration-300 hover:from-[#c41400] hover:to-[#eb1700] cursor-pointer min-h-[4px]"
                                    style={{
                                        height: `${Math.max(height, 5)}%`,
                                    }}
                                />
                            </div>

                            {/* Label */}
                            <span className="text-xs text-gray-600 dark:text-[#A1A1AA] font-medium">
                                {formatHour(item.hour)}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-[#3F3F46]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-t from-[#eb1700] to-[#ff5c4d]" />
                    <span className="text-xs text-gray-600 dark:text-[#A1A1AA]">
                        Revenue
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-[#A1A1AA]">
                        Hover for details
                    </span>
                </div>
            </div>
        </div>
    );
}
