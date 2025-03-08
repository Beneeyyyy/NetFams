import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
  try {
    const credentials: MikrotikCredentials = await request.json();
    console.log('Kredensial yang digunakan:', credentials);
    const ssh = new NodeSSH();

    console.log('Mencoba menghubungkan ke Mikrotik dengan kredensial:', credentials);
    await ssh.connect({
      host: credentials.host,
      username: credentials.username,
      password: credentials.password,
      port: 22, // Port default SSH
      readyTimeout: 5000, // Timeout dalam milidetik
    });
    console.log('Koneksi berhasil ke Mikrotik.');

    console.log('Mengeksekusi perintah: ip dhcp lease print');
    const result = await ssh.execCommand('ip dhcp lease print');
    console.log('Hasil perintah:', result);
    console.log('Output:', result.stdout);
    console.log('Error:', result.stderr);
    if (result.stderr) {
        console.error('Error saat mengeksekusi perintah:', result.stderr);
    }

    // Mendapatkan informasi bandwidth pengguna
    console.log('Executing command to get bandwidth information...');
    // Gunakan interface monitor-traffic untuk mendapatkan data realtime
    const bandwidthResult = await ssh.execCommand('/interface monitor-traffic ether2 once');
    
    // Dapatkan juga data dari interface statistics
    const interfaceStatsResult = await ssh.execCommand('/interface print stats');
    
    // Dapatkan data dari queue simple
    const queueResult = await ssh.execCommand('/queue simple print');
    console.log('Bandwidth command executed successfully.');

    // Menutup koneksi SSH
    ssh.dispose();

    // Mengembalikan response sukses
    return NextResponse.json({
      success: true,
      data: result.stdout || 'No output received',
      bandwidthData: bandwidthResult.stdout || 'No bandwidth data received',
      interfaceStats: interfaceStatsResult.stdout || 'No interface stats received',
      queueData: queueResult.stdout || 'No queue data received',
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