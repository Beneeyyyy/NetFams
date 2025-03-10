import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
    try {
        const { credentials, settings } = await request.json();
        const ssh = new NodeSSH();

        await ssh.connect({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password,
            port: 22,
            readyTimeout: 5000,
        });

        console.log('Updating wireless settings...');

        // Update SSID
        const ssidResult = await ssh.execCommand(`/interface wireless set numbers=0 ssid="${settings.ssid}"`);
        if (ssidResult.stderr) {
            throw new Error('Failed to update SSID: ' + ssidResult.stderr);
        }

        // Update password
        const passwordResult = await ssh.execCommand(`/interface wireless security-profiles set numbers=1 wpa-pre-shared-key="${settings.password}"`);
        if (passwordResult.stderr) {
            throw new Error('Failed to update password: ' + passwordResult.stderr);
        }

        // Verify changes
        const verifySSID = await ssh.execCommand('/interface wireless print');
        const verifyPassword = await ssh.execCommand('/interface wireless security-profiles print');

        ssh.dispose();

        return NextResponse.json({
            success: true,
            message: 'Wireless settings updated successfully'
        });

    } catch (error) {
        console.error('WiFi update error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update wireless settings'
        }, { status: 500 });
    }
} 