import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
    try {
        const { credentials, domain, action } = await request.json();
        const ssh = new NodeSSH();

        await ssh.connect({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password,
            port: 22,
            readyTimeout: 5000,
        });

        if (action === 'block') {
            // Add domain to layer7-protocol
            await ssh.execCommand(`/ip firewall layer7-protocol add name="blocked-${domain}" regexp="${domain}"`);
            
            // Add firewall rule to block the domain
            await ssh.execCommand(`/ip firewall filter add chain=forward layer7-protocol="blocked-${domain}" action=drop comment="blocked-website-${domain}"`);
        } else {
            // Remove firewall rule
            await ssh.execCommand(`/ip firewall filter remove [find where comment="blocked-website-${domain}"]`);
            
            // Remove layer7-protocol
            await ssh.execCommand(`/ip firewall layer7-protocol remove [find where name="blocked-${domain}"]`);
        }

        ssh.dispose();

        return NextResponse.json({
            success: true,
            message: action === 'block' ? 'Website blocked successfully' : 'Website unblocked successfully'
        });

    } catch (error) {
        console.error('Website block/unblock error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to block/unblock website'
        }, { status: 500 });
    }
} 