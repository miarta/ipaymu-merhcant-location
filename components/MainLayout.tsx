'use client';

import { useState } from 'react';
import { CoordinateData } from './Map';
import Sidebar from './Sidebar';
import MapWrapper from './MapWrapper';

interface MainLayoutProps {
    data: CoordinateData[];
}

export default function MainLayout({ data }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / displayLimit);
    const startIndex = (currentPage - 1) * displayLimit;
    const visibleData = displayLimit === 0 ? [] : data.slice(startIndex, startIndex + displayLimit);

    // Reset to page 1 when limit changes
    const handleLimitChange = (limit: number) => {
        setDisplayLimit(limit);
        setCurrentPage(1);
    };

    return (
        <main className="h-screen w-screen bg-slate-50 flex overflow-hidden font-sans relative">
            {/* Sidebar */}
            {/* Sidebar Container - Smooth width transition */}
            <div
                className={`${isSidebarOpen ? 'w-80 border-r border-slate-200' : 'w-0 border-none'} flex-shrink-0 transition-all duration-300 ease-in-out h-full z-30 overflow-hidden bg-white relative`}
            >
                <div className="w-80 h-full">
                    <Sidebar
                        totalMerchants={data.length}
                        recentMerchants={visibleData}
                        displayLimit={displayLimit}
                        setDisplayLimit={handleLimitChange}
                        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Floating Toggle Button (Visible when sidebar is closed) */}
            <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${!isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full relative z-0 bg-slate-100">
                <MapWrapper data={visibleData} displayLimit={displayLimit} />
            </div>
        </main>
    );
}
