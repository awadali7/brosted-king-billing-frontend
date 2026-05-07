"use client";

import React, { useEffect, useState } from "react";
import { X, Eye } from "lucide-react";
import { api } from "@/utils/api";

interface ViewIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    incomeId: number | null;
}

type IncomeRecord = {
    id: number;
    amount: string | number;
    source: string;
    description: string;
    date: string; // ISO
    payment_method: string;
    notes: string;
    created_at?: string;
    updated_at?: string;
};

export default function ViewIncomeModal({
    isOpen,
    onClose,
    incomeId,
}: ViewIncomeModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [record, setRecord] = useState<IncomeRecord | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!isOpen || !incomeId) return;
            try {
                setLoading(true);
                setError(null);
                const res = await api.get(`/income/${incomeId}`);
                const data = (res && (res.data || res)) as IncomeRecord;
                setRecord(data);
            } catch (err: any) {
                setError(err?.message || "Failed to load income details");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [isOpen, incomeId]);

    if (!isOpen) return null;

    const displayDate = record?.date
        ? new Date(record.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "-";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl mx-4 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                            <Eye className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Income Details
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 overflow-auto">
                    {loading ? (
                        <div className="py-8 text-center text-gray-500">
                            Loading...
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : !record ? (
                        <div className="py-8 text-center text-gray-500">
                            No details available.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">
                                    Amount
                                </div>
                                <div className="font-semibold text-gray-900">
                                    {Number(record.amount).toFixed(2)}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs mb-1">
                                    Source
                                </div>
                                <div className="capitalize text-gray-900">
                                    {record.source || "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs mb-1">
                                    Payment Method
                                </div>
                                <div className="uppercase text-gray-900">
                                    {record.payment_method || "-"}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs mb-1">
                                    Date
                                </div>
                                <div className="text-gray-900">
                                    {displayDate}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-gray-500 text-xs mb-1">
                                    Description
                                </div>
                                <div className="text-gray-900">
                                    {record.description || "-"}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-gray-500 text-xs mb-1">
                                    Notes
                                </div>
                                <div className="text-gray-900">
                                    {record.notes || "-"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
