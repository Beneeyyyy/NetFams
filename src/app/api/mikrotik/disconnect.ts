import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
  try {
    const { credentials, macAddress }: { credentials: MikrotikCredentials, macAddress: string } = await request.json();
    const ssh = new NodeSSH();

    // Mencoba melakukan koneksi SSH
    console.log('Attempting to connect to Mikrotik for disconnect...');
    await ssh.connect({
      host: credentials.host,
      username: credentials.username,
      password: credentials.password,
      port: 22, // Port default SSH
      readyTimeout: 5000, // Timeout dalam milidetik
    });
    console.log('Connected to Mikrotik successfully for disconnect.');

    // Mengeksekusi perintah untuk memutuskan koneksi pengguna
    const result = await ssh.execCommand(`/interface ethernet disable [find mac-address=${macAddress}]`);
    console.log(`Executed command to disconnect user with MAC address: ${macAddress}`);

    // Menutup koneksi SSH
    ssh.dispose();

    // Mengembalikan response sukses
    return NextResponse.json({
      success: true,
      message: `User with MAC address ${macAddress} has been disconnected.`,
    });

  } catch (error) {
    console.error('Backend error:', error);
    
    // Mengembalikan response error
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disconnect user',
    }, { status: 500 });
  }
} 