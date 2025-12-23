import React, { useState } from 'react';
import { 
  Mail, Lock, Calendar, Car, Trash2, Edit2, 
  X, CheckCircle, Loader2, AlertCircle, ArrowLeft 
} from 'lucide-react';

const ManageBooking = () => {
  // Steps: 'email', 'otp', 'dashboard', 'edit'
  const [step, setStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Data State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  // Styling Constants (Matching your BookingForm)
  const inputClass = "w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500";
  const btnClass = "w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2";

  // --- API HANDLERS ---

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      setStep('otp');
      setMessage(`Code sent to ${email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndLoad = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setBookings(data.bookings);
      setStep('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if(!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/cancel/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }) // Pass email for security check
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setBookings(prev => prev.filter(b => b._id !== id));
      alert("Booking cancelled successfully.");
    } catch (err) {
      alert(err.message);
    }
  };

  const updateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/update/${editingBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingBooking, emailVerification: email }) // Pass email for security
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Update local list
      setBookings(prev => prev.map(b => b._id === editingBooking._id ? data.booking : b));
      setEditingBooking(null);
      setStep('dashboard');
      alert("Booking updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER HELPERS ---

  const renderEditForm = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Edit Booking</h3>
        <button onClick={() => { setEditingBooking(null); setStep('dashboard'); }} className="p-2 hover:bg-slate-100 rounded-full">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={updateBooking} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Vehicle Model</label>
          <input 
            type="text" 
            value={editingBooking.model} 
            onChange={(e) => setEditingBooking({...editingBooking, model: e.target.value})}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">Preferred Date</label>
          <input 
            type="date" 
            value={editingBooking.date} 
            onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
            className={inputClass}
          />
        </div>
        
        {/* Only show relevant fields based on service type */}
        {editingBooking.serviceType === 'tint' && (
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Shade</label>
                <select 
                  value={editingBooking.selectedShade} 
                  onChange={(e) => setEditingBooking({...editingBooking, selectedShade: e.target.value})}
                  className={inputClass}
                >
                  <option value="5%">5%</option>
                  <option value="20%">20%</option>
                  <option value="35%">35%</option>
                  <option value="50%">50%</option>
                </select>
             </div>
             <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Coverage</label>
                <select 
                  value={editingBooking.selectedCoverage} 
                  onChange={(e) => setEditingBooking({...editingBooking, selectedCoverage: e.target.value})}
                  className={inputClass}
                >
                  <option value="Full Car">Full Car</option>
                  <option value="Two Front Windows">Two Front</option>
                  <option value="Rear Windshield">Rear</option>
                </select>
             </div>
          </div>
        )}

        <button type="submit" disabled={loading} className={btnClass}>
          {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
        </button>
      </form>
    </div>
  );

  return (
    <section className="py-20  bg-slate-50 min-h-[600px]">
      <div className="max-w-md mx-auto px-4">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Bookings</h2>
          <p className="text-slate-500 mt-2">View, edit, or cancel your upcoming services</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          
          {/* Global Error Display */}
          {error && (
            <div className="mb-6 bg-rose-50 text-rose-600 p-3 rounded-lg flex items-center text-sm border border-rose-100">
              <AlertCircle size={16} className="mr-2 shrink-0" /> {error}
            </div>
          )}

          {/* STEP 1: EMAIL */}
          {step === 'email' && (
            <form onSubmit={sendOtp} className="animate-in fade-in">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative mb-6">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className={`${inputClass} pl-10`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={verifyOtpAndLoad} className="animate-in fade-in">
              <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center">
                <CheckCircle size={16} className="mr-2" /> {message}
              </div>
              
              <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code</label>
              <div className="relative mb-6">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="123456"
                  className={`${inputClass} pl-10 tracking-widest`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Find Bookings'}
              </button>
              <button 
                type="button" 
                onClick={() => setStep('email')} 
                className="w-full mt-4 text-slate-500 text-sm hover:text-indigo-600"
              >
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3: DASHBOARD LIST */}
          {step === 'dashboard' && (
            <div className="animate-in fade-in">
              {bookings.length === 0 ? (
                 <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No active bookings found for this email.</p>
                    <button onClick={() => setStep('email')} className="text-indigo-600 font-bold hover:underline">Try another email</button>
                 </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border border-slate-100 bg-slate-50 rounded-xl p-4 relative group hover:shadow-md transition-all">
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white rounded border border-slate-200 text-slate-600">
                        {booking.status}
                      </div>

                      <h4 className="font-bold text-slate-800 mb-1">{booking.serviceName}</h4>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                        <Car size={14} /> {booking.year} {booking.make} {booking.model}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                        <Calendar size={14} /> {booking.date}
                      </div>

                      <div className="flex gap-2 border-t border-slate-200 pt-3">
                        <button 
                          onClick={() => { setEditingBooking(booking); setStep('edit'); }}
                          className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex justify-center items-center gap-2"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => cancelBooking(booking._id)}
                          className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-50 flex justify-center items-center gap-2"
                        >
                          <Trash2 size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setStep('email')} 
                    className="w-full mt-6 text-slate-400 text-sm hover:text-slate-600 flex items-center justify-center gap-2"
                  >
                   <ArrowLeft size={14}/> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: EDIT FORM */}
          {step === 'edit' && editingBooking && renderEditForm()}

        </div>
      </div>
    </section>
  );
};

export default ManageBooking;