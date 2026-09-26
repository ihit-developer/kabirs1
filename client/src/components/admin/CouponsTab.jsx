import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';

const emptyForm = { code: '', type: 'percent', value: '', minOrder: '0', maxUses: '100', branch: 'all', expiresAt: '', active: true };

export default function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { showToast } = useToast();

  const load = () => {
    api.get('/coupons').then(setCoupons).catch(() => showToast('Could not load coupons', 'error')).finally(() => setLoading(false));
  };
  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (c) => {
    setForm({ ...c, value: String(c.value), minOrder: String(c.minOrder), maxUses: String(c.maxUses), expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '' });
    setEditing(c._id);
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      value: Number(form.value),
      minOrder: Number(form.minOrder || 0),
      maxUses: Number(form.maxUses || 100),
      expiresAt: form.expiresAt || undefined,
    };
    try {
      if (editing === 'new') {
        const created = await api.post('/coupons', payload);
        setCoupons((prev) => [created, ...prev]);
        showToast('Coupon created', 'success');
      } else {
        const updated = await api.put(`/coupons/${editing}`, payload);
        setCoupons((prev) => prev.map((c) => (c._id === editing ? updated : c)));
        showToast('Coupon updated', 'success');
      }
      setEditing(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleActive = async (c) => {
    try {
      const updated = await api.put(`/coupons/${c._id}`, { active: !c.active });
      setCoupons((prev) => prev.map((x) => (x._id === c._id ? updated : x)));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await api.del(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold">Promo Codes</h2>
        <button onClick={openNew} className="bg-gold text-bg font-bold px-4 py-2 rounded-xl text-sm hover:brightness-110">
          + New Coupon
        </button>
      </div>

      {loading ? (
        <p className="text-white/40">Loading coupons…</p>
      ) : coupons.length === 0 ? (
        <p className="text-white/40">No coupons yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-left border-b border-white/10">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Discount</th>
                <th className="py-2 pr-4">Min Order</th>
                <th className="py-2 pr-4">Used / Max</th>
                <th className="py-2 pr-4">Branch</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono text-gold font-bold">{c.code}</td>
                  <td className="py-3 pr-4">{c.type === 'percent' ? `${c.value}%` : `Rs.${c.value}`}</td>
                  <td className="py-3 pr-4">Rs.{c.minOrder}</td>
                  <td className="py-3 pr-4">{c.usedCount} / {c.maxUses}</td>
                  <td className="py-3 pr-4 capitalize">{c.branch}</td>
                  <td className="py-3 pr-4">
                    <button onClick={() => toggleActive(c)} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-white/50 hover:text-gold"><i className="fa-solid fa-pen" /></button>
                      <button onClick={() => remove(c._id)} className="text-white/50 hover:text-red"><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditing(null)} />
          <form onSubmit={save} className="relative bg-bg2 rounded-3xl max-w-md w-full p-6 space-y-3 animate-scaleIn">
            <h3 className="font-semibold text-lg mb-2">{editing === 'new' ? 'New Coupon' : 'Edit Coupon'}</h3>
            <input required placeholder="Code e.g. KABIR20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm uppercase" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm">
                <option value="percent">% Percent Off</option>
                <option value="fixed">Rs. Fixed Off</option>
              </select>
              <input required type="number" min="0" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min="0" placeholder="Min Order (Rs.)" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className="bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
              <input type="number" min="1" placeholder="Max Uses" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm">
              <option value="all">All branches</option>
              <option value="cantt">Cantt only</option>
              <option value="hayatabad">Hayatabad only</option>
            </select>
            <div>
              <label className="text-xs text-white/50 block mb-1">Expires (optional)</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-gold w-4 h-4" />
              Active
            </label>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 border border-white/15 rounded-xl py-2.5 text-sm hover:bg-white/5">Cancel</button>
              <button type="submit" className="flex-1 bg-gold text-bg font-bold rounded-xl py-2.5 text-sm hover:brightness-110">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
