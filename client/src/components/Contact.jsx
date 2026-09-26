import { useToast } from '../context/ToastContext';

const INFO = [
  ['fa-location-dot', 'Address', 'Cantt, Peshawar, Pakistan'],
  ['fa-phone', 'Phone', '+92 332-9152885'],
  ['fa-envelope', 'Email', 'orders@kabirsrestaurant.com'],
  ['fa-clock', 'Delivery Timing', '11:00 AM – 12:00 AM (Daily)'],
];

export default function Contact() {
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Thanks for reaching out! We'll get back to you shortly.", 'success');
    e.target.reset();
  };

  return (
    <section id="contact" className="section-pad bg-bg2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-gold text-xs font-bold uppercase tracking-widest">Get In Touch</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            Contact &amp; <span className="text-gold">Delivery</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Your Name" className="w-full bg-bg3 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" />
            <input required type="email" placeholder="Your Email" className="w-full bg-bg3 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" />
            <input placeholder="Subject" className="w-full bg-bg3 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" />
            <textarea required rows={4} placeholder="Your Message" className="w-full bg-bg3 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold/50" />
            <button type="submit" className="w-full bg-gold text-bg font-bold py-3.5 rounded-xl hover:brightness-110 transition">
              Send Message
            </button>
          </form>

          <div>
            {INFO.map(([icon, label, value]) => (
              <div key={label} className="flex items-start gap-4 bg-bg3 border border-white/5 rounded-xl p-4 mb-3">
                <i className={`fa-solid ${icon} text-gold text-lg mt-1`} />
                <div>
                  <h6 className="font-semibold">{label}</h6>
                  <p className="text-white/50 text-sm">{value}</p>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/923329152885"
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-emerald-600 hover:bg-emerald-700 transition text-white font-semibold py-3.5 rounded-xl mb-3"
            >
              <i className="fa-brands fa-whatsapp text-lg mr-2" /> Order via WhatsApp
            </a>

            <div className="rounded-2xl overflow-hidden border border-white/10">
              <iframe
                title="Restaurant location"
                src="https://www.google.com/maps?q=Cantt,Peshawar,Pakistan&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
