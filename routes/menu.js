const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public
router.get('/', menuController.getAllMenu);

// Admin only
router.post('/', verifyToken, verifyAdmin, menuController.addMenu);
router.put('/:id', verifyToken, verifyAdmin, menuController.updateMenu);
router.delete('/:id', verifyToken, verifyAdmin, menuController.deleteMenu);

module.exports = router;
