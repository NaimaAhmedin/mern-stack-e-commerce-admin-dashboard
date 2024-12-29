const User = require('../Models/userSchema');

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
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Log incoming request body for debugging
    console.log('Update Profile Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Destructure and sanitize input
    const { 
      name, 
      email, 
      phone, 
      address, 
      businessLicenseNumber,
      department 
    } = req.body;

    // Sanitize name 
    const sanitizedName = (name && typeof name === 'string') 
      ? name.trim() 
      : (user.name || 'Unnamed User');

    // Validate name explicitly
    if (!sanitizedName || sanitizedName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
        errors: {
          name: 'Name must contain at least one non-whitespace character'
        }
      });
    }

    // Sanitize address
    const sanitizedAddress = (address && typeof address === 'string')
      ? address.trim()
      : '';

    // Input validation
    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Update basic profile fields
    user.name = sanitizedName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    user.address = sanitizedAddress;

    // Update seller details if applicable
    if (businessLicenseNumber && user.role === 'seller') {
      user.sellerDetails = user.sellerDetails || {};
      user.sellerDetails.businessLicense = businessLicenseNumber;
    }

    // Update admin details if applicable
    if (department && ['ContentAdmin', 'DeliveryAdmin'].includes(user.role)) {
      user.adminDetails = user.adminDetails || {};
      user.adminDetails.department = department;
    }

    // Handle profile image upload
    if (req.file) {
      try {
        // Validate file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only JPEG and PNG are allowed.'
          });
        }

        // Check file size (2MB limit)
        if (req.file.size > 2 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds 2MB limit'
          });
        }

        // If user already has a profile image, delete the old one from Cloudinary
        if (user.profileImage && user.profileImage.public_id) {
          await cloudinary.uploader.destroy(user.profileImage.public_id);
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_images',
          transformation: [
            { width: 500, height: 500, crop: 'limit' }
          ]
        });

        // Remove local file after upload
        fs.unlinkSync(req.file.path);

        // Update user's profile image
        user.profileImage = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Profile image upload error:', uploadError);
        // Remove local file in case of upload error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          success: false,
          message: 'Error uploading profile image',
          details: uploadError.message
        });
      }
    }

    // Save updated user with explicit validation
    try {
      await user.save();
    } catch (saveError) {
      console.error('User save error:', saveError);
      return res.status(400).json({
        success: false,
        message: 'Profile update validation failed',
        errors: saveError.errors || { general: saveError.message }
      });
    }

    // Prepare response data
    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      profileImage: user.profileImage,
      ...(user.role === 'seller' && { sellerDetails: user.sellerDetails }),
      ...(user.role === 'ContentAdmin' && { 
        adminDetails: {
          department: user.adminDetails?.department 
        } 
      })
    };

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    // Pass to error middleware for consistent error handling
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
      name: req.user.name,
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
        name: updatedUser.name,
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
        name: user.name,
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

// Get All Sellers (Admin Only)
exports.getAllSellers = async (req, res, next) => {
  try {
    // Construct query to find only sellers
    const queryObj = { 
      role: 'seller'
    };

    // Handle status filtering
    if (req.query['sellerDetails.status'] && req.query['sellerDetails.status'] !== 'all') {
      // Explicitly handle active status filtering
      if (req.query['sellerDetails.status'] === 'active') {
        queryObj.$or = [
          { 'sellerDetails.status': 'active' },
          { 'sellerDetails.status': { $exists: false } }
        ];
      } else {
        // For other specific statuses
        queryObj['sellerDetails.status'] = req.query['sellerDetails.status'];
      }
    } else {
      // For 'all' status, remove any status filtering
      delete queryObj['sellerDetails.status'];
    }

    let query = User.find(queryObj).select('-password');

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const sellers = await query;
    const totalSellers = await User.countDocuments({ 
      role: 'seller', 
      ...(req.query['sellerDetails.status'] && req.query['sellerDetails.status'] !== 'all' 
        ? (req.query['sellerDetails.status'] === 'active'
          ? { 
              $or: [
                { 'sellerDetails.status': 'active' },
                { 'sellerDetails.status': { $exists: false } }
              ]
            }
          : { 'sellerDetails.status': req.query['sellerDetails.status'] }
        ) 
        : {}) 
    });

    const sellersData = sellers.map(seller => ({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      sellerDetails: {
        status: seller.sellerDetails?.status || 'active',
        approval: seller.sellerDetails?.approval || 'rejected'
      }
    }));

    res.status(200).json({
      status: 'success',
      results: sellers.length,
      totalSellers,
      data: sellersData
    });
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch sellers',
      error: error.message
    });
  }
};

// Add new method for updating seller status
exports.updateSellerStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // Extensive logging for debugging
  console.log('Update Seller Status Request:', {
    requestParams: req.params,
    requestBody: req.body,
    requestUser: req.user ? {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    } : 'No user in request'
  });

  try {
    // Verify the updating user is an admin
    if (!req.user || !['SuperAdmin', 'ContentAdmin'].includes(req.user.role)) {
      console.error('Status update failed: Unauthorized access', { 
        userRole: req.user ? req.user.role : 'No user' 
      });
      return res.status(403).json({
        success: false,
        message: 'Only admins can update seller status'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      console.error('Status update failed: Seller not found', { sellerId: id });
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Ensure the user is a seller
    if (user.role !== 'seller') {
      console.error('Status update failed: Not a seller', { 
        userId: id, 
        userRole: user.role 
      });
      return res.status(400).json({
        success: false,
        message: 'Can only update status for sellers'
      });
    }

    // Validate status
    const validStatuses = ['active', 'suspended'];
    if (!validStatuses.includes(status)) {
      console.error('Status update failed: Invalid status', { 
        providedStatus: status,
        validStatuses: validStatuses
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid seller status'
      });
    }

    // Update user status
    if (!user.sellerDetails) {
      user.sellerDetails = {};
    }
    user.sellerDetails.status = status;
    await user.save({ validateBeforeSave: false });

    // Log successful status update
    console.log('Seller status updated successfully:', {
      sellerId: user._id,
      newStatus: user.sellerDetails.status,
      updatedBy: req.user._id
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        status: user.sellerDetails.status
      }
    });
  } catch (error) {
    console.error('Error updating seller status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errorDetails: error.message
    });
  }
};

// Update Seller Approval Status
exports.updateSellerApproval = async (req, res, next) => {
  const { id } = req.params;
  const { approval } = req.body;

  // Extensive logging for debugging
  console.log('Update Seller Approval Request:', {
    requestParams: req.params,
    requestBody: req.body,
    requestUser: req.user ? {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    } : 'No user in request'
  });

  try {
    // Verify the updating user is an admin
    if (!req.user || !['SuperAdmin', 'ContentAdmin'].includes(req.user.role)) {
      console.error('Approval update failed: Unauthorized access', { 
        userRole: req.user ? req.user.role : 'No user' 
      });
      return res.status(403).json({
        success: false,
        message: 'Only SuperAdmin and ContentAdmin can update seller approval'
      });
    }

    // Find the user and update the approval status
    const user = await User.findByIdAndUpdate(
      id, 
      { 'sellerDetails.approval': approval }, 
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    console.log('Seller approval updated successfully:', {
      sellerId: user._id,
      newApproval: user.sellerDetails.approval
    });

    res.status(200).json({
      success: true,
      message: 'Seller approval status updated successfully',
      data: { 
        id: user._id, 
        name: user.name, 
        approval: user.sellerDetails.approval 
      }
    });
  } catch (error) {
    console.error('Error updating seller approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update seller approval',
      error: error.message
    });
  }
};
