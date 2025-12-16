import React, { useState, useEffect } from 'react';
import { X, Check, Car, FileText, Layers, Clock, Lightbulb } from 'lucide-react';

export default function FormOverlay({ open, onClose }) {
  // 1. State for Form Data
  const [formData, setFormData] = useState({
    suburb: '',
    vehicleReg: '',
    serviceType: '', // 'headlight', 'tinting', or 'wrap'
    repairPart: '',  // will store 'single'/'both' for headlights, or window parts for tint
    fullName: '',
    phone: '',
    email: '',
    comments: ''
  });

  // 2. State for Wizard Navigation & UI
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for Inline Error Messages
  const [error, setError] = useState('');

  // Clear error when user changes steps or closes form
  useEffect(() => {
    setError('');
  }, [currentStep, open]);

  if (!open) return null;

  // --- Handlers ---

  const updateData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error if user starts typing
    if (error) setError('');
  };

  const handleNext = () => {
    setError(''); // Reset error before checking

    // VALIDATION: Step 1
    if (currentStep === 1) {
      if (!formData.suburb || !formData.vehicleReg) {
        return setError("Please fill in your suburb and vehicle details to continue.");
      }
      
      // NEW VALIDATION: Block if not Sydney
      if (formData.suburb.trim().toLowerCase() !== 'sydney') {
        return setError("Sorry, we currently only service the Sydney area.");
      }
    }
    
    // VALIDATION: Step 2
    if (currentStep === 2 && !formData.serviceType) {
      return setError("Please select a service type.");
    }
    
    // VALIDATION: Step 3
    // Only require 'repairPart' if we are NOT in 'wrap' mode
    if (currentStep === 3 && formData.serviceType !== 'wrap' && !formData.repairPart) {
      return setError("Please select an option to proceed.");
    }
    
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitToBackend = async () => {
    // Final Validation
    if (!formData.fullName || !formData.email) {
        return setError("Please fill in your name and email.");
    }

    setIsSubmitting(true);
    console.log("Sending final payload to backend:", formData);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Success handling
    setIsSubmitting(false);
    onClose();
    console.log("Success"); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Blur */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-1 font-black text-2xl tracking-tighter">
             <span className="text-black">OZ</span>
             <span className="text-red-600">TINT</span>
             <span className="text-black">&</span>
             <span className="text-red">WRAP</span>
            
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && <StepOne data={formData} update={updateData} />}
          {currentStep === 2 && <StepTwo data={formData} update={updateData} />}
          {currentStep === 3 && <StepThree data={formData} update={updateData} />}
          {currentStep === 4 && <StepFour data={formData} update={updateData} />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-xl">
          
          {/* Inline Error Message Display */}
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-red-600 rounded-full text-white p-0.5"><X size={12}/></div>
                {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            {currentStep > 1 ? (
                <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 font-bold hover:text-black px-4 py-2 uppercase text-sm tracking-wide"
                >
                Back
                </button>
            ) : ( <div></div> )}

            {currentStep < 4 ? (
                <button 
                onClick={handleNext}
                className="bg-white border-2 border-red-600 text-red-600 font-bold py-2 px-8 rounded hover:bg-red-600 hover:text-white transition uppercase text-sm tracking-wide"
                >
                Continue
                </button>
            ) : (
                <button 
                onClick={submitToBackend}
                disabled={isSubmitting}
                className="bg-red-600 text-white font-bold py-2 px-8 rounded hover:bg-red-700 transition uppercase text-sm tracking-wide disabled:opacity-50"
                >
                {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StepOne({ data, update }) {
  const quickSuburbs = ["Sydney", "Parramatta", "Blacktown", "Liverpool"];

  // Logic to check if suburb is Sydney (Case insensitive)
  const isSydney = data.suburb && data.suburb.trim().toLowerCase() === 'sydney';
  const hasInput = data.suburb && data.suburb.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-black mb-3 font-sans">1. Which suburb are you from?</h2>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">Your suburb</label>
        
        <div className="relative">
          <input
            type="text"
            value={data.suburb}
            onChange={(e) => update('suburb', e.target.value)}
            placeholder="Sydney NSW"
            className="w-full border bg-gray-50 border-gray-300 rounded p-3 pr-10 focus:outline-none focus:border-red-600 font-semibold text-gray-800"
          />
          {data.suburb && <button onClick={() => update('suburb', '')} className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500"><X size={20} /></button>}
        </div>

        {/* Quick Select Buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
            {quickSuburbs.map(sub => (
                <button 
                    key={sub}
                    onClick={() => update('suburb', sub)}
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${data.suburb === sub ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                >
                    {sub}
                </button>
            ))}
        </div>

        {/* UPDATED: Message Display Logic */}
        {hasInput && (
          <div className="mt-3 animate-in fade-in slide-in-from-bottom-2">
             {isSydney ? (
                <div className="border border-green-600 bg-green-50 text-green-800 px-3 py-2 text-sm rounded flex items-center gap-2 font-medium">
                   <div className="bg-green-600 rounded-full text-white p-0.5"><Check size={10} /></div>
                   Good news, we serve your area.
                </div>
             ) : (
                <div className="border border-red-600 bg-red-50 text-red-800 px-3 py-2 text-sm rounded flex items-center gap-2 font-medium">
                   <div className="bg-red-600 rounded-full text-white p-0.5"><X size={10} /></div>
                   We aren't available in your area.
                </div>
             )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold text-black mb-3 font-sans">2. Enter your vehicle details</h2>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">Car registration or VIN</label>
        <input
          type="text"
          value={data.vehicleReg}
          onChange={(e) => update('vehicleReg', e.target.value)}
          placeholder="2322"
          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-red-600 font-semibold"
        />
      </div>
    </div>
  );
}

function StepTwo({ data, update }) {
  const options = [
    { id: 'headlight', label: 'Headlight Restoration', sub: 'Restore clarity & brightness', icon: <Lightbulb size={48} className="text-yellow-500" /> },
    { id: 'tinting', label: 'Tinting', sub: 'Car Window Tinting', icon: <FileText size={48} className="text-red-400" /> },
    { id: 'wrap', label: 'Wrap', sub: 'Vinyl Car Wrapping', icon: <Layers size={48} className="text-purple-400" /> },
  ];

  const handleSelection = (id) => {
    if (data.serviceType !== id) {
        update('repairPart', ''); 
    }
    update('serviceType', id);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-black mb-6 font-sans">2. Which service do you need?</h2>
      <div className="space-y-4">
        {options.map((opt) => {
          const isSelected = data.serviceType === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelection(opt.id)}
              className={`
                relative cursor-pointer rounded-xl border-2 p-8 flex flex-col items-center justify-center text-center transition-all shadow-sm
                ${isSelected ? 'border-red-600 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 bg-red-600 rounded-full p-0.5">
                  <Check size={14} className="text-white" />
                </div>
              )}
              <div className="mb-4">{opt.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">{opt.label}</h3>
              <p className="text-gray-500 text-sm">{opt.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepThree({ data, update }) {
  // 1. Logic for WRAP
  if (data.serviceType === 'wrap') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center justify-center py-10 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Clock size={64} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-xs">
          This service will come soon. You can continue to leave your details if you'd like to be notified.
        </p>
      </div>
    );
  }

  const isHeadlight = data.serviceType === 'headlight';
  
  const headlightOptions = [
    { id: 'single', label: 'Single Headlight', sub: 'One side only' },
    { id: 'both', label: 'Both Headlights', sub: 'Left & Right sides' },
  ];

  const tintingOptions = [
    { id: '4door', label: '4 Door Car', sub: '5 windows in total' },
    { id: '2door', label: '2 Door Car', sub: '3 windows in total' },
    { id: 'partial', label: 'Partial Car', sub: 'Front or back windows only' },
    { id: 'other', label: 'Other', sub: 'Specific window(s) only' },
  ];

  const currentOptions = isHeadlight ? headlightOptions : tintingOptions;
  const title = isHeadlight ? "3. How many headlights?" : "3. What do you need tinted?";
  const IconComponent = isHeadlight ? Lightbulb : Car;

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-black mb-6 font-sans">{title}</h2>
      <div className="space-y-3">
        {currentOptions.map((part) => {
          const isSelected = data.repairPart === part.id;
          return (
            <div
              key={part.id}
              onClick={() => update('repairPart', part.id)}
              className={`
                relative cursor-pointer rounded-lg border-2 p-4 flex items-center justify-between transition-all
                ${isSelected ? 'border-red-600 bg-white' : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <div>
                <h4 className="font-semibold text-gray-800">{part.label}</h4>
                {part.sub && <p className="text-xs text-gray-500">{part.sub}</p>}
              </div>
              <div className="flex items-center gap-3">
                  <IconComponent size={32} className="text-gray-600" />
                  {isSelected && (
                    <div className="bg-red-600 rounded-full p-0.5">
                       <Check size={12} className="text-white" />
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepFour({ data, update }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-black mb-6 font-sans">5. Your contact details</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Full name <span className="text-red-600">*</span></label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-red-600"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Mobile or landline number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="Enter your number"
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-red-600"
          />
          <p className="text-xs text-gray-500 mt-1">So we can send you an sms link to your quote.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Email <span className="text-red-600">*</span></label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-red-600"
          />
          <p className="text-xs text-gray-500 mt-1">So we can send you an email link to your quote.</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-1">Additional comments</label>
          <textarea
            rows="3"
            value={data.comments}
            onChange={(e) => update('comments', e.target.value)}
            placeholder="Enter your comment"
            className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>
    </div>
  );
}