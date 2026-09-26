// Run once to create/reset the admin login: node server/config/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'kabir1234';

  const passwordHash = await Admin.hashPassword(password);

  await Admin.findOneAndUpdate(
    { username },
    { username, passwordHash, name: "Kabir's Admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`✅ Admin account ready — username: "${username}"`);
  console.log('   Set ADMIN_USERNAME / ADMIN_PASSWORD in .env before running this to choose your own credentials.');
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
