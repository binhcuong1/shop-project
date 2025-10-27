const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');

router.get('/', orderDetailController.getAll);
router.get('/:id', orderDetailController.getById);
router.post('/', orderDetailController.create);
router.put('/:id', orderDetailController.update);
router.delete('/:id', orderDetailController.softDelete);

module.exports = router;