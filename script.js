/* ═══════════════════════════════════════════════════
   Q's Build Lab — Portfolio Scripts
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Typing Animation ────────────────────────── */
  const phrases = [
    'building biotech tools...',
    'tracking longevity research...',
    'scanning deal flow...',
    'calculating biological age...',
    'aggregating sector signals...',
    'shipping pure python...',
  ];

  const typingEl = document.getElementById('typing');
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseMs = 0;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (pauseMs > 0) {
      pauseMs = 0;
      setTimeout(typeLoop, 1600);
      return;
    }

    if (!deleting) {
      typingEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx >= current.length) {
        deleting = true;
        pauseMs = 1;
        setTimeout(typeLoop, 50);
        return;
      }
      setTimeout(typeLoop, 45 + Math.random() * 35);
    } else {
      typingEl.textContent = current.slice(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 20 + Math.random() * 15);
    }
  }

  if (typingEl) typeLoop();

  /* ── Counter Animation ───────────────────────── */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);

        if (target === 0) {
          el.textContent = '0';
        } else {
          el.textContent = current.toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  /* ── Scroll Animations (IntersectionObserver) ── */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .stack-item, .about-content, .philosophy').forEach(el => {
    observer.observe(el);
  });

  /* ── Hero stats counter trigger ──────────────── */
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  /* ── Nav scroll styling ──────────────────────── */
  const nav = document.getElementById('nav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile nav toggle ───────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ── Particles ───────────────────────────────── */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 40;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      };
    }

    function init() {
      resize();
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 191, ${p.alpha})`;
        ctx.fill();
      });

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 229, 191, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      if (!prefersReduced) {
        requestAnimationFrame(draw);
      }
    }

    init();
    if (!prefersReduced) {
      draw();
    } else {
      // Draw once for static particles
      draw();
    }

    window.addEventListener('resize', () => {
      resize();
    });
  }

  /* ── Make entire card clickable ────────────────── */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function (e) {
      // Don't hijack if user clicked an actual link inside the card
      if (e.target.closest('a')) return;
      const link = card.querySelector('.card-title a') || card.querySelector('.card-link');
      if (link) {
        window.open(link.href, '_blank', 'noopener');
      }
    });
  });

  /* ── Smooth scroll for anchor links ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
