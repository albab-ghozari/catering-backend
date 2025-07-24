const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// User routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my', verifyToken, orderController.getMyOrders);
router.post('/pay/:orderId', verifyToken, paymentController.payOrder);

// Admin routes
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
// router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateStatus);

module.exports = router;
