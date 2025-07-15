require('dotenv').config();

module.exports = {
  LOG_API_URL: 'http://20.244.56.144/evaluation-service/logs',
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  ACCESS_CODE: process.env.ACCESS_CODE
};
