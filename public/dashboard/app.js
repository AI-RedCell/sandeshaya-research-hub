// ============================================
// SANDESHAYA RESEARCH ANALYTICS ENGINE v1.0
// National Student Media Ethics Survey
// ============================================

const db = firebase.firestore();
let charts = {};
let allUsers = [];
let allResponses = [];
let currentPage = 1;
const USERS_PER_PAGE = 10;

// SANDESHAYA ACADEMIC THEME PALETTE
// SANDESHAYA INDUSTRIAL THEME PALETTE
const THEME = {
  colors: {
    primary: '#2563EB',      // Blue 600
    secondary: '#475569',    // Slate 600
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    teal: '#14B8A6',
    text: '#64748B',         // Slate 500
    textLight: '#0F172A',    // Slate 900
    grid: '#E2E8F0',         // Slate 200
  },
  chartDefaults: {
    font: { family: "'Inter', sans-serif", size: 11 },
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4, borderWidth: 3 },
      bar: { borderRadius: 4, borderSkipped: false },
      point: { radius: 4, hitRadius: 10, hoverRadius: 6 }
    },
    plugins: {
      legend: { labels: { color: '#64748B', usePointStyle: true, boxWidth: 8, font: { weight: 500 } } },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F172A',
        bodyColor: '#64748B',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        titleFont: { weight: 600 },
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      }
    },
    scales: {
        x: { 
            grid: { display: false }, 
            ticks: { color: '#64748B' } 
        },
        y: { 
            grid: { color: '#E2E8F0', borderDash: [4, 4] }, 
            ticks: { color: '#64748B' } 
        }
    }
  }
};

// Color palettes for charts
// Industrial Blue Analytics Palette (No Maroon)
const ANALYTICS_PALETTE = [
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#F43F5E', // Rose
];

const MAROON_GRADIENT = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE']; // Replaced with Blue Gradient actually

// ============================================
// DATA LOADING & PROCESSING
// ============================================

function loadAnalytics() {
    console.log("Connecting to Sandeshaya Firestore...");
    
    // Listen to Users collection
    db.collection('users').onSnapshot(snap => {
        allUsers = snap.docs.map(d => ({id: d.id, ...d.data()}));
        refreshDashboard();
    }, err => console.error("Users Listener Error:", err));

    // Listen to Responses collection
    db.collection('responses').onSnapshot(snap => {
        allResponses = snap.docs.map(d => ({id: d.id, ...d.data()}));
        refreshDashboard();
    }, err => console.error("Responses Listener Error:", err));
}

// Debounced Refresh
let refreshTimeout;
function refreshDashboard() {
    if(refreshTimeout) clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
        console.log("Refreshing Sandeshaya Dashboard...");
        try {
            updateKPIs();
            renderDemographics();
            renderMediaConsumption();
            renderEthicsAwareness();
            renderTrustSection();
            renderRegulationSection();
            renderFutureVision();
            renderFunnelAnalysis();
            renderUsersTable();
            renderDetailedTable();
            renderDetailedCharts();
        } catch(e) {
            console.error("Render Error:", e);
        }
    }, 200);
}

// ============================================
// KPI CALCULATIONS
// ============================================

function updateKPIs() {
    const total = allUsers.length;
    const completed = allUsers.filter(u => u.submitted === true).length;
    const incomplete = total - completed;
    
    // Unique provinces from responses
    const provinces = new Set();
    allResponses.forEach(r => {
        if(r.province) provinces.add(r.province);
    });

    animateValue('total-users', total);
    document.getElementById('completion-rate').textContent = total ? Math.round((completed/total)*100) + '%' : '0%';
    document.getElementById('provinces-count').textContent = provinces.size;
    document.getElementById('drop-off-rate').textContent = total ? Math.round((incomplete/total)*100) + '%' : '0%';
}

// ============================================
// DEMOGRAPHICS CHARTS
// ============================================

function renderDemographics() {
    // Province Distribution
    const provinceData = {};
    allResponses.forEach(r => {
        if(r.province) provinceData[r.province] = (provinceData[r.province] || 0) + 1;
    });
    createChart('provinceChart', 'bar', provinceData, ANALYTICS_PALETTE);

    // School Type Distribution
    const schoolData = {};
    allResponses.forEach(r => {
        if(r.school_type) schoolData[r.school_type] = (schoolData[r.school_type] || 0) + 1;
    });
    createChart('schoolTypeChart', 'doughnut', schoolData, MAROON_GRADIENT);

    // Age Group Distribution
    const ageData = {};
    allResponses.forEach(r => {
        if(r.age_group) ageData[r.age_group] = (ageData[r.age_group] || 0) + 1;
    });
    createChart('ageGroupChart', 'pie', ageData, ANALYTICS_PALETTE);

    // Grade Distribution
    const gradeData = {};
    allResponses.forEach(r => {
        if(r.grade) gradeData[r.grade] = (gradeData[r.grade] || 0) + 1;
    });
    createChart('gradeChart', 'bar', gradeData, MAROON_GRADIENT);
}

// ============================================
// MEDIA CONSUMPTION CHARTS
// ============================================

function renderMediaConsumption() {
    // Primary Device
    const deviceData = {};
    allResponses.forEach(r => {
        if(r.primary_device) deviceData[r.primary_device] = (deviceData[r.primary_device] || 0) + 1;
    });
    createChart('deviceChart', 'doughnut', deviceData, ANALYTICS_PALETTE);

    // Media Hours
    const hoursData = {};
    allResponses.forEach(r => {
        if(r.media_hours) hoursData[r.media_hours] = (hoursData[r.media_hours] || 0) + 1;
    });
    createChart('hoursChart', 'bar', hoursData, MAROON_GRADIENT);

    // Media Sources (multi-select)
    const sourcesData = {};
    allResponses.forEach(r => {
        if(r.media_sources) {
            const sources = Array.isArray(r.media_sources) ? r.media_sources : [r.media_sources];
            sources.forEach(s => {
                sourcesData[s] = (sourcesData[s] || 0) + 1;
            });
        }
    });
    createChart('mediaSourcesChart', 'bar', sourcesData, ANALYTICS_PALETTE);

    // Social Platforms (multi-select)
    const platformsData = {};
    allResponses.forEach(r => {
        if(r.social_platforms) {
            const platforms = Array.isArray(r.social_platforms) ? r.social_platforms : [r.social_platforms];
            platforms.forEach(p => {
                platformsData[p] = (platformsData[p] || 0) + 1;
            });
        }
    });
    createChart('socialPlatformsChart', 'bar', platformsData, ANALYTICS_PALETTE);
}

// ============================================
// ETHICS AWARENESS CHARTS
// ============================================

function renderEthicsAwareness() {
    // Heard of Ethics
    const heardData = {};
    allResponses.forEach(r => {
        if(r.heard_ethics) heardData[r.heard_ethics] = (heardData[r.heard_ethics] || 0) + 1;
    });
    createChart('heardEthicsChart', 'pie', heardData, [THEME.colors.success, THEME.colors.danger, THEME.colors.warning]);

    // Ethics Importance
    const importanceData = {};
    allResponses.forEach(r => {
        if(r.ethics_important) importanceData[r.ethics_important] = (importanceData[r.ethics_important] || 0) + 1;
    });
    createChart('ethicsImportanceChart', 'doughnut', importanceData, ANALYTICS_PALETTE);

    // Biggest Problem
    const problemData = {};
    allResponses.forEach(r => {
        if(r.biggest_problem) problemData[r.biggest_problem] = (problemData[r.biggest_problem] || 0) + 1;
    });
    createChart('biggestProblemChart', 'bar', problemData, MAROON_GRADIENT);

    // Seen Unethical Content
    const seenData = {};
    allResponses.forEach(r => {
        if(r.seen_unethical) seenData[r.seen_unethical] = (seenData[r.seen_unethical] || 0) + 1;
    });
    createChart('seenUnethicalChart', 'doughnut', seenData, ANALYTICS_PALETTE);
}

// ============================================
// TRUST SECTION CHARTS
// ============================================

function renderTrustSection() {
    // Trust Media
    const trustData = {};
    allResponses.forEach(r => {
        if(r.trust_media) trustData[r.trust_media] = (trustData[r.trust_media] || 0) + 1;
    });
    createChart('trustMediaChart', 'bar', trustData, MAROON_GRADIENT);

    // Media Influence
    const influenceData = {};
    allResponses.forEach(r => {
        if(r.media_influence) influenceData[r.media_influence] = (influenceData[r.media_influence] || 0) + 1;
    });
    createChart('mediaInfluenceChart', 'doughnut', influenceData, ANALYTICS_PALETTE);
}

// ============================================
// REGULATION SECTION CHARTS
// ============================================

function renderRegulationSection() {
    // Need Regulation
    const needData = {};
    allResponses.forEach(r => {
        if(r.need_regulation) needData[r.need_regulation] = (needData[r.need_regulation] || 0) + 1;
    });
    createChart('needRegulationChart', 'doughnut', needData, [THEME.colors.success, THEME.colors.info, THEME.colors.warning, THEME.colors.danger]);

    // Who Should Regulate
    const whoData = {};
    allResponses.forEach(r => {
        if(r.who_regulate) whoData[r.who_regulate] = (whoData[r.who_regulate] || 0) + 1;
    });
    createChart('whoRegulateChart', 'pie', whoData, ANALYTICS_PALETTE);
}

// ============================================
// FUTURE VISION CHARTS
// ============================================

function renderFutureVision() {
    // Youth Role
    const youthData = {};
    allResponses.forEach(r => {
        if(r.youth_role) youthData[r.youth_role] = (youthData[r.youth_role] || 0) + 1;
    });
    createChart('youthRoleChart', 'doughnut', youthData, [THEME.colors.success, THEME.colors.info, THEME.colors.danger, THEME.colors.text]);

    // Would Report
    const reportData = {};
    allResponses.forEach(r => {
        if(r.would_report) reportData[r.would_report] = (reportData[r.would_report] || 0) + 1;
    });
    createChart('wouldReportChart', 'pie', reportData, [THEME.colors.success, THEME.colors.warning, THEME.colors.danger]);
}

// ============================================
// FUNNEL ANALYSIS
// ============================================

function renderFunnelAnalysis() {
    // Track how many users completed each section
    // Based on which fields are filled in responses
    const sections = [
        { label: 'Started', count: allUsers.length },
        { label: 'Section A (Demographics)', fields: ['age_group', 'grade', 'province'] },
        { label: 'Section B (Media)', fields: ['primary_device', 'media_hours'] },
        { label: 'Section C (Ethics)', fields: ['heard_ethics', 'ethics_important'] },
        { label: 'Section D (Issues)', fields: ['biggest_problem', 'verify_news'] },
        { label: 'Section E (Trust)', fields: ['trust_media', 'media_influence'] },
        { label: 'Section F (Regulation)', fields: ['need_regulation', 'who_regulate'] },
        { label: 'Completed', count: allUsers.filter(u => u.submitted === true).length }
    ];

    const funnelData = sections.map(s => {
        if(s.count !== undefined) return s.count;
        // Count users who have all fields in this section
        return allResponses.filter(r => s.fields.every(f => r[f])).length;
    });

    const ctx = document.getElementById('funnelChart');
    if(charts.funnel) charts.funnel.destroy();

    charts.funnel = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sections.map(s => s.label),
            datasets: [{
                label: 'Users Reached',
                data: funnelData,
                borderColor: THEME.colors.primary,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(139, 38, 53, 0.5)');
                    gradient.addColorStop(1, 'rgba(139, 38, 53, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...THEME.chartDefaults,
            scales: {
                y: { grid: { color: THEME.colors.grid }, ticks: { color: THEME.colors.text } },
                x: { grid: { display: false }, ticks: { color: THEME.colors.text } }
            }
        }
    });
}

// ============================================
// HELPER: GENERIC CHART CREATOR
// ============================================

function createChart(id, type, dataObj, colors) {
    const ctx = document.getElementById(id);
    if(!ctx) return;
    if(charts[id]) charts[id].destroy();

    const config = {
        type: type,
        data: {
            labels: Object.keys(dataObj),
            datasets: [{
                data: Object.values(dataObj),
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: THEME.chartDefaults
    };
    charts[id] = new Chart(ctx, config);
}

// ============================================
// UTILITIES
// ============================================

function animateValue(id, end) {
    const obj = document.getElementById(id);
    if(!obj) return;
    if(typeof end === 'string') {
        obj.innerHTML = end;
        return;
    }
    const start = 0;
    const duration = 1000;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

function formatDate(timestamp) {
    if(!timestamp) return '--';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
        return '--';
    }
}

// ============================================
// USERS TABLE (with Search & Filter)
// ============================================

function renderUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if(!tbody) return;
    
    // Get filter values
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const searchTerm = searchInput?.value?.toLowerCase() || '';
    const statusValue = statusFilter?.value || 'all';
    
    // Filter users
    let filteredUsers = [...allUsers];
    
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(u => 
            (u.email && u.email.toLowerCase().includes(searchTerm)) ||
            (u.displayName && u.displayName.toLowerCase().includes(searchTerm)) ||
            (u.name && u.name.toLowerCase().includes(searchTerm)) ||
            (u.id && u.id.toLowerCase().includes(searchTerm))
        );
    }
    
    if (statusValue !== 'all') {
        const isCompleted = statusValue === 'true';
        filteredUsers = filteredUsers.filter(u => u.submitted === isCompleted);
    }
    
    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = 1;
    
    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    const slice = filteredUsers.slice(start, end);
    
    tbody.innerHTML = slice.map(u => `
        <tr>
            <td style="font-family:monospace; color:var(--primary)">${u.id.substring(0, 12)}...</td>
            <td>${u.email || '--'}</td>
            <td>${u.displayName || u.name || '--'}</td>
            <td><span class="status-check status-${u.submitted}">${u.submitted ? 'Completed' : 'In Progress'}</span></td>
            <td>${formatDate(u.submittedAt)}</td>
        </tr>
    `).join('');
    
    document.getElementById('page-indicator').innerText = `Page ${currentPage} of ${totalPages}`;
}

// Attach search/filter event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderUsersTable();
        });
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentPage = 1;
            renderUsersTable();
        });
    }
});

window.changePage = (pg) => {
    if(pg < 1) return;
    currentPage = pg;
    renderUsersTable();
}

// ============================================
// DETAILED DATA GRID
// ============================================

window.renderDetailedTable = () => {
    const tbody = document.getElementById('detailed-tbody');
    if(!tbody) return;

    // Generate Rows
    const rowsHTML = allResponses.map(r => {
        const user = allUsers.find(u => u.id === r.id) || {};
        
        const formatMulti = (val) => {
            if(!val) return '<span style="color:var(--text-muted)">-</span>';
            if(Array.isArray(val)) return val.map(v => `<span class="tag">${v}</span>`).join(' ');
            return val;
        };

        return `
            <tr>
                <td style="font-family:monospace; color:var(--primary); font-weight:600;">${r.id.substring(0, 10)}...</td>
                <td><span class="status-check status-${user.submitted}">${user.submitted ? 'Done' : 'Pending'}</span></td>
                <td>${formatDate(user.submittedAt)}</td>
                <!-- Section A -->
                <td>${r.age_group || '-'}</td>
                <td>${r.grade || '-'}</td>
                <td>${r.province || '-'}</td>
                <td>${r.district || '-'}</td>
                <td>${r.school_type || '-'}</td>
                <!-- Section B -->
                <td>${r.primary_device || '-'}</td>
                <td>${r.media_hours || '-'}</td>
                <td>${formatMulti(r.media_sources)}</td>
                <td>${formatMulti(r.social_platforms)}</td>
                <!-- Section C -->
                <td>${r.heard_ethics || '-'}</td>
                <td>${formatMulti(r.ethics_meaning)}</td>
                <td>${r.learned_ethics || '-'}</td>
                <td>${r.ethics_important || '-'}</td>
                <!-- Section D -->
                <td>${r.biggest_problem || '-'}</td>
                <td>${r.seen_unethical || '-'}</td>
                <td>${r.affected_by_fake || '-'}</td>
                <td>${r.verify_news || '-'}</td>
                <!-- Section E -->
                <td>${r.trust_media || '-'}</td>
                <td>${r.trust_social || '-'}</td>
                <td>${r.media_influence || '-'}</td>
                <td>${r.responsible_media || '-'}</td>
                <!-- Section F -->
                <td>${r.know_regulations || '-'}</td>
                <td>${r.need_regulation || '-'}</td>
                <td>${r.who_regulate || '-'}</td>
                <!-- Section G -->
                <td>${formatMulti(r.media_better)}</td>
                <td>${r.youth_role || '-'}</td>
                <td>${r.would_report || '-'}</td>
                <td>${r.future_media || '-'}</td>
                <td style="max-width:300px; white-space:normal;">${r.additional_thoughts || '-'}</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rowsHTML;
}

// ============================================
// DETAILED CHARTS
// ============================================

window.renderDetailedCharts = () => {
    const grid = document.getElementById('detailed-charts-grid');
    if(!grid) return;
    grid.innerHTML = '';

    // All questions with their types
    const questions = [
        { id: 'age_group', title: 'Age Group', type: 'pie' },
        { id: 'grade', title: 'Grade', type: 'bar' },
        { id: 'province', title: 'Province', type: 'bar' },
        { id: 'school_type', title: 'School Type', type: 'doughnut' },
        { id: 'primary_device', title: 'Primary Device', type: 'doughnut' },
        { id: 'media_hours', title: 'Media Hours/Day', type: 'bar' },
        { id: 'media_sources', title: 'News Sources', type: 'bar', multi: true },
        { id: 'social_platforms', title: 'Social Platforms', type: 'bar', multi: true },
        { id: 'heard_ethics', title: 'Heard of Ethics', type: 'pie' },
        { id: 'ethics_meaning', title: 'Ethics Meaning', type: 'bar', multi: true },
        { id: 'learned_ethics', title: 'Where Learned', type: 'doughnut' },
        { id: 'ethics_important', title: 'Ethics Importance', type: 'doughnut' },
        { id: 'biggest_problem', title: 'Biggest Problem', type: 'bar' },
        { id: 'seen_unethical', title: 'Seen Unethical', type: 'doughnut' },
        { id: 'affected_by_fake', title: 'Affected by Fake News', type: 'pie' },
        { id: 'verify_news', title: 'Verify Before Sharing', type: 'doughnut' },
        { id: 'trust_media', title: 'Trust in Media', type: 'bar' },
        { id: 'trust_social', title: 'Trust Social vs Traditional', type: 'pie' },
        { id: 'media_influence', title: 'Media Influence', type: 'doughnut' },
        { id: 'responsible_media', title: 'Should Media Be More Responsible', type: 'doughnut' },
        { id: 'know_regulations', title: 'Know Regulations', type: 'pie' },
        { id: 'need_regulation', title: 'Need Stronger Regulation', type: 'doughnut' },
        { id: 'who_regulate', title: 'Who Should Regulate', type: 'pie' },
        { id: 'media_better', title: 'What Would Make Media Better', type: 'bar', multi: true },
        { id: 'youth_role', title: 'Youth Role in Ethics', type: 'doughnut' },
        { id: 'would_report', title: 'Would Report Unethical', type: 'pie' },
        { id: 'future_media', title: 'Most Trusted Professional', type: 'doughnut' }
    ];

    questions.forEach((q, idx) => {
        // Aggregate Data
        const counts = {};
        allResponses.forEach(r => {
            const val = r[q.id];
            if(!val) return;
            if(q.multi && Array.isArray(val)) {
                val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
            } else {
                counts[val] = (counts[val] || 0) + 1;
            }
        });

        if(Object.keys(counts).length === 0) return;

        // Create DOM Element
        const div = document.createElement('div');
        div.className = 'chart-card';
        div.innerHTML = `
            <div class="chart-header">
                <div class="chart-h-left"><span>Q${idx + 1}</span><h3>${q.title}</h3></div>
            </div>
            <div class="chart-container"><canvas id="detailed-chart-${q.id}"></canvas></div>
        `;
        grid.appendChild(div);

        // Render Chart
        setTimeout(() => {
            createChart(`detailed-chart-${q.id}`, q.type, counts, ANALYTICS_PALETTE);
        }, 0);
    });
}

// ============================================
// SURVEY QUESTIONS CODEBOOK
// ============================================

const SURVEY_CODEBOOK = [
    { key: 'age_group', label: 'Age Group', question: 'What is your age group?', options: ['Under 12', '12-14', '14-16', '16-18', 'Over 18'] },
    { key: 'grade', label: 'Grade', question: 'What grade are you in?', options: ['Grade 6-8', 'Grade 9-11', 'A/L'] },
    { key: 'province', label: 'Province', question: 'Which province are you from?', options: null },
    { key: 'district', label: 'District', question: 'Which district are you from?', options: null },
    { key: 'school_type', label: 'School Type', question: 'What type of school do you attend?', options: ['Government', 'Private', 'International', 'Other'] },
    { key: 'primary_device', label: 'Primary Device', question: 'What is your primary device for consuming media?', options: ['Smartphone', 'Tablet', 'Laptop', 'Desktop', 'TV', 'Other'] },
    { key: 'media_hours', label: 'Media Hours', question: 'How many hours per day do you spend on media?', options: ['Less than 1 hour', '1-2 hours', '2-4 hours', '4-6 hours', 'More than 6 hours'] },
    { key: 'media_sources', label: 'Media Sources', question: 'What are your primary sources of news?', options: ['TV News', 'Newspapers', 'Social Media', 'Websites', 'Radio', 'Friends/Family'], multi: true },
    { key: 'social_platforms', label: 'Social Platforms', question: 'Which social media platforms do you use?', options: ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Twitter/X', 'Snapchat', 'Other'], multi: true },
    { key: 'heard_ethics', label: 'Heard Ethics', question: 'Have you heard of media ethics?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'ethics_meaning', label: 'Ethics Meaning', question: 'What does media ethics mean to you?', options: null, multi: true },
    { key: 'learned_ethics', label: 'Learned Ethics', question: 'Have you learned about media ethics in school?', options: ['Yes', 'No'] },
    { key: 'ethics_important', label: 'Ethics Important', question: 'Do you think media ethics is important?', options: ['Very Important', 'Somewhat Important', 'Not Important', 'Not sure'] },
    { key: 'biggest_problem', label: 'Biggest Problem', question: 'What is the biggest ethical problem in Sri Lankan media?', options: ['Fake news', 'Bias', 'Sensationalism', 'Privacy violations', 'Hate speech', 'Other'] },
    { key: 'seen_unethical', label: 'Seen Unethical', question: 'Have you seen unethical content in media?', options: ['Yes, often', 'Yes, sometimes', 'Rarely', 'Never'] },
    { key: 'affected_by_fake', label: 'Affected by Fake', question: 'Have you been affected by fake news?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'verify_news', label: 'Verify News', question: 'Do you verify news before sharing?', options: ['Always', 'Sometimes', 'Rarely', 'Never'] },
    { key: 'trust_media', label: 'Trust Media', question: 'How much do you trust Sri Lankan media?', options: ['Fully trust', 'Somewhat trust', 'Neutral', 'Somewhat distrust', 'Fully distrust'] },
    { key: 'trust_social', label: 'Trust Social', question: 'How much do you trust social media news?', options: ['Fully trust', 'Somewhat trust', 'Neutral', 'Somewhat distrust', 'Fully distrust'] },
    { key: 'media_influence', label: 'Media Influence', question: 'How much does media influence your opinions?', options: ['A lot', 'Somewhat', 'Very little', 'Not at all'] },
    { key: 'responsible_media', label: 'Responsible Media', question: 'Do you think media is responsible for shaping society?', options: ['Yes', 'No', 'Partially'] },
    { key: 'know_regulations', label: 'Know Regulations', question: 'Do you know about media regulations in Sri Lanka?', options: ['Yes', 'No', 'Somewhat'] },
    { key: 'need_regulation', label: 'Need Regulation', question: 'Do you think stronger regulations are needed?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'who_regulate', label: 'Who Regulate', question: 'Who should regulate media?', options: ['Government', 'Independent body', 'Media itself', 'Public', 'No regulation needed'] },
    { key: 'media_better', label: 'Media Better', question: 'How can media be made better?', options: null, multi: true },
    { key: 'youth_role', label: 'Youth Role', question: 'Should youth have a say in media ethics?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'would_report', label: 'Would Report', question: 'Would you report unethical content?', options: ['Yes', 'No', 'Maybe'] },
    { key: 'future_media', label: 'Future Media', question: 'What is your vision for future media?', options: null },
    { key: 'additional_thoughts', label: 'Additional Thoughts', question: 'Any additional thoughts?', options: null }
];

// Multi-select fields for SPSS binary splitting
const MULTI_SELECT_FIELDS = {
    media_sources: ['TV News', 'Newspapers', 'Social Media', 'Websites', 'Radio', 'Friends/Family', 'Other'],
    social_platforms: ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Twitter/X', 'Snapchat', 'Other']
};

// ============================================
// EXPORT MODAL FUNCTIONS
// ============================================

window.openExportModal = () => {
    document.getElementById('export-modal').style.display = 'flex';
};

window.closeExportModal = () => {
    document.getElementById('export-modal').style.display = 'none';
};

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

window.runExport = () => {
    const format = document.getElementById('export-format').value;
    const scope = document.getElementById('export-scope').value;
    const spssMode = document.getElementById('export-spss-mode').checked;
    const includeCodebook = document.getElementById('export-codebook').checked;
    
    console.log(`Export: format=${format}, scope=${scope}, spss=${spssMode}, codebook=${includeCodebook}`);
    
    if (!allResponses || allResponses.length === 0) {
        alert("No data available to export.");
        return;
    }
    
    // Filter responses by scope
    let responses = [...allResponses];
    if (scope === 'completed') {
        responses = responses.filter(r => {
            const user = allUsers.find(u => u.id === r.id);
            return user && user.submitted === true;
        });
    } else if (scope === 'incomplete') {
        responses = responses.filter(r => {
            const user = allUsers.find(u => u.id === r.id);
            return !user || user.submitted !== true;
        });
    }
    
    if (responses.length === 0) {
        alert(`No ${scope} responses found.`);
        return;
    }
    
    // Build headers
    let headers = ['User_ID', 'Email', 'Name', 'Status', 'Submitted_At'];
    
    if (spssMode) {
        // Add binary columns for multi-select
        SURVEY_CODEBOOK.forEach(q => {
            if (MULTI_SELECT_FIELDS[q.key]) {
                MULTI_SELECT_FIELDS[q.key].forEach(opt => {
                    headers.push(`${q.key}_${opt.replace(/[^a-zA-Z0-9]/g, '')}`);
                });
            } else {
                headers.push(q.key);
            }
        });
    } else {
        SURVEY_CODEBOOK.forEach(q => headers.push(q.key));
    }
    
    // Build rows
    const rows = responses.map(r => {
        const user = allUsers.find(u => u.id === r.id) || {};
        let row = {
            'User_ID': r.id,
            'Email': user.email || '',
            'Name': user.displayName || user.name || '',
            'Status': user.submitted ? 'Completed' : 'In Progress',
            'Submitted_At': user.submittedAt ? formatDate(user.submittedAt) : ''
        };
        
        if (spssMode) {
            SURVEY_CODEBOOK.forEach(q => {
                if (MULTI_SELECT_FIELDS[q.key]) {
                    const selected = Array.isArray(r[q.key]) ? r[q.key] : (r[q.key] ? [r[q.key]] : []);
                    MULTI_SELECT_FIELDS[q.key].forEach(opt => {
                        row[`${q.key}_${opt.replace(/[^a-zA-Z0-9]/g, '')}`] = selected.includes(opt) ? 1 : 0;
                    });
                } else {
                    row[q.key] = formatValue(r[q.key]);
                }
            });
        } else {
            SURVEY_CODEBOOK.forEach(q => {
                row[q.key] = formatValue(r[q.key]);
            });
        }
        return row;
    });
    
    // Close modal
    closeExportModal();
    
    // Export
    if (format === 'xlsx') {
        exportXLSX(headers, rows, includeCodebook);
    } else {
        exportCSV(headers, rows);
    }
};

function formatValue(val) {
    if (val === undefined || val === null) return '';
    if (Array.isArray(val)) return val.join(' | ');
    return String(val);
}

// ============================================
// XLSX EXPORT (with SheetJS)
// ============================================

function exportXLSX(headers, rows, includeCodebook) {
    const wb = XLSX.utils.book_new();
    
    // Data Sheet
    const wsData = rows.map(r => headers.map(h => r[h] ?? ''));
    wsData.unshift(headers);
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Column widths
    ws['!cols'] = headers.map((h, i) => ({
        wch: Math.max(h.length, 15)
    }));
    
    XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');
    
    // Codebook Sheet
    if (includeCodebook) {
        const codebookData = [['Column Name', 'Label', 'Question Text', 'Options']];
        SURVEY_CODEBOOK.forEach(q => {
            codebookData.push([
                q.key,
                q.label,
                q.question,
                q.options ? q.options.join('; ') : 'Free text'
            ]);
        });
        const wsCodebook = XLSX.utils.aoa_to_sheet(codebookData);
        wsCodebook['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 50 }, { wch: 40 }];
        XLSX.utils.book_append_sheet(wb, wsCodebook, 'Codebook');
    }
    
    // Download
    const filename = `sandeshaya_survey_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    console.log(`Exported ${rows.length} rows to ${filename}`);
}

// ============================================
// CSV EXPORT (fallback)
// ============================================

function exportCSV(headers, rows) {
    const csvRows = rows.map(r => {
        return headers.map(h => {
            let val = String(r[h] ?? '');
            val = val.replace(/"/g, '""');
            val = val.replace(/(\r\n|\n|\r)/gm, ' ');
            return `"${val}"`;
        }).join(',');
    });
    
    const quotedHeaders = headers.map(h => `"${h}"`).join(',');
    const csvContent = '\uFEFF' + [quotedHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sandeshaya_survey_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log(`Exported ${rows.length} rows to CSV`);
}

// Auto-load data on start
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Sandeshaya Research Dashboard...");
    loadAnalytics();
});