import axios from 'axios';

const EDGE_FUNCTION_BASE_URL = 'https://dobpdssgdfaiharnmpdf.supabase.co/functions/v1/smooth-service';
const ANON_KEY = 'YOUR_ANON_KEY'; // I'll use the one from the env if I can find it

async function testConnection() {
    try {
        console.log('Testing GET /vessels...');
        const response = await axios.get(`${EDGE_FUNCTION_BASE_URL}/vessels`, {
            headers: {
                'apikey': ANON_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log('Response Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Connection failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

// testConnection();
