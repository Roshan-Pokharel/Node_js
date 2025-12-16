import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToSection = (sectionId) => {  // removed :string
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">CW</span>
              </div>
              <span className="text-white">CarWrap Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              Professional car wrapping services that transform your vehicle with style and protection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                
                <button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('calculator')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Cost Calculator
                </button>
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
              <li>
                <button onClick={() => scrollToSection('shop')} className="text-gray-400 hover:text-white transition-colors text-sm">
                  Shop
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 CarWrap Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
