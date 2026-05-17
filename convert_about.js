const fs = require('fs');

const aboutHtml = fs.readFileSync('d:\\Spring\\PathForgeSolutions\\sampleUI\\about.html', 'utf8');

// Extract between </nav> and <footer>
const bodyMatch = aboutHtml.match(/<\/nav>([\s\S]*?)<footer/i);
let mainContent = bodyMatch ? bodyMatch[1] : aboutHtml;

mainContent = mainContent.replace(/class=/g, 'className=');
mainContent = mainContent.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
mainContent = mainContent.replace(/<input([^>]+[^\/])>/g, '<input$1 />');
mainContent = mainContent.replace(/<br>/g, '<br />');
mainContent = mainContent.replace(/<hr([^>]*[^\/])?>/g, '<hr$1 />');

// Replace style="..."
mainContent = mainContent.replace(/style="([^"]*)"/g, (match, p1) => {
  if (p1.includes('radial-gradient')) {
    return `style={{ background: '${p1.replace('background: ', '').replace(';', '')}' }}`;
  }
  if (p1.includes('font-variation-settings')) {
    return `style={{ fontVariationSettings: '${p1.replace('font-variation-settings: ', '').replace(/;/g, '').replace(/'/g, '"')}' }}`;
  }
  return match;
});

// HTML comments to JSX comments
mainContent = mainContent.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Let's locate the "Founder Story Section" in mainContent using regex to ignore spaces
const startRegex = /\{\/\*\s+Founder Story Section \(Editorial Layout\)\s+\*\/\}/;
const endRegex = /\{\/\*\s+Values Section \(Bento Grid\)\s+\*\/\}/;

const startMatch = mainContent.match(startRegex);
const endMatch = mainContent.match(endRegex);

const oldTeamSection = `
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
                    alt={\`\${member.name} - \${member.role}\`}
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
                    title={\`Connect with \${member.name} on LinkedIn\`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
`;

let finalContent = mainContent;
if (startMatch && endMatch) {
  const startIndex = startMatch.index;
  const endIndex = endMatch.index;
  finalContent = mainContent.substring(0, startIndex) + oldTeamSection + mainContent.substring(endIndex);
} else {
  console.log("Could not find start/end comments!");
}

const finalJsx = `"use client";

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
      ${finalContent}
    </>
  );
}
`;

fs.writeFileSync('d:\\Spring\\PathForgeSolutions\\Frontend\\src\\app\\(public)\\about\\page.jsx', finalJsx);
console.log("Converted About page successfully with matching team section!");
