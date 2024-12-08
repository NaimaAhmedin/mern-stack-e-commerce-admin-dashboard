const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const subcategoryRoutes = require('./subcategoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./authRoutes');

const router = express.Router();

// Modular Routes
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
