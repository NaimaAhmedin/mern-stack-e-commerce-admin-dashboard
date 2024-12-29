const express = require('express');
const productController = require('../controller/productController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Product Routes
router.get('/', protect, productController.getAllProducts);
router.get('/seller', protect, restrictTo('seller'), productController.getAllProducts);
router.get('/:id', protect, productController.getProductById);
router.post(
  '/',
  protect,
  restrictTo('seller'),
  upload.array('images', 5),  // Allow up to 5 images
  productController.createProduct 
);
router.put(
  '/:id', 
  protect, 
  restrictTo('seller'),
  upload.array('images', 5),  // Allow up to 5 images
  productController.updateProduct
);
router.delete(
  '/:id', 
  protect, 
  restrictTo('seller', 'ContentAdmin'),
  productController.deleteProduct
);

module.exports = router;
