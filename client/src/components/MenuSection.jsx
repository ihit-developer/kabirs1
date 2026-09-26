import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api';
import { FALLBACK_MENU } from '../data/fallbackMenu';
import FoodCard from './FoodCard';
import FoodModal from './FoodModal';

const CATEGORIES = [
  ['all', '🍽️ All'],
  ['BBQ', '🍖 BBQ'],
  ['Fast Food', '🍔 Fast Food'],
  ['Pizza', '🍕 Pizza'],
  ['Chinese', '🍜 Chinese'],
  ['Desi', '🍛 Desi'],
  ['Desserts', '🍮 Desserts'],
  ['Drinks', '🥤 Drinks'],
];

const PRICE_RANGES = [
  ['all', 'Any price'],
  ['0-200', 'Under Rs.200'],
  ['200-500', 'Rs.200 – 500'],
  ['500-1000', 'Rs.500 – 1000'],
  ['1000-99999', 'Rs.1000+'],
];

export default function MenuSection() {
  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    api
      .get('/menu')
      .then((data) => setItems(data && data.length ? data : FALLBACK_MENU))
      .catch(() => setItems(FALLBACK_MENU))
      .finally(() => setLoading(false));

    api
      .get('/reviews/averages')
      .then((data) => {
        const map = {};
        (data || []).forEach((r) => { map[String(r._id)] = { avg: r.avg, count: r.count }; });
        setRatings(map);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (item.available === false) return false;
      const matchCat = category === 'all' || item.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q);
      let matchPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        matchPrice = item.price >= min && item.price <= max;
      }
      return matchCat && matchSearch && matchPrice;
    });
  }, [items, category, search, priceRange]);

  return (
    <section id="menu" className="section-pad">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-gold text-xs font-bold uppercase tracking-widest">Our Menu</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            Featured <span className="text-gold">Food Menu</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search biryani, tikka, pizza..."
              className="w-full bg-bg3 border border-white/10 rounded-full py-3 pl-11 pr-10 text-sm focus:outline-none focus:border-gold/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-bg3 border border-white/10 rounded-full py-3 px-4 text-sm focus:outline-none focus:border-gold/50"
          >
            {PRICE_RANGES.map(([val, label]) => (
              <option key={val} value={val}>💰 {label}</option>
            ))}
          </select>

          <span className="text-white/40 text-sm whitespace-nowrap">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map(([val, label]) => (
            <button
              key={val}
              onClick={() => setCategory(val)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                category === val ? 'bg-gold text-bg' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-white/40">
            <i className="fa-solid fa-utensils fa-spin text-3xl mb-3" />
            <p>Loading menu…</p>
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <FoodCard
                key={item._id || item.id}
                item={item}
                rating={ratings[String(item._id || item.id)]}
                onOpen={setActiveItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-lg text-white/60">No items match your search.</p>
            <button
              onClick={() => { setSearch(''); setPriceRange('all'); setCategory('all'); }}
              className="mt-4 border border-gold/50 text-gold px-5 py-2 rounded-full hover:bg-gold hover:text-bg transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <FoodModal
        item={activeItem}
        rating={activeItem ? ratings[String(activeItem._id || activeItem.id)] : null}
        onClose={() => setActiveItem(null)}
      />
    </section>
  );
}
