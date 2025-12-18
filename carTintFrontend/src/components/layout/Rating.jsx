import React, { useState } from 'react';

function Rating() {
  // Application States: 'start', 'otp_sent', 'verified', 'finished'
  const [step, setStep] = useState('start');
  
  // Form States
  const [email, setEmail] = useState(''); // NEW: Email State
  const [otpInput, setOtpInput] = useState('');
  const [reviewData, setReviewData] = useState({
    name: '',
    carModel: '', // This handles the Car Model
    rating: 0,
    review: ''
  });
  
  // State to handle the hover effect on stars
  const [hover, setHover] = useState(0);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Step 1: Request OTP ---
  const handleGenerateOTP = async () => {
    // 1. Basic Validation
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // 2. Send Email to Backend
      const response = await fetch('http://localhost:5000/api/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // We now send the email in the body
        body: JSON.stringify({ email: email }), 
      });
      const data = await response.json();
      
      setMessage(data.message);
      setStep('otp_sent');
      // If your backend sends real emails, remove the alert below
      // alert("Check your Email (or Backend Terminal) for the OTP code!");
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Depending on backend logic, you might want to send the email again with the OTP to verify ownership
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

  // --- Step 3: Submit Review ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if(reviewData.rating === 0) {
        setMessage('Please select a star rating.');
        return;
    }

    setLoading(true);
    try {
      // Include the email in the final review data if needed
      const finalData = { ...reviewData, email: email };

      const response = await fetch('http://localhost:5000/api/submit-review', {
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

  // Helper to handle form changes
  const handleReviewChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Review System</h1>
          <div className="h-1 w-16 bg-blue-500 mx-auto mt-2 rounded"></div>
        </div>

        {/* VIEW 1: Enter Email & Start */}
        {step === 'start' && (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Please enter your email to receive a One-Time Password for verification.
            </p>
            
            {/* NEW: Email Input */}
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button 
              onClick={handleGenerateOTP} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 shadow-md transform hover:-translate-y-0.5"
            >
              {loading ? 'Sending...' : 'Send OTP via Email'}
            </button>
          </div>
        )}

        {/* VIEW 2: Enter OTP */}
        {step === 'otp_sent' && (
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Enter Verification Code</h3>
            <p className="text-sm text-gray-500 mb-4">
                We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>.
            </p>
            
            <input
              type="text"
              placeholder="XXXXXX"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              maxLength="6"
              className="w-full text-center text-2xl tracking-widest border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            
            <button 
              onClick={handleVerifyOTP} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 shadow-md"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button onClick={() => setStep('start')} className="mt-4 text-sm text-blue-500 hover:underline">
              Change Email / Go Back
            </button>
          </div>
        )}

        {/* VIEW 3: Review Form (Includes Car Model) */}
        {step === 'verified' && (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">Leave your Feedback</h3>
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                name="name"
                value={reviewData.name}
                onChange={handleReviewChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

             {/* Car Model Section (Requested) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
              <input
                name="carModel"
                value={reviewData.carModel}
                onChange={handleReviewChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Range Rover Evoque"
              />
            </div>

            {/* STAR RATING SECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  
                  return (
                    <button
                      type="button" 
                      key={index}
                      className={`text-3xl focus:outline-none transition-colors duration-200 ${
                        ratingValue <= (hover || reviewData.rating) 
                          ? "text-yellow-400" 
                          : "text-gray-300"
                      }`}
                      onClick={() => setReviewData({ ...reviewData, rating: ratingValue })}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <svg 
                        className="w-8 h-8 fill-current" 
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-gray-500 font-medium">
                    {reviewData.rating > 0 ? (
                        reviewData.rating === 1 ? 'Terrible' :
                        reviewData.rating === 2 ? 'Poor' :
                        reviewData.rating === 3 ? 'Average' :
                        reviewData.rating === 4 ? 'Good' : 'Excellent'
                    ) : 'Select a rating'}
                </span>
              </div>
            </div>

            {/* Review Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                name="review"
                value={reviewData.review}
                onChange={handleReviewChange}
                required
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Share your experience..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* VIEW 4: Thank You */}
        {step === 'finished' && (
          <div className="text-center animate-fade-in">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your review for the <span className="font-bold">{reviewData.carModel}</span> has been submitted.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`mt-4 p-3 rounded text-sm text-center ${message.includes('Incorrect') || message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rating;