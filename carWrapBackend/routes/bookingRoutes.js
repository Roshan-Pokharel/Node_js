const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @route   POST /api/bookings
// @desc    Create a new appointment
router.post('/', async (req, res) => {
  try {
    // 1. Create the new booking object
    const newBooking = new Booking(req.body);

    // 2. Save to MongoDB
    const savedBooking = await newBooking.save();

    // 3. Respond to Frontend
    res.status(201).json({ 
      success: true, 
      message: "Booking confirmed successfully", 
      data: savedBooking 
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while saving booking",
      error: error.message 
    });
  }
});

module.exports = router;