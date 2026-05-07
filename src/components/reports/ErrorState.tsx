import React from "react";

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {error || "No data available"}
            </h3>
            <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-[#eb1700] text-white rounded-lg hover:bg-[#c41400] transition-colors"
            >
                Retry
            </button>
        </div>
    );
}
