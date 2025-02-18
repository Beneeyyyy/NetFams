'use client'
import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import SuccessModal from '../../components/SuccessModal';

export default function Edit() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [wifiSettings, setWifiSettings] = useState({
        ssid: '',
        password: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Ambil data WiFi saat komponen dimount
        const fetchWiFiSettings = async () => {
            try {
                const credentials = JSON.parse(localStorage.getItem('mikrotikCredentials') || '{}');
                
                const response = await fetch('/api/mikrotik/wifi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials),
                });

                if (!response.ok) throw new Error('Failed to fetch WiFi settings');

                const data = await response.json();
                setWifiSettings({
                    ssid: data.ssid,
                    password: data.password
                });
            } catch (error) {
                console.error('Error fetching WiFi settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWiFiSettings();
    }, []);

    const handleSave = async () => {
        try {
            const credentials = JSON.parse(localStorage.getItem('mikrotikCredentials') || '{}');
            
            const response = await fetch('/api/mikrotik/wifi/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...credentials,
                    wifiSettings
                }),
            });

            if (!response.ok) throw new Error('Failed to update WiFi settings');

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        } catch (error) {
            console.error('Error updating WiFi settings:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Static Header */}
            <div className="mb-8">
                <h1 className="text-2xl text-center font-semibold text-slate-800" style={{ fontFamily: 'Slackey, cursive' }}>
                    Pengaturan WiFi
                </h1>
                <p className="text-sm text-center text-slate-500 mt-2">
                    Atur nama dan password jaringan WiFi Anda
                </p>
            </div>

            {/* Animated Content */}
            <PageTransition className="flex flex-col items-center">
                <div className="w-full max-w-4xl bg-white rounded-[32px] border-2 border-slate-200 p-8
                                shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]
                                transition-all duration-300">
                    <div className="space-y-8">
                        {/* Nama WiFi */}
                        <div>
                            <label className="text-base text-slate-800 font-medium block mb-3">
                                Nama WiFi (SSID)
                            </label>
                            <input 
                                type="text"
                                value={wifiSettings.ssid}
                                onChange={(e) => setWifiSettings({...wifiSettings, ssid: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200
                                         focus:outline-none focus:border-indigo-600/20 text-slate-600"
                                placeholder="Masukkan nama WiFi"
                            />
                            <p className="text-sm text-slate-500 mt-2">
                                Nama ini akan muncul di daftar WiFi perangkat Anda
                            </p>
                        </div>

                        {/* Password WiFi */}
                        <div>
                            <label className="text-base text-slate-800 font-medium block mb-3">
                                Password WiFi
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={wifiSettings.password}
                                    onChange={(e) => setWifiSettings({...wifiSettings, password: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200
                                             focus:outline-none focus:border-indigo-600/20 text-slate-600"
                                    placeholder="Masukkan password WiFi"
                                />
                                <button 
                                    onClick={() => setShowPassword(!showPassword)}
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400
                                             hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? '🔒' : '👁️'}
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                Minimal 8 karakter, kombinasi huruf dan angka untuk keamanan lebih baik
                            </p>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button 
                                onClick={handleSave}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                                         text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                            >
                                Simpan Perubahan
                            </button>
                            <p className="text-sm text-slate-500 text-center mt-3">
                                WiFi akan terputus sebentar saat menyimpan perubahan
                            </p>
                        </div>
                    </div>
                </div>
            </PageTransition>

            {/* Success Modal */}
            <SuccessModal 
                show={showSuccess}
                message="WiFi settings have been updated successfully!"
                onClose={() => setShowSuccess(false)}
            />
        </div>
    );
} 