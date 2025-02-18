import { NodeSSH } from 'node-ssh';

export async function POST(request: Request) {
    const { credentials, wifiSettings } = await request.json();
    const ssh = new NodeSSH();
    
    try {
        await ssh.connect({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password
        });

        // Command untuk mengupdate SSID dan password WiFi di Mikrotik
        await ssh.execCommand(`/interface wireless set numbers=0 ssid="${wifiSettings.ssid}"`);
        await ssh.execCommand(`/interface wireless security-profiles set numbers=0 wpa2-pre-shared-key="${wifiSettings.password}"`);
        
        return Response.json({
            success: true,
            message: "WiFi settings updated successfully"
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: "Failed to update WiFi settings"
        });
    } finally {
        ssh.dispose();
    }
} 