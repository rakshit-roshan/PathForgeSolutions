"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Page() {
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
        {/*  Hero Section  */}
        <section className="relative pt-20 md:pt-32 pb-8 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-fixed-dim/20 blur-[120px] rounded-full"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-gutter items-start">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm mb-6">
                Internship Cohort 2024
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#0A2156] leading-[1.1] tracking-tight mb-8">
                Industry Experience <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Accelerator.</span>
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-xl mb-10">
                Bridge the gap between academic theory and high-stakes engineering. Our internship is a rigorous
                12-week immersion into architectural glassmorphism, AI scalability, and enterprise-grade deployment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-premium-gradient flex items-center gap-2"
                >
                  Apply for Accelerator
                  <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                </Link>
                <Link
                  href="/contact"
                  className="glass-card px-8 py-2.5 rounded-[12px] font-label-sm text-primary border border-primary/10 hover:bg-white transition-all active:scale-[0.98] flex items-center justify-center"
                >
                  Download Roadmap
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-8 rounded-[40px] ambient-shadow relative overflow-hidden">
                <img
                  alt="Tech Mentorship"
                  className="w-full h-[400px] object-cover rounded-[24px]"
                  data-alt="A cinematic, high-angle shot of a group of diverse young tech professionals collaborating in a sleek, glass-walled office. The lighting is soft and bright, emphasizing a professional yet energetic atmosphere. The environment is filled with minimalist furniture and high-end workstations, reflecting a modern light-mode aesthetic with deep blue accents. The mood is focused and elite, capturing the essence of high-level technological mentorship."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ3aOM_5KbsC0NGBcHt9ypq0v6yQELXM1OGvX_ZLmgSYxcqZpEvlYnucjFk0w5STucFz680StifBGvZ0eARIF3uDNfaO6LNIS427xNcEKac6QTltT3o-18LlAQebA9Q1sTgZ4RYF0Frbuk1-orlXLVodXFHL_EDKH9ph7jQSGqG4c5px5lno6v6McwfC0R5RClOthnaPrElh1hwUDteRcm_FzapwVDkRAGzSGoTbor-OCgMK61SqGsEKkJ1SoqkJ-yJk_Tig0Q9uA"
                />
                <div className="absolute bottom-12 right-12 glass-card p-6 rounded-2xl border border-white/40 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary-container"></div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-fixed-dim"></div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-tertiary-fixed"></div>
                    </div>
                    <div>
                      <div className="font-headline-md text-primary">450+</div>
                      <div className="text-label-sm text-on-surface-variant uppercase">Alumni Placed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Track Grid Section  */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-surface-container-low rounded-[64px]">
          <div className="text-center mb-20">
            <h2 className="font-headline-xl text-headline-xl text-primary mb-4">Engineering Specializations</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Selected candidates choose a specialized track mentored by senior architects from PathForge’s core solutions team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/*  Full Stack Track  */}
            <div className="glass-card p-12 rounded-[48px] hover:scale-[1.02] transition-all group">
              <span className="material-symbols-outlined text-4xl text-primary mb-6" data-icon="layers">layers</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Full Stack</h3>
              <p className="text-body-sm text-on-surface-variant mb-8">
                Architecting end-to-end resilient systems using Next.js, Go, and PostgreSQL. Focus on performance and DX.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="verified">verified</span>
                  <span className="text-label-md">Distributed Systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="verified">verified</span>
                  <span className="text-label-md">Micro-frontend Architecture</span>
                </div>
              </div>
              <Link
                href="/contact"
                className="w-full py-4 border border-primary/10 rounded-2xl font-label-md group-hover:bg-primary group-hover:text-white transition-all flex justify-between px-6 items-center"
              >
                Explore Path
                <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
              </Link>
            </div>
            {/*  AI/ML Track  */}
            <div className="glass-card p-12 rounded-[48px] hover:scale-[1.02] transition-all group">
              <span className="material-symbols-outlined text-4xl text-primary mb-6" data-icon="psychology">psychology</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">AI / ML Ops</h3>
              <p className="text-body-sm text-on-surface-variant mb-8">
                Deploying LLMs and generative models at scale. Focus on data pipelines, fine-tuning, and inference latency.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="verified">verified</span>
                  <span className="text-label-md">Vector Database Orchestration</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="verified">verified</span>
                  <span className="text-label-md">Model Quantization</span>
                </div>
              </div>
              <Link
                href="/contact"
                className="w-full py-4 border border-primary/10 rounded-2xl font-label-md group-hover:bg-primary group-hover:text-white transition-all flex justify-between px-6 items-center"
              >
                Explore Path
                <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
              </Link>
            </div>
            {/*  UI/UX Track  */}
            <div className="glass-card p-12 rounded-[48px] hover:scale-[1.02] transition-all group">
              <span className="material-symbols-outlined text-4xl text-primary mb-6" data-icon="architecture">architecture</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Product Design</h3>
              <p className="text-body-sm text-on-surface-variant mb-8">
                Mastering Architectural Glassmorphism and systematic UI patterns. Focus on accessibility and executive aesthetics.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="verified">verified</span>
                  <span className="text-label-md">Design Token Systems</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-primary-container text-sm" data-icon="verified">verified</span>
                  <span className="text-label-md">High-Fidelity Prototyping</span>
                </div>
              </div>
              <Link
                href="/contact"
                className="w-full py-4 border border-primary/10 rounded-2xl font-label-md group-hover:bg-primary group-hover:text-white transition-all flex justify-between px-6 items-center"
              >
                Explore Path
                <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
              </Link>
            </div>
          </div>
        </section>

        {/*  Cohort Hierarchy Section  */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4">
              <h2 className="font-headline-xl text-headline-xl text-primary mb-8">The Mentor Hierarchy</h2>
              <p className="text-body-md text-on-surface-variant mb-8">
                Interns are not students here; they are junior consultants assigned to specific mission pods. You operate within a structure designed for rapid knowledge transfer.
              </p>
              <div className="space-y-8 relative pl-12">
                <div className="absolute left-4 top-0 bottom-0 w-[2px] path-line"></div>
                <div className="relative">
                  <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary border-4 border-surface shadow-[0_0_15px_rgba(10,33,86,0.3)]"></div>
                  <h4 className="font-label-md text-primary uppercase">Principal Architect</h4>
                  <p className="text-body-sm text-on-surface-variant">Strategic oversight and architectural review once a week.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-10 w-6 h-6 rounded-full bg-primary-fixed-dim border-4 border-surface shadow-[0_0_15px_rgba(180,197,255,0.3)]"></div>
                  <h4 className="font-label-md text-primary uppercase">Senior Mentor</h4>
                  <p className="text-body-sm text-on-surface-variant">Daily code reviews, pair programming, and blocker resolution.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-10 w-6 h-6 rounded-full bg-secondary-fixed-dim border-4 border-surface shadow-[0_0_15px_rgba(178,197,255,0.3)]"></div>
                  <h4 className="font-label-md text-primary uppercase">The Pod (Intern Team)</h4>
                  <p className="text-body-sm text-on-surface-variant">3-5 specialists working together on a live enterprise project.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="glass-card p-12 rounded-[64px] ambient-shadow">
                <h3 className="font-headline-lg text-headline-lg text-primary mb-12">Program Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="text-display-lg font-display-lg text-primary-fixed opacity-50">01</div>
                    <h4 className="font-headline-md text-primary">Onboarding</h4>
                    <p className="text-body-sm text-on-surface-variant">Weeks 1-2: Immersion into PathForge tech stack, tooling, and culture.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-display-lg font-display-lg text-primary-fixed opacity-50">02</div>
                    <h4 className="font-headline-md text-primary">Integration</h4>
                    <p className="text-body-sm text-on-surface-variant">Weeks 3-6: Joining active projects as a junior contributor.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-display-lg font-display-lg text-primary-fixed opacity-50">03</div>
                    <h4 className="font-headline-md text-primary">Execution</h4>
                    <p className="text-body-sm text-on-surface-variant">Weeks 7-10: Leading a specific sub-feature or technical optimization.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="text-display-lg font-display-lg text-primary-fixed opacity-50">04</div>
                    <h4 className="font-headline-md text-primary">Delivery</h4>
                    <p className="text-body-sm text-on-surface-variant">Weeks 11-12: Final architectural review, certification, and hiring decisions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Bento Certification Section  */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid lg:grid-cols-3 grid-rows-2 gap-8 h-auto lg:h-[700px]">
            <div className="lg:col-span-2 glass-card p-16 rounded-[64px] flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h2 className="font-display-lg text-headline-xl text-primary mb-8">PathForge Certified Architect</h2>
                <p className="text-body-lg text-on-surface-variant max-w-xl">
                  Our certification isn't a digital badge. It's a validated portfolio of enterprise code and a recommendation from the industry's elite architects.
                </p>
              </div>
              <div className="flex gap-4 relative z-10 mt-12">
                <Link href="/contact" className="btn-premium-gradient">
                  Review Curriculum
                </Link>
                <Link
                  href="/contact"
                  className="bg-surface-container text-primary px-8 py-2.5 rounded-[12px] font-label-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  View Sample Portfolio
                </Link>
              </div>
              <img
                alt="Certification Design"
                className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-10 grayscale group-hover:grayscale-0 transition-all"
                data-alt="A macro shot of high-quality certificate paper with embossed metallic seals and elegant minimalist typography. The lighting is dramatic and moody, with deep shadows and soft highlights catching the texture of the paper. The background is a clean, modern workstation in a deep blue and white palette, reinforcing the brand's identity of quiet power and elite engineering excellence."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqtl_U8BJaGMrVxR4Zohv_7ms-iBiJlL6eoftbwqVILoNKYgDfFfYJfopDeJ8GfvDIx0ediwqq3Trmsf-SUX97i8mFmWS65gkXAoeef4ZpT4YYoTA6xJR6x9kAGydKnLlscDq5-2lr5XFE3v4pJMaDD4r2Oi-cMBmY4bfuDczRkfFF-mFDr8P4EUXdnMQ_E-qb7WVqHbyO3nHN2pvD91R_xS8hDKDGhdzeHUS9-htvyH_tfJXDC1urPwK3wjx3YBKvHodKD_MbOLw"
              />
            </div>
            <div className="bg-primary p-12 rounded-[64px] text-white flex flex-col justify-center">
              <div className="text-display-lg mb-4">92%</div>
              <div className="font-headline-md mb-2">Hiring Rate</div>
              <p className="text-body-sm opacity-80">
                Interns who complete the accelerator are offered full-time roles or placed in our partner ecosystem.
              </p>
            </div>
            <div className="glass-card p-12 rounded-[64px] border-2 border-primary/5 flex flex-col justify-between">
              <div className="space-y-6">
                <span className="material-symbols-outlined text-5xl text-primary-fixed-dim" data-icon="workspace_premium">workspace_premium</span>
                <h4 className="font-headline-md text-primary">Global Standards</h4>
                <p className="text-body-sm text-on-surface-variant">Validated against international enterprise engineering benchmarks.</p>
              </div>
              <a className="font-label-md text-primary flex items-center gap-2 group" href="#">
                Learn about validation
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="north_east">north_east</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
