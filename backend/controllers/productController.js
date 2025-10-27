const Product = require('../models/productModel');

exports.getAll = async (req, res) => {
    const products = await Product.find({ isDeleted: false });
    res.json({ success: true, data: products });
};

exports.getById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted)
        return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: product });
};

exports.create = async (req, res) => {
    const p = new Product(req.body);
    await p.save();
    res.status(201).json({ success: true, data: p });
};

exports.update = async (req, res) => {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: p });
};

exports.softDelete = async (req, res) => {
    const p = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.json({ success: true, data: p });
};
