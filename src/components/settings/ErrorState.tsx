import React from "react";

interface ErrorStateProps {
    error: string;
    onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center mb-4">
                            <i className="bi bi-exclamation-triangle-fill text-3xl text-red-600 mr-3"></i>
                            <div>
                                <h5 className="text-lg font-semibold text-red-800 mb-1">
                                    Error Loading Settings
                                </h5>
                                <p className="text-red-700 mb-0">
                                    {error}
                                </p>
                            </div>
                        </div>
                        {onRetry && (
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                                onClick={onRetry}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
