/* ============================================================
   MB STUDIO — script.js
   Vanilla JS only. No dependencies.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('is-hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
  // Safety fallback in case 'load' fires late or assets 404
  setTimeout(() => { if (loader) loader.classList.add('is-hidden'); }, 4000);

  /* ---------- Sticky nav on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], main#home');
  const navAnchors = document.querySelectorAll('.nav__link');
  const setActiveLink = () => {
    let current = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated counters (About stats) ---------- */
  const counters = document.querySelectorAll('.stat-card__num');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterIO.observe(c));
  }

  /* ---------- Gallery filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('filtered-out', !match);
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryList = Array.from(galleryItems);
  let currentIndex = 0;

  const openLightbox = (index) => {
    const visible = galleryList.filter(i => !i.classList.contains('filtered-out'));
    if (!visible.length) return;
    currentIndex = visible.indexOf(galleryList[index]) > -1 ? galleryList.indexOf(galleryList[index]) : 0;
    updateLightboxImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const updateLightboxImage = () => {
    const img = galleryList[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const stepLightbox = (dir) => {
    const visible = galleryList.map((el, i) => ({ el, i })).filter(o => !o.el.classList.contains('filtered-out'));
    if (!visible.length) return;
    const pos = visible.findIndex(o => o.i === currentIndex);
    const nextPos = (pos + dir + visible.length) % visible.length;
    currentIndex = visible[nextPos].i;
    updateLightboxImage();
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  lightboxNext.addEventListener('click', () => stepLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  /* ---------- Audio player ---------- */
  const audioEl = document.getElementById('audioEl');
  const playPauseBtn = document.getElementById('playPause');
  const prevTrackBtn = document.getElementById('prevTrack');
  const nextTrackBtn = document.getElementById('nextTrack');
  const seek = document.getElementById('seek');
  const curTimeEl = document.getElementById('curTime');
  const durTimeEl = document.getElementById('durTime');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const playlistItems = document.querySelectorAll('.playlist__item');
  const playerCard = document.querySelector('.player');

  const formatTime = (sec) => {
    if (!isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const loadTrack = (item) => {
    playlistItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    audioEl.src = item.getAttribute('data-src');
    trackTitle.textContent = item.getAttribute('data-title');
    trackArtist.textContent = item.getAttribute('data-artist');
  };

  const playAudio = () => {
    audioEl.play().catch(() => { /* file may be a placeholder in this repo */ });
    playPauseBtn.textContent = '❚❚';
    playPauseBtn.setAttribute('aria-label', 'Pause');
    playerCard.classList.add('playing');
  };
  const pauseAudio = () => {
    audioEl.pause();
    playPauseBtn.textContent = '▶';
    playPauseBtn.setAttribute('aria-label', 'Play');
    playerCard.classList.remove('playing');
  };

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (audioEl.paused) playAudio(); else pauseAudio();
    });
  }

  playlistItems.forEach((item) => {
    item.addEventListener('click', () => {
      loadTrack(item);
      playAudio();
    });
  });

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => {
      const items = Array.from(playlistItems);
      const idx = items.findIndex(i => i.classList.contains('active'));
      const prev = items[(idx - 1 + items.length) % items.length];
      loadTrack(prev);
      playAudio();
    });
  }
  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', () => {
      const items = Array.from(playlistItems);
      const idx = items.findIndex(i => i.classList.contains('active'));
      const next = items[(idx + 1) % items.length];
      loadTrack(next);
      playAudio();
    });
  }

  if (audioEl) {
    audioEl.addEventListener('loadedmetadata', () => {
      durTimeEl.textContent = formatTime(audioEl.duration);
      seek.max = audioEl.duration || 100;
    });
    audioEl.addEventListener('timeupdate', () => {
      curTimeEl.textContent = formatTime(audioEl.currentTime);
      if (!seek.matches(':active')) seek.value = audioEl.currentTime;
    });
    audioEl.addEventListener('ended', () => {
      if (nextTrackBtn) nextTrackBtn.click();
    });
    seek.addEventListener('input', () => {
      audioEl.currentTime = seek.value;
    });
  }

  /* ---------- Testimonial slider ---------- */
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('sliderDots');
  let slideIndex = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('span');

  function goToSlide(i) {
    slideIndex = (i + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === slideIndex));
  }

  let sliderInterval = setInterval(() => goToSlide(slideIndex + 1), 6000);
  const sliderEl = document.querySelector('.slider');
  sliderEl.addEventListener('mouseenter', () => clearInterval(sliderInterval));
  sliderEl.addEventListener('mouseleave', () => {
    sliderInterval = setInterval(() => goToSlide(slideIndex + 1), 6000);
  });

  /* ---------- Contact form (static-site friendly) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'Thanks — your message has been noted. We\'ll reply within 24 hours.';
      contactForm.reset();
      // NOTE: GitHub Pages cannot process form submissions server-side.
      // Connect this form to a service like Formspree, Getform, or EmailJS
      // and point the "action" attribute (or a fetch() call here) at it
      // to actually receive submissions.
    });
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Particle / floating note background ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createParticles() {
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 24000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.3 + 0.05,
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1
    }));
  }
  createParticles();
  window.addEventListener('resize', createParticles);

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,97,${p.alpha})`;
      ctx.fill();
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    });
    if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
  }
  if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
  else drawParticles();

});
