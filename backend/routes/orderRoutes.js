const express = require('express');
const orderController = require('../controller/orderController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Order Routes
router.get('/', roleMiddleware(['Seller', 'DeliveryAdmin']), orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id', roleMiddleware(['Seller', 'DeliveryAdmin']), orderController.updateOrderStatus);
router.delete('/:id', roleMiddleware(['Seller']), orderController.deleteOrder);

module.exports = router;
