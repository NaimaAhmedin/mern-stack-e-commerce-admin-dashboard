const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'User must have a username'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
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
});

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
