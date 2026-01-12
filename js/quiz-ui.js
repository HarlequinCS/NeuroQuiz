/**
 * NeuroQuiz™ - Quiz UI Controller
 * * UI Team: This file connects HTML elements to the quiz engine.
 * Includes: Gamified Feedback Cards, Unselect Logic, and Animations.
 */

class QuizUIController {
    constructor() {
        // DOM Elements
        this.elements = {
            // Note: Ensure your HTML ID is 'feedback-container' to match CSS, 
            // or 'feedback-area' if you prefer (just make sure CSS matches).
            // We use the ID from your provided code here:
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
            feedbackArea: document.getElementById('feedback-container') || document.getElementById('feedback-area'),
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
    
    async init() {
        this.showLoading();
        try {
            // Initialize engine (Placeholder for lead dev integration)
            // this.engine = new QuizEngine(); 
            // this.engine.initialize(getAllQuestions());
            
            this.hideLoading();
            this.loadQuestion();
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.showError('Failed to load quiz. Please refresh the page.');
        }
    }
    
    setupEventListeners() {
        // Option button clicks (Delegation)
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
        
        // Hint button
        this.elements.hintBtn.addEventListener('click', () => {
            this.showHint();
        });
    }
    
    loadQuestion() {
        // Placeholder Question Data
        const question = {
            id: 1,
            question: "Sample Question - Engine will provide real questions",
            options: ["Option A", "Option B", "Option C", "Option D"],
            category: "General"
        };
        
        // Update text
        this.elements.questionTitle.textContent = question.question;
        
        // Clear and populate options
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionBtn = this.createOptionButton(option, index);
            this.elements.optionsContainer.appendChild(optionBtn);
        });
        
        // Update gamification UI
        this.updateProgress();
        this.updateGamificationDisplay();
        
        // Reset UI state
        this.selectedOption = null;
        this.isAnswered = false;
        this.elements.submitBtn.disabled = true;
        this.elements.nextBtn.style.display = 'none';
        
        // Clear feedback
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
    
    /**
     * Handle option selection with Toggle (Select/Unselect) Logic
     */
    selectOption(optionBtn) {
        // Check if the clicked button is ALREADY selected
        const isAlreadySelected = optionBtn.classList.contains('selected');

        // 1. Reset ALL buttons first (remove selected class)
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        if (isAlreadySelected) {
            // 2a. If it was already selected, we are UNSELECTING it.
            this.selectedOption = null;
            this.elements.submitBtn.disabled = true;
        } else {
            // 2b. If it was NOT selected, we SELECT it.
            optionBtn.classList.add('selected');
            this.selectedOption = parseInt(optionBtn.getAttribute('data-option-id'));
            
            // Enable submit button
            this.elements.submitBtn.disabled = false;
        }
    }
    
    async submitAnswer() {
        if (this.selectedOption === null || this.isAnswered) return;
        
        this.isAnswered = true;
        this.elements.submitBtn.disabled = true;
        
        // Placeholder Result (Simulating Engine Response)
        const result = {
            isCorrect: false, // Change this to true to test correct state
            correctAnswer: 0,
            feedback: "Sample feedback - Engine will provide real feedback explanation here.",
            pointsEarned: 10
        };
        
        // 1. Show "Perfect" Feedback Card
        this.showFeedback(result);
        
        // 2. Highlight Answers
        this.highlightAnswers(result);
        
        // 3. Play Audio
        this.playAudioFeedback(result.isCorrect);
        
        // 4. Show Next Button
        this.elements.nextBtn.style.display = 'block';
        
        this.updateScore();
    }
    
    /**
     * Renders the "Game Style" Feedback Card
     */
    showFeedback(result) {
        const container = this.elements.feedbackArea;
        
        // 1. Determine Content & Style
        const isCorrect = result.isCorrect;
        const icon = isCorrect ? '✔' : '✖';
        const title = isCorrect ? 'Correct!' : 'Incorrect';
        const styleClass = isCorrect ? 'correct' : 'incorrect';
        
        // 2. Build HTML Structure (Split Header/Body)
        const html = `
            <div class="feedback-card ${styleClass}">
                <div class="feedback-header">
                    <div class="feedback-icon">${icon}</div>
                    <span>${title}</span>
                </div>
                
                <div class="feedback-body">
                    <div class="feedback-text">
                        ${result.feedback}
                    </div>
                    
                    ${result.pointsEarned > 0 ? `
                    <div class="points-badge">
                        +${result.pointsEarned} Points
                    </div>` : `
                    <div class="points-badge" style="opacity: 0.6">
                        0 Points
                    </div>`}
                </div>
            </div>
        `;

        // 3. Inject and Show
        container.innerHTML = html;
        container.style.display = 'block';
        
        // Scroll slightly to make sure feedback is visible on mobile
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    highlightAnswers(result) {
        const options = document.querySelectorAll('.option-btn');
        options.forEach((btn, index) => {
            // Remove previous selections styling if needed, or keep it
            btn.classList.remove('selected');
            
            if (index === result.correctAnswer) {
                btn.classList.add('correct'); // Add Green style in CSS if desired
                // If using the game colors, you might just want to keep the color 
                // but add a thick border or icon.
                btn.style.boxShadow = "0 0 15px #2bde73";
                btn.style.borderColor = "#2bde73";
            } else if (index === this.selectedOption && !result.isCorrect) {
                btn.classList.add('wrong');
                btn.style.opacity = "0.7";
            } else {
                btn.style.opacity = "0.5"; // Dim other options
            }
            btn.disabled = true;
        });
    }
    
    nextQuestion() {
        // Logic to load next question from engine would go here
        // For now, we just reload the sample
        this.loadQuestion();
    }
    
    updateProgress() {
        const progress = 0; // Placeholder
        this.elements.progressBar.style.width = `${progress}%`;
        this.elements.progressText.textContent = `Question 1 of 5`; 
    }
    
    updateScore() {
        this.elements.scoreDisplay.textContent = 'Score: 10'; 
    }
    
    updateGamificationDisplay() {
        // Placeholder stats
    }
    
    showHint() {
        alert('Hint feature - to be implemented');
    }
    
    playAudioFeedback(isCorrect) {
        // Optional: Add simple beeps if files aren't available
        // const audio = new Audio(isCorrect ? 'assets/audio/correct.mp3' : 'assets/audio/wrong.mp3');
        // audio.play().catch(err => console.log('Audio playback failed:', err));
    }
    
    showLoading() {
        if(this.elements.loadingOverlay) this.elements.loadingOverlay.setAttribute('aria-hidden', 'false');
    }
    
    hideLoading() {
        if(this.elements.loadingOverlay) this.elements.loadingOverlay.setAttribute('aria-hidden', 'true');
    }
    
    showError(message) {
        this.elements.feedbackArea.innerHTML = `<div class="feedback-card incorrect shake">${message}</div>`;
        this.elements.feedbackArea.style.display = 'block';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const quizUI = new QuizUIController();
    quizUI.init();
});