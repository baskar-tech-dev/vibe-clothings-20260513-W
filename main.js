/* ═══════════════════════════════════════════════
   VIBE CLOTHING COMPANY — main.js
   Fabric Wave + Parallax + Scroll Reveal + Stats Counter + Video Control
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════
     1. NAVBAR — scroll behaviour
  ══════════════════════════════════ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    hamburger.querySelectorAll('span')[0].style.transform = open ? 'translateY(6px) rotate(45deg)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '';
    hamburger.querySelectorAll('span')[2].style.transform = open ? 'translateY(-6px) rotate(-45deg)' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  /* ══════════════════════════════════
     2. FABRIC WAVE CANVAS ANIMATION
  ══════════════════════════════════ */
  const canvas = document.getElementById('fabricCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, t = 0, rafFabric;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const THREADS = 18;
  const WAVES   = 6;

  function drawFabric() {
    ctx.clearRect(0, 0, W, H);
    t += 0.007;

    for (let i = 0; i < THREADS; i++) {
      const progress = i / (THREADS - 1);
      const x        = progress * W;
      const alpha    = 0.06 + Math.sin(progress * Math.PI) * 0.1;

      ctx.beginPath();
      ctx.moveTo(x, 0);

      for (let y = 0; y <= H; y += 6) {
        const wave = Math.sin((y / H) * Math.PI * WAVES + t + progress * 2.5) * (16 + Math.sin(t * 0.4 + i) * 8);
        ctx.lineTo(x + wave, y);
      }

      ctx.strokeStyle = `rgba(124,179,66,${alpha})`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }

    // Horizontal weft threads
    for (let j = 0; j < 10; j++) {
      const progress = j / 9;
      const y        = progress * H;
      const alpha    = 0.04 + Math.sin(progress * Math.PI) * 0.06;

      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let x = 0; x <= W; x += 6) {
        const wave = Math.sin((x / W) * Math.PI * 4 + t * 1.3 + progress * 2) * (10 + Math.sin(t * 0.6 + j) * 5);
        ctx.lineTo(x, y + wave);
      }

      ctx.strokeStyle = `rgba(124,179,66,${alpha})`;
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    }

    rafFabric = requestAnimationFrame(drawFabric);
  }
  drawFabric();


  /* ══════════════════════════════════
     3. FLOATING PARTICLES
  ══════════════════════════════════ */
  const particleContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 28;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 4 + 1;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      --dur: ${Math.random() * 6 + 5}s;
      --delay: ${Math.random() * 6}s;
      opacity: 0;
    `;
    particleContainer.appendChild(p);
  }


  /* ══════════════════════════════════
     4. VIDEO CONTROL BUTTON
  ══════════════════════════════════ */
  const video   = document.getElementById('heroVideo');
  const vcBtn   = document.getElementById('videoControl');
  const vcIcon  = document.getElementById('vcIcon');
  const vcLabel = document.getElementById('vcLabel');

  const pauseSVG = `<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
                    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>`;
  const playSVG  = `<polygon points="5,3 19,12 5,21" fill="currentColor"/>`;

  let playing = true;
  vcBtn.addEventListener('click', () => {
    playing = !playing;
    if (playing) {
      video.play();
      vcIcon.innerHTML = pauseSVG;
      vcLabel.textContent = 'PAUSE';
    } else {
      video.pause();
      vcIcon.innerHTML = playSVG;
      vcLabel.textContent = 'PLAY';
    }
  });


  /* ══════════════════════════════════
     5. STATS COUNTER ANIMATION
  ══════════════════════════════════ */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  let countersTriggered = false;
  function checkCounters() {
    if (countersTriggered) return;
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;
    const rect = statsBar.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      countersTriggered = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count, 10));
      });
    }
  }


  /* ══════════════════════════════════
     6. SCROLL REVEAL (Intersection Observer)
  ══════════════════════════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


  /* ══════════════════════════════════
     7. PARALLAX EFFECT (scroll)
  ══════════════════════════════════ */
  const parallaxLayers = document.querySelectorAll('.parallax-layer[data-speed]');

  function handleParallax() {
    const scrollY = window.scrollY;
    parallaxLayers.forEach(layer => {
      const speed    = parseFloat(layer.dataset.speed) || 0.3;
      const section  = layer.closest('section');
      if (!section) return;
      const rect     = section.getBoundingClientRect();
      const offset   = (rect.top + scrollY) - scrollY;
      const relScroll = scrollY - offset;
      layer.style.transform = `translateY(${relScroll * speed}px)`;
    });

    checkCounters();
  }

  window.addEventListener('scroll', handleParallax, { passive: true });


  /* ══════════════════════════════════
     8. BUTTON GLOW HOVER (mouse move)
  ══════════════════════════════════ */
  document.querySelectorAll('.btn-primary, .btn-outline, .service-card, .badge-item').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });


  /* ══════════════════════════════════
     9. ACTIVE NAV LINK on scroll
  ══════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ══════════════════════════════════
     10. SMOOTH REVEAL on first load
  ══════════════════════════════════ */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Cleanup on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafFabric);
    else drawFabric();
  });

});
