const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));       
router.use('/users', require('./userRoutes'));      
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));    
router.use('/order-details', require('./orderDetailRoutes'));

module.exports = router;