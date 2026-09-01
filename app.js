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

    // Observe stats & tile grid section
    const statsSections = document.querySelectorAll('.hero-tiles-grid, .hero-stats');
    statsSections.forEach(section => {
        countersObserver.observe(section);
    });

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

    // Navbar scroll effect & Luxury 2.5px Progress Indicator
    if (navbar) {
        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update Progress Bar
            const progressBar = document.getElementById('scrollProgressBar');
            if (progressBar) {
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
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
        // ==================== USA SCHOLARSHIPS ====================
        {
            id: "fulbright-nehru",
            name: "Fulbright-Nehru Master's Fellowships",
            country: "USA",
            amount: "100% Tuition + Living + Flights + Insurance",
            coverageType: "full",
            type: "government",
            typeLabel: "Govt / USIEF",
            degree: "Master's (Select Fields)",
            gpa: "7.5+ CGPA (55%+ Minimum)",
            test: "IELTS 6.5+ / TOEFL 90+ (GRE Optional)",
            deadline: "Mid-May (Annual Cycle for Next Fall)",
            mode: "Separate USIEF Portal + Interview",
            description: "Prestigious US government fellowship for outstanding Indian graduates with 3+ years professional work experience."
        },
        {
            id: "us-graduate-assistantships",
            name: "Graduate Assistantships (TA / RA / GA)",
            country: "USA",
            amount: "50%–100% Tuition Waiver + $1,400–$2,400/mo Stipend",
            coverageType: "full",
            type: "university",
            typeLabel: "University Dept",
            degree: "Master's / MS / PhD",
            gpa: "7.5+ CGPA",
            test: "IELTS 6.5+ / TOEFL 95+ (GRE 310+ advantageous)",
            deadline: "Dec–Feb (Early Priority Deadlines)",
            mode: "Departmental Assessment with Application",
            description: "Teaching and Research Assistantships offering full or partial tuition waivers and monthly stipends for 20 hrs/week academic work."
        },
        {
            id: "csu-merit",
            name: "CSU & Public University Merit Awards",
            country: "USA",
            amount: "$4,000 – $12,000 / year Tuition Waiver",
            coverageType: "partial",
            type: "university",
            typeLabel: "University Merit",
            degree: "Master's & Bachelor's",
            gpa: "7.0+ CGPA",
            test: "IELTS 6.0+ / Duolingo 105+",
            deadline: "Rolling with University Application",
            mode: "Automatic Consideration with Offer",
            description: "Merit-based international tuition fee reduction automatically applied based on undergraduate academic performance."
        },
        {
            id: "northeastern-dean-merit",
            name: "Northeastern Dean's Scholarship",
            country: "USA",
            amount: "$5,000 – $15,000 Total Tuition Credit",
            coverageType: "partial",
            type: "university",
            typeLabel: "University Merit",
            degree: "Master's (STEM / Management)",
            gpa: "7.8+ CGPA",
            test: "IELTS 6.5+ / TOEFL 90+",
            deadline: "Priority Application Windows",
            mode: "Automatic with Admission Offer",
            description: "Competitive merit scholarship awarded by top-tier US universities based on holistic academic and leadership profile."
        },
        {
            id: "inlaks-scholarship",
            name: "Inlaks Shivdasani Foundation Grants",
            country: "USA",
            amount: "Up to $100,000 (Tuition + Living + Travel)",
            coverageType: "full",
            type: "external",
            typeLabel: "Private Trust",
            degree: "Master's / Postgraduate",
            gpa: "8.0+ CGPA",
            test: "IELTS 7.0+ / High Academic Standing",
            deadline: "March (Annual Cycle)",
            mode: "Separate Foundation Application",
            description: "Premier Indian private foundation funding exceptional young Indians admitted to top US, UK, and European institutions."
        },
        {
            id: "jn-tata-endowment",
            name: "JN Tata Endowment Loan Scholarship",
            country: "USA",
            amount: "₹1.0 Lakh – ₹10.0 Lakhs + Gift Grants",
            coverageType: "partial",
            type: "external",
            typeLabel: "Indian Trust",
            degree: "Master's / PhD",
            gpa: "6.5+ CGPA (60%+ minimum)",
            test: "Standard Admission Requirements",
            deadline: "March–April Annually",
            mode: "Online Application + Interview",
            description: "Prestigious Tata Trust grant supporting Indian students going abroad for higher education; includes gift scholarship component."
        },

        // ==================== UK SCHOLARSHIPS ====================
        {
            id: "chevening-uk",
            name: "Chevening Scholarships (UK Government)",
            country: "UK",
            amount: "100% Tuition Fees + £1,300/mo Living + Flights",
            coverageType: "full",
            type: "government",
            typeLabel: "UK FCDO Govt",
            degree: "1-Year Master's (Any University)",
            gpa: "7.5+ CGPA (Upper Second Class)",
            test: "IELTS 6.5+ (Met by university requirement)",
            deadline: "Early November Annually",
            mode: "Chevening Online Portal",
            description: "The UK government's flagship global scholarship program for future leaders with minimum 2 years (2,800 hours) work experience."
        },
        {
            id: "great-scholarships",
            name: "GREAT Scholarships (British Council & UK Govt)",
            country: "UK",
            amount: "Minimum £10,000 Tuition Fee Waiver",
            coverageType: "partial",
            type: "government",
            typeLabel: "British Council",
            degree: "1-Year Taught Master's",
            gpa: "7.0+ CGPA",
            test: "IELTS 6.5+ / University English Test",
            deadline: "March–May (Varies by University)",
            mode: "Separate Portal via Partner UK Univ",
            description: "Jointly funded by the UK Government's GREAT Britain Campaign and partner UK universities for Indian passport holders."
        },
        {
            id: "commonwealth-master",
            name: "Commonwealth Master's Scholarships",
            country: "UK",
            amount: "100% Tuition + Monthly Stipend + Airfare",
            coverageType: "full",
            type: "government",
            typeLabel: "Commonwealth CSFP",
            degree: "1-Year Master's",
            gpa: "7.5+ CGPA (First Class Degree)",
            test: "IELTS 6.5+",
            deadline: "October–December Annually",
            mode: "National Nominating Agency (MHRD)",
            description: "Full-ride development scholarship for Indian students who cannot otherwise afford to study in the UK."
        },
        {
            id: "uk-vc-excellence",
            name: "Vice-Chancellor's International Excellence Award",
            country: "UK",
            amount: "£2,500 – £6,000 Direct Fee Deduction",
            coverageType: "partial",
            type: "university",
            typeLabel: "University Merit",
            degree: "Master's & Undergraduate",
            gpa: "6.5+ CGPA",
            test: "IELTS 6.0+ / 70%+ in 12th English",
            deadline: "Rolling with Admission Offer",
            mode: "Automatic Assessment upon Admission",
            description: "Direct fee reduction awarded to high-achieving Indian applicants upon receiving an offer from partner UK universities."
        },
        {
            id: "charles-wallace-trust",
            name: "Charles Wallace India Trust (CWIT) Grants",
            country: "UK",
            amount: "£1,400/mo Living Grant + Travel & Fees",
            coverageType: "stipend",
            type: "external",
            typeLabel: "Private Trust",
            degree: "Master's / Doctoral / Research",
            gpa: "7.0+ CGPA",
            test: "IELTS 6.5+",
            deadline: "November Annually",
            mode: "British Council India Portal",
            description: "Supports Indian students and early-to-mid-career professionals undertaking postgraduate studies in the UK."
        },

        // ==================== GERMANY SCHOLARSHIPS ====================
        {
            id: "daad-postgrad",
            name: "DAAD Study Scholarships & EPOS",
            country: "Germany",
            amount: "€934/month Living Allowance + Travel + Health Insurance",
            coverageType: "stipend",
            type: "government",
            typeLabel: "German DAAD",
            degree: "Master's Degree (Public Univ)",
            gpa: "7.8+ CGPA (Top 20% of class)",
            test: "IELTS 6.0+ / TOEFL 80+ or German B2",
            deadline: "September–October Annually",
            mode: "DAAD Online Portal",
            description: "Premier German government grant providing full monthly living stipend and health coverage at tuition-free public universities."
        },
        {
            id: "deutschlandstipendium",
            name: "Deutschlandstipendium (National Scholarship)",
            country: "Germany",
            amount: "€3,600 / year (€300 / month Direct Cash)",
            coverageType: "stipend",
            type: "government",
            typeLabel: "Federal Govt & Univ",
            degree: "Bachelor's & Master's",
            gpa: "7.5+ CGPA",
            test: "University Admission English/German",
            deadline: "June–August / Upon Enrollment",
            mode: "Enrolled University Portal",
            description: "Co-funded by the German Federal Government and private sponsors, open to all international students after university enrollment."
        },
        {
            id: "heinrich-boll",
            name: "Heinrich Böll Foundation Scholarships",
            country: "Germany",
            amount: "€934/month + €100/mo Book Allowance",
            coverageType: "stipend",
            type: "external",
            typeLabel: "German Political Trust",
            degree: "Master's / PhD",
            gpa: "8.0+ CGPA",
            test: "German B2 / DSH or English IELTS 6.5+",
            deadline: "March 1 & September 1 Annually",
            mode: "Online Portal + Interview",
            description: "Supports international students with stellar academic records and strong commitment to social, environmental, and civic values."
        },
        {
            id: "erasmus-mundus-de",
            name: "Erasmus Mundus Joint Master Degrees",
            country: "Germany",
            amount: "100% Tuition Waiver + €1,400/mo Stipend + Travel",
            coverageType: "full",
            type: "government",
            typeLabel: "European Union",
            degree: "Joint Master's (Germany + EU)",
            gpa: "8.0+ CGPA",
            test: "IELTS 6.5+ / TOEFL 90+",
            deadline: "Jan–Feb (Annual Consortium Deadlines)",
            mode: "Consortium Application",
            description: "Prestigious EU-funded scholarships allowing students to study across top German and European partner universities with all expenses covered."
        },

        // ==================== AUSTRALIA SCHOLARSHIPS ====================
        {
            id: "australia-awards",
            name: "Australia Awards Scholarships (DFAT)",
            country: "Australia",
            amount: "100% Tuition + Living Stipend + Return Flights + OSHC",
            coverageType: "full",
            type: "government",
            typeLabel: "DFAT Australian Govt",
            degree: "Master's & PhD",
            gpa: "7.5+ CGPA (65%+ minimum)",
            test: "IELTS 6.5+ (minimum 6.0 in each band)",
            deadline: "End of April Annually",
            mode: "OASIS Online Portal",
            description: "Prestigious Australian government scholarships covering all tuition, full living allowance, medical cover, and establishment grants."
        },
        {
            id: "destination-australia",
            name: "Destination Australia Scholarships",
            country: "Australia",
            amount: "Up to AUD $15,000 / year Cash Grant",
            coverageType: "partial",
            type: "government",
            typeLabel: "Australian Govt (Regional)",
            degree: "Bachelor's & Master's",
            gpa: "7.0+ CGPA",
            test: "IELTS 6.5+",
            deadline: "Nov–Jan (Semester 1) / May (Semester 2)",
            mode: "Participating Regional University",
            description: "Government initiative providing substantial funding to international students studying at regional campus universities in Australia."
        },
        {
            id: "deakin-vice-chancellor",
            name: "Vice-Chancellor's Meritorious Scholarship",
            country: "Australia",
            amount: "50% or 100% Full Tuition Fee Waiver",
            coverageType: "full",
            type: "university",
            typeLabel: "University Excellence",
            degree: "Postgraduate & Undergraduate",
            gpa: "8.5+ CGPA",
            test: "IELTS 6.5+ / PTE 58+",
            deadline: "Priority Deadlines per Intake",
            mode: "Separate University Scholarship Form",
            description: "High-distinction award recognizing outstanding Indian students with comprehensive tuition coverage for entire course duration."
        },
        {
            id: "sydney-international-award",
            name: "Sydney International Student Award",
            country: "Australia",
            amount: "20% Tuition Fee Reduction for Course Duration",
            coverageType: "partial",
            type: "university",
            typeLabel: "University Merit",
            degree: "CRICOS Undergraduate & Postgraduate",
            gpa: "7.0+ CGPA",
            test: "IELTS 6.5+",
            deadline: "Rolling with University Admissions",
            mode: "Assessed with Expression of Interest",
            description: "Direct fee waiver automatically assessed for eligible Indian passport holders admitted into CRICOS accredited degree programs."
        },
        {
            id: "australian-rtp",
            name: "Research Training Program (RTP) Stipend",
            country: "Australia",
            amount: "100% Tuition Fee Offset + AUD $32,000/yr Living Allowance",
            coverageType: "full",
            type: "government",
            typeLabel: "Govt Research (RTP)",
            degree: "Master's by Research & PhD",
            gpa: "8.0+ CGPA",
            test: "IELTS 6.5+ / Research Proposal",
            deadline: "August–October (Main Round)",
            mode: "University Research Portal",
            description: "Provides full tuition coverage and high-value annual living stipend for postgraduate research candidates at Australian universities."
        }
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

    // Country baseline configurations (Research-calibrated 2025/2026 for Indian Students)
    const countryCostProfiles = {
        USA: {
            baseRent: 6.4,          // Shared ~5.1L, Studio ~8.0L, Campus ~10.2L
            baseLiving: 3.6,        // Budget ~2.9L, Moderate ~4.3L, Comfort ~5.8L
            insuranceVisa: 3.0,     // F-1 Visa ($185) + SEVIS ($350) + Mandatory Health Insurance ($1.8k) + Airfare (~85k) + Essentials
            defaultTuition: 24,
            maxTuition: 60,
            tuitionDesc: "Annual tuition for US public & private universities",
            insuranceDesc: "F-1 Visa ($185), SEVIS fee ($350), Mandatory Health Insurance & Flights",
            totalNote: "Convertible to Education Loan with Low Interest Rate"
        },
        UK: {
            baseRent: 6.0,          // Shared ~4.8L, Studio ~7.5L, Campus ~9.6L
            baseLiving: 3.5,        // Budget ~2.8L, Moderate ~4.2L, Comfort ~5.6L
            insuranceVisa: 2.6,     // Student Visa (£490) + Mandatory NHS Health Surcharge (IHS £776/yr) + Airfare (~60k) + TB/VFS
            defaultTuition: 18,
            maxTuition: 50,
            tuitionDesc: "Annual tuition (standard 1-year Master's or per-year UG)",
            insuranceDesc: "Tier 4 Visa (£490), Mandatory NHS Surcharge (IHS £776/yr) & Flights",
            totalNote: "1-Year Master's structure significantly saves overall living cost"
        },
        Germany: {
            baseRent: 5.0,          // Shared WG ~4.0L, Studio ~6.2L, Campus ~8.0L
            baseLiving: 3.6,        // Budget ~2.9L, Moderate ~4.3L, Comfort ~5.8L (Aligns with €11,904/yr Sperrkonto requirement)
            insuranceVisa: 2.5,     // National Visa + APS Verification (₹18k) + Mandatory TK Health Insurance (€130/mo) + Flights (~55k)
            defaultTuition: 0,
            maxTuition: 25,
            tuitionDesc: "€0 for top Public Universities (or ₹8-15L for Private Universities)",
            insuranceDesc: "National Visa, APS Verification, Mandatory TK Health Cover & Flights",
            totalNote: "Primarily covers Blocked Account (€11,904/yr) + Pre-departure requirements"
        },
        Australia: {
            baseRent: 6.5,          // Shared ~5.2L, Studio ~8.1L, Campus ~10.4L
            baseLiving: 3.8,        // Budget ~3.0L, Moderate ~4.6L, Comfort ~6.1L
            insuranceVisa: 2.8,     // Student Visa Subclass 500 (AUD 1,600) + Mandatory OSHC Cover (AUD 750/yr) + Airfare (~70k) + Medicals
            defaultTuition: 20,
            maxTuition: 55,
            tuitionDesc: "Annual tuition for CRICOS accredited Australian universities",
            insuranceDesc: "Subclass 500 Visa (AUD 1,600), Mandatory OSHC Insurance & Flights",
            totalNote: "Aligns with official DHA annual financial proof requirements"
        }
    };

    let lastSelectedCountry = calcCountry ? calcCountry.value : 'USA';

    function handleCountryChange() {
        if (!calcCountry || !calcTuition) return;
        const newCountry = calcCountry.value;
        const profile = countryCostProfiles[newCountry] || countryCostProfiles.USA;

        calcTuition.max = profile.maxTuition;

        // If switching from or to Germany, adjust tuition value sensibly
        if (newCountry === 'Germany' && (calcTuition.value >= 18 || lastSelectedCountry !== 'Germany')) {
            calcTuition.value = profile.defaultTuition;
        } else if (lastSelectedCountry === 'Germany' && calcTuition.value == 0) {
            calcTuition.value = profile.defaultTuition;
        }

        lastSelectedCountry = newCountry;
        updateCostCalculator();
    }

    function updateCostCalculator() {
        if (!calcCountry) return;

        const country = calcCountry.value;
        const profile = countryCostProfiles[country] || countryCostProfiles.USA;
        let tuitionVal = parseInt(calcTuition ? calcTuition.value : profile.defaultTuition, 10);
        if (isNaN(tuitionVal)) tuitionVal = profile.defaultTuition;

        // Render tuition value dynamic label
        if (calcTuitionVal) {
            if (country === 'Germany') {
                calcTuitionVal.textContent = tuitionVal === 0 
                    ? '€0 (Tuition Free Public)' 
                    : `₹${tuitionVal} Lakhs (Private Univ)`;
            } else {
                calcTuitionVal.textContent = `₹${tuitionVal} Lakhs`;
            }
        }

        // Establish Cost parameters in INR Lakhs per Year
        const baseRent = profile.baseRent;
        const baseLiving = profile.baseLiving;
        const insuranceVisa = profile.insuranceVisa;

        // Apply accommodation tier multipliers
        const rentTier = calcRent ? calcRent.value : 'shared';
        let rentMultiplier = 0.8; // Default shared saver
        if (rentTier === 'private') rentMultiplier = 1.25;
        if (rentTier === 'campus') rentMultiplier = 1.6;
        const totalRent = baseRent * rentMultiplier;

        // Apply lifestyle multipliers
        const lifestyleTier = calcLifestyle ? calcLifestyle.value : 'budget';
        let lifestyleMultiplier = 0.8; // Default budget
        if (lifestyleTier === 'moderate') lifestyleMultiplier = 1.2;
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

        const descTuitionEl = document.getElementById('desc-tuition');
        const descInsuranceEl = document.getElementById('desc-insurance');
        const calcTotalNoteEl = document.getElementById('calc-total-note');

        if (itemTuitionEl) {
            itemTuitionEl.textContent = country === 'Germany' && tuitionVal === 0 ? '€0 (Public)' : `₹${tuitionVal.toFixed(1)} Lakhs`;
        }
        if (itemRentEl) itemRentEl.textContent = `₹${totalRent.toFixed(1)} Lakhs`;
        if (itemLivingEl) itemLivingEl.textContent = `₹${totalLiving.toFixed(1)} Lakhs`;
        if (itemInsuranceEl) itemInsuranceEl.textContent = `₹${insuranceVisa.toFixed(1)} Lakhs`;

        if (descTuitionEl) descTuitionEl.textContent = profile.tuitionDesc;
        if (descInsuranceEl) descInsuranceEl.textContent = profile.insuranceDesc;
        if (calcTotalNoteEl && profile.totalNote) calcTotalNoteEl.textContent = profile.totalNote;

        // Calculate progress percentage widths
        const barTuition = document.getElementById('bar-tuition');
        const barRent = document.getElementById('bar-rent');
        const barLiving = document.getElementById('bar-living');
        const barInsurance = document.getElementById('bar-insurance');

        if (barTuition) barTuition.style.width = `${(tuitionVal / computedTotal) * 100}%`;
        if (barRent) barRent.style.width = `${(totalRent / computedTotal) * 100}%`;
        if (barLiving) barLiving.style.width = `${(totalLiving / computedTotal) * 100}%`;
        if (barInsurance) barInsurance.style.width = `${(insuranceVisa / computedTotal) * 100}%`;

        // Update Real-Time Stacked Visual Budget Ratio Segments
        const segTuition = document.getElementById('segTuition');
        const segLiving = document.getElementById('segLiving');
        const segOverhead = document.getElementById('segOverhead');

        if (segTuition) segTuition.style.width = `${Math.max(4, (tuitionVal / computedTotal) * 100)}%`;
        if (segLiving) segLiving.style.width = `${Math.max(4, ((totalRent + totalLiving) / computedTotal) * 100)}%`;
        if (segOverhead) segOverhead.style.width = `${Math.max(4, (insuranceVisa / computedTotal) * 100)}%`;
    }

    // Attach Calculator Event Listeners
    if (calcCountry) {
        calcCountry.addEventListener('change', handleCountryChange);
        if (calcTuition) calcTuition.addEventListener('input', updateCostCalculator);
        if (calcRent) calcRent.addEventListener('change', updateCostCalculator);
        if (calcLifestyle) calcLifestyle.addEventListener('change', updateCostCalculator);
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
    const schCoverageSelect = document.getElementById('sch-coverage');
    const schResultsGrid = document.getElementById('scholarship-results-grid');

    function renderScholarships() {
        if (!schResultsGrid) return;

        const query = schSearchInput ? schSearchInput.value.toLowerCase().trim() : '';
        const country = schCountrySelect ? schCountrySelect.value : 'all';
        const type = schTypeSelect ? schTypeSelect.value : 'all';
        const coverage = schCoverageSelect ? schCoverageSelect.value : 'all';

        const filtered = scholarships.filter(sch => {
            const matchesQuery = !query || 
                sch.name.toLowerCase().includes(query) || 
                sch.amount.toLowerCase().includes(query) || 
                sch.gpa.toLowerCase().includes(query) ||
                sch.country.toLowerCase().includes(query) ||
                sch.degree.toLowerCase().includes(query) ||
                sch.description.toLowerCase().includes(query);

            const matchesCountry = country === 'all' || sch.country === country;
            const matchesType = type === 'all' || sch.type === type;
            const matchesCoverage = coverage === 'all' || sch.coverageType === coverage;

            return matchesQuery && matchesCountry && matchesType && matchesCoverage;
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

        // Render rich scholarship cards
        schResultsGrid.innerHTML = filtered.map(sch => {
            let badgeClass = 'badge-govt';
            if (sch.type === 'university') badgeClass = 'badge-univ';
            if (sch.type === 'external') badgeClass = 'badge-trust';

            let covClass = 'cov-partial';
            let covLabel = '🏷️ Tuition Waiver';
            if (sch.coverageType === 'full') {
                covClass = 'cov-full';
                covLabel = '★ 100% Full-Ride';
            } else if (sch.coverageType === 'stipend') {
                covClass = 'cov-stipend';
                covLabel = '💵 Living Stipend';
            }

            return `
            <div class="scholarship-card">
                <div>
                    <div class="sch-badge-row">
                        <span class="sch-badge ${badgeClass}">${sch.typeLabel || sch.type.toUpperCase()}</span>
                        <span class="sch-coverage-tag ${covClass}">${covLabel}</span>
                    </div>
                    <h4 class="sch-title">${sch.name}</h4>
                    <div class="sch-amount">${sch.amount}</div>
                    <p class="sch-desc">${sch.description}</p>
                    <div class="sch-details-grid">
                        <div class="sch-detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div><strong>Country &amp; Level:</strong> ${sch.country} (${sch.degree})</div>
                        </div>
                        <div class="sch-detail-item">
                            <i class="fas fa-graduation-cap"></i>
                            <div><strong>Min Academics:</strong> ${sch.gpa}</div>
                        </div>
                        <div class="sch-detail-item">
                            <i class="fas fa-language"></i>
                            <div><strong>Test Criteria:</strong> ${sch.test}</div>
                        </div>
                        <div class="sch-detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div><strong>Deadline:</strong> ${sch.deadline}</div>
                        </div>
                        <div class="sch-detail-item">
                            <i class="fas fa-paper-plane"></i>
                            <div><strong>Application Mode:</strong> ${sch.mode}</div>
                        </div>
                    </div>
                </div>
                <button class="btn btn--outline btn--sm sch-cta-btn" data-name="${sch.name.replace(/"/g, '&quot;')}" data-country="${sch.country}">
                    <span>Check Eligibility &amp; Apply</span>
                    <i class="fas fa-arrow-right" style="margin-left: 6px;"></i>
                </button>
            </div>
            `;
        }).join('');
    }

    if (schSearchInput) {
        schSearchInput.addEventListener('input', renderScholarships);
        schCountrySelect.addEventListener('change', renderScholarships);
        schTypeSelect.addEventListener('change', renderScholarships);
        if (schCoverageSelect) schCoverageSelect.addEventListener('change', renderScholarships);
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
// ANNOUNCEMENT BANNER FUNCTIONS (Multi-Slide Interactive)
// ============================================
let bannerSlideInterval = null;
let currentBannerSlide = 0;

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
        updateBannerHeight();
        window.addEventListener('resize', updateBannerHeight);

        // Initialize dynamic slider
        initBannerSlider(banner);
    } else {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        document.body.style.setProperty('--banner-height', '0px');
    }
}

function initBannerSlider(banner) {
    const slides = banner.querySelectorAll('.announce-slide');
    const dots = banner.querySelectorAll('.announce-dot');
    if (slides.length <= 1) return;

    function goToSlide(index) {
        currentBannerSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentBannerSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentBannerSlide);
        });
        updateBannerHeight();
    }

    function nextSlide() {
        goToSlide(currentBannerSlide + 1);
    }

    function startAutoSlide() {
        clearInterval(bannerSlideInterval);
        bannerSlideInterval = setInterval(nextSlide, 4500);
    }

    function stopAutoSlide() {
        clearInterval(bannerSlideInterval);
    }

    // Dot click listeners
    dots.forEach((dot, i) => {
        dot.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(i);
            startAutoSlide();
        });
    });

    // Pause auto-rotation on mouse hover / touch
    banner.addEventListener('mouseenter', stopAutoSlide);
    banner.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
}

function updateBannerHeight() {
    const banner = document.getElementById('announceBanner') || document.getElementById('rebrandBanner');
    if (banner && !banner.classList.contains('hidden') && banner.getAttribute('data-enabled') !== 'false') {
        const height = banner.offsetHeight;
        document.body.style.setProperty('--banner-height', height + 'px');
    }
}

// Close banner function
window.closeAnnounceBanner = function () {
    const banner = document.getElementById('announceBanner');
    if (banner) {
        banner.classList.add('hidden');
        document.body.classList.remove('banner-visible');
        document.body.style.setProperty('--banner-height', '0px');
        sessionStorage.setItem('bannerClosed', 'true');
        clearInterval(bannerSlideInterval);
    }
};

window.closeBanner = window.closeAnnounceBanner;

// Smooth Scroll & Tab Switch to Cost & Budget Estimator
window.scrollToBudgetCalculator = function (event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const hubSection = document.getElementById('hub') || document.querySelector('.abroad-hub-section');
    if (hubSection) {
        // Activate the calculator tab button
        const calcTabBtn = document.querySelector('.hub-tab-btn[data-tab="calculator"]');
        if (calcTabBtn) {
            calcTabBtn.click();
        }

        // Account for fixed navbar & dynamic banner
        const navHeight = 72;
        const bannerVisible = document.body.classList.contains('banner-visible');
        const bannerHeight = bannerVisible ? 48 : 0;
        const targetTop = hubSection.getBoundingClientRect().top + window.pageYOffset - (navHeight + bannerHeight);

        window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: 'smooth'
        });
    } else {
        window.location.href = 'index.html#hub';
    }
};
