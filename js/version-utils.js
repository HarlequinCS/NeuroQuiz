/**
 * NeuroQuiz™ - Version Utilities
 * 
 * Provides version management for cache busting and asset loading
 * Ensures all CSS/JS files are loaded with the latest version
 */

class VersionUtils {
    constructor() {
        this.version = null;
        this.init();
    }
    
    init() {
        // Try to get version from meta tag first
        const versionMeta = document.querySelector('meta[name="app-version"]');
        if (versionMeta) {
            this.version = versionMeta.getAttribute('content');
        }
        
        // If no meta tag, try to extract from existing script tags
        if (!this.version) {
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                const src = script.src || script.getAttribute('src');
                if (src) {
                    const match = src.match(/[?&]v=([a-z0-9]+)/i);
                    if (match) {
                        this.version = match[1];
                        break;
                    }
                }
            }
        }
        
        // Fallback to timestamp if no version found
        if (!this.version) {
            this.version = Date.now().toString(36);
        }
    }
    
    /**
     * Get current version
     */
    getVersion() {
        return this.version;
    }
    
    /**
     * Get URL with version query parameter
     * @param {string} url - Original URL
     * @returns {string} URL with version parameter
     */
    getVersionedUrl(url) {
        if (!url) return url;
        
        // Remove existing version parameter
        url = url.replace(/[?&]v=[^&]*/g, '');
        
        // Add version parameter
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${this.version}`;
    }
    
    /**
     * Load script with version
     * @param {string} src - Script source
     * @returns {Promise} Promise that resolves when script is loaded
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = this.getVersionedUrl(src);
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Load stylesheet with version
     * @param {string} href - Stylesheet href
     * @returns {Promise} Promise that resolves when stylesheet is loaded
     */
    loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = this.getVersionedUrl(href);
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
}

// Create global instance
window.VersionUtils = new VersionUtils();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VersionUtils;
}
