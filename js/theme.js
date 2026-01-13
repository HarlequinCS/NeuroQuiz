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
            'light': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
            'dark': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
            'high-contrast': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path><circle cx="12" cy="12" r="5"></circle></svg>'
        };
        
        if (this.themeIcon) {
            this.themeIcon.innerHTML = icons[this.currentTheme] || icons['light'];
        }
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

