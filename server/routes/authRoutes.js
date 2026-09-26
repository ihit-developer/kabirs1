const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require('../models/Admin');
const { requireAdmin, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await admin.checkPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username },
      JWT_SECRET,
      { expiresIn: '12h' },
    );

    res.json({ token, admin: { username: admin.username, name: admin.name } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me — verify current token is still valid
router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
