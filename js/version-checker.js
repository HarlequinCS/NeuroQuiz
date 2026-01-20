/**
 * NeuroQuiz™ - Version Checker
 * 
 * Automatically checks for version updates and forces cache refresh
 * Ensures users always see the latest version
 */

class VersionChecker {
    constructor() {
        this.currentVersion = null;
        this.storageKey = 'neuroquiz_version';
        this.checkInterval = null;
        this.init();
    }
    
    init() {
        // Get current version from meta tag
        const versionMeta = document.querySelector('meta[name="app-version"]');
        if (versionMeta) {
            this.currentVersion = versionMeta.getAttribute('content');
        }
        
        // Check version on load
        this.checkVersion();
        
        // Check version periodically (every 5 minutes)
        this.checkInterval = setInterval(() => {
            this.checkVersion();
        }, 5 * 60 * 1000);
        
        // Listen for visibility change (user returns to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkVersion();
            }
        });
    }
    
    /**
     * Check if version has changed
     */
    async checkVersion() {
        if (!this.currentVersion) {
            return;
        }
        
        const storedVersion = localStorage.getItem(this.storageKey);
        
        // If version changed, clear cache and reload
        if (storedVersion && storedVersion !== this.currentVersion) {
            console.log(`🔄 Version changed: ${storedVersion} → ${this.currentVersion}`);
            await this.handleVersionChange();
            return;
        }
        
        // Store current version
        if (!storedVersion || storedVersion !== this.currentVersion) {
            localStorage.setItem(this.storageKey, this.currentVersion);
        }
        
        // Also check server for latest version (optional)
        this.checkServerVersion();
    }
    
    /**
     * Check server for latest version
     */
    async checkServerVersion() {
        try {
            // Fetch current page with cache-busting to check for updates
            const response = await fetch(window.location.href + `?v=${Date.now()}`, {
                method: 'HEAD',
                cache: 'no-store'
            });
            
            if (response.ok) {
                // Could parse response headers or fetch version endpoint
                // For now, we rely on meta tag version
            }
        } catch (error) {
            // Silently fail - network issues shouldn't break the app
            console.debug('Version check failed:', error);
        }
    }
    
    /**
     * Handle version change - clear cache and reload
     */
    async handleVersionChange() {
        // Clear all caches
        if (window.CacheUtils) {
            await window.CacheUtils.clearServiceWorkerCache();
        }
        
        // Clear localStorage version
        localStorage.removeItem(this.storageKey);
        
        // Clear session storage
        sessionStorage.clear();
        
        // Force reload with cache bypass
        setTimeout(() => {
            window.location.reload(true);
        }, 500);
    }
    
    /**
     * Get current version
     */
    getVersion() {
        return this.currentVersion;
    }
    
    /**
     * Force version check
     */
    async forceCheck() {
        await this.checkVersion();
    }
    
    /**
     * Destroy checker
     */
    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

// Initialize version checker
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.versionChecker = new VersionChecker();
    });
} else {
    window.versionChecker = new VersionChecker();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VersionChecker;
}
