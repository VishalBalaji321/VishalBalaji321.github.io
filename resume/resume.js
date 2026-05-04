const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const printButton = document.getElementById('print-resume');

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

if (printButton) {
  printButton.addEventListener('click', () => {
    window.print();
  });
}
