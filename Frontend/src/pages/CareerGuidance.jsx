import { useEffect } from 'react';
import { checkIcon } from '../utils/images';

const CareerGuidance = () => {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Career Guidance</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">Get a personalized plan to land interviews and offers.</p>
        </div>
      </section>

      {/* What you get and Resources */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
          <div className="reveal">
            <h2 className="text-2xl font-bold">What you get</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                ATS‑friendly resume & LinkedIn
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Portfolio and GitHub review
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mock interviews with feedback
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Learning roadmap & resources
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="rounded-2xl ring-1 ring-slate-200 p-6">
              <h3 className="font-semibold">Resources</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Resume templates (freshers & experienced)</li>
                <li>Interview question banks</li>
                <li>Project ideas for portfolios</li>
                <li>Learning tracks for popular roles</li>
              </ul>
              <a href="/contact" className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
                Book a session
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerGuidance;
