/**
 * NeuroQuiz™ - Results UI Controller
 * 
 * UI Team: This file handles the results page display, charts, and export functionality.
 * You can modify chart styling, layout, and export formats here.
 * 
 * IMPORTANT:
 * - Results data comes from localStorage (set by quiz-ui.js)
 * - Chart.js is used for visualizations
 * - Do not modify data processing logic (that's in engine.js)
 */

/**
 * ResultsUIController Class
 * Manages results page display and interactions
 */
class ResultsUIController {
    constructor() {
        // DOM Elements
        this.elements = {
            resultsContainer: document.getElementById('results-container'),
            scorePercentage: document.getElementById('score-percentage'),
            scoreCorrect: document.getElementById('score-correct'),
            scoreTotal: document.getElementById('score-total'),
            scoreTime: document.getElementById('score-time'),
            scoreCircleProgress: document.getElementById('score-circle-progress'),
            chartWrapper: document.getElementById('chart-wrapper'),
            performanceChart: document.getElementById('performance-chart'),
            categoryGrid: document.getElementById('category-grid'),
            achievementsGrid: document.getElementById('achievements-grid'),
            printBtn: document.getElementById('print-btn'),
            exportBtn: document.getElementById('export-btn'),
            retakeBtn: document.getElementById('retake-btn'),
            reviewToggle: document.getElementById('review-toggle'),
            reviewContent: document.getElementById('review-content'),
            reviewList: document.getElementById('review-list')
        };
        
        // Results data
        this.results = null;
        
        // Chart instance
        this.chart = null;
        
        console.log('ResultsUIController initialized');
    }
    
    /**
     * Initialize results page
     */
    init() {
        // Load results from localStorage
        this.loadResults();
        
        // If no results, redirect to quiz
        if (!this.results) {
            window.location.href = 'quiz.html';
            return;
        }
        
        // Display results
        this.displayResults();
        this.setupEventListeners();
    }
    
    /**
     * Load results from localStorage
     */
    loadResults() {
        const storedResults = localStorage.getItem('quizResults');
        if (storedResults) {
            try {
                this.results = JSON.parse(storedResults);
            } catch (error) {
                console.error('Error parsing results:', error);
                this.results = null;
            }
        }
    }
    
    /**
     * Display all results
     */
    displayResults() {
        this.displayScore();
        this.displayChart();
        this.displayCategories();
        this.displayAchievements();
        this.displayReview();
    }
    
    /**
     * Display score information
     */
    displayScore() {
        const percentage = this.results.percentage || 0;
        const correct = this.results.correctAnswers || 0;
        const total = this.results.totalQuestions || 0;
        const time = this.formatTime(this.results.timeTaken || 0);
        
        // Update percentage
        this.elements.scorePercentage.textContent = `${percentage}%`;
        
        // Update score details
        this.elements.scoreCorrect.textContent = correct;
        this.elements.scoreTotal.textContent = total;
        this.elements.scoreTime.textContent = time;
        
        // Animate score circle
        this.animateScoreCircle(percentage);
    }
    
    /**
     * Animate score circle progress
     * @param {number} percentage - Score percentage
     */
    animateScoreCircle(percentage) {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (percentage / 100) * circumference;
        
        this.elements.scoreCircleProgress.style.strokeDashoffset = offset;
    }
    
    /**
     * Display performance chart
     */
    displayChart() {
        const ctx = this.elements.performanceChart.getContext('2d');
        
        // TODO: Lead Developer - Provide chart data from results
        // For now, using placeholder data
        const chartData = {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                label: 'Answers',
                data: [
                    this.results.correctAnswers || 0,
                    (this.results.totalQuestions || 0) - (this.results.correctAnswers || 0)
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2
            }]
        };
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Display category performance
     */
    displayCategories() {
        // TODO: Lead Developer - Provide category data from results
        const categories = this.results.categoryPerformance || {};
        
        this.elements.categoryGrid.innerHTML = '';
        
        Object.entries(categories).forEach(([category, data]) => {
            const card = this.createCategoryCard(category, data);
            this.elements.categoryGrid.appendChild(card);
        });
        
        // If no categories, show message
        if (Object.keys(categories).length === 0) {
            this.elements.categoryGrid.innerHTML = '<p>No category data available</p>';
        }
    }
    
    /**
     * Create category performance card
     * @param {string} category - Category name
     * @param {Object} data - Performance data
     * @returns {HTMLElement} Card element
     */
    createCategoryCard(category, data) {
        const card = document.createElement('div');
        card.className = 'category-card';
        
        const accuracy = data.correct / data.total * 100 || 0;
        
        card.innerHTML = `
            <h3 class="category-name">${category}</h3>
            <div class="category-stats">
                <span class="category-accuracy">${accuracy.toFixed(0)}%</span>
                <span class="category-details">${data.correct}/${data.total} correct</span>
            </div>
        `;
        
        return card;
    }
    
    /**
     * Display achievements
     */
    displayAchievements() {
        // TODO: Lead Developer - Provide achievements from results
        const achievements = this.results.achievements || [];
        
        this.elements.achievementsGrid.innerHTML = '';
        
        achievements.forEach(achievement => {
            const badge = this.createAchievementBadge(achievement);
            this.elements.achievementsGrid.appendChild(badge);
        });
        
        // If no achievements, show message
        if (achievements.length === 0) {
            this.elements.achievementsGrid.innerHTML = '<p>No achievements unlocked yet</p>';
        }
    }
    
    /**
     * Create achievement badge
     * @param {Object} achievement - Achievement object
     * @returns {HTMLElement} Badge element
     */
    createAchievementBadge(achievement) {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `
            <div class="badge-icon">${achievement.icon || '🏆'}</div>
            <div class="badge-name">${achievement.name}</div>
            <div class="badge-description">${achievement.description || ''}</div>
        `;
        return badge;
    }
    
    /**
     * Display question review
     */
    displayReview() {
        // TODO: Lead Developer - Provide review data from results
        const reviewData = this.results.performanceHistory || [];
        
        this.elements.reviewList.innerHTML = '';
        
        reviewData.forEach((item, index) => {
            const reviewItem = this.createReviewItem(item, index + 1);
            this.elements.reviewList.appendChild(reviewItem);
        });
    }
    
    /**
     * Create review item
     * @param {Object} item - Review item data
     * @param {number} questionNum - Question number
     * @returns {HTMLElement} Review item element
     */
    createReviewItem(item, questionNum) {
        const div = document.createElement('div');
        div.className = 'review-item';
        div.innerHTML = `
            <div class="review-question">
                <strong>Q${questionNum}:</strong> ${item.question || 'Question text'}
            </div>
            <div class="review-answer ${item.isCorrect ? 'correct' : 'wrong'}">
                Your answer: ${item.userAnswer || 'N/A'}
                ${item.isCorrect ? '✓' : '✗'}
            </div>
            ${item.explanation ? `<div class="review-explanation">${item.explanation}</div>` : ''}
        `;
        return div;
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Print button
        this.elements.printBtn.addEventListener('click', () => {
            this.printResults();
        });
        
        // Export button
        this.elements.exportBtn.addEventListener('click', () => {
            this.exportResults();
        });
        
        // Retake button
        this.elements.retakeBtn.addEventListener('click', () => {
            window.location.href = 'quiz.html';
        });
        
        // Review toggle
        this.elements.reviewToggle.addEventListener('click', () => {
            this.toggleReview();
        });
    }
    
    /**
     * Print results
     */
    printResults() {
        window.print();
    }
    
    /**
     * Export results as PDF
     */
    exportResults() {
        // UI Team: Implement PDF export using a library like jsPDF
        alert('PDF export - to be implemented');
    }
    
    /**
     * Toggle review section
     */
    toggleReview() {
        const isExpanded = this.elements.reviewContent.getAttribute('aria-hidden') === 'false';
        this.elements.reviewContent.setAttribute('aria-hidden', isExpanded);
        this.elements.reviewToggle.setAttribute('aria-expanded', !isExpanded);
        this.elements.reviewToggle.querySelector('.toggle-icon').textContent = isExpanded ? '▼' : '▲';
    }
    
    /**
     * Format time in seconds to MM:SS
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const resultsUI = new ResultsUIController();
    resultsUI.init();
});

