import { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { printReceipt } from '../../utils/printReceipt';

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

const STATUS_META = {
  pending: { label: 'Pending', dot: 'bg-amber-400', chip: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  confirmed: { label: 'Confirmed', dot: 'bg-blue-400', chip: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  preparing: { label: 'Preparing', dot: 'bg-orange-400', chip: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  'out-for-delivery': { label: 'On the Way', dot: 'bg-purple-400', chip: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  delivered: { label: 'Delivered', dot: 'bg-emerald-400', chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', dot: 'bg-red', chip: 'bg-red/15 text-red border-red/30' },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [live, setLive] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(() => {
    api
      .get('/orders')
      .then(setOrders)
      .catch(() => showToast('Could not load orders', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    load();
    const token = localStorage.getItem('kabir_admin_token');
    const es = new EventSource(`/api/orders/stream?token=${encodeURIComponent(token || '')}`);
    es.addEventListener('connected', () => setLive(true));
    es.onmessage = () => load();
    es.onerror = () => setLive(false);
    return () => es.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    STATUS_FLOW.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length; });
    return c;
  }, [orders]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      showToast(`Order marked as ${status.replace(/-/g, ' ')}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const setEstimate = async (id) => {
    const mins = prompt('Estimated delivery time (minutes)?');
    if (!mins || isNaN(mins)) return;
    try {
      const updated = await api.put(`/orders/${id}/status`, { status: orders.find((o) => o._id === id).status, estimatedTime: Number(mins) });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      showToast('Estimated time set', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const setKitchenNote = async (id, current) => {
    const note = prompt('Kitchen note for this order:', current || '');
    if (note === null) return;
    try {
      const updated = await api.put(`/orders/${id}/kitchen-notes`, { kitchenNotes: note });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const verifyPayment = async (id) => {
    try {
      const updated = await api.put(`/orders/${id}/verify-payment`, { paymentVerified: true });
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      showToast('Payment marked as verified', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const removeOrder = async (id) => {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
      await api.del(`/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const visible = orders
    .filter((o) => filter === 'all' || o.status === filter)
    .filter((o) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        String(o._id).slice(-6).toLowerCase().includes(q)
      );
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">Order Management</h2>
          <p className="text-white/50 text-sm flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${live ? 'bg-emerald-400 animate-pulseSoft' : 'bg-white/20'}`} />
            {live ? 'Live updates connected' : 'Connecting…'}
          </p>
        </div>
      </div>

      {/* Status filter chips with live counts */}
      <div className="flex flex-wrap gap-2 my-5">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition ${
            filter === 'all' ? 'bg-gold text-bg border-gold' : 'border-white/15 text-white/70 hover:border-white/30'
          }`}
        >
          All <span className="opacity-70">({counts.all})</span>
        </button>
        {STATUS_FLOW.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition ${
              filter === s ? 'bg-gold text-bg border-gold' : 'border-white/15 text-white/70 hover:border-white/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${STATUS_META[s].dot}`} />
            {STATUS_META[s].label} <span className="opacity-70">({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      <div className="relative mb-5">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or order ID…"
          className="w-full max-w-md bg-bg3 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-gold/50"
        />
      </div>

      {loading ? (
        <p className="text-white/40">Loading orders…</p>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 bg-bg2 border border-white/10 rounded-2xl">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-white/50">No orders match this view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((o) => {
            const meta = STATUS_META[o.status];
            const isNew = o.status === 'pending' && Date.now() - new Date(o.createdAt).getTime() < 5 * 60000;
            const isOpen = expanded === o._id;
            return (
              <div
                key={o._id}
                className={`bg-bg2 border rounded-2xl overflow-hidden transition ${
                  isNew ? 'border-gold/50 shadow-[0_0_0_1px_rgba(240,193,75,.25)]' : 'border-white/10'
                }`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : o._id)}
                  className="w-full flex flex-wrap items-center justify-between gap-3 p-4 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dot}`} />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {o.customerName}{' '}
                        {isNew && (
                          <span className="ml-1 text-[10px] font-bold bg-gold text-bg px-1.5 py-0.5 rounded-full align-middle">NEW</span>
                        )}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">
                        #{String(o._id).slice(-6).toUpperCase()} · {o.phone} · {timeAgo(o.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-gold font-bold">Rs. {o.total.toLocaleString()}</span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap ${meta.chip}`}>
                      {meta.label}
                    </span>
                    <i className={`fa-solid fa-chevron-down text-white/30 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-white/10 pt-4">
                    <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-white/40 text-xs mb-1">Delivery / Type</p>
                        <p className="text-white/80">{o.address || o.orderType} · {o.branch} branch</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-1">Payment</p>
                        <p className="text-white/80 capitalize">
                          {o.paymentMethod}{' '}
                          {o.paymentMethod !== 'cod' && (
                            <span className={o.paymentVerified ? 'text-emerald-400' : 'text-amber-400'}>
                              {o.paymentVerified ? '✅ verified' : '⏳ unverified'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="bg-bg3 rounded-xl p-3 mb-4 text-sm space-y-1">
                      {o.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-white/70">
                          <span>{it.name} ×{it.qty}</span>
                          <span>Rs.{it.price * it.qty}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold pt-2 mt-1 border-t border-white/10">
                        <span>Total</span>
                        <span className="text-gold">Rs. {o.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {o.kitchenNotes && (
                      <p className="text-xs text-white/60 bg-white/5 border border-white/10 rounded-lg p-2.5 mb-4">
                        📝 <strong>Kitchen Note:</strong> {o.kitchenNotes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {o.paymentMethod !== 'cod' && !o.paymentVerified && (
                        <button onClick={() => verifyPayment(o._id)} className="text-xs font-semibold text-emerald-400 border border-emerald-400/30 px-3 py-1.5 rounded-full hover:bg-emerald-400/10">
                          <i className="fa-solid fa-check mr-1" /> Verify Payment
                        </button>
                      )}
                      <button onClick={() => printReceipt(o)} className="text-xs font-semibold text-gold border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold hover:text-bg transition">
                        <i className="fa-solid fa-print mr-1" /> Print Receipt
                      </button>
                      <button onClick={() => setKitchenNote(o._id, o.kitchenNotes)} className="text-xs font-semibold text-white/60 border border-white/15 px-3 py-1.5 rounded-full hover:bg-white/5">
                        <i className="fa-solid fa-note-sticky mr-1" /> Note
                      </button>
                      <button onClick={() => setEstimate(o._id)} className="text-xs font-semibold text-white/60 border border-white/15 px-3 py-1.5 rounded-full hover:bg-white/5">
                        <i className="fa-solid fa-clock mr-1" /> Set ETA
                      </button>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="text-xs font-semibold bg-bg3 border border-white/15 rounded-full px-3 py-1.5"
                      >
                        {STATUS_FLOW.map((s) => (
                          <option key={s} value={s}>{STATUS_META[s].label}</option>
                        ))}
                      </select>
                      <button onClick={() => removeOrder(o._id)} className="text-xs font-semibold text-red border border-red/30 px-3 py-1.5 rounded-full hover:bg-red/10 ml-auto">
                        <i className="fa-solid fa-trash mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
