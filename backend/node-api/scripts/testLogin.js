const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/login', {
      email: 'admin@sellamsoft.com',
      password: 'adminpassword'
    });
    console.log('Login Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Login Failed with status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Login Failed with error:', error.message);
    }
  }
}

testLogin();
