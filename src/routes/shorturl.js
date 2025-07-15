const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToUrl, getUrlStats } = require('../controllers/shorturl');
const { validateUrlCreation } = require('../middlewares/validation');
const { log } = require('../utils/logger');


router.post('/', validateUrlCreation, async (req, res, next) => {
  try {
    const result = await createShortUrl(req.body);
    log('backend', 'info', 'route', `Short URL created: ${result.shortLink}`);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});


router.get('/:shortcode', async (req, res, next) => {
  try {
    const url = await redirectToUrl(req.params.shortcode);
    log('backend', 'info', 'route', `Redirecting ${req.params.shortcode} to ${url.originalUrl}`);
    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
});


router.get('/:shortcode/stats', async (req, res, next) => {
  try {
    const stats = await getUrlStats(req.params.shortcode);
    log('backend', 'info', 'route', `Retrieved stats for ${req.params.shortcode}`);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
