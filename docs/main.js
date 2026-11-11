// Voksy · site de téléchargement. Aucune dépendance : tout est dessiné ici (CSS 3D, SVG, canvas).
// changelog.js = copie de src/renderer/changelog.js (titres des versions et secours hors ligne).
import { CHANGELOG } from './changelog.js';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;
const REPO = 'MelZze/voksy-releases';
const RELEASES_PAGE = `https://github.com/${REPO}/releases`;
const finePointer = matchMedia('(pointer: fine)').matches;
root.classList.add('js'); // sans script, le contenu reste visible (pas d'apparition au défilement)

// Stockage du navigateur : peut être bloqué (navigation privée), on s'en passe alors
const saved = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* rien */
    }
  },
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();

// ---------- Animations (bouton dans la barre du haut) ----------
let still = saved.get('voksy-site-motion') === 'off';
function applyMotion() {
  root.classList.toggle('still', still);
  const b = $('#motion-toggle');
  b.setAttribute('aria-pressed', String(!still));
  b.title = still ? 'Remettre les animations' : 'Couper les animations';
}
$('#motion-toggle').addEventListener('click', () => {
  still = !still;
  saved.set('voksy-site-motion', still ? 'off' : 'on');
  applyMotion();
});
applyMotion();

// ---------- Curseur Voksy (même flèche que dans l'appli, aux couleurs du thème) ----------
function cursorUrl(fill, stroke, glow) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="1.6" flood-color="${glow}" flood-opacity=".9"/></filter></defs><path d="M6.5 5.5 26 12.2 18.2 18 13.6 26Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" filter="url(#g)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 5 4`;
}
const trailColors = { main: '#335cff', light: '#ffffff' };
function applyCursor() {
  const bg = css('--bg');
  const text = css('--text');
  const blue = css('--blue');
  trailColors.main = blue;
  trailColors.light = text;
  if (!finePointer) return;
  root.style.setProperty('--cursor-arrow', cursorUrl(bg, text, blue));
  root.style.setProperty('--cursor-pointer', cursorUrl(blue, text, blue));
  root.classList.add('voksy-cursor');
}

// ---------- Thèmes ----------
const THEMES = ['default', 'glacier', 'matcha', 'terre-cuite', 'arcade', 'graphite'];
function setTheme(theme, from) {
  if (!THEMES.includes(theme)) theme = 'default';
  const apply = () => {
    root.dataset.theme = theme;
    $$('[data-theme-pick]').forEach((b) => b.classList.toggle('active', b.dataset.themePick === theme));
    $('meta[name="theme-color"]').content = css('--bg');
    applyCursor();
  };
  if (from && document.startViewTransition && !still) {
    root.style.setProperty('--vt-x', `${from.x}px`);
    root.style.setProperty('--vt-y', `${from.y}px`);
    document.startViewTransition(apply);
  } else apply();
  saved.set('voksy-site-theme', theme);
}
$$('[data-theme-pick]').forEach((b) =>
  b.addEventListener('click', (e) => setTheme(b.dataset.themePick, { x: e.clientX || innerWidth / 2, y: e.clientY || innerHeight / 2 }))
);
setTheme(saved.get('voksy-site-theme') || 'default');

// ---------- Traînée de blocs derrière la souris ----------
(() => {
  if (!finePointer) return;
  const canvas = $('#trail');
  const ctx = canvas.getContext('2d');
  const LIFE = 560;
  const STEP = 9;
  const MAX = 170;
  let blocks = [];
  let last = null;
  let raf = 0;
  let dpr = 1;
  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  }
  resize();
  addEventListener('resize', resize);
  function draw() {
    const now = performance.now();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    blocks = blocks.filter((b) => now - b.t < LIFE);
    for (const b of blocks) {
      const k = (now - b.t) / LIFE;
      const s = b.s * (1 - k * 0.55);
      ctx.globalAlpha = (1 - k) * 0.9;
      ctx.fillStyle = b.light ? trailColors.light : trailColors.main;
      ctx.fillRect(b.x - s / 2 + b.dx * k * 14, b.y - s / 2 + k * 10, s, s);
    }
    ctx.globalAlpha = 1;
    raf = blocks.length ? requestAnimationFrame(draw) : 0;
  }
  addEventListener('pointermove', (e) => {
    if (still || e.pointerType !== 'mouse') return;
    const p = { x: e.clientX, y: e.clientY };
    if (!last) last = p;
    const dist = Math.hypot(p.x - last.x, p.y - last.y);
    const n = Math.floor(dist / STEP);
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      blocks.push({
        x: last.x + (p.x - last.x) * t + (Math.random() - 0.5) * 6,
        y: last.y + (p.y - last.y) * t + (Math.random() - 0.5) * 6,
        s: 5 + Math.random() * 5,
        dx: Math.random() - 0.5,
        light: Math.random() < 0.18,
        t: performance.now(),
      });
    }
    if (n) last = p;
    if (blocks.length > MAX) blocks.splice(0, blocks.length - MAX);
    if (!raf && blocks.length) raf = requestAnimationFrame(draw);
  });
  document.addEventListener('pointerleave', () => (last = null));
})();

// ---------- Le V de Voksy en 3D, plein (même tracé que le logo, extrudé) ----------
const V_POLYS = [
  [[108, 248], [330, 248], [523, 583], [413, 775]],
  [[696, 248], [916, 248], [611, 775], [488, 775], [592, 596], [543, 511]],
];
const V_BOX = { x: 108, y: 248, w: 808, h: 527 };
const LIGHT = [-0.35, -0.94]; // la lumière vient d'en haut à gauche
function buildV(inner, width) {
  const k = width / V_BOX.w;
  const height = V_BOX.h * k;
  const depth = width * 0.17;
  inner.style.width = `${width}px`;
  inner.style.height = `${height}px`;
  const px = (v) => `${v.toFixed(2)}px`;
  let html = '';
  for (const poly of V_POLYS) {
    const pts = poly.map(([x, y]) => [(x - V_BOX.x) * k, (y - V_BOX.y) * k]);
    const clip = `polygon(${pts.map(([x, y]) => `${px(x)} ${px(y)}`).join(',')})`;
    // Faces avant et arrière : le tracé du logo découpé dans un panneau
    html += `<i class="vf" style="clip-path:${clip};transform:translateZ(${px(depth / 2)})"></i>`;
    html += `<i class="vb" style="clip-path:${clip};transform:translateZ(${px(-depth / 2)})"></i>`;
    // Tranches : une bande par côté du tracé, éclairée selon son orientation
    let area = 0;
    pts.forEach(([x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length];
      area += x1 * y2 - x2 * y1;
    });
    pts.forEach(([x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const n = area > 0 ? [dy / len, -dx / len] : [-dy / len, dx / len];
      const light = n[0] * LIGHT[0] + n[1] * LIGHT[1];
      const bg = light > 0 ? `color-mix(in srgb, var(--blue), #fff ${Math.round(light * 40)}%)` : `color-mix(in srgb, var(--press), #000 ${Math.round(18 - light * 34)}%)`;
      const angle = Math.atan2(dy, dx);
      html += `<i class="vs" style="width:${px(len + 0.8)};height:${px(depth)};background:${bg};transform:translate3d(${px(x1)},${px(y1)},${px(-depth / 2)}) rotateZ(${angle.toFixed(4)}rad) rotateX(90deg)"></i>`;
    });
  }
  inner.innerHTML = `<div class="vsolid">${html}</div>`;
}
const heroV = $('#v3d');
const heroInner = $('#v3d-inner');
const vSize = () => (innerWidth < 560 ? 240 : innerWidth < 900 ? 300 : 420);
let builtSize = vSize();
buildV(heroInner, builtSize);
requestAnimationFrame(() => heroV.classList.add('go'));
addEventListener('resize', () => {
  if (vSize() !== builtSize) buildV(heroInner, (builtSize = vSize()));
});

// Petit V de l'appel final
const smallV = $('#v3d-small');
buildV($('.v3d-inner', smallV), 140);

// ---------- Décor de l'accueil : particules lumineuses qui montent ----------
(() => {
  const box = $('#sparks');
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('i');
    el.className = 'spark';
    const sz = (1.5 + Math.random() * 2.5).toFixed(1);
    el.style.cssText = `left:${(Math.random() * 100).toFixed(1)}%;--sz:${sz}px;--dur:${(9 + Math.random() * 10).toFixed(1)}s;--delay:${(-Math.random() * 18).toFixed(1)}s;--op:${(0.35 + Math.random() * 0.55).toFixed(2)};--sway:${((Math.random() - 0.5) * 120).toFixed(0)}px`;
    box.append(el);
  }
})();

// ---------- Inclinaison du V et parallaxe qui suivent la souris ----------
(() => {
  const target = { x: 0.5, y: 0.5 };
  const cur = { x: 0.5, y: 0.5 };
  let lastMove = 0;
  let heroVisible = true;
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe($('.hero'));
  addEventListener('pointermove', (e) => {
    target.x = e.clientX / innerWidth;
    target.y = e.clientY / innerHeight;
    lastMove = performance.now();
  });
  const layers = $$('.hero-bg [data-depth]');
  function frame(t) {
    requestAnimationFrame(frame);
    if (!heroVisible || still) return;
    // Sans souris (ou immobile) : le V se balance tout seul
    if (t - lastMove > 2500 || !finePointer) {
      target.x = 0.5 + Math.sin(t / 1900) * 0.35;
      target.y = 0.5 + Math.cos(t / 2600) * 0.2;
    }
    cur.x += (target.x - cur.x) * 0.06;
    cur.y += (target.y - cur.y) * 0.06;
    heroInner.style.transform = `rotateX(${(-12 - (cur.y - 0.5) * 26).toFixed(2)}deg) rotateY(${(-18 + (cur.x - 0.5) * 50).toFixed(2)}deg)`;
    for (const f of layers) {
      const d = Number(f.dataset.depth);
      f.style.translate = `${((cur.x - 0.5) * -60 * d).toFixed(1)}px ${((cur.y - 0.5) * -40 * d).toFixed(1)}px`;
    }
  }
  requestAnimationFrame(frame);
})();

// ---------- Paysages voxel (même dessin que l'accueil de l'appli) ----------
function voxelScene({ cols = 13, rows = 4, unit = 44, seed = 11, clouds = true } = {}) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const d = unit / 2;
  const maxH = 5;
  const W = cols * unit + rows * d;
  const H = (maxH + 1.6) * unit + rows * d;
  const pts = (...p) => p.map((v) => v.toFixed(1)).join(' ');
  let out = '';
  for (let z = rows - 1; z >= 0; z--) {
    for (let x = 0; x < cols; x++) {
      const h = Math.min(maxH, Math.round((x / cols) * 3.4 + (z / rows) * 1.4 + rnd() * 2 - 0.9));
      if (h <= 0) continue;
      const X = x * unit + z * d;
      const base = H - z * d;
      const top = base - h * unit;
      const cap = rnd() < 0.34;
      const lip = unit * 0.24;
      out += `<rect class="vx-front" x="${X}" y="${top}" width="${unit}" height="${h * unit}"/>`;
      out += `<polygon class="vx-side" points="${pts(X + unit, top, X + unit + d, top - d, X + unit + d, base - d, X + unit, base)}"/>`;
      out += `<polygon class="${cap ? 'vx-cap' : 'vx-top'}" points="${pts(X, top, X + d, top - d, X + unit + d, top - d, X + unit, top)}"/>`;
      if (cap) {
        out += `<rect class="vx-lip" x="${X}" y="${top}" width="${unit}" height="${lip}"/>`;
        out += `<polygon class="vx-lip-side" points="${pts(X + unit, top, X + unit + d, top - d, X + unit + d, top - d + lip, X + unit, top + lip)}"/>`;
      }
    }
  }
  if (clouds) {
    const cloud = (x, y, k) => `<g class="vx-cloud"><rect x="${x}" y="${y + 12 * k}" width="${92 * k}" height="${14 * k}"/><rect x="${x + 20 * k}" y="${y}" width="${46 * k}" height="${12 * k}"/></g>`;
    out += cloud(W * 0.18, unit * 0.5, 1) + cloud(W * 0.5, unit * 1.5, 0.75) + cloud(W * 0.78, unit * 0.15, 0.9);
  }
  return `<svg class="voxels" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">${out}</svg>`;
}
$('[data-scene="hero"]').innerHTML = voxelScene({ cols: 13, rows: 4, unit: 44, seed: 11 });
$('[data-scene="game"]').innerHTML = voxelScene({ cols: 18, rows: 5, unit: 40, seed: 7 });

// Jeux inventés de la maquette, chacun avec ses couleurs
const GAMES = [
  { name: 'Obby Néon', meta: 'Joué il y a 2 h', seed: 3, sky: 'linear-gradient(180deg,#2b1055,#7597de)', pal: ['#3d2a6b', '#6b4fb3', '#2a1c4d', '#ff4fd8', '#c23aa6', '#ffd6f5'] },
  { name: 'Tycoon des Îles', meta: 'Joué hier', seed: 19, sky: 'linear-gradient(180deg,#5ec8ff,#c9f0ff)', pal: ['#d8b46a', '#f2d999', '#b08f4c', '#2ec27e', '#1f9a62', '#ffffff'] },
  { name: 'Course Pixel', meta: '3 parties cette semaine', seed: 27, sky: 'linear-gradient(180deg,#ff9a5a,#ffd88a)', pal: ['#7a4a3a', '#a8705a', '#5a3428', '#ff5a3c', '#c93e25', '#fff4e0'] },
  { name: 'Survie Glacée', meta: 'Favori', seed: 41, sky: 'linear-gradient(180deg,#9fd3ff,#f0f8ff)', pal: ['#a9c3db', '#e6f2ff', '#7f9bb5', '#ffffff', '#cfe3f5', '#ffffff'] },
];
$('#mk-cards').innerHTML = GAMES.map(
  (g) => `<div class="mk-card"><div class="mk-thumb" style="--sky:${g.sky};--vx-front:${g.pal[0]};--vx-top:${g.pal[1]};--vx-side:${g.pal[2]};--vx-cap:${g.pal[3]};--vx-lip:${g.pal[4]};--cloud:${g.pal[5]}">${voxelScene({ cols: 9, rows: 3, unit: 30, seed: g.seed })}</div><div class="mk-card-body"><b>${esc(g.name)}</b><small>${esc(g.meta)}</small></div></div>`
).join('');

// ---------- Apparition au défilement ----------
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  },
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);
$$('.reveal').forEach((el) => io.observe(el));
new IntersectionObserver(([e], obs) => {
  if (!e.isIntersecting) return;
  smallV.classList.add('go');
  obs.disconnect();
}).observe(smallV);

// Compteurs
const counterIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      counterIO.unobserve(e.target);
      const el = e.target;
      const to = Number(el.dataset.count);
      const from = el.dataset.from ? Number(el.dataset.from) : 0;
      const suffix = el.dataset.suffix || '';
      if (still) continue;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1100);
        el.textContent = Math.round(from + (to - from) * (1 - (1 - k) ** 3)) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  },
  { threshold: 0.6 }
);
$$('[data-count]').forEach((el) => counterIO.observe(el));

// ---------- Bandeau défilant ----------
(() => {
  const track = $('.marquee-track');
  const words = track.dataset.words.split('|');
  const once = words.map((w) => `<span>${esc(w)}</span>`).join('');
  track.innerHTML = once + once; // deux fois : la boucle ne se voit pas
})();

// ---------- Maquette : se redresse au défilement, puis vit toute seule ----------
(() => {
  const mockup = $('#mockup');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const r = mockup.getBoundingClientRect();
    const vh = innerHeight;
    const p = Math.max(0, Math.min(1, 1 - (r.top - vh * 0.12) / (vh * 0.75)));
    mockup.style.setProperty('--p', still ? 1 : p.toFixed(3));
  }
  addEventListener('scroll', () => {
    if (!ticking) requestAnimationFrame(onScroll);
    ticking = true;
  }, { passive: true });
  onScroll();

  // Position d'un élément dans la maquette (sans la perspective appliquée à la maquette)
  const posIn = (el) => {
    let x = 0;
    let y = 0;
    for (let n = el; n && n !== mockup; n = n.offsetParent) {
      x += n.offsetLeft;
      y += n.offsetTop;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const items = $$('.mk-item');
  const indicator = $('#mk-indicator');
  const cursor = $('.mk-cursor');
  const play = $('#mk-play');
  const setNav = (i) => {
    const it = items[i];
    indicator.style.transform = `translateY(${it.offsetTop - items[0].offsetTop}px)`;
    items.forEach((el, j) => el.classList.toggle('on', j === i));
  };
  const moveTo = (el, dx = 0.5, dy = 0.55) => {
    const p = posIn(el);
    cursor.classList.add('shown');
    cursor.style.transform = `translate(${p.x + p.w * dx}px, ${p.y + p.h * dy}px)`;
  };
  const click = () => {
    cursor.classList.add('click');
    setTimeout(() => cursor.classList.remove('click'), 160);
  };
  setNav(0);
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 }).observe(mockup);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    let k = 0;
    for (;;) {
      if (!visible || still) {
        await wait(600);
        continue;
      }
      const cards = $$('.mk-card').filter((c) => c.offsetParent);
      const card = cards[k % cards.length];
      // Survole un jeu récent
      moveTo(card, 0.5, 0.4);
      await wait(900);
      card.classList.add('hover');
      await wait(900);
      card.classList.remove('hover');
      // Puis clique sur Jouer
      moveTo(play, 0.6, 0.6);
      await wait(950);
      click();
      play.classList.add('press');
      await wait(180);
      play.classList.remove('press');
      await wait(700);
      // Et change de page dans la barre latérale
      const nav = items[(k % 4) + 1];
      if (nav.offsetParent) {
        moveTo(nav, 0.4, 0.5);
        await wait(900);
        click();
        setNav(items.indexOf(nav));
        await wait(1100);
        moveTo(items[0], 0.4, 0.5);
        await wait(900);
        click();
        setNav(0);
        await wait(700);
      }
      k++;
    }
  })();
})();

// ---------- Cartes : inclinaison et reflet qui suivent la souris ----------
$$('.feature').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    if (still || e.pointerType !== 'mouse') return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
    card.style.transform = `rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 12).toFixed(2)}deg) translateZ(0)`;
  });
  card.addEventListener('pointerleave', () => (card.style.transform = ''));
});

// Boutons « aimantés »
$$('.magnetic').forEach((btn) => {
  btn.addEventListener('pointermove', (e) => {
    if (still || e.pointerType !== 'mouse') return;
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.22).toFixed(1)}px)`;
  });
  btn.addEventListener('pointerleave', () => (btn.style.transform = ''));
});

// ---------- Démo Alt+T ----------
(() => {
  const game = $('#game');
  const keys = $('#keys');
  let visible = false;
  let touched = false;
  const toggle = () => {
    keys.classList.add('down');
    setTimeout(() => keys.classList.remove('down'), 170);
    game.classList.toggle('open');
  };
  const byUser = () => {
    touched = true;
    toggle();
  };
  keys.addEventListener('click', byUser);
  keys.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      byUser();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (!visible || !e.altKey || e.key.toLowerCase() !== 't') return;
    e.preventDefault();
    byUser();
  });
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.35 }).observe(game);
  // Tant qu'on n'y touche pas, la démo se joue toute seule
  setInterval(() => {
    if (visible && !touched && !still) toggle();
  }, 3200);
})();

// ---------- Barre du haut ----------
(() => {
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 12);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const links = new Map($$('.nav-links a').map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) links.forEach((a, id) => a.classList.toggle('active', id === e.target.id));
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  links.forEach((_a, id) => {
    const sec = document.getElementById(id);
    if (sec) spy.observe(sec);
  });
})();

// Pas sur Windows : on le dit, sans cacher le bouton
if (!/Windows/i.test(navigator.userAgent)) $('#platform-note').hidden = false;

// ---------- Téléchargement : dernière version publiée sur GitHub ----------
// Secours (GitHub injoignable) et titres : les notes de version de l'appli
const NOTES = new Map(CHANGELOG.map((e) => [e.version, e]));
const FALLBACK_NEWS = CHANGELOG.slice(0, 3).map((e) => ({ name: e.title, version: e.version, date: e.date, items: e.items.map(([, t]) => t) }));
const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
let download = null; // { url, name, version, size }

function releaseItems(body) {
  const items = [];
  for (const raw of String(body || '').split(/\r?\n/)) {
    const line = raw.trim().replace(/\*\*|__|`/g, '');
    const m = line.match(/^[-*•]\s+(.*)$/);
    if (m) items.push(m[1]);
  }
  return items.slice(0, 6);
}

function renderNews(list) {
  $('#news-list').innerHTML = list
    .slice(0, 3)
    .map((r, i) => {
      const items = r.items.length ? `<ul>${r.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p>Corrections et améliorations.</p>';
      return `<article class="release reveal${i === 0 ? ' latest' : ''}" style="--i:${i}">
        <div class="release-head"><span class="v">${esc(r.version)}</span><h3>${esc(r.name)}</h3><time datetime="${esc(r.date)}">${dateFmt.format(new Date(r.date))}</time></div>
        ${items}
      </article>`;
    })
    .join('');
  $$('#news-list .reveal').forEach((el) => io.observe(el));
}

function applyDownload() {
  const meta = download ? `Version ${download.version} · ${download.size} Mo · Windows 10 et 11` : 'Windows 10 et 11 · Gratuit';
  $$('[data-release-meta]').forEach((el) => (el.textContent = meta));
  $$('[data-download]').forEach((a) => {
    a.href = download ? download.url : RELEASES_PAGE;
    if (download) a.removeAttribute('target');
    else a.target = '_blank';
  });
  $('#dl-retry').href = download ? download.url : RELEASES_PAGE;
  $('#dl-file').textContent = download ? download.name : "l'installateur";
}

async function loadReleases() {
  let list = null;
  try {
    const cached = sessionStorage.getItem('voksy-releases-2');
    if (cached) list = JSON.parse(cached);
  } catch {
    /* rien */
  }
  if (!list) {
    const r = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=6`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
    list = (await r.json())
      .filter((x) => !x.draft && !x.prerelease)
      .map((x) => {
        const exe = (x.assets || []).find((a) => /\.exe$/i.test(a.name));
        const version = String(x.tag_name || '').replace(/^v/i, '');
        const own = x.name && x.name !== x.tag_name ? x.name.replace(/^Voksy\s+v?[\d.]+\s*[·:-]?\s*/i, '') : '';
        const items = releaseItems(x.body);
        return {
          version,
          name: own || NOTES.get(version)?.title || `Voksy ${version}`,
          date: x.published_at,
          items: items.length ? items : (NOTES.get(version)?.items || []).map(([, t]) => t).slice(0, 6),
          exe: exe ? { url: exe.browser_download_url, name: exe.name, size: Math.round(exe.size / 1048576) } : null,
        };
      });
    try {
      sessionStorage.setItem('voksy-releases-2', JSON.stringify(list));
    } catch {
      /* rien */
    }
  }
  return list;
}

loadReleases()
  .then((list) => {
    const latest = list.find((r) => r.exe);
    if (latest) download = { ...latest.exe, version: latest.version };
    renderNews(list.length ? list : FALLBACK_NEWS);
  })
  .catch(() => renderNews(FALLBACK_NEWS))
  .finally(applyDownload);
applyDownload();

// Après le clic : le fichier se télécharge, la fenêtre explique la suite
const modal = $('#dl-modal');
$$('[data-download]').forEach((a) =>
  a.addEventListener('click', () => {
    if (!download) return; // pas encore de version : la page GitHub s'ouvre dans un nouvel onglet
    setTimeout(() => modal.showModal(), 350);
  })
);
modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.closest('[data-close]')) modal.close();
});

// ---------- Animations des sections hors de l'écran : en pause ----------
(() => {
  const pause = new IntersectionObserver(
    (entries) => {
      for (const e of entries) e.target.classList.toggle('paused', !e.isIntersecting);
    },
    { rootMargin: '120px 0px' }
  );
  $$('.hero, .marquee, .showcase, .features, .alt-demo, .themes, .final').forEach((el) => pause.observe(el));
})();

// ---------- Défilement doux (molette, clavier, liens du menu) ----------
// Molette : la page glisse vers sa destination avec un peu d'inertie au lieu de sauter par crans.
// Écrans tactiles et animations coupées : défilement natif du navigateur.
(() => {
  if (!finePointer) return;
  root.classList.add('smooth-scroll');
  const NAV_OFFSET = 72;
  const LERP = 0.11;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  const clamp = (y) => Math.max(0, Math.min(maxY(), y));
  let target = scrollY;
  let current = scrollY;
  let running = false;
  let tween = null; // { from, to, start, dur } pour les liens du menu
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

  function frame(now) {
    if (tween) {
      const k = Math.min(1, (now - tween.start) / tween.dur);
      current = tween.from + (tween.to - tween.from) * easeInOut(k);
      target = current;
      if (k === 1) tween = null;
    } else {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.4) current = target;
    }
    scrollTo(0, current);
    running = Boolean(tween) || current !== target;
    if (running) requestAnimationFrame(frame);
  }
  const run = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  };
  // Défilement fait ailleurs (barre de défilement, recherche dans la page) : on repart de là
  addEventListener('scroll', () => {
    if (!running) target = current = scrollY;
  }, { passive: true });
  addEventListener('resize', () => (target = clamp(target)));

  // Un élément de la page qui défile lui-même garde son défilement
  function scrollsItself(el, dy) {
    if (!(el instanceof Element)) return false;
    for (let n = el; n && n !== document.body && n !== root; n = n.parentElement) {
      const st = getComputedStyle(n);
      if (!/(auto|scroll)/.test(st.overflowY) || n.scrollHeight <= n.clientHeight) continue;
      if ((dy < 0 && n.scrollTop > 0) || (dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight)) return true;
    }
    return false;
  }

  addEventListener('wheel', (e) => {
    if (still || e.ctrlKey || e.defaultPrevented || $('#dl-modal').open) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 40;
    else if (e.deltaMode === 2) dy *= innerHeight;
    if (scrollsItself(e.target, dy)) return;
    e.preventDefault();
    tween = null;
    if (!running) target = current = scrollY;
    target = clamp(target + dy);
    run();
  }, { passive: false });

  function glideTo(y) {
    y = clamp(y);
    if (still) return scrollTo(0, y);
    const dist = Math.abs(y - scrollY);
    tween = { from: scrollY, to: y, start: performance.now(), dur: Math.min(1400, 450 + dist * 0.35) };
    current = scrollY;
    running = false;
    run();
  }

  // Liens vers une section (menu, « Voir ce qu'il sait faire », retour en haut)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    glideTo(id === 'top' ? 0 : el.getBoundingClientRect().top + scrollY - NAV_OFFSET);
    history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`);
  });

  // Clavier : mêmes glissés pour Page suivante, Espace, flèches, Début et Fin
  addEventListener('keydown', (e) => {
    if (still || e.altKey || e.ctrlKey || e.metaKey || $('#dl-modal').open) return;
    if (e.target.closest('input, textarea, select, [contenteditable], summary, button, [role="button"]')) return;
    const page = innerHeight * 0.85;
    const from = running ? target : scrollY;
    const moves = { PageDown: page, PageUp: -page, ArrowDown: 120, ArrowUp: -120, ' ': e.shiftKey ? -page : page };
    if (e.key in moves) {
      e.preventDefault();
      tween = null;
      if (!running) current = scrollY;
      target = clamp(from + moves[e.key]);
      run();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      glideTo(e.key === 'Home' ? 0 : maxY());
    }
  });
})();
