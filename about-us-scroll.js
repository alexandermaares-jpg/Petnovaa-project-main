(() => {
  const section = document.querySelector('.about-scroll-hero');
  const stage = section?.querySelector('.about-scroll-stage');
  if (!section || !stage) return;

  let frame = 0;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const update = () => {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / travel, 0, 1);
    const mobile = window.innerWidth <= 760;
    const startWidth = Math.min(mobile ? window.innerWidth * .76 : 340, window.innerWidth * .9);
    const endWidth = Math.min(window.innerWidth * .94, mobile ? 860 : 1180);
    const startHeight = Math.min(mobile ? 390 : 410, window.innerHeight * .62);
    const endHeight = window.innerHeight * (mobile ? .76 : .78);
    const width = startWidth + (endWidth - startWidth) * progress;
    const height = startHeight + (endHeight - startHeight) * progress;
    const messageProgress = clamp((progress - .63) / .28, 0, 1);
    const titleShift = progress * Math.min(window.innerWidth * .36, 420);

    stage.style.setProperty('--about-progress', progress.toFixed(3));
    stage.style.setProperty('--about-backdrop-opacity', (1 - progress * .84).toFixed(3));
    stage.style.setProperty('--about-media-width', `${width.toFixed(1)}px`);
    stage.style.setProperty('--about-media-height', `${height.toFixed(1)}px`);
    stage.style.setProperty('--about-title-left', `${-titleShift.toFixed(1)}px`);
    stage.style.setProperty('--about-title-right', `${titleShift.toFixed(1)}px`);
    stage.style.setProperty('--about-message-opacity', messageProgress.toFixed(3));
    stage.style.setProperty('--about-message-y', `${((1 - messageProgress) * 24).toFixed(1)}px`);
    stage.style.setProperty('--about-hint-opacity', (1 - clamp(progress / .25, 0, 1)).toFixed(3));
  };
  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
})();
