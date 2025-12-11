const mongoose = require('mongoose'); 
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: String,
    phoneNumber: String,
    ward:Number,
    tole:String,
    
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
       ref: "Product" },
    color: String,
    quantity: Number,
    status: String,
    orderDate: Date,
    priceAtPurchase: Number,
    discountAtPurchase: Number,
    finalPrice: Number,
   cancellationReason:String
  }
],

});
const User = mongoose.model('User', userSchema);
module.exports = User;