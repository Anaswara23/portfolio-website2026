
// DOM Elements
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay') || document.createElement('div'); // Fallback
const mobileClose = document.querySelector('.mobile-close') || document.createElement('button'); // Fallback
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
const body = document.body;

// Icons
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const sunIconMobile = document.querySelector('.sun-icon-mobile');
const moonIconMobile = document.querySelector('.moon-icon-mobile');

// --- Mobile Menu Logic ---
function openMobileMenu() {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
}

mobileToggle.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);

// Close menu when clicking a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});


// --- Dark Mode Logic ---

// Helper to safely toggle display
function safeDisplay(element, displayValue) {
    if (element) element.style.display = displayValue;
}

function enableDarkMode() {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    
    // Desktop Icons
    safeDisplay(sunIcon, 'block');
    safeDisplay(moonIcon, 'none');

    // Mobile Icons
    safeDisplay(sunIconMobile, 'block');
    safeDisplay(moonIconMobile, 'none');
}

function disableDarkMode() {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    
    // Desktop Icons
    safeDisplay(sunIcon, 'none');
    safeDisplay(moonIcon, 'block');

    // Mobile Icons
    safeDisplay(sunIconMobile, 'none');
    safeDisplay(moonIconMobile, 'block');
}

function toggleTheme() {
    if (body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Check local storage on load
if (localStorage.getItem('theme') === 'dark') {
    enableDarkMode();
}

// Event Listeners (Safe Checks)
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}
if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
}


// --- Scroll Scrolled Nav State ---
const glassNav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        glassNav.classList.add('scrolled');
    } else {
        glassNav.classList.remove('scrolled');
    }
});


// --- Project Tabs Switcher ---
function switchTab(btn, category) {
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Move Indicator
    const indicator = document.getElementById('tab-indicator');
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.left = `${btn.offsetLeft}px`;

    // Filter Projects
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        const categories = project.getAttribute('data-category');
        if (category === 'all' || categories.includes(category)) {
            project.style.display = 'flex';
        } else {
            project.style.display = 'none';
        }
    });
}

// Initialize Indicator Position
window.onload = () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if(activeBtn) switchTab(activeBtn, 'all');
    
    // Setup Scroll Reveal
    setupScrollReveal();

    // Initialize Testimonial Carousel
    if (typeof initTestimonialCarousel === 'function') {
        initTestimonialCarousel();
    }
};

/* --- Carousel Logic --- */
/* --- Carousel Logic (Multi-Instance) --- */
const carousels = document.querySelectorAll('.carousel-wrapper');

carousels.forEach(carousel => {
    const container = carousel.querySelector('.carousel-container'); // Scrollable area
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');

    if (container && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -360, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: 360, behavior: 'smooth' });
        });
    }
});

/* --- Timeline Slideshow Logic --- */
const timelineItems = document.querySelectorAll('.timeline-item');

timelineItems.forEach(item => {
    const images = item.querySelectorAll('.slideshow-image');
    if (images.length > 1) {
        let currentIndex = 0;
        setInterval(() => {
            // Remove active class from current
            images[currentIndex].classList.remove('active');
            
            // Next index
            currentIndex = (currentIndex + 1) % images.length;
            
            // Add active class to next
            images[currentIndex].classList.add('active');
        }, 3000); // 3 seconds
    }
});


// Testimonial Carousel Logic
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  
  if (!track || !prevBtn || !nextBtn) return;
  
  const slides = track.children;
  let currentIndex = 0;
  
  function updateSlide() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    
    nextBtn.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentIndex === slides.length - 1 ? 'none' : 'auto';
  }
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateSlide();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    }
  });
  
  updateSlide();
}
/* --- Experience Toggle Logic --- */
function toggleExperience() {
    const hiddenSection = document.getElementById('hidden-experience');
    const btnText = document.getElementById('exp-btn-text');
    const btn = document.querySelector('.view-more-btn');

    if (hiddenSection.style.display === 'none') {
        hiddenSection.style.display = 'block';
        btnText.textContent = "View Less";
        btn.classList.add('expanded');
    } else {
        hiddenSection.style.display = 'none';
        btnText.textContent = "View Full Experience";
        btn.classList.remove('expanded');
        
        // Optional: Scroll back to top of exp section?
    }
}

/* --- Scroll Reveal Logic --- */
function setupScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
}


/* --- Custom Cursor Logic --- */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Only run if elements exist and device is likely desktop (pointer: fine)
if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
    
    // Movement
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay/animation
        // Using animate() for smoother performance than just setting top/left
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .tab-btn, .project-card, .view-more-btn, .dot, .read-more-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

