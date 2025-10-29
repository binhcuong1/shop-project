const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin only:
router.post('/', verifyToken, isAdmin, productController.create);
router.put('/:id', verifyToken, isAdmin, productController.update);
router.delete('/:id', verifyToken, isAdmin, productController.softDelete);

module.exports = router;