"use client";

interface HeaderProps {
    user: {
        username: string;
        full_name?: string;
        role: string;
    };
    onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {(user.full_name || user.username)
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                {user.full_name || user.username}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
