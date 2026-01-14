document.addEventListener('DOMContentLoaded', () => {
    const leftLine = document.querySelector('.left-line');
    const rightLine = document.querySelector('.right-line');

    // Safety Check: Only run this code if these elements actually exist on the page
    if (leftLine && rightLine) {
        
        // Run the function once on load to set initial positions
        updateTextPosition();

        // Listen for scroll events
        window.addEventListener('scroll', () => {
            updateTextPosition();
        });
    }

    function updateTextPosition() {
        const scrollPosition = window.scrollY;

        // ANIMATION LOGIC:
        // 1. We start with an offset of 150px (Text is separated).
        // 2. As you scroll down (* 0.5 speed), the number gets smaller.
        // 3. Math.max(0, ...) ensures it stops at 0 (Center) and doesn't cross over.
        let offset = Math.max(0, 150 - scrollPosition * 0.5);

        // Move "WELCOME TO" to the Left (-)
        leftLine.style.transform = `translateX(-${offset}px)`;

        // Move "NEUROQUIZ" to the Right (+)
        rightLine.style.transform = `translateX(${offset}px)`;
    }

    /* 3D TILT EFFECT LOGIC */
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X inside card
            const y = e.clientY - rect.top;  // Mouse Y inside card
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle (divide by 10 to soften the effect)
            const rotateX = ((y - centerY) / 10) * -1; // Negative to tilt correctly
            const rotateY = (x - centerX) / 10;

            // Apply style
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        // Reset when mouse leaves
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease'; // Smooth exit
        });

        // Remove transition on enter to make movement snappy
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
});