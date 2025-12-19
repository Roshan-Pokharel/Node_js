import React, { useState, useEffect  } from 'react';
import { 
  Calendar, 
  Car, 
  User, 
  Mail, 
  Phone, 
  Info, 
  Loader2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';



const BookingForm = () => {


  const [formData, setFormData] = useState({
    serviceType: '', 
    serviceName: '', 
    selectedShade: '',
    selectedCoverage: '',
    selectedHeadlights: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    make: '',
    model: '',
    year: '',
    date: ''
  });





  // State management to match InformationDetail.jsx pattern
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Enhanced Tailwind classes
  const inputClass =
  "w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900 text-base md:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400";

  const labelClass = "flex items-center gap-2 mb-2 font-semibold text-slate-700 text-sm";
  const sectionWrapper = "bg-white p-6 rounded-xl border border-slate-100 shadow-sm mb-6";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    const names = { tint: 'Window Tinting', restoration: 'Headlight Restoration', wrap: 'Vehicle Wrap' };
    setFormData(prev => ({
      ...prev,
      serviceType: value,
      serviceName: names[value] || '',
      selectedShade: '',
      selectedCoverage: '',
      selectedHeadlights: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.serviceType === 'wrap') return;

    // Set loading state and clear previous errors
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      // If successful, switch to success view
      setStatus('success');
      
    } catch (error) {
      console.error("Booking Error:", error);
      setStatus('error');
      setErrorMessage('Network error. Please try again or check your connection.');
    }
  };

  const resetForm = () => {
    setFormData({
      serviceType: '', 
      serviceName: '', 
      selectedShade: '',
      selectedCoverage: '',
      selectedHeadlights: '',
      firstName: '', 
      lastName: '', 
      email: '', 
      phone: '', 
      make: '', 
      model: '', 
      year: '', 
      date: ''
    });
    setStatus('idle');
  };

 useEffect(() => {
  if (status === 'success') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}, [status]);



  // --- SUCCESS VIEW (Replaces Form on Success) ---
  if (status === 'success') {
    return (
      <div  className="max-w-2xl mx-auto my-12 p-10 bg-white text-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 font-sans text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Booking Confirmed!</h2>
        <p className="text-slate-600 mb-8">
          We have received your request for <strong>{formData.serviceName}</strong>. 
          Our team will contact you shortly at <strong>{formData.phone}</strong>.
        </p>
        <button 
          onClick={resetForm}
          className="w-full py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all"
        >
          Book Another Service
        </button>
      </div>
    );
  }

 


  return (
    <div className="max-w-2xl  mx-auto my-12 p-4 md:p-10 bg-slate-50 text-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white font-sans ">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Book Your Service</h2>
        <div className="h-1 w-12 bg-indigo-500 mx-auto mt-3 rounded-full"></div>
        <p className="text-slate-500 mt-4 text-sm">Professional automotive care at your fingertips.</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* --- Error Message Display --- */}
        {status === 'error' && (
          <div className="mb-6 bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center border border-rose-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* --- Service Selection --- */}
        <div className="mb-8">
          <label className={labelClass}><Info size={16} className="text-indigo-500"/> Select Service</label>
          <select 
            name="serviceType" 
            value={formData.serviceType} 
            onChange={handleServiceChange}
            className={`${inputClass} h-[52px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat`}
            required
          >
            <option value="">-- Choose a Service --</option>
            <option value="tint">Window Tinting</option>
            <option value="restoration">Headlight Restoration</option>
            <option value="wrap">Vehicle Wrap (Coming Soon)</option>
          </select>
        </div>

        {/* --- Dynamic Options (Tint/Restoration) --- */}
        {formData.serviceType === 'tint' && (
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-indigo-900 text-sm font-bold uppercase tracking-wider mb-4">Tint Customization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-indigo-700 mb-1 block">Shade Percentage</label>
                <select name="selectedShade" value={formData.selectedShade} onChange={handleChange} className={inputClass} required>
                  <option value="">Select Shade</option>
                  <option value="5%">5% (Limo Dark)</option>
                  <option value="20%">20% (Dark)</option>
                  <option value="35%">35% (Medium)</option>
                  <option value="50%">50% (Light)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-700 mb-1 block">Coverage Area</label>
                <select name="selectedCoverage" value={formData.selectedCoverage} onChange={handleChange} className={inputClass} required>
                  <option value="">Select Coverage</option>
                  <option value="Full Car">Full Car</option>
                  <option value="Two Front Windows">Two Front Windows</option>
                  <option value="Rear Windshield">Rear Windshield</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {formData.serviceType === 'restoration' && (
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 mb-8 animate-in fade-in duration-300">
             <label className="text-xs font-bold text-indigo-700 mb-1 block">Headlight Selection</label>
             <select name="selectedHeadlights" value={formData.selectedHeadlights} onChange={handleChange} className={inputClass} required>
                <option value="">Which headlights need restoring?</option>
                <option value="Single">Single Headlight</option>
                <option value="Both">Both Headlights</option>
              </select>
          </div>
        )}

        {/* --- Wrap Blocking --- */}
        {formData.serviceType === 'wrap' && (
          <div className="bg-amber-50 text-amber-700 p-8 rounded-2xl text-center border border-amber-200 mb-8">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="text-lg font-bold">Coming Soon</h3>
            <p className="text-sm opacity-80">Our wrap shop is currently undergoing upgrades. Stay tuned!</p>
          </div>
        )}

        {/* --- Main Fields --- */}
        {formData.serviceType && formData.serviceType !== 'wrap' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Vehicle Section */}
            <div className={sectionWrapper}>
              <h4 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b border-slate-50 pb-2">
                <Car size={18} className="text-indigo-500"/> Vehicle Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Make</label>
                  <input type="text" name="make" placeholder="Toyota" value={formData.make} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Model</label>
                  <input type="text" name="model" placeholder="Camry" value={formData.model} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Year</label>
                  <input type="number" name="year" placeholder="2022" value={formData.year} onChange={handleChange} className={inputClass} required />
                </div>
              </div>
              <div className="mt-4">
                <label className={labelClass}><Calendar size={16} className="text-indigo-500"/> Preferred Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            {/* Contact Section */}
            <div className={sectionWrapper}>
              <h4 className="flex items-center gap-2 text-slate-800 font-bold mb-4 border-b border-slate-50 pb-2">
                <User size={18} className="text-indigo-500"/> Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className={inputClass} required />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-slate-400"/>
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className={`${inputClass} pl-10`} required />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3.5 text-slate-400"/>
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className={`${inputClass} pl-10`} required />
                </div>
              </div>
            </div>

            {/* --- Updated Button with Loading State --- */}
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold cursor-pointer transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingForm;