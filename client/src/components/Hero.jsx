import { useEffect, useState } from 'react';

const WORDS = ['Fresh, Hot & Fast! 🔥', 'Biryani Tonight 🍛', 'BBQ Perfection 🍖', 'Pizza & More 🍕', 'Anything, Anytime ✨'];

function useTypewriter() {
  const [text, setText] = useState('');

  useEffect(() => {
    let wi = 0;
    let ci = 0;
    let del = false;
    let timer;

    const tick = () => {
      const w = WORDS[wi];
      setText(w.slice(0, ci));
      if (!del && ci < w.length) {
        ci++;
        timer = setTimeout(tick, 75);
      } else if (!del && ci === w.length) {
        del = true;
        timer = setTimeout(tick, 1900);
      } else if (del && ci > 0) {
        ci--;
        timer = setTimeout(tick, 38);
      } else {
        del = false;
        wi = (wi + 1) % WORDS.length;
        timer = setTimeout(tick, 300);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return text;
}

const STATS = [
  ['50+', 'Menu Items'],
  ['4.9★', 'Rating'],
  ['30min', 'Avg Delivery'],
  ['3', 'Order Types'],
];

export default function Hero() {
  const typed = useTypewriter();

  return (
    <header id="home" className="relative min-h-screen flex items-center bg-hero pt-24">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: `${(i * 37) % 100}%`,
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              animationDuration: `${8 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide bg-white/5 border border-white/15 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulseSoft" />
          Now Open — Delivery &amp; Dine-In
        </span>

        <p className="text-gold text-sm font-semibold mb-2 tracking-wide">🍽️ Welcome to</p>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
          Kabir's <span className="text-gold-grad">Restaurant</span>
        </h1>

        <div className="mt-6 mb-4 text-xl md:text-2xl font-medium text-white/90 h-8">
          <span>Order </span>
          <span className="text-gold">{typed}</span>
          <span className="animate-pulse">|</span>
        </div>

        <p className="text-white/60 text-base md:text-lg mb-10">
          Fresh ingredients · Expert chefs · Fast delivery to your door
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href="#menu"
            className="bg-gold text-bg font-bold px-8 py-3.5 rounded-full hover:brightness-110 transition shadow-soft"
          >
            <i className="fa-solid fa-bag-shopping mr-2" /> Order Now
          </a>
          <a
            href="#menu"
            className="border border-white/25 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition"
          >
            <i className="fa-solid fa-book-open mr-2" /> View Menu
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {STATS.map(([val, label], i) => (
            <div key={label} className="flex items-center gap-6 md:gap-10">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-gold">{val}</div>
                <div className="text-xs text-white/50 uppercase tracking-wide mt-1">{label}</div>
              </div>
              {i < STATS.length - 1 && <div className="hidden md:block w-px h-10 bg-white/15" />}
            </div>
          ))}
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
        <i className="fa-solid fa-chevron-down text-xl" />
      </a>
    </header>
  );
}
