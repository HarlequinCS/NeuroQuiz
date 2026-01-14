const teamGrid = document.querySelector('.team-grid');
const nextBtn = document.getElementById('nextTeam');
const prevBtn = document.getElementById('prevTeam');

nextBtn.addEventListener('click', () => {
    // Scrolls right by the width of one card + gap
    const cardWidth = document.querySelector('.team-member').offsetWidth + 24; 
    teamGrid.scrollBy({ left: cardWidth, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    // Scrolls left
    const cardWidth = document.querySelector('.team-member').offsetWidth + 24;
    teamGrid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
});

// about.js - Tech Stack Animation
const observerOptions = {
    threshold: 0.2
};

const techObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.tech-card');
            cards.forEach((card, index) => {
                // Add a staggered delay for each card
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) rotateX(0)';
                }, index * 150); 
            });
        }
    });
}, observerOptions);

const techGrid = document.querySelector('.tech-grid');
if (techGrid) {
    // Set initial "hidden" state
    const allCards = techGrid.querySelectorAll('.tech-card');
    allCards.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(40px) rotateX(-20deg)';
        c.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    
    techObserver.observe(techGrid);
}