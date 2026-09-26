export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/923329152885"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-deep flex items-center justify-center text-white text-2xl transition-transform hover:scale-110"
      aria-label="Order via WhatsApp"
    >
      <i className="fa-brands fa-whatsapp" />
    </a>
  );
}
