const menu = document.querySelector('.menu');
const nav = document.querySelector('.navlinks');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 350);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.navlinks a[href^="#"]')];
if ('IntersectionObserver' in window && sections.length && navLinks.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach(section => observer.observe(section));
}
