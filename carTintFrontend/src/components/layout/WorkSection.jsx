import React from 'react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export function WorkSection() {
 const works = [
    {
      // REPLACED: Car Tint
      image: 'https://lirp.cdn-website.com/68ca40c9/dms3rep/multi/opt/auto+window+tinting-2be5114e-1920w.jpg',
      title: 'Premium Ceramic Tint',
      category: 'Window Tinting',
      description: 'High-performance ceramic tint providing superior heat rejection, UV protection, and privacy.'
    },
    {
      // REPLACED: Headlight Restoration
      image: 'https://i.pinimg.com/originals/fe/bb/ac/febbac2594c81c1a4df73d8e90e9deab.jpg',
      title: 'Headlight Restoration',
      category: 'Restoration',
      description: 'Restoring crystal clear visibility to cloudy headlights for improved safety and aesthetics.'
    },
    {
      image: 'https://images.unsplash.com/photo-1617024094355-b886817cffc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvciUyMGNhciUyMHdyYXB8ZW58MXx8fHwxNzY1NzM0MjcyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Color Transformation',
      category: 'Full Wrap',
      description: 'Vibrant color change that protects and enhances your vehicle.'
    },
    {
      image: 'https://images.unsplash.com/photo-1592925997296-970cb3f2f23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBjYXIlMjB3cmFwfGVufDF8fHx8MTc2NTczNDI3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Custom Design',
      category: 'Custom Wrap',
      description: 'Personalized design bringing unique vision to life.'
    },
    {
      image: 'https://images.unsplash.com/photo-1696960809870-7094f85696bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjB3cmFwfGVufDF8fHx8MTc2NTczNDI3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Luxury Package',
      category: 'Premium Wrap',
      description: 'High-end finish for luxury vehicles demanding perfection.'
    }
  ];

  return (
    <section id="work" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 text-3xl font-bold mb-4">Our Work</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of stunning car wrap transformations. Each project showcases our commitment to quality and attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {work.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 text-xl font-bold mb-2">{work.title}</h3>
                <p className="text-gray-600">{work.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}