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
            optionsContainer: document.getElementById('options-container'),
            progressBar: document.getElementById('progress-fill'),
            progressText: document.getElementById('question-counter'),
            scoreDisplay: document.getElementById('score-display'),
            submitBtn: document.getElementById('submit-btn'),
            nextBtn: document.getElementById('next-btn'),
            hintBtn: document.getElementById('hint-btn'),
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
        
        console.log('QuizUIController initialized');
    }
    
    /**
     * Initialize the quiz UI
     */
    async init() {
        // Show loading
        this.showLoading();
        
        try {
            // Initialize engine (will be implemented by lead developer)
            this.engine = new QuizEngine();
            
            // Load question data
            // TODO: Lead Developer - Initialize engine with question data
            // this.engine.initialize(getAllQuestions());
            
            // Hide loading
            this.hideLoading();
            
            // Load first question
            this.loadQuestion();
            
            // Setup event listeners
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.showError('Failed to load quiz. Please refresh the page.');
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
        // TODO: Lead Developer - Get question from engine
        // const question = this.engine.getCurrentQuestion();
        
        // Placeholder - UI Team can style this structure
        const question = {
            id: 1,
            question: "Sample Question - Engine will provide real questions",
            options: ["Option A", "Option B", "Option C", "Option D"],
            category: "General"
        };
        
        // Update question text
        this.elements.questionTitle.textContent = question.question;
        
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
        // const result = this.engine.submitAnswer(this.selectedOption);
        
        // Placeholder result
        const result = {
            isCorrect: false,
            correctAnswer: 0,
            feedback: "Sample feedback - Engine will provide real feedback",
            pointsEarned: 10
        };
        
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
    }
    
    /**
     * Show feedback message
     * @param {Object} result - Result object from engine
     */
    showFeedback(result) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = result.isCorrect ? 'feedback-correct' : 'feedback-wrong';
        feedbackDiv.innerHTML = `
            <strong>${result.isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong>
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
        // TODO: Lead Developer - Check if quiz complete
        // if (this.engine.isComplete()) {
        //     this.completeQuiz();
        //     return;
        // }
        
        // TODO: Lead Developer - Move to next question
        // this.engine.nextQuestion();
        
        // Reload question display
        this.loadQuestion();
    }
    
    /**
     * Complete quiz and redirect to results
     */
    completeQuiz() {
        // TODO: Lead Developer - Get results and store
        // const results = this.engine.getResults();
        // localStorage.setItem('quizResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'result.html';
    }
    
    /**
     * Update progress bar
     */
    updateProgress() {
        // TODO: Lead Developer - Get progress from engine
        // const progress = (this.engine.currentQuestionIndex / this.engine.questions.length) * 100;
        
        const progress = 0; // Placeholder
        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.progressText.textContent = `Question 0 of 0`; // Placeholder
    }
    
    /**
     * Update score display
     */
    updateScore() {
        // TODO: Lead Developer - Get score from engine
        // const score = this.engine.score;
        this.elements.scoreDisplay.textContent = 'Score: 0'; // Placeholder
    }
    
    /**
     * Update gamification indicators
     */
    updateGamificationDisplay() {
        // TODO: Lead Developer - Get stats from engine
        // const stats = this.engine.getGamificationStats();
        // this.elements.levelValue.textContent = stats.level;
        // this.elements.streakValue.textContent = stats.streak;
        // this.elements.pointsValue.textContent = stats.points;
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const quizUI = new QuizUIController();
    quizUI.init();
});

