"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('2024');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="w-full rounded-t-[64px] bg-primary text-white border-t border-white/10 mt-16">
      <div className="flex flex-col md:flex-row justify-between gap-gutter px-margin-desktop py-12 max-w-container-max mx-auto">
        <div className="md:w-1/3">
          <h2 className="text-headline-xl font-headline-xl text-white mb-6">PathForge</h2>
          <p className="text-body-md text-slate-300 leading-relaxed">
            Excellence in IT consultancy and professional growth. We build the systems that power the future.
          </p>
        </div>
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-label-md font-bold text-white uppercase mb-2">Company</p>
            <Link href="/services" className="text-slate-300 font-label-sm hover:text-white transition-colors">
              Solutions
            </Link>
            <Link href="/internship" className="text-slate-300 font-label-sm hover:text-white transition-colors">
              Mentorship
            </Link>
            <Link href="/career-guidance" className="text-slate-300 font-label-sm hover:text-white transition-colors">
              Advisory
            </Link>
            <Link href="/about" className="text-slate-300 font-label-sm hover:text-white transition-colors">
              About Us
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-label-md font-bold text-white uppercase mb-2">Legal</p>
            <a className="text-slate-300 font-label-sm hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-slate-300 font-label-sm hover:text-white transition-colors" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop py-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-label-sm font-label-sm text-slate-400">
          © {currentYear} PathForge Solutions. Excellence in Architecture.
        </p>
        <div className="flex items-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg">
            <img src="/assets/images/msme-badge.png" className="h-5 w-auto object-contain brightness-0 invert opacity-80" alt="MSME Registered" onError={(e) => e.currentTarget.style.display = 'none'} />
            MSME Registered
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg">
            <img src="/assets/images/make-in-india.png" className="h-5 w-auto object-contain brightness-0 invert opacity-80" alt="Make in India" onError={(e) => e.currentTarget.style.display = 'none'} />
            Make in India
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
