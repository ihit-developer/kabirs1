import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api';

const TIME_SLOTS = ['12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10];

const initial = {
  branch: 'cantt', customerName: '', phone: '', email: '',
  date: '', time: '', guests: 2, notes: '',
};

export default function Reserve() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customerName.trim() || !form.phone.trim() || !form.date || !form.time) {
      setError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await api.post('/reservations', { ...form, guests: Number(form.guests) });
      setConfirmed(data.reservation);
    } catch (err) {
      setError(err.message || 'Could not book the table. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white">
      <div className="max-w-2xl mx-auto px-4 py-14">
        <Link to="/" className="text-white/50 hover:text-gold text-sm inline-flex items-center gap-2 mb-6">
          <i className="fa-solid fa-arrow-left" /> Back to Home
        </Link>

        <div className="text-center mb-8">
          <span className="text-4xl">🪑</span>
          <h1 className="font-serif text-3xl font-bold mt-2">
            Reserve a <span className="text-gold">Table</span>
          </h1>
          <p className="text-white/50 mt-1">Book ahead and skip the wait at Kabir's Restaurant.</p>
        </div>

        {confirmed ? (
          <div className="bg-bg2 border border-emerald-500/30 rounded-3xl p-8 text-center animate-scaleIn">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="font-serif text-2xl font-bold mb-2">Table Booked!</h2>
            <p className="text-white/60 mb-4">
              We'll call you on <strong className="text-white">{confirmed.phone}</strong> to confirm within 30 minutes.
            </p>
            <div className="bg-bg3 rounded-xl p-4 text-sm text-white/70 inline-block">
              Reservation ID: <span className="text-gold font-mono">{String(confirmed._id).slice(-8).toUpperCase()}</span>
            </div>
            <div className="mt-6">
              <Link to="/" className="bg-gold text-bg font-bold px-6 py-3 rounded-full hover:brightness-110 transition">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-bg2 border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">
            <div>
              <label className="text-sm font-semibold block mb-2">Select Branch</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['cantt', '🏛️ Cantt Branch', 'Saddar, Peshawar Cantt'],
                  ['hayatabad', '🌆 Hayatabad Branch', 'Phase 1, Hayatabad'],
                ].map(([val, label, addr]) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setForm((f) => ({ ...f, branch: val }))}
                    className={`text-left p-3 rounded-xl border transition ${
                      form.branch === val ? 'bg-gold/10 border-gold' : 'border-white/15 hover:border-gold/40'
                    }`}
                  >
                    <div className="font-semibold text-sm">{label}</div>
                    <div className="text-white/40 text-xs mt-0.5">{addr}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Full Name *</label>
                <input value={form.customerName} onChange={set('customerName')} required placeholder="Your name" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Phone *</label>
                <input value={form.phone} onChange={set('phone')} required placeholder="03xx-xxxxxxx" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Email <span className="text-white/40 font-normal">(optional)</span>
              </label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Date *</label>
                <input type="date" min={today} value={form.date} onChange={set('date')} required className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Time *</label>
                <select value={form.time} onChange={set('time')} required className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50">
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Number of Guests</label>
              <div className="flex flex-wrap gap-2">
                {GUEST_OPTIONS.map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setForm((f) => ({ ...f, guests: g }))}
                    className={`w-11 h-11 rounded-full text-sm font-semibold border transition ${
                      Number(form.guests) === g ? 'bg-gold text-bg border-gold' : 'border-white/15 text-white/70 hover:border-gold/40'
                    }`}
                  >
                    {g === 10 ? '10+' : g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Special Requests <span className="text-white/40 font-normal">(optional)</span>
              </label>
              <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Birthday celebration, dietary requirements, window seat…" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
            </div>

            {error && <p className="text-red text-sm">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full bg-gold text-bg font-bold py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-60">
              {submitting ? 'Booking…' : '🪑 Book My Table'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
