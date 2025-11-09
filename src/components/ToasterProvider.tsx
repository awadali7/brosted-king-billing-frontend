"use client";

import { Toaster } from "sonner";

export default function ToasterProvider() {
    return (
        <Toaster
            position="top-right"
            expand={true}
            richColors
            closeButton
            duration={4000}
            theme="system"
            style={{ zIndex: 99999 }}
        />
    );
}
