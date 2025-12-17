import React, { useState } from 'react';

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

  const [message, setMessage] = useState('');

  // Common Tailwind classes for inputs to keep code clean
  const inputClass = "w-full p-3 mb-[15px] bg-slate-50 border border-[#3e3e4a] rounded-md text-slate-900 text-base transition-colors focus:outline-none focus:border-[#6c5ce7] box-border";
  const labelClass = "block mb-1.5 font-medium text-[#a0a0b0] text-[0.9rem]";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    let name = '';
    
    if (value === 'tint') name = 'Window Tinting';
    else if (value === 'restoration') name = 'Headlight Restoration';
    else if (value === 'wrap') name = 'Vehicle Wrap';

    setFormData(prev => ({
      ...prev,
      serviceType: value,
      serviceName: name,
      selectedShade: '',
      selectedCoverage: '',
      selectedHeadlights: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.serviceType === 'wrap') {
      alert("Vehicle Wrap is coming soon!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Booking submitted successfully!');
        setFormData({ ...formData, firstName: '', lastName: '', email: '', phone: '' });
      } else {
        setMessage('Failed to submit booking.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error occurred.');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto my-10 p-[30px] mb-20 bg-slate-100 text-slate-900 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.5)] font-sans">
      
      <h2 className="text-slate-900 text-2xl font-bold mb-5 text-center">Book Your Service</h2>

      <form onSubmit={handleSubmit}>
        {/* --- Service Selection --- */}
        <div>
          <label className={labelClass}>Select Service</label>
          <select 
            name="serviceType" 
            value={formData.serviceType} 
            onChange={handleServiceChange}
            className={inputClass}
            required
          >
            <option value="">-- Choose a Service --</option>
            <option value="tint">Window Tinting</option>
            <option value="restoration">Headlight Restoration</option>
            <option value="wrap">Vehicle Wrap</option>
          </select>
        </div>

        {/* --- Tint Logic --- */}
        {formData.serviceType === 'tint' && (
          <div className="bg-slate-50 p-[15px] rounded-lg border-l-4 border-[#6c5ce7] mb-5">
            <h4 className="text-slate-900 text-lg font-semibold mb-5 text-center">Window Tint Options</h4>
            <div className="flex gap-[15px]">
              <div className="flex-1">
                <label className={labelClass}>Shade Percentage</label>
                <select name="selectedShade" value={formData.selectedShade} onChange={handleChange} className={inputClass} required>
                  <option value="">Select Shade</option>
                  <option value="5%">5% (Limo Dark)</option>
                  <option value="20%">20% (Dark)</option>
                  <option value="35%">35% (Medium)</option>
                  <option value="50%">50% (Light)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className={labelClass}>Coverage Area</label>
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

        {/* --- Restoration Logic --- */}
        {formData.serviceType === 'restoration' && (
          <div className="bg-slate-50 p-[15px] rounded-lg border-l-4 border-[#6c5ce7] mb-5">
             <h4 className="text-slate-900 text-lg font-semibold mb-5 text-center">Headlight Restoration</h4>
             <label className={labelClass}>Which headlights need restoring?</label>
             <select name="selectedHeadlights" value={formData.selectedHeadlights} onChange={handleChange} className={inputClass} required>
                <option value="">Select Option</option>
                <option value="Single">Single Headlight</option>
                <option value="Both">Both Headlights</option>
              </select>
          </div>
        )}

        {/* --- Wrap Logic (Blocking) --- */}
        {formData.serviceType === 'wrap' && (
          <div className="bg-[#3d3d29] text-[#ffd700] p-5 rounded-lg text-center border border-[#665c20]">
            <h3 className="text-xl font-bold mb-2">🚧 Coming Soon 🚧</h3>
            <p>Vehicle Wrap services are currently unavailable. Please check back later!</p>
          </div>
        )}

        {/* --- General Fields (Hidden if Wrap is selected) --- */}
        {formData.serviceType && formData.serviceType !== 'wrap' && (
          <>
            <div className="flex gap-[15px]">
              <div className="flex-1">
                <label className={labelClass}>Make</label>
                <input type="text" name="make" placeholder="e.g. Toyota" value={formData.make} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Model</label>
                <input type="text" name="model" placeholder="e.g. Camry" value={formData.model} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div className="flex gap-[15px]">
               <div className="flex-1">
                <label className={labelClass}>Year</label>
                <input type="number" name="year" placeholder="2022" value={formData.year} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Preferred Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <h4 className="text-slate-900 text-lg font-semibold mb-5 mt-5 border-b border-[#3e3e4a] pb-2.5">Contact Info</h4>
            
            <div className="flex gap-[15px]">
              <div className="flex-1">
                <label className={labelClass}>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <label className={labelClass}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />

            <label className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} required />

            <button 
              type="submit" 
              className="w-full p-3.5 bg-[#6c5ce7] text-white rounded-md text-[1.1rem] font-bold cursor-pointer transition-colors hover:bg-[#5a4ad1] mt-2.5"
            >
              Confirm Booking
            </button>
          </>
        )}
      </form>

      {message && (
        <p className={`text-center mt-[15px] font-bold ${message.includes('success') ? 'text-[#00b894]' : 'text-[#ff7675]'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default BookingForm;