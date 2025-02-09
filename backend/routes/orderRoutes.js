const express = require('express');
const orderController = require('../controller/orderController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const router = express.Router();

// Order Routes
router.get('/', protect, orderController.getAllOrders);
router.get('/seller', protect, restrictTo('seller'), orderController.getAllOrders);
// router.get('/', roleMiddleware(['Seller', 'DeliveryAdmin']), orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', protect, roleMiddleware(['seller', 'DeliveryAdmin']), orderController.updateOrderStatus);
router.delete('/:id', roleMiddleware(['seller']), orderController.deleteOrder);

module.exports = router;
