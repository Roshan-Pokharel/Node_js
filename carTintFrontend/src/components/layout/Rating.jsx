import React, { useState } from 'react';
import { Star, Mail, CheckCircle, ShieldCheck, Car, User } from 'lucide-react'; // Added icons for better UI

function Rating() {
  const [step, setStep] = useState('start');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [reviewData, setReviewData] = useState({
    name: '',
    carModel: '',
    rating: 0,
    review: ''
  });
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ... (Keep your existing handleGenerateOTP, handleVerifyOTP, handleSubmitReview functions here) ...

  const handleGenerateOTP = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }), 
      });
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setStep('otp_sent');
      } else {
        setMessage(data.message);
      }
    } catch(e) {
      setMessage('Failed to connect to server.', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userOtp: otpInput, email: email }),
      });
      const data = await response.json();
      if (data.success) {
        setStep('verified');
        setMessage('');
      } else {
        setMessage('Incorrect OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if(reviewData.rating === 0) {
        setMessage('Please select a star rating.');
        return;
    }
    setLoading(true);
    try {
      const finalData = { ...reviewData, email: email };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      const data = await response.json();
      if (data.success) {
        setStep('finished');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  // Helper for step indicator styling
  const getStepClass = (current) => {
    const steps = ['start', 'otp_sent', 'verified', 'finished'];
    const currentIndex = steps.indexOf(step);
    const targetIndex = steps.indexOf(current);
    if (currentIndex >= targetIndex) return "bg-blue-600 text-white";
    return "bg-gray-200 text-gray-500";
  };

  return (
    <div className="min-h-auto md:min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      {/* Container - Wider on Desktop (max-w-2xl) */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden max-w-2xl w-full border border-gray-100 transition-all duration-300">
        
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-gray-150 to-gray-100 py-8 px-4 text-center">
          <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight">Oz Tint & Wrap</h1>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Verification & Review</p>
        </div>

        {/* Step Indicator (Desktop Only) */}
        <div className="hidden md:flex justify-between px-12 py-6 bg-gray-50 border-b border-gray-200">
          {['Email', 'Verify', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center space-x-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${getStepClass(['start', 'otp_sent', 'verified'][i])}`}>
                {i + 1}
              </div>
              <span className="text-sm font-medium text-gray-600">{label}</span>
              {i < 2 && <div className="w-12 h-px bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>

        <div className="p-8 md:p-12">
          
          {/* VIEW 1: EMAIL */}
          {step === 'start' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                  <Mail size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Secure Verification</h3>
                <p className="text-gray-500 mt-2">Enter your email to ensure your review is verified.</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. michael@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <button 
                  onClick={handleGenerateOTP} 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 transform hover:-translate-y-0.5 disabled:bg-gray-400"
                >
                  {loading ? 'Processing...' : 'Send My Code'}
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: OTP */}
          {step === 'otp_sent' && (
            <div className="text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Check Your Inbox</h3>
              <p className="text-gray-500 mt-2 mb-8">Verification code sent to <span className="text-blue-600 font-semibold">{email}</span></p>
              
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="000000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength="6"
                  className="w-full text-center text-4xl font-mono tracking-[0.5em] border-2 border-gray-200 rounded-xl p-4 focus:border-blue-500 outline-none mb-6"
                />
                <button 
                  onClick={handleVerifyOTP} 
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
                <button onClick={() => setStep('start')} className="mt-6 text-sm text-gray-400 hover:text-blue-500 transition-colors">
                  Wrong email? Click to go back
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: REVIEW FORM - Best Desktop Upgrade */}
          {step === 'verified' && (
            <form onSubmit={handleSubmitReview} className="animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Share Your Experience</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <User size={16} className="mr-2" /> Your Name
                  </label>
                  <input
                    name="name"
                    value={reviewData.name}
                    onChange={handleReviewChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Car size={16} className="mr-2" /> Car Model
                  </label>
                  <input
                    name="carModel"
                    value={reviewData.carModel}
                    onChange={handleReviewChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Tesla Model 3"
                  />
                </div>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
                <label className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Overall Rating</label>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, index) => {
                    const val = index + 1;
                    return (
                      <button
                        type="button" 
                        key={index}
                        className={`transition-all duration-200 transform hover:scale-110 ${val <= (hover || reviewData.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        onClick={() => setReviewData({ ...reviewData, rating: val })}
                        onMouseEnter={() => setHover(val)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <Star size={40} fill={val <= (hover || reviewData.rating) ? "currentColor" : "none"} />
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-500">
                   {reviewData.rating > 0 ? ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'][reviewData.rating - 1] : 'Click to rate'}
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Detailed Review</label>
                <textarea
                  name="review"
                  value={reviewData.review}
                  onChange={handleReviewChange}
                  required
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Tell us what you liked most..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200"
              >
                {loading ? 'Submitting...' : 'Post Verified Review'}
              </button>
            </form>
          )}

          {/* VIEW 4: SUCCESS */}
          {step === 'finished' && (
            <div className="text-center py-10 animate-in bounce-in duration-700">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Posted!</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-sm mx-auto">Thank you for sharing your feedback on the <span className="font-bold text-gray-800">{reviewData.carModel}</span>.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Dynamic Status Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium flex items-center justify-center animate-pulse ${
              message.toLowerCase().includes('incorrect') || message.toLowerCase().includes('failed') 
              ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rating;