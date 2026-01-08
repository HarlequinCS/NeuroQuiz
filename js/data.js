/**
 * NeuroQuiz™ - Question Data
 * 
 * ⚠️ LEAD DEVELOPER + CONTENT LEAD ONLY ⚠️
 * 
 * This file contains the question bank in JSON format.
 * 
 * UI Team: You can view this file to understand question structure,
 * but do not modify question content or structure without approval.
 * 
 * Question Structure:
 * {
 *   id: number,
 *   question: string,
 *   options: string[],
 *   correctAnswer: number (0-based index),
 *   category: string,
 *   difficulty: number (1-5),
 *   explanation: string,
 *   tags: string[]
 * }
 */

/**
 * Question Bank
 * Array of question objects
 */
const QUESTION_BANK = [
    // TODO: Content Lead - Add questions here
    // Example structure (DO NOT USE - Replace with actual questions):
    /*
    {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        category: "Geography",
        difficulty: 1,
        explanation: "Paris is the capital and largest city of France.",
        tags: ["geography", "europe", "capitals"]
    },
    */
    
    // Placeholder - Remove when adding real questions
    {
        id: 0,
        question: "Sample Question - Replace with actual questions",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        category: "General",
        difficulty: 1,
        explanation: "This is a placeholder question. Replace with actual content.",
        tags: ["placeholder"]
    }
];

/**
 * Category Metadata
 * Information about question categories
 */
const CATEGORIES = {
    // TODO: Content Lead - Define categories
    // Example:
    /*
    "Geography": {
        name: "Geography",
        description: "Questions about world geography",
        color: "#2563eb"
    },
    */
};

/**
 * Difficulty Levels Metadata
 */
const DIFFICULTY_LEVELS = {
    1: { name: "Easy", points: 10 },
    2: { name: "Medium", points: 20 },
    3: { name: "Hard", points: 30 },
    4: { name: "Expert", points: 40 },
    5: { name: "Master", points: 50 }
};

/**
 * Get all questions
 * @returns {Array} Array of all questions
 */
function getAllQuestions() {
    return QUESTION_BANK;
}

/**
 * Get questions by category
 * @param {string} category - Category name
 * @returns {Array} Filtered questions
 */
function getQuestionsByCategory(category) {
    return QUESTION_BANK.filter(q => q.category === category);
}

/**
 * Get questions by difficulty
 * @param {number} difficulty - Difficulty level (1-5)
 * @returns {Array} Filtered questions
 */
function getQuestionsByDifficulty(difficulty) {
    return QUESTION_BANK.filter(q => q.difficulty === difficulty);
}

/**
 * Get random question set
 * @param {number} count - Number of questions
 * @returns {Array} Random question subset
 */
function getRandomQuestions(count) {
    // TODO: Lead Developer - Implement random selection with constraints
    // Consider: category distribution, difficulty spread, etc.
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Export for use in engine.js and quiz-ui.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QUESTION_BANK,
        CATEGORIES,
        DIFFICULTY_LEVELS,
        getAllQuestions,
        getQuestionsByCategory,
        getQuestionsByDifficulty,
        getRandomQuestions
    };
}

// Global access
window.QUESTION_BANK = QUESTION_BANK;
window.CATEGORIES = CATEGORIES;
window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;

