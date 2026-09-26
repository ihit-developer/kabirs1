const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // Use App Password for Gmail
    }
  });
};

// Send email to customer when order is placed
const sendOrderConfirmationEmail = async (order) => {
  if (!process.env.EMAIL_USER) return; // Skip if email not configured

  const transporter = createTransporter();

  const itemsTable = order.items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">Rs. ${(item.price * item.qty).toFixed(0)}</td>
    </tr>`
  ).join('');

  // Email to customer
  await transporter.sendMail({
    from: `"Kabir's Restaurant" <${process.env.EMAIL_USER}>`,
    to: order.email || process.env.ADMIN_EMAIL,
    subject: `✅ Order Confirmed - #${order._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #ddd;">
        <div style="background:#c0392b;padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Kabir's Restaurant</h1>
          <p style="color:#ffd;margin:4px 0 0;">Your order has been placed!</p>
        </div>
        <div style="padding:24px;">
          <p>Dear <strong>${order.customerName}</strong>,</p>
          <p>Thank you for your order! We've received it and are preparing it for you.</p>

          <div style="background:#f9f9f9;border-radius:6px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 8px;font-weight:bold;">Order ID: #${order._id.toString().slice(-6).toUpperCase()}</p>
            <p style="margin:0;color:#666;">Payment: Cash on Delivery</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <thead>
              <tr style="background:#f0f0f0;">
                <th style="padding:8px;text-align:left;">Item</th>
                <th style="padding:8px;text-align:center;">Qty</th>
                <th style="padding:8px;text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsTable}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px 8px;font-weight:bold;text-align:right;">Total:</td>
                <td style="padding:12px 8px;font-weight:bold;text-align:right;color:#c0392b;">Rs. ${order.total}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background:#fff8e1;border-left:4px solid #f39c12;padding:12px 16px;border-radius:4px;">
            <p style="margin:0;"><strong>Delivery Address:</strong><br>${order.address}</p>
          </div>
        </div>
        <div style="background:#f5f5f5;padding:16px;text-align:center;color:#999;font-size:13px;">
          Kabir's Restaurant — Delivering happiness to your door
        </div>
      </div>
    `
  });

  // Email to admin/restaurant
  await transporter.sendMail({
    from: `"Kabir's Restaurant System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛎️ New Order Received - #${order._id.toString().slice(-6).toUpperCase()} (Rs. ${order.total})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
        <div style="background:#2c3e50;padding:20px;text-align:center;">
          <h2 style="color:#fff;margin:0;">🛎️ New Order Alert</h2>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;color:#666;">Customer</td><td style="padding:8px;font-weight:bold;">${order.customerName}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Phone</td><td style="padding:8px;font-weight:bold;">${order.phone}</td></tr>
            <tr><td style="padding:8px;color:#666;">Address</td><td style="padding:8px;">${order.address}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;">Total</td><td style="padding:8px;font-weight:bold;color:#c0392b;">Rs. ${order.total}</td></tr>
          </table>
          <h3 style="margin-top:20px;">Items Ordered:</h3>
          <ul>${order.items.map(i => `<li>${i.name} × ${i.qty} — Rs. ${i.price * i.qty}</li>`).join('')}</ul>
          <div style="text-align:center;margin-top:24px;">
            <a href="${process.env.SITE_URL || 'http://localhost:5000'}/admin.html"
               style="background:#27ae60;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block;">
              Open Admin Panel →
            </a>
          </div>
        </div>
      </div>
    `
  });
};

// Send status update email to customer
const sendStatusUpdateEmail = async (order) => {
  if (!order.email || !process.env.EMAIL_USER) return;

  const transporter = createTransporter();

  const statusMessages = {
    confirmed:        { emoji: '✅', text: 'Your order has been confirmed!',     color: '#27ae60' },
    preparing:        { emoji: '👨‍🍳', text: 'Your food is being prepared!',      color: '#e67e22' },
    'out-for-delivery': { emoji: '🚴', text: 'Your order is on the way!',         color: '#2980b9' },
    delivered:        { emoji: '🎉', text: 'Your order has been delivered!',      color: '#27ae60' },
    cancelled:        { emoji: '❌', text: 'Your order has been cancelled.',      color: '#e74c3c' }
  };

  const info = statusMessages[order.status];
  if (!info) return;

  await transporter.sendMail({
    from: `"Kabir's Restaurant" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `${info.emoji} Order Update - #${order._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
        <div style="background:${info.color};padding:24px;text-align:center;">
          <div style="font-size:48px;">${info.emoji}</div>
          <h2 style="color:#fff;margin:8px 0 0;">${info.text}</h2>
        </div>
        <div style="padding:24px;text-align:center;">
          <p>Hi <strong>${order.customerName}</strong>,</p>
          <p>Order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> status: <strong style="color:${info.color};">${order.status.toUpperCase()}</strong></p>
          <p style="color:#666;">Thank you for choosing Kabir's Restaurant!</p>
        </div>
      </div>
    `
  });
};

// exports at bottom

// Feature 4: Daily Sales Report Email
const sendDailySalesReport = async ({ total, delivered, cancelled, revenue, topItems }) => {
  if (!process.env.EMAIL_USER || !process.env.ADMIN_EMAIL) return;
  const transporter = createTransporter();
  const today = new Date().toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const topItemsHtml = topItems.map(([name, qty], i) =>
    `<tr style="background:${i%2===0?'#f9f9f9':'#fff'}">
      <td style="padding:8px 12px">${i+1}. ${name}</td>
      <td style="padding:8px 12px;text-align:center;font-weight:700">${qty}</td>
    </tr>`
  ).join('');
  await transporter.sendMail({
    from: `"Kabir's Restaurant" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📊 Daily Sales Report — ${today}`,
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#e11d48,#f43f5e);padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:22px">🍽️ Kabir's Restaurant</h1>
        <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">Daily Sales Report — ${today}</p>
      </div>
      <div style="padding:24px">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px">
          <div style="background:#fff1f2;border-radius:10px;padding:16px;text-align:center">
            <div style="font-size:28px;font-weight:900;color:#e11d48">${total}</div>
            <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:4px">Total Orders</div>
          </div>
          <div style="background:#ecfdf5;border-radius:10px;padding:16px;text-align:center">
            <div style="font-size:28px;font-weight:900;color:#059669">${delivered}</div>
            <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:4px">Delivered</div>
          </div>
          <div style="background:#f5f3ff;border-radius:10px;padding:16px;text-align:center">
            <div style="font-size:22px;font-weight:900;color:#7c3aed">Rs.${revenue.toLocaleString()}</div>
            <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:4px">Revenue</div>
          </div>
        </div>
        ${topItems.length ? `
        <h3 style="font-size:14px;color:#0f172a;margin-bottom:10px">🏆 Top Selling Items Today</h3>
        <table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden">
          <thead><tr style="background:#0f172a;color:#fff"><th style="padding:9px 12px;text-align:left;font-size:12px">Item</th><th style="padding:9px 12px;text-align:center;font-size:12px">Qty Sold</th></tr></thead>
          <tbody>${topItemsHtml}</tbody>
        </table>` : ''}
        <p style="margin-top:20px;color:#64748b;font-size:12px">Cancelled orders today: <strong>${cancelled}</strong></p>
      </div>
    </div>`
  });
};

module.exports = { sendOrderConfirmationEmail, sendStatusUpdateEmail, sendDailySalesReport };
