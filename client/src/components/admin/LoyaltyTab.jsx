import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function LoyaltyTab() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    api.get('/loyalty').then(setAccounts).catch(() => showToast('Could not load loyalty accounts', 'error')).finally(() => setLoading(false));
  }, [showToast]);

  const visible = accounts.filter(
    (a) => a.customerName?.toLowerCase().includes(search.toLowerCase()) || a.phone?.includes(search),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold">Loyalty Points</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="bg-bg3 border border-white/10 rounded-xl px-4 py-2 text-sm"
        />
      </div>

      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-white/40">No loyalty accounts yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-left border-b border-white/10">
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Points</th>
                <th className="py-2 pr-4">Total Orders</th>
                <th className="py-2 pr-4">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a) => (
                <tr key={a._id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-semibold">{a.customerName}</td>
                  <td className="py-3 pr-4 text-white/60">{a.phone}</td>
                  <td className="py-3 pr-4 text-gold font-bold">⭐ {a.points}</td>
                  <td className="py-3 pr-4">{a.totalOrders}</td>
                  <td className="py-3 pr-4">Rs. {a.totalSpent?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
