import { useState, useEffect, useRef } from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/UZlogo.png';

/* CSS styles for the flip animation. 
  In a real project, you might move this to a separate CSS module or global file.
*/
const FLIP_STYLES = `
  .flip-container {
    perspective: 400px;
    width: 32px;
    height: 40px;
  }
  
  .flip-card {
    position: relative;
    width: 100%;
    height: 100%;
    font-weight: bold;
    color: white;
    text-align: center;
    line-height: 40px; /* matches height */
    font-size: 1.875rem; /* 3xl equivalent */
    border-radius: 0.5rem;
  }

  /* Shared styles for card halves */
  .card-half {
    position: absolute;
    left: 0;
    width: 100%;
    height: 50%;
    overflow: hidden;
    background-color: #3b82f6; /* bg-blue-500 */
    backface-visibility: hidden;
  }

  /* Specifics for Top Half */
  .card-top {
    top: 0;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    transform-origin: 50% 100%;
    border-bottom: 1px solid rgba(0,0,0,0.1); /* Split line */
  }
  
  .card-top-content {
    /* Shift text up to show top half */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200%; 
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Specifics for Bottom Half */
  .card-bottom {
    bottom: 0;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    transform-origin: 50% 0%;
    border-top: 1px solid rgba(255,255,255,0.1); /* Highlight */
  }
  
  .card-bottom-content {
    /* Shift text down to show bottom half */
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 200%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Animation Classes */
  .flip-animate-top {
    animation: flipTop 0.6s ease-in both;
    z-index: 2;
  }
  
  .flip-animate-bottom {
    animation: flipBottom 0.6s ease-in both;
    z-index: 2;
  }

  @keyframes flipTop {
    0% { transform: rotateX(0deg); }
    100% { transform: rotateX(-90deg); }
  }

  @keyframes flipBottom {
    0% { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg); }
  }
  
  /* Shading overlay for realism */
  .overlay {
    position: absolute;
    inset: 0;
    background: black;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .flip-animate-top .overlay {
    animation: showShadow 0.6s ease-in both;
  }
  .flip-animate-bottom .overlay {
    animation: hideShadow 0.6s ease-in both;
  }
  @keyframes showShadow { 0% { opacity: 0; } 100% { opacity: 0.3; } }
  @keyframes hideShadow { 0% { opacity: 0.3; } 100% { opacity: 0; } }
`;

/* Animated Flip Card Component 
*/
const FlipCard = ({ digit }) => {
  const previousDigit = useRef(digit);
  const [animate, setAnimate] = useState(false);
  const [displayDigit, setDisplayDigit] = useState(digit);
  const [prevDisplayDigit, setPrevDisplayDigit] = useState(digit);

  useEffect(() => {
    if (digit !== previousDigit.current) {
      setPrevDisplayDigit(previousDigit.current);
      setDisplayDigit(digit);
      setAnimate(true);

      const timer = setTimeout(() => {
        setAnimate(false);
        previousDigit.current = digit;
      }, 600); // Duration matches CSS animation

      return () => clearTimeout(timer);
    }
  }, [digit]);

  return (
    <div className="flip-container shadow-md rounded-lg">
      <div className="flip-card">
        {/* Background Card (The Next Number) */}
        {/* Top Half Static (Next Number) */}
        <div className="card-half card-top z-0">
          <div className="card-top-content">{displayDigit}</div>
        </div>
        {/* Bottom Half Static (Previous Number - wait, actually Next Number for final state) */}
        <div className="card-half card-bottom z-0">
           <div className="card-bottom-content">{displayDigit}</div>
        </div>

        {/* Animating Flaps */}
        {animate && (
          <>
            {/* Top Flap (Old Number) - Flips Down */}
            <div className="card-half card-top flip-animate-top">
              <div className="card-top-content">{prevDisplayDigit}</div>
              <div className="overlay" />
            </div>

            {/* Bottom Flap (New Number) - Flips Up (technically down from vertical) */}
            <div className="card-half card-bottom flip-animate-bottom">
              <div className="card-bottom-content">{displayDigit}</div>
              <div className="overlay" />
            </div>
          </>
        )}

        {/* Static State (No Animation) - Show full card if not animating to prevent flicker */}
        {!animate && (
           <>
            <div className="card-half card-top z-10">
              <div className="card-top-content">{displayDigit}</div>
            </div>
             <div className="card-half card-bottom z-10">
              <div className="card-bottom-content">{displayDigit}</div>
            </div>
           </>
        )}
      </div>
    </div>
  );
};

export default function Footer() {
  const [hitCount, setHitCount] = useState(null);

  // Inject styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = FLIP_STYLES;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchHits = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/hits`
        );
        const data = await response.json();

        if (isMounted && data?.success) {
          setHitCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching hit count:', error);
      }
    };

    fetchHits();
    const intervalId = setInterval(fetchHits, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Convert to string and pad, defaulting to 00000
  const formattedHitCount =
    hitCount !== null ? hitCount.toString().padStart(6, '0') : '00000';

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <img src={Logo} alt="Logo" className="h-7 md:h-12 mb-4" />
            <p className="text-gray-400 text-sm">
              Professional car Tinting and wrapping services that transform your
              vehicle with style and protection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/service" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/bookings" className="text-gray-400 hover:text-white transition-colors">Book Now</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li>
                <button onClick={() => scrollToSection('work')} className="text-gray-400 hover:text-white transition-colors">
                  Our Work
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('reviews')} className="text-gray-400 hover:text-white transition-colors">
                  Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex gap-2 items-center">
                <MapPin className="w-4 h-4" /> <a href="https://www.google.com/maps/search/?api=1&query=Harrow+Road%2C+Auburn+NSW+2144%2C+Australia" target="_blank">Harrow Road, Auburn </a>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4" />
                 <a
                    href={`tel:0433599495`}>0433 599 495</a> 
              </li>
              <li className="flex gap-2 items-center">
                
                <Mail className="w-4 h-4" /><a href="mailto:oztintandwrap@gmail.com?subject=Support%20Request&body=Hello,%20I%20need%20help%20with...">
                  oztintandwrap@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social + Counter */}
          <div>
            <h4 className="mb-4 font-semibold">Follow Us</h4>
            <div className="flex gap-3">
              <a className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <Facebook size={20} />
              </a>
              <a className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                <Instagram size={20} />
              </a>
              <a className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">
                <Twitter size={20} />
              </a>
            </div>

            {/* Hit Counter */}
            <div className="mt-8">
              <div className="flex gap-1">
                {formattedHitCount.split('').map((digit, i) => (
                  /* Key is important here: using 'i' ensures the component doesn't remount completely,
                     allowing the internal useEffect in FlipCard to detect the prop change and animate.
                  */
                  <FlipCard key={i} digit={digit} />
                ))}
              </div>
              <span className="text-gray-500 text-[10px] font-bold mt-2 block tracking-[0.2em]">
                UNIQUE VISITS
              </span>
            </div>
          </div>
        </div>
        
        <div className=" flex justify-center gap-1 border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
         © 2025 OZ Tint & Wrap. All rights reserved.  
        </div>
      </div>
    </footer>
  );
}