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
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  color: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  warranty: { type: Number, default: 0 },
  description: { type: String },
  images: {
    type: [String],
    validate: [
      {
        validator: function(v) {
          return v.length <= 5;
        },
        message: 'A product can have at most 5 images.'
      }
    ],
    default: []
  }
}, { timestamps: true });

// Create a 2dsphere index on the location field for geospatial queries
productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', productSchema);
