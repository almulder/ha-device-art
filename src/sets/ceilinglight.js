(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const J = 74;
  const CEIL = `M8 8 H192 L172 ${J} H28 Z`;

  function ctx(o) {
    const c = o.color || "#ffc477", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => Math.min(1, k * L).toFixed(2) };
  }
  const stops = (s) => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, s, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${stops(s)}</linearGradient>`;
  const rg = (id, s, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(s)}</radialGradient>`;

  function defs(x, extra) {
    const { c, id, hot } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .8], [.45, c, .28], [1, c, 0]])}
${lg(id("cone"), [[0, c, .55], [.45, c, .18], [1, c, 0]], 1)}
${rg(id("pool"), [[0, c, .5], [1, c, 0]])}
${rg(id("cg"), [[0, hot, 1], [.3, c, .62], [.65, c, .2], [1, c, 0]])}
${lg(id("ww"), [[0, c, .32], [1, c, 0]], 1)}
${rg(id("fill"), [[0, "#ffffff", .98], [.4, hot, 1], [1, c, .9]], .5, .55, .65)}
${rg(id("frost"), [[0, "#f7f5fb"], [.55, "#d6d2e0"], [1, "#8d899e"]], .42, .35, .75)}
${rg(id("gl"), [[0, "#ffffff", .5], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .22]], .34, .28, .75)}
${lg(id("ceil"), [[0, "#dcd9e8", .27], [1, "#a8a4bc", .12]], 1)}
${lg(id("bw"), [[0, "#ffffff", .06], [1, "#ffffff", 0]], 1)}
${lg(id("sw"), [[0, "#ffffff", .03], [1, "#ffffff", 0]], 1)}
${lg(id("cn"), [[0, "#ffffff", .22], [1, "#ffffff", 0]], 1)}
${lg(id("blk"), [[0, "#0f0f15"], [.28, "#393a47"], [.42, "#565869"], [.72, "#22232c"], [1, "#0b0b10"]])}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("nik"), [[0, "#5d606b"], [.2, "#c9ccd6"], [.4, "#9a9eab"], [.6, "#e6e8ef"], [.85, "#7c808d"], [1, "#4a4d57"]])}
${lg(id("wht"), [[0, "#a9a6b8"], [.25, "#eceaf3"], [.5, "#ffffff"], [.8, "#dcd9e6"], [1, "#9693a8"]])}
${lg(id("sh"), [[0, "#000", .42], [.3, "#000", 0], [.62, "#000", .06], [1, "#000", .5]])}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;
  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;

  function room0(x, gx, gy, gr, gk, wall, over) {
    let s = `<clipPath id="${x.id("cl")}"><path d="${CEIL}"/></clipPath>
<path d="M8 8 L28 ${J} V194 H8 Z" fill="${x.url("sw")}"/><path d="M192 8 L172 ${J} V194 H192 Z" fill="${x.url("sw")}"/>
<rect x="28" y="${J}" width="144" height="${194 - J}" fill="${x.url("bw")}"/>
<rect x="27.5" y="${J}" width="1" height="112" fill="${x.url("cn")}"/><rect x="171.5" y="${J}" width="1" height="112" fill="${x.url("cn")}"/>
<path d="${CEIL}" fill="${x.url("ceil")}"/>${over || ""}`;
    if (x.on) s += `<g clip-path="url(#${x.id("cl")})"><path d="${CEIL}" fill="${x.c}" opacity="${x.op(.11)}"/><ellipse cx="${gx}" cy="${gy}" rx="${gr}" ry="${f(gr * .42)}" fill="${x.url("cg")}" opacity="${x.op(gk)}"/></g>
<rect x="28" y="${J + 3}" width="144" height="74" fill="${x.url("ww")}" opacity="${x.op(wall == null ? .5 : wall)}"/>`;
    s += `<path d="M28 ${J} H172" stroke="#fff" stroke-opacity=".3"/><rect x="28" y="${J}" width="144" height="3" fill="#000" fill-opacity=".2"/>
<path d="M8 8 L28 ${J} M192 8 L172 ${J}" stroke="#fff" stroke-opacity=".1"/><path d="M8 8.4 H192" stroke="#fff" stroke-opacity=".14"/>`;
    return s;
  }
  function beam(x, cx, y, hw, sp, k) {
    if (!x.on) return ""; k = k || 1; const Y = 192;
    return `<path d="M${f(cx - hw - 3)} ${y} L${f(cx - hw - sp * 1.3)} ${Y} L${f(cx + hw + sp * 1.3)} ${Y} L${f(cx + hw + 3)} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.34 * k)}"/>
<path d="M${f(cx - hw)} ${y} L${f(cx - hw - sp)} ${Y} L${f(cx + hw + sp)} ${Y} L${f(cx + hw)} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.5 * k)}"/>
<ellipse cx="${f(cx)}" cy="${Y - 4}" rx="${f(hw + sp + 10)}" ry="6" fill="${x.url("pool")}" opacity="${x.op(.75 * k)}"/>`;
  }
  function aim(x, fx, fy, nx, ny, gx, hw, k) {
    if (!x.on) return ""; k = k || 1; const Y = 192;
    const p = (w, a) => `<path d="M${f(fx - nx)} ${f(fy - ny)} L${f(fx + nx)} ${f(fy + ny)} L${f(gx + w)} ${Y} L${f(gx - w)} ${Y} Z" fill="${x.url("cone")}" opacity="${x.op(a * k)}"/>`;
    return p(hw * 1.25, .3) + p(hw * .8, .45) + `<ellipse cx="${f(gx)}" cy="${Y - 4}" rx="${f(hw + 8)}" ry="6" fill="${x.url("pool")}" opacity="${x.op(.7 * k)}"/>`;
  }
  function can(x, cx, cy, s, i) {
    const rx = 40 * s, ry = 13.5 * s, cid = x.id("hc" + i);
    let r = `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(46 * s)}" ry="${f(15.8 * s)}" fill="${x.url("wht")}"/>
<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="#0c0b11"/>
<clipPath id="${cid}"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"/></clipPath><g clip-path="url(#${cid})">`;
    for (let k = 0; k < 6; k++) {
      const t = k / 6, col = x.on ? H.mix("#1c1b23", x.c, (.1 + .42 * t) * x.L) : (k % 2 ? "#1f1e26" : "#2b2a34");
      r += `<ellipse cx="${f(cx)}" cy="${f(cy - 7.5 * s * t)}" rx="${f(rx - 15 * s * t)}" ry="${f(ry - 5 * s * t)}" fill="${col}" stroke="#000" stroke-opacity=".4" stroke-width="${f(.7 * s)}"/>`;
    }
    const ly = cy - 7.5 * s, lrx = 25 * s, lry = 8.5 * s;
    r += `<ellipse cx="${f(cx)}" cy="${f(ly)}" rx="${f(lrx)}" ry="${f(lry)}" fill="${x.on ? x.url("fill") : x.url("frost")}" opacity="${x.on ? 1 : .5}"/>`;
    if (x.on) r += `<ellipse cx="${f(cx)}" cy="${f(ly + s)}" rx="${f(lrx * .55)}" ry="${f(lry * .5)}" fill="#fff" opacity="${x.op(.95)}"/>`;
    r += `</g><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="${x.on ? x.c : "#000"}" stroke-opacity="${x.on ? x.op(.6) : .45}" stroke-width="${f(1.2 * s)}"/>
<path d="M${f(cx - 44 * s)} ${f(cy)} A${f(44 * s)} ${f(15.1 * s)} 0 0 1 ${f(cx)} ${f(cy - 15.1 * s)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${f(1.1 * s)}"/>`;
    if (x.on) r += `<ellipse cx="${f(cx)}" cy="${f(ly + 2 * s)}" rx="${f(34 * s)}" ry="${f(16 * s)}" fill="${x.url("halo")}" opacity="${x.op(.55)}"/>`;
    return r;
  }
  function head(x, px, py, s, a) {
    const ra = a * Math.PI / 180, sn = Math.sin(ra), cs = Math.cos(ra);
    const fx = px - 26 * s * sn, fy = py + 11 * s + 26 * s * cs, tt = (192 - fy) / cs;
    const b = aim(x, fx, fy, 7 * s * cs, 7 * s * sn, fx - sn * tt, 8 * s + tt * .2, .55);
    const h = `<g transform="translate(${f(px)} ${f(py)}) scale(${f(s)})"><rect x="-5" y="-2" width="10" height="7" rx="1.6" fill="${x.url("blk")}"/><rect x="-1.4" y="5" width="2.8" height="6" fill="${x.url("nik")}"/>
<g transform="rotate(${a} 0 11)"><rect x="-9" y="11" width="18" height="26" rx="4" fill="${x.url("blk")}"/><ellipse cx="0" cy="12" rx="9" ry="3" fill="#2c2d38"/>
<path d="M-5.5 14 V34" stroke="#fff" stroke-opacity=".22" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="0" cy="37" rx="9" ry="3.4" fill="#0b0b10"/>
<ellipse cx="0" cy="37" rx="6.4" ry="2.4" fill="${x.on ? x.url("fill") : "#4a4a58"}"/>${x.on ? `<circle cx="0" cy="38" r="11" fill="${x.url("halo")}" opacity="${x.op(.8)}"/>` : ""}</g></g>`;
    return [h, b];
  }
  const bez = (p, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]); };
  const spark = (cx, cy, r, cls, d, a) => `<path class="${cls}" style="animation-delay:-${f(d)}s" d="M${f(cx)} ${f(cy - r)} L${f(cx + r * .2)} ${f(cy - r * .2)} L${f(cx + r)} ${f(cy)} L${f(cx + r * .2)} ${f(cy + r * .2)} L${f(cx)} ${f(cy + r)} L${f(cx - r * .2)} ${f(cy + r * .2)} L${f(cx - r)} ${f(cy)} L${f(cx - r * .2)} ${f(cy - r * .2)} Z" fill="#fff" opacity="${a}"/>`;

  const WARM = "#ffc477", SOFT = "#ffe2b8", DAY = "#eef4ff";
  const C1 = [SOFT, WARM, DAY, "#ff9fb6", "#8fd0ff"];
  const C2 = [WARM, SOFT, DAY, "#ffa94d", "#b9a6ff"];
  const C3 = [DAY, SOFT, WARM, "#9ef0c4", "#8fd0ff"];
  const RGB = ["#ff3d9a", "#7a5cff", "#18d8ff", "#3dffa0", WARM, DAY];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "down" }, o);
  // (multi-function) parts: o.parts holds only the parts the owner ticked; a part left out follows the one device as a
  // Device Image (no o.mf, as today) and stays off, never animated, as a Multi-Function Image (o.mf). A part's level is
  // o.plevel[id], a light's color o.pcolor[id], a stage part's value o.pval[id] (one of its stage ids; left out = none).
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    on: (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on),
    lv: (o, k) => (o.plevel && o.plevel[k] != null && isFinite(+o.plevel[k]) ? +o.plevel[k] : o.level),
    col: (o, k, d) => (o.pcolor && /^#[0-9a-fA-F]{6}$/.test(o.pcolor[k] || "") ? o.pcolor[k] : d),
    st: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" ? String(o.pval[k]) : null),
    // the drawing as one part: on = that part, level = its level
    as: (o, k) => Object.assign({}, o, { on: MF.on(o, k), level: MF.lv(o, k) }),
  };
  // a light part: on, level and color (o.pcolor[id], else the drawing's color)
  const lit = (o, k) => Object.assign(MF.as(o, k), { color: MF.col(o, k, o.color) });

  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const room = (...a) => BG(room0(...a));
  const icons = [
     base({ id: "dome", name: "Frosted dome", colors: C1, glow: { x: .5, y: .3, r: 1.1 }, render(o) {
      const x = ctx(o), D = "M50 36 A50 16.5 0 0 1 150 36 C150 64 128 84 100 84 C72 84 50 64 50 36 Z";
      return svg(x, room(x, 100, 36, 98, .85) + beam(x, 100, 80, 34, 40, .8) +
        `<ellipse cx="100" cy="36" rx="53" ry="17.6" fill="${x.url("nik")}"/><ellipse cx="100" cy="36" rx="50.6" ry="16.8" fill="none" stroke="#000" stroke-opacity=".35"/>
<path d="${D}" fill="${x.on ? x.url("fill") : x.url("frost")}"/><path d="${D}" fill="${x.url("sh")}" opacity="${x.on ? .22 : .5}"/>
${x.on ? `<ellipse cx="100" cy="64" rx="28" ry="11" fill="#fff" opacity="${x.op(.5)}"/>` : ""}
<path d="M55 50 C68 66 132 66 145 50" fill="none" stroke="#fff" stroke-opacity="${x.on ? .45 : .5}" stroke-width="1.3" stroke-dasharray="1.6 2.6"/>
<path d="M60 58 C74 72 126 72 140 58" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="1"/>
${hl("M58 44 C60 60 70 72 82 78", x.on ? .3 : .65, 3)}
<path d="${D}" fill="none" stroke="${x.on ? x.c : "#fff"}" stroke-opacity="${x.on ? x.op(.7) : .3}" stroke-width="1"/>
<ellipse cx="100" cy="84" rx="7" ry="2.4" fill="${x.url("nik")}"/><circle cx="100" cy="87.6" r="3.9" fill="${x.url("nik")}"/><circle cx="98.7" cy="86.3" r="1.2" fill="#fff" fill-opacity=".85"/>`);
    } }),

     base({ id: "drum", name: "Fabric drum", colors: C2, colorLabel: "Light", glow: { x: .5, y: .26, r: 1.1 }, render(o) {
      const x = ctx(o), B = "M46 28 A54 15 0 0 1 154 28 L154 56 A54 15 0 0 0 46 56 Z", ln = "#e8dcc4", lc = H.mix(ln, x.c, .55);
      const ex = lg(x.id("fab"), [[0, "#6a5f4f"], [.28, "#c5b9a2"], [.5, "#e2d7c2"], [.75, "#b3a790"], [1, "#5e5446"]]) +
        lg(x.id("fabL"), [[0, H.shade(lc, -.38)], [.28, lc], [.5, H.mix(lc, "#ffffff", .55)], [.75, lc], [1, H.shade(lc, -.42)]]) +
        `<clipPath id="${x.id("bc")}"><path d="${B}"/></clipPath>`;
      let tx = ""; for (let i = 0; i < 41; i++) tx += `M${f(47 + i * 2.65)} 10 V74 `;
      return svg(x, room(x, 100, 30, 96, .8) + beam(x, 100, 64, 46, 34, .85) +
        `<path d="${B}" fill="${x.url("fab")}"/>${x.on ? `<path d="${B}" fill="${x.url("fabL")}" opacity="${x.op(1)}"/>` : ""}
<g clip-path="url(#${x.id("bc")})"><path d="${tx}" stroke="#000" stroke-opacity=".09" stroke-width=".55"/>
<path d="M46 34 A54 15 0 0 1 154 34 M46 40 A54 15 0 0 1 154 40 M46 46 A54 15 0 0 1 154 46 M46 52 A54 15 0 0 1 154 52" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width=".8"/>
<path d="M52 18 V60" stroke="#fff" stroke-opacity=".18" stroke-width="5"/></g>
<path d="M46 28 A54 15 0 0 1 154 28" fill="none" stroke="${x.url("nik")}" stroke-width="1.8"/>
<ellipse cx="100" cy="56" rx="54" ry="15" fill="${x.on ? x.url("fill") : x.url("frost")}" opacity="${x.on ? 1 : .85}"/>
${x.on ? `<ellipse cx="100" cy="57" rx="30" ry="8" fill="#fff" opacity="${x.op(.6)}"/>` : `<ellipse cx="100" cy="56" rx="54" ry="15" fill="${x.url("sh")}" opacity=".45"/>`}
<ellipse cx="100" cy="56" rx="54" ry="15" fill="none" stroke="#3a352c" stroke-width="1.6"/><ellipse cx="100" cy="56" rx="50" ry="13.6" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
<circle cx="100" cy="57" r="3" fill="${x.url("nik")}"/>`, ex);
    } }),

     base({ id: "bowl", name: "Alabaster bowl", colors: C2, glow: { x: .5, y: .38, r: 1.1 }, render(o) {
      const x = ctx(o), B = "M52 58 A48 14 0 0 1 148 58 C148 86 126 106 100 106 C74 106 52 86 52 58 Z";
      const ex = rg(x.id("ala"), [[0, "#fbf6ee"], [.6, "#e4d9c8"], [1, "#9d8f7c"]], .42, .3, .8) + `<clipPath id="${x.id("bw2")}"><path d="${B}"/></clipPath>`;
      const veins = "M58 72 C72 80 82 70 96 84 C106 92 120 84 136 96 M70 94 C84 88 94 100 112 97 M118 66 C128 74 138 70 146 80 M64 62 C70 68 78 66 84 74";
      return svg(x, room(x, 100, 24, 92, 1) + beam(x, 100, 102, 28, 44, .8) +
        `<ellipse cx="100" cy="22" rx="19" ry="6.4" fill="${x.url("brs")}"/><ellipse cx="100" cy="24.6" rx="14" ry="4.4" fill="#5a3c12" opacity=".6"/>
<rect x="97.6" y="23" width="4.8" height="21" fill="${x.url("brs")}"/><path d="M100 44 L56 55 M100 44 L144 55" stroke="${x.url("brs")}" stroke-width="2.2" stroke-linecap="round"/>
<path d="M100 44 L56 55 M100 44 L144 55" stroke="#000" stroke-opacity=".25" stroke-width=".6" transform="translate(0 1)"/>
<ellipse cx="100" cy="44" rx="6" ry="2.4" fill="${x.url("brs")}"/>
<path d="${B}" fill="url(#${x.id("ala")})"/>${x.on ? `<path d="${B}" fill="${x.url("fill")}" opacity="${x.op(.92)}"/>` : `<path d="${B}" fill="${x.url("sh")}" opacity=".45"/>`}
<g clip-path="url(#${x.id("bw2")})"><path d="${veins}" fill="none" stroke="${x.on ? H.shade(x.c, -.45) : "#8d7356"}" stroke-opacity="${x.on ? .35 : .4}" stroke-width=".9"/>
<path d="M60 66 C64 84 76 98 92 104" fill="none" stroke="#fff" stroke-opacity="${x.on ? .25 : .6}" stroke-width="3.2" stroke-linecap="round"/></g>
<path d="M52 58 A48 14 0 0 1 148 58" fill="none" stroke="${x.url("brs")}" stroke-width="3.6"/><path d="M52 59.6 A48 14 0 0 1 148 59.6" fill="none" stroke="#3a2608" stroke-opacity=".5" stroke-width=".8"/>
<ellipse cx="100" cy="106" rx="6" ry="2.2" fill="${x.url("brs")}"/><path d="M96 106 C96 112 104 112 104 106" fill="${x.url("brs")}"/><circle cx="98.6" cy="107.6" r="1" fill="#fff" fill-opacity=".8"/>`, ex);
    } }),

     base({ id: "school", name: "Schoolhouse", colors: C1, glow: { x: .5, y: .44, r: 1 }, render(o) {
      const x = ctx(o), S = "M84 37 C84 48 66 54 62 72 C59 84 58 92 56 98 A44 12 0 0 0 144 98 C142 92 141 84 138 72 C134 54 116 48 116 37 Z";
      const ex = rg(x.id("milk"), [[0, "#ffffff"], [.55, "#eeebf3"], [1, "#a9a5b8"]], .4, .35, .75) +
        rg(x.id("milkL"), [[0, "#ffffff"], [.5, x.hot], [1, x.c]], .5, .75, .7);
      return svg(x, room(x, 100, 26, 80, .5) + beam(x, 100, 104, 40, 36) +
        `<ellipse cx="100" cy="20" rx="20" ry="6.4" fill="${x.url("blk")}"/><rect x="86" y="20" width="28" height="17" fill="${x.url("blk")}"/>
<rect x="86" y="30" width="28" height="2.4" fill="${x.url("brs")}"/><path d="M90 22 V36" stroke="#fff" stroke-opacity=".2" stroke-width="1.4"/>
<path d="${S}" fill="url(#${x.id("milk")})"/>${x.on ? `<path d="${S}" fill="url(#${x.id("milkL")})" opacity="${x.op(.9)}"/>` : ""}
<path d="${S}" fill="${x.url("sh")}" opacity="${x.on ? .25 : .45}"/>
<path d="M84.6 44 C92 46.5 108 46.5 115.4 44" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="1"/>
${hl("M74 58 C67 68 64 80 62 92", x.on ? .35 : .7, 2.8)}${hl("M128 60 C133 70 135 80 137 88", .18, 1.6)}
<ellipse cx="100" cy="98" rx="44" ry="12" fill="${x.on ? x.url("fill") : "#2a2732"}"/>
${x.on ? `<circle cx="100" cy="97" r="11" fill="#fff" opacity="${x.op(.95)}"/><circle cx="100" cy="98" r="26" fill="${x.url("halo")}" opacity="${x.op(.8)}"/>`
          : `<path d="M90 92 C90 100 110 100 110 92 C110 88 90 88 90 92 Z" fill="#fff" fill-opacity=".12" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`}
<ellipse cx="100" cy="98" rx="44" ry="12" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.6"/><ellipse cx="100" cy="98" rx="42" ry="11" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>`, ex);
    } }),

     base({ id: "wafer", name: "LED wafer", colors: C3, glow: { x: .5, y: .21, r: 1.2 }, render(o) {
      const x = ctx(o), B = "M40 36 A60 19 0 0 1 160 36 L160 41 A60 19 0 0 0 40 41 Z";
      const ex = rg(x.id("wf"), [[0, "#f6f4fa"], [.7, "#d9d6e2"], [1, "#a4a0b4"]], .45, .4, .7);
      return svg(x, room(x, 100, 40, 118, 1.05, .6) + beam(x, 100, 54, 52, 30, .75) +
        `<path d="${B}" fill="${x.url("wht")}"/><path d="M40 36 A60 19 0 0 1 160 36" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>
<ellipse cx="100" cy="41" rx="60" ry="19" fill="url(#${x.id("wf")})"/>
${x.on ? `<ellipse cx="100" cy="41" rx="60" ry="19" fill="${x.url("fill")}" opacity="${x.op(1)}"/><ellipse cx="100" cy="41" rx="57" ry="17.8" fill="none" stroke="#fff" stroke-opacity="${x.op(.9)}" stroke-width="2.2"/>
<ellipse cx="100" cy="41" rx="57" ry="17.8" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.8)}" stroke-width="5" opacity=".6"/>`
          : `<ellipse cx="100" cy="41" rx="56" ry="17.6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>${hl("M52 34 C62 28 78 25 94 24.5", .7, 2)}`}
<ellipse cx="100" cy="41" rx="60" ry="19" fill="none" stroke="#7d7990" stroke-opacity=".7" stroke-width="1"/>`, ex);
    } }),

     base({ id: "can", name: "Recessed can", colors: C1, glow: { x: .5, y: .2, r: .9 }, render(o) {
      const x = ctx(o);
      return svg(x, room(x, 100, 40, 66, .45, .45) + beam(x, 100, 46, 30, 34, 1.1) + can(x, 100, 40, 1.18, 0));
    } }),

     base({ id: "cans", name: "Downlight row", colors: C2, glow: { x: .52, y: .2, r: 1.2 }, render(o) {
      const x = ctx(o), P = [[52, 24, .82], [106, 42, .64], [150, 58, .48]];
      let b = "", c = "";
      P.forEach(([cx, cy, s], i) => { b += beam(x, cx, cy + 6 * s, 26 * s, 26 * s, .75); c += can(x, cx, cy, s, i); });
      const g = x.on ? `<g clip-path="url(#${x.id("cl")})">${P.map(([cx, cy, s]) => `<ellipse cx="${cx}" cy="${cy}" rx="${f(60 * s)}" ry="${f(24 * s)}" fill="${x.url("cg")}" opacity="${x.op(.35)}"/>`).join("")}</g>` : "";
      return svg(x, room(x, 100, 40, 40, 0, .55) + g + b + c);
    } }),

     base({ id: "gimbal", name: "Gimbal spot", colors: C2, glow: { x: .44, y: .27, r: .95 }, render(o) {
      const x = ctx(o), a = 22, ra = a * Math.PI / 180, fx = 87, fy = 61, tt = (192 - fy) / Math.cos(ra);
      const ex = rg(x.id("ball"), [[0, "#ffffff"], [.45, "#dcdae6"], [.85, "#8b889c"], [1, "#55536a"]], .38, .3, .65) +
        `<clipPath id="${x.id("gc")}"><ellipse cx="100" cy="38" rx="31" ry="10.4"/><rect x="60" y="38" width="80" height="40"/></clipPath>`;
      return svg(x, room(x, 100, 38, 70, .45, .4) + aim(x, fx, fy, 10 * Math.cos(ra), 10 * Math.sin(ra), fx - Math.sin(ra) * tt, 12 + tt * .24, 1) +
        `<g transform="translate(100 38) scale(1.3) translate(-100 -38)"><ellipse cx="100" cy="38" rx="38" ry="12.8" fill="${x.url("wht")}"/><ellipse cx="100" cy="38" rx="31" ry="10.4" fill="#0c0b10"/>
<path d="M62 38 A38 12.8 0 0 1 100 25.2" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.1"/>
<g clip-path="url(#${x.id("gc")})"><circle cx="100" cy="44" r="23" fill="url(#${x.id("ball")})"/>
<path d="M78 38 C80 54 92 66 108 66" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/></g>
<g transform="rotate(${a} 90 54)"><ellipse cx="90" cy="54" rx="13" ry="9.6" fill="#1b1a22"/><ellipse cx="90" cy="54.6" rx="10.6" ry="7.6" fill="#33323e"/>
<ellipse cx="90" cy="55" rx="8.6" ry="6.2" fill="${x.on ? x.url("fill") : "#4c4b5a"}"/>${x.on ? `<ellipse cx="90" cy="55.4" rx="4" ry="2.8" fill="#fff" opacity="${x.op(1)}"/>` : `<ellipse cx="87" cy="52.6" rx="3" ry="1.6" fill="#fff" fill-opacity=".35"/>`}</g>
${x.on ? `<circle cx="90" cy="56" r="20" fill="${x.url("halo")}" opacity="${x.op(.75)}"/>` : ""}
<circle cx="88" cy="34" r="2.4" fill="#fff" fill-opacity=".8"/></g>`, ex);
    } }),

     base({ id: "track", name: "Track light", colors: C2, glow: { x: .5, y: .3, r: 1.2 }, render(o) {
      const x = ctx(o), A = [14, 20], B = [186, 52], T = [.12, .37, .62, .87], ANG = [20, 4, -10, -26];
      let hs = "", bs = "";
      T.forEach((t, i) => { const [h, b] = head(x, A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1]), 1.08 - .36 * t, ANG[i]); hs += h; bs += b; });
      const rail = `M${A[0]} ${A[1]} L${B[0]} ${B[1]}`;
      return svg(x, room(x, 100, 34, 100, .55) + bs +
        `<path d="${rail}" stroke="#000" stroke-opacity=".25" stroke-width="9" stroke-linecap="round" transform="translate(0 -2)"/>
<path d="${rail}" stroke="#16161c" stroke-width="6.4" stroke-linecap="round"/><path d="${rail}" stroke="#3c3d4a" stroke-width="2.6" transform="translate(0 -1.4)"/>
<path d="${rail}" stroke="#0a0a0e" stroke-width="1" transform="translate(0 1)"/><path d="${rail}" stroke="#fff" stroke-opacity=".3" stroke-width=".7" transform="translate(0 -2.6)"/>
<rect x="8" y="12" width="16" height="12" rx="2.6" fill="${x.url("blk")}" transform="rotate(10 16 18)"/><path d="M11 14 H21" stroke="#fff" stroke-opacity=".22" transform="rotate(10 16 18)"/>` + hs);
    } }),

     base({ id: "monorail", name: "Monorail", colors: C1, glow: { x: .5, y: .3, r: 1.2 }, render(o) {
      const x = ctx(o), S1 = [[14, 40], [44, 22], [70, 22], [100, 34]], S2 = [[100, 34], [130, 46], [156, 46], [186, 28]];
      const rail = "M14 40 C44 22 70 22 100 34 C130 46 156 46 186 28";
      const pts = [bez(S1, .22), bez(S1, .72), bez(S2, .2), bez(S2, .56), bez(S2, .9)], L = [14, 22, 14, 22, 14];
      let st = "", hd = "", bs = "";
      [[14, 40], [100, 34], [186, 28]].forEach(([px, py]) => { st += `<ellipse cx="${px}" cy="${py - 15}" rx="5" ry="1.8" fill="${x.url("chr")}"/><rect x="${px - .9}" y="${py - 15}" width="1.8" height="15" fill="${x.url("chr")}"/>`; });
      pts.forEach(([px, py], i) => {
        const hy = py + L[i], G = "M-2.5 0 C-3 4 -9 6 -9 13 C-9 16 9 16 9 13 C9 6 3 4 2.5 0 Z";
        bs += beam(x, px, hy + 15, 8, 14, .45);
        hd += `<path d="M${f(px)} ${f(py)} V${f(hy - 3)}" stroke="#c9ccd6" stroke-width=".9"/><g transform="translate(${f(px)} ${f(hy)})"><rect x="-2.6" y="-4" width="5.2" height="4.6" rx="1" fill="${x.url("chr")}"/>
<path d="${G}" fill="${x.on ? x.c : "#ffffff"}" fill-opacity="${x.on ? x.op(.55) : .12}"/><path d="${G}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".55" stroke-width=".6"/>
<ellipse cx="0" cy="13.8" rx="9" ry="2.4" fill="${x.on ? x.url("fill") : "#3b3946"}"/>${x.on ? `<circle cx="0" cy="12" r="12" fill="${x.url("halo")}" opacity="${x.op(.75)}"/>` : ""}
<path d="M-5.4 7 C-6.4 9 -6.6 11 -6.4 12.4" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".9" stroke-linecap="round"/></g>`;
      });
      return svg(x, room(x, 100, 34, 100, .6) + bs + st +
        `<path d="${rail}" fill="none" stroke="#1a1b22" stroke-width="4.6" stroke-linecap="round"/><path d="${rail}" fill="none" stroke="${x.url("chr")}" stroke-width="2.8" stroke-linecap="round"/>
<path d="${rail}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".6" transform="translate(0 -.8)"/>` + hd);
    } }),

     base({ id: "panel", name: "Office panel", colors: C3, cast: "around", glow: { x: .5, y: .2, r: 1.2 }, render(o) {
      const x = ctx(o), X = (x0, y) => 100 + (x0 - 100) * (311.6 - y) / 303.6;
      const cols = [8, 69.3, 130.7, 192], rows = [8, 30, 48, 62, J];
      const q = (a, b, y0, y1) => `M${f(X(a, y0))} ${y0} L${f(X(b, y0))} ${y0} L${f(X(b, y1))} ${y1} L${f(X(a, y1))} ${y1} Z`;
      const ex = `<pattern id="${x.id("tp")}" width="5" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#000" fill-opacity=".14"/><circle cx="3.6" cy="2.8" r=".4" fill="#fff" fill-opacity=".12"/></pattern>` +
        lg(x.id("pn"), [[0, "#e9e7f0"], [1, "#c4c1d2"]], 1) + rg(x.id("pnL"), [[0, "#ffffff"], [.6, x.hot], [1, H.mix(x.c, x.hot, .5)]], .5, .5, .7);
      let grid = "";
      cols.forEach((c) => { grid += `M${f(X(c, 8))} 8 L${f(X(c, J))} ${J} `; });
      rows.forEach((y) => { grid += `M${f(X(8, y))} ${y} L${f(X(192, y))} ${y} `; });
      const P = q(69.3, 130.7, 30, 48), Pi = q(72.5, 127.5, 31.4, 46.6);
      return svg(x, room(x, 100, 39, 108, .95, .55, `<path d="${CEIL}" fill="url(#${x.id("tp")})"/>`) + beam(x, 100, 48, 30, 46, .55) +
        `<path d="${grid}" stroke="#000" stroke-opacity=".25" stroke-width="2.2" transform="translate(0 .8)"/><path d="${grid}" stroke="#eceaf2" stroke-opacity=".55" stroke-width="1.5"/>
<path d="${P}" fill="${x.url("nik")}"/><path d="${Pi}" fill="${x.on ? `url(#${x.id("pnL")})` : `url(#${x.id("pn")})`}"/>
${x.on ? `<path d="${Pi}" fill="none" stroke="${x.c}" stroke-opacity="${x.op(.7)}" stroke-width="1.4"/>` : `<path d="M${f(X(74, 33))} 33 L${f(X(96, 33))} 33" stroke="#fff" stroke-opacity=".7"/>`}
<path d="${Pi}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".6"/>`, ex);
    } }),

     base({ id: "shop", name: "Shop light", colors: C3, glow: { x: .5, y: .28, r: 1.25 }, render(o) {
      const x = ctx(o);
      let ch = "";
      [54, 146].forEach((cx) => { ch += `<ellipse cx="${cx}" cy="20" rx="4" ry="1.6" fill="${x.url("chr")}"/>`;
        for (let i = 0; i < 7; i++) ch += i % 2 ? `<rect x="${cx - .6}" y="${f(21 + i * 3.3)}" width="1.2" height="4" rx=".6" fill="#b9bcc8"/>`
          : `<ellipse cx="${cx}" cy="${f(23 + i * 3.3)}" rx="1.5" ry="2.1" fill="none" stroke="#c9ccd6" stroke-width=".9"/>`; });
      const tube = (y) => `<rect x="25" y="${y}" width="150" height="4.6" rx="2.3" fill="${x.on ? x.hot : "#e4e2ea"}" opacity="${x.on ? 1 : .85}"/>
${x.on ? `<rect x="27" y="${y + 1.4}" width="146" height="1.6" rx=".8" fill="#fff" opacity="${x.op(1)}"/>` : `<rect x="27" y="${y + .8}" width="146" height="1" rx=".5" fill="#fff" opacity=".7"/>`}`;
      return svg(x, room(x, 100, 40, 92, .4, .55) + beam(x, 100, 62, 76, 20, .75) + ch +
        `<path d="M30 44 H170 L180 52 H20 Z" fill="${x.url("wht")}"/><path d="M30 44 H170" stroke="#fff" stroke-opacity=".8" stroke-width=".8"/>
<rect x="20" y="52" width="160" height="11" fill="${x.on ? H.mix("#9c98ac", x.c, .5) : "#8d899c"}"/>
${tube(52.8)}${tube(58)}
<rect x="18" y="51" width="6" height="12.4" rx="1.4" fill="#cfccd8"/><rect x="176" y="51" width="6" height="12.4" rx="1.4" fill="#cfccd8"/>
<path d="M20 63 H180" stroke="#000" stroke-opacity=".3"/>${x.on ? `<ellipse cx="100" cy="58" rx="86" ry="12" fill="${x.url("halo")}" opacity="${x.op(.6)}"/>` : ""}`);
    } }),

     base({ id: "ring", name: "RGB ring", colors: RGB, glow: { x: .5, y: .22, r: 1.25 }, render(o) {
      const x = ctx(o), B = "M42 32 A58 18.5 0 0 1 158 32 L158 44 A58 18.5 0 0 0 42 44 Z";
      const ex = rg(x.id("ctr"), [[0, "#ffffff"], [.6, H.mix(x.c, "#ffffff", .8)], [1, H.mix(x.c, "#ffffff", .58)]], .5, .5, .6) +
        rg(x.id("cof"), [[0, "#f4f2f8"], [.7, "#dedbe6"], [1, "#a7a3b6"]], .45, .4, .7);
      return svg(x, room(x, 100, 42, 116, 1.1, .6) + beam(x, 100, 58, 46, 32, .75) +
        `<path d="${B}" fill="${x.url("wht")}"/><path d="M42 32 A58 18.5 0 0 1 158 32" fill="none" stroke="#000" stroke-opacity=".25"/>
<ellipse cx="100" cy="44" rx="58" ry="18.5" fill="${x.on ? x.c : "#3a3846"}"/>
${x.on ? `<ellipse cx="100" cy="44" rx="52.5" ry="16.8" fill="none" stroke="${H.mix(x.c, "#fff", .55)}" stroke-opacity="${x.op(.9)}" stroke-width="1.6"/>
<ellipse class="hda-ceilinglight-chase" cx="100" cy="44" rx="52.5" ry="16.8" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="30 215"/>`
          : `<ellipse cx="100" cy="44" rx="52.5" ry="16.8" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>`}
<ellipse cx="100" cy="44.6" rx="46" ry="14.6" fill="${x.on ? `url(#${x.id("ctr")})` : `url(#${x.id("cof")})`}"/>
<ellipse cx="100" cy="44.6" rx="46" ry="14.6" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1"/>
${x.on ? "" : hl("M60 40 C68 34 82 31 96 30.6", .7, 1.8)}<circle cx="100" cy="56" r="1.5" fill="#22212a"/>
<ellipse cx="100" cy="44" rx="58" ry="18.5" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>`, ex);
    } }),

     // (parts) Light (the nebula wash, the lens and the room glow, in the light's color) and Stars (the laser star field)
     base({ id: "stars", name: "Star projector", colors: ["#8fb8ff", "#c79bff", "#7ef2d6", "#ffd27a", "#ff8fc8"], cast: "around", glow: { x: .5, y: .22, r: 1.3 },
      parts: [{ id: "light", name: "Nebula light" }, { id: "stars", name: "Stars" }], render(o) {
      const x = ctx(lit(o, "light")), xs = ctx(MF.as(o, "stars")), D = "M78 32 A22 7 0 0 1 122 32 C122 44 112 50 100 50 C88 50 78 44 78 32 Z";
      const n2 = H.mix(x.c, "#7a5cff", .5);
      const ex = rg(x.id("dg"), [[0, "#4a4466"], [.6, "#1d1a2c"], [1, "#09080f"]], .4, .35, .75) +
        rg(x.id("nb"), [[0, x.c, .55], [.5, x.c, .18], [1, x.c, 0]]) + rg(x.id("nb2"), [[0, n2, .5], [.5, n2, .16], [1, n2, 0]]);
      let sky = "";
      if (x.on || xs.on) {
        const r = rnd(29), lite = H.mix(xs.c, "#ffffff", .55);
        if (x.on) sky += `<g clip-path="url(#${x.id("cl")})"><g class="hda-ceilinglight-neb"><ellipse cx="56" cy="28" rx="52" ry="18" fill="url(#${x.id("nb")})" opacity="${x.op(.9)}"/>
<ellipse cx="146" cy="46" rx="48" ry="16" fill="url(#${x.id("nb2")})" opacity="${x.op(.9)}"/><ellipse cx="120" cy="16" rx="30" ry="9" fill="url(#${x.id("nb")})" opacity="${x.op(.6)}"/></g></g>`;
        if (xs.on) for (let i = 0; i < 90; i++) {
          const sx = 14 + r() * 172, sy = 10 + r() * 118, inC = sy < J ? (sx > 8 + (sy - 8) * .3 && sx < 192 - (sy - 8) * .3) : (sx > 30 && sx < 170);
          if (!inC || (Math.abs(sx - 100) < 34 && sy < 64)) continue;
          const far = sy > J ? .55 : 1, big = r() > .82, d = r() * 3;
          sky += big ? spark(sx, sy, 2.4 + r() * 1.6, "hda-ceilinglight-tw", d, xs.op(far))
            : `<circle class="hda-ceilinglight-tw" style="animation-delay:-${f(d)}s" cx="${f(sx)}" cy="${f(sy)}" r="${f(.5 + r() * 1)}" fill="${r() > .5 ? lite : "#ffffff"}" opacity="${xs.op(.9 * far)}"/>`;
        }
      }
      return svg(x, room(x, 100, 36, 70, .35, .3) + sky +
        `<g transform="translate(100 30) scale(1.45) translate(-100 -30)"><ellipse cx="100" cy="32" rx="24" ry="7.6" fill="${x.url("blk")}"/><path d="${D}" fill="url(#${x.id("dg")})"/>
<path d="${D}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>${hl("M83 36 C85 42 90 46 95 47.4", .45, 1.6)}
<ellipse cx="100" cy="44" rx="7.4" ry="3.2" fill="${x.url("chr")}"/><ellipse cx="100" cy="44.3" rx="5" ry="2.1" fill="${x.on ? x.url("fill") : "#14121c"}"/>
${x.on ? `<circle cx="100" cy="44" r="10" fill="${x.url("halo")}" opacity="${x.op(.9)}"/>` : `<circle cx="98.6" cy="43.6" r=".9" fill="#fff" fill-opacity=".7"/>`}</g>`, ex);
    } }),

     base({ id: "cove", name: "Cove tray", colors: ["#ffc477", "#eef4ff", "#7a5cff", "#18d8ff", "#ff6fb0"], cast: "around", glow: { x: .5, y: .18, r: 1.3 }, render(o) {
      const x = ctx(o), OP = "M38 18 H162 L152 62 H48 Z", TR = "M40 6 H160 L151 55 H49 Z";
      const ex = `<clipPath id="${x.id("oc")}"><path d="${OP}"/></clipPath>`;
      const glow = x.on ? `<path d="${TR}" fill="${x.c}" opacity="${x.op(.12)}"/>` + [[24, .16], [13, .28], [6, .5], [2, .9]].map(([w, a]) =>
        `<path d="${TR} ${OP}" fill="none" stroke="${w < 3 ? x.hot : x.c}" stroke-opacity="${x.op(a)}" stroke-width="${w}" stroke-linejoin="round"/>`).join("") : "";
      return svg(x, room(x, 100, 38, 120, .45, .7) + beam(x, 100, 62, 50, 26, .35) +
        `<path d="${OP}" fill="#14131b" fill-opacity=".6"/>${x.on ? `<path d="${OP}" fill="${x.c}" opacity="${x.op(.42)}"/>` : ""}
<g clip-path="url(#${x.id("oc")})"><path d="${TR}" fill="${x.url("ceil")}"/><path d="${TR}" fill="#fff" fill-opacity=".04"/>${glow}</g>
${x.on ? `<path d="M49 55 H151" stroke="${x.hot}" stroke-opacity="${x.op(1)}" stroke-width="1.6"/><path d="M49 55 H151" stroke="${x.c}" stroke-opacity="${x.op(.5)}" stroke-width="5"/>` : `<path d="M49 55 H151" stroke="#000" stroke-opacity=".3"/>`}
<path d="M48 62 H152" stroke="#fff" stroke-opacity=".45" stroke-width="1.1"/><path d="M38 18 L48 62 M162 18 L152 62" stroke="#fff" stroke-opacity=".22"/><path d="M38 18 H162" stroke="#000" stroke-opacity=".25"/>`, ex);
    } }),

     base({ id: "crystal", name: "Crystal flush", colors: [DAY, SOFT, WARM, "#b9a6ff", "#8fd0ff"], glow: { x: .5, y: .26, r: 1.1 }, render(o) {
      const x = ctx(o), rows = [[36, 46, 20], [48, 40, 18], [60, 31, 14]], DR = "M0 -7 L3.2 -2 L2.2 7 L0 10 L-2.2 7 L-3.2 -2 Z";
      const ex = lg(x.id("cry"), [[0, "#ffffff", .9], [.45, "#bfc8e6", .35], [.6, "#ffffff", .15], [1, "#ffffff", .75]]);
      const tint = x.on ? `<path d="${DR}" fill="${x.c}" opacity="${x.op(.55)}"/>` : "";
      const drop = (px, py, sc, a) => `<g transform="translate(${f(px)} ${f(py)}) scale(${f(sc)} 1)" opacity="${a}"><path d="${DR}" fill="url(#${x.id("cry")})" stroke="#fff" stroke-opacity=".55" stroke-width=".4"/>${tint}<path d="M0 -7 V10 M-3.2 -2 L0 1 L3.2 -2" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".35"/></g>`;
      let back = "", front = "";
      rows.forEach(([y, rx, n], ri) => { for (let j = 0; j < n; j++) {
        const th = 2 * Math.PI * (j + ri * .5) / n, px = 100 + rx * Math.cos(th), py = y + rx * .3 * Math.sin(th), sc = .55 + .45 * Math.abs(Math.sin(th)) + .1;
        const d = drop(px, py, sc, Math.sin(th) > 0 ? .7 : 1);
        if (Math.sin(th) > 0) back += d; else front += d; } });
      let caus = "", sp = "";
      if (x.on) { const r = rnd(7); for (let i = 0; i < 26; i++) { const th = r() * 6.283, rr = 52 + r() * 44, cx = 100 + rr * Math.cos(th), cy = 34 + rr * .4 * Math.sin(th);
        caus += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(.6 + r())}" fill="${r() > .5 ? x.hot : "#fff"}" opacity="${x.op(.7)}"/>`; }
        [[72, 40], [124, 36], [96, 50], [134, 54], [82, 60], [110, 64], [100, 74]].forEach(([sx, sy], i) => { sp += spark(sx, sy, 4.2, "hda-ceilinglight-sp", i * .37, ".95"); }); }
      return svg(x, room(x, 100, 30, 100, .7) + (x.on ? `<g clip-path="url(#${x.id("cl")})">${caus}</g>` : "") + beam(x, 100, 72, 30, 40, .8) +
        `<path d="M58 24 A42 13 0 0 1 142 24 L142 28 A42 13 0 0 0 58 28 Z" fill="${x.url("chr")}"/><ellipse cx="100" cy="28" rx="42" ry="13" fill="${x.url("chr")}"/>
<ellipse cx="100" cy="28" rx="36" ry="10.6" fill="#2a2c36" opacity=".55"/>
${x.on ? `<ellipse cx="100" cy="48" rx="42" ry="24" fill="${x.url("halo")}" opacity="${x.op(1)}"/><ellipse cx="100" cy="46" rx="18" ry="9" fill="#fff" opacity="${x.op(.85)}"/>` : `<ellipse cx="100" cy="46" rx="30" ry="14" fill="#fff" fill-opacity=".06"/>`}
${back}${rows.map(([y, rx]) => `<ellipse cx="100" cy="${y - 7}" rx="${rx}" ry="${f(rx * .3)}" fill="none" stroke="${x.url("chr")}" stroke-width=".9" opacity=".8"/>`).join("")}${front}
<circle cx="100" cy="76" r="6" fill="url(#${x.id("cry")})" stroke="#fff" stroke-opacity=".7" stroke-width=".5"/>${x.on ? `<circle cx="100" cy="76" r="6" fill="${x.c}" opacity="${x.op(.5)}"/>` : ""}<circle cx="98" cy="74" r="1.4" fill="#fff"/>${sp}`, ex);
    } }),

     base({ id: "cage", name: "Caged flush", colors: C2, glow: { x: .5, y: .34, r: 1 }, render(o) {
      const x = ctx(o), G = "M93 42 C93 50 82 54 82 68 C82 80 90 88 100 88 C110 88 118 80 118 68 C118 54 107 50 107 42 Z";
      const FIL = "M96 46 L92 66 C91.4 73 95.6 74 97 67 L100 58 L103 67 C104.4 74 108.6 73 108 66 L104 46";
      const rib = (u) => `M${f(100 + 20 * u)} 36 C${f(100 + 36 * u)} 52 ${f(100 + 30 * u)} 84 100 96`;
      const ribs = (us, a) => `<path d="${us.map(rib).join(" ")}" fill="none" stroke="#14141a" stroke-width="1.9" stroke-opacity="${a}"/><path d="${us.map(rib).join(" ")}" fill="none" stroke="#fff" stroke-opacity="${a * .25}" stroke-width=".5" transform="translate(-.6 0)"/>`;
      return svg(x, room(x, 100, 26, 76, .5) + beam(x, 100, 90, 24, 44) +
        `<ellipse cx="100" cy="22" rx="24" ry="7.6" fill="${x.url("blk")}"/><path d="M78 22 A22 7 0 0 1 122 22 L120 34 A20 6 0 0 0 80 34 Z" fill="${x.url("blk")}"/>
<ellipse cx="100" cy="34" rx="20" ry="6" fill="#15151c"/><path d="M82 24 V33" stroke="#fff" stroke-opacity=".2" stroke-width="1.4"/>
${ribs([-.55, .55], .55)}
<rect x="94" y="33" width="12" height="10" rx="1.6" fill="${x.url("brs")}"/><path d="M94 36 H106 M94 39 H106" stroke="#3d2a10" stroke-opacity=".6" stroke-width=".6"/>
${x.on ? `<circle cx="100" cy="68" r="34" fill="${x.url("halo")}" opacity="${x.op(.8)}"/><path d="${G}" fill="${x.c}" fill-opacity="${x.op(.35)}"/>
<g class="hda-ceilinglight-fil"><path d="${FIL}" fill="none" stroke="${x.c}" stroke-width="3" stroke-opacity="${x.op(.6)}" stroke-linecap="round"/><path d="${FIL}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width="1.1" stroke-linecap="round"/></g>`
          : `<path d="${G}" fill="#ffcf8a" fill-opacity=".1"/><path d="${FIL}" fill="none" stroke="#6b4e2e" stroke-width=".9" stroke-opacity=".9"/>`}
<path d="${G}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".42" stroke-width=".7"/>${hl("M87 58 C85 64 85 72 88 78", .55, 1.4)}
${ribs([-1, -.2, .2, 1], 1)}
<ellipse cx="100" cy="58" rx="32" ry="8" fill="none" stroke="#14141a" stroke-width="1.9"/><ellipse cx="100" cy="80" rx="24" ry="6" fill="none" stroke="#14141a" stroke-width="1.9"/>
<path d="M68 58 A32 8 0 0 1 100 50" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/><circle cx="100" cy="96" r="2.2" fill="#14141a"/>`);
    } }),

     base({ id: "moroccan", name: "Pierced brass", colors: C2, colorLabel: "Light", cast: "around", glow: { x: .5, y: .28, r: 1.25 }, render(o) {
      const x = ctx(o), D = "M54 30 A46 14 0 0 1 146 30 C146 58 126 82 100 82 C74 82 54 58 54 30 Z";
      const ex = lg(x.id("brz"), [[0, "#3a220c"], [.3, "#a8732f"], [.45, "#e2b46a"], [.65, "#8a5a22"], [1, "#2e1a08"]]) +
        `<clipPath id="${x.id("bwc")}"><rect x="28" y="${J + 3}" width="144" height="110"/></clipPath>`;
      const hc = x.on ? x.hot : "#160c04", star = (cx, cy, r, sc) => {
        let p = ""; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, rr = k % 2 ? r * .45 : r; p += `${k ? "L" : "M"}${f(cx + rr * Math.cos(a) * sc)} ${f(cy + rr * Math.sin(a) * .8)} `; }
        return `<path d="${p}Z" fill="${hc}"/>`; };
      let holes = "";
      for (let y = 38, ri = 0; y < 78; y += 7, ri++) {
        const hw = 44 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 30) / 54, 2))), n = Math.max(2, Math.round(hw / 7.5));
        for (let j = 0; j < n; j++) { const ph = -Math.PI / 2 + Math.PI * (j + .5 + (ri % 2) * .25) / (n + (ri % 2) * .5), cs = Math.cos(ph);
          if (cs < .18) continue; const hx = 100 + hw * .92 * Math.sin(ph);
          holes += ri % 2 ? `<ellipse cx="${f(hx)}" cy="${y}" rx="${f(1.5 * cs)}" ry="1.3" fill="${hc}"/>` : star(hx, y, 3.2, cs); }
      }
      let pat = "";
      if (x.on) {
        [62, 78, 96, 118].forEach((R, i) => { const n = Math.round(R / 4.2); for (let j = 0; j < n; j++) { const th = 2 * Math.PI * (j + i * .5) / n;
          pat += `<ellipse cx="${f(100 + R * Math.cos(th))}" cy="${f(32 + R * .38 * Math.sin(th))}" rx="${f(1.4 + i * .5)}" ry="${f(.7 + i * .25)}" fill="${x.hot}" opacity="${x.op(.75 - i * .14)}"/>`; } });
        let wp = ""; [86, 104, 126].forEach((y, i) => { const step = 11 + i * 3; for (let xx = 34 + (i % 2) * step / 2; xx < 168; xx += step) { const k = 1 - Math.abs(xx - 100) / 76; if (k <= 0) continue;
          const yy = y + Math.pow((xx - 100) / 70, 2) * (10 + i * 8), sz = 1.6 + i * .9;
          wp += i % 2 ? `<ellipse cx="${f(xx)}" cy="${f(yy)}" rx="${f(sz)}" ry="${f(sz * .7)}" fill="${x.hot}" opacity="${x.op(k * (.6 - i * .14))}"/>`
            : `<g opacity="${x.op(k * (.6 - i * .14))}">${star(xx, yy, sz * 1.6, 1).replace(hc, x.hot)}</g>`; } });
        pat = `<g clip-path="url(#${x.id("cl")})">${pat}</g><g clip-path="url(#${x.id("bwc")})">${wp}</g>`;
      }
      return svg(x, room(x, 100, 32, 80, .45, .4) + pat + beam(x, 100, 80, 22, 30, .45) +
        `<ellipse cx="100" cy="30" rx="47" ry="14.6" fill="${x.url("brs")}"/><path d="${D}" fill="url(#${x.id("brz")})"/>
<path d="${D}" fill="${x.url("sh")}" opacity=".35"/>${x.on ? `<circle cx="100" cy="58" r="40" fill="${x.url("halo")}" opacity="${x.op(.35)}"/>` : ""}${holes}
${hl("M60 40 C62 54 70 66 80 74", .3, 2.4)}<path d="M54 30 A46 14 0 0 1 146 30" fill="none" stroke="#ffe7a8" stroke-opacity=".55" stroke-width="1"/>
<circle cx="100" cy="84" r="3.4" fill="${x.url("brs")}"/><circle cx="99" cy="83" r="1" fill="#fff" fill-opacity=".8"/>`, ex);
    } }),

     // (parts) the bath fan + light combo: Fan (the blades behind the grille) and Light (the lens, the beam, the room)
     base({ id: "vent", name: "Vent light", colors: C3, glow: { x: .5, y: .2, r: 1 }, parts: [{ id: "fan", name: "Fan" }, { id: "light", name: "Light" }], render(o) {
      const x = ctx(lit(o, "light")), fan = MF.on(o, "fan"), Q = "M58 20 H142 L137 60 H63 Z", Qi = "M64 24 H136 L132 56 H68 Z";
      const ex = `<clipPath id="${x.id("vc")}"><path d="${Qi}"/></clipPath>`;
      let sl = "", bl = "";
      for (let y = 27; y < 56; y += 3.4) { const t = (y - 24) / 32; sl += `M${f(64 + 4 * t)} ${f(y)} H${f(136 - 4 * t)} `; }
      for (let k = 0; k < 5; k++) bl += `<path d="M0 0 C8 -6 18 -6 24 -2 C18 4 8 4 0 0 Z" fill="#5a5866" transform="rotate(${k * 72})"/>`;
      return svg(x, room(x, 100, 40, 82, .55) + beam(x, 100, 48, 24, 42, .9) +
        `<path d="${Q}" fill="${x.url("wht")}"/><path d="M58 20 H142" stroke="#fff" stroke-opacity=".8"/><path d="${Qi}" fill="#121118"/>
<g clip-path="url(#${x.id("vc")})"><g transform="translate(100 40) scale(1 .42)"><g class="${fan ? "hda-ceilinglight-fan" : ""}">${bl}<circle r="5" fill="#2d2c36"/></g></g>
<path d="${sl}" stroke="#000" stroke-opacity=".5" stroke-width="2.2" transform="translate(0 .9)"/><path d="${sl}" stroke="${x.url("wht")}" stroke-width="1.8"/></g>
<path d="${Qi}" fill="none" stroke="#000" stroke-opacity=".35"/>
<ellipse cx="100" cy="40" rx="17" ry="7" fill="${x.url("wht")}"/><ellipse cx="100" cy="40.4" rx="14" ry="5.6" fill="${x.on ? x.url("fill") : x.url("frost")}"/>
${x.on ? `<ellipse cx="100" cy="41" rx="34" ry="15" fill="${x.url("halo")}" opacity="${x.op(.6)}"/>` : hl("M89 38 C92 36.4 96 35.6 100 35.6", .8, 1.2)}`, ex);
    } }),

     base({ id: "skylight", name: "Sky panel", colors: ["#a9d4ff", DAY, SOFT, "#ffb38a", "#c9b6ff"], glow: { x: .5, y: .2, r: 1.2 }, render(o) {
      const x = ctx(o), OP = "M50 14 H150 L141 64 H59 Z", PN = "M54 2 H146 L138 54 H62 Z";
      const ex = `<clipPath id="${x.id("sk")}"><path d="${OP}"/></clipPath>` +
        lg(x.id("sky"), [[0, H.shade(x.c, -.4)], [.55, x.c], [1, H.mix(x.c, "#ffffff", .65)]], 1) +
        lg(x.id("off"), [[0, "#1d222e"], [1, "#3d4456"]], 1) + lg(x.id("wel"), [[0, "#dedbe8", .38], [1, "#9c98ad", .22]], 1);
      const cloud = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s} ${f(s * .55)})" opacity=".75"><ellipse cx="0" cy="0" rx="12" ry="5" fill="#fff"/><ellipse cx="-7" cy="1" rx="7" ry="4" fill="#fff"/><ellipse cx="7" cy="-2" rx="8" ry="5" fill="#fff"/></g>`;
      return svg(x, room(x, 100, 40, 104, .7, .6) + aim(x, 100, 64, 41, 0, 84, 62, .75) +
        `<path d="${OP}" fill="url(#${x.id("wel")})"/>${x.on ? `<path d="${OP}" fill="${H.mix(x.c, "#fff", .5)}" opacity="${x.op(.5)}"/>` : ""}
<g clip-path="url(#${x.id("sk")})"><path d="${PN}" fill="${x.on ? `url(#${x.id("sky")})` : `url(#${x.id("off")})`}"/>
${x.on ? `<g class="hda-ceilinglight-drift" opacity="${x.op(1)}">${cloud(72, 24, 1)}${cloud(120, 40, 1.3)}${cloud(150, 18, .8)}${cloud(40, 44, .9)}</g>` : `<path d="M70 10 L96 10 L80 50 L60 50 Z" fill="#fff" fill-opacity=".07"/><path d="M104 10 L112 10 L96 50 L88 50 Z" fill="#fff" fill-opacity=".05"/>`}
<path d="M54 2 H146 L138 54 H62 Z" fill="none" stroke="#d7d4e2" stroke-opacity=".55" stroke-width="1.4"/><path d="M100 2 V54 M58 28 H142" stroke="#d7d4e2" stroke-opacity=".3" stroke-width=".8"/></g>
<path d="${OP}" fill="none" stroke="${x.url("wht")}" stroke-width="2.4" stroke-linejoin="round"/><path d="M59 64 H141" stroke="#fff" stroke-opacity=".7"/>`, ex);
    } }),
  ];

  const C2T = {"dome": {"l": "Glass", "ids": ["frost"], "c": ["#e8e6ee", "#e0b06a", "#8a8f99", "#e8b4c0", "#a8c4d8"]}, "drum": {"l": "Shade", "ids": ["fab"], "c": ["#e2d7c2", "#f6f3ee", "#4a4a50", "#3a4a6a", "#a9b89a", "#c27a5a"]}, "bowl": {"l": "Bowl", "hex": ["#fbf6ee", "#e4d9c8", "#9d8f7c"], "c": ["#e4d9c8", "#f6f3ee", "#e0b06a", "#c9c4d8", "#a8c4b0"]}, "school": {"l": "Fitter", "ids": ["blk"], "c": ["#2a2732", "#c9a24a", "#d8d6de", "#9aa0b2", "#2f4a34"]}, "wafer": {"l": "Trim", "ids": ["wht"], "c": ["#e9e7f0", "#2a2b33", "#a7abb2", "#c9a24a"]}, "gimbal": {"l": "Trim", "ids": ["wht"], "c": ["#e9e7f0", "#2a2b33", "#a7abb2", "#c9a24a"]}, "track": {"l": "Housing", "ids": ["blk"], "c": ["#2a2b33", "#eceae6", "#a7abb2", "#c9a24a"]}, "monorail": {"l": "Finish", "ids": ["chr"], "c": ["#c9ccd6", "#2a2b33", "#c9a24a", "#a7abb2"]}, "panel": {"l": "Frame", "ids": ["nik"], "c": ["#c4c1d2", "#2a2b33", "#eceae6"]}, "shop": {"l": "Housing", "ids": ["wht"], "c": ["#e4e2ea", "#2a2b33", "#a7abb2"]}, "ring": {"l": "Housing", "ids": ["wht"], "c": ["#dedbe6", "#2a2b33", "#c9a24a", "#a7abb2"]}, "stars": {"l": "Housing", "ids": ["blk"], "c": ["#14121c", "#eceae6", "#3a4a8a", "#c9a24a"]}, "crystal": {"l": "Frame", "ids": ["chr"], "c": ["#c9ccd6", "#c9a24a", "#2a2b33"]}, "cage": {"l": "Cage", "ids": ["blk", "brs"], "c": ["#2a2b33", "#c9a24a", "#eceae6", "#9aa0b2", "#5a4636"]}, "moroccan": {"l": "Finish", "ids": ["brs"], "c": ["#a8732f", "#2a2b33", "#9aa0b2", "#c9a24a"]}, "vent": {"l": "Grille", "ids": ["wht"], "c": ["#e9e7f0", "#2a2b33", "#a7abb2"]}};
  const H2 = window.HDAH;
  function retint(svg, uid, t, c2, on) {
    if (!c2 || c2.toLowerCase() === t.c[0].toLowerCase() || (t.off && on)) return svg;
    const lum = (h) => { const v = H2.hx(h); return (0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]) / 255; };
    const map = (cols) => { const m = cols.reduce((a, c) => a + lum(c), 0) / cols.length; return (h) => H2.shade(c2, Math.max(-0.78, Math.min(0.78, (lum(h) - m) * 1.3))); };
    (t.ids || []).forEach((gid) => {
      const re = new RegExp("(<(linear|radial)Gradient id=\"" + uid + "-" + gid + "\"[^>]*>)([\\s\\S]*?)(</\\2Gradient>)");
      svg = svg.replace(re, (all, open, kind, body, close) => {
        const cols = (body.match(/stop-color="#[0-9a-fA-F]{6}"/g) || []).map((q) => q.slice(12, 19)); if (!cols.length) return all;
        const fn = map(cols); return open + body.replace(/stop-color="(#[0-9a-fA-F]{6})"/g, (q, h) => 'stop-color="' + fn(h) + '"') + close;
      });
    });
    if (t.hex && t.hex.length) { const fn = map(t.hex); t.hex.forEach((h) => { svg = svg.split('"' + h + '"').join('"' + fn(h) + '"'); }); }
    return svg;
  }
  icons.forEach((ic) => { const t = C2T[ic.id]; if (!t) return; const r = ic.render; ic.colors2 = t.c; ic.picker2 = true; ic.colorLabel2 = t.l;
    ic.render = (o) => retint(r(o), o.uid, t, o.color2, o.on); });
  (window.HDA = window.HDA || []).push({
    id: "ceilinglight",
    tab: "Ceiling lights",
    group: "Lights",
    kind: "light",
    intro: "Twenty lights that mount right on the ceiling: flush and semi-flush, recessed, track, panels and smart lights. Seen from below, lit ones glow in the light color, light up the ceiling around them and wash down into the room.",
    
    css: `.hda-ceilinglight-tw,.hda-ceilinglight-sp,.hda-ceilinglight-fan{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-ceilinglight-tw{animation:hda-ceilinglight-tw 2.8s ease-in-out infinite}
.hda-anim .hda-ceilinglight-sp{animation:hda-ceilinglight-sp 2.6s ease-in-out infinite}
.hda-anim .hda-ceilinglight-chase{animation:hda-ceilinglight-chase 4.5s linear infinite}
.hda-anim .hda-ceilinglight-fan{animation:hda-ceilinglight-spin 1.1s linear infinite}
.hda-anim .hda-ceilinglight-drift{animation:hda-ceilinglight-drift 16s ease-in-out infinite alternate}
.hda-anim .hda-ceilinglight-neb{animation:hda-ceilinglight-neb 10s ease-in-out infinite alternate}
.hda-anim .hda-ceilinglight-fil{animation:hda-ceilinglight-fil 3.4s ease-in-out infinite}
@keyframes hda-ceilinglight-tw{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes hda-ceilinglight-sp{0%,100%{opacity:0;transform:scale(.3)}45%{opacity:1;transform:scale(1)}70%{opacity:0;transform:scale(.4)}}
@keyframes hda-ceilinglight-chase{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-245}}
@keyframes hda-ceilinglight-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes hda-ceilinglight-drift{0%{transform:translate(-10px,0)}100%{transform:translate(12px,0)}}
@keyframes hda-ceilinglight-neb{0%{transform:translate(-4px,0)}100%{transform:translate(5px,1px)}}
@keyframes hda-ceilinglight-fil{0%,100%{opacity:1}45%{opacity:.86}55%{opacity:.95}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-ceilinglight-tw,.hda-anim .hda-ceilinglight-sp,.hda-anim .hda-ceilinglight-chase,.hda-anim .hda-ceilinglight-fan,.hda-anim .hda-ceilinglight-drift,.hda-anim .hda-ceilinglight-neb,.hda-anim .hda-ceilinglight-fil{animation:none}}`,
    icons,
  });
})();
