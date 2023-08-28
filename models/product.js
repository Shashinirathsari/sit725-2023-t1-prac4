// models/product.js
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  // Your product schema definition
  name: String,
  price: Number,
  description: String,
  // ... other fields
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
