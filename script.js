document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const navHighlight = document.getElementById('navHighlight');
  const navbar = document.querySelector('.navbar');
  const darkBtnAll = document.querySelectorAll('#darkModeBtn');

  function moveHighlightTo(el) {
    if (!el || !navHighlight) return;
    const linksRect = el.parentNode.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const offsetX = r.left - linksRect.left;
    navHighlight.style.width = `${r.width}px`;
    navHighlight.style.transform = `translateX(${offsetX}px)`;
  }

  // Set initial active by path
  function initHighlightByPath() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    let matched = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (href === 'index.html' && path === '')) matched = link;
      if (href && path.endsWith(href)) matched = link;
    });
    if (!matched) matched = navLinks[0];
    navLinks.forEach(l => l.classList.remove('active'));
    matched.classList.add('active');
    moveHighlightTo(matched);
  }
  initHighlightByPath();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveHighlightTo(link);
    });
  });

  // Auto-highlight by section intersection (if page has sections with ids)
  const allSections = document.querySelectorAll('main section, header.sub-hero, header.hero');
  if (allSections.length) {
    const observerOptions = { root: null, rootMargin: '-30% 0px -40% 0px', threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (!id) {
            // if no id (like hero/sub-hero), fallback to home link when on index.html
            const path = window.location.pathname.split('/').pop() || 'index.html';
            if (path === 'index.html' || path === '') {
              navLinks.forEach(l => l.classList.remove('active'));
              const home = document.querySelector('.nav-link[href="index.html"]') || document.querySelector('.nav-link');
              if (home) { home.classList.add('active'); moveHighlightTo(home); }
            }
            return;
          }
          const activeLink = document.querySelector(`.nav-link[href$="#${id}"], .nav-link[href*="${id}"]`);
          if (activeLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            activeLink.classList.add('active');
            moveHighlightTo(activeLink);
          }
        }
      });
    }, observerOptions);
    allSections.forEach(s => obs.observe(s));
  }

  // Navbar shrink on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Dark mode toggle (persist)
  function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    darkBtnAll.forEach(b => b.textContent = isDark ? '🌞' : '🌙');
  }
  const saved = localStorage.getItem('site-dark') === 'true';
  setTheme(saved);
  darkBtnAll.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = !document.body.classList.contains('dark');
      localStorage.setItem('site-dark', next);
      setTheme(next);
    });
  });

  // reposition highlight on resize/load
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) moveHighlightTo(active);
  });
  window.addEventListener('load', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) moveHighlightTo(active);
  });
});