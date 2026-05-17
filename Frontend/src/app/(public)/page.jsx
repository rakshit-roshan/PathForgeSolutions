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
        <section className="pt-24 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
            {/*  Hero Left Content  */}
            <div className="max-w-[640px]">
              <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">
                Redefining Excellence in Tech
              </span>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#0A2156] leading-[1.1] tracking-tight mb-8">
                Build, Scale &amp; Accelerate Your Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Career</span> and Business
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-[500px]">
                Architectural mentorship and high-performance engineering strategy designed for the elite tier of IT consultancy.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-3.5 rounded-full font-headline font-bold text-base shadow-md hover:opacity-90 transition-all active:scale-[0.98] hover:-translate-y-0.5"
                >
                  Explore Careers
                </Link>
                <Link
                  href="/services"
                  className="glass-card px-8 py-3.5 rounded-full font-headline font-bold text-base text-primary flex items-center gap-2 hover:bg-slate-50/50 transition-colors"
                >
                  Our Portfolio <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
            {/*  Hero Right Visuals  */}
            <div className="relative h-[360px] mt-12 lg:mt-0">
              {/*  Main Image Base  */}
              <div className="absolute inset-0 rounded-[48px] overflow-hidden shadow-2xl">
                <img
                  alt="Modern architectural workspace"
                  className="w-full h-full object-cover"
                  data-alt="A wide-angle shot of a minimalist, high-end corporate architectural space with expansive glass walls and sleek furniture. The lighting is bright and airy, reflecting a professional and high-tech atmosphere. A soft blue and white color palette dominates the scene, evoking a sense of calm power and focused engineering excellence."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvC4sN5iWnaRdWau_QUzfug1xUN207zYXdwZOu2EFTypyzHEQWqVwGIlsphhuq-DL93hMt3sIr7uwbN6ENjiPpajXc5fQb3di41ACIVJLPoMxiq34XVrOX3_p6K9jN7PK_xCVLAi6k9IzbeqOP60LPDuZuBjwOjqjAoByLozV5Q_DCgzMKXj2yMqbv9514cycYMWSh1G2RbDvmXDCRQBLf2BnULRV_vknZPO1V5mvIpSuPZSBXY03ayxUQ_2CvYY15ZKHY0d47qfs"
                />
              </div>
              {/*  Floating KPI Card 1  */}
              <div className="glass-card absolute top-12 -left-12 p-6 rounded-3xl w-64 shadow-[0_40px_100px_rgba(10,33,86,0.1)]">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      trending_up
                    </span>
                  </div>
                  <div>
                    <div className="text-label-sm font-label-sm text-on-surface-variant">EFFICIENCY</div>
                    <div className="text-headline-md font-headline-md text-primary">+84%</div>
                  </div>
                </div>
              </div>
              {/*  Floating KPI Card 2  */}
              <div className="glass-card absolute bottom-24 -right-8 p-6 rounded-3xl w-72 shadow-[0_40px_100px_rgba(10,33,86,0.1)]">
                <div className="text-label-sm font-label-sm text-on-surface-variant mb-4">ACTIVE MENTORSHIP PATHS</div>
                <div className="flex -space-x-3 mb-4">
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    data-alt="A professional headshot of a diverse male executive in a well-lit office setting. He is wearing a modern business casual shirt and has a friendly, confident expression. The background is softly blurred to keep focus on the subject."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-0fT_52eWYmawib92In6rCDkrDpI0lG5U6rJRZb2fkaiihoMnPDUJvQhD-sj2eJCg569_MzEDGh9PUGv794NX1o4Ry7csJe9lxBw5wz0Bi7GOm41UVGClbkMGa7wNYKJE3jaNZNDlB6veT14Wofs_P46mgYXOYBBfMbLPJZzO7WZ-m8k1gG8AdQygTPBg8PcivaMf_T6olPaGV0Bc_ke-qK4HiZxvezUpDyB9bwmH_wVEvKBf_aQUIwSOnVyTi73OjT9Z8nCb-EE"
                  />
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    data-alt="A professional headshot of a confident female lead engineer in a minimalist modern workspace. She has a subtle smile and looks directly at the camera, conveying expertise and leadership. The color palette is clean with high-key lighting."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXgOi29LdlSmImMkOQtZbeAeMrrgPPX-o8uyLGNsR4_e720hKC3R7yBSHww_K7QYRNshvINyrNLeilRERDfIm5nT5Nu5Xte9wgiwW7VINR4gOAug3s1zvmeIg-6V7doSuReqqFzr3rI0VF400kIA0b-8xUjCF9cm_cjWux9R6erUCwQnVUR050X1Zu1_pcNxmA2gu9dmwg8Yk9rFQ9MLG671PQbGBsnIfNJBEOA7lzk_Gyc4wFUuQcdp4MEOUsd6MK5L7mgetamYU"
                  />
                  <img
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    data-alt="A professional headshot of a young male tech professional against a bright corporate background. He has a focused and reliable appearance, wearing a tailored blazer. The aesthetic is modern, professional, and sophisticated."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeNHiR88JybrLOhP5jBXCERCWbDlXbgN5epELmMBZyG1pVHMEFIJL_kUpUsepd9HW_GlDaXJADq-4_BW47GdF8f6OMo_LXVoRlvJVcDlTrcKhSzoEUoMFWqIT6ewcrkbjfaAOUJJp-b7lti8u_vMPBBMKDaH9Q-PIg0nLV6mIsmZoTYbBO04PYKjGMZtVAva3pGzHdv8WRpC6dxrDyegkv1s92TUh8oCEqgOdHmmDVCBGXjUZBlawt3J2ihWtWeBQ-p_YydySAA2M"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white text-[10px] flex items-center justify-center">+42</div>
                </div>
                <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Trust Section  */}
        <section className="bg-primary py-24 text-white overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-md">
                <h2 className="font-headline-xl text-headline-xl mb-4">Trusted by industry leaders worldwide</h2>
                <p className="font-body-md text-body-md text-secondary-fixed-dim/70">
                  Building digital excellence through precision and architectural foresight.
                </p>
              </div>
              <div className="flex gap-16 md:gap-24">
                <div className="text-center">
                  <div className="text-[64px] font-bold tracking-tighter leading-none mb-2">500+</div>
                  <div className="text-label-md font-label-md text-secondary-fixed-dim">PROFESSIONALS</div>
                </div>
                <div className="text-center">
                  <div className="text-[64px] font-bold tracking-tighter leading-none mb-2">150+</div>
                  <div className="text-label-md font-label-md text-secondary-fixed-dim">PROJECTS</div>
                </div>
                <div className="text-center hidden sm:block">
                  <div className="text-[64px] font-bold tracking-tighter leading-none mb-2">98%</div>
                  <div className="text-label-md font-label-md text-secondary-fixed-dim">SATISFACTION</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Services Preview Bento Grid  */}
        <section className="py-section-gap px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-primary font-label-md tracking-widest uppercase mb-4 block">Our Expertise</span>
              <h2 className="font-headline-xl text-headline-xl text-primary">Strategic Architecture &amp; Growth</h2>
            </div>
            <Link href="/services" className="text-primary font-label-md flex items-center gap-2 group">
              View All Services <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[700px]">
            {/*  Bento Item 1: Large Main Service  */}
            <div className="md:col-span-2 md:row-span-2 glass-card rounded-[40px] p-12 flex flex-col justify-between group hover:shadow-2xl transition-all duration-500">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center mb-8 text-white">
                  <span className="material-symbols-outlined text-[32px]">architecture</span>
                </div>
                <h3 className="font-headline-xl text-headline-xl text-primary mb-6">Technical Architecture &amp; Engineering</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                  We design scalable, high-performance systems that form the backbone of modern enterprises, ensuring stability and speed.
                </p>
              </div>
              <div className="mt-12 overflow-hidden rounded-2xl h-64">
                <img
                  alt="Data visualization dashboard"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  data-alt="A sophisticated data visualization dashboard displayed on a clean glass screen. The UI features elegant line charts, glowing data points, and futuristic interfaces in shades of deep navy and electric blue. The overall atmosphere is highly technical, organized, and professional, perfectly capturing an engineering-focused aesthetic."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXu_uh8od1rv-aO13hiHaQ-334uUxhVEpXB_s5VxkZ3ycZYqQbchfDkvM8xh2ot9m8fDsqapueHOvPUoyfZTSUlJEaLRVeADAMfK-IIvYtuWtEjDjg4tcBu9AATe6sxtoReSon4V5dKF5z3nfIk_i1spSzNs2G2o9xNtj3UcoadPUju6wH5b_iwlSv5GcuoN-VnZPMC_1QBWkQt5Im3EKCi0wednthrFD9H-XdXflcloaXhDz2BrTKH3v4lxG-6xlClHpYkEHwCbuD8"
                />
              </div>
            </div>
            {/*  Bento Item 2: Mentorship  */}
            <div className="glass-card rounded-[40px] p-10 flex flex-col group hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center mb-6 text-primary-container">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Elite Mentorship</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Personalized career paths for senior engineers moving into executive roles.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <span className="text-label-sm font-label-sm px-3 py-1 bg-surface-variant rounded-full text-on-surface-variant">Career Path</span>
                <span className="text-label-sm font-label-sm px-3 py-1 bg-surface-variant rounded-full text-on-surface-variant">Leadership</span>
              </div>
            </div>
            {/*  Bento Item 3: Business Scale  */}
            <div className="glass-card rounded-[40px] p-10 flex flex-col group hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 rounded-xl bg-on-primary-container/20 flex items-center justify-center mb-6 text-primary-container">
                <span className="material-symbols-outlined">rocket_launch</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Scale Consulting</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Optimizing organizational structures and deployment pipelines for rapid growth.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <span className="text-label-sm font-label-sm px-3 py-1 bg-surface-variant rounded-full text-on-surface-variant">DevOps</span>
                <span className="text-label-sm font-label-sm px-3 py-1 bg-surface-variant rounded-full text-on-surface-variant">Strategy</span>
              </div>
            </div>
          </div>
        </section>

        {/*  Social Proof Editorial Quotes  */}
        <section className="bg-surface-container-low py-section-gap">
          <div className="max-w-container-max mx-auto px-margin-desktop">
            <div className="text-center mb-20">
              <h2 className="font-headline-xl text-headline-xl text-primary">Voices of Excellence</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/*  Quote Card 1  */}
              <div className="flex flex-col md:flex-row gap-8 items-start p-8">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-xl">
                  <img
                    alt="Marcus Thorne"
                    className="w-full h-full object-cover"
                    data-alt="A professional close-up portrait of a mature male executive with silver hair and a sharp, tailored suit. He exclaims confidence and wisdom. The lighting is soft and directed, creating an editorial feel against a muted gray corporate backdrop."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw6-mdS-YlbJhpDTIdmtKYeRPXBPHJg_b62tKyStNxRqtn6xvXkH-wIbypEl6D3Xc93YAofX3PYMRDAzHiLccl-NeFH_shCuil2BXLO_YKfBaFYhjmQDQV7HVek0DAm1GWAvX2h5SSPPKHANtwSoAtIiiA_XwKNXNYI_GI6ssiv-njLFm8RndrNJbmyhRFGTabhY-UT6oQmrZP1zboyI9dA0mRJVn9sd8QsSgyiVffrip6DeckQXy8kQwabPvFX7Uxe5jiZo_26Yg"
                  />
                </div>
                <div>
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4">format_quote</span>
                  <p className="font-display-lg text-headline-md italic text-primary leading-relaxed mb-6">
                    "PathForge didn't just help us scale; they redefined our entire approach to engineering culture. The transformation was profound and immediate."
                  </p>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-primary">Marcus Thorne</h4>
                    <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">CTO, Vertex Dynamics</p>
                  </div>
                </div>
              </div>
              {/*  Quote Card 2  */}
              <div className="flex flex-col md:flex-row gap-8 items-start p-8">
                <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-xl">
                  <img
                    alt="Sarah Jenkins"
                    className="w-full h-full object-cover"
                    data-alt="A professional headshot of a female tech entrepreneur in a modern office environment. She has a bright, intellectual expression and is wearing a sleek navy blazer. The image is clean, sharp, and reflects high-level professional success."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNWxRGIF26_KlCyVsAWzkgKHbi-hPfvAiTQoKnIIEQy7lQY0PcdGoBp1NiRyY3M8O8BVmD99ckfCT_vzYPW0gX4Ek552ugCtBRLZu8pYAmh3xDltOywlxAQI809VLD7X6PMAfvsOeJItSvHu1ssRiwJ9v39rRPj13_Z6urYNz9aF9BUzR0nlHfaC2jHHPaVqCGAA62Zaj2PYxqObAgV51N4p884hgz5rpYM0SnYNJe1h0gGDkolQFWq2Ve_Jcy94SUGIRp98bHkis"
                  />
                </div>
                <div>
                  <span className="material-symbols-outlined text-primary-container text-4xl mb-4">format_quote</span>
                  <p className="font-display-lg text-headline-md italic text-primary leading-relaxed mb-6">
                    "The mentorship program bridge the gap between technical mastery and executive leadership. It's the highest ROI investment I've made."
                  </p>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-primary">Sarah Jenkins</h4>
                    <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">VP of Engineering, CloudCore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*  Final CTA  */}
        <section className="px-margin-desktop py-section-gap max-w-container-max mx-auto">
          <div className="relative rounded-[64px] overflow-hidden bg-primary p-16 md:p-32 text-center">
            {/*  Background Gradient Pattern  */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, #A5BBFC 0%, transparent 70%)' }}
            ></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display-lg text-headline-xl text-white mb-8">Ready to Build Something Meaningful?</h2>
              <p className="font-body-lg text-body-lg text-secondary-fixed-dim/80 mb-12">
                Join the ranks of architects and leaders shaping the future of global technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-primary px-10 py-5 rounded-full font-headline-md text-headline-md hover:bg-secondary-fixed transition-colors"
                >
                  Start Your Path
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/20 text-white px-10 py-5 rounded-full font-headline-md text-headline-md hover:bg-white/10 transition-colors"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
