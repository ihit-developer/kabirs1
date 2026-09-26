import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';

export default function ReservationsTab() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  const load = () => {
    api.get('/reservations').then(setReservations).catch(() => showToast('Could not load reservations', 'error')).finally(() => setLoading(false));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = async (id, status) => {
    try {
      const updated = await api.put(`/reservations/${id}`, { status });
      setReservations((prev) => prev.map((r) => (r._id === id ? updated : r)));
      showToast(`Reservation ${status}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this reservation?')) return;
    try {
      await api.del(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const visible = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold">Table Reservations</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-bg3 border border-white/10 rounded-xl px-4 py-2 text-sm">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <p className="text-white/40">Loading reservations…</p>
      ) : visible.length === 0 ? (
        <p className="text-white/40">No reservations found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((r) => (
            <div key={r._id} className="bg-bg2 border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-2">
                <h6 className="font-semibold">{r.customerName}</h6>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    r.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : r.status === 'cancelled' ? 'bg-red/20 text-red' : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-white/50 text-sm">{r.phone}</p>
              <p className="text-white/50 text-sm mt-1">
                📅 {r.date} at {r.time} · 👥 {r.guests} guests
              </p>
              <p className="text-white/40 text-xs mt-1 capitalize">{r.branch} branch</p>
              {r.notes && <p className="text-white/40 text-xs mt-2 italic">"{r.notes}"</p>}

              <div className="flex gap-2 mt-3">
                {r.status !== 'confirmed' && (
                  <button onClick={() => setStatus(r._id, 'confirmed')} className="flex-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 py-2 rounded-lg hover:bg-emerald-500/30">
                    Confirm
                  </button>
                )}
                {r.status !== 'cancelled' && (
                  <button onClick={() => setStatus(r._id, 'cancelled')} className="flex-1 text-xs font-semibold bg-red/20 text-red py-2 rounded-lg hover:bg-red/30">
                    Cancel
                  </button>
                )}
                <button onClick={() => remove(r._id)} className="text-white/40 hover:text-red px-2">
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
