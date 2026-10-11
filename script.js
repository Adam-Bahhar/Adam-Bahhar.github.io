'use strict';

const page = document.documentElement;
const header = document.querySelector('.site-header');
const navigation = document.querySelector('#navigation');
const menuButton = document.querySelector('.menu-toggle');
const mobileNavigation = window.matchMedia('(max-width: 860px)');

function setMenu(open) {
  const expanded = mobileNavigation.matches && open;
  menuButton.setAttribute('aria-expanded', String(expanded));
  header.classList.toggle('menu-open', expanded);
  navigation.classList.toggle('is-open', expanded);
  navigation.inert = mobileNavigation.matches && !expanded;
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('click', (event) => {
  if (mobileNavigation.matches && menuButton.getAttribute('aria-expanded') === 'true'
      && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
    setMenu(false);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
function syncNavigation() {
  menuButton.hidden = !mobileNavigation.matches;
  setMenu(false);
}
mobileNavigation.addEventListener('change', syncNavigation);
syncNavigation();
page.classList.add('js-enabled');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.querySelector('#motion-toggle');
const motionLabel = document.querySelector('#motion-label');
const artwork = document.querySelector('[data-tilt]');
const reveals = [...document.querySelectorAll('.reveal')];
let manuallyPaused = false;
try {
  manuallyPaused = localStorage.getItem('adam-portfolio-motion') === 'paused';
} catch {
  // Storage is optional; motion controls still work in this tab.
}

let tiltFrame = 0;
function resetTilt() {
  cancelAnimationFrame(tiltFrame);
  tiltFrame = 0;
  artwork.style.removeProperty('--tilt-x');
  artwork.style.removeProperty('--tilt-y');
}
function motionPaused() {
  return manuallyPaused || reducedMotion.matches;
}
let revealObserver;
function reveal(element) {
  element.classList.add('is-visible');
  revealObserver?.unobserve(element);
}
function syncMotion() {
  const paused = motionPaused();
  page.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.disabled = reducedMotion.matches;
  motionLabel.textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
  if (paused) {
    resetTilt();
    reveals.forEach(reveal);
  }
}
motionButton.addEventListener('click', () => {
  if (reducedMotion.matches) return;
  manuallyPaused = !manuallyPaused;
  try {
    localStorage.setItem('adam-portfolio-motion', manuallyPaused ? 'paused' : 'playing');
  } catch {
    // Storage is optional; motion controls still work in this tab.
  }
  syncMotion();
});
reducedMotion.addEventListener('change', syncMotion);
finePointer.addEventListener('change', resetTilt);
syncMotion();
motionButton.hidden = false;

if ('IntersectionObserver' in window && !motionPaused()) {
  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) reveal(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  for (const element of reveals) {
    if (element.matches('.skill-card, .credential-card')) {
      const index = [...element.parentElement.children].indexOf(element);
      element.style.setProperty('--reveal-delay', `${(index % 3) * 45}ms`);
    }
    revealObserver.observe(element);
    element.classList.add('reveal-ready');
    element.addEventListener('focusin', () => reveal(element), { once: true });
  }
}

let pointerX = 0;
let pointerY = 0;
artwork.addEventListener('pointermove', (event) => {
  if (!finePointer.matches || motionPaused()) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (tiltFrame) return;
  tiltFrame = requestAnimationFrame(() => {
    tiltFrame = 0;
    const bounds = artwork.getBoundingClientRect();
    if (!bounds.width || !bounds.height || motionPaused()) return;
    const x = Math.max(-0.5, Math.min(0.5, (pointerX - bounds.left) / bounds.width - 0.5));
    const y = Math.max(-0.5, Math.min(0.5, (pointerY - bounds.top) / bounds.height - 0.5));
    artwork.style.setProperty('--tilt-x', `${-y * 8}deg`);
    artwork.style.setProperty('--tilt-y', `${x * 10}deg`);
  });
});
artwork.addEventListener('pointerleave', resetTilt);
artwork.addEventListener('pointercancel', resetTilt);

const phaseDescriptions = {
  idea: 'Everything starts with a good question.',
  interface: 'Give an idea a shape people can understand.',
  system: 'Connect the pieces. Make something useful.'
};
const phaseButtons = [...document.querySelectorAll('.phase-button')];
const heroVisual = document.querySelector('.hero-visual');
const phaseDescription = document.querySelector('.phase-description');
let phaseTimer = 0;
let heroInView = true;
function setPhase(phase, announce = false) {
  if (!Object.hasOwn(phaseDescriptions, phase)) return;
  heroVisual.dataset.phase = phase;
  phaseDescription.setAttribute('aria-live', announce ? 'polite' : 'off');
  phaseDescription.textContent = phaseDescriptions[phase];
  for (const button of phaseButtons) {
    const active = button.dataset.phase === phase;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}
function stopPhaseCycle() {
  window.clearTimeout(phaseTimer);
  phaseTimer = 0;
}
function syncPhaseCycle() {
  stopPhaseCycle();
  if (motionPaused() || document.hidden || !heroInView) return;
  phaseTimer = window.setTimeout(() => {
    const current = phaseButtons.findIndex((button) => button.getAttribute('aria-pressed') === 'true');
    setPhase(phaseButtons[(current + 1) % phaseButtons.length].dataset.phase);
    syncPhaseCycle();
  }, 4500);
}
for (const button of phaseButtons) {
  button.addEventListener('click', () => {
    setPhase(button.dataset.phase, true);
    syncPhaseCycle();
  });
}
motionButton.addEventListener('click', syncPhaseCycle);
reducedMotion.addEventListener('change', syncPhaseCycle);
document.addEventListener('visibilitychange', syncPhaseCycle);
window.addEventListener('pagehide', stopPhaseCycle);
window.addEventListener('pageshow', syncPhaseCycle);
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    syncPhaseCycle();
  }).observe(heroVisual);
}
syncPhaseCycle();
document.querySelector('.experiment-controls').hidden = false;

const skillFilters = document.querySelector('.skill-filters');
const filterButtons = [...skillFilters.querySelectorAll('button')];
const skillCards = [...document.querySelectorAll('.skill-card')];
for (const button of filterButtons) {
  button.addEventListener('click', () => {
    for (const other of filterButtons) {
      const active = other === button;
      other.classList.toggle('is-active', active);
      other.setAttribute('aria-pressed', String(active));
    }
    for (const card of skillCards) {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) reveal(card);
    }
  });
}
skillFilters.hidden = false;

// The native pointer stays available; the decorative ring never receives input.
const cursor = document.createElement('div');
const ambient = document.querySelector('.ambient-background');
cursor.className = 'cursor-ring';
cursor.setAttribute('aria-hidden', 'true');
cursor.innerHTML = '<span></span><i class="cursor-dot"></i><i class="cursor-dot"></i><i class="cursor-dot"></i>';
document.body.append(cursor);
const cursorDots = [...cursor.querySelectorAll('.cursor-dot')];
const cursorTrail = cursorDots.map(() => ({ x: 0, y: 0 }));
let cursorFrame = 0;
let cursorTime = 0;
let cursorX = 0;
let cursorY = 0;
let cursorTargetX = 0;
let cursorTargetY = 0;
let cursorVisible = false;
function hideCursor() {
  cancelAnimationFrame(cursorFrame);
  cursorFrame = cursorTime = 0;
  cursorVisible = false;
  cursor.classList.remove('is-visible', 'is-hovering', 'is-pressed');
  ambient.classList.remove('is-tracking');
}
function animateCursor(time) {
  const delta = cursorTime ? Math.min(time - cursorTime, 64) : 16;
  cursorTime = time;
  const ease = 1 - Math.exp(-delta / 65);
  cursorX += (cursorTargetX - cursorX) * ease;
  cursorY += (cursorTargetY - cursorY) * ease;
  let settled = Math.hypot(cursorTargetX - cursorX, cursorTargetY - cursorY) < 0.2;
  if (settled) {
    cursorX = cursorTargetX;
    cursorY = cursorTargetY;
  }
  cursorTrail.forEach((point, index) => {
    const trailEase = 1 - Math.exp(-delta / (100 + index * 45));
    point.x += (cursorTargetX - point.x) * trailEase;
    point.y += (cursorTargetY - point.y) * trailEase;
    const pointSettled = Math.hypot(cursorTargetX - point.x, cursorTargetY - point.y) < 0.2;
    if (pointSettled) {
      point.x = cursorTargetX;
      point.y = cursorTargetY;
    }
    settled = settled && pointSettled;
    cursorDots[index].style.transform = `translate3d(${point.x - cursorX - (index + 1) * 7}px, ${point.y - cursorY + (index + 1) * 4}px, 0)`;
  });
  cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
  // Share the cursor's idle-stopping frame loop with the background glow.
  ambient.style.setProperty('--spotlight-x', `${cursorX.toFixed(1)}px`);
  ambient.style.setProperty('--spotlight-y', `${cursorY.toFixed(1)}px`);
  cursorFrame = settled ? 0 : requestAnimationFrame(animateCursor);
  if (settled) cursorTime = 0;
}
document.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || !finePointer.matches || motionPaused()) {
    hideCursor();
    return;
  }
  cursorTargetX = event.clientX;
  cursorTargetY = event.clientY;
  if (!cursorVisible) {
    cursorX = cursorTargetX;
    cursorY = cursorTargetY;
    cursorTrail.forEach((point) => {
      point.x = cursorTargetX;
      point.y = cursorTargetY;
    });
    cursorVisible = true;
    cursor.classList.add('is-visible');
    ambient.classList.add('is-tracking');
  }
  cursor.classList.toggle('is-hovering', !!event.target.closest('a, button:not(:disabled), summary'));
  if (!cursorFrame) cursorFrame = requestAnimationFrame(animateCursor);
}, { passive: true });
document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'), { passive: true });
document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), { passive: true });
document.documentElement.addEventListener('pointerleave', hideCursor);
document.addEventListener('pointercancel', hideCursor);
document.addEventListener('keydown', hideCursor);
window.addEventListener('blur', hideCursor);
window.addEventListener('resize', hideCursor, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) hideCursor();
});
motionButton.addEventListener('click', hideCursor);
reducedMotion.addEventListener('change', hideCursor);
finePointer.addEventListener('change', hideCursor);

// Bound the travel of decorative layers while keeping the browser's native scroll.
const scrollArtwork = [...document.querySelectorAll('.hero-visual, .project-art')];
let artworkFrame = 0;
function updateScrollArtwork() {
  artworkFrame = 0;
  const enabled = finePointer.matches && !motionPaused();
  for (const element of scrollArtwork) {
    const bounds = element.getBoundingClientRect();
    const fraction = (window.innerHeight / 2 - bounds.top - bounds.height / 2) / (window.innerHeight / 2 + bounds.height / 2);
    const offset = enabled ? Math.max(-1, Math.min(1, fraction)) * 20 : 0;
    element.style.setProperty('--scroll-y', `${offset.toFixed(2)}px`);
  }
}
function scheduleScrollArtwork() {
  if (!artworkFrame) artworkFrame = requestAnimationFrame(updateScrollArtwork);
}
window.addEventListener('scroll', scheduleScrollArtwork, { passive: true });
window.addEventListener('resize', scheduleScrollArtwork, { passive: true });
window.addEventListener('load', scheduleScrollArtwork, { once: true });
document.addEventListener('toggle', scheduleScrollArtwork, true);
motionButton.addEventListener('click', scheduleScrollArtwork);
reducedMotion.addEventListener('change', scheduleScrollArtwork);
finePointer.addEventListener('change', scheduleScrollArtwork);
if ('ResizeObserver' in window) new ResizeObserver(scheduleScrollArtwork).observe(document.body);
updateScrollArtwork();

if (!window.CSS?.supports('animation-timeline: scroll(root block)')) {
  const progress = document.querySelector('.reading-progress');
  let progressFrame = 0;
  function updateProgress() {
    progressFrame = 0;
    const distance = page.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
  }
  function scheduleProgress() {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress, { passive: true });
  window.addEventListener('load', scheduleProgress, { once: true });
  document.addEventListener('toggle', scheduleProgress, true);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();
}
