"use client";

import React, { useState, useEffect } from "react";
import { Printer, Usb, Network, Globe, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { printService, PrinterType } from "@/utils/print-service";

export default function PrinterSettings() {
    const [printerType, setPrinterType] = useState<PrinterType>("browser");
    const [networkIp, setNetworkIp] = useState("");
    const [networkPort, setNetworkPort] = useState("9100");
    const [isSerialSupported, setIsSerialSupported] = useState(false);

    useEffect(() => {
        // Check if Web Serial API is supported
        setIsSerialSupported(printService.isWebSerialSupported());

        // Load current config
        const config = printService.getConfig();
        setPrinterType(config.type);
        setNetworkIp(config.networkIp || "");
        setNetworkPort((config.networkPort || 9100).toString());
    }, []);

    const handleSave = () => {
        const config = {
            type: printerType,
            networkIp: printerType === "network" ? networkIp : undefined,
            networkPort:
                printerType === "network"
                    ? parseInt(networkPort)
                    : undefined,
        };

        printService.saveConfig(config);
        toast.success("Printer settings saved successfully!");
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#eb1700] to-[#c41400] flex items-center justify-center">
                    <Printer className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Printer Configuration
                    </h3>
                    <p className="text-sm text-gray-500">
                        Choose how to print receipts
                    </p>
                </div>
            </div>

            {/* Printer Type Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                    Printer Type
                </label>

                {/* USB Serial Option */}
                <div
                    onClick={() =>
                        isSerialSupported && setPrinterType("usb-serial")
                    }
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        printerType === "usb-serial"
                            ? "border-[#eb1700] bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                    } ${!isSerialSupported ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <input
                        type="radio"
                        name="printerType"
                        value="usb-serial"
                        checked={printerType === "usb-serial"}
                        onChange={(e) =>
                            setPrinterType(e.target.value as PrinterType)
                        }
                        disabled={!isSerialSupported}
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Usb className="w-4 h-4 text-[#eb1700]" />
                            <span className="font-medium text-gray-900">
                                USB Serial (Recommended)
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Direct ESC/POS printing via USB. No paper waste, fast
                            printing.
                        </p>
                        {!isSerialSupported && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-amber-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>
                                    Requires Chrome or Edge browser
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Network Printer Option */}
                <div
                    onClick={() => setPrinterType("network")}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        printerType === "network"
                            ? "border-[#eb1700] bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                    <input
                        type="radio"
                        name="printerType"
                        value="network"
                        checked={printerType === "network"}
                        onChange={(e) =>
                            setPrinterType(e.target.value as PrinterType)
                        }
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Network className="w-4 h-4 text-[#eb1700]" />
                            <span className="font-medium text-gray-900">
                                Network Printer
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Print via network IP address. Shared printer support.
                        </p>

                        {printerType === "network" && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        IP Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={networkIp}
                                        onChange={(e) =>
                                            setNetworkIp(e.target.value)
                                        }
                                        placeholder="192.168.1.100"
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Port
                                    </label>
                                    <input
                                        type="number"
                                        value={networkPort}
                                        onChange={(e) =>
                                            setNetworkPort(e.target.value)
                                        }
                                        placeholder="9100"
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Browser Print Option */}
                <div
                    onClick={() => setPrinterType("browser")}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        printerType === "browser"
                            ? "border-[#eb1700] bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                    <input
                        type="radio"
                        name="printerType"
                        value="browser"
                        checked={printerType === "browser"}
                        onChange={(e) =>
                            setPrinterType(e.target.value as PrinterType)
                        }
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe className="w-4 h-4 text-[#eb1700]" />
                            <span className="font-medium text-gray-900">
                                Browser Print (Fallback)
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Traditional browser print dialog. May waste paper on thermal
                            printers.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>
                                Not recommended for thermal printers (wastes 50-60cm
                                paper)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex items-center justify-end gap-3">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-[#eb1700] hover:bg-[#c41400] text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#eb1700]/25"
                >
                    <Save className="w-4 h-4" />
                    Save Configuration
                </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Setup Instructions
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                    <li>
                        <strong>USB Serial:</strong> Connect printer via USB, click
                        Print, and select your printer in the browser dialog
                    </li>
                    <li>
                        <strong>Network:</strong> Enter your printer's IP address
                        (find in printer settings)
                    </li>
                    <li>
                        <strong>Browser:</strong> Set printer as default in your
                        system settings
                    </li>
                </ul>
            </div>
        </div>
    );
}

