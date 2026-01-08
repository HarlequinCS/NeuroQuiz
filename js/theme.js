/**
 * NeuroQuiz™ - Theme Controller
 * 
 * UI Team: This file handles theme switching (light/dark/high-contrast).
 * You can modify theme toggle UI and add new themes here.
 * 
 * Themes are applied via data-theme attribute on <html> element.
 * CSS variables in theme.css handle the actual styling.
 */

/**
 * ThemeController Class
 * Manages theme switching and persistence
 */
class ThemeController {
    constructor() {
        this.themes = ['light', 'dark', 'high-contrast'];
        this.currentTheme = 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }
    
    /**
     * Initialize theme controller
     */
    init() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('neuroquiz-theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.setTheme(savedTheme);
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.setTheme('dark');
            }
        }
        
        // Setup toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a theme
                if (!localStorage.getItem('neuroquiz-theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    /**
     * Set theme
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        if (!this.themes.includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }
        
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('neuroquiz-theme', theme);
        
        // Update icon
        this.updateIcon();
    }
    
    /**
     * Toggle between themes
     */
    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }
    
    /**
     * Update theme icon
     */
    updateIcon() {
        if (!this.themeIcon) return;
        
        const icons = {
            'light': '🌙',
            'dark': '☀️',
            'high-contrast': '🔆'
        };
        
        this.themeIcon.textContent = icons[this.currentTheme] || '🌙';
    }
    
    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize theme controller
let themeController;

document.addEventListener('DOMContentLoaded', () => {
    themeController = new ThemeController();
});

// Export for global access if needed
window.ThemeController = ThemeController;

