(function () {
  const P = "hda-kitchen3-";
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const SS = "#c3c8ce", WH = "#f1f1ee", BK = "#26282c";
  const isSteel = (c) => String(c).toLowerCase() === SS;
  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${st(stops)}</radialGradient>`;

  function ctx(o) {
    const c = o.color || SS, on = !!o.on, lv = o.level == null ? .6 : Math.max(0, Math.min(1, o.level));
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, lv, id, url, steel: isSteel(c), B: .45 + .55 * lv };
  }
  function defs(x, extra) {
    const { c, id } = x;
    return `<defs>
${lg(id("f"), x.steel ? [[0, H.shade(c, -.25)], [.15, H.shade(c, .35)], [.5, c], [.85, H.shade(c, .15)], [1, H.shade(c, -.3)]] : [[0, H.shade(c, -.18)], [.22, H.shade(c, .14)], [.6, c], [1, H.shade(c, -.22)]])}
${lg(id("fv"), [[0, H.shade(c, .2)], [1, H.shade(c, -.15)]], 1)}
${rg(id("fr"), [[0, H.shade(c, .35)], [.6, c], [1, H.shade(c, -.25)]], .38, .3, .8)}
<pattern id="${id("br")}" width="4" height="40" patternUnits="userSpaceOnUse"><rect width=".5" height="40" fill="#fff" fill-opacity=".16"/><rect x="1.6" width=".4" height="40" fill="#000" fill-opacity=".1"/><rect x="2.8" width=".6" height="40" fill="#fff" fill-opacity=".08"/></pattern>
${lg(id("ss"), [[0, "#5d646c"], [.35, "#eef1f4"], [.6, "#a9b0b8"], [1, "#4e545b"]])}
${lg(id("ssv"), [[0, "#eef1f4"], [.5, "#a9b0b8"], [1, "#5a6067"]], 1)}
${lg(id("bk"), [[0, "#14151a"], [.4, "#3a3c44"], [1, "#0e0f12"]])}
${lg(id("bkv"), [[0, "#44464e"], [1, "#101115"]], 1)}
${lg(id("glass"), [[0, "#dfe9f2", .38], [.3, "#ffffff", .1], [.7, "#ffffff", .05], [1, "#dfe9f2", .32]])}
${lg(id("bean"), [[0, "#6b3d1e"], [1, "#2a160a"]], 1)}
${lg(id("tile"), [[0, "#e9e6df"], [1, "#cfcbc2"]], 1)}
${lg(id("ctr"), [[0, "#d7d3e0"], [.5, "#a9a5ba"], [1, "#c4c0d0"]])}
${rg(id("sh"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("heat"), [[0, "#ffb347", .9], [.5, "#ff6a2a", .4], [1, "#ff6a2a", 0]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const kitchen = (x) => { let t = ""; for (let r = 0; r < 12; r++) { const y = 10 + r * 12; t += `<path d="M0 ${y} H200" stroke="#9c968a" stroke-opacity=".5"/>`; for (let c = 0; c < 9; c++) t += `<path d="M${(c * 26 + (r % 2) * 13) % 210} ${y} V${y + 12}" stroke="#9c968a" stroke-opacity=".5"/>`; }
    return `<g class="hda-bg"><rect width="200" height="158" fill="${x.url("tile")}" opacity=".85"/>${t}<rect x="0" y="0" width="200" height="158" fill="#2c2840" opacity=".45"/>
<rect x="0" y="156" width="200" height="8" fill="${x.url("ctr")}"/><path d="M0 156.5 H200" stroke="#fff" stroke-opacity=".6"/><rect x="0" y="164" width="200" height="36" fill="#2a2638"/></g>`; };
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 4}" fill="${x.url("sh")}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const panel = (x, X, Y, W, Hh, r) => `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${r || 3}" fill="${x.url("f")}"/>${x.steel ? `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${r || 3}" fill="${x.url("br")}"/>` : ""}`;
  const SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g" };
  function digits(str, X, Y, h, col) {
    const w = h * .55, t = Math.max(.6, h * .15); let s = "", xx = X;
    for (const ch of str) { if (ch === ":") { s += `<rect x="${f(xx)}" y="${f(Y + h * .25)}" width="${f(t)}" height="${f(t)}" fill="${col}"/><rect x="${f(xx)}" y="${f(Y + h * .65)}" width="${f(t)}" height="${f(t)}" fill="${col}"/>`; xx += t * 2.4; continue; }
      const g = SEG[ch] || "";
      const sg = { a: [xx + t, Y, w - 2 * t, t], d: [xx + t, Y + h - t, w - 2 * t, t], g: [xx + t, Y + h / 2 - t / 2, w - 2 * t, t], f: [xx, Y + t * .6, t, h / 2 - t], b: [xx + w - t, Y + t * .6, t, h / 2 - t], e: [xx, Y + h / 2 + t * .4, t, h / 2 - t], c: [xx + w - t, Y + h / 2 + t * .4, t, h / 2 - t] };
      for (const k of g) { const [a, b, c, d] = sg[k]; s += `<rect x="${f(a)}" y="${f(b)}" width="${f(c)}" height="${f(d)}" fill="${col}"/>`; } xx += w + t * 1.4; }
    return s;
  }
  const disp = (x, X, Y, W, Hh, str, col) => `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="1.4" fill="#07080b"/>${x.on ? `<g opacity="${x.B.toFixed(2)}">${digits(str, X + 2, Y + Hh * .2, Hh * .6, col || "#ff8a3a")}</g>` : ""}`;
  const temp = (x) => String(Math.round(300 + x.lv * 100));
  const steam = (x, cx, y, big) => x.on ? [0, 1, 2].map((i) => `<path class="${P}steam" style="animation-delay:-${(i * .9).toFixed(1)}s" d="M${cx + (i - 1) * 5} ${y} C${cx + (i - 1) * 5 - 5} ${y - 7} ${cx + (i - 1) * 5 + 5} ${y - 12} ${cx + (i - 1) * 5} ${y - (big ? 26 : 18)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="${big ? 2.4 : 1.6}" stroke-linecap="round"/>`).join("") : "";
  const stream = (x, cx, y1, y2) => x.on ? `<path class="${P}flow" d="M${cx} ${y1} V${y2}" stroke="#5a3214" stroke-width="1.8" stroke-dasharray="3 2"/>` : "";
  const cup = (x, X, Y, w, h) => `<path d="M${X} ${Y} H${X + w} L${X + w - 2} ${Y + h} H${X + 2} Z" fill="#f6f3ee"/><path d="M${X + w} ${Y + 3} C${X + w + 6} ${Y + 3} ${X + w + 6} ${Y + h - 3} ${X + w - 1} ${Y + h - 3}" fill="none" stroke="#f6f3ee" stroke-width="2"/>${x.on ? `<ellipse cx="${X + w / 2}" cy="${Y + 1.5}" rx="${w / 2 - 1}" ry="1.4" fill="#8a5a2a"/>` : ""}`;
  const heatGlow = (x, cx, cy, rx, ry) => x.on ? `<ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("heat")}" opacity="${(.3 + .5 * x.lv).toFixed(2)}"/>` : "";
  const base = (o) => Object.assign({ picker: true, colorLabel: "Finish" }, o);
  // (multi-function) espresso machines: State (stage: off / heating / brewing / ready). As a Device Image (no o.mf) the
  // drawing is exactly as today. As a Multi-Function Image (o.mf): heating = the lights on, the gauge climbing; brewing =
  // the shot pours, steam, the gauge high; ready = the lights on, a full cup, steam; left out = off.
  function CF(o) {
    const x = ctx(o);
    if (!o.mf) return { x, D: x, B: x, S: x, G: x };
    const s = o.pval && o.pval.state != null ? String(o.pval.state) : "", brew = s === "brewing", rdy = s === "ready", v = (on, lv) => Object.assign({}, x, { on }, lv == null ? {} : { lv });
    return { x, D: v(!!s && s !== "idle"), B: v(brew), S: v(brew || rdy), G: v(!!s && s !== "idle", brew ? .85 : s === "heating" ? .35 : rdy ? .6 : 0) };
  }

  function slots(x, xs, y, w) {
    const shade = H.mix("#f0d29a", "#5a2e10", x.lv);
    return xs.map((sx) => `<rect x="${sx}" y="${y}" width="${w}" height="5" rx="2.5" fill="#0d0e12"/>${x.on ? `<rect class="${P}glow" x="${sx + 1}" y="${y + 1}" width="${w - 2}" height="3" rx="1.5" fill="#ff7a2a"/><rect x="${sx + 1}" y="${y - 2}" width="${w - 2}" height="3" rx="1.4" fill="${shade}" opacity=".9"/>` : `<rect x="${sx + 2}" y="${y - 9}" width="${w - 4}" height="10" rx="3" fill="${shade}"/>`}`).join("");
  }

  const icons = [
    base({ id: "espresso-with-grinder", name: "Espresso with grinder", colors: [SS, BK, "#b8343a", "#e6dcc6"], render(o) {
      const V = CF(o), x = V.x, a = Math.PI * (1.15 - .9 * V.G.lv);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 64) + `
<path d="M50 34 L62 18 H84 L96 34 Z" fill="${x.url("glass")}" stroke="#fff" stroke-opacity=".4"/><path d="M56 32 L64 22 H82 L90 32 Z" fill="${x.url("bean")}" opacity=".85"/><rect x="58" y="14" width="30" height="6" rx="3" fill="#1a1b20"/>
${panel(x, 40, 34, 120, 122, 5)}<rect x="40" y="148" width="120" height="8" rx="2" fill="#1a1b20"/><rect x="44" y="138" width="112" height="10" rx="2" fill="${x.url("ss")}"/>
<circle cx="108" cy="58" r="12" fill="#f6f3ee"/><circle cx="108" cy="58" r="12" fill="none" stroke="${x.url("ss")}" stroke-width="2"/><path d="M108 58 L${f(108 + Math.cos(a) * 9)} ${f(58 - Math.sin(a) * 9)}" stroke="#b8343a" stroke-width="1.4"/>
<path d="M98 64 A12 12 0 0 1 104 47" fill="none" stroke="#3a3c44" stroke-width="2"/>
<rect x="56" y="70" width="22" height="16" rx="3" fill="#1a1b20"/><path d="M60 86 V96 H74 V86" fill="none" stroke="#1a1b20" stroke-width="3"/>
<rect x="94" y="78" width="28" height="9" rx="4" fill="#1a1b20"/><path d="M122 82 H142" stroke="#1a1b20" stroke-width="5" stroke-linecap="round"/>
<path d="M146 50 L150 112" stroke="${x.url("ss")}" stroke-width="3" stroke-linecap="round"/>${[126, 134, 142].map((xx, i) => `<circle cx="${xx}" cy="66" r="2.6" fill="${V.D.on && i === 1 ? "#ffb347" : "#2c3038"}"/>`).join("")}
${stream(V.B, 108, 88, 122)}${cup(V.S, 100, 120, 16, 18)}${steam(V.S, 108, 118)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }] }),
    base({ id: "slim-espresso-machine", name: "Slim espresso machine", colors: [SS, "#a9c9b8", WH, "#b8343a", BK], render(o) {
      const V = CF(o), x = V.x;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 32) + `
${panel(x, 78, 30, 44, 126, 6)}<rect x="78" y="30" width="44" height="8" rx="3" fill="${x.url("ss")}"/>${hl("M82 40 V150", .35, 1.2)}
${[90, 100, 110].map((xx, i) => `<circle cx="${xx}" cy="50" r="3" fill="#1a1b20"/>${V.D.on && i === 0 ? `<circle cx="${xx}" cy="50" r="1.6" fill="#ffffff"/>` : ""}`).join("")}
<rect x="86" y="76" width="28" height="8" rx="4" fill="#1a1b20"/><path d="M114 80 H132" stroke="#1a1b20" stroke-width="4.6" stroke-linecap="round"/>
<path d="M124 46 L130 96" stroke="${x.url("ss")}" stroke-width="2.6" stroke-linecap="round"/><rect x="80" y="144" width="40" height="10" rx="2" fill="${x.url("ss")}"/>
${stream(V.B, 100, 84, 124)}${cup(V.S, 92, 122, 16, 20)}${steam(V.S, 100, 120)}`);
    }, parts: [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }] }),

    base({ id: "square-basket-air-fryer", name: "Square basket air fryer", colors: ["#3a3c41", WH, BK], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 44) + heatGlow(x, 100, 130, 40, 12) + `
<path d="M66 44 C66 36 72 32 80 32 H120 C128 32 134 36 134 44 L140 150 C140 154 138 156 134 156 H66 C62 156 60 154 60 150 Z" fill="${x.url("f")}"/>
<path d="M70 40 H130 L132 74 H68 Z" fill="${x.url("bkv")}"/>${disp(x, 88, 46, 24, 12, temp(x))}${[76, 124].map((xx) => `<circle cx="${xx}" cy="62" r="3" fill="#2c3038"/>`).join("")}
<path d="M66 92 H134 L138 150 H62 Z" fill="${x.url("bkv")}" opacity=".9"/><rect x="88" y="104" width="24" height="32" rx="5" fill="#1a1b20"/><rect x="92" y="108" width="16" height="10" rx="2" fill="#3a3c44"/>
<path d="M66 90 H134" stroke="${x.on ? "#ff8a3a" : "#000"}" stroke-opacity="${x.on ? (.4 + .5 * x.lv).toFixed(2) : .4}" stroke-width="1.4"/>${hl("M68 46 C68 40 72 36 78 36", .3, 1.2)}`);
    } }),
    base({ id: "round-basket-air-fryer", name: "Round basket air fryer", colors: ["#7c8088", WH, "#a9b8a4", BK], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 50) + heatGlow(x, 100, 128, 46, 12) + `
<path d="M56 60 C56 46 62 40 76 40 H124 C138 40 144 46 144 60 V148 C144 153 141 156 136 156 H64 C59 156 56 153 56 148 Z" fill="${x.url("f")}"/>
<path d="M64 44 H136 C140 44 142 48 142 52 L138 62 H62 L58 52 C58 48 60 44 64 44 Z" fill="${x.url("bkv")}"/>${disp(x, 90, 47, 20, 10, temp(x), "#ffffff")}
${[72, 80, 120, 128].map((xx) => `<circle cx="${xx}" cy="53" r="1.8" fill="${x.on ? "#e8f6ff" : "#5a5d66"}"/>`).join("")}
<rect x="62" y="80" width="76" height="70" rx="8" fill="${x.url("f")}"/><rect x="62" y="80" width="76" height="70" rx="8" fill="#000" opacity=".12"/><path d="M62 80 H138" stroke="${x.on ? "#ff8a3a" : "#000"}" stroke-opacity="${x.on ? (.4 + .5 * x.lv).toFixed(2) : .3}" stroke-width="1.4"/>
<path d="M86 100 H114 C118 100 120 102 120 106 V114 C120 118 118 120 114 120 H86 C82 120 80 118 80 114 V106 C80 102 82 100 86 100 Z" fill="#1a1b20"/>${hl("M60 64 V140", .3, 1.4)}`);
    } }),

    base({ id: "electric-pressure-cooker", name: "Electric pressure cooker", colors: [SS, BK, WH], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 50) + `
<path d="M54 70 H146 V146 C146 152 140 156 132 156 H68 C60 156 54 152 54 146 Z" fill="${x.url("f")}"/>${x.steel ? `<path d="M54 70 H146 V146 C146 152 140 156 132 156 H68 C60 156 54 152 54 146 Z" fill="${x.url("br")}"/>` : ""}
<rect x="44" y="76" width="12" height="8" rx="3" fill="#1a1b20"/><rect x="144" y="76" width="12" height="8" rx="3" fill="#1a1b20"/>
<path d="M50 70 C50 52 72 44 100 44 C128 44 150 52 150 70 Z" fill="${x.url("bkv")}"/><rect x="92" y="40" width="16" height="8" rx="3" fill="#1a1b20"/><rect x="118" y="50" width="8" height="6" rx="2" fill="#3a3c44"/>
<rect x="72" y="88" width="56" height="44" rx="5" fill="#1a1b20"/>${disp(x, 88, 94, 24, 12, x.on ? "0:" + String(Math.round(10 + x.lv * 40)).padStart(2, "0") : "0:00")}
${[0, 1, 2, 3].map((i) => `<rect x="${78 + i * 12}" y="114" width="8" height="4" rx="1" fill="${x.on && i === 1 ? "#ff8a3a" : "#3a3c44"}"/>`).join("")}${steam(x, 122, 48, true)}`);
    } }),
    base({ id: "pressure-crisp-cooker", name: "Pressure-crisp cooker", colors: ["#3a3c41", BK, SS], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 54) + `
<path d="M50 84 H150 V148 C150 153 146 156 140 156 H60 C54 156 50 153 50 148 Z" fill="${x.url("f")}"/>${x.steel ? `<path d="M50 84 H150 V148 C150 153 146 156 140 156 H60 C54 156 50 153 50 148 Z" fill="${x.url("br")}"/>` : ""}
<path d="M48 84 C48 52 70 34 100 34 C130 34 152 52 152 84 Z" fill="${x.url("bkv")}"/><path d="M60 62 C68 46 84 40 100 40" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="3"/>
<rect x="146" y="64" width="10" height="20" rx="3" fill="#1a1b20"/><circle cx="100" cy="40" r="5" fill="#1a1b20"/>
<rect x="66" y="96" width="68" height="40" rx="5" fill="#1a1b20"/>${disp(x, 88, 102, 24, 12, temp(x))}<circle cx="78" cy="118" r="5" fill="#3a3c44"/><circle cx="122" cy="118" r="5" fill="#3a3c44"/>
${x.on ? `<path d="M52 84 H148" stroke="#ff8a3a" stroke-opacity="${(.3 + .5 * x.lv).toFixed(2)}" stroke-width="1.6"/>` : ""}${steam(x, 136, 46)}`);
    } }),
    base({ id: "express-multicooker", name: "Express multicooker", colors: ["#3a3c41", SS, "#7a1f2a"], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 50) + `
<path d="M54 72 H146 V146 C146 152 140 156 132 156 H68 C60 156 54 152 54 146 Z" fill="${x.url("f")}"/>${x.steel ? `<path d="M54 72 H146 V146 C146 152 140 156 132 156 H68 C60 156 54 152 54 146 Z" fill="${x.url("br")}"/>` : ""}
<path d="M50 72 C50 56 72 48 100 48 C128 48 150 56 150 72 Z" fill="${x.url("bkv")}"/><path d="M78 50 C78 38 122 38 122 50" fill="none" stroke="#1a1b20" stroke-width="6" stroke-linecap="round"/><rect x="124" y="54" width="8" height="6" rx="2" fill="#3a3c44"/>
<rect x="70" y="86" width="60" height="48" rx="6" fill="#1a1b20"/>${disp(x, 86, 92, 28, 12, x.on ? String(Math.round(10 + x.lv * 50)).padStart(2, "0") : "00")}<circle cx="100" cy="120" r="7" fill="#3a3c44"/><circle cx="100" cy="120" r="7" fill="none" stroke="${x.on ? "#ff8a3a" : "#555"}" stroke-width="1.2"/>
${steam(x, 128, 52, true)}`);
    } }),

    base({ id: "fuzzy-logic-rice-cooker", name: "Fuzzy-logic rice cooker", colors: [WH, "#e6dcc6", SS], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 52) + `
<path d="M50 94 C50 76 66 64 100 64 C134 64 150 76 150 94 V140 C150 150 140 156 128 156 H72 C60 156 50 150 50 140 Z" fill="${x.url("fr")}"/>
<path d="M54 94 C54 72 76 58 100 58 C124 58 146 72 146 94 Z" fill="${x.url("fv")}"/><path d="M62 82 C70 68 86 62 100 62" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.6"/>
<path d="M70 58 C70 44 130 44 130 58" fill="none" stroke="#9a96a6" stroke-width="4" stroke-linecap="round"/><ellipse cx="118" cy="70" rx="7" ry="3" fill="#bdb9c6"/>
<rect x="72" y="104" width="56" height="36" rx="6" fill="#d9e0e8"/><rect x="80" y="108" width="40" height="14" rx="2" fill="${x.on ? "#bfe8c8" : "#a6aeb6"}"/>${x.on ? digits("0:" + String(Math.round(20 + x.lv * 30)), 86, 110, 10, "#1a2a20") : ""}
${[0, 1, 2].map((i) => `<rect x="${80 + i * 14}" y="128" width="10" height="5" rx="2" fill="${x.on && i === 0 ? "#ff8a3a" : "#8a8f98"}"/>`).join("")}${steam(x, 118, 66)}`);
    } }),
    base({ id: "8-cup-digital-rice-cooker", name: "8-cup digital rice cooker", colors: [SS, WH, BK], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 44) + `
<path d="M60 80 H140 V148 C140 153 136 156 130 156 H70 C64 156 60 153 60 148 Z" fill="${x.url("f")}"/>${x.steel ? `<path d="M60 80 H140 V148 C140 153 136 156 130 156 H70 C64 156 60 153 60 148 Z" fill="${x.url("br")}"/>` : ""}
<path d="M56 80 C56 62 74 54 100 54 C126 54 144 62 144 80 Z" fill="${x.url("bkv")}"/><rect x="88" y="50" width="24" height="7" rx="3" fill="#1a1b20"/><circle cx="122" cy="64" r="3" fill="#3a3c44"/>
<rect x="72" y="92" width="56" height="40" rx="5" fill="#1a1b20"/>${disp(x, 88, 98, 24, 12, x.on ? String(Math.round(15 + x.lv * 30)) : "--", "#5be08a")}
${[0, 1, 2, 3].map((i) => `<rect x="${78 + i * 12}" y="118" width="8" height="4" rx="1" fill="${x.on && i === 2 ? "#5be08a" : "#3a3c44"}"/>`).join("")}${steam(x, 122, 60)}`);
    } }),
    base({ id: "pressure-rice-cooker", name: "Pressure rice cooker", colors: [BK, WH, "#b8774f"], render(o) {
      const x = ctx(o);
      return svg(x, kitchen(x) + shadow(x, 100, 157, 50) + `
<path d="M54 72 C54 62 60 56 70 56 H130 C140 56 146 62 146 72 V146 C146 152 142 156 136 156 H64 C58 156 54 152 54 146 Z" fill="${x.url("f")}"/>
<path d="M56 74 C56 60 62 52 74 50 H126 C138 52 144 60 144 74 Z" fill="${x.url("fv")}"/><path d="M76 50 C82 36 118 36 124 50" fill="none" stroke="${x.url("ss")}" stroke-width="7" stroke-linecap="round"/><rect x="94" y="38" width="12" height="6" rx="2" fill="#1a1b20"/>
<rect x="64" y="84" width="72" height="52" rx="8" fill="#0d0e12"/><rect x="64" y="84" width="72" height="52" rx="8" fill="${x.url("glass")}"/>${disp(x, 84, 92, 32, 14, x.on ? "0:" + String(Math.round(15 + x.lv * 30)) : "0:00", "#ff6a5a")}
${[0, 1, 2, 3, 4].map((i) => `<circle cx="${76 + i * 12}" cy="124" r="2.6" fill="${x.on && i === 2 ? "#ff6a5a" : "#3a3c44"}"/>`).join("")}${steam(x, 100, 40, true)}`);
    } }),

    base({ id: "steel-2-slice-toaster", name: "Steel 2-slice toaster", colors: [SS, BK, "#b8343a"], render(o) {
      const x = ctx(o), lever = x.on ? 134 : 104;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 56) + `
<path d="M56 80 C46 80 40 88 40 98 V146 C40 152 44 156 50 156 H150 C156 156 160 152 160 146 V98 C160 88 154 80 144 80 Z" fill="${x.url("f")}"/>${x.steel ? `<path d="M56 80 C46 80 40 88 40 98 V146 C40 152 44 156 50 156 H150 C156 156 160 152 160 146 V98 C160 88 154 80 144 80 Z" fill="${x.url("br")}"/>` : ""}
${slots(x, [64, 104], 82, 32)}<rect x="44" y="100" width="22" height="44" rx="4" fill="#1a1b20"/><rect x="46" y="${lever - 4}" width="18" height="7" rx="3" fill="${x.url("ss")}"/>
${[112, 122, 132].map((yy, i) => `<rect x="70" y="${yy}" width="10" height="5" rx="2" fill="${x.on && i === 0 ? "#5fb0ff" : "#2c3038"}"/>`).join("")}<circle cx="150" cy="128" r="5" fill="#1a1b20"/>
${hl("M48 96 C48 90 52 86 58 86", .6, 1.6)}${x.on ? `<ellipse class="${P}glow" cx="100" cy="80" rx="54" ry="8" fill="${x.url("heat")}" opacity="${(.2 + .4 * x.lv).toFixed(2)}"/>` : ""}`);
    } }),
    base({ id: "retro-2-slice-toaster", name: "Retro 2-slice toaster", colors: ["#e6dcc6", "#b8343a", "#a9c3d6", "#a9d6c0", BK, WH], render(o) {
      const x = ctx(o), lever = x.on ? 140 : 108;
      return svg(x, kitchen(x) + shadow(x, 100, 157, 54) + `
<path d="M60 76 C40 76 38 92 40 112 C42 134 44 146 60 148 H140 C156 146 158 134 160 112 C162 92 160 76 140 76 Z" fill="${x.url("fr")}"/>
<rect x="46" y="146" width="108" height="10" rx="4" fill="${x.url("ss")}"/>${slots(x, [66, 104], 78, 30)}
<rect x="156" y="98" width="6" height="44" rx="3" fill="#000" opacity=".2"/><rect x="154" y="${lever - 4}" width="14" height="7" rx="3" fill="${x.url("ss")}"/>
<circle cx="84" cy="124" r="6" fill="${x.url("ss")}"/><circle cx="116" cy="124" r="6" fill="${x.url("ss")}"/><path d="M84 124 L${f(84 + Math.cos(Math.PI * (1.2 - .9 * x.lv)) * 4)} ${f(124 - Math.sin(Math.PI * (1.2 - .9 * x.lv)) * 4)}" stroke="#1a1b20" stroke-width="1.4"/>
${hl("M50 92 C52 84 58 80 66 80", .55, 2)}${x.on ? `<ellipse class="${P}glow" cx="100" cy="78" rx="50" ry="8" fill="${x.url("heat")}" opacity="${(.2 + .4 * x.lv).toFixed(2)}"/>` : ""}`);
    } }),
  ];

  const css = `.hda-anim .${P}steam{animation:${P}steam 2.7s ease-in-out infinite}
.hda-anim .${P}flow{animation:${P}flow .5s linear infinite}
.hda-anim .${P}glow{animation:${P}glow 2.4s ease-in-out infinite}
@keyframes ${P}steam{0%{transform:translate(0,4px);opacity:0}40%{opacity:.85}100%{transform:translate(0,-8px);opacity:0}}
@keyframes ${P}flow{from{stroke-dashoffset:0}to{stroke-dashoffset:-5}}
@keyframes ${P}glow{0%,100%{opacity:1}50%{opacity:.65}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}steam,.hda-anim .${P}flow,.hda-anim .${P}glow{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "kitchen3", tab: "Cookers & toasters", group: "Appliances", kind: "device",
    levelLabel: "Heat", onWord: "Cooking", offWord: "Off",
    intro: "Real espresso machines, air fryers, multicookers, rice cookers and toasters. Cooking pulls the shot, warms the basket, steams the valve and glows the toaster slots; the slider sets heat (temperature, gauge, toast shade).",
    
    css, icons,
  });
})();
