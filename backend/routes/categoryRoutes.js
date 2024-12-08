const express = require('express');
const categoryController = require('../controller/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Upload setup 
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Category Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

router.post(
  '/',
  protect,
  restrictTo('ContentAdmin'),
  upload.single('image'),
  categoryController.createCategory
);

router.put(
  '/:id',
  protect,
  restrictTo('ContentAdmin'),
  upload.single('image'),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  protect,
  restrictTo('ContentAdmin'),
  categoryController.deleteCategory
);

module.exports = router;
