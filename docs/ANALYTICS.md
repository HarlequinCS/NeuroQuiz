# NeuroQuiz Analytics Documentation

> **Complete Guide to Session Analytics and Performance Reporting**

---

## Table of Contents

1. [Overview](#overview)
2. [Analytics Components](#analytics-components)
3. [Session Analytics Dashboard](#session-analytics-dashboard)
4. [RB-ADA Algorithm Analytics](#rb-ada-algorithm-analytics)
5. [Time Analysis](#time-analysis)
6. [Category Performance](#category-performance)
7. [Performance History](#performance-history)
8. [Achievements System](#achievements-system)
9. [Data Structure](#data-structure)
10. [Chart Visualizations](#chart-visualizations)
11. [Export and Print](#export-and-print)

---

## Overview

The NeuroQuiz Analytics system provides comprehensive performance analysis for each quiz session. It tracks user performance, adaptive algorithm behavior, time patterns, and learning progression to give detailed insights into the quiz experience.

### Key Features

- ✅ **Real-time Performance Metrics** - Accuracy, timing, and pacing
- ✅ **RB-ADA Algorithm Tracking** - Level and difficulty adjustments
- ✅ **Time Analysis** - Response time patterns and averages
- ✅ **Category Breakdown** - Performance by subject area
- ✅ **Visual Charts** - Interactive graphs for progression
- ✅ **Achievement System** - Milestone recognition
- ✅ **Export Functionality** - JSON data export

---

## Analytics Components

### 1. Score Display Section

**Location**: Top of results page

**Metrics Displayed**:
- **Accuracy Percentage** - Overall correctness rate (0-100%)
- **Correct Answers** - Total number of correct responses
- **Total Questions** - Number of questions answered
- **Time Taken** - Total session duration (MM:SS format)

**Visual Element**: Circular progress indicator showing accuracy percentage

---

## Session Analytics Dashboard

**Location**: Main analytics section

### Metrics

#### 1. Accuracy Rate
- **Value**: Percentage of correct answers
- **Calculation**: `(correctAnswers / totalQuestions) × 100`
- **Description**: Overall performance indicator
- **Icon**: 🎯

#### 2. Average Time
- **Value**: Average time per question in seconds
- **Calculation**: `totalTimeMs / totalQuestions / 1000`
- **Description**: Mean response time across all questions
- **Icon**: ⏱️

#### 3. Total Time
- **Value**: Complete session duration
- **Format**: MM:SS
- **Description**: Total time spent on quiz
- **Icon**: ⏰

#### 4. Questions/Min
- **Value**: Pacing rate (questions per minute)
- **Calculation**: `totalQuestions / (totalTime / 60)`
- **Description**: Speed of answering questions
- **Icon**: 📊

#### 5. Best Streak
- **Value**: Longest consecutive correct answers
- **Calculation**: Maximum streak from performance history
- **Description**: Peak performance indicator
- **Icon**: 🔥

#### 6. Score
- **Value**: Total points earned
- **Calculation**: Sum of `difficulty × 10` for each correct answer
- **Description**: Cumulative score with difficulty multiplier
- **Icon**: ⭐

---

## RB-ADA Algorithm Analytics

**Location**: Adaptive analytics section

### Statistics Displayed

#### Level Metrics
- **Initial Level**: Starting education level (Elementary/Secondary/University)
- **Final Level**: Ending education level after adaptive adjustments
- **Net Level Change**: Difference between final and initial level
- **Level Drops**: Number of times level decreased
- **Level Promotions**: Number of times level increased

#### Difficulty Metrics
- **Initial Difficulty**: Starting difficulty (1-3)
- **Final Difficulty**: Ending difficulty after adjustments
- **Net Difficulty Change**: Difference between final and initial difficulty

#### Adaptive Events
- **Total Adaptive Events**: Sum of drops and promotions
- **Recovery Rate**: Ability to regain level after drops

### Charts

#### Level Progression Chart
- **Type**: Line chart with area fill
- **X-Axis**: Question number (Q1, Q2, Q3...)
- **Y-Axis**: Education level (1-3)
- **Data**: Level at each question
- **Color**: Blue gradient
- **Purpose**: Visualize level changes throughout session

#### Difficulty Progression Chart
- **Type**: Line chart with area fill
- **X-Axis**: Question number
- **Y-Axis**: Difficulty level (1-3)
- **Data**: Difficulty at each question
- **Color**: Green gradient
- **Purpose**: Show difficulty adjustments over time

### Algorithm Behavior Interpretation

**Level Drop Pattern**:
- Indicates user struggled with current level
- Triggered when difficulty falls below minimum
- Shows adaptive system responding to performance

**Level Promotion Pattern**:
- Indicates recovery and improvement
- Triggered after 7 consecutive correct answers
- Shows user adapting and learning

**Difficulty Fluctuation**:
- Shows real-time difficulty adjustments
- Reflects RB-ADA rule application
- Indicates system responsiveness

---

## Time Analysis

**Location**: Time analysis section

### Statistics

#### Average Time
- **Metric**: Mean response time per question
- **Unit**: Seconds
- **Calculation**: `sum(timeTakenMs) / questionCount / 1000`

#### Fastest Answer
- **Metric**: Minimum response time
- **Unit**: Seconds
- **Description**: Quickest question answered

#### Slowest Answer
- **Metric**: Maximum response time
- **Unit**: Seconds
- **Description**: Longest time spent on a question

#### Total Time
- **Metric**: Complete session duration
- **Format**: MM:SS
- **Description**: End-to-end quiz time

### Time Chart

**Type**: Bar chart with average line

**Features**:
- **Bars**: Individual question response times (seconds)
- **Line**: Average time across all questions (red dashed line)
- **X-Axis**: Question numbers
- **Y-Axis**: Time in seconds

**Interpretation**:
- **Consistent bars**: Steady pacing
- **Increasing trend**: Taking more time (possible fatigue or difficulty increase)
- **Decreasing trend**: Getting faster (possible confidence or easier questions)
- **Spikes**: Specific challenging questions
- **Below average**: Quick, confident answers
- **Above average**: Thoughtful or difficult questions

---

## Category Performance

**Location**: Category performance section

### Display Format

For each category:
- **Category Name**: Subject area (Logic, Math, STEM, etc.)
- **Accuracy Percentage**: Correct answers / Total questions × 100
- **Score**: Correct answers / Total questions answered

### Interpretation

- **High accuracy (>80%)**: Strong category knowledge
- **Medium accuracy (50-80%)**: Adequate understanding
- **Low accuracy (<50%)**: Area needing improvement

---

## Performance History

**Location**: Detailed review section (collapsible)

### Per-Question Data

Each question review includes:

1. **Question Text**: Full question content
2. **Metadata**:
   - Education level at time of question
   - Difficulty level at time of question
   - Time taken (seconds)
3. **Answer Comparison**:
   - User's selected answer (with ✓ or ✗)
   - Correct answer
4. **Explanation**: Educational feedback

### Review Features

- **Expandable Section**: Click to show/hide detailed review
- **Question-by-Question**: Complete history of all questions
- **Color Coding**: Green for correct, red for incorrect
- **Metadata Display**: Level, difficulty, and time for context

---

## Achievements System

**Location**: Achievements section

### Available Achievements

#### Perfect Score 🏆
- **Condition**: 90% or higher accuracy
- **Description**: "90% or higher accuracy"
- **Significance**: Exceptional performance

#### Hot Streak 🔥
- **Condition**: 10+ consecutive correct answers
- **Description**: "Streak of [N] correct answers"
- **Significance**: Sustained high performance

#### Level Up 📈
- **Condition**: At least one level promotion
- **Description**: "Promoted to higher level"
- **Significance**: Recovery and improvement

#### Persistent 💪
- **Condition**: 20+ questions completed
- **Description**: "Completed 20+ questions"
- **Significance**: Dedication and commitment

### Achievement Logic

Achievements are calculated from:
- Overall accuracy percentage
- Best streak from performance history
- Promotion count from RB-ADA analytics
- Total questions answered

---

## Data Structure

### Performance Summary Object

The analytics system uses data from `engine.getPerformanceSummary()`:

```javascript
{
    // Basic Metrics
    totalQuestions: Number,              // Total questions answered
    correctAnswers: Number,               // Correct count
    wrongAnswers: Number,                 // Wrong count
    percentage: Number,                   // Accuracy percentage
    timeTaken: Number,                   // Total time in seconds
    averageTimeMs: Number,                // Average time per question
    
    // RB-ADA State
    currentLevel: Number,                 // Final education level (1-3)
    currentDifficulty: Number,            // Final difficulty (1-3)
    dropCount: Number,                    // Number of level drops
    promotionCount: Number,               // Number of level promotions
    streak: Number,                       // Final streak count
    hasDroppedLevel: Boolean,             // Whether level was dropped
    
    // Performance History
    performanceHistory: Array,            // Per-question records
    categoryPerformance: Object,          // Performance by category
    sessionConfig: Object,                // Session configuration
    answeredQuestionIds: Array           // Answered question IDs
}
```

### Performance History Item

Each item in `performanceHistory` array:

```javascript
{
    id: Number,                          // Question ID
    question: String,                     // Question text
    category: String,                     // Question category
    level: Number,                        // Education level at time
    difficulty: Number,                   // Difficulty at time
    selectedIndex: Number,                // User's selected answer (0-3)
    correctIndex: Number,                 // Correct answer index (0-3)
    isCorrect: Boolean,                   // Whether answer was correct
    timeTakenMs: Number,                  // Time taken in milliseconds
    hasDroppedLevel: Boolean              // Whether level was dropped
}
```

### Category Performance Object

```javascript
{
    "Category Name": {
        correct: Number,                  // Correct answers in category
        total: Number                     // Total questions in category
    }
}
```

### Session Config Object

```javascript
{
    initialLevel: Number,                 // Starting level (1-3)
    category: String,                     // Selected category
    literacyLevel: String,                // Beginner/Intermediate/Expert
    initialDifficulty: Number,            // Starting difficulty (1-3)
    questionLimit: Number | null          // Question limit if set
}
```

---

## Chart Visualizations

### Chart.js Configuration

All charts use Chart.js 4.4.0 with the following configuration:

#### Performance Breakdown Chart
- **Type**: Doughnut
- **Data**: Correct vs Incorrect answers
- **Colors**: Green (correct), Red (incorrect)

#### Level Progression Chart
- **Type**: Line with area fill
- **Scales**: Y-axis 1-3 (education levels)
- **Interpolation**: Smooth curves (tension: 0.4)

#### Difficulty Progression Chart
- **Type**: Line with area fill
- **Scales**: Y-axis 1-3 (difficulty levels)
- **Interpolation**: Smooth curves (tension: 0.4)

#### Time Analysis Chart
- **Type**: Bar chart with line overlay
- **Bars**: Individual question times
- **Line**: Average time (red dashed)
- **Scales**: Y-axis in seconds

### Chart Responsiveness

All charts are:
- **Responsive**: Automatically adjust to container size
- **Maintain Aspect Ratio**: False (fills container)
- **Interactive**: Hover tooltips with detailed information
- **Accessible**: ARIA labels and proper semantic structure

---

## Export and Print

### JSON Export

**Function**: `exportResults()`

**Format**: JSON file with complete performance data

**Filename**: `neuroquiz-results-[timestamp].json`

**Contents**:
- Complete performance summary
- Full performance history
- Session configuration
- All analytics data

**Usage**: Click "Export PDF" button (currently exports JSON)

### Print Functionality

**Function**: `printResults()`

**Method**: Browser print dialog

**Optimization**: Results page is print-friendly with:
- Clean layout
- All analytics visible
- Charts rendered as images
- No navigation elements

---

## Analytics Interpretation Guide

### Performance Patterns

#### High Accuracy, Low Time
- **Interpretation**: Strong knowledge, confident answers
- **Recommendation**: Consider increasing difficulty or level

#### High Accuracy, High Time
- **Interpretation**: Careful, methodical approach
- **Recommendation**: Good strategy, maintain current settings

#### Low Accuracy, Low Time
- **Interpretation**: Rushing, may need more careful consideration
- **Recommendation**: Encourage thoughtful responses

#### Low Accuracy, High Time
- **Interpretation**: Struggling with material
- **Recommendation**: System should lower difficulty (RB-ADA handles this)

### RB-ADA Behavior Patterns

#### Frequent Level Drops
- **Interpretation**: User struggling with current level
- **System Response**: Correctly adapting downward
- **User Action**: Review material at lower level

#### Level Promotions
- **Interpretation**: User recovering and improving
- **System Response**: Recognizing improvement
- **User Action**: Continue at promoted level

#### Stable Level/Difficulty
- **Interpretation**: Appropriate challenge level
- **System Response**: Maintaining optimal difficulty
- **User Action**: Continue current pace

### Time Patterns

#### Decreasing Time Trend
- **Interpretation**: Getting faster, possible confidence increase
- **Consideration**: May indicate easier questions or improved familiarity

#### Increasing Time Trend
- **Interpretation**: Taking more time, possible difficulty increase
- **Consideration**: May indicate harder questions or fatigue

#### Consistent Time
- **Interpretation**: Steady pacing
- **Consideration**: Good time management

---

## Technical Implementation

### File Structure

```
js/
└── results-ui.js    ← Analytics controller and display logic

result.html          ← Results page HTML structure
```

### Dependencies

- **Chart.js 4.4.0**: Chart visualizations
- **Performance Summary**: From `engine.getPerformanceSummary()`
- **localStorage**: Results data storage

### Key Methods

#### `displayAnalytics()`
- Calculates and displays session metrics
- Creates analytics cards

#### `displayAdaptiveAnalytics()`
- Shows RB-ADA algorithm statistics
- Renders level and difficulty progression charts

#### `displayTimeAnalysis()`
- Calculates time statistics
- Renders time analysis chart

#### `calculateBestStreak(history)`
- Finds longest consecutive correct answers
- Returns maximum streak value

#### `calculateTotalScore(history)`
- Sums points from all correct answers
- Applies difficulty multiplier (difficulty × 10)

---

## Best Practices

### For Users

1. **Review Analytics After Each Session**: Understand your performance patterns
2. **Check Time Analysis**: Identify pacing issues
3. **Monitor Level Changes**: Understand how RB-ADA adapts to you
4. **Review Category Performance**: Identify strengths and weaknesses
5. **Export Results**: Save data for tracking progress over time

### For Developers

1. **Data Validation**: Always check for null/undefined values
2. **Error Handling**: Gracefully handle missing data
3. **Performance**: Lazy load charts for better page load
4. **Accessibility**: Ensure charts have proper ARIA labels
5. **Mobile Responsiveness**: Test analytics on mobile devices

---

## Future Enhancements

### Planned Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Comparative Analytics** | Compare multiple sessions | Planned |
| **Trend Analysis** | Long-term performance trends | Planned |
| **PDF Export** | Generate PDF reports | Planned |
| **Share Results** | Share analytics via link | Planned |
| **Custom Date Ranges** | Filter analytics by date | Planned |
| **Performance Predictions** | ML-based performance forecasting | Planned |

---

## Summary

The NeuroQuiz Analytics system provides:

- ✅ **Comprehensive Metrics** - 6 key performance indicators
- ✅ **RB-ADA Tracking** - Complete algorithm behavior analysis
- ✅ **Time Analysis** - Detailed response time patterns
- ✅ **Visual Charts** - 4 interactive visualizations
- ✅ **Category Breakdown** - Subject-specific performance
- ✅ **Achievement System** - Milestone recognition
- ✅ **Export Functionality** - Data export capabilities
- ✅ **Performance History** - Question-by-question review

All analytics are generated from the performance summary data provided by the RB-ADA engine, ensuring accurate and comprehensive reporting for every quiz session.

---

**Documentation Version**: 1.0  
**Last Updated**: January 2026  
**Maintained by**: NeuroQuiz Development Team
