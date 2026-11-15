(function () {
  const H = window.HDAH, P = "hda-heating-";
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

  const aff = (tl, tr, bl) => (u, v) => [tl[0] + u * (tr[0] - tl[0]) + v * (bl[0] - tl[0]), tl[1] + u * (tr[1] - tl[1]) + v * (bl[1] - tl[1])];
  const P2 = (p) => `${f(p[0])} ${f(p[1])}`;
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

  function glint(x, cp, x0, y0, w, h, k) {
    if (!x.on) return "";
    return `<g clip-path="${cp}"><g class="${P}glint"><path d="M${f(x0)} ${f(y0 + h)}L${f(x0 + w * .3)} ${f(y0)}H${f(x0 + w * .46)}L${f(x0 + w * .16)} ${f(y0 + h)}Z" fill="${x.lg([[0, "#fff", 0], [.5, "#fff", .8], [1, "#fff", 0]], 0, 0, 1, 0)}" opacity="${a2((k || 1) * (.25 + .55 * x.lv))}"/>
<circle cx="${f(x0 + w * .26)}" cy="${f(y0 + h * .4)}" r="5" fill="${M.halo(x, "#ffffff")}" opacity="${a2(.6 * x.lv + .2)}"/></g></g>`;
  }
  function tileFloor(x, y0, col) {
    col = col || "#b9b0a2"; const Hh = 150;
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, H.shade(col, -.35)], [1, H.shade(col, .05)]])}"/>` + dots(y0 * 13, 90, 8, y0, 184, 192 - y0, .7, .14);
    for (let i = 1; i < 6; i++) { const y = y0 + (192 - y0) * Math.pow(i / 6, 1.4);
      s += `<path d="M8 ${f(y)}H192" stroke="#2b2620" stroke-opacity=".35" stroke-width="${f(.6 + i * .15)}"/><path d="M8 ${f(y + 1)}H192" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`; }
    for (let k = -6; k <= 6; k++) { const xb = 100 + k * 38, xt = 100 + (xb - 100) * Hh / (Hh + 192 - y0);
      s += `<path d="M${f(xt)} ${y0}L${f(xb)} 192" stroke="#2b2620" stroke-opacity=".3" stroke-width=".9"/>`; }
    return s + `<path d="M8 ${y0 + .5}H192" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>`;
  }

  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label, render }, extra || {});
  // (multi-function) parts: o.parts holds only the parts the owner ticked; a part left out follows the one device as a
  // Device Image (no o.mf, as today) and stays off, never animated, as a Multi-Function Image (o.mf). A part's level is
  // o.plevel[id], a light's color o.pcolor[id], a stage part's value o.pval[id] (one of its stage ids; left out = none).
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    on: (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on),
    lv: (o, k) => (o.plevel && o.plevel[k] != null && isFinite(+o.plevel[k]) ? +o.plevel[k] : o.level),
    col: (o, k, d) => (o.pcolor && /^#[0-9a-fA-F]{6}$/.test(o.pcolor[k] || "") ? o.pcolor[k] : d),
    st: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" ? String(o.pval[k]) : null),
    // the drawing as one part: on = that part, level = its level
    as: (o, k) => Object.assign({}, o, { on: MF.on(o, k), level: MF.lv(o, k) }),
  };
  // a part's view of the drawing: the same x (its gradients land in the same defs) with its own on
  const sub = (x, on) => { const y = Object.create(x); y.on = on; y.an = on && x.o.anim; y.L = on ? .35 + .65 * x.lv : 0; return y; };
  const mfOn = (o) => !!(o.mf || o.parts);
  // a boiler's two calls: Heat (space heating: a radiator mark) and Hot water (domestic hot water: a tap mark)
  const BOIL = [{ id: "heat", name: "Heat" }, { id: "dhw", name: "Hot water" }];
  const radMark = (x, cx, cy, on) => { const c = on ? "#ff9a4a" : "#3a404a"; let s = `<path d="M${f(cx - 3.4)} ${f(cy + 2.4)}H${f(cx + 3.4)}" stroke="${c}" stroke-width=".7"/>`;
    for (let i = 0; i < 4; i++) s += `<rect x="${f(cx - 3.2 + i * 1.8)}" y="${f(cy - 2.4)}" width="1.2" height="4.4" rx=".5" fill="${c}"/>`; return s; };
  const tapMark = (x, cx, cy, on) => { const c = on ? "#6cc4ff" : "#3a404a";
    return `<path d="M${f(cx - 3)} ${f(cy - 1.6)}H${f(cx + 1.2)}Q${f(cx + 2.6)} ${f(cy - 1.6)} ${f(cx + 2.6)} ${f(cy)}V${f(cy + .6)}" fill="none" stroke="${c}" stroke-width="1.1"/><path d="M${f(cx - 1)} ${f(cy - 3.2)}V${f(cy - 1.6)}M${f(cx - 2.2)} ${f(cy - 3.2)}H${f(cx + .2)}" stroke="${c}" stroke-width=".8"/>` +
      (on ? `<circle cx="${f(cx + 2.6)}" cy="${f(cy + 2.2)}" r=".7" fill="${c}"/>` : ""); };
  const COP = "#c8794a", HOT = "#ff7a3a", COLD = "#5ab0ff";
  const tempC = (x) => Math.round(30 + 50 * x.lv);
  const shadowE = (x, cx, cy, rx, ry, k) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${M.shadow(x)}" opacity="${k || .8}"/>`;
  const pipe = (x, pts, w, col, flow, n) => cord(x, pts, w, col, x.on ? flow : null, n);
  const vents = (x0, y0, w, rows, gap, op) => { let s = ""; for (let i = 0; i < rows; i++) s += `<rect x="${f(x0)}" y="${f(y0 + i * gap)}" width="${f(w)}" height="${f(gap * .42)}" rx="${f(gap * .2)}" fill="#000" fill-opacity="${op || .45}"/>`; return s; };

  function flames(x, cx, by, w, h) {
    if (!x.on) return "";
    const hh = h * (.35 + .65 * x.lv), outer = x.lg([[0, "#e8541e", 0], [.35, "#ff7a2a", .95], [1, "#ffd25a"]]), inner = x.lg([[0, "#ffd25a", 0], [.4, "#ffe28a"], [1, "#fff6d0"]]);
    const tongue = (dx, sw, sh, fill, dl) => `<path class="${P}flick" style="animation-delay:${dl}s" d="M${f(cx + dx - sw / 2)} ${f(by)}C${f(cx + dx - sw / 2)} ${f(by - sh * .5)} ${f(cx + dx - sw * .1)} ${f(by - sh * .6)} ${f(cx + dx + sw * .05)} ${f(by - sh)}C${f(cx + dx + sw * .2)} ${f(by - sh * .55)} ${f(cx + dx + sw / 2)} ${f(by - sh * .45)} ${f(cx + dx + sw / 2)} ${f(by)}Z" fill="${fill}"/>`;
    return `<ellipse cx="${f(cx)}" cy="${f(by - hh * .35)}" rx="${f(w * .9)}" ry="${f(hh * .8)}" fill="${M.halo(x, "#ff8a3a")}" opacity="${a2(.5 + .4 * x.lv)}"/>` +
      tongue(-w * .3, w * .5, hh * .7, outer, -.3) + tongue(w * .3, w * .5, hh * .75, outer, -.7) + tongue(0, w * .7, hh, outer, 0) +
      tongue(-w * .08, w * .36, hh * .55, inner, -.5) + tongue(w * .12, w * .3, hh * .45, inner, -.2);
  }
  const steam = (x, cx, y, n, k) => !x.on ? "" : Array.from({ length: n }, (_, i) =>
    `<path class="${P}steam" style="animation-delay:${(-i * .7).toFixed(1)}s" d="M${f(cx + (i - (n - 1) / 2) * 9)} ${f(y)}c-5-6 5-10 0-16s5-10 0-16" fill="none" stroke="#fff" stroke-opacity="${a2((k || .45))}" stroke-width="2.4" stroke-linecap="round"/>`).join("");
  const heatW = (x, x0, x1, y, k) => !x.on ? "" : `<g opacity="${a2((k || .5) * (.4 + .6 * x.lv))}">` + Array.from({ length: Math.max(2, Math.round((x1 - x0) / 18)) }, (_, i) =>
    `<path class="${P}heat" style="animation-delay:${(-i * .45).toFixed(2)}s" d="M${f(x0 + (i + .5) * (x1 - x0) / Math.max(2, Math.round((x1 - x0) / 18)))} ${f(y)}c-3-5 3-8 0-13s3-8 0-13" fill="none" stroke="#ffd2b0" stroke-opacity=".6" stroke-width="1.5" stroke-linecap="round"/>`).join("") + `</g>`;
  function gauge(x, cx, cy, r, v) {
    const a = (-225 + 270 * v) * Math.PI / 180; let t = "";
    for (let i = 0; i <= 8; i++) { const b = (-225 + i * 33.75) * Math.PI / 180; t += `<path d="M${f(cx + Math.cos(b) * r * .62)} ${f(cy + Math.sin(b) * r * .62)}L${f(cx + Math.cos(b) * r * .78)} ${f(cy + Math.sin(b) * r * .78)}" stroke="#2a2d33" stroke-width="${f(r * .07)}"/>`; }
    const rz = (-225 + 270 * .8) * Math.PI / 180, re = 45 * Math.PI / 180;
    return `<circle cx="${f(cx + .6)}" cy="${f(cy + 1)}" r="${f(r)}" fill="#000" fill-opacity=".3"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${M.steel(x)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .84)}" fill="${x.rg([[0, "#ffffff"], [1, "#d5d9de"]])}"/>` + t +
      `<path d="M${f(cx + Math.cos(rz) * r * .7)} ${f(cy + Math.sin(rz) * r * .7)}A${f(r * .7)} ${f(r * .7)} 0 0 1 ${f(cx + Math.cos(re) * r * .7)} ${f(cy + Math.sin(re) * r * .7)}" fill="none" stroke="#e0483e" stroke-width="${f(r * .12)}"/>` +
      `<path d="M${f(cx)} ${f(cy)}L${f(cx + Math.cos(a) * r * .72)} ${f(cy + Math.sin(a) * r * .72)}" stroke="#c0221e" stroke-width="${f(Math.max(.7, r * .1))}" stroke-linecap="round"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .12)}" fill="#2a2d33"/>` +
      `<path d="M${f(cx - r * .6)} ${f(cy - r * .4)}A${f(r * .75)} ${f(r * .75)} 0 0 1 ${f(cx + r * .2)} ${f(cy - r * .72)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${f(r * .1)}" stroke-linecap="round"/>`;
  }
  function fanCap(x, cx, cy, r, col) {
    let sl = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none"/>`;
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; sl += `<path d="M${f(cx + Math.cos(a) * r * .3)} ${f(cy + Math.sin(a) * r * .3)}L${f(cx + Math.cos(a + .3) * r * .85)} ${f(cy + Math.sin(a + .3) * r * .85)}" stroke="#000" stroke-opacity=".55" stroke-width="${f(r * .14)}" stroke-linecap="round"/>`; }
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${M.s(x, col)}"/><g${x.on ? ` class="${P}spin" style="animation-duration:${(1.2 - .8 * x.lv).toFixed(2)}s"` : ""}>${sl}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .22)}" fill="${H.shade(col, -.3)}"/>`;
  }
  const valve = (x, cx, cy, col, rot) => `<rect x="${f(cx - 4)}" y="${f(cy - 3.5)}" width="8" height="7" rx="1.5" fill="${M.metal(x, "#c9a24a")}"/><g transform="rotate(${rot || 0} ${f(cx)} ${f(cy)})"><rect x="${f(cx - 1)}" y="${f(cy - 4.5)}" width="11" height="3" rx="1.5" fill="${M.v(x, col)}"/></g>`;
  function boards(x, x0, y0, w, h, col, bw) {
    bw = bw || 9; const r = rnd(Math.round(x0 * 7 + y0)); let s = `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" fill="${H.shade(col, -.3)}"/>`;
    for (let bx = x0; bx < x0 + w - .1; bx += bw) { const t = H.mix(col, H.shade(col, -.2), r()), ww = Math.min(bw, x0 + w - bx);
      s += `<rect x="${f(bx + .4)}" y="${f(y0)}" width="${f(ww - .8)}" height="${f(h)}" fill="${x.lg([[0, H.shade(t, .12)], [.5, t], [1, H.shade(t, -.15)]], 0, 0, 1, 0)}"/><path d="M${f(bx + 2 + r() * (ww - 4))} ${f(y0)}V${f(y0 + h)}" stroke="#2a180b" stroke-opacity=".12" stroke-width=".6"/>`; }
    return s;
  }
  const temp2 = (x) => String(tempC(x));
  const WHT = ["#eef0f2", "#c9ccd1", "#2c2f36", "#8e959e", "#e8e2d6"];
  const IRON = ["#2a2b2f", "#5a3a2a", "#7a1f1f", "#2f4f3f", "#d9d1bc"];
  const WOOD = ["#c8925a", "#a8693c", "#e0c08a", "#6b4a30", "#3a2a1e"];
  const PUMP = ["#c0392b", "#2f8f5e", "#3a6fd8", "#2c2f36", "#eef0f2"];
  const basement = (x, y) => blockB(x, y) + concreteB(x, y, "#6c6f75");

  const icons = [
    ic("diesel", "Diesel air heater", sw(["#e8641e", "#d12a2a", "#2c2f36", "#e8b81e", "#3a6fd8"], "#e8641e"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 150);
      let duct = ""; for (let i = 0; i < 9; i++) duct += `<ellipse cx="${f(150 + i * 3.6)}" cy="${f(84 - i * 3.2)}" rx="3.4" ry="9" transform="rotate(-40 ${f(150 + i * 3.6)} ${f(84 - i * 3.2)})" fill="${x.lg([[0, "#e9edf1"], [1, "#8a9098"]], 0, 0, 1, 0)}" stroke="#6c727a" stroke-width=".5"/>`;
      const body = shadowE(x, 92, 166, 66, 7) +
        pipe(x, [44, 124, 30, 130, 26, 150, 18, 160], 3.4, "#9aa1aa", null) + (x.on ? `<g opacity=".5">${steam(x, 18, 152, 1, .35)}</g>` : "") +
        box(x, 40, 100, 100, 60, 6, 4, 4, c) + `<rect x="40" y="100" width="100" height="60" rx="6" fill="${x.lg([[0, "#fff", .18], [.25, "#fff", 0], [1, "#000", .2]], 0, 0, 1, 0)}"/>` +
        [[40, 100], [132, 100], [40, 152], [132, 152]].map(([a, b]) => `<rect x="${a}" y="${b}" width="8" height="8" rx="2" fill="#1d1e22"/>`).join("") +
        `<rect x="54" y="138" width="22" height="10" rx="2" fill="${H.shade(c, -.35)}"/><circle cx="65" cy="143" r="3" fill="#1d1e22"/>` +
        lcd(x, 86, 112, 40, 18, "#7ee7ff") + digits(x, 118, 115, 11, temp2(x), 2, "#bdf3ff") + `<circle cx="120.5" cy="116" r="1.2" fill="none" stroke="${x.on ? "#bdf3ff" : "#30363f"}" stroke-width=".7"/>` + glass(x, 86, 112, 40, 18) +
        button(x, 92, 140, 3, "#2c2f36") + button(x, 104, 140, 3, "#2c2f36") + button(x, 116, 140, 3, "#2c2f36") +
        `<rect x="50" y="70" width="88" height="30" rx="14" fill="${x.lg([[0, "#4a4e56"], [.4, "#2a2c31"], [1, "#121316"]])}"/><path d="M58 74H130" stroke="#fff" stroke-opacity=".25" stroke-width="1.4" stroke-linecap="round"/>` +
        `<ellipse cx="140" cy="85" rx="7" ry="15" fill="${M.steel(x)}"/><ellipse cx="141" cy="85" rx="5" ry="12" fill="${x.on ? x.rg([[0, "#ffd25a"], [.5, "#ff6a1a"], [1, "#401a0a"]]) : "#1a1b1f"}"/>` +
        vents(140, 76, 3, 6, 3, .7) + duct + heatW(x, 166, 188, 54, .8) +
        `<rect x="22" y="160" width="16" height="24" rx="3" fill="${x.lg([[0, "#2c2f36"], [1, "#0f1013"]])}"/><rect x="24" y="163" width="12" height="9" rx="1" fill="${x.on ? "#1a4a5a" : "#0b0c10"}"/>` + led(x, 30, 178, .9, "#ff3b3b", .5);
      return scene(x, back, body); }),

    ic("pelletboiler", "Pellet boiler", sw(["#eef0f2", "#c0392b", "#2c2f36", "#8e959e", "#3a6a4a"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 166);
      const body = shadowE(x, 102, 172, 76, 7) +
        pipe(x, [74, 50, 74, 30, 80, 20, 110, 20, 150, 20, 168, 14, 196, 14], 7, "#2a2c31") +
        pipe(x, [44, 70, 30, 70, 22, 80, 20, 110, 18, 140, 14, 150, 8, 150], 4, COP, HOT, 8) +
        box(x, 116, 72, 56, 94, 4, 4, 3, H.shade(c, -.05)) + `<rect x="114" y="66" width="60" height="10" rx="3" fill="${M.v(x, H.shade(c, -.15))}"/>` +
        `<rect x="134" y="92" width="20" height="58" rx="3" fill="#15161a"/>` + `<rect x="135.5" y="${f(93.5 + 55 * (1 - x.lv))}" width="17" height="${f(Math.max(1, 55 * x.lv))}" fill="${x.lg([[0, "#c8a46a"], [1, "#8a6a3a"]])}"/>` + dots(61, 30, 136, 94 + 55 * (1 - x.lv), 16, 54 * x.lv, .9, .4) + `<path d="M137 95L142 95L138 147H137Z" fill="#fff" fill-opacity=".18"/>` + `<path d="M120 96L112 88" stroke="${M.steel(x)}" stroke-width="6"/>` +
        `<path d="M116 100L104 86" stroke="#8a9098" stroke-width="7" stroke-linecap="round"/>` +
        box(x, 40, 50, 66, 116, 5, 4, 3, c) +
        `<rect x="40" y="50" width="66" height="22" rx="5" fill="${x.lg([[0, "#2a2c31"], [1, "#16171a"]])}"/>` + lcd(x, 48, 55, 30, 12, "#ffb347") + digits(x, 75, 57, 8, temp2(x), 2, "#ffd9a0") + led(x, 88, 61, 1.1, "#3ee08f") + button(x, 97, 61, 2.6, "#d5d9de") +
        `<rect x="50" y="92" width="46" height="46" rx="4" fill="${H.shade(c, -.2)}"/><circle cx="73" cy="115" r="15" fill="#15161a"/><circle cx="73" cy="115" r="12" fill="${x.on ? x.rg([[0, "#ffd25a"], [.6, "#c8401a"], [1, "#2a0e06"]]) : "#0d0e10"}"/>` +
        `<g clip-path="${clipU(x, "sight", `<circle cx="73" cy="115" r="12"/>`)}">${flames(x, 73, 126, 14, 20)}</g><circle cx="73" cy="115" r="12" fill="none" stroke="${M.steel(x)}" stroke-width="2"/><path d="M66 108A9 9 0 0 1 78 106" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
        `<path d="M88 100V130" stroke="${M.steel(x)}" stroke-width="2.4" stroke-linecap="round"/>` + vents(48, 146, 50, 3, 5);
      return scene(x, back, body); }),

    // (parts) Heat (the heating flow pipe runs, the radiator mark lights) and Hot water (the hot-water and cold-in pipes run,
    // the tap mark lights); the burner flame shows while either runs. A Device Image is drawn as before.
    ic("combi", "Combi boiler", sw(WHT, "#eef0f2"), "Finish", (o) => { const mf = mfOn(o), ht = MF.on(o, "heat"), hw = MF.on(o, "dhw");
      const x = X(mf ? Object.assign({}, o, { on: ht || hw }) : o), c = o.color, xh = mf ? sub(x, ht) : x, xw = mf ? sub(x, hw) : x;
      const back = wallB(x, "cream", 8, 192);
      const pipes = [66, 82, 100, 118, 134].map((px, i) => pipe(i === 1 ? xh : i === 2 || i === 3 ? xw : x, [px, 136, px, 156, px, 170, px, 196], 4.2, COP, i === 1 || i === 2 ? HOT : i === 3 ? COLD : null, 6)).join("") +
        valve(x, 66, 152, "#e0483e") + valve(x, 82, 152, "#e0483e") + valve(x, 118, 152, "#3a6fd8") + valve(x, 134, 152, "#e0483e");
      const body = `<rect x="94" y="8" width="12" height="22" fill="${x.lg([[0, "#c9ccd1"], [.5, "#ffffff"], [1, "#a9aeb5"]], 0, 0, 1, 0)}"/><rect x="92" y="18" width="16" height="3" fill="#b0b5bc"/>` +
        pipes + `<rect x="62" y="132" width="78" height="8" fill="#1d1e22" fill-opacity=".6"/>` +
        box(x, 54, 28, 92, 106, 9, 3, 4, c) + `<rect x="54" y="28" width="92" height="106" rx="9" fill="${x.lg([[0, "#fff", .25], [.3, "#fff", 0], [1, "#000", .15]], 0, 0, 1, 0)}"/>` +
        `<path d="M60 112H140" stroke="${H.shade(c, -.25)}" stroke-width=".8"/>` +
        `<rect x="70" y="92" width="60" height="16" rx="5" fill="${x.lg([[0, "#22252c"], [1, "#0e1014"]])}"/>` + digits(x, 102, 95, 10, temp2(x), 2, "#ffd9a0") +
        `<circle cx="104.5" cy="96" r="1.1" fill="none" stroke="${x.on ? "#ffd9a0" : "#30363f"}" stroke-width=".6"/>` +
        (x.on ? `<path d="M118 106C114 103 116 99 119 96C119 99 122 100 121 104Z" fill="#ff8a3a"/>` : `<path d="M118 106C114 103 116 99 119 96C119 99 122 100 121 104Z" fill="#30363f"/>`) +
        (mf ? radMark(x, 76, 97, ht) + tapMark(x, 77, 104, hw) : `<circle cx="78" cy="100" r="1.4" fill="${H.shade(c, -.3)}"/>`) + gauge(x, 86, 122, 5, x.on ? .5 : .1) + button(x, 116, 122, 3.6, H.shade(c, .1));
      return scene(x, back, body); }, { parts: BOIL }),

    // (parts) Heat (the heating flow and return run, the pump spins, the radiator lamp lights) and Hot water (the tap lamp
    // lights: the boiler fires for the tank); the burner fires while either runs. A Device Image is drawn as before.
    ic("floorboiler", "Floor gas boiler", sw(["#2f6a5a", "#3a5a8a", "#c9ccd1", "#2c2f36", "#8a2a2a"], "#2f6a5a"), "Finish", (o) => { const mf = mfOn(o), ht = MF.on(o, "heat"), hw = MF.on(o, "dhw");
      const x = X(mf ? Object.assign({}, o, { on: ht || hw }) : o), c = o.color, xh = mf ? sub(x, ht) : x;
      const back = basement(x, 166);
      const body = shadowE(x, 96, 172, 60, 7) +
        pipe(x, [96, 56, 96, 30, 96, 20, 96, 6], 10, "#9aa1aa") + `<path d="M84 56H108L104 46H88Z" fill="${M.steel(x)}"/>` +
        pipe(xh, [126, 60, 126, 40, 140, 30, 170, 30, 186, 30, 196, 30, 206, 30], 5, COP, HOT, 9) +
        pipe(xh, [150, 166, 150, 120, 150, 100, 160, 80, 170, 60, 180, 50, 206, 50], 5, COP, COLD, 9) +
        `<rect x="142" y="116" width="16" height="10" rx="2" fill="#2a2c31"/><rect x="138" y="100" width="24" height="18" rx="4" fill="${M.h(x, "#c0392b")}"/>` + fanCap(xh, 150, 109, 6, "#c0392b") +
        box(x, 46, 60, 92, 106, 3, 6, 4, c) + `<rect x="46" y="60" width="92" height="106" rx="3" fill="${x.lg([[0, "#fff", .18], [.25, "#fff", 0], [1, "#000", .25]], 0, 0, 1, 0)}"/>` +
        `<path d="M46 104H138" stroke="#000" stroke-opacity=".35"/>` + gauge(x, 64, 82, 8, x.on ? .35 + .5 * x.lv : .2) +
        box(x, 100, 70, 30, 24, 2, 2, 2, "#8e959e") + `<circle cx="115" cy="82" r="6" fill="${M.s(x, "#d5d9de")}"/><path d="M115 82L${f(115 + Math.cos(-2.3 + 3 * x.lv) * 5)} ${f(82 + Math.sin(-2.3 + 3 * x.lv) * 5)}" stroke="#2a2d33" stroke-width="1.2"/>` +
        vents(54, 112, 40, 6, 5.4) + (mf ? `<path d="${"M100 96.4h30v6.4h-30Z"}" fill="#1a1c21" rx="1"/>` + radMark(x, 107, 99.6, ht) + tapMark(x, 123, 100, hw) : "") +
        `<rect x="104" y="124" width="22" height="16" rx="2" fill="#0e0f12"/><g clip-path="${clipU(x, "fb", `<rect x="104" y="124" width="22" height="16" rx="2"/>`)}">` +
        (x.on ? `<rect x="104" y="124" width="22" height="16" fill="${x.rg([[0, "#ff8a3a", .9], [1, "#401a0a", .3]])}"/>` + [0, 1, 2, 3].map((i) => `<path class="${P}flick" style="animation-delay:${-i * .2}s" d="M${107 + i * 5} 140Q${108 + i * 5} ${133 - 4 * x.lv} ${109 + i * 5} ${130 - 4 * x.lv}Q${110 + i * 5} 134 ${111 + i * 5} 140Z" fill="#5ab0ff"/>`).join("") : "") + `</g>` +
        `<path d="M106 126L112 126L107 138H106Z" fill="#fff" fill-opacity=".14"/>`;
      return scene(x, back, body); }, { parts: BOIL }),

    ic("panelrad", "Panel radiator", sw(["#eef0f2", "#2c2f36", "#8e959e", "#3a5a7a", "#d9d1bc"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "blue", 8, 160) + `<rect x="20" y="8" width="160" height="58" fill="${x.lg([[0, "#8fb8dc"], [1, "#d6e8f5"]])}"/><path d="M100 8V62" stroke="#eef0f2" stroke-width="3"/><rect x="14" y="62" width="172" height="8" rx="1" fill="${M.v(x, "#eef0f2")}"/>` + baseB(x, 160, "#8a6142");
      let ch = ""; for (let i = 0; i < 26; i++) ch += `<rect x="${f(31 + i * 5.3)}" y="94" width="2.6" height="54" fill="${H.shade(c, -.12)}"/><path d="M${f(31.4 + i * 5.3)} 94V148" stroke="#fff" stroke-opacity=".45" stroke-width=".6"/>`;
      const body = (x.on ? `<rect x="24" y="74" width="152" height="80" fill="${x.rg([[0, "#ff8a3a", .28], [1, "#ff8a3a", 0]], .5, .55, .6)}" opacity="${a2(.4 + .6 * x.lv)}"/>` : "") +
        `<rect x="30" y="92" width="142" height="62" rx="2" fill="#000" fill-opacity=".25" transform="translate(2 3)"/>` +
        `<rect x="28" y="88" width="144" height="64" rx="2.5" fill="${M.v(x, c)}"/>` + ch +
        `<rect x="28" y="88" width="144" height="6" rx="2" fill="${H.shade(c, -.25)}"/>` + vents(30, 89.5, 140, 1, 4, .4) + (() => { let g = ""; for (let i = 0; i < 34; i++) g += `<rect x="${31 + i * 4.1}" y="89.5" width="2" height="3" fill="#000" fill-opacity=".45"/>`; return g; })() +
        `<path d="M36 152V164M164 152V164" stroke="${M.steel(x)}" stroke-width="2.4"/>` +
        pipe(x, [20, 164, 20, 150, 20, 146, 28, 146], 3.4, "#eef0f2", HOT, 4) +
        `<rect x="14" y="128" width="12" height="18" rx="3" fill="${M.v(x, "#f2f2ee")}"/>` + (() => { let r = ""; for (let i = 0; i < 4; i++) r += `<path d="M15 ${132 + i * 3.5}H25" stroke="#000" stroke-opacity=".15"/>`; return r; })() +
        heatW(x, 40, 160, 84);
      return scene(x, back, body); }),

    ic("columnrad", "Column radiator", sw(["#eef0f2", "#2c2f36", "#8e959e", "#5a6a7a", "#b06a4a", "#3a5a4a"], "#2c2f36"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "sage", 8, 160) + baseB(x, 160, "#8a6142");
      let cols = "";
      for (let i = 0; i < 18; i++) { const cx = 38 + i * 7.3;
        cols += `<rect x="${f(cx - 3.1)}" y="70" width="6.2" height="98" rx="3.1" fill="${x.lg([[0, H.shade(c, -.45)], [.35, H.shade(c, .35)], [.6, c], [1, H.shade(c, -.5)]], 0, 0, 1, 0)}"/>`; }
      const body = (x.on ? `<ellipse cx="100" cy="118" rx="80" ry="56" fill="${M.halo(x, "#ff8a3a")}" opacity="${a2(.25 + .35 * x.lv)}"/>` : "") +
        shadowE(x, 100, 174, 74, 5) + `<rect x="34" y="78" width="132" height="8" fill="${H.shade(c, -.4)}"/><rect x="34" y="154" width="132" height="8" fill="${H.shade(c, -.4)}"/>` + cols +
        `<rect x="34" y="166" width="8" height="8" rx="1" fill="${H.shade(c, -.4)}"/><rect x="158" y="166" width="8" height="8" rx="1" fill="${H.shade(c, -.4)}"/>` +
        pipe(x, [22, 192, 22, 172, 22, 160, 30, 158], 3.4, COP, HOT, 4) + `<rect x="16" y="140" width="12" height="18" rx="3" fill="${M.metal(x, "#c9a24a")}"/>` + heatW(x, 40, 160, 66);
      return scene(x, back, body); }),

    ic("towelrail", "Towel radiator", sw(["#d5d9de", "#2c2f36", "#eef0f2", "#b08d57", "#8e959e"], "#d5d9de"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = tileB(x, 8, 192, "#dfe3e8");
      let bars = ""; for (let i = 0; i < 9; i++) { const y = 34 + i * 15; bars += `<rect x="58" y="${y}" width="84" height="5" rx="2.5" fill="${M.metal(x, c)}"/><path d="M60 ${y + 1}H140" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/>`; }
      const body = (x.on ? `<rect x="50" y="24" width="100" height="150" rx="10" fill="${x.rg([[0, "#ff8a3a", .3], [1, "#ff8a3a", 0]])}" opacity="${a2(.4 + .6 * x.lv)}"/>` : "") +
        `<rect x="56" y="22" width="10" height="148" rx="5" fill="#000" fill-opacity=".2" transform="translate(3 3)"/><rect x="134" y="22" width="10" height="148" rx="5" fill="#000" fill-opacity=".2" transform="translate(3 3)"/>` +
        bars + `<rect x="54" y="22" width="10" height="148" rx="5" fill="${M.metal(x, c)}"/><rect x="136" y="22" width="10" height="148" rx="5" fill="${M.metal(x, c)}"/>` +
        `<path d="M78 76H124V136Q124 140 120 140H82Q78 140 78 136Z" fill="${x.lg([[0, "#f1e6d6"], [1, "#cdbfa8"]], 0, 0, 1, 0)}"/><path d="M78 76H124V84H78Z" fill="#e4d6c0"/>` + (() => { let t = ""; for (let i = 0; i < 8; i++) t += `<path d="M${82 + i * 5.4} 86V138" stroke="#000" stroke-opacity=".06" stroke-width="1.6"/>`; return t; })() +
        `<path d="M78 134H124" stroke="#b9a68a" stroke-width="2"/>` +
        pipe(x, [59, 192, 59, 184, 59, 178, 59, 170], 3, c, HOT, 3) + pipe(x, [141, 192, 141, 184, 141, 178, 141, 170], 3, c) + heatW(x, 64, 136, 22, .7);
      return scene(x, back, body); }),

    ic("pelletstove", "Pellet stove", sw(IRON, "#2a2b2f"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "clay", 8, 150) + baseB(x, 150, "#8a6142") + `<path d="M30 192L44 160H156L170 192Z" fill="${x.lg([[0, "#7a7672"], [1, "#56524e"]])}"/>`;
      const body = (x.on ? `<ellipse cx="100" cy="110" rx="70" ry="60" fill="${M.halo(x, "#ff8a3a")}" opacity="${a2(.3 * x.L + .1)}"/>` : "") +
        shadowE(x, 100, 172, 50, 5) + pipe(x, [130, 56, 130, 30, 130, 20, 130, 6], 6, "#2a2b2f") +
        `<rect x="62" y="150" width="76" height="20" rx="2" fill="${M.v(x, H.shade(c, -.2))}"/>` +
        box(x, 56, 56, 88, 98, 6, 4, 4, c) + `<rect x="54" y="52" width="92" height="10" rx="3" fill="${M.v(x, H.shade(c, .15))}"/><path d="M58 55H142" stroke="#fff" stroke-opacity=".3"/>` +
        `<rect x="66" y="70" width="68" height="58" rx="4" fill="${H.shade(c, -.4)}"/><rect x="70" y="74" width="60" height="50" rx="2.5" fill="${x.on ? x.rg([[0, "#ffb347"], [.6, "#a8380e"], [1, "#2a0e06"]], .5, .7, .7) : x.lg([[0, "#1a1b1f"], [1, "#0b0b0d"]])}"/>` +
        `<g clip-path="${clipU(x, "pw", `<rect x="70" y="74" width="60" height="50" rx="2.5"/>`)}"><rect x="84" y="112" width="32" height="10" rx="2" fill="#3a2a22"/>${flames(x, 100, 114, 26, 36)}</g>` +
        `<path d="M74 78L90 78L76 120H74Z" fill="#fff" fill-opacity=".12"/><rect x="70" y="74" width="60" height="50" rx="2.5" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.5"/>` +
        vents(70, 134, 60, 2, 5) + lcd(x, 108, 133, 22, 9, "#ffb347") + digits(x, 128, 135, 5.5, Math.round(1 + 4 * x.lv), 1, "#ffd9a0") + `<rect x="138" y="80" width="4" height="22" rx="2" fill="${M.steel(x)}"/>`;
      return scene(x, back, body); }),

    ic("woodstove", "Wood stove", sw(IRON, "#2a2b2f"), "Finish", (o) => { const x = X(o), c = o.color;
      let brick = `<rect x="8" y="8" width="184" height="152" fill="#5a3226"/>`; const r = rnd(4);
      for (let row = 0, y = 8; y < 160; y += 9, row++) for (let bx = 8 - (row % 2) * 11; bx < 192; bx += 22) brick += `<rect x="${bx + .8}" y="${y + .8}" width="20.4" height="7.4" rx=".8" fill="${H.mix("#a2533a", "#7a3a28", r())}"/>`;
      const back = brick + `<rect x="8" y="8" width="184" height="152" fill="${x.lg([[0, "#000", .25], [1, "#000", .05]])}"/>` + `<rect x="8" y="160" width="184" height="32" fill="${x.lg([[0, "#6c6f75"], [1, "#4a4c51"]])}"/><path d="M8 160.5H192" stroke="#000" stroke-opacity=".5"/>`;
      const legs = [52, 140].map((lx) => `<path d="M${lx} 150L${lx - 4} 170H${lx + 6}L${lx + 6} 150Z" fill="${M.v(x, c)}"/>`).join("");
      const body = (x.on ? `<ellipse cx="96" cy="110" rx="80" ry="60" fill="${M.halo(x, "#ff8a3a")}" opacity="${a2(.3 * x.L + .1)}"/>` : "") +
        shadowE(x, 96, 172, 56, 5) + legs + pipe(x, [96, 64, 96, 40, 96, 20, 96, 6], 12, H.shade(c, .05)) + `<rect x="86" y="58" width="20" height="8" rx="1" fill="${M.v(x, c)}"/>` +
        `<path d="M42 66H150L156 76H36Z" fill="${M.v(x, H.shade(c, .2))}"/>` +
        `<rect x="40" y="76" width="112" height="76" rx="3" fill="${M.v(x, c)}"/><path d="M40 146H152" stroke="#000" stroke-opacity=".4"/><rect x="36" y="146" width="120" height="6" rx="2" fill="${M.v(x, H.shade(c, .1))}"/>` +
        `<rect x="52" y="84" width="76" height="56" rx="6" fill="${H.shade(c, .12)}"/><rect x="58" y="90" width="64" height="44" rx="3" fill="${x.on ? x.rg([[0, "#ffb347"], [.6, "#a8380e"], [1, "#1a0804"]], .5, .75, .75) : "#0b0b0d"}"/>` +
        `<g clip-path="${clipU(x, "ws", `<rect x="58" y="90" width="64" height="44" rx="3"/>`)}"><path d="M64 130L112 122L116 128L68 134Z" fill="#5a3422"/><path d="M70 122L120 132L116 136L66 128Z" fill="#6e4229"/>${flames(x, 90, 126, 30, 34)}</g>` +
        `<path d="M62 94L78 94L64 128H62Z" fill="#fff" fill-opacity=".1"/>` + [0, 1, 2].map((i) => `<path d="M58 ${100 + i * 12}H122" stroke="${H.shade(c, -.2)}" stroke-opacity=".5" stroke-width="1.2"/>`).join("") +
        `<rect x="130" y="102" width="6" height="16" rx="2" fill="${M.steel(x)}"/><circle cx="144" cy="90" r="4" fill="${M.s(x, H.shade(c, .2))}"/>`;
      return scene(x, back, body); }),

    // (parts) five zone loops z1..z5 (an actuator each): an open loop flows (its pipes run, its flow meter rises, its actuator
    // lamp lights); the feed valves and gauges show while any zone is open. A Device Image is drawn as before.
    ic("ufh", "Underfloor manifold", sw(["#c9ccd1", "#c9a24a", "#2c2f36", "#eef0f2"], "#c9ccd1"), "Finish", (o) => { const mf = mfOn(o), zs = [1, 2, 3, 4, 5].map((i) => MF.on(o, "z" + i));
      const x = X(mf ? Object.assign({}, o, { on: zs.some(Boolean) }) : o), c = o.color;
      const back = wallB(x, "gray", 8, 192) + `<rect x="18" y="20" width="164" height="172" fill="${x.lg([[0, "#d8dade"], [1, "#b8bcc2"]])}"/><rect x="18" y="20" width="164" height="172" fill="none" stroke="#000" stroke-opacity=".3"/>`;
      let top = "", bot = "", loops = "";
      for (let i = 0; i < 5; i++) { const px = 66 + i * 22, xz = mf ? sub(x, zs[i]) : x;
        loops += pipe(xz, [px, 66, px, 120, px - 4, 160, px - 6, 196], 4.6, "#e8e8e6", HOT, 7) + pipe(xz, [px + 8, 130, px + 8, 150, px + 6, 170, px + 4, 196], 4.6, "#e8e8e6", COLD, 5);
        if (mf && zs[i]) loops += `<path d="M${px} 66V120L${px - 4} 160L${px - 6} 196" fill="none" stroke="#ff7a2a" stroke-opacity=".5" stroke-width="2.6" stroke-linejoin="round"/>` +
          `<path d="M${px + 8} 130V150L${px + 6} 170L${px + 4} 196" fill="none" stroke="#3a8fff" stroke-opacity=".4" stroke-width="2.6" stroke-linejoin="round"/>`;
        const fh = mf && !zs[i] ? 4 : 4 + 14 * x.lv;
        top += `<rect x="${px - 4}" y="28" width="8" height="24" rx="3" fill="${x.lg([[0, "#ffffff", .6], [1, "#cfe8ff", .35]], 0, 0, 1, 0)}" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/><rect x="${px - 2.4}" y="${f(48 - fh)}" width="4.8" height="3" rx="1" fill="#e0483e"/><rect x="${px - 5}" y="22" width="10" height="7" rx="2" fill="${M.v(x, "#d93a30")}"/><rect x="${px - 3}" y="52" width="6" height="6" fill="${M.metal(x, c)}"/>`;
        bot += `<rect x="${px + 3}" y="104" width="10" height="16" rx="2" fill="${M.v(x, "#eef0f2")}"/><rect x="${px + 4}" y="100" width="8" height="5" rx="2" fill="${M.v(x, "#3a6fd8")}"/>` + (xz.on ? `<circle cx="${px + 8}" cy="114" r="1" fill="#3ee08f"/>` : ""); }
      const body = loops + `<rect x="40" y="58" width="134" height="10" rx="5" fill="${M.metal(x, c)}"/><rect x="40" y="120" width="134" height="10" rx="5" fill="${M.metal(x, c)}"/>` +
        `<path d="M40 60H174M40 122H174" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>` + top + bot +
        `<rect x="26" y="50" width="12" height="90" rx="2" fill="${M.steel(x)}"/>` + pipe(x, [8, 63, 20, 63, 26, 63, 40, 63], 6, COP, HOT, 4) + pipe(x, [8, 125, 20, 125, 26, 125, 40, 125], 6, COP, COLD, 4) +
        valve(x, 30, 63, "#e0483e", x.on ? 0 : 90) + valve(x, 30, 125, "#3a6fd8", x.on ? 0 : 90) + gauge(x, 180, 63, 7, .35 + .5 * x.lv) + gauge(x, 180, 125, 7, .3 + .3 * x.lv);
      return scene(x, back, body); }, { parts: [1, 2, 3, 4, 5].map((i) => ({ id: "z" + i, name: "Zone " + i })) }),

    ic("circ", "Circulator pump", sw(PUMP, "#c0392b"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 192) + `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#000", .1], [1, "#000", .3]])}"/>`;
      const w = Math.round(5 + 40 * x.lv);
      const body = pipe(x, [70, 6, 70, 40, 70, 60, 70, 66], 9, COP, HOT, 6) + pipe(x, [70, 136, 70, 160, 70, 180, 70, 196], 9, COP, HOT, 5) +
        pipe(x, [150, 6, 150, 80, 150, 140, 150, 196], 9, "#1d1e22") +
        `<rect x="60" y="62" width="20" height="8" rx="2" fill="${M.metal(x, "#c9a24a")}"/><rect x="60" y="130" width="20" height="8" rx="2" fill="${M.metal(x, "#c9a24a")}"/>` +
        `<rect x="56" y="70" width="28" height="60" rx="6" fill="${x.lg([[0, "#2a2c31"], [.4, "#4a4e56"], [1, "#16171a"]], 0, 0, 1, 0)}"/>` +
        `<rect x="76" y="80" width="50" height="40" rx="12" fill="${x.lg([[0, H.shade(c, -.4)], [.3, H.shade(c, .3)], [.6, c], [1, H.shade(c, -.5)]])}"/>` +
        (() => { let s = ""; for (let i = 0; i < 5; i++) s += `<path d="M${84 + i * 6} 82V118" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`; return s; })() +
        `<rect x="122" y="76" width="22" height="48" rx="8" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, -.45)]])}"/>` +
        `<rect x="126" y="86" width="14" height="28" rx="3" fill="${x.lg([[0, "#1a1c21"], [1, "#0b0c0f"]])}"/>` + digits(x, 139, 90, 7, w, 2, "#7ef0a8") +
        segBar(x, 128.5, 102, 9, 3, 3, false, "#7ef0a8") + led(x, 133, 110, .9, "#3ee08f") +
        `<path d="M80 84Q100 80 120 84" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/>`;
      return scene(x, back, body); }),

    ic("gshp", "Ground-source heat pump", sw(WHT, "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 168);
      const body = shadowE(x, 96, 174, 52, 6) +
        pipe(x, [66, 30, 66, 16, 66, 10, 66, 6], 7, "#1d1e22", COLD, 3) + pipe(x, [80, 30, 80, 16, 80, 10, 80, 6], 7, "#1d1e22", COLD, 3) +
        pipe(x, [112, 30, 112, 20, 130, 14, 170, 14, 186, 14, 196, 14, 206, 14], 6, COP, HOT, 8) + pipe(x, [126, 30, 126, 26, 140, 24, 170, 24, 186, 24, 196, 24, 206, 24], 6, COP, HOT, 8) +
        `<rect x="60" y="22" width="26" height="4" rx="1" fill="#3a6fd8"/><rect x="106" y="22" width="26" height="4" rx="1" fill="#e0483e"/>` +
        box(x, 50, 28, 90, 144, 5, 6, 4, c) + `<rect x="50" y="28" width="90" height="144" rx="5" fill="${x.lg([[0, "#fff", .25], [.3, "#fff", 0], [1, "#000", .18]], 0, 0, 1, 0)}"/>` +
        `<path d="M50 70H140M50 150H140" stroke="${H.shade(c, -.25)}" stroke-width=".8"/>` +
        `<rect x="66" y="38" width="58" height="24" rx="4" fill="${x.lg([[0, "#22252c"], [1, "#0e1014"]])}"/>` + digits(x, 98, 42, 11, temp2(x), 2, "#bdf3ff") +
        `<circle cx="100.5" cy="43" r="1.2" fill="none" stroke="${x.on ? "#bdf3ff" : "#30363f"}" stroke-width=".7"/>` + segBar(x, 104, 52, 16, 3, 4, false, "#7ee7ff") + led(x, 112, 44, 1, "#3ee08f") +
        vents(64, 154, 62, 2, 5);
      return scene(x, back, body); }),

    ic("buffer", "Buffer tank", sw(["#c9ccd1", "#eef0f2", "#c0392b", "#3a5a8a", "#2c2f36"], "#c9ccd1"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 172);
      const ports = [50, 82, 114, 146];
      const body = shadowE(x, 100, 176, 46, 6) +
        ports.map((y, i) => pipe(x, [136, y, 160, y, 176, y, 206, y], 5, i < 2 ? COP : "#1d1e22", i < 2 ? HOT : COLD, 6)).join("") +
        `<path d="M64 30Q64 16 100 14Q136 16 136 30V164Q136 172 100 172Q64 172 64 164Z" fill="${x.lg([[0, H.shade(c, -.45)], [.3, H.shade(c, .35)], [.55, c], [1, H.shade(c, -.55)]], 0, 0, 1, 0)}"/>` +
        `<path d="M68 28Q100 18 132 28" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>` + ports.map((y) => `<rect x="132" y="${y - 4}" width="8" height="8" rx="1" fill="${M.metal(x, "#c9a24a")}"/>`).join("") +
        [60, 98, 136].map((y, i) => gauge(x, 100, y, 8, Math.max(.05, Math.min(1, (x.on ? x.lv : x.lv * .6) * (1.1 - i * .25))))).join("") +
        `<path d="M64 46H136M64 120H136" stroke="#000" stroke-opacity=".15"/>` + `<rect x="94" y="8" width="12" height="8" rx="1" fill="${M.metal(x, "#c9a24a")}"/>`;
      return scene(x, back, body); }),

    ic("freshwater", "Fresh-water station", sw(["#2c2f36", "#eef0f2", "#8e959e", "#c0392b", "#3a5a8a"], "#2c2f36"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 192);
      let plates = ""; for (let i = 0; i < 12; i++) plates += `<path d="M${84 + i * 2.6} 54V118" stroke="#fff" stroke-opacity="${i % 2 ? .25 : .1}" stroke-width="1.4"/>`;
      const body = [62, 82, 118, 138].map((px, i) => pipe(x, [px, 160, px, 176, px, 186, px, 196], 5, COP, i === 0 ? HOT : i === 3 ? COLD : i === 1 ? COLD : HOT, 4)).join("") +
        box(x, 46, 24, 108, 140, 8, 4, 4, c) + `<rect x="54" y="32" width="92" height="124" rx="5" fill="${x.lg([[0, "#1a1b1f"], [1, "#2a2c32"]])}"/>` +
        `<rect x="80" y="50" width="36" height="72" rx="2" fill="${M.steel(x)}"/>` + plates + `<rect x="80" y="50" width="36" height="6" fill="${M.steel(x)}"/><rect x="80" y="116" width="36" height="6" fill="${M.steel(x)}"/>` +
        pipe(x, [62, 160, 62, 100, 66, 60, 80, 56], 4, COP, HOT, 6) + pipe(x, [82, 160, 82, 140, 84, 128, 88, 122], 4, COP, COLD, 3) +
        pipe(x, [118, 160, 118, 140, 116, 128, 110, 122], 4, COP, HOT, 3) + pipe(x, [138, 160, 138, 100, 132, 60, 116, 56], 4, COP, COLD, 6) +
        `<rect x="56" y="122" width="22" height="18" rx="5" fill="${M.h(x, "#2f8f5e")}"/>` + fanCap(x, 67, 131, 5.4, "#2f8f5e") +
        `<rect x="118" y="124" width="26" height="24" rx="3" fill="${x.lg([[0, "#eef0f2"], [1, "#b8bcc2"]])}"/>` + lcd(x, 121, 127, 20, 10, "#7ee7ff") + digits(x, 139, 129, 6, temp2(x), 2, "#bdf3ff") + led(x, 131, 143, .9, "#3ee08f");
      return scene(x, back, body); }),

    // (parts) a solar water heater: State (heating / idle / vacation, a stage: sunlit while heating), the circulation pump
    // (a switch: the hot pipe flows; without it the Heating stage does) and the water temperature (a reading on a small
    // readout on the header: orange heating, white idle, blue vacation). Without parts: today's drawing.
    ic("solarthermal", "Solar thermal collector", sw(["#c9ccd1", "#2c2f36", "#eef0f2", "#8e959e"], "#c9ccd1"), "Finish", (o) => {
      const sv = o.pval || {}, spp = o.parts || {}, sst = sv.state != null && sv.state !== "" ? String(sv.state).toLowerCase() : null, stp = sv.temp != null && sv.temp !== "" && isFinite(+sv.temp) ? Math.round(+sv.temp) : null;
      const SM = o.mf || sst != null || stp != null, spump = spp.pump != null && (o.mf || sst == null) ? !!spp.pump : sst != null ? sst === "heating" : !o.mf && !!o.on;
      const x = X(SM ? Object.assign({}, o, { on: sst != null ? sst === "heating" : spump }) : o), c = o.color;
      const roof = (() => { let s = `<path d="M8 110L192 80V192H8Z" fill="${x.lg([[0, "#6e6862"], [1, "#3d3935"]])}"/>`;
        for (let i = 1; i < 12; i++) { const y = 110 + i * 8.5, y2 = 80 + i * 8.5; s += `<path d="M8 ${f(y)}L192 ${f(y2)}" stroke="#16130f" stroke-opacity=".6" stroke-width="1.4"/>`; }
        return s + `<path d="M8 110L192 80" stroke="#8a8078" stroke-width="3"/>`; })();
      const back = skyB(x, 120, x.on) + (x.on ? sunG(x, 156, 30, 9) : cloud(x, 150, 34, 1.1, .8)) + roof;
      const A = aff([48, 76], [170, 58], [62, 160]); let tubes = "";
      const n = 14; for (let i = 0; i < n; i++) { const u = (i + .5) / n, p0 = A(u, .08), p1 = A(u, 1);
        tubes += `<path d="M${P2(p0)}L${P2(p1)}" stroke="#0e1a2e" stroke-width="6" stroke-linecap="round"/><path d="M${P2(p0)}L${P2(p1)}" stroke="${x.on ? "#2f5592" : "#1c2b4a"}" stroke-width="4" stroke-linecap="round"/><path d="M${f(p0[0] - 1.4)} ${f(p0[1])}L${f(p1[0] - 1.4)} ${f(p1[1])}" stroke="#fff" stroke-opacity="${x.on ? .55 : .25}" stroke-width=".9" stroke-linecap="round"/>`; }
      const h0 = A(0, 0), h1 = A(1, 0), b0 = A(0, 1), b1 = A(1, 1);
      const body = `<path d="M${P2(b0)}L${P2(b1)}L${f(b1[0] + 4)} ${f(b1[1] + 8)}L${f(b0[0] + 4)} ${f(b0[1] + 8)}Z" fill="#000" fill-opacity=".35"/>` + tubes +
        `<path d="M${P2(b0)}L${P2(b1)}" stroke="${M.steel(x)}" stroke-width="3"/>` +
        `<path d="M${f(h0[0] - 4)} ${f(h0[1] - 2)}L${f(h1[0] + 4)} ${f(h1[1] - 2)}L${f(h1[0] + 4)} ${f(h1[1] + 8)}L${f(h0[0] - 4)} ${f(h0[1] + 8)}Z" fill="${x.lg([[0, H.shade(c, .4)], [1, H.shade(c, -.3)]])}"/>` +
        pipe(SM ? sub(x, spump) : x, [h1[0] + 4, h1[1] + 3, 184, 62, 190, 80, 196, 100, 200, 120, 204, 140, 208, 160], 4, COP, HOT, 8) +
        glint(x, clipU(x, "ttube", `<path d="M${P2(A(0, 0))}L${P2(A(1, 0))}L${P2(A(1, 1))}L${P2(A(0, 1))}Z"/>`), 40, 58, 140, 100) +
        (SM && stp != null ? (() => { const str = String(Math.max(-99, Math.min(999, stp))), col = sst === "vacation" ? "#7dd3fc" : sst === "heating" || (sst == null && spump) ? "#ffb070" : "#e8eef4", w = 7 + str.length * 5, cx = 176, cy = 40;
          return `<path d="M${cx} ${cy + 5}L${f(h1[0] + 3)} ${f(h1[1] - 2)}" stroke="#2c2f36" stroke-width="1.6"/><rect x="${f(cx - w / 2 - 1)}" y="${cy - 6.5}" width="${f(w + 2)}" height="13" rx="2.4" fill="#2c2f36"/><rect x="${f(cx - w / 2)}" y="${cy - 5.5}" width="${f(w)}" height="11" rx="1.6" fill="#0b0e12"/>` +
            digits(always(x), cx + w / 2 - 2.5, cy - 3.5, 7, str, str.length, col); })() : "");
      return scene(x, back, body); }, { parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Idle"], ["heating", "Heating"], ["vacation", "Vacation"]], def: "heating" },
      { id: "pump", name: "Circulation pump" }, { id: "temp", name: "Water temperature", type: "value", unit: "°", min: 40, max: 180, def: 130 }] }),

    ic("jetpump", "Jet pump", sw(["#c0392b", "#2f6fb8", "#2c2f36", "#e8b81e", "#8e959e"], "#c0392b"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 170);
      const body = shadowE(x, 96, 176, 54, 6) +
        pipe(x, [8, 96, 30, 96, 40, 96, 52, 96], 6, "#2c2f36", COLD, 4) + pipe(x, [128, 74, 150, 74, 170, 60, 170, 6], 5, COP, COLD, 6) +
        `<path d="M54 118Q54 104 96 102Q138 104 138 118V164Q138 172 96 172Q54 172 54 164Z" fill="${x.lg([[0, "#9aa0a8"], [.3, "#ffffff"], [.6, "#e8eaed"], [1, "#8a9098"]], 0, 0, 1, 0)}"/>` +
        `<path d="M58 116Q96 106 134 116" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.2"/><rect x="88" y="94" width="16" height="10" fill="${M.metal(x, "#c9a24a")}"/>` +
        `<rect x="44" y="76" width="42" height="32" rx="10" fill="${x.lg([[0, H.shade(c, .35)], [.5, c], [1, H.shade(c, -.45)]])}"/>` + `<circle cx="66" cy="92" r="10" fill="${H.shade(c, -.2)}"/>` +
        `<rect x="84" y="72" width="44" height="34" rx="6" fill="${x.lg([[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.5)]])}"/>` +
        (() => { let s = ""; for (let i = 0; i < 6; i++) s += `<path d="M${90 + i * 6} 74V104" stroke="#000" stroke-opacity=".2" stroke-width="2"/>`; return s; })() +
        `<ellipse cx="128" cy="89" rx="5" ry="15" fill="${H.shade(c, -.3)}"/>` + fanCap(x, 129, 89, 4, H.shade(c, -.1)) +
        `<rect x="100" y="56" width="22" height="16" rx="2" fill="${M.v(x, "#8e959e")}"/><path d="M104 60H118" stroke="#000" stroke-opacity=".3"/>` +
        `<path d="M66 76V64" stroke="${M.metal(x, "#c9a24a")}" stroke-width="3"/>` + gauge(x, 66, 54, 11, x.on ? .3 + .55 * x.lv : .15);
      return scene(x, back, body); }),

    ic("centrifugal", "Centrifugal pump skid", sw(["#2f5fa8", "#2f8f5e", "#c0392b", "#8e959e", "#2c2f36"], "#2f5fa8"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 140) + concreteB(x, 140, "#7a7d83") + `<path d="M8 150H192" stroke="#e8c84a" stroke-opacity=".6" stroke-width="3" stroke-dasharray="10 6"/>`;
      const body = shadowE(x, 100, 166, 88, 7) +
        `<rect x="14" y="146" width="172" height="12" fill="${x.lg([[0, "#5a5f66"], [1, "#2a2c31"]])}"/><path d="M14 146.5H186" stroke="#fff" stroke-opacity=".35"/>` +
        pipe(x, [8, 120, 20, 120, 30, 120, 40, 120], 10, "#8e959e", COLD, 4) + pipe(x, [66, 92, 66, 60, 66, 40, 66, 6], 9, "#8e959e", COLD, 6) +
        `<rect x="36" y="110" width="8" height="22" rx="1" fill="${M.steel(x)}"/><rect x="58" y="88" width="16" height="6" rx="1" fill="${M.steel(x)}"/>` +
        `<circle cx="66" cy="120" r="24" fill="${M.s(x, c)}"/><path d="M44 120A22 22 0 0 1 66 98" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>` +
        `<rect x="60" y="136" width="14" height="10" fill="${M.v(x, c)}"/>` +
        `<rect x="88" y="110" width="28" height="18" rx="2" fill="${M.v(x, "#e8b81e")}"/>` + vents(92, 113, 20, 3, 4.4, .3) +
        `<rect x="116" y="96" width="62" height="46" rx="10" fill="${x.lg([[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.5)]])}"/>` +
        (() => { let s = ""; for (let i = 0; i < 9; i++) s += `<path d="M${122 + i * 6} 98V140" stroke="#000" stroke-opacity=".22" stroke-width="2"/>`; return s; })() +
        `<rect x="134" y="86" width="22" height="12" rx="2" fill="${M.v(x, H.shade(c, -.1))}"/><rect x="124" y="140" width="46" height="6" fill="${M.v(x, H.shade(c, -.3))}"/>` +
        `<ellipse cx="178" cy="119" rx="5" ry="20" fill="${H.shade(c, -.35)}"/>` + fanCap(x, 179, 119, 5, H.shade(c, -.15)) +
        gauge(x, 66, 72, 7, x.on ? .35 + .5 * x.lv : .05) + led(x, 150, 92, 1, "#3ee08f");
      return scene(x, back, body); }),

    ic("ctmeter", "Panel energy meter", sw(["#eef0f2", "#2c2f36", "#8e959e", "#c9b99a"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "garage", 8, 192);
      let brk = ""; for (let i = 0; i < 7; i++) for (const bx of [64, 104]) brk += `<rect x="${bx}" y="${84 + i * 13}" width="32" height="11" rx="1.5" fill="${M.v(x, "#2c2f36")}"/><rect x="${bx + (bx < 100 ? 20 : 4)}" y="${86.5 + i * 13}" width="8" height="6" rx="1" fill="${M.v(x, "#1a1b1f")}"/>`;
      const kw = (x.on ? x.lv * 9.9 : 0).toFixed(1).replace(".", "");
      const clamp = (cx, cy) => `<rect x="${cx - 9}" y="${cy - 8}" width="18" height="16" rx="5" fill="${M.v(x, "#1d1e22")}"/><path d="M${cx - 4} ${cy}H${cx + 4}" stroke="#3a3d44" stroke-width="2"/>`;
      const body = `<rect x="26" y="14" width="148" height="178" rx="3" fill="${x.lg([[0, "#9aa1aa"], [1, "#6c727a"]])}"/><rect x="34" y="22" width="132" height="170" fill="${x.lg([[0, "#d5d9de"], [1, "#b0b5bc"]])}"/>` +
        `<path d="M76 8C78 30 80 40 82 54M124 8C122 30 120 40 118 54" fill="none" stroke="#111" stroke-width="7"/>` + `<rect x="70" y="54" width="60" height="18" rx="2" fill="${M.steel(x)}"/>` +
        clamp(80, 34) + clamp(121, 34) + `<rect x="62" y="78" width="76" height="98" fill="#2a2c31" fill-opacity=".2"/>` + brk + `<rect x="98" y="78" width="4" height="98" fill="${M.steel(x)}"/>` +
        cord(x, [86, 34, 100, 36, 140, 40, 148, 56, 150, 64, 150, 70, 150, 76], 1.6, "#e8e6dc", x.on ? GREEN : null, 7) + cord(x, [127, 34, 140, 30, 156, 36, 158, 56, 158, 64, 158, 70, 158, 76], 1.6, "#e8e6dc", x.on ? GREEN : null, 7) +
        box(x, 140, 76, 24, 40, 3, 2, 2, c) + lcd(x, 143, 82, 18, 10, "#7ee7ff") + digits(x, 160, 84, 6, kw, 2, "#bdf3ff") + (x.on ? `<rect x="151.4" y="89" width="1" height="1" fill="#bdf3ff"/>` : "") +
        (x.on ? `<g class="${P}blink">${led(x, 147, 100, 1, "#3ee08f")}</g>` : led(x, 147, 100, 1, "#3ee08f")) + led(x, 155, 100, 1, "#4da3ff", .6) + `<rect x="150" y="62" width="2" height="14" fill="#2a2c31"/>`;
      return scene(x, back, body); }),

    ic("barrel", "Barrel sauna", sw(WOOD, "#c8925a"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = skyB(x, 132, true) + treeLine(x, 132, "#2f5a33") + grassB(x, 132, "#4b7536", 51);
      let staves = ""; for (let i = 1; i < 12; i++) { const y = 112 - 54 * Math.cos(i * Math.PI / 12); staves += `<path d="M80 ${f(y)}H160" stroke="#2a180b" stroke-opacity=".35" stroke-width=".9"/>`; }
      const glow = x.on ? x.rg([[0, "#ffb347"], [.6, "#c8501a"], [1, "#401a0a"]], .5, .8, .8) : x.lg([[0, "#2a3038"], [1, "#11141a"]]);
      const body = shadowE(x, 120, 170, 76, 7) + `<path d="M96 160L104 172H86Z" fill="#2a1a10"/><path d="M150 160L158 172H140Z" fill="#2a1a10"/>` +
        pipe(x, [140, 58, 140, 40, 140, 30, 140, 18], 6, "#9aa1aa") + `<path d="M132 18H148L144 12H136Z" fill="${M.steel(x)}"/>` + (x.on ? steam(x, 140, 12, 2, .3) : "") +
        `<path d="M80 58H160A28 54 0 0 1 160 166H80Z" fill="${x.lg([[0, H.shade(c, -.25)], [.25, H.shade(c, .2)], [.6, c], [1, H.shade(c, -.45)]])}"/>` + staves +
        `<path d="M76 62Q118 44 160 58A28 54 0 0 1 162 66H80Z" fill="#2a2c31"/>` +
        [112, 146].map((bx) => `<path d="M${bx} 58A28 54 0 0 1 ${bx} 166" fill="none" stroke="#1d1e22" stroke-width="2"/>`).join("") +
        `<ellipse cx="80" cy="112" rx="48" ry="54" fill="${x.lg([[0, H.shade(c, .25)], [1, H.shade(c, -.15)]], 0, 0, 1, 0)}"/>` +
        (() => { let s = ""; for (let i = 1; i < 10; i++) { const bx = 32 + i * 9.6, h = 54 * Math.sqrt(Math.max(0, 1 - Math.pow((bx - 80) / 48, 2))); s += `<path d="M${f(bx)} ${f(112 - h)}V${f(112 + h)}" stroke="#2a180b" stroke-opacity=".25" stroke-width=".8"/>`; } return s; })() +
        `<ellipse cx="80" cy="112" rx="48" ry="54" fill="none" stroke="${H.shade(c, -.4)}" stroke-width="3"/>` +
        `<rect x="62" y="70" width="36" height="92" rx="4" fill="${H.shade(c, -.35)}"/><rect x="65" y="73" width="30" height="86" rx="3" fill="${glow}"/>` +
        (x.on ? `<rect x="70" y="134" width="20" height="18" rx="2" fill="#2a2b2f"/>` + [0, 1, 2, 3, 4].map((i) => `<circle cx="${73 + i * 3.6}" cy="${133 - (i % 2) * 2}" r="2.4" fill="${H.mix("#6c6f75", "#ff8a3a", .3 * x.lv)}"/>`).join("") + `<g clip-path="${clipU(x, "bd", `<rect x="65" y="73" width="30" height="86" rx="3"/>`)}">${steam(x, 80, 128, 2, .4)}</g>` : "") +
        `<path d="M68 76L80 76L70 154H68Z" fill="#fff" fill-opacity=".14"/><rect x="90" y="110" width="3" height="16" rx="1.5" fill="${H.shade(c, -.5)}"/>`;
      return scene(x, back, body); }, { glow: { x: .4, y: .58, r: .6 }, cast: "around" }),

    ic("cabin", "Cabin sauna", sw(WOOD, "#e0c08a"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 176) + tileFloor(x, 176);
      const inner = boards(x, 62, 34, 76, 136, H.shade(c, -.1), 7.6);
      const benches = [104, 138].map((y, i) => `<rect x="62" y="${y}" width="76" height="6" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, -.25)]])}"/><rect x="62" y="${y + 6}" width="76" height="3" fill="#000" fill-opacity=".3"/><rect x="66" y="${y + 9}" width="4" height="${i ? 22 : 34}" fill="${H.shade(c, -.35)}"/>`).join("");
      const heater = `<rect x="112" y="142" width="22" height="28" rx="2" fill="${M.v(x, "#3a3d44")}"/>` + vents(115, 152, 16, 3, 5) +
        `<path d="M110 142Q123 128 136 142Z" fill="#000" fill-opacity=".2"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${113 + (i % 3) * 8}" cy="${140 - Math.floor(i / 3) * 4}" r="4" fill="${x.rg([[0, H.mix("#9aa0a8", "#ff8a3a", x.on ? .45 * x.lv : 0)], [1, "#3a3d44"]], .4, .35, .7)}"/>`).join("") +
        (x.on ? `<rect x="112" y="144" width="22" height="3" fill="#ff5a2a" opacity="${a2(.5 + .5 * x.lv)}"/>` : "");
      const body = shadowE(x, 100, 182, 82, 6) +
        boards(x, 26, 22, 148, 158, c, 10) + `<rect x="22" y="16" width="156" height="10" rx="2" fill="${M.v(x, H.shade(c, -.2))}"/>` +
        `<rect x="58" y="30" width="84" height="144" rx="2" fill="${H.shade(c, -.45)}"/>` +
        `<g clip-path="${clipU(x, "cab", `<rect x="62" y="34" width="76" height="136"/>`)}">${inner}${benches}${heater}` +
        (x.on ? `<rect x="62" y="34" width="76" height="136" fill="${x.rg([[0, "#ff9a4a", .7], [1, "#ff6a1a", .1]], .75, .85, .9)}" opacity="${a2(.5 + .5 * x.lv)}"/>` + steam(x, 123, 128, 2, .45) +
        `<rect x="70" y="38" width="20" height="3" rx="1.5" fill="#ffe2a0"/><ellipse cx="80" cy="44" rx="22" ry="6" fill="${M.halo(x, "#ffd27a")}" opacity=".7"/>` : "") +
        `<rect x="62" y="34" width="76" height="136" fill="${x.lg([[0, "#3a2a1e", .25], [1, "#3a2a1e", .1]])}"/><path d="M66 38L90 38L68 166H66Z" fill="#fff" fill-opacity=".14"/></g>` +
        `<rect x="128" y="86" width="5" height="34" rx="2.5" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, -.4)]], 0, 0, 1, 0)}"/>` +
        lcd(x, 150, 70, 18, 10, "#ff8a3a") + digits(x, 166, 72, 6, Math.round(60 + 30 * x.lv), 2, "#ffd9a0");
      return scene(x, back, body); }, { glow: { x: .6, y: .72, r: .6 }, cast: "around" }),
  ];

  const css = `
.hda-heating-flow{opacity:0}
.hda-anim .hda-heating-flow{animation:hda-heating-flow 1.6s linear infinite}
@keyframes hda-heating-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-heating-pulse{animation:hda-heating-pulse 2.6s ease-in-out infinite}
@keyframes hda-heating-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-heating-blink{animation:hda-heating-blink 1.1s ease-in-out infinite}
@keyframes hda-heating-blink{0%,100%{opacity:1}50%{opacity:.15}}
.hda-heating-sweepx,.hda-heating-sweepy{transform-box:fill-box}
.hda-anim .hda-heating-sweepx{animation:hda-heating-sx 2.2s linear infinite}
.hda-anim .hda-heating-sweepy{animation:hda-heating-sy 2.2s linear infinite}
@keyframes hda-heating-sx{0%{transform:translate(0,0)}100%{transform:translate(400%,0)}}
@keyframes hda-heating-sy{0%{transform:translate(0,0)}100%{transform:translate(0,-400%)}}
.hda-heating-spin,.hda-heating-spinslow{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-heating-spin{animation:hda-heating-spin .6s linear infinite}
.hda-anim .hda-heating-spinslow{animation:hda-heating-spin 24s linear infinite}
@keyframes hda-heating-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.hda-heating-flick{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-heating-flick{animation:hda-heating-flick .9s ease-in-out infinite alternate}
@keyframes hda-heating-flick{0%{transform:scale(1,1)}50%{transform:scale(.9,1.12)}100%{transform:scale(1.06,.9)}}
.hda-heating-steam{transform-box:fill-box}
.hda-anim .hda-heating-steam{animation:hda-heating-steam 2.4s ease-out infinite}
@keyframes hda-heating-steam{0%{transform:translate(0,6px);opacity:0}30%{opacity:1}100%{transform:translate(0,-16px);opacity:0}}
.hda-heating-heat{transform-box:fill-box}
.hda-anim .hda-heating-heat{animation:hda-heating-heat 1.8s ease-in-out infinite}
@keyframes hda-heating-heat{0%{transform:translate(0,4px);opacity:0}40%{opacity:1}100%{transform:translate(0,-10px);opacity:0}}
.hda-anim .hda-heating-glint{animation:hda-heating-glint 7s ease-in-out infinite alternate}
@keyframes hda-heating-glint{0%{transform:translate(-36px,0)}100%{transform:translate(70px,0)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-heating-flow,.hda-anim .hda-heating-pulse,.hda-anim .hda-heating-blink,.hda-anim .hda-heating-sweepx,.hda-anim .hda-heating-sweepy,.hda-anim .hda-heating-spin,.hda-anim .hda-heating-spinslow,.hda-anim .hda-heating-flick,.hda-anim .hda-heating-steam,.hda-anim .hda-heating-heat,.hda-anim .hda-heating-glint{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "heating", tab: "Heating & utility room", group: "Utility", kind: "device",
    intro: "Twenty heaters, boilers, radiators, pumps, tanks and saunas in real utility rooms, basements and yards. On means running: flames and glow, pumps spin, hot and cold flow moves in the pipes, saunas steam. The slider is the output: flame height, gauges, flow meters and segment displays follow it.",
    
    levelLabel: "Output", onWord: "Running", offWord: "Off",
    css, icons,
  });
})();
