import React from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';

export function HeroSection() {
  const scrollToServices = () => {
    // Finds the ID 'services' from your ServicesSection component
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* 1. BACKGROUND IMAGE & OVERLAYS */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder dark car image - replace 'src' with your specific black image if needed */}
        <img 
          src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop" 
          alt="Dark Luxury Car" 
          className="w-full h-full object-cover opacity-70"
        />
        
        {/* Dark overlay to ensure text pops */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* THE "SHUT" GRADIENT: Fades from transparent to gray-50 at the bottom 
            to match the top of the ServicesSection perfectly. */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-50" />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Now Booking for October
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
          Redefine Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
            Driving Experience
          </span>
        </h1>
        
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
          Premium automotive styling and protection. From ceramic tint to custom vinyl wraps, we give your vehicle the look it deserves.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={scrollToServices}
            className="group bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-900/30 flex items-center gap-2"
          >
            Explore Services
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
            Get a Quote
          </button>
        </div>
      </div>

      {/* 3. BOUNCING SCROLL INDICATOR */}
      <div 
        onClick={scrollToServices}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-20 group"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-red-600 transition-colors duration-300">
          <span className="text-xs uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>
      </div>

    </section>
  );
}