import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  heroBanner, 
  graduationCapIcon, 
  briefcaseIcon, 
  usersIcon, 
  calendarIcon, 
  checkIcon 
} from '../utils/images';

const Home = () => {  // Home component
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

  const services = [
    {
      path: '/services#projects',
      icon: graduationCapIcon,
      title: 'Final Year Projects',
      description: 'Guided research, architecture, and end-to-end build with documentation.',
      iconClass: 'w-7 h-7 object-contain'
    },
    {
      path: '/internship',
      icon: briefcaseIcon,
      title: 'Internships',
      description: 'Structured training with live projects to build real-world skills.',
      iconClass: 'w-6 h-6 text-indigo-600'
    },
    {
      path: '/career-guidance',
      icon: usersIcon,
      title: 'Career Guidance',
      description: 'Portfolio, resume, mock interviews, and learning path design.',
      iconClass: 'w-7 h-7 object-contain'
    },
    {
      path: '/job-consultancy',
      icon: calendarIcon,
      title: 'Job Consultancy',
      description: 'Application assistance and interview scheduling made simple.',
      iconClass: 'w-6 h-6 text-indigo-600'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white"></div>
        <div className="max-w-7xl mx-auto px-4 pt-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Build your tech career with a trusted IT partner
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-prose">
              We mentor students and professionals through real projects, internships, career guidance, and complete job application support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow hover:shadow-lg transition-shadow"
              >
                Explore Services
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md ring-1 ring-slate-300 hover:bg-slate-50"
              >
                Book a Free Call
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <img src={checkIcon} alt="check" className="w-4 h-4 text-indigo-600" />
                Mentors with industry experience
              </div>
              <div className="flex items-center gap-2">
                <img src={checkIcon} alt="check" className="w-4 h-4 text-indigo-600" />
                Live project exposure
              </div>
            </div>
          </div>
          <div className="reveal-up">
            <img
              src={heroBanner}
              alt="PathForge Solutions hero banner"
              className="w-full h-auto rounded-2xl ring-1 ring-slate-200 shadow-sm"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What we offer</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            A complete support system to help you learn, build, and land opportunities in tech.
          </p>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.path}
                className="group rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-sm transition-all reveal"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className={service.iconClass}
                    loading="lazy"
                    decoding="async"
                  />
                  <h3 className="font-semibold">{service.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 sm:p-12 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold">Unsure where to start?</h3>
              <p className="mt-2 text-white/90">
                Book a free 15-minute consultation. We'll chart your next steps.
              </p>
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-white text-slate-900 font-medium shadow hover:shadow-lg"
                >
                  Talk to an expert
                </Link>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
