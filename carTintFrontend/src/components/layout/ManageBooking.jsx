import React, { useState } from 'react';
import { 
  Mail, Lock, Calendar, Car, Trash2, Edit2, 
  X, CheckCircle, Loader2, AlertCircle, ArrowLeft, Info
} from 'lucide-react';

// --- FIXED: MODAL COMPONENT MOVED OUTSIDE ---
// Moving this outside the main component prevents re-rendering issues 
// that cause the mobile keyboard to close while typing.
const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20}/>
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const ManageBooking = () => {
  // --- STATE ---
  const [step, setStep] = useState('email'); // 'email', 'otp', 'dashboard', 'edit'
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [bookings, setBookings] = useState([]);
  
  // Modal States
  const [editingBooking, setEditingBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  // Alert/Notification State
  const [alert, setAlert] = useState({ show: false, type: '', message: '' }); 

  // Styles
  const inputClass = "w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500";
  const btnClass = "w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2";

  // --- HELPER: CUSTOM ALERT ---
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // --- API HANDLERS ---

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      setStep('otp');
      showAlert('success', `Verification code sent to ${email}`);
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndLoad = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Cancel Modal
  const initiateCancel = (id) => {
    setBookingToCancel(id);
    setCancelReason('');
    setShowCancelModal(true);
  };

  // Submit Cancellation with Reason
  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      showAlert('error', "Please provide a reason for cancellation.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/cancel/${bookingToCancel}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason: cancelReason }) 
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setBookings(prev => prev.filter(b => b._id !== bookingToCancel));
      showAlert('success', "Booking cancelled successfully.");
      setShowCancelModal(false);
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/manage/update/${editingBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingBooking, emailVerification: email }) 
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setBookings(prev => prev.map(b => b._id === editingBooking._id ? data.booking : b));
      setEditingBooking(null); // Close modal
      showAlert('success', "Booking updated successfully!");
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logic to switch services in Edit Mode
  const handleEditServiceChange = (e) => {
    const value = e.target.value;
    const names = { tint: 'Window Tinting', restoration: 'Headlight Restoration', wrap: 'Vehicle Wrap' };
    setEditingBooking(prev => ({
      ...prev,
      serviceType: value,
      serviceName: names[value] || '',
      selectedShade: '', 
      selectedCoverage: '', 
      selectedHeadlights: '' 
    }));
  };

  // --- RENDER SECTIONS ---

  // Custom Alert Popup
  const renderAlert = () => {
    if (!alert.show) return null;
    return (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 w-[90%] max-w-[400px]">
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border ${alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {alert.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
          <span className="font-semibold text-sm">{alert.message}</span>
        </div>
      </div>
    );
  };

  // Full Edit Form
  const renderEditForm = () => (
    <form onSubmit={updateBooking} className="space-y-4">
      {/* 1. Service Details */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Service Info</h4>
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-500 mb-1 block">Service Type</label>
          <select 
            value={editingBooking.serviceType || ''} 
            onChange={handleEditServiceChange}
            className={inputClass}
          >
             <option value="tint">Window Tinting</option>
             <option value="restoration">Headlight Restoration</option>
          </select>
        </div>

        {editingBooking.serviceType === 'tint' && (
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Shade</label>
                <select 
                  value={editingBooking.selectedShade || ''} 
                  onChange={(e) => setEditingBooking({...editingBooking, selectedShade: e.target.value})}
                  className={inputClass}
                >
                  <option value="">Select Shade</option>
                  <option value="5%">5% (Limo)</option>
                  <option value="20%">20% (Dark)</option>
                  <option value="35%">35% (Medium)</option>
                  <option value="50%">50% (Light)</option>
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Coverage</label>
                <select 
                  value={editingBooking.selectedCoverage || ''} 
                  onChange={(e) => setEditingBooking({...editingBooking, selectedCoverage: e.target.value})}
                  className={inputClass}
                >
                   <option value="">Select Coverage</option>
                  <option value="Full Car">Full Car</option>
                  <option value="Two Front Windows">Two Front</option>
                  <option value="Rear Windshield">Rear</option>
                </select>
             </div>
          </div>
        )}
        
        {editingBooking.serviceType === 'restoration' && (
           <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Headlights</label>
              <select 
                value={editingBooking.selectedHeadlights || ''} 
                onChange={(e) => setEditingBooking({...editingBooking, selectedHeadlights: e.target.value})}
                className={inputClass}
              >
                <option value="Single">Single Headlight</option>
                <option value="Both">Both Headlights</option>
              </select>
           </div>
        )}
      </div>

      {/* 2. Vehicle Details */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Vehicle</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Year</label>
            <input type="text" value={editingBooking.year} onChange={(e) => setEditingBooking({...editingBooking, year: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Make</label>
            <input type="text" value={editingBooking.make} onChange={(e) => setEditingBooking({...editingBooking, make: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Model</label>
            <input type="text" value={editingBooking.model} onChange={(e) => setEditingBooking({...editingBooking, model: e.target.value})} className={inputClass} />
          </div>
        </div>
      </div>

      {/* 3. Contact Details */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Contact</h4>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input type="text" placeholder="First Name" value={editingBooking.firstName} onChange={(e) => setEditingBooking({...editingBooking, firstName: e.target.value})} className={inputClass} />
          <input type="text" placeholder="Last Name" value={editingBooking.lastName} onChange={(e) => setEditingBooking({...editingBooking, lastName: e.target.value})} className={inputClass} />
        </div>
        <input type="tel" placeholder="Phone" value={editingBooking.phone} onChange={(e) => setEditingBooking({...editingBooking, phone: e.target.value})} className={inputClass} />
      </div>

      {/* 4. Date */}
      <div>
        <label className="text-sm font-bold text-slate-700 mb-1 block">Preferred Date</label>
        <input 
          type="date" 
          value={editingBooking.date} 
          onChange={(e) => setEditingBooking({...editingBooking, date: e.target.value})}
          className={inputClass}
        />
      </div>

      <button type="submit" disabled={loading} className={btnClass}>
        {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
      </button>
    </form>
  );

  return (
    <section className="py-20 bg-slate-50 min-h-[600px]">
      {renderAlert()}
      
      {/* --- EDIT MODAL --- */}
      <Modal isOpen={!!editingBooking} title="Edit Booking" onClose={() => setEditingBooking(null)}>
        {editingBooking && renderEditForm()}
      </Modal>

      {/* --- CANCEL REASON MODAL --- */}
      <Modal isOpen={showCancelModal} title="Cancel Booking" onClose={() => setShowCancelModal(false)}>
        <p className="text-slate-600 mb-4 text-sm">Are you sure you want to cancel this booking? This action cannot be undone.</p>
        
        <label className="text-sm font-bold text-slate-700 mb-2 block">Reason for Cancellation <span className="text-red-500">*</span></label>
        <textarea 
          className={`${inputClass} min-h-[100px] resize-none`} 
          placeholder="E.g., Changed my mind, Sold the car, etc."
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        ></textarea>
        
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Keep Booking</button>
          <button onClick={confirmCancel} disabled={loading} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 flex justify-center items-center gap-2 transition-colors shadow-lg shadow-red-200">
            {loading ? <Loader2 className="animate-spin" size={18}/> : 'Confirm Cancellation'}
          </button>
        </div>
      </Modal>

      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Manage Bookings</h2>
          <p className="text-slate-500 mt-2">View, edit, or cancel your upcoming services</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          
          {/* STEP 1: EMAIL */}
          {step === 'email' && (
            <form onSubmit={sendOtp} className="animate-in fade-in">
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative mb-6">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" required placeholder="name@example.com"
                  className={`${inputClass} pl-10`}
                  value={email} onChange={(e) => setEmail(e.target.value)}
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
                <Info size={16} className="mr-2" /> Code sent to {email}
              </div>
              
              <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code</label>
              <div className="relative mb-6">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="text" required placeholder="123456"
                  className={`${inputClass} pl-10 tracking-widest text-lg`}
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Find Bookings'}
              </button>
              <button type="button" onClick={() => setStep('email')} className="w-full mt-4 text-slate-500 text-sm hover:text-indigo-600">
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3: DASHBOARD */}
          {step === 'dashboard' && (
            <div className="animate-in fade-in">
              {bookings.length === 0 ? (
                 <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">No active bookings found.</p>
                    <button onClick={() => setStep('email')} className="text-indigo-600 font-bold hover:underline">Try another email</button>
                 </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border border-slate-100 bg-slate-50 rounded-xl p-4 relative group hover:shadow-md transition-all">
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                        booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                        booking.status === 'Accepted' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-white text-slate-600 border-slate-200'
                      }`}>
                        {booking.status || 'Pending'}
                      </div>

                      <h4 className="font-bold text-slate-800 mb-1">{booking.serviceName}</h4>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mb-1">
                        <Car size={14} /> {booking.year} {booking.make} {booking.model}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                        <Calendar size={14} /> {booking.date}
                      </div>

                      <div className="flex gap-2 border-t border-slate-200 pt-3">
                        {/* --- EDITED: DISABLE EDIT IF COMPLETED --- */}
                        <button 
                          onClick={() => booking.status !== 'Completed' && setEditingBooking(booking)}
                          disabled={booking.status === 'Completed'}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors ${
                            booking.status === 'Completed' 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent' 
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        
                        {/* Only show Cancel if NOT Completed */}
                        {booking.status !== 'Completed' && (
                          <button 
                            onClick={() => initiateCancel(booking._id)}
                            className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-50 flex justify-center items-center gap-2 transition-colors"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                        )}
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
        </div>
      </div>
    </section>
  );
};

export default ManageBooking;