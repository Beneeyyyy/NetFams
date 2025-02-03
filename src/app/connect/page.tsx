'use client';

import { useState, FormEvent } from 'react';
import type { MikrotikCredentials, SSHResponse } from '@/types/mikrotiktypes';

export default function Home() {
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
    } catch (err) {
      console.error('Frontend error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mikrotik SSH Connection</h1>
      
      <form onSubmit={handleConnect} className="space-y-4">
        <div>
          <label className="block mb-1">Host IP:</label>
          <input
            type="text"
            value={credentials.host}
            onChange={(e) => setCredentials({...credentials, host: e.target.value})}
            className="w-full border p-2 rounded text-black"
            placeholder="192.168.1.1"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Username:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            className="w-full border p-2 rounded text-black"
            placeholder="admin"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full border p-2 rounded text-black"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Router Information:</h2>
          <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap text-black">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}