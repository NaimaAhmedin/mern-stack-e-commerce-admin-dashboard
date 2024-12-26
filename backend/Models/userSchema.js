const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  // Basic User Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },

  // Profile Information
  profileImage: {
    public_id: String,
    url: String
  },

  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
  },

  // Role and Status
  role: {
    type: String,
    enum: ['user', 'seller', 'ContentAdmin', 'SuperAdmin', 'DeliveryAdmin','deliverer'],
  },

  // Seller-specific Details
  sellerDetails: {
    businessLicense: {
      type: String,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    approval:{
      type:String,
      enu:['approved','rejected'],
      default:'rejected'
      
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);

module.exports = User;