async function loadInto(selector, url) {
  const host = document.querySelector(selector);
  if (!host) return null;
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    const html = await res.text();
    host.innerHTML = html;
    return host;
  } catch (e) {
    console.error('Failed to load component', url, e);
    return null;
  }
}

async function injectLayout() {
  // Header (topbar + navbar host)
  await loadInto('#site-header', 'components/header.html');
  // Navbar inside header
  await loadInto('#navbar-host', 'components/navbar.html');
  // Footer
  await loadInto('#site-footer', 'components/footer.html');
  // Footer year
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initNav() {
  const menuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('hidden');
    });
  }

  const nav = document.getElementById('site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 8) {
      nav.classList.add('shadow-md');
    } else {
      nav.classList.remove('shadow-md');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

function initScrollReveal() {
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
}

function highlightActiveNav() {
  const links = document.querySelectorAll('.nav-link');
  if (!links.length) return;
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  links.forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === path) {
      link.classList.add('text-indigo-600');
      link.classList.remove('text-slate-700');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  
  // Initialize professional dropdowns
  initProfessionalDropdowns();
  
  // Dynamic form fields for internship
  const subjectSelect = document.getElementById('subject');
  const internshipFields = document.getElementById('internship-fields');
  const internshipTrackSelect = document.getElementById('internship-track');
  const customIdeaField = document.getElementById('custom-idea-field');
  
  if (subjectSelect && internshipFields) {
    subjectSelect.addEventListener('change', (e) => {
      if (e.target.value === 'internship') {
        internshipFields.classList.remove('hidden');
      } else {
        internshipFields.classList.add('hidden');
      }
    });
  }
  
  if (internshipTrackSelect && customIdeaField) {
    internshipTrackSelect.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        customIdeaField.classList.remove('hidden');
      } else {
        customIdeaField.classList.add('hidden');
      }
    });
  }
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    const subject = data.get('subject');
    
    if (!name || !email || !message || !subject) {
      if (status) {
        status.textContent = 'Please fill in all required fields.';
        status.className = 'text-sm text-red-600 font-medium';
      }
      return;
    }
    
    // Validate internship fields if internship is selected
    if (subject === 'internship') {
      const track = data.get('internship-track');
      if (!track) {
        if (status) {
          status.textContent = 'Please select an internship track.';
          status.className = 'text-sm text-red-600 font-medium';
        }
        return;
      }
      
      if (track === 'custom') {
        const customIdea = data.get('custom-idea');
        if (!customIdea || customIdea.trim().length < 10) {
          if (status) {
            status.textContent = 'Please describe your project idea (at least 10 characters).';
            status.className = 'text-sm text-red-600 font-medium';
          }
          return;
        }
      }
    }
    
    // Simulate success
    if (status) {
      status.textContent = 'Thanks! Your message has been received. We will get back to you shortly.';
      status.className = 'text-sm text-green-600 font-medium';
    }
    form.reset();
    
    // Hide internship fields after successful submission
    if (internshipFields) {
      internshipFields.classList.add('hidden');
    }
    if (customIdeaField) {
      customIdeaField.classList.add('hidden');
    }
    
    // Reset dropdown displays
    resetDropdownDisplays();
  });
}

function initProfessionalDropdowns() {
  // Service Type Dropdown
  initDropdown('subject-trigger', 'subject-dropdown', 'subject-display', 'subject', [
    { value: 'project-assistance', label: 'Final Year Project Assistance', description: 'Guidance, mentoring & project building' },
    { value: 'internship', label: 'Internship Program', description: 'Training with live projects' },
    { value: 'career-guidance', label: 'Career Guidance', description: 'Resume review & interview prep' },
    { value: 'job-consultancy', label: 'Job Consultancy', description: 'Application help & job scheduling' },
    { value: 'other', label: 'Other', description: 'Custom requirements' }
  ]);
  
  // Internship Track Dropdown
  initDropdown('track-trigger', 'track-dropdown', 'track-display', 'internship-track', [
    { value: 'data-genai', label: 'Data & Gen-AI', description: 'Python, Vector DB, LLMs' },
    { value: 'fullstack', label: 'Full-Stack Web Development', description: 'End-to-end web solutions' },
    { value: 'frontend', label: 'Frontend Development', description: 'HTML, CSS, JavaScript, React' },
    { value: 'backend', label: 'Backend Development', description: 'Node.js, Express, MongoDB, Spring Boot' },
    { value: 'uiux', label: 'UI/UX Design', description: 'Figma, Canva, User Experience' },
    { value: 'technical-writing', label: 'Technical Writing', description: 'Documentation & content creation' },
    { value: 'custom', label: 'Custom/Ideas', description: 'Your own project concept' }
  ]);
  
  // Duration Dropdown
  initDropdown('duration-trigger', 'duration-dropdown', 'duration-display', 'duration', [
    { value: '1-month', label: '1 Month', description: 'Quick intensive program' },
    { value: '2-months', label: '2 Months', description: 'Balanced learning pace' },
    { value: '3-months', label: '3 Months', description: 'Comprehensive program' },
    { value: '6-months', label: '6 Months', description: 'Deep dive specialization' }
  ]);
  
  // Experience Level Dropdown
  initDropdown('experience-trigger', 'experience-dropdown', 'experience-display', 'experience-level', [
    { value: 'beginner', label: 'Beginner (0-1 year)', description: 'New to programming' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)', description: 'Some programming experience' },
    { value: 'advanced', label: 'Advanced (3+ years)', description: 'Experienced developer' }
  ]);
}

function initDropdown(triggerId, dropdownId, displayId, hiddenInputId, options) {
  const trigger = document.getElementById(triggerId);
  const dropdown = document.getElementById(dropdownId);
  const display = document.getElementById(displayId);
  const hiddenInput = document.getElementById(hiddenInputId);
  
  if (!trigger || !dropdown || !display || !hiddenInput) return;
  
  let isOpen = false;
  
  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
      closeDropdown();
    }
  });
  
  // Close dropdown on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeDropdown();
    }
  });
  
  // Handle option selection
  dropdown.addEventListener('click', (e) => {
    const option = e.target.closest('[data-value]');
    if (option) {
      const value = option.dataset.value;
      const label = option.querySelector('.font-medium')?.textContent || '';
      
      hiddenInput.value = value;
      display.textContent = label;
      display.className = 'text-slate-900';
      
      closeDropdown();
      
      // Trigger change event for form validation
      const changeEvent = new Event('change', { bubbles: true });
      hiddenInput.dispatchEvent(changeEvent);
    }
  });
  
  // Search functionality
  const searchInput = dropdown.querySelector('input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const optionButtons = dropdown.querySelectorAll('[data-value]');
      
      optionButtons.forEach(button => {
        const label = button.querySelector('.font-medium')?.textContent.toLowerCase() || '';
        const description = button.querySelector('.text-xs')?.textContent.toLowerCase() || '';
        
        if (label.includes(searchTerm) || description.includes(searchTerm)) {
          button.style.display = 'flex';
        } else {
          button.style.display = 'none';
        }
      });
    });
  }
  
  function toggleDropdown() {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }
  
  function openDropdown() {
    isOpen = true;
    dropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
    dropdown.classList.add('opacity-100', 'visible', 'scale-100');
    trigger.classList.add('ring-4', 'ring-blue-500/20', 'border-blue-500');
    
    // Focus search input if exists
    const searchInput = dropdown.querySelector('input[type="text"]');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }
  
  function closeDropdown() {
    isOpen = false;
    dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
    trigger.classList.remove('ring-4', 'ring-blue-500/20', 'border-blue-500');
    
    // Clear search if exists
    const searchInput = dropdown.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.value = '';
      // Reset all options visibility
      const optionButtons = dropdown.querySelectorAll('[data-value]');
      optionButtons.forEach(button => button.style.display = 'flex');
    }
  }
}

function resetDropdownDisplays() {
  const displays = ['subject-display', 'track-display', 'duration-display', 'experience-display'];
  displays.forEach(id => {
    const display = document.getElementById(id);
    if (display) {
      display.textContent = display.dataset.placeholder || 'Select...';
      display.className = 'text-slate-400';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await injectLayout();
  initNav();
  initSmoothScroll();
  initScrollReveal();
  highlightActiveNav();
  initFormHandler();
});

