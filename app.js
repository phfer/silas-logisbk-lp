"use strict";

const connection = navigator.connection;
const saveData = Boolean(connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType));
const compactMedia = matchMedia('(max-width:850px), (pointer:coarse)');
const mediaSource = video => compactMedia.matches && video.dataset.mobile ? video.dataset.mobile : video.dataset.src;

// The official bank form owns registration. This page never collects personal data.
const incoming = new URLSearchParams(window.location.search);
const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
];
for (const link of document.querySelectorAll("[data-account]")) {
  const destination = new URL(link.href);
  for (const key of attributionKeys) {
    const value = incoming.get(key);
    if (value && value.length <= 160) destination.searchParams.set(key, value);
  }
  destination.searchParams.set("utm_content", `silas_${link.dataset.account}`);
  link.href = destination.href;
}

const film = document.querySelector("#campaign-film");
const cover = document.querySelector(".video-cover");
cover.hidden = false;
cover.addEventListener("click", async () => {
  cover.hidden = true;
  if (!film.getAttribute('src')) film.src = mediaSource(film);
  film.focus();
  try {
    await film.play();
  } catch (error) {
    // Keep native controls available if autoplay policy or a network error prevents playback.
    console.warn(
      "Não foi possível iniciar o filme. Use os controles do player.",
      error,
    );
  }
});
film.addEventListener("play", () => {
  cover.hidden = true;
});

const mobileCta = document.querySelector(".mobile-cta");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(([entry]) => {
    mobileCta.classList.toggle("is-visible", !entry.isIntersecting);
  });
  observer.observe(document.querySelector(".hero"));
}


const heroVideo = document.querySelector("#hero-reel");
const heroPoster = document.querySelector('.hero-photo');
const motionButton = document.querySelector("#motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let motionPaused = reducedMotion.matches || saveData;
let heroVisible = true;
motionButton.hidden = false;
heroVideo.muted = true;

function updateMotionButton() {
  const paused = heroVideo.paused;
  motionButton.setAttribute("aria-label", paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo");
  motionButton.querySelector(".motion-label").textContent = paused ? "REPRODUZIR VÍDEO" : "PAUSAR VÍDEO";
  motionButton.querySelector(".motion-icon").textContent = paused ? "▶" : "Ⅱ";
  document.documentElement.classList.toggle("motion-paused", paused);
}

async function syncHeroPlayback() {
  if (motionPaused || !heroVisible || document.hidden) {
    heroVideo.pause();
    updateMotionButton();
    return;
  }
  if (!heroPoster.complete) return;
  if (!heroVideo.getAttribute("src")) heroVideo.src = mediaSource(heroVideo);
  try {
    await heroVideo.play();
  } catch (error) {
    updateMotionButton();
    console.warn("Reprodução automática indisponível; use Reproduzir vídeo.", error);
  }
}

heroPoster.addEventListener('load', syncHeroPlayback, {once:true});
heroPoster.addEventListener('error', syncHeroPlayback, {once:true});

heroVideo.addEventListener("playing", () => {
  heroVideo.classList.add("is-ready");
  updateMotionButton();
});
heroVideo.addEventListener("pause", updateMotionButton);
heroVideo.addEventListener("error", () => {
  heroVideo.classList.remove("is-ready");
  updateMotionButton();
});
motionButton.addEventListener("click", () => {
  motionPaused = !heroVideo.paused;
  document.documentElement.classList.toggle('motion-opt-in', reducedMotion.matches && !motionPaused);
  syncHeroPlayback();
});
reducedMotion.addEventListener("change", (event) => {
  document.documentElement.classList.remove('motion-opt-in');
  motionPaused = event.matches || saveData;
  syncHeroPlayback();
});
document.addEventListener("visibilitychange", syncHeroPlayback);
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    syncHeroPlayback();
  }, {threshold:0.05}).observe(document.querySelector(".hero"));
}
syncHeroPlayback();

// Native scrolling drives one short film. No scroll interception or animation library.
const story = document.querySelector('.mindset');
const apex = document.querySelector('#apex-film');
const chapters = [...story.querySelectorAll('article')];
const laps = [...story.querySelectorAll('.story-laps>span')];
const progressBar = document.querySelector('.reading-progress');
const clarity = document.querySelector('.calm-art');
let scrollFrame = 0;
const fireReveal = document.querySelector('#fire-reveal');
const scrollFilms = [apex, fireReveal].map(video => ({video, target:0, last:-1, requested:false}));
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const smooth = value => { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); };

async function loadScrollFilm(state) {
  state.requested = true;
  try {
    const response = await fetch(mediaSource(state.video));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    // A local Blob supports precise seeking even on previews without byte ranges.
    state.video.src = URL.createObjectURL(await response.blob());
    state.video.preload = 'auto';
    state.video.load();
  } catch (error) {
    console.warn('Filme de rolagem indisponível; imagem de fundo preservada.', error);
  }
}

function seekScrollFilm(state) {
  const video = state.video;
  if (!reducedMotion.matches && !saveData && video.readyState >= 2 && !video.seeking && Math.abs(state.last - state.target) > .035) {
    state.last = state.target;
    video.currentTime = state.target;
  }
}

function paintScroll() {
  scrollFrame = 0;
  // Some engines update the media query without dispatching its change event.
  if (reducedMotion.matches || saveData) {
    if (document.documentElement.classList.contains('scroll-story')) setScrollMode();
    return;
  }
  if (!document.documentElement.classList.contains('scroll-story')) setScrollMode();
  // Complete the arc while the panel is still visible, including on narrow screens.
  const clarityRect = clarity.getBoundingClientRect();
  const clarityProgress = clamp((innerHeight - clarityRect.top) / (innerHeight * .8 + clarityRect.height * .25), 0, 1);
  clarity.style.setProperty('--calm-progress', clarityProgress);
  clarity.style.setProperty('--calm-rotation', `${clarityProgress * 280}deg`);
  clarity.style.setProperty('--calm-dash', 100 * (1 - clarityProgress));
  clarity.style.setProperty('--calm-blur', `${(1 - clarityProgress) * 1.5}px`);
  clarity.style.setProperty('--calm-glow', `${clarityProgress * 25}px`);
  clarity.dataset.phase = String(Math.min(2, Math.floor(clarityProgress * 3)));
  const rect = story.getBoundingClientRect();
  const progress = clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1);
  const narrative = clamp(progress / .76, 0, 1);
  const chapter = Math.min(2, Math.floor(narrative * 3));
  story.dataset.chapter = String(chapter);
  chapters.forEach((article, i) => {
    const distance = (narrative - (i + .5) / 3) * 3;
    article.style.setProperty('--chapter-opacity', i === chapter ? String(1 - smooth((progress - .7) / .05)) : '0');
    article.style.setProperty('--chapter-shift', `${clamp(-distance * 40, -50, 50)}px`);
    laps[i].classList.toggle('is-active', i <= chapter);
  });
  story.style.setProperty('--story-progress', progress);
  const fireReady = fireReveal.classList.contains('is-ready');
  const fireOpacity = fireReady ? smooth((progress - .7) / .05) : 0;
  story.style.setProperty('--fire-opacity', fireOpacity);
  story.style.setProperty('--fire-signoff', fireReady ? smooth((progress - .955) / .03) : 0);
  story.style.setProperty('--apex-opacity', 1 - fireOpacity);
  for (const state of scrollFilms) {
    if (rect.top < innerHeight * 1.5 && rect.bottom > 0 && !state.requested) loadScrollFilm(state);
    if (Number.isFinite(state.video.duration)) {
      const position = state.video === apex ? progress / .8 : (progress - .72) / .28;
      state.target = clamp(position, 0, 1) * Math.max(0, state.video.duration - .05);
      seekScrollFilm(state);
    }
  }
  const total = document.documentElement.scrollHeight - innerHeight;
  progressBar.style.transform = `scaleX(${total > 0 ? clamp(scrollY / total, 0, 1) : 0})`;
}

function scheduleScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
}

function setScrollMode() {
  document.documentElement.classList.toggle('scroll-story', !reducedMotion.matches && !saveData);
  if (reducedMotion.matches || saveData) {
    motionPaused = true;
    syncHeroPlayback();
    scrollFilms.forEach(state => state.video.pause());
    chapters.forEach(article => { article.style.removeProperty('--chapter-opacity'); article.style.removeProperty('--chapter-shift'); });
  }
  scheduleScroll();
}

for (const state of scrollFilms) {
  state.video.addEventListener('loadeddata', () => { state.video.classList.add('is-ready'); scheduleScroll(); });
  state.video.addEventListener('seeked', () => seekScrollFilm(state));
  state.video.addEventListener('error', () => {
    state.video.classList.remove('is-ready');
    console.warn('Filme indisponível; fundo estático preservado.');
    scheduleScroll();
  });
}
window.addEventListener('scroll', scheduleScroll, {passive:true});
window.addEventListener('resize', scheduleScroll);
reducedMotion.addEventListener('change', setScrollMode);
setScrollMode();

if ('IntersectionObserver' in window) {
  const entrance = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      entrance.unobserve(entry.target);
    }
  }, {threshold:.12});
  document.querySelectorAll('.result, .portrait-block, .partnership-copy, .section-heading, .video-shell, .benefits article, .final-cta .container, .questions details, .trophy-stage, .champion-copy, .celebration-stage, .value-copy, .value-art:not(.calm-art), .values-intro, .journey-intro, .journey-timeline li, .dubai-card').forEach((element, i) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay', `${i % 3 * 70}ms`);
    entrance.observe(element);
  });
}
