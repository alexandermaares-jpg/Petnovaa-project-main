(() => {
  const gallery = document.querySelector('#petNovaFlipGallery');
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll('.flip-gallery-card')];
  const info = gallery.querySelector('#flipGalleryInfo');
  const counter = gallery.querySelector('#flipCurrent');
  const meta = gallery.querySelector('#flipMeta');
  const titleMain = gallery.querySelector('#flipTitleMain');
  const titleAccent = gallery.querySelector('#flipTitleAccent');
  const description = gallery.querySelector('#flipDescription');
  const features = gallery.querySelector('#flipFeatures');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const content = {
    profile: {
      meta: 'PET PROFILE',
      title: ['Everything about', 'your pet, in one place.'],
      description: 'Health details, helpful reminders and daily routines, all together.',
      features: ['Health & vaccine history', 'Helpful reminders', 'Daily notes']
    },
    clinic: {
      meta: 'VET CARE & HEALTH',
      title: ['Their care,', 'all in one place.'],
      description: 'Find a clinic nearby and keep appointments, vaccines and visit notes together.',
      features: ['Clinic finder', 'Vaccinations', 'Next appointment']
    },
    alert: {
      meta: 'PAW ALERT',
      title: ['If they get lost,', 'let others help.'],
      description: 'Share their last known location and contact nearby pet parents.',
      features: ['Location sharing', 'Lost pet alert', 'Community contacts']
    }
  };

  const order = cards.map((_, index) => index);
  let animating = false;
  let resizeFrame = 0;
  let touchStartX = null;
  let ignoreClickUntil = 0;

  const getSize = () => ({ width: gallery.clientWidth, height: gallery.clientHeight });

  const renderInfo = () => {
    const active = cards[order[0]];
    const item = content[active.dataset.card];
    meta.textContent = item.meta;
    titleMain.textContent = item.title[0];
    titleAccent.textContent = item.title[1];
    description.textContent = item.description;
    features.replaceChildren(...item.features.map(label => {
      const li = document.createElement('li');
      li.textContent = label;
      return li;
    }));
    counter.textContent = String(order[0] + 1).padStart(2, '0');
  };

  const layout = () => {
    const { width, height } = getSize();
    if (!width || !height) return;
    const gutter = Math.max(22, width * (width <= 700 ? .055 : .045));
    const positions = new Map();

    if (width <= 700) {
      const heroWidth = Math.min(190, width * .49, 250);
      const sideWidth = Math.min(106, width * .25, 116);
      const heroTop = Math.max(330, height * .35);
      const sideTop = heroTop + heroWidth * 2 - 160;
      order.forEach((index, slot) => {
        if (slot === 0) positions.set(index, {
          left: (width - heroWidth) / 2, top: heroTop, width: heroWidth, height: heroWidth * 2, z: 8, rotate: '0deg'
        });
        else if (slot === 1) positions.set(index, {
          left: Math.max(gutter, width / 2 - sideWidth * 1.12), top: sideTop + 15, width: sideWidth, height: sideWidth * 2, z: 4, rotate: '-2deg'
        });
        else positions.set(index, {
          left: Math.min(width - sideWidth - gutter, width / 2 + sideWidth * .12), top: sideTop - 14, width: sideWidth, height: sideWidth * 2, z: 3, rotate: '2deg'
        });
      });
    } else if (width <= 1100) {
      const heroWidth = Math.min(260, width * .24, (height - 260) / 2);
      const sideWidth = Math.min(184, width * .17, (height - 300) / 2);
      const heroLeft = width * .57 - heroWidth / 2;
      const heroTop = Math.max(330, height - heroWidth * 2 - 90);
      const sideTop = heroTop + heroWidth - sideWidth + 15;
      order.forEach((index, slot) => {
        if (slot === 0) positions.set(index, {
          left: heroLeft, top: heroTop, width: heroWidth, height: heroWidth * 2, z: 8, rotate: '0deg'
        });
        else if (slot === 1) positions.set(index, {
          left: Math.max(gutter, heroLeft - sideWidth * .68), top: sideTop + 20, width: sideWidth, height: sideWidth * 2, z: 4, rotate: '-2.5deg'
        });
        else positions.set(index, {
          left: Math.min(width - sideWidth - gutter, heroLeft + heroWidth - sideWidth * .32), top: sideTop - 18, width: sideWidth, height: sideWidth * 2, z: 3, rotate: '2.5deg'
        });
      });
    } else {
      const heroWidth = Math.min(360, width * .285, (height - 160) / 2);
      const sideWidth = Math.min(230, width * .185, (height - 230) / 2);
      const heroLeft = Math.min(width - heroWidth - gutter, width * .70 - heroWidth / 2);
      const heroTop = (height - heroWidth * 2) / 2 + Math.min(22, height * .025);
      const sideTop = (height - sideWidth * 2) / 2;
      order.forEach((index, slot) => {
        if (slot === 0) positions.set(index, {
          left: heroLeft, top: heroTop, width: heroWidth, height: heroWidth * 2, z: 8, rotate: '0deg'
        });
        else if (slot === 1) positions.set(index, {
          left: Math.max(gutter, heroLeft - sideWidth * .73), top: sideTop + 26, width: sideWidth, height: sideWidth * 2, z: 4, rotate: '-2.5deg'
        });
        else positions.set(index, {
          left: Math.min(width - sideWidth - gutter, heroLeft + heroWidth - sideWidth * .31), top: sideTop - 18, width: sideWidth, height: sideWidth * 2, z: 3, rotate: '2.2deg'
        });
      });
    }

    positions.forEach((box, index) => {
      const card = cards[index];
      card.style.left = `${box.left}px`;
      card.style.top = `${box.top}px`;
      card.style.width = `${box.width}px`;
      card.style.height = `${box.height}px`;
      card.style.zIndex = String(box.z);
      card.style.rotate = box.rotate;
      card.style.setProperty('--entry-delay', `${order.indexOf(index) * 110}ms`);
      card.dataset.slot = String(order.indexOf(index));
      card.setAttribute('aria-pressed', String(order[0] === index));
    });
    renderInfo();
  };

  const animateLayout = change => {
    if (animating) return;
    if (reducedMotion.matches || typeof Element.prototype.animate !== 'function') {
      change();
      layout();
      return;
    }

    const before = cards.map(card => card.getBoundingClientRect());
    change();
    layout();
    const after = cards.map(card => card.getBoundingClientRect());
    animating = true;
    let remaining = cards.length;
    cards.forEach((card, index) => {
      const from = before[index];
      const to = after[index];
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        remaining -= 1;
        if (!remaining) animating = false;
      };
      const animation = card.animate([
        { transformOrigin: 'top left', transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
        { transformOrigin: 'top left', transform: 'none' }
      ], { duration: 620, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' });
      animation.onfinish = () => { animation.cancel(); finish(); };
      animation.oncancel = finish;
    });
  };

  const select = index => {
    if (animating || index === order[0]) return;
    animateLayout(() => {
      const slot = order.indexOf(index);
      [order[0], order[slot]] = [order[slot], order[0]];
    });
  };


  cards.forEach((card, index) => card.addEventListener('click', () => {
    if (performance.now() < ignoreClickUntil) return;
    select(index);
  }));

  gallery.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touchStartX = event.clientX;
  }, { passive: true });
  gallery.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch' || touchStartX === null) return;
    const delta = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 54) return;
    ignoreClickUntil = performance.now() + 450;
    const nextSlot = delta < 0 ? 1 : order.length - 1;
    select(order[nextSlot]);
  }, { passive: true });

  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      select(order[1]);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(order[order.length - 1]);
    }
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { if (!animating) layout(); });
  });

  layout();
  requestAnimationFrame(() => gallery.classList.add('is-ready'));
  window.setTimeout(() => gallery.classList.add('is-settled'), 1050);
})();
