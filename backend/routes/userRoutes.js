const express = require('express');
const router = express.Router();
const uc = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, isAdmin, uc.getAll);
router.delete('/:id', verifyToken, isAdmin, uc.softDelete);

module.exports = router;
