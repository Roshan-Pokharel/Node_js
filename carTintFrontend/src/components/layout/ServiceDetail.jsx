import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Scale, 
  Flame,
  Info,
  Car
} from 'lucide-react';

const TINT_OPTIONS = [
  { id: '5%', label: 'Limo', desc: 'Maximum Privacy', opacity: 'bg-gray-950' },
  { id: '20%', label: 'Dark', desc: 'Popular Look', opacity: 'bg-gray-800' },
  { id: '35%', label: 'Medium', desc: 'Legal Limit', opacity: 'bg-gray-600' },
  { id: '50%', label: 'Light', desc: 'UV Protection', opacity: 'bg-gray-400' },
];

const HEADLIGHT_OPTIONS = [
  { id: 'both', label: 'Both Headlights', desc: 'Full front clarity restoration' },
  { id: 'single', label: 'Single Headlight', desc: 'Driver or Passenger side only' },
];

const COVERAGE_OPTIONS = [
  { id: 'full', label: 'Full Vehicle', desc: 'All side & rear glass' },
  { id: 'front', label: 'Front Two', desc: 'Driver & Passenger only' },
  { id: 'windshield', label: 'Windshield', desc: 'Full front glass' },
  { id: 'roof', label: 'Sunroof / Roof', desc: 'Panoramic or standard' },
];

const SERVICE_DATA = {
  tint: { 
    title: "Window Tinting", 
    tagline: "Cooler interior, better privacy, and ultimate UV protection.",
    description: "Our premium ceramic window tinting service isn't just about looks. We use high-grade multi-layer films that block up to 99% of harmful UV rays and reject up to 88% of solar heat.",
    importance: [
      "Blocks 99% of cancer-causing UV rays.",
      "Reduces glare for safer driving.",
      "Shatter protection keeps glass together in accidents."
    ],
    legal: "We ensure all tints comply with local laws regarding Visible Light Transmission (VLT).",
    time: "2 - 4 Hours",
    benefits: ["Heat Rejection", "UV Protection", "Privacy", "Glare Reduction"] 
  },
  wrap: { 
    title: "Vinyl Wrap", 
    tagline: "Change your color, protect your paint, turn heads.",
    description: "Vinyl wrapping is the most versatile way to customize your vehicle without the permanent commitment of a respray. We use industry-leading films from 3M and Avery Dennison.",
    importance: [
      "Preserves the original factory paint.",
      "Cheaper and faster than a high-quality paint job.",
      "Fully reversible for resale."
    ],
    legal: "Major color changes must often be reported to the DMV/Registry.",
    time: "3 - 5 Days",
    benefits: ["Paint Protection", "100+ Colors", "Reversible", "Unique Styling"] 
  },
  restoration: { 
    title: "Headlight Restoration", 
    tagline: "Restore clarity, improve safety, and modernize your look.",
    description: "Cloudy headlights reduce light output by up to 70%. Our multi-stage process removes oxidation and applies a heavy-duty ceramic UV coating.",
    importance: [
      "Increases night vision distance.",
      "Required to pass safety inspections.",
      "Saves money over replacement."
    ],
    legal: "Driving with dim headlights can be a ticketable equipment violation.",
    time: "1 - 1.5 Hours",
    benefits: ["Optical Clarity", "Night Safety", "Money Saver", "Long-lasting"] 
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  // 1. useState MUST be inside the component
  const [selectedShade, setSelectedShade] = useState('35%');
  const [selectedCoverage, setSelectedCoverage] = useState('full');
  const [selectedHeadlights, setSelectedHeadlights] = useState('both');

  const service = SERVICE_DATA[serviceId];

  if (!service) return <div className="p-10 text-center text-xl font-bold">Service not found.</div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-gray-500 hover:text-black transition-colors mb-8"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors mr-2">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Services</span>
        </button>

        {/* Hero Section */}
        <div className="mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-bold mb-4 uppercase tracking-wider">
            Service Details
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            {service.title}
          </h1>
          <p className="text-2xl text-gray-500 font-light leading-relaxed max-w-3xl">
            {service.tagline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-3 text-blue-600"/> About This Service
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </section>

            <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Flame className="w-6 h-6 mr-3 text-orange-500"/> Why It Matters
              </h3>
              <ul className="space-y-4">
                {service.importance.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {serviceId === 'tint'  && (
              <div className="border-2 border-gray-100 p-8 rounded-3xl">
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Key Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {service.benefits.map((benefit) => (
                  <span key={benefit} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            )}

            <section>

              
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                
                <Scale className="w-6 h-6 mr-3 text-gray-500"/> Legal & Safety
              </h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                <p className="text-yellow-800 font-medium italic">
                  "{service.legal}"
                </p>
              </div>

              {serviceId === 'tint' && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
                <p className="text-blue-800 font-medium italic">
                  Note: Our tinting service includes a lifetime warranty against bubbling, peeling, or discoloration.
                </p>
              </div>
            )}  
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
              <div className="flex items-center mb-4 text-blue-400">
                <Clock className="w-8 h-8 mr-3" />
                <span className="font-bold uppercase tracking-wider text-sm">Est. Time</span>
              </div>
              <p className="text-3xl font-bold">{service.time}</p>
            </div>
            {serviceId === 'wrap'  && (
              <div className="border-2 border-gray-100 p-8 rounded-3xl">
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Key Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {service.benefits.map((benefit) => (
                  <span key={benefit} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            )}

             {serviceId === 'restoration'  && (
              <div className="border-2 border-gray-100 p-8 rounded-3xl">
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Key Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {service.benefits.map((benefit) => (
                  <span key={benefit} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            )}
            

         {/* Customization Section for Tint Service */}
          {serviceId === 'tint' && (
            <div className="p-6 border-2 border-gray-100 rounded-3xl bg-white space-y-8">
              
              {/* 1. Shade Selection */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" /> 1. Select Shade
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {TINT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedShade(option.id)}
                      className={`
                        relative overflow-hidden p-4 rounded-xl border-2 transition-all text-left
                        ${selectedShade === option.id 
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-50' 
                          : 'border-gray-100 hover:border-gray-300'}
                      `}
                    >
                      {/* Visual Tint Swatch */}
                      <div className={`w-full h-2 mb-2 rounded ${option.opacity}`} />
                      <div className="font-bold text-gray-900">{option.id}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Coverage Selection */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2 flex items-center">
                  <Car className="w-4 h-4 mr-2" /> 2. Select Coverage
                </h4>
                <div className="space-y-2">
                  {COVERAGE_OPTIONS.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedCoverage(area.id)}
                      className={`
                        w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center 
                        ${selectedCoverage === area.id 
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-50' 
                          : 'border-gray-100 hover:border-gray-300 bg-white'}
                      `}
                    >
                      <div className="text-left">
                        <div className="font-bold text-sm text-gray-900">{area.label}</div>
                        <div className="text-[10px] text-gray-500 uppercase">{area.desc}</div>
                      </div>
                      {selectedCoverage === area.id && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {serviceId === 'restoration' && (
    <div className="p-6 border-2 border-gray-100 rounded-3xl bg-white space-y-6">
      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2 flex items-center">
        <Info className="w-4 h-4 mr-2" /> Restore Options
      </h4>
      
      <div className="space-y-3">
        {HEADLIGHT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelectedHeadlights(opt.id)}
            className={`
              w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center 
              ${selectedHeadlights === opt.id 
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-50' 
                : 'border-gray-100 hover:border-gray-300 bg-white'}
            `}
          >
            <div className="text-left">
              <div className="font-bold text-sm text-gray-900">{opt.label}</div>
              <div className="text-[10px] text-gray-500 uppercase">{opt.desc}</div>
            </div>
            {selectedHeadlights === opt.id && (
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  )}

            {serviceId === 'tint'  && (
              <Link to={`/service/${serviceId}/book`} state={{ shade: selectedShade, coverage: selectedCoverage, headlights: selectedHeadlights }}>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 mt-5 ">
                Book Appointment
              </button>
            </Link>
            )}

            {serviceId === 'restoration'  && (
              <Link to={`/service/${serviceId}/book`} state={{ shade: selectedShade, coverage: selectedCoverage, headlights: selectedHeadlights }}>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 mt-5">
                Book Appointment
              </button>
            </Link>
            )}

             {serviceId === 'wrap'  && (
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
                Coming Soon
              </button>
            )}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;