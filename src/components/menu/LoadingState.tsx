"use client";

import React from "react";

export default function LoadingState() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF6B2C] rounded-full animate-spin"></div>
        </div>
    );
}
