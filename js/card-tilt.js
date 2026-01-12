/**
 * NeuroQuiz™ - 3D Holographic Tilt (Optimized)
 * Target: #question-card
 * Trigger: Mouse movement
 */

const card = document.getElementById('question-card');

if (card) {
    // 1. Settings
    const sensitivity = 20; // Tilt intensity
    
    // 2. Create Glare Effect Layer
    const glare = document.createElement('div');
    glare.classList.add('card-glare');
    card.appendChild(glare);

    // 3. Mouse Move Event
    window.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate Mouse Position relative to Card Center
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;

        // Calculate Rotation
        const rotateX = ((mouseY / window.innerHeight) * sensitivity * -1).toFixed(2);
        const rotateY = ((mouseX / window.innerWidth) * sensitivity).toFixed(2);

        // Calculate Glare Position
        const glareX = e.clientX - rect.left;
        const glareY = e.clientY - rect.top;

        // Apply Styles
        requestAnimationFrame(() => {
            // Apply 3D Tilt
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Apply Glare (Adjusted for smaller size)
            glare.style.background = `radial-gradient(
                circle at ${glareX}px ${glareY}px, 
                rgba(255, 255, 255, 0.3) 0%,   /* Slightly reduced intensity */
                transparent 40%                /* Reduced spread (was 80%) */
            )`;
        });
    });

    // 4. Reset on Mouse Leave
    document.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            glare.style.background = 'transparent';
        });
    });
}