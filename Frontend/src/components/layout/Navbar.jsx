"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen]);

  const isActive = (path) => {
    return pathname === path;
  };

  // Mapped public navLinks (for Desktop view)
  const navLinks = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/services', label: 'Solutions', icon: 'widgets' },
    { path: '/internship', label: 'Mentorship', icon: 'school' },
    { path: '/career-guidance', label: 'Advisory', icon: 'explore' },
    { path: '/about', label: 'About', icon: 'info' }
  ];

  // Mobile Bottom Tab Bar Links: 2 main menu options (Home & Solutions)
  const mobileBottomLinks = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/services', label: 'Solutions', icon: 'widgets' }
  ];

  // Mobile Sliding Drawer options (removes Home & Solutions to avoid redundancy, adds auth)
  const mobileDrawerLinks = [
    { path: '/internship', label: 'Mentorship', icon: 'school' },
    { path: '/career-guidance', label: 'Advisory', icon: 'explore' },
    { path: '/about', label: 'About Us', icon: 'info' },
    { path: '/login', label: 'Sign In', icon: 'login' },
    { path: '/register', label: 'Sign Up', icon: 'person_add' }
  ];

  return (
    <>
      {/* ── DESKTOP FLOATING NAVBAR ─────────────────────────────────────────── */}
      <div className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50">
        <nav className="rounded-full border border-white/80 bg-white/55 backdrop-blur-xl shadow-[0_40px_100px_rgba(10,33,86,0.05)] px-8 py-3 flex justify-between items-center transition-all duration-300">
          <Link href="/" className="flex items-center gap-2 group" aria-label="PathForge Home">
            <span className="text-2xl font-bold text-primary tracking-tight">PathForge</span>
          </Link>

          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-label-md transition-all duration-300 hover:scale-105 ${
                  isActive(link.path)
                    ? 'text-primary font-semibold border-b-2 border-primary pb-0.5'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-on-surface-variant font-label-md hover:text-primary transition-all"
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="bg-gradient-to-r from-primary to-primary-container text-white px-6 py-2 rounded-full font-headline font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Consultation
            </Link>
          </div>
        </nav>
      </div>

      {/* ── MOBILE TOP HEADER (APP SHELL LOOK) ───────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 flex justify-between items-center shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <Link href="/" className="flex items-center gap-1.5" aria-label="PathForge Mobile Home">
          <img className="w-[20px] h-auto object-contain" src="/assets/images/Logo.png" alt="logo" onError={(e) => e.currentTarget.style.display = 'none'} />
          <span className="text-lg font-bold text-primary tracking-tight">PathForge</span>
        </Link>
        <Link
          href="/login"
          className="bg-gradient-to-r from-primary to-primary-container text-white px-4 py-1.5 rounded-full font-headline font-bold text-xs shadow-sm hover:opacity-90 transition-all active:scale-[0.98]"
        >
          Login
        </Link>
      </div>

      {/* ── MOBILE NATIVE BOTTOM TAB BAR (EDGE-TO-EDGE APP LOOK, 3 OPTIONS) ───── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200/60 px-6 pt-2.5 pb-5 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {mobileBottomLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl leading-none transition-transform duration-250 ${isActive(link.path) ? 'scale-110 font-fill text-primary' : 'text-slate-400'}`}>
                {link.icon}
              </span>
              <span className="text-[10px] font-medium leading-none tracking-tight">{link.label}</span>
            </Link>
          ))}
          
          {/* More options button triggers slide menu drawer (3rd Option) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all duration-300 ${
              isDrawerOpen ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-label="More options"
          >
            <span className={`material-symbols-outlined text-2xl leading-none transition-transform duration-250 ${isDrawerOpen ? 'scale-110 text-primary' : 'text-slate-400'}`}>
              menu
            </span>
            <span className="text-[10px] font-medium leading-none tracking-tight">More</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE SIDE NAVIGATION DRAWER (Slide-in Right, NO REDUNDANCY) ────── */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        />
        
        {/* Drawer content panel */}
        <div
          ref={drawerRef}
          className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl p-6 transition-transform duration-300 flex flex-col justify-between ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
              <span className="text-xl font-bold text-primary">PathForge</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 flex items-center justify-center"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined text-xl text-slate-500">close</span>
              </button>
            </div>

            <div className="py-6 flex flex-col gap-4">
              {mobileDrawerLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-4 py-2 px-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/5 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                  }`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="material-symbols-outlined text-xl text-slate-400">{link.icon}</span>
                  <span className="font-medium text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
            <Link
              href="/contact"
              className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-sm shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
              onClick={() => setIsDrawerOpen(false)}
            >
              Get Consultation
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
