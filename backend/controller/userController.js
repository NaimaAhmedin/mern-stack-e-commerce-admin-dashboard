const User = require('../models/userSchema');

// Get User Profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete User Account
exports.deleteUserAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res, next) => {
  try {
    // Define user roles
    const userRoles = ['seller', 'Customer'];

    const users = await User.find({ role: { $in: userRoles } })
    .select('-password') // Exclude password
    .sort({ createdAt: -1 }); // Sort by most recent first;
    res.status(200).json({ 
      success: true, 
      count: users.length,
      data: users });
  } catch (error) {
    next(error);
  }
};

// Get Single User (Admin Only)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Admin Update User (Admin Only)
exports.updateUserByAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  // Extensive logging for debugging
  console.log('Update Admin Request Details:', {
    requestParams: req.params,
    requestBody: req.body,
    requestUser: req.user ? {
      id: req.user._id,
      userName: req.user.userName,
      role: req.user.role
    } : 'No user in request'
  });

  // Validate input
  if (!role) {
    console.error('Update failed: No role provided');
    return res.status(400).json({
      success: false,
      message: ['Role is required for update']
    });
  }

  // Define valid admin roles
  const validAdminRoles = ['SuperAdmin', 'DeliveryAdmin', 'ContentAdmin'];

  try {
    // Verify the updating user exists and is a SuperAdmin
    if (!req.user) {
      console.error('Update failed: No authenticated user');
      return res.status(401).json({
        success: false,
        message: ['Authentication required']
      });
    }

    // Explicitly check if the updating user is a SuperAdmin
    if (req.user.role !== 'SuperAdmin') {
      console.error('Update failed: User is not a SuperAdmin', {
        userRole: req.user.role
      });
      return res.status(403).json({
        success: false,
        message: ['Only SuperAdmin can modify user roles']
      });
    }

    // Find the user to update
    const user = await User.findById(id);

    if (!user) {
      console.error('Update failed: User not found', { userId: id });
      return res.status(404).json({
        success: false,
        message: ['User not found']
      });
    }

    // Validate role
    if (!validAdminRoles.includes(role)) {
      console.error('Update failed: Invalid role', { 
        providedRole: role, 
        validRoles: validAdminRoles 
      });
      return res.status(400).json({
        success: false,
        message: ['Invalid role specified']
      });
    }

    // Bypass validation for role update
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { 
        new: true, 
        runValidators: false // Bypass schema validation
      }
    );

    // Log successful update
    console.log('Admin role updated successfully:', {
      userId: updatedUser._id,
      newRole: updatedUser.role,
      updatedBy: req.user._id
    });

    // Return updated user details (excluding password)
    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    // Log the full error for server-side debugging
    console.error('Unexpected error updating admin role:', {
      error: error.message,
      stack: error.stack
    });
    
    // Handle potential validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Generic error response
    res.status(500).json({
      success: false,
      message: ['Internal server error']
    });
  }
};

// Admin Delete User (Admin Only)
exports.deleteUserByAdmin = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the user to delete
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of SuperAdmin
    if (user.role === 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete SuperAdmin account'
      });
    }

    // Prevent deleting the last SuperAdmin
    const superAdminCount = await User.countDocuments({ role: 'SuperAdmin' });
    if (superAdminCount <= 1 && user.role === 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete the last SuperAdmin'
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
      deletedUser: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

// Get Admins by Role (Admin Only)
exports.getAdminsByRole = async (req, res, next) => {
  const { role } = req.params;

  // Define valid admin roles (excluding seller)
  const adminRoles = ['SuperAdmin', 'DeliveryAdmin', 'ContentAdmin'];

  try {
    // Validate role
    if (!adminRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role specified' 
      });
    }

    // Find users with the specified role
    const admins = await User.find({ role })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};


// Get User by Role (users Only)
exports.getUsersByRole = async (req, res, next) => {
  const { role } = req.params;

  // Define valid user roles (excluding admins)
  const userRoles = ['seller', 'Customer', 'deliverer'];

  try {
    // Validate role
    if (!userRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role specified' 
      });
    }

    // Find users with the specified role
    const users = await User.find({ role })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get All Admins (Admin Only)
exports.getAllAdmins = async (req, res, next) => {
  try {
    // Define admin roles (excluding seller)
      const adminRoles = ['SuperAdmin', 'DeliveryAdmin', 'ContentAdmin'];

    // Find all users with admin roles
    const admins = await User.find({ role: { $in: adminRoles } })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};
