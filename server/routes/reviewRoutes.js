const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Review = require('../models/Review');
const { requireAdmin } = require('../middleware/auth');

// GET /api/reviews?menuItemId=xxx — public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.menuItemId) filter.menuItemId = req.query.menuItemId;
    if (req.query.branch) filter.branch = req.query.branch;
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(50);
    const agg = await Review.aggregate([
      { $match: req.query.menuItemId ? { menuItemId: new mongoose.Types.ObjectId(req.query.menuItemId) } : {} },
      { $group: { _id: '$menuItemId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    res.json({ reviews, averages: agg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/averages — public: averages for all items (menu display)
router.get('/averages', async (req, res) => {
  try {
    const agg = await Review.aggregate([
      { $group: { _id: '$menuItemId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    res.json(agg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews — public: customer submits a review
router.post('/', async (req, res) => {
  try {
    const { menuItemId, menuItemName, orderId, customerName, phone, rating, comment, branch } = req.body;
    if (!menuItemId || !customerName || !rating) {
      return res.status(400).json({ message: 'menuItemId, customerName, rating required' });
    }
    const review = new Review({ menuItemId, menuItemName, orderId, customerName, phone, rating, comment, branch: branch || 'cantt' });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
