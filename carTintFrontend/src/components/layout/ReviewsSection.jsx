import React, { useState, useEffect } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';

export function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // CHANGE THIS URL to match your backend port (usually 5000 or 3000)
        const response = await fetch('http://localhost:5000/api/reviews');
        
        if (!response.ok) {
          throw new Error('Failed to connect to the server');
        }

        const data = await response.json();

        // Map the Database fields to your Frontend design
        const formattedReviews = data.map((review) => ({
          name: review.name,
          rating: review.rating,
          // Convert database date (ISO string) to "Month Year" format
          date: new Date(review.date).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          comment: review.review,   // DB field was 'review'
          vehicle: review.carModel  // DB field was 'carModel'
        }));

        setReviews(formattedReviews);
      } catch (err) {
        setError('Could not load reviews. Please try again later.');
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-500">Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    // Optional: Hide section completely on error, or show message
    return null; 
  }

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 text-3xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their car wrapping experience.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No reviews yet. Be the first to review us!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-900 font-semibold mb-1">{review.name}</p>
                  <p className="text-gray-500 text-sm">{review.vehicle}</p>
                  <p className="text-gray-400 text-sm mt-1">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Aggregate Score Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2 bg-blue-600 text-white px-8 py-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">
                {/* Calculate average rating dynamically if you have data */}
                {reviews.length > 0 
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                  : "5.0"}
                /5.0
              </span>
            </div>
            <p className="text-blue-100">Based on {reviews.length} verified reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}