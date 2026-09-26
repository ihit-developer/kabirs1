const IMAGES = [
  ['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80', false],
  ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', true],
  ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', false],
  ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80', false],
  ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', true],
  ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', false],
  ['https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80', false],
  ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80', true],
];

export default function Gallery() {
  return (
    <section id="gallery" className="section-pad bg-bg2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-gold text-xs font-bold uppercase tracking-widest">Gallery</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            Food <span className="text-gold">Gallery</span>
          </h2>
        </div>

        <div className="columns-2 md:columns-4 gap-4 [column-fill:_balance]">
          {IMAGES.map(([src, tall], i) => (
            <div key={i} className={`mb-4 break-inside-avoid rounded-2xl overflow-hidden ${tall ? 'h-72' : 'h-40'}`}>
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
