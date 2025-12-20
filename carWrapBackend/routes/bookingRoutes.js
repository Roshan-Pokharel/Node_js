const express = require('express');
const router = express.Router();
const { createBooking, getBookings, deleteBooking, updateBookingStatus } = require('../controllers/bookingController');

router.route('/')
  .post(createBooking)
  .get(getBookings); 

router.route('/:id').delete(deleteBooking);

router.route('/:id/status')
  .put(updateBookingStatus);



module.exports = router;