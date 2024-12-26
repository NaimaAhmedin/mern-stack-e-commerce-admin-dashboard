const express = require('express');
const { 
  getUserProfile, 
  getAllUsers, 
  getUserById, 
  updateUserByAdmin, 
  deleteUserByAdmin,
  getAdminsByRole,
  getAllAdmins,
  getAllSellers,
  updateSellerStatus  
} = require('../controller/userController');
const { protect } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// User Profile Routes
router.get('/profile', protect, getUserProfile);

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

// Sellers Route
router.get('/sellers', 
  protect, 
  roleMiddleware(['SuperAdmin', 'ContentAdmin']), 
  getAllSellers
);

// New route for updating seller status
router.patch('/users/sellers/:id/status', 
  protect, 
  roleMiddleware(['SuperAdmin', 'ContentAdmin']), 
  updateSellerStatus
);

router.get('/users', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  getAllUsers
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

module.exports = router;
