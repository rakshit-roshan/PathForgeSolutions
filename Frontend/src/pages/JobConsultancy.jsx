import { useEffect } from 'react';

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
      <section className="bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl sm:text-5xl font-semibold text-slate-600">Job Consultancy</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">Focus on interviews while we take care of the logistics.</p>
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
            <a href="/contact" className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-md ring-1 ring-slate-300 hover:bg-slate-50">
              Talk to us
            </a>
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
