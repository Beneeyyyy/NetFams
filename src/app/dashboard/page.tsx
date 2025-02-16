'use client'
import { useState } from 'react';
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

export default function Dashboard() {
    const [devices, setDevices] = useState([
        { 
            id: 1, 
            name: 'Device_1', 
            speed: '100 Mbps', 
            status: 'active',
            mac: '00:11:22:33:44:55',
            ipAddress: '192.168.1.100',
            lastSeen: 'Active now'
        },
        { 
            id: 2, 
            name: 'Device_2', 
            speed: '50 Mbps', 
            status: 'active',
            mac: '00:11:22:33:44:66',
            ipAddress: '192.168.1.101',
            lastSeen: 'Active now'
        },
        { 
            id: 3, 
            name: 'Smart TV', 
            speed: '25 Mbps', 
            status: 'limited',
            mac: '00:11:22:33:44:77', 
            type: 'tv',
            ipAddress: '192.168.1.102',
            lastSeen: '2 minutes ago'
        },
        { 
            id: 4, 
            name: 'iPad Mini', 
            speed: '75 Mbps', 
            status: 'active',
            mac: '00:11:22:33:44:88', 
            type: 'tablet',
            ipAddress: '192.168.1.103',
            lastSeen: 'Active now'
        }
    ]);

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

    return (
        <>
            <div className="p-8 pt-0">
                {/* Animated Content */}
                <PageTransition className="flex flex-col items-center">
                    {/* Search */}
                    <div className="mb-6 w-full max-w-4xl">
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Search device..."
                                className="w-full pl-10 pr-4 py-5 rounded-[32px] bg-white 
                                         border-2 border-slate-200 text-slate-600
                                         focus:outline-none focus:border-slate-300
                                         placeholder:text-slate-400
                                         shadow-[0_4px_20px_rgb(0,0,0,0.03)]
                                         hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)]
                                         transition-all duration-300"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 w-5 h-5 stroke-[2.5]" />
                        </div>
                    </div>

                    {/* Device List */}
                    <div className="bg-white rounded-[32px] border-2 border-slate-200 overflow-hidden w-full max-w-4xl">
                        {/* Header Tabel */}
                        <div className="grid grid-cols-[2fr,1fr,auto] gap-4 px-8 py-5 bg-slate-50 border-b-2 border-slate-200">
                            <div className="text-sm font-medium text-slate-600">Device</div>
                            <div className="text-sm font-medium text-slate-600">Speed</div>
                            <div className="w-28 text-sm font-medium text-slate-600">Actions</div>
                        </div>

                        {/* Device Items */}
                        <div className="divide-y-2 divide-slate-100">
                            {devices.map((device) => (
                                <div key={device.id} className="relative">
                                    <div className="grid grid-cols-[2fr,1fr,auto] gap-4 px-8 py-6
                                                  items-center hover:bg-slate-50/50 transition-colors">
                                        <div>
                                            <div className="font-medium text-slate-800 flex items-center gap-3">
                                                <Laptop2 size={24} className="text-indigo-700" />
                                                {device.name}
                                            </div>
                                            <div className="text-sm text-slate-500 ml-9">{device.mac}</div>
                                        </div>
                                        <div className="text-slate-700 font-medium">{device.speed}</div>
                                        <div className="flex gap-1.5 w-28 justify-end">
                                            <button 
                                                onClick={() => openModal(device, 'rename')}
                                                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900
                                                         transition-colors"
                                                title="Rename Device"
                                            >
                                                <Pencil size={20} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => openModal(device, 'bandwidth')}
                                                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900
                                                         transition-colors"
                                                title="Set Speed"
                                            >
                                                <Zap size={20} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => openModal(device, 'block')}
                                                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-900
                                                         transition-colors"
                                                title="Block Device"
                                            >
                                                <Ban size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Blocked Overlay */}
                                    {device.status === 'blocked' && (
                                        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[1px] 
                                                      flex items-center justify-center">
                                            <button 
                                                onClick={() => handleUnblock(device.id)}
                                                className="px-5 py-2.5 bg-white rounded-xl shadow-sm border border-rose-100
                                                         text-rose-600 hover:bg-rose-50 transition-colors
                                                         flex items-center gap-2"
                                            >
                                                <Lock size={16} />
                                                Unblock Device
                                            </button>
                                        </div>
                                    )}
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