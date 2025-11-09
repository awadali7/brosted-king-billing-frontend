import React from "react";

export default function LoadingState() {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skeleton for Settings Cards */}
                {[...Array(3)].map((_, cardIndex) => (
                    <div
                        key={cardIndex}
                        className="bg-white dark:bg-[#18181B] rounded-lg border border-gray-200 dark:border-[#3F3F46] p-6 animate-pulse"
                    >
                        {/* Header skeleton */}
                        <div className="h-6 bg-gray-200 dark:bg-[#27272A] rounded w-1/3 mb-6"></div>

                        {/* Form fields skeleton */}
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="mb-4">
                                <div className="h-4 bg-gray-200 dark:bg-[#27272A] rounded w-1/4 mb-2"></div>
                                <div className="h-10 bg-gray-100 dark:bg-[#27272A] rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
