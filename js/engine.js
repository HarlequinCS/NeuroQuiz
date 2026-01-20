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
            displayedStreak: 0,  // Never resets on difficulty change, only on wrong answer
            expertStreak: 0,     // Only counts in Expert difficulty, resets when leaving Expert or wrong in Expert
            wrongStreak: 0,      // NEW: Tracks consecutive wrong answers for 5-wrong drop rule
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
            immediateDropDisabled: false,  // Session-based: disabled after first question (correct or wrong) OR if triggered
            correctStreak: 0,  // Tracks consecutive correct answers for difficulty increase (5 = +1)
            wrongStreak: 0  // Tracks consecutive wrong answers for difficulty decrease (5 = -1)
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
        // Shuffle options to prevent predictable patterns (e.g., longest answer always correct)
        const options = [...question.options];
        const originalCorrectIndex = question.correctIndex;
        
        // Create array of indices for shuffling
        const indices = options.map((_, index) => index);
        
        // Fisher-Yates shuffle algorithm for true randomness
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Shuffle options array using the shuffled indices
        const shuffledOptions = indices.map(index => options[index]);
        
        // Find new position of correct answer
        const newCorrectIndex = indices.indexOf(originalCorrectIndex);
        
        // Update the question's correctIndex to match shuffled position
        question.correctIndex = newCorrectIndex;
        
        return {
            id: question.id,
            question: question.question,
            options: shuffledOptions,
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
        
        // Track difficulty before adjustment
        const difficultyBefore = this.state.currentDifficulty;
        const wasInExpertBefore = difficultyBefore === RBADA_CONSTANTS.MAX_DIFFICULTY;
        
        // Apply adaptive rules FIRST to determine new difficulty
        this.applyAdaptiveRules(isCorrect);
        
        // Track difficulty after adjustment
        const difficultyAfter = this.state.currentDifficulty;
        const isNowInExpert = difficultyAfter === RBADA_CONSTANTS.MAX_DIFFICULTY;
        
        // =====================================================================
        // EXPERT STREAK LOGIC
        // =====================================================================
        // 1. Counts ONLY when difficulty === Expert
        // 2. Increments on correct answers consecutively
        // 3. Resets when: leaving Expert OR wrong answer in Expert
        // =====================================================================
        if (isNowInExpert) {
            // In Expert difficulty
            if (isCorrect) {
                this.state.expertStreak += 1;
            } else {
                // Wrong answer in Expert - reset streak
                this.state.expertStreak = 0;
                logAdaptive('expert_streak_reset', {
                    reason: 'wrong_answer_in_expert'
                });
            }
        } else {
            // Not in Expert - ensure expertStreak is 0
            // (Reset handled in applyAdaptiveRules when leaving Expert)
            this.state.expertStreak = 0;
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
        const before = {
            difficulty: this.state.currentDifficulty,
            level: this.state.currentLevel
        };

        // =====================================================================
        // IMMEDIATE DROP RULE (SESSION-BASED)
        // =====================================================================
        // 1. Triggers ONLY on FIRST question of session if wrong
        // 2. Can trigger ONLY ONCE per session
        // 3. Permanently disabled after first question (correct OR wrong)
        // 4. Affects LEVEL if difficulty would go below Beginner
        // =====================================================================
        const isFirstQuestion = this.state.totalAnswered === 1;
        
        if (isFirstQuestion && !this.state.immediateDropDisabled) {
            if (!isCorrect) {
                // First question wrong - immediate drop
                const previousDifficulty = this.state.currentDifficulty;
                const previousLevel = this.state.currentLevel;
                
                if (this.state.currentDifficulty > RBADA_CONSTANTS.MIN_DIFFICULTY) {
                    // Drop difficulty by 1
                    this.state.currentDifficulty -= 1;
                    
                    logAdaptive('immediate_drop_rule', {
                        fromDifficulty: previousDifficulty,
                        toDifficulty: this.state.currentDifficulty,
                        fromLevel: previousLevel,
                        toLevel: this.state.currentLevel,
                        reason: 'first_question_wrong_session'
                    });
                } else {
                    // At Beginner - drop LEVEL by 1 and set difficulty to Expert
                    if (this.state.currentLevel > RBADA_CONSTANTS.MIN_LEVEL) {
                        this.state.currentLevel -= 1;
                        this.state.currentDifficulty = RBADA_CONSTANTS.MAX_DIFFICULTY; // Expert
                        this.state.hasDroppedLevel = true;
                        this.state.dropCount += 1;
                        this.state.expertStreak = 0; // Reset when leaving Expert
                        
                        logAdaptive('immediate_drop_rule_level', {
                            fromDifficulty: previousDifficulty,
                            toDifficulty: this.state.currentDifficulty,
                            fromLevel: previousLevel,
                            toLevel: this.state.currentLevel,
                            reason: 'first_question_wrong_at_beginner_drop_level'
                        });
                    }
                }
                
                // Permanently disable immediate drop for session
                this.state.immediateDropDisabled = true;
                
                // Reset streaks after immediate drop
                this.state.correctStreak = 0;
                this.state.wrongStreak = 0;
                
                return; // Early return - no further processing
            } else {
                // First question correct - disable immediate drop permanently
                this.state.immediateDropDisabled = true;
            }
        }

        // =====================================================================
        // NORMAL GAME LOGIC (STREAK-ONLY, AFTER IMMEDIATE DROP DISABLED)
        // =====================================================================
        // 1. Difficulty UP: 5 consecutive correct → difficulty +1
        // 2. Difficulty DOWN: 5 consecutive wrong → difficulty -1
        // 3. If difficulty < Beginner: Level -1, Difficulty = Expert
        // 4. If difficulty > Expert: Clamp to Expert
        // 5. NO recovery logic - just normal streak logic
        // =====================================================================
        
        // Track streaks
        if (isCorrect) {
            this.state.correctStreak += 1;
            this.state.wrongStreak = 0; // Reset wrong streak on correct
        } else {
            this.state.wrongStreak += 1;
            this.state.correctStreak = 0; // Reset correct streak on wrong
        }
        
        let difficultyDelta = 0;
        
        // Difficulty UP: 5 consecutive correct
        if (this.state.correctStreak >= 5) {
            difficultyDelta = 1;
            
            logAdaptive('difficulty_increase_5_correct', {
                fromDifficulty: this.state.currentDifficulty,
                toDifficulty: this.state.currentDifficulty + difficultyDelta,
                reason: '5_consecutive_correct_answers'
            });
        }
        
        // Difficulty DOWN: 5 consecutive wrong
        if (this.state.wrongStreak >= 5) {
            difficultyDelta = -1;
            
            logAdaptive('difficulty_decrease_5_wrong', {
                fromDifficulty: this.state.currentDifficulty,
                toDifficulty: this.state.currentDifficulty + difficultyDelta,
                reason: '5_consecutive_wrong_answers'
            });
        }
        
        // Apply difficulty change
        let nextDifficulty = this.state.currentDifficulty + difficultyDelta;
        
        // Handle difficulty below Beginner: Drop level
        if (nextDifficulty < RBADA_CONSTANTS.MIN_DIFFICULTY) {
            if (this.state.currentLevel > RBADA_CONSTANTS.MIN_LEVEL) {
                const previousLevel = this.state.currentLevel;
                this.state.currentLevel -= 1;
                this.state.hasDroppedLevel = true;
                this.state.dropCount += 1;
                nextDifficulty = RBADA_CONSTANTS.MAX_DIFFICULTY; // Set to Expert
                this.state.expertStreak = 0; // Reset when leaving Expert
                
                logAdaptive('level_drop_5_wrong', {
                    fromLevel: previousLevel,
                    toLevel: this.state.currentLevel,
                    fromDifficulty: this.state.currentDifficulty,
                    toDifficulty: nextDifficulty,
                    reason: '5_wrong_at_beginner_drop_level'
                });
            } else {
                // Already at minimum level - clamp difficulty to Beginner
                nextDifficulty = RBADA_CONSTANTS.MIN_DIFFICULTY;
            }
        }
        
        // Clamp difficulty to valid range
        nextDifficulty = clamp(nextDifficulty, RBADA_CONSTANTS.MIN_DIFFICULTY, RBADA_CONSTANTS.MAX_DIFFICULTY);
        
        // Track difficulty change for streak reset and expert streak reset
        const difficultyChanged = nextDifficulty !== before.difficulty;
        
        // Reset streaks ONLY if difficulty actually changed
        if (difficultyChanged) {
            if (difficultyDelta > 0) {
                // Difficulty increased - reset correct streak
                this.state.correctStreak = 0;
            } else if (difficultyDelta < 0) {
                // Difficulty decreased - reset wrong streak
                this.state.wrongStreak = 0;
            }
        } else {
            // Difficulty didn't change (clamped) - reset the streak that triggered the attempt
            if (difficultyDelta > 0 && this.state.correctStreak >= 5) {
                // At Expert, tried to increase - reset correct streak
                this.state.correctStreak = 0;
            } else if (difficultyDelta < 0 && this.state.wrongStreak >= 5) {
                // At Beginner (min level), tried to decrease - reset wrong streak
                this.state.wrongStreak = 0;
            }
        }
        
        // If leaving Expert, reset expertStreak
        if (difficultyChanged && before.difficulty === RBADA_CONSTANTS.MAX_DIFFICULTY && nextDifficulty !== RBADA_CONSTANTS.MAX_DIFFICULTY) {
            this.state.expertStreak = 0;
            logAdaptive('expert_streak_reset', {
                reason: 'left_expert_difficulty'
            });
        }
        
        // If entering Expert, ensure expertStreak starts at 0 (will be incremented in submitAnswer if correct)
        if (difficultyChanged && before.difficulty !== RBADA_CONSTANTS.MAX_DIFFICULTY && nextDifficulty === RBADA_CONSTANTS.MAX_DIFFICULTY) {
            this.state.expertStreak = 0;
        }
        
        this.state.currentDifficulty = nextDifficulty;
        
        // Log difficulty change
        if (difficultyChanged) {
            let reason = 'unknown';
            if (difficultyDelta > 0) {
                reason = '5_correct_streak';
            } else if (difficultyDelta < 0) {
                reason = '5_wrong_streak';
            } else if (this.state.currentLevel < before.level) {
                reason = 'level_drop';
            }
            
            logAdaptive('difficulty_change', {
                from: before.difficulty,
                to: this.state.currentDifficulty,
                fromLevel: before.level,
                toLevel: this.state.currentLevel,
                reason: reason
            });
        } else if (difficultyDelta !== 0) {
            // Difficulty attempted to change but was clamped
            logAdaptive('difficulty_clamped', {
                attemptedDelta: difficultyDelta,
                currentDifficulty: this.state.currentDifficulty,
                reason: difficultyDelta > 0 ? 'at_max_expert' : 'at_min_beginner'
            });
        }
    }

    getProgress() {
        const total = this.getQuestionCount();
        const current = Math.min(this.state.totalAnswered + (this.state.currentQuestion ? 1 : 0), total);
        return { current, total };
    }

    upgradeLevel() {
        // 6️⃣ LEVEL-UP OFFER LOGIC (FIXED)
        // Triggers ONLY in Expert difficulty
        // Triggers every 10 expertStreak (10, 20, 30, etc.)
        // If user declines, offer reappears at next 10-streak milestone
        
        // Only allow if in Expert difficulty
        if (this.state.currentDifficulty !== RBADA_CONSTANTS.MAX_DIFFICULTY) {
            return {
                success: false,
                reason: 'not_in_expert_difficulty',
                currentDifficulty: this.state.currentDifficulty
            };
        }
        
        // Check if expertStreak is at a 10-milestone
        if (this.state.expertStreak < 10 || this.state.expertStreak % 10 !== 0) {
            return {
                success: false,
                reason: 'expert_streak_not_at_milestone',
                currentStreak: this.state.expertStreak,
                nextMilestone: Math.ceil(this.state.expertStreak / 10) * 10
            };
        }
        
        // Level-up offer available - proceed with upgrade
        const previousLevel = this.state.currentLevel;
        const previousDifficulty = this.state.currentDifficulty;
        
        if (this.state.currentLevel < RBADA_CONSTANTS.MAX_LEVEL) {
            this.state.currentLevel = clamp(this.state.currentLevel + 1, RBADA_CONSTANTS.MIN_LEVEL, RBADA_CONSTANTS.MAX_LEVEL);
            this.state.currentDifficulty = RBADA_CONSTANTS.MIN_DIFFICULTY; // Beginner difficulty
            this.state.promotionCount += 1;
            
            // Reset streaks after level-up
            this.state.correctStreak = 0;
            this.state.wrongStreak = 0;
            this.state.expertStreak = 0; // Reset after level-up
            // Do NOT reset immediateDropDisabled - it's session-based
            
            logAdaptive('level_upgrade_offer_accepted', {
                fromLevel: previousLevel,
                toLevel: this.state.currentLevel,
                fromDifficulty: previousDifficulty,
                toDifficulty: this.state.currentDifficulty,
                expertStreak: this.state.expertStreak,
                reason: 'expert_streak_milestone_reached'
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
            correctStreak: this.state.correctStreak,  // Consecutive correct for difficulty increase
            wrongStreak: this.state.wrongStreak,  // Consecutive wrong for difficulty decrease
            immediateDropDisabled: this.state.immediateDropDisabled,  // Session-based immediate drop status
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

