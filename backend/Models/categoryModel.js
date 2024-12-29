const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  image: {
    type: String,
    required: [true, 'Category image URL is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Ensure unique category names
categorySchema.index({ name: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
