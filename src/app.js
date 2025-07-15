require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { log, setAuthToken } = require('./utils/logger');
const { authenticate } = require('./utils/auth');
const urlRoutes = require('./routes/shorturl'); 

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;


app.use(express.json());


app.use('/shorturls', urlRoutes);


async function startServer() {
  try {
  
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
    log('backend', 'info', 'db', 'MongoDB Atlas connected');

    
    const token = await authenticate();
    console.log('✅ Auth token received');
    setAuthToken(token); 

   
    app.listen(PORT, () => {
      log('backend', 'info', 'service', `Server started on port ${PORT}`);
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    log('backend', 'fatal', 'startup', `Startup failure: ${error.message}`);
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
