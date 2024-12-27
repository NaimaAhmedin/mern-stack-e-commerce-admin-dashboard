const express = require('express');
const productController = require('../controller/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

// Product Routes
router.get('/', protect, productController.getAllProducts);
router.get('/:id', protect, productController.getProductById);
router.post(
  '/',
  protect,
  restrictTo('seller', 'admin'),
  productController.createProduct 
);
router.put(
  '/:id', 
  protect, 
  restrictTo('seller', 'admin'),
  productController.updateProduct
);
router.delete(
  '/:id', 
  protect, 
  restrictTo('seller','admin', 'ContentAdmin'),
  productController.deleteProduct
);

module.exports = router;  
