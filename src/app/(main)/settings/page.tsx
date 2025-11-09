"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { SettingsResponse, SettingsData } from "@/types/settings";
import SettingsHeader from "@/components/settings/SettingsHeader";
import RestaurantSettings from "@/components/settings/RestaurantSettings";
import BillSettings from "@/components/settings/BillSettings";
import SMTPSettings from "@/components/settings/SMTPSettings";
import LoadingState from "@/components/settings/LoadingState";
import ErrorState from "@/components/settings/ErrorState";

export default function SettingsPage() {
    const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response: SettingsResponse = await api.settings.getSettings();
            setSettingsData(response.data);

            // Update localStorage with latest settings
            localStorage.setItem("settings", JSON.stringify(response.data));

            // Initialize form values from settings
            const initialValues: Record<string, any> = {};
            Object.keys(response.data).forEach((key) => {
                initialValues[key] =
                    response.data[key as keyof SettingsData].value;
            });
            setFormValues(initialValues);
            setHasChanges(false);
        } catch (err: any) {
            setError(err.message || "Failed to fetch settings");
            console.error("Error fetching settings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: any) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
        setHasChanges(true);
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        if (!settingsData || !hasChanges) return;

        try {
            setSaving(true);
            setError(null);

            // Find which settings have changed and update them
            const updatePromises: Promise<any>[] = [];
            Object.keys(formValues).forEach((key) => {
                const originalValue =
                    settingsData[key as keyof SettingsData].value;
                const newValue = formValues[key];

                if (originalValue !== newValue) {
                    updatePromises.push(
                        api.settings.updateSetting(key, newValue)
                    );
                }
            });

            // Execute all updates in parallel
            await Promise.all(updatePromises);

            // Refresh settings after save
            await fetchSettings();
            setHasChanges(false);
            setSaveSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to save settings");
            console.error("Error saving settings:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (!settingsData) return;

        // Reset form values to original settings
        const resetValues: Record<string, any> = {};
        Object.keys(settingsData).forEach((key) => {
            resetValues[key] = settingsData[key as keyof SettingsData].value;
        });
        setFormValues(resetValues);
        setHasChanges(false);
        setSaveSuccess(false);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        if (isEditing && hasChanges) {
            // If canceling with changes, reset the form
            handleReset();
        } else {
            setIsEditing(!isEditing);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#000000]">
            {/* <SettingsHeader
                onSave={handleSave}
                onReset={handleReset}
                hasChanges={hasChanges}
                saving={saving}
            /> */}

            {/* Success Toast */}
            {saveSuccess && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <i className="bi bi-check-circle-fill text-xl"></i>
                        <span>Settings saved successfully!</span>
                    </div>
                </div>
            )}

            {loading && <LoadingState />}

            {error && !loading && (
                <ErrorState error={error} onRetry={fetchSettings} />
            )}

            {!loading && !error && settingsData && (
                <div className="px-6 py-6">
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mb-6">
                        {isEditing ? (
                            <>
                                <button
                                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    onClick={handleEditToggle}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                    onClick={handleSave}
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
                                            <i className="bi bi-check2"></i>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-1"
                                onClick={handleEditToggle}
                            >
                                <i className="bi bi-pencil"></i>
                                Edit Settings
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                        {/* Restaurant Information */}
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-200 dark:border-[#3A3A3C]">
                            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#3A3A3C]">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    Restaurant Information
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <RestaurantSettings
                                    settings={settingsData}
                                    formValues={formValues}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>

                        {/* Bill Settings */}
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-200 dark:border-[#3A3A3C]">
                            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#3A3A3C]">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    Bill Settings
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <BillSettings
                                    settings={settingsData}
                                    formValues={formValues}
                                    onChange={handleChange}
                                    isEditing={isEditing}
                                />
                            </div>
                        </div>

                        {/* Authentication */}
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-200 dark:border-[#3A3A3C]">
                            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#3A3A3C]">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    Authentication
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* SMTP Username */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                                        SMTP Username
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                        value={formValues.smtp_user || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "smtp_user",
                                                e.target.value
                                            )
                                        }
                                        placeholder="user@example.com"
                                        disabled={!isEditing}
                                    />
                                    <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                                        {settingsData.smtp_user.description}
                                    </small>
                                </div>

                                {/* SMTP Password */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                                        SMTP Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                        value={formValues.smtp_password || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "smtp_password",
                                                e.target.value
                                            )
                                        }
                                        placeholder="••••••••"
                                        disabled={!isEditing}
                                    />
                                    <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                                        {settingsData.smtp_password.description}
                                    </small>
                                </div>

                                {/* SMTP Host */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                                        SMTP Host
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                        value={formValues.smtp_host || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "smtp_host",
                                                e.target.value
                                            )
                                        }
                                        placeholder="smtp.gmail.com"
                                        disabled={!isEditing}
                                    />
                                    <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                                        {settingsData.smtp_host.description}
                                    </small>
                                </div>

                                {/* SMTP Port */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                                        SMTP Port
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                        value={formValues.smtp_port || 587}
                                        onChange={(e) =>
                                            handleChange(
                                                "smtp_port",
                                                Number(e.target.value)
                                            )
                                        }
                                        placeholder="587"
                                        min="1"
                                        max="65535"
                                        disabled={!isEditing}
                                    />
                                    <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                                        {settingsData.smtp_port.description}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Email Settings */}
                        <div className="bg-white dark:bg-[#1C1C1E] rounded-lg border border-gray-200 dark:border-[#3A3A3C]">
                            <div className="px-5 py-3 border-b border-gray-200 dark:border-[#3A3A3C]">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    Email Settings
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* From Name */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                                        From Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                        value={formValues.smtp_from_name || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "smtp_from_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="My Restaurant"
                                        disabled={!isEditing}
                                    />
                                    <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                                        {
                                            settingsData.smtp_from_name
                                                .description
                                        }
                                    </small>
                                </div>

                                {/* From Email */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-[#A1A1AA] mb-2">
                                        From Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border border-gray-300 dark:border-[#3A3A3C] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                        value={formValues.smtp_from_email || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                "smtp_from_email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="noreply@restaurant.com"
                                        disabled={!isEditing}
                                    />
                                    <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-1 block">
                                        {
                                            settingsData.smtp_from_email
                                                .description
                                        }
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
