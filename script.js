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

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mmlink').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll Reveal ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger reveals
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

// ── Portfolio Filter ──
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        portfolioItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = '';
                item.style.animation = 'fadeIn .4s ease forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

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
                link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Add active link style dynamically
const style = document.createElement('style');
style.textContent = `.nav-links a.active-link, .mmlink.active-link { color: var(--gold) !important; }
@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`;
document.head.appendChild(style);

// ── Contact Form ──
let hasSubmitted = false;
const form = document.getElementById('contactForm');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (hasSubmitted) return; // Prevent double trigger

        const btn = form.querySelector('button[type="submit"]');

        // Collect data
        const entry = {
            id: Date.now(),
            name: document.getElementById('f-name')?.value || '',
            email: document.getElementById('f-email')?.value || '',
            project: document.getElementById('f-type')?.value || '',
            message: document.getElementById('f-msg')?.value || '',
            time: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        };

        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('vc_submissions') || '[]');
        existing.unshift(entry); // newest first
        localStorage.setItem('vc_submissions', JSON.stringify(existing));

        hasSubmitted = true;

        // Visual feedback
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #2d6a2d, #4a9a4a)';
        btn.style.color = '#fff';

        // Disable form fields
        Array.from(form.elements).forEach(el => el.disabled = true);

        setTimeout(() => {
            btn.textContent = 'Reload page to send another';
            btn.style.background = 'transparent';
            btn.style.border = '1px solid rgba(255,255,255,0.15)';
            btn.style.color = 'var(--text-dim)';
            btn.style.cursor = 'not-allowed';
            btn.disabled = true;
        }, 3000);
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

// ── Portfolio item hover cursor ──
portfolioItems.forEach(item => {
    item.style.cursor = 'pointer';
});

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

    // Open Modal
    document.querySelectorAll('.btn-collab').forEach(btn => {
        btn.addEventListener('click', () => {
            const service = btn.getAttribute('data-service');
            if (service && mType) {
                mType.value = service;
            }
            collabModal.classList.add('open');
        });
    });

    // Close Modal
    const closeModal = () => { collabModal.classList.remove('open'); };
    closeBtn.addEventListener('click', closeModal);
    collabModal.addEventListener('click', (e) => {
        if (e.target === collabModal) closeModal();
    });

    // Handle Form Submission
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

        setTimeout(() => {
            btnSubmit.textContent = 'Reload page to send another';
            btnSubmit.style.background = 'transparent';
            btnSubmit.style.border = '1px solid rgba(255,255,255,0.15)';
            btnSubmit.style.color = 'var(--text-dim)';
            btnSubmit.style.cursor = 'not-allowed';
            btnSubmit.disabled = true;
        }, 3000);
    });
}
