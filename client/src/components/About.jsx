const FEATURES = [
  ['fa-fire-burner', 'Expert Chefs'],
  ['fa-leaf', 'Fresh Ingredients'],
  ['fa-motorcycle', 'Fast Delivery'],
  ['fa-star', 'Top Quality'],
];

export default function About() {
  return (
    <section id="about" className="section-pad bg-bg2">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
          alt="About Kabir's Restaurant"
          className="rounded-3xl shadow-deep w-full h-80 lg:h-[420px] object-cover"
        />

        <div>
          <span className="text-gold text-xs font-bold uppercase tracking-widest">About Us</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 mb-5">
            Why Choose <span className="text-gold">Kabir's?</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Kabir's Restaurant serves fresh, delicious, and high-quality meals prepared by expert chefs. We
            specialize in Pakistani, BBQ, Fast Food, and Chinese cuisine with quick home delivery.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {FEATURES.map(([icon, label]) => (
              <div key={label} className="text-center bg-white/5 rounded-2xl py-6 px-2 border border-white/5">
                <i className={`fa-solid ${icon} text-2xl text-gold mb-2`} />
                <p className="text-sm font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
