import React from "react";
import { SettingsData } from "@/types/settings";

interface RestaurantSettingsProps {
    settings: SettingsData;
    formValues: Record<string, any>;
    onChange: (key: string, value: any) => void;
    isEditing: boolean;
}

export default function RestaurantSettings({
    settings,
    formValues,
    onChange,
    isEditing,
}: RestaurantSettingsProps) {
    return (
        <>
            {/* Restaurant Name */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Restaurant Name
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues.restaurant_name || ""}
                    onChange={(e) =>
                        onChange("restaurant_name", e.target.value)
                    }
                    placeholder="Enter restaurant name"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings.restaurant_name.description}
                </small>
            </div>

            {/* Restaurant Phone */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Phone Number
                </label>
                <input
                    type="text"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues.restaurant_phone || ""}
                    onChange={(e) =>
                        onChange("restaurant_phone", e.target.value)
                    }
                    placeholder="+91-1234567890"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings.restaurant_phone.description}
                </small>
            </div>

            {/* Restaurant Email */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Email
                </label>
                <input
                    type="email"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues.restaurant_email || ""}
                    onChange={(e) =>
                        onChange("restaurant_email", e.target.value)
                    }
                    placeholder="info@restaurant.com"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings.restaurant_email.description}
                </small>
            </div>

            {/* Restaurant Address */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Address
                </label>
                <textarea
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    rows={2}
                    value={formValues.restaurant_address || ""}
                    onChange={(e) =>
                        onChange("restaurant_address", e.target.value)
                    }
                    placeholder="Enter complete address"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings.restaurant_address.description}
                </small>
            </div>

            {/* Review Link */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                    Review Link
                </label>
                <input
                    type="url"
                    className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    value={formValues.review_link || ""}
                    onChange={(e) => onChange("review_link", e.target.value)}
                    placeholder="https://g.page/r/YOUR_LINK"
                    disabled={!isEditing}
                />
                <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                    {settings.review_link.description}
                </small>
            </div>
        </>
    );
}
