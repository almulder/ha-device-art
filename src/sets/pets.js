(function () {
  const H = window.HDAH, P = "hda-pets-";
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
  const lvlCol = (x, c) => x.lv < .2 ? "#ff5a4f" : x.lv < .4 ? "#ffb347" : c;
  const clipU = (x, key, shape) => x.def("c" + key, (id) => `<clipPath id="${id}">${shape}</clipPath>`);
  function segBar(x, x0, y0, w, h, n, col) {
    col = lvlCol(x, col || GREEN);
    const lit = x.lv > .01 ? Math.max(1, Math.round(x.lv * n)) : 0, g = w * .05, sw2 = (w - g * (n - 1)) / n;
    let s = `<rect x="${f(x0 - 1.2)}" y="${f(y0 - 1.2)}" width="${f(w + 2.4)}" height="${f(h + 2.4)}" rx="2" fill="#06070a"/>`;
    if (x.on) s = `<g class="${P}pulse"><rect x="${f(x0 - 5)}" y="${f(y0 - 5)}" width="${f(w + 10)}" height="${f(h + 10)}" rx="6" fill="${M.halo(x, col)}" opacity="${a2(.5 * x.L)}"/></g>` + s;
    for (let i = 0; i < n; i++) { const L = i < lit, tip = x.on && i === lit - 1;
      s += `<rect${tip ? ` class="${P}blink"` : ""} x="${f(x0 + i * (sw2 + g))}" y="${f(y0)}" width="${f(sw2)}" height="${f(h)}" rx="${f(Math.min(sw2, h) * .3)}" fill="${L ? (x.on ? H.mix(col, "#fff", .2) : H.mix(col, "#15161b", .45)) : "#1d2027"}"/>`; }
    return s;
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
  function kickB(x, y, col) {
    col = col || "#ece8e0";
    return `<rect x="8" y="${y - 8}" width="184" height="8" fill="${x.lg([[0, H.shade(col, .1)], [1, H.shade(col, -.3)]])}"/><path d="M8 ${y - 7.5}H192" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>`;
  }
  function grassB(x, y0, col, seed) {
    col = col || "#4b7536"; const r = rnd(seed || 19); let s = `<rect x="8" y="${f(y0)}" width="184" height="${f(192 - y0)}" fill="${x.lg([[0, H.shade(col, -.25)], [1, H.shade(col, .08)]])}"/>`;
    for (let i = 0; i < 90; i++) { const gx = 8 + r() * 184, gy = y0 + 3 + r() * (192 - y0), hh = 2 + r() * 4 * (gy - y0 + 20) / 80;
      s += `<path d="M${f(gx)} ${f(gy)}l${f(r() * 2 - 1)} ${f(-hh)}" stroke="${r() > .5 ? H.shade(col, .35) : H.shade(col, -.35)}" stroke-width=".9" stroke-linecap="round"/>`; }
    return s;
  }
  const skyB = (x, y1) => `<rect x="8" y="8" width="184" height="${f(y1 - 8)}" fill="${x.lg([[0, "#3d78c2"], [1, "#bcdcf2"]])}"/>`;
  function treeLine(x, y, col) {
    col = col || "#2f5a33"; const r = rnd(5); let s = "";
    for (let i = 0; i < 14; i++) { const cx = 4 + i * 15 + r() * 6, rr = 9 + r() * 8;
      s += `<circle cx="${f(cx)}" cy="${f(y - rr * .4)}" r="${f(rr)}" fill="${H.mix(col, "#9fbfdc", .2 + r() * .2)}"/>`; }
    return s + `<rect x="8" y="${f(y - 2)}" width="184" height="8" fill="${H.mix(col, "#9fbfdc", .25)}"/>`;
  }
  const steelBowl = (x, cx, cy, rx) => `<path d="M${f(cx - rx)} ${f(cy)}Q${f(cx - rx + 2)} ${f(cy + 13)} ${f(cx)} ${f(cy + 14)}Q${f(cx + rx - 2)} ${f(cy + 13)} ${f(cx + rx)} ${f(cy)}Z" fill="${M.steel(x)}"/>
<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(rx * .26)}" fill="${x.lg([[0, "#f2f4f7"], [1, "#8a9098"]])}"/><ellipse cx="${f(cx)}" cy="${f(cy + .6)}" rx="${f(rx - 3)}" ry="${f(rx * .26 - 2)}" fill="${x.lg([[0, "#4a4f57"], [1, "#b9bfc7"]])}"/>`;
  const kib = (cx, cy, r, i) => { const t = ["#8a5a2e", "#a8723c", "#6e4421", "#b8854a"][i % 4];
    return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(r)}" ry="${f(r * .75)}" fill="${t}"/><ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" rx="${f(r * .35)}" ry="${f(r * .22)}" fill="#fff" fill-opacity=".3"/>`; };
  const tball = (x, cx, cy, r) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, "#f3ff8a"], [.6, "#cde43a"], [1, "#8eaa16"]], .38, .34, .7)}"/>
<path d="M${f(cx - r * .9)} ${f(cy - r * .3)}Q${f(cx)} ${f(cy + r * .2)} ${f(cx + r * .3)} ${f(cy - r * .95)}M${f(cx - r * .2)} ${f(cy + r * .95)}Q${f(cx + r * .1)} ${f(cy + r * .1)} ${f(cx + r * .95)} ${f(cy + r * .1)}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="${f(r * .18)}"/>`;

  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label, render }, extra || {});
  const BODY = ["#eef0f2", "#2c2f36", "#9fc5b8", "#e8c9a6", "#8fb4d9"];
  // (multi-function) o.parts holds only the parts the owner ticked. A part left out follows the one device as a Device
  // Image (no o.mf, as today) and stays off / closed / blank, never animated, as a Multi-Function Image (o.mf). A value
  // part's reading is o.pval[id] (a number), a stage part's value o.pval[id] (one of its stage ids). Pieces that exist
  // only as parts (the aquarium's heater and thermometer, the pet door's mode arrows) are drawn only when o.mf.
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    on: (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on),
    val: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" && isFinite(+o.pval[k]) ? Math.round(+o.pval[k]) : null),
    st: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" ? String(o.pval[k]) : null),
    as: (o, k) => Object.assign({}, o, { on: MF.on(o, k) }),
  };
  const lit = (x, k) => Object.assign({}, x, { on: true, L: k == null ? .8 : k });

  const icons = [
    ic("feeder", "Automatic feeder", sw(BODY, "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "cream", 8, 130) + kickB(x, 130) + tileFloor(x, 130);
      const wy0 = 50, wh = 54, fh = wh * x.lv, cp = clipU(x, "win", `<rect x="80" y="${wy0}" width="40" height="${wh}" rx="8"/>`);
      let k = ""; const r = rnd(7);
      for (let yy = wy0 + wh - 3; yy > wy0 + wh - fh - 2; yy -= 3.6) for (let xx = 80; xx < 122; xx += 4.4) k += kib(xx + r() * 2.4, yy + r() * 1.6, 2.3, Math.floor(r() * 4));
      let fall = "";
      if (x.on) for (let i = 0; i < 4; i++) fall += `<g class="${P}drop" style="animation-delay:${(-i * .32).toFixed(2)}s">${kib(96 + i * 2.4, 136, 2.1, i)}</g>`;
      const body = `<ellipse cx="100" cy="164" rx="50" ry="7" fill="#000" fill-opacity=".38"/>` +
        box(x, 68, 40, 64, 114, 16, 3, 4, c) + `<rect x="66" y="32" width="68" height="16" rx="8" fill="${M.v(x, H.shade(c, -.08))}"/><path d="M72 35H128" stroke="#fff" stroke-opacity=".5"/>` +
        `<rect x="79" y="${wy0 - 1}" width="42" height="${wh + 2}" rx="9" fill="${H.shade(c, -.35)}"/><rect x="80" y="${wy0}" width="40" height="${wh}" rx="8" fill="${x.lg([[0, "#20242a"], [1, "#333840"]])}"/>` +
        `<g clip-path="${cp}">${k}</g>` +
        `<path d="M84 ${wy0 + 4}L96 ${wy0 + 4}L86 ${wy0 + wh - 4}H84Z" fill="#fff" fill-opacity=".14"/><rect x="80" y="${wy0}" width="40" height="${wh}" rx="8" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
        `<rect x="84" y="110" width="32" height="11" rx="5.5" fill="${x.lg([[0, "#0f1115"], [1, "#272a31"]])}"/>` + led(x, 92, 115.5, 1.2, lvlCol(x, "#7ee7ff")) + button(x, 107, 115.5, 3, "#d5d9de") +
        `<rect x="88" y="127" width="24" height="8" rx="3" fill="#0b0c10"/><path d="M88 135H112" stroke="#fff" stroke-opacity=".3"/>` +
        fall + steelBowl(x, 100, 150, 28) + kib(96, 150, 2.4, 0) + kib(101, 149, 2.4, 1) + (x.on ? kib(105, 151, 2.4, 2) + kib(99, 152, 2.3, 3) + kib(92, 151, 2.2, 1) : "");
      return scene(x, back, body); }),

    ic("fountain", "Water fountain", sw(["#eef0f2", "#7fc8c2", "#f2b8c6", "#2c2f36", "#c9b99a"], "#7fc8c2"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "blue", 8, 118) + baseB(x, 118, "#8a6142");
      const water = x.lg([[0, "#9ad8f2"], [.6, "#3f93c2"], [1, "#22648c"]]);
      let flow = "";
      if (x.on) { const dur = (1.6 - x.lv).toFixed(2);
        flow = `<path d="M85 131Q85 113 100 108Q115 113 115 131Z" fill="#bfe8ff" fill-opacity=".35"/>` +
          ["M100 104Q89 109 86 130", "M100 104Q111 109 114 130", "M100 104Q95 112 94 131", "M100 104Q105 112 106 131"].map((d, i) =>
            `<path class="${P}stream" d="${d}" fill="none" stroke="#e6f7ff" stroke-opacity=".85" stroke-width="1.4" stroke-dasharray="3 5" stroke-linecap="round" style="animation-duration:${dur}s;animation-delay:${(-i * .2).toFixed(1)}s"/>`).join("") +
          `<ellipse cx="100" cy="103" rx="6" ry="3" fill="#d8f3ff"/>` +
          [0, 1, 2].map((i) => `<ellipse class="${P}ripple" cx="100" cy="133" rx="40" ry="7.5" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" style="animation-delay:${(-i * .8).toFixed(1)}s"/>`).join(""); }
      const body = `<ellipse cx="100" cy="166" rx="70" ry="10" fill="${x.lg([[0, "#6f747c"], [1, "#4a4e55"]])}"/><ellipse cx="100" cy="167" rx="58" ry="6" fill="#000" fill-opacity=".35"/>` +
        `<path d="M46 132Q48 162 100 166Q152 162 154 132Z" fill="${M.h(x, c)}"/><path d="M46 132Q48 162 100 166Q152 162 154 132Z" fill="${M.gloss(x)}" opacity=".35"/>` +
        `<ellipse cx="100" cy="132" rx="54" ry="12" fill="${x.lg([[0, H.shade(c, .5)], [1, H.shade(c, -.2)]])}"/>` +
        `<ellipse cx="100" cy="133" rx="48" ry="9.5" fill="${water}"/><path d="M60 131Q80 126 100 126" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>` +
        `<path d="M84 132Q84 112 100 107Q116 112 116 132Z" fill="${M.steel(x)}"/><ellipse cx="100" cy="106" rx="9" ry="3" fill="${x.lg([[0, "#f2f4f7"], [1, "#8a9098"]])}"/>` +
        flow +
        `<rect x="91" y="145" width="18" height="12" rx="3" fill="#0d1a24"/><rect x="92.5" y="${f(146.5 + 9 * (1 - x.lv))}" width="15" height="${f(Math.max(.6, 9 * x.lv))}" rx="2" fill="${water}"/><path d="M93 147H95" stroke="#fff" stroke-opacity=".6"/>` +
        led(x, 128, 151, 1.2, lvlCol(x, "#7ee7ff"));
      return scene(x, back, body); }),

    ic("litter", "Self-cleaning litter", sw(["#eef0f2", "#2c2f36", "#8e959e", "#c9b99a", "#6d8fb3"], "#eef0f2"), "Body", (o) => {
      // (parts) State: cycling turns the drum (as on today); ready = a green light, full = amber (the drawer handle too),
      // error = a blinking red light; left out = the drum still, the light off
      const st = o.mf ? MF.st(o, "state") : null, x = X(o.mf ? Object.assign({}, o, { on: st === "cycling" }) : o), c = o.color;
      const scol = { ready: GREEN, cycling: "#7ee7ff", full: "#ffb547", error: "#ff5a4f" }[st];
      const back = wallB(x, "lav", 8, 142) + baseB(x, 142, "#8a6142");
      const cp = clipU(x, "open", `<circle cx="96" cy="100" r="30"/>`);
      let ribs = `<circle cx="96" cy="100" r="44" fill="none"/>`;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ribs += `<path d="M${f(96 + Math.cos(a) * 10)} ${f(100 + Math.sin(a) * 10)}L${f(96 + Math.cos(a) * 44)} ${f(100 + Math.sin(a) * 44)}" stroke="#fff" stroke-opacity=".14" stroke-width="5"/>`; }
      const tilt = x.on ? -14 : 0;
      const body = `<ellipse cx="100" cy="174" rx="70" ry="7" fill="#000" fill-opacity=".38"/>` +
        `<circle cx="102" cy="98" r="55" fill="#000" fill-opacity=".25"/><circle cx="100" cy="94" r="54" fill="${M.s(x, c)}"/>` +
        `<path d="M58 70A50 50 0 0 1 118 44" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>` +
        `<circle cx="96" cy="100" r="33" fill="${H.shade(c, -.32)}"/><circle cx="96" cy="100" r="30" fill="${x.rg([[0, "#3a3d44"], [1, "#101115"]], .5, .35, .7)}"/>` +
        `<g clip-path="${cp}"><g transform="rotate(${tilt} 96 100)"><path d="M60 112Q96 104 132 112V140H60Z" fill="${x.lg([[0, "#d8ccb4"], [1, "#a8987c"]])}"/>` + dots(17, 40, 66, 108, 60, 20, .8, .3) + `</g>` +
        (x.on ? `<g class="${P}spin" style="animation-duration:${(5 - 3 * x.lv).toFixed(2)}s">${ribs}</g>` : "") + `</g>` +
        `<path d="M70 86A30 30 0 0 1 112 74" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>` +
        (x.on ? `<path class="${P}pulse" d="M80 46Q100 41 120 46" fill="none" stroke="#7ee7ff" stroke-opacity="${a2(.5 + .5 * x.L)}" stroke-width="3" stroke-linecap="round"/>` : `<path d="M80 46Q100 41 120 46" fill="none" stroke="${H.shade(c, -.3)}" stroke-width="3" stroke-linecap="round"/>`) +
        box(x, 38, 140, 124, 30, 10, 0, 3, H.shade(c, -.12)) + `<path d="M50 156H150" stroke="#000" stroke-opacity=".3"/><rect x="88" y="159" width="24" height="4" rx="2" fill="${st === "full" ? "#ffb547" : H.shade(c, -.45)}"/>` +
        button(x, 140, 148, 3, "#d5d9de") + (!o.mf ? led(x, 130, 148, 1.1, "#7ee7ff") : !scol ? led(Object.assign({}, x, { on: false }), 130, 148, 1.1, "#7ee7ff") :
          st === "error" ? `<g class="${P}blink">${led(lit(x), 130, 148, 1.1, scol)}</g>` : led(lit(x), 130, 148, 1.1, scol));
      return scene(x, back, body); }, { parts: [{ id: "state", name: "State", type: "stage", values: [["ready", "Ready"], ["cycling", "Cycling"], ["full", "Drawer full"], ["error", "Error"]], def: "ready" }] }),

    ic("door", "Smart pet door", sw(["#eef0f2", "#2c2f36", "#8a6142", "#9aa1aa", "#c9b99a"], "#eef0f2"), "Body", (o) => {
      // (parts) Mode: locked = the latch bar, a red light and a shut padlock; in / out / both = unlocked, arrows on the
      // display show the way; left out = unlocked, no arrows. Flap (contact): open = the flap swung up (a pet going through).
      const md = o.mf ? MF.st(o, "mode") : null, x = X(o.mf ? Object.assign({}, o, { on: md !== "locked" }) : o), c = o.color, fo = o.mf && MF.on(o, "flap");
      const wood = "#7d5a3e";
      const back = `<rect x="8" y="8" width="184" height="168" fill="${x.lg([[0, H.shade(wood, .1)], [1, H.shade(wood, -.25)]], 0, 0, 1, 0)}"/>` +
        `<rect x="28" y="16" width="144" height="58" rx="3" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/><rect x="30" y="18" width="140" height="54" rx="2" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/>` +
        `<rect x="34" y="22" width="132" height="46" fill="${x.lg([[0, "#fff", .06], [1, "#000", .1]])}"/>` + woodB(x, 176, "#5d4330");
      const cp = clipU(x, "tun", `<rect x="68" y="98" width="64" height="62" rx="6"/>`);
      const flap = `<rect x="70" y="100" width="60" height="58" rx="5" fill="${x.lg([[0, "#3b4654"], [1, "#1c232d"]])}" fill-opacity=".72"/><path d="M74 104L92 104L78 152H74Z" fill="#fff" fill-opacity=".14"/><rect x="70" y="100" width="60" height="5" rx="2" fill="#15181d"/>`;
      const body = `<ellipse cx="100" cy="176" rx="50" ry="4" fill="#000" fill-opacity=".35"/>` +
        box(x, 56, 86, 88, 86, 12, 2, 3, c) +
        `<rect x="66" y="96" width="68" height="66" rx="7" fill="${H.shade(c, -.4)}"/>` +
        `<g clip-path="${cp}"><rect x="68" y="98" width="64" height="62" fill="${x.lg([[0, "#9ccbe8"], [.55, "#cfe6c4"], [.56, "#5d8a46"], [1, "#3f6a30"]])}"/>` +
        (o.mf ? (fo ? `<g transform="translate(0 100) scale(1 .42) translate(0 -100)">${flap}</g>` : flap) : `<g class="${x.on ? P + "swing" : ""}">${flap}</g>`) + `</g>` +
        (x.on ? "" : `<rect x="74" y="153" width="52" height="5" rx="2.5" fill="${M.steel(x)}"/><rect x="74" y="153" width="52" height="5" rx="2.5" fill="none" stroke="#000" stroke-opacity=".3"/>`) +
        box(x, 80, 72, 40, 18, 7, 2, 2, c) +
        `<rect x="86" y="77" width="28" height="8" rx="4" fill="#0e1014"/>` + led(x.on ? x : Object.assign({}, x, { on: true, L: .7 }), 92, 81, 1.4, x.on ? GREEN : "#ff5a4f") +
        (x.on ? `<path d="M104 83V80A3 3 0 0 1 110 79" fill="none" stroke="#bff5d6" stroke-width="1.2"/><rect x="103" y="80.5" width="5" height="3.5" rx=".8" fill="#bff5d6"/>`
          : `<path d="M104 80V78.5A2.4 2.4 0 0 1 109 78.5V80" fill="none" stroke="#ffb3ae" stroke-width="1.2"/><rect x="103" y="80" width="7" height="4" rx=".8" fill="#ffb3ae"/>`) +
        (md && md !== "locked" ? `<rect x="84" y="162.5" width="32" height="7" rx="3.5" fill="#0e1014"/>` +
          (md === "in" || md === "both" ? `<path d="M88 166H97M94.5 164L97 166L94.5 168" fill="none" stroke="#bff5d6" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>` : "") +
          (md === "out" || md === "both" ? `<path d="M112 166H103M105.5 164L103 166L105.5 168" fill="none" stroke="#bff5d6" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>` : "") : "");
      return scene(x, back, body); }, { parts: [{ id: "mode", name: "Mode", type: "stage", values: [["both", "In & out"], ["in", "In only"], ["out", "Out only"], ["locked", "Locked"]], def: "both" }, { id: "flap", name: "Flap", type: "contact" }] }),

    ic("treatcam", "Treat camera", sw(["#eef0f2", "#2c2f36", "#9fc5b8", "#f2c6a8", "#8e959e"], "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "sage", 8, 126) + baseB(x, 126, "#7a5638");
      const treat = (cx, cy) => `<path d="M${f(cx - 3.4)} ${f(cy - 1.2)}h6.8a1.6 1.6 0 1 1 0 2.4h-6.8a1.6 1.6 0 1 1 0-2.4z" fill="#b97a3f"/><path d="M${f(cx - 3)} ${f(cy - .8)}h6" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`;
      const body = `<ellipse cx="100" cy="160" rx="44" ry="6" fill="#000" fill-opacity=".4"/>` +
        (x.on ? `<path d="M86 122Q60 92 34 128" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.2" stroke-dasharray="2 3"/>` : "") +
        box(x, 64, 44, 72, 112, 20, 3, 4, c) +
        `<rect x="70" y="52" width="60" height="46" rx="16" fill="${x.lg([[0, "#272a31"], [1, "#0a0b0e"]])}"/><path d="M76 58Q100 50 124 58" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.6" stroke-linecap="round"/>` +
        `<circle cx="100" cy="75" r="13" fill="#2c2f36"/><circle cx="100" cy="75" r="10" fill="${x.rg([[0, "#4f6fa8"], [.4, "#1a2440"], [1, "#05070c"]], .4, .38, .6)}"/><circle cx="100" cy="75" r="4" fill="#06080d"/><circle cx="96.5" cy="71.5" r="2.4" fill="#fff" fill-opacity=".6"/>` +
        [0, 1, 2, 3].map((i) => `<circle cx="${80 + (i % 2) * 40}" cy="${63 + Math.floor(i / 2) * 24}" r="1.2" fill="#3a1a1a"/>`).join("") +
        (x.on ? `<g class="${P}blink">${led(x, 120, 61, 1.3, "#ff3b3b")}</g>` : led(x, 120, 61, 1.3, "#ff3b3b")) +
        [0, 1, 2, 3, 4].map((i) => `<circle cx="${92 + i * 4}" cy="106" r=".9" fill="${H.shade(c, -.5)}"/>`).join("") +
        `<ellipse cx="100" cy="127" rx="16" ry="9" fill="${H.shade(c, -.38)}"/><ellipse cx="100" cy="128" rx="14" ry="7.5" fill="#0d0e11"/>` + treat(96, 131) + treat(104, 132) +
        (x.on ? [0, 1].map((i) => `<g class="${P}toss" style="animation-delay:${(-i * 1.1).toFixed(1)}s">${treat(90, 124)}</g>`).join("") : "") +
        `<rect x="88" y="146" width="24" height="3" rx="1.5" fill="${H.shade(c, -.25)}"/>`;
      return scene(x, back, body); }),

    ic("aquarium", "Aquarium", sw(["#bfe3ff", "#ffffff", "#7ad3ff", "#c4a8ff", "#ffd8a8", "#7ef0c0"], "#bfe3ff"), "Light", (o) => {
      // (parts) Light = the hood light and its rays, Filter = the bubbles, Heater = a glass heater in the back corner (glows
      // orange when on), Temperature = a stick-on thermometer on the glass; heater and thermometer only when ticked (o.mf)
      const x = X(MF.as(o, "light")), c = o.color, xf = MF.as(o, "filter"), hh = o.mf && MF.has(o, "heater"), ho = hh && MF.on(o, "heater"), wt = o.mf ? MF.val(o, "temp") : null;
      const back = wallB(x, "navy", 8, 192);
      const top = x.on ? H.mix(H.mix(c, "#1a6a96", .5), "#0c2a3d", 1 - x.lv * .8) : "#0f1c26", bot = x.on ? "#0b2638" : "#070e14";
      const cp = clipU(x, "tank", `<rect x="26" y="50" width="148" height="90"/>`);
      const fish = (cx, cy, s, col, dur, dl, flip) => `<g class="${P}swim" style="animation-duration:${dur}s;animation-delay:${dl}s"><g transform="translate(${cx} ${cy}) scale(${flip ? -s : s} ${s})">
<path d="M-9 0C-5 -6 5 -6 9 0C5 6 -5 6 -9 0Z" fill="${x.lg([[0, H.shade(col, .4)], [1, H.shade(col, -.3)]])}"/><path d="M-8 0L-15 -5L-13 0L-15 5Z" fill="${H.shade(col, -.15)}"/><path d="M-1 -4L3 -8L5 -4Z" fill="${H.shade(col, -.2)}"/>
<path d="M2 -4V4" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/><circle cx="5.5" cy="-1" r="1.2" fill="#111"/></g></g>`;
      const plant = (bx, h, col, dl) => `<g class="${P}sway" style="animation-delay:${dl}s"><path d="M${bx} 134C${bx - 6} ${134 - h * .4} ${bx + 6} ${134 - h * .7} ${bx - 2} ${134 - h}" fill="none" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>
<path d="M${bx} 134C${bx + 7} ${134 - h * .35} ${bx + 2} ${134 - h * .6} ${bx + 7} ${134 - h * .85}" fill="none" stroke="${H.shade(col, .25)}" stroke-width="2.4" stroke-linecap="round"/></g>`;
      let bub = "";
      if (xf.on) for (let i = 0; i < 6; i++) bub += `<circle class="${P}bubble" cx="${f(150 + (i % 2) * 3)}" cy="132" r="${f(1.2 + (i % 3) * .7)}" fill="none" stroke="#e6f7ff" stroke-opacity=".8" stroke-width=".8" style="animation-delay:${(-i * .45).toFixed(2)}s"/>`;
      const rays = x.on ? `<path d="M40 52L28 140H80L64 52ZM94 52L86 140H134L116 52ZM142 52L140 140H174V60Z" fill="${x.lg([[0, c, .35], [1, c, 0]])}" opacity="${a2(.3 + .7 * x.L)}"/>` : "";
      const body = `<rect x="18" y="140" width="164" height="52" fill="${x.lg([[0, "#4a3426"], [1, "#2c1e15"]])}"/>` + woodB(x, 192, "#5d4330") +
        `<rect x="24" y="146" width="74" height="46" rx="2" fill="none" stroke="#000" stroke-opacity=".35"/><rect x="102" y="146" width="74" height="46" rx="2" fill="none" stroke="#000" stroke-opacity=".35"/><rect x="88" y="162" width="3" height="12" rx="1.5" fill="${M.steel(x)}"/><rect x="109" y="162" width="3" height="12" rx="1.5" fill="${M.steel(x)}"/>` +
        `<path d="M18 140H182" stroke="#fff" stroke-opacity=".18"/>` +
        `<rect x="26" y="50" width="148" height="90" fill="${x.lg([[0, top], [1, bot]])}"/>` +
        `<g clip-path="${cp}">${rays}<path d="M26 128Q60 122 100 126T174 124V140H26Z" fill="${x.lg([[0, "#b49a72"], [1, "#6d5a40"]])}"/>` + dots(23, 70, 26, 124, 148, 16, 1, .4) +
        `<path d="M112 132Q116 112 132 114Q144 118 142 134Z" fill="${x.lg([[0, "#7d8188"], [1, "#3c3f45"]])}"/>` +
        plant(44, 58, "#3d9a4a", 0) + plant(58, 40, "#5bb85a", -.6) + plant(166, 64, "#2f8a43", -1.2) + plant(92, 30, "#78c26a", -.3) +
        (hh ? `<rect x="157" y="62" width="7" height="58" rx="3.5" fill="#dfe9ef" fill-opacity=".28" stroke="#cfe0ea" stroke-opacity=".6" stroke-width=".8"/><rect x="158.8" y="70" width="3.4" height="44" rx="1.7" fill="${ho ? "#ff8a3a" : "#5a4a44"}"/>` +
          (ho ? `<rect x="153" y="66" width="15" height="52" rx="7" fill="#ff7a2a" opacity=".22"/>` : "") + `<rect x="156.5" y="58" width="8" height="7" rx="1.5" fill="#20242a"/><circle cx="160.5" cy="61.5" r="1" fill="${ho ? "#ff8a3a" : "#3a3f46"}"/>` : "") +
        fish(78, 84, 1, "#ff8a3d", 5, 0, false) + fish(124, 98, .85, "#4da3ff", 6.5, -2, true) + fish(104, 70, .7, "#ffd84d", 4.4, -1, false) + bub +
        `<path d="M26 56H174" stroke="#fff" stroke-opacity="${x.on ? .45 : .15}" stroke-width="1"/></g>` +
        `<path d="M32 60L46 60L34 134H32Z" fill="#fff" fill-opacity=".08"/><rect x="26" y="50" width="148" height="90" fill="none" stroke="#9fb3c4" stroke-opacity=".4" stroke-width="1.4"/>` +
        `<rect x="24" y="136" width="152" height="5" fill="#111317"/>` +
        `<rect x="20" y="38" width="160" height="13" rx="3" fill="${x.lg([[0, "#3a3d44"], [1, "#121316"]])}"/><path d="M24 40H176" stroke="#fff" stroke-opacity=".25"/>` +
        `<rect x="28" y="49" width="144" height="2.4" rx="1.2" fill="${x.on ? H.mix(c, "#fff", .5) : "#2a2d34"}"/>` +
        (x.on ? `<rect x="28" y="47" width="144" height="7" rx="3.5" fill="${c}" opacity="${a2(.45 * x.L)}"/>` : "") + led(x, 168, 44.5, 1, c) +
        (wt != null ? `<rect x="34" y="112" width="30" height="13" rx="2" fill="#0a0d10" fill-opacity=".85" stroke="#9fb3c4" stroke-opacity=".5" stroke-width=".6"/>` +
          (`<text x="49" y="121.6" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="700" fill="${wt < 72 ? "#7dd3fc" : wt > 84 ? "#ff5a4f" : "#7ee08a"}">${wt}°</text>`) : "");
      return scene(x, back, body); }, { glow: { x: .5, y: .27, r: .9 }, cast: "down", parts: [{ id: "light", name: "Light" }, { id: "filter", name: "Filter" }, { id: "heater", name: "Heater" }, { id: "temp", name: "Water temperature", type: "value", unit: "°F", min: 60, max: 90, def: 78 }] }),

    ic("bed", "Heated pet bed", sw(["#b9876a", "#8a9aa8", "#c75b5b", "#e6dcc6", "#4f6b8a"], "#b9876a"), "Fabric", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "clay", 8, 104) + baseB(x, 104, "#8a6142");
      const cat = "#7b7f86", catD = "#3f4248";
      const heat = x.on ? `<g class="${P}heat" opacity="${a2(.35 + .6 * x.lv)}">${[0, 1, 2].map((i) => `<path d="M${84 + i * 16} 112c-4-6 4-10 0-16s4-10 0-16" fill="none" stroke="#ffc79a" stroke-opacity=".7" stroke-width="1.8" stroke-linecap="round" style="animation-delay:${(-i * .55).toFixed(2)}s"/>`).join("")}</g>` : "";
      const body = `<g class="hda-bg"><ellipse cx="100" cy="160" rx="88" ry="24" fill="${x.lg([[0, "#4e5562"], [1, "#3a404b"]])}"/><ellipse cx="100" cy="160" rx="82" ry="20" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="3" stroke-dasharray="2 4"/></g>` +
        `<ellipse cx="102" cy="150" rx="74" ry="22" fill="#000" fill-opacity=".35"/>` +
        `<ellipse cx="100" cy="138" rx="72" ry="32" fill="${x.lg([[0, H.shade(c, .35)], [.5, c], [1, H.shade(c, -.4)]])}"/>` +
        `<path d="M34 128Q100 96 166 128" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>` +
        `<ellipse cx="100" cy="140" rx="54" ry="20" fill="${x.lg([[0, H.shade(c, -.4)], [1, H.shade(c, .1)]])}"/>` +
        `<ellipse cx="100" cy="140" rx="54" ry="20" fill="none" stroke="${H.shade(c, -.55)}" stroke-width="1" stroke-dasharray="2 2.4"/>` +
        (x.on ? `<g class="${P}pulse"><ellipse cx="100" cy="140" rx="54" ry="20" fill="${x.rg([[0, "#ff9a4a", .85], [.6, "#ff7a2a", .35], [1, "#ff6a1a", 0]])}" opacity="${a2(.35 + .65 * x.L)}"/></g>` : "") +
        `<ellipse cx="98" cy="138" rx="30" ry="12" fill="#000" fill-opacity=".25"/>` +
        `<path d="M70 134Q72 118 98 118Q124 118 126 132Q126 144 98 146Q72 146 70 134Z" fill="${x.lg([[0, H.shade(cat, .3)], [1, catD]])}"/>` +
        `<path d="M84 121Q86 128 84 134M96 119Q98 127 96 134M108 120Q110 127 108 134" fill="none" stroke="${catD}" stroke-opacity=".6" stroke-width="1.6"/>` +
        `<path d="M72 138Q80 150 104 148Q120 146 128 140" fill="none" stroke="${catD}" stroke-width="6" stroke-linecap="round"/><path d="M74 137Q82 147 104 145" fill="none" stroke="${cat}" stroke-width="2" stroke-linecap="round"/>` +
        `<circle cx="126" cy="128" r="11" fill="${x.lg([[0, H.shade(cat, .35)], [1, H.shade(cat, -.25)]])}"/><path d="M118 122L120 110L126 118ZM128 118L135 110L135 123Z" fill="${H.shade(cat, -.1)}"/><path d="M120 120L121 114L124 118Z" fill="#d79a9a"/>` +
        `<path d="M121 129q2 1.6 4 0M129 129q2 1.6 4 0" fill="none" stroke="#1d1e22" stroke-width="1"/><path d="M126.2 132.6l1-.9 1 .9z" fill="#d07a7a"/>` +
        heat +
        cord(x, [160, 152, 168, 164, 176, 170, 170, 178, 166, 180, 160, 182, 154, 182], 2.2, "#2c2f36") +
        box(x, 136, 174, 22, 12, 3, 1, 2, "#eef0f2") + led(x, 147, 180, 1.1, "#ff8a3d");
      return scene(x, back, body); }, { glow: { x: .5, y: .7, r: .7 }, cast: "up" }),

    ic("launcher", "Ball launcher", sw(["#3a8fd8", "#f08a24", "#2c2f36", "#eef0f2", "#4caf6a"], "#3a8fd8"), "Body", (o) => { const x = X(o), c = o.color;
      let fence = "";
      for (let i = 0; i < 12; i++) fence += `<rect x="${8 + i * 16}" y="${i % 2 ? 58 : 54}" width="15" height="${i % 2 ? 66 : 70}" fill="${x.lg([[0, "#e9e4da"], [1, "#b8b1a4"]], 0, 0, 1, 0)}"/>`;
      const back = skyB(x, 124) + fence + `<rect x="8" y="80" width="184" height="4" fill="#a39c90"/><rect x="8" y="108" width="184" height="4" fill="#a39c90"/>` + grassB(x, 122, "#4b7536", 33);
      const body = `<ellipse cx="94" cy="164" rx="48" ry="7" fill="#000" fill-opacity=".4"/>` +
        `<path d="M54 162L62 98H126L134 162Z" fill="${x.lg([[0, H.shade(c, -.35)], [.3, H.shade(c, .25)], [.65, c], [1, H.shade(c, -.45)]], 0, 0, 1, 0)}"/>` +
        `<path d="M54 162L62 98H126L134 162Z" fill="${x.lg([[0, "#fff", .15], [.3, "#fff", 0], [1, "#000", .2]])}"/>` +
        `<ellipse cx="94" cy="98" rx="34" ry="9" fill="${H.shade(c, .3)}"/><ellipse cx="94" cy="98.5" rx="29" ry="7" fill="${x.lg([[0, "#0b0c10"], [1, "#2b2e35"]])}"/>` +
        `<clipPath id="${x.id("fun")}"><ellipse cx="94" cy="98.5" rx="29" ry="7"/></clipPath><g clip-path="url(#${x.id("fun")})">${tball(x, 84, 101, 7)}</g>` +
        `<circle cx="94" cy="128" r="15" fill="${H.shade(c, -.45)}"/><circle cx="94" cy="128" r="12" fill="${x.rg([[0, "#000"], [1, "#2a2d33"]])}"/><path d="M84 120A13 13 0 0 1 104 120" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>` +
        segBar(x, 80, 150, 28, 4, 5) + led(x, 120, 152, 1.2, "#7ee7ff") +
        (x.on ? `<path d="M100 122Q128 68 158 92" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" stroke-dasharray="2 3"/><g class="${P}launch">${tball(x, 140, 82, 6.5)}</g>` : tball(x, 160, 170, 6.5));
      return scene(x, back, body); }),

    ic("birdcam", "Bird feeder camera", sw(["#6b8f5e", "#eef0f2", "#8a6142", "#2c2f36", "#c9b99a"], "#6b8f5e"), "Body", (o) => { const x = X(o), c = o.color;
      const back = skyB(x, 128) + treeLine(x, 128) + grassB(x, 128, "#4b7536", 41);
      const cp = clipU(x, "seed", `<rect x="74" y="80" width="52" height="40" rx="3"/>`);
      const sh = 40 * x.lv; let seeds = ""; const r = rnd(12);
      for (let yy = 118; yy > 120 - sh; yy -= 2.4) for (let xx = 74; xx < 128; xx += 3) seeds += `<ellipse cx="${f(xx + r() * 2)}" cy="${f(yy + r())}" rx="1.4" ry="1" fill="${["#3a2f25", "#d9c8a0", "#8a6d48", "#f0e6cc"][Math.floor(r() * 4)]}"/>`;
      const bird = `<g class="${x.on ? P + "bob" : ""}"><g transform="translate(70 114)"><path d="M-8 2L-17 8L-15 4Z" fill="#2f4f7f"/><ellipse cx="0" cy="0" rx="9" ry="6.5" fill="${x.lg([[0, "#5b8fd6"], [1, "#2f5a9a"]])}" transform="rotate(-18)"/>
<path d="M-2 3Q4 7 8 2Q6 -1 2 0Z" fill="#e0894a"/><path d="M-7 -2Q-1 -6 4 -2Q-1 2 -7 -2Z" fill="#244a80"/><circle cx="7" cy="-6" r="5" fill="#4f86d0"/><path d="M11.5 -6.5L15 -5.4L11.5 -4.4Z" fill="#2b2b2b"/><circle cx="8.5" cy="-7" r="1" fill="#111"/><circle cx="8.8" cy="-7.3" r=".35" fill="#fff"/>
<path d="M-1 6V9M2 6V9" stroke="#3a2a20" stroke-width=".9"/></g></g>`;
      const body = `<rect x="96" y="140" width="8" height="52" fill="${x.lg([[0, "#1f2226"], [.4, "#5a5f66"], [1, "#1a1c20"]], 0, 0, 1, 0)}"/>` +
        `<rect x="64" y="70" width="72" height="56" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, -.25)]], 0, 0, 1, 0)}"/>` +
        `<rect x="73" y="79" width="54" height="42" rx="3.5" fill="${H.shade(c, -.45)}"/><rect x="74" y="80" width="52" height="40" rx="3" fill="${x.lg([[0, "#d9e8f2", .35], [1, "#9fb8c8", .25]])}"/>` +
        `<g clip-path="${cp}">${seeds}</g><path d="M78 83H90L80 117H78Z" fill="#fff" fill-opacity=".3"/>` +
        `<path d="M50 74L100 40L150 74L144 80L100 50L56 80Z" fill="${M.h(x, H.shade(c, -.15))}"/><path d="M50 74L100 40L150 74" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>` +
        `<path d="M112 56L132 68L126 72L106 60Z" fill="${x.lg([[0, "#2f5592"], [1, "#101c33"]])}" stroke="#aab3bd" stroke-width=".8"/>` +
        `<rect x="54" y="122" width="92" height="7" rx="2" fill="${x.lg([[0, "#8a6142"], [1, "#4f3522"]])}"/><path d="M54 122.6H146" stroke="#fff" stroke-opacity=".3"/>` +
        `<rect x="86" y="128" width="28" height="14" rx="5" fill="${x.lg([[0, "#2c2f36"], [1, "#0e1013"]])}"/><circle cx="100" cy="135" r="5" fill="${x.rg([[0, "#4f6fa8"], [.5, "#1a2440"], [1, "#05070c"]], .4, .38, .6)}"/><circle cx="98.4" cy="133.4" r="1.4" fill="#fff" fill-opacity=".6"/>` +
        (x.on ? `<g class="${P}blink">${led(x, 109, 132, 1, "#ff3b3b")}</g>` : led(x, 109, 132, 1, "#ff3b3b")) +
        `<ellipse cx="120" cy="121" rx="8" ry="2" fill="#c9b48a"/>` + bird;
      return scene(x, back, body); }),

    ic("collar", "Collar on dock", sw(["#e0483e", "#3a6fd8", "#2f8f5e", "#2c2f36", "#f2a541", "#c47ad8"], "#e0483e"), "Strap", (o) => { const x = X(o), c = o.color;
      const back = tileB(x, 8, 118, "#e9e1d2") + counterB(x, 118, "#cfd0d6");
      const strapTop = "M42 132A58 16 0 0 1 158 132", strapBot = "M158 132A58 16 0 0 1 42 132";
      const strap = (d) => `<path d="${d}" fill="none" stroke="${H.shade(c, -.45)}" stroke-width="10" transform="translate(1 2)"/><path d="${d}" fill="none" stroke="${c}" stroke-width="9"/><path d="${d}" fill="none" stroke="${H.shade(c, .45)}" stroke-opacity=".7" stroke-width="1.4" transform="translate(0 -2.6)"/><path d="${d}" fill="none" stroke="${H.shade(c, -.35)}" stroke-opacity=".7" stroke-width=".6" stroke-dasharray="2 2"/>`;
      const body = `<ellipse cx="100" cy="164" rx="70" ry="9" fill="#000" fill-opacity=".35"/>` +
        cord(x, [146, 156, 166, 162, 176, 172, 196, 170], 2.6, "#eef0f2", x.on ? GREEN : null, 6) +
        `<path d="M54 146V154Q54 166 100 166Q146 166 146 154V146Z" fill="${x.lg([[0, "#d9dce1"], [1, "#8d939b"]], 0, 0, 1, 0)}"/>` +
        `<ellipse cx="100" cy="146" rx="46" ry="11" fill="${x.lg([[0, "#f6f7f9"], [1, "#c3c8cf"]])}"/><ellipse cx="100" cy="145" rx="30" ry="6" fill="${x.lg([[0, "#b6bcc4"], [1, "#e6e9ed"]])}"/>` +
        segBar(x, 82, 156, 36, 3.6, 6) +
        strap(strapTop) +
        `<rect x="34" y="124" width="14" height="16" rx="2" fill="none" stroke="${M.steel(x)}" stroke-width="2.6"/><path d="M41 124V140" stroke="#c9ced5" stroke-width="1.6"/>` +
        box(x, 82, 112, 36, 30, 8, 2, 3, "#2c2f36") +
        `<rect x="86" y="116" width="28" height="12" rx="4" fill="#0e1014"/>` + led(x, 93, 122, 1.2, lvlCol(x, GREEN)) +
        `<path d="M106 118L103 123H106L105 127L109 121H106L107 118Z" fill="${x.on ? "#fff" : "#4a4e58"}"/>` +
        strap(strapBot) + [0, 1, 2, 3].map((i) => `<circle cx="${130 + i * 6}" cy="${f(144 - i * 1.6)}" r="1.1" fill="${H.shade(c, -.6)}"/>`).join("");
      return scene(x, back, body); }),
  ];

  const css = `
.hda-pets-flow{opacity:0}
.hda-anim .hda-pets-flow{animation:hda-pets-flow 1.6s linear infinite}
@keyframes hda-pets-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-pets-pulse{animation:hda-pets-pulse 2.8s ease-in-out infinite}
@keyframes hda-pets-pulse{0%,100%{opacity:1}50%{opacity:.55}}
.hda-anim .hda-pets-blink{animation:hda-pets-blink 1.2s ease-in-out infinite}
@keyframes hda-pets-blink{0%,100%{opacity:1}50%{opacity:.15}}
.hda-pets-drop{opacity:0}
.hda-anim .hda-pets-drop{animation:hda-pets-drop 1.3s ease-in infinite}
@keyframes hda-pets-drop{0%{transform:translate(0,-4px);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translate(0,14px);opacity:0}}
.hda-anim .hda-pets-stream{animation:hda-pets-stream .9s linear infinite}
@keyframes hda-pets-stream{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-16}}
.hda-pets-ripple{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-pets-ripple{animation:hda-pets-ripple 2.4s ease-out infinite}
@keyframes hda-pets-ripple{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1);opacity:0}}
.hda-pets-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-pets-spin{animation:hda-pets-spin 3s linear infinite}
@keyframes hda-pets-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.hda-pets-swing{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-pets-swing{animation:hda-pets-swing 2.6s ease-in-out infinite}
@keyframes hda-pets-swing{0%,100%{transform:scale(1,1)}30%{transform:scale(1,.72)}60%{transform:scale(1,.92)}}
.hda-pets-toss{opacity:0}
.hda-anim .hda-pets-toss{animation:hda-pets-toss 2.2s ease-out infinite}
@keyframes hda-pets-toss{0%{transform:translate(0,0);opacity:0}8%{opacity:1}45%{transform:translate(-28px,-26px)}80%{transform:translate(-52px,4px);opacity:1}100%{transform:translate(-56px,4px);opacity:0}}
.hda-anim .hda-pets-launch{animation:hda-pets-launch 2s ease-in-out infinite}
@keyframes hda-pets-launch{0%{transform:translate(-46px,46px);opacity:0}10%{opacity:1}50%{transform:translate(0,0)}90%{transform:translate(40px,60px);opacity:1}100%{transform:translate(44px,70px);opacity:0}}
.hda-anim .hda-pets-swim{animation:hda-pets-swim 5s ease-in-out infinite alternate}
@keyframes hda-pets-swim{0%{transform:translate(-10px,1px)}50%{transform:translate(2px,-2px)}100%{transform:translate(12px,1px)}}
.hda-pets-bubble{opacity:0}
.hda-anim .hda-pets-bubble{animation:hda-pets-bubble 2.7s linear infinite}
@keyframes hda-pets-bubble{0%{transform:translate(0,0);opacity:0}10%{opacity:1}90%{opacity:.8}100%{transform:translate(2px,-74px);opacity:0}}
.hda-pets-sway{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-pets-sway{animation:hda-pets-sway 3.4s ease-in-out infinite}
@keyframes hda-pets-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.hda-pets-heat path{transform-box:fill-box}
.hda-anim .hda-pets-heat path{animation:hda-pets-heat 1.9s ease-in-out infinite}
@keyframes hda-pets-heat{0%{transform:translate(0,4px);opacity:0}40%{opacity:1}100%{transform:translate(0,-10px);opacity:0}}
.hda-anim .hda-pets-bob{animation:hda-pets-bob 1.8s ease-in-out infinite}
@keyframes hda-pets-bob{0%,60%,100%{transform:translate(0,0)}70%{transform:translate(1px,2px)}80%{transform:translate(0,0)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-pets-flow,.hda-anim .hda-pets-pulse,.hda-anim .hda-pets-blink,.hda-anim .hda-pets-drop,.hda-anim .hda-pets-stream,.hda-anim .hda-pets-ripple,.hda-anim .hda-pets-spin,.hda-anim .hda-pets-swing,.hda-anim .hda-pets-toss,.hda-anim .hda-pets-launch,.hda-anim .hda-pets-swim,.hda-anim .hda-pets-bubble,.hda-anim .hda-pets-sway,.hda-anim .hda-pets-heat path,.hda-anim .hda-pets-bob{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "pets", tab: "Pet devices", group: "Home", kind: "device",
    intro: "Ten pet gadgets on kitchen floors, in the yard and on the counter. On means working: kibble drops into the bowl, the fountain flows, the litter globe turns, the pet door unlocks, treats fly, fish swim under the light, the bed glows warm, balls launch. The slider is the level: food, water, light, warmth or battery.",
    
    levelLabel: "Level", onWord: "On", offWord: "Off",
    css, icons,
  });
})();
