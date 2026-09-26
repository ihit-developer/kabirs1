// Run once to seed sample coupons: node server/config/seedCoupons.js
require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Coupon.deleteMany({});
  await Coupon.insertMany([
    { code:'KABIR20',  type:'percent', value:20,  minOrder:500,  maxUses:100, active:true, branch:'all' },
    { code:'WELCOME',  type:'fixed',   value:100, minOrder:300,  maxUses:50,  active:true, branch:'all' },
    { code:'CANTT10',  type:'percent', value:10,  minOrder:0,    maxUses:200, active:true, branch:'cantt' },
    { code:'SAVE200',  type:'fixed',   value:200, minOrder:1000, maxUses:30,  active:true, branch:'all' },
  ]);
  console.log('✅ Coupons seeded: KABIR20, WELCOME, CANTT10, SAVE200');
  mongoose.disconnect();
}
seed().catch(console.error);
