(() => {
  const section = document.querySelector('[data-functions-hero]');
  if (!section) return;

  const center = section.querySelector('.functions-hero-center');
  const images = [...section.querySelectorAll('.functions-hero-image')];
  const transitionTitle = section.querySelector('.functions-hero-transition');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!center) return;

  if (reducedMotion) {
    center.style.clipPath = 'polygon(0 0,100% 0,100% 100%,0 100%)';
    center.style.backgroundSize = '100%';
    if (transitionTitle) transitionTitle.style.opacity = '1';
    return;
  }

  let frame = 0;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const update = () => {
    frame = 0;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const sectionScroll = Math.max(0, window.scrollY - sectionTop);
    const revealProgress = clamp(sectionScroll / 680, 0, 1);
    const zoomProgress = clamp(sectionScroll / 850, 0, 1);
    const inset = 25 * (1 - revealProgress);
    const fade = 1 - clamp((sectionScroll - 470) / 260, 0, 1);

    center.style.clipPath = `polygon(${inset}% ${inset}%,${100 - inset}% ${inset}%,${100 - inset}% ${100 - inset}%,${inset}% ${100 - inset}%)`;
    center.style.backgroundSize = `${170 - 70 * zoomProgress}%`;
    center.style.opacity = String(fade);

    images.forEach(image => {
      const rect = image.getBoundingClientRect();
      const start = Number(image.dataset.start) || 0;
      const end = Number(image.dataset.end) || 0;
      const range = Math.max(1, window.innerHeight + rect.height + end - start);
      const progress = clamp((window.innerHeight - start - rect.top) / range, 0, 1);
      const fadeProgress = clamp((progress - .75) / .25, 0, 1);
      const isLastImage = image === images[images.length - 1];
      const scale = isLastImage ? 1 + .14 * fadeProgress : 1 - .15 * fadeProgress;
      const y = start + (end - start) * progress;
      image.style.transform = `translate3d(0,${y}px,0) scale(${scale})`;
      image.style.opacity = String(1 - fadeProgress);
    });

    if (transitionTitle) {
      const titleProgress = clamp((sectionScroll - 500) / 180, 0, 1);
      transitionTitle.style.opacity = String(titleProgress);
      transitionTitle.style.transform = `translateY(${24 * (1 - titleProgress)}px)`;
    }
  };

  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
})();