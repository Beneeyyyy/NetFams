import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
  try {
    const { credentials, macAddress, action } = await request.json();
    const ssh = new NodeSSH();

    await ssh.connect({
      host: credentials.host,
      username: credentials.username,
      password: credentials.password,
      port: 22,
      readyTimeout: 5000,
    });

    // Command untuk menambah/hapus address list dan firewall rule
    const blockCommands = [
      // Tambahkan ke address list
      `/ip firewall address-list add list=blocked address=${macAddress}`,
      // Tambahkan firewall rule untuk memblokir MAC address
      `/ip firewall filter add chain=forward src-mac-address=${macAddress} action=drop comment="blocked-${macAddress}"`
    ];

    const unblockCommands = [
      // Hapus dari address list
      `/ip firewall address-list remove [find where address="${macAddress}" and list="blocked"]`,
      // Hapus firewall rule
      `/ip firewall filter remove [find where comment="blocked-${macAddress}"]`
    ];

    // Eksekusi commands berdasarkan action
    const commands = action === 'block' ? blockCommands : unblockCommands;
    for (const cmd of commands) {
      await ssh.execCommand(cmd);
    }

    ssh.dispose();

    return NextResponse.json({
      success: true,
      message: action === 'block' ? 'Device blocked successfully' : 'Device unblocked successfully'
    });

  } catch (error) {
    console.error('Block/Unblock error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to block/unblock device'
    }, { status: 500 });
  }
} 