const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Loyalty = require("../models/Loyalty");
const {
  sendOrderConfirmationEmail,
  sendStatusUpdateEmail,
  sendDailySalesReport,
} = require("../config/email");
const {
  addClient,
  removeClient,
  notifyNewOrder,
} = require("../config/notifyStream");
const { requireAdmin } = require("../middleware/auth");

// GET /api/orders/stream — realtime new-order feed for the admin dashboard
router.get("/stream", requireAdmin, (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();
  res.write("event: connected\ndata: {}\n\n");
  addClient(res);
  req.on("close", () => removeClient(res));
});

// POST /api/orders — customer places an order
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      address,
      items,
      subtotal,
      total,
      couponCode,
      paymentMethod,
      paymentDetails,
      orderType,
      tableNumber,
      pickupTime,
      branch,
      notes,
      loyaltyRedeem,
    } = req.body;

    if (!customerName || !phone || !items?.length || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const type = orderType || "delivery";
    let effectiveAddress = address || "";
    if (type === "takeaway")
      effectiveAddress = pickupTime
        ? `Takeaway — Pickup at ${pickupTime}`
        : "Takeaway";
    if (type === "dine-in")
      effectiveAddress = tableNumber
        ? `Dine-In — Table ${tableNumber}`
        : "Dine-In";
    if (type === "delivery" && !effectiveAddress) {
      return res.status(400).json({ message: "Delivery address required" });
    }

    // Coupon: increment usedCount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
      });
      if (coupon && coupon.usedCount < coupon.maxUses) {
        coupon.usedCount += 1;
        await coupon.save();
        discount =
          coupon.type === "percent"
            ? Math.round(((subtotal || total) * coupon.value) / 100)
            : coupon.value;
      }
    }

    // Loyalty points: 1 point per Rs.10 spent
    const pointsEarned = Math.floor(total / 10);
    let loyaltyDiscount = 0;
    let acc = await Loyalty.findOne({ phone });
    if (!acc) acc = new Loyalty({ phone, customerName });
    if (loyaltyRedeem && acc.points >= 100) {
      const redeemSets = Math.floor(acc.points / 100);
      loyaltyDiscount = redeemSets * 50;
      acc.points = acc.points % 100;
      acc.redeemedPoints = (acc.redeemedPoints || 0) + redeemSets * 100;
    }
    acc.points += pointsEarned;
    acc.totalSpent += total;
    acc.totalOrders += 1;
    acc.customerName = customerName;
    await acc.save();

    const order = new Order({
      customerName,
      phone,
      email: email || "",
      address: effectiveAddress,
      items,
      subtotal: subtotal || total,
      discount,
      loyaltyDiscount,
      total,
      couponCode: couponCode || "",
      loyaltyPointsEarned: pointsEarned,
      paymentMethod: paymentMethod || "cod",
      paymentDetails: paymentDetails || {},
      orderType: type,
      tableNumber: tableNumber || "",
      pickupTime: pickupTime || "",
      branch: branch || "cantt",
      notes: notes || "",
    });
    await order.save();

    sendOrderConfirmationEmail(order).catch((e) =>
      console.error("Email:", e.message),
    );
    notifyNewOrder(order);

    res.status(201).json({
      message: "Order placed successfully",
      order,
      loyalty: { pointsEarned, totalPoints: acc.points, loyaltyDiscount },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders — admin: list orders
router.get("/", requireAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.branch) filter.branch = req.query.branch;
    res.json(await Order.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/stats — admin: dashboard analytics
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const branchFilter = req.query.branch ? { branch: req.query.branch } : {};
    const statuses = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];
    const counts = await Promise.all(
      statuses.map((s) => Order.countDocuments({ status: s, ...branchFilter })),
    );
    const stats = {};
    statuses.forEach((s, i) => {
      stats[s] = counts[i];
    });
    stats.total = counts.reduce((a, b) => a + b, 0);

    const rev = await Order.aggregate([
      { $match: { status: "delivered", ...branchFilter } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    stats.revenue = rev[0]?.total || 0;

    const sevenAgo = new Date();
    sevenAgo.setDate(sevenAgo.getDate() - 6);
    sevenAgo.setHours(0, 0, 0, 0);
    stats.weeklyChart = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: sevenAgo },
          ...branchFilter,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    stats.topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalQty: { $sum: "$items.qty" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/daily-report — admin: trigger a daily sales email
router.get("/daily-report", requireAdmin, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });
    const delivered = orders.filter((o) => o.status === "delivered");
    const revenue = delivered.reduce((s, o) => s + o.total, 0);
    const itemMap = {};
    delivered.forEach((o) =>
      o.items.forEach((i) => {
        itemMap[i.name] = (itemMap[i.name] || 0) + i.qty;
      }),
    );
    const topItems = Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    await sendDailySalesReport({
      total: orders.length,
      delivered: delivered.length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      revenue,
      topItems,
    });
    res.json({ message: "Report sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/track/:id — public: customer tracks by full or short order ID
router.get("/track/:id", async (req, res) => {
  try {
    const raw = String(req.params.id || "")
      .trim()
      .toLowerCase();
    let order = null;
    if (/^[0-9a-f]{24}$/.test(raw)) {
      order = await Order.findById(raw);
    } else {
      order = await Order.findOne({
        $expr: {
          $eq: [
            { $substrCP: [{ $toString: "$_id" }, 24 - raw.length, raw.length] },
            raw,
          ],
        },
      });
    }
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Invalid order ID" });
  }
});

// GET /api/orders/:id — admin: single order lookup
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status — admin: update order status
router.put("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, estimatedTime } = req.body;
    const update = { status };
    if (estimatedTime) {
      update.estimatedTime = estimatedTime;
      update.estimatedSetAt = new Date();
    }
    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ message: "Not found" });
    sendStatusUpdateEmail(order).catch((e) =>
      console.error("Email:", e.message),
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/orders/:id/verify-payment — admin: mark manual payment as verified
router.put("/:id/verify-payment", requireAdmin, async (req, res) => {
  try {
    const { paymentVerified, paymentNote, transactionId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    order.paymentVerified = paymentVerified;
    if (paymentNote) order.paymentNote = paymentNote;
    if (transactionId)
      order.paymentDetails = { ...order.paymentDetails, transactionId };
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/orders/:id/kitchen-notes — admin: internal kitchen notes
router.put("/:id/kitchen-notes", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { kitchenNotes: req.body.kitchenNotes },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/orders/:id — admin: generic update
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/orders/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
