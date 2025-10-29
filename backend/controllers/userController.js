const User = require('../models/userModel');

exports.getAll = async (req, res) => {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.json({ success: true, data: users });
};

exports.softDelete = async (req, res) => {
    const u = await User.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true }).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, data: u });
};
