const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ['BBQ','Fast Food','Pizza','Chinese','Desi','Desserts','Drinks'], index: true },
  price:       { type: Number, required: true, min: 0 },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  available:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
