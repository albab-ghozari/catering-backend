import { Router } from 'express';
import menuController from '../controllers/menuController';
import verifyToken from '../middleware/verifyToken';
import verifyAdmin from '../middleware/verifyAdmin';

const router = Router();

// Public
router.get('/', menuController.getAllMenu);

// Admin only
router.post('/', verifyToken, verifyAdmin, menuController.addMenu);
router.put('/:id', verifyToken, verifyAdmin, menuController.updateMenu);
router.delete('/:id', verifyToken, verifyAdmin, menuController.deleteMenu);

export default router;
