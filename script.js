/* ───────────────────────────────────────────────────────
   script.js — Vignesh Chandrashekar Portfolio
─────────────────────────────────────────────────────── */

'use strict';

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (hamburger && mobileMenu && closeMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    document.querySelectorAll('.mmlink').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
}

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Typing Effect on Scroll ──
const typingEls = document.querySelectorAll('.type-text');

function animateTyping(el) {
    const originalHTML = el.innerHTML;
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    el.style.opacity = '1';

    let currentNodeIdx = 0;
    let currentCharIdx = 0;
    const speed = 75;

    function type() {
        if (currentNodeIdx < nodes.length) {
            const node = nodes[currentNodeIdx];
            if (node.nodeType === Node.TEXT_NODE) {
                if (currentCharIdx < node.textContent.length) {
                    el.appendChild(document.createTextNode(node.textContent[currentCharIdx]));
                    currentCharIdx++;
                    setTimeout(type, speed);
                } else {
                    currentNodeIdx++;
                    currentCharIdx = 0;
                    type();
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let currentWrapper = el.querySelector(`[data-node-id="${currentNodeIdx}"]`);
                if (!currentWrapper) {
                    currentWrapper = node.cloneNode(false);
                    currentWrapper.setAttribute('data-node-id', currentNodeIdx);
                    el.appendChild(currentWrapper);
                }
                const nodeText = node.textContent;
                if (currentCharIdx < nodeText.length) {
                    currentWrapper.textContent += nodeText[currentCharIdx];
                    currentCharIdx++;
                    setTimeout(type, speed);
                } else {
                    currentNodeIdx++;
                    currentCharIdx = 0;
                    type();
                }
            } else {
                currentNodeIdx++;
                type();
            }
        } else {
            el.innerHTML = originalHTML;
            el.classList.add('typing-done');
        }
    }
    type();
}

const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typing-started')) {
            entry.target.classList.add('typing-started');
            animateTyping(entry.target);
        }
    });
}, { threshold: 0.1 });

typingEls.forEach(el => {
    el.style.opacity = '0';
    typingObserver.observe(el);
});

// ── Portfolio Filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const portfolioGrid = document.getElementById('portfolioGrid');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            let visibleCount = 0;

            portfolioItems.forEach((item) => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'inline-block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.98)';

                    const currentCount = visibleCount;
                    setTimeout(() => {
                        item.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${currentCount * 0.05}s, 
                                                transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${currentCount * 0.05}s`;
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 10);
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.98)';
                    item.style.transition = 'none';
                }
            });

            // Adjust grid columns for visual balance
            if (portfolioGrid) {
                const isMobile = window.innerWidth <= 480;
                const isTablet = window.innerWidth <= 768;

                if (isMobile) {
                    portfolioGrid.style.columnCount = '1';
                } else if (isTablet) {
                    portfolioGrid.style.columnCount = visibleCount > 0 ? '2' : '1';
                } else {
                    if (visibleCount > 0 && visibleCount <= 4) {
                        portfolioGrid.style.columnCount = '2';
                    } else if (visibleCount === 0) {
                        portfolioGrid.style.columnCount = '1';
                    } else {
                        portfolioGrid.style.columnCount = '3';
                    }
                }
            }
        });
    });
}

// ── Parallax Hero (subtle) ──
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
    if (heroBg) {
        const y = window.scrollY * 0.3;
        heroBg.style.transform = `translateY(${y}px)`;
    }
}, { passive: true });

// ── Active nav link highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mmlink');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('active-link', link.getAttribute('href').includes(id));
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Contact Form ──
const form = document.getElementById('contactForm');
if (form) {
    let hasSubmitted = false;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (hasSubmitted) return;
        const btn = form.querySelector('button[type="submit"]');
        const entry = {
            id: Date.now(),
            name: document.getElementById('f-name')?.value || '',
            email: document.getElementById('f-email')?.value || '',
            project: document.getElementById('f-type')?.value || '',
            message: document.getElementById('f-msg')?.value || '',
            time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        };
        const existing = JSON.parse(localStorage.getItem('vc_submissions') || '[]');
        existing.unshift(entry);
        localStorage.setItem('vc_submissions', JSON.stringify(existing));
        hasSubmitted = true;
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #2d6a2d, #4a9a4a)';
        btn.style.color = '#fff';
        Array.from(form.elements).forEach(el => el.disabled = true);
    });
}

// ── Cursor Glow (desktop) ──
if (window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background:radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events:none; z-index:999; transform:translate(-50%,-50%);
    transition:left .1s,top .1s; left:-300px; top:-300px;
  `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ── Smooth number animation for case stats ──
function animateValue(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + range * eased) + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statEl = entry.target.querySelector('.stat-num');
            if (statEl && !statEl.dataset.animated) {
                const val = parseInt(statEl.textContent);
                if (!isNaN(val)) {
                    statEl.dataset.suffix = statEl.textContent.replace(val.toString(), '');
                    statEl.dataset.animated = 'true';
                    animateValue(statEl, 0, val, 1000);
                }
            }
        }
    });
}, { threshold: .5 });

document.querySelectorAll('.case-stats .stat').forEach(s => statsObserver.observe(s));

// ── Collaborate Modal Logic ──
const collabModal = document.getElementById('collabModal');
if (collabModal) {
    const closeBtn = document.getElementById('closeModal');
    const mForm = document.getElementById('collabForm');
    const mType = document.getElementById('m-type');
    let mHasSubmitted = false;

    document.querySelectorAll('.btn-collab').forEach(btn => {
        btn.addEventListener('click', () => {
            const service = btn.getAttribute('data-service');
            if (service && mType) mType.value = service;
            collabModal.classList.add('open');
        });
    });

    const closeModal = () => { collabModal.classList.remove('open'); };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    collabModal.addEventListener('click', (e) => {
        if (e.target === collabModal) closeModal();
    });

    if (mForm) {
        mForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (mHasSubmitted) return;
            const btnSubmit = mForm.querySelector('button[type="submit"]');
            const entry = {
                id: Date.now(),
                name: document.getElementById('m-name')?.value || '',
                email: document.getElementById('m-email')?.value || '',
                project: document.getElementById('m-type')?.value || '',
                message: document.getElementById('m-msg')?.value || '',
                time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
            };
            const existing = JSON.parse(localStorage.getItem('vc_submissions') || '[]');
            existing.unshift(entry);
            localStorage.setItem('vc_submissions', JSON.stringify(existing));
            mHasSubmitted = true;
            btnSubmit.textContent = '✓ Message Sent!';
            btnSubmit.style.background = 'linear-gradient(135deg, #2d6a2d, #4a9a4a)';
            btnSubmit.style.color = '#fff';
            Array.from(mForm.elements).forEach(el => el.disabled = true);
        });
    }
}

// ── Image Lightbox ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');

if (lightbox && lightboxImg) {
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgDiv = item.querySelector('.portfolio-img');
            const overlay = item.querySelector('.portfolio-overlay');

            if (imgDiv) {
                // Extract URL from background-image: url("...")
                const bgImg = window.getComputedStyle(imgDiv).backgroundImage;
                const url = bgImg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

                lightboxImg.src = url;

                // Set caption from overlay text
                if (overlay && lightboxCaption) {
                    const title = overlay.querySelector('h4')?.textContent || '';
                    const sub = overlay.querySelector('span')?.textContent || '';
                    lightboxCaption.innerHTML = `${title} <br> <small style="font-size:0.8rem; opacity:0.7; font-family:'Inter', sans-serif;">${sub}</small>`;
                }

                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            }
        });
    });

    const closeBox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (closeLightbox) closeLightbox.addEventListener('click', closeBox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeBox();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) closeBox();
    });
}

