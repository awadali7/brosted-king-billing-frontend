"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    item: MenuItem | null;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    item,
    loading = false,
}: DeleteConfirmModalProps) {
    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#18181B] rounded-xl shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3F3F46]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA]">
                                Delete Item
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-[#27272A] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-gray-700 dark:text-[#A1A1AA] mb-4">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-gray-900 dark:text-[#FAFAFA]">
                            "{item.name}"
                        </span>
                        ? This action cannot be undone.
                    </p>

                    {item.image_url && (
                        <div className="mb-4">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-[#3F3F46]"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-[#3F3F46] bg-gray-50 dark:bg-[#27272A]">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-gray-300 dark:border-[#3F3F46] rounded-lg hover:bg-gray-50 dark:hover:bg-[#27272A] transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-600/25 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-[#18181B]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </div>
                        ) : (
                            "Delete Item"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
