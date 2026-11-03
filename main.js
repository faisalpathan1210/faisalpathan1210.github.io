/* ==========================================================
   Cinematic portfolio — runtime
   Everything is generated from window.PORTFOLIO (content.js).
   No frameworks, no build step.
   ========================================================== */
(() => {
  'use strict';

  const P = window.PORTFOLIO || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const portraitMQ = matchMedia('(max-width: 760px)');

  /* ---------------------------------------------------------
     Layouts (centre-relative % of the stage) + depth d (0 far … 1 near)
     --------------------------------------------------------- */
  const UNI_LAND = [
    { x: -38, y: -30, d: .9, r: -6 }, { x: -18, y: -36, d: .5, r: 4 }, { x: 16, y: -37, d: .6, r: -3 }, { x: 37, y: -28, d: 1, r: 6 },
    { x: -44, y: -3, d: .7, r: -4 }, { x: 44, y: -1, d: .8, r: 5 }, { x: -36, y: 28, d: .9, r: 5 }, { x: -14, y: 36, d: .5, r: -5 },
    { x: 14, y: 37, d: .6, r: 3 }, { x: 38, y: 30, d: 1, r: -6 }, { x: -29, y: 7, d: .4, r: 3 }, { x: 30, y: 9, d: .4, r: -3 },
  ];
  const UNI_PORT = [
    { x: -30, y: -37, d: .8, r: -5 }, { x: 0, y: -40, d: .5, r: 3 }, { x: 30, y: -37, d: .8, r: 5 }, { x: -16, y: -29, d: .6, r: 4 },
    { x: 16, y: -29, d: .6, r: -4 }, { x: -38, y: -19, d: .4, r: -3 }, { x: -30, y: 37, d: .8, r: 5 }, { x: 0, y: 40, d: .5, r: -3 },
    { x: 30, y: 37, d: .8, r: -5 }, { x: -16, y: 29, d: .6, r: -4 }, { x: 16, y: 29, d: .6, r: 4 }, { x: 38, y: 19, d: .4, r: 3 },
  ];
  const WORK_LAND = [
    { x: -36, y: -34, d: .8, r: -3 }, { x: -12, y: -37, d: .55, r: 2 }, { x: 12, y: -33, d: .6, r: -2 }, { x: 36, y: -36, d: .85, r: 3 },
    { x: -37, y: 0, d: .6, r: 2 }, { x: -12, y: 3, d: 1, r: -2 }, { x: 12, y: -2, d: .9, r: 3 }, { x: 37, y: 2, d: .55, r: -3 },
    { x: -36, y: 35, d: .85, r: -2 }, { x: -12, y: 33, d: .55, r: 3 }, { x: 12, y: 37, d: .6, r: -3 }, { x: 36, y: 34, d: .8, r: 2 },
  ];

  /* ---------------------------------------------------------
     Fill content
     --------------------------------------------------------- */
  const NAME = String(P.name || 'NAME').toUpperCase();
  document.title = (P.fullName || P.name || 'Portfolio') + (P.role ? ' — ' + P.role : '');
 
  $('#tagline').textContent = P.tagline || '';
  $('#about').textContent = P.about || '';

  function buildWord(el, text) {
    el.textContent = '';
    Array.from(text).forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = c === ' ' ? ' ' : c;
      el.appendChild(s);
    });
    el.setAttribute('aria-label', text);
  }
  buildWord($('#word'), NAME);
  $('#fWord').innerHTML = '<span class="fw">' + esc(NAME) + '</span>';

  // chips
  const CHIP_POS = [['6%', '30%'], ['70%', '24%'], ['14%', '68%'], ['74%', '64%']];
  const chipsEl = $('#chips');
  (P.chips || []).slice(0, 4).forEach((c, i) => {
    const li = document.createElement('li');
    li.textContent = c;
    li.style.setProperty('--x', CHIP_POS[i][0]);
    li.style.setProperty('--y', CHIP_POS[i][1]);
    li.style.setProperty('--k', i);
    chipsEl.appendChild(li);
  });

  // optional hero media
if (P.heroImage) { const f = $('#figure'); f.src = P.heroImage; f.alt = (P.fullName || '') + ', ' + (P.role || ''); f.hidden = false; }  if (P.heroVideo) { const v = $('#figureVideo'); v.src = P.heroVideo; v.hidden = false; v.play().catch(() => {}); }

  // finale
  const mail = $('#mail');
  mail.textContent = P.email || '';
  mail.href = 'mailto:' + (P.email || '');
  $('#socials').innerHTML = (P.socials || [])
    .map((s) => '<li><a href="' + esc(s.href) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a></li>').join('');
  $('#copy').textContent = '© ' + new Date().getFullYear() + ' ' + (P.fullName || P.name || '');

  /* ---------------------------------------------------------
     Fit the giant wordmarks to the viewport width
     --------------------------------------------------------- */
  function fit(el, frac, maxFs) {
    el.style.fontSize = '100px';
    const w = el.getBoundingClientRect().width;
    if (!w) return;
    el.style.fontSize = Math.min(100 * innerWidth * frac / w, maxFs) + 'px';
  }
  function fitAll() {
    fit($('#word'), innerWidth < 760 ? 0.9 : 0.94, innerHeight * 0.78);
    fit($('.fw', $('#fWord')), 0.98, innerHeight * 0.9);
    const fw = $('#fWord');
    fw.style.fontSize = $('.fw', fw).style.fontSize;
    $('.fw', fw).style.fontSize = '1em';
  }

  /* ---------------------------------------------------------
     Pointer
     --------------------------------------------------------- */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, nx: .5, ny: .5, tnx: .5, tny: .3 };
  const cursor = $('#cursor');
  addEventListener('pointermove', (e) => {
    ptr.tx = (e.clientX / innerWidth - .5) * 2;
    ptr.ty = (e.clientY / innerHeight - .5) * 2;
    ptr.tnx = e.clientX / innerWidth;
    ptr.tny = 1 - e.clientY / innerHeight;
    if (e.pointerType === 'mouse') {
      cursor.classList.add('on');
      cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      cursor.classList.toggle('hot', !!e.target.closest('a, button'));
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'));

  /* ---------------------------------------------------------
     Decks (floating cards with depth parallax)
     --------------------------------------------------------- */
  function buildDeck(deckEl, items, getLayout, make) {
    const nodes = items.map((it, i) => {
      const card = document.createElement('div');
      card.className = 'dcard';
      const fl = document.createElement('div');
      fl.className = 'fl';
      fl.style.setProperty('--fd', (6 + (i * 1.37) % 4).toFixed(2) + 's');
      fl.style.setProperty('--fo', (-i * 0.9).toFixed(2) + 's');
      fl.style.setProperty('--fa', 6 + (i * 3) % 8);
      const ci = make(it, i);
      ci.classList.add('ci');
      fl.appendChild(ci);
      card.appendChild(fl);
      deckEl.appendChild(card);
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        ci.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg');
        ci.style.setProperty('--rx', ((-((e.clientY - r.top) / r.height - .5)) * 16).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => {
        ci.style.setProperty('--ry', '0deg');
        ci.style.setProperty('--rx', '0deg');
      });
      return card;
    });
    const place = () => {
      const L = getLayout();
      nodes.forEach((n, i) => {
        const l = L[i % L.length];
        n.style.setProperty('--x', l.x);
        n.style.setProperty('--y', l.y);
        n.style.setProperty('--d', l.d);
        n.style.setProperty('--r', l.r || 0);
      });
    };
    place();
    return { nodes, place };
  }

  function monogram(name) {
    const caps = String(name).match(/[A-Z0-9]/g) || [];
    if (caps.length >= 2) return caps[0] + caps[1];
    const s = String(name).replace(/[^A-Za-z0-9]/g, '');
    return s.charAt(0).toUpperCase() + s.charAt(1).toLowerCase();
  }

  const uDeck = $('#uDeck');
  const uni = buildDeck(uDeck, P.skills || [], () => (portraitMQ.matches ? UNI_PORT : UNI_LAND), (name) => {
    const d = document.createElement('div');
    d.className = 'skill';
    d.innerHTML = '<b>' + esc(monogram(name)) + '</b><span>' + esc(name) + '</span>';
    return d;
  });

  const wDeck = $('#wDeck');
  const WORK_FEW = [
    { x: -22, y: -3, d: .9, r: -2 }, { x: 22, y: 3, d: .65, r: 2 },
    { x: 0, y: 32, d: .5, r: -1 }, { x: 0, y: -32, d: .5, r: 1 },
  ];
  const fewProjects = (P.projects || []).length <= 4;
  $('#wStage').classList.toggle('few', fewProjects);
  const work = buildDeck(wDeck, P.projects || [], () => (fewProjects ? WORK_FEW : WORK_LAND), (p) => {
    const a = document.createElement('a');
    a.className = 'proj';
    a.href = p.href || '#';
    if (/^https?:/i.test(a.href)) { a.target = '_blank'; a.rel = 'noopener'; }
    if (!p.href || p.href === '#') a.addEventListener('click', (e) => e.preventDefault());
    const [c1, c2] = p.colors || ['#2a0f0c', '#e0301e'];
    a.innerHTML =
      '<div class="thumb' + (p.image ? ' has-img' : '') + '" style="--c1:' + esc(c1) + ';--c2:' + esc(c2) + '">' +
      (p.image ? '<img loading="lazy" alt="' + esc(p.title) + '" src="' + esc(p.image) + '">' : '') +
      '</div><div class="cap"><b>' + esc(p.title) + '</b><span>' + esc(p.tag || '') + '</span></div>' +
      (p.desc ? '<p class="desc">' + esc(p.desc) + '</p>' : '') +
      (p.stack ? '<p class="stack">' + esc(p.stack) + '</p>' : '');
    return a;
  });

  /* ---------------------------------------------------------
     Fog — one fullscreen WebGL shader behind everything
     --------------------------------------------------------- */
  const fog = (() => {
    const cv = $('#fog');
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) { document.body.classList.add('no-gl'); return null; }

    const vsSrc = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
    const fsSrc = [
      'precision highp float;',
      'uniform vec2 uRes; uniform float uTime; uniform float uLevel; uniform float uIntro; uniform vec2 uMouse;',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
      'float noise(vec2 p){',
      '  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);',
      '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);',
      '}',
      'float fbm(vec2 p){ float v = 0.0; float a = 0.5; for(int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; } return v; }',
      'void main(){',
      '  vec2 uv = gl_FragCoord.xy / uRes;',
      '  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;',
      '  float t = uTime * 0.05;',
      '  vec2 q = vec2(fbm(p * 1.6 + vec2(t, -t)), fbm(p * 1.6 + vec2(5.2, 1.3) - t));',
      '  float f = fbm(p * 1.4 + 2.0 * q + vec2(0.0, -t * 2.0));',
      '  vec2 m = (uMouse - 0.5) * vec2(0.35, 0.2);',
      '  float glow = smoothstep(1.15, 0.0, length((uv - vec2(0.5 + m.x, -0.05 + m.y)) * vec2(1.15, 1.6)));',
      '  float mask = f * glow;',
      '  vec3 deep = vec3(0.035, 0.010, 0.010);',
      '  vec3 red = vec3(0.85, 0.12, 0.06);',
      '  vec3 hot = vec3(1.0, 0.45, 0.25);',
      '  vec3 col = deep + red * mask * 1.15 * uLevel + hot * pow(mask, 3.0) * 0.9 * uLevel;',
      '  col += red * 0.09 * smoothstep(0.55, 1.0, uv.y) * f * uLevel;',
      '  float v = smoothstep(1.15, 0.3, length(uv - 0.5) * 1.1);',
      '  col *= mix(0.35, 1.0, v);',
      '  col *= uIntro;',
      '  gl_FragColor = vec4(col, 1.0);',
      '}',
    ].join('\n');

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) { document.body.classList.add('no-gl'); return null; }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { document.body.classList.add('no-gl'); return null; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uRes', 'uTime', 'uLevel', 'uIntro', 'uMouse'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

    function size() {
      const k = Math.min(devicePixelRatio || 1, 1.5) * 0.6; // fog is soft — render small
      cv.width = Math.max(2, Math.floor(innerWidth * k));
      cv.height = Math.max(2, Math.floor(innerHeight * k));
      gl.viewport(0, 0, cv.width, cv.height);
    }
    size();

    return {
      size,
      render(t, level, intro, mx, my) {
        gl.uniform2f(U.uRes, cv.width, cv.height);
        gl.uniform1f(U.uTime, t);
        gl.uniform1f(U.uLevel, level);
        gl.uniform1f(U.uIntro, intro);
        gl.uniform2f(U.uMouse, mx, my);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
  })();

  /* ---------------------------------------------------------
     Ribbon — a light-painting trail that crosses itself
     --------------------------------------------------------- */
  const ribbon = (() => {
    const cv = $('#ribbon');
    const ctx = cv.getContext('2d');
    const TR = 7.5; // seconds of trail
    let W = 0, H = 0, t = 8, pts = [];

    const head = (tt) => {
      const rx = W * .34, ry = H * .3;
      return {
        x: W / 2 + rx * Math.sin(tt * .55) + rx * .25 * Math.sin(tt * 1.37 + 1.2),
        y: H / 2 + ry * Math.sin(tt * .83 + .6) * Math.cos(tt * .31) + ry * .3 * Math.sin(tt * 1.9),
      };
    };
    function prefill() {
      pts = [];
      for (let tt = t - TR; tt <= t; tt += 1 / 70) { const h = head(tt); pts.push({ x: h.x, y: h.y, t: tt }); }
    }
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      if (!W || !H) return;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prefill();
      draw();
    }
    function draw() {
      if (!W) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const age = (t - b.t) / TR;
        if (age >= 1 || age < 0) continue;
        const k = 1 - age;
        let r, g, bl;
        if (age < .25) { const m = age / .25; r = 255; g = lerp(245, 150, m); bl = lerp(235, 120, m); }
        else { const m = (age - .25) / .75; r = lerp(255, 120, m); g = lerp(150, 12, m); bl = lerp(120, 8, m); }
        const w = .6 + 6 * Math.pow(k, .9);
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(224,48,30,' + (.09 * k).toFixed(3) + ')';
        ctx.lineWidth = w * 5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (bl | 0) + ',' + (.85 * k).toFixed(3) + ')';
        ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const h = pts[pts.length - 1];
      if (h) {
        const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 46);
        g.addColorStop(0, 'rgba(255,240,230,.9)');
        g.addColorStop(.25, 'rgba(255,110,70,.45)');
        g.addColorStop(1, 'rgba(224,48,30,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(h.x, h.y, 46, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    function tick(dt) {
      if (!W || reduce) return;
      t += dt;
      const last = pts[pts.length - 1];
      if (!last || t - last.t >= 1 / 70) { const h = head(t); pts.push({ x: h.x, y: h.y, t }); }
      while (pts.length && pts[0].t < t - TR) pts.shift();
      draw();
    }
    return { size, tick };
  })();

  /* ---------------------------------------------------------
     Timeline — a cursor-driven clock
     --------------------------------------------------------- */
  const tl = (() => {
    const T = P.timeline || [];
    const n = T.length;
    const stage = $('#tStage'), svg = $('#tSvg'), cardsEl = $('#tCards'), sec = $('#timeline');
    const detail = $('#tDetail'), dTitle = $('#tTitle'), dText = $('#tText');
    if (!n) return { size() {}, tick() {}, show() {} };

    const NS = 'http://www.w3.org/2000/svg';
    const A = 50 * Math.PI / 180;               // half-sweep of the arc
    const angleOf = (i) => -A + i * (2 * A / Math.max(1, n - 1));
    let W = 0, H = 0, px = 0, py = 0, R = 0, portrait = false;
    let u = 0, introStart = null, introDone = false, manual = null, pointerU = null, active = -1;
    let beam, hand2, flood, dots = [], rings = [], fx = 0, fy = 0;

    const cards = T.map((it, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 't-card';
      b.style.setProperty('--k', i);
      b.innerHTML = '<span class="y">' + esc(it.year) + '</span><span class="n">' + esc(it.title) + '</span>';
      b.addEventListener('click', () => { manual = i; pointerU = null; introDone = true; setActive(i); });
      b.addEventListener('focus', () => { manual = i; pointerU = null; setActive(i); });
      cardsEl.appendChild(b);
      return b;
    });

    function setActive(i) {
      if (i === active) return;
      active = i;
      cards.forEach((c, k) => { c.classList.toggle('on', k === i); c.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      dots.forEach((d, k) => { d.setAttribute('fill', k === i ? '#ff6b3d' : '#3a1a15'); d.setAttribute('r', k === i ? 7 : 4.5); });
      detail.classList.add('swap');
      setTimeout(() => {
        dTitle.textContent = T[i].year + ' — ' + T[i].title;
        dText.textContent = T[i].text;
        detail.classList.remove('swap');
      }, 160);
    }

    const el = (name, attrs, parent) => {
      const e = document.createElementNS(NS, name);
      Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k]));
      (parent || svg).appendChild(e);
      return e;
    };
    const nodePos = (i) => ({ x: px + R * Math.sin(angleOf(i)), y: py - R * Math.cos(angleOf(i)) });

    function drawSvg() {
      svg.textContent = '';
      dots = []; rings = [];
      const defs = el('defs');
      const bg = el('linearGradient', { id: 'beamG', x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
      el('stop', { offset: 0, 'stop-color': '#ff4a2a', 'stop-opacity': .04 }, bg);
      el('stop', { offset: .7, 'stop-color': '#ff4a2a', 'stop-opacity': .2 }, bg);
      el('stop', { offset: 1, 'stop-color': '#ff6b3d', 'stop-opacity': .55 }, bg);
      const fg = el('radialGradient', { id: 'floodG' }, defs);
      el('stop', { offset: 0, 'stop-color': '#ff5a3a', 'stop-opacity': .75 }, fg);
      el('stop', { offset: 1, 'stop-color': '#e0301e', 'stop-opacity': 0 }, fg);
      const pg = el('radialGradient', { id: 'pivG', cx: '35%', cy: '30%' }, defs);
      el('stop', { offset: 0, 'stop-color': '#7a2a20' }, pg);
      el('stop', { offset: 1, 'stop-color': '#120605' }, pg);

      // outer arc + ticks
      const A2 = A + .1;
      const pt = (rad, a) => [px + rad * Math.sin(a), py - rad * Math.cos(a)];
      const [x1, y1] = pt(R, -A2), [x2, y2] = pt(R, A2);
      el('path', { d: 'M ' + x1 + ' ' + y1 + ' A ' + R + ' ' + R + ' 0 0 1 ' + x2 + ' ' + y2, fill: 'none', stroke: 'rgba(224,48,30,.45)', 'stroke-width': 1.2 });
      for (let a = -A2, k = 0; a <= A2 + 1e-6; a += 2.5 * Math.PI / 180, k++) {
        const long = k % 4 === 0;
        const [ax, ay] = pt(R + 30, a), [bx, by] = pt(R + 30 + (long ? 14 : 7), a);
        el('line', { x1: ax, y1: ay, x2: bx, y2: by, stroke: long ? 'rgba(239,230,218,.4)' : 'rgba(239,230,218,.18)', 'stroke-width': 1 });
      }
      // inner dashed rings (the "floor mechanism")
      [0.62, 0.34].forEach((f, i) => {
        const [ax, ay] = pt(R * f, -A2), [bx, by] = pt(R * f, A2);
        rings.push(el('path', {
          d: 'M ' + ax + ' ' + ay + ' A ' + R * f + ' ' + R * f + ' 0 0 1 ' + bx + ' ' + by,
          fill: 'none', stroke: 'rgba(239,230,218,' + (i ? .12 : .16) + ')', 'stroke-width': 1, 'stroke-dasharray': i ? '2 9' : '1 14',
        }));
      });
      // node dots
      for (let i = 0; i < n; i++) { const p = nodePos(i); dots.push(el('circle', { cx: p.x, cy: p.y, r: 4.5, fill: '#3a1a15', stroke: 'rgba(255,107,61,.6)', 'stroke-width': 1 })); }
      // flood (red light landing on the active node)
      flood = el('circle', { cx: px, cy: py - R, r: R * .2, fill: 'url(#floodG)' });
      // companion hand (ornate, shorter) and the beam
      hand2 = el('g');
      el('line', { x1: px, y1: py, x2: px, y2: py - R * .56, stroke: 'rgba(239,230,218,.5)', 'stroke-width': 1.5 }, hand2);
      el('circle', { cx: px, cy: py - R * .3, r: 7, fill: 'none', stroke: 'rgba(239,230,218,.55)', 'stroke-width': 1.2 }, hand2);
      el('circle', { cx: px, cy: py - R * .3, r: 2, fill: 'rgba(239,230,218,.7)' }, hand2);
      el('path', { d: 'M ' + (px - 3) + ' ' + (py - R * .56) + ' L ' + px + ' ' + (py - R * .62) + ' L ' + (px + 3) + ' ' + (py - R * .56) + ' Z', fill: 'rgba(239,230,218,.6)' }, hand2);
      beam = el('g');
      const sp = R * .055;
      el('polygon', { points: px + ',' + py + ' ' + (px - sp) + ',' + (py - R) + ' ' + (px + sp) + ',' + (py - R), fill: 'url(#beamG)' }, beam);
      el('line', { x1: px, y1: py, x2: px, y2: py - R * .97, stroke: 'rgba(255,90,60,.25)', 'stroke-width': 9, 'stroke-linecap': 'round' }, beam);
      el('line', { x1: px, y1: py, x2: px, y2: py - R * .97, stroke: '#ff7a55', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, beam);
      // pivot
      el('circle', { cx: px, cy: py, r: 34, fill: 'none', stroke: 'rgba(255,107,61,.35)', 'stroke-width': 1 });
      el('circle', { cx: px, cy: py, r: 18, fill: 'url(#pivG)', stroke: 'rgba(255,107,61,.7)', 'stroke-width': 1.2 });
      el('circle', { cx: px, cy: py, r: 5, fill: '#ff4a2a' });
      const p0 = nodePos(0); fx = p0.x; fy = p0.y;
      if (active >= 0) { dots[active] && dots[active].setAttribute('fill', '#ff6b3d'); dots[active] && dots[active].setAttribute('r', 7); }
    }

    function size() {
      portrait = portraitMQ.matches;
      stage.classList.toggle('portrait', portrait);
      $('#tHint').textContent = portrait ? 'Tap a year' : 'Move your cursor to swing the clock hand through the years';
      if (portrait) { cards.forEach((c) => { c.style.left = ''; c.style.top = ''; }); return; }
      W = stage.clientWidth; H = stage.clientHeight;
      px = W / 2; py = H * 1.06; R = Math.min(H * .93, W * .5);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      cards.forEach((c, i) => { const p = nodePos(i); c.style.left = p.x + 'px'; c.style.top = p.y + 'px'; });
      drawSvg();
    }

    function show() {
      if (introStart !== null) return;
      introStart = performance.now();
      cards.forEach((c) => c.classList.add('shown'));
      if (portrait || reduce) { introDone = true; }
      setActive(portrait || reduce ? Math.max(0, active) : 0);
    }

    // hand over control to the pointer once the intro sweep is done
    sec.addEventListener('pointermove', (e) => {
      if (portrait || !introDone || e.pointerType === 'touch') return;
      const r = stage.getBoundingClientRect();
      const ang = Math.atan2(e.clientX - (r.left + px), (r.top + py) - e.clientY);
      pointerU = clamp((ang + A) / (2 * A) * (n - 1), 0, n - 1);
      manual = null;
    }, { passive: true });

    function tick(dt, now) {
      if (portrait || !beam || introStart === null) return;
      const introT = clamp((now - introStart) / 3400, 0, 1);
      const eased = introT < .5 ? 4 * introT ** 3 : 1 - Math.pow(-2 * introT + 2, 3) / 2;
      if (introT >= 1) introDone = true;
      let target;
      if (manual !== null) target = manual;
      else if (pointerU !== null) target = pointerU;
      else target = eased * (n - 1);
      u = introDone ? lerp(u, target, 1 - Math.exp(-dt * 7)) : eased * (n - 1);
      if (reduce) u = target;

      const theta = angleOf(0) + (u / Math.max(1, n - 1)) * (2 * A);
      const deg = theta * 180 / Math.PI;
      beam.setAttribute('transform', 'rotate(' + deg.toFixed(3) + ' ' + px + ' ' + py + ')');
      hand2.setAttribute('transform', 'rotate(' + (deg - 13).toFixed(3) + ' ' + px + ' ' + py + ')');

      const idx = clamp(Math.round(u), 0, n - 1);
      if (idx !== active) setActive(idx);
      const np = nodePos(idx);
      fx = lerp(fx, np.x, 1 - Math.exp(-dt * 9)); fy = lerp(fy, np.y, 1 - Math.exp(-dt * 9));
      flood.setAttribute('cx', fx.toFixed(1)); flood.setAttribute('cy', fy.toFixed(1));
      rings.forEach((r, i) => r.setAttribute('stroke-dashoffset', ((now / 1000) * (i ? -6 : 4)).toFixed(1)));
    }

    size();
    return { size, tick, show };
  })();

  /* ---------------------------------------------------------
     Reveal / visibility observers
     --------------------------------------------------------- */
  function watchOnce(el, threshold, cb) {
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); }
    }), { threshold });
    io.observe(el);
  }

  $$('.u-core > *').forEach((e, i) => { e.dataset.reveal = ''; e.style.transitionDelay = (0.2 + i * 0.18) + 's'; });
  ['.t-head', '.t-detail', '.w-head', '.f-copy', '.f-row'].forEach((s) => { const e = $(s); if (e) e.dataset.reveal = ''; });
  $$('[data-reveal]').forEach((el) => watchOnce(el, 0.15, (e) => e.classList.add('in')));

  watchOnce($('#uStage'), 0.35, () => uDeck.classList.add('in'));
  watchOnce($('#wStage'), 0.12, () => wDeck.classList.add('in'));

  const contact = $('#contact');
  function typeText(el, text, speed) {
    let i = 0;
    el.textContent = '';
    const id = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(id); }, speed);
  }
  watchOnce(contact, 0.25, () => {
    contact.classList.add('in');
    if (reduce) $('#quote').textContent = P.quote || '';
    else typeText($('#quote'), P.quote || '', 38);
  });

  const vis = {};
  const secEls = ['hero', 'universe', 'timeline', 'work', 'contact'].map((id) => $('#' + id));
  const visIO = new IntersectionObserver((es) => es.forEach((e) => {
    vis[e.target.id] = e.isIntersecting;
    if (e.isIntersecting && e.target.id === 'universe') ribbon.size();
    if (e.isIntersecting && e.target.id === 'timeline') tl.show();
  }), { rootMargin: '8% 0px' });
  secEls.forEach((e) => visIO.observe(e));

  /* ---------------------------------------------------------
     Main loop
     --------------------------------------------------------- */
  let readyAt = null, fogLevel = 1, last = performance.now();
  const navLinks = $$('[data-nav]');
  const uStage = $('#uStage'), wStage = $('#wStage'), uSec = $('#universe');
  let lastMx = 99, lastMy = 99;

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    const k = Math.min(1, dt * 5);
    ptr.x += (ptr.tx - ptr.x) * k; ptr.y += (ptr.ty - ptr.y) * k;
    ptr.nx += (ptr.tnx - ptr.nx) * k * .6; ptr.ny += (ptr.tny - ptr.ny) * k * .6;

    // which section holds the viewport's centre line → fog level + nav highlight
    let cur = null;
    const mid = innerHeight / 2;
    for (const s of secEls) { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom >= mid) { cur = s; break; } }
    const targetLevel = cur ? parseFloat(cur.dataset.fog || '1') : fogLevel;
    fogLevel = lerp(fogLevel, targetLevel, 1 - Math.exp(-dt * 2.2));
    navLinks.forEach((a) => a.classList.toggle('active', !!cur && a.dataset.nav === cur.id));

    // depth parallax only where it can be seen
    if ((vis.universe || vis.work) && (Math.abs(ptr.x - lastMx) > .0004 || Math.abs(ptr.y - lastMy) > .0004)) {
      lastMx = ptr.x; lastMy = ptr.y;
      const mx = reduce ? 0 : ptr.x.toFixed(4), my = reduce ? 0 : ptr.y.toFixed(4);
      if (vis.universe) { uStage.style.setProperty('--mx', mx); uStage.style.setProperty('--my', my); }
      if (vis.work) { wStage.style.setProperty('--mx', mx); wStage.style.setProperty('--my', my); }
    }

    // camera dolly through the universe
    if (vis.universe && !reduce) {
      const r = uSec.getBoundingClientRect();
      const prog = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
      uDeck.style.setProperty('--dolly', (1 + 0.14 * prog).toFixed(4));
    }

    if (fog) {
      const introT = readyAt === null ? 0 : clamp((now - readyAt) / 2600, 0, 1);
      const intro = introT * introT * (3 - 2 * introT);
      fog.render(reduce ? 10 : now / 1000, fogLevel, intro, ptr.nx, ptr.ny);
    }
    if (vis.universe) ribbon.tick(dt);
    if (vis.timeline) tl.tick(dt, now);

    requestAnimationFrame(loop);
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function ready() {
    if (document.body.classList.contains('is-ready')) return;
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    readyAt = performance.now();
  }
  let rz;
  addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      fitAll();
      if (fog) fog.size();
      ribbon.size();
      tl.size();
      uni.place(); work.place();
    }, 120);
  });
  portraitMQ.addEventListener && portraitMQ.addEventListener('change', () => { tl.size(); uni.place(); });

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2500))]).then(() => {
    fitAll();
    tl.size();
    requestAnimationFrame(() => setTimeout(ready, reduce ? 0 : 350));
  });

  requestAnimationFrame(loop);
})();
