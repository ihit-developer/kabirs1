const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone:        { type: String, required: true },
  email:        { type: String, default: '' },
  date:         { type: String, required: true },   // YYYY-MM-DD
  time:         { type: String, required: true },   // HH:MM
  guests:       { type: Number, required: true, min: 1 },
  tableNumber:  { type: String, default: '' },
  notes:        { type: String, default: '' },
  status:       { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  branch:       { type: String, default: 'cantt', enum: ['cantt','hayatabad'] },
}, { timestamps: true });
module.exports = mongoose.model('Reservation', reservationSchema);
