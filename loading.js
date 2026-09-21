"use strict";

// A short opening, never a gate on downloading the entire film.
(() => {
  const root = document.documentElement;
  const opening = document.querySelector('#race-loader');
  if (!root.classList.contains('booting')) return;
  const skip = opening.querySelector('button');
  const content = [...document.body.children].filter(e => e !== opening && e.tagName !== 'SCRIPT');
  const originalInert = content.map(e => e.inert);
  const previousFocus = document.activeElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = [];
  let finished = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    clearTimeout(window.loadingFailsafe);
    root.classList.remove('booting');
    content.forEach((e, i) => { e.inert = originalInert[i]; });
    document.removeEventListener('keydown', onKey);
    preference.removeEventListener('change', finish);
    window.removeEventListener('opening-timeout', finish);
    if (opening.contains(document.activeElement)) {
      const destination = previousFocus !== document.body ? previousFocus : document.querySelector('.skip-link');
      destination.focus({preventScroll:true});
      // Avoid a visible skip-link on automatic entry; keyboard users retain a valid focus position.
      if (previousFocus === document.body) destination.blur();
    }
  }
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  }
  // Register cleanup before making page content inert.
  window.addEventListener('opening-timeout', finish, {once:true});
  preference.addEventListener('change', finish, {once:true});
  skip.addEventListener('click', finish, {once:true});
  document.addEventListener('keydown', onKey);
  content.forEach(e => { e.inert = true; });
  opening.tabIndex = -1;
  opening.focus({preventScroll:true});
  later(() => { opening.dataset.step = '2'; }, 800);
  later(() => { opening.dataset.step = '1'; }, 1600);
  later(() => {
    opening.dataset.step = 'go';
    opening.querySelector('.loader-status').textContent = 'É HORA DE ACELERAR';
  }, 2400);
  later(() => opening.classList.add('is-leaving'), 2900);
  later(finish, 3650);
})();
