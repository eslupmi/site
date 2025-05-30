// Mobile menu toggle function
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('mobile-open');
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu.classList.contains('mobile-open')) {
                    mobileMenu.classList.remove('mobile-open');
                }
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and comparison items
    const animatedElements = document.querySelectorAll('.feature-card, .comparison-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            mobileMenu.classList.remove('mobile-open');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('mobile-open');
        }
    });
}); 