(function () {
  const H = window.HDAH, P = "hda-wall-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  function ctx(o) {
    const c = o.color || "#ffc477", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => (k * L).toFixed(2), c2: o.color2 };
  }
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  const WALL = {
    plaster: ["#57525f", "#3c3845"], greige: ["#5c564e", "#403b35"], sage: ["#48544c", "#313a34"], clay: ["#62493f", "#45332c"],
    green: ["#304b41", "#20342d"], navy: ["#303a53", "#1f2739"], slate: ["#434c59", "#2d343e"], blush: ["#5c4954", "#41333c"],
    dark: ["#2f2e39", "#1d1c25"], stucco: ["#605a50", "#46413a"], barn: ["#57422f", "#3a2b1f"], siding: ["#4e5862", "#363d46"],
    concrete: ["#5a5d61", "#3f4246"], battens: ["#40454e", "#2a2e35"], brick: ["#64402f", "#452a20"],
  };

  function K2(x) {
    const c = x.c2v, id = x.id;
    if (x.k2 === "cer") return rg(id("cer"), [[0, H.shade(c, .5)], [.55, c], [1, H.shade(c, -.38)]], .4, .3, .8);
    const m = [[0, H.shade(c, -.55)], [.22, H.shade(c, -.05)], [.38, H.shade(c, .5)], [.58, H.shade(c, -.1)], [.82, H.shade(c, -.4)], [1, H.shade(c, -.6)]];
    return lg(id(x.k2), m) + (x.k2 === "brs" ? lg(id("brsv"), [[0, H.shade(c, .5)], [.3, c], [.75, H.shade(c, -.35)], [1, H.shade(c, -.6)]], 0, 0, 0, 1) : "");
  }
  function defs(x, kind, extra) {
    const { c, id, hot } = x, w = WALL[kind] || WALL.plaster;
    const t = x.on ? H.mix(w[0], c, .07 * x.L) : w[0], b = x.on ? H.mix(w[1], c, .05 * x.L) : w[1];
    return `<defs>
${lg(id("wallg"), [[0, t], [1, b]], 0, 0, 0, 1)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .8], [.45, c, .28], [1, c, 0]])}
${rg(id("pool"), [[0, c, .6], [.55, c, .18], [1, c, 0]])}
${lg(id("wu"), [[0, c, .72], [.4, c, .26], [1, c, 0]], 0, 1, 0, 0)}
${lg(id("wd"), [[0, c, .72], [.4, c, .26], [1, c, 0]], 0, 0, 0, 1)}
${rg(id("fill"), [[0, "#ffffff", .97], [.42, hot, 1], [1, c, .85]], .5, .45, .6)}
${rg(id("gl"), [[0, "#ffffff", .5], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .22]], .34, .28, .75)}
${rg(id("sh"), [[0, "#000", .55], [.6, "#000", .2], [1, "#000", 0]])}
${lg(id(x.k2 === "blk" ? "blk_" : "blk"), [[0, "#0f0f14"], [.28, "#3b3c49"], [.42, "#585a6b"], [.72, "#22232c"], [1, "#0b0b10"]])}
${lg(id(x.k2 === "brs" ? "brs_" : "brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id(x.k2 === "brs" ? "brsv_" : "brsv"), [[0, "#fbe7a6"], [.3, "#c99a48"], [.75, "#8a5d1f"], [1, "#4d3210"]], 0, 0, 0, 1)}
${lg(id(x.k2 === "chr" ? "chr_" : "chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id(x.k2 === "brz" ? "brz_" : "brz"), [[0, "#1d140e"], [.25, "#5a4232"], [.4, "#8c6a50"], [.6, "#3e2c20"], [1, "#150e09"]])}
${lg(id("wht"), [[0, "#9c98a6"], [.3, "#f2f0f4"], [.45, "#ffffff"], [.75, "#d4d0d8"], [1, "#8a8692"]])}
${lg(id("ivory"), [[0, "#b9ab90"], [.35, "#fbf5e6"], [.6, "#efe6d0"], [1, "#a8987a"]])}
${rg(id(x.k2 === "cer" ? "cer_" : "cer"), [[0, "#ffffff"], [.55, "#e4ded3"], [1, "#9a9388"]], .4, .3, .8)}
${x.k2 ? K2(x) : ""}
<filter id="${id("bl")}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
${extra || ""}</defs>`;
  }

  function texture(kind) {
    const r = rnd(kind.length * 977 + kind.charCodeAt(0) * 13); let s = "";
    if (kind === "brick") {
      for (let row = 0, y = 8; y < 192; y += 12, row++) {
        for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) {
          const v = r();
          s += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="24.4" height="10.4" rx="1.2" fill="${v > .5 ? "#000" : "#e09a7c"}" fill-opacity="${(.04 + v * .09).toFixed(2)}"/>`;
          s += `<path d="M${bx} ${y} v12" stroke="#c9b8a8" stroke-opacity=".16" stroke-width="1.6"/>`;
        }
        s += `<path d="M8 ${y} H192" stroke="#c9b8a8" stroke-opacity=".18" stroke-width="1.6"/><path d="M8 ${y + 1.4} H192" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`;
      }
    } else if (kind === "siding") {
      for (let y = 8; y < 192; y += 17) s += `<rect x="8" y="${y}" width="184" height="17" fill="#fff" fill-opacity=".03"/><path d="M8 ${y + 16} H192" stroke="#000" stroke-opacity=".42" stroke-width="2.2"/><path d="M8 ${y + 17.6} H192" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>`;
    } else if (kind === "barn" || kind === "battens") {
      const bw = kind === "barn" ? 23 : 30;
      for (let bx = 8; bx < 192; bx += bw) {
        const v = r();
        s += `<rect x="${bx}" y="8" width="${bw}" height="184" fill="${v > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + v * .05).toFixed(2)}"/>`;
        if (kind === "barn") {
          s += `<path d="M${bx} 8 V192" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/>`;
          for (let g = 0; g < 3; g++) { const gx = bx + 4 + r() * (bw - 8), w2 = 1 + r() * 2;
            s += `<path d="M${f(gx)} 8 C${f(gx + w2)} 60 ${f(gx - w2)} 120 ${f(gx + w2 * .5)} 192" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".7"/>`; }
          s += `<circle cx="${bx + bw / 2}" cy="${f(30 + r() * 20)}" r="1" fill="#1a120c" fill-opacity=".6"/>`;
        } else {
          s += `<rect x="${bx - 2.5}" y="8" width="5" height="184" fill="#fff" fill-opacity=".05"/><path d="M${bx + 2.5} 8 V192" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/><path d="M${bx - 2.5} 8 V192" stroke="#fff" stroke-opacity=".08" stroke-width=".8"/>`;
        }
      }
    } else if (kind === "concrete") {
      s += `<path d="M8 100 H192 M100 8 V192" stroke="#000" stroke-opacity=".28" stroke-width="1"/><path d="M8 101 H192 M101 8 V192" stroke="#fff" stroke-opacity=".06" stroke-width=".8"/>`;
      [[30, 30], [170, 30], [30, 170], [170, 170], [30, 70], [170, 130]].forEach(([cx, cy]) => { s += `<circle cx="${cx}" cy="${cy}" r="3.2" fill="#1f2124" fill-opacity=".55"/><circle cx="${cx - .6}" cy="${cy - .6}" r="2.2" fill="#000" fill-opacity=".4"/>`; });
      for (let i = 0; i < 70; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * .9)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.06 + r() * .12).toFixed(2)}"/>`;
    } else {
      const n = kind === "stucco" ? 140 : 46, big = kind === "stucco" ? 1.1 : .6;
      for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * big)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .08).toFixed(2)}"/>`;
    }
    return s;
  }

  function scene(x, kind, wash, fixture, extra, under) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, kind, extra)}
<g class="hda-bg"><rect x="8" y="8" width="184" height="184" rx="16" fill="${x.url("wallg")}"/>
<g clip-path="${x.url("wc")}">${texture(kind)}${under || ""}${x.on ? wash : ""}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>
<rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g>
<!--solo-->${fixture}</svg>`;
  }

  function scallop(x, cx, y, dir, w0, sp, len, k) {
    k = k || 1; const g = x.url(dir < 0 ? "wu" : "wd");
    const sh = (w, s, l) => { const y2 = y + dir * l;
      return `M${f(cx - w)} ${y} C${f(cx - w - s * .12)} ${f(y + dir * l * .35)} ${f(cx - s * .8)} ${f(y + dir * l * .62)} ${f(cx - s)} ${f(y2)} L${f(cx + s)} ${f(y2)} C${f(cx + s * .8)} ${f(y + dir * l * .62)} ${f(cx + w + s * .12)} ${f(y + dir * l * .35)} ${f(cx + w)} ${y} Z`; };
    return `<path d="${sh(w0 + 2, sp * 1.12, len)}" fill="${g}" opacity="${x.op(.42 * k)}"/>
<path d="${sh(w0, sp * .9, len * .92)}" fill="${g}" stroke="${g}" stroke-width="1.4" opacity="${x.op(.6 * k)}"/>
<path d="${sh(w0 * .6, sp * .45, len * .7)}" fill="${g}" opacity="${x.op(.5 * k)}"/>
<ellipse cx="${cx}" cy="${y + dir * 5}" rx="${w0 + 8}" ry="9" fill="${x.url("halo")}" opacity="${x.op(.8 * k)}"/>`;
  }
  // (multi-function) up / down lights as their own parts: o.mf = only the ticked ones in o.parts, each with its own
  // brightness (o.plevel), one light color (o.pcolor.up, else .down, else the device's); a light left out stays dark.
  // udO(o): the device as a whole (on = either light); udX(x, o, k): one light's view of the drawing. A Device Image is today's.
  const UDP = [{ id: "up", name: "Up light", type: "switch" }, { id: "down", name: "Down light", type: "switch" }];
  const udO = (o) => { if (!o.mf) return o; const pp = o.parts || {}, pl = o.plevel || {}, pc = o.pcolor || {}, d = o.level == null ? 1 : o.level;
    return Object.assign({}, o, { on: !!(pp.up || pp.down), color: pc.up || pc.down || o.color, level: Math.max(pp.up ? (pl.up == null ? d : pl.up) : 0, pp.down ? (pl.down == null ? d : pl.down) : 0) }); };
  const udX = (x, o, k) => { if (!o.mf) return x; const pp = o.parts || {}, pl = o.plevel || {}, y = Object.assign({}, x), lv = pl[k] == null ? (o.level == null ? 1 : o.level) : pl[k];
    y.on = !!pp[k]; y.L = y.on ? .3 + .7 * lv : 0; y.op = (q) => (q * y.L).toFixed(2); return y; };
  const glowE = (x, cx, cy, rx, ry, k) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("halo")}" opacity="${x.op(k == null ? .7 : k)}"/>`;
  const halo = (x, cx, cy, r, k) => x.on ? glowE(x, cx, cy, r, r, k == null ? .6 : k) : "";
  const drop = (x, shape, dx, dy, a) => `<g transform="translate(${dx == null ? 3.5 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${a || .45}" filter="${x.url("bl")}">${shape}</g>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const flick = (s, d) => `<g class="${P}flick" style="animation-delay:-${d || 0}s">${s}</g>`;

  const TUBE = { brass: ["#4d3210", "#d2a656"], black: ["#08080b", "#3a3b46"], chrome: ["#3a3e4a", "#d8dce6"], bronze: ["#150e09", "#6b4f3a"], green: ["#10241b", "#3f7058"] };
  function tube(d, m, w) {
    const t = TUBE[m];
    return `<path d="${d}" fill="none" stroke="${t[0]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${t[1]}" stroke-width="${f(w * .5)}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${(w * .16).toFixed(2)}" stroke-linecap="round" transform="translate(${(-w * .15).toFixed(2)} ${(-w * .12).toFixed(2)})"/>`;
  }

  const ENV = {
    pear: "M-4 16 C-4 10 -10 8 -10 0 C-10 -7 -5.5 -11 0 -11 C5.5 -11 10 -7 10 0 C10 8 4 10 4 16 Z",
    tube: "M-4.5 16 C-6 12 -7 8 -7 0 L-7 -13 C-7 -19 7 -19 7 -13 L7 0 C7 8 6 12 4.5 16 Z",
    flame: "M-2.8 16 C-3 11 -6 7 -6 1 C-6 -5 -3 -10 0 -16 C3 -10 6 -5 6 1 C6 7 3 11 2.8 16 Z",
    globe: "M-4 16 C-4 13 -13 11 -13 0 C-13 -8 -7 -13 0 -13 C7 -13 13 -8 13 0 C13 11 4 13 4 16 Z",
  };
  const FIL = {
    pear: { s: "M-1.6 15 L-4.5 2 M1.6 15 L4.5 2 M0 15 V6", f: "M-4.6 1 C-4.6 -5 -2.6 -5 -1.6 -.5 C-1 -5 1 -5 1.6 -.5 C2.6 -5 4.6 -5 4.6 1" },
    tube: { s: "M-1.4 15 L-2.6 10 M1.4 15 L2.6 10", f: "M-3 10 L-3.6 -13 M0 10 V-14 M3 10 L3.6 -13 M-3.6 -13 C-2 -15 2 -15 3.6 -13" },
    flame: { s: "M-1 15 V7 M1 15 V7", f: "M-1 7 C-1.6 1 -1 -5 0 -9 C1 -5 1.6 1 1 7" },
    globe: { s: "M-1.6 15 L-5 3 M1.6 15 L5 3", f: "M-6 2.4 C-6 -4 -3.2 -4 -2.2 1 C-1.4 -4 1.4 -4 2.2 1 C3.2 -4 6 -4 6 2.4" },
  };
  function bulb(x, cx, cy, s, kind, flip, noBase) {
    const e = ENV[kind], fl = FIL[kind];
    const base = noBase ? "" : `<rect x="-4.7" y="15.2" width="9.4" height="8.4" rx="1.6" fill="${x.url("brs")}"/><path d="M-4.7 17.6 L4.7 18.8 M-4.7 20.4 L4.7 21.6" stroke="#3d2a10" stroke-opacity=".6" stroke-width=".6"/>`;
    const lit = x.on ? `<path d="${e}" fill="${x.c}" fill-opacity="${x.op(.35)}"/><circle cx="0" cy="${kind === "tube" ? -3 : 0}" r="${kind === "tube" ? 16 : 13}" fill="${x.url("halo")}" opacity="${x.op(.95)}"/>
<path d="${fl.f}" fill="none" stroke="${x.c}" stroke-width="2.8" stroke-opacity="${x.op(.6)}" stroke-linecap="round"/><path d="${fl.f}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width="1" stroke-linecap="round"/>`
      : `<path d="${e}" fill="#fff" fill-opacity=".06"/><path d="${fl.f}" fill="none" stroke="#6b4e2e" stroke-width=".8" stroke-opacity=".85"/>`;
    return `<g transform="translate(${cx} ${cy}) scale(${s} ${flip ? -s : s})">${base}${lit}<path d="${fl.s}" stroke="#d8d4e6" stroke-opacity=".45" stroke-width=".45"/>
<path d="${e}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".42" stroke-width=".6"/><path d="M-5 -5 C-6 -1 -5.5 4 -3.5 7" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/></g>`;
  }
  function candle(x, cx, y0, y1, w) {
    const h = w / 2;
    const d = `M${cx - h} ${y1} V${y0 + 2} C${cx - h} ${y0 - 1} ${cx - h + 2} ${y0 - 1.6} ${cx - h + 3} ${y0 - .6} C${cx - 1} ${y0 + .4} ${cx + 1} ${y0 - 1} ${cx + h - 2.6} ${y0 - .4} C${cx + h} ${y0 - .4} ${cx + h} ${y0 + 1} ${cx + h} ${y0 + 2} V${y1} Z`;
    return `<path d="${d}" fill="${x.url("ivory")}"/>
<path d="M${cx - h + 1.2} ${y0 + 1} C${cx - h + 1} ${y0 + 8} ${cx - h + 2.6} ${y0 + 10} ${cx - h + 2.4} ${y0 + 4}" fill="#fbf5e6" stroke="#d9cdb2" stroke-width=".5"/>
<path d="M${cx + h - 2} ${y0 + 1} C${cx + h - 2.4} ${y0 + 13} ${cx + h - .4} ${y0 + 14} ${cx + h - .6} ${y0 + 2}" fill="#fbf5e6" stroke="#d9cdb2" stroke-width=".5"/>
${x.on ? `<path d="${d}" fill="${x.c}" opacity="${x.op(.12)}"/><ellipse cx="${cx}" cy="${y0 + 1}" rx="${h}" ry="2" fill="${x.hot}" opacity="${x.op(.7)}"/>` : ""}
${hl(`M${cx - h + 2} ${y0 + 5} V${y1 - 2}`, .5, 1)}`;
  }

  const WARM = "#ffc477", SOFT = "#ffe2b8", DAY = "#eef4ff", AMBER = "#ffb35c";
  const COLS = [WARM, SOFT, DAY, "#ff9fb6", "#8fd0ff"];
  const COLS2 = [SOFT, WARM, DAY, "#b9a6ff", "#9ef0c4"];
  const FLAME = [AMBER, WARM, SOFT, DAY, "#ff9f7a"];
  const OUT = [WARM, SOFT, DAY, "#8fd0ff", "#9ef0c4"];
  const RGB = ["#b197fc", "#ff6bcb", "#4dabf7", "#63e6be", "#ffc477", "#ff8a4c"];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "around" }, o);

  const icons = [
     base({ id: "updown", name: "Up/down cylinder", colors: COLS, cast: "both", glow: { x: .5, y: .5, r: 1.1 }, colors2: ["#5a4232", "#2a2b33", "#ecebf0", "#c99a48", "#b8774f", "#8ea58b"], picker2: true, colorLabel2: "Finish", parts: UDP, render(o0) {
      const o = udO(o0), x = ctx(o); x.k2 = "brz"; x.c2v = x.c2 || "#5a4232"; const _t = 0, xu = udX(x, o0, "up"), xd = udX(x, o0, "down");
      const W = scallop(xu, 100, 77, -1, 12, 44, 70) + scallop(xd, 100, 123, 1, 12, 44, 70) + (o0.mf ? glowE(xu, 100, 86, 34, 26, .3) + glowE(xd, 100, 114, 34, 26, .3) : glowE(x, 100, 100, 34, 46, .3));
      const F = drop(x, `<rect x="86" y="76" width="28" height="48" rx="3"/>`) +
        `<rect x="86" y="76" width="28" height="48" rx="3" fill="${x.url("brz")}"/>
<rect x="85" y="75" width="30" height="4" rx="1.6" fill="${x.url("brz")}"/><rect x="85" y="121" width="30" height="4" rx="1.6" fill="${x.url("brz")}"/>
<path d="M85.5 75.6 H114.5" stroke="${xu.on ? x.hot : "#a88a70"}" stroke-opacity="${xu.on ? xu.op(1) : ".5"}" stroke-width="1.2"/>
<path d="M85.5 124.4 H114.5" stroke="${xd.on ? x.hot : "#a88a70"}" stroke-opacity="${xd.on ? xd.op(1) : ".35"}" stroke-width="1.2"/>
<rect x="86" y="98.4" width="28" height="3" fill="#000" fill-opacity=".35"/><path d="M86 101.6 H114" stroke="#fff" stroke-opacity=".12"/>
${hl("M92.4 81 V96 M92.4 104 V119", .32, 1.6)}`;
      return scene(x, "plaster", W, F);
    } }),

     base({ id: "halfmoon", name: "Half-moon uplight", colors: COLS2, cast: "up", glow: { x: .5, y: .46, r: 1.15 }, colors2: ["#f2efe8", "#9fb39a", "#c47a5a", "#2b3c63", "#2a2b33"], picker2: true, colorLabel2: "Shade", render(o) {
      const x = ctx(o); x.k2 = "cer"; x.c2v = x.c2 || "#f2efe8"; const _t = 0, B = "M56 98 A44 42 0 0 0 144 98 Z";
      const ex = rg(x.id("cg"), [[0, "#ffffff"], [.45, x.hot], [1, x.c, .2]], .5, .05, .9);
      const W = scallop(x, 100, 97, -1, 40, 82, 88) + glowE(x, 100, 112, 70, 40, .25);
      const F = drop(x, `<path d="${B}"/>`, 3, 6) + `<path d="${B}" fill="${x.url("cer")}"/>
${x.on ? `<path d="${B}" fill="url(#${x.id("cg")})" opacity="${x.op(.38)}"/>` : `<path d="${B}" fill="#000" fill-opacity=".12"/>`}
<path d="M100 98 L144 98 A44 42 0 0 1 112 138.4 C126 128 132 112 132 98 Z" fill="#000" fill-opacity=".1"/>
${hl("M62 106 C66 120 76 130 88 134", .55, 2.4)}<ellipse cx="70" cy="112" rx="3" ry="1.6" fill="#fff" fill-opacity=".7" transform="rotate(50 70 112)"/>
<ellipse cx="100" cy="98" rx="44" ry="3.2" fill="${x.on ? x.hot : "#cfc9bd"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>
${x.on ? `<ellipse cx="100" cy="97.6" rx="30" ry="1.6" fill="#fff" opacity="${x.op(.95)}"/>` : `<ellipse cx="100" cy="98.6" rx="40" ry="1.8" fill="#3a3530" fill-opacity=".5"/>`}`;
      return scene(x, "sage", W, F, ex);
    } }),

     base({ id: "candle", name: "Candle sconce", colors: FLAME, glow: { x: .5, y: .37, r: 1 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#5a4232", "#ecebf0"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0;
      const W = flick(glowE(x, 100, 74, 76, 66, .55) + scallop(x, 100, 62, -1, 10, 40, 54, .55), 0);
      const plate = "M100 64 C110 64 113 76 112 92 C111 110 114 128 108 142 C105 148 95 148 92 142 C86 128 89 110 88 92 C87 76 90 64 100 64 Z";
      const F = drop(x, `<path d="${plate}"/>`) + `<path d="${plate}" fill="${x.url("blk")}"/><path d="M100 70 C106 70 108 80 107 94 C106 112 109 126 104 138" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.2"/>
<circle cx="100" cy="70" r="2" fill="${x.url("brs")}"/><circle cx="100" cy="140" r="2" fill="${x.url("brs")}"/>
${tube("M100 132 C100 150 114 152 114 143 C114 136 106 136 107 142", "black", 4.4)}
<path d="M79 122 H121 C119 128 111 132 100 132 C89 132 81 128 79 122 Z" fill="${x.url("brs")}"/><ellipse cx="100" cy="122" rx="21" ry="3.6" fill="${x.url("brsv")}"/>
<rect x="96" y="129" width="8" height="6" rx="1" fill="${x.url("brs")}"/>` + candle(x, 100, 90, 122, 14) +
        flick(bulb(x, 100, 73, 1.25, "flame", false, true), .7);
      return scene(x, "clay", W, F);
    } }),

     base({ id: "swingarm", name: "Swing-arm sconce", colors: COLS2, cast: "both", glow: { x: .63, y: .56, r: 1 }, colors2: ["#ddd4c4", "#f2f0ea", "#4a4a50", "#2b3c63", "#9fb39a", "#e3c0b8"], picker2: true, colorLabel2: "Shade", render(o) {
      const x = ctx(o); const l2 = x.c2 || "#ddd4c4"; const _t = 0, S = "M108 94 L144 94 L154 132 L98 132 Z";
      const ex = lg(x.id("ln"), [[0, H.shade(l2, -.38)], [.32, H.shade(l2, .12)], [.6, H.shade(l2, -.04)], [1, H.shade(l2, -.45)]]) +
        lg(x.id("lno"), [[0, H.mix(H.mix(x.c, l2, .3), "#6e5a40", .3)], [.35, H.mix(H.mix(x.hot, l2, .25), "#fff", .35)], [.65, H.mix(x.hot, l2, .25)], [1, H.shade(H.mix(x.c, l2, .3), -.2)]]);
      let tex = ""; for (let y = 97; y < 132; y += 3.2) tex += `<path d="M90 ${f(y)} H160" stroke="${Math.round(y) % 2 ? "#fff" : "#000"}" stroke-opacity=".06" stroke-width=".7"/>`;
      const W = scallop(x, 126, 93, -1, 16, 34, 84) + scallop(x, 126, 133, 1, 27, 52, 60) + glowE(x, 126, 112, 48, 40, .4);
      const F = drop(x, `<path d="${S}"/><rect x="30" y="62" width="12" height="38" rx="3"/>`, 4, 6) +
        `<path d="M36 100 C36 146 58 156 66 196" fill="none" stroke="#14121a" stroke-width="2.4"/><path d="M35.4 100 C35.4 146 57 156 65 196" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".7"/>
<rect x="30" y="62" width="12" height="38" rx="3" fill="${x.url("brz")}"/>${hl("M33 66 V96", .25, 1)}
${tube("M41 80 H72", "bronze", 4.6)}<circle cx="74" cy="80" r="4.4" fill="${x.url("brz")}"/><circle cx="73" cy="79" r="1.4" fill="#fff" fill-opacity=".3"/>
${tube("M76 80 H124 C126 80 126 82 126 84 V94", "bronze", 4)}
<path d="${S}" fill="url(#${x.id(x.on ? "lno" : "ln")})"/>${x.on ? `<path d="${S}" fill="${x.url("fill")}" opacity="${x.op(.35)}"/>` : ""}
<clipPath id="${x.id("sc")}"><path d="${S}"/></clipPath><g clip-path="url(#${x.id("sc")})">${tex}</g>
<ellipse cx="126" cy="94" rx="18" ry="2.4" fill="${x.on ? x.hot : "#4b443c"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>
<path d="M98 132 A28 3 0 0 0 154 132" fill="none" stroke="${x.on ? x.hot : "#6d655b"}" stroke-opacity="${x.on ? x.op(1) : 1}" stroke-width="2"/>${hl("M111 98 L104 128", .18, 2.6)}`;
      return scene(x, "greige", W, F, ex);
    } }),

     base({ id: "picture", name: "Picture light", colors: [SOFT, WARM, DAY, "#ffd6a0", "#c9d8ff"], cast: "down", glow: { x: .5, y: .3, r: 1.2 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#5a4232", "#ecebf0"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0;
      const ex = lg(x.id("sky"), [[0, "#7fa7c9"], [.6, "#e9c79a"], [1, "#d59a6a"]], 0, 0, 0, 1) +
        lg(x.id("gold"), [[0, "#6e4a17"], [.25, "#e6c070"], [.5, "#a77a2e"], [.75, "#f1d58f"], [1, "#5c3c12"]], 0, 0, 1, 1) +
        lg(x.id("pw"), [[0, x.c, .55], [.55, x.c, .14], [1, x.c, 0]], 0, 0, 0, 1);
      const W = scallop(x, 100, 60, 1, 44, 70, 128, .9);
      const art = `<rect x="55" y="87" width="90" height="80" fill="url(#${x.id("sky")})"/><circle cx="118" cy="118" r="8" fill="#fff1c9" fill-opacity=".9"/>
<path d="M55 134 C70 122 84 126 96 132 C110 120 128 118 145 128 V167 H55 Z" fill="#6f7f5e"/><path d="M55 146 C76 136 100 142 118 150 C128 146 138 146 145 148 V167 H55 Z" fill="#4c5c40"/>
<path d="M68 152 V140 M66 142 L68 136 L70 142 Z M128 154 V144" stroke="#2f3a28" stroke-width="2"/><path d="M62 140 L68 128 L74 140 Z M123 146 L128 136 L133 146 Z" fill="#2f3a28"/>
<path d="M55 162 C80 158 120 160 145 164 V167 H55 Z" fill="#3a4732"/>`;
      const F = drop(x, `<rect x="44" y="76" width="112" height="102"/>`, 3, 5, .55) +
        `<rect x="44" y="76" width="112" height="102" rx="1.5" fill="url(#${x.id("gold")})"/><rect x="51" y="83" width="98" height="88" fill="#2a1d0c"/>
<path d="M44 76 H156 L149 83 H51 Z" fill="#fff" fill-opacity=".18"/><path d="M156 76 V178 L149 171 V83 Z" fill="#000" fill-opacity=".2"/><path d="M44 178 H156 L149 171 H51 Z" fill="#000" fill-opacity=".3"/>
${art}${x.on ? `<rect x="55" y="87" width="90" height="80" fill="url(#${x.id("pw")})" opacity="${x.op(1)}"/>` : `<rect x="55" y="87" width="90" height="80" fill="#000" opacity=".42"/>`}
<rect x="55" y="87" width="90" height="80" fill="none" stroke="#000" stroke-opacity=".5"/>
${drop(x, `<path d="M56 50 C56 43 144 43 144 50 L146 58 L54 58 Z"/>`, 2, 6, .4)}
<rect x="94" y="17" width="12" height="13" rx="2" fill="${x.url("brs")}"/>${tube("M100 28 V48", "brass", 3.6)}
<path d="M56 50 C56 43 144 43 144 50 L146 58 L54 58 Z" fill="${x.url("brsv")}"/>
<path d="M58 49 C64 45 136 45 142 49" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>
<ellipse cx="55" cy="54" rx="3" ry="4.6" fill="${x.url("brs")}"/><ellipse cx="145" cy="54" rx="3" ry="4.6" fill="${x.url("brs")}"/>
<rect x="56" y="57" width="88" height="2.6" rx="1.2" fill="${x.on ? x.hot : "#5c3c12"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>
${x.on ? `<rect x="64" y="57.6" width="72" height="1.4" rx=".7" fill="#fff" opacity="${x.op(.9)}"/>` : ""}`;
      return scene(x, "green", W, F, ex);
    } }),

     base({ id: "globe", name: "Brass globe", colors: COLS, glow: { x: .5, y: .33, r: 1.1 }, colors2: ["#f4f2ee", "#ecd9b8", "#efc4cc", "#bcd8c0", "#b9c8e0", "#9a9aa6"], picker2: true, colorLabel2: "Globe", render(o) {
      const x = ctx(o); const g2 = x.c2 || "#f4f2ee"; const _t = 0;
      const ex = rg(x.id("op"), [[0, "#fbf8f2"], [.55, H.mix("#d6d0c7", g2, .7)], [1, H.shade(H.mix("#857f79", g2, .6), -.1)]], .38, .32, .72) +
        rg(x.id("opo"), [[0, "#fff"], [.3, H.mix(x.hot, g2, .3)], [.78, H.mix(x.c, g2, .35)], [1, H.shade(H.mix(x.c, g2, .35), -.3)]], .42, .38, .66);
      const W = glowE(x, 100, 66, 86, 76, .65) + scallop(x, 100, 40, -1, 20, 48, 36, .4);
      const F = drop(x, `<circle cx="100" cy="64" r="30"/><ellipse cx="50" cy="120" rx="8" ry="17"/>`, 4, 7, .4) +
        `<ellipse cx="50" cy="120" rx="8" ry="17" fill="${x.url("brs")}"/><ellipse cx="50" cy="120" rx="5" ry="13" fill="none" stroke="#4d3210" stroke-opacity=".5"/>
${tube("M55 122 C82 124 98 116 100 100", "brass", 4.6)}
<path d="M88 92 L112 92 L108 101 L92 101 Z" fill="${x.url("brs")}"/><ellipse cx="100" cy="92" rx="12" ry="2.4" fill="${x.url("brsv")}"/>
<circle cx="100" cy="64" r="30" fill="url(#${x.id(x.on ? "opo" : "op")})"/>
${x.on ? `<circle cx="100" cy="64" r="30" fill="url(#${x.id("op")})" opacity="${(.7 - .6 * x.L).toFixed(2)}"/>` : ""}
<circle cx="100" cy="64" r="30" fill="${x.url("gl")}"/>${hl("M82 52 A24 24 0 0 1 96 38", .55, 2.4)}
<circle cx="100" cy="64" r="29.6" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`;
      return scene(x, "navy", W, F, ex);
    } }),

     base({ id: "edison", name: "Edison on wood", colors: [AMBER, WARM, SOFT, DAY, "#ff9fb6"], glow: { x: .5, y: .46, r: 1.05 }, render(o) {
      const x = ctx(o), r = rnd(55); let gr = "";
      for (let i = 0; i < 9; i++) { const gx = 81 + i * 4.6 + r() * 2, w2 = 1 + r() * 2.4;
        gr += `<path d="M${f(gx)} 54 C${f(gx + w2)} 80 ${f(gx - w2)} 116 ${f(gx + w2 * .6)} 146" fill="none" stroke="#1d0f06" stroke-opacity="${(.18 + r() * .2).toFixed(2)}" stroke-width=".7"/>`; }
      const ex = lg(x.id("wd2"), [[0, "#3a1f0e"], [.25, "#8a5630"], [.5, "#a8703f"], [.8, "#6e4220"], [1, "#2e1809"]]) +
        rg(x.id("pl"), [[0, x.c, .55], [1, x.c, 0]], .5, .4, .6);
      const W = glowE(x, 100, 94, 82, 80, .62);
      const F = drop(x, `<rect x="78" y="52" width="44" height="96" rx="7"/>`, 4, 6, .5) +
        `<rect x="78" y="52" width="44" height="96" rx="7" fill="url(#${x.id("wd2")})"/><clipPath id="${x.id("pc")}"><rect x="78" y="52" width="44" height="96" rx="7"/></clipPath><g clip-path="url(#${x.id("pc")})">${gr}</g>
${x.on ? `<rect x="78" y="52" width="44" height="96" rx="7" fill="url(#${x.id("pl")})" opacity="${x.op(.8)}"/>` : ""}
<rect x="78.6" y="52.6" width="42.8" height="94.8" rx="6.6" fill="none" stroke="#f1c18a" stroke-opacity=".25"/>
<circle cx="100" cy="60" r="1.8" fill="${x.url("brs")}"/><circle cx="100" cy="140" r="1.8" fill="${x.url("brs")}"/>
<rect x="91" y="119" width="18" height="18" rx="2" fill="${x.url("brs")}"/>${[123, 127, 131].map((y) => `<path d="M91 ${y} H109" stroke="#4d3210" stroke-opacity=".55" stroke-width=".8"/>`).join("")}
<ellipse cx="100" cy="137" rx="9" ry="2" fill="#4d3210"/>` + bulb(x, 100, 93, 1.7, "tube");
      return scene(x, "slate", W, F, ex);
    } }),

     base({ id: "shell", name: "Plaster shell", colors: COLS2, cast: "up", glow: { x: .5, y: .42, r: 1.15 }, colors2: ["#f2efe8", "#e8dcc4", "#c47a5a", "#9fb39a", "#2a2b33"], picker2: true, colorLabel2: "Shade", render(o) {
      const x = ctx(o); x.k2 = "cer"; x.c2v = x.c2 || "#f2efe8"; const _t = 0;
      const tops = [[52, 88], [64, 80], [76, 78], [88, 77], [100, 76], [112, 77], [124, 78], [136, 80], [148, 88]];
      let d = "M100 152 C90 150 60 114 52 88"; for (let i = 1; i < tops.length; i++) { const [ax, ay] = tops[i - 1], [bx, by] = tops[i]; d += ` Q${f((ax + bx) / 2)} ${f(Math.min(ay, by) - 5)} ${bx} ${by}`; }
      d += " C140 114 110 150 100 152 Z";
      let ribs = ""; tops.forEach(([tx, ty], i) => { if (i === 0 || i === tops.length - 1) return; ribs += `<path d="M100 150 L${tx} ${ty + 1}" stroke="#000" stroke-opacity=".14" stroke-width="1.6"/><path d="M101 150 L${tx + 1.4} ${ty + 1}" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/>`; });
      const ex = rg(x.id("sg"), [[0, "#ffffff"], [.5, x.hot], [1, x.c, .2]], .5, 0, .8);
      const W = scallop(x, 100, 80, -1, 46, 84, 74) + glowE(x, 100, 112, 60, 50, .25);
      const F = drop(x, `<path d="${d}"/>`, 3, 6) + `<path d="${d}" fill="${x.url("cer")}"/>${x.on ? `<path d="${d}" fill="url(#${x.id("sg")})" opacity="${x.op(.35)}"/>` : `<path d="${d}" fill="#000" fill-opacity=".1"/>`}${ribs}
<path d="M100 152 C110 150 140 114 148 88 L136 80 C132 108 112 140 100 152 Z" fill="#000" fill-opacity=".1"/>
<path d="${d.split(" C140")[0].replace("M100 152 C90 150 60 114 52 88", "M52 88")}" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(1) : ".55"}" stroke-width="${x.on ? 2 : 1.2}"/>`;
      return scene(x, "blush", W, F, ex);
    } }),

     base({ id: "alabaster", name: "Alabaster flush", colors: COLS, glow: { x: .5, y: .5, r: 1.2 }, colors2: ["#ece2d2", "#f6f2ea", "#e8c8a8", "#d8d0c8", "#c8d4c0"], picker2: true, colorLabel2: "Stone", render(o) {
      const x = ctx(o); const a2 = x.c2 || "#ece2d2"; const _t = 0;
      const ex = lg(x.id("al"), [[0, H.shade(a2, -.1)], [.3, H.shade(a2, .35)], [.7, a2], [1, H.shade(a2, -.25)]], 0, 0, 1, 1) +
        rg(x.id("alo"), [[0, "#ffffff"], [.4, x.hot], [1, H.mix(x.c, "#c79a62", .25)]], .5, .5, .7) +
        `<clipPath id="${x.id("ac")}"><rect x="70" y="56" width="60" height="88" rx="3"/></clipPath>`;
      const vein = "M70 74 C84 70 92 84 104 80 C116 76 122 66 130 70 M70 108 C80 100 96 112 108 104 C118 98 124 106 130 102 M76 144 C86 128 100 136 112 124 C120 118 126 122 130 118 M88 56 C92 66 86 76 92 88 M118 84 C114 92 120 100 116 112 M70 128 C78 124 82 130 90 126";
      const W = glowE(x, 100, 100, 88, 84, .6);
      const F = drop(x, `<rect x="66" y="50" width="68" height="100" rx="3"/>`, 4, 6, .5) +
        `<rect x="70" y="56" width="60" height="88" rx="3" fill="url(#${x.id(x.on ? "alo" : "al")})"/>
${x.on ? `<rect x="70" y="56" width="60" height="88" fill="url(#${x.id("al")})" opacity="${(.55 - .45 * x.L).toFixed(2)}"/>` : ""}
<g clip-path="url(#${x.id("ac")})"><path d="${vein}" fill="none" stroke="${x.on ? H.shade(x.c, -.35) : "#8e7c62"}" stroke-opacity="${x.on ? ".22" : ".32"}" stroke-width="1.5"/>
<path d="${vein}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".7" transform="translate(-1 -1)"/>
<path d="M70 56 L96 56 L70 92 Z" fill="#fff" fill-opacity=".14"/></g>
<rect x="66" y="50" width="68" height="8" rx="2" fill="${x.url("brs")}"/><rect x="66" y="142" width="68" height="8" rx="2" fill="${x.url("brs")}"/>
${hl("M68 51.6 H132", .45, 1)}${hl("M68 143.6 H132", .35, 1)}`;
      return scene(x, "dark", W, F, ex);
    } }),

     base({ id: "rattan", name: "Rattan sconce", colors: COLS2, cast: "both", glow: { x: .5, y: .5, r: 1.15 }, colors2: ["#d7ac6c", "#2a2a2e", "#efe6d6", "#8a5a2b", "#8a9a7e"], picker2: true, colorLabel2: "Weave", render(o) {
      const x = ctx(o); const r2 = x.c2 || "#d7ac6c"; const _t = 0, S = "M64 60 Q100 66 136 60 L152 136 Q100 146 48 136 Z", r = rnd(23);
      let w = ""; for (let k = -120; k < 120; k += 10) w += `M${30 + k} 50 L${130 + k} 150 M${170 - k} 50 L${70 - k} 150 `;
      const ex = `<clipPath id="${x.id("rc")}"><path d="${S}"/></clipPath>` + rg(x.id("rin"), [[0, "#ffffff"], [.35, x.hot], [1, x.c, .9]], .5, .55, .6);
      let dap = ""; for (let i = 0; i < 34; i++) { const a = r() * 6.283, rr = 54 + r() * 34, cx = 100 + Math.cos(a) * rr, cy = 100 + Math.sin(a) * rr * .95;
        dap += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(.8 + r() * 1.6)}" ry="${f(.7 + r() * 1.1)}" fill="${x.hot}" opacity="${x.op((.1 + r() * .25) * (1 - (rr - 54) / 60))}"/>`; }
      const W = scallop(x, 100, 62, -1, 34, 66, 56, .8) + scallop(x, 100, 140, 1, 50, 76, 54, .8) + glowE(x, 100, 100, 80, 76, .35) + dap;
      const F = drop(x, `<path d="${S}"/>`, 4, 6, .5) + `<g clip-path="url(#${x.id("rc")})"><path d="${S}" fill="${x.on ? `url(#${x.id("rin")})` : "#2a1d12"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>
<path d="${w}" fill="none" stroke="${H.shade(r2, -.55)}" stroke-width="4.2"/><path d="${w}" fill="none" stroke="${r2}" stroke-width="2.6"/><path d="${w}" fill="none" stroke="${H.shade(r2, .5)}" stroke-opacity=".55" stroke-width="1" transform="translate(-.8 -.4)"/>
<rect x="40" y="56" width="22" height="96" fill="#000" fill-opacity=".16"/><rect x="138" y="56" width="22" height="96" fill="#000" fill-opacity=".22"/></g>
<path d="M64 60 Q100 66 136 60" fill="none" stroke="#6a4520" stroke-width="3.4"/><path d="M64 60 Q100 66 136 60" fill="none" stroke="#e2b874" stroke-width="1.6"/>
<path d="M48 136 Q100 146 152 136" fill="none" stroke="#6a4520" stroke-width="3.8"/><path d="M48 136 Q100 146 152 136" fill="none" stroke="${x.on ? x.hot : "#e2b874"}" stroke-opacity="${x.on ? x.op(1) : 1}" stroke-width="1.8"/>`;
      return scene(x, "stucco", W, F, ex);
    } }),

     base({ id: "gooseneck", name: "Barn light", colors: OUT, cast: "down", glow: { x: .64, y: .45, r: 1.15 }, colors2: ["#2f6049", "#7a1f2a", "#2a2b33", "#ecebf0", "#2b3c63", "#c99a48"], picker2: true, colorLabel2: "Shade", render(o) {
      const x = ctx(o); const e2 = x.c2 || "#2f6049"; const _t = 0, S = "M122 64 C122 59 134 59 134 64 L168 90 L88 90 Z";
      const ex = lg(x.id("en"), [[0, H.shade(e2, -.6)], [.3, e2], [.45, H.shade(e2, .25)], [.7, H.shade(e2, -.35)], [1, H.shade(e2, -.7)]]);
      const W = scallop(x, 128, 90, 1, 38, 62, 102);
      const F = drop(x, `<path d="${S}"/><circle cx="34" cy="66" r="11"/>`, 4, 7, .5) +
        `<circle cx="34" cy="66" r="11" fill="url(#${x.id("en")})"/><circle cx="34" cy="66" r="7" fill="none" stroke="#000" stroke-opacity=".35"/>${hl("M27 60 A9 9 0 0 1 34 56", .35, 1.2)}
${tube("M40 64 C56 26 116 24 128 56", "green", 4.6)}
<rect x="123" y="54" width="10" height="9" rx="1.6" fill="url(#${x.id("en")})"/>
<path d="${S}" fill="url(#${x.id("en")})"/><path d="M128 60 L168 90 L144 90 Z" fill="#000" fill-opacity=".18"/>${hl("M120 68 L98 85", .3, 2)}
<ellipse cx="128" cy="90" rx="40" ry="5.6" fill="#0c1a13"/>
<ellipse cx="128" cy="90.4" rx="37" ry="4.4" fill="${x.on ? x.url("fill") : "#e9e6dc"}" opacity="${x.on ? x.op(1) : ".5"}"/>
${x.on ? `<ellipse cx="128" cy="91" rx="12" ry="2.6" fill="#fff" opacity="${x.op(.95)}"/>` : ""}
<path d="M88 90 A40 5.6 0 0 0 168 90" fill="none" stroke="#7fb89a" stroke-opacity=".55" stroke-width="1"/>`;
      return scene(x, "barn", W, F, ex);
    } }),

     base({ id: "coach", name: "Coach lantern", colors: FLAME, glow: { x: .5, y: .5, r: 1.1 }, colors2: ["#2a2b33", "#5a4232", "#c99a48", "#ecebf0", "#2f4a3c"], picker2: true, colorLabel2: "Frame", render(o) {
      const x = ctx(o); x.k2 = "blk"; x.c2v = x.c2 || "#2a2b33"; const _t = 0, cage = "M74 66 L126 66 L120 136 L80 136 Z";
      const gl = x.on ? H.rgba(x.c, (.16 + .22 * x.L).toFixed(2)) : "rgba(210,225,240,.08)";
      const W = flick(glowE(x, 100, 102, 84, 82, .6) + scallop(x, 100, 140, 1, 22, 44, 50, .45), 0);
      const F = drop(x, `<rect x="92" y="40" width="16" height="112" rx="3"/><path d="${cage}"/>`, 4, 6, .5) +
        `<rect x="92" y="40" width="16" height="112" rx="3" fill="${x.url("blk")}"/>
<path d="M76 68 L124 68 L118.4 134 L81.6 134 Z" fill="${gl}"/>` + candle(x, 100, 110, 134, 10) + flick(bulb(x, 100, 95, 1, "flame", false, true), .5) +
        `<path d="M78 70 L92 70 L84 100 Z" fill="#fff" fill-opacity=".14"/><path d="M110 70 L122 70 L121 80 Z" fill="#fff" fill-opacity=".08"/>
<path d="${cage} M79 70 L121 70 L116.4 132 L83.6 132 Z" fill-rule="evenodd" fill="${x.url("blk")}"/>
<path d="M90 66 L91.4 136 M110 66 L108.6 136" stroke="#15151b" stroke-width="2.2"/><path d="M89.6 68 L91 134" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>
<path d="M68 66 H132 L118 52 H82 Z" fill="${x.url("blk")}"/><path d="M100 52 L118 52 L132 66 L112 66 Z" fill="#000" fill-opacity=".25"/>${hl("M72 64.6 L84 53.6", .25, 1)}
<rect x="66" y="64" width="68" height="4" rx="1" fill="${x.url("blk")}"/><rect x="90" y="44" width="20" height="8" rx="1.6" fill="${x.url("blk")}"/><circle cx="100" cy="41" r="3.6" fill="${x.url("blk")}"/>
<rect x="76" y="134" width="48" height="6" rx="1.4" fill="${x.url("blk")}"/><path d="M90 140 L110 140 L104 150 L96 150 Z" fill="${x.url("blk")}"/><circle cx="100" cy="152" r="2.6" fill="${x.url("blk")}"/>`;
      return scene(x, "siding", W, F);
    } }),

     base({ id: "cube", name: "Up/down cube", colors: OUT, cast: "both", glow: { x: .52, y: .5, r: 1 }, colors2: ["#3a3c44", "#ecebf0", "#5a4232", "#9a9ca4", "#2f4a3c"], picker2: true, colorLabel2: "Finish", parts: UDP, render(o0) {
      const o = udO(o0), x = ctx(o); const b2 = x.c2 || "#3a3c44"; const _t = 0, xu = udX(x, o0, "up"), xd = udX(x, o0, "down");
      const ex = lg(x.id("gp"), [[0, H.shade(b2, -.2)], [.4, H.shade(b2, .15)], [1, H.shade(b2, -.4)]], 0, 0, 1, 1);
      const W = scallop(xu, 100, 77, -1, 7, 26, 69) + scallop(xd, 100, 125, 1, 7, 26, 67) + (o0.mf ? glowE(xu, 104, 86, 30, 22, .2) + glowE(xd, 104, 114, 30, 22, .2) : glowE(x, 104, 100, 30, 40, .2));
      const F = drop(x, `<rect x="76" y="76" width="56" height="48"/>`, 5, 6, .55) +
        `<rect x="76" y="80" width="48" height="44" fill="url(#${x.id("gp")})"/><path d="M124 80 L136 74 L136 118 L124 124 Z" fill="#141519"/>
<path d="M76 80 L88 74 L136 74 L124 80 Z" fill="#5d606b"/>
<rect x="90" y="75.4" width="22" height="3" rx="1.4" fill="${xu.on ? x.hot : "#2a2c33"}" ${xu.on ? `opacity="${xu.op(1)}"` : ""}/>
${xu.on ? `<rect x="94" y="75.8" width="14" height="1.6" rx=".8" fill="#fff" opacity="${xu.op(.9)}"/>` : ""}
<path d="M90 124 H110" stroke="${xd.on ? x.hot : "#555"}" stroke-opacity="${xd.on ? xd.op(1) : ".6"}" stroke-width="1.8" stroke-linecap="round"/>
${hl("M77 81 H123", .2, 1)}${hl("M77.4 82 V122", .14, 1)}`;
      return scene(x, "concrete", W, F, ex);
    } }),

     base({ id: "jar", name: "Porch jar", colors: [AMBER, WARM, SOFT, DAY, "#9ef0c4"], glow: { x: .5, y: .56, r: 1.05 }, colors2: ["#bfe3d6", "#eef4f8", "#d99a4a", "#8fb7d9", "#6b5e55"], picker2: true, colorLabel2: "Glass", render(o) {
      const x = ctx(o); const j2 = x.c2 || "#bfe3d6"; const _t = 0, J = "M82 74 C76 80 74 90 74 102 L74 132 C74 144 82 148 100 148 C118 148 126 144 126 132 L126 102 C126 90 124 80 118 74 Z";
      const ex = lg(x.id("gv"), [[0, "#6e7a80"], [.25, "#e6eef2"], [.45, "#9aa6ac"], [.7, "#d4dde2"], [1, "#58626a"]]) +
        lg(x.id("jg"), [[0, j2, .34], [.25, j2, .1], [.6, j2, .07], [1, j2, .4]]);
      let ribs = ""; [84, 92, 108, 116].forEach((rx2) => { ribs += `<path d="M${rx2} 82 V144" stroke="#fff" stroke-opacity=".16" stroke-width="1.6"/><path d="M${rx2 + 1.4} 82 V144" stroke="#000" stroke-opacity=".12" stroke-width=".8"/>`; });
      const W = glowE(x, 100, 112, 76, 74, .55) + scallop(x, 100, 148, 1, 22, 42, 42, .6);
      const F = drop(x, `<path d="${J}"/><circle cx="100" cy="40" r="10"/>`, 4, 6, .45) +
        `<circle cx="100" cy="40" r="10" fill="${x.url("blk")}"/>${tube("M100 46 V62", "black", 4.4)}
<path d="${J}" fill="url(#${x.id("jg")})"/>${x.on ? `<path d="${J}" fill="${x.c}" fill-opacity="${x.op(.2)}"/>` : ""}` + bulb(x, 100, 106, 1.35, "pear", true) +
        `${ribs}<path d="${J}" fill="none" stroke="#fff" stroke-opacity=".42" stroke-width="1"/><path d="M84 100 C82 112 82 126 84 138" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="100" cy="146" rx="22" ry="2.6" fill="${x.on ? x.hot : "#fff"}" opacity="${x.on ? x.op(.7) : ".18"}"/>
<rect x="80" y="60" width="40" height="15" rx="2" fill="url(#${x.id("gv")})"/>${[64, 68, 72].map((y) => `<path d="M80 ${y} H120" stroke="#3b4247" stroke-opacity=".45" stroke-width=".8"/>`).join("")}`;
      return scene(x, "battens", W, F, ex);
    } }),

     base({ id: "flood", name: "Twin floodlight", colors: [DAY, SOFT, WARM, "#8fd0ff", "#9ef0c4"], cast: "down", glow: { x: .5, y: .36, r: 1.35 }, colors2: ["#e8e6ec", "#2a2b33", "#5a4232", "#9a9ca4"], picker2: true, colorLabel2: "Housing", render(o) {
      const x = ctx(o); const h2 = x.c2 || "#e8e6ec"; const _t = 0;
      const ex = lg(x.id("fw"), [[0, H.shade(h2, -.38)], [.3, H.shade(h2, .3)], [.7, H.shade(h2, -.05)], [1, H.shade(h2, -.45)]], 0, 0, 0, 1);
      const head = (cx, cy, a) => `<g transform="translate(${cx} ${cy}) rotate(${a})"><rect x="-19" y="-14" width="38" height="26" rx="6" fill="url(#${x.id("fw")})"/>
${[-12, -6, 0, 6, 12].map((h) => `<path d="M${h} -13.4 V-8" stroke="#000" stroke-opacity=".18" stroke-width="1.6"/>`).join("")}
<rect x="-16" y="1" width="32" height="10" rx="3" fill="${x.on ? x.url("fill") : "#3c4048"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>${x.on ? `<rect x="-12" y="4" width="24" height="4" rx="2" fill="#fff" opacity="${x.op(.95)}"/>` : `<rect x="-14" y="2" width="12" height="3" rx="1.4" fill="#fff" fill-opacity=".18"/>`}
${hl("M-15 -12 H15", .5, 1)}</g>`;
      const W = scallop(x, 60, 84, 1, 18, 52, 108) + scallop(x, 140, 84, 1, 18, 52, 108) + glowE(x, 100, 82, 76, 26, .4);
      const F = drop(x, `<circle cx="100" cy="46" r="15"/><rect x="40" y="56" width="120" height="30" rx="8"/>`, 4, 6, .45) +
        `<circle cx="100" cy="46" r="15" fill="url(#${x.id("fw")})"/><circle cx="100" cy="46" r="11" fill="none" stroke="#000" stroke-opacity=".12"/>
${tube("M94 52 L72 62", "chrome", 5)}${tube("M106 52 L128 62", "chrome", 5)}` + head(62, 70, 20) + head(138, 70, -20) +
        `<rect x="95" y="58" width="10" height="10" rx="2" fill="url(#${x.id("fw")})"/><path d="M90 74 A10 10 0 0 1 110 74 Z" fill="#e6e3ea"/>
<path d="M90 74 A10 10 0 0 1 110 74 Z" fill="${x.url("gl")}"/>${[93, 97, 101, 105].map((h) => `<path d="M${h} 74 C${h - .6} 70 ${h} 66 ${h + 2} 65" fill="none" stroke="#000" stroke-opacity=".12" stroke-width=".6"/>`).join("")}
<rect x="88" y="73.4" width="24" height="3" rx="1.2" fill="#c9c6cf"/>`;
      return scene(x, "brick", W, F, ex);
    } }),

     base({ id: "step", name: "Step light", colors: [SOFT, WARM, DAY, "#8fd0ff", "#b9a6ff"], cast: "down", glow: { x: .5, y: .62, r: .95 }, colors2: ["#c3c8d2", "#2a2b33", "#ecebf0", "#5a4232", "#c99a48"], picker2: true, colorLabel2: "Plate", render(o) {
      const x = ctx(o); const s2c = x.c2 || "#c3c8d2"; const _t = 0;
      const ex = lg(x.id("fl"), [[0, "#5a4030"], [1, "#2c1f16"]], 0, 0, 0, 1) + lg(x.id("ss"), [[0, H.shade(s2c, -.45)], [.3, H.shade(s2c, .3)], [.6, H.shade(s2c, -.1)], [1, H.shade(s2c, -.5)]], 0, 0, 0, 1);
      let pl = ""; [-90, -54, -18, 18, 54, 90, 126].forEach((k) => { pl += `<path d="M${100 + k * .6} 150 L${100 + k * 1.3} 192" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`; });
      const U = `<rect x="8" y="148" width="184" height="44" fill="url(#${x.id("fl")})"/>${pl}<path d="M8 162 H192 M8 178 H192" stroke="#000" stroke-opacity=".08"/>
<rect x="8" y="138" width="184" height="11" fill="#d9d4ca" fill-opacity=".22"/><path d="M8 138 H192" stroke="#fff" stroke-opacity=".2"/><path d="M8 149 H192" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/>`;
      const W = scallop(x, 100, 122, 1, 24, 52, 26, 1.3) + `<ellipse cx="100" cy="162" rx="78" ry="16" fill="${x.url("pool")}" opacity="${x.op(.9)}"/><ellipse cx="100" cy="158" rx="44" ry="8" fill="${x.url("pool")}" opacity="${x.op(.8)}"/>
<rect x="30" y="138" width="140" height="11" fill="${x.url("halo")}" opacity="${x.op(.6)}"/>`;
      const F = drop(x, `<rect x="72" y="100" width="56" height="26" rx="3"/>`, 2, 3, .45) +
        `<rect x="72" y="100" width="56" height="26" rx="3" fill="url(#${x.id("ss")})"/><rect x="77" y="105" width="46" height="16" rx="1.6" fill="#15161b"/>
${x.on ? `<rect x="77" y="105" width="46" height="16" rx="1.6" fill="${x.c}" opacity="${x.op(.5)}"/><rect x="78" y="113" width="44" height="8" rx="1" fill="${x.url("fill")}" opacity="${x.op(1)}"/>` : ""}
${[106.5, 110.5, 114.5].map((y) => `<rect x="77" y="${y}" width="46" height="3" rx=".6" fill="url(#${x.id("ss")})"/>`).join("")}
${x.on ? `<path d="M78 121 H122" stroke="#fff" stroke-opacity="${x.op(.9)}" stroke-width="1"/>` : ""}${hl("M74 101.4 H126", .45, .8)}
<circle cx="75" cy="113" r="1.2" fill="#3c3f4a"/><circle cx="125" cy="113" r="1.2" fill="#3c3f4a"/>`;
      return scene(x, "plaster", W, F, ex, U);
    } }),

     base({ id: "reading", name: "Bed reading light", colors: [SOFT, WARM, DAY, "#ffd6a0", "#b9a6ff"], cast: "down", glow: { x: .62, y: .52, r: 1 }, colors2: ["#d6d9de", "#2a2b33", "#c99a48", "#ecebf0", "#b8774f"], picker2: true, colorLabel2: "Head", render(o) {
      const x = ctx(o); x.k2 = "chr"; x.c2v = x.c2 || "#d6d9de"; const _t = 0;
      const ex = lg(x.id("hb"), [[0, "#7d7182"], [.5, "#5c5262"], [1, "#3c3442"]], 0, 0, 0, 1) + lg(x.id("bm"), [[0, x.c, .7], [.5, x.c, .25], [1, x.c, 0]], 0, 0, 0, 1);
      let tufts = ""; for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) { const tx = 36 + i * 26 + (row % 2) * 13, ty = 152 + row * 16;
        tufts += `<circle cx="${tx}" cy="${ty}" r="1.8" fill="#2b2430"/><path d="M${tx - 9} ${ty - 6} L${tx} ${ty} L${tx + 9} ${ty - 6} M${tx - 9} ${ty + 6} L${tx} ${ty} L${tx + 9} ${ty + 6}" stroke="#2b2430" stroke-opacity=".45" stroke-width=".8" fill="none"/>`; }
      const U = `${drop(x, `<path d="M20 200 V152 C20 140 28 136 40 136 H160 C172 136 180 140 180 152 V200 Z"/>`, 0, 4, .5)}
<path d="M20 200 V152 C20 140 28 136 40 136 H160 C172 136 180 140 180 152 V200 Z" fill="url(#${x.id("hb")})"/>${tufts}${hl("M30 140 H170", .18, 2)}`;
      const W = `<path d="M114.5 107.7 L129.5 102.3 L182 176 L120 196 Z" fill="url(#${x.id("bm")})" opacity="${x.op(.55)}"/>
<path d="M117 107 L127 103.4 L170 180 L132 192 Z" fill="url(#${x.id("bm")})" opacity="${x.op(.5)}"/>
<ellipse cx="150" cy="178" rx="34" ry="12" fill="${x.url("pool")}" opacity="${x.op(.9)}" transform="rotate(-12 150 178)"/>` + glowE(x, 122, 100, 30, 26, .5);
      const F = drop(x, `<rect x="34" y="56" width="12" height="28" rx="3"/>`, 3, 5, .45) +
        `<rect x="34" y="56" width="12" height="28" rx="3" fill="${x.url("chr")}"/>${tube("M46 70 H96 C104 70 110 72 112 77", "chrome", 3.8)}
<g transform="translate(116 88) rotate(70)"><rect x="-13" y="-8" width="31" height="16" rx="3" fill="${x.url("chr")}"/><rect x="-13" y="-8" width="6" height="16" rx="2" fill="#2c3038"/>
<ellipse cx="18" cy="0" rx="2.6" ry="7.6" fill="${x.on ? x.url("fill") : "#2c3038"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>${x.on ? `<ellipse cx="18.4" cy="0" rx="1.4" ry="4" fill="#fff" opacity="${x.op(1)}"/>` : ""}
<path d="M-6 -6.4 H16" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/></g>`;
      return scene(x, "slate", W, F, ex, U);
    } }),

     base({ id: "deco", name: "Art deco fan", colors: [SOFT, WARM, DAY, "#ff9fb6", "#9ef0c4"], cast: "up", glow: { x: .5, y: .5, r: 1.15 }, colors2: ["#e4e8f0", "#ecd9b8", "#efc4cc", "#bcd8c0", "#9a9aa6"], picker2: true, colorLabel2: "Glass", render(o) {
      const x = ctx(o); const d2 = x.c2 || "#e4e8f0"; const _t = 0, Fn = "M58 118 A42 42 0 0 1 142 118 Z";
      const ex = rg(x.id("fg"), [[0, H.mix("#f4f6fa", d2, .5), .95], [.7, H.mix("#cdd3de", d2, .7), .85], [1, H.shade(H.mix("#8a93a6", d2, .6), -.1), .9]], .5, 1, 1) +
        rg(x.id("fgo"), [[0, "#ffffff"], [.45, H.mix(x.hot, d2, .3)], [1, H.mix(x.c, d2, .3)]], .5, 1, 1);
      let pleats = ""; for (let a = 195; a < 345; a += 15) { const r = a * Math.PI / 180;
        pleats += `<path d="M100 118 L${f(100 + 42 * Math.cos(r))} ${f(118 + 42 * Math.sin(r))}" stroke="#fff" stroke-opacity=".55" stroke-width="1"/><path d="M100.8 118 L${f(100.8 + 42 * Math.cos(r + .04))} ${f(118 + 42 * Math.sin(r + .04))}" stroke="#000" stroke-opacity=".12" stroke-width="1"/>`; }
      const W = scallop(x, 100, 80, -1, 30, 74, 72) + glowE(x, 100, 104, 70, 56, .45);
      const F = drop(x, `<path d="${Fn}"/><rect x="70" y="118" width="60" height="22"/>`, 3, 6, .45) +
        `<path d="${Fn}" fill="url(#${x.id(x.on ? "fgo" : "fg")})" ${x.on ? `opacity="${(.55 + .45 * x.L).toFixed(2)}"` : ""}/>${pleats}
<path d="M70 118 A30 30 0 0 1 130 118" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>
<path d="M58 118 A42 42 0 0 1 142 118" fill="none" stroke="${x.on ? x.hot : "#e9edf4"}" stroke-opacity="${x.on ? x.op(1) : ".7"}" stroke-width="1.6"/>
<rect x="66" y="117" width="68" height="6" rx="1" fill="${x.url("chr")}"/><rect x="74" y="123" width="52" height="6" rx="1" fill="${x.url("chr")}"/>
<rect x="82" y="129" width="36" height="6" rx="1" fill="${x.url("chr")}"/><path d="M92 135 H108 L100 145 Z" fill="${x.url("chr")}"/>
${hl("M67 118.4 H133", .6, .8)}${hl("M75 124.4 H125", .5, .8)}${hl("M83 130.4 H117", .45, .8)}`;
      return scene(x, "navy", W, F, ex);
    } }),

     base({ id: "candelabra", name: "Twin candle sconce", colors: FLAME, glow: { x: .5, y: .38, r: 1.3 }, colors2: ["#c99a48", "#2a2b33", "#d6d9de", "#5a4232", "#ecebf0"], picker2: true, colorLabel2: "Finish", render(o) {
      const x = ctx(o); x.k2 = "brs"; x.c2v = x.c2 || "#c99a48"; const _t = 0;
      const cup = (cx) => `<path d="M${cx - 15} 116 H${cx + 15} C${cx + 13} 121 ${cx + 7} 124 ${cx} 124 C${cx - 7} 124 ${cx - 13} 121 ${cx - 15} 116 Z" fill="${x.url("brs")}"/><ellipse cx="${cx}" cy="116" rx="15" ry="3" fill="${x.url("brsv")}"/>`;
      const W = flick(glowE(x, 62, 72, 56, 58, .5), 0) + flick(glowE(x, 138, 72, 56, 58, .5), 1.3) + scallop(x, 100, 70, -1, 44, 80, 62, .4);
      const F = drop(x, `<ellipse cx="100" cy="108" rx="11" ry="28"/>`, 4, 6, .45) +
        `<ellipse cx="100" cy="108" rx="11" ry="28" fill="${x.url("brs")}"/><ellipse cx="100" cy="108" rx="7" ry="22" fill="none" stroke="#4d3210" stroke-opacity=".5"/>
<circle cx="100" cy="78" r="4" fill="${x.url("brs")}"/><path d="M97 74 L100 66 L103 74 Z" fill="${x.url("brs")}"/><path d="M96 136 L104 136 L100 146 Z" fill="${x.url("brs")}"/>
${tube("M100 118 C86 136 64 134 62 122", "brass", 4.2)}${tube("M100 118 C114 136 136 134 138 122", "brass", 4.2)}` +
        cup(62) + cup(138) + candle(x, 62, 88, 116, 12) + candle(x, 138, 88, 116, 12) +
        flick(bulb(x, 62, 72, 1.08, "flame", false, true), .4) + flick(bulb(x, 138, 72, 1.08, "flame", false, true), 1.7);
      return scene(x, "greige", W, F);
    } }),

     base({ id: "hexagon", name: "Hex light panels", colors: RGB, colorLabel: "Colors", glow: { x: .5, y: .5, r: 1.3 }, render(o) {
      const x = ctx(o), R = 22, cells = [[-2, 1], [-1, 1], [-1, 0], [0, 0], [0, -1], [1, -1], [2, -2], [1, 0]];
      const pts = cells.map(([q, r]) => [R * Math.sqrt(3) * (q + r / 2), R * 1.5 * r]);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const ox = 100 - (Math.min(...xs) + Math.max(...xs)) / 2, oy = 100 - (Math.min(...ys) + Math.max(...ys)) / 2;
      const tints = [x.c, H.mix(x.c, "#ff3fb0", .5), H.mix(x.c, "#3f8cff", .5), x.c, H.mix(x.c, "#ffffff", .4), H.mix(x.c, "#22e0c0", .5), H.mix(x.c, "#ff8a3c", .45), H.shade(x.c, -.15)];
      const hex = (cx, cy, rr) => "M" + [0, 1, 2, 3, 4, 5].map((i) => { const a = (60 * i - 90) * Math.PI / 180; return `${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`; }).join(" L") + " Z";
      const ex = rg(x.id("hg"), [[0, "#ffffff", .7], [.5, "#ffffff", .15], [1, "#ffffff", 0]], .5, .45, .6) + rg(x.id("ho"), [[0, "#f2f0f4"], [1, "#a9a6b2"]], .4, .35, .8);
      let W = "", F = "", D = "";
      pts.forEach(([px, py], i) => { const cx = px + ox, cy = py + oy, t = tints[i], d = hex(cx, cy, R - 1.6);
        W += `<defs>${rg(x.id("hh" + i), [[0, t, .55], [.5, t, .18], [1, t, 0]])}</defs><circle cx="${f(cx)}" cy="${f(cy)}" r="${R * 2}" fill="url(#${x.id("hh" + i)})" opacity="${x.op(.8)}"/>`;
        D += `<path d="${d}"/>`;
        F += `<path d="${d}" fill="${x.on ? t : `url(#${x.id("ho")})`}" ${x.on ? `opacity="${(.7 + .3 * x.L).toFixed(2)}"` : 'opacity=".55"'}/>
${x.on ? `<path d="${d}" fill="url(#${x.id("hg")})" opacity="${x.op(.9)}"/><path d="${hex(cx, cy, R - 4)}" fill="none" stroke="#fff" stroke-opacity="${x.op(.35)}" stroke-width="1"/>` : `<path d="${hex(cx, cy, R - 4)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>`}
<path d="${d}" fill="none" stroke="${x.on ? H.mix(t, "#fff", .5) : "#d8d5de"}" stroke-opacity="${x.on ? x.op(.9) : ".5"}" stroke-width="1.2"/>`; });
      return scene(x, "dark", W + glowE(x, 100, 100, 92, 88, .25), drop(x, D, 2, 4, .55) + F, ex);
    } }),
  ];

  icons.forEach((ic) => { const r0 = ic.render, g = ic.glow || { x: .5, y: .5, r: 1 };
    ic.render = (o) => r0(o).replace("<!--solo-->", o.on ? `<circle class="${P}solo" cx="${f(g.x * 200)}" cy="${f(g.y * 200)}" r="${f(30 * (g.r || 1))}" fill="url(#${o.uid}-halo)" opacity="${(.35 + .5 * (o.level == null ? 1 : o.level)).toFixed(2)}"/>` : ""); });
  (window.HDA = window.HDA || []).push({
    id: "wall",
    tab: "Wall lights",
    group: "Lights",
    kind: "light",
    intro: "Twenty wall lights, indoor sconces and outdoor fixtures, each on its own wall. Lit fixtures glow in the light color and wash the wall up, down, both ways or all around.",
    
    css: `.hda-wall-solo{display:none}.hda-nobg .hda-wall-solo{display:inline}
.hda-anim .hda-wall-flick{animation:hda-wall-flick 2.6s ease-in-out infinite}
@keyframes hda-wall-flick{0%,100%{opacity:1}18%{opacity:.9}31%{opacity:.97}47%{opacity:.86}63%{opacity:.98}80%{opacity:.92}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-wall-flick{animation:none}}`,
    icons,
  });
})();
