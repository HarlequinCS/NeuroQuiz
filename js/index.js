document.addEventListener('DOMContentLoaded', () => {
    const leftLine = document.querySelector('.left-line');
    const rightLine = document.querySelector('.right-line');

    // Safety Check: Only run this code if these elements actually exist on the page
    if (leftLine && rightLine) {
        
        // Run the function once on load to set initial positions
        updateTextPosition();
        window.addEventListener('scroll', updateTextPosition);
        window.addEventListener('resize', updateTextPosition);
    }

    function updateTextPosition() {
        // On phone/tablet: no animation — keep title static for readability
        if (window.innerWidth < 768) {
            leftLine.style.transform = '';
            rightLine.style.transform = '';
            return;
        }
        const scrollPosition = window.scrollY;
        const offset = Math.max(0, 150 - scrollPosition * 0.5);
        leftLine.style.transform = `translateX(-${offset}px)`;
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