"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site.config';

export default function Services() {
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
      <main>
        {/* Hero Section */}
        <section className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="flex flex-col md:flex-row items-end gap-gutter">
            <div className="md:w-2/3">
              <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">Engineered Excellence</span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#0A2156] leading-[1.1] tracking-tight mb-8">
                Architecting the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Future</span> of Tech Talent.
              </h1>
            </div>
            <div className="md:w-1/3 mb-4">
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Precision-driven IT consultancy and strategic mentorship designed for high-performance
                engineering cultures and enterprise-scale innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Services Bento Grid */}
        <section className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-8 mb-section-gap">
          {/* Service Case Study 1: SaaS Development */}
          <div className="md:col-span-8 glass-card p-12 rounded-[48px] flex flex-col gap-8 reveal">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-3 mb-6">
                  <span className="bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm px-3 py-1 rounded-full uppercase">Enterprise</span>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm px-3 py-1 rounded-full uppercase">Innovation</span>
                </div>
                <h2 className="text-headline-xl font-headline-xl text-primary mb-4">Final Year Project Assistance</h2>
              </div>
              <span className="material-symbols-outlined text-4xl text-primary-container">cloud_done</span>
            </div>
            <div className="grid md:grid-cols-2 gap-12 mt-4">
              <div>
                <h4 className="text-label-md font-label-md text-primary uppercase mb-3">Problem</h4>
                <p className="text-body-md text-on-surface-variant">Topic selection, proposal review, architecture guidance, and tech stack selection for graduating students.</p>
              </div>
              <div>
                <h4 className="text-label-md font-label-md text-primary uppercase mb-3">Process</h4>
                <p className="text-body-md text-on-surface-variant">Topic selection, proposal review, architecture guidance, and tech stack selection for graduating students.</p>
              </div>
            </div>
            <div className="relative w-full h-[300px] rounded-3xl overflow-hidden mt-6">
              <img
                alt="Architecture Visualization"
                className="w-full h-full object-cover"
                data-alt="A clean and professional architectural blueprint of a software system displayed on a large high-resolution digital screen. The screen is situated in a bright, modern IT consultancy office with floor-to-ceiling windows and minimal furniture. The lighting is soft and natural, emphasizing a calm, high-performance atmosphere. The color palette features deep blues and clean whites, aligning with a premium architectural glassmorphism aesthetic."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBszEhIIoGpyNx9TdsrzDgUPhkpQNcLNRaNXqcIjhqk54yEyLAc97bRUqvMlBilTU0ppGYAsGEjYJkUPeGVXqKn4jb-pdbB20GPswae01Pbob5UFW2QwIQuPu_bmfGf_vVM7F3ZZHLokWat3RIZCv0Kp3hl3zC6eoZQNNGMd5UNF5xdPnrZi6YxTG9NcmZU-OOyIY7GqaxB30FmDcma3svPZSxhv2Vzq7s1ReUZi1sKEQFtxkYWtOmsGXNGi3WZKxbHjS9fmkQkMAY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-t border-outline-variant pt-8">
              <div className="flex gap-12">
                <div>
                  <p className="text-headline-md font-headline-md text-primary">99.99%</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Uptime SLA</p>
                </div>
                <div>
                  <p className="text-headline-md font-headline-md text-primary">40%</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Latency Reduction</p>
                </div>
              </div>
              <Link href="/contact" className="bg-primary text-white px-8 py-3 rounded-full font-label-md hover:scale-105 transition-transform">
                Request a Mentor
              </Link>
            </div>
          </div>

          {/* Service Case Study 2: Technical Consulting */}
          <div className="md:col-span-4 glass-card p-10 rounded-[48px] flex flex-col justify-between reveal-up">
            <div>
              <span className="material-symbols-outlined text-3xl text-primary mb-6">query_stats</span>
              <h3 className="text-headline-lg font-headline-lg text-primary mb-6">Job Consultancy</h3>
              <p className="text-body-md text-on-surface-variant mb-8">Strategic placement support and industry connections for aspiring professionals.</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-body-sm text-on-surface font-medium">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>Application Form Filling
                </li>
                <li className="flex items-center gap-3 text-body-sm text-on-surface font-medium">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>Scheduling Job Calls
                </li>
                <li className="flex items-center gap-3 text-body-sm text-on-surface font-medium">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>Interview Preparation
                </li>
              </ul>
            </div>
            <div className="bg-primary-container p-6 rounded-3xl">
              <p className="text-white text-label-sm font-label-sm uppercase mb-2">Outcome</p>
              <p className="text-primary-fixed-dim text-body-md italic">"{siteConfig.shortName} restructured our entire data pipeline, resulting in a 3x increase in processing speed."</p>
            </div>
          </div>

          {/* Service Case Study 3: AI Solutions */}
          <div className="md:col-span-6 glass-card p-12 rounded-[48px] reveal">
            <h3 className="text-headline-lg font-headline-lg text-primary mb-8">AI Agentic Solutions</h3>
            <div className="flex flex-col gap-6">
              <div className="border-l-2 border-primary-fixed-dim pl-6 py-2">
                <h4 className="text-label-md font-label-md text-primary mb-1">Autonomous Agents</h4>
                <p className="text-body-sm text-on-surface-variant">Deploying intelligent AI agents for customer service and internal operations.</p>
              </div>
              <div className="border-l-2 border-primary-fixed-dim pl-6 py-2">
                <h4 className="text-label-md font-label-md text-primary mb-1">Workflow Automation</h4>
                <p className="text-body-sm text-on-surface-variant">Optimizing business processes with smart, self-correcting AI-driven workflows.</p>
              </div>
              <div className="mt-4">
                <img
                  alt="AI Network"
                  className="w-full h-48 object-cover rounded-2xl"
                  data-alt="A sophisticated digital visualization of an AI neural network with glowing nodes and intricate connection lines. The graphic is clean and minimalist, rendered in shades of primary deep blue and soft cyan on a white background. The aesthetic is futuristic yet grounded in professional IT consultancy, appearing as a floating glass layer in a high-end technological environment."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKLovGJVkaO6ZCbCKUbF64hHjL_BgzgqXcnQU6ZDi9i3kZjtB2WCqVtxBu0SWcFZvKEoyRNS_Pi_BVjvCkb1G6CXPKJNjiNkcQM8HEY8tINxUkvb_vUtmzd9qPvHpAPBi9f9eCbcFlJOeNBvMBpyE3kjPGbyZSr-2hIdB9SpokP_UiEnd5RBBbCAaeHNkE6VngfKUoKjUnmBJUuLngl7xioUTwncvBINJ4UymvOFgiKtXJkq2ciKaghWm0YNxaW5_dhhDVBgTVWNA"
                />
              </div>
            </div>
          </div>

          {/* Service Case Study 4: Mentorship Path */}
          <div className="md:col-span-6 glass-card p-12 rounded-[48px] bg-primary text-white reveal-up">
            <h3 className="text-headline-lg font-headline-lg mb-8 text-white">Internship Programs</h3>
            <div className="space-y-12">
              <div className="path-node flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-md">
                  <span className="material-symbols-outlined text-white">school</span>
                </div>
                <div>
                  <h4 className="text-label-md font-bold uppercase mb-1">Live Project Training</h4>
                  <p className="text-primary-fixed-dim text-body-sm">Curriculum based on live industry projects with weekly mentor feedback.</p>
                </div>
              </div>
              <div className="path-node flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-md">
                  <span className="material-symbols-outlined text-white">developer_mode_tv</span>
                </div>
                <div>
                  <h4 className="text-label-md font-bold uppercase mb-1">Career Guidance</h4>
                  <p className="text-primary-fixed-dim text-body-sm">ATS-ready resume engineering, LinkedIn optimization, and mock interview drills.</p>
                </div>
              </div>
              <div className="path-node flex gap-6">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0 bg-white/10 backdrop-blur-md">
                  <span className="material-symbols-outlined text-white">rocket_launch</span>
                </div>
                <div>
                  <h4 className="text-label-md font-bold uppercase mb-1">Certificates &amp; LOR</h4>
                  <p className="text-primary-fixed-dim text-body-sm">Industry-recognized certification and Letters of Recommendation for top performers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Timeline Section */}
        <section className="bg-surface-container-low py-section-gap reveal">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="mb-16">
              <h2 className="text-headline-xl font-headline-xl text-primary mb-4">Enterprise Engagement Process</h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">Our systematic approach to engineering ensures consistency, security, and velocity for every engagement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
              <div className="flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform">
                <span className="text-display-lg font-display-lg text-primary-fixed-dim opacity-40">01</span>
                <h4 className="text-headline-md font-headline-md text-primary">Discovery</h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">Defining project scope, identifying stakeholders, and mapping business logic requirements.</p>
              </div>
              <div className="flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform">
                <span className="text-display-lg font-display-lg text-primary-fixed-dim opacity-40">02</span>
                <h4 className="text-headline-md font-headline-md text-primary">Blueprint</h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">High-level architecture design, database modeling, and security protocol definition.</p>
              </div>
              <div className="flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform">
                <span className="text-display-lg font-display-lg text-primary-fixed-dim opacity-40">03</span>
                <h4 className="text-headline-md font-headline-md text-primary">Execution</h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">Agile development sprints with weekly code reviews and automated testing integration.</p>
              </div>
              <div className="flex flex-col gap-6 p-8 bg-white rounded-3xl shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform">
                <span className="text-display-lg font-display-lg text-primary-fixed-dim opacity-40">04</span>
                <h4 className="text-headline-md font-headline-md text-primary">Evolution</h4>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">Post-launch monitoring, performance tuning, and long-term mentorship handoff.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop my-section-gap reveal-up">
          <div className="glass-card p-16 rounded-[64px] text-center flex flex-col items-center gap-8 border-none bg-primary text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, #A5BBFC 0%, transparent 70%)' }}></div>
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-display-lg font-display-lg max-w-3xl text-white">Ready to Forge Your Technical Excellence?</h2>
              <p className="text-body-lg text-primary-fixed-dim max-w-xl">Whether you're a startup looking for an MVP or a student seeking world-class mentorship, we have the path ready.</p>
              <div className="flex gap-6 mt-4">
                <Link href="/contact" className="bg-white text-primary px-10 py-4 rounded-full font-label-md text-lg hover:scale-105 transition-all shadow-xl">
                  Get a Consultation
                </Link>
                <Link href="/internship" className="border border-white/30 text-white px-10 py-4 rounded-full font-label-md text-lg hover:bg-white/10 transition-all">
                  Browse Programs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
