// Simple Server-Sent Events broadcaster for real-time admin notifications.
// When a new order is placed, call notifyNewOrder(order) and every connected
// admin browser tab gets pushed an event instantly (no polling delay).

let clients = [];

function addClient(res) {
  clients.push(res);
}

function removeClient(res) {
  clients = clients.filter(c => c !== res);
}

function broadcast(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach(res => {
    try { res.write(payload); } catch (e) { /* client disconnected */ }
  });
}

function notifyNewOrder(order) {
  broadcast('new_order', {
    id: order._id.toString(),
    shortId: order._id.toString().slice(-6).toUpperCase(),
    customerName: order.customerName,
    total: order.total,
    orderType: order.orderType || 'delivery',
  });
}

module.exports = { addClient, removeClient, broadcast, notifyNewOrder };