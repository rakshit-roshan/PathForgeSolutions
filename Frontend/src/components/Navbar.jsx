import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logo2 } from '../utils/images';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/internship', label: 'Internship' },
    { path: '/career-guidance', label: 'Career Guidance' },
    { path: '/job-consultancy', label: 'Job Consultancy' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className={`backdrop-blur bg-white/70 supports-backdrop:bg-white/60 border-b border-slate-200 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" aria-label="PathForge Solutions Home">
            <img src={logo2} alt="PathForge Solutions Logo" className="h-48 w-auto" />
          </Link>

          <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link transition-colors ${
                    isActive(link.path)
                      ? 'text-indigo-600'
                      : 'text-slate-700 hover:text-indigo-600'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"  className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow hover:shadow-lg transition-shadow">
              Login
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden border-t border-slate-200 bg-white/95 backdrop-blur ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-4 py-3 grid gap-2 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link block px-3 py-2 rounded hover:bg-slate-100 ${
                isActive(link.path) ? 'text-indigo-600 bg-slate-50' : ''
              }`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login"
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow"
            onClick={closeMobileMenu}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
