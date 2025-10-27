const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
