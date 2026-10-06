/* =====================================================================
   eras.js — the era layer. Load AFTER script.js.
   It extends the existing era system without editing script.js:
     - adds 1991 and 1993 to the timeline
     - builds the 1991 onboarding document
     - adds Mosaic-style chrome to every window (shown only in 1993)
     - keeps tracking OFF in 1991/1993 (nothing is logged, counted, or scored)
   Later, once the eras settle, this can be folded into script.js.
===================================================================== */
(function () {
  const EARLY = ['1991', '1993'];
  const isEarly = (k) => EARLY.indexOf(k) !== -1;

  /* ---------- 1. timeline entries ---------- */
  ERAS.unshift(
    { key: '1991', label: '1991', name: 'the first pages',
      note: 'a few linked documents at a physics lab. no images, no accounts, no feed.' },
    { key: '1993', label: '1993', name: 'public domain & browsers',
      note: 'CERN releases the web\u2019s code into the public domain (April 1993) and Mosaic gives it a face: images inline with text, a back button, a hotlist. no ads, no accounts, no feed \u2014 and still nothing collecting what you click.' }
  );
  eraPopupInterval['1991'] = 0;
  eraPopupInterval['1993'] = 0;

  const bar = document.getElementById('eraBar');
  const firstBtn = bar.querySelector('.era-btn');
  ['1991', '1993'].forEach((k) => {
    const b = document.createElement('button');
    b.className = 'era-btn';
    b.dataset.era = k;
    b.textContent = k;
    b.onclick = () => setEra(k);
    bar.insertBefore(b, firstBtn);
  });

  // 1999-2003: the dot-com era, inserted right after 1996's "early web" step.
  const idx1996 = ERAS.findIndex((e) => e.key === '1996');
  ERAS.splice(idx1996 + 1, 0, {
    key: '1999', label: '1999', name: 'the dot-com era',
    note: 'portals compete for your homepage, search engines race to index everything, and personal sites go up alongside them \u2014 all under glossy, Y2K-optimistic chrome. banner ads and pop-ups are now a business model, not an experiment.',
  });
  eraPopupInterval['1999'] = 25000;
  const btn1996 = bar.querySelector('.era-btn[data-era="1996"]');
  const btn1999 = document.createElement('button');
  btn1999.className = 'era-btn';
  btn1999.dataset.era = '1999';
  btn1999.textContent = '1999';
  btn1999.onclick = () => setEra('1999');
  btn1996.after(btn1999);

  /* ---------- 2. the 1991 onboarding document ---------- */
  const overlay = document.createElement('div');
  overlay.id = 'era1991';
  overlay.innerHTML = `
    <div class="doc1991">
      <h1>The World Wide Web</h1>
      <p>This is a simple hypertext about the Web, and about what happens to it
       over time as it is tuned for efficiency, prediction, and money.
        You are starting where it started, in 1991. It is just a few pages of linked text, 
        nothing else :)</p>
      <p>Everything here is linked, directly or indirectly, to this site. 
      Click an underlined word to follow it. There is no menu, no search box, 
      no "ranking", and nothing tracking which links you choose.</p>
      <dl>
        <dt><a data-go="hyper">What is HyperText?</a></dt>
        <dd>Hypertext is essentially just text that links to something else. Thats more or less the whole idea.</dd>
        
        <dt><a data-go="thesis">The thesis</a></dt>
        <dd>What this project/I am exploring.</dd>
        <dt><a data-go="enter">Getting a browser</a></dt>
        <dd>1993: the code is released to the public, and a friendlier window 
        opens onto all this. Click there when you're ready to see the next "era" of the internet!</dd>
      </dl>
    </div>
  `;
  document.body.appendChild(overlay);

  const subpages = {
    hyper: {
      title: 'What is HyperText',
      body: `
        <p>Hypertext is digital text containing clickable links, 
        known as hyperlinks, that let readers/users jump directly to other text, pages, or files</p>
        <p>A link is a promise between two documents, made by whoever wrote the
         first one. </p>
        <p>There are no accounts, no profiles, no feed, and no cookies yet... 
        those arrive later...</p>`,
    },
    
    thesis: {
      title: 'The Thesis',
      body: `
        <p>As digital environments optimize interaction for efficiency, prediction,
         and monetization, integral elements of human connection, expression, and 
         authorship get removed, concealed, or flattened, because optimization
          has become one of the only values it&rsquo;s measured against.</p>
        <p>A timeline appears once you continue to 1993. Each step forward changes 
        the site. Take notice of what is asked of you, what is recorded, what is being 
        removed.</p>`,
    },
  };
  function showSubpage(page) {
    overlay.querySelector('.doc1991').innerHTML = `
      <h1>${page.title}</h1>
      ${page.body}
      <p><a data-go="home">Back to home</a></p>`;
    overlay.scrollTop = 0;
  }
  const homeHTML = overlay.querySelector('.doc1991').innerHTML;
  function showHome() {
    overlay.querySelector('.doc1991').innerHTML = homeHTML;
    overlay.scrollTop = 0;
  }

  overlay.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-go]');
    if (!a) return;
    e.preventDefault();
    const go = a.dataset.go;
    if (go === 'enter') { setEra('1993'); return; }
    if (go === 'home') { showHome(); return; }
    a.classList.add('v');
    const page = subpages[go];
    if (page) showSubpage(page);
  });

  /* ---------- 3. Mosaic chrome inside every window ---------- */
  const globe = '<svg viewBox="0 0 40 40" width="34" height="34"><circle cx="20" cy="20" r="15" fill="#3b4fa8" stroke="#000080" stroke-width="2"/><ellipse cx="20" cy="20" rx="7" ry="15" fill="none" stroke="#c8c8ff"/><line x1="5" y1="20" x2="35" y2="20" stroke="#c8c8ff"/></svg>';
  Object.keys(windowTitles).forEach((id) => {
    const w = document.getElementById(id);
    if (!w) return;
    const slug = id.replace('win-', '');

    const chrome = document.createElement('div');
    chrome.className = 'mos-chrome';
    chrome.innerHTML = `
      <div class="mos-menu"><span>File</span><span>Options</span><span>Navigate</span><span>Annotate</span><span>Hotlist</span><span class="r">Help</span></div>
      <div class="mos-tools"><button>\u25c0</button><button>\u25b6</button><button data-act="reload">\u27f3</button><button data-act="home">\u2302</button><button>\u25a4</button><button>?</button></div>
      <div class="mos-fields">
        <div>
          <div class="mos-row"><label>Document Title:</label><input readonly value="${windowTitles[id]}"></div>
          <div class="mos-row"><label>Document URL:</label><input readonly value="http://thirdspace.local/${slug}.html"></div>
        </div>
        <div class="mos-globe">${globe}</div>
      </div>`;
    w.querySelector('.titlebar').after(chrome);

    const foot = document.createElement('div');
    foot.className = 'mos-foot';
    foot.innerHTML = ['Back', 'Forward', 'Home', 'Reload', 'Open...', 'Save As...', 'Clone', 'New Window', 'Close Window']
      .map((l) => `<button${l === 'Back' || l === 'Forward' ? ' disabled' : ''} data-l="${l}">${l}</button>`).join('');
    w.appendChild(foot);

    w.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'home' || b.dataset.l === 'Home') openWindow('win-home');
      if (b.dataset.l === 'Close Window') closeWindow(id);
    });
  });

/* ---------- 3b. the 1999 splash (long preloader) ---------- */
const splash = document.createElement('div');
splash.id = 'era1999';
splash.innerHTML = `
  <div class="s99-swirl"></div>
  <div class="s99-lines"></div>
    <svg class="s99-geo" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
    <g class="g-t">
      <path d="M180 330H1000 M120 372H1000 M300 392H1000 M420 420H1000 M560 445H1000 M240 478H1000 M650 500H1000 M500 540H1000 M380 566H1000 M720 140V330 M760 200V470 M805 160V400 M850 260V600 M905 120V380 M945 300V600 M980 180V520 M690 380V600 M880 330V470 M610 420V600"/>
      <path d="M20 28H250 M250 36H500 M360 0V34 M330 0V22 M330 22H380 M330 10H420"/>
      <rect x="640" y="520" width="120" height="80"/>
      <rect x="790" y="545" width="95" height="55"/>
      <rect x="715" y="395" width="60" height="75"/>
    </g>
    <g class="g-m">
      <path d="M400 360H1000 M520 405H1000 M610 465H1000 M350 515H1000 M700 300H1000 M590 575H1000 M740 250V430 M830 380V600 M920 200V330 M965 420V600 M660 440V560"/>
      <path d="M250 14V36 M210 8H300"/>
    </g>
    <g class="g-k">
      <path d="M300 350H1000 M975 330V600 M770 250V345 M870 420V560 M560 478V600"/>
    </g>
  </svg>
  <div class="s99-band"></div>
  <div class="s99-mark">third space</div>
  <div class="s99-burst">${[0,45,90,135,180,225,270,315].map(a => `<i style="--a:${a}deg"></i>`).join('')}</div>
  <div class="s99-pills">
  <img class="s99-pill" src="assets/1999/pill_1.png" alt="" style="--x:10%; --y:34%; --w:var(--u); --rot:-6deg; --d:.3s">
  <img class="s99-pill" src="assets/1999/pill_2.png" alt="" style="--x:32%; --y:27%; --w:calc(var(--u)*.72); --rot:-4deg; --d:.8s">
  <img class="s99-pill" src="assets/1999/pill_3.png" alt="" style="--x:47%; --y:20%; --w:calc(var(--u)*.52); --rot:-2deg; --d:1.3s">
  <img class="s99-pill" src="assets/1999/pill_4.png" alt="" style="--x:58%; --y:16%; --w:calc(var(--u)*.36); --rot:0deg; --d:1.8s">
</div>
  <div class="s99-copy">
    <div class="s99-tag">a website, made with Macromedia Flash\u2122</div>
    <p>this site follows the web as it changes over time. each era you visit asks something different of you.
       please wait while your experience is prepared.</p>
  </div>
  <div class="s99-load">
    <div class="s99-status">initializing...</div>
    <div class="s99-bar"><div class="s99-fill"></div></div>
    <div class="s99-pct">0%</div>
    <a class="s99-enter">enter site</a>
  </div>
  <div class="s99-note">best experienced at 800\u00d7600 &middot; get the Flash 4 plug-in</div>`;
document.body.appendChild(splash);

// [ms, percent] checkpoints: stalls and jumps so it feels like a real preloader.
// Change the last time value to make the whole wait longer or shorter.
const SPLASH_STEPS = [[0,0],[900,8],[2000,27],[3200,30],[4600,63],[5800,66],[7600,100]];
const SPLASH_MSGS = [[0,'initializing...'],[1200,'loading assets...'],[2800,'connecting to server...'],
                     [4400,'building your profile...'],[6000,'optimizing your experience...']];
const sFill = splash.querySelector('.s99-fill');
const sPct = splash.querySelector('.s99-pct');
const sStatus = splash.querySelector('.s99-status');
let splashStart = 0, splashRaf = null, splashReady = false;

function splashPercent(t) {
  for (let i = 1; i < SPLASH_STEPS.length; i++) {
    const [t1, p1] = SPLASH_STEPS[i];
    if (t <= t1) {
      const [t0, p0] = SPLASH_STEPS[i - 1];
      return p0 + (p1 - p0) * ((t - t0) / (t1 - t0));
    }
  }
  return 100;
}
function tickSplash() {
  const t = performance.now() - splashStart;
  const p = splashPercent(t);
  sFill.style.width = p + '%';
  sPct.textContent = Math.floor(p) + '%';
  sStatus.textContent = SPLASH_MSGS.filter((m) => t >= m[0]).pop()[1];
  if (p >= 100) {
    splashReady = true;
    splash.classList.add('ready');
    sStatus.textContent = 'ready.';
    return;
  }
  splashRaf = requestAnimationFrame(tickSplash);
}
function showSplash1999() {
  cancelAnimationFrame(splashRaf);
  splashReady = false;
  splash.classList.remove('show', 'ready', 'play');
  void splash.offsetWidth;                 // restart the CSS animations
  splash.classList.add('show', 'play');
  splashStart = performance.now();
  tickSplash();
}
function hideSplash1999() {
  cancelAnimationFrame(splashRaf);
  splash.classList.remove('show', 'ready', 'play');
  if (currentEra === '1999') {             // pop-ups start once the visitor is in
    for (let i = 0; i < 2; i++) setTimeout(spawnPopup, 1500 + i * 900);
  }
}
splash.addEventListener('click', () => { if (splashReady) hideSplash1999(); });

  /* ---------- 3c. portal chrome + hit counter for every window ---------- */
  let dcHits = 4812;
  function bumpHits() {
    if (currentEra !== '1999') return;
    dcHits += 1;
    document.querySelectorAll('.dc-hits .counter').forEach((s) => {
      s.textContent = 'hits: ' + String(dcHits).padStart(6, '0');
    });
  }
  document.addEventListener('click', bumpHits);

  const dcTabs = ['Home', 'News', 'Shop', 'Email', 'Chat'];
  Object.keys(windowTitles).forEach((id) => {
    const w = document.getElementById(id);
    if (!w) return;

    const chrome = document.createElement('div');
    chrome.className = 'dc-chrome';
    chrome.innerHTML = `
      <div class="dc-tabs">${dcTabs.map((t, i) => `<span${i === 0 ? ' class="on"' : ''}>${t}</span>`).join('')}</div>
      <div class="dc-search"><input placeholder="search the web" readonly><button>Go</button></div>`;
    w.querySelector('.titlebar').after(chrome);

    const foot = document.createElement('div');
    foot.className = 'dc-foot';
    foot.innerHTML = `
      <span class="dc-badge n">Netscape NOW!</span>
      <span class="dc-badge e">Get IE 5</span>
      <span class="dc-badge r">800\u00d7600</span>
      <span class="dc-hits">visitors: <span class="counter">hits: 004812</span></span>`;
    w.appendChild(foot);
  });

  /* ---------- 4. no tracking before 1994 ---------- */
  // Nothing is itemized in 1991/1993, and the background click counter and
  // score stay frozen at whatever they were when the visitor entered.
  let snap = { c: 0, f: 0 };
  const _logReceipt = window.logReceipt;
  window.logReceipt = function (label, value) {
    if (isEarly(currentEra)) return;
    _logReceipt(label, value);
  };
  document.addEventListener('click', () => {
    if (!isEarly(currentEra)) return;
    Trace.totalClicks = snap.c;
    Trace.fieldsFilled = snap.f;
    renderReceipt();
  });

  /* ---------- 4b. keep icons clear of the era bar + note ---------- */
const eraBarEl = document.getElementById('eraBar');
const eraNoteEl = document.getElementById('eraNote');
function syncChrome() {
  const barH = eraBarEl.offsetHeight;
  const root = document.documentElement.style;
  root.setProperty('--bar-h', barH + 'px');
  root.setProperty('--chrome-h', (barH + eraNoteEl.offsetHeight + 16) + 'px');
}
window.addEventListener('resize', syncChrome);
window.addEventListener('load', syncChrome);

/* ---------- 4c. windows open centered, and can't hide under the banner ---------- */
const chromeBottom = () => eraBarEl.offsetHeight + eraNoteEl.offsetHeight;

function placeWindow(w) {
  syncChrome();
  const minTop = chromeBottom() + 10;
  const openCount = document.querySelectorAll('.window.open').length;
  const nudge = ((openCount - 1) % 6) * 26;            // cascade so stacked windows don't overlap exactly
  const availH = window.innerHeight - minTop - 44;     // 44 = taskbar + breathing room
  const left = (window.innerWidth - w.offsetWidth) / 2 + nudge;
  const top = minTop + Math.max(0, (availH - w.offsetHeight) / 2) + nudge;
  w.style.left = Math.max(0, left) + 'px';
  w.style.top = Math.max(minTop, top) + 'px';
}

// center a window the first time it opens (not when you click its taskbar tab)
const _openWindow = window.openWindow;
window.openWindow = function (id) {
  const w = document.getElementById(id);
  const wasOpen = w.classList.contains('open');
  _openWindow(id);
  if (!wasOpen) placeWindow(w);
};

// pull any open window back down if the banner grows (era change / resize)
function clampOpenWindows() {
  const minTop = chromeBottom() + 4;
  document.querySelectorAll('.window.open').forEach((w) => {
    if (parseFloat(w.style.top) < minTop) w.style.top = minTop + 'px';
  });
}
window.addEventListener('resize', () => { syncChrome(); clampOpenWindows(); });

// dragging can't push a title bar under the banner
window.onDrag = function (e) {
  if (!dragState) return;
  const w = document.getElementById(dragState.id);
  const left = e.clientX - dragState.offX;
  const top = e.clientY - dragState.offY;
  w.style.left = Math.max(-100, Math.min(left, window.innerWidth - 60)) + 'px';
  w.style.top = Math.max(chromeBottom() + 4, Math.min(top, window.innerHeight - 80)) + 'px';
};

// pop-ups: drag by the red header
document.getElementById('popupLayer').addEventListener('pointerdown', (e) => {
  const head = e.target.closest('.popup-head');
  if (!head || e.target.closest('.popup-x')) return;
  const p = head.parentElement;
  const r = p.getBoundingClientRect();
  const ox = e.clientX - r.left, oy = e.clientY - r.top;
  const move = (ev) => {
    p.style.left = Math.max(0, Math.min(ev.clientX - ox, window.innerWidth - 60)) + 'px';
    p.style.top = Math.max(chromeBottom() + 4, Math.min(ev.clientY - oy, window.innerHeight - 60)) + 'px';
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);
});

  /* ---------- 5. wrap setEra ---------- */
  const _setEra = window.setEra;
  window.setEra = function (key) {
    if (!isEarly(currentEra) && isEarly(key)) {
      snap = { c: Trace.totalClicks, f: Trace.fieldsFilled };
    }
    _setEra(key);
    syncChrome();
    clampOpenWindows();
    if (key === '1991') showHome();
    if (key === '1993') {
      const home = document.getElementById('win-home');
      if (!home.classList.contains('open')) openWindow('win-home');
    }
    if (key === '1999') {
  showSplash1999();
  // (removed) for (let i = 0; i < 2; i++) setTimeout(spawnPopup, 3200 + i * 900);
}
    renderReceipt();
  };

  /* ---------- boot: the experience starts in 1991 ---------- */
  placeWindow(document.getElementById('win-home'));
  setEra('1991');
})();