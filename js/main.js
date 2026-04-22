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

// Start animation when page loads
window.addEventListener('load', () => {
  setTimeout(heroAnimation, 500);
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
