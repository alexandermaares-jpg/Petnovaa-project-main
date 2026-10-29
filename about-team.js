(() => {
  const section = document.querySelector('.about-team');
  if (!section) return;
  section.querySelectorAll('.team-arc-copy').forEach((element) => {
    const text = element.textContent.trim();
    const arc = element.classList.contains('team-arc-title') ? 14 : 6;
    element.setAttribute('aria-label', text);
    element.replaceChildren(...Array.from(text).map((character, index) => {
      const position = text.length > 1 ? (index / (text.length - 1)) * 2 - 1 : 0;
      const letter = document.createElement('span');
      letter.setAttribute('aria-hidden', 'true');
      letter.style.setProperty('--arc-y', `${(position * position * arc).toFixed(1)}px`);
      letter.textContent = character === ' ' ? '\u00a0' : character;
      return letter;
    }));
  });

  const orbit = section.querySelector('.team-orbit');
  const people = [...section.querySelectorAll('.team-person')];
  const name = section.querySelector('#team-name');
  const role = section.querySelector('#team-role');
  const count = section.querySelector('#team-count');
  const profile = section.querySelector('.team-profile');
  const previous = section.querySelector('.team-prev');
  const next = section.querySelector('.team-next');
  if (!orbit || !people.length || !name || !role || !count || !previous || !next) return;

  let active = 0;
  let timer = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const render = () => {
    const mobile = window.innerWidth <= 760;
    const gap = mobile ? Math.min(112, window.innerWidth * .29) : Math.min(164, orbit.clientWidth * .32);
    people.forEach((person, index) => {
      const offset = (index - active + people.length) % people.length;
      const isActive = offset === 0;
      const isLeft = offset === people.length - 1;
      const isRight = offset === 1;
      person.classList.toggle('is-active', isActive);
      person.setAttribute('aria-pressed', String(isActive));

      if (isActive) {
        person.style.zIndex = '3';
        person.style.opacity = '1';
        person.style.pointerEvents = 'auto';
        person.style.transform = 'translate(-50%,-50%) scale(1) rotateY(0deg)';
      } else if (isLeft || isRight) {
        person.style.zIndex = '2';
        person.style.opacity = '1';
        person.style.pointerEvents = 'auto';
        person.style.transform = `translate(calc(-50% ${isLeft ? '-' : '+'} ${gap}px),calc(-50% - 14px)) scale(.76) rotateY(${isLeft ? 14 : -14}deg)`;
      } else {
        person.style.zIndex = '1';
        person.style.opacity = '0';
        person.style.pointerEvents = 'none';
        person.style.transform = 'translate(-50%,-50%) scale(.58) rotateY(0deg)';
      }
      person.tabIndex = isActive || isLeft || isRight ? 0 : -1;
    });

    const person = people[active];
    name.textContent = person.dataset.name;
    role.textContent = person.dataset.role;
    count.firstChild.textContent = `${String(active + 1).padStart(2, '0')} `;
    if (profile) {
      profile.classList.remove('is-changing');
      requestAnimationFrame(() => profile.classList.add('is-changing'));
    }
  };

  const go = (direction) => {
    active = (active + direction + people.length) % people.length;
    render();
  };
  const stop = () => {
    window.clearInterval(timer);
    timer = 0;
  };
  const start = () => {
    if (reducedMotion || timer) return;
    timer = window.setInterval(() => go(1), 5000);
  };

  people.forEach((person, index) => person.addEventListener('click', () => {
    active = index;
    render();
    stop();
  }));
  previous.addEventListener('click', () => { go(-1); stop(); });
  next.addEventListener('click', () => { go(1); stop(); });
  orbit.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  });
  section.addEventListener('pointerenter', stop);
  section.addEventListener('pointerleave', start);
  section.addEventListener('focusin', stop);
  section.addEventListener('focusout', (event) => {
    if (!section.contains(event.relatedTarget)) start();
  });
  window.addEventListener('resize', render, { passive: true });

  render();
  start();
})();
