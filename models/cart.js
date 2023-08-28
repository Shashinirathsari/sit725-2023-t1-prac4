const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('Cart', cartSchema);
