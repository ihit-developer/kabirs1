import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

export default function CartSidebar() {
  const { cart, isOpen, closeCart, changeQty, removeFromCart, total } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-[60]" onClick={closeCart} />}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-bg2 z-[65] shadow-deep transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-semibold flex items-center gap-2">
            <i className="fa-solid fa-cart-shopping text-gold" />
            Your Cart
            {cart.length > 0 && <span className="bg-gold text-bg text-xs font-bold rounded-full px-2 py-0.5">{cart.length}</span>}
          </h3>
          <button onClick={closeCart} className="text-white/50 hover:text-white text-xl">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <div className="text-5xl mb-3">🛒</div>
              <p>Your cart is empty</p>
              <button onClick={closeCart} className="mt-3 text-gold text-sm font-semibold hover:underline">
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image || ''}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=60'; }}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h6 className="font-semibold text-sm truncate">{item.name}</h6>
                    <p className="text-gold text-sm font-bold">Rs. {item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-full bg-white/10 text-xs hover:bg-white/20">−</button>
                      <span className="text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-full bg-white/10 text-xs hover:bg-white/20">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red">
                      <i className="fa-solid fa-trash text-sm" />
                    </button>
                    <span className="text-gold text-sm font-bold">Rs.{item.price * item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-white/10">
            <div className="flex justify-between mb-4 text-sm">
              <span>Subtotal</span>
              <span className="text-gold font-bold">Rs. {total.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-gold text-bg font-bold py-3 rounded-full hover:brightness-110 transition mb-2"
            >
              <i className="fa-solid fa-receipt mr-2" /> Checkout →
            </button>
            <button onClick={closeCart} className="w-full border border-white/15 text-white/70 py-2.5 rounded-full hover:bg-white/5 transition">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
