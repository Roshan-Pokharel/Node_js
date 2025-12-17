import React, { useState, useEffect } from 'react';
import { X, Check, Car, FileText, Layers, Clock, Lightbulb, Send, Info } from 'lucide-react';

export default function FormOverlay({ open, onClose }) {
  // 1. State for Form Data
  const [formData, setFormData] = useState({
    suburb: "",
    vehicleReg: "",
    serviceType: "",
    repairPart: "",
    tintCondition: "", 
    fullName: "",
    phone: "",
    email: "",
    comments: ""
  });

  // 2. State for Wizard Navigation & UI
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Inline Error Messages
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [currentStep, open]);

  if (!open) return null;

  // --- Handlers ---
  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleNext = () => {
    setError("");

    // Step 1 Validation
    if (currentStep === 1) {
      if (!formData.suburb || !formData.vehicleReg) {
        return setError("Please provide your suburb and vehicle registration to proceed.");
      }
      if (formData.suburb.trim().toLowerCase() !== "sydney") {
        return setError("We currently only service the Sydney metropolitan area.");
      }
    }

    // Step 2 Validation
    if (currentStep === 2 && !formData.serviceType) {
      return setError("Please select a service type.");
    }

    // Step 3 Validation
    if (currentStep === 3) {
      if (formData.serviceType !== "wrap" && !formData.repairPart) {
        return setError("Please select an option to proceed.");
      }
      
      // Validation: Check tint condition for ANY tinting service
      if (formData.serviceType === "tinting" && !formData.tintCondition) {
        return setError("Please specify the current condition of your windows.");
      }
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitToBackend = async () => {
    if (!formData.fullName || !formData.email) {
      return setError("Please provide your name and email address.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsComplete(true);
      } else {
        setError(result.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Unable to connect to server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return <StepFive onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-1 font-black text-2xl tracking-tighter">
            <span className="text-black">OZ</span>
            <span className="text-red-600">TINT</span>
            <span className="text-black">&</span>
            <span className="text-red-600">WRAP</span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentStep === 1 && <StepOne data={formData} update={updateData} />}
          {currentStep === 2 && <StepTwo data={formData} update={updateData} />}
          {currentStep === 3 && <StepThree data={formData} update={updateData} />}
          {currentStep === 4 && <StepFour data={formData} update={updateData} />}
        </div>

        {/* Footer / Controls */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-1">
              <div className="bg-red-100 text-red-600 rounded-full p-1">
                <Info size={16} />
              </div>
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="text-gray-500 font-semibold hover:text-black px-4 py-2 text-sm transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="bg-white border-2 border-red-600 text-red-600 font-bold py-2.5 px-8 rounded-lg hover:bg-red-600 hover:text-white transition-all uppercase text-sm tracking-wide"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submitToBackend}
                disabled={isSubmitting}
                className="bg-red-600 text-white font-bold py-2.5 px-8 rounded-lg hover:bg-red-700 transition-all uppercase text-sm tracking-wide disabled:opacity-70 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? "Processing..." : "Submit Request"}
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
  const isSydney = data.suburb && data.suburb.trim().toLowerCase() === "sydney";
  const hasInput = data.suburb && data.suburb.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1 font-sans">Location</h2>
        <p className="text-gray-500 text-sm mb-4">Where is the vehicle located?</p>
        
        <label className="text-xs font-bold uppercase text-gray-500 mb-1.5 block tracking-wide">Suburb</label>
        <div className="relative">
          <input
            type="text"
            value={data.suburb}
            onChange={e => update("suburb", e.target.value)}
            placeholder="e.g. Sydney, NSW"
            className="w-full border bg-white border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 font-medium text-gray-800 transition-all"
          />
          {data.suburb && (
            <button
              onClick={() => update("suburb", "")}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {quickSuburbs.map(sub => (
            <button
              key={sub}
              onClick={() => update("suburb", sub)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                data.suburb === sub
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {hasInput && (
          <div className="mt-3 animate-in fade-in slide-in-from-bottom-2">
            {isSydney ? (
              <div className="bg-green-50 text-green-700 px-3 py-2 text-sm rounded-lg flex items-center gap-2 font-medium border border-green-200">
                <Check size={14} className="text-green-600" />
                Excellent, we service your area.
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 px-3 py-2 text-sm rounded-lg flex items-center gap-2 font-medium border border-red-200">
                <X size={14} className="text-red-600" />
                Sorry, we are not available in this area yet.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-1 font-sans">Vehicle Details</h2>
        <p className="text-gray-500 text-sm mb-4">Identify the car tailored for the service.</p>
        
        <label className="text-xs font-bold uppercase text-gray-500 mb-1.5 block tracking-wide">Registration or Model</label>
        <input
          type="text"
          value={data.vehicleReg}
          onChange={e => update("vehicleReg", e.target.value)}
          placeholder="e.g. Toyota Camry or Plate #"
          className="w-full border bg-white border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 font-medium text-gray-800 transition-all"
        />
      </div>
    </div>
  );
}

function StepTwo({ data, update }) {
  const options = [
    { id: "headlight", label: "Headlight Restoration", sub: "Restore clarity & safety", icon: <Lightbulb size={40} className="text-yellow-500" /> },
    { id: "tinting", label: "Window Tinting", sub: "UV Protection & Privacy", icon: <FileText size={40} className="text-red-500" /> },
    { id: "wrap", label: "Vehicle Wrap", sub: "Color Change & Branding", icon: <Layers size={40} className="text-purple-500" /> }
  ];

  const handleSelection = id => {
    if (data.serviceType !== id) {
      update("repairPart", "");
      update("tintCondition", "");
    }
    update("serviceType", id);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans">Select Service</h2>
      <p className="text-gray-500 text-sm mb-6">What can we do for your vehicle today?</p>
      
      <div className="grid gap-4">
        {options.map(opt => {
          const isSelected = data.serviceType === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelection(opt.id)}
              className={`relative cursor-pointer rounded-xl border-2 p-5 flex items-center gap-5 transition-all shadow-sm group ${
                isSelected 
                  ? "border-red-600 bg-red-50/10 ring-1 ring-red-100" 
                  : "border-gray-100 bg-white hover:border-red-200 hover:shadow-md"
              }`}
            >
              <div className={`p-3 rounded-full ${isSelected ? "bg-red-50" : "bg-gray-50 group-hover:bg-white transition"}`}>
                {opt.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className={`text-lg font-bold ${isSelected ? "text-red-900" : "text-gray-900"}`}>{opt.label}</h3>
                <p className="text-gray-500 text-sm">{opt.sub}</p>
              </div>
              {isSelected && (
                <div className="text-red-600">
                  <Check size={24} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepThree({ data, update }) {
  // Logic for Wraps (Coming Soon)
  if (data.serviceType === "wrap") {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center justify-center py-10 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <Clock size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Service Coming Soon</h2>
        <p className="text-gray-500 max-w-xs leading-relaxed">
          We are currently setting up our wrapping bay. Please feel free to submit your details to join our waitlist.
        </p>
      </div>
    );
  }

  const isHeadlight = data.serviceType === "headlight";

  const headlightOptions = [
    { id: "single", label: "Single Headlight", sub: "Left or Right side" },
    { id: "both", label: "Both Headlights", sub: "Complete restoration" }
  ];

  const tintingOptions = [
    { id: "4door", label: "Sedan / Hatch (4 Door)", sub: "Full tint (approx 5 windows)" },
    { id: "2door", label: "Coupe / Ute (2 Door)", sub: "Full tint (approx 3 windows)" },
    { id: "partial", label: "Partial Tint", sub: "Front pair or Rear section only" },
    { id: "other", label: "Custom Request", sub: "Sunroof, windscreen strip, etc." }
  ];

  const currentOptions = isHeadlight ? headlightOptions : tintingOptions;
  const title = isHeadlight ? "Headlight Options" : "Select Tint Coverage";
  const desc = isHeadlight ? "How many lights need restoring?" : "Which windows require tinting?";
  const IconComponent = isHeadlight ? Lightbulb : Car;

  const handlePartSelect = (id) => {
    update("repairPart", id);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans">{title}</h2>
      <p className="text-gray-500 text-sm mb-6">{desc}</p>

      <div className="space-y-3">
        {currentOptions.map(part => {
          const isSelected = data.repairPart === part.id;

          return (
            <div
              key={part.id}
              onClick={() => handlePartSelect(part.id)}
              className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                isSelected
                  ? "border-red-600 bg-white ring-1 ring-red-50"
                  : "border-gray-200 bg-white hover:border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`font-bold text-base ${isSelected ? "text-red-900" : "text-gray-800"}`}>
                    {part.label}
                  </h4>
                  {part.sub && <p className="text-sm text-gray-500 mt-0.5">{part.sub}</p>}
                </div>

                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <div className="bg-red-600 rounded-full p-1 shadow-sm"><Check size={14} className="text-white" /></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                </div>
              </div>

              {/* --- TINT CONDITION OPTIONS (Updated Text) --- */}
              {isSelected && !isHeadlight && (
                <div 
                  className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <p className="font-bold text-gray-800 text-sm mb-3">Current Glass Condition:</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => update('tintCondition', 'none')}
                      className={`p-3 rounded-lg text-sm font-medium border transition-all text-left flex items-center justify-between ${
                        data.tintCondition === 'none'
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50'
                      }`}
                    >
                      <span>Glass is clear (No old tint)</span>
                      {data.tintCondition === 'none' && <Check size={16} />}
                    </button>
                    <button
                      onClick={() => update('tintCondition', 'stripping')}
                      className={`p-3 rounded-lg text-sm font-medium border transition-all text-left flex items-center justify-between ${
                        data.tintCondition === 'stripping'
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50'
                      }`}
                    >
                      <span>Old tint needs removal/stripping</span>
                      {data.tintCondition === 'stripping' && <Check size={16} />}
                    </button>
                  </div>
                </div>
              )}
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
      <h2 className="text-xl font-bold text-gray-900 mb-2 font-sans">Contact Details</h2>
      <p className="text-gray-500 text-sm mb-6">Where should we send your quote?</p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wide">Full Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            value={data.fullName}
            onChange={e => update("fullName", e.target.value)}
            placeholder="John Doe"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wide">Phone Number</label>
          <input
            type="tel"
            value={data.phone}
            onChange={e => update("phone", e.target.value)}
            placeholder="0400 000 000"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
          />
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Info size={12} /> Used for quote questions only. No spam.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wide">Email Address <span className="text-red-600">*</span></label>
          <input
            type="email"
            value={data.email}
            onChange={e => update("email", e.target.value)}
            placeholder="john@example.com"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">We will email the quote to this address.</p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wide">Notes / Special Requests</label>
          <textarea
            rows={3}
            value={data.comments}
            onChange={e => update("comments", e.target.value)}
            placeholder="Any specific details about your car or the service required..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

function StepFive({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] text-center p-12 animate-in fade-in zoom-in duration-500">
        <div className="mb-6 mx-auto p-5 rounded-full bg-green-50 border-4 border-green-100">
          <Send size={56} className="text-green-600" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-green-700 mb-3 font-sans">Request Received!</h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Thanks for reaching out. Our team is reviewing your vehicle details and will send your personalized quote shortly.
        </p>
        
        <button
          onClick={onClose}
          className="bg-gray-700 text-white font-bold py-3.5 px-10 rounded-lg hover:bg-gray-800 transition-all uppercase text-sm tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}