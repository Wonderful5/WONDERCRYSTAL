/**
 * WONDER GRAND — CINEMATIC HERO SLIDER ENGINE (SLIDER REVOLUTION INSPIRED)
 * Manages auto-progression, Ken Burns animation sync, progress timer, and interactive controls
 */

class WonderGrandSlider {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '#heroSlider');
    if (!this.container) return;

    this.slides = this.container.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    if (this.totalSlides === 0) return;

    this.currentIndex = 0;
    this.duration = options.duration || 8000; // 8 seconds per slide for majestic cinematic pacing
    this.progressBar = document.querySelector(options.progressBar || '#sliderProgressBar');
    this.prevBtn = document.querySelector(options.prevBtn || '#sliderPrevBtn');
    this.nextBtn = document.querySelector(options.nextBtn || '#sliderNextBtn');
    this.indicators = document.querySelectorAll(options.indicators || '.slider-indicator-item');
    this.counterCurrent = document.querySelector(options.counterCurrent || '#sliderCounterCurrent');
    this.playToggle = document.querySelector(options.playToggle || '#sliderPlayToggle');

    this.timer = null;
    this.startTime = null;
    this.progressFrame = null;
    this.isPaused = false;
    this.isTransitioning = false;

    // Touch & Swipe gestures
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.goToSlide(0, false);
    this.bindEvents();
    this.startAutoPlay();
  }

  bindEvents() {
    // Arrow buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
      });
    }

    // Number Indicators / Pagination
    if (this.indicators && this.indicators.length > 0) {
      this.indicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', (e) => {
          e.preventDefault();
          if (idx !== this.currentIndex && !this.isTransitioning) {
            this.goToSlide(idx);
          }
        });
      });
    }

    // Play / Pause Toggle
    if (this.playToggle) {
      this.playToggle.addEventListener('click', () => {
        if (this.isPaused) {
          this.resume();
          this.playToggle.setAttribute('aria-label', 'Pause Autoplay');
          this.playToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          `;
        } else {
          this.pause();
          this.playToggle.setAttribute('aria-label', 'Resume Autoplay');
          this.playToggle.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          `;
        }
      });
    }

    // Pause on Hover
    this.container.addEventListener('mouseenter', () => {
      this.pauseProgress();
    });

    this.container.addEventListener('mouseleave', () => {
      if (!this.isPaused) {
        this.resumeProgress();
      }
    });

    // Touch Gestures
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.pauseProgress();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      if (!this.isPaused) {
        this.resumeProgress();
      }
    }, { passive: true });

    // Keyboard Arrow Keys
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const rect = this.container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.prev();
        }
      } else if (e.key === 'ArrowRight') {
        const rect = this.container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          this.next();
        }
      }
    });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left -> next slide
        this.next();
      } else {
        // Swiped right -> prev slide
        this.prev();
      }
    }
  }

  goToSlide(index, animate = true) {
    if (this.isTransitioning && animate) return;
    this.isTransitioning = true;

    // Normalize index
    if (index >= this.totalSlides) index = 0;
    if (index < 0) index = this.totalSlides - 1;

    // Update active slide class
    this.slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        // Restart CSS Ken Burns animation by triggering reflow
        const img = slide.querySelector('.slide-bg-img');
        if (img) {
          img.style.animation = 'none';
          void img.offsetWidth; // Reflow
          img.style.animation = '';
        }
      } else {
        slide.classList.remove('active');
      }
    });

    // Update indicators
    if (this.indicators && this.indicators.length > 0) {
      this.indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    }

    // Update Counter (Formatted as 01, 02, etc.)
    if (this.counterCurrent) {
      this.counterCurrent.textContent = String(index + 1).padStart(2, '0');
    }

    this.currentIndex = index;

    // Reset and start progress bar
    this.resetProgressBar();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 900);
  }

  next() {
    this.goToSlide(this.currentIndex + 1);
  }

  prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.startTime = performance.now();
    this.animateProgress();
  }

  animateProgress() {
    if (this.isPaused) return;

    const tick = (now) => {
      if (this.isPaused) return;

      const elapsed = now - this.startTime;
      const progress = Math.min((elapsed / this.duration) * 100, 100);

      if (this.progressBar) {
        this.progressBar.style.width = `${progress}%`;
      }

      if (elapsed >= this.duration) {
        this.next();
      } else {
        this.progressFrame = requestAnimationFrame(tick);
      }
    };

    this.progressFrame = requestAnimationFrame(tick);
  }

  resetProgressBar() {
    if (this.progressFrame) {
      cancelAnimationFrame(this.progressFrame);
    }
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
    this.startTime = performance.now();
    if (!this.isPaused) {
      this.animateProgress();
    }
  }

  pauseProgress() {
    if (this.progressFrame) {
      cancelAnimationFrame(this.progressFrame);
    }
  }

  resumeProgress() {
    if (this.isPaused) return;
    this.startTime = performance.now();
    this.animateProgress();
  }

  pause() {
    this.isPaused = true;
    this.pauseProgress();
  }

  resume() {
    this.isPaused = false;
    this.startTime = performance.now();
    this.animateProgress();
  }
}

// Global initialization helper
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#heroSlider')) {
    window.wonderGrandSlider = new WonderGrandSlider({
      container: '#heroSlider',
      duration: 8000,
      progressBar: '#sliderProgressBar',
      prevBtn: '#sliderPrevBtn',
      nextBtn: '#sliderNextBtn',
      indicators: '.slider-indicator-item',
      counterCurrent: '#sliderCounterCurrent',
      playToggle: '#sliderPlayToggle'
    });
  }
});
