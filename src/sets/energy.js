(function () {
  const H = window.HDAH, P = "hda-energy-";
  const f = (n) => (+n).toFixed(1), a2 = (n) => Math.max(0, Math.min(1, n)).toFixed(2);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");

  function X(o, opt) {
    opt = opt || {};
    const on = !!o.on, lv = o.level == null ? 1 : Math.max(0, Math.min(1, o.level));
    const x = { o, u: o.uid, on, lv, an: on && o.anim, L: on ? .35 + .65 * lv : 0, d: [], k: {}, n: 0 };
    if (o.evStill) { x.still = true; if (o.evDim) x.L *= .55; }   // (parts) EV charger stage: plugged in / charged = lit but still
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
    if (flow && x.on && !x.still) s += chase(x, pts, n || 14, w, flow);
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

  const sw = (list, first) => [first].concat(list.filter((c) => c !== first));

  const GREEN = "#3ee08f";
  const pct = (x) => Math.round(x.lv * 100);
  const lvlCol = (x, c) => x.lv < .2 ? "#ff5a4f" : x.lv < .4 ? "#ffb347" : c;
  const clipU = (x, key, shape) => x.def("c" + key, (id) => `<clipPath id="${id}">${shape}</clipPath>`);
  const always = (x) => Object.assign({}, x, { on: true });

  function segBar(x, x0, y0, w, h, n, vert, col) {
    col = lvlCol(x, col || GREEN);
    const lit = x.lv > .01 ? Math.max(1, Math.round(x.lv * n)) : 0, g = vert ? h * .035 : w * .035;
    let s = `<rect x="${f(x0 - 1.4)}" y="${f(y0 - 1.4)}" width="${f(w + 2.8)}" height="${f(h + 2.8)}" rx="2.2" fill="#06070a"/>`;
    if (x.on) s = `<g class="${P}pulse"><rect x="${f(x0 - 6)}" y="${f(y0 - 6)}" width="${f(w + 12)}" height="${f(h + 12)}" rx="7" fill="${M.halo(x, col)}" opacity="${a2(.5 * x.L)}"/></g>` + s;
    for (let i = 0; i < n; i++) {
      let sx, sy, sw2, sh;
      if (vert) { sh = (h - g * (n - 1)) / n; sw2 = w; sx = x0; sy = y0 + h - (i + 1) * sh - i * g; }
      else { sw2 = (w - g * (n - 1)) / n; sh = h; sx = x0 + i * (sw2 + g); sy = y0; }
      const L = i < lit, tip = x.on && i === lit - 1;
      const fill = L ? (x.on ? H.mix(col, "#ffffff", .2) : H.mix(col, "#15161b", .45)) : "#1d2027";
      s += `<rect${tip ? ` class="${P}blink"` : ""} x="${f(sx)}" y="${f(sy)}" width="${f(sw2)}" height="${f(sh)}" rx="${f(Math.min(sw2, sh) * .3)}" fill="${fill}"/>`;
      if (L && x.on) s += `<rect x="${f(sx + .4)}" y="${f(sy + .3)}" width="${f(Math.max(.4, sw2 - .8))}" height="${f(Math.max(.4, sh * .3))}" rx=".3" fill="#fff" fill-opacity=".45"/>`;
    }
    if (x.an) {
      const cp = clipU(x, `sb${f(x0)}_${f(y0)}`, `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}"/>`);
      s += vert ? `<g clip-path="${cp}"><rect class="${P}sweepy" x="${f(x0)}" y="${f(y0 + h)}" width="${f(w)}" height="${f(h / 3)}" fill="${x.lg([[0, "#fff", 0], [.5, "#fff", .75], [1, "#fff", 0]])}"/></g>`
        : `<g clip-path="${cp}"><rect class="${P}sweepx" x="${f(x0 - w / 3)}" y="${f(y0)}" width="${f(w / 3)}" height="${f(h)}" fill="${x.lg([[0, "#fff", 0], [.5, "#fff", .75], [1, "#fff", 0]], 0, 0, 1, 0)}"/></g>`;
    }
    return s;
  }
  function ring(x, cx, cy, r, w, col) {
    col = lvlCol(x, col || GREEN); const C = 2 * Math.PI * r, len = C * Math.max(.02, x.lv);
    const rot = `transform="rotate(-90 ${f(cx)} ${f(cy)})"`;
    let s = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="#1c1f26" stroke-width="${f(w)}"/>`;
    if (x.on) s += `<g class="${P}pulse"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="${col}" stroke-opacity="${a2(.3 * x.L)}" stroke-width="${f(w * 3.4)}" stroke-dasharray="${f(len)} ${f(C)}" ${rot}/></g>`;
    s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="${x.on ? H.mix(col, "#fff", .2) : H.mix(col, "#15161b", .45)}" stroke-width="${f(w)}" stroke-linecap="round" stroke-dasharray="${f(len)} ${f(C)}" ${rot}/>`;
    if (x.on) { const a = -Math.PI / 2 + Math.PI * 2 * Math.max(.02, x.lv);
      s += `<circle class="${P}blink" cx="${f(cx + Math.cos(a) * r)}" cy="${f(cy + Math.sin(a) * r)}" r="${f(w * .7)}" fill="#fff"/>`; }
    return s;
  }
  const bolt = (cx, cy, s, col) => `<path d="M${f(cx + 1 * s)} ${f(cy - 6 * s)}L${f(cx - 4 * s)} ${f(cy + 1 * s)}H${f(cx)}L${f(cx - 1 * s)} ${f(cy + 6 * s)}L${f(cx + 4 * s)} ${f(cy - 1 * s)}H${f(cx)}Z" fill="${col}"/>`;

  function evPlug(x, cx, cy, s, rot, col) {
    col = col || "#2a2c33";
    return `<g transform="rotate(${rot || 0} ${f(cx)} ${f(cy)})"><rect x="${f(cx - 5 * s + 1)}" y="${f(cy - 4 * s + 2)}" width="${f(16 * s)}" height="${f(8 * s)}" rx="${f(3 * s)}" fill="#000" fill-opacity=".35"/>
<rect x="${f(cx - 5 * s)}" y="${f(cy - 4 * s)}" width="${f(13 * s)}" height="${f(8 * s)}" rx="${f(3 * s)}" fill="${M.v(x, col)}"/><rect x="${f(cx + 7 * s)}" y="${f(cy - 3.2 * s)}" width="${f(4 * s)}" height="${f(6.4 * s)}" rx="${f(1.4 * s)}" fill="${M.steel(x)}"/>
<path d="M${f(cx - 3.5 * s)} ${f(cy - 2.6 * s)}H${f(cx + 6 * s)}" stroke="#fff" stroke-opacity=".35" stroke-width="${f(.8 * s)}" stroke-linecap="round"/><path d="M${f(cx - 10 * s)} ${f(cy)}H${f(cx - 5 * s)}" stroke="#1c1d22" stroke-width="${f(4 * s)}"/></g>`;
  }

  function skyB(x, y1, sunny, dusk) {
    const k = sunny ? .35 + .65 * x.lv : 0;
    const top = dusk ? "#1c2546" : sunny ? H.mix("#25426f", "#3b84d4", k) : "#283040", bot = dusk ? "#b9785e" : sunny ? H.mix("#7f9fc0", "#cfe6f7", k) : "#5a616e";
    return `<rect x="8" y="8" width="184" height="${f(y1 - 8)}" fill="${x.lg([[0, top], [1, bot]])}"/>`;
  }
  function cloud(x, cx, cy, s, op) {
    const g = x.lg([[0, "#f4f6fa"], [1, "#a9b1bf"]]);
    return `<g opacity="${op}"><ellipse cx="${f(cx + 2)}" cy="${f(cy + 7 * s)}" rx="${f(22 * s)}" ry="${f(4 * s)}" fill="#000" fill-opacity=".12"/>
<circle cx="${f(cx - 11 * s)}" cy="${f(cy + 1 * s)}" r="${f(6.5 * s)}" fill="${g}"/><circle cx="${f(cx)}" cy="${f(cy - 3 * s)}" r="${f(9.5 * s)}" fill="${g}"/><circle cx="${f(cx + 11 * s)}" cy="${f(cy + 1 * s)}" r="${f(7 * s)}" fill="${g}"/>
<rect x="${f(cx - 17 * s)}" y="${f(cy)}" width="${f(34 * s)}" height="${f(7.5 * s)}" rx="${f(3.7 * s)}" fill="${g}"/></g>`;
  }
  function sunG(x, cx, cy, r) {
    if (!x.on) return "";
    let rays = "";
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6;
      rays += `<path d="M${f(cx + Math.cos(a) * r * 1.5)} ${f(cy + Math.sin(a) * r * 1.5)}L${f(cx + Math.cos(a) * r * 2.2)} ${f(cy + Math.sin(a) * r * 2.2)}" stroke="#fff3c4" stroke-opacity=".6" stroke-width="${f(r * .2)}" stroke-linecap="round"/>`; }
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 4.2)}" fill="${M.halo(x, "#ffe9a8")}" opacity="${a2(.75 * x.L)}"/>
<g class="${P}spinslow"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 2.3)}" fill="none"/>${rays}</g>
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, "#fffdf0"], [.55, "#ffe680"], [1, "#ffb938"]], .42, .4, .6)}"/>`;
  }
  function grassB(x, y0, col, seed) {
    col = col || "#4b7536"; const r = rnd(seed || 19); let s = `<rect x="8" y="${f(y0)}" width="184" height="${f(192 - y0)}" fill="${x.lg([[0, H.shade(col, -.25)], [1, H.shade(col, .08)]])}"/>`;
    for (let i = 0; i < 90; i++) { const gx = 8 + r() * 184, gy = y0 + 3 + r() * (192 - y0), hh = 2 + r() * 4 * (gy - y0 + 20) / 80;
      s += `<path d="M${f(gx)} ${f(gy)}l${f(r() * 2 - 1)} ${f(-hh)}" stroke="${r() > .5 ? H.shade(col, .35) : H.shade(col, -.35)}" stroke-width=".9" stroke-linecap="round"/>`; }
    return s;
  }
  function treeLine(x, y, col) {
    col = col || "#2c4a30"; const r = rnd(5); let s = "";
    for (let i = 0; i < 14; i++) { const cx = 4 + i * 15 + r() * 6, rr = 8 + r() * 7;
      s += `<circle cx="${f(cx)}" cy="${f(y - rr * .4)}" r="${f(rr)}" fill="${H.mix(col, "#7f9fc0", .25 + r() * .15)}"/>`; }
    return s + `<rect x="8" y="${f(y - 2)}" width="184" height="8" fill="${H.mix(col, "#7f9fc0", .3)}"/>`;
  }
  function asphaltB(x, y0) {
    return `<rect x="8" y="${f(y0)}" width="184" height="${f(192 - y0)}" fill="${x.lg([[0, "#2b2d33"], [1, "#46484f"]])}"/>` + dots(y0 * 11, 200, 8, y0, 184, 192 - y0, .8, .22);
  }

  const aff = (tl, tr, bl) => (u, v) => [tl[0] + u * (tr[0] - tl[0]) + v * (bl[0] - tl[0]), tl[1] + u * (tr[1] - tl[1]) + v * (bl[1] - tl[1])];
  const P2 = (p) => `${f(p[0])} ${f(p[1])}`;
  function solar(x, A, cols, rows, cell, frame, cu, cv) {
    let s = ""; const g = .018, dim = x.on ? 0 : .25;
    const fill = x.lg([[0, H.shade(cell, .45 - dim)], [.45, H.shade(cell, -dim * .5)], [1, H.shade(cell, -.4)]], 0, 0, 1, 1);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const u0 = c / cols + g / 2, u1 = (c + 1) / cols - g / 2, v0 = r / rows + g, v1 = (r + 1) / rows - g;
      const q = [A(u0, v0), A(u1, v0), A(u1, v1), A(u0, v1)];
      s += `<path d="M${P2(q[0])}L${P2(q[1])}L${P2(q[2])}L${P2(q[3])}Z" fill="${fill}" stroke="${frame}" stroke-width="1.3" stroke-linejoin="round"/>`;
      let ln = "";
      for (let i = 1; i < cu; i++) { const u = u0 + (u1 - u0) * i / cu; ln += `M${P2(A(u, v0))}L${P2(A(u, v1))}`; }
      for (let i = 1; i < cv; i++) { const v = v0 + (v1 - v0) * i / cv; ln += `M${P2(A(u0, v))}L${P2(A(u1, v))}`; }
      s += `<path d="${ln}" stroke="#c9d6ea" stroke-opacity=".2" stroke-width=".5"/>`;
      s += `<path d="M${P2(q[0])}L${P2(q[1])}" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>`;
    }
    return s;
  }
  function arrayClip(x, key, A) { return clipU(x, key, `<path d="M${P2(A(0, 0))}L${P2(A(1, 0))}L${P2(A(1, 1))}L${P2(A(0, 1))}Z"/>`); }
  function glint(x, cp, x0, y0, w, h, k) {
    if (!x.on) return "";
    return `<g clip-path="${cp}"><g class="${P}glint"><path d="M${f(x0)} ${f(y0 + h)}L${f(x0 + w * .3)} ${f(y0)}H${f(x0 + w * .46)}L${f(x0 + w * .16)} ${f(y0 + h)}Z" fill="${x.lg([[0, "#fff", 0], [.5, "#fff", .8], [1, "#fff", 0]], 0, 0, 1, 0)}" opacity="${a2((k || 1) * (.25 + .55 * x.lv))}"/>
<circle cx="${f(x0 + w * .26)}" cy="${f(y0 + h * .4)}" r="5" fill="${M.halo(x, "#ffffff")}" opacity="${a2(.6 * x.lv + .2)}"/></g></g>`;
  }
  const pipe = (x, pts, w, flow, n) => cord(x, pts, w || 4, "#9aa1aa", flow, n);

  function wheel(x, cx, cy, r) {
    let sp = "";
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2;
      sp += `<path d="M${f(cx + Math.cos(a) * r * .18)} ${f(cy + Math.sin(a) * r * .18)}L${f(cx + Math.cos(a) * r * .6)} ${f(cy + Math.sin(a) * r * .6)}" stroke="#d5dae0" stroke-width="${f(r * .17)}" stroke-linecap="round"/>`; }
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, "#2a2c31"], [.8, "#18191d"], [1, "#0c0d0f"]])}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .66)}" fill="${x.rg([[0, "#6a7078"], [1, "#2e3238"]], .4, .35, .7)}"/>${sp}
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .66)}" fill="none" stroke="#e5e9ee" stroke-opacity=".6" stroke-width=".8"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .14)}" fill="${M.steel(x)}"/>
<path d="M${f(cx - r * .75)} ${f(cy - r * .55)}A${f(r * .92)} ${f(r * .92)} 0 0 1 ${f(cx + r * .2)} ${f(cy - r * .9)}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.2"/>`;
  }
  const paint = (x, c) => x.lg([[0, H.shade(c, .55)], [.3, H.shade(c, .15)], [.62, c], [.66, H.shade(c, -.35)], [1, H.shade(c, -.55)]]);

  const CHG = ["#eef0f2", "#2c2f36", "#8e959e", "#c9b99a", "#3d5a80"];
  // ---------- (parts) Multi-Function: EV chargers get a Charging state stage (o.pval.state, Multi-Function Image only):
  // idle = no charging (today's off look), plugged in = lit but still (no power along the cord, softer glow, the charge
  // from the slider), charging = today's on look, charged = full and still. A Device Image is drawn exactly as before.
  const EVST = { id: "state", name: "Charging state", type: "stage", values: [["idle", "Idle"], ["connected", "Plugged in"], ["charging", "Charging"], ["done", "Charged"]], def: "charging" };
  const EV = { round: 1, slim: 1, pedestal: 1, cord: 1, car: 1 };
  const evO = (o) => { const st = o.mf && o.pval && o.pval.state != null && o.pval.state !== "" ? String(o.pval.state) : null; if (!st) return o;
    return Object.assign({}, o, { on: st !== "idle", level: st === "done" ? 1 : o.level, anim: st === "charging" && o.anim, evStill: st === "connected" || st === "done", evDim: st === "connected" }); };
  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label, render: EV[id] ? (o) => render(evO(o)) : render },
    EV[id] ? { parts: [EVST] } : {}, extra || {});

  const icons = [
    ic("round", "Round wall charger", sw(CHG, "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color, cx = 90, cy = 78, R = 38;
      const back = wallB(x, "garage", 8, 166) + `<path d="M8 120H192" stroke="#000" stroke-opacity=".1"/>` + concreteB(x, 166, "#6c6f75") +
        pipe(x, [cx, 6, cx, 20, cx, 30, cx, 42], 5);
      const body = cord(x, [cx + 2, cy + R - 2, cx + 6, 150, 70, 170, 104, 176, 140, 182, 168, 174, 206, 176], 7, "#22242a", GREEN, 14) +
        `<ellipse cx="${cx + 5}" cy="${cy + 7}" rx="${R + 3}" ry="${R + 2}" fill="#000" fill-opacity=".28"/>` +
        `<circle cx="${cx + 2}" cy="${cy + 3}" r="${R}" fill="${M.side(x, c)}"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="${M.s(x, c)}"/>` +
        `<path d="M${cx - R * .78} ${cy - R * .5}A${R * .95} ${R * .95} 0 0 1 ${cx + R * .2} ${cy - R * .94}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>` +
        `<circle cx="${cx}" cy="${cy}" r="29" fill="${H.shade(c, -.4)}"/><circle cx="${cx}" cy="${cy}" r="28" fill="${x.lg([[0, "#22252c"], [1, "#0b0c10"]])}"/>` +
        ring(x, cx, cy, 22, 3.4) +
        digits(x, cx + 10, cy - 8, 9, pct(x), 3, lvlCol(x, GREEN)) +
        `<g transform="translate(0 0)">${bolt(cx, cy + 10, .9, x.on ? "#fff" : "#4a4e58")}</g>` +
        `<path d="M${cx - 22} ${cy - 16}Q${cx} ${cy - 30} ${cx + 18} ${cy - 18}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2.2" stroke-linecap="round"/>` +
        `<rect x="${cx - 8}" y="${cy + R - 6}" width="16" height="9" rx="3" fill="${M.v(x, "#2c2f36")}"/>` +
        box(x, 146, 92, 20, 26, 6, 2, 3, c) + `<circle cx="156" cy="104" r="6" fill="${x.lg([[0, "#0b0c10"], [1, "#2a2d34"]])}"/>`;
      return scene(x, back, body); }),

    ic("slim", "Slim wall charger", sw(CHG, "#2c2f36"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 150) + `<rect x="8" y="146" width="184" height="6" fill="#2a2c31"/>` + concreteB(x, 152, "#6c6f75");
      const car = `<path d="M144 192V158Q144 146 156 143L178 139Q190 128 206 124V192Z" fill="${paint(x, "#9aa3ad")}"/><path d="M150 147Q166 142 180 139L206 128" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>` +
        `<path d="M184 136L206 126V133L188 138Z" fill="${x.lg([[0, "#5a6878"], [1, "#1a1f27"]])}"/><path d="M147 152L166 148V153L148 157Z" fill="${x.lg([[0, "#f6f9ff"], [1, "#9fb0c6"]])}"/>` +
        `<path d="M144 172H206V180H144Z" fill="#1d1f24" fill-opacity=".8"/><circle cx="192" cy="190" r="19" fill="#111215"/>` + wheel(x, 192, 190, 14.5) + `<rect x="161" y="145" width="9" height="8" rx="2" fill="#1a1c21"/>`;
      const body = car + cord(x, [86, 146, 86, 174, 120, 184, 138, 170, 146, 162, 152, 152, 158, 150], 6, "#202228", GREEN, 13) + evPlug(x, 165, 149, .85, -12) +
        box(x, 68, 26, 36, 122, 9, 3, 5, c) +
        `<rect x="74" y="34" width="24" height="106" rx="6" fill="${x.lg([[0, H.shade(c, .1)], [1, H.shade(c, -.25)]], 0, 0, 1, 0)}" opacity=".6"/>` +
        segBar(x, 83, 44, 6, 74, 10, true) +
        `<circle cx="86" cy="128" r="3.4" fill="${x.lg([[0, "#0c0d10"], [1, "#30333a"]])}"/>` + led(x, 86, 128, 1, x.lv < .2 ? "#ff5a4f" : "#7ee7ff");
      return scene(x, back, body); }),

    ic("pedestal", "Pedestal charger", sw(CHG, "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color;
      const back = skyB(x, 140, false, true) + `<circle cx="160" cy="44" r="3" fill="#fff8d0"/><circle cx="160" cy="44" r="10" fill="${M.halo(x, "#ffe7a0")}"/><path d="M160 47V140" stroke="#20242c" stroke-width="2"/>` +
        treeLine(x, 140, "#1d2b2a") + asphaltB(x, 140) +
        `<path d="M24 192L56 146M150 192L132 146" stroke="#e8e6dc" stroke-opacity=".7" stroke-width="3"/>`;
      const body = `<path d="M62 168H138L146 182H54Z" fill="${x.lg([[0, "#9b9da2"], [1, "#5f6166"]])}"/><path d="M62 168H138" stroke="#fff" stroke-opacity=".35"/>` +
        `<ellipse cx="102" cy="170" rx="34" ry="5" fill="#000" fill-opacity=".35"/>` +
        cord(x, [122, 108, 140, 120, 138, 158, 120, 168, 96, 176, 150, 186, 206, 182], 6, "#202228", GREEN, 13) +
        box(x, 78, 38, 40, 132, 11, 4, 4, c) +
        `<path d="M83 42H113" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>` +
        lcd(x, 84, 52, 28, 26, GREEN) + digits(always(x), 109, 57, 9, pct(x), 3, x.on ? lvlCol(x, GREEN) : "#5d6470") +
        bolt(98, 72, .5, x.on ? "#fff" : "#4a4e58") + glass(x, 84, 52, 28, 26) +
        segBar(x, 85, 86, 26, 5, 6, false) +
        `<rect x="116" y="100" width="12" height="20" rx="4" fill="${M.h(x, "#2c2f36")}"/>` + evPlug(x, 124, 108, .8, 90) +
        `<rect x="88" y="150" width="20" height="4" rx="2" fill="#000" fill-opacity=".25"/>`;
      return scene(x, back, body); }),

    ic("cord", "Portable charge cord", sw(CHG, "#2c2f36"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "garage", 8, 150) + `<path d="M8 150H192" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/>` + concreteB(x, 150, "#73767c");
      const leds = (() => { let s = ""; const n = 5, lit = x.lv > .01 ? Math.max(1, Math.round(x.lv * n)) : 0;
        for (let i = 0; i < n; i++) s += led(x, 104 + i * 8, 132, 1.5, i < lit ? lvlCol(x, GREEN) : "#3a3d44", i < lit ? .7 : 0);
        return s; })();
      const body = plateBody(x, 34, 34, 44, 52, 4, "#9aa1aa") + screw(x, 56, 39, 1.8, .2) + screw(x, 56, 81, 1.8, -.3) +
        `<circle cx="56" cy="60" r="15" fill="#000" fill-opacity=".35"/><circle cx="56" cy="60" r="14" fill="${x.lg([[0, "#3a3d44"], [1, "#1c1e22"]])}"/>` +
        cord(x, [56, 72, 56, 104, 70, 116, 92, 124], 5.5, "#24262c", GREEN, 8) +
        `<circle cx="57.5" cy="62" r="12" fill="#000" fill-opacity=".4"/><circle cx="56" cy="60" r="12" fill="${M.s(x, "#33363d")}"/>` +
        (() => { let r = ""; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; r += `<path d="M${f(56 + Math.cos(a) * 9)} ${f(60 + Math.sin(a) * 9)}L${f(56 + Math.cos(a) * 11.4)} ${f(60 + Math.sin(a) * 11.4)}" stroke="#16171b" stroke-width="1.4"/>`; } return r; })() +
        `<circle cx="56" cy="60" r="6" fill="${M.s(x, "#2a2d33")}"/>` +
        cord(x, [146, 138, 166, 150, 150, 170, 176, 176, 190, 180, 200, 182, 210, 180], 5.5, "#24262c", GREEN, 10) +
        box(x, 90, 116, 60, 30, 7, 2, 4, c) +
        `<rect x="96" y="124" width="48" height="16" rx="4" fill="${x.lg([[0, "#0e1014"], [1, "#22252c"]])}"/>` + leds +
        `<path d="M95 120H145" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
      return scene(x, back, body); }),

    ic("car", "EV plugged in", sw(["#e9ecef", "#c0392b", "#2f5d9e", "#5b6068", "#1c1e22", "#9aa3ad"], "#2f5d9e"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "garage", 8, 158) + concreteB(x, 158, "#6c6f75");
      const bx = 74, by = 26, bw = 70, bh = 24, fillW = Math.max(1.5, (bw - 6) * x.lv), col = lvlCol(x, GREEN);
      const fcp = clipU(x, "bat", `<rect x="${bx + 3}" y="${by + 3}" width="${f(fillW)}" height="${bh - 6}" rx="2.6"/>`);
      const gauge = `<rect x="${bx + 1}" y="${by + 2}" width="${bw}" height="${bh}" rx="6" fill="#000" fill-opacity=".35"/>` +
        `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="6" fill="#101217" stroke="#d8dde4" stroke-width="2"/><rect x="${bx + bw + 1}" y="${by + 7}" width="5" height="10" rx="2" fill="#d8dde4"/>` +
        (x.on ? `<g class="${P}pulse"><rect x="${bx - 4}" y="${by - 4}" width="${f(fillW + 14)}" height="${bh + 8}" rx="9" fill="${M.halo(x, col)}" opacity="${a2(.55 * x.L)}"/></g>` : "") +
        `<rect x="${bx + 3}" y="${by + 3}" width="${f(fillW)}" height="${bh - 6}" rx="2.6" fill="${x.lg([[0, H.mix(col, "#fff", .45)], [.5, col], [1, H.shade(col, x.on ? -.25 : -.55)]])}" opacity="${x.on ? 1 : .7}"/>` +
        (x.an ? `<g clip-path="${fcp}"><rect class="${P}sweepx" x="${f(bx + 3 - fillW / 3)}" y="${by + 3}" width="${f(fillW / 3)}" height="${bh - 6}" fill="${x.lg([[0, "#fff", 0], [.5, "#fff", .6], [1, "#fff", 0]], 0, 0, 1, 0)}"/></g>` : "") +
        (x.on ? bolt(bx + bw / 2, by + bh / 2, .9, "#fff") : "") +
        digits(always(x), 186, 31, 13, pct(x), 3, x.on ? "#e9f7ef" : "#8b93a0");
      const carB = "M50 150L50 132Q52 122 66 119L88 115Q102 98 124 96L148 96Q166 97 178 113L188 117Q194 121 194 132L194 150Z";
      const body = `<ellipse cx="122" cy="166" rx="78" ry="6" fill="#000" fill-opacity=".4"/>` +
        box(x, 14, 70, 22, 34, 5, 2, 3, "#2c2f36") + led(x, 25, 80, 1.4, col) +
        cord(x, [25, 104, 26, 150, 44, 156, 56, 140, 60, 134, 62, 130, 64, 128], 4.5, "#202228", GREEN, 10) +
        `<path d="${carB}" fill="${paint(x, c)}"/>` +
        `<path d="M94 116Q106 102 124 100L146 100Q160 101 170 115Z" fill="${x.lg([[0, "#4d5b6c"], [1, "#151a22"]])}"/><path d="M130 100V116" stroke="${H.shade(c, -.4)}" stroke-width="3"/>` +
        `<path d="M100 112L112 103H120L106 114Z" fill="#fff" fill-opacity=".18"/>` +
        `<path d="M54 128Q120 124 192 126" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/><path d="M60 140H186" stroke="#000" stroke-opacity=".2"/>` +
        `<path d="M104 120V140M136 120V140" stroke="#000" stroke-opacity=".25"/><rect x="112" y="124" width="7" height="2" rx="1" fill="#000" fill-opacity=".35"/>` +
        `<path d="M50 126L56 125V133L50 134Z" fill="#d6392f"/><path d="M188 122L194 126V130L186 128Z" fill="#f4f7ff"/>` +
        `<circle cx="78" cy="150" r="16" fill="#111215"/><circle cx="168" cy="150" r="16" fill="#111215"/>` + wheel(x, 78, 150, 13) + wheel(x, 168, 150, 13) +
        `<rect x="60" y="124" width="8" height="8" rx="2" fill="#1a1c21"/>` + evPlug(x, 66, 128, .75, 180) + gauge;
      return scene(x, back, body); }),

    ic("slab", "Home battery", sw(CHG, "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color, col = lvlCol(x, GREEN);
      const back = wallB(x, "garage", 8, 172) + concreteB(x, 172, "#6c6f75");
      const sy0 = 40, sh = 112, fillH = sh * x.lv;
      const body = (x.on ? `<ellipse cx="98" cy="96" rx="64" ry="80" fill="${M.halo(x, col)}" opacity="${a2(.22 * x.L)}"/>` : "") +
        pipe(x, [74, 168, 60, 172, 40, 172, 30, 172, 20, 172, 14, 160, 14, 120], 4.5, GREEN, 9) +
        box(x, 66, 18, 66, 154, 10, 4, 4, c) +
        `<rect x="66" y="18" width="66" height="154" rx="10" fill="${x.lg([[0, "#fff", .22], [.25, "#fff", 0], [.8, "#000", 0], [1, "#000", .18]], 0, 0, 1, 0)}"/>` +
        `<path d="M70 150H128" stroke="${H.shade(c, -.25)}" stroke-width=".8"/>` +
        `<rect x="76" y="${sy0}" width="4" height="${sh}" rx="2" fill="#0e1014"/>` +
        (x.on ? `<g class="${P}pulse"><rect x="72" y="${f(sy0 + sh - fillH)}" width="12" height="${f(fillH)}" rx="6" fill="${col}" opacity="${a2(.35 * x.L)}"/></g>` : "") +
        `<rect x="76" y="${f(sy0 + sh - fillH)}" width="4" height="${f(Math.max(2, fillH))}" rx="2" fill="${x.on ? H.mix(col, "#fff", .3) : H.mix(col, "#15161b", .45)}"/>` +
        (x.an ? `<g clip-path="${clipU(x, "strip", `<rect x="76" y="${f(sy0 + sh - fillH)}" width="4" height="${f(Math.max(2, fillH))}"/>`)}"><rect class="${P}sweepy" x="76" y="${f(sy0 + sh)}" width="4" height="${f(Math.max(2, fillH) / 3)}" fill="#fff" fill-opacity=".8"/></g>` : "") +
        lcd(x, 92, 30, 32, 15, GREEN) + digits(always(x), 121, 34, 7.5, pct(x), 3, x.on ? lvlCol(x, GREEN) : "#5d6470") + glass(x, 92, 30, 32, 15) +
        `<path d="M70 58H128M70 110H128" stroke="${H.shade(c, -.2)}" stroke-opacity=".6" stroke-width=".7"/><path d="M70 59H128M70 111H128" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;
      return scene(x, back, body); }),

    ic("stack", "Stacked batteries", sw(CHG, "#8e959e"), "Body", (o) => { const x = X(o), c = o.color, col = lvlCol(x, GREEN), n = 4;
      const back = wallB(x, "gray", 8, 166) + concreteB(x, 166, "#6c6f75");
      const full = x.lv * n;
      let mods = "";
      for (let i = 0; i < n; i++) { const y = 142 - i * 26, k = Math.max(0, Math.min(1, full - i));
        mods += box(x, 56, y, 80, 26, 4, 5, 3, c) + `<path d="M58 ${y + 25}H134" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>` +
          `<rect x="64" y="${y + 9}" width="40" height="8" rx="3" fill="#0d0f13"/>` +
          `<rect x="66" y="${y + 11}" width="${f(36 * k)}" height="4" rx="2" fill="${k > 0 ? (x.on ? H.mix(col, "#fff", .25) : H.mix(col, "#15161b", .45)) : "#0d0f13"}"${x.on && k > 0 && k < 1 ? ` class="${P}blink"` : ""}/>` +
          (x.on && k > 0 ? `<g class="${P}pulse"><rect x="62" y="${y + 6}" width="${f(8 + 36 * k)}" height="14" rx="6" fill="${M.halo(x, col)}" opacity="${a2(.45 * x.L)}"/></g>` : "") +
          `<circle cx="126" cy="${y + 13}" r="2.2" fill="${H.shade(c, -.35)}"/>`; }
      const body = `<rect x="52" y="166" width="90" height="8" rx="2" fill="${x.lg([[0, "#3a3d44"], [1, "#1d1f24"]])}"/>` + mods +
        box(x, 56, 42, 80, 22, 6, 5, 3, H.shade(c, -.2)) + lcd(x, 64, 47, 34, 12, GREEN) + digits(always(x), 95, 49, 8, pct(x), 3, x.on ? lvlCol(x, GREEN) : "#5d6470") +
        led(x, 112, 53, 1.4, x.on ? "#7ee7ff" : "#7ee7ff") + led(x, 122, 53, 1.4, "#ffb347", .5) +
        pipe(x, [96, 42, 96, 26, 110, 20, 150, 20, 168, 20, 176, 14, 176, 6], 4.5, GREEN, 9);
      return scene(x, back, body); }),

    ic("roof", "Rooftop solar", sw(["#1c2b4a", "#101318", "#2f5592", "#26364d", "#3a3f4a"], "#1c2b4a"), "Panel", (o) => { const x = X(o), c = o.color;
      const roof = (() => { let s = `<path d="M8 96L192 62V192H8Z" fill="${x.lg([[0, "#6e6862"], [1, "#3d3935"]])}"/>`;
        for (let i = 1; i < 14; i++) { const y = 96 + i * 8.5, y2 = 62 + i * 8.5; s += `<path d="M8 ${f(y)}L192 ${f(y2)}L192 ${f(y2 + 8.5)}L8 ${f(y + 8.5)}Z" fill="${i % 3 ? "#000" : "#fff"}" fill-opacity="${i % 3 ? .06 : .04}"/><path d="M8 ${f(y)}L192 ${f(y2)}" stroke="#16130f" stroke-opacity=".7" stroke-width="1.6"/><path d="M8 ${f(y + 1.2)}L192 ${f(y2 + 1.2)}" stroke="#fff" stroke-opacity=".05"/>`;
          for (let k = 0; k < 12; k++) { const t = (k + (i % 2) * .5) / 12, px = 8 + t * 184, py = y + (y2 - y) * t; s += `<path d="M${f(px)} ${f(py)}l0 8.5" stroke="#16130f" stroke-opacity=".18" stroke-width=".6"/>`; } }
        return s + `<path d="M8 96L192 62" stroke="#615953" stroke-width="5"/><path d="M8 94L192 60" stroke="#8a8078" stroke-width="1.2"/>`; })();
      const back = skyB(x, 110, x.on) + (x.on ? sunG(x, 158, 32, 9) : cloud(x, 150, 34, 1.1, .8) + cloud(x, 70, 40, .8, .6)) + roof;
      const A = aff([40, 104], [176, 79], [56, 168]), cp = arrayClip(x, "arr", A);
      const body = `<path d="M${P2(A(0, 0))}L${P2(A(1, 0))}L${f(A(1, 1)[0] + 4)} ${f(A(1, 1)[1] + 6)}L${f(A(0, 1)[0] + 4)} ${f(A(0, 1)[1] + 6)}Z" fill="#000" fill-opacity=".4"/>` +
        solar(x, A, 3, 2, c, "#aab3bd", 6, 5) + glint(x, cp, 40, 70, 150, 100) +
        pipe(x, [176, 120, 186, 124, 188, 140, 190, 160, 192, 176, 196, 186, 206, 192], 4, x.on ? "#ffd75e" : null, 8);
      return scene(x, back, body); }),

    ic("ground", "Ground solar array", sw(["#1c2b4a", "#101318", "#2f5592", "#26364d", "#3a3f4a"], "#26364d"), "Panel", (o) => { const x = X(o), c = o.color;
      const back = skyB(x, 118, x.on) + (x.on ? sunG(x, 44, 32, 8) : cloud(x, 54, 36, 1, .85) + cloud(x, 150, 28, .8, .6)) + treeLine(x, 118, x.on ? "#2f5a33" : "#26392a") + grassB(x, 118, x.on ? "#4b7536" : "#3a5232");
      const table = (A, legs, key) => { let s = `<path d="M${P2(A(0, 1))}L${P2(A(1, 1))}L${f(A(1, 1)[0] + 10)} ${f(A(1, 1)[1] + 12)}L${f(A(0, 1)[0] + 10)} ${f(A(0, 1)[1] + 12)}Z" fill="#000" fill-opacity=".3"/>`;
        for (const [u, hb, hf] of legs) { const pb = A(u, 0), pf = A(u, 1);
          s += `<path d="M${f(pb[0])} ${f(pb[1])}V${f(pb[1] + hb)}M${f(pf[0])} ${f(pf[1])}V${f(pf[1] + hf)}" stroke="${M.steel(x)}" stroke-width="2.4"/><path d="M${f(pb[0])} ${f(pb[1] + hb)}L${f(pf[0])} ${f(pf[1] + 2)}" stroke="#7d848d" stroke-width="1.2"/>`; }
        return s + solar(x, A, 4, 2, c, "#c3cad3", 4, 6) + glint(x, arrayClip(x, key, A), A(0, 1)[0], A(0, 0)[1] - 10, A(1, 0)[0] - A(0, 1)[0], 60, .9); };
      const A1 = aff([86, 92], [186, 86], [90, 112]), A2 = aff([22, 110], [150, 102], [30, 146]);
      const body = table(A1, [[.08, 26, 10], [.92, 26, 10]], "t1") + table(A2, [[.06, 38, 16], [.5, 38, 16], [.94, 38, 16]], "t2") +
        pipe(x, [30, 160, 60, 176, 120, 172, 150, 176, 170, 178, 190, 180, 206, 178], 3.5, x.on ? "#ffd75e" : null, 10);
      return scene(x, back, body); }),

    ic("inverter", "Solar inverter", sw(["#d8dce0", "#2c2f36", "#eef0f2", "#8e959e", "#3d5a80"], "#d8dce0"), "Body", (o) => { const x = X(o), c = o.color;
      const back = sidingB(x, "#5c6670") + `<rect x="8" y="176" width="184" height="16" fill="${x.lg([[0, "#3d3f44"], [1, "#55575c"]])}"/>`;
      let fins = "";
      for (let i = 0; i < 7; i++) fins += `<rect x="${46 + i * 1.6}" y="${46 + i * 12}" width="8" height="8" fill="${M.h(x, "#7d848d")}"/>`;
      const kw = x.on ? (x.lv * 7.6).toFixed(1).replace(".", "") : "00";
      const body = pipe(x, [90, 6, 90, 20, 90, 30, 90, 38], 6, x.on ? "#ffd75e" : null, 5) +
        pipe(x, [116, 132, 116, 150, 130, 150, 148, 150, 154, 150, 154, 146, 154, 136], 4.5, x.on ? GREEN : null, 6) +
        pipe(x, [154, 104, 154, 80, 170, 70, 178, 60, 184, 50, 186, 30, 186, 6], 4.5, x.on ? GREEN : null, 9) +
        `<rect x="44" y="40" width="12" height="96" rx="2" fill="${x.lg([[0, "#50565e"], [1, "#2c3036"]], 0, 0, 1, 0)}"/>` +
        (() => { let s = ""; for (let i = 0; i < 12; i++) s += `<path d="M44 ${45 + i * 7.6}H56" stroke="#9aa1aa" stroke-width="1.6"/>`; return s; })() +
        box(x, 52, 36, 76, 102, 6, 4, 4, c) +
        `<path d="M56 40H124" stroke="#fff" stroke-opacity=".5"/>` +
        lcd(x, 66, 56, 48, 24, "#7ee7ff") + digits(x, 104, 61, 13, kw, 2, "#bdf3ff") +
        (x.on ? `<rect x="94.6" y="72" width="2" height="2" fill="#bdf3ff"/>` : "") +
        glass(x, 66, 56, 48, 24) +
        led(x, 72, 96, 1.5, "#3ee08f") + led(x, 84, 96, 1.5, "#7ee7ff", x.lv) + led(x, 96, 96, 1.5, "#ffb347", .25) + (x.an ? `<g class="${P}blink">${led(x, 108, 96, 1.5, "#3ee08f")}</g>` : led(x, 108, 96, 1.5, "#3ee08f")) +
        `<rect x="66" y="108" width="48" height="2" rx="1" fill="${H.shade(c, -.25)}"/><rect x="66" y="114" width="30" height="2" rx="1" fill="${H.shade(c, -.25)}"/>` +
        box(x, 140, 104, 28, 32, 3, 2, 3, "#8e959e") + `<circle cx="154" cy="120" r="7" fill="${M.s(x, "#3a3d44")}"/>` +
        `<rect x="${x.on ? 152 : 147}" y="${x.on ? 112 : 118}" width="${x.on ? 4 : 14}" height="${x.on ? 16 : 4}" rx="2" fill="${M.v(x, x.on ? "#e0483e" : "#e0483e")}"/>`;
      return scene(x, back, body); }),

    ic("station", "Power station", sw(["#f08a24", "#3e8e5e", "#d33b3b", "#3a6fd8", "#8e959e"], "#f08a24"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "sage", 8, 124) + baseB(x, 124, "#7a5638");
      const body = plateT(x, 28, 96, .5) + plugHead(x, 28, 87.5, .5, "#24262c") +
        cord(x, [28, 92, 30, 130, 38, 150, 50, 142, 56, 138, 58, 136, 60, 136], 3, "#24262c", GREEN, 9) +
        `<ellipse cx="108" cy="166" rx="56" ry="6" fill="#000" fill-opacity=".45"/>` +
        `<path d="M70 82V64Q70 56 78 56H138Q146 56 146 64V82" fill="none" stroke="${H.shade(c, -.45)}" stroke-width="9" transform="translate(2 2)"/>` +
        `<path d="M70 82V64Q70 56 78 56H138Q146 56 146 64V82" fill="none" stroke="${M.h(x, c)}" stroke-width="8"/><path d="M74 62Q76 59 80 59H136" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>` +
        box(x, 58, 78, 100, 84, 9, 5, 4, "#3a3d44") +
        `<rect x="58" y="78" width="14" height="84" rx="8" fill="${M.h(x, c)}"/><rect x="144" y="78" width="14" height="84" rx="8" fill="${M.h(x, c)}"/>` +
        `<rect x="66" y="78" width="6" height="84" fill="${M.h(x, c)}"/><rect x="144" y="78" width="6" height="84" fill="${M.h(x, c)}"/>` +
        `<rect x="74" y="86" width="68" height="70" rx="4" fill="${x.lg([[0, "#2a2d33"], [1, "#16181c"]])}"/>` +
        lcd(x, 80, 92, 36, 22, GREEN) + digits(always(x), 112, 96, 9, pct(x), 3, x.on ? lvlCol(x, GREEN) : "#5d6470") + segBar(x, 83, 108, 30, 3, 5, false) + glass(x, 80, 92, 36, 22) +
        button(x, 130, 103, 5, "#2f3238") + ringLed(x, 130, 103, 6.5, 6.5, 1.1, x.lv < .2 ? "#ff5a4f" : "#7ee7ff") +
        face(x, 92, 136, .62, "#2c2f36") + face(x, 114, 136, .62, "#2c2f36") +
        `<rect x="128" y="124" width="8" height="4" rx="1.5" fill="#06070a"/><rect x="128" y="132" width="8" height="4" rx="1.5" fill="#06070a"/><rect x="129" y="141" width="6" height="3" rx="1.5" fill="#06070a"/>`;
      return scene(x, back, body); }),

    ic("generator", "Standby generator", sw(["#d9d1bc", "#8e959e", "#4f6b4e", "#eef0f2", "#3a3d44"], "#d9d1bc"), "Body", (o) => { const x = X(o), c = o.color;
      const back = sidingB(x, "#6b6658") + `<rect x="8" y="128" width="184" height="6" fill="#3b3a36"/>` + grassB(x, 134, "#4b7536", 23) +
        `<path d="M22 134L180 134L192 160H8Z" fill="${x.lg([[0, "#8c8a84"], [1, "#6b6964"]])}"/>` + dots(91, 80, 14, 136, 172, 24, .9, .25);
      let louv = "";
      for (let i = 0; i < 9; i++) louv += `<path d="M${120} ${86 + i * 6}H${146}" stroke="${H.shade(c, -.5)}" stroke-width="2.2"/><path d="M${120} ${87.5 + i * 6}H${146}" stroke="${H.shade(c, .45)}" stroke-width=".7"/>`;
      let side = "";
      for (let i = 0; i < 8; i++) side += `<path d="M${156} ${f(82 + i * 7)}L${166} ${f(76 + i * 7)}" stroke="${H.shade(c, -.55)}" stroke-width="2"/>`;
      const waves = x.on ? `<g class="${P}heat" opacity="${a2(.4 + .5 * x.lv)}">${[0, 1, 2].map((i) => `<path d="M${174 + i * 6} 96c-4-6 4-10 0-16s4-10 0-16" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round" style="animation-delay:${(-i * .5).toFixed(1)}s"/>`).join("")}</g>` : "";
      const body = `<path d="M24 150H170L180 158H14Z" fill="${x.lg([[0, "#a7a6a2"], [1, "#77766f"]])}"/>` +
        `<g class="${x.on ? P + "shake" : ""}">` +
        `<path d="M30 80L44 66H170L156 80Z" fill="${x.lg([[0, H.shade(c, .5)], [1, H.shade(c, .1)]])}"/>` +
        `<path d="M156 80L170 66V138L156 152Z" fill="${M.side(x, c)}"/>` + side +
        `<rect x="30" y="80" width="126" height="72" fill="${x.lg([[0, H.shade(c, .2)], [.6, c], [1, H.shade(c, -.3)]])}"/>` +
        `<rect x="30" y="80" width="126" height="72" fill="${x.lg([[0, "#fff", .18], [.2, "#fff", 0], [.85, "#000", 0], [1, "#000", .2]], 0, 0, 1, 0)}"/>` +
        `<path d="M30 80H156" stroke="#fff" stroke-opacity=".5"/><path d="M44 66H170" stroke="#fff" stroke-opacity=".5"/>` +
        `<rect x="114" y="82" width="38" height="58" rx="2" fill="${H.shade(c, -.2)}"/>` + louv +
        `<rect x="40" y="92" width="44" height="26" rx="3" fill="${H.shade(c, -.25)}"/><rect x="44" y="96" width="36" height="18" rx="2" fill="#101217"/>` +
        segBar(x, 48, 104, 22, 4, 5, false) + led(x, 74, 100, 1.4, x.on ? "#3ee08f" : "#3ee08f") + led(x, 50, 99, 1, "#ffb347", .3) +
        `<rect x="56" y="130" width="22" height="4" rx="2" fill="${H.shade(c, -.45)}"/>` + `</g>` + waves;
      return scene(x, back, body); }),
  ];

  const css = `
.hda-energy-flow{opacity:0}
.hda-anim .hda-energy-flow{animation:hda-energy-flow 1.6s linear infinite}
@keyframes hda-energy-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-energy-pulse{animation:hda-energy-pulse 2.8s ease-in-out infinite}
@keyframes hda-energy-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-energy-blink{animation:hda-energy-blink 1.1s ease-in-out infinite}
@keyframes hda-energy-blink{0%,100%{opacity:1}50%{opacity:.2}}
.hda-energy-sweepx,.hda-energy-sweepy{transform-box:fill-box}
.hda-anim .hda-energy-sweepx{animation:hda-energy-sx 2.2s linear infinite}
.hda-anim .hda-energy-sweepy{animation:hda-energy-sy 2.2s linear infinite}
@keyframes hda-energy-sx{0%{transform:translate(0,0)}100%{transform:translate(400%,0)}}
@keyframes hda-energy-sy{0%{transform:translate(0,0)}100%{transform:translate(0,-400%)}}
.hda-energy-spinslow{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-energy-spinslow{animation:hda-energy-spin 24s linear infinite}
@keyframes hda-energy-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.hda-anim .hda-energy-glint{animation:hda-energy-glint 7s ease-in-out infinite alternate}
@keyframes hda-energy-glint{0%{transform:translate(-36px,0)}100%{transform:translate(70px,0)}}
.hda-energy-heat path{transform-box:fill-box}
.hda-anim .hda-energy-heat path{animation:hda-energy-heat 1.6s ease-in-out infinite}
@keyframes hda-energy-heat{0%{transform:translate(0,4px);opacity:0}40%{opacity:1}100%{transform:translate(0,-10px);opacity:0}}
.hda-anim .hda-energy-shake{animation:hda-energy-shake .18s linear infinite}
@keyframes hda-energy-shake{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.4px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-energy-flow,.hda-anim .hda-energy-pulse,.hda-anim .hda-energy-blink,.hda-anim .hda-energy-sweepx,.hda-anim .hda-energy-sweepy,.hda-anim .hda-energy-spinslow,.hda-anim .hda-energy-glint,.hda-anim .hda-energy-heat path,.hda-anim .hda-energy-shake{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "energy", tab: "Energy & EV", group: "Utility", kind: "device",
    intro: "Twelve EV chargers, home batteries, solar and backup power in real garages, walls and yards. The slider is the charge: rings, LED bars and battery gauges fill with it (red when low). On means charging or producing: energy runs along the cables, LED bars sweep and the sun glint drifts over the panels.",
    
    levelLabel: "Charge", onWord: "Charging", offWord: "Idle",
    css, icons,
  });
})();
