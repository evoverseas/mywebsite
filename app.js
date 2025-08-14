// EV Overseas - Study Abroad Consultancy Website JavaScript

// Application data
const appData = {
  company: {
    name: "EV Overseas",
    tagline: "Your Gateway to Global Education",
    location: "Hyderabad, India",
    established: "2018",
    studentsHelped: "500+",
    visaSuccessRate: "95%",
    phone: "+91-9666963756",
    email: "info@evoverseas.com",
    address: "302A Aaltos A&M Trade Center Himayat Nagar, Hyderabad - 500029",
    whatsapp: "+919666963756"
  },
  services: [
    {
      title: "University Selection",
      description: "Expert guidance to choose the right university based on your profile, budget, and career goals.",
      icon: "🎓"
    },
    {
      title: "Application Assistance",
      description: "Complete support for university applications, documentation, and SOP writing.",
      icon: "📝"
    },
    {
      title: "Visa Guidance",
      description: "End-to-end visa assistance with high success rate and expert consultation.",
      icon: "🛂"
    },
    {
      title: "Scholarship Assistance",
      description: "Help you find and apply for scholarships to reduce your education costs.",
      icon: "💰"
    },
    {
      title: "Test Preparation",
      description: "IELTS, TOEFL, GRE, GMAT coaching and preparation guidance.",
      icon: "📚"
    },
    {
      title: "Accommodation Support",
      description: "Assistance with finding suitable accommodation in your destination country.",
      icon: "🏠"
    }
  ],
  destinations: [
    {
      country: "United States",
      description: "World's leading destination for higher education with top-ranked universities.",
      universities: "Harvard, MIT, Stanford, and 500+ more",
      popularCourses: "Engineering, Business, Medicine, Computer Science",
      flag: "🇺🇸"
    },
    {
      country: "United Kingdom",
      description: "Home to prestigious institutions with rich academic heritage.",
      universities: "Oxford, Cambridge, Imperial College, LSE",
      popularCourses: "Business, Engineering, Law, Medicine",
      flag: "🇬🇧"
    },
    {
      country: "Australia",
      description: "Quality education with excellent post-study work opportunities.",
      universities: "University of Melbourne, ANU, University of Sydney",
      popularCourses: "Engineering, Healthcare, Business, IT",
      flag: "🇦🇺"
    },
    {
      country: "Canada",
      description: "Affordable quality education with pathway to permanent residency.",
      universities: "University of Toronto, UBC, McGill University",
      popularCourses: "Engineering, Computer Science, Business",
      flag: "🇨🇦"
    }
  ],
  testimonials: [
    {
      name: "Priya Sharma",
      course: "MS Computer Science",
      university: "Stanford University, USA",
      text: "EV Overseas made my dream come true. Their guidance throughout the application process was exceptional.",
      rating: 5,
      year: "2024"
    },
    {
      name: "Rohit Kumar",
      course: "MBA",
      university: "London Business School, UK",
      text: "Professional service and excellent visa guidance. Highly recommend EV Overseas for study abroad.",
      rating: 5,
      year: "2023"
    },
    {
      name: "Anjali Reddy",
      course: "Masters in Engineering",
      university: "University of Toronto, Canada",
      text: "They helped me secure a scholarship worth $15,000. Thank you EV Overseas team!",
      rating: 5,
      year: "2024"
    }
  ],
  blogArticles: [
    {
      title: "Top 10 Universities in USA for Indian Students 2024",
      excerpt: "Discover the best American universities that welcome Indian students with scholarships and excellent programs.",
      date: "January 15, 2024",
      category: "Universities"
    },
    {
      title: "Complete Guide to UK Student Visa Process",
      excerpt: "Step-by-step guide to obtaining your UK student visa with required documents and timeline.",
      date: "December 20, 2023",
      category: "Visa"
    },
    {
      title: "Scholarship Opportunities for Indian Students in Canada",
      excerpt: "Explore various scholarship programs available for Indian students planning to study in Canada.",
      date: "November 18, 2023",
      category: "Scholarships"
    }
  ]
};

// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  loadDynamicContent();
  initializeContactForm();
  initializeScrollEffects();
  trackPageLoad();
});

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu when clicking on nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Smooth scrolling for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll effects
function initializeScrollEffects() {
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Add shadow to navbar when scrolled
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
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
  
  appData.testimonials.forEach(testimonial => {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    
    const stars = '⭐'.repeat(testimonial.rating);
    
    testimonialCard.innerHTML = `
      <div class="testimonial-rating">${stars}</div>
      <div class="testimonial-text">"${testimonial.text}"</div>
      <div class="testimonial-author">
        <h4>${testimonial.name}</h4>
        <p>${testimonial.course}</p>
        <p>${testimonial.university} - ${testimonial.year}</p>
      </div>
    `;
    testimonialsGrid.appendChild(testimonialCard);
  });
}

// Load blog articles section
function loadBlogArticles() {
  const blogGrid = document.getElementById('blog-grid');
  
  appData.blogArticles.forEach(article => {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
      <div class="blog-content">
        <div class="blog-meta">
          <span class="blog-category">${article.category}</span>
          <span class="blog-date">${article.date}</span>
        </div>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
      </div>
    `;
    blogGrid.appendChild(blogCard);
  });
}

// Contact form functionality
function initializeContactForm() {
  // Replace this URL with your Google Apps Script Web App URL
  const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HEREhttps://script.google.com/macros/s/AKfycbyJ2CkX6RHgCEXmU0oVua1ubQrWOjOeuCxGdicslALSJ3VJ1tl_muJ03ByAsKxBmh110g/exec';
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      destination: formData.get('destination'),
      course: formData.get('course'),
      message: formData.get('message')
    };
    
    // Validate form
    if (!validateForm(data)) {
      return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading"></span> Submitting...';
    submitButton.disabled = true;
    
    // Send data to Google Sheets
    fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // Reset form
      contactForm.reset();
      
      // Restore button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      // Show success modal
      showSuccessModal();
      
      // Track lead generation
      trackLead(data);
      
      console.log('Form submitted successfully to Google Sheets');
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      
      // Restore button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      // Show error message
      alert('Sorry, there was an error submitting your form. Please try again or contact us directly.');
    });
  });
  
  // Close modal functionality
  closeModal.addEventListener('click', function() {
    hideSuccessModal();
  });
  
  // Close modal when clicking outside
  successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
      hideSuccessModal();
    }
  });
}    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading"></span> Submitting...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      // Reset form
      contactForm.reset();
      
      // Restore button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      
      // Show success modal
      showSuccessModal();
      
      // Track lead generation
      trackLead(data);
      
    }, 1500);
  });
  
  // Close modal functionality
  closeModal.addEventListener('click', function() {
    hideSuccessModal();
  });
  
  // Close modal when clicking outside
  successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
      hideSuccessModal();
    }
  });
}

// Form validation
function validateForm(data) {
  const errors = [];
  
  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Please enter a valid name');
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Phone validation
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!data.phone || !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Please enter a valid phone number');
  }
  
  // Display errors if any
  if (errors.length > 0) {
    showError(errors.join('\n'));
    return false;
  }
  
  return true;
}

// Show error message
function showError(message) {
  alert('Please fix the following errors:\n\n' + message);
}

// Modal functionality
function showSuccessModal() {
  successModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function hideSuccessModal() {
  successModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Analytics and tracking
function trackPageLoad() {
  // Track page load for analytics
  console.log('Page loaded: EV Overseas Study Abroad Consultancy');
  
  // SEO tracking
  trackSEOKeywords();
}

function trackLead(data) {
  // Track lead generation
  console.log('New lead generated:', data);
  
  // In a real application, you would send this data to your analytics service
  // Example: Google Analytics, Facebook Pixel, etc.
  
  // Track conversion for ads
  trackConversion(data);
}

function trackConversion(data) {
  // Track conversion events for marketing campaigns
  console.log('Conversion tracked for:', data.destination || 'General Inquiry');
}

function trackSEOKeywords() {
  // Track important SEO keywords for ranking
  const keywords = [
    'study abroad consultants Hyderabad',
    'overseas education Hyderabad',
    'international education consultancy',
    'study abroad services',
    'university admissions',
    'student visa assistance',
    'IELTS coaching Hyderabad',
    'study in USA UK Australia Canada'
  ];
  
  console.log('SEO Keywords tracked:', keywords);
}

// Utility functions
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Add scroll to top functionality
function addScrollToTop() {
  const scrollButton = document.createElement('button');
  scrollButton.innerHTML = '↑';
  scrollButton.className = 'scroll-to-top hidden';
  scrollButton.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollButton);
  
  scrollButton.addEventListener('click', scrollToTop);
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      scrollButton.classList.remove('hidden');
    } else {
      scrollButton.classList.add('hidden');
    }
  });
}

// Initialize scroll to top after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  addScrollToTop();
});

// WhatsApp functionality
function openWhatsApp(message = '') {
  const defaultMessage = `Hi! I'm interested in studying abroad. Please provide more information.`;
  const whatsappMessage = message || defaultMessage;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/${appData.company.whatsapp}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
}

// Add WhatsApp click tracking
document.addEventListener('DOMContentLoaded', function() {
  const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], .whatsapp-btn, .whatsapp-float');
  whatsappButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('WhatsApp contact initiated');
      trackLead({
        source: 'WhatsApp Button',
        timestamp: new Date().toISOString()
      });
    });
  });
});

// Phone call tracking
document.addEventListener('DOMContentLoaded', function() {
  const phoneLinks = document.querySelectorAll('a[href^="tel: +91966696375"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Phone call initiated');
      trackLead({
        source: 'Phone Call',
        timestamp: new Date().toISOString()
      });
    });
  });
});

// Email tracking
document.addEventListener('DOMContentLoaded', function() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('Email contact initiated');
      trackLead({
        source: 'Email',
        timestamp: new Date().toISOString()
      });
    });
  });
});

// Service card interaction tracking
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3').textContent;
        console.log('Service interest:', serviceName);
        trackLead({
          source: 'Service Card',
          service: serviceName,
          timestamp: new Date().toISOString()
        });
      });
    });
  }, 1000);
});

// Destination card interaction tracking
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const destinationCards = document.querySelectorAll('.destination-card');
    destinationCards.forEach(card => {
      card.addEventListener('click', function() {
        const countryName = this.querySelector('h3').textContent;
        console.log('Destination interest:', countryName);
        trackLead({
          source: 'Destination Card',
          destination: countryName,
          timestamp: new Date().toISOString()
        });
      });
    });
  }, 1000);
});

// Lazy loading for images
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', function() {
  initializeLazyLoading();
});

// Performance monitoring
function monitorPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', function() {
      setTimeout(() => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        // Track performance for optimization
        if (loadTime > 3000) {
          console.warn('Page load time is slow, consider optimization');
        }
      }, 0);
    });
  }
}

// Initialize performance monitoring
monitorPerformance();

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});

// Service worker registration for better performance (if available)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    // Service worker would be registered here in production
    console.log('Service worker support detected');
  });
}