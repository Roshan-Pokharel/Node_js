import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Car, Sparkles } from 'lucide-react'; // Optional: using lucide-react for icons
import carTintImage from '../assets/slide1.png';
import headLightImage from '../assets/slide2.png';
import carWrapImage from '../assets/slide3.png';

const services = [
  {
    id: 'tint',
    title: "Window Tinting",
    description: "Premium ceramic films that block 99% of UV rays, reduce heat, and provide ultimate privacy for your vehicle.",
    icon: <Sun className="w-8 h-8 text-blue-500" />,
    image: carTintImage
  },
  {
    id: 'wrap',
    title: "Vinyl Wrap",
    description: "Completely transform your car's look with our high-end wraps. Choose from matte, gloss, or custom color-shift finishes.",
    icon: <Car className="w-8 h-8 text-purple-500" />,
    image: carWrapImage
  },
  {
    id: 'restoration',
    title: "Headlight Restoration",
    description: "Say goodbye to yellow, foggy lenses. We restore clarity and brightness to improve nighttime visibility and safety.",
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    image: headLightImage
  }
];

const Services = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide top-tier automotive enhancement services to keep your ride looking its absolute best.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
               
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
            <Link 
              to={`/service/${service.id}`}
              className="inline-block bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Learn More
            </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;