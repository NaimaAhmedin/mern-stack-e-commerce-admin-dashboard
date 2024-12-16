const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const productController = require('../controller/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Product Routes
router.get('/', protect, productController.getAllProducts);
router.get('/:id', protect, productController.getProductById);
router.post(
  '/',
  protect,
  restrictTo('seller', 'admin'),
  upload.array('image', 5),
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
  restrictTo('seller','admin'),
  productController.deleteProduct
);

module.exports = router;  
