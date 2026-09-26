const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  type:        { type: String, enum: ['percent','fixed'], default: 'percent' },
  value:       { type: Number, required: true },        // 20 = 20% off OR Rs.200 off
  minOrder:    { type: Number, default: 0 },            // min order to apply
  maxUses:     { type: Number, default: 100 },
  usedCount:   { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
  expiresAt:   { type: Date },
  branch:      { type: String, default: 'all' },        // 'all', 'cantt', 'hayatabad'
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
