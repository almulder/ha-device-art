(function () {
  const H = window.HDAH, P = "hda-office-";
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

  const BLK = ["#2c2f36", "#c9ccd1", "#5b5f66", "#eef0f2", "#1b1c20"];
  const ALU = ["#c9ccd1", "#5b5f66", "#e8d5c4", "#2c2f36", "#9fb4c8"];
  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label, render }, extra || {});

  function deskB(x, y, tone) {
    tone = tone || "#8a6142"; const r = rnd(y * 7 + 3);
    let s = `<rect x="8" y="${y}" width="184" height="${178 - y}" fill="${x.lg([[0, H.shade(tone, -.2)], [1, H.shade(tone, .12)]])}"/>`;
    for (let i = 0; i < 9; i++) { const yy = y + 2 + r() * (176 - y); s += `<path d="M8 ${f(yy)}C60 ${f(yy + r() * 3 - 1.5)} 120 ${f(yy + r() * 3 - 1.5)} 192 ${f(yy)}" fill="none" stroke="#2a180b" stroke-opacity="${(.08 + r() * .12).toFixed(2)}" stroke-width=".7"/>`; }
    return s + `<path d="M8 ${y + .5}H192" stroke="#000" stroke-opacity=".35"/><rect x="8" y="178" width="184" height="8" fill="${x.lg([[0, H.shade(tone, -.25)], [1, H.shade(tone, -.5)]])}"/><path d="M8 178.5H192" stroke="#fff" stroke-opacity=".3"/><rect x="8" y="186" width="184" height="6" fill="#111216"/>`;
  }
  const shadowE = (x, cx, cy, rx, ry, k) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${M.shadow(x)}" opacity="${k || .8}"/>`;

  const SCN = [
    `<rect width="100" height="60" fill="url(#G0)"/><circle cx="70" cy="33" r="9" fill="#ffe2a0"/><circle cx="70" cy="33" r="15" fill="#ffe2a0" fill-opacity=".2"/><path d="M0 44L18 30L30 38L46 22L62 36L76 28L100 42V60H0Z" fill="#5a3478"/><path d="M0 50L22 40L40 48L58 38L80 50L100 44V60H0Z" fill="#2a1c48"/>`,
    `<rect width="100" height="60" fill="url(#G1)"/><path d="M0 34Q25 20 50 31T100 28V41H0Z" fill="#3f7f6a"/><path d="M0 38Q30 30 60 37T100 35V41H0Z" fill="#2c5f50"/><rect y="41" width="100" height="19" fill="url(#G2)"/><path d="M10 46H38M56 50H90M30 54H60" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/>`,
    `<rect width="100" height="60" fill="url(#G3)"/><path d="M0 40C20 20 40 55 60 35S90 20 100 30V60H0Z" fill="#e85d9a" fill-opacity=".8"/><path d="M0 48C25 32 45 60 70 44S95 40 100 42V60H0Z" fill="#ffb36b" fill-opacity=".85"/><circle cx="22" cy="16" r="5" fill="#fff" fill-opacity=".25"/>`,
    `<rect width="100" height="60" fill="url(#G4)"/><circle cx="24" cy="18" r="6" fill="#fff6d8"/><path d="M0 40Q30 28 60 40T100 36V60H0Z" fill="#e8a65a"/><path d="M0 50Q40 38 70 50T100 48V60H0Z" fill="#c97a38"/>`,
  ];
  const SG = [["G0", [[0, "#3b2a7a"], [.6, "#c0587a"], [1, "#ffb36b"]]], ["G1", [[0, "#6cbbe8"], [1, "#d5f0fc"]]], ["G2", [[0, "#3a8cc0"], [1, "#1e4f7a"]]], ["G3", [[0, "#1d2b64"], [1, "#6a3fa0"]]], ["G4", [[0, "#7fb3e8"], [1, "#ffd9a0"]]]];
  function scr(x, x0, y0, w, h, seed, opt) {
    opt = opt || {};
    if (!x.on) return `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" fill="${x.lg([[0, "#1a1c22"], [1, "#07080a"]], 0, 0, 1, 1)}"/>` +
      `<path d="M${f(x0)} ${f(y0 + h * .7)}L${f(x0 + w * .55)} ${f(y0)}H${f(x0 + w * .75)}L${f(x0)} ${f(y0 + h)}Z" fill="#fff" fill-opacity=".05"/>`;
    let txt = SCN[seed % SCN.length];
    for (const [k] of SG) txt = txt.split(`url(#${k})`).join(x.def("wp" + k, (id) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(SG.find((g) => g[0] === k)[1])}</linearGradient>`));
    const cp = clipU(x, "scr" + seed + "_" + f(x0), `<rect x="0" y="0" width="100" height="60"/>`);
    let bar = "";
    if (opt.bar !== false) { const bc = lvlCol(x, "#e9f7ef");
      bar = `<rect y="55" width="100" height="5" fill="#0b0d12" fill-opacity=".6"/>` + (opt.dock ? [0, 1, 2, 3, 4].map((i) => `<circle cx="${40 + i * 5}" cy="57.5" r="1.5" fill="${["#ff6b5a", "#ffd25a", "#5ad08a", "#5aa8ff", "#e9eef5"][i]}"/>`).join("") : `<rect x="2" y="56.2" width="2.6" height="2.6" rx=".5" fill="#9ccaff"/>` + [0, 1, 2].map((i) => `<rect x="${7 + i * 4}" y="56.6" width="2.4" height="1.8" rx=".4" fill="#fff" fill-opacity=".5"/>`).join("")) +
        (opt.bat ? `<rect x="87" y="56.3" width="8" height="2.6" rx=".5" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width=".4"/><rect x="95.2" y="57" width=".7" height="1.2" fill="#fff" fill-opacity=".8"/><rect x="87.6" y="56.9" width="${f(6.8 * Math.max(.06, x.lv))}" height="1.4" fill="${bc}"/>` : "");
    }
    return `<g transform="translate(${f(x0)} ${f(y0)}) scale(${(w / 100).toFixed(4)} ${(h / 60).toFixed(4)})" clip-path="${cp}">${txt}${bar}<path d="M0 0H100L60 60H0Z" fill="#fff" fill-opacity=".05"/></g>`;
  }
  function monitor(x, x0, y0, w, h, seed, standY) {
    const cx = x0 + w / 2;
    return `<path d="M${f(cx - 5)} ${f(y0 + h)}L${f(cx - 7)} ${f(standY - 2)}H${f(cx + 7)}L${f(cx + 5)} ${f(y0 + h)}Z" fill="${M.steel(x)}"/>` + shadowE(x, cx, standY + 1, w * .28, 3) +
      `<ellipse cx="${f(cx)}" cy="${f(standY)}" rx="${f(w * .22)}" ry="3" fill="${x.lg([[0, "#d5d9de"], [1, "#6c727a"]])}"/>` +
      `<rect x="${f(x0 - 1.5)}" y="${f(y0 - 1.5)}" width="${f(w + 3)}" height="${f(h + 3)}" rx="3" fill="#0b0c0f"/>` + scr(x, x0, y0, w, h, seed) +
      `<rect x="${f(x0 - 1.5)}" y="${f(y0 - 1.5)}" width="${f(w + 3)}" height="${f(h + 3)}" rx="3" fill="none" stroke="#fff" stroke-opacity=".12"/>`;
  }
  function slab(x, x0, y0, w, h, dx, dy, col, opt) {
    opt = opt || {}; const p = pal(col);
    return `<path d="M${f(x0 + 2)} ${f(y0 + h + 3)}H${f(x0 + w + dx + 4)}L${f(x0 + w + dx + 6)} ${f(y0 + h - dy + 3)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M${f(x0)} ${f(y0)}L${f(x0 + dx)} ${f(y0 - dy)}H${f(x0 + w + dx)}L${f(x0 + w)} ${f(y0)}Z" fill="${opt.top || x.lg([[0, p.d], [1, p.l]])}"/>` +
      `<path d="M${f(x0 + w)} ${f(y0)}L${f(x0 + w + dx)} ${f(y0 - dy)}V${f(y0 + h - dy)}L${f(x0 + w)} ${f(y0 + h)}Z" fill="${M.side(x, col)}"/>` +
      `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${opt.r || 1.5}" fill="${opt.front || M.v(x, col)}"/>` +
      `<path d="M${f(x0 + 1)} ${f(y0 + .5)}H${f(x0 + w - 1)}" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/><path d="M${f(x0)} ${f(y0)}L${f(x0 + dx)} ${f(y0 - dy)}H${f(x0 + w + dx)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;
  }
  const vents = (x0, y0, w, rows, gap, col) => { let s = ""; for (let i = 0; i < rows; i++) s += `<rect x="${f(x0)}" y="${f(y0 + i * gap)}" width="${f(w)}" height="${f(gap * .45)}" rx="${f(gap * .2)}" fill="${col || "#000"}" fill-opacity=".45"/>`; return s; };
  function fan(x, cx, cy, r, col, dur) {
    let bl = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .8)}" fill="none"/>`;
    for (let i = 0; i < 7; i++) { const a = i * Math.PI * 2 / 7;
      bl += `<path d="M${f(cx + Math.cos(a) * r * .22)} ${f(cy + Math.sin(a) * r * .22)}Q${f(cx + Math.cos(a + .5) * r * .6)} ${f(cy + Math.sin(a + .5) * r * .6)} ${f(cx + Math.cos(a + .25) * r * .78)} ${f(cy + Math.sin(a + .25) * r * .78)}L${f(cx + Math.cos(a + .75) * r * .7)} ${f(cy + Math.sin(a + .75) * r * .7)}Q${f(cx + Math.cos(a + .6) * r * .3)} ${f(cy + Math.sin(a + .6) * r * .3)} ${f(cx + Math.cos(a + .6) * r * .22)} ${f(cy + Math.sin(a + .6) * r * .22)}Z" fill="#2a2c33" stroke="#4a4e56" stroke-width=".4"/>`; }
    return `<rect x="${f(cx - r - 1.5)}" y="${f(cy - r - 1.5)}" width="${f(2 * r + 3)}" height="${f(2 * r + 3)}" rx="2" fill="#141519"/>` +
      ringLed(x, cx, cy, r * .9, r * .9, Math.max(1, r * .12), col, .9) +
      `<g${x.on ? ` class="${P}spin" style="animation-duration:${dur || .7}s"` : ""}>${bl}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .22)}" fill="${x.rg([[0, "#4a4e56"], [1, "#15161a"]])}"/>`;
  }

  function laptop(x, s) {
    const bil = (u, v) => { const tl = [s.x0, s.hy], tr = [s.x1, s.hy], bl = [s.x0 - 12, s.fy], br = [s.x1 + 12, s.fy];
      const a = [tl[0] + (tr[0] - tl[0]) * u, tl[1]], b = [bl[0] + (br[0] - bl[0]) * u, bl[1]]; return [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v]; };
    const q = (u0, v0, u1, v1) => { const p = [bil(u0, v0), bil(u1, v0), bil(u1, v1), bil(u0, v1)]; return `M${P2(p[0])}L${P2(p[1])}L${P2(p[2])}L${P2(p[3])}Z`; };
    const b = s.body, th = s.thick || 3.5, bz = s.bezelW || 4, chin = s.chin || 0, rr = s.rounded ? 6 : 3.5;
    const RGB = ["#ff4f6a", "#ffb04f", "#f5f05a", "#4fe08a", "#4fc8ff", "#7a6bff", "#e05aff"];
    let keys = ""; const rows = 5, cols = 13, kv0 = .07, kv1 = .56, ku0 = .07, ku1 = .93;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (r === rows - 1 && c > 3 && c < 9) { if (c === 4) keys += `<path d="${q(ku0 + (ku1 - ku0) * 4 / cols + .004, kv0 + (kv1 - kv0) * r / rows + .01, ku0 + (ku1 - ku0) * 9 / cols - .004, kv0 + (kv1 - kv0) * (r + 1) / rows - .012)}" fill="${s.keys}"/>`; continue; }
      const u0 = ku0 + (ku1 - ku0) * c / cols + .004, u1 = ku0 + (ku1 - ku0) * (c + 1) / cols - .004, v0 = kv0 + (kv1 - kv0) * r / rows + .01, v1 = kv0 + (kv1 - kv0) * (r + 1) / rows - .012;
      const kc = s.rgb && x.on ? H.mix(RGB[Math.floor(c / cols * RGB.length)], "#ffffff", .15) : s.keys;
      keys += `<path d="${q(u0, v0, u1, v1)}" fill="${kc}"/>`;
    }
    const rgbGlow = s.rgb && x.on ? `<g class="${P}rgb"><path d="${q(.05, .05, .95, .58)}" fill="${x.lg(RGB.map((c, i) => [i / (RGB.length - 1), c, .55]), 0, 0, 1, 0)}"/></g>` : "";
    const pad = `<path d="${q(.36, .64, .64, .95)}" fill="${H.shade(b, -.08)}" stroke="${H.shade(b, -.3)}" stroke-width=".6"/>`;
    const stick = s.stick ? `<circle cx="${f(bil(.5, .43)[0])}" cy="${f(bil(.5, .43)[1])}" r="1.6" fill="#e0242e"/>` +
      `<path d="${q(.37, .595, .63, .625)}" fill="#141518"/>` : "";
    const cx = (s.x0 + s.x1) / 2, sy1 = s.hy - 2;
    return shadowE(x, cx, s.fy + 6, (s.x1 - s.x0) / 2 + 26, 7) +
      `<rect x="${f(s.x0)}" y="${f(s.y0)}" width="${f(s.x1 - s.x0)}" height="${f(sy1 - s.y0)}" rx="${rr}" fill="${s.bezel}"/>` +
      `<rect x="${f(s.x0)}" y="${f(s.y0)}" width="${f(s.x1 - s.x0)}" height="${f(sy1 - s.y0)}" rx="${rr}" fill="none" stroke="${H.shade(b, .1)}" stroke-width="1.4"/>` +
      scr(x, s.x0 + bz, s.y0 + bz, s.x1 - s.x0 - 2 * bz, sy1 - s.y0 - bz * 2 - chin, s.seed, { bat: true, dock: s.dock }) +
      (chin ? `<rect x="${f(s.x0 + .7)}" y="${f(sy1 - chin - bz + 1)}" width="${f(s.x1 - s.x0 - 1.4)}" height="${f(chin + bz - 1.7)}" rx="2" fill="${s.bezel}"/>` : "") +
      `<circle cx="${f(cx)}" cy="${f(s.y0 + bz / 2)}" r=".9" fill="#2a3a55"/>` +
      `<rect x="${f(s.x0 + 8)}" y="${f(s.hy - 3)}" width="${f(s.x1 - s.x0 - 16)}" height="4" rx="2" fill="${H.shade(b, -.35)}"/>` +
      `<path d="M${f(s.x0 - 12)} ${f(s.fy)}H${f(s.x1 + 12)}V${f(s.fy + th)}Q${f(s.x1 + 12)} ${f(s.fy + th + 2)} ${f(s.x1 + 8)} ${f(s.fy + th + 2)}H${f(s.x0 - 8)}Q${f(s.x0 - 12)} ${f(s.fy + th + 2)} ${f(s.x0 - 12)} ${f(s.fy + th)}Z" fill="${x.lg([[0, H.shade(b, -.15)], [1, H.shade(b, -.5)]])}"/>` +
      `<path d="${q(0, 0, 1, 1)}" fill="${x.lg([[0, H.shade(b, -.2)], [.5, b], [1, H.shade(b, .25)]])}"/>` +
      `<path d="${q(.05, .05, .95, .58)}" fill="${H.shade(b, -.3)}"/>` + rgbGlow + keys + pad + stick +
      `<path d="M${f(s.x0 - 12)} ${f(s.fy)}H${f(s.x1 + 12)}" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>` +
      (s.led !== false ? led(x, s.x1 - 2, s.fy + th * .55, .8, lvlCol(x, "#f2f6ff"), .5) : "");
  }

  const icons = [
    ic("upssmall", "Small UPS", sw(BLK, "#2c2f36"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "blue", 8, 126) + baseB(x, 126, "#7a5638");
      const sk = `matrix(1,-0.27,0,1,0,${(0.27 * 96).toFixed(2)})`;
      const body = cord(x, [112, 84, 116, 60, 104, 40, 110, 8], 2.6, "#1d1e22", GREEN, 8) +
        shadowE(x, 102, 164, 50, 7) +
        `<path d="M96 72L140 60V150L96 162Z" fill="${x.lg([[0, H.shade(c, -.05)], [1, H.shade(c, -.4)]], 0, 0, 1, 0)}"/>` +
        `<path d="M58 72L96 72L140 60L104 60Z" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, .45)]])}"/>` +
        `<rect x="58" y="72" width="38" height="90" rx="2" fill="${M.v(x, c)}"/><path d="M59 72.5H95" stroke="#fff" stroke-opacity=".45"/>` +
        `<g transform="${sk}">` + [0, 1, 2, 3].map((i) => face(x, 108 + (i % 2) * 20, 92 + Math.floor(i / 2) * 30, .55, "#2a2c31")).join("") + plugHead(x, 108, 90, .55, "#1d1e22") + `</g>` +
        button(x, 77, 86, 5, H.shade(c, .1)) + ringLed(x, 77, 86, 6.5, 6.5, 1, lvlCol(x, GREEN)) +
        segBar(x, 74.5, 102, 5, 30, 4, true) + vents(64, 140, 26, 4, 4.4);
      return scene(x, back, body); }),

    ic("upslcd", "LCD tower UPS", sw(BLK, "#2c2f36"), "Body", (o) => { const x = X(o), c = o.color, low = x.lv < .2;
      const back = wallB(x, "gray", 8, 126) + baseB(x, 126, "#7a5638");
      const body = shadowE(x, 106, 168, 54, 7) + box(x, 58, 40, 84, 126, 6, 7, 4, c) +
        `<rect x="58" y="40" width="84" height="126" rx="6" fill="${x.lg([[0, "#fff", .14], [.2, "#fff", 0], [.85, "#000", 0], [1, "#000", .2]], 0, 0, 1, 0)}"/>` +
        lcd(x, 68, 52, 64, 32, low ? "#ffb347" : "#7ee7ff") + digits(always(x), 112, 57, 12, pct(x), 3, x.on ? lvlCol(x, "#bdf3ff") : "#4a5260") +
        `<path d="M115 66L121 58M115.5 58.5h1M120 65.5h1" stroke="${x.on ? lvlCol(x, "#bdf3ff") : "#4a5260"}" stroke-width="1.3" stroke-linecap="round"/>` +
        segBar(x, 74, 76, 40, 4, 8, false, "#7ee7ff") + glass(x, 68, 52, 64, 32) +
        (x.on && low ? `<g class="${P}blink"><path d="M124 72L129 80H119Z" fill="#ffb347"/><path d="M124 75V77.5" stroke="#1a1a1a" stroke-width="1"/></g>` : "") +
        button(x, 100, 100, 6, H.shade(c, .12)) + ringLed(x, 100, 100, 7.6, 7.6, 1, lvlCol(x, GREEN)) +
        `<path d="M100 96.5V100M97.6 97.5A3.4 3.4 0 1 0 102.4 97.5" fill="none" stroke="${H.shade(c, .6)}" stroke-width=".9" stroke-linecap="round"/>` +
        [0, 1, 2].map((i) => `<rect x="${78 + i * 16}" y="114" width="12" height="3" rx="1.5" fill="${H.shade(c, -.4)}"/>`).join("") + vents(66, 126, 68, 7, 4.8);
      return scene(x, back, body); }),

    ic("upsrack", "Rack-mount UPS", sw(BLK, "#1b1c20"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 192) + `<rect x="16" y="8" width="168" height="184" fill="#0f1013"/>`;
      let rails = "";
      for (const rx of [22, 172]) { rails += `<rect x="${rx}" y="8" width="6" height="184" fill="${M.steel(x)}"/>`; for (let y = 12; y < 190; y += 5.4) rails += `<rect x="${rx + 1.8}" y="${f(y)}" width="2.4" height="2.4" fill="#1a1b1f"/>`; }
      const ear = (y, h, col) => `<rect x="20" y="${y}" width="10" height="${h}" rx="1" fill="${M.v(x, col)}"/><rect x="170" y="${y}" width="10" height="${h}" rx="1" fill="${M.v(x, col)}"/>` + screw(x, 25, y + h / 2, 1.6, .3) + screw(x, 175, y + h / 2, 1.6, -.3);
      let ports = ""; for (let i = 0; i < 12; i++) ports += `<rect x="${60 + i * 8}" y="77" width="6" height="5" rx=".6" fill="#06070a"/>` + (x.on && i % 3 !== 2 ? `<rect class="${i % 2 ? P + "blink" : ""}" x="${60 + i * 8}" y="75.4" width="2" height="1" fill="#4fe08a" style="animation-delay:${(-i * .23).toFixed(2)}s"/>` : "");
      let bays = ""; for (let i = 0; i < 6; i++) bays += `<rect x="${36 + i * 18}" y="50" width="16" height="12" rx="1" fill="${x.lg([[0, "#2a2c32"], [1, "#16171b"]])}"/><circle cx="${48 + i * 18}" cy="56" r=".9" fill="${x.on ? "#4da3ff" : "#22303f"}"/>`;
      const body = rails + ear(48, 16, "#2a2c31") + `<rect x="30" y="48" width="140" height="16" fill="${M.v(x, "#2a2c31")}"/>` + bays + led(x, 160, 56, 1, "#4da3ff") +
        ear(70, 16, "#3a3d44") + `<rect x="30" y="70" width="140" height="16" fill="${M.v(x, "#3a3d44")}"/>` + ports +
        ear(96, 32, c) + `<rect x="30" y="96" width="140" height="32" fill="${M.v(x, c)}"/><path d="M30 96.5H170" stroke="#fff" stroke-opacity=".35"/>` +
        vents(36, 101, 40, 5, 4.8) + vents(124, 101, 40, 5, 4.8) +
        lcd(x, 82, 101, 36, 14, lvlCol(x, "#7ee7ff")) + digits(always(x), 112, 104, 8, pct(x), 3, x.on ? lvlCol(x, "#bdf3ff") : "#4a5260") +
        segBar(x, 84, 119, 32, 3, 6, false) + led(x, 120, 121, 1, "#ffb347", .3) +
        `<rect x="30" y="134" width="140" height="22" fill="#18191d"/>` + vents(40, 138, 120, 3, 5.4, "#000") + ear(134, 22, "#18191d");
      return scene(x, back, body); }),

    ic("upsbrick", "Compact UPS", sw(BLK, "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "sage", 8, 116) + baseB(x, 116, "#7a5638");
      const T = `matrix(1,0,-0.667,1,58,96)`;
      let outs = ""; for (let i = 0; i < 8; i++) outs += face(x, 16 + (i % 4) * 22, 7 + Math.floor(i / 4) * 12.5, .36, H.shade(c, -.25));
      const body = cord(x, [56, 104, 50, 70, 36, 50, 22, 8], 2.4, "#1d1e22", GREEN, 8) + cord(x, [92, 104, 94, 70, 120, 50, 150, 8], 2.4, "#1d1e22", GREEN, 8) +
        shadowE(x, 106, 150, 72, 9) +
        `<path d="M58 96H162L146 120H42Z" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, -.05)]])}"/>` +
        `<path d="M146 120L162 96V114L146 140Z" fill="${M.side(x, c)}"/>` +
        `<rect x="42" y="120" width="104" height="20" rx="2" fill="${M.v(x, H.shade(c, -.1))}"/><path d="M43 120.5H145" stroke="#fff" stroke-opacity=".5"/>` +
        `<g transform="${T}">${outs}${plugHead(x, 16, 6.4, .36, "#1d1e22")}${plugHead(x, 60, 6.4, .36, "#1d1e22")}</g>` +
        button(x, 56, 130, 4, H.shade(c, .1)) + ringLed(x, 56, 130, 5.2, 5.2, .9, lvlCol(x, GREEN)) +
        [0, 1, 2, 3].map((i) => led(x, 76 + i * 8, 130, 1.3, i < Math.round(x.lv * 4) ? lvlCol(x, GREEN) : "#3a3d44", i < Math.round(x.lv * 4) ? .6 : 0)).join("") +
        vents(114, 125, 26, 3, 4);
      return scene(x, back, body); }),

    ic("gaming", "Gaming tower", sw(BLK, "#1b1c20"), "Case", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "navy", 8, 150) + deskB(x, 150, "#5d4330");
      const ram = [0, 1, 2, 3].map((i) => `<rect x="${92 + i * 5}" y="52" width="3.4" height="30" fill="#1a1b20"/><rect x="${92 + i * 5}" y="52" width="3.4" height="4" fill="${x.on ? ["#ff4fd8", "#7a5cff", "#3fd0ff", "#4fe08a"][i] : "#2a2c33"}"/>`).join("");
      const body = shadowE(x, 102, 172, 74, 8) +
        `<path d="M150 30L166 22V160L150 170Z" fill="${x.lg([[0, H.shade(c, .05)], [1, H.shade(c, -.35)]], 0, 0, 1, 0)}"/>` + (() => { let m = ""; for (let i = 0; i < 26; i++) m += `<path d="M152 ${f(36 + i * 5)}L164 ${f(29 + i * 5)}" stroke="#000" stroke-opacity=".4" stroke-width="1.6"/>`; return m; })() +
        `<path d="M36 30L52 22H166L150 30Z" fill="${x.lg([[0, H.shade(c, .3)], [1, H.shade(c, .5)]])}"/>` +
        `<rect x="36" y="30" width="114" height="140" rx="3" fill="${M.v(x, c)}"/>` +
        `<rect x="42" y="36" width="102" height="128" rx="2" fill="${x.lg([[0, "#20222a"], [1, "#0b0c10"]])}"/>` +
        `<rect x="48" y="42" width="72" height="80" rx="1.5" fill="${x.lg([[0, "#2c2f37"], [1, "#1a1c21"]])}"/>` +
        `<rect x="62" y="54" width="22" height="22" rx="2" fill="${M.steel(x)}"/>` + vents(64, 57, 18, 4, 4.4) + ram +
        fan(x, 58, 46, 6, "#3fd0ff", .9) +
        `<rect x="46" y="104" width="84" height="18" rx="2" fill="${x.lg([[0, "#3a3d45"], [1, "#16171b"]])}"/><rect x="48" y="119" width="80" height="2" fill="${x.on ? "#7a5cff" : "#2a2c33"}"/>` +
        (x.on ? `<rect x="48" y="117" width="80" height="6" fill="${M.halo(x, "#7a5cff")}" opacity=".6"/>` : "") +
        `<rect x="48" y="134" width="70" height="24" rx="2" fill="#15161a"/>` +
        fan(x, 132, 56, 10.5, "#ff4fd8", .6) + fan(x, 132, 84, 10.5, "#7a5cff", .65) + fan(x, 132, 112, 10.5, "#3fd0ff", .7) +
        (x.on ? `<rect x="42" y="36" width="102" height="128" fill="${x.rg([[0, "#7a5cff", .25], [1, "#7a5cff", 0]], .7, .5, .7)}"/>` : "") +
        `<path d="M46 40L80 40L50 160H46Z" fill="#fff" fill-opacity=".07"/><rect x="42" y="36" width="102" height="128" rx="2" fill="none" stroke="#fff" stroke-opacity=".18"/>` +
        led(x, 158, 34, .9, "#f2f6ff");
      return scene(x, back, body); }),

    ic("office", "Office tower", sw(BLK, "#2c2f36"), "Case", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "cream", 8, 140) + deskB(x, 140, "#9a7652");
      const body = monitor(x, 92, 40, 92, 56, 1, 146) + shadowE(x, 58, 170, 34, 5) +
        slab(x, 28, 54, 54, 116, 10, 7, c) +
        `<rect x="34" y="62" width="42" height="12" rx="1.5" fill="${H.shade(c, -.25)}"/><rect x="38" y="66.5" width="34" height="2" rx="1" fill="#000" fill-opacity=".5"/>` +
        button(x, 55, 88, 4, H.shade(c, .15)) + led(x, 55, 98, 1, "#4da3ff") +
        `<rect x="44" y="106" width="5" height="2.6" rx=".6" fill="#06070a"/><rect x="51" y="106" width="5" height="2.6" rx=".6" fill="#06070a"/><circle cx="62" cy="107.3" r="1.4" fill="#06070a"/>` +
        vents(36, 128, 38, 6, 5) +
        `<path d="M88 168L160 168L164 176H84Z" fill="${x.lg([[0, "#2a2c31"], [1, "#16171a"]])}"/>` + (() => { let k = ""; for (let i = 0; i < 14; i++) k += `<rect x="${89 + i * 5}" y="170" width="4" height="2" rx=".5" fill="#3a3d44"/>`; return k; })();
      return scene(x, back, body); }),

    ic("sff", "Small form factor", sw(BLK, "#2c2f36"), "Case", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 140) + deskB(x, 140, "#8a6142");
      const body = shadowE(x, 102, 162, 80, 7) + slab(x, 30, 126, 132, 30, 14, 9, c) +
        `<rect x="36" y="132" width="40" height="5" rx="1.5" fill="${H.shade(c, -.3)}"/><rect x="38" y="134" width="36" height="1.2" fill="#000" fill-opacity=".5"/>` +
        button(x, 150, 141, 3.4, H.shade(c, .15)) + led(x, 140, 141, 1, "#4fe08a") +
        `<rect x="40" y="145" width="5" height="2.6" rx=".6" fill="#06070a"/><rect x="47" y="145" width="5" height="2.6" rx=".6" fill="#06070a"/>` + vents(90, 132, 40, 4, 5.4) +
        monitor(x, 40, 30, 120, 70, 0, 124);
      return scene(x, back, body); }),

    ic("mini", "Mini PC", sw(BLK, "#2c2f36"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "lav", 8, 120) + deskB(x, 120, "#8a6142");
      const body = shadowE(x, 106, 152, 60, 8) + slab(x, 52, 104, 80, 34, 26, 22, c, { r: 4, top: x.lg([[0, H.shade(c, -.1)], [1, H.shade(c, .3)]], 0, 0, 1, 1) }) +
        `<path d="M70 90L120 90L136 80" fill="none" stroke="#fff" stroke-opacity=".08"/>` +
        button(x, 66, 121, 4.4, H.shade(c, .1)) + ringLed(x, 66, 121, 5.6, 5.6, .9, "#4da3ff") +
        `<rect x="80" y="117" width="7" height="3.4" rx=".6" fill="#06070a"/><rect x="90" y="117" width="7" height="3.4" rx=".6" fill="#06070a"/><rect x="100" y="117" width="5" height="2.6" rx="1.2" fill="#06070a"/><circle cx="112" cy="119" r="1.6" fill="#06070a"/>` +
        `<path d="M58 134H126" stroke="#000" stroke-opacity=".3"/>` +
        `<path d="M140 150Q150 140 166 146T186 148" fill="none" stroke="#24262c" stroke-width="2"/><ellipse cx="160" cy="160" rx="10" ry="6" fill="${M.v(x, "#2c2f36")}"/><path d="M160 154V158" stroke="#000" stroke-opacity=".4"/>`;
      return scene(x, back, body); }),

    ic("aio", "All-in-one", sw(ALU, "#c9ccd1"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "blue", 8, 150) + deskB(x, 150, "#b08a62");
      const body = shadowE(x, 100, 166, 46, 5) +
        `<path d="M84 128L80 162H120L116 128Z" fill="${M.metal(x, c)}"/><path d="M76 162H124L128 166H72Z" fill="${M.metal(x, c)}"/>` +
        `<rect x="22" y="20" width="156" height="112" rx="5" fill="${M.metal(x, c)}"/>` +
        `<rect x="24" y="22" width="152" height="94" rx="3.5" fill="#0b0c0f"/>` + scr(x, 27, 25, 146, 88, 2, { dock: true }) +
        `<rect x="22" y="116" width="156" height="16" rx="5" fill="${x.lg([[0, H.shade(c, .25)], [1, H.shade(c, -.2)]])}"/><rect x="22" y="116" width="156" height="4" fill="${x.lg([[0, H.shade(c, .25)], [1, H.shade(c, .15)]])}"/>` +
        `<path d="M24 131H176" stroke="#000" stroke-opacity=".25"/>`;
      return scene(x, back, body); }),

    ic("square", "Compact desktop", sw(ALU, "#c9ccd1"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "sage", 8, 132) + deskB(x, 132, "#8a6142");
      const body = monitor(x, 28, 26, 104, 64, 3, 130) +
        shadowE(x, 120, 164, 58, 7) +
        `<path d="M78 148Q76 152 82 152H164Q170 152 172 148L186 132Q188 128 182 128H100Q94 128 92 132Z" fill="${x.lg([[0, H.shade(c, .35)], [1, H.shade(c, -.05)]], 0, 0, 1, 1)}"/>` +
        `<path d="M78 148Q76 152 82 152H164Q170 152 172 148V156Q170 160 164 160H82Q76 160 78 156Z" fill="${x.lg([[0, H.shade(c, -.1)], [1, H.shade(c, -.45)]])}"/>` +
        `<path d="M172 148L186 132V140L172 156Z" fill="${M.side(x, c)}"/>` +
        `<path d="M94 132H180" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/><path d="M82 152H166" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/>` +
        led(x, 160, 156, .8, "#f2f6ff", .6);
      return scene(x, back, body); }),

    ic("ultra-thin-laptop", "Ultra-thin laptop", sw(ALU, "#c9ccd1"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 116) + deskB(x, 116, "#b08a62");
      return scene(x, back, laptop(x, { x0: 46, x1: 154, y0: 36, hy: 120, fy: 158, body: c, bezel: "#0c0d10", keys: "#1e2025", seed: 0, thick: 2.6, bezelW: 3.5 })); }),

    ic("business", "Business laptop", sw(["#1b1c20", "#2c2f36", "#5b5f66", "#c9ccd1"], "#1b1c20"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "blue", 8, 116) + deskB(x, 116, "#6e4d33");
      return scene(x, back, laptop(x, { x0: 44, x1: 156, y0: 34, hy: 120, fy: 158, body: c, bezel: "#131417", keys: "#0e0f12", stick: true, seed: 1, thick: 4.5, bezelW: 6 })); }),

    ic("gaminglap", "Gaming laptop", sw(BLK, "#1b1c20"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "navy", 8, 116) + deskB(x, 116, "#5d4330");
      const extra = `<path d="M38 166L52 166M148 166L162 166" stroke="${x.on ? "#ff4f6a" : "#3a2a2e"}" stroke-width="1.6" stroke-linecap="round"/>`;
      return scene(x, back, laptop(x, { x0: 42, x1: 158, y0: 36, hy: 118, fy: 158, body: c, bezel: "#0b0c0f", keys: "#15161a", rgb: true, seed: 2, thick: 7, bezelW: 4 }) + extra); }),

    ic("tent", "2-in-1 tent", sw(ALU, "#5b5f66"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "lav", 8, 130) + deskB(x, 130, "#9a7652");
      const cp = clipU(x, "tent", `<path d="M66 60H134L152 158H48Z"/>`);
      const body = shadowE(x, 100, 164, 72, 7) +
        `<path d="M64 52H136L178 156H22Z" fill="${x.lg([[0, H.shade(c, -.4)], [1, H.shade(c, -.15)]], 0, 0, 1, 0)}"/>` +
        `<path d="M64 54H136L160 162H40Z" fill="${x.lg([[0, H.shade(c, .2)], [1, H.shade(c, -.2)]])}"/>` +
        `<path d="M68 58H132L154 160H46Z" fill="#0b0c0f"/>` +
        `<g clip-path="${cp}">${scr(x, 44, 60, 110, 98, 3, { bat: true })}</g>` +
        `<rect x="62" y="48" width="76" height="7" rx="3.5" fill="${M.metal(x, c)}"/>` +
        `<path d="M40 162H160" stroke="#fff" stroke-opacity=".35"/>` + led(x, 100, 158.5, .7, lvlCol(x, "#f2f6ff"), .4);
      return scene(x, back, body); }),

    ic("budget-laptop", "Budget laptop", sw(["#d8dade", "#eef0f2", "#5b5f66", "#9fb4c8", "#2c2f36"], "#d8dade"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "cream", 8, 116) + deskB(x, 116, "#a07a55");
      return scene(x, back, laptop(x, { x0: 48, x1: 152, y0: 38, hy: 120, fy: 156, body: c, bezel: "#202226", keys: "#26282d", seed: 1, thick: 6, bezelW: 7, rounded: true, dock: true })); }),

    ic("binshred", "Bin shredder", sw(BLK, "#1b1c20"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "gray", 8, 130) + baseB(x, 130, "#7a5638");
      const cpP = clipU(x, "pap", `<rect x="40" y="8" width="120" height="52"/>`), cpW = clipU(x, "win", `<rect x="74" y="98" width="52" height="52" rx="3"/>`);
      let pile = ""; const r = rnd(3);
      for (let i = 0; i < 26; i++) { const sx = 76 + r() * 48, sy = 132 + r() * 18; pile += `<path d="M${f(sx)} ${f(sy)}q${f(r() * 6 - 3)} -4 ${f(r() * 4 - 2)} -9" fill="none" stroke="${r() > .3 ? "#f2f2ee" : "#cfd6e4"}" stroke-width="1.6" stroke-linecap="round"/>`; }
      let strips = "";
      if (x.on) for (let i = 0; i < 9; i++) strips += `<rect class="${P}fall" x="${80 + i * 5}" y="98" width="2.4" height="${12 + (i % 3) * 4}" fill="#f4f4f0" style="animation-delay:${(-i * .17).toFixed(2)}s"/>`;
      const sheet = `<g${x.on ? ` class="${P}feed"` : ""}><rect x="72" y="${x.on ? 20 : 30}" width="56" height="48" fill="${x.lg([[0, "#ffffff"], [1, "#e9e9e4"]])}"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M78 ${(x.on ? 28 : 38) + i * 6}H${110 + (i % 2) * 10}" stroke="#7c8696" stroke-width="1.2"/>`).join("") + `</g>`;
      const body = shadowE(x, 102, 172, 56, 7) +
        `<path d="M52 82H148L140 168H60Z" fill="${x.lg([[0, H.shade(c, -.3)], [.35, H.shade(c, .25)], [1, H.shade(c, -.4)]], 0, 0, 1, 0)}"/>` +
        `<rect x="72" y="96" width="56" height="56" rx="4" fill="${H.shade(c, -.4)}"/><rect x="74" y="98" width="52" height="52" rx="3" fill="${x.lg([[0, "#2a3038"], [1, "#11141a"]])}"/>` +
        `<g clip-path="${cpW}">${pile}${strips}</g><path d="M78 100L90 100L80 148H78Z" fill="#fff" fill-opacity=".14"/>` +
        `<g clip-path="${cpP}">${sheet}</g>` +
        `<path d="M44 60H156L160 66H40Z" fill="${x.lg([[0, H.shade(c, .45)], [1, H.shade(c, .15)]])}"/><rect x="66" y="58" width="68" height="4" rx="2" fill="#06070a"/>` +
        `<rect x="40" y="66" width="120" height="18" rx="3" fill="${M.v(x, c)}"/><path d="M41 66.5H159" stroke="#fff" stroke-opacity=".4"/>` +
        `<rect x="132" y="70" width="20" height="9" rx="4.5" fill="#0d0e11"/><rect x="${x.on ? 141 : 133}" y="71" width="10" height="7" rx="3.5" fill="${M.v(x, "#9aa1aa")}"/>` + led(x, 124, 74.5, 1.1, GREEN);
      return scene(x, back, body); }),

    ic("personal", "Personal shredder", sw(["#eef0f2", "#2c2f36", "#5b5f66", "#9fb4c8", "#e8c9a6"], "#eef0f2"), "Body", (o) => { const x = X(o), c = o.color;
      const back = wallB(x, "sage", 8, 136) + deskB(x, 136, "#8a6142");
      let mesh = ""; for (let i = 0; i <= 10; i++) mesh += `<path d="M${64 + i * 7.2} 116L${68 + i * 6.4} 168" stroke="#c9ced5" stroke-opacity=".7" stroke-width="1"/>`;
      for (let j = 0; j < 4; j++) mesh += `<path d="M${64 + j * 1} ${124 + j * 12}H${136 - j * 1}" stroke="#c9ced5" stroke-opacity=".7" stroke-width="1"/>`;
      let conf = ""; const r = rnd(9);
      for (let i = 0; i < 30; i++) conf += `<rect x="${f(70 + r() * 60)}" y="${f(152 + r() * 14)}" width="2.4" height="1.4" fill="${r() > .3 ? "#f2f2ee" : "#cfd6e4"}" transform="rotate(${Math.round(r() * 90)} ${f(70 + r() * 60)} 158)"/>`;
      let fall = ""; if (x.on) for (let i = 0; i < 8; i++) fall += `<rect class="${P}drop" x="${76 + i * 6}" y="118" width="2.4" height="1.6" fill="#f4f4f0" style="animation-delay:${(-i * .19).toFixed(2)}s"/>`;
      const bcp = clipU(x, "bask", `<path d="M64 116H136L132 168H68Z"/>`);
      const body = shadowE(x, 100, 170, 46, 5) + `<path d="M64 116H136L132 168H68Z" fill="#000" fill-opacity=".3"/>` + `<g clip-path="${bcp}">${conf}${fall}</g>` + mesh +
        `<path d="M66 168H134" stroke="#c9ced5" stroke-width="2"/>` +
        `<g${x.on ? ` class="${P}feed2"` : ""}><rect x="80" y="62" width="40" height="40" fill="${x.lg([[0, "#ffffff"], [1, "#e9e9e4"]])}"/>` + [0, 1, 2, 3].map((i) => `<path d="M85 ${70 + i * 6}H${105 + (i % 2) * 8}" stroke="#7c8696" stroke-width="1.1"/>`).join("") + `</g>` +
        `<path d="M58 98H142L146 104H54Z" fill="${x.lg([[0, H.shade(c, .45)], [1, H.shade(c, .1)]])}"/><rect x="74" y="96.5" width="52" height="3.5" rx="1.7" fill="#06070a"/>` +
        `<rect x="54" y="104" width="92" height="16" rx="4" fill="${M.v(x, c)}"/><path d="M56 104.5H144" stroke="#fff" stroke-opacity=".5"/>` +
        `<rect x="124" y="108" width="14" height="7" rx="3.5" fill="#0d0e11"/><rect x="${x.on ? 131 : 125}" y="109" width="6" height="5" rx="2.5" fill="${M.v(x, "#9aa1aa")}"/>` + led(x, 116, 111.5, 1, GREEN);
      return scene(x, back, body); }),
  ];

  const css = `
.hda-office-flow{opacity:0}
.hda-anim .hda-office-flow{animation:hda-office-flow 1.6s linear infinite}
@keyframes hda-office-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-office-pulse{animation:hda-office-pulse 2.6s ease-in-out infinite}
@keyframes hda-office-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-office-blink{animation:hda-office-blink 1.1s ease-in-out infinite}
@keyframes hda-office-blink{0%,100%{opacity:1}50%{opacity:.15}}
.hda-office-sweepx,.hda-office-sweepy{transform-box:fill-box}
.hda-anim .hda-office-sweepx{animation:hda-office-sx 2.2s linear infinite}
.hda-anim .hda-office-sweepy{animation:hda-office-sy 2.2s linear infinite}
@keyframes hda-office-sx{0%{transform:translate(0,0)}100%{transform:translate(400%,0)}}
@keyframes hda-office-sy{0%{transform:translate(0,0)}100%{transform:translate(0,-400%)}}
.hda-office-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-office-spin{animation:hda-office-spin .7s linear infinite}
@keyframes hda-office-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.hda-anim .hda-office-rgb{animation:hda-office-rgb 3s ease-in-out infinite}
@keyframes hda-office-rgb{0%,100%{opacity:.2}50%{opacity:.9}}
.hda-anim .hda-office-feed{animation:hda-office-feed 3s linear infinite}
@keyframes hda-office-feed{0%{transform:translate(0,-6px)}100%{transform:translate(0,40px)}}
.hda-anim .hda-office-feed2{animation:hda-office-feed2 3s linear infinite}
@keyframes hda-office-feed2{0%{transform:translate(0,-4px)}100%{transform:translate(0,30px)}}
.hda-office-fall{opacity:0}
.hda-anim .hda-office-fall{animation:hda-office-fall 1.2s linear infinite}
@keyframes hda-office-fall{0%{transform:translate(0,0);opacity:0}10%{opacity:1}85%{opacity:1}100%{transform:translate(0,34px);opacity:0}}
.hda-office-drop{opacity:0}
.hda-anim .hda-office-drop{animation:hda-office-drop 1.3s ease-in infinite}
@keyframes hda-office-drop{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(0,34px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-office-flow,.hda-anim .hda-office-pulse,.hda-anim .hda-office-blink,.hda-anim .hda-office-sweepx,.hda-anim .hda-office-sweepy,.hda-anim .hda-office-spin,.hda-anim .hda-office-rgb,.hda-anim .hda-office-feed,.hda-anim .hda-office-feed2,.hda-anim .hda-office-fall,.hda-anim .hda-office-drop{animation:none!important}}
`;

  (window.HDA = window.HDA || []).push({
    id: "office", tab: "Computers & office", group: "Home", kind: "device",
    intro: "Seventeen UPS battery backups, desktops, laptops and shredders on real desks and floors. The slider is the battery: UPS screens and LEDs fill with it and warn in amber or red below 20%, laptops show it in the taskbar. On means running: screens show wallpaper, fans spin, RGB keys glow, paper feeds into the shredders.",
    
    levelLabel: "Battery", onWord: "On", offWord: "Off",
    css, icons,
  });
})();
