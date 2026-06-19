/* ═══════════════════════════════════════════════
   VIBE CLOTHING COMPANY — main.js
   Fabric Wave + Parallax + Scroll Reveal + Stats Counter + Video Control
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', async () => {

  try {
    const headerRes = await fetch('header.html');
    const headerHtml = await headerRes.text();

    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) headerPlaceholder.outerHTML = headerHtml;
  } catch (e) {
    console.error('Error loading header:', e);
  }

  // Set active link based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href').split('#')[0];
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ══════════════════════════════════
     1. NAVBAR — scroll behaviour
  ══════════════════════════════════ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (hamburger && navLinks) {
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
  }


  /* ══════════════════════════════════
     2. FABRIC WAVE CANVAS ANIMATION
  ══════════════════════════════════ */
  const canvas = document.getElementById('fabricCanvas');
  if (canvas) {
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
  }


  /* ══════════════════════════════════
     3. FLOATING PARTICLES
  ══════════════════════════════════ */
  const particleContainer = document.getElementById('particles');
  if (particleContainer) {
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
  }


  /* ══════════════════════════════════
     4. VIDEO CONTROL BUTTON
  ══════════════════════════════════ */
  const video   = document.getElementById('heroVideo');
  const vcBtn   = document.getElementById('videoControl');
  const vcIcon  = document.getElementById('vcIcon');
  const vcLabel = document.getElementById('vcLabel');

  if (video && vcBtn && vcIcon && vcLabel) {
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
  }


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
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let currentId = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navAnchors.forEach(a => {
        const href = a.getAttribute('href');
        // If it's a hash link for the current page
        if (href === `#${currentId}` || href === `index.html#${currentId}`) {
           navAnchors.forEach(link => link.classList.remove('active'));
           a.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


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
  if (canvas) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafFabric);
      else drawFabric();
    });
  }

  /* ══════════════════════════════════
     CONCEPT TO CREATION COMPARISON SLIDER (INDEPENDENT DOUBLE DOOR STYLE)
  ══════════════════════════════════ */
  const c2cDoorLeft = document.getElementById('c2cDoorLeft');
  const c2cDoorRight = document.getElementById('c2cDoorRight');
  const c2cWrapper = document.querySelector('.c2c-wrapper');

  if (c2cDoorLeft && c2cDoorRight && c2cWrapper) {
    let isDragging = false;
    let activeDragSide = null; // 'left' or 'right'

    function updateSliderPosition(x) {
      if (!activeDragSide) return;

      const rect = c2cWrapper.getBoundingClientRect();
      const wrapperCenterX = rect.left + rect.width / 2;
      const halfWidth = rect.width / 2;
      
      // Keep handle visible at the ends (handle is 32px wide on desktop, 26px on mobile)
      const handleWidth = rect.width > 1024 ? 32 : 26;
      const slideRange = halfWidth - handleWidth;

      if (activeDragSide === 'left') {
        // Left door opens to the left (x moves from center towards left edge)
        let distance = wrapperCenterX - x;
        distance = Math.max(0, Math.min(slideRange, distance));
        const translatePercent = (distance / halfWidth) * 100;
        c2cDoorLeft.style.transform = `translateX(-${translatePercent}%)`;
      } else if (activeDragSide === 'right') {
        // Right door opens to the right (x moves from center towards right edge)
        let distance = x - wrapperCenterX;
        distance = Math.max(0, Math.min(slideRange, distance));
        const translatePercent = (distance / halfWidth) * 100;
        c2cDoorRight.style.transform = `translateX(${translatePercent}%)`;
      }
    }

    // Mouse events
    c2cDoorLeft.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent browser drag/text selection hijacking
      isDragging = true;
      activeDragSide = 'left';
      c2cWrapper.classList.add('dragging');
      updateSliderPosition(e.clientX);
      e.stopPropagation();
    });

    c2cDoorRight.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent browser drag/text selection hijacking
      isDragging = true;
      activeDragSide = 'right';
      c2cWrapper.classList.add('dragging');
      updateSliderPosition(e.clientX);
      e.stopPropagation();
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        activeDragSide = null;
        c2cWrapper.classList.remove('dragging');
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.clientX);
    });

    // Touch events
    c2cDoorLeft.addEventListener('touchstart', (e) => {
      isDragging = true;
      activeDragSide = 'left';
      c2cWrapper.classList.add('dragging');
      updateSliderPosition(e.touches[0].clientX);
      e.stopPropagation();
    });

    c2cDoorRight.addEventListener('touchstart', (e) => {
      isDragging = true;
      activeDragSide = 'right';
      c2cWrapper.classList.add('dragging');
      updateSliderPosition(e.touches[0].clientX);
      e.stopPropagation();
    });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        activeDragSide = null;
        c2cWrapper.classList.remove('dragging');
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSliderPosition(e.touches[0].clientX);
    });

    // Initial position (Closed - 0% translation)
    c2cDoorLeft.style.transform = 'translateX(0%)';
    c2cDoorRight.style.transform = 'translateX(0%)';
  }

  // Interactive product features list click handler (Redirects to product-preview.html)
  const productFeatures = document.querySelectorAll('.category-features li');
  if (productFeatures.length > 0) {
    productFeatures.forEach(li => {
      li.addEventListener('click', () => {
        const cardBody = li.closest('.category-card-body');
        if (cardBody) {
          const categoryTitle = cardBody.querySelector('h3').textContent.trim();
          const productText = li.textContent.replace('→', '').replace('->', '').trim();
          window.location.href = `product-preview.html?category=${encodeURIComponent(categoryTitle)}&product=${encodeURIComponent(productText)}`;
        }
      });
    });
  }

});
