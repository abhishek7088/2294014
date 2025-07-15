const axios = require('axios');
const { log } = require('./logger');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_CODE } = require('../config/constants');

async function authenticate() {
  const authData = {
    email: "ramkrishna@abc.edu",
    name: "Ram Krishna",
    rollNo: "aalbb",
    accessCode: ACCESS_CODE,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  };

  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', authData);
    const token = response.data.access_token;
    log('backend', 'info', 'auth', 'Authentication successful');
    return token;
  } catch (error) {
    log('backend', 'error', 'auth', `Authentication failed: ${error.message}`);
    throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
  }
}

module.exports = { authenticate };