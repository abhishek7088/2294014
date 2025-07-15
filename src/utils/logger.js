const axios = require('axios');
const { LOG_API_URL } = require('../config/constants');

let authToken = '';

// Control logging behavior
const isTestEnv = process.env.NODE_ENV === 'test';
const enableLogInTests = process.env.ENABLE_LOG_IN_TESTS === 'true';

const validStacks = ['backend', 'frontend'];
const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const validPackages = ['auth', 'handler', 'db' /* add others as needed */];

async function log(stack, level, packageName, message) {
  // Skip logging in tests unless explicitly allowed
  if (isTestEnv && !enableLogInTests) return;

  if (
    !validStacks.includes(stack) ||
    !validLevels.includes(level) ||
    !validPackages.includes(packageName)
  ) {
    console.error(`Invalid log parameters: ${JSON.stringify({ stack, level, packageName })}`);
    return;
  }

  try {
    await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    if (!isTestEnv || enableLogInTests) {
      console.error('Failed to send log:', error.message);
    }
  }
}

function setAuthToken(token) {
  authToken = token;
}

module.exports = { log, setAuthToken };
