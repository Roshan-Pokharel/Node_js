import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import logoImage from '../../assets/UZlogo.png';
//import logoImageMB from '../../assets/UZlogo1.png';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const phoneNumber = "0433599495"; 

  return (
   <nav className="bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 text-slate-100 sticky top-0 z-50 shadow-xl border-b border-white/10 flex flex-col">
    <div className=' lg:hidden '>
      {/* Desktop Call Button */}
      {/* hover:scale-105 hover:shadow-red-500/50
             transition-all duration-300 */}
 <a
  href={`tel:${phoneNumber}`}
  className="flex w-full md:pl-12 items-center gap-2 
             py-2 px-4 bg-gradient-to-r from-red-900 to-rose-900
             text-white font-semibold shadow-lg shadow-red-900/30"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 animate-ring origin-center"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
  <span>0433 599 495</span>
</a>


        </div>

      <div>

      <div className="container mx-auto px-4 py-8 md:py-12 flex justify-between items-center relative">
        
        {/* --- Logo --- */}
        <Link
        to="/"
        onClick={() => setIsMenuOpen(false)}
        className=" absolute md:left-0  font-bold tracking-wide text-cyan-400 hover:text-emerald-400 transition duration-300 z-30"
          >
          <img
            src={logoImage}
            className=" h-[33px] md:h-[55px]  w-auto"
            alt="UZ TILT AND WRAP"
          />
          {/* <img
            src={logoImageMB}
            className="md:hidden h-[57px] md:h-[65px] w-auto"
            alt="UZ TILT AND WRAP"
          /> */}
</Link>



        {/* --- Desktop Menu (Hidden on Mobile) --- */}
        <div className="absolute md:right-10 hidden md:flex md:space-x-5 lg:space-x-6 items-center ">
        <NavLink
            to="/"
            className={({ isActive }) =>
              `relative pb-1 text-slate-300 hover:text-cyan-400 transition-colors duration-300
              after:absolute after:left-1/2 after:-bottom-0.5 after:h-[2px] after:bg-cyan-400
              after:transition-all after:duration-300 after:ease-out
              after:-translate-x-1/2
              ${isActive ? "after:w-full text-white" : "after:w-0"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/service"
            className={({ isActive }) =>
              `relative pb-1 text-slate-300 hover:text-cyan-400 transition-colors duration-300
              after:absolute after:left-1/2 after:-bottom-0.5 after:h-[2px] after:bg-cyan-400
              after:transition-all after:duration-300 after:ease-out
              after:-translate-x-1/2
              ${isActive ? "after:w-full text-white" : "after:w-0"}`
            }
          >
            Service
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `relative pb-1 text-slate-300 hover:text-cyan-400 transition-colors duration-300
              after:absolute after:left-1/2 after:-bottom-0.5 after:h-[2px] after:bg-cyan-400
              after:transition-all after:duration-300 after:ease-out
              after:-translate-x-1/2
              ${isActive ? "after:w-full text-white" : "after:w-0"}`
            }
          >
            Book Now
          </NavLink>

          <NavLink
            to="/bloggallery"
            className={({ isActive }) =>
              `relative pb-1 text-slate-300 hover:text-cyan-400 transition-colors duration-300
              after:absolute after:left-1/2 after:-bottom-0.5 after:h-[2px] after:bg-cyan-400
              after:transition-all after:duration-300 after:ease-out
              after:-translate-x-1/2
              ${isActive ? "after:w-full text-white" : "after:w-0"}`
            }
          >
            Blog
          </NavLink>

           <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative pb-1 text-slate-300 hover:text-cyan-400 transition-colors duration-300
              after:absolute after:left-1/2 after:-bottom-0.5 after:h-[2px] after:bg-cyan-400
              after:transition-all after:duration-300 after:ease-out
              after:-translate-x-1/2
              ${isActive ? "after:w-full text-white" : "after:w-0"}`
            }
          >
            About
          </NavLink>
          <div className=' sm:hidden lg:block'>
                    {/* Desktop Call Button */}
                    {/* hover:scale-105 hover:shadow-red-500/50
                          transition-all duration-300 */}
              <a
                href={`tel:${phoneNumber}`}
                className="flex w-full items-center gap-2 
                          py-2 px-4 border border-rose-700 rounded-lg bg-gradient-to-r from-rose-800 to-rose-900 hover:border-red-750 hover:shadow-lg hover:shadow-red-900/30
                          text-white font-semibold "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 animate-ring origin-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <span>Call Us</span>
              </a>

        </div>
       


        </div>

        {/* --- Hamburger Button --- */}
        <button 
          className="md:hidden absolute right-5 z-50 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* We toggle the icon appearance based on state */}
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-200 ">
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
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)} // Close when clicking outside
      >
      </div>
        

      {/* 2. Sliding Drawer (From Right) */}
      <div 
          className={`fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >

        <div className="flex flex-col h-full pt-20 px-6 space-y-2">

  <NavLink
    to="/"
    className={({ isActive }) =>
      `block px-4 py-3 rounded-xl text-base font-medium
       transition-all duration-300 mt-10
       ${isActive
         ? "bg-slate-700/70 text-white shadow-inner"
         : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/70"
       }`
    }
    onClick={() => setIsMenuOpen(false)}
  >
    Home
  </NavLink>

  <NavLink
    to="/service"
    className={({ isActive }) =>
      `block px-4 py-3 rounded-xl text-base font-medium
       transition-all duration-300
       ${isActive
         ? "bg-slate-700/70 text-white shadow-inner"
         : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/70"
       }`
    }
    onClick={() => setIsMenuOpen(false)}
  >
    Services
  </NavLink>

  <NavLink
    to="/bookings"
    className={({ isActive }) =>
      `block px-4 py-3 rounded-xl text-base font-medium
       transition-all duration-300
       ${isActive
         ? "bg-slate-700/70 text-white shadow-inner"
         : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/70"
       }`
    }
    onClick={() => setIsMenuOpen(false)}
  >
    Book Now
  </NavLink>

  <NavLink
    to="/bloggallery"
    className={({ isActive }) =>
      `block px-4 py-3 rounded-xl text-base font-medium
       transition-all duration-300
       ${isActive
         ? "bg-slate-700/70 text-white shadow-inner"
         : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/70"
       }`
    }
    onClick={() => setIsMenuOpen(false)}
  >
    Blog
  </NavLink>

  <NavLink
    to="/about"
    className={({ isActive }) =>
      `block px-4 py-3 rounded-xl text-base font-medium
       transition-all duration-300
       ${isActive
         ? "bg-slate-700/70 text-white shadow-inner"
         : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/70"
       }`
    }
    onClick={() => setIsMenuOpen(false)}
  >
    About
  </NavLink>

</div>

      </div>

      </div>
    </nav>
  );
}