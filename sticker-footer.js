(() => {
  const oldFooter = document.querySelector('.site-footer');
  if (oldFooter) oldFooter.remove();
  if (document.querySelector('.sticker-slap-footer')) return;

  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = 'css/sticker-footer.css';
  document.head.appendChild(styleLink);

  const iconArt = {
    paw: '<svg viewBox="0 0 120 120" aria-hidden="true"><g stroke="#d8c5b2" stroke-width="15" stroke-linejoin="round"><ellipse cx="28" cy="34" rx="13" ry="18"/><ellipse cx="55" cy="23" rx="13" ry="18"/><ellipse cx="82" cy="29" rx="13" ry="18"/><ellipse cx="101" cy="49" rx="12" ry="16"/><path d="M18 79c0-17 14-29 31-29 11 0 17 8 24 8 8 0 13-7 22-5 14 4 19 20 11 33-7 11-21 10-34 15-18 8-33 13-45 4-8-6-11-16-9-26z"/></g><g fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"><ellipse cx="28" cy="34" rx="13" ry="18"/><ellipse cx="55" cy="23" rx="13" ry="18"/><ellipse cx="82" cy="29" rx="13" ry="18"/><ellipse cx="101" cy="49" rx="12" ry="16"/><path d="M18 79c0-17 14-29 31-29 11 0 17 8 24 8 8 0 13-7 22-5 14 4 19 20 11 33-7 11-21 10-34 15-18 8-33 13-45 4-8-6-11-16-9-26z"/></g><g fill="#7a4828" stroke="#724327" stroke-width="2"><ellipse cx="28" cy="34" rx="12" ry="17"/><ellipse cx="55" cy="23" rx="12" ry="17"/><ellipse cx="82" cy="29" rx="12" ry="17"/><ellipse cx="101" cy="49" rx="11" ry="15"/><path d="M18 79c0-17 14-29 31-29 11 0 17 8 24 8 8 0 13-7 22-5 14 4 19 20 11 33-7 11-21 10-34 15-18 8-33 13-45 4-8-6-11-16-9-26z"/></g></svg>',
    bone: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M27 28c-10-10-25-3-24 10 0 7 5 12 12 14l70 19c-1 8 5 16 14 16 13 0 18-16 8-24 10-10 3-25-10-24-6 0-11 4-13 9L32 29c-1-1-3-1-5-1z" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="16" stroke-linejoin="round"/><path d="M27 28c-10-10-25-3-24 10 0 7 5 12 12 14l70 19c-1 8 5 16 14 16 13 0 18-16 8-24 10-10 3-25-10-24-6 0-11 4-13 9L32 29c-1-1-3-1-5-1z" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><path d="M27 28c-10-10-25-3-24 10 0 7 5 12 12 14l70 19c-1 8 5 16 14 16 13 0 18-16 8-24 10-10 3-25-10-24-6 0-11 4-13 9L32 29c-1-1-3-1-5-1z" fill="#f2b65f" stroke="#bd7d38" stroke-width="3" stroke-linejoin="round"/></svg>',
    bowl: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M15 56h90l-8 39c-2 12-12 19-25 19H47c-13 0-23-7-25-19z" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="16" stroke-linejoin="round"/><path d="M15 56h90l-8 39c-2 12-12 19-25 19H47c-13 0-23-7-25-19z" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><path d="M15 56h90l-8 39c-2 12-12 19-25 19H47c-13 0-23-7-25-19z" fill="#ef604c" stroke="#b84b39" stroke-width="3"/><ellipse cx="60" cy="55" rx="46" ry="20" fill="#58a9c8" stroke="#536d75" stroke-width="5"/><g fill="#fff1d8"><circle cx="42" cy="52" r="3"/><circle cx="58" cy="46" r="3"/><circle cx="74" cy="53" r="3"/><circle cx="55" cy="61" r="2.5"/><circle cx="82" cy="46" r="2"/></g><g fill="#f5c778" stroke="#a45c3d" stroke-width="3"><circle cx="32" cy="83" r="5"/><circle cx="51" cy="99" r="5"/><circle cx="79" cy="98" r="5"/><circle cx="94" cy="80" r="5"/></g></svg>',
    house: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M13 54 60 14l47 40v53H13z" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="16" stroke-linejoin="round"/><path d="M13 54 60 14l47 40v53H13z" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><path d="M13 54 60 14l47 40v53H13z" fill="#ffdfa0" stroke="#bd7d38" stroke-width="3" stroke-linejoin="round"/><path d="M7 55 60 10l53 45" fill="none" stroke="#764526" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 107V76c0-10 6-16 14-16s14 6 14 16v31" fill="#72462f"/><rect x="84" y="23" width="10" height="25" rx="2" fill="#f1ad55"/></svg>',
    collar: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M21 30c22-17 56-17 78 0l-8 23c-18-12-44-12-62 0z" fill="none" stroke="#d8c5b2" stroke-width="24" stroke-linejoin="round"/><path d="M21 30c22-17 56-17 78 0l-8 23c-18-12-44-12-62 0z" fill="none" stroke="#fff" stroke-width="16" stroke-linejoin="round"/><path d="M21 30c22-17 56-17 78 0l-8 23c-18-12-44-12-62 0z" fill="none" stroke="#4f91ad" stroke-width="9" stroke-linejoin="round"/><path d="M60 53v17" stroke="#6a5140" stroke-width="4"/><path d="M60 67c-9 0-16 7-16 17v23l16 8 16-8V84c0-10-7-17-16-17z" fill="#f1b35b" stroke="#d8c5b2" stroke-width="12"/><path d="M60 67c-9 0-16 7-16 17v23l16 8 16-8V84c0-10-7-17-16-17z" fill="#ee6654" stroke="#fff" stroke-width="7"/><circle cx="60" cy="91" r="8" fill="#ffe2a2"/><path d="M56 91h8m-4-4v8" stroke="#5b473b" stroke-width="2.5" stroke-linecap="round"/></svg>',
    dog: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M31 42c-12-18-31-7-25 13l12 23-2 18c0 16 17 23 44 23s44-7 44-23l-2-18 12-23c6-20-13-31-25-13-16-9-42-9-58 0z" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="16" stroke-linejoin="round"/><path d="M31 42c-12-18-31-7-25 13l12 23-2 18c0 16 17 23 44 23s44-7 44-23l-2-18 12-23c6-20-13-31-25-13-16-9-42-9-58 0z" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><path d="M31 42c-12-18-31-7-25 13l12 23-2 18c0 16 17 23 44 23s44-7 44-23l-2-18 12-23c6-20-13-31-25-13-16-9-42-9-58 0z" fill="#e6ad68" stroke="#a8663e" stroke-width="3" stroke-linejoin="round"/><ellipse cx="38" cy="61" rx="10" ry="18" fill="#9d563c"/><ellipse cx="82" cy="61" rx="10" ry="18" fill="#9d563c"/><circle cx="47" cy="55" r="3.5" fill="#553d2d"/><circle cx="73" cy="55" r="3.5" fill="#553d2d"/><ellipse cx="60" cy="68" rx="7" ry="5" fill="#573d2f"/><path d="M60 73q0 9-8 9m8-9q0 9 8 9" fill="none" stroke="#573d2f" stroke-width="3" stroke-linecap="round"/><path d="M47 98q-5-12 0-20m26 20q5-12 0-20" fill="none" stroke="#b77748" stroke-width="4" stroke-linecap="round"/></svg>'
  };
  iconArt.paw = '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><g id="paw-shape"><ellipse cx="25" cy="47" rx="10" ry="15" transform="rotate(-27 25 47)"/><ellipse cx="47" cy="27" rx="10" ry="15" transform="rotate(-10 47 27)"/><ellipse cx="73" cy="27" rx="10" ry="15" transform="rotate(10 73 27)"/><ellipse cx="95" cy="47" rx="10" ry="15" transform="rotate(27 95 47)"/><path d="M60 101c-13 0-26-5-33-13-7-8-7-20 0-28 8-9 20-8 33 5 13-13 25-14 33-5 7 8 7 20 0 28-7 8-20 13-33 13z"/></g></defs><use href="#paw-shape" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="15"/><use href="#paw-shape" fill="#fff" stroke="#fff" stroke-width="8"/><use href="#paw-shape" fill="#7a4828" stroke="#7a4828" stroke-width="1.5"/></svg>';
  iconArt.bone = '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="bone-shape" d="M35 37C25 27 12 28 7 37 1 48 9 60 22 59 11 69 18 83 30 83c8 0 13-6 15-14h30c2 8 7 14 15 14 12 0 19-14 8-24 13 1 21-11 15-22-5-9-18-10-28 0-3 3-5 6-6 10H41c-1-4-3-7-6-10Z"/></defs><use href="#bone-shape" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="16" stroke-linejoin="round"/><use href="#bone-shape" fill="#fff" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><use href="#bone-shape" fill="#f2b65f" stroke="#bd7d38" stroke-width="3" stroke-linejoin="round"/></svg>';
  iconArt.bowl = '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M17 55h86l-9 40c-3 12-14 18-34 18s-31-6-34-18z" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="16" stroke-linejoin="round"/><path d="M17 55h86l-9 40c-3 12-14 18-34 18s-31-6-34-18z" fill="none" stroke="#fff" stroke-width="9" stroke-linejoin="round"/><path d="M17 55h86l-9 40c-3 12-14 18-34 18s-31-6-34-18z" fill="#5fa7bf" stroke="#526d76" stroke-width="3" stroke-linejoin="round"/><ellipse cx="60" cy="53" rx="45" ry="17" fill="#d8c5b2" stroke="#d8c5b2" stroke-width="15"/><ellipse cx="60" cy="53" rx="45" ry="17" fill="none" stroke="#fff" stroke-width="8"/><ellipse cx="60" cy="53" rx="41" ry="13" fill="#75c6dc" stroke="#526d76" stroke-width="3"/><path d="M37 52c7-5 12-5 19-1m9 4c8-5 13-5 19-1" fill="none" stroke="#e8f9ff" stroke-width="3" stroke-linecap="round"/><circle cx="47" cy="88" r="4" fill="#f5c778"/><circle cx="73" cy="96" r="4" fill="#f5c778"/></svg>';
  const stickers = [
    { x: 9, y: 29, cls: 'ssf-sticker--icon', aria: 'Paw print icon', art: iconArt.paw },
    { x: 29, y: 20, cls: 'ssf-sticker--icon', aria: 'Dog bone icon', art: iconArt.bone },
    { x: 45, y: 43, cls: 'ssf-sticker--icon', aria: 'Pet bowl icon', art: iconArt.bowl },
    { x: 61, y: 18, cls: 'ssf-sticker--icon', aria: 'Pet house icon', art: iconArt.house },
    { x: 76, y: 45, cls: 'ssf-sticker--icon', aria: 'Collar and tag icon', art: iconArt.collar },
    { x: 92, y: 37, cls: 'ssf-sticker--icon', aria: 'Dog icon', art: iconArt.dog },
  ];

  const SCRIPT = {
    p: [9.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 9L1.8 -5.6C2.4 -8.6 3.4 -10 5 -10C7 -10 8.2 -8 8.2 -5C8.2 -2 6.6 0 4.8 0C3.4 0 2.4 -.6 1.8 -1.6C2.4 -.6 3.4 0 4.8 0C6.6 0 7.8 -.8 9.6 -1'],
    e: [9.4, 'M0 -1C3.4 -2.4 8 -4.4 8 -7.6C8 -9.4 6.6 -10.4 4.8 -10.4C2.2 -10.4 .8 -7.8 .8 -5C.8 -1.8 2.6 0 5 0C6.8 0 8 -1 9.4 -1'],
    t: [6.6, 'M0 -1C1 -1.4 2 -6.8 2.2 -11.2L2.2 -3.2C2.2 -.8 4 -1 6.6 -1', 'M.2 -7.4L5.8 -7.4', 1],
    n: [9.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -1L1.8 -5.6C2.4 -8.6 3.4 -10 4.8 -10C6.4 -10 7.2 -9 7.2 -7L7.2 -3C7.2 -.8 8.2 -1 9.6 -1'],
    o: [9, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5C7.6 -7.8 6.1 -10 4.3 -10C6 -10 7.4 -9.2 9 -9', '', 1],
    v: [9, 'M0 -1C1.2 -1.6 1.6 -6 1.6 -9.6C1.6 -6 2.6 0 4.4 0C6.4 0 7.6 -6 7.6 -9.6C8 -9 8.4 -8.8 9 -8.8', '', 1],
    a: [10.2, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 -3C7.8 -.8 8.8 -1 10.2 -1'],
  };

  function scriptWord(text) {
    const sx = 1.22, track = 1;
    let x = 0, main = '', top = 0, bottom = 0, lift = true;
    const extra = [];
    const place = (d, dx) => { let i = 0; return d.replace(/-?\d*\.?\d+/g, n => { const value = Number(n); return String(i++ % 2 === 0 ? Math.round((value * sx + dx) * 100) / 100 : value); }); };
    for (const ch of text.toLowerCase()) {
      const glyph = SCRIPT[ch]; if (!glyph) continue;
      const d = place(glyph[1], x);
      main += lift ? d : 'L' + d.slice(1);
      if (glyph[2]) extra.push(place(glyph[2], x));
      const ys = (glyph[1] + (glyph[2] || '')).match(/-?\d*\.?\d+/g).map(Number).filter((_, i) => i % 2 === 1);
      top = Math.min(top, ...ys); bottom = Math.max(bottom, ...ys);
      lift = !!glyph[3]; x += glyph[0] * sx + track;
    }
    return { main, extra, width: x - track, top, bottom };
  }

  const footer = document.createElement('footer');
  footer.className = 'sticker-slap-footer';
  footer.setAttribute('aria-label', 'PETNOVA site footer');
  footer.innerHTML = `
    <div class="ssf-panel">
      <div class="ssf-cols">
        <nav class="ssf-col" aria-label="Explore PETNOVA"><h2 class="ssf-tag">explore petnova</h2><div class="ssf-big"><a class="ssf-line" href="index.html#inicio">home</a><a class="ssf-line" href="about-us.html">about us</a><a class="ssf-line" href="functions.html">functions</a></div></nav>
        <nav class="ssf-col" aria-label="PETNOVA pet care"><h2 class="ssf-tag">pet care</h2><div class="ssf-big"><a class="ssf-line" href="functions.html">wellness tools</a><a class="ssf-line" href="functions.html">care reminders</a></div><p class="ssf-note">Helpful tools for happier, healthier pets.</p></nav>
        <div class="ssf-col"><h2 class="ssf-tag">contact</h2><div class="ssf-big"><a class="ssf-line" href="contact.html#contacto">get in touch</a><a class="ssf-line" href="contact.html#contacto">share your story</a></div><p class="ssf-note">Questions, ideas, or a story to share? We’re here for you.</p></div>
      </div>
      <div class="ssf-stage" aria-label="PETNOVA wordmark. Click to replay the writing animation.">
        <button class="ssf-wordmark-button" type="button" aria-label="Write PETNOVA again"></button>
        <div class="ssf-stickers">${stickers.map((s, i) => `<div class="ssf-sticker ${s.cls}" data-sticker="${i}" style="--x:${s.x}%;--y:${s.y}%;--r:${(i % 2 ? -1 : 1) * (6 + i * 2)}deg;--at:${(1.13 + 2.6 * Math.pow(s.x / 100, .92)).toFixed(2)}s" role="button" tabindex="0" aria-label="${s.aria}. Drag to move; double-click to reset.">${s.art}</div>`).join('')}</div>
      </div>
      <div class="ssf-bottom"><span>© <span data-year></span> PETNOVA · Made with care in Panama</span><a href="privacy-terms.html">Privacy &amp; Terms</a></div>
      <div class="ssf-credit-wrap"><button class="ssf-credits-button" type="button" aria-expanded="false">credits</button><div class="ssf-credits-pop" hidden><b>Design &amp; code</b><span>The PETNOVA team</span><b>Stickers</b><span>Drawn in code, peel freely</span></div></div>
    </div>`;
  document.body.appendChild(footer);
  footer.querySelector('[data-year]').textContent = new Date().getFullYear();
  footer.querySelectorAll('.ssf-big .ssf-line').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      link.classList.add('is-tapped');
      window.setTimeout(() => window.location.assign(link.href), 250);
    });
  });

  const word = scriptWord('petnova');
  const pad = 2.25, vbX = -3.65, vbY = word.top - pad;
  const vbW = word.width + 2.8 + pad * 2 - word.top * .1584;
  const vbH = word.bottom + pad - vbY;
  const wordSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wordSvg.setAttribute('class', 'ssf-wordmark');
  wordSvg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
  wordSvg.setAttribute('aria-hidden', 'true');
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', 'skewX(-9)');
  [word.main, ...word.extra].forEach((d, i) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.classList.add('ssf-word-path');
    if (i > 0) path.classList.add('ssf-word-path--detail');
    group.appendChild(path);
  });
  wordSvg.appendChild(group);
  footer.querySelector('.ssf-wordmark-button').appendChild(wordSvg);
  const wordPaths = [...footer.querySelectorAll('.ssf-word-path')];
  const mainLength = wordPaths[0].getTotalLength();
  const drawDuration = Math.min(2.6, Math.max(1.1, .7 + mainLength / 45));
  wordPaths.forEach((path, i) => {
    const length = path.getTotalLength();
    path.style.setProperty('--l', `${length}px`);
    path.style.setProperty('--dur', `${i ? .28 : drawDuration}s`);
    path.style.setProperty('--at', `${i ? 1.05 + drawDuration + (i - 1) * .16 : 1.05}s`);
  });

  const replay = () => {
    footer.querySelectorAll('.ssf-sticker').forEach((sticker) => {
      sticker.style.setProperty('--x', `${sticker.dataset.startX}%`);
      sticker.style.setProperty('--y', `${sticker.dataset.startY}%`);
      sticker.style.setProperty('--tilt', '0deg');
      sticker.classList.remove('is-dragging');
      sticker.style.removeProperty('z-index');
    });
    footer.classList.remove('is-in');
    void footer.offsetWidth;
    footer.classList.add('is-in');
  };
  footer.querySelector('.ssf-wordmark-button').addEventListener('click', replay);
  const creditsButton = footer.querySelector('.ssf-credits-button');
  const creditsPop = footer.querySelector('.ssf-credits-pop');
  creditsButton.addEventListener('click', () => {
    const open = creditsButton.getAttribute('aria-expanded') === 'true';
    creditsButton.setAttribute('aria-expanded', String(!open));
    creditsPop.hidden = open;
  });
  document.addEventListener('pointerdown', (event) => {
    if (!footer.querySelector('.ssf-credit-wrap').contains(event.target)) {
      creditsButton.setAttribute('aria-expanded', 'false');
      creditsPop.hidden = true;
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      creditsButton.setAttribute('aria-expanded', 'false');
      creditsPop.hidden = true;
    }
  });

  const stage = footer.querySelector('.ssf-stickers');
  footer.querySelectorAll('.ssf-sticker').forEach((sticker) => {
    let drag = null;
    sticker.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const bounds = stage.getBoundingClientRect();
      const rect = sticker.getBoundingClientRect();
      drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: parseFloat(getComputedStyle(sticker).left) / bounds.width * 100, y: parseFloat(getComputedStyle(sticker).top) / bounds.height * 100, bounds };
      sticker.setPointerCapture(event.pointerId);
      sticker.classList.add('is-dragging');
      sticker.style.zIndex = '8';
      sticker.dataset.moved = 'false';
      event.preventDefault();
    });
    sticker.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.hypot(dx, dy) > 4) sticker.dataset.moved = 'true';
      const x = Math.max(3, Math.min(97, drag.x + dx / drag.bounds.width * 100));
      const y = Math.max(5, Math.min(96, drag.y + dy / drag.bounds.height * 100));
      sticker.style.setProperty('--x', `${x}%`);
      sticker.style.setProperty('--y', `${y}%`);
      sticker.style.setProperty('--tilt', `${Math.max(-20, Math.min(20, dx * .08))}deg`);
    });
    const endDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      sticker.classList.remove('is-dragging');
      sticker.style.removeProperty('z-index');
      sticker.style.setProperty('--tilt', '0deg');
    };
    sticker.addEventListener('pointerup', endDrag);
    sticker.addEventListener('pointercancel', endDrag);
    sticker.addEventListener('dblclick', () => {
      sticker.style.setProperty('--x', sticker.dataset.homeX || getComputedStyle(sticker).left);
      sticker.style.setProperty('--y', sticker.dataset.homeY || getComputedStyle(sticker).top);
      sticker.classList.remove('is-dragging');
    });
    sticker.addEventListener('keydown', (event) => {
      const delta = event.shiftKey ? 5 : 1.5;
      const x = parseFloat(sticker.style.getPropertyValue('--x')) || parseFloat(sticker.dataset.startX);
      const y = parseFloat(sticker.style.getPropertyValue('--y')) || parseFloat(sticker.dataset.startY);
      const steps = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] };
      if (steps[event.key]) {
        event.preventDefault();
        sticker.style.setProperty('--x', `${Math.max(3, Math.min(97, x + steps[event.key][0]))}%`);
        sticker.style.setProperty('--y', `${Math.max(5, Math.min(96, y + steps[event.key][1]))}%`);
      } else if (event.key === 'Home' || event.key === 'Escape') {
        event.preventDefault();
        sticker.style.setProperty('--x', `${sticker.dataset.startX}%`);
        sticker.style.setProperty('--y', `${sticker.dataset.startY}%`);
      }
    });
    sticker.dataset.homeX = `${sticker.style.getPropertyValue('--x')}`;
    sticker.dataset.homeY = `${sticker.style.getPropertyValue('--y')}`;
    sticker.dataset.startX = sticker.style.getPropertyValue('--x').replace('%', '');
    sticker.dataset.startY = sticker.style.getPropertyValue('--y').replace('%', '');
    sticker.style.left = sticker.style.getPropertyValue('--x');
    sticker.style.top = sticker.style.getPropertyValue('--y');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        footer.classList.add('is-in');
        observer.disconnect();
      }
    }, { threshold: .12 });
    observer.observe(footer);
  } else footer.classList.add('is-in');
})();
