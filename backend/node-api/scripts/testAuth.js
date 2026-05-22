const axios = require('axios');

async function testAuth() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'testpassword';

  try {
    // 1. Register
    console.log('Attempting Register...');
    const regRes = await axios.post('http://127.0.0.1:3000/api/users/register', {
      name: 'Test User',
      email,
      password,
      role: 'ADMIN'
    });
    console.log('Register Success');

    // 2. Login
    console.log('Attempting Login...');
    const loginRes = await axios.post('http://127.0.0.1:3000/api/users/login', {
      email,
      password
    });
    console.log('Login Success:', JSON.stringify(loginRes.data.user, null, 2));
    
  } catch (error) {
    console.error('Auth Test Failed');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAuth();
