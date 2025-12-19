require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const quoteRoutes = require('./routes/QuoteRoutes');
const BookingRoutes = require('./routes/bookingRoutes');
const otpRoutes = require('./routes/otpRoutes');
const hitRoutes = require('./routes/hitRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to Database
connectDB();

const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.1.86:5173' // This matches your current frontend origin
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // This MUST be true to allow the adminAuthToken cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware
app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser());


app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api', otpRoutes);
app.use('/api/hits', hitRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);




// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});