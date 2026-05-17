"use client";

import { useEffect } from 'react';
import { Founder2, Founder3 } from '@/utils/images';

export default function About() {
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

  const teamMembers = [
    {
      image: Founder2,
      name: 'Sukanya Patil',
      role: 'CEO • Business Strategist · Deal Closer',
      bio: 'A strategic leader specialized in architecting national and international business growth. With a core focus on market dynamics and strategic sales operations, she transforms complex enterprise challenges into streamlined, results-oriented solutions.',
      linkedin: 'https://www.linkedin.com/in/sukanya-patil78/'
    },
    {
      image: Founder3,
      name: 'Rakshit Roshan',
      role: 'CTO • Systems Architect · Builder at Heart',
      bio: 'A specialized systems architect dedicated to engineering high-performance, scalable digital ecosystems. Expert in full-stack engineering and distributed systems, he bridges the gap between sophisticated technical architecture and seamless user experiences.',
      linkedin: 'https://www.linkedin.com/in/rakshit-roshan-4330b11a1/'
    }
  ];

  return (
    <>
      
    <main>
        {/*  Hero Section  */}
        <section className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">The Path Within</span>
            <h1
                className="font-display-lg text-display-lg md:text-display-xl text-primary mb-8 max-w-4xl leading-tight">
                Architecting the future of IT intelligence.</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">We don't just solve
                problems; we forge sustainable ecosystems where technology and talent evolve in perfect harmony.</p>
            <div className="w-full h-[360px] rounded-[32px] overflow-hidden glass-card p-3 mt-8">
                <img className="w-full h-[336px] object-cover rounded-[24px]"
                    data-alt="A grand, high-ceilinged modern architectural space with vast glass windows reflecting a serene twilight sky. The interior features minimalist furniture in deep blues and warm wood accents, bathed in soft, high-key ambient lighting that emphasizes transparency and structural depth. The atmosphere is professional yet peaceful, representing elite technological consulting excellence."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuKaROvVuXxalwbbwDpFrYjWWDJN1q2v1xjvFhH0kLN2WmuqImW1RQMwf_qYWc_iOCY4grRG8EL8KjYc5zs6lYFvLWQzLub5OZMizIxcqXOH6mjpTtRr_-bXo6ZcwVUPTxN6i25bK9R9B_DGkqQx3ysirTklTneP6wiI_YnvtFfvppbvEo-6RsODrHLi2ZqPya6tRBUaC_zyXNhGaBx-WqxkxNcHiVDSZ3E0aBLiCLnoPr-FGBn335mtW7uBjrSxs5Vx8_KkhkzMw" />
            </div>
        </section>
        {/*  Our Journey Timeline (Asymmetric Bento)  */}
        <section className="px-margin-desktop py-section-gap max-w-container-max mx-auto">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-16">Our Evolution</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                {/*  Year 1  */}
                <div className="md:col-span-4 glass-card p-12 rounded-[48px] flex flex-col justify-between min-h-[400px]">
                    <div>
                        <span className="font-display-lg text-display-lg text-primary/10 block mb-4">2016</span>
                        <h3 className="font-headline-md text-headline-md text-primary mb-4">The Foundation</h3>
                        <p className="text-on-surface-variant font-body-md">Started as a boutique architectural firm
                            focusing on legacy system modernization for global finance.</p>
                    </div>
                    <div className="h-1 bg-primary-fixed w-1/4 rounded-full"></div>
                </div>
                {/*  Year 2  */}
                <div
                    className="md:col-span-8 glass-card p-12 rounded-[48px] flex flex-col md:flex-row gap-8 min-h-[400px] mt-12 md:mt-0">
                    <div className="md:w-1/2 flex flex-col justify-between">
                        <div>
                            <span className="font-display-lg text-display-lg text-primary/10 block mb-4">2019</span>
                            <h3 className="font-headline-md text-headline-md text-primary mb-4">Scaling Intelligence</h3>
                            <p className="text-on-surface-variant font-body-md">Pivoted to include "The Forge"—our
                                proprietary mentorship ecosystem that bridges the gap between senior architecture and
                                emerging talent.</p>
                        </div>
                        <div className="h-1 bg-primary-fixed w-full rounded-full"></div>
                    </div>
                    <div className="md:w-1/2 h-full rounded-[32px] overflow-hidden">
                        <img className="w-full h-full object-cover"
                            data-alt="A professional collaborative environment where a diverse group of engineers are engaged in a high-level technical discussion around a translucent glass table. The lighting is crisp and cool-toned, with deep blue accents reflecting off the glass surfaces. The mood is one of focused innovation and elite mentorship, emphasizing human connection within a high-tech setting."
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZVUwDj0E3pveaCkHhTy0rPzO4nNZCb3BG9uwFYhl05b5QdNwaJMfnPP9FH_oOAZsZoUFNoo47C5cUIeMmiaRlcOhENtHzxpq3R2HCSJB74vVIFjiymQHRiZZ6ULVHc09H-hbL_UAR1LG597PtwA7CnfhOu3FxwnIwFUChoNIhwi58NZMBDoeltG5UgOb0cToyioASqNYs3RV_Fh03OKfkLd3qVZ0GERfOI-PBhD14RUX8o5KOgdUITPSeA8PnCB61hxxpSYLq0A" />
                    </div>
                </div>
                {/*  Year 3  */}
                <div
                    className="md:col-span-12 glass-card p-12 rounded-[48px] flex flex-col md:flex-row items-center gap-12 mt-12">
                    <div className="md:w-1/3">
                        <span className="font-display-lg text-display-lg text-primary/10 block mb-4">2024</span>
                        <h3 className="font-headline-md text-headline-md text-primary mb-4">PathForge Global</h3>
                        <p className="text-on-surface-variant font-body-md">Today, we operate across three continents,
                            managing IT landscapes for the Fortune 100 with a focus on ethical AI and structural
                            resilience.</p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <p className="font-display-lg text-headline-xl text-primary">500+</p>
                            <p className="text-label-md font-label-md text-on-surface-variant uppercase">Projects</p>
                        </div>
                        <div className="text-center">
                            <p className="font-display-lg text-headline-xl text-primary">42</p>
                            <p className="text-label-md font-label-md text-on-surface-variant uppercase">Awards</p>
                        </div>
                        <div className="text-center">
                            <p className="font-display-lg text-headline-xl text-primary">12k</p>
                            <p className="text-label-md font-label-md text-on-surface-variant uppercase">Mentorships</p>
                        </div>
                        <div className="text-center">
                            <p className="font-display-lg text-headline-xl text-primary">99%</p>
                            <p className="text-label-md font-label-md text-on-surface-variant uppercase">Retention</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*  Trust & Validation Section  */}
        <section className="px-margin-desktop py-section-gap max-w-container-max mx-auto">
            <div className="flex flex-col gap-16">
                <div
                    className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-outline-variant pb-8">
                    <div className="max-w-2xl">
                        <h2 className="font-headline-xl text-headline-xl text-primary mb-4">Trust &amp; Validation</h2>
                        <p className="font-body-lg text-on-surface-variant">Our commitment to structural integrity is
                            validated by national recognitions and verified success metrics.</p>
                    </div>
                    <div className="flex gap-6">
                        {/*  MSME Badge  */}
                        <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border-primary/10">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                            </div>
                            <div>
                                <p className="font-label-md text-primary leading-tight">MSME Registered Company</p>
                                <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                                    Govt. of India Certified</p>
                            </div>
                        </div>
                        {/*  Make in India Badge  */}
                        <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border-primary/10">
                            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">language</span>
                            </div>
                            <div>
                                <p className="font-label-md text-primary leading-tight">Make in India</p>
                                <p className="text-[10px] font-label-sm text-on-surface-variant uppercase tracking-wider">
                                    National Initiative Partner</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  Core Trust Metrics Grid  */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="glass-card p-10 rounded-[40px] transition-all duration-500 hover:-translate-y-2 group">
                        <div
                            className="w-14 h-14 rounded-2xl bg-secondary-fixed mb-6 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <p className="font-display-lg text-headline-xl text-primary mb-1">500+</p>
                        <p className="font-label-md text-on-surface-variant uppercase tracking-widest text-glow">Students
                            Mentored</p>
                    </div>
                    <div className="glass-card p-10 rounded-[40px] transition-all duration-500 hover:-translate-y-2 group">
                        <div
                            className="w-14 h-14 rounded-2xl bg-secondary-fixed mb-6 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                            <span className="material-symbols-outlined text-2xl">terminal</span>
                        </div>
                        <p className="font-display-lg text-headline-xl text-primary mb-1">150+</p>
                        <p className="font-label-md text-on-surface-variant uppercase tracking-widest text-glow">Production
                            Projects</p>
                    </div>
                    <div className="glass-card p-10 rounded-[40px] transition-all duration-500 hover:-translate-y-2 group">
                        <div
                            className="w-14 h-14 rounded-2xl bg-secondary-fixed mb-6 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                            <span className="material-symbols-outlined text-2xl">trending_up</span>
                        </div>
                        <p className="font-display-lg text-headline-xl text-primary mb-1">95%</p>
                        <p className="font-label-md text-on-surface-variant uppercase tracking-widest text-glow">Placement
                            Success</p>
                    </div>
                    <div className="glass-card p-10 rounded-[40px] transition-all duration-500 hover:-translate-y-2 group">
                        <div
                            className="w-14 h-14 rounded-2xl bg-secondary-fixed mb-6 flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                            <span className="material-symbols-outlined text-2xl">public</span>
                        </div>
                        <p className="font-display-lg text-headline-xl text-primary mb-1">50+</p>
                        <p className="font-label-md text-on-surface-variant uppercase tracking-widest text-glow">Global
                            Industry Partners</p>
                    </div>
                </div>
            </div>
        </section>
        {/*  Mentorship Methodology (The Path Metaphor)  */}
        <section className="bg-primary py-section-gap px-margin-desktop">
            <div className="max-w-container-max mx-auto">
                <div className="flex flex-col md:flex-row gap-24 items-start">
                    <div className="md:w-1/2 sticky top-48">
                        <h2 className="font-headline-xl text-headline-xl text-white mb-8">The Methodology of Excellence</h2>
                        <p className="font-body-lg text-body-lg text-primary-fixed-dim/80 mb-12">Our consulting isn't a
                            transaction; it's a structural transformation based on four pillars of progress.</p>
                        <button
                            className="border border-white/20 text-white px-10 py-4 rounded-full font-label-md hover:bg-white hover:text-primary transition-all">Download
                            Protocol Whitepaper</button>
                    </div>
                    <div className="md:w-1/2 relative">
                        {/*  Vertical Path Line  */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-secondary-fixed-dim opacity-30"></div>
                        <div className="space-y-24">
                            {/*  Node 1  */}
                            <div className="relative pl-16 group">
                                <div
                                    className="absolute left-[20px] top-2 w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_15px_rgba(178,197,255,0.8)] transition-all group-hover:scale-150">
                                </div>
                                <h4 className="font-headline-md text-headline-md text-white mb-4">Deep Diagnosis</h4>
                                <p className="text-body-md text-primary-fixed-dim/70">We begin with a forensic audit of
                                    current infrastructure, identifying the hidden frictions that stall innovation.</p>
                            </div>
                            {/*  Node 2  */}
                            <div className="relative pl-16 group">
                                <div
                                    className="absolute left-[20px] top-2 w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_15px_rgba(178,197,255,0.8)] transition-all group-hover:scale-150">
                                </div>
                                <h4 className="font-headline-md text-headline-md text-white mb-4">Forge &amp; Scale</h4>
                                <p className="text-body-md text-primary-fixed-dim/70">Custom engineering of solutions that
                                    don't just solve today's bugs but anticipate tomorrow's scale.</p>
                            </div>
                            {/*  Node 3  */}
                            <div className="relative pl-16 group">
                                <div
                                    className="absolute left-[20px] top-2 w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_15px_rgba(178,197,255,0.8)] transition-all group-hover:scale-150">
                                </div>
                                <h4 className="font-headline-md text-headline-md text-white mb-4">Talent Integration</h4>
                                <p className="text-body-md text-primary-fixed-dim/70">Embedding our mentorship protocol into
                                    your team to ensure the knowledge remains after we leave.</p>
                            </div>
                            {/*  Node 4  */}
                            <div className="relative pl-16 group">
                                <div
                                    className="absolute left-[20px] top-2 w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_15px_rgba(178,197,255,0.8)] transition-all group-hover:scale-150">
                                </div>
                                <h4 className="font-headline-md text-headline-md text-white mb-4">Sustained Evolution</h4>
                                <p className="text-body-md text-primary-fixed-dim/70">Continuous architectural oversight and
                                    periodic adjustments to keep the ecosystem optimized.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Founders Diary</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We didn't wait for permission to build something great. Two founders, one shared obsession — using technology and strategy to solve real problems, fast.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="group bg-white rounded-3xl p-10 text-center reveal shadow-lg ring-1 ring-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="relative mb-8 inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <img
                    src={member.image}
                    className="relative w-56 h-56 rounded-full mx-auto ring-4 ring-white shadow-2xl object-cover transform group-hover:scale-105 transition-transform duration-500"
                    alt={`${member.name} - ${member.role}`}
                  />
                </div>
                <h3 className="text-2xl font-semibold text-slate-700 mb-2">{member.name}</h3>
                <p className="text-lg font-medium text-slate-600 mb-4">{member.role}</p>
                <p className="text-slate-600 leading-relaxed mb-6 px-4">{member.bio}</p>
                <div className="flex justify-center gap-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                    title={`Connect with ${member.name} on LinkedIn`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/*  Values Section (Bento Grid)  */}
        <section className="px-margin-desktop py-section-gap bg-surface-container-low rounded-t-[64px]">
            <div className="max-w-container-max mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-headline-xl text-headline-xl text-primary mb-4">Our Core Directives</h2>
                    <p className="text-body-lg text-on-surface-variant">Principles that guide every line of code and every
                        strategic consultation.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-12 rounded-[48px] shadow-sm hover:shadow-xl transition-shadow duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center mb-8">
                            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                        </div>
                        <h4 className="font-headline-md text-headline-md text-primary mb-4">Radical Integrity</h4>
                        <p className="text-on-surface-variant">We prioritize long-term system health over short-term
                            quarterly gains. We tell the truths that others avoid.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[48px] shadow-sm hover:shadow-xl transition-shadow duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center mb-8">
                            <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
                        </div>
                        <h4 className="font-headline-md text-headline-md text-primary mb-4">Structural Serenity</h4>
                        <p className="text-on-surface-variant">Complexity is the enemy. Our designs aim for a "quiet power"
                            where high-stakes systems feel manageable and calm.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[48px] shadow-sm hover:shadow-xl transition-shadow duration-500">
                        <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center mb-8">
                            <span className="material-symbols-outlined text-primary text-3xl">group</span>
                        </div>
                        <h4 className="font-headline-md text-headline-md text-primary mb-4">Human-First High Tech</h4>
                        <p className="text-on-surface-variant">Technology is a tool for human flourishing. We mentor talent
                            to become the architects of their own future.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    {/*  Footer  */}
    
    </>
  );
}
