/**
 * NeuroQuiz™ - Language Controller
 * 
 * Handles language switching and translation
 */

class LanguageController {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = null;
        this.isInitialized = false;
        this.translationQueue = [];
    }
    
    /**
     * Initialize language controller (non-blocking)
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Check if translations are already loaded
            if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS) {
                this.translations = TRANSLATIONS;
                this.initializeLanguage();
                this.isInitialized = true;
                return;
            }
            
            // Wait for translations with timeout
            let retries = 0;
            const maxRetries = 20; // 2 seconds max wait
            while (typeof TRANSLATIONS === 'undefined' && retries < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 100));
                retries++;
            }
            
            // Load translations
            if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS) {
                this.translations = TRANSLATIONS;
                this.initializeLanguage();
            } else {
                // Fallback: continue without translations
                console.warn('Translations not loaded. Using default language.');
                this.currentLanguage = 'en';
                if (document.documentElement) {
                    document.documentElement.setAttribute('lang', 'en');
                }
                this.setupLanguageSelector();
            }
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Language initialization error:', error);
            // Fallback to default
            this.currentLanguage = 'en';
            if (document.documentElement) {
                document.documentElement.setAttribute('lang', 'en');
            }
            this.isInitialized = true;
        }
    }
    
    /**
     * Initialize language after translations are loaded
     */
    initializeLanguage() {
        try {
            // Load saved language from localStorage
            const savedLanguage = localStorage.getItem('neuroquizLanguage') || 'en';
            if (this.translations && this.translations[savedLanguage]) {
                this.setLanguage(savedLanguage, false);
            } else {
                // Detect browser language
                try {
                    const browserLang = navigator.language || navigator.userLanguage;
                    const langCode = browserLang ? browserLang.split('-')[0] : 'en';
                    if (this.translations && this.translations[langCode]) {
                        this.setLanguage(langCode, false);
                    } else {
                        this.setLanguage('en', false);
                    }
                } catch (e) {
                    this.setLanguage('en', false);
                }
            }
            
            // Setup language selector
            this.setupLanguageSelector();
        } catch (error) {
            console.error('Language initialization error:', error);
            this.setLanguage('en', false);
        }
    }
    
    /**
     * Set language
     * @param {string} lang - Language code (en, ms)
     * @param {boolean} save - Whether to save to localStorage (default: true)
     */
    setLanguage(lang, save = true) {
        if (!this.translations || !this.translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }
        
        this.currentLanguage = lang;
        document.documentElement.setAttribute('lang', lang);
        if (save) {
            localStorage.setItem('neuroquizLanguage', lang);
        }
        
        // Update all translatable content (use requestAnimationFrame for performance)
        requestAnimationFrame(() => {
            this.translatePage();
            this.updateLanguageSelector();
        });
    }
    
    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., 'nav.home')
     * @param {object} params - Parameters to replace in translation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        if (!this.translations || !this.translations[this.currentLanguage]) {
            return key;
        }
        
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return key;
            }
        }
        
        // Replace parameters
        if (typeof translation === 'string' && params) {
            Object.keys(params).forEach(param => {
                translation = translation.replace(`{${param}}`, params[param]);
            });
        }
        
        return translation;
    }
    
    /**
     * Translate all elements with data-i18n attribute
     */
    translatePage() {
        if (!this.translations) {
            return; // Don't translate if translations aren't loaded
        }
        
        try {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                try {
                    const key = element.getAttribute('data-i18n');
                    if (!key) return;
                    
                    const translation = this.t(key);
                    
                    if (translation && translation !== key) {
                        // Handle different element types
                        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
                            // Only update placeholder if it's a placeholder attribute
                            if (element.hasAttribute('data-i18n-attr')) {
                                // Will be handled by data-i18n-attr
                            } else {
                                element.placeholder = translation;
                            }
                        } else if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                            element.value = translation;
                        } else if (element.tagName === 'OPTION') {
                            element.textContent = translation;
                        } else {
                            // Handle special case for result page with user name
                            if (key === 'result.quizComplete') {
                                const nameDisplay = element.querySelector('#user-name-display');
                                if (nameDisplay) {
                                    const name = nameDisplay.textContent || 'User';
                                    const translated = translation.replace('{name}', name);
                                    // Replace the entire content but preserve the name span
                                    element.innerHTML = translated.replace(name, `<span id="user-name-display">${name}</span>`);
                                } else {
                                    element.textContent = translation.replace('{name}', 'User');
                                }
                            } else {
                                element.textContent = translation;
                            }
                        }
                    }
                } catch (err) {
                    console.warn('Translation error for element:', element, err);
                }
            });
        } catch (err) {
            console.error('Translation page error:', err);
        }
        
        
        // Handle elements with data-i18n-html (for HTML content)
        try {
            const htmlElements = document.querySelectorAll('[data-i18n-html]');
            htmlElements.forEach(element => {
                try {
                    const key = element.getAttribute('data-i18n-html');
                    if (!key) return;
                    const translation = this.t(key);
                    
                    if (translation && translation !== key) {
                        element.innerHTML = translation;
                    }
                } catch (err) {
                    console.warn('HTML translation error:', element, err);
                }
            });
        } catch (err) {
            console.error('HTML translation error:', err);
        }
        
        // Handle elements with data-i18n-attr (for attributes)
        try {
            const attrElements = document.querySelectorAll('[data-i18n-attr]');
            attrElements.forEach(element => {
                try {
                    const attrData = element.getAttribute('data-i18n-attr');
                    if (!attrData) return;
                    const attrs = JSON.parse(attrData);
                    Object.keys(attrs).forEach(attr => {
                        const key = attrs[attr];
                        const translation = this.t(key);
                        if (translation && translation !== key) {
                            element.setAttribute(attr, translation);
                        }
                    });
                } catch (e) {
                    console.warn('Invalid data-i18n-attr:', element, e);
                }
            });
        } catch (err) {
            console.error('Attribute translation error:', err);
        }
    }
    
    /**
     * Setup language selector UI
     */
    setupLanguageSelector() {
        // Setup desktop selector
        const desktopSelectors = document.querySelectorAll('.language-selector');
        desktopSelectors.forEach(selector => {
            const buttons = selector.querySelectorAll('.language-btn[data-lang]');
            buttons.forEach(button => {
                // Remove existing listeners to prevent duplicates
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = newButton.getAttribute('data-lang');
                    if (lang) {
                        this.setLanguage(lang);
                    }
                });
            });
        });
        
        // Setup mobile selector
        const mobileSelectors = document.querySelectorAll('.language-segmented-control-mobile');
        mobileSelectors.forEach(selector => {
            const buttons = selector.querySelectorAll('.language-btn-mobile[data-lang]');
            buttons.forEach(button => {
                // Remove existing listeners to prevent duplicates
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                newButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const lang = newButton.getAttribute('data-lang');
                    if (lang) {
                        this.setLanguage(lang);
                    }
                });
            });
        });
    }
    
    /**
     * Update language selector UI to show current language
     */
    updateLanguageSelector() {
        // Update desktop selectors
        const desktopSelectors = document.querySelectorAll('.language-selector');
        desktopSelectors.forEach(selector => {
            const buttons = selector.querySelectorAll('.language-btn[data-lang]');
            buttons.forEach(button => {
                const lang = button.getAttribute('data-lang');
                if (lang === this.currentLanguage) {
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
                } else {
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                }
            });
        });
        
        // Update mobile selectors
        const mobileSelectors = document.querySelectorAll('.language-segmented-control-mobile');
        mobileSelectors.forEach(selector => {
            const buttons = selector.querySelectorAll('.language-btn-mobile[data-lang]');
            buttons.forEach(button => {
                const lang = button.getAttribute('data-lang');
                if (lang === this.currentLanguage) {
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
                } else {
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                }
            });
        });
    }
    
    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize language controller (non-blocking)
let languageController;

// Use DOMContentLoaded or immediate execution if DOM is ready
const initLanguage = () => {
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                try {
                    languageController = new LanguageController();
                    // Use setTimeout to ensure translations.js is loaded
                    setTimeout(() => {
                        languageController.init().catch(err => {
                            console.error('Language initialization error:', err);
                        });
                    }, 50);
                } catch (err) {
                    console.error('Language controller creation error:', err);
                }
            });
        } else {
            // DOM already loaded
            try {
                languageController = new LanguageController();
                // Use setTimeout to ensure translations.js is loaded
                setTimeout(() => {
                    languageController.init().catch(err => {
                        console.error('Language initialization error:', err);
                    });
                }, 50);
            } catch (err) {
                console.error('Language controller creation error:', err);
            }
        }
    } catch (err) {
        console.error('Language initialization setup error:', err);
    }
};

// Optimized MutationObserver - only observe specific containers
const setupTranslationObserver = () => {
    if (!languageController || !languageController.translations) return;
    
    // Only observe specific containers that might have dynamic content
    const observeTargets = [
        document.getElementById('results-container'),
        document.getElementById('question-section'),
        document.getElementById('setup-form-section')
    ].filter(Boolean);
    
    if (observeTargets.length === 0) return;
    
    let translateTimeout = null;
    const observer = new MutationObserver((mutations) => {
        // Debounce translations to avoid excessive calls
        let shouldTranslate = false;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldTranslate = true;
            }
        });
        
        if (shouldTranslate) {
            // Clear existing timeout
            if (translateTimeout) {
                clearTimeout(translateTimeout);
            }
            
            // Debounce translation updates
            translateTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    if (languageController && languageController.translations) {
                        languageController.translatePage();
                    }
                });
            }, 100); // 100ms debounce
        }
    });
    
    observeTargets.forEach(target => {
        observer.observe(target, {
            childList: true,
            subtree: true
        });
    });
};

// Initialize
initLanguage();

// Setup observer after a delay to avoid blocking initial load
setTimeout(() => {
    try {
        if (languageController && languageController.isInitialized) {
            setupTranslationObserver();
        }
    } catch (err) {
        console.error('Translation observer setup error:', err);
    }
}, 1000);

// Export for global access
window.LanguageController = LanguageController;
window.languageController = languageController;
