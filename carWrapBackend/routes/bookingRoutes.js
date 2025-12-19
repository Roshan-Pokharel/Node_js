const express = require('express');
const router = express.Router();
const { createBooking, getBookings, deleteBooking } = require('../controllers/bookingController');

router.route('/')
  .post(createBooking)
  .get(getBookings); 

router.route('/:id').delete(deleteBooking);





module.exports = router;