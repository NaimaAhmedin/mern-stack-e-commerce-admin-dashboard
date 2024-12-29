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
    validate: {
      validator: function(v) {
        // Allow names with at least one non-whitespace character
        return v.trim().length > 0;
      },
      message: 'Name must contain at least one non-whitespace character'
    }
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
    trim: true,
    default: ''
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
    type: String,
    trim: true,
    default: ''
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
      enum:['approved','rejected'],
      default:'rejected'
    }
  },

  // Admin-specific Details
  adminDetails: {
    department: {
      type: String,
      trim: true
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

// Custom error handling middleware
userSchema.post('save', function(error, doc, next) {
  if (error.name === 'ValidationError') {
    const errors = Object.keys(error.errors).reduce((acc, key) => {
      acc[key] = error.errors[key].message;
      return acc;
    }, {});
    
    const customError = new Error('Validation Failed');
    customError.name = 'ValidationError';
    customError.errors = errors;
    next(customError);
  } else {
    next(error);
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Modify pre-save hook to handle empty name and address type coercion
userSchema.pre('save', function(next) {
  // Ensure name is not just whitespace
  if (!this.name || this.name.trim() === '') {
    this.name = 'Unnamed User';
  }
  
  // Ensure address is a string
  if (this.address && typeof this.address !== 'string') {
    this.address = String(this.address);
  }
  
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