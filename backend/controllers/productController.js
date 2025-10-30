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
    const p = new Product(req.body);
    await p.save();
    res.status(201).json({ success: true, data: p });
};

exports.update = async (req, res) => {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, data: p });
};

exports.softDelete = async (req, res) => {
    const p = await Product.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    );
    res.json({ success: true, data: p });
};
