/**
 * NeuroQuiz™ - Results UI Controller with Full Analytics
 * 
 * Displays comprehensive session analytics including:
 * - Performance metrics
 * - RB-ADA algorithm analytics
 * - Time analysis
 * - Category breakdown
 * - Performance progression
 */

class ResultsUIController {
    constructor() {
        this.elements = {
            resultsContainer: document.getElementById('results-container'),
            scorePercentage: document.getElementById('score-percentage'),
            scoreCorrect: document.getElementById('score-correct'),
            scoreTotal: document.getElementById('score-total'),
            scoreTime: document.getElementById('score-time'),
            scoreCircleProgress: document.getElementById('score-circle-progress'),
            chartWrapper: document.getElementById('chart-wrapper'),
            categoryGrid: document.getElementById('category-grid'),
            achievementsGrid: document.getElementById('achievements-grid'),
            analyticsGrid: document.getElementById('analytics-grid'),
            adaptiveStats: document.getElementById('adaptive-stats'),
            adaptiveCharts: document.getElementById('adaptive-charts'),
            levelProgressionChart: document.getElementById('level-progression-chart'),
            difficultyProgressionChart: document.getElementById('difficulty-progression-chart'),
            timeStats: document.getElementById('time-stats'),
            timeChart: document.getElementById('time-chart'),
            timeChartContainer: document.getElementById('time-chart-container'),
            cognitiveContainer: document.getElementById('cognitive-container'),
            cdaMetrics: document.getElementById('cda-metrics'),
            executiveMetrics: document.getElementById('executive-metrics'),
            cognitiveSection: document.getElementById('cognitive-analytics-section'),
            exportBtn: document.getElementById('export-btn'),
            retakeBtn: document.getElementById('retake-btn'),
            reviewToggle: document.getElementById('review-toggle'),
            reviewContent: document.getElementById('review-content'),
            reviewList: document.getElementById('review-list')
        };
        
        this.results = null;
        this.charts = {};
        
        console.log('ResultsUIController initialized');
    }
    
    init() {
        this.loadResults();
        this.loadUserName();
        
        if (!this.results) {
            console.warn('Results data not found; redirecting to quiz page');
            window.location.href = 'quiz.html';
            return;
        }
        
        console.info('Results data loaded', {
            hasCognitiveProfile: !!this.results.cognitiveProfile,
            totalQuestions: this.results.totalQuestions,
            performanceHistoryCount: (this.results.performanceHistory || []).length
        });
        
        this.displayResults();
        this.setupEventListeners();
        this.setupCognitiveInfoToggle();
    }
    
    loadUserName() {
        const stored = localStorage.getItem('neuroquizUserSetup');
        let userName = 'User';
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.name) {
                    userName = parsed.name;
                }
            } catch (e) {
                console.warn('Failed to parse user setup:', e);
            }
        }
        
        const userNameDisplay = document.getElementById('user-name-display');
        if (userNameDisplay) {
            userNameDisplay.textContent = userName;
        }
        
        this.userName = userName;
        return userName;
    }
    
    setupCognitiveInfoToggle() {
        const toggle = document.getElementById('cognitive-info-toggle');
        const panel = document.getElementById('cognitive-info-panel');
        const arrow = toggle?.querySelector('.info-arrow');
        
        if (toggle && panel) {
            toggle.addEventListener('click', () => {
                const isOpen = panel.style.display !== 'none';
                panel.style.display = isOpen ? 'none' : 'block';
                if (arrow) {
                    if (arrow) {
                        arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                    }
                }
                toggle.setAttribute('aria-expanded', !isOpen);
            });
        }
    }
    
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
    
    displayResults() {
        console.info('Rendering results', {
            hasCognitiveProfile: !!this.results?.cognitiveProfile
        });
        // Cognitive Analytics is the primary focus - show it first
        this.displayCognitiveAnalytics();
        this.displayScore();
        this.displayQuickStats();
        this.displayChart();
        this.displayTimeAnalysis();
        this.displayAchievements();
        this.displayReview();
    }
    
    displayQuickStats() {
        const quickStatsGrid = document.getElementById('quick-stats-grid');
        if (!quickStatsGrid) return;
        
        const total = this.results.totalQuestions || 0;
        const correct = this.results.correctAnswers || 0;
        const percentage = this.results.percentage || 0;
        const timeTaken = this.results.timeTaken || 0;
        
        quickStatsGrid.innerHTML = '';
        
        const stats = [
            {
                label: 'Total Questions',
                value: total,
                icon: '📝'
            },
            {
                label: 'Correct Answers',
                value: correct,
                icon: '✅'
            },
            {
                label: 'Accuracy',
                value: `${percentage}%`,
                icon: '🎯'
            },
            {
                label: 'Time Taken',
                value: this.formatTime(timeTaken),
                icon: '⏱️'
            }
        ];
        
        stats.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'quick-stat-card';
            card.innerHTML = `
                <div class="quick-stat-icon">${stat.icon}</div>
                <div class="quick-stat-content">
                    <div class="quick-stat-value">${stat.value}</div>
                    <div class="quick-stat-label">${stat.label}</div>
                </div>
            `;
            quickStatsGrid.appendChild(card);
        });
    }
    
    displaySummary() {
        const summary = this.results;
        const history = summary.performanceHistory || [];
        const config = summary.sessionConfig || {};
        
        const summaryHTML = `
            <div class="summary-grid">
                <div class="summary-item">
                    <strong>Category:</strong> ${config.category || 'All Categories'}
                </div>
                <div class="summary-item">
                    <strong>Initial Level:</strong> ${this.getLevelName(config.initialLevel || 1)}
                </div>
                <div class="summary-item">
                    <strong>Final Level:</strong> ${this.getLevelName(summary.currentLevel || 1)}
                </div>
                <div class="summary-item">
                    <strong>Literacy Level:</strong> ${config.literacyLevel || 'Beginner'}
                </div>
                <div class="summary-item">
                    <strong>Questions Answered:</strong> ${summary.totalQuestions || 0}
                </div>
                <div class="summary-item">
                    <strong>Accuracy:</strong> ${summary.percentage || 0}%
                </div>
                <div class="summary-item">
                    <strong>Level Drops:</strong> ${summary.dropCount || 0}
                </div>
                <div class="summary-item">
                    <strong>Level Promotions:</strong> ${summary.promotionCount || 0}
                </div>
            </div>
        `;
        
        const summaryContent = document.getElementById('summary-content');
        if (summaryContent) {
            summaryContent.innerHTML = summaryHTML;
        }
    }
    
    displayScore() {
        const percentage = this.results.percentage || 0;
        const correct = this.results.correctAnswers || 0;
        const total = this.results.totalQuestions || 0;
        const time = this.formatTime(this.results.timeTaken || 0);
        
        this.elements.scorePercentage.textContent = `${percentage}%`;
        this.elements.scoreCorrect.textContent = correct;
        this.elements.scoreTotal.textContent = total;
        this.elements.scoreTime.textContent = time;
        
        this.animateScoreCircle(percentage);
    }
    
    animateScoreCircle(percentage) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percentage / 100) * circumference;
        this.elements.scoreCircleProgress.style.strokeDashoffset = offset;
    }
    
    displayChart() {
        const chartWrapper = this.elements.chartWrapper;
        if (!chartWrapper) return;
        
        const correct = this.results.correctAnswers || 0;
        const incorrect = (this.results.totalQuestions || 0) - correct;
        const total = correct + incorrect;
        const correctPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
        const incorrectPercent = total > 0 ? Math.round((incorrect / total) * 100) : 0;
        
        chartWrapper.innerHTML = `
            <div class="performance-visual">
                <div class="performance-bar-container">
                    <div class="performance-bar-label">
                        <span>Correct Answers</span>
                        <span class="performance-value">${correct} (${correctPercent}%)</span>
                    </div>
                    <div class="performance-bar">
                        <div class="performance-bar-fill performance-correct" style="width: ${correctPercent}%"></div>
                    </div>
                </div>
                <div class="performance-bar-container">
                    <div class="performance-bar-label">
                        <span>Incorrect Answers</span>
                        <span class="performance-value">${incorrect} (${incorrectPercent}%)</span>
                    </div>
                    <div class="performance-bar">
                        <div class="performance-bar-fill performance-incorrect" style="width: ${incorrectPercent}%"></div>
                    </div>
                </div>
                <div class="performance-summary">
                    <div class="performance-summary-item">
                        <div class="summary-icon">✅</div>
                        <div class="summary-text">
                            <div class="summary-label">Correct</div>
                            <div class="summary-number">${correct}</div>
                        </div>
                    </div>
                    <div class="performance-summary-item">
                        <div class="summary-icon">❌</div>
                        <div class="summary-text">
                            <div class="summary-label">Incorrect</div>
                            <div class="summary-number">${incorrect}</div>
                        </div>
                    </div>
                    <div class="performance-summary-item">
                        <div class="summary-icon">📊</div>
                        <div class="summary-text">
                            <div class="summary-label">Total</div>
                            <div class="summary-number">${total}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    displayAnalytics() {
        const history = this.results.performanceHistory || [];
        const total = this.results.totalQuestions || 0;
        const correct = this.results.correctAnswers || 0;
        const wrong = this.results.wrongAnswers || 0;
        const avgTime = this.results.averageTimeMs || 0;
        const totalTime = this.results.timeTaken || 0;
        
        const analytics = [
            {
                title: 'Accuracy Rate',
                value: `${this.results.percentage || 0}%`,
                description: `${correct} correct out of ${total} questions`,
                icon: '🎯'
            },
            {
                title: 'Average Time',
                value: `${Math.round(avgTime / 1000)}s`,
                description: `Per question average`,
                icon: '⏱️'
            },
            {
                title: 'Total Time',
                value: this.formatTime(totalTime),
                description: `Complete session duration`,
                icon: '⏰'
            },
            {
                title: 'Questions/Min',
                value: totalTime > 0 ? (total / (totalTime / 60)).toFixed(1) : '0',
                description: `Pacing rate`,
                icon: '📊'
            },
            {
                title: 'Best Streak',
                value: this.calculateBestStreak(history),
                description: `Consecutive correct answers`,
                icon: '🔥'
            },
            {
                title: 'Score',
                value: this.calculateTotalScore(history),
                description: `Total points earned`,
                icon: '⭐'
            }
        ];
        
        this.elements.analyticsGrid.innerHTML = '';
        analytics.forEach(metric => {
            const card = this.createAnalyticsCard(metric);
            this.elements.analyticsGrid.appendChild(card);
        });
    }
    
    createAnalyticsCard(metric) {
        const card = document.createElement('div');
        card.className = 'analytics-card';
        card.innerHTML = `
            <div class="analytics-icon">${metric.icon}</div>
            <div class="analytics-content">
                <h3 class="analytics-title">${metric.title}</h3>
                <div class="analytics-value">${metric.value}</div>
                <p class="analytics-description">${metric.description}</p>
            </div>
        `;
        return card;
    }
    
    displayAdaptiveAnalytics() {
        const history = this.results.performanceHistory || [];
        const dropCount = this.results.dropCount || 0;
        const promotionCount = this.results.promotionCount || 0;
        const finalLevel = this.results.currentLevel || 1;
        const finalDifficulty = this.results.currentDifficulty || 1;
        const initialLevel = this.results.sessionConfig?.initialLevel || 1;
        const initialDifficulty = this.results.sessionConfig?.initialDifficulty || 1;
        
        const stats = [
            {
                label: 'Initial Level',
                value: this.getLevelName(initialLevel),
                change: null
            },
            {
                label: 'Final Level',
                value: this.getLevelName(finalLevel),
                change: finalLevel !== initialLevel ? (finalLevel > initialLevel ? '↑' : '↓') : '='
            },
            {
                label: 'Initial Difficulty',
                value: initialDifficulty,
                change: null
            },
            {
                label: 'Final Difficulty',
                value: finalDifficulty,
                change: finalDifficulty !== initialDifficulty ? (finalDifficulty > initialDifficulty ? '↑' : '↓') : '='
            },
            {
                label: 'Level Drops',
                value: dropCount,
                change: null
            },
            {
                label: 'Level Promotions',
                value: promotionCount,
                change: null
            },
            {
                label: 'Net Level Change',
                value: finalLevel - initialLevel,
                change: finalLevel !== initialLevel ? (finalLevel > initialLevel ? '↑' : '↓') : '='
            },
            {
                label: 'Adaptive Events',
                value: dropCount + promotionCount,
                change: null
            }
        ];
        
        this.elements.adaptiveStats.innerHTML = '';
        stats.forEach(stat => {
            const item = this.createStatItem(stat);
            this.elements.adaptiveStats.appendChild(item);
        });
        
        this.displayLevelProgressionChart(history);
        this.displayDifficultyProgressionChart(history);
    }
    
    createStatItem(stat) {
        const div = document.createElement('div');
        div.className = 'stat-item';
        div.innerHTML = `
            <span class="stat-label">${stat.label}</span>
            <span class="stat-value">
                ${stat.value}
                ${stat.change ? `<span class="stat-change">${stat.change}</span>` : ''}
            </span>
        `;
        return div;
    }
    
    displayLevelProgressionChart(history) {
        const ctx = this.elements.levelProgressionChart.getContext('2d');
        const labels = history.map((_, i) => `Q${i + 1}`);
        const levels = history.map(h => h.level || 1);
        
        this.charts.levelProgression = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Education Level',
                    data: levels,
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.15)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(37, 99, 235)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.5,
                        max: 3.5,
                        ticks: {
                            stepSize: 1,
                            font: { size: 12, weight: 'bold' },
                            callback: (value) => this.getLevelName(value)
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                },
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top',
                        labels: { font: { size: 14, weight: 'bold' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: (context) => `Level: ${this.getLevelName(context.parsed.y)}`
                        }
                    }
                }
            }
        });
    }
    
    displayDifficultyProgressionChart(history) {
        const ctx = this.elements.difficultyProgressionChart.getContext('2d');
        const labels = history.map((_, i) => `Q${i + 1}`);
        const difficulties = history.map(h => h.difficulty || 1);
        
        this.charts.difficultyProgression = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Difficulty Level',
                    data: difficulties,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0.5,
                        max: 3.5,
                        ticks: {
                            stepSize: 1,
                            font: { size: 12, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                },
                plugins: {
                    legend: { 
                        display: true,
                        position: 'top',
                        labels: { font: { size: 14, weight: 'bold' } }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: (context) => `Difficulty: ${context.parsed.y}`
                        }
                    }
                }
            }
        });
    }
    
    displayCognitiveAnalytics() {
        const section = document.getElementById('cognitive-analytics-section');
        if (!section) {
            console.warn('Cognitive analytics section not found in DOM');
            return;
        }
        
        const container = document.getElementById('cognitive-container');
        if (!container) {
            console.warn('Cognitive container not found in DOM');
            return;
        }
        
        if (!this.results) {
            console.warn('No results loaded for cognitive analytics');
            return;
        }
        
        let cognitive = this.results.cognitiveProfile;
        
        if (!cognitive && typeof window !== 'undefined' && window.CognitiveAnalyzer) {
            try {
                cognitive = window.CognitiveAnalyzer.analyzeCognitiveProfile(this.results);
                this.results.cognitiveProfile = cognitive;
            } catch (e) {
                console.error('Error computing cognitive profile:', e);
                return;
            }
        }
        
        if (!cognitive) {
            console.warn('Cognitive profile missing; nothing to display');
            return;
        }
        
        console.info('Rendering cognitive analytics', cognitive);
        
        section.style.display = 'block';
        section.style.visibility = 'visible';
        
        const cda = cognitive.cda || {};
        const executive = cognitive.executiveFunction || {};
        const professionalSummary = cognitive.professionalSummary || '';

        // Display professional summary
        const summaryBox = document.getElementById('cognitive-summary-box');
        const summaryText = document.getElementById('cognitive-summary-text');
        if (summaryBox && summaryText) {
            if (professionalSummary) {
                const userName = this.userName || 'you';
                const personalizedSummary = professionalSummary
                    .replace(/\byour\b/gi, `${userName}'s`)
                    .replace(/\byou\b/g, userName);
                summaryText.textContent = personalizedSummary;
                summaryBox.style.display = 'block';
            } else {
                summaryBox.style.display = 'none';
            }
        }

        // Clear container before rendering
        container.innerHTML = '';

        // Render CDA and Executive sections
        this.displayCDAMetrics(cda);
        this.displayExecutiveMetrics(executive);
    }
    
    displayCDAMetrics(cda) {
        const cdaMetrics = document.getElementById('cda-metrics');
        if (!cdaMetrics) return;

        cdaMetrics.innerHTML = '';

        const metrics = [
            {
                label: 'Adaptability',
                value: cda.adaptability || 0,
                description: 'How well you adjust when difficulty changes',
                explanation: 'Measures your ability to adapt performance when question difficulty increases or decreases. Higher scores indicate better adaptation to new challenge levels.'
            },
            {
                label: 'Consistency',
                value: cda.consistency || 0,
                description: 'Stability in your performance patterns',
                explanation: 'Reflects how consistent your answers are across the session. Higher scores mean more predictable, steady results with less variability.'
            },
            {
                label: 'Recovery Rate',
                value: cda.recovery || 0,
                description: 'Ability to bounce back after level drops',
                explanation: 'Shows how quickly and effectively you recover after the system lowers your level due to difficulty. Higher scores indicate strong resilience and learning from setbacks.'
            },
            {
                label: 'Error Persistence',
                value: cda.errorPersistence || 0,
                description: 'Tendency for consecutive incorrect answers',
                explanation: 'Indicates how often errors occur in sequence. Lower scores are better, showing you learn from mistakes quickly and avoid repeating them.'
            }
        ];

        metrics.forEach(metric => {
            const card = this.createCognitiveMetricCard(metric);
            cdaMetrics.appendChild(card);
        });

        if (cda.knowledgeMastery && Object.keys(cda.knowledgeMastery).length > 0) {
            const masterySection = document.createElement('div');
            masterySection.className = 'mastery-section';
            masterySection.innerHTML = '<h4 class="mastery-title">Knowledge Mastery by Category</h4>';
            
            const masteryGrid = document.createElement('div');
            masteryGrid.className = 'mastery-grid';

            Object.entries(cda.knowledgeMastery).forEach(([category, score]) => {
                const masteryItem = document.createElement('div');
                masteryItem.className = 'mastery-item';
                const percentage = Math.round(score * 100);
                masteryItem.innerHTML = `
                    <span class="mastery-category">${category}</span>
                    <div class="mastery-bar">
                        <div class="mastery-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="mastery-value">${percentage}%</span>
                `;
                masteryGrid.appendChild(masteryItem);
            });
            
            masterySection.appendChild(masteryGrid);
            cdaMetrics.appendChild(masterySection);
        }
    }
    
    displayExecutiveMetrics(executive) {
        const executiveMetrics = document.getElementById('executive-metrics');
        if (!executiveMetrics) return;

        executiveMetrics.innerHTML = '';

        const metrics = [
            {
                label: 'Processing Speed',
                value: executive.processingSpeed || 0,
                description: 'How quickly you respond relative to your average',
                explanation: 'Measures your response speed compared to your own average time. Higher scores indicate faster, more efficient cognitive processing while maintaining accuracy.'
            },
            {
                label: 'Impulsivity Control',
                value: executive.impulsivityControl || 0,
                description: 'Ability to avoid hasty, incorrect answers',
                explanation: 'Shows your capacity to resist quick, impulsive responses that lead to errors. Higher scores indicate better self-control and careful, deliberate thinking.'
            },
            {
                label: 'Analytical Thinking',
                value: executive.analyticalThinking || 0,
                description: 'Tendency to take time for thoughtful, correct answers',
                explanation: 'Reflects your approach to problem-solving. Higher scores indicate you take appropriate time to analyze questions, leading to more thoughtful and correct answers.'
            },
            {
                label: 'Cognitive Endurance',
                value: executive.endurance || 0,
                description: 'Ability to maintain performance throughout the session',
                explanation: 'Measures whether your performance stays consistent or declines as the session progresses. Higher scores show sustained focus, energy, and cognitive stamina.'
            },
            {
                label: 'Self Regulation',
                value: executive.selfRegulation || 0,
                description: 'Capacity to recover and adapt after difficulties',
                explanation: 'Indicates your ability to manage and regulate your own learning process, especially after encountering challenges. Higher scores show strong self-management and adaptive learning skills.'
            }
        ];

        metrics.forEach(metric => {
            const card = this.createCognitiveMetricCard(metric);
            executiveMetrics.appendChild(card);
        });
    }
    
    createCognitiveMetricCard(metric) {
        const card = document.createElement('div');
        card.className = 'cognitive-metric-card';
        
        const percentage = Math.round(metric.value * 100);
        const normalizedValue = Math.max(0, Math.min(100, percentage));
        
        // Color based on value
        let color = '#2563eb'; // blue
        if (normalizedValue >= 70) color = '#10b981'; // green
        else if (normalizedValue >= 40) color = '#f59e0b'; // amber
        else color = '#ef4444'; // red

        const explanation = metric.explanation || '';
        const hasExplanation = explanation && explanation !== metric.description;

        card.innerHTML = `
            <div class="cognitive-metric-header">
                <span class="cognitive-metric-label">${metric.label}</span>
                <span class="cognitive-metric-percentage" style="color: ${color}">${normalizedValue}%</span>
            </div>
            <div class="cognitive-metric-bar-container">
                <div class="cognitive-metric-bar" style="width: ${normalizedValue}%; background-color: ${color};"></div>
            </div>
            <div class="cognitive-metric-desc">${metric.description}</div>
            ${hasExplanation ? `
            <div class="cognitive-metric-explanation" style="display: none;">${explanation}</div>
            <button class="cognitive-metric-info-btn" type="button" onclick="const exp = this.previousElementSibling; exp.style.display = exp.style.display === 'none' ? 'block' : 'none'; this.innerHTML = exp.style.display === 'none' ? '<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line></svg> Learn more' : '<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line></svg> Show less';">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Learn more
            </button>
            ` : ''}
        `;

        return card;
    }
    
    displayTimeAnalysis() {
        const history = this.results.performanceHistory || [];
        const times = history.map(h => h.timeTakenMs || 0);
        const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
        const minTime = times.length > 0 ? Math.min(...times) : 0;
        const maxTime = times.length > 0 ? Math.max(...times) : 0;
        
        const timeStats = [
            {
                label: 'Average Time',
                value: `${Math.round(avgTime / 1000)}s`,
                description: 'Per question'
            },
            {
                label: 'Fastest Answer',
                value: `${Math.round(minTime / 1000)}s`,
                description: 'Quickest response'
            },
            {
                label: 'Slowest Answer',
                value: `${Math.round(maxTime / 1000)}s`,
                description: 'Longest response'
            },
            {
                label: 'Total Time',
                value: this.formatTime(this.results.timeTaken || 0),
                description: 'Session duration'
            }
        ];
        
        this.elements.timeStats.innerHTML = '';
        timeStats.forEach(stat => {
            const item = this.createTimeStatItem(stat);
            this.elements.timeStats.appendChild(item);
        });
        
        this.displayTimeChart(history);
    }
    
    createTimeStatItem(stat) {
        const div = document.createElement('div');
        div.className = 'time-stat-item';
        div.innerHTML = `
            <span class="time-stat-label">${stat.label}</span>
            <span class="time-stat-value">${stat.value}</span>
            <span class="time-stat-desc">${stat.description}</span>
        `;
        return div;
    }
    
    displayTimeChart(history) {
        const timeChartContainer = this.elements.timeChartContainer || document.getElementById('time-chart-container');
        if (!timeChartContainer) return;
        
        const times = history.map(h => Math.round((h.timeTakenMs || 0) / 1000));
        const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
        const maxTime = times.length > 0 ? Math.max(...times) : 0;
        
        if (times.length === 0) {
            timeChartContainer.innerHTML = '<p>No time data available</p>';
            return;
        }
        
        let timeVisualHTML = '<div class="time-visual-container">';
        timeVisualHTML += `<div class="time-average-indicator">Average Time: <strong>${avgTime}s</strong></div>`;
        timeVisualHTML += '<div class="time-bars-container">';
        
        times.forEach((time, index) => {
            const percentage = maxTime > 0 ? Math.round((time / maxTime) * 100) : 0;
            const isAboveAvg = time > avgTime;
            const barClass = isAboveAvg ? 'time-bar-above' : 'time-bar-below';
            
            timeVisualHTML += `
                <div class="time-bar-item">
                    <div class="time-bar-label">Q${index + 1}</div>
                    <div class="time-bar-wrapper">
                        <div class="time-bar ${barClass}" style="width: ${percentage}%" title="${time}s">
                            <span class="time-bar-value">${time}s</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        timeVisualHTML += '</div></div>';
        
        timeChartContainer.innerHTML = timeVisualHTML;
    }
    
    displayCategories() {
        const categories = this.results.categoryPerformance || {};
        
        this.elements.categoryGrid.innerHTML = '';
        
        Object.entries(categories).forEach(([category, data]) => {
            const card = this.createCategoryCard(category, data);
            this.elements.categoryGrid.appendChild(card);
        });
        
        if (Object.keys(categories).length === 0) {
            this.elements.categoryGrid.innerHTML = '<p>No category data available</p>';
        }
    }
    
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
    
    displayAchievements() {
        const achievements = this.calculateAchievements();
        
        this.elements.achievementsGrid.innerHTML = '';
        
        achievements.forEach(achievement => {
            const badge = this.createAchievementBadge(achievement);
            this.elements.achievementsGrid.appendChild(badge);
        });
        
        if (achievements.length === 0) {
            this.elements.achievementsGrid.innerHTML = '<p>No achievements unlocked yet</p>';
        }
    }
    
    calculateAchievements() {
        const achievements = [];
        const history = this.results.performanceHistory || [];
        const correct = this.results.correctAnswers || 0;
        const total = this.results.totalQuestions || 0;
        const percentage = this.results.percentage || 0;
        const bestStreak = this.calculateBestStreak(history);
        
        if (percentage >= 90) {
            achievements.push({
                icon: '🏆',
                name: 'Perfect Score',
                description: '90% or higher accuracy'
            });
        }
        
        if (bestStreak >= 10) {
            achievements.push({
                icon: '🔥',
                name: 'Hot Streak',
                description: `Streak of ${bestStreak} correct answers`
            });
        }
        
        if (this.results.promotionCount > 0) {
            achievements.push({
                icon: '📈',
                name: 'Level Up',
                description: 'Promoted to higher level'
            });
        }
        
        if (total >= 20) {
            achievements.push({
                icon: '💪',
                name: 'Persistent',
                description: 'Completed 20+ questions'
            });
        }
        
        return achievements;
    }
    
    createAchievementBadge(achievement) {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        badge.innerHTML = `
            <div class="badge-icon">${achievement.icon}</div>
            <div class="badge-name">${achievement.name}</div>
            <div class="badge-description">${achievement.description}</div>
        `;
        return badge;
    }
    
    displayReview() {
        const reviewData = this.results.performanceHistory || [];
        
        this.elements.reviewList.innerHTML = '';
        
        reviewData.forEach((item, index) => {
            const reviewItem = this.createReviewItem(item, index + 1);
            this.elements.reviewList.appendChild(reviewItem);
        });
    }
    
    createReviewItem(item, questionNum) {
        const div = document.createElement('div');
        div.className = 'review-item';
        
        const userAnswerText = item.selectedIndex !== undefined ? `Option ${String.fromCharCode(65 + item.selectedIndex)}` : 'N/A';
        const correctAnswerText = item.correctIndex !== undefined ? `Option ${String.fromCharCode(65 + item.correctIndex)}` : 'N/A';
        
        div.innerHTML = `
            <div class="review-question">
                <strong>Q${questionNum}:</strong> ${item.question || 'Question text'}
            </div>
            <div class="review-meta">
                <span class="review-level">Level ${item.level || 1}</span>
                <span class="review-difficulty">Difficulty ${item.difficulty || 1}</span>
                <span class="review-time">${Math.round((item.timeTakenMs || 0) / 1000)}s</span>
            </div>
            <div class="review-answer ${item.isCorrect ? 'correct' : 'wrong'}">
                Your answer: ${userAnswerText} 
                <span class="answer-icon ${item.isCorrect ? 'correct-icon' : 'wrong-icon'}">
                    ${item.isCorrect ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'}
                </span>
            </div>
            <div class="review-correct">
                Correct answer: ${correctAnswerText}
            </div>
            ${item.explanation ? `<div class="review-explanation">${item.explanation}</div>` : ''}
        `;
        
        return div;
    }
    
    setupEventListeners() {
        this.elements.exportBtn?.addEventListener('click', () => this.exportResults());
        this.elements.retakeBtn?.addEventListener('click', () => {
            window.location.href = 'setup.html';
        });
        this.elements.reviewToggle?.addEventListener('click', () => this.toggleReview());
    }
    
    exportResults() {
        if (typeof window.jspdf === 'undefined') {
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let yPos = margin;

        const results = this.results;
        const cognitive = results.cognitiveProfile || {};
        const cda = cognitive.cda || {};
        const executive = cognitive.executiveFunction || {};

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const userName = this.userName || results.userName || 'User';
        
        const addHeader = () => {
            doc.setFillColor(37, 99, 235);
            doc.rect(0, 0, pageWidth, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('NeuroQuiz™', margin, 20);
            
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Cognitive Assessment Report', margin, 30);
            
            doc.setTextColor(0, 0, 0);
            yPos = 50;
            
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text(`Assessment for: ${userName}`, margin, yPos);
            yPos += 8;
        };

        const addSectionTitle = (title, fontSize = 14) => {
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = margin;
            }
            yPos += 10;
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text(title, margin, yPos);
            yPos += 8;
            doc.setDrawColor(37, 99, 235);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2);
            yPos += 5;
        };

        const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
            if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = margin;
            }
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            doc.setTextColor(color[0], color[1], color[2]);
            const lines = doc.splitTextToSize(text, contentWidth);
            doc.text(lines, margin, yPos);
            yPos += lines.length * (fontSize * 0.4) + 3;
        };

        const addKeyValue = (key, value, indent = 0) => {
            if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = margin;
            }
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(key + ':', margin + indent, yPos);
            
            const valueX = margin + indent + 50;
            doc.setFont('helvetica', 'normal');
            const valueLines = doc.splitTextToSize(String(value), contentWidth - 50 - indent);
            doc.text(valueLines, valueX, yPos);
            yPos += Math.max(valueLines.length * 4, 6);
        };

        const addMetric = (label, value, maxValue = 100) => {
            if (yPos > pageHeight - 30) {
                doc.addPage();
                yPos = margin;
            }
            const percentage = typeof value === 'number' ? (value * maxValue) : parseFloat(value);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(`${label}:`, margin, yPos);
            
            doc.setFont('helvetica', 'bold');
            doc.text(`${percentage.toFixed(1)}%`, pageWidth - margin - 20, yPos);
            
            const barWidth = contentWidth - 30;
            const barHeight = 4;
            const fillWidth = (percentage / maxValue) * barWidth;
            
            doc.setDrawColor(200, 200, 200);
            doc.setFillColor(200, 200, 200);
            doc.rect(margin, yPos + 2, barWidth, barHeight, 'FD');
            
            if (percentage >= 70) {
                doc.setFillColor(16, 185, 129);
            } else if (percentage >= 40) {
                doc.setFillColor(245, 158, 11);
            } else {
                doc.setFillColor(239, 68, 68);
            }
            doc.rect(margin, yPos + 2, fillWidth, barHeight, 'F');
            
            yPos += 10;
        };

        addHeader();

        addSectionTitle('EXECUTIVE SUMMARY', 16);
        addText(`Assessment Date: ${formatDate(Date.now())}`, 10, false, [100, 100, 100]);
        yPos += 3;
        addText(`Participant: ${userName}`, 10, false, [100, 100, 100]);
        yPos += 3;
        addText(`Participant: ${userName}`, 10, false, [100, 100, 100]);
        yPos += 3;
        addText(`Session Duration: ${this.formatTime(results.timeTaken || 0)}`, 10, false, [100, 100, 100]);
        yPos += 3;
        addText(`Total Questions: ${results.totalQuestions || 0}`, 10, false, [100, 100, 100]);
        yPos += 5;

        if (cognitive.professionalSummary) {
            const personalizedSummary = cognitive.professionalSummary
                .replace(/\byour\b/gi, `${userName}'s`)
                .replace(/\byou\b/g, userName);
            addText(personalizedSummary, 11, false, [50, 50, 50]);
            yPos += 5;
        }

        addSectionTitle('PERFORMANCE METRICS', 14);
        addKeyValue('Accuracy', `${results.percentage || 0}%`);
        addKeyValue('Correct Answers', `${results.correctAnswers || 0} out of ${results.totalQuestions || 0}`);
        addKeyValue('Average Response Time', `${Math.round((results.averageTimeMs || 0) / 1000)}s per question`);
        addKeyValue('Questions per Minute', `${results.questionsPerMinute || 0}`);
        addKeyValue('Best Streak', `${results.bestStreak || 0} consecutive correct answers`);
        addKeyValue('Total Score', `${results.totalScore || 0} points`);

        addSectionTitle('COGNITIVE DIAGNOSTIC ASSESSMENT (CDA)', 14);
        addText('Based on Rule Space Method (Tatsuoka, 2009)', 9, false, [100, 100, 100]);
        yPos += 3;
        
        addMetric('Adaptability', cda.adaptability || 0);
        addMetric('Consistency', cda.consistency || 0);
        addMetric('Recovery Rate', cda.recovery || 0);
        addMetric('Error Persistence', cda.errorPersistence || 0);

        if (cda.knowledgeMastery && Object.keys(cda.knowledgeMastery).length > 0) {
            yPos += 3;
            addText('Knowledge Mastery by Category:', 10, true);
            yPos += 3;
            Object.entries(cda.knowledgeMastery).forEach(([category, score]) => {
                addMetric(category, score);
            });
        }

        addSectionTitle('EXECUTIVE FUNCTION INDICATORS', 14);
        addMetric('Processing Speed', executive.processingSpeed || 0);
        addMetric('Impulsivity Control', executive.impulsivityControl || 0);
        addMetric('Analytical Thinking', executive.analyticalThinking || 0);
        addMetric('Cognitive Endurance', executive.endurance || 0);
        addMetric('Self Regulation', executive.selfRegulation || 0);

        addSectionTitle('RB-ADA ALGORITHM METRICS', 14);
        addKeyValue('Initial Level', this.getLevelName(results.initialLevel || 1));
        addKeyValue('Final Level', this.getLevelName(results.finalLevel || results.currentLevel || 1));
        addKeyValue('Initial Difficulty', results.initialDifficulty || 1);
        addKeyValue('Final Difficulty', results.finalDifficulty || results.currentDifficulty || 1);
        addKeyValue('Level Drops', results.dropCount || 0);
        addKeyValue('Level Promotions', results.promotionCount || 0);
        addKeyValue('Net Level Change', (results.netLevelChange || 0) > 0 ? `+${results.netLevelChange}` : results.netLevelChange || 0);

        if (results.categoryPerformance && Object.keys(results.categoryPerformance).length > 0) {
            addSectionTitle('CATEGORY PERFORMANCE', 14);
            Object.entries(results.categoryPerformance).forEach(([category, data]) => {
                const accuracy = data.total > 0 ? ((data.correct / data.total) * 100) : 0;
                addKeyValue(category, `${data.correct}/${data.total} correct (${accuracy.toFixed(1)}%)`);
            });
        }

        addSectionTitle('REFERENCE', 14);
        addText('Cognitive Assessment: An Introduction to the Rule Space Method', 10, true);
        addText('Kikumi K. Tatsuoka (2009). Routledge.', 10, false, [100, 100, 100]);
        yPos += 5;
        addText('This assessment utilizes Cognitive Diagnostic Assessment principles, particularly the Rule Space Method, to provide detailed insights into knowledge mastery and learning patterns beyond aggregate scores.', 9, false, [80, 80, 80]);

        yPos += 10;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by NeuroQuiz™ - Cognitive Assessment Platform', margin, yPos);
        doc.text(`Report ID: ${Date.now()}`, pageWidth - margin - 30, yPos);

        const fileName = `NeuroQuiz-Report-${new Date().toISOString().split('T')[0]}-${Date.now()}.pdf`;
        doc.save(fileName);
    }
    
    toggleReview() {
        const isExpanded = this.elements.reviewContent.getAttribute('aria-hidden') === 'false';
        this.elements.reviewContent.setAttribute('aria-hidden', isExpanded);
        this.elements.reviewToggle.setAttribute('aria-expanded', !isExpanded);
        const icon = this.elements.reviewToggle.querySelector('.toggle-icon');
        if (icon) {
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    getLevelName(level) {
        const names = { 1: 'Elementary', 2: 'Secondary', 3: 'University' };
        return names[level] || `Level ${level}`;
    }
    
    calculateBestStreak(history) {
        let bestStreak = 0;
        let currentStreak = 0;
        
        history.forEach(item => {
            if (item.isCorrect) {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });
        
        return bestStreak;
    }
    
    calculateTotalScore(history) {
        return history
            .filter(item => item.isCorrect)
            .reduce((sum, item) => sum + ((item.difficulty || 1) * 10), 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const resultsUI = new ResultsUIController();
    resultsUI.init();
});
