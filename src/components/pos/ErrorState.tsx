"use client";

import React from "react";

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0F0F0F] flex items-center justify-center">
            <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA] mb-2">
                    Error Loading Categories
                </h2>
                <p className="text-gray-600 dark:text-[#A1A1AA] mb-4">
                    {error}
                </p>
                <button
                    onClick={onRetry}
                    className="bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
