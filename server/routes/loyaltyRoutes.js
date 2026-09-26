const express = require('express');
const router = express.Router();
const Loyalty = require('../models/Loyalty');
const { requireAdmin } = require('../middleware/auth');

// GET /api/loyalty/:phone — public: customer looks up their own points
router.get('/:phone', async (req, res) => {
  try {
    const phone = req.params.phone.replace(/\s/g, '');
    let acc = await Loyalty.findOne({ phone });
    if (!acc) acc = { phone, points: 0, totalSpent: 0, totalOrders: 0 };
    res.json(acc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/loyalty — admin: all accounts
router.get('/', requireAdmin, async (req, res) => {
  try {
    res.json(await Loyalty.find().sort({ points: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
