'use strict';

(() => {
  const root = document.documentElement;
  const desktop = window.matchMedia('(min-width: 768px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const companion = document.createElement('aside');
  companion.className = 'coding-companion';
  companion.setAttribute('role', 'img');
  companion.setAttribute('aria-label', "A friendly teddy bear coding companion welcomes you to Adam's portfolio.");
  companion.innerHTML = `
    <span class="companion-bubble" aria-hidden="true"></span>
    <svg class="companion-character" viewBox="0 0 160 186" aria-hidden="true" focusable="false">
      <ellipse class="companion-shadow" cx="80" cy="178" rx="43" ry="5" fill="#030a13" opacity=".5"/>
      <g class="companion-office-chair" fill="#152d42" stroke="#628497" stroke-width="2">
        <rect x="44" y="89" width="74" height="65" rx="12"/>
        <path d="M49 151h66v7H49z"/>
        <path d="M81 157v18m-20 3 20-3 20 3" fill="none" stroke-linecap="round"/>
      </g>
      <g class="companion-body">
        <g class="companion-standing-legs">
          <path d="M57 142l-4 27q0 8 13 8h12l4-27m1-8 4 27q0 8 13 8h9q8-1 7-8l-7-28" fill="#192e45"/>
          <path d="M53 170q-2 9 10 9h15v-9m10 0v9h23q11-1 4-10" fill="#d5a47d"/>
        </g>
        <g class="companion-seated-legs">
          <path d="M61 141q-17 5-14 16l7 17h15l-5-20 18-3m16-10q17 5 14 16l-7 17H90l5-20-14-3" fill="#192e45"/>
          <path d="M52 170q-3 9 7 9h12v-9m18 0v9h18q6-3-2-9" fill="#d5a47d"/>
        </g>
        <path d="M48 105q2-20 22-24h24q22 5 24 24l-4 48q-32 12-68-2z" fill="#22505c" stroke="#417582" stroke-width="2"/>
        <path d="M64 88q17 20 35 0l-3-13H67z" fill="#c89578"/>
        <path d="M62 86l18 20 22-20-7 33-15-6-16 6z" fill="#183b48"/>
        <path d="M75 108v16m11-16v16" stroke="#91ddd8" stroke-width="2" stroke-linecap="round"/>
        <path d="M63 135q17 7 34 0v13H63z" fill="#1a4350"/>
        <path d="M69 136l-5 5m28-5 5 5" stroke="#417582" stroke-width="2"/>
        <g class="companion-arm companion-wave-arm">
          <path d="M53 97q-10 1-13 13l-12-7-9-21" fill="none" stroke="#22505c" stroke-width="15" stroke-linecap="round"/>
          <ellipse cx="19" cy="78" rx="8" ry="10" fill="#d5a47d"/>
          <ellipse cx="19" cy="81" rx="4" ry="4.5" fill="#9d745d"/>
          <circle cx="15" cy="73" r="1.6" fill="#9d745d"/>
          <circle cx="20" cy="71" r="1.6" fill="#9d745d"/>
          <circle cx="24" cy="74" r="1.6" fill="#9d745d"/>
        </g>
        <g class="companion-arm companion-rest-arm">
          <path d="M51 99q-11 21 3 31l12 4" fill="none" stroke="#22505c" stroke-width="15" stroke-linecap="round"/>
          <ellipse cx="66" cy="132" rx="8" ry="6" fill="#d5a47d"/>
        </g>
        <g class="companion-arm companion-think-arm">
          <path d="M51 101q-15 10-8 21l23-20" fill="none" stroke="#22505c" stroke-width="15" stroke-linecap="round"/>
          <ellipse cx="69" cy="99" rx="7" ry="8" fill="#d5a47d"/>
        </g>
        <g class="companion-arm companion-stretch-arms">
          <path d="M51 99q-17-12-13-33V25m71 74q17-12 13-33V25" fill="none" stroke="#22505c" stroke-width="15" stroke-linecap="round"/>
          <ellipse cx="38" cy="22" rx="7" ry="9" fill="#d5a47d"/>
          <ellipse cx="122" cy="22" rx="7" ry="9" fill="#d5a47d"/>
          <ellipse cx="38" cy="23" rx="3.5" ry="4" fill="#9d745d"/>
          <ellipse cx="122" cy="23" rx="3.5" ry="4" fill="#9d745d"/>
        </g>
        <g class="companion-arm companion-right-arm">
          <path d="M108 98q12 18 1 29l-12 5" fill="none" stroke="#22505c" stroke-width="15" stroke-linecap="round"/>
          <ellipse cx="98" cy="132" rx="8" ry="6" fill="#d5a47d"/>
        </g>
        <g class="companion-head">
          <circle cx="49" cy="31" r="14" fill="#c9956f"/>
          <circle cx="112" cy="31" r="14" fill="#c9956f"/>
          <circle cx="49" cy="31" r="8" fill="#e3bd96"/>
          <circle cx="112" cy="31" r="8" fill="#e3bd96"/>
          <path d="M47 48q-3-26 33-27 36 1 34 27v21q-3 26-34 27-31-1-33-27z" fill="#d5a47d"/>
          <path d="M72 28l4-3 4 3 4-3 4 3" fill="none" stroke="#bf8d68" stroke-width="1.5" stroke-linecap="round"/>
          <ellipse cx="80" cy="77" rx="17" ry="13" fill="#efcfaa"/>
          <g class="companion-brows" fill="none" stroke="#624838" stroke-width="2.5" stroke-linecap="round">
            <path class="companion-brow-left" d="M57 47l15-2"/>
            <path class="companion-brow-right" d="M89 45l15 2"/>
          </g>
          <g class="companion-glasses" fill="#152b3a" fill-opacity=".18" stroke="#8ce1dc" stroke-width="3">
            <rect x="51" y="51" width="27" height="20" rx="7"/>
            <rect x="85" y="51" width="27" height="20" rx="7"/>
            <path d="M78 57q4-3 7 0m-35-1h-4m66 0h5" fill="none"/>
          </g>
          <g class="companion-eyes" fill="#27313b">
            <ellipse cx="65" cy="61" rx="2.8" ry="4"/>
            <ellipse cx="98" cy="61" rx="2.8" ry="4"/>
          </g>
          <path d="M74 70q6-4 12 0l-2 5q-4 3-8 0z" fill="#503d37"/>
          <path d="M80 76v5" stroke="#764e42" stroke-width="2" stroke-linecap="round"/>
          <path class="companion-smile" d="M72 81q9 8 18-1" fill="none" stroke="#764e42" stroke-width="2.5" stroke-linecap="round"/>
          <path class="companion-concern" d="M74 85q7-5 14-1" fill="none" stroke="#764e42" stroke-width="2.5" stroke-linecap="round"/>
          <ellipse cx="59" cy="75" rx="5" ry="2" fill="#d3917a" opacity=".5"/>
          <ellipse cx="103" cy="75" rx="5" ry="2" fill="#d3917a" opacity=".5"/>
        </g>
      </g>
      <g class="companion-office-desk" fill="#26485a" stroke="#7da3b2" stroke-width="2" stroke-linejoin="round">
        <path d="M33 151h95v7H33z"/>
        <path d="M40 158v20m81-20v20" fill="none" stroke-width="4"/>
      </g>
      <g class="companion-laptop">
          <path d="M48 116h65l-6 35H55z" fill="#192b40" stroke="#74c4ca" stroke-width="2" stroke-linejoin="round"/>
          <path d="M44 151h73l-5 5H49z" fill="#91bbc9"/>
          <path d="M75 130l-5 4 5 4m10-8 5 4-5 4m-4-10-3 13" fill="none" stroke="#82ddd7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle class="companion-code-light" cx="101" cy="145" r="1.5" fill="#82ddd7"/>
      </g>
      <g class="companion-thought" fill="#b6d9ec">
        <circle cx="120" cy="42" r="2"/>
        <circle cx="127" cy="34" r="3"/>
        <circle cx="139" cy="23" r="11" fill="#142b40" stroke="#5b8caa" stroke-width="1.5"/>
        <path d="M136 19q1-4 4-3 6 1 1 6l-2 2m0 4h.1" fill="none" stroke="#b6d9ec" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g class="companion-idea">
        <path d="M131 28q-10-10-2-17 11-7 17 4 2 7-5 13v5h-10z" fill="#f2d49a" stroke="#f8e2b9" stroke-width="1.5"/>
        <path d="M132 36h8m-6 3h4m-2-11v-9l-4-3m4 3 4-3" fill="none" stroke="#ac986e" stroke-width="2" stroke-linecap="round"/>
        <g class="companion-idea-rays" stroke="#f2d49a" stroke-width="2" stroke-linecap="round">
          <path d="M136 2v-3m-19 9-3-2m43 2 3-2m-41 18-4 1m42-1 4 1"/>
        </g>
      </g>
      <g class="companion-frustration" fill="none" stroke="#b0cfe4" stroke-width="2" stroke-linecap="round">
        <path d="M123 47q11 0 8-6t9-6"/>
        <path d="M127 58q9-1 7-6"/>
      </g>
    </svg>`;
  document.body.append(companion);

  const bubble = companion.querySelector('.companion-bubble');
  const poses = [
    { name: 'welcome', message: "Hi! Welcome to Adam's corner.", duration: 6000 },
    { name: 'coding', message: 'Turning ideas into code.', duration: 7000 },
    { name: 'thinking', message: 'There has to be a cleaner way…', duration: 5500 },
    { name: 'idea', message: 'Aha! That could work.', duration: 5000 },
    { name: 'coding', message: 'Back to building.', duration: 7000 },
    { name: 'frustrated', message: 'One more bug. One more try.', duration: 5500 },
    { name: 'office', message: 'A little focus. A lot of code.', duration: 7500 },
    { name: 'stretch', message: 'Time for a quick back stretch.', duration: 5500 }
  ];
  let pose = 0;
  let timer = 0;
  let running = false;

  function renderPose() {
    companion.dataset.state = poses[pose].name;
    bubble.textContent = poses[pose].message;
  }

  function nextPose() {
    timer = window.setTimeout(() => {
      pose = (pose + 1) % poses.length;
      renderPose();
      nextPose();
    }, poses[pose].duration);
  }

  function stop() {
    window.clearTimeout(timer);
    timer = 0;
    running = false;
  }

  function sync() {
    const enabled = desktop.matches && !document.hidden && !reduced.matches && !root.classList.contains('motion-paused');
    companion.hidden = !desktop.matches;
    companion.classList.toggle('companion-still', !enabled);
    if (!enabled) {
      stop();
      pose = 0;
      renderPose();
      return;
    }
    if (running) return;
    running = true;
    pose = 0;
    renderPose();
    nextPose();
  }

  desktop.addEventListener('change', sync);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  sync();
})();
