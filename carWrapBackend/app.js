require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path'); // Built-in module

// Import Routes
const quoteRoutes = require('./routes/QuoteRoutes');
const BookingRoutes = require('./routes/bookingRoutes');
const otpRoutes = require('./routes/otpRoutes');
const hitRoutes = require('./routes/hitRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to Database
connectDB();

// --- 1. MIDDLEWARE & CORS ---
// Middleware MUST come before routes so requests are parsed correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.1.86:5173'
    // NOTE: When deployed, you might need to add your AWS Public IP here
    // e.g., 'http://54.123.45.67'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 2. API ROUTES ---
// Serve API routes FIRST. If a request matches these, it stops here.
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api', otpRoutes);
app.use('/api/hits', hitRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// --- 3. SERVE FRONTEND (Deployment Config) ---
// If the request was NOT an API route, check if it's a static frontend file
app.use(express.static(path.join(__dirname, 'client/dist')));

// --- 4. CATCH-ALL HANDLER ---
// If it's not an API route and not a static file, serve index.html (for React Router)
app.get('*', (req, res) => {
    // Optional: If the user requests an API route that doesn't exist, return JSON instead of HTML
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API Route not found' });
    }
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});