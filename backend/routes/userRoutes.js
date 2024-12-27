const express = require('express');
const { 
  getUserProfile, 
  getAllUsers, 
  getUserById, 
  updateUserByAdmin, 
  deleteUserByAdmin,
  getAdminsByRole,
  getUsersByRole,
  getAllAdmins
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

module.exports = router;