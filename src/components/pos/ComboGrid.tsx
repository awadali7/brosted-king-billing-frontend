"use client";

import React from "react";
import { Combo } from "@/types/menu";
import ComboCard from "./ComboCard";

interface ComboGridProps {
    combos: Combo[];
    onAddToOrder?: (combo: Combo) => void;
}

export default function ComboGrid({ combos, onAddToOrder }: ComboGridProps) {
    if (combos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                    🎁
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Combos Found
                </h3>
                <p className="text-gray-600">
                    No combo deals available at the moment.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Combo Deals
                </h2>
                <p className="text-gray-600">
                    Save more with our special combo offers
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-3 sm:p-4 md:p-5 gap-4 sm:gap-6">
                {combos.map((combo) => (
                    <ComboCard
                        key={combo.id}
                        combo={combo}
                        onAddToOrder={onAddToOrder}
                    />
                ))}
            </div>
        </>
    );
}
