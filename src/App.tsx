import { useState, useEffect } from 'react';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import CinematicSection from './sections/CinematicSection';
import RelationshipCards from './sections/RelationshipCards';
import EmotionsReveal from './sections/EmotionsReveal';
import TextBands from './sections/TextBands';
import CreateMoment from './sections/CreateMoment';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import ExperiencePage from './app/experience/[token]/page';

export default function App() {
  const [pathname, setPathname] = useState<string>('/');

  useEffect(() => {
    setPathname(window.location.pathname);
    const handleLocation = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  if (pathname.startsWith('/experience/')) {
    const token = pathname.replace('/experience/', '').split('?')[0];
    return <ExperiencePage params={Promise.resolve({ token })} />;
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <Navigation />
      <HeroSection />
      <CinematicSection />
      <RelationshipCards />
      <EmotionsReveal />
      <TextBands />
      <CreateMoment />
      <ContactSection />
      <Footer />
    </div>
  );
}
