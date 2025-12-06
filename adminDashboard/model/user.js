const mongoose = require('mongoose'); 
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin:{
        type:Boolean,
        ref: 'admin'
    },
    address: String,
    phone: String,
});
const User = mongoose.model('User', userSchema);
module.exports = User;