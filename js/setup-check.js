/**
 * NeuroQuiz™ - Setup Check Utility
 * 
 * Ensures users complete setup before accessing the quiz.
 * This utility can be used across all pages to validate setup completion.
 */

(function() {
    'use strict';

    /**
     * Checks if user setup is complete and valid
     * @returns {Object|null} Setup object if valid, null otherwise
     */
    function checkUserSetup() {
        const stored = localStorage.getItem('neuroquizUserSetup');
        if (!stored) {
            return null;
        }

        try {
            const setup = JSON.parse(stored);
            
            // Validate required fields
            if (!setup.name || !setup.level || !setup.category || !setup.literacyLevel) {
                return null;
            }

            // Validate level is between 1-3
            const level = parseInt(setup.level);
            if (isNaN(level) || level < 1 || level > 3) {
                return null;
            }

            // Validate literacy level
            const validLiteracyLevels = ['Beginner', 'Intermediate', 'Expert'];
            if (!validLiteracyLevels.includes(setup.literacyLevel)) {
                return null;
            }

            // Validate category is not empty
            if (!setup.category || setup.category.trim() === '') {
                return null;
            }

            return setup;
        } catch (e) {
            console.warn('Failed to parse user setup:', e);
            return null;
        }
    }

    /**
     * Redirects to setup page if setup is not complete
     * @returns {boolean} True if setup is complete, false if redirected
     */
    function requireSetup() {
        const setup = checkUserSetup();
        if (!setup) {
            console.log('[RB-ADA] setup_required, redirecting to setup');
            window.location.href = 'setup.html';
            return false;
        }
        return true;
    }

    /**
     * Intercepts navigation to quiz.html and checks setup first
     */
    function interceptQuizNavigation() {
        // Intercept all links to quiz.html
        document.addEventListener('click', function(e) {
            let link = e.target.closest('a[href="quiz.html"]');
            if (!link) {
                // Also check for links with quiz.html in the href
                link = e.target.closest('a[href*="quiz.html"]');
            }
            if (link) {
                const setup = checkUserSetup();
                if (!setup) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('[RB-ADA] setup_required_for_quiz, redirecting to setup');
                    // Show a message to the user
                    alert('Please complete the setup form before starting the quiz.');
                    return false;
                }
            }
        }, true); // Use capture phase to intercept before navigation

        // Also intercept any direct href changes on links
        const links = document.querySelectorAll('a[href="quiz.html"], a[href*="quiz.html"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const setup = checkUserSetup();
                if (!setup) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('[RB-ADA] setup_required_for_quiz, redirecting to setup');
                    alert('Please complete the setup form before starting the quiz.');
                    return false;
                }
            }, true);
        });
    }

    // Expose utility functions globally
    window.NeuroQuizSetupCheck = {
        checkUserSetup: checkUserSetup,
        requireSetup: requireSetup,
        interceptQuizNavigation: interceptQuizNavigation
    };

    // Auto-intercept navigation on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', interceptQuizNavigation);
    } else {
        interceptQuizNavigation();
    }
})();
