const { default: mongoose } = require("mongoose");
require('dotenv').config(); 

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/durgagrocery';

// Export a function that handles the connection logic
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            serverSelectionTimeoutMS: 15000, 
            socketTimeoutMS: 45000, 
        });
        console.log("Mongoose connected successfully!");
    } catch (err) {
        console.error("Mongoose connection failed:", err.message);
        process.exit(1); 
    }
};

module.exports = connectDB; // Export the function