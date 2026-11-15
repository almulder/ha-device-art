(function () {
  const P = "hda-kitchen2-";
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const SS = "#c3c8ce", WH = "#f1f1ee", BK = "#26282c", BS = "#5b5f66";
  const isSteel = (c) => [SS, BS].indexOf(String(c).toLowerCase()) >= 0;
  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${st(stops)}</radialGradient>`;

  function ctx(o) {
    const c = o.color || WH, on = !!o.on, lv = o.level == null ? .6 : Math.max(0, Math.min(1, o.level));
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, lv, id, url, steel: isSteel(c), B: .45 + .55 * lv };
  }
  function defs(x, extra) {
    const { c, id } = x;
    return `<defs>
${lg(id("f"), x.steel ? [[0, H.shade(c, -.25)], [.15, H.shade(c, .35)], [.5, c], [.85, H.shade(c, .15)], [1, H.shade(c, -.3)]] : [[0, H.shade(c, -.16)], [.2, H.shade(c, .12)], [.6, c], [1, H.shade(c, -.2)]])}
${lg(id("fv"), [[0, H.shade(c, .18)], [1, H.shade(c, -.15)]], 1)}
${lg(id("side"), [[0, H.shade(c, -.4)], [1, H.shade(c, -.6)]])}
<pattern id="${id("br")}" width="4" height="40" patternUnits="userSpaceOnUse"><rect width=".5" height="40" fill="#fff" fill-opacity=".16"/><rect x="1.6" width=".4" height="40" fill="#000" fill-opacity=".1"/><rect x="2.8" width=".6" height="40" fill="#fff" fill-opacity=".08"/></pattern>
${lg(id("ss"), [[0, "#5d646c"], [.35, "#eef1f4"], [.6, "#a9b0b8"], [1, "#4e545b"]])}
${lg(id("ssv"), [[0, "#eef1f4"], [.5, "#a9b0b8"], [1, "#5a6067"]], 1)}
${lg(id("bk"), [[0, "#14151a"], [.4, "#3a3c44"], [1, "#0e0f12"]])}
${lg(id("bkv"), [[0, "#3a3c44"], [1, "#101115"]], 1)}
${lg(id("glass"), [[0, "#dfe9f2", .38], [.3, "#ffffff", .1], [.7, "#ffffff", .05], [1, "#dfe9f2", .32]])}
${lg(id("cof"), [[0, "#6b3d1e"], [1, "#2a160a"]], 1)}
${lg(id("beer"), [[0, "#f6c453"], [1, "#c98a1a"]], 1)}
${lg(id("wall"), [[0, "#4b4566"], [1, "#3a3550"]], 1)}
${lg(id("tile"), [[0, "#e9e6df"], [1, "#cfcbc2"]], 1)}
${lg(id("ctr"), [[0, "#d7d3e0"], [.5, "#a9a5ba"], [1, "#c4c0d0"]])}
${lg(id("floor"), [[0, "#7a7684"], [1, "#4a4656"]], 1)}
${rg(id("sh"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("lit"), [[0, "#bfe4ff", .9], [1, "#bfe4ff", 0]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const garage = (x) => `<g class="hda-bg"><rect width="200" height="176" fill="${x.url("wall")}" opacity=".6"/><rect x="0" y="168" width="200" height="8" fill="#9a96a6" opacity=".5"/><rect x="0" y="176" width="200" height="24" fill="${x.url("floor")}"/>${[40, 100, 160].map((xx) => `<path d="M${xx} 176 L${xx + (xx - 100) * .6} 200" stroke="#000" stroke-opacity=".18"/>`).join("")}</g>`;
  const kitchen = (x) => { let t = ""; for (let r = 0; r < 12; r++) { const y = 10 + r * 12; t += `<path d="M0 ${y} H200" stroke="#9c968a" stroke-opacity=".5"/>`; for (let c = 0; c < 9; c++) t += `<path d="M${(c * 26 + (r % 2) * 13) % 210} ${y} V${y + 12}" stroke="#9c968a" stroke-opacity=".5"/>`; }
    return `<g class="hda-bg"><rect width="200" height="158" fill="${x.url("tile")}" opacity=".85"/>${t}<rect x="0" y="0" width="200" height="158" fill="#2c2840" opacity=".45"/>
<rect x="0" y="156" width="200" height="8" fill="${x.url("ctr")}"/><path d="M0 156.5 H200" stroke="#fff" stroke-opacity=".6"/><rect x="0" y="164" width="200" height="36" fill="#2a2638"/></g>`; };
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 4}" fill="${x.url("sh")}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const panel = (x, X, Y, W, Hh, r) => `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${r || 3}" fill="${x.url("f")}"/>${x.steel ? `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${r || 3}" fill="${x.url("br")}"/>` : ""}`;
  const led = (x, cx, cy, col) => x.on ? `<circle cx="${cx}" cy="${cy}" r="4" fill="${col}" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="1.6" fill="${col}"/>` : `<circle cx="${cx}" cy="${cy}" r="1.3" fill="#2c3038"/>`;
  const SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g" };
  function digits(str, X, Y, h, col) {
    const w = h * .55, t = Math.max(.6, h * .15); let s = "", xx = X;
    for (const ch of str) { if (ch === ":") { s += `<rect x="${f(xx)}" y="${f(Y + h * .25)}" width="${f(t)}" height="${f(t)}" fill="${col}"/><rect x="${f(xx)}" y="${f(Y + h * .65)}" width="${f(t)}" height="${f(t)}" fill="${col}"/>`; xx += t * 2.4; continue; }
      const g = SEG[ch] || "";
      const sg = { a: [xx + t, Y, w - 2 * t, t], d: [xx + t, Y + h - t, w - 2 * t, t], g: [xx + t, Y + h / 2 - t / 2, w - 2 * t, t], f: [xx, Y + t * .6, t, h / 2 - t], b: [xx + w - t, Y + t * .6, t, h / 2 - t], e: [xx, Y + h / 2 + t * .4, t, h / 2 - t], c: [xx + w - t, Y + h / 2 + t * .4, t, h / 2 - t] };
      for (const k of g) { const [a, b, c, d] = sg[k]; s += `<rect x="${f(a)}" y="${f(b)}" width="${f(c)}" height="${f(d)}" fill="${col}"/>`; } xx += w + t * 1.4; }
    return s;
  }
  const disp = (x, X, Y, W, Hh, str, col) => `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="1.4" fill="#07080b"/>${x.on ? `<g opacity="${x.B.toFixed(2)}">${digits(str, X + 2, Y + Hh * .2, Hh * .6, col || "#7fd3ff")}</g>` : ""}`;
  const drip = (x, cx, y1, y2, col) => x.on ? [0, 1, 2].map((i) => `<path class="${P}drop" style="animation-delay:-${(i * .33).toFixed(2)}s" d="M${cx} ${y1} V${y1 + 4}" stroke="${col || "#6b3d1e"}" stroke-width="1.6" stroke-linecap="round"/>`).join("") + `<path d="M${cx} ${y1} V${y2}" stroke="${col || "#6b3d1e"}" stroke-width=".8" opacity=".5"/>` : "";
  const steam = (x, cx, y) => x.on ? [0, 1, 2].map((i) => `<path class="${P}steam" style="animation-delay:-${(i * .9).toFixed(1)}s" d="M${cx + (i - 1) * 5} ${y} C${cx + (i - 1) * 5 - 4} ${y - 6} ${cx + (i - 1) * 5 + 4} ${y - 10} ${cx + (i - 1) * 5} ${y - 16}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>`).join("") : "";
  const frost = (x, x0, x1, y) => x.on ? `<path class="${P}frost" d="M${x0} ${y} C${x0 + 10} ${y - 5} ${x1 - 10} ${y - 5} ${x1} ${y}" fill="none" stroke="#e8f6ff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>` : "";
  function carafe(x, X, Y, W, Hh, thermal) {
    const fill = x.on ? .25 + .65 * x.lv : .2;
    if (thermal) return `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="4" fill="${x.url("ss")}"/><rect x="${X}" y="${Y}" width="${W}" height="5" rx="2" fill="${x.url("bk")}"/>`;
    const fy = Y + Hh * (1 - fill);
    return `<path d="M${X} ${Y + 6} C${X} ${Y + 2} ${X + 4} ${Y} ${X + 8} ${Y} H${X + W - 8} C${X + W - 4} ${Y} ${X + W} ${Y + 2} ${X + W} ${Y + 6} V${Y + Hh - 4} C${X + W} ${Y + Hh} ${X + W - 4} ${Y + Hh} ${X + W - 8} ${Y + Hh} H${X + 8} C${X + 4} ${Y + Hh} ${X} ${Y + Hh} ${X} ${Y + Hh - 4} Z" fill="#20242c" opacity=".35"/>
<rect x="${X + 1}" y="${f(fy)}" width="${W - 2}" height="${f(Y + Hh - fy - 1)}" rx="3" fill="${x.url("cof")}"/>
<path d="M${X} ${Y + 6} C${X} ${Y + 2} ${X + 4} ${Y} ${X + 8} ${Y} H${X + W - 8} C${X + W - 4} ${Y} ${X + W} ${Y + 2} ${X + W} ${Y + 6} V${Y + Hh - 4} C${X + W} ${Y + Hh} ${X + W - 4} ${Y + Hh} ${X + W - 8} ${Y + Hh} H${X + 8} C${X + 4} ${Y + Hh} ${X} ${Y + Hh} ${X} ${Y + Hh - 4} Z" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>
<path d="M${X + W} ${Y + 8} C${X + W + 10} ${Y + 8} ${X + W + 10} ${Y + Hh - 8} ${X + W} ${Y + Hh - 8}" fill="none" stroke="#1a1b20" stroke-width="3.4"/><rect x="${X - 1}" y="${Y - 3}" width="${W + 2}" height="5" rx="2" fill="#1a1b20"/>${hl(`M${X + 3} ${Y + 8} V${Y + Hh - 6}`, .45, 1.2)}`;
  }
  function mug(x, X, Y, col, fill) {
    return `<path d="M${X} ${Y} H${X + 18} V${Y + 16} C${X + 18} ${Y + 20} ${X + 15} ${Y + 22} ${X + 11} ${Y + 22} H${X + 7} C${X + 3} ${Y + 22} ${X} ${Y + 20} ${X} ${Y + 16} Z" fill="${col || "#e9e6df"}"/>
<path d="M${X + 18} ${Y + 4} C${X + 25} ${Y + 4} ${X + 25} ${Y + 14} ${X + 18} ${Y + 14}" fill="none" stroke="${col || "#e9e6df"}" stroke-width="2.6"/>${fill ? `<ellipse cx="${X + 9}" cy="${Y + 2}" rx="8" ry="1.6" fill="#3a1e0c"/>` : ""}${hl(`M${X + 2.5} ${Y + 3} V${Y + 16}`, .45, 1.2)}`;
  }
  function tower(x, cx, y, taps) {
    let s = `<rect x="${cx - 5}" y="${y}" width="10" height="26" rx="2" fill="${x.url("ss")}"/><path d="M${cx - 12} ${y} H${cx + 12}" stroke="${x.url("ss")}" stroke-width="6" stroke-linecap="round"/>`;
    const xs = taps === 1 ? [cx] : taps === 2 ? [cx - 10, cx + 10] : [cx - 14, cx, cx + 14];
    if (taps > 1) s = `<rect x="${cx - 5}" y="${y + 4}" width="10" height="22" rx="2" fill="${x.url("ss")}"/><path d="M${xs[0]} ${y} H${xs[xs.length - 1]}" stroke="${x.url("ss")}" stroke-width="7" stroke-linecap="round"/>`;
    xs.forEach((tx) => { s += `<rect x="${tx - 2}" y="${y + 2}" width="4" height="9" rx="1" fill="${x.url("ss")}"/><rect x="${tx - 1.6}" y="${y - 13}" width="3.2" height="13" rx="1.4" fill="#1a1b20"/>`; });
    return { s, xs };
  }
  function glassPour(x, cx, yTap, yBase) {
    const g = yBase - 26, fill = x.on ? .3 + .6 * x.lv : .0;
    return `${x.on ? `<path class="${P}pour" d="M${cx} ${yTap} V${g + 26 - 26 * fill}" stroke="#f6c453" stroke-width="2" stroke-dasharray="3 2"/>` : ""}
<path d="M${cx - 8} ${g} L${cx - 6} ${yBase} H${cx + 6} L${cx + 8} ${g} Z" fill="#20242c" opacity=".3"/>
${fill ? `<path d="M${f(cx - 8 + 2 * (1 - fill))} ${f(yBase - 26 * fill)} L${cx - 6} ${yBase} H${cx + 6} L${f(cx + 8 - 2 * (1 - fill))} ${f(yBase - 26 * fill)} Z" fill="${x.url("beer")}"/><rect x="${f(cx - 7.6 + 2 * (1 - fill))}" y="${f(yBase - 26 * fill - 3)}" width="${f(15.2 - 4 * (1 - fill))}" height="3" rx="1.4" fill="#fffaf0"/>` : ""}
<path d="M${cx - 8} ${g} L${cx - 6} ${yBase} H${cx + 6} L${cx + 8} ${g} Z" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/>`;
  }

  const base = (o) => Object.assign({ picker: true, colorLabel: "Finish" }, o);
  // (multi-function) coffee makers: State (stage: off / heating / brewing / ready), Water level (value, %) where the
  // drawing has a reservoir window, Warming plate (switch) under a carafe. As a Device Image (no o.mf) the drawing is
  // exactly as today. As a Multi-Function Image (o.mf): heating = the display and light on; brewing = the coffee drips,
  // the carafe or cup fills, steam; ready = a full carafe or cup, steam, no drips; a part left out = off / blank.
  function CF(o) {
    const x = ctx(o);
    if (!o.mf) return { x, D: x, B: x, S: x, C: x, cup: x.on, wl: x.lv, mf: false };
    const s = o.pval && o.pval.state != null ? String(o.pval.state) : "", brew = s === "brewing", rdy = s === "ready";
    const w = o.pval && o.pval.water != null && isFinite(+o.pval.water) ? Math.max(0, Math.min(1, +o.pval.water / 100)) : null;
    const v = (on, lv) => Object.assign({}, x, { on }, lv == null ? {} : { lv });
    return { x, D: v(!!s && s !== "idle"), B: v(brew), S: v(brew || rdy), C: v(brew || rdy, rdy ? 1 : .45), cup: brew || rdy, wl: w, mf: true, pl: !!(o.parts && o.parts.plate) };
  }
  // the warming plate: today's dark plate, glowing red-orange when a Multi-Function Image has it on
  const plate = (V, X, Y, W, Hh) => `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="2" fill="${V.mf && V.pl ? "#e0522e" : "#1a1b20"}"/>` + (V.mf && V.pl ? `<ellipse cx="${X + W / 2}" cy="${Y + 1}" rx="${W / 2 + 4}" ry="5" fill="#ff6a3a" opacity=".35"/>` : "");

  const icons = [
    base({ id: "7-cu-ft-chest-freezer", name: "7 cu ft chest freezer", colors: [WH, BK, SS], render(o) {
      const x = ctx(o);
      return svg(x, garage(x) + shadow(x, 100, 176, 76) + `
<path d="M170 100 L178 104 V174 H170 Z" fill="${x.url("side")}"/>${panel(x, 26, 100, 144, 74, 6)}<rect x="26" y="164" width="144" height="10" rx="3" fill="#1d1e24" opacity=".7"/>
<path d="M30 88 H166 C172 88 174 92 174 96 V104 H22 V96 C22 92 24 88 30 88 Z" fill="${x.url("fv")}"/>${hl("M30 89 H166", .55, 1.2)}
<rect x="80" y="100" width="40" height="5" rx="2.5" fill="#000" opacity=".25"/><circle cx="150" cy="150" r="6" fill="#d9d6e0"/><path d="M150 146 V150" stroke="#555" stroke-width="1.6"/>
${led(x, 136, 150, "#5be08a")}${frost(x, 40, 160, 104)}`);
    } }),
    base({ id: "5-cu-ft-chest-freezer", name: "5 cu ft chest freezer", colors: [BK, WH], render(o) {
      const x = ctx(o);
      return svg(x, garage(x) + shadow(x, 100, 176, 56) + `
<path d="M150 108 L157 112 V174 H150 Z" fill="${x.url("side")}"/>${panel(x, 50, 108, 100, 66, 5)}<rect x="50" y="164" width="100" height="10" rx="3" fill="#0d0e12" opacity=".7"/>
<path d="M54 96 H146 C151 96 154 99 154 103 V110 H46 V103 C46 99 49 96 54 96 Z" fill="${x.url("fv")}"/>${hl("M54 97 H146", .45, 1.2)}
<rect x="88" y="108" width="24" height="4" rx="2" fill="#000" opacity=".3"/><circle cx="136" cy="150" r="5" fill="#9a96a6"/>${led(x, 124, 150, "#5be08a")}${frost(x, 60, 140, 110)}`);
    } }),
    base({ id: "3-5-cu-ft-chest-freezer", name: "3.5 cu ft chest freezer", colors: [WH, BK, "#c9c5d6"], render(o) {
      const x = ctx(o);
      return svg(x, garage(x) + shadow(x, 100, 176, 46) + `
<path d="M140 116 L146 120 V174 H140 Z" fill="${x.url("side")}"/>${panel(x, 60, 116, 80, 58, 5)}<rect x="60" y="166" width="80" height="8" rx="3" fill="#1d1e24" opacity=".7"/>
<path d="M64 104 H136 C141 104 144 107 144 111 V118 H56 V111 C56 107 59 104 64 104 Z" fill="${x.url("fv")}"/>${hl("M64 105 H136", .55, 1.2)}
<path d="M90 118 Q100 122 110 118" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/><circle cx="128" cy="156" r="5" fill="#d9d6e0"/><path d="M128 152 V156" stroke="#555" stroke-width="1.4"/>
${led(x, 116, 156, "#5be08a")}${frost(x, 66, 134, 118)}`);
    } }),

    base({ id: "13-cu-ft-upright-freezer", name: "13 cu ft upright freezer", colors: [SS, WH, BK], render(o) {
      const x = ctx(o);
      return svg(x, garage(x) + shadow(x, 100, 176, 48) + `
<path d="M138 22 L145 25 V174 H138 Z" fill="${x.url("side")}"/><rect x="62" y="22" width="76" height="152" rx="3" fill="#141519"/>
${panel(x, 62, 22, 76, 12, 2)}${disp(x, 92, 25, 16, 7, "-2")}${panel(x, 62, 35, 76, 135, 2)}<rect x="62" y="170" width="76" height="4" fill="#1d1e24"/>
<rect x="66" y="56" width="4" height="70" rx="2" fill="${x.url("ss")}"/>${hl("M64 37 H136", .5, 1)}${x.on ? `<path d="M62 34.5 H138" stroke="#e8f6ff" stroke-opacity=".3"/>` : ""}`);
    } }),
    base({ id: "garage-ready-upright", name: "Garage-ready upright", colors: [WH, SS, BK], render(o) {
      const x = ctx(o);
      return svg(x, garage(x) + shadow(x, 100, 176, 50) + `
<path d="M140 14 L147 17 V174 H140 Z" fill="${x.url("side")}"/><rect x="60" y="14" width="80" height="160" rx="3" fill="#141519"/>
${panel(x, 60, 14, 80, 156, 3)}<rect x="60" y="166" width="80" height="8" rx="2" fill="#1d1e24"/><rect x="66" y="164" width="68" height="3" fill="#000" opacity=".5"/>
<rect x="130" y="44" width="4.6" height="80" rx="2.3" fill="${x.url("ss")}"/>${hl("M63 17 V160", .4, 1.2)}<rect x="74" y="24" width="18" height="5" rx="1" fill="#9a96a6" opacity=".5"/>
${led(x, 118, 26, "#5be08a")}`);
    } }),
    base({ id: "compact-upright-freezer", name: "Compact upright freezer", colors: [BK, WH, SS], render(o) {
      const x = ctx(o);
      return svg(x, garage(x) + shadow(x, 100, 176, 40) + `
<path d="M132 88 L138 91 V174 H132 Z" fill="${x.url("side")}"/>${panel(x, 68, 88, 64, 86, 4)}<rect x="68" y="168" width="64" height="6" rx="2" fill="#0d0e12"/>
<path d="M126 96 V150" stroke="#000" stroke-opacity=".4" stroke-width="3"/><path d="M127.6 96 V150" stroke="#fff" stroke-opacity=".2"/>${hl("M71 91 V164", .35, 1)}${led(x, 76, 96, "#5be08a")}${frost(x, 74, 126, 88)}`);
    } }),

    base({ id: "single-tap-kegerator", name: "Single-tap kegerator", colors: [SS, BK], render(o) {
      const x = ctx(o), T = tower(x, 100, 54, 1);
      return svg(x, garage(x) + shadow(x, 100, 176, 46) + `
<rect x="60" y="80" width="80" height="88" rx="3" fill="${x.url("bk")}"/><rect x="60" y="78" width="80" height="6" rx="2" fill="${x.url("ss")}"/><rect x="82" y="76" width="36" height="5" rx="1.5" fill="#1a1b20"/>
${panel(x, 64, 88, 72, 76, 2)}<rect x="128" y="96" width="3.6" height="54" rx="1.8" fill="${x.url("ss")}"/>
${[70, 130].map((cx) => `<circle cx="${cx}" cy="171" r="4" fill="#1a1b20"/>`).join("")}${T.s}${glassPour(x, 100, 65, 78)}${led(x, 70, 94, "#5be08a")}`);
    } }),
    base({ id: "dual-tap-kegerator", name: "Dual-tap kegerator", colors: [SS, BK], render(o) {
      const x = ctx(o), T = tower(x, 100, 52, 2);
      return svg(x, garage(x) + shadow(x, 100, 176, 46) + `
${panel(x, 58, 78, 84, 92, 3)}<rect x="58" y="76" width="84" height="6" rx="2" fill="${x.url("ss")}"/><rect x="76" y="74" width="48" height="5" rx="1.5" fill="#1a1b20"/>
<rect x="62" y="86" width="76" height="78" rx="2" fill="none" stroke="#000" stroke-opacity=".25"/><rect x="132" y="94" width="3.6" height="56" rx="1.8" fill="${x.url("ss")}"/>
${[68, 132].map((cx) => `<circle cx="${cx}" cy="172" r="4" fill="#1a1b20"/>`).join("")}${T.s}${glassPour(x, T.xs[0], 63, 76)}${led(x, 70, 92, "#5be08a")}`);
    } }),
    base({ id: "keg-backbar", name: "Back-bar 2-Door Keg", colors: [BK, SS], render(o) {
      const x = ctx(o), T = tower(x, 100, 70, 3);
      return svg(x, garage(x) + shadow(x, 100, 176, 80) + `
${panel(x, 22, 96, 156, 74, 3)}<rect x="22" y="94" width="156" height="6" rx="2" fill="${x.url("ss")}"/><rect x="74" y="92" width="52" height="5" rx="1.5" fill="#1a1b20"/>
<rect x="26" y="104" width="72" height="60" rx="2" fill="${x.url("bkv")}" opacity=".35"/><rect x="102" y="104" width="72" height="60" rx="2" fill="${x.url("bkv")}" opacity=".35"/>
<rect x="90" y="110" width="3" height="40" rx="1.5" fill="${x.url("ss")}"/><rect x="107" y="110" width="3" height="40" rx="1.5" fill="${x.url("ss")}"/><rect x="22" y="166" width="156" height="8" fill="#0d0e12"/>
${T.s}${glassPour(x, T.xs[1], 81, 94)}${disp(x, 30, 108, 18, 8, "36", "#ff6a5a")}`);
    } }),

    base({ id: "12-cup-drip-maker", name: "12-cup drip maker", colors: [BK, WH, "#b8343a"], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 44) + `
${panel(x, 60, 46, 80, 110, 6)}<path d="M58 44 H142 C144 44 146 46 146 50 V64 H54 V50 C54 46 56 44 58 44 Z" fill="${x.url("fv")}"/>
<rect x="64" y="66" width="14" height="40" rx="2" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".3"/>${V.wl == null ? "" : `<rect x="65" y="${f(106 - 34 * (.4 + .4 * V.wl))}" width="12" height="${f(34 * (.4 + .4 * V.wl))}" fill="#9cc8e8" opacity=".5"/>`}
<rect x="82" y="66" width="54" height="10" rx="2" fill="#0d0e12"/>${disp(V.D, 98, 67, 22, 8, "7:30")}
${plate(V, 66, 150, 68, 5)}${carafe(V.C, 76, 106, 44, 44)}${drip(V.B, 98, 82, 106)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }, { id: "plate", name: "Warming plate" }] }),
    base({ id: "steel-drip-maker", name: "Steel drip maker", colors: [SS, BK, WH], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 44) + `
<rect x="58" y="34" width="84" height="122" rx="4" fill="${x.url("bk")}"/>${panel(x, 62, 36, 76, 70, 3)}
<rect x="76" y="44" width="48" height="16" rx="2" fill="#0d0e12"/>${V.D.on ? `<rect x="77" y="45" width="46" height="14" rx="1.5" fill="#3a6fd0" opacity="${(.3 + .5 * x.lv).toFixed(2)}"/>` : ""}${disp(V.D, 86, 47, 28, 10, "8:00", "#e8f6ff")}
${[72, 84, 116, 128].map((xx) => `<circle cx="${xx}" cy="70" r="2.6" fill="#1a1b20"/>`).join("")}${led(V.D, 100, 70, "#5fb0ff")}
${plate(V, 66, 150, 68, 5)}${carafe(V.C, 76, 106, 46, 44)}<rect x="75" y="112" width="48" height="4" fill="${x.url("ss")}"/>${drip(V.B, 99, 90, 106)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "plate", name: "Warming plate" }] }),
    base({ id: "copper-element-drip-brewer", name: "Copper-element drip brewer", colors: ["#3c5a4a", BK, SS, "#b8343a", "#e6dcc6"], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 50) + `
${panel(x, 52, 70, 26, 86, 4)}<rect x="50" y="146" width="96" height="10" rx="3" fill="${x.url("f")}"/>
<rect x="54" y="26" width="22" height="46" rx="3" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".4"/>${V.wl == null ? "" : `<rect x="55" y="${f(70 - 40 * (.3 + .5 * V.wl))}" width="20" height="${f(40 * (.3 + .5 * V.wl))}" fill="#9cc8e8" opacity=".45"/>`}<rect x="52" y="22" width="26" height="6" rx="2" fill="${x.url("f")}"/>
<path d="M76 32 H112 V38 H76 Z" fill="${x.url("ss")}"/><path d="M96 38 H128 L120 64 H104 Z" fill="${x.url("bkv")}"/><rect x="94" y="36" width="36" height="4" rx="2" fill="#1a1b20"/>
<rect x="60" y="134" width="12" height="5" rx="2" fill="${(V.mf ? V.pl : x.on) ? "#ff5a3a" : "#3a1a14"}"/>${V.mf && V.pl ? `<ellipse cx="112" cy="146" rx="26" ry="4.5" fill="#ff6a3a" opacity=".4"/>` : ""}${carafe(V.C, 92, 92, 40, 54)}${drip(V.B, 112, 66, 92)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }, { id: "plate", name: "Warming plate" }] }),

    base({ id: "classic-pod-brewer", name: "Classic pod brewer", colors: [BK, "#7a1f2a", "#24345e"], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 48) + `
<rect x="50" y="56" width="22" height="94" rx="6" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".4"/>${V.wl == null ? "" : `<rect x="51" y="${f(148 - 80 * (.3 + .6 * V.wl))}" width="20" height="${f(80 * (.3 + .6 * V.wl))}" rx="4" fill="#9cc8e8" opacity=".45"/>`}
${panel(x, 70, 50, 70, 104, 10)}<path d="M70 66 C70 48 140 44 140 64 V72 H70 Z" fill="${x.url("fv")}"/><rect x="92" y="54" width="28" height="7" rx="3.5" fill="#1a1b20"/>
<rect x="82" y="78" width="48" height="12" rx="3" fill="#0d0e12"/>${[90, 100, 110, 120].map((xx, i) => `<circle cx="${xx}" cy="84" r="2.4" fill="${V.D.on && i === 1 ? "#5fb0ff" : "#2c3038"}"/>`).join("")}
<rect x="80" y="144" width="52" height="8" rx="3" fill="#1a1b20"/>${mug(x, 94, 122, "#e9e6df", V.cup)}${drip(V.B, 104, 98, 122)}${steam(V.S, 104, 118)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }] }),
    base({ id: "mini-pod-brewer", name: "Mini pod brewer", colors: [BK, "#b9a6e6", WH, "#b8343a", "#2f8f8a"], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 30) + `
${panel(x, 84, 40, 32, 116, 8)}<path d="M84 52 C84 38 116 38 116 52 V58 H84 Z" fill="${x.url("fv")}"/><rect x="92" y="44" width="16" height="5" rx="2.5" fill="#1a1b20"/>
<rect x="84" y="66" width="32" height="24" fill="#000" opacity=".25"/><circle cx="100" cy="62" r="3" fill="${V.D.on ? "#5fb0ff" : "#2c3038"}"/>
<rect x="80" y="150" width="40" height="6" rx="3" fill="${x.url("f")}"/>${mug(x, 91, 126, "#e9e6df", V.cup)}${drip(V.B, 100, 90, 126)}${steam(V.S, 100, 122)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }] }),
    base({ id: "capsule-coffee-machine", name: "Capsule coffee machine", colors: ["#3a3c41", "#f0eee8", "#e6d6b8", "#7a1f2a"], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 40) + `
<rect x="112" y="64" width="22" height="88" rx="4" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".3"/>${V.mf && V.wl != null ? `<rect x="113" y="${f(151 - 80 * V.wl)}" width="20" height="${f(80 * V.wl)}" rx="3" fill="#9cc8e8" opacity=".45"/>` : ""}
${panel(x, 66, 72, 52, 84, 6)}<path d="M64 76 C64 58 78 48 96 48 C112 48 124 58 124 74 L120 80 H66 Z" fill="${x.url("ss")}"/><ellipse cx="96" cy="58" rx="18" ry="5" fill="#2c3038"/>
${V.D.on ? `<ellipse class="${P}pulse" cx="96" cy="58" rx="18" ry="5" fill="none" stroke="#fff" stroke-width="1.6" opacity="${x.B.toFixed(2)}"/>` : ""}
<rect x="70" y="148" width="48" height="6" rx="3" fill="#1a1b20"/><rect x="86" y="80" width="20" height="8" rx="2" fill="#1a1b20"/>${mug(x, 84, 124, "#f6f3ee", V.cup)}${drip(V.B, 96, 88, 124)}${steam(V.S, 93, 120)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }] }),
  ];

  const css = `.hda-anim .${P}drop{animation:${P}drop .8s linear infinite}
.hda-anim .${P}steam{animation:${P}steam 2.7s ease-in-out infinite}
.hda-anim .${P}frost{animation:${P}frost 4s ease-in-out infinite}
.hda-anim .${P}pour{animation:${P}pour .5s linear infinite}
.hda-anim .${P}pulse{animation:${P}frost 2.4s ease-in-out infinite}
@keyframes ${P}drop{0%{transform:translate(0,-4px);opacity:0}30%{opacity:1}100%{transform:translate(0,10px);opacity:0}}
@keyframes ${P}steam{0%{transform:translate(0,4px);opacity:0}40%{opacity:.8}100%{transform:translate(0,-8px);opacity:0}}
@keyframes ${P}frost{0%,100%{opacity:.25}50%{opacity:.8}}
@keyframes ${P}pour{from{stroke-dashoffset:0}to{stroke-dashoffset:-5}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}drop,.hda-anim .${P}steam,.hda-anim .${P}frost,.hda-anim .${P}pour,.hda-anim .${P}pulse{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "kitchen2", tab: "Freezers, kegs & coffee", group: "Appliances", kind: "device",
    levelLabel: "Level", onWord: "Running", offWord: "Off",
    intro: "Real chest and upright freezers, kegerators, drip and pod coffee makers. Running lights the power LED and display, pours from the tap and brews into the carafe or mug; the slider sets how full it gets.",
    
    css, icons,
  });
})();
