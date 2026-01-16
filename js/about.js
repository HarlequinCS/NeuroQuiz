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

/**
 * NeuroQuiz™ - Liquid Synapse Background (Creative V2)
 * High-end organic movement representing brain activity patterns.
 */

const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');

let energyNodes = [];
const nodeCount = 12; // Fewer, larger nodes for a "cleaner" look

const themeColors = {
    dark: {
        glow: 'rgba(37, 99, 235, 0.4)',  // Primary Blue
        accent: 'rgba(124, 58, 237, 0.3)' // Secondary Purple
    },
    light: {
        glow: 'rgba(37, 99, 235, 0.1)',
        accent: 'rgba(124, 58, 237, 0.05)'
    }
};

class EnergyNode {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 200 + 150; // Large organic blobs
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
    }

    draw(isDark) {
        const colors = isDark ? themeColors.dark : themeColors.light;
        
        // Create a radial gradient for a "soft" liquid look
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, colors.glow);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update(mouse) {
        // Natural movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x < -this.size || this.x > canvas.width + this.size) this.speedX *= -1;
        if (this.y < -this.size || this.y > canvas.height + this.size) this.speedY *= -1;

        // Interactive Attraction: Blobs slowly drift toward mouse stimulus
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            this.x += dx * 0.005;
            this.y += dy * 0.005;
        }
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    energyNodes = Array.from({ length: nodeCount }, () => new EnergyNode());
}

let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });

function animate() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Slight clear for motion trails
    ctx.fillStyle = isDark ? 'rgba(17, 24, 39, 0.2)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply a blur filter for the "Liquid" effect
    ctx.filter = 'blur(40px) contrast(1.2)';
    
    energyNodes.forEach(node => {
        node.update(mouse);
        node.draw(isDark);
    });
    
    ctx.filter = 'none'; // Reset filter for rest of UI
    requestAnimationFrame(animate);
}

window.onload = () => { init(); animate(); };
window.onresize = init;


window.addEventListener('scroll', () => {
    const scrollValue = window.scrollY;
    const title = document.querySelector('.hero-title-giant');
    const desc = document.querySelector('.description-text');
    
    if (title && desc) {
        // As you scroll down, the title slides right and the description slides left
        title.style.transform = `translateX(${scrollValue * 0.2}px)`;
        desc.style.transform = `translateX(-${scrollValue * 0.15}px)`;
    }
});