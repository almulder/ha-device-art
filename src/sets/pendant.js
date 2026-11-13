(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  function ctx(o) {
    const c = o.color || "#ffc477", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => (k * L).toFixed(2) };
  }
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("")}</linearGradient>`;
  const rg = (id, stops, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("")}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .8], [.45, c, .28], [1, c, 0]])}
${lg(id("cone"), [[0, c, .6], [.5, c, .2], [1, c, 0]], 1)}
${rg(id("pool"), [[0, c, .55], [1, c, 0]])}
${rg(id("fill"), [[0, "#ffffff", .97], [.42, hot, 1], [1, c, .8]], .5, .45, .6)}
${rg(id("gl"), [[0, "#ffffff", .5], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .22]], .34, .28, .75)}
${lg(id("blk"), [[0, "#111117"], [.28, "#3b3c49"], [.42, "#555769"], [.72, "#22232c"], [1, "#0c0c11"]])}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("wht"), [[0, "#9c98b0"], [.3, "#f2f0fa"], [.45, "#ffffff"], [.75, "#d4d0e2"], [1, "#8a86a0"]])}
${lg(id("sh"), [[0, "#000", .42], [.3, "#000", 0], [.62, "#000", .06], [1, "#000", .5]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const sway = (body, d) => `<g class="hda-pendant-sway" style="animation-delay:-${d || 0}s">${body}</g>`;

  const canopy = (x, cx, w, m) => `<rect x="${cx - w / 2}" y="2" width="${w}" height="3.4" rx="1.4" fill="${x.url(m)}"/>
<path d="M${cx - w / 2} 5 h${w} l-2.4 5.6 h-${w - 4.8} Z" fill="${x.url(m)}"/><path d="M${cx - w / 2 + 2.4} 10.6 h${w - 4.8}" stroke="#000" stroke-opacity=".35"/>
<rect x="${cx - 2.6}" y="10.4" width="5.2" height="5" rx="1" fill="${x.url(m)}"/>`;
  const cord = (cx, y0, y1, col) => `<path d="M${cx} ${y0} V${y1}" stroke="${col || "#141219"}" stroke-width="2"/><path d="M${cx - .5} ${y0} V${y1}" stroke="#fff" stroke-opacity=".14" stroke-width=".6"/>`;
  const halo = (x, cx, cy, r, k) => x.on ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("halo")}" opacity="${x.op(k || .6)}"/>` : "";
  function beam(x, cx, y, hw, sp, k) {
    if (!x.on) return ""; k = k || 1; const y2 = 196;
    return `<path d="M${cx - hw - 3} ${y} L${f(cx - hw - sp * 1.3)} ${y2} L${f(cx + hw + sp * 1.3)} ${y2} L${cx + hw + 3} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.38 * k)}"/>
<path d="M${cx - hw} ${y} L${cx - hw - sp} ${y2} L${cx + hw + sp} ${y2} L${cx + hw} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.6 * k)}"/>
<ellipse cx="${cx}" cy="${y2 - 4}" rx="${hw + sp + 10}" ry="6" fill="${x.url("pool")}" opacity="${x.op(.8 * k)}"/>`;
  }
  const ENV = {
    pear: "M-4 -16 C-4 -10 -10 -8 -10 0 C-10 7 -5.5 11 0 11 C5.5 11 10 7 10 0 C10 -8 4 -10 4 -16 Z",
    tube: "M-4.5 -16 C-6 -12 -7 -8 -7 0 L-7 13 C-7 19 7 19 7 13 L7 0 C7 -8 6 -12 4.5 -16 Z",
    globe: "M-4 -16 C-4 -13 -13 -11 -13 0 C-13 8 -7 13 0 13 C7 13 13 8 13 0 C13 -11 4 -13 4 -16 Z",
  };
  const FIL = {
    pear: { s: "M-1.6 -15 L-4.5 -2 M1.6 -15 L4.5 -2 M0 -15 V-6", f: "M-4.6 -1 C-4.6 5 -2.6 5 -1.6 -.5 C-1 5 1 5 1.6 -.5 C2.6 5 4.6 5 4.6 -1" },
    tube: { s: "M-1.4 -15 L-2.6 -10 M1.4 -15 L2.6 -10", f: "M-3 -10 L-3.6 13 M0 -10 V14 M3 -10 L3.6 13 M-3.6 13 C-2 15 2 15 3.6 13" },
    globe: { s: "M-1.6 -15 L-5 -3 M1.6 -15 L5 -3", f: "M-6 -2.4 C-6 4 -3.2 4 -2.2 -1 C-1.4 4 1.4 4 2.2 -1 C3.2 4 6 4 6 -2.4" },
  };
  function bulb(x, cx, cy, s, kind, flip) {
    kind = kind || "pear"; const e = ENV[kind], fl = FIL[kind];
    const base = `<rect x="-4.7" y="-23.5" width="9.4" height="8.4" rx="1.6" fill="${x.url("brs")}"/><path d="M-4.7 -21 L4.7 -19.8 M-4.7 -18.2 L4.7 -17" stroke="#3d2a10" stroke-opacity=".6" stroke-width=".6"/>`;
    const lit = x.on ? `<path d="${e}" fill="${x.c}" fill-opacity="${x.op(.3)}"/><circle cx="0" cy="${kind === "tube" ? 3 : 0}" r="${kind === "tube" ? 15 : 13}" fill="${x.url("halo")}" opacity="${x.op(.9)}"/>
<g class="hda-pendant-fil"><path d="${fl.f}" fill="none" stroke="${x.c}" stroke-width="2.8" stroke-opacity="${x.op(.55)}" stroke-linecap="round"/><path d="${fl.f}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width="1" stroke-linecap="round"/></g>`
      : `<path d="${e}" fill="#fff" fill-opacity=".05"/><path d="${fl.f}" fill="none" stroke="#6b4e2e" stroke-width=".8" stroke-opacity=".85"/>`;
    return `<g transform="translate(${cx} ${cy}) scale(${s} ${flip ? -s : s})">${base}${lit}<path d="${fl.s}" stroke="#d8d4e6" stroke-opacity=".45" stroke-width=".45"/>
<path d="${e}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/><path d="M-6 -6 C-7 -2 -6.5 3 -4 6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/></g>`;
  }
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;

  const WARM = "#ffc477", SOFT = "#ffe2b8", DAY = "#eef4ff";
  const COLS = [WARM, SOFT, DAY, "#ff9fb6", "#8fd0ff"];
  const MAT2 = {
    metal: (c) => [[0, H.shade(c, -.55)], [.22, H.shade(c, -.05)], [.38, H.shade(c, .5)], [.58, H.shade(c, -.1)], [.82, H.shade(c, -.4)], [1, H.shade(c, -.6)]],
    paint: (c) => [[0, H.shade(c, -.5)], [.28, H.shade(c, -.04)], [.42, H.shade(c, .2)], [.72, H.shade(c, -.22)], [1, H.shade(c, -.55)]],
  };
  const s2 = (x, c, kind, nm) => lg(x.id(nm || "s2"), MAT2[kind || "paint"](c));
  const SH2 = (o) => Object.assign({ picker2: true, colorLabel2: "Shade" }, o);
  const GLASS2 = ["#eef4f8", "#6b5e55", "#d99a4a", "#9fc3a8", "#8fb7d9", "#e8b4b8"];
  const OPAL2 = ["#f4f2f8", "#ecd9b8", "#efc4cc", "#bcd8c0", "#b9c8e0", "#9a9aa6"];
  const METAL2 = ["#2a2b33", "#ecebf0", "#c99a48", "#8ea58b", "#2b3c63", "#b8774f"];
  const COLS2 = [WARM, SOFT, DAY, "#ffa94d", "#b9a6ff"];
  const COLS3 = [SOFT, WARM, DAY, "#9ef0c4", "#ff9fb6"];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "down" }, o);

  const icons = [
     base(SH2({ id: "globe", name: "Glass globe", colors: COLS, colors2: GLASS2, colorLabel2: "Globe", glow: { x: .5, y: .56, r: 1 }, render(o) {
      const x = ctx(o);
      return svg(x, canopy(x, 100, 26, "brs") + sway(halo(x, 100, 114, 74, .55) + beam(x, 100, 144, 24, 44) + cord(100, 15, 66) +
        `<rect x="93" y="63" width="14" height="13" rx="2.2" fill="${x.url("brs")}"/><ellipse cx="100" cy="76" rx="9.5" ry="2.6" fill="${x.url("brs")}"/>
<circle cx="100" cy="114" r="40" fill="${x.on ? H.rgba(x.c, (.06 + .1 * x.L).toFixed(2)) : "rgba(255,255,255,.04)"}"/><circle cx="100" cy="114" r="40" fill="${o.color2 || GLASS2[0]}" opacity=".22"/>` + bulb(x, 100, 112, 1.45, "pear") +
        `<circle cx="100" cy="114" r="40" fill="none" stroke="#1b1636" stroke-opacity=".3" stroke-width="2"/><circle cx="100" cy="114" r="40" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".38" stroke-width="1"/>
${x.on ? `<circle cx="100" cy="114" r="39.4" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.6)}" stroke-width="1.6"/>` : ""}
${hl("M71 100 C74 88 84 80 95 77", .55, 3)}${hl("M128 132 C122 142 112 148 102 150", .18, 2)}<ellipse cx="82" cy="94" rx="3" ry="2" fill="#fff" fill-opacity=".6"/>`, 0));
    } })),

     base(SH2({ id: "seeded", name: "Seeded cone", colors: COLS2, colors2: ["#d6efe5", "#6b5e55", "#d99a4a", "#8fb7d9", "#e8b4b8"], colorLabel2: "Glass", glow: { x: .5, y: .55, r: 1 }, render(o) {
      const x = ctx(o), r = rnd(37); let bub = "";
      for (let i = 0; i < 46; i++) { const y = 62 + r() * 76, hw = 6 + (y - 58) / 82 * 32, bx = 100 + (r() * 2 - 1) * hw * .92, br = .5 + r() * 1.3;
        bub += `<circle cx="${f(bx)}" cy="${f(y)}" r="${f(br)}" fill="#fff" fill-opacity=".12" stroke="#fff" stroke-opacity=".5" stroke-width=".4"/>`; }
      const P = "M93 58 L107 58 C110 80 126 112 140 140 C128 147 72 147 60 140 C74 112 90 80 93 58 Z";
      const g2 = o.color2 || "#d6efe5", ex = lg(x.id("sg"), [[0, g2, .38], [.25, g2, .12], [.6, g2, .08], [1, g2, .4]]);
      return svg(x, canopy(x, 100, 24, "blk") + sway(halo(x, 100, 112, 70, .5) + beam(x, 100, 142, 38, 34) + cord(100, 15, 48) +
        `<path d="${P}" fill="url(#${x.id("sg")})"/>${x.on ? `<path d="${P}" fill="${x.c}" fill-opacity="${x.op(.14)}"/>` : ""}` + bulb(x, 100, 108, 1.32, "tube") +
        `${bub}<path d="${P}" fill="none" stroke="#1b1636" stroke-opacity=".3" stroke-width="2"/><path d="${P}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".9"/>
<ellipse cx="100" cy="141" rx="40" ry="5.6" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? x.op(.85) : ".42"}" stroke-width="1.4"/>
${hl("M95 64 C91 88 80 116 69 136", .38, 2.2)}${hl("M111 70 C116 92 124 110 132 126", .12, 1.4)}
<rect x="91.5" y="46" width="17" height="14" rx="3" fill="${x.url("blk")}"/><rect x="91.5" y="57" width="17" height="2.4" fill="${x.url("brs")}"/>`, 1.6), ex);
    } })),

     base(SH2({ id: "dome", name: "Black dome", colors: COLS, colors2: METAL2, glow: { x: .5, y: .6, r: 1.05 }, render(o) {
      const x = ctx(o), P = "M100 56 C64 56 44 82 40 116 L160 116 C156 82 136 56 100 56 Z";
      return svg(x, canopy(x, 100, 26, "blk") + sway(beam(x, 100, 118, 56, 34) + halo(x, 100, 120, 62, .4) + cord(100, 15, 52) +
        `<rect x="93" y="49" width="14" height="10" rx="2" fill="${x.url("blk")}"/><path d="${P}" fill="${x.url("s2")}"/>
<path d="M100 56 C136 56 156 82 160 116 L130 116 C128 90 118 66 100 56 Z" fill="#000" fill-opacity=".16"/>
${hl("M60 100 C64 80 80 64 98 60", .22, 3.2)}${hl("M140 76 C150 88 155 100 157 110", .08, 2)}
<ellipse cx="100" cy="116" rx="60" ry="8" fill="#0a0a0f"/>
<ellipse cx="100" cy="116.6" rx="56" ry="6.6" fill="${x.on ? x.url("fill") : x.url("wht")}" ${x.on ? "" : 'opacity=".42"'}/>
${x.on ? `<ellipse cx="100" cy="117.4" rx="18" ry="4.2" fill="#fff" opacity="${x.op(.95)}"/>` : ""}
<path d="M40 116 A60 8 0 0 0 160 116" fill="none" stroke="#7a7c8e" stroke-opacity=".6" stroke-width="1"/>`, .8), s2(x, o.color2 || METAL2[0], "metal"));
    } })),

     base(SH2({ id: "bell", name: "Brass bell", colors: COLS2, colors2: ["#c99a48", "#2a2b33", "#ecebf0", "#b8774f", "#d6d9de", "#2b3c63"], glow: { x: .5, y: .63, r: 1 }, render(o) {
      const x = ctx(o), P = "M100 46 C88 46 84 56 84 70 C84 96 70 112 56 124 L144 124 C130 112 116 96 116 70 C116 56 112 46 100 46 Z";
      return svg(x, canopy(x, 100, 24, "brs") + sway(beam(x, 100, 126, 40, 38) + halo(x, 100, 128, 58, .45) + cord(100, 15, 44) +
        `<ellipse cx="100" cy="45" rx="7" ry="4" fill="${x.url("s2")}"/><path d="${P}" fill="${x.url("s2")}"/>
<path d="M100 46 C112 46 116 56 116 70 C116 96 130 112 144 124 L128 124 C114 112 106 94 106 70 C106 56 104 48 100 46 Z" fill="#000" fill-opacity=".14"/>
${hl("M90 56 C88 74 86 96 70 116", .5, 2.6)}${hl("M110 60 C112 80 118 100 132 116", .14, 1.6)}
<path d="M84.4 80 C92 82 108 82 115.6 80" fill="none" stroke="#5a3a10" stroke-opacity=".5" stroke-width="1"/>
<ellipse cx="100" cy="124" rx="44" ry="6" fill="#3a260c"/>
<ellipse cx="100" cy="124.4" rx="40.5" ry="4.8" fill="${x.on ? x.url("fill") : "#a4793a"}" ${x.on ? "" : 'opacity=".7"'}/>
<path d="M100 122 C94 122 91 125 91 127 C91 130 109 130 109 127 C109 125 106 122 100 122 Z" fill="${x.on ? "#fff" : "#d8d4e6"}" opacity="${x.on ? x.op(1) : ".6"}"/>
<path d="M56 124 A44 6 0 0 0 144 124" fill="none" stroke="#ffe7a8" stroke-opacity=".5" stroke-width="1.2"/>`, 2.4), s2(x, o.color2 || "#c99a48", "metal"));
    } })),

     base(SH2({ id: "mushroom", name: "Opal mushroom", colors: COLS3, colors2: OPAL2, colorLabel2: "Glass", glow: { x: .5, y: .55, r: 1.1 }, render(o) {
      const x = ctx(o), P = "M100 70 C60 70 36 92 34 114 C34 120 44 122 100 122 C156 122 166 120 166 114 C164 92 140 70 100 70 Z";
      const g2 = o.color2 || OPAL2[0], ex = rg(x.id("op"), [[0, "#ffffff"], [.5, H.mix("#e6e2f0", g2, .7)], [1, H.shade(H.mix("#a39fb8", g2, .6), -.1)]], .45, .3, .75) +
        rg(x.id("opo"), [[0, "#ffffff"], [.4, H.mix(x.hot, g2, .3)], [.85, H.mix(x.c, g2, .35)], [1, H.shade(H.mix(x.c, g2, .35), -.2)]], .5, .55, .7);
      return svg(x, canopy(x, 100, 24, "chr") + sway(halo(x, 100, 100, 84, .55) + beam(x, 100, 120, 60, 28) + cord(100, 15, 64) +
        `<rect x="95" y="61" width="10" height="11" rx="2" fill="${x.url("chr")}"/><path d="${P}" fill="url(#${x.id("op")})"/>
${x.on ? `<path d="${P}" fill="url(#${x.id("opo")})" opacity="${x.op(1)}"/>` : `<path d="${P}" fill="url(#${x.id("sh")})" opacity=".5"/>`}
<ellipse cx="100" cy="119" rx="64" ry="4.4" fill="${x.on ? x.hot : "#8c88a0"}" opacity="${x.on ? x.op(.9) : ".8"}"/>
${hl("M52 102 C60 86 78 76 98 74", x.on ? .3 : .6, 3)}<ellipse cx="70" cy="88" rx="4" ry="2" fill="#fff" fill-opacity="${x.on ? .3 : .7}" transform="rotate(-24 70 88)"/>`, 3.1), ex);
    } })),

     base(SH2({ id: "rattan", name: "Rattan basket", colors: COLS2, colors2: ["#c8964f", "#2a2a2e", "#e8e0d0", "#6a4422", "#8a9a7e"], glow: { x: .5, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o), P = "M100 50 C70 50 50 70 46 100 C44 116 50 128 58 132 L142 132 C150 128 156 116 154 100 C150 70 130 50 100 50 Z";
      let w = ""; let row = 0;
      for (let y = 52; y < 136; y += 5.2, row++) for (let xx = 40 + (row % 2) * 4.2; xx < 162; xx += 8.4)
        w += `<ellipse cx="${f(xx)}" cy="${f(y)}" rx="4.1" ry="2.35" fill="url(#${x.id("st")})"/>`;
      const ex = `<clipPath id="${x.id("rc")}"><path d="${P}"/></clipPath>` + lg(x.id("st"), [[0, H.shade(o.color2 || "#c8964f", .45)], [.55, o.color2 || "#c8964f"], [1, H.shade(o.color2 || "#c8964f", -.42)]], 1) +
        rg(x.id("rin"), [[0, "#ffffff"], [.35, x.hot], [1, x.c, .9]], .5, .62, .6);
      return svg(x, canopy(x, 100, 24, "blk") + sway(halo(x, 100, 100, 82, .45) + beam(x, 100, 134, 40, 34) + cord(100, 15, 52) +
        `<g clip-path="url(#${x.id("rc")})"><path d="${P}" fill="${x.on ? `url(#${x.id("rin")})` : "#2c1f14"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>${x.on ? "" : ""}${w}
<path d="${P}" fill="url(#${x.id("sh")})"/><path d="M60 64 C80 50 120 50 140 64" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="5"/></g>
<ellipse cx="100" cy="131.6" rx="41" ry="5.2" fill="${x.on ? x.url("fill") : "#24180e"}"/>
<path d="M59 131.6 A41 5.2 0 0 0 141 131.6" fill="none" stroke="${H.shade(o.color2 || "#c8964f", .3)}" stroke-width="2"/><ellipse cx="100" cy="51" rx="7" ry="2.4" fill="${H.shade(o.color2 || "#c8964f", -.4)}"/>`, 4.2), ex);
    } })),

     base(SH2({ id: "drum", name: "Linen drum", colors: COLS3, colors2: ["#ddd4c4", "#f2f0ea", "#4a4a50", "#2b3c63", "#9fb39a", "#e3c0b8"], glow: { x: .5, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o), P = "M48 66 A52 6.5 0 0 0 152 66 L152 120 A52 8 0 0 1 48 120 Z";
      const l2 = o.color2 || "#ddd4c4", st = [[0, H.shade(l2, -.38)], [.32, H.shade(l2, .12)], [.6, H.shade(l2, -.04)], [1, H.shade(l2, -.45)]];
      const ex = lg(x.id("ln"), st) + lg(x.id("lno"), st.map(([a, c]) => [a, H.mix(H.mix(c, x.c, .55), "#fff", .25)])) +
        rg(x.id("lnr"), [[0, "#fff", .85], [.5, x.hot, .4], [1, x.hot, 0]], .5, .55, .55);
      let tex = ""; for (let y = 70; y < 126; y += 3.4) tex += `<path d="M48 ${f(y)} H152" stroke="${y % 2 ? "#fff" : "#000"}" stroke-opacity=".05" stroke-width=".7"/>`;
      return svg(x, canopy(x, 100, 24, "wht") + sway(halo(x, 100, 94, 84, .5) + beam(x, 100, 122, 52, 28) + cord(100, 15, 60) +
        `<clipPath id="${x.id("dc")}"><path d="${P}"/></clipPath>
<path d="${P}" fill="url(#${x.id(x.on ? "lno" : "ln")})"/>${x.on ? `<path d="${P}" fill="url(#${x.id("lnr")})" opacity="${x.op(1)}"/>` : ""}
<g clip-path="url(#${x.id("dc")})">${tex}</g>
<path d="M48 66 A52 6.5 0 0 0 152 66" fill="none" stroke="#6d655b" stroke-width="2.6"/><path d="M48 120 A52 8 0 0 0 152 120" fill="none" stroke="#6d655b" stroke-width="2.6"/>
<ellipse cx="100" cy="120" rx="50.6" ry="6.8" fill="${x.on ? x.url("fill") : "#d9d4e2"}" opacity="${x.on ? x.op(1) : ".35"}"/>
${hl("M58 72 V114", .16, 3)}`, 1.2), ex);
    } })),

     base(SH2({ id: "cage", name: "Industrial cage", colors: COLS2, colors2: ["#17171d", "#c99a48", "#d6d9de", "#b8774f", "#ecebf0", "#7a1f2a"], colorLabel2: "Cage", glow: { x: .5, y: .56, r: 1 }, render(o) {
      const x = ctx(o); let wires = "";
      [-1, -.55, 0, .55, 1].forEach((k) => { wires += `M${f(100 + 9 * k)} 74 C${f(100 + 30 * k)} 82 ${f(100 + 36 * k)} 98 ${f(100 + 34 * k)} 112 C${f(100 + 32 * k)} 128 ${f(100 + 20 * k)} 142 ${f(100 + 6 * k)} 147 `; });
      const rings = `<ellipse cx="100" cy="88" rx="29" ry="3.2" fill="none"/><ellipse cx="100" cy="112" rx="34" ry="3.6" fill="none"/><ellipse cx="100" cy="134" rx="26" ry="3" fill="none"/>`;
      const wireG = (st, w, a) => `<g stroke="${st}" stroke-width="${w}" stroke-opacity="${a}" fill="none"><path d="${wires}"/>${rings}</g>`;
      return svg(x, canopy(x, 100, 24, "blk") + sway(halo(x, 100, 112, 72, .55) + beam(x, 100, 140, 22, 44) + cord(100, 15, 46) +
        `<rect x="90.5" y="45" width="19" height="29" rx="3" fill="${x.url("blk")}"/>${[52, 58, 64].map((y) => `<path d="M90.5 ${y} H109.5" stroke="#000" stroke-opacity=".5"/>`).join("")}
<ellipse cx="100" cy="74" rx="11" ry="2.6" fill="${x.url("blk")}"/>` + bulb(x, 100, 113, 1.75, "pear") +
        wireG(o.color2 || "#17171d", 2.4, 1) + wireG(x.on ? x.hot : H.shade(o.color2 || "#17171d", .55), .7, x.on ? x.op(.7) : .5) + `<circle cx="100" cy="147.5" r="3.4" fill="${o.color2 || "#17171d"}"/>`, 3.6));
    } })),

     base(SH2({ id: "prism", name: "Prismatic glass", colors: [DAY, WARM, SOFT, "#8fd0ff", "#ff9fb6"], colors2: ["#cfe3f0", "#d99a4a", "#6b5e55", "#9fc3a8", "#e8b4b8"], colorLabel2: "Glass", glow: { x: .5, y: .5, r: 1.05 }, render(o) {
      const x = ctx(o), P = "M90 58 L110 58 C114 74 124 92 140 108 C148 116 150 124 148 130 L52 130 C50 124 52 116 60 108 C76 92 86 74 90 58 Z";
      let ribs = ""; const N = 22;
      for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N, a = .14 + .32 * Math.abs(u), d = `M${f(100 + u * 10)} 58 C${f(100 + u * 16)} 82 ${f(100 + u * 40)} 100 ${f(100 + u * 46)} 112 S${f(100 + u * 49)} 126 ${f(100 + u * 48)} 130`;
        ribs += `<path d="${d}" fill="none" stroke="${x.on ? x.hot : "#fff"}" stroke-opacity="${x.on ? (a + .35 * x.L).toFixed(2) : a.toFixed(2)}" stroke-width="1.5"/><path d="${d}" transform="translate(1.6 0)" fill="none" stroke="#1b1636" stroke-opacity=".22" stroke-width=".8"/>`; }
      const ex = `<clipPath id="${x.id("pc")}"><path d="${P}"/></clipPath>` + lg(x.id("pg"), [[0, o.color2 || "#cfe3f0", .36], [.3, o.color2 || "#cfe3f0", .12], [.7, o.color2 || "#cfe3f0", .1], [1, o.color2 || "#cfe3f0", .4]]);
      return svg(x, canopy(x, 100, 24, "chr") + sway(halo(x, 100, 104, 78, .5) + beam(x, 100, 132, 46, 28) + cord(100, 15, 48) +
        `<path d="${P}" fill="url(#${x.id("pg")})"/>${x.on ? `<path d="${P}" fill="${x.url("fill")}" opacity="${x.op(.55)}"/>` : ""}` + bulb(x, 100, 96, 1.1, "globe") +
        `<g clip-path="url(#${x.id("pc")})">${ribs}</g><path d="${P}" fill="none" stroke="#1b1636" stroke-opacity=".3" stroke-width="2"/><path d="${P}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
<ellipse cx="100" cy="130" rx="48" ry="4.6" fill="${x.on ? x.hot : "#fff"}" fill-opacity="${x.on ? x.op(.45) : ".08"}" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
<rect x="87" y="47" width="26" height="12" rx="2.4" fill="${x.url("chr")}"/><path d="M87 55 H113" stroke="#000" stroke-opacity=".3"/>`, 5.1), ex);
    } })),

     base(SH2({ id: "rings", name: "Layered rings", colors: COLS3, colors2: ["#ecebf0", "#2a2b33", "#c99a48", "#8ea58b", "#c47a5a"], glow: { x: .5, y: .5, r: 1.05 }, render(o) {
      const x = ctx(o); let bands = "";
      for (let i = 0; i < 4; i++) { const yb = 68 + i * 16, hb = 18 + i * 10, ht = hb - 9, yt = yb - 11;
        bands += `<path d="M${100 - ht} ${yt} L${100 + ht} ${yt} L${100 + hb} ${yb} A${hb} 3.4 0 0 1 ${100 - hb} ${yb} Z" fill="${x.url("s2")}"/>
<path d="M${100 + ht * .4} ${yt} L${100 + ht} ${yt} L${100 + hb} ${yb} A${hb} 3.4 0 0 1 ${100 + hb * .5} ${yb + 3} Z" fill="#000" fill-opacity=".1"/>
<ellipse cx="100" cy="${yb}" rx="${hb}" ry="3.4" fill="${x.on ? x.hot : "#8e89a3"}" opacity="${x.on ? x.op(.95) : ".9"}"/>
${x.on && i < 3 ? `<path d="M${100 - hb} ${yb} A${hb} 3.4 0 0 0 ${100 + hb} ${yb}" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.5)}" stroke-width="2"/>` : ""}`; }
      const core = "M91 57 L109 57 L148 120 L52 120 Z";
      return svg(x, canopy(x, 100, 24, "wht") + sway(halo(x, 100, 96, 80, .5) + beam(x, 100, 120, 48, 28) + cord(100, 15, 57) +
        `<path d="${core}" fill="${x.on ? x.url("fill") : "#2a2638"}" ${x.on ? `opacity="${x.op(.9)}"` : ""}/>
<path d="M92 57 V116 M108 57 V116" stroke="#cfcbe0" stroke-opacity=".5" stroke-width=".8"/>${bands}
<ellipse cx="100" cy="57" rx="9" ry="2.4" fill="#f2f0fa"/>${hl("M64 112 L70 102", .4, 1.6)}`, 2.7), s2(x, o.color2 || "#ecebf0", "paint"));
    } })),

     base(SH2({ id: "lantern", name: "Paper lantern", colors: COLS3, colors2: ["#fdfbff", "#f2e8d0", "#f2c8d0", "#c8dcf0", "#f4e0a0", "#c8e0c8"], colorLabel2: "Paper", cast: "around", glow: { x: .5, y: .55, r: 1.1 }, render(o) {
      const x = ctx(o); let rib = "";
      for (let k = -42; k <= 42; k += 6) { const w = Math.sqrt(46 * 46 - k * k), y = 110 + k;
        rib += `<path d="M${f(100 - w)} ${y} Q100 ${f(y + 3.4 * (w / 46))} ${f(100 + w)} ${y}" fill="none" stroke="${x.on ? H.shade(x.c, -.4) : "#5b5670"}" stroke-opacity="${x.on ? ".3" : ".2"}" stroke-width=".8"/>
<path d="M${f(100 - w)} ${y - 1.4} Q100 ${f(y + 2 * (w / 46))} ${f(100 + w)} ${y - 1.4}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width=".6"/>`; }
      const p2 = o.color2 || "#fdfbff", ex = rg(x.id("pp"), [[0, H.mix("#fdfbff", p2, .5)], [.6, H.mix("#e2dded", p2, .75)], [1, H.shade(H.mix("#9d97b0", p2, .5), -.1)]], .42, .38, .62) +
        rg(x.id("ppo"), [[0, "#ffffff"], [.35, H.mix(x.hot, p2, .35)], [.8, H.mix(x.c, p2, .4)], [1, H.shade(H.mix(x.c, p2, .4), -.28)]], .5, .5, .55);
      return svg(x, canopy(x, 100, 22, "wht") + sway((x.on ? `<ellipse cx="100" cy="190" rx="56" ry="6" fill="${x.url("pool")}" opacity="${x.op(.6)}"/>` : "") + halo(x, 100, 110, 92, .55) + cord(100, 15, 64) +
        `<circle cx="100" cy="110" r="46" fill="url(#${x.id("pp")})"/>${x.on ? `<circle cx="100" cy="110" r="46" fill="url(#${x.id("ppo")})" opacity="${x.op(1)}"/>` : ""}${rib}
<ellipse cx="100" cy="65.4" rx="10" ry="2" fill="#4a4560"/><ellipse cx="100" cy="155" rx="12" ry="2" fill="${x.on ? "#fff" : "#4a4560"}" opacity="${x.on ? x.op(.9) : 1}"/>
${x.on ? "" : hl("M68 92 C72 82 80 74 90 70", .35, 3)}`, .4), ex);
    } })),

     base(SH2({ id: "trio", name: "Mini cluster", colors: COLS2, colors2: GLASS2, colorLabel2: "Glass", glow: { x: .5, y: .52, r: 1.15 }, render(o) {
      const x = ctx(o);
      const mini = (cx, top, d) => sway(halo(x, cx, top + 20, 34, .5) + beam(x, cx, top + 34, 13, 20, .8) + cord(cx, 11, top - 6) +
        `<rect x="${cx - 5}" y="${top - 7}" width="10" height="8" rx="1.6" fill="${x.url("blk")}"/>
<rect x="${cx - 13}" y="${top}" width="26" height="34" rx="6" fill="${x.on ? H.rgba(x.c, (.08 + .12 * x.L).toFixed(2)) : "rgba(255,255,255,.04)"}"/><rect x="${cx - 13}" y="${top}" width="26" height="34" rx="6" fill="${o.color2 || GLASS2[0]}" opacity=".22"/>` + bulb(x, cx, top + 19, .86, "pear") +
        `<rect x="${cx - 13}" y="${top}" width="26" height="34" rx="6" fill="none" stroke="#1b1636" stroke-opacity=".3" stroke-width="2"/><rect x="${cx - 13}" y="${top}" width="26" height="34" rx="6" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".4" stroke-width=".9"/>${hl(`M${cx - 9} ${top + 6} V${top + 26}`, .45, 1.8)}`, d);
      return svg(x, `<rect x="56" y="2" width="88" height="4" rx="1.6" fill="${x.url("blk")}"/><path d="M56 6 h88 l-4 5 h-80 Z" fill="${x.url("blk")}"/>` +
        mini(66, 92, 0) + mini(134, 74, 2.3) + mini(100, 118, 4.6));
    } })),

     base(SH2({ id: "linear", name: "Island bar", colors: [SOFT, WARM, DAY, "#8fd0ff", "#b9a6ff"], colors2: ["#34353f", "#c99a48", "#ecebf0", "#a9aeb8", "#2b3c63"], colorLabel2: "Body", glow: { x: .5, y: .53, r: 1.35 }, render(o) {
      const x = ctx(o);
      const b2 = o.color2 || "#34353f", ex = lg(x.id("bv"), [[0, H.shade(b2, .3)], [.18, b2], [1, H.shade(b2, -.6)]], 1);
      const cp = (cx) => `<rect x="${cx - 9}" y="2" width="18" height="4" rx="1.6" fill="${x.url("blk")}"/><path d="M${cx} 6 V92" stroke="#b9bdcc" stroke-opacity=".8" stroke-width=".8"/>
<path d="M${cx - 2} 88 h4 v4 h-4 Z" fill="${x.url("chr")}"/>`;
      return svg(x, (x.on ? `<ellipse cx="100" cy="106" rx="96" ry="26" fill="${x.url("halo")}" opacity="${x.op(.5)}"/>
<path d="M28 107 L4 196 L196 196 L172 107 Z" fill="${x.url("cone")}" opacity="${x.op(.42)}"/><path d="M30 107 L16 196 L184 196 L170 107 Z" fill="${x.url("cone")}" opacity="${x.op(.45)}"/>
<ellipse cx="100" cy="191" rx="94" ry="7" fill="${x.url("pool")}" opacity="${x.op(.8)}"/>` : "") + cp(44) + cp(156) +
        `<path d="M27 92 L173 92 L176 89 L30 89 Z" fill="#6b6d7e"/><rect x="24" y="92" width="152" height="13" rx="2" fill="url(#${x.id("bv")})"/>
<path d="M173 92 L176 89 L176 102 L173 105 Z" fill="#0c0c11"/>${hl("M28 93.6 H170", .28, 1)}
<rect x="28" y="104.4" width="144" height="3.4" rx="1.4" fill="${x.on ? x.hot : "#8d89a0"}" opacity="${x.on ? x.op(1) : ".6"}"/>
${x.on ? `<rect x="40" y="104.8" width="120" height="2.2" rx="1" fill="#fff" opacity="${x.op(.9)}"/>` : ""}`, ex);
    } })),

     base(SH2({ id: "concrete", name: "Concrete bell", colors: COLS2, colors2: ["#9a98a2", "#5a5860", "#e4e2e6", "#c8b8a0", "#8a9a8e"], glow: { x: .5, y: .62, r: 1 }, render(o) {
      const x = ctx(o), P = "M100 52 C86 52 80 60 78 72 L62 124 L138 124 L122 72 C120 60 114 52 100 52 Z", r = rnd(91); let sp = "";
      for (let i = 0; i < 70; i++) sp += `<circle cx="${f(60 + r() * 80)}" cy="${f(52 + r() * 72)}" r="${f(.3 + r() * .55)}" fill="${r() > .5 ? "#2c2a33" : "#d8d6de"}" fill-opacity="${f(.1 + r() * .18)}"/>`;
      const ex = lg(x.id("cn"), [[0, H.shade(o.color2 || "#9a98a2", -.42)], [.3, H.shade(o.color2 || "#9a98a2", .08)], [.5, o.color2 || "#9a98a2"], [1, H.shade(o.color2 || "#9a98a2", -.5)]]) + lg(x.id("cu"), [[0, "#7a3e1c"], [.4, "#f0a46a"], [.6, "#c9773e"], [1, "#6a3216"]]) +
        `<clipPath id="${x.id("cc")}"><path d="${P}"/></clipPath>`;
      return svg(x, canopy(x, 100, 24, "blk") + sway(beam(x, 100, 126, 36, 36) + halo(x, 100, 128, 54, .45) + cord(100, 15, 52) +
        `<path d="${P}" fill="url(#${x.id("cn")})"/><g clip-path="url(#${x.id("cc")})">${sp}</g>
<path d="M100 52 C114 52 120 60 122 72 L138 124 L124 124 L110 72 C108 62 104 54 100 52 Z" fill="#000" fill-opacity=".12"/>${hl("M88 60 C84 70 80 86 70 116", .2, 2.4)}
<ellipse cx="100" cy="124" rx="38" ry="6" fill="url(#${x.id("cu")})"/>
<ellipse cx="100" cy="124.4" rx="34" ry="4.6" fill="${x.on ? x.url("fill") : "#3a1d0c"}" ${x.on ? `opacity="${x.op(1)}"` : 'opacity=".8"'}/>
<path d="M62 124 A38 6 0 0 0 138 124" fill="none" stroke="#c3c1ca" stroke-opacity=".5" stroke-width="1"/>`, 1.9), ex);
    } })),

     base(SH2({ id: "smoked", name: "Smoked bubble", colors: ["#ffa94d", WARM, SOFT, DAY, "#ff9fb6"], colors2: ["#3b302c", "#8a5a2a", "#4a4e58", "#3e5a48", "#5a3a4a"], colorLabel2: "Glass", glow: { x: .5, y: .56, r: 1 }, render(o) {
      const x = ctx(o);
      const ex = rg(x.id("sm"), [[0, H.shade(o.color2 || "#3b302c", .5), .3], [.55, o.color2 || "#3b302c", .55], [.85, H.shade(o.color2 || "#3b302c", -.45), .78], [1, H.shade(o.color2 || "#3b302c", -.7), .85]], .4, .38, .62);
      return svg(x, canopy(x, 100, 24, "chr") + sway(halo(x, 100, 114, 66, .4) + beam(x, 100, 148, 26, 40, .7) + cord(100, 15, 66) +
        `<rect x="92" y="64" width="16" height="10" rx="2" fill="${x.url("chr")}"/>` + bulb(x, 100, 108, 1.45, "globe") +
        `<ellipse cx="100" cy="114" rx="46" ry="42" fill="url(#${x.id("sm")})"/>${x.on ? `<ellipse cx="100" cy="112" rx="46" ry="42" fill="${x.url("halo")}" opacity="${x.op(.55)}"/>` : ""}
<ellipse cx="100" cy="114" rx="46" ry="42" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1"/>
${hl("M64 104 C66 88 78 76 94 73", .5, 3.4)}${hl("M132 136 C126 146 114 152 102 154", .16, 2)}<ellipse cx="80" cy="90" rx="4" ry="2.4" fill="#fff" fill-opacity=".65" transform="rotate(-30 80 90)"/>`, 2.9), ex);
    } })),

     base(SH2({ id: "ceramic", name: "Ceramic dome", colors: COLS, colors2: ["#93ad92", "#f2efe8", "#c47a5a", "#2b3c63", "#d4a83a", "#2a2b33"], glow: { x: .5, y: .58, r: 1.05 }, render(o) {
      const x = ctx(o), g = o.color2 || "#93ad92", P = "M100 64 C70 64 46 78 40 104 C39 110 42 112 48 112 L152 112 C158 112 161 110 160 104 C154 78 130 64 100 64 Z";
      const ex = lg(x.id("ce"), [[0, H.shade(g, -.45)], [.22, g], [.36, H.shade(g, .4)], [.6, g], [1, H.shade(g, -.5)]]);
      return svg(x, canopy(x, 100, 24, "wht") + sway(beam(x, 100, 114, 52, 32) + halo(x, 100, 116, 58, .4) +
        `<path d="M100 15 V58" stroke="#e8dcc4" stroke-width="2.4"/><path d="M100 15 V58" stroke="#a0896a" stroke-width="2.4" stroke-dasharray="1.4 1.4"/>
<rect x="94" y="56" width="12" height="10" rx="2.4" fill="url(#${x.id("ce")})"/><path d="${P}" fill="url(#${x.id("ce")})"/>
${hl("M56 100 C60 86 72 76 88 72", .6, 4)}<ellipse cx="66" cy="86" rx="3.4" ry="1.8" fill="#fff" fill-opacity=".8" transform="rotate(-36 66 86)"/>${hl("M130 76 C142 84 150 94 154 104", .12, 2)}
<ellipse cx="100" cy="112" rx="56" ry="6.6" fill="${H.shade(g, -.5)}"/>
<ellipse cx="100" cy="112.6" rx="52.5" ry="5.4" fill="${x.on ? x.url("fill") : "#ece6da"}" opacity="${x.on ? x.op(1) : ".55"}"/>
${x.on ? `<ellipse cx="100" cy="113.2" rx="16" ry="3.4" fill="#fff" opacity="${x.op(.9)}"/>` : ""}`, 3.3), ex);
    } })),

     base(SH2({ id: "beehive", name: "Beehive", colors: COLS3, colors2: OPAL2, colorLabel2: "Glass", glow: { x: .5, y: .5, r: 1.05 }, render(o) {
      const x = ctx(o), T = [[64, 20], [80, 32], [96, 38], [112, 36], [127, 26]];
      const g2 = o.color2 || OPAL2[0], ex = rg(x.id("bh"), [[0, "#ffffff"], [.6, H.mix("#dcd8e8", g2, .7)], [1, H.shade(H.mix("#9e99b3", g2, .6), -.1)]], .4, .3, .7) + rg(x.id("bho"), [[0, "#ffffff"], [.45, H.mix(x.hot, g2, .3)], [1, H.mix(x.c, g2, .35)]], .5, .4, .7);
      const tiers = T.map(([y, hw]) => `<ellipse cx="100" cy="${y}" rx="${hw}" ry="9" fill="url(#${x.id(x.on ? "bho" : "bh")})"/>
<ellipse cx="100" cy="${y}" rx="${hw}" ry="9" fill="url(#${x.id("sh")})" opacity="${x.on ? .45 : .8}"/>${hl(`M${100 - hw * .8} ${y - 3} C${100 - hw * .5} ${y - 7} ${100 - hw * .1} ${y - 8} ${100 + hw * .1} ${y - 8}`, x.on ? .4 : .6, 1.6)}`).join("");
      return svg(x, canopy(x, 100, 24, "brs") + sway(halo(x, 100, 96, 80, .55) + beam(x, 100, 134, 22, 44) + cord(100, 15, 54) +
        `<rect x="92" y="51" width="16" height="6" rx="2" fill="${x.url("brs")}"/>${tiers}
${T.slice(1).map(([y, hw], i) => `<path d="M${100 - Math.min(hw, T[i][1]) * .96} ${y - 8} Q100 ${y - 5} ${100 + Math.min(hw, T[i][1]) * .96} ${y - 8}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`).join("")}
<ellipse cx="100" cy="134" rx="13" ry="2.6" fill="${x.on ? "#fff" : "#4a4560"}" opacity="${x.on ? x.op(.95) : 1}"/>`, 4.4), ex);
    } })),

     base(SH2({ id: "box", name: "Lantern box", colors: COLS2, colors2: ["#2a2b33", "#c99a48", "#ecebf0", "#5a4636", "#3e5a48"], colorLabel2: "Frame", cast: "around", glow: { x: .5, y: .55, r: 1 }, render(o) {
      const x = ctx(o); let ch = "";
      for (let y = 14, i = 0; y < 52; y += 5.4, i++) ch += i % 2 ? `<ellipse cx="100" cy="${f(y)}" rx="1" ry="3.4" fill="none" stroke="#1a1a20" stroke-width="1.6"/>` : `<ellipse cx="100" cy="${f(y)}" rx="2.6" ry="3.4" fill="none" stroke="#2a2a33" stroke-width="1.4"/><path d="M98 ${f(y - 2)} V${f(y + 2)}" stroke="#9aa0b4" stroke-opacity=".4" stroke-width=".5"/>`;
      const gl = x.on ? H.rgba(x.c, (.14 + .2 * x.L).toFixed(2)) : "rgba(220,230,255,.07)";
      return svg(x, canopy(x, 100, 22, "blk") + sway(halo(x, 100, 110, 76, .5) + beam(x, 100, 146, 28, 34, .6) + ch +
        `<circle cx="100" cy="55" r="3.4" fill="none" stroke="#2a2a33" stroke-width="2"/>
<rect x="76" y="82" width="48" height="56" fill="${gl}"/><path d="M128 82 L138 76 L138 134 L128 140 Z" fill="${gl}"/>` + bulb(x, 100, 108, 1.1, "pear", true) +
        `<rect x="95" y="132" width="10" height="7" rx="1" fill="#efeaff" opacity=".85"/>
<path d="M78 84 L94 84 L80 104 Z" fill="#fff" fill-opacity=".1"/><path d="M129 84 L137 79 L137 92 L129 98 Z" fill="#fff" fill-opacity=".08"/>
<path d="M72 80 H128 V140 H72 Z M76 84 V136 H124 V84 Z" fill-rule="evenodd" fill="${x.url("s2")}"/><path d="M128 80 L140 73 L140 134 L128 140 Z M130 82 V137 L137 133 V78 Z" fill-rule="evenodd" fill="#15151b"/>
<path d="M100 58 L70 77 L130 77 Z" fill="${x.url("s2")}"/><path d="M100 58 L130 77 L142 70 Z" fill="#0d0d12"/>
<rect x="68" y="76" width="62" height="5" rx="1" fill="${x.url("s2")}"/><path d="M130 76 L143 69 L143 74 L130 81 Z" fill="#101016"/>
<rect x="68" y="139" width="62" height="6" rx="1" fill="${x.url("s2")}"/><path d="M130 139 L143 132 L143 138 L130 145 Z" fill="#101016"/>
<path d="M92 145 L108 145 L104 151 L96 151 Z" fill="${x.url("s2")}"/>${hl("M73 81 V139", .22, 1)}${hl("M71 76.6 L100 59", .2, 1)}`, 1.4), s2(x, o.color2 || "#2a2b33", "metal"));
    } })),

     base(SH2({ id: "island", name: "Island trio", colors: COLS, colors2: ["#2a2b33", "#ecebf0", "#2b3c63", "#2f4a3c", "#b8774f"], glow: { x: .5, y: .54, r: 1.35 }, render(o) {
      const x = ctx(o);
      const dome = (cx, d) => sway(beam(x, cx, 98, 20, 18, .8) + halo(x, cx, 100, 34, .4) + cord(cx, 12, 66) +
        `<rect x="${cx - 4.5}" y="64" width="9" height="8" rx="1.6" fill="${x.url("brs")}"/>
<path d="M${cx} 70 C${cx - 14} 70 ${cx - 20} 82 ${cx - 22} 97 L${cx + 22} 97 C${cx + 20} 82 ${cx + 14} 70 ${cx} 70 Z" fill="${x.url("s2")}"/>
${hl(`M${cx - 16} 90 C${cx - 14} 80 ${cx - 8} 74 ${cx - 2} 72`, .24, 2)}<ellipse cx="${cx}" cy="97" rx="22" ry="3.8" fill="${x.url("brs")}"/>
<ellipse cx="${cx}" cy="97.4" rx="19.5" ry="2.9" fill="${x.on ? x.url("fill") : "#6e4a17"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>`, d);
      return svg(x, `<rect x="26" y="2" width="148" height="5" rx="1.8" fill="${x.url("blk")}"/><path d="M26 7 H174 L172 11 H28 Z" fill="#0c0c11"/><path d="M27 7 H173" stroke="${x.url("brs")}" stroke-width="1"/>` +
        dome(52, 0) + dome(100, 1.8) + dome(148, 3.6), s2(x, o.color2 || "#2a2b33", "paint"));
    } })),

     base(SH2({ id: "artichoke", name: "Artichoke", colors: COLS2, colors2: ["#c27a45", "#c99a48", "#d6d9de", "#2a2b33", "#ecebf0"], colorLabel2: "Leaves", glow: { x: .5, y: .52, r: 1.1 }, render(o) {
      const x = ctx(o), rows = [[63, 15], [80, 30], [97, 40], [114, 38], [130, 24]];
      const leaf = "M0 -10 C9 -8 10.5 4 0 12 C-10.5 4 -9 -8 0 -10 Z";
      const a2 = o.color2 || "#c27a45", ex = lg(x.id("cp"), [[0, H.shade(a2, .5)], [.5, a2], [1, H.shade(a2, -.5)]], 1);
      let lv = "";
      for (let r = rows.length - 1; r >= 0; r--) {
        const [y, hw] = rows[r], n = Math.max(3, Math.round(hw / 11) * 2 + 1), off = r % 2 ? .5 : 0, list = [];
        for (let j = 0; j < n; j++) { const t = -1 + 2 * (j + .5 + off * .5) / (n + off * .5); if (Math.abs(t) > .99) continue; list.push(t); }
        list.sort((a, b) => Math.abs(b) - Math.abs(a)).forEach((t) => {
          const th = Math.asin(Math.max(-1, Math.min(1, t))), cs = Math.cos(th), lx = 100 + hw * t, sc = 1.25 + hw / 140;
          lv += `<g transform="translate(${f(lx)} ${y}) scale(${f(Math.max(.32, cs) * sc)} ${f(sc)})"><path d="${leaf}" fill="url(#${x.id("cp")})"/><path d="${leaf}" fill="#000" fill-opacity="${f(.45 * (1 - cs))}"/>
${x.on ? `<path d="M-5.4 4.4 C-3 9.6 3 9.6 5.4 4.4" fill="none" stroke="${x.hot}" stroke-opacity="${x.op(.6)}" stroke-width="1.1"/>` : `<path d="M-5.4 4.4 C-3 9.6 3 9.6 5.4 4.4" fill="none" stroke="#2a1408" stroke-opacity=".45" stroke-width=".8"/>`}
<path d="M-2 -6 C-4 -2 -4 2 -2 5" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/></g>`; });
      }
      return svg(x, canopy(x, 100, 24, "brs") + sway(halo(x, 100, 100, 80, .5) + beam(x, 100, 142, 18, 42) + cord(100, 15, 50) +
        `<ellipse cx="100" cy="96" rx="40" ry="46" fill="${x.on ? x.url("fill") : "#24140c"}" ${x.on ? `opacity="${x.op(.9)}"` : ""}/>
<rect x="95" y="48" width="10" height="8" rx="2" fill="${x.url("brs")}"/>${lv}`, 2.1), ex);
    } })),
  ];

  (window.HDA = window.HDA || []).push({
    id: "pendant",
    tab: "Pendant lights",
    group: "Lights",
    kind: "light",
    intro: "Twenty pendants people actually hang: glass, metal, woven and paper shades on a canopy and cord. Lit shades glow in the light color and throw a cone of light down.",
    
    css: `.hda-pendant-sway{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-pendant-sway{animation:hda-pendant-sway 7.5s ease-in-out infinite}
.hda-anim .hda-pendant-fil{animation:hda-pendant-fil 3.4s ease-in-out infinite}
@keyframes hda-pendant-sway{0%,100%{transform:rotate(-.7deg)}50%{transform:rotate(.7deg)}}
@keyframes hda-pendant-fil{0%,100%{opacity:1}45%{opacity:.86}55%{opacity:.95}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-pendant-sway,.hda-anim .hda-pendant-fil{animation:none}}`,
    icons,
  });
})();
