// =============================================
// SANDESHAYA SURVEY ENTRY - APP.JS
// Standalone survey form for manual data entry
// Matches Survey.tsx schema exactly (Q#_ prefix)
// =============================================

// Survey Structure - Matches Survey.tsx exactly
const surveyStructure = [
    {
        id: 'a',
        title: 'Section A - Demographics',
        questions: [
            { id: 'grade', type: 'radio', label: 'What grade are you in?', options: ['Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'], required: true },
            {
                id: 'district', type: 'select', label: 'Which district are you from?', options: [
                    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
                    'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Mullaitivu / Kilinochchi / Mannar / Vavuniya',
                    'Kurunegala', 'Matale', 'Matara', 'Monaragala', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee'
                ], required: true
            },
            { id: 'school_type', type: 'radio', label: 'What type of school do you attend?', options: ['National School', 'Provincial Council Government School', 'Private / International School'], required: true },
        ]
    },
    {
        id: 'b',
        title: 'Section B - Media Access',
        questions: [
            { id: 'primary_device', type: 'radio', label: 'Primary device for media', options: ['Smartphone', 'Tablet', 'Laptop / Computer', 'Television', 'No device access'], required: true },
            { id: 'internet_access', type: 'radio', label: 'How do you access internet?', options: ['Home Wi-Fi', 'Mobile Data', 'School Internet', 'Internet Café', 'Rarely use'], required: true },
            { id: 'media_hours', type: 'radio', label: 'Daily media consumption', options: ['Less than 1 hour', '1-3 hours', '3-5 hours', 'More than 5 hours'], required: true },
            { id: 'own_device', type: 'radio', label: 'Do you own your device?', options: ['Yes', 'No', 'Shared with family'], required: true },
        ]
    },
    {
        id: 'c',
        title: 'Section C - Ethics Awareness',
        questions: [
            { id: 'heard_ethics', type: 'radio', label: 'Have you heard of media ethics?', options: ['Yes', 'Slightly', 'No'], required: true },
            { id: 'ethics_meaning', type: 'checkbox', label: 'What does media ethics mean to you?', options: ['Honest', 'Fair', 'Responsible', 'Not harming', 'Dont know'], required: true },
            { id: 'ethics_level', type: 'radio', label: 'How ethical is Sri Lankan media?', options: ['Very ethical', 'Somewhat ethical', 'Not very ethical', 'Not at all ethical'], required: true },
        ]
    },
    {
        id: 'd',
        title: 'Section D - Experiences',
        questions: [
            { id: 'misleading_content', type: 'radio', label: 'Have you seen misleading content?', options: ['Yes', 'No', 'Not sure'], required: true, allowComment: true },
            { id: 'unfair_content', type: 'radio', label: 'Have you seen unfair content?', options: ['Yes', 'No', 'Not sure'], required: true, allowComment: true },
            { id: 'problematic_platform', type: 'radio', label: 'Most problematic platform?', options: ['Television', 'Social Media/Web', 'Radio', 'Newspapers', 'Not sure'], required: true },
            { id: 'ignored_ethics', type: 'radio', label: 'Seen ethics violations ignored?', options: ['Yes', 'No', 'Not sure'], required: true },
        ]
    },
    {
        id: 'e',
        title: 'Section E - Trust & Impact',
        questions: [
            { id: 'trust_level', type: 'radio', label: 'Trust in Sri Lankan media', options: ['Very high', 'Some extent', 'Very low', 'Not at all'], required: true },
            { id: 'unethical_trust', type: 'radio', label: 'Does unethical content affect trust?', options: ['Yes', 'No', 'Not sure'], required: true },
            { id: 'unethical_impact_youth', type: 'radio', label: 'Does unethical content impact youth?', options: ['Yes', 'No', 'Not sure'], required: true, allowComment: true },
            { id: 'question_authenticity', type: 'radio', label: 'How often do you verify news?', options: ['Constantly', 'Sometimes', 'Very rarely', 'Never'], required: true, allowComment: true },
        ]
    },
    {
        id: 'f',
        title: 'Section F - Laws & Solutions',
        questions: [
            { id: 'know_laws', type: 'radio', label: 'Do you know media laws?', options: ['Yes', 'No', 'Not sure'], required: true },
            { id: 'laws_adequate', type: 'radio', label: 'Are current laws adequate?', options: ['Yes', 'No', 'Not sure'], required: true, allowComment: true },
            { id: 'best_solution', type: 'radio', label: 'Best solution for ethics?', options: ['New laws', 'Improve existing laws', 'Better implementation', 'Self-regulation'], required: true },
            { id: 'responsibility_who', type: 'radio', label: 'Who is responsible?', options: ['Government', 'Media Orgs', 'Journalists', 'Social Media', 'Public'], required: true },
            { id: 'new_laws_suggestions', type: 'textarea', label: 'Suggestions for new laws', required: true },
        ]
    },
    {
        id: 'g',
        title: 'Section G - Media Type Ethics Rating',
        questions: [
            { id: 'tv_ethics', type: 'radio', label: 'TV ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'], required: true },
            { id: 'radio_ethics', type: 'radio', label: 'Radio ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'], required: true },
            { id: 'newspaper_ethics', type: 'radio', label: 'Newspaper ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'], required: true },
            { id: 'social_web_ethics', type: 'radio', label: 'Social media/web ethical standards', options: ['Very Good', 'Good', 'Neutral', 'Poor', 'Very Poor'], required: true },
        ]
    },
    {
        id: 'h',
        title: 'Section H - Final Thoughts',
        questions: [
            { id: 'student_voice', type: 'radio', label: 'Should students have a voice?', options: ['Yes', 'No', 'Not sure'], required: true, allowComment: true },
            { id: 'school_curriculum', type: 'radio', label: 'Should ethics be in curriculum?', options: ['Yes', 'No', 'Not sure'], required: true, allowComment: true },
            { id: 'biggest_ethical_problem', type: 'textarea', label: 'Biggest ethical problem?', required: true },
            { id: 'current_state', type: 'radio', label: 'Current state of media ethics', options: ['Improving', 'Getting worse', 'No change', 'Not sure'], required: true },
            { id: 'desired_change', type: 'textarea', label: 'What change do you want?', required: true },
            { id: 'other_thoughts', type: 'textarea', label: 'Any other thoughts?', required: false },
        ]
    },
];

// Responses object
let responses = {};

// Build flat questions list for global numbering
const allQuestions = surveyStructure.flatMap(s => s.questions);

// Get global question number
function getGlobalQuestionNumber(questionId) {
    return allQuestions.findIndex(q => q.id === questionId) + 1;
}

// =============================================
// PROBABILITY WEIGHTS - Based on Sri Lankan Research
// Source: Web research on youth media behavior in SL
// =============================================

const PROBABILITY_WEIGHTS = {
    // Q8: Heard of media ethics
    'heard_ethics': { 'Slightly': 45, 'Yes': 35, 'No': 20 },

    // Q9: Ethics meaning (checkbox - will pick 2-3)
    'ethics_meaning': { 'Honest': 40, 'Fair': 35, 'Responsible': 30, 'Not harming': 25, 'Dont know': 10 },

    // Q10: How ethical is Sri Lankan media
    'ethics_level': { 'Not very ethical': 40, 'Somewhat ethical': 35, 'Not at all ethical': 15, 'Very ethical': 10 },

    // Q11-Q12: Seen misleading/unfair content (91% encountered fake news)
    'misleading_content': { 'Yes': 60, 'Not sure': 25, 'No': 15 },
    'unfair_content': { 'Yes': 55, 'Not sure': 30, 'No': 15 },

    // Q13: Most problematic platform (social media is #1)
    'problematic_platform': { 'Social Media/Web': 55, 'Television': 20, 'Not sure': 15, 'Newspapers': 5, 'Radio': 5 },

    // Q14: Ethics violations ignored
    'ignored_ethics': { 'Yes': 50, 'Not sure': 35, 'No': 15 },

    // Q15: Trust level (only 28% trust online info)
    'trust_level': { 'Some extent': 40, 'Very low': 35, 'Not at all': 15, 'Very high': 10 },

    // Q16-Q17: Unethical content impacts
    'unethical_trust': { 'Yes': 65, 'Not sure': 25, 'No': 10 },
    'unethical_impact_youth': { 'Yes': 70, 'Not sure': 20, 'No': 10 },

    // Q18: How often verify news (69% share without verifying)
    'question_authenticity': { 'Sometimes': 45, 'Very rarely': 30, 'Never': 15, 'Constantly': 10 },

    // Q19: Know media laws
    'know_laws': { 'No': 50, 'Not sure': 35, 'Yes': 15 },

    // Q20: Laws adequate
    'laws_adequate': { 'Not sure': 45, 'No': 40, 'Yes': 15 },

    // Q21: Best solution
    'best_solution': { 'Better implementation': 35, 'Improve existing laws': 30, 'New laws': 20, 'Self-regulation': 15 },

    // Q22: Who is responsible
    'responsibility_who': { 'Government': 30, 'Media Orgs': 25, 'Journalists': 20, 'Social Media': 15, 'Public': 10 },

    // Q24-Q27: Media type ethics ratings (TV most trusted, social worst)
    'tv_ethics': { 'Good': 35, 'Neutral': 30, 'Poor': 20, 'Very Good': 10, 'Very Poor': 5 },
    'radio_ethics': { 'Good': 40, 'Neutral': 35, 'Poor': 15, 'Very Good': 8, 'Very Poor': 2 },
    'newspaper_ethics': { 'Good': 35, 'Neutral': 30, 'Poor': 25, 'Very Good': 5, 'Very Poor': 5 },
    'social_web_ethics': { 'Poor': 40, 'Very Poor': 25, 'Neutral': 20, 'Good': 10, 'Very Good': 5 },

    // Q28: Student voice (youth want involvement)
    'student_voice': { 'Yes': 75, 'Not sure': 18, 'No': 7 },

    // Q29: Ethics in curriculum
    'school_curriculum': { 'Yes': 80, 'Not sure': 15, 'No': 5 },

    // Q31: Current state of media ethics
    'current_state': { 'Getting worse': 45, 'No change': 30, 'Improving': 15, 'Not sure': 10 }
};

// Demographics weights for AUTO mode (Q1-Q7)
const DEMOGRAPHICS_WEIGHTS = {
    // Q1: Grade distribution
    'grade': { 'Grade 11': 30, 'Grade 12': 30, 'Grade 13': 25, 'Grade 10': 15 },

    // Q2: District distribution (population-weighted)
    'district': {
        'Colombo': 18, 'Gampaha': 15, 'Kandy': 12, 'Kalutara': 8, 'Galle': 7,
        'Kurunegala': 6, 'Ratnapura': 5, 'Matara': 5, 'Anuradhapura': 4, 'Badulla': 4,
        'Jaffna': 4, 'Kegalle': 3, 'Puttalam': 3, 'Hambantota': 2, 'Nuwara Eliya': 2,
        'Matale': 2, 'Ampara': 2, 'Batticaloa': 1, 'Polonnaruwa': 1, 'Monaragala': 1,
        'Trincomalee': 1, 'Mullaitivu / Kilinochchi / Mannar / Vavuniya': 1
    },

    // Q3: School type
    'school_type': { 'Provincial Council Government School': 45, 'National School': 40, 'Private / International School': 15 },

    // Q4: Primary device
    'primary_device': { 'Smartphone': 65, 'Laptop / Computer': 20, 'Television': 8, 'Tablet': 5, 'No device access': 2 },

    // Q5: Internet access
    'internet_access': { 'Mobile Data': 45, 'Home Wi-Fi': 35, 'School Internet': 12, 'Internet Café': 5, 'Rarely use': 3 },

    // Q6: Media hours
    'media_hours': { '1-3 hours': 40, '3-5 hours': 30, 'Less than 1 hour': 18, 'More than 5 hours': 12 },

    // Q7: Own device
    'own_device': { 'Yes': 55, 'Shared with family': 35, 'No': 10 }
};

// Combined weights for auto mode (all Q1-Q33)
const AUTO_PROBABILITY_WEIGHTS = { ...DEMOGRAPHICS_WEIGHTS, ...PROBABILITY_WEIGHTS };

// Sample text answers for textarea questions
const TEXT_SAMPLES = {
    'new_laws_suggestions': [
        'Stricter penalties for spreading fake news',
        'Better regulation of social media platforms',
        'Independent media regulatory body',
        'Mandatory fact-checking for news outlets',
        'Laws to protect journalists from harassment'
    ],
    'biggest_ethical_problem': [
        'Spreading of fake news and misinformation',
        'Political bias in TV channels',
        'Sensationalism over facts',
        'Invasion of privacy',
        'Hate speech on social media'
    ],
    'desired_change': [
        'More balanced and unbiased reporting',
        'Better fact-checking before publishing',
        'Respect for individual privacy',
        'Less political influence on media',
        'More positive news about Sri Lanka'
    ],
    'other_thoughts': [''] // Skip this optional field
};

// Weighted random selection
function weightedRandom(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [_, w]) => sum + w, 0);
    let random = Math.random() * total;

    for (const [option, weight] of entries) {
        random -= weight;
        if (random <= 0) return option;
    }
    return entries[0][0];
}

// Generate random answers for ALL questions Q1-Q33
function generateRandomAnswers() {
    // Determine which form we're working with
    const prefix = currentMode === 'auto' ? 'auto_' : '';
    const statusId = currentMode === 'auto' ? 'auto-status-message' : 'status-message';

    allQuestions.forEach((question, index) => {
        const qNum = index + 1;
        const fieldName = `${prefix}Q${qNum}_${question.id}`;

        // Handle textarea questions - use sample text
        if (question.type === 'textarea') {
            const samples = TEXT_SAMPLES[question.id];
            if (samples && samples.length > 0) {
                const textarea = document.querySelector(`[name="${fieldName}"]`);
                if (textarea) {
                    const randomText = samples[Math.floor(Math.random() * samples.length)];
                    textarea.value = randomText;
                }
            }
            return;
        }

        // Get weights from combined AUTO_PROBABILITY_WEIGHTS (includes Q1-Q7)
        const weights = AUTO_PROBABILITY_WEIGHTS[question.id];
        if (!weights) return;

        if (question.type === 'radio') {
            // Select one option based on weights
            const selectedValue = weightedRandom(weights);
            const radio = document.querySelector(`[name="${fieldName}"][value="${selectedValue}"]`);
            if (radio) {
                radio.checked = true;
                // Update visual selection
                document.querySelectorAll(`.option-item[data-field="${fieldName}"]`).forEach(el => {
                    el.classList.remove('selected');
                });
                const parentLabel = radio.closest('.option-item');
                if (parentLabel) parentLabel.classList.add('selected');

                // Show comment box if exists (but don't fill it)
                const commentBox = document.getElementById(`${fieldName}_comment_box`);
                if (commentBox) commentBox.style.display = 'block';
            }
        } else if (question.type === 'select') {
            // Handle select dropdown (Q2 District)
            const selectedValue = weightedRandom(weights);
            const select = document.querySelector(`[name="${fieldName}"]`);
            if (select) {
                select.value = selectedValue;
            }
        } else if (question.type === 'checkbox') {
            // For checkboxes (Q9), pick 2-3 options based on weights
            const numToSelect = Math.floor(Math.random() * 2) + 2; // 2 or 3
            const options = Object.keys(weights);
            const selected = [];

            // Don't select "Dont know" if selecting other options
            const availableOptions = options.filter(o => o !== 'Dont know');

            while (selected.length < numToSelect && availableOptions.length > 0) {
                const pick = weightedRandom(
                    Object.fromEntries(availableOptions.map(o => [o, weights[o]]))
                );
                if (!selected.includes(pick)) {
                    selected.push(pick);
                    // Remove from available to avoid re-selecting
                    const idx = availableOptions.indexOf(pick);
                    if (idx > -1) availableOptions.splice(idx, 1);
                }
            }

            // Apply selections
            selected.forEach(val => {
                const checkbox = document.querySelector(`[name="${fieldName}"][value="${val}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    const parentLabel = checkbox.closest('.option-item');
                    if (parentLabel) parentLabel.classList.add('selected');
                }
            });
        }
    });

    // Show status message
    const statusEl = document.getElementById(statusId);
    statusEl.textContent = '🎲 All answers generated (Q1-Q33)';
    statusEl.className = 'success';
}

// Render the survey form
function renderSurveyForm(formId = 'survey-form') {
    const form = document.getElementById(formId);
    if (!form) return;
    form.innerHTML = '';

    surveyStructure.forEach((section, sectionIndex) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section-card';
        sectionDiv.innerHTML = `
            <div class="section-header">
                <span class="section-badge">Section ${section.id.toUpperCase()}</span>
                <span class="section-title">${section.title.replace('Section ' + section.id.toUpperCase() + ' - ', '')}</span>
            </div>
        `;

        section.questions.forEach(question => {
            const qNum = getGlobalQuestionNumber(question.id);
            const qDiv = document.createElement('div');
            qDiv.className = 'question-group';
            // Use form-specific field names for auto mode
            const prefix = formId === 'auto-survey-form' ? 'auto_' : '';
            qDiv.innerHTML = `
                <label class="question-label">
                    <span class="question-number">Q${qNum}.</span>
                    ${question.label}
                    ${question.required ? '<span class="required">*</span>' : ''}
                </label>
                ${renderQuestionInput(question, qNum, prefix)}
            `;
            sectionDiv.appendChild(qDiv);
        });

        form.appendChild(sectionDiv);
    });
}

// Render question input based on type
function renderQuestionInput(question, qNum, prefix = '') {
    const fieldName = `${prefix}Q${qNum}_${question.id}`;

    switch (question.type) {
        case 'radio':
            return renderRadioOptions(question, fieldName);
        case 'checkbox':
            return renderCheckboxOptions(question, fieldName);
        case 'select':
            return renderSelectInput(question, fieldName);
        case 'text':
            return `<input type="text" class="text-input" name="${fieldName}" data-qid="${question.id}" maxlength="100">`;
        case 'textarea':
            return `<textarea class="textarea-input" name="${fieldName}" data-qid="${question.id}" rows="4" maxlength="1000" placeholder="Share your thoughts..."></textarea>`;
        default:
            return '';
    }
}

// Render radio options
function renderRadioOptions(question, fieldName) {
    let html = '<div class="options-list">';
    question.options.forEach((opt, idx) => {
        html += `
            <label class="option-item" data-field="${fieldName}" data-value="${opt}">
                <input type="radio" name="${fieldName}" value="${opt}" data-qid="${question.id}">
                <span>${opt}</span>
            </label>
        `;
    });
    html += '</div>';

    // Add comment box if allowed
    if (question.allowComment) {
        html += `
            <div class="comment-box" id="${fieldName}_comment_box" style="display:none;">
                <label>Optional comment:</label>
                <textarea name="${fieldName}_comment" data-qid="${question.id}_comment" placeholder="Add any additional details..."></textarea>
            </div>
        `;
    }

    return html;
}

// Render checkbox options
function renderCheckboxOptions(question, fieldName) {
    let html = '<div class="options-list">';
    question.options.forEach((opt, idx) => {
        html += `
            <label class="option-item" data-field="${fieldName}" data-value="${opt}">
                <input type="checkbox" name="${fieldName}" value="${opt}" data-qid="${question.id}">
                <span>${opt}</span>
            </label>
        `;
    });
    html += '</div>';
    return html;
}

// Render select input
function renderSelectInput(question, fieldName) {
    let html = `<select class="select-input" name="${fieldName}" data-qid="${question.id}">`;
    html += '<option value="">-- Select an option --</option>';
    question.options.forEach(opt => {
        html += `<option value="${opt}">${opt}</option>`;
    });
    html += '</select>';
    return html;
}

// Collect all responses from the form
function collectResponses(prefix = '') {
    const formData = {};

    // Process all questions
    allQuestions.forEach((question, index) => {
        const qNum = index + 1;
        const inputFieldName = `${prefix}Q${qNum}_${question.id}`;
        const outputFieldName = `Q${qNum}_${question.id}`; // Always store without prefix

        if (question.type === 'radio' || question.type === 'select' || question.type === 'text' || question.type === 'textarea') {
            const input = document.querySelector(`[name="${inputFieldName}"]`);
            if (question.type === 'radio') {
                const selected = document.querySelector(`[name="${inputFieldName}"]:checked`);
                if (selected) formData[outputFieldName] = selected.value;
            } else if (input) {
                formData[outputFieldName] = input.value;
            }
        } else if (question.type === 'checkbox') {
            const checkboxes = document.querySelectorAll(`[name="${inputFieldName}"]:checked`);
            const values = Array.from(checkboxes).map(cb => cb.value);
            if (values.length > 0) formData[outputFieldName] = values;
        }

        // Handle comment fields
        if (question.allowComment) {
            const commentField = document.querySelector(`[name="${inputFieldName}_comment"]`);
            if (commentField) {
                formData[`${outputFieldName}_comment`] = commentField.value || '';
            }
        }
    });

    return formData;
}

// Validate required fields
function validateForm() {
    const errors = [];

    allQuestions.forEach((question, index) => {
        if (!question.required) return;

        const qNum = index + 1;
        const fieldName = `Q${qNum}_${question.id}`;

        if (question.type === 'radio') {
            const selected = document.querySelector(`[name="${fieldName}"]:checked`);
            if (!selected) errors.push(`Q${qNum}: ${question.label}`);
        } else if (question.type === 'checkbox') {
            const checked = document.querySelectorAll(`[name="${fieldName}"]:checked`);
            if (checked.length === 0) errors.push(`Q${qNum}: ${question.label}`);
        } else if (question.type === 'select') {
            const input = document.querySelector(`[name="${fieldName}"]`);
            if (!input || !input.value) errors.push(`Q${qNum}: ${question.label}`);
        } else if (question.type === 'text' || question.type === 'textarea') {
            const input = document.querySelector(`[name="${fieldName}"]`);
            if (!input || !input.value.trim()) errors.push(`Q${qNum}: ${question.label}`);
        }
    });

    return errors;
}

// Submit response to Firebase
async function submitResponse() {
    const statusEl = document.getElementById('status-message');
    const submitBtn = document.getElementById('submit-btn');
    const uuid = document.getElementById('uuid-input').value.trim();

    // Validate UUID
    if (!uuid) {
        statusEl.textContent = '❌ Please enter a User UUID.';
        statusEl.className = 'error';
        return;
    }

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
        statusEl.innerHTML = `❌ Please answer all required questions:<br><small>${errors.slice(0, 5).join('<br>')}</small>${errors.length > 5 ? `<br><small>...and ${errors.length - 5} more</small>` : ''}`;
        statusEl.className = 'error';
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusEl.textContent = 'Saving to database...';
    statusEl.className = '';

    try {
        const formData = collectResponses();

        // Get timestamp - manual or server
        const timestampInput = document.getElementById('timestamp-input').value.trim();
        let submittedAt;

        if (timestampInput) {
            // Parse human-readable format: "February 3, 2026 at 4:53:58 PM UTC+5:30"
            try {
                const parsed = parseHumanTimestamp(timestampInput);
                submittedAt = firebase.firestore.Timestamp.fromDate(parsed);
            } catch (e) {
                statusEl.textContent = '❌ Invalid timestamp format. Use: February 3, 2026 at 4:53:58 PM UTC+5:30';
                statusEl.className = 'error';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Response';
                return;
            }
        } else {
            // Use server timestamp
            submittedAt = firebase.firestore.FieldValue.serverTimestamp();
        }

        // Add metadata
        formData.userId = uuid;
        formData.submittedAt = submittedAt;

        // Save to responses collection
        await db.collection('responses').doc(uuid).set(formData, { merge: true });

        // Update user submitted status
        await db.collection('users').doc(uuid).update({
            submitted: true,
            submittedAt: submittedAt
        });

        statusEl.innerHTML = `✅ Response saved successfully for UUID: <code>${uuid}</code>`;
        statusEl.className = 'success';

        // Reset form
        document.getElementById('survey-form').reset();
        document.getElementById('uuid-input').value = '';

        // Re-render to clear selections
        renderSurveyForm();
        attachEventListeners();

    } catch (error) {
        console.error('Submission error:', error);
        statusEl.textContent = `❌ Error: ${error.message}`;
        statusEl.className = 'error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Response';
    }
}

// Attach event listeners
function attachEventListeners() {
    // Option selection highlighting
    document.querySelectorAll('.option-item').forEach(item => {
        item.addEventListener('click', function (e) {
            const input = this.querySelector('input');
            const fieldName = this.dataset.field;

            if (input.type === 'radio') {
                // Deselect others in the same group
                document.querySelectorAll(`.option-item[data-field="${fieldName}"]`).forEach(el => {
                    el.classList.remove('selected');
                });
                this.classList.add('selected');

                // Show comment box if exists
                const commentBox = document.getElementById(`${fieldName}_comment_box`);
                if (commentBox) {
                    commentBox.style.display = 'block';
                }
            } else if (input.type === 'checkbox') {
                this.classList.toggle('selected', input.checked);
            }
        });
    });

    // Submit button
    document.getElementById('submit-btn').addEventListener('click', submitResponse);

    // Generate random answers button
    document.getElementById('generate-btn').addEventListener('click', generateRandomAnswers);
}

// Parse human-readable timestamp: "February 3, 2026 at 4:53:58 PM UTC+5:30"
function parseHumanTimestamp(str) {
    // Convert "February 3, 2026 at 4:53:58 PM UTC+5:30" to parseable format
    // Remove " at " and replace with space, handle timezone
    let cleaned = str.replace(' at ', ' ').replace('UTC', 'GMT');

    // Try parsing directly
    let date = new Date(cleaned);
    if (!isNaN(date.getTime())) return date;

    // Try alternative format without timezone
    const noTz = str.replace(' at ', ' ').replace(/UTC[+-][\d:]+/i, '').trim();
    date = new Date(noTz);
    if (!isNaN(date.getTime())) return date;

    throw new Error('Invalid date format');
}

// =============================================
// MODE SWITCHING
// =============================================

let currentMode = 'manual';

function setMode(mode) {
    currentMode = mode;

    // Update toggle buttons
    document.getElementById('mode-manual').classList.toggle('active', mode === 'manual');
    document.getElementById('mode-auto').classList.toggle('active', mode === 'auto');

    // Update description
    const desc = document.getElementById('mode-desc');
    if (mode === 'manual') {
        desc.textContent = 'Enter existing UUID and fill survey manually or generate answers';
    } else {
        desc.textContent = 'Auto-generates new UUID and creates user + response documents';
    }

    // Show/hide sections
    document.getElementById('manual-mode-section').style.display = mode === 'manual' ? 'block' : 'none';
    document.getElementById('auto-mode-section').style.display = mode === 'auto' ? 'block' : 'none';

    // Generate button always visible
    document.getElementById('generate-btn').style.display = 'block';
}

// =============================================
// FIREBASE-STYLE UUID GENERATION
// =============================================

function generateFirebaseUID() {
    // Firebase UIDs are 28 characters, base64-like alphanumeric
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < 28; i++) {
        uid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return uid;
}

// =============================================
// AUTO MODE - GENERATE ALL ANSWERS
// =============================================

function generateAllAnswers() {
    const formData = {};

    allQuestions.forEach((question, index) => {
        const qNum = index + 1;
        const fieldName = `Q${qNum}_${question.id}`;

        // Handle textarea questions
        if (question.type === 'textarea') {
            const samples = TEXT_SAMPLES[question.id];
            if (samples && samples.length > 0) {
                formData[fieldName] = samples[Math.floor(Math.random() * samples.length)];
            } else {
                formData[fieldName] = '';
            }
            return;
        }

        // Get weights (from combined AUTO_PROBABILITY_WEIGHTS)
        const weights = AUTO_PROBABILITY_WEIGHTS[question.id];
        if (!weights) return;

        if (question.type === 'radio' || question.type === 'select') {
            formData[fieldName] = weightedRandom(weights);
        } else if (question.type === 'checkbox') {
            // Pick 2-3 options
            const numToSelect = Math.floor(Math.random() * 2) + 2;
            const options = Object.keys(weights).filter(o => o !== 'Dont know');
            const selected = [];

            const availableOptions = [...options];
            while (selected.length < numToSelect && availableOptions.length > 0) {
                const pick = weightedRandom(
                    Object.fromEntries(availableOptions.map(o => [o, weights[o]]))
                );
                if (!selected.includes(pick)) {
                    selected.push(pick);
                    const idx = availableOptions.indexOf(pick);
                    if (idx > -1) availableOptions.splice(idx, 1);
                }
            }
            formData[fieldName] = selected;
        }

        // Add empty comment for questions that allow comments
        if (question.allowComment) {
            formData[`${fieldName}_comment`] = '';
        }
    });

    return formData;
}

// =============================================
// AUTO MODE - SUBMIT MOCK ENTRY
// =============================================

async function submitAutoMock() {
    const statusEl = document.getElementById('auto-status-message');
    const submitBtn = document.getElementById('auto-submit-btn');

    const email = document.getElementById('auto-email').value.trim();
    const name = document.getElementById('auto-name').value.trim();
    const timestampInput = document.getElementById('auto-timestamp').value.trim();

    // Validate
    if (!email) {
        statusEl.textContent = '❌ Please enter an email address.';
        statusEl.className = 'error';
        return;
    }

    if (!name) {
        statusEl.textContent = '❌ Please enter a display name.';
        statusEl.className = 'error';
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating...';
    statusEl.textContent = 'Creating mock entry...';
    statusEl.className = '';

    try {
        // Generate UUID
        const uuid = generateFirebaseUID();

        // Parse timestamp
        let submittedAt;
        let createdAt;

        if (timestampInput) {
            try {
                const parsed = parseHumanTimestamp(timestampInput);
                submittedAt = firebase.firestore.Timestamp.fromDate(parsed);
                // Created slightly before submitted
                createdAt = firebase.firestore.Timestamp.fromDate(new Date(parsed.getTime() - 60000));
            } catch (e) {
                statusEl.textContent = '❌ Invalid timestamp format.';
                statusEl.className = 'error';
                submitBtn.disabled = false;
                submitBtn.textContent = '🚀 Generate & Submit Mock Entry';
                return;
            }
        } else {
            submittedAt = firebase.firestore.FieldValue.serverTimestamp();
            createdAt = firebase.firestore.FieldValue.serverTimestamp();
        }

        // Collect survey data from auto form
        const surveyData = collectResponses('auto_');

        // Build user document
        const userData = {
            name: name,
            email: email,
            emailVerified: true,
            submitted: true,
            createdAt: createdAt,
            submittedAt: submittedAt
        };

        // Build response document
        const responseData = {
            userId: uuid,
            ...surveyData,
            submittedAt: submittedAt
        };

        // Save to users collection
        await db.collection('users').doc(uuid).set(userData);

        // Save to responses collection
        await db.collection('responses').doc(uuid).set(responseData);

        statusEl.innerHTML = `✅ Mock entry created!<br><code style="font-size: 0.8rem;">${uuid}</code>`;
        statusEl.className = 'success';

        // Clear user inputs
        document.getElementById('auto-email').value = '';
        document.getElementById('auto-name').value = '';
        document.getElementById('auto-timestamp').value = '';

        // Re-render auto form to clear selections
        renderSurveyForm('auto-survey-form');

    } catch (error) {
        console.error('Auto submit error:', error);
        statusEl.textContent = `❌ Error: ${error.message}`;
        statusEl.className = 'error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '🚀 Submit Mock Entry';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Render both survey forms
    renderSurveyForm('survey-form');
    renderSurveyForm('auto-survey-form');

    attachEventListeners();

    // Add auto-submit button listener
    document.getElementById('auto-submit-btn').addEventListener('click', submitAutoMock);
});
