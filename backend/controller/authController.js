const User = require('../models/userSchema');
const generateToken = require('../utils/generateToken');

// Register User
exports.registerUser = async (req, res, next) => {
  const { 
    username, 
    email, 
    password, 
    confirmPassword, 
    role,
    firstName = '',
    lastName = '',
    phone = ''
  } = req.body;

  // Check if the current user has permission to create the specified role
  const currentUserRole = req.user ? req.user.role : null;
  const adminRoles = ['SuperAdmin', 'DeliveryAdmin', 'ContentAdmin', 'seller'];

  // If a specific role is being assigned, ensure it's done by a super admin
  if (role && adminRoles.includes(role) && (!currentUserRole || currentUserRole !== 'SuperAdmin')) {
    return res.status(403).json({
      success: false,
      message: 'Only SuperAdmin can assign specific roles'
    });
  }

  try {
    const user = await User.create({
      userName: username,
      email,
      password,
      confirmPassword,
      role,
      firstName,
      lastName,
      phone
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      data: { 
        id: user._id, 
        username: user.userName, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
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
        data: { id: user._id, username: user.userName, role: user.role },
      });
      
  } catch (error) {
    next(error);
  }
};
