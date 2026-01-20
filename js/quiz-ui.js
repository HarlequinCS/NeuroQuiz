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
        this.upgradeOfferShown = false; // Track if upgrade offer has been shown
        this.previousLevel = null; // Track previous level for level up detection
        
        // Audio elements for feedback
        this.audioCorrect = new Audio('assets/audio/correct.mp3');
        this.audioWrong = new Audio('assets/audio/wrong.mp3');
        this.audioLevelUp = new Audio('assets/audio/levelup.mp3');
        
        // Set audio volume (0.0 to 1.0)
        this.audioCorrect.volume = 0.5;
        this.audioWrong.volume = 0.5;
        this.audioLevelUp.volume = 0.6;
        
        console.log('QuizUIController initialized');
    }
    
    async init() {
        this.showLoading();
        
        try {
            const questionBank = await this.loadQuestionBank();
            const userSetup = await this.ensureUserSetup(questionBank);
            this.engine = new QuizEngine({ ...userSetup, questionBank });
            this.hideLoading();
            
            // 2. LEADER INTEGRATION: Display User Name
            this.displayUserName(userSetup.name);
            
            this.loadQuestion();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.showError('Failed to load quiz. Please refresh the page.');
        }
    }
    
    // --- LEADER FEATURE: Display Name ---
    displayUserName(name) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && name) {
            userNameElement.textContent = name;
        }
    }

    // --- YOUR UI: Sliding Marker Logic ---
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

    attachButtonEventListeners(btn) {
        if (!btn || btn.hasAttribute('data-listener-attached')) return btn;
        
        const handleClick = (e) => {
            if (this.isAnswered || btn.disabled) return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.selectOption(btn);
        };
        
        btn.addEventListener('click', handleClick, { capture: true, passive: false });
        
        // Better mobile touch handling - prevent double-tap zoom and ensure immediate response
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            let touchStartTime = 0;
            
            btn.addEventListener('touchstart', (e) => {
                if (!this.isAnswered && !btn.disabled) {
                    touchStartTime = Date.now();
                }
            }, { passive: true });
            
            btn.addEventListener('touchend', (e) => {
                if (this.isAnswered || btn.disabled) return;
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 500) { // Quick tap
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.selectOption(btn);
                }
                touchStartTime = 0;
            }, { passive: false, capture: true });
        }
        
        btn.setAttribute('data-listener-attached', 'true');
        return btn;
    }
    
    setupEventListeners() {
        const handleOptionClick = (e) => {
            if (this.isAnswered) return;
            const optionBtn = e.target.closest('.option-btn');
            if (!optionBtn || optionBtn.disabled) return;
            e.preventDefault();
            e.stopPropagation();
            this.selectOption(optionBtn);
        };
        
        // Use capture phase for immediate handling on mobile
        this.elements.optionsContainer.addEventListener('click', handleOptionClick, { capture: true, passive: false });
        
        // Enhanced mobile touch handling with scroll detection
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            let touchStartPos = { x: 0, y: 0 };
            let touchStartTime = 0;
            
            this.elements.optionsContainer.addEventListener('touchstart', (e) => {
                if (this.isAnswered) return;
                const optionBtn = e.target.closest('.option-btn');
                if (optionBtn && !optionBtn.disabled) {
                    touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                    touchStartTime = Date.now();
                }
            }, { passive: true });
            
            this.elements.optionsContainer.addEventListener('touchend', (e) => {
                if (this.isAnswered) return;
                const optionBtn = e.target.closest('.option-btn');
                if (!optionBtn || optionBtn.disabled) return;
                
                const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
                const deltaX = Math.abs(touchEndPos.x - touchStartPos.x);
                const deltaY = Math.abs(touchEndPos.y - touchStartPos.y);
                const touchDuration = Date.now() - touchStartTime;
                
                // Only trigger if it's a tap (not a scroll) - movement less than 10px and duration less than 300ms
                if (deltaX < 10 && deltaY < 10 && touchDuration < 300) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.selectOption(optionBtn);
                }
                touchStartPos = { x: 0, y: 0 };
                touchStartTime = 0;
            }, { passive: false, capture: true });
        }
        
        // Keyboard navigation for options
        this.elements.optionsContainer.addEventListener('keydown', (e) => {
            if (this.isAnswered) return;
            
            const options = Array.from(this.elements.optionsContainer.querySelectorAll('.option-btn'));
            const currentIndex = options.findIndex(btn => btn === document.activeElement);
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                options[nextIndex].focus();
                options[nextIndex].setAttribute('tabindex', '0');
                if (currentIndex >= 0) {
                    options[currentIndex].setAttribute('tabindex', '-1');
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                options[prevIndex].focus();
                options[prevIndex].setAttribute('tabindex', '0');
                if (currentIndex >= 0) {
                    options[currentIndex].setAttribute('tabindex', '-1');
                }
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const focused = document.activeElement;
                if (focused && focused.classList.contains('option-btn')) {
                    this.selectOption(focused);
                }
            }
        });
        
        this.elements.submitBtn.addEventListener('click', () => {
            if (this.selectedOption !== null && !this.isAnswered) this.submitAnswer();
        });
        
        // Keyboard support for submit
        this.elements.submitBtn.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !this.elements.submitBtn.disabled) {
                e.preventDefault();
                this.elements.submitBtn.click();
            }
        });
        
        this.elements.nextBtn.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        // Keyboard support for next
        this.elements.nextBtn.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !this.elements.nextBtn.disabled) {
                e.preventDefault();
                this.elements.nextBtn.click();
            }
        });

        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', () => this.stopQuiz());
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
        // Initialize previous level on first question load
        if (this.engine && this.previousLevel === null) {
            const state = this.engine.getState();
            this.previousLevel = state.currentLevel;
        }
        const question = this.engine ? this.engine.getCurrentQuestion() : null;
        if (!question) {
            this.completeQuiz();
            return;
        }
        
        this.currentQuestion = question;
        
        // Batch DOM updates using requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Update question text
            this.elements.questionTitle.textContent = question.question;
            this.elements.questionTitle.setAttribute('aria-live', 'polite');
            
            // Update badge
            const progress = this.engine.getProgress();
            if (this.elements.badgeText) {
                this.elements.badgeText.textContent = `Q${Math.max(progress.current, 1)}`;
            }
            
            // Build options efficiently using documentFragment
            const fragment = document.createDocumentFragment();
            question.options.forEach((option, index) => {
                const btn = this.createOptionButton(option, index);
                fragment.appendChild(btn);
            });
            this.elements.optionsContainer.innerHTML = '';
            this.elements.optionsContainer.appendChild(fragment);
            
            // Attach event listeners directly to each button AFTER they're in DOM
            const buttonsInDOM = this.elements.optionsContainer.querySelectorAll('.option-btn');
            buttonsInDOM.forEach((btn) => {
                this.attachButtonEventListeners(btn);
            });
            
            // Set first option as focusable
            const firstOption = this.elements.optionsContainer.querySelector('.option-btn');
            if (firstOption) {
                firstOption.setAttribute('tabindex', '0');
            }
            
            // Reset state
            this.selectedOption = null;
            this.isAnswered = false;
            
            // Update buttons state
            this.elements.submitBtn.style.display = ''; 
            this.elements.submitBtn.classList.remove('hidden');
            this.elements.submitBtn.disabled = true;
            this.elements.submitBtn.setAttribute('aria-disabled', 'true');
            
            this.elements.nextBtn.style.display = 'none';
            this.elements.nextBtn.classList.remove('btn-enter');
            this.elements.nextBtn.setAttribute('aria-disabled', 'true');
            
            // Clear feedback
            this.elements.feedbackArea.innerHTML = '';
            this.elements.feedbackArea.style.display = 'none';
            
            // Update displays
            this.updateProgress();
            this.updateGamificationDisplay();
            this.updateMotivationalMessage();
        });
    }
    
    createOptionButton(text, index) {
        // Use documentFragment for better performance
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.dataset.optionId = index; // Faster than setAttribute
        btn.setAttribute('aria-label', `Option ${String.fromCharCode(65 + index)}: ${text}`);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
        
        // Optimized child creation
        const label = document.createElement('span');
        label.className = 'option-label';
        label.textContent = String.fromCharCode(65 + index);
        label.setAttribute('aria-hidden', 'true');
        
        const optionText = document.createElement('span');
        optionText.className = 'option-text';
        optionText.textContent = text;
        
        // Append children efficiently
        btn.appendChild(label);
        btn.appendChild(optionText);
        
        return btn;
    }
    
    selectOption(optionBtn) {
        // Fast path: early return if invalid
        if (optionBtn.disabled || this.isAnswered) return;
        
        const isAlreadySelected = optionBtn.classList.contains('selected');
        
        // Cache DOM query - only get options once
        const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
        const optionCount = options.length;
        
        // Batch DOM updates using documentFragment for better performance
        // Remove selected state from all buttons
        for (let i = 0; i < optionCount; i++) {
            const btn = options[i];
            btn.classList.remove('selected');
            btn.setAttribute('aria-checked', 'false');
            btn.setAttribute('tabindex', '-1');
        }

        if (isAlreadySelected) {
            this.selectedOption = null;
            this.elements.submitBtn.disabled = true;
            this.elements.submitBtn.setAttribute('aria-disabled', 'true');
        } else {
            // Fast update - set all properties at once
            optionBtn.classList.add('selected');
            optionBtn.setAttribute('aria-checked', 'true');
            optionBtn.setAttribute('tabindex', '0');
            this.selectedOption = parseInt(optionBtn.getAttribute('data-option-id'), 10);
            this.elements.submitBtn.disabled = false;
            this.elements.submitBtn.setAttribute('aria-disabled', 'false');
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
        
        // --- VISUAL EFFECTS (Deferred for better performance) ---
        // Defer visual effects to avoid blocking button interactions
        requestAnimationFrame(() => {
            this.triggerScreenBloom(result.isCorrect); 
            if (result.isCorrect) {
                requestAnimationFrame(() => this.triggerConfetti());
            } else {
                requestAnimationFrame(() => this.triggerEmojiRain());
            }
        });

        // --- BUTTON SWAP ---
        this.elements.submitBtn.style.display = 'none';
        
        const nextBtn = this.elements.nextBtn;
        nextBtn.classList.remove('hidden');
        nextBtn.style.display = 'flex';
        nextBtn.style.opacity = '1'; 
        
        nextBtn.classList.add('btn-enter');
        nextBtn.setAttribute('aria-disabled', 'false');
        nextBtn.focus();

        setTimeout(() => {
            nextBtn.classList.remove('btn-enter');
        }, 600);
        
        // Batch visual updates together for better performance
        this.highlightAnswers(result);
        this.showFeedback(result);
        
        // Check for level up before updating display
        const state = this.engine.getState();
        const levelUp = this.previousLevel !== null && state.currentLevel > this.previousLevel;
        if (levelUp) {
            this.playAudioFeedback('levelup');
        }
        
        this.updateGamificationDisplay(); 
        this.updateProgress();
        this.updateMotivationalMessage();
        
        // Play audio feedback for answer correctness
        this.playAudioFeedback(result.isCorrect ? 'correct' : 'wrong');
        
        // Update previous level for next comparison
        this.previousLevel = state.currentLevel;
        
        // 4️⃣ LEVEL-UP OFFER LOGIC: Offers appear at every 10, 20, 30... consecutive correct in Expert
        // Only triggered when ALL conditions are met:
        // 1. User is currently in Expert difficulty (3)
        // 2. User achieves 10, 20, 30... consecutive correct answers WHILE in Expert
        // 3. Count ONLY expert streak (not displayed streak, not recovery streaks)
        if (result.isCorrect && 
            result.difficulty === 3 && 
            result.expertStreak > 0 && 
            result.expertStreak % 10 === 0) {
            // Show offer at every 10-streak milestone (10, 20, 30...)
            // Delay showing the offer slightly so user can see their feedback first
            setTimeout(() => {
                this.showUpgradeOffer();
            }, 1500);
        }
        
        // Reset the flag if expert streak is broken (so they can get offer again at next 10-streak)
        if (!result.isCorrect && result.difficulty === 3) {
            this.upgradeOfferShown = false;
        }
    }

    // ===========================================
    // GAMIFICATION & VISUAL EFFECTS LOGIC (Updated)
    // ===========================================

    updateGamificationDisplay() {
        if (!this.engine) return;
        const state = this.engine.getState();

        // 1. Update The Numbers
        if (this.elements.levelValue) {
            this.elements.levelValue.textContent = state.currentLevel;
            this.elements.levelValue.setAttribute('aria-label', `Current level: ${state.currentLevel}`);
        }
        if (this.elements.streakValue) {
            this.elements.streakValue.textContent = state.streak;
            this.elements.streakValue.setAttribute('aria-label', `Current streak: ${state.streak} correct answers in a row`);
        }
        if (this.elements.pointsValue) {
            this.elements.pointsValue.textContent = state.score;
            this.elements.pointsValue.setAttribute('aria-label', `Total points: ${state.score}`);
        }

        // 2. Apply Visual Effects (Glows, Colors, Animations)
        this.applyVisualEffects(this.elements.levelIcon, state.currentLevel, 'level');
        this.applyVisualEffects(this.elements.streakIcon, state.streak, 'streak');
        this.applyVisualEffects(this.elements.pointsIcon, state.score, 'points');
    }
    
    updateMotivationalMessage() {
        if (!this.engine) return;
        const state = this.engine.getState();
        const progress = this.engine.getProgress();
        const totalAnswered = state.totalAnswered;
        const streak = state.streak;
        const score = state.score;
        
        const motivationEl = document.getElementById('motivation-message');
        const motivationText = document.getElementById('motivation-text');
        const motivationIcon = document.getElementById('motivation-icon');
        
        if (!motivationEl || !motivationText || !motivationIcon) return;
        
        let message = '';
        let iconSvg = '';
        let remaining = 0;
        
        // Achievement milestones to track
        const milestones = [
            { type: 'questions', target: 5, message: 'Complete 5 questions', icon: 'target' },
            { type: 'questions', target: 10, message: 'Complete 10 questions', icon: 'star' },
            { type: 'questions', target: 20, message: 'Complete 20 questions', icon: 'trophy' },
            { type: 'streak', target: 5, message: 'Get a 5-question streak', icon: 'fire' },
            { type: 'streak', target: 7, message: 'Get a 7-question streak', icon: 'fire' },
            { type: 'streak', target: 10, message: 'Get a 10-question streak', icon: 'star' },
            { type: 'points', target: 100, message: 'Reach 100 points', icon: 'diamond' },
            { type: 'points', target: 200, message: 'Reach 200 points', icon: 'diamond' },
            { type: 'points', target: 500, message: 'Reach 500 points', icon: 'trophy' }
        ];
        
        // Find the next closest milestone
        let nextMilestone = null;
        let minRemaining = Infinity;
        
        for (const milestone of milestones) {
            let current = 0;
            let remaining = 0;
            
            if (milestone.type === 'questions') {
                current = totalAnswered;
                remaining = milestone.target - current;
            } else if (milestone.type === 'streak') {
                current = streak;
                remaining = milestone.target - current;
            } else if (milestone.type === 'points') {
                current = score;
                remaining = milestone.target - current;
            }
            
            if (remaining > 0 && remaining < minRemaining && remaining <= 5) {
                minRemaining = remaining;
                nextMilestone = { ...milestone, remaining, current };
            }
        }
        
        // Generate motivational message
        if (nextMilestone) {
            if (nextMilestone.remaining === 1) {
                message = `You're 1 ${nextMilestone.type === 'questions' ? 'question' : nextMilestone.type === 'streak' ? 'correct answer' : 'point'} away from ${nextMilestone.message}!`;
            } else {
                message = `Keep going! ${nextMilestone.remaining} more ${nextMilestone.type === 'questions' ? 'questions' : nextMilestone.type === 'streak' ? 'correct answers' : 'points'} until you ${nextMilestone.message}!`;
            }
            
            // Set icon based on milestone type
            if (nextMilestone.icon === 'target') {
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';
            } else if (nextMilestone.icon === 'star') {
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            } else if (nextMilestone.icon === 'fire') {
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>';
            } else if (nextMilestone.icon === 'diamond') {
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 12L2 9z"></path></svg>';
            } else if (nextMilestone.icon === 'trophy') {
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>';
            }
        } else {
            // General encouragement messages
            if (streak >= 5) {
                message = `Amazing streak of ${streak}! Keep it up!`;
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>';
            } else if (totalAnswered >= 10) {
                message = `Great progress! You've answered ${totalAnswered} questions!`;
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            } else {
                message = `You're doing great! Keep answering questions!`;
                iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
            }
        }
        
        motivationText.textContent = message;
        motivationIcon.innerHTML = iconSvg;
        
        // Show/hide motivation message
        if (message) {
            motivationEl.style.display = 'flex';
        } else {
            motivationEl.style.display = 'none';
        }
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
            else tier = 1;                  // Normal (No Effect)
            
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
        
        // Check if modal elements exist before using them
        if (!modalIcon || !modalMessage || !modalFooter) {
            console.warn('Some modal elements missing! Fallback to alert.');
            alert(message);
            if (onPrimary) onPrimary();
            return;
        }
        
        if (typeof icon === 'string' && icon.startsWith('<svg')) {
            modalIcon.innerHTML = icon;
        } else {
            modalIcon.innerHTML = icon || '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }
        
        // Only set title if modalTitle element exists (it was removed from HTML)
        if (modalTitle) {
            modalTitle.textContent = title || 'Notice';
        }
        
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
        modalOverlay.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
        });
    }

    closeModal() {
        if (!this.elements.modalOverlay) return;
        this.elements.modalOverlay.classList.remove('active');
        this.elements.modalOverlay.classList.add('hidden');
        this.elements.modalOverlay.setAttribute('aria-hidden', 'true');
    }

    showUpgradeOffer() {
        if (!this.engine) return;
        
        const state = this.engine.getState();
        const currentLevel = state.currentLevel;
        const maxLevel = 3; // MAX_LEVEL from engine
        
        // Check if already at max level
        if (currentLevel >= maxLevel) {
            // Can't upgrade further, so don't show offer
            return;
        }
        
        // Level names mapping
        const levelNames = {
            1: 'Elementary',
            2: 'Secondary',
            3: 'University'
        };
        
        const nextLevel = currentLevel + 1;
        const currentLevelName = levelNames[currentLevel] || `Level ${currentLevel}`;
        const nextLevelName = levelNames[nextLevel] || `Level ${nextLevel}`;
        
        // Mark as shown to prevent multiple offers
        this.upgradeOfferShown = true;
        
        // Create custom modal with two buttons
        if (!this.elements.modalOverlay) {
            console.warn('Modal elements missing!');
            return;
        }

        const { modalOverlay, modalIcon, modalTitle, modalMessage, modalFooter } = this.elements;
        
        // Check if modal elements exist before using them
        if (!modalIcon || !modalMessage || !modalFooter) {
            console.warn('Some modal elements missing!');
            return;
        }
        
        modalIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>';
        
        // Only set title if modalTitle element exists (it was removed from HTML)
        if (modalTitle) {
            modalTitle.textContent = 'Amazing Streak!';
        }
        modalMessage.innerHTML = `
            <p style="margin-bottom: 1rem;">You've achieved 10 consecutive correct answers while in Expert difficulty!</p>
            <p style="margin-bottom: 1rem;"><strong>Current:</strong> ${currentLevelName} - Expert</p>
            <p style="margin-bottom: 1.5rem;"><strong>Upgrade Option:</strong> ${nextLevelName} - Beginner</p>
            <p>Would you like to continue at your current level or upgrade to the next level?</p>
        `;
        
        modalFooter.innerHTML = '';
        
        // Continue button (secondary)
        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn-modal btn-modal-secondary';
        continueBtn.textContent = `Continue ${currentLevelName} Expert`;
        continueBtn.type = 'button'; // Prevent form submission
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeModal();
            // User chose to continue, do nothing
        });
        modalFooter.appendChild(continueBtn);
        
        // Upgrade button (primary)
        const upgradeBtn = document.createElement('button');
        upgradeBtn.className = 'btn-modal btn-modal-primary';
        upgradeBtn.textContent = `Upgrade to ${nextLevelName} Beginner`;
        upgradeBtn.type = 'button'; // Prevent form submission
        upgradeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const upgradeResult = this.engine.upgradeLevel();
            if (upgradeResult.success) {
                // Close the upgrade offer modal first
                this.closeModal();
                
                // Reset the flag so they can get another offer at the new level
                this.upgradeOfferShown = false;
                
                // Update display to show new level/difficulty
                this.updateGamificationDisplay();
                
                // Show confirmation
                setTimeout(() => {
                    this.openModal({
                        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
                        title: 'Level Upgraded!',
                        message: `Congratulations! You've been upgraded to ${nextLevelName} - Beginner difficulty.`,
                        primaryBtnText: 'Continue Quiz',
                        onPrimary: () => {
                            this.closeModal();
                        }
                    });
                }, 300);
            } else {
                this.openModal({
                    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
                    title: 'Cannot Upgrade',
                    message: 'You have reached the maximum level. Continue with your current level.',
                    primaryBtnText: 'OK',
                    onPrimary: () => {
                        this.closeModal();
                    }
                });
            }
        });
        modalFooter.appendChild(upgradeBtn);
        
        modalOverlay.classList.remove('hidden');
        modalOverlay.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => {
            modalOverlay.classList.add('active');
        });
        
        // Ensure modal card stops event propagation
        const modalCard = modalOverlay.querySelector('.custom-modal-card');
        if (modalCard) {
            modalCard.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    stopQuiz() {
        const state = this.engine ? this.engine.getState() : null;
        const answered = state ? state.totalAnswered : 0;
        
        const msg = answered > 0 
            ? `You have answered ${answered} questions. Your progress will be saved.`
            : 'You haven\'t answered any questions yet.';

        this.openModal({
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>',
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
        // Reduced count for better performance - use requestAnimationFrame for batch DOM updates
        const count = 40; // Reduced from 80 for better performance
        const shapes = ['●', '◆', '■', '▲'];
        const fragment = document.createDocumentFragment();
        const now = Date.now();
        
        // Batch DOM creation
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('fx-particle', 'anim-confetti');
            el.textContent = shapes[i % shapes.length];
            el.style.left = `${Math.random() * 100}vw`;
            el.style.top = `${Math.random() * 100}vh`;
            el.style.fontSize = `${1.5 + Math.random() * 1}rem`;
            
            const angle = Math.random() * 360;
            const dist = 100 + Math.random() * 150;
            const tx = Math.cos(angle * Math.PI / 180) * dist;
            const ty = Math.sin(angle * Math.PI / 180) * dist;
            const rot = Math.random() * 720 - 360;

            el.style.setProperty('--tx', `${tx}px`);
            el.style.setProperty('--ty', `${ty}px`);
            el.style.setProperty('--rot', `${rot}deg`);
            el.dataset.removeTime = String(now + 1200); // Track removal time
            
            fragment.appendChild(el);
        }
        
        // Single DOM append
        document.body.appendChild(fragment);
        
        // Batch cleanup
        requestAnimationFrame(() => {
            const particles = document.querySelectorAll('.fx-particle.anim-confetti');
            particles.forEach(p => {
                const removeTime = parseInt(p.dataset.removeTime || '0', 10);
                if (Date.now() >= removeTime) {
                    p.remove();
                }
            });
        });
    }

    triggerEmojiRain() {
        // Reduced count and optimized DOM operations
        const count = 30; // Reduced from 60 for better performance
        const shapes = ['✕', '✖', '○', '×'];
        const fragment = document.createDocumentFragment();
        const now = Date.now();
        
        // Batch DOM creation
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.classList.add('fx-particle', 'anim-rain');
            el.textContent = shapes[i % shapes.length];
            el.style.left = `${Math.random() * 100}vw`;
            el.style.top = `-10vh`;
            el.style.fontSize = `${2 + Math.random() * 1.5}rem`; 
            el.style.animationDuration = `${2 + Math.random()}s`;
            el.dataset.removeTime = String(now + 2800);
            
            fragment.appendChild(el);
        }
        
        // Single DOM append
        document.body.appendChild(fragment);
        
        // Batch cleanup after animation
        setTimeout(() => {
            const particles = document.querySelectorAll('.fx-particle.anim-rain');
            particles.forEach(p => p.remove());
        }, 3000);
    }
    
    // --- YOUR UI: Card Style Feedback ---
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
        // Cache query and batch DOM updates for better performance
        const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
        const optionCount = options.length;
        const correctIndex = result.correctAnswer;
        const selectedIndex = this.selectedOption;
        
        // Batch updates in single loop - faster than forEach
        for (let i = 0; i < optionCount; i++) {
            const btn = options[i];
            btn.classList.remove('selected');
            btn.disabled = true;
            
            if (i === correctIndex) {
                btn.classList.add('correct'); 
                btn.style.boxShadow = "0 0 15px #2bde73";
                btn.style.borderColor = "#2bde73";
            } else if (i === selectedIndex && !result.isCorrect) {
                btn.classList.add('wrong');
                btn.style.opacity = "0.7";
            } else {
                btn.style.opacity = "0.5";
            }
        }
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
            this.updateMotivationalMessage();
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
        
        const progressBarElement = document.getElementById('progress-bar');
        if (progressBarElement) {
            progressBarElement.setAttribute('aria-valuenow', percent);
            progressBarElement.setAttribute('aria-label', `Progress: ${percent}% complete, ${answered} of ${total} questions answered`);
        }
        
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `Question ${currentNumber} of ${total}`;
            this.elements.progressText.setAttribute('aria-label', `Question ${currentNumber} of ${total}`);
        }
    }
    
    playAudioFeedback(type) {
        try {
            let audio = null;
            
            if (type === 'correct') {
                audio = this.audioCorrect;
            } else if (type === 'wrong') {
                audio = this.audioWrong;
            } else if (type === 'levelup') {
                audio = this.audioLevelUp;
            }
            
            if (audio) {
                // Reset audio to start from beginning
                audio.currentTime = 0;
                // Play audio (with error handling for autoplay policies)
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Autoplay was prevented - this is normal in some browsers
                        // Audio will play on user interaction
                        console.log('Audio play prevented:', error);
                    });
                }
            }
        } catch (error) {
            // Silently handle audio errors (e.g., file not found, autoplay blocked)
            console.log('Audio feedback error:', error);
        }
    }
    
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
            name: parsed.name || 'User', // Include Name for Welcome Section
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
        
        // Get git version for cache busting - try to get from meta tag or default to timestamp
        const getCacheVersion = () => {
            // Try to get version from a script tag or use timestamp as fallback
            const scriptTag = document.querySelector('script[src*="quiz-ui.js"]');
            if (scriptTag && scriptTag.src) {
                const match = scriptTag.src.match(/[?&]v=([^&]+)/);
                if (match) return match[1];
            }
            // Fallback to git version or timestamp
            return '06aca9e';
        };
        
        const cacheVersion = getCacheVersion();
        const datasets = ['gk', 'literature', 'logic', 'math', 'stem'];
        const results = [];
        for (const name of datasets) {
            try {
                const resp = await fetch(`data/${name}.json?v=${cacheVersion}`);
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