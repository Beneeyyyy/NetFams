import { NextResponse } from 'next/server';
import { NodeSSH } from 'node-ssh';
import type { MikrotikCredentials } from '@/types/mikrotiktypes';

export async function POST(request: Request) {
    try {
        const { credentials, macAddress, ipAddress, download, upload } = await request.json();
        console.log('Received request:', { ipAddress, download, upload });

        if (!ipAddress || !download || !upload) {
            return NextResponse.json({
                success: false,
                error: 'Missing required parameters'
            }, { status: 400 });
        }

        const ssh = new NodeSSH();

        try {
            await ssh.connect({
                host: credentials.host,
                username: credentials.username,
                password: credentials.password,
                port: 22,
                readyTimeout: 5000,
            });
            console.log('SSH connection established');

            // Only remove existing custom queues (change_) for this IP
            console.log('Removing existing custom queues for IP:', ipAddress);
            await ssh.execCommand(`/queue simple remove [find where target="${ipAddress}/32" and name~"^change_"]`);
            
            // Tunggu sebentar untuk memastikan queue lama terhapus
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Buat queue baru dengan prefix change_
            console.log('Creating new queue with parameters:', {
                name: `change_${ipAddress}`,
                target: `${ipAddress}/32`,
                maxLimit: `${download}M/${upload}M`
            });

            const addCommand = `/queue simple add name="change_${ipAddress}" target=${ipAddress}/32 max-limit=${download}M/${upload}M comment="Modified via dashboard"`;
            console.log('Executing command:', addCommand);
            
            const addResult = await ssh.execCommand(addCommand);
            console.log('Add queue result:', addResult);

            if (addResult.stderr) {
                throw new Error(`Failed to add queue: ${addResult.stderr}`);
            }

            // Verifikasi perubahan
            console.log('Verifying changes...');
            const verifyQueue = await ssh.execCommand('/queue simple print');
            console.log('Current queue list:', verifyQueue.stdout);

            // Periksa queue spesifik
            const checkQueue = await ssh.execCommand(`/queue simple print where target="${ipAddress}/32"`);
            console.log('Target queue status:', checkQueue.stdout);

            ssh.dispose();
            console.log('SSH connection closed');

            return NextResponse.json({
                success: true,
                message: 'Bandwidth has been updated successfully',
                queueStatus: checkQueue.stdout
            });

        } catch (sshError: any) {
            console.error('SSH operation error:', sshError);
            ssh.dispose();
            throw new Error(`SSH operation failed: ${sshError.message}`);
        }

    } catch (error) {
        console.error('Bandwidth setting error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to set bandwidth'
        }, { status: 500 });
    }
} 