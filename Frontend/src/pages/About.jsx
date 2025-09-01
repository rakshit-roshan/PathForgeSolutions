import { useEffect } from 'react';
import { team1, team2, team3, checkIcon } from '../utils/images';

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

  return (
    <>
      {/* Header Section */}
      <section className="bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">About PathForge Solutions</h1>
          <p className="mt-3 text-slate-600 max-w-3xl">
            We are a team of engineers and mentors helping learners transition into confident professionals.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 reveal">
            <h2 className="text-2xl font-bold">Mission</h2>
            <p className="mt-2 text-slate-600">
              Provide hands-on learning, real project exposure, and personalized guidance to accelerate careers.
            </p>

            <h2 className="mt-8 text-2xl font-bold">Vision</h2>
            <p className="mt-2 text-slate-600">
              A world where any motivated learner can confidently enter the tech industry with a strong portfolio.
            </p>
          </div>
          <div className="reveal">
            <div className="rounded-2xl ring-1 ring-slate-200 p-6">
              <h3 className="font-semibold">Why choose us</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {whyChooseUs.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <img src={checkIcon} className="w-4 h-4" alt="check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold">Our Team</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="rounded-xl ring-1 ring-slate-200 p-4 reveal">
                <img src={member.image} className="w-full rounded-lg" alt={`${member.name} - ${member.role}`} />
                <div className="mt-4">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-slate-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
