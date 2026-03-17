/* ============================================================
   NAJD ALSHAMAL - main.js
   Interactions, Animations, Utility Functions
   ============================================================ */

'use strict';

// ── Navbar Scroll Effect ──────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── Mobile Menu ───────────────────────────────────────────────
const hamburger   = document.querySelector('.nav-hamburger');
const mobileMenu  = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}
if (mobileClose && mobileMenu) {
  mobileClose.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
}
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Scroll To Top ─────────────────────────────────────────────
const scrollBtn = document.querySelector('.scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Intersection Observer (AOS-like) ─────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('aos-animate');
      // Animate progress bars inside
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        const pct = bar.dataset.pct || '0';
        setTimeout(() => { bar.style.width = pct + '%'; }, 200);
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Also observe progress bars directly
document.querySelectorAll('.progress-fill').forEach(bar => {
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = bar.dataset.pct || '0';
        bar.style.width = pct + '%';
        progressObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  progressObserver.observe(bar);
});

// ── Counter Animation ─────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = parseInt(el.dataset.duration || '2000', 10);
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter-num').forEach(el => counterObserver.observe(el));

// ── FAQ Accordion ─────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').classList.remove('open');
    });
    // Open current if was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// ── Countdown Timer ───────────────────────────────────────────
function startCountdown(targetDate) {
  const els = {
    h: document.querySelectorAll('.cd-hours'),
    m: document.querySelectorAll('.cd-minutes'),
    s: document.querySelectorAll('.cd-seconds'),
  };
  if (!els.s.length) return;

  const update = () => {
    const now  = new Date().getTime();
    const diff = targetDate - now;
    if (diff <= 0) { clearInterval(timer); return; }
    const h = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const m = Math.floor((diff % (1000*60*60)) / (1000*60));
    const s = Math.floor((diff % (1000*60)) / 1000);
    els.h.forEach(el => el.textContent = String(h).padStart(2,'0'));
    els.m.forEach(el => el.textContent = String(m).padStart(2,'0'));
    els.s.forEach(el => el.textContent = String(s).padStart(2,'0'));
  };
  update();
  const timer = setInterval(update, 1000);
}

// Set countdown to 24 hours from now
const endTime = new Date().getTime() + 24 * 60 * 60 * 1000;
startCountdown(endTime);

// ── Quantity Stepper ─────────────────────────────────────────
document.querySelectorAll('.qty-stepper').forEach(stepper => {
  const minusBtn = stepper.querySelector('.qty-minus');
  const plusBtn  = stepper.querySelector('.qty-plus');
  const numEl    = stepper.querySelector('.qty-num');
  let qty = parseInt(numEl?.textContent || '1', 10);

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (qty > 1) { qty--; numEl.textContent = qty; }
    });
  }
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      qty++;
      numEl.textContent = qty;
    });
  }
});

// ── Toast Notification ────────────────────────────────────────
function showToast(message, icon = '✅') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Add to Cart (demo) ────────────────────────────────────────
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('تم إضافة المنتج! سيتواصل معك فريقنا قريباً 🛒');
    // WhatsApp redirect for ordering
    const product = btn.dataset.product || 'منتج كولاجين';
    const waMsg   = encodeURIComponent(`مرحبا، أرغب في طلب: ${product}`);
    setTimeout(() => {
      window.open(`https://wa.me/971505964516?text=${waMsg}`, '_blank');
    }, 1200);
  });
});

// ── Cookie Banner ─────────────────────────────────────────────
const cookieBanner = document.querySelector('.cookie-banner');
if (cookieBanner && !localStorage.getItem('najd_cookies')) {
  setTimeout(() => cookieBanner.classList.add('show'), 2000);
}
document.querySelector('.cookie-accept')?.addEventListener('click', () => {
  localStorage.setItem('najd_cookies', '1');
  cookieBanner?.classList.remove('show');
});
document.querySelector('.cookie-decline')?.addEventListener('click', () => {
  cookieBanner?.classList.remove('show');
});

// ── Active Nav Link ───────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (href === 'index.html' && currentPage === '')) {
    a.classList.add('active');
  }
});

// ── Smooth Image Loading ──────────────────────────────────────
document.querySelectorAll('img[data-src]').forEach(img => {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.disconnect();
      }
    });
  });
  imgObserver.observe(img);
});

// ── Parallax Hero Orbs ────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs[0]?.style.setProperty('transform', `translate(${x * 0.6}px, ${y * 0.6}px)`);
  orbs[1]?.style.setProperty('transform', `translate(${-x * 0.4}px, ${-y * 0.4}px)`);
});

// ── Video Lightbox (if needed) ────────────────────────────────
document.querySelectorAll('[data-video]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const url = trigger.dataset.video;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:pointer;';
    overlay.innerHTML = `<iframe src="${url}" width="800" height="450" frameborder="0" allowfullscreen style="max-width:95vw;max-height:80vh;border-radius:16px;"></iframe>`;
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  });
});

// ── Form Validation (Contact Page) ───────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = contactForm.querySelector('[name="name"]')?.value.trim();
    const phone   = contactForm.querySelector('[name="phone"]')?.value.trim();
    const message = contactForm.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone || !message) {
      showToast('يرجى ملء جميع الحقول المطلوبة', '⚠️');
      return;
    }

    const waMsg = encodeURIComponent(`الاسم: ${name}\nالهاتف: ${phone}\nالرسالة: ${message}`);
    window.open(`https://wa.me/971505964516?text=${waMsg}`, '_blank');
    showToast('شكراً! سيتواصل معك فريقنا قريباً ✨');
    contactForm.reset();
  });
}

console.log('%c✨ Najd Alshamal - Premium Collagen', 'color:#C5A059;font-size:14px;font-weight:bold;');
