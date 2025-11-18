import React from "react";
import { SettingsData } from "@/types/settings";

interface SMTPSettingsProps {
    settings: SettingsData;
    formValues: Record<string, any>;
    onChange: (key: string, value: any) => void;
}

export default function SMTPSettings({
    settings,
    formValues,
    onChange,
}: SMTPSettingsProps) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="bg-white dark:bg-[#1C1C1E] rounded-lg shadow-sm border border-gray-200 dark:border-[#3A3A3C]">
            {/* Section Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-[#3A3A3C]">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                    <i className="bi bi-envelope-fill me-2"></i>
                    SMTP / Email Settings
                </h2>
                <p className="text-gray-600 dark:text-[#A1A1AA] text-sm">
                    Configure email server settings for sending bills and
                    notifications
                </p>
            </div>

            <div className="p-6">
                <div className="row g-4">
                    {/* Server Configuration Section */}
                    <div className="col-12">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">
                            <i className="bi bi-server me-2 text-primary"></i>
                            Server Configuration
                        </h3>
                    </div>

                    {/* SMTP Host */}
                    <div className="col-12 col-md-4">
                        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-lg border border-gray-200 dark:border-[#3A3A3C] h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="p-2 bg-white dark:bg-[#1C1C1E] rounded-lg me-2">
                                    <i className="bi bi-hdd-network text-primary"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    SMTP Host
                                </label>
                            </div>
                            <input
                                type="text"
                                className="form-control bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                value={formValues.smtp_host || ""}
                                onChange={(e) =>
                                    onChange("smtp_host", e.target.value)
                                }
                                placeholder="smtp.gmail.com"
                            />
                            <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-2 d-block">
                                {settings?.smtp_host?.description}
                            </small>
                        </div>
                    </div>

                    {/* SMTP Port */}
                    <div className="col-12 col-md-4">
                        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-lg border border-gray-200 dark:border-[#3A3A3C] h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="p-2 bg-white dark:bg-[#1C1C1E] rounded-lg me-2">
                                    <i className="bi bi-plug text-info"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    SMTP Port
                                </label>
                            </div>
                            <input
                                type="number"
                                className="form-control bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                value={formValues.smtp_port || 587}
                                onChange={(e) =>
                                    onChange(
                                        "smtp_port",
                                        Number(e.target.value)
                                    )
                                }
                                placeholder="587"
                                min="1"
                                max="65535"
                            />
                            <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-2 d-block">
                                {settings?.smtp_port?.description}
                            </small>
                        </div>
                    </div>

                    {/* SMTP Username */}
                    <div className="col-12 col-md-4">
                        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-lg border border-gray-200 dark:border-[#3A3A3C] h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="p-2 bg-white dark:bg-[#1C1C1E] rounded-lg me-2">
                                    <i className="bi bi-person-badge text-success"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    SMTP Username
                                </label>
                            </div>
                            <input
                                type="text"
                                className="form-control bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                value={formValues.smtp_user || ""}
                                onChange={(e) =>
                                    onChange("smtp_user", e.target.value)
                                }
                                placeholder="user@example.com"
                            />
                            <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-2 d-block">
                                {settings?.smtp_user?.description}
                            </small>
                        </div>
                    </div>

                    {/* Authentication Section */}
                    <div className="col-12">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3 mt-2">
                            <i className="bi bi-shield-lock me-2 text-warning"></i>
                            Authentication
                        </h3>
                    </div>

                    {/* SMTP Password */}
                    <div className="col-12">
                        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-lg border border-gray-200 dark:border-[#3A3A3C]">
                            <div className="d-flex align-items-center mb-3">
                                <div className="p-2 bg-white dark:bg-[#1C1C1E] rounded-lg me-2">
                                    <i className="bi bi-key-fill text-danger"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    SMTP Password
                                </label>
                            </div>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                    value={formValues.smtp_password || ""}
                                    onChange={(e) =>
                                        onChange(
                                            "smtp_password",
                                            e.target.value
                                        )
                                    }
                                    placeholder="••••••••"
                                />
                                <button
                                    className="btn btn-outline-secondary bg-white dark:bg-[#2C2C2E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <i
                                        className={`bi ${
                                            showPassword
                                                ? "bi-eye-slash"
                                                : "bi-eye"
                                        }`}
                                    ></i>
                                </button>
                            </div>
                            <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-2 d-block">
                                {settings?.smtp_password?.description}
                            </small>
                        </div>
                    </div>

                    {/* Email Settings Section */}
                    <div className="col-12">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3 mt-2">
                            <i className="bi bi-envelope-at me-2 text-info"></i>
                            Email Settings
                        </h3>
                    </div>

                    {/* From Name */}
                    <div className="col-12 col-md-6">
                        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-lg border border-gray-200 dark:border-[#3A3A3C] h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="p-2 bg-white dark:bg-[#1C1C1E] rounded-lg me-2">
                                    <i className="bi bi-person-circle text-primary"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    From Name
                                </label>
                            </div>
                            <input
                                type="text"
                                className="form-control bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                value={formValues.smtp_from_name || ""}
                                onChange={(e) =>
                                    onChange("smtp_from_name", e.target.value)
                                }
                                placeholder="My Restaurant"
                            />
                            <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-2 d-block">
                                {settings?.smtp_from_name?.description}
                            </small>
                        </div>
                    </div>

                    {/* From Email */}
                    <div className="col-12 col-md-6">
                        <div className="p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-lg border border-gray-200 dark:border-[#3A3A3C] h-100">
                            <div className="d-flex align-items-center mb-3">
                                <div className="p-2 bg-white dark:bg-[#1C1C1E] rounded-lg me-2">
                                    <i className="bi bi-envelope text-success"></i>
                                </div>
                                <label className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-0">
                                    From Email
                                </label>
                            </div>
                            <input
                                type="email"
                                className="form-control bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-[#FAFAFA] border-gray-300 dark:border-[#3A3A3C]"
                                value={formValues.smtp_from_email || ""}
                                onChange={(e) =>
                                    onChange("smtp_from_email", e.target.value)
                                }
                                placeholder="noreply@restaurant.com"
                            />
                            <small className="text-gray-600 dark:text-[#A1A1AA] text-xs mt-2 d-block">
                                {settings?.smtp_from_email?.description}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
