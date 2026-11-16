(function () {
  const H = window.HDAH, P = "hda-thermostat-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rad = (d) => d * Math.PI / 180;
  const pt = (cx, cy, r, deg) => [cx + Math.sin(rad(deg)) * r, cy - Math.cos(rad(deg)) * r];
  const arc = (cx, cy, r, a0, a1) => { const p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1);
    return `M${f(p0[0])} ${f(p0[1])} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f(p1[0])} ${f(p1[1])}`; };

  const FIN = { white: "#f2f1ee", black: "#2a2b31", steel: "#b9bec6", brass: "#c9a457", copper: "#c27b50", ivory: "#ece2cc", graphite: "#5b6069", sage: "#a9b8a4" };
  const METAL = [FIN.steel, FIN.brass, FIN.copper];
  const sw = (s) => s.split(" ").map((k) => FIN[k]);

  function tsMF(o) {
    const v = o.pval || {}, has = (k) => v[k] != null && v[k] !== "";
    if (!["mode", "state", "fan", "temp", "sp"].some(has)) return null;
    const m = has("mode") ? String(v.mode).toLowerCase() : null, s = has("state") ? String(v.state).toLowerCase() : null, fn = has("fan") ? String(v.fan).toLowerCase() : null;
    const sp = has("sp") && isFinite(+v.sp) ? +v.sp : null, tp = has("temp") && isFinite(+v.temp) ? +v.temp : null, main = sp != null ? sp : tp;
    const r = { mode: m, on: s ? /^(heating|cooling|fan)$/.test(s) : m ? m !== "off" : !!o.on, heat: null, fanOnly: s === "fan" };
    if (main != null) { r.t = Math.round(main); r.lv = Math.max(0, Math.min(1, main < 45 ? (main - 15.5) / 13.3 : (main - 60) / 24)); r.heat = main < 45 ? main >= 21 : main >= 70; }
    if (sp != null && tp != null && Math.round(sp) !== Math.round(tp)) r.t2 = Math.round(tp);
    if (m === "off") { r.on = false; r.str = "OFF"; r.t2 = tp != null ? Math.round(tp) : null; }
    if (m === "heat") r.heat = true; else if (m === "cool") r.heat = false; else if (sp != null && tp != null && (m === "auto" || m === "eco")) r.heat = tp < sp;
    if (s === "heating") r.heat = true; else if (s === "cooling") r.heat = false;
    if (s === "fan") { r.gc = "#3fcf9a"; r.heat = false; }
    r.fan = s === "fan" || fn === "on" || fn === "circulate" ? true : null;
    return r;
  }
  const MC = { heat: "#ff8a2a", cool: "#36a6ff", auto: "#3ecf6e", dry: "#1fc8b4", fan: "#9aa3ad", eco: "#7fcf3a" };
  const ML = { heatcool: "Heat/Cool", off: "Off", heat: "Heat", cool: "Cool", auto: "Auto", dry: "Dry", fan: "Fan", eco: "Eco" };
  const PL = { none: "None", boost: "Boost", comfort: "Comfort", sleep: "Sleep", away: "Away", frost: "Frost" };
  function hvOpts(modes, presets, lab) {
    const a = [{ id: "mode", name: "Mode", values: modes.split(" ").map((k) => [k, (lab && lab[k]) || ML[k]]) }];
    if (presets) a.push({ id: "preset", name: "Preset", values: ("none " + presets).split(" ").map((k) => [k, PL[k]]),
      when: { opt: "mode", is: modes.split(" ").filter((k) => k !== "off") } });
    return a;
  }
  const LEAF = "M-.8 .8 C-.85 -.2 -.15 -.85 .85 -.85 C.9 .15 .25 .85 -.8 .8 Z";
  function leaf(cx, cy, s, col) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})"><path d="${LEAF}" fill="${col}"/><path d="M-.8 .8 L.35 -.35" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".14" stroke-linecap="round"/></g>`;
  }
  function power(cx, cy, s, col) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})" fill="none" stroke="${col}" stroke-width=".2" stroke-linecap="round"><path d="M-.5 -.55 A.75 .75 0 1 0 .5 -.55"/><path d="M0 -.95 V-.1"/></g>`;
  }
  function pglyph(p, cx, cy, s, col) {
    const g = (b, fill) => `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})" fill="${fill ? col : "none"}" stroke="${fill ? "none" : col}" stroke-width=".2" stroke-linecap="round" stroke-linejoin="round">${b}</g>`;
    if (p === "boost") return g(`<path d="M.2 -1 L-.6 .12 H-.02 L-.22 1 L.6 -.15 H.02 Z"/>`, 1);
    if (p === "comfort") return g(`<path d="M-.5 .1 V-.55 H.5 V.1 M-.85 .55 V-.05 H-.5 V.15 H.5 V-.05 H.85 V.55 Z M-.7 .55 V.8 M.7 .55 V.8"/>`);
    if (p === "sleep") return g(`<path d="M.3 -.9 A.92 .92 0 1 0 .9 .35 A.7 .7 0 0 1 .3 -.9 Z"/>`, 1);
    if (p === "away") return g(`<path d="M-.85 -.02 L0 -.82 L.85 -.02 M-.6 -.25 V.82 H.6 V-.25 M-.18 .82 V.32 H.18 V.82"/>`);
    if (p === "frost") return g(`<path d="M0 -.95 V.95 M-.82 -.47 L.82 .47 M-.82 .47 L.82 -.47 M-.25 -.75 L0 -.52 L.25 -.75 M-.25 .75 L0 .52 L.25 .75"/>`);
    return "";
  }
  function fanG(cx, cy, s, col) {
    let b = ""; for (let i = 0; i < 3; i++) b += `<path transform="rotate(${i * 120})" d="M0 0 C-.5 -.3 -.38 -.95 0 -.95 C.32 -.95 .3 -.38 0 0 Z"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})" fill="${col}">${b}<circle r=".16"/></g>`;
  }
  const rc = (x, a, b) => (x.mode === "heatcool" || x.mode === "heat" || x.mode === "cool" ? (x.heat ? a : b) : x.hot);

  function ctx(o) {
    const R = tsMF(o), op = o.opt || {}, md = op.mode || "heatcool", pr = op.preset || "none";
    const c = (o.color || FIN.white).toLowerCase(), on = R ? R.on : !!o.on && md !== "off", lv = R && R.lv != null ? R.lv : o.level == null ? .5 : Math.max(0, Math.min(1, o.level));
    const t = R && R.t != null ? R.t : Math.round(60 + 24 * lv), heat = R && R.heat != null ? R.heat : md === "heat" ? true : md === "cool" ? false : t >= 70;
    const gc = R ? (R.gc || (R.mode === "eco" ? MC.eco : heat ? "#ff8a2a" : "#36a6ff")) : MC[md] || (heat ? "#ff8a2a" : "#36a6ff");
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const x = { c, on, lv, t, heat, gc, id, url, defs: [], have: {}, metal: METAL.indexOf(c) >= 0, mode: md, preset: pr,
      bi: md === "fan" ? 2 : md === "auto" || md === "eco" || md === "dry" ? -1 : heat ? 0 : 1,
      hot: H.mix(gc, "#ffffff", .5), dk: H.hx(c).reduce((a, b) => a + b, 0) < 260 };
    x.dig = on ? H.mix(gc, "#ffffff", .42) : "#9aa0ab";
    x.ink = on ? H.shade(gc, -.78) : "#3c4238";
    x.add = (k, s) => { if (!x.have[k]) { x.have[k] = 1; x.defs.push(s); } };
    if (R) { x.str = R.str || null; x.t2 = R.t2 != null ? R.t2 : null; x.fan = R.fan; x.mode = R.mode || md; if (R.mode) x.preset = "none"; x.fanOnly = R.fanOnly; }
    return x;
  }

  function fin(x) {
    const c = x.c, S = (a) => H.shade(c, a);
    x.add("fin", lg(x.id("bd"), [[0, S(.42)], [.45, c], [1, S(-.38)]], 0, 0, .7, 1) +
      lg(x.id("bdv"), [[0, S(.35)], [.18, S(.1)], [.7, c], [1, S(-.32)]], 0, 0, 0, 1) +
      rg(x.id("bdr"), [[0, S(.5)], [.55, c], [.9, S(-.3)], [1, S(-.5)]], .38, .32, .75) +
      (x.metal ? lg(x.id("ring"), [[0, S(-.5)], [.16, S(.55)], [.32, S(-.2)], [.5, S(.7)], [.66, S(-.28)], [.84, S(.35)], [1, S(-.45)]], 0, 0, 1, 1)
        : lg(x.id("ring"), [[0, S(.45)], [.4, S(.08)], [.75, S(-.18)], [1, S(-.42)]], 0, 0, .6, 1)) +
      lg(x.id("edge"), [[0, S(.6)], [.5, S(-.1)], [1, S(-.5)]], 0, 0, 0, 1));
  }
  const brushR = (x, X, Y, W, Hh) => { if (!x.metal) return ""; const R = rnd(Math.round(W * 13 + Hh)); let s = "";
    for (let y = Y + 2; y < Y + Hh - 2; y += 1.3) s += `<path d="M${f(X + 2)} ${f(y)} H${f(X + W - 2)}" stroke="${R() > .5 ? "#fff" : "#000"}" stroke-opacity="${(.03 + R() * .07).toFixed(2)}" stroke-width=".5"/>`;
    return s; };
  const brushC = (x, cx, cy, r0, r1) => { if (!x.metal) return ""; const R = rnd(Math.round(r1 * 31)); let s = "";
    for (let r = r0; r < r1; r += .9) s += `<circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="none" stroke="${R() > .5 ? "#fff" : "#000"}" stroke-opacity="${(.04 + R() * .08).toFixed(2)}" stroke-width=".45"/>`;
    return s; };

  const WALL = {
    plaster: ["#57525f", "#3c3845"], greige: ["#5c564e", "#403b35"], sage: ["#48544c", "#313a34"], clay: ["#62493f", "#45332c"],
    green: ["#304b41", "#20342d"], navy: ["#303a53", "#1f2739"], slate: ["#434c59", "#2d343e"], blush: ["#5c4954", "#41333c"],
    dark: ["#2f2e39", "#1d1c25"], stucco: ["#605a50", "#46413a"], concrete: ["#5a5d61", "#3f4246"], tile: ["#5d6470", "#454b55"],
    mint: ["#3f5a55", "#2b403c"], denim: ["#344459", "#232f3f"], wood: ["#5e4a38", "#3f3125"], brick: ["#64402f", "#452a20"],
    linen: ["#6a6359", "#4d473f"], plum: ["#4d3a50", "#342737"], stripe: ["#4a4436", "#332e24"], sand: ["#655b4c", "#494134"],
    ply: ["#7a6648", "#5a4a33"],
  };
  function texture(kind) {
    const r = rnd(kind.length * 977 + kind.charCodeAt(0) * 13 + kind.charCodeAt(1)); let s = "";
    if (kind === "brick") {
      for (let row = 0, y = 8; y < 192; y += 12, row++) {
        for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) { const v = r();
          s += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="24.4" height="10.4" rx="1.2" fill="${v > .5 ? "#000" : "#e09a7c"}" fill-opacity="${(.04 + v * .09).toFixed(2)}"/>`; }
        s += `<path d="M8 ${y} H192" stroke="#c9b8a8" stroke-opacity=".18" stroke-width="1.6"/>`;
      }
    } else if (kind === "tile") {
      for (let row = 0, y = 8; y < 192; y += 30, row++) for (let bx = 8; bx < 192; bx += 30) { const v = r();
        s += `<rect x="${bx + 1}" y="${y + 1}" width="28" height="28" rx="1.5" fill="#fff" fill-opacity="${(.03 + v * .05).toFixed(2)}"/><path d="M${bx + 3} ${y + 3} H${bx + 16}" stroke="#fff" stroke-opacity=".14" stroke-width="1" stroke-linecap="round"/><path d="M${bx + 1} ${y + 29.4} H${bx + 29}" stroke="#000" stroke-opacity=".25"/>`; }
    } else if (kind === "wood") {
      for (let bx = 8; bx < 192; bx += 22) { const v = r();
        s += `<rect x="${bx}" y="8" width="22" height="184" fill="${v > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + v * .05).toFixed(2)}"/><path d="M${bx + .8} 8 V192" stroke="#000" stroke-opacity=".45" stroke-width="1.6"/>`;
        for (let k = 0; k < 4; k++) { const gx = bx + 4 + r() * 14; s += `<path d="M${f(gx)} 8 C${f(gx + 3)} 60 ${f(gx - 3)} 130 ${f(gx + 1)} 192" fill="none" stroke="#000" stroke-opacity=".1" stroke-width=".7"/>`; } }
    } else if (kind === "ply") {
      for (let k = 0; k < 26; k++) { const y = 8 + r() * 184; s += `<path d="M8 ${f(y)} C60 ${f(y + r() * 8 - 4)} 120 ${f(y + r() * 10 - 5)} 192 ${f(y + r() * 6 - 3)}" fill="none" stroke="#3a2a14" stroke-opacity="${(.12 + r() * .14).toFixed(2)}" stroke-width="${f(.5 + r())}"/>`; }
      [[20, 20], [180, 20], [20, 180], [180, 180]].forEach(([a, b]) => { s += `<circle cx="${a}" cy="${b}" r="1.6" fill="#222" fill-opacity=".6"/>`; });
    } else if (kind === "stripe") {
      for (let bx = 8; bx < 192; bx += 18) s += `<rect x="${bx}" y="8" width="8" height="184" fill="#e8d9a8" fill-opacity=".06"/><path d="M${bx + 13} 8 V192" stroke="#e8d9a8" stroke-opacity=".09" stroke-width=".8" stroke-dasharray="2 3"/>`;
    } else if (kind === "concrete") {
      s += `<path d="M8 120 H192" stroke="#000" stroke-opacity=".25"/><path d="M8 121 H192" stroke="#fff" stroke-opacity=".06" stroke-width=".8"/>`;
      for (let i = 0; i < 90; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * .9)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.06 + r() * .12).toFixed(2)}"/>`;
    } else {
      const n = kind === "stucco" ? 130 : 46, big = kind === "stucco" ? 1.1 : .6;
      for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .08).toFixed(2)}"/>`;
    }
    return s;
  }

  function scene(x, kind, body, sc) {
    sc = sc || 1; const w = WALL[kind] || WALL.plaster, g = x.gc;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>
${lg(x.id("wallg"), [[0, w[0]], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${x.id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(x.id("vig"), [[0, "#000", 0], [.6, "#000", .06], [1, "#000", .5]], .5, .46, .76)}
${rg(x.id("halo"), [[0, g, .75], [.4, g, .25], [1, g, 0]])}
${rg(x.id("glass"), [[0, "#2a2d36"], [.6, "#121319"], [1, "#050508"]], .35, .25, .9)}
${rg(x.id("faceOn"), [[0, H.shade(g, .12)], [.62, H.shade(g, -.32)], [1, H.shade(g, -.66)]], .5, .42, .6)}
${lg(x.id("gloss"), [[0, "#fff", .22], [.45, "#fff", .04], [.46, "#fff", 0], [1, "#fff", 0]], 0, 0, .6, 1)}
${lg(x.id("lcd"), x.on ? [[0, H.mix(g, "#fff8ec", .62)], [1, H.mix(g, "#ffffff", .3)]] : [[0, "#9ea692"], [1, "#7d8572"]], 0, 0, 0, 1)}
${lg(x.id("arcg"), [[0, x.hot], [1, g]])}
<filter id="${x.id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="${x.id("bs")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>
${x.defs.join("")}</defs>
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(kind)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g>
<g clip-path="${x.url("wc")}">
<g transform="translate(100 100) scale(${sc}) translate(-100 -100)">${body}</g></g>
<rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></svg>`;
  }

  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const rr = (X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const wallGlow = (x, cx, cy, r) => x.on ? `<circle class="${P}breathe" cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("halo")}" opacity=".5"/>` : "";
  const ringGlow = (x, cx, cy, r, w) => x.on ? `<circle class="${P}breathe" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.hot}" stroke-width="${w || 1.6}" opacity=".85"/>` : "";

  function slab(x, X, Y, W, Hh, r, o2) {
    o2 = o2 || {}; fin(x);
    return drop(x, rr(X, Y, W, Hh, r), 3, 6, .6) + `<rect x="${f(X - .6)}" y="${f(Y - .6)}" width="${f(W + 1.2)}" height="${f(Hh + 1.2)}" rx="${r + .5}" fill="#000" opacity=".35"/>` +
      `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("edge")}"/>` +
      `<rect x="${f(X + 1.2)}" y="${f(Y + 1)}" width="${f(W - 2.4)}" height="${f(Hh - 2.6)}" rx="${Math.max(r - 1, 1)}" fill="${x.url(o2.v ? "bdv" : "bd")}"/>` +
      brushR(x, X + 1, Y + 1, W - 2, Hh - 3) + hl(`M${f(X + r)} ${f(Y + 1.4)} H${f(X + W - r)}`, x.dk ? .25 : .8, .8);
  }
  function screen(x, X, Y, W, Hh, r) {
    return `<rect x="${f(X - .8)}" y="${f(Y - .8)}" width="${f(W + 1.6)}" height="${f(Hh + 1.6)}" rx="${r + .6}" fill="#000" opacity=".6"/><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("glass")}"/>`;
  }
  const glossR = (x, X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("gloss")}"/>`;
  function lcd(x, X, Y, W, Hh, r) {
    return `<rect x="${f(X - 1)}" y="${f(Y - 1)}" width="${f(W + 2)}" height="${f(Hh + 2)}" rx="${r + 1}" fill="#000" opacity=".55"/><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("lcd")}"/>` +
      `<path d="M${f(X + 1)} ${f(Y + 1.2)} H${f(X + W - 1)}" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>` + (x.on ? `<rect class="${P}breathe" x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="#fff" opacity=".12"/>` : "");
  }

  const SEG = { O: "abcdef", F: "aefg", 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function poly(x0, y0, x1, y1, t) {
    const h = t / 2;
    if (y0 === y1) return `${f(x0)},${f(y0)} ${f(x0 + h)},${f(y0 - h)} ${f(x1 - h)},${f(y0 - h)} ${f(x1)},${f(y0)} ${f(x1 - h)},${f(y0 + h)} ${f(x0 + h)},${f(y0 + h)}`;
    return `${f(x0)},${f(y0)} ${f(x0 + h)},${f(y0 + h)} ${f(x0 + h)},${f(y1 - h)} ${f(x0)},${f(y1)} ${f(x0 - h)},${f(y1 - h)} ${f(x0 - h)},${f(y0 + h)}`;
  }
  function digit(ch, ox, oy, w, h, t, col, ghost) {
    const g = t * .3, m = oy + h / 2, on = SEG[ch] || "";
    const S = { a: [ox + g, oy, ox + w - g, oy], g: [ox + g, m, ox + w - g, m], d: [ox + g, oy + h, ox + w - g, oy + h],
      f: [ox, oy + g, ox, m - g], b: [ox + w, oy + g, ox + w, m - g], e: [ox, m + g, ox, oy + h - g], c: [ox + w, m + g, ox + w, oy + h - g] };
    let s = "";
    Object.keys(S).forEach((k) => { const lit = on.indexOf(k) >= 0; if (lit || ghost) s += `<polygon points="${poly(...S[k], t)}" fill="${col}"${lit ? "" : ` opacity="${ghost}"`}/>`; });
    return s;
  }
  function digits(x, cx, cy, h, col, o2) {
    o2 = o2 || {};
    if (o2.str || (!x.str && x.t2 == null)) return digits0(x, cx, cy, h, col, o2);
    const a = digits0(x, cx, cy, h, col, x.str ? Object.assign({}, o2, { str: x.str, unit: "" }) : o2);
    return x.t2 == null ? a : `<g class="${P}sa">${a}</g><g class="${P}sb">${digits0(x, cx, cy, h, col, Object.assign({}, o2, { str: String(x.t2) }))}</g>`;
  }
  function digits0(x, cx, cy, h, col, o2) {
    o2 = o2 || {}; const off = !o2.str && x.mode === "off" && o2.unit !== "pct", str = o2.str || (off ? "OFF" : String(x.t)), w = h * .5, t = Math.max(.8, h * .13), sp = h * .24, n = str.length;
    const unit = off ? "" : o2.unit == null ? "deg" : o2.unit, uw = unit === "pct" ? h * .36 : unit ? h * .22 : 0;
    const tot = n * w + (n - 1) * sp + (uw ? sp * .8 + uw : 0); let ox = cx - tot / 2; const oy = cy - h / 2;
    let s = "";
    for (let i = 0; i < n; i++) { s += digit(str[i], ox, oy, w, h, t, col, o2.ghost); ox += w + sp; }
    ox += sp * .8 - sp;
    if (unit === "deg") s += `<circle cx="${f(ox + uw / 2)}" cy="${f(oy + uw / 2)}" r="${f(uw * .32)}" fill="none" stroke="${col}" stroke-width="${f(t * .6)}"/>`;
    if (unit === "pct") s += `<circle cx="${f(ox + uw * .22)}" cy="${f(oy + h * .2)}" r="${f(h * .08)}" fill="none" stroke="${col}" stroke-width="${f(t * .5)}"/><circle cx="${f(ox + uw * .78)}" cy="${f(oy + h * .8)}" r="${f(h * .08)}" fill="none" stroke="${col}" stroke-width="${f(t * .5)}"/><path d="M${f(ox + uw * .9)} ${f(oy + h * .08)} L${f(ox + uw * .1)} ${f(oy + h * .92)}" stroke="${col}" stroke-width="${f(t * .5)}" stroke-linecap="round"/>`;
    const k = (cy * .105).toFixed(2), g = `<g transform="translate(${k} 0) skewX(-6)">${s}</g>`;
    return (o2.glow && x.on ? `<g opacity=".75" filter="${x.url("bs")}">${g}</g>` : "") + g;
  }

  const FLAME = "M0 -1 C.55 -.5 .78 -.05 .6 .38 C.47 .76 .16 .98 0 .98 C-.16 .98 -.5 .78 -.6 .38 C-.7 -.04 -.38 -.32 -.22 -.62 C-.14 -.3 .02 -.26 .07 -.44 C.12 -.64 .06 -.84 0 -1 Z";
  function flame(cx, cy, s, col, inner) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})"><path d="${FLAME}" fill="${col}"/><path d="${FLAME}" transform="translate(0 .32) scale(.52)" fill="${inner}"/></g>`;
  }
  function flake(cx, cy, s, col) {
    let d = ""; for (let i = 0; i < 3; i++) { const a = i * 60;
      d += `<g transform="rotate(${a})"><path d="M0 -1 V1 M-.28 -.78 L0 -.55 L.28 -.78 M-.28 .78 L0 .55 L.28 .78"/></g>`; }
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})" fill="none" stroke="${col}" stroke-width=".17" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;
  }
  const DROP = "M0 -1 C.35 -.45 .7 -.05 .7 .35 C.7 .75 .38 1 0 1 C-.38 1 -.7 .75 -.7 .35 C-.7 -.05 -.35 -.45 0 -1 Z";
  function mglyph(x, cx, cy, s, idle, idle2) {
    const m = x.mode;
    if (m === "off") return power(cx, cy, s, idle || "#8e939c");
    if (m === "auto") return flame(cx - s * .8, cy, s * .66, idle || MC.heat, idle ? idle2 || "#5b6068" : "#ffe7a6") + flake(cx + s * .8, cy, s * .66, idle || H.mix(MC.cool, "#fff", .25));
    if (m === "dry") return `<path d="${DROP}" transform="translate(${f(cx)} ${f(cy)}) scale(${f(s * .9)})" fill="${idle || x.gc}"/>`;
    if (m === "fan") return fanG(cx, cy, s, idle || H.shade(x.gc, -.12));
    if (m === "eco") return leaf(cx, cy, s * .9, idle || x.gc);
    if (idle) return x.heat ? flame(cx, cy, s, idle, idle2 || "#5b6068") : flake(cx, cy, s, idle);
    return x.heat ? flame(cx, cy, s, x.gc, "#ffe7a6") : flake(cx, cy, s, H.mix(x.gc, "#fff", .25));
  }
  function mode(x, cx, cy, s, o2) {
    o2 = o2 || {};
    if (x.fanOnly) return `<g${x.on ? "" : ` opacity="${o2.idleOp || .35}"`}>${fanIcon(x, cx, cy, s * 1.05, x.on ? x.hot : o2.idle || "#8e939c")}</g>`;
    if (!x.on) return `<g opacity="${o2.idleOp || .35}">${mglyph(x, cx, cy, s, o2.idle || "#8e939c", o2.idle2)}</g>`;
    const pg = x.preset !== "none", mx = pg ? cx - s * 1.3 : cx;
    return `<g class="${P}pulse">${o2.halo === false ? "" : `<circle cx="${f(mx)}" cy="${f(cy)}" r="${f(s * 2.2)}" fill="${x.url("halo")}" opacity=".7"/>`}${mglyph(x, mx, cy, s)}</g>` +
      (pg ? pglyph(x.preset, cx + s * 1.4, cy, s * .85, H.shade(x.gc, -.1)) : "");
  }
  function fanDots(x, cx, cy, gap, r, col) {
    if (!(x.fan == null ? x.on : x.fan)) return [-1, 0, 1].map((i) => `<circle cx="${f(cx + i * gap)}" cy="${cy}" r="${r}" fill="#888c94" opacity=".25"/>`).join("");
    return [-1, 0, 1].map((i) => `<circle class="${P}dot" style="animation-delay:${((i + 1) * .3).toFixed(1)}s" cx="${f(cx + i * gap)}" cy="${cy}" r="${r}" fill="${col || x.hot}"/>`).join("");
  }
  function fanIcon(x, cx, cy, r, col) {
    let b = ""; for (let i = 0; i < 3; i++) b += `<path transform="rotate(${i * 120} ${cx} ${cy})" d="M${cx} ${cy} C${f(cx - r * .55)} ${f(cy - r * .35)} ${f(cx - r * .4)} ${f(cy - r)} ${cx} ${f(cy - r)} C${f(cx + r * .35)} ${f(cy - r)} ${f(cx + r * .3)} ${f(cy - r * .4)} ${cx} ${cy} Z" fill="${col}"/>`;
    return `<g${(x.fan == null ? x.on : x.fan) ? ` class="${P}spin" style="animation-duration:${(2.2 - x.lv * 1.4).toFixed(2)}s"` : ""}>${b}<circle cx="${cx}" cy="${cy}" r="${f(r * .18)}" fill="${col}"/></g>`;
  }
  function rise(x, pts, col, len, w) {
    if (!x.on) return "";
    return pts.map(([px, py], i) => `<path class="${P}rise" style="animation-delay:${(i * .45 % 1.8).toFixed(2)}s" d="M${px} ${py} c-2.5 -${f(len * .25)} 2.5 -${f(len * .5)} 0 -${f(len * .75)} c-1.5 -${f(len * .12)} 0 -${f(len * .2)} 0 -${f(len * .25)}" fill="none" stroke="${col || x.hot}" stroke-width="${w || 1.4}" stroke-linecap="round" opacity="0"/>`).join("");
  }
  const screw = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#9ca2ab"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/><path d="M${f(cx - r * .7)} ${cy} H${f(cx + r * .7)}" stroke="#454a52" stroke-width=".7"/>`;
  const btn = (x, cx, cy, w, h, r) => `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2 + .8)}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity=".3"/><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${r}" fill="${x.url("ring")}"/>${hl(`M${f(cx - w / 2 + r * .6)} ${f(cy - h / 2 + .6)} H${f(cx + w / 2 - r * .6)}`, x.dk ? .3 : .85, .6)}`;
  const ledDot = (x, cx, cy, r) => x.on ? `<g class="${P}pulse"><circle cx="${cx}" cy="${cy}" r="${f(r * 3)}" fill="${x.url("halo")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.hot}"/></g>` : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2b2e33"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .35)}" fill="#fff" opacity=".25"/>`;

  const tri = (cx, cy, s, up, col) => `<path d="M${f(cx - s)} ${f(cy + (up ? s * .5 : -s * .5))} L${cx} ${f(cy + (up ? -s * .6 : s * .6))} L${f(cx + s)} ${f(cy + (up ? s * .5 : -s * .5))} Z" fill="${col}"/>`;

  const base = (o) => Object.assign({ picker: true, colorLabel: "Body" }, o);

  const icons = [
     base({ id: "learning", name: "Round learning", colorLabel: "Ring", colors: sw("steel copper brass black white"), render(o) {
      const x = ctx(o), cx = 100, cy = 98; fin(x);
      let ticks = ""; const sa = -150 + 300 * (x.t - 50) / 40, ca = sa + (x.heat ? -26 : 26);
      for (let i = 0; i <= 100; i++) { const a = -150 + 3 * i, lit = x.on && a >= Math.min(sa, ca) && a <= Math.max(sa, ca);
        const p0 = pt(cx, cy, 35.5, a), p1 = pt(cx, cy, 40, a);
        ticks += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="#fff" stroke-opacity="${lit ? .95 : x.on ? .3 : .18}" stroke-width=".8"/>`; }
      const s0 = pt(cx, cy, 31.5, sa), s1 = pt(cx, cy, 41, sa);
      ticks += `<path d="M${f(s0[0])} ${f(s0[1])} L${f(s1[0])} ${f(s1[1])}" stroke="#fff" stroke-opacity="${x.on ? 1 : .5}" stroke-width="2.2" stroke-linecap="round"/>`;
      const b = wallGlow(x, cx, cy, 82) + drop(x, `<circle cx="${cx}" cy="${cy}" r="52"/>`, 4, 8, .65) +
        `<circle cx="${cx}" cy="${cy}" r="52.8" fill="#000" opacity=".4"/><circle cx="${cx}" cy="${cy}" r="52" fill="${x.url("ring")}"/>` + brushC(x, cx, cy, 45.5, 52) +
        `<path d="${arc(cx, cy, 51.3, -80, 10)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/><path d="${arc(cx, cy, 51.3, 120, 220)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>` +
        `<circle cx="${cx}" cy="${cy}" r="45.6" fill="#050506"/><circle cx="${cx}" cy="${cy}" r="44.6" fill="${x.url(x.on ? "faceOn" : "glass")}"/>` + ticks +
        digits(x, cx, cy - 3, 25, x.on ? "#ffffff" : "#8f95a0", { glow: 1 }) + mode(x, cx, cy + 23, 4, { halo: false, idle: "#7d838d" }) + ringGlow(x, cx, cy, 44, 1.4) +
        `<ellipse cx="${cx - 12}" cy="${cy - 24}" rx="30" ry="13" transform="rotate(-24 ${cx - 12} ${cy - 24})" fill="#fff" opacity=".07"/>`;
      return scene(x, "greige", b);
    } }),

     base({ id: "square", name: "Square touch", colors: sw("white black steel graphite brass"), render(o) {
      const x = ctx(o);
      const b = wallGlow(x, 100, 98, 70) + slab(x, 62, 60, 76, 76, 16) + screen(x, 67.5, 65.5, 65, 65, 11.5) +
        digits(x, 100, 95, 25, x.dig, { glow: 1 }) + mode(x, 100, 75, 3.6) + fanDots(x, 100, 121, 5, 1.4) +
        tri(124.5, 89, 2.4, 1, "#fff").replace("/>", ` opacity=".35"/>`) + tri(124.5, 101, 2.4, 0, "#fff").replace("/>", ` opacity=".35"/>`) +
        (x.on ? `<rect class="${P}breathe" x="84" y="111" width="32" height="1.6" rx=".8" fill="${x.hot}"/>` : "") + glossR(x, 67.5, 65.5, 65, 65, 11.5);
      return scene(x, "sage", b, 1.3);
    } }),

     base({ id: "dial", name: "Classic dial", colors: sw("ivory white black brass steel"), render(o) {
      const x = ctx(o), cx = 100, cy = 100, rot = (x.lv - .5) * 220; fin(x);
      let tk = ""; for (let i = -24; i <= 24; i++) { const a = i * 5, big = i % 5 === 0, p0 = pt(cx, cy, big ? 39.5 : 41.5, a), p1 = pt(cx, cy, 45, a);
        tk += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="${x.dk ? "#fff" : "#000"}" stroke-opacity="${big ? .55 : .3}" stroke-width="${big ? 1.2 : .7}"/>`; }
      let grip = ""; for (let i = 0; i < 48; i++) { const a = i * 7.5, p0 = pt(cx, cy, 47.5, a), p1 = pt(cx, cy, 50, a); grip += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="#000" stroke-opacity=".18" stroke-width="1.1"/>`; }
      x.add("dome", rg(x.id("dome"), [[0, "#fff", .5], [.5, "#fff", .08], [1, "#fff", .2]], .35, .3, .7));
      const b = wallGlow(x, cx, cy, 80) + drop(x, `<circle cx="${cx}" cy="${cy}" r="51"/>`, 4, 8, .6) +
        `<circle cx="${cx}" cy="${cy}" r="51.6" fill="#000" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="51" fill="${x.url("ring")}"/><circle cx="${cx}" cy="${cy}" r="46.5" fill="${x.url("bdr")}"/>` + brushC(x, cx, cy, 36, 46) +
        `<g transform="rotate(${f(rot)} ${cx} ${cy})">${grip}${tk}</g>` + `<path d="${arc(cx, cy, 50.3, -70, 20)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1"/>` +
        `<circle cx="${cx}" cy="${cy}" r="35" fill="#000" opacity=".25"/><circle cx="${cx}" cy="${cy}" r="34" fill="${H.shade(x.c, x.dk ? .12 : -.06)}"/>` +
        `<path d="M${cx} 59.5 l-3.4 -5.2 h6.8 Z" fill="${x.on ? x.gc : "#c23b2e"}"/>` +
        lcd(x, 80, 90, 40, 21, 3) + digits(x, cx, 100.5, 14, x.ink, { ghost: .07 }) + ledDot(x, cx, 121, 1.8) + ringGlow(x, cx, cy, 34, 1.8) +
        `<circle cx="${cx}" cy="${cy}" r="34" fill="${x.url("dome")}"/><path d="${arc(cx, cy, 31, -75, -15)}" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>`;
      return scene(x, "linen", b);
    } }),

     base({ id: "programmable", name: "Programmable LCD", colors: sw("white ivory black graphite steel"), render(o) {
      const x = ctx(o); let days = "";
      for (let i = 0; i < 7; i++) days += `<rect x="${f(57 + i * 5.2)}" y="76.5" width="3.6" height="1.8" fill="${x.ink}" opacity="${i === 2 ? .9 : .3}"/>`;
      let prog = ""; for (let i = 0; i < 4; i++) prog += `<rect x="${f(57 + i * 9)}" y="104.5" width="7" height="2.2" rx=".6" fill="${x.ink}" opacity="${i === 1 ? .85 : .3}"/>`;
      let pills = ""; for (let i = 0; i < 5; i++) pills += btn(x, 59 + i * 14.5, 125, 11, 4.6, 2.3);
      const b = wallGlow(x, 100, 98, 76) + slab(x, 42, 62, 116, 74, 10) +
        `<rect x="49" y="70" width="72" height="44" rx="4" fill="#000" opacity=".22"/>` + lcd(x, 52, 72, 66, 38, 2.5) + days + prog +
        digits(x, 74, 93, 21, x.ink, { ghost: .07 }) + mode(x, 106, 86, 4.6, { halo: false, idle: x.ink, idle2: "#9ea692", idleOp: .2 }) +
        (x.on ? `<g class="${P}pulse"><rect x="100" y="98" width="13" height="5" rx="1" fill="${x.ink}" opacity=".75"/></g>` : "") +
        btn(x, 138, 79, 16, 10, 3) + tri(138, 79, 2.6, 1, x.dk ? "#ddd" : "#555") + btn(x, 138, 94, 16, 10, 3) + tri(138, 94, 2.6, 0, x.dk ? "#ddd" : "#555") +
        btn(x, 138, 109, 16, 7, 3) + pills + `<path d="M46 117.5 H154" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>` + glossR(x, 52, 72, 66, 38, 2.5);
      return scene(x, "plaster", b);
    } }),

     base({ id: "touchscreen", name: "Wall touchscreen", colors: sw("black white steel graphite brass"), render(o) {
      const x = ctx(o), gx = 76, gy = 103, a1 = -135 + 270 * x.lv;
      x.add("ui", lg(x.id("ui"), x.on ? [[0, "#1c2433"], [1, "#0e121b"]] : [[0, "#101217"], [1, "#07080b"]], 0, 0, 0, 1));
      let tiles = ""; const ic = ["sun", "drop", "fan", "home"];
      [[110, 76], [133, 76], [110, 101], [133, 101]].forEach(([tx, ty], i) => {
        const act = x.on && i === 0, col = act ? "#fff" : "#9aa3b5";
        tiles += `<rect x="${tx}" y="${ty}" width="20" height="21" rx="3.2" fill="${act ? x.gc : "#fff"}" opacity="${act ? .9 : x.on ? .08 : .04}"/>`;
        const c0 = tx + 10, c1 = ty + 9.5;
        if (ic[i] === "sun") tiles += `<circle cx="${c0}" cy="${c1}" r="3" fill="none" stroke="${col}" stroke-width="1.1"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const p = pt(c0, c1, 4.6, a), q = pt(c0, c1, 6, a); return `<path d="M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])}" stroke="${col}" stroke-width=".9"/>`; }).join("");
        if (ic[i] === "drop") tiles += `<g transform="translate(${c0} ${c1}) scale(4.4)"><path d="${DROP}" fill="none" stroke="${col}" stroke-width=".25"/></g>`;
        if (ic[i] === "fan") tiles += fanIcon(x, c0, c1, 4.6, col);
        if (ic[i] === "home") tiles += `<path d="M${c0 - 5} ${c1 + 4} V${c1 - .5} L${c0} ${c1 - 5} L${c0 + 5} ${c1 - .5} V${c1 + 4} Z" fill="none" stroke="${col}" stroke-width="1.1" stroke-linejoin="round"/>`;
        tiles += `<rect x="${tx + 4}" y="${ty + 17}" width="12" height="1.2" rx=".6" fill="${col}" opacity=".5"/>`;
      });
      const b = wallGlow(x, 100, 100, 92) + slab(x, 34, 56, 132, 88, 7) + `<rect x="39" y="61" width="122" height="78" rx="3.5" fill="#000"/>` +
        `<rect x="40" y="62" width="120" height="76" rx="3" fill="${x.url("ui")}"/>` +
        `<path d="${arc(gx, gy, 23, -135, 135)}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="4" stroke-linecap="round"/>` +
        `<path d="${arc(gx, gy, 23, -135, Math.max(-130, a1))}" fill="none" stroke="${x.on ? x.url("arcg") : "#5d636e"}" stroke-width="4" stroke-linecap="round"/>` +
        (x.on ? `<circle class="${P}breathe" cx="${f(pt(gx, gy, 23, a1)[0])}" cy="${f(pt(gx, gy, 23, a1)[1])}" r="6" fill="${x.url("halo")}"/>` : "") +
        `<circle cx="${f(pt(gx, gy, 23, a1)[0])}" cy="${f(pt(gx, gy, 23, a1)[1])}" r="2.8" fill="#fff" opacity="${x.on ? 1 : .5}"/>` +
        digits(x, gx, gy - 2, 15, x.on ? "#fff" : "#8a909b") + mode(x, gx, gy + 13, 2.8, { halo: false }) + tiles +
        `<rect x="46" y="66" width="20" height="1.4" rx=".7" fill="#fff" opacity=".3"/><circle cx="150" cy="66.7" r="1" fill="${x.on ? "#69db7c" : "#555"}"/>` +
        `<circle cx="100" cy="58.6" r=".9" fill="#000" opacity=".6"/>` + glossR(x, 40, 62, 120, 76, 3);
      return scene(x, "slate", b);
    } }),

     base({ id: "pill", name: "Slim pill", colors: sw("white black brass copper steel"), render(o) {
      const x = ctx(o);
      const b = wallGlow(x, 100, 100, 70) + slab(x, 76, 40, 48, 120, 24, { v: 1 }) + screen(x, 80.5, 44.5, 39, 111, 19.5) +
        mode(x, 100, 70, 3.6) + digits(x, 100, 97, 21, x.dig, { glow: 1 }) + fanDots(x, 100, 116, 4.6, 1.3) +
        (x.on ? `<rect class="${P}breathe" x="92" y="130" width="16" height="2.4" rx="1.2" fill="${x.hot}"/><rect x="88" y="128" width="24" height="6.4" rx="3.2" fill="${x.url("halo")}" opacity=".6"/>` : `<rect x="92" y="130" width="16" height="2.4" rx="1.2" fill="#3a3d44"/>`) +
        `<path d="M84 60 Q83 100 84 140" stroke="#fff" stroke-opacity=".12" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + glossR(x, 80.5, 44.5, 39, 111, 19.5);
      return scene(x, "clay", b, 1.15);
    } }),

     base({ id: "withsensor", name: "With room sensor", colors: sw("white black steel graphite copper"), render(o) {
      const x = ctx(o), px = 151, py = 86; fin(x);
      let waves = ""; [12, 19, 26].forEach((r, i) => { waves += `<path ${x.on ? `class="${P}wave" style="animation-delay:${(i * .4).toFixed(1)}s"` : `opacity=".12"`} d="${arc(px, py, r, 235, 305)}" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-width="1.6" stroke-linecap="round"/>`; });
      const b = wallGlow(x, 64, 98, 60) + slab(x, 34, 62, 60, 72, 11) + screen(x, 39, 67, 50, 62, 7.5) +
        mode(x, 64, 79, 3) + digits(x, 64, 98, 18, x.dig, { glow: 1 }) + fanDots(x, 64, 117, 4.2, 1.2) + glossR(x, 39, 67, 50, 62, 7.5) +
        waves + drop(x, `<circle cx="${px}" cy="${py}" r="17"/>`, 3, 5, .6) + `<circle cx="${px}" cy="${py}" r="17.6" fill="#000" opacity=".3"/><circle cx="${px}" cy="${py}" r="17" fill="${x.url("bdr")}"/>` +
        brushC(x, px, py, 2, 16) + `<circle cx="${px}" cy="${py}" r="11" fill="none" stroke="#000" stroke-opacity=".1"/>` +
        `<path d="${arc(px, py, 15.5, -70, 0)}" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.1" stroke-linecap="round"/>` + ledDot(x, px, py + 9, 1.1) +
        `<path d="M146 120 l5 -5 l5 5" fill="none" stroke="#fff" stroke-opacity=".0"/>`;
      return scene(x, "navy", b, 1.1);
    } }),

     base({ id: "baseboard", name: "Baseboard heat", colors: sw("white ivory black steel brass"), render(o) {
      const x = ctx(o), ang = -135 + 270 * x.lv;
      x.add("bb", lg(x.id("bb"), [[0, "#f6f3ec"], [.3, "#e5e1d8"], [1, "#a9a499"]], 0, 0, 0, 1) + lg(x.id("knob"), [[0, H.shade(x.c, .5)], [.5, x.c], [1, H.shade(x.c, -.4)]], 0, 0, .8, 1));
      let slots = ""; for (let i = 0; i < 17; i++) slots += `<rect x="${16 + i * 10}" y="155" width="7" height="5" rx="1" fill="#000" opacity=".45"/>`;
      let tk = ""; for (let i = 0; i <= 8; i++) { const a = -135 + i * 33.75, p0 = pt(100, 104, 18.5, a), p1 = pt(100, 104, 21, a); tk += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="${x.dk ? "#fff" : "#000"}" stroke-opacity=".4" stroke-width=".9"/>`; }
      let kn = ""; for (let i = 0; i < 24; i++) { const a = i * 15, p0 = pt(100, 104, 13, a), p1 = pt(100, 104, 15, a); kn += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="#000" stroke-opacity=".2" stroke-width="1"/>`; }
      const b = `<g class="hda-bg">` + drop(x, rr(8, 150, 184, 30, 2), 0, 4, .55) + `<rect x="4" y="150" width="192" height="30" rx="2" fill="${x.url("bb")}"/>` + slots +
        `<path d="M4 150.8 H196" stroke="#fff" stroke-opacity=".8"/><path d="M4 166 H196" stroke="#000" stroke-opacity=".1"/>` +
        rise(x, [[30, 147], [62, 147], [94, 147], [126, 147], [158, 147]], rc(x, "#ffb070", "#9dd4ff"), 26, 1.2) + `</g>` +
        wallGlow(x, 100, 90, 58) + slab(x, 74, 44, 52, 90, 6) + screw(100, 49.5, 1.6) + screw(100, 128.5, 1.6) +
        lcd(x, 84, 55, 32, 17, 2) + digits(x, 100, 63.5, 11, x.ink, { ghost: .07 }) + tk +
        drop(x, `<circle cx="100" cy="104" r="15"/>`, 2, 4, .6) + `<circle cx="100" cy="104" r="15" fill="${x.url("knob")}"/>` + kn + `<circle cx="100" cy="103" r="12" fill="${x.url("bdr")}"/>` +
        `<g transform="rotate(${f(ang)} 100 104)"><path d="M100 93.5 V99" stroke="${x.on ? x.gc : x.dk ? "#ddd" : "#444"}" stroke-width="2.2" stroke-linecap="round"/></g>` +
        ledDot(x, 100, 122.5, 1.3) + mode(x, 113, 122.5, 2.2, { halo: false });
      return scene(x, "stucco", b);
    } }),

     base({ id: "splitwall", name: "Mini-split controller", colors: sw("white ivory black graphite steel"), render(o) {
      const x = ctx(o); let bars = "";
      for (let i = 0; i < 4; i++) bars += `<rect x="${f(58 + i * 3.4)}" y="${f(110 - i * 1.6)}" width="2.4" height="${f(2 + i * 1.6)}" fill="${x.ink}" opacity="${i < 1 + Math.round(x.lv * 3) ? .85 : .2}"/>`;
      const pw = `<path d="${arc(134, 86, 4, 40, 320)}" fill="none" stroke="${x.on ? x.gc : x.dk ? "#ccc" : "#666"}" stroke-width="1.4" stroke-linecap="round"/><path d="M134 80.5 V85.5" stroke="${x.on ? x.gc : x.dk ? "#ccc" : "#666"}" stroke-width="1.4" stroke-linecap="round"/>`;
      const b = wallGlow(x, 100, 99, 74) + slab(x, 44, 64, 112, 70, 9) + `<rect x="51" y="71" width="66" height="48" rx="4" fill="#000" opacity=".2"/>` +
        lcd(x, 54, 74, 60, 42, 3) + digits(x, 76, 94, 20, x.ink, { ghost: .07 }) + fanIcon(x, 103, 84, 5.4, x.ink) + mode(x, 103, 102, 3.4, { halo: false, idle: x.ink, idleOp: .25 }) + bars +
        `<circle cx="134" cy="86" r="10.4" fill="#000" opacity=".25"/>` + btn(x, 134, 86, 19, 19, 9.5) + pw + (x.on ? `<circle class="${P}breathe" cx="134" cy="86" r="10.5" fill="none" stroke="${x.hot}" stroke-width="1.2"/>` : "") +
        btn(x, 126, 113, 11, 8, 2.5) + btn(x, 142, 113, 11, 8, 2.5) + `<path d="M123.5 113 H128.5" stroke="#666" stroke-width="1.1"/><path d="M139.5 113 H144.5 M142 110.5 V115.5" stroke="#666" stroke-width="1.1"/>` + glossR(x, 54, 74, 60, 42, 3);
      return scene(x, "mint", b);
    } }),

     base({ id: "remote", name: "Split remote", colors: sw("white black graphite steel ivory"), render(o) {
      const x = ctx(o); let keys = "";
      [[90, 102], [100, 102], [110, 102], [90, 111], [100, 111], [110, 111]].forEach(([kx, ky]) => { keys += btn(x, kx, ky, 7, 5, 2.5); });
      x.add("hold", lg(x.id("hold"), [[0, "#e9e6e0"], [.5, "#d2cec6"], [1, "#9c978d"]], 0, 0, 0, 1));
      const b = wallGlow(x, 100, 80, 52) + drop(x, rr(73, 114, 54, 50, 8), 3, 6, .6) + `<rect x="73" y="114" width="54" height="50" rx="8" fill="${x.url("hold")}"/><rect x="78" y="118" width="44" height="40" rx="5" fill="#000" opacity=".25"/>` +
        slab(x, 80, 34, 40, 118, 14, { v: 1 }) + `<rect x="94" y="36.5" width="12" height="3.4" rx="1.7" fill="#121216"/>` +
        (x.on ? `<rect class="${P}blink" x="95" y="37" width="10" height="2.4" rx="1.2" fill="#ff5b5b"/>` : "") +
        lcd(x, 85, 45, 30, 30, 4) + digits(x, 100, 56, 12.5, x.ink, { ghost: .07 }) + mode(x, 93, 68.5, 2.4, { halo: false, idle: x.ink, idleOp: .25 }) +
        fanIcon(x, 107, 68.5, 3, x.ink) + `<circle cx="100" cy="88" r="6.6" fill="#000" opacity=".3"/><circle cx="100" cy="87.4" r="6" fill="#d9493b"/><circle cx="99" cy="85.8" r="2.4" fill="#fff" opacity=".35"/>` + keys +
        `<path d="M73 122 H127 V156 Q127 164 119 164 H81 Q73 164 73 156 Z" fill="${x.url("hold")}"/>` + hl("M77 122.6 H123", .9, .9) + `<path d="M73 122 H127" stroke="#000" stroke-opacity=".25" stroke-width="2" transform="translate(0 -1.6)"/>` +
        glossR(x, 85, 45, 30, 30, 4);
      return scene(x, "blush", b);
    } }),

     base({ id: "ptac", name: "Hotel PTAC panel", colors: sw("ivory white graphite steel black"), render(o) {
      const x = ctx(o); let slats = "", louv = "";
      for (let i = 0; i < 16; i++) slats += `<path d="M${33 + i * 8.6} 68 l3 10" stroke="#000" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/><path d="M${34.6 + i * 8.6} 68 l3 10" stroke="#fff" stroke-opacity="${x.dk ? .1 : .4}" stroke-width=".7"/>`;
      for (let y = 124; y < 162; y += 4.4) louv += `<path d="M30 ${y} H170" stroke="#000" stroke-opacity=".42" stroke-width="2"/><path d="M30 ${f(y + 1.4)} H170" stroke="#fff" stroke-opacity="${x.dk ? .08 : .35}" stroke-width=".6"/>`;
      let modeB = ""; for (let i = 0; i < 3; i++) modeB += btn(x, 92 + i * 13, 103, 10, 6, 3) + `<circle cx="${92 + i * 13}" cy="96" r="1.1" fill="${x.on && i === x.bi ? x.hot : "#555"}"/>`;
      const b = rise(x, [[44, 64], [70, 64], [96, 64], [122, 64], [148, 64]], rc(x, "#ffb070", "#a6dbff"), 30, 1.5) +
        `<g class="hda-bg"><rect x="8" y="172" width="184" height="20" fill="#2a2420"/><path d="M8 172 H192" stroke="#000" stroke-opacity=".4" stroke-width="2"/></g>` +
        slab(x, 20, 60, 160, 114, 6, { v: 1 }) + `<rect x="28" y="66" width="144" height="14" rx="2" fill="#000" opacity=".55"/>` + slats +
        `<rect x="28" y="88" width="144" height="26" rx="3" fill="#000" opacity=".12"/>` + lcd(x, 36, 92, 36, 18, 2) + digits(x, 54, 101, 11.5, x.ink, { ghost: .07 }) + modeB +
        btn(x, 144, 101, 10, 10, 2.5) + tri(144, 101, 2.2, 1, "#666") + btn(x, 158, 101, 10, 10, 2.5) + tri(158, 101, 2.2, 0, "#666") + mode(x, 128, 103, 2.6) +
        `<rect x="28" y="120" width="144" height="44" rx="2" fill="#000" opacity=".3"/>` + louv;
      return scene(x, "sand", b);
    } }),

     base({ id: "radiant", name: "Radiant floor", colors: sw("white black steel graphite ivory"), render(o) {
      const x = ctx(o); let floor = "", waves = "";
      x.add("fl", lg(x.id("fl"), [[0, "#8f8a80"], [1, "#5d5952"]], 0, 0, 0, 1));
      for (let i = -6; i <= 6; i++) floor += `<path d="M${100 + i * 9} 160 L${100 + i * 26} 192" stroke="#000" stroke-opacity=".25"/>`;
      floor += `<path d="M8 172 H192 M8 184 H192" stroke="#000" stroke-opacity=".2"/>`;
      for (let i = 0; i < 3; i++) waves += `<path d="M${88 + i * 8} 105 c-2 -2.5 2 -4.5 0 -7 c-2 -2.5 2 -4.5 0 -7" fill="none" stroke="${x.on ? x.hot : "#777c86"}" stroke-width="1.6" stroke-linecap="round" opacity="${x.on ? 1 : .5}"/>`;
      const b = `<g class="hda-bg"><rect x="8" y="160" width="184" height="32" fill="${x.url("fl")}"/>` + floor + `<rect x="8" y="158" width="184" height="3" fill="#e8e3da" opacity=".7"/>` +
        (x.on ? `<rect x="8" y="160" width="184" height="32" fill="${x.gc}" opacity=".12" class="${P}breathe"/>` : "") +
        rise(x, [[30, 168], [58, 176], [142, 176], [170, 168], [44, 186], [156, 186]], x.hot, 22, 1.2) + `</g>` +
        wallGlow(x, 100, 90, 64) + slab(x, 66, 46, 68, 84, 9) + screen(x, 72, 52, 56, 58, 5) +
        digits(x, 100, 72, 19, x.dig, { glow: 1 }) + (x.on ? `<g class="${P}pulse">${waves}</g>` : waves) + `<path d="M84 107 H116" stroke="${x.on ? x.hot : "#777c86"}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` +
        (x.on && x.preset !== "none" ? pglyph(x.preset, 119, 98, 3.4, x.hot) : "") +
        glossR(x, 72, 52, 56, 58, 5) + [86, 100, 114].map((cx) => `<circle cx="${cx}" cy="119" r="2.4" fill="#000" opacity=".15"/><circle cx="${cx}" cy="118.6" r="1.5" fill="${x.dk ? "#777" : "#bbb"}"/>`).join("");
      return scene(x, "tile", b);
    } }),

     base({ id: "humidistat", name: "Humidistat", colors: sw("white sage black steel brass"), render(o) {
      const x = ctx(o), dc = x.on ? x.gc : "#7c818a";
      const b = wallGlow(x, 100, 92, 64) + slab(x, 68, 50, 64, 96, 13) + `<circle cx="100" cy="86" r="24.4" fill="#000" opacity=".3"/>` +
        `<circle cx="100" cy="86" r="23" fill="${x.url("glass")}"/>` + digits(x, 100, 86, 15, x.dig, { unit: "pct", glow: 1 }) + ringGlow(x, 100, 86, 21, 1.3) +
        `<ellipse cx="94" cy="74" rx="13" ry="6" transform="rotate(-25 94 74)" fill="#fff" opacity=".08"/>` +
        `<g ${x.on ? `class="${P}pulse"` : `opacity=".5"`}>${x.on ? `<circle cx="100" cy="125" r="9" fill="${x.url("halo")}"/>` : ""}<g transform="translate(100 125) scale(5.4)"><path d="${DROP}" fill="${dc}"/><path d="M-.3 .2 Q-.3 .6 0 .7" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".14" stroke-linecap="round"/></g></g>` +
        btn(x, 81, 126, 9, 9, 4.5) + `<path d="M78.5 126 H83.5" stroke="#666" stroke-width="1.1"/>` + btn(x, 119, 126, 9, 9, 4.5) + `<path d="M116.5 126 H121.5 M119 123.5 V128.5" stroke="#666" stroke-width="1.1"/>`;
      return scene(x, "denim", b, 1.2);
    } }),

     base({ id: "vent", name: "Smart vent", colors: sw("white black brass steel copper"), render(o) {
      const x = ctx(o), open = o.mf ? !!(o.parts || {}).vent : x.on; let sl = "", air = "";
      for (let i = 0; i < 6; i++) { const y = 107 + i * 6;
        sl += open ? `<rect x="49" y="${y}" width="102" height="2.4" fill="${x.url("ring")}"/><rect x="49" y="${y + 2.4}" width="102" height="1" fill="#000" opacity=".4"/>`
          : `<rect x="49" y="${y - 1}" width="102" height="6" fill="${x.url("bdv")}"/><path d="M49 ${y + 4.8} H151" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>`; }
      if (open) for (let i = 0; i < 5; i++) air += `<path class="${P}blow" style="animation-delay:${(i * .35).toFixed(2)}s" d="M${62 + i * 19} 142 q-4 10 2 20" fill="none" stroke="${x.hot}" stroke-width="1.6" stroke-linecap="round" opacity="0"/>`;
      x.add("bd2", lg(x.id("bdf"), [[0, "#6b4a2e"], [1, "#4a321f"]], 0, 0, 0, 1));
      const b = `<g class="hda-bg"><rect x="8" y="170" width="184" height="22" fill="${x.url("bdf")}"/>` + [40, 92, 150].map((a) => `<path d="M${a} 170 V192" stroke="#000" stroke-opacity=".35"/>`).join("") +
        `<rect x="8" y="160" width="184" height="11" fill="#e9e5dc"/><path d="M8 160.6 H192" stroke="#fff" stroke-opacity=".8"/><path d="M8 170.4 H192" stroke="#000" stroke-opacity=".3"/></g>` +
        wallGlow(x, 100, 118, 70) + slab(x, 40, 96, 120, 54, 4) + `<rect x="47" y="103" width="106" height="40" rx="1.5" fill="#0b0b0d"/>` +
        (open ? `<rect x="47" y="103" width="106" height="40" fill="${x.gc}" opacity=".12"/>` : "") + sl + air +
        screw(45, 123, 1.4) + screw(155, 123, 1.4) +
        drop(x, rr(84, 78, 32, 15, 4), 2, 3, .5) + `<rect x="84" y="78" width="32" height="15" rx="4" fill="${x.url("bd")}"/>` + screen(x, 87, 80.5, 19, 10, 2) +
        digits(x, 96.5, 85.5, 6.6, x.dig) + ledDot(x, 111, 85.5, 1.1);
      return scene(x, "plum", b);
    } }),

     base({ id: "puck", name: "Room sensor", colors: sw("white black steel copper brass"), render(o) {
      const x = ctx(o), cx = 100, cy = 104; fin(x);
      x.add("shelf", lg(x.id("shelf"), [[0, "#a0764e"], [.4, "#7d5737"], [1, "#4f3520"]], 0, 0, 0, 1));
      const b = `<g class="hda-bg">` + drop(x, rr(18, 138, 164, 10, 1), 0, 6, .6) + `<rect x="18" y="138" width="164" height="10" fill="${x.url("shelf")}"/><path d="M18 138.5 H182" stroke="#e8c39b" stroke-opacity=".5"/>` +
        `<path d="M40 148 v12 l6 -12 Z M154 148 v12 l6 -12 Z" fill="#2c2c30"/></g>` + wallGlow(x, cx, cy, 58) +
        `<ellipse cx="${cx}" cy="138" rx="22" ry="3.4" fill="#000" opacity=".45" filter="${x.url("bs")}"/>` +
        `<path d="M86 136 Q100 128 114 136 Z" fill="${H.shade(x.c, -.3)}"/>` +
        drop(x, `<circle cx="${cx}" cy="${cy}" r="28"/>`, 3, 5, .55) + `<circle cx="${cx}" cy="${cy}" r="28.6" fill="#000" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="28" fill="${x.url("ring")}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="24.4" fill="${x.url("bdr")}"/>` + brushC(x, cx, cy, 2, 24) +
        (x.on ? `<circle class="${P}breathe" cx="${cx}" cy="${cy}" r="26.2" fill="none" stroke="${x.hot}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="26.2" fill="none" stroke="${x.gc}" stroke-width="5" opacity=".35" filter="${x.url("bs")}"/>` : "") +
        `<circle cx="${cx}" cy="${cy}" r="12.4" fill="#000" opacity=".4"/><circle cx="${cx}" cy="${cy}" r="11.6" fill="${x.url("glass")}"/>` + digits(x, cx, cy, 8.4, x.dig, { glow: 1 }) +
        `<path d="${arc(cx, cy, 26.5, -70, 5)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.1" stroke-linecap="round"/><circle cx="${cx}" cy="${cy - 18}" r="1.6" fill="#1b1c20" opacity=".7"/>`;
      return scene(x, "dark", b, 1.22);
    } }),

     base({ id: "zone", name: "Zone panel", colors: sw("steel graphite white black brass"), render(o) {
      const x = ctx(o), lit = x.on ? 1 + Math.round(x.lv * 3) : 0;
      x.add("pcb", lg(x.id("pcb"), [[0, "#2f7653"], [1, "#1d4f37"]], 0, 0, .3, 1));
      const wires = ["#d63a2f", "#f2f2ee", "#3a7bd5", "#3aa357", "#f0c419", "#222"]; let w = "", tb = "", tb2 = "", rl = "", leds = "";
      wires.forEach((c, i) => { const wx = 52 + i * 19; w += `<path d="M${wx} 8 C${wx} 30 ${wx + (i % 2 ? 4 : -4)} 40 ${wx} 64" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="3.8"/><path d="M${wx} 8 C${wx} 30 ${wx + (i % 2 ? 4 : -4)} 40 ${wx} 64" fill="none" stroke="${c}" stroke-width="2.6"/>`;
        tb += `<rect x="${wx - 7}" y="61" width="14" height="10" rx="1" fill="#2f9e5b"/><rect x="${wx - 7}" y="61" width="14" height="2.4" fill="#5fd18e" opacity=".6"/>` + screw(wx, 67, 2.2);
        tb2 += `<rect x="${wx - 7}" y="128" width="14" height="9" rx="1" fill="#2f9e5b"/>` + screw(wx, 133, 2); });
      for (let i = 0; i < 4; i++) { const lx = 56 + i * 17;
        rl += `<rect x="${lx - 6}" y="104" width="12" height="16" rx="1.2" fill="#18181c"/><rect x="${lx - 6}" y="104" width="12" height="3" fill="#fff" opacity=".1"/>`;
        leds += (o.mf ? !!(o.parts || {})["z" + (i + 1)] : x.on && i < lit) ? `<g class="${P}pulse" style="animation-delay:${(i * .3).toFixed(1)}s"><circle cx="${lx}" cy="92" r="5" fill="${x.url("halo")}"/><circle cx="${lx}" cy="92" r="2" fill="${x.hot}"/></g>` : `<circle cx="${lx}" cy="92" r="2" fill="#3a2a2a"/>`;
        leds += `<rect x="${lx - 4}" y="97" width="8" height="1.4" fill="#fff" opacity=".5"/>`; }
      const b = slab(x, 32, 50, 136, 96, 5) + `<rect x="39" y="56" width="122" height="84" rx="2" fill="#000" opacity=".4"/><rect x="40" y="57" width="120" height="82" rx="2" fill="${x.url("pcb")}"/>` +
        `<path d="M48 80 H150 M48 84 H120 M140 84 V126" stroke="#9fd8b5" stroke-opacity=".18" stroke-width=".8" fill="none"/>` + w + tb + tb2 + rl + leds +
        lcd(x, 122, 86, 32, 16, 1.5) + digits(x, 138, 94, 9.5, x.ink, { ghost: .07 }) + mode(x, 138, 113, 3.4) +
        screw(37, 55, 1.6) + screw(163, 55, 1.6) + screw(37, 141, 1.6) + screw(163, 141, 1.6);
      return scene(x, "ply", b);
    } }),

     base({ id: "mercury", name: "Mercury round", colors: sw("brass ivory white black copper"), render(o) {
      const x = ctx(o), cx = 100, cy = 100, la = 180 + (x.lv - .5) * 70; fin(x);
      let sc = ""; for (let i = -10; i <= 10; i++) { const a = i * 6, big = i % 5 === 0, p0 = pt(cx, cy, big ? 30 : 32, a), p1 = pt(cx, cy, 35, a);
        sc += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="#3a2f20" stroke-opacity="${big ? .8 : .5}" stroke-width="${big ? 1.1 : .6}"/>`; }
      const na = (x.t - 72) * 2.5, np = pt(cx, cy, 34, na);
      let coil = "M100 100"; for (let i = 1; i < 30; i++) { const a = i * 40, r = 1 + i * .42, p = pt(cx, cy + 4, r, a); coil += ` L${f(p[0])} ${f(p[1])}`; }
      const lp = pt(cx, cy, 47, la), lq = pt(cx, cy, 58, la), merc = x.on ? 108 : 92;
      x.add("cov", rg(x.id("cov"), [[0, "#fff", .38], [.55, "#fff", .06], [1, "#fff", .18]], .35, .3, .7) + lg(x.id("cap"), [[0, "#fff", .7], [.5, "#d8e2ea", .25], [1, "#fff", .5]], 0, 0, 0, 1));
      const b = wallGlow(x, cx, cy, 78) + `<path d="M${f(lp[0])} ${f(lp[1])} L${f(lq[0])} ${f(lq[1])}" stroke="#000" stroke-opacity=".4" stroke-width="7" stroke-linecap="round" transform="translate(2 4)"/>` +
        `<path d="M${f(lp[0])} ${f(lp[1])} L${f(lq[0])} ${f(lq[1])}" stroke="${x.url("ring")}" stroke-width="6" stroke-linecap="round"/><circle cx="${f(lq[0])}" cy="${f(lq[1])}" r="4" fill="${x.url("bdr")}"/>` +
        drop(x, `<circle cx="${cx}" cy="${cy}" r="49"/>`, 4, 8, .6) + `<circle cx="${cx}" cy="${cy}" r="49.6" fill="#000" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="49" fill="${x.url("ring")}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="41" fill="#f1e8d2"/><circle cx="${cx}" cy="${cy}" r="41" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>` + sc +
        `<path d="M${cx} ${cy} L${f(np[0])} ${f(np[1])}" stroke="#b3261e" stroke-width="1.3" stroke-linecap="round"/>` +
        `<rect x="88" y="58.5" width="24" height="13" rx="2" fill="#3a2f20"/><rect x="89" y="59.5" width="22" height="11" rx="1.4" fill="#fbf4e2"/>` + digits(x, cx, 65, 7.6, "#2a2218") +
        `<path d="${coil}" fill="none" stroke="#b5703f" stroke-width="1.6" stroke-linecap="round"/>` +
        `<g transform="rotate(${x.on ? -8 : 8} 100 122)"><rect x="86" y="118" width="28" height="8" rx="4" fill="${x.url("cap")}" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>` +
        `<ellipse cx="${merc}" cy="122" rx="5" ry="2.6" fill="#c9ced6"/><ellipse cx="${merc - 1.2}" cy="121" rx="2" ry=".9" fill="#fff"/></g>` + mode(x, cx, 138, 2.6, { halo: false, idle: "#6a604e", idleOp: .3 }) +
        `<circle cx="${cx}" cy="${cy}" r="41" fill="${x.url("cov")}"/><path d="${arc(cx, cy, 38, -70, -20)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/>` +
        `<path d="${arc(cx, cy, 48.2, -70, 20)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>`;
      return scene(x, "stripe", b);
    } }),

     base({ id: "boiler", name: "Boiler control", colors: sw("steel graphite white black copper"), render(o) {
      const x = ctx(o);
      x.add("cu", lg(x.id("cu"), [[0, "#7a3f1f"], [.35, "#e6a476"], [.55, "#c27b50"], [1, "#6a3418"]]) + lg(x.id("pump"), [[0, "#5a1712"], [.35, "#d0493a"], [1, "#5a1712"]]) +
        lg(x.id("mot"), [[0, "#1e3a2e"], [.4, "#4f8a6c"], [1, "#16291f"]]));
      const pipe = (px, y0, y1) => `<rect x="${px - 5}" y="${y0}" width="10" height="${y1 - y0}" fill="${x.url("cu")}"/>`;
      const knob = (kx, ky) => drop(x, `<circle cx="${kx}" cy="${ky}" r="7"/>`, 1.5, 3, .5) + `<circle cx="${kx}" cy="${ky}" r="7" fill="#26272c"/><circle cx="${kx}" cy="${ky}" r="5.6" fill="#3b3d44"/><path d="M${kx} ${ky - 5} V${ky - 1.5}" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>`;
      const b = drop(x, rr(73, 96, 10, 96, 0) + rr(117, 96, 10, 96, 0), 3, 0, .45) + pipe(78, 96, 192) + pipe(122, 96, 192) +
        `<rect x="71" y="168" width="14" height="6" rx="1" fill="${x.url("cu")}"/><rect x="115" y="110" width="14" height="6" rx="1" fill="${x.url("cu")}"/>` +
        `<rect x="66" y="140" width="10" height="5" rx="1.5" fill="#d0493a"/><circle cx="78" cy="142.5" r="3" fill="#888"/>` +
        drop(x, rr(110, 126, 24, 30, 3), 2, 4, .5) + `<rect x="110" y="126" width="24" height="30" rx="3" fill="${x.url("pump")}"/>` +
        `<rect x="128" y="130" width="22" height="22" rx="4" fill="${x.url("mot")}"/>` + [133, 138, 143].map((a) => `<path d="M${a} 133 V149" stroke="#000" stroke-opacity=".35"/>`).join("") +
        `<circle cx="146" cy="134" r="1.4" fill="${x.on ? "#69db7c" : "#333"}"${x.on ? ` class="${P}blink"` : ""}/>` +
        rise(x, [[78, 120], [122, 104], [78, 178], [122, 186]], rc(x, "#ffb070", "#a6dbff"), 18, 1.2) +
        wallGlow(x, 100, 62, 60) + slab(x, 52, 28, 96, 70, 4) + `<rect x="59" y="35" width="52" height="28" rx="2" fill="#000" opacity=".25"/>` +
        lcd(x, 61, 37, 48, 24, 2) + digits(x, 79, 49, 14, x.ink, { ghost: .07 }) + mode(x, 100, 47, 3.6, { halo: false, idle: x.ink, idleOp: .2 }) +
        knob(129, 46) + knob(129, 77) + [64, 72, 80].map((a, i) => ledDot(x, a, 76, 1.4).replace(/class="[^"]*"/, i === 1 ? `class="${P}pulse"` : `class="${P}pulse" style="animation-delay:.${i * 4}s"`)).join("") +
        screw(56, 32, 1.3) + screw(144, 32, 1.3) + screw(56, 94, 1.3) + screw(144, 94, 1.3);
      return scene(x, "concrete", b);
    } }),

     base({ id: "atticfan", name: "Attic fan control", colors: sw("graphite white steel black ivory"), render(o) {
      const x = ctx(o), ang = -135 + 270 * x.lv;
      x.add("cond", lg(x.id("cond"), [[0, "#6d737b"], [.4, "#d3d7dc"], [1, "#5a6067"]]));
      let tk = ""; for (let i = 0; i <= 10; i++) { const a = -135 + i * 27, p0 = pt(100, 104, 17.5, a), p1 = pt(100, 104, 20.5, a); tk += `<path d="M${f(p0[0])} ${f(p0[1])} L${f(p1[0])} ${f(p1[1])}" stroke="${x.dk ? "#fff" : "#000"}" stroke-opacity=".45" stroke-width="1"/>`; }
      const b = `<rect x="95" y="8" width="10" height="40" fill="${x.url("cond")}"/><rect x="93" y="38" width="14" height="6" rx="1" fill="${x.url("cond")}"/>` +
        wallGlow(x, 100, 104, 62) + slab(x, 68, 44, 64, 106, 6) + screw(100, 49, 1.5) + screw(100, 145, 1.5) +
        lcd(x, 80, 55, 40, 18, 2) + digits(x, 100, 64, 11.5, x.ink, { ghost: .07 }) + tk +
        drop(x, `<circle cx="100" cy="104" r="14"/>`, 2, 4, .6) + `<circle cx="100" cy="104" r="14" fill="#1f2024"/><circle cx="100" cy="103.4" r="11.6" fill="#33353c"/>` +
        `<g transform="rotate(${f(ang)} 100 104)"><rect x="98.4" y="91" width="3.2" height="26" rx="1.6" fill="#4a4d55"/><path d="M100 92.5 V98" stroke="${x.on ? x.hot : "#ddd"}" stroke-width="1.6" stroke-linecap="round"/></g>` +
        `<circle cx="88" cy="134" r="7.4" fill="#000" opacity=".2"/>` + fanIcon(x, 88, 134, 6, x.on ? x.hot : x.dk ? "#bbb" : "#666") + fanDots(x, 110, 134, 4.4, 1.3) + mode(x, 120, 125, 2.2, { halo: false });
      return scene(x, "wood", b);
    } }),

     base({ id: "colorring", name: "Color ring", colors: sw("white black steel brass copper"), render(o) {
      const x = ctx(o), cx = 100, cy = 98; fin(x);
      x.add("lr", lg(x.id("lr"), [[0, x.hot], [.5, x.gc], [1, H.shade(x.gc, -.2)]], 0, 0, 1, 1));
      const b = wallGlow(x, cx, cy, 86) + drop(x, `<circle cx="${cx}" cy="${cy}" r="50"/>`, 4, 8, .6) +
        `<circle cx="${cx}" cy="${cy}" r="50.6" fill="#000" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="50" fill="${x.url("bdr")}"/>` + brushC(x, cx, cy, 44, 50) +
        `<path d="${arc(cx, cy, 49.2, -80, 10)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>` +
        `<circle cx="${cx}" cy="${cy}" r="43.5" fill="#000" opacity=".5"/>` +
        (x.on ? `<g class="${P}breathe"><circle cx="${cx}" cy="${cy}" r="41.5" fill="none" stroke="${x.gc}" stroke-width="7" opacity=".6" filter="${x.url("bl")}"/><circle cx="${cx}" cy="${cy}" r="41.5" fill="none" stroke="${x.url("lr")}" stroke-width="3.4"/></g><circle cx="${cx}" cy="${cy}" r="41.5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>`
          : `<circle cx="${cx}" cy="${cy}" r="41.5" fill="none" stroke="#3a3d45" stroke-width="3.4"/>`) +
        `<circle cx="${cx}" cy="${cy}" r="38.6" fill="${x.url("glass")}"/>` + mode(x, cx, cy - 22, 3.4, { halo: false }) +
        digits(x, cx, cy, 24, x.on ? "#fff" : "#8a909b", { glow: 1 }) + fanDots(x, cx, cy + 22, 5, 1.4) +
        `<ellipse cx="${cx - 10}" cy="${cy - 20}" rx="25" ry="11" transform="rotate(-24 ${cx - 10} ${cy - 20})" fill="#fff" opacity=".07"/>`;
      return scene(x, "dark", b);
    } }),
  ];

  const MODE = [["off", "Off"], ["heat", "Heat"], ["cool", "Cool"], ["auto", "Auto"], ["eco", "Eco"]];
  const STATE = [["idle", "Idle"], ["heating", "Heating"], ["cooling", "Cooling"], ["fan", "Fan only"]];
  const TEMPS = [{ id: "temp", name: "Temperature", type: "value", unit: "°", min: 40, max: 95, def: 68 }, { id: "sp", name: "Setpoint", type: "value", unit: "°", min: 45, max: 90, def: 70 }];
  const tsParts = (heatOnly) => [
    { id: "mode", name: "Mode", type: "stage", values: heatOnly ? MODE.filter((v) => v[0] !== "cool" && v[0] !== "auto") : MODE, def: "heat" },
    { id: "state", name: "Operating state", type: "stage", values: heatOnly ? STATE.filter((v) => v[0] === "idle" || v[0] === "heating") : STATE, def: "heating" },
  ].concat(heatOnly ? [] : [{ id: "fan", name: "Fan", type: "stage", values: [["auto", "Auto"], ["on", "On"], ["circulate", "Circulate"]], def: "auto" }]).concat(TEMPS);
  const HEATONLY = ["baseboard", "radiant", "boiler"];
  icons.forEach((ic) => {
    if (["learning", "square", "dial", "programmable", "touchscreen", "pill", "withsensor", "baseboard", "splitwall", "remote", "ptac", "radiant", "boiler", "colorring", "mercury"].indexOf(ic.id) >= 0) ic.parts = tsParts(HEATONLY.indexOf(ic.id) >= 0);
    if (ic.id === "zone") ic.parts = [1, 2, 3, 4].map((i) => ({ id: "z" + i, name: "Zone " + i }));
    if (ic.id === "vent") ic.parts = [{ id: "vent", name: "Damper" }, TEMPS[0]];
  });
  const AUTO = { heatcool: "Automatic" };
  const SMART = ["heatcool off heat cool fan eco", "comfort sleep away"], SPLIT = ["heatcool off heat cool auto dry fan eco", "boost comfort sleep"],
    HEATONLY_O = ["heatcool heat off eco", "comfort sleep away frost", AUTO];
  const HV = { learning: SMART, square: SMART, touchscreen: SMART, pill: SMART, withsensor: SMART, colorring: SMART,
    programmable: ["heatcool off heat cool fan", "sleep away"], dial: ["heatcool off heat cool"], mercury: ["heatcool off heat cool fan"],
    zone: ["heatcool off heat cool fan"], splitwall: SPLIT, remote: SPLIT, ptac: ["heatcool off heat cool auto fan eco"],
    baseboard: HEATONLY_O, radiant: HEATONLY_O, boiler: ["heatcool heat off eco", "boost comfort sleep away frost", AUTO] };
  icons.forEach((ic) => { const h = HV[ic.id]; if (h) ic.options = hvOpts(h[0], h[1], h[2]); });

  (window.HDA = window.HDA || []).push({
    id: "thermostat",
    tab: "Thermostats",
    group: "Air",
    kind: "device",
    levelLabel: "Setpoint",
    onWord: "Running", offWord: "Idle",
    intro: "Twenty thermostats and climate controls on real walls. The slider is the setpoint (60–84°F), drawn in segment digits. Running glows orange for heating (70°F and up) or blue for cooling; Idle dims the display. Mode and Preset menus (only the ones each control has) recolor the display: heat orange, cool blue, auto green, dry teal, fan gray, eco leaf green. Body (or Ring) changes the finish.",
    css: `.hda-thermostat-breathe,.hda-thermostat-pulse,.hda-thermostat-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-thermostat-breathe{animation:hda-thermostat-breathe 4.2s ease-in-out infinite}
@keyframes hda-thermostat-breathe{50%{opacity:.35;transform:scale(.97)}}
.hda-anim .hda-thermostat-pulse{animation:hda-thermostat-pulse 2.6s ease-in-out infinite}
@keyframes hda-thermostat-pulse{50%{opacity:.6;transform:scale(1.12)}}
.hda-anim .hda-thermostat-dot{animation:hda-thermostat-dot 1.2s ease-in-out infinite}
@keyframes hda-thermostat-dot{0%,100%{opacity:.2}40%{opacity:1}}
.hda-anim .hda-thermostat-spin{animation:hda-thermostat-spin 1.4s linear infinite}
@keyframes hda-thermostat-spin{to{transform:rotate(360deg)}}
.hda-thermostat-rise{opacity:.5}
.hda-anim .hda-thermostat-rise{animation:hda-thermostat-rise 2.4s ease-out infinite}
@keyframes hda-thermostat-rise{0%{opacity:0;transform:translate(0,4px)}30%{opacity:.7}100%{opacity:0;transform:translate(0,-8px)}}
.hda-thermostat-blow{opacity:.6}
.hda-anim .hda-thermostat-blow{animation:hda-thermostat-blow 1.8s ease-out infinite}
@keyframes hda-thermostat-blow{0%{opacity:0;transform:translate(0,-6px)}30%{opacity:.8}100%{opacity:0;transform:translate(0,6px)}}
.hda-thermostat-wave{opacity:.7}
.hda-anim .hda-thermostat-wave{animation:hda-thermostat-wave 1.6s ease-in-out infinite}
@keyframes hda-thermostat-wave{0%,100%{opacity:.1}50%{opacity:.9}}
.hda-anim .hda-thermostat-blink{animation:hda-thermostat-blink 1.3s steps(2,start) infinite}
@keyframes hda-thermostat-blink{50%{opacity:.1}}
.hda-thermostat-sb{opacity:0}
.hda-anim .hda-thermostat-sa{animation:hda-thermostat-sa 8s ease-in-out infinite}
.hda-anim .hda-thermostat-sb{animation:hda-thermostat-sb 8s ease-in-out infinite}
@keyframes hda-thermostat-sa{0%,42%{opacity:1}50%,92%{opacity:0}100%{opacity:1}}
@keyframes hda-thermostat-sb{0%,42%{opacity:0}50%,92%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-thermostat-breathe,.hda-anim .hda-thermostat-pulse,.hda-anim .hda-thermostat-dot,.hda-anim .hda-thermostat-spin,.hda-anim .hda-thermostat-rise,.hda-anim .hda-thermostat-blow,.hda-anim .hda-thermostat-wave,.hda-anim .hda-thermostat-blink,.hda-anim .hda-thermostat-sa,.hda-anim .hda-thermostat-sb{animation:none}}`,
    icons,
  });
})();
