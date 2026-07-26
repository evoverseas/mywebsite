/**
 * ============================================================
 * EV OVERSEAS — Student Dashboard JavaScript (Multi-App)
 * ============================================================
 * 
 * Handles:
 * - Google Sign-In authentication
 * - Fetching student data with multiple applications
 * - Application selector dropdown
 * - Rendering dashboard UI for selected application
 * - Chart.js progress visualization
 */

// ── CONFIGURATION ──────────────────────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzI6mgA3ELgi4YW-nbbpXEUhxJsBUc6gyj7IZn6rodIClK7AybjkVfTQMyDxfF1B8c-/exec';
const CLERK_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuZXZvdmVyc2Vhcy5jb20k';

// ── Journey Steps Definition (matches website) ────────────
const JOURNEY_STEPS = [
    { number: 1, name: 'Initial Consultation', icon: '💬' },
    { number: 2, name: 'Profile & University Shortlist', icon: '🎯' },
    { number: 3, name: 'Application & Documentation', icon: '📋' },
    { number: 4, name: 'Offer & Scholarship', icon: '🎓' },
    { number: 5, name: 'Visa & Pre-departure', icon: '🛂' },
    { number: 6, name: 'Arrival & Onboarding', icon: '✈️' }
];

// ── GLOBAL STATE ───────────────────────────────────────────
let currentUser = null;
let studentData = null;
let currentApplicationIndex = 0;
let progressChart = null;

// ── INITIALIZATION ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Check if URL has ?demo=true or #demo parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true' || window.location.hash === '#demo') {
        loadDemoMode();
        return;
    }

    // Show login screen initially
    showLoginScreen();

    // Initialize Demo Preview button
    const demoBtn = document.getElementById('demoPreviewBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', loadDemoMode);
    }

    // Initialize Clerk Authentication asynchronously without blocking
    setTimeout(initClerkAuth, 100);
});

// ── Demo Mode Preview ──────────────────────────────────────
function loadDemoMode() {
    currentUser = {
        name: "Rahul Sharma (Demo)",
        email: "rahul.sharma.demo@evoverseas.com",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        given_name: "Rahul"
    };

    studentData = {
        success: true,
        isDemo: true,
        student: {
            name: "Rahul Sharma",
            email: "rahul.sharma.demo@evoverseas.com",
            phone: "+91 98765 43210",
            counselorName: "Siddharth V.",
            counselorRole: "Senior Overseas Education Lead (USA & UK)",
            counselorPhone: "+91 96669 63756",
            counselorEmail: "siddharth@evoverseas.com"
        },
        applications: [
            {
                university: "Northeastern University",
                country: "USA",
                intake: "Fall 2026",
                degree: "MS in Computer Science",
                overallStatus: "Offer Received",
                currentStep: 4,
                documents: [
                    { name: "Passport (First & Last Page)", status: "Approved", link: "#" },
                    { name: "Bachelor's Transcripts & Degree", status: "Approved", link: "#" },
                    { name: "Statement of Purpose (SOP)", status: "Approved", link: "#" },
                    { name: "Letters of Recommendation (3 LORs)", status: "Approved", link: "#" },
                    { name: "IELTS Scorecard (7.5 Overall)", status: "Approved", link: "#" },
                    { name: "Financial Savings & Bank Solvency", status: "Under Review", link: "#" },
                    { name: "DS-160 & I-20 Form Request", status: "Pending Upload", link: "#" }
                ],
                milestones: [
                    { title: "Free Initial Consultation & Profile Analysis", date: "Jan 10, 2026", status: "completed", note: "Evaluated CGPA (8.4/10), target ROI, and budget limits." },
                    { title: "University Shortlisting & Course Match", date: "Jan 18, 2026", status: "completed", note: "Shortlisted 5 tuition-efficient universities with high graduate placement rates." },
                    { title: "Application Submission & Document Upload", date: "Feb 05, 2026", status: "completed", note: "Application submitted to Northeastern University admissions portal." },
                    { title: "Admissions Offer & Merit Scholarship Approval", date: "Mar 12, 2026", status: "current", note: "Unconditional Admit Letter received with $5,000 Dean's Merit Scholarship!" },
                    { title: "Visa Documentation & Mock Interview Practice", date: "Expected May 2026", status: "upcoming", note: "1-on-1 mock visa interview preparation with Himayatnagar senior visa expert." },
                    { title: "Pre-Departure Briefing & Flight Onboarding", date: "Expected Aug 2026", status: "upcoming", note: "Housing arrangement, forex card, and student community group join." }
                ]
            },
            {
                university: "University of Birmingham",
                country: "UK",
                intake: "Fall 2026",
                degree: "MSc Data Science & AI",
                overallStatus: "Application Submitted",
                currentStep: 3,
                documents: [
                    { name: "Passport", status: "Approved", link: "#" },
                    { name: "Academic Transcripts", status: "Approved", link: "#" },
                    { name: "UK SOP & Personal Statement", status: "Approved", link: "#" },
                    { name: "CAS Statement Request Form", status: "Under Review", link: "#" }
                ],
                milestones: [
                    { title: "Consultation & Eligibility Audit", date: "Jan 12, 2026", status: "completed", note: "Confirmed UK 1-year Masters eligibility with 2-year Post-Study Work Visa." },
                    { title: "UK University Shortlisting", date: "Jan 22, 2026", status: "completed", note: "Selected Russell Group university." },
                    { title: "UCAS/Direct Application Submission", date: "Feb 28, 2026", status: "current", note: "Application under assessment by Birmingham Admissions Board." },
                    { title: "Offer Letter & Deposit Payment", date: "Expected Apr 2026", status: "upcoming", note: "Awaiting conditional/unconditional offer." }
                ]
            }
        ]
    };

    currentApplicationIndex = 0;

    // Reveal Demo Mode Banner
    const demoBanner = document.getElementById('demoBanner');
    if (demoBanner) {
        demoBanner.style.display = 'block';
    }

    renderDashboard();
}

// ── Global Clerk Sign-In Trigger ───────────────────────────
window.triggerClerkSignIn = function (e) {
    if (e) e.preventDefault();
    const clerkContainer = document.getElementById('clerk-sign-in-container');

    if (window.Clerk && window.Clerk.openSignIn) {
        try {
            window.Clerk.openSignIn();
            return;
        } catch (err) {
            console.log("Clerk openSignIn error:", err);
        }
    }

    if (window.Clerk && window.Clerk.redirectToSignIn) {
        try {
            window.Clerk.redirectToSignIn();
            return;
        } catch (err) {
            console.log("Clerk redirectToSignIn error:", err);
        }
    }

    if (clerkContainer && clerkContainer.children.length > 0) {
        clerkContainer.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Direct verified custom Account Portal fallback
    window.location.href = 'https://accounts.evoverseas.com/sign-in';
};

// ── Clerk Authentication Initializer ───────────────────────
async function initClerkAuth() {
    const customSignInBtn = document.getElementById('customGoogleBtn');
    if (customSignInBtn) {
        customSignInBtn.onclick = window.triggerClerkSignIn;
    }

    const initClerk = async () => {
        try {
            if (!window.Clerk) {
                console.warn('Clerk SDK script was not loaded properly.');
                return;
            }

            await window.Clerk.load();

            if (window.Clerk.user) {
                // Already logged in
                const user = window.Clerk.user;
                const primaryEmail = user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : '';
                currentUser = {
                    email: primaryEmail,
                    name: user.fullName || user.firstName || 'Student',
                    picture: user.imageUrl,
                    given_name: user.firstName || 'Student'
                };
                loadDashboard();
            } else {
                // Not logged in, try to mount the sign-in directly on the page
                const clerkContainer = document.getElementById('clerk-sign-in-container');
                if (clerkContainer && window.Clerk.mountSignIn) {
                    try {
                        clerkContainer.innerHTML = '';
                        window.Clerk.mountSignIn(clerkContainer);
                    } catch (e) {
                        console.error('Error mounting Clerk Sign-In info:', e);
                    }
                }
            }
        } catch (err) {
            console.error('Error initializing Clerk Auth:', err);
        }
    };

    if (document.readyState === 'complete') {
        initClerk();
    } else {
        window.addEventListener('load', initClerk);
    }
}

// ── Load Dashboard Data ────────────────────────────────────
async function loadDashboard() {
    showLoadingScreen();

    try {
        const url = `${APPS_SCRIPT_URL}?email=${encodeURIComponent(currentUser.email)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error) {
            showNotRegistered(data.message || data.error);
            return;
        }

        if (!data.success) {
            showNotRegistered(data.message || 'Unable to load your dashboard data.');
            return;
        }

        studentData = data;
        currentApplicationIndex = 0;
        renderDashboard();

    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Unable to connect to the server. Please check your internet connection and try again.');
    }
}

// ── SCREEN RENDERING ───────────────────────────────────────

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'none';
}

function showLoadingScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'flex';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'none';
}

function showDashboardScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'block';
    document.getElementById('errorScreen').style.display = 'none';
}

function showError(message) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'flex';
    document.getElementById('errorMessage').textContent = message;
}

function showNotRegistered(message) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'flex';
    document.getElementById('errorIcon').textContent = '🔒';
    document.getElementById('errorTitle').textContent = 'Account Not Found';
    document.getElementById('errorMessage').textContent = message ||
        'Your email is not registered with EV Overseas. Please contact us to get started on your study abroad journey.';
    document.getElementById('retryBtn').textContent = 'Contact EV Overseas';
    document.getElementById('retryBtn').onclick = function () {
        window.location.href = 'index.html#contact';
    };
}

// ── SIGN OUT ───────────────────────────────────────────────
async function signOut() {
    currentUser = null;
    studentData = null;
    currentApplicationIndex = 0;

    if (window.Clerk && window.Clerk.user) {
        try {
            await window.Clerk.signOut();
        } catch (e) {
            console.error('Clerk signOut error:', e);
        }
    }

    // Hide Demo Banner if visible
    const demoBanner = document.getElementById('demoBanner');
    if (demoBanner) {
        demoBanner.style.display = 'none';
    }

    // Destroy chart
    if (progressChart) {
        progressChart.destroy();
        progressChart = null;
    }

    showLoginScreen();
}

// ── RENDER DASHBOARD ───────────────────────────────────────
function renderDashboard() {
    const student = studentData.student;
    const applications = studentData.applications;

    // ── Welcome Header
    document.getElementById('welcomeName').textContent = `Welcome back, ${student.name || currentUser.given_name || 'Student'}!`;

    // User avatar
    const avatar = document.getElementById('userAvatar');
    if (currentUser.picture) {
        avatar.src = currentUser.picture;
        avatar.style.display = 'block';
    }

    // ── Render Application Selector
    renderApplicationSelector(applications);

    // ── Render the currently selected application
    displayApplication(currentApplicationIndex);

    // ── Counselor Card (same for all applications)
    renderCounselor(student);

    // Show dashboard
    showDashboardScreen();
}

// ── Application Selector ───────────────────────────────────
function renderApplicationSelector(applications) {
    const header = document.querySelector('.dashboard-header');

    // Check if selector already exists
    let selectorDiv = document.getElementById('applicationSelector');

    if (!selectorDiv) {
        selectorDiv = document.createElement('div');
        selectorDiv.id = 'applicationSelector';
        selectorDiv.className = 'application-selector';
        header.insertBefore(selectorDiv, header.firstChild);
    }

    if (applications.length === 1) {
        // Only one application - show as badge, no selector
        selectorDiv.innerHTML = `
            <div class="single-app-badge">
                <span class="app-badge-icon">🎓</span>
                <div class="app-badge-info">
                    <div class="app-badge-university">${applications[0].university}</div>
                    <div class="app-badge-meta">${applications[0].country} • ${applications[0].intake}</div>
                </div>
            </div>
        `;
    } else {
        // Multiple applications - show selector
        selectorDiv.innerHTML = `
            <label for="appSelector" class="app-selector-label">
                <span>📚</span> Select Application:
            </label>
            <select id="appSelector" class="app-selector-dropdown">
                ${applications.map((app, index) => `
                    <option value="${index}" ${index === currentApplicationIndex ? 'selected' : ''}>
                        ${app.university} - ${app.country} (${app.overallStatus})
                    </option>
                `).join('')}
            </select>
            <div class="app-selector-count">${applications.length} Applications</div>
        `;

        // Add event listener
        const selector = document.getElementById('appSelector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                currentApplicationIndex = parseInt(e.target.value);
                displayApplication(currentApplicationIndex);
            });
        }
    }
}

// ── Display Selected Application ──────────────────────────
function displayApplication(index) {
    const app = studentData.applications[index];
    const student = studentData.student;

    // Update welcome meta badges
    const metaHtml = [];
    if (app.university) metaHtml.push(`<span class="meta-badge">🎓 ${app.university}</span>`);
    if (app.country) metaHtml.push(`<span class="meta-badge">🌍 ${app.country}</span>`);
    if (app.intake) metaHtml.push(`<span class="meta-badge">📅 ${app.intake}</span>`);
    document.getElementById('welcomeMeta').innerHTML = metaHtml.join('');

    const currentStep = parseInt(app.currentStep) || 1;
    const totalSteps = 6;
    const progress = Math.round((currentStep / totalSteps) * 100);

    // ── Status Overview Cards
    renderStatusCards(app, currentStep, progress);

    // ── Progress Tracker
    renderProgressTracker(currentStep, app.milestones, progress);

    // ── Progress Chart
    renderProgressChart(currentStep, totalSteps);

    // ── Documents
    renderDocuments(app.documents);

    // ── Timeline
    renderTimeline(app.milestones, currentStep);
}

// ── Status Cards ───────────────────────────────────────────
function renderStatusCards(app, currentStep, progress) {
    const completedDocs = app.documents ? app.documents.filter(d =>
        d.status && (d.status.toLowerCase() === 'approved' || d.status.toLowerCase() === 'submitted')
    ).length : 0;

    const totalDocs = app.documents ? app.documents.length : 0;

    const container = document.getElementById('statusCards');
    container.innerHTML = `
        <div class="status-card fade-in stagger-1" style="--card-accent: var(--dash-accent);">
            <div class="status-card-icon">📊</div>
            <div class="status-card-label">Overall Progress</div>
            <div class="status-card-value">${progress}%</div>
        </div>
        <div class="status-card fade-in stagger-2" style="--card-accent: var(--dash-success);">
            <div class="status-card-icon">🎯</div>
            <div class="status-card-label">Current Step</div>
            <div class="status-card-value">Step ${currentStep} of 6</div>
        </div>
        <div class="status-card fade-in stagger-3" style="--card-accent: var(--dash-warning);">
            <div class="status-card-icon">📄</div>
            <div class="status-card-label">Documents</div>
            <div class="status-card-value">${completedDocs} / ${totalDocs}</div>
        </div>
        <div class="status-card fade-in stagger-4" style="--card-accent: ${getStatusColor(app.overallStatus)};">
            <div class="status-card-icon">${getStatusIcon(app.overallStatus)}</div>
            <div class="status-card-label">Status</div>
            <div class="status-card-value">
                <span class="badge badge-${getStatusBadgeClass(app.overallStatus)}">${app.overallStatus || 'Active'}</span>
            </div>
        </div>
    `;
}

// ── Progress Tracker ───────────────────────────────────────
function renderProgressTracker(currentStep, milestones, progress) {
    // Progress bar
    const fill = document.getElementById('progressFill');
    const percent = document.getElementById('progressPercent');
    setTimeout(() => {
        fill.style.width = `${progress}%`;
    }, 300);
    percent.textContent = `${progress}% Complete`;

    // Steps
    const stepsContainer = document.getElementById('stepsGrid');
    stepsContainer.innerHTML = JOURNEY_STEPS.map(step => {
        let status = 'pending';
        if (step.number < currentStep) status = 'completed';
        else if (step.number === currentStep) status = 'active';

        // Find milestone date
        const milestone = milestones ? milestones.find(m => parseInt(m.stepNumber) === step.number) : null;
        const dateStr = milestone && milestone.date ? formatDate(milestone.date) : '';

        return `
            <div class="step-item ${status}">
                <div class="step-circle">
                    ${status === 'completed' ? '✓' : step.number}
                </div>
                <div class="step-name">${step.name}</div>
                ${dateStr ? `<div class="step-date">${dateStr}</div>` : ''}
            </div>
        `;
    }).join('');
}

// ── Progress Chart ─────────────────────────────────────────
function renderProgressChart(currentStep, totalSteps) {
    const ctx = document.getElementById('progressChartCanvas');
    if (!ctx) return;

    // Destroy existing chart
    if (progressChart) {
        progressChart.destroy();
    }

    const completed = currentStep - 1;
    const inProgress = 1;
    const remaining = totalSteps - currentStep;

    progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'Remaining'],
            datasets: [{
                data: [completed, inProgress, remaining],
                backgroundColor: [
                    '#22C55E',
                    '#00B4D8',
                    '#1E293B'
                ],
                borderColor: [
                    'rgba(34, 197, 94, 0.3)',
                    'rgba(0, 180, 216, 0.3)',
                    'rgba(30, 41, 59, 0.5)'
                ],
                borderWidth: 2,
                hoverOffset: 6,
                borderRadius: 4,
                spacing: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '72%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#94A3B8',
                        padding: 16,
                        font: {
                            family: "'Open Sans', sans-serif",
                            size: 11
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#111D33',
                    titleColor: '#E2E8F0',
                    bodyColor: '#94A3B8',
                    borderColor: 'rgba(0, 180, 216, 0.2)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            }
        }
    });
}

// ── Documents ──────────────────────────────────────────────
function renderDocuments(documents) {
    const container = document.getElementById('documentsList');

    if (!documents || documents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📂</div>
                <p>No documents submitted yet. Your counselor will update this as your application progresses.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = documents.map(doc => {
        const statusClass = getDocStatusClass(doc.status);
        const icon = getDocIcon(doc.name);

        return `
            <div class="doc-item">
                <div class="doc-info">
                    <span class="doc-icon">${icon}</span>
                    <div>
                        <div class="doc-name">${doc.name}</div>
                        ${doc.submittedDate ? `<div class="doc-date">${formatDate(doc.submittedDate)}</div>` : ''}
                    </div>
                </div>
                <span class="badge badge-${statusClass}">${doc.status}</span>
            </div>
        `;
    }).join('');
}

// ── Timeline ───────────────────────────────────────────────
function renderTimeline(milestones, currentStep) {
    const container = document.getElementById('timelineContainer');

    // If no milestones, generate from journey steps
    const items = (milestones && milestones.length > 0) ? milestones : JOURNEY_STEPS.map(s => ({
        stepNumber: s.number,
        stepName: s.name,
        status: s.number < currentStep ? 'Completed' : (s.number === currentStep ? 'In Progress' : 'Pending'),
        date: '',
        notes: ''
    }));

    container.innerHTML = items.map(item => {
        const stepNum = parseInt(item.stepNumber) || 0;
        let status = 'pending';
        if (item.status && item.status.toLowerCase() === 'completed') status = 'completed';
        else if (item.status && item.status.toLowerCase() === 'in progress') status = 'active';
        else if (stepNum < currentStep) status = 'completed';
        else if (stepNum === currentStep) status = 'active';

        return `
            <div class="timeline-item ${status}">
                <div class="timeline-dot"></div>
                <div class="timeline-title">${item.stepName}</div>
                ${item.date ? `<div class="timeline-meta">📅 ${formatDate(item.date)}</div>` : ''}
                <span class="badge badge-${status === 'completed' ? 'approved' : (status === 'active' ? 'submitted' : 'pending')}" style="margin-top: 4px;">${item.status || (status === 'completed' ? 'Completed' : (status === 'active' ? 'In Progress' : 'Pending'))}</span>
                ${item.notes ? `<div class="timeline-notes">"${item.notes}"</div>` : ''}
            </div>
        `;
    }).join('');
}

// ── Counselor Card ─────────────────────────────────────────
function renderCounselor(student) {
    const container = document.getElementById('counselorContainer');

    const name = student.counselorName || 'Siddharth V.';
    const role = student.counselorRole || 'Senior Overseas Education Expert';
    const email = student.counselorEmail || 'siddharth@evoverseas.com';
    const phone = (student.counselorPhone || '+919666963756').toString();
    const initials = name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();

    const phoneDisplay = phone.replace(/[\s-]/g, '');
    // Format phone for WhatsApp (ensure it starts with country code, no + or spaces)
    const whatsappPhone = phoneDisplay.replace(/^\+/, '');

    container.innerHTML = `
        <div class="counselor-card">
            <div class="counselor-avatar">${initials}</div>
            <div class="counselor-info">
                <h3>${name}</h3>
                <p class="counselor-role"><i class="fas fa-certificate" style="color: #00B4D8;"></i> ${role}</p>
                <p style="font-size: 0.8rem; color: #64748B; margin-top: 4px;"><i class="fas fa-map-marker-alt" style="color: #FF6B00;"></i> Himayatnagar, Hyderabad</p>
            </div>
        </div>
        <div class="quick-actions">
            <a href="https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Hi, I'm checking my student portal and have a query about my study abroad application.")}" 
               class="action-btn action-btn-whatsapp" target="_blank" rel="noopener">
                <i class="fab fa-whatsapp"></i> Chat on WhatsApp
            </a>
            <a href="tel:${phoneDisplay}" class="action-btn action-btn-call">
                <i class="fas fa-phone-alt"></i> Direct Call
            </a>
        </div>
    `;
}

// ── UTILITY FUNCTIONS ──────────────────────────────────────

function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        let date;

        // Check if it's in dd-mm-yyyy format (e.g., "15-01-2026")
        if (typeof dateStr === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('-');
            // Create date as yyyy-mm-dd for proper parsing
            date = new Date(`${year}-${month}-${day}`);
        } else {
            date = new Date(dateStr);
        }

        if (isNaN(date.getTime())) return dateStr;

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

function getStatusColor(status) {
    if (!status) return 'var(--dash-success)';
    switch (status.toLowerCase()) {
        case 'active': return 'var(--dash-success)';
        case 'completed': return 'var(--dash-info)';
        case 'on hold': return 'var(--dash-warning)';
        case 'cancelled': return '#EF4444';
        default: return 'var(--dash-success)';
    }
}

function getStatusIcon(status) {
    if (!status) return '✅';
    switch (status.toLowerCase()) {
        case 'active': return '✅';
        case 'completed': return '🎉';
        case 'on hold': return '⏸️';
        case 'cancelled': return '❌';
        default: return '✅';
    }
}

function getStatusBadgeClass(status) {
    if (!status) return 'active';
    switch (status.toLowerCase()) {
        case 'active': return 'active';
        case 'completed': return 'completed';
        case 'on hold': return 'on-hold';
        case 'cancelled': return 'cancelled';
        default: return 'active';
    }
}

function getDocStatusClass(status) {
    if (!status) return 'pending';
    switch (status.toLowerCase()) {
        case 'submitted': return 'submitted';
        case 'approved': return 'approved';
        case 'pending': return 'pending';
        case 'under review': return 'review';
        default: return 'pending';
    }
}

function getDocIcon(docName) {
    if (!docName) return '📄';
    const name = docName.toLowerCase();
    if (name.includes('passport')) return '🛂';
    if (name.includes('sop') || name.includes('statement')) return '📝';
    if (name.includes('lor') || name.includes('recommendation')) return '📧';
    if (name.includes('transcript') || name.includes('marksheet')) return '📜';
    if (name.includes('resume') || name.includes('cv')) return '📋';
    if (name.includes('ielts') || name.includes('toefl') || name.includes('gre') || name.includes('gmat')) return '📊';
    if (name.includes('photo') || name.includes('image')) return '🖼️';
    if (name.includes('financial') || name.includes('bank') || name.includes('loan')) return '💰';
    if (name.includes('visa')) return '🛂';
    if (name.includes('offer') || name.includes('admission')) return '🎓';
    return '📄';
}
