'use client'
import { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import { Ban } from 'lucide-react';
import SuccessModal from '../../components/SuccessModal';

export default function Blokir() {
    const [newSite, setNewSite] = useState('');
    const [blockedSites, setBlockedSites] = useState([
        { id: 1, url: 'tiktok.com', category: 'Sosial Media', timeBlocked: 'Hari ini, 14:30' },
        { id: 2, url: 'facebook.com', category: 'Sosial Media', timeBlocked: 'Hari ini, 14:30' },
        { id: 3, url: 'youtube.com', category: 'Hiburan', timeBlocked: 'Hari ini, 14:30' },
    ]);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddSite = () => {
        if (newSite) {
            setBlockedSites([
                {
                    id: blockedSites.length + 1,
                    url: newSite,
                    category: 'Lainnya',
                    timeBlocked: 'Baru saja'
                },
                ...blockedSites
            ]);
            setNewSite('');
            
            // Tampilkan modal success
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        }
    };

    return (
        <div className="p-8">
            {/* Static Header */}
            <div className="mb-8">
                <h1 className="text-2xl text-center font-semibold text-slate-800" style={{ fontFamily: 'Slackey, cursive' }}>
                    Blokir Website
                </h1>
                <p className="text-sm text-center text-slate-500 mt-2">
                    Kelola website yang tidak boleh diakses
                </p>
            </div>

            {/* Animated Content */}
            <PageTransition className="flex flex-col items-center">
                {/* Add New Site */}
                <div className="w-full max-w-4xl mb-6">
                    <div className="relative">
                        <input 
                            type="text"
                            value={newSite}
                            onChange={(e) => setNewSite(e.target.value)}
                            className="w-full pl-12 pr-4 py-5 rounded-[32px] bg-white 
                                     border-2 border-slate-200 text-slate-600
                                     focus:outline-none focus:border-slate-300
                                     placeholder:text-slate-400
                                     shadow-[0_4px_20px_rgb(0,0,0,0.03)]
                                     hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]
                                     transition-all duration-300"
                            placeholder="Masukkan alamat website (contoh: facebook.com)"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-medium">
                            www.
                        </div>
                        <button 
                            onClick={handleAddSite}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2
                                     bg-slate-900 text-white rounded-2xl hover:bg-slate-800
                                     transition-colors text-sm font-medium"
                        >
                            Tambah
                        </button>
                    </div>
                </div>

                {/* Blocked Sites List */}
                <div className="bg-white rounded-[32px] border-2 border-slate-200 overflow-hidden w-full max-w-4xl
                                shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]
                                transition-all duration-300">
                    <div className="px-8 py-5 bg-slate-50 border-b-2 border-slate-200">
                        <h2 className="text-sm font-medium text-slate-600">Daftar Website Diblokir</h2>
                    </div>
                    
                    <div className="divide-y-2 divide-slate-100">
                        {blockedSites.map((site) => (
                            <div 
                                key={site.id}
                                className="flex items-center justify-between px-8 py-6 hover:bg-slate-50/50
                                         transition-colors"
                            >
                                <div>
                                    <h3 className="text-slate-800 font-medium">{site.url}</h3>
                                    <div className="text-sm text-slate-500 mt-1">
                                        {site.category} • Diblokir {site.timeBlocked}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setBlockedSites(blockedSites.filter(s => s.id !== site.id))}
                                    className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900
                                             transition-colors"
                                >
                                    <Ban size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        ))}

                        {blockedSites.length === 0 && (
                            <div className="text-center py-8 text-slate-400">
                                Belum ada website yang diblokir
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>

            <SuccessModal 
                show={showSuccess}
                message="Website has been blocked successfully!"
                onClose={() => setShowSuccess(false)}
            />
        </div>
    );
} 