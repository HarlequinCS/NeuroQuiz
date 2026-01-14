# NeuroAdapt™ Engine Documentation

> **Technical Reference for the Adaptive Quiz Engine**

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [API Reference](#api-reference)
5. [Adaptive Algorithm](#adaptive-algorithm)
6. [Scoring System](#scoring-system)
7. [Data Flow](#data-flow)
8. [Configuration](#configuration)
9. [Usage Examples](#usage-examples)
10. [Future Enhancements](#future-enhancements)

---

## Overview

The **NeuroQuiz Rule-Based Adaptive Dynamic Algorithm (RB-ADA)** (`js/engine.js`) is a client-side adaptive quiz engine that dynamically adjusts question difficulty and education level based on user performance. Developed by **Saiful Iqbal, Lead Developer, Team ChendAwan**, it serves as the core logic layer for the NeuroQuiz application, handling:

- **User Setup** — Configures initial level, category, and literacy level
- **Question Selection** — Intelligently selects questions based on current level and difficulty
- **Answer Evaluation** — Validates user responses and tracks performance
- **Adaptive Difficulty** — Rule-based algorithm adjusts difficulty and level based on performance
- **Score Management** — Calculates scores with difficulty-based multipliers
- **Performance Tracking** — Records time, history, and adaptive changes
- **State Management** — Maintains all session data throughout the quiz

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NeuroAdapt™ Engine                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐ │
│  │   CONFIG    │    │  gameState  │    │     QUESTION_POOL       │ │
│  │             │    │             │    │                         │ │
│  │ BASE_SCORE  │    │ difficulty  │    │ [Questions by Level]    │ │
│  │ STREAK_THR  │◄──►│ score       │◄──►│ - Level 1 (Beginner)    │ │
│  │ MAX_LEVEL   │    │ streak      │    │ - Level 2 (Easy)        │ │
│  │ MIN_LEVEL   │    │ correct/    │    │ - Level 3 (Medium)      │ │
│  │             │    │   wrong     │    │ - Level 4 (Hard)        │ │
│  └─────────────┘    │ answered[]  │    │ - Level 5 (Expert)      │ │
│                     └─────────────┘    └─────────────────────────┘ │
│                            │                       │               │
│                            ▼                       ▼               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CORE FUNCTIONS                            │  │
│  │                                                              │  │
│  │  getNextQuestion()  →  Selects question based on difficulty  │  │
│  │  submitAnswer()     →  Evaluates answer, updates state       │  │
│  │  resetGame()        →  Resets to initial state               │  │
│  │  getGameState()     →  Returns current state snapshot        │  │
│  │  getConfig()        →  Returns configuration constants       │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            │                                       │
│                            ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      EXPORTS                                 │  │
│  │  - module.exports (CommonJS for bundlers)                    │  │
│  │  - window.NeuroAdaptEngine (Global for browser)              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Configuration Constants (`RBADA_CONSTANTS`)

Centralized constants that control game mechanics:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `MIN_LEVEL` | Number | `1` | Minimum education level (Elementary) |
| `MAX_LEVEL` | Number | `3` | Maximum education level (University) |
| `MIN_DIFFICULTY` | Number | `1` | Minimum difficulty level |
| `MAX_DIFFICULTY` | Number | `3` | Maximum difficulty level |
| `POINTS_PER_DIFFICULTY` | Number | `10` | Points multiplier per difficulty level |

### Literacy Level Mapping

| Literacy Level | Difficulty |
|----------------|------------|
| Beginner | 1 |
| Intermediate | 2 |
| Expert | 3 |

### 2. Game State Object (`state`)

Tracks all session data and adaptive algorithm state:

| Property | Type | Initial | Description |
|----------|------|---------|-------------|
| `currentLevel` | Number | `1-3` | Current education level (Elementary/Secondary/University) |
| `currentDifficulty` | Number | `1-3` | Current difficulty level (based on literacy) |
| `correctCount` | Number | `0` | Total correct answers |
| `wrongCount` | Number | `0` | Total wrong answers |
| `totalAnswered` | Number | `0` | Total questions answered |
| `streak` | Number | `0` | Current consecutive correct answers |
| `hasDroppedLevel` | Boolean | `false` | Whether user has dropped a level |
| `dropCount` | Number | `0` | Number of times level was dropped |
| `promotionCount` | Number | `0` | Number of times level was promoted |
| `score` | Number | `0` | Total accumulated score |
| `performanceHistory` | Array | `[]` | Per-question performance records |
| `answeredQuestionIds` | Set | `new Set()` | IDs of answered questions |
| `totalTimeMs` | Number | `0` | Total time spent (milliseconds) |
| `currentQuestion` | Object\|null | `null` | Currently active question |
| `sessionStartMs` | Number | `Date.now()` | Session start timestamp |

### 3. Question Pool

Questions are loaded from JSON files in `data/` directory:
- `logic.json` (IDs: 2001-2300)
- `math.json` (IDs: 1-300)
- `stem.json` (IDs: 3001-3300)
- `literature.json` (IDs: 4001-4300)
- `gk.json` (IDs: 5001-5300)

Each question object structure:

```javascript
{
    id: Number,           // Unique identifier
    level: Number,        // Education level (1-3)
    difficulty: String,   // "easy" | "medium" | "hard"
    category: String,     // Question category
    question: String,     // Question text
    options: String[],    // Array of 4 answer options
    answer: Number,       // Index of correct answer (0-3)
    explanation: String   // Explanation shown after answer
}
```

Questions are normalized to internal format with:
- `level`: Clamped to 1-3
- `difficulty`: Mapped to 1-3 (easy=1, medium=2, hard=3)
- `correctIndex`: Unified from various field names

---

## API Reference

### `getCurrentQuestion()`

Retrieves the current question based on level and difficulty.

**Returns:** `Object | null`

```javascript
{
    id: Number,           // Question identifier
    level: Number,        // Education level (1-3)
    difficulty: Number,   // Difficulty level (1-3)
    category: String,     // Question category
    question: String,     // Question text
    options: String[],    // Answer options (copy, prevents mutation)
    explanation: String   // Explanation text
}
// Returns null if quiz is complete
```

**Behavior:**
1. Checks if quiz is complete
2. If no current question, selects next candidate
3. Filters questions matching `currentLevel` and `currentDifficulty`
4. Falls back to level-only match, then difficulty-only match
5. Excludes already answered questions
6. Starts timer for question
7. Returns question without answer index (stripped for security)

---

### `submitAnswer(selectedIndex)`

Evaluates the user's answer and applies RB-ADA adaptive rules.

**Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `selectedIndex` | Number | Index of selected answer (0-3) |

**Returns:** `Object | null`

```javascript
{
    isCorrect: Boolean,         // Whether answer is correct
    correctAnswer: Number,      // Index of correct answer
    feedback: String,           // Question explanation
    pointsEarned: Number,       // Points earned (0 if wrong)
    streak: Number,             // Updated streak count
    level: Number,              // Current education level (1-3)
    difficulty: Number,         // Current difficulty level (1-3)
    timeTakenMs: Number,        // Time taken for this question
    score: Number               // Updated total score
}
// Returns null if no question available
```

**Behavior:**

1. **Time Tracking**: Records time taken from question start
2. **Answer Evaluation**: Compares selected index with correct answer
3. **State Update**:
   - If correct: increments `streak`, `correctCount`, adds to score
   - If wrong: resets `streak`, increments `wrongCount`
4. **Performance History**: Records question performance with metadata
5. **Adaptive Rules**: Applies RB-ADA rules (see Adaptive Algorithm section)
6. **Console Logging**: Logs adaptive changes for debugging
7. **Result Return**: Returns comprehensive feedback object

---

### `resetGame()`

Resets all game state to initial values.

**Returns:** `Object` — Copy of the initial game state

**Usage:** Call at quiz start or to restart

---

### `getState()`

Returns a read-only snapshot of current game state.

**Returns:** `Object`

```javascript
{
    currentLevel: Number,        // Education level (1-3)
    currentDifficulty: Number,  // Difficulty level (1-3)
    correctCount: Number,        // Total correct answers
    wrongCount: Number,          // Total wrong answers
    totalAnswered: Number,        // Total questions answered
    streak: Number,              // Current streak
    hasDroppedLevel: Boolean,     // Whether level was dropped
    dropCount: Number,           // Number of level drops
    promotionCount: Number,       // Number of level promotions
    score: Number,               // Total score
    totalTimeMs: Number          // Total time in milliseconds
}
```

### `getPerformanceSummary()`

Returns comprehensive performance summary for results page.

**Returns:** `Object`

```javascript
{
    totalQuestions: Number,              // Total questions answered
    correctAnswers: Number,              // Correct count
    wrongAnswers: Number,                // Wrong count
    percentage: Number,                  // Accuracy percentage
    timeTaken: Number,                   // Total time in seconds
    averageTimeMs: Number,                // Average time per question
    currentLevel: Number,                 // Final education level
    currentDifficulty: Number,           // Final difficulty level
    dropCount: Number,                    // Number of level drops
    promotionCount: Number,               // Number of level promotions
    streak: Number,                      // Final streak
    hasDroppedLevel: Boolean,            // Whether level was dropped
    performanceHistory: Array,            // Per-question history
    categoryPerformance: Object,         // Performance by category
    sessionConfig: Object,                // Session configuration
    answeredQuestionIds: Array           // List of answered question IDs
}
```

---

### `getProgress()`

Returns current quiz progress information.

**Returns:** `Object`

```javascript
{
    current: Number,  // Current question number
    total: Number    // Total questions available
}
```

---

## Adaptive Algorithm: RB-ADA

The engine uses the **Rule-Based Adaptive Dynamic Algorithm (RB-ADA)** developed by **Saiful Iqbal, Team ChendAwan**. This algorithm adjusts both difficulty and education level based on user performance.

### Algorithm Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              RB-ADA ADAPTIVE ALGORITHM FLOW                    │
└─────────────────────────────────────────────────────────────────┘

                    User Answers Question
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              ┌─────────┐       ┌─────────┐
              │ CORRECT │       │  WRONG  │
              └────┬────┘       └────┬────┘
                   │                 │
                   ▼                 ▼
            streak++            streak = 0
            correctCount++      wrongCount++
            score += diff×10    (no score)
                   │                 │
                   ▼                 ▼
         ┌─────────────────────────────────────┐
         │     ADAPTIVE RULE EVALUATION        │
         └─────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
    Rule 1: First      Rule 2: Ratio      Rule 3: Level
    Question Wrong      Check (≤1:9)      Drop/Promote
         │                   │                   │
         ▼                   ▼                   ▼
    difficulty -= 1    difficulty -= 1    level ± 1
    (if first Q)       (if ratio low)     (if needed)
```

### Adaptive Rules

#### Rule 1: First Question Penalty
```
IF first question is incorrect:
    currentDifficulty -= 1
```

#### Rule 2: Performance Ratio Check
```
IF correct:wrong ratio ≤ 1:9:
    currentDifficulty -= 1
```

#### Rule 3: Level Drop (Difficulty Underflow)
```
IF currentDifficulty < MIN_DIFFICULTY (1):
    currentLevel -= 1
    hasDroppedLevel = true
    dropCount++
    currentDifficulty = MIN_DIFFICULTY
```

#### Rule 4: Level Promotion (Recovery)
```
IF hasDroppedLevel === true AND streak ≥ 7:
    currentLevel += 1
    hasDroppedLevel = false
    streak = 0
    promotionCount++
```

### Constraints

- **Difficulty changes**: Only ±1 per evaluation
- **Level changes**: Only ±1 per evaluation
- **Level bounds**: Clamped to 1-3 (Elementary, Secondary, University)
- **Difficulty bounds**: Clamped to 1-3

### Education Levels

| Level | Name | Description |
|-------|------|-------------|
| 1 | Elementary | Basic questions for elementary education |
| 2 | Secondary | Intermediate questions for secondary education |
| 3 | University | Advanced questions for university/adult level |

### Difficulty Levels

| Difficulty | Name | Description |
|------------|------|-------------|
| 1 | Easy | Beginner-level difficulty |
| 2 | Medium | Intermediate difficulty |
| 3 | Hard | Expert-level difficulty |

### State Persistence

All state variables persist throughout the session:
- `currentLevel`: Tracks education level progression
- `currentDifficulty`: Tracks difficulty within level
- `hasDroppedLevel`: Flag for recovery mechanism
- `dropCount`: Tracks number of level drops
- `promotionCount`: Tracks number of level promotions

---

## Scoring System

Points are calculated with a **difficulty multiplier**:

```
Score = POINTS_PER_DIFFICULTY × Current Difficulty Level
```

| Difficulty | Points per Correct |
|------------|-------------------|
| Difficulty 1 | 10 points |
| Difficulty 2 | 20 points |
| Difficulty 3 | 30 points |

**Example Session with RB-ADA:**

| Question | Level | Difficulty | Result | Ratio | Streak | Score | Adaptive Change |
|----------|-------|------------|--------|-------|--------|-------|-----------------|
| Q1 | 2 | 2 | ✗ | 0:1 | 0 | 0 | Difficulty→1 (Rule 1) |
| Q2 | 2 | 1 | ✗ | 0:2 | 0 | 0 | Difficulty→1, Level→1 (Rule 3) |
| Q3 | 1 | 1 | ✓ | 1:2 | 1 | 10 | - |
| Q4 | 1 | 1 | ✓ | 2:2 | 2 | 20 | - |
| Q5 | 1 | 1 | ✓ | 3:2 | 3 | 30 | - |
| Q6 | 1 | 1 | ✓ | 4:2 | 4 | 40 | - |
| Q7 | 1 | 1 | ✓ | 5:2 | 5 | 50 | - |
| Q8 | 1 | 1 | ✓ | 6:2 | 6 | 60 | - |
| Q9 | 1 | 1 | ✓ | 7:2 | 7 | 70 | Level→2 (Rule 4) |
| Q10 | 2 | 1 | ✓ | 8:2 | 0 | 80 | - |

---

## Data Flow

### Quiz Session Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                         QUIZ SESSION FLOW                            │
└──────────────────────────────────────────────────────────────────────┘

  [Start Quiz]
       │
       ▼
  resetGame()  ──────────────────────────────────────────────┐
       │                                                     │
       ▼                                                     │
  ┌────────────────┐                                         │
  │ getNextQuestion│◄────────────────────────────┐           │
  └───────┬────────┘                             │           │
          │                                      │           │
          ▼                                      │           │
    question !== null?                           │           │
          │                                      │           │
    YES   │   NO                                 │           │
     │    │    │                                 │           │
     │    │    └──────► [Quiz Complete]          │           │
     │    │             Show Results             │           │
     ▼    │                                      │           │
  Display Question                               │           │
     │                                           │           │
     ▼                                           │           │
  User Selects Answer                            │           │
     │                                           │           │
     ▼                                           │           │
  submitAnswer(id, index)                        │           │
     │                                           │           │
     ▼                                           │           │
  Display Feedback                               │           │
  (isCorrect, explanation,                       │           │
   score, difficulty change)                     │           │
     │                                           │           │
     ▼                                           │           │
  [Next Question]  ──────────────────────────────┘           │
     │                                                       │
     ▼                                                       │
  [Restart Quiz]  ───────────────────────────────────────────┘
```

---

## Configuration

### User Setup

Before starting a quiz, users configure:

1. **Level** (1-3): Education level
   - 1 = Elementary
   - 2 = Secondary
   - 3 = University

2. **Category**: Question category
   - Logic, Math, STEM, Literature, General Knowledge

3. **Literacy Level**: Starting difficulty
   - Beginner → difficulty = 1
   - Intermediate → difficulty = 2
   - Expert → difficulty = 3

### Modifying Algorithm Behavior

To adjust the algorithm, modify `RBADA_CONSTANTS` in `engine.js`:

```javascript
const RBADA_CONSTANTS = {
    MIN_LEVEL: 1,              // Minimum education level
    MAX_LEVEL: 3,              // Maximum education level
    MIN_DIFFICULTY: 1,        // Minimum difficulty
    MAX_DIFFICULTY: 3,        // Maximum difficulty
    POINTS_PER_DIFFICULTY: 10 // Points multiplier
};
```

### Adaptive Rule Thresholds

Key thresholds in the algorithm:
- **First Question Penalty**: Applied if first answer is wrong
- **Performance Ratio**: 1:9 (correct:wrong) triggers difficulty decrease
- **Recovery Streak**: 7 consecutive correct answers to promote level
- **Change Limits**: ±1 per evaluation for both difficulty and level

### Adding Questions

Add questions to `QUESTION_POOL` following this format:

```javascript
{
    id: 'unique_id',
    level: 1-5,            // Difficulty level
    category: 'Category',
    question: 'Question text?',
    options: ['A', 'B', 'C', 'D'],
    answerIndex: 0,        // 0-3, index of correct option
    explanation: 'Explanation text'
}
```

---

## Usage Examples

### Basic Quiz Implementation

```javascript
// 1. Initialize quiz with user setup
const engine = new QuizEngine({
    level: 2,                    // Secondary level
    category: 'Math',            // Math category
    literacyLevel: 'Intermediate', // Starting difficulty 2
    questionBank: questionData   // Loaded question bank
});

// 2. Get first question
let question = engine.getCurrentQuestion();

// 3. Display question and options
displayQuestion(question);

// 4. When user clicks an answer
function onAnswerSelected(selectedIndex) {
    const result = engine.submitAnswer(selectedIndex);
    
    if (!result) {
        console.error('No question available');
        return;
    }
    
    // Show feedback
    if (result.isCorrect) {
        showCorrectFeedback(result.pointsEarned);
    } else {
        showWrongFeedback(result.correctAnswer);
    }
    
    // Check console for adaptive changes
    // [RB-ADA] logs will show difficulty/level changes
    
    // Get next question
    question = engine.getCurrentQuestion();
    
    if (question === null || engine.isComplete()) {
        const summary = engine.getPerformanceSummary();
        showResults(summary);
    } else {
        displayQuestion(question);
    }
}
```

### Accessing Game Statistics

```javascript
const state = engine.getState();

console.log(`Level: ${state.currentLevel}`);
console.log(`Difficulty: ${state.currentDifficulty}`);
console.log(`Score: ${state.score}`);
console.log(`Streak: ${state.streak}`);
console.log(`Correct: ${state.correctCount}`);
console.log(`Wrong: ${state.wrongCount}`);
console.log(`Drops: ${state.dropCount}`);
console.log(`Promotions: ${state.promotionCount}`);
console.log(`Accuracy: ${(state.correctCount / state.totalAnswered * 100).toFixed(1)}%`);
```

### Accessing Performance Summary

```javascript
const summary = engine.getPerformanceSummary();

console.log(`Total Questions: ${summary.totalQuestions}`);
console.log(`Accuracy: ${summary.percentage}%`);
console.log(`Time Taken: ${summary.timeTaken}s`);
console.log(`Level Changes: ${summary.dropCount} drops, ${summary.promotionCount} promotions`);
console.log(`Category Performance:`, summary.categoryPerformance);
console.log(`Performance History:`, summary.performanceHistory);
```

---

## Future Enhancements

The following features are planned (placeholders exist in code):

| Feature | Description | Status |
|---------|-------------|--------|
| **Timer System** | Per-question and total time tracking | Placeholder |
| **XP / Levels** | User progression with experience points | Placeholder |
| **Badges** | Achievement system for milestones | Placeholder |
| **Sound Effects** | Audio feedback (`correct.mp3`, `wrong.mp3`, `levelup.mp3`) | Placeholder |
| **Result Export** | PDF/CSV report generation | Placeholder |
| **Analytics** | Detailed performance metrics | Placeholder |

---

## File Dependencies

```
js/
├── engine.js       ← Core engine (this file)
├── quiz-ui.js      ← UI layer (imports engine)
├── data.js         ← Question data loader
├── results-ui.js   ← Results display
└── theme.js        ← Theme management

data/
├── math.json       ← Mathematics questions
├── logic.json      ← Logic questions
├── stem.json       ← STEM questions
├── literature.json ← Literature questions
└── gk.json         ← General Knowledge questions

assets/audio/
├── correct.mp3     ← Sound for correct answer (future)
├── wrong.mp3       ← Sound for wrong answer (future)
└── levelup.mp3     ← Sound for level up (future)
```

---

## Time Tracking

The engine tracks time for each question:

- **Question Start**: Timer starts when `getCurrentQuestion()` is called
- **Question End**: Timer stops when `submitAnswer()` is called
- **Time Storage**: `timeTakenMs` recorded in performance history
- **Total Time**: Accumulated in `totalTimeMs`
- **Average Time**: Calculated in performance summary

## Console Logging

The engine provides detailed console logging for debugging:

- `[RB-ADA] session_init` - Session initialization with config
- `[RB-ADA] answer_processed` - Answer evaluation with state changes
- `[RB-ADA] difficulty_change` - Difficulty adjustments
- `[RB-ADA] level_drop` - Level decreases
- `[RB-ADA] level_promotion` - Level increases
- `[RB-ADA] category_fallback` - Category filtering fallback

## Summary

The NeuroQuiz RB-ADA Engine provides a complete adaptive quiz system with:

- ✅ **User Setup Configuration** - Level, category, and literacy level selection
- ✅ **Intelligent question selection** based on level and difficulty
- ✅ **Rule-based adaptive algorithm** (RB-ADA) with 4 core rules
- ✅ **Level and difficulty adjustment** with recovery mechanism
- ✅ **Performance tracking** with time and history
- ✅ **Difficulty-weighted scoring** that rewards harder questions
- ✅ **Complete state management** for quiz sessions
- ✅ **Comprehensive performance summary** for results analysis
- ✅ **Console logging** for debugging and monitoring
- ✅ **Clean API** for easy UI integration

---

**Algorithm Author**: Saiful Iqbal, Lead Developer, Team ChendAwan  
**Algorithm Name**: Rule-Based Adaptive Dynamic Algorithm (RB-ADA)  
*Documentation version: 2.0*  
*Last updated: January 2026*
