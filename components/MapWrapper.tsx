'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { CoordinateData } from './Map';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 animate-pulse">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-red-500 animate-spin"></div>
                <span className="text-sm font-medium">Loading Map data...</span>
            </div>
        </div>
    )
});

import SearchModal from './SearchModal';

interface MapWrapperProps {
    data: CoordinateData[];
    displayLimit: number;
}

export default function MapWrapper({ data, displayLimit }: MapWrapperProps) {
    const [manualCoords, setManualCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="w-full h-full relative">
            <div className="w-full h-full">
                <Map data={data} manualCoordinates={manualCoords} displayLimit={displayLimit} />
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSearch={(lat, lng) => setManualCoords({ lat, lng })}
            />

            {/* Overlay Search/Actions */}
            <div className="absolute top-4 left-4 z-[400] flex gap-2">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="bg-white rounded-lg shadow-md border border-slate-200 p-2 flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-slate-50 transition-colors"
                    title="Search Location"
                >
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            <div className="absolute bottom-8 right-4 z-[400] flex flex-col gap-2">
                <div className="bg-white rounded-lg shadow-md border border-slate-200 p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-50">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <div className="bg-white rounded-lg shadow-md border border-slate-200 p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-50">
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
