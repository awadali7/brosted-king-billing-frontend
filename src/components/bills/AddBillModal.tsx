"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Plus, Minus, Trash2, Search } from "lucide-react";
import { api } from "@/utils/api";

interface BillItem {
    item_id: number;
    item_type: "menu_item" | "combo";
    item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface MenuOption {
    id: number;
    name: string;
    price: number;
    type: "menu_item" | "combo";
}

interface AddBillModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export default function AddBillModal({ onClose, onCreated }: AddBillModalProps) {
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [discountPct, setDiscountPct] = useState(0);
    const [taxPct, setTaxPct] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi" | "other">("cash");
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState("₹");
    const [items, setItems] = useState<BillItem[]>([]);

    const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
    const [menuLoading, setMenuLoading] = useState(false);
    const [menuError, setMenuError] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const s = localStorage.getItem("settings");
        if (s) {
            try {
                const parsed = JSON.parse(s);
                if (parsed.currency_symbol?.value) setCurrencySymbol(parsed.currency_symbol.value);
                if (parsed.tax_percentage?.value !== undefined) setTaxPct(parseFloat(parsed.tax_percentage.value) || 0);
            } catch {}
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            setMenuLoading(true);
            setMenuError(false);
            try {
                const [itemsRes, comboRes] = await Promise.all([
                    api.get("/items", { available: true }),
                    api.combos.getCombos(),
                ]);
                const menuItems: MenuOption[] = (itemsRes.data || []).map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    price: parseFloat(m.price),
                    type: "menu_item" as const,
                }));
                const comboItems: MenuOption[] = (comboRes.data || []).map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    price: parseFloat(c.price),
                    type: "combo" as const,
                }));
                setMenuOptions([...menuItems, ...comboItems]);
            } catch {
                setMenuError(true);
            }
            setMenuLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (showSearch) {
            setSearchQuery("");
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [showSearch]);

    const subtotal = items.reduce((s, i) => s + i.total_price, 0);
    const discountAmount = (subtotal * discountPct) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxPct) / 100;
    const total = afterDiscount + taxAmount;

    const fmt = (v: number) => `${currencySymbol}${v.toFixed(2)}`;

    const updateQty = (index: number, delta: number) => {
        setItems((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;
                const qty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: qty, total_price: qty * item.unit_price };
            })
        );
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const addMenuItem = (opt: MenuOption) => {
        const existing = items.findIndex(
            (i) => i.item_id === opt.id && i.item_type === opt.type
        );
        if (existing !== -1) {
            updateQty(existing, 1);
        } else {
            setItems((prev) => [
                ...prev,
                {
                    item_id: opt.id,
                    item_type: opt.type,
                    item_name: opt.name,
                    quantity: 1,
                    unit_price: opt.price,
                    total_price: opt.price,
                },
            ]);
        }
        setShowSearch(false);
    };

    const filteredOptions = searchQuery.trim()
        ? menuOptions.filter((o) => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : menuOptions;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim()) return;
        if (items.length === 0) return;

        setIsSaving(true);
        try {
            await api.bills.createBill({
                customer_name: customerName.trim(),
                customer_phone: customerPhone || undefined,
                customer_email: customerEmail || undefined,
                discount_percentage: discountPct,
                tax_percentage: taxPct,
                payment_method: paymentMethod,
                notes: notes || undefined,
                items: items.map((i) => ({
                    item_id: i.item_id,
                    item_type: i.item_type,
                    quantity: i.quantity,
                })),
            });
            onCreated();
        } catch (err: any) {
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">New Bill</h2>
                    <button onClick={onClose} disabled={isSaving} className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-5">

                        {/* ── Customer ── */}
                        <section>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Customer name"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="Phone number"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="Email address"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ── Items ── */}
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Items ({items.length})
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowSearch((v) => !v)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-[#eb1700] hover:text-[#c41400] transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    {showSearch ? "Close" : "Add Item"}
                                </button>
                            </div>

                            {showSearch && (
                                <div className="mb-3 border border-[#eb1700] rounded-lg overflow-hidden">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search menu items or combos..."
                                            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white text-gray-900 border-b border-gray-200 focus:outline-none"
                                        />
                                    </div>
                                    <div className="max-h-52 overflow-y-auto bg-white">
                                        {menuLoading ? (
                                            <div className="flex items-center justify-center py-6 gap-2 text-sm text-gray-500">
                                                <div className="w-4 h-4 border-2 border-[#eb1700] border-t-transparent rounded-full animate-spin" />
                                                Loading items...
                                            </div>
                                        ) : menuError ? (
                                            <p className="p-3 text-sm text-red-500 text-center">Failed to load items — please close and reopen.</p>
                                        ) : filteredOptions.length === 0 ? (
                                            <p className="p-3 text-sm text-gray-500 text-center">No items match "{searchQuery}"</p>
                                        ) : (
                                            filteredOptions.slice(0, 30).map((opt) => (
                                                <button
                                                    key={`${opt.type}-${opt.id}`}
                                                    type="button"
                                                    onClick={() => addMenuItem(opt)}
                                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                                >
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-gray-900">{opt.name}</p>
                                                        <p className="text-xs text-gray-500 capitalize">{opt.type.replace("_", " ")}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-[#eb1700] ml-4 flex-shrink-0">{fmt(opt.price)}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {items.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">No items — add at least one</p>
                            ) : (
                                <div className="space-y-2">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.item_name}</p>
                                                <p className="text-xs text-gray-500">{fmt(item.unit_price)} each</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button type="button" onClick={() => updateQty(index, -1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                                                <button type="button" onClick={() => updateQty(index, 1)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-20 text-right">{fmt(item.total_price)}</span>
                                            <button type="button" onClick={() => removeItem(index)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ── Pricing ── */}
                        <section>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing</h3>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Discount (%)</label>
                                    <input type="number" min="0" max="100" step="0.01" value={discountPct}
                                        onChange={(e) => setDiscountPct(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Tax (%)</label>
                                    <input type="number" min="0" max="100" step="0.01" value={taxPct}
                                        onChange={(e) => setTaxPct(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent" />
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span><span>{fmt(subtotal)}</span>
                                </div>
                                {discountPct > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount ({discountPct}%)</span><span>-{fmt(discountAmount)}</span>
                                    </div>
                                )}
                                {taxPct > 0 && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tax ({taxPct}%)</span><span>{fmt(taxAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-200">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-[#eb1700]">{fmt(total)}</span>
                                </div>
                            </div>
                        </section>

                        {/* ── Payment Method ── */}
                        <section>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment Method</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {(["cash", "card", "upi", "other"] as const).map((m) => (
                                    <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                                        className={`py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                                            paymentMethod === m
                                                ? "bg-[#eb1700] text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >{m}</button>
                                ))}
                            </div>
                        </section>

                        {/* ── Notes ── */}
                        <section>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                                placeholder="Add any notes..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#eb1700] focus:border-transparent resize-none" />
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} disabled={isSaving}
                            className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving || items.length === 0 || !customerName.trim()}
                            className="flex-1 bg-[#eb1700] hover:bg-[#c41400] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSaving ? "Creating..." : "Create Bill"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
