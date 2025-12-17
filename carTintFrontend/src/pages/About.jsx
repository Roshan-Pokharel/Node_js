import React from 'react';
import aboutImage from '../assets/tint_shades.jpg';

const About = () => {
  return (
    <section className="bg-white text-gray-600 py-16 px-6 lg:py-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-[#6c5ce7] font-bold tracking-widest uppercase text-sm mb-3">
            Premium Automotive Styling
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Sydney’s Premier Tint & Wrap Specialists
          </h1>
          <div className="w-20 h-1 bg-[#6c5ce7] mx-auto rounded-full"></div>
        </div>

        {/* Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Image/Visual Placeholder */}
          <div className="relative group">
            {/* Decorative offset background */}
            <div className="absolute -inset-2 bg-gray-100 rounded-2xl transform rotate-2 group-hover:rotate-1 transition duration-500"></div>
            
            <div className="relative rounded-xl overflow-hidden shadow-2xl h-[400px] border border-gray-100">
               {/* Image Tag Trigger */}
              
              <img 
                src={aboutImage} 
                alt="Car Tinting and Wrapping" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Protecting Sydney’s Drivers for Years
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              At <span className="text-[#6c5ce7] font-bold">OZ Tint and Wrap</span>, we understand that your vehicle is more than just a way to get from A to B. It’s an investment and a reflection of your style. Located in the heart of Sydney, we specialize in high-performance window tinting and precision vehicle wrapping.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With the intense Australian UV levels, our premium films provide up to 99% UV protection, keeping you cool and your interior safe. Whether you're looking for a complete color change or a professional window tint, our certified technicians deliver a flawless finish every time.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 border-l-4 border-l-[#6c5ce7]">
                <h4 className="text-gray-900 font-bold mb-1">Sydney Wide</h4>
                <p className="text-sm text-gray-500">Serving Greater Sydney with premium workshop standards.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300 border-l-4 border-l-[#6c5ce7]">
                <h4 className="text-gray-900 font-bold mb-1">Premium Films</h4>
                <p className="text-sm text-gray-500">We only use industry-leading materials like 3M and Avery Dennison.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats / Trust Indicators */}
        <div className="mt-24 pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">100%</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">UV Protection</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">5+</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Years Experience</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">Sydney</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Local Experts</p>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-gray-900 mb-2">Lifetime</div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Workmanship Warranty</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;