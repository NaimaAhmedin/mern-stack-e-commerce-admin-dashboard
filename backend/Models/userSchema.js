const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  userName: {
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0; // Ensure username is not an empty string
      },
      message: 'User must have a username'
    }
  },
  role: {
    type: String,
    // Removed default to allow more flexibility
  },
  
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    validate: {
      validator: (value) => {
        return value.length > 5;
      },
      message: "Password must be at least 6 characters long",
    },
    select: false, // Prevent password from being returned in queries
  },
  confirmPassword: {
    type: String,
    required: [true, 'User must confirm the password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  phone: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        // Optional phone number validation, but allow empty string
        return v === '' || /^(\+251|0)[79][0-9]{8}$/.test(v);
      },
      message: "Invalid phone number format"
    }
  },
  address: {
    type: String,
    default: "",
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationExpiresAt: Date,
}, { timestamps: true });

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // Do not save confirmPassword in the database
  next();
});

// Instance method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
