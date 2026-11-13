(function () {
  const H = window.HDAH, P = "hda-plug-";
  const f = (n) => (+n).toFixed(1), a2 = (n) => Math.max(0, Math.min(1, n)).toFixed(2);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const LEDS = ["#4da3ff", "#f2f6ff", "#34d399", "#ffb347", "#ff5257"];
  const BODY = ["#eef0f2", "#2c2f36", "#9aa1aa", "#e6dcc6", "#56657a"];
  const sw = (list, first) => [first].concat(list.filter((c) => c !== first));

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

  const REGIONS = [["us", "US"], ["eu", "EU (Schuko)"], ["uk", "UK"], ["au", "Australia"], ["ch", "Switzerland"], ["it", "Italy"]];
  const REG_OPT = { id: "region", name: "Region", values: REGIONS };
  let REG = "us";
  const RS = (c, a) => window.HDAH.shade(c, a);
  const rC = (x0, y0, r, fill, extra) => `<circle cx="${f(x0)}" cy="${f(y0)}" r="${f(r)}" fill="${fill}"${extra || ""}/>`;
  const rR = (x0, y0, w, h, r, fill, rot, extra) => `<rect x="${f(x0 - w / 2)}" y="${f(y0 - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fill}"${rot ? ` transform="rotate(${rot} ${f(x0)} ${f(y0)})"` : ""}${extra || ""}/>`;
  function rsock(cx, cy, k, col, reg) {
    reg = reg || REG; const hole = "#141416", met = "#cfd3d8", lip = RS(col, -.28), deep = RS(col, -.2);
    if (reg === "eu") return rC(cx, cy + .6 * k, 17.5 * k, "#000", ` fill-opacity=".25"`) + rC(cx, cy, 17.5 * k, lip) + rC(cx, cy + .8 * k, 15.6 * k, deep) +
      rC(cx, cy + 1.2 * k, 14.2 * k, RS(col, -.12)) + rC(cx - 8 * k, cy + 1 * k, 2.5 * k, hole) + rC(cx + 8 * k, cy + 1 * k, 2.5 * k, hole) +
      rR(cx, cy - 14.6 * k, 7 * k, 2.8 * k, .8 * k, met) + rR(cx, cy + 15.6 * k, 7 * k, 2.8 * k, .8 * k, met) +
      `<path d="M${f(cx - 12 * k)} ${f(cy + 9 * k)}A${f(15 * k)} ${f(15 * k)} 0 0 0 ${f(cx + 12 * k)} ${f(cy + 9 * k)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f(.8 * k)}"/>`;
    if (reg === "uk") return rR(cx, cy - 7 * k, 3.2 * k, 8.5 * k, .6 * k, hole) + rR(cx - 7.8 * k, cy + 6 * k, 8.5 * k, 3.2 * k, .6 * k, hole) + rR(cx + 7.8 * k, cy + 6 * k, 8.5 * k, 3.2 * k, .6 * k, hole);
    if (reg === "au") return rR(cx - 5.8 * k, cy - 2 * k, 2.6 * k, 8.5 * k, .6 * k, hole, 30) + rR(cx + 5.8 * k, cy - 2 * k, 2.6 * k, 8.5 * k, .6 * k, hole, -30) + rR(cx, cy + 8.5 * k, 2.6 * k, 7.5 * k, .6 * k, hole);
    if (reg === "ch") { const hx = `M${f(cx - 9 * k)} ${f(cy - 11 * k)}H${f(cx + 9 * k)}L${f(cx + 13.5 * k)} ${f(cy - 2 * k)}L${f(cx + 4.5 * k)} ${f(cy + 12 * k)}H${f(cx - 4.5 * k)}L${f(cx - 13.5 * k)} ${f(cy - 2 * k)}Z`;
      return `<path d="${hx}" fill="${lip}" stroke="${lip}" stroke-width="${f(3 * k)}" stroke-linejoin="round"/><path d="${hx}" fill="${deep}" transform="translate(0 ${f(.8 * k)})"/>` +
        rC(cx - 7 * k, cy - 3 * k, 2.1 * k, hole) + rC(cx + 7 * k, cy - 3 * k, 2.1 * k, hole) + rC(cx, cy + 5 * k, 2.1 * k, hole); }
    if (reg === "it") return rR(cx, cy, 16 * k, 34 * k, 3 * k, lip) + rR(cx, cy + .6 * k, 14 * k, 31 * k, 2.4 * k, RS(col, -.08)) +
      [-9, 0, 9].map((dy) => rR(cx, cy + dy * k, 2.6 * k, dy ? 5.4 * k : 2.6 * k, 1.3 * k, hole)).join("");
    return "";
  }
  function rplugHead(cx, cy, k, col, reg) {
    reg = reg || REG; const lt = RS(col, .35), dk = RS(col, -.35);
    let body;
    if (reg === "eu") body = rC(cx, cy, 15.5 * k, col) + rC(cx, cy, 15.5 * k, "none", ` stroke="${dk}" stroke-width="${f(.8 * k)}"`) + rC(cx, cy, 11 * k, lt, ` fill-opacity=".35"`) + rC(cx, cy, 7 * k, col) +
      `<path d="M${f(cx + 8 * k)} ${f(cy + 9 * k)}l${f(6 * k)} ${f(8 * k)}" stroke="${col}" stroke-width="${f(7 * k)}" stroke-linecap="round"/>`;
    else if (reg === "uk") body = rR(cx, cy + 2 * k, 24 * k, 27 * k, 4 * k, col) + rR(cx, cy - 4 * k, 18 * k, 10 * k, 3 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 16 * k, 8 * k, 6 * k, 2 * k, col);
    else if (reg === "au") body = rR(cx, cy + 1 * k, 21 * k, 19 * k, 3.5 * k, col) + rR(cx, cy - 2 * k, 15 * k, 7 * k, 2.4 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 11 * k, 7 * k, 5 * k, 2 * k, col);
    else if (reg === "ch") body = rR(cx, cy, 20 * k, 15 * k, 5 * k, col) + rR(cx, cy - 2 * k, 14 * k, 6 * k, 2.4 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 8.5 * k, 6 * k, 5 * k, 2 * k, col);
    else body = rR(cx, cy, 13 * k, 28 * k, 5 * k, col) + rR(cx, cy - 6 * k, 8 * k, 10 * k, 3 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 15 * k, 6 * k, 5 * k, 2 * k, col);
    return `<g transform="translate(${f(1.5 * k)} ${f(3 * k)})" opacity=".35">${body.replace(/fill="[^"]*"/g, 'fill="#000"').replace(/stroke="[^"]*"/g, 'stroke="#000"')}</g>` + body;
  }
  function rswitch(cx, cy, k, col, on) {
    return rR(cx, cy + .6 * k, 10 * k, 14 * k, 2 * k, "#000", 0, ` fill-opacity=".3"`) + rR(cx, cy, 10 * k, 14 * k, 2 * k, RS(col, -.08)) +
      rR(cx, on ? cy - 3 * k : cy + 3 * k, 8 * k, 6 * k, 1.5 * k, RS(col, on ? -.2 : .2)) + (on ? rR(cx, cy - 4.6 * k, 5 * k, 1.8 * k, .8 * k, "#e2402f") : "");
  }
  function holes(x, cx, cy, s) {
    if (REG !== "us") return rsock(cx, cy - .4 * s, .52 * s, "#e6e8eb");
    const hs = [
      `M${f(cx - 5.6 * s)} ${f(cy - 7 * s)}h${f(2 * s)}v${f(7.8 * s)}h${f(-2 * s)}z`,
      `M${f(cx + 3.6 * s)} ${f(cy - 6.4 * s)}h${f(2 * s)}v${f(6.4 * s)}h${f(-2 * s)}z`,
      `M${f(cx - 2.4 * s)} ${f(cy + 3.2 * s)}h${f(4.8 * s)}v${f(1.4 * s)}a${f(2.4 * s)} ${f(2.4 * s)} 0 0 1 ${f(-4.8 * s)} 0z`];
    return hs.map((d) => `<path d="${d}" fill="#fff" fill-opacity=".55" transform="translate(0 ${f(.7 * s)})"/><path d="${d}" fill="${M.hole(x)}"/>`).join("");
  }
  function face(x, cx, cy, s, col) {
    if (REG !== "us") return rsock(cx, cy - .4 * s, .58 * s, col || "#eceef1");
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
  function plateR(x, cx, cy, s, col, d) {
    col = col || "#eceef1"; const w = 48 * s, h = 86 * s;
    let g = plateBody(x, cx - w / 2, cy - h / 2, w, h, 6 * s, col);
    [-d, d].forEach((dy) => { const y = cy + dy * s;
      g += `<rect x="${f(cx - 19 * s)}" y="${f(y - 19 * s)}" width="${f(38 * s)}" height="${f(38 * s)}" rx="${f(3 * s)}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".7"/>` + rsock(cx, y - .4 * s, .58 * s, col);
      if (REG === "uk" || REG === "au") g += rswitch(cx + 16 * s, y - 14 * s, .4 * s, col, x.on); });
    return g;
  }
  function plateT(x, cx, cy, s, col) {
    if (REG !== "us") return plateR(x, cx, cy, s, col, 17);
    col = col || "#eceef1"; const w = 50 * s, h = 80 * s;
    return plateBody(x, cx - w / 2, cy - h / 2, w, h, 4 * s, col) + face(x, cx, cy - 17 * s, s, col) + face(x, cx, cy + 17 * s, s, col) + screw(x, cx, cy, 2.6 * s, .3);
  }
  function plateD(x, cx, cy, s, col, inner) {
    if (REG !== "us") return plateR(x, cx, cy, s, col, 13) + (inner || "");
    col = col || "#eceef1"; const w = 48 * s, h = 78 * s, iw = 29 * s, ih = 58 * s;
    return plateBody(x, cx - w / 2, cy - h / 2, w, h, 3.5 * s, col) +
      `<rect x="${f(cx - iw / 2 - 1)}" y="${f(cy - ih / 2 - 1)}" width="${f(iw + 2)}" height="${f(ih + 2)}" rx="${f(2.6 * s)}" fill="#000" fill-opacity=".3"/>
<rect x="${f(cx - iw / 2)}" y="${f(cy - ih / 2)}" width="${f(iw)}" height="${f(ih)}" rx="${f(2.4 * s)}" fill="${x.lg([[0, H.shade(col, .5)], [.5, H.shade(col, -.04)], [1, H.shade(col, -.2)]])}"/>
<path d="M${f(cx - iw / 2 + 2)} ${f(cy - ih / 2 + 1)}H${f(cx + iw / 2 - 2)}" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>` +
      (inner || "") + holes(x, cx, cy - 13 * s, s) + holes(x, cx, cy + 13 * s, s);
  }

  function plugHead(x, cx, cy, s, col, rot) {
    if (REG !== "us") return `<g${rot ? ` transform="rotate(${rot} ${f(cx)} ${f(cy)})"` : ""}>${rplugHead(cx, cy - .4 * s, .5 * s, col)}</g>`;
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

  const NO_REG = { heavy: 1, ev: 1 };
  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label,
    render: (o) => { REG = !NO_REG[id] && o.opt && o.opt.region || "us"; try { return render(o); } finally { REG = "us"; } } },
    NO_REG[id] ? {} : { options: [REG_OPT] }, extra || {});

  const icons = [
    ic("mini", "Mini smart plug", sw(LEDS, "#4da3ff"), "LED", (o) => { const x = X(o);
      const back = wallB(x, "sage", 8, 158) + baseB(x, 158, "#8a6142");
      const body = plateT(x, 100, 98, 1.05) + spot(x, 100, 70, 40, 34, x.led, .35) +
        box(x, 80, 58, 40, 46, 10, 3, 4, "#eef0f2") +
        `<path d="M84 64Q100 58 116 64" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/>` +
        holes(x, 100, 89, .8) + ringLed(x, 100, 70, 5.4, 5.4, 1.4) + button(x, 100, 70, 3.8, "#e4e6ea") +
        plugHead(x, 100, 90, .9, "#3a3d45") +
        cord(x, [100, 102, 100, 128, 96, 146, 112, 166, 128, 184, 160, 180, 200, 186], 3.4, "#3a3d45", x.led);
      return scene(x, back, body); }),

    ic("round", "Round smart plug", sw(LEDS, "#f2f6ff"), "LED", (o) => { const x = X(o);
      const back = wallB(x, "blue", 8, 166) + baseB(x, 166, "#6e4a33");
      const body = plateD(x, 100, 104, 1.02) + spot(x, 100, 91, 52, 48, x.led, .32) +
        `<circle cx="104" cy="97" r="29" fill="#000" fill-opacity=".3"/>` +
        `<circle cx="102" cy="94" r="28" fill="${M.side(x, "#e8eaee")}"/><circle cx="100" cy="91" r="27.5" fill="${M.s(x, "#f4f5f7")}"/>` +
        ringLed(x, 100, 91, 26, 26, 1.6) +
        `<circle cx="100" cy="91" r="22" fill="${x.rg([[0, "#ffffff"], [.7, "#eceef2"], [1, "#cfd2d9"]], .4, .35, .7)}"/>
<path d="M82 80A22 22 0 0 1 104 69.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-opacity=".9"/>` +
        holes(x, 100, 90, .8) + plugHead(x, 100, 92, .9, "#f0f0f2") +
        cord(x, [100, 104, 100, 130, 92, 150, 76, 166, 60, 182, 34, 180, 6, 186], 3.4, "#e8e8ec", x.led);
      return scene(x, back, body); }),

    ic("side", "Side-button plug", sw(BODY, "#eef0f2"), "Body", (o) => { const x = X(o, { body: o.color, led: "#4da3ff" }); const p = pal(x.body);
      const back = wallB(x, "clay");
      const body = plateT(x, 90, 96, 1.1) + spot(x, 124, 130, 26, 24, "#4da3ff", .4) +
        box(x, 70, 98, 40, 56, 8, 11, 3, x.body) +
        `<path d="M110 104L121 107V151L110 148Z" fill="${x.lg([[0, H.shade(x.body, -.12)], [1, H.shade(x.body, -.42)]], 0, 0, 1, 0)}" opacity=".55"/>` +
        `<ellipse cx="116.4" cy="116" rx="3" ry="5.4" fill="#000" fill-opacity=".3"/><ellipse cx="116" cy="115.4" rx="2.6" ry="5" fill="${M.h(x, H.shade(x.body, -.05))}"/>` +
        led(x, 116, 130, 1.3, "#4da3ff") +
        holes(x, 90, 128, .82) + plugHead(x, 90, 130, .9, "#2d3037") +
        `<path d="M74 103Q90 99 106 103" fill="none" stroke="${p.l}" stroke-opacity=".8" stroke-width="1.2" stroke-linecap="round"/>` +
        cord(x, [90, 142, 90, 162, 104, 172, 130, 176, 156, 180, 176, 190, 196, 200], 3.4, "#2d3037", "#4da3ff");
      return scene(x, back, body); }),

    ic("energy", "Energy monitor plug", sw(["#7dd3fc", "#f2f6ff", "#34d399", "#ffb347", "#ff5257"], "#7dd3fc"), "Display", (o) => { const x = X(o);
      const back = tileB(x, 8, 152) + counterB(x, 152, "#c9cbd2");
      const body = plateT(x, 100, 92, 1.0) +
        box(x, 70, 48, 60, 78, 10, 2, 5, "#2f3239") +
        `<path d="M76 54Q100 48 124 54" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" stroke-linecap="round"/>` +
        lcd(x, 77, 58, 46, 20, x.led) + digits(x, 113, 62, 12, watts(x), 4, x.led) +
        `<path d="M114.5 69L116 74L117.4 70.5L118.8 74L120.3 69" fill="none" stroke="${x.on ? H.mix(x.led, "#fff", .25) : "#fff"}" stroke-opacity="${x.on ? 1 : .08}" stroke-width=".9" stroke-linejoin="round"/>` +
        glass(x, 77, 58, 46, 20) +
        button(x, 92, 88, 3.4, "#3d4048") + led(x, 108, 88, 1.3) +
        holes(x, 100, 108, .82) + plugHead(x, 100, 110, .9, "#e8e8ec") +
        cord(x, [100, 122, 100, 140, 112, 156, 136, 162, 160, 168, 180, 164, 200, 168], 3.4, "#e8e8ec", x.led);
      return scene(x, back, body); }),

    ic("outdoor", "Outdoor plug", sw(["#2c2f36", "#8d949d", "#3f5a45", "#e9ebee", "#6b5a45"], "#2c2f36"), "Body", (o) => { const x = X(o, { body: o.color, led: "#34d399" });
      const back = sidingB(x, "#56616e");
      const rub = x.lg([[0, "#3a3c42"], [1, "#16171b"]]);
      const pocket = (cx) => `<rect x="${cx - 13}" y="106" width="26" height="32" rx="6" fill="#000" fill-opacity=".5"/><rect x="${cx - 12}" y="107" width="24" height="30" rx="5.4" fill="${x.lg([[0, "#1a1b20"], [1, "#2c2e35"]])}"/>`;
      const body = plateBody(x, 70, 20, 60, 74, 5, "#7d848d") + `<path d="M70 30H130" stroke="#000" stroke-opacity=".25"/><path d="M72 24Q100 16 128 24V32H72Z" fill="${M.v(x, "#8e959e")}"/>` + screw(x, 78, 86, 2) + screw(x, 122, 86, 2) +
        box(x, 66, 46, 68, 104, 13, 3, 5, x.body) +
        `<path d="M72 52Q100 44 128 52" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.3" stroke-linecap="round"/>` +
        ringLed(x, 100, 74, 8, 8, 1.4, "#34d399") + button(x, 100, 74, 6, H.shade(x.body, .08)) +
        pocket(84) + pocket(116) +
        `<rect x="72.5" y="106" width="23" height="31" rx="5.4" fill="${rub}"/><path d="M75 113H93M75 118H93M75 123H93M75 128H93" stroke="#fff" stroke-opacity=".08"/><path d="M73 107H95" stroke="#fff" stroke-opacity=".25"/>` +
        holes(x, 116, 121, .78) +
        `<path d="M104 106Q116 92 128 106L128 103Q116 88 104 103Z" fill="${rub}"/>` +
        plugHead(x, 116, 123, .9, "#e8792c") +
        cord(x, [116, 135, 116, 156, 128, 166, 146, 174, 164, 182, 176, 194, 186, 206], 4, "#e8792c", "#34d399");
      return scene(x, back, body); }),

    ic("inwall", "In-wall smart outlet", sw(LEDS, "#f2f6ff"), "LED", (o) => { const x = X(o);
      const back = wallB(x, "navy");
      const bar = (y) => `<rect x="88.5" y="${y - 2.2}" width="23" height="4.4" rx="2.2" fill="#14161b"/>` + (x.on ? `<g class="${P}pulse"><rect x="86" y="${y - 3}" width="28" height="7" rx="3.5" fill="${M.halo(x, x.led)}" opacity="${a2(.9 * x.L)}"/></g><rect x="90" y="${y - .9}" width="20" height="1.8" rx=".9" fill="${H.mix(x.led, "#fff", .5)}"/>`
        : `<rect x="90" y="${y - .9}" width="20" height="1.8" rx=".9" fill="${H.mix(x.led, "#15161b", .7)}"/>`);
      const inner = bar(66) + bar(134) + `<rect x="95" y="97.5" width="10" height="5" rx="1.6" fill="#000" fill-opacity=".25"/><rect x="95" y="97" width="10" height="5" rx="1.6" fill="${M.v(x, "#e4e6ea")}"/>`;
      const body = spot(x, 100, 100, 60, 70, x.led, .22) + plateD(x, 100, 100, 1.45, "#eef0f2", inner) +
        plugHead(x, 100, 121, 1.1, "#3a3d45") +
        cord(x, [100, 135, 100, 156, 112, 170, 132, 178, 152, 186, 170, 188, 200, 196], 4, "#3a3d45", x.led);
      return scene(x, back, body); }),

    ic("usbc", "USB-C outlet", sw(["#eef0f2", "#e6dcc6", "#2c2f36", "#9aa1aa", "#c9d2dc"], "#eef0f2"), "Body", (o) => { const x = X(o, { body: o.color, led: "#4da3ff" });
      const back = tileB(x, 8, 140, "#cfd8d4") + counterB(x, 140, "#8f7a64");
      const ports = `<rect x="88" y="76.5" width="9" height="5" rx=".8" fill="#0b0c10"/><rect x="89.4" y="77.6" width="6.2" height="1.6" fill="#5a6070"/>
<rect x="103" y="76.6" width="10" height="4.4" rx="2.2" fill="#0b0c10"/><rect x="105" y="78.2" width="6" height="1.2" rx=".6" fill="#5a6070"/>` + led(x, 100, 70.5, .9, "#4da3ff");
      const scr = x.on ? x.lg([[0, "#0d2a24"], [1, "#071612"]]) : "#0b0c10", lvl = Math.round(10 + 32 * x.lv);
      const body = plateD(x, 100, 79, 1.0, x.body, ports) +
        `<rect x="128" y="96" width="34" height="54" rx="5" fill="#000" fill-opacity=".35" transform="rotate(-6 145 150)"/>` +
        `<g transform="rotate(-8 145 146)"><rect x="128" y="92" width="32" height="56" rx="5" fill="${x.lg([[0, "#4a4e58"], [1, "#1a1c22"]], 0, 0, 1, 0)}"/>
<rect x="130" y="94" width="28" height="52" rx="3.6" fill="${scr}"/>` +
        (x.on ? `<rect x="138" y="${f(132 - lvl * .5)}" width="12" height="${f(lvl * .5 + 4)}" rx="1.4" fill="#34d399" opacity=".85"/><rect x="138" y="106" width="12" height="30" rx="1.6" fill="none" stroke="#9ff5cf" stroke-opacity=".7"/><rect x="141.5" y="104" width="5" height="2" fill="#9ff5cf" opacity=".7"/>
<path d="M145 112L141 121H145L143 129L149 118H145L147 112Z" fill="#fff" opacity=".95"/><g class="${P}pulse"><rect x="130" y="94" width="28" height="52" rx="3.6" fill="${x.rg([[0, "#34d399", .3], [1, "#34d399", 0]])}"/></g>` : "") +
        `<path d="M131 95L148 95L134 145H131Z" fill="#fff" fill-opacity=".06"/></g>` +
        `<rect x="104.5" y="81" width="7" height="9" rx="1.8" fill="#e8e8ec"/><rect x="104.5" y="81" width="3" height="9" rx="1.2" fill="#fff" fill-opacity=".6"/>` +
        cord(x, [108, 90, 108, 112, 120, 152, 138, 152, 146, 152, 146, 150, 146, 147], 2, "#f1f1f4", "#34d399", 10);
      return scene(x, back, body); }),

    ic("strip", "Smart power strip", sw(LEDS, "#4da3ff"), "LED", (o) => { const x = X(o); const n = x.on ? Math.max(1, Math.round(x.lv * 4)) : 0;
      const back = wallB(x, "gray", 8, 92) + `<rect x="8" y="92" width="184" height="100" fill="${x.lg([[0, "#5a3f2b"], [1, "#8d6646"]])}"/>` +
        `<path d="M8 92.6H192" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/>` + [104, 118, 136, 158, 184].map((y, i) => `<path d="M8 ${y}C60 ${y - 2} 120 ${y + 3} 192 ${y - 1}" fill="none" stroke="#2a180b" stroke-opacity="${(.15 + i * .03).toFixed(2)}" stroke-width=".7"/>`).join("");
      let outs = "";
      [46, 76, 106, 136].forEach((cx, i) => { const lit = i < n;
        outs += `<rect x="${cx - 12}" y="118" width="24" height="28" rx="5" fill="#000" fill-opacity=".12"/>` +
          (lit ? `<g class="${P}pulse"><rect x="${cx - 13}" y="117" width="26" height="30" rx="6" fill="none" stroke="${x.led}" stroke-opacity="${a2(.45 * x.L)}" stroke-width="3"/></g><rect x="${cx - 12}" y="118" width="24" height="28" rx="5" fill="none" stroke="${H.mix(x.led, "#fff", .4)}" stroke-width="1"/>`
            : `<rect x="${cx - 12}" y="118" width="24" height="28" rx="5" fill="none" stroke="#9aa0aa" stroke-opacity=".5" stroke-width=".8"/>`) +
          `<g transform="rotate(-90 ${cx} 132)">${holes(x, cx, 132, .82)}</g>` + led(lit ? x : Object.assign({}, x, { on: false }), cx, 112, 1.1); });
      const body = `<rect x="22" y="122" width="158" height="42" rx="14" fill="#000" fill-opacity=".3"/>` +
        box(x, 22, 104, 154, 48, 13, 0, 6, "#eef0f2") + outs +
        `<rect x="155" y="118" width="12" height="5.4" rx="1" fill="#0b0c10"/><rect x="156.4" y="119.2" width="9" height="1.6" fill="#5a6070"/><rect x="155" y="127" width="12" height="5.4" rx="1" fill="#0b0c10"/><rect x="156.4" y="128.2" width="9" height="1.6" fill="#5a6070"/>
<rect x="155.4" y="137" width="11" height="4.4" rx="2.2" fill="#0b0c10"/>` +
        cord(x, [24, 132, 14, 132, 10, 124, 4, 112], 3.6, "#e4e4ea") +
        plugHead(x, 46, 133, .9, "#2d3037", 90) + plugHead(x, 106, 133, .9, "#e9e9ee", 90) +
        cord(x, [54, 133, 64, 133, 62, 96, 60, 70, 58, 44, 70, 20, 66, 0], 3.2, "#2d3037", n > 0 ? x.led : null) +
        cord(x, [114, 133, 124, 133, 122, 98, 126, 70, 130, 44, 120, 22, 128, 0], 3.2, "#e9e9ee", n > 2 ? x.led : null);
      return scene(x, back, body); }),

    ic("surge", "Surge protector", sw(["#ff5257", "#ffb347", "#34d399", "#4da3ff", "#f2f6ff"], "#ff5257"), "Switch light", (o) => { const x = X(o);
      const back = wallB(x, "cream", 8, 34) + baseB(x, 34, "carpet");
      let outs = ""; for (let i = 0; i < 6; i++) { const cx = 60 + i * 20; outs += `<g transform="rotate(-90 ${cx} 120)">${face(x, cx, 120, .72, "#e9eaee")}</g>`; }
      const rocker = x.on ? `<g class="${P}pulse"><rect x="22" y="104" width="22" height="32" rx="6" fill="${M.halo(x, x.led)}" opacity="${a2(.9 * x.L)}"/></g><rect x="28" y="110" width="10" height="20" rx="2" fill="${x.lg([[0, H.mix(x.led, "#fff", .55)], [1, x.led]])}"/><rect x="29" y="111" width="8" height="7" rx="1.4" fill="#fff" opacity=".6"/>`
        : `<rect x="28" y="110" width="10" height="20" rx="2" fill="${x.lg([[0, H.mix(x.led, "#222", .55)], [1, H.mix(x.led, "#000", .8)]])}"/><rect x="29" y="122" width="8" height="7" rx="1.4" fill="#fff" opacity=".12"/>`;
      const body = `<g transform="rotate(-10 100 120)">` +
        cord(x, [20, 120, 6, 120, 4, 96, 12, 74, 20, 52, 20, 44, 26, 38], 3.6, "#2d3037") +
        `<ellipse cx="100" cy="142" rx="88" ry="10" fill="${M.shadow(x)}"/>` +
        box(x, 18, 102, 168, 36, 10, 0, 7, "#2b2d34") +
        `<rect x="18" y="102" width="168" height="5" rx="2.5" fill="#fff" fill-opacity=".12"/>` +
        `<rect x="26" y="108" width="14" height="24" rx="3" fill="#0e0f13"/>` + rocker + outs + led(x, 178, 112, 1.2, "#34d399") + led(x, 178, 126, 1.2, "#34d399", .6) +
        plugHead(x, 80, 120, .82, "#e9e9ee", 90) + plugHead(x, 140, 120, .82, "#2d3037", 90) +
        cord(x, [87, 120, 96, 120, 98, 140, 92, 160, 86, 180, 90, 196, 84, 214], 3, "#e9e9ee", x.led) +
        cord(x, [147, 120, 156, 120, 158, 98, 156, 80, 154, 62, 166, 48, 172, 30], 3, "#2d3037", x.led) + `</g>`;
      return scene(x, back, body); }),

    ic("tower", "Power tower", sw(BODY, "#2c2f36"), "Body", (o) => { const x = X(o, { body: o.color, led: "#4da3ff" }); const p = pal(x.body);
      const back = wallB(x, "lav", 8, 132) + `<rect x="8" y="132" width="184" height="60" fill="${x.lg([[0, "#b9b6c0"], [1, "#e4e1ea"]])}"/><path d="M8 132.6H192" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>`;
      const lf = `M66 54L100 64V176L66 166Z`, rf = `M100 64L132 54V166L100 176Z`, tp = `M66 54L100 64L132 54L98 45Z`;
      let o2 = "";
      [80, 108, 136].forEach((y) => { o2 += `<g transform="translate(83 ${y}) skewY(16) scale(.78 1)">${face(x, 0, 0, .78, H.shade(x.body, .12))}</g>`;
        o2 += `<g transform="translate(116 ${y}) skewY(-17) scale(.7 1)">${face(x, 0, 0, .78, H.shade(x.body, -.05))}</g>`; });
      const body = `<ellipse cx="100" cy="176" rx="44" ry="8" fill="${M.shadow(x)}"/>` +
        `<path d="${lf}" fill="${x.lg([[0, p.l], [1, p.m]], 0, 0, 1, 0)}"/><path d="${rf}" fill="${x.lg([[0, p.d], [1, p.k]], 0, 0, 1, 0)}"/>` +
        `<path d="${tp}" fill="${x.lg([[0, H.shade(x.body, .55)], [1, H.shade(x.body, .2)]])}"/>` +
        `<path d="M100 64V176" stroke="#fff" stroke-opacity=".35" stroke-width=".9"/><path d="M66 54V166" stroke="#fff" stroke-opacity=".25"/>` + o2 +
        `<path d="M77 54.6L83 56.4L86 55.4L80 53.6Z" fill="#0b0c10"/><path d="M90 57.6L96 59.4L99 58.4L93 56.6Z" fill="#0b0c10"/><path d="M106 59.8L112 58L114.6 58.8L108.6 60.6Z" fill="#0b0c10"/>` +
        (x.on ? `<g class="${P}pulse"><path d="${tp}" fill="none" stroke="#4da3ff" stroke-opacity="${a2(.35 * x.L)}" stroke-width="6" stroke-linejoin="round"/></g><path d="${tp}" fill="none" stroke="${H.mix("#4da3ff", "#fff", .45)}" stroke-width="1.3" stroke-linejoin="round"/>`
          : `<path d="${tp}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1" stroke-linejoin="round"/>`) +
        `<g transform="translate(83 108) skewY(16)">${plugHead(x, 0, 0, .78, "#e9e9ee")}</g>` +
        cord(x, [83, 122, 83, 140, 70, 156, 48, 160, 28, 164, 18, 176, 4, 178], 3, "#e9e9ee", "#4da3ff") +
        cord(x, [128, 168, 140, 172, 160, 172, 176, 166, 186, 162, 194, 156, 204, 156], 3.4, H.shade(x.body, -.1));
      return scene(x, back, body); }),

    ic("heavy", "240V appliance plug", sw(["#ffb347", "#ff5257", "#34d399", "#4da3ff", "#f2f6ff"], "#ffb347"), "LED", (o) => { const x = X(o);
      const back = blockB(x, 192);
      const amps = x.on ? Math.round(6 + 34 * x.lv) : 0;
      const body = `<path d="M150 98V112Q150 116 146 116H112" fill="none" stroke="#7d838b" stroke-width="5"/><path d="M150 98V112Q150 116 146 116H112" fill="none" stroke="#c7ccd2" stroke-width="1.4" transform="translate(-1 -1)"/>` +
        plateBody(x, 40, 84, 72, 72, 5, "#a7adb5") + screw(x, 46, 90, 2.2) + screw(x, 106, 150, 2.2) +
        `<circle cx="76" cy="121" r="27" fill="#000" fill-opacity=".35"/><circle cx="76" cy="120" r="26" fill="${M.s(x, "#3a3c42")}"/>` +
        `<circle cx="80" cy="125" r="21" fill="#000" fill-opacity=".35"/><circle cx="77" cy="121" r="20" fill="${M.s(x, "#2a2c32")}"/>` +
        Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<path d="M${f(77 + Math.cos(a) * 15.5)} ${f(121 + Math.sin(a) * 15.5)}L${f(77 + Math.cos(a) * 19.5)} ${f(121 + Math.sin(a) * 19.5)}" stroke="#000" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`; }).join("") +
        `<circle cx="77" cy="121" r="13" fill="${M.s(x, "#3e4047")}"/><path d="M67 113A13 13 0 0 1 82 109" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/>` +
        ringLed(x, 77, 121, 9, 9, 1.4) +
        cord(x, [77, 140, 78, 164, 92, 176, 118, 180, 146, 184, 170, 180, 206, 190], 8, "#24262c", x.led, 12) +
        box(x, 124, 26, 50, 72, 7, 2, 4, "#d6dade") +
        lcd(x, 132, 36, 34, 20, x.led) + digits(x, 160, 40, 12, amps, 2, x.led) +
        `<path d="M160.6 50L162.6 42L164.6 50M161.2 47.6H164" fill="none" stroke="${x.on ? H.mix(x.led, "#fff", .25) : "#fff"}" stroke-opacity="${x.on ? 1 : .08}" stroke-width=".9"/>` + glass(x, 132, 36, 34, 20) +
        led(x, 138, 70, 1.6) + button(x, 158, 70, 4, "#c8cdd3") + `<path d="M132 84H166M132 88H166" stroke="#000" stroke-opacity=".2"/>`;
      return scene(x, back, body); }),

    ic("dimmer", "Plug-in dimmer", sw(LEDS, "#ffb347"), "LED", (o) => { const x = X(o);
      const back = wallB(x, "lav");
      const lit = x.on ? Math.max(1, Math.round(x.lv * 9)) : 0, ang = -135 + 270 * x.lv; let arc = "";
      for (let i = 0; i < 9; i++) { const a = (-135 + i * 33.75 - 90) * Math.PI / 180, cx = 92 + Math.cos(a) * 19, cy = 82 + Math.sin(a) * 19;
        arc += led(i < lit ? x : Object.assign({}, x, { on: false }), cx, cy, 1.6, x.led, .5); }
      const knob = `<circle cx="93" cy="84.5" r="14.6" fill="#000" fill-opacity=".35"/><circle cx="92" cy="82" r="14" fill="${M.s(x, "#e9ebef")}"/>` +
        Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2; return `<path d="M${f(92 + Math.cos(a) * 12.4)} ${f(82 + Math.sin(a) * 12.4)}L${f(92 + Math.cos(a) * 14)} ${f(82 + Math.sin(a) * 14)}" stroke="#000" stroke-opacity=".18" stroke-width="1"/>`; }).join("") +
        `<circle cx="92" cy="82" r="10" fill="${x.rg([[0, "#ffffff"], [1, "#d6d9df"]], .4, .35, .7)}"/>` +
        `<g transform="rotate(${f(ang)} 92 82)"><rect x="91" y="72.5" width="2" height="6" rx="1" fill="#6b707a"/></g>`;
      const body = plateT(x, 92, 100, 1.05) + spot(x, 92, 82, 40, 40, x.led, .3) +
        box(x, 68, 52, 48, 74, 9, 4, 4, "#eef0f2") + arc + knob +
        holes(x, 92, 112, .8) + plugHead(x, 92, 114, .9, "#3a3d45") +
        cord(x, [92, 126, 92, 150, 110, 156, 130, 160, 152, 164, 166, 180, 178, 204], 3.4, "#3a3d45", x.led);
      return scene(x, back, body); }),

    ic("night", "Night-light plug", ["#ffc477", "#fff1d6", "#a5d8ff", "#c4b5fd", "#7ee8c4"], "Light", (o) => { const x = X(o); const c = x.led;
      const back = wallB(x, "cream", 8, 164) + baseB(x, 164, "#7a5538");
      const pool = x.on ? `<path d="M80 152L40 192H160L120 152Z" fill="${x.lg([[0, c, .5], [1, c, 0]])}" opacity="${a2(x.L)}"/><ellipse cx="100" cy="166" rx="56" ry="8" fill="${M.halo(x, c)}" opacity="${a2(.7 * x.L)}"/>` : "";
      const lens = x.on ? x.rg([[0, "#ffffff"], [.45, H.mix(c, "#fff", .5)], [1, c]], .5, .25, .9) : x.lg([[0, "#e9e8ee"], [1, "#b7b5c0"]]);
      const body = pool + plateT(x, 100, 92, 1.0) + spot(x, 100, 150, 46, 30, c, .55) +
        box(x, 80, 92, 40, 60, 9, 2, 4, "#eef0f2") +
        `<path d="M80 130H120V143Q120 152 111 152H89Q80 152 80 143Z" fill="${lens}"/>` +
        (x.on ? `<g class="${P}breath"><ellipse cx="100" cy="146" rx="26" ry="12" fill="${M.halo(x, c)}" opacity="${a2(.7 * x.L)}"/></g>` : "") +
        `<path d="M80 130H120" stroke="#000" stroke-opacity=".2"/><path d="M84 134Q100 132 116 134" fill="none" stroke="#fff" stroke-opacity=".6" stroke-linecap="round"/>` +
        holes(x, 100, 112, .78) + `<circle cx="112" cy="99" r="1.8" fill="#16171c"/><circle cx="111.5" cy="98.5" r=".6" fill="#fff" fill-opacity=".5"/>` +
        led(x, 88, 99, 1, "#4da3ff");
      return scene(x, back, body); }, { glow: { x: .5, y: .72, r: .7 }, cast: "down" }),

    ic("reel", "Cord reel", ["#e8792c", "#d93b3b", "#f2c230", "#3f9a5a", "#2c2f36"], "Cord", (o) => { const x = X(o, { body: o.color, led: "#34d399" }); const cc = x.body;
      const back = wallB(x, "garage", 8, 104) + concreteB(x, 104, "#76797f");
      let wind = ""; for (let r = 14; r <= 38; r += 3.2) wind += `<circle cx="88" cy="112" r="${f(r)}" fill="none" stroke="${H.shade(cc, r % 6.4 < 3.2 ? -.15 : .1)}" stroke-width="3.3"/>`;
      const body = plateT(x, 168, 60, .62) + plugHead(x, 168, 49.5, .8, cc) +
        cord(x, [168, 58, 168, 90, 150, 128, 132, 148, 118, 160, 106, 150, 104, 138], 3.6, cc, "#34d399") +
        `<ellipse cx="92" cy="166" rx="66" ry="9" fill="${M.shadow(x)}"/>` +
        `<path d="M44 168L70 70M132 168L106 70" stroke="${M.steel(x)}" stroke-width="5" stroke-linecap="round"/>` +
        `<circle cx="88" cy="112" r="45" fill="${M.s(x, "#3a3c42")}"/><circle cx="88" cy="112" r="40" fill="${H.shade(cc, -.35)}"/>` + wind +
        `<circle cx="88" cy="112" r="40" fill="${x.rg([[0, "#fff", 0], [.7, "#fff", 0], [.85, "#fff", .14], [1, "#000", .35]], .42, .38, .62)}"/>` +
        `<circle cx="88" cy="112" r="12" fill="${M.s(x, "#4b4e56")}"/><circle cx="88" cy="112" r="45" fill="none" stroke="#5e626a" stroke-width="2"/>` +
        `<path d="M40 168H138" stroke="${M.steel(x)}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M88 112L120 84" stroke="#a8aeb6" stroke-width="4" stroke-linecap="round"/><rect x="116" y="70" width="8" height="18" rx="4" fill="${M.h(x, "#2a2c32")}"/>` +
        box(x, 46, 140, 44, 26, 5, 2, 3, "#2c2f36") +
        `<g transform="rotate(-90 58 153)">${holes(x, 58, 153, .6)}</g><g transform="rotate(-90 76 153)">${holes(x, 76, 153, .6)}</g>` + led(x, 86, 145, 1.1, "#34d399");
      return scene(x, back, body); }),

    ic("floorbox", "Floor box outlet", ["#c9a35a", "#c6ccd4", "#2c2f36", "#7a5536", "#e9ebee"], "Lid", (o) => { const x = X(o, { body: o.color, led: "#4da3ff" }); const mc = x.body;
      const back = woodB(x, 8, "#9a6d48");
      const body = `<path d="M50 96L150 96L162 152L38 152Z" fill="#000" fill-opacity=".35" transform="translate(2 4)"/>` +
        `<path d="M50 96L150 96L162 152L38 152Z" fill="${M.metal(x, mc)}"/><path d="M56 101L144 101L154 147L46 147Z" fill="${x.lg([[0, "#0a0b0e"], [1, "#24262c"]])}"/>` +
        `<path d="M64 104L136 104L144 144L56 144Z" fill="${x.lg([[0, "#d9dbe0"], [1, "#a9acb5"]])}"/>` +
        `<g transform="translate(78 124) scale(1 .62)">${face(x, 0, 0, 1, "#eceef1")}</g><g transform="translate(122 124) scale(1 .62)">${face(x, 0, 0, 1, "#eceef1")}</g>` +
        led(x, 100, 124, 1.2, "#4da3ff") + `<path d="M50 96L150 96" stroke="#fff" stroke-opacity=".5"/>` +
        `<path d="M50 96L150 96L144 40L56 40Z" fill="${x.lg([[0, H.shade(mc, -.5)], [.6, H.shade(mc, -.15)], [1, H.shade(mc, .25)]])}"/><path d="M50 96L150 96L144 40L56 40Z" fill="${M.metal(x, mc)}" opacity=".45"/>` +
        `<path d="M60 46L140 46L144 90L56 90Z" fill="none" stroke="#000" stroke-opacity=".25"/><rect x="88" y="40" width="24" height="7" rx="2" fill="#000" fill-opacity=".45"/>` +
        `<path d="M50 96.5H150" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/>` +
        plugHead(x, 122, 125, .82, "#2d3037") +
        cord(x, [122, 135, 124, 150, 140, 156, 162, 166, 180, 176, 192, 172, 206, 176], 3.4, "#2d3037", "#4da3ff");
      return scene(x, back, body); }),

    ic("popup", "Counter pop-up", ["#c8cdd4", "#2c2f36", "#eef0f2", "#9a7a52", "#7d8794"], "Body", (o) => { const x = X(o, { body: o.color, led: "#4da3ff" }); const bc = x.body;
      const back = tileB(x, 8, 122, "#3f4652") + counterB(x, 122, "#e2e2e6");
      const cyl = x.lg([[0, H.shade(bc, -.5)], [.25, H.shade(bc, .5)], [.45, H.shade(bc, .15)], [.8, H.shade(bc, -.25)], [1, H.shade(bc, -.6)]], 0, 0, 1, 0);
      const body = `<ellipse cx="102" cy="160" rx="40" ry="10" fill="${M.shadow(x)}"/>` +
        `<ellipse cx="100" cy="156" rx="32" ry="9" fill="${M.metal(x, bc)}"/><ellipse cx="100" cy="155" rx="25" ry="6.5" fill="#0d0e12"/>` +
        `<path d="M77 56V154A23 6.5 0 0 0 123 154V56Z" fill="${cyl}"/>` +
        `<g transform="translate(100 88) scale(.86 1)">${face(x, 0, 0, .95, H.shade(bc, .05))}</g><g transform="translate(100 122) scale(.86 1)">${face(x, 0, 0, .95, H.shade(bc, .05))}</g>` +
        `<ellipse cx="100" cy="56" rx="23" ry="6.5" fill="${x.lg([[0, H.shade(bc, .5)], [1, H.shade(bc, -.15)]])}"/>` +
        ringLed(x, 100, 56, 20, 5.3, 1.3, "#4da3ff") + `<ellipse cx="100" cy="55" rx="14" ry="3.4" fill="${M.metal(x, bc)}" opacity=".8"/>` +
        `<path d="M82 64V148" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>` +
        plugHead(x, 100, 123.5, .86, "#2d3037") +
        cord(x, [100, 135, 100, 146, 120, 150, 140, 158, 160, 166, 176, 160, 204, 166], 3.2, "#2d3037", "#4da3ff");
      return scene(x, back, body); }),

    ic("undercab", "Under-cabinet strip", sw(LEDS, "#f2f6ff"), "LED", (o) => { const x = X(o);
      const back = tileB(x, 52, 150, "#dfe2dc") + counterB(x, 150, "#3d3f46") +
        `<rect x="8" y="8" width="184" height="46" fill="${x.lg([[0, "#8a6040"], [1, "#5a3c26"]])}"/><path d="M8 50H192" stroke="#000" stroke-opacity=".35" stroke-width="2"/><path d="M100 8V50" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/>
<rect x="14" y="14" width="80" height="32" rx="2" fill="none" stroke="#000" stroke-opacity=".25"/><rect x="106" y="14" width="80" height="32" rx="2" fill="none" stroke="#000" stroke-opacity=".25"/><rect x="84" y="36" width="10" height="3" rx="1.5" fill="${M.steel(x)}"/><rect x="106" y="36" width="10" height="3" rx="1.5" fill="${M.steel(x)}"/>`;
      const wash = x.on ? `<path d="M24 70L8 150H192L176 70Z" fill="${x.lg([[0, x.led, .55], [1, x.led, 0]])}" opacity="${a2(.85 * x.L)}"/>` : "";
      let outs = ""; [56, 84, 112, 140].forEach((cx) => { outs += `<g transform="rotate(-90 ${cx} 62)">${holes(x, cx, 62, .6)}</g>`; });
      const kettle = `<ellipse cx="146" cy="168" rx="24" ry="5" fill="${M.shadow(x)}"/><rect x="124" y="156" width="44" height="10" rx="4" fill="${M.h(x, "#2c2f36")}"/>` +
        (x.on ? `<g class="${P}pulse"><rect x="126" y="162" width="40" height="3" rx="1.5" fill="#4da3ff"/><rect x="120" y="158" width="52" height="11" rx="5" fill="${M.halo(x, "#4da3ff")}" opacity="${a2(.8 * x.L)}"/></g>` : "") +
        `<path d="M128 156L131 116Q146 108 161 116L164 156Z" fill="${M.h(x, "#c8cdd4")}"/><path d="M134 154L136 120" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M161 122Q176 124 172 140Q169 150 162 150" fill="none" stroke="#2c2f36" stroke-width="5" stroke-linecap="round"/><path d="M131 122L118 114" stroke="${M.steel(x)}" stroke-width="5" stroke-linecap="round"/>` +
        `<ellipse cx="146" cy="114" rx="11" ry="3" fill="#2c2f36"/><rect x="143" y="108" width="6" height="5" rx="2" fill="#2c2f36"/>`;
      const body = wash + `<rect x="28" y="50" width="144" height="22" rx="4" fill="#000" fill-opacity=".3" transform="translate(1 3)"/>` +
        `<rect x="28" y="50" width="144" height="22" rx="4" fill="${M.v(x, "#c9ccd3")}"/><path d="M30 51.5H170" stroke="#fff" stroke-opacity=".6"/>` + outs +
        (x.on ? `<rect x="32" y="69.4" width="136" height="2.2" rx="1.1" fill="${H.mix(x.led, "#fff", .5)}"/>` : `<rect x="32" y="69.4" width="136" height="2.2" rx="1.1" fill="#6b6e78"/>`) +
        led(x, 160, 60, 1.1) + kettle +
        plugHead(x, 112, 62, .66, "#2c2f36", -90) +
        cord(x, [119, 62, 126, 62, 128, 80, 122, 104, 116, 128, 120, 150, 128, 160], 2.6, "#2c2f36", x.led, 10);
      return scene(x, back, body); }),

    ic("string", "String-light plug", ["#ffc477", "#fff1d6", "#ff9a4a", "#a5d8ff", "#ff8fb1"], "Bulbs", (o) => { const x = X(o); const c = x.led;
      const back = fenceB(x);
      const pts = [12, 44, 60, 80, 140, 80, 196, 40];
      const wire = `<path d="M12 44C60 80 140 80 196 40" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2.2" transform="translate(1 3)"/><path d="M12 44C60 80 140 80 196 40" fill="none" stroke="#1b1c20" stroke-width="1.8"/>`;
      let bulbs = "";
      samples([12, 44, 60, 80, 140, 80, 196, 40], 7).forEach(([bx, by], i) => {
        const gl = x.on ? x.rg([[0, "#ffffff"], [.35, H.mix(c, "#fff", .55)], [1, c]], .45, .4, .7) : x.rg([[0, "#ffffff", .5], [.6, "#cfd2da", .18], [1, "#9aa0aa", .3]], .4, .35, .7);
        bulbs += `<path d="M${f(bx)} ${f(by)}V${f(by + 5)}" stroke="#1b1c20" stroke-width="1.4"/><rect x="${f(bx - 2.6)}" y="${f(by + 4)}" width="5.2" height="5" rx="1" fill="${M.h(x, "#2a2c32")}"/>` +
          (x.on ? `<g class="${P}twk" style="animation-delay:${(-i * .47).toFixed(2)}s"><circle cx="${f(bx)}" cy="${f(by + 16)}" r="16" fill="${M.halo(x, c)}" opacity="${a2(.75 * x.L)}"/></g>` : "") +
          `<path d="M${f(bx - 3)} ${f(by + 9)}C${f(bx - 7)} ${f(by + 14)} ${f(bx - 7)} ${f(by + 21)} ${f(bx)} ${f(by + 23)}C${f(bx + 7)} ${f(by + 21)} ${f(bx + 7)} ${f(by + 14)} ${f(bx + 3)} ${f(by + 9)}Z" fill="${gl}" stroke="#fff" stroke-opacity="${x.on ? .2 : .35}" stroke-width=".6"/>` +
          (x.on ? `<path d="M${f(bx)} ${f(by + 11)}V${f(by + 17)}" stroke="#fff" stroke-width="1" stroke-opacity=".9"/>` : `<path d="M${f(bx)} ${f(by + 11)}V${f(by + 17)}" stroke="#6b6e78" stroke-width=".8"/>`); });
      const body = (x.on ? `<path d="M12 60C60 96 140 96 196 56L196 192H12Z" fill="${x.lg([[0, c, .28], [1, c, 0]])}" opacity="${a2(x.L)}"/>` : "") +
        plateBody(x, 22, 124, 46, 58, 4, "#8d939b") + `<rect x="27" y="132" width="36" height="42" rx="4" fill="#3b3e45"/>` +
        box(x, 26, 128, 38, 46, 8, 2, 4, "#2c2f36") + ringLed(x, 45, 142, 5, 5, 1.2, "#34d399") + button(x, 45, 142, 3.6, "#3a3d45") +
        plugHead(x, 45, 160, .8, "#1f2025") +
        cord(x, [45, 170, 45, 186, 84, 178, 86, 140, 88, 110, 30, 90, 16, 50], 2.4, "#1f2025", c, 16) + wire + bulbs;
      return scene(x, back, body); }, { glow: { x: .52, y: .42, r: 1.1 }, cast: "down" }),

    ic("lamp", "Lamp plug", ["#ffc477", "#fff1d6", "#ffd8a8", "#a5d8ff", "#ffb3c7"], "Lamp", (o) => { const x = X(o); const c = x.led;
      const back = wallB(x, "sage", 8, 150) + baseB(x, 150, "#7a5538");
      const sh = `M140 50L196 50L208 94L128 94Z`;
      const body = (x.on ? `<path d="M130 94L100 140H208V94Z" fill="${x.lg([[0, c, .45], [1, c, 0]])}" opacity="${a2(x.L)}"/><path d="M142 50L124 8H208V50Z" fill="${x.lg([[0, c, 0], [1, c, .35]])}" opacity="${a2(x.L)}"/>` : "") +
        `<path d="M132 118H200V126H132Z" fill="${x.lg([[0, "#8a5f3c"], [1, "#5a3a22"]])}"/><path d="M132 118H200" stroke="#fff" stroke-opacity=".3"/>` + spot(x, 168, 118, 40, 6, c, .8) +
        `<rect x="138" y="126" width="6" height="58" fill="${M.h(x, "#6a4528")}"/><ellipse cx="141" cy="184" rx="9" ry="2.4" fill="${M.shadow(x)}"/>` +
        `<path d="M164 94V110" stroke="${M.steel(x)}" stroke-width="3"/><ellipse cx="166" cy="114" rx="14" ry="4" fill="${M.s(x, "#d8d4ca")}"/><path d="M156 112Q166 100 176 112Z" fill="${M.s(x, "#e6e2d8")}"/>` +
        `<path d="${sh}" fill="${x.on ? x.lg([[0, H.mix(c, "#fff", .55)], [1, c]]) : x.lg([[0, "#d8d4ca"], [1, "#a8a296"]])}"/><path d="${sh}" fill="${x.lg([[0, "#000", .25], [.3, "#000", 0]], 0, 0, 1, 0)}"/>` +
        `<path d="M140 50L196 50" stroke="#fff" stroke-opacity=".5"/><path d="M128 94H208" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>` +
        (x.on ? `<g class="${P}breath"><ellipse cx="168" cy="94" rx="40" ry="8" fill="${M.halo(x, c)}" opacity="${a2(.8 * x.L)}"/></g>` : "") +
        plateT(x, 54, 112, .72) + box(x, 40, 88, 28, 32, 7, 2, 3, "#eef0f2") + led(x, 54, 96, 1.1, "#4da3ff") + plugHead(x, 54, 110, .7, "#f0eee8") +
        cord(x, [54, 118, 54, 150, 70, 172, 100, 176, 124, 180, 134, 184, 141, 182], 2.4, "#f0eee8", c, 12) +
        cord(x, [160, 116, 150, 116, 146, 120, 144, 128], 2.2, "#f0eee8");
      return scene(x, back, body); }, { glow: { x: .84, y: .4, r: .8 }, cast: "both" }),

    ic("ev", "EV charger", sw(["#34d399", "#4da3ff", "#f2f6ff", "#ffb347", "#c4b5fd"], "#34d399"), "LED", (o) => { const x = X(o);
      const back = wallB(x, "garage", 8, 172) + `<path d="M64 8V172M136 8V172" stroke="#000" stroke-opacity=".12"/>` + concreteB(x, 172, "#6c6f75");
      const segs = 30, lit = x.on ? Math.max(1, Math.round(x.lv * segs)) : 0; let ring = "";
      for (let i = 0; i < segs; i++) { const a0 = (i / segs) * Math.PI * 2 - Math.PI / 2, a1 = a0 + Math.PI * 2 / segs * .7, r = 17;
        const d = `M${f(96 + Math.cos(a0) * r)} ${f(76 + Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${f(96 + Math.cos(a1) * r)} ${f(76 + Math.sin(a1) * r)}`;
        ring += `<path d="${d}" fill="none" stroke="${i < lit ? H.mix(x.led, "#fff", .3) : "#2a2d34"}" stroke-width="3" stroke-linecap="round"/>`; }
      const sweep = x.on ? `<g class="${P}spin" style="animation-duration:${(3.6 - 2 * x.lv).toFixed(2)}s"><circle cx="96" cy="76" r="20" fill="none"/><path d="M96 59A17 17 0 0 1 112 70" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round"/></g>` : "";
      const body = cord(x, [100, 132, 102, 160, 126, 170, 150, 168, 176, 166, 186, 180, 206, 186], 6.5, "#24262c", x.led, 12) +
        `<path d="M154 74V84" stroke="${M.steel(x)}" stroke-width="3"/><path d="M146 84H170Q172 84 172 86V90H146Z" fill="${M.h(x, "#3a3d45")}"/>` +
        `<path d="M150 90C142 128 172 138 170 92" fill="none" stroke="#1c1d22" stroke-width="6.5"/><path d="M156 90C150 124 176 132 166 90" fill="none" stroke="#2c2e35" stroke-width="6.5"/><path d="M152 92C147 120 166 128 168 96" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.4"/>` +
        box(x, 62, 30, 68, 104, 16, 3, 5, "#eef0f2") +
        `<rect x="70" y="40" width="52" height="72" rx="11" fill="${x.lg([[0, "#20232a"], [1, "#0f1115"]])}"/><path d="M73 44Q96 38 119 44" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.4" stroke-linecap="round"/>` +
        (x.on ? `<g class="${P}pulse"><circle cx="96" cy="76" r="24" fill="${M.halo(x, x.led)}" opacity="${a2(.7 * x.L)}"/></g>` : "") + ring + sweep +
        `<path d="M93 70L90 78H95L93 84L101 74H96L98 70Z" fill="${x.on ? "#fff" : "#4a4e58"}"/>` +
        led(x, 96, 104, 1.1) + `<rect x="88" y="124" width="16" height="10" rx="3" fill="${M.h(x, "#2c2f36")}"/>`;
      return scene(x, back, body); }),
  ];

  const css = `
.hda-plug-flow{opacity:0}
.hda-anim .hda-plug-flow{animation:hda-plug-flow 1.6s linear infinite}
@keyframes hda-plug-flow{0%{opacity:0}8%{opacity:.95}30%{opacity:0}100%{opacity:0}}
.hda-anim .hda-plug-pulse{animation:hda-plug-pulse 2.8s ease-in-out infinite}
@keyframes hda-plug-pulse{0%,100%{opacity:1}50%{opacity:.55}}
.hda-plug-breath{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-plug-breath{animation:hda-plug-breath 4s ease-in-out infinite}
@keyframes hda-plug-breath{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.07);opacity:.75}}
.hda-anim .hda-plug-twk{animation:hda-plug-twk 3.3s ease-in-out infinite}
@keyframes hda-plug-twk{0%,100%{opacity:1}35%{opacity:.55}50%{opacity:.95}70%{opacity:.7}}
.hda-plug-spin{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-plug-spin{opacity:1;animation:hda-plug-spin 2.4s linear infinite}
@keyframes hda-plug-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-plug-flow,.hda-anim .hda-plug-pulse,.hda-anim .hda-plug-breath,.hda-anim .hda-plug-twk,.hda-anim .hda-plug-spin{animation:none!important}.hda-anim .hda-plug-spin{opacity:0}}
`;

  (window.HDA = window.HDA || []).push({
    id: "plug", tab: "Plugs & power strips", group: "More", kind: "device",
    intro: "Twenty smart plugs, US outlets and power strips on real walls, floors and counters. On means powered: the LED lights in your color, the plugged-in thing comes alive (lamp, string lights, night light, phone, kettle), power runs along the cord, and the watt or amp displays climb with the slider.",
    
    css, icons,
  });
})();
