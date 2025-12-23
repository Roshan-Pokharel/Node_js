const Booking = require('../models/Booking');
const otpStore = require('../services/otpStore'); // Ensure this matches your directory
// Ensure the path below matches where your mailing.js file is located.
// If bookingController is in /controllers and mailing.js is in the root, use '../mailing'
const transporter = require('../services/mailing'); 


exports.createBooking = async (req, res) => {
  try {
    // 1. Create the new booking object
    const newBooking = new Booking(req.body);

    // 2. Save to MongoDB
    const savedBooking = await newBooking.save();

    // --- EMAIL LOGIC START ---

    // Extract details for the email
    const { 
      firstName, lastName, email, phone, 
      make, model, year, 
      serviceName, date, 
      selectedShade, selectedCoverage, selectedHeadlights 
    } = savedBooking;

    // Construct the specific details string (handles optional fields like tint shade)
    let specificDetails = '';
    if (selectedShade) specificDetails += `\nShade: ${selectedShade}`;
    if (selectedCoverage) specificDetails += `\nCoverage: ${selectedCoverage}`;
    if (selectedHeadlights) specificDetails += `\nHeadlights: ${selectedHeadlights}`;

    // A. Email to Admin (You)
      const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `New Booking Alert: ${serviceName} - ${date}`,
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="background:#111827; color:#ffffff; padding:20px; text-align:center;">
          <h2 style="margin:0;">New Booking Received</h2>
          <p style="margin:5px 0; font-size:14px;">Oz Tint & Wrap</p>
        </div>

        <div style="padding:20px; color:#374151;">
          
          <h3 style="border-bottom:1px solid #e5e7eb; padding-bottom:5px;">Customer Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <h3 style="border-bottom:1px solid #e5e7eb; padding-bottom:5px; margin-top:20px;">Vehicle Details</h3>
          <p><strong>Car:</strong> ${year} ${make} ${model}</p>

          <h3 style="border-bottom:1px solid #e5e7eb; padding-bottom:5px; margin-top:20px;">Service Details</h3>
          <p><strong>Service:</strong> ${serviceName}</p>

          ${
            serviceName === 'Window Tinting'
              ? `
                <p><strong>Selected Shade:</strong> ${selectedShade}</p>
                <p><strong>Coverage:</strong> ${selectedCoverage}</p>
              `
              : `
                <p><strong>Selected Headlights:</strong> ${selectedHeadlights}</p>
              `
          }

          <p><strong>Date Requested:</strong> ${date}</p>

          ${
            specificDetails
              ? `<p><strong>Additional Notes:</strong><br>${specificDetails}</p>`
              : ''
          }
        </div>

        <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
          © ${new Date().getFullYear()} Oz Tint & Wrap
        </div>
      </div>
    </div>
    `
  };


    // B. Email to Customer
        const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - Oz Tint & Wrap',
      html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <div style="background:#2563eb; color:#ffffff; padding:20px; text-align:center;">
            <h2 style="margin:0;">Booking Confirmed</h2>
            <p style="margin:5px 0; font-size:14px;">Thank you for choosing us!</p>
          </div>

          <div style="padding:20px; color:#374151;">
            <p>Hi <strong>${firstName}</strong>,</p>

            <p>Thank you for booking with <strong>Oz Tint & Wrap</strong>.  
            We have successfully received your request.</p>

            <h3 style="border-bottom:1px solid #e5e7eb; padding-bottom:5px;">Your Booking Details</h3>

            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Vehicle:</strong> ${year} ${make} ${model}</p>
            <p><strong>Preferred Date:</strong> ${date}</p>

            <p style="margin-top:20px;">
              Our team will contact you shortly if any additional information is needed.
            </p>

            <p style="margin-top:30px;">
              Best regards,<br>
              <strong>Oz Tint & Wrap Team</strong>
            </p>
          </div>

          <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
            © ${new Date().getFullYear()} Oz Tint & Wrap
          </div>
        </div>
      </div>
      `
    };


    // Send both emails (using Promise.all to send them in parallel)
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    // --- EMAIL LOGIC END ---

    // 3. Respond to Frontend
    res.status(201).json({ 
      success: true, 
      message: "Booking confirmed and emails sent successfully", 
      data: savedBooking 
    });

  } catch (error) {
    console.error("Booking/Email Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while processing booking",
      error: error.message 
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Accepted', 'Completed', or 'Cancelled'

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // --- EMAIL LOGIC ---
    let emailSubject = '';
    let emailBody = '';

    if (status === 'Accepted') {
      emailSubject = 'Booking Confirmed - Service Scheduled';
      emailBody = `<h3>Hello ${booking.firstName},</h3>
                   <p>Your booking for <strong>${booking.serviceName}</strong> has been <strong>Accepted</strong>.</p>
                   <p><strong>Scheduled Date:</strong> ${booking.date}</p>
                   <p>We look forward to seeing you!</p>`;
    } else if (status === 'Completed') {
      emailSubject = 'Service Completed - Thank You!';
      emailBody = `<h3>Hello ${booking.firstName},</h3>
                   <p>Your <strong>${booking.serviceName}</strong> service for your ${booking.make} ${booking.model} has been marked as <strong>Completed</strong>.</p>
                   <p>Thank you for choosing us! We hope to see you again soon.</p>`;
    } else if (status === 'Cancelled') {
      emailSubject = 'Booking Cancellation Notice';
      emailBody = `<h3>Hello ${booking.firstName},</h3>
                   <p>Your booking for <strong>${booking.serviceName}</strong> on ${booking.date} has been <strong>Cancelled</strong>.</p>
                   <p>If you have any questions or wish to reschedule, please contact us.</p>`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: emailSubject,
      html: `<div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
                ${emailBody}
                <br/><hr/>
                <p style="font-size: 12px; color: #777;">Automated message from your Service Dashboard.</p>
             </div>`
    };

    // Send email (we don't 'await' it if we don't want to block the response, 
    // but it's safer to await to catch errors)
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: `Booking ${status} and email sent to ${booking.email}` 
    });

  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.sendManageOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // 1. Check if any booking exists for this email
    const bookingExists = await Booking.findOne({ email });
    
    if (!bookingExists) {
      return res.status(404).json({ success: false, message: 'No bookings found for this email.' });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    setTimeout(() => delete otpStore[email], 10 * 60 * 1000); // Expires in 10 mins

    // 3. Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Manage Your Booking - Verification Code',
      html: `<div style="font-family: sans-serif; padding: 20px;">
              <h2>Verification Code</h2>
              <p>Use the code below to access and manage your bookings:</p>
              <h1 style="background: #eee; padding: 10px; display: inline-block;">${otp}</h1>
              <p>This code expires in 10 minutes.</p>
             </div>`
    });

    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
};

exports.verifyManageOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (otpStore[email] && otpStore[email] === otp) {
      delete otpStore[email]; // Clear OTP after use
      
      // Return all bookings for this user
      const bookings = await Booking.find({ email }).sort({ date: 1 });
      
      res.json({ success: true, bookings });
    } else {
      res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.customerCancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body; // Pass email to ensure ownership

    const booking = await Booking.findOneAndDelete({ _id: id, email });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or access denied' });
    }

    // Optional: Send cancellation email to Admin
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Booking Cancelled by Customer: ${booking.serviceName}`,
        html: `<p>Customer <strong>${booking.firstName} ${booking.lastName}</strong> has cancelled their booking for <strong>${booking.date}</strong>.</p>`
    });

    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.customerUpdateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { emailVerification, ...updateData } = req.body;

    // Security: Only allow update if the email matches the record (Simple ownership check)
    // In a production app, use JWT tokens. Here we trust the flow from the OTP step.
    const booking = await Booking.findOneAndUpdate(
      { _id: id, email: emailVerification }, // Ensure user owns the booking
      { $set: updateData },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or access denied' });
    }

    // Notify Admin of Change
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Booking Updated: ${booking.firstName}`,
      html: `<p>Customer updated their booking details. New Date: ${booking.date}. Service: ${booking.serviceName}</p>`
    });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};