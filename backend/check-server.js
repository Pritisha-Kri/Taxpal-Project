// Simple server status check
const http = require('http');

function checkServer() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Server is running!');
      console.log('Response:', data);
    });
  });

  req.on('error', (error) => {
    console.log('❌ Server is not running or not accessible');
    console.log('Error:', error.message);
    console.log('\n💡 Make sure to start the server first with: npm run dev');
  });

  req.end();
}

console.log('🔍 Checking if TaxPal server is running...');
checkServer();
