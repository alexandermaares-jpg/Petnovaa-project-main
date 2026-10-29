(() => {
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const section=document.querySelector('.petmoments'), cards=[...document.querySelectorAll('.pm-card')], header=document.querySelector('.site-header'), hero=document.querySelector('.hero');
 let raf=false;
 function update(){raf=false;if(header)header.classList.toggle('is-scrolled',scrollY>10);if(hero&&!reduce){const r=hero.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/Math.max(1,hero.offsetHeight)));const word=hero.querySelector('.hero-wordmark'),paws=hero.querySelector('.hero-paws'),dog=hero.querySelector('.hero-image img');if(dog)dog.style.setProperty('--dog-scroll',p);if(word)word.style.translate=`0 ${p*32}px`;if(paws){const shift=p*30,drift=Math.sin(p*Math.PI)*8;const positions=innerWidth<760?[[20,14],[80,14],[50,12],[28,32],[72,32],[20,56],[80,56],[34,84],[66,84],[50,65],[39,24],[61,24],[4,48],[96,48],[14,70],[86,70]]:[[20,14],[80,14],[50,12],[28,32],[72,32],[20,56],[80,56],[34,84],[66,84],[50,65],[39,24],[61,24],[4,48],[96,48],[14,70],[86,70]];paws.style.backgroundPosition=positions.map(([x,y],i)=>`calc(${x}% + ${(i%2?1:-1)*drift}px) calc(${y}% + ${shift}px)`).join(', ');}}if(!section||reduce)return;
  const rect=section.getBoundingClientRect(), span=Math.max(1,section.offsetHeight-innerHeight), p=Math.max(0,Math.min(1,-rect.top/span));
  section.style.setProperty('--pm-progress',p);
  cards.forEach((card,i)=>{const s=getComputedStyle(card),x=parseFloat(s.getPropertyValue('--x'))||0,y=parseFloat(s.getPropertyValue('--y'))||0,z=parseFloat(s.getPropertyValue('--z'))||0,r=parseFloat(s.getPropertyValue('--r'))||0,k=parseFloat(s.getPropertyValue('--s'))||1;
   const phase=p*2-1, drift=(innerWidth<700?55:110)*phase*(i%2?-1:1);
   card.style.transform=`translate3d(calc(-50% + ${x}vw + ${drift}px),calc(-50% + ${y}vh + ${phase*(i%2?16:-16)}px),${z+Math.sin(p*Math.PI*2+i)*35}px) rotateY(${r+phase*5}deg) rotateZ(${r*.12}deg) scale(${k})`;
  });
 }
 function request(){if(!raf){raf=true;requestAnimationFrame(update)}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});update();
 if(section&&!reduce)cards.forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect(),rx=((e.clientY-r.top)/r.height-.5)*-6,ry=((e.clientX-r.left)/r.width-.5)*7;card.style.filter=`drop-shadow(0 25px 32px #100a1e70)`;card.style.setProperty('--tilt-x',rx+'deg');card.style.setProperty('--tilt-y',ry+'deg')});card.addEventListener('pointerleave',()=>card.style.removeProperty('filter'))});
 const revealSelector = [
  '.section-title', '.service-card', '.workspace-copy', '.community-copy',
  '.review-card', '.reviews-heading > *', '.care-panel', '.care-heading > *',
  '.function-card', '.info-banner > *', '.info-story-image', '.info-story-copy > *',
  '.function-story-media', '.function-story-copy > *',
  '.mission-vision-heading > *', '.mission-vision-story',
  '.contact-intro > *', '.contact-note', '.contact-form', '.flip-gallery-info > *', '.intro-strip .app-description', '.mission-vision-visual img', '.footer-top > *', '.footer-bottom > *',
  '.last-call-copy > *', '.last-call-action > *', '.info-page-cta > *', '.footer-top > *', '.footer-bottom > *', '.intro-strip .app-description'
 ].join(',');
 const targets = [...document.querySelectorAll(revealSelector)];
 const cardSelector = '.service-card, .review-card, .care-panel, .function-card';
 const rightSelector = '.info-story-image';
 const leftSelector = '.workspace-copy, .community-copy, .info-banner > *, .info-story-copy > *, .reviews-heading > *, .care-heading > *, .contact-intro > *, .flip-gallery-info > *, .last-call-copy > *, .last-call-action > *, .info-page-cta > *, .section-title';
 targets.forEach(target => {
  target.setAttribute('data-reveal', '');
  if (target.matches(cardSelector)) target.classList.add('scroll-reveal-card');
  else if (target.matches(rightSelector)) target.classList.add('scroll-reveal-right');
  else if (target.matches(leftSelector)) target.classList.add('scroll-reveal-left');
  const siblings = targets.filter(item => item.parentElement === target.parentElement);
  target.style.setProperty('--reveal-delay', `${siblings.indexOf(target) * 105}ms`);
 });
 if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
   if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    io.unobserve(entry.target);
   }
  }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
  targets.forEach(el => io.observe(el));
 } else targets.forEach(el => el.classList.add('is-visible'));
})();
