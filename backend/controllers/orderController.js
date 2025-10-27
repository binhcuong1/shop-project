const Order = require('../models/orderModel');

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
    const o = new Order(req.body);
    await o.save();
    res.status(201).json({ success: true, data: o });
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
