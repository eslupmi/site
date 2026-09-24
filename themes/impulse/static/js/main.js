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
    
    updateMobileMenuPosition();
}

function updateMobileMenuPosition() {
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    
    if (navCenter && navRight && window.innerWidth <= 768) {
        if (navCenter.classList.contains('mobile-open') && navRight.classList.contains('mobile-open')) {
            setTimeout(() => {
                navCenter.style.width = '';
                navRight.style.width = '';
                const w = Math.max(navCenter.offsetWidth, navRight.offsetWidth);
                navCenter.style.width = w + 'px';
                navRight.style.width = w + 'px';
                const parent = navCenter.offsetParent.getBoundingClientRect().top;
                navRight.style.top = `${navCenter.getBoundingClientRect().bottom - parent}px`;
            }, 10);
        } else {
            navRight.style.top = '';
            navCenter.style.width = '';
            navRight.style.width = '';
        }
    }
}

function updateCurrentNav() {
    const path = location.pathname;
    document.querySelectorAll('#mobile-menu .nav-link').forEach(a => {
        const href = a.getAttribute('href');
        const on = href === '/' ? path === '/' : path.startsWith(href);
        if (on) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
    });
}

document.addEventListener('click', function (e) {
    const btn = e.target.closest('.docs-nav-toggle, .docs-version-toggle');
    if (!btn) return;
    const root = btn.parentElement;
    const panels = [
        [root.querySelector('.docs-nav-toggle'), root.querySelector('.docs-nav'), 'Contents'],
        [root.querySelector('.docs-version-toggle'), root.querySelector('.docs-version-panel'), 'Version']
    ];
    panels.forEach(([b, p]) => { if (b !== btn && p) p.classList.remove('open'); });
    panels.find(([b]) => b === btn)[1].classList.toggle('open');
    panels.forEach(([b, p, label]) => {
        if (!b) return;
        const on = p && p.classList.contains('open');
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
        b.setAttribute('aria-label', on ? 'Close ' + label.toLowerCase() : label);
    });
});

function closeMobileMenu() {
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    if (navCenter) navCenter.classList.remove('mobile-open');
    if (navRight) {
        navRight.classList.remove('mobile-open');
        navRight.style.top = '';
        navRight.style.width = '';
    }
    if (navCenter) navCenter.style.width = '';
}

function initCodeCopy() {
    document.querySelectorAll('pre').forEach(pre => {
        const box = pre.parentElement.matches('.highlight, .codehilite') ? pre.parentElement : pre;
        if (box.parentElement.classList.contains('code-block')) return;
        const wrap = document.createElement('div');
        wrap.className = 'code-block';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', 'Copy');
        btn.innerHTML = '<svg class="icon-copy" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><svg class="icon-copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
        btn.addEventListener('click', () => {
            const text = pre.innerText.replace(/\n$/, '');
            const done = () => {
                btn.classList.add('copied');
                btn.setAttribute('aria-label', 'Copied');
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.setAttribute('aria-label', 'Copy');
                }, 1200);
            };
            const legacy = () => {
                const area = document.createElement('textarea');
                area.value = text;
                area.style.position = 'fixed';
                area.style.left = '-9999px';
                document.body.append(area);
                area.select();
                document.execCommand('copy');
                area.remove();
                done();
            };
            if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, legacy);
            else legacy();
        });
        box.before(wrap);
        wrap.append(btn, box);
    });
}

let shown = location.pathname + location.search;
let navSeq = 0;

function refreshTarget(doc) {
    const meta = doc.querySelector('meta[http-equiv="refresh" i]');
    if (!meta) return;
    const m = (meta.getAttribute('content') || '').match(/url=([^;]+)/i);
    return m && m[1].trim();
}

function syncCanonical(doc) {
    const next = doc.querySelector('link[rel="canonical"]');
    if (!next) return;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.setAttribute('href', next.getAttribute('href'));
}

function syncDocsCss(doc) {
    const next = doc.querySelector('link[href*="/assets/docs.css"]');
    let link = document.getElementById('docs-css');
    if (!next) {
        if (link) link.remove();
        return Promise.resolve();
    }
    const href = next.getAttribute('href');
    if (link && (link.dataset.href || link.getAttribute('href')) === href) {
        link.dataset.href = href;
        return Promise.resolve();
    }
    if (!link) {
        link = document.createElement('link');
        link.id = 'docs-css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    link.dataset.href = href;
    return new Promise(resolve => {
        link.onload = link.onerror = () => resolve();
        link.setAttribute('href', href);
    });
}

function scrollToTarget() {
    const id = location.hash.slice(1);
    const main = document.querySelector('.docs-main');
    if (!id) {
        window.scrollTo(0, 0);
        if (main) main.scrollTop = 0;
        return;
    }
    const el = document.getElementById(decodeURIComponent(id));
    if (!el) return;
    if (main && main.contains(el)) {
        el.scrollIntoView({ block: 'start' });
        return;
    }
    const header = document.querySelector('.header');
    window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight - 20);
}

function docsVer(path) {
    const p = path.split('/');
    return p[1] === 'docs' ? p[2] : '';
}

function keepDocsNav(current, next, prevPath, nextPath) {
    if (!docsVer(prevPath) || docsVer(prevPath) !== docsVer(nextPath)) return;
    const oldNav = current.querySelector('.docs-nav');
    const newNav = next.querySelector('.docs-nav');
    if (!oldNav || !newNav) return;
    oldNav.classList.remove('open');
    const top = oldNav.scrollTop;
    const href = newNav.querySelector('a.active')?.getAttribute('href');
    newNav.replaceWith(oldNav);
    oldNav.querySelectorAll('a.active').forEach(a => a.classList.remove('active'));
    const link = href && [...oldNav.querySelectorAll('a')].find(a => a.getAttribute('href') === href);
    if (link) {
        link.classList.add('active');
        for (let n = link.parentElement; n && n !== oldNav; n = n.parentElement) {
            if (n.tagName === 'DETAILS') n.open = true;
        }
    }
    return { top, link };
}

function ensureDocsJs() {
    if (window.initDocs) return Promise.resolve();
    const version = location.pathname.split('/')[2] || 'stable';
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = '/docs/' + version + '/js/versions.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('docs'));
        document.body.appendChild(s);
    });
}

async function loadPage(url, push) {
    const seq = ++navSeq;
    const res = await fetch(url);
    if (seq !== navSeq) return;
    if (!res.ok) throw new Error(String(res.status));
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    if (seq !== navSeq) return;
    const hop = refreshTarget(doc);
    if (hop && !doc.getElementById('page')) {
        const nextUrl = new URL(hop, res.url);
        nextUrl.hash = url.hash;
        return loadPage(nextUrl, push);
    }
    const next = doc.getElementById('page');
    const current = document.getElementById('page');
    if (!next || !current) throw new Error('page');
    const finalUrl = new URL(res.url);
    finalUrl.hash = url.hash || '';
    const prevPath = shown;
    if (push !== false) history.pushState(null, '', finalUrl.pathname + finalUrl.search + finalUrl.hash);
    shown = finalUrl.pathname + finalUrl.search;
    document.title = doc.title;
    syncCanonical(doc);
    await syncDocsCss(doc);
    if (seq !== navSeq) return;
    const keptNav = keepDocsNav(current, next, prevPath, finalUrl.pathname);
    current.replaceWith(next);
    closePrivacyModal();
    closeMobileMenu();
    updateCurrentNav();
    initCodeCopy();
    scrollToTarget();
    if (keptNav) {
        document.querySelector('.docs-nav').scrollTop = keptNav.top;
        if (keptNav.link) keptNav.link.scrollIntoView({ block: 'nearest' });
    }
    if (!document.querySelector('.docs-page')) return;
    await ensureDocsJs();
    if (seq !== navSeq) return;
    if (window.initDocs) window.initDocs();
}

window.navigate = function (href) {
    const url = new URL(href, location.href);
    return loadPage(url).catch(() => { location.href = url.href; });
};

document.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a || !a.href || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    loadPage(url).catch(() => { location.href = url.href; });
}, true);

document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#') return;
    const targetSection = document.querySelector(link.getAttribute('href'));
    if (!targetSection) return;
    e.preventDefault();
    if (document.querySelector('.docs-main')?.contains(targetSection)) {
        targetSection.scrollIntoView({ block: 'start' });
        closeMobileMenu();
        return;
    }
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight - 20;
    window.scrollTo(0, targetPosition);
    closeMobileMenu();
});

window.addEventListener('popstate', function () {
    const url = new URL(location.href);
    if (url.pathname + url.search === shown) {
        scrollToTarget();
        return;
    }
    loadPage(url, false).catch(() => location.reload());
});

document.addEventListener('DOMContentLoaded', function() {
    initCodeCopy();
    updateCurrentNav();

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

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navCenter = document.querySelector('.nav-center');
        const navRight = document.querySelector('.nav-right');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navCenter && navRight && mobileToggle) {
            if (!navCenter.contains(e.target) && !navRight.contains(e.target) && !mobileToggle.contains(e.target)) {
                navCenter.classList.remove('mobile-open');
                navRight.classList.remove('mobile-open');
                navRight.style.top = '';
                navCenter.style.width = '';
                navRight.style.width = '';
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const navCenter = document.querySelector('.nav-center');
        const navRight = document.querySelector('.nav-right');
        if (window.innerWidth > 768) {
            if (navCenter) navCenter.classList.remove('mobile-open');
            if (navRight) {
                navRight.classList.remove('mobile-open');
                navRight.style.top = '';
                navCenter.style.width = '';
                navRight.style.width = '';
            }
        } else {
            updateMobileMenuPosition();
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

    const owner = 'eslupmi';
    const repo = 'impulse';
    
    // Cache key for localStorage
    const cacheKey = `github-stars-${owner}-${repo}`;
    const cacheTimeKey = `github-stars-time-${owner}-${repo}`;
    const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    
    // Check cache
    const cachedTime = localStorage.getItem(cacheTimeKey);
    const cachedCount = localStorage.getItem(cacheKey);
    const now = Date.now();
    
    if (cachedTime && cachedCount && (now - parseInt(cachedTime)) < cacheDuration) {
        // Use cached value
        starCountElement.textContent = formatStarCount(parseInt(cachedCount));
    } else {
        // Fetch new value
        fetchGitHubStars(owner, repo, starCountElement, cacheKey, cacheTimeKey);
    }
}

function fetchGitHubStars(owner, repo, starCountElement, cacheKey, cacheTimeKey) {
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
            
            // Cache the result
            if (cacheKey && cacheTimeKey) {
                localStorage.setItem(cacheKey, starCount.toString());
                localStorage.setItem(cacheTimeKey, Date.now().toString());
            }
        })
        .catch(error => {
            console.error('Error fetching GitHub stars:', error);
            // Try to use cached value if available, even if expired
            if (cacheKey) {
                const cachedCount = localStorage.getItem(cacheKey);
                if (cachedCount) {
                    starCountElement.textContent = formatStarCount(parseInt(cachedCount));
                    return;
                }
            }
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

document.addEventListener("click", function (e) {
    if (!e.target.closest(".theme-toggle")) return;
    var theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}); 