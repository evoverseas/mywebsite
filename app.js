// EV Overseas - Study Abroad Consultancy Website JavaScript
// Updated with new contact details and enhanced functionality

// Application data with updated information
const appData = {
  company: {
    name: "EV Overseas",
    tagline: "Your Gateway to Global Education",
    location: "Himayatnagar, Hyderabad",
    established: "2018",
    studentsHelped: "500+",
    visaSuccessRate: "99%",
    phone: "+91-9666963756",
    email: "info@evoverseas.com",
    address: "302-A, 3rd Floor, Aaltos A&M trade center, Himayatnagar, Hyderabad - 500029",
    whatsapp: "+919666963756"
  },
  services: [
    {
      title: "University Selection",
      description: "Expert guidance to choose the right university based on your profile, budget, and career goals. We help you select from 200+ partner universities worldwide.",
      icon: "🎓"
    },
    {
      title: "Application Assistance",
      description: "Complete support for university applications, documentation, and SOP writing. Our experts ensure your application stands out.",
      icon: "📝"
    },
    {
      title: "Visa Guidance",
      description: "End-to-end visa assistance with 99% success rate and expert consultation. We handle all documentation and interview preparation.",
      icon: "🛂"
    },
    {
      title: "Scholarship Assistance",
      description: "Help you find and apply for scholarships to reduce your education costs. We've secured over $2M+ in scholarships for students.",
      icon: "💰"
    },
    {
      title: "Test Preparation",
      description: "IELTS, TOEFL, GRE, GMAT coaching and preparation guidance. Expert trainers with proven track record of success.",
      icon: "📚"
    },
    {
      title: "Accommodation Support",
      description: "Assistance with finding suitable accommodation in your destination country. We help with housing, hostels, and homestays.",
      icon: "🏠"
    }
  ],
  destinations: [
    {
      country: "United States",
      description: "World's leading destination for higher education with top-ranked universities and diverse opportunities.",
      universities: "Harvard, MIT, Stanford, and 500+ more universities",
      popularCourses: "Engineering, Business, Medicine, Computer Science",
      flag: "🇺🇸"
    },
    {
      country: "United Kingdom",
      description: "Home to prestigious institutions with rich academic heritage and shorter program durations.",
      universities: "Oxford, Cambridge, Imperial College, LSE, UCL",
      popularCourses: "Business, Engineering, Law, Medicine",
      flag: "🇬🇧"
    },
    {
      country: "Australia",
      description: "Quality education with excellent post-study work opportunities and pathway to permanent residency.",
      universities: "University of Melbourne, ANU, University of Sydney",
      popularCourses: "Engineering, Healthcare, Business, IT",
      flag: "🇦🇺"
    },
    {
      country: "Canada",
      description: "Affordable quality education with pathway to permanent residency and multicultural environment.",
      universities: "University of Toronto, UBC, McGill University",
      popularCourses: "Engineering, Computer Science, Business",
      flag: "🇨🇦"
    },
    {
      country: "Germany",
      description: "World-class education with low tuition fees and strong job market for international students.",
      universities: "TU Munich, Heidelberg University, RWTH Aachen",
      popularCourses: "Engineering, Medicine, Business, Technology",
      flag: "🇩🇪"
    },
    {
      country: "New Zealand",
      description: "High-quality education system with stunning natural beauty and friendly environment for students.",
      universities: "University of Auckland, University of Otago",
      popularCourses: "Agriculture, Engineering, Tourism, IT",
      flag: "🇳🇿"
    }
  ],
  testimonials: [
    {
      name: "Priya Sharma",
      course: "MS Computer Science",
      university: "Stanford University, USA",
      text: "EV Overseas made my dream come true. Their guidance throughout the application process was exceptional. The team helped me secure admission with a scholarship!",
      rating: 5,
      year: "2024"
    },
    {
      name: "Rohit Kumar",
      course: "MBA",
      university: "London Business School, UK",
      text: "Professional service and excellent visa guidance. Highly recommend EV Overseas for study abroad. They supported me from application to visa approval.",
      rating: 5,
      year: "2023"
    },
    {
      name: "Anjali Reddy",
      course: "Masters in Engineering",
      university: "University of Toronto, Canada",
      text: "They helped me secure a scholarship worth $15,000. Thank you EV Overseas team! The counselors were very patient and helpful throughout.",
      rating: 5,
      year: "2024"
    },
    {
      name: "Vikram Patel",
      course: "MS Data Science",
      university: "University of Melbourne, Australia",
      text: "Best decision to choose EV Overseas. Their expert guidance helped me get into my dream university with proper visa assistance.",
      rating: 5,
      year: "2024"
    }
  ],
  blogArticles: [
    {
      title: "Top 10 Universities in USA for Indian Students 2024",
      excerpt: "Discover the best American universities that welcome Indian students with scholarships and excellent programs. Complete guide with admission requirements.",
      date: "December 15, 2024",
      category: "Universities"
    },
    {
      title: "Complete Guide to UK Student Visa Process 2024",
      excerpt: "Step-by-step guide to obtaining your UK student visa with required documents, timeline, and expert tips for success.",
      date: "December 10, 2024",
      category: "Visa"
    },
    {
      title: "Scholarship Opportunities for Indian Students in Canada",
      excerpt: "Explore various scholarship programs available for Indian students planning to study in Canada. Learn about eligibility and application process.",
      date: "December 5, 2024",
      category: "Scholarships"
    }
  ]
};

// Global variables
let submitted = false;

// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('inquiry-form');
const successModal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  loadDynamicContent();
  initializeContactForm();
  initializeScrollEffects();
  initializeWhatsApp();
  trackPageLoad();
});

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // Close mobile menu when clicking on nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu?.classList.remove('active');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Smooth scrolling for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const navbarHeight = navbar?.offsetHeight || 70;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
      navMenu?.classList.remove('active');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Scroll effects
function initializeScrollEffects() {
  let ticking = false;
  
  function updateScrollEffects() {
    const scrollY = window.scrollY;
    
    // Add shadow to navbar when scrolled
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
}

// Load dynamic content
function loadDynamicContent() {
  loadServices();
  loadDestinations();
  loadTestimonials();
  loadBlogArticles();
}

// Load services section
function loadServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;
  
  servicesGrid.innerHTML = '';
  
  appData.services.forEach(service => {
    const serviceCard = document.createElement('div');
    serviceCard.className = 'service-card';
    serviceCard.innerHTML = `
      <div class="service-icon">${service.icon}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    `;
    servicesGrid.appendChild(serviceCard);
  });
}

// Load destinations section
function loadDestinations() {
  const destinationsGrid = document.getElementById('destinations-grid');
  if (!destinationsGrid) return;
  
  destinationsGrid.innerHTML = '';
  
  appData.destinations.forEach(destination => {
    const destinationCard = document.createElement('div');
    destinationCard.className = 'destination-card';
    destinationCard.innerHTML = `
      <div class="destination-flag">${destination.flag}</div>
      <div class="destination-content">
        <h3>${destination.country}</h3>
        <p>${destination.description}</p>
        <div class="destination-info">
          <strong>Top Universities:</strong> ${destination.universities}<br>
          <strong>Popular Courses:</strong> ${destination.popularCourses}
        </div>
      </div>
    `;
    destinationsGrid.appendChild(destinationCard);
  });
}

// Load testimonials section
function loadTestimonials() {
  const testimonialsGrid = document.getElementById('testimonials-grid');
  if (!testimonialsGrid) return;
  
  testimonialsGrid.innerHTML = '';
  
  appData.testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    
    // Generate star rating
    const stars = '⭐'.repeat(testimonial.rating);
    
    testimonialCard.innerHTML = `
      <div class="testimonial-rating">${stars}</div>
      <p class="testimonial-text">"${testimonial.text}"</p>
      <div class="testimonial-author">
        <h4>${testimonial.name}</h4>
        <p>${testimonial.course}<br>${testimonial.university}</p>
        <span class="testimonial-year">Class of ${testimonial.year}</span>
      </div>
    `;
    testimonialsGrid.appendChild(testimonialCard);
  });
}

// Load blog articles section
function loadBlogArticles() {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;
  
  blogGrid.innerHTML = '';
  
  appData.blogArticles.forEach(article => {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
      <div class="blog-content">
        <div class="blog-meta">
          <span class="blog-date">${article.date}</span>
          <span class="blog-category">${article.category}</span>
        </div>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
      </div>
    `;
    blogGrid.appendChild(blogCard);
  });
}

// Initialize contact form
function initializeContactForm() {
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      // Let the form submit to Google Sheets
      // The success modal will be triggered by the iframe onload event
      
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const loadingText = submitBtn.querySelector('.loading');
      
      if (btnText && loadingText) {
        btnText.classList.add('hidden');
        loadingText.classList.remove('hidden');
        submitBtn.disabled = true;
      }
      
      // Reset loading state after a delay
      setTimeout(() => {
        if (btnText && loadingText) {
          btnText.classList.remove('hidden');
          loadingText.classList.add('hidden');
          submitBtn.disabled = false;
        }
      }, 3000);
    });
  }

  // Close modal functionality
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      successModal?.classList.add('hidden');
      contactForm?.reset();
    });
  }

  // Close modal when clicking outside
  if (successModal) {
    successModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.add('hidden');
        contactForm?.reset();
      }
    });
  }
}

// Initialize WhatsApp functionality
function initializeWhatsApp() {
  // Update all WhatsApp links with the correct number
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], .whatsapp-btn, .whatsapp-float a');
  const whatsappNumber = appData.company.whatsapp;
  const message = encodeURIComponent("Hi! I'm interested in study abroad guidance from EV Overseas. Please help me.");
  
  whatsappLinks.forEach(link => {
    link.href = `https://wa.me/91${whatsappNumber}?text=${message}`;
  });
}

// Form validation
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    const errorDiv = form.querySelector(`#${field.id}-error`);
    
    if (!field.value.trim()) {
      field.classList.add('error');
      errorDiv?.classList.add('show');
      isValid = false;
    } else {
      field.classList.remove('error');
      errorDiv?.classList.remove('show');
      
      // Additional email validation
      if (field.type === 'email' && !isValidEmail(field.value)) {
        field.classList.add('error');
        errorDiv?.classList.add('show');
        if (errorDiv) errorDiv.textContent = 'Please enter a valid email address';
        isValid = false;
      }
      
      // Additional phone validation
      if (field.type === 'tel' && !isValidPhone(field.value)) {
        field.classList.add('error');
        errorDiv?.classList.add('show');
        if (errorDiv) errorDiv.textContent = 'Please enter a valid phone number';
        isValid = false;
      }
    }
  });
  
  return isValid;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Track page load for analytics
function trackPageLoad() {
  // Add any analytics tracking code here
  console.log('EV Overseas website loaded successfully');
  
  // Add structured data for better SEO
  if (!document.querySelector('script[type="application/ld+json"]')) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": appData.company.name,
      "description": "Leading study abroad consultancy in Hyderabad",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "302-A, 3rd Floor, Aaltos A&M trade center",
        "addressLocality": "Himayatnagar",
        "addressRegion": "Telangana",
        "postalCode": "500029",
        "addressCountry": "IN"
      },
      "telephone": appData.company.phone,
      "email": appData.company.email,
      "url": "https://evoverseas.com",
      "openingHours": "Mo-Sa 10:00-18:00"
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

// Intersection Observer for animations (optional enhancement)
function initializeAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .blog-card');
  animatedElements.forEach(el => observer.observe(el));
}

// Initialize animations when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
  initializeAnimations();
}

// Export for potential use in other scripts
window.EVOverseas = {
  appData,
  validateForm,
  isValidEmail,
  isValidPhone
};
