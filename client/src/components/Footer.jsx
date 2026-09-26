export default function Footer() {
  return (
    <footer className="bg-bg2 border-t border-white/10 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="font-serif text-xl font-bold mb-3">
            <span className="text-gold">Kabir's</span> Restaurant
          </h4>
          <p className="text-white/60 text-sm leading-relaxed">
            Delicious Food, Fast Delivery. Serving Pakistani, BBQ, Fast Food, Pizza & Chinese cuisine in Peshawar.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              ['fa-brands fa-facebook-f', '#'],
              ['fa-brands fa-instagram', '#'],
              ['fa-brands fa-tiktok', '#'],
              ['fa-brands fa-whatsapp', 'https://wa.me/923329152885'],
            ].map(([icon, href]) => (
              <a
                key={icon}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-gold hover:border-gold/40 transition-colors"
              >
                <i className={icon} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-white">Quick Links</h5>
          <ul className="space-y-2 text-sm text-white/60">
            {['Home', 'About', 'Menu', 'Gallery', 'Contact'].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-gold transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-white">Categories</h5>
          <ul className="space-y-2 text-sm text-white/60">
            {['BBQ', 'Fast Food', 'Pizza', 'Chinese', 'Drinks'].map((l) => (
              <li key={l}>
                <a href="#menu" className="hover:text-gold transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold mb-3 text-white">Contact Info</h5>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              <i className="fa-solid fa-location-dot text-gold mr-2" /> Cantt, Peshawar, Pakistan
            </li>
            <li>
              <i className="fa-solid fa-phone text-gold mr-2" /> +92 332-9152885
            </li>
            <li>
              <i className="fa-solid fa-envelope text-gold mr-2" /> orders@kabirsrestaurant.com
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-white/10 my-6 max-w-7xl mx-auto" />
      <p className="text-center text-white/40 text-sm">© {new Date().getFullYear()} Kabir's Restaurant. All Rights Reserved.</p>
    </footer>
  );
}
