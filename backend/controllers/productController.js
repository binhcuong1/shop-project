const Product = require("../models/productModel");

exports.getAll = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 8, 100);
    const search = (req.query.search || "").trim();
    const sort =
        req.query.sort === "asc"
            ? { price: 1 }
            : req.query.sort === "desc"
                ? { price: -1 }
                : { createdAt: -1 };

    const filter = { isDeleted: false };
    if (search) filter.name = { $regex: search, $options: "i" };

    const [items, total] = await Promise.all([
        Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit),
        Product.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        },
    });
};

exports.getById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || product.isDeleted)
        return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, data: product });
};

exports.create = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) data.image = `/uploads/${req.file.filename}`;
        const p = new Product(data);
        await p.save();
        res.status(201).json({ success: true, data: p });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) data.image = `/uploads/${req.file.filename}`;
        const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!p) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, data: p });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.softDelete = async (req, res) => {
    const p = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    );
    res.json({ success: true, data: p });
};
