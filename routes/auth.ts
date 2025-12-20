import { Router } from 'express';
import * as authController from '../controllers/authController';
import verifyToken from '../middleware/verifyToken';
import verifyAdmin from '../middleware/verifyAdmin';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/dahboard-admin', verifyToken, verifyAdmin);

export default router;
