// Quick test script for authentication endpoints
const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testBackend() {
  console.log('🚀 Testing TaxPal Backend Authentication...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await makeRequest('GET', '/api/health');
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const registerData = {
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'Test123456',
      country: 'US',
      incomeBracket: '25k-50k'
    };

    const registerResponse = await makeRequest('POST', '/api/auth/register', registerData);
    if (registerResponse.status === 201) {
      console.log('✅ Registration Success:', registerResponse.data.message);
      console.log('📧 User Email:', registerResponse.data.data.user.email);
      console.log('🔑 JWT Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Registration failed:', registerResponse.data);
      return;
    }

    // Test 3: User Login
    console.log('\n3. Testing User Login...');
    const loginData = {
      username: registerData.username,
      password: registerData.password
    };

    const loginResponse = await makeRequest('POST', '/api/auth/login', loginData);
    if (loginResponse.status === 200) {
      console.log('✅ Login Success:', loginResponse.data.message);
      console.log('👤 User ID:', loginResponse.data.data.user._id);
      console.log('🔑 JWT Token received:', loginResponse.data.data.token ? 'Yes' : 'No');

      // Test 4: Get User Profile
      console.log('\n4. Testing Get User Profile...');
      const token = loginResponse.data.data.token;
      const profileResponse = await makeRequest('GET', '/api/auth/me', null, {
        'Authorization': `Bearer ${token}`
      });
      
      if (profileResponse.status === 200) {
        console.log('✅ Profile Retrieved:', profileResponse.data.data.user.username);
        console.log('\n🎉 All tests passed! Backend authentication is working correctly.');
      } else {
        console.log('❌ Profile test failed:', profileResponse.data);
      }
    } else {
      console.log('❌ Login failed:', loginResponse.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testBackend();
