require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quoteRoutes = require('./routes/QuoteRoutes');
const BookingRoutes = require('./routes/bookingRoutes');
const otpRoutes = require('./routes/otpRoutes');
const hitRoutes = require('./routes/hitRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Routes
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api', otpRoutes);
app.use('/api/hits', hitRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});