document.addEventListener('DOMContentLoaded', function() {
    const slidesContainer = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    // We have 2 extra slides for cloning (first and last)
    const realSlideCount = slides.length - 2;
    let currentIndex = 1; // Start at the first real slide
    let isTransitioning = false;
    
    // Initialize carousel position
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update indicators
    function updateIndicators() {
        let displayIndex = currentIndex - 1;
        if (displayIndex < 0) displayIndex = realSlideCount - 1;
        if (displayIndex >= realSlideCount) displayIndex = 0;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === displayIndex);
        });
    }
    
    // Handle slide transition
    function goToSlide(index, instant = false) {
        if (isTransitioning) return;
        isTransitioning = true;
        
        currentIndex = index;
        if (instant) {
            slidesContainer.style.transition = 'none';
        } else {
            slidesContainer.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
        }
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        if (!instant) {
            setTimeout(() => {
                isTransitioning = false;
            }, 700);
        } else {
            isTransitioning = false;
        }
        
        updateIndicators();
    }
    
    // Check if we need to jump to cloned slide
    function checkForLoop() {
        if (currentIndex === 0) {
            // Jump to last real slide (but visually same as first)
            setTimeout(() => goToSlide(realSlideCount, true), 10);
        } else if (currentIndex === slides.length - 1) {
            // Jump to first real slide (but visually same as last)
            setTimeout(() => goToSlide(1, true), 10);
        }
    }
    
    // Navigation functions
    function nextSlide() {
        goToSlide(currentIndex + 1);
        setTimeout(checkForLoop, 700);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
        setTimeout(checkForLoop, 700);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const targetIndex = parseInt(indicator.dataset.index) + 1;
            goToSlide(targetIndex);
        });
    });
    
    // Touch swipe support
    let touchStartX = 0;
    
    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    slidesContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const threshold = 50;
        
        if (touchEndX < touchStartX - threshold) nextSlide();
        if (touchEndX > touchStartX + threshold) prevSlide();
    }, { passive: true });
    
    // Initialize indicators
    updateIndicators();
});