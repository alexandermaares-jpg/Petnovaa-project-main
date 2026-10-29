(() => {
  const section = document.querySelector('#petmoments');
  const scene = section?.querySelector('.pm-sticky-scene');
  const stage = section?.querySelector('.pm-stage');
  const heading = section?.querySelector('.pm-heading');

  if (!section || !scene || !stage || !heading) return;

  const photos = [
    ['img/gato 2.jpg', 'A cat relaxing at home', 'center 52%'],
    ['img/periquito 1.jpg', 'A yellow budgie perched on a hand', 'center 48%'],
    ['img/perro 2.jpg', 'A dog enjoying a quiet moment', 'center 55%'],
    ['img/perro 3.jpg', 'A dog spending time with its family', 'center 55%'],
    ['img/perro 6.jpg', 'A dog looking curiously toward the camera', 'center 55%'],
    ['img/pez 1.jpg', 'Goldfish swimming in an aquarium', 'center 48%'],
    ['img/hamster 1.jpg', 'A hamster exploring its home', 'center 50%'],
    ['img/conejo 2.jpg', 'A rabbit enjoying a quiet moment', 'center 50%']
  ];

  const cards = photos.map(([src, alt, position], index) => {
    const angle = (index * Math.PI * 2) / photos.length;
    const node = document.createElement('div');
    node.className = 'pm-card';
    node.style.zIndex = String(index + 1);

    const imageFrame = document.createElement('div');
    imageFrame.className = 'pm-card-frame';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.objectPosition = position;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    imageFrame.append(img);
    node.append(imageFrame);
    stage.append(node);

    node.addEventListener('pointerenter', () => {
      if (stage.classList.contains('is-spread')) node.classList.add('is-hovered');
    });
    node.addEventListener('pointerleave', () => node.classList.remove('is-hovered'));

    return {
      node,
      angle,
      linearX: (index - photos.length / 2) * 5,
      linearY: (index - photos.length / 2) * 2,
      linearRotate: (index - photos.length / 2) * 2
    };
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isMobile = false;
  let rawProgress = 0;
  let targetProgress = 0;
  let progress = 0;
  let progressVelocity = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerVelocityX = 0;
  let pointerVelocityY = 0;
  let frame = 0;
  let lastFrameTime = 0;
  let spreadActive = false;

  const clamp = value => Math.max(0, Math.min(1, value));
  const detectLayout = () => {
    isMobile = window.innerWidth < 768;
    schedule();
  };

  const readScroll = () => {
    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const distance = Math.max(1, section.offsetHeight - viewport);
    rawProgress = clamp(-rect.top / distance);
    targetProgress = clamp((rawProgress - 0.1) / 0.8);
    schedule();
  };

  const readPointer = event => {
    if (!spreadActive || reducedMotion.matches) return;
    pointerTargetX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerTargetY = (event.clientY / window.innerHeight - 0.5) * 2;
    schedule();
  };

  const render = timestamp => {
    frame = 0;
    const delta = lastFrameTime ? Math.min(40, timestamp - lastFrameTime) : 16.67;
    lastFrameTime = timestamp;
    // Time-based damping keeps the motion equally smooth at different refresh rates.
    const dt = delta / 1000;
    const targetPointerX = spreadActive && !reducedMotion.matches ? pointerTargetX : 0;
    const targetPointerY = spreadActive && !reducedMotion.matches ? pointerTargetY : 0;

    if (reducedMotion.matches) {
      progress = targetProgress;
      progressVelocity = 0;
      pointerX = targetPointerX;
      pointerY = targetPointerY;
      pointerVelocityX = 0;
      pointerVelocityY = 0;
    } else {
      // Critically damped springs preserve momentum without overshooting.
      const progressOmega = 17;
      const progressAcceleration = (targetProgress - progress) * progressOmega * progressOmega - 2 * progressOmega * progressVelocity;
      progressVelocity += progressAcceleration * dt;
      progress += progressVelocity * dt;

      const pointerOmega = 14;
      const pointerAccelerationX = (targetPointerX - pointerX) * pointerOmega * pointerOmega - 2 * pointerOmega * pointerVelocityX;
      const pointerAccelerationY = (targetPointerY - pointerY) * pointerOmega * pointerOmega - 2 * pointerOmega * pointerVelocityY;
      pointerVelocityX += pointerAccelerationX * dt;
      pointerVelocityY += pointerAccelerationY * dt;
      pointerX += pointerVelocityX * dt;
      pointerY += pointerVelocityY * dt;
    }

    spreadActive = progress > 0.95;
    stage.classList.toggle('is-spread', spreadActive);

    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    cards.forEach(({ node, angle, linearX, linearY, linearRotate }, index) => {
      const total = cards.length;
      const radiusX = 35;
      const radiusY = 28;
      let targetX = Math.cos(angle - Math.PI / 2) * radiusX;
      let targetY = Math.sin(angle - Math.PI / 2) * radiusY;
      if (isMobile) {
        targetX *= 0.6;
        targetY *= 1.2;
      }

      const depth = 0.4 + (index / total) * 0.6;
      const x = linearX + (targetX - linearX) * ease - pointerX * 3 * depth * progress;
      const y = linearY + (targetY - linearY) * ease - pointerY * 3 * depth * progress;
      const targetRotate = (angle * 180) / Math.PI;
      const rotate = linearRotate + (targetRotate - linearRotate) * progress;
      const scale = 0.92 + (0.88 - 0.92) * progress;

      node.style.setProperty('--pm-x', x.toFixed(2) + 'vw');
      node.style.setProperty('--pm-y', y.toFixed(2) + 'vh');
      node.style.setProperty('--pm-rotate', rotate.toFixed(2) + 'deg');
      node.style.setProperty('--pm-scale', scale.toFixed(3));
      node.style.setProperty('--pm-hover-scale', (scale * 1.1).toFixed(3));
      node.style.width = (isMobile ? 43 : 21) + (isMobile ? 0 : -2 * progress) + 'vw';
      node.style.height = (isMobile ? 33 : 30) + (isMobile ? 0 : -3 * progress) + 'vh';
    });

    const textOpacity = 0.55 + progress * 0.45;
    heading.style.setProperty('--pm-text-opacity', textOpacity.toFixed(3));
    heading.style.setProperty('--pm-text-scale', (0.85 + progress * 0.15).toFixed(3));
    scene.style.setProperty('--pm-glow-scale', (0.85 + progress * 0.15).toFixed(3));

    if (
      Math.abs(targetProgress - progress) > 0.0005 || Math.abs(progressVelocity) > 0.002 ||
      Math.abs(targetPointerX - pointerX) > 0.005 || Math.abs(pointerVelocityX) > 0.01 ||
      Math.abs(targetPointerY - pointerY) > 0.005 || Math.abs(pointerVelocityY) > 0.01
    ) schedule();
    else {
      progress = targetProgress;
      progressVelocity = 0;
      pointerX = targetPointerX;
      pointerY = targetPointerY;
      pointerVelocityX = 0;
      pointerVelocityY = 0;
    }
  };

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.addEventListener('resize', () => {
    detectLayout();
    readScroll();
  }, { passive: true });
  window.addEventListener('pointermove', readPointer, { passive: true });
  reducedMotion.addEventListener?.('change', readScroll);
  detectLayout();
  readScroll();
})();





