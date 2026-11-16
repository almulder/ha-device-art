(function () {
  const P = "hda-floorcare-";
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${st(stops)}</radialGradient>`;

  function ctx(o) {
    const c = o.color || "#7a4fd0", on = !!o.on, lv = o.level == null ? .6 : o.level;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, lv, id, url, mode: lv < .34 ? 1 : lv < .67 ? 2 : 3 };
  }
  function defs(x, extra) {
    const { c, id } = x;
    return `<defs>
${lg(id("ac"), [[0, H.shade(c, -.3)], [.35, H.shade(c, .25)], [.6, c], [1, H.shade(c, -.35)]])}
${lg(id("acv"), [[0, H.shade(c, .2)], [1, H.shade(c, -.25)]], 1)}
${lg(id("nk"), [[0, "#5d646c"], [.35, "#e6e9ee"], [.6, "#a9b0b8"], [1, "#4e545b"]])}
${lg(id("ir"), [[0, "#2a2c31"], [.35, "#6d727b"], [.6, "#45484f"], [1, "#1c1d21"]])}
${lg(id("bk"), [[0, "#14151a"], [.4, "#3a3c44"], [1, "#0e0f12"]])}
${lg(id("bkv"), [[0, "#3a3c44"], [1, "#101115"]], 1)}
${lg(id("clr"), [[0, "#dfe9f2", .35], [.3, "#ffffff", .12], [.7, "#ffffff", .05], [1, "#dfe9f2", .3]])}
${lg(id("wat"), [[0, "#bfe4ff", .55], [1, "#7fc4f0", .75]], 1)}
${lg(id("dirt"), [[0, "#b59a6a", .7], [1, "#6e5a3a", .85]], 1)}
${lg(id("wall"), [[0, "#4b4566"], [1, "#3a3550"]], 1)}
${lg(id("wood"), [[0, "#a87a4c"], [1, "#6e4a2c"]], 1)}
${lg(id("carpet"), [[0, "#8c8296"], [1, "#5a526a"]], 1)}
${lg(id("cone"), [[0, "#fff6dc", .55], [1, "#fff6dc", 0]])}
${lg(id("las"), [[0, "#4dff7a", .65], [1, "#4dff7a", 0]])}
${rg(id("sh"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("glow"), [[0, "#bfe4ff", .8], [1, "#bfe4ff", 0]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;

  function room(x, kind) {
    let s = `<g class="hda-bg"><rect width="200" height="176" fill="${x.url("wall")}" opacity=".6"/><rect x="0" y="168" width="200" height="8" fill="#e9e6df" opacity=".5"/>`;
    if (kind === "carpet") { s += `<rect x="0" y="176" width="200" height="24" fill="${x.url("carpet")}"/>`; for (let i = 0; i < 40; i++) s += `<path d="M${(i * 37) % 200} ${178 + (i * 7) % 20} v2" stroke="#fff" stroke-opacity=".12"/>`; }
    else { s += `<rect x="0" y="176" width="200" height="24" fill="${x.url("wood")}"/>`; for (let i = 0; i < 6; i++) s += `<path d="M${f(100 + (i - 2.5) * 30)} 176 L${f(100 + (i - 2.5) * 40)} 200" stroke="#3a2412" stroke-opacity=".35"/>`; }
    return s + "</g>";
  }
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 4}" fill="${x.url("sh")}"/>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  function roll(x, X, Y, W, Hh, col) {
    let s = ""; for (let i = -2; i < W / 5 + 2; i++) s += `<path d="M${f(X + i * 5)} ${Y + Hh} L${f(X + i * 5 + 5)} ${Y}" stroke="${col || "#e2645c"}" stroke-width="1.6"/>`;
    const cid = x.id("rc" + X + Y);
    return `<clipPath id="${cid}"><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${Hh / 2}"/></clipPath><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="${Hh / 2}" fill="#2a2c31"/>
<g clip-path="url(#${cid})"><g class="${x.on ? P + "roll" : ""}" style="animation-duration:${(1.1 - .6 * x.lv).toFixed(2)}s">${s}</g></g><rect x="${X}" y="${Y}" width="${W}" height="${Hh * .4}" rx="${Hh / 4}" fill="#fff" opacity=".12"/>`;
  }
  function bin(x, X, Y, W, Hh) {
    const cx = X + W / 2, cy = Y + Hh * .45;
    return `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="3" fill="#20242c" opacity=".55"/><rect x="${X}" y="${f(Y + Hh * .72)}" width="${W}" height="${f(Hh * .28)}" rx="2" fill="${x.url("dirt")}"/>
${x.on ? `<g class="${P}swirl" style="animation-duration:${(1.6 - x.lv).toFixed(2)}s"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(W * .36)}" ry="${f(Hh * .3)}" fill="none" stroke="#e6d6b0" stroke-opacity=".7" stroke-width="1" stroke-dasharray="4 3"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(W * .2)}" ry="${f(Hh * .16)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".8" stroke-dasharray="3 3"/></g>` : ""}
<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="3" fill="${x.url("clr")}" stroke="#fff" stroke-opacity=".45" stroke-width=".7"/>${hl(`M${X + 2} ${Y + 3} V${Y + Hh - 3}`, .5, 1.2)}`;
  }
  const SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function digits(str, X, Y, h, col) {
    const w = h * .55, t = Math.max(.6, h * .15); let s = "", xx = X;
    for (const ch of str) { const g = SEG[ch] || "";
      const sg = { a: [xx + t, Y, w - 2 * t, t], d: [xx + t, Y + h - t, w - 2 * t, t], g: [xx + t, Y + h / 2 - t / 2, w - 2 * t, t], f: [xx, Y + t * .6, t, h / 2 - t], b: [xx + w - t, Y + t * .6, t, h / 2 - t], e: [xx, Y + h / 2 + t * .4, t, h / 2 - t], c: [xx + w - t, Y + h / 2 + t * .4, t, h / 2 - t] };
      for (const k of g) { const [a, b, c, d] = sg[k]; s += `<rect x="${f(a)}" y="${f(b)}" width="${f(c)}" height="${f(d)}" fill="${col}"/>`; } xx += w + t * 1.4; }
    return s;
  }
  function lcd(x, X, Y, W, Hh, round) {
    const sh = round ? `<circle cx="${X + W / 2}" cy="${Y + Hh / 2}" r="${W / 2}" fill="#07080b"/><circle cx="${X + W / 2}" cy="${Y + Hh / 2}" r="${W / 2}" fill="none" stroke="#9aa1a9" stroke-width=".8"/>` : `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="1.6" fill="#07080b"/><rect x="${X}" y="${Y}" width="${W}" height="${Hh}" rx="1.6" fill="none" stroke="#9aa1a9" stroke-width=".6"/>`;
    if (!x.on) return sh;
    const pct = String(Math.round(92 - x.lv * 30));
    const bars = [0, 1, 2].map((i) => `<rect x="${f(X + W * .2 + i * W * .22)}" y="${f(Y + Hh * .72)}" width="${f(W * .16)}" height="${f(Hh * .1)}" fill="${i < x.mode ? (x.mode === 3 ? "#ff8a3a" : "#5be08a") : "#2c3038"}"/>`).join("");
    return sh + digits(pct, X + W * .22, Y + Hh * .2, Hh * .42, "#bfe4ff") + bars;
  }
  const lightCone = (x, X, Y, len, dir) => x.on ? `<path d="M${X} ${Y - 3} L${X + dir * len} ${Y - 10} L${X + dir * len} ${Y + 6} L${X} ${Y + 3} Z" fill="${x.url("cone")}" transform="${dir < 0 ? `scale(-1 1) translate(${-2 * X} 0)` : ""}" opacity="${(.5 + .5 * x.lv).toFixed(2)}"/>` : "";
  const laser = (x, X, Y, len) => x.on ? `<path d="M${X} ${Y} L${X - len} ${Y - 4} L${X - len} ${Y + 6} Z" fill="${x.url("las")}"/>${[[18, 1], [30, 3], [44, -1], [52, 4], [26, -2]].map(([d, o]) => `<circle cx="${X - d}" cy="${Y + o}" r=".9" fill="#c8ffd2"/>`).join("")}` : "";
  const drops = (x, X, Y, W) => x.on ? [0, 1, 2, 3, 4].map((i) => `<path class="${P}drop" style="animation-delay:-${(i * .22).toFixed(2)}s" d="M${f(X + i * W / 4)} ${Y} v4" stroke="#bfe4ff" stroke-width="1.4" stroke-linecap="round"/>`).join("") : "";
  const led = (x, cx, cy, col) => `<circle cx="${cx}" cy="${cy}" r="${x.on ? 1.6 : 1.2}" fill="${x.on ? col : "#2c3038"}"/>${x.on ? `<circle cx="${cx}" cy="${cy}" r="4" fill="${col}" opacity=".3"/>` : ""}`;
  const mount = (x, X, Y) => `<rect x="${X - 10}" y="${Y - 6}" width="20" height="26" rx="3" fill="#d9d6e0"/><rect x="${X - 10}" y="${Y - 6}" width="20" height="26" rx="3" fill="none" stroke="#8a86a0"/><path d="M${X} ${Y + 20} V176" stroke="#16141c" stroke-width="1.6"/>`;

  function laserStick(x, o2) {
    o2 = o2 || {};
    const bodyG = o2.body || "nk";
    let head = "";
    if (o2.head === "laser" || o2.head === "fluffy") head = `<path d="M72 164 H128 C132 164 134 168 134 172 C134 176 132 178 128 178 H72 C68 178 66 176 66 172 C66 168 68 164 72 164 Z" fill="${x.url("ir")}"/>
${roll(x, 70, 166, 58, 10, "#d94f4f")}<rect x="94" y="156" width="12" height="10" rx="2" fill="${x.url("acv")}"/>${o2.head === "laser" ? `<rect x="64" y="168" width="5" height="5" rx="1.4" fill="#1a1b20"/>${led(x, 66, 170.5, "#4dff7a")}` : ""}`;
    else if (o2.head === "wet") head = `<rect x="66" y="162" width="68" height="16" rx="5" fill="${x.url("bk")}"/>${roll(x, 70, 166, 60, 10, "#9ac0d8")}<rect x="92" y="152" width="16" height="12" rx="3" fill="${x.url("acv")}"/>`;
    else head = `<path d="M70 160 H130 L134 176 H66 Z" fill="${x.url("ir")}"/><rect x="72" y="166" width="56" height="8" rx="2" fill="#2a2c31"/>${roll(x, 74, 167, 52, 6, "#d94f4f")}<rect x="94" y="152" width="12" height="10" rx="2" fill="${x.url("acv")}"/><path d="M78 162 H122" stroke="${x.c}" stroke-width="2"/>`;
    const lcdS = o2.lcd ? lcd(x, 118, 12, 16, 11) : "";
    return [head, `<rect x="97" y="${o2.wet ? 98 : 74}" width="6" height="${o2.wet ? 56 : 84}" rx="2" fill="${x.url("ac")}"/>${hl(`M98.5 ${o2.wet ? 100 : 76} V154`, .4, .8)}
${o2.wet ? `<rect x="88" y="58" width="24" height="40" rx="4" fill="${x.url("bk")}"/>${bin(x, 90, 60, 20, 16)}<rect x="90" y="78" width="20" height="18" rx="2" fill="${x.url("wat")}"/>${x.on ? `<rect x="90" y="78" width="20" height="18" rx="2" fill="#bfe4ff" opacity=".2"/>` : ""}` : ""}
${bin(x, 88, 36, 16, 38)}
<path d="M86 28 H106 V40 H86 Z" fill="${x.url(bodyG)}"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${89 + i * 3.6}" cy="34" r="1" fill="#1a1b20"/>`).join("")}
<rect x="104" y="22" width="28" height="15" rx="7" fill="${x.url(bodyG)}"/><rect x="128" y="22" width="7" height="15" rx="3" fill="${x.url("ac")}"/>
<path d="M114 37 L118 62 H128 L124 37 Z" fill="${x.url("ir")}"/><path d="M116 40 L119 46" stroke="${x.c}" stroke-width="3" stroke-linecap="round"/>
<rect x="104" y="58" width="24" height="16" rx="3" fill="${x.url("ir")}"/>${led(x, 108, 66, x.mode === 3 ? "#ff8a3a" : "#5be08a")}
${lcdS}${hl("M106 25 H128", .5, 1)}`];
  }
  function pose(x, parts, extra) {
    const [head, up] = parts;
    if (x.on) return `${shadow(x, 100, 178, 40)}<g transform="rotate(16 100 160)">${up}</g>${head}${extra || ""}`;
    return `${mount(x, 98, 30)}<g transform="translate(0 -8)">${up}${head}</g>${shadow(x, 100, 178, 30, 3)}`;
  }

  const base = (o) => Object.assign({ picker: true, colorLabel: "Color" }, o);

  const icons = [
    base({ id: "laser-stick-vacuum", name: "Laser stick vacuum", colorLabel: "Accents", colors: ["#e8b923", "#6b3fa0", "#2f5aa8", "#c9a24a", "#c87a3a"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "wood") + pose(x, laserStick(x, { head: "laser", lcd: true }), laser(x, 68, 179, 60)));
    } }),
    base({ id: "ball-upright-vacuum", name: "Ball upright vacuum", colors: ["#b8774f", "#7a4fd0", "#b8343a"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 100, 178, 46) + lightCone(x, 70, 172, 60, -1) + `
<path d="M62 162 H138 L142 178 H58 Z" fill="${x.url("ac")}"/>${roll(x, 66, 168, 68, 8, "#2a2c31")}
<circle cx="100" cy="150" r="22" fill="${x.url("ac")}"/><circle cx="100" cy="150" r="22" fill="none" stroke="#000" stroke-opacity=".25"/>${hl("M86 138 C90 132 96 130 102 130", .55, 2)}
<rect x="90" y="56" width="20" height="78" rx="4" fill="${x.url("nk")}"/>${bin(x, 76, 70, 16, 54)}<rect x="74" y="62" width="20" height="10" rx="2" fill="${x.url("nk")}"/>
<rect x="108" y="40" width="6" height="96" rx="2" fill="${x.url("nk")}"/><path d="M111 40 V20 C111 14 120 14 120 20 V30" fill="none" stroke="${x.url("ir")}" stroke-width="5" stroke-linecap="round"/>
<path d="M114 60 C128 70 130 110 116 130" fill="none" stroke="#3a3c44" stroke-width="3.4"/>${led(x, 100, 62, "#5be08a")}`);
    } }),

    base({ id: "cordless-handheld", name: "Cordless handheld", colors: ["#7a4fd0", "#e0b628", "#b8343a"], render(o) {
      const x = ctx(o);
      const hv = `<path d="M88 86 L44 101 C41 102 40 104 41 106.4 C42 108.6 44 109.4 46.6 108.6 L90 97 Z" fill="${x.url("ir")}"/><path d="M41.2 101.8 L46 100.4 L48.6 108 L43.8 109.2 Z" fill="#050608"/><path d="M86 88 L46 102" stroke="#fff" stroke-opacity=".3" stroke-width="1" stroke-linecap="round"/><path d="M64 95 L66 101 M72 92.6 L74 98.6" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>
${bin(x, 86, 70, 18, 30)}<path d="M84 64 H106 V74 H84 Z" fill="${x.url("nk")}"/><rect x="104" y="58" width="34" height="18" rx="9" fill="${x.url("nk")}"/><rect x="134" y="58" width="8" height="18" rx="3" fill="${x.url("ac")}"/>
<path d="M118 76 L124 104 H136 L130 76 Z" fill="${x.url("ac")}"/><rect x="108" y="98" width="30" height="16" rx="3" fill="${x.url("ir")}"/>${led(x, 113, 106, "#5be08a")}<rect x="82" y="82" width="12" height="16" rx="2" fill="${x.url("ac")}" transform="rotate(-18 88 90)"/>`;
      return svg(x, room(x, "wood") + (x.on ? `${shadow(x, 80, 178, 40)}<g transform="translate(10 52) rotate(18 80 100)">${hv}</g>` : `<rect x="100" y="110" width="44" height="12" rx="3" fill="#d9d6e0"/><path d="M122 122 V176" stroke="#16141c" stroke-width="1.6"/><g transform="translate(0 6)">${hv}</g>`));
    } }),

    base({ id: "stick-wet-cleaner", name: "Stick wet cleaner", colors: ["#3b4fd8", "#2a2c31", "#7a4fd0"], render(o) {
      const x = ctx(o);
      const body = `<rect x="64" y="156" width="72" height="22" rx="6" fill="${x.url("bk")}"/>${roll(x, 66, 166, 30, 11, "#d9dfe6")}${roll(x, 104, 166, 30, 11, "#d9dfe6")}
<rect x="84" y="80" width="32" height="78" rx="6" fill="${x.url("bk")}"/><rect x="88" y="84" width="24" height="30" rx="3" fill="${x.url("wat")}"/>${bin(x, 88, 118, 24, 34)}
<path d="M100 80 V40 C100 30 110 26 118 28" fill="none" stroke="${x.url("ac")}" stroke-width="7" stroke-linecap="round"/><path d="M114 22 L124 32" stroke="${x.url("bk")}" stroke-width="8" stroke-linecap="round"/>
${lcd(x, 92, 64, 16, 12)}${drops(x, 70, 174, 60)}`;
      return svg(x, room(x, "wood") + `<rect x="54" y="170" width="92" height="8" rx="3" fill="#1d1e24"/>` + shadow(x, 100, 178, 46) + body);
    } }),

    base({ id: "bagless-upright", name: "Bagless upright", colors: ["#4a4fa8", "#8a7fd0", "#2f8fb0"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 100, 178, 48) + lightCone(x, 62, 172, 56, -1) + `
<path d="M58 160 H142 C146 160 148 164 148 178 H52 C52 164 54 160 58 160 Z" fill="${x.url("ac")}"/>${roll(x, 62, 168, 76, 8, "#2a2c31")}<rect x="52" y="168" width="6" height="5" fill="#fff6dc" opacity="${x.on ? .9 : .3}"/>
<circle cx="140" cy="172" r="7" fill="#2a2c31"/>
<rect x="84" y="60" width="32" height="100" rx="8" fill="#c9cdd6"/>${bin(x, 88, 66, 24, 50)}<rect x="86" y="118" width="28" height="36" rx="6" fill="${x.url("ac")}"/>
<rect x="97" y="18" width="6" height="44" rx="2" fill="${x.url("nk")}"/><path d="M95 20 H105 V14 C105 10 95 10 95 14 Z" fill="${x.url("ac")}"/>
<path d="M116 70 C130 80 132 130 118 150" fill="none" stroke="#3a3c44" stroke-width="3.4"/>${led(x, 100, 140, "#5be08a")}`);
    } }),

    base({ id: "lift-away-upright", name: "Lift-away upright", colors: ["#9a3a52", "#b07a5a", "#3a6fd0"], render(o) {
      const x = ctx(o);
      const inner = [`<path d="M66 162 H134 L138 178 H62 Z" fill="${x.url("ir")}"/>${roll(x, 70, 166, 28, 10, "#3a3c44")}${roll(x, 102, 166, 30, 10, "#d9dfe6")}<rect x="62" y="170" width="6" height="4" fill="${x.c}"/>`, `
<rect x="94" y="150" width="12" height="14" rx="3" fill="${x.url("ac")}"/><rect x="97" y="64" width="6" height="88" rx="2" fill="${x.url("ac")}"/>
<rect x="88" y="30" width="24" height="36" rx="6" fill="${x.url("ir")}"/>${bin(x, 91, 34, 18, 26)}<rect x="96" y="12" width="8" height="20" rx="3" fill="${x.url("ir")}"/><path d="M100 12 C112 10 114 22 106 26" fill="none" stroke="${x.url("ir")}" stroke-width="4"/>
${lcd(x, 92, 62, 16, 8)}`];
      return svg(x, room(x, "wood") + pose(x, inner, lightCone(x, 64, 179, 50, -1)));
    } }),

    base({ id: "powered-lift-away", name: "Powered lift-away", colors: ["#5a6ab0", "#b07a4a", "#2f8fb0"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 100, 178, 50) + lightCone(x, 56, 172, 52, -1) + `
<path d="M56 158 H144 C148 158 150 162 150 178 H50 C50 162 52 158 56 158 Z" fill="${x.url("ir")}"/>${roll(x, 56, 166, 40, 10, "#3a3c44")}${roll(x, 100, 166, 44, 10, "#d9dfe6")}
<rect x="52" y="160" width="96" height="3" rx="1.5" fill="${x.on ? "#fff6dc" : "#5d646c"}"/>
<rect x="82" y="58" width="36" height="102" rx="8" fill="${x.url("nk")}"/>${bin(x, 86, 64, 28, 48)}<rect x="84" y="114" width="32" height="40" rx="6" fill="${x.url("ac")}"/>
<rect x="97" y="16" width="6" height="44" rx="2" fill="${x.url("ir")}"/><path d="M95 18 H105 V12 C105 8 95 8 95 12 Z" fill="${x.url("ir")}"/>${led(x, 100, 120, "#5be08a")}`);
    } }),

    base({ id: "wet-dry-stick", name: "Wet-dry stick", colors: ["#3a6fd0", "#2f9a8a", "#7a4fd0"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "wood") + `<rect x="58" y="170" width="84" height="8" rx="3" fill="#1d1e24"/>` + shadow(x, 100, 178, 44) + `
<rect x="66" y="156" width="68" height="20" rx="6" fill="${x.url("ir")}"/>${roll(x, 70, 164, 60, 11, "#9ac0d8")}
<rect x="84" y="72" width="32" height="86" rx="7" fill="${x.url("ir")}"/><rect x="88" y="76" width="24" height="30" rx="3" fill="${x.url("wat")}"/>${bin(x, 88, 112, 24, 36)}<rect x="84" y="104" width="32" height="6" fill="${x.url("ac")}"/>
<rect x="97" y="24" width="6" height="50" rx="2" fill="${x.url("ir")}"/><path d="M95 26 H105 V18 C105 14 95 14 95 18 Z" fill="${x.url("ac")}"/>${lcd(x, 93, 58, 14, 10)}${drops(x, 70, 174, 60)}`);
    } }),

    base({ id: "smart-floor-washer", name: "Smart floor washer", colors: ["#6a7280", "#3a6fd0", "#b0b4bc"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "wood") + `<rect x="56" y="168" width="88" height="10" rx="3" fill="#1d1e24"/>` + shadow(x, 100, 178, 44) + `
<rect x="64" y="156" width="72" height="20" rx="6" fill="${x.url("bk")}"/>${roll(x, 68, 164, 64, 11, "#9ac0d8")}
<rect x="84" y="66" width="32" height="92" rx="8" fill="${x.url("ac")}"/><rect x="88" y="92" width="24" height="26" rx="3" fill="${x.url("wat")}"/>${bin(x, 88, 122, 24, 30)}
${lcd(x, 89, 66, 22, 22, true)}${x.on ? `<circle cx="100" cy="77" r="11" fill="none" stroke="${x.mode === 3 ? "#ff5a5a" : "#4da6ff"}" stroke-width="1.6"/>` : ""}
<rect x="97" y="20" width="6" height="46" rx="2" fill="${x.url("bk")}"/><path d="M95 22 H105 V14 C105 10 95 10 95 14 Z" fill="${x.url("bk")}"/>${drops(x, 70, 174, 60)}`);
    } }),

    base({ id: "multi-surface-washer", name: "Multi-surface washer", colors: ["#2fb3b3", "#3a6fd0", "#e07a3a"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "wood") + `<rect x="58" y="170" width="84" height="8" rx="3" fill="#1d1e24"/>` + shadow(x, 100, 178, 44) + `
<path d="M64 158 H136 L138 176 H62 Z" fill="${x.url("bk")}"/>${roll(x, 68, 164, 64, 11, "#d9dfe6")}<path d="M66 160 H134" stroke="${x.c}" stroke-width="2"/>
<rect x="86" y="96" width="28" height="62" rx="6" fill="${x.url("bk")}"/>${bin(x, 89, 120, 22, 32)}
<rect x="97" y="34" width="6" height="64" rx="2" fill="${x.url("bk")}"/><rect x="88" y="56" width="24" height="38" rx="5" fill="${x.url("wat")}"/><rect x="88" y="56" width="24" height="8" rx="3" fill="${x.url("ac")}"/>
<path d="M95 36 H105 V26 C105 22 95 22 95 26 Z" fill="${x.url("ac")}"/>${led(x, 100, 104, x.mode === 3 ? "#ff8a3a" : "#5be08a")}${drops(x, 70, 174, 60)}`);
    } }),

    base({ id: "upright-carpet-cleaner", name: "Upright carpet cleaner", colors: ["#9bd13a", "#7a4fd0", "#2fb3b3"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 100, 178, 50) + `
<path d="M56 156 H144 C148 156 150 160 150 178 H50 C50 160 52 156 56 156 Z" fill="${x.url("ir")}"/>${roll(x, 58, 168, 84, 8, "#5a6ab0")}
<rect x="80" y="62" width="40" height="96" rx="8" fill="${x.url("ir")}"/>
<rect x="84" y="66" width="32" height="38" rx="5" fill="${x.url("wat")}"/>${x.on ? `<rect x="84" y="66" width="32" height="38" rx="5" fill="#bfe4ff" opacity=".18"/>` : ""}<rect x="84" y="62" width="32" height="7" rx="3" fill="${x.url("ac")}"/>
<rect x="84" y="110" width="32" height="40" rx="5" fill="#20242c" opacity=".6"/><rect x="84" y="${x.on ? 128 : 138}" width="32" height="${x.on ? 22 : 12}" rx="3" fill="${x.url("dirt")}"/><rect x="84" y="110" width="32" height="40" rx="5" fill="${x.url("clr")}" stroke="#fff" stroke-opacity=".4"/>
<rect x="80" y="104" width="40" height="6" fill="${x.url("ac")}"/><rect x="97" y="14" width="6" height="50" rx="2" fill="${x.url("ir")}"/><path d="M93 16 H107 V10 C107 6 93 6 93 10 Z" fill="${x.url("ac")}"/>
${drops(x, 60, 176, 80)}${led(x, 100, 158, "#5be08a")}`);
    } }),

    base({ id: "spot-carpet-cleaner", name: "Spot carpet cleaner", colors: ["#8ccf3a", "#2fb3b3", "#7a4fd0"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 94, 178, 44) + `
<path d="M58 176 C54 150 60 108 90 104 H120 C138 106 142 140 138 176 Z" fill="${x.url("ac")}"/><path d="M70 104 C70 92 120 92 124 104" fill="none" stroke="${x.url("acv")}" stroke-width="8" stroke-linecap="round"/>
<rect x="66" y="118" width="40" height="50" rx="8" fill="${x.url("wat")}"/>${x.on ? `<rect x="66" y="${f(150 - 10 * x.lv)}" width="40" height="${f(18 + 10 * x.lv)}" rx="6" fill="${x.url("dirt")}" opacity=".5"/>` : ""}<rect x="66" y="118" width="40" height="50" rx="8" fill="${x.url("clr")}" stroke="#fff" stroke-opacity=".4"/>
<path d="M138 140 C160 140 168 158 162 178" fill="none" stroke="#2a2c31" stroke-width="5" stroke-linecap="round"/>
<path d="M150 176 L176 170 L180 178 Z" fill="${x.url("ac")}"/>${drops(x, 156, 178, 18)}${led(x, 120, 116, "#5be08a")}`);
    } }),

    base({ id: "rental-carpet-cleaner", name: "Rental carpet cleaner", colors: ["#d7262a", "#2a5aa8", "#2a2c31"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 100, 178, 50) + `
<rect x="62" y="96" width="76" height="80" rx="8" fill="${x.url("ac")}"/><rect x="62" y="166" width="76" height="10" rx="3" fill="#2a2c31"/><circle cx="130" cy="172" r="8" fill="#1a1b20"/>
<rect x="68" y="110" width="44" height="50" rx="6" fill="#c9cdd6"/><rect x="72" y="114" width="36" height="42" rx="4" fill="${x.url("wat")}"/>${x.on ? `<rect x="72" y="140" width="36" height="16" rx="3" fill="${x.url("dirt")}" opacity=".5"/>` : ""}
<path d="M70 96 V22 H130 V96" fill="none" stroke="${x.url("nk")}" stroke-width="5" stroke-linejoin="round"/><rect x="64" y="16" width="72" height="10" rx="5" fill="#2a2c31"/>
<rect x="114" y="104" width="18" height="8" rx="2" fill="#2a2c31"/>${led(x, 123, 108, x.on ? "#5be08a" : "#5be08a")}${drops(x, 66, 178, 68)}`);
    } }),

    base({ id: "classic-upright-vacuum", name: "Classic upright vacuum", colors: ["#c0303a", "#3a6fd0", "#7a4fd0"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 100, 178, 50) + lightCone(x, 52, 170, 52, -1) + `
<path d="M54 156 H146 C150 156 152 162 152 178 H48 C48 162 50 156 54 156 Z" fill="${x.url("bk")}"/>${roll(x, 58, 168, 84, 8, "#c0303a")}
<rect x="50" y="162" width="10" height="5" rx="1.5" fill="${x.on ? "#fff6dc" : "#5d646c"}"/><path d="M56 158 H144" stroke="${x.c}" stroke-width="2.4"/>
<rect x="80" y="54" width="40" height="104" rx="7" fill="${x.url("bk")}"/>${bin(x, 84, 60, 32, 52)}<rect x="84" y="116" width="32" height="36" rx="5" fill="${x.url("ac")}"/>
<rect x="97" y="14" width="6" height="42" rx="2" fill="${x.url("bk")}"/><path d="M93 16 H107 V10 C107 6 93 6 93 10 Z" fill="${x.url("bk")}"/>
<path d="M120 70 C134 80 136 130 122 150" fill="none" stroke="#5d646c" stroke-width="3.4"/>${led(x, 100, 124, "#5be08a")}`);
    } }),

    base({ id: "bagged-canister", name: "Bagged canister", colors: ["#24345e", "#e3c21a", "#f0f0ec", "#7a1f2a"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "wood") + shadow(x, 136, 178, 40) + shadow(x, 54, 178, 26, 3) + `
<path d="M100 130 C80 130 72 116 76 96 L94 30" fill="none" stroke="#3a3c44" stroke-width="5"/><path d="M94 30 L104 20 L110 26" fill="none" stroke="#5d646c" stroke-width="5" stroke-linecap="round"/>
<path d="M94 30 L56 166" stroke="${x.url("nk")}" stroke-width="5"/><path d="M30 166 H82 L84 178 H28 Z" fill="${x.url("bk")}"/>${roll(x, 32, 170, 50, 6, "#5d646c")}${x.on ? `<rect x="28" y="170" width="4" height="4" fill="#fff6dc"/>` : ""}
<path d="M104 176 C100 150 106 128 130 124 H158 C172 126 176 150 172 176 Z" fill="${x.url("ac")}"/><path d="M110 132 C130 124 158 126 168 132" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>
<path d="M118 124 C118 110 160 110 162 124" fill="none" stroke="${x.url("acv")}" stroke-width="6" stroke-linecap="round"/>
<circle cx="112" cy="174" r="5" fill="#1a1b20"/><circle cx="166" cy="174" r="5" fill="#1a1b20"/><ellipse cx="160" cy="150" rx="9" ry="9" fill="#2a2c31"/>
<path d="M156 150 h8" stroke="${x.on ? (x.mode === 3 ? "#ff8a3a" : "#5be08a") : "#4a4d55"}" stroke-width="2"/><path d="M160 150 L${f(160 + Math.cos(Math.PI * (1 - x.lv)) * 6)} ${f(150 - Math.sin(Math.PI * (1 - x.lv)) * 6)}" stroke="#d9dce2" stroke-width="1.6"/>`);
    } }),

    base({ id: "bagless-canister", name: "Bagless canister", colors: ["#7f9ec0", "#9ab8a4", "#8a8f98", "#b8343a"], render(o) {
      const x = ctx(o);
      return svg(x, room(x, "carpet") + shadow(x, 136, 178, 42) + shadow(x, 54, 178, 26, 3) + `
<path d="M108 128 C88 126 80 110 84 92 L96 34" fill="none" stroke="#3a3c44" stroke-width="5"/><path d="M96 34 L90 20" stroke="#5d646c" stroke-width="5" stroke-linecap="round"/>
<path d="M96 34 L58 164" stroke="${x.url("nk")}" stroke-width="5"/><path d="M28 162 H86 C88 162 90 166 90 178 H26 C26 166 26 162 28 162 Z" fill="${x.url("ac")}"/>${roll(x, 32, 168, 52, 7, "#2a2c31")}${x.on ? `<rect x="26" y="168" width="5" height="4" fill="#fff6dc"/>` : ""}
<path d="M104 176 V142 C104 128 112 120 126 120 H156 C168 120 176 128 176 142 V176 Z" fill="${x.url("ac")}"/><rect x="112" y="126" width="44" height="22" rx="5" fill="#2a2c31" opacity=".25"/>
<path d="M120 120 C120 108 160 108 162 120" fill="none" stroke="#5d646c" stroke-width="6" stroke-linecap="round"/><circle cx="112" cy="174" r="5" fill="#1a1b20"/><circle cx="168" cy="174" r="5" fill="#1a1b20"/>
${[0, 1, 2].map((i) => `<rect x="${132 + i * 7}" y="158" width="5" height="3" rx="1" fill="${x.on && i < x.mode ? "#5be08a" : "#2c3038"}"/>`).join("")}`);
    } }),

    base({ id: "mini-handheld", name: "Mini handheld", colors: ["#e06a2a", "#2f3a44", "#9bd13a"], render(o) {
      const x = ctx(o);
      const hv = `<path d="M50 96 C50 88 60 84 76 84 H130 C140 84 146 92 146 100 V108 C146 116 140 120 132 120 H76 C60 120 50 112 50 104 Z" fill="${x.url("bkv")}"/>
${bin(x, 54, 88, 40, 28)}<path d="M52 93 L18 99.5 C15.5 100 14 101.6 14 103.5 C14 105.4 15.5 107 18 107.5 L52 113 Z" fill="${x.url("bkv")}"/><path d="M14.6 101 L19 99.6 L19 107.4 L14.6 106 Z" fill="#050608"/><path d="M15.2 101.8 V105.2" stroke="#3a3c44" stroke-width=".6"/><path d="M50 95 L20 100.6" stroke="#fff" stroke-opacity=".28" stroke-width="1" stroke-linecap="round"/><rect x="46" y="91" width="7" height="24" rx="2" fill="${x.url("ac")}"/><path d="M47.5 93 V113" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><path d="M110 84 C116 70 140 70 142 86" fill="none" stroke="${x.url("bk")}" stroke-width="7" stroke-linecap="round"/>
<rect x="104" y="96" width="34" height="8" rx="4" fill="${x.url("ac")}"/>${led(x, 132, 112, x.on ? "#5be08a" : "#ff8a3a")}`;
      return svg(x, room(x, "wood") + (x.on ? `${shadow(x, 96, 178, 50)}<g transform="translate(0 46) rotate(8 96 100)">${hv}</g>` : `<rect x="66" y="118" width="70" height="14" rx="4" fill="#2a2c31"/><path d="M100 132 V176" stroke="#16141c" stroke-width="1.6"/>${hv}`));
    } }),

    base({ id: "shop-vac-5-gal", name: "Shop vac 5 gal", colors: ["#c8202a", "#c3c8ce", "#e3b51a"], render(o) {
      const x = ctx(o);
      return svg(x, `<g class="hda-bg"><rect width="200" height="176" fill="#5a566a" opacity=".55"/><rect x="0" y="176" width="200" height="24" fill="#6a6878"/></g>` + shadow(x, 92, 178, 46) + `
<path d="M54 92 H130 L124 170 H60 Z" fill="${x.url("ac")}"/><path d="M60 100 V160 M70 100 V164" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>
<path d="M50 76 C50 66 134 66 134 76 V94 H50 Z" fill="${x.url("bk")}"/><rect x="70" y="60" width="44" height="10" rx="5" fill="${x.url("bk")}"/>
<rect x="128" y="80" width="10" height="10" rx="2" fill="${x.url("bk")}"/><rect x="58" y="84" width="10" height="6" rx="1.5" fill="${x.on ? "#ff5a3a" : "#5d646c"}"/>
<circle cx="64" cy="172" r="5" fill="#1a1b20"/><circle cx="120" cy="172" r="5" fill="#1a1b20"/>
<path d="M134 86 C170 86 176 120 168 150 C164 166 150 172 150 176" fill="none" stroke="#2a2c31" stroke-width="6" stroke-linecap="round"/>
${x.on ? `<g class="${P}swirl" style="animation-duration:.8s"><ellipse cx="92" cy="76" rx="14" ry="3" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="4 3"/></g>` : ""}`);
    } }),
  ];

  const css = `.${P}roll{transform-box:fill-box}
.hda-anim .${P}roll{animation:${P}roll 1s linear infinite}
.${P}swirl{transform-box:fill-box;transform-origin:center}
.hda-anim .${P}swirl{animation:${P}swirl 1s linear infinite}
.hda-anim .${P}drop{animation:${P}drop .9s linear infinite}
@keyframes ${P}roll{from{transform:translate(0,0)}to{transform:translate(-5px,0)}}
@keyframes ${P}swirl{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes ${P}drop{0%{transform:translate(0,-6px);opacity:0}30%{opacity:1}100%{transform:translate(0,2px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .${P}roll,.hda-anim .${P}swirl,.hda-anim .${P}drop{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "floorcare", tab: "Vacuums & carpet cleaners", group: "Cleaning", kind: "device",
    levelLabel: "Power", onWord: "Cleaning", offWord: "Docked",
    intro: "Twenty vacuums and carpet cleaners: stick vacuums with laser heads, uprights, lift-aways, wet-dry floor washers, carpet cleaners, a rental-style deep cleaner, canisters, a handheld and a shop vac. Cleaning spins the brush roll, swirls the bin, lights the head and shows the battery; the slider sets power.",
    
    css, icons,
  });
})();
