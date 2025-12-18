import React, { useState, useEffect, useMemo } from 'react';
import { Star, Quote, Loader2, ArrowLeft, Filter } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // State for sorting
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/allreviews`);
        
        if (!response.ok) {
          throw new Error('Failed to connect to the server');
        }

        const data = await response.json();
        const reviewsList = data.reviews || [];

        const formattedReviews = reviewsList.map((review) => ({
          name: review.name,
          rating: review.rating,
          // Store raw date object for easier sorting
          rawDate: new Date(review.date), 
          date: new Date(review.date).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          comment: review.review,
          vehicle: review.carModel
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

  // Sort reviews based on the selected filter
  const sortedReviews = useMemo(() => {
    // Create a copy to avoid mutating state directly
    const sorted = [...reviews];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => b.rawDate - a.rawDate);
      case 'oldest':
        return sorted.sort((a, b) => a.rawDate - b.rawDate);
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  if (loading) {
    return (
      <section className="py-20 bg-white text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-500">Loading reviews...</p>
      </section>
    );
  }

  if (error) {
    return null; 
  }

  return (
    <section id="reviews" className="py-10 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Navigation and Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Filter Dropdown */}
          <div className="flex absolute right-5 md:right-10 lg:right-20 items-center gap-3">
            <span className="text-gray-500 text-sm font-medium flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-gray-900 text-3xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their car wrapping experience.
          </p>
        </div>

        {sortedReviews.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No reviews yet. Be the first to review us!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedReviews.map((review, index) => (
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
      </div>
    </section>
  );
}