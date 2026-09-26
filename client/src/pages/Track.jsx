import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/api';
import { printReceipt } from '../utils/printReceipt';

const STEPS = [
  { key: 'pending', icon: '🕐', label: 'Order Placed' },
  { key: 'confirmed', icon: '✅', label: 'Confirmed' },
  { key: 'preparing', icon: '👨‍🍳', label: 'Preparing' },
  { key: 'out-for-delivery', icon: '🚴', label: 'On the Way' },
  { key: 'delivered', icon: '🎉', label: 'Delivered' },
];
const STEP_KEYS = STEPS.map((s) => s.key);

function useCountdown(order) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!order?.estimatedTime || !order?.estimatedSetAt || ['delivered', 'cancelled'].includes(order.status)) {
      setRemaining(null);
      return;
    }
    const endAt = new Date(order.estimatedSetAt).getTime() + order.estimatedTime * 60000;
    const tick = () => setRemaining(Math.max(0, endAt - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [order]);

  if (remaining === null) return null;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function Track() {
  const [params] = useSearchParams();
  const [input, setInput] = useState(params.get('id') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);
  const idRef = useRef(null);

  const doTrack = async (raw) => {
    const id = (raw || '').trim().toLowerCase();
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/orders/track/${encodeURIComponent(id)}`);
      setOrder(data);
      idRef.current = id;
    } catch (err) {
      setOrder(null);
      setError(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('id')) doTrack(params.get('id'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!idRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const fresh = await api.get(`/orders/track/${encodeURIComponent(idRef.current)}`);
        setOrder(fresh);
      } catch (e) { /* silent */ }
    }, 30000);
    return () => clearInterval(pollRef.current);
  }, [order?._id]);

  const countdown = useCountdown(order);
  const statusIdx = order ? STEP_KEYS.indexOf(order.status) : -1;
  const cancelled = order?.status === 'cancelled';
  const Rs = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <span className="text-4xl">📦</span>
          <h1 className="font-serif text-3xl font-bold mt-2">
            Track Your <span className="text-gold">Order</span>
          </h1>
          <p className="text-white/50 mt-1 text-sm">Your order ID was shown after placing the order.</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); doTrack(input); }}
          className="flex gap-2 mb-8"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your Order ID (e.g. ABC123)"
            maxLength={24}
            className="flex-1 bg-bg2 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-gold/50"
          />
          <button type="submit" className="bg-gold text-bg font-bold px-6 rounded-full hover:brightness-110 transition">
            Track →
          </button>
        </form>

        {loading && (
          <div className="text-center py-10 text-white/40">
            <i className="fa-solid fa-spinner fa-spin text-2xl" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red/10 border border-red/30 text-red rounded-2xl p-5 text-center">
            ❌ {error}
            <br />
            <small className="opacity-60">Check your order ID and try again</small>
          </div>
        )}

        {!loading && order && (
          <div className="bg-bg2 border border-white/10 rounded-3xl p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-white/40 text-xs">Order ID</p>
                <p className="font-mono text-gold font-bold">{String(order._id).slice(-6).toUpperCase()}</p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  cancelled ? 'bg-red/20 text-red' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                {cancelled ? 'Cancelled' : order.status.replace(/-/g, ' ')}
              </span>
            </div>

            {!cancelled ? (
              <div className="flex justify-between mb-8 relative">
                {STEPS.map((s, i) => {
                  const done = i < statusIdx;
                  const active = i === statusIdx;
                  return (
                    <div key={s.key} className="flex-1 flex flex-col items-center relative z-10 text-center">
                      {i > 0 && (
                        <div
                          className={`absolute top-4 -left-1/2 w-full h-0.5 ${i <= statusIdx ? 'bg-gold' : 'bg-white/10'}`}
                          style={{ zIndex: -1 }}
                        />
                      )}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 ${
                          done || active ? 'bg-gold border-gold text-bg' : 'bg-bg3 border-white/15 text-white/40'
                        }`}
                      >
                        {s.icon}
                      </div>
                      <span className={`text-[10px] mt-2 ${done || active ? 'text-gold font-semibold' : 'text-white/30'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-red text-sm mb-6">This order was cancelled.</p>
            )}

            {countdown && (
              <div className="bg-gold/10 border border-gold/25 rounded-2xl p-4 text-center mb-5">
                <p className="text-xs text-white/50 mb-1">⏱️ Estimated Delivery Time</p>
                <p className="text-3xl font-extrabold text-gold font-mono">{countdown}</p>
                <p className="text-xs text-white/40 mt-1">minutes remaining</p>
              </div>
            )}

            {order.kitchenNotes && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm mb-5">
                📝 <strong>Kitchen Note:</strong> {order.kitchenNotes}
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Order Items</p>
                <button
                  onClick={() => printReceipt(order)}
                  className="text-xs font-semibold text-gold border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold hover:text-bg transition"
                >
                  <i className="fa-solid fa-print mr-1" /> Print Receipt
                </button>
              </div>
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm text-white/60 mb-1">
                  <span>{it.name} ×{it.qty}</span>
                  <span>{Rs(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 mt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-gold">{Rs(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <Link to="/" className="block text-center text-white/40 hover:text-gold text-sm mt-8">
          ← Back to Kabir's Restaurant
        </Link>
      </div>
    </div>
  );
}
