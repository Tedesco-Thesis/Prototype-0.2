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
    <div class="doc1991" data-page="home">
      <h1>World Wide Web</h1>
      <p>This is a small hypertext about the World Wide Web, and about what happens to a medium when it is tuned, year after year, for efficiency, prediction and money. You are starting where it started: 1991, a few pages of linked text at a physics laboratory in Switzerland.</p>
      <p>Everything here is linked, directly or indirectly, to this document. Nothing is ranked, and nothing is recording which links you choose.</p>
      <dl>
        <dt><a data-go="hyper">What is HyperText?</a></dt>
        <dd>Text with links. The whole idea in a sentence.</dd>
        <dt><a data-go="overview">General overview</a></dt>
        <dd>There is no top. Some ways of looking around.</dd>
        <dt><a data-go="thesis">The thesis</a></dt>
        <dd>What this project argues, in plain words.</dd>
        <dt><a data-go="enter">Getting a browser</a></dt>
        <dd>1993: the code is released to the public and a friendlier window opens onto it. Continue.</dd>
      </dl>
    </div>

    <div class="doc1991" data-page="hyper">
      <h1>What is HyperText</h1>
      <p>Hypertext is text which is not constrained to be read in a line.</p>
      <p>A link is a promise between two documents, made by whoever wrote the first one. Nobody ranks the links. Nothing decides which one you should follow next.</p>
      <p>There is no account, no profile, no feed, and no cookies yet (those arrive in 1994). A page is a document. You read it, and you leave.</p>
      <p>See also:</p>
      <ul>
        <li><a data-go="overview">General overview</a></li>
        <li><a data-go="thesis">The thesis</a></li>
        <li><a data-go="home">Back to the top</a></li>
      </ul>
    </div>

    <div class="doc1991" data-page="overview">
      <h1>General Overview</h1>
      <p>There is no &quot;top&quot; to the Web. You can look at it from many points of view. Here are some ways of looking for something.</p>
      <dl>
        <dt><a data-go="hyper">By following</a></dt>
        <dd>Start anywhere, follow a link, follow another. Slow, and everything you find, you found yourself.</dd>
        <dt><a data-go="overview">By asking</a></dt>
        <dd>Write to the person who made a page. Later in this project that becomes a room of its own.</dd>
        <dt><a data-go="overview">By subject</a></dt>
        <dd>A hand-made list. Incomplete, but easy to use. Somebody had to write it.</dd>
      </dl>
      <p>In this version nothing is guessing what you want. Keep that in mind; it will not last.</p>
      <p><a data-go="home">Back to the top</a> &nbsp; <a data-go="enter">Continue to 1993</a></p>
    </div>

    <div class="doc1991" data-page="thesis">
      <h1>The Thesis</h1>
      <blockquote>As digital environments optimize interaction for efficiency, prediction, and monetization, integral elements of human connection, expression, and authorship get removed, concealed, or flattened &mdash; because optimization has become one of the only values it&rsquo;s measured against.</blockquote>
      <p>A timeline will appear at the top of the next screen. Each step forward changes the same rooms: what is asked of you, what is recorded, what is quietly removed. Notice what disappears, and when.</p>
      <p><a data-go="home">Back to the top</a> &nbsp; <a data-go="enter">Continue to 1993</a></p>
    </div>
  `;
  document.body.appendChild(overlay);

  function show1991(page) {
    overlay.querySelectorAll('.doc1991').forEach((d) =>
      d.classList.toggle('show', d.dataset.page === page));
    overlay.scrollTop = 0;
  }
  overlay.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-go]');
    if (!a) return;
    e.preventDefault();
    a.classList.add('v');
    const go = a.dataset.go;
    if (go === 'enter') setEra('1993');
    else show1991(go);
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

  /* ---------- 3b. the 1999 "skip intro" splash ---------- */
  const splash = document.createElement('div');
  splash.id = 'era1999';
  splash.innerHTML = `
    <div class="splash-shape"><i></i><i></i></div>
    <div class="splash-inner">
      <h1>THIRD SPACE</h1>
      <p>a website, made with Macromedia Flash\u2122</p>
      <div class="splash-bar"><div></div></div>
      <div class="splash-links"><a data-skip>skip intro</a> \u00b7 <a data-skip>enter site</a></div>
    </div>
    <div class="splash-note">best experienced at 800\u00d7600 &middot; get the Flash 4 plug-in</div>`;
  document.body.appendChild(splash);
  splash.addEventListener('click', () => hideSplash1999());
  function showSplash1999() {
    splash.classList.add('show');
    clearTimeout(splash._t);
    splash._t = setTimeout(hideSplash1999, 2800);
  }
  function hideSplash1999() {
    splash.classList.remove('show');
    clearTimeout(splash._t);
  }

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

  /* ---------- 5. wrap setEra ---------- */
  const _setEra = window.setEra;
  window.setEra = function (key) {
    if (!isEarly(currentEra) && isEarly(key)) {
      snap = { c: Trace.totalClicks, f: Trace.fieldsFilled };
    }
    _setEra(key);
    if (key === '1991') show1991('home');
    if (key === '1993') {
      const home = document.getElementById('win-home');
      if (!home.classList.contains('open')) openWindow('win-home');
    }
    if (key === '1999') {
      showSplash1999();
      for (let i = 0; i < 2; i++) setTimeout(spawnPopup, 3200 + i * 900);
    }
    renderReceipt();
  };

  /* ---------- boot: the experience starts in 1991 ---------- */
  setEra('1991');
})();