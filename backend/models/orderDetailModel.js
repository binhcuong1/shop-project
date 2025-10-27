const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
        type: Number,
        required: true,
        min: [0, 'Unit price must be non-negative']
    },
    subtotal: {
        type: Number,
        default: function () {
            return this.quantity * this.unitPrice;
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

orderDetailSchema.pre('save', function (next) {
    this.subtotal = this.quantity * this.unitPrice;
    next();
});

module.exports = mongoose.model('OrderDetail', orderDetailSchema);
