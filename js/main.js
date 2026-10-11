// === NAVIGATION ===
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (navToggle && navLinks) {
  function setNavOpen(isOpen) {
    navLinks.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  navToggle.addEventListener('click', () => {
    setNavOpen(!navLinks.classList.contains('open'));
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      setNavOpen(false);
    });
  });

  document.addEventListener('click', event => {
    if (!navLinks.classList.contains('open')) {
      return;
    }

    if (!event.target.closest('nav')) {
      setNavOpen(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setNavOpen(false);
      navToggle.focus();
    }
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      });

      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) {
        active.classList.add('active');
        active.setAttribute('aria-current', 'page');
      }
    }
  });
}

let navScrollTicking = false;

window.addEventListener('scroll', () => {
  if (navScrollTicking) {
    return;
  }

  navScrollTicking = true;
  window.requestAnimationFrame(() => {
    updateActiveNav();
    navScrollTicking = false;
  });
}, { passive: true });

// === SCROLL ANIMATIONS ===
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => {
  observer.observe(el);
});

// === HERO TYPING ANIMATION ===
function typeWriter(element, text, speed = 30) {
  if (prefersReducedMotion.matches) {
    element.textContent = text;
    return Promise.resolve();
  }

  return new Promise(resolve => {
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

async function heroAnimation() {
  const bootLines = document.querySelectorAll('.boot-line');
  const heroName = document.querySelector('.hero-name');
  const heroTitle = document.querySelector('.hero-title');
  const tagline = document.querySelector('.hero-tagline');

  if (prefersReducedMotion.matches) {
    bootLines.forEach(line => {
      line.style.opacity = '1';
    });

    if (heroName) {
      heroName.textContent = heroName.dataset.text || heroName.textContent;
    }

    if (heroTitle) {
      heroTitle.textContent = heroTitle.dataset.text || heroTitle.textContent;
    }

    if (tagline) {
      tagline.style.opacity = '1';
    }

    return;
  }

  // Show boot lines sequentially
  for (const line of bootLines) {
    line.style.opacity = '1';
    await new Promise(r => setTimeout(r, 150));
  }

  await new Promise(r => setTimeout(r, 300));

  // Type the name
  if (heroName) {
    heroName.textContent = '';
    await typeWriter(heroName, heroName.dataset.text || 'Vishal Balaji', 50);
  }

  await new Promise(r => setTimeout(r, 200));

  // Type the title
  if (heroTitle) {
    heroTitle.textContent = '';
    await typeWriter(heroTitle, heroTitle.dataset.text || 'Cloud / Platform Engineer | Kubernetes, AWS, Backend', 25);
  }

  await new Promise(r => setTimeout(r, 300));

  // Fade in tagline
  if (tagline) {
    tagline.style.opacity = '1';
  }
}

function initHeroSignalBackground() {
  const hero = document.querySelector('#hero');
  const canvas = document.querySelector('.hero-fourier-canvas');
  const terminal = document.querySelector('.hero-terminal');

  if (!hero || !canvas) {
    return;
  }

  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    centerX: 0,
    centerY: 0,
    baseRadius: 0,
    compact: false,
    animationFrame: null,
    startedAt: 0,
    pausedElapsed: 0,
    heroVisible: true
  };
  const initialDelay = 900;
  const auroraDefs = [
    { x: 0.24, y: 0.32, r: 0.55, speed: 0.12, phase: 0, alpha: 0.055 },
    { x: 0.76, y: 0.44, r: 0.6, speed: 0.09, phase: 2.1, alpha: 0.045 }
  ];
  const routeDefs = [
    { p0: [0, 0.14], p1: [0.32, 0.02], p2: [0.66, 0.24], p3: [1, 0.12], alpha: 0.1, vehicles: [{ phase: 0.3, speed: 0.05, size: 7.4 }] },
    { p0: [0, 0.3], p1: [0.3, 0.14], p2: [0.64, 0.44], p3: [1, 0.26], alpha: 0.12, vehicles: [{ phase: 0.05, speed: 0.055, size: 7.8 }, { phase: 0.62, speed: 0.04, size: 7.2 }] },
    { p0: [0, 0.46], p1: [0.32, 0.34], p2: [0.68, 0.6], p3: [1, 0.44], alpha: 0.1, vehicles: [{ phase: 0.44, speed: 0.048, size: 7.4 }] },
    { p0: [0, 0.62], p1: [0.34, 0.8], p2: [0.66, 0.38], p3: [1, 0.56], alpha: 0.12, vehicles: [{ phase: 0.7, speed: 0.052, size: 7.6 }, { phase: 0.2, speed: 0.038, size: 7.2 }] },
    { p0: [0, 0.88], p1: [0.38, 0.98], p2: [0.68, 0.7], p3: [1, 0.9], alpha: 0.11, vehicles: [{ phase: 0.18, speed: 0.046, size: 7.4 }] }
  ];

  function drawAurora(time) {
    context.shadowBlur = 0;
    context.globalCompositeOperation = 'lighter';

    auroraDefs.forEach(blob => {
      const cx = (blob.x + Math.sin(time * blob.speed + blob.phase) * 0.05) * state.width;
      const cy = (blob.y + Math.cos(time * blob.speed * 0.8 + blob.phase * 1.3) * 0.045) * state.height;
      const radius = blob.r * Math.max(state.width, state.height);
      const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius);

      gradient.addColorStop(0, `rgba(0, 255, 65, ${blob.alpha})`);
      gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, state.width, state.height);
    });

    context.globalCompositeOperation = 'source-over';
  }

  function routePoint(route, t) {
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const d = t * t * t;

    return {
      x: (a * route.p0[0] + b * route.p1[0] + c * route.p2[0] + d * route.p3[0]) * state.width,
      y: (a * route.p0[1] + b * route.p1[1] + c * route.p2[1] + d * route.p3[1]) * state.height
    };
  }

  function drawRoutes() {
    context.shadowBlur = 0;
    context.lineWidth = 1;
    context.setLineDash([5, 9]);

    routeDefs.forEach(route => {
      context.beginPath();

      for (let i = 0; i <= 44; i += 1) {
        const point = routePoint(route, i / 44);

        if (i === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }
      }

      context.strokeStyle = `rgba(0, 255, 65, ${route.alpha})`;
      context.stroke();
    });

    context.setLineDash([]);
  }

  function drawRouteMarks() {
    context.shadowBlur = 0;
    context.lineWidth = 1.2;
    context.strokeStyle = 'rgba(0, 255, 65, 0.2)';

    routeDefs.forEach(route => {
      [0.14, 0.3, 0.46, 0.62, 0.78, 0.92].forEach(t => {
        const point = routePoint(route, t);
        const ahead = routePoint(route, Math.min(1, t + 0.012));
        const angle = Math.atan2(ahead.y - point.y, ahead.x - point.x);
        const size = 4.5;

        context.beginPath();
        context.moveTo(point.x - Math.cos(angle - 0.55) * size, point.y - Math.sin(angle - 0.55) * size);
        context.lineTo(point.x, point.y);
        context.lineTo(point.x - Math.cos(angle + 0.55) * size, point.y - Math.sin(angle + 0.55) * size);
        context.stroke();
      });
    });
  }

  function drawCarGlyph(scale) {
    const length = scale * 2;
    const height = scale * 1.05;

    context.beginPath();
    context.moveTo(-length * 0.5, height * 0.26);
    context.lineTo(-length * 0.5, -height * 0.04);
    context.lineTo(-length * 0.24, -height * 0.04);
    context.lineTo(-length * 0.06, -height * 0.5);
    context.lineTo(length * 0.18, -height * 0.5);
    context.lineTo(length * 0.36, -height * 0.04);
    context.lineTo(length * 0.5, -height * 0.04);
    context.lineTo(length * 0.5, height * 0.26);
    context.closePath();
    context.fill();

    context.beginPath();
    context.arc(-length * 0.28, height * 0.3, height * 0.24, 0, Math.PI * 2);
    context.arc(length * 0.3, height * 0.3, height * 0.24, 0, Math.PI * 2);
    context.fill();
  }

  function drawVehicles(time) {
    context.shadowBlur = 0;

    routeDefs.forEach(route => {
      route.vehicles.forEach(vehicle => {
        const t = ((time * vehicle.speed + vehicle.phase) % 1 + 1) % 1;
        const fade = Math.min(1, Math.min(t, 1 - t) / 0.08);
        const head = routePoint(route, t);
        const tail = routePoint(route, Math.max(0, t - 0.045));
        const ahead = routePoint(route, Math.min(1, t + 0.01));
        const angle = Math.atan2(ahead.y - head.y, ahead.x - head.x);

        context.globalAlpha = fade;

        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.lineTo(head.x, head.y);
        context.strokeStyle = 'rgba(150, 255, 185, 0.4)';
        context.lineWidth = 1.4;
        context.lineCap = 'round';
        context.stroke();

        context.save();
        context.translate(head.x, head.y);
        context.rotate(angle);
        context.fillStyle = 'rgba(205, 255, 220, 0.95)';
        context.shadowColor = 'rgba(0, 255, 65, 0.6)';
        context.shadowBlur = 8;
        drawCarGlyph(vehicle.size);
        context.restore();

        context.globalAlpha = 1;
      });
    });

    context.shadowBlur = 0;
  }

  function drawScene(time) {
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    context.clearRect(0, 0, state.width, state.height);

    drawAurora(time);
    drawRoutes();
    drawRouteMarks();
    drawVehicles(time);
  }

  function drawStaticScene() {
    drawScene(8.4);
  }

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();

    state.width = rect.width;
    state.height = rect.height;
    state.dpr = Math.min(window.devicePixelRatio || 1, 1.6);

    canvas.width = Math.max(1, Math.round(state.width * state.dpr));
    canvas.height = Math.max(1, Math.round(state.height * state.dpr));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    if (prefersReducedMotion.matches || !state.animationFrame) {
      drawStaticScene();
    }
  }

  function stopAnimation() {
    if (state.animationFrame) {
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = null;
    }
  }

  function animate(timestamp) {
    if (!state.startedAt) {
      state.startedAt = timestamp - state.pausedElapsed;
    }

    const elapsed = timestamp - state.startedAt;
    state.pausedElapsed = elapsed;

    if (elapsed < initialDelay) {
      drawStaticScene();
      state.animationFrame = requestAnimationFrame(animate);
      return;
    }

    drawScene((elapsed - initialDelay) / 1000);
    state.animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (prefersReducedMotion.matches || document.hidden || !state.heroVisible || state.animationFrame) {
      return;
    }

    state.startedAt = performance.now() - state.pausedElapsed;
    state.animationFrame = requestAnimationFrame(animate);
  }

  resizeCanvas();

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      entries => {
        state.heroVisible = entries[0] ? entries[0].isIntersecting : true;

        if (state.heroVisible) {
          startAnimation();
        } else {
          stopAnimation();
          drawStaticScene();
        }
      },
      { threshold: 0.12 }
    );

    heroObserver.observe(hero);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
      drawStaticScene();
    } else {
      startAnimation();
    }
  });

  window.addEventListener('resize', resizeCanvas);

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', event => {
      if (event.matches) {
        stopAnimation();
        drawStaticScene();
      } else {
        startAnimation();
      }
    });
  }

  if (prefersReducedMotion.matches) {
    drawStaticScene();
  } else {
    startAnimation();
  }
}

// Start animation when page loads
window.addEventListener('load', () => {
  setTimeout(heroAnimation, prefersReducedMotion.matches ? 0 : 500);
  initHeroSignalBackground();
  updateActiveNav();
});

// === SMOOTH SCROLL FOR NAV LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (!href || href === '#' || this.classList.contains('skip-link')) {
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 60;
      const top = target.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    }
  });
});

// === SKILL TAG ANIMATION ===
const skillTags = document.querySelectorAll('.skill-tag');

if (prefersReducedMotion.matches || typeof IntersectionObserver === 'undefined') {
  skillTags.forEach(tag => {
    tag.style.opacity = '1';
    tag.style.transform = 'translateY(0)';
  });
} else {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'translateY(10px)';
          tag.style.transition = `opacity 0.3s ease ${i * 0.03}s, transform 0.3s ease ${i * 0.03}s`;
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, 50);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-tags').forEach(container => {
    skillObserver.observe(container);
  });
}
