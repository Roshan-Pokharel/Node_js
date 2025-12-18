const Booking = require('../models/Booking');
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