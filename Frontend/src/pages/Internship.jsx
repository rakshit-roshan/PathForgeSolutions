import { useEffect } from 'react';
import { checkIcon } from '../utils/images';

const Internship = () => {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Internship Programs</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">Choose a track, build real projects, and get industry-ready.</p>
        </div>
      </section>

      {/* Internship Tracks */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
          <div className="rounded-xl ring-1 ring-slate-200 p-6 reveal">
            <h3 className="font-semibold">Data & Gen-AI</h3>
            <p className="mt-2 text-sm text-slate-600">Tech Stack: Python, Vector DB, LLMs</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Live project
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificate + LOR
              </li>
            </ul>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 reveal">
            <h3 className="font-semibold">Full‑Stack Web</h3>
            <p className="mt-2 text-sm text-slate-600">Tech Stack: Suits to project needs</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Live project
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificate + LOR
              </li>
            </ul>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 reveal">
            <h3 className="font-semibold">Frontend Development</h3>
            <p className="mt-2 text-sm text-slate-600">Tech Stack: HTML, CSS, Tailwind, JavaScript, React</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Live project
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificate + LOR
              </li>
            </ul>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 reveal">
            <h3 className="font-semibold">Backend Development</h3>
            <p className="mt-2 text-sm text-slate-600">Tech Stack: Node.js, Express, MongoDB, SQL, API , Spring Boot</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Live project
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificate + LOR
              </li>
            </ul>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 reveal">
            <h3 className="font-semibold">UI / UX Design</h3>
            <p className="mt-2 text-sm text-slate-600">Tech Stack: Figma, Canva</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Live project
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificate + LOR
              </li>
            </ul>
          </div>
          <div className="rounded-xl ring-1 ring-slate-200 p-6 reveal">
            <h3 className="font-semibold">Technical Writing</h3>
            <p className="mt-2 text-sm text-slate-600">Tech Stack: Suits to project needs</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Live project
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Mentor sessions
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Certificate + LOR
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits and Application */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <h2 className="text-2xl font-bold">Benefits</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Structured curriculum
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                1:1 mentor feedback
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Peer community
              </li>
              <li className="flex gap-2">
                <img src={checkIcon} className="w-4 h-4" alt="check" />
                Career services
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 text-white">
              <h3 className="text-xl font-semibold">How to apply</h3>
              <ol className="mt-3 list-decimal list-inside space-y-1 text-white/90">
                <li>Choose a track</li>
                <li>Fill the form on Contact page</li>
                <li>Attend a short screening call</li>
                <li>Start your internship</li>
              </ol>
              <a href="/contact" className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-white text-slate-900 font-medium">
                Apply now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Internship;
