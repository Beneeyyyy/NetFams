'use client'
import Link from 'next/link';

interface SidebarProps {
    activeNav: string;
}

export default function Sidebar({ activeNav }: SidebarProps) {
    return (
        <div className="w-72 h-full bg-gradient-to-br from-[#1A1F2E] to-[#2A3441] rounded-r-[6rem] flex flex-col">
            {/* Logo */}
            <div className="h-1/4 flex justify-center items-center border-b-2 border-white/10 rounded-tr-[6rem] shadow-[0_20px_30px_rgba(0,0,0,0.3)]">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#1A1F2E] rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            LOGO
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col mt-20">
                {[
                    { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
                    { name: 'Edit', icon: '✏️', path: '/dashboard/edit' },
                    { name: 'Blokir', icon: '🚫', path: '/dashboard/blokir' },
                ].map((item) => (
                    <Link href={item.path} key={item.name}>
                        <div className="relative group">
                            <button
                                className={`w-[20rem] h-[5rem] pl-9 text-left rounded-l-full transition-all duration-300 relative
                                    ${activeNav === item.name 
                                        ? 'bg-[#F5EFE6] text-[#1A1F2E]' 
                                        : 'text-white/90 hover:pl-12'}
                                    before:content-[""] before:absolute before:left-0 before:top-0 before:w-0 before:h-full 
                                    before:bg-gradient-to-r before:from-purple-500/20 before:to-pink-500/20 
                                    before:rounded-l-full before:transition-all before:duration-300
                                    group-hover:before:w-full
                                `}
                            >
                                <span className="text-2xl mr-4 transition-transform duration-300 group-hover:scale-110">
                                    {item.icon}
                                </span>
                                <span className="font-medium text-lg relative z-10">
                                    {item.name}
                                </span>
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
} 