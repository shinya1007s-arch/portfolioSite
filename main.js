// --- Mobile Menu Toggle ---
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Close menu on link click
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

// --- Intersection Observer for Scroll Animations ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach((el) => {
    observer.observe(el);
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
            if (video) {
                if (index === currentIndex) {
                    video.play().catch(e => console.log('Autoplay prevented'));
                } else {
                    video.pause();
                }
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
});

const closeLightbox = () => {
    lightbox.classList.remove('active');
    setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear source after transition
};
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
