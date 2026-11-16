(function () {
  const H = window.HDAH, P = "hda-air2-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rad = (d) => d * Math.PI / 180;
  const pt = (cx, cy, r, deg) => [cx + Math.sin(rad(deg)) * r, cy - Math.cos(rad(deg)) * r];
  const arc = (cx, cy, r, a0, a1) => { const p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1);
    return `M${f(p0[0])} ${f(p0[1])} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f(p1[0])} ${f(p1[1])}`; };

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

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
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

  const METAL = ["#d4d8de", "#c9a457", "#b9bcc0", "#c9ccd1", "#b8743f"];
  const ICE = "#a9ddff", WARM = "#ffb070";
  function ctx(o) {
    const c = (o.color || "#f2f1ee").toLowerCase(), lv = o.level == null ? .6 : Math.max(0, Math.min(1, o.level));
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const x = { o, c, on: !!o.on, lv, id, url, defs: [], have: {}, metal: METAL.indexOf(c) >= 0, parts: o.parts || null, opt: o.opt || {},
      dk: H.hx(c).reduce((a, b) => a + b, 0) < 300 };
    x.mf = !!o.mf;
    x.part = (k) => (x.parts && x.parts[k] != null ? !!x.parts[k] : !x.mf && x.on);
    x.zon = (n) => { for (let i = 1; i <= n; i++) if (x.part("z" + i)) return true; return false; };
    x.add = (k, s) => { if (!x.have[k]) { x.have[k] = 1; x.defs.push(s); } };
    x.dur = (a, b) => Math.max(.3, a - b * lv).toFixed(2);
    return x;
  }

  const MAC = { cool: ICE, heat: WARM, auto: "#9ff0a8", dry: "#6fe3d6", fan: "#d5dbe2", eco: "#bfee9a" };
  function hv(x) {
    const md = x.opt.mode || "cool"; if (md === "off") x.on = false;
    x.mode = md; x.mc = MAC[md] || ICE; x.preset = x.opt.preset || "none"; x.swing = x.opt.swing || "off";
    x.add("mg", rg(x.id("mg"), [[0, x.mc, .6], [.45, x.mc, .2], [1, x.mc, 0]]));
    x.glow = x.url(md === "cool" ? "cool" : "mg");
    return x;
  }
  const G1 = (cx, cy, s, b, col, fill) => `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s})" fill="${fill ? col : "none"}" stroke="${fill ? "none" : col}" stroke-width=".22" stroke-linecap="round" stroke-linejoin="round">${b}</g>`;
  function mglyph(m, cx, cy, s, col) {
    if (m === "heat") return G1(cx, cy, s, `<path d="M0 -1 C.55 -.5 .78 -.05 .6 .38 C.47 .76 .16 .98 0 .98 C-.16 .98 -.5 .78 -.6 .38 C-.7 -.04 -.38 -.32 -.22 -.62 C-.14 -.3 .02 -.26 .07 -.44 C.12 -.64 .06 -.84 0 -1 Z"/>`, col, 1);
    if (m === "cool") return G1(cx, cy, s, `<path d="M0 -.95 V.95 M-.82 -.47 L.82 .47 M-.82 .47 L.82 -.47"/>`, col);
    if (m === "auto") return G1(cx, cy, s, `<path d="M-.62 .85 L0 -.85 L.62 .85 M-.38 .25 H.38"/>`, col);
    if (m === "dry") return G1(cx, cy, s, `<path d="M0 -1 C.35 -.45 .7 -.05 .7 .35 C.7 .75 .38 1 0 1 C-.38 1 -.7 .75 -.7 .35 C-.7 -.05 -.35 -.45 0 -1 Z"/>`, col, 1);
    if (m === "fan") { let b = ""; for (let i = 0; i < 3; i++) b += `<path transform="rotate(${i * 120})" d="M0 0 C-.5 -.3 -.38 -.95 0 -.95 C.32 -.95 .3 -.38 0 0 Z"/>`; return G1(cx, cy, s, b + `<circle r=".16"/>`, col, 1); }
    if (m === "eco") return G1(cx, cy, s, `<path d="M-.8 .8 C-.85 -.2 -.15 -.85 .85 -.85 C.9 .15 .25 .85 -.8 .8 Z"/>`, col, 1) + G1(cx, cy, s, `<path d="M-.8 .8 L.35 -.35" stroke-opacity=".4"/>`, "#000");
    return "";
  }
  function pglyph(p, cx, cy, s, col) {
    if (p === "boost") return G1(cx, cy, s, `<path d="M.2 -1 L-.6 .12 H-.02 L-.22 1 L.6 -.15 H.02 Z"/>`, col, 1);
    if (p === "comfort") return G1(cx, cy, s, `<path d="M-.5 .1 V-.55 H.5 V.1 M-.85 .55 V-.05 H-.5 V.15 H.5 V-.05 H.85 V.55 Z M-.7 .55 V.8 M.7 .55 V.8"/>`, col);
    if (p === "sleep") return G1(cx, cy, s, `<path d="M.3 -.9 A.92 .92 0 1 0 .9 .35 A.7 .7 0 0 1 .3 -.9 Z"/>`, col, 1);
    if (p === "away") return G1(cx, cy, s, `<path d="M-.85 -.02 L0 -.82 L.85 -.02 M-.6 -.25 V.82 H.6 V-.25 M-.18 .82 V.32 H.18 V.82"/>`, col);
    return "";
  }
  const hvMark = (x, cx, cy, s) => x.on ? (x.mode !== "cool" ? mglyph(x.mode, cx, cy, s, x.mc) : "") + (x.preset !== "none" ? pglyph(x.preset, cx - s * 2.8, cy, s, x.mc) : "") : "";
  const swV = (x, s) => x.on && (x.swing === "vertical" || x.swing === "both") ? `<g class="${P}swv">${s}</g>` : s;
  function swH(x, X, Y, W) {
    if (!x.on || (x.swing !== "horizontal" && x.swing !== "both")) return ""; let s = "";
    for (let i = 0; i < 12; i++) s += `<rect x="${f(X + W * (i + .5) / 12 - .7)}" y="${Y}" width="1.4" height="7" rx=".7" fill="#16181c" opacity=".55"/>`;
    return `<g class="${P}swh">${s}</g>`;
  }
  const swAir = (x, s) => x.on && x.swing !== "off" ? `<g class="${P}${x.swing === "vertical" ? "swy" : "swx"}">${s}</g>` : s;

  function scene(x, wall, floor, body, sc) {
    sc = sc || 1; const w = WALL[wall] || WALL.plaster;
    let fl = "";
    if (floor) { const [y, kind] = floor;
      const F = { wood: ["#8a6040", "#4f3420"], tile: ["#9a968d", "#5f5b54"], carpet: ["#4a4250", "#2c2733"], concrete: ["#6b6d70", "#3e4043"], van: ["#3a3c40", "#202124"] }[kind] || ["#8a6040", "#4f3420"];
      fl = `<rect x="8" y="${y}" width="184" height="${200 - y}" fill="${x.url("floor")}"/><path d="M8 ${y + .5} H192" stroke="#fff" stroke-opacity=".25"/>`;
      x.add("floor", lg(x.id("floor"), [[0, F[0]], [1, F[1]]], 0, 0, 0, 1));
      if (kind === "wood") for (let i = 0; i < 4; i++) fl += `<path d="M8 ${y + 7 + i * 8} H192" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`;
      if (kind === "tile") for (let i = -5; i <= 5; i++) fl += `<path d="M${100 + i * 12} ${y} L${100 + i * 30} 200" stroke="#000" stroke-opacity=".2"/>`;
    }
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>
${lg(x.id("wallg"), [[0, w[0]], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${x.id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(x.id("vig"), [[0, "#000", 0], [.6, "#000", .06], [1, "#000", .5]], .5, .46, .76)}
${rg(x.id("warm"), [[0, "#ff9a3c", .7], [.45, "#ff7a1a", .22], [1, "#ff7a1a", 0]])}
${rg(x.id("cool"), [[0, ICE, .6], [.45, ICE, .2], [1, ICE, 0]])}
${rg(x.id("glass"), [[0, "#2a2d36"], [.6, "#121319"], [1, "#050508"]], .35, .25, .9)}
${lg(x.id("gloss"), [[0, "#fff", .22], [.45, "#fff", .04], [.46, "#fff", 0], [1, "#fff", 0]], 0, 0, .6, 1)}
${lg(x.id("chrome"), [[0, "#7c838c"], [.25, "#f4f6f8"], [.45, "#aab1ba"], [.7, "#ffffff"], [1, "#6f767f"]])}
${lg(x.id("brass"), [[0, "#7a5a22"], [.3, "#f1d48a"], [.55, "#c9a457"], [.8, "#f7e2a8"], [1, "#6e4f1c"]])}
${lg(x.id("copper"), [[0, "#7a3f1f"], [.35, "#e6a476"], [.55, "#c27b50"], [1, "#6a3418"]])}
<filter id="${x.id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="${x.id("bs")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>
${x.defs.join("")}</defs>
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(wall)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/>${fl}</g></g>
<g clip-path="${x.url("wc")}"><g transform="translate(100 100) scale(${sc}) translate(-100 -100)">${body}</g></g>
<rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></svg>`;
  }

  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const rr = (X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const glossR = (x, X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("gloss")}"/>`;
  const contact = (x, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .1)}" fill="#000" opacity=".5" filter="${x.url("bs")}"/>`;
  const led = (x, cx, cy, r, col, lit) => lit ? `<g class="${P}pulse"><circle cx="${cx}" cy="${cy}" r="${f(r * 3)}" fill="${col}" opacity=".25"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/></g>` : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3a3d44"/>`;
  function slab(x, X, Y, W, Hh, r, v) {
    fin(x);
    return drop(x, rr(X, Y, W, Hh, r), 3, 6, .5) + `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("edge")}"/>` +
      `<rect x="${f(X + 1)}" y="${f(Y + .8)}" width="${f(W - 2)}" height="${f(Hh - 2.2)}" rx="${Math.max(r - .8, .5)}" fill="${x.url(v ? "bdv" : "bd")}"/>` + brushR(x, X + 1, Y + 1, W - 2, Hh - 3) +
      hl(`M${f(X + r)} ${f(Y + 1.2)} H${f(X + W - r)}`, x.dk ? .25 : .8, .8);
  }
  function wisps(x, pts, col, len, dir) {
    if (!x.on) return ""; dir = dir || "down";
    return pts.map(([px, py], i) => { const d = dir === "down" ? `M${px} ${py} q-5 ${f(len * .4)} 2 ${f(len * .7)} q4 ${f(len * .2)} 0 ${f(len * .3)}` : dir === "right" ? `M${px} ${py} q${f(len * .4)} -4 ${f(len * .7)} 2 q${f(len * .2)} 3 ${f(len * .3)} 0` : `M${px} ${py} q-${f(len * .4)} -4 -${f(len * .7)} 2 q-${f(len * .2)} 3 -${f(len * .3)} 0`;
      return `<path class="${P}${dir === "down" ? "fall" : dir === "right" ? "goR" : "goL"}" style="animation-delay:-${(i * .37 % 1.6).toFixed(2)}s;animation-duration:${x.dur(2.6, 1.3)}s" d="${d}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/>`; }).join("");
  }
  function rise(x, pts, col, len) {
    if (!x.on) return "";
    return pts.map(([px, py], i) => `<path class="${P}rise" style="animation-delay:-${(i * .45 % 1.8).toFixed(2)}s" d="M${px} ${py} c-2.5 -${f(len * .25)} 2.5 -${f(len * .5)} 0 -${f(len * .75)} c-1.5 -${f(len * .12)} 0 -${f(len * .2)} 0 -${f(len * .25)}" fill="none" stroke="${col}" stroke-width="1.4" stroke-linecap="round" stroke-opacity="${(.35 + .5 * x.lv).toFixed(2)}"/>`).join("");
  }
  function fan(x, cx, cy, r, col, n) {
    n = n || 5; let b = "";
    for (let i = 0; i < n; i++) b += `<path transform="rotate(${f(i * 360 / n)} ${cx} ${cy})" d="M${cx} ${cy} C${f(cx - r * .5)} ${f(cy - r * .3)} ${f(cx - r * .45)} ${f(cy - r)} ${cx} ${f(cy - r)} C${f(cx + r * .35)} ${f(cy - r)} ${f(cx + r * .3)} ${f(cy - r * .4)} ${cx} ${cy} Z" fill="${col}"/>`;
    return `<g${x.on ? ` class="${P}spin" style="animation-duration:${x.dur(1.6, 1.2)}s"` : ""}>${b}<circle cx="${cx}" cy="${cy}" r="${f(r * .2)}" fill="${H.shade(col, -.3)}"/></g>`;
  }
  function digits(x, cx, cy, h, col, str, o2) {
    o2 = o2 || {}; const w = h * .5, t = Math.max(.7, h * .13), sp = h * .22;
    let tot = 0; for (const ch of str) tot += ch === "." ? t * 1.4 : w + sp; tot -= sp; if (o2.deg) tot += sp + h * .22;
    let ox = cx - tot / 2; const oy = cy - h / 2; let s = "";
    for (const ch of str) { if (ch === ".") { s += `<rect x="${f(ox - sp * .55)}" y="${f(oy + h - t * .6)}" width="${f(t * 1.3)}" height="${f(t * 1.3)}" fill="${col}"/>`; ox += t * 1.4; continue; }
      s += digit(ch, ox, oy, w, h, t, col, o2.ghost); ox += w + sp; }
    if (o2.deg) s += `<circle cx="${f(ox + h * .11)}" cy="${f(oy + h * .11)}" r="${f(h * .07)}" fill="none" stroke="${col}" stroke-width="${f(t * .6)}"/>`;
    return `<g transform="translate(${(cy * .07).toFixed(2)} 0) skewX(-4)">${s}</g>`;
  }
  const towel = (X, Y, W, Hh, col) => `<path d="M${X} ${Y} H${X + W} V${Y + Hh} Q${X + W * .5} ${Y + Hh + 4} ${X} ${Y + Hh} Z" fill="${col}"/><path d="M${X} ${Y} H${X + W} V${Y + Hh} Q${X + W * .5} ${Y + Hh + 4} ${X} ${Y + Hh} Z" fill="url(#__fold)"/>` +
    [.25, .5, .75].map((k) => `<path d="M${f(X + W * k)} ${Y + 2} V${Y + Hh}" stroke="#000" stroke-opacity=".12"/>`).join("") + `<path d="M${X + 2} ${Y + Hh - 5} H${X + W - 2}" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`;

  function vane(x, X, Y, W, open, col) {
    return open ? `<g><path d="M${X} ${Y} L${X + W} ${Y} L${X + W - 3} ${Y + 7} L${X + 3} ${Y + 7} Z" fill="${col}"/><path d="M${X + 3} ${Y + 7} H${X + W - 3}" stroke="#000" stroke-opacity=".25"/></g>`
      : `<path d="M${X} ${Y - 1} H${X + W}" stroke="${H.shade(col, -.2)}" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  const coolTemp = (x) => String(76 - Math.round(x.lv * 10));

  const base = (o) => Object.assign({ picker: true, colorLabel: "Body" }, o);

  const icons = [
    base({ id: "boxy-wall-split", name: "Boxy wall split", colors: ["#f4f5f2", "#c9ccd1", "#2a2b30", "#e9e3d6"], render(o) {
      const x = hv(ctx(o)), S = (a) => H.shade(x.c, a); fin(x);
      const b = (x.on ? `<ellipse class="${P}breathe" cx="100" cy="120" rx="78" ry="34" fill="${x.glow}" opacity=".35"/>` : "") +
        drop(x, `<path d="M24 58 Q24 54 28 54 H172 Q176 54 176 58 V100 Q176 104 172 104 H28 Q24 104 24 100 Z"/>`, 3, 6, .5) +
        `<path d="M24 58 Q24 54 28 54 H172 Q176 54 176 58 V100 Q176 104 172 104 H28 Q24 104 24 100 Z" fill="${x.url("bdv")}"/>` +
        `<path d="M28 60 Q100 57 172 60" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .25 : .85}" stroke-width="1.2"/><path d="M26 92 H174" stroke="#000" stroke-opacity=".12"/>` +
        `<path d="M30 96 H170 L166 104 H34 Z" fill="#14161a" opacity=".85"/>` + swV(x, vane(x, 32, 101, 136, x.on, S(.05))) + swH(x, 34, 100, 132) +
        led(x, 152, 92, 1.1, "#7ee08a", x.on) + led(x, 158, 92, 1.1, "#ffb347", x.on && x.lv > .7) + hvMark(x, 143, 92, 2.2) +
        `<path d="M134 82 H162" stroke="#000" stroke-opacity=".08"/>` +
        swAir(x, wisps(x, [[46, 110], [70, 112], [96, 112], [122, 112], [148, 110]], x.mc, 40));
      return scene(x, "sage", null, b);
    } }),
    base({ id: "faceted-wall-split", name: "Faceted wall split", colors: ["#c9ccd1", "#f4f5f2", "#2a2b30"], render(o) {
      const x = hv(ctx(o)), S = (a) => H.shade(x.c, a); fin(x);
      x.add("emu", lg(x.id("emu"), [[0, S(.45)], [.5, S(.1)], [1, S(-.12)]], 0, 0, 0, 1) + lg(x.id("emu2"), [[0, S(-.15)], [1, S(-.45)]], 0, 0, 0, 1));
      const front = "M22 58 H178 V84 L172 98 H28 L22 84 Z";
      const b = (x.on ? `<ellipse class="${P}breathe" cx="100" cy="118" rx="80" ry="32" fill="${x.glow}" opacity=".35"/>` : "") +
        drop(x, `<path d="${front}"/>`, 3, 6, .5) + `<path d="M24 54 H176 L178 58 H22 Z" fill="${S(.4)}"/>` +
        `<path d="M22 58 H178 V84 H22 Z" fill="${x.url("emu")}"/><path d="M22 84 H178 L172 98 H28 Z" fill="${x.url("emu2")}"/>` + brushR(x, 23, 59, 154, 24) +
        `<path d="M22 84 H178" stroke="#fff" stroke-opacity=".55" stroke-width=".9"/><path d="M24 59 H176" stroke="#fff" stroke-opacity=".6"/>` +
        `<path d="M28 98 H172 L169 102 H31 Z" fill="#111317"/>` + swV(x, vane(x, 30, 100, 140, x.on, S(-.1))) + swH(x, 32, 99, 136) +
        `<rect x="150" y="88" width="10" height="2.4" rx="1.2" fill="${x.on ? (x.mode === "cool" ? "#cfeaff" : x.mc) : "#000"}" opacity="${x.on ? .9 : .15}"/>` + hvMark(x, 143, 89.2, 2.2) +
        swAir(x, wisps(x, [[48, 110], [76, 112], [104, 112], [132, 112], [156, 110]], x.mc, 42));
      return scene(x, "linen", null, b);
    } }),
    base({ id: "mirror-glass-wall-split", name: "Mirror-glass wall split", colors: ["#2a2b30", "#f4f5f2", "#7a2e3a"], colorLabel: "Glass", render(o) {
      const x = hv(ctx(o)), S = (a) => H.shade(x.c, a);
      x.add("mir", lg(x.id("mir"), [[0, S(.35)], [.5, x.c], [1, S(-.45)]], 0, 0, 0, 1));
      const b = (x.on ? `<ellipse class="${P}breathe" cx="100" cy="120" rx="78" ry="32" fill="${x.glow}" opacity=".35"/>` : "") +
        drop(x, rr(22, 54, 156, 50, 4), 3, 6, .55) + `<rect x="22" y="54" width="156" height="50" rx="4" fill="${S(-.35)}"/>` +
        `<rect x="24" y="55.5" width="152" height="40" rx="3" fill="${x.url("mir")}"/><path d="M40 55.5 L70 95.5 H86 L56 55.5 Z M90 55.5 L104 95.5 H110 L96 55.5 Z" fill="#fff" opacity=".08"/>` +
        `<rect x="24" y="55.5" width="152" height="40" rx="3" fill="${x.url("gloss")}"/>` +
        `<path d="M26 96 H174 L170 104 H30 Z" fill="#14161a"/>` + swV(x, vane(x, 28, 101, 144, x.on, "#e6e8eb")) + swH(x, 30, 100, 140) +
        (x.on ? `<g opacity=".95">${digits(x, 154, 76, 8, "#e9f4ff", coolTemp(x), { deg: 1 })}</g>` : "") + hvMark(x, 138, 76, 2.4) +
        swAir(x, wisps(x, [[46, 112], [72, 114], [100, 114], [128, 114], [154, 112]], x.mc, 40));
      return scene(x, "navy", null, b);
    } }),

    base({ id: "castiron", name: "Cast-iron column", colorLabel: "Finish", colors: ["#8c8f94", "#f1efe9", "#2b2c30", "#b8743f", "#e8dcc0", "#3f5a4c"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      x.add("col", lg(x.id("col"), [[0, S(-.5)], [.3, S(.35)], [.55, x.c], [1, S(-.55)]]));
      let cols = "";
      for (let i = 0; i < 9; i++) { const X = 40 + i * 13;
        cols += `<path d="M${X} 92 Q${X} 86 ${X + 6} 86 Q${X + 12} 86 ${X + 12} 92 V150 Q${X + 12} 156 ${X + 6} 156 Q${X} 156 ${X} 150 Z" fill="${x.url("col")}"/>` +
          `<path d="M${X + 3} 98 Q${X + 6} 94 ${X + 9} 98 M${X + 3} 144 Q${X + 6} 148 ${X + 9} 144" fill="none" stroke="${S(.4)}" stroke-width="1"/><path d="M${X + 6} 100 V140" stroke="#000" stroke-opacity=".3"/>`; }
      const b = (x.on ? `<rect class="hda-bg" x="34" y="70" width="130" height="90" rx="20" fill="${x.url("warm")}" opacity="${(.2 + .3 * x.lv).toFixed(2)}"/>` : "") +
        contact(x, 100, 166, 66) + drop(x, rr(38, 86, 120, 70, 6), 3, 5, .5) + cols +
        `<rect x="38" y="96" width="120" height="4" fill="${S(-.3)}"/><rect x="38" y="142" width="120" height="4" fill="${S(-.3)}"/>` +
        [44, 152].map((X) => `<path d="M${X - 3} 156 L${X - 5} 166 H${X + 5} L${X + 3} 156 Z" fill="${S(-.25)}"/>`).join("") +
        `<rect x="158" y="146" width="10" height="5" fill="${x.url("brass")}"/><circle cx="170" cy="140" r="5" fill="${x.url("brass")}"/><path d="M170 146 V166" stroke="${x.url("copper")}" stroke-width="3"/>` +
        rise(x, [[50, 82], [70, 80], [92, 82], [114, 80], [136, 82]], WARM, 24);
      return scene(x, "stripe", [166, "wood"], b);
    } }),
    base({ id: "vertical", name: "Vertical designer", colorLabel: "Finish", colors: ["#3b3e44", "#f2f1ee", "#1f2023", "#b9b0a0", "#c9ccd1"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      x.add("tube", lg(x.id("tube"), [[0, S(-.45)], [.35, S(.3)], [.6, x.c], [1, S(-.5)]]));
      let t = ""; for (let i = 0; i < 6; i++) { const X = 78 + i * 8; t += `<rect x="${X}" y="26" width="6.4" height="150" rx="3.2" fill="${x.url("tube")}"/>`; }
      const b = (x.on ? `<rect class="hda-bg" x="66" y="20" width="70" height="160" rx="30" fill="${x.url("warm")}" opacity="${(.2 + .3 * x.lv).toFixed(2)}"/>` : "") +
        drop(x, rr(76, 24, 50, 154, 3), 3, 5, .5) + `<rect x="76" y="30" width="50" height="5" rx="2" fill="${S(-.2)}"/><rect x="76" y="166" width="50" height="5" rx="2" fill="${S(-.2)}"/>` + t +
        `<rect x="122" y="178" width="4" height="10" fill="${x.url("chrome")}"/><rect x="118" y="186" width="12" height="4" rx="1" fill="${x.url("chrome")}"/><rect x="76" y="178" width="4" height="10" fill="${x.url("chrome")}"/>` +
        rise(x, [[84, 22], [98, 20], [112, 22]], WARM, 14) + [[60, 70], [140, 110], [60, 140]].map(([px, py], i) => x.on ? `<path class="${P}rise" style="animation-delay:-${i * .6}s" d="M${px} ${py} c-2 -5 2 -10 0 -15" stroke="${WARM}" stroke-opacity=".35" fill="none" stroke-width="1.2"/>` : "").join("");
      return scene(x, "concrete", [190, "concrete"], b);
    } }),

    base({ id: "curved-bar-towel-ladder", name: "Curved-bar towel ladder", colorLabel: "Finish", colors: ["#d4d8de", "#f2f1ee", "#26272b", "#b9bcc0", "#c9a457"], render(o) {
      const x = ctx(o), fillU = x.metal ? (x.c === "#c9a457" ? x.url("brass") : x.url("chrome")) : x.c;
      x.add("fold", lg(x.id("fold"), [[0, "#000", .2], [.3, "#000", 0], [.7, "#fff", .08], [1, "#000", .25]]));
      let bars = ""; for (let i = 0; i < 12; i++) { const y = i < 6 ? 44 + i * 9 : 116 + (i - 6) * 9; bars += `<path d="M70 ${y} Q100 ${y - 4} 130 ${y}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3.6" transform="translate(1.5 2.5)"/><path d="M70 ${y} Q100 ${y - 4} 130 ${y}" fill="none" stroke="${fillU}" stroke-width="3"/>`; }
      const rail = (X) => `<rect x="${X - 3}" y="38" width="6" height="128" rx="3" fill="#000" opacity=".35" transform="translate(2 3)"/><rect x="${X - 3}" y="38" width="6" height="128" rx="3" fill="${fillU}"/>`;
      const b = (x.on ? `<rect class="hda-bg" x="56" y="30" width="88" height="150" rx="30" fill="${x.url("warm")}" opacity="${(.15 + .25 * x.lv).toFixed(2)}"/>` : "") +
        bars + rail(70) + rail(130) + towel(84, 88, 32, 44, "#7aa7c7").replace(/url\(#__fold\)/g, x.url("fold")) +
        `<path d="M84 88 Q100 84 116 88" fill="none" stroke="${fillU}" stroke-width="3.6"/>` +
        `<path d="M130 160 Q140 170 150 172 L150 178" fill="none" stroke="#e8e8e6" stroke-width="2"/><rect x="146" y="176" width="10" height="9" rx="2" fill="#f1f1ef"/>` + led(x, 151, 180.5, 1, "#ff7a3c", x.on) +
        rise(x, [[80, 40], [100, 38], [120, 40]], WARM, 18);
      return scene(x, "tile", null, b);
    } }),
    base({ id: "freestand", name: "Freestanding rack", colorLabel: "Finish", colors: ["#d4d8de", "#26272b", "#c9a457", "#f2f1ee"], render(o) {
      const x = ctx(o), fillU = x.metal ? (x.c === "#c9a457" ? x.url("brass") : x.url("chrome")) : x.c;
      x.add("fold", lg(x.id("fold"), [[0, "#000", .2], [.3, "#000", 0], [.7, "#fff", .08], [1, "#000", .25]]));
      let bars = ""; for (let i = 0; i < 5; i++) { const y = 60 + i * 20; bars += `<rect x="62" y="${y}" width="76" height="3.6" rx="1.8" fill="${fillU}"/>`; }
      const leg = (X) => `<rect x="${X - 2.5}" y="50" width="5" height="120" rx="2.5" fill="${fillU}"/><path d="M${X - 16} 172 H${X + 16}" stroke="${fillU}" stroke-width="5" stroke-linecap="round"/>`;
      const b = contact(x, 100, 174, 56) + (x.on ? `<ellipse class="${P}breathe" cx="100" cy="110" rx="50" ry="60" fill="${x.url("warm")}" opacity="${(.15 + .25 * x.lv).toFixed(2)}"/>` : "") +
        bars + leg(62) + leg(138) + towel(74, 60, 50, 52, "#d9a6b5").replace(/url\(#__fold\)/g, x.url("fold")) +
        `<rect x="74" y="58.4" width="50" height="3.6" rx="1.8" fill="${fillU}"/>` +
        `<path d="M138 168 Q150 172 160 170" fill="none" stroke="#e8e8e6" stroke-width="2"/>` + led(x, 138, 150, 1.2, "#ff7a3c", x.on) +
        rise(x, [[72, 52], [100, 50], [128, 52]], WARM, 16);
      return scene(x, "sage", [174, "tile"], b);
    } }),

    base({ id: "capsule-diesel-heater", name: "Capsule diesel heater", colorLabel: "Panel", colors: ["#a9aeb5", "#c9ccd1", "#7d838b"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a); fin(x);
      let gr = ""; for (let i = 0; i < 5; i++) gr += `<path d="M30 ${103 + i * 4} H38" stroke="#5a5e66" stroke-width="1.2"/>`;
      const b = contact(x, 100, 146, 64) + drop(x, rr(36, 86, 128, 50, 20), 3, 5, .5) +
        `<rect x="36" y="86" width="128" height="50" rx="20" fill="#1c1d21"/><path d="M48 88 Q100 84 152 88" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.2"/>` +
        `<rect x="62" y="98" width="76" height="36" rx="5" fill="${x.url("bdv")}"/><path d="M64 99.5 H136" stroke="#fff" stroke-opacity=".5"/>` +
        `<rect x="90" y="104" width="22" height="9" rx="4.5" fill="${S(-.35)}"/><circle cx="96" cy="108.5" r="2.4" fill="#1c1d21"/><circle cx="106" cy="108.5" r="2.4" fill="#1c1d21"/>` +
        `<rect x="26" y="99" width="14" height="24" rx="5" fill="#141518"/>` + gr +
        `<path d="M164 104 H176 Q181 104 181 109 V117 Q181 122 176 122 H164 Z" fill="#141518"/><ellipse cx="181" cy="113" rx="3" ry="8" fill="#050506"/>` +
        `<path d="M92 136 V156 M106 136 V152" stroke="#8a8d92" stroke-width="3.4"/><circle cx="92" cy="158" r="3" fill="#333"/>` +
        (x.on ? `<ellipse class="${P}breathe" cx="186" cy="113" rx="10" ry="13" fill="${x.url("warm")}"/>` : "") + wisps(x, [[188, 106], [188, 113], [188, 120]], WARM, 14, "right") +
        wisps(x, [[24, 104], [24, 112], [24, 120]], "#d0d8e2", 12, "left");
      return scene(x, "dark", [146, "van"], b);
    } }),
    base({ id: "ribbed-top-diesel-heater", name: "Ribbed-top diesel heater", colors: ["#3a3c40", "#2a2b30", "#5a5f66"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      x.add("cyl", lg(x.id("cyl"), [[0, S(.35)], [.3, x.c], [.8, S(-.25)], [1, S(-.5)]], 0, 0, 0, 1));
      const loaf = "M42 138 V104 Q42 82 66 82 H134 Q158 82 158 104 V138 Z";
      let dim = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 14; c++) dim += `<circle cx="${f(58 + c * 6.4 + (r % 2) * 3.2)}" cy="${88 + r * 5}" r="1.2" fill="#000" opacity=".35"/><circle cx="${f(57.6 + c * 6.4 + (r % 2) * 3.2)}" cy="${87.6 + r * 5}" r=".6" fill="#fff" opacity=".18"/>`;
      let sp = ""; for (let i = 0; i < 6; i++) sp += `<path d="M38 116 L${f(38 + Math.cos(i * 1.047) * 9)} ${f(116 + Math.sin(i * 1.047) * 9)}" stroke="#5a5e66" stroke-width="1.2"/>`;
      const b = contact(x, 100, 146, 66) + drop(x, `<path d="${loaf}"/>`, 3, 5, .5) + `<path d="${loaf}" fill="${x.url("cyl")}"/>` + dim +
        `<path d="M48 104 Q48 88 66 87 M42 132 H158" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="1.2"/><rect x="40" y="136" width="120" height="4" rx="1" fill="${S(-.4)}"/>` +
        `<circle cx="38" cy="116" r="12" fill="${S(-.3)}"/><circle cx="38" cy="116" r="9" fill="#0d0e10"/>` + sp +
        `<rect x="158" y="106" width="14" height="20" rx="4" fill="${S(-.2)}"/><ellipse cx="172" cy="116" rx="3.5" ry="9" fill="#0b0c0e"/>` +
        led(x, 120, 128, 1.1, "#ff6a3c", x.on) +
        (x.on ? `<ellipse class="${P}breathe" cx="178" cy="116" rx="10" ry="14" fill="${x.url("warm")}"/>` : "") + wisps(x, [[180, 109], [180, 116], [180, 123]], WARM, 14, "right");
      return scene(x, "slate", [146, "van"], b);
    } }),
    base({ id: "portable-box-diesel-heater", name: "Portable box diesel heater", colors: ["#e8742a", "#f2f1ee", "#2a2b30", "#c8322b"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a); fin(x);
      const t = String(Math.round(18 + x.lv * 14));
      let sp = ""; for (let i = 0; i < 8; i++) sp += `<path transform="rotate(${i * 45} 82 120)" d="M82 120 q6 -4 4 -14" fill="none" stroke="#c9ccd1" stroke-width="1.4"/>`;
      const b = contact(x, 108, 166, 62) + `<path d="M150 92 L166 82 V150 L150 162 Z" fill="#1d1e22"/><path d="M54 92 L70 82 H166 L150 92 Z" fill="${S(.3)}"/>` +
        slab(x, 50, 92, 100, 70, 7) + `<path d="M74 82 V68 Q74 62 80 62 H146 Q152 62 152 68 V80" fill="none" stroke="#1d1e22" stroke-width="5" stroke-linecap="round"/>` +
        `<ellipse cx="136" cy="85" rx="7" ry="2.6" fill="#1d1e22"/>` +
        `<circle cx="82" cy="120" r="20" fill="#1d1e22"/><circle cx="82" cy="120" r="16" fill="#0b0c0e"/>` + `<g${x.on ? ` class="${P}spin" style="animation-duration:${x.dur(1.6, 1)}s"` : ""}>${sp}</g>` + `<circle cx="82" cy="120" r="4" fill="#3a3c42"/>` +
        `<rect x="110" y="100" width="32" height="18" rx="3" fill="#0b0d10"/>` + (x.on ? digits(x, 126, 109, 9, "#7fd3ff", t, { deg: 1 }) : "") +
        [0, 1, 2, 3].map((i) => `<rect x="${114 + i * 7}" y="126" width="3" height="26" rx="1.5" fill="#000" opacity=".35"/>`).join("") +
        `<path d="M54 160 V168 M146 160 V168" stroke="#1d1e22" stroke-width="5" stroke-linecap="round"/>` +
        (x.on ? `<circle class="${P}breathe" cx="82" cy="120" r="24" fill="${x.url("warm")}"/>` : "") + wisps(x, [[60, 112], [60, 120], [60, 128]], WARM, 16, "left");
      return scene(x, "ply", [166, "concrete"], b);
    } }),

    base({ id: "pumpstation", name: "Manifold + pump station", colorLabel: "Pump", colors: ["#2f8f4e", "#c8322b", "#2f6fb5", "#1f2023"],
      parts: [1, 2, 3, 4, 5, 6].map((i) => ({ id: "z" + i, name: "Zone " + i })), render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a), zone = x.mf || !!o.parts;
      if (zone) x.on = x.zon(6);
      let loops = ""; for (let i = 0; i < 6; i++) { const X = 70 + i * 16, zo = x.part("z" + (i + 1));
        loops += `<rect x="${X - 2}" y="64" width="4" height="12" fill="${x.url("brass")}"/><rect x="${X - 3.5}" y="52" width="7" height="12" rx="2" fill="#e8f0f6" opacity=".85"/>` +
          `<rect x="${X - 1.5}" y="${f(54 + (zo ? 8 * (1 - x.lv) : 8))}" width="3" height="2.4" fill="#c8322b"${zo ? ` class="${P}bob" style="animation-delay:-${i * .3}s"` : ""}/>` +
          `<circle cx="${X}" cy="49" r="3.6" fill="#c8322b"/>` + `<rect x="${X - 2}" y="108" width="4" height="12" fill="${x.url("brass")}"/><circle cx="${X}" cy="124" r="3.6" fill="#2f6fb5"/>` +
          `<path d="M${X} 76 V96 Q${X} 104 ${X + 3} 108" fill="none" stroke="#e46a4c" stroke-width="3.2"/>` +
          `<path d="M${X} 128 V176" stroke="${zo ? "#e46a4c" : "#c9b9b0"}" stroke-width="3.2" opacity=".85"/>` +
          (zone && zo ? `<rect class="${P}breathe" x="${X - 8}" y="128" width="16" height="50" fill="${x.url("warm")}" opacity=".3"/>` : ""); }
      const b = drop(x, rr(56, 60, 112, 8, 2), 2, 4, .45) + `<rect x="56" y="64" width="112" height="8" rx="3" fill="${x.url("brass")}"/><rect x="56" y="104" width="112" height="8" rx="3" fill="${x.url("brass")}"/>` + loops +
        `<path d="M40 68 H58 M40 108 H58" stroke="${x.url("copper")}" stroke-width="6"/>` +
        `<rect x="28" y="76" width="22" height="28" rx="4" fill="${S(0)}"/><rect x="28" y="76" width="22" height="28" rx="4" fill="${x.url("gloss")}"/><circle cx="39" cy="90" r="7" fill="${S(-.35)}"/>` +
        fan(x, 39, 90, 5, S(.3), 4) + led(x, 46, 80, 1, "#7ee08a", x.on) + `<rect x="34" y="40" width="10" height="28" rx="3" fill="${x.url("chrome")}"/><circle cx="39" cy="40" r="6" fill="#e9e9e6"/><path d="M39 36 V40" stroke="#333" stroke-width="1.4"/>` +
        (x.on && !zone ? `<rect class="${P}breathe" x="56" y="128" width="112" height="50" fill="${x.url("warm")}" opacity=".25"/>` : "");
      return scene(x, "ply", null, b);
    } }),
    base({ id: "elecmat", name: "Electric mat + stat", colors: ["#f2f1ee", "#2a2b30", "#c9ccd1"],
      parts: [{ id: "heat", name: "Heat", type: "switch" }, { id: "temp", name: "Floor temperature", type: "value", unit: "°F", min: 50, max: 95, def: 78 }], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a), stat = x.on; fin(x);
      if (x.mf || o.parts) x.on = x.part("heat");
      const tv = o.pval && o.pval.temp != null && o.pval.temp !== "" && isFinite(+o.pval.temp) ? Math.round(+o.pval.temp) : null;
      let cable = "M40 150"; for (let i = 0; i < 7; i++) { const X = 40 + i * 18; cable += ` L${X} ${i % 2 ? 150 : 184} L${X + 18} ${i % 2 ? 150 : 184}`; }
      const t = tv != null ? String(tv) : x.mf ? "--" : String(Math.round(70 + x.lv * 14));
      const b = `<rect x="22" y="146" width="156" height="42" fill="#d8d2c4" opacity=".9"/><path d="M22 146 L178 146 L178 188 L22 188 Z" fill="none" stroke="#000" stroke-opacity=".15"/>` +
        `<rect x="30" y="148" width="140" height="38" fill="#e9e6df" opacity=".5"/>` +
        `<path d="${cable}" fill="none" stroke="${x.on ? "#ff7a3c" : "#b3542c"}" stroke-width="2.2" stroke-linejoin="round"/>` +
        (x.on ? `<path class="${P}breathe" d="${cable}" fill="none" stroke="#ffb070" stroke-width="5" opacity=".35" filter="${x.url("bs")}" stroke-linejoin="round"/>` : "") +
        `<rect x="22" y="146" width="56" height="42" fill="#9a968d"/>` + [0, 1].map((i) => `<path d="M22 ${160 + i * 14} H78 M${40 + i * 18} 146 V188" stroke="#6f6b64"/>`).join("") +
        slab(x, 74, 46, 52, 70, 8) + `<rect x="80" y="52" width="40" height="44" rx="3" fill="${x.url("glass")}"/>` +
        (x.on || (x.mf && stat && tv != null) ? digits(x, 100, 70, 14, "#ffb070", t, { deg: 1 }) : digits(x, 100, 70, 14, "#555b66", t, { deg: 1 })) +
        `<path d="M86 86 c2 -3 4 3 6 0 c2 -3 4 3 6 0 c2 -3 4 3 6 0 c2 -3 4 3 6 0" fill="none" stroke="${x.on ? "#ff8a3c" : "#555b66"}" stroke-width="1.2"/>` +
        glossR(x, 80, 52, 40, 44, 3) + `<path d="M100 116 V146" stroke="#cfcfcd" stroke-width="2" stroke-dasharray="3 2"/>`;
      return scene(x, "denim", null, b);
    } }),
    base({ id: "pexloops", name: "PEX floor loops", colorLabel: "Pipe", colors: ["#e4572e", "#f0a020", "#f2f1ee", "#2f6fb5"],
      parts: [1, 2, 3].map((i) => ({ id: "z" + i, name: "Zone " + i })), render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a), zone = x.mf || !!o.parts;
      let dots = ""; for (let r = 0; r < 9; r++) for (let c = 0; c < 12; c++) dots += `<circle cx="${30 + c * 13 + (r % 2) * 6}" cy="${44 + r * 15}" r="3.4" fill="#f2f3f5" opacity=".14"/>`;
      let d = "M24 40"; for (let i = 0; i < 6; i++) { const y = 46 + i * 22; d += ` H${i % 2 ? 40 : 166} Q${i % 2 ? 28 : 178} ${y + 11} ${i % 2 ? 40 : 166} ${y + 22}`; }
      const b = `<rect x="16" y="30" width="168" height="152" rx="4" fill="#3b4b70"/>` + dots +
        `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="6" transform="translate(1 2)"/><path d="${d}" fill="none" stroke="${x.c}" stroke-width="5"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" transform="translate(-1 -1)"/>` +
        (zone ? [0, 1, 2].map((z) => { if (!x.part("z" + (z + 1))) return "";
          let zd = ""; for (let i = 2 * z; i < 2 * z + 2; i++) { const y = 46 + i * 22, x0 = i ? (i - 1) % 2 ? 40 : 166 : 24;
            zd += `M${x0} ${i ? y : 40} H${i % 2 ? 40 : 166} Q${i % 2 ? 28 : 178} ${y + 11} ${i % 2 ? 40 : 166} ${y + 22}`; }
          const y0 = z ? 46 + 2 * z * 22 - 4 : 30, y1 = z === 2 ? 182 : 46 + (2 * z + 2) * 22 - 4;
          return `<path class="${P}pulse" d="${zd}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="3 14"/><rect class="${P}breathe" x="16" y="${y0}" width="168" height="${y1 - y0}" fill="${x.url("warm")}" opacity=".3"/>`; }).join("")
        : x.on ? `<path class="${P}pulse" d="${d}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="3 14"/><rect class="${P}breathe" x="16" y="30" width="168" height="152" fill="${x.url("warm")}" opacity=".3"/>` : "") +
        `<rect x="16" y="30" width="168" height="152" rx="4" fill="none" stroke="#000" stroke-opacity=".3"/>`;
      return scene(x, "concrete", null, b);
    } }),

    base({ id: "upright-hrv-dark-panel", name: "Upright HRV, dark panel", parts: [{ id: "z1", name: "Living" }, { id: "z2", name: "Bedrooms" }, { id: "z3", name: "Bath" }], colors: ["#f2f1ee", "#c9ccd1", "#2a2b30"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      const zone = (X, k) => { const open = x.part(k);
        return `<rect x="${X - 6}" y="8" width="12" height="44" fill="${x.url("chrome")}" opacity=".9"/><rect x="${X - 8}" y="26" width="16" height="11" rx="2" fill="#2a2b30"/>` +
          `<path d="${open ? `M${X} 28 V35` : `M${X - 5} 31.5 H${X + 5}`}" stroke="#e6e8eb" stroke-width="2.2" stroke-linecap="round"/>` + led(x, X + 5.5, 28.5, .9, open ? "#7ee08a" : "#ff6a3c", true) +
          (x.on && open ? `<circle class="${P}up" style="animation-duration:${x.dur(2, 1.2)}s" cx="${X}" cy="20" r="2" fill="${ICE}"/>` : ""); };
      const port = (X) => `<rect x="${X - 9}" y="52" width="18" height="12" rx="2" fill="#1c1d21"/><ellipse cx="${X}" cy="52" rx="9" ry="2.6" fill="#2c2e33"/>`;
      const b = contact(x, 100, 176, 50) + zone(64, "z1") + zone(88, "z2") + zone(112, "z3") + `<rect x="130" y="8" width="12" height="44" fill="${x.url("chrome")}" opacity=".9"/>` +
        port(64) + port(88) + port(112) + port(136) + slab(x, 50, 62, 100, 112, 6, 1) +
        `<rect x="51" y="63" width="98" height="46" rx="5" fill="#1d1f24"/><rect x="51" y="63" width="98" height="46" rx="5" fill="${x.url("gloss")}"/>` +
        (x.on ? digits(x, 100, 84, 9, "#dfe9f2", String(1 + Math.round(x.lv * 2))) : "") + led(x, 132, 100, 1, "#7ee08a", x.on) +
        `<path d="M56 109 H144" stroke="#000" stroke-opacity=".2"/>`;
      return scene(x, "plaster", [176, "concrete"], b);
    } }),
    base({ id: "hanging-gray-hrv", name: "Hanging gray HRV", parts: [{ id: "z1", name: "Zone 1" }, { id: "z2", name: "Zone 2" }, { id: "z3", name: "Zone 3" }], colors: ["#9aa0a8", "#f2f1ee", "#2a2b30"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      const branch = (X, k) => { const open = x.part(k);
        return `<path d="M${X} 120 V176" stroke="#b9bec5" stroke-width="12"/><path d="M${X} 120 V176" stroke="#fff" stroke-opacity=".25" stroke-width="2" transform="translate(-3 0)"/>` +
          `<rect x="${X - 8}" y="140" width="16" height="10" rx="2" fill="#2a2b30"/><path d="${open ? `M${X} 141.5 V148.5` : `M${X - 5} 145 H${X + 5}`}" stroke="#e6e8eb" stroke-width="2.2" stroke-linecap="round"/>` +
          led(x, X + 5, 142, 1, open ? "#7ee08a" : "#ff6a3c", true) + (x.on && open ? `<circle class="${P}down" style="animation-duration:${x.dur(2, 1.2)}s" cx="${X}" cy="158" r="2" fill="${ICE}"/>` : ""); };
      const b = `<g class="hda-bg">${[30, 70, 110, 150].map((X) => `<rect x="${X}" y="8" width="10" height="34" fill="#8a6440"/>`).join("")}</g>` +
        `<path d="M70 42 V54 M130 42 V54" stroke="#888" stroke-width="1.4"/>` +
        `<path d="M20 74 H48 M152 74 H186 M20 96 H48" stroke="#b9bec5" stroke-width="12"/>` + `<path d="M60 112 H150 V120 H60 Z" fill="#b9bec5"/>` +
        branch(76, "z1") + branch(110, "z2") + branch(144, "z3") + slab(x, 46, 54, 108, 58, 4) +
        `<path d="M52 60 H148 V106 H52 Z" fill="none" stroke="#000" stroke-opacity=".12"/>` + [58, 142].map((X) => `<rect x="${X - 3}" y="78" width="6" height="10" rx="1.5" fill="#2a2b30"/>`).join("") +
        led(x, 100, 66, 1.4, "#7ee08a", x.on) + fan(x, 100, 86, 9, S(-.35), 5) + [[40, 68], [40, 90], [152, 68]].map(([X, Y]) => `<rect x="${X}" y="${Y}" width="8" height="12" rx="1.5" fill="#1c1d21"/>`).join("");
      return scene(x, "ply", null, b);
    } }),
    base({ id: "ceiling-erv-two-ducts", name: "Ceiling ERV, two ducts", parts: [{ id: "z1", name: "Supply A" }, { id: "z2", name: "Supply B" }], colors: ["#f2f1ee", "#c9ccd1"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      let gr = ""; for (let i = 0; i < 9; i++) gr += `<rect x="${66 + i * 9}" y="82" width="5" height="10" rx="1" fill="#000" opacity=".22"/>`;
      const duct = (y, k, i) => { const open = x.part(k);
        return `<path d="M60 ${y} H14" stroke="#c9ccd1" stroke-width="10"/><path d="M60 ${y - 3} H14" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>` +
          `<rect x="52" y="${y - 6}" width="10" height="12" rx="2" fill="#1c1d21"/>` + `<rect x="26" y="${y - 7}" width="14" height="14" rx="2" fill="#2a2b30"/>` +
          `<path d="${open ? `M33 ${y - 4} V${y + 4}` : `M29 ${y} H37`}" stroke="#e6e8eb" stroke-width="2" stroke-linecap="round"/>` + led(x, 38, y - 4, .9, open ? "#7ee08a" : "#ff6a3c", true) +
          (x.on && open ? `<circle class="${P}goL" style="animation-delay:-${i * .5}s" cx="22" cy="${y}" r="1.8" fill="${ICE}"/>` : ""); };
      const b = `<g class="hda-bg"><rect x="8" y="8" width="184" height="70" fill="#2a2630" opacity=".55"/><rect x="8" y="78" width="184" height="6" fill="#e9e6df" opacity=".85"/></g>` +
        duct(46, "z1", 0) + duct(64, "z2", 1) + slab(x, 60, 34, 96, 44, 3) + `<path d="M62 46 H154" stroke="#000" stroke-opacity=".08"/>` +
        drop(x, rr(56, 78, 104, 18, 2), 2, 3, .45) + `<rect x="56" y="78" width="104" height="18" rx="2" fill="${x.c}"/><rect x="56" y="78" width="104" height="18" rx="2" fill="${x.url("gloss")}"/>` + gr +
        led(x, 152, 87, 1, "#7ee08a", x.on) + wisps(x, [[84, 100], [108, 102], [132, 100]], "#d0d8e2", 22);
      return scene(x, "linen", null, b);
    } }),
    base({ id: "registers", name: "Zone ceiling registers", parts: [{ id: "z1", name: "Kitchen" }, { id: "z2", name: "Dining" }, { id: "z3", name: "Office" }], colorLabel: "Grille", colors: ["#f2f1ee", "#2a2b30", "#c9a457", "#b9bcc0"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      const reg = (cx, k) => { const open = x.part(k); let s = drop(x, rr(cx - 22, 60, 44, 44, 3), 2, 4, .45) + `<rect x="${cx - 22}" y="60" width="44" height="44" rx="3" fill="${x.c}"/><rect x="${cx - 22}" y="60" width="44" height="44" rx="3" fill="${x.url("gloss")}"/>`;
        for (let i = 0; i < 4; i++) { const m = 6 + i * 4.4; s += `<rect x="${cx - 22 + m}" y="${60 + m}" width="${f(44 - 2 * m)}" height="${f(44 - 2 * m)}" rx="1" fill="none" stroke="${S(-.3)}" stroke-width="1.6"/>`; }
        s += `<rect x="${cx - 6}" y="76" width="12" height="12" fill="${open ? "#0d0f12" : S(-.15)}"/>` + led(x, cx + 17, 65, 1, open ? "#7ee08a" : "#ff6a3c", true) +
          wisps({ on: x.on && open, dur: x.dur }, [[cx - 12, 108], [cx, 110], [cx + 12, 108]], ICE, 28);
        return s; };
      const b = `<g class="hda-bg"><rect x="8" y="8" width="184" height="110" fill="#e6e2da" opacity=".18"/><path d="M8 118 H192" stroke="#fff" stroke-opacity=".2"/></g>` + reg(46, "z1") + reg(100, "z2") + reg(154, "z3");
      return scene(x, "plaster", null, b);
    } }),

    base({ id: "loop-purifier-heater", name: "Loop purifier heater", options: [{ id: "mode", name: "Mode", values: [["cool", "Cool"], ["heat", "Heat"]] }], colors: ["#f2f1ee", "#2a2b30", "#c9ccd1", "#c9a457"], colorLabel: "Trim",
      parts: [{ id: "fan", name: "Fan", type: "switch" }, { id: "mode", name: "Mode", type: "stage", values: [["cool", "Cool"], ["heat", "Heat"]], def: "cool" }], render(o) {
      const x = ctx(o), st = o.pval && o.pval.mode != null ? String(o.pval.mode) : null, heat = (st || x.opt.mode) === "heat", S = (a) => H.shade(x.c, a);
      if (x.mf || o.parts) x.on = x.part("fan");
      x.add("loop", lg(x.id("loop"), [[0, "#bfc4cb"], [.3, "#f5f6f8"], [.6, "#aeb4bc"], [1, "#e9ecef"]]));
      x.add("base", lg(x.id("base"), [[0, "#6f747b"], [.35, "#d9dce0"], [.7, "#9aa0a8"], [1, "#5f646b"]]));
      let mesh = ""; for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) mesh += `<circle cx="${80 + c * 5 + (r % 2) * 2.5}" cy="${128 + r * 6}" r="1" fill="#000" opacity=".35"/>`;
      const col = heat ? WARM : ICE;
      const b = contact(x, 100, 176, 32) + (x.on ? `<ellipse class="${P}breathe" cx="100" cy="80" rx="46" ry="54" fill="${x.url(heat ? "warm" : "cool")}" opacity=".35"/>` : "") +
        `<path d="M70 118 Q70 112 100 112 Q130 112 130 118 L128 172 Q128 176 100 176 Q72 176 72 172 Z" fill="${x.url("base")}"/>` + mesh +
        `<rect x="70" y="112" width="60" height="6" rx="3" fill="${x.c}"/><rect x="72" y="166" width="56" height="8" rx="4" fill="${S(-.2)}"/>` +
        `<path d="M86 112 V66 Q86 40 100 40 Q114 40 114 66 V112" fill="none" stroke="${x.url("loop")}" stroke-width="10"/>` +
        `<path d="M86 112 V66 Q86 40 100 40 Q114 40 114 66 V112" fill="none" stroke="${heat && x.on ? "#ff8a3c" : "#000"}" stroke-opacity="${heat && x.on ? .8 : .2}" stroke-width="1.2" transform="translate(-4 0)"/>` +
        led(x, 100, 158, 1.2, heat ? "#ff8a3c" : "#8fd8ff", x.on) + wisps(x, [[118, 60], [118, 80], [118, 100]], col, 34, "right") + wisps(x, [[82, 60], [82, 80], [82, 100]], col, 26, "left");
      return scene(x, "greige", [176, "wood"], b);
    } }),
    base({ id: "big-dome-purifier", name: "Big dome purifier", colors: ["#2f3a6b", "#b89a5a", "#c9ccd1", "#2a2b30"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      x.add("bqb", lg(x.id("bqb"), [[0, S(-.45)], [.3, S(.25)], [.6, x.c], [1, S(-.5)]]));
      x.add("bqh", lg(x.id("bqh"), [[0, "#7d838b"], [.3, "#eef0f2"], [.6, "#b9bec5"], [1, "#6f757d"]]));
      let mesh = ""; for (let r = 0; r < 13; r++) for (let c = 0; c < 10; c++) mesh += `<circle cx="${f(71 + c * 6.2 + (r % 2) * 3.1)}" cy="${102 + r * 5.4}" r="1.1" fill="#000" opacity=".35"/>`;
      const b = contact(x, 100, 176, 38) + (x.on ? `<ellipse class="${P}breathe" cx="112" cy="46" rx="34" ry="22" fill="${x.url("cool")}" opacity=".55"/>` : "") +
        `<rect x="66" y="96" width="68" height="80" rx="6" fill="${x.url("bqb")}"/>` + mesh +
        `<rect x="97" y="104" width="6" height="40" rx="3" fill="${x.url("brass")}"/><rect x="68" y="170" width="64" height="6" rx="3" fill="${S(-.35)}"/>` +
        `<path d="M64 100 Q60 58 102 52 Q140 56 136 100 Z" fill="${x.url("bqh")}"/><path d="M68 98 H132" stroke="#000" stroke-opacity=".25"/>` +
        `<ellipse cx="108" cy="66" rx="21" ry="12" transform="rotate(-18 108 66)" fill="#15171b"/><ellipse cx="108" cy="66" rx="21" ry="12" transform="rotate(-18 108 66)" fill="none" stroke="${x.url("brass")}" stroke-width="3"/>` +
        `<path d="M72 80 Q74 62 92 56" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round"/>` +
        (x.on ? [0, 1, 2, 3].map((i) => `<path class="${P}up" style="animation-delay:-${(i * .4).toFixed(1)}s;animation-duration:${x.dur(2.4, 1.2)}s" d="M${98 + i * 8} 58 q4 -10 12 -20" fill="none" stroke="${ICE}" stroke-width="1.6" stroke-linecap="round"/>`).join("") : "");
      return scene(x, "slate", [176, "concrete"], b);
    } }),
  ];

  const HVO = [{ id: "mode", name: "Mode", values: [["cool", "Cool"], ["off", "Off"], ["heat", "Heat"], ["auto", "Auto"], ["dry", "Dry"], ["fan", "Fan"], ["eco", "Eco"]] },
    { id: "preset", name: "Preset", values: [["none", "None"], ["boost", "Boost"], ["comfort", "Comfort"], ["sleep", "Sleep"], ["away", "Away"]], when: { opt: "mode", is: ["cool", "heat", "auto", "dry", "fan", "eco"] } },
    { id: "swing", name: "Swing", values: [["off", "Off"], ["vertical", "Vertical"], ["horizontal", "Horizontal"], ["both", "Both"]], when: { opt: "mode", is: ["cool", "heat", "auto", "dry", "fan", "eco"] } }];
  icons.forEach((ic) => { if (ic.id === "boxy-wall-split" || ic.id === "faceted-wall-split" || ic.id === "mirror-glass-wall-split") ic.options = HVO; });

  (window.HDA = window.HDA || []).push({
    id: "air2",
    tab: "More heating & cooling",
    group: "Air",
    kind: "device",
    levelLabel: "Power",
    onWord: "Running", offWord: "Off",
    intro: "Wall-unit ACs, radiators, towel warmers, diesel heaters, underfloor heating, zoned ventilation and loop purifiers. On runs it; the slider sets fan speed or heat. The wall units add Mode, Preset and Swing menus (air color, indicator glyphs, swinging louvers). Ventilation units switch each damper zone on its own.",
    css: `.hda-air2-breathe,.hda-air2-pulse,.hda-air2-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-air2-breathe{animation:hda-air2-breathe 4s ease-in-out infinite}
@keyframes hda-air2-breathe{50%{opacity:.4}}
.hda-anim .hda-air2-pulse{animation:hda-air2-pulse 2.6s ease-in-out infinite}
@keyframes hda-air2-pulse{50%{opacity:.55}}
.hda-anim .hda-air2-spin{animation:hda-air2-spin 1s linear infinite}
@keyframes hda-air2-spin{to{transform:rotate(360deg)}}
.hda-air2-fall,.hda-air2-goR,.hda-air2-goL,.hda-air2-rise,.hda-air2-up,.hda-air2-down{opacity:.55}
.hda-anim .hda-air2-fall{animation:hda-air2-fall 2s ease-in infinite}
@keyframes hda-air2-fall{0%{opacity:0;transform:translate(0,-4px)}30%{opacity:.8}100%{opacity:0;transform:translate(0,10px)}}
.hda-anim .hda-air2-goR{animation:hda-air2-goR 2s ease-out infinite}
@keyframes hda-air2-goR{0%{opacity:0;transform:translate(-4px,0)}30%{opacity:.8}100%{opacity:0;transform:translate(10px,0)}}
.hda-anim .hda-air2-goL{animation:hda-air2-goL 2s ease-out infinite}
@keyframes hda-air2-goL{0%{opacity:0;transform:translate(4px,0)}30%{opacity:.8}100%{opacity:0;transform:translate(-10px,0)}}
.hda-anim .hda-air2-rise{animation:hda-air2-rise 2.4s ease-out infinite}
@keyframes hda-air2-rise{0%{opacity:0;transform:translate(0,4px)}30%{opacity:.8}100%{opacity:0;transform:translate(0,-8px)}}
.hda-anim .hda-air2-up{animation:hda-air2-up 2s linear infinite}
@keyframes hda-air2-up{0%{opacity:0;transform:translate(0,8px)}30%{opacity:.9}100%{opacity:0;transform:translate(0,-14px)}}
.hda-anim .hda-air2-down{animation:hda-air2-down 2s linear infinite}
@keyframes hda-air2-down{0%{opacity:0;transform:translate(0,-6px)}30%{opacity:.9}100%{opacity:0;transform:translate(0,14px)}}
.hda-anim .hda-air2-bob{animation:hda-air2-bob 1.6s ease-in-out infinite}
@keyframes hda-air2-bob{50%{transform:translate(0,-2px)}}
.hda-air2-swv{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-air2-swv{animation:hda-air2-swv 6s ease-in-out infinite}
@keyframes hda-air2-swv{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.45)}}
.hda-air2-swh{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-air2-swh{animation:hda-air2-swh 5s ease-in-out infinite}
@keyframes hda-air2-swh{0%,100%{transform:skewX(-14deg)}50%{transform:skewX(14deg)}}
.hda-air2-swx,.hda-air2-swy{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-air2-swx{animation:hda-air2-swx 5s ease-in-out infinite}
@keyframes hda-air2-swx{0%,100%{transform:skewX(-12deg)}50%{transform:skewX(12deg)}}
.hda-anim .hda-air2-swy{animation:hda-air2-swy 6s ease-in-out infinite}
@keyframes hda-air2-swy{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.7)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-air2-swv,.hda-anim .hda-air2-swh,.hda-anim .hda-air2-swx,.hda-anim .hda-air2-swy,.hda-anim .hda-air2-breathe,.hda-anim .hda-air2-pulse,.hda-anim .hda-air2-spin,.hda-anim .hda-air2-fall,.hda-anim .hda-air2-goR,.hda-anim .hda-air2-goL,.hda-anim .hda-air2-rise,.hda-anim .hda-air2-up,.hda-anim .hda-air2-down,.hda-anim .hda-air2-bob{animation:none}}`,
    icons,
  });
})();
