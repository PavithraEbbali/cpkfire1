import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Systems from '@/components/Systems';
import Credentials from '@/components/Credentials';
import Equipment from '@/components/Equipment';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Systems />
        <Credentials />
        <Equipment />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
