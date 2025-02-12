const express = require('express');
const { getDashboardStats } = require('../controller/superadminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/stats', protect, restrictTo('SuperAdmin'), getDashboardStats);

module.exports = router;