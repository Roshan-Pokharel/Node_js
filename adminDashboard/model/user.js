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
    
    cart: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    color:{
      type:String,
      default:'none'
    },
    quantity: {
      type: Number,
      default: 1
    },
    orderDate: {
      type: Date,
      default: Date.now
    }
  }
],
  orders: [
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    color:{
      type:String,
      default:'none'
    },
    quantity: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      default: "pending"
    },
    orderDate: {
      type: Date,
      default: Date.now
    }
  }
],

});
const User = mongoose.model('User', userSchema);
module.exports = User;