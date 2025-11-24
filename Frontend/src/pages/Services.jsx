import { useEffect } from 'react';
import { checkIcon } from '../utils/images';

const Services = () => {
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
      <section className="bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-600">Our Services</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">Practical, outcome‑driven programs tailored to your goals.</p>
        </div>
      </section>

      {/* Final Year Project Assistance */}
      <section id="projects" className="py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <h2 className="text-2xl font-bold">Final Year Project Assistance</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Topic selection & proposal review
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Architecture & tech stack guidance
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Code reviews & milestone tracking
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Report, PPT & viva preparation
              </li>
            </ul>
            <div className="mt-6">
              <a href="/contact" className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow">
                Request a mentor
              </a>
            </div>
          </div>
          <div className="reveal">
            <img 
              src="/assets/images/icon-project-assistance.png" 
              alt="Projects" 
              className="block w-auto max-w-full h-auto rounded-xl ring-1 ring-slate-200 shadow-sm mx-auto" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
        </div>
      </section>

      {/* Internship Programs */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 reveal">
            <img 
              src="/assets/images/internship-header.png" 
              alt="Internships" 
              className="block w-auto max-w-full h-auto rounded-xl ring-1 ring-slate-200 shadow-sm mx-auto" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
          <div className="order-1 md:order-2 reveal">
            <h2 className="text-2xl font-bold">Internship Programs</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Curriculum + live projects
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Weekly mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificates & LOR
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Placement guidance
              </li>
            </ul>
            <div className="mt-6">
              <a href="/internship" className="inline-flex items-center justify-center px-5 py-2.5 rounded-md ring-1 ring-slate-300 hover:bg-slate-50">
                View tracks
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Career Guidance */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <h2 className="text-2xl font-bold">Career Guidance</h2>
            <p className="mt-2 text-slate-600">A personalized, end-to-end approach to career readiness.</p>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                ATS-ready resume & LinkedIn
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Portfolio & GitHub review
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mock interviews & feedback
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Learning roadmap
              </li>
            </ul>
            <div className="mt-6">
              <a href="/career-guidance" className="inline-flex items-center justify-center px-5 py-2.5 rounded-md ring-1 ring-slate-300 hover:bg-slate-50">
                See how it works
              </a>
            </div>
          </div>
          <div className="reveal">
            <img 
              src="/assets/images/icon-career.png" 
              alt="Career" 
              className="float-right block w-full max-w-[280px] sm:max-w-[320px] h-auto rounded-xl ring-1 ring-slate-200 shadow-sm mx-auto" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
        </div>
      </section>

      {/* Job Consultancy */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 reveal">
            <img 
              src="/assets/images/job-consultancy-banner.png" 
              alt="Jobs" 
              className="block w-auto max-w-full h-auto rounded-xl ring-1 ring-slate-200 shadow-sm mx-auto" 
              loading="lazy" 
              decoding="async" 
            />
          </div>
          <div className="order-1 md:order-2 reveal">
            <h2 className="text-2xl font-bold">Job Consultancy</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Application form filling
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Scheduling job calls
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Tracking applications
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Interview preparation
              </li>
            </ul>
            <div className="mt-6">
              <a href="/job-consultancy" className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow">
                Get support
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
