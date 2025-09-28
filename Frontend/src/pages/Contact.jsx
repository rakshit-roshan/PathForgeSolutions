import { useEffect, useState, useRef } from 'react';

const Contact = () => {
  const [selectedService, setSelectedService] = useState('');
  const [showInternshipFields, setShowInternshipFields] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [showCustomIdea, setShowCustomIdea] = useState(false);
  
  // Dropdown states
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);
  const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
  const [experienceDropdownOpen, setExperienceDropdownOpen] = useState(false);
  
  // Search states
  const [serviceSearch, setServiceSearch] = useState('');
  const [trackSearch, setTrackSearch] = useState('');
  
  // Refs for dropdowns
  const serviceDropdownRef = useRef(null);
  const trackDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const experienceDropdownRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setServiceDropdownOpen(false);
      }
      if (trackDropdownRef.current && !trackDropdownRef.current.contains(event.target)) {
        setTrackDropdownOpen(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target)) {
        setDurationDropdownOpen(false);
      }
      if (experienceDropdownRef.current && !experienceDropdownRef.current.contains(event.target)) {
        setExperienceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setShowInternshipFields(service === 'internship');
    setServiceDropdownOpen(false);
    setServiceSearch('');
  };

  const handleTrackChange = (track) => {
    setSelectedTrack(track);
    setShowCustomIdea(track === 'custom');
    setTrackDropdownOpen(false);
    setTrackSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted');
  };

  // Service options with icons
  const serviceOptions = [
    { value: 'project-assistance', label: 'Final Year Project Assistance', description: 'Guidance, mentoring & project building', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'blue' },
    { value: 'internship', label: 'Internship Program', description: 'Training with live projects', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6', color: 'green' },
    { value: 'career-guidance', label: 'Career Guidance', description: 'Resume review & interview prep', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: 'purple' },
    { value: 'job-consultancy', label: 'Job Consultancy', description: 'Application help & job scheduling', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'orange' },
    { value: 'other', label: 'Other', description: 'Custom requirements', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'slate' }
  ];

  // Track options with icons
  const trackOptions = [
    { value: 'data-genai', label: 'Data & Gen-AI', description: 'Python, Vector DB, LLMs', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'blue' },
    { value: 'fullstack', label: 'Full-Stack Web Development', description: 'End-to-end web solutions', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4', color: 'green' },
    { value: 'frontend', label: 'Frontend Development', description: 'HTML, CSS, JavaScript, React', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', color: 'purple' },
    { value: 'backend', label: 'Backend Development', description: 'Node.js, Express, MongoDB, Spring Boot', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01', color: 'orange' },
    { value: 'uiux', label: 'UI/UX Design', description: 'Figma, Canva, User Experience', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', color: 'pink' },
    { value: 'technical-writing', label: 'Technical Writing', description: 'Documentation & content creation', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'indigo' },
    { value: 'custom', label: 'Custom/Ideas', description: 'Your own project concept', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4', color: 'slate' }
  ];

  // Duration options with icons
  const durationOptions = [
    { value: '1-month', label: '1 Month', description: 'Quick intensive program', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'blue' },
    { value: '2-months', label: '2 Months', description: 'Balanced learning pace', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'green' },
    { value: '3-months', label: '3 Months', description: 'Comprehensive program', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'purple' },
    { value: '6-months', label: '6 Months', description: 'Deep dive specialization', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'orange' }
  ];

  // Experience options with icons
  const experienceOptions = [
    { value: 'beginner', label: 'Beginner (0-1 year)', description: 'New to programming', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'green' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)', description: 'Some programming experience', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'blue' },
    { value: 'advanced', label: 'Advanced (3+ years)', description: 'Experienced developer', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'purple' }
  ];

  // Filter options based on search
  const filteredServiceOptions = serviceOptions.filter(option =>
    option.label.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    option.description.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredTrackOptions = trackOptions.filter(option =>
    option.label.toLowerCase().includes(trackSearch.toLowerCase()) ||
    option.description.toLowerCase().includes(trackSearch.toLowerCase())
  );

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
      pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-200',
      indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
      slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
    };
    return colors[color] || colors.slate;
  };

  const getSelectedServiceLabel = () => {
    const option = serviceOptions.find(opt => opt.value === selectedService);
    return option ? option.label : 'Select a service';
  };

  const getSelectedTrackLabel = () => {
    const option = trackOptions.find(opt => opt.value === selectedTrack);
    return option ? option.label : 'Select a track';
  };

  const getSelectedDurationLabel = () => {
    const option = durationOptions.find(opt => opt.value === selectedDuration);
    return option ? option.label : 'Select duration';
  };

  const getSelectedExperienceLabel = () => {
    const option = experienceOptions.find(opt => opt.value === selectedExperience);
    return option ? option.label : 'Select experience level';
  };

  return (
    <>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Get in touch
            </h1>
            <p className="mt-4 text-lg text-slate-600">Ready to start your journey? We're here to help you succeed.</p>
            <p className="mt-2 text-slate-500">We usually respond within 24 hours.</p>
          </div>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 reveal">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                <p className="mt-2 text-slate-600">Tell us about your needs and we'll get back to you soon.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Full Name *</label>
                    <input 
                      id="name" 
                      name="name" 
                      type="text" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400" 
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address *</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">Phone Number</label>
                    <input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400" 
                      placeholder="+1 (234) 567-8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Service Type *</label>
                    <div className="relative" ref={serviceDropdownRef}>
                      <button 
                        type="button"
                        onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-left flex items-center justify-between group ${serviceDropdownOpen ? 'ring-4 ring-blue-500/20 border-blue-500' : ''}`}
                      >
                        <span className={selectedService ? 'text-slate-900' : 'text-slate-400'}>
                          {getSelectedServiceLabel()}
                        </span>
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      <input type="hidden" name="subject" value={selectedService} />
                      
                      {serviceDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                          <div className="p-2">
                            <div className="relative mb-2">
                              <input 
                                type="text" 
                                placeholder="Search services..." 
                                value={serviceSearch}
                                onChange={(e) => setServiceSearch(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                              />
                              <svg className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                              </svg>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                              {filteredServiceOptions.map((option) => (
                                <button 
                                  key={option.value}
                                  type="button" 
                                  onClick={() => handleServiceChange(option.value)}
                                  className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 flex items-center gap-3 group"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">{option.label}</div>
                                    <div className="text-xs text-slate-500">{option.description}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Internship Fields */}
                {showInternshipFields && (
                  <div className="space-y-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900">Internship Details</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Preferred Track *</label>
                        <div className="relative" ref={trackDropdownRef}>
                          <button 
                            type="button"
                            onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
                            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-left flex items-center justify-between group ${trackDropdownOpen ? 'ring-4 ring-blue-500/20 border-blue-500' : ''}`}
                          >
                            <span className={selectedTrack ? 'text-slate-900' : 'text-slate-400'}>
                              {getSelectedTrackLabel()}
                            </span>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </button>
                          <input type="hidden" name="internship-track" value={selectedTrack} />
                          
                          {trackDropdownOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                              <div className="p-2">
                                <div className="relative mb-2">
                                  <input 
                                    type="text" 
                                    placeholder="Search tracks..." 
                                    value={trackSearch}
                                    onChange={(e) => setTrackSearch(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                  />
                                  <svg className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                  </svg>
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                  {filteredTrackOptions.map((option) => (
                                    <button 
                                      key={option.value}
                                      type="button" 
                                      onClick={() => handleTrackChange(option.value)}
                                      className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 flex items-center gap-3 group"
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                        </svg>
                                      </div>
                                      <div>
                                        <div className="font-medium text-slate-900">{option.label}</div>
                                        <div className="text-xs text-slate-500">{option.description}</div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Preferred Duration</label>
                        <div className="relative" ref={durationDropdownRef}>
                          <button 
                            type="button"
                            onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
                            className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-left flex items-center justify-between group ${durationDropdownOpen ? 'ring-4 ring-blue-500/20 border-blue-500' : ''}`}
                          >
                            <span className={selectedDuration ? 'text-slate-900' : 'text-slate-400'}>
                              {getSelectedDurationLabel()}
                            </span>
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </button>
                          <input type="hidden" name="duration" value={selectedDuration} />
                          
                          {durationDropdownOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                              <div className="p-2 space-y-1">
                                {durationOptions.map((option) => (
                                  <button 
                                    key={option.value}
                                    type="button" 
                                    onClick={() => {
                                      setSelectedDuration(option.value);
                                      setDurationDropdownOpen(false);
                                    }}
                                    className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 flex items-center gap-3 group"
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-900">{option.label}</div>
                                      <div className="text-xs text-slate-500">{option.description}</div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {showCustomIdea && (
                      <div className="space-y-2">
                        <label htmlFor="custom-idea" className="block text-sm font-semibold text-slate-700">Describe Your Project Idea *</label>
                        <textarea 
                          id="custom-idea" 
                          name="custom-idea" 
                          rows="4" 
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400" 
                          placeholder="Tell us about your project idea, goals, and what you'd like to learn..."
                          required
                        ></textarea>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">Experience Level</label>
                      <div className="relative" ref={experienceDropdownRef}>
                        <button 
                          type="button"
                          onClick={() => setExperienceDropdownOpen(!experienceDropdownOpen)}
                          className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-left flex items-center justify-between group ${experienceDropdownOpen ? 'ring-4 ring-blue-500/20 border-blue-500' : ''}`}
                        >
                          <span className={selectedExperience ? 'text-slate-900' : 'text-slate-400'}>
                            {getSelectedExperienceLabel()}
                          </span>
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        <input type="hidden" name="experience-level" value={selectedExperience} />
                        
                        {experienceDropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <div className="p-2 space-y-1">
                              {experienceOptions.map((option) => (
                                <button 
                                  key={option.value}
                                  type="button" 
                                  onClick={() => {
                                    setSelectedExperience(option.value);
                                    setExperienceDropdownOpen(false);
                                  }}
                                  className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all duration-150 flex items-center gap-3 group"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">{option.label}</div>
                                    <div className="text-xs text-slate-500">{option.description}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 placeholder:text-slate-400" 
                    placeholder="Tell us more about your requirements, goals, or any specific questions you have..."
                  ></textarea>
                </div>

                {/* Consent */}
                <div className="flex items-start gap-3">
                  <input 
                    id="consent" 
                    name="consent" 
                    type="checkbox" 
                    required
                    className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2" 
                  />
                  <label htmlFor="consent" className="text-sm text-slate-600">
                    I agree to be contacted regarding my inquiry and understand that my information will be handled according to your 
                    <a href="#" className="text-blue-600 hover:text-blue-700 underline">privacy policy</a>.
                  </label>
                </div>

                
                <div className="text-sm"></div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transform transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="reveal">
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="text-slate-600">info@PathForge Solutions.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Phone</p>
                      <p className="text-slate-600">+91 9709203002</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Location</p>
                      <p className="text-slate-600">Andheri East, Mumbai, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Office Location</h3>
                </div>
                <iframe 
                  title="Location" 
                  src="https://maps.google.com/maps?q=Mumbai&t=&z=11&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="200" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>

            <div className="reveal">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Ready to get started?</h3>
                <p className="text-blue-100 mb-4">Book a free consultation call to discuss your needs and how we can help.</p>
                <button className="w-full bg-white text-blue-700 font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                  Schedule Free Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
