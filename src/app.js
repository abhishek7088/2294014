require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { log, setAuthToken } = require('./utils/logger');
const { authenticate } = require('./utils/auth');
const urlRoutes = require('./routes/url');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// Routes
app.use('/shorturls', urlRoutes);

// Connect to MongoDB and start server
async function startServer() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    log('backend', 'info', 'db', 'MongoDB Atlas connected');

    // 2. Authenticate and set token
    const token = await authenticate();
    setAuthToken(token);

    // 3. Start Express server
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
