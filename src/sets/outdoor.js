(function () {
  const H = window.HDAH, P = "hda-outdoor-";
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

  const WARM = "#ffc477", SOFT = "#ffe2ad", DAY = "#eef4ff", AMBER = "#ffa94d", ICE = "#bfe4ff",
    MINT = "#a8f0d0", ROSE = "#ff9fb6", VIOLET = "#b197fc", RED = "#ff6b6b", GREEN = "#69db7c", BLUE = "#4dabf7";

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
${lg(id("sky"), [[0, "#0e1227"], [.55, "#1d2142"], [1, "#3d3357"]], 0, 0, 0, 1)}
${lg(id("lawn"), [[0, "#2e4a2e"], [1, "#132317"]], 0, 0, 0, 1)}
${lg(id("mulch"), [[0, "#4a3424"], [1, "#22170f"]], 0, 0, 0, 1)}
${lg(id("conc"), [[0, "#66676d"], [1, "#3b3c42"]], 0, 0, 0, 1)}
${lg(id("wood"), [[0, "#8a6440"], [1, "#5e4229"]], 0, 0, 0, 1)}
${lg(id("riser"), [[0, "#4a3322"], [1, "#3a281a"]], 0, 0, 0, 1)}
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .5]], .5, .48, .74)}
${rg(id("halo"), [[0, c, .85], [.45, c, .3], [1, c, 0]])}
${rg(id("pool"), [[0, hot, .75], [.35, c, .42], [1, c, 0]])}
${lg(id("cd"), [[0, c, .75], [.45, c, .28], [1, c, 0]], 0, 0, 0, 1)}
${lg(id("cu"), [[0, c, .75], [.45, c, .28], [1, c, 0]], 0, 1, 0, 0)}
${rg(id("fill"), [[0, "#ffffff", .97], [.42, hot, 1], [1, c, .85]], .5, .45, .6)}
${rg(id("dg"), [[0, "#646e82"], [.55, "#2b3140"], [1, "#141821"]], .35, .3, .85)}
${rg(id("gl"), [[0, "#ffffff", .45], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .2]], .34, .28, .75)}
${rg(id("sh"), [[0, "#000", .65], [.6, "#000", .24], [1, "#000", 0]])}
${lg(id("blk"), [[0, "#0d0d12"], [.28, "#363743"], [.42, "#555766"], [.72, "#1f2029"], [1, "#09090d"]])}
${lg(id("blkv"), [[0, "#4a4b58"], [.4, "#22232b"], [1, "#0b0b10"]], 0, 0, 0, 1)}
${lg(id("brs"), [[0, "#6e4a17"], [.22, "#c99a48"], [.38, "#fbe7a6"], [.58, "#b07f33"], [.82, "#7a5118"], [1, "#4d3210"]])}
${lg(id("chr"), [[0, "#4a4f5c"], [.2, "#e9ecf4"], [.36, "#8e94a6"], [.55, "#f4f6fb"], [.8, "#6c7284"], [1, "#3a3e4a"]])}
${lg(id("galv"), [[0, "#4c525a"], [.18, "#aab1b9"], [.34, "#d9dee3"], [.5, "#8b929b"], [.72, "#b9bfc6"], [1, "#454a52"]])}
${lg(id("brz"), [[0, "#1d140e"], [.25, "#5a4232"], [.4, "#8c6a50"], [.6, "#3e2c20"], [1, "#150e09"]])}
${lg(id("cop"), [[0, "#4a2414"], [.25, "#a8603a"], [.42, "#eaa47c"], [.62, "#8a4a2a"], [1, "#331a0c"]])}
${lg(id("wht"), [[0, "#8f8b99"], [.3, "#ecebf0"], [.45, "#ffffff"], [.75, "#cfccd5"], [1, "#7f7b88"]])}
${lg(id("alu"), [[0, "#c9ced6"], [.5, "#8a909a"], [1, "#4f545c"]], 0, 0, 0, 1)}
${lg(id("post"), [[0, "#3b2a1c"], [.35, "#7a5a3c"], [.6, "#5c4129"], [1, "#2a1d12"]])}
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
${extra || ""}</defs>`;
  }

  function svg(x, s, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="#1a1c30"/>${s.bg || ""}</g>${x.on ? s.light || "" : ""}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${s.fx || ""}${x.on ? s.over || "" : ""}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }

  const E = (cx, cy, rx, ry, fill, more) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${more || ""}/>`;
  const glo = (x, cx, cy, rx, ry, k) => x.on ? E(cx, cy, rx, ry, x.url("halo"), `opacity="${x.op(k)}"`) : "";
  const pool = (x, cx, cy, rx, ry, k) => x.on ? E(cx, cy, rx, ry, x.url("pool"), `opacity="${x.op(k)}"`) : "";
  const shadow = (x, cx, cy, rx, ry, k) => E(cx, cy, rx, ry, x.url("sh"), `opacity="${k == null ? .8 : k}"`);
  function beam(x, cx, y0, w0, w1, y1, k, dx) {
    if (!x.on) return "";
    dx = dx || 0; const g = x.url(y1 < y0 ? "cu" : "cd");
    const tr = (a, b) => `M${f(cx - a)} ${f(y0)} L${f(cx + dx - b)} ${f(y1)} L${f(cx + dx + b)} ${f(y1)} L${f(cx + a)} ${f(y0)} Z`;
    return `<path d="${tr(w0 * 1.25, w1 * 1.3)}" fill="${g}" opacity="${x.op(.3 * k)}"/><path d="${tr(w0, w1)}" fill="${g}" opacity="${x.op(.45 * k)}"/><path d="${tr(w0 * .55, w1 * .5)}" fill="${g}" opacity="${x.op(.42 * k)}"/>`;
  }
  function glass(x, d, k) {
    k = k == null ? 1 : k;
    return x.on ? `<path d="${d}" fill="${H.shade(x.c, -.6)}"/><path d="${d}" fill="${x.url("fill")}" opacity="${x.op(.95 * k)}"/>`
      : `<path d="${d}" fill="${x.url("dg")}"/><path d="${d}" fill="${x.url("gl")}"/>`;
  }
  const hl = (d, o, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o == null ? .35 : o}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
  const drop = (x, shape, dx, dy, k) => `<g transform="translate(${dx == null ? 3 : dx} ${dy == null ? 5 : dy})" fill="#000" opacity="${k == null ? .45 : k}" filter="${x.url("bl")}">${shape}</g>`;

  function flame(x, cx, cy, s) {
    const d = "M0 -9 C3.6 -4 4.6 1 3 4.2 C2 6.4 -2 6.4 -3 4.2 C-4.6 1 -3.6 -4 0 -9 Z";
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s || 1})">${x.on
      ? `<circle r="13" fill="${x.url("halo")}" opacity="${x.op(1)}"/><path d="${d}" fill="${x.hot}" opacity="${(.55 + .45 * x.L).toFixed(2)}"/><path d="M0 -4.5 C1.6 -1.6 1.6 1.6 0 3.2 C-1.6 1.6 -1.6 -1.6 0 -4.5Z" fill="#fff" opacity="${x.op(1.1)}"/>`
      : `<path d="${d}" fill="#fff" fill-opacity=".16" stroke="#e8e4f0" stroke-opacity=".5" stroke-width=".6"/><path d="M0 -3 V2.4" stroke="#7b5e3e" stroke-width=".8"/>`}
<path d="M-1.6 -4.4 C-2.6 -1.6 -2.4 1 -1.4 2.6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".7" stroke-linecap="round"/></g>`;
  }
  const sleeve = (x, cx, y0, y1, w) => `<rect x="${f(cx - w / 2)}" y="${y0}" width="${w}" height="${y1 - y0}" rx="1" fill="#f1e8d4"/><rect x="${f(cx - w / 2)}" y="${y0}" width="${f(w * .35)}" height="${y1 - y0}" fill="#fff" fill-opacity=".5"/><rect x="${f(cx + w * .15)}" y="${y0}" width="${f(w * .35)}" height="${y1 - y0}" fill="#000" fill-opacity=".18"/>${x.on ? `<rect x="${f(cx - w / 2)}" y="${y0}" width="${w}" height="${y1 - y0}" rx="1" fill="${x.c}" opacity="${x.op(.3)}"/>` : ""}`;
  function edison(x, cx, cy, s) {
    const d = "M-3.2 -6 L3.2 -6 C3.4 -3 7 -1 7 5 C7 10 3.5 13 0 13 C-3.5 13 -7 10 -7 5 C-7 -1 -3.4 -3 -3.2 -6 Z";
    const fil = "M-1.6 -5 L-2.6 4 C-2 7.6 2 7.6 2.6 4 L1.6 -5 M-2.6 4 L-1.3 2.4 L0 4 L1.3 2.4 L2.6 4";
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s || 1})"><rect x="-3.4" y="-11" width="6.8" height="5.4" rx="1" fill="${x.url("brs")}"/>
${x.on ? `<circle cy="4" r="15" fill="${x.url("halo")}" opacity="${x.op(1)}"/><path d="${d}" fill="${x.c}" fill-opacity="${x.op(.45)}" stroke="${x.hot}" stroke-opacity=".6" stroke-width=".5"/><path d="${fil}" fill="none" stroke="${x.c}" stroke-width="2.4" stroke-opacity="${x.op(.6)}" stroke-linecap="round"/><path d="${fil}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width=".9" stroke-linecap="round"/>`
      : `<path d="${d}" fill="#fff" fill-opacity=".08" stroke="#e8e4f0" stroke-opacity=".45" stroke-width=".55"/><path d="${fil}" fill="none" stroke="#7b5e3e" stroke-width=".7"/>`}
<path d="M-4.6 1 C-5.4 4 -4.8 7.6 -3 9.6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8" stroke-linecap="round"/></g>`;
  }

  function stars(seed, y1, n) {
    const r = rnd(seed); let s = "";
    for (let i = 0; i < (n || 16); i++) s += `<circle cx="${f(12 + r() * 176)}" cy="${f(12 + r() * Math.max(6, y1 - 24))}" r="${f(.35 + r() * .6)}" fill="#fff" fill-opacity="${(.25 + r() * .55).toFixed(2)}"/>`;
    return s;
  }
  function treeline(seed, y, h, col) {
    const r = rnd(seed + 7); let d = `M8 ${y}`;
    for (let xx = 8; xx < 196;) { const w = 7 + r() * 13, t = y - h * (.45 + r() * .55); d += ` Q${f(xx + w / 2)} ${f(t - h * .2)} ${f(xx + w)} ${f(y - h * .25 * r())}`; xx += w; }
    return `<path d="${d} L196 ${y + 2} L8 ${y + 2} Z" fill="${col || "#0a0e1c"}"/>`;
  }
  function sky(x, y1, seed, o) {
    o = o || {};
    let s = `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.url("sky")}"/>` + stars(seed, y1, o.stars);
    if (o.moon) s += `<circle cx="${o.moon[0]}" cy="${o.moon[1]}" r="9" fill="#f3efe0" fill-opacity=".14"/><circle cx="${o.moon[0]}" cy="${o.moon[1]}" r="5.5" fill="#f5f1e4" fill-opacity=".85"/><circle cx="${o.moon[0] + 2.6}" cy="${o.moon[1] - 1.4}" r="4.8" fill="#1a1d3a"/>`;
    if (o.trees) s += treeline(seed, y1, o.trees, o.treeCol);
    return s;
  }
  function lawn(x, y0, seed, n) {
    const r = rnd(seed); let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.url("lawn")}"/>`;
    for (let i = 0; i < (n || 90); i++) {
      const bx = 8 + r() * 184, by = y0 + 3 + r() * (192 - y0), k = (by - y0) / (192 - y0), h = 1.5 + k * 5 + r() * 2;
      s += `<path d="M${f(bx)} ${f(by)} q${f((r() - .5) * 2)} ${f(-h * .6)} ${f((r() - .5) * 3)} ${f(-h)}" stroke="${r() > .45 ? "#5f8c52" : "#0b170e"}" stroke-opacity="${(.35 + r() * .4).toFixed(2)}" stroke-width="${f(.6 + k * .7)}" fill="none" stroke-linecap="round"/>`;
    }
    return s;
  }
  function mulch(x, y0, seed, y1) {
    y1 = y1 || 192; const r = rnd(seed); let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.url("mulch")}"/>`;
    for (let i = 0; i < 80; i++) s += `<path d="M${f(8 + r() * 184)} ${f(y0 + 2 + r() * (y1 - y0 - 2))} l${f(1 + r() * 3)} ${f((r() - .5) * 1.4)}" stroke="${r() > .5 ? "#7a5638" : "#140c07"}" stroke-opacity="${(.4 + r() * .4).toFixed(2)}" stroke-width="${f(.8 + r())}" stroke-linecap="round"/>`;
    return s;
  }
  function siding(x0, y0, x1, y1, col, step) {
    step = step || 13; let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${col}"/>`;
    for (let y = y0; y < y1 - 2; y += step) s += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${f(step * .45)}" fill="#fff" fill-opacity=".04"/><path d="M${x0} ${f(Math.min(y + step - 1, y1 - 1))} H${x1}" stroke="#000" stroke-opacity=".4" stroke-width="2"/><path d="M${x0} ${f(Math.min(y + step + .4, y1))} H${x1}" stroke="#fff" stroke-opacity=".08" stroke-width=".8"/>`;
    return s;
  }
  function bricks(x0, y0, x1, y1, seed, base) {
    const r = rnd(seed); let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${base || "#5e3a2b"}"/>`;
    for (let row = 0, y = y0; y < y1; y += 11, row++) {
      for (let bx = x0 - (row % 2) * 12; bx < x1; bx += 24) {
        const v = r();
        s += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="22.4" height="9.4" rx="1.1" fill="${v > .5 ? "#000" : "#e3a07f"}" fill-opacity="${(.04 + v * .1).toFixed(2)}"/><path d="M${f(bx)} ${y} v11" stroke="#bcae9f" stroke-opacity=".2" stroke-width="1.5"/>`;
      }
      s += `<path d="M${x0} ${y} H${x1}" stroke="#bcae9f" stroke-opacity=".22" stroke-width="1.5"/><path d="M${x0} ${y + 1.3} H${x1}" stroke="#000" stroke-opacity=".22" stroke-width=".8"/>`;
    }
    return s;
  }
  function stones(x0, y0, x1, y1, seed) {
    const r = rnd(seed); let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#2a2a2e"/>`, tops = "";
    for (let y = y0; y < y1;) {
      const h = 6 + r() * 6;
      for (let xx = x0 - r() * 20; xx < x1;) {
        const w = 14 + r() * 26, t = r(), col = H.mix(t > .5 ? "#7b7468" : "#5d6066", "#8f7f66", r() * .4);
        s += `<rect x="${f(xx + .9)}" y="${f(y + .9)}" width="${f(w - 1.8)}" height="${f(h - 1.8)}" rx="1.6" fill="${H.shade(col, -.2 + r() * .25)}"/><path d="M${f(xx + 2)} ${f(y + h - 1.4)} H${f(xx + w - 2)}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>`;
        tops += `M${f(xx + 2)} ${f(y + 1.6)} H${f(xx + w - 2)} `;
        xx += w;
      }
      y += h;
    }
    s += `<path d="${tops}" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>`;
    return { s, tops };
  }
  function shingles(x, y0, y1, seed, col) {
    const r = rnd(seed); let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${col || "#2b2d34"}"/>`;
    for (let y = y0, row = 0; y < y1; y += 7, row++) {
      s += `<path d="M8 ${y + 6.5} H192" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/>`;
      for (let xx = 8 - (row % 2) * 7; xx < 192; xx += 14) s += `<rect x="${xx + .5}" y="${y}" width="13" height="6" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + r() * .07).toFixed(2)}"/><path d="M${xx} ${y} v6.5" stroke="#000" stroke-opacity=".4" stroke-width=".8"/>`;
    }
    return s;
  }
  function shrub(cx, cy, w, h, seed, col) {
    const r = rnd(seed); let s = "";
    for (let i = 0; i < 14; i++) { const a = r(), bx = cx + (r() - .5) * w, by = cy - r() * h * .7, rr = 5 + r() * (w / 6);
      s += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(rr)}" fill="${H.shade(col || "#24402a", -.3 + a * .45)}"/>`; }
    return s;
  }
  function grassClump(cx, by, h, seed, col) {
    const r = rnd(seed); let s = "";
    for (let i = 0; i < 14; i++) { const a = (r() - .5) * 1.6, l = h * (.6 + r() * .4);
      s += `<path d="M${f(cx + (r() - .5) * 6)} ${by} q${f(a * l * .3)} ${f(-l * .55)} ${f(a * l * .8)} ${f(-l)}" stroke="${H.shade(col || "#7d8a4e", -.3 + r() * .4)}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; }
    return s;
  }
  function windowPane(x, x0, y0, w, h, lit) {
    return `<rect x="${x0 - 4}" y="${y0 - 4}" width="${w + 8}" height="${h + 8}" fill="${x.url("wht")}" opacity=".85"/><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${lit ? "#5c4630" : "#1b2131"}"/>
<path d="M${x0} ${y0} L${x0 + w * .55} ${y0} L${x0} ${y0 + h * .7} Z" fill="#fff" fill-opacity=".06"/><path d="M${x0 + w / 2} ${y0} V${y0 + h} M${x0} ${y0 + h / 2} H${x0 + w}" stroke="#d8d6de" stroke-width="2.4"/><rect x="${x0 - 6}" y="${y0 + h + 3}" width="${w + 12}" height="4" fill="${x.url("wht")}"/>`;
  }

  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "around" }, o);
  const COLS = [WARM, SOFT, DAY, AMBER, ICE];
  const COLS2 = [SOFT, WARM, DAY, ICE, MINT];
  const FLAME = [AMBER, WARM, SOFT, DAY, ROSE];
  const RGB = [WARM, DAY, VIOLET, BLUE, GREEN, RED];

  const icons = [
    base({ id: "coach", name: "Coach lantern", colors: FLAME, glow: { x: .56, y: .48, r: 1.05 }, render(o) {
      const x = ctx(o), cx = 114;
      const bg = bricks(8, 8, 192, 172, 11) + `<rect x="8" y="8" width="22" height="164" fill="#1c2a25"/><rect x="11" y="30" width="15" height="40" rx="1" fill="#000" fill-opacity=".25"/><rect x="11" y="84" width="15" height="70" rx="1" fill="#000" fill-opacity=".25"/>
<rect x="30" y="8" width="10" height="164" fill="${x.url("wht")}"/><rect x="40" y="8" width="3" height="164" fill="#000" fill-opacity=".3"/>
<rect x="8" y="172" width="184" height="20" fill="${x.url("conc")}"/><path d="M8 172.5 H192" stroke="#fff" stroke-opacity=".22"/><rect x="8" y="174" width="184" height="3" fill="#000" fill-opacity=".25"/>`;
      const light = glo(x, cx, 98, 82, 74, .6) + beam(x, cx, 136, 11, 46, 174, .7) + beam(x, cx, 56, 9, 34, 8, .5) + pool(x, cx, 180, 64, 9, .85);
      const glassD = `M${cx - 14} 70 L${cx + 14} 70 L${cx + 10} 124 L${cx - 10} 124 Z`;
      const fx = drop(x, `<rect x="${cx - 7}" y="64" width="14" height="80" rx="5"/><path d="${glassD}"/>`, 4, 6, .5) +
        `<rect x="${cx - 7}" y="64" width="14" height="80" rx="5" fill="${x.url("blk")}"/><circle cx="${cx}" cy="70" r="1.6" fill="#777"/><circle cx="${cx}" cy="138" r="1.6" fill="#777"/>
<rect x="${cx - 5}" y="45" width="10" height="7" rx="1" fill="${x.url("blk")}"/><ellipse cx="${cx}" cy="45" rx="6.5" ry="1.8" fill="#3a3b46"/>
${glass(x, glassD)}${sleeve(x, cx, 102, 124, 6)}${flame(x, cx, 95, 1.05)}
<path d="M${cx - 6} 70 L${cx - 4.5} 124 M${cx + 6} 70 L${cx + 4.5} 124" stroke="${x.url("blk")}" stroke-width="1.6"/><path d="${glassD}" fill="none" stroke="#15151b" stroke-width="2.6" stroke-linejoin="round"/>
${hl(`M${cx - 11.5} 74 L${cx - 8.6} 120`, .35, 1)}
<path d="M${cx - 19} 70 Q${cx} 63 ${cx + 19} 70 L${cx + 9} 53 L${cx - 9} 53 Z" fill="${x.url("blk")}"/><path d="M${cx - 17} 69 Q${cx} 63 ${cx + 17} 69" fill="none" stroke="#fff" stroke-opacity=".18"/>
<rect x="${cx - 16}" y="68" width="32" height="4" rx="1" fill="${x.url("blk")}"/>
<path d="M${cx - 11} 124 L${cx + 11} 124 L${cx + 6} 134 L${cx - 6} 134 Z" fill="${x.url("blk")}"/><circle cx="${cx}" cy="138" r="3.4" fill="${x.url("blk")}"/>${x.on ? `<path d="M${cx - 15} 71.6 H${cx + 15}" stroke="${x.hot}" stroke-opacity="${x.op(.8)}"/>` : ""}`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "gooseneck", name: "Barn gooseneck", colors: COLS, cast: "down", glow: { x: .59, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o), r = rnd(23);
      let barn = `<rect x="8" y="8" width="184" height="156" fill="#61271f"/>`;
      for (let bx = 8; bx < 192; bx += 17) barn += `<rect x="${bx}" y="8" width="17" height="156" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + r() * .06).toFixed(2)}"/><path d="M${bx} 8 V164" stroke="#000" stroke-opacity=".45" stroke-width="1.6"/><path d="M${bx + 1.4} 8 V164" stroke="#ff9d8a" stroke-opacity=".08"/>`;
      const door = `<rect x="66" y="108" width="104" height="56" fill="#55211b"/><path d="M68 110 L168 162 M168 110 L68 162" stroke="#e9e2d8" stroke-width="5"/><rect x="66" y="108" width="104" height="56" fill="none" stroke="#e9e2d8" stroke-width="5"/><path d="M118 108 V164" stroke="#e9e2d8" stroke-width="3"/><rect x="66" y="108" width="104" height="56" fill="#000" fill-opacity=".12"/>`;
      let grav = `<rect x="8" y="164" width="184" height="28" fill="#3f3a35"/>`;
      for (let i = 0; i < 70; i++) grav += `<circle cx="${f(8 + r() * 184)}" cy="${f(166 + r() * 26)}" r="${f(.6 + r() * 1.3)}" fill="${r() > .5 ? "#8a8278" : "#1c1a18"}" fill-opacity=".6"/>`;
      const bg = barn + door + grav + `<path d="M8 164 H192" stroke="#000" stroke-opacity=".5" stroke-width="2"/>`;
      const light = glo(x, 118, 120, 76, 48, .4) + beam(x, 118, 95, 33, 74, 176, .85) + pool(x, 118, 174, 74, 12, .9);
      const shadeD = "M118 63 C106 63 102 69 100 75 L82 94 L154 94 L136 75 C134 69 130 63 118 63 Z";
      const fx = drop(x, `<path d="M30 58 C46 58 50 30 78 30 C100 30 116 36 118 60" fill="none" stroke="#000" stroke-width="5"/>`, 3, 6, .4) +
        `<circle cx="28" cy="58" r="8" fill="${x.url("galv")}"/><circle cx="28" cy="58" r="8" fill="none" stroke="#000" stroke-opacity=".4"/>
<path d="M30 58 C46 58 50 30 78 30 C100 30 116 36 118 60" fill="none" stroke="#3e434a" stroke-width="5.4" stroke-linecap="round"/><path d="M30 58 C46 58 50 30 78 30 C100 30 116 36 118 60" fill="none" stroke="#c9ced4" stroke-width="1.6" stroke-opacity=".7" transform="translate(-.6 -1.2)"/>
<rect x="114.5" y="57" width="7" height="8" rx="1" fill="${x.url("galv")}"/>
<path d="${shadeD}" fill="${x.url("galv")}"/><path d="M104 74 L88 92" stroke="#fff" stroke-opacity=".35" stroke-width="2"/><path d="M100 75 Q118 79 136 75" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/>
<ellipse cx="118" cy="94" rx="36" ry="4" fill="#3f444b"/>${x.on ? `<ellipse cx="118" cy="94.6" rx="33" ry="3.2" fill="${x.hot}" opacity="${x.op(1.1)}"/><ellipse cx="118" cy="94.8" rx="16" ry="1.6" fill="#fff" opacity="${x.op(1)}"/>` : `<ellipse cx="118" cy="94.8" rx="32" ry="2.6" fill="#15171b"/><ellipse cx="118" cy="94.4" rx="6" ry="1.4" fill="#f0eee8" fill-opacity=".35"/>`}`;
      return svg(x, { bg, light, fx, over: glo(x, 118, 97, 44, 10, .7) });
    } }),

    base({ id: "flush", name: "Porch flush mount", colors: COLS2, cast: "down", glow: { x: .5, y: .24, r: 1.1 }, render(o) {
      const x = ctx(o);
      let ceil = `<path d="M8 8 H192 V52 H8 Z" fill="#577f8f"/><rect x="8" y="8" width="184" height="44" fill="#000" fill-opacity=".0"/>`;
      for (let i = -6; i <= 26; i++) { const bx = 8 + i * 9.5, tx = bx + (100 - bx) * .3; ceil += `<path d="M${f(tx)} 8 L${f(bx)} 52" stroke="#000" stroke-opacity=".25" stroke-width=".9"/>`; }
      ceil += `<rect x="8" y="8" width="184" height="44" fill="url(#${x.id("cfade")})"/><rect x="8" y="50" width="184" height="6" fill="${x.url("wht")}"/><rect x="8" y="56" width="184" height="2" fill="#000" fill-opacity=".35"/>`;
      let floor = `<rect x="8" y="170" width="184" height="22" fill="#4b4238"/>`;
      for (let i = -4; i <= 24; i++) { const bx = 8 + i * 10; floor += `<path d="M${f(100 + (bx - 100) * .55)} 170 L${f(bx + (bx - 100) * .3)} 192" stroke="#000" stroke-opacity=".35"/>`; }
      const bg = ceil + siding(8, 58, 192, 170, "#68717c") +
        `<rect x="70" y="80" width="60" height="90" fill="${x.url("wht")}"/><rect x="76" y="86" width="48" height="84" fill="#5b1e22"/>
<rect x="82" y="92" width="36" height="22" rx="1" fill="#1d2230"/><path d="M100 92 V114 M82 103 H118" stroke="#5b1e22" stroke-width="2"/><rect x="82" y="120" width="15" height="44" rx="1" fill="#000" fill-opacity=".22"/><rect x="103" y="120" width="15" height="44" rx="1" fill="#000" fill-opacity=".22"/>
<circle cx="114" cy="130" r="2.2" fill="${x.url("brs")}"/>` + floor + `<path d="M8 170 H192" stroke="#000" stroke-opacity=".5" stroke-width="2"/>`;
      const light = glo(x, 100, 34, 96, 24, .6) + beam(x, 100, 60, 25, 74, 192, .6) + glo(x, 100, 118, 54, 52, .35) + pool(x, 100, 180, 74, 10, .8);
      const dome = "M73 37 C74 53 88 61 100 61 C112 61 126 53 127 37 Z";
      const fx = `<ellipse cx="100" cy="34" rx="29" ry="5" fill="${x.url("blkv")}"/>${glass(x, dome)}
${x.on ? `<ellipse cx="100" cy="49" rx="18" ry="7" fill="#fff" opacity="${x.op(.55)}"/>` : `<path d="M80 41 C82 50 90 56 98 57" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/>`}
${(() => { let s = ""; const rr = rnd(5); for (let i = 0; i < 18; i++) s += `<circle cx="${f(80 + rr() * 40)}" cy="${f(40 + rr() * 17)}" r="${f(.5 + rr() * .7)}" fill="#fff" fill-opacity="${x.on ? .5 : .22}"/>`; return s; })()}
<rect x="71" y="34.5" width="58" height="4" rx="1.6" fill="${x.url("blk")}"/><circle cx="100" cy="62.5" r="2.8" fill="${x.url("blk")}"/>`;
      return svg(x, { bg, light, fx }, lg(x.id("cfade"), [[0, "#000", .45], [1, "#000", 0]], 0, 0, 0, 1));
    } }),

    base({ id: "post", name: "Post lantern", colors: FLAME, glow: { x: .5, y: .24, r: 1.1 }, render(o) {
      const x = ctx(o);
      const bg = sky(x, 134, 21, { trees: 20, moon: [160, 34] }) + lawn(x, 134, 5, 100) +
        shrub(28, 150, 40, 26, 3) + shrub(176, 146, 36, 22, 4) +
        [[84, 168], [118, 166], [74, 160], [128, 158]].map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="2.2" fill="${["#e8a0bf", "#f3d36b", "#c4a6ff", "#ffb58a"][i]}" fill-opacity=".75"/><circle cx="${a + 4}" cy="${b + 1.5}" r="1.8" fill="${["#e8a0bf", "#f3d36b", "#c4a6ff", "#ffb58a"][i]}" fill-opacity=".6"/>`).join("");
      const light = glo(x, 100, 48, 76, 62, .6) + beam(x, 100, 70, 12, 64, 176, .35) + pool(x, 100, 172, 84, 16, .85);
      const g = "M88 64 L112 64 L115 31 L85 31 Z";
      const fx = shadow(x, 100, 176, 20, 3.4) + `<path d="M90 177 L110 177 L106 163 L94 163 Z" fill="${x.url("blk")}"/>
<rect x="96.4" y="74" width="7.2" height="90" fill="${x.url("blk")}"/><path d="M98.2 76 V162 M101.8 76 V162" stroke="#000" stroke-opacity=".5" stroke-width=".7"/>${hl("M97.6 78 V160", .22, .8)}
<rect x="92" y="70" width="16" height="5" rx="1.4" fill="${x.url("blk")}"/><path d="M87 64 L113 64 L109 70 L91 70 Z" fill="${x.url("blk")}"/>
${glass(x, g)}${sleeve(x, 100, 50, 64, 5)}${flame(x, 100, 44, 1)}
<path d="M93.5 64 L92 31 M106.5 64 L108 31" stroke="#111117" stroke-width="1.5"/><path d="${g}" fill="none" stroke="#111117" stroke-width="2.4" stroke-linejoin="round"/>${hl("M87.6 34 L89.6 61", .3, 1)}
<path d="M80 32 L120 32 L106 17 L94 17 Z" fill="${x.url("blk")}"/><path d="M82 31.5 H118" stroke="#fff" stroke-opacity=".15"/><path d="M100 17 V11" stroke="#1b1b22" stroke-width="2"/><circle cx="100" cy="14.5" r="2.6" fill="${x.url("blk")}"/>`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "pagoda", name: "Pagoda path light", colors: COLS, cast: "down", glow: { x: .77, y: .52, r: 1 }, render(o) {
      const x = ctx(o), r = rnd(31);
      let path = "";
      for (let i = 0; i < 8; i++) {
        const u = i / 7, y = 84 + 100 * Math.pow(u, 1.55), rx = 4 + u * 25 + r() * 2, ry = 1.4 + u * 6.4, cx2 = 103 - u * 10 + (i % 2 ? 1 : -1) * (2 + u * 6);
        const col = H.mix("#6a655d", "#857b6c", r());
        path += `<ellipse cx="${f(cx2)}" cy="${f(y + ry * .35)}" rx="${f(rx)}" ry="${f(ry)}" fill="#0c140e" opacity=".7"/><ellipse cx="${f(cx2)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${col}"/><path d="M${f(cx2 - rx * .8)} ${f(y - ry * .2)} Q${f(cx2)} ${f(y - ry * 1.05)} ${f(cx2 + rx * .7)} ${f(y - ry * .3)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="${f(.5 + u)}"/>`;
      }
      const bg = sky(x, 80, 41, { trees: 16 }) + `<path d="M120 80 L120 58 L146 44 L172 58 L172 80 Z" fill="#11142a"/><rect x="132" y="62" width="9" height="8" fill="#e8b46a" fill-opacity=".55"/><rect x="152" y="62" width="9" height="8" fill="#e8b46a" fill-opacity=".35"/>` + lawn(x, 80, 9, 110) + path;
      function pagoda(cx, by, s, k) {
        const hat = (y, w) => `<path d="M${-w} ${y} Q${f(-w * .3)} ${y - 3.6} 0 ${y - 8} Q${f(w * .3)} ${y - 3.6} ${w} ${y} Q0 ${y + 2.4} ${-w} ${y} Z" fill="url(#${x.id("brz")})"/><path d="M${-w + 2} ${y - .6} Q${f(-w * .3)} ${y - 4} 0 ${y - 7.6}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>` +
          (x.on ? `<ellipse cx="0" cy="${y + .8}" rx="${f(w * .8)}" ry="1.5" fill="${x.hot}" opacity="${x.op(1)}"/>` : `<ellipse cx="0" cy="${y + .8}" rx="${f(w * .8)}" ry="1.3" fill="#0c0806"/>`);
        return `<g transform="translate(${cx} ${by}) scale(${s})">
<rect x="-1.8" y="-50" width="3.6" height="50" fill="url(#${x.id("brz")})"/>
${x.on ? `<rect x="-5" y="-76" width="10" height="26" rx="2" fill="${x.url("fill")}" opacity="${x.op(1)}"/><circle cx="0" cy="-62" r="16" fill="${x.url("halo")}" opacity="${x.op(.8 * k)}"/>` : `<rect x="-5" y="-76" width="10" height="26" rx="2" fill="#d9d4cc" fill-opacity=".35"/>`}
${hat(-74, 11)}${hat(-64, 15)}${hat(-53, 20)}<path d="M0 -82 V-86" stroke="#2a1e15" stroke-width="2"/><circle cx="0" cy="-82" r="1.8" fill="url(#${x.id("brz")})"/></g>`;
      }
      const light = pool(x, 158, 176, 56, 13, .9) + pool(x, 60, 114, 24, 5, .8) + beam(x, 158, 112, 20, 50, 176, .4) + beam(x, 60, 85, 9, 22, 114, .35);
      const fx = shadow(x, 60, 114, 8, 1.4) + pagoda(60, 114, .52, .6) + shadow(x, 158, 177, 14, 2.6) + pagoda(158, 177, 1.22, 1);
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "mushroom", name: "Mushroom light", colors: COLS, cast: "down", glow: { x: .5, y: .58, r: 1.05 }, render(o) {
      const x = ctx(o);
      const st = stones(8, 8, 192, 96, 47);
      const hosta = (cx, cy, s, seed) => { const rr = rnd(seed); let h = "";
        for (let i = 0; i < 9; i++) { const a = -150 + i * 15 + rr() * 8;
          h += `<g transform="translate(${cx} ${cy}) rotate(${f(a + 90)}) scale(${s})"><path d="M0 0 C-7 -8 -8 -22 0 -32 C8 -22 7 -8 0 0 Z" fill="${H.mix("#3e6b3a", "#86a860", rr() * .5)}"/><path d="M0 -2 V-29" stroke="#c8d8a0" stroke-opacity=".5" stroke-width=".8"/><path d="M-4 -14 C-5 -20 -3 -26 0 -30" fill="none" stroke="#fff" stroke-opacity=".12"/></g>`; }
        return h; };
      const bg = st.s + `<rect x="8" y="94" width="184" height="4" fill="#000" fill-opacity=".4"/>` + mulch(x, 96, 13) + hosta(30, 140, .9, 3) + hosta(174, 150, 1, 6);
      const light = beam(x, 100, 116, 36, 84, 190, .5) + pool(x, 100, 168, 82, 22, .95);
      const cap = "M60 114 C62 96 80 84 100 84 C120 84 138 96 140 114 Q100 119 60 114 Z";
      const fx = shadow(x, 100, 177, 12, 2.4) + `<rect x="98.3" y="112" width="3.4" height="66" fill="${x.url("cop")}"/>
${drop(x, `<path d="${cap}"/>`, 0, 4, .4)}<path d="${cap}" fill="${x.url("cop")}"/><path d="M68 106 C72 96 84 88 98 87" fill="none" stroke="#ffd9bf" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>
<path d="M60 114 Q100 119 140 114" fill="none" stroke="#2a140a" stroke-width="2"/><circle cx="100" cy="83" r="2.2" fill="${x.url("cop")}"/>
${x.on ? `<ellipse cx="100" cy="116" rx="37" ry="4" fill="${x.hot}" opacity="${x.op(1.1)}"/><ellipse cx="100" cy="116.3" rx="14" ry="1.8" fill="#fff" opacity="${x.op(1)}"/>` : `<ellipse cx="100" cy="116" rx="36" ry="3.4" fill="#1a0e08"/><ellipse cx="100" cy="116" rx="8" ry="1.3" fill="#e9e2d6" fill-opacity=".3"/>`}`;
      return svg(x, { bg, light, fx, over: glo(x, 100, 119, 46, 12, .6) });
    } }),

    base({ id: "treespot", name: "Tree up-light", colors: [DAY, WARM, ICE, MINT, VIOLET], cast: "up", glow: { x: .42, y: .78, r: 1.15 }, render(o) {
      const x = ctx(o), r = rnd(57);
      const blobs = []; for (let i = 0; i < 26; i++) blobs.push([30 + r() * 145, 18 + r() * 66, 14 + r() * 14]);
      const blobSvg = (fn) => blobs.map(([a, b, c2], i) => `<circle cx="${f(a)}" cy="${f(b)}" r="${f(c2)}" ${fn(i)}/>`).join("");
      const cp = `<clipPath id="${x.id("cnp")}">${blobSvg(() => "")}<path d="M94 164 C96 130 92 110 98 84 L104 84 C108 110 106 132 112 164 Z"/></clipPath>`;
      const trunk = `<path d="M100 92 C88 78 78 70 64 58 M103 90 C116 76 126 66 142 52 M101 88 C101 70 104 56 102 38" stroke="#2b1d14" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M93 166 C96 130 92 110 98 84 L104 84 C108 110 106 132 113 166 Z" fill="${x.url("post")}"/>${(() => { let s = ""; for (let i = 0; i < 9; i++) s += `<path d="M${f(97 + r() * 9)} ${f(96 + i * 7.5)} q${f((r() - .5) * 3)} 4 ${f((r() - .5) * 2)} 7" stroke="#000" stroke-opacity=".35" fill="none"/>`; return s; })()}`;
      const canopy = blobSvg((i) => `fill="${H.mix("#15291b", "#2f4d2f", (i % 5) / 5)}"`) + (() => { let s2 = ""; for (let i = 0; i < 160; i++) { const b = blobs[i % blobs.length], a = r() * 6.28, d = r() * b[2]; s2 += `<circle cx="${f(b[0] + Math.cos(a) * d)}" cy="${f(b[1] + Math.sin(a) * d)}" r="${f(1 + r() * 1.6)}" fill="${r() > .5 ? "#3d6a3a" : "#0c1a10"}" fill-opacity=".55"/>`; } return s2; })();
      const bg = sky(x, 152, 61, { trees: 12, treeCol: "#0b1220", stars: 22 }) + lawn(x, 152, 15, 70) + trunk + canopy;
      const light = beam(x, 82, 150, 4, 54, 16, .7, 22) + `<g class="hda-bg"><g clip-path="${x.url("cnp")}"><ellipse cx="104" cy="96" rx="80" ry="50" fill="${x.url("halo")}" opacity="${x.op(.95)}"/><path d="M93 166 C96 130 92 110 98 84 L104 84 C108 110 106 132 113 166 Z" fill="${x.url("cu")}" opacity="${x.op(.9)}"/></g></g>` + pool(x, 86, 164, 30, 7, .7);
      const fx = `<path d="M70 176 L72 164" stroke="#111" stroke-width="2"/><circle cx="72" cy="163" r="3" fill="${x.url("brz")}"/>
<g transform="translate(73 161) rotate(28)"><rect x="-6" y="-24" width="12" height="22" rx="3" fill="${x.url("brz")}"/><path d="M-6.4 -24 L-7.6 -31 L7.6 -31 L6.4 -24 Z" fill="${x.url("brz")}"/>
${x.on ? `<ellipse cx="0" cy="-30.6" rx="6.4" ry="2" fill="#fff" opacity="${x.op(1.2)}"/><ellipse cx="0" cy="-31" rx="12" ry="5" fill="${x.url("halo")}" opacity="${x.op(1)}"/>` : `<ellipse cx="0" cy="-30.6" rx="6.4" ry="2" fill="${x.url("dg")}"/>`}${hl("M-3.6 -22 V-6", .25, 1)}</g>` +
        grassClump(66, 178, 12, 2, "#4f7a44") + grassClump(82, 180, 10, 4, "#4f7a44");
      return svg(x, { bg, light, fx }, cp);
    } }),

    base({ id: "flood", name: "Motion flood", colors: [DAY, "#ffffff", WARM, ICE, SOFT], cast: "down", glow: { x: .5, y: .33, r: 1.25 }, render(o) {
      const x = ctx(o);
      const bg = `<rect x="8" y="8" width="184" height="22" fill="#2a2c33"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${14 + i * 15} 15 v9" stroke="#000" stroke-opacity=".5" stroke-width="2"/>`).join("")}<rect x="8" y="28" width="184" height="3" fill="#000" fill-opacity=".45"/>` +
        siding(8, 31, 192, 150, "#56606b") + `<rect x="142" y="96" width="50" height="54" fill="#3f454d"/><path d="M142 110 H192 M142 124 H192 M142 138 H192" stroke="#000" stroke-opacity=".35"/><rect x="138" y="92" width="4" height="58" fill="${x.url("wht")}" opacity=".7"/>` +
        `<rect x="8" y="150" width="184" height="42" fill="${x.url("conc")}"/><path d="M8 150.5 H192" stroke="#fff" stroke-opacity=".18"/><path d="M70 150 L40 192 M130 150 L160 192" stroke="#000" stroke-opacity=".35"/>`;
      const light = glo(x, 100, 70, 90, 36, .35) + beam(x, 74, 72, 10, 40, 176, .75, -30) + beam(x, 126, 72, 10, 40, 176, .75, 30) + pool(x, 46, 172, 50, 13, .85) + pool(x, 154, 172, 50, 13, .85);
      const head = (cx, cy, rot) => `<g transform="translate(${cx} ${cy}) rotate(${rot})"><rect x="-14" y="-8" width="28" height="15" rx="3.4" fill="${x.url("wht")}"/>${[-8, -3, 2, 7].map((a) => `<path d="M${a} -7 V-2" stroke="#000" stroke-opacity=".2"/>`).join("")}
<rect x="-12" y="4" width="24" height="5" rx="1.6" fill="${x.on ? x.hot : "#2a2e38"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<rect x="-9" y="5.2" width="18" height="2.4" rx="1" fill="#fff" opacity="${x.op(1)}"/><ellipse cx="0" cy="8" rx="20" ry="7" fill="${x.url("halo")}" opacity="${x.op(.9)}"/>` : `<path d="M-10 5.6 H10" stroke="#fff" stroke-opacity=".2"/>`}${hl("M-11 -6 H9", .5, 1)}</g>`;
      const fx = drop(x, `<circle cx="100" cy="56" r="12"/>`, 2, 4, .45) + `<path d="M100 56 L80 62 M100 56 L120 62" stroke="#d8d6de" stroke-width="3.4" stroke-linecap="round"/>
<circle cx="100" cy="54" r="12" fill="${x.url("wht")}"/><circle cx="100" cy="54" r="12" fill="none" stroke="#000" stroke-opacity=".25"/>${head(76, 62, 26)}${head(124, 62, -26)}
<circle cx="100" cy="69" r="6.2" fill="${x.url("wht")}"/><path d="M95 67 Q100 64 105 67 M94.6 70 Q100 67 105.4 70 M95.6 73 Q100 70.6 104.4 73" stroke="#000" stroke-opacity=".25" fill="none" stroke-width=".7"/>
<circle cx="100" cy="62.6" r="1.3" fill="${x.on ? "#ff4d4d" : "#4a2222"}" class="${x.on ? P + "blink" : ""}"/>`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "bistro", name: "Bistro string", colors: [AMBER, WARM, SOFT, ROSE, VIOLET, BLUE], cast: "down", glow: { x: .5, y: .38, r: 1.35 }, render(o) {
      const x = ctx(o);
      const q = (p0, p1, p2, t) => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
      let pav = `<rect x="8" y="140" width="184" height="52" fill="#4e4039"/>`;
      [140, 146, 153, 161, 170, 180, 192].forEach((y, i) => { pav += `<path d="M8 ${y} H192" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>`;
        for (let k = -10; k <= 10; k++) { const xx = 100 + (k + (i % 2) * .5) * (8 + (y - 140) * .22); pav += `<path d="M${f(xx)} ${y} v${i < 6 ? [146, 153, 161, 170, 180, 192][i] - y : 0}" stroke="#000" stroke-opacity=".3"/>`; } });
      const bg = sky(x, 140, 61, { trees: 34, stars: 12 }) + pav +
        `<ellipse cx="100" cy="150" rx="22" ry="4" fill="#0f0d0c"/><rect x="98" y="150" width="4" height="18" fill="#0f0d0c"/><ellipse cx="100" cy="169" rx="10" ry="2" fill="#0f0d0c"/>
<path d="M66 132 L68 172 M64 150 L80 150 L80 172 M136 132 L134 172 M138 150 L120 150 L120 172" stroke="#0f0d0c" stroke-width="3" fill="none"/>` +
        [[19, 30], [181, 30]].map(([px, py]) => `<rect x="${px - 3}" y="${py}" width="6" height="${192 - py}" fill="${x.url("post")}"/><rect x="${px - 4}" y="${py - 2}" width="8" height="3" fill="#2a1d12"/>`).join("");
      const strings = [[[8, 60], [100, 102], [192, 60], 8, .6], [[20, 38], [100, 100], [180, 38], 9, 1]];
      let wire = "", bulbs = "", halos = "";
      strings.forEach(([p0, p1, p2, n, s], si) => {
        wire += `<path d="M${p0[0]} ${p0[1]} Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}" fill="none" stroke="#0a0a0c" stroke-width="${f(1.4 * s)}"/>`;
        for (let i = 1; i <= n; i++) {
          const [bx, by] = q(p0, p1, p2, i / (n + 1));
          const d = "M0 0 C-4 2 -4.6 8 -3 11 C-2 13.5 2 13.5 3 11 C4.6 8 4 2 0 0 Z";
          bulbs += `<g transform="translate(${f(bx)} ${f(by)}) scale(${s})"><rect x="-1.6" y="0" width="3.2" height="4.2" rx=".8" fill="#141418"/>
<g transform="translate(0 3.6)">${x.on ? `<path d="${d}" fill="${x.url("fill")}" opacity="${x.op(1.1)}"/><path d="M-1 3 L-1.4 8 Q0 9.4 1.4 8 L1 3" fill="none" stroke="#fff" stroke-width=".8" opacity="${x.op(1)}"/>` : `<path d="${d}" fill="#fff" fill-opacity=".1" stroke="#e8e4f0" stroke-opacity=".45" stroke-width=".5"/><path d="M-1 3 L-1.4 8 Q0 9.4 1.4 8 L1 3" fill="none" stroke="#7b5e3e" stroke-width=".6"/>`}<path d="M-2.4 3.4 C-3 6 -2.8 8 -1.8 9.6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/></g></g>`;
          halos += `<g class="${P}tw" style="animation-delay:-${((i * 0.37 + si) % 2).toFixed(2)}s"><circle cx="${f(bx)}" cy="${f(by + 10 * s)}" r="${f(13 * s)}" fill="${x.url("halo")}" opacity="${x.op(si ? .85 : .6)}"/></g>`;
        }
      });
      const light = glo(x, 100, 80, 100, 44, .3) + pool(x, 100, 166, 100, 24, .75);
      return svg(x, { bg, light, fx: wire + bulbs, over: halos });
    } }),

    base({ id: "deckstep", name: "Deck step light", colors: COLS, cast: "down", glow: { x: .5, y: .58, r: 1.05 }, render(o) {
      const x = ctx(o);
      const rows = [[50, 64, 90], [90, 102, 128], [128, 140, 166]];
      const wgrain = (y0, y1, seed) => { const rr = rnd(seed); let s = ""; for (let i = 0; i < 6; i++) { const yy = y0 + 1 + rr() * (y1 - y0 - 2); s += `<path d="M${f(30 + rr() * 40)} ${f(yy)} h${f(20 + rr() * 50)}" stroke="#000" stroke-opacity=".18" stroke-width=".7"/>`; } return s; };
      let st = siding(8, 8, 192, 50, "#5c636c");
      rows.forEach(([t, rTop, rBot], i) => {
        st += `<rect x="24" y="${t}" width="152" height="${rTop - t}" fill="${x.url("wood")}"/>${wgrain(t, rTop, 3 + i)}<rect x="22" y="${rTop - 3}" width="156" height="3.4" rx="1" fill="#9a7550"/><path d="M22 ${rTop - 2.6} H178" stroke="#fff" stroke-opacity=".25"/>
<rect x="24" y="${rTop}" width="152" height="${rBot - rTop}" fill="${x.url("riser")}"/><path d="M24 ${rTop + (rBot - rTop) / 2} H176" stroke="#000" stroke-opacity=".3"/>${wgrain(rTop, rBot, 9 + i)}<rect x="24" y="${rTop}" width="152" height="3" fill="#000" fill-opacity=".35"/>`;
      });
      st += `<rect x="8" y="166" width="184" height="26" fill="#3d3f45"/>${[30, 70, 110, 150].map((a) => `<path d="M${a} 166 L${a - 8} 192" stroke="#000" stroke-opacity=".35"/>`).join("")}<path d="M8 179 H192" stroke="#000" stroke-opacity=".3"/>
<rect x="8" y="50" width="16" height="142" fill="#1a2418"/><rect x="176" y="50" width="16" height="142" fill="#1a2418"/>${shrub(14, 120, 22, 70, 7)}${shrub(186, 130, 22, 70, 8)}
<rect x="20" y="40" width="8" height="128" fill="${x.url("post")}"/><rect x="172" y="40" width="8" height="128" fill="${x.url("post")}"/><rect x="18.5" y="36" width="11" height="5" fill="#3a2a1b"/><rect x="170.5" y="36" width="11" height="5" fill="#3a2a1b"/>`;
      let light = "", fx = "";
      rows.forEach(([t, rTop, rBot], i) => {
        const fy = rTop + 9, cx = [100, 100, 100][i];
        light += beam(x, cx, fy + 6, 8, 26, rBot, .7) + pool(x, cx, rBot + 6, 46, 7, .9);
        fx += `<rect x="${cx - 9}" y="${fy}" width="18" height="8" rx="1.4" fill="${x.url("blkv")}"/><path d="M${cx - 10} ${fy} H${cx + 10} L${cx + 8} ${fy + 3} H${cx - 8} Z" fill="${x.url("blk")}"/>
<rect x="${cx - 7}" y="${fy + 5.4}" width="14" height="2" rx=".8" fill="${x.on ? x.hot : "#0a0a0d"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${glo(x, cx, fy + 8, 16, 5, 1)}`;
      });
      return svg(x, { bg: st, light, fx });
    } }),

    base({ id: "bollard", name: "Bollard", colors: COLS2, glow: { x: .5, y: .47, r: 1.1 }, render(o) {
      const x = ctx(o);
      let pav = `<rect x="8" y="106" width="184" height="86" fill="${x.url("conc")}"/>`;
      [106, 114, 125, 140, 160, 192].forEach((y) => { pav += `<path d="M8 ${y} H192" stroke="#000" stroke-opacity=".4" stroke-width="1.2"/><path d="M8 ${y + 1} H192" stroke="#fff" stroke-opacity=".06"/>`; });
      for (let k = -6; k <= 6; k++) pav += `<path d="M${f(100 + k * 14)} 106 L${f(100 + k * 46)} 192" stroke="#000" stroke-opacity=".35" stroke-width="1.1"/>`;
      const bg = sky(x, 106, 71, { trees: 10 }) + shrub(100, 112, 190, 26, 9, "#1f3624") + pav + grassClump(28, 160, 34, 3, "#8c9156") + grassClump(40, 164, 26, 6, "#8c9156") + grassClump(170, 162, 34, 8, "#8c9156");
      const light = glo(x, 100, 94, 74, 30, .55) + pool(x, 100, 166, 88, 20, .9);
      const fx = shadow(x, 100, 172, 18, 3) + `<rect x="89" y="104" width="22" height="68" fill="${x.url("brz")}"/>${hl("M93 108 V168", .18, 1.4)}
<rect x="89" y="86" width="22" height="18" fill="${x.on ? x.hot : "#16120f"}" ${x.on ? `opacity="${(.55 + .45 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<rect x="91" y="88" width="18" height="14" fill="#fff" opacity="${x.op(.7)}"/>` : ""}
${[89, 93, 97, 101].map((y) => `<rect x="88" y="${y}" width="24" height="2.2" fill="${x.url("brz")}"/>`).join("")}
<path d="M88 86 Q100 74 112 86 Z" fill="${x.url("brz")}"/><rect x="87.5" y="84.5" width="25" height="3" rx="1" fill="${x.url("brz")}"/><path d="M91 83 Q100 76 108 82" fill="none" stroke="#fff" stroke-opacity=".2"/>
<rect x="87.5" y="102.5" width="25" height="3" rx="1" fill="${x.url("brz")}"/><ellipse cx="100" cy="172" rx="13" ry="2.4" fill="#120c08"/>`;
      return svg(x, { bg, light, fx, over: glo(x, 100, 95, 26, 13, .6) });
    } }),

    base({ id: "solar", name: "Solar stake", colors: [DAY, WARM, ICE, VIOLET, GREEN, ROSE], glow: { x: .62, y: .55, r: 1.1 }, render(o) {
      const x = ctx(o);
      let edge = ""; for (let xx = 4; xx < 196; xx += 14) edge += `<path d="M${xx} 124 Q${xx + 7} 116 ${xx + 14} 124" fill="#77706a" stroke="#000" stroke-opacity=".35"/>`;
      const flowers = [[30, 140, "#ff8fab"], [44, 150, "#ffd43b"], [96, 136, "#da77f2"], [176, 150, "#ff8fab"], [186, 136, "#ffd43b"], [148, 176, "#da77f2"], [24, 178, "#ffa94d"]].map(([a, b, c2]) =>
        `<path d="M${a} ${b} v12" stroke="#2f5a2a" stroke-width="1.4"/><circle cx="${a}" cy="${b}" r="3.6" fill="${c2}" fill-opacity=".85"/><circle cx="${a}" cy="${b}" r="1.3" fill="#fff3bf"/>`).join("");
      const bg = sky(x, 70, 81, { trees: 16 }) + lawn(x, 70, 21, 60) + mulch(x, 122, 17) + edge + shrub(100, 136, 60, 16, 12) + flowers;
      function stake(cx, by, s) {
        return `<g transform="translate(${cx} ${by}) scale(${s})"><path d="M-1.4 0 L0 6 L1.4 0 V-38 H-1.4 Z" fill="#141418"/>
<rect x="-6" y="-58" width="12" height="20" rx="2" fill="${x.on ? H.shade(x.c, -.4) : "#d6dbe6"}" fill-opacity="${x.on ? 1 : .22}"/>${x.on ? `<rect x="-6" y="-58" width="12" height="20" rx="2" fill="${x.url("fill")}" opacity="${x.op(1)}"/>` : ""}
${[-3, 0, 3].map((a) => `<path d="M${a} -57 V-39" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`).join("")}<rect x="-7" y="-40" width="14" height="3" rx="1" fill="#1b1c22"/>
<path d="M-8 -58 L8 -58 L7 -64 L-7 -64 Z" fill="#1b1c22"/><path d="M-7 -64 L7 -64 L5.6 -68 L-5.6 -68 Z" fill="#1d3b78"/><path d="M-2.3 -64 L-1.9 -68 M2.3 -64 L1.9 -68 M-6.3 -66 H6.3" stroke="#8fb3ff" stroke-opacity=".5" stroke-width=".4"/><path d="M-5.6 -68 L-2 -68 L-4.4 -64" fill="#fff" fill-opacity=".12"/></g>`;
      }
      const light = pool(x, 62, 152, 34, 8, .85) + pool(x, 158, 132, 22, 5, .8) + pool(x, 124, 184, 54, 12, .9) + glo(x, 62, 132, 24, 22, .6) + glo(x, 158, 119, 16, 14, .6) + glo(x, 124, 154, 34, 32, .6);
      const fx = shadow(x, 158, 133, 6, 1.2) + stake(158, 132, .72) + shadow(x, 62, 152, 8, 1.6) + stake(62, 152, 1.05) + shadow(x, 124, 184, 12, 2.4) + stake(124, 184, 1.55);
      return svg(x, { bg, light, fx });
    } }),

    // (parts) Multi-Function: the up light and the down light are their own parts (switches); o.mf = only the ticked ones in
    // o.parts, each with its own brightness (o.plevel); one light color (o.pcolor.up, else .down, else the device's). A light
    // left out stays dark. A Device Image (no o.mf) is exactly today's: both lights follow the device.
    base({ id: "updown", name: "Up/down cylinder", colors: [DAY, WARM, SOFT, ICE, VIOLET], cast: "both", glow: { x: .45, y: .5, r: 1.1 },
      parts: [{ id: "up", name: "Up light", type: "switch" }, { id: "down", name: "Down light", type: "switch" }], render(o) {
      const mf = !!o.mf, pp = o.parts || {}, pl = o.plevel || {}, pc = o.pcolor || {};
      if (mf) o = Object.assign({}, o, { on: !!(pp.up || pp.down), color: pc.up || pc.down || o.color, level: Math.max(pp.up ? (pl.up == null ? o.level == null ? 1 : o.level : pl.up) : 0, pp.down ? (pl.down == null ? o.level == null ? 1 : o.level : pl.down) : 0) });
      const x = ctx(o), r = rnd(77), cx = 90;
      const lx = (k) => { if (!mf) return x; const y = Object.assign({}, x), lv = pl[k] == null ? o.level : pl[k]; y.on = !!pp[k]; y.L = y.on ? .3 + .7 * lv : 0; y.op = (q) => Math.min(1, q * y.L).toFixed(2); return y; }, xu = lx("up"), xd = lx("down");
      let stuc = `<rect x="8" y="8" width="184" height="160" fill="#34343a"/>`;
      for (let i = 0; i < 160; i++) stuc += `<circle cx="${f(8 + r() * 184)}" cy="${f(8 + r() * 160)}" r="${f(.3 + r() * 1)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.05 + r() * .08).toFixed(2)}"/>`;
      let grav = `<rect x="8" y="168" width="184" height="24" fill="#2c2b2a"/>`; for (let i = 0; i < 60; i++) grav += `<circle cx="${f(8 + r() * 184)}" cy="${f(170 + r() * 22)}" r="${f(.8 + r() * 1.4)}" fill="${r() > .5 ? "#a39e95" : "#555"}" fill-opacity=".5"/>`;
      const agave = (ax, ay) => [-70, -45, -20, 0, 20, 45, 70].map((a, i) => `<path d="M${ax} ${ay} q${f(Math.sin(a * Math.PI / 180) * 10)} -14 ${f(Math.sin(a * Math.PI / 180) * 26)} ${f(-Math.cos(a * Math.PI / 180) * 26)} q-3 10 ${f(-Math.sin(a * Math.PI / 180) * 20)} ${f(Math.cos(a * Math.PI / 180) * 22)} Z" fill="${H.mix("#5c7f7a", "#3e5c58", i % 2)}"/>`).join("");
      const bg = stuc + `<rect x="140" y="8" width="52" height="160" fill="#4a4d55"/>${[34, 62, 90, 118, 146].map((y) => `<path d="M140 ${y} H192" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/><path d="M140 ${y + 1.2} H192" stroke="#fff" stroke-opacity=".08"/>`).join("")}<rect x="134" y="8" width="6" height="160" fill="#26262b"/>` + grav + agave(40, 176);
      const light = beam(xu, cx, 82, 7, 26, 8, .95) + beam(xd, cx, 122, 7, 26, 170, .95) + (mf ? glo(xu, cx, 82, 30, 40, .3) + glo(xd, cx, 118, 30, 40, .3) : glo(x, cx, 100, 30, 70, .3)) + pool(xd, cx, 172, 34, 6, .9);
      const fx = drop(x, `<rect x="${cx - 10}" y="80" width="20" height="44" rx="2"/>`, 3, 4, .5) + `<rect x="${cx - 10}" y="80" width="20" height="44" rx="2" fill="${x.url("chr")}"/><rect x="${cx - 10.5}" y="99" width="21" height="3" fill="#2a2d35"/>
<ellipse cx="${cx}" cy="80" rx="10" ry="1.6" fill="${xu.on ? x.hot : "#2a2d35"}" ${xu.on ? `opacity="${(.6 + .4 * xu.L).toFixed(2)}"` : ""}/><ellipse cx="${cx}" cy="124" rx="10" ry="1.6" fill="${xd.on ? x.hot : "#2a2d35"}" ${xd.on ? `opacity="${(.6 + .4 * xd.L).toFixed(2)}"` : ""}/>
${glo(xu, cx, 79, 16, 5, 1)}${glo(xd, cx, 125, 16, 5, 1)}`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "globe", name: "Garden globe", colors: [SOFT, VIOLET, BLUE, MINT, ROSE, AMBER], glow: { x: .5, y: .66, r: 1.2 }, render(o) {
      const x = ctx(o);
      const bg = sky(x, 108, 91, { trees: 18, moon: [44, 36] }) + lawn(x, 108, 27, 120) + shrub(172, 120, 40, 24, 2) + shrub(24, 116, 36, 20, 5) +
        [[60, 172], [70, 177], [134, 174], [146, 170], [124, 179]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="4.4" ry="2.4" fill="#8b8680"/><ellipse cx="${a - 1}" cy="${b - .8}" rx="2.6" ry="1" fill="#fff" fill-opacity=".25"/>`).join("");
      const og = rg(x.id("og"), x.on ? [[0, "#ffffff"], [.3, x.hot], [.78, x.c], [1, H.shade(x.c, -.35)]] : [[0, "#f6f4f0"], [.65, "#c9c7cf"], [1, "#6f6e7c"]], .42, .36, .66);
      const light = pool(x, 100, 168, 96, 26, 1) + glo(x, 100, 134, 82, 70, .45);
      const fx = shadow(x, 100, 172, 36, 5, x.on ? .3 : .8) + `<circle cx="100" cy="134" r="40" fill="${x.url("og")}" ${x.on ? `opacity="${(.45 + .55 * x.L).toFixed(2)}"` : ""}/>
${x.on ? `<circle cx="100" cy="134" r="40" fill="#fff" opacity="${x.op(.15)}"/>` : `<circle cx="100" cy="134" r="40" fill="#000" fill-opacity=".08"/>`}
<path d="M70 120 C74 106 86 98 98 97" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/><ellipse cx="80" cy="113" rx="5" ry="2.6" fill="#fff" fill-opacity=".5" transform="rotate(-40 80 113)"/>
<path d="M62 146 Q100 162 138 146" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="3"/>
${grassClump(78, 175, 9, 7, "#4f7a44")}${grassClump(118, 176, 8, 9, "#4f7a44")}`;
      return svg(x, { bg, light, fx }, og);
    } }),

    base({ id: "pillar", name: "Pillar cap light", colors: FLAME, glow: { x: .5, y: .32, r: 1.1 }, render(o) {
      const x = ctx(o);
      let fence = "";
      [[8, 66], [134, 192]].forEach(([a, b]) => {
        fence += `<path d="M${a} 118 H${b} M${a} 158 H${b}" stroke="#0e0e12" stroke-width="2.6"/>`;
        for (let px = a + 4; px < b; px += 8) fence += `<path d="M${px} 112 V170" stroke="#121218" stroke-width="2"/><path d="M${px - 2.4} 113 L${px} 107 L${px + 2.4} 113 Z" fill="#121218"/>`;
      });
      const bg = sky(x, 150, 101, { trees: 22, stars: 18 }) + lawn(x, 150, 33, 60) + fence + bricks(66, 96, 134, 192, 19, "#6b3b2b") + `<rect x="66" y="96" width="10" height="96" fill="#000" fill-opacity=".25"/><rect x="124" y="96" width="10" height="96" fill="#000" fill-opacity=".35"/>
<rect x="60" y="86" width="80" height="11" fill="#8e8a84"/><rect x="60" y="86" width="80" height="2.4" fill="#c9c4bc"/><rect x="60" y="95" width="80" height="2" fill="#000" fill-opacity=".45"/><rect x="62" y="97" width="76" height="3" fill="#000" fill-opacity=".3"/>`;
      const light = glo(x, 100, 64, 78, 56, .6) + E(100, 87, 40, 3, x.url("halo"), `opacity="${x.op(.9)}"`) + `<g class="hda-bg">${beam(x, 100, 100, 34, 40, 192, .45)}</g>` + pool(x, 36, 178, 40, 8, .4) + pool(x, 164, 178, 40, 8, .4);
      const g = "M89 52 H111 V80 H89 Z";
      const fx = drop(x, `<path d="${g}"/>`, 2, 4, .4) + `<rect x="85" y="80" width="30" height="6" fill="${x.url("blk")}"/><rect x="88" y="78" width="24" height="3" fill="${x.url("blk")}"/>
${glass(x, g)}${sleeve(x, 100, 66, 80, 5)}${flame(x, 100, 60, 1)}
<path d="M89 52 V80 M111 52 V80 M100 52 V56" stroke="#121218" stroke-width="2.4"/><path d="${g}" fill="none" stroke="#121218" stroke-width="2"/>${hl("M91.4 55 V77", .3, 1)}
<path d="M82 52 H118 L100 37 Z" fill="${x.url("blk")}"/><path d="M84 51.5 H116" stroke="#fff" stroke-opacity=".15"/><circle cx="100" cy="35" r="2.6" fill="${x.url("blk")}"/>`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "well", name: "In-ground well light", colors: [WARM, DAY, SOFT, ICE, VIOLET], cast: "up", glow: { x: .5, y: .8, r: 1.15 }, render(o) {
      const x = ctx(o);
      const st = stones(8, 8, 192, 150, 91);
      const cp = `<clipPath id="${x.id("bm")}"><path d="M86 160 L36 8 L164 8 L114 160 Z"/></clipPath>`;
      const bg = st.s + `<rect x="8" y="148" width="184" height="5" fill="#000" fill-opacity=".45"/>` + mulch(x, 150, 41) + shrub(28, 160, 36, 22, 5) + shrub(174, 162, 36, 22, 6) + lawn(x, 182, 3, 30);
      const light = beam(x, 100, 162, 13, 66, 8, 1) + `<g class="hda-bg"><g clip-path="${x.url("bm")}"><path d="${st.tops}" stroke="${x.hot}" stroke-opacity="${x.op(.9)}" stroke-width="1.4"/></g></g>` + glo(x, 100, 158, 40, 12, .9);
      const fx = `<ellipse cx="100" cy="164" rx="23" ry="7" fill="${x.url("chr")}"/><ellipse cx="100" cy="164.6" rx="18" ry="5" fill="#1a1c22"/>
${x.on ? `<ellipse cx="100" cy="164.4" rx="15.5" ry="4" fill="${x.hot}" opacity="${(.55 + .45 * x.L).toFixed(2)}"/><ellipse cx="100" cy="164" rx="8" ry="2" fill="#fff" opacity="${x.op(1)}"/>` : `<ellipse cx="100" cy="164.4" rx="15.5" ry="4" fill="${x.url("dg")}"/><path d="M90 163 Q96 161.4 104 161.8" stroke="#fff" stroke-opacity=".3" fill="none"/>`}
<path d="M78 163 Q100 156 122 163" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".8"/>`;
      return svg(x, { bg, light, fx, over: glo(x, 100, 162, 26, 9, .8) }, cp);
    } }),

    base({ id: "slot", name: "Wall slot light", colors: [DAY, WARM, SOFT, ICE, MINT], cast: "down", glow: { x: .5, y: .53, r: 1.1 }, render(o) {
      const x = ctx(o), r = rnd(13);
      let wall = `<rect x="8" y="8" width="184" height="152" fill="#5c5d62"/>`;
      for (let y = 8; y < 160; y += 16) { wall += `<rect x="8" y="${y}" width="184" height="16" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + r() * .05).toFixed(2)}"/><path d="M8 ${y} H192" stroke="#000" stroke-opacity=".3"/>`;
        for (let i = 0; i < 4; i++) wall += `<path d="M${f(8 + r() * 150)} ${f(y + 3 + r() * 10)} h${f(20 + r() * 40)}" stroke="#000" stroke-opacity=".1"/>`; }
      [[34, 40], [166, 40], [34, 120], [166, 120]].forEach(([a, b]) => { wall += `<circle cx="${a}" cy="${b}" r="2.6" fill="#2a2b2e"/>`; });
      const bg = wall + `<rect x="8" y="160" width="184" height="7" fill="#8a8b90"/><rect x="8" y="167" width="184" height="12" fill="#4a4b50"/><rect x="8" y="179" width="184" height="5" fill="#7b7c81"/><rect x="8" y="184" width="184" height="8" fill="#3f4045"/>`;
      const light = beam(x, 100, 106, 36, 92, 160, .9) + E(100, 162, 82, 4, x.url("pool"), `opacity="${x.op(.9)}"`) + glo(x, 100, 172, 70, 8, .35);
      const fx = drop(x, `<rect x="62" y="94" width="76" height="12" rx="2"/>`, 2, 3, .5) + `<rect x="62" y="94" width="76" height="12" rx="2" fill="${x.url("blkv")}"/><path d="M63 95 H137" stroke="#fff" stroke-opacity=".2"/>
<rect x="66" y="104" width="68" height="2.4" rx="1" fill="${x.on ? x.hot : "#0b0b0e"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : ""}/>${x.on ? `<rect x="70" y="104.4" width="60" height="1.4" fill="#fff" opacity="${x.op(1)}"/>` : ""}`;
      return svg(x, { bg, light, fx, over: glo(x, 100, 107, 46, 6, .9) });
    } }),

    base({ id: "hanging", name: "Hanging lantern", colors: FLAME, glow: { x: .5, y: .5, r: 1.1 }, render(o) {
      const x = ctx(o);
      let ceil = `<rect x="8" y="8" width="184" height="22" fill="#5d4732"/>`;
      for (let xx = 8; xx < 192; xx += 11) ceil += `<path d="M${xx} 8 V30" stroke="#000" stroke-opacity=".35"/>`;
      let floor = `<rect x="8" y="172" width="184" height="20" fill="#4b4238"/>`;
      for (let i = -4; i <= 24; i++) { const bx = 8 + i * 10; floor += `<path d="M${f(100 + (bx - 100) * .55)} 172 L${f(bx + (bx - 100) * .3)} 192" stroke="#000" stroke-opacity=".35"/>`; }
      const bg = ceil + `<rect x="8" y="30" width="184" height="4" fill="${x.url("wht")}"/>` + siding(8, 34, 192, 172, "#737881") + windowPane(x, 22, 64, 36, 56) +
        `<rect x="150" y="56" width="42" height="116" fill="${x.url("wht")}"/><rect x="156" y="62" width="36" height="110" fill="#22343a"/><rect x="162" y="70" width="24" height="30" fill="#000" fill-opacity=".25"/>` + floor;
      const light = glo(x, 100, 30, 84, 14, .5) + glo(x, 100, 100, 86, 74, .55) + pool(x, 100, 182, 76, 9, .85);
      let chain = ""; for (let y = 32; y < 60; y += 5) chain += `<ellipse cx="100" cy="${y + 2.5}" rx="${(y / 5) % 2 ? 1.4 : 2.2}" ry="2.8" fill="none" stroke="#202027" stroke-width="1.3"/>`;
      const g = "M86 76 H114 V122 H86 Z";
      const fx = `<ellipse cx="100" cy="31" rx="9" ry="2.4" fill="${x.url("blk")}"/>${chain}<circle cx="100" cy="61" r="3" fill="none" stroke="#202027" stroke-width="1.6"/>
${drop(x, `<path d="${g}"/>`, 3, 5, .35)}${glass(x, g)}
${(() => { let s = ""; const rr = rnd(9); for (let i = 0; i < 22; i++) s += `<circle cx="${f(87 + rr() * 26)}" cy="${f(78 + rr() * 42)}" r="${f(.4 + rr() * .7)}" fill="#fff" fill-opacity="${x.on ? .45 : .2}"/>`; return s; })()}
${edison(x, 100, 96, 1.05)}
<path d="M93 76 V122 M107 76 V122" stroke="#15151b" stroke-width="1.6"/><path d="M86 99 H114" stroke="#15151b" stroke-width="1.2" stroke-opacity=".7"/><path d="${g}" fill="none" stroke="#15151b" stroke-width="2.6"/>${hl("M88.6 79 V119", .3, 1)}
<path d="M82 76 H118 L110 64 H90 Z" fill="${x.url("blk")}"/><rect x="96" y="60" width="8" height="5" fill="${x.url("blk")}"/><path d="M84 75.4 H116" stroke="#fff" stroke-opacity=".16"/>
<path d="M84 122 H116 L109 131 H91 Z" fill="${x.url("blk")}"/><circle cx="100" cy="134" r="2.6" fill="${x.url("blk")}"/>`;
      return svg(x, { bg, light, fx });
    } }),

    base({ id: "eave", name: "Eave LED track", colors: RGB, cast: "down", glow: { x: .5, y: .3, r: 1.35 }, render(o) {
      const x = ctx(o);
      const bg = shingles(x, 8, 38, 5) + `<rect x="8" y="38" width="184" height="8" fill="${x.url("wht")}"/><rect x="8" y="46" width="184" height="12" fill="#8c8f96"/>${Array.from({ length: 16 }, (_, i) => `<path d="M${14 + i * 12} 49 v6" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`).join("")}<rect x="8" y="57" width="184" height="2" fill="#000" fill-opacity=".4"/>` +
        siding(8, 59, 192, 192, "#6a6455") + windowPane(x, 70, 108, 60, 56, true) + shrub(30, 190, 50, 26, 3) + shrub(170, 192, 50, 26, 4);
      const px = []; for (let a = 17; a < 192; a += 22) px.push(a);
      const light = px.map((a) => beam(x, a, 61, 2.4, 15, 160, .45)).join("") + E(100, 66, 100, 16, x.url("halo"), `opacity="${x.op(.45)}"`);
      const fx = `<rect x="8" y="57" width="184" height="4" fill="${x.url("alu")}"/>` + px.map((a) => `<circle cx="${a}" cy="61.2" r="2.1" fill="${x.on ? x.hot : "#2a2c33"}" ${x.on ? `opacity="${(.6 + .4 * x.L).toFixed(2)}"` : 'stroke="#000" stroke-opacity=".4" stroke-width=".5"'}/>${x.on ? `<circle cx="${a}" cy="61.2" r="1" fill="#fff" opacity="${x.op(1)}"/>` : ""}`).join("");
      return svg(x, { bg, light, fx, over: px.map((a) => glo(x, a, 62, 9, 5, .9)).join("") });
    } }),

    base({ id: "icicle", name: "Icicle lights", colors: [WARM, ICE, DAY, BLUE, VIOLET, RED], cast: "down", glow: { x: .5, y: .24, r: 1.3 }, render(o) {
      const x = ctx(o), r = rnd(101);
      const bg = shingles(x, 8, 28, 9) + `<path d="M8 22 Q30 16 52 22 T96 21 T140 22 T192 20 V30 H8 Z" fill="#e6eef8"/><path d="M8 28 Q60 25 192 28" stroke="#fff" stroke-opacity=".6" fill="none"/>` +
        `<rect x="8" y="29" width="184" height="9" fill="${x.url("wht")}"/><path d="M8 30 H192" stroke="#fff" stroke-opacity=".8"/><rect x="8" y="37" width="184" height="2" fill="#000" fill-opacity=".35"/>` +
        siding(8, 39, 192, 176, "#4c5868") + windowPane(x, 74, 92, 52, 60, true) +
        `<circle cx="100" cy="122" r="0" fill="none"/><path d="M8 176 Q50 170 100 176 T192 174 V192 H8 Z" fill="#dfe8f3"/><path d="M8 178 Q60 173 120 178 T192 176" stroke="#fff" stroke-opacity=".6" fill="none"/>`;
      const lens = [12, 22, 34, 16, 28, 40, 18, 26, 14, 36, 22, 30];
      let wire = `<path d="M8 40 Q100 44 192 40" fill="none" stroke="#1d2b22" stroke-width="1.1"/>`, bulbs = "", halos = "";
      let k = 0;
      for (let xx = 12; xx < 192; xx += 7, k++) {
        const len = lens[k % lens.length] * 1.35 + (r() - .5) * 6, top = 40 + Math.sin((xx - 8) / 184 * Math.PI) * 4;
        wire += `<path d="M${xx} ${f(top)} V${f(top + len)}" stroke="#1d2b22" stroke-width=".7"/>`;
        for (let y = top + 5, j = 0; y <= top + len; y += 6.5, j++) {
          const delay = ((k * 0.53 + j * 0.31) % 2.4).toFixed(2);
          bulbs += x.on ? `<g class="${P}tw2" style="animation-delay:-${delay}s"><ellipse cx="${xx}" cy="${f(y)}" rx="1.9" ry="2.6" fill="${x.c}" opacity="${(.6 + .4 * x.L).toFixed(2)}"/><ellipse cx="${xx}" cy="${f(y - .3)}" rx=".9" ry="1.3" fill="#fff" opacity="${x.op(1)}"/></g>`
            : `<ellipse cx="${xx}" cy="${f(y)}" rx="1.3" ry="2" fill="#dfe6f0" fill-opacity=".35"/>`;
          if (x.on && (k + j) % 2 === 0) halos += `<g class="${P}tw2" style="animation-delay:-${delay}s"><circle cx="${xx}" cy="${f(y)}" r="7" fill="${x.url("halo")}" opacity="${x.op(.9)}"/></g>`;
        }
      }
      const light = E(100, 60, 104, 34, x.url("halo"), `opacity="${x.op(.45)}"`) + beam(x, 100, 42, 92, 100, 176, .35);
      return svg(x, { bg, light, fx: wire + bulbs, over: halos });
    } }),
  ];

  const C2T = {"coach": {"l": "Frame", "ids": ["blk"], "c": ["#2a2b33", "#5a4636", "#c9a24a", "#eceae6", "#2f4a34", "#7a8088"]}, "gooseneck": {"l": "Shade", "ids": ["galv"], "c": ["#a9b0b8", "#2a2b33", "#2f5a3a", "#a8322a", "#eceae6", "#c9a24a"]}, "flush": {"l": "Frame", "ids": ["blk", "blkv"], "c": ["#2a2b33", "#5a4636", "#c9a24a", "#eceae6", "#9aa0b2"]}, "post": {"l": "Frame", "ids": ["blk"], "c": ["#2a2b33", "#5a4636", "#2f4a34", "#eceae6", "#c9a24a"]}, "pagoda": {"l": "Finish", "ids": ["brz"], "c": ["#5a4232", "#2a2b33", "#c9a24a", "#7a9a8a", "#9aa0b2"]}, "mushroom": {"l": "Cap", "ids": ["cop"], "c": ["#a8603a", "#5a4232", "#2a2b33", "#c9a24a", "#7a9a8a"]}, "treespot": {"l": "Housing", "ids": ["brz"], "c": ["#5a4232", "#2a2b33", "#c9a24a", "#7a9a8a"]}, "flood": {"l": "Housing", "ids": ["wht"], "c": ["#ecebf0", "#2a2b33", "#5a4636", "#9aa0b2"]}, "deckstep": {"l": "Housing", "ids": ["blkv"], "c": ["#2a2b33", "#a7abb2", "#5a4636", "#eceae6"]}, "bollard": {"l": "Body", "ids": ["brz"], "c": ["#5a4232", "#2a2b33", "#9aa0b2", "#eceae6", "#c9a24a"]}, "updown": {"l": "Finish", "ids": ["chr"], "c": ["#c9ccd6", "#2a2b33", "#5a4636", "#eceae6", "#c9a24a"]}, "globe": {"l": "Globe", "ids": ["og"], "off": true, "c": ["#c9c7cf", "#e8b4c0", "#a8c4d8", "#e0d090", "#a8d8b0"]}, "pillar": {"l": "Frame", "ids": ["blk"], "c": ["#2a2b33", "#5a4636", "#c9a24a", "#2f4a34", "#eceae6"]}, "well": {"l": "Trim", "ids": ["chr"], "c": ["#c9ccd6", "#2a2b33", "#c9a24a", "#5a4636"]}, "slot": {"l": "Housing", "ids": ["blkv"], "c": ["#2a2b33", "#a7abb2", "#eceae6", "#5a4636"]}, "hanging": {"l": "Frame", "ids": ["blk"], "c": ["#2a2b33", "#5a4636", "#c9a24a", "#eceae6", "#2f4a34"]}, "eave": {"l": "Track", "ids": ["alu"], "c": ["#8a909a", "#2a2b33", "#eceae6", "#5a4636"]}};
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
    id: "outdoor",
    tab: "Outdoor lights",
    group: "Outdoor",
    kind: "light",
    intro: "Twenty outdoor and landscape lights, each in its own evening scene: porch, path, yard, deck, driveway and eaves. Lit fixtures glow in the light color and throw their pool or beam onto what is around them.",
    
    css: `.hda-anim .hda-outdoor-blink{animation:hda-outdoor-blink 1.6s steps(1) infinite}
@keyframes hda-outdoor-blink{0%{opacity:1}50%{opacity:.15}}
.hda-anim .hda-outdoor-tw{animation:hda-outdoor-tw 2.2s ease-in-out infinite}
@keyframes hda-outdoor-tw{0%,100%{opacity:1}50%{opacity:.7}}
.hda-anim .hda-outdoor-tw2{animation:hda-outdoor-tw2 2.4s ease-in-out infinite}
@keyframes hda-outdoor-tw2{0%,100%{opacity:1}50%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-outdoor-blink,.hda-anim .hda-outdoor-tw,.hda-anim .hda-outdoor-tw2{animation:none}}`,
    icons,
  });
})();
