const { log } = require('../utils/logger');

function validateUrlCreation(req, res, next) {
  const { url, validity, shortcode } = req.body;
  
  // Validate URL
  if (!url) {
    log('backend', 'error', 'middleware', 'URL is required');
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch (err) {
    log('backend', 'error', 'middleware', `Invalid URL: ${url}`);
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Validate validity (if provided)
  if (validity && (isNaN(validity) || validity <= 0)) {
    log('backend', 'error', 'middleware', `Invalid validity: ${validity}`);
    return res.status(400).json({ error: 'Validity must be a positive number' });
  }

  // Validate shortcode (if provided)
  if (shortcode && !/^[a-zA-Z0-9_-]{4,10}$/.test(shortcode)) {
    log('backend', 'error', 'middleware', `Invalid shortcode format: ${shortcode}`);
    return res.status(400).json({ 
      error: 'Shortcode must be 4-10 characters long and contain only letters, numbers, underscores, or hyphens'
    });
  }

  next();
}

module.exports = { validateUrlCreation };