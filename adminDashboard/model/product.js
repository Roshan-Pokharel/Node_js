const mongoose = require('mongoose'); 
const productSchema = new mongoose.Schema({
    productname: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    color: String,  
    price:Number,
    rating: String,
    discount:Number,
    offer:String,
    image: [{
    data: Buffer,
    contentType: String
  }]
});
const Product = mongoose.model('Product', productSchema); 
module.exports = Product;
