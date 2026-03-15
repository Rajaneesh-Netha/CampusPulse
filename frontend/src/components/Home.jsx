import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './Navbar';
import AnnouncementBar from './AnnouncementBar';
import Hero from './Hero';
import QuickServices from './QuickServices';
import Features from './Features';
import Footer from './Footer';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    // Wait for layout to stabilize then refresh AOS
    window.addEventListener('load', () => {
      AOS.refresh();
    });
  }, []);

  return (
    <>
      <Navbar />
      <AnnouncementBar />
      <Hero />
      <QuickServices />
      <Features />
      <Footer />
    </>
  );
}

export default Home;