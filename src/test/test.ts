const { NodeSSH } = require('node-ssh');

async function testConnection() {
  const ssh = new NodeSSH();

  try {
    await ssh.connect({
      host: '192.168.100.111', // ganti dengan IP Mikrotik Anda
      username: 'admin',    // ganti dengan username Anda
      password: '123', // ganti dengan password Anda
      port: 22,
      debug: console.log
    });

    const result = await ssh.execCommand('/system resource print');
    console.log('Success:', result.stdout);
    
    ssh.dispose();
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();