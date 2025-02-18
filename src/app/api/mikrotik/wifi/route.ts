import { NodeSSH } from 'node-ssh';

export async function POST(request: Request) {
    const credentials = await request.json();
    const ssh = new NodeSSH();
    
    try {
        await ssh.connect({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password
        });

        // Command untuk mengambil SSID dan password WiFi dari Mikrotik
        const { stdout: ssid } = await ssh.execCommand('/interface wireless get numbers=0 ssid');
        const { stdout: password } = await ssh.execCommand('/interface wireless security-profiles get numbers=0 wpa2-pre-shared-key');
        
        return Response.json({
            success: true,
            ssid: ssid.trim(),
            password: password.trim()
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: "Failed to fetch WiFi settings"
        });
    } finally {
        ssh.dispose();
    }
} 