const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '2h' }
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: 'username, email, password are required' });

    const existed = await User.findOne({ $or: [{ username }, { email }] });
    if (existed) return res.status(400).json({ message: 'Username or email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: role === 'admin' ? 'admin' : 'user',
    });

    const token = signToken(user);
    res.status(201).json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'username & password are required' });

    const user = await User.findOne({ username, isDeleted: false });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid username or password' });

    const token = signToken(user);
    res.json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user || user.isDeleted) return res.status(404).json({ message: 'User not found' });
    res.json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
