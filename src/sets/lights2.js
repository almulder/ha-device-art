(function () {
  const H = window.HDAH, P = "hda-lights2-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const AMBER = "#ffab4a", WARM = "#ffc477", SOFT = "#ffe2ad", DAY = "#eef4ff", RED = "#ff6b6b", GREEN = "#69db7c", BLUE = "#4dabf7", MULTI = "#ffd166";

  function ctx(o) {
    const c = o.color || WARM, on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .85], [.45, c, .3], [1, c, 0]])}
${rg(id("pool"), [[0, hot, .7], [.35, c, .4], [1, c, 0]])}
${rg(id("amb"), [[0, "#c8904a", .32], [.7, "#7a4e18", .5], [1, "#3e2408", .7]], .4, .35, .7)}
${rg(id("clr"), [[0, "#ffffff", .06], [.75, "#ffffff", .05], [1, "#ffffff", .22]], .4, .35, .7)}
${rg(id("lit"), [[0, "#ffffff", .9], [.35, hot, .6], [1, c, .3]], .5, .5, .6)}
${lg(id("wall"), [[0, "#4e4a52"], [1, "#2f2c34"]], 0, 0, 0, 1)}
${lg(id("ceil"), [[0, "#2a2830"], [1, "#3e3b44"]], 0, 0, 0, 1)}
${lg(id("floor"), [[0, "#5a4430"], [1, "#2e2218"]], 0, 0, 0, 1)}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("blk"), [[0, "#0d0d12"], [.28, "#363743"], [.42, "#555766"], [.72, "#1f2029"], [1, "#09090d"]])}
${lg(id("fir"), [[0, "#2f6a3a"], [1, "#143a22"]], 0, 0, 0, 1)}
${lg(id("firw"), [[0, "#e9eef0"], [1, "#a9b8b4"]], 0, 0, 0, 1)}
${rg(id("sh"), [[0, "#000", .6], [.6, "#000", .22], [1, "#000", 0]])}
${extra || ""}</defs>`;
  }
  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1c1b24"/>${s.bg || ""}</g>${x.on ? s.light || "" : ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}${x.on ? s.over || "" : ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }
  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const glo = (x, cx, cy, rx, ry, k) => x.on ? E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(k)}"`) : "";
  const shadow = (x, cx, cy, rx, ry, k) => E(cx, cy, rx, ry, x.url("sh"), `opacity="${k == null ? .8 : k}"`);
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const wallBg = (x, y1) => `<rect x="8" y="8" width="184" height="${(y1 || 192) - 8}" fill="${x.url("wall")}"/>` + (() => { const r = rnd(7); let s = ""; for (let i = 0; i < 40; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * ((y1 || 192) - 14))}" r="${f(.3 + r() * .6)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`; return s; })();
  function floor(x, y0) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("floor")}"/><rect x="8" y="${y0 - 3}" width="184" height="3.4" fill="#d8d4cc" fill-opacity=".55"/>`;
    for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9; s += `<path d="M${f(100 + (bx - 100) * .6)} ${y0} L${f(bx + (bx - 100) * .35)} 192" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`; }
    return s;
  }
  const fil = (x, d, w) => x.on ? `<path d="${d}" fill="none" stroke="${x.c}" stroke-width="${f((w || 1) * 3)}" stroke-opacity="${x.op(.55)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width="${f((w || 1) * 1.1)}" stroke-opacity="${(.5 + .5 * x.L).toFixed(2)}" stroke-linecap="round"/>`
    : `<path d="${d}" fill="none" stroke="#8a6438" stroke-width="${f((w || 1) * .9)}" stroke-linecap="round"/>`;
  const cord = (x, cx, y0, y1, sock) => `<path d="M${cx} ${y0} V${y1 - (sock || 12)}" stroke="#1a1a1e" stroke-width="2"/><path d="M${cx - .4} ${y0} V${y1 - (sock || 12)}" stroke="#fff" stroke-opacity=".15" stroke-width=".6" stroke-dasharray="1.4 1.4"/>
<rect x="${cx - 5}" y="${y1 - (sock || 12)}" width="10" height="${sock || 12}" rx="1.6" fill="${x.url("blk")}"/><path d="M${cx - 5} ${y1 - 4} H${cx + 5}" stroke="#fff" stroke-opacity=".15"/>`;
  const glass = (x, d, amber) => `<path d="${d}" fill="${x.url(amber ? "amb" : "clr")}"/>${x.on ? `<path d="${d}" fill="${x.url("lit")}" opacity="${x.op(.75)}"/>` : ""}<path d="${d}" fill="none" stroke="${amber ? "#e8b060" : "#e8e4f0"}" stroke-opacity=".5" stroke-width=".7"/>`;
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "around" }, o);
  const FIL = [AMBER, WARM, SOFT, DAY, "#ff8f5a"];

  function tree(x, o) {
    const r = rnd(o.seed), L = x.L; let t = "";
    const tiers = o.tiers, white = o.flock;
    tiers.forEach(([top, hw, bot]) => {
      t += `<path d="M${o.cx} ${top} C${f(o.cx - hw * .4)} ${f(top + (bot - top) * .5)} ${f(o.cx - hw * .8)} ${bot - 6} ${o.cx - hw} ${bot} Q${o.cx} ${bot + 6} ${o.cx + hw} ${bot} C${f(o.cx + hw * .8)} ${bot - 6} ${f(o.cx + hw * .4)} ${f(top + (bot - top) * .5)} ${o.cx} ${top} Z" fill="${x.url(white ? "firw" : "fir")}"/>`;
      for (let i = 0; i < 22; i++) { const yy = top + 5 + r() * (bot - top - 3), half = hw * (yy - top) / (bot - top), xx = o.cx + (r() - .5) * 2 * half;
        t += `<path d="M${f(xx)} ${f(yy)} l${f((r() - .5) * 5)} ${f(2.5 + r() * 3)}" stroke="${white ? (r() > .5 ? "#ffffff" : "#7e958e") : (r() > .5 ? "#3d7a44" : "#0c2414")}" stroke-width="1.1" stroke-linecap="round"/>`; }
      if (!white && o.dust) for (let i = 0; i < 10; i++) { const yy = top + 4 + r() * (bot - top - 4), half = hw * (yy - top) / (bot - top); t += `<circle cx="${f(o.cx + (r() - .5) * 2 * half)}" cy="${f(yy)}" r="1.4" fill="#fff" fill-opacity=".7"/>`; }
    });
    const y0 = tiers[0][0], y1 = tiers[tiers.length - 1][2], wmax = tiers[tiers.length - 1][1];
    let bulbs = "";
    for (let i = 0; i < o.n; i++) {
      const tt = r(), yy = y0 + 6 + tt * (y1 - y0 - 6), half = (4 + tt * wmax) * .82, xx = o.cx + (r() - .5) * 2 * half, d = (r() * 2.2).toFixed(2);
      const col = o.multi ? [RED, GREEN, BLUE, MULTI, "#ff9ff3"][i % 5] : x.c, hot = H.mix(col, "#fff", .55);
      bulbs += x.on ? `<g class="${P}tw" style="animation-delay:-${d}s"><circle cx="${f(xx)}" cy="${f(yy)}" r="${o.br || 1.6}" fill="${hot}" fill-opacity="${(.5 + .5 * L).toFixed(2)}"/><circle cx="${f(xx)}" cy="${f(yy)}" r="${f((o.br || 1.6) * 3.2)}" fill="${col}" fill-opacity="${(.28 * L).toFixed(2)}"/></g>`
        : `<circle cx="${f(xx)}" cy="${f(yy)}" r="${f((o.br || 1.6) * .9)}" fill="#d8d4c8" fill-opacity=".45"/>`;
    }
    const star = `<path d="M${o.cx} ${y0 - 12} l2.6 6.4 h6.6 l-5.2 4 l2 6.4 l-6 -4 l-6 4 l2 -6.4 l-5.2 -4 h6.6 Z" fill="${x.on ? x.hot : "#c9a24a"}"/>${x.on ? `<circle cx="${o.cx}" cy="${y0 - 4}" r="11" fill="${x.url("halo")}" opacity="${x.op(1)}"/>` : ""}`;
    return { t, bulbs, star, glow: x.on ? `<ellipse cx="${o.cx}" cy="${f((y0 + y1) / 2)}" rx="${f(wmax * 1.5)}" ry="${f((y1 - y0) * .62)}" fill="${x.url("halo")}" opacity="${x.op(.45)}"/>` : "" };
  }

  const icons = [
    base({ id: "g40", name: "G40 amber globe", colors: FIL, glow: { x: .5, y: .56, r: 1.1 }, render(o) {
      const x = ctx(o), cx = 100, cy = 112, R = 40;
      const g = `M${cx - 7} ${cy - R + 2} C${cx - 7} ${cy - R + 6} ${cx - R} ${cy - 22} ${cx - R} ${cy} A${R} ${R} 0 0 0 ${cx + R} ${cy} C${cx + R} ${cy - 22} ${cx + 7} ${cy - R + 6} ${cx + 7} ${cy - R + 2} Z`;
      let fl = ""; [-14, -5, 5, 14].forEach((dx) => { fl += fil(x, `M${cx + dx * .3} ${cy - 30} L${cx + dx} ${cy - 6} L${cx + dx} ${cy + 18}`, 1); });
      fl += `<path d="M${cx} ${cy - 34} V${cy - 30}" stroke="#d8d0c0" stroke-width="1"/><path d="M${cx - 4} ${cy - 30} H${cx + 4}" stroke="#d8d0c0" stroke-width=".8"/>`;
      const fx = cord(x, cx, 8, cy - R + 2, 14) + `<rect x="${cx - 7}" y="${cy - R - 2}" width="14" height="6" rx="1" fill="${x.url("brs")}"/>` + glass(x, g, true) + fl +
        hl(`M${cx - 26} ${cy - 18} C${cx - 32} ${cy - 4} ${cx - 30} ${cy + 12} ${cx - 22} ${cy + 22}`, .45, 2.2) + `<ellipse cx="${cx - 22}" cy="${cy - 22}" rx="5" ry="2.6" fill="#fff" fill-opacity=".45" transform="rotate(-40 ${cx - 22} ${cy - 22})"/>`;
      return svg(x, { bg: wallBg(x), light: glo(x, cx, cy, 82, 80, .7), fx, over: glo(x, cx, cy + 4, 30, 30, .5) });
    } }),
    base({ id: "t45", name: "T45 tube", colors: FIL, glow: { x: .5, y: .55, r: 1 }, render(o) {
      const x = ctx(o), cx = 100;
      const g = `M${cx - 6} 52 C${cx - 6} 56 ${cx - 19} 60 ${cx - 19} 72 V160 C${cx - 19} 172 ${cx - 10} 176 ${cx} 176 C${cx + 10} 176 ${cx + 19} 172 ${cx + 19} 160 V72 C${cx + 19} 60 ${cx + 6} 56 ${cx + 6} 52 Z`;
      let sp = `M${cx - 8} 70`; for (let i = 0; i < 16; i++) sp += ` L${i % 2 ? cx - 8 : cx + 8} ${f(74 + i * 5.6)}`;
      const fx = cord(x, cx, 8, 52, 14) + `<rect x="${cx - 7}" y="46" width="14" height="7" rx="1" fill="${x.url("brs")}"/>` + glass(x, g, true) + `<path d="M${cx} 56 V66" stroke="#d8d0c0" stroke-width="1"/>` +
        fil(x, sp, .8) + `<path d="M${cx - 8} 70 V66 M${cx + 8} 70 V66" stroke="#d8d0c0" stroke-width=".7"/>` + hl(`M${cx - 13} 74 V158`, .4, 2.2);
      return svg(x, { bg: wallBg(x), light: glo(x, cx, 114, 66, 92, .7), fx, over: glo(x, cx, 118, 22, 50, .45) });
    } }),
    base({ id: "candlefil", name: "Candle filament", colors: [WARM, AMBER, SOFT, DAY, "#ff8f5a"], glow: { x: .5, y: .4, r: 1 }, render(o) {
      const x = ctx(o), cx = 100;
      const g = `M${cx} 46 C${cx + 10} 60 ${cx + 15} 74 ${cx + 13} 88 C${cx + 12} 96 ${cx + 8} 100 ${cx + 6} 104 H${cx - 6} C${cx - 8} 100 ${cx - 12} 96 ${cx - 13} 88 C${cx - 15} 74 ${cx - 10} 60 ${cx} 46 Z`;
      const bg = wallBg(x) + `<path d="M64 196 V176 Q64 168 72 168 H128 Q136 168 136 176 V196 Z" fill="#2a2a30"/>`;
      const fx = `<rect x="${cx - 9}" y="108" width="18" height="52" rx="1.6" fill="#f1e8d4"/><rect x="${cx - 9}" y="108" width="6" height="52" fill="#fff" fill-opacity=".45"/><rect x="${cx + 3}" y="108" width="6" height="52" fill="#000" fill-opacity=".15"/>
<path d="M${cx - 9} 112 q3 3 0 8" stroke="#e4d6b8" fill="none"/><rect x="${cx - 6}" y="102" width="12" height="7" rx="1" fill="${x.url("brs")}"/>
<path d="M${cx - 22} 160 H${cx + 22} L${cx + 16} 170 H${cx - 16} Z" fill="${x.url("brs")}"/><path d="M${cx - 16} 170 C${cx - 10} 178 ${cx + 10} 178 ${cx + 16} 170" fill="${x.url("brs")}"/><path d="M${cx} 176 V196" stroke="url(#${x.id("brs")})" stroke-width="5"/>` +
        glass(x, g, false) + fil(x, `M${cx - 3} 96 L${cx - 1.4} 66 M${cx + 3} 96 L${cx + 1.4} 66`, 1) + `<path d="M${cx} 100 V92" stroke="#d8d0c0" stroke-width=".8"/>` + hl(`M${cx - 7} 70 C${cx - 9} 78 ${cx - 9} 86 ${cx - 7} 94`, .5, 1.4);
      return svg(x, { bg, light: glo(x, cx, 80, 70, 74, .7), fx, over: glo(x, cx, 82, 18, 26, .5) });
    } }),

    base({ id: "globe3", name: "3-globe cluster", colors: [WARM, SOFT, AMBER, DAY, "#ffd8a8"], cast: "down", glow: { x: .5, y: .55, r: 1.2 }, render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="22" fill="${x.url("ceil")}"/><rect x="8" y="28" width="184" height="3" fill="#000" fill-opacity=".4"/>` + wallBg(x, 170).replace(/y="8" width="184" height="162"/, 'y="31" width="184" height="139"') + floor(x, 170) +
        `<rect x="40" y="150" width="120" height="6" fill="#6a4a30"/><path d="M50 156 V172 M150 156 V172" stroke="#3a2818" stroke-width="3"/>`;
      const P3 = [[70, 92, 20], [104, 120, 22], [134, 84, 18]];
      let fx = `<ellipse cx="100" cy="30" rx="34" ry="5" fill="${x.url("blk")}"/><path d="M68 30 H132" stroke="#fff" stroke-opacity=".18"/>`, light = "";
      P3.forEach(([gx, gy, r]) => {
        fx += `<path d="M${gx} 30 V${gy - r - 6}" stroke="#18181c" stroke-width="1.4"/><rect x="${gx - 4}" y="${gy - r - 7}" width="8" height="5" rx="1" fill="${x.url("brs")}"/>
<circle cx="${gx}" cy="${gy}" r="${r}" fill="${x.url("clr")}"/>${x.on ? `<circle cx="${gx}" cy="${gy}" r="${r}" fill="${x.url("lit")}" opacity="${x.op(.35)}"/>` : ""}<circle cx="${gx}" cy="${gy}" r="${r}" fill="none" stroke="#e8e4f0" stroke-opacity=".45" stroke-width=".8"/>
<path d="M${gx - 4} ${gy - r + 2} H${gx + 4}" stroke="#d8d0c0"/><path d="M${gx - 4} ${gy - r + 2} C${gx - 4} ${gy - 6} ${gx - 6} ${gy} ${gx} ${gy + 6} C${gx + 6} ${gy} ${gx + 4} ${gy - 6} ${gx + 4} ${gy - r + 2}" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>
${fil(x, `M${gx - 2} ${gy - 8} L${gx - 3} ${gy + 2} M${gx + 2} ${gy - 8} L${gx + 3} ${gy + 2}`, 1)}${hl(`M${gx - r * .7} ${gy - r * .3} C${gx - r * .8} ${gy + r * .2} ${gx - r * .55} ${gy + r * .55} ${gx - r * .3} ${gy + r * .7}`, .5, 1.6)}`;
        light += glo(x, gx, gy, r * 2.6, r * 2.6, .6);
      });
      light += E(100, 152, 70, 7, x.url("pool"), `opacity="${x.op(.8)}"`);
      return svg(x, { bg, light, fx });
    } }),
    base({ id: "edison5", name: "5-bulb Edison", colors: FIL, cast: "down", glow: { x: .5, y: .55, r: 1.25 }, render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="22" fill="${x.url("ceil")}"/><rect x="8" y="28" width="184" height="3" fill="#000" fill-opacity=".4"/>` + wallBg(x, 192).replace(/y="8" width="184" height="184"/, 'y="31" width="184" height="161"') +
        `<rect x="20" y="168" width="160" height="7" fill="#4a3424"/><rect x="20" y="168" width="160" height="2" fill="#fff" fill-opacity=".15"/>`;
      const B = [[60, 112], [82, 138], [100, 100], [118, 132], [140, 116]];
      const bulb = "M-4 0 H4 C4 4 11 8 11 18 C11 27 6 31 0 31 C-6 31 -11 27 -11 18 C-11 8 -4 4 -4 0 Z";
      let fx = `<rect x="70" y="27" width="60" height="6" rx="2" fill="${x.url("blk")}"/>`, light = "";
      B.forEach(([bx, by]) => {
        fx += `<path d="M${bx} 33 C${bx} ${by - 40} ${bx} ${by - 30} ${bx} ${by - 14}" stroke="#18181c" stroke-width="1.6" fill="none"/><rect x="${bx - 4.6}" y="${by - 14}" width="9.2" height="12" rx="1.4" fill="${x.url("blk")}"/>
<g transform="translate(${bx} ${by - 2})">${glass(x, bulb, true)}${fil(x, "M-3 4 L-5 18 L-2 15 L0 19 L2 15 L5 18 L3 4", .8)}${hl("M-7 12 C-8 18 -7 23 -4 26", .45, 1.2)}</g>`;
        light += glo(x, bx, by + 14, 30, 30, .6);
      });
      light += E(100, 170, 80, 6, x.url("pool"), `opacity="${x.op(.8)}"`);
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "flocked", name: "White flocked tree", colors: [WARM, SOFT, DAY, BLUE, "#ff9ff3"], glow: { x: .5, y: .52, r: 1.2 }, render(o) {
      const x = ctx(o);
      const T = tree(x, { cx: 100, seed: 11, flock: true, n: 44, tiers: [[26, 18, 58], [44, 30, 90], [66, 42, 124], [90, 56, 158]] });
      const bg = wallBg(x, 170) + `<rect x="140" y="40" width="40" height="56" fill="#1a2238"/><path d="M160 40 V96 M140 68 H180" stroke="#d8d2c6" stroke-width="2.4"/>` + floor(x, 170);
      const fx = shadow(x, 100, 176, 62, 6) + T.glow + `<path d="M84 172 L88 158 H112 L116 172 Z" fill="#c9c4b8"/><rect x="82" y="168" width="36" height="6" rx="1" fill="#b8b2a4"/>` + T.t + T.bulbs + T.star +
        `<rect x="34" y="154" width="26" height="20" fill="#b8c8d8"/><path d="M47 154 V174 M34 163 H60" stroke="#c9a24a" stroke-width="2"/><rect x="138" y="160" width="30" height="14" fill="#e8e4dc"/><path d="M153 160 V174 M138 167 H168" stroke="#a83a4a" stroke-width="2"/>`;
      return svg(x, { bg, fx });
    } }),
    base({ id: "tabletop", name: "Tabletop tree", colors: [MULTI, WARM, SOFT, RED, BLUE], glow: { x: .5, y: .5, r: 1 }, render(o) {
      const x = ctx(o), multi = x.c.toLowerCase() === MULTI;
      const T = tree(x, { cx: 100, seed: 23, n: 26, br: 1.5, dust: true, multi, tiers: [[50, 14, 78], [64, 24, 104], [82, 34, 130]] });
      const bg = wallBg(x, 192) + `<path d="M28 150 H172 L182 160 H18 Z" fill="#7a5434"/><rect x="18" y="160" width="164" height="8" fill="#5a3c22"/><path d="M28 168 V196 M172 168 V196" stroke="#3a2614" stroke-width="5"/>`;
      const fx = shadow(x, 100, 156, 34, 4) + T.glow + `<path d="M80 156 L84 132 H116 L120 156 Z" fill="#a8885a"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${82 + i * 6} 134 L${81 + i * 6.4} 155" stroke="#7a5c38" stroke-width=".8"/>`).join("")}<path d="M82 140 H118" stroke="#d83a3a" stroke-width="3"/>` + T.t + T.bulbs + T.star;
      return svg(x, { bg, fx });
    } }),
    base({ id: "pencil", name: "Slim pencil tree", colors: [WARM, SOFT, DAY, MULTI, BLUE], glow: { x: .5, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o), multi = x.c.toLowerCase() === MULTI;
      const T = tree(x, { cx: 100, seed: 37, n: 40, br: 1.4, dust: true, multi, tiers: [[24, 9, 52], [38, 14, 80], [56, 19, 110], [76, 24, 140], [98, 28, 166]] });
      const bg = wallBg(x, 176) + floor(x, 176) + `<rect x="24" y="60" width="2" height="116" fill="#000" fill-opacity=".2"/><rect x="150" y="70" width="28" height="36" fill="#d8d2c6"/><rect x="153" y="73" width="22" height="30" fill="#3a5a4a"/>`;
      const fx = shadow(x, 100, 180, 34, 4) + T.glow + `<path d="M94 166 V178" stroke="#4a3020" stroke-width="5"/><path d="M84 182 L100 176 L116 182" stroke="#2a2a2e" stroke-width="3" fill="none"/>` + T.t + T.bulbs + T.star;
      return svg(x, { bg, fx });
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "lights2",
    tab: "More bulbs & clusters",
    group: "Lights",
    kind: "light",
    intro: "More filament bulbs (G40 globe, T45 tube, candle), pendant clusters and Christmas trees. Lit, the filaments and tree lights glow in the light color; the slider dims them.",
    
    css: `.hda-anim .hda-lights2-tw{animation:hda-lights2-tw 2.2s ease-in-out infinite}
@keyframes hda-lights2-tw{0%,100%{opacity:1}50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-lights2-tw{animation:none}}`,
    icons,
  });
})();
