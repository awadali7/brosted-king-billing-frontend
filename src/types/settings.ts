export interface Setting {
    value: string | number | boolean;
    type: "string" | "number" | "boolean";
    description: string;
    updated_at: string;
}

export interface SettingsData {
    bill_prefix: Setting;
    currency_symbol: Setting;
    enable_discount: Setting;
    restaurant_address: Setting;
    restaurant_email: Setting;
    restaurant_name: Setting;
    restaurant_phone: Setting;
    review_link: Setting;
    smtp_from_email: Setting;
    smtp_from_name: Setting;
    smtp_host: Setting;
    smtp_password: Setting;
    smtp_port: Setting;
    smtp_user: Setting;
    tax_percentage: Setting;
}

export interface SettingsResponse {
    success: boolean;
    message: string;
    data: SettingsData;
}

export interface UpdateSettingRequest {
    value: string | number | boolean;
}

export interface UpdateSettingResponse {
    success: boolean;
    message: string;
    data: Setting;
}
