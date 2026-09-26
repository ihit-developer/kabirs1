import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = ['BBQ', 'Fast Food', 'Pizza', 'Chinese', 'Desi', 'Desserts', 'Drinks'];

const emptyForm = { name: '', category: 'BBQ', price: '', description: '', image: '', available: true };

export default function MenuTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // item being edited, or 'new'
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const load = () => {
    api.get('/menu?all=true').then(setItems).catch(() => showToast('Could not load menu', 'error')).finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setForm(emptyForm); setEditing('new'); };
  const openEdit = (item) => { setForm({ ...item, price: String(item.price) }); setEditing(item._id); };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editing === 'new') {
        const created = await api.post('/menu', payload);
        setItems((prev) => [...prev, created]);
        showToast('Menu item added', 'success');
      } else {
        const updated = await api.put(`/menu/${editing}`, payload);
        setItems((prev) => prev.map((i) => (i._id === editing ? updated : i)));
        showToast('Menu item updated', 'success');
      }
      setEditing(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleAvailable = async (item) => {
    try {
      const updated = await api.put(`/menu/${item._id}`, { available: !item.available });
      setItems((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete food item?')) return;
    try {
      await api.del(`/menu/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
      showToast('Item deleted', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const visible = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold">Menu Items</h2>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-bg3 border border-white/10 rounded-xl px-4 py-2 text-sm"
          />
          <button onClick={openNew} className="bg-gold text-bg font-bold px-4 py-2 rounded-xl text-sm hover:brightness-110">
            + Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/40">Loading menu…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((item) => (
            <div key={item._id} className="bg-bg2 border border-white/10 rounded-2xl overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h6 className="font-semibold">{item.name}</h6>
                  <span className="text-gold font-bold text-sm">Rs.{item.price}</span>
                </div>
                <p className="text-white/40 text-xs mb-3">{item.category}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      item.available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red/20 text-red'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="text-white/50 hover:text-gold">
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button onClick={() => remove(item._id)} className="text-white/50 hover:text-red">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditing(null)} />
          <form onSubmit={save} className="relative bg-bg2 rounded-3xl max-w-md w-full p-6 space-y-3 animate-scaleIn">
            <h3 className="font-semibold text-lg mb-2">{editing === 'new' ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required type="number" min="0" placeholder="Price (Rs.)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            </div>
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-gold w-4 h-4" />
              Available
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
