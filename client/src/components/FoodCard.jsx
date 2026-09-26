import { useCart } from '../context/CartContext';

function StarRating({ avg, count }) {
  if (!avg) return null;
  const rounded = Math.round(avg);
  return (
    <div className="flex items-center gap-1 text-xs text-gold mb-1">
      <span>{'★'.repeat(rounded)}{'☆'.repeat(5 - rounded)}</span>
      <span className="text-white/40">({count})</span>
    </div>
  );
}

export default function FoodCard({ item, rating, onOpen }) {
  const { addToCart, openCart } = useCart();
  const id = item._id || item.id;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(item, 1);
    openCart();
  };

  return (
    <div
      onClick={() => onOpen(item)}
      className="group bg-bg3 rounded-2xl overflow-hidden border border-white/5 cursor-pointer card-hover"
    >
      <div className="relative h-44 overflow-hidden">
        <span className="absolute top-3 left-3 z-10 bg-bg/80 text-gold text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
          {item.category}
        </span>
        <img
          src={item.image || ''}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=70';
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-sm font-semibold text-white">👁 View Details</span>
        </div>
      </div>

      <div className="p-4">
        <h6 className="font-semibold text-white truncate">{item.name}</h6>
        {item.description && (
          <p className="text-white/45 text-xs mt-1 line-clamp-2">{item.description}</p>
        )}
        <StarRating avg={rating?.avg} count={rating?.count} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-gold font-bold">Rs. {item.price}</span>
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-gold text-bg flex items-center justify-center hover:brightness-110 transition"
            aria-label={`Add ${item.name} to cart`}
          >
            <i className="fa-solid fa-plus text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
