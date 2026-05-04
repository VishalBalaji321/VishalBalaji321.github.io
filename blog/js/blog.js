function initNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) {
    return;
  }

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

function initTagFilters() {
  const filterContainer = document.querySelector('.tag-filters');
  const cards = [...document.querySelectorAll('.post-card')];
  const emptyState = document.querySelector('.no-posts');

  if (!filterContainer || cards.length === 0) {
    return;
  }

  filterContainer.addEventListener('click', event => {
    const pill = event.target.closest('.tag-pill');

    if (!pill) {
      return;
    }

    const tag = pill.dataset.tag || 'all';

    filterContainer.querySelectorAll('.tag-pill').forEach(button => {
      const isActive = button === pill;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    let visibleCount = 0;

    cards.forEach(card => {
      const cardTags = (card.dataset.tags || '').toLowerCase().split(/\s+/).filter(Boolean);
      const isVisible = tag === 'all' || cardTags.includes(tag.toLowerCase());
      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  });
}

function initProgressBar() {
  const bar = document.getElementById('reading-progress');

  if (!bar) {
    return;
  }

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initTagFilters();
  initProgressBar();
});
