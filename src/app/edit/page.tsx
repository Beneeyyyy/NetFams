'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function Edit() {
    const [activeNav, setActiveNav] = useState('Edit');
    const [selectedDevice, setSelectedDevice] = useState('all');

    return (
        <div className="h-screen bg-[#F5EFE6] flex">
            {/* Sidebar - sama seperti dashboard */}
            {/* ... copy sidebar dari dashboard ... */}

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1A1F2E]">
                        Pengaturan Perangkat
                    </h1>
                    <select 
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-white border border-[#1A1F2E]/20 
                                 focus:outline-none focus:border-[#1A1F2E] w-64"
                    >
                        <option value="all">Semua Perangkat</option>
                        <option value="iphone">iPhone 13 Pro</option>
                        <option value="laptop">Laptop Asus</option>
                        <option value="tv">Smart TV</option>
                    </select>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Speed Limit */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#1A1F2E] mb-4">Batas Kecepatan</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[#1A1F2E]/70 block mb-2">Download (Mbps)</label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    defaultValue="50"
                                    className="w-full accent-purple-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[#1A1F2E]/70 block mb-2">Upload (Mbps)</label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    defaultValue="30"
                                    className="w-full accent-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Time Limit */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#1A1F2E] mb-4">Batas Waktu</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-[#1A1F2E]/70 block mb-2">Mulai</label>
                                <input 
                                    type="time" 
                                    className="w-full px-3 py-2 rounded-lg border border-[#1A1F2E]/20 focus:outline-none focus:border-[#1A1F2E]"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[#1A1F2E]/70 block mb-2">Selesai</label>
                                <input 
                                    type="time"
                                    className="w-full px-3 py-2 rounded-lg border border-[#1A1F2E]/20 focus:outline-none focus:border-[#1A1F2E]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Quota */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#1A1F2E] mb-4">Kuota Data</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[#1A1F2E]/70 block mb-2">Batas Harian (GB)</label>
                                <input 
                                    type="number"
                                    min="1"
                                    className="w-full px-3 py-2 rounded-lg border border-[#1A1F2E]/20 focus:outline-none focus:border-[#1A1F2E]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-end">
                        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity">
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 