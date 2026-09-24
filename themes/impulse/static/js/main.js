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

function updateDocsToggles() {
    const buttons = document.querySelectorAll('.docs-nav-toggle, .docs-version-toggle');
    if (!buttons.length) return;
    const footer = document.querySelector('.footer');
    const gap = footer ? Math.max(0, innerHeight - footer.getBoundingClientRect().top) : 0;
    const noScroll = document.documentElement.scrollHeight <= innerHeight;
    if (scrollY < docsScrollY - 4) docsTogglesOn = true;
    else if (scrollY > docsScrollY + 4) docsTogglesOn = false;
    docsScrollY = scrollY;
    const open = document.querySelector('.docs-nav.open, .docs-version-panel.open');
    buttons.forEach(b => {
        b.style.bottom = (16 + gap) + 'px';
        b.classList.toggle('is-on', !!open || noScroll || docsTogglesOn);
    });
}
let docsScrollY = scrollY;
let docsTogglesOn = false;
addEventListener('scroll', updateDocsToggles, { passive: true });
addEventListener('resize', updateDocsToggles);

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
    if (document.getElementById('docs-css')) return Promise.resolve();
    const next = doc.querySelector('link[href*="docs.css"]');
    if (!next) return Promise.resolve();
    const link = document.createElement('link');
    link.id = 'docs-css';
    link.rel = 'stylesheet';
    link.href = next.getAttribute('href');
    document.head.appendChild(link);
    return Promise.resolve();
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
    if (url.pathname === '/docs' || url.pathname === '/docs/') url = new URL('/docs/stable/' + url.hash, url.origin);
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
    loadGitHubStars();
    updateDocsToggles();

    document.addEventListener('click', function(e) {
        const navCenter = document.querySelector('.nav-center');
        const navRight = document.querySelector('.nav-right');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (!navCenter || !navRight || !mobileToggle) return;
        if (navCenter.contains(e.target) || navRight.contains(e.target) || mobileToggle.contains(e.target)) return;
        closeMobileMenu();
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) closeMobileMenu();
        else updateMobileMenuPosition();
    });
});

function loadGitHubStars() {
    const el = document.querySelector('#github-stars .star-count');
    if (!el) return;
    const key = 'github-stars-eslupmi-impulse';
    const timeKey = key + '-time';
    const cached = localStorage.getItem(key);
    const cachedTime = +localStorage.getItem(timeKey);
    const show = n => { el.textContent = n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n); };
    if (cached && Date.now() - cachedTime < 3600000) {
        show(+cached);
        return;
    }
    fetch('https://api.github.com/repos/eslupmi/impulse')
        .then(r => { if (!r.ok) throw 0; return r.json(); })
        .then(data => {
            const n = data.stargazers_count || 0;
            show(n);
            localStorage.setItem(key, n);
            localStorage.setItem(timeKey, Date.now());
        })
        .catch(() => { if (cached) show(+cached); else el.textContent = ''; });
}

function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

document.addEventListener('click', function (e) {
    if (e.target.id === 'privacy-modal') closePrivacyModal();
});

document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('privacy-modal');
    if (e.key === 'Escape' && modal && modal.style.display === 'block') closePrivacyModal();
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".theme-toggle")) return;
    var theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}); 