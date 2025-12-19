const express = require('express');
const router = express.Router();
const { createQuote, getQuotes, deleteQuote} = require('../controllers/quoteController');

// Define routes
router.route('/')
  .post(createQuote)
  .get(getQuotes)
router.route('/:id')
  .delete(deleteQuote);

module.exports = router;