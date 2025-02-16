'use client'
import { useState } from 'react';
import { Settings } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import SuccessModal from '../../components/SuccessModal';

export default function Edit() {
    const [showPassword, setShowPassword] = useState(false);
    const [wifiSettings, setWifiSettings] = useState({
        ssid: 'NetFams_Home',
        password: 'password123',
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        // Logika penyimpanan
        
        // Tampilkan modal success
        setShowSuccess(true);
        
        // Optional: otomatis tutup setelah beberapa detik
        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

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
                                Nama WiFi
                            </label>
                            <input 
                                type="text"
                                value={wifiSettings.ssid}
                                onChange={(e) => setWifiSettings({...wifiSettings, ssid: e.target.value})}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-100
                                         focus:outline-none focus:border-indigo-600/20 text-slate-600"
                                placeholder="Contoh: NetFams_Home"
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
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-100
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
                            <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl 
                                           hover:bg-indigo-700 transition-colors font-medium"
                                           onClick={handleSave}>
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