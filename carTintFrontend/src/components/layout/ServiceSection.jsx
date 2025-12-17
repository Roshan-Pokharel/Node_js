import React, { useState } from 'react';
import { 
  Shield, 
  Palette, 
  DollarSign, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Sun, 
  Thermometer, 
  Eye, 
  Layers, 
  Zap,
  Ghost 
} from 'lucide-react';

export function ServicesSection() {
  // Simple state declaration without TypeScript generics
  const [activeService, setActiveService] = useState('tint');

  const services = {
   
    tint: {
      title: 'Window Tinting',
      description: "Professional window tinting enhances your driving experience by blocking harmful UV rays and reducing solar heat gain. Our high-quality films provide privacy, safety, and a sleek look for your vehicle while protecting your interior from fading and cracking.",
      benefits: [
        { icon: Thermometer, title: 'Heat Rejection', description: 'Blocks up to 60% of solar heat, keeping your cabin cool.' },
        { icon: Sun, title: 'UV Protection', description: 'Blocks 99% of harmful UV rays, protecting your skin and eyes.' },
        { icon: Ghost, title: 'Enhanced Privacy', description: 'Increases privacy for you and your passengers and security for valuables.' },
        { icon: Shield, title: 'Shatter Safety', description: 'Holds shattered glass together in the event of an accident.' },
        { icon: Eye, title: 'Glare Reduction', description: 'Reduces sun and headlight glare for safer driving.' },
        { icon: Layers, title: 'Interior Protection', description: 'Prevents dashboard and upholstery from fading and cracking.' }
      ]
    },
    headlight: {
      title: 'Headlight Restoration',
      description: "Cloudy or yellowed headlights aren't just an eyesore; they are a safety hazard. Our restoration process removes oxidation and applies a protective UV coating to restore optical clarity, improving your night vision and the overall look of your vehicle.",
      benefits: [
        { icon: Zap, title: 'Improved Visibility', description: 'Restores light output for safer night-time driving.' },
        { icon: Sparkles, title: 'Like-New Look', description: 'Removes yellow oxidation, making old lights look brand new.' },
        { icon: DollarSign, title: 'Save Money', description: 'A fraction of the cost of buying new headlight assemblies.' },
        { icon: Shield, title: 'UV Coating', description: 'We apply a sealant to prevent future yellowing and oxidation.' },
        { icon: Clock, title: 'Fast Service', description: 'Most restorations are completed in under an hour.' },
        { icon: TrendingUp, title: 'Vehicle Value', description: 'Clean headlights instantly improve the overall aesthetic value.' }
      ]
    },
     wrap: {
      title: 'Car Wrapping',
      description: "Car wrapping is the process of applying a thin vinyl film over your vehicle's original paint. This innovative technique allows you to completely transform your car's appearance while protecting the factory finish underneath. Unlike traditional paint, wraps are fully removable and last 5-7 years.",
      benefits: [
        { icon: Shield, title: 'Paint Protection', description: 'Protects original paint from scratches, UV rays, and chips.' },
        { icon: Palette, title: 'Unlimited Colors', description: 'Choose from thousands of colors, including matte, gloss, and metallic.' },
        { icon: TrendingUp, title: 'Business Branding', description: 'Perfect for business vehicles to advertise your brand on the road.' },
        { icon: DollarSign, title: 'Cost Effective', description: 'Much cheaper than a professional paint job and easily reversible.' },
        { icon: Clock, title: 'Quick Installation', description: 'Completed in 3-5 days compared to weeks for a paint job.' },
        { icon: Sparkles, title: 'Resale Value', description: 'Preserves your original paint, maintaining higher resale value.' }
      ]
    }
  };

  const currentData = services[activeService];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Premium Services</h2>
          <p className="text-gray-600 text-lg">
            Elevate your vehicle with our professional customization and protection services.
          </p>
        </div>

        {/* Service Toggles */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          
          <button
            onClick={() => setActiveService('tint')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeService === 'tint' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Window Tint
          </button>
          <button
            onClick={() => setActiveService('headlight')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeService === 'headlight' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Headlight Restoration
          </button>
          <button
            onClick={() => setActiveService('wrap')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeService === 'wrap' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Car Wraps
          </button>
        </div>

        {/* Active Content Area */}
        <div className="animate-fade-in-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">What is {currentData.title}?</h3>
            <p className="text-gray-600 leading-relaxed">
              {currentData.description}
            </p>
          </div>

          <div className="mb-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Why Choose {currentData.title}?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentData.benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}