// Mobile menu toggle function
function toggleMobileMenu() {
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    
    if (navCenter) {
        navCenter.classList.toggle('mobile-open');
    }
    if (navRight) {
        navRight.classList.toggle('mobile-open');
    }
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
                const navCenter = document.querySelector('.nav-center');
                const navRight = document.querySelector('.nav-right');
                if (navCenter && navCenter.classList.contains('mobile-open')) {
                    navCenter.classList.remove('mobile-open');
                }
                if (navRight && navRight.classList.contains('mobile-open')) {
                    navRight.classList.remove('mobile-open');
                }
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Get CSS variable value for header background
        const headerBg = getComputedStyle(document.documentElement)
            .getPropertyValue('--color-header-bg').trim();
        
        if (scrollTop > 100) {
            // Use header-bg with higher opacity when scrolled
            header.style.backgroundColor = headerBg;
        } else {
            // Use header-bg with backdrop-filter for initial state
            header.style.backgroundColor = headerBg;
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
        const navCenter = document.querySelector('.nav-center');
        const navRight = document.querySelector('.nav-right');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navCenter && navRight && mobileToggle) {
            if (!navCenter.contains(e.target) && !navRight.contains(e.target) && !mobileToggle.contains(e.target)) {
                navCenter.classList.remove('mobile-open');
                navRight.classList.remove('mobile-open');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const navCenter = document.querySelector('.nav-center');
        const navRight = document.querySelector('.nav-right');
        if (window.innerWidth > 768) {
            if (navCenter) navCenter.classList.remove('mobile-open');
            if (navRight) navRight.classList.remove('mobile-open');
        }
    });

    // Load GitHub stars
    loadGitHubStars();
});

// Function to load GitHub stars count
function loadGitHubStars() {
    const starsElement = document.getElementById('github-stars');
    const starCountElement = starsElement?.querySelector('.star-count');
    
    if (!starCountElement) return;
    
    // Ensure the element is visible
    if (starsElement) {
        starsElement.style.display = 'inline-flex';
    }
    
    // GitHub repository info
    const owner = 'eslupmi';
    const repo = 'impulse';
    
    fetchGitHubStars(owner, repo, starCountElement);
}

function fetchGitHubStars(owner, repo, starCountElement) {
    // Use GitHub API to get star count
    fetch(`https://api.github.com/repos/${owner}/${repo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch GitHub data');
            }
            return response.json();
        })
        .then(data => {
            const starCount = data.stargazers_count || 0;
            starCountElement.textContent = formatStarCount(starCount);
        })
        .catch(error => {
            console.error('Error fetching GitHub stars:', error);
            // Keep the element visible, just show empty or default value
            starCountElement.textContent = '';
        });
}

function formatStarCount(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
}

// Privacy Policy Modal functions
function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal when clicking outside of it
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closePrivacyModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closePrivacyModal();
            }
        });
    }
}); 