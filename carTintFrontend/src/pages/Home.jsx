import HeroSlider from "../components/layout/HeroSlider";
import { ServicesSection } from "../components/layout/ServiceSection";
import { ReviewsSection } from "../components/layout/ReviewsSection";
import { WorkSection } from "../components/layout/WorkSection";
import Rating from "../components/layout/Rating";
// import Hero from "../components/layout/Hero";

export default function Home() {
  return (
    <>
      <HeroSlider />
      {/* <Hero /> */}
      <ServicesSection />
      <WorkSection />
      <ReviewsSection />
      <Rating />

      {/* Dummy sections so scroll works
      <div id="calculator" className="h-screen bg-gray-100 p-10">
        <h2 className="text-3xl font-bold">Calculator Section</h2>
      </div>

      <div id="about" className="h-screen bg-gray-200 p-10">
        <h2 className="text-3xl font-bold">About Section</h2>
      </div> */}

    </> 
  );
}
