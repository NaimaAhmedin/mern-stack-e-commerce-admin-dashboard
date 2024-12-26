const express = require('express');
const router = express.Router();
const { 
  getAllSellers, 
  getSeller, 
  updateSellerStatus, 
  deleteSeller 
} = require('../controller/sellerController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Routes for sellers management
router.route('/')
  .get(protect, restrictTo('ContentAdmin'), getAllSellers);

router.route('/:id')
  .get(protect, restrictTo('ContentAdmin'), getSeller)
  .delete(protect, restrictTo('ContentAdmin'), deleteSeller);

router.route('/:id/status')
  .patch(protect, restrictTo('ContentAdmin'), updateSellerStatus);

module.exports = router;
