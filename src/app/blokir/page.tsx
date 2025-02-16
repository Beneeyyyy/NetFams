'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Blokir() {
    const [activeNav, setActiveNav] = useState('Blokir');
    const [newSite, setNewSite] = useState('');

    return (
        <div className="h-screen bg-[#F5EFE6] flex">
            {/* Sidebar - sama seperti dashboard */}
            {/* ... copy sidebar dari dashboard ... */}

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1A1F2E]">
                        Pemblokiran
                    </h1>
                    <div className="flex gap-4">
                        <input 
                            type="text"
                            value={newSite}
                            onChange={(e) => setNewSite(e.target.value)}
                            placeholder="Tambah situs untuk diblokir..."
                            className="pl-4 pr-10 py-2 rounded-lg bg-white border border-[#1A1F2E]/20 
                                     focus:outline-none focus:border-[#1A1F2E] w-64"
                        />
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                            Tambah
                        </button>
                    </div>
                </div>

                {/* Blocked Sites List */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-[#1A1F2E] mb-4">Situs Diblokir</h2>
                    <div className="space-y-3">
                        {[
                            { site: 'example.com', category: 'Sosial Media', time: '2 hari yang lalu' },
                            { site: 'games.com', category: 'Gaming', time: '1 minggu yang lalu' },
                            { site: 'streaming.com', category: 'Hiburan', time: '3 hari yang lalu' },
                        ].map((item, index) => (
                            <div key={index} 
                                 className="flex items-center justify-between p-4 rounded-xl border border-[#1A1F2E]/10 hover:bg-[#1A1F2E]/[0.02]">
                                <div className="flex items-center gap-4">
                                    <span className="text-red-500 text-xl">🚫</span>
                                    <div>
                                        <p className="text-[#1A1F2E] font-medium">{item.site}</p>
                                        <p className="text-sm text-[#1A1F2E]/60">{item.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-[#1A1F2E]/60">{item.time}</span>
                                    <button className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blocked Users */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-semibold text-[#1A1F2E] mb-4">Perangkat Diblokir</h2>
                    <div className="space-y-3">
                        {[
                            { device: 'Android Phone', mac: '00:1B:44:11:3A:B7', time: '2 jam yang lalu' },
                            { device: 'Unknown Device', mac: '00:1B:44:11:3A:B8', time: '1 hari yang lalu' },
                        ].map((item, index) => (
                            <div key={index} 
                                 className="flex items-center justify-between p-4 rounded-xl border border-[#1A1F2E]/10 hover:bg-[#1A1F2E]/[0.02]">
                                <div className="flex items-center gap-4">
                                    <span className="text-red-500 text-xl">📱</span>
                                    <div>
                                        <p className="text-[#1A1F2E] font-medium">{item.device}</p>
                                        <p className="text-sm text-[#1A1F2E]/60">{item.mac}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-[#1A1F2E]/60">{item.time}</span>
                                    <button className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 transition-colors">
                                        Buka Blokir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 