(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);

  function ctx(o) {
    const c = o.color || "#ff3fa4", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  function hue(hex, deg) {
    let [r, g, b] = H.hx(hex).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    if (s < .35) { s = .9; l = Math.min(Math.max(l, .55), .66); }
    h = ((h + deg) % 360 + 360) % 360;
    const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const t = (u) => { u = (u + 1) % 1; return u < 1 / 6 ? p + (q - p) * 6 * u : u < .5 ? q : u < 2 / 3 ? p + (q - p) * (2 / 3 - u) * 6 : p; };
    const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
    return "#" + to(t(h / 360 + 1 / 3)) + to(t(h / 360)) + to(t(h / 360 - 1 / 3));
  }
  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops) => `<radialGradient id="${id}" cx=".5" cy=".5" r=".5">${st(stops)}</radialGradient>`;

  const G = {
    A: [8, "M0 12 L4 0 L8 12 M1.6 7.4 H6.4"],
    B: [8, "M0 12 V0 H4.6 C7.8 0 7.8 6 4.6 6 H0 M4.6 6 C8.4 6 8.4 12 4.6 12 H0"],
    C: [8, "M8 2 C6 -0.6 0 -0.6 0 6 C0 12.6 6 12.6 8 10"],
    D: [8, "M0 0 V12 H3 C9.4 12 9.4 0 3 0 Z"],
    E: [7, "M7 0 H0 V12 H7 M0 6 H5.4"],
    F: [7, "M7 0 H0 V12 M0 6 H5.4"],
    G: [8, "M8 2 C6 -0.6 0 -0.6 0 6 C0 12.6 8 12.6 8 7 H4.4"],
    H: [8, "M0 0 V12 M8 0 V12 M0 6 H8"],
    I: [0, "M0 0 V12"],
    L: [7, "M0 0 V12 H7"],
    M: [10, "M0 12 V0 L5 7.4 L10 0 V12"],
    N: [8, "M0 12 V0 L8 12 V0"],
    O: [8, "M4 0 C9.4 0 9.4 12 4 12 C-1.4 12 -1.4 0 4 0 Z"],
    P: [8, "M0 12 V0 H4.6 C8.4 0 8.4 6.6 4.6 6.6 H0"],
    R: [8, "M0 12 V0 H4.6 C8.4 0 8.4 6.6 4.6 6.6 H0 M4 6.6 L8 12"],
    S: [8, "M8 1.6 C6 -0.6 0 -0.6 0 3.2 C0 6.4 8 5.6 8 9 C8 12.6 1.6 12.6 0 10.4"],
    T: [8, "M0 0 H8 M4 0 V12"],
    V: [8, "M0 0 L4 12 L8 0"],
    Y: [8, "M0 0 L4 6 L8 0 M4 6 V12"],
    "1": [2.6, "M-0.6 2.6 L2.6 0 V12"],
    "2": [8, "M0 2.6 C1 -0.8 8 -0.8 8 3.6 C8 7 0 9 0 12 H8"],
    "'": [0, "M0 0 V3"],
    "^": [8, "M-0.6 5 L4 0 L8.6 5 M1 3.6 V12 H7 V3.6 M3 12 V8.4 H5 V12"],
    " ": [4, ""],
  };
  function mapPath(d, s, ox, oy) {
    const tk = d.match(/[MLHVCZ]|-?[\d.]+/g) || []; let out = "", cmd = "", i = 0;
    while (i < tk.length) {
      const t = tk[i];
      if (/[MLHVCZ]/.test(t)) { cmd = t; out += t; i++; continue; }
      if (cmd === "H") { out += f(ox + +t * s) + " "; i++; }
      else if (cmd === "V") { out += f(oy + +t * s) + " "; i++; }
      else { out += f(ox + +tk[i] * s) + " " + f(oy + +tk[i + 1] * s) + " "; i += 2; }
    }
    return out;
  }
  function word(str, cx, cy, h) {
    const s = h / 12, gap = 3.2; let tot = 0;
    for (const ch of str) tot += G[ch][0] + gap; tot -= gap;
    let x0 = cx - tot * s / 2; const y0 = cy - h / 2, parts = [];
    for (const ch of str) { const [w, p] = G[ch]; if (p) parts.push(mapPath(p, s, x0, y0)); x0 += (w + gap) * s; }
    return parts;
  }

  function defs(x, extra) {
    const { c, id } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .8], [.45, c, .28], [1, c, 0]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("blk"), [[0, "#111117"], [.3, "#3b3c49"], [.45, "#555769"], [.75, "#22232c"], [1, "#0c0c11"]])}
${lg(id("acr"), [[0, "#ffffff", .16], [.3, "#ffffff", .05], [.7, "#ffffff", .03], [1, "#ffffff", .1]], 1)}
${rg(id("softg"), [[0, "#fff"], [.5, "#fff"], [1, "#000"]])}
<mask id="${id("soft")}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#${id("softg")})"/></mask>
${extra || ""}</defs>`;
  }
  const out = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const wall = (x, col, a) => `<g class="hda-bg" mask="${x.url("soft")}"><rect width="200" height="200" fill="${col || "#4b4566"}" opacity="${a || .38}"/></g>`;
  const wash = (x, cx, cy, rx, ry, col, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col ? col : x.url("halo")}" opacity="${x.op(k || .55)}"/>` : "";
  const washC = (x, cx, cy, rx, ry, col, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col}" opacity="${x.op(k || .14)}"/>` : "";

  function tube(x, d, col, w) {
    col = col || x.c; w = w || 3.6; const a = `fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    if (!x.on) return `<path d="${d}" ${a} stroke="#000" stroke-opacity=".35" stroke-width="${f(w + 1)}" transform="translate(1.2 2.4)"/><path d="${d}" ${a} stroke="#e8e4f0" stroke-opacity=".6" stroke-width="${w}"/><path d="${d}" ${a} stroke="#fff" stroke-opacity=".55" stroke-width="${f(w * .3)}"/>`;
    return `<path d="${d}" ${a} stroke="${col}" stroke-opacity="${x.op(.13)}" stroke-width="${f(w * 4.6)}"/><path d="${d}" ${a} stroke="${col}" stroke-opacity="${x.op(.38)}" stroke-width="${f(w * 2.2)}"/>
<path d="${d}" ${a} stroke="${H.mix(col, "#fff", .22)}" stroke-opacity="${(.6 + .4 * x.L).toFixed(2)}" stroke-width="${w}"/><path d="${d}" ${a} stroke="${H.mix(col, "#fff", .82)}" stroke-opacity="${(.45 + .55 * x.L).toFixed(2)}" stroke-width="${f(w * .42)}"/>`;
  }
  const tubes = (x, parts, col, w) => parts.map((d) => tube(x, d, col, w)).join("");
  const grp = (cls, body, delay) => `<g class="hda-neon-${cls}"${delay != null ? ` style="animation-delay:-${delay}s"` : ""}>${body}</g>`;

  function backer(x, x0, y0, x1, y1, r) {
    const so = [[x0 + 7, y0 + 7], [x1 - 7, y0 + 7], [x0 + 7, y1 - 7], [x1 - 7, y1 - 7]];
    return `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${r || 6}" fill="#000" opacity=".18" transform="translate(2 4)"/>
<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${r || 6}" fill="${x.url("acr")}" stroke="#fff" stroke-opacity=".38" stroke-width="1"/>
<path d="M${x0 + (r || 6)} ${y0 + 1.6} H${x1 - (r || 6)}" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>
${so.map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3.6" fill="${x.url("chr")}"/><circle cx="${a}" cy="${b}" r="1.2" fill="#555a68"/>`).join("")}`;
  }
  function contour(x, ds, w, so) {
    const all = ds.join(" ");
    return `<path d="${all}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="${(w || 20) + 2}" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 4)"/>
<path d="${all}" fill="none" stroke="#fff" stroke-opacity=".26" stroke-width="${(w || 20) + 1.6}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${all}" fill="none" stroke="#3b3552" stroke-opacity=".9" stroke-width="${w || 20}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${all}" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="${w || 20}" stroke-linecap="round" stroke-linejoin="round"/>
${(so || []).map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="${x.url("chr")}"/><circle cx="${a}" cy="${b}" r="1" fill="#555a68"/>`).join("")}`;
  }
  function glassKit(x, pts, tx, ty, from) {
    return `${pts.map(([a, b]) => `<rect x="${a - 1.6}" y="${b - 1}" width="3.2" height="7" rx="1" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".4" stroke-width=".5"/><circle cx="${a}" cy="${b}" r="1.8" fill="#8e94a6"/>`).join("")}
<path d="M${from[0]} ${from[1]} C${from[0]} ${ty - 6} ${tx - 20} ${ty + 4} ${tx - 9} ${ty + 4}" fill="none" stroke="#16141c" stroke-width="1.8"/>
<rect x="${tx - 10}" y="${ty - 4}" width="24" height="16" rx="2" fill="${x.url("blk")}"/><path d="M${tx - 7} ${ty} H${tx + 11}" stroke="#fff" stroke-opacity=".2"/>
<circle cx="${tx + 8}" cy="${ty + 6}" r="1.3" fill="${x.on ? "#5bff8a" : "#2a3a2e"}"/><path d="M${tx + 2} ${ty + 12} C${tx + 2} ${ty + 22} ${tx + 10} ${ty + 22} ${tx + 10} 200" fill="none" stroke="#16141c" stroke-width="1.8"/>`;
  }
  const jumps = (parts) => { let s = ""; for (let i = 0; i < parts.length - 1; i++) { const a = parts[i].match(/-?[\d.]+/g), b = parts[i + 1].match(/-?[\d.]+/g);
    s += `<path d="M${a[a.length - 2]} ${a[a.length - 1]} Q${f((+a[a.length - 2] + +b[0]) / 2)} ${f(Math.max(+a[a.length - 1], +b[1]) + 6)} ${b[0]} ${b[1]}" fill="none" stroke="#141218" stroke-width="2.6" stroke-linecap="round"/>`; } return s; };
  const brick = (x) => { let br = "";
    for (let r = 0; r < 15; r++) for (let c = -1; c < 9; c++) { const xx = c * 26 + (r % 2) * 13, y = r * 13.5;
      br += `<rect x="${xx + 1}" y="${f(y + 1)}" width="24" height="11.5" rx="1" fill="${["#5c2f2a", "#683630", "#52292a", "#6f3b32"][(r * 3 + c * 7 + 20) % 4]}"/>`; }
    return `<g class="hda-bg" mask="${x.url("soft")}"><rect width="200" height="200" fill="#2a1614"/>${br}<rect x="0" y="0" width="34" height="200" fill="#000" opacity=".45"/><path d="M34 0 V200" stroke="#000" stroke-opacity=".5" stroke-width="2"/></g>`; };
  const circ = (cx, cy, r) => `M${f(cx - r)} ${cy} A${r} ${r} 0 1 0 ${f(cx + r)} ${cy} A${r} ${r} 0 1 0 ${f(cx - r)} ${cy} Z`;

  const PINK = "#ff3fa4", ICE = "#7fe3ff", WW = "#ffd9a0", RED = "#ff3b3b", LIME = "#a6ff3f", PURP = "#a35cff";
  const NEON = [PINK, ICE, WW, RED, LIME, PURP];
  const first = (c) => [c].concat(NEON.filter((k) => k !== c));
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "around", glow: { x: .5, y: .48, r: 1.2 } }, o);

  const icons = [
    base({ id: "open", name: "Open sign", colors: first(RED), render(o) {
      const x = ctx(o), acc = hue(x.c, 200), w = word("OPEN", 100, 96, 30), bd = "M38 70 H162 C168 70 170 72 170 78 V114 C170 120 168 122 162 122 H38 C32 122 30 120 30 114 V78 C30 72 32 70 38 70 Z";
      return out(x, `${wall(x)}${wash(x, 100, 96, 96, 56)}${washC(x, 100, 96, 90, 48, acc, .12)}
<path d="M46 0 V70 M154 0 V70" stroke="#8e94a6" stroke-width="1.4" stroke-dasharray="2.4 1.4"/>
${jumps(w)}${tube(x, bd, acc, 3.2)}${grp("blink", tubes(x, w, x.c, 4))}
${glassKit(x, [[50, 100], [150, 100], [100, 120]], 150, 160, [150, 122])}`);
    } }),

    base({ id: "bar", name: "Bar on brick", colors: first(PINK), render(o) {
      const x = ctx(o), acc = hue(x.c, 160), w = word("BAR", 112, 90, 40);
      const sw = "M62 130 C90 122 132 136 162 124", star = "M168 46 L171 54 L179 54 L173 59 L175 67 L168 62 L161 67 L163 59 L157 54 L165 54 Z";
      return out(x, `${brick(x)}${wash(x, 112, 96, 92, 66, null, .6)}
${jumps(w)}${grp("flick", tubes(x, w, x.c, 4.2))}${tube(x, sw, acc, 3)}${tube(x, star, acc, 2.4)}
${glassKit(x, [[70, 84], [154, 84], [112, 128]], 60, 166, [62, 130])}
<g class="hda-bg"><path d="M40 182 H200" stroke="#3a2412" stroke-width="10"/><path d="M40 177 H200" stroke="#7c5130" stroke-width="2"/></g>`);
    } }),

    base({ id: "gameroom", name: "Game room", colors: first(PURP), render(o) {
      const x = ctx(o), acc = hue(x.c, 150);
      return out(x, `${wall(x)}${wash(x, 100, 98, 96, 64)}${washC(x, 100, 120, 80, 30, acc, .14)}${backer(x, 24, 52, 176, 146)}
${tubes(x, word("GAME", 100, 80, 24), x.c, 3.6)}${tubes(x, word("ROOM", 100, 120, 24), acc, 3.6)}`);
    } }),

    base({ id: "gameon", name: "Game on", colors: first(LIME), glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), acc = hue(x.c, 180);
      const pad = "M64 50 C72 42 86 44 92 48 H108 C114 44 128 42 136 50 C146 62 152 88 144 94 C138 98 130 92 122 82 H78 C70 92 62 98 56 94 C48 88 54 62 64 50 Z";
      const dp = "M70 64 H84 M77 57 V71", bt = circ(124, 60, 3) + " " + circ(132, 68, 3);
      const t = word("GAME ON", 100, 130, 18);
      return out(x, `${wall(x)}${wash(x, 100, 92, 92, 66)}${contour(x, [pad, dp, bt].concat(t), 18, [[60, 70], [140, 70], [42, 130], [158, 130]])}
${tube(x, pad, x.c, 3.4)}${tube(x, dp, acc, 3)}${tube(x, bt, acc, 2.4)}${tubes(x, t, acc, 3)}`);
    } }),

    base({ id: "coffee", name: "Coffee", colors: first(WW), render(o) {
      const x = ctx(o), acc = hue(x.c, 25);
      const cup = "M70 100 H122 V110 C122 128 110 136 96 136 C82 136 70 128 70 110 Z", hd = "M122 106 C136 104 136 124 121 122", sau = "M60 144 H132";
      const steam = "M86 94 C80 86 92 82 86 74 M98 94 C92 86 104 82 98 74 M110 94 C104 86 116 82 110 74";
      return out(x, `${wall(x)}${wash(x, 100, 100, 92, 70)}${backer(x, 26, 34, 174, 156)}
${tubes(x, word("COFFEE", 100, 56, 17), acc, 3)}${grp("flick", tube(x, steam, x.c, 2.6), 1.3)}${tube(x, cup, x.c, 3.4)}${tube(x, hd, x.c, 3.4)}${tube(x, sau, acc, 3)}`);
    } }),

    base({ id: "home", name: "Home", colors: first(ICE), render(o) {
      const x = ctx(o), acc = hue(x.c, 160), w = word("H^ME", 100, 98, 36);
      return out(x, `${wall(x)}${wash(x, 100, 98, 94, 50)}${contour(x, w, 20, [[46, 82], [154, 82], [46, 114], [154, 114]])}
${tube(x, w[0], x.c, 4)}${tube(x, w[1], acc, 4)}${tube(x, w[2], x.c, 4)}${tube(x, w[3], x.c, 4)}`);
    } }),

    base({ id: "vibes", name: "Good vibes", colors: first(PINK), render(o) {
      const x = ctx(o), acc = hue(x.c, 210);
      return out(x, `${wall(x)}${wash(x, 100, 100, 96, 62)}${washC(x, 100, 118, 80, 26, acc, .14)}${backer(x, 22, 52, 178, 148, 10)}
${tubes(x, word("GOOD", 100, 76, 20), x.c, 3.2)}${tubes(x, word("VIBES", 100, 116, 30), acc, 4)}`);
    } }),

    base({ id: "hello", name: "Hello", colors: first(LIME), render(o) {
      const x = ctx(o), acc = hue(x.c, 120), w = word("HELLO", 100, 92, 30), tail = "M36 124 C60 116 80 132 104 122 C124 114 146 126 166 116";
      return out(x, `${wall(x)}${wash(x, 100, 100, 96, 56)}<g transform="rotate(-8 100 100)">${contour(x, w.concat([tail]), 18, [[40, 92], [160, 92], [100, 124]])}
${tubes(x, w, x.c, 3.8)}${tube(x, tail, acc, 2.8)}</g>`);
    } }),

    base({ id: "party", name: "Let's party", colors: first(PURP), render(o) {
      const x = ctx(o), a = word("LET'S", 100, 76, 20), b = word("PARTY", 100, 114, 28);
      const conf = [[36, 62], [164, 66], [44, 134], [158, 132], [100, 46]];
      const layer = (k) => { const c1 = k ? hue(x.c, k * 120) : x.c, c2 = hue(x.c, k * 120 + 60);
        return `<g class="hda-neon-c hda-neon-c${k}" style="animation-delay:-${[0, 4, 2][k]}s">${washC(x, 100, 96, 92, 56, c1, .2)}${tubes(x, a, c2, 3.2)}${tubes(x, b, c1, 3.8)}${conf.map(([p, q], i) => tube(x, `M${p} ${q} l${i % 2 ? 4 : -4} 4`, hue(c1, i * 70), 2.4)).join("")}</g>`; };
      return out(x, `${wall(x)}${backer(x, 22, 46, 178, 146)}${x.on ? layer(0) + layer(1) + layer(2) : layer(0)}`);
    } }),

    base({ id: "mancave", name: "Man cave", colors: first(RED), render(o) {
      const x = ctx(o), acc = hue(x.c, 200), a = word("MAN", 100, 84, 26), b = word("CAVE", 100, 124, 26);
      const mt = "M42 56 L62 36 L76 48 L96 26 L116 48 L130 38 L158 56";
      return out(x, `${wall(x, "#3a3448", .5)}${wash(x, 100, 90, 94, 66)}
${jumps(a)}${jumps(b)}${tube(x, mt, acc, 3)}${tubes(x, a, x.c, 4)}${tubes(x, b, x.c, 4)}
${glassKit(x, [[66, 70], [134, 70], [62, 130], [138, 130]], 152, 162, [140, 138])}`);
    } }),

    base({ id: "player", name: "Player 1 / 2", colors: first(ICE), render(o) {
      const x = ctx(o), acc = hue(x.c, 180);
      return out(x, `${wall(x)}${washC(x, 100, 78, 90, 30, x.c, .22)}${washC(x, 100, 120, 90, 30, acc, .22)}${backer(x, 18, 56, 182, 144)}
${tubes(x, word("PLAYER 1", 100, 80, 17), x.c, 3)}${tubes(x, word("PLAYER 2", 100, 120, 17), acc, 3)}
${tube(x, "M30 100 H170", "#ffffff", 1.4)}`);
    } }),

    base({ id: "heart", name: "Heart", colors: first(PINK), render(o) {
      const x = ctx(o), acc = hue(x.c, 40);
      const ht = "M100 150 C60 120 36 98 36 74 C36 56 50 44 66 44 C82 44 94 54 100 66 C106 54 118 44 134 44 C150 44 164 56 164 74 C164 98 140 120 100 150 Z";
      const sp = "M150 36 V48 M144 42 H156 M48 132 V140 M44 136 H52";
      return out(x, `${wall(x)}${wash(x, 100, 96, 92, 72)}${contour(x, [ht], 18, [[66, 52], [134, 52], [100, 138]])}${tube(x, ht, x.c, 4.4)}${tube(x, sp, acc, 2.2)}`);
    } }),

    base({ id: "bolt", name: "Lightning bolt", colors: first(WW), render(o) {
      const x = ctx(o), bt = "M114 30 L70 106 H98 L86 170 L134 86 H104 Z";
      return out(x, `${wall(x)}${wash(x, 102, 100, 70, 86, null, .65)}${grp("flick", tube(x, bt, x.c, 4.4), 2.1)}
${glassKit(x, [[104, 50], [82, 104], [120, 90], [92, 150]], 150, 160, [128, 96])}`);
    } }),

    base({ id: "palm", name: "Palm tree", colors: first(LIME), render(o) {
      const x = ctx(o), acc = hue(x.c, -60), sea = hue(x.c, 110);
      const tr = "M104 152 C102 124 98 98 102 72";
      const fr = "M102 72 C88 58 70 58 56 68 M102 72 C92 52 80 46 66 46 M102 72 C110 52 124 46 138 50 M102 72 C118 62 136 64 148 76 M102 72 C100 56 104 46 110 38";
      const wv = "M54 160 C70 152 84 166 100 158 C116 150 130 166 146 158";
      return out(x, `${wall(x)}${wash(x, 100, 100, 90, 72)}${contour(x, [tr, fr, wv], 16, [[60, 64], [140, 54], [100, 160]])}
${tube(x, tr, acc, 3.6)}${tube(x, fr, x.c, 3.4)}${tube(x, wv, sea, 3)}`);
    } }),

    base({ id: "cactus", name: "Cactus", colors: first(LIME), render(o) {
      const x = ctx(o), acc = hue(x.c, -80);
      const ca = "M92 150 V66 C92 54 108 54 108 66 V150 M92 112 H78 C72 112 70 108 70 102 V88 C70 82 78 82 78 88 V102 H92 M108 98 H122 C128 98 130 94 130 88 V76 C130 70 122 70 122 76 V90 H108";
      const pot = "M76 150 H124 L118 174 H82 Z";
      return out(x, `${wall(x)}${wash(x, 100, 108, 70, 80)}${backer(x, 48, 40, 152, 184, 8)}${tube(x, ca, x.c, 3.6)}${tube(x, pot, acc, 3.4)}`);
    } }),

    base({ id: "beer", name: "Beer mug", colors: first(WW), render(o) {
      const x = ctx(o), acc = hue(x.c, 180);
      const mug = "M70 72 H120 V150 C120 156 116 160 110 160 H80 C74 160 70 156 70 150 Z", hd = "M120 88 C140 88 140 130 120 130";
      const foam = "M66 72 C64 58 78 54 84 62 C88 50 104 50 108 60 C114 52 128 56 124 72", rib = "M84 88 V146 M96 88 V146 M108 88 V146";
      return out(x, `${wall(x)}${wash(x, 100, 106, 84, 74)}${contour(x, [mug, hd, foam], 16, [[70, 100], [130, 110], [96, 160]])}
${tube(x, mug, x.c, 3.6)}${tube(x, hd, x.c, 3.6)}${tube(x, rib, x.c, 2)}${tube(x, foam, acc, 3.4)}`);
    } }),

    base({ id: "cocktail", name: "Cocktail", colors: first(PINK), render(o) {
      const x = ctx(o), acc = hue(x.c, 220);
      const gl = "M54 52 H146 L100 106 Z M100 106 V154 M78 158 H122", lq = "M64 62 H136", ol = circ(112, 76, 6), pk = "M124 44 L104 86";
      return out(x, `${wall(x)}${wash(x, 100, 96, 84, 74)}${backer(x, 40, 34, 160, 172, 8)}${tube(x, gl, x.c, 3.6)}${tube(x, lq, x.c, 2.2)}${tube(x, pk, acc, 2.2)}${tube(x, ol, acc, 3)}`);
    } }),

    base({ id: "pizza", name: "Pizza slice", colors: first(RED), render(o) {
      const x = ctx(o), acc = hue(x.c, 40);
      const sl = "M60 56 C80 44 120 44 140 56 L100 166 Z", cr = "M64 66 C84 56 116 56 136 66";
      const pep = circ(92, 84, 7) + " " + circ(114, 98, 6) + " " + circ(98, 128, 5);
      return out(x, `${wall(x)}${wash(x, 100, 100, 74, 80)}${contour(x, [sl], 16, [[70, 60], [130, 60], [100, 150]])}${tube(x, sl, acc, 3.8)}${tube(x, cr, acc, 3)}${tube(x, pep, x.c, 2.8)}`);
    } }),

    base({ id: "rainbow", name: "Rainbow", colors: first(PURP), glow: { x: .5, y: .55, r: 1.2 }, render(o) {
      const x = ctx(o); let arcs = "";
      [62, 50, 38, 26].forEach((r, k) => { arcs += tube(x, `M${100 - r} 140 A${r} ${r} 0 0 1 ${100 + r} 140`, hue(x.c, -k * 45), 3.6); });
      const cl = (cx) => `M${cx - 18} 150 C${cx - 24} 140 ${cx - 12} 132 ${cx - 6} 138 C${cx - 2} 128 ${cx + 14} 130 ${cx + 12} 140 C${cx + 22} 140 ${cx + 22} 150 ${cx + 14} 150 Z`;
      return out(x, `${wall(x)}${wash(x, 100, 112, 92, 60)}${backer(x, 20, 60, 180, 166, 10)}${arcs}${tube(x, cl(38), "#f4f0ff", 3)}${tube(x, cl(162), "#f4f0ff", 3)}`);
    } }),

    base({ id: "pixel", name: "Pixel critter", colors: first(ICE), render(o) {
      const x = ctx(o), acc = hue(x.c, 150);
      const body = "M68 150 V86 H76 V70 H84 V62 H116 V70 H124 V86 H132 V150 H124 V142 H116 V150 H108 V142 H100 V150 H92 V142 H84 V150 H76 V142 H68";
      const eyes = "M82 92 H96 V106 H82 Z M104 92 H118 V106 H104 Z", pup = "M88 98 H92 V102 H88 Z M110 98 H114 V102 H110 Z", ant = "M100 62 V50 M94 46 H106";
      return out(x, `${wall(x)}${wash(x, 100, 104, 70, 70)}${backer(x, 44, 32, 156, 170, 8)}${tube(x, body, x.c, 3.6)}${tube(x, eyes, acc, 2.8)}${tube(x, pup, "#ffffff", 2.2)}${tube(x, ant, acc, 2.8)}`);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "neon",
    tab: "Neon signs",
    group: "Lights",
    kind: "light",
    intro: "Twenty neon signs people hang at home: on clear acrylic boards with standoffs, a few as real glass neon with tube supports and a transformer, and one on a brick bar wall. Lit tubes glow white-hot into the light color and wash the wall.",
    
    css: `.hda-neon-c{opacity:0}.hda-neon-c0{opacity:1}
.hda-anim .hda-neon-c{animation:hda-neon-cyc 6s ease-in-out infinite}
.hda-anim .hda-neon-blink{animation:hda-neon-blink 2.4s linear infinite}
.hda-anim .hda-neon-flick{animation:hda-neon-flick 7s linear infinite}
@keyframes hda-neon-cyc{0%,28%{opacity:1}36%,92%{opacity:0}100%{opacity:1}}
@keyframes hda-neon-blink{0%,46%{opacity:1}50%,96%{opacity:.18}100%{opacity:1}}
@keyframes hda-neon-flick{0%,58%,64%,100%{opacity:1}60%{opacity:.35}61%{opacity:.9}62%{opacity:.5}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-neon-c,.hda-anim .hda-neon-blink,.hda-anim .hda-neon-flick{animation:none}}`,
    icons,
  });
})();
