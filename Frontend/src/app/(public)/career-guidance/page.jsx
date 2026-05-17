import Link from 'next/link';
import { siteConfig } from '@/config/site.config';

export default function Page() {
    return (
        <>

            {/*  Hero Section  */}
            <header
                className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                    <div className="lg:col-span-7">
                        <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">EXECUTIVE CAREER ADVISORY</span>
                        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-[#0A2156] leading-[1.1] tracking-tight mb-8">
                            The Architecture of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">Career Ascent</span>
                        </h1>
                        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mb-10">We engineer professional
                            trajectories for the elite tier of IT leadership. From portfolio optimization to executive
                            roadmapping, we build the scaffolding for your next decade of growth.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/contact"
                                className="btn-premium-gradient"
                            >
                                Start Your Roadmap
                            </Link>
                            <Link
                                href="/about"
                                className="glass-card px-8 py-2.5 rounded-[12px] font-label-sm text-primary border border-primary/10 hover:bg-white/80 transition-colors flex items-center justify-center"
                            >
                                View Methodology
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-5 relative">
                        <div
                            className="glass-card h-[360px] w-full rounded-[32px] p-6 flex items-center justify-center overflow-hidden">
                            <img alt="Executive Mentorship" className="w-full h-[312px] object-cover rounded-[24px]"
                                data-alt="A sophisticated portrait of a high-level executive female mentor in a minimalist, glass-walled office environment. The lighting is soft and professional, highlighting a calm and authoritative presence. The background features blurred architectural elements of a modern city at dusk, utilizing a palette of deep blues, soft whites, and warm amber accents. The overall mood is one of serene power and technological sophistication."
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANQvj-DsEfNzhYVEVo3PmH3EHaWaf8vqKzItV0SdTPxZ7vYvJKkOaAnF3A5p3iMFIRkyFxRoAG91UFCOGrsq4sXBxPdDxlvjr22BeZQC3q-ljNKTb165GArAw5TZMV0Rsmqj3RdEFKhvlTXHbKt15WJ48xUDK2vY2V58b0ZPlaDHd1-UiQy52TSdyy8qTQHFYJ8y6RPcfw-KfeMCDPm07y9yWv3zQz-kkvvVyw0Fnw1NBR6ZF86ccboYKK0Bu30E2gXOOQ6c5QeoE" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 glass-card p-4 rounded-xl shadow-lg hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="bg-secondary-container p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-on-secondary-container">trending_up</span>
                                </div>
                                <div>
                                    <div className="text-label-sm font-label-sm text-on-surface-variant uppercase">Salary Growth
                                    </div>
                                    <div className="text-headline-md font-headline-md text-primary">+42% Avg.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/*  Bento Grid Services  */}
            <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-headline-xl font-headline-xl text-primary mb-4">Core Optimization Verticals</h2>
                    <p className="text-body-md font-body-md text-on-surface-variant max-w-xl mx-auto">Precision-tuned services
                        designed to navigate the complexities of the modern high-tech labor market.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto lg:h-[800px]">
                    {/*  Resume Engineering  */}
                    <div
                        className="md:col-span-7 glass-card p-12 rounded-[40px] flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all">
                        <div>
                            <div
                                className="w-16 h-16 bg-primary-fixed rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-3xl">description</span>
                            </div>
                            <h3 className="text-headline-lg font-headline-lg text-primary mb-4">Resume Engineering</h3>
                            <p className="text-body-md font-body-md text-on-surface-variant max-w-md">Moving beyond templates. We
                                engineer your professional history into a narrative of quantifiable impact and technical
                                mastery.</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-label-md font-label-md text-primary"><span
                                    className="material-symbols-outlined text-sm">check_circle</span> ATS Logic Mapping</li>
                                <li className="flex items-center gap-2 text-label-md font-label-md text-primary"><span
                                    className="material-symbols-outlined text-sm">check_circle</span> Impact Quantization</li>
                            </ul>
                            <span
                                className="material-symbols-outlined text-primary text-4xl opacity-20 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                        </div>
                    </div>
                    {/*  LinkedIn Branding  */}
                    <div
                        className="md:col-span-5 glass-card p-12 rounded-[40px] flex flex-col items-center text-center justify-center group cursor-pointer hover:shadow-2xl transition-all bg-gradient-to-br from-white/40 to-secondary-fixed/20">
                        <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center mb-8">
                            <span className="material-symbols-outlined text-on-secondary-container text-4xl">hub</span>
                        </div>
                        <h3 className="text-headline-md font-headline-md text-primary mb-4">LinkedIn Branding</h3>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">Converting your profile into an inbound
                            opportunity magnet for executive recruiters.</p>
                    </div>
                    {/*  Portfolio Optimization  */}
                    <div
                        className="md:col-span-5 glass-card p-12 rounded-[40px] flex flex-col justify-center group cursor-pointer hover:shadow-2xl transition-all">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-12 h-12 bg-on-tertiary-container rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">grid_view</span>
                            </div>
                            <h3 className="text-headline-md font-headline-md text-primary">Portfolio Tuning</h3>
                        </div>
                        <p className="text-body-sm font-body-sm text-on-surface-variant mb-6">Structural audit of technical case
                            studies and high-impact solution architectures.</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-surface-container rounded-full text-label-sm font-label-sm">System
                                Design</span>
                            <span className="px-3 py-1 bg-surface-container rounded-full text-label-sm font-label-sm">UX
                                Logic</span>
                            <span className="px-3 py-1 bg-surface-container rounded-full text-label-sm font-label-sm">Stack
                                Mastery</span>
                        </div>
                    </div>
                    {/*  Mock Interviews  */}
                    <div
                        className="md:col-span-7 glass-card p-12 rounded-[40px] bg-primary-container text-white overflow-hidden relative group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-headline-lg font-headline-lg mb-4">Executive Preparation</h3>
                                <p className="text-on-primary-container text-body-md max-w-sm">High-stakes simulation for C-suite
                                    and Senior Engineering roles with Silicon Valley veterans.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/10 p-4 rounded-2xl flex-1">
                                    <div className="text-label-sm opacity-60 mb-1">Pass Rate</div>
                                    <div className="text-headline-md">89%</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-2xl flex-1">
                                    <div className="text-label-sm opacity-60 mb-1">Feedback Nodes</div>
                                    <div className="text-headline-md">150+</div>
                                </div>
                            </div>
                        </div>
                        {/*  Abstract visual element  */}
                        <div
                            className="absolute top-0 right-0 w-1/2 h-full opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <span
                                className="material-symbols-outlined text-[300px] leading-none absolute -right-10 -top-10">forum</span>
                        </div>
                    </div>
                </div>
            </section>
            {/*  Career Roadmapping visualization  */}
            <section
                className="py-section-gap bg-primary text-white rounded-[32px] md:rounded-[48px] mx-4 md:mx-10 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-container-max mx-auto">
                    <div className="mb-6">
                        <span className="text-label-md font-label-md text-secondary-fixed mb-4 inline-block">STRATEGIC
                            PLANNING</span>
                        <h2 className="text-headline-xl font-headline-xl mb-6">The {siteConfig.shortName} Roadmap</h2>
                        <p className="text-on-primary-container text-body-lg max-w-2xl">A longitudinal view of your professional
                            evolution, spanning 18 to 36 months of deliberate growth.</p>
                    </div>
                    <div className="relative">
                        {/*  Vertical Line  */}
                        <div
                            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2 hidden md:block">
                        </div>
                        <div className="space-y-24 relative">
                            {/*  Step 1  */}
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1 md:text-right">
                                    <h4 className="text-headline-md font-headline-md mb-2">Phase 01: Baseline Audit</h4>
                                    <p className="text-on-primary-container text-body-md">Gap analysis of current market value
                                        against target compensation tiers and technical requirements.</p>
                                </div>
                                <div
                                    className="w-12 h-12 bg-secondary-fixed rounded-full border-[6px] border-primary-container flex items-center justify-center relative z-10">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                            {/*  Step 2  */}
                            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                                <div className="flex-1 text-left">
                                    <h4 className="text-headline-md font-headline-md mb-2">Phase 02: Brand Reconstruction</h4>
                                    <p className="text-on-primary-container text-body-md">Synchronized rollout of engineered assets
                                        across LinkedIn, personal portfolios, and executive networks.</p>
                                </div>
                                <div
                                    className="w-12 h-12 bg-secondary-fixed rounded-full border-[6px] border-primary-container flex items-center justify-center relative z-10">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                            {/*  Step 3  */}
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1 md:text-right">
                                    <h4 className="text-headline-md font-headline-md mb-2">Phase 03: Market Penetration</h4>
                                    <p className="text-on-primary-container text-body-md">Targeted interview cycles and negotiation
                                        strategy to secure high-leverage compensation packages.</p>
                                </div>
                                <div
                                    className="w-12 h-12 bg-secondary-fixed rounded-full border-[6px] border-primary-container flex items-center justify-center relative z-10">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                </div>
                                <div className="flex-1 hidden md:block"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*  ATS Optimization Flow  */}
            <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-headline-xl font-headline-xl text-primary mb-8 leading-tight">ATS Optimization &amp;
                            Algorithm Alignment</h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div
                                    className="flex-shrink-0 w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">analytics</span>
                                </div>
                                <div>
                                    <h4 className="text-headline-md font-headline-md text-primary mb-2">Semantic Keyword Injection
                                    </h4>
                                    <p className="text-body-md font-body-md text-on-surface-variant">We align your technical
                                        expertise with the specific semantic trees used by top-tier ATS platforms like
                                        Greenhouse and Lever.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div
                                    className="flex-shrink-0 w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">architecture</span>
                                </div>
                                <div>
                                    <h4 className="text-headline-md font-headline-md text-primary mb-2">Structural Parsing Logic
                                    </h4>
                                    <p className="text-body-md font-body-md text-on-surface-variant">Layouts designed for maximum
                                        readability by both LLM-driven screeners and human eyes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-8 rounded-[48px] ambient-shadow">
                        <div className="bg-primary-container rounded-3xl p-8 overflow-hidden relative">
                            <div className="text-label-sm font-label-sm text-secondary-fixed mb-6 uppercase tracking-widest">ATS
                                Scan Simulation</div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                                <div className="h-2 bg-white/10 rounded-full w-full"></div>
                                <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                                <div className="py-6 flex items-center justify-between">
                                    <div className="text-headline-md font-headline-md text-white">Match Score: 98.4%</div>
                                    <span className="material-symbols-outlined text-secondary-fixed text-4xl"
                                        data-weight="fill">verified</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                                <div className="h-2 bg-white/10 rounded-full w-2/3"></div>
                            </div>
                            {/*  Decorative scan line  */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-secondary-fixed/30 animate-pulse blur-sm"></div>
                        </div>
                    </div>
                </div>
            </section>
            {/*  Preparation Pipeline  */}
            <section
                className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-surface-container-low rounded-[64px] mb-section-gap">
                <div className="text-center mb-16">
                    <h2 className="text-headline-xl font-headline-xl text-primary">The Hiring Preparation Pipeline</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                    <div className="text-center p-8">
                        <div className="text-display-lg font-display-lg text-primary opacity-10 mb-4">01</div>
                        <h5 className="text-headline-md font-headline-md text-primary mb-2">Discovery</h5>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">Uncovering latent value and defining the
                            executive narrative.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="text-display-lg font-display-lg text-primary opacity-10 mb-4">02</div>
                        <h5 className="text-headline-md font-headline-md text-primary mb-2">Synthesis</h5>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">Compressing complex achievements into
                            high-signal artifacts.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="text-display-lg font-display-lg text-primary opacity-10 mb-4">03</div>
                        <h5 className="text-headline-md font-headline-md text-primary mb-2">Exposure</h5>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">Strategic deployment across high-intent
                            networking channels.</p>
                    </div>
                    <div className="text-center p-8">
                        <div className="text-display-lg font-display-lg text-primary opacity-10 mb-4">04</div>
                        <h5 className="text-headline-md font-headline-md text-primary mb-2">Capture</h5>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">Securing the optimal offer through
                            calculated negotiation.</p>
                    </div>
                </div>
            </section>
            {/*  Footer  */}

        </>
    );
}
