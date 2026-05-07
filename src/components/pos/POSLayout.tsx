"use client";

import React from "react";

interface POSLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export default function POSLayout({ children, sidebar }: POSLayoutProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                    {children}
                </div>
            </div>

            {/* Right Sidebar */}
            {sidebar && (
                <div className="w-full md:w-80 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-200">
                    {sidebar}
                </div>
            )}
        </div>
    );
}
