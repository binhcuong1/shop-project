const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.softDelete);

// ===== ADMIN ONLY =====
router.get('/admin/all', orderController.getAllWithDetails);
router.get('/admin/:id/details', orderController.getDetailsById);
router.put('/admin/:id/status', orderController.updateStatus);

module.exports = router;