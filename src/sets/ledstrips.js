(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);

  function ctx(o) {
    const c = o.color || "#ffc477", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  function hue(hex, deg, dl) {
    let [r, g, b] = H.hx(hex).map((v) => v / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    if (s < .35) { s = .85; l = Math.min(l, .62); }
    h = ((h + deg) % 360 + 360) % 360; l = Math.max(0, Math.min(1, l + (dl || 0)));
    const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const t = (u) => { u = (u + 1) % 1; return u < 1 / 6 ? p + (q - p) * 6 * u : u < .5 ? q : u < 2 / 3 ? p + (q - p) * (2 / 3 - u) * 6 : p; };
    const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
    return "#" + to(t(h / 360 + 1 / 3)) + to(t(h / 360)) + to(t(h / 360 - 1 / 3));
  }
  const st = (stops) => stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, stops, v, x2, y2) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2 != null ? x2 : v ? 0 : 1}" y2="${y2 != null ? y2 : v ? 1 : 0}">${st(stops)}</linearGradient>`;
  const rg = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${st(stops)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .85], [.4, c, .3], [1, c, 0]])}
${lg(id("cone"), [[0, c, .7], [.5, c, .2], [1, c, 0]], 1)}
${lg(id("coneU"), [[0, c, 0], [.5, c, .2], [1, c, .7]], 1)}
${lg(id("coneR"), [[0, c, .7], [.5, c, .2], [1, c, 0]])}
${lg(id("coneL"), [[0, c, 0], [.5, c, .2], [1, c, .7]])}
${rg(id("pool"), [[0, c, .6], [1, c, 0]])}
${rg(id("fill"), [[0, "#ffffff", .97], [.42, hot, 1], [1, c, .85]], .5, .45, .62)}
${lg(id("blk"), [[0, "#111117"], [.28, "#3b3c49"], [.42, "#555769"], [.72, "#22232c"], [1, "#0c0c11"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("alu"), [[0, "#6d7180"], [.3, "#d9dce6"], [.5, "#a7abba"], [.75, "#e6e8ef"], [1, "#5d606e"]], 1)}
${lg(id("wht"), [[0, "#9c98b0"], [.3, "#f2f0fa"], [.45, "#ffffff"], [.75, "#d4d0e2"], [1, "#8a86a0"]])}
${lg(id("wood"), [[0, "#9a6a3c"], [.5, "#74482a"], [1, "#4a2c16"]], 1)}
${lg(id("woodT"), [[0, "#b48152"], [1, "#7c5130"]], 1)}
${lg(id("ceil"), [[0, "#4a4562"], [1, "#363149"]], 1)}
${lg(id("cab"), [[0, "#e9e6f1"], [1, "#a9a5bd"]], 1)}
${lg(id("navy"), [[0, "#3c4a6e"], [1, "#222b44"]], 1)}
${rg(id("cs"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("softg"), [[0, "#fff"], [.5, "#fff"], [1, "#000"]])}
<clipPath id="${id("all")}"><rect width="200" height="200"/></clipPath>
<mask id="${id("soft")}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200"><rect width="200" height="200" fill="url(#${id("softg")})"/></mask>
${extra || ""}</defs>`;
  }
  const out = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const clip = (x, inner) => `<g clip-path="${x.url("all")}">${inner}</g>`;
  const soft = (x, inner) => `<g class="hda-bg"><g mask="${x.url("soft")}">${inner}</g></g>`;
  const wall = (x, col, a) => soft(x, `<rect width="200" height="200" fill="${col || "#4b4566"}" opacity="${((a || .5) * .7).toFixed(2)}"/>`);
  const halo = (x, cx, cy, r, k) => x.on ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("halo")}" opacity="${x.op(k || .6)}"/>` : "";
  const ell = (x, cx, cy, rx, ry, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("halo")}" opacity="${x.op(k || .5)}"/>` : "";
  const pool = (x, cx, cy, rx, ry, k) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("pool")}" opacity="${x.op(k || .8)}"/>` : "";
  const washR = (x, X, Y, W, Hh, g, k) => x.on ? `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.url(g)}" opacity="${x.op(k || .7)}"/>` : "";
  const washP = (x, d, g, k) => x.on ? `<path d="${d}" fill="${x.url(g)}" opacity="${x.op(k || .7)}"/>` : "";
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const cshadow = (x, cx, cy, rx, ry, a) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("cs")}" opacity="${a || .8}"/>`;
  function strip(x, d, w, breathe) {
    w = w || 2.4;
    if (!x.on) return `<path d="${d}" fill="none" stroke="#14121a" stroke-width="${f(w + 1.4)}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".6"/><path d="${d}" fill="none" stroke="#cfcbdb" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".75"/>`;
    return `<g${breathe ? ' class="hda-ledstrips-breathe"' : ""}><path d="${d}" fill="none" stroke="${x.c}" stroke-width="${f(w * 5)}" stroke-opacity="${x.op(.18)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${x.c}" stroke-width="${f(w * 2.2)}" stroke-opacity="${x.op(.5)}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${x.hot}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="${(.55 + .45 * x.L).toFixed(2)}"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${f(w * .4)}" stroke-linecap="round" stroke-opacity="${x.op(.9)}"/></g>`;
  }
  function chase(x, d, w) {
    w = w || 3;
    if (!x.on) return strip(x, d, w);
    let s = `<path d="${d}" fill="none" stroke="${x.c}" stroke-width="${f(w * 5)}" stroke-opacity="${x.op(.16)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (let k = 0; k < 6; k++) { const col = hue(x.c, k * 60);
      s += `<path class="hda-ledstrips-chase" d="${d}" fill="none" stroke="${col}" stroke-width="${f(w * 2.4)}" stroke-opacity="${x.op(.45)}" stroke-dasharray="10 50" stroke-dashoffset="${-k * 10}" style="animation-delay:-${k}s"/>
<path class="hda-ledstrips-chase" d="${d}" fill="none" stroke="${H.mix(col, "#fff", .45)}" stroke-width="${w}" stroke-opacity="${(.55 + .45 * x.L).toFixed(2)}" stroke-dasharray="10 50" stroke-dashoffset="${-k * 10}" style="animation-delay:-${k}s"/>`; }
    return s;
  }

  const WARM = "#ffc477", SOFT = "#ffe2b8", DAY = "#eef4ff";
  const W1 = [WARM, DAY, SOFT, "#8f6bff", "#3fe0b5"];
  const W2 = [SOFT, WARM, DAY, "#ff6fa8", "#5fa8ff"];
  const RGB = ["#8f6bff", WARM, DAY, "#ff4fa0", "#38c8ff", "#3fe08f"];
  const RGB2 = ["#ff5f8f", WARM, DAY, "#6e8bff", "#3fe0b5", "#ffb02e"];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "down" }, o);

  const icons = [
    base({ id: "toekick", name: "Kitchen toe-kick", colors: W1, glow: { x: .5, y: .86, r: 1.1 }, render(o) {
      const x = ctx(o), stn = lg(x.id("stn"), [[0, "#d7d3e0"], [.5, "#a9a5ba"], [1, "#c4c0d0"]]);
      let fl = ""; for (let i = 0; i < 9; i++) fl += `<path d="M${f(100 + (i - 4) * 14)} 168 L${f(100 + (i - 4) * 34)} 198" stroke="#2a1b10" stroke-opacity=".45"/>`;
      return out(x, `${wall(x)}<g class="hda-bg">${clip(x, `<rect x="0" y="168" width="200" height="32" fill="${x.url("woodT")}"/>${fl}`)}</g>
${washR(x, 0, 168, 200, 30, "cone", .9)}${pool(x, 100, 172, 100, 10, .7)}
<rect x="8" y="64" width="184" height="8" rx="1.5" fill="url(#${x.id("stn")})"/>${hl("M10 65 H190", .6, 1)}
<rect x="12" y="72" width="176" height="86" fill="${x.url("navy")}"/>
${[14, 72, 130].map((xx) => `<rect x="${xx + 2}" y="76" width="54" height="78" rx="2" fill="${x.url("navy")}" stroke="#141a2c" stroke-width="1.2"/><rect x="${xx + 8}" y="82" width="42" height="66" rx="1.5" fill="none" stroke="#5d6c94" stroke-opacity=".5"/><rect x="${xx + 24}" y="86" width="10" height="2.6" rx="1.3" fill="${x.url("chr")}"/>`).join("")}
<rect x="18" y="158" width="164" height="10" fill="#14121a"/>${strip(x, "M22 160.5 H178", 2)}
${x.on ? `<rect x="18" y="161" width="164" height="7" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}`, stn);
    } }),

    base({ id: "abovecab", name: "Above-cabinet cove", colors: W2, cast: "up", glow: { x: .5, y: .16, r: 1.15 }, render(o) {
      const x = ctx(o);
      return out(x, `${wall(x)}<g class="hda-bg"><path d="M0 0 H200 V20 H0 Z" fill="${x.url("ceil")}"/></g>
${washR(x, 0, 0, 200, 22, "coneU", .45)}${washR(x, 0, 20, 200, 30, "coneU", .9)}${ell(x, 100, 14, 100, 16, .5)}
<rect x="10" y="44" width="180" height="6" fill="#d9d4e2"/><path d="M8 44 H192 L190 40 H10 Z" fill="#f2f0fa"/>
${strip(x, "M16 43 H184", 1.6)}
<rect x="12" y="50" width="176" height="84" fill="url(#${x.id("cab")})"/>
${[14, 72, 130].map((xx) => `<rect x="${xx + 2}" y="54" width="54" height="76" rx="2" fill="url(#${x.id("cab")})" stroke="#8a86a0" stroke-width="1"/><rect x="${xx + 9}" y="61" width="40" height="62" rx="1" fill="#2d3346" opacity=".8"/>
<rect x="${xx + 9}" y="90" width="40" height="2" fill="#cfd4e2"/><rect x="${xx + 14}" y="74" width="8" height="16" rx="1" fill="#e2c49a"/><rect x="${xx + 26}" y="78" width="10" height="12" rx="5" fill="#9ac0d0"/><rect x="${xx + 16}" y="104" width="22" height="19" rx="2" fill="#f0eef6" opacity=".8"/>
<path d="M${xx + 10} 62 L${xx + 22} 62 L${xx + 10} 84 Z" fill="#fff" opacity=".08"/><rect x="${xx + 50}" y="112" width="2.4" height="12" rx="1" fill="${x.url("chr")}"/>`).join("")}
<rect x="8" y="134" width="184" height="4" fill="#8a86a0"/>
<g class="hda-bg"><rect x="8" y="176" width="184" height="8" rx="1.5" fill="#b9b5c8"/><rect x="12" y="184" width="176" height="16" fill="${x.url("navy")}"/></g>`);
    } }),

    base({ id: "tray", name: "Tray ceiling", colors: W1, cast: "up", glow: { x: .5, y: .38, r: 1.25 }, render(o) {
      const x = ctx(o), ex = `<clipPath id="${x.id("in")}"><rect x="40" y="36" width="120" height="76"/></clipPath>` + rg(x.id("rm"), [[0, "#4b4566"], [1, "#2c2742"]]);
      return out(x, `<g class="hda-bg"><rect x="4" y="8" width="192" height="150" rx="4" fill="${x.url("ceil")}"/></g>
<rect x="40" y="36" width="120" height="76" fill="url(#${x.id("rm")})"/>
${x.on ? `<g clip-path="url(#${x.id("in")})"><rect x="40" y="36" width="120" height="76" fill="none" stroke="${x.c}" stroke-width="40" stroke-opacity="${x.op(.45)}"/><rect x="40" y="36" width="120" height="76" fill="none" stroke="${x.c}" stroke-width="14" stroke-opacity="${x.op(.75)}"/><rect x="40" y="36" width="120" height="76" fill="none" stroke="${x.hot}" stroke-width="3" stroke-opacity="${x.op(.9)}"/></g>` : ""}
<path d="M30 26 H170 V122 H30 Z M40 36 V112 H160 V36 Z" fill="#d6d1e0" fill-rule="evenodd"/>
<path d="M30 26 H170 L160 36 H40 Z" fill="#fff" opacity=".35"/><path d="M30 122 H170 L160 112 H40 Z" fill="#000" opacity=".2"/><path d="M30 26 L40 36 V112 L30 122 Z" fill="#000" opacity=".08"/>
${x.on ? `<path d="M30 122 H170 L160 112 H40 Z" fill="${x.c}" opacity="${x.op(.3)}"/>` : ""}
<path d="M100 74 V120" stroke="#141219" stroke-width="1.4"/><ellipse cx="100" cy="74" rx="6" ry="2" fill="#d6d1e0"/>
<path d="M88 120 H112 L108 132 H92 Z" fill="${x.url("blk")}"/>
<g class="hda-bg"><rect x="4" y="150" width="192" height="10" fill="#d6d1e0" opacity=".6"/><rect x="8" y="160" width="184" height="36" fill="#4b4566" opacity=".35"/></g>
${pool(x, 100, 190, 90, 10, .4)}`, ex);
    } }),

    base({ id: "crown", name: "Crown uplight", colors: W2, cast: "up", glow: { x: .5, y: .16, r: 1.2 }, render(o) {
      const x = ctx(o);
      return out(x, `<g class="hda-bg"><rect x="0" y="0" width="200" height="34" fill="${x.url("ceil")}"/></g>${wall(x, "#5a5476", .6)}
${washR(x, 0, 0, 200, 36, "coneU", .95)}
<path d="M0 34 H200 V38 C190 38 186 42 186 46 H14 C14 42 10 38 0 38 Z" fill="#e9e6f1"/>
<path d="M0 38 C8 38 12 40 14 46 L14 52 H186 V46 C188 40 192 38 200 38" fill="none"/>
<path d="M0 36 H200 L200 44 C192 44 190 50 190 54 H10 C10 50 8 44 0 44 Z" fill="url(#${x.id("cr")})"/>
<path d="M0 54 H200 V58 H0 Z" fill="#cfcbdb"/><path d="M0 44 C8 44 10 50 10 54" stroke="#8a86a0" fill="none"/>${hl("M0 38 H200", .6, 1)}
${strip(x, "M4 35 H196", 1.6)}
<g class="hda-bg"><rect x="62" y="84" width="76" height="60" rx="1.5" fill="#d9d4e2"/><rect x="67" y="89" width="66" height="50" fill="#2f5d7c"/><path d="M67 128 C84 116 98 124 112 112 C122 104 128 110 133 106 V139 H67 Z" fill="#c9a24a" opacity=".75"/>
${x.on ? `<rect x="62" y="84" width="76" height="12" fill="${x.c}" opacity="${x.op(.12)}"/>` : ""}
<rect x="0" y="186" width="200" height="6" fill="#d6d1e0" opacity=".7"/></g>`,
        lg(x.id("cr"), [[0, "#fbfaff"], [.4, "#d4d0e2"], [.7, "#f0eef6"], [1, "#9c98b0"]], 1));
    } }),

    base({ id: "stairs", name: "Stair treads", colors: W1, glow: { x: .58, y: .55, r: 1.2 }, render(o) {
      const x = ctx(o); let s = "";
      for (let i = 0; i < 5; i++) {
        const y = 170 - i * 30, x0 = 14 + i * 30;
        s += `<rect x="${x0}" y="${y}" width="${192 - x0}" height="30" fill="#d9d4e2"/>${x.on ? `<rect x="${x0}" y="${y}" width="${192 - x0}" height="30" fill="${x.url("cone")}" opacity="${x.op(.95)}"/>` : `<rect x="${x0}" y="${y}" width="${192 - x0}" height="30" fill="#000" opacity=".3"/>`}
<path d="M${x0 - 4} ${y - 6} H196 V${y} H${x0 - 4} Z" fill="${x.url("woodT")}"/><path d="M${x0 - 4} ${y - 1.5} H196" stroke="#4a2c16" stroke-width="1.5"/>${hl(`M${x0 - 3} ${y - 5.4} H195`, .35, .8)}
${strip(x, `M${x0} ${y + 1.4} H192`, 1.6)}`;
      }
      return out(x, `${wall(x)}${s}<g class="hda-bg"><rect x="0" y="196" width="200" height="4" fill="#2a2638"/></g>${pool(x, 60, 196, 70, 6, .5)}`);
    } }),

    base({ id: "handrail", name: "Handrail strip", colors: W2, glow: { x: .5, y: .5, r: 1.15 }, render(o) {
      const x = ctx(o); let st = "";
      for (let i = 0; i < 7; i++) { const xx = 10 + i * 28, y = 186 - i * 18; st += `<path d="M${xx} ${y} H${xx + 28} V${y - 18}" fill="none" stroke="#2a2638" stroke-width="3"/><path d="M${xx} ${y} H${xx + 28} V200 H${xx} Z" fill="${x.url("woodT")}" opacity=".7"/>`; }
      return out(x, `${wall(x, "#5a5476", .6)}
${washP(x, "M14 128 L186 40 L186 120 L14 200 Z", "cone", .8)}
${st}
${[[44, 111], [100, 82], [156, 54]].map(([a, b]) => `<path d="M${a} ${b} v12 h-6" fill="none" stroke="${x.url("chr")}" stroke-width="2.6"/><circle cx="${a - 7}" cy="${b + 12}" r="3" fill="${x.url("chr")}"/>`).join("")}
<path d="M12 126 L188 36" stroke="#2a1b10" stroke-width="10" stroke-linecap="round"/><path d="M12 126 L188 36" stroke="${x.url("wood")}" stroke-width="8" stroke-linecap="round"/>${hl("M14 122 L186 33", .35, 1.2)}
${strip(x, "M16 131 L186 44", 1.8)}`);
    } }),

    base({ id: "underbed", name: "Under-bed glow", colors: W1, glow: { x: .5, y: .82, r: 1.15 }, render(o) {
      const x = ctx(o), duv = lg(x.id("duv"), [[0, "#c8d4ea"], [1, "#7d8db0"]], 1);
      return out(x, `${wall(x)}<g class="hda-bg"><rect x="0" y="168" width="200" height="32" fill="#3a3550"/></g>
${pool(x, 100, 172, 104, 18, .9)}${washR(x, 14, 166, 172, 30, "cone", .6)}
<rect x="10" y="60" width="18" height="94" rx="3" fill="${x.url("wood")}"/>
<rect x="14" y="134" width="176" height="20" rx="3" fill="${x.url("wood")}"/>${hl("M16 136 H188", .25, 1)}
<rect x="22" y="154" width="164" height="12" fill="#0e0c13"/>${strip(x, "M24 155.5 H184", 1.6)}
<rect x="30" y="112" width="160" height="24" rx="6" fill="#efedf5"/>
<path d="M32 96 C30 90 40 86 50 88 L80 92 C88 94 86 112 78 112 L36 112 Z" fill="#f6f4fb"/><path d="M40 108 C50 104 66 104 78 110" stroke="#b9b5c8" fill="none"/>
<path d="M76 108 C110 100 160 100 192 106 L194 140 C150 144 100 144 74 140 Z" fill="url(#${x.id("duv")})"/>${hl("M84 110 C120 104 160 104 188 108", .45, 1.4)}
<path d="M120 112 C122 124 120 134 118 140" stroke="#5d6c94" stroke-opacity=".5" fill="none"/>`, duv);
    } }),

    base({ id: "headboard", name: "Headboard glow", colors: W2, cast: "around", glow: { x: .5, y: .34, r: 1.25 }, render(o) {
      const x = ctx(o), uph = lg(x.id("uph"), [[0, "#7a7f96"], [1, "#4b4f66"]], 1);
      let tufts = ""; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) tufts += `<circle cx="${f(54 + c * 18.4 + (r % 2) * 9)}" cy="${f(46 + r * 18)}" r="1.4" fill="#2a2d3d"/>`;
      return out(x, `${wall(x, "#4b4566", .55)}
${x.on ? `<g class="hda-ledstrips-breathe"><rect x="30" y="22" width="140" height="96" rx="16" fill="${x.url("halo")}" opacity="${x.op(.5)}"/>${ell(x, 100, 70, 98, 64, .7)}</g>` : ""}
<rect x="38" y="30" width="124" height="84" rx="8" fill="url(#${x.id("uph")})"/>${tufts}${hl("M44 34 H156", .3, 1.4)}
${x.on ? `<rect x="38" y="30" width="124" height="84" rx="8" fill="none" stroke="${x.hot}" stroke-width="1.6" stroke-opacity="${x.op(.9)}"/>` : ""}
<rect x="16" y="104" width="22" height="48" rx="2" fill="${x.url("wood")}"/><rect x="162" y="104" width="22" height="48" rx="2" fill="${x.url("wood")}"/>
<rect x="44" y="100" width="112" height="22" rx="6" fill="#efedf5"/>
<path d="M50 90 C50 84 60 82 74 84 C84 86 86 98 80 102 L54 102 C50 100 50 96 50 90 Z" fill="#f6f4fb"/><path d="M120 90 C120 84 130 82 144 84 C154 86 156 98 150 102 L124 102 C120 100 120 96 120 90 Z" fill="#f6f4fb"/>
<path d="M40 112 H160 L170 172 H30 Z" fill="#b9c4dc"/><path d="M40 112 H160 L162 124 H38 Z" fill="#e3e8f3"/>${hl("M42 126 H158", .4, 1.2)}
<rect x="28" y="172" width="144" height="10" rx="2" fill="${x.url("wood")}"/>${cshadow(x, 100, 186, 80, 5)}`, uph);
    } }),

    base({ id: "deskedge", name: "Gaming desk edge", colors: RGB, glow: { x: .5, y: .66, r: 1.2 }, render(o) {
      const x = ctx(o);
      return out(x, `${wall(x)}<g class="hda-bg"><rect x="0" y="178" width="200" height="22" fill="#2a2638"/></g>
${washR(x, 12, 128, 176, 60, "cone", .55)}${pool(x, 100, 182, 96, 10, .6)}
<rect x="96" y="96" width="8" height="18" fill="#22232c"/><path d="M80 114 H120 L116 118 H84 Z" fill="${x.url("blk")}"/>
<path d="M40 40 Q100 32 160 40 V96 Q100 90 40 96 Z" fill="#07070b"/><path d="M43 43 Q100 36 157 43 V93 Q100 87 43 93 Z" fill="url(#${x.id("scr")})"/>
<path d="M43 43 Q70 40 92 39 L64 92 L43 93 Z" fill="#fff" opacity=".05"/>
<rect x="56" y="112" width="58" height="7" rx="1.5" fill="#1a1a22"/>${x.on ? `<rect x="58" y="113" width="54" height="1.2" fill="${hue(x.c, 120)}" opacity="${x.op(.8)}"/>` : ""}
<ellipse cx="134" cy="116" rx="7" ry="3.6" fill="#1a1a22"/>
<rect x="18" y="98" width="12" height="22" rx="2" fill="${x.url("blk")}"/><rect x="170" y="98" width="12" height="22" rx="2" fill="${x.url("blk")}"/>
<path d="M10 120 H190 V128 H10 Z" fill="#17161d"/><path d="M10 120 H190" stroke="#fff" stroke-opacity=".12"/>
${chase(x, "M12 129 H188", 2.6)}
<path d="M20 131 H34 L38 180 H24 Z M166 131 H180 L176 180 H162 Z" fill="${x.url("blk")}"/>`,
        lg(x.id("scr"), [[0, "#1d2232"], [.5, "#2a2148"], [1, "#171a26"]], 0, 1, 1));
    } }),

    base({ id: "mirror", name: "Backlit mirror", colors: W2, cast: "around", glow: { x: .5, y: .36, r: 1.15 }, render(o) {
      const x = ctx(o), mir = lg(x.id("mir"), [[0, "#4a5a76"], [.5, "#232b3e"], [1, "#1a2030"]], 0, .6, 1);
      let tile = ""; for (let y = 130; y < 200; y += 14) tile += `<path d="M0 ${y} H200" stroke="#000" stroke-opacity=".12"/>`;
      return out(x, `${wall(x, "#5a5476", .6)}
${x.on ? `<g class="hda-ledstrips-breathe"><circle cx="100" cy="68" r="68" fill="${x.url("halo")}" opacity="${x.op(.75)}"/><circle cx="100" cy="68" r="50" fill="none" stroke="${x.c}" stroke-width="8" stroke-opacity="${x.op(.5)}"/></g>` : ""}
<circle cx="100" cy="68" r="47" fill="#0d0f16"/><circle cx="100" cy="68" r="45" fill="url(#${x.id("mir")})"/>
<path d="M72 38 L86 30 L60 96 L56 88 Z M92 28 H98 L70 104 L66 101 Z" fill="#fff" opacity=".06"/>
${x.on ? `<circle cx="100" cy="68" r="47" fill="none" stroke="${x.hot}" stroke-width="1.2" stroke-opacity="${x.op(.9)}"/>` : `<circle cx="100" cy="68" r="47" fill="none" stroke="#6c6880" stroke-width="1"/>`}
<g class="hda-bg">${tile}<rect x="14" y="140" width="172" height="10" rx="2" fill="#e9e6f1"/>${hl("M16 141 H184", .6, 1)}
<ellipse cx="100" cy="142" rx="30" ry="4" fill="#bcb8cc"/><ellipse cx="100" cy="142" rx="24" ry="2.6" fill="#8a86a0"/>
<path d="M98 140 V126 C98 120 112 120 112 126" fill="none" stroke="${x.url("chr")}" stroke-width="3.4" stroke-linecap="round"/>
<rect x="18" y="150" width="164" height="40" fill="${x.url("wood")}"/><path d="M100 152 V188" stroke="#2a1b10" stroke-opacity=".6"/><rect x="88" y="166" width="8" height="2.4" rx="1" fill="${x.url("chr")}"/><rect x="104" y="166" width="8" height="2.4" rx="1" fill="${x.url("chr")}"/>
${x.on ? `<rect x="14" y="140" width="172" height="10" fill="${x.c}" opacity="${x.op(.2)}"/>` : ""}</g>`, mir);
    } }),

    base({ id: "closet", name: "Closet shelves", colors: W1, glow: { x: .5, y: .3, r: 1.1 }, render(o) {
      const x = ctx(o);
      const shirts = [["#c95f5f", 46], ["#e9e6f1", 64], ["#3c4a6e", 80], ["#7aa58a", 96], ["#d9b46a", 112], ["#5a5476", 130], ["#e0a0b8", 148]];
      return out(x, `<g class="hda-bg"><rect x="20" y="10" width="160" height="186" fill="#3a3550"/><rect x="20" y="10" width="160" height="186" fill="#000" opacity=".25"/></g>
${washR(x, 24, 44, 152, 80, "cone", .85)}${washR(x, 24, 132, 152, 50, "cone", .7)}
<rect x="24" y="22" width="152" height="18" fill="#2c2840"/><rect x="40" y="24" width="18" height="16" rx="2" fill="#a9876a"/><rect x="62" y="28" width="22" height="12" rx="2" fill="#8c95b0"/><rect x="120" y="26" width="30" height="14" rx="2" fill="#c9c4d4"/>
<path d="M30 52 H170" stroke="${x.url("chr")}" stroke-width="2.4"/>
${shirts.map(([col, cx]) => `<path d="M${cx} 52 L${cx - 8} 60 L${cx - 9} 116 H${cx + 9} L${cx + 8} 60 Z" fill="${col}"/><path d="M${cx} 52 L${cx - 8} 60 L${cx - 9} 116 H${cx - 5} L${cx - 4} 62 Z" fill="#000" opacity=".2"/><path d="M${cx - 2} 52 C${cx - 2} 48 ${cx + 2} 48 ${cx + 2} 51" stroke="#cfcbdb" fill="none"/>`).join("")}
${x.on ? `<rect x="24" y="52" width="152" height="20" fill="${x.c}" opacity="${x.op(.18)}"/>` : ""}
<rect x="22" y="40" width="156" height="5" fill="#e9e6f1"/>${strip(x, "M26 46.5 H174", 1.4)}
<rect x="22" y="128" width="156" height="5" fill="#e9e6f1"/>${strip(x, "M26 134.5 H174", 1.4)}
${[40, 62, 86, 110, 134, 154].map((xx, i) => `<path d="M${xx} 180 C${xx} 172 ${xx + 12} 172 ${xx + 16} 180 Z" fill="${["#2a2638", "#8a5a32", "#e9e6f1", "#7a3d5c", "#2a2638", "#c9a24a"][i]}"/>`).join("")}
<rect x="22" y="180" width="156" height="5" fill="#e9e6f1"/>
<rect x="12" y="4" width="10" height="196" fill="#e9e6f1"/><rect x="178" y="4" width="10" height="196" fill="#e9e6f1"/><rect x="12" y="2" width="176" height="8" fill="#f6f4fb"/>`);
    } }),

    base({ id: "bookcase", name: "Bookcase sides", colors: W2, cast: "around", glow: { x: .5, y: .5, r: 1.15 }, render(o) {
      const x = ctx(o); let bk = ""; const cols = ["#7a3d5c", "#2f5d7c", "#c9a24a", "#3e6b3a", "#b65b3a", "#5a5476", "#d9d4e2", "#8a5a32"];
      [52, 92, 132, 172].forEach((y, r) => { let xx = 56;
        while (xx < 140) { const w = 6 + ((xx * 7 + r * 13) % 5), hh = 26 + ((xx * 3 + r) % 8); if (r === 1 && xx > 100 && xx < 124) { xx = 124; bk += `<ellipse cx="112" cy="${y}" rx="10" ry="2" fill="#000" opacity=".3"/><path d="M104 ${y} C104 ${y - 16} 120 ${y - 16} 120 ${y} Z" fill="#9ac0d0"/>`; continue; }
          bk += `<rect x="${xx}" y="${y - hh}" width="${w}" height="${hh}" rx=".8" fill="${cols[Math.floor(xx + r * 3) % 8]}"/><path d="M${xx + 1.4} ${y - hh + 3} V${y - 3}" stroke="#fff" stroke-opacity=".2"/>`; xx += w + .8; } });
      return out(x, `${wall(x)}${ell(x, 48, 100, 30, 96, .4)}${ell(x, 152, 100, 30, 96, .4)}
<rect x="44" y="12" width="112" height="176" fill="#241f33"/>${bk}
${washR(x, 50, 14, 50, 172, "coneR", .7)}${washR(x, 100, 14, 50, 172, "coneL", .7)}
${[52, 92, 132, 172].map((y) => `<rect x="44" y="${y}" width="112" height="5" fill="${x.url("woodT")}"/>`).join("")}
<rect x="36" y="6" width="14" height="186" fill="${x.url("wood")}"/><rect x="150" y="6" width="14" height="186" fill="${x.url("wood")}"/><rect x="34" y="4" width="132" height="10" rx="1" fill="${x.url("woodT")}"/>
<rect x="34" y="186" width="132" height="8" fill="${x.url("wood")}"/>
${strip(x, "M51.5 16 V184", 1.6)}${strip(x, "M148.5 16 V184", 1.6)}`);
    } }),

    base({ id: "panel", name: "Slat wall panel", colors: RGB2, cast: "around", glow: { x: .5, y: .48, r: 1.2 }, render(o) {
      const x = ctx(o); let sl = "";
      for (let xx = 52; xx < 148; xx += 8) sl += `<rect x="${xx}" y="22" width="6" height="146" fill="${x.url("woodT")}"/><path d="M${xx + 1.5} 22 V168" stroke="#fff" stroke-opacity=".12"/>`;
      return out(x, `${wall(x, "#4b4566", .55)}
${x.on ? `<rect x="40" y="12" width="120" height="166" rx="10" fill="none" stroke="${x.c}" stroke-width="20" stroke-opacity="${x.op(.22)}"/><rect x="45" y="17" width="110" height="156" rx="4" fill="none" stroke="${x.c}" stroke-width="7" stroke-opacity="${x.op(.6)}"/>${ell(x, 100, 95, 92, 100, .45)}` : ""}
<rect x="50" y="22" width="100" height="146" fill="#1a1410"/>${sl}
${x.on ? `<rect x="50" y="22" width="100" height="146" fill="none" stroke="${x.hot}" stroke-width="1.4" stroke-opacity="${x.op(.9)}"/>` : `<rect x="53" y="25" width="100" height="146" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="2"/>`}
<rect x="62" y="104" width="76" height="6" fill="${x.url("wood")}"/><rect x="72" y="88" width="14" height="16" rx="2" fill="#d9d4e2"/><circle cx="79" cy="84" r="7" fill="#4f8a4a"/><rect x="106" y="94" width="20" height="10" rx="1" fill="#2a2735"/>
<rect x="30" y="178" width="140" height="14" rx="2" fill="#e9e6f1"/>${x.on ? `<rect x="30" y="178" width="140" height="3" fill="${x.c}" opacity="${x.op(.4)}"/>` : ""}`);
    } }),

    base({ id: "garage", name: "Garage ceiling", colors: [DAY, WARM, SOFT, "#6e8bff", "#3fe08f"], glow: { x: .5, y: .2, r: 1.2 }, render(o) {
      const x = ctx(o), car = lg(x.id("car"), [[0, "#b8c2d8"], [.5, "#6d7a96"], [1, "#3a445c"]], 1);
      return out(x, `<g class="hda-bg"><path d="M0 0 H200 V36 H0 Z" fill="${x.url("ceil")}"/>${[0, 1, 2, 3].map((i) => `<path d="M${50 * i + 25} 0 V36" stroke="#000" stroke-opacity=".12"/>`).join("")}
${wall(x, "#5a5476", .45)}<rect x="0" y="150" width="200" height="50" fill="#5a566a" opacity=".55"/><path d="M0 150 H200" stroke="#000" stroke-opacity=".3"/></g>
${[40, 100, 160].map((cx) => washP(x, `M${cx - 16} 32 L${cx - 42} 196 L${cx + 42} 196 L${cx + 16} 32 Z`, "cone", .45)).join("")}
${pool(x, 100, 184, 100, 14, .5)}
<g class="hda-bg"><path d="M38 150 C40 128 52 110 70 106 L130 106 C148 110 160 128 162 150 L164 170 H36 Z" fill="url(#${x.id("car")})"/>
<path d="M58 128 C62 116 70 112 78 112 H122 C130 112 138 116 142 128 Z" fill="#1d2232"/><path d="M60 126 L74 114 H84 L70 126 Z" fill="#fff" opacity=".12"/>
<rect x="44" y="140" width="22" height="6" rx="2" fill="#ff5f5f"/><rect x="134" y="140" width="22" height="6" rx="2" fill="#ff5f5f"/><rect x="84" y="148" width="32" height="8" rx="1" fill="#e9e6f1"/>
<rect x="40" y="168" width="18" height="14" rx="3" fill="#14121a"/><rect x="142" y="168" width="18" height="14" rx="3" fill="#14121a"/></g>
<g class="hda-bg">${x.on ? `<path d="M48 110 C70 104 130 104 152 110" stroke="${x.hot}" stroke-opacity="${x.op(.6)}" stroke-width="1.6" fill="none"/>` : ""}</g>
${[40, 100, 160].map((cx) => `<rect x="${cx - 18}" y="28" width="36" height="6" rx="1.5" fill="${x.url("alu")}"/>${strip(x, `M${cx - 16} 34.5 H${cx + 16}`, 1.8)}`).join("")}`, car);
    } }),

    base({ id: "eave", name: "Roofline eave", colors: RGB, glow: { x: .5, y: .34, r: 1.25 }, render(o) {
      const x = ctx(o), roof = lg(x.id("roof"), [[0, "#3a3346"], [1, "#221d2b"]], 1);
      let sid = ""; for (let y = 70; y < 196; y += 8) sid += `<path d="M14 ${y} H186" stroke="#000" stroke-opacity=".18"/>`;
      return out(x, `<rect x="14" y="62" width="172" height="134" fill="#8c95b0" opacity=".55"/>${sid}
${washR(x, 14, 62, 172, 100, "cone", .9)}
<rect x="40" y="96" width="40" height="50" rx="1" fill="#e9e6f1"/><rect x="44" y="100" width="32" height="42" fill="#2a2f44"/><path d="M60 100 V142 M44 121 H76" stroke="#e9e6f1" stroke-width="2"/>
<rect x="44" y="100" width="32" height="42" fill="#ffc477" opacity=".35"/>
<rect x="116" y="96" width="44" height="100" rx="1" fill="#e9e6f1"/><rect x="120" y="100" width="36" height="96" fill="#5b3a5c"/><circle cx="150" cy="150" r="2.4" fill="${x.url("chr")}"/>
${x.on ? `<rect x="116" y="96" width="44" height="20" fill="${x.c}" opacity="${x.op(.25)}"/>` : ""}
<path d="M0 54 L100 6 L200 54 V62 H0 Z" fill="url(#${x.id("roof")})"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${20 + i * 8} ${f(44 - i * 3.8)} H${180 - i * 8}" stroke="#000" stroke-opacity=".25"/>`).join("")}
<rect x="0" y="56" width="200" height="8" fill="#e9e6f1"/>
${chase(x, "M6 66 H194", 2.4)}
${Array.from({ length: 16 }, (_, i) => `<rect x="${f(9 + i * 12)}" y="64.4" width="3.4" height="3.4" rx=".6" fill="${x.on ? "#fff" : "#8a86a0"}" opacity="${x.on ? x.op(.7) : .9}"/>`).join("")}`, roof);
    } }),

    base({ id: "deck", name: "Deck rail", colors: W2, glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o); let bal = "", bd = "";
      for (let xx = 18; xx < 186; xx += 12) bal += `<rect x="${xx}" y="94" width="5" height="62" fill="${x.url("woodT")}"/>${x.on ? `<rect x="${xx}" y="94" width="5" height="62" fill="${x.url("cone")}" opacity="${x.op(.9)}"/>` : ""}`;
      for (let i = 0; i < 6; i++) bd += `<path d="M0 ${156 + i * 7} H200" stroke="#2a1b10" stroke-opacity=".5"/>`;
      return out(x, `<g class="hda-bg"><path d="M158 22 A12 12 0 1 0 170 40 A10 10 0 1 1 158 22 Z" fill="#e9e6f1" opacity=".85"/>
${[[30, 20], [70, 40], [120, 18], [184, 60], [96, 64]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="#fff" opacity=".7"/>`).join("")}</g>
<g class="hda-bg"><path d="M0 156 H200 V200 H0 Z" fill="${x.url("wood")}"/>${bd}</g>${washR(x, 0, 156, 200, 40, "cone", .6)}
${bal}<rect x="8" y="80" width="10" height="80" fill="${x.url("wood")}"/><rect x="182" y="80" width="10" height="80" fill="${x.url("wood")}"/>
<rect x="4" y="82" width="192" height="8" rx="1" fill="${x.url("woodT")}"/><rect x="4" y="89" width="192" height="4" fill="#4a2c16"/>${hl("M6 83 H194", .3, 1)}
<rect x="18" y="93" width="164" height="3.6" rx="1.8" fill="#e9e6f1" opacity=".35"/>${strip(x, "M20 94.6 H180", 1.8)}`);
    } }),

    base({ id: "pergola", name: "Pergola beams", colors: W1, glow: { x: .5, y: .3, r: 1.25 }, render(o) {
      const x = ctx(o), beams = [[30, 6], [54, 8], [82, 10], [116, 12]];
      return out(x, `<g class="hda-bg">${[[30, 20], [150, 14], [100, 30], [178, 40]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".9" fill="#fff" opacity=".6"/>`).join("")}
<rect x="0" y="168" width="200" height="32" fill="#4a4658" opacity=".7"/>${[1, 2, 3, 4].map((i) => `<path d="M${i * 46} 168 L${i * 46 - 20} 200" stroke="#000" stroke-opacity=".2"/>`).join("")}</g>
${washP(x, "M20 40 L0 196 H200 L180 40 Z", "cone", .4)}${pool(x, 100, 178, 100, 18, .7)}
<g class="hda-bg"><ellipse cx="100" cy="150" rx="34" ry="6" fill="#d9d4e2"/><path d="M98 150 V172 M84 172 H116" stroke="#2a2638" stroke-width="3"/>
<path d="M66 156 V176 M60 150 H76 V176 M134 156 V176 M124 150 H140 V176" stroke="#2a2638" stroke-width="2" fill="none"/>
${x.on ? `<ellipse cx="100" cy="149" rx="34" ry="6" fill="${x.c}" opacity="${x.op(.35)}"/>` : ""}</g>
<rect x="10" y="40" width="12" height="150" fill="${x.url("wood")}"/><rect x="178" y="40" width="12" height="150" fill="${x.url("wood")}"/>
${beams.map(([y, h]) => `<rect x="2" y="${y}" width="196" height="${h}" rx="1" fill="${x.url("wood")}"/>${hl(`M4 ${y + 1} H196`, .2, 1)}${strip(x, `M8 ${y + h + 1} H192`, 1 + h / 10)}`).join("")}`);
    } }),

    base({ id: "rgbic", name: "RGBIC chase", colors: RGB2, cast: "around", glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), d = "M24 150 C24 110 70 120 70 86 C70 54 130 66 130 104 C130 140 176 132 176 50";
      return out(x, `${wall(x, "#5a5476", .6)}${halo(x, 100, 100, 92, .4)}
<path d="${d}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="9" stroke-linecap="round" transform="translate(1.5 3)"/>
<path d="${d}" fill="none" stroke="#e9e6f1" stroke-width="8" stroke-linecap="round"/>
${chase(x, d, 3.2)}
<path d="M24 150 V166" stroke="#e9e6f1" stroke-width="3"/><rect x="14" y="166" width="20" height="10" rx="2.4" fill="${x.url("blk")}"/>
<circle cx="20" cy="171" r="1.4" fill="${x.on ? hue(x.c, 0) : "#555"}"/><circle cx="25" cy="171" r="1.4" fill="${x.on ? hue(x.c, 120) : "#555"}"/>
<path d="M34 171 C50 171 52 190 70 190 H90" fill="none" stroke="#14121a" stroke-width="2"/><rect x="90" y="185" width="18" height="10" rx="2" fill="#e9e6f1"/>`);
    } }),

    base({ id: "cob", name: "COB dotless", colors: W1, cast: "around", glow: { x: .6, y: .55, r: 1.1 }, render(o) {
      const x = ctx(o); let coil = "";
      for (let r = 14; r <= 34; r += 4) coil += `<circle cx="52" cy="110" r="${r}" fill="none" stroke="#d9c79a" stroke-width="3"/><circle cx="52" cy="110" r="${r}" fill="none" stroke="#e8e0c8" stroke-width="1.2" stroke-opacity=".8"/>`;
      const d = "M86 110 C120 110 130 98 186 98";
      return out(x, `${wall(x)}${ell(x, 140, 104, 80, 46, .55)}${clip(x, `<g transform="translate(-12 -28) scale(1.25)">
<circle cx="52" cy="110" r="44" fill="#000" opacity=".3" transform="translate(2 4)"/><circle cx="52" cy="110" r="44" fill="#e9e6f1" opacity=".9"/><circle cx="52" cy="110" r="44" fill="none" stroke="#8a86a0" stroke-width="1.4"/>
${coil}<circle cx="52" cy="110" r="10" fill="#2a2638"/><circle cx="52" cy="110" r="4" fill="#e9e6f1"/>
<path d="M86 110 C120 110 130 98 186 98" fill="none" stroke="#e8e0c8" stroke-width="7"/><path d="M86 110 C120 110 130 98 186 98" fill="none" stroke="#c9b880" stroke-width="7" stroke-opacity=".5" stroke-dasharray="1 24"/>
${strip(x, d, 3.4)}
<path d="M186 94.5 V101.5" stroke="#b07f33" stroke-width="2"/><path d="M190 96 h4 M190 100 h4" stroke="#b07f33" stroke-width="1.2"/>
${x.on ? "" : `<path d="${d}" fill="none" stroke="#f5edd6" stroke-width="3.4"/>`}</g>`)}`);
    } }),

    base({ id: "smd", name: "Dotted SMD", colors: RGB, cast: "around", glow: { x: .5, y: .5, r: 1.15 }, render(o) {
      const x = ctx(o); let chips = "";
      for (let i = 0; i < 7; i++) { const cx = 22 + i * 26;
        chips += `<rect x="${cx - 6}" y="92" width="12" height="12" rx="1" fill="#f2f0fa"/><circle cx="${cx}" cy="98" r="4.4" fill="${x.on ? x.hot : "#e8d9a8"}"/>
${x.on ? `<circle cx="${cx}" cy="98" r="14" fill="${x.url("halo")}" opacity="${x.op(.9)}"/><circle cx="${cx}" cy="98" r="2.2" fill="#fff"/>` : `<circle cx="${cx - 1}" cy="97" r="1.4" fill="#fff" opacity=".7"/>`}
<rect x="${cx + 8}" y="95" width="5" height="2.6" fill="#1a1a22"/>`;
        if (i % 3 === 2) chips += `<path d="M${cx + 13} 87 V109" stroke="#fff" stroke-opacity=".6" stroke-dasharray="1.6 1.4"/><rect x="${cx + 9}" y="89" width="3" height="4" fill="#d9a84a"/><rect x="${cx + 14}" y="89" width="3" height="4" fill="#d9a84a"/><rect x="${cx + 9}" y="103" width="3" height="4" fill="#d9a84a"/><rect x="${cx + 14}" y="103" width="3" height="4" fill="#d9a84a"/>`; }
      return out(x, `${wall(x)}${x.on ? `<rect x="0" y="64" width="200" height="34" fill="${x.url("coneU")}" opacity="${x.op(.45)}"/><rect x="0" y="98" width="200" height="34" fill="${x.url("cone")}" opacity="${x.op(.45)}"/>` : ""}
${clip(x, `<g transform="translate(100 98) scale(1.55) translate(-100 -98)">
<rect x="0" y="86" width="200" height="24" fill="#000" opacity=".3" transform="translate(0 3)"/>
<rect x="0" y="86" width="200" height="24" fill="#ece9f4"/><path d="M0 88.5 H200 M0 107.5 H200" stroke="#c4bfd2" stroke-width="1"/>
${chips}
<path d="M150 110 L196 110 L190 130 C176 136 160 128 150 118 Z" fill="#c8c2a6" opacity=".9"/><path d="M150 110 L196 110" stroke="#fff" stroke-opacity=".6"/></g>`)}`);
    } }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "ledstrips",
    tab: "LED strips",
    group: "Lights",
    kind: "light",
    intro: "Twenty LED strip installs people really have, from toe-kicks and coves to stairs, beds, desks, decks and rooflines. Lit strips glow in the light color and wash the surface next to them; RGBIC strips chase through colors.",
    
    css: `.hda-anim .hda-ledstrips-chase{animation:hda-ledstrips-chase 6s linear infinite}
.hda-anim .hda-ledstrips-breathe{animation:hda-ledstrips-breathe 6s ease-in-out infinite}
@keyframes hda-ledstrips-chase{from{stroke-dashoffset:0}to{stroke-dashoffset:-60}}
@keyframes hda-ledstrips-breathe{0%,100%{opacity:1}50%{opacity:.62}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-ledstrips-chase,.hda-anim .hda-ledstrips-breathe{animation:none}}`,
    icons,
  });
})();
