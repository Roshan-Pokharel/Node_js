const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cookiesDB');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  age: Number,
  profilepic: {
   type: String,
    default: 'defaultpic.jpg'
  },
  posts: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'   
  }] 
});

module.exports = mongoose.model('user', userSchema); 
