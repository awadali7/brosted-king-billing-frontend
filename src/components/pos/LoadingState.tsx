"use client";

import React from "react";

export default function LoadingState() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb1700] mx-auto mb-4"></div>
                <p className="text-gray-600">
                    Loading categories...
                </p>
            </div>
        </div>
    );
}
