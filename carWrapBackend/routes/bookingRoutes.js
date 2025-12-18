const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');

// @route   POST /api/bookings
// @desc    Create a new appointment
router.post('/', createBooking);


module.exports = router;