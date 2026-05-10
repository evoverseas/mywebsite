// EV Overseas Website JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // ANNOUNCEMENT BANNER INITIALIZATION
    // ============================================
    initAnnounceBanner();

    // Animated Counter Implementation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const inc = target / speed;

        function updateCount() {
            if (count < target) {
                count += inc;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        }

        updateCount();
    }

    // Intersection Observer for counter animation
    const countersObserverOptions = {
        threshold: 0.5
    };

    const countersObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => animateCounter(counter));
                countersObserver.unobserve(entry.target);
            }
        });
    }, countersObserverOptions);

    // Observe stats section
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        countersObserver.observe(statsSection);
    }

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Navbar scroll effect
    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add background to navbar on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.boxShadow = 'var(--shadow-sm)';
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

    // Fix CTA buttons functionality — navigate to contact page
    const ctaButtons = document.querySelectorAll('.nav-cta');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'contact.html';
        });
    });

    // Fix hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
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
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate form before submission
            if (!validateForm()) {
                return;
            }

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Show brief loading state with spinner
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" style="animation:spin 0.8s linear infinite;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round"/></svg> Sending...</span>';
            submitBtn.disabled = true;

            // Show success immediately (optimistic UI) — don't make user wait for Apps Script
            setTimeout(() => {
                showMessage(data.name || 'there', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 600);

            // Send data in background (fire-and-forget)
            submitFormToGoogleSheets(data).catch(error => {
                console.error('Background submission error:', error);
            });
        });
    }

    // Animate elements on scroll
    const animationObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, animationObserverOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .journey-card, .about-content');
    elementsToAnimate.forEach(el => {
        animationObserver.observe(el);
    });

    // Add click handlers for journey cards (analytics / tracking placeholder)
    const journeyCards = document.querySelectorAll('.journey-card');
    journeyCards.forEach(card => {
        card.addEventListener('click', function () {
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Journey Step';
            console.log(`Journey card clicked: ${title}`);
        });
    });

    // Initialize scroll animations
    initScrollAnimations();

    // Improved focus management for accessibility (moved here from bottom of file)
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements.forEach(el => {
        el.addEventListener('focus', function () {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        el.addEventListener('blur', function () {
            this.style.outline = '';
        });
    });

    // University Search Functionality
    const universitySearchForm = document.getElementById('universitySearchForm');
    const searchResults = document.getElementById('searchResults');

    // Sample university data - In production, this would come from your backend
    const universities = [
        {
            name: "California State University",
            country: "USA",
            courses: ["masters", "bachelors"],
            fields: ["engineering", "it", "business"],
            budget: "20-25",
            logo: "./images/universities/csu-logo.png",
            location: "California, USA",
            ranking: "#120 in US News",
            tuitionFee: "₹22 Lakhs/year",
            acceptance: "75%"
        },
        {
            name: "University of Manchester",
            country: "UK",
            courses: ["masters", "phd"],
            fields: ["engineering", "business", "medicine"],
            budget: "25+",
            logo: "./images/universities/manchester-logo.png",
            location: "Manchester, UK",
            ranking: "#27 in QS World Rankings",
            tuitionFee: "₹26 Lakhs/year",
            acceptance: "65%"
        },
        // Add more universities as needed
    ];

    if (universitySearchForm) {
        universitySearchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const country = document.getElementById('country').value;
            const course = document.getElementById('course').value;
            const field = document.getElementById('field').value;
            const budget = document.getElementById('budget').value;

            // Filter universities based on criteria
            const filteredUniversities = universities.filter(uni => {
                return (!country || uni.country === country) &&
                    (!course || uni.courses.includes(course)) &&
                    (!field || uni.fields.includes(field)) &&
                    (!budget || uni.budget === budget);
            });

            // Display results
            displaySearchResults(filteredUniversities);
        });
    }

    function displaySearchResults(results) {
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>No universities found matching your criteria. Please try different filters or contact us for more options.</p>
                </div>
            `;
            return;
        }

        searchResults.innerHTML = results.map(uni => `
            <div class="university-card">
                <img src="${uni.logo}" alt="${uni.name} logo" class="university-logo" loading="lazy">
                <h3 class="university-name">${uni.name}</h3>
                <div class="university-location">
                    <i class="fas fa-map-marker-alt"></i> ${uni.location}
                </div>
                <div class="university-details">
                    <p><i class="fas fa-trophy"></i> ${uni.ranking}</p>
                    <p><i class="fas fa-money-bill-wave"></i> ${uni.tuitionFee}</p>
                    <p><i class="fas fa-check-circle"></i> ${uni.acceptance} Acceptance Rate</p>
                </div>
                <div class="university-cta">
                    <button class="btn btn--outline" onclick="window.location.href='contact.html'">Enquire Now</button>
                    <button class="btn btn--primary" onclick="window.location.href='contact.html'">Apply Now</button>
                </div>
            </div>
        `).join('');
    }

    // FAQ Section Interactivity (robust with ARIA + keyboard support)
    const faqContainer = document.querySelector('.faq-content');
    if (faqContainer) {
        // Initialize aria attributes
        faqContainer.querySelectorAll('.faq-question').forEach(btn => {
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-expanded', 'false');
            const answer = btn.nextElementSibling;
            if (answer && answer.classList.contains('faq-answer')) {
                const id = answer.id || ('faq-answer-' + Math.random().toString(36).substr(2, 9));
                answer.id = id;
                btn.setAttribute('aria-controls', id);
            }
            // Ensure focusable and clickable
            if (!btn.hasAttribute('tabindex')) btn.setAttribute('tabindex', '0');
        });

        // Use event delegation for clicks and keypresses
        faqContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-question');
            if (!btn) return;
            toggleFaq(btn);
        });

        faqContainer.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key !== 'Enter' && key !== ' ') return;
            const btn = e.target.closest('.faq-question');
            if (!btn) return;
            e.preventDefault();
            toggleFaq(btn);
        });
    }

    function toggleFaq(button) {
        const answer = button.nextElementSibling;
        if (!answer || !answer.classList.contains('faq-answer')) return;

        console.log('Toggling FAQ for:', button.textContent.trim());

        const parentCategory = button.closest('.faq-category');
        // Close other open answers in same category
        if (parentCategory) {
            parentCategory.querySelectorAll('.faq-question.active').forEach(openBtn => {
                if (openBtn !== button) {
                    openBtn.classList.remove('active');
                    openBtn.setAttribute('aria-expanded', 'false');
                    const otherAnswer = openBtn.nextElementSibling;
                    if (otherAnswer && otherAnswer.classList.contains('faq-answer')) {
                        otherAnswer.classList.remove('show');
                    }
                }
            });
        }

        const isOpen = button.classList.toggle('active');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
            answer.classList.add('show');
        } else {
            answer.classList.remove('show');
        }
    }

    // Fallback: attach direct listeners to each faq-question (in case delegation misses)
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFaq(btn);
        });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq(btn);
            }
        });
    });
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

function showMessage(nameOrMessage, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.form-message-overlay');
    existingMessages.forEach(msg => msg.remove());

    const contactForm = document.getElementById('contactForm');

    if (type === 'success') {
        // Premium success confirmation
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message-overlay';
        messageDiv.innerHTML = `
            <div class="form-message-card success">
                <div class="form-message-icon">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <circle cx="28" cy="28" r="28" fill="#059669" opacity="0.1"/>
                        <circle cx="28" cy="28" r="20" fill="#059669" opacity="0.2"/>
                        <path d="M20 28.5L25.5 34L36 22" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="checkmark-path"/>
                    </svg>
                </div>
                <h3 class="form-message-title">Thank You, ${nameOrMessage}! 🎉</h3>
                <p class="form-message-text">Your application has been submitted successfully. Our counselor will reach out to you within <strong>24 hours</strong>.</p>
                <div class="form-message-actions">
                    <a href="https://wa.me/919666963756?text=Hi%2C%20I%20just%20submitted%20a%20form%20on%20your%20website.%20My%20name%20is%20${encodeURIComponent(nameOrMessage)}." target="_blank" class="form-msg-btn whatsapp">
                        <i class="fab fa-whatsapp"></i> Chat on WhatsApp
                    </a>
                    <button class="form-msg-btn close" onclick="this.closest('.form-message-overlay').remove(); document.getElementById('contactForm').style.display=''">
                        Close
                    </button>
                </div>
            </div>
        `;

        contactForm.parentNode.insertBefore(messageDiv, contactForm);
        contactForm.style.display = 'none';

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Show form again after 15 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transition = 'opacity 0.4s ease';
                setTimeout(() => {
                    messageDiv.remove();
                    contactForm.style.display = '';
                }, 400);
            }
        }, 15000);

    } else {
        // Error message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-message-overlay';
        messageDiv.innerHTML = `
            <div class="form-message-card error">
                <div class="form-message-icon">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                        <circle cx="28" cy="28" r="28" fill="#DC2626" opacity="0.1"/>
                        <circle cx="28" cy="28" r="20" fill="#DC2626" opacity="0.2"/>
                        <path d="M22 22L34 34M34 22L22 34" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                </div>
                <h3 class="form-message-title">Oops! Something went wrong</h3>
                <p class="form-message-text">${nameOrMessage}</p>
                <div class="form-message-actions">
                    <a href="tel:+919666963756" class="form-msg-btn whatsapp" style="background:#0A2342;">
                        <i class="fas fa-phone-alt"></i> Call Us Directly
                    </a>
                    <button class="form-msg-btn close" onclick="this.closest('.form-message-overlay').remove(); document.getElementById('contactForm').style.display=''">
                        Try Again
                    </button>
                </div>
            </div>
        `;

        contactForm.parentNode.insertBefore(messageDiv, contactForm);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            if (messageDiv.parentNode) messageDiv.remove();
        }, 10000);
    }
}

// Google Sheets Integration Function
async function submitFormToGoogleSheets(data) {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDvs7F0II0wyRYKF8TTCDv3wSJzlI9kzPfrEmn2pvLtEXwNCDlVzrBDUygUPxGuP8d7w/exec';

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(data),
            redirect: 'follow'
        });

        // Apps Script may return opaque response via redirect
        // If we can parse JSON, great — otherwise treat as success if no error thrown
        try {
            const result = await response.json();
            if (result.result === 'error') {
                throw new Error(result.message || 'Form submission failed');
            }
            return result;
        } catch (parseError) {
            // Response wasn't JSON (common with Apps Script redirects) — treat as success
            console.log('Form submitted (non-JSON response):', response.status);
            return { result: 'success' };
        }
    } catch (error) {
        console.error('Submission error:', error);
        throw error;
    }
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
    const animatedElements = document.querySelectorAll('.service-card, .destination-card, .testimonial-card, .journey-card');

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
document.addEventListener('keydown', function (e) {
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
window.scrollToSection = function (sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
};

// Enhanced Analytics Tracking (REPLACE existing trackEvent function)
function trackEvent(eventName, eventData = {}) {
    console.log(`Analytics Event: ${eventName}`, eventData);

    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: eventData.page_section || 'general',
            event_label: eventData.button_text || eventData.service_name || eventData.destination || '',
            value: eventData.value || 1
        });
    }
}

// Add form submission tracking (ADD this to your form submit handler)
var contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
    contactFormEl.addEventListener('submit', function () {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'engagement',
                event_label: 'contact_form',
                value: 1
            });
        }
    });
}


function getPageSection(element) {
    const section = element.closest('section');
    return section ? section.id || section.className : 'unknown';
}

// ...existing code...

// ============================================
// ANNOUNCEMENT BANNER FUNCTIONS
// ============================================
function initAnnounceBanner() {
    const banner = document.getElementById('announceBanner');
    if (!banner) return;

    // Check if banner is enabled via data attribute
    const isEnabled = banner.getAttribute('data-enabled') === 'true';

    // Check if user has closed the banner in this session
    const isClosed = sessionStorage.getItem('bannerClosed') === 'true';

    if (isEnabled && !isClosed) {
        banner.classList.remove('hidden');
        document.body.classList.add('banner-visible');
        // Set CSS variable for banner height
        updateBannerHeight();
        window.addEventListener('resize', updateBannerHeight);
    } else {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        document.body.style.setProperty('--banner-height', '0px');
    }
}

function updateBannerHeight() {
    const banner = document.getElementById('announceBanner') || document.getElementById('rebrandBanner');
    if (banner && !banner.classList.contains('hidden')) {
        const height = banner.offsetHeight;
        document.body.style.setProperty('--banner-height', height + 'px');
    }
}

// Close banner function (called from HTML onclick)
window.closeBanner = function () {
    const banner = document.getElementById('announceBanner');
    if (banner) {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        document.body.style.setProperty('--banner-height', '0px');
        // Remember that user closed the banner for this session
        sessionStorage.setItem('bannerClosed', 'true');
    }
};

// ============================================
// CLOSE ANNOUNCE BANNER (for onclick handler)
// ============================================
window.closeAnnounceBanner = function () {
    const banner = document.getElementById('announceBanner');
    if (banner) {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        document.body.style.setProperty('--banner-height', '0px');
        // Remember that user closed the banner for this session
        sessionStorage.setItem('bannerClosed', 'true');
    }
};

// Initialize announce banner on page load (auto-enable for this banner)
document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('announceBanner');
    if (banner) {
        // Check if user has closed the banner in this session
        const isClosed = sessionStorage.getItem('bannerClosed') === 'true';

        if (!isClosed) {
            banner.classList.remove('hidden');
            document.body.classList.add('banner-visible');
            // Set CSS variable for banner height
            const height = banner.offsetHeight;
            document.body.style.setProperty('--banner-height', height + 'px');
            window.addEventListener('resize', () => {
                if (!banner.classList.contains('hidden')) {
                    document.body.style.setProperty('--banner-height', banner.offsetHeight + 'px');
                }
            });
        } else {
            banner.classList.add('hidden');
            document.body.classList.remove('banner-visible');
            document.body.style.setProperty('--banner-height', '0px');
        }
    }
});
