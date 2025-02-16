'use client'
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Settings, 
    Ban
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();

    const navItems = [
        { 
            name: 'Dashboard', 
            icon: <LayoutDashboard size={22} />, 
            path: '/dashboard' 
        },
        { 
            name: 'Edit', 
            icon: <Settings size={22} />, 
            path: '/dashboard/edit' 
        },
        { 
            name: 'Blokir', 
            icon: <Ban size={22} />, 
            path: '/dashboard/blokir' 
        },
    ];

    return (
        <div className="h-screen bg-[#F5EFE6] flex">
            {/* Sidebar dengan shadow */}
            <div className="w-80 h-full bg-gradient-to-br from-[#1A1F2E] to-[#2A3441] rounded-r-[6rem] flex flex-col
                          shadow-[4px_0_30px_rgba(0,0,0,0.3)]">
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

                {/* Navigation yang ditingkatkan */}
                <div className="flex flex-col mt-16">
                    {navItems.map((item) => (
                        <Link href={item.path} key={item.name}>
                            <div className="relative group my-1 ml-6">
                                <div className={`
                                    absolute inset-0 rounded-l-full
                                    transition-all duration-500 ease-out
                                    ${pathname === item.path 
                                        ? 'bg-[#F5EFE6] opacity-100' 
                                        : 'opacity-0 group-hover:opacity-100 bg-white/5'
                                    }
                                `} />
                                <div className={`
                                    absolute inset-0 rounded-l-full bg-gradient-to-r from-purple-500/20 to-pink-500/20
                                    transition-all duration-500 ease-out
                                    ${pathname === item.path ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                                `} />
                                <button
                                    className={`
                                        relative z-10
                                        w-[19rem] h-[4.5rem] pl-8
                                        text-left rounded-l-full
                                        transition-all duration-500 ease-out
                                        flex items-center
                                        ${pathname === item.path 
                                            ? 'text-[#1A1F2E]' 
                                            : 'text-white/90 group-hover:pl-10'
                                        }
                                    `}
                                >
                                    <span className={`
                                        transition-all duration-500 ease-out
                                        ${pathname === item.path 
                                            ? 'scale-110' 
                                            : 'group-hover:scale-110'
                                        }
                                    `}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium text-[15px] ml-4">
                                        {item.name}
                                    </span>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
                {/* Welcome User - Improved */}
                <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
                    <div className="bg-white rounded-[32px] px-12 py-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] 
                                  flex items-center justify-between border-2 border-slate-200 w-[600px]
                                  hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 
                                          flex items-center justify-center shadow-inner">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                    <span className="text-xl">👋</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-slate-800 font-medium text-lg">Welcome back!</h2>
                                <p className="text-slate-500 text-sm">Manage your network easily</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l-2 border-slate-100">
                            <span className="text-slate-700 font-medium">Admin</span>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border-2 border-indigo-100 
                                          flex items-center justify-center text-indigo-600">
                                👤
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={pathname}
                        className="absolute inset-0 pt-28"
                        transition={{
                            duration: 0.15,
                            ease: [0.645, 0.045, 0.355, 1]
                        }}
                    >
                        {/* Page Title - Left Aligned */}
                        <div className="px-8 mb-8">
                            {pathname === '/dashboard' && (
                                <div>
                                    <h1 className="text-2xl text-center pt-20 font-semibold text-slate-800" style={{ fontFamily: 'Slackey, cursive' }}>
                                        Connected Devices
                                    </h1>
                                    <p className="text-sm text-center text-slate-500 mt-2">
                                        Kelola website yang tidak boleh diakses
                                    </p>
                                </div>
                            )}
                        </div>

                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
} 