

const Url = require('../models/url');
const { generateShortCode } = require('../utils/shortcode');
const { log } = require('../utils/logger');

async function createShortUrl(data) {
  const { url, validity = 30, shortcode } = data;

  if (shortcode) {
    const existing = await Url.findOne({ shortcode });
    if (existing) {
      log('backend', 'warn', 'handler', `Shortcode already exists: ${shortcode}`);
      throw new Error('Shortcode already in use');
    }
  }

  const code = shortcode || await generateUniqueShortCode();
  const expiry = new Date(Date.now() + validity * 60000);

  const newUrl = new Url({
    originalUrl: url,
    shortcode: code,
    expiry,
    createdAt: new Date(),
    accessCount: 0,
    lastAccessed: null,
    analytics: [] // new field to track visits
  });

  await newUrl.save();

  return {
    shortLink: `${process.env.BASE_URL || 'http://localhost:3000'}/${code}`,
    expiry: expiry.toISOString()
  };
}

async function redirectToUrl(shortcode, req) {
  const url = await Url.findOne({ shortcode });

  if (!url) {
    log('backend', 'error', 'handler', `Shortcode not found: ${shortcode}`);
    throw new Error('Short URL not found');
  }

  if (url.expiry < new Date()) {
    log('backend', 'warn', 'handler', `Expired shortcode accessed: ${shortcode}`);
    throw new Error('Short URL has expired');
  }

  const referrer = req.get('referer') || 'direct';
  const ip = req.ip;

  url.accessCount += 1;
  url.lastAccessed = new Date();
  url.analytics.push({ timestamp: new Date(), referrer, ip });

  await url.save();

  return url;
}

async function getUrlStats(shortcode) {
  const url = await Url.findOne({ shortcode });

  if (!url) {
    log('backend', 'error', 'handler', `Stats requested for non-existent shortcode: ${shortcode}`);
    throw new Error('Short URL not found');
  }

  return {
    originalUrl: url.originalUrl,
    shortLink: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.shortcode}`,
    createdAt: url.createdAt,
    expiry: url.expiry,
    accessCount: url.accessCount,
    lastAccessed: url.lastAccessed || null,
    analytics: url.analytics
  };
}

async function generateUniqueShortCode() {
  let code;
  let attempts = 0;
  do {
    code = generateShortCode();
    attempts++;
    if (attempts > 5) {
      log('backend', 'error', 'handler', 'Failed to generate unique shortcode after 5 attempts');
      throw new Error('Failed to generate unique shortcode');
    }
  } while (await Url.exists({ shortcode: code }));
  return code;
}

module.exports = { createShortUrl, redirectToUrl, getUrlStats };
