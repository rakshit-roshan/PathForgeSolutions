"use client";

import { useEffect, useState, useRef } from 'react';
import { contactAPI } from '@/utils/api';

const Contact = () => {
  const [selectedService, setSelectedService] = useState('');
  const [showInternshipFields, setShowInternshipFields] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [showCustomIdea, setShowCustomIdea] = useState(false); 
  const [preferredContactMethod, setPreferredContactMethod] = useState('');
  
  // Form submission states - for beginner friendly feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  
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

  // Handle form submission - with clear feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setSubmitMessage('');
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      // Get form data using FormData - beginner friendly way
      const formData = new FormData(e.target);
      
      // Create contact data object with all form fields
      const contactData = {
        // Basic information (required fields)
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        serviceType: selectedService,
        message: formData.get('message'),
        preferredContactMethod: preferredContactMethod,
        
        // Internship specific fields (optional)
        internshipTrack: selectedTrack || null,
        duration: selectedDuration || null,
        experienceLevel: selectedExperience || null,
        customIdea: formData.get('custom-idea') || null,
        
        // Phone call scheduling fields (optional)
        preferredDate: formData.get('preferred-date') || null,
        preferredTime: formData.get('preferred-time') || null,
      };
      
      // Validate required fields
      if (!contactData.name || !contactData.email || !contactData.phone || 
          !contactData.serviceType || !contactData.message || !contactData.preferredContactMethod) {
        throw new Error('Please fill in all required fields');
      }
      
      // Submit to API
      const response = await contactAPI.submitInquiry(contactData);
      
      // Show success message
      setSubmitMessage(response.data);
      
      // Reset form after successful submission
      e.target.reset();
      setSelectedService('');
      setSelectedTrack('');
      setSelectedDuration('');
      setSelectedExperience('');
      setPreferredContactMethod('');
      setShowInternshipFields(false);
      setShowCustomIdea(false);
      
    } catch (error) {
      // Show error message
      setSubmitError(error.response?.data || error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

  // Contact method options
  const contactMethodOptions = [
    { value: 'email', label: 'Email Response', description: 'We\'ll reply to your email within 24 hours', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'blue' },
    { value: 'phone-call', label: 'Phone Call', description: 'Schedule a free 15-minute consultation call', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: 'green' },
    { value: 'whatsapp', label: 'WhatsApp Chat', description: 'Quick chat on WhatsApp for immediate assistance', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'emerald' }
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
      emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200',
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
      {/* Hero Section */}
      <section className="pt-20 md:pt-32 pb-8 px-margin-desktop max-w-container-max mx-auto overflow-hidden">
        <div className="max-w-3xl">
          <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6">
            Get In Touch
          </span>
          <h1 className="font-display-xl text-display-xl text-primary mb-6 tracking-tighter leading-tight">
            Get in touch
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
            Ready to start your journey? We're here to help you succeed.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/75">
            We usually respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="pb-24 px-margin-desktop max-w-container-max mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-[40px] p-8 md:p-10 reveal">
              <div className="mb-8">
                <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Send us a message</h2>
                <p className="text-body-md text-on-surface-variant">Tell us about your needs and we'll get back to you soon.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-label-sm font-label-sm text-primary">Full Name *</label>
                    <input 
                      id="name" 
                      name="name" 
                      type="text" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/55 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 placeholder:text-on-surface-variant/40" 
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-label-sm font-label-sm text-primary">Email Address *</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/55 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 placeholder:text-on-surface-variant/40" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-label-sm font-label-sm text-primary">Phone Number *</label>
                    <input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/55 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 placeholder:text-on-surface-variant/40" 
                      placeholder="+91 9709203002"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-label-sm font-label-sm text-primary">Service Type *</label>
                    <div className="relative" ref={serviceDropdownRef}>
                      <button 
                        type="button"
                        onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/55 hover:bg-white/80 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 text-left flex items-center justify-between group ${serviceDropdownOpen ? 'ring-4 ring-primary/10 border-primary/30' : ''}`}
                      >
                        <span className={selectedService ? 'text-primary font-medium' : 'text-on-surface-variant/40'}>
                          {getSelectedServiceLabel()}
                        </span>
                        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_drop_down</span>
                      </button>
                      <input type="hidden" name="subject" value={selectedService} />
                      
                      {serviceDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_40px_100px_rgba(10,33,86,0.1)] border border-primary/10 overflow-hidden">
                          <div className="p-2">
                            <div className="relative mb-2">
                              <input 
                                type="text" 
                                placeholder="Search services..." 
                                value={serviceSearch}
                                onChange={(e) => setServiceSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all duration-200"
                              />
                              <span className="material-symbols-outlined absolute left-3 top-2 w-4 h-4 text-on-surface-variant/40">search</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                              {filteredServiceOptions.map((option) => (
                                <button 
                                  key={option.value}
                                  type="button" 
                                  onClick={() => handleServiceChange(option.value)}
                                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all duration-150 flex items-center gap-3 group"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-primary text-sm">{option.label}</div>
                                    <div className="text-xs text-on-surface-variant/60">{option.description}</div>
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
                  <div className="space-y-6 p-6 bg-primary-fixed rounded-3xl border border-primary/10">
                    <h3 className="text-headline-md font-headline-md text-primary">Internship Details</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-label-sm font-label-sm text-primary">Preferred Track *</label>
                        <div className="relative" ref={trackDropdownRef}>
                          <button 
                            type="button"
                            onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
                            className={`w-full px-4 py-3 rounded-xl border border-primary/10 bg-white hover:bg-slate-50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 text-left flex items-center justify-between group ${trackDropdownOpen ? 'ring-4 ring-primary/10 border-primary/30' : ''}`}
                          >
                            <span className={selectedTrack ? 'text-primary font-medium' : 'text-on-surface-variant/40'}>
                              {getSelectedTrackLabel()}
                            </span>
                            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_drop_down</span>
                          </button>
                          <input type="hidden" name="internship-track" value={selectedTrack} />
                          
                          {trackDropdownOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_40px_100px_rgba(10,33,86,0.1)] border border-primary/10 overflow-hidden">
                              <div className="p-2">
                                <div className="relative mb-2">
                                  <input 
                                    type="text" 
                                    placeholder="Search tracks..." 
                                    value={trackSearch}
                                    onChange={(e) => setTrackSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-primary/10 rounded-lg focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all duration-200"
                                  />
                                  <span className="material-symbols-outlined absolute left-3 top-2 w-4 h-4 text-on-surface-variant/40">search</span>
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                  {filteredTrackOptions.map((option) => (
                                    <button 
                                      key={option.value}
                                      type="button" 
                                      onClick={() => handleTrackChange(option.value)}
                                      className="w-full px-3 py-2 text-left rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all duration-150 flex items-center gap-3 group"
                                    >
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                        </svg>
                                      </div>
                                      <div>
                                        <div className="font-semibold text-primary text-sm">{option.label}</div>
                                        <div className="text-xs text-on-surface-variant/60">{option.description}</div>
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
                        <label className="block text-label-sm font-label-sm text-primary">Preferred Duration</label>
                        <div className="relative" ref={durationDropdownRef}>
                          <button 
                            type="button"
                            onClick={() => setDurationDropdownOpen(!durationDropdownOpen)}
                            className={`w-full px-4 py-3 rounded-xl border border-primary/10 bg-white hover:bg-slate-50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 text-left flex items-center justify-between group ${durationDropdownOpen ? 'ring-4 ring-primary/10 border-primary/30' : ''}`}
                          >
                            <span className={selectedDuration ? 'text-primary font-medium' : 'text-on-surface-variant/40'}>
                              {getSelectedDurationLabel()}
                            </span>
                            <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_drop_down</span>
                          </button>
                          <input type="hidden" name="duration" value={selectedDuration} />
                          
                          {durationDropdownOpen && (
                            <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_40px_100px_rgba(10,33,86,0.1)] border border-primary/10 overflow-hidden">
                              <div className="p-2 space-y-1">
                                {durationOptions.map((option) => (
                                  <button 
                                    key={option.value}
                                    type="button" 
                                    onClick={() => {
                                      setSelectedDuration(option.value);
                                      setDurationDropdownOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all duration-150 flex items-center gap-3 group"
                                  >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-semibold text-primary text-sm">{option.label}</div>
                                      <div className="text-xs text-on-surface-variant/60">{option.description}</div>
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
                        <label htmlFor="custom-idea" className="block text-label-sm font-label-sm text-primary">Describe Your Project Idea *</label>
                        <textarea 
                          id="custom-idea" 
                          name="custom-idea" 
                          rows="4" 
                          className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 placeholder:text-on-surface-variant/40" 
                          placeholder="Tell us about your project idea, goals, and what you'd like to learn..."
                          required
                        ></textarea>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-label-sm font-label-sm text-primary">Experience Level</label>
                      <div className="relative" ref={experienceDropdownRef}>
                        <button 
                          type="button"
                          onClick={() => setExperienceDropdownOpen(!experienceDropdownOpen)}
                          className={`w-full px-4 py-3 rounded-xl border border-primary/10 bg-white hover:bg-slate-50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 text-left flex items-center justify-between group ${experienceDropdownOpen ? 'ring-4 ring-primary/10 border-primary/30' : ''}`}
                        >
                          <span className={selectedExperience ? 'text-primary font-medium' : 'text-on-surface-variant/40'}>
                            {getSelectedExperienceLabel()}
                          </span>
                          <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors">arrow_drop_down</span>
                        </button>
                        <input type="hidden" name="experience-level" value={selectedExperience} />
                        
                        {experienceDropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_40px_100px_rgba(10,33,86,0.1)] border border-primary/10 overflow-hidden">
                            <div className="p-2 space-y-1">
                              {experienceOptions.map((option) => (
                                <button 
                                  key={option.value}
                                  type="button" 
                                  onClick={() => {
                                    setSelectedExperience(option.value);
                                    setExperienceDropdownOpen(false);
                                  }}
                                  className="w-full px-3 py-2.5 text-left rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all duration-150 flex items-center gap-3 group"
                                >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${getColorClasses(option.color)}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-primary text-sm">{option.label}</div>
                                    <div className="text-xs text-on-surface-variant/60">{option.description}</div>
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
                  <label htmlFor="message" className="block text-label-sm font-label-sm text-primary">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/55 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-200 placeholder:text-on-surface-variant/40" 
                    placeholder="Tell us more about your requirements, goals, or any specific questions you have..."
                  ></textarea>
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-2">
                  <label className="block text-label-sm font-label-sm text-primary">Preferred Contact Method *</label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {contactMethodOptions.map((option) => (
                      <label key={option.value} className="relative cursor-pointer group">
                        <input 
                          type="radio" 
                          name="contact-method" 
                          value={option.value}
                          onChange={(e) => setPreferredContactMethod(e.target.value)}
                          className="sr-only peer"
                          required
                        />
                        <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          preferredContactMethod === option.value 
                            ? 'border-primary bg-primary-fixed shadow-md' 
                            : 'border-primary/10 bg-white/55 hover:border-primary/35 hover:bg-white'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                              preferredContactMethod === option.value 
                                ? getColorClasses(option.color) 
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                            }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}></path>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold text-sm transition-colors duration-200 ${
                                preferredContactMethod === option.value ? 'text-primary' : 'text-primary'
                              }`}>
                                {option.label}
                              </div>
                              <div className={`text-xs transition-colors duration-200 ${
                                preferredContactMethod === option.value ? 'text-on-primary-fixed-variant' : 'text-on-surface-variant/60'
                              }`}>
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Phone Call Scheduling Fields */}
                {preferredContactMethod === 'phone-call' && (
                  <div className="space-y-4 p-5 bg-primary-fixed rounded-2xl border border-primary/10">
                    <h4 className="text-label-md font-label-md text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined">phone_callback</span> Schedule Your Free Consultation Call
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="preferred-date" className="block text-xs font-semibold text-primary">Preferred Date</label>
                        <input 
                          id="preferred-date" 
                          name="preferred-date" 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all duration-200 text-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="preferred-time" className="block text-xs font-semibold text-primary">Preferred Time</label>
                        <select 
                          id="preferred-time" 
                          name="preferred-time"
                          className="w-full px-3 py-2 rounded-lg border border-primary/10 bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/5 transition-all duration-200 text-sm"
                        >
                          <option value="">Select time</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant/70">
                      💡 We'll confirm your call time via email and phone. Our team will call you for a free 15-minute consultation.
                    </p>
                  </div>
                )}

                {/* Consent */}
                <div className="flex items-start gap-3">
                  <input 
                    id="consent" 
                    name="consent" 
                    type="checkbox" 
                    required
                    className="mt-1 rounded border-primary/10 text-primary focus:ring-primary/20" 
                  />
                  <label htmlFor="consent" className="text-xs text-on-surface-variant/80">
                    I agree to be contacted regarding my inquiry and understand that my information will be handled according to your{' '}
                    <a href="#" className="text-primary underline">privacy policy</a>.
                  </label>
                </div>

                <div className="text-sm"></div>

                {/* Success/Error Messages */}
                {submitMessage && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600">check_circle</span>
                      <p className="text-green-800 font-medium">Success!</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">{submitMessage}</p>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600">error</span>
                      <p className="text-red-800 font-medium">Error!</p>
                    </div>
                    <p className="text-red-700 text-sm mt-1">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-primary-container hover:scale-[1.02] transform'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : preferredContactMethod === 'phone-call' ? (
                    <>
                      <span className="material-symbols-outlined text-lg mr-2">phone_callback</span>
                      Schedule Free Call
                    </>
                  ) : preferredContactMethod === 'whatsapp' ? (
                    <>
                      <span className="material-symbols-outlined text-lg mr-2">chat</span>
                      Start WhatsApp Chat
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg mr-2">send</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="reveal">
              <div className="glass-card rounded-[32px] p-8">
                <h3 className="text-xl font-bold text-primary mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed-variant rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Email</p>
                      <p className="text-on-surface-variant/80 text-sm">rakshitros1@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed-variant rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Phone</p>
                      <p className="text-on-surface-variant/80 text-sm">+91 9709203002</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed-variant rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary">Location</p>
                      <p className="text-on-surface-variant/80 text-sm">Andheri East, Mumbai, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal">
              <div className="glass-card rounded-[32px] overflow-hidden">
                <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-primary/5">
                  <h3 className="text-lg font-bold text-primary">Office Location</h3>
                  <button 
                    onClick={() => {
                      const iframe = document.getElementById('office-map');
                      if (iframe) {
                        iframe.src = iframe.src;
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-primary bg-primary-fixed rounded-lg hover:scale-105 transition-transform"
                    title="Reset map to office location"
                  >
                    <span className="material-symbols-outlined text-sm">my_location</span>
                    Recenter
                  </button>
                </div>
                <iframe 
                  id="office-map"
                  title="Location" 
                  src="https://maps.google.com/maps?q=Andheri+East,+Mumbai,+Maharashtra,+India&t=&z=15&ie=UTF8&iwloc=&output=embed" 
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
              <div className="bg-primary text-white rounded-[32px] p-8">
                <h3 className="text-headline-md font-headline-md mb-4">Why Choose PathForge Solutions?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-primary-container text-lg">verified</span>
                    <span className="text-sm font-medium">MSME Registered Company</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-primary-container text-lg">verified</span>
                    <span className="text-sm font-medium">500+ Students Mentored</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-primary-container text-lg">verified</span>
                    <span className="text-sm font-medium">95% Success Rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-primary-container text-lg">verified</span>
                    <span className="text-sm font-medium">Real Project Experience</span>
                  </div>
                </div>
                <p className="text-on-primary-container text-xs mt-6">
                  💡 Fill out the form to get started with your preferred contact method!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
