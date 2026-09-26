const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  menuItemId:  { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  menuItemName:{ type: String, required: true },
  orderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  customerName:{ type: String, required: true },
  phone:       { type: String },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  comment:     { type: String, default: '' },
  branch:      { type: String, default: 'cantt' },
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
