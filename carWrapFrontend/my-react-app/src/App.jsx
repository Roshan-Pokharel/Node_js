import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { Calculator } from './components/Calculator';
import { WorkSection } from './components/WorkSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ShopSection } from './components/ShopSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <Calculator />
      <WorkSection />
      <ReviewsSection />
      <ShopSection />
      <Footer />
    </div>
  );
}
