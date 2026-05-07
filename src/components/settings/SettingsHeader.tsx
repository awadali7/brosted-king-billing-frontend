import React from "react";

interface SettingsHeaderProps {
    onSave: () => void;
    onReset: () => void;
    hasChanges: boolean;
    saving: boolean;
}

export default function SettingsHeader({
    onSave,
    onReset,
    hasChanges,
    saving,
}: SettingsHeaderProps) {
    return (
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center">
                            <i className="bi bi-gear-fill mr-2"></i>
                            Settings
                        </h2>
                        <p className="text-sm text-gray-600 mb-0">
                            Manage your restaurant settings
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                            onClick={onReset}
                            disabled={!hasChanges || saving}
                        >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Reset
                        </button>
                        <button
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                            onClick={onSave}
                            disabled={!hasChanges || saving}
                        >
                            {saving ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-save"></i>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
