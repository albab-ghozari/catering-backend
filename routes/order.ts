import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import * as paymentController from '../controllers/paymentController';
import verifyToken from '../middleware/verifyToken';
import verifyAdmin from '../middleware/verifyAdmin';

const router = Router();

// User routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my', verifyToken, orderController.getMyOrders);
router.post(
  '/pay/:orderId',
  verifyToken,
  paymentController.payOrder as unknown as import('express').RequestHandler
);

// Admin routes
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
// router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateStatus);

export default router;
