const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const jwt = require('jsonwebtoken');

exports.getAll = async (req, res) => {
    const orders = await Order.find({ isDeleted: false });
    res.json({ success: true, data: orders });
};

exports.getById = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order || order.isDeleted)
        return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, data: order });
};

exports.create = async (req, res) => {
    try {
        const header = req.header('Authorization');
        if (!header) return res.status(401).json({ message: 'Thiếu token' });
        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');

        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0)
            return res.status(400).json({ message: 'Thiếu danh sách sản phẩm' });

        const order = await Order.create({
            user: decoded.id,
            totalAmount: 0,
            status: 'pending',
        });

        let total = 0;
        for (const item of items) {
            const { product, quantity, unitPrice } = item;
            const subtotal = quantity * unitPrice;
            total += subtotal;
            await OrderDetail.create({
                order: order._id,
                product,
                quantity,
                unitPrice,
                subtotal,
            });
        }

        order.totalAmount = total;
        await order.save();

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    const o = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, data: o });
};

exports.softDelete = async (req, res) => {
    const o = await Order.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ success: true, data: o });
};
