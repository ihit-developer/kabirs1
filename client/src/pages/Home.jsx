import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import MenuSection from '../components/MenuSection';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import WhatsAppFloat from '../components/WhatsAppFloat';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Gallery />
      <Reviews />
      <Contact />
      <Footer />
      <CartSidebar />
      <WhatsAppFloat />
    </>
  );
}
