// EV Overseas Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;

        // Add background to navbar on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(252, 252, 249, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'var(--color-surface)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // Fix smooth scrolling for all navigation links
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Handle all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });

    // Fix CTA buttons functionality
    const ctaButtons = document.querySelectorAll('.nav-cta');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('contact');
        });
    });

    // Fix hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const btnText = this.textContent.toLowerCase();
            if (btnText.includes('counseling') || btnText.includes('consultation')) {
                smoothScrollTo('contact');
            } else if (btnText.includes('services')) {
                smoothScrollTo('services');
            }
        });
    });

    // Contact Form Handling with improved validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before submission
            if (!validateForm()) {
                return;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Submit form to Google Sheets
            submitFormToGoogleSheets(data)
                .then(response => {
                    showMessage('Thank you! Your application has been submitted successfully. We will contact you soon.', 'success');
                    contactForm.reset();
                })
                .catch(error => {
                    showMessage('Sorry, there was an error submitting your form. Please try again or contact us directly at +91-9666963756.', 'error');
                    console.error('Form submission error:', error);
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .blog-card, .about-content');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    // Add click handlers for blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = card.querySelector('h3').textContent;
            console.log(`Blog card clicked: ${title}`);
        });
    });

    // Initialize scroll animations
    initScrollAnimations();
});

// Improved form validation
function validateForm() {
    const form = document.getElementById('contactForm');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const destination = form.querySelector('#destination').value;
    const course = form.querySelector('#course').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    if (!name) {
        showFieldError(form.querySelector('#name'), 'Name is required');
        isValid = false;
    }
    
    if (!email) {
        showFieldError(form.querySelector('#email'), 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError(form.querySelector('#email'), 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone) {
        showFieldError(form.querySelector('#phone'), 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showFieldError(form.querySelector('#phone'), 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!destination) {
        showFieldError(form.querySelector('#destination'), 'Please select a destination');
        isValid = false;
    }
    
    if (!course) {
        showFieldError(form.querySelector('#course'), 'Course interest is required');
        isValid = false;
    }
    
    return isValid;
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.style.borderColor = 'var(--color-border)';
    });
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
    messageDiv.textContent = message;
    
    // Insert before the form
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 10000);
}

// Google Sheets Integration Function
async function submitFormToGoogleSheets(data) {
    /*
    DETAILED STEPS TO CONNECT FORM TO GOOGLE SHEETS:
    
    1. CREATE GOOGLE SHEET:
       - Go to https://sheets.google.com
       - Click "+" to create new sheet
       - Name it "EV Overseas - Contact Forms"
       - In row 1, add these headers: Name | Email | Phone | Destination | Course | Message | Timestamp
    
    2. SET UP GOOGLE APPS SCRIPT:
       - In your sheet, click Extensions > Apps Script
       - Delete default code and paste this:
       
       function doPost(e) {
         try {
           var sheet = SpreadsheetApp.getActiveSheet();
           var data = JSON.parse(e.postData.contents);
           
           sheet.appendRow([
             data.name || '',
             data.email || '',
             data.phone || '',
             data.destination || '',
             data.course || '',
             data.message || '',
             new Date()
           ]);
           
           return ContentService
             .createTextOutput(JSON.stringify({result: 'success', message: 'Data saved successfully'}))
             .setMimeType(ContentService.MimeType.JSON);
         } catch (error) {
           return ContentService
             .createTextOutput(JSON.stringify({result: 'error', message: error.toString()}))
             .setMimeType(ContentService.MimeType.JSON);
         }
       }
    
    3. DEPLOY THE SCRIPT:
       - Click "Deploy" > "New deployment" 
       - Type: Web app
       - Execute as: Me
       - Who has access: Anyone
       - Click "Deploy"
       - Copy the Web App URL
    
    4. UPDATE THIS CODE:
       - Replace the URL below with your actual deployment URL
       - Test the form
    
    5. OPTIONAL - ADD EMAIL NOTIFICATIONS:
       Add this to your Apps Script after the sheet.appendRow line:
       
       // Send email notification
       GmailApp.sendEmail(
         'info@evoverseas.com',
         'New Contact Form Submission - EV Overseas',
         `New inquiry received:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nDestination: ${data.destination}\nCourse: ${data.course}\nMessage: ${data.message}`
       );
    */
    
    // Replace this with your actual Google Apps Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRtK3z-qp2sRCztkPbkG8ixpITP7tom6Ffq6ct8K7jZ0hQ5o8g03BJeJSzMb7y_W8NMw/exec';
    
    // For demo purposes, simulate successful submission
    // In production, uncomment the fetch request and use your actual URL
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Form data that would be submitted:', data);
            resolve({ result: 'success' });
            
            // Uncomment this for actual Google Sheets integration:
            
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.result === 'success') {
                    resolve(result);
                } else {
                    reject(new Error(result.message || 'Form submission failed'));
                }
            })
            .catch(error => {
                console.error('Submission error:', error);
                reject(error);
            });
            
        }, 1000);
    });
}

// Improved email validation (less strict)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (accepts various formats)
function validatePhone(phone) {
    const cleaned = phone.replace(/\s|-|\(|\)/g, '');
    const phoneRegex = /^[\+]?[0-9]{10,15}$/;
    return phoneRegex.test(cleaned);
}

function showFieldError(field, message) {
    field.style.borderColor = 'var(--color-error)';
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = 'var(--color-error)';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--space-4)';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Add scroll-based animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .blog-card');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Utility function for scrolling
window.scrollToSection = function(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Track user interactions
function trackEvent(eventName, eventData = {}) {
    console.log(`Analytics Event: ${eventName}`, eventData);
    // Add your analytics tracking here (Google Analytics, etc.)
}

// Add click tracking
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn--primary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent.trim(),
            page_section: getPageSection(e.target)
        });
    }
    
    if (e.target.closest('.service-card')) {
        const serviceTitle = e.target.closest('.service-card').querySelector('h3').textContent;
        trackEvent('service_click', { service_name: serviceTitle });
    }
    
    if (e.target.closest('.destination-card')) {
        const destinationTitle = e.target.closest('.destination-card').querySelector('h3').textContent;
        trackEvent('destination_click', { destination: destinationTitle });
    }
});

function getPageSection(element) {
    const section = element.closest('section');
    return section ? section.id || section.className : 'unknown';
}

// Improved focus management for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
});