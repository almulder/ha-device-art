(function () {
  const H = window.HDAH, P = "hda-camdoorbells-";
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
  const rr = (x0, y0, w, h, r) => `M${f(x0 + r)} ${f(y0)}H${f(x0 + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0 + w)} ${f(y0 + r)}V${f(y0 + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0 + w - r)} ${f(y0 + h)}H${f(x0 + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0)} ${f(y0 + h - r)}V${f(y0 + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x0 + r)} ${f(y0)}Z`;
  const RING = ["#4da3ff", "#ffffff", "#3ee08f", "#ffb347", "#ff5a7a"];
  const FACE = { nickel: "#b9bcc0", bronze: "#6e5a48", black: "#232428", white: "#eef0f2", pearl: "#e6e2da", silver: "#d5d8dc" };

  function backdrop(x, kind) {
    let wall = "";
    if (kind === "brick") { const r = rnd(9); wall = `<rect x="8" y="8" width="184" height="184" fill="#5a3226"/>`;
      for (let row = 0, y = 8; y < 192; y += 10, row++) for (let bx = 8 - (row % 2) * 12; bx < 150; bx += 24) wall += `<rect x="${bx + .8}" y="${y + .8}" width="22.4" height="8.4" rx=".8" fill="${H.mix("#a2533a", "#7a3a28", r())}"/>`; }
    else { wall = `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#8a96a2"], [1, "#6c7884"]])}"/>`;
      for (let y = 8; y < 192; y += 14) wall += `<rect x="8" y="${y}" width="184" height="14" fill="${x.lg([[0, "#fff", .0], [1, "#fff", .1]])}"/><path d="M8 ${y + 13}H192" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`; }
    return wall + `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#000", .12], [1, "#000", .3]], 0, 0, 1, 0)}"/>` +
      `<rect x="134" y="8" width="58" height="184" fill="${x.lg([[0, "#3a2a22"], [.1, "#6a4a36"], [1, "#4a3426"]], 0, 0, 1, 0)}"/><rect x="146" y="20" width="46" height="70" rx="2" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/><rect x="146" y="102" width="46" height="80" rx="2" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>` +
      `<circle cx="152" cy="98" r="4" fill="${M.metal(x, "#c9a24a")}"/>` +
      `<rect x="66" y="8" width="64" height="184" fill="${x.lg([[0, "#d9d5cc"], [.5, "#f4f1ea"], [1, "#c9c4ba"]], 0, 0, 1, 0)}"/><path d="M66 8V192M130 8V192" stroke="#000" stroke-opacity=".3"/><rect x="128" y="8" width="6" height="184" fill="#000" fill-opacity=".25"/>`;
  }

  function lens(x, cx, cy, r, st, ir) {
    const live = st === "live";
    let s = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.25)}" fill="#05060a"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, live ? "#3a5a8a" : "#1d2436"], [.6, "#0a0d16"], [1, "#000"]], .42, .4, .65)}"/>` +
      `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .45)}" fill="#020306"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .75)}" fill="none" stroke="${live ? "#6aa8ff" : "#5a4a8a"}" stroke-opacity="${live ? .8 : .35}" stroke-width="${f(r * .12)}"/>` +
      `<ellipse cx="${f(cx - r * .35)}" cy="${f(cy - r * .38)}" rx="${f(r * .28)}" ry="${f(r * .16)}" fill="#fff" fill-opacity=".7" transform="rotate(-35 ${f(cx - r * .35)} ${f(cy - r * .38)})"/>`;
    if (live) s += `<g class="${P}glow"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.9)}" fill="${M.halo(x, "#6aa8ff")}" opacity=".55"/></g>`;
    if (ir) for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6; s += `<circle cx="${f(cx + Math.cos(a) * r * 1.6)}" cy="${f(cy + Math.sin(a) * r * 1.6)}" r="${f(r * .16)}" fill="#ff3a4a" opacity=".9"/><circle cx="${f(cx + Math.cos(a) * r * 1.6)}" cy="${f(cy + Math.sin(a) * r * 1.6)}" r="${f(r * .5)}" fill="${M.halo(x, "#ff3a4a")}" opacity=".5"/>`; }
    return s;
  }
  function btnR(x, cx, cy, r, c2, st, face, sq) {
    const lit = st === "ring" ? 1 : st === "idle" ? .45 : .7, shape = (rad, w) => sq ? `<rect x="${f(cx - rad)}" y="${f(cy - rad)}" width="${f(rad * 2)}" height="${f(rad * 2)}" rx="${f(rad * .35)}" fill="none" stroke-width="${f(w)}"` : `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="none" stroke-width="${f(w)}"`;
    let s = (sq ? `<rect x="${f(cx - r)}" y="${f(cy - r)}" width="${f(r * 2)}" height="${f(r * 2)}" rx="${f(r * .35)}"` : `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}"`) + ` fill="${x.rg([[0, H.shade(face, .25)], [1, H.shade(face, -.25)]], .4, .35, .75)}"/>`;
    s += `${shape(r * .82, r * .2)} stroke="${H.mix(c2, "#000", .55)}"/>`;
    s += `<g class="${st === "ring" ? P + "pulse" : ""}">${shape(r * .82, r * .55)} stroke="${c2}" stroke-opacity="${(.25 * lit).toFixed(2)}"/>${shape(r * .82, r * .18)} stroke="${H.mix(c2, "#fff", .35)}" stroke-opacity="${lit.toFixed(2)}"/></g>`;
    s += sq ? `<path d="M${f(cx - r * .3)} ${f(cy + r * .25)}h${f(r * .6)}M${f(cx)} ${f(cy - r * .4)}q${f(r * .3)} 0 ${f(r * .3)} ${f(r * .4)}v${f(r * .25)}h${f(-r * .6)}v${f(-r * .25)}q0 ${f(-r * .4)} ${f(r * .3)} ${f(-r * .4)}" fill="none" stroke="${H.mix(c2, "#fff", .4)}" stroke-width=".7"/>` : `<ellipse cx="${f(cx - r * .25)}" cy="${f(cy - r * .3)}" rx="${f(r * .35)}" ry="${f(r * .18)}" fill="#fff" fill-opacity=".35"/>`;
    return s;
  }
  const speaker = (x, cx, cy, w, n, st, col) => { let s = ""; for (let i = 0; i < n; i++) { const xx = cx - w / 2 + i * w / (n - 1);
    s += `<rect class="${st === "talk" ? P + "spk" : ""}" style="animation-delay:${(-i * .13).toFixed(2)}s" x="${f(xx - .6)}" y="${f(cy - 2.2)}" width="1.2" height="4.4" rx=".6" fill="${col || "#000"}" fill-opacity=".55"/>`; } return s; };
  const statusLed = (x, cx, cy, st) => { const on = st === "motion" || st === "live"; const c = st === "motion" ? "#ff4a3a" : "#3ee08f";
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.1" fill="${on ? c : "#2a2c33"}"/>` + (on ? `<circle class="${P}blink" cx="${f(cx)}" cy="${f(cy)}" r="3.4" fill="${M.halo(x, c)}"/>` : ""); };
  const battery = (x, cx, cy, isBat) => { if (!isBat) return ""; const lv = x.lv, c = lv < .2 ? "#ff4a3a" : lv < .4 ? "#ffb347" : "#3ee08f";
    return `<rect x="${f(cx - 6)}" y="${f(cy - 2)}" width="11" height="4" rx="1" fill="#0b0c0f" stroke="#c9ced5" stroke-width=".5"/><rect x="${f(cx + 5.2)}" y="${f(cy - .9)}" width="1" height="1.8" fill="#c9ced5"/><rect x="${f(cx - 5.2)}" y="${f(cy - 1.2)}" width="${f(9.4 * Math.max(.06, lv))}" height="2.4" fill="${c}"/>`; };
  function overlay(x, st, cx, lensY, btnY, w) {
    let s = "";
    if (st === "ring") s += `<g>` + [0, 1, 2].map((i) => `<path class="${P}wave" style="animation-delay:${(-i * .45).toFixed(2)}s" d="M${f(cx - w / 2 - 6 - i * 7)} ${f(btnY - 10 - i * 4)}q${f(-6)} ${f(10 + i * 4)} 0 ${f(20 + i * 8)}M${f(cx + w / 2 + 6 + i * 7)} ${f(btnY - 10 - i * 4)}q6 ${f(10 + i * 4)} 0 ${f(20 + i * 8)}" fill="none" stroke="#fff" stroke-opacity="${(.7 - i * .18).toFixed(2)}" stroke-width="1.6" stroke-linecap="round"/>`).join("") + `</g>`;
    if (st === "motion") s += `<g class="${P}sweep">` + [0, 1].map((i) => `<path d="M${f(cx - 12 - i * 8)} ${f(lensY - 14 - i * 6)}a${f(16 + i * 8)} ${f(16 + i * 8)} 0 0 1 ${f(24 + i * 16)} 0" fill="none" stroke="#ff8a6a" stroke-opacity="${(.7 - i * .25).toFixed(2)}" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="3 3"/>`).join("") + `</g>`;
    if (st === "live") s += `<circle class="${P}blink" cx="${f(cx + w / 2 + 8)}" cy="${f(lensY - 12)}" r="3" fill="#ff3b3b"/>`;
    if (st === "talk") s += `<g>` + [0, 1].map((i) => `<path class="${P}wave" style="animation-delay:${(-i * .5).toFixed(2)}s" d="M${f(cx + w / 2 + 5 + i * 6)} ${f(lensY - 4)}q5 6 0 12" fill="none" stroke="#7ee7ff" stroke-width="1.4" stroke-linecap="round"/>`).join("") + `</g>`;
    return s;
  }
  function mount(x, kind, x0, y0, w, h, r, col) {
    if (kind === "wedge") return `<path d="${rr(x0 - 5, y0 + 2, w + 2, h - 4, r)}" fill="${x.lg([[0, "#0e0f12"], [1, "#2a2c31"]], 0, 0, 1, 0)}"/>`;
    if (kind === "corner") return `<path d="${rr(x0 - 2, y0 + 3, w + 4, h + 3, r)}" fill="${x.lg([[0, "#2a2c31"], [1, "#0e0f12"]])}"/><path d="${rr(x0 - 4, y0 + 4, w + 2, h - 2, r)}" fill="#16171a"/>`;
    return "";
  }
  const shell = (x, x0, y0, w, h, r, col, soft) => `<path d="${rr(x0 + 1.5, y0 + 3, w, h, r)}" fill="#000" fill-opacity=".35"/><path d="${rr(x0, y0, w, h, r)}" fill="${x.lg([[0, H.shade(col, -.3)], [.18, H.shade(col, soft ? .15 : .35)], [.55, col], [1, H.shade(col, -.35)]], 0, 0, 1, 0)}"/>` +
    `<path d="${rr(x0, y0, w, h, r)}" fill="${x.lg([[0, "#fff", .18], [.3, "#fff", 0], [1, "#000", .15]])}"/><path d="${rr(x0 + .6, y0 + .6, w - 1.2, h - 1.2, Math.max(.5, r - .6))}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`;
  const glassW = (x, x0, y0, w, h, r) => `<path d="${rr(x0, y0, w, h, r)}" fill="${x.lg([[0, "#2a2d34"], [.5, "#0d0e12"], [1, "#16181d"]])}"/><path d="M${f(x0 + 2)} ${f(y0 + 2)}L${f(x0 + w * .55)} ${f(y0 + 2)}L${f(x0 + 2)} ${f(y0 + h * .6)}Z" fill="#fff" fill-opacity=".09"/>`;
  function irDots(x, cx, cy, n, sp, on) { let s = ""; for (let i = 0; i < n; i++) { const xx = cx - (n - 1) * sp / 2 + i * sp; s += `<circle cx="${f(xx)}" cy="${f(cy)}" r="1.1" fill="${on ? "#ff3a4a" : "#1a1b20"}"/>` + (on ? `<circle cx="${f(xx)}" cy="${f(cy)}" r="3" fill="${M.halo(x, "#ff3a4a")}" opacity=".5"/>` : ""); } return s; }
  function pkgLight(x, cx, cy, on) { return on ? `<path d="M${f(cx - 5)} ${f(cy + 2)}L${f(cx - 18)} ${f(cy + 40)}H${f(cx + 18)}L${f(cx + 5)} ${f(cy + 2)}Z" fill="${x.lg([[0, "#fff6d8", .55], [1, "#fff6d8", 0]])}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="2.2" fill="#fffbe8"/><circle cx="${f(cx)}" cy="${f(cy)}" r="6" fill="${M.halo(x, "#fff6d8")}"/>` : `<circle cx="${f(cx)}" cy="${f(cy)}" r="1.6" fill="#3a3c42"/>`; }

  function model(x, id, o, st, c, c2) {
    const opt = o.opt || {}, ir = opt.ir === "on", pkg = opt.pkg === "on";
    const MNT = opt.mount || "flat";
    let s = "", geo = { cx: 98, lensY: 60, btnY: 120, w: 32 }, bat = false;
    if (id === "classic") { const m = opt.model || "battery";
      if (m === "slimwired") { const x0 = 84, y0 = 44, w = 28, h = 96; s += mount(x, MNT, x0, y0, w, h, 4) + shell(x, x0, y0, w, h, 4, c) + glassW(x, x0 + 3, y0 + 3, w - 6, h - 6, 2.5) + lens(x, 98, 58, 4.4, st, ir) + statusLed(x, 106, 52, st) + btnR(x, 98, 108, 7.4, c2, st, "#16181d") + speaker(x, 98, 133, 12, 6, st, "#fff"); geo = { cx: 98, lensY: 58, btnY: 108, w };
      } else { const tall = m === "plus" ? 46 : m === "wired" ? 38 : 34, w = m === "wired" ? 30 : 36, h = m === "wired" ? 100 : 104, x0 = 98 - w / 2, y0 = 40;
        bat = m !== "wired"; s += mount(x, MNT, x0, y0, w, h, 5) + shell(x, x0, y0, w, h, 5, c) + `<path d="M${f(x0)} ${f(y0 + 5)}A5 5 0 0 1 ${f(x0 + 5)} ${y0}H${f(x0 + w - 5)}A5 5 0 0 1 ${f(x0 + w)} ${f(y0 + 5)}V${f(y0 + tall)}H${f(x0)}Z" fill="${x.lg([[0, "#2a2d34"], [1, "#0b0c10"]])}"/>` +
          lens(x, 98, y0 + tall * .5, m === "plus" ? 5.4 : 5, st, ir) + statusLed(x, 98 + w / 2 - 5, y0 + 5, st) + btnR(x, 98, y0 + tall + 30, w * .28, c2, st, c) + speaker(x, 98, y0 + h - 9, w * .4, 6, st) + battery(x, 98, y0 + h + 9, bat);
        geo = { cx: 98, lensY: y0 + tall * .5, btnY: y0 + tall + 30, w }; } }
    else if (id === "propoe") { const m = opt.model || "std", x0 = 84, w = 28, y0 = m === "std" ? 42 : 34, h = m === "std" ? 100 : 118, front = c;
      s += mount(x, MNT, x0, y0, w, h, 6) + shell(x, x0, y0, w, h, 6, front);
      if (m === "std") { s += glassW(x, x0 + 3, y0 + 3, w - 6, 36, 4) + lens(x, 98, y0 + 16, 5, st, ir) + irDots(x, 98, y0 + 29, 3, 5, ir) + btnR(x, 98, y0 + 54, 7.2, c2, st, front) +
          `<rect x="${x0 + 7}" y="${y0 + 70}" width="${w - 14}" height="12" rx="1.6" fill="#05070c"/>` + (o.on ? `<path d="M${x0 + 10} ${y0 + 76}h${w - 20}" stroke="#4da3ff" stroke-width="1.4" stroke-dasharray="2 1"/>` : "") + speaker(x, 98, y0 + 92, 10, 5, st); geo = { cx: 98, lensY: y0 + 16, btnY: y0 + 54, w }; }
      else { s += glassW(x, x0 + 3, y0 + 3, w - 6, 30, 4) + lens(x, 98, y0 + 13, 4.6, st, ir) + `<circle cx="92" cy="${y0 + 25}" r="2.1" fill="#05070c"/><circle cx="104" cy="${y0 + 25}" r="2.1" fill="#05070c"/>` + irDots(x, 98, y0 + 25, 2, 4, ir) +
          btnR(x, 98, y0 + 48, 7.4, c2, st, front) + (m === "poe" ? `<g fill="none" stroke="${H.shade(front, -.35)}" stroke-width=".5">${[2, 3.5, 5].map((r) => `<path d="M${f(98 - r)} ${y0 + 48}a${r} ${r} 0 0 1 ${f(2 * r)} 0"/>`).join("")}</g>` : "") +
          `<rect x="${x0 + 5}" y="${y0 + 63}" width="${w - 10}" height="22" rx="2" fill="#05070c"/>` + (o.on ? `<rect x="${x0 + 8}" y="${y0 + 72}" width="${w - 16}" height="3" rx="1" fill="#4da3ff"/><circle cx="98" cy="${y0 + 67}" r="1.4" fill="#4da3ff"/>` : "") +
          `<path d="M${x0 + 10} ${y0 + 93}h8M${x0 + 10} ${y0 + 96}h8" stroke="${H.shade(front, -.3)}" stroke-width=".6"/>` +
          `<rect x="${x0 + 7}" y="${y0 + 100}" width="${w - 14}" height="10" rx="2" fill="#05070c"/><circle cx="98" cy="${y0 + 105}" r="2.6" fill="${x.rg([[0, "#1d2436"], [1, "#000"]])}"/>` + pkgLight(x, 106, y0 + 105, pkg); geo = { cx: 98, lensY: y0 + 13, btnY: y0 + 48, w }; } }
    else if (id === "pill") { const m = opt.power || "battery", w = m === "battery" ? 34 : m === "wired2" ? 30 : 26, h = m === "battery" ? 104 : 96, x0 = 98 - w / 2, y0 = 42, r = w / 2;
      bat = m === "battery"; const face = m === "wired1" ? "#16181d" : c;
      s += mount(x, MNT, x0, y0, w, h, r) + shell(x, x0, y0, w, h, r, face, true) + `<circle cx="98" cy="${y0 + r}" r="${f(r * .72)}" fill="${x.lg([[0, "#2a2d34"], [1, "#0b0c10"]])}"/>` + lens(x, 98, y0 + r, r * .32, st, ir) +
        statusLed(x, 98, y0 + r * 1.65, st) + (m === "wired1" ? `<circle cx="98" cy="${y0 + h - r}" r="${f(r * .68)}" fill="none" stroke="${c2}" stroke-width="1.8" stroke-opacity="${st === "ring" ? 1 : .5}"/>` : "") +
        `<g class="${st === "ring" ? P + "pulse" : ""}"><circle cx="98" cy="${f(y0 + h - r)}" r="${f(r * .72)}" fill="none" stroke="${c2}" stroke-opacity="${st === "ring" ? .9 : st === "idle" ? .25 : .5}" stroke-width="${st === "ring" ? 2.4 : 1.2}"/></g>` +
        `<circle cx="98" cy="${f(y0 + h - r)}" r="${f(r * .62)}" fill="${x.rg([[0, H.shade(face, .2)], [1, H.shade(face, -.15)]], .4, .35, .75)}"/>` + battery(x, 98, y0 + h + 9, bat);
      geo = { cx: 98, lensY: y0 + r, btnY: y0 + h - r, w }; }
    else if (id === "dualcam") { const x0 = 82, y0 = 34, w = 32, h = 118; bat = (opt.power || "battery") === "battery";
      s += mount(x, MNT, x0, y0, w, h, 6) + shell(x, x0, y0, w, h, 6, c) + glassW(x, x0 + 3, y0 + 3, w - 6, h - 6, 4) + lens(x, 98, y0 + 20, 7, st, ir) + statusLed(x, 98, y0 + 34, st) +
        speaker(x, 98, y0 + 60, 12, 6, st, "#fff") + btnR(x, 98, y0 + 88, 9, c2, st, "#16181d") + `<circle cx="98" cy="${y0 + 106}" r="3.4" fill="${x.rg([[0, "#1d2436"], [1, "#000"]])}"/><circle cx="98" cy="${y0 + 106}" r="4.4" fill="none" stroke="#2a2d34"/>` + pkgLight(x, 108, y0 + 106, pkg) + battery(x, 98, y0 + h + 8, bat);
      geo = { cx: 98, lensY: y0 + 20, btnY: y0 + 88, w }; }
    else if (id === "squaretop") { const x0 = 83, y0 = 40, w = 30, h = 108; bat = (opt.power || "battery") === "battery";
      s += mount(x, MNT, x0, y0, w, h, 14) + shell(x, x0, y0, w, h, 14, "#eef0f2") + `<path d="${rr(x0 + 2, y0 + 1, w - 4, h - 4, 13)}" fill="${x.lg([[0, H.shade(c, .15)], [1, H.shade(c, -.25)]])}"/>` + lens(x, 98, y0 + 16, 5, st, ir) + statusLed(x, 98, y0 + 28, st) +
        `<path d="M${x0 + 2} ${y0 + 44}H${x0 + w - 2}" stroke="#000" stroke-opacity=".45"/>` + btnR(x, 98, y0 + h - 18, 8, c2, st, H.shade(c, -.1), true) + battery(x, 98, y0 + h + 8, bat);
      geo = { cx: 98, lensY: y0 + 16, btnY: y0 + h - 18, w }; }
    else if (id === "zigbee") { const x0 = 82, y0 = 40, w = 32, h = 104; bat = true;
      s += mount(x, MNT, x0, y0, w, h, 4) + shell(x, x0, y0, w, h, 4, c) + `<circle cx="98" cy="${y0 + 20}" r="11" fill="${x.lg([[0, "#2a2d34"], [1, "#0b0c10"]])}"/>` + lens(x, 98, y0 + 20, 6, st, ir) + statusLed(x, 98, y0 + 37, st) +
        btnR(x, 98, y0 + 66, 9, c2, st, H.shade(c, .1)) + speaker(x, 98, y0 + 92, 14, 7, st) + battery(x, 98, y0 + h + 8, bat);
      geo = { cx: 98, lensY: y0 + 20, btnY: y0 + 66, w }; }
    else if (id === "wedgetop") { const x0 = 84, y0 = 40, w = 28, h = 108; bat = (opt.power || "poe") === "wifi";
      s += mount(x, MNT, x0, y0, w, h, 13) + shell(x, x0, y0, w, h, 13, c, true) + `<path d="${rr(x0 + 3, y0 + 3, w - 6, 40, 11)}" fill="${x.lg([[0, "#2a2d34"], [1, "#0b0c10"]])}"/>` + lens(x, 98, y0 + 18, 5.4, st, ir) + irDots(x, 98, y0 + 33, 2, 10, ir) + statusLed(x, 98, y0 + 49, st) +
        btnR(x, 98, y0 + h - 20, 9, c2, st, H.shade(c, .15)) + (bat ? battery(x, 98, y0 + h + 8, true) : `<path d="M${x0 + w - 2} ${y0 + h - 6}Q${x0 + w + 14} ${y0 + h + 6} ${x0 + w + 8} 196" fill="none" stroke="#2f7fd8" stroke-width="2.4"/>`);
      geo = { cx: 98, lensY: y0 + 18, btnY: y0 + h - 20, w }; }
    else if (id === "wide2k") { const x0 = 83, y0 = 40, w = 30, h = 106;
      s += mount(x, MNT, x0, y0, w, h, 7) + shell(x, x0, y0, w, h, 7, c) + `<path d="${rr(x0 + 3, y0 + 3, w - 6, 36, 5)}" fill="${x.lg([[0, "#2a2d34"], [1, "#0b0c10"]])}"/>` + lens(x, 98, y0 + 18, 6, st, ir) + statusLed(x, 106, y0 + 9, st) +
        btnR(x, 98, y0 + 80, 8.4, c2, st, "#16181d", true) + speaker(x, 98, y0 + 56, 12, 6, st);
      geo = { cx: 98, lensY: y0 + 18, btnY: y0 + 80, w }; }
    else if (id === "budget") { const x0 = 84, y0 = 40, w = 28, h = 108;
      s += mount(x, MNT, x0, y0, w, h, 12) + shell(x, x0, y0, w, h, 12, c, true) + `<circle cx="98" cy="${y0 + 18}" r="10" fill="${x.lg([[0, "#2a2d34"], [1, "#0b0c10"]])}"/>` + lens(x, 98, y0 + 18, 5.4, st, ir) + statusLed(x, 98, y0 + 34, st) +
        `<path d="M${x0 + 8} ${y0 + 54}h${w - 16}" stroke="${H.shade(c, .3)}" stroke-width=".8"/>` + btnR(x, 98, y0 + h - 18, 8.6, c2, st, H.shade(c, .1));
      geo = { cx: 98, lensY: y0 + 18, btnY: y0 + h - 18, w }; }
    else if (id === "roundbtn") { if ((opt.shape || "round") === "round") { const cy = 96, R = 34;
        s += (MNT !== "flat" ? `<circle cx="96" cy="${cy + 2}" r="${R + 2}" fill="#16171a"/>` : "") + `<circle cx="99.5" cy="${cy + 3}" r="${R}" fill="#000" fill-opacity=".35"/><circle cx="98" cy="${cy}" r="${R}" fill="${x.rg([[0, H.shade(c, .45)], [.6, c], [1, H.shade(c, -.35)]], .35, .3, .8)}"/>` +
          (() => { let b = ""; for (let i = 0; i < 18; i++) b += `<path d="M${f(98 - R * .9)} ${f(cy - R + 6 + i * 3.4)}H${f(98 + R * .9)}" stroke="#fff" stroke-opacity=".06"/>`; return b; })() +
          `<circle cx="98" cy="${cy - 15}" r="9" fill="#16181d"/>` + lens(x, 98, cy - 15, 5.4, st, ir) + statusLed(x, 98, cy - 2, st) + btnR(x, 98, cy + 15, 11, c2, st, "#16181d");
        geo = { cx: 98, lensY: cy - 15, btnY: cy + 15, w: R * 2 }; }
      else { const x0 = 85, y0 = 40, w = 26, h = 108;
        s += mount(x, MNT, x0, y0, w, h, 5) + shell(x, x0, y0, w, h, 5, c) + glassW(x, x0 + 3, y0 + 3, w - 6, 40, 4) + lens(x, 98, y0 + 20, 5, st, ir) + btnR(x, 98, y0 + 68, 9, c2, st, "#16181d") + `<circle cx="98" cy="${y0 + 94}" r="3" fill="${H.shade(c, -.3)}"/>`;
        geo = { cx: 98, lensY: y0 + 20, btnY: y0 + 68, w }; } }
    return s + overlay(x, st, geo.cx, geo.lensY, geo.btnY, geo.w);
  }

  const STATE = { id: "state", name: "State", values: [["ring", "Ringing"], ["motion", "Motion"], ["live", "Live view"], ["talk", "Talking"], ["idle", "Idle"]] };
  const MOUNT = { id: "mount", name: "Mount", values: [["flat", "Flat"], ["wedge", "Wedge"], ["corner", "Corner kit"]] };
  const IR = { id: "ir", name: "Night IR", values: [["off", "Off"], ["on", "On"]] }, PKG = { id: "pkg", name: "Package light", values: [["off", "Off"], ["on", "On"]] };
  const CARDS = [
    { id: "classic", name: "Classic video doorbell", colors: [FACE.nickel, "#7a6650", "#232428", "#d9d5cc"], wall: "siding",
      options: [{ id: "model", name: "Model", values: [["battery", "Battery"], ["plus", "Battery, wide view"], ["wired", "Wired"], ["slimwired", "Slim wired"]] }, STATE, MOUNT, IR] },
    { id: "propoe", name: "Pro PoE doorbell", colors: [FACE.white, "#1a1b1f"], wall: "siding",
      options: [{ id: "model", name: "Model", values: [["std", "Standard"], ["pro", "Pro, package camera"], ["poe", "Pro, PoE"]] }, STATE, MOUNT, IR, Object.assign({ when: { opt: "model", is: ["pro", "poe"] } }, PKG)] },
    { id: "pill", name: "Rounded pill doorbell", colors: ["#eef0f2", "#e8dcc4", "#7d8288", "#5a6e5a"], wall: "brick",
      options: [{ id: "power", name: "Power", values: [["battery", "Battery"], ["wired2", "Wired, newer"], ["wired1", "Wired, older (black)"]] }, STATE, MOUNT, IR] },
    { id: "dualcam", name: "Dual-camera doorbell", colors: ["#16181d", "#2c2f36"], wall: "brick",
      options: [{ id: "power", name: "Power", values: [["battery", "Battery"], ["wired", "Wired"]] }, STATE, MOUNT, IR, PKG] },
    { id: "squaretop", name: "Square-top doorbell", colors: ["#1a1b1f", "#eef0f2"], wall: "siding",
      options: [{ id: "power", name: "Power", values: [["battery", "Battery"], ["wired", "Wired"]] }, STATE, MOUNT, IR] },
    { id: "zigbee", name: "Zigbee hub doorbell", colors: ["#3a3c42", "#d5d8dc"], wall: "siding", options: [STATE, MOUNT, IR] },
    { id: "wedgetop", name: "Wedge-top PoE doorbell", colors: ["#1a1b1f", "#eef0f2"], wall: "brick",
      options: [{ id: "power", name: "Power", values: [["poe", "PoE"], ["wifi", "Wi-Fi battery"]] }, STATE, MOUNT, IR] },
    { id: "wide2k", name: "2K wide doorbell", colors: ["#1a1b1f", "#eef0f2"], wall: "siding", options: [STATE, MOUNT, IR] },
    { id: "budget", name: "Budget video doorbell", colors: ["#2a2c31", "#d5d8dc"], wall: "brick", options: [STATE, MOUNT, IR] },
    { id: "roundbtn", name: "Round-button doorbell", colors: [FACE.silver, "#c9a24a", "#6e5a48", "#232428"], wall: "brick",
      options: [{ id: "shape", name: "Shape", values: [["round", "Round"], ["slim", "Slim"]] }, STATE, MOUNT, IR] },
  ];
  const OLD = { dbtall: ["tall", "Tall ring-button doorbell"], dbsquare: ["square", "Square-head doorbell"], dbwedge: ["wedge", "Slim battery doorbell"],
    dbpackage: ["package", "Two-lens package doorbell"], dbintercom: ["intercom", "Apartment intercom"], dbgate: ["gatepost", "Gate keypad doorbell"], dbpeep: ["peephole", "Peephole camera"] };
  const OLD_WALL = { dbtall: "siding", dbsquare: "brick", dbwedge: "siding", dbpackage: "brick", dbintercom: "brick", dbpeep: "siding" };
  const BASE = ((typeof document !== "undefined" && document.currentScript && document.currentScript.src) || "").replace(/[^/]*$/, "");
  const bellSet = () => (window.HDA || []).filter((st) => st && st.id === "doorbell")[0];
  const oldIcon = (id) => { const st = bellSet(), L = st && (st.all || st.icons); return L ? L.filter((ic) => ic.id === id)[0] : null; };
  let loading = false;
  function ensureBells() {
    if (loading || bellSet() || typeof document === "undefined" || !document.createElement) return;
    loading = true; const sc = document.createElement("script"); sc.src = BASE + "doorbell.js";
    sc.onload = sc.onerror = () => { const st = bellSet(); if (!st) { loading = false; return; }
      if (st.css && !document.querySelector('style[data-set="doorbell"]')) { const el = document.createElement("style"); el.dataset.set = "doorbell"; el.textContent = st.css; document.head.appendChild(el); }
      if (typeof window.renderStage === "function") window.renderStage(); };
    document.head.appendChild(sc);
  }
  let oldN = 0;
  function oldRender(o, k, op) {
    const ic = oldIcon(OLD[k][0]);
    const oo = Object.assign({}, o, { uid: `${o.uid}d${++oldN}`, opt: { state: op.state || "ring", ir: op.ir || "off" } });
    if (!ic) { ensureBells(); const x = X(o); return scene(x, backdrop(x, OLD_WALL[k] || "siding"), ""); }
    const sv = ic.render(oo);
    if (k === "dbgate") return sv; 
    const x = X(o), sc = k === "dbpeep" ? .9 : .74, w = 200 * sc, inner = sv.replace(/^<svg[^>]*>/, `<svg x="${f(98 - w / 2)}" y="${f(100 - w / 2)}" width="${f(w)}" height="${f(w)}" viewBox="0 0 200 200" overflow="visible">`);
    return scene(x, backdrop(x, OLD_WALL[k] || "siding"), `<g class="hda-nobg">${inner}</g>`);
  }

  const BY = {}; CARDS.forEach((cd) => { BY[cd.id] = cd; });
  const is = (list) => ({ opt: "style", is: list });
  const options = [
    { id: "style", name: "Style", values: CARDS.map((cd) => [cd.id, cd.name]).concat(Object.keys(OLD).map((k) => [k, OLD[k][1]])) },
    { id: "mClassic", name: "Model", values: CARDS[0].options[0].values, when: is("classic") },
    { id: "mProPoe", name: "Model", values: CARDS[1].options[0].values, when: is("propoe") },
    { id: "pPill", name: "Power", values: BY.pill.options[0].values, when: is("pill") },
    { id: "pBat", name: "Power", values: [["battery", "Battery"], ["wired", "Wired"]], when: is(["dualcam", "squaretop"]) },
    { id: "pPoe", name: "Power", values: BY.wedgetop.options[0].values, when: is("wedgetop") },
    { id: "shape", name: "Shape", values: BY.roundbtn.options[0].values, when: is("roundbtn") },
    STATE, Object.assign({}, MOUNT, { when: is(CARDS.map((cd) => cd.id)) }), IR,
    Object.assign({}, PKG, { id: "pkgPro", when: { opt: "mProPoe", is: ["pro", "poe"] } }),
    Object.assign({}, PKG, { id: "pkgDual", when: is("dualcam") }),
  ];
  function oldOpt(op, k) {
    const m = { state: op.state || "ring", mount: op.mount || "flat", ir: op.ir || "off" };
    if (k === "classic") m.model = op.mClassic || "battery";
    else if (k === "propoe") { m.model = op.mProPoe || "std"; m.pkg = m.model === "std" ? "off" : op.pkgPro || "off"; }
    else if (k === "pill") m.power = op.pPill || "battery";
    else if (k === "dualcam") { m.power = op.pBat || "battery"; m.pkg = op.pkgDual || "off"; }
    else if (k === "squaretop") m.power = op.pBat || "battery";
    else if (k === "wedgetop") m.power = op.pPoe || "poe";
    else if (k === "roundbtn") m.shape = op.shape || "round";
    return m;
  }
  const FACES = [FACE.nickel, FACE.white, "#1a1b1f", "#7a6650", "#d9d5cc", "#e8dcc4", "#7d8288", "#5a6e5a", "#c9a24a"];
  const icons = [{ id: "bell", name: "Video doorbell", colors: FACES, picker: true, colorLabel: "Faceplate", colors2: RING, picker2: true, colorLabel2: "Ring light", options,
    render(o) { const op0 = o.opt || {}; if (OLD[op0.style]) return oldRender(o, op0.style, op0);
      const op = op0, k = BY[op.style] ? op.style : CARDS[0].id, cd = BY[k], opt = oldOpt(op, k), oo = Object.assign({}, o, { opt });
      const x = X(oo), st = o.on ? opt.state : "idle", c = o.color || cd.colors[0], c2 = o.color2 || RING[0];
      return scene(x, backdrop(x, cd.wall), model(x, k, oo, st, c, c2)); } }];

  const css = `
.hda-camdoorbells-pulse{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-camdoorbells-pulse{animation:hda-camdoorbells-pulse 1s ease-in-out infinite}
@keyframes hda-camdoorbells-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(1.12)}}
.hda-anim .hda-camdoorbells-wave{animation:hda-camdoorbells-wave 1.35s ease-out infinite}
@keyframes hda-camdoorbells-wave{0%{opacity:0}30%{opacity:1}100%{opacity:0}}
.hda-anim .hda-camdoorbells-blink{animation:hda-camdoorbells-blink 1.1s steps(1) infinite}
@keyframes hda-camdoorbells-blink{0%{opacity:1}50%{opacity:.15}}
.hda-anim .hda-camdoorbells-glow{animation:hda-camdoorbells-glow 2.4s ease-in-out infinite}
@keyframes hda-camdoorbells-glow{0%,100%{opacity:1}50%{opacity:.55}}
.hda-anim .hda-camdoorbells-sweep{animation:hda-camdoorbells-sweep 1.6s ease-in-out infinite alternate}
@keyframes hda-camdoorbells-sweep{0%{opacity:.3}100%{opacity:1}}
.hda-camdoorbells-spk{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-camdoorbells-spk{animation:hda-camdoorbells-spk .32s ease-in-out infinite alternate}
@keyframes hda-camdoorbells-spk{0%{transform:scale(1,.4)}100%{transform:scale(1,1.3)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-camdoorbells-pulse,.hda-anim .hda-camdoorbells-wave,.hda-anim .hda-camdoorbells-blink,.hda-anim .hda-camdoorbells-glow,.hda-anim .hda-camdoorbells-sweep,.hda-anim .hda-camdoorbells-spk{animation:none!important}}
`;
  (window.HDA = window.HDA || []).push({
    id: "camdoorbells", tab: "Video doorbells", group: "Security", kind: "device",
    intro: "One video doorbell builder, drawn from real ones (no brands): pick the Style (classic, pro PoE, rounded pill, dual-camera, square-top, hub, wedge-top, 2K wide, budget, round-button, plus the older tall ring-button, square-head, slim battery, two-lens package, apartment intercom, gate keypad and peephole looks), then that style's own Model, Power or Shape menu. State shows ringing, motion, live view or talking; Mount is flat, wedge or corner kit (on the styles that use it); Night IR is Off/On, and Package light shows only on styles that have one. Battery models show a small battery bar.",
    levelLabel: "Battery", onWord: "Ringing", offWord: "Idle",
    css, icons,
  });
})();
