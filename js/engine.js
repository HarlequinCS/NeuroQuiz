/**
 * =========================================================================
 * NeuroQuiz Rule-Based Adaptive Dynamic Algorithm (RB-ADA)
 * Author: Saiful Iqbal - Lead Developer, Team ChendAwan
 * =========================================================================
 */

'use strict';

const RBADA_CONSTANTS = {
    MIN_LEVEL: 1,
    MAX_LEVEL: 3,
    MIN_DIFFICULTY: 1,
    MAX_DIFFICULTY: 3,
    POINTS_PER_DIFFICULTY: 10
};

const LITERACY_TO_DIFFICULTY = {
    Beginner: 1,
    Intermediate: 2,
    Expert: 3
};

const FALLBACK_QUESTION_POOL = [
    {
        id: 'q1',
        level: 1,
        category: 'General Knowledge',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        answerIndex: 2,
        explanation: 'Paris is the capital and largest city of France.'
    },
    {
        id: 'q2',
        level: 1,
        category: 'Science',
        question: 'How many planets are in our solar system?',
        options: ['7', '8', '9', '10'],
        answerIndex: 1,
        explanation: 'There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
    },
    {
        id: 'q3',
        level: 1,
        category: 'Mathematics',
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        answerIndex: 1,
        explanation: '2 + 2 equals 4.'
    },
    {
        id: 'q4',
        level: 2,
        category: 'History',
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        answerIndex: 2,
        explanation: 'World War II ended in 1945.'
    },
    {
        id: 'q5',
        level: 2,
        category: 'Science',
        question: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'O2', 'NaCl'],
        answerIndex: 0,
        explanation: 'H2O is the chemical formula for water, consisting of two hydrogen atoms and one oxygen atom.'
    },
    {
        id: 'q6',
        level: 2,
        category: 'Geography',
        question: 'Which is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        answerIndex: 3,
        explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.'
    },
    {
        id: 'q7',
        level: 3,
        category: 'Science',
        question: 'What is the speed of light in a vacuum?',
        options: ['299,792,458 m/s', '300,000,000 m/s', '150,000,000 m/s', '450,000,000 m/s'],
        answerIndex: 0,
        explanation: 'The speed of light in a vacuum is exactly 299,792,458 meters per second.'
    },
    {
        id: 'q8',
        level: 3,
        category: 'Literature',
        question: 'Who wrote  1984?',
        options: ['George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'J.D. Salinger'],
        answerIndex: 0,
        explanation: '1984 was written by George Orwell and published in 1949.'
    },
    {
        id: 'q9',
        level: 3,
        category: 'Mathematics',
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '13'],
        answerIndex: 2,
        explanation: 'The square root of 144 is 12, because 12 × 12 = 144.'
    },
    {
        id: 'q10',
        level: 4,
        category: 'Science',
        question: 'What is the approximate age of the universe according to current estimates?',
        options: ['10.5 billion years', '13.8 billion years', '15.2 billion years', '18.6 billion years'],
        answerIndex: 1,
        explanation: 'The universe is approximately 13.8 billion years old according to current scientific estimates.'
    },
    {
        id: 'q11',
        level: 4,
        category: 'History',
        question: 'Which ancient civilization built the Machu Picchu?',
        options: ['Aztec', 'Maya', 'Inca', 'Olmec'],
        answerIndex: 2,
        explanation: 'Machu Picchu was built by the Inca civilization in the 15th century.'
    },
    {
        id: 'q12',
        level: 4,
        category: 'Mathematics',
        question: 'What is the value of π (pi) to two decimal places?',
        options: ['3.12', '3.14', '3.16', '3.18'],
        answerIndex: 1,
        explanation: 'The value of π (pi) is approximately 3.14159, which rounds to 3.14 to two decimal places.'
    },
    {
        id: 'q13',
        level: 5,
        category: 'Science',
        question: 'What is the Heisenberg Uncertainty Principle?',
        options: [
            'Energy cannot be created or destroyed',
            'It is impossible to simultaneously know exact position and momentum of a particle',
            'Light behaves as both wave and particle',
            'Matter and energy are equivalent'
        ],
        answerIndex: 1,
        explanation: 'The Heisenberg Uncertainty Principle states that the more precisely the position of a particle is known, the less precisely its momentum can be known, and vice versa.'
    },
    {
        id: 'q14',
        level: 5,
        category: 'Mathematics',
        question: 'What is the derivative of e^x?',
        options: ['e^x', 'x·e^x', 'e^(x-1)', 'ln(x)'],
        answerIndex: 0,
        explanation: 'The derivative of e^x is e^x itself. This is a fundamental property of the exponential function.'
    },
    {
        id: 'q15',
        level: 5,
        category: 'Philosophy',
        question: 'Who is known for the phrase Cogito ergo sum (I think, therefore I am)?',
        options: ['Plato', 'Aristotle', 'René Descartes', 'Immanuel Kant'],
        answerIndex: 2,
        explanation: 'Cogito ergo sum is a philosophical statement by René Descartes, expressing the certainty of one\'s own existence through the act of thinking.'
    }
];

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function mapDifficulty(value, fallbackLevel) {
    if (typeof value === 'string') {
        const normalized = value.toLowerCase();
        if (normalized === 'easy') return 1;
        if (normalized === 'medium') return 2;
        if (normalized === 'hard') return 3;
    }
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return Math.round(value);
    }
    if (typeof fallbackLevel === 'number' && !Number.isNaN(fallbackLevel)) {
        return Math.round(fallbackLevel);
    }
    return RBADA_CONSTANTS.MIN_DIFFICULTY;
}

function normalizeQuestion(raw) {
    const levelValue = clamp(
        typeof raw.level === 'number' ? raw.level : RBADA_CONSTANTS.MIN_LEVEL,
        RBADA_CONSTANTS.MIN_LEVEL,
        RBADA_CONSTANTS.MAX_LEVEL
    );

    const difficultyValue = clamp(
        mapDifficulty(raw.difficulty, raw.level),
        RBADA_CONSTANTS.MIN_DIFFICULTY,
        RBADA_CONSTANTS.MAX_DIFFICULTY
    );

    const correctIndex = raw.correctIndex ?? raw.correctAnswer ?? raw.answerIndex ?? raw.answer ?? 0;

    return {
        id: raw.id,
        question: raw.question,
        options: Array.isArray(raw.options) ? raw.options : [],
        correctIndex: Number(correctIndex),
        category: raw.category || 'General',
        difficulty: difficultyValue,
        level: levelValue,
        explanation: raw.explanation || ''
    };
}

function sortQuestions(questions) {
    return [...questions].sort((a, b) => {
        const aId = typeof a.id === 'number' ? a.id : String(a.id);
        const bId = typeof b.id === 'number' ? b.id : String(b.id);
        if (typeof aId === 'number' && typeof bId === 'number') {
            return aId - bId;
        }
        return String(aId).localeCompare(String(bId));
    });
}

function logAdaptive(event, data) {
    if (typeof console !== 'undefined' && console.log) {
        console.log(`[RB-ADA] ${event}`, data);
    }
}

class QuizEngine {
    constructor(options = {}) {
        const candidateBank = options.questionBank && options.questionBank.length
            ? options.questionBank
            : (typeof window !== 'undefined' && Array.isArray(window.NEUROQUIZ_QUESTION_BANK) && window.NEUROQUIZ_QUESTION_BANK.length
                ? window.NEUROQUIZ_QUESTION_BANK
                : (typeof window !== 'undefined' && Array.isArray(window.QUESTION_BANK) && window.QUESTION_BANK.length ? window.QUESTION_BANK : FALLBACK_QUESTION_POOL));

        const sourceQuestions = candidateBank;

        this.questionPool = sortQuestions(sourceQuestions.map(normalizeQuestion));
        const category = options.category || null;

        this.sessionConfig = {
            initialLevel: clamp(options.level || RBADA_CONSTANTS.MIN_LEVEL, RBADA_CONSTANTS.MIN_LEVEL, RBADA_CONSTANTS.MAX_LEVEL),
            category,
            literacyLevel: options.literacyLevel || 'Beginner',
            initialDifficulty: this.getDifficultyFromLiteracy(options.literacyLevel),
            questionLimit: options.questionLimit || null
        };

        this.filteredQuestions = category ? this.questionPool.filter(q => q.category === category) : this.questionPool;
        if (!this.filteredQuestions.length) {
            logAdaptive('category_fallback', { requested: category, reason: 'no_questions_found' });
            this.filteredQuestions = this.questionPool;
        }
        this.resetState();
        logAdaptive('session_init', {
            totalQuestions: this.filteredQuestions.length,
            initialLevel: this.sessionConfig.initialLevel,
            initialDifficulty: this.sessionConfig.initialDifficulty,
            category: this.sessionConfig.category,
            literacyLevel: this.sessionConfig.literacyLevel
        });
    }

    resetState() {
        this.state = {
            currentLevel: this.sessionConfig.initialLevel,
            currentDifficulty: this.sessionConfig.initialDifficulty,
            correctCount: 0,
            wrongCount: 0,
            totalAnswered: 0,
            displayedStreak: 0,  // Never resets, continues across difficulty changes, shown to user
            expertStreak: 0,     // Only counts in Expert difficulty, resets when leaving Expert or first wrong in Expert
            hasDroppedLevel: false,
            dropCount: 0,
            promotionCount: 0,
            score: 0,
            performanceHistory: [],
            answeredQuestionIds: new Set(),
            totalTimeMs: 0,
            currentQuestion: null,
            sessionStartMs: Date.now(),
            lastDifficultyIncreaseAtStreak: 0,
            immediateDropTriggered: false,  // Track if immediate drop was triggered for current difficulty entry
            questionsInCurrentDifficulty: 0,  // Questions answered in current difficulty entry
            recoveryStreak: 0,  // Recovery streak in current difficulty (resets on wrong, must reach 7 to restore)
            previousDifficulty: null  // Track previous difficulty for recovery logic
        };
        this.currentQuestionStartMs = null;
    }

    getDifficultyFromLiteracy(literacyLevel) {
        return LITERACY_TO_DIFFICULTY[literacyLevel] || RBADA_CONSTANTS.MIN_DIFFICULTY;
    }

    getQuestionCount() {
        if (this.sessionConfig.questionLimit) {
            return Math.min(this.sessionConfig.questionLimit, this.filteredQuestions.length);
        }
        return this.filteredQuestions.length;
    }

    getNextCandidate() {
        const remaining = this.filteredQuestions.filter(q => !this.state.answeredQuestionIds.has(q.id));
        if (remaining.length === 0) return null;

        const levelDifficulty = remaining.filter(q => q.level === this.state.currentLevel && q.difficulty === this.state.currentDifficulty);
        if (levelDifficulty.length > 0) {
            return this.shuffleArray(levelDifficulty)[0];
        }

        const levelOnly = remaining.filter(q => q.level === this.state.currentLevel);
        if (levelOnly.length > 0) {
            return this.shuffleArray(levelOnly)[0];
        }

        const difficultyOnly = remaining.filter(q => q.difficulty === this.state.currentDifficulty);
        if (difficultyOnly.length > 0) {
            return this.shuffleArray(difficultyOnly)[0];
        }

        return this.shuffleArray(remaining)[0];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getCurrentQuestion() {
        if (this.isComplete()) {
            return null;
        }

        if (!this.state.currentQuestion) {
            this.state.currentQuestion = this.getNextCandidate();
            if (this.state.currentQuestion) {
                this.currentQuestionStartMs = Date.now();
            }
        }

        return this.state.currentQuestion ? this.stripAnswer(this.state.currentQuestion) : null;
    }

    stripAnswer(question) {
        return {
            id: question.id,
            question: question.question,
            options: [...question.options],
            category: question.category,
            level: question.level,
            difficulty: question.difficulty,
            explanation: question.explanation
        };
    }

    isComplete() {
        const limitReached = this.sessionConfig.questionLimit ? this.state.totalAnswered >= this.sessionConfig.questionLimit : false;
        const noQuestionsLeft = !this.getNextCandidate();
        return limitReached || (noQuestionsLeft && !this.state.currentQuestion);
    }

    submitAnswer(selectedIndex) {
        if (!this.state.currentQuestion) {
            return null;
        }

        const question = this.state.currentQuestion;
        const correctIndex = question.correctIndex;
        const isCorrect = Number(selectedIndex) === Number(correctIndex);
        const timeTakenMs = this.currentQuestionStartMs ? Date.now() - this.currentQuestionStartMs : 0;

        const prevState = {
            level: this.state.currentLevel,
            difficulty: this.state.currentDifficulty,
            correctCount: this.state.correctCount,
            wrongCount: this.state.wrongCount,
            displayedStreak: this.state.displayedStreak,
            expertStreak: this.state.expertStreak
        };

        this.state.totalAnswered += 1;
        
        // Update displayed streak (never resets, continues across difficulty changes)
        if (isCorrect) {
            this.state.correctCount += 1;
            this.state.displayedStreak += 1;
            this.state.score += this.state.currentDifficulty * RBADA_CONSTANTS.POINTS_PER_DIFFICULTY;
        } else {
            this.state.wrongCount += 1;
            this.state.displayedStreak = 0;
        }
        
        // Increment questions answered in current difficulty entry
        this.state.questionsInCurrentDifficulty += 1;
        
        // Track difficulty before adjustment
        const difficultyBefore = this.state.currentDifficulty;
        const wasInExpertBefore = difficultyBefore === RBADA_CONSTANTS.MAX_DIFFICULTY;
        
        // Apply adaptive rules FIRST to determine new difficulty
        this.applyAdaptiveRules(isCorrect);
        
        // Track difficulty after adjustment
        const difficultyAfter = this.state.currentDifficulty;
        const isNowInExpert = difficultyAfter === RBADA_CONSTANTS.MAX_DIFFICULTY;
        const difficultyChanged = difficultyAfter !== difficultyBefore;
        
        // 3️⃣ EXPERT STREAK LOGIC: Only counts while in Expert, resets on leaving or first wrong
        // Reset expert streak when entering Expert (new session starts at 0)
        if (!wasInExpertBefore && isNowInExpert) {
            this.state.expertStreak = 0; // Reset when entering Expert (recovery streaks don't count)
        }
        
        if (isNowInExpert) {
            // In Expert difficulty
            if (isCorrect) {
                // Increment expert streak for correct answers (recovery streaks don't affect this)
                this.state.expertStreak += 1;
            } else {
                // Reset expert streak on wrong answer in Expert
                this.state.expertStreak = 0;
                if (wasInExpertBefore) {
                    // Only log if we were already in Expert (not just entered)
                    logAdaptive('expert_streak_reset', {
                        reason: 'wrong_answer_in_expert'
                    });
                }
            }
        } else {
            // Not in Expert difficulty - reset expert streak when leaving
            if (wasInExpertBefore && !isNowInExpert) {
                this.state.expertStreak = 0;
                logAdaptive('expert_streak_reset', {
                    reason: 'left_expert_difficulty'
                });
            } else if (!wasInExpertBefore && !isNowInExpert) {
                // Never was in Expert, ensure it's 0
                this.state.expertStreak = 0;
            }
        }

        this.state.totalTimeMs += timeTakenMs;
        this.state.performanceHistory.push({
            id: question.id,
            question: question.question,
            category: question.category,
            level: this.state.currentLevel,
            difficulty: this.state.currentDifficulty,
            selectedIndex: selectedIndex,
            correctIndex: correctIndex,
            isCorrect: isCorrect,
            timeTakenMs: timeTakenMs,
            hasDroppedLevel: this.state.hasDroppedLevel
        });
        this.state.answeredQuestionIds.add(question.id);

        // Adaptive rules already applied above, now log the result
        const ratio = this.state.wrongCount === 0 ? Infinity : this.state.correctCount / this.state.wrongCount;
        logAdaptive('answer_processed', {
            questionId: question.id,
            isCorrect,
            timeTakenMs,
            previous: prevState,
            current: {
                level: this.state.currentLevel,
                difficulty: this.state.currentDifficulty,
                correctCount: this.state.correctCount,
                wrongCount: this.state.wrongCount,
                displayedStreak: this.state.displayedStreak,
                expertStreak: this.state.expertStreak,
                dropCount: this.state.dropCount,
                promotionCount: this.state.promotionCount
            },
            ratio
        });

        const result = {
            isCorrect,
            correctAnswer: correctIndex,
            feedback: question.explanation || '',
            pointsEarned: isCorrect ? this.state.currentDifficulty * RBADA_CONSTANTS.POINTS_PER_DIFFICULTY : 0,
            streak: this.state.displayedStreak,  // Return displayed streak for UI
            expertStreak: this.state.expertStreak,  // Return expert streak for upgrade offer logic
            level: this.state.currentLevel,
            difficulty: this.state.currentDifficulty,
            timeTakenMs,
            score: this.state.score
        };

        this.state.currentQuestion = null;
        this.currentQuestionStartMs = null;
        return result;
    }

    applyAdaptiveRules(isCorrect) {
        let difficultyDelta = 0;
        const before = {
            difficulty: this.state.currentDifficulty,
            level: this.state.currentLevel,
            displayedStreak: this.state.displayedStreak,
            expertStreak: this.state.expertStreak,
            dropCount: this.state.dropCount,
            promotionCount: this.state.promotionCount
        };

        // 1️⃣ IMMEDIATE DROP RULE: First wrong answer AFTER ENTERING ANY difficulty causes immediate drop
        // Applies to ALL difficulties: Expert→Intermediate, Intermediate→Beginner
        // Triggers once per difficulty entry
        if (!this.state.immediateDropTriggered && !isCorrect && this.state.questionsInCurrentDifficulty === 1) {
            const previousDifficulty = this.state.currentDifficulty;
            
            // Immediate drop to next lower difficulty
            if (this.state.currentDifficulty > RBADA_CONSTANTS.MIN_DIFFICULTY) {
                this.state.previousDifficulty = previousDifficulty; // Store for recovery tracking
                this.state.currentDifficulty -= 1;
                this.state.immediateDropTriggered = true; // Mark as triggered for this difficulty entry
                this.state.questionsInCurrentDifficulty = 0; // Reset counter for new difficulty
                this.state.recoveryStreak = 0; // Reset recovery streak (will start counting in new difficulty)
                
                logAdaptive('immediate_drop_rule', {
                    fromDifficulty: previousDifficulty,
                    toDifficulty: this.state.currentDifficulty,
                    reason: 'first_wrong_after_entering_difficulty'
                });
                return; // Early return after immediate drop
            }
        }
        
        // Disable immediate drop flag after first answer (correct or wrong, if not triggered)
        if (!this.state.immediateDropTriggered && this.state.questionsInCurrentDifficulty === 1) {
            this.state.immediateDropTriggered = true; // Mark as processed (won't trigger again for this entry)
        }

        // 2️⃣ RECOVERY LOGIC (7-STREAK RULE): Track recovery streak separately
        // After dropping, user must achieve 7 consecutive correct in current difficulty to return
        // Recovery streak resets on wrong answer
        // Ratio-based logic cannot promote until recovery is satisfied
        const needsRecovery = this.state.previousDifficulty !== null && 
                              this.state.previousDifficulty > this.state.currentDifficulty;
        
        if (needsRecovery) {
            // User has dropped and needs to recover
            if (isCorrect) {
                this.state.recoveryStreak += 1;
            } else {
                // Reset recovery streak on wrong answer
                this.state.recoveryStreak = 0;
            }
            
            // Only promote back if recovery streak reaches 7
            if (this.state.recoveryStreak >= 7) {
                const currentDifficultyBeforeRecovery = this.state.currentDifficulty;
                difficultyDelta = 1; // Promote back to previous difficulty
                this.state.previousDifficulty = null; // Clear recovery tracking
                this.state.recoveryStreak = 0; // Reset recovery streak
                
                logAdaptive('recovery_7_streak', {
                    recoveryStreak: 7,
                    fromDifficulty: currentDifficultyBeforeRecovery,
                    toDifficulty: this.state.currentDifficulty + difficultyDelta,
                    reason: '7_consecutive_correct_recovery'
                });
            } else {
                // Do NOT allow ratio-based promotion until recovery is satisfied
                // Block normal difficulty increase - user must complete 7-streak recovery first
                difficultyDelta = 0; // No change until recovery complete
            }
        } else {
            // 4️⃣ NORMAL DIFFICULTY ADJUSTMENT LOGIC (no recovery needed)
            // Only apply if immediate drop was not triggered
            if (this.state.immediateDropTriggered || this.state.questionsInCurrentDifficulty > 1) {
                // Normal difficulty increase on correct answers
                if (isCorrect) {
                    difficultyDelta = 1;
                } else {
                    // Normal difficulty decrease on wrong answers
                    difficultyDelta = -1;
                    
                    // Additional decrease if ratio is very low
                    const ratio = this.state.wrongCount === 0 ? Infinity : this.state.correctCount / this.state.wrongCount;
                    if (ratio <= (1 / 9)) {
                        difficultyDelta = -1;
                    }
                }
            }
        }

        difficultyDelta = clamp(difficultyDelta, -1, 1);

        let nextDifficulty = this.state.currentDifficulty + difficultyDelta;

        if (nextDifficulty < RBADA_CONSTANTS.MIN_DIFFICULTY) {
            const previousLevel = this.state.currentLevel;
            const previousDifficulty = this.state.currentDifficulty;
            
            // Drop level by 1 and set difficulty to Expert (MAX_DIFFICULTY)
            this.state.currentLevel = clamp(this.state.currentLevel - 1, RBADA_CONSTANTS.MIN_LEVEL, RBADA_CONSTANTS.MAX_LEVEL);
            this.state.dropCount += 1;
            this.state.hasDroppedLevel = true;
            nextDifficulty = RBADA_CONSTANTS.MAX_DIFFICULTY; // Set to Expert when dropping level
            
            // Reset expert streak when leaving Expert (even if going to Expert in lower level)
            // This ensures expert streak only counts in the current Expert session
            this.state.expertStreak = 0;
            
            if (this.state.currentLevel > previousLevel) {
                this.state.currentLevel = previousLevel;
            }
            
            logAdaptive('level_drop', {
                fromLevel: previousLevel,
                toLevel: this.state.currentLevel,
                fromDifficulty: previousDifficulty,
                toDifficulty: nextDifficulty,
                reason: 'difficulty_below_min_drop_to_expert',
                displayedStreak: this.state.displayedStreak,
                expertStreak: this.state.expertStreak,
                dropCount: this.state.dropCount
            });
        }

        // Track difficulty changes for immediate drop rule reset
        const difficultyChanged = nextDifficulty !== before.difficulty;
        
        // When difficulty changes, reset immediate drop flag for new difficulty entry
        if (difficultyChanged) {
            this.state.immediateDropTriggered = false; // Reset flag for new difficulty entry
            this.state.questionsInCurrentDifficulty = 0; // Reset counter for new difficulty
            
            // If difficulty increased (promoted), clear recovery tracking
            if (nextDifficulty > before.difficulty) {
                this.state.previousDifficulty = null;
                this.state.recoveryStreak = 0;
            }
            
            // If difficulty decreased (dropped via normal adjustment), store previous difficulty for recovery
            if (nextDifficulty < before.difficulty && this.state.previousDifficulty === null) {
                this.state.previousDifficulty = before.difficulty;
                this.state.recoveryStreak = 0; // Start recovery streak tracking
            }
        }

        this.state.currentDifficulty = clamp(nextDifficulty, RBADA_CONSTANTS.MIN_DIFFICULTY, RBADA_CONSTANTS.MAX_DIFFICULTY);
        
        // Log only significant difficulty changes (not every answer)
        if (this.state.currentDifficulty !== before.difficulty && !(isCorrect && this.state.recoveryStreak >= 7 && difficultyDelta === 1)) {
            const ratio = this.state.wrongCount === 0 ? Infinity : this.state.correctCount / this.state.wrongCount;
            let reason = 'normal_adjustment';
            if (ratio <= (1 / 9)) {
                reason = 'low_correct_wrong_ratio';
            } else if (isCorrect) {
                reason = 'correct_answer_increase';
            } else {
                reason = 'wrong_answer_decrease';
            }
            
            logAdaptive('difficulty_change', {
                from: before.difficulty,
                to: this.state.currentDifficulty,
                reason: reason
            });
        }

        // Level promotion based on displayed streak (not expert streak)
        if (this.state.hasDroppedLevel && this.state.displayedStreak >= 7) {
            const previousLevel = this.state.currentLevel;
            this.state.currentLevel = clamp(this.state.currentLevel + 1, RBADA_CONSTANTS.MIN_LEVEL, RBADA_CONSTANTS.MAX_LEVEL);
            if (this.state.currentLevel > previousLevel) {
                this.state.hasDroppedLevel = false;
                this.state.promotionCount += 1;
                logAdaptive('level_promotion', {
                    fromLevel: previousLevel,
                    toLevel: this.state.currentLevel,
                    reason: 'recovery_displayed_streak',
                    promotionCount: this.state.promotionCount,
                    displayedStreak: this.state.displayedStreak
                });
            }
        }
    }

    getProgress() {
        const total = this.getQuestionCount();
        const current = Math.min(this.state.totalAnswered + (this.state.currentQuestion ? 1 : 0), total);
        return { current, total };
    }

    upgradeLevel() {
        // Upgrade to next level with Beginner difficulty (difficulty 1)
        const previousLevel = this.state.currentLevel;
        const previousDifficulty = this.state.currentDifficulty;
        
        if (this.state.currentLevel < RBADA_CONSTANTS.MAX_LEVEL) {
            this.state.currentLevel = clamp(this.state.currentLevel + 1, RBADA_CONSTANTS.MIN_LEVEL, RBADA_CONSTANTS.MAX_LEVEL);
            this.state.currentDifficulty = RBADA_CONSTANTS.MIN_DIFFICULTY; // Beginner difficulty
            this.state.promotionCount += 1;
            
            logAdaptive('level_upgrade_offer', {
                fromLevel: previousLevel,
                toLevel: this.state.currentLevel,
                fromDifficulty: previousDifficulty,
                toDifficulty: this.state.currentDifficulty,
                reason: 'streak_10_expert_upgrade',
                streak: this.state.streak
            });
            
            return {
                success: true,
                previousLevel,
                newLevel: this.state.currentLevel,
                previousDifficulty,
                newDifficulty: this.state.currentDifficulty
            };
        }
        
        return {
            success: false,
            reason: 'max_level_reached'
        };
    }

    getState() {
        return {
            currentLevel: this.state.currentLevel,
            currentDifficulty: this.state.currentDifficulty,
            correctCount: this.state.correctCount,
            wrongCount: this.state.wrongCount,
            totalAnswered: this.state.totalAnswered,
            streak: this.state.displayedStreak,  // Return displayed streak for UI compatibility
            displayedStreak: this.state.displayedStreak,  // Explicit displayed streak
            expertStreak: this.state.expertStreak,  // Expert streak for upgrade offer logic
            hasDroppedLevel: this.state.hasDroppedLevel,
            dropCount: this.state.dropCount,
            promotionCount: this.state.promotionCount,
            score: this.state.score,
            totalTimeMs: this.state.totalTimeMs
        };
    }

    getPerformanceSummary() {
        const totalQuestions = this.state.totalAnswered;
        const accuracy = totalQuestions > 0 ? Math.round((this.state.correctCount / totalQuestions) * 100) : 0;
        const categoryPerformance = this.buildCategoryPerformance();
        const totalTimeSeconds = Math.round(this.state.totalTimeMs / 1000);
        const averageTimeMs = totalQuestions > 0 ? Math.round(this.state.totalTimeMs / totalQuestions) : 0;
        const questionsPerMinute = totalTimeSeconds > 0 ? Math.round((totalQuestions / (totalTimeSeconds / 60)) * 10) / 10 : 0;
        const bestStreak = this.calculateBestStreak();
        const totalScore = this.state.score;
        const initialLevel = this.sessionConfig.initialLevel || 1;
        const finalLevel = this.state.currentLevel;
        const initialDifficulty = this.sessionConfig.initialDifficulty || 1;
        const finalDifficulty = this.state.currentDifficulty;
        const netLevelChange = finalLevel - initialLevel;
        const netDifficultyChange = finalDifficulty - initialDifficulty;
        
        const storedSetup = typeof window !== 'undefined' ? localStorage.getItem('neuroquizUserSetup') : null;
        let userName = 'User';
        if (storedSetup) {
            try {
                const parsed = JSON.parse(storedSetup);
                if (parsed.name) {
                    userName = parsed.name;
                }
            } catch (e) {
                console.warn('Failed to parse user setup for name:', e);
            }
        }
        
        const summary = {
            userName: userName,
            totalQuestions,
            correctAnswers: this.state.correctCount,
            wrongAnswers: this.state.wrongCount,
            percentage: accuracy,
            accuracy: accuracy,
            timeTaken: totalTimeSeconds,
            totalTimeMs: this.state.totalTimeMs,
            averageTimeMs: averageTimeMs,
            questionsPerMinute: questionsPerMinute,
            bestStreak: bestStreak,
            totalScore: totalScore,
            currentLevel: finalLevel,
            currentDifficulty: finalDifficulty,
            initialLevel: initialLevel,
            finalLevel: finalLevel,
            initialDifficulty: initialDifficulty,
            finalDifficulty: finalDifficulty,
            netLevelChange: netLevelChange,
            netDifficultyChange: netDifficultyChange,
            dropCount: this.state.dropCount,
            promotionCount: this.state.promotionCount,
            streak: this.state.displayedStreak,  // Displayed streak for compatibility
            displayedStreak: this.state.displayedStreak,
            expertStreak: this.state.expertStreak,
            hasDroppedLevel: this.state.hasDroppedLevel,
            performanceHistory: this.state.performanceHistory.slice(),
            categoryPerformance: categoryPerformance,
            sessionConfig: this.sessionConfig,
            answeredQuestionIds: Array.from(this.state.answeredQuestionIds)
        };
        
        if (typeof window !== 'undefined' && window.CognitiveAnalyzer) {
            summary.cognitiveProfile = window.CognitiveAnalyzer.analyzeCognitiveProfile(summary);
        }
        
        return summary;
    }
    
    calculateBestStreak() {
        let bestStreak = 0;
        let currentStreak = 0;
        
        for (const entry of this.state.performanceHistory) {
            if (entry.isCorrect) {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        
        return bestStreak;
    }

    buildCategoryPerformance() {
        const summary = {};
        this.state.performanceHistory.forEach(entry => {
            if (!summary[entry.category]) {
                summary[entry.category] = { correct: 0, total: 0 };
            }
            summary[entry.category].total += 1;
            if (entry.isCorrect) {
                summary[entry.category].correct += 1;
            }
        });
        return summary;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizEngine };
}

if (typeof window !== 'undefined') {
    window.QuizEngine = QuizEngine;
}

