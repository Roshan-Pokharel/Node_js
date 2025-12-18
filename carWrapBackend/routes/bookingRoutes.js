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


// router.post('/api/bookings', async (req, res) => {
//   try {
//     const bookingData = req.body;
//     console.log("Received booking:", bookingData);
    
//     // TODO: Save to database (MongoDB/SQL)
//     // TODO: Send email notification
    
//     res.status(200).json({ message: "Booking received successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

module.exports = router;