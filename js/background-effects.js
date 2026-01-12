/**
 * NeuroQuiz™ - Hybrid Background Effects (Final V3)
 * Layer 1: Realistic 3D Fluttering Confetti
 * Layer 2: Interactive Neural Network
 */

const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');

let neuralParticles = [];
let confettiParticles = [];

let mouse = {
    x: null,
    y: null,
    radius: 150
};

// Game Colors (Red, Blue, Yellow, Green)
const gameColors = ['#ff4b4b', '#1cb0f6', '#ffc800', '#2bde73'];

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// --- CLASS 1: THE NEURAL DOT (Tech Layer) ---
class NeuralDot {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// --- CLASS 2: REALISTIC CONFETTI (Flutter Layer) ---
class ConfettiPiece {
    constructor() {
        // Start randomly above the screen
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        
        // Physics properties for realism
        this.size = (Math.random() * 10) + 5;
        this.color = gameColors[Math.floor(Math.random() * gameColors.length)];
        this.speed = (Math.random() * 2) + 1;     // Fall speed
        this.swaySpeed = (Math.random() * 0.05) + 0.01; // How fast it sways side-to-side
        this.swayAmplitude = (Math.random() * 20) + 10; // How wide it sways
        this.swayOffset = Math.random() * Math.PI * 2; // Random starting point in sway cycle
        
        // 3D Flutter Simulation
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() * 2) - 1;
        this.tilt = 0; // Simulate 3D flipping
        this.tiltAngle = Math.random() * Math.PI;
        this.tiltSpeed = 0.05 + Math.random() * 0.05;
        
        // Shape type
        this.shape = Math.random(); // 0-0.33 Square, 0.33-0.66 Circle, >0.66 Triangle
    }

    draw() {
        ctx.save();
        
        // 1. Move to position
        // Calculate swaying X position (Sine wave)
        const currentSway = Math.sin(this.swayOffset) * 1; 
        ctx.translate(this.x + currentSway, this.y);
        
        // 2. Rotate (2D Spin)
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // 3. Tilt (3D Flip Simulation)
        // We scale the Y-axis to make it look like it's flipping towards/away from user
        const tiltScale = Math.cos(this.tiltAngle);
        ctx.scale(1, tiltScale); 

        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.85; // Vibrant!

        ctx.beginPath();
        if (this.shape < 0.33) {
            // Square
            ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
        } else if (this.shape < 0.66) {
            // Circle
            ctx.arc(0, 0, this.size/2, 0, Math.PI*2);
        } else {
            // Triangle
            ctx.moveTo(0, -this.size/2);
            ctx.lineTo(this.size/2, this.size/2);
            ctx.lineTo(-this.size/2, this.size/2);
        }
        ctx.fill();
        ctx.restore();
    }

    update() {
        // Fall down
        this.y += this.speed;
        
        // Update physics
        this.rotation += this.rotationSpeed; // Spin
        this.tiltAngle += this.tiltSpeed;    // 3D Flip cycle
        this.swayOffset += this.swaySpeed;   // Sway cycle

        // Reset to top when it falls off screen
        if (this.y > canvas.height + 20) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
            this.swayOffset = Math.random() * Math.PI * 2;
        }
        
        this.draw();
    }
}

// --- INITIALIZATION ---
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    neuralParticles = [];
    confettiParticles = [];

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // 1. Neural Particles
    const neuralColor = isDark ? '#a78bfa' : '#ffffff';
    const neuralCount = window.innerWidth < 600 ? 50 : 80;

    for (let i = 0; i < neuralCount; i++) {
        let size = (Math.random() * 3) + 1;
        let x = Math.random() * (innerWidth - size * 2) + size * 2;
        let y = Math.random() * (innerHeight - size * 2) + size * 2;
        let dx = (Math.random() * 0.4) - 0.2;
        let dy = (Math.random() * 0.4) - 0.2;
        neuralParticles.push(new NeuralDot(x, y, dx, dy, size, neuralColor));
    }

    // 2. Confetti Particles (More density for "Real" look)
    const confettiCount = 50; 
    for (let i = 0; i < confettiCount; i++) {
        confettiParticles.push(new ConfettiPiece());
    }
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // Draw Confetti
    confettiParticles.forEach(p => p.update());

    // Draw Neural Network
    neuralParticles.forEach(p => p.update());
    connectNeuralPoints();
}

// Connect Lines (Neural Network)
function connectNeuralPoints() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255, 255, 255, 0.4)';
    
    for (let a = 0; a < neuralParticles.length; a++) {
        for (let b = a; b < neuralParticles.length; b++) {
            let distance = ((neuralParticles[a].x - neuralParticles[b].x) * (neuralParticles[a].x - neuralParticles[b].x))
                + ((neuralParticles[a].y - neuralParticles[b].y) * (neuralParticles[a].y - neuralParticles[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(neuralParticles[a].x, neuralParticles[a].y);
                ctx.lineTo(neuralParticles[b].x, neuralParticles[b].y);
                ctx.stroke();
            }
        }
    }
}

// --- START ---
init();
animate();

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "data-theme") {
            init();
        }
    });
});
observer.observe(document.documentElement, { attributes: true });

/* =========================================
   VARIED SHAPES GENERATOR (5 Types)
   ========================================= */

(function() {
    const shapesContainer = document.getElementById('background-shapes');

    if (!shapesContainer) return;

    // The 4 Game Colors
    const gameColors = [
        '#ff4b4b', // Red
        '#1cb0f6', // Blue
        '#ffc800', // Yellow
        '#2bde73'  // Green
    ];

    function createFloatingShape() {
        const shape = document.createElement('div');
        shape.classList.add('bg-shape');

        // 1. Pick a Random Game Color
        const randomColor = gameColors[Math.floor(Math.random() * gameColors.length)];
        shape.style.backgroundColor = randomColor;

        // 2. Random Size
        const size = Math.random() * 80 + 40; 
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;

        // 3. SHAPE VARIETY LOGIC
        const shapeType = Math.random();

        if (shapeType < 0.2) {
            // Circle (Default)
            shape.style.borderRadius = '50%';
        } else if (shapeType < 0.4) {
            // Rounded Square
            shape.style.borderRadius = '15px';
        } else if (shapeType < 0.6) {
            // Triangle
            shape.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            shape.style.borderRadius = '0'; // Reset radius
        } else if (shapeType < 0.8) {
            // Diamond
            shape.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
            shape.style.borderRadius = '0';
        } else {
            // Hexagon
            shape.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
            shape.style.borderRadius = '0';
        }

        // 4. Random Position
        shape.style.left = `${Math.random() * 90}%`;
        shape.style.top = `${Math.random() * 90}%`;

        // 5. Random Speed
        const duration = Math.random() * 6 + 6; 
        shape.style.animationDuration = `${duration}s`;

        shapesContainer.appendChild(shape);

        // Cleanup
        setTimeout(() => {
            if (shapesContainer.contains(shape)) {
                shapesContainer.removeChild(shape);
            }
        }, duration * 1000);
    }

    // Generate a new shape every 800ms
    setInterval(createFloatingShape, 800);
})();