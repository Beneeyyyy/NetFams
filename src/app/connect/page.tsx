'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { MikrotikCredentials, SSHResponse } from '@/types/mikrotiktypes';
import { Wifi, Lock, User, Server } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<MikrotikCredentials>({
    host: '',
    username: '',
    password: '',
  });
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleConnect = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/mikrotik', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SSHResponse = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Unknown error occurred');
        return;
      }

      setResult(data.data || '');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (err) {
      console.error('Frontend error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center p-8
                  shadow-[inset_0_0_150px_rgba(0,0,0,0.15),inset_0_0_100px_rgba(0,0,0,0.1)]">
      <div className="w-full max-w-xl relative">
        {/* Spotlight effect */}
        <div className="absolute -inset-20 bg-gradient-to-b from-white/30 via-white/20 to-transparent 
                      rounded-[48px] blur-2xl">
        </div>
        
        {/* Vignette effect */}
        <div className="absolute -inset-1 bg-gradient-radial from-transparent to-black/10 
                      rounded-[40px] blur-xl opacity-70">
        </div>

        {/* Logo */}
        <div className="relative flex justify-center mb-12 z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full 
                        flex items-center justify-center shadow-xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-transparent bg-clip-text 
                           bg-gradient-to-r from-purple-400 to-pink-400">
                LOGO
              </span>
            </div>
          </div>
        </div>

        {/* Connection Form dengan extra glow */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-[32px] border-2 border-slate-200 p-8
                      shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]
                      hover:shadow-[0_4px_20px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.5)_inset]
                      transition-all duration-300 z-10">
          <h1 className="text-2xl text-center font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Slackey, cursive' }}>
            Connect Router
          </h1>
          <p className="text-sm text-center text-slate-500 mb-8">
            Enter your router credentials to connect
          </p>
          
          <form onSubmit={handleConnect} className="space-y-6">
            <div>
              <label className="text-base text-slate-800 font-medium block mb-3">
                Router IP Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentials.host}
                  onChange={(e) => setCredentials({...credentials, host: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200
                           focus:outline-none focus:border-indigo-600/20 text-slate-600
                           placeholder:text-slate-400"
                  placeholder="192.168.1.1"
                  required
                />
                <Server className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            <div>
              <label className="text-base text-slate-800 font-medium block mb-3">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200
                           focus:outline-none focus:border-indigo-600/20 text-slate-600
                           placeholder:text-slate-400"
                  placeholder="admin"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            <div>
              <label className="text-base text-slate-800 font-medium block mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-200
                           focus:outline-none focus:border-indigo-600/20 text-slate-600"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl
                       hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <Wifi size={20} />
              {loading ? 'Connecting...' : 'Connect Router'}
            </button>
          </form>
        </div>

        {/* Error & Result dengan efek yang sama */}
        {error && (
          <div className="relative mt-4 p-4 bg-white/95 backdrop-blur-sm rounded-xl 
                       border-2 border-rose-200 text-rose-600 text-sm z-10
                       shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            {error}
          </div>
        )}

        {result && (
          <div className="relative mt-4 bg-white/95 backdrop-blur-sm rounded-xl 
                       border-2 border-slate-200 p-6 z-10
                       shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <h2 className="text-lg font-medium text-slate-800 mb-3">Router Information</h2>
            <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono 
                         bg-slate-50/80 p-4 rounded-lg">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}