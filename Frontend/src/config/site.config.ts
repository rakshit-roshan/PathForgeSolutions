// =====================================================================
// site.config.ts — SINGLE SOURCE OF TRUTH
// =====================================================================
// ✏️  EDIT THIS FILE to change any text, branding, contact info,
//    navigation, services, team members, or SEO metadata.
//    Every component in this project references these values.
//    You should NEVER need to hunt through individual component files.
// =====================================================================

export const siteConfig = {
  // ── BRAND ───────────────────────────────────────────────────────────
  name: "RasuTech Consulting",
  shortName: "RasuTech Consulting",
  tagline: "Build your tech career with a trusted IT partner",
  description: "We mentor students and professionals through real projects, internships, career guidance, and complete job application support.",
  logo: "/assets/images/Logo.png",
  favicon: "/favicon.ico",
  foundedYear: 2022,

  // ── CONTACT ─────────────────────────────────────────────────────────
  contact: {
    email: "rakshitros1@gmail.com",
    phone: "+91 XXXXX XXXXX",     // ✏️ Update with real number
    whatsapp: "+91 XXXXX XXXXX",     // ✏️ Update with real WhatsApp
    address: "India",               // ✏️ Full address here
  },

  // ── SOCIAL LINKS ────────────────────────────────────────────────────
  social: {
    twitter: "",
    linkedin: "",
    github: "",
    instagram: "",
    youtube: "",
  },

  // ── NAVIGATION ──────────────────────────────────────────────────────
  navLinks: [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/internship", label: "Internship" },
    { path: "/job-consultancy", label: "Job Consultancy" },
    { path: "/contact", label: "Contact" },
  ],

  // ── STATISTICS ──────────────────────────────────────────────────────
  stats: [
    { number: "500+", label: "Students Mentored", icon: "graduation-cap" },
    { number: "150+", label: "Projects Completed", icon: "rocket" },
    { number: "95%", label: "Success Rate", icon: "target" },
    { number: "50+", label: "Industry Partners", icon: "handshake" },
  ],

  // ── TEAM ────────────────────────────────────────────────────────────
  team: [
    {
      name: "Rakshit Roshan",
      role: "Founder • Full‑Stack Architect",
      image: "/assets/images/team1.jpg",
      linkedin: "",
    },
    {
      name: "Sukanya Patil",
      role: "Co-Founder • Business Consultant",
      image: "/assets/images/team2.jpg",
      linkedin: "",
    },
  ],

  // ── SERVICES ────────────────────────────────────────────────────────
  services: [
    {
      title: "Final Year Projects",
      description: "Guided research, architecture, and end-to-end build with documentation.",
      path: "/services#projects",
      icon: "graduation-cap",
    },
    {
      title: "Internships",
      description: "Structured training with live projects to build real-world skills.",
      path: "/internship",
      icon: "briefcase",
    },
    {
      title: "Job Consultancy",
      description: "Application assistance and interview scheduling made simple.",
      path: "/job-consultancy",
      icon: "calendar",
    },
  ],

  // ── INTERNSHIP TRACKS ────────────────────────────────────────────────
  internshipTracks: [
    { title: "Data & Gen-AI", stack: "Python, Vector DB, LLMs", duration: "2-3 months" },
    { title: "Full-Stack Web", stack: "Suits to project needs", duration: "2-3 months" },
    { title: "Frontend Development", stack: "HTML, CSS, Tailwind, JavaScript, React", duration: "1-2 months" },
    { title: "Backend Development", stack: "Node.js, Express, MongoDB, SQL, Spring Boot", duration: "2-3 months" },
    { title: "UI / UX Design", stack: "Figma, Canva", duration: "1-2 months" },
    { title: "Technical Writing", stack: "Suits to project needs", duration: "1-2 months" },
  ],

  // ── TESTIMONIALS ─────────────────────────────────────────────────────
  testimonials: [
    {
      name: "Sarah Johnson",
      role: "Software Engineer at Microsoft",
      content: "RasuTech Consulting transformed my career. Their mentorship and real-world project experience gave me the confidence to land my dream job.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Full Stack Developer at Amazon",
      content: "The personalized guidance and live project exposure here is unmatched. I went from a confused graduate to a confident developer in just 6 months.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "DevOps Engineer at Google",
      content: "The mentors here don't just teach code, they teach you how to think like an engineer. This mindset shift was crucial for my career growth.",
      rating: 5,
    },
  ],

  // ── WHY CHOOSE US ────────────────────────────────────────────────────
  whyChooseUs: [
    "Real mentors, not generic courses",
    "Live project experience",
    "Career-first approach",
    "Community and network",
  ],

  // ── INTERNSHIP BENEFITS ──────────────────────────────────────────────
  internshipBenefits: [
    "Structured curriculum",
    "1:1 mentor feedback",
    "Peer community",
    "Career services",
    "Certificate + LOR on completion",
  ],

  // ── SEO ─────────────────────────────────────────────────────────────
  seo: {
    defaultTitle: "RasuTech Consulting | IT Career & Internship Partner",
    titleTemplate: "%s | RasuTech Consulting",
    defaultDescription: "MSME-registered IT consultancy offering internships, final year projects, career guidance, and job support in India.",
    keywords: ["internship", "IT consulting", "career guidance", "final year project", "mentorship", "India"],
    ogImage: "/assets/images/og-image.jpg",
    siteUrl: "https://rasutech.in",     // ✏️ Update with real domain
    twitterHandle: "@rasutech",
  },

  // ── FOOTER ──────────────────────────────────────────────────────────
  footer: {
    tagline: "We help students and professionals accelerate their careers with hands-on mentorship, internships, and job support.",
    services: [
      "Final Year Project Assistance",
      "Internship Programs",
      "Career Guidance",
      "Job Application Support",
    ],
    legalLinks: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
  },

  // ── ADMIN MAIL CONFIG ────────────────────────────────────────────────
  adminEmails: ["rakshitros1@gmail.com", "sukanyapatil7875@gmail.com"],

  // ── RATINGS ─────────────────────────────────────────────────────────
  rating: {
    score: "4.9",
    outOf: "5",
    count: "200+",
    label: "student reviews",
  },
} as const;

export type SiteConfig = typeof siteConfig;
