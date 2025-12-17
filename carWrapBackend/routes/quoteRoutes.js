const express = require('express');
const router = express.Router();
const { createQuote, getQuotes } = require('../controllers/quoteController');

// Define routes
router.route('/')
  .post(createQuote)
  //.get(getQuotes);

module.exports = router;