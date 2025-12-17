require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quoteRoutes = require('./routes/QuoteRoutes');
const BookingRoutes = require('./routes/bookingRoutes');

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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// server.js (Node.js/Express)
app.post('/api/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    console.log("Received booking:", bookingData);
    
    // TODO: Save to database (MongoDB/SQL)
    // TODO: Send email notification
    
    res.status(200).json({ message: "Booking received successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});