// logger.js
const axios = require('axios');
const { LOG_API_URL } = require('../config/constants');

let authToken = '';
const isTestEnv = process.env.NODE_ENV === 'test';

// ✅ Add all valid packages including 'service'
const validStacks = ['backend', 'frontend'];
const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const validPackages = ['auth', 'handler', 'db', 'route', 'utils', 'middleware', 'service'];

async function log(stack, level, packageName, message) {
  // Skip if not valid
  if (!validStacks.includes(stack) || 
      !validLevels.includes(level) || 
      !validPackages.includes(packageName)) {
    console.error(`Invalid log parameters: ${JSON.stringify({stack, level, packageName})}`);
    return;
  }

  if (isTestEnv) return; // Skip API call during tests

  try {
    await axios.post(LOG_API_URL, {
      stack,
      level,
      package: packageName,
      message
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    if (!isTestEnv) {
      console.error('Failed to send log:', error.message);
    }
  }
}

function setAuthToken(token) {
  authToken = token;
}

module.exports = { log, setAuthToken };