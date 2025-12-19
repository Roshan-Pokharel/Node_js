import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Car, 
  Calendar, 
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

const SERVICE_TITLES = {
  tint: "Window Tinting",
  wrap: "Vinyl Wrap",
  restoration: "Headlight Restoration"
};

const InformationDetail = () => {
  const successRef = useRef(null);
  const location = useLocation();
  const selectedShade = location.state?.shade;
  const selectedCoverage = location.state?.coverage;
  const selectedHeadlights = location.state?.headlights;
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const serviceTitle = SERVICE_TITLES[serviceId] || "Premium Service";

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    make: '',
    model: '', // Added separate model field for clarity
    year: '',
    date: '',
    selectedShade: selectedShade || '' ,
    selectedCoverage: selectedCoverage || '',
    selectedHeadlights: selectedHeadlights || ''
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // REPLACE with your actual Backend URL
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceType: serviceId,
          serviceName: serviceTitle,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      // If successful:
      setStatus('success');
      
    } catch (error) {
      console.error("Booking Error:", error);
      setStatus('error');
      setErrorMessage("Something went wrong. Please try again or call us directly.");
    }
  };

 useEffect(() => {
  if (status === 'success' && successRef.current) {
    successRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}, [status]);



  // ---------------- SUCCESS VIEW ----------------
  if (status === 'success') {
    return (
      <div ref={successRef} className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">
            We have received your request for <strong>{serviceTitle}</strong>. 
            Our team will contact you shortly at <strong>{formData.phone}</strong>.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-10">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Details</span>
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Step 2 of 2</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2 mb-4">
            Finalize Your Booking
          </h1>
          <p className="text-gray-500 text-lg">
            Complete the form below to schedule your <span className="font-bold text-gray-800">{serviceTitle}</span>.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 px-8 py-4">
             <h3 className="text-white font-medium flex items-center">
               <Calendar className="w-5 h-5 mr-2 text-blue-400"/> Request Appointment
             </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Error Message Display */}
            {status === 'error' && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {errorMessage}
              </div>
            )}

            {/* Section: Personal Info */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Contact Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      required name="firstName" type="text" placeholder="John"
                      value={formData.firstName} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <input 
                    required name="lastName" type="text" placeholder="Doe"
                    value={formData.lastName} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      required name="email" type="email" placeholder="john@example.com"
                      value={formData.email} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      required name="phone" type="tel" placeholder="(555) 123-4567"
                      value={formData.phone} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Vehicle Info */}
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Vehicle Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Year */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Year</label>
                  <input 
                    required name="year" type="number" placeholder="2023"
                    value={formData.year} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Make */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Make</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Car className="w-5 h-5 text-gray-400" />
                    </div>
                    <input 
                      required name="make" type="text" placeholder="Toyota"
                      value={formData.make} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Model</label>
                  <input 
                    required name="model" type="text" placeholder="Camry"
                    value={formData.model} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Section: Date */}
            <div>
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Preferred Date</h4>
               <input 
                  required name="date" type="date"
                  value={formData.date} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Appointment"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default InformationDetail;