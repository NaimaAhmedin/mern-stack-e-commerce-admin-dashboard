const User = require('../models/userSchema');
const generateToken = require('../utils/generateToken');

// Register User
exports.registerUser = async (req, res, next) => {
  const { username, email, password, confirmPassword, role } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
      confirmPassword,
      role,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      data: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
        success: true,
        token: generateToken(user._id, user.role),
        data: { id: user._id, username: user.username, role: user.role },
      });
      
  } catch (error) {
    next(error);
  }
};
