import { useState } from 'react';
import Image from 'next/image';
import { CoordinateData } from './Map';

interface SidebarProps {
    totalMerchants: number;
    recentMerchants: CoordinateData[];
    onToggle?: () => void;
    displayLimit: number;
    setDisplayLimit: (limit: number) => void;
}

export default function Sidebar({ totalMerchants, recentMerchants, onToggle, displayLimit, setDisplayLimit }: SidebarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const displayedMerchants = displayLimit === 0 ? [] : recentMerchants.slice(0, displayLimit);

    return (
        <aside className="w-80 bg-white h-full flex flex-col border-r border-slate-200 shadow-sm z-20">
            {/* Header / Brand */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="relative w-24 h-8">
                    <Image
                        src="https://ipaymu.com/wp-content/themes/ipaymu_v2/assets/img/logo/ipaymu_blue_vvs.png"
                        alt="iPaymu"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Profile / Context */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                        AD
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Admin Dashboard</h2>
                        <p className="text-xs text-slate-500">Bali, ID</p>
                    </div>
                </div>
            </div>

            {/* Merchant List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3 relative">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Merchants</h3>
                        <button
                            id="merchant-list"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-[100]"
                                    onClick={() => setIsMenuOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-8 z-[101] bg-white rounded-lg shadow-xl border border-slate-100 w-32 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => { setDisplayLimit(10); setIsMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${displayLimit === 10 ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        Show 10
                                    </button>
                                    <button
                                        onClick={() => { setDisplayLimit(50); setIsMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${displayLimit === 50 ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        Show 50
                                    </button>
                                    <button
                                        onClick={() => { setDisplayLimit(100); setIsMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${displayLimit === 100 ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        Show 100
                                    </button>
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <button
                                        onClick={() => { setDisplayLimit(0); setIsMenuOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors ${displayLimit === 0 ? 'bg-red-50' : ''}`}
                                    >
                                        Remove All
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-3">
                        {displayedMerchants.map((merchant) => (
                            <div key={merchant.member_id} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{merchant.fname}</h4>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mb-1 line-clamp-1">{merchant.email}</p>
                                <p className="text-[10px] text-slate-400">Login: {new Date(merchant.last_login_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
