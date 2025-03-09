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
      port: 22,
      readyTimeout: 5000,
    });
    console.log('Koneksi berhasil ke Mikrotik.');

    // 1. Cek IP Address Static
    console.log('Checking static IP addresses...');
    const staticIPResult = await ssh.execCommand('/ip address print where !dynamic');
    
    if (!staticIPResult.stdout) {
      throw new Error('No static IP address configured. Please configure a static IP first.');
    }

    console.log('Static IP Result:', staticIPResult.stdout);

    // Parse IP address information
    const ipLines = staticIPResult.stdout.split('\n');
    let staticInterface = '';
    let networkAddress = '';
    let gatewayIP = '';

    for (const line of ipLines) {
      // Skip empty lines, flags line, and header line
      if (!line.trim() || 
          line.startsWith('Flags:') || 
          line.startsWith(' #   ADDRESS')) continue;

      // Parse the line using space as delimiter and filter out empty strings
      const parts = line.split(' ').filter(part => part.trim());
      
      // Format: [0] = index, [1] = address, [2] = network, [3] = interface
      if (parts.length >= 4) {
        const fullAddress = parts[1];      // e.g., "1.1.1.1/24"
        networkAddress = parts[2];         // e.g., "1.1.1.0"
        staticInterface = parts[3];        // e.g., "ether2"
        gatewayIP = fullAddress.split('/')[0];  // e.g., "1.1.1.1"

        console.log('Parsed IP configuration:', {
          fullAddress,
          staticInterface,
          gatewayIP,
          networkAddress
        });
        
        break;
      }
    }

    if (!staticInterface || !networkAddress || !gatewayIP) {
      console.error('Parse failed. IP output:', staticIPResult.stdout);
      throw new Error('Could not parse static IP configuration. Please ensure there is a static IP configured.');
    }

    console.log('Static IP configuration found:', {
      interface: staticInterface,
      network: networkAddress,
      gateway: gatewayIP
    });

    // 2. Cek DHCP Server
    console.log('Checking DHCP server configuration...');
    const dhcpServerResult = await ssh.execCommand('/ip dhcp-server print');
    
    if (!dhcpServerResult.stdout.includes('name="dhcp1"')) {
      console.log('DHCP server not found, creating...');
      
      // Calculate DHCP range
      const ipBase = gatewayIP.split('.');
      const rangeStart = `${ipBase[0]}.${ipBase[1]}.${ipBase[2]}.2`;
      const rangeEnd = `${ipBase[0]}.${ipBase[1]}.${ipBase[2]}.254`;
      
      // Create DHCP server
      const setupCommands = [
        // Add DHCP server
        `/ip dhcp-server add name=dhcp1 interface=${staticInterface} address-pool=dhcp_pool1 disabled=no`,
        
        // Add address pool
        `/ip pool add name=dhcp_pool1 ranges=${rangeStart}-${rangeEnd}`,
        
        // Add DHCP network
        `/ip dhcp-server network add address=${networkAddress} gateway=${gatewayIP} dns-server=8.8.8.8,8.8.4.4`
      ];

      for (const cmd of setupCommands) {
        console.log('Executing:', cmd);
        const result = await ssh.execCommand(cmd);
        if (result.stderr) {
          console.error('Error executing command:', result.stderr);
          throw new Error(`Failed to setup DHCP server: ${result.stderr}`);
        }
      }
      
      console.log('DHCP server setup completed successfully');
    } else {
      console.log('DHCP server already exists');
    }

    // 3. Cek dan Setup Queue Manager Script
    console.log('Checking queue manager script...');
    const scriptResult = await ssh.execCommand('/system script print where name="queue-manager"');
    
    if (!scriptResult.stdout.includes('queue-manager')) {
      console.log('Queue manager script not found, creating...');
      
      // Hapus script lama jika ada
      await ssh.execCommand('/system script remove [find where name="queue-manager"]');
      
      // Buat script dengan format yang benar
      const scriptCommands = [
        '/system script',
        'add name=queue-manager source=\\',
        '":foreach lease in=[/ip dhcp-server lease find] do={\\',
        '  :local ip [/ip dhcp-server lease get \\$lease address];\\',
        '  /queue simple remove [find where name=(\\\"client_\\\" . \\$ip)];\\',
        '  /queue simple add name=(\\\"client_\\\" . \\$ip) target=(\\$ip . \\\"/32\\\") max-limit=10M/10M comment=\\\"Auto default\\\";\\',
        '  :log info (\\\"Queue updated for \\\" . \\$ip);\\',
        '}"'
      ].join(' ');
      
      console.log('Creating script with command:', scriptCommands);
      const createResult = await ssh.execCommand(scriptCommands);
      
      if (createResult.stderr) {
        console.error('Error creating script:', createResult.stderr);
        throw new Error('Failed to create queue manager script: ' + createResult.stderr);
      }
      
      // Verifikasi script telah dibuat dengan benar
      const verifyScript = await ssh.execCommand('/system script print where name="queue-manager"');
      if (!verifyScript.stdout.includes('queue-manager')) {
        throw new Error('Script verification failed: Script was not created properly');
      }
      
      console.log('Queue manager script created and verified');

      // Buat scheduler dengan policy yang lengkap
      const schedulerCommand = '/system scheduler add interval=1m name=queue-manager-schedule on-event=queue-manager policy=ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon start-time=startup';
      const schedulerResult = await ssh.execCommand(schedulerCommand);
      
      if (schedulerResult.stderr) {
        console.error('Error creating scheduler:', schedulerResult.stderr);
        throw new Error('Failed to create scheduler: ' + schedulerResult.stderr);
      }
      
      console.log('Scheduler created successfully');

      // Jalankan script untuk pertama kali dan verifikasi
      const runResult = await ssh.execCommand('/system script run queue-manager');
      if (runResult.stderr) {
        console.error('Error running script:', runResult.stderr);
        throw new Error('Failed to run script: ' + runResult.stderr);
      }
      
      console.log('Queue manager executed for the first time successfully');
    } else {
      console.log('Queue manager script already exists');
    }

    // Get current DHCP leases
    console.log('Mengeksekusi perintah: ip dhcp-server lease print');
    const result = await ssh.execCommand('ip dhcp-server lease print');
    console.log('Hasil perintah:', result);
    console.log('Output:', result.stdout);
    console.log('Error:', result.stderr);
    if (result.stderr) {
        console.error('Error saat mengeksekusi perintah:', result.stderr);
    }

    // Get queue data
    const queueResult = await ssh.execCommand('/queue simple print');
    console.log('Queue data retrieved successfully.');
    console.log('Raw queue data:', queueResult.stdout);

    // Get interface statistics for bandwidth info
    const interfaceStatsResult = await ssh.execCommand('/interface print stats');
    console.log('Interface statistics retrieved successfully.');

    // Get bandwidth monitoring data
    const bandwidthResult = await ssh.execCommand('/interface monitor-traffic ether2 once');
    console.log('Bandwidth monitoring data retrieved successfully.');

    // Get wireless settings
    console.log('Retrieving wireless settings...');
    const ssidResult = await ssh.execCommand('/interface wireless print value-list');
    const securityResult = await ssh.execCommand('/interface wireless security-profiles print value-list');
    
    // Parse SSID and password
    const ssid = ssidResult.stdout.match(/ssid=([^\n]+)/)?.[1] || '';
    const password = securityResult.stdout.match(/wpa2-pre-shared-key=([^\n]+)/)?.[1] || '';
    
    console.log('Wireless settings retrieved successfully');

    // Menutup koneksi SSH
    ssh.dispose();

    // Mengembalikan response sukses dengan format yang sesuai untuk dashboard
    return NextResponse.json({
      success: true,
      data: result.stdout || 'No output received',
      queueData: queueResult.stdout || 'No queue data received',
      interfaceStats: interfaceStatsResult.stdout || 'No interface stats received',
      bandwidthData: bandwidthResult.stdout || 'No bandwidth data received',
      wirelessSettings: {
        ssid: ssid.trim(),
        password: password.trim()
      },
      dhcpSetupStatus: {
        interface: staticInterface,
        network: networkAddress,
        gateway: gatewayIP,
        isConfigured: true
      }
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