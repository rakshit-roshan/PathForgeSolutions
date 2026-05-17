"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from '@/config/site.config';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef(null);
  const appDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer and app dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsDrawerOpen(false);
      }
      if (appDropdownRef.current && !appDropdownRef.current.contains(event.target)) {
        setIsAppDropdownOpen(false);
      }
    };
    if (isDrawerOpen || isAppDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen, isAppDropdownOpen]);

  const isActive = (path) => {
    return pathname === path;
  };

  // Mapped public navLinks (for Desktop view)
  const navLinks = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/services', label: 'Solutions', icon: 'widgets' },
    { path: '/internship', label: 'Mentorship', icon: 'school' },
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
    { path: '/about', label: 'About Us', icon: 'info' },
    { path: '/login', label: 'Sign In', icon: 'login' },
    { path: '/register', label: 'Sign Up', icon: 'person_add' }
  ];

  return (
    <>
      {/* ── DESKTOP RECTANGULAR NAVBAR ─────────────────────────────────────────── */}
      <header className={`hidden md:block fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_20px_rgba(10,33,86,0.05)] py-3' 
          : 'bg-white/70 backdrop-blur-xl border-b border-slate-200/20 py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group" aria-label={`${siteConfig.name} Home`}>
            <span className="text-2xl font-bold text-primary tracking-tight">{siteConfig.shortName}</span>
          </Link>

          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-label-md transition-all duration-300 hover:text-primary relative py-1 ${
                  isActive(link.path)
                    ? 'text-primary font-semibold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:scale-105'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={appDropdownRef}>
              <button
                onClick={() => setIsAppDropdownOpen(!isAppDropdownOpen)}
                className="text-on-surface-variant font-label-md hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer bg-transparent border-0 outline-none"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">install_mobile</span>
                Download App
              </button>
              {isAppDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-[32px] p-6 shadow-[0_20px_60px_rgba(10,33,86,0.15)] z-50 transition-all duration-300">
                  <div className="text-center">
                    <h4 className="font-headline text-base font-bold text-[#0A2156] mb-2">Get {siteConfig.shortName} Mobile</h4>
                    <p className="text-[11px] text-on-surface-variant mb-4">Scan the QR code to download the official Android APK directly to your device.</p>
                    
                    <div className="w-44 h-44 mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-3 mb-4 flex items-center justify-center relative overflow-hidden">
                      <img 
                        src="/assets/images/app_qr_code.png" 
                        alt="Scan to Download APK" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <a 
                      href="/assets/api-link/app.apk" 
                      download 
                      className="inline-flex items-center gap-2 btn-premium-gradient w-full !py-2.5 !px-4 !rounded-xl text-xs font-bold justify-center"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Direct Download (.APK)
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="text-on-surface-variant font-label-md hover:text-primary transition-all"
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="btn-premium-gradient"
            >
              Consultation
            </Link>
          </div>
        </div>
      </header>

      {/* ── MOBILE TOP HEADER (APP SHELL LOOK) ───────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3 flex justify-between items-center shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <Link href="/" className="flex items-center gap-1.5" aria-label={`${siteConfig.name} Mobile Home`}>
          <img className="w-[20px] h-auto object-contain" src={siteConfig.logo} alt="logo" onError={(e) => e.currentTarget.style.display = 'none'} />
          <span className="text-lg font-bold text-primary tracking-tight">{siteConfig.shortName}</span>
        </Link>
        <Link
          href="/login"
          className="btn-premium-gradient !py-1.5 !px-4 !text-xs !rounded-full"
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
              <span className="text-xl font-bold text-primary">{siteConfig.shortName}</span>
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

              {/* Mobile app download link card */}
              <div className="mt-2 p-4 rounded-2xl bg-slate-50 border border-slate-100/80 text-center">
                <span className="material-symbols-outlined text-xl text-primary mb-1.5 block">install_mobile</span>
                <h5 className="font-headline text-[13px] font-bold text-primary mb-0.5">{siteConfig.shortName} Mobile App</h5>
                <p className="text-[10px] text-slate-500 mb-2.5">Download the APK directly to install on your Android device.</p>
                <a 
                  href="/assets/api-link/app.apk" 
                  download 
                  className="inline-flex items-center gap-1.5 btn-premium-gradient w-full !py-2 !px-3 !rounded-lg text-[10px] font-bold justify-center"
                >
                  <span className="material-symbols-outlined text-xs">download</span>
                  Download APK
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
            <Link
              href="/contact"
              className="w-full text-center btn-premium-gradient"
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
