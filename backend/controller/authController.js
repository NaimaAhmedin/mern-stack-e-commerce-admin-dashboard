const User = require('../Models/userSchema');
const generateToken = require('../utils/generateToken');

// Register User
exports.registerUser = async (req, res, next) => {
  const { 
    name = req.body.username, // Use username as fallback for name
    email, 
    password, 
    confirmPassword, 
    role,
    phone = ''
  } = req.body;

  // Validate name is provided
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name or username is required'
    });
  }

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
      name,
      email,
      password,
      confirmPassword,
      role,
      phone
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      data: { 
        id: user._id, 
        name: user.name, 
        role: user.role
      },
    });
  } catch (error) {
    // Log the full error for debugging
    console.error('User Registration Error:', error);

    // Send a more informative error response
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errorMessages
      });
    }

    // Generic error handler
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
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
        data: { 
          id: user._id, 
          name: user.name, 
          role: user.role 
        },
      });
      
  } catch (error) {
    next(error);
  }
};
