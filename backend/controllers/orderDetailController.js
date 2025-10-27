const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
