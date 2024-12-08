const express = require('express');
const subcategoryController = require('../controller/subcategoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', subcategoryController.getAllSubcategories);
router.get('/category/:categoryId', subcategoryController.getSubcategoriesByCategory);
router.get('/:id', subcategoryController.getSubcategoryById);

// Protected routes (ContentAdmin only)
router.post(
  '/',
  protect,
  restrictTo('ContentAdmin'),
  subcategoryController.createSubcategory
);

router.put(
  '/:id',
  protect,
  restrictTo('ContentAdmin'),
  subcategoryController.updateSubcategory
);

router.delete(
  '/:id',
  protect,
  restrictTo('ContentAdmin'),
  subcategoryController.deleteSubcategory
);

module.exports = router;
