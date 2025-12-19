import { useEffect, useState, useRef } from "react";
import FormOverlay from "../common/FormOverlay";  
import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";
import slide3 from "../../assets/slide3.png";

export default function HeroSlider() {
  const images = [
    slide1,
    slide2,
    slide3
  ];
  
  // Create the clones for infinite looping
  const slides = [images[images.length - 1], ...images, images[0]];

  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const timeoutRef = useRef(null);

  // 1. THE TIMER LOGIC
  useEffect(() => {
    const startSlider = () => {
      timeoutRef.current = setInterval(() => {
        setIndex((prev) => prev + 1);
      }, 4000);
    };

    startSlider();

    // Cleanup: Stop timer on unmount
    return () => clearInterval(timeoutRef.current);
  }, []);

  // 2. THE TRANSITION END LOGIC (Standard Loop)
  const handleTransitionEnd = () => {
    if (index === slides.length - 1) {
      setTransition(false);
      setIndex(1);
    }

    if (index === 0) {
      setTransition(false);
      setIndex(slides.length - 2);
    }
  };

  // 3. THE RESTORE TRANSITION LOGIC
  useEffect(() => {
    if (!transition) {
      // We need a small delay or a frame request to re-enable transition
      // otherwise the browser optimizes it out
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTransition(true);
        });
      });
    }
  }, [transition]);

  // 4. *** THE FIX: THE SAFETY NET *** // This watches if the index ever exceeds the array length (The Bug)
  useEffect(() => {
    if (index >= slides.length) {
        // If we drifted off screen, snap back instantly without animation
        setTransition(false);
        setIndex(1);
    }
  }, [index, slides.length]);

  const [openForm, setOpenForm] = useState(false);
  const phoneNumber = "0433599495";

  return (
    <>
    <FormOverlay open={openForm} onClose={() => setOpenForm(false)} />
    <section className="relative w-full h-[70vh] overflow-hidden">

      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex h-full ${
          transition ? "transition-transform duration-700 ease-linear" : ""
        }`}
        // 5. Added a safety check here inside the style as well
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-full object-cover flex-shrink-0"
            alt={`Slide ${i}`} // Better accessibility
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Premium Tint & Wrap
        </h1>
        <p className="mt-4 text-lg text-gray-200">
          headlights restoration | paint protection | window tinting
        </p>
         <div className="text-center py-6 gap-6 flex  flex-col sm:flex-row justify-center">
          <button
            onClick={() => setOpenForm(true)}
            className="w-full md:w-[320px] px-6 py-3 font-bold text-xl bg-red-600 text-white rounded-lg hover:bg-red-700 flex justify-center items-center gap-2 shadow-lg shadow-red-900/30"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
           Online Quote
        </button>

        
             <a href={`tel:${phoneNumber}`}
              className="w-full md:w-[320px] flex items-center justify-center gap-2 px-6 py-3 font-bold text-xl
              bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800  
              text-white shadow-lg shadow-red-900/30">
            
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 animate-ring origin-center"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
               <span>0433 599 495</span>
              </a>

       
      </div>
      </div>

    </section>
    </>
  );
}