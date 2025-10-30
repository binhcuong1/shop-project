const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Product = require('../models/productModel'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
    try {
        const orders = await Order.find({ isDeleted: false })
            .populate({ path: 'user', select: 'username email' })
            .select('-__v')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
        console.log('Body nhận từ FE:', JSON.stringify(req.body, null, 2));

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Thiếu danh sách sản phẩm' });
        }

        const order = new Order({
            user: decoded.id,
            totalAmount: 0,
            status: 'pending',
        });
        await order.save();

        const detailsToInsert = [];
        let total = 0;

        for (const raw of items) {
            const productId = raw.product || raw._id || raw.id;
            const quantity = Number(raw.quantity) || 0;
            let unitPrice = Number(raw.unitPrice);

            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ message: 'productId không hợp lệ' });
            }
            if (quantity <= 0) {
                return res.status(400).json({ message: 'quantity phải > 0' });
            }

            if (!Number.isFinite(unitPrice) || unitPrice < 0) {
                const p = await Product.findById(productId).select('price');
                if (!p) return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
                unitPrice = Number(p.price);
            }

            const subtotal = quantity * unitPrice;
            total += subtotal;

            detailsToInsert.push({
                order: order._id,
                product: productId,
                quantity,
                unitPrice,
                subtotal,
            });
        }

        if (detailsToInsert.length) {
            await OrderDetail.insertMany(detailsToInsert);
        }

        order.totalAmount = total;
        await order.save();

        const populated = await Order.findById(order._id)
            .populate('user', 'username email')
            .select('-__v');

        return res.status(201).json({ success: true, data: populated });
    } catch (err) {
        console.error('Lỗi tạo đơn hàng:', err);
        return res.status(500).json({ message: err.message });
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

exports.getAllWithDetails = async (req, res) => {
    try {
        const orders = await Order.find({ isDeleted: false })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDetailsById = async (req, res) => {
    try {
        const details = await OrderDetail.find({ order: req.params.id })
            .populate('product', 'name price');
        res.json({ success: true, data: details });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'completed', 'cancelled'].includes(status))
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orders = await Order.find({ isDeleted: false, user: userId })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (String(order.user) !== req.user.id)
            return res.status(403).json({ message: 'Forbidden' });

        const details = await OrderDetail.find({ order: order._id })
            .populate('product', 'name price');
        res.json({ success: true, data: { order, details } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
