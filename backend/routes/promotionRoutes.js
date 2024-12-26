const express = require('express');
const router = express.Router();
const { 
  createPromotion, 
  getPromotions, 
  getPromotion, 
  updatePromotion, 
  deletePromotion 
} = require('../controller/promotionController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

router.route('/')
  .get(protect, restrictTo('ContentAdmin'), getPromotions)
  .post(
    protect, 
    restrictTo('ContentAdmin'), 
    upload.single('image'), 
    createPromotion
  );

router.route('/:id')
  .get(protect, restrictTo('ContentAdmin'), getPromotion)
  .put(
    protect, 
    restrictTo('ContentAdmin'), 
    upload.single('image'), 
    updatePromotion
  )
  .delete(protect, restrictTo('ContentAdmin'), deletePromotion);

module.exports = router;