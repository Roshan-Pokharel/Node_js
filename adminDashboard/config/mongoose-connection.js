const { default: mongoose } = require("mongoose");

mongoose.connect('mongodb://localhost:27017/durgagrocery').then(() => {
    console.log("Mongoose connected successfully");
}).catch((err) => {
    console.log("Mongoose connection failed:", err);
});