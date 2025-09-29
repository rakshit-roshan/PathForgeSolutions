import { useEffect } from 'react';
import { team1, team2, team3, checkIcon, msmeBadge, makeInIndiaBadge, certificateSample } from '../utils/images';

const About = () => {
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
      image: team1,
      name: 'Alex Turner',
      role: 'Founder • Full‑Stack Architect'
    },
    {
      image: team2,
      name: 'Priya Sharma',
      role: 'Programs • Careers'
    },
    {
      image: team3,
      name: 'Michael Lee',
      role: 'Mentor • Cloud & DevOps'
    }
  ];

  const whyChooseUs = [
    'Real mentors, not generic courses',
    'Live project experience',
    'Career-first approach',
    'Community and network'
  ];

  const achievements = [
    { number: '500+', label: 'Students Mentored', icon: '👨‍🎓' },
    { number: '150+', label: 'Projects Completed', icon: '🚀' },
    { number: '95%', label: 'Success Rate', icon: '🎯' },
    { number: '50+', label: 'Industry Partners', icon: '🤝' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer at Microsoft',
      content: 'PathForge Solutions transformed my career. Their mentorship and real-world project experience gave me the confidence to land my dream job at Microsoft.',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Full Stack Developer at Amazon',
      content: 'The personalized guidance and live project exposure here is unmatched. I went from a confused graduate to a confident developer in just 6 months.',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'DevOps Engineer at Google',
      content: 'The mentors here don\'t just teach code, they teach you how to think like an engineer. This mindset shift was crucial for my career growth.',
      rating: 5
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center reveal-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6">
              About PathForge Solutions
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              A trusted MSME registered company dedicated to transforming careers through expert mentorship, 
              real-world project experience, and comprehensive career guidance.
            </p>
            
            {/* Rating Display */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-slate-900">4.9/5</span>
              <span className="text-slate-600">(200+ reviews)</span>
            </div>

            {/* Government Badges */}
            <div className="flex justify-center gap-8 flex-wrap">
              {/* MSME Badge - Left */}
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-200">
                <img src={msmeBadge} alt="MSME Registered" className="w-80 h-52 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-900">MSME Registered</p>
                <p className="text-xs text-slate-600">Government of India</p>
              </div>
              
              {/* Make in India Badge - Right */}
              <div className="bg-white rounded-2xl p-6 shadow-lg ring-1 ring-slate-200">
                <img src={makeInIndiaBadge} alt="Make in India" className="w-[28rem] h-52 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-900">Make in India</p>
                <p className="text-xs text-slate-600">Government of India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center reveal">
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{achievement.number}</div>
                <div className="text-sm text-slate-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="reveal">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission & Vision</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  To bridge the gap between academic learning and industry requirements by providing 
                  hands-on mentorship, real project exposure, and personalized career guidance that 
                  accelerates professional growth in the technology sector.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Vision</h3>
                <p className="text-slate-600 leading-relaxed">
                  To become the leading career transformation platform where every motivated learner 
                  can confidently enter the tech industry with a strong portfolio, practical skills, 
                  and the right mindset for long-term success.
                </p>
              </div>
            </div>

            <div className="reveal">
              <div className="bg-white rounded-2xl p-8 shadow-lg ring-1 ring-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Why Choose Us</h3>
                <ul className="space-y-4">
                  {whyChooseUs.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <img src={checkIcon} className="w-5 h-5 mt-0.5 flex-shrink-0" alt="check" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold text-slate-900">4.9/5</span>
                  </div>
                  <p className="text-sm text-slate-600">Based on 200+ student reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our successful graduates have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg ring-1 ring-slate-200 reveal">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Showcase Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Internship Completion Certificate</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-8">
              Upon successful completion of our internship programs, interns receive professional certificates 
              that validate their skills and enhance their career prospects.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Certificate Image */}
            <div className="reveal">
              <div className="bg-slate-50 rounded-2xl p-6 shadow-lg ring-1 ring-slate-200">
                <img 
                  src={certificateSample} 
                  alt="PathForge Solutions Internship Certificate Sample" 
                  className="w-full h-auto rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Certificate Benefits */}
            <div className="reveal">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Certificate Benefits & Features</h3>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Professional Recognition</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Industry-standard certificate design
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      MSME registered company validation
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Unique certificate number for verification
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Career Enhancement</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Validates real-world project experience
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Enhances resume and LinkedIn profile
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Industry mentor endorsement
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Additional Perks</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Letter of Recommendation (LOR)
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Portfolio review and optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <img src={checkIcon} className="w-4 h-4 text-indigo-600" alt="check" />
                      Job placement assistance
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl text-white">
                <h4 className="text-lg font-semibold mb-2">Ready to Earn Your Certificate?</h4>
                <p className="text-white/90 mb-4">
                  Join our internship programs and get certified by industry experts with real project experience.
                </p>
                <a 
                  href="/internship" 
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  View Internship Tracks
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Industry veterans with years of experience in mentoring and career development.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-6 text-center reveal">
                <img src={member.image} className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-white shadow-lg" alt={`${member.name} - ${member.role}`} />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-cyan-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="reveal">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of successful professionals who started their journey with PathForge Solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Your Journey
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
