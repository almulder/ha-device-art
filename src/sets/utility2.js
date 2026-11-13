(function () {
  const H = window.HDAH, P = "hda-utility2-";
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
  function wheel(x, cx, cy, r) {
    let sp = "";
    for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2;
      sp += `<path d="M${f(cx + Math.cos(a) * r * .18)} ${f(cy + Math.sin(a) * r * .18)}L${f(cx + Math.cos(a) * r * .6)} ${f(cy + Math.sin(a) * r * .6)}" stroke="#d5dae0" stroke-width="${f(r * .17)}" stroke-linecap="round"/>`; }
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, "#2a2c31"], [.8, "#18191d"], [1, "#0c0d0f"]])}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .66)}" fill="${x.rg([[0, "#6a7078"], [1, "#2e3238"]], .4, .35, .7)}"/>${sp}
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .66)}" fill="none" stroke="#e5e9ee" stroke-opacity=".6" stroke-width=".8"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .14)}" fill="${M.steel(x)}"/>
<path d="M${f(cx - r * .75)} ${f(cy - r * .55)}A${f(r * .92)} ${f(r * .92)} 0 0 1 ${f(cx + r * .2)} ${f(cy - r * .9)}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.2"/>`;
  }
  const paint = (x, c) => x.lg([[0, H.shade(c, .55)], [.3, H.shade(c, .15)], [.62, c], [.66, H.shade(c, -.35)], [1, H.shade(c, -.55)]]);

  function evPlug(x, cx, cy, s, rot, col) {
    col = col || "#2a2c33";
    return `<g transform="rotate(${rot || 0} ${f(cx)} ${f(cy)})"><rect x="${f(cx - 5 * s + 1)}" y="${f(cy - 4 * s + 2)}" width="${f(16 * s)}" height="${f(8 * s)}" rx="${f(3 * s)}" fill="#000" fill-opacity=".35"/>
<rect x="${f(cx - 5 * s)}" y="${f(cy - 4 * s)}" width="${f(13 * s)}" height="${f(8 * s)}" rx="${f(3 * s)}" fill="${M.v(x, col)}"/><rect x="${f(cx + 7 * s)}" y="${f(cy - 3.2 * s)}" width="${f(4 * s)}" height="${f(6.4 * s)}" rx="${f(1.4 * s)}" fill="${M.steel(x)}"/>
<path d="M${f(cx - 3.5 * s)} ${f(cy - 2.6 * s)}H${f(cx + 6 * s)}" stroke="#fff" stroke-opacity=".35" stroke-width="${f(.8 * s)}" stroke-linecap="round"/><path d="M${f(cx - 10 * s)} ${f(cy)}H${f(cx - 5 * s)}" stroke="#1c1d22" stroke-width="${f(4 * s)}"/></g>`;
  }


  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label, render }, extra || {});
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


  const wallPipes = (x, xs, y0, cols, flows) => xs.map((px, i) => pipe(x, [px, y0, px, y0 + 20, px, y0 + 34, px, 196], 4.2, cols ? cols[i] : COP, flows ? flows[i] : null, 6)).join("");
  function cab(x, x0, y0, w, h, col, r) {
    return box(x, x0, y0, w, h, r == null ? 4 : r, 5, 4, col) + `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${r == null ? 4 : r}" fill="${x.lg([[0, "#fff", .22], [.3, "#fff", 0], [.85, "#000", 0], [1, "#000", .2]], 0, 0, 1, 0)}"/>`;
  }
  const flueHeat = (x, cx, y) => heatW(x, cx - 10, cx + 10, y, .7);
  const flameIcon = (x, cx, cy, s, lit) => `<path d="M${f(cx)} ${f(cy + 5 * s)}C${f(cx - 4 * s)} ${f(cy + 2 * s)} ${f(cx - 2 * s)} ${f(cy - 2 * s)} ${f(cx + .5 * s)} ${f(cy - 5 * s)}C${f(cx + .5 * s)} ${f(cy - 2 * s)} ${f(cx + 4 * s)} ${f(cy - 1 * s)} ${f(cx + 3 * s)} ${f(cy + 3 * s)}Z" fill="${lit ? "#ff8a3a" : "#3a3f48"}"/>`;
  const tapIcon = (x, cx, cy, s, lit) => `<path d="M${f(cx - 4 * s)} ${f(cy - 2 * s)}H${f(cx + 3 * s)}V${f(cy + 1 * s)}" fill="none" stroke="${lit ? "#7ee7ff" : "#3a3f48"}" stroke-width="${f(1.4 * s)}" stroke-linecap="round"/><circle cx="${f(cx + 3 * s)}" cy="${f(cy + 3.4 * s)}" r="${f(1 * s)}" fill="${lit ? "#7ee7ff" : "#3a3f48"}"/>`;
  function flanges(x, cx, y1, y2, w, col) {
    return `<rect x="${f(cx - w / 2 - 3)}" y="${f(y1 - 4)}" width="${f(w + 6)}" height="7" rx="2" fill="${M.v(x, col)}"/><rect x="${f(cx - w / 2 - 3)}" y="${f(y2 - 3)}" width="${f(w + 6)}" height="7" rx="2" fill="${M.v(x, col)}"/>` +
      [y1, y2].map((y) => [cx - w / 2 - 1, cx + w / 2 + 1].map((bx) => `<circle cx="${f(bx)}" cy="${f(y)}" r="1.2" fill="${M.steel(x)}"/>`).join("")).join("");
  }
  function strata(x, x0, y0, w, h) {
    const n = 8; let s = "";
    for (let i = 0; i < n; i++) { const t = i / (n - 1), hot = Math.max(0, Math.min(1, (x.on ? x.lv * 1.3 : x.lv * .7) - t * .9));
      s += `<rect x="${f(x0)}" y="${f(y0 + i * h / n)}" width="${f(w)}" height="${f(h / n + .5)}" fill="${H.mix("#3a7bd5", "#ff5a2a", hot)}"/>`; }
    return s;
  }

  const icons = [
    ic("wall-combi-boiler", "Wall combi boiler", sw(["#eef0f2", "#c9ccd1", "#2c2f36", "#8e959e"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const pt = o.parts || { heat: x.on, dhw: x.on };
      const back = wallB(x, "gray", 8, 192);
      const body = pipe(x, [84, 8, 84, 14, 84, 18, 84, 26], 7, "#eef0f2") + pipe(x, [116, 8, 116, 14, 116, 18, 116, 26], 7, "#eef0f2") +
        wallPipes(x, [74, 88, 100, 112, 126], 146, [COP, COP, "#f2c94c", COP, COP], [pt.heat ? HOT : null, pt.dhw ? HOT : null, null, pt.dhw ? COLD : null, pt.heat ? COLD : null]) +
        valve(x, 74, 166, "#e0483e") + valve(x, 88, 166, "#e0483e") + valve(x, 100, 166, "#f2c94c") + valve(x, 112, 166, "#3a6fd8") + valve(x, 126, 166, "#3a6fd8") +
        cab(x, 62, 24, 76, 124, c, 5) + `<path d="M66 60H134" stroke="${H.shade(c, -.2)}" stroke-width=".6"/>` +
        `<rect x="74" y="92" width="52" height="34" rx="6" fill="${x.lg([[0, "#2a2d33"], [1, "#101216"]])}"/>` +
        lcd(x, 79, 97, 28, 14, "#7ee7ff") + digits(x, 104, 99, 10, temp2(x), 2, "#bdf3ff") +
        flameIcon(x, 84, 119, .8, pt.heat) + tapIcon(x, 95, 118, .8, pt.dhw) +
        `<circle cx="116" cy="109" r="7" fill="${M.s(x, "#3a3d44")}"/><circle cx="116" cy="109" r="7" fill="none" stroke="${x.on ? "#7ee7ff" : "#4a4e56"}" stroke-width="1" stroke-dasharray="${f(44 * x.lv)} 44" transform="rotate(-90 116 109)"/>` +
        `<rect x="92" y="136" width="16" height="3" rx="1.5" fill="${H.shade(c, -.25)}"/>` + flueHeat(x, 84, 8);
      return scene(x, back, body); }, { parts: [{ id: "heat", name: "Heating" }, { id: "dhw", name: "Hot water" }] }),

    ic("compact-condensing-boiler", "Compact condensing boiler", sw(["#eef0f2", "#c9ccd1", "#2c2f36"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "cream", 8, 192);
      const body = `<rect x="92" y="8" width="16" height="24" fill="${x.lg([[0, "#c9ccd1"], [.5, "#ffffff"], [1, "#a9aeb5"]], 0, 0, 1, 0)}"/><rect x="88" y="26" width="24" height="5" rx="1" fill="#d5d9de"/>` +
        wallPipes(x, [72, 88, 112, 128], 140, null, [HOT, null, COLD, null]) + valve(x, 72, 160, "#e0483e") + valve(x, 128, 160, "#3a6fd8") +
        cab(x, 58, 30, 84, 112, c, 10) +
        `<path d="M58 116H142V132Q142 142 132 142H68Q58 142 58 132Z" fill="${x.lg([[0, "#2a2c31"], [1, "#0d0e11"]])}"/><path d="M60 116.5H140" stroke="#fff" stroke-opacity=".25"/>` +
        `<rect x="86" y="121" width="28" height="12" rx="2" fill="#05070a"/>` + digits(x, 108, 123, 8, temp2(x), 2, "#ffffff") + flameIcon(x, 79, 127, .7, x.on) +
        led(x, 122, 127, 1, x.on ? "#3ee08f" : "#3ee08f") + `<path d="M64 36Q100 30 136 36" fill="none" stroke="#fff" stroke-opacity=".5"/>` + flueHeat(x, 100, 8);
      return scene(x, back, body); }),

    ic("hopper-pellet-boiler", "Hopper pellet boiler", sw(["#7cc242", "#eef0f2", "#2c2f36", "#c0392b"], "#7cc242"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 166);
      const body = shadowE(x, 102, 172, 76, 7) + pipe(x, [68, 44, 68, 26, 74, 16, 110, 16, 150, 16, 168, 12, 196, 12], 7, "#9aa1aa") +
        cab(x, 118, 64, 54, 102, "#e8eaed", 3) + `<rect x="118" y="64" width="54" height="10" rx="3" fill="${M.v(x, "#d5d9de")}"/>` +
        `<path d="M118 86L106 76" stroke="#9aa1aa" stroke-width="6" stroke-linecap="round"/>` +
        cab(x, 40, 44, 70, 122, "#e8eaed", 3) +
        `<rect x="46" y="54" width="58" height="104" rx="3" fill="${x.lg([[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.3)]], 0, 0, 1, 0)}"/><path d="M48 56L60 56L50 154H48Z" fill="#fff" fill-opacity=".2"/>` +
        `<rect x="56" y="64" width="38" height="22" rx="3" fill="#0e1014"/>` + digits(x, 88, 68, 10, temp2(x), 2, "#e9f7ef") + flameIcon(x, 63, 75, .7, x.on) +
        `<rect x="96" y="96" width="4" height="22" rx="2" fill="${M.steel(x)}"/>` + vents(124, 140, 42, 3, 5) + flueHeat(x, 190, 12);
      return scene(x, back, body); }),

    ic("tall-pellet-boiler", "Tall pellet boiler", sw(["#c0392b", "#e8641e", "#2f6fb8", "#8e959e"], "#c0392b"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 166);
      const body = shadowE(x, 100, 172, 76, 7) + pipe(x, [86, 34, 86, 20, 96, 14, 130, 14, 170, 14, 186, 10, 206, 10], 7, "#2a2b2f") +
        cab(x, 34, 30, 50, 136, "#3a3d44", 3) + `<rect x="34" y="30" width="50" height="10" rx="3" fill="${M.v(x, "#2c2f36")}"/>` +
        cab(x, 78, 62, 82, 104, "#3a3d44", 3) +
        `<rect x="78" y="62" width="5" height="104" fill="${M.v(x, c)}"/><rect x="155" y="62" width="5" height="104" fill="${M.v(x, c)}"/><rect x="78" y="62" width="82" height="5" fill="${M.v(x, c)}"/>` +
        `<rect x="92" y="76" width="54" height="30" rx="3" fill="#07080b"/>` + lcd(x, 96, 80, 46, 16, "#ffffff") + digits(x, 136, 83, 10, temp2(x), 2, "#ffffff") + flameIcon(x, 104, 88, .8, x.on) +
        `<path d="M92 118H146M92 128H146" stroke="#000" stroke-opacity=".35"/>` + vents(92, 140, 54, 3, 5) + `<path d="M38 34H80" stroke="#fff" stroke-opacity=".2"/>` + flueHeat(x, 196, 10);
      return scene(x, back, body); }),

    ic("compact-pellet-boiler", "Compact pellet boiler", sw(["#c0392b", "#2c2f36", "#8e959e", "#eef0f2"], "#c0392b"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 166);
      const body = shadowE(x, 100, 172, 62, 7) + pipe(x, [116, 40, 116, 24, 124, 16, 160, 16, 186, 16, 196, 16, 206, 16], 7, "#9aa1aa") +
        cab(x, 48, 40, 92, 126, c, 3) +
        `<rect x="60" y="48" width="70" height="112" rx="3" fill="${x.lg([[0, "#f2f3f5"], [.6, "#d5d9de"], [1, "#a9aeb5"]], 0, 0, 1, 0)}"/><path d="M62 50L76 50L64 156H62Z" fill="#fff" fill-opacity=".35"/>` +
        `<rect x="74" y="58" width="42" height="26" rx="3" fill="#0e1014"/>` + digits(x, 104, 62, 9, temp2(x), 2, "#ffd9a0") + flameIcon(x, 80, 76, .7, x.on) + segBar(x, 86, 78, 26, 3, 5, false, "#ffb347") +
        `<rect x="124" y="96" width="4" height="26" rx="2" fill="${M.steel(x)}"/><path d="M60 130H130" stroke="#000" stroke-opacity=".2"/>` + flueHeat(x, 196, 16);
      return scene(x, back, body); }),

    ic("geothermal-heat-pump", "Geothermal heat pump", sw(["#c9ccd1", "#eef0f2", "#5b5f66"], "#c9ccd1"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 168);
      const body = shadowE(x, 100, 174, 54, 6) + pipe(x, [150, 60, 170, 60, 186, 60, 206, 60], 6, "#1d1e22", COLD, 4) + pipe(x, [150, 76, 170, 76, 186, 76, 206, 76], 6, "#1d1e22", COLD, 4) +
        cab(x, 52, 30, 96, 140, c, 6) +
        `<path d="M52 36Q52 30 58 30H78Q66 90 74 170H58Q52 170 52 164Z" fill="${x.lg([[0, "#3a3d44"], [1, "#1d1f24"]], 0, 0, 1, 0)}"/><path d="M78 30Q66 90 74 170" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
        `<rect x="96" y="42" width="40" height="14" rx="3" fill="#0e1014"/>` + digits(x, 128, 45, 8, temp2(x), 2, "#bdf3ff") + led(x, 102, 49, 1, "#3ee08f") +
        vents(92, 140, 48, 4, 5);
      return scene(x, back, body); }),

    ic("ground-loop-heat-pump", "Ground-loop heat pump", sw(["#2c2f36", "#5b5f66", "#c9ccd1"], "#2c2f36"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 168);
      const body = shadowE(x, 100, 174, 54, 6) +
        `<path d="M60 8H140V36H60Z" fill="${x.lg([[0, "#b9bec5"], [.5, "#e2e5e9"], [1, "#8e959e"]], 0, 0, 1, 0)}"/><path d="M60 22H140" stroke="#000" stroke-opacity=".15"/>` +
        pipe(x, [148, 120, 170, 120, 186, 120, 206, 120], 6, "#1d1e22", COLD, 4) + pipe(x, [148, 136, 170, 136, 186, 136, 206, 136], 6, "#1d1e22", COLD, 4) +
        cab(x, 54, 34, 92, 136, c, 3) +
        `<rect x="62" y="44" width="76" height="40" rx="2" fill="${x.lg([[0, "#d5d9de"], [1, "#9aa1aa"]])}"/>` + vents(66, 48, 68, 6, 5.6, .5) +
        `<rect x="62" y="92" width="76" height="70" rx="2" fill="${x.lg([[0, "#d5d9de"], [1, "#8e959e"]], 0, 0, 1, 0)}"/>` +
        `<rect x="80" y="104" width="40" height="14" rx="2" fill="#0e1014"/>` + digits(x, 112, 107, 8, temp2(x), 2, "#bdf3ff") + led(x, 86, 111, 1, "#3ee08f") +
        (x.on ? `<g class="${P}heat">${heatW(x, 70, 130, 8, .6)}</g>` : "");
      return scene(x, back, body); }),

    ic("slim-geothermal-unit", "Slim geothermal unit", sw(["#eef0f2", "#c9ccd1", "#2c2f36"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 168);
      const body = shadowE(x, 98, 174, 46, 6) + pipe(x, [74, 22, 74, 14, 74, 10, 74, 6], 6, "#1d1e22", COLD, 3) + pipe(x, [122, 22, 122, 14, 122, 10, 122, 6], 6, COP, HOT, 3) +
        cab(x, 60, 20, 76, 152, c, 3) + `<rect x="60" y="20" width="5" height="152" fill="#1d1e22"/><rect x="131" y="20" width="5" height="152" fill="#1d1e22"/>` +
        `<rect x="60" y="20" width="76" height="22" rx="3" fill="${x.lg([[0, "#3a3d44"], [1, "#16171a"]])}"/>` + lcd(x, 82, 25, 32, 12, "#ffffff") + digits(x, 108, 27, 8, temp2(x), 2, "#ffffff") + led(x, 124, 31, 1, "#3ee08f") +
        `<path d="M68 46H128" stroke="#fff" stroke-opacity=".6"/>`;
      return scene(x, back, body); }),

    ic("smart-circulator", "Smart circulator", sw(["#c0392b", "#2c2f36", "#8e959e"], "#c0392b"), "Finish", (o) => { const x = X(o), c = o.color, w = Math.round(3 + 42 * x.lv);
      const back = wallB(x, "gray", 8, 192);
      const body = pipe(x, [70, 6, 70, 40, 70, 60, 70, 70], 9, COP, HOT, 6) + pipe(x, [70, 130, 70, 160, 70, 180, 70, 196], 9, COP, HOT, 5) +
        `<rect x="62" y="66" width="16" height="8" rx="2" fill="${M.metal(x, "#c9a24a")}"/><rect x="62" y="126" width="16" height="8" rx="2" fill="${M.metal(x, "#c9a24a")}"/>` +
        `<rect x="58" y="74" width="24" height="52" rx="6" fill="${x.lg([[0, "#1a1b1f"], [.4, "#3a3d44"], [1, "#0e0f12"]], 0, 0, 1, 0)}"/>` +
        `<rect x="54" y="74" width="32" height="52" rx="8" fill="${x.lg([[0, H.shade(c, -.45)], [.35, H.shade(c, .25)], [.6, c], [1, H.shade(c, -.5)]], 0, 0, 1, 0)}"/>` +
        `<rect x="82" y="80" width="20" height="40" rx="4" fill="${x.lg([[0, "#1d1f24"], [1, "#3a3d44"]])}"/>` +
        `<rect x="98" y="70" width="50" height="60" rx="16" fill="${x.lg([[0, "#4a4e56"], [.5, "#2c2f36"], [1, "#121316"]])}"/><path d="M104 76Q123 70 142 76" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.2"/>` +
        `<rect x="106" y="80" width="32" height="40" rx="7" fill="${x.lg([[0, "#1d1f24"], [1, "#0b0c0f"]])}"/>` + digits(x, 134, 86, 10, w, 2, "#7ef0a8") +
        [0, 1, 2].map((i) => `<rect x="${112 + i * 7}" y="104" width="5" height="2" rx="1" fill="${x.on && i <= Math.round(x.lv * 2) ? "#ffb347" : "#2a2c31"}"/>`).join("") + button(x, 122, 113, 2.4, "#5b5f66");
      return scene(x, back, body); }),

    ic("classic-circulator", "Classic circulator", sw(["#2f7f6a", "#2f5fa8", "#c9a24a", "#8e959e"], "#2f7f6a"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 192);
      const body = pipe(x, [8, 100, 30, 100, 44, 100, 56, 100], 9, COP, HOT, 4) + pipe(x, [116, 100, 140, 100, 170, 100, 206, 100], 9, COP, HOT, 6) +
        `<rect x="52" y="88" width="8" height="24" rx="1.5" fill="${M.v(x, c)}"/><rect x="108" y="88" width="8" height="24" rx="1.5" fill="${M.v(x, c)}"/>` +
        `<rect x="58" y="92" width="52" height="16" rx="3" fill="${M.v(x, c)}"/><circle cx="84" cy="100" r="14" fill="${M.s(x, c)}"/>` +
        `<rect x="62" y="40" width="44" height="50" rx="8" fill="${x.lg([[0, H.shade(c, -.4)], [.3, H.shade(c, .3)], [.6, c], [1, H.shade(c, -.5)]], 0, 0, 1, 0)}"/>` +
        (() => { let s = ""; for (let i = 0; i < 6; i++) s += `<path d="M62 ${47 + i * 7}H106" stroke="#000" stroke-opacity=".16" stroke-width="1.6"/>`; return s; })() +
        `<rect x="72" y="24" width="24" height="16" rx="2" fill="${M.v(x, H.shade(c, -.1))}"/>` + pipe(x, [84, 24, 84, 16, 92, 12, 110, 10, 140, 8, 160, 8, 206, 8], 3, "#2c2f36") +
        fanCap(x, 84, 65, 11, H.shade(c, -.1)) + led(x, 90, 32, .9, "#3ee08f", .5);
      return scene(x, back, body); }),

    ic("large-smart-circulator", "Large smart circulator", sw(["#3a3d44", "#2f8f5e", "#8e959e"], "#3a3d44"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 192);
      const body = pipe(x, [70, 6, 70, 40, 70, 56, 70, 62], 13, "#9aa1aa", HOT, 5) + pipe(x, [70, 138, 70, 160, 70, 180, 70, 196], 13, "#9aa1aa", HOT, 4) +
        flanges(x, 70, 62, 138, 22, "#2a2c31") +
        `<rect x="56" y="66" width="28" height="68" rx="5" fill="${x.lg([[0, "#121316"], [.4, "#2c2f36"], [1, "#0b0c0f"]], 0, 0, 1, 0)}"/>` +
        `<rect x="80" y="72" width="22" height="56" rx="4" fill="${x.lg([[0, "#1d1f24"], [1, "#3a3d44"]])}"/>` +
        `<rect x="98" y="62" width="62" height="76" rx="6" fill="${x.lg([[0, H.shade(c, .3)], [.5, c], [1, H.shade(c, -.45)]])}"/>` +
        `<rect x="106" y="70" width="46" height="30" rx="2" fill="#0b0c0f"/><rect x="108" y="72" width="42" height="26" rx="1" fill="${x.on ? x.lg([[0, "#2a3a44"], [1, "#16222a"]]) : "#0e1013"}"/>` +
        digits(x, 140, 76, 9, Math.round(x.lv * 99), 2, "#e9f7ef") + (x.on ? `<rect x="111" y="91" width="${f(36 * x.lv)}" height="3" fill="#3ee08f"/>` : "") +
        `<circle cx="129" cy="118" r="9" fill="${M.s(x, "#2f8f5e")}"/><circle cx="129" cy="118" r="5" fill="${M.s(x, "#3fbf7e")}"/>`;
      return scene(x, back, body); }),

    ic("buffer50", "50 gal buffer tank", sw(["#eef0f2", "#2f5fa8", "#c9ccd1", "#2c2f36"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 170);
      const ports = [92, 118, 144];
      const body = shadowE(x, 96, 176, 52, 6) + ports.map((y, i) => pipe(x, [140, y, 160, y, 176, y, 206, y], 5, i < 2 ? COP : "#1d1e22", i < 2 ? HOT : COLD, 5)).join("") +
        `<path d="M50 84Q50 70 96 68Q142 70 142 84V164Q142 172 96 172Q50 172 50 164Z" fill="${x.lg([[0, H.shade(c, -.4)], [.3, H.shade(c, .3)], [.55, c], [1, H.shade(c, -.5)]], 0, 0, 1, 0)}"/>` +
        `<ellipse cx="96" cy="78" rx="44" ry="8" fill="${x.lg([[0, H.shade(c, .4)], [1, H.shade(c, -.1)]])}"/>` + ports.map((y) => `<rect x="136" y="${y - 4}" width="8" height="8" rx="1" fill="${M.metal(x, "#c9a24a")}"/>`).join("") +
        `<rect x="90" y="60" width="12" height="10" rx="1" fill="${M.metal(x, "#c9a24a")}"/>` + gauge(x, 82, 112, 9, Math.max(.05, x.on ? x.lv : x.lv * .6)) +
        `<path d="M54 152H138" stroke="#000" stroke-opacity=".15"/>`;
      return scene(x, back, body); }),

    ic("wallbuffer", "Wall-hung buffer", sw(["#eef0f2", "#c9ccd1", "#2c2f36"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 192);
      const ports = [64, 86, 108, 130];
      const body = ports.map((y, i) => pipe(x, [132, y, 150, y, 170, y, 206, y], 4.4, COP, i % 2 ? COLD : HOT, 5)).join("") +
        `<rect x="66" y="40" width="10" height="4" fill="${M.steel(x)}"/><rect x="66" y="150" width="10" height="4" fill="${M.steel(x)}"/>` +
        `<path d="M68 52Q68 34 100 34Q132 34 132 52V140Q132 158 100 158Q68 158 68 140Z" fill="${x.lg([[0, H.shade(c, -.4)], [.3, H.shade(c, .35)], [.55, c], [1, H.shade(c, -.5)]], 0, 0, 1, 0)}"/>` +
        ports.map((y) => `<rect x="128" y="${y - 3.5}" width="7" height="7" rx="1" fill="${M.metal(x, "#c9a24a")}"/>`).join("") +
        gauge(x, 100, 96, 9, Math.max(.05, x.on ? x.lv : x.lv * .6)) + `<path d="M74 44Q100 38 126 44" fill="none" stroke="#fff" stroke-opacity=".6"/>`;
      return scene(x, back, body); }),

    ic("stratified", "Stratified storage tank", sw(["#8e959e", "#c0392b", "#2f5fa8", "#2c2f36"], "#8e959e"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 174);
      const cp = clipU(x, "cut", `<rect x="86" y="34" width="28" height="128" rx="4"/>`);
      const body = shadowE(x, 100, 178, 48, 6) + [44, 80, 120, 156].map((y, i) => pipe(x, [142, y, 162, y, 178, y, 206, y], 5, i < 2 ? COP : "#1d1e22", i < 2 ? HOT : COLD, 5)).join("") +
        `<path d="M56 30Q56 14 100 12Q144 14 144 30V166Q144 176 100 176Q56 176 56 166Z" fill="${x.lg([[0, H.shade(c, -.45)], [.3, H.shade(c, .2)], [.55, c], [1, H.shade(c, -.55)]], 0, 0, 1, 0)}"/>` +
        (() => { let s = ""; for (let i = 0; i < 14; i++) s += `<path d="M58 ${22 + i * 11}Q100 ${26 + i * 11} 142 ${22 + i * 11}" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/>`; return s; })() +
        `<path d="M64 20V170" stroke="#1d1e22" stroke-width="2" stroke-dasharray="2 1.4"/>` +
        `<rect x="84" y="32" width="32" height="132" rx="5" fill="#1a1b1f"/><g clip-path="${cp}">${strata(x, 86, 34, 28, 128)}<path d="M89 36L96 36L90 160H89Z" fill="#fff" fill-opacity=".25"/></g>` +
        [52, 98, 144].map((y) => `<circle cx="122" cy="${y}" r="3" fill="${M.steel(x)}"/>`).join("") + cord(x, [122, 52, 128, 70, 126, 100, 130, 130, 128, 144, 132, 160, 134, 176], 1, "#e8e6dc");
      return scene(x, back, body); }),

    ic("fwswall", "Wall FWS, closed cover", sw(["#2c2f36", "#eef0f2", "#8e959e", "#c0392b"], "#2c2f36"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 192);
      const body = wallPipes(x, [66, 86, 114, 134], 150, null, [HOT, COLD, HOT, COLD]) +
        cab(x, 50, 26, 100, 126, c, 14) + `<path d="M56 40Q100 32 144 40" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>` +
        `<rect x="70" y="54" width="60" height="34" rx="6" fill="${x.lg([[0, "#eef0f2"], [1, "#b8bcc2"]])}"/>` + lcd(x, 76, 60, 34, 18, "#7ee7ff") + digits(x, 106, 63, 11, temp2(x), 2, "#bdf3ff") + led(x, 120, 69, 1.2, "#3ee08f") +
        tapIcon(x, 100, 110, 1.6, x.on) + vents(70, 124, 60, 3, 5);
      return scene(x, back, body); }),

    ic("fwscompact", "Compact FWS module", sw(["#c9ccd1", "#2c2f36", "#eef0f2"], "#c9ccd1"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 176);
      let plates = ""; for (let i = 0; i < 10; i++) plates += `<path d="M${112 + i * 2.6} 66V122" stroke="#fff" stroke-opacity="${i % 2 ? .3 : .1}" stroke-width="1.4"/>`;
      const body = `<path d="M8 20H60Q72 20 72 34V176H8Z" fill="${x.lg([[0, "#5a5f66"], [.6, "#9aa1aa"], [1, "#5a5f66"]], 0, 0, 1, 0)}"/>` +
        pipe(x, [72, 60, 90, 60, 100, 62, 108, 66], 5, COP, HOT, 4) + pipe(x, [72, 140, 90, 140, 100, 132, 110, 122], 5, COP, COLD, 4) +
        pipe(x, [140, 66, 160, 60, 176, 54, 206, 54], 4.4, COP, HOT, 5) + pipe(x, [140, 122, 160, 132, 176, 150, 176, 196], 4.4, COP, COLD, 5) +
        `<rect x="108" y="62" width="34" height="64" rx="2" fill="${M.steel(x)}"/>` + plates + `<rect x="108" y="62" width="34" height="6" fill="${M.steel(x)}"/><rect x="108" y="120" width="34" height="6" fill="${M.steel(x)}"/>` +
        `<rect x="84" y="128" width="24" height="18" rx="5" fill="${M.h(x, "#2f8f5e")}"/>` + fanCap(x, 96, 137, 6, "#2f8f5e") +
        `<rect x="146" y="80" width="30" height="24" rx="3" fill="${M.v(x, c)}"/>` + lcd(x, 149, 84, 24, 10, "#7ee7ff") + digits(x, 170, 86, 6, temp2(x), 2, "#bdf3ff") + led(x, 160, 99, .9, "#3ee08f");
      return scene(x, back, body); }),

    ic("fwscabinet", "FWS cabinet unit", sw(["#eef0f2", "#c9ccd1", "#2c2f36"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = basement(x, 172);
      const body = shadowE(x, 100, 176, 50, 6) + wallPipes(x, [72, 90, 110, 128], 20, null, [HOT, COLD, HOT, COLD]).replace(/<path/g, "<path") +
        cab(x, 56, 30, 88, 142, c, 3) + `<path d="M100 34V168" stroke="#000" stroke-opacity=".15"/><rect x="94" y="96" width="3" height="16" rx="1.5" fill="${M.steel(x)}"/><rect x="103" y="96" width="3" height="16" rx="1.5" fill="${M.steel(x)}"/>` +
        `<rect x="66" y="42" width="68" height="28" rx="3" fill="${x.lg([[0, "#22252c"], [1, "#0e1014"]])}"/>` + digits(x, 98, 47, 13, temp2(x), 2, "#bdf3ff") + tapIcon(x, 116, 54, 1.2, x.on) + segBar(x, 104, 62, 24, 3, 5, false, "#7ee7ff") +
        vents(66, 140, 68, 4, 5);
      return scene(x, back, body); }),
  ];
  const css = `
.hda-utility2-flow{opacity:0}
.hda-anim .hda-utility2-flow{animation:hda-utility2-flow 1.6s linear infinite}
@keyframes hda-utility2-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-utility2-pulse{animation:hda-utility2-pulse 2.6s ease-in-out infinite}
@keyframes hda-utility2-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-utility2-blink{animation:hda-utility2-blink 1.1s ease-in-out infinite}
@keyframes hda-utility2-blink{0%,100%{opacity:1}50%{opacity:.15}}
.hda-utility2-sweepx,.hda-utility2-sweepy{transform-box:fill-box}
.hda-anim .hda-utility2-sweepx{animation:hda-utility2-sx 2.2s linear infinite}
.hda-anim .hda-utility2-sweepy{animation:hda-utility2-sy 2.2s linear infinite}
@keyframes hda-utility2-sx{0%{transform:translate(0,0)}100%{transform:translate(400%,0)}}
@keyframes hda-utility2-sy{0%{transform:translate(0,0)}100%{transform:translate(0,-400%)}}
.hda-utility2-spin,.hda-utility2-spinslow{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-utility2-spin{animation:hda-utility2-spin .6s linear infinite}
.hda-anim .hda-utility2-spinslow{animation:hda-utility2-spin 24s linear infinite}
@keyframes hda-utility2-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.hda-utility2-flick{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-utility2-flick{animation:hda-utility2-flick .9s ease-in-out infinite alternate}
@keyframes hda-utility2-flick{0%{transform:scale(1,1)}50%{transform:scale(.9,1.12)}100%{transform:scale(1.06,.9)}}
.hda-utility2-steam{transform-box:fill-box}
.hda-anim .hda-utility2-steam{animation:hda-utility2-steam 2.4s ease-out infinite}
@keyframes hda-utility2-steam{0%{transform:translate(0,6px);opacity:0}30%{opacity:1}100%{transform:translate(0,-16px);opacity:0}}
.hda-utility2-heat{transform-box:fill-box}
.hda-anim .hda-utility2-heat{animation:hda-utility2-heat 1.8s ease-in-out infinite}
@keyframes hda-utility2-heat{0%{transform:translate(0,4px);opacity:0}40%{opacity:1}100%{transform:translate(0,-10px);opacity:0}}
.hda-anim .hda-utility2-glint{animation:hda-utility2-glint 7s ease-in-out infinite alternate}
@keyframes hda-utility2-glint{0%{transform:translate(-36px,0)}100%{transform:translate(70px,0)}}
.hda-utility2-track{transform-box:fill-box;transform-origin:50% 90%}
.hda-anim .hda-utility2-track{animation:hda-utility2-track 8s ease-in-out infinite alternate}
@keyframes hda-utility2-track{0%{transform:rotate(-4deg)}100%{transform:rotate(4deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-utility2-flow,.hda-anim .hda-utility2-pulse,.hda-anim .hda-utility2-blink,.hda-anim .hda-utility2-sweepx,.hda-anim .hda-utility2-sweepy,.hda-anim .hda-utility2-spin,.hda-anim .hda-utility2-spinslow,.hda-anim .hda-utility2-flick,.hda-anim .hda-utility2-steam,.hda-anim .hda-utility2-heat,.hda-anim .hda-utility2-glint{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "utility2", tab: "Boilers & heat", group: "Utility", kind: "device",
    intro: "Seventeen real boilers, heat pumps, circulators, buffer tanks and fresh-water stations in basements and utility rooms. On means running: displays light, flow moves in the pipes, pumps spin and flues shimmer. The slider is the output: temperatures, gauges and readouts follow it. The wall combi boiler has separate Heating and Hot water switches.",
    
    levelLabel: "Output", onWord: "Running", offWord: "Off",
    css, icons,
  });
})();
