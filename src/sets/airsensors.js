(function () {
  const H = window.HDAH, P = "hda-airsensors-";
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

  const FIN = { white: "#f3f3f0", ivory: "#ece6d6", gray: "#b9bcc0", silver: "#c9cdd3", graphite: "#55595f", black: "#25262a", sand: "#d9cdb5", sage: "#a9b8a4", steel: "#b9bec6" };
  const METAL = [FIN.steel, FIN.silver];
  const sw = (s) => s.split(" ").map((k) => FIN[k]);
  function ctx(o) {
    const c = (o.color || FIN.white).toLowerCase(), on = !!o.on, lv = o.level == null ? .8 : Math.max(0, Math.min(1, o.level));
    const q = lv >= .67 ? "#37d67a" : lv >= .4 ? "#ffd43b" : lv >= .2 ? "#ff922b" : "#ff4d4d";
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    const x = { c, on, lv, q, id, url, defs: [], have: {}, metal: METAL.indexOf(c) >= 0, hot: H.mix(q, "#ffffff", .45),
      dk: H.hx(c).reduce((a, b) => a + b, 0) < 300,
      pm: String(Math.round(3 + (1 - lv) * 120)), co2: String(Math.round((420 + (1 - lv) * 1580) / 10) * 10),
      score: String(Math.round(lv * 100)), radon: ((1 - lv) * 6 + .2).toFixed(1), hum: String(Math.round(62 - lv * 20)), temp: "71",
      band: lv >= .67 ? 0 : lv >= .4 ? 1 : 2 };
    x.add = (k, s) => { if (!x.have[k]) { x.have[k] = 1; x.defs.push(s); } };
    return x;
  }

  function surface(x, kind) {
    if (kind === "desk") return `<rect x="8" y="150" width="184" height="42" fill="${x.url("desk")}"/><path d="M8 150.6 H192" stroke="#f2d3ae" stroke-opacity=".55"/>` +
      [0, 1, 2, 3, 4].map((i) => `<path d="M8 ${158 + i * 7} C60 ${157 + i * 7} 120 ${160 + i * 7} 192 ${158 + i * 7}" fill="none" stroke="#2a1a0c" stroke-opacity=".18" stroke-width=".8"/>`).join("");
    if (kind === "shelf") return `<g transform="translate(0 6)" opacity=".5" filter="${x.url("bl")}"><rect x="14" y="146" width="172" height="12"/></g><rect x="14" y="146" width="172" height="11" fill="${x.url("shelf")}"/><path d="M14 146.6 H186" stroke="#fff" stroke-opacity=".5"/><path d="M40 157 v12 l6 -12 Z M154 157 v12 l6 -12 Z" fill="#26262a"/>`;
    return "";
  }
  function scene(x, wall, surf, body, sc) {
    sc = sc || 1; const w = WALL[wall] || WALL.plaster, g = x.q;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>
${lg(x.id("wallg"), [[0, w[0]], [1, w[1]]], 0, 0, 0, 1)}
<clipPath id="${x.id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(x.id("vig"), [[0, "#000", 0], [.6, "#000", .06], [1, "#000", .5]], .5, .46, .76)}
${rg(x.id("halo"), [[0, g, .8], [.4, g, .28], [1, g, 0]])}
${rg(x.id("glass"), [[0, "#2a2d36"], [.6, "#121319"], [1, "#050508"]], .35, .25, .9)}
${lg(x.id("gloss"), [[0, "#fff", .22], [.45, "#fff", .04], [.46, "#fff", 0], [1, "#fff", 0]], 0, 0, .6, 1)}
${lg(x.id("lcd"), x.on ? [[0, "#d3d8cc"], [1, "#b4baad"]] : [[0, "#a7ab9f"], [1, "#8d9186"]], 0, 0, 0, 1)}
${lg(x.id("eink"), [[0, "#e6e6df"], [1, "#cfd0c8"]], 0, 0, 0, 1)}
${lg(x.id("desk"), [[0, "#8a6040"], [1, "#4f3420"]], 0, 0, 0, 1)}
${lg(x.id("shelf"), [[0, "#b08a62"], [.4, "#8a6644"], [1, "#563c24"]], 0, 0, 0, 1)}
<filter id="${x.id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="${x.id("bs")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>
${x.defs.join("")}</defs>
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(wall)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/>${surface(x, surf)}</g></g>
<g clip-path="${x.url("wc")}">
<g transform="translate(100 100) scale(${sc}) translate(-100 -100)">${body}</g></g>
<rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></svg>`;
  }

  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${a || .5}" filter="${x.url("bl")}">${shape}</g>`;
  const rr = (X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const glow = (x, cx, cy, r, op) => x.on ? `<circle class="${P}breathe" cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("halo")}" opacity="${op || .45}"/>` : "";
  const contact = (x, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .12)}" fill="#000" opacity=".55" filter="${x.url("bs")}"/>`;
  function slab(x, X, Y, W, Hh, r, o2) {
    o2 = o2 || {}; fin(x);
    return (o2.noDrop ? "" : drop(x, rr(X, Y, W, Hh, r), 3, 6, .55)) + `<rect x="${f(X - .6)}" y="${f(Y - .6)}" width="${f(W + 1.2)}" height="${f(Hh + 1.2)}" rx="${r + .5}" fill="#000" opacity=".3"/>` +
      `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("edge")}"/>` +
      `<rect x="${f(X + 1.2)}" y="${f(Y + 1)}" width="${f(W - 2.4)}" height="${f(Hh - 2.6)}" rx="${Math.max(r - 1, 1)}" fill="${x.url(o2.v ? "bdv" : "bd")}"/>` +
      brushR(x, X + 1, Y + 1, W - 2, Hh - 3) + hl(`M${f(X + r)} ${f(Y + 1.4)} H${f(X + W - r)}`, x.dk ? .25 : .85, .8);
  }
  const screen = (x, X, Y, W, Hh, r) => `<rect x="${f(X - .8)}" y="${f(Y - .8)}" width="${f(W + 1.6)}" height="${f(Hh + 1.6)}" rx="${r + .6}" fill="#000" opacity=".55"/><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("glass")}"/>`;
  const glossR = (x, X, Y, W, Hh, r) => `<rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url("gloss")}"/>`;
  const panel = (x, X, Y, W, Hh, r, fill) => `<rect x="${f(X - 1)}" y="${f(Y - 1)}" width="${f(W + 2)}" height="${f(Hh + 2)}" rx="${r + 1}" fill="#000" opacity=".4"/><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(Hh)}" rx="${r}" fill="${x.url(fill)}"/><path d="M${f(X + 1)} ${f(Y + 1.2)} H${f(X + W - 1)}" stroke="#000" stroke-opacity=".22" stroke-width="1.3"/>`;
  const led = (x, cx, cy, r, col) => x.on ? `<g class="${P}pulse"><circle cx="${cx}" cy="${cy}" r="${f(r * 3.2)}" fill="${x.url("halo")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${col || x.hot}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .35)}" fill="#fff" opacity=".7"/></g>` : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#2c2e33" opacity=".7"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .35)}" fill="#fff" opacity=".3"/>`;

  function digits(x, cx, cy, h, col, o2) {
    o2 = o2 || {}; const str = o2.str, w = h * .5, t = Math.max(.7, h * .13), sp = h * .22;
    const unit = o2.unit || "", uw = unit === "pct" ? h * .36 : unit ? h * .22 : 0;
    let tot = 0; for (const ch of str) tot += ch === "." ? t * 1.6 : w + sp; tot -= sp; if (uw) tot += sp + uw;
    let ox = cx - tot / 2; const oy = cy - h / 2; let s = "";
    for (const ch of str) {
      if (ch === ".") { s += `<rect x="${f(ox - sp * .55)}" y="${f(oy + h - t * .6)}" width="${f(t * 1.4)}" height="${f(t * 1.4)}" fill="${col}"/>`; ox += t * 1.4; continue; }
      s += digit(ch, ox, oy, w, h, t, col, o2.ghost); ox += w + sp;
    }
    if (unit === "deg") s += `<circle cx="${f(ox + uw / 2)}" cy="${f(oy + uw / 2)}" r="${f(uw * .32)}" fill="none" stroke="${col}" stroke-width="${f(t * .6)}"/>`;
    if (unit === "pct") s += `<circle cx="${f(ox + uw * .22)}" cy="${f(oy + h * .2)}" r="${f(h * .08)}" fill="none" stroke="${col}" stroke-width="${f(t * .5)}"/><circle cx="${f(ox + uw * .78)}" cy="${f(oy + h * .8)}" r="${f(h * .08)}" fill="none" stroke="${col}" stroke-width="${f(t * .5)}"/><path d="M${f(ox + uw * .9)} ${f(oy + h * .08)} L${f(ox + uw * .1)} ${f(oy + h * .92)}" stroke="${col}" stroke-width="${f(t * .5)}" stroke-linecap="round"/>`;
    const k = (cy * .07).toFixed(2), g = `<g transform="translate(${k} 0) skewX(-4)">${s}</g>`;
    return (o2.glow && x.on ? `<g opacity=".7" filter="${x.url("bs")}">${g}</g>` : "") + g;
  }
  const FONT = { 0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111", 4: "101101111001001", 5: "111100111001111", 6: "111100111101111", 7: "111001010010010", 8: "111101111101111", 9: "111101111001111", C: "111100100100111", O: "111101101101111" };
  function dots(cx, cy, p, str, col, dim) {
    const n = str.length, W = n * 3 * p + (n - 1) * p; let ox = cx - W / 2 + p / 2, s = "";
    for (const ch of str) { const b = FONT[ch] || "";
      for (let i = 0; i < 15; i++) { const lit = b[i] === "1", X = ox + (i % 3) * p, Y = cy - 2 * p + Math.floor(i / 3) * p;
        if (lit) s += `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(p * .38)}" fill="${col}"/>`; else if (dim) s += `<circle cx="${f(X)}" cy="${f(Y)}" r="${f(p * .3)}" fill="${dim}"/>`; }
      ox += 4 * p; }
    return s;
  }
  function face(x, cx, cy, r, col) {
    const m = x.band === 0 ? `M${f(cx - r * .45)} ${f(cy + r * .2)} Q${cx} ${f(cy + r * .7)} ${f(cx + r * .45)} ${f(cy + r * .2)}` : x.band === 1 ? `M${f(cx - r * .42)} ${f(cy + r * .38)} H${f(cx + r * .42)}` : `M${f(cx - r * .45)} ${f(cy + r * .55)} Q${cx} ${f(cy + r * .05)} ${f(cx + r * .45)} ${f(cy + r * .55)}`;
    return `<g fill="none" stroke="${col}" stroke-width="${f(r * .16)}" stroke-linecap="round"><circle cx="${cx}" cy="${cy}" r="${r}"/><path d="${m}"/></g><circle cx="${f(cx - r * .35)}" cy="${f(cy - r * .2)}" r="${f(r * .12)}" fill="${col}"/><circle cx="${f(cx + r * .35)}" cy="${f(cy - r * .2)}" r="${f(r * .12)}" fill="${col}"/>`;
  }
  const slots = (X, Y, W, n, gap, dk) => { let s = ""; for (let i = 0; i < n; i++) s += `<rect x="${f(X)}" y="${f(Y + i * gap)}" width="${W}" height="1.6" rx=".8" fill="#000" opacity="${dk ? .5 : .28}"/><path d="M${f(X + .6)} ${f(Y + i * gap + 2.2)} H${f(X + W - .6)}" stroke="#fff" stroke-opacity="${dk ? .08 : .5}" stroke-width=".5"/>`; return s; };
  const ink = "#1d1f1c";

  const base = (o) => Object.assign({ picker: true, colorLabel: "Body" }, o);

  const icons = [
     base({ id: "light-bar-box-sensor", name: "Light-bar box sensor", colors: sw("white ivory gray black"), render(o) {
      const x = ctx(o);
      const b = glow(x, 100, 118, 40, .35) + contact(x, 100, 150, 40) + slab(x, 65, 56, 70, 94, 12, { v: 1 }) +
        `<rect x="95.5" y="101.5" width="9" height="35" rx="4.5" fill="#000" opacity=".12"/>` +
        (x.on ? `<rect class="${P}breathe" x="90" y="94" width="20" height="50" rx="10" fill="${x.url("halo")}"/><rect x="97" y="103" width="6" height="32" rx="3" fill="${x.q}"/><rect x="98.4" y="105" width="1.4" height="28" rx=".7" fill="#fff" opacity=".6"/>`
          : `<rect x="97" y="103" width="6" height="32" rx="3" fill="${x.dk ? "#3a3c42" : "#dcdcd8"}"/>`) +
        slots(76, 62, 48, 2, 3.2, x.dk) + `<path d="M67 146 H133" stroke="#000" stroke-opacity=".12"/>`;
      return scene(x, "linen", "desk", b);
    } }),

     base({ id: "upright-lcd-air-monitor", name: "Upright LCD air monitor", colors: sw("white gray ivory black"), render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a), on = x.on, k = on ? ink : "#000", ko = on ? .9 : 0; fin(x);
      const sq = ["#3fbfa8", "#e8d24a", "#e57373"], cur = [96, 88, 80][x.band], ph = x.pm.length > 2 ? 13 : 18;
      let lcdc = "";
      if (on) lcdc = `<path d="M70 72 V66.5 L74.5 63 L79 66.5 V72 H115" fill="none" stroke="${k}" stroke-width=".7" stroke-linejoin="round"/><path d="M73 71 v-2.6 h3 v2.6" fill="none" stroke="${k}" stroke-width=".5"/>` +
        `<path d="M72 77 h3 M76.5 77 h3 M81 77 h2 M84.5 77 h3" stroke="${k}" stroke-width="1.1"/>` +
        digits(x, 88, 90, ph, k, { str: x.pm, ghost: .04 }) +
        sq.map((c, i) => `<rect x="105.5" y="${96 - i * 8}" width="7" height="7" fill="${c}" opacity=".9"/>`).join("") +
        `<g class="${P}pulse"><path d="M101.5 ${cur + 1.8} l2.6 1.7 l-2.6 1.7 Z M116.5 ${cur + 1.8} l-2.6 1.7 l2.6 1.7 Z" fill="${k}"/></g>` +
        `<rect x="71" y="108" width="2.2" height="6" rx="1.1" fill="none" stroke="${k}" stroke-width=".6"/><circle cx="72.1" cy="115" r="1.6" fill="none" stroke="${k}" stroke-width=".6"/>` +
        digits(x, 92, 111.5, 9, k, { str: x.temp, unit: "deg", ghost: .04 }) +
        `<g transform="translate(72.1 124.5) scale(2)"><path d="${"M0 -1 C.35 -.45 .7 -.05 .7 .35 C.7 .75 .38 1 0 1 C-.38 1 -.7 .75 -.7 .35 C-.7 -.05 -.35 -.45 0 -1 Z"}" fill="none" stroke="${k}" stroke-width=".3"/></g>` +
        digits(x, 92, 124.5, 9, k, { str: x.hum, unit: "pct", ghost: .04 }) +
        `<path d="M70 138 h2.5 M73.5 138 h2.5 M77 138 h2.5 M80.5 138 h2.5" stroke="${k}" stroke-width="1"/><path d="M88 138 H96 M93 135.4 L96 138 L93 140.6" fill="none" stroke="${k}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`;
      else lcdc = sq.map((c, i) => `<rect x="105.5" y="${96 - i * 8}" width="7" height="7" fill="${c}" opacity=".18"/>`).join("");
      const b = `<path d="M134 146 C150 146 156 140 186 141" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="4" transform="translate(1 3)"/><path d="M134 146 C150 146 156 140 186 141" fill="none" stroke="${S(-.05)}" stroke-width="3"/>` +
        contact(x, 100, 150, 44) + drop(x, `<path d="M60 56 L76 46 H140 V140 L124 150 H60 Z"/>`, 3, 5, .55) +
        `<path d="M124 56 L140 46 V140 L124 150 Z" fill="${S(-.16)}"/><path d="M124 56 L140 46 V140 L124 150 Z" fill="url(#${o.uid}-bdv)" opacity=".25"/>` +
        `<path d="M60 56 L76 46 H140 L124 56 Z" fill="${S(.35)}"/>` + `<ellipse cx="102" cy="51" rx="9" ry="2.8" fill="${S(-.12)}"/><ellipse cx="102" cy="50.4" rx="8.4" ry="2.4" fill="${S(.45)}"/><ellipse cx="124" cy="48" rx="3" ry="1" fill="${S(-.1)}"/>` +
        `<rect x="60" y="56" width="64" height="94" rx="5" fill="${x.url("bdv")}"/><rect x="60.6" y="56.6" width="62.8" height="92.8" rx="4.6" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .15 : .7}" stroke-width=".8"/>` +
        panel(x, 65, 61, 54, 84, 3, "lcd") + lcdc + glossR(x, 65, 61, 54, 84, 3);
      return scene(x, "sage", "desk", b);
    } }),

     base({ id: "oval-led-dot-co2-clock", name: "Oval LED-dot CO2 clock", colors: sw("white sand gray black"), render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a);
      x.add("cap", lg(x.id("cap"), [[0, S(.5)], [.3, x.c], [.75, S(-.15)], [1, S(-.45)]], 0, 0, 0, 1));
      x.add("fp", lg(x.id("fp"), [[0, H.mix(x.c, "#a9adb2", .45)], [1, H.mix(x.c, "#8d9196", .5)]], 0, 0, 0, 1));
      const dc = "#ffffff";
      const b = glow(x, 100, 121, 54, .3) + `<path d="M150 116 C166 112 174 104 188 96" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="4" transform="translate(1 3)"/><path d="M150 116 C166 112 174 104 188 96" fill="none" stroke="${S(-.08)}" stroke-width="3.2"/>` +
        contact(x, 100, 146, 50) + drop(x, rr(46, 98, 108, 48, 24), 3, 5, .5) +
        `<rect x="62" y="93" width="76" height="14" rx="7" fill="${S(.32)}"/><rect x="62" y="93" width="76" height="14" rx="7" fill="none" stroke="#000" stroke-opacity=".08"/><rect x="90" y="95.4" width="20" height="4" rx="2" fill="${S(-.1)}"/><rect x="90.4" y="94.8" width="19.2" height="3.6" rx="1.8" fill="${S(.55)}"/>` +
        `<rect x="46" y="98" width="108" height="48" rx="24" fill="${x.url("cap")}"/>` +
        `<rect x="50" y="101" width="100" height="42" rx="21" fill="${x.url("fp")}"/><rect x="50" y="101" width="100" height="42" rx="21" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>` +
        (x.on ? `<g opacity=".6" filter="${x.url("bs")}">${dots(108, 123, 3.3, x.co2, dc)}</g>` + dots(108, 123, 3.3, x.co2, dc) + dots(68, 111, 1.15, "CO2", dc) : "") +
        led(x, 66, 132, 1.6, x.q) + `<path d="M64 105 Q100 102 136 105" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>`;
      return scene(x, "greige", "shelf", b);
    } }),

     base({ id: "round-dot-display-sensor", name: "Round dot-display sensor", colors: sw("white ivory gray black"), render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a), cx = 96, cy = 98; fin(x);
      x.add("disc", rg(x.id("disc"), [[0, S(-.02)], [.7, S(-.08)], [1, S(-.2)]], .4, .35, .75) + lg(x.id("rim"), [[0, S(-.05)], [1, S(-.4)]], 0, 0, 1, 0));
      const dc = x.dk ? "#ffffff" : "#ffffff";
      const b = glow(x, cx, cy, 70, .3) + drop(x, `<circle cx="${cx + 6}" cy="${cy}" r="46"/>`, 4, 7, .55) +
        `<circle cx="${cx + 7}" cy="${cy}" r="46" fill="${x.url("rim")}"/><path d="M${cx} ${cy - 46} H${cx + 7} M${cx} ${cy + 46} H${cx + 7}" stroke="${S(-.25)}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="46" fill="${x.url("disc")}"/><circle cx="${cx}" cy="${cy}" r="45.5" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .15 : .6}" stroke-width=".8"/>` +
        `<path d="M${cx - 38} ${cy - 22} A44 44 0 0 1 ${cx + 4} ${cy - 44}" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .2 : .7}" stroke-width="1.4" stroke-linecap="round"/>` +
        (x.on ? `<g transform="translate(.5 .8)" opacity="${x.dk ? 0 : .95}">${dots(cx - 4, cy, 4, x.hum, "#6e737a")}</g><g class="${P}breathe"><g opacity=".7" filter="${x.url("bs")}">${dots(cx - 4, cy, 4, x.hum, dc)}</g>${dots(cx - 4, cy, 4, x.hum, dc)}</g>` +
          `<g fill="${dc}" stroke="#8a8f96" stroke-width="${x.dk ? 0 : .4}">${[0, 1].map((i) => `<rect x="${cx + 21 + i * 4.6}" y="${cy - 8.5 + i * 13}" width="2.6" height="2.6" transform="rotate(45 ${cx + 22.3 + i * 4.6} ${cy - 7.2 + i * 13})"/>`).join("")}<path d="M${cx + 30} ${cy - 9} L${cx + 19} ${cy + 9}" stroke="${dc}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.6 1.9"/></g>` : "");
      return scene(x, "blush", "", b);
    } }),

     base({ id: "radonpuck", name: "Radon puck", colors: sw("white black gray sand"), render(o) {
      const x = ctx(o), cx = 100, cy = 98; fin(x);
      let holes = ""; for (let r = 16; r <= 41; r += 5) { const n = Math.round(2 * Math.PI * r / 5.2);
        for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + r; holes += `<circle cx="${f(cx + Math.cos(a) * r)}" cy="${f(cy + Math.sin(a) * r)}" r=".95" fill="#000" opacity="${x.dk ? .5 : .2}"/>`; } }
      const b = glow(x, cx, cy, 60, .3) + drop(x, `<circle cx="${cx}" cy="${cy}" r="48"/>`, 3, 7, .55) + `<circle cx="${cx}" cy="${cy}" r="48.6" fill="#000" opacity=".3"/>` +
        `<circle cx="${cx}" cy="${cy}" r="48" fill="${x.url("edge")}"/><circle cx="${cx}" cy="${cy}" r="45.5" fill="${x.url("bdr")}"/>` + holes +
        (x.on ? `<g class="${P}breathe"><circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="${x.q}" stroke-width="6" opacity=".5" filter="${x.url("bs")}"/><circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="${x.hot}" stroke-width="2.6"/></g>`
          : `<circle cx="${cx}" cy="${cy}" r="10" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2.6"/>`) +
        `<path d="M66 72 A44 44 0 0 1 110 54.5" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .3 : .85}" stroke-width="1.6" stroke-linecap="round"/>`;
      return scene(x, "plaster", "", b);
    } }),

     base({ id: "radonbar", name: "Radon meter", colors: sw("black graphite gray white"), render(o) {
      const x = ctx(o);
      x.add("silv", lg(x.id("silv"), [[0, "#f1f2f4"], [.5, "#c9ccd1"], [1, "#9aa0a8"]], 0, 0, 1, 1));
      const lt = ((1 - x.lv) * 4 + .3).toFixed(1);
      const b = contact(x, 100, 147, 32) + slab(x, 70, 40, 60, 106, 10, { v: 1 }) + `<rect x="74" y="45" width="52" height="96" rx="7" fill="${x.url("silv")}"/>` +
        panel(x, 79, 52, 42, 52, 2.5, "lcd") +
        (x.on ? `<rect x="83" y="56" width="20" height="2" fill="${ink}" opacity=".6"/>` + digits(x, 100, 70, 13, ink, { str: x.radon }) +
          `<path d="M82 82 H118" stroke="${ink}" stroke-opacity=".25"/><rect x="83" y="86" width="16" height="2" fill="${ink}" opacity=".6"/>` + digits(x, 104, 96, 8, ink, { str: lt }) : "") +
        `<circle cx="100" cy="122" r="6.5" fill="#000" opacity=".2"/><circle cx="100" cy="121.4" r="5.6" fill="#e9eaec"/>` + led(x, 100, 112, 1.2, x.q);
      return scene(x, "slate", "shelf", b);
    } }),

     base({ id: "woodface", name: "Wood face monitor", colorLabel: "Frame", colors: ["#6b4a2e", "#b8895a", "#f2f1ee", "#2a2b30"], render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a); let grain = "", perf = "";
      x.add("wood", lg(x.id("wood"), [[0, S(.25)], [.5, x.c], [1, S(-.35)]], 0, 0, 1, 1));
      const R = rnd(77); for (let i = 0; i < 12; i++) { const y = 62 + i * 7.4 + R() * 2; grain += `<path d="M38 ${f(y)} C80 ${f(y + R() * 4 - 2)} 120 ${f(y + R() * 4 - 2)} 162 ${f(y)}" fill="none" stroke="#2a160a" stroke-opacity="${(.1 + R() * .12).toFixed(2)}" stroke-width=".8"/>`; }
      for (let r = 0; r < 11; r++) for (let c = 0; c < 19; c++) perf += `<circle cx="${f(53 + c * 5.2)}" cy="${f(78 + r * 5.2)}" r=".9" fill="#000" opacity=".16"/>`;
      const sc = x.score.length > 2 ? "99" : x.score;
      const b = glow(x, 110, 104, 50, .25) + contact(x, 100, 150, 64) + drop(x, rr(38, 60, 124, 88, 8), 3, 6, .5) +
        `<rect x="38" y="60" width="124" height="88" rx="8" fill="${x.url("wood")}"/><clipPath id="${x.id("wf")}"><rect x="38" y="60" width="124" height="88" rx="8"/></clipPath><g clip-path="${x.url("wf")}">${grain}</g>` +
        `<rect x="47" y="70" width="106" height="68" rx="3" fill="#f3f2ee"/><rect x="47" y="70" width="106" height="68" rx="3" fill="none" stroke="#000" stroke-opacity=".25"/>` + perf +
        `<circle cx="66" cy="104" r="7" fill="#2a2c30"/><circle cx="64" cy="102" r="2" fill="#fff" opacity=".25"/>` +
        (x.on ? `<g class="${P}breathe">${dots(116, 104, 5.2, sc, x.q)}</g>` : "") + hl("M44 61.4 H156", .25, .8);
      return scene(x, "clay", "desk", b);
    } }),

     base({ id: "roundedmonitor", name: "Rounded monitor", colors: sw("white gray black sand"), render(o) {
      const x = ctx(o), S = (a) => H.shade(x.c, a); let rows = "", perf = "";
      for (let r = 0; r < 12; r++) for (let c = 0; c < 21; c++) perf += `<circle cx="${f(48 + c * 5.2)}" cy="${f(74 + r * 5)}" r=".9" fill="#000" opacity="${x.dk ? .5 : .22}"/>`;
      for (let r = 0; r < 5; r++) { const lvl = Math.max(1, Math.min(4, Math.round(x.lv * 4 + (r % 3) - 1)));
        for (let k = 0; k < 4; k++) { const lit = x.on && k < lvl; rows += `<circle cx="${132 + k * 5}" cy="${84 + r * 8}" r="1.6" fill="${lit ? (lvl >= 3 ? "#37d67a" : lvl === 2 ? "#ffd43b" : "#ff7a4a") : "#000"}" opacity="${lit ? 1 : .08}"/>`; } }
      const sc = x.score.length > 2 ? "99" : x.score;
      const b = glow(x, 100, 100, 60, .25) + contact(x, 100, 148, 60) + slab(x, 38, 62, 124, 86, 20) + perf +
        (x.on ? `<g class="${P}breathe"><g opacity=".6" filter="${x.url("bs")}">${dots(84, 104, 5.2, sc, "#ffffff")}</g>${dots(84, 104, 5.2, sc, x.dk ? "#ffffff" : "#5d636c")}</g>` : "") + rows +
        `<circle cx="58" cy="138" r="2.4" fill="#000" opacity=".2"/>`;
      return scene(x, "navy", "desk", b);
    } }),

     base({ id: "roomcube", name: "Room sensor", colors: sw("white black gray sand"), render(o) {
      const x = ctx(o);
      const b = glow(x, 100, 112, 44, .35) + slab(x, 70, 68, 60, 60, 14) + `<circle cx="100" cy="92" r="9" fill="#000" opacity=".2"/>` +
        `<circle cx="100" cy="92" r="8" fill="${x.url("glass")}"/><path d="M95 88 a7 7 0 0 1 6 -3" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-linecap="round"/>` +
        (x.on ? `<rect class="${P}breathe" x="88" y="113" width="24" height="3" rx="1.5" fill="${x.q}"/><rect x="82" y="108" width="36" height="13" rx="6.5" fill="${x.url("halo")}" opacity=".6"/>` : `<rect x="88" y="113" width="24" height="3" rx="1.5" fill="#000" opacity=".12"/>`);
      return scene(x, "mint", "", b, 1.25);
    } }),

     base({ id: "einkco2", name: "E-ink CO2", colors: sw("white gray graphite black"), render(o) {
      const x = ctx(o), dc = x.on ? ink : "#9a9c95";
      const b = contact(x, 100, 150, 46) + slab(x, 54, 58, 92, 92, 10) + panel(x, 61, 65, 78, 56, 3, "eink") +
        digits(x, 80, 72, 6, dc, { str: x.temp, unit: "deg" }) + digits(x, 118, 72, 6, dc, { str: x.hum, unit: "pct" }) + `<path d="M64 78 H136" stroke="${dc}" stroke-opacity=".25"/>` +
        digits(x, 100, 96, 18, dc, { str: x.co2 }) + `<rect x="112" y="110" width="16" height="2" fill="${dc}" opacity=".5"/>` +
        (x.on ? `<rect x="66" y="108" width="12" height="7" rx="1" fill="${x.q}"/>` : `<rect x="66" y="108" width="12" height="7" rx="1" fill="none" stroke="${dc}" stroke-opacity=".4"/>`) +
        `<rect x="88" y="132" width="24" height="3" rx="1.5" fill="#000" opacity=".12"/>` + led(x, 132, 136, 1.4, x.q);
      return scene(x, "denim", "desk", b);
    } }),

     base({ id: "minisquare", name: "Mini temp square", colors: sw("white black gray sage"), render(o) {
      const x = ctx(o);
      x.add("frame", lg(x.id("frame"), [[0, "#f2efe8"], [1, "#c9c4b9"]], 0, 0, 1, 1) + lg(x.id("sky"), [[0, "#7fa6c9"], [1, "#c9dbe8"]], 0, 0, 0, 1));
      const b = `<g class="hda-bg"><rect x="118" y="20" width="66" height="104" fill="${x.url("frame")}"/><rect x="125" y="27" width="52" height="90" fill="${x.url("sky")}"/><path d="M151 27 V117 M125 72 H177" stroke="#e9e5dc" stroke-width="3"/><path d="M118 124 H186" stroke="#000" stroke-opacity=".35" stroke-width="3"/></g>` +
        glow(x, 76, 100, 36, .35) + slab(x, 54, 76, 46, 46, 9) + `<path d="M58 84 Q60 79 66 78.6" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .25 : .9}" stroke-width="1.4" stroke-linecap="round"/>` +
        led(x, 77, 112, 1.6, x.q) + `<path d="M77 92 V100" stroke="#000" stroke-opacity=".12" stroke-width="2.2" stroke-linecap="round"/><circle cx="77" cy="102.4" r="2.2" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1"/>`;
      return scene(x, "sand", "", b, 1.15);
    } }),

     base({ id: "lcdmeter", name: "LCD meter", colors: sw("white black gray ivory"), render(o) {
      const x = ctx(o), dc = ink;
      const b = contact(x, 100, 150, 42) + `<path d="M84 150 L92 132 H108 L116 150 Z" fill="#000" opacity=".35"/>` + slab(x, 60, 58, 80, 84, 14) + panel(x, 67, 65, 66, 64, 7, "lcd") +
        (x.on ? digits(x, 92, 86, 20, dc, { str: x.temp, unit: "deg", ghost: .05 }) + digits(x, 94, 113, 15, dc, { str: x.hum, unit: "pct", ghost: .05 }) + `<g class="${P}pulse">${face(x, 125, 72, 4, dc)}</g>` : "") +
        glossR(x, 67, 65, 66, 64, 7);
      return scene(x, "plaster", "desk", b);
    } }),

     base({ id: "hygrometer", name: "Fridge hygrometer", colors: sw("white black sage ivory"), render(o) {
      const x = ctx(o); let br = "";
      x.add("ss", lg(x.id("ss"), [[0, "#9ea4ab"], [.3, "#d7dbe0"], [.6, "#a8aeb6"], [1, "#878d95"]]));
      for (let i = 0; i < 90; i++) br += `<path d="M8 ${f(8 + i * 2.05)} H192" stroke="${i % 3 ? "#fff" : "#000"}" stroke-opacity=".05" stroke-width=".6"/>`;
      const b = `<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("ss")}"/>${br}<path d="M178 8 V192" stroke="#000" stroke-opacity=".25" stroke-width="2"/><rect x="172" y="40" width="6" height="90" rx="3" fill="#6c727a"/></g>` +
        slab(x, 54, 52, 92, 96, 16) + panel(x, 62, 60, 76, 80, 9, "lcd") +
        (x.on ? digits(x, 96, 86, 24, ink, { str: x.temp, unit: "deg", ghost: .05 }) + `<path d="M66 106 H134" stroke="${ink}" stroke-opacity=".2"/>` + digits(x, 90, 122, 14, ink, { str: x.hum, unit: "pct", ghost: .05 }) + `<g class="${P}pulse">${face(x, 124, 122, 6.5, ink)}</g>` : "") +
        glossR(x, 62, 60, 76, 80, 9);
      return scene(x, "concrete", "", b);
    } }),

     base({ id: "walleink", name: "Wall e-ink", colors: sw("white black graphite sand"), render(o) {
      const x = ctx(o), dc = x.on ? ink : "#9a9c95"; fin(x);
      const b = glow(x, 100, 70, 50, .3) + drop(x, rr(24, 64, 152, 76, 38), 3, 6, .5) + `<rect x="24" y="64" width="152" height="76" rx="38" fill="${x.url("edge")}"/>` +
        `<rect x="25.5" y="65" width="149" height="73" rx="36.5" fill="${x.url("bdv")}"/>` + hl("M52 66.6 H148", x.dk ? .25 : .85, 1) +
        `<rect x="50" y="78" width="100" height="48" rx="22" fill="#000" opacity=".25"/><rect x="51" y="79" width="98" height="46" rx="21" fill="${x.url("eink")}"/>` +
        digits(x, 92, 98, 18, dc, { str: x.co2 }) + digits(x, 84, 116, 6, dc, { str: x.temp, unit: "deg" }) + digits(x, 108, 116, 6, dc, { str: x.radon }) +
        (x.on ? `<path class="${P}breathe" d="M78 73 Q100 69 122 73" fill="none" stroke="${x.q}" stroke-width="2.6" stroke-linecap="round"/>` : `<path d="M78 73 Q100 69 122 73" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2.6" stroke-linecap="round"/>`);
      return scene(x, "stucco", "", b);
    } }),

     base({ id: "weatherstation", name: "Weather station", colors: sw("black graphite white silver"), render(o) {
      const x = ctx(o), cool = "#7cc7ff"; let seg = "";
      for (let i = 0; i < 6; i++) { const c = ["#ff4d4d", "#ff922b", "#ffd43b", "#a9e34b", "#37d67a", "#20c997"][i], lit = x.on && i <= Math.round(x.lv * 5); seg += `<rect x="${f(46 + i * 9)}" y="117" width="7.4" height="4" rx="1" fill="${c}" opacity="${lit ? 1 : .12}"/>`; }
      x.add("ws", lg(x.id("ws"), [[0, "#f6f6f2"], [1, "#b9bab4"]], 0, 0, 1, 0));
      let fins = ""; for (let i = 0; i < 5; i++) fins += `<path d="M138 ${104 + i * 7} H170" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/><path d="M134 ${101 + i * 7} H174 L170 ${105 + i * 7} H138 Z" fill="${x.url("ws")}"/>`;
      const b = contact(x, 74, 150, 48) + `<path d="M50 150 L56 140 H92 L98 150 Z" fill="#000" opacity=".35"/>` + slab(x, 30, 66, 88, 78, 8) + screen(x, 36, 72, 76, 60, 4) +
        (x.on ? digits(x, 64, 88, 15, "#ffd48a", { str: x.temp, unit: "deg", glow: 1 }) + digits(x, 98, 88, 9, cool, { str: "54", unit: "deg" }) + `<path d="M40 101 H108" stroke="#fff" stroke-opacity=".12"/>` +
          digits(x, 60, 109, 7, "#e6e8ec", { str: x.pm }) + `<g class="${P}pulse"><circle cx="100" cy="109" r="4" fill="${x.q}"/></g>` + seg : seg.replace(/opacity="1"/g, `opacity=".12"`)) + glossR(x, 36, 72, 76, 60, 4) +
        contact(x, 154, 150, 18) + `<rect x="152" y="130" width="4" height="20" fill="#9a9c9f"/>` + drop(x, rr(134, 96, 40, 38, 4), 2, 4, .5) +
        `<path d="M130 98 L154 86 L178 98 Z" fill="${x.url("ws")}"/>` + fins + `<rect x="138" y="132" width="32" height="2" fill="#777"/>` +
        (x.on ? [0, 1, 2].map((i) => `<path class="${P}wave" style="animation-delay:${(i * .4).toFixed(1)}s" d="M${126 - i * 5} ${f(82 - i * 2)} q-4 6 0 12" fill="none" stroke="${x.hot}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "");
      return scene(x, "wood", "desk", b);
    } }),

     base({ id: "round-egg", name: "Laser egg", colors: sw("white black sage ivory"), render(o) {
      const x = ctx(o); fin(x);
      const egg = "M100 50 C130 50 146 82 146 108 C146 134 126 150 100 150 C74 150 54 134 54 108 C54 82 70 50 100 50 Z";
      const a1 = -135 + 270 * x.lv, p0 = [100 + Math.sin(-135 * Math.PI / 180) * 21, 102 - Math.cos(-135 * Math.PI / 180) * 21], p1 = [100 + Math.sin(a1 * Math.PI / 180) * 21, 102 - Math.cos(a1 * Math.PI / 180) * 21];
      x.add("rim", lg(x.id("rim"), [[0, "#7a5a22"], [.3, "#f1d48a"], [.6, "#c9a457"], [1, "#6e4f1c"]], 0, 0, 1, 1));
      const b = glow(x, 100, 102, 50, .3) + contact(x, 100, 151, 34) + `<g transform="translate(3 6)" opacity=".5" filter="${x.url("bl")}"><path d="${egg}"/></g>` +
        `<path d="${egg}" fill="${x.url("bdr")}"/><path d="M76 76 C82 62 92 56 102 55" fill="none" stroke="#fff" stroke-opacity="${x.dk ? .3 : .9}" stroke-width="2.4" stroke-linecap="round"/>` +
        `<circle cx="100" cy="102" r="29" fill="${x.url("rim")}"/><circle cx="100" cy="102" r="26.5" fill="#f7f7f4"/>` +
        (x.on ? `<path d="M${f(p0[0])} ${f(p0[1])} A21 21 0 ${a1 + 135 > 180 ? 1 : 0} 1 ${f(p1[0])} ${f(p1[1])}" fill="none" stroke="${x.q}" stroke-width="3" stroke-linecap="round"/>` + digits(x, 100, 103, 12, "#3a3d44", { str: x.pm })
          : `<path d="M${f(p0[0])} ${f(p0[1])} A21 21 0 1 1 ${f(200 - p0[0])} ${f(p0[1])}" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="3" stroke-linecap="round"/>`) +
        `<ellipse cx="92" cy="92" rx="14" ry="5" transform="rotate(-20 92 92)" fill="#fff" opacity=".35"/>`;
      return scene(x, "dark", "desk", b);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "airsensors",
    tab: "Air sensors",
    group: "Air",
    kind: "device",
    levelLabel: "Air quality",
    onWord: "On", offWord: "Off",
    intro: "Sixteen air-quality and climate sensors, from simple light-bar boxes to e-ink and LED-dot monitors, on desks, shelves and walls. The slider is air quality: high is good (green), middle is fair (yellow), low is poor (orange, red). Each one shows it its own way: a light bar, a color ring, segment numbers, LED dots or a comfort face.",
    
    css: `.hda-airsensors-breathe,.hda-airsensors-pulse{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-airsensors-breathe{animation:hda-airsensors-breathe 4.2s ease-in-out infinite}
@keyframes hda-airsensors-breathe{50%{opacity:.4}}
.hda-anim .hda-airsensors-pulse{animation:hda-airsensors-pulse 2.8s ease-in-out infinite}
@keyframes hda-airsensors-pulse{50%{opacity:.6;transform:scale(1.1)}}
.hda-airsensors-wave{opacity:.7}
.hda-anim .hda-airsensors-wave{animation:hda-airsensors-wave 1.8s ease-in-out infinite}
@keyframes hda-airsensors-wave{0%,100%{opacity:.1}50%{opacity:.9}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-airsensors-breathe,.hda-anim .hda-airsensors-pulse,.hda-anim .hda-airsensors-wave{animation:none}}`,
    icons,
  });
})();
