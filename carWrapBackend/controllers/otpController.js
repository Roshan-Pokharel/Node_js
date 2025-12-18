const Review = require('../models/Review.js'); 
const transporter = require('../services/mailing');
const otpStore = require('../services/otpStore');
// create the otp and send email

const getEmailTemplate = (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica', 'Arial', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0; }
            .header { background-color: #333333; color: #ffffff; padding: 20px; text-align: center; }
            .content { padding: 30px; text-align: center; color: #555555; }
            .otp-box { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2c3e50; background-color: #f0f3f6; padding: 15px; margin: 20px 0; border-radius: 5px; border: 2px dashed #bdc3c7; display: inline-block; }
            .footer { background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h2>Oz Tint And Wrap</h2></div>
            <div class="content">
                <p>Hello,</p>
                <p>We received a request to verify your identity. Please use the One-Time Password (OTP) below to proceed.</p>
                <div class="otp-box">${otp}</div>
                <p>This code is valid for 10 minutes.</p>
            </div>
            <div class="footer">&copy; ${new Date().getFullYear()} Oz Tint And Wrap.</div>
        </div>
    </body>
    </html>
`;

exports.createOtp = async (req, res) => { // Make this function async
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        // [NEW] CHECK DATABASE: Does a review with this email already exist?
        const existingReview = await Review.findOne({ email: email });
        if (existingReview) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already submitted a review. Thank you!' 
            });
        }

        // ... If no review exists, proceed with OTP generation ...

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = otp;

        // Auto-delete OTP after 10 minutes
        setTimeout(() => delete otpStore[email], 10 * 60 * 1000);

        const mailOptions = {
            from: '"Oz Tint & Wrap" <oztintandwrap@gmail.com>', 
            to: email,
            subject: 'Your Verification Code',
            html: getEmailTemplate(otp) // Assuming you used the helper function from my previous response
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent to your email.' });

    } catch (error) {
        console.error('[ERROR]', error);
        res.status(500).json({ success: false, message: 'Server error checking email.' });
    }
}

exports.verifyOtp =  (req, res) => {
    const { userOtp, email } = req.body;

    if (!email || !userOtp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    if (otpStore[email] && otpStore[email] === userOtp) {
        delete otpStore[email]; // Clear OTP immediately after use
        res.json({ success: true, message: 'OTP Verified!' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
}

exports.submitReview = async (req, res) => {
    try {
        const { name, carModel, rating, review, email } = req.body;
        
        // [NEW] FINAL CHECK: specific double-check before saving
        const existingReview = await Review.findOne({ where: { email: email } });
        if (existingReview) {
            return res.status(400).json({ 
                success: false, 
                message: 'A review for this email already exists.' 
            });
        }

        // Save new review
        const newReview = await Review.create({
            name,
            email,
            carModel,
            rating,
            review,
            date: new Date()
        });

       // console.log('[SERVER] New Review Saved:', newReview.id);
        
        // Optional: Clean up OTP store now that review is done
        if(otpStore[email]) delete otpStore[email];

        res.json({ success: true, message: 'Review submitted successfully!' });

    } catch (error) {
        console.error('[DB ERROR]', error);
        // Handle "Unique Constraint" error specifically if your DB enforces it
        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ success: false, message: 'You have already reviewed us.' });
        }
        res.status(500).json({ success: false, message: 'Server error saving review.' });
    }
}

exports.getReviews = async (req, res) => {
    try {
        // 1. Sort by rating (highest first)
        // 2. Then sort by date (newest first) for reviews with the same rating
        // 3. Limit the result to only 6 items
        const reviews = await Review.find({})
            .sort({ rating: -1, date: -1 }) 
            .limit(6);

        res.json(reviews);
    } catch (error) {
        console.error('[DB ERROR]', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
}