/* Texas Public Land Guide (working name) - plain JS, no build step. Works from file:// and http. */
(function () {
  'use strict';
  var D = window.WMA_DATA, PH = window.WMA_PHOTOS || {};
  var META = D.meta, SOURCES = D.SOURCES, AREAS = D.areas;
  var PHTXT = 'PLACEHOLDER: awaiting data';

  // ---- Hunting Bot drop-in merge (data/hunting-bot.js) ----
  var HB = window.HUNTING_BOT_DATA || {};
  Object.keys(HB).forEach(function (id) {
    var a = AREAS.filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    if (HB[id].hunting) a.hunting = Object.assign({}, a.hunting, HB[id].hunting);
    if (HB[id].sources) Object.assign(SOURCES, HB[id].sources);
  });

  // ---- constants for release ----
  var ISSUES = 'https://github.com/jnew-code/Public-land/issues/new';
  var PRIVACY = 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';
  var DISC = META.disclaimer;

  // ---- helpers ----
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function fmtDate(iso) { var p = iso.split('-'); var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; return m[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0]; }
  function txt(t) { // escape + flag placeholders
    return esc(t).split(esc(PHTXT)).join('<span class="ph-flag">' + PHTXT + '</span>');
  }
  var SPECIES = { deer: 'Deer', hog: 'Feral hog', waterfowl: 'Waterfowl', dove: 'Dove', 'small-game': 'Small game', quail: 'Quail', turkey: 'Turkey' };
  var ACCESS = { aph: 'APH walk-in', drawn: 'Drawn hunts', 'state-park': 'State park entry' };
  var LANDSCAPE = { 'cross-timbers': 'Cross Timbers', 'blackland-post-oak': 'Blackland / Post Oak', 'hill-country': 'Hill Country' };
  var HUBS = { clifton: 'Clifton', collegeStation: 'College Station', waco: 'Waco', temple: 'Temple / Killeen', austin: 'Austin', stephenville: 'Stephenville', brownwood: 'Brownwood', llano: 'Llano / San Saba' };
  var NEAR_KEY = { clifton: 'clifton', 'college-station': 'collegeStation', waco: 'waco', temple: 'temple', austin: 'austin', stephenville: 'stephenville', brownwood: 'brownwood', llano: 'llano' };
  var NEAR_MI = 75;

  // season helpers: a page is "verified for the current season" only if its last-verified date falls in that season (Sep 1 - Aug 31)
  function seasonOf(iso) { var p = iso.split('-').map(Number); var y = p[1] >= 9 ? p[0] : p[0] - 1; return y + '-' + String((y + 1) % 100).padStart(2, '0'); }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var CURRENT_SEASON = [seasonOf(todayISO()), META.seasonYear].sort().pop();
  function verifiedSeason(a) { return a.verifiedSeason || seasonOf(a.lastVerified || META.lastVerified); }
  function isCurrent(a) { return verifiedSeason(a) === CURRENT_SEASON; }
  function isPrivate(a) {
    return /private[- ]lands?/i.test(a.kind || '') || ((a.hunting && a.hunting.seasons) || []).some(function (s) { return /^private lands/i.test(s.species || ''); });
  }
  // long official text is shown as a short excerpt plus a link, not copied in full
  function clip(t, n) {
    t = String(t == null ? '' : t); if (t.length <= n) return { text: t, cut: false };
    var s = t.slice(0, n), i = Math.max(s.lastIndexOf('. '), s.lastIndexOf('; '));
    s = i > n * 0.5 ? s.slice(0, i + 1) : s.slice(0, s.lastIndexOf(' '));
    return { text: s.replace(/[\s,;:]+$/, '') + '…', cut: true };
  }
  function srcLink(ids) { var id = (ids || []).filter(function (x) { return SOURCES[x]; })[0]; return id ? ' <a class="small" href="' + esc(SOURCES[id].url) + '" rel="noopener">Full details on TPWD ↗</a>' : ''; }
  function plainBots(s) { return String(s == null ? '' : s).replace(/^Fishing Bot(\'s)?/, function (m, p) { return p ? "The earlier draft's" : 'The earlier draft'; }).replace(/Fishing Bot(\'s)?/g, function (m, p) { return p ? "the earlier draft's" : 'the earlier draft'; }); }
  function verifyHTML(a) {
    var d = verifiedDate(a), vs = verifiedSeason(a);
    return isCurrent(a)
      ? '<div class="verify-badge">✔ Last verified: ' + d + ' <span class="small" style="font-weight:500">· ' + esc(vs) + ' season (checked against TPWD pages)</span></div>'
      : '<div class="verify-badge stale">⚠ Not verified for the current season (' + esc(CURRENT_SEASON) + '). <span class="small" style="font-weight:500">Last verified ' + d + ' for the ' + esc(vs) + ' season. Check TPWD before you go.</span></div>';
  }

  // citation registry (per page)
  var cites = [];
  function cite(ids) {
    if (!ids || !ids.length) return '';
    return ids.map(function (id) {
      if (!SOURCES[id]) return '';
      var n = cites.indexOf(id); if (n < 0) { cites.push(id); n = cites.length - 1; }
      return '<sup class="cite"><a href="#src-' + (n + 1) + '" aria-label="Source ' + (n + 1) + '">[' + (n + 1) + ']</a></sup>';
    }).join('');
  }
  function textOrNone(t, src) { return t == null || t === '' ? '<span class="not-stated">Not stated in official sources</span>' : txt(t) + cite(src); }

  // ---- shared chrome ----
  function chrome(page) {
    var logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 27 L12 9 L17 18 L21 12 L29 27Z" fill="#e0590c"/><path d="M3 27 L12 9 L17 18 L11 27Z" fill="#fff" opacity=".18"/><circle cx="25" cy="7" r="3" fill="#ffd9bd"/></svg>';
    var link = function (href, label, key) { return '<a href="' + href + '"' + (page === key ? ' aria-current="page"' : '') + '>' + label + '</a>'; };
    var back = page === 'home' ? '' : '<a class="back" href="index.html" aria-label="Back to all areas">‹ All areas</a>';
    $('#chrome-top').innerHTML = '<header class="site-header"><div class="wrap inner">' + back + '<a class="brand" href="index.html">' + logo + '<span>' + esc(META.workingName) + '</span></a><nav class="nav" aria-label="Main">' +
      link('index.html', 'Areas', 'home') + link('permits.html', 'Permits explained', 'permits') + link('about.html', 'About', 'about') + '</nav></div></header>';
    var upd = [META.updated, META.lastVerifiedCentral, META.lastVerified].filter(Boolean).sort().pop();
    $('#chrome-bottom').innerHTML = '<footer class="footer"><div class="wrap"><div class="disc">' + esc(DISC) + '</div>' +
      '<div><b>' + esc(META.workingName) + '</b>. Last updated ' + fmtDate(upd) + '. Each area page shows its own last-verified date. Free to use; no accounts. Not affiliated with TPWD. <a href="about.html">Data notes and photo credits</a> · <a href="' + ISSUES + '" rel="noopener">Report an error</a>.</div>' +
      '<div class="small privacy">This site doesn\'t collect personal data. It\'s hosted on GitHub Pages; see <a href="' + PRIVACY + '" rel="noopener">GitHub\'s privacy statement</a>.</div>' +
      '<div class="small bg-credit">Photos by Judd New</div></div></footer>';
  }

  // Wikimedia credit: linked title, author, linked license, and what was changed
  function creditHTML(p) {
    return '“<a href="' + esc(p.page) + '" rel="noopener">' + esc(p.title.replace(/\.jpe?g$/i, '')) + '</a>” by ' + esc(p.author) + ' via Wikimedia Commons, <a href="' + esc(p.licenseUrl) + '" rel="noopener">' + esc(p.license) + '</a>. ' + esc(p.changes || 'Resized and compressed; cropped to fit by the page layout.');
  }

  // ---- illustrated headers ----
  var PAL = {
    bottomland: { sky: ['#cfe3c2', '#f3ecc8'], far: '#8ea77a', mid: '#4f7a45', near: '#2b4f35', water: '#6d9a9a', sun: '#f6c768' },
    lake: { sky: ['#bcd9e8', '#f6efd5'], far: '#7e9e86', mid: '#4f7a5f', near: '#2c4b3a', water: '#4e86a3', sun: '#f2b860' },
    marsh: { sky: ['#f3d2a8', '#f9efd0'], far: '#b5a77a', mid: '#8a9a55', near: '#4d6a3a', water: '#5d92a3', sun: '#e0590c' }
  };
  function art(palette, seed, wide) {
    var p = PAL[palette] || PAL.bottomland, id = 'g' + seed.replace(/\W/g, '');
    var s = 0; for (var i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) % 997;
    function r(n) { s = (s * 61 + 17) % 997; return s / 997 * n; }
    var trees = '';
    for (var t = 0; t < 14; t++) {
      var x = 20 + t * 56 + r(18), h = 40 + r(46), y = 150;
      trees += '<path d="M' + x + ' ' + y + ' l-' + (10 + h / 8) + ' 0 l' + (10 + h / 8) + ' -' + h + ' l' + (10 + h / 8) + ' ' + h + 'z" fill="' + p.near + '"/>';
    }
    var reeds = '';
    if (palette === 'marsh') for (var q = 0; q < 30; q++) { var rx = 10 + q * 26 + r(10); reeds += '<path d="M' + rx + ' 170 q4 -' + (22 + r(14)) + ' 8 -' + (30 + r(12)) + '" stroke="' + p.near + '" stroke-width="2" fill="none"/>'; }
    return '<svg viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated header"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + p.sky[0] + '"/><stop offset="1" stop-color="' + p.sky[1] + '"/></linearGradient></defs>' +
      '<rect width="800" height="200" fill="url(#' + id + ')"/><circle cx="' + (560 + r(120)) + '" cy="58" r="26" fill="' + p.sun + '" opacity=".9"/>' +
      '<path d="M0 120 C120 80 200 110 320 92 S560 70 800 110 V200 H0Z" fill="' + p.far + '"/>' +
      '<path d="M0 140 C140 112 260 150 400 128 S660 112 800 138 V200 H0Z" fill="' + p.mid + '"/>' +
      (palette === 'lake' || palette === 'marsh' || palette === 'bottomland' ? '<path d="M0 168 C100 160 160 176 300 168 S560 160 800 170 V200 H0Z" fill="' + p.water + '" opacity=".92"/>' : '') +
      trees + reeds + '<path d="M0 188 C200 176 500 192 800 180 V200 H0Z" fill="' + p.near + '"/></svg>';
  }
  function headerArt(a) {
    var h = a.header;
    if (h.type === 'photo' && PH[h.key]) return '<img src="' + esc(PH[h.key].file) + '" alt="' + esc(h.alt) + '" loading="lazy">';
    return art(h.palette || 'bottomland', a.id);
  }

  // ---- distance ----
  function miles(a, townKey) {
    var m = a.approxMiles || {};
    if (townKey === 'clifton') return m.clifton;
    if (townKey === 'cs' || townKey === 'college-station' || townKey === 'collegeStation') return m.collegeStation;
    return m[townKey];
  }
  function nearestHub(a) {
    var m = a.approxMiles || {}, best = null, bestN = Infinity;
    Object.keys(HUBS).forEach(function (k) {
      if (typeof m[k] === 'number' && m[k] < bestN) { bestN = m[k]; best = k; }
    });
    return best ? { key: best, miles: bestN, label: HUBS[best] } : null;
  }
  function verifiedDate(a) { return fmtDate(a.lastVerified || META.lastVerified); }
  function hasPlaceholder(a) {
    if (a.hunting.status === 'placeholder') return true;
    if (a.hunting.seasons.some(function (s) { return s.status === 'placeholder'; })) return true;
    return a.access.some(function (x) { return x.placeholder; });
  }

  // ---- HOME ----
  function card(a) {
    var chips = a.accessTypes.map(function (t) { return '<span class="chip access">' + ACCESS[t] + '</span>'; }).join('') +
      a.species.map(function (s) { return '<span class="chip">' + (SPECIES[s] || s) + '</span>'; }).join('') +
      (a.hasFishing ? '<span class="chip water">Fishing</span>' : '') +
      (hasPlaceholder(a) ? '<span class="chip ph">Has placeholders</span>' : '') + (isPrivate(a) ? '<span class="chip ph">Private land · drawn permit only</span>' : '') + (isCurrent(a) ? '' : '<span class="chip ph">Not verified for current season</span>');
    var outChip = (a.region === 'outside' ? '<span class="chip out">Example outside Central Texas</span>' : '');
    var land = a.subregion && LANDSCAPE[a.subregion] ? '<span class="chip near">' + LANDSCAPE[a.subregion] + '</span>' : '';
    var lease = a.annualLease ? '<span class="chip ph">Annual unit</span>' : '';
    var nh = a.region === 'outside' || isPrivate(a) ? null : nearestHub(a);
    var near = nh ? '<div class="chips"><span class="chip near">~' + nh.miles + ' mi from ' + esc(nh.label) + '</span></div>' : '';
    return '<article class="card" data-id="' + a.id + '"><a class="thumb" href="area.html?id=' + a.id + '" tabindex="-1" aria-hidden="true">' + headerArt(a) + '</a><div class="body">' +
      '<div class="kicker">' + esc(a.kind) + ' · ' + esc(a.county) + ' County</div><h3><a href="area.html?id=' + a.id + '">' + esc(a.name) + '</a></h3>' +
      '<p class="muted small" style="margin:0">' + esc(a.blurb) + '</p><div class="chips">' + chips + land + lease + outChip + '</div>' + near +
      '<div class="verified"><strong>Last verified:</strong> ' + verifiedDate(a) + ' · ' + esc(verifiedSeason(a)) + ' season</div></div></article>';
  }
  function haystack(a) {
    return [a.name, a.county, a.kind, a.blurb, a.accessLabel, a.acres, (a.species || []).join(' '), a.subregion || '', a.id].join(' ').toLowerCase();
  }
  function groupAreas(list) {
    var order = ['cross-timbers', 'blackland-post-oak', 'hill-country', 'outside', ''];
    var groups = {};
    list.forEach(function (a) {
      var k = a.region === 'outside' ? 'outside' : (a.subregion || '');
      (groups[k] = groups[k] || []).push(a);
    });
    return order.filter(function (k) { return groups[k] && groups[k].length; }).map(function (k) {
      var title = k === 'outside' ? 'Example outside Central Texas' : (LANDSCAPE[k] || 'Other areas');
      return { key: k, title: title, items: groups[k] };
    });
  }
  function home() {
    var form = $('#finder'), list = $('#list'), count = $('#count');
    var params = new URLSearchParams(location.search);
    ['q', 'species', 'access', 'landscape', 'near'].forEach(function (k) { if (params.get(k) && form.elements[k]) form.elements[k].value = params.get(k); });
    form.elements.fishing.checked = params.get('fishing') === '1';
    form.elements.outside.checked = params.get('outside') !== '0';
    function apply() {
      var q = form.elements.q.value.trim().toLowerCase(), sp = form.elements.species.value, ac = form.elements.access.value,
        fi = form.elements.fishing.checked, nr = form.elements.near.value, ou = form.elements.outside.checked,
        ls = form.elements.landscape ? form.elements.landscape.value : '';
      var res = AREAS.filter(function (a) {
        if (q && haystack(a).indexOf(q) < 0) return false;
        if (sp && a.species.indexOf(sp) < 0) return false;
        if (ac && a.accessTypes.indexOf(ac) < 0) return false;
        if (ls && a.subregion !== ls) return false;
        if (fi && !a.hasFishing) return false;
        if (nr) {
          var key = NEAR_KEY[nr];
          var d = key ? miles(a, key) : null;
          if (!(typeof d === 'number' && d <= NEAR_MI && a.region !== 'outside')) return false;
        }
        if (!ou && a.region === 'outside') return false;
        return true;
      });
      if (nr && NEAR_KEY[nr]) {
        var nk = NEAR_KEY[nr];
        res.sort(function (x, y) {
          var dx = miles(x, nk), dy = miles(y, nk);
          if (dx === dy) return x.name.localeCompare(y.name);
          return (dx || 9999) - (dy || 9999);
        });
      } else {
        res.sort(function (x, y) { return x.name.localeCompare(y.name); });
      }
      count.textContent = res.length + (res.length === 1 ? ' area' : ' areas');
      var html;
      if (!res.length) {
        html = '<div class="empty"><b>No areas match.</b><p class="muted">Try removing a filter. This guide has ' + AREAS.length + ' areas.</p><button class="btn ghost" type="button" id="clear2">Clear filters</button></div>';
      } else if (nr) {
        html = '<div class="grid">' + res.map(card).join('') + '</div>';
      } else {
        html = groupAreas(res).map(function (g) {
          return '<h2 class="section-label">' + esc(g.title) + ' <span class="muted small">(' + g.items.length + ')</span></h2><div class="grid">' + g.items.map(card).join('') + '</div>';
        }).join('');
      }
      list.innerHTML = html;
      var c2 = $('#clear2'); if (c2) c2.onclick = clear;
      var np = new URLSearchParams();
      if (q) np.set('q', q); if (sp) np.set('species', sp); if (ac) np.set('access', ac); if (ls) np.set('landscape', ls); if (fi) np.set('fishing', '1'); if (nr) np.set('near', nr); if (!ou) np.set('outside', '0');
      var qs = np.toString(); try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* file:// quirks */ }
    }
    function clear() { form.reset(); form.elements.outside.checked = true; apply(); }
    form.addEventListener('input', apply);
    form.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    $('#clear').onclick = clear;
    apply();
  }

  // ---- AREA ----
  function list(items) { return items.join(''); }
  function fishBlock(a) {
    var f = a.fishing;
    if (!f) return '<section class="panel fish" id="fishing"><h2>Fishing</h2><p>No fishing block for this area: TPWD lists no fishing here' + (a.id === 'keechi-creek-wma' ? ' (fishing is not permitted on Keechi Creek WMA)' : '') + '.</p></section>';
    var h = '<section class="panel fish" id="fishing"><h2>Fishing</h2>';
    if (f.status === 'partial') h += '<p><span class="ph-flag">PLACEHOLDER: awaiting data</span> Partial block: only what TPWD pages say is shown. The rest reads "Not stated in official sources".</p>';
    h += '<p class="muted small">' + esc(plainBots(f.intro)) + '</p>';
    h += '<h3>Species</h3><p>' + (f.species ? textOrNone(f.species.text, f.species.src) : textOrNone(null)) + '</p>';
    h += '<h3>Best months by species</h3><ul class="kv">' + f.bestMonths.map(function (m) { return '<li><b>' + esc(m.species) + '</b>' + textOrNone(m.text, m.src) + '</li>'; }).join('') + '</ul>';
    h += '<h3>Access</h3><ul class="kv">' + f.access.map(function (m) { return '<li class="' + (m.conflict ? 'conflict' : '') + '"><b>' + esc(m.label) + '</b>' + textOrNone(m.text, m.src) + '</li>'; }).join('') + '</ul>';
    h += '<h3>License and regulation notes</h3><ul class="kv">' + f.license.map(function (m) { return '<li class="' + (m.conflict ? 'conflict' : '') + '"><b>' + esc(m.label) + '</b>' + textOrNone(m.text, m.src) + '</li>'; }).join('') + '</ul>';
    h += '<h3>Tips</h3>' + (f.tips && f.tips.length ? '<ul>' + f.tips.map(function (t) { return '<li>' + txt(t.text) + cite(t.src) + '</li>'; }).join('') + '</ul>' : '<p><span class="not-stated">Not stated in official sources</span></p>');
    if (f.checkNotes && f.checkNotes.length) h += '<details class="more checknotes" style="margin-top:12px"><summary>Check notes: where sources differ or could not be confirmed</summary><ul>' + f.checkNotes.map(function (n) { return '<li>' + txt(plainBots(n)) + '</li>'; }).join('') + '</ul></details>';
    h += '<p class="small muted" style="margin-top:10px">Fishing sources: ' + (f.sources || []).map(function (id) { return SOURCES[id] ? cite([id]) : ''; }).join(' ') + '</p>';
    return h + '</section>';
  }
  function area() {
    var id = new URLSearchParams(location.search).get('id');
    var a = AREAS.filter(function (x) { return x.id === id; })[0], root = $('#area');
    if (!a) { document.title = 'Area not found'; root.innerHTML = '<div class="empty" style="margin-top:20px"><h1>Area not found</h1><p><a class="btn" href="index.html">Back to all areas</a></p></div>'; return; }
    document.title = a.name + ' · ' + META.workingName;
    var photo = a.header.type === 'photo' && PH[a.header.key] ? PH[a.header.key] : null;
    var errUrl = ISSUES + '?title=' + encodeURIComponent('Error report: ' + a.name) + '&body=' + encodeURIComponent('Area: ' + a.name + ' (' + a.id + ')\nPage: ' + location.href.split('#')[0] + '\n\nWhat looks wrong, and the TPWD page that shows the correct info:\n');
    var h = '<div class="sheet-block"><p class="crumb"><a href="index.html">← All areas</a></p>';
    h += '<div class="area-hero"><div class="art">' + headerArt(a) + '</div></div>';
    h += '<p class="photo-credit">' + (photo ? esc(a.header.caption) + ' ' + creditHTML(photo) : 'Illustrated header (not a photo of the area).') + '</p>';
    h += '<h1 class="area-title">' + esc(a.name) + '</h1><div class="kicker">' + esc(a.kind) + ' · ' + esc(a.county) + ' County · ' + esc(a.acres) + '</div>';
    h += verifyHTML(a);
    h += '<div class="disclaimer top-disclaimer">' + esc(DISC) + '</div>';
    if (isPrivate(a)) h += '<div class="private-notice" role="alert"><b>Private property.</b> Access ONLY with a valid drawn permit for the listed dates. Entering otherwise is trespassing. <a href="' + esc(a.directions.url) + '" rel="noopener">Official TPWD listing ↗</a> (this guide gives no directions or entry points beyond what TPWD shows).</div>';
    if (a.region === 'outside') h += '<div class="outside-flag">Example outside Central Texas. ' + esc(a.outsideNote || '') + '</div>';
    if (a.annualLease) h += '<div class="outside-flag">Annual APH lease unit: this tract can change or drop out of the program from year to year. This page is for the ' + esc(verifiedSeason(a)) + ' season only. Check the current Public Hunting Lands Map Booklet before you go.</div>';
    h += '<p>' + esc(a.blurb) + '</p><p class="small"><a class="report-link" href="' + esc(errUrl) + '" rel="noopener">Report an error on this page ↗</a></p>';
    h += '</div>';

    // permits + quick facts
    h += '<section class="panel" id="permit"><h2>Required permit</h2><dl class="facts">' +
      '<div><dt>Permit</dt><dd>' + esc(a.quickFacts.permit) + '</dd></div><div><dt>Access</dt><dd>' + esc(a.quickFacts.access) + '</dd></div>' +
      '<div><dt>Species</dt><dd>' + esc(a.quickFacts.species) + '</dd></div><div><dt>Key dates</dt><dd>' + esc(a.quickFacts.bestMonths) + '</dd></div></dl>' +
      '<ul class="permit-list" style="margin-top:12px">' + a.permits.map(function (p) { return '<li><a href="' + esc(p.url) + '" rel="noopener">' + esc(p.label) + ' ↗</a>' + (p.note ? '<div class="small muted">' + txt(p.note) + '</div>' : '') + '</li>'; }).join('') + '</ul>' +
      '<p class="small"><a href="permits.html">Permits explained</a> (APH, LPU, drawn hunts)</p></section>';

    // species + seasons
    h += '<section class="panel" id="seasons"><h2>Species and seasons (' + esc(verifiedSeason(a)) + ')</h2>';
    if (a.hunting.status === 'placeholder') h += '<p><span class="ph-flag">' + PHTXT + '</span> Season details for this area are not available yet.</p>';
    h += '<p class="muted small">' + txt(a.hunting.summary) + '</p><div class="seasons">' + a.hunting.seasons.map(function (s) {
      var ph = s.status === 'placeholder';
      return '<div class="season' + (ph ? ' placeholder' : '') + '"><h3>' + txt(s.species) + (ph ? ' <span class="ph-flag">' + PHTXT + '</span>' : '') + '</h3><div class="when">' + txt(s.season) + cite(s.src) + '</div>' + (s.notes ? (function () { var c = clip(s.notes, 260); return '<div class="small">' + txt(c.text) + (c.cut ? srcLink(s.src) : '') + '</div>'; })() : '') + '</div>';
    }).join('') + '</div>';
    if (a.hunting.extra) h += '<p style="margin-top:10px">' + (function () { var c = clip(a.hunting.extra, 320); return txt(c.text) + cite(a.hunting.extraSrc) + (c.cut ? srcLink(a.hunting.extraSrc) : ''); })() + '</p>';
    h += '</section>';

    // access
    h += '<section class="panel" id="access"><h2>Access and facilities</h2><ul class="kv">' + a.access.map(function (x) { return '<li><b>' + esc(x.label) + '</b>' + txt(x.text) + cite(x.src) + '</li>'; }).join('') + '</ul></section>';

    // maps
    h += '<section class="panel" id="maps"><h2>Official TPWD maps and directions</h2><p class="small muted">Links open TPWD\'s own maps. This guide does not draw boundaries or drop pins.</p><div class="btn-row">' +
      a.maps.map(function (m) { return '<a class="btn ghost small" href="' + esc(m.url) + '" rel="noopener">' + esc(m.label) + ' ↗</a>' + cite(m.src); }).join('') +
      '<a class="btn small" href="' + esc(a.directions.url) + '" rel="noopener">' + esc(a.directions.label) + ' ↗</a></div>' +
      '<p class="small" style="margin-top:10px">' + esc(a.address || '') + (a.phone ? ' · ' + esc(a.phone) : '') + '</p>' +
      (a.region !== 'outside' && !isPrivate(a) && a.approxMiles ? '<p class="small muted">' + ['clifton','collegeStation','waco','austin','temple','stephenville','brownwood','llano'].filter(function(k){ return typeof a.approxMiles[k] === 'number'; }).map(function(k){ return '~' + a.approxMiles[k] + ' mi from ' + HUBS[k]; }).join('; ') + '. ' + esc(META.distanceNote) + '</p>' : '') + '</section>';

    // zones
    h += '<section class="panel" id="zones"><h2>Best zones</h2>' + (a.zones.length ? '<ul>' + a.zones.map(function (z) { return '<li>' + txt(z.text) + cite(z.src) + '</li>'; }).join('') + '</ul>' : '') + '<p class="small muted">' + esc(a.zonesNote) + '</p></section>';

    h += fishBlock(a);

    h += '<section class="panel" id="notes"><h2>Judd\'s field notes</h2><div class="field-notes">No notes yet. Judd\'s own trip notes for this area go here.</div></section>';

    // sources: cited first, then any other area-level sources
    (a.fishing && a.fishing.sources || []).forEach(function (s) { cite([s]); });
    h += '<section class="panel" id="sources"><h2>Sources</h2><ol class="sources">' + cites.map(function (sid, i) {
      return '<li id="src-' + (i + 1) + '"><a href="' + esc(SOURCES[sid].url) + '" rel="noopener">' + esc(SOURCES[sid].label) + ' ↗</a></li>';
    }).join('') + '</ol><p class="small muted">All official TPWD pages. Checked ' + verifiedDate(a) + '.</p></section>';
    h += '<div class="disclaimer">' + esc(DISC) + ' <a class="report-link" href="' + esc(errUrl) + '" rel="noopener">Report an error ↗</a></div>';
    root.innerHTML = h;
  }

  // ---- boot ----
  var page = document.body.getAttribute('data-page');
  chrome(page);
  if (page === 'home') { home(); var art0 = $('#hero-art'); if (art0) art0.innerHTML = art('lake', 'hero'); }
  if (page === 'area') area();
  if (page === 'about') {
    var ul = $('#credits'); if (ul) ul.innerHTML = Object.keys(PH).map(function (k) { return '<li>' + creditHTML(PH[k]) + '</li>'; }).join('') + '<li>Background photos: Photos by Judd New.</li>';
    var st = $('#areastatus'); if (st) st.innerHTML = AREAS.map(function (a) {
      var fs = a.fishing ? a.fishing.status : 'none';
      return '<tr><td><a href="area.html?id=' + a.id + '">' + esc(a.name) + '</a>' + (a.region === 'outside' ? '<br><span class="small muted">outside Central Texas</span>' : (a.subregion && LANDSCAPE[a.subregion] ? '<br><span class="small muted">' + LANDSCAPE[a.subregion] + ' · ' + esc(a.county) + '</span>' : '')) + '</td><td>' + (a.hunting.status === 'placeholder' ? '<span class="ph-flag">PLACEHOLDER</span>' : 'TPWD-sourced') + (hasPlaceholder(a) && a.hunting.status !== 'placeholder' ? ' <span class="ph-flag">some rows PLACEHOLDER</span>' : '') + ' <span class="small muted">' + verifiedDate(a) + '</span></td><td>' + esc(fs.replace(/-/g, ' ')) + '</td></tr>';
    }).join('');
  }

  // ---- offline support (needs https or localhost; silently skipped on file://) ----
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js', { scope: './' }).catch(function (e) { console.warn('Service worker not registered', e); });
    });
  }
})();
