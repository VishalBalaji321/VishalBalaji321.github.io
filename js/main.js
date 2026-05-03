// === NAVIGATION ===
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(item => item.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

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

  // Show boot lines sequentially
  for (const line of bootLines) {
    line.style.opacity = '1';
    await new Promise(r => setTimeout(r, 150));
  }

  await new Promise(r => setTimeout(r, 300));

  // Type the name
  if (heroName) {
    heroName.textContent = '';
    await typeWriter(heroName, 'Vishal Balaji', 50);
  }

  await new Promise(r => setTimeout(r, 200));

  // Type the title
  if (heroTitle) {
    heroTitle.textContent = '';
    await typeWriter(heroTitle, 'Cloud Backend Engineer | Autonomous Systems', 25);
  }

  await new Promise(r => setTimeout(r, 300));

  // Fade in tagline
  const tagline = document.querySelector('.hero-tagline');
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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
  const anchorDefsDesktop = [
    { key: 'factory', angle: -2.38, radiusX: 1.1, radiusY: 0.78, size: 8, laneCurve: -0.28 },
    { key: 'cloud', angle: -0.76, radiusX: 1.12, radiusY: 0.76, size: 8.4, laneCurve: 0.3 },
    { key: 'vehicle', angle: 2.4, radiusX: 1.14, radiusY: 0.88, size: 7.6, laneCurve: 0.24 },
    { key: 'monitor', angle: 0.82, radiusX: 1.12, radiusY: 0.86, size: 7.4, laneCurve: -0.24 }
  ];
  const anchorDefsMobile = [
    { key: 'factory', angle: -2.32, radiusX: 1.02, radiusY: 0.76, size: 7.4, laneCurve: -0.24 },
    { key: 'cloud', angle: -0.82, radiusX: 1.04, radiusY: 0.74, size: 7.8, laneCurve: 0.26 },
    { key: 'vehicle', angle: 2.34, radiusX: 1.06, radiusY: 0.82, size: 7.1, laneCurve: 0.21 },
    { key: 'monitor', angle: 0.88, radiusX: 1.04, radiusY: 0.8, size: 6.9, laneCurve: -0.21 }
  ];
  const laneDefs = [
    { from: 'center', to: 'factory', curve: -0.28, alpha: 0.075, dashed: false },
    { from: 'center', to: 'cloud', curve: 0.3, alpha: 0.075, dashed: false },
    { from: 'center', to: 'vehicle', curve: 0.24, alpha: 0.07, dashed: false },
    { from: 'center', to: 'monitor', curve: -0.24, alpha: 0.07, dashed: false }
  ];
  const flowDefsDesktop = [
    { from: 'center', to: 'factory', curve: -0.28, speed: 0.055, phase: 0.12, size: 1.95, alpha: 0.5 },
    { from: 'center', to: 'cloud', curve: 0.3, speed: 0.066, phase: 0.34, size: 2.05, alpha: 0.56 },
    { from: 'center', to: 'vehicle', curve: 0.24, speed: 0.06, phase: 0.58, size: 1.95, alpha: 0.52 },
    { from: 'center', to: 'monitor', curve: -0.24, speed: 0.05, phase: 0.82, size: 1.85, alpha: 0.48 }
  ];
  const flowDefsMobile = [
    { from: 'center', to: 'factory', curve: -0.24, speed: 0.052, phase: 0.1, size: 1.95, alpha: 0.52 },
    { from: 'center', to: 'cloud', curve: 0.26, speed: 0.06, phase: 0.36, size: 2, alpha: 0.56 },
    { from: 'center', to: 'vehicle', curve: 0.21, speed: 0.056, phase: 0.62, size: 1.95, alpha: 0.52 },
    { from: 'center', to: 'monitor', curve: -0.21, speed: 0.048, phase: 0.84, size: 1.8, alpha: 0.46 }
  ];

  function getAnchorDefs() {
    return state.compact ? anchorDefsMobile : anchorDefsDesktop;
  }

  function getFlowDefs() {
    return state.compact ? flowDefsMobile : flowDefsDesktop;
  }

  function getAnchorPosition(definition) {
    return {
      x: state.centerX + Math.cos(definition.angle) * state.baseRadius * definition.radiusX,
      y: state.centerY + Math.sin(definition.angle) * state.baseRadius * definition.radiusY
    };
  }

  function getNetworkNodes() {
    const anchors = getAnchorDefs();
    const nodes = {
      center: { x: state.centerX, y: state.centerY }
    };

    anchors.forEach(definition => {
      nodes[definition.key] = getAnchorPosition(definition);
    });

    return { anchors, nodes };
  }

  function angleDelta(angleA, angleB) {
    const delta = (angleA - angleB + Math.PI) % (Math.PI * 2) - Math.PI;
    return Math.abs(delta);
  }

  function getQuadraticControl(start, end, curve) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const midpointX = (start.x + end.x) / 2;
    const midpointY = (start.y + end.y) / 2;

    return {
      x: midpointX + normalX * state.baseRadius * curve,
      y: midpointY + normalY * state.baseRadius * curve
    };
  }

  function getQuadraticPoint(start, control, end, t) {
    const mt = 1 - t;

    return {
      x: mt * mt * start.x + 2 * mt * t * control.x + t * t * end.x,
      y: mt * mt * start.y + 2 * mt * t * control.y + t * t * end.y
    };
  }

  function drawLane(start, end, curve, alpha, dashed = false) {
    const control = getQuadraticControl(start, end, curve);

    context.save();
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.quadraticCurveTo(control.x, control.y, end.x, end.y);

    if (dashed) {
      const dash = Math.max(6, state.baseRadius * 0.04);
      context.setLineDash([dash, dash * 1.3]);
    }

    context.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
    context.lineWidth = 1;
    context.lineCap = 'round';
    context.stroke();
    context.restore();
  }

  function drawOrbit(radiusFactor, alpha, lineWidth, dashed = false) {
    context.save();
    context.beginPath();
    context.ellipse(state.centerX, state.centerY, state.baseRadius * radiusFactor, state.baseRadius * radiusFactor, 0, 0, Math.PI * 2);

    if (dashed) {
      const dash = Math.max(6, state.baseRadius * 0.05);
      context.setLineDash([dash, dash * 1.25]);
    }

    context.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
    context.lineWidth = lineWidth;
    context.stroke();
    context.restore();
  }

  function drawArc(radiusFactor, startAngle, endAngle, alpha, lineWidth) {
    context.save();
    context.beginPath();
    context.arc(state.centerX, state.centerY, state.baseRadius * radiusFactor, startAngle, endAngle);
    context.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.stroke();
    context.restore();
  }

  function drawCrosshair() {
    const length = state.baseRadius * 1.14;

    context.save();
    context.strokeStyle = 'rgba(0, 255, 65, 0.028)';
    context.lineWidth = 1;
    context.setLineDash([8, 14]);
    context.beginPath();
    context.moveTo(state.centerX - length, state.centerY);
    context.lineTo(state.centerX + length, state.centerY);
    context.moveTo(state.centerX, state.centerY - length);
    context.lineTo(state.centerX, state.centerY + length);
    context.stroke();
    context.restore();
  }

  function drawCenterHub(time) {
    const pulse = 0.88 + 0.08 * Math.sin(time * 1.4);

    context.save();
    context.beginPath();
    context.arc(state.centerX, state.centerY, state.baseRadius * 0.12 * pulse, 0, Math.PI * 2);
    context.fillStyle = 'rgba(150, 255, 184, 0.13)';
    context.shadowColor = 'rgba(0, 255, 65, 0.18)';
    context.shadowBlur = state.compact ? 10 : 14;
    context.fill();

    context.beginPath();
    context.arc(state.centerX, state.centerY, state.baseRadius * 0.18, 0, Math.PI * 2);
    context.strokeStyle = 'rgba(0, 255, 65, 0.085)';
    context.lineWidth = 1.2;
    context.stroke();

    context.beginPath();
    context.arc(state.centerX, state.centerY, state.baseRadius * 0.04, 0, Math.PI * 2);
    context.fillStyle = 'rgba(170, 255, 196, 0.64)';
    context.fill();
    context.restore();
  }

  function drawPacket(flow, time, nodes) {
    const start = nodes[flow.from];
    const end = nodes[flow.to];
    const control = getQuadraticControl(start, end, flow.curve);
    const t = (time * flow.speed + flow.phase) % 1;
    const head = getQuadraticPoint(start, control, end, t);
    const tail = getQuadraticPoint(start, control, end, Math.max(0, t - 0.035));

    context.save();
    context.beginPath();
    context.moveTo(tail.x, tail.y);
    context.lineTo(head.x, head.y);
    context.strokeStyle = `rgba(120, 255, 170, ${flow.alpha})`;
    context.lineWidth = state.compact ? 1.35 : 1.5;
    context.lineCap = 'round';
    context.stroke();

    context.beginPath();
    context.arc(head.x, head.y, flow.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(170, 255, 196, ${Math.min(0.76, flow.alpha + 0.08)})`;
    context.shadowColor = 'rgba(0, 255, 65, 0.22)';
    context.shadowBlur = state.compact ? 6 : 8;
    context.fill();
    context.restore();
  }

  function drawAnchorGlyph(definition, position, time) {
    context.save();
    context.translate(position.x, position.y);
    context.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    context.fillStyle = 'rgba(0, 255, 65, 0.07)';
    context.lineWidth = 1;

    if (definition.key === 'factory') {
      const box = definition.size * 1.45;
      context.beginPath();
      context.moveTo(-box, -box * 0.45);
      context.lineTo(-box, -box);
      context.lineTo(-box * 0.45, -box);
      context.moveTo(box * 0.45, -box);
      context.lineTo(box, -box);
      context.lineTo(box, -box * 0.45);
      context.moveTo(-box, box * 0.45);
      context.lineTo(-box, box);
      context.lineTo(-box * 0.45, box);
      context.moveTo(box * 0.45, box);
      context.lineTo(box, box);
      context.lineTo(box, box * 0.45);
      context.stroke();
    } else if (definition.key === 'cloud') {
      const satellites = [
        { x: -definition.size * 0.95, y: definition.size * 0.2 },
        { x: 0, y: -definition.size * 0.72 },
        { x: definition.size * 0.95, y: definition.size * 0.2 }
      ];

      satellites.forEach(satellite => {
        context.beginPath();
        context.arc(satellite.x, satellite.y, definition.size * 0.28, 0, Math.PI * 2);
        context.fill();
      });
    } else if (definition.key === 'vehicle') {
      const angle = -0.28 + 0.12 * Math.sin(time * 1.1);
      const length = definition.size * 1.45;
      context.rotate(angle);
      context.beginPath();
      context.moveTo(length * 0.8, 0);
      context.lineTo(-length * 0.3, -length * 0.5);
      context.lineTo(-length * 0.12, 0);
      context.lineTo(-length * 0.3, length * 0.5);
      context.closePath();
      context.stroke();
    } else if (definition.key === 'monitor') {
      const radius = definition.size * 1.4;
      context.beginPath();
      context.arc(0, 0, radius, -0.7, 0.7);
      context.stroke();
      context.beginPath();
      context.arc(0, 0, radius * 0.64, -0.55, 0.55);
      context.stroke();
    }

    context.restore();
  }

  function drawAnchor(definition, position, time, sweepAngle) {
    const anchorAngle = Math.atan2(position.y - state.centerY, position.x - state.centerX);
    const sweepBoost = Math.max(0, 0.12 - angleDelta(anchorAngle, sweepAngle) * 0.12);
    const pulse = 0.46 + 0.06 * Math.sin(time * 1.2 + definition.angle * 1.5) + sweepBoost;

    context.save();
    context.beginPath();
    context.arc(position.x, position.y, definition.size * 2.1, 0, Math.PI * 2);
    context.strokeStyle = `rgba(0, 255, 65, ${Math.min(0.11, pulse * 0.16).toFixed(3)})`;
    context.lineWidth = 1;
    context.stroke();

    context.beginPath();
    context.arc(position.x, position.y, definition.size, 0, Math.PI * 2);
    context.fillStyle = 'rgba(160, 255, 190, 0.5)';
    context.shadowColor = 'rgba(0, 255, 65, 0.2)';
    context.shadowBlur = state.compact ? 8 : 10;
    context.fill();

    context.beginPath();
    context.arc(position.x, position.y, definition.size * 0.36, 0, Math.PI * 2);
    context.fillStyle = 'rgba(10, 10, 10, 0.85)';
    context.fill();
    context.restore();

    drawAnchorGlyph(definition, position, time);
  }

  function drawSweep(time) {
    const sweepAngle = -Math.PI / 2 + time * 0.28;
    const sweepWidth = state.compact ? 0.16 : 0.2;
    const radius = state.baseRadius * 1.14;
    const gradient = context.createRadialGradient(state.centerX, state.centerY, radius * 0.12, state.centerX, state.centerY, radius);

    gradient.addColorStop(0, 'rgba(0, 255, 65, 0.024)');
    gradient.addColorStop(0.72, 'rgba(0, 255, 65, 0.014)');
    gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');

    context.save();
    context.beginPath();
    context.moveTo(state.centerX, state.centerY);
    context.arc(state.centerX, state.centerY, radius, sweepAngle - sweepWidth, sweepAngle);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    context.moveTo(state.centerX, state.centerY);
    context.lineTo(state.centerX + Math.cos(sweepAngle) * radius, state.centerY + Math.sin(sweepAngle) * radius);
    context.strokeStyle = 'rgba(110, 255, 160, 0.09)';
    context.lineWidth = state.compact ? 1 : 1.1;
    context.stroke();
    context.restore();
  }

  function drawPulseRing(time, offset, alpha) {
    const phase = (time * 0.18 + offset) % 1;
    const radius = state.baseRadius * (0.34 + phase * 0.82);
    const pulseAlpha = alpha * (1 - phase);

    context.save();
    context.beginPath();
    context.arc(state.centerX, state.centerY, radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(0, 255, 65, ${pulseAlpha.toFixed(3)})`;
    context.lineWidth = 1;
    context.stroke();
    context.restore();
  }

  function drawScene(time) {
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    context.clearRect(0, 0, state.width, state.height);

    const glow = context.createRadialGradient(
      state.centerX,
      state.centerY,
      0,
      state.centerX,
      state.centerY,
      Math.max(state.width, state.height) * 0.38
    );
    glow.addColorStop(0, 'rgba(0, 255, 65, 0.06)');
    glow.addColorStop(0.55, 'rgba(0, 255, 65, 0.02)');
    glow.addColorStop(1, 'rgba(0, 255, 65, 0)');
    context.fillStyle = glow;
    context.fillRect(0, 0, state.width, state.height);

    const { anchors, nodes } = getNetworkNodes();
    const sweepAngle = -Math.PI / 2 + time * 0.28;

    drawSweep(time);
    drawPulseRing(time, 0.14, 0.045);
    drawCrosshair();
    drawOrbit(0.46, 0.028, 1);
    drawOrbit(0.82, 0.05, 1, true);
    drawOrbit(1.12, 0.04, 1);
    drawArc(0.82, time * 0.18, time * 0.18 + 0.58, 0.1, 1.05);
    drawArc(1.12, time * -0.14 + 1.2, time * -0.14 + 1.72, 0.08, 1.05);
    drawCenterHub(time);

    laneDefs.forEach(lane => {
      drawLane(nodes[lane.from], nodes[lane.to], lane.curve, lane.alpha, lane.dashed);
    });

    getFlowDefs().forEach(flow => {
      drawPacket(flow, time, nodes);
    });

    anchors.forEach(definition => {
      drawAnchor(definition, nodes[definition.key], time, sweepAngle);
    });
  }

  function drawStaticScene() {
    drawScene(8.4);
  }

  function resizeCanvas() {
    const rect = hero.getBoundingClientRect();
    const terminalRect = terminal ? terminal.getBoundingClientRect() : null;

    state.width = rect.width;
    state.height = rect.height;
    state.dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    state.compact = window.innerWidth <= 768;

    if (!terminalRect) {
      state.centerX = state.width * 0.5;
      state.centerY = state.height * 0.48;
      state.baseRadius = Math.min(state.width, state.height) * (state.compact ? 0.27 : 0.3);
    } else if (state.compact) {
      state.centerX = terminalRect.left - rect.left + terminalRect.width / 2;
      state.centerY = terminalRect.top - rect.top + terminalRect.height * 0.46;
      state.baseRadius = Math.min(state.width * 0.46, Math.max(terminalRect.width, terminalRect.height) * 0.68);
    } else {
      state.centerX = terminalRect.left - rect.left + terminalRect.width / 2;
      state.centerY = terminalRect.top - rect.top + terminalRect.height / 2;
      state.baseRadius = Math.min(state.width * 0.31, Math.max(terminalRect.width, terminalRect.height) * 0.74);
    }

    canvas.width = Math.max(1, Math.round(state.width * state.dpr));
    canvas.height = Math.max(1, Math.round(state.height * state.dpr));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;

    if (reducedMotion.matches || !state.animationFrame) {
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
    if (reducedMotion.matches || document.hidden || !state.heroVisible || state.animationFrame) {
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

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        stopAnimation();
        drawStaticScene();
      } else {
        startAnimation();
      }
    });
  }

  if (reducedMotion.matches) {
    drawStaticScene();
  } else {
    startAnimation();
  }
}

// Start animation when page loads
window.addEventListener('load', () => {
  setTimeout(heroAnimation, 500);
  initHeroSignalBackground();
});

// === SMOOTH SCROLL FOR NAV LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 60;
      const top = target.offsetTop - offset;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  });
});

// === SKILL TAG ANIMATION ===
const skillTags = document.querySelectorAll('.skill-tag');
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
