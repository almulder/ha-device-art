(function () {
  const H = window.HDAH, P = "hda-utility3-";
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


  // (multi-function) the solar water heaters: State (heating / idle / vacation, a stage), the water temperature (a reading
  // on a small pipe- or tank-mounted readout: orange heating, white idle, blue vacation) and the circulation pump (a switch:
  // the hot pipe flows; the thermosiphon has no pump, its switch is the backup element glowing at the tank end). The
  // collectors look sunlit while heating (or, with no stage, while the pump runs). Without parts: today's drawing.
  const SOLP = (sw) => [{ id: "state", name: "State", type: "stage", values: [["idle", "Idle"], ["heating", "Heating"], ["vacation", "Vacation"]], def: "heating" },
    sw, { id: "temp", name: "Water temperature", type: "value", unit: "°", min: 40, max: 180, def: 130 }];
  function solMF(o, sid) {
    const pv = o.pval || {}, pp = o.parts || {}, st = pv.state != null && pv.state !== "" ? String(pv.state).toLowerCase() : null, t = pv.temp != null && pv.temp !== "" && isFinite(+pv.temp) ? Math.round(+pv.temp) : null;
    if (!o.mf && st == null && t == null) return null;
    const sw = pp[sid] != null && (o.mf || st == null) ? !!pp[sid] : st != null ? st === "heating" : !o.mf && !!o.on;
    return { st, t, sw, sun: st != null ? st === "heating" : sw };
  }
  const subOn = (x, on) => { const y = Object.create(x); y.on = on; y.an = on && x.o.anim; y.L = on ? .35 + .65 * x.lv : 0; return y; };
  // the readout: a small dark display; stem = [x, y] of the pipe it hangs from (or none)
  function solTag(x, S, cx, cy, stem) {
    if (!S || S.t == null) return "";
    const str = String(Math.max(-99, Math.min(999, S.t))), col = S.st === "vacation" ? "#7dd3fc" : S.st === "heating" || (S.st == null && S.sw) ? "#ffb070" : "#e8eef4", w = 7 + str.length * 5;
    return (stem ? `<path d="M${cx} ${cy + 5}L${stem[0]} ${stem[1]}" stroke="#2c2f36" stroke-width="1.6"/>` : "") +
      `<rect x="${f(cx - w / 2 - 1)}" y="${cy - 6.5}" width="${f(w + 2)}" height="13" rx="2.4" fill="#2c2f36"/><rect x="${f(cx - w / 2)}" y="${cy - 5.5}" width="${f(w)}" height="11" rx="1.6" fill="#0b0e12"/>` +
      digits(always(x), cx + w / 2 - 2.5, cy - 3.5, 7, str, str.length, col);
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


  function cab(x, x0, y0, w, h, col, r) {
    return box(x, x0, y0, w, h, r == null ? 4 : r, 5, 4, col) + `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${r == null ? 4 : r}" fill="${x.lg([[0, "#fff", .22], [.3, "#fff", 0], [.85, "#000", 0], [1, "#000", .2]], 0, 0, 1, 0)}"/>`;
  }
  const PANEL = ["#1c2b4a", "#101318", "#2f5592", "#26364d"];
  const sunny = (x, sx, sy) => skyB(x, 130, x.on) + (x.on ? sunG(x, sx, sy, 8) : cloud(x, sx - 10, sy + 4, 1, .85));
  function panelIn(x, x0, y0, w, h) {
    let brk = "";
    for (let i = 0; i < 7; i++) for (const bx of [x0 + 26, x0 + w / 2 + 2]) brk += `<rect x="${f(bx)}" y="${f(y0 + 50 + i * 13)}" width="${f(w / 2 - 28)}" height="11" rx="1.5" fill="${M.v(x, "#2c2f36")}"/><rect x="${f(bx + (bx < x0 + w / 2 ? w / 2 - 40 : 4))}" y="${f(y0 + 52.5 + i * 13)}" width="8" height="6" rx="1" fill="${M.v(x, "#1a1b1f")}"/>`;
    return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="3" fill="${x.lg([[0, "#9aa1aa"], [1, "#6c727a"]])}"/><rect x="${x0 + 8}" y="${y0 + 8}" width="${w - 16}" height="${h - 8}" fill="${x.lg([[0, "#d5d9de"], [1, "#b0b5bc"]])}"/>` +
      `<rect x="${f(x0 + w / 2 - 2)}" y="${y0 + 46}" width="4" height="96" fill="${M.steel(x)}"/>` + brk + `<rect x="${f(x0 + w / 2 - 30)}" y="${y0 + 26}" width="60" height="16" rx="2" fill="${M.steel(x)}"/>`;
  }
  const clampCT = (x, cx, cy, s) => `<rect x="${f(cx - 8 * s)}" y="${f(cy - 7 * s)}" width="${f(16 * s)}" height="${f(14 * s)}" rx="${f(4 * s)}" fill="${M.v(x, "#1d1e22")}"/><path d="M${f(cx - 3 * s)} ${f(cy)}H${f(cx + 3 * s)}" stroke="#3a3d44" stroke-width="${f(2 * s)}"/>`;

  const icons = [
    ic("tracker", "Dual-axis tracker", sw(PANEL, "#1c2b4a"), "Panel", (o) => { const x = X(o), c = o.color;
      const back = sunny(x, 156, 30) + treeLine(x, 132) + grassB(x, 132, "#4b7536", 61);
      const A = aff([42, 50], [160, 38], [56, 118]);
      const body = shadowE(x, 104, 176, 60, 6) + `<rect x="100" y="96" width="8" height="80" fill="${x.lg([[0, "#5a5f66"], [.5, "#c9ced5"], [1, "#4a4e55"]], 0, 0, 1, 0)}"/><rect x="92" y="172" width="24" height="6" rx="1" fill="#8e959e"/>` +
        `<g class="${x.on ? P + "track" : ""}"><path d="M${P2(A(0, 1))}L${P2(A(1, 1))}L${f(A(1, 1)[0] + 3)} ${f(A(1, 1)[1] + 5)}L${f(A(0, 1)[0] + 3)} ${f(A(0, 1)[1] + 5)}Z" fill="#2a2c31"/>` +
        solar(x, A, 4, 3, c, "#c3cad3", 4, 6) + glint(x, arrayClip(x, "trk", A), 40, 36, 120, 84) + `</g>` +
        `<rect x="96" y="88" width="16" height="12" rx="3" fill="${M.v(x, "#5a5f66")}"/><circle cx="104" cy="94" r="3" fill="${M.steel(x)}"/>` +
        pipe(x, [104, 172, 120, 180, 150, 184, 206, 186], 3, "#1d1e22", x.on ? "#ffd75e" : null, 6);
      return scene(x, back, body); }),

    ic("carport", "Solar carport", sw(PANEL, "#101318"), "Panel", (o) => { const x = X(o), c = o.color;
      const back = sunny(x, 40, 28) + `<rect x="8" y="104" width="184" height="40" fill="${x.lg([[0, "#b9a98e"], [1, "#9d8d74"]])}"/><rect x="120" y="112" width="40" height="32" fill="#5a4a3a"/>` + asphaltB(x, 144);
      const A = aff([20, 60], [186, 46], [28, 92]);
      const car = `<path d="M44 168L44 154Q46 146 58 144L76 140Q88 128 106 127L128 127Q142 128 152 140L160 143Q166 146 166 154L166 168Z" fill="${paint(x, "#9aa3ad")}"/>` +
        `<path d="M82 141Q92 131 106 130L126 130Q138 131 146 141Z" fill="${x.lg([[0, "#4d5b6c"], [1, "#151a22"]])}"/><circle cx="66" cy="168" r="12" fill="#111215"/><circle cx="146" cy="168" r="12" fill="#111215"/>` + wheel(x, 66, 168, 9.5) + wheel(x, 146, 168, 9.5);
      const body = `<path d="M30 96L34 176M176 82L172 176" stroke="${M.steel(x)}" stroke-width="5"/>` + shadowE(x, 105, 176, 80, 6) + car +
        `<path d="M${P2(A(0, 1))}L${P2(A(1, 1))}L${f(A(1, 1)[0])} ${f(A(1, 1)[1] + 5)}L${f(A(0, 1)[0])} ${f(A(0, 1)[1] + 5)}Z" fill="#2a2c31"/>` +
        solar(x, A, 6, 2, c, "#aab3bd", 4, 4) + glint(x, arrayClip(x, "cp", A), 20, 40, 166, 54) +
        pipe(x, [172, 120, 180, 140, 182, 160, 184, 176], 3, "#1d1e22", x.on ? "#ffd75e" : null, 5);
      return scene(x, back, body); }),

    ic("balcony", "Balcony solar panel", sw(PANEL, "#101318"), "Panel", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "cream", 8, 140) + `<rect x="120" y="20" width="60" height="96" fill="${x.lg([[0, "#8fb8dc"], [1, "#d6e8f5"]])}"/><path d="M150 20V116" stroke="#eef0f2" stroke-width="3"/><rect x="116" y="16" width="68" height="104" fill="none" stroke="#eef0f2" stroke-width="4"/>` +
        `<rect x="8" y="140" width="184" height="52" fill="${x.lg([[0, "#8a8784"], [1, "#6c6966"]])}"/>`;
      let rail = `<rect x="8" y="96" width="184" height="5" rx="2" fill="${M.steel(x)}"/>`; for (let i = 0; i < 14; i++) rail += `<rect x="${12 + i * 13.4}" y="100" width="2.4" height="62" fill="#5a5f66"/>`;
      const A = aff([24, 100], [112, 100], [30, 162]);
      const body = rail + `<rect x="8" y="160" width="184" height="4" fill="#4a4e55"/>` +
        `<path d="M${P2(A(0, 0))}L${P2(A(1, 0))}L${P2(A(1, 1))}L${P2(A(0, 1))}Z" fill="#000" fill-opacity=".3" transform="translate(3 3)"/>` + solar(x, A, 1, 1, c, "#2a2c31", 6, 10) + glint(x, arrayClip(x, "bal", A), 22, 98, 92, 66) +
        `<path d="M30 100L28 92M106 100L108 92" stroke="#1d1e22" stroke-width="2"/>` +
        `<rect x="66" y="164" width="22" height="14" rx="2" fill="${M.v(x, "#8e959e")}"/>` + led(x, 84, 168, .9, "#3ee08f") +
        cord(x, [88, 172, 110, 176, 130, 166, 150, 150, 160, 140, 166, 132, 168, 126], 2, "#1d1e22", x.on ? "#ffd75e" : null, 8) + plateT(x, 168, 124, .3) + plugHead(x, 168, 118.9, .3, "#1d1e22");
      return scene(x, back, body); }),

    ic("flat-wall-battery", "Flat wall battery", sw(["#eef0f2", "#2c2f36", "#c9ccd1"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color, col = lvlCol(x, "#7ee7ff");
      const back = wallB(x, "garage", 8, 170) + concreteB(x, 170, "#6c6f75");
      const fh = 100 * x.lv;
      const body = shadowE(x, 102, 174, 44, 5) + pipe(x, [100, 168, 100, 178, 120, 182, 150, 182, 180, 182, 196, 182, 206, 182], 4, "#9aa1aa", x.on ? GREEN : null, 6) +
        cab(x, 66, 26, 70, 144, c, 12) + `<path d="M74 32Q101 26 128 32" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.2"/>` +
        `<rect x="128" y="48" width="3" height="100" rx="1.5" fill="#0e1014" fill-opacity=".25"/>` +
        (x.on ? `<g class="${P}pulse"><rect x="124" y="${f(148 - fh)}" width="11" height="${f(fh)}" rx="5" fill="${col}" opacity="${a2(.4 * x.L)}"/></g>` : "") +
        `<rect x="128" y="${f(148 - fh)}" width="3" height="${f(Math.max(2, fh))}" rx="1.5" fill="${x.on ? H.mix(col, "#fff", .3) : H.mix(col, "#888", .6)}"/>`;
      return scene(x, back, body); }),

    ic("modular-battery", "Modular battery", sw(["#c9ccd1", "#8e959e", "#eef0f2"], "#c9ccd1"), "Finish", (o) => { const x = X(o), c = o.color, n = 4, lit = x.lv > .01 ? Math.max(1, Math.round(x.lv * n)) : 0;
      const back = sidingB(x, "#5c6670") + concreteB(x, 172, "#6c6f75");
      let brush = ""; for (let i = 0; i < 30; i++) brush += `<path d="M62 ${30 + i * 4.6}H138" stroke="#fff" stroke-opacity="${(i % 3 ? .05 : .1)}" stroke-width=".8"/>`;
      const body = shadowE(x, 102, 176, 46, 5) + pipe(x, [100, 26, 100, 16, 100, 10, 100, 6], 5, "#9aa1aa", x.on ? GREEN : null, 3) +
        cab(x, 60, 26, 80, 146, c, 3) + brush +
        `<rect x="88" y="84" width="24" height="4" rx="2" fill="${H.shade(c, -.15)}"/>` +
        Array.from({ length: n }, (_, i) => led(x, 88 + i * 8, 100, 1.3, i < lit ? lvlCol(x, GREEN) : "#3a3d44", i < lit ? .6 : 0)).join("") +
        `<path d="M60 160H140" stroke="#000" stroke-opacity=".2"/>`;
      return scene(x, back, body); }),

    ic("tall-battery-cabinet", "Tall battery cabinet", sw(["#eef0f2", "#c9ccd1", "#2c2f36"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color, col = lvlCol(x, "#7ee7ff");
      const back = sidingB(x, "#6b7a88") + concreteB(x, 166, "#7a7d83");
      const body = shadowE(x, 92, 176, 54, 6) + `<rect x="44" y="160" width="96" height="14" rx="2" fill="${x.lg([[0, "#5a5f66"], [1, "#2c2f36"]])}"/>` +
        cab(x, 44, 46, 96, 116, c, 10) + `<path d="M52 52Q92 46 132 52" fill="none" stroke="#fff" stroke-opacity=".6"/>` +
        segBar(x, 70, 62, 44, 3.4, 8, false, col) +
        cab(x, 150, 70, 28, 40, "#c9ccd1", 3) + led(x, 164, 80, 1, "#3ee08f") + pipe(x, [164, 110, 164, 130, 150, 140, 140, 140], 3, "#9aa1aa", x.on ? GREEN : null, 4);
      return scene(x, back, body); }),

    ic("flatplate", "Flat-plate collectors", sw(["#c9ccd1", "#2c2f36", "#8e959e"], "#c9ccd1"), "Frame", (o) => { const S = solMF(o, "pump"), x = X(S ? Object.assign({}, o, { on: S.sun }) : o), c = o.color;
      const roof = (() => { let s = `<path d="M8 110L192 80V192H8Z" fill="${x.lg([[0, "#8a4a3a"], [1, "#5a2e24"]])}"/>`;
        for (let i = 1; i < 12; i++) { const y = 110 + i * 8.5, y2 = 80 + i * 8.5; s += `<path d="M8 ${f(y)}L192 ${f(y2)}" stroke="#2a120c" stroke-opacity=".6" stroke-width="1.4"/>`; }
        return s; })();
      const back = sunny(x, 156, 30) + roof;
      const panel = (A, k) => { const q = [A(0, 0), A(1, 0), A(1, 1), A(0, 1)]; let fins = "";
        for (let i = 1; i < 12; i++) fins += `<path d="M${P2(A(i / 12, .04))}L${P2(A(i / 12, .96))}" stroke="#0a1220" stroke-opacity=".5" stroke-width=".8"/>`;
        return `<path d="M${P2(q[0])}L${P2(q[1])}L${P2(q[2])}L${P2(q[3])}Z" fill="#000" fill-opacity=".35" transform="translate(3 5)"/><path d="M${P2(q[0])}L${P2(q[1])}L${P2(q[2])}L${P2(q[3])}Z" fill="${x.lg([[0, x.on ? "#2a4a8a" : "#1c2b4a"], [1, "#0e1626"]], 0, 0, 1, 1)}" stroke="${c}" stroke-width="2.4"/>` + fins +
          glint(x, arrayClip(x, "fp" + k, A), q[3][0], q[1][1], q[1][0] - q[3][0], q[3][1] - q[1][1]); };
      const body = panel(aff([30, 92], [98, 80], [42, 158]), 1) + panel(aff([104, 79], [172, 67], [116, 145]), 2) +
        pipe(S ? subOn(x, S.sw) : x, [172, 70, 184, 64, 190, 80, 194, 100, 198, 120, 204, 140, 208, 160], 4, COP, HOT, 7) + solTag(x, S, 176, 48, [184, 64]);
      return scene(x, back, body); }, { parts: SOLP({ id: "pump", name: "Circulation pump" }) }),

    ic("tubeground", "Evacuated-tube array", sw(["#c9ccd1", "#2c2f36", "#eef0f2"], "#c9ccd1"), "Frame", (o) => { const S = solMF(o, "pump"), x = X(S ? Object.assign({}, o, { on: S.sun }) : o), c = o.color;
      const back = sunny(x, 40, 28) + treeLine(x, 128) + grassB(x, 128, "#4b7536", 71);
      const A = aff([30, 60], [176, 48], [40, 140]); let tubes = "";
      for (let i = 0; i < 18; i++) { const u = (i + .5) / 18, p0 = A(u, .07), p1 = A(u, 1);
        tubes += `<path d="M${P2(p0)}L${P2(p1)}" stroke="#0e1a2e" stroke-width="6" stroke-linecap="round"/><path d="M${P2(p0)}L${P2(p1)}" stroke="${x.on ? "#2f5592" : "#1c2b4a"}" stroke-width="4" stroke-linecap="round"/><path d="M${f(p0[0] - 1.4)} ${f(p0[1])}L${f(p1[0] - 1.4)} ${f(p1[1])}" stroke="#fff" stroke-opacity="${x.on ? .55 : .25}" stroke-width=".9" stroke-linecap="round"/>`; }
      const h0 = A(0, 0), h1 = A(1, 0), b0 = A(0, 1), b1 = A(1, 1);
      const body = shadowE(x, 106, 168, 80, 6) + [[.05], [.5], [.95]].map(([u]) => { const t = A(u, 0), b = A(u, 1); return `<path d="M${P2(t)}L${f(t[0] + 6)} 166M${P2(b)}L${f(b[0])} 166M${f(t[0] + 6)} 166L${P2(b)}" stroke="${M.steel(x)}" stroke-width="2.4"/>`; }).join("") +
        tubes + `<path d="M${P2(b0)}L${P2(b1)}" stroke="${M.steel(x)}" stroke-width="3"/>` +
        `<path d="M${f(h0[0] - 4)} ${f(h0[1] - 3)}L${f(h1[0] + 4)} ${f(h1[1] - 3)}L${f(h1[0] + 4)} ${f(h1[1] + 8)}L${f(h0[0] - 4)} ${f(h0[1] + 8)}Z" fill="${x.lg([[0, H.shade(c, .4)], [1, H.shade(c, -.3)]])}"/>` +
        pipe(S ? subOn(x, S.sw) : x, [h1[0] + 4, h1[1] + 3, 186, 60, 190, 100, 192, 140, 194, 160, 196, 170, 200, 180], 4, "#1d1e22", HOT, 7) +
        glint(x, arrayClip(x, "tg", A), 30, 44, 150, 100) + solTag(x, S, 176, 28, [h1[0] + 3, h1[1] - 2]);
      return scene(x, back, body); }, { parts: SOLP({ id: "pump", name: "Circulation pump" }) }),

    ic("thermosiphon", "Thermosiphon heater", sw(["#c9ccd1", "#eef0f2", "#2c2f36"], "#c9ccd1"), "Tank", (o) => { const S = solMF(o, "element"), x = X(S ? Object.assign({}, o, { on: S.st != null ? S.st === "heating" : !!o.on && !o.mf }) : o), c = o.color;
      const back = sunny(x, 160, 28) + `<rect x="8" y="150" width="184" height="42" fill="${x.lg([[0, "#9d9a95"], [1, "#77746f"]])}"/><path d="M8 150H192" stroke="#fff" stroke-opacity=".3"/>`;
      const A = aff([44, 80], [156, 80], [36, 140]); let fins = "";
      for (let i = 1; i < 14; i++) fins += `<path d="M${P2(A(i / 14, .04))}L${P2(A(i / 14, .96))}" stroke="#0a1220" stroke-opacity=".5" stroke-width=".8"/>`;
      const body = shadowE(x, 100, 164, 76, 6) +
        `<path d="M44 80L36 160M156 80L164 160M150 64L156 160M50 64L44 160" stroke="${M.steel(x)}" stroke-width="2.6"/><path d="M36 160H164" stroke="#5a5f66" stroke-width="3"/>` +
        `<path d="M${P2(A(0, 0))}L${P2(A(1, 0))}L${P2(A(1, 1))}L${P2(A(0, 1))}Z" fill="${x.lg([[0, x.on ? "#2a4a8a" : "#1c2b4a"], [1, "#0e1626"]], 0, 0, 1, 1)}" stroke="#aab3bd" stroke-width="2.4"/>` + fins +
        glint(x, arrayClip(x, "ts", A), 36, 80, 128, 60) +
        `<rect x="38" y="52" width="124" height="26" rx="13" fill="${x.lg([[0, H.shade(c, .5)], [.4, c], [1, H.shade(c, -.45)]])}"/><ellipse cx="38" cy="65" rx="5" ry="13" fill="${H.shade(c, -.25)}"/><ellipse cx="162" cy="65" rx="5" ry="13" fill="${H.shade(c, .1)}"/>` +
        `<path d="M44 56H156" stroke="#fff" stroke-opacity=".5"/>` + pipe(x, [150, 76, 166, 96, 172, 130, 172, 150], 3, COP, HOT, 5) + steam(x, 170, 40, 1, .25) +
        (S && o.parts && o.parts.element != null ? (S.sw ? `<ellipse cx="163" cy="65" rx="9" ry="16" fill="#ff8a3a" opacity=".22"/>` : "") + `<rect x="160" y="58" width="9" height="14" rx="2" fill="#2c2f36"/><circle cx="164.5" cy="62" r="1.4" fill="${S.sw ? "#ff8a3a" : "#4a4e56"}"/><path d="M162 66.5h5M162 68.5h5" stroke="#000" stroke-opacity=".5" stroke-width=".7"/>` : "") +
        solTag(x, S, 100, 65);
      return scene(x, back, body); }, { parts: SOLP({ id: "element", name: "Backup element" }) }),

    ic("smartmeter", "Utility smart meter", sw(["#8e959e", "#c9ccd1", "#2c2f36"], "#8e959e"), "Base", (o) => { const x = X(o), c = o.color;
      const back = sidingB(x, "#7a8590");
      const kwh = String(Math.round(10000 + 89999 * x.lv)).slice(0, 5);
      const body = pipe(x, [100, 150, 100, 170, 100, 186, 100, 196], 10, "#9aa1aa") + pipe(x, [100, 6, 100, 20, 100, 30, 100, 40], 8, "#1d1e22") +
        cab(x, 58, 36, 84, 118, c, 6) + shadowE(x, 102, 108, 40, 40, .5) +
        `<circle cx="100" cy="96" r="38" fill="${M.steel(x)}"/><circle cx="100" cy="96" r="34" fill="${x.rg([[0, "#f2f4f7"], [1, "#c9ced5"]])}"/>` +
        `<rect x="76" y="80" width="48" height="16" rx="2" fill="${x.lg([[0, "#9fb8a8"], [1, "#7f9a88"]])}"/>` + digits(always(x), 121, 83, 10, kwh, 5, "#1d2a22").replace(/fill="#fff" fill-opacity=".05"/g, 'fill="#000" fill-opacity=".06"') +
        (x.on ? `<g class="${P}blink">${led(x, 88, 106, 1.3, "#ff3b3b")}</g>` : led(x, 88, 106, 1.3, "#ff3b3b")) + `<rect x="96" y="104" width="16" height="4" rx="1" fill="#c9ced5"/>` +
        `<circle cx="100" cy="96" r="34" fill="${x.lg([[0, "#fff", .45], [.4, "#fff", 0], [1, "#fff", .1]], 0, 0, 1, 1)}"/><path d="M76 74A30 30 0 0 1 112 64" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.4" stroke-linecap="round"/>`;
      return scene(x, back, body); }),

    ic("in-panel-monitor", "In-panel monitor", sw(["#eef0f2", "#2c2f36", "#c9ccd1"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "garage", 8, 192);
      let small = ""; for (let i = 0; i < 6; i++) { const y = 84 + i * 13, bx = i % 2 ? 108 : 70; small += `<rect x="${bx + 12}" y="${y + 2}" width="6" height="7" rx="1.5" fill="#1d1e22"/>` + cord(x, [bx + 15, y + 9, bx + 20, y + 20, 150, y + 10, 156, 96], .8, "#2a2c31", x.on ? GREEN : null, 4); }
      const kw = (x.on ? x.lv * 9.9 : 0).toFixed(1).replace(".", "");
      const body = panelIn(x, 26, 14, 148, 178) + `<path d="M76 8C78 30 80 40 82 54M124 8C122 30 120 40 118 54" fill="none" stroke="#111" stroke-width="7"/>` +
        clampCT(x, 80, 34, 1) + clampCT(x, 121, 34, 1) + small +
        cord(x, [86, 34, 120, 40, 146, 50, 152, 70, 156, 80, 156, 86, 156, 90], 1.4, "#2a2c31", x.on ? GREEN : null, 6) +
        cab(x, 142, 86, 30, 34, c, 8) + led(x, 157, 100, 1.4, "#3ee08f") + (x.on ? `<g class="${P}blink">${led(x, 157, 108, .9, "#4da3ff")}</g>` : led(x, 157, 108, .9, "#4da3ff"));
      return scene(x, back, body); }),

    ic("clip-on-energy-monitor", "Clip-on energy monitor", sw(["#eef0f2", "#2c2f36", "#c9ccd1"], "#eef0f2"), "Finish", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "garage", 8, 192);
      const body = `<rect x="28" y="20" width="96" height="164" rx="3" fill="${x.lg([[0, "#b0b5bc"], [1, "#8e959e"]])}"/><rect x="34" y="26" width="84" height="152" rx="2" fill="${x.lg([[0, "#c9ced5"], [1, "#a9aeb5"]], 0, 0, 1, 0)}"/>` +
        `<rect x="108" y="96" width="6" height="16" rx="2" fill="${M.steel(x)}"/><path d="M38 30H114" stroke="#fff" stroke-opacity=".4"/>` +
        pipe(x, [124, 60, 132, 60, 136, 60, 140, 60], 5, "#9aa1aa") +
        cab(x, 138, 44, 38, 50, c, 6) + `<rect x="138" y="44" width="38" height="8" rx="4" fill="#ff7a3a"/>` +
        `<path d="M170 44V22" stroke="#2a2c31" stroke-width="3" stroke-linecap="round"/><circle cx="170" cy="21" r="2.4" fill="#2a2c31"/>` +
        (x.on ? `<g class="${P}blink">${led(x, 157, 74, 1.4, "#3ee08f")}</g>` : led(x, 157, 74, 1.4, "#3ee08f")) +
        (x.on ? [0, 1, 2].map((i) => `<path class="${P}pulse" style="animation-delay:${-i * .4}s" d="M${163 - i * 0} ${16 - i * 5}a${8 + i * 5} ${8 + i * 5} 0 0 1 14 0" fill="none" stroke="#7ee7ff" stroke-opacity="${a2(.6 - i * .15)}" stroke-width="1.2"/>`).join("") : "");
      return scene(x, back, body); }),
  ];
  const css = `
.hda-utility3-flow{opacity:0}
.hda-anim .hda-utility3-flow{animation:hda-utility3-flow 1.6s linear infinite}
@keyframes hda-utility3-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-utility3-pulse{animation:hda-utility3-pulse 2.6s ease-in-out infinite}
@keyframes hda-utility3-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-utility3-blink{animation:hda-utility3-blink 1.1s ease-in-out infinite}
@keyframes hda-utility3-blink{0%,100%{opacity:1}50%{opacity:.15}}
.hda-utility3-sweepx,.hda-utility3-sweepy{transform-box:fill-box}
.hda-anim .hda-utility3-sweepx{animation:hda-utility3-sx 2.2s linear infinite}
.hda-anim .hda-utility3-sweepy{animation:hda-utility3-sy 2.2s linear infinite}
@keyframes hda-utility3-sx{0%{transform:translate(0,0)}100%{transform:translate(400%,0)}}
@keyframes hda-utility3-sy{0%{transform:translate(0,0)}100%{transform:translate(0,-400%)}}
.hda-utility3-spin,.hda-utility3-spinslow{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-utility3-spin{animation:hda-utility3-spin .6s linear infinite}
.hda-anim .hda-utility3-spinslow{animation:hda-utility3-spin 24s linear infinite}
@keyframes hda-utility3-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.hda-utility3-flick{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-utility3-flick{animation:hda-utility3-flick .9s ease-in-out infinite alternate}
@keyframes hda-utility3-flick{0%{transform:scale(1,1)}50%{transform:scale(.9,1.12)}100%{transform:scale(1.06,.9)}}
.hda-utility3-steam{transform-box:fill-box}
.hda-anim .hda-utility3-steam{animation:hda-utility3-steam 2.4s ease-out infinite}
@keyframes hda-utility3-steam{0%{transform:translate(0,6px);opacity:0}30%{opacity:1}100%{transform:translate(0,-16px);opacity:0}}
.hda-utility3-heat{transform-box:fill-box}
.hda-anim .hda-utility3-heat{animation:hda-utility3-heat 1.8s ease-in-out infinite}
@keyframes hda-utility3-heat{0%{transform:translate(0,4px);opacity:0}40%{opacity:1}100%{transform:translate(0,-10px);opacity:0}}
.hda-anim .hda-utility3-glint{animation:hda-utility3-glint 7s ease-in-out infinite alternate}
@keyframes hda-utility3-glint{0%{transform:translate(-36px,0)}100%{transform:translate(70px,0)}}
.hda-utility3-track{transform-box:fill-box;transform-origin:50% 90%}
.hda-anim .hda-utility3-track{animation:hda-utility3-track 8s ease-in-out infinite alternate}
@keyframes hda-utility3-track{0%{transform:rotate(-4deg)}100%{transform:rotate(4deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-utility3-flow,.hda-anim .hda-utility3-pulse,.hda-anim .hda-utility3-blink,.hda-anim .hda-utility3-sweepx,.hda-anim .hda-utility3-sweepy,.hda-anim .hda-utility3-spin,.hda-anim .hda-utility3-spinslow,.hda-anim .hda-utility3-flick,.hda-anim .hda-utility3-steam,.hda-anim .hda-utility3-heat,.hda-anim .hda-utility3-glint{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "utility3", tab: "Solar, batteries & meters", group: "Utility", kind: "device",
    intro: "Twelve real solar arrays, home batteries, solar water heaters and power meters on roofs, walls and yards. On means producing or charging: energy runs along the cables, the sun glint drifts, meters blink. The slider is the level: output, charge or power.",
    
    levelLabel: "Level", onWord: "On", offWord: "Off",
    css, icons,
  });
})();
