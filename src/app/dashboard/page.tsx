'use client'
import { useState, useEffect } from 'react';
import { 
    Pencil, 
    Zap, 
    Ban, 
    Search,
    Wifi,
    Lock,
    Laptop2,
    LayoutDashboard
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SuccessModal from '../components/SuccessModal';
import { MikrotikCredentials } from '@/types/mikrotiktypes';

export default function Dashboard() {
    const [devices, setDevices] = useState<any[]>([]); // Initialize as empty array

    const [showModal, setShowModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [modalType, setModalType] = useState<'rename' | 'bandwidth' | 'block'>('rename');
    
    // State untuk form
    const [newName, setNewName] = useState('');
    const [bandwidth, setBandwidth] = useState({
        download: '',
        upload: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Tambahkan state untuk menyimpan daftar pengguna
    const [connectedUsers, setConnectedUsers] = useState<any[]>([]);

    const [credentials, setCredentials] = useState<MikrotikCredentials | null>(null);

    const openModal = (device: any, type: 'rename' | 'bandwidth' | 'block') => {
        setSelectedDevice(device);
        setModalType(type);
        // Reset form values
        if (type === 'rename') {
            setNewName(device.name);
        } else if (type === 'bandwidth') {
            setBandwidth({
                download: device.speed.split(' ')[0], // Mengambil angka dari "100 Mbps"
                upload: '50' // Default upload speed
            });
        }
        setShowModal(true);
    };

    const handleSave = () => {
        const updatedDevices = devices.map(device => {
            if (device.id === selectedDevice.id) {
                switch (modalType) {
                    case 'rename':
                        setSuccessMessage('Device name has been updated successfully!');
                        return { ...device, name: newName };
                    case 'bandwidth':
                        setSuccessMessage('Device speed has been updated successfully!');
                        return { ...device, speed: `${bandwidth.download} Mbps` };
                    case 'block':
                        setSuccessMessage('Device has been blocked successfully!');
                        return { ...device, status: 'blocked' };
                    default:
                        return device;
                }
            }
            return device;
        });
        setDevices(updatedDevices);
        setShowModal(false);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const handleUnblock = (deviceId: number) => {
        const updatedDevices = devices.map(device => {
            if (device.id === deviceId) {
                return { ...device, status: 'active' };
            }
            return device;
        });
        setDevices(updatedDevices);
    };

    // Fungsi untuk mengambil daftar pengguna yang terhubung
    const fetchConnectedUsers = async (credentials: MikrotikCredentials) => {
        const response = await fetch('/api/mikrotik', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            console.error('HTTP error:', response.status);
            return;
        }
        const data = await response.json();
        if (data.success) {
            // Mengambil data dari queue simple
            const queueData = data.queueData.split('\r\n');
            const queueMap = new Map();
            
            // Parsing data queue simple
            queueData.forEach((line: string) => {
                const parts = line.split(/\s+/);
                if (parts.length > 6) {
                    const name = parts[2]; // Nama queue
                    const target = parts[4]; // Target IP
                    const maxLimit = parts[6]; // Max-limit (rx/tx)
                    
                    if (name && target && maxLimit) {
                        queueMap.set(target.toLowerCase(), {
                            name: name,
                            maxLimit: maxLimit
                        });
                    }
                }
            });
            
            // Mengambil data interface statistics
            const interfaceStats = data.interfaceStats.split('\r\n');
            const interfaceMap = new Map();
            
            // Parsing data interface statistics
            interfaceStats.forEach((line: string) => {
                const parts = line.split(/\s+/);
                if (parts.length > 8) {
                    const name = parts[1]; // Nama interface
                    const rxBytes = parts[3]; // Rx bytes
                    const txBytes = parts[5]; // Tx bytes
                    if (name) {
                        interfaceMap.set(name.toLowerCase(), { rx: rxBytes, tx: txBytes });
                    }
                }
            });
            
            // Mengambil data bandwidth dari monitor-traffic
            const bandwidthData = data.bandwidthData.split('\r\n');
            let totalRx = '0';
            let totalTx = '0';
            
            // Parsing data monitor-traffic
            bandwidthData.forEach((line: string) => {
                if (line.includes('rx-bits-per-second')) {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        totalRx = (parseInt(parts[1].trim()) / 1000000).toFixed(2) + ' Mbps'; // Convert to Mbps
                    }
                }
                if (line.includes('tx-bits-per-second')) {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        totalTx = (parseInt(parts[1].trim()) / 1000000).toFixed(2) + ' Mbps'; // Convert to Mbps
                    }
                }
            });
            
            // Mengambil data dari output dan memformatnya
            const users = data.data.split('\r\n').slice(1).map((line: string) => {
                const parts = line.split(/\s+/);
                // Filter untuk hanya menampilkan nama host dan MAC address
                const hostName = parts[5] || 'Unknown';
                const macAddress = parts[4];
                const ipAddress = parts[3] || '';
                
                // Cari data bandwidth dari queue
                let speed = '';
                
                // Coba cari berdasarkan IP address di queue
                if (queueMap.has(ipAddress.toLowerCase())) {
                    const queueInfo = queueMap.get(ipAddress.toLowerCase());
                    speed = queueInfo.maxLimit;
                } else {
                    // Jika tidak ada di queue, gunakan perkiraan dari total bandwidth
                    const totalUsers = data.data.split('\r\n').length - 1;
                    const rxPerUser = totalRx ? (parseFloat(totalRx) / totalUsers).toFixed(2) + ' Mbps' : '0 Mbps';
                    const txPerUser = totalTx ? (parseFloat(totalTx) / totalUsers).toFixed(2) + ' Mbps' : '0 Mbps';
                    speed = `${rxPerUser}/${txPerUser} (est.)`;
                }
                
                // Hanya ambil data jika hostName bukan 'SERVER' atau 'HOS'
                if (hostName !== 'SERVER' && hostName !== 'HOS') {
                    return {
                        name: hostName,
                        mac: macAddress,
                        id: parts[1],
                        speed: speed,
                        ipAddress: ipAddress,
                        hasQueue: queueMap.has(ipAddress.toLowerCase())
                    };
                }
                return null;
            }).filter((user: { name: string; mac: string; id: string; speed: string; ipAddress: string; hasQueue: boolean } | null) => user !== null); // Hapus entri null
            setDevices(users);
            
            // Set interval untuk refresh data setiap 10 detik
            const intervalId = setInterval(() => {
                fetchConnectedUsers(credentials);
            }, 10000);
            
            // Clear interval saat komponen unmount
            return () => clearInterval(intervalId);
        } else {
            console.error(data.error);
        }
    };

    // Panggil fetchConnectedUsers saat komponen dimuat
    useEffect(() => {
        const storedCredentials = localStorage.getItem('mikrotikCredentials');
        const isConnected = localStorage.getItem('mikrotikConnected');
        let cleanupFunction: (() => void) | undefined;

        if (isConnected === 'true' && storedCredentials) {
            const credentials = JSON.parse(storedCredentials);
            console.log('Currently connected to Mikrotik with credentials:', credentials);
            
            // Panggil fungsi untuk mengambil pengguna
            cleanupFunction = fetchConnectedUsers(credentials) as unknown as (() => void);
        } else {
            console.log('Not connected to Mikrotik.');
        }

        // Cleanup interval saat komponen unmount
        return () => {
            if (cleanupFunction) {
                cleanupFunction();
            }
        };
    }, []);

    // Tambahkan fungsi untuk memutuskan koneksi
    const handleDisconnect = async (macAddress: string) => {
        if (!credentials) return;
        const response = await fetch('/api/mikrotik/disconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credentials, macAddress }),
        });
        const data = await response.json();
        if (data.success) {
            alert(data.message);
            fetchConnectedUsers(credentials);
        } else {
            console.error(data.error);
        }
    };

    useEffect(() => {
        // Fungsi untuk memeriksa status koneksi
        const checkConnectionStatus = () => {
            const isConnected = localStorage.getItem('mikrotikConnected');
            if (isConnected === 'true') {
                console.log('Currently connected to Mikrotik.');
            } else {
                console.log('Not connected to Mikrotik.');
            }
        };

        // Set interval untuk memeriksa status setiap 3 detik
        const intervalId = setInterval(checkConnectionStatus, 3000);

        // Bersihkan interval saat komponen di-unmount
        return () => clearInterval(intervalId);
    }, []); // Kosongkan array dependencies agar hanya dijalankan sekali saat komponen dimuat

    return (
        <>
            <div className="p-8 pt-0">
                <PageTransition className="flex flex-col items-center">
                    <div className="bg-white rounded-[32px] border-2 border-slate-200 overflow-hidden w-full max-w-4xl">
                        {/* Device Items */}
                        <div className="divide-y-2 divide-slate-100">
                            <div className="grid grid-cols-[2fr,1fr,auto] gap-4 px-8 py-5 bg-slate-50 border-b-2 border-slate-200">
                                <div className="text-sm font-medium text-slate-600">Device</div>
                                <div className="text-sm font-medium text-slate-600">Speed</div>
                                <div className="w-28 text-sm font-medium text-slate-600">Actions</div>
                            </div>
                            {devices.map((device) => (
                                <div key={device.id} className="relative">
                                    <div className="grid grid-cols-[2fr,1fr,auto] gap-4 px-8 py-6 items-center hover:bg-slate-50/50 transition-colors">
                                        <div>
                                            <div className="font-medium text-slate-800 text-lg flex items-center gap-3">
                                                {device.name}
                                            </div>
                                            <div className="text-sm text-slate-500 ml-0">{device.mac}</div>
                                        </div>
                                        <div className="text-slate-700 font-medium flex items-center">
                                            {device.speed}
                                            {device.hasQueue && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    Queue
                                                </span>
                                            )}
                                            {!device.hasQueue && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    Est.
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-1.5 w-28 justify-end">
                                            <button 
                                                onClick={() => openModal(device, 'rename')}
                                                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 transition-colors"
                                                title="Rename Device"
                                            >
                                                <Pencil size={20} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => openModal(device, 'bandwidth')}
                                                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 transition-colors"
                                                title="Set Speed"
                                            >
                                                <Zap size={20} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => openModal(device, 'block')}
                                                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900 transition-colors"
                                                title="Block Device"
                                            >
                                                <Ban size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </PageTransition>
            </div>

            {/* Clean Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
                        {modalType === 'rename' && (
                            <>
                                <h3 className="text-lg font-medium text-[#1A1F2E] mb-4">Ganti Nama Perangkat</h3>
                                <input 
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[#1A1F2E]/10 
                                             focus:outline-none focus:border-purple-500 text-base
                                             transition-colors"
                                    placeholder="Masukkan nama baru"
                                />
                            </>
                        )}

                        {modalType === 'bandwidth' && (
                            <>
                                <h3 className="text-lg font-medium text-[#1A1F2E] mb-4">Atur Kecepatan</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-[#1A1F2E]/70 block mb-2">
                                            Download (Mbps)
                                        </label>
                                        <input 
                                            type="number"
                                            value={bandwidth.download}
                                            onChange={(e) => setBandwidth({...bandwidth, download: e.target.value})}
                                            min="1"
                                            max="100"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#1A1F2E]/10 
                                                     focus:outline-none focus:border-purple-500 text-base
                                                     transition-colors"
                                            placeholder="Contoh: 50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[#1A1F2E]/70 block mb-2">
                                            Upload (Mbps)
                                        </label>
                                        <input 
                                            type="number"
                                            value={bandwidth.upload}
                                            onChange={(e) => setBandwidth({...bandwidth, upload: e.target.value})}
                                            min="1"
                                            max="100"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#1A1F2E]/10 
                                                     focus:outline-none focus:border-purple-500 text-base
                                                     transition-colors"
                                            placeholder="Contoh: 25"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {modalType === 'block' && (
                            <>
                                <h3 className="text-lg font-medium text-[#1A1F2E] mb-4">Blokir Perangkat</h3>
                                <p className="text-[#1A1F2E]/60 mb-4">
                                    Apakah Anda yakin ingin memblokir perangkat ini?
                                    <br />
                                    <span className="font-medium text-[#1A1F2E]">{selectedDevice.name}</span>
                                </p>
                            </>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg hover:bg-gray-100 text-[#1A1F2E]"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 
                                         text-white hover:opacity-90"
                            >
                                {modalType === 'block' ? 'Blokir' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal 
                show={showSuccess}
                message={successMessage}
                onClose={() => setShowSuccess(false)}
            />
        </>
    );
}