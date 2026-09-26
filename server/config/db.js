const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MONGO_URI is not defined in .env file");
      return;
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log(
      "⚠️ Server will continue running, but database features will not work.",
    );
  }
};

module.exports = connectDB;
