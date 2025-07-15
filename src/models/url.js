const mongoose = require('mongoose');
const { log } = require('../utils/logger');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  shortcode: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9_-]{4,10}$/, 'Invalid shortcode format']
  },
  expiry: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0
  },
  lastAccessed: Date,
  analytics: [
    {
      timestamp: Date,
      referrer: String,
      ip: String
    }
  ]
});

// Log when a new URL is saved
urlSchema.post('save', function(doc) {
  log('backend', 'debug', 'db', `New URL saved: ${doc.shortcode}`);
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
