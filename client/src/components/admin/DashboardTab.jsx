import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { printReceipt } from '../../utils/printReceipt';

const STATUS_CHIP = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  preparing: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'out-for-delivery': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  cancelled: 'bg-red/15 text-red border-red/30',
};

const STAT_CARDS = [
  ['pending', 'Pending', 'fa-hourglass-half', 'text-amber-400'],
  ['confirmed', 'Confirmed', 'fa-circle-check', 'text-blue-400'],
  ['preparing', 'Preparing', 'fa-fire-burner', 'text-orange-400'],
  ['out-for-delivery', 'On the Way', 'fa-motorcycle', 'text-purple-400'],
  ['delivered', 'Delivered', 'fa-flag-checkered', 'text-emerald-400'],
];

export default function DashboardTab({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([api.get('/orders/stats'), api.get('/orders')])
      .then(([s, orders]) => {
        setStats(s);
        setRecent(orders.slice(0, 8));
      })
      .catch(() => showToast('Could not load dashboard data', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) return <p className="text-white/40">Loading dashboard…</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold">Dashboard</h2>
        <p className="text-white/50 text-sm mt-1">A quick look at how things are going right now.</p>
      </div>

      {/* Revenue highlight */}
      <div className="bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/25 rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">Total Revenue (Delivered Orders)</p>
          <p className="text-4xl font-extrabold text-gold mt-1">Rs. {(stats?.revenue || 0).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('orders')} className="bg-gold text-bg font-bold px-4 py-2.5 rounded-xl text-sm hover:brightness-110 transition">
            <i className="fa-solid fa-receipt mr-2" /> Manage Orders
          </button>
          <button onClick={() => onNavigate('analytics')} className="border border-gold/40 text-gold px-4 py-2.5 rounded-xl text-sm hover:bg-gold/10 transition">
            <i className="fa-solid fa-chart-line mr-2" /> Full Analytics
          </button>
        </div>
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map(([key, label, icon, color]) => (
          <button
            key={key}
            onClick={() => onNavigate('orders')}
            className="bg-bg2 border border-white/10 rounded-2xl p-4 text-center hover:border-gold/30 transition"
          >
            <i className={`fa-solid ${icon} text-xl ${color} mb-2`} />
            <p className="text-2xl font-extrabold">{stats?.[key] ?? 0}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <button onClick={() => onNavigate('menu')} className="bg-bg2 border border-white/10 rounded-2xl p-4 text-left hover:border-gold/30 transition">
          <i className="fa-solid fa-utensils text-gold text-lg mb-2" />
          <p className="font-semibold text-sm">Manage Menu</p>
          <p className="text-white/40 text-xs mt-0.5">Add, edit or hide dishes</p>
        </button>
        <button onClick={() => onNavigate('coupons')} className="bg-bg2 border border-white/10 rounded-2xl p-4 text-left hover:border-gold/30 transition">
          <i className="fa-solid fa-tag text-gold text-lg mb-2" />
          <p className="font-semibold text-sm">Create a Promo Code</p>
          <p className="text-white/40 text-xs mt-0.5">Run a discount campaign</p>
        </button>
        <button onClick={() => onNavigate('reservations')} className="bg-bg2 border border-white/10 rounded-2xl p-4 text-left hover:border-gold/30 transition">
          <i className="fa-solid fa-calendar-check text-gold text-lg mb-2" />
          <p className="font-semibold text-sm">Table Reservations</p>
          <p className="text-white/40 text-xs mt-0.5">Confirm upcoming bookings</p>
        </button>
      </div>

      {/* Recent orders */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Recent Orders</h3>
        <button onClick={() => onNavigate('orders')} className="text-gold text-sm font-semibold hover:underline">
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="bg-bg2 border border-white/10 rounded-2xl p-8 text-center text-white/40">No orders yet.</div>
      ) : (
        <div className="bg-bg2 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-left border-b border-white/10">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o._id} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-4">
                    <p className="font-semibold">{o.customerName}</p>
                    <p className="text-white/40 text-xs">#{String(o._id).slice(-6).toUpperCase()} · {o.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-gold font-bold">Rs. {o.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_CHIP[o.status]}`}>
                      {o.status.replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => printReceipt(o)} className="text-white/40 hover:text-gold">
                      <i className="fa-solid fa-print" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
