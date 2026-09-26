import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('kabirs_cart') || '[]');
  } catch (e) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('kabirs_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, qty = 1) => {
    const id = item._id || item.id;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) {
        return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { id, name: item.name, price: item.price, image: item.image, qty }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const next = prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0);
      return next;
    });
  };

  const clearCart = () => setCart([]);

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const count = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    changeQty,
    clearCart,
    total,
    count,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
