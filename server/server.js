require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Every request waits for a ready DB connection (cached, so instant after
// the first call in a warm container) — this is the fix for menu/orders
// intermittently not showing.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err.message);
    res
      .status(503)
      .json({
        message:
          "Database temporarily unavailable — please try again in a moment",
      });
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use("/api/loyalty", require("./routes/loyaltyRoutes"));

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "Kabir's Restaurant API is running" });
});

app.get("/api", (req, res) => {
  res
    .status(200)
    .json({ message: "Welcome to Kabir's Restaurant API", status: "Running" });
});

// ======================================================
// SERVE REACT BUILD IN PRODUCTION
// ======================================================

const clientBuildPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPath));

app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) next();
  });
});

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res
    .status(404)
    .json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ======================================================
// LOCAL SERVER
// ======================================================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Kabir's Restaurant API running on port ${PORT}`);
  });
}

module.exports = app;
