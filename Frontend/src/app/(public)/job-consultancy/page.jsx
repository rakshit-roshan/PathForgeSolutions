"use client";

import { useEffect } from 'react';
import Link from 'next/link';

const JobConsultancy = () => {
  useEffect(() => {
    // Initialize scroll reveal animations
    const initScrollReveal = () => {
      const toReveal = document.querySelectorAll('.reveal, .reveal-up');
      if (!toReveal.length) return;
      
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      
      toReveal.forEach((el) => io.observe(el));
    };

    initScrollReveal();
  }, []);

  return (
    <>
      {/* Header Section */}
      <section className="relative pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="max-w-3xl">
          <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">
            Elite Placement
          </span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#0A2156] leading-[1.1] tracking-tight mb-8">
            Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Consultancy</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
            Focus on interviews while we take care of all the application logistics and pipeline management.
          </p>
        </div>
      </section>

      {/* How we help and What we need */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
          <div className="reveal">
            <h2 className="text-2xl font-bold">How we help</h2>
            <ol className="mt-4 space-y-2 text-slate-600 list-decimal list-inside">
              <li>Job requirement analysis & targeting</li>
              <li>Application form filling & submission</li>
              <li>Call scheduling and coordination</li>
              <li>Interview prep & follow‑ups</li>
            </ol>
            <Link href="/contact" className="mt-6 btn-premium-gradient">
              Talk to us
            </Link>
          </div>
          <div className="reveal">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 text-white">
              <h3 className="text-xl font-semibold">What we need from you</h3>
              <ul className="mt-3 space-y-1 text-white/90">
                <li>Updated resume & portfolio</li>
                <li>Role preferences and locations</li>
                <li>Availability for calls</li>
                <li>Consent for applications on your behalf</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobConsultancy;
