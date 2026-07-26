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
    if (navbar) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

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

    // ============================================
    // STUDENT ABROAD HUB INTERACTIVE ENGINES
    // ============================================

    // Helper to open drawer with context (Redirects directly to contact.html)
    window.openDrawerWithContext = function (source, context = {}) {
        window.location.href = 'contact.html';
    };

    // 1. Data Repositories
    const hubUniversities = {
        USA: [
            { name: "Northeastern University", location: "Boston, MA", tuitionFee: "₹26 Lakhs/year", ranking: "#53 National", acceptanceRate: "20%", minGpa: 7.5, minIelts: 6.5 },
            { name: "University of Texas, Arlington", location: "Arlington, TX", tuitionFee: "₹18 Lakhs/year", ranking: "#110 Public", acceptanceRate: "80%", minGpa: 6.5, minIelts: 6.0 },
            { name: "California State University", location: "East Bay, CA", tuitionFee: "₹16 Lakhs/year", ranking: "#25 Regional West", acceptanceRate: "75%", minGpa: 6.0, minIelts: 6.0 },
            { name: "Southeast Missouri State Univ.", location: "Cape Girardeau, MO", tuitionFee: "₹12 Lakhs/year", ranking: "#70 Regional Midwest", acceptanceRate: "86%", minGpa: 5.5, minIelts: 5.5 }
        ],
        UK: [
            { name: "Teesside University", location: "Middlesbrough, UK", tuitionFee: "₹14 Lakhs/year", ranking: "#80 UK Guardian", acceptanceRate: "82%", minGpa: 5.5, minIelts: 5.5 },
            { name: "University of Chester", location: "Chester, UK", tuitionFee: "₹15 Lakhs/year", ranking: "#74 UK Guardian", acceptanceRate: "78%", minGpa: 6.0, minIelts: 6.0 },
            { name: "University of Cumbria", location: "Carlisle, UK", tuitionFee: "₹13 Lakhs/year", ranking: "#95 UK Guardian", acceptanceRate: "85%", minGpa: 5.5, minIelts: 5.5 },
            { name: "Cardiff Metropolitan University", location: "Cardiff, Wales", tuitionFee: "₹16 Lakhs/year", ranking: "#68 Times UK", acceptanceRate: "70%", minGpa: 6.5, minIelts: 6.0 }
        ],
        Germany: [
            { name: "Technical University of Munich", location: "Munich, Germany", tuitionFee: "€0 (Public Free)", ranking: "#37 QS World", acceptanceRate: "15%", minGpa: 8.5, minIelts: 6.5 },
            { name: "RWTH Aachen University", location: "Aachen, Germany", tuitionFee: "€0 (Public Free)", ranking: "#99 QS World", acceptanceRate: "28%", minGpa: 8.0, minIelts: 6.5 },
            { name: "SRH Berlin Univ. of Applied Sciences", location: "Berlin, Germany", tuitionFee: "₹9.5 Lakhs/year (Private)", ranking: "#10 Regional Private", acceptanceRate: "65%", minGpa: 6.0, minIelts: 6.0 },
            { name: "GISMA University of Applied Sciences", location: "Potsdam, Germany", tuitionFee: "₹10.5 Lakhs/year (Private)", ranking: "#15 Private Business", acceptanceRate: "75%", minGpa: 5.5, minIelts: 5.5 }
        ],
        Australia: [
            { name: "University of Sydney", location: "Sydney, NSW", tuitionFee: "₹24 Lakhs/year", ranking: "#19 QS World", acceptanceRate: "30%", minGpa: 8.0, minIelts: 6.5 },
            { name: "Deakin University", location: "Melbourne, VIC", tuitionFee: "₹18 Lakhs/year", ranking: "#230 QS World", acceptanceRate: "75%", minGpa: 6.5, minIelts: 6.0 },
            { name: "University of Wollongong", location: "Wollongong, NSW", tuitionFee: "₹17 Lakhs/year", ranking: "#160 QS World", acceptanceRate: "78%", minGpa: 6.0, minIelts: 6.0 },
            { name: "Torrens University", location: "Adelaide, SA", tuitionFee: "₹13 Lakhs/year", ranking: "Top Private Australia", acceptanceRate: "85%", minGpa: 5.5, minIelts: 5.5 }
        ]
    };

    const scholarships = [
        { name: "Fulbright Foreign Student Program", country: "USA", amount: "100% Tuition & Living Cost", type: "government", gpa: "8.0+ CGPA", test: "IELTS 7.0+ / TOEFL 100+" },
        { name: "Chevening Scholarships", country: "UK", amount: "Full Tuition + Living Costs", type: "government", gpa: "7.5+ CGPA", test: "IELTS 6.5+" },
        { name: "DAAD Postgraduate Scholarships", country: "Germany", amount: "Full €934/mo + Travel", type: "government", gpa: "8.0+ CGPA", test: "IELTS 6.0+ or B2 German" },
        { name: "Australia Awards Scholarships", country: "Australia", amount: "100% Tuition, Travel & Living", type: "government", gpa: "7.5+ CGPA", test: "IELTS 6.5+" },
        { name: "GREAT Scholarships", country: "UK", amount: "Up to £10,000 Tuition Waiver", type: "government", gpa: "7.0+ CGPA", test: "IELTS 6.5+" },
        { name: "CSU President's Merit Award", country: "USA", amount: "$5,000 - $12,000 Annual Waiver", type: "university", gpa: "8.5+ CGPA", test: "IELTS 6.5+ / GRE 305+" },
        { name: "Heinrich Böll Foundation Grants", country: "Germany", amount: "€850/mo + Health Cover", type: "external", gpa: "8.2+ CGPA", test: "IELTS 6.0+" },
        { name: "Deakin International Scholarship", country: "Australia", amount: "25% Tuition Fee Waiver", type: "university", gpa: "7.0+ CGPA", test: "IELTS 6.0+" }
    ];

    // 2. Hub Tab Navigation Logic
    const hubTabBtns = document.querySelectorAll('.hub-tab-btn');
    const hubTabPanes = document.querySelectorAll('.hub-tab-pane');

    if (hubTabBtns.length && hubTabPanes.length) {
        hubTabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetTab = btn.getAttribute('data-tab');
                hubTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                hubTabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === `pane-${targetTab}`) {
                        pane.classList.add('active');
                        if (targetTab === 'calculator') {
                            updateCostCalculator();
                        }
                    }
                });
                trackEvent('hub_tab_switch', { tab: targetTab });
            });
        });
    }



    // 4. Cost and Living Budget Calculator Logic
    const calcCountry = document.getElementById('calc-country');
    const calcTuition = document.getElementById('calc-tuition');
    const calcTuitionVal = document.getElementById('calc-tuition-val');
    const calcRent = document.getElementById('calc-rent');
    const calcLifestyle = document.getElementById('calc-lifestyle');
    const calcTotal = document.getElementById('calc-total');

    function updateCostCalculator() {
        if (!calcCountry) return;

        const country = calcCountry.value;
        let tuitionVal = parseInt(calcTuition.value);

        // Render tuition value dynamic label
        if (calcTuitionVal) {
            calcTuitionVal.textContent = country === 'Germany' && tuitionVal === 0 
                ? '€0 (Tuition Free Public)' 
                : `₹${tuitionVal} Lakhs`;
        }

        // Establish Cost parameters in INR Lakhs per Year
        let baseRent = 4.2; // Default Standard
        let baseLiving = 2.4; // Default Standard
        let insuranceVisa = 0.8; // Default Standard

        if (country === 'USA') {
            baseRent = 5.4;
            baseLiving = 3.0;
            insuranceVisa = 1.0;
        } else if (country === 'UK') {
            baseRent = 4.8;
            baseLiving = 2.6;
            insuranceVisa = 0.9;
        } else if (country === 'Germany') {
            baseRent = 4.0;
            baseLiving = 2.0;
            insuranceVisa = 0.8;
            // Snapping cap removed as requested to allow smooth sliding up to 20L+ for Germany
        } else if (country === 'Australia') {
            baseRent = 5.0;
            baseLiving = 2.8;
            insuranceVisa = 1.0;
        }

        // Apply accommodation tier multipliers
        const rentTier = calcRent.value;
        let rentMultiplier = 1.0;
        if (rentTier === 'shared') rentMultiplier = 0.75;
        if (rentTier === 'campus') rentMultiplier = 1.6;
        const totalRent = baseRent * rentMultiplier;

        // Apply lifestyle multipliers
        const lifestyleTier = calcLifestyle.value;
        let lifestyleMultiplier = 1.0;
        if (lifestyleTier === 'budget') lifestyleMultiplier = 0.75;
        if (lifestyleTier === 'comfort') lifestyleMultiplier = 1.6;
        const totalLiving = baseLiving * lifestyleMultiplier;

        // Compute Total
        const computedTotal = tuitionVal + totalRent + totalLiving + insuranceVisa;

        // Render Total Cost
        if (calcTotal) {
            calcTotal.textContent = `₹${computedTotal.toFixed(1)} Lakhs`;
        }

        // Render Individual items and progress bars
        const itemTuitionEl = document.getElementById('item-tuition');
        const itemRentEl = document.getElementById('item-rent');
        const itemLivingEl = document.getElementById('item-living');
        const itemInsuranceEl = document.getElementById('item-insurance');

        if (itemTuitionEl) itemTuitionEl.textContent = country === 'Germany' && tuitionVal === 0 ? '€0 (Public)' : `₹${tuitionVal.toFixed(1)} Lakhs`;
        if (itemRentEl) itemRentEl.textContent = `₹${totalRent.toFixed(1)} Lakhs`;
        if (itemLivingEl) itemLivingEl.textContent = `₹${totalLiving.toFixed(1)} Lakhs`;
        if (itemInsuranceEl) itemInsuranceEl.textContent = `₹${insuranceVisa.toFixed(1)} Lakhs`;

        // Calculate progress percentage widths
        const barTuition = document.getElementById('bar-tuition');
        const barRent = document.getElementById('bar-rent');
        const barLiving = document.getElementById('bar-living');
        const barInsurance = document.getElementById('bar-insurance');

        if (barTuition) barTuition.style.width = `${(tuitionVal / computedTotal) * 100}%`;
        if (barRent) barRent.style.width = `${(totalRent / computedTotal) * 100}%`;
        if (barLiving) barLiving.style.width = `${(totalLiving / computedTotal) * 100}%`;
        if (barInsurance) barInsurance.style.width = `${(insuranceVisa / computedTotal) * 100}%`;
    }

    // Attach Calculator Event Listeners
    if (calcCountry) {
        calcCountry.addEventListener('change', updateCostCalculator);
        calcTuition.addEventListener('input', updateCostCalculator);
        calcRent.addEventListener('change', updateCostCalculator);
        calcLifestyle.addEventListener('change', updateCostCalculator);
    }

    // Trigger WhatsApp lead generation inside Cost Calculator
    const calcLeadTrigger = document.getElementById('calc-lead-trigger');
    if (calcLeadTrigger) {
        calcLeadTrigger.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'contact.html';
        });
    }

    // 5. Scholarship Search & Filter Logic
    const schSearchInput = document.getElementById('sch-search');
    const schCountrySelect = document.getElementById('sch-country');
    const schTypeSelect = document.getElementById('sch-type');
    const schResultsGrid = document.getElementById('scholarship-results-grid');

    function renderScholarships() {
        if (!schResultsGrid) return;

        const query = schSearchInput ? schSearchInput.value.toLowerCase().trim() : '';
        const country = schCountrySelect ? schCountrySelect.value : 'all';
        const type = schTypeSelect ? schTypeSelect.value : 'all';

        const filtered = scholarships.filter(sch => {
            const matchesQuery = sch.name.toLowerCase().includes(query) || sch.amount.toLowerCase().includes(query) || sch.gpa.toLowerCase().includes(query);
            const matchesCountry = country === 'all' || sch.country === country;
            const matchesType = type === 'all' || sch.type === type;
            return matchesQuery && matchesCountry && matchesType;
        });

        if (filtered.length === 0) {
            schResultsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-gray-500);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 12px; color: var(--color-gray-300);"></i>
                    <p>No scholarships found matching your criteria. Try adjusting the search term or filters.</p>
                </div>
            `;
            return;
        }

        // Render card buttons with HTML5 data attributes to completely bypass unescaped inline single quotes
        schResultsGrid.innerHTML = filtered.map(sch => `
            <div class="scholarship-card">
                <div>
                    <span class="sch-badge">${sch.type.charAt(0).toUpperCase() + sch.type.slice(1)}</span>
                    <h4>${sch.name}</h4>
                    <div class="sch-amount">${sch.amount}</div>
                    <div class="sch-details">
                        <div class="sch-detail-item"><i class="fas fa-map-marker-alt"></i> ${sch.country}</div>
                        <div class="sch-detail-item"><i class="fas fa-graduation-cap"></i> ${sch.gpa}</div>
                        <div class="sch-detail-item"><i class="fas fa-language"></i> ${sch.test}</div>
                    </div>
                </div>
                <button class="btn btn--outline btn--sm sch-cta-btn" data-name="${sch.name.replace(/"/g, '&quot;')}" data-country="${sch.country}">
                    Check My Eligibility
                </button>
            </div>
        `).join('');
    }

    if (schSearchInput) {
        schSearchInput.addEventListener('input', renderScholarships);
        schCountrySelect.addEventListener('change', renderScholarships);
        schTypeSelect.addEventListener('change', renderScholarships);
    }
    
    // Global function to trigger drawer for scholarships (preserving backwards compatibility)
    window.openScholarshipDrawer = function (schName, schCountry) {
        window.openDrawerWithContext('scholarship', { scholarshipName: schName, scholarshipCountry: schCountry });
        trackEvent('scholarship_eligibility_click', { scholarship_name: schName });
    };

    // Event Delegation for scholarship grid eligibility buttons
    if (schResultsGrid) {
        schResultsGrid.addEventListener('click', function (e) {
            const btn = e.target.closest('.sch-cta-btn');
            if (btn) {
                e.preventDefault();
                window.location.href = 'contact.html';
            }
        });
    }

    // Initial load
    renderScholarships();

    // Helper for direct redirection to contact.html
    window.openDrawerWithContext = function () {
        window.location.href = 'contact.html';
    };
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
