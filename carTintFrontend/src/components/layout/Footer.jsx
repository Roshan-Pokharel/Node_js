import { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/UZlogo.png';

// New component for a single flip card digit
const FlipCard = ({ digit }) => {
  return (
    <div className="relative w-10 h-14 bg-blue-500 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
      <span className="text-white text-3xl font-bold">{digit}</span>
      {/* Simulated flip effect line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-blue-400 bg-opacity-50"></div>
    </div>
  );
};

export default function Footer() {
  const [hitCount, setHitCount] = useState(null);

  // Function to fetch hit count
  useEffect(() => {
    const fetchHits = async () => {
      try {
        // NOTE: Change 'http://localhost:5000' to your production URL if deployed
        const response = await fetch('http://localhost:5000/api/hits');
        const data = await response.json();
        
        if (data.success) {
          setHitCount(data.count);
        }
      } catch (error) {
        console.error("Error fetching hit count:", error);
      }
    };

    fetchHits();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Format the hit count to a 5-digit string, e.g., 1 -> "00001"
  const formattedHitCount = hitCount !== null ? hitCount.toString().padStart(5, '0') : '00000';

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div>
              <img src={Logo} alt="CarWrap Pro Logo" className="h-7 md:h-12 w-auto mb-4" />
            </div>
            <p className="text-gray-400 text-sm">
              Professional car Tinting and wrapping services that transform your vehicle with style and protection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/service" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Book Now
                </Link> 
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link> 
              </li>
              <li>
                <button onClick={() => scrollToSection('work')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Our Work
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('reviews')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Wrap Street, Auto City, AC 12345</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@carwrappro.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Stay updated with our latest projects and offers!
            </p>
            {/* Flip-Style Hit Counter */}
          <div className="flex flex-col order-1 mt-5 md:order-2">
            <div className="flex gap-1">
              {formattedHitCount.split('').map((digit, index) => (
                <FlipCard key={index} digit={digit} />
              ))}
            </div>
            <span className="text-gray-400 text-sm font-bold mt-2 tracking-widest uppercase">UNIQUE VISITS COUNTS</span>
          </div>
          </div>
        </div>

        {/* Bottom Bar with Flip-Style Counter */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <p className="text-gray-400 text-sm order-2 md:order-1">
            © 2025 OZ Tint & Wrap. All rights reserved.
          </p>
          
          
        </div>
      </div>
    </footer>
  );
}