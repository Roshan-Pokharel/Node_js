const Quote = require('../models/Quote');
// @desc    Create new quote
// @route   POST /api/quotes
exports.createQuote = async (req, res) => {
  try {
    const {
      suburb,
      vehicleReg,
      serviceType,
      repairPart,
      tintCondition,
      fullName,
      phone,
      email,
      comments
    } = req.body;

    // Create the document in MongoDB
    const quote = await Quote.create({
      suburb,
      vehicleReg,
      serviceType,
      repairPart,
      tintCondition,
      fullName,
      phone,
      email,
      comments
    });

    res.status(201).json({
      success: true,
      message: 'Quote submitted successfully',
      data: quote
    });
  } catch (error) {
    console.error('Submission Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Validation failed'
    });
  }
};