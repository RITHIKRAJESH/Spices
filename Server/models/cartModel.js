const mongoose = require('mongoose');

// Define the CartItem schema
const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'retailsproduct_tbl', required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  rate: { type: Number, required: true },
});


const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user_tbl', required: true },
  items: [CartItemSchema],
  status:{type:String,
    default:"Cart"
  }
},{
  timestamps: true, // Track when the cart is updated
});

// Create and export the Cart model
module.exports = mongoose.model('Cart', CartSchema);
