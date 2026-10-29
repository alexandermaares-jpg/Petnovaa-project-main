(() => {
  const row = document.querySelector('.care-panels-row');
  if (!row) return;
  const section = row.closest('.care-panels');
  const heading = section?.querySelector('.care-panels-heading');
  const index = section?.querySelector('.care-panels-index');
  const panels = [...row.querySelectorAll('.care-panel')];
  const activate = panel => {
    panels.forEach(item => {
      const active = item === panel;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  };
  panels.forEach(panel => panel.addEventListener('click', () => activate(panel)));

  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frame = 0;
  const updateScrollEffect = () => {
    frame = 0;
    const bounds = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / Math.max(window.innerHeight, bounds.height)));
    const isMobile = window.innerWidth <= 768;
    const startScale = isMobile ? 0.7 : 1.05;
    const endScale = isMobile ? 0.9 : 1;
    const scale = startScale + (endScale - startScale) * progress;

    row.style.transform = `perspective(1000px) translateY(${-100 * progress}px) rotateX(${20 * (1 - progress)}deg) scale(${scale})`;
    if (index) index.style.transform = `translateY(${-100 * progress}px) scale(${scale})`;
    if (heading) heading.style.translate = `0 ${-100 * progress}px`;
  };
  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateScrollEffect);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  updateScrollEffect();
})();
