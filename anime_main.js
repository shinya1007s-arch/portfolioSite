document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen Animation
    const splashScreen = document.getElementById('splash-screen');
    
    if (splashScreen) {
        const tl = anime.timeline({
            easing: 'easeOutExpo',
            duration: 800
        });

        tl.add({
            targets: '.splash-text',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
            delay: 200
        })
        .add({
            targets: '.splash-progress',
            width: ['0%', '100%'],
            duration: 1200,
            easing: 'easeInOutQuart'
        })
        .add({
            targets: splashScreen,
            opacity: 0,
            duration: 800,
            easing: 'linear',
            complete: function() {
                splashScreen.classList.add('hidden-splash');
                playHeroAnimation();
            }
        });
    } else {
        playHeroAnimation();
    }

    // 2. Hero Animation
    function playHeroAnimation() {
        anime({
            targets: ['.hero-title', '.hero-subtitle', '.hero-cta'],
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 1200,
            easing: 'easeOutCubic'
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine targets within the intersected section
                const targets = entry.target.querySelectorAll('.anime-fade-up');
                
                if (targets.length > 0) {
                    anime({
                        targets: targets,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(150),
                        duration: 1000,
                        easing: 'easeOutQuad'
                    });
                } else if (entry.target.classList.contains('anime-fade-up')) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 1000,
                        easing: 'easeOutQuad'
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section, .anime-fade-up').forEach(el => {
        if(el.tagName === 'SECTION') {
            scrollObserver.observe(el);
        } else if (!el.closest('section')) {
            scrollObserver.observe(el);
        }
    });

    // 4. Hover Effects (Spring Physics)
    document.querySelectorAll('.anime-hover-lift').forEach(el => {
        el.addEventListener('mouseenter', () => {
            anime({
                targets: el,
                translateY: -10,
                scale: 1.02,
                boxShadow: '0 20px 30px rgba(34, 211, 238, 0.15)',
                duration: 800,
                easing: 'spring(1, 80, 10, 0)'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            anime({
                targets: el,
                translateY: 0,
                scale: 1,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                duration: 800,
                easing: 'spring(1, 80, 10, 0)'
            });
        });
    });

    // --- Carousel Logic ---
    document.querySelectorAll('.carousel').forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        
        if (!inner || items.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        let currentIndex = 0;

        const updateCarousel = () => {
            inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            // Handle video playback
            items.forEach((item, index) => {
                const video = item.querySelector('video');
                if (video && index !== currentIndex) {
                    video.pause();
                }
            });
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
    });

    // --- Lightbox Logic ---
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close">&times;</button>
        <img src="" id="lightbox-img" alt="Enlarged view">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.cursor-zoom-in').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
        
        // Add subtle hover effect for clickable images
        img.addEventListener('mouseenter', () => {
            anime({ targets: img, scale: 1.05, duration: 400, easing: 'easeOutQuad' });
        });
        img.addEventListener('mouseleave', () => {
            anime({ targets: img, scale: 1, duration: 400, easing: 'easeOutQuad' });
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => { lightboxImg.src = ''; }, 400);
    };
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Mobile menu toggle
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
});
