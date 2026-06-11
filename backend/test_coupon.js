const axios = require('axios');

async function test() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'connect2rachit882@gmail.com',
      password: 'Rachit@12'
    });
    const token = loginRes.data.token;

    // 2. Add Coupon
    const res = await axios.post('http://localhost:5000/api/coupons', {
      code: 'FIRST10',
      discountAmount: 10,
      discountType: 'fixed',
      expiryDate: '2026-06-19',
      maxUsers: null,
      isPublic: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
