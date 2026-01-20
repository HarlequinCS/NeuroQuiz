/**
 * NeuroQuiz™ - Language Controller
 * 
 * Handles language switching and translation
 */

class LanguageController {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = null;
        this.init();
    }
    
    /**
     * Initialize language controller
     */
    async init() {
        // Wait for translations to be available
        let retries = 0;
        while (typeof TRANSLATIONS === 'undefined' && retries < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            retries++;
        }
        
        // Load translations
        if (typeof TRANSLATIONS !== 'undefined') {
            this.translations = TRANSLATIONS;
        } else {
            // If translations.js is not loaded, try to load it
            console.warn('Translations not found. Make sure translations.js is loaded.');
            return;
        }
        
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('neuroquizLanguage') || 'en';
        if (this.translations[savedLanguage]) {
            this.setLanguage(savedLanguage);
        } else {
            // Detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            const langCode = browserLang.split('-')[0];
            if (this.translations[langCode]) {
                this.setLanguage(langCode);
            } else {
                this.setLanguage('en');
            }
        }
        
        // Setup language selector
        this.setupLanguageSelector();
    }
    
    /**
     * Set language
     * @param {string} lang - Language code (en, ms)
     */
    setLanguage(lang) {
        if (!this.translations || !this.translations[lang]) {
            console.warn(`Language ${lang} not found`);
            return;
        }
        
        this.currentLanguage = lang;
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('neuroquizLanguage', lang);
        
        // Update all translatable content
        this.translatePage();
        
        // Update language selector UI
        this.updateLanguageSelector();
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
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
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
        });
        
        // Handle elements with data-i18n-html (for HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            
            if (translation && translation !== key) {
                element.innerHTML = translation;
            }
        });
        
        // Handle elements with data-i18n-attr (for attributes)
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        attrElements.forEach(element => {
            const attrData = element.getAttribute('data-i18n-attr');
            try {
                const attrs = JSON.parse(attrData);
                Object.keys(attrs).forEach(attr => {
                    const key = attrs[attr];
                    const translation = this.t(key);
                    if (translation && translation !== key) {
                        element.setAttribute(attr, translation);
                    }
                });
            } catch (e) {
                console.warn('Invalid data-i18n-attr:', attrData);
            }
        });
    }
    
    /**
     * Setup language selector UI
     */
    setupLanguageSelector() {
        const languageSelectors = document.querySelectorAll('.language-selector, [data-language-selector]');
        languageSelectors.forEach(selector => {
            const buttons = selector.querySelectorAll('[data-lang]');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = button.getAttribute('data-lang');
                    this.setLanguage(lang);
                });
            });
        });
    }
    
    /**
     * Update language selector UI to show current language
     */
    updateLanguageSelector() {
        const languageSelectors = document.querySelectorAll('.language-selector, [data-language-selector]');
        languageSelectors.forEach(selector => {
            const buttons = selector.querySelectorAll('[data-lang]');
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

// Initialize language controller
let languageController;

document.addEventListener('DOMContentLoaded', () => {
    languageController = new LanguageController();
    
    // Re-translate when new content is added dynamically
    const observer = new MutationObserver(() => {
        if (languageController && languageController.translations) {
            languageController.translatePage();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Export for global access
window.LanguageController = LanguageController;
window.languageController = languageController;
