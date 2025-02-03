import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
  try {
    const credentials: MikrotikCredentials = await request.json();
    const ssh = new NodeSSH();

    // Mencoba melakukan koneksi SSH
    await ssh.connect({
      host: credentials.host,
      username: credentials.username,
      password: credentials.password,
      port: 22, // Port default SSH
      readyTimeout: 5000, // Timeout dalam milidetik
    });

    // Mengeksekusi perintah untuk mendapatkan informasi sistem
    const result = await ssh.execCommand('ip address print');
    
    // Menutup koneksi SSH
    ssh.dispose();

    // Mengembalikan response sukses
    return NextResponse.json({
      success: true,
      data: result.stdout || 'No output received',
    });

  } catch (error) {
    console.error('Backend error:', error);
    
    // Mengembalikan response error
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to connect to Mikrotik',
    }, { status: 500 });
  }
} 