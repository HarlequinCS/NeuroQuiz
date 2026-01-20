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
            retakeBtn: document.getElementById('retake-btn')
        };
        
        this.results = null;
        this.charts = {};
        this.eventListenersSetup = false; // Flag to prevent duplicate listeners
        
        console.log('ResultsUIController initialized');
    }
    
    init() {
        this.loadResults();
        this.loadUserName();
        
        if (!this.results) {
            console.warn('Results data not found; redirecting to setup page');
            window.location.href = 'setup.html';
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
        // Wait for cognitive data to be ready before rendering chart
        setTimeout(() => {
            this.displayChart();
        }, 100);
        this.displayTimeAnalysis();
        this.displayAchievements();
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
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
            },
            {
                label: 'Accuracy',
                value: `${percentage}%`,
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'
            },
            {
                label: 'Time Taken',
                value: this.formatTime(timeTaken),
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
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
        
        if (this.charts.cognitiveRadar) {
            this.charts.cognitiveRadar.destroy();
            this.charts.cognitiveRadar = null;
        }
        
        chartWrapper.innerHTML = '';
        
        let cognitive = this.results.cognitiveProfile;
        if (!cognitive && typeof window !== 'undefined' && window.CognitiveAnalyzer) {
            try {
                cognitive = window.CognitiveAnalyzer.analyzeCognitiveProfile(this.results);
                this.results.cognitiveProfile = cognitive;
            } catch (e) {
                console.error('Error computing cognitive profile for chart:', e);
            }
        }
        
        const cda = (cognitive || {}).cda || {};
        const executive = (cognitive || {}).executiveFunction || {};
        
        const canvas = document.createElement('canvas');
        canvas.id = 'cognitive-chart';
        canvas.width = 600;
        canvas.height = 600;
        chartWrapper.appendChild(canvas);
        
        const labels = [
            'Adaptability', 'Consistency', 'Recovery', 'Processing Speed',
            'Impulsivity Control', 'Analytical Thinking', 'Endurance', 'Self Regulation'
        ];
        
        const getValue = (val) => {
            if (val === undefined || val === null) return 0;
            if (val > 1) return Math.min(100, Math.round(val));
            return Math.round(val * 100);
        };
        
        const data = [
            getValue(cda.adaptability),
            getValue(cda.consistency),
            getValue(cda.recovery),
            getValue(executive.processingSpeed),
            getValue(executive.impulsivityControl),
            getValue(executive.analyticalThinking),
            getValue(executive.endurance),
            getValue(executive.selfRegulation)
        ];
        
        console.log('Radar chart data:', { labels, data, cda, executive });
        
        if (typeof Chart !== 'undefined') {
            const getComputedStyleValue = (property) => {
                return getComputedStyle(document.documentElement).getPropertyValue(property).trim() || '#2563eb';
            };
            
            const primaryColor = getComputedStyleValue('--color-primary');
            const textColor = getComputedStyleValue('--color-text-primary');
            const bgColor = getComputedStyleValue('--color-bg-secondary');
            const borderColor = getComputedStyleValue('--color-border');
            
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
            const tickColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
            const pointLabelColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
            
            const ctx = canvas.getContext('2d');
            this.charts.cognitiveRadar = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cognitive Performance',
                        data: data,
                        borderColor: primaryColor,
                        backgroundColor: isDark 
                            ? 'rgba(37, 99, 235, 0.3)' 
                            : 'rgba(37, 99, 235, 0.2)',
                        pointBackgroundColor: primaryColor,
                        pointBorderColor: isDark ? '#1e293b' : '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverBackgroundColor: isDark ? '#3b82f6' : '#fff',
                        pointHoverBorderColor: primaryColor,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            min: 0,
                            ticks: {
                                stepSize: 20,
                                font: { size: 13 },
                                color: tickColor,
                                showLabelBackdrop: false,
                                z: 1
                            },
                            grid: {
                                color: gridColor,
                                lineWidth: 1.5
                            },
                            pointLabels: {
                                font: { size: 14, weight: '600' },
                                color: pointLabelColor,
                                padding: 12
                            },
                            angleLines: {
                                color: gridColor,
                                lineWidth: 1.5
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                            titleColor: isDark ? '#fff' : '#fff',
                            bodyColor: isDark ? '#fff' : '#fff',
                            borderColor: primaryColor,
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: (context) => `${context.label}: ${context.parsed.r}%`
                            }
                        }
                    }
                }
            });
        }
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
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>'
            },
            {
                title: 'Average Time',
                value: `${Math.round(avgTime / 1000)}s`,
                description: `Per question average`,
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
            },
            {
                title: 'Total Time',
                value: this.formatTime(totalTime),
                description: `Complete session duration`,
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
            },
            {
                title: 'Questions/Min',
                value: totalTime > 0 ? (total / (totalTime / 60)).toFixed(1) : '0',
                description: `Pacing rate`,
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
            },
            {
                title: 'Best Streak',
                value: this.calculateBestStreak(history),
                description: `Consecutive correct answers`,
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>'
            },
            {
                title: 'Score',
                value: this.calculateTotalScore(history),
                description: `Total points earned`,
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
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
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>',
                name: 'Perfect Score',
                description: '90% or higher accuracy'
            });
        }
        
        if (bestStreak >= 10) {
            achievements.push({
                icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
                name: 'Hot Streak',
                description: `Streak of ${bestStreak} correct answers`
            });
        }
        
        if (this.results.promotionCount > 0) {
            achievements.push({
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
                name: 'Level Up',
                description: 'Promoted to higher level'
            });
        }
        
        if (total >= 20) {
            achievements.push({
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
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
    
    // displayReview() method removed - review section no longer displayed
    
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
        // Prevent duplicate event listeners
        if (this.eventListenersSetup) {
            return;
        }
        
        // Export button handler
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.exportResults();
            }, { once: false });
        }
        
        // Retake button handler
        if (this.elements.retakeBtn) {
            this.elements.retakeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'setup.html';
            }, { once: false });
        }
        
        this.eventListenersSetup = true;
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
        let pageNumber = 1;
        
        // Set white page background
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

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
        
        // Professional White Background with Dark Blue Theme
        const darkBlue = [15, 23, 42]; // Deep dark blue (#0f172a) - Header background
        const darkBlueMedium = [30, 41, 59]; // Medium dark blue (#1e293b) - Accents
        const primaryColor = [37, 99, 235]; // Dark Blue (#2563eb) - Primary accent
        const primaryDark = [29, 78, 216]; // Deeper Blue (#1d4ed8) - Darker accent
        const primaryLight = [59, 130, 246]; // Medium Blue (#3b82f6) - Light accents
        const successColor = [16, 185, 129]; // Green (#10b981) - Success indicators
        const warningColor = [245, 158, 11]; // Amber (#f59e0b) - Warning
        const errorColor = [239, 68, 68]; // Red (#ef4444) - Error/Low
        const textColor = [17, 24, 39]; // Dark gray (#111827) - Main text on white
        const textSecondary = [75, 85, 99]; // Medium gray (#4b5563) - Secondary text
        const textTertiary = [107, 114, 128]; // Light gray (#6b7280) - Tertiary text
        const surfaceBase = [255, 255, 255]; // White - Page background
        const surfaceElevated = [249, 250, 251]; // Very light gray (#f9fafb) - Cards
        const surfaceSubtle = [243, 244, 246]; // Light gray (#f3f4f6) - Subtle backgrounds
        const borderColor = [229, 231, 235]; // Light gray (#e5e7eb) - Borders
        const borderAccent = [37, 99, 235]; // Dark blue border accent
        
        const addLogoAndHeader = () => {
            // Header background - Dark blue professional header
            doc.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
            doc.rect(0, 0, pageWidth, 55, 'F');
            
            // Dark blue accent stripe at top
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, pageWidth, 4, 'F');
            
            // Add logo image in header (logo.png for PDF compatibility)
            // Logo dimensions: 35x15mm (proportional and fits well in header)
            try {
                const logoImg = document.querySelector('.logo');
                if (logoImg && logoImg.src) {
                    // Use the loaded logo image from the page
                    doc.addImage(logoImg.src, 'PNG', margin + 2, 10, 35, 15);
                } else {
                    // Try to load from path
                    doc.addImage('assets/images/logo.png', 'PNG', margin + 2, 10, 35, 15);
                }
            } catch (imgError) {
                // If image loading fails, use text logo as fallback
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(30);
                doc.setFont('helvetica', 'bold');
                doc.text('NeuroQuiz™', margin + 15, 20);
                
                // Accent line under logo
                doc.setDrawColor(255, 255, 255);
                doc.setLineWidth(1);
                doc.line(margin + 15, 22, margin + 75, 22);
            }
            
            // Subtitle
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('COGNITIVE ASSESSMENT REPORT', margin + 15, 28);
            
            // Institutional affiliation
            doc.setFontSize(8);
            doc.setTextColor(240, 240, 240);
            doc.text('Universiti Teknologi Mara Cawangan Melaka Kampus Jasin', margin + 15, 33);
            
            // Report metadata in header (right side)
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);
            doc.text(`Generated: ${formatDate(Date.now())}`, pageWidth - margin - 5, 18, { align: 'right' });
            doc.text(`Report ID: ${Date.now().toString().slice(-8)}`, pageWidth - margin - 5, 23, { align: 'right' });
            doc.text(`Participant: ${userName}`, pageWidth - margin - 5, 28, { align: 'right' });
            
            // Bottom border of header
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(1.5);
            doc.line(0, 55, pageWidth, 55);
            
            yPos = 70;
        };
        
        const addPageFooter = () => {
            const footerY = pageHeight - 15;
            
            // Footer border
            doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
            doc.setLineWidth(0.5);
            doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
            
            // Dark blue accent line
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(margin, footerY - 4.5, (pageWidth - margin * 2) * 0.25, 1.5, 'F');
            
            // Footer text
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textTertiary[0], textTertiary[1], textTertiary[2]);
            doc.text('NeuroQuiz™ - Cognitive Assessment Platform | Universiti Teknologi Mara', margin, footerY, { align: 'left' });
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(`Page ${pageNumber}`, pageWidth - margin, footerY, { align: 'right' });
            
            pageNumber++;
        };
        
        const addNewPage = () => {
            addPageFooter();
            doc.addPage();
            // Set white background for new page
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            addLogoAndHeader();
        };

        const addSectionTitle = (title, fontSize = 16) => {
            if (yPos > pageHeight - 40) {
                addNewPage();
            }
            yPos += 15;
            
            // Light background box behind title for professional look
            doc.setFillColor(surfaceElevated[0], surfaceElevated[1], surfaceElevated[2]);
            doc.rect(margin - 2, yPos - fontSize * 0.65, contentWidth + 4, fontSize * 1.4, 'F');
            
            // Dark blue left accent bar
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(margin - 2, yPos - fontSize * 0.65, 5, fontSize * 1.4, 'F');
            
            // Section title with dark blue color
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(title, margin + 10, yPos);
            
            // Dark blue accent line
            yPos += 7;
            doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.setLineWidth(2);
            doc.line(margin + 10, yPos - 2, margin + 70, yPos - 2);
            
            // Secondary accent line
            doc.setDrawColor(primaryLight[0], primaryLight[1], primaryLight[2]);
            doc.setLineWidth(0.8);
            doc.line(margin + 10, yPos, margin + 50, yPos);
            
            yPos += 10;
        };

        const addText = (text, fontSize = 10, isBold = false, color = textColor) => {
            if (yPos > pageHeight - 35) {
                addNewPage();
            }
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', isBold ? 'bold' : 'normal');
            doc.setTextColor(color[0], color[1], color[2]);
            const lines = doc.splitTextToSize(text, contentWidth);
            doc.text(lines, margin, yPos);
            yPos += lines.length * (fontSize * 0.5) + 5;
        };

        const addKeyValue = (key, value, indent = 0) => {
            if (yPos > pageHeight - 30) {
                addNewPage();
            }
            
            // Professional key-value styling
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(key + ':', margin + indent, yPos);
            
            const valueX = margin + indent + 55;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textSecondary[0], textSecondary[1], textSecondary[2]);
            const valueLines = doc.splitTextToSize(String(value), contentWidth - 55 - indent);
            doc.text(valueLines, valueX, yPos);
            yPos += Math.max(valueLines.length * 5, 8);
        };

        const addMetric = (label, value, maxValue = 100) => {
            if (yPos > pageHeight - 30) {
                addNewPage();
            }
            
            const percentage = typeof value === 'number' && value <= 1 ? (value * maxValue) : (typeof value === 'number' ? value : parseFloat(value));
            
            // Label
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(`${label}:`, margin, yPos);
            
            // Percentage value with dark blue color
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(`${Math.min(percentage, maxValue).toFixed(1)}%`, pageWidth - margin - 25, yPos, { align: 'right' });
            
            // Professional progress bar
            const barWidth = contentWidth - 35;
            const barHeight = 6;
            const fillWidth = Math.min((percentage / maxValue) * barWidth, barWidth);
            
            // Light background bar
            doc.setFillColor(surfaceSubtle[0], surfaceSubtle[1], surfaceSubtle[2]);
            doc.rect(margin, yPos + 3.5, barWidth, barHeight, 'F');
            
            // Border
            doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
            doc.setLineWidth(0.3);
            doc.rect(margin, yPos + 3.5, barWidth, barHeight, 'D');
            
            // Color-coded fill bar
            let fillColor;
            if (percentage >= 70) {
                fillColor = [successColor[0], successColor[1], successColor[2]]; // Green
            } else if (percentage >= 40) {
                fillColor = [warningColor[0], warningColor[1], warningColor[2]]; // Amber
            } else {
                fillColor = [errorColor[0], errorColor[1], errorColor[2]]; // Red
            }
            
            if (fillWidth > 0) {
                // Main fill
                doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
                doc.rect(margin, yPos + 3.5, fillWidth, barHeight, 'F');
                
                // Highlight effect on top
                const highlightColor = [
                    Math.min(255, fillColor[0] + 30),
                    Math.min(255, fillColor[1] + 30),
                    Math.min(255, fillColor[2] + 30)
                ];
                doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]);
                doc.rect(margin, yPos + 3.5, fillWidth, barHeight * 0.4, 'F');
                
                // Border
                doc.setDrawColor(fillColor[0], fillColor[1], fillColor[2]);
                doc.setLineWidth(0.3);
                doc.rect(margin, yPos + 3.5, fillWidth, barHeight, 'D');
            }
            
            yPos += 13;
        };

        const addInfoBox = (items) => {
            if (yPos > pageHeight - 60) {
                addNewPage();
            }
            
            const boxHeight = items.length * 8 + 14;
            
            // Light background box
            doc.setFillColor(surfaceElevated[0], surfaceElevated[1], surfaceElevated[2]);
            doc.rect(margin, yPos, contentWidth, boxHeight, 'F');
            
            // Dark blue left accent border
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(margin, yPos, 4, boxHeight, 'F');
            
            // Professional border
            doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
            doc.setLineWidth(0.5);
            doc.rect(margin, yPos, contentWidth, boxHeight, 'D');
            
            yPos += 7;
            items.forEach(([key, value], index) => {
                // Alternating row background for better readability
                if (index % 2 === 0) {
                    doc.setFillColor(255, 255, 255);
                    doc.rect(margin + 4, yPos - 3, contentWidth - 4, 7, 'F');
                }
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.text(key + ':', margin + 10, yPos);
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                doc.text(String(value), margin + 50, yPos);
                yPos += 8;
            });
            yPos += 10;
        };

        // Start with professional header
        addLogoAndHeader();

        // Executive Summary with info box
        addSectionTitle('EXECUTIVE SUMMARY', 18);
        
        addText('This comprehensive cognitive assessment report provides detailed insights into your learning performance, cognitive abilities, and adaptive learning patterns. The analysis is based on advanced cognitive diagnostic assessment (CDA) methodologies and executive function theory.', 10, false, textSecondary);
        yPos += 5;
        
        addInfoBox([
            ['Participant Name', userName],
            ['Assessment Date', formatDate(Date.now())],
            ['Session Duration', this.formatTime(results.timeTaken || 0)],
            ['Total Questions', `${results.totalQuestions || 0} questions`],
            ['Overall Performance', `${results.percentage || 0}% accuracy`]
        ]);
        
        yPos += 3;

        if (cognitive.professionalSummary) {
            addText('Cognitive Profile Summary:', 11, true, primaryColor);
            yPos += 2;
            const personalizedSummary = cognitive.professionalSummary
                .replace(/\byour\b/gi, `${userName}'s`)
                .replace(/\byou\b/g, userName);
            addText(personalizedSummary, 10, false, textColor);
            yPos += 5;
        }

        // Performance Metrics Section
        addSectionTitle('PERFORMANCE METRICS', 16);
        
        addText('This section provides a comprehensive overview of your quiz performance, including accuracy, response times, and achievement metrics. These metrics help identify strengths and areas for improvement in your learning journey.', 10, false, textSecondary);
        yPos += 5;
        
        addInfoBox([
            ['Accuracy Rate', `${results.percentage || 0}%`],
            ['Correct Answers', `${results.correctAnswers || 0} / ${results.totalQuestions || 0}`],
            ['Average Response Time', `${Math.round((results.averageTimeMs || 0) / 1000)}s per question`],
            ['Questions per Minute', `${(results.questionsPerMinute || 0).toFixed(1)}`],
            ['Best Streak', `${results.bestStreak || 0} consecutive correct`],
            ['Total Score', `${results.totalScore || 0} points`]
        ]);
        
        yPos += 3;
        
        // Add explanations for key metrics
        addText('Metric Explanations:', 10, true, primaryColor);
        yPos += 2;
        addText('• Accuracy Rate: The percentage of questions answered correctly, indicating overall knowledge mastery.', 9, false, textSecondary);
        yPos += 3;
        addText('• Average Response Time: Mean time taken per question, reflecting cognitive processing speed and decision-making efficiency.', 9, false, textSecondary);
        yPos += 3;
        addText('• Best Streak: Longest sequence of consecutive correct answers, demonstrating sustained focus and knowledge retention.', 9, false, textSecondary);
        yPos += 3;
        addText('• Total Score: Cumulative points earned based on question difficulty, rewarding performance on challenging questions.', 9, false, textSecondary);
        yPos += 5;

        // Cognitive Diagnostic Assessment Section
        addSectionTitle('COGNITIVE DIAGNOSTIC ASSESSMENT (CDA)', 16);
        addText('Based on Rule Space Method - Tatsuoka (2009)', 9, false, textTertiary);
        yPos += 2;
        
        addText('The Cognitive Diagnostic Assessment (CDA) framework provides detailed insights into your learning patterns and knowledge mastery. Unlike traditional assessments that only provide aggregate scores, CDA identifies specific cognitive attributes and learning behaviors through the Rule Space Method.', 10, false, textSecondary);
        yPos += 5;
        
        addText('CDA Metrics:', 11, true, primaryColor);
        yPos += 2;
        
        addMetric('Adaptability', cda.adaptability || 0);
        addText('Measures your ability to adjust performance when question difficulty changes. Higher scores indicate better adaptation to new challenge levels, showing flexibility in learning and problem-solving approaches.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Consistency', cda.consistency || 0);
        addText('Reflects the stability and predictability of your performance patterns. Higher scores mean more consistent results with less variability, indicating reliable knowledge application across different question types.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Recovery Rate', cda.recovery || 0);
        addText('Shows how quickly and effectively you recover after the system lowers your level due to difficulty. Higher scores indicate strong resilience, learning from setbacks, and the ability to bounce back from challenges.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Error Persistence', cda.errorPersistence || 0);
        addText('Indicates how often errors occur in sequence. Lower scores are better, showing you learn from mistakes quickly and avoid repeating them, demonstrating effective error correction strategies.', 9, false, textTertiary);
        yPos += 3;

        if (cda.knowledgeMastery && Object.keys(cda.knowledgeMastery).length > 0) {
            yPos += 3;
            addText('Knowledge Mastery by Category:', 10, true);
            yPos += 3;
            Object.entries(cda.knowledgeMastery).forEach(([category, score]) => {
                addMetric(category, score);
            });
        }

        // Executive Function Indicators Section
        addSectionTitle('EXECUTIVE FUNCTION INDICATORS', 16);
        
        addText('Executive functions are higher-order cognitive processes that enable goal-directed behavior, problem-solving, and adaptive learning. These indicators assess your cognitive control mechanisms and self-regulatory abilities based on your response patterns throughout the assessment.', 10, false, textSecondary);
        yPos += 5;
        
        addText('Executive Function Metrics:', 11, true, primaryColor);
        yPos += 2;
        
        addMetric('Processing Speed', executive.processingSpeed || 0);
        addText('Measures your response speed compared to your own average time. Higher scores indicate faster, more efficient cognitive processing while maintaining accuracy, reflecting optimal balance between speed and precision.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Impulsivity Control', executive.impulsivityControl || 0);
        addText('Shows your capacity to resist quick, impulsive responses that lead to errors. Higher scores indicate better self-control and careful, deliberate thinking, demonstrating effective inhibition of automatic responses.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Analytical Thinking', executive.analyticalThinking || 0);
        addText('Reflects your approach to problem-solving. Higher scores indicate you take appropriate time to analyze questions, leading to more thoughtful and correct answers, showing strong analytical reasoning skills.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Cognitive Endurance', executive.endurance || 0);
        addText('Measures whether your performance stays consistent or declines as the session progresses. Higher scores show sustained focus, energy, and cognitive stamina, indicating strong mental endurance throughout extended tasks.', 9, false, textTertiary);
        yPos += 3;
        
        addMetric('Self Regulation', executive.selfRegulation || 0);
        addText('Indicates your ability to manage and regulate your own learning process, especially after encountering challenges. Higher scores show strong self-management and adaptive learning skills, demonstrating effective metacognitive control.', 9, false, textTertiary);
        yPos += 3;

        // RB-ADA Algorithm Metrics Section
        addSectionTitle('RB-ADA ALGORITHM METRICS', 16);
        
        addText('The Rule-Based Adaptive Dynamic Algorithm (RB-ADA) dynamically adjusts question difficulty in real-time based on your performance. This section shows how the adaptive system responded to your learning patterns, tracking your progression through different difficulty levels and education tiers.', 10, false, textSecondary);
        yPos += 5;
        
        addInfoBox([
            ['Initial Level', this.getLevelName(results.initialLevel || 1)],
            ['Final Level', this.getLevelName(results.finalLevel || results.currentLevel || 1)],
            ['Initial Difficulty', results.initialDifficulty || 1],
            ['Final Difficulty', results.finalDifficulty || results.currentDifficulty || 1],
            ['Level Drops', results.dropCount || 0],
            ['Level Promotions', results.promotionCount || 0],
            ['Net Level Change', (results.netLevelChange || 0) > 0 ? `+${results.netLevelChange}` : results.netLevelChange || 0]
        ]);
        
        yPos += 3;
        
        addText('Algorithm Behavior Explanation:', 10, true, primaryColor);
        yPos += 2;
        addText('• Level Drops: Occur when the system detects difficulty, automatically adjusting to an appropriate challenge level to maintain optimal learning conditions.', 9, false, textTertiary);
        yPos += 3;
        addText('• Level Promotions: Triggered by consistent strong performance, indicating mastery at the current level and readiness for more challenging content.', 9, false, textTertiary);
        yPos += 3;
        addText('• Net Level Change: Overall progression indicator showing whether you advanced, maintained, or adjusted your learning level during the session.', 9, false, textTertiary);
        yPos += 5;

        if (results.categoryPerformance && Object.keys(results.categoryPerformance).length > 0) {
            addSectionTitle('CATEGORY PERFORMANCE', 14);
            Object.entries(results.categoryPerformance).forEach(([category, data]) => {
                const accuracy = data.total > 0 ? ((data.correct / data.total) * 100) : 0;
                addKeyValue(category, `${data.correct}/${data.total} correct (${accuracy.toFixed(1)}%)`);
            });
        }

        // Reference Section
        addSectionTitle('METHODOLOGY & REFERENCE', 16);
        
        addText('This assessment is grounded in established cognitive science research and educational assessment methodologies. The following references and explanations provide context for the analytical frameworks used in this report.', 10, false, textSecondary);
        yPos += 5;
        
        addText('Primary Reference:', 11, true, primaryColor);
        yPos += 2;
        addText('Cognitive Assessment: An Introduction to the Rule Space Method', 10, true, textColor);
        addText('Kikumi K. Tatsuoka (2009). Routledge.', 9, false, textSecondary);
        yPos += 3;
        
        addText('Methodology Overview:', 11, true, primaryColor);
        yPos += 2;
        addText('This assessment utilizes Cognitive Diagnostic Assessment (CDA) principles, particularly the Rule Space Method, to provide detailed insights into knowledge mastery and learning patterns beyond aggregate scores. The Rule Space Method enables fine-grained analysis of cognitive attributes and learning behaviors, identifying specific strengths and areas for improvement.', 9, false, textTertiary);
        yPos += 4;
        
        addText('The RB-ADA (Rule-Based Adaptive Dynamic Algorithm) adapts question difficulty in real-time based on cognitive load theory, ensuring optimal challenge levels that promote learning without overwhelming the participant. This adaptive approach maintains engagement while providing accurate assessments of current knowledge and cognitive capabilities.', 9, false, textTertiary);
        yPos += 4;
        
        addText('Key Theoretical Foundations:', 11, true, primaryColor);
        yPos += 2;
        addText('• Cognitive Load Theory: Optimizes question difficulty to maintain cognitive engagement without overload', 9, false, textTertiary);
        yPos += 3;
        addText('• Spaced Repetition: Enhances long-term memory retention through strategic question timing', 9, false, textTertiary);
        yPos += 3;
        addText('• Executive Function Theory: Assesses higher-order cognitive processes including self-regulation and cognitive control', 9, false, textTertiary);
        yPos += 3;
        addText('• Adaptive Learning: Dynamically adjusts content difficulty based on real-time performance feedback', 9, false, textTertiary);
        yPos += 5;
        
        addText('Report Validity:', 11, true, primaryColor);
        yPos += 2;
        addText('This report is generated from a single assessment session and reflects performance patterns observed during that specific time period. For comprehensive evaluation, multiple assessments over time provide more robust insights into learning progression and cognitive development.', 9, false, textTertiary);
        yPos += 5;

        // Final footer on last page
        addPageFooter();

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const reportId = Date.now().toString().slice(-8);
        const fileName = `NeuroQuiz-Report-${userName.replace(/\s+/g, '-')}-${timestamp}-${reportId}.pdf`;
        
        doc.save(fileName);
    }
    
    // toggleReview() method removed - review section no longer displayed
    
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
