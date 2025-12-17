import React from 'react';
import { Star, Quote } from 'lucide-react';


export function ReviewsSection() {
  const reviews = [
    {
      name: 'Michael Chen',
      rating: 5,
      date: 'December 2024',
      comment: 'Absolutely phenomenal work! The matte black wrap on my BMW looks stunning. The team was professional, detail-oriented, and completed the job ahead of schedule. Worth every penny!',
      vehicle: 'BMW M3'
    },
    {
      name: 'Sarah Johnson',
      rating: 5,
      date: 'November 2024',
      comment: 'I had my Tesla wrapped in a beautiful pearl white finish. The quality is exceptional and the installation was flawless. Three months later and it still looks brand new. Highly recommend!',
      vehicle: 'Tesla Model 3'
    },
    {
      name: 'David Martinez',
      rating: 5,
      date: 'November 2024',
      comment: 'Used their service for my business fleet. The wraps look professional and have been great for brand visibility. The team handled everything efficiently and stayed within budget.',
      vehicle: 'Mercedes Sprinter'
    },
    {
      name: 'Emily Roberts',
      rating: 5,
      date: 'October 2024',
      comment: 'Amazing experience from start to finish! They helped me choose the perfect color and finish. The wrap protects my car and looks incredible. Best investment I made for my vehicle!',
      vehicle: 'Audi A4'
    },
    {
      name: 'James Wilson',
      rating: 5,
      date: 'October 2024',
      comment: 'Got a custom design wrap for my sports car and it exceeded all expectations. The attention to detail was impressive and the craftsmanship is top-notch. People stop me all the time to ask about it!',
      vehicle: 'Porsche 911'
    },
    {
      name: 'Lisa Anderson',
      rating: 5,
      date: 'September 2024',
      comment: 'Fantastic service! The wrap has held up perfectly through all weather conditions. Great value for money and the customer service was excellent throughout the entire process.',
      vehicle: 'Range Rover'
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 text-3xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their car wrapping experience.
          </p>
        </div>

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

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-2 bg-blue-600 text-white px-8 py-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">4.9/5.0</span>
            </div>
            <p className="text-blue-100">Based on 127+ customer reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}