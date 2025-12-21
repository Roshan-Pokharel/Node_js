require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');

// --- 1. DATABASE CONNECTION ---
connectDB();

const app = express();

// --- 2. MIDDLEWARE ---
// Must be defined BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- 3. CORS CONFIGURATION ---
const allowedOrigins = process.env.ALLOWEDORIGIN;

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

// --- 4. IMPORT ROUTES ---
// Ensure these filenames are lowercase in your /routes folder
const quoteRoutes = require('./routes/quoteRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const otpRoutes = require('./routes/otpRoutes');
const hitRoutes = require('./routes/hitRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');

// --- 5. API ROUTE HANDLERS ---
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', otpRoutes);
app.use('/api/hits', hitRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// --- 6. STATIC ASSETS & FRONTEND ---
// Serve static files from the React/Vite build folder
app.use(express.static(path.join(__dirname, 'client/dist')));

// --- 7. CATCH-ALL ROUTE ---
// Handle React Router deep links or missing API routes
app.get(/.*/, (req, res) => {
    // If request starts with /api, return 404 (don't serve HTML)
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API Route not found' });
    }
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// --- 8. SERVER INITIALIZATION ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});