// ============================================
// SANDESHAYA RESEARCH ANALYTICS ENGINE v2.0
// National Student Media Ethics Survey
// ============================================

const db = firebase.firestore();
let charts = {};
let allUsers = [];
let allResponses = [];
let currentPage = 1;
const USERS_PER_PAGE = 10;

// SANDESHAYA THEME PALETTE
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

const ANALYTICS_PALETTE = [
    '#3B82F6', '#6366F1', '#14B8A6', '#10B981',
    '#F59E0B', '#8B5CF6', '#06B6D4', '#F43F5E',
];

const MAROON_GRADIENT = ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'];

function getSmartColor(label, index) {
    return ANALYTICS_PALETTE[index % ANALYTICS_PALETTE.length];
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
        if (r.Q2_district) districts.add(r.Q2_district);
    });

    animateValue('total-users', total);

    const completionEl = document.getElementById('completion-rate');
    if (completionEl) completionEl.textContent = total ? Math.round((completed / total) * 100) + '%' : '0%';

    // Using 'provinces-count' ID for Districts now
    const districtsEl = document.getElementById('provinces-count');
    if (districtsEl) districtsEl.textContent = districts.size;

    const dropOffEl = document.getElementById('drop-off-rate');
    if (dropOffEl) dropOffEl.textContent = total ? Math.round((incomplete / total) * 100) + '%' : '0%';
}

// ============================================
// DEMOGRAPHICS CHARTS
// ============================================

function renderDemographics() {
    // District Distribution (Reuse provinceChart ID)
    const districtData = {};
    allResponses.forEach(r => {
        if (r.Q2_district) districtData[r.Q2_district] = (districtData[r.Q2_district] || 0) + 1;
    });
    createChart('provinceChart', 'bar', districtData, ANALYTICS_PALETTE);

    // School Type Distribution
    const schoolData = {};
    allResponses.forEach(r => {
        if (r.Q3_school_type) schoolData[r.Q3_school_type] = (schoolData[r.Q3_school_type] || 0) + 1;
    });
    createChart('schoolTypeChart', 'doughnut', schoolData, MAROON_GRADIENT);

    // Grade Distribution
    const gradeData = {};
    allResponses.forEach(r => {
        if (r.Q1_grade) gradeData[r.Q1_grade] = (gradeData[r.Q1_grade] || 0) + 1;
    });
    createChart('gradeChart', 'bar', gradeData, MAROON_GRADIENT);

    // Age Group Chart - REMOVED (Not in new schema)
    // We clear it to avoid stale data
    const ageCtx = document.getElementById('ageGroupChart');
    if (ageCtx && charts['ageGroupChart']) charts['ageGroupChart'].destroy();
}

// ============================================
// MEDIA CONSUMPTION CHARTS
// ============================================

function renderMediaConsumption() {
    // Primary Device
    const deviceData = {};
    allResponses.forEach(r => {
        if (r.Q4_primary_device) deviceData[r.Q4_primary_device] = (deviceData[r.Q4_primary_device] || 0) + 1;
    });
    createChart('deviceChart', 'doughnut', deviceData, ANALYTICS_PALETTE);

    // Media Hours
    const hoursData = {};
    allResponses.forEach(r => {
        if (r.Q6_media_hours) hoursData[r.Q6_media_hours] = (hoursData[r.Q6_media_hours] || 0) + 1;
    });
    createChart('hoursChart', 'bar', hoursData, MAROON_GRADIENT);

    // Legacy Media Sources & Platforms Charts - Cleared
    if (charts['mediaSourcesChart']) charts['mediaSourcesChart'].destroy();
    if (charts['socialPlatformsChart']) charts['socialPlatformsChart'].destroy();
}

// ============================================
// ETHICS AWARENESS CHARTS
// ============================================

function renderEthicsAwareness() {
    // Heard of Ethics
    const heardData = {};
    allResponses.forEach(r => {
        if (r.Q8_heard_ethics) heardData[r.Q8_heard_ethics] = (heardData[r.Q8_heard_ethics] || 0) + 1;
    });
    createChart('heardEthicsChart', 'pie', heardData, [THEME.colors.success, THEME.colors.danger, THEME.colors.warning]);

    // Ethics Level (replaces Importance)
    const levelData = {};
    allResponses.forEach(r => {
        if (r.Q10_ethics_level) levelData[r.Q10_ethics_level] = (levelData[r.Q10_ethics_level] || 0) + 1;
    });
    createChart('ethicsImportanceChart', 'doughnut', levelData, ANALYTICS_PALETTE);

    // Biggest Problem (Q30 is text, but maybe short text? No it is textarea. Let's try Q13 Problematic Platform)
    // Actually Q13 is radio. Q30 is textarea.
    // Let's use Q13 Problematic Platform for the 'biggestProblemChart' slot as it fits better visually
    const platformData = {};
    allResponses.forEach(r => {
        if (r.Q13_problematic_platform) platformData[r.Q13_problematic_platform] = (platformData[r.Q13_problematic_platform] || 0) + 1;
    });
    createChart('biggestProblemChart', 'bar', platformData, MAROON_GRADIENT);

    // Seen Unethical Content (Q11 Misleading / Q12 Unfair) - Let's use Misleading (Q11)
    const misleadingData = {};
    allResponses.forEach(r => {
        if (r.Q11_misleading_content) misleadingData[r.Q11_misleading_content] = (misleadingData[r.Q11_misleading_content] || 0) + 1;
    });
    createChart('seenUnethicalChart', 'doughnut', misleadingData, ANALYTICS_PALETTE);
}

// ============================================
// TRUST SECTION CHARTS
// ============================================

function renderTrustSection() {
    // Trust Level (Q15)
    const trustData = {};
    allResponses.forEach(r => {
        if (r.Q15_trust_level) trustData[r.Q15_trust_level] = (trustData[r.Q15_trust_level] || 0) + 1;
    });
    createChart('trustMediaChart', 'bar', trustData, MAROON_GRADIENT);

    // Unethical Impact Trust (Q16)
    const impactData = {};
    allResponses.forEach(r => {
        if (r.Q16_unethical_trust) impactData[r.Q16_unethical_trust] = (impactData[r.Q16_unethical_trust] || 0) + 1;
    });
    createChart('mediaInfluenceChart', 'doughnut', impactData, ANALYTICS_PALETTE);
}

// ============================================
// REGULATION SECTION CHARTS
// ============================================

function renderRegulationSection() {
    // Laws Adequate (Q20) - replaces Need Regulation
    const adequateData = {};
    allResponses.forEach(r => {
        if (r.Q20_laws_adequate) adequateData[r.Q20_laws_adequate] = (adequateData[r.Q20_laws_adequate] || 0) + 1;
    });
    createChart('needRegulationChart', 'doughnut', adequateData, [THEME.colors.success, THEME.colors.info, THEME.colors.warning]);

    // Who Responsible (Q22)
    const whoData = {};
    allResponses.forEach(r => {
        if (r.Q22_responsibility_who) whoData[r.Q22_responsibility_who] = (whoData[r.Q22_responsibility_who] || 0) + 1;
    });
    createChart('whoRegulateChart', 'pie', whoData, ANALYTICS_PALETTE);
}

// ============================================
// FUTURE VISION CHARTS
// ============================================

function renderFutureVision() {
    // Student Voice (Q28)
    const voiceData = {};
    allResponses.forEach(r => {
        if (r.Q28_student_voice) voiceData[r.Q28_student_voice] = (voiceData[r.Q28_student_voice] || 0) + 1;
    });
    createChart('youthRoleChart', 'doughnut', voiceData, [THEME.colors.success, THEME.colors.info, THEME.colors.danger]);

    // School Curriculum (Q29)
    const currData = {};
    allResponses.forEach(r => {
        if (r.Q29_school_curriculum) currData[r.Q29_school_curriculum] = (currData[r.Q29_school_curriculum] || 0) + 1;
    });
    createChart('wouldReportChart', 'pie', currData, [THEME.colors.success, THEME.colors.danger]);
}

// ============================================
// FUNNEL ANALYSIS
// ============================================

function renderFunnelAnalysis() {
    const sections = [
        { label: 'Started', count: allUsers.length },
        { label: 'Demographics', fields: ['Q1_grade', 'Q2_district'] },
        { label: 'Accessibility', fields: ['Q4_primary_device'] },
        { label: 'Awareness', fields: ['Q8_heard_ethics'] },
        { label: 'Regulation', fields: ['Q19_know_laws'] },
        { label: 'Student Voice', fields: ['Q28_student_voice'] },
        { label: 'Completed', count: allUsers.filter(u => u.submitted === true).length }
    ];

    const funnelData = sections.map(s => {
        if (s.count !== undefined) return s.count;
        return allResponses.filter(r => s.fields.every(f => r[f])).length;
    });

    const ctx = document.getElementById('funnelChart');
    if (charts.funnel) charts.funnel.destroy();

    if (!ctx) return;

    charts.funnel = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sections.map(s => s.label),
            datasets: [{
                label: 'Users Reached',
                data: funnelData,
                borderColor: THEME.colors.primary,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
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

    const backgroundColors = labels.map((l, i) =>
        Array.isArray(colors) ? colors[i % colors.length] : colors
    );

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

    const ind = document.getElementById('page-indicator');
    if (ind) ind.innerText = `Page ${currentPage} of ${totalPages}`;
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
    const thead = document.querySelector('.detailed-table thead tr');
    if (!tbody || !thead) return;

    // 1. DYNAMICALLY GENERATE TABLE HEADERS
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

        SURVEY_CODEBOOK.forEach(item => {
            const val = r[item.key];
            let displayVal = val;

            if (Array.isArray(val)) {
                displayVal = formatMulti(val);
            } else if (val === undefined || val === null || val === '') {
                displayVal = '<span style="color:var(--text-muted)">-</span>';
            }

            const isLongText = item.key.includes('comment') || item.key.includes('thoughts') || item.key.includes('suggestions') || item.key.includes('problem');
            const style = isLongText ? 'max-width:300px; white-space:normal; font-size:11px;' : '';

            row += `<td style="${style}">${displayVal}</td>`;
        });

        row += `</tr>`;
        return row;
    }).join('');

    tbody.innerHTML = rowsHTML;
    if (window.lucide) lucide.createIcons();
}

window.deleteResponse = async (id) => {
    if (confirm('Are you sure you want to delete this response?')) {
        try {
            await db.collection('responses').doc(id).delete();
            // Also update user status? Maybe. But let's just delete response for now.
            await db.collection('users').doc(id).update({
                submitted: false,
                submittedAt: null
            });
        } catch (e) {
            console.error(e);
            alert('Error deleting');
        }
    }
};

// ============================================
// DETAILED CHARTS
// ============================================

window.renderDetailedCharts = () => {
    const grid = document.getElementById('detailed-charts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Generate chart config from CODEBOOK for all applicable fields (Radio/Select/Checkbox)
    // We filter out text/comment fields
    const categoricalQuestions = SURVEY_CODEBOOK.filter(q => {
        // Simple heuristic: if it has 'comment', 'thoughts', 'suggestions', 'problem' (textarea) it's likely text
        // Exception: 'biggest_ethical_problem' is textarea but finite? No, it's textarea.
        const isText = q.key.includes('comment') || q.key.includes('suggestions') || q.key.includes('thoughts') || q.key.includes('problem') || q.key.includes('change') || q.key.includes('state');
        // grade, district etc are good.
        return !isText;
    });

    categoricalQuestions.forEach((q, idx) => {
        const counts = {};
        allResponses.forEach(r => {
            const val = r[q.key];
            if (!val) return;
            if (Array.isArray(val)) {
                val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
            } else {
                counts[val] = (counts[val] || 0) + 1;
            }
        });

        if (Object.keys(counts).length === 0) return;

        const div = document.createElement('div');
        div.className = 'chart-card';
        // Randomly assign chart type for variety
        const types = ['bar', 'doughnut', 'pie'];
        const type = types[idx % 3];

        div.innerHTML = `
            <div class="chart-header">
                <div class="chart-h-left"><span>${q.key.split('_')[0]}</span><h3>${q.label}</h3></div>
            </div>
            <div class="chart-container"><canvas id="detailed-chart-${q.key}"></canvas></div>
        `;
        grid.appendChild(div);

        setTimeout(() => {
            createChart(`detailed-chart-${q.key}`, type, counts, ANALYTICS_PALETTE);
        }, 0);
    });
}

// ============================================
// SURVEY CODEBOOK (UPDATED SCHEMA)
// ============================================

const SURVEY_CODEBOOK = [
    { key: 'Q1_grade', label: 'Grade', question: 'What grade are you in?' },
    { key: 'Q2_district', label: 'District', question: 'Which district are you from?' },
    { key: 'Q3_school_type', label: 'School Type', question: 'What type of school do you attend?' },
    { key: 'Q4_primary_device', label: 'Primary Device', question: 'Primary device for consuming media?' },
    { key: 'Q5_internet_access', label: 'Internet Access', question: 'How do you access the internet?' },
    { key: 'Q6_media_hours', label: 'Media Hours', question: 'Hours per day on media?' },
    { key: 'Q7_own_device', label: 'Own Device', question: 'Do you own your own device?' },
    { key: 'Q8_heard_ethics', label: 'Heard Ethics', question: 'Heard of media ethics?' },
    { key: 'Q9_ethics_meaning', label: 'Ethics Meaning', question: 'What does media ethics mean?', multi: true },
    { key: 'Q10_ethics_level', label: 'Ethics Level', question: 'Perception of ethical level?' },
    { key: 'Q11_misleading_content', label: 'Misleading Content', question: 'Seen misleading content?' },
    { key: 'Q11_misleading_content_comment', label: 'Misleading Cmt', question: 'Comment on misleading content' },
    { key: 'Q12_unfair_content', label: 'Unfair Content', question: 'Seen unfair content?' },
    { key: 'Q12_unfair_content_comment', label: 'Unfair Cmt', question: 'Comment on unfair content' },
    { key: 'Q13_problematic_platform', label: 'Problematic Platform', question: 'Platform with most issues?' },
    { key: 'Q14_ignored_ethics', label: 'Ignored Ethics', question: 'Perception of ignored ethics?' },
    { key: 'Q15_trust_level', label: 'Trust Level', question: 'Level of trust in media?' },
    { key: 'Q16_unethical_trust', label: 'Unethical Trust', question: 'Does unethical content affect trust?' },
    { key: 'Q17_unethical_impact_youth', label: 'Youth Impact', question: 'Impact on youth?' },
    { key: 'Q17_unethical_impact_youth_comment', label: 'Youth Impact Cmt', question: 'Comment on youth impact' },
    { key: 'Q18_question_authenticity', label: 'Question Authenticity', question: 'Do you question authenticity?' },
    { key: 'Q18_question_authenticity_comment', label: 'Authenticity Cmt', question: 'Comment on authenticity' },
    { key: 'Q19_know_laws', label: 'Know Laws', question: 'Knowledge of media laws?' },
    { key: 'Q20_laws_adequate', label: 'Laws Adequate', question: 'Are laws adequate?' },
    { key: 'Q20_laws_adequate_comment', label: 'Laws Adeq Cmt', question: 'Comment on laws adequacy' },
    { key: 'Q21_best_solution', label: 'Best Solution', question: 'Best solution for issues?' },
    { key: 'Q22_responsibility_who', label: 'Who Responsible', question: 'Who is responsible?' },
    { key: 'Q23_new_laws_suggestions', label: 'Law Suggestions', question: 'Suggestions for new laws' },
    { key: 'Q24_tv_ethics', label: 'TV Ethics', question: 'TV ethics rating' },
    { key: 'Q25_radio_ethics', label: 'Radio Ethics', question: 'Radio ethics rating' },
    { key: 'Q26_newspaper_ethics', label: 'Newspaper Ethics', question: 'Newspaper ethics rating' },
    { key: 'Q27_social_web_ethics', label: 'Social/Web Ethics', question: 'Social/Web ethics rating' },
    { key: 'Q28_student_voice', label: 'Student Voice', question: 'Importance of student voice' },
    { key: 'Q28_student_voice_comment', label: 'Student Voice Cmt', question: 'Comment on student voice' },
    { key: 'Q29_school_curriculum', label: 'Curriculum', question: 'Inclusion in curriculum' },
    { key: 'Q29_school_curriculum_comment', label: 'Curriculum Cmt', question: 'Comment on curriculum' },
    { key: 'Q30_biggest_ethical_problem', label: 'Biggest Problem', question: 'Biggest ethical problem' },
    { key: 'Q31_current_state', label: 'Current State', question: 'Opinion on current state' },
    { key: 'Q32_desired_change', label: 'Desired Change', question: 'Desired change' },
    { key: 'Q33_other_thoughts', label: 'Other Thoughts', question: 'Other thoughts' }
];

// Initialize
// document.addEventListener('DOMContentLoaded', loadAnalytics); 
// Note: DOMContentLoaded listener is separate or we call it inline?
// original app.js didn't have specific init call at bottom, but it seems it's loaded via script tag.
// We should probably ensure loadAnalytics is called.
// The previous file had: document.addEventListener('DOMContentLoaded', ... ) for search inputs
// but loadAnalytics() was likely called from HTML body onload or script.
// Let's add it to DOMContentLoaded to be safe.

document.addEventListener('DOMContentLoaded', () => {
    loadAnalytics();
});