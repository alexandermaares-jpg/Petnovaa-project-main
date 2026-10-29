(() => {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;

  const icons = {
    'index.html#inicio': '<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
    'about-us.html': '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0M19 8h3m-1.5-1.5v3"/></svg>',
    'functions.html': '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
    'contact.html': '<svg viewBox="0 0 24 24"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.5 8.5 0 0 1-3.5-.8L4 20l1.4-3.5A7 7 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.8 8 7z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>',
    'privacy-terms.html': '<svg viewBox="0 0 24 24"><path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>'
  };

  const links = [...nav.querySelectorAll('a')];
  links.forEach(link => {
    const icon = document.createElement('span');
    icon.className = 'nav-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = icons[link.getAttribute('href')] || '';
    link.prepend(icon);
  });

  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  nav.prepend(indicator);

  const active = links.find(link => link.hasAttribute('aria-current'))
    || links.find(link => link.getAttribute('href') === 'index.html#inicio')
    || links[0];

  function moveTo(link) {
    if (!link) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.height = `${link.offsetHeight}px`;
    indicator.style.transform = `translate3d(${link.offsetLeft}px, ${link.offsetTop}px, 0)`;
    indicator.classList.add('is-ready');
  }

  links.forEach(link => {
    link.addEventListener('pointerenter', () => moveTo(link));
    link.addEventListener('focus', () => moveTo(link));
    link.addEventListener('pointerleave', () => moveTo(active));
    link.addEventListener('blur', () => moveTo(active));
  });

  active.classList.add('is-active');
  requestAnimationFrame(() => requestAnimationFrame(() => moveTo(active)));
  window.addEventListener('resize', () => moveTo(active), { passive: true });
  new MutationObserver(() => requestAnimationFrame(() => moveTo(active)))
    .observe(nav, { attributes: true, attributeFilter: ['class'] });
})();