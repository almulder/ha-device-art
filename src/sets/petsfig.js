
(function () {
  const H = window.HDAH, P = "hda-petsfig-";
  const f = (n) => (+n).toFixed(1), a2 = (n) => Math.max(0, Math.min(1, n)).toFixed(2);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");

  
  function X(o, opt) {
    opt = opt || {};
    const on = !!o.on, lv = o.level == null ? 1 : Math.max(0, Math.min(1, o.level));
    const x = { o, u: o.uid, on, lv, an: on && o.anim, L: on ? .35 + .65 * lv : 0, d: [], k: {}, n: 0 };
    x.led = opt.led || o.color || "#4da3ff"; x.body = opt.body || "#eef0f2";
    x.id = (s) => `${o.uid}-${s}`;
    x.def = (key, mk) => { if (!x.k[key]) { const id = `${o.uid}-g${x.n++}`; x.k[key] = id; x.d.push(mk(id)); } return `url(#${x.k[key]})`; };
    x.lg = (a, x1, y1, x2, y2) => { x1 = x1 || 0; y1 = y1 || 0; x2 = x2 == null ? 0 : x2; y2 = y2 == null ? 1 : y2;
      return x.def("l" + JSON.stringify(a) + [x1, y1, x2, y2], (id) => `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`); };
    x.rg = (a, cx, cy, r) => { cx = cx == null ? .5 : cx; cy = cy == null ? .5 : cy; r = r || .5;
      return x.def("r" + JSON.stringify(a) + [cx, cy, r], (id) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`); };
    return x;
  }
  const pal = (c) => ({ l: H.shade(c, .5), m: c, d: H.shade(c, -.3), k: H.shade(c, -.56), e: H.shade(c, -.45) });

  
  const M = {
    v: (x, c) => { const p = pal(c); return x.lg([[0, p.l], [.45, p.m], [1, p.d]]); },
    h: (x, c) => { const p = pal(c); return x.lg([[0, p.d], [.22, p.l], [.6, p.m], [1, p.k]], 0, 0, 1, 0); },
    s: (x, c) => { const p = pal(c); return x.rg([[0, p.l], [.6, p.m], [1, p.d]], .38, .32, .78); },
    side: (x, c) => { const p = pal(c); return x.lg([[0, p.d], [1, p.k]], 0, 0, 1, 1); },
    gloss: (x) => x.lg([[0, "#fff", .55], [.5, "#fff", 0]], 0, 0, 1, 1),
    shadow: (x) => x.rg([[0, "#000", .6], [.6, "#000", .24], [1, "#000", 0]]),
    halo: (x, c) => x.rg([[0, c, .9], [.38, c, .32], [1, c, 0]]),
    steel: (x) => x.lg([[0, "#4b5057"], [.3, "#e2e6ea"], [.55, "#9aa1a9"], [1, "#3f444a"]], 0, 0, 1, 0),
    metal: (x, c) => x.lg([[0, H.shade(c, -.55)], [.25, H.shade(c, .35)], [.42, H.shade(c, .7)], [.62, H.shade(c, -.1)], [1, H.shade(c, -.6)]], 0, 0, 1, 0),
    hole: (x) => x.lg([[0, "#030305"], [1, "#1c1d24"]]),
  };

  
  const WALLS = { sage: ["#4c5850", "#333c36"], blue: ["#3e485b", "#2a3141"], clay: ["#62493f", "#45332c"], cream: ["#5e5950", "#433f38"],
    lav: ["#554f68", "#3a354b"], navy: ["#2f3852", "#1e2537"], gray: ["#4b4e56", "#33353c"], garage: ["#55585e", "#3c3e43"], olive: ["#4f5140", "#363829"] };
  function dots(seed, n, x0, y0, w, h, big, op) {
    const r = rnd(seed); let s = "";
    for (let i = 0; i < n; i++) s += `<circle cx="${f(x0 + r() * w)}" cy="${f(y0 + r() * h)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(op * (.4 + r() * .6)).toFixed(2)}"/>`;
    return s;
  }
  function wallB(x, k, y0, y1) {
    y0 = y0 || 8; y1 = y1 || 192; const w = WALLS[k] || WALLS.gray;
    return `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.lg([[0, w[0]], [1, w[1]]])}"/>` + dots(k.length * 131 + 7, 40, 8, y0, 184, y1 - y0, .7, .1);
  }
  function woodB(x, y0, tone) {
    tone = tone || "#8a6142"; const r = rnd(y0 * 17 + 3); let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, H.shade(tone, -.35)], [1, H.shade(tone, .08)]])}"/>`;
    let y = y0, g = 4.5;
    while (y < 192) { const y2 = y + g;
      s += `<rect x="8" y="${f(y)}" width="184" height="${f(g)}" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + r() * .06).toFixed(2)}"/>`;
      s += `<path d="M8 ${f(y2)}H192" stroke="#1b0f07" stroke-opacity=".5" stroke-width="${f(.5 + g * .06)}"/>`;
      const sx = 8 + r() * 184; s += `<path d="M${f(sx)} ${f(y)}V${f(y2)}" stroke="#1b0f07" stroke-opacity=".45" stroke-width=".8"/>`;
      s += `<path d="M${f(8 + r() * 60)} ${f(y + g * .45)}H${f(70 + r() * 120)}" stroke="#2a180b" stroke-opacity=".18" stroke-width=".6"/>`;
      y = y2; g *= 1.32; }
    return s;
  }
  function baseB(x, y, floor) {
    return `<rect x="8" y="${y}" width="184" height="18" fill="${x.lg([[0, "#e6e3ea"], [.25, "#cfccd6"], [1, "#a29fac"]])}"/>
<path d="M8 ${y + .5}H192" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/><path d="M8 ${y + 3.5}H192" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/><path d="M8 ${y + 5}H192" stroke="#000" stroke-opacity=".12" stroke-width="1"/>` +
      (floor === "carpet" ? carpetB(x, y + 18) : woodB(x, y + 18, floor)) + `<path d="M8 ${y + 18.5}H192" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>`;
  }
  function tileB(x, y0, y1, col) {
    col = col || "#d9dde3"; let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="#6d7079"/>`; const g = x.lg([[0, H.shade(col, .4)], [.5, col], [1, H.shade(col, -.25)]]);
    for (let row = 0, y = y0; y < y1; y += 13, row++) for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26)
      s += `<rect x="${bx + .7}" y="${y + .7}" width="24.6" height="11.6" rx="1.6" fill="${g}"/><path d="M${bx + 2} ${y + 2.4}H${bx + 18}" stroke="#fff" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/>`;
    return s + `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.lg([[0, "#000", .2], [1, "#000", .45]])}"/>`;
  }
  function counterB(x, y, col) {
    col = col || "#cfd0d6";
    return `<rect x="8" y="${y}" width="184" height="${192 - y}" fill="${x.lg([[0, H.shade(col, -.25)], [1, H.shade(col, -.05)]])}"/>` + dots(y * 7 + 1, 70, 8, y, 184, 192 - y, .8, .2) +
      `<path d="M8 ${y + .6}H192" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/><path d="M8 ${y + 2.2}H192" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>`;
  }
  function carpetB(x, y0) {
    return `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, "#3d3a46"], [1, "#575263"]])}"/>` + dots(y0 * 3 + 5, 260, 8, y0, 184, 192 - y0, .9, .16);
  }
  function concreteB(x, y0, col) {
    col = col || "#6c6f75";
    return `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, H.shade(col, -.35)], [1, col]])}"/>` + dots(y0 * 5 + 9, 120, 8, y0, 184, 192 - y0, .9, .14) +
      `<path d="M8 ${y0 + .5}H192" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/>`;
  }
  function sidingB(x, col) {
    col = col || "#55606c"; let s = `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, H.shade(col, .1)], [1, H.shade(col, -.3)]])}"/>`;
    for (let y = 8; y < 192; y += 16) s += `<rect x="8" y="${y}" width="184" height="16" fill="${x.lg([[0, "#fff", .0], [1, "#fff", .08]])}"/><path d="M8 ${y + 15}H192" stroke="#000" stroke-opacity=".45" stroke-width="2.2"/><path d="M8 ${y + 16.6}H192" stroke="#fff" stroke-opacity=".1" stroke-width="1"/>`;
    return s;
  }
  function blockB(x, y1) {
    let s = `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.lg([[0, "#686a6f"], [1, "#4a4c51"]])}"/>`; const r = rnd(77);
    for (let row = 0, y = 8; y < y1; y += 22, row++) for (let bx = 8 - (row % 2) * 22; bx < 192; bx += 44) {
      s += `<rect x="${bx + 1}" y="${y + 1}" width="42" height="20" rx="1" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.03 + r() * .06).toFixed(2)}"/>`;
      s += `<path d="M${bx} ${y}V${y + 22}M${bx} ${y}H${bx + 44}" stroke="#2e3034" stroke-opacity=".7" stroke-width="1.6"/><path d="M${bx + 1.4} ${y + 1.4}H${bx + 43}" stroke="#fff" stroke-opacity=".08"/>`; }
    return s + dots(31, 120, 8, 8, 184, y1 - 8, .8, .14);
  }
  function fenceB(x) {
    let s = `<rect x="8" y="8" width="184" height="184" fill="#3d2c22"/>`; const r = rnd(41);
    for (let bx = 8; bx < 192; bx += 23) { const t = H.mix("#7a5a40", "#5d4330", r());
      s += `<rect x="${bx + .8}" y="8" width="21.4" height="184" fill="${x.lg([[0, H.shade(t, -.2)], [.4, H.shade(t, .12)], [1, H.shade(t, -.25)]], 0, 0, 1, 0)}"/>`;
      for (let g = 0; g < 3; g++) { const gx = bx + 3 + r() * 16; s += `<path d="M${f(gx)} 8C${f(gx + 2)} 70 ${f(gx - 2)} 130 ${f(gx + 1)} 192" fill="none" stroke="#2a1a10" stroke-opacity=".3" stroke-width=".7"/>`; }
      s += `<circle cx="${bx + 11.5}" cy="40" r="1.1" fill="#1a1a1a"/><circle cx="${bx + 11.5}" cy="150" r="1.1" fill="#1a1a1a"/>`; }
    return s + `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#0b0d22", .45], [.6, "#000", .1], [1, "#000", .3]])}"/>`;
  }

  
  function scene(x, back, body) {
    const vig = x.rg([[0, "#000", 0], [.65, "#000", .06], [1, "#000", .5]], .5, .46, .75), c = x.id("clip");
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${c}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>${x.d.join("")}</defs>
<g clip-path="url(#${c})"><g class="hda-bg">${back}<rect x="8" y="8" width="184" height="184" fill="${vig}"/></g>${body}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g></svg>`;
  }

  
  
  function holes(x, cx, cy, s) {
    const hs = [
      `M${f(cx - 5.6 * s)} ${f(cy - 7 * s)}h${f(2 * s)}v${f(7.8 * s)}h${f(-2 * s)}z`,
      `M${f(cx + 3.6 * s)} ${f(cy - 6.4 * s)}h${f(2 * s)}v${f(6.4 * s)}h${f(-2 * s)}z`,
      `M${f(cx - 2.4 * s)} ${f(cy + 3.2 * s)}h${f(4.8 * s)}v${f(1.4 * s)}a${f(2.4 * s)} ${f(2.4 * s)} 0 0 1 ${f(-4.8 * s)} 0z`];
    return hs.map((d) => `<path d="${d}" fill="#fff" fill-opacity=".55" transform="translate(0 ${f(.7 * s)})"/><path d="${d}" fill="${M.hole(x)}"/>`).join("");
  }
  
  function face(x, cx, cy, s, col) {
    const w = 22 * s, h = 20 * s;
    return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2 + 1.2 * s)}" width="${f(w)}" height="${f(h)}" rx="${f(9.6 * s)}" fill="#000" fill-opacity=".22"/>
<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(9.6 * s)}" fill="${x.lg([[0, H.shade(col, .7)], [.6, col], [1, H.shade(col, -.18)]])}" stroke="${H.shade(col, -.35)}" stroke-width=".5"/>
<path d="M${f(cx - w * .34)} ${f(cy - h * .34)}Q${f(cx)} ${f(cy - h * .52)} ${f(cx + w * .34)} ${f(cy - h * .34)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${f(.8 * s)}" stroke-linecap="round"/>` + holes(x, cx, cy - .4 * s, s * 1.02);
  }
  const screw = (x, cx, cy, r, a) => `<circle cx="${f(cx)}" cy="${f(cy + .5)}" r="${f(r)}" fill="#000" fill-opacity=".3"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${M.steel(x)}"/>
<path d="M${f(cx - r * .7)} ${f(cy + r * (a || 0))}L${f(cx + r * .7)} ${f(cy - r * (a || 0))}" stroke="#2a2d33" stroke-width="${f(r * .38)}" stroke-linecap="round"/>`;
  function plateShadow(x0, y0, w, h, r) {
    return `<rect x="${f(x0 + 2.5)}" y="${f(y0 + 4)}" width="${f(w)}" height="${f(h)}" rx="${f(r + 2)}" fill="#000" fill-opacity=".16"/><rect x="${f(x0 + 1.2)}" y="${f(y0 + 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="#000" fill-opacity=".26"/>`;
  }
  function plateBody(x, x0, y0, w, h, r, col) {
    return plateShadow(x0, y0, w, h, r) + `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${x.lg([[0, H.shade(col, .65)], [.5, col], [1, H.shade(col, -.22)]])}"/>
<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${x.lg([[0, "#fff", .25], [.2, "#fff", 0], [.85, "#000", 0], [1, "#000", .18]], 0, 0, 1, 0)}"/>
<rect x="${f(x0 + 1.4)}" y="${f(y0 + 1.4)}" width="${f(w - 2.8)}" height="${f(h - 2.8)}" rx="${f(Math.max(1, r - 1))}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>
<rect x="${f(x0 + .3)}" y="${f(y0 + .3)}" width="${f(w - .6)}" height="${f(h - .6)}" rx="${f(r)}" fill="none" stroke="${H.shade(col, -.45)}" stroke-opacity=".6" stroke-width=".6"/>`;
  }
  
  function plateT(x, cx, cy, s, col) {
    col = col || "#eceef1"; const w = 50 * s, h = 80 * s;
    return plateBody(x, cx - w / 2, cy - h / 2, w, h, 4 * s, col) + face(x, cx, cy - 17 * s, s, col) + face(x, cx, cy + 17 * s, s, col) + screw(x, cx, cy, 2.6 * s, .3);
  }
  
  function plateD(x, cx, cy, s, col, inner) {
    col = col || "#eceef1"; const w = 48 * s, h = 78 * s, iw = 29 * s, ih = 58 * s;
    return plateBody(x, cx - w / 2, cy - h / 2, w, h, 3.5 * s, col) +
      `<rect x="${f(cx - iw / 2 - 1)}" y="${f(cy - ih / 2 - 1)}" width="${f(iw + 2)}" height="${f(ih + 2)}" rx="${f(2.6 * s)}" fill="#000" fill-opacity=".3"/>
<rect x="${f(cx - iw / 2)}" y="${f(cy - ih / 2)}" width="${f(iw)}" height="${f(ih)}" rx="${f(2.4 * s)}" fill="${x.lg([[0, H.shade(col, .5)], [.5, H.shade(col, -.04)], [1, H.shade(col, -.2)]])}"/>
<path d="M${f(cx - iw / 2 + 2)} ${f(cy - ih / 2 + 1)}H${f(cx + iw / 2 - 2)}" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>` +
      (inner || "") + holes(x, cx, cy - 13 * s, s) + holes(x, cx, cy + 13 * s, s);
  }

  
  function plugHead(x, cx, cy, s, col, rot) {
    const w = 15 * s, h = 17 * s, p = pal(col), r = 3.4 * s, t = rot ? ` transform="rotate(${rot} ${f(cx)} ${f(cy)})"` : "";
    let g = `<rect x="${f(cx - w / 2 + 1.5)}" y="${f(cy - h / 2 + 2.5)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="#000" fill-opacity=".35"/>
<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${M.h(x, col)}"/>
<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${M.gloss(x)}" opacity=".35"/>`;
    for (let i = 0; i < 4; i++) g += `<path d="M${f(cx - w * .32)} ${f(cy - h * .28 + i * 2.4 * s)}H${f(cx + w * .32)}" stroke="${p.k}" stroke-opacity=".55" stroke-width="${f(.7 * s)}"/>`;
    g += `<rect x="${f(cx - 3.2 * s)}" y="${f(cy + h / 2 - 1.5 * s)}" width="${f(6.4 * s)}" height="${f(5.5 * s)}" rx="${f(2 * s)}" fill="${M.h(x, col)}"/>
<path d="M${f(cx - w / 2 + 1.5)} ${f(cy - h / 2 + 1.2)}H${f(cx + w / 2 - 2)}" stroke="#fff" stroke-opacity=".45" stroke-width=".8" stroke-linecap="round"/>`;
    return `<g${t}>${g}</g>`;
  }

  
  function bez(a, b, c, d, t) { const m = 1 - t; return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d; }
  function cordD(pts) { let d = `M${pts[0]} ${pts[1]}`; for (let i = 2; i + 5 < pts.length; i += 6) d += `C${pts.slice(i, i + 6).join(" ")}`; return d; }
  function samples(pts, n) {
    const segs = (pts.length - 2) / 6, out = [];
    for (let i = 0; i < n; i++) { const T = (i + .5) / n * segs, k = Math.min(segs - 1, Math.floor(T)), t = T - k, b = k * 6;
      const P0 = [pts[b], pts[b + 1]], P1 = [pts[b + 2], pts[b + 3]], P2 = [pts[b + 4], pts[b + 5]], P3 = [pts[b + 6], pts[b + 7]];
      out.push([bez(P0[0], P1[0], P2[0], P3[0], t), bez(P0[1], P1[1], P2[1], P3[1], t)]); }
    return out;
  }
  function cord(x, pts, w, col, flow, n) {
    const d = cordD(pts), p = pal(col);
    let s = `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="${f(w + 1.6)}" stroke-linecap="round" transform="translate(2 3)"/>
<path d="${d}" fill="none" stroke="${p.k}" stroke-width="${f(w)}" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="${col}" stroke-width="${f(w * .6)}" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="${p.l}" stroke-opacity=".7" stroke-width="${f(Math.max(.5, w * .2))}" stroke-linecap="round" transform="translate(${f(-w * .16)} ${f(-w * .16)})"/>`;
    if (flow && x.on) s += chase(x, pts, n || 14, w, flow);
    return s;
  }
  function chase(x, pts, n, w, col) {
    const c = H.mix(col, "#ffffff", .45), dur = (2.2 - 1.3 * x.lv);
    return samples(pts, n).map(([cx, cy], i) => `<circle class="${P}flow" cx="${f(cx)}" cy="${f(cy)}" r="${f(Math.max(.9, w * .34))}" fill="${c}" style="animation-duration:${dur.toFixed(2)}s;animation-delay:${(-dur * (1 - i / n)).toFixed(2)}s"/>`).join("");
  }

  
  function led(x, cx, cy, r, col, k) {
    col = col || x.led; k = k == null ? 1 : k;
    if (!x.on) return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${H.mix(col, "#15161b", .78)}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .35)}" r="${f(r * .38)}" fill="#fff" fill-opacity=".25"/>`;
    return `<g class="${P}pulse"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 5)}" fill="${M.halo(x, col)}" opacity="${a2(.85 * k * x.L)}"/></g>
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${H.mix(col, "#ffffff", .5)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .5)}" fill="#fff"/>`;
  }
  
  function ringLed(x, cx, cy, rx, ry, w, col, k) {
    col = col || x.led; k = k == null ? 1 : k;
    if (!x.on) return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${H.mix(col, "#202128", .75)}" stroke-width="${f(w)}"/>
<ellipse cx="${f(cx)}" cy="${f(cy - w * .3)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="${f(w * .3)}"/>`;
    return `<g class="${P}pulse"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${col}" stroke-opacity="${a2(.22 * k * x.L)}" stroke-width="${f(w * 5)}"/>
<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${col}" stroke-opacity="${a2(.4 * k * x.L)}" stroke-width="${f(w * 2.4)}"/></g>
<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${H.mix(col, "#ffffff", .35)}" stroke-width="${f(w)}"/>
<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="${f(w * .3)}"/>`;
  }
  
  const spot = (x, cx, cy, rx, ry, col, k) => x.on ? `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${M.halo(x, col || x.led)}" opacity="${a2((k == null ? .6 : k) * x.L)}"/>` : "";

  
  function box(x, x0, y0, w, h, r, dx, dy, col, fr) {
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 1.2)), sd = M.side(x, col);
    let s = `<rect x="${f(x0 + dx + 3)}" y="${f(y0 + dy + 5)}" width="${f(w)}" height="${f(h)}" rx="${f(r + 3)}" fill="#000" fill-opacity=".16"/><rect x="${f(x0 + dx + 1)}" y="${f(y0 + dy + 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="#000" fill-opacity=".28"/>`;
    for (let i = n; i >= 1; i--) s += `<rect x="${f(x0 + dx * i / n)}" y="${f(y0 + dy * i / n)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${sd}"/>`;
    s += `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fr || M.v(x, col)}"/>
<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${M.gloss(x)}" opacity=".3"/>
<rect x="${f(x0 + .7)}" y="${f(y0 + .7)}" width="${f(w - 1.4)}" height="${f(h - 1.4)}" rx="${f(Math.max(.5, r - .7))}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width=".8"/>`;
    return s;
  }
  
  function button(x, cx, cy, r, col) {
    return `<circle cx="${f(cx)}" cy="${f(cy + .6)}" r="${f(r + .6)}" fill="#000" fill-opacity=".25"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${M.s(x, col)}"/>
<path d="M${f(cx - r * .6)} ${f(cy - r * .45)}A${f(r * .8)} ${f(r * .8)} 0 0 1 ${f(cx + r * .4)} ${f(cy - r * .7)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${f(Math.max(.5, r * .18))}" stroke-linecap="round"/>`;
  }

  
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function digits(x, xr, y, h, str, n, col) {
    const w = h * .56, gap = h * .2, t = Math.max(.7, h * .14), hh = h / 2, ch = String(str).padStart(n, " ").slice(-n);
    const lit = x.on ? H.mix(col, "#ffffff", .25) : col; let s = "";
    for (let i = 0; i < n; i++) {
      const x0 = xr - (n - i) * (w + gap) + gap, on = SEG[ch[i]] || "";
      const R = { a: [x0 + t * .6, y, w - t * 1.2, t], g: [x0 + t * .6, y + hh - t / 2, w - t * 1.2, t], d: [x0 + t * .6, y + h - t, w - t * 1.2, t],
        f: [x0, y + t * .6, t, hh - t * .9], b: [x0 + w - t, y + t * .6, t, hh - t * .9], e: [x0, y + hh + t * .3, t, hh - t * .9], c: [x0 + w - t, y + hh + t * .3, t, hh - t * .9] };
      for (const k in R) { const r = R[k], lt = x.on && on.indexOf(k) >= 0;
        s += `<rect x="${f(r[0])}" y="${f(r[1])}" width="${f(r[2])}" height="${f(r[3])}" rx="${f(t / 2)}" fill="${lt ? lit : "#fff"}" fill-opacity="${lt ? 1 : .05}"/>`; }
    }
    return `<g transform="translate(${f(y * .09)} 0) skewX(-5)">${s}</g>`;
  }
  
  function lcd(x, x0, y0, w, h, col) {
    return `<rect x="${f(x0 - 1)}" y="${f(y0 - 1)}" width="${f(w + 2)}" height="${f(h + 2)}" rx="3" fill="#000" fill-opacity=".45"/><rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="2.4" fill="${x.lg([[0, "#07090d"], [1, "#151922"]])}"/>` +
      (x.on ? `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="2.4" fill="${x.rg([[0, col, .35], [1, col, 0]], .5, .5, .7)}" opacity="${a2(.5 + .5 * x.L)}"/>` : "");
  }
  const glass = (x, x0, y0, w, h) => `<path d="M${f(x0 + 2)} ${f(y0 + 1.5)}H${f(x0 + w * .7)}L${f(x0 + w * .45)} ${f(y0 + h - 1.5)}H${f(x0 + 2)}Z" fill="#fff" fill-opacity=".07"/>`;
  const watts = (x) => x.on ? Math.round(2 + 1498 * Math.pow(x.lv, 1.25)) : 0;
  const clipU = (x, key, shape) => x.def("c" + key, (id) => `<clipPath id="${id}">${shape}</clipPath>`);
  
  function grass(x, y0) {
    const r = rnd(29); let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, "#3f6a30"], [1, "#5b8a43"]])}"/>`;
    for (let i = 0; i < 80; i++) { const gx = 8 + r() * 184, gy = y0 + 2 + r() * (190 - y0); s += `<path d="M${f(gx)} ${f(gy)}l${f(r() * 2 - 1)} ${f(-2 - r() * 4)}" stroke="${r() > .5 ? "#7aa85a" : "#2f5524"}" stroke-width=".9" stroke-linecap="round"/>`; }
    return s;
  }
  function tiles(x, y0, col) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, H.shade(col, -.25)], [1, col]])}"/>`;
    for (let i = 1; i < 5; i++) { const y = y0 + (192 - y0) * Math.pow(i / 5, 1.3); s += `<path d="M8 ${f(y)}H192" stroke="#000" stroke-opacity=".18"/>`; }
    for (let k = -5; k <= 5; k++) { const xb = 100 + k * 40, xt = 100 + (xb - 100) * .6; s += `<path d="M${f(xt)} ${y0}L${f(xb)} 192" stroke="#000" stroke-opacity=".15"/>`; }
    return s;
  }
  function bed(x, cx, cy, w) {
    return `<ellipse cx="${cx}" cy="${cy + 4}" rx="${w / 2 + 4}" ry="13" fill="#000" fill-opacity=".3"/><ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="14" fill="${x.lg([[0, "#8c6f8f"], [1, "#4f3c52"]])}"/>` +
      `<ellipse cx="${cx}" cy="${cy - 1}" rx="${w / 2 - 9}" ry="8" fill="${x.lg([[0, "#5a465c"], [1, "#a68aa8"]])}"/><path d="M${cx - w / 2 + 4} ${cy - 5}Q${cx} ${cy - 18} ${cx + w / 2 - 4} ${cy - 5}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`;
  }
  function backdrop(x, zone, act, away) {
    const G = 166;
    if (away) return `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#5d7fa8"], [1, "#b9cde0"]])}"/>` +
      `<path d="M8 120L40 96L70 112L110 88L150 110L192 92V140H8Z" fill="#6f879e"/><rect x="8" y="140" width="184" height="52" fill="${x.lg([[0, "#8d8f94"], [1, "#a9abb0"]])}"/>` +
      `<path d="M8 150H192" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-dasharray="12 10"/>` + dots(5, 60, 8, 140, 184, 52, .8, .2);
    if (zone === "yard") { let fence = ""; for (let i = 0; i < 12; i++) fence += `<rect x="${8 + i * 16}" y="${i % 2 ? 74 : 70}" width="15" height="${i % 2 ? 66 : 70}" fill="${x.lg([[0, "#ece6da"], [1, "#bdb5a6"]], 0, 0, 1, 0)}"/>`;
      return `<rect x="8" y="8" width="184" height="140" fill="${x.lg([[0, "#4a86c8"], [1, "#c6e0f2"]])}"/>` + fence + `<rect x="8" y="96" width="184" height="4" fill="#a39c90"/><rect x="8" y="124" width="184" height="4" fill="#a39c90"/>` + grass(x, 138); }
    if (zone === "vet") return `<rect x="8" y="8" width="184" height="${G - 26}" fill="${x.lg([[0, "#bfe2dc"], [1, "#9fcac2"]])}"/><rect x="8" y="${G - 34}" width="184" height="8" fill="#e8f2f0"/>` +
      `<rect x="146" y="26" width="30" height="30" rx="6" fill="#fff" fill-opacity=".85"/><path d="M161 32V50M152 41H170" stroke="#e0483e" stroke-width="5" stroke-linecap="round"/>` + tiles(x, G - 26, "#dfe6e6");
    if (zone === "daycare") { let paws = ""; const r = rnd(8); for (let i = 0; i < 7; i++) { const px = 20 + r() * 160, py = 20 + r() * 90; paws += `<g fill="#fff" fill-opacity=".35"><ellipse cx="${f(px)}" cy="${f(py)}" rx="4" ry="3.4"/><circle cx="${f(px - 4)}" cy="${f(py - 5)}" r="1.6"/><circle cx="${f(px)}" cy="${f(py - 6.5)}" r="1.6"/><circle cx="${f(px + 4)}" cy="${f(py - 5)}" r="1.6"/></g>`; }
      return `<rect x="8" y="8" width="184" height="${G - 26}" fill="${x.lg([[0, "#f2b45a"], [1, "#e0904a"]])}"/>` + paws + `<rect x="8" y="${G - 26}" width="184" height="${218 - G}" fill="${x.lg([[0, "#3d8a7a"], [1, "#5aa898"]])}"/>` +
        `<circle cx="34" cy="${G + 10}" r="6" fill="#e0483e"/><circle cx="172" cy="${G + 14}" r="7" fill="#3a6fd8"/><path d="M168 ${G + 14}H176" stroke="#fff" stroke-width="1.4"/>`; }
    return wallB(x, "clay", 8, G - 26) + `<rect x="8" y="${G - 30}" width="184" height="5" fill="#e6e1d8"/>` + woodB(x, G - 26, "#8a6142") +
      `<rect x="150" y="30" width="30" height="40" rx="2" fill="#2a2420"/><rect x="153" y="33" width="24" height="34" fill="${x.lg([[0, "#d9a066"], [1, "#7a5a8a"]])}"/>` +
      (act === "rest" || act === "sleep" ? bed(x, 100, G, 150) : `<ellipse cx="100" cy="${G + 6}" rx="80" ry="14" fill="${x.lg([[0, "#7a4a3a"], [1, "#a8664e"]])}"/><ellipse cx="100" cy="${G + 6}" rx="72" ry="11" fill="none" stroke="#e8c49a" stroke-opacity=".5" stroke-dasharray="3 3"/>`);
  }


  
  const R2 = (p) => `${f(p[0])} ${f(p[1])}`;
  const circ = (c, r) => `M${f(c[0] - r)} ${f(c[1])}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
  function cap(p, r1, q, r2) {
    const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy);
    if (d < .01 || d <= Math.abs(r1 - r2)) return r1 >= r2 ? circ(p, r1) : circ(q, r2);
    const a = Math.atan2(dy, dx), ph = Math.acos((r1 - r2) / d), n = 9; let s = "";
    for (let i = 0; i <= n; i++) { const t = a - ph + 2 * ph * i / n; s += (i ? "L" : "M") + R2([q[0] + r2 * Math.cos(t), q[1] + r2 * Math.sin(t)]); }
    for (let i = 0; i <= n; i++) { const t = a + ph + (2 * Math.PI - 2 * ph) * i / n; s += "L" + R2([p[0] + r1 * Math.cos(t), p[1] + r1 * Math.sin(t)]); }
    return s + "Z";
  }
  const chain = (pts) => { const out = []; for (let i = 0; i + 1 < pts.length; i++) out.push(cap(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])); return out; };
  const add = (p, v, k) => [p[0] + v[0] * (k == null ? 1 : k), p[1] + v[1] * (k == null ? 1 : k)];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const pol = (p, len, deg) => [p[0] + len * Math.cos(deg * Math.PI / 180), p[1] + len * Math.sin(deg * Math.PI / 180)];
  
  function unit(x, key, shapes, fill, over) {
    const cp = clipU(x, key, shapes.map((d) => `<path d="${d}"/>`).join(""));
    return shapes.map((d) => `<path d="${d}" fill="${fill}"/>`).join("") + (over ? `<g clip-path="${cp}">${over}</g>` : "");
  }
  const shadeRect = (x, y0, y1) => `<rect x="-300" y="${f(y0)}" width="600" height="${f(y1 - y0)}" fill="${x.lg([[0, "#fff", .26], [.35, "#fff", 0], [.62, "#000", 0], [1, "#000", .38]])}"/>`;
  const glowAt = (x, c, r, col, k) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${x.rg([[0, col, k == null ? .35 : k], [1, col, 0]])}"/>`;

  
  const DOG = (o) => Object.assign({ L: 50, D: 30, Lg: 30, N: 18, r: 12, m: 14, w: 8, w2: 6, ear: "drop", tail: "otter", T: 32, tr: 5, coat: "short", pat: "solid", slope: 0, neckA: -52 }, o);
  const BREEDS = [
    ["labrador", "Labrador Retriever", ["#e3c48c", "#1f1d1c", "#5a3b25", "#c88a4e"], DOG({ L: 54, D: 34, Lg: 33, N: 19, r: 12.5, m: 15, w: 9, w2: 7.5, tail: "otter", T: 34, tr: 5.5 })],
    ["golden", "Golden Retriever", ["#d9a056", "#ecd2a0", "#b8742e", "#c98a44"], DOG({ L: 54, D: 33, Lg: 33, N: 20, r: 12.5, m: 14, w: 8.5, w2: 7, tail: "plume", T: 36, tr: 5, coat: "long" })],
    ["shepherd", "German Shepherd", ["#b8783a", "#9a7448", "#1f1d1c", "#ece6da"], DOG({ L: 60, D: 34, Lg: 33, N: 22, r: 12, m: 17, w: 8, w2: 5.5, ear: "prick", earH: 1.55, tail: "saber", T: 42, tr: 6, coat: "double", pat: "saddle", slope: 6, neckA: -48 })],
    ["frenchie", "French Bulldog", ["#c9a274", "#4a3a2c", "#e8d6b8", "#6c7077"], DOG({ L: 34, D: 30, Lg: 22, N: 8, r: 14, m: 3.5, w: 10, w2: 9, ear: "bat", earH: 1.3, tail: "stub", T: 6, tr: 4, pat: "mask", neckA: -60 })],
    ["beagle", "Beagle", ["#b9763a", "#e2c27e", "#a8552d"], DOG({ L: 42, D: 26, Lg: 26, N: 14, r: 10.5, m: 12, w: 7, w2: 6, ear: "long", tail: "flag", T: 26, tr: 3.6, pat: "tri", tip: 1 })],
    ["dachshund", "Dachshund", ["#9a4a24", "#2a221d", "#5a3b25", "#e2c08a"], DOG({ L: 66, D: 22, Lg: 12, N: 14, r: 10, m: 16, w: 6.5, w2: 5, ear: "long", tail: "whip", T: 30, tr: 3, neckA: -45 })],
    ["husky", "Siberian Husky", ["#6e7279", "#2a2a2c", "#a8603a", "#7a6650"], DOG({ L: 50, D: 30, Lg: 32, N: 16, r: 11.5, m: 13, w: 7.5, w2: 5.5, ear: "prick", earH: 1.25, tail: "curl", T: 34, tr: 6.5, coat: "double", pat: "husky" })],
    ["corgi", "Corgi", ["#c87a3c", "#9a6a3c", "#2a221d", "#d9a060"], DOG({ L: 50, D: 26, Lg: 12, N: 12, r: 11.5, m: 11, w: 7, w2: 5, ear: "prick", earH: 1.55, tail: "stub", T: 6, tr: 6, coat: "double", pat: "white", neckA: -60 })],
    ["collie", "Border Collie", ["#1f1d1c", "#8a4a2c", "#7d838c", "#5a3b25"], DOG({ L: 48, D: 26, Lg: 28, N: 16, r: 10.5, m: 12, w: 6.5, w2: 4.5, ear: "semi", earH: 1.15, tail: "saber", T: 36, tr: 4.4, coat: "long", pat: "collie", tip: 1 })],
    ["poodle", "Poodle", ["#f2eee8", "#1f1d1c", "#e0b07a", "#8d8f93", "#5a3b25"], DOG({ L: 40, D: 26, Lg: 36, N: 22, r: 10, m: 15, w: 6, w2: 5, ear: "long", tail: "pom", T: 18, tr: 3.4, coat: "curly", neckA: -62 })],
  ];
  const CAT = (o) => Object.assign({ L: 38, D: 20, Lg: 20, N: 6, r: 9.5, m: 2.6, w: 5, w2: 4, ear: "cat", earH: 1.15, tail: "cat", T: 40, tr: 2.7, coat: "short", pat: "solid", cat: 1, neckA: -40, eye: "#c9b23a" }, o);
  const CATS = [
    ["tabby", "Tabby cat", ["#9a7650", "#8a8378", "#b08a5a"], CAT({ pat: "tabby", eye: "#9ac23a" })],
    ["blackcat", "Black cat", ["#1e1d1d", "#3a3536", "#2b2a2e"], CAT({ eye: "#e0b830" })],
    ["siamese", "Siamese cat", ["#e9dcc5", "#efe6d6", "#d8cbb4"], CAT({ pat: "points", eye: "#5aa8e8", L: 40, Lg: 22, r: 9, m: 3.6, earH: 1.35 })],
    ["orangecat", "Orange cat", ["#d9853a", "#e8a45a", "#c46a2a"], CAT({ pat: "tabby", eye: "#c9a23a" })],
  ];

  
  function skeleton(B, act, phase) {
    const { L, D, Lg } = B, cat = !!B.cat, S = {};
    const stand = (slope) => { S.Cc = [L / 2, -(Lg + D * .5)]; S.Mid = [-L * .08, S.Cc[1] - D * .1 + slope * .4]; S.Hc = [-L / 2, S.Cc[1] + slope]; S.rc = D * .5; S.rm = D * (cat ? .4 : .37); S.rh = D * (cat ? .42 : .4); };
    S.lie = act === "rest" || act === "sleep" || (cat && act === "eat");
    if (act === "rest" || act === "sleep") {
      S.Cc = [L / 2, -D * .5]; S.Mid = [-L * .05, -D * .52]; S.Hc = [-L / 2 + D * .1, -D * .46]; S.rc = D * .5; S.rm = D * .44; S.rh = D * .46;
      if (act === "sleep") { S.Cc = [L * .42, -D * .46]; S.Mid = [0, -D * .62]; S.Hc = [-L * .42, -D * .5]; S.rm = D * .5; }
      if (act === "sleep" && cat) { S.Cc = [L * .22, -D * .55]; S.Mid = [0, -D * .7]; S.Hc = [-L * .26, -D * .56]; S.rc = D * .56; S.rm = D * .66; S.rh = D * .58; }
    } else if (act === "play") {
      stand(0); S.Cc = [L * .48, -D * .58]; S.Mid = [-L * .05, (S.Cc[1] + S.Hc[1]) / 2 - D * .05];
    } else if (cat && act === "eat") {
      S.Cc = [L / 2, -(Lg * .9 + D * .5)]; S.Mid = [-L * .05, -D * .7]; S.Hc = [-L / 2 + D * .15, -D * .5]; S.rc = D * .48; S.rm = D * .42; S.rh = D * .46;
    } else stand(B.slope || 0);
    
    const legF = (dx, P) => { const Sh = [S.Cc[0] - D * .02 + dx, S.Cc[1] - D * .05], rP = D * (cat ? .1 : .095);
      const d = Math.hypot(P[0] - Sh[0], P[1] - Sh[1]), seg = (Lg + D * .45) * .52, b = Math.sqrt(Math.max(0, seg * seg - d * d / 4)) * .55;
      const mid = lerp(Sh, P, .5), nx = -(P[1] - Sh[1]) / d, ny = (P[0] - Sh[0]) / d, E = [mid[0] - Math.abs(nx) * b - D * .05, mid[1] + ny * 0];
      const K = lerp(E, P, .84);
      const q = cat ? .78 : 1; return [[Sh, D * .3 * q], [E, D * .14 * q], [K, D * .085 * q], [[P[0] + rP * .6, P[1] - rP * .1], rP * (cat ? .85 : 1)]]; };
    const legH = (dx, P) => { const Hp = [S.Hc[0] + D * .06 + dx, S.Hc[1] + D * .02], rP = D * (cat ? .1 : .095);
      const Hk = [P[0] - D * .2, P[1] - Lg * .3 - D * .05], St = [lerp(Hp, Hk, .5)[0] + D * .26, lerp(Hp, Hk, .5)[1] + D * .05];
      const q = cat ? .8 : 1; return [[Hp, D * .38 * q], [St, D * .17 * q], [Hk, D * .08 * q], [[P[0] + rP * .5, P[1] - rP * .1], rP * (cat ? .85 : 1)]]; };
    S.legs = (t) => {  
      const g = (ph) => { if (t == null) return [0, 0]; const a = 2 * Math.PI * (t + ph); return [Math.cos(a) * D * .42, Math.max(0, -Math.sin(a)) * D * .22]; };
      const fx = S.Cc[0] + D * .02, hx = S.Hc[0] - D * .02;
      const nf = g(0), ff = g(.5), nh = g(.5), fh = g(0);
      return { nearF: legF(0, [fx + nf[0], -nf[1]]), farF: legF(-D * .16, [fx - D * .16 + ff[0], -ff[1]]), nearH: legH(0, [hx + nh[0], -nh[1]]), farH: legH(D * .14, [hx + D * .14 + fh[0], -fh[1]]) };
    };
    if (act === "eat" && !cat) S.legs = () => ({ nearF: legF(0, [S.Cc[0] + D * .42, 0]), farF: legF(-D * .1, [S.Cc[0] + D * .2, 0]), nearH: legH(0, [S.Hc[0] - D * .04, 0]), farH: legH(D * .14, [S.Hc[0] + D * .12, 0]) });
    if (act === "play") S.legs = () => { const E = [S.Cc[0] - D * .02, -D * .13], E2 = [S.Cc[0] - D * .18, -D * .12];
      const fl = (e) => [[[S.Cc[0], S.Cc[1] + D * .05], D * .28], [e, D * .14], [[e[0] + D * .62, -D * .085], D * .085], [[e[0] + D * .82, -D * .09], D * .095]];
      return { nearF: fl(E), farF: fl(E2), nearH: legH(0, [S.Hc[0] - D * .02, 0]), farH: legH(D * .14, [S.Hc[0] + D * .12, 0]) }; };
    if (S.lie) S.legs = () => {
      const fl = (dx) => [[[S.Cc[0] - D * .05 + dx, S.Cc[1] + D * .05], D * .26], [[S.Cc[0] - D * .05 + dx, -D * .14], D * .14], [[S.Cc[0] + D * .65 + dx, -D * .085], D * .085], [[S.Cc[0] + D * .88 + dx, -D * .09], D * .095]];
      const hl = (dx) => [[[S.Hc[0] + D * .08 + dx, S.Hc[1] + D * .02], D * .44], [[S.Hc[0] + D * .5 + dx, -D * .2], D * .15], [[S.Hc[0] + D * .7 + dx, -D * .085], D * .085]];
      const catEat = cat && act === "eat";
      const front = act === "sleep" ? (dx) => [[[S.Cc[0] - D * .05 + dx, S.Cc[1] + D * .05], D * .24], [[S.Cc[0] + D * .1 + dx, -D * .12], D * .13], [[S.Cc[0] + D * .5 + dx, -D * .09], D * .09]]
        : catEat ? (dx) => [[[S.Cc[0] + dx, S.Cc[1] + D * .05], D * .27], [[S.Cc[0] + D * .05 + dx, -Lg * .55], D * .13], [[S.Cc[0] + D * .12 + dx, -D * .08], D * .085], [[S.Cc[0] + D * .26 + dx, -D * .09], D * .1]] : fl;
      const fr = act === "rest" && cat ? (dx) => [[[S.Cc[0] - D * .05 + dx, S.Cc[1] + D * .05], D * .26], [[S.Cc[0] + D * .1 + dx, -D * .12], D * .13], [[S.Cc[0] + D * .35 + dx, -D * .09], D * .1]] : front;
      return { nearF: fr(0), farF: fr(-D * .18), nearH: hl(0), farH: [] }; };
    
    let na = B.neckA, nl = B.N;
    if (act === "walk") na += 10;
    if (act === "play") { na = -24; nl = B.N * .8; }
    if (act === "eat") { na = cat ? 60 : 58; }
    if (act === "rest") na = B.neckA - 6;
    S.Nb = [S.Cc[0] + D * .14, S.Cc[1] - D * .22];
    if (act === "eat") nl = Math.max(B.N * .5, (-(B.r * (cat ? 1.25 : 1.55) + D * .42) - S.Nb[1]) / Math.sin(na * Math.PI / 180));
    S.Hj = act === "sleep" ? [S.Cc[0] + D * (cat ? .42 : .55), -B.r * .78] : pol(S.Nb, nl, na);
    S.headA = act === "eat" ? (cat ? 48 : 60) : act === "sleep" ? 14 : act === "play" ? -4 : 0;
    return S;
  }

  
  function head(x, B, col, dk, lt, act, uidK) {
    const r = B.r, m = B.m, cat = !!B.cat, closed = act === "sleep";
    const Hs = [r * .35, -r * .15], mb = [Hs[0] + r * .45, Hs[1] + r * .32], tip = [Hs[0] + r * .62 + m, Hs[1] + r * (cat ? .35 : .3)];
    const shapes = [circ(Hs, r), cap(mb, B.w, tip, B.w2), cap([Hs[0] + r * .1, Hs[1] + r * .45], r * .6, [tip[0] - m * .25, tip[1] + B.w2 * .7], B.w2 * .62), cap([0, 0], r * .72, Hs, r * .8)];
    if (B.pat === "mask" || B.w > 9) shapes.push(circ([Hs[0] + r * .7, Hs[1] + r * .38], r * .62));
    if (B.coat === "curly") shapes.push(circ([Hs[0] - r * .15, Hs[1] - r * .8], r * .68));
    let over = shadeRect(x, Hs[1] - r * 1.1, tip[1] + B.w2 * 1.6) + glowAt(x, [Hs[0] - r * .1, Hs[1] - r * .55], r * .9, "#ffffff", .22);
    const WH = "#f4f0e8", BK = "#1d1a18";
    if (B.pat === "saddle" || B.pat === "mask") over += cap(mb, B.w + 1.5, [tip[0] + 2, tip[1]], B.w2 + 2).replace(/^/, `<path fill="${BK}" opacity=".85" d="`) + `"/>`;
    if (B.pat === "husky") over += `<path d="${cap([Hs[0] + r * .2, Hs[1] + r * .5], r * .62, [tip[0], tip[1] + 2], B.w2 + 2)}" fill="${WH}"/><circle cx="${f(Hs[0] + r * .5)}" cy="${f(Hs[1] - r * .48)}" r="${f(r * .14)}" fill="${WH}"/>`;
    if (B.pat === "tri" || B.pat === "white" || B.pat === "collie") over += `<path d="${cap([Hs[0] + r * .52, Hs[1] - r * 1.05], r * .1, [Hs[0] + r * .8, Hs[1] + r * .1], r * .22)}" fill="${WH}"/><path d="${cap(mb, B.w + 1, [tip[0] + 2, tip[1] + 1], B.w2 + 2)}" fill="${WH}" opacity=".95"/>`;
    if (B.pat === "points") over += `<path d="${cap([Hs[0] + r * .45, Hs[1] + r * .2], r * .55, [tip[0], tip[1]], B.w2 + 2.5)}" fill="${H.shade(col, -.62)}" opacity=".9"/>`;
    if (B.pat === "tabby") over += `<path d="M${f(Hs[0] - r * .05)} ${f(Hs[1] - r * .9)}l${f(r * .12)} ${f(r * .35)} ${f(r * .12)} ${f(-r * .35)} ${f(r * .12)} ${f(r * .35)}M${f(Hs[0] - r * .6)} ${f(Hs[1] + r * .05)}q${f(r * .3)} ${f(-r * .1)} ${f(r * .55)} ${f(r * .05)}M${f(Hs[0] - r * .55)} ${f(Hs[1] + r * .35)}q${f(r * .3)} ${f(-r * .05)} ${f(r * .55)} ${f(r * .08)}" fill="none" stroke="${H.shade(col, -.5)}" stroke-width="${f(r * .1)}" stroke-linecap="round"/>`;
    if (B.coat === "curly") over += curls(x, Hs[0] - r * 1.1, Hs[1] - r * 1.6, r * 2, r * 2.2, dk, 9);
    const headU = unit(x, "hd" + uidK, shapes, x.rg([[0, lt], [.6, col], [1, dk]], .4, .35, .8), over);
    
    const eC = [Hs[0] + r * .5, Hs[1] - r * .12], er = r * (cat ? .2 : .14);
    const eye = closed ? `<path d="M${f(eC[0] - er)} ${f(eC[1])}q${f(er)} ${f(er * .7)} ${f(er * 2)} ${f(-er * .1)}" fill="none" stroke="#1a1210" stroke-width="${f(Math.max(.8, r * .08))}" stroke-linecap="round"/>`
      : `<ellipse cx="${f(eC[0])}" cy="${f(eC[1])}" rx="${f(er * 1.05)}" ry="${f(er * .82)}" fill="${cat ? B.eye : "#3a2414"}"/>` + (cat ? `<ellipse cx="${f(eC[0] + er * .1)}" cy="${f(eC[1])}" rx="${f(er * .28)}" ry="${f(er * .72)}" fill="#0b0808"/>` : `<circle cx="${f(eC[0])}" cy="${f(eC[1])}" r="${f(er * .55)}" fill="#0b0808"/>`) +
        `<circle cx="${f(eC[0] + er * .35)}" cy="${f(eC[1] - er * .35)}" r="${f(er * .3)}" fill="#fff"/><path d="M${f(eC[0] - er * 1.2)} ${f(eC[1] - er * .7)}q${f(er * 1.2)} ${f(-er * .8)} ${f(er * 2.3)} ${f(-er * .05)}" fill="none" stroke="${H.shade(col, -.45)}" stroke-width="${f(r * .07)}" stroke-linecap="round"/>` +
        `<g class="${x.o.on && act === "rest" ? P + "blink" : ""}" opacity="0"><path d="M${f(eC[0] - er * 1.1)} ${f(eC[1])}a${f(er * 1.1)} ${f(er * .9)} 0 0 1 ${f(er * 2.2)} 0Z" fill="${col}"/></g>`;
    const nC = [tip[0] + B.w2 * .45, tip[1] - B.w2 * .55], nr = cat ? B.w2 * .45 : Math.max(2.2, B.w2 * .5);
    const nose = `<ellipse cx="${f(nC[0])}" cy="${f(nC[1])}" rx="${f(nr * 1.1)}" ry="${f(nr * .8)}" fill="${cat ? "#c9787a" : "#1a1416"}"/><ellipse cx="${f(nC[0] - nr * .2)}" cy="${f(nC[1] - nr * .35)}" rx="${f(nr * .45)}" ry="${f(nr * .22)}" fill="#fff" fill-opacity=".5"/>`;
    const mouthOpen = act === "play" && x.o.on && !cat;
    const jawP = [tip[0] - m * .15, tip[1] + B.w2 * .75];
    const mouth = `<path d="M${f(nC[0] - nr * .3)} ${f(nC[1] + nr * .7)}Q${f(jawP[0])} ${f(jawP[1] + 1)} ${f(Hs[0] + r * .62)} ${f(tip[1] + B.w2 * .45)}" fill="none" stroke="#2a1a14" stroke-width="${f(Math.max(.6, r * .06))}" stroke-linecap="round"/>` +
      (mouthOpen ? `<path d="M${f(jawP[0] - 1)} ${f(jawP[1] - 1)}q${f(B.w2 * .4)} ${f(B.w2 * 1.6)} ${f(B.w2 * 1.2)} ${f(B.w2 * .2)}" fill="#e07a8a" stroke="#b05a68" stroke-width=".5"/>` : "");
    const whisk = cat ? `<path d="M${f(tip[0] - 1)} ${f(tip[1] + 1)}l${f(r * .9)} ${f(-r * .12)}M${f(tip[0] - 1)} ${f(tip[1] + 2)}l${f(r * .9)} ${f(r * .1)}M${f(tip[0] - 2)} ${f(tip[1] + 3)}l${f(r * .8)} ${f(r * .3)}" stroke="#fff" stroke-opacity=".75" stroke-width=".45"/>` : "";
    
    const earCol = B.pat === "points" ? H.shade(col, -.62) : B.pat === "tri" ? H.shade(col, -.1) : H.shade(col, -.16);
    let ear = "";
    if (B.ear === "drop" || B.ear === "long") { const len = B.ear === "long" ? r * 1.55 : r * 1.05;
      ear = `<path d="M${f(Hs[0] - r * .05)} ${f(Hs[1] - r * .82)}C${f(Hs[0] - r * .75)} ${f(Hs[1] - r * .6)} ${f(Hs[0] - r * .85)} ${f(Hs[1] + len * .55)} ${f(Hs[0] - r * .35)} ${f(Hs[1] + len)}C${f(Hs[0] + r * .05)} ${f(Hs[1] + len * .9)} ${f(Hs[0] + r * .2)} ${f(Hs[1] + len * .2)} ${f(Hs[0] + r * .25)} ${f(Hs[1] - r * .55)}Z" fill="${x.lg([[0, H.shade(earCol, .1)], [1, H.shade(earCol, -.25)]])}"/>` +
        (B.coat === "curly" ? curls(x, Hs[0] - r * .7, Hs[1] - r * .3, r * .9, len * 1.1, H.shade(earCol, -.3), 6, true) : "") +
        (B.coat === "long" ? `<path d="M${f(Hs[0] - r * .55)} ${f(Hs[1] + len * .6)}q${f(-r * .1)} ${f(r * .3)} ${f(r * .05)} ${f(r * .45)}" fill="none" stroke="${earCol}" stroke-width="${f(r * .25)}" stroke-dasharray="1.5 1.5"/>` : ""); }
    else if (B.ear === "rose") ear = "";
    else { const h = (B.earH || 1.4) * r, wd = B.ear === "bat" ? .62 : B.ear === "cat" ? .55 : .48, base = [Hs[0] - r * .15, Hs[1] - r * .7];
      const tipP = B.ear === "semi" ? [base[0] + r * .2, base[1] - h * .8] : [base[0] - r * .1, base[1] - h];
      const tipD = B.ear === "semi" ? `L${f(tipP[0])} ${f(tipP[1])}Q${f(tipP[0] + r * .35)} ${f(tipP[1] + r * .1)} ${f(tipP[0] + r * .45)} ${f(tipP[1] + r * .5)}` : `Q${f(tipP[0] - r * .05)} ${f(tipP[1] - r * .05)} ${f(tipP[0] + r * .08)} ${f(tipP[1] + r * .05)}`;
      ear = `<path d="M${f(base[0] - r * wd)} ${f(base[1] + r * .25)}Q${f(base[0] - r * wd * .9)} ${f(base[1] - h * .5)} ${f(tipP[0] - r * .06)} ${f(tipP[1] + r * .1)}${tipD}Q${f(base[0] + r * wd * .9)} ${f(base[1] - h * .35)} ${f(base[0] + r * wd)} ${f(base[1] + r * .3)}Z" fill="${x.lg([[0, H.shade(earCol, .08)], [1, H.shade(earCol, -.2)]], 0, 0, 1, 0)}"/>` +
        `<path d="M${f(base[0] - r * wd * .45)} ${f(base[1] + r * .1)}Q${f(base[0] - r * wd * .3)} ${f(base[1] - h * .45)} ${f(tipP[0])} ${f(tipP[1] + h * .22)}Q${f(base[0] + r * wd * .4)} ${f(base[1] - h * .3)} ${f(base[0] + r * wd * .5)} ${f(base[1] + r * .15)}Z" fill="#d89a9a" opacity="${B.pat === "points" ? .35 : .6}"/>` +
        (B.coat === "double" ? `<path d="M${f(base[0] - r * wd * .4)} ${f(base[1] + r * .1)}l${f(r * .1)} ${f(-h * .3)}M${f(base[0])} ${f(base[1])}l${f(r * .05)} ${f(-h * .35)}" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>` : ""); }
    const earG = `<g class="${x.o.on && act === "rest" ? P + "twitch" : ""}" style="transform-origin:${f(Hs[0])}px ${f(Hs[1] - r * .7)}px">${ear}</g>`;
    const top = "";
    const jaw = act === "eat" && x.o.on ? `<g class="${P}chew">${mouth}</g>` : mouth;
    const earBehind = B.ear === "drop" || B.ear === "long";
    return (earBehind ? "" : earG) + top + headU + eye + nose + jaw + whisk + (earBehind ? earG : "");
  }
  function curls(x, x0, y0, w, h, col, n, dense) {
    const rr = rnd(Math.round(x0 * 13 + y0 * 7 + n)); let s = "";
    for (let i = 0; i < n * (dense ? 3 : 4); i++) s += `<circle cx="${f(x0 + rr() * w)}" cy="${f(y0 + rr() * h)}" r="${f(1.4 + rr() * 1.8)}" fill="none" stroke="${col}" stroke-opacity=".38" stroke-width=".7"/>`;
    return s;
  }

  
  function tailPts(B, act, S) {
    const D = B.D, base = [S.Hc[0] - S.rh * .75, S.Hc[1] - S.rh * .35], T = B.T, cat = !!B.cat;
    if (B.tail === "stub") return [[base, B.tr], [add(base, [-B.T, -1]), B.tr * .8]];
    let ang;  
    const lyingDown = act === "rest" || act === "sleep" || (cat && act === "eat");
    if (lyingDown) ang = act === "sleep" ? [70, 40, 10, -20] : [40, 20, 5, -5];
    else if (cat) ang = act === "walk" || act === "play" ? [-60, -85, -100, -125] : act === "eat" ? [30, 50, 60, 55] : [-40, -70, -90, -100];
    else ({ otter: () => ang = act === "walk" ? [-10, 0, 10, 20] : [25, 40, 55, 65], plume: () => ang = act === "play" ? [-40, -60, -70, -80] : act === "walk" ? [-10, 0, 10, 20] : [20, 35, 45, 55],
      saber: () => ang = act === "play" ? [-20, -10, 0, 10] : [45, 60, 70, 60], flag: () => ang = [-55, -70, -80, -85], whip: () => ang = act === "play" ? [-30, -40, -45, -50] : [20, 30, 40, 50],
      curl: () => ang = [-70, -110, -150, -185], pom: () => ang = [-60, -70, -75, -80] })[B.tail]();
    const pts = [[base, B.tr]]; let p = base;
    for (let i = 0; i < 4; i++) { const a = 180 - ang[i]; p = pol(p, T / 4, a); pts.push([p, B.tr * (1 - .17 * (i + 1)) + (B.tail === "plume" || B.tail === "saber" || B.tail === "curl" ? B.tr * .25 : 0)]); }
    if (act === "sleep" && !cat) { const q = [[base, B.tr]]; let pp = base; [100, 70, 20, -5].forEach((a, i) => { pp = pol(pp, T / 4, a); q.push([[pp[0], Math.min(pp[1], -B.tr)], B.tr * (1 - .12 * (i + 1))]); }); return q; }
    if (cat && act === "sleep") { const q = [[base, B.tr]]; let pp = base; [90, 60, 20, 0, -10].forEach((a) => { pp = pol(pp, T / 5, a); q.push([[pp[0], Math.min(pp[1], -B.tr)], B.tr]); }); return q; }
    return pts;
  }

  
  function animal(x, B, act, col, col2) {
    const S = skeleton(B, act), D = B.D, cat = !!B.cat, uk = B.id + act;
    const dk = H.shade(col, -.3), lt = H.shade(col, .25), far = H.shade(col, -.36);
    const WH = "#f4f0e8", BK = "#1d1a18";
    const walk = act === "walk";
    const yTop = Math.min(S.Cc[1], S.Hc[1]) - D * .6;
    
    const torso = [cap(S.Cc, S.rc, S.Mid, S.rm), cap(S.Mid, S.rm, S.Hc, S.rh), cap(S.Nb, D * (cat ? .3 : .36), S.Hj, D * (cat ? .22 : .25)), cap(S.Cc, S.rc * .95, S.Nb, D * (cat ? .3 : .36))];
    const legSet = (t) => S.legs(t);
    const L0 = legSet(walk ? 0 : null);
    const legShapes = (lg) => lg.length ? chain(lg) : [];
    
    const sockCut = -B.Lg * (cat ? .25 : .55);
    let pat = "";
    if (B.pat === "saddle") pat += `<path d="${cap([S.Cc[0] - D * .15, S.Cc[1] - D * .35], D * .32, [S.Hc[0] + D * .05, S.Hc[1] - D * .3], D * .38)}" fill="${BK}" opacity=".9"/>` + `<path d="${cap(S.Nb, D * .2, lerp(S.Nb, S.Hj, .7), D * .12)}" fill="${BK}" opacity=".55" transform="translate(-2 -3)"/>`;
    if (B.pat === "tri") pat += `<path d="${cap([S.Cc[0] - D * .2, S.Cc[1] - D * .32], D * .3, [S.Hc[0] + D * .15, S.Hc[1] - D * .28], D * .33)}" fill="${BK}"/><path d="${cap([S.Cc[0] + D * .2, S.Cc[1] + D * .3], D * .35, [S.Mid[0], S.Mid[1] + D * .45], D * .2)}" fill="${WH}"/>`;
    if (B.pat === "husky") pat += `<path d="${cap([S.Cc[0] + D * .1, S.Cc[1] + D * .3], D * .38, [S.Hc[0] + D * .1, S.Hc[1] + D * .38], D * .22)}" fill="${WH}"/><path d="${cap(lerp(S.Nb, S.Hj, .2), D * .22, lerp(S.Nb, S.Hj, .9), D * .14)}" fill="${WH}" transform="translate(4 4)"/>`;
    if (B.pat === "white" || B.pat === "collie") pat += `<path d="${cap([S.Cc[0] + D * .25, S.Cc[1] + D * .1], D * .36, [S.Mid[0] + D * .2, S.Mid[1] + D * .45], D * .16)}" fill="${WH}"/><path d="${cap(lerp(S.Nb, S.Hj, .1), D * .28, lerp(S.Nb, S.Hj, .85), D * .18)}" fill="${WH}" transform="translate(3 3)"/>` +
      (B.pat === "collie" ? `<path d="${cap(lerp(S.Nb, S.Hj, .35), D * .42, lerp(S.Nb, S.Hj, .62), D * .33)}" fill="${WH}"/>` : "");
    if (B.pat === "tabby") { const st = H.shade(col, -.52); for (let i = 0; i < 8; i++) { const xx = S.Hc[0] + (S.Cc[0] - S.Hc[0]) * (i + .3) / 8, yy = lerp(S.Hc, S.Cc, (i + .3) / 8)[1] - D * .55;
      pat += `<path d="M${f(xx)} ${f(yy)}q${f(D * .1)} ${f(D * .3)} ${f(-D * .05)} ${f(D * .62)}" fill="none" stroke="${st}" stroke-width="${f(D * .09)}" stroke-linecap="round"/>`; }
      if (!S.lie) pat += `<path d="M${f(S.Hc[0])} ${f(S.Hc[1] - D * .45)}L${f(S.Cc[0])} ${f(S.Cc[1] - D * .5)}" stroke="${st}" stroke-width="${f(D * .12)}" stroke-linecap="round"/>`; }
    if (B.pat === "points") pat += `<path d="${cap(S.Nb, D * .3, S.Hj, D * .3)}" fill="${H.shade(col, -.25)}" opacity=".5"/>`;
    if (B.coat === "curly") pat += curls(x, S.Hc[0] - D * .5, yTop, S.Cc[0] - S.Hc[0] + D, D * 1.3, dk, 14);
    if (B.coat === "double" || B.coat === "long") pat += `<path d="M${f(S.Hc[0] - D * .1)} ${f(S.Hc[1] - S.rh * .95)}Q${f(S.Mid[0])} ${f(S.Mid[1] - S.rm * 1.15)} ${f(S.Cc[0])} ${f(S.Cc[1] - S.rc * .95)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.6" stroke-dasharray="1.2 2.2"/>`;
    const over = shadeRect(x, yTop, 0) + glowAt(x, [S.Cc[0] - D * .05, S.Cc[1] - D * .15], D * .42, "#ffffff", .2) + glowAt(x, [S.Hc[0] + D * .05, S.Hc[1] - D * .1], D * .4, "#ffffff", .16) + pat;
    
    const sockCol = B.pat === "husky" || B.pat === "tri" || B.pat === "white" || B.pat === "collie" ? WH : B.pat === "points" ? H.shade(col, -.62) : (B.pat === "saddle" ? H.shade(col, .1) : null);
    const sockClip = clipU(x, "sock" + uk, `<rect x="-400" y="${f(sockCut)}" width="800" height="400"/>`);
    const legDraw = (lg, isFar, key) => { const sh = legShapes(lg); if (!sh.length) return "";
      const fillC = isFar ? far : col, g = x.lg([[0, H.shade(fillC, .12)], [.6, fillC], [1, H.shade(fillC, -.22)]], 0, 0, 1, 0);
      let s = sh.map((d) => `<path d="${d}" fill="${g}"/>`).join("");
      if (sockCol) s += `<g clip-path="${sockClip}">${sh.map((d) => `<path d="${d}" fill="${isFar ? H.shade(sockCol, -.3) : sockCol}"/>`).join("")}</g>`;
      return s; };
    const frames = walk ? [0, .25, .5, .75] : [null];
    let farLegs = "", nearLegs = "";
    frames.forEach((t, i) => { const lg = legSet(t), cls = walk ? ` class="${P}fr ${P}fr${i}"` : "";
      farLegs += `<g${cls}>${legDraw(lg.farF, 1) + legDraw(lg.farH, 1)}</g>`; nearLegs += `<g${cls}>${legDraw(lg.nearH, 0) + legDraw(lg.nearF, 0)}</g>`; });
    
    const feather = B.coat === "long" && !S.lie ? (() => { let d = `M${f(S.Cc[0] + D * .1)} ${f(S.Cc[1] + S.rc * .75)}`; const n = 7, x0 = S.Cc[0] + D * .1, x1 = S.Mid[0] - D * .1;
      for (let i = 0; i < n; i++) { const xa = x0 + (x1 - x0) * i / n, xb = x0 + (x1 - x0) * (i + 1) / n, yb = lerp(S.Cc, S.Mid, (i + 1) / n)[1] + S.rm * .9; d += `Q${f((xa + xb) / 2)} ${f(yb + D * .22 + (i % 2) * 2)} ${f(xb)} ${f(yb)}`; }
      return `<path d="${d}Z" fill="${col}"/><path d="${d}" fill="none" stroke="${dk}" stroke-opacity=".35" stroke-width=".7"/>`; })() : "";
    
    const tp = tailPts(B, act, S), tShapes = chain(tp);
    if (B.tail === "pom" && !S.lie) { const e = tp[tp.length - 1]; tShapes.push(circ(e[0], D * .22)); }
    let tailG = unit(x, "tl" + uk, tShapes, x.lg([[0, lt], [1, dk]]), shadeRect(x, yTop - B.T, 0) + (B.pat === "points" ? `<rect x="-300" y="-300" width="600" height="600" fill="${H.shade(col, -.62)}" opacity=".85"/>` : "") +
      (B.pat === "tabby" ? tp.map((p, i) => i % 1 === 0 ? `<circle cx="${f(p[0][0])}" cy="${f(p[0][1])}" r="${f(p[1] * 1.15)}" fill="none" stroke="${H.shade(col, -.52)}" stroke-width="${f(B.tr * .8)}" stroke-dasharray="${f(B.tr)} ${f(B.tr * 1.6)}"/>` : "").join("") : "") +
      (B.pat === "saddle" ? `<rect x="-300" y="${f(yTop - B.T)}" width="600" height="${f(B.T * .6)}" fill="${BK}" opacity=".55"/>` : ""));
    if (B.tip) { const e = tp[tp.length - 1]; tailG += `<circle cx="${f(e[0][0])}" cy="${f(e[0][1])}" r="${f(e[1] * 1.3)}" fill="${WH}"/>`; }
    if (B.coat === "long" || B.coat === "double") tailG += tShapes.map((d) => `<path d="${d}" fill="none" stroke="${lt}" stroke-width="1.6" stroke-dasharray="1.2 2" opacity=".7"/>`).join("");
    const tb = tp[0][0], wagOn = x.o.on && (act === "play" || act === "walk" || (act === "rest" && !cat));
    const tailCls = cat && x.o.on && act !== "sleep" ? "flick" : wagOn ? (act === "play" ? "wagF" : "wag") : "";
    tailG = `<g class="${tailCls ? P + tailCls : ""}" style="transform-origin:${f(tb[0])}px ${f(tb[1])}px">${tailG}</g>`;
    
    const hd = head(x, B, col, dk, lt, act, uk);
    const headCls = x.o.on ? (act === "eat" ? "dip" : act === "walk" ? "nod" : "") : "";
    const headG = `<g transform="translate(${f(S.Hj[0])} ${f(S.Hj[1])}) rotate(${S.headA})"><g class="${headCls ? P + headCls : ""}">${hd}</g></g>`;
    
    const nA = lerp(S.Nb, S.Hj, .72), dir = [S.Hj[0] - S.Nb[0], S.Hj[1] - S.Nb[1]], dl = Math.hypot(dir[0], dir[1]) || 1;
    let px = -dir[1] / dl, py = dir[0] / dl; if (py < 0) { px = -px; py = -py; }
    const nr = D * (cat ? .25 : .29) * (1 - .72 * .3), c1 = [nA[0] - px * nr, nA[1] - py * nr], c2 = [nA[0] + px * nr, nA[1] + py * nr];
    const lv = x.lv, away = !x.o.on, batC = lv < .2 ? "#ff4a3a" : lv < .4 ? "#ffb347" : "#3ee08f", ts = cat ? .55 : Math.max(.7, Math.min(1.15, D / 30));
    const tg = add(c2, [px, py], cat ? 2 : 3.5);
    const collar = `<path d="M${R2(c1)}L${R2(c2)}" stroke="${H.shade(col2, -.35)}" stroke-width="${f(cat ? 2.4 : 3.8)}" stroke-linecap="round"/><path d="M${R2(c1)}L${R2(c2)}" stroke="${col2}" stroke-width="${f(cat ? 1.7 : 2.8)}" stroke-linecap="round"/>` +
      `<g transform="translate(${R2(tg)}) scale(${f(ts)})"><rect x="-5.5" y="-3.6" width="11" height="9" rx="2.4" fill="${x.lg([[0, "#3a3d44"], [1, "#121316"]])}"/><path d="M-4 -2.6H4" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>` +
      `<rect x="-4" y="1.8" width="7" height="2.2" rx=".5" fill="none" stroke="#c9ced5" stroke-width=".5"/><rect x="3.1" y="2.4" width=".7" height="1" fill="#c9ced5"/><rect x="-3.6" y="2.2" width="${f(6.2 * Math.max(.08, lv))}" height="1.4" fill="${batC}"/>` +
      `<circle cx="3" cy="-.6" r="1.1" fill="${away ? "#ffb347" : "#3ee08f"}"${x.o.anim ? ` class="${P}blinkled"` : ""}/><circle cx="3" cy="-.6" r="2.6" fill="${away ? "#ffb347" : "#3ee08f"}" opacity=".25"/></g>`;
    
    let props = "";
    if (act === "eat") { const bx = S.Hj[0] + Math.cos(S.headA * Math.PI / 180) * B.r * .4 + (cat ? D * .2 : D * .25);
      props = `<path d="M${f(bx - D * .55)} -1L${f(bx - D * .45)} ${f(-D * .3)}H${f(bx + D * .45)}L${f(bx + D * .55)} -1Z" fill="${x.lg([[0, "#8a9098"], [.4, "#eef0f3"], [1, "#7a8088"]], 0, 0, 1, 0)}"/><ellipse cx="${f(bx)}" cy="${f(-D * .3)}" rx="${f(D * .45)}" ry="${f(D * .07)}" fill="#6e4a2a"/>`; }
    if (act === "play") { const bx = S.Cc[0] + D * (cat ? 1.2 : 1.35);
      props = `<g class="${x.o.on ? P + "bounce" : ""}">` + (cat ? `<path d="M${f(bx - 4)} -3q5 -6 10 0q-5 4 -10 0Z" fill="#9a9da3"/><path d="M${f(bx - 4)} -3q-6 2 -10 -2" fill="none" stroke="#c9787a" stroke-width=".8"/><circle cx="${f(bx + 4)}" cy="-4.5" r=".7" fill="#111"/>`
        : `<circle cx="${f(bx)}" cy="${f(-D * .2)}" r="${f(D * .2)}" fill="${x.rg([[0, "#f3ff8a"], [.6, "#cde43a"], [1, "#8eaa16"]], .38, .34, .7)}"/><path d="M${f(bx - D * .17)} ${f(-D * .26)}Q${f(bx)} ${f(-D * .15)} ${f(bx + D * .06)} ${f(-D * .38)}" fill="none" stroke="#fff" stroke-width=".9"/>`) + `</g>`; }
    if (act === "sleep" && x.o.on) props = `<g class="${P}zz">` + [0, 1, 2].map((i) => { const zx = S.Hj[0] + D * .2 + i * D * .2, zy = yTop - D * .1 - i * D * .25, z = D * (.1 + i * .04); return `<path d="M${f(zx)} ${f(zy)}h${f(z)}l${f(-z)} ${f(z)}h${f(z)}" fill="none" stroke="#fff" stroke-width="${f(Math.max(1, D * .045))}" stroke-linecap="round" stroke-linejoin="round" opacity="${f(.9 - i * .2)}"/>`; }).join("") + `</g>`;
    const shadow = `<ellipse cx="${f((S.Cc[0] + S.Hc[0]) / 2 + D * .2)}" cy="0" rx="${f((S.Cc[0] - S.Hc[0]) / 2 + D * 1.05)}" ry="${f(D * .14)}" fill="#000" fill-opacity=".34"/>`;
    const bodyU = unit(x, "bd" + uk, torso, x.lg([[0, lt], [.55, col], [1, dk]]), over);
    const breathe = x.o.on ? (act === "sleep" ? "breatheS" : act === "rest" || act === "eat" ? "breathe" : "") : "";
    const bob = walk && x.o.on ? "bob" : "";
    return shadow + `<g class="${bob ? P + bob : ""}">` + farLegs + tailG + `<g class="${breathe ? P + breathe : ""}">` + bodyU + feather + `</g>` + nearLegs + collar + headG + `</g>` + props;
  }

  const COLLAR = ["#e0483e", "#3a6fd8", "#2f8f5e", "#f2a541", "#c47ad8", "#2c2f36"];
  const OPTS = [
    { id: "act", name: "Activity", values: [["rest", "Resting"], ["sleep", "Sleeping"], ["walk", "Walking"], ["play", "Playing"], ["eat", "Eating"]] },
    { id: "zone", name: "Zone", values: [["home", "Home"], ["away", "Away"], ["yard", "Yard"], ["vet", "Vet"], ["daycare", "Daycare"]] },
  ];
  function render(o, B) {
    const x = X(o); x.o = o;
    const opt = o.opt || {}, act = opt.act || "rest", zone = opt.zone || "home", away = !o.on || zone === "away";
    const col = o.color || "#c9a274", col2 = o.color2 || COLLAR[0];
    const D = B.D, wide = B.L + D * 2.2 + B.r * 2 + B.m, tall = B.Lg + D * 1.1 + B.N * .8 + B.r * 2.4;
    const k = Math.min(B.cat ? 1.9 : 2.2, Math.min(150 / wide, 128 / tall));
    const back = backdrop(x, zone, act, away);
    const pet = `<g transform="translate(${f(100 - (B.L * .1 + B.m * .3) * k)} 168) scale(${f(k)})"${away ? ` opacity=".5"` : ""}>${animal(x, B, act, col, col2)}</g>`;
    const pin = away ? `<g transform="translate(160 26)"><path d="M0 22C-9 11 -10 7 -10 3A10 10 0 0 1 10 3C10 7 9 11 0 22Z" fill="#ffb347" stroke="#7a4a10" stroke-width="1"/><circle cx="0" cy="3" r="4" fill="#fff"/><path d="M-14 26H14" stroke="#000" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/></g>` : "";
    return scene(x, back, pet + pin);
  }
  const mk = (row) => ({ id: row[0], name: row[1], colors: row[2], picker: true, colorLabel: "Coat", colors2: COLLAR, picker2: true, colorLabel2: "Collar", options: OPTS, render: (o) => render(o, Object.assign({ id: row[0] }, row[3])) });
  const icons = BREEDS.map(mk).concat(CATS.map(mk));

  const css = `
.hda-anim .hda-petsfig-blinkled{animation:hda-petsfig-led 1.4s ease-in-out infinite}
@keyframes hda-petsfig-led{0%,100%{opacity:1}50%{opacity:.2}}
.hda-anim .hda-petsfig-blink{animation:hda-petsfig-blink 4.6s linear infinite}
@keyframes hda-petsfig-blink{0%,93%{opacity:0}95%,97%{opacity:1}99%,100%{opacity:0}}
.hda-anim .hda-petsfig-twitch{animation:hda-petsfig-twitch 6s ease-in-out infinite}
@keyframes hda-petsfig-twitch{0%,80%,100%{transform:rotate(0deg)}84%{transform:rotate(-9deg)}88%{transform:rotate(3deg)}92%{transform:rotate(0deg)}}
.hda-anim .hda-petsfig-wag{animation:hda-petsfig-wag .9s ease-in-out infinite alternate}
.hda-anim .hda-petsfig-wagF{animation:hda-petsfig-wag .26s ease-in-out infinite alternate}
@keyframes hda-petsfig-wag{0%{transform:rotate(-10deg)}100%{transform:rotate(12deg)}}
.hda-anim .hda-petsfig-flick{animation:hda-petsfig-flick 3.4s ease-in-out infinite}
@keyframes hda-petsfig-flick{0%,60%,100%{transform:rotate(0deg)}70%{transform:rotate(-6deg)}80%{transform:rotate(5deg)}90%{transform:rotate(-3deg)}}
.hda-petsfig-breathe,.hda-petsfig-breatheS{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-petsfig-breathe{animation:hda-petsfig-breathe 3s ease-in-out infinite}
.hda-anim .hda-petsfig-breatheS{animation:hda-petsfig-breathe 5s ease-in-out infinite}
@keyframes hda-petsfig-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.01,1.035)}}
.hda-petsfig-fr{opacity:0}
.hda-petsfig-fr0{opacity:1}
.hda-anim .hda-petsfig-fr{animation:hda-petsfig-fr .9s steps(1) infinite}
.hda-anim .hda-petsfig-fr1{animation-delay:-.675s}
.hda-anim .hda-petsfig-fr2{animation-delay:-.45s}
.hda-anim .hda-petsfig-fr3{animation-delay:-.225s}
@keyframes hda-petsfig-fr{0%{opacity:1}25%,100%{opacity:0}}
.hda-anim .hda-petsfig-bob{animation:hda-petsfig-bob .45s ease-in-out infinite alternate}
@keyframes hda-petsfig-bob{0%{transform:translate(0,0)}100%{transform:translate(0,-1px)}}
.hda-anim .hda-petsfig-nod{animation:hda-petsfig-nod .45s ease-in-out infinite alternate}
@keyframes hda-petsfig-nod{0%{transform:rotate(0deg)}100%{transform:rotate(3deg)}}
.hda-anim .hda-petsfig-dip{animation:hda-petsfig-dip 1.4s ease-in-out infinite}
@keyframes hda-petsfig-dip{0%,100%{transform:rotate(0deg)}40%{transform:rotate(6deg)}60%{transform:rotate(-2deg)}}
.hda-petsfig-chew{transform-box:fill-box;transform-origin:100% 0}
.hda-anim .hda-petsfig-chew{animation:hda-petsfig-chew .35s ease-in-out infinite alternate}
@keyframes hda-petsfig-chew{0%{transform:translate(0,0)}100%{transform:translate(0,.8px)}}
.hda-anim .hda-petsfig-bounce{animation:hda-petsfig-bounce .55s cubic-bezier(.3,0,.7,1) infinite alternate}
@keyframes hda-petsfig-bounce{0%{transform:translate(0,0)}100%{transform:translate(0,-10px)}}
.hda-anim .hda-petsfig-zz{animation:hda-petsfig-zz 3.2s ease-in-out infinite}
@keyframes hda-petsfig-zz{0%{transform:translate(0,4px);opacity:0}30%{opacity:1}100%{transform:translate(4px,-8px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-petsfig-blinkled,.hda-anim .hda-petsfig-blink,.hda-anim .hda-petsfig-twitch,.hda-anim .hda-petsfig-wag,.hda-anim .hda-petsfig-wagF,.hda-anim .hda-petsfig-flick,.hda-anim .hda-petsfig-breathe,.hda-anim .hda-petsfig-breatheS,.hda-anim .hda-petsfig-fr,.hda-anim .hda-petsfig-bob,.hda-anim .hda-petsfig-nod,.hda-anim .hda-petsfig-dip,.hda-anim .hda-petsfig-chew,.hda-anim .hda-petsfig-bounce,.hda-anim .hda-petsfig-zz{animation:none!important}.hda-anim .hda-petsfig-fr{opacity:0}.hda-anim .hda-petsfig-fr0{opacity:1}}
`;

  (window.HDA = window.HDA || []).push({
    id: "petsfig", tab: "Dogs & cats", group: "Home", kind: "device",
    intro: "Ten dog breeds and four cats, drawn from reference photos, each wearing a smart GPS collar with a status light and a tiny battery bar. Pick the Activity (resting, sleeping, walking, playing, eating) and the Zone (home, yard, vet, daycare, away). Home shows them in a cozy spot; Away fades them with a location pin.",
    levelLabel: "Collar battery", onWord: "Home", offWord: "Away",
    css, icons,
  });
})();
