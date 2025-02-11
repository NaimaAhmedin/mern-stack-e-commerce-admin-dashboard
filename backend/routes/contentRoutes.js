const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
    getDashboardStats,
    getRecentProducts,
    getActivePromotions,
    getCategoryStats,
    getRecentOrders,
    getUserStats
} = require('../controller/contentController');

// Protect all routes after this middleware
router.use(protect);

// Use exact role names from the schema
router.use(restrictTo('ContentAdmin', 'SuperAdmin'));

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-products', getRecentProducts);
router.get('/active-promotions', getActivePromotions);
router.get('/category-stats', getCategoryStats);
router.get('/recent-orders', getRecentOrders);
router.get('/user-stats', getUserStats);

module.exports = router;
