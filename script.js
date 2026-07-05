/* ==========================================================================
   MB STUDIO — script.js
   Vanilla JS only. No dependencies, no frameworks.
   Sections:
     1. Page loader
     2. Sticky navbar + mobile menu
     3. Scroll reveal animations (IntersectionObserver)
     4. Back-to-top button
     5. Footer year
     6. Gallery filter + lightbox
     7. Testimonials slider
     8. Contact form validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. Page loader — hides the loading overlay once the page has painted.
  --------------------------------------------------------------------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 250);
    });
    // Failsafe: never let the loader block the page for more than 2.5s.
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  /* ---------------------------------------------------------------------
     2. Sticky navbar + mobile menu
  --------------------------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu whenever a nav link is chosen.
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     3. Scroll reveal — fades/slides elements in as they enter the viewport.
  --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    // No IntersectionObserver support: just show everything.
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     4. Back-to-top button
  --------------------------------------------------------------------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------
     5. Footer year — keeps the copyright date current automatically.
  --------------------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------------
     6. Gallery filter + lightbox (only present on gallery.html)
  --------------------------------------------------------------------- */
  const masonry = document.querySelector('.masonry');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry .item');

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        galleryItems.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  const lightbox = document.querySelector('.lightbox');
  if (lightbox && masonry) {
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('figcaption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Only images open in the lightbox (video items link out to their own controls).
    const imageItems = Array.from(galleryItems).filter((item) => item.querySelector('img'));
    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      const img = imageItems[currentIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const showRelative = (delta) => {
      currentIndex = (currentIndex + delta + imageItems.length) % imageItems.length;
      openLightbox(currentIndex);
    };

    imageItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Open image in lightbox');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
      });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => showRelative(-1));
    nextBtn?.addEventListener('click', () => showRelative(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showRelative(1);
      if (e.key === 'ArrowLeft') showRelative(-1);
    });
  }

  /* ---------------------------------------------------------------------
     7. Testimonials slider (only present on testimonials.html / home preview)
  --------------------------------------------------------------------- */
  document.querySelectorAll('.slider').forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const dotsWrap = slider.parentElement.querySelector('.slider-controls');
    const prevArrow = slider.parentElement.querySelector('.slider-arrows .prev');
    const nextArrow = slider.parentElement.querySelector('.slider-arrows .next');
    if (!track || !slides.length) return;

    let current = 0;
    let autoplayId;

    // Build dots dynamically based on slide count.
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap?.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function restartAutoplay() {
      clearInterval(autoplayId);
      autoplayId = setInterval(() => goTo(current + 1), 6000);
    }

    prevArrow?.addEventListener('click', () => { goTo(current - 1); restartAutoplay(); });
    nextArrow?.addEventListener('click', () => { goTo(current + 1); restartAutoplay(); });

    // Basic swipe support for touch devices.
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) { goTo(current + (delta < 0 ? 1 : -1)); restartAutoplay(); }
    }, { passive: true });

    goTo(0);
    restartAutoplay();
  });

  /* ---------------------------------------------------------------------
     8. Contact form validation (client-side only, no backend wired up)
  --------------------------------------------------------------------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const fields = {
      name: { el: contactForm.querySelector('#name'), test: (v) => v.trim().length >= 2, msg: 'Please enter your full name.' },
      email: { el: contactForm.querySelector('#email'), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
      phone: { el: contactForm.querySelector('#phone'), test: (v) => v.trim() === '' || /^[0-9+()\-.\s]{7,}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
      subject: { el: contactForm.querySelector('#subject'), test: (v) => v.trim().length > 0, msg: 'Please choose a subject.' },
      message: { el: contactForm.querySelector('#message'), test: (v) => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' },
    };

    const validateField = (key) => {
      const field = fields[key];
      if (!field.el) return true;
      const wrapper = field.el.closest('.field');
      const errorEl = wrapper.querySelector('.error-msg');
      const valid = field.test(field.el.value);
      wrapper.classList.toggle('has-error', !valid);
      if (errorEl) errorEl.textContent = valid ? '' : field.msg;
      return valid;
    };

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      field.el?.addEventListener('blur', () => validateField(key));
      field.el?.addEventListener('input', () => {
        if (field.el.closest('.field').classList.contains('has-error')) validateField(key);
      });
    });

    const statusEl = contactForm.querySelector('.form-status');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields above.';
          statusEl.className = 'form-status error';
        }
        return;
      }

      // No backend is connected in this template — swap this block for a
      // real fetch() call to your form endpoint (Formspree, Netlify, etc.).
      if (statusEl) {
        statusEl.textContent = "Thank you — your message has been sent. We'll reply within one business day.";
        statusEl.className = 'form-status success';
      }
      contactForm.reset();
    });
  }

});
