const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');
const { protect } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-admin', 
  protect, 
  roleMiddleware(['SuperAdmin']), 
  registerUser
);
router.post('/login', loginUser);

// New route to validate token
router.get('/validate-token', protect, (req, res) => {
  // If the request reaches here, the token is valid
  res.json({ 
    valid: true, 
    role: req.user.role,
    userId: req.user._id 
  });
});

module.exports = router;
