const mongoose = require('mongoose'); 

const reviewSchema = new mongoose.Schema({
  userName: String,
  userId: {
     type:mongoose.Schema.Types.ObjectId,
     ref: 'User'
   }, // or user ID if you have a user model
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});


const productSchema = new mongoose.Schema({
    productname: { type: String, required: true, unique: true },
    rating:Number,
    description: { type: String, required: true },
    brand: String,
    colors: [{ type: String }],  
    price:Number,
    discount:Number,
    offer:String,
    image: [{
    data: Buffer,
    contentType: String
  }],
   reviews: [reviewSchema]
});
const Product = mongoose.model('Product', productSchema); 
module.exports = Product;
