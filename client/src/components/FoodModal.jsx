import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function FoodModal({ item, rating, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart, openCart } = useCart();

  useEffect(() => setQty(1), [item]);

  if (!item) return null;

  const handleAdd = () => {
    addToCart(item, qty);
    onClose();
    setTimeout(openCart, 250);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-bg2 rounded-3xl overflow-hidden max-w-2xl w-full grid md:grid-cols-2 animate-scaleIn shadow-deep">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        <div className="relative h-56 md:h-full">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-3 left-3 bg-bg/80 text-gold text-xs font-bold uppercase px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        <div className="p-6 flex flex-col">
          <h2 className="font-serif text-2xl font-bold mb-2">{item.name}</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gold text-xl font-bold">Rs. {item.price}</span>
            <span className={item.available === false ? 'text-red text-sm font-semibold' : 'text-emerald-400 text-sm font-semibold'}>
              {item.available === false ? '❌ Unavailable' : '✅ Available'}
            </span>
          </div>
          <p className="text-white/60 text-sm flex-1">
            {item.description || 'A delicious dish prepared fresh by our expert chefs.'}
          </p>

          {rating?.avg ? (
            <p className="text-sm text-gold mt-3">
              {'★'.repeat(Math.round(rating.avg))}
              {'☆'.repeat(5 - Math.round(rating.avg))}{' '}
              <span className="text-white/40">{rating.avg.toFixed(1)} ({rating.count} reviews)</span>
            </p>
          ) : (
            <p className="text-sm text-white/30 mt-3">No reviews yet</p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center border border-white/15 rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-gold"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-gold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={item.available === false}
              className="flex-1 bg-gold disabled:opacity-40 disabled:cursor-not-allowed text-bg font-bold py-3 rounded-full hover:brightness-110 transition"
            >
              <i className="fa-solid fa-cart-plus mr-2" />
              Add — Rs. {item.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
