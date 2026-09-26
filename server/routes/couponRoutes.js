const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { requireAdmin } = require('../middleware/auth');

// POST /api/coupons/validate — customer validates coupon at checkout
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal, branch } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon code' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ message: 'This coupon has expired' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (coupon.branch !== 'all' && coupon.branch !== branch) return res.status(400).json({ message: `This coupon is only valid at ${coupon.branch} branch` });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ message: `Minimum order of Rs.${coupon.minOrder} required` });
    const discount = coupon.type === 'percent' ? Math.round(orderTotal * coupon.value / 100) : coupon.value;
    res.json({ valid: true, coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/coupons — admin: list all
router.get('/', requireAdmin, async (req, res) => {
  try {
    res.json(await Coupon.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/coupons — admin: create
router.post('/', requireAdmin, async (req, res) => {
  try {
    const c = new Coupon({ ...req.body, code: (req.body.code || '').toUpperCase().trim() });
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/coupons/:id — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const c = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/coupons/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
