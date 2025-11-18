import React from "react";
import { SettingsData } from "@/types/settings";

interface BillSettingsProps {
    settings: SettingsData;
    formValues: Record<string, any>;
    onChange: (key: string, value: any) => void;
    isEditing: boolean;
}

export default function BillSettings({
    settings,
    formValues,
    onChange,
    isEditing,
}: BillSettingsProps) {
    return (
        <>
            {/* Bill Prefix */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Bill Prefix
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues.bill_prefix || ""}
                    onChange={(e) => onChange("bill_prefix", e.target.value)}
                    placeholder="BILL"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings?.bill_prefix?.description}
                </small>
            </div>

            {/* Currency Symbol */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Currency Symbol
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues.currency_symbol || ""}
                    onChange={(e) =>
                        onChange("currency_symbol", e.target.value)
                    }
                    placeholder="₹"
                    maxLength={3}
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings?.currency_symbol?.description}
                </small>
            </div>

            {/* Tax Percentage */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Tax Percentage (%)
                </label>
                <input
                    type="number"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues?.tax_percentage || 0}
                    onChange={(e) =>
                        onChange("tax_percentage", Number(e.target.value))
                    }
                    placeholder="5"
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings?.tax_percentage?.description}
                </small>
            </div>

            {/* Enable Discount */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Enable Discount
                </label>
                <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            id="enable_discount"
                            checked={formValues?.enable_discount || false}
                            onChange={(e) =>
                                onChange("enable_discount", e.target.checked)
                            }
                            disabled={!isEditing}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                    <label
                        className="text-xs text-gray-700 dark:text-[#A1A1AA] cursor-pointer"
                        htmlFor="enable_discount"
                    >
                        Allow discounts on bills
                    </label>
                </div>
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings?.enable_discount?.description}
                </small>
            </div>
        </>
    );
}
