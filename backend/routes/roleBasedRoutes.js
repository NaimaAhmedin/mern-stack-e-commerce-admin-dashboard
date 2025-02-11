const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const subcategoryRoutes = require('./subcategoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./authRoutes');
const dashboardController = require('../controller/dashboardController');
const contentController = require('../controller/contentController'); // added this line

const router = express.Router();

// Modular Routes
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

// Dashboard routes
router.get('/content/dashboard-stats', protect, restrictTo('ContentAdmin'), contentController.getDashboardStats);
router.get('/content/dashboard/monthly-stats', protect, restrictTo('ContentAdmin'), dashboardController.getMonthlyProductStats);
router.get('/content/dashboard/recent-products', protect, restrictTo('ContentAdmin'), dashboardController.getRecentProducts);

module.exports = router;
