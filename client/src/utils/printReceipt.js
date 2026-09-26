function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const Rs = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

/**
 * Opens a small print-ready window with a formatted receipt for the given
 * order and triggers the browser's print dialog. Must be called directly
 * from a user click handler (not after an `await`) so popup blockers allow it.
 */
export function printReceipt(order) {
  if (!order) return;
  const w = window.open('', '_blank', 'width=400,height=640');
  if (!w) {
    alert('Please allow pop-ups to print the receipt.');
    return;
  }

  const shortId = String(order._id || '').slice(-6).toUpperCase();
  const date = new Date(order.createdAt || Date.now()).toLocaleString();
  const items = order.items || [];

  const itemRows = items
    .map(
      (i) => `
      <tr>
        <td>${esc(i.name)}</td>
        <td class="c">x${i.qty}</td>
        <td class="r">${Rs(i.price * i.qty)}</td>
      </tr>`,
    )
    .join('');

  const extraRows = [
    order.discount ? ['Coupon Discount', `- ${Rs(order.discount)}`] : null,
    order.loyaltyDiscount ? ['Loyalty Discount', `- ${Rs(order.loyaltyDiscount)}`] : null,
  ]
    .filter(Boolean)
    .map(([label, val]) => `<tr><td colspan="2">${esc(label)}</td><td class="r">${esc(val)}</td></tr>`)
    .join('');

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Receipt #${shortId}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; color: #111; padding: 20px; max-width: 340px; margin: 0 auto; }
  h1 { font-size: 18px; text-align: center; margin: 0 0 2px; letter-spacing: .5px; }
  .sub { text-align: center; font-size: 11px; color: #555; margin-bottom: 14px; }
  .dash { border-top: 1px dashed #999; margin: 10px 0; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  td { padding: 3px 0; vertical-align: top; }
  td.c { text-align: center; white-space: nowrap; }
  td.r { text-align: right; white-space: nowrap; }
  .meta { font-size: 12px; margin-bottom: 10px; }
  .meta div { display: flex; justify-content: space-between; margin-bottom: 2px; }
  .total-row td { font-weight: bold; font-size: 14px; padding-top: 8px; }
  .footer { text-align: center; font-size: 11px; color: #555; margin-top: 16px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>Kabir's Restaurant</h1>
  <div class="sub">${esc(order.branch === 'hayatabad' ? 'Hayatabad Branch' : 'Cantt Branch')}, Peshawar</div>

  <div class="meta">
    <div><span>Receipt #</span><strong>${shortId}</strong></div>
    <div><span>Date</span><span>${esc(date)}</span></div>
    <div><span>Customer</span><span>${esc(order.customerName)}</span></div>
    <div><span>Phone</span><span>${esc(order.phone)}</span></div>
    <div><span>Order Type</span><span>${esc((order.orderType || 'delivery').replace(/-/g, ' '))}</span></div>
    ${order.address ? `<div><span>Address</span><span style="text-align:right;max-width:200px">${esc(order.address)}</span></div>` : ''}
  </div>

  <div class="dash"></div>

  <table>
    <thead>
      <tr><td><strong>Item</strong></td><td class="c"><strong>Qty</strong></td><td class="r"><strong>Price</strong></td></tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="dash"></div>

  <table>
    <tr><td colspan="2">Subtotal</td><td class="r">${Rs(order.subtotal ?? order.total)}</td></tr>
    ${extraRows}
    <tr class="total-row"><td colspan="2">Total</td><td class="r">${Rs(order.total)}</td></tr>
  </table>

  <div class="dash"></div>
  <div class="meta">
    <div><span>Payment</span><span>${esc((order.paymentMethod || 'cod').toUpperCase())}</span></div>
    ${order.couponCode ? `<div><span>Coupon</span><span>${esc(order.couponCode)}</span></div>` : ''}
  </div>

  <div class="footer">
    Thank you for ordering from Kabir's Restaurant!<br />
    For queries, call +92 332-9152885
  </div>

  <script>
    window.onload = function () {
      window.print();
    };
  </script>
</body>
</html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}
