const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', verifyToken, auth.me);

module.exports = router;