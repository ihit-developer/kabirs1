const mongoose = require('mongoose');
const orderItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  qty:   { type: Number, required: true, min: 1 }
});
const orderSchema = new mongoose.Schema({
  customerName:    { type: String, required: true, trim: true },
  phone:           { type: String, required: true, trim: true },
  email:           { type: String, trim: true, default: '' },
  address:         { type: String, default: '' },
  items:           { type: [orderItemSchema], required: true },
  subtotal:        { type: Number, default: 0 },
  discount:        { type: Number, default: 0 },
  total:           { type: Number, required: true, min: 0 },
  couponCode:      { type: String, default: '' },
  loyaltyPointsEarned: { type: Number, default: 0 },
  loyaltyDiscount: { type: Number, default: 0 },
  paymentMethod:   { type: String, default: 'cod', enum: ['cod','jazzcash','easypaisa','bank-transfer'] },
  paymentDetails:  { type: Object, default: {} },       // card/easypaisa/jazzcash details
  paymentVerified: { type: Boolean, default: false },   // admin manually verified
  paymentNote:     { type: String, default: '' },        // admin note e.g. "Checked JazzCash"
  orderType:       { type: String, default: 'delivery', enum: ['delivery','takeaway','dine-in'] },
  tableNumber:     { type: String, default: '' },
  pickupTime:      { type: String, default: '' },
  branch:          { type: String, default: 'cantt', enum: ['cantt','hayatabad'] },
  status:          { type: String, default: 'pending', enum: ['pending','confirmed','preparing','out-for-delivery','delivered','cancelled'] },
  notes:           { type: String, default: '' },
  kitchenNotes:    { type: String, default: '' },
  estimatedTime:   { type: Number, default: 0 },
  estimatedSetAt:  { type: Date },
  feedbackRating:  { type: Number, min:1, max:5, default: null },
  feedbackComment: { type: String, default: '' },
  feedbackRequestedAt: { type: Date },
  whatsappSession: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
