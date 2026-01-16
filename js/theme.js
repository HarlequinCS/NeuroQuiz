/**
 * NeuroQuiz™ - Global Theme Controller
 * 
 * Manages Light, Dark, and Color Blind modes for entire application.
 * Persists user preference in localStorage.
 */

/**
 * ThemeController Class
 * Handles global mode switching and persistence
 */
class ThemeController {
    constructor() {
        this.currentMode = 'light'; // Default: light mode
        this.init();
    }
    
    /**
     * Initialize theme controller
     */
    init() {
        // Load saved mode from localStorage
        const savedMode = localStorage.getItem('neuroquizTheme');
        if (savedMode && ['light', 'dark', 'colorblind'].includes(savedMode)) {
            this.currentMode = savedMode;
        }
        
        // Apply saved mode
        this.applyMode(this.currentMode);
        
        // Initialize mode buttons
        this.initModeButtons();
    }
    
    /**
     * Apply mode globally to document
     * @param {string} mode - 'light', 'dark', or 'colorblind'
     */
    applyMode(mode) {
        if (!['light', 'dark', 'colorblind'].includes(mode)) {
            mode = 'light'; // Fallback to light
        }
        
        this.currentMode = mode;
        
        // Remove all theme attributes first
        document.documentElement.removeAttribute('data-theme');
        
        // Apply theme (light mode is default, no attribute needed)
        if (mode !== 'light') {
            document.documentElement.setAttribute('data-theme', mode);
        }
        
        // Save to localStorage
        localStorage.setItem('neuroquizTheme', mode);
        
        // Update active button state
        this.updateActiveButton(mode);
    }
    
    /**
     * Initialize mode button event listeners
     */
    initModeButtons() {
        const buttons = document.querySelectorAll('.mode-btn[data-mode]');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const mode = btn.getAttribute('data-mode');
                this.applyMode(mode);
                
                // Provide immediate visual feedback
                btn.focus();
            });
        });
    }
    
    /**
     * Update active button state
     * @param {string} activeMode - The active mode
     */
    updateActiveButton(activeMode) {
        const buttons = document.querySelectorAll('.mode-btn[data-mode]');
        
        buttons.forEach(btn => {
            const btnMode = btn.getAttribute('data-mode');
            if (btnMode === activeMode) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    /**
     * Get current mode
     * @returns {string} Current mode
     */
    getCurrentMode() {
        return this.currentMode;
    }
}

// Initialize theme controller
let themeController;

document.addEventListener('DOMContentLoaded', () => {
    themeController = new ThemeController();
});

// Export for global access
window.ThemeController = ThemeController;

