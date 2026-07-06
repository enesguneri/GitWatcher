// src/app/dashboard/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/analysis', label: 'AI Analysis', icon: '🤖' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
                aria-label="Toggle sidebar"
            >
                {isMobileOpen ? '✕' : '☰'}
            </button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-40 w-56
                    bg-[#0d1117]/95 backdrop-blur-xl
                    border-r border-white/[0.06]
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    lg:translate-x-0
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Logo */}
                <div className="p-5 border-b border-white/[0.06]">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-lg">🔍</span>
                        <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            GitWatcher
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                transition-all duration-200
                                ${isActive(item.href)
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent'
                                }
                            `}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/[0.06]">
                    <p className="text-xs text-slate-600 text-center">
                        GitWatcher v0.1.0
                    </p>
                </div>
            </aside>
        </>
    );
}
