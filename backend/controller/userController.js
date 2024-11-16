const User = require('../Schema/userSchema');
const jwt = require('jsonwebtoken');

// Utility to sign JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

// Create user
exports.createUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const newUser = await User.create({
      username,
      email,
      password,
      confirmPassword,
    });

    const token = signToken(newUser._id);

    return res.status(201).json({
      status: 'success',
      token,
      data: newUser,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Error',
      msg: err.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(404).json({
        msg: 'Enter Email and Password',
      });
    }

    const user = await User.findOne({ email }).select('+password'); // Include password explicitly

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        msg: 'Incorrect email or password',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'Success',
      token,
      role: user.role, // Include role in response
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      msg: err.message,
    });
  }
};
