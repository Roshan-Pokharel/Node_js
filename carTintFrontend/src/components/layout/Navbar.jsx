import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const phoneNumber = "+9779847256251"; 

  return (
    <nav className="bg-slate-800 text-white sticky top-0 z-50 shadow-lg relative">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* --- Logo --- */}
        <Link to="/" className="text-2xl font-bold hover:text-green-300 transition duration-300 z-50">
          Car Tint Pro
        </Link>

        {/* --- Desktop Menu (Hidden on Mobile) --- */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-green-400 transition">Home</Link>
          <Link to="/dashboard" className="hover:text-green-400 transition">Dashboard</Link>
          
          {/* Desktop Call Button */}
          <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 hover:text-green-400 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>Call Us</span>
          </a>

          <Link to="/login" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition shadow-md">
            Login
          </Link>
        </div>

        {/* --- Hamburger Button --- */}
        <button 
          className="md:hidden z-50 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* We toggle the icon appearance based on state */}
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* ============================== */}
      {/* MOBILE MENU OVERLAY & DRAWER   */}
      {/* ============================== */}

      {/* 1. Dark Overlay (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)} // Close when clicking outside
      ></div>

      {/* 2. Sliding Drawer (From Right) */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-slate-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-20 px-6 space-y-6">
          
          <Link 
            to="/" 
            className="text-lg font-medium hover:text-green-400 border-b border-slate-700 pb-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>

          <Link 
            to="/dashboard" 
            className="text-lg font-medium hover:text-green-400 border-b border-slate-700 pb-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>

          {/* Mobile Call Button */}
          <a 
            href={`tel:${phoneNumber}`} 
            className="flex items-center gap-3 text-green-300 font-semibold border-b border-slate-700 pb-2"
          >
            <div className="bg-green-900/50 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <span>Call Now</span>
          </a>

          <Link 
            to="/login" 
            className="bg-green-600 text-center px-4 py-3 rounded hover:bg-green-700 transition font-semibold mt-4"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>

        </div>
      </div>
    </nav>
  );
}