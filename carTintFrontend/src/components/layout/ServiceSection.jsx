import React, { useState, useRef, useEffect } from 'react';

import { 
  Shield, 
  Palette, 
  DollarSign, 
  File,
  Lightbulb,
  Clock, 
  Sparkles, 
  TrendingUp, 
  Sun, 
  Thermometer, 
  Eye, 
  Layers, 
  Zap,
  Ghost,
  ChevronDown,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export function ServicesSection() {
  const [activeService, setActiveService] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activeService');
      return saved || 'tint'; 
    }
    return 'tint';
  });
  
  const cardsRef = useRef({});

  useEffect(() => {
    const shouldScroll = typeof window !== 'undefined' ? sessionStorage.getItem('returnFromDetail') : null;
    
    if (shouldScroll && activeService && cardsRef.current[activeService]) {
      setTimeout(() => {
        cardsRef.current[activeService]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' // FIX 1: Align to start, not center
        });
        sessionStorage.removeItem('returnFromDetail');
      }, 500); 
    }
  }, []); 

  const toggleService = (key) => {
    const isOpening = activeService !== key;
    const newActiveService = isOpening ? key : null;
    
    setActiveService(newActiveService);

    if (typeof window !== 'undefined') {
      if (newActiveService) {
        localStorage.setItem('activeService', newActiveService);
      } else {
        localStorage.removeItem('activeService'); 
      }
    }

    if (isOpening) {
      // FIX 2: Adjusted timeout to allow previous card to begin collapsing
      setTimeout(() => {
        const element = cardsRef.current[key];
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' // FIX 3: Ensures the header is at the top
          });
        }
      }, 350); 
    }
  };

  const services = {
    tint: {
      id: 'tint',
      icon: Shield, 
      title: 'Ceramic Window Tinting',
      summary: 'Reject 99% of UV rays and keep your cabin cool.',
      link: '/service/tint', 
      description: "Upgrade your ride with our premium Ceramic and Carbon window films. Unlike standard dye films that fade, our technology rejects massive amounts of solar heat, protects your leather interiors from cracking, and gives your vehicle that sleek, finished aesthetic.",
      benefits: [
        { icon: Thermometer, title: 'Heat Rejection', description: 'Blocks up to 88% of infrared heat.' },
        { icon: Sun, title: 'UV Protection', description: 'SPF 1000+ equivalent protection.' },
        { icon: Ghost, title: 'Privacy & Security', description: 'Deter thieves by obscuring valuables.' },
        { icon: Eye, title: 'Glare Reduction', description: 'Driving is safer with less eye strain.' },
        { icon: Layers, title: 'Shatter Defense', description: 'Keeps glass intact during accidents.' },
        { icon: TrendingUp, title: 'Resale Value', description: 'Protects interior upholstery.' }
      ]
    },
    headlight: {
      id: 'headlight',
      icon: Lightbulb,
      title: 'Headlight Restoration',
      summary: 'Restore factory clarity and night-time visibility.',
      link: '/service/restoration',
      description: "Don't fail inspection or compromise safety due to cloudy lenses. We don't just polish your lights; we sand down the oxidation layer and apply a professional-grade UV hard coat that prevents them from turning yellow again for years.",
      benefits: [
        { icon: Zap, title: 'Maximum Visibility', description: 'Increase light output by up to 300%.' },
        { icon: Sparkles, title: 'Showroom Finish', description: 'Removes the aged, yellow look.' },
        { icon: DollarSign, title: 'Cost Effective', description: 'Save $500+ vs replacing assemblies.' },
        { icon: Shield, title: 'Ceramic Coating', description: 'Sealed against future oxidation.' },
        { icon: Clock, title: 'While You Wait', description: 'Done quickly while you relax.' },
        { icon: CheckCircle2, title: 'Pass Inspection', description: 'Meets legal road standards.' }
      ]
    },
    wrap: {
      id: 'wrap',
      icon: Palette,
      title: 'Vinyl Wraps & PPF',
      summary: 'Transform your vehicle color or protect the paint.',
      link: '/service/wrap',
      description: "Whether you want a matte black murder-out, a color-shift psychedelic look, or invisible Paint Protection Film (PPF), we use top-tier Avery and 3M materials. Our wraps fit like a second skin, preserving your factory paint underneath.",
      benefits: [
        { icon: Shield, title: 'Paint Protection', description: 'Shields against rock chips & scratches.' },
        { icon: Palette, title: 'Custom Colors', description: 'Matte, Satin, Gloss, or Chrome.' },
        { icon: TrendingUp, title: 'Commercial Fleets', description: 'Turn your van into a billboard.' },
        { icon: DollarSign, title: 'Reversible', description: 'Peel it off when you sell the car.' },
        { icon: Layers, title: 'Self-Healing', description: 'Heat repairs minor swirls on PPF.' },
        { icon: Sparkles, title: 'Unique Finish', description: 'Finishes paint can never achieve.' }
      ]
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-5">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium <span className="text-red-600">Auto Care</span></h2>
          <p className="text-gray-600 text-lg">
            Select a service below to view benefits and details.
          </p>
        </div>

        {/* Stack of Expanding Cards */}
        <div className="flex flex-col gap-5 max-w-4xl mx-auto">
          {Object.values(services).map((service) => {
            const isActive = activeService === service.id;
            const MainIcon = service.icon;

            return (
              <div 
                key={service.id}
                ref={(el) => (cardsRef.current[service.id] = el)}
                onClick={() => toggleService(service.id)}
                // FIX 4: Added scroll-mt-28 (scroll margin top)
                // This ensures when it scrolls to start, it leaves 7rem (approx 112px) of space at the top
                // so your navigation bar doesn't cover the card header.
                className={`
                  scroll-mt-28
                  bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 border 
                  ${isActive ? 'ring-2 ring-red-500 border-red-100 shadow-2xl scale-[1.01]' : 'border-gray-100 hover:shadow-xl hover:border-red-100'}
                `}
              >
                {/* CARD HEADER (Always Visible) */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                  
                  {/* Icon Box */}
                  <div className={`
                    p-4 rounded-2xl shrink-0 transition-colors duration-300
                    ${isActive ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 group-hover:bg-red-100'}
                  `}>
                    <MainIcon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-center md:justify-between w-full mb-1">
                      <h3 className={`text-xl md:text-2xl font-bold ${isActive ? 'text-red-600' : 'text-gray-900'}`}>
                        {service.title}
                      </h3>
                      {/* Chevron only visible on Desktop here */}
                      <ChevronDown 
                        className={`hidden md:block w-6 h-6 text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-180 text-red-600' : ''}`} 
                      />
                    </div>
                    
                    <p className="text-gray-500 font-medium">
                      {service.summary}
                    </p>
                  </div>

                  {/* Mobile Chevron */}
                  <ChevronDown 
                    className={`md:hidden w-6 h-6 text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-180 text-red-600' : ''}`} 
                  />
                </div>

                {/* EXPANDABLE CONTENT AREA */}
                <div 
                  className={`
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-6 md:px-8 pb-8 pt-0">
                    <div className="border-t border-gray-100 pt-6">
                      
                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-8">
                        {service.description}
                      </p>

                      {/* Benefits Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="mt-1">
                              <benefit.icon className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{benefit.title}</h4>
                              <p className="text-gray-500 text-xs mt-0.5 leading-snug">{benefit.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <div className="flex justify-end">
                        <a 
                          href={service.link}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('activeService', service.id);
                              sessionStorage.setItem('returnFromDetail', 'true');
                            }
                          }} 
                          className="w-full md:w-auto text-center inline-flex justify-center items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                          View Full Details 
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}