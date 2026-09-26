// server/config/seedAdmin.js
// Run: node server/config/seedAdmin.js

require("dotenv").config();

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function seedAdmin() {
  try {
    // Check required environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in environment variables.");
    }

    const username = (process.env.ADMIN_USERNAME || "admin")
      .toLowerCase()
      .trim();

    const password = process.env.ADMIN_PASSWORD || "kabir1234";

    if (!username || !password) {
      throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required.");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    // Hash password
    const passwordHash = await Admin.hashPassword(password);

    // Create or update admin
    const admin = await Admin.findOneAndUpdate(
      { username },
      {
        username,
        passwordHash,
        name: "Kabir's Admin",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    console.log("✅ Admin account created/updated successfully");
    console.log(`Username: ${admin.username}`);

    await mongoose.disconnect();

    console.log("✅ MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Admin seeding failed:", error.message);

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // Ignore disconnect errors
    }

    process.exit(1);
  }
}

seedAdmin();
