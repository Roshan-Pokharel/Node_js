const express = require('express');
const router = express.Router();
const { createQuote, getQuotes , deleteQuote, addCostAndSendEmail} = require('../controllers/quoteController');

// Define routes
router.route('/')
  .post(createQuote)
  .get(getQuotes);
  
router.route('/:id')
  .delete(deleteQuote);

router.route('/:id/cost')
  .put(addCostAndSendEmail);

module.exports = router;