// src/app/dashboard/layout.tsx
// Dashboard layout — sidebar + topbar wrapper for all dashboard pages
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0e1a] text-slate-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main area (offset by sidebar width on desktop) */}
            <div className="lg:ml-56">
                <TopBar />
                <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
