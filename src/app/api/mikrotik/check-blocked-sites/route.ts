import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
    try {
        const credentials: MikrotikCredentials = await request.json();
        const ssh = new NodeSSH();

        await ssh.connect({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password,
            port: 22,
            readyTimeout: 5000,
        });

        // Get blocked websites from firewall filter
        const result = await ssh.execCommand('/ip firewall filter print where comment~"blocked-website-"');
        
        // Parse domains from the result
        const blockedSites = result.stdout
            .split('\n')
            .filter(line => line.includes('blocked-website-'))
            .map(line => {
                const match = line.match(/blocked-website-(.+?)"/);
                return match ? match[1] : null;
            })
            .filter(Boolean);

        ssh.dispose();

        return NextResponse.json({
            success: true,
            blockedSites
        });

    } catch (error) {
        console.error('Check blocked sites error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to check blocked sites'
        }, { status: 500 });
    }
} 