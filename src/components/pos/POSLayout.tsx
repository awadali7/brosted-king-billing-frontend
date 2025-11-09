"use client";

import React from "react";

interface POSLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export default function POSLayout({ children, sidebar }: POSLayoutProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F0F] flex">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="  mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </div>

            {/* Right Sidebar */}
            {sidebar && <div className="w-80 flex-shrink-0">{sidebar}</div>}
        </div>
    );
}
