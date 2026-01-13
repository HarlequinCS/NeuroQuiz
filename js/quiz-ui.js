/**
 * NeuroQuiz™ - Quiz UI Controller
 * Features: Custom Modals, Bloom Effects, Confetti, Emoji Rain, Button Transitions, Sliding Nav, Dynamic Visual Effects.
 */

class QuizUIController {
    constructor() {
        // DOM Elements
        this.elements = {
            quizContainer: document.getElementById('quiz-container'),
            questionCard: document.getElementById('question-card'),
            questionTitle: document.getElementById('question-title'),
            questionDescription: document.getElementById('question-description'),
            badgeText: document.getElementById('badge-text'),
            optionsContainer: document.getElementById('options-container'),
            progressBar: document.getElementById('progress-fill'),
            progressText: document.getElementById('question-counter'),
            scoreDisplay: document.getElementById('score-display'),
            submitBtn: document.getElementById('submit-btn'),
            nextBtn: document.getElementById('next-btn'),
            hintBtn: document.getElementById('hint-btn'),
            stopBtn: document.getElementById('stop-btn'),
            feedbackArea: document.getElementById('feedback-area'),
            loadingOverlay: document.getElementById('loading-overlay'),
            
            // --- GAMIFICATION ELEMENTS ---
            levelValue: document.getElementById('level-value'),
            streakValue: document.getElementById('streak-value'),
            pointsValue: document.getElementById('points-value'),
            
            // Icons for Visual Effects (Star, Fire, Diamond)
            levelIcon: document.getElementById('level-icon'),
            streakIcon: document.getElementById('streak-icon'),
            pointsIcon: document.getElementById('points-icon'),

            // --- MODAL ELEMENTS ---
            modalOverlay: document.getElementById('modal-overlay'),
            modalIcon: document.getElementById('modal-icon'),
            modalTitle: document.getElementById('modal-title'),
            modalMessage: document.getElementById('modal-message'),
            modalFooter: document.getElementById('modal-footer')
        };
        
        this.engine = null;
        this.selectedOption = null;
        this.isAnswered = false;
        this.currentQuestion = null;
        
        console.log('QuizUIController initialized');
    }
    
    async init() {
        this.showLoading();
        
        // Initialize Sliding Navigation
        this.setupNavigationMarker(); 
        
        try {
            const questionBank = await this.loadQuestionBank();
            const userSetup = await this.ensureUserSetup(questionBank);
            this.engine = new QuizEngine({ ...userSetup, questionBank });
            this.hideLoading();
            this.loadQuestion();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.showError('Failed to load quiz. Please refresh the page.');
        }
    }
    
    // --- Sliding Marker Logic ---
    setupNavigationMarker() {
        const navMenu = document.querySelector('.nav-menu');
        const marker = document.querySelector('.nav-marker');
        const links = document.querySelectorAll('.nav-link');

        if (!navMenu || !marker || !links.length) return;

        const moveMarker = (element) => {
            marker.style.width = `${element.offsetWidth}px`;
            marker.style.left = `${element.offsetLeft}px`;
            marker.style.opacity = '1';

            const color = element.getAttribute('data-color') || '#1cb0f6'; 
            marker.style.backgroundColor = color;
            marker.style.boxShadow = `0 4px 15px ${color}`; 
        };

        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            setTimeout(() => moveMarker(activeLink), 50); 
        }

        links.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                moveMarker(e.target); 
            });
        });

        navMenu.addEventListener('mouseleave', () => {
            if (activeLink) {
                moveMarker(activeLink); 
            } else {
                marker.style.opacity = '0'; 
            }
        });
    }

    setupEventListeners() {
        this.elements.optionsContainer.addEventListener('click', (e) => {
            const optionBtn = e.target.closest('.option-btn');
            if (optionBtn && !this.isAnswered) this.selectOption(optionBtn);
        });
        
        this.elements.submitBtn.addEventListener('click', () => {
            if (this.selectedOption !== null && !this.isAnswered) this.submitAnswer();
        });
        
        this.elements.nextBtn.addEventListener('click', () => {
            this.nextQuestion();
        });

        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', () => this.stopQuiz());
        }
        
        if (this.elements.hintBtn) {
            this.elements.hintBtn.addEventListener('click', () => this.showHint());
        }

        if (this.elements.modalOverlay) {
            this.elements.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.elements.modalOverlay) {
                    this.closeModal();
                }
            });
        }
    }
    
    loadQuestion() {
        const question = this.engine ? this.engine.getCurrentQuestion() : null;
        if (!question) {
            this.completeQuiz();
            return;
        }
        
        this.currentQuestion = question;
        this.elements.questionTitle.textContent = question.question;
        
        const progress = this.engine.getProgress();
        if (this.elements.badgeText) {
            this.elements.badgeText.textContent = `Q${Math.max(progress.current, 1)}`;
        }
        
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionBtn = this.createOptionButton(option, index);
            this.elements.optionsContainer.appendChild(optionBtn);
        });
        
        this.updateProgress();
        this.updateGamificationDisplay();
        
        this.selectedOption = null;
        this.isAnswered = false;
        
        this.elements.submitBtn.style.display = ''; 
        this.elements.submitBtn.classList.remove('hidden');
        this.elements.submitBtn.disabled = true;
        
        this.elements.nextBtn.style.display = 'none';
        this.elements.nextBtn.classList.remove('btn-enter');

        this.elements.feedbackArea.innerHTML = '';
        this.elements.feedbackArea.style.display = 'none';
    }
    
    createOptionButton(text, index) {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('data-option-id', index);
        btn.setAttribute('aria-label', `Option ${String.fromCharCode(65 + index)}`);
        
        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = String.fromCharCode(65 + index);
        
        const optionText = document.createElement('span');
        optionText.className = 'option-text';
        optionText.textContent = text;
        
        btn.appendChild(label);
        btn.appendChild(optionText);
        
        return btn;
    }
    
    selectOption(optionBtn) {
        const isAlreadySelected = optionBtn.classList.contains('selected');
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));

        if (isAlreadySelected) {
            this.selectedOption = null;
            this.elements.submitBtn.disabled = true;
        } else {
            optionBtn.classList.add('selected');
            this.selectedOption = parseInt(optionBtn.getAttribute('data-option-id'));
            this.elements.submitBtn.disabled = false;
        }
    }
    
    async submitAnswer() {
        if (this.selectedOption === null || this.isAnswered) return;
        
        const result = this.engine.submitAnswer(this.selectedOption);
        if (!result) {
            this.showError('No question available to submit.');
            return;
        }

        this.isAnswered = true;
        
        // --- VISUAL EFFECTS ---
        this.triggerScreenBloom(result.isCorrect); 
        if (result.isCorrect) {
            this.triggerConfetti();
        } else {
            this.triggerEmojiRain();
        }

        // --- BUTTON SWAP ---
        this.elements.submitBtn.style.display = 'none';
        
        const nextBtn = this.elements.nextBtn;
        nextBtn.classList.remove('hidden');
        nextBtn.style.display = 'flex';
        nextBtn.style.opacity = '1'; 
        
        nextBtn.classList.add('btn-enter');
        nextBtn.focus();

        setTimeout(() => {
            nextBtn.classList.remove('btn-enter');
        }, 600);
        
        this.showFeedback(result);
        this.highlightAnswers(result);
        this.playAudioFeedback(result.isCorrect);
        this.updateGamificationDisplay(); 
        this.updateProgress();
    }

    // ===========================================
    // GAMIFICATION & VISUAL EFFECTS LOGIC (Updated)
    // ===========================================

    updateGamificationDisplay() {
        if (!this.engine) return;
        const state = this.engine.getState();

        // 1. Update The Numbers
        if (this.elements.levelValue) this.elements.levelValue.textContent = state.currentLevel;
        if (this.elements.streakValue) this.elements.streakValue.textContent = state.streak;
        if (this.elements.pointsValue) this.elements.pointsValue.textContent = state.score;

        // 2. Apply Visual Effects (Glows, Colors, Animations)
        this.applyVisualEffects(this.elements.levelIcon, state.currentLevel, 'level');
        this.applyVisualEffects(this.elements.streakIcon, state.streak, 'streak');
        this.applyVisualEffects(this.elements.pointsIcon, state.score, 'points');
    }

    /**
     * Applies CSS classes based on Intensity
     */
    applyVisualEffects(element, value, type) {
        if (!element) return;

        // Reset to base class
        element.className = 'stat-icon'; 

        let tier = 1;

        // --- LEVEL LOGIC (1, 2, 3) ---
        if (type === 'level') {
            if (value >= 3) tier = 3;       // Legendary Spin
            else if (value === 2) tier = 2; // Gold Pulse
            else tier = 1;                  // Normal
            
            element.classList.add(`fx-level-${tier}`);
        }

        // --- STREAK LOGIC (Scales for 300 questions) ---
        else if (type === 'streak') {
            if (value >= 25) tier = 3;      // Blue Plasma (Godlike Streak)
            else if (value >= 10) tier = 2; // Red Blaze (Hot Streak)
            else if (value >= 3) tier = 1;  // Orange Lit (Warming Up)
            else tier = 0;                  // Unlit
            
            element.classList.add(`fx-streak-${tier}`);
        }

        // --- POINTS LOGIC (Scales for ~6000 max score) ---
        else if (type === 'points') {
            if (value >= 3000) tier = 4;    // Rainbow (Endgame)
            else if (value >= 1000) tier = 3;// Purple Radiance
            else if (value >= 200) tier = 2;// Cyan Shine
            else tier = 1;                  // Normal
            
            element.classList.add(`fx-points-${tier}`);
        }
    }
    
    // ===========================================
    // CUSTOM MODAL LOGIC
    // ===========================================

    openModal({ icon, title, message, primaryBtnText, secondaryBtnText, onPrimary, isDanger }) {
        if (!this.elements.modalOverlay) {
            console.warn('Modal elements missing! Fallback to alert.');
            alert(message);
            if (onPrimary) onPrimary();
            return;
        }

        const { modalOverlay, modalIcon, modalTitle, modalMessage, modalFooter } = this.elements;
        
        modalIcon.textContent = icon || 'ℹ️';
        modalTitle.textContent = title || 'Notice';
        modalMessage.textContent = message || '';
        
        modalFooter.innerHTML = '';

        if (secondaryBtnText) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn-modal btn-modal-secondary';
            cancelBtn.textContent = secondaryBtnText;
            cancelBtn.onclick = () => this.closeModal();
            modalFooter.appendChild(cancelBtn);
        }

        const confirmBtn = document.createElement('button');
        confirmBtn.className = isDanger ? 'btn-modal btn-modal-danger' : 'btn-modal btn-modal-primary';
        confirmBtn.textContent = primaryBtnText || 'OK';
        confirmBtn.onclick = () => {
            this.closeModal();
            if (onPrimary) onPrimary();
        };
        modalFooter.appendChild(confirmBtn);

        modalOverlay.classList.remove('hidden'); 
        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
        });
    }

    closeModal() {
        if (!this.elements.modalOverlay) return;
        this.elements.modalOverlay.classList.remove('active');
    }

    showHint() {
        this.openModal({
            icon: '💡',
            title: 'Hint',
            message: 'Read the question carefully and look for keywords!',
            primaryBtnText: 'Got it!',
            isDanger: false
        });
    }

    stopQuiz() {
        const state = this.engine ? this.engine.getState() : null;
        const answered = state ? state.totalAnswered : 0;
        
        const msg = answered > 0 
            ? `You have answered ${answered} questions. Your progress will be saved.`
            : 'You haven\'t answered any questions yet.';

        this.openModal({
            icon: '🛑',
            title: 'Stop Quiz?',
            message: `${msg} Are you sure you want to exit?`,
            primaryBtnText: 'Yes, Stop',
            secondaryBtnText: 'Cancel',
            isDanger: true,
            onPrimary: () => {
                console.log('[RB-ADA] quiz_stopped_by_user');
                this.completeQuiz();
            }
        });
    }

    // ===========================================
    // EFFECTS
    // ===========================================

    triggerScreenBloom(isCorrect) {
        const overlay = document.createElement('div');
        overlay.className = `bloom-overlay ${isCorrect ? 'bloom-correct' : 'bloom-wrong'}`;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 1000);
    }

    triggerConfetti() {
        const count = 80; 
        const shapes = ['🎉', '✨', '⭐', '🟢', '🌟', '🔥', '💯', '✅'];
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('fx-particle', 'anim-confetti');
            el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            el.style.left = `${Math.random() * 100}vw`;
            el.style.top = `${Math.random() * 100}vh`;
            el.style.fontSize = `${1.5 + Math.random() * 2}rem`;
            
            const angle = Math.random() * 360;
            const dist = 100 + Math.random() * 200;
            const tx = Math.cos(angle * Math.PI / 180) * dist;
            const ty = Math.sin(angle * Math.PI / 180) * dist;
            const rot = Math.random() * 720 - 360;

            el.style.setProperty('--tx', `${tx}px`);
            el.style.setProperty('--ty', `${ty}px`);
            el.style.setProperty('--rot', `${rot}deg`);
            
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1500);
        }
    }

    triggerEmojiRain() {
        const count = 60; 
        const shapes = ['😭', '❌', '💢', '⭕', '💥', '😡'];
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('fx-particle', 'anim-rain');
            el.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            el.style.left = `${Math.random() * 100}vw`;
            el.style.top = `-10vh`;
            el.style.fontSize = `${2 + Math.random() * 2}rem`; 
            el.style.animationDuration = `${2 + Math.random()}s`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }
    }
    
    showFeedback(result) {
        const container = this.elements.feedbackArea;
        const isCorrect = result.isCorrect;
        const icon = isCorrect ? '✔' : '✖';
        const title = isCorrect ? 'Correct!' : 'Incorrect';
        const styleClass = isCorrect ? 'correct' : 'incorrect';
        const feedbackText = result.feedback || (isCorrect ? "Well done!" : "Keep trying!");

        const html = `
            <div class="feedback-card ${styleClass}">
                <div class="feedback-header">
                    <div class="feedback-icon">${icon}</div>
                    <span>${title}</span>
                </div>
                <div class="feedback-body">
                    <div class="feedback-text">${feedbackText}</div>
                    ${result.pointsEarned > 0 ? `
                    <div class="points-badge">+${result.pointsEarned} Points</div>` : `
                    <div class="points-badge" style="opacity: 0.6">0 Points</div>`}
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    highlightAnswers(result) {
        const options = document.querySelectorAll('.option-btn');
        options.forEach((btn, index) => {
            btn.classList.remove('selected');
            if (index === result.correctAnswer) {
                btn.classList.add('correct'); 
                btn.style.boxShadow = "0 0 15px #2bde73";
                btn.style.borderColor = "#2bde73";
            } else if (index === this.selectedOption && !result.isCorrect) {
                btn.classList.add('wrong');
                btn.style.opacity = "0.7";
            } else {
                btn.style.opacity = "0.5";
            }
            btn.disabled = true;
        });
    }
    
    nextQuestion() {
        if (this.engine && this.engine.isComplete()) {
            this.completeQuiz();
            return;
        }

        const contentArea = this.elements.questionCard.querySelector('#question-content');
        const optionsArea = this.elements.optionsContainer;
        const feedbackArea = this.elements.feedbackArea;

        contentArea.classList.add('anim-exit');
        optionsArea.classList.add('anim-exit');
        
        if (feedbackArea.style.display !== 'none') {
            feedbackArea.children[0].classList.remove('incorrect', 'correct');
            feedbackArea.children[0].classList.add('anim-feedback-exit');
        }

        setTimeout(() => {
            this.loadQuestion();
            contentArea.classList.remove('anim-exit');
            optionsArea.classList.remove('anim-exit');
            contentArea.classList.add('anim-enter');
            optionsArea.classList.add('anim-enter');
            setTimeout(() => {
                contentArea.classList.remove('anim-enter');
                optionsArea.classList.remove('anim-enter');
            }, 400);
        }, 300);
    }
    
    completeQuiz() {
        if (this.engine) {
            const summary = this.engine.getPerformanceSummary();
            localStorage.setItem('quizResults', JSON.stringify(summary));
        }
        window.location.href = 'result.html';
    }
    
    updateProgress() {
        if (!this.engine) return;
        const progress = this.engine.getProgress();
        const state = this.engine.getState();
        const total = progress.total || 1;
        const answered = state.totalAnswered;
        const currentNumber = Math.min(answered + 1, total);
        const percent = Math.round((answered / total) * 100);
        
        if (this.elements.progressBar) this.elements.progressBar.style.width = `${percent}%`;
        if (this.elements.progressText) this.elements.progressText.textContent = `Question ${currentNumber} of ${total}`;
    }
    
    playAudioFeedback(isCorrect) {}
    
    showLoading() { if(this.elements.loadingOverlay) this.elements.loadingOverlay.setAttribute('aria-hidden', 'false'); }
    hideLoading() { if(this.elements.loadingOverlay) this.elements.loadingOverlay.setAttribute('aria-hidden', 'true'); }
    
    showError(message) {
        this.elements.feedbackArea.innerHTML = `<div class="feedback-card incorrect shake" style="padding:1rem;color:white;background:var(--game-red);">${message}</div>`;
        this.elements.feedbackArea.style.display = 'block';
    }

    loadUserSetup(validCategories = []) {
        const stored = localStorage.getItem('neuroquizUserSetup');
        let parsed = {};
        if (stored) { try { parsed = JSON.parse(stored) || {}; } catch (e) { parsed = {}; } }
        const fallbackCategory = validCategories.length ? validCategories[0] : ((window.QUESTION_BANK && window.QUESTION_BANK[0] && window.QUESTION_BANK[0].category) ? window.QUESTION_BANK[0].category : null);
        const normalizedCategory = validCategories.includes(parsed.category) ? parsed.category : fallbackCategory;
        return {
            level: this.normalizeLevel(parsed.level),
            category: normalizedCategory,
            literacyLevel: this.normalizeLiteracy(parsed.literacyLevel)
        };
    }

    async ensureUserSetup(questionBank) {
        const categories = Array.from(new Set((questionBank || []).map(q => q.category).filter(Boolean)));
        let setup = this.loadUserSetup(categories);
        if ((!setup.category && categories.length > 0) || !setup.level || !setup.literacyLevel) {
            console.log('[RB-ADA] user_setup_incomplete, redirecting to setup');
            window.location.href = 'setup.html';
            return null;
        }
        return setup;
    }

    normalizeLevel(level) { const num = parseInt(level, 10); return (Number.isInteger(num) && num >= 1 && num <= 3) ? num : 1; }

    normalizeLiteracy(lit) {
        const allowed = ['Beginner', 'Intermediate', 'Expert'];
        const lower = (lit || '').toString().toLowerCase();
        if (lower === 'beginner') return 'Beginner';
        if (lower === 'intermediate') return 'Intermediate';
        if (lower === 'expert') return 'Expert';
        return allowed.includes(lit) ? lit : 'Beginner';
    }

    async loadQuestionBank() {
        if (window.NEUROQUIZ_QUESTION_BANK && Array.isArray(window.NEUROQUIZ_QUESTION_BANK)) return window.NEUROQUIZ_QUESTION_BANK;
        const datasets = ['gk', 'literature', 'logic', 'math', 'stem'];
        const results = [];
        for (const name of datasets) {
            try {
                const resp = await fetch(`data/${name}.json`);
                if (!resp.ok) continue;
                const data = await resp.json();
                if (Array.isArray(data)) results.push(...data);
            } catch (e) { console.warn(`Failed to load dataset ${name}:`, e); }
        }
        if (results.length === 0 && Array.isArray(window.QUESTION_BANK)) {
            window.NEUROQUIZ_QUESTION_BANK = window.QUESTION_BANK;
            return window.NEUROQUIZ_QUESTION_BANK;
        }
        window.NEUROQUIZ_QUESTION_BANK = results;
        return window.NEUROQUIZ_QUESTION_BANK;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const quizUI = new QuizUIController();
    quizUI.init();
});