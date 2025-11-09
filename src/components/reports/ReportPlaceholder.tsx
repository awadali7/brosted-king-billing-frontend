import React from "react";

interface ReportPlaceholderProps {
    emoji: string;
    title: string;
    description: string;
}

export default function ReportPlaceholder({
    emoji,
    title,
    description,
}: ReportPlaceholderProps) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">{emoji}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">
                {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#A1A1AA]">
                {description}
            </p>
        </div>
    );
}
