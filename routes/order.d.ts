import { Router } from 'express';
import orderController from '../controllers/orderController';
import paymentController from '../controllers/paymentController';
import verifyToken from '../middleware/verifyToken';
import verifyAdmin from '../middleware/verifyAdmin';

const router = Router();

// User routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my', verifyToken, orderController.getMyOrders);
router.post('/pay/:orderId', verifyToken, paymentController.payOrder);

// Admin routes
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
// router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateStatus);

export default router;
