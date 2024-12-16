const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String }, // Remove required
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  subcategoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subcategory'
  },
  color: { type: String },
  price: { type: Number, required: true },
  amount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  warranty: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
