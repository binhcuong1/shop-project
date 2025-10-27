const OrderDetail = require('../models/orderDetailModel');

exports.getAll = async (req, res) => {
    const items = await OrderDetail.find({ isDeleted: false });
    res.json({ success: true, data: items });
};

exports.getById = async (req, res) => {
    const item = await OrderDetail.findById(req.params.id);
    if (!item || item.isDeleted)
        return res.status(404).json({ message: 'OrderDetail not found' });
    res.json({ success: true, data: item });
};

exports.create = async (req, res) => {
    const d = new OrderDetail(req.body);
    await d.save(); 
    res.status(201).json({ success: true, data: d });
};

exports.update = async (req, res) => {
    const item = await OrderDetail.findById(req.params.id);
    if (!item || item.isDeleted)
        return res.status(404).json({ message: 'OrderDetail not found' });

    Object.assign(item, req.body);
    await item.save();
    res.json({ success: true, data: item });
};

exports.softDelete = async (req, res) => {
    const d = await OrderDetail.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    );
    res.json({ success: true, data: d });
};
