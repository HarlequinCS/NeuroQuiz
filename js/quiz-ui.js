/**
 * NeuroQuiz™ - Quiz UI Controller
 * 
 * UI Team: This file connects HTML elements to the quiz engine.
 * You can modify UI interactions, animations, and display logic here.
 * 
 * IMPORTANT: 
 * - Do not modify core logic (that's in engine.js)
 * - Call engine methods to get data and process answers
 * - Handle all DOM manipulation and user interactions here
 */

/**
 * QuizUIController Class
 * Manages all UI interactions for the quiz page
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
            levelValue: document.getElementById('level-value'),
            streakValue: document.getElementById('streak-value'),
            pointsValue: document.getElementById('points-value')
        };
        
        // Quiz Engine Instance
        this.engine = null;
        
        // UI State
        this.selectedOption = null;
        this.isAnswered = false;
        this.currentQuestion = null;
        
        console.log('QuizUIController initialized');
    }
    
    /**
     * Initialize the quiz UI
     */
    async init() {
        // Show loading
        this.showLoading();
        
        try {
            const questionBank = await this.loadQuestionBank();
            const userSetup = await this.ensureUserSetup(questionBank);
            this.engine = new QuizEngine({ ...userSetup, questionBank });
            this.hideLoading();
            
            this.displayUserName(userSetup.name);
            this.loadQuestion();
            
            // Setup event listeners
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.showError('Failed to load quiz. Please refresh the page.');
        }
    }
    
    displayUserName(name) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && name) {
            userNameElement.textContent = name;
        }
    }
    
    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Option button clicks
        this.elements.optionsContainer.addEventListener('click', (e) => {
            const optionBtn = e.target.closest('.option-btn');
            if (optionBtn && !this.isAnswered) {
                this.selectOption(optionBtn);
            }
        });
        
        // Submit button
        this.elements.submitBtn.addEventListener('click', () => {
            if (this.selectedOption !== null && !this.isAnswered) {
                this.submitAnswer();
            }
        });
        
        // Next button
        this.elements.nextBtn.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Stop button
        this.elements.stopBtn.addEventListener('click', () => {
            this.stopQuiz();
        });
        
        // Hint button (optional feature)
        this.elements.hintBtn.addEventListener('click', () => {
            this.showHint();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    /**
     * Load and display current question
     */
    loadQuestion() {
        const question = this.engine ? this.engine.getCurrentQuestion() : null;
        if (!question) {
            this.completeQuiz();
            return;
        }
        
        this.currentQuestion = question;
        this.elements.questionTitle.textContent = question.question;
        this.elements.questionDescription.textContent = question.category ? `Category: ${question.category}` : '';
        
        const progress = this.engine.getProgress();
        if (this.elements.badgeText) {
            this.elements.badgeText.textContent = `Q${Math.max(progress.current, 1)}`;
        }
        
        // Clear and populate options
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionBtn = this.createOptionButton(option, index);
            this.elements.optionsContainer.appendChild(optionBtn);
        });
        
        // Update progress
        this.updateProgress();
        
        // Update gamification stats
        this.updateGamificationDisplay();
        
        // Reset UI state
        this.selectedOption = null;
        this.isAnswered = false;
        this.elements.submitBtn.disabled = true;
        this.elements.nextBtn.style.display = 'none';
        this.elements.feedbackArea.innerHTML = '';
    }
    
    /**
     * Create option button element
     * @param {string} text - Option text
     * @param {number} index - Option index
     * @returns {HTMLElement} Button element
     */
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
    
    /**
     * Handle option selection
     * @param {HTMLElement} optionBtn - Selected option button
     */
    selectOption(optionBtn) {
        // Remove previous selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Mark as selected
        optionBtn.classList.add('selected');
        this.selectedOption = parseInt(optionBtn.getAttribute('data-option-id'));
        
        // Enable submit button
        this.elements.submitBtn.disabled = false;
    }
    
    /**
     * Submit answer and process
     */
    async submitAnswer() {
        if (this.selectedOption === null || this.isAnswered) return;
        
        this.isAnswered = true;
        this.elements.submitBtn.disabled = true;
        
        // TODO: Lead Developer - Process answer through engine
        const result = this.engine.submitAnswer(this.selectedOption);
        if (!result) {
            this.showError('No question available to submit.');
            return;
        }
        
        // Show feedback
        this.showFeedback(result);
        
        // Highlight correct/incorrect options
        this.highlightAnswers(result);
        
        // Play audio feedback
        this.playAudioFeedback(result.isCorrect);
        
        // Show next button
        this.elements.nextBtn.style.display = 'block';
        
        // Update score display
        this.updateScore();
        this.updateGamificationDisplay();
        this.updateProgress();
    }
    
    /**
     * Show feedback message
     * @param {Object} result - Result object from engine
     */
    showFeedback(result) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = result.isCorrect ? 'feedback-correct' : 'feedback-wrong';
        feedbackDiv.innerHTML = `
            <strong>
                ${result.isCorrect ? 
                    '<span class="feedback-icon correct-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Correct!</span>' : 
                    '<span class="feedback-icon wrong-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Incorrect</span>'
                }
            </strong>
            <p>${result.feedback}</p>
            <p>Points earned: ${result.pointsEarned}</p>
        `;
        
        this.elements.feedbackArea.innerHTML = '';
        this.elements.feedbackArea.appendChild(feedbackDiv);
    }
    
    /**
     * Highlight correct and incorrect answers
     * @param {Object} result - Result object from engine
     */
    highlightAnswers(result) {
        const options = document.querySelectorAll('.option-btn');
        options.forEach((btn, index) => {
            if (index === result.correctAnswer) {
                btn.classList.add('correct');
            } else if (index === this.selectedOption && !result.isCorrect) {
                btn.classList.add('wrong');
            }
            btn.disabled = true;
        });
    }
    
    /**
     * Move to next question
     */
    nextQuestion() {
        if (this.engine && this.engine.isComplete()) {
            this.completeQuiz();
            return;
        }
        
        this.loadQuestion();
    }
    
    /**
     * Complete quiz and redirect to results
     */
    completeQuiz() {
        if (this.engine) {
            const summary = this.engine.getPerformanceSummary();
            localStorage.setItem('quizResults', JSON.stringify(summary));
        }
        window.location.href = 'result.html';
    }
    
    /**
     * Stop quiz with confirmation
     */
    stopQuiz() {
        const state = this.engine ? this.engine.getState() : null;
        const answered = state ? state.totalAnswered : 0;
        
        const message = answered > 0 
            ? `You have answered ${answered} question(s). Are you sure you want to stop the quiz? Your progress will be saved.`
            : 'Are you sure you want to stop the quiz?';
        
        if (window.confirm(message)) {
            console.log('[RB-ADA] quiz_stopped_by_user', { answered });
            this.completeQuiz();
        }
    }
    
    /**
     * Update progress bar
     */
    updateProgress() {
        if (!this.engine) return;
        const progress = this.engine.getProgress();
        const state = this.engine.getState();
        const total = progress.total || 1;
        const answered = state.totalAnswered;
        const currentNumber = Math.min(answered + 1, total);
        const percent = Math.round((answered / total) * 100);
        this.elements.progressBar.style.width = `${percent}%`;
        this.elements.progressText.textContent = `Question ${currentNumber} of ${total}`;
    }
    
    /**
     * Update score display
     */
    updateScore() {
        if (!this.engine) return;
        const state = this.engine.getState();
        this.elements.scoreDisplay.textContent = `Score: ${state.score}`;
    }
    
    /**
     * Update gamification indicators
     */
    updateGamificationDisplay() {
        if (!this.engine) return;
        const state = this.engine.getState();
        this.elements.levelValue.textContent = state.currentLevel;
        this.elements.streakValue.textContent = state.streak;
        this.elements.pointsValue.textContent = state.score;
    }
    
    /**
     * Show hint (optional feature)
     */
    showHint() {
        // UI Team: Implement hint display logic
        alert('Hint feature - to be implemented');
    }
    
    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboard(e) {
        // UI Team: Add keyboard shortcuts
        // e.g., 1-4 for options, Enter to submit, etc.
    }
    
    /**
     * Play audio feedback
     * @param {boolean} isCorrect - Whether answer was correct
     */
    playAudioFeedback(isCorrect) {
        const audio = new Audio(isCorrect ? 'assets/audio/correct.mp3' : 'assets/audio/wrong.mp3');
        audio.play().catch(err => console.log('Audio playback failed:', err));
    }
    
    /**
     * Show loading overlay
     */
    showLoading() {
        this.elements.loadingOverlay.setAttribute('aria-hidden', 'false');
    }
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.elements.loadingOverlay.setAttribute('aria-hidden', 'true');
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.elements.feedbackArea.innerHTML = `<div class="feedback-wrong">${message}</div>`;
    }

    /**
     * Load user setup from localStorage or defaults
     * @returns {Object} Setup configuration
     */
    loadUserSetup(validCategories = []) {
        const stored = localStorage.getItem('neuroquizUserSetup');
        let parsed = {};
        if (stored) {
            try {
                parsed = JSON.parse(stored) || {};
            } catch (e) {
                parsed = {};
            }
        }
        const fallbackCategory = validCategories.length ? validCategories[0] : ((window.QUESTION_BANK && window.QUESTION_BANK[0] && window.QUESTION_BANK[0].category) ? window.QUESTION_BANK[0].category : null);
        const normalizedCategory = validCategories.includes(parsed.category) ? parsed.category : fallbackCategory;
        return {
            name: parsed.name || 'User',
            level: this.normalizeLevel(parsed.level),
            category: normalizedCategory,
            literacyLevel: this.normalizeLiteracy(parsed.literacyLevel)
        };
    }

    /**
     * Ensure user setup exists; prompt if missing/invalid
     * @param {Array} questionBank - loaded questions
     * @returns {Object} setup config
     */
    async ensureUserSetup(questionBank) {
        const categories = Array.from(new Set((questionBank || []).map(q => q.category).filter(Boolean)));
        let setup = this.loadUserSetup(categories);

        const missingCategory = !setup.category && categories.length > 0;
        const missingLevel = !setup.level;
        const missingLiteracy = !setup.literacyLevel;

        if (missingCategory || missingLevel || missingLiteracy) {
            console.log('[RB-ADA] user_setup_incomplete, redirecting to setup');
            window.location.href = 'setup.html';
            return null;
        }

        console.log('[RB-ADA] user_setup_loaded', setup);
        return setup;
    }

    normalizeLevel(level) {
        const num = parseInt(level, 10);
        if (Number.isInteger(num) && num >= 1 && num <= 3) return num;
        return 1;
    }

    normalizeLiteracy(lit) {
        const allowed = ['Beginner', 'Intermediate', 'Expert'];
        if (allowed.includes(lit)) return lit;
        const lower = (lit || '').toString().toLowerCase();
        if (lower === 'beginner') return 'Beginner';
        if (lower === 'intermediate') return 'Intermediate';
        if (lower === 'expert') return 'Expert';
        return 'Beginner';
    }


    /**
     * Load full quiz bank from bundled JSON datasets
     * @returns {Promise<Array>} Combined question bank
     */
    async loadQuestionBank() {
        if (window.NEUROQUIZ_QUESTION_BANK && Array.isArray(window.NEUROQUIZ_QUESTION_BANK)) {
            return window.NEUROQUIZ_QUESTION_BANK;
        }

        const datasets = ['gk', 'literature', 'logic', 'math', 'stem'];
        const results = [];

        for (const name of datasets) {
            try {
                const resp = await fetch(`data/${name}.json`);
                if (!resp.ok) continue;
                const data = await resp.json();
                if (Array.isArray(data)) {
                    results.push(...data);
                }
            } catch (e) {
                console.warn(`Failed to load dataset ${name}:`, e);
            }
        }

        if (results.length === 0 && Array.isArray(window.QUESTION_BANK)) {
            window.NEUROQUIZ_QUESTION_BANK = window.QUESTION_BANK;
            return window.NEUROQUIZ_QUESTION_BANK;
        }

        window.NEUROQUIZ_QUESTION_BANK = results;
        return window.NEUROQUIZ_QUESTION_BANK;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const quizUI = new QuizUIController();
    quizUI.init();
});

