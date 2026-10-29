(() => {
  const scene = document.querySelector('.values-scroll-scene');
  const card = scene?.querySelector('.pet-map-card');
  const heading = scene?.querySelector('.values-copy');
  if (!scene || !card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frame = 0;
  const update = () => {
    frame = 0;
    const bounds = scene.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / Math.max(window.innerHeight, bounds.height)));
    const isMobile = window.innerWidth <= 768;
    const startScale = isMobile ? 0.7 : 1.05;
    const endScale = isMobile ? 0.9 : 1;
    const scale = startScale + (endScale - startScale) * progress;

    card.style.transform = `translateY(${-100 * progress}px) rotateX(${20 * (1 - progress)}deg) scale(${scale})`;
    if (heading) heading.style.translate = `0 ${-100 * progress}px`;
  };
  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
})();
