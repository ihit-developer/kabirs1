const mongoose = require('mongoose');
const loyaltySchema = new mongoose.Schema({
  phone:        { type: String, required: true, unique: true, trim: true },
  customerName: { type: String, default: '' },
  points:       { type: Number, default: 0 },         // 1 point per Rs.10
  totalSpent:   { type: Number, default: 0 },
  totalOrders:  { type: Number, default: 0 },
  redeemedPoints: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Loyalty', loyaltySchema);
