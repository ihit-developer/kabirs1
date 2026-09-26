import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#menu', label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/95 backdrop-blur border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="#home" className="font-serif text-xl font-bold text-white">
          <span className="text-gold">Kabir's</span> Restaurant
        </a>

        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`} />
        </button>

        <div
          className={`${
            mobileOpen ? 'flex' : 'hidden'
          } lg:flex flex-col lg:flex-row absolute lg:static top-full left-0 right-0 bg-bg2 lg:bg-transparent border-t border-white/10 lg:border-0 items-center gap-1 lg:gap-6 p-4 lg:p-0`}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-gold transition-colors py-2 lg:py-0 text-sm font-medium"
            >
              {l.label}
            </a>
          ))}

          <Link
            to="/reserve"
            onClick={() => setMobileOpen(false)}
            className="text-white/80 hover:text-gold transition-colors py-2 lg:py-0 text-sm font-medium"
          >
            <i className="fa-solid fa-calendar-check mr-1" /> Reserve Table
          </Link>

          <Link
            to="/track"
            onClick={() => setMobileOpen(false)}
            className="text-white/80 hover:text-gold transition-colors py-2 lg:py-0 text-sm font-medium"
          >
            <i className="fa-solid fa-location-dot mr-1" /> Track Order
          </Link>

          <Link
            to="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="text-xs font-bold border border-gold/50 text-gold px-3 py-1.5 rounded-full hover:bg-gold hover:text-bg transition-colors"
          >
            🔐 Admin
          </Link>

          <button
            onClick={openCart}
            className="relative bg-gold text-bg font-bold px-4 py-2 rounded-full hover:brightness-110 transition mt-2 lg:mt-0"
          >
            <i className="fa-solid fa-cart-shopping" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
