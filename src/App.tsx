import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import CinematicSection from './sections/CinematicSection';
import RelationshipCards from './sections/RelationshipCards';
import EmotionsReveal from './sections/EmotionsReveal';
import TextBands from './sections/TextBands';
import CreateMoment from './sections/CreateMoment';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

export default function App() {
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
