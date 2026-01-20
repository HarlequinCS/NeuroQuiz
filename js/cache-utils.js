/**
 * NeuroQuiz™ - Cache Utilities
 * 
 * Helper functions to clear browser cache and service worker cache
 * Useful for development and debugging
 */

class CacheUtils {
    /**
     * Clear all service worker caches
     */
    static async clearServiceWorkerCache() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                if (registration.active) {
                    registration.active.postMessage({ type: 'CLEAR_CACHE' });
                    console.log('✅ Service Worker cache clear requested');
                }
            } catch (error) {
                console.error('Error clearing service worker cache:', error);
            }
        }
        
        // Also clear browser caches directly
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
                console.log('✅ Browser caches cleared:', cacheNames);
            } catch (error) {
                console.error('Error clearing browser caches:', error);
            }
        }
    }
    
    /**
     * Unregister service worker
     */
    static async unregisterServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.unregister();
                    console.log('✅ Service Worker unregistered');
                } else {
                    console.log('ℹ️ No service worker registered');
                }
            } catch (error) {
                console.error('Error unregistering service worker:', error);
            }
        }
    }
    
    /**
     * Clear all caches and reload page
     */
    static async clearAndReload() {
        await this.clearServiceWorkerCache();
        await this.unregisterServiceWorker();
        
        // Clear localStorage if needed (optional)
        // localStorage.clear();
        
        // Reload page
        setTimeout(() => {
            window.location.reload(true);
        }, 500);
    }
    
    /**
     * Hard reload (bypass cache)
     */
    static hardReload() {
        window.location.reload(true);
    }
}

// Make available globally
window.CacheUtils = CacheUtils;

// Listen for service worker messages
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'CACHE_CLEARED') {
            console.log('✅ Cache cleared by service worker');
        }
        if (event.data && event.data.type === 'FORCE_RELOAD') {
            window.location.reload(true);
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CacheUtils;
}
