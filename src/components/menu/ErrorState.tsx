"use client";

import React from "react";

interface ErrorStateProps {
    error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className="  mx-auto px-4 py-8">
            <div className="text-center text-red-500 text-sm">
                {error}
            </div>
        </div>
    );
}
