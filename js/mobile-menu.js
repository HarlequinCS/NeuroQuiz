/**
 * NeuroQuiz™ - Mobile Menu Controller
 * Handles hamburger menu toggle for mobile navigation
 */

class MobileMenuController {
    constructor() {
        this.hamburger = document.getElementById('hamburger-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.isOpen = false;
        
        if (this.hamburger && this.navMenu) {
            this.init();
        }
    }
    
    init() {
        // Toggle menu on hamburger click
        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking on a link
        const navLinks = this.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.navMenu.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.hamburger.setAttribute('aria-expanded', this.isOpen);
        this.navMenu.classList.toggle('menu-open', this.isOpen);
        
        // Prevent body scroll when menu is open
        if (this.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMenu() {
        this.isOpen = false;
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.navMenu.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenuController();
});

// Export for global access
window.MobileMenuController = MobileMenuController;
