const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cookiesDB');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'   // lowercase to match post model
  }] 
});

module.exports = mongoose.model('user', userSchema); 
