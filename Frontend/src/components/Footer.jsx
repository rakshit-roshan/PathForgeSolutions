import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/internship', label: 'Internship' },
    { path: '/career-guidance', label: 'Career Guidance' },
    { path: '/job-consultancy', label: 'Job Consultancy' },
    { path: '/contact', label: 'Contact' }
  ];

  const services = [
    'Final Year Project Assistance',
    'Internship Programs',
    'Career Guidance',
    'Job Application Support'
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.633 7.997c.013.18.013.36.013.54 0 5.49-4.18 11.82-11.82 11.82-2.35 0-4.53-.69-6.36-1.87.33.04.65.05.99.05 1.95 0 3.75-.66 5.18-1.77a4.16 4.16 0 0 1-3.88-2.88c.25.04.5.06.77.06.37 0 .75-.05 1.1-.14a4.15 4.15 0 0 1-3.33-4.07v-.05c.55.3 1.18.48 1.86.5a4.15 4.15 0 0 1-1.85-3.46c0-.76.2-1.48.55-2.1a11.78 11.78 0 0 0 8.54 4.33 4.68 4.68 0 0 1-.1-.95 4.15 4.15 0 0 1 7.18-2.84 8.2 8.2 0 0 0 2.63-1 4.16 4.16 0 0 1-1.82 2.3 8.3 8.3 0 0 0 2.39-.65 8.93 8.93 0 0 1-2.08 2.15z"/>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.05c.53-1 1.82-2.2 3.74-2.2 4 0 4.74 2.63 4.74 6V24h-4v-5.6c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95V24h-4V8z"/>
        </svg>
      )
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.48v-1.7c-2.78.61-3.37-1.37-3.37-1.37-.46-1.2-1.14-1.52-1.14-1.52-.94-.66.07-.64.07-.64 1.05.08 1.6 1.1 1.6 1.1.93 1.63 2.44 1.16 3.04.89.09-.7.36-1.16.65-1.43-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.04-2.76-.1-.26-.45-1.33.1-2.78 0 0 .85-.28 2.8 1.05a9.3 9.3 0 0 1 5.1 0c1.95-1.33 2.8-1.05 2.8-1.05.55 1.45.2 2.52.1 2.78.64.72 1.04 1.64 1.04 2.76 0 3.93-2.34 4.8-4.57 5.05.37.33.7.97.7 1.96v2.9c0 .26.18.59.69.48A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" clipRule="evenodd"/>
        </svg>
      )
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {/* <span className="inline-flex h-9 w-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 ring-1 ring-white/10"></span> */}
            <span className="inline-flex"><img className="w-[20px]"  src="/assets/images/Logo.png" alt="logo" /></span>
            <span className="font-semibold text-white text-lg">RasuTech Consulting</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            We help students and professionals accelerate their careers with hands-on mentorship, internships, and job support.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Newsletter</h4>
          <p className="text-slate-400 text-sm mb-3">
            Get tips, resources, and new opportunities in your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm hover:shadow-lg transition-shadow"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-sm">
          <p>© {currentYear} RasuTech Consulting. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="hover:text-white transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
