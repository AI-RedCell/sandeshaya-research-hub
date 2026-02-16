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

const BRAND_COLORS = {
    'Facebook': '#1877F2',
    'Instagram': '#E4405F',
    'WhatsApp': '#25D366',
    'YouTube': '#FF0000',
    'TikTok': '#000000',
    'Twitter/X': '#1DA1F2',
    'Snapchat': '#FFFC00',
    'TV News': '#F97316',
    'Newspapers': '#64748B',
    'Websites': '#8B5CF6',
    'Radio': '#0EA5E9',
    'undefined': '#E2E8F0',
    'null': '#E2E8F0',
    '': '#E2E8F0'
};

const MAROON_GRADIENT = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

function getSmartColor(label, index) {
    if (!label || label === 'undefined' || label === 'null') return BRAND_COLORS['undefined'];
    if (BRAND_COLORS[label]) return BRAND_COLORS[label];
    // Fallback to palette cycle
    return ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];
}

// ============================================
// FIELD MAPPING (Backward Compatible)
// ============================================

// Map old field names to new Q# prefix fields
const FIELD_MAP = {
    'grade': 'Q1_grade',
    'district': 'Q2_district',
    'school_type': 'Q3_school_type',
    'primary_device': 'Q4_primary_device',
    'internet_access': 'Q5_internet_access',
    'media_hours': 'Q6_media_hours',
    'own_device': 'Q7_own_device',
    'heard_ethics': 'Q8_heard_ethics',
    'ethics_meaning': 'Q9_ethics_meaning',
    'ethics_level': 'Q10_ethics_level',
    'misleading_content': 'Q11_misleading_content',
    'unfair_content': 'Q12_unfair_content',
    'problematic_platform': 'Q13_problematic_platform',
    'ignored_ethics': 'Q14_ignored_ethics',
    'trust_level': 'Q15_trust_level',
    'unethical_trust': 'Q16_unethical_trust',
    'unethical_impact_youth': 'Q17_unethical_impact_youth',
    'question_authenticity': 'Q18_question_authenticity',
    'know_laws': 'Q19_know_laws',
    'laws_adequate': 'Q20_laws_adequate',
    'best_solution': 'Q21_best_solution',
    'responsibility_who': 'Q22_responsibility_who',
    'new_laws_suggestions': 'Q23_new_laws_suggestions',
    'tv_ethics': 'Q24_tv_ethics',
    'radio_ethics': 'Q25_radio_ethics',
    'newspaper_ethics': 'Q26_newspaper_ethics',
    'social_web_ethics': 'Q27_social_web_ethics',
    'student_voice': 'Q28_student_voice',
    'school_curriculum': 'Q29_school_curriculum',
    'biggest_ethical_problem': 'Q30_biggest_ethical_problem',
    'current_state': 'Q31_current_state',
    'desired_change': 'Q32_desired_change',
    'other_thoughts': 'Q33_other_thoughts'
};

// Helper: Get field value (supports both old and new schema)
function getField(response, fieldName) {
    // Try new Q# key first
    const newKey = FIELD_MAP[fieldName] || fieldName;
    if (response[newKey] !== undefined) return response[newKey];
    // Fall back to old key for backward compatibility
    if (response[fieldName] !== undefined) return response[fieldName];
    return undefined;
}

// ============================================
// DATA LOADING & PROCESSING
// ============================================

function loadAnalytics() {
    console.log("Connecting to Sandeshaya Firestore...");

    // Listen to Users collection
    db.collection('users').onSnapshot(snap => {
        allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        refreshDashboard();
    }, err => console.error("Users Listener Error:", err));

    // Listen to Responses collection
    db.collection('responses').onSnapshot(snap => {
        allResponses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        refreshDashboard();
    }, err => console.error("Responses Listener Error:", err));
}

// Debounced Refresh
let refreshTimeout;
function refreshDashboard() {
    if (refreshTimeout) clearTimeout(refreshTimeout);
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
        } catch (e) {
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

    // Unique districts from responses
    const districts = new Set();
    allResponses.forEach(r => {
        const district = getField(r, 'district');
        if (district) districts.add(district);
    });

    animateValue('total-users', total);
    document.getElementById('completion-rate').textContent = total ? Math.round((completed / total) * 100) + '%' : '0%';
    document.getElementById('districts-count').textContent = districts.size;
    document.getElementById('drop-off-rate').textContent = total ? Math.round((incomplete / total) * 100) + '%' : '0%';
}

// ============================================
// DEMOGRAPHICS CHARTS
// ============================================

function renderDemographics() {
    // District Distribution
    const districtData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'district');
        if (val) districtData[val] = (districtData[val] || 0) + 1;
    });
    createChart('districtChart', 'bar', districtData, ANALYTICS_PALETTE);

    // Grade Distribution
    const gradeData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'grade');
        if (val) gradeData[val] = (gradeData[val] || 0) + 1;
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
        const val = getField(r, 'primary_device');
        if (val) deviceData[val] = (deviceData[val] || 0) + 1;
    });
    createChart('deviceChart', 'doughnut', deviceData, ANALYTICS_PALETTE);

    // Media Hours
    const hoursData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'media_hours');
        if (val) hoursData[val] = (hoursData[val] || 0) + 1;
    });
    createChart('hoursChart', 'bar', hoursData, MAROON_GRADIENT);

    // Media Sources (multi-select)
    const sourcesData = {};
    allResponses.forEach(r => {
        if (r.media_sources) {
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
        if (r.social_platforms) {
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
        const val = getField(r, 'heard_ethics');
        if (val) heardData[val] = (heardData[val] || 0) + 1;
    });
    createChart('heardEthicsChart', 'pie', heardData, [THEME.colors.success, THEME.colors.danger, THEME.colors.warning]);

    // Ethics Importance
    const importanceData = {};
    allResponses.forEach(r => {
        if (r.ethics_important) importanceData[r.ethics_important] = (importanceData[r.ethics_important] || 0) + 1;
    });
    createChart('ethicsImportanceChart', 'doughnut', importanceData, ANALYTICS_PALETTE);

    // Biggest Problem
    const problemData = {};
    allResponses.forEach(r => {
        if (r.biggest_problem) problemData[r.biggest_problem] = (problemData[r.biggest_problem] || 0) + 1;
    });
    createChart('biggestProblemChart', 'bar', problemData, MAROON_GRADIENT);

    // Seen Unethical Content
    const seenData = {};
    allResponses.forEach(r => {
        if (r.seen_unethical) seenData[r.seen_unethical] = (seenData[r.seen_unethical] || 0) + 1;
    });
    createChart('seenUnethicalChart', 'doughnut', seenData, ANALYTICS_PALETTE);
}

// ============================================
// TRUST SECTION CHARTS
// ============================================

function renderTrustSection() {
    // Trust Level (Q15)
    const trustData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'trust_level');
        if (val) trustData[val] = (trustData[val] || 0) + 1;
    });
    createChart('trustMediaChart', 'bar', trustData, MAROON_GRADIENT);

    // Unethical Trust (Q16)
    const influenceData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'unethical_trust');
        if (val) influenceData[val] = (influenceData[val] || 0) + 1;
    });
    createChart('mediaInfluenceChart', 'doughnut', influenceData, ANALYTICS_PALETTE);
}

// ============================================
// REGULATION SECTION CHARTS
// ============================================

function renderRegulationSection() {
    // Know Laws (Q19)
    const needData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'know_laws');
        if (val) needData[val] = (needData[val] || 0) + 1;
    });
    createChart('needRegulationChart', 'doughnut', needData, [THEME.colors.success, THEME.colors.info, THEME.colors.warning, THEME.colors.danger]);

    // Who is Responsible (Q22)
    const whoData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'responsibility_who');
        if (val) whoData[val] = (whoData[val] || 0) + 1;
    });
    createChart('whoRegulateChart', 'pie', whoData, ANALYTICS_PALETTE);
}

// ============================================
// FUTURE VISION CHARTS
// ============================================

function renderFutureVision() {
    // Student Voice (Q28)
    const youthData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'student_voice');
        if (val) youthData[val] = (youthData[val] || 0) + 1;
    });
    createChart('youthRoleChart', 'doughnut', youthData, [THEME.colors.success, THEME.colors.info, THEME.colors.danger, THEME.colors.text]);

    // Current State (Q31)
    const reportData = {};
    allResponses.forEach(r => {
        const val = getField(r, 'current_state');
        if (val) reportData[val] = (reportData[val] || 0) + 1;
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
        { label: 'Section A (Demographics)', fields: ['grade', 'district'] },
        { label: 'Section B (Media)', fields: ['primary_device', 'media_hours'] },
        { label: 'Section C (Ethics)', fields: ['heard_ethics', 'ethics_important'] },
        { label: 'Section D (Issues)', fields: ['biggest_problem', 'verify_news'] },
        { label: 'Section E (Trust)', fields: ['trust_media', 'media_influence'] },
        { label: 'Section F (Regulation)', fields: ['need_regulation', 'who_regulate'] },
        { label: 'Completed', count: allUsers.filter(u => u.submitted === true).length }
    ];

    const funnelData = sections.map(s => {
        if (s.count !== undefined) return s.count;
        // Count users who have all fields in this section
        return allResponses.filter(r => s.fields.every(f => r[f])).length;
    });

    const ctx = document.getElementById('funnelChart');
    if (charts.funnel) charts.funnel.destroy();

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
    if (!ctx) return;
    if (charts[id]) charts[id].destroy();

    const labels = Object.keys(dataObj);
    const dataValues = Object.values(dataObj);

    // Generate Smart Colors if colors argument is generic palette,
    // OR if we want to enforce brand colors for specific charts.
    // We'll map colors based on labels.
    let backgroundColors;

    if (Array.isArray(colors) && colors === ANALYTICS_PALETTE) {
        // Use smart coloring
        backgroundColors = labels.map((l, i) => getSmartColor(l, i));
    } else {
        // Use provided gradient or specific palette
        // But still check for undefined/null labels to make them grey
        backgroundColors = Array.isArray(colors) ? colors : colors; // Should be array
        if (colors === MAROON_GRADIENT) {
            // For gradients, we might just keep them unless value is really weird? 
            // Actually, let's stick to gradient for distribution, but smart color is better for categories.
            // Let's keep gradient for things like "Age Group" (ordered), but use smart for "Social Platforms".
            // Implementation: If passed specific colors, use them. If passed ANALYTICS_PALETTE, use smart.
        } else {
            // Re-map for undefined even in gradients?
            // No, gradients imply order usually.
        }
    }

    // Force Smart Colors for known brand categories even if gradient passed?
    // Let's stick to the simpler logic: If we detect brand names, we override.
    const hasBrandNames = labels.some(l => BRAND_COLORS[l]);
    if (hasBrandNames) {
        backgroundColors = labels.map((l, i) => getSmartColor(l, i));
    } else {
        // Just handle undefined
        backgroundColors = labels.map((l, i) => {
            if (!l || l === 'undefined' || l === 'null') return BRAND_COLORS['undefined'];
            return (Array.isArray(colors) ? colors[i % colors.length] : colors);
        });
    }

    const config = {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors,
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
    if (!obj) return;
    if (typeof end === 'string') {
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
    if (!timestamp) return '--';
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
    if (!tbody) return;

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
    if (pg < 1) return;
    currentPage = pg;
    renderUsersTable();
}

// ============================================
// DETAILED DATA GRID
// ============================================

window.renderDetailedTable = () => {
    const tbody = document.getElementById('detailed-tbody');
    const thead = document.querySelector('.detailed-table thead tr'); // Get table header row
    if (!tbody || !thead) return;

    // 1. DYNAMICALLY GENERATE TABLE HEADERS
    // Keep the fixed columns (User, Email, Status, Time) and append dynamic question columns
    let headerHTML = `
        <th>Action</th>
        <th>User</th>
        <th>Email</th>
        <th>Status</th>
        <th>Submitted At</th>
    `;

    SURVEY_CODEBOOK.forEach(item => {
        headerHTML += `<th>${item.label}</th>`;
    });
    thead.innerHTML = headerHTML;


    // 2. GENERATE ROWS DYNAMICALLY
    const rowsHTML = allResponses.map(r => {
        const user = allUsers.find(u => u.id === r.id) || {};

        const formatMulti = (val) => {
            if (!val) return '<span style="color:var(--text-muted)">-</span>';
            if (Array.isArray(val)) return val.map(v => `<span class="tag">${v}</span>`).join(' ');
            return val;
        };

        // Fixed Columns
        let row = `
            <tr>
                <td>
                    <button class="btn-icon-danger" onclick="deleteResponse('${r.id}')" title="Delete Response">
                        <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
                    </button>
                </td>
                <td style="font-weight:600; color:var(--text-primary);">${user.displayName || user.name || '-'}</td>
                <td>${user.email || '-'}</td>
                <td><span class="status-check status-${user.submitted}">${user.submitted ? 'Done' : 'Pending'}</span></td>
                <td>${formatDate(user.submittedAt)}</td>
        `;

        // Dynamic Columns from Codebook
        SURVEY_CODEBOOK.forEach(item => {
            const val = getField(r, item.key);
            let displayVal = val;

            if (Array.isArray(val)) {
                displayVal = formatMulti(val);
            } else if (val === undefined || val === null || val === '') {
                displayVal = '<span style="color:var(--text-muted)">-</span>';
            }

            // Allow long text to wrap for comment fields
            const isLongText = item.key.includes('comment') || item.key.includes('thoughts') || item.key.includes('suggestions');
            const style = isLongText ? 'max-width:300px; white-space:normal; font-size:11px;' : '';

            row += `<td style="${style}">${displayVal}</td>`;
        });

        row += `</tr>`;
        return row;
    }).join('');

    tbody.innerHTML = rowsHTML;
    lucide.createIcons();
}

// ============================================
// DETAILED CHARTS
// ============================================

window.renderDetailedCharts = () => {
    const grid = document.getElementById('detailed-charts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // All 33 questions matching Survey.tsx structure with Q# prefix
    const questions = [
        // Section A - Demographics (Q1-Q3)
        { id: 'grade', title: 'Grade', type: 'bar' },
        { id: 'district', title: 'District', type: 'bar' },
        { id: 'school_type', title: 'School Type', type: 'doughnut' },
        // Section B - Media Access (Q4-Q7)
        { id: 'primary_device', title: 'Primary Device', type: 'doughnut' },
        { id: 'internet_access', title: 'Internet Access', type: 'bar' },
        { id: 'media_hours', title: 'Media Hours/Day', type: 'bar' },
        { id: 'own_device', title: 'Own Device', type: 'pie' },
        // Section C - Ethics Awareness (Q8-Q10)
        { id: 'heard_ethics', title: 'Heard of Media Ethics', type: 'pie' },
        { id: 'ethics_meaning', title: 'Ethics Meaning', type: 'bar', multi: true },
        { id: 'ethics_level', title: 'Media Ethics Level', type: 'doughnut' },
        // Section D - Experiences (Q11-Q14)
        { id: 'misleading_content', title: 'Seen Misleading Content', type: 'pie' },
        { id: 'unfair_content', title: 'Seen Unfair Content', type: 'pie' },
        { id: 'problematic_platform', title: 'Most Problematic Platform', type: 'doughnut' },
        { id: 'ignored_ethics', title: 'Ethics Violations Ignored', type: 'pie' },
        // Section E - Trust & Impact (Q15-Q18)
        { id: 'trust_level', title: 'Trust in Sri Lankan Media', type: 'bar' },
        { id: 'unethical_trust', title: 'Unethical Content Affects Trust', type: 'pie' },
        { id: 'unethical_impact_youth', title: 'Impact on Youth', type: 'pie' },
        { id: 'question_authenticity', title: 'Verify News Authenticity', type: 'doughnut' },
        // Section F - Laws & Solutions (Q19-Q23)
        { id: 'know_laws', title: 'Know Media Laws', type: 'pie' },
        { id: 'laws_adequate', title: 'Laws Adequate', type: 'pie' },
        { id: 'best_solution', title: 'Best Solution for Ethics', type: 'doughnut' },
        { id: 'responsibility_who', title: 'Who is Responsible', type: 'pie' },
        // Section G - Media Type Ethics Rating (Q24-Q27)
        { id: 'tv_ethics', title: 'TV Ethical Standards', type: 'bar' },
        { id: 'radio_ethics', title: 'Radio Ethical Standards', type: 'bar' },
        { id: 'newspaper_ethics', title: 'Newspaper Ethical Standards', type: 'bar' },
        { id: 'social_web_ethics', title: 'Social/Web Ethical Standards', type: 'bar' },
        // Section H - Final Thoughts (Q28-Q31)
        { id: 'student_voice', title: 'Should Students Have a Voice', type: 'pie' },
        { id: 'school_curriculum', title: 'Ethics in Curriculum', type: 'pie' },
        { id: 'current_state', title: 'Current State of Media Ethics', type: 'doughnut' }
    ];

    questions.forEach((q, idx) => {
        // Aggregate Data using getField for backward compatibility
        const counts = {};
        allResponses.forEach(r => {
            const val = getField(r, q.id);
            if (!val) return;
            if (q.multi && Array.isArray(val)) {
                val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
            } else {
                counts[val] = (counts[val] || 0) + 1;
            }
        });

        if (Object.keys(counts).length === 0) return;

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
// SURVEY QUESTIONS CODEBOOK (Matches Survey.tsx - 33 Questions)
// ============================================

const SURVEY_CODEBOOK = [
    // Section A - Demographics (Q1-Q3)
    { key: 'Q1_grade', label: 'Grade', question: 'What grade are you in?', options: ['Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'] },
    { key: 'Q2_district', label: 'District', question: 'Which district are you from?', options: null },
    { key: 'Q3_school_type', label: 'School Type', question: 'What type of school do you attend?', options: ['National School', 'Provincial Council Government School', 'Private / International School'] },

    // Section B - Media Access (Q4-Q7)
    { key: 'Q4_primary_device', label: 'Primary Device', question: 'Primary device for media', options: ['Smartphone', 'Tablet', 'Laptop / Computer', 'Television', 'No device access'] },
    { key: 'Q5_internet_access', label: 'Internet Access', question: 'How do you access internet?', options: ['Home Wi-Fi', 'Mobile Data', 'School Internet', 'Internet Café', 'Rarely use'] },
    { key: 'Q6_media_hours', label: 'Media Hours', question: 'Daily media consumption', options: ['Less than 1 hour', '1-3 hours', '3-5 hours', 'More than 5 hours'] },
    { key: 'Q7_own_device', label: 'Own Device', question: 'Do you own your device?', options: ['Yes', 'No', 'Shared with family'] },

    // Section C - Ethics Awareness (Q8-Q10)
    { key: 'Q8_heard_ethics', label: 'Heard Ethics', question: 'Have you heard of media ethics?', options: ['Yes', 'Slightly', 'No'] },
    { key: 'Q9_ethics_meaning', label: 'Ethics Meaning', question: 'What does media ethics mean?', options: ['Honest', 'Fair', 'Responsible', 'Not harming', 'Dont know'], multi: true },
    { key: 'Q10_ethics_level', label: 'Ethics Level', question: 'How ethical is Sri Lankan media?', options: ['Very ethical', 'Somewhat ethical', 'Not very ethical', 'Not at all ethical'] },

    // Section D - Experiences (Q11-Q14)
    { key: 'Q11_misleading_content', label: 'Misleading Content', question: 'Have you seen misleading content?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q11_misleading_content_comment', label: 'Misleading Comment', question: 'Comments on misleading content', options: null },
    { key: 'Q12_unfair_content', label: 'Unfair Content', question: 'Have you seen unfair content?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q12_unfair_content_comment', label: 'Unfair Comment', question: 'Comments on unfair content', options: null },
    { key: 'Q13_problematic_platform', label: 'Problematic Platform', question: 'Most problematic platform?', options: ['Television', 'Social Media/Web', 'Radio', 'Newspapers', 'Not sure'] },
    { key: 'Q14_ignored_ethics', label: 'Ignored Ethics', question: 'Seen ethics violations ignored?', options: ['Yes', 'No', 'Not sure'] },

    // Section E - Trust & Impact (Q15-Q18)
    { key: 'Q15_trust_level', label: 'Trust Level', question: 'Trust in Sri Lankan media', options: ['Very high', 'Some extent', 'Very low', 'Not at all'] },
    { key: 'Q16_unethical_trust', label: 'Unethical Trust', question: 'Does unethical content affect trust?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q17_unethical_impact_youth', label: 'Impact on Youth', question: 'Does unethical content impact youth?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q17_unethical_impact_youth_comment', label: 'Youth Impact Comment', question: 'Comments on youth impact', options: null },
    { key: 'Q18_question_authenticity', label: 'Question Authenticity', question: 'How often do you verify news?', options: ['Constantly', 'Sometimes', 'Very rarely', 'Never'] },
    { key: 'Q18_question_authenticity_comment', label: 'Authenticity Comment', question: 'Comments on verification', options: null },

    // Section F - Laws & Solutions (Q19-Q23)
    { key: 'Q19_know_laws', label: 'Know Laws', question: 'Do you know media laws?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q20_laws_adequate', label: 'Laws Adequate', question: 'Are current laws adequate?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q20_laws_adequate_comment', label: 'Laws Comment', question: 'Comments on laws', options: null },
    { key: 'Q21_best_solution', label: 'Best Solution', question: 'Best solution for ethics?', options: ['New laws', 'Improve existing laws', 'Better implementation', 'Self-regulation'] },
    { key: 'Q22_responsibility_who', label: 'Responsibility', question: 'Who is responsible?', options: ['Government', 'Media Orgs', 'Journalists', 'Social Media', 'Public'] },
    { key: 'Q23_new_laws_suggestions', label: 'Law Suggestions', question: 'Suggestions for new laws', options: null },

    // Section G - Media Type Ethics Rating (Q24-Q27)
    { key: 'Q24_tv_ethics', label: 'TV Ethics', question: 'TV ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'] },
    { key: 'Q25_radio_ethics', label: 'Radio Ethics', question: 'Radio ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'] },
    { key: 'Q26_newspaper_ethics', label: 'Newspaper Ethics', question: 'Newspaper ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'] },
    { key: 'Q27_social_web_ethics', label: 'Social/Web Ethics', question: 'Social media/web ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'] },

    // Section H - Final Thoughts (Q28-Q33)
    { key: 'Q28_student_voice', label: 'Student Voice', question: 'Should students have a voice?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q28_student_voice_comment', label: 'Voice Comment', question: 'Comments on student voice', options: null },
    { key: 'Q29_school_curriculum', label: 'School Curriculum', question: 'Should ethics be in curriculum?', options: ['Yes', 'No', 'Not sure'] },
    { key: 'Q29_school_curriculum_comment', label: 'Curriculum Comment', question: 'Comments on curriculum', options: null },
    { key: 'Q30_biggest_ethical_problem', label: 'Biggest Problem', question: 'Biggest ethical problem?', options: null },
    { key: 'Q31_current_state', label: 'Current State', question: 'Current state of media ethics', options: ['Improving', 'Getting worse', 'No change', 'Not sure'] },
    { key: 'Q32_desired_change', label: 'Desired Change', question: 'What change do you want?', options: null },
    { key: 'Q33_other_thoughts', label: 'Other Thoughts', question: 'Any other thoughts?', options: null }
];

// MULTI-SELECT FIELDS (for SPSS export)
const MULTI_SELECT_FIELDS = {
    'Q9_ethics_meaning': ['Honest', 'Fair', 'Responsible', 'Not harming', 'Dont know']
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
    let headers = ['Name', 'Email', 'Status', 'Submitted_At'];

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
                    const rawVal = getField(r, q.key);
                    const selected = Array.isArray(rawVal) ? rawVal : (rawVal ? [rawVal] : []);
                    MULTI_SELECT_FIELDS[q.key].forEach(opt => {
                        row[`${q.key}_${opt.replace(/[^a-zA-Z0-9]/g, '')}`] = selected.includes(opt) ? 1 : 0;
                    });
                } else {
                    row[q.key] = formatValue(getField(r, q.key));
                }
            });
        } else {
            SURVEY_CODEBOOK.forEach(q => {
                row[q.key] = formatValue(getField(r, q.key));
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
// DELETE FUNCTIONALITY
// ============================================

let pendingDeleteId = null;

window.deleteResponse = (userId) => {
    pendingDeleteId = userId;
    const modal = document.getElementById('delete-modal');
    const userIdDisplay = document.getElementById('delete-user-id');
    if (userIdDisplay) userIdDisplay.innerText = userId;
    if (modal) {
        modal.style.display = 'flex';
        // Re-init icons for the modal if needed
        if (window.lucide) window.lucide.createIcons();
    }
};

window.closeDeleteModal = () => {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.style.display = 'none';
    pendingDeleteId = null;
};

window.confirmDelete = async () => {
    if (!pendingDeleteId) return;

    const userId = pendingDeleteId;
    closeDeleteModal(); // Close immediately

    try {
        console.log(`Deleting response for ${userId}...`);

        // Delete from Responses Collection only
        // (User document is NOT updated to avoid permission issues with current rules)
        await db.collection('responses').doc(userId).delete();

        console.log('Delete successful');
        // No alert needed, dashboard refreshes automatically via listeners

    } catch (error) {
        console.error("Delete Error:", error);
        alert('Failed to delete response: ' + error.message);
    }
};



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
    const filename = `sandeshaya_survey_${new Date().toISOString().slice(0, 10)}.xlsx`;
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
    a.download = `sandeshaya_survey_${new Date().toISOString().slice(0, 10)}.csv`;
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