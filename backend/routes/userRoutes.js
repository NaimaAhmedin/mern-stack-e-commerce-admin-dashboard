const express = require('express');
const { 
  getUserProfile, 
  getAllUsers, 
  getUserById, 
  updateUserByAdmin, 
  deleteUserByAdmin,
  getAdminsByRole,
  getUsersByRole,
  getAllAdmins,
  updateUserProfile,
  deleteUserAccount
} = require('../controller/userController');
const { protect } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const multer = require('multer');
const path = require('path');
const User = require('../Models/userSchema'); // Corrected import path

const router = express.Router();

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profile_images/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to limit file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 2 * 1024 * 1024 // 2MB file size limit
  }
});

// User Profile Routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profileImage'), updateUserProfile);

// Admin Management Routes
router.get('/admins', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  getAllAdmins
);

router.get('/admins/:role', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  getAdminsByRole
);

router.get('/users', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  getAllUsers
);

router.get('/users/:role', 
  protect, 
  roleMiddleware(['SuperAdmin', 'DeliveryAdmin','ContentAdmin']), 
  getUsersByRole
);

router.get('/users/:id', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  getUserById
);

router.put('/admin/:id', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  updateUserByAdmin
);

router.delete('/admin/:id', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  deleteUserByAdmin
);

router.route('/delete-account')
  .delete(protect, deleteUserAccount);

  router.get('/sellers', protect, roleMiddleware(['ContentAdmin', 'SuperAdmin']), async (req, res) => {
    try {
      const sellers = await User.find({ role: 'seller' })
        .select('name email profileImage status createdAt businessDetails');
  
      const formattedSellers = sellers.map(seller => ({
        id: seller._id,
        name: seller.name,
        email: seller.email,
        profileImage: seller.profileImage?.url || null,
        status: seller.status || 'Active',
        businessName: seller.businessDetails?.businessName || 'N/A',
        joinedDate: seller.createdAt
      }));
  
      res.status(200).json({
        success: true,
        data: formattedSellers
      });
    } catch (error) {
      console.error('Error fetching sellers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching sellers list'
      });
    }
  });
  
  // Add suspend/activate route
  router.put('/sellers/:id/status', protect, roleMiddleware(['ContentAdmin', 'SuperAdmin']), async (req, res) => {
    try {
      const { status } = req.body;
      const seller = await User.findByIdAndUpdate(
        req.params.id, 
        { status }, 
        { new: true }
      );
  
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: {
          id: seller._id,
          status: seller.status
        }
      });
    } catch (error) {
      console.error('Error updating seller status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating seller status'
      });
    }
  });

// Seller Menu Profile Route
router.get('/seller/menu-profile', protect, roleMiddleware(['seller']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('name email profileImage');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prepare response data
    const profileData = {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage?.url || null
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Seller menu profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller profile'
    });
  }
});

// Content Admin Menu Profile Route
router.get('/content-admin/menu-profile', protect, roleMiddleware(['ContentAdmin']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('name email profileImage adminDetails');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prepare response data
    const profileData = {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage?.url || null,
      department: user.adminDetails?.department || 'Content Department'
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Content Admin menu profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content admin profile'
    });
  }
});

// Delivery Admin Menu Profile Route
router.get('/delivery-admin/menu-profile', protect, roleMiddleware(['DeliveryAdmin']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('name email profileImage adminDetails');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prepare response data
    const profileData = {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage?.url || null,
      department: user.adminDetails?.department || 'Delivery Department'
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Delivery Admin menu profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery admin profile'
    });
  }
});
router.get('/superadmin/menu-profile', protect, roleMiddleware(['SuperAdmin']), async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('name email profileImage');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profileData = {
      name: user.name,
      email: user.email,
      profileImage: user.profileImage?.url || null
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('SuperAdmin menu profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching superadmin profile'
    });
  }
});

module.exports = router;