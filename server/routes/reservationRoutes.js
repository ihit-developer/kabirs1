const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { requireAdmin } = require('../middleware/auth');

// GET /api/reservations — admin: list (filterable)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch) filter.branch = req.query.branch;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.status) filter.status = req.query.status;
    res.json(await Reservation.find(filter).sort({ date: 1, time: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reservations — public: customer books a table
router.post('/', async (req, res) => {
  try {
    const r = new Reservation(req.body);
    await r.save();
    res.status(201).json({ message: 'Reservation confirmed', reservation: r });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/reservations/:id — admin: confirm/cancel
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const r = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/reservations/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
