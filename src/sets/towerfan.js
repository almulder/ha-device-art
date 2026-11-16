(function () {
  const H = window.HDAH, sh = H.shade, rgba = H.rgba, mix = H.mix;
  const P = "hda-towerfan-";
  const f = (n) => Math.round(n * 100) / 100;
  const C = { black: "#2b2c31", white: "#eeeeea", silver: "#b8bec6", wood: "#9a6a44", gray: "#858a92", sand: "#e6dccb",
    mint: "#a9dcc9", sky: "#b9d3f0", pink: "#f3c3d0", butter: "#f3e2a6", chrome: "#dfe4ea", steel: "#9aa2aa", rubber: "#222327", oak: "#c8a274" };
  const WOODS = { "#9a6a44": 1, "#6e4a30": 1, "#c8a274": 1, "#8a5a3b": 1, "#b88a5a": 1 };
  const isWood = (c) => !!WOODS[String(c).toLowerCase()];
  const SW = [C.black, C.white, C.silver, C.wood, C.gray];
  const sw = (first, extra) => [first].concat(SW.filter((x) => x !== first), extra || []);
  const AIR = "#d6ebff", LEDC = "#7dd3fc", GREEN = "#34d399", AMBER = "#ffbf69";
  // (multi-function) parts: o.parts holds only the parts the user ticked; a part left out follows the one device as a
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

  function K(o) {
    const u = o.uid, defs = [], seen = {};
    const st = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] == null ? "" : ` stop-opacity="${s[2]}"`}/>`).join("");
    const k = {
      u, on: !!o.on, lv: Math.max(0.05, Math.min(1, +o.level || 0)), c: o.color || C.black, pre: "",
      def(n, s) { if (!seen[n]) { seen[n] = 1; defs.push(s); } return `url(#${u}-${n})`; },
      lin(n, a, x1 = 0, y1 = 0, x2 = 1, y2 = 0) { return k.def(n, `<linearGradient id="${u}-${n}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st(a)}</linearGradient>`); },
      rad(n, a, cx = 0.5, cy = 0.5, r = 0.5) { return k.def(n, `<radialGradient id="${u}-${n}" cx="${cx}" cy="${cy}" r="${r}">${st(a)}</radialGradient>`); },
      clip(n, d) { k.def("c" + n, `<clipPath id="${u}-c${n}"><path d="${d}"/></clipPath>`); return `url(#${u}-c${n})`; },
      svg(b) { return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="${P}svg" aria-hidden="true"><defs>${defs.join("")}</defs>${k.pre}${b}</svg>`; },
    };
    return k;
  }

  const MAT = {
    plastic: (c) => [[0, sh(c, -0.45)], [0.18, sh(c, -0.05)], [0.34, sh(c, 0.4)], [0.5, sh(c, 0.1)], [0.8, sh(c, -0.22)], [1, sh(c, -0.52)]],
    matte: (c) => [[0, sh(c, -0.5)], [0.3, sh(c, 0.16)], [0.6, c], [1, sh(c, -0.55)]],
    metal: (c) => [[0, sh(c, -0.55)], [0.18, sh(c, 0.2)], [0.36, sh(c, 0.72)], [0.55, c], [0.8, sh(c, -0.25)], [1, sh(c, -0.6)]],
    chrome: (c) => [[0, sh(c, -0.7)], [0.12, sh(c, 0.55)], [0.28, sh(c, -0.42)], [0.44, "#ffffff"], [0.6, sh(c, -0.15)], [0.84, sh(c, -0.62)], [1, sh(c, 0.15)]],
    gloss: (c) => [[0, sh(c, -0.4)], [0.16, sh(c, 0.05)], [0.3, sh(c, 0.75)], [0.38, sh(c, 0.25)], [0.7, sh(c, -0.12)], [1, sh(c, -0.5)]],
    wood: (c) => [[0, sh(c, -0.45)], [0.26, sh(c, 0.18)], [0.6, c], [1, sh(c, -0.45)]],
  };
  const mg = (k, c, kind = "plastic") => k.lin(kind + c.slice(1), MAT[kind](c));
  const mv = (k, c, kind = "plastic") => k.lin("v" + kind + c.slice(1), MAT[kind](c), 0, 0, 0, 1);
  const kindOf = (c, d = "plastic") => (isWood(c) ? "wood" : String(c).toLowerCase() === C.silver ? (d === "chrome" ? "chrome" : "metal") : d);
  const dur = (k, a, b) => (a - b * k.lv).toFixed(2);
  const lit = (k) => (k.on ? 1 : 0);

  const win = (cx, y1, y2, gw, ry) => `M${f(cx - gw)} ${f(y1)}A${f(gw)} ${f(ry)} 0 0 0 ${f(cx + gw)} ${f(y1)}L${f(cx + gw)} ${f(y2)}A${f(gw)} ${f(ry)} 0 0 1 ${f(cx - gw)} ${f(y2)}Z`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)}V${f(y + h - r)}Q${f(x + w)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)}H${f(x + r)}Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)}V${f(y + r)}Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)}Z`;
  const cylD = (cx, yT, yB, rx, ry) => `M${f(cx - rx)} ${f(yT)}L${f(cx + rx)} ${f(yT)}L${f(cx + rx)} ${f(yB)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(yB)}Z`;
  const cylClip = (cx, yT, yB, rx, ry) => `M${f(cx - rx)} ${f(yT)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(yT)}L${f(cx + rx)} ${f(yB)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(yB)}Z`;
  function prof(y1, y2, xc, hw, ry, band, N = 30) {
    const L = [], R = [];
    for (let i = 0; i <= N; i++) { const t = i / N, y = y1 + (y2 - y1) * t; L.push(`${f(xc(t) - hw(t))} ${f(y)}`); R.unshift(`${f(xc(t) + hw(t))} ${f(y)}`); }
    const hb = hw(1), ht = hw(0);
    return `M${L.join("L")}A${f(hb)} ${f(ry)} 0 0 0 ${R[0]}L${R.join("L")}` + (band ? `A${f(ht)} ${f(ry)} 0 0 1 ${L[0]}Z` : "Z");
  }

  function shadow(k, cx, y, rx) { k.pre += `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f(rx * 0.16)}" fill="${k.rad("shd", [[0, "#000", 0.55], [0.6, "#000", 0.22], [1, "#000", 0]])}"/>`; return ""; }
  function topE(k, cx, y, rx, ry, c, kind) {
    return `<ellipse cx="${f(cx)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${k.rad("tp" + kind + c.slice(1), [[0, sh(c, kind === "matte" ? 0.22 : 0.4)], [0.7, sh(c, 0.06)], [1, sh(c, -0.25)]], 0.42, 0.3, 0.75)}"/>` +
      `<path d="M${f(cx - rx * 0.97)} ${f(y + ry * 0.15)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx * 0.97)} ${f(y + ry * 0.15)}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".9"/>` +
      `<path d="M${f(cx - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(y)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".7"/>`;
  }
  function puck(k, cx, yT, yB, rx, ry, c, kind = "plastic", top = true) {
    return `<path d="${cylD(cx, yT, yB, rx, ry)}" fill="${mg(k, c, kind)}"/><path d="M${f(cx - rx)} ${f(yB)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(yB)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>` +
      (top ? topE(k, cx, yT, rx, ry, c, kind) : "");
  }
  function disc(k, cx, yF, rx, h, c, kind, dome = 0) {
    const ry = rx * 0.26, yB = yF - ry, yT = yB - h;
    let s = puck(k, cx, yT, yB, rx, ry, c, kind);
    if (dome) s += `<path d="M${f(cx - rx * 0.94)} ${f(yT)}A${f(rx * 0.94)} ${f(ry + dome)} 0 0 1 ${f(cx + rx * 0.94)} ${f(yT)}A${f(rx * 0.94)} ${f(ry * 0.94)} 0 0 1 ${f(cx - rx * 0.94)} ${f(yT)}Z" fill="${k.rad("dm" + c.slice(1), [[0, sh(c, 0.5)], [0.5, c], [1, sh(c, -0.5)]], 0.38, 0.3, 0.75)}"/>`;
    return s;
  }
  function box(k, x, y, w, h, r, d, c, kind, o = {}) {
    const dy = d * 0.6, side = sh(c, -0.42), top = o.top || sh(c, 0.25);
    return `<path d="${rr(x + d, y - dy, w, h, r)}" fill="${side}"/>` +
      `<path d="M${f(x + w)} ${f(y + r)}L${f(x + w + d)} ${f(y + r - dy)}L${f(x + w + d)} ${f(y + h - r - dy)}L${f(x + w)} ${f(y + h - r)}Z" fill="${k.lin("sd" + c.slice(1), [[0, sh(c, -0.3)], [1, sh(c, -0.6)]])}"/>` +
      `<path d="M${f(x + r)} ${f(y)}L${f(x + r + d)} ${f(y - dy)}L${f(x + w - r + d)} ${f(y - dy)}L${f(x + w - r)} ${f(y)}Z" fill="${top}"/>` +
      `<path d="${rr(x, y, w, h, r)}" fill="${o.fill || mg(k, c, kind)}"/>` +
      `<path d="M${f(x + r)} ${f(y + 0.5)}H${f(x + w - r)}" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
  }
  function grain(k, key, d, x1, x2, y1, y2, c) {
    let s = "";
    for (let i = 0; i < 7; i++) { const x = x1 + ((x2 - x1) * (i + 0.5)) / 7, wv = (i % 2 ? 1 : -1) * 1.2;
      s += `<path d="M${f(x)} ${f(y1)}C${f(x + wv)} ${f(y1 + (y2 - y1) * 0.3)} ${f(x - wv)} ${f(y1 + (y2 - y1) * 0.6)} ${f(x + wv * 0.5)} ${f(y2)}" stroke="${sh(c, -0.5)}" stroke-opacity="${i % 3 ? 0.28 : 0.4}" stroke-width="${i % 3 ? 0.5 : 0.8}" fill="none"/>`; }
    s += `<ellipse cx="${f(x1 + (x2 - x1) * 0.62)}" cy="${f(y1 + (y2 - y1) * 0.35)}" rx="1.2" ry="4" fill="none" stroke="${sh(c, -0.5)}" stroke-opacity=".35" stroke-width=".5"/>`;
    return `<g clip-path="${k.clip("w" + key, d)}">${s}</g>`;
  }

  function shell(k, key, d, x1, x2, y1, y2, c, kind, o = {}) {
    const W = x2 - x1, gA = { plastic: 0.24, matte: 0.1, metal: 0.34, chrome: 0.3, gloss: 0.42, wood: 0.12 }[kind] || 0.2;
    let s = `<path d="${d}" fill="${o.fill || mg(k, c, kind)}"/>`;
    if (kind === "wood") s += grain(k, key, d, x1, x2, y1, y2, c);
    s += `<path d="${d}" fill="${k.lin("vsh", [[0, "#fff", 0.1], [0.45, "#fff", 0], [1, "#000", 0.22]], 0, 0, 0, 1)}"/>`;
    const band = `<rect x="${f(x1 + W * 0.2)}" y="${f(y1 - 6)}" width="${f(W * 0.09)}" height="${f(y2 - y1 + 12)}" fill="#fff" fill-opacity="${gA}"/>` +
      `<rect x="${f(x1 + W * 0.31)}" y="${f(y1 - 6)}" width="${f(W * 0.03)}" height="${f(y2 - y1 + 12)}" fill="#fff" fill-opacity="${f(gA * 0.5)}"/>`;
    s += `<g clip-path="${k.clip("s" + key, o.clip || d)}"><g class="${k.on ? P + "shine" : ""}">${band}</g>` +
      `<rect x="${f(x1 + W * 0.88)}" y="${f(y1 - 6)}" width="${f(W * 0.05)}" height="${f(y2 - y1 + 12)}" fill="#fff" fill-opacity=".1"/></g>`;
    return s + `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width=".7"/>`;
  }
  function cyl(k, key, cx, yT, yB, rx, ry, c, kind, o = {}) {
    return shell(k, key, cylD(cx, yT, yB, rx, ry), cx - rx, cx + rx, yT, yB + ry, c, kind, { clip: cylClip(cx, yT, yB, rx, ry), fill: o.fill }) +
      (o.noTop ? "" : topE(k, cx, yT, rx, ry, o.topC || c, o.topK || kind));
  }

  function barsV(k, cx, gw, y1, y2, n, bc, o = {}) {
    let s = ""; const A = o.flat ? 0 : 1.3;
    for (let i = 0; i < n; i++) { const t = -1 + (2 * i + 1) / n, th = t * (A || 1), x = A ? cx + (gw * Math.sin(th)) / Math.sin(A) : cx + gw * t, w = (o.bw || 1.5) * (A ? Math.cos(th) : 1) + 0.3;
      s += `<rect x="${f(x - w / 2)}" y="${f(y1)}" width="${f(w)}" height="${f(y2 - y1)}" fill="${mg(k, bc, "plastic")}"/>`; }
    return s;
  }
  function barsH(k, cx, gw, y1, y2, ry, gap, bc, bw = 1.6) {
    let s = "";
    for (let y = y1 + gap * 0.6; y < y2 + ry; y += gap) {
      s += `<path d="M${f(cx - gw - 1)} ${f(y + 0.9)}A${f(gw + 1)} ${f(ry)} 0 0 0 ${f(cx + gw + 1)} ${f(y + 0.9)}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".7"/>` +
        `<path d="M${f(cx - gw - 1)} ${f(y)}A${f(gw + 1)} ${f(ry)} 0 0 0 ${f(cx + gw + 1)} ${f(y)}" fill="none" stroke="${bc}" stroke-width="${bw}"/>` +
        `<path d="M${f(cx - gw * 0.7)} ${f(y - bw * 0.3 + ry * 0.7)}A${f(gw)} ${f(ry)} 0 0 0 ${f(cx + gw * 0.1)} ${f(y - bw * 0.3 + ry)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>`;
    }
    return s;
  }
  function barsCurve(k, xc, hw, y1, y2, n, bc) {
    let s = "";
    for (let i = 0; i < n; i++) { const t = -1 + (2 * i + 1) / n, pts = [];
      for (let j = 0; j <= 20; j++) { const u = j / 20; pts.push(`${f(xc(u) + hw(u) * Math.sin(t * 1.2) / Math.sin(1.2))} ${f(y1 + (y2 - y1) * u)}`); }
      s += `<path d="M${pts.join("L")}" fill="none" stroke="${bc}" stroke-width="${f(1.6 * Math.cos(t * 1.2) + 0.3)}"/>`; }
    return s;
  }
  function grille(k, key, d, bb, bars, o = {}) {
    const [x1, y1, x2, y2] = bb, cp = k.clip("g" + key, d), p = 3.4, on = k.on;
    let imp = "";
    for (let x = x1 - 2 * p; x < x2 + p; x += p) imp += `<rect x="${f(x)}" y="${f(y1 - 4)}" width="${f(p * 0.5)}" height="${f(y2 - y1 + 8)}" fill="${k.lin("bl", [[0, "#23272e"], [0.5, "#c7ced8"], [1, "#363b44"]])}"/>`;
    let rings = "";
    for (let y = y1 + 22; y < y2 - 6; y += 26) rings += `<rect x="${f(x1)}" y="${f(y)}" width="${f(x2 - x1)}" height="1.3" fill="#1a1c21"/>`;
    const blow = `<g class="${on ? P + "flow" : ""}" style="animation-duration:${dur(k, 1.05, 0.8)}s">${imp}</g>`;
    return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="2.4"/>` +
      `<path d="${d}" fill="#121419"/>` +
      `<g clip-path="${cp}">` + (o.noBlow ? "" : blow + rings) +
      `<rect x="${f(x1 - 1)}" y="${f(y1 - 6)}" width="${f(x2 - x1 + 2)}" height="${f(y2 - y1 + 12)}" fill="${k.lin("gsh", [[0, "#000", 0.85], [0.3, "#000", 0.08], [0.55, "#000", 0], [0.8, "#000", 0.3], [1, "#000", 0.9]])}"/>` +
      `<rect x="${f(x1 - 1)}" y="${f(y1 - 6)}" width="${f(x2 - x1 + 2)}" height="${f(y2 - y1 + 12)}" fill="${k.lin("gtb", [[0, "#000", 0.6], [0.08, "#000", 0], [0.92, "#000", 0], [1, "#000", 0.5]], 0, 0, 0, 1)}"/>` +
      bars +
      `<rect x="${f(x1 - 1)}" y="${f(y1 - 6)}" width="${f(x2 - x1 + 2)}" height="${f(y2 - y1 + 12)}" fill="${k.lin("gb2", [[0, "#000", 0.45], [0.3, "#000", 0], [0.7, "#000", 0], [1, "#000", 0.5]])}"/>` +
      `</g><path d="${d}" fill="none" stroke="${o.frame || "#000"}" stroke-opacity="${o.frame ? 0.9 : 0.4}" stroke-width=".8"/>`;
  }
  function cgrille(k, key, cx, y1, y2, gw, ry, kind, o = {}) {
    const bc = o.bc || sh(k.c, 0.04);
    const bars = kind === "h" ? barsH(k, cx, gw, y1, y2, ry, o.gap || 4, bc, o.bw) : kind === "none" ? "" : barsV(k, cx, gw, y1 - ry - 2, y2 + ry + 2, o.n || 11, bc, o);
    return grille(k, key, win(cx, y1, y2, gw, ry), [cx - gw, y1 - ry, cx + gw, y2 + ry], bars + (o.extra || ""), o);
  }

  function osc(k, inner, delay = 0) { return `<g class="${k.on ? P + "osc" : ""}"${delay ? ` style="animation-delay:-${delay}s"` : ""}>${inner}</g>`; }
  function air(k, cx, y1, y2, gw, n = 4, o = {}) {
    if (!k.on) return "";
    const d = dur(k, 2.7, 1.2); let s = "";
    for (let i = 0; i < n; i++) { const y = y1 + ((y2 - y1) * i) / Math.max(1, n - 1);
      [-1, 1].forEach((sd) => { const x = cx + sd * (gw + 3);
        s += `<path class="${P}air${sd < 0 ? "l" : "r"}" style="animation-duration:${d}s;animation-delay:-${f(i * 0.55 + (sd > 0 ? 0.3 : 0))}s" d="M${f(x)} ${f(y)}c${sd * 5} -3.2 ${sd * 9} 3 ${sd * 15} -0.4" fill="none" stroke="${o.col || AIR}" stroke-opacity="${f(0.3 + 0.25 * k.lv)}" stroke-width="1.3" stroke-linecap="round"/>`; }); }
    if (o.front) for (let i = 0; i < 3; i++) s += `<ellipse class="${P}wave" style="animation-duration:${d}s;animation-delay:-${f(i * 0.8)}s" cx="${cx}" cy="${f((y1 + y2) / 2)}" rx="${f(gw + 6)}" ry="${f((y2 - y1) * 0.35)}" fill="none" stroke="${AIR}" stroke-opacity=".35" stroke-width="1"/>`;
    return s;
  }

  const SEG = { a: [0, 0, 1, 0], b: [1, 0, 1, 0.5], c: [1, 0.5, 1, 1], d: [0, 1, 1, 1], e: [0, 0.5, 0, 1], f: [0, 0, 0, 0.5], g: [0, 0.5, 1, 0.5] };
  const DIG = ["abcdef", "bc", "abged", "abgcd", "fgbc", "afgcd", "afgedc", "abc", "abcdefg", "abcdfg"];
  function digits(k, x, y, h, str, col = LEDC) {
    const w = h * 0.55, sw0 = h * 0.17; let s = "", glow = "";
    String(str).split("").forEach((ch, i) => { const dd = DIG[+ch] || "", ox = x + i * (w + h * 0.36);
      Object.keys(SEG).forEach((g) => { const on = dd.indexOf(g) >= 0, q = SEG[g], dpath = `M${f(ox + q[0] * w)} ${f(y + q[1] * h)}L${f(ox + q[2] * w)} ${f(y + q[3] * h)}`;
        s += `<path d="${dpath}" stroke="${on && k.on ? col : "#ffffff"}" stroke-opacity="${on && k.on ? 1 : 0.07}" stroke-width="${f(sw0)}" stroke-linecap="round"/>`;
        if (on && k.on) glow += `<path d="${dpath}" stroke="${col}" stroke-opacity=".22" stroke-width="${f(sw0 * 2.2)}" stroke-linecap="round"/>`; }); });
    return glow + s;
  }
  function lcd(k, x, y, w, h, inner, r = 2) {
    return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${k.lin("lcd", [[0, "#0a0c10"], [1, "#1c2028"]], 0, 0, 0, 1)}" stroke="#000" stroke-opacity=".5" stroke-width=".6"/>` +
      inner + `<path d="M${f(x + r)} ${f(y + 0.7)}H${f(x + w - r)}" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>`;
  }
  function dots(k, x, y, n, gap, col = LEDC, vert = false) {
    const m = k.on ? Math.max(1, Math.ceil(k.lv * n)) : 0; let s = "";
    for (let i = 0; i < n; i++) { const X = vert ? x : x + i * gap, Y = vert ? y - i * gap : y, L = i < m;
      s += (L ? `<circle cx="${f(X)}" cy="${f(Y)}" r="2.2" fill="${col}" fill-opacity=".25"/>` : "") + `<circle cx="${f(X)}" cy="${f(Y)}" r=".95" fill="${L ? col : "#5a5f68"}" fill-opacity="${L ? 1 : 0.6}"/>`; }
    return s;
  }
  const led = (k, x, y, col = GREEN, r = 1.2) => (k.on ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 2.4)}" fill="${col}" fill-opacity=".25" class="${P}pulse"/>` : "") + `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${k.on ? col : "#50545c"}"/>`;
  function topBtns(k, cx, y, n, gap, bc = "#d9dce2", hot = 1) {
    let s = "";
    for (let i = 0; i < n; i++) { const x = cx + (i - (n - 1) / 2) * gap, dn = k.on && i === hot;
      s += `<ellipse cx="${f(x)}" cy="${f(y + 0.5)}" rx="2.3" ry="1.05" fill="#000" fill-opacity=".45"/><ellipse cx="${f(x)}" cy="${f(y + (dn ? 0.25 : 0))}" rx="2.1" ry=".9" fill="${k.rad("btn" + bc.slice(1), [[0, sh(bc, 0.5)], [1, sh(bc, -0.25)]], 0.4, 0.3, 0.7)}"/>`; }
    return s;
  }
  function knob(k, x, y, r, c, ang) {
    const a = (ang * Math.PI) / 180;
    return `<ellipse cx="${f(x)}" cy="${f(y + 1.1)}" rx="${f(r)}" ry="${f(r * 0.42)}" fill="#000" fill-opacity=".45"/>` +
      `<path d="M${f(x - r)} ${f(y)}V${f(y + 1)}A${f(r)} ${f(r * 0.42)} 0 0 0 ${f(x + r)} ${f(y + 1)}V${f(y)}Z" fill="${mg(k, c, "plastic")}"/>` +
      `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r)}" ry="${f(r * 0.42)}" fill="${k.rad("kn" + c.slice(1), [[0, sh(c, 0.45)], [1, sh(c, -0.2)]], 0.4, 0.3, 0.75)}"/>` +
      `<path d="M${f(x)} ${f(y)}L${f(x + Math.sin(a) * r * 0.85)} ${f(y - Math.cos(a) * r * 0.85 * 0.42)}" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`;
  }
  function remote(k, x, y, c) {
    return `<ellipse cx="${x + 12}" cy="${y + 6}" rx="16" ry="2.6" fill="#000" fill-opacity=".35"/>` +
      `<path d="M${x} ${y + 2}L${x + 22} ${y - 1}Q${x + 26} ${y - 1.5} ${x + 26} ${y + 1.5}L${x + 26} ${y + 3}Q${x + 26} ${y + 5} ${x + 22} ${y + 5.5}L${x + 2} ${y + 7}Q${x - 1} ${y + 7} ${x} ${y + 4}Z" fill="${sh(c, -0.35)}"/>` +
      `<path d="M${x} ${y + 1}L${x + 22} ${y - 2}Q${x + 26} ${y - 2.5} ${x + 26} ${y}L${x + 25.6} ${y + 1.6}Q${x + 25} ${y + 3.6} ${x + 22} ${y + 3.8}L${x + 2} ${y + 5}Q${x - 1} ${y + 5} ${x} ${y + 2.6}Z" fill="${k.lin("rm" + c.slice(1), [[0, sh(c, 0.3)], [1, sh(c, -0.15)]], 0, 0, 0, 1)}"/>` +
      `<ellipse cx="${x + 5}" cy="${y + 2.5}" rx="1.7" ry=".9" fill="#e5484d"/>` +
      [10, 14, 18].map((xx, i) => `<ellipse cx="${x + xx}" cy="${f(y + 1.9 - i * 0.5)}" rx="1.3" ry=".7" fill="${sh(c, c === C.white ? -0.3 : 0.4)}"/>`).join("");
  }

  const icons = [];
  const cxx = 100;

  icons.push({ id: "classic", name: "Classic 42-inch", colors: sw(C.black), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c, "matte"), cx = cxx;
      const tw = cyl(k, "b", cx, 18, 172, 17, 4.4, c, kd) +
        `<ellipse cx="${cx}" cy="18" rx="13" ry="3.2" fill="${k.lin("tpan", [[0, "#15161a"], [1, "#30333a"]], 0, 0, 0, 1)}"/>` + topBtns(k, cx - 2, 18, 4, 5.2, "#c9ccd3", Math.min(3, Math.floor(k.lv * 3.99))) + led(k, cx + 9.5, 18.2, GREEN, 0.8) +
        lcd(k, cx - 8, 27, 16, 10, digits(k, cx - 2.2, 29, 6, String(Math.max(1, Math.round(k.lv * 8)))), 2) +
        cgrille(k, "g", cx, 46, 162, 10.5, 2.8, "v", { n: 11 });
      return k.svg(shadow(k, cx, 187, 40) + disc(k, cx, 188, 30, 6, c, kd) + osc(k, tw) + air(k, cx, 56, 156, 17)); } });

  icons.push({ id: "display", name: "LED display", colors: sw(C.white), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = 96;
      const glass = win(cx, 26, 58, 14.5, 4.6);
      const tw = cyl(k, "b", cx, 16, 172, 19, 4.8, c, kd) +
        `<path d="${glass}" fill="${k.lin("gls", [[0, "#07080b"], [0.35, "#22262e"], [0.5, "#121419"], [1, "#050608"]])}"/>` +
        digits(k, cx - 5.5, 33, 11, String(Math.max(1, Math.round(k.lv * 8)))) +
        dots(k, cx - 8, 50, 5, 4) + `<path d="M${cx + 7} 36a2.6 2.6 0 1 1 .01 0" fill="none" stroke="${k.on ? LEDC : "#4a4f58"}" stroke-width=".8"/>` +
        `<path d="M${cx - 12} 30Q${cx - 6} 27 ${cx + 2} 28" stroke="#fff" stroke-opacity=".25" stroke-width="1.2" fill="none"/>` +
        cgrille(k, "g", cx, 66, 162, 12.5, 3.2, "v", { n: 14, bw: 1.2 });
      return k.svg(shadow(k, cx + 10, 187, 50) + disc(k, cx, 188, 31, 5, c, kd, 2.5) + osc(k, tw) + air(k, cx, 74, 154, 19) + remote(k, 140, 177, C.black)); } });

  icons.push({ id: "slim", name: "Slim 36-inch", colors: sw(C.silver), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx;
      const tw = cyl(k, "b", cx, 42, 174, 12.5, 3.4, c, kd) + knob(k, cx, 41.5, 4.2, "#3a3d44", -60 + k.lv * 120 * lit(k)) +
        `<rect x="${cx - 6}" y="50" width="12" height="4" rx="2" fill="#15171c"/>` + dots(k, cx - 3.5, 52, 3, 3.5, GREEN) +
        cgrille(k, "g", cx, 62, 166, 8.3, 2.3, "h", { gap: 3.6, bc: sh(c, 0.1), bw: 1.4 });
      const foot = box(k, cx - 17, 176, 32, 9, 2, 5, sh(c, -0.25), "plastic");
      return k.svg(shadow(k, cx + 2, 187, 30) + foot + osc(k, tw) + air(k, cx, 72, 158, 13)); } });

  icons.push({ id: "woodgrain", name: "Wood grain", colors: sw(C.wood, [C.oak]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), x = 82, y = 26, w = 34, h = 146, cx = x + w / 2;
      const front = rr(x, y, w, h, 5);
      const tw = box(k, x, y, w, h, 5, 4.5, c, kd, { top: "#202227", fill: "none" }) + shell(k, "b", front, x, x + w, y, y + h, c, kd) +
        topBtns(k, cx + 3.5, y - 2.4, 3, 6, "#9aa0aa", 1) + led(k, cx - 8, y - 2.2, "#ff9a4a", 0.7) +
        `<rect x="${cx - 9}" y="34" width="18" height="9" rx="1.5" fill="#0d0e11"/>` + digits(k, cx - 3.6, 35.6, 5.6, "2" + Math.max(1, Math.round(k.lv * 6)), "#ffb454") +
        cgrille(k, "g", cx, 52, 164, 9.5, 0, "v", { n: 8, flat: 1, bc: "#2a2b30", bw: 1.8, frame: sh(c, -0.55) });
      return k.svg(shadow(k, cx + 4, 187, 38) + box(k, cx - 24, 174, 48, 11, 2, 7, "#26272c", "matte") + osc(k, tw) + air(k, cx, 62, 156, 17)); } });

  icons.push({ id: "pedestal", name: "Pedestal tower", colors: sw(C.gray), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx;
      const stem = `<rect x="${cx - 3}" y="130" width="6" height="46" fill="${mg(k, C.chrome, "chrome")}"/>`;
      const tw = puck(k, cx, 124, 132, 8, 2.4, sh(c, -0.2), kd) + cyl(k, "b", cx, 16, 124, 18, 4.6, c, kd) +
        lcd(k, cx - 9, 24, 18, 9, digits(k, cx - 6, 25.8, 5.4, "7" + Math.max(1, Math.round(k.lv * 9))), 4.5) + led(k, cx + 6, 28.5, GREEN, 0.8) +
        cgrille(k, "g", cx, 40, 118, 11, 3, "v", { n: 12 });
      return k.svg(shadow(k, cx, 187, 38) + disc(k, cx, 188, 30, 5, c, kd, 3.5) + stem + osc(k, tw) + air(k, cx, 48, 112, 18)); } });

  icons.push({ id: "handle", name: "Carry handle", colors: sw(C.white), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx;
      const hole = rr(cx - 11, 23, 22, 9, 4.5);
      const tw = cyl(k, "b", cx, 16, 172, 19, 4.8, c, kd) +
        `<path d="${hole}" fill="${k.lin("hole", [[0, "#07070c"], [1, "#2a2836"]], 0, 0, 0, 1)}"/><path d="${hole}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>` +
        `<path d="M${cx - 10.4} 32V29.2Q${cx - 10.4} 28 ${cx - 8} 28H${cx + 8}Q${cx + 10.4} 28 ${cx + 10.4} 29.2V32Z" fill="${sh(c, -0.35)}"/><path d="M${cx - 9} 32.4H${cx + 9}" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/><path d="M${cx - 9} 24H${cx + 9}" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/>` +
        [-7, 0, 7].map((dx, i) => `<circle cx="${cx + dx}" cy="42" r="2.6" fill="#000" fill-opacity=".35"/><circle cx="${cx + dx}" cy="41.6" r="2.3" fill="${k.rad("rb", [[0, "#ffffff"], [1, "#a9adb5"]], 0.4, 0.3, 0.7)}"/>` +
          `<circle cx="${cx + dx}" cy="38" r=".6" fill="${k.on && i <= Math.floor(k.lv * 2.99) ? LEDC : "#6a6f78"}"/>`).join("") +
        cgrille(k, "g", cx, 52, 162, 12, 3.2, "h", { gap: 4.2 });
      return k.svg(shadow(k, cx, 187, 38) + disc(k, cx, 188, 27, 7, c, kd) + osc(k, tw) + air(k, cx, 62, 154, 19)); } });

  icons.push({ id: "wave", name: "Curved wave", colors: sw(C.silver), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), y1 = 16, y2 = 170;
      const xc = (t) => 100 + 8 * Math.sin(t * Math.PI * 1.5 - 0.5), hw = (t) => 13.5 + 3 * Math.sin(t * Math.PI) + 2 * t;
      const body = prof(y1, y2, xc, hw, 4);
      const g1 = 0.17, g2 = 0.93, gy1 = y1 + (y2 - y1) * g1, gy2 = y1 + (y2 - y1) * g2;
      const bx = (u) => xc(g1 + (g2 - g1) * u), bw = (u) => hw(g1 + (g2 - g1) * u) * 0.58;
      const band = prof(gy1, gy2, bx, bw, 3, true);
      const hl = []; for (let i = 0; i <= 20; i++) { const t = i / 20; hl.push(`${f(xc(t) - hw(t) * 0.55)} ${f(y1 + 3 + (y2 - y1 - 6) * t)}`); }
      const tw = shell(k, "b", body, 80, 122, y1, y2, c, kd) + `<path d="M${hl.join("L")}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round"/>` +
        topE(k, xc(0), y1, hw(0), 4, c, kd) + `<ellipse cx="${f(xc(0))}" cy="${y1}" rx="7" ry="1.8" fill="#1a1b20"/>` + led(k, xc(0) - 1, y1, LEDC, 0.7) + led(k, xc(0) + 3, y1, LEDC, 0.7) +
        grille(k, "g", band, [80, gy1 - 3, 122, gy2 + 3], barsCurve(k, bx, bw, gy1 - 4, gy2 + 4, 8, sh(c, 0.05)));
      return k.svg(shadow(k, xc(1), 187, 36) + disc(k, xc(1), 188, 28, 5, c, kd) + osc(k, tw) + air(k, xc(0.55), 58, 150, 20)); } });

  icons.push({ id: "cylinder", name: "360 cylinder", colors: sw(C.black), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx, rx = 25, ry = 6.4;
      const ring = k.on ? `<ellipse cx="${cx}" cy="34" rx="12" ry="3" fill="none" stroke="${LEDC}" stroke-opacity=".3" stroke-width="3.4"/>` : "";
      const tw = cyl(k, "b", cx, 34, 168, rx, ry, c, kd) +
        cgrille(k, "g", cx, 50, 154, rx - 0.5, ry, "v", { n: 22, bw: 1.2, bc: sh(c, 0.06) }) +
        `<ellipse cx="${cx}" cy="34" rx="18" ry="4.6" fill="${k.lin("tpan", [[0, "#111216"], [1, "#34373e"]], 0, 0, 0, 1)}"/>` + ring +
        `<ellipse cx="${cx}" cy="34" rx="12" ry="3" fill="none" stroke="${k.on ? LEDC : "#4c5059"}" stroke-width="${k.on ? 1.1 : 0.8}" stroke-dasharray="${f(75 * k.lv * lit(k) + 0.01)} 80"/>` +
        `<ellipse cx="${cx}" cy="34" rx="4" ry="1.2" fill="${k.rad("btn0", [[0, "#ffffff"], [1, "#8a8f98"]], 0.4, 0.3, 0.7)}"/>`;
      const waves = k.on ? [0, 1, 2].map((i) => `<ellipse class="${P}wave" style="animation-duration:${dur(k, 2.8, 1.1)}s;animation-delay:-${i * 0.9}s" cx="${cx}" cy="104" rx="34" ry="9" fill="none" stroke="${AIR}" stroke-opacity=".35" stroke-width="1"/>`).join("") : "";
      return k.svg(shadow(k, cx, 187, 44) + disc(k, cx, 188, 32, 6, sh(c, -0.1), kd) + osc(k, tw) + waves + air(k, cx, 60, 148, 26, 4)); } });

  icons.push({ id: "slot", name: "Air slot tower", colors: sw(C.silver), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx, rx = 14, yT = 12, yB = 140;
      const body = `M${cx - rx} ${yB}V${yT + rx}A${rx} ${rx} 0 0 1 ${cx + rx} ${yT + rx}V${yB}Z`;
      const slot = rr(cx - 1.8, 30, 3.6, 104, 1.8);
      const sl = k.clip("sl", slot);
      const shim = k.on ? `<g clip-path="${sl}"><rect class="${P}slide" style="animation-duration:${dur(k, 1.8, 1)}s" x="${cx - 2}" y="104" width="4" height="30" fill="${k.lin("shm", [[0, LEDC, 0], [0.5, "#e8f7ff", 0.9], [1, LEDC, 0]], 0, 0, 0, 1)}"/></g>` : "";
      const perf = k.def("perf", `<pattern id="${k.u}-perf" width="3.4" height="3" patternUnits="userSpaceOnUse"><circle cx="1.7" cy="1.5" r=".85" fill="#000" fill-opacity=".6"/></pattern>`);
      const base = puck(k, cx, 142, 176, 21, 5.2, c, kd, false) + `<path d="${win(cx, 148, 170, 20, 5.2)}" fill="${perf}"/>` +
        `<path d="${win(cx, 148, 170, 20, 5.2)}" fill="${k.lin("pbs", [[0, "#000", 0.5], [0.3, "#000", 0], [0.7, "#000", 0], [1, "#000", 0.55]])}"/>` + topE(k, cx, 142, 21, 5.2, sh(c, -0.1), kd) + led(k, cx, 141.5, LEDC, 0.9);
      const tw = shell(k, "b", body, cx - rx, cx + rx, yT, yB, c, kd) + `<ellipse cx="${cx}" cy="${yB}" rx="${rx}" ry="3.6" fill="${sh(c, -0.35)}"/>` +
        `<path d="${slot}" fill="#0c0d11"/>${shim}<path d="M${cx + 2.4} 31V133" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`;
      return k.svg(shadow(k, cx, 187, 34) + disc(k, cx, 188, 26, 4, sh(c, -0.15), kd) + base + osc(k, tw) + air(k, cx, 40, 128, 6, 5, { col: "#e1f3ff" })); } });

  icons.push({ id: "mini", name: "Mini desk", colors: sw(C.white), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = 96;
      const desk = `<path d="M8 168H192V176H8Z" fill="${k.lin("dk", [[0, "#c79a6a"], [1, "#9c7149"]], 0, 0, 0, 1)}"/><path d="M8 176H192V186H8Z" fill="${k.lin("dkf", [[0, "#7a5536"], [1, "#4f3521"]], 0, 0, 0, 1)}"/>` +
        `<path d="M8 168.5H192" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>` +
        `<path d="M118 167C134 167 140 160 160 162S186 165 192 164" fill="none" stroke="#1d1e22" stroke-width="2.2"/>`;
      const tw = cyl(k, "b", cx, 82, 156, 15, 3.8, c, kd) + topBtns(k, cx, 82, 1, 0, "#c8ccd4") + led(k, cx + 7, 82.4, LEDC, 0.7) +
        cgrille(k, "g", cx, 96, 150, 9.5, 2.6, "v", { n: 9 });
      return k.svg(`<g class="hda-bg">${desk}</g>` + `<ellipse cx="${cx}" cy="167" rx="28" ry="3.4" fill="#000" fill-opacity=".3"/>` + disc(k, cx, 168, 20, 4, c, kd) + osc(k, tw) + air(k, cx, 104, 146, 15, 3)); } });

  icons.push({ id: "mist", name: "Misting tower", colors: sw(C.white), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx;
      const tank = win(cx, 134, 164, 15, 4.2), lvl = 142;
      const tk = k.clip("tk", tank);
      const bub = k.on ? [0, 1, 2, 3].map((i) => `<circle class="${P}rise" style="animation-duration:2.6s;animation-delay:-${i * 0.65}s" cx="${cx - 9 + i * 6}" cy="166" r="${0.8 + (i % 2) * 0.5}" fill="#fff" fill-opacity=".7"/>`).join("") : "";
      const mist = k.on ? [0, 1, 2, 3].map((i) => `<ellipse class="${P}mist" style="animation-duration:${dur(k, 3.2, 1)}s;animation-delay:-${f(i * 0.8)}s" cx="${cx - 3 + (i % 2) * 6}" cy="24" rx="7" ry="5" fill="${k.rad("mst", [[0, "#ffffff", 0.75], [1, "#ffffff", 0]])}"/>`).join("") : "";
      const tw = cyl(k, "b", cx, 16, 172, 19, 4.8, c, kd) + topBtns(k, cx - 4, 16, 3, 5) + led(k, cx + 10, 16.4, LEDC, 0.7) +
        `<path d="${win(cx, 28, 34, 9, 2.4)}" fill="#111317"/>` + [-6, -2, 2, 6].map((dx) => `<circle cx="${cx + dx}" cy="${f(33.2)}" r=".8" fill="#5a6370"/>`).join("") +
        cgrille(k, "g", cx, 46, 126, 12.5, 3.2, "h", { gap: 4 }) +
        `<path d="${tank}" fill="${k.lin("tkg", [[0, "#cfe8f7", 0.5], [1, "#a8cfe8", 0.35]], 0, 0, 0, 1)}"/>` +
        `<g clip-path="${tk}"><rect x="${cx - 16}" y="${lvl}" width="32" height="30" fill="${k.lin("wat", [[0, "#7cc4ef"], [1, "#2a74b8"]], 0, 0, 0, 1)}"/>` +
        `<path d="M${cx - 16} ${lvl}A15 4.2 0 0 0 ${cx + 16} ${lvl}" fill="none" stroke="#e6f6ff" stroke-width=".8"/>${bub}` +
        `<rect x="${cx - 16}" y="130" width="32" height="40" fill="${k.lin("gsh2", [[0, "#000", 0.5], [0.3, "#000", 0], [0.75, "#000", 0], [1, "#000", 0.5]])}"/></g>` +
        `<path d="${tank}" fill="none" stroke="${sh(c, -0.35)}" stroke-width=".8"/><path d="M${cx - 10} 138V160" stroke="#fff" stroke-opacity=".55" stroke-width="1.2" stroke-linecap="round"/>`;
      return k.svg(shadow(k, cx, 187, 38) + disc(k, cx, 188, 28, 6, c, kd) + osc(k, tw + mist) + air(k, cx, 56, 120, 19, 3)); } });

  icons.push({ id: "smart", name: "Touch strip", colors: sw(C.black), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c, "gloss"), cx = cxx, y1 = 18, y2 = 172;
      const xc = () => cx, hw = (t) => 14 + 5 * t;
      const body = prof(y1, y2, xc, hw, 4);
      const strip = rr(cx - 3.2, 26, 6.4, 44, 3.2);
      const n = 7, m = k.on ? Math.max(1, Math.ceil(k.lv * n)) : 0;
      let seg = ""; for (let i = 0; i < n; i++) { const y = 62 - i * 5, L = i < m;
        seg += (L ? `<rect x="${cx - 2.6}" y="${y - 1.6}" width="5.2" height="3.6" rx="1.6" fill="#c4b5fd" fill-opacity=".3"/>` : "") + `<rect x="${cx - 1.5}" y="${y - 0.6}" width="3" height="1.4" rx=".7" fill="${L ? "#c4b5fd" : "#5a5f68"}" fill-opacity="${L ? 1 : 0.55}"/>`; }
      const wifi = [3.2, 2].map((r) => `<path d="M${f(cx - r)} ${f(31 + r * 0.2)}A${r} ${r} 0 0 1 ${f(cx + r)} ${f(31 + r * 0.2)}" fill="none" stroke="${k.on ? LEDC : "#5a5f68"}" stroke-width=".7" stroke-linecap="round"/>`).join("") + `<circle cx="${cx}" cy="32" r=".6" fill="${k.on ? LEDC : "#5a5f68"}"/>`;
      const g1 = 0.36, g2 = 0.94, gy1 = y1 + (y2 - y1) * g1, gy2 = y1 + (y2 - y1) * g2, bw = (u) => hw(g1 + (g2 - g1) * u) * 0.62;
      const band = prof(gy1, gy2, xc, bw, 3, true);
      const tw = shell(k, "b", body, cx - 19, cx + 19, y1, y2, c, kd) + topE(k, cx, y1, 14, 4, c, kd) +
        `<path d="${strip}" fill="${k.lin("gls", [[0, "#07080b"], [0.4, "#262a33"], [1, "#050608"]])}"/>${seg}${wifi}` +
        grille(k, "g", band, [cx - 13, gy1 - 3, cx + 13, gy2 + 3], barsCurve(k, xc, bw, gy1 - 4, gy2 + 4, 11, sh(c, 0.08)));
      return k.svg(shadow(k, cx, 187, 38) + disc(k, cx, 188, 26, 3, sh(c, -0.2), kd) + osc(k, tw) + air(k, cx, 86, 158, 18)); } });

  icons.push({ id: "ceramic", name: "Ceramic look", colors: [C.sand, C.white, C.black, C.gray, C.silver, C.wood], picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c, "gloss"), cx = cxx, y1 = 22, y2 = 178;
      const xc = () => cx, hw = (t) => 10.5 + 10 * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.55) - 3 * Math.max(0, t - 0.75);
      const body = prof(y1, y2, xc, hw, 4.4);
      const g1 = 0.2, g2 = 0.86, gy1 = y1 + (y2 - y1) * g1, gy2 = y1 + (y2 - y1) * g2, bw = (u) => hw(g1 + (g2 - g1) * u) * 0.6;
      const band = prof(gy1, gy2, xc, bw, 3, true);
      const fab = k.def("fab", `<pattern id="${k.u}-fab" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#3a3c42"/><path d="M0 1H2M1 0V2" stroke="#25272c" stroke-width=".6"/></pattern>`);
      const fabric = `<path d="${band}" fill="${fab}" fill-opacity=".86"/>` + (k.on ? `<path d="${band}" fill="${LEDC}" fill-opacity="${f(0.04 + 0.05 * k.lv)}"/>` : "");
      const tw = shell(k, "b", body, cx - 20, cx + 20, y1, y2, c, kd) + topE(k, cx, y1, hw(0), 3.2, c, kd) +
        `<ellipse cx="${cx}" cy="${y1}" rx="7" ry="2" fill="${k.lin("tpan", [[0, "#121317"], [1, "#30333a"]], 0, 0, 0, 1)}"/>` + led(k, cx, y1, "#f5d58a", 0.8) +
        `<path d="M${f(cx - hw(0.09))} 36A${f(hw(0.09))} 3 0 0 0 ${f(cx + hw(0.09))} 36" fill="none" stroke="${mg(k, "#c4954a", "metal")}" stroke-width="2.2"/>` +
        grille(k, "g", band, [cx - 14, gy1 - 3, cx + 14, gy2 + 3], fabric, {}) +
        `<path d="M${f(cx - hw(0.5) * 0.78)} 70Q${f(cx - hw(0.5) * 0.92)} 120 ${f(cx - hw(0.9) * 0.8)} 166" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`;
      return k.svg(shadow(k, cx, 187, 32) + osc(k, tw) + air(k, cx, 70, 150, 18)); } });

  icons.push({ id: "twin", name: "Twin column", colors: sw(C.gray), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx, L = 86, R = 114;
      const bridge = `<path d="${rr(70, 18, 60, 18, 9)}" fill="${mv(k, c, kd === "wood" ? "wood" : "plastic")}"/><path d="${rr(70, 18, 60, 18, 9)}" fill="${k.lin("brs", [[0, "#000", 0.35], [0.25, "#000", 0], [0.75, "#000", 0], [1, "#000", 0.4]])}"/>` +
        `<path d="M78 19.4H122" stroke="#fff" stroke-opacity=".45" stroke-width=".9"/>` +
        lcd(k, cx - 10, 22, 20, 10, digits(k, cx - 6.5, 24, 6, "2" + Math.max(1, Math.round(k.lv * 9))), 3) + led(k, 78, 27, GREEN, 0.8) + led(k, 122, 27, k.on ? LEDC : GREEN, 0.8);
      const colm = (x, key) => cyl(k, key, x, 34, 168, 11, 2.9, c, kd, { noTop: 1 }) + cgrille(k, "g" + key, x, 46, 160, 6.6, 1.8, "v", { n: 7, bw: 1.3 });
      const tw = colm(L, "l") + colm(R, "r") + bridge;
      return k.svg(shadow(k, cx, 187, 46) + box(k, 64, 172, 72, 10, 3, 6, sh(c, -0.15), kd) + osc(k, tw) + air(k, cx, 56, 152, 26)); } });

  icons.push({ id: "tall", name: "Extra-tall 48-inch", colors: sw(C.black), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx;
      const trim = (y) => `<path d="M${cx - 14} ${y}A14 3.6 0 0 0 ${cx + 14} ${y}" fill="none" stroke="${mg(k, C.chrome, "chrome")}" stroke-width="1.6"/>`;
      const tw = cyl(k, "b", cx, 10, 176, 14, 3.6, c, kd, { topC: "#1a1b20", topK: "gloss" }) +
        `<path d="${win(cx, 15, 30, 11, 3)}" fill="${k.lin("gls", [[0, "#060709"], [0.4, "#262a33"], [1, "#050608"]])}"/>` +
        digits(k, cx - 4.6, 18, 6.4, "7" + Math.max(1, Math.round(k.lv * 9)), "#f8fafc") + dots(k, cx - 6, 28.4, 4, 4, "#f8fafc") +
        trim(34) + trim(172) +
        cgrille(k, "g", cx, 40, 166, 9, 2.4, "h", { gap: 3.8, bc: sh(c, 0.12) });
      return k.svg(shadow(k, cx, 187, 34) + disc(k, cx, 188, 23, 3.5, C.chrome, "chrome") + osc(k, tw) + air(k, cx, 50, 160, 15, 5)); } });

  icons.push({ id: "kids", name: "Kids rounded", colors: [C.mint, C.sky, C.pink, C.butter, C.white, C.gray], picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx, x = 74, y = 52, w = 52, h = 126;
      const body = rr(x, y, w, h, 24);
      const slot = rr(cx - 12, 82, 24, 82, 12);
      let soft = ""; for (let yy = 90; yy < 160; yy += 7) soft += `<rect x="${cx - 14}" y="${yy}" width="28" height="3.4" rx="1.7" fill="${mg(k, sh(c, 0.15), "plastic")}"/>`;
      const tw = shell(k, "b", body, x, x + w, y, y + h, c, kd) +
        grille(k, "g", slot, [cx - 12, 82, cx + 12, 164], soft) +
        `<circle cx="${cx}" cy="68" r="7.6" fill="#000" fill-opacity=".25"/><circle cx="${cx}" cy="67" r="7" fill="${k.rad("bb", [[0, "#ffd29a"], [0.6, "#ff9a4a"], [1, "#d96a1c"]], 0.4, 0.3, 0.7)}"/>` +
        `<path d="M${cx - 3} 63.6a5 4 0 0 1 5 -1.2" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M${cx - 2} 66.4a2 2 0 1 0 4 0" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-opacity="${k.on ? 1 : 0.6}"/>` +
        led(k, cx + 13, 66, GREEN, 1);
      const feet = [x + 12, x + w - 12].map((fx) => `<ellipse cx="${fx}" cy="181" rx="7" ry="3.2" fill="${C.rubber}"/>`).join("");
      return k.svg(shadow(k, cx, 186, 34) + feet + osc(k, tw) + air(k, cx, 96, 152, 26, 3)); } });

  icons.push({ id: "aqring", name: "Air-quality ring", colors: sw(C.white), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c), cx = cxx;
      const aq = k.lv > 0.66 ? GREEN : k.lv > 0.33 ? "#facc15" : "#fb923c";
      const ringC = k.on ? aq : "#5a5f68";
      const perf = k.def("perf", `<pattern id="${k.u}-perf" width="2.8" height="2.8" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r=".95" fill="#000"/></pattern>`);
      const plate = `<path d="${win(cx, 58, 164, 12.5, 3.2)}" fill="${sh(c, -0.05)}" fill-opacity=".72"/><path d="${win(cx, 58, 164, 12.5, 3.2)}" fill="${perf}" fill-opacity=".7"/>`;
      const tw = cyl(k, "b", cx, 16, 172, 18, 4.6, c, kd) + topBtns(k, cx, 16, 3, 6) +
        `<ellipse cx="${cx}" cy="38" rx="10" ry="10.6" fill="${k.lin("lcdr", [[0, "#0d0f13"], [1, "#22262e"]], 0, 0, 0, 1)}"/>` +
        (k.on ? `<ellipse class="${P}pulse" cx="${cx}" cy="38" rx="7.4" ry="8" fill="none" stroke="${aq}" stroke-opacity=".35" stroke-width="4.5"/>` : "") +
        `<ellipse cx="${cx}" cy="38" rx="7.4" ry="8" fill="none" stroke="${ringC}" stroke-width="1.6"/>` + digits(k, cx - 4, 35, 5.4, String(Math.round(10 + 30 * (1 - k.lv))).padStart(2, "1"), "#e8f2ff") +
        cgrille(k, "g", cx, 58, 164, 12.5, 3.2, "none", { extra: plate });
      return k.svg(shadow(k, cx, 187, 38) + disc(k, cx, 188, 28, 5, c, kd) + osc(k, tw) + air(k, cx, 68, 156, 18)); } });

  icons.push({ id: "retro", name: "Retro chrome", colors: sw(C.silver), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c, "chrome"), cx = cxx, ch = C.chrome;
      const cap = puck(k, cx, 22, 28, 18.5, 4.7, ch, "chrome") + puck(k, cx, 17, 22, 14, 3.6, ch, "chrome") + puck(k, cx, 13, 17, 9, 2.4, ch, "chrome") +
        knob(k, cx, 11.5, 5, "#7a1f22", -70 + 140 * k.lv * lit(k));
      const fins = [-1, 1].map((sd) => `<path d="M${cx + sd * 17} 40L${cx + sd * 21} 48V150L${cx + sd * 17} 158Z" fill="${mg(k, ch, "chrome")}"/>`).join("");
      const tw = fins + cyl(k, "b", cx, 30, 168, 17, 4.4, c, kd, { noTop: 1 }) + cap +
        cgrille(k, "g", cx, 40, 158, 12, 3, "h", { gap: 5.4, bc: "#e7ebf0", bw: 2.4 }) + led(k, cx, 35, "#ff6b6b", 0.9);
      const base = disc(k, cx, 188, 30, 4, ch, "chrome") + puck(k, cx, 170, 176, 22, 5.6, ch, "chrome");
      return k.svg(shadow(k, cx, 187, 40) + base + osc(k, tw) + air(k, cx, 52, 148, 20)); } });

  icons.push({ id: "budget", name: "Budget gray", colors: sw(C.gray), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, kd = kindOf(c, "matte"), x = 84, y = 30, w = 32, h = 144, cx = x + w / 2;
      const front = rr(x, y, w, h, 3);
      const tw = box(k, x, y, w, h, 3, 6, c, kd, { fill: "none" }) + shell(k, "b", front, x, x + w, y, y + h, c, kd) +
        knob(k, cx - 5, y - 2, 4.4, "#ededed", -90 + 180 * k.lv * lit(k)) + knob(k, cx + 9, y - 2.4, 3.6, "#ededed", 30) +
        `<rect x="${cx - 4}" y="38" width="8" height="2" rx="1" fill="#000" fill-opacity=".3"/>` + led(k, cx + 10, 39, "#ff9a4a", 0.8) +
        cgrille(k, "g", cx, 46, 166, 11, 0, "h", { gap: 4.6, bc: sh(c, 0.08), bw: 1.8 });
      const plinth = box(k, cx - 20, 175, 40, 8, 2, 6, sh(c, -0.2), "matte") + [cx - 16, cx + 16].map((fx) => `<rect x="${fx - 3}" y="182" width="6" height="3" rx="1" fill="${C.rubber}"/>`).join("");
      return k.svg(shadow(k, cx + 3, 187, 34) + plinth + osc(k, tw) + air(k, cx, 56, 160, 17)); } });

  // (parts) Fan (the tower turns, air) and Light (the night-light strips, the moon key and the base ring, in the light's
  // color, dimmed by its level). As a Device Image both follow the one device, as before.
  icons.push({ id: "nightlight", name: "Night-light strip", colors: sw(C.black), picker: true, colorLabel: "Body",
    parts: [{ id: "fan", name: "Fan" }, { id: "light", name: "Night light" }],
    render(o) { const k = K(MF.as(o, "fan")), c = k.c, kd = kindOf(c), cx = cxx, on = MF.on(o, "light"), AMBER = MF.col(o, "light", "#ffbf69");
      const a = 0.45 + 0.55 * Math.max(0.05, Math.min(1, +MF.lv(o, "light") || 0));
      const TIP = AMBER === "#ffbf69" ? "#fff4dc" : mix(AMBER, "#ffffff", 0.75);
      if (on) k.pre += `<ellipse cx="${cx}" cy="184" rx="58" ry="10" fill="${k.rad("pool", [[0, AMBER, f(0.5 * a)], [1, AMBER, 0]])}"/>`;
      const strip = (sd) => { const x = cx + sd * 13.6;
        return (on ? `<rect x="${x - 2.4}" y="38" width="4.8" height="134" rx="2.4" fill="${AMBER}" fill-opacity="${f(0.22 * a)}"/>` : "") +
          `<rect x="${x - 0.9}" y="40" width="1.8" height="130" rx=".9" fill="${on ? k.lin("ns", [[0, TIP], [0.5, AMBER], [1, TIP]], 0, 0, 0, 1) : "#3e4047"}" fill-opacity="${on ? f(a) : 1}"/>`; };
      const moon = `<path d="M${cx + 1.4} 15.2a2.6 2.6 0 1 0 1.6 3.2a2 2 0 1 1 -1.6 -3.2Z" fill="${on ? AMBER : "#6a6f78"}"/>`;
      const tw = cyl(k, "b", cx, 18, 172, 17, 4.4, c, kd) + topBtns(k, cx - 5, 18, 2, 6, "#9aa0aa", 0) + moon +
        cgrille(k, "g", cx, 40, 166, 9, 2.4, "v", { n: 9 }) + strip(-1) + strip(1);
      const ring = `<path d="M${cx - 27} 180A27 7 0 0 0 ${cx + 27} 180" fill="none" stroke="${on ? AMBER : "#3e4047"}" stroke-opacity="${on ? f(a) : 1}" stroke-width="1.4"/>`;
      return k.svg(shadow(k, cx, 187, 36) + disc(k, cx, 188, 28, 5, c, kd) + ring + osc(k, tw) + air(k, cx, 50, 160, 19)); } });

  (window.HDA = window.HDA || []).push({
    id: "towerfan", tab: "Tower fans", group: "Fans", kind: "fan",
    intro: "Tall, slim tower fans. On, the tower turns slowly side to side, the blower behind the grille whirs (faster with the speed slider), air drifts out and the displays light up.",
    
    css: `
.hda-towerfan-svg{overflow:visible}
.hda-towerfan-osc{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-towerfan-osc{animation:hda-towerfan-osc 8s ease-in-out infinite}
@keyframes hda-towerfan-osc{0%,50%,100%{transform:translateX(0) scaleX(1) skewY(0deg)}25%{transform:translateX(-2px) scaleX(.88) skewY(1.4deg)}75%{transform:translateX(2px) scaleX(.88) skewY(-1.4deg)}}
.hda-anim .hda-towerfan-shine{animation:hda-towerfan-shine 8s ease-in-out infinite}
@keyframes hda-towerfan-shine{0%,50%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(9px)}}
.hda-anim .hda-towerfan-flow{animation:hda-towerfan-flow .6s linear infinite}
@keyframes hda-towerfan-flow{from{transform:translateX(0)}to{transform:translateX(3.4px)}}
.hda-towerfan-airl,.hda-towerfan-airr{opacity:.8}
.hda-anim .hda-towerfan-airl{animation:hda-towerfan-airl 2s ease-out infinite}
.hda-anim .hda-towerfan-airr{animation:hda-towerfan-airr 2s ease-out infinite}
@keyframes hda-towerfan-airl{0%{opacity:0;transform:translateX(2px)}35%{opacity:1}100%{opacity:0;transform:translateX(-12px)}}
@keyframes hda-towerfan-airr{0%{opacity:0;transform:translateX(-2px)}35%{opacity:1}100%{opacity:0;transform:translateX(12px)}}
.hda-towerfan-wave{transform-box:fill-box;transform-origin:50% 50%;opacity:0}
.hda-anim .hda-towerfan-wave{animation:hda-towerfan-wave 2.4s ease-out infinite}
@keyframes hda-towerfan-wave{0%{opacity:0;transform:scale(.7)}35%{opacity:.8}100%{opacity:0;transform:scale(1.15)}}
.hda-towerfan-rise{opacity:.8}
.hda-anim .hda-towerfan-rise{animation:hda-towerfan-rise 1.4s linear infinite}
@keyframes hda-towerfan-rise{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(-34px)}}
.hda-towerfan-slide{opacity:.7}
.hda-anim .hda-towerfan-slide{animation:hda-towerfan-slide 1.4s linear infinite}
@keyframes hda-towerfan-slide{0%{opacity:0;transform:translateY(0)}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateY(-78px)}}
.hda-towerfan-mist{transform-box:fill-box;transform-origin:50% 50%;opacity:.5}
.hda-anim .hda-towerfan-mist{animation:hda-towerfan-mist 3s ease-out infinite}
@keyframes hda-towerfan-mist{0%{opacity:0;transform:translateY(0) scale(.4)}30%{opacity:.9}100%{opacity:0;transform:translateY(-14px) scale(1.8)}}
.hda-anim .hda-towerfan-pulse{animation:hda-towerfan-pulse 3s ease-in-out infinite}
@keyframes hda-towerfan-pulse{50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-towerfan-osc,.hda-anim .hda-towerfan-shine,.hda-anim .hda-towerfan-flow,.hda-anim .hda-towerfan-airl,.hda-anim .hda-towerfan-airr,.hda-anim .hda-towerfan-wave,.hda-anim .hda-towerfan-rise,.hda-anim .hda-towerfan-slide,.hda-anim .hda-towerfan-mist,.hda-anim .hda-towerfan-pulse{animation:none!important}}
`,
    icons,
  });
})();
