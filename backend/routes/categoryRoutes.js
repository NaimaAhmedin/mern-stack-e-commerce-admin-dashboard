const express = require('express');
const categoryController = require('../controller/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

const router = express.Router();

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
