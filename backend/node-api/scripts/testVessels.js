const axios = require('axios');

async function testVessels() {
  try {
    // We need a token first
    const loginRes = await axios.post('http://127.0.0.1:3000/api/users/login', {
      email: 'admin@sellamsoft.com',
      password: 'adminpassword'
    });
    const token = loginRes.data.token;

    const response = await axios.get('http://127.0.0.1:3000/api/vessels', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Vessels Success:', response.data.length, 'vessels found');
  } catch (error) {
    if (error.response) {
      console.error('Vessels Failed with status:', error.response.status);
      console.error('Error Message:', error.response.data.message);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testVessels();
