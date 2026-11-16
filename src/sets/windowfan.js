(function () {
  const H = window.HDAH, sh = H.shade, rgba = H.rgba, mix = H.mix;
  const P = "hda-windowfan-";
  const f = (n) => Math.round(n * 100) / 100;
  const WH = "#ecebe6", BK = "#2f3136", GR = "#8e949b", BE = "#d6c6a6", SA = "#a2b398";
  const SW = [WH, BK, GR, BE, SA];
  const sw = (a) => [a].concat(SW.filter((c) => c !== a));
  const lum = (c) => { const x = H.hx(c); return (x[0] * 0.3 + x[1] * 0.59 + x[2] * 0.11) / 255; };
  const TR = "#f2efe8", AIR = "#d6ecff", WARM = "#ffd9b0";
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
    const u = o.uid, defs = [], seen = {}; let n = 0;
    const stops = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] == null ? "" : ` stop-opacity="${s[2]}"`}/>`).join("");
    const k = {
      u, o, on: !!o.on, lv: Math.max(0.05, Math.min(1, +o.level || 0)), c: o.color || WH,
      def(nm, s) { if (!seen[nm]) { seen[nm] = 1; defs.push(s); } return `url(#${u}-${nm})`; },
      lin(nm, a, x1 = 0, y1 = 0, x2 = 1, y2 = 0) { return k.def(nm, `<linearGradient id="${u}-${nm}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(a)}</linearGradient>`); },
      rad(nm, a, cx = 0.5, cy = 0.5, r = 0.5) { return k.def(nm, `<radialGradient id="${u}-${nm}" cx="${cx}" cy="${cy}" r="${r}">${stops(a)}</radialGradient>`); },
      pat(nm, w, h, body) { return k.def(nm, `<pattern id="${u}-${nm}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${body}</pattern>`); },
      id(p) { return p + n++; },
      clip(d) { const id = k.id("cp"); defs.push(`<clipPath id="${u}-${id}"><path d="${d}"/></clipPath>`); return `clip-path="url(#${u}-${id})"`; },
      dur(a = 1.45, b = 1) { return Math.max(0.2, a - b * k.lv).toFixed(2); },
      svg(body) { return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="${P}svg" aria-hidden="true"><defs>${defs.join("")}</defs>${body}</svg>`; },
    };
    return k;
  }

  const rr = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return r <= 0 ? `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z` :
    `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`; };
  const R = (x, y, w, h, r, fill, ex = "") => `<path d="${rr(x, y, w, h, r)}" fill="${fill}"${ex}/>`;
  const pv = (k, c) => k.lin("pv" + c.slice(1), [[0, sh(c, 0.32)], [0.5, c], [1, sh(c, -0.32)]], 0, 0, 0, 1);
  const ph = (k, c) => k.lin("ph" + c.slice(1), [[0, sh(c, -0.32)], [0.25, sh(c, 0.3)], [0.6, c], [1, sh(c, -0.42)]]);
  const metal = (k, c) => k.lin("mt" + c.slice(1), [[0, sh(c, -0.5)], [0.25, sh(c, 0.4)], [0.45, sh(c, 0.75)], [0.6, c], [0.85, sh(c, -0.25)], [1, sh(c, -0.55)]]);
  const edge = (k) => k.lin("edg", [[0, "#000", 0.28], [0.07, "#000", 0], [0.93, "#000", 0], [1, "#000", 0.32]]);
  const gloss = (k) => k.lin("gls", [[0, "#fff", 0.45], [0.45, "#fff", 0]], 0, 0, 1, 1);
  const hl = (x1, y1, x2, y2, op = 0.45, w = 1.2) => `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
  function shadow(k, cx, cy, rx, ry = 5, a = 0.45) { return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${k.rad("sh", [[0, "#000", 0.6], [1, "#000", 0]])}" opacity="${a}"/>`; }
  function drop(k, x, y, w, h, a = 0.4) { return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${k.lin("dsh", [[0, "#000", 0.5], [1, "#000", 0]], 0, 0, 0, 1)}" opacity="${a}"/>`; }
  function rng(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function box(k, x, y, w, h, r, c) {
    return R(x, y, w, h, r, pv(k, c)) + `<path d="${rr(x, y, w, h, r)}" fill="${edge(k)}"/>` + hl(x + r, y + 1.1, x + w - r, y + 1.1, lum(c) > 0.5 ? 0.6 : 0.3) +
      `<path d="${rr(x, y, w, h, r)}" fill="none" stroke="${sh(c, -0.55)}" stroke-opacity=".45" stroke-width=".7"/>`;
  }
  function wall(k, c, x = 6, y = 6, w = 188, h = 188) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${k.rad("wal" + c.slice(1), [[0, sh(c, 0.12)], [0.62, c, 0.9], [1, sh(c, -0.3), 0]], 0.5, 0.42, 0.68)}"/>`;
  }
  function panel(k, d) { return `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.2"/>`; }

  const SKY = { day: ["#3f8fdc", "#8cc4f0", "#d8eefc"], dusk: ["#232c66", "#6b4f98", "#f0957a"], sunset: ["#33478f", "#df7d6a", "#ffc983"],
    night: ["#05081a", "#121a40", "#27305e"], dawn: ["#7aa0d6", "#e9c2cc", "#ffe4bd"], overcast: ["#6f7a87", "#9ca5b0", "#c3c9d0"], rain: ["#3f4854", "#5d6672", "#7e8792"] };
  const HILL = { day: ["#6fae62", "#3f7a46"], dusk: ["#3a2f5c", "#1d1734"], sunset: ["#5a3d5e", "#2e2140"], night: ["#141a33", "#080b1a"],
    dawn: ["#9db3a6", "#62807a"], overcast: ["#6c7680", "#454e57"], rain: ["#4f5962", "#2f363d"] };
  function cloud(x, y, s, col, op) {
    return `<g fill="${col}" opacity="${op}"><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(13 * s)}" ry="${f(4.5 * s)}"/><ellipse cx="${f(x - 5 * s)}" cy="${f(y - 3 * s)}" rx="${f(6 * s)}" ry="${f(5 * s)}"/><ellipse cx="${f(x + 4 * s)}" cy="${f(y - 4.5 * s)}" rx="${f(7.5 * s)}" ry="${f(6.2 * s)}"/></g>`;
  }
  function view(k, kind, x, y, w, h, q = {}) {
    const s = SKY[kind], hc = HILL[kind], X = (t) => f(x + w * t), Y = (t) => f(y + h * t), m = Math.min(w, h), hz = q.hz == null ? 0.74 : q.hz, r = rng(q.seed || 7);
    const d = q.d || rr(x, y, w, h, q.r || 0);
    let b = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.lin("sky" + kind, [[0, s[0]], [0.62, s[1]], [1, s[2]]], 0, 0, 0, 1)}"/>`;
    const glow = (cx, cy, rad, col, a) => `<circle cx="${cx}" cy="${cy}" r="${f(rad)}" fill="${k.rad("sg" + col.slice(1), [[0, col, a], [0.4, col, a * 0.35], [1, col, 0]])}"/>`;
    if (kind === "day") { b += glow(X(0.8), Y(0.22), m * 0.5, "#fff6cc", 0.8) + `<circle cx="${X(0.8)}" cy="${Y(0.22)}" r="${f(m * 0.08)}" fill="#fffbe8"/>` + cloud(x + w * 0.3, y + h * 0.3, m / 60, "#fff", 0.85) + cloud(x + w * 0.62, y + h * 0.48, m / 95, "#fff", 0.7); }
    if (kind === "sunset") { b += glow(X(0.62), Y(hz), m * 0.9, "#ffd28a", 0.9) + `<circle cx="${X(0.62)}" cy="${Y(hz)}" r="${f(m * 0.15)}" fill="${k.rad("sun2", [[0, "#fff4cf"], [0.7, "#ffc46e"], [1, "#ff9a5a"]])}"/>` + cloud(x + w * 0.25, y + h * 0.35, m / 80, "#f7b5a0", 0.55); }
    if (kind === "dawn") b += glow(X(0.28), Y(hz), m * 0.8, "#fff1d0", 0.9) + `<rect x="${x}" y="${Y(hz - 0.12)}" width="${w}" height="${f(h * 0.08)}" fill="#fff" opacity=".18"/>`;
    if (kind === "dusk") b += glow(X(0.35), Y(hz), m * 0.8, "#ffb38a", 0.6);
    if (kind === "night" || kind === "dusk") {
      const ns = kind === "night" ? 16 : 7;
      for (let i = 0; i < ns; i++) { const sx = X(r()), sy = f(y + h * r() * hz * 0.8), sr = f(0.45 + r() * 0.75);
        b += `<circle${k.on && i % 3 === 0 ? ` class="${P}tw" style="animation-delay:-${f(i * 0.37)}s"` : ""} cx="${sx}" cy="${sy}" r="${sr}" fill="#fff" opacity="${f(0.5 + r() * 0.5)}"/>`; }
    }
    if (kind === "night") { const mx = X(q.moon || 0.74), my = Y(0.24), mr = m * 0.075;
      b += glow(mx, my, mr * 5, "#dfe6ff", 0.45) + `<circle cx="${mx}" cy="${my}" r="${f(mr)}" fill="#f4f1de"/><circle cx="${f(+mx + mr * 0.5)}" cy="${f(+my - mr * 0.25)}" r="${f(mr * 0.88)}" fill="${s[0]}" opacity=".93"/>`; }
    if (kind === "overcast" || kind === "rain") {
      const cc = kind === "rain" ? "#8a939d" : "#e2e6ea";
      b += cloud(x + w * 0.2, y + h * 0.2, m / 45, cc, 0.7) + cloud(x + w * 0.7, y + h * 0.3, m / 40, cc, 0.6) + cloud(x + w * 0.48, y + h * 0.12, m / 55, sh(cc, 0.2), 0.5);
    }
    if (q.city) {
      let cx = x - 2; const by = y + h * (hz + 0.06);
      while (cx < x + w) { const bw = 6 + r() * 9, bh = h * (0.12 + r() * 0.24);
        b += `<rect x="${f(cx)}" y="${f(by - bh)}" width="${f(bw)}" height="${f(bh + 30)}" fill="${kind === "night" ? "#0e1230" : "#241c40"}"/>`;
        for (let wy = by - bh + 3; wy < by - 2; wy += 4) for (let wx = cx + 1.5; wx < cx + bw - 2; wx += 3) if (r() < 0.32) b += `<rect x="${f(wx)}" y="${f(wy)}" width="1.2" height="1.6" fill="#ffd27a" opacity="${f(0.5 + r() * 0.5)}"/>`;
        cx += bw + 1; }
    }
    if (q.roofs) { b += `<path d="M${x} ${Y(hz)}L${X(0.12)} ${Y(hz - 0.14)}L${X(0.28)} ${Y(hz - 0.02)}V${Y(hz - 0.08)}L${X(0.42)} ${Y(hz - 0.2)}L${X(0.58)} ${Y(hz - 0.06)}L${X(0.7)} ${Y(hz - 0.12)}L${X(0.86)} ${Y(hz - 0.01)}L${x + w} ${Y(hz - 0.06)}V${y + h}H${x}Z" fill="${sh(hc[1], -0.1)}"/>` +
      `<rect x="${X(0.44)}" y="${Y(hz - 0.12)}" width="3" height="4" fill="#ffd27a" opacity=".7"/><rect x="${X(0.16)}" y="${Y(hz - 0.04)}" width="3" height="4" fill="#ffd27a" opacity=".5"/>`; }
    if (q.ground) {
      b += `<rect x="${x}" y="${Y(hz)}" width="${w}" height="${f(h * (1 - hz))}" fill="${k.lin("grav", [[0, "#6d6457"], [1, "#4a4237"]], 0, 0, 0, 1)}"/>`;
      for (let i = 0; i < 26; i++) b += `<ellipse cx="${X(r())}" cy="${f(y + h * (hz + 0.06 + r() * (0.9 - hz)))}" rx="${f(1.2 + r() * 1.6)}" ry="${f(0.8 + r())}" fill="${mix("#9a9080", "#5d5446", r())}"/>`;
      for (let i = 0; i < 30; i++) { const gx = x + w * (i / 30) + r() * 3, gh = 6 + r() * 9;
        b += `<path d="M${f(gx)} ${Y(hz)}q${f(1 + r() * 2)} ${f(-gh * 0.6)} ${f(r() * 4 - 1)} ${f(-gh)}" stroke="${mix("#7fc06a", "#3d7a3e", r())}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }
      b += `<ellipse cx="${X(0.78)}" cy="${Y(hz - 0.18)}" rx="${f(w * 0.16)}" ry="${f(h * 0.2)}" fill="${k.rad("shrub", [[0, "#5aa04f"], [1, "#2f6a35"]], 0.4, 0.35, 0.6)}"/>`;
    } else if (!q.noHills) {
      b += `<path d="M${x} ${Y(hz - 0.07)}C${X(0.3)} ${Y(hz - 0.14)} ${X(0.5)} ${Y(hz - 0.03)} ${X(0.75)} ${Y(hz - 0.1)}S${X(0.95)} ${Y(hz - 0.08)} ${x + w} ${Y(hz - 0.12)}V${y + h}H${x}Z" fill="${mix(hc[0], s[1], 0.55)}" opacity=".85"/>`;
      b += `<path d="M${x} ${Y(hz)}C${X(0.25)} ${Y(hz - 0.08)} ${X(0.45)} ${Y(hz + 0.04)} ${X(0.65)} ${Y(hz - 0.03)}S${X(0.9)} ${Y(hz - 0.06)} ${x + w} ${Y(hz - 0.01)}V${y + h}H${x}Z" fill="${k.lin("hill" + kind, [[0, hc[0]], [1, hc[1]]], 0, 0, 0, 1)}"/>`;
      if (q.trees) for (let i = 0; i < 5; i++) { const tx = x + w * (0.06 + r() * 0.9), ty = y + h * (hz - 0.02 + r() * 0.05), ts = m * (0.05 + r() * 0.04);
        b += `<rect x="${f(tx - 0.6)}" y="${f(ty - ts)}" width="1.2" height="${f(ts)}" fill="${sh(hc[1], -0.3)}"/><ellipse cx="${f(tx)}" cy="${f(ty - ts * 1.4)}" rx="${f(ts * 0.7)}" ry="${f(ts * 0.95)}" fill="${sh(hc[1], kind === "day" ? -0.05 : -0.25)}"/>`; }
    }
    if (kind === "rain") {
      let rn = ""; for (let i = 0; i < 18; i++) rn += `<path d="M${X(r())} ${f(y + h * r())}l-2 8" stroke="#d6e4f2" stroke-opacity="${f(0.3 + r() * 0.35)}" stroke-width=".8" stroke-linecap="round"/>`;
      b += `<g${k.on ? ` class="${P}rain"` : ""}>${rn}</g><g${k.on ? ` class="${P}rain" style="animation-delay:-.45s"` : ""}>${rn.replace(/M([\d.]+) ([\d.]+)/g, (a, p, qq) => `M${f(+p + 7)} ${f(+qq - 9)}`)}</g>`;
      for (let i = 0; i < 9; i++) { const dx = X(r()), dy = f(y + h * r()), dr = f(1 + r() * 1.5);
        b += `<circle cx="${dx}" cy="${dy}" r="${dr}" fill="#cfe0ef" fill-opacity=".25" stroke="#e8f1fa" stroke-opacity=".5" stroke-width=".5"/><path d="M${dx} ${f(+dy + +dr)}v${f(3 + r() * 6)}" stroke="#e8f1fa" stroke-opacity=".3" stroke-width=".7"/>`; }
    }
    if (q.frost) b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f4f7fa" opacity=".62"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.pat("frost", 4, 4, `<circle cx="1" cy="1" r=".7" fill="#fff" fill-opacity=".5"/><circle cx="3" cy="3" r=".6" fill="#9aa8b6" fill-opacity=".25"/>`)}"/>`;
    b += `<path d="M${x} ${f(y + h * 0.6)}L${f(x + w * 0.5)} ${y}H${f(x + w * 0.66)}L${x} ${f(y + h * 0.98)}Z" fill="#fff" opacity=".07"/><path d="M${f(x + w * 0.72)} ${y}L${f(x + w * 0.5)} ${f(y + h * 0.45)}" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>`;
    b += `<rect x="${x}" y="${y}" width="${w}" height="5" fill="${k.lin("ish", [[0, "#000", 0.45], [1, "#000", 0]], 0, 0, 0, 1)}"/>`;
    return `<g ${k.clip(d)}>${b}</g>`;
  }

  function frame(k, x, y, w, h, t, c = TR) {
    return `<path d="${rr(x - 2, y - 2, w + 4, h + 4, 3)}" fill="#000" opacity=".3"/>` + R(x, y, w, h, 1.5, pv(k, c)) + `<path d="${rr(x, y, w, h, 1.5)}" fill="${edge(k)}"/>` +
      hl(x + 2, y + 1, x + w - 2, y + 1, 0.5) + R(x + t - 1.2, y + t - 1.2, w - 2 * t + 2.4, h - 2 * t + 2.4, 1, sh(c, -0.55));
  }
  function rail(k, x, y, w, h, c = TR) { return R(x, y, w, h, 0.6, pv(k, c)) + hl(x + 1, y + 0.8, x + w - 1, y + 0.8, 0.55, 0.9) + `<path d="M${x} ${f(y + h)}h${w}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`; }
  function sill(k, x, y, w, c = TR) {
    return drop(k, x + 3, y + 8, w - 6, 9, 0.5) + `<path d="M${f(x + 3)} ${y}H${f(x + w - 3)}L${x + w} ${y + 3}H${x}Z" fill="${sh(c, 0.25)}"/>` + R(x, y + 3, w, 5.5, 1, pv(k, sh(c, -0.08))) + hl(x + 1, y + 3.6, x + w - 1, y + 3.6, 0.45, 0.8);
  }
  function rod(k, x1, x2, y, c = "#8b8f96") {
    return `<rect x="${x1}" y="${y - 1.2}" width="${x2 - x1}" height="2.4" rx="1.2" fill="${metal(k, c)}"/><circle cx="${x1}" cy="${y}" r="3" fill="${k.rad("fin", [[0, sh(c, 0.6)], [1, sh(c, -0.4)]], 0.35, 0.35, 0.7)}"/><circle cx="${x2}" cy="${y}" r="3" fill="${k.rad("fin", [])}"/>`;
  }
  function curtain(k, x, y, w, h, c, right, q = {}) {
    const nf = q.folds || 4, st = [];
    for (let i = 0; i <= nf * 2; i++) st.push([f(i / (nf * 2)), i % 2 ? sh(c, 0.24) : sh(c, -0.3), q.sheer ? 0.5 : null]);
    const g = k.lin("cu" + (q.sheer ? "s" : "") + c.slice(1), st);
    const tie = q.tie == null ? 0.58 : q.tie;
    const d = tie ? `M${x} ${y}H${x + w}C${x + w} ${f(y + h * tie * 0.5)} ${f(x + w * 0.5)} ${f(y + h * tie * 0.8)} ${f(x + w * 0.45)} ${f(y + h * tie)}C${f(x + w * 0.5)} ${f(y + h * (tie + 0.15))} ${f(x + w * 1.05)} ${f(y + h * 0.85)} ${x + w} ${y + h}Q${f(x + w * 0.75)} ${y + h - 3} ${f(x + w * 0.5)} ${y + h}T${x} ${y + h}Z`
      : `M${x} ${y}H${x + w}V${y + h}Q${f(x + w * 0.8)} ${y + h - 3} ${f(x + w * 0.6)} ${y + h}T${f(x + w * 0.2)} ${y + h}T${x} ${y + h}Z`;
    let s = `<path d="${d}" fill="#000" opacity="${q.sheer ? 0.08 : 0.25}" transform="translate(${right ? -2 : 2} 2)"/><path d="${d}" fill="${g}"/>`;
    if (tie) s += `<path d="M${x} ${f(y + h * tie - 1)}Q${f(x + w * 0.3)} ${f(y + h * tie + 2)} ${f(x + w * 0.5)} ${f(y + h * tie)}" stroke="${sh(c, -0.45)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${x} ${y}H${x + w}" stroke="${sh(c, -0.5)}" stroke-width="2.5"/>`;
    const sway = q.sway && k.on ? ` class="${P}sway"${q.delay ? ` style="animation-delay:-${q.delay}s"` : ""}` : "";
    const inner = `<g${sway}>${s}</g>`;
    return right ? `<g transform="translate(${2 * x + w} 0) scale(-1 1)">${inner}</g>` : inner;
  }

  function blade(k, R, col, wide) {
    const a = wide ? [-0.16, -0.2, -0.6, -0.5, -0.52, -0.92, 0, -0.97, 0.48, -0.92, 0.52, -0.5, 0.16, -0.2] : [-0.1, -0.2, -0.46, -0.42, -0.44, -0.86, -0.08, -0.96, 0.24, -0.93, 0.3, -0.58, 0.13, -0.2];
    const p = a.map((v) => f(v * R));
    const d = `M${p[0]} ${p[1]}C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}C${p[8]} ${p[9]} ${p[10]} ${p[11]} ${p[12]} ${p[13]}Z`;
    const g = k.lin("bl" + col.slice(1), [[0, sh(col, -0.38)], [0.45, sh(col, 0.32)], [1, sh(col, -0.22)]]);
    return `<path d="${d}" fill="${g}" stroke="${sh(col, -0.55)}" stroke-opacity=".5" stroke-width=".6"/><path d="M${f(p[0] - 0.03 * R)} ${f(-0.3 * R)}C${f(p[2] + 0.08 * R)} ${f(p[3] - 0.04 * R)} ${f(p[4] + 0.1 * R)} ${f(p[5] + 0.06 * R)} ${f(p[6] - 0.02 * R)} ${f(p[7] + 0.05 * R)}" stroke="#fff" stroke-opacity=".32" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  }
  function rotor(k, cx, cy, R, n, bl, q = {}) {
    const key = k.id("r"), u = k.u, on = k.on, lv = k.lv, ph = q.ph || 0, dir = q.rev ? 1 : -1;
    k.def(key + "b", `<g id="${u}-${key}b">${bl}</g>`);
    let set = `<circle r="${R}" fill="none"/>`;
    for (let i = 0; i < n; i++) set += `<use xlink:href="#${u}-${key}b" transform="rotate(${f(ph + (i * 360) / n)})"/>`;
    k.def(key + "s", `<g id="${u}-${key}s">${set}</g>`);
    let mid = "";
    if (on) {
      const dc = q.disc || "#c9ced6";
      mid += `<circle r="${f(R * 0.97)}" fill="${k.rad(key + "d", [[0, dc, 0], [0.25, dc, 0], [0.4, dc, f(0.1 + 0.16 * lv)], [0.92, dc, f(0.06 + 0.12 * lv)], [1, dc, 0]])}"/>`;
      const step = Math.min(14, (360 / n) * 0.16) * (0.5 + 0.7 * lv);
      [0.34, 0.2, 0.1].forEach((g, i) => { mid += `<use xlink:href="#${u}-${key}s" transform="rotate(${f(dir * step * (i + 1))})" opacity="${f(g * (0.55 + 0.5 * lv))}"/>`; });
    }
    mid += `<use xlink:href="#${u}-${key}s"${on ? ` opacity="${f(1 - 0.24 * lv)}"` : ""}/>`;
    const spin = on ? ` class="${P}${q.rev ? "spinr" : "spin"}" style="animation-duration:${k.dur(q.slow ? 2.2 : 1.45, q.slow ? 1.4 : 1)}s"` : "";
    return `<g transform="translate(${f(cx)} ${f(cy)})${q.sy ? ` scale(1 ${q.sy})` : ""}"><g${spin}><circle r="${R}" fill="none"/>${mid}</g></g>`;
  }
  function grille(k, cx, cy, R, c, q = {}) {
    const gc = q.gc || (lum(c) > 0.5 ? sh(c, -0.12) : sh(c, 0.3)), rings = q.rings || [0.36, 0.56, 0.76, 0.96], sp = q.sp || 16;
    let s = "";
    rings.forEach((t) => { s += `<circle cx="${cx}" cy="${f(cy + 0.8)}" r="${f(R * t)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.3"/><circle cx="${cx}" cy="${cy}" r="${f(R * t)}" fill="none" stroke="${gc}" stroke-width="${q.w || 1.3}"/>`; });
    for (let i = 0; i < sp; i++) { const a = (i / sp) * Math.PI * 2 + 0.1, c1 = Math.cos(a), s1 = Math.sin(a);
      s += `<path d="M${f(cx + c1 * R * 0.22)} ${f(cy + s1 * R * 0.22)}L${f(cx + c1 * R)} ${f(cy + s1 * R)}" stroke="${gc}" stroke-width="${q.sw || 0.9}" stroke-opacity=".9"/>`; }
    s += `<path d="M${f(cx - R * 0.7)} ${f(cy - R * 0.55)}A${R} ${R} 0 0 1 ${f(cx + R * 0.2)} ${f(cy - R * 0.97)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    return s;
  }
  function hub(k, cx, cy, r, c, arrow) {
    let s = `<circle cx="${cx}" cy="${f(cy + 0.8)}" r="${f(r + 0.6)}" fill="#000" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="${k.rad("hub" + c.slice(1), [[0, sh(c, 0.45)], [0.6, c], [1, sh(c, -0.45)]], 0.38, 0.32, 0.7)}"/>`;
    if (arrow) { const up = arrow === "out", a = f(r * 0.45), col = lum(c) > 0.5 ? sh(c, -0.55) : sh(c, 0.55);
      s += `<path d="M${f(cx - a)} ${f(cy + (up ? a * 0.4 : -a * 0.4))}L${cx} ${f(cy + (up ? -a * 0.6 : a * 0.6))}L${f(cx + a)} ${f(cy + (up ? a * 0.4 : -a * 0.4))}" stroke="${col}" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
    return s;
  }
  function well(k, cx, cy, R) { return `<circle cx="${cx}" cy="${cy}" r="${f(R)}" fill="${k.rad("well", [[0, "#2c3036"], [0.72, "#14161a"], [1, "#050608"]])}"/>`; }
  function fan(k, cx, cy, R, c, q = {}) {
    const bc = q.bc || (lum(c) > 0.5 ? "#dfe3e8" : "#6a7078"), n = q.n || 5;
    let s = "";
    if (q.shroud !== false) s += `<circle cx="${cx}" cy="${f(cy + 1.5)}" r="${f(R + 5.5)}" fill="#000" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="${f(R + 5)}" fill="${k.rad("shr" + c.slice(1), [[0, sh(c, -0.3)], [0.86, sh(c, 0.1)], [0.93, sh(c, 0.38)], [1, sh(c, -0.35)]])}"/>`;
    s += well(k, cx, cy, R) + rotor(k, cx, cy, R * 0.92, n, blade(k, R * 0.92, bc, q.wide), { rev: q.rev, ph: q.ph, disc: bc });
    if (q.grille !== false) s += grille(k, cx, cy, R, c, q);
    s += hub(k, cx, cy, R * (q.hub || 0.2), c, q.arrow);
    return s;
  }
  function stream(k, x, y, ang, len, i, q = {}) {
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><path class="${P}flow" style="animation-duration:${k.dur(2.7, 1.4)}s;animation-delay:-${f((i * 0.47) % 2)}s" d="M0 0c${f(len * 0.3)} -2.4 ${f(len * 0.62)} 2.4 ${len} 0" fill="none" stroke="${q.col || AIR}" stroke-opacity="${q.op || 0.55}" stroke-width="${q.w || 1.4}" stroke-linecap="round"/></g>`;
  }
  function radial(k, cx, cy, R, dir, angs, q = {}) {
    if (!k.on) return "";
    const len = q.len || 14;
    let s = angs.map((a, i) => { const rad = (a * Math.PI) / 180, r0 = dir === "in" ? R + 3 : R + len + 12;
      return stream(k, cx + Math.cos(rad) * r0, cy + Math.sin(rad) * r0, dir === "in" ? a : a + 180, len, i + (q.i0 || 0), q); }).join("");
    if (q.ring !== false) s += `<circle class="${P}${dir === "in" ? "rip" : "sink"}" style="animation-duration:${k.dur(2.8, 1.3)}s" cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="none" stroke="${q.col || AIR}" stroke-opacity=".4" stroke-width="1.4"/>`;
    return s;
  }
  function led(k, x, y, col, r = 1.8) {
    if (!k.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3b3f46"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.4)}" fill="#fff" opacity=".25"/>`;
    return `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${f(r + 5)}" fill="${k.rad("ld" + col.slice(1), [[0, col, 0.75], [1, col, 0]])}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.4)}" fill="#fff" opacity=".85"/>`;
  }
  function steam(k, x, y, i, h = 26) {
    if (!k.on) return "";
    return `<path class="${P}steam" style="animation-delay:-${f(i * 0.9)}s;animation-duration:${k.dur(3.6, 1.2)}s" d="M${x} ${y}c-4 ${f(-h * 0.25)} 4 ${f(-h * 0.5)} 0 ${f(-h * 0.75)}s3 ${f(-h * 0.18)} 1 ${f(-h * 0.25)}" fill="none" stroke="#f2f6fa" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>`;
  }
  function louvers(k, x, y, w, h, n, c, open, q = {}) {
    const ch = h / n; let s = "";
    for (let i = 0; i < n; i++) {
      const sy = y + i * ch;
      if (open) {
        const t = ch * 0.26;
        s += `<g${k.on && q.flutter !== false ? ` class="${P}flut" style="animation-delay:-${f(i * 0.21)}s"` : ""}><path d="M${x} ${f(sy)}h${w}l-2 ${f(t)}h${-w + 4}Z" fill="${sh(c, 0.3)}"/><path d="M${f(x + 2)} ${f(sy + t)}h${w - 4}v1.4h${-w + 4}Z" fill="${sh(c, -0.45)}"/></g>`;
      } else {
        s += R(x, sy, w, ch + 1.2, 0.5, k.lin("lv" + c.slice(1), [[0, sh(c, 0.35)], [0.45, sh(c, 0.05)], [1, sh(c, -0.35)]], 0, 0, 0, 1)) + hl(x + 1, sy + 0.8, x + w - 1, sy + 0.8, 0.5, 0.8) + `<path d="M${x} ${f(sy + ch + 1.2)}h${w}" stroke="#000" stroke-opacity=".35" stroke-width=".9"/>`;
      }
    }
    return s;
  }
  function knob(k, x, y, r, c) { return `<circle cx="${x}" cy="${f(y + 0.6)}" r="${f(r + 0.5)}" fill="#000" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${k.rad("kn" + c.slice(1), [[0, sh(c, 0.5)], [1, sh(c, -0.4)]], 0.35, 0.3, 0.7)}"/><path d="M${x} ${y}l${f(r * 0.5)} ${f(-r * 0.65)}" stroke="${sh(c, -0.6)}" stroke-width="1" stroke-linecap="round"/>`; }

  const BG = (x) => `<g class="hda-bg">${x}</g>`, bgw = (fn) => (...a) => BG(fn(...a));
  wall = bgw(wall); view = bgw(view); curtain = bgw(curtain); rod = bgw(rod); panel = bgw(panel);
  const icons = [];

  icons.push({ id: "twin", name: "Twin reversible", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      let b = rod(k, 8, 192, 13) + frame(k, 30, 18, 140, 148, 8) + view(k, "day", 38, 26, 124, 62, { seed: 3, trees: 1 }) +
        rail(k, 38, 84, 124, 7) + rail(k, 38, 91, 124, 8) + box(k, 38, 99, 124, 59, 3, c) +
        fan(k, 70, 128.5, 23, c, { arrow: "in" }) + fan(k, 130, 128.5, 23, c, { arrow: "out", rev: true, ph: 30 }) + sill(k, 26, 160, 148) +
        curtain(k, 10, 14, 34, 168, "#8fa9c2", false, { sway: true }) + curtain(k, 156, 14, 34, 168, "#8fa9c2", true, { sway: true, delay: 1.6 }) +
        radial(k, 70, 128.5, 28, "in", [150, 108, 70]) + radial(k, 130, 128.5, 28, "out", [110, 72, 30], { i0: 2 });
      return k.svg(b); } });

  icons.push({ id: "slim", name: "Slim expandable", colors: sw(BK), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, F = "#2b2d31";
      const pleat = k.pat("pl" + c.slice(1), 6, 10, `<rect width="3" height="10" fill="${sh(c, lum(c) > 0.5 ? -0.05 : 0.22)}"/><rect x="3" width="3" height="10" fill="${sh(c, lum(c) > 0.5 ? -0.28 : 0.02)}"/><rect x="2.6" width=".7" height="10" fill="#fff" fill-opacity=".35"/>`);
      let b = frame(k, 22, 26, 156, 142, 7, F) + view(k, "dusk", 29, 33, 142, 58, { seed: 11, city: 1, hz: 0.8 }) + rail(k, 29, 89, 142, 6, F) + rail(k, 29, 95, 142, 8, F);
      [[29, 41], [130, 41]].forEach(([x, w]) => { b += `<rect x="${x}" y="109" width="${w}" height="44" fill="${pleat}"/><rect x="${x}" y="109" width="${w}" height="44" fill="${k.lin("pls", [[0, "#000", 0.1], [0.5, "#000", 0], [1, "#000", 0.3]], 0, 0, 0, 1)}"/>` + rail(k, x, 106, w, 3.5, c) + rail(k, x, 152, w, 3.5, c); });
      b += box(k, 68, 103, 64, 55, 6, c) + fan(k, 100, 131, 21, c, { rev: true, n: 4, rings: [0.4, 0.62, 0.84] }) + led(k, 126, 108, "#7dd3fc", 1.4) +
        sill(k, 18, 160, 164, F) + radial(k, 100, 131, 26, "out", [205, 250, 290, 335]);
      return k.svg(b); } });

  icons.push({ id: "triple", name: "Tall triple", colors: sw(GR), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, F = "#a47a54";
      let b = frame(k, 42, 10, 116, 170, 7, F) + view(k, "night", 49, 17, 56, 156, { seed: 5, moon: 0.5, trees: 1, hz: 0.82 }) +
        R(101, 17, 7, 156, 0.5, ph(k, F)) + box(k, 106, 17, 45, 156, 3, c);
      [45, 95, 145].forEach((y, i) => { b += fan(k, 128.5, y, 16, c, { n: 5, ph: i * 20, rings: [0.45, 0.72, 0.96], sp: 12 }); });
      b += led(k, 128.5, 70, "#34d399", 1.3) + led(k, 128.5, 120, "#34d399", 1.3) + sill(k, 36, 172, 128, F) +
        curtain(k, 30, 8, 40, 176, "#f1ede4", false, { sheer: 1, tie: 0, folds: 5 }) +
        [45, 95, 145].map((y, i) => radial(k, 128.5, y, 21, "in", [200, 160], { i0: i, len: 12, ring: i === 1 })).join("");
      return k.svg(b); } });

  icons.push({ id: "casement", name: "Casement fan", colors: sw(SA), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      let b = frame(k, 58, 10, 84, 170, 7) + view(k, "dawn", 65, 17, 70, 66, { seed: 8, trees: 1, hz: 0.8 });
      b += `<path d="M110 20L134 24V80L110 78Z" fill="#000" opacity=".25"/><path d="M112 22L132 26V78L112 76Z" fill="#fff" fill-opacity=".14" stroke="${TR}" stroke-width="3"/><path d="M116 30L126 70" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>`;
      b += box(k, 65, 80, 70, 96, 3, c) + fan(k, 100, 104.5, 18, c, { rev: true, n: 4 }) + fan(k, 100, 151, 18, c, { rev: true, n: 4, ph: 45 }) + led(k, 128, 128, "#c4b5fd", 1.3) +
        sill(k, 52, 174, 96) + `<path d="M126 186l10 -4" stroke="#6a6e75" stroke-width="2.4" stroke-linecap="round"/><circle cx="137" cy="181.5" r="2.2" fill="${metal(k, "#9aa0a7")}"/>` +
        radial(k, 100, 104.5, 23, "out", [180, 0, 225], { len: 11 }) + radial(k, 100, 151, 23, "out", [180, 0, 315], { len: 11, i0: 3 });
      return k.svg(b); } });

  icons.push({ id: "gable", name: "Gable attic fan", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, pd = rr(8, 8, 184, 184, 16);
      const sid = k.pat("sid", 10, 9, `<rect width="10" height="9" fill="#6f7f8c"/><rect y="7" width="10" height="2" fill="#4c5964"/><rect width="10" height="1" fill="#93a2ae"/>`);
      let b = `<g class="hda-bg" ${k.clip(pd)}>` + view(k, "night", 8, 8, 184, 184, { seed: 21, noHills: 1, moon: 0.82 }) +
        `<path d="M8 128L100 34L192 128V192H8Z" fill="${sid}"/><path d="M8 128L100 34L192 128V192H8Z" fill="${k.rad("sidg", [[0, "#fff", 0.08], [1, "#000", 0.45]], 0.5, 0.45, 0.7)}"/>` +
        `<path d="M0 126L100 24L200 126" fill="none" stroke="#2a2730" stroke-width="12" stroke-linejoin="round"/><path d="M0 120L100 18L200 120" fill="none" stroke="#4a4552" stroke-width="3"/></g>`;
      b += `<path d="M58 154V96L100 62L142 96V154Z" fill="#000" opacity=".35" transform="translate(2 3)"/><path d="M58 154V96L100 62L142 96V154Z" fill="${pv(k, c)}"/><path d="M65 148V99L100 71L135 99V148Z" fill="#0c0e12"/>` +
        `<g ${k.clip("M65 148V99L100 71L135 99V148Z")}>${well(k, 100, 116, 36)}${rotor(k, 100, 116, 33, 4, blade(k, 33, "#9aa0a7", 1), { ph: 20, disc: "#9aa0a7" })}${gslats(k, c)}</g>` +
        `<path d="M58 154V96L100 62L142 96V154Z" fill="none" stroke="${sh(c, -0.5)}" stroke-opacity=".5"/>` + hl(60, 96, 99, 64, 0.5, 1.2) + panel(k, pd);
      if (k.on) b += [110, 90, 70].map((a, i) => stream(k, 76 + i * 24, 158, a, 16, i, { col: WARM, op: 0.6 })).join("");
      return k.svg(b); } });

  function gslats(k, c) { let s = ""; for (let i = 0; i < 9; i++) { const y = 73 + i * 8.4;
    s += `<path d="M60 ${f(y)}h80v5.2h-80Z" fill="${k.lin("gs" + c.slice(1), [[0, sh(c, 0.3)], [0.6, sh(c, -0.05)], [1, sh(c, -0.4)]], 0, 0, 0, 1)}"/><path d="M60 ${f(y + 5.2)}h80" stroke="#000" stroke-opacity=".5" stroke-width="1"/>` + hl(62, y + 0.7, 138, y + 0.7, 0.45, 0.7); } return s; }
  icons.push({ id: "wallosc", name: "Wall oscillating", colors: sw(BK), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      let b = wall(k, "#9e968c") + rod(k, 12, 92, 72) + BG(frame(k, 22, 78, 64, 98, 6) + view(k, "day", 28, 84, 52, 86, { seed: 4, trees: 1 }) + rail(k, 28, 124, 52, 5) + sill(k, 18, 172, 72)) +
        curtain(k, 14, 73, 22, 108, "#c98b6b", false, { sway: true, tie: 0.62 });
      b += shadow(k, 150, 34, 14, 3, 0.4) + R(140, 20, 20, 14, 3, pv(k, c)) + `<rect x="146" y="32" width="8" height="18" fill="${ph(k, c)}"/>` + knob(k, 150, 26, 2.2, sh(c, 0.2));
      const head = `<ellipse cx="146" cy="58" rx="17" ry="11" fill="${k.rad("mot" + c.slice(1), [[0, sh(c, 0.4)], [0.6, c], [1, sh(c, -0.5)]], 0.4, 0.3, 0.7)}"/>` +
        `<circle cx="132" cy="${f(97.5)}" r="41" fill="#000" opacity=".25"/>` + well(k, 132, 96, 38) + `<circle cx="132" cy="96" r="38" fill="#2a3442" opacity=".35"/>` +
        rotor(k, 132, 96, 35, 3, blade(k, 35, "#9fc3e6", 1), { ph: 10, disc: "#9fc3e6" }) +
        grille(k, 132, 96, 39, c, { gc: sh(c, lum(c) > 0.5 ? -0.1 : 0.55), rings: [0.3, 0.5, 0.7, 0.88], sp: 36, sw: 0.6, w: 0.9 }) +
        `<circle cx="132" cy="96" r="39.5" fill="none" stroke="${sh(c, lum(c) > 0.5 ? -0.2 : 0.35)}" stroke-width="2.6"/>` + hub(k, 132, 96, 8, c) + `<path d="M162 66v34" stroke="#d8d2c4" stroke-width=".8"/><circle cx="162" cy="102" r="1.8" fill="#d8d2c4"/>`;
      b += `<g${k.on ? ` class="${P}osc"` : ""}>${head}</g>` + radial(k, 132, 96, 42, "in", [150, 115, 80], { len: 16 });
      return k.svg(b); } });

  // (parts) the bath fan: Fan, Light (a frosted lens under the louvers, lights the tiles) and Night light (the lens glows
  // dim amber). The lens is drawn only as a Multi-Function Image or with a light part ticked; a Device Image is as before.
  icons.push({ id: "bath", name: "Bath exhaust", colors: sw(WH), picker: true, colorLabel: "Body",
    parts: [{ id: "fan", name: "Fan" }, { id: "light", name: "Light" }, { id: "night", name: "Night light" }],
    render(o) { const k = K(MF.as(o, "fan")), c = k.c, lens = o.mf || MF.has(o, "light") || MF.has(o, "night");
      const lt = lens && MF.on(o, "light"), nl = lens && !lt && MF.on(o, "night"), lc = MF.col(o, "light", "#fff1d6"), la = lt ? f(0.35 + 0.65 * Math.max(0.05, Math.min(1, +MF.lv(o, "light") || 1))) : 1;
      const tile = k.pat("tile", 16, 8, `<rect width="16" height="8" fill="#dfe8ea"/><rect width="15.2" height="7.2" x=".4" y=".4" rx="1" fill="#eef4f5"/><rect width="16" height="8" x="-8" y="8" fill="none"/>`);
      let b = wall(k, "#8fa5a9") + `<rect class="hda-bg" x="10" y="128" width="180" height="60" rx="4" fill="${tile}" opacity=".85"/><rect class="hda-bg" x="10" y="128" width="180" height="60" rx="4" fill="${k.lin("tg", [[0, "#000", 0.1], [1, "#000", 0.4]], 0, 0, 0, 1)}"/><rect class="hda-bg" x="10" y="126" width="180" height="3" fill="#e9eef0"/>` +
        BG(frame(k, 20, 30, 62, 92, 6) + view(k, "dawn", 26, 36, 50, 80, { frost: 1, seed: 2 }) + rail(k, 26, 73, 50, 5) + sill(k, 16, 120, 70));
      b += shadow(k, 136, 100, 40, 4, 0.5) + box(k, 98, 24, 76, 74, 7, c) + `<rect x="105" y="31" width="62" height="56" rx="2" fill="#0d0f13"/>` +
        `<g ${k.clip(rr(105, 31, 62, 56, 2))}>${rotor(k, 136, 59, 26, 5, blade(k, 26, "#bfc5cc"), { rev: true, disc: "#bfc5cc" })}</g>`;
      for (let i = 0; i < 8; i++) { const y = 33 + i * 7; b += `<rect x="105" y="${y}" width="62" height="4.2" fill="${pv(k, c)}"/><path d="M105 ${f(y + 4.2)}h62" stroke="#000" stroke-opacity=".4"/>`; }
      if (lens) {
        const g = lt ? lc : "#ffb45c";
        if (lt) b += `<path d="M110 98L150 98L176 186L84 186Z" fill="${k.lin("bcone", [[0, g, 0.42], [1, g, 0]], 0, 0, 0, 1)}" opacity="${la}"/>` +
          `<ellipse cx="130" cy="150" rx="46" ry="24" fill="${k.rad("btile", [[0, g, 0.3], [1, g, 0]])}" opacity="${la}"/>`;
        if (lt || nl) b += `<ellipse cx="130" cy="93" rx="${lt ? 30 : 22}" ry="${lt ? 10 : 7}" fill="${k.rad("bhalo", [[0, g, lt ? 0.75 : 0.55], [1, g, 0]])}"${lt ? ` opacity="${la}"` : ""}/>`;
        b += R(108, 89.2, 44, 6, 3, lt ? k.lin("blens", [[0, "#fff"], [0.5, sh(lc, 0.55)], [1, lc]], 0, 0, 0, 1) : nl ? k.lin("bnite", [[0, "#ffe2b8"], [1, "#f0a050"]], 0, 0, 0, 1) : k.lin("boff", [[0, "#f4f6f8"], [1, "#c3c9d0"]], 0, 0, 0, 1),
          ` stroke="${sh(c, -0.3)}" stroke-opacity=".55" stroke-width=".7"`) + hl(111, 90.6, 149, 90.6, lt ? 0.9 : 0.6, 0.8);
      }
      b += `<path d="M105 31h62v56h-62Z" fill="none" stroke="#000" stroke-opacity=".3"/>` + led(k, 164, 92, "#38bdf8", 1.6) +
        `<path d="M156 89.5c-1.2 1.8 -1.8 2.6 -1.8 3.5a1.8 1.8 0 0 0 3.6 0c0 -.9 -.6 -1.7 -1.8 -3.5Z" fill="${k.on ? "#7dd3fc" : sh(c, -0.35)}"/>`;
      if (k.on) b += steam(k, 120, 150, 0, 30) + steam(k, 142, 160, 1, 34) + steam(k, 162, 152, 2, 28) + [105, 85, 65].map((a, i) => stream(k, 112 + i * 24, 128, a - 180, 14, i)).join("");
      return k.svg(b); } });

  // (parts) the kitchen fan: Fan and Light (a lamp under the box, lights the counter). The lamp is drawn only as a
  // Multi-Function Image or with the Light part ticked; a Device Image is as before.
  icons.push({ id: "kitchen", name: "Kitchen exhaust", colors: sw(BE), picker: true, colorLabel: "Body",
    parts: [{ id: "fan", name: "Fan" }, { id: "light", name: "Light" }],
    render(o) { const k = K(MF.as(o, "fan")), c = k.c, lamp = o.mf || MF.has(o, "light"), lt = lamp && MF.on(o, "light");
      const lc = MF.col(o, "light", "#ffe7c2"), la = lt ? f(0.35 + 0.65 * Math.max(0.05, Math.min(1, +MF.lv(o, "light") || 1))) : 1;
      const tile = k.pat("ktile", 12, 12, `<rect width="12" height="12" fill="#c9d6cf"/><rect x=".5" y=".5" width="11" height="11" rx="1" fill="${k.lin("kt", [[0, "#e6efe9"], [1, "#b9c8bf"]], 0, 0, 1, 1)}"/>`);
      let b = wall(k, "#b39d80") + `<rect class="hda-bg" x="10" y="116" width="180" height="56" fill="${tile}"/><rect class="hda-bg" x="10" y="116" width="180" height="56" fill="${k.lin("ktg", [[0, "#000", 0.25], [0.3, "#000", 0], [1, "#000", 0.15]], 0, 0, 0, 1)}"/>` +
        `<rect class="hda-bg" x="6" y="170" width="188" height="10" rx="2" fill="${k.lin("ctr", [[0, "#5d5a57"], [0.25, "#8d8883"], [1, "#3a3836"]], 0, 0, 0, 1)}"/>` + BG(drop(k, 8, 180, 184, 8, 0.6) +
        frame(k, 122, 26, 62, 84, 6) + view(k, "sunset", 128, 32, 50, 72, { seed: 6, trees: 1 }) + sill(k, 118, 108, 70));
      b += `<g class="hda-bg"><path d="M148 107c-6 0 -7 -1 -7 -8h14c0 7 -1 8 -7 8Z" fill="${k.lin("pot", [[0, "#9a4f2e"], [0.4, "#d08257"], [1, "#7a3b20"]])}"/>` +
        [[-6, -14, -3], [-2, -18, 0], [3, -16, 2], [6, -12, 4]].map(([dx, dy, r]) => `<ellipse cx="${148 + dx}" cy="${99 + dy / 1.4}" rx="3.2" ry="5.5" transform="rotate(${r * 8} ${148 + dx} ${99 + dy / 1.4})" fill="${k.lin("lf", [[0, "#3f8a4c"], [1, "#8fcf8a"]])}"/>`).join("") + `</g>`;
      b += shadow(k, 70, 100, 40, 4, 0.5) + box(k, 30, 20, 80, 78, 6, c) + `<circle cx="70" cy="59" r="33" fill="${sh(c, -0.35)}"/>` +
        fan(k, 70, 59, 30, c, { shroud: false, n: 4, bc: "#c9ced4", rings: [0.5, 0.75, 0.97], sp: 24, sw: 0.7, wide: 1 }) +
        `<path d="M102 94V126" stroke="#c9b27a" stroke-width="1.1" stroke-dasharray="1.6 .9"/><circle cx="102" cy="128.5" r="2.6" fill="${metal(k, "#c9a25a")}"/>` +
        `<path d="M44 162h44l-3 8H47Z" fill="${metal(k, "#9aa0a7")}"/><rect x="88" y="163" width="16" height="2.4" rx="1.2" fill="#2f3136"/><ellipse cx="66" cy="162" rx="22" ry="2.4" fill="#3a3f45"/>`;
      if (lamp) {
        if (lt) b += `<path d="M62 101L78 101L104 168L36 168Z" fill="${k.lin("kcone", [[0, lc, 0.45], [1, lc, 0]], 0, 0, 0, 1)}" opacity="${la}"/>` +
          `<ellipse cx="70" cy="166" rx="40" ry="7" fill="${k.rad("kpool", [[0, lc, 0.55], [1, lc, 0]])}" opacity="${la}"/><ellipse cx="70" cy="100" rx="22" ry="7" fill="${k.rad("khalo", [[0, lc, 0.8], [1, lc, 0]])}" opacity="${la}"/>`;
        b += `<path d="M58 97.4h24l-2.2 3.6h-19.6Z" fill="${metal(k, "#9aa0a7")}"/>` +
          `<ellipse cx="70" cy="101" rx="9.6" ry="2.2" fill="${lt ? k.rad("klens", [[0, "#fff"], [0.6, sh(lc, 0.5)], [1, lc]]) : k.lin("koff", [[0, "#eef0f2"], [1, "#a9b0b8"]], 0, 0, 0, 1)}"/>`;
      }
      if (k.on) b += steam(k, 58, 156, 0, 40) + steam(k, 70, 154, 1.3, 44) + steam(k, 80, 157, 2.2, 38) + radial(k, 70, 59, 36, "out", [70, 110, 160, 20]);
      return k.svg(b); } });

  icons.push({ id: "shutter", name: "Shutter fan", colors: sw(GR), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, pd = rr(8, 8, 184, 184, 16);
      const brick = k.pat("brk", 24, 12, `<rect width="24" height="12" fill="#c6b6a2"/><rect x=".8" y=".8" width="22.4" height="4.6" rx=".6" fill="#9d5340"/><rect x="-11.2" y="6.8" width="22.4" height="4.6" rx=".6" fill="#8c4836"/><rect x="12.8" y="6.8" width="22.4" height="4.6" rx=".6" fill="#a95c47"/>`);
      let b = `<path class="hda-bg" d="${pd}" fill="${brick}"/><path class="hda-bg" d="${pd}" fill="${k.rad("bv", [[0, "#fff", 0.06], [0.7, "#000", 0.15], [1, "#000", 0.55]], 0.5, 0.45, 0.7)}"/>` + panel(k, pd);
      b += `<rect x="34" y="32" width="132" height="132" rx="3" fill="#000" opacity=".35" transform="translate(2 4)"/>` + box(k, 34, 32, 132, 132, 3, c) +
        `<rect x="44" y="42" width="112" height="112" fill="#0b0d11"/><g ${k.clip(rr(44, 42, 112, 112, 0))}>${well(k, 100, 98, 60)}${rotor(k, 100, 98, 52, 3, blade(k, 52, "#b8bec5", 1), { ph: 15, disc: "#b8bec5" })}</g>` +
        louvers(k, 44, 42, 112, 112, 7, sh(c, 0.12), k.on) + `<rect x="44" y="42" width="112" height="112" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/>` +
        [40, 160].map((x) => `<rect x="${x - 1.5}" y="44" width="3" height="108" fill="${metal(k, "#9aa0a7")}"/>`).join("") +
        `<path d="M30 30h140" stroke="${sh(c, 0.3)}" stroke-width="4" stroke-linecap="round"/>`;
      if (k.on) b += [125, 100, 75, 55].map((a, i) => stream(k, 56 + i * 30, 168, a, 16, i)).join("") + `<circle class="${P}rip" style="animation-duration:${k.dur(2.8, 1.3)}s" cx="100" cy="98" r="50" fill="none" stroke="${AIR}" stroke-opacity=".35" stroke-width="1.4"/>`;
      return k.svg(b); } });

  icons.push({ id: "boxsash", name: "Box fan in sash", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, T = "#e9e4da";
      const foam = k.pat("foam", 5, 5, `<rect width="5" height="5" fill="#cfcabd"/><circle cx="1.5" cy="1.5" r=".9" fill="#a8a294"/><circle cx="4" cy="3.8" r=".7" fill="#b7b1a3"/>`);
      let b = frame(k, 24, 12, 152, 166, 7, T) + view(k, "overcast", 31, 19, 138, 46, { seed: 13, roofs: 1, hz: 0.88 }) + rail(k, 31, 61, 138, 5, T) + rail(k, 31, 66, 138, 7, T);
      b += `<rect x="31" y="73" width="20" height="97" fill="${foam}"/><rect x="149" y="73" width="20" height="97" fill="${foam}"/><rect x="31" y="73" width="138" height="97" fill="${k.lin("fsh", [[0, "#000", 0.35], [0.15, "#000", 0], [0.85, "#000", 0], [1, "#000", 0.35]])}"/>` +
        box(k, 50, 73, 100, 98, 7, c) + `<rect x="88" y="76" width="24" height="4.5" rx="2.2" fill="${sh(c, -0.5)}"/>` +
        `<circle cx="100" cy="124" r="44" fill="${sh(c, -0.25)}"/>` + fan(k, 100, 124, 42, c, { shroud: false, n: 5, rings: [0.3, 0.48, 0.66, 0.84, 1], sp: 20, sw: 0.8 }) +
        knob(k, 141, 164, 3.4, sh(c, lum(c) > 0.5 ? -0.15 : 0.25)) + sill(k, 20, 170, 160, T) + radial(k, 100, 124, 44, "in", [140, 100, 60, 20], { len: 16 });
      return k.svg(b); } });

  icons.push({ id: "rainguard", name: "Rain-guard fan", colors: sw(SA), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, F = "#4a3b30";
      let b = frame(k, 26, 14, 148, 160, 7, F) + view(k, "rain", 33, 21, 134, 80, { seed: 17, trees: 1 }) +
        `<path d="M40 101L50 90H150L160 101Z" fill="${k.lin("hood", [[0, "#6d747b"], [1, "#2f353b"]], 0, 0, 0, 1)}" opacity=".7"/><path d="M50 90H150" stroke="#c4ccd3" stroke-opacity=".45"/>` +
        rail(k, 33, 99, 134, 7, F) + box(k, 33, 106, 134, 60, 4, c) + `<rect x="33" y="106" width="134" height="6" fill="${sh(c, -0.25)}"/>` + `<path d="M40 112v50M160 112v50" stroke="#000" stroke-opacity=".18" stroke-width="5"/>` +
        fan(k, 100, 138, 22, c, { n: 5 }) + led(k, 146, 128, "#38bdf8", 1.5) +
        `<path d="M146 136c-1.6 2.4 -2.4 3.4 -2.4 4.6a2.4 2.4 0 0 0 4.8 0c0 -1.2 -.8 -2.2 -2.4 -4.6Z" fill="${k.on ? "#7dd3fc" : sh(c, -0.4)}"/>` +
        knob(k, 56, 137, 3, sh(c, -0.1)) + sill(k, 22, 166, 156, F) + curtain(k, 150, 10, 36, 172, "#d9cfbf", true, { tie: 0.55 }) + radial(k, 100, 138, 27, "in", [150, 110, 70, 30]);
      return k.svg(b); } });

  icons.push({ id: "smart", name: "Smart thermostat", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      const out = "M30 176V84A70 70 0 0 1 170 84V176Z", inn = "M37 112V84A63 63 0 0 1 163 84V112Z";
      let b = rod(k, 12, 188, 12) + `<path d="${out}" fill="#000" opacity=".3" transform="translate(0 2)"/><path d="${out}" fill="${pv(k, TR)}"/><path d="${out}" fill="${edge(k)}"/><path d="${inn}" fill="${sh(TR, -0.55)}"/>` +
        view(k, "sunset", 37, 21, 126, 91, { d: inn, seed: 9, trees: 1, hz: 0.82 }) +
        `<path d="M100 112V22M100 112L56 40M100 112L144 40" stroke="${TR}" stroke-width="2.5"/><path d="M60 112A40 40 0 0 1 140 112" fill="none" stroke="${TR}" stroke-width="2.5"/>` +
        rail(k, 37, 106, 126, 6) + box(k, 37, 112, 126, 50, 4, c) + fan(k, 62, 137, 19, c, { n: 4 }) + fan(k, 138, 137, 19, c, { n: 4, ph: 45 });
      b += `<rect x="86" y="117" width="28" height="40" rx="4" fill="${k.lin("dsp", [[0, "#1a1d23"], [1, "#05070a"]], 0, 0, 0, 1)}" stroke="${sh(c, -0.4)}" stroke-width=".8"/><rect x="88" y="119" width="24" height="12" rx="2" fill="#fff" opacity=".06"/>` +
        `<text x="100" y="138" text-anchor="middle" font-family="Segoe UI,Roboto,Arial,sans-serif" font-size="12" font-weight="600" fill="${k.on ? "#7dd3fc" : "#3a4048"}">72&#176;</text>` +
        `<path d="M92 148l3 -3 3 3M102 145l3 3 3 -3" stroke="${k.on ? "#cdeefe" : "#3a4048"}" stroke-width="1.1" fill="none" stroke-linecap="round"/>` + led(k, 108, 121, "#34d399", 1) +
        sill(k, 26, 164, 148) + curtain(k, 10, 12, 34, 170, "#f3efe6", false, { sheer: 1, tie: 0, sway: true, folds: 5 }) + curtain(k, 156, 12, 34, 170, "#f3efe6", true, { sheer: 1, tie: 0, sway: true, delay: 2.1, folds: 5 }) +
        radial(k, 62, 137, 24, "in", [150, 100], { len: 12 }) + radial(k, 138, 137, 24, "in", [80, 30], { len: 12, i0: 2 });
      return k.svg(b); } });

  icons.push({ id: "rvvent", name: "RV roof vent", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, pd = rr(8, 8, 184, 184, 16);
      let b = `<g class="hda-bg" ${k.clip(pd)}>` + view(k, "day", 8, 8, 184, 184, { seed: 31, hz: 0.6, trees: 1 }) +
        `<path d="M0 150Q100 128 200 150V200H0Z" fill="${k.lin("roof", [[0, "#f1f0ec"], [0.3, "#d7d6d0"], [1, "#8d8c88"]], 0, 0, 0, 1)}"/>` +
        [158, 168, 180].map((y) => `<path d="M0 ${y}Q100 ${y - 20} 200 ${y}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>`).join("") + `</g>` + panel(k, pd);
      b += shadow(k, 100, 146, 62, 6, 0.55) + `<path d="M40 146L52 134H148L160 146Z" fill="${k.lin("fl", [[0, "#e6e5e0"], [1, "#a9a8a3"]], 0, 0, 0, 1)}"/>` + box(k, 56, 110, 88, 26, 2, c) +
        `<ellipse cx="100" cy="110" rx="44" ry="7" fill="${sh(c, -0.25)}"/><ellipse cx="100" cy="110" rx="40" ry="5.5" fill="#0a0c10"/>`;
      if (k.on) {
        b += `<g ${k.clip("M60 110A40 5.5 0 0 0 140 110A40 5.5 0 0 0 60 110Z")}>${rotor(k, 100, 110, 36, 4, blade(k, 36, "#c9ced4", 1), { sy: 0.15, disc: "#c9ced4" })}</g>` +
          `<path d="M66 108L58 52M134 108L142 52" stroke="#4b5056" stroke-width="2"/><path d="M58 108L64 44H136L142 108Z" fill="${k.lin("lid", [[0, "#6b5f55", 0.55], [1, "#2d2620", 0.75]], 0, 0, 0, 1)}" stroke="#2a241f" stroke-width="1.2"/>` +
          `<path d="M70 50L66 100" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/><path d="M64 44H136" stroke="#c9b9a8" stroke-opacity=".5" stroke-width="1.5"/>` +
          [-90, -80, -100].map((a, i) => stream(k, 80 + i * 20, 102, a + (i - 1) * 6, 16, i, { col: "#eef7ff", op: 0.7 })).join("");
      } else {
        b += `<path d="M54 112C58 98 142 98 146 112Z" fill="${k.lin("lidc", [[0, "#7a6d62"], [1, "#2d2620"]], 0, 0, 0, 1)}" opacity=".92"/><path d="M64 106C80 100 110 100 128 102" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
      }
      return k.svg(b); } });

  icons.push({ id: "shop", name: "Shop exhaust", colors: sw(GR), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, pd = rr(8, 8, 184, 184, 16);
      const blk = k.pat("blk", 32, 16, `<rect width="32" height="16" fill="#8d8d88"/><rect x=".8" y=".8" width="30.4" height="6.6" fill="#a5a49e"/><rect x="-15.2" y="8.8" width="30.4" height="6.6" fill="#9c9b95"/><rect x="16.8" y="8.8" width="30.4" height="6.6" fill="#a9a8a2"/>`);
      let b = `<path class="hda-bg" d="${pd}" fill="${blk}"/><path class="hda-bg" d="${pd}" fill="${k.rad("bv2", [[0, "#fff", 0.05], [0.7, "#000", 0.2], [1, "#000", 0.6]], 0.5, 0.45, 0.7)}"/>` + panel(k, pd) +
        BG(frame(k, 18, 16, 64, 26, 4, "#5b6066") + view(k, "dusk", 22, 20, 56, 18, { seed: 3, hz: 0.9 }));
      b += `<path d="M30 74V170" stroke="#9aa0a7" stroke-width="3"/>` + R(22, 112, 16, 22, 2, pv(k, "#8a9096")) + `<rect x="27" y="118" width="6" height="9" rx="1" fill="#1e2024"/><rect x="28" y="${k.on ? 119 : 123}" width="4" height="3.4" fill="${k.on ? "#ef4444" : "#6a6f75"}"/>`;
      b += `<rect x="48" y="50" width="136" height="136" fill="#000" opacity=".4" transform="translate(3 4)"/>` + box(k, 48, 50, 136, 136, 2, c) +
        `<path d="M48 50l10 10h116l10-10ZM48 186l10-10h116l10 10Z" fill="#000" opacity=".18"/>` + `<rect x="58" y="60" width="116" height="116" fill="${sh(c, -0.45)}"/>` +
        fan(k, 116, 118, 54, c, { shroud: false, n: 3, wide: 1, bc: "#c4c9cf", gc: "#d8dde2", rings: [0.25, 0.42, 0.58, 0.74, 0.9, 1.04], sp: 8, sw: 1.4, w: 1.1, rev: true });
      [[52, 54], [180, 54], [52, 182], [180, 182]].forEach(([x, y]) => { b += `<circle cx="${x}" cy="${y}" r="1.8" fill="${metal(k, "#c9ced4")}"/>`; });
      b += radial(k, 116, 118, 54, "out", [200, 250, 290, 160], { len: 12 });
      return k.svg(b); } });

  icons.push({ id: "greenhouse", name: "Greenhouse fan", colors: sw(SA), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, pd = rr(8, 8, 184, 184, 16);
      let b = `<g class="hda-bg" ${k.clip(pd)}>` + view(k, "day", 8, 8, 184, 184, { seed: 41, hz: 0.66, trees: 1 }) +
        [54, 100, 146].map((x) => `<rect x="${x - 2}" y="0" width="4" height="200" fill="${metal(k, "#c9ced4")}"/>`).join("") + `<rect x="0" y="134" width="200" height="4" fill="${metal(k, "#c9ced4")}"/>`;
      for (let i = 0; i < 12; i++) b += `<circle cx="${f(16 + i * 15.5)}" cy="${f(30 + ((i * 37) % 90))}" r="1.3" fill="#fff" opacity=".35"/>`;
      b += `<rect x="0" y="160" width="200" height="40" fill="${k.lin("bench", [[0, "#7a5a3c"], [1, "#4a3422"]], 0, 0, 0, 1)}"/>`;
      [[26, 150], [58, 146], [92, 152], [124, 147], [158, 150], [186, 148]].forEach(([x, y], i) => {
        b += `<path d="M${x - 9} ${y + 6}h18l-2.5 12h-13Z" fill="${k.lin("tc", [[0, "#9a4f2e"], [0.4, "#d08257"], [1, "#7a3b20"]])}"/>`;
        for (let j = 0; j < 5; j++) { const a = -150 + j * 30; b += `<ellipse cx="${f(x + Math.cos((a * Math.PI) / 180) * 8)}" cy="${f(y + Math.sin((a * Math.PI) / 180) * 8)}" rx="7" ry="3.4" transform="rotate(${a} ${f(x + Math.cos((a * Math.PI) / 180) * 8)} ${f(y + Math.sin((a * Math.PI) / 180) * 8)})" fill="${k.lin("lf2", [[0, "#2f7a3f"], [0.5, "#8fcf8a"], [1, "#2a6b38"]])}"/>`; }
        if (i % 2) b += `<circle cx="${x + 3}" cy="${y - 6}" r="2.4" fill="#f472b6"/>`;
      });
      b += `</g>` + panel(k, pd) + `<rect x="54" y="28" width="92" height="92" rx="4" fill="#000" opacity=".35" transform="translate(2 3)"/>` + box(k, 54, 28, 92, 92, 4, c) +
        `<circle cx="100" cy="74" r="40" fill="#0b0d11"/><g ${k.clip("M60 74a40 40 0 1 0 80 0a40 40 0 1 0 -80 0Z")}>${k.on ? `<rect x="60" y="34" width="80" height="80" fill="#cfe8f7"/>` + louvers(k, 60, 34, 80, 80, 6, "#a7adb3", true, { flutter: false }) : louvers(k, 60, 34, 80, 80, 6, "#7f858c", false)}<rect x="60" y="34" width="80" height="80" fill="#000" opacity=".25"/>` +
        rotor(k, 100, 74, 36, 3, blade(k, 36, "#d5dade", 1), { ph: 25, disc: "#d5dade", rev: true }) + `</g>` +
        grille(k, 100, 74, 40, c, { rings: [0.3, 0.55, 0.8, 1], sp: 12 }) + hub(k, 100, 74, 7, c) + radial(k, 100, 74, 44, "out", [160, 200, 340, 20, 90], { len: 12 });
      return k.svg(b); } });

  icons.push({ id: "basement", name: "Basement window", colors: sw(BK), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      const con = k.pat("con", 14, 14, `<rect width="14" height="14" fill="#8a8781"/><circle cx="3" cy="4" r=".8" fill="#6f6c66"/><circle cx="10" cy="10" r="1" fill="#9c9992"/><circle cx="11" cy="3" r=".6" fill="#77746e"/>`);
      let b = `<g class="hda-bg"><rect x="6" y="6" width="188" height="188" rx="16" fill="${con}"/><rect x="6" y="6" width="188" height="188" rx="16" fill="${k.rad("cv", [[0, "#fff", 0.06], [0.7, "#000", 0.15], [1, "#000", 0.6]], 0.5, 0.35, 0.75)}"/><path d="M6 128H194" stroke="#000" stroke-opacity=".2" stroke-width="1.5"/></g>`;
      b += frame(k, 24, 38, 152, 72, 6, "#d9dcdf") + view(k, "day", 30, 44, 140, 60, { ground: 1, hz: 0.42, seed: 19 });
      b += `<path d="M30 44L22 26H100L100 104H30Z" fill="none"/><path d="M30 104L22 30H98L100 104Z" fill="#000" opacity=".25"/><path d="M31 103L24 32H97L99 103Z" fill="#cfe5f5" fill-opacity=".16" stroke="#d9dcdf" stroke-width="3.5" stroke-linejoin="round"/><path d="M40 98L36 40" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>` +
        `<path d="M24 32L30 46M97 32L100 46" stroke="#5f646b" stroke-width="1.2"/>` +
        box(k, 104, 44, 66, 60, 3, c) + fan(k, 137, 74, 23, c, { n: 4 }) + led(k, 164, 50, "#34d399", 1.2) +
        `<path d="M18 112H182l4 6H14Z" fill="#a9a59d"/>` + drop(k, 16, 118, 168, 8, 0.4);
      b += `<path class="hda-bg" d="M150 122V186M162 122V186" stroke="${metal(k, "#a8adb3")}" stroke-width="4"/>`;
      if (k.on) b += radial(k, 137, 74, 28, "in", [120, 90, 60], { len: 14 }) + stream(k, 70, 112, 100, 14, 3);
      return k.svg(b); } });

  icons.push({ id: "roundvent", name: "Round wall vent", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      let b = wall(k, "#8f879e") + rod(k, 10, 78, 34) + BG(frame(k, 18, 40, 52, 120, 5) + view(k, "night", 23, 45, 42, 110, { seed: 27, city: 1, hz: 0.78, moon: 0.4 }) + rail(k, 23, 98, 42, 5) + sill(k, 14, 158, 60)) +
        curtain(k, 56, 35, 20, 132, "#5c4e7a", true, { tie: 0.6 });
      b += shadow(k, 134, 136, 46, 5, 0.6) + `<circle cx="134" cy="88" r="50" fill="${k.rad("wr", [[0, "#000", 0.35], [0.88, "#000", 0.3], [1, "#000", 0]])}"/>` +
        `<circle cx="134" cy="86" r="45" fill="#07080b"/><g ${k.clip("M89 86a45 45 0 1 0 90 0a45 45 0 1 0 -90 0Z")}>${rotor(k, 134, 86, 44, 7, blade(k, 44, "#7d848c"), { disc: "#9aa1a8", rev: true })}</g>` +
        `<circle cx="134" cy="88" r="38" fill="#000" opacity=".5"/><circle cx="134" cy="86" r="38" fill="${k.rad("vf" + c.slice(1), [[0, sh(c, 0.25)], [0.75, c], [0.94, sh(c, -0.2)], [1, sh(c, -0.5)]], 0.42, 0.36, 0.66)}"/>` +
        `<circle cx="134" cy="86" r="38" fill="${gloss(k)}" opacity=".6"/><path d="M104 70A34 34 0 0 1 128 52" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      b += k.on ? `<circle class="${P}pulse" cx="134" cy="86" r="30" fill="none" stroke="#7dd3fc" stroke-width="5" stroke-opacity=".25"/><circle cx="134" cy="86" r="30" fill="none" stroke="#bae6fd" stroke-width="1.2" opacity="${f(0.5 + 0.5 * k.lv)}"/>` :
        `<circle cx="134" cy="86" r="30" fill="none" stroke="${sh(c, -0.2)}" stroke-width="1"/>`;
      b += radial(k, 134, 86, 46, "out", [200, 240, 300, 340, 20, 90, 140], { len: 12, ring: false });
      return k.svg(b); } });

  icons.push({ id: "solar", name: "Solar attic fan", colors: sw(BK), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, pd = rr(8, 8, 184, 184, 16);
      const shg = k.pat("shg", 16, 9, `<rect width="16" height="9" fill="#4a4d55"/><rect x=".5" y=".5" width="7" height="7.4" fill="#5a5e67"/><rect x="8.5" y=".5" width="7" height="7.4" fill="#535760"/><rect y="7.8" width="16" height="1.2" fill="#2c2e33"/>`);
      let b = `<g class="hda-bg" ${k.clip(pd)}>` + view(k, "day", 8, 8, 184, 184, { seed: 51, noHills: 1 }) +
        `<g${k.on ? ` class="${P}rays"` : ""}><g transform="translate(155 40)">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M0 -14L2 -32L-2 -32Z" fill="#fff6cc" opacity=".5" transform="rotate(${a})"/>`).join("")}</g></g>` +
        `<path d="M0 118L200 84V200H0Z" fill="${shg}"/><path d="M0 118L200 84V200H0Z" fill="${k.lin("rfs", [[0, "#fff", 0.12], [1, "#000", 0.45]], 0, 0, 0, 1)}"/><path d="M0 116L200 82" stroke="#6b6f78" stroke-width="3"/></g>` + panel(k, pd);
      b += `<path d="M46 150L60 126H150L164 144Z" fill="${metal(k, "#8e949b")}" opacity=".95"/>` + shadow(k, 106, 146, 50, 5, 0.6) +
        `<path d="M64 136V118H148V130Z" fill="#0b0d11"/>`;
      if (k.on) b += `<g ${k.clip("M64 136V118H148V130Z")}><g class="${P}slide" style="animation-duration:${k.dur(0.9, 0.6)}s">${Array.from({ length: 14 }, (_, i) => `<rect x="${58 + i * 8}" y="118" width="3" height="20" fill="#6c727a"/>`).join("")}</g></g>`;
      else b += Array.from({ length: 10 }, (_, i) => `<rect x="${66 + i * 8.4}" y="119" width="3" height="16" fill="#4c5158"/>`).join("");
      b += `<path d="M64 120V118H148V122" fill="none" stroke="#000" stroke-opacity=".5"/>` + `<path d="M62 120C62 92 82 78 106 78C130 78 150 90 150 118Z" fill="${k.rad("dome" + c.slice(1), [[0, sh(c, 0.5)], [0.55, c], [1, sh(c, -0.5)]], 0.38, 0.3, 0.75)}"/>` +
        `<path d="M58 120C70 114 140 112 154 118" stroke="${sh(c, -0.3)}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M74 100C80 88 92 82 104 81" stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      b += `<path d="M90 84L92 66M126 82L124 64" stroke="#9aa0a7" stroke-width="2"/><path d="M66 66L140 54L150 72L76 86Z" fill="#c9ced4"/><path d="M68 66L139 55L147 71L77 84Z" fill="${k.lin("pv1", [[0, "#2b4a8a"], [0.5, "#1a2f5e"], [1, "#0e1a38"]], 0, 0, 1, 1)}"/>`;
      for (let i = 1; i < 4; i++) b += `<path d="M${f(68 + i * 17.75)} ${f(66 - i * 2.75)}L${f(77 + i * 17.5)} ${f(84 - i * 3.25)}" stroke="#8fa8d8" stroke-opacity=".45" stroke-width=".6"/>`;
      b += `<path d="M72 75.5L143 63" stroke="#8fa8d8" stroke-opacity=".45" stroke-width=".6"/>` +
        `<path${k.on ? ` class="${P}pulse"` : ""} d="M84 80L128 59" stroke="#fff" stroke-opacity="${k.on ? 0.45 : 0.18}" stroke-width="1.6" stroke-linecap="round"/>`;
      if (k.on) b += [0, 1, 2, 3].map((i) => `<path class="${P}steam" style="animation-delay:-${f(i * 0.8)}s;animation-duration:${k.dur(3.4, 1.4)}s" d="M${70 + i * 22} 134c-3 -6 3 -10 0 -16s3 -8 0 -12" fill="none" stroke="${WARM}" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>`).join("");
      return k.svg(b); } });

  icons.push({ id: "autolock", name: "Auto-lock fan", colors: sw(GR), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      let b = frame(k, 20, 28, 160, 144, 7) + view(k, "night", 27, 35, 78, 130, { seed: 61, city: 1, hz: 0.78, moon: 0.3 }) + R(101, 35, 8, 130, 0.5, ph(k, TR)) +
        box(k, 108, 35, 65, 130, 4, c) + fan(k, 140.5, 76, 26, c, { n: 5 });
      b += `<rect x="114" y="114" width="53" height="44" rx="3" fill="${k.lin("pan", [[0, "#1a1d23"], [1, "#07090c"]], 0, 0, 0, 1)}" stroke="${sh(c, -0.4)}" stroke-width=".7"/>`;
      const lc = k.on ? "#34d399" : "#4a4f57";
      b += `<path d="M137 128v-4a3.5 3.5 0 0 1 7 0v4" fill="none" stroke="${lc}" stroke-width="1.6"/><rect x="134.5" y="128" width="12" height="9" rx="1.6" fill="${lc}"/><circle cx="140.5" cy="132.5" r="1.2" fill="#07090c"/>` +
        (k.on ? `<circle class="${P}pulse" cx="140.5" cy="130" r="12" fill="${k.rad("lk", [[0, "#34d399", 0.4], [1, "#34d399", 0]])}"/>` : "") +
        [122, 159].map((x) => `<circle cx="${x}" cy="150" r="2.6" fill="#2a2e35" stroke="#5a616b" stroke-width=".6"/>`).join("") +
        `<path d="M129 150h23" stroke="${k.on ? "#7dd3fc" : "#3a4048"}" stroke-width="1.6" stroke-linecap="round"/>`;
      b += `<rect x="96" y="160" width="22" height="9" rx="1.5" fill="${metal(k, "#a8adb3")}"/><circle cx="101" cy="164.5" r="1.4" fill="#5a6067"/><rect x="108" y="158" width="7" height="13" rx="1" fill="${k.on ? "#1f9d6c" : "#5a6067"}"/>` +
        sill(k, 16, 170, 168) + radial(k, 140.5, 76, 31, "in", [200, 160, 110, 70], { len: 14 });
      return k.svg(b); } });

  icons.push({ id: "wholehouse", name: "Whole-house fan", colors: sw(WH), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c;
      let b = `<g class="hda-bg"><path d="M6 22Q6 6 22 6H178Q194 6 194 22V84H6Z" fill="${k.lin("ceil", [[0, "#7c7792"], [1, "#c9c3d6"]], 0, 0, 0, 1)}"/>` +
        `<rect x="6" y="84" width="188" height="110" rx="0" fill="${k.lin("wl", [[0, "#a8a1b8"], [1, "#6a6480", 0]], 0, 0, 0, 1)}"/><path d="M6 84H194" stroke="#ece8f4" stroke-width="3"/><path d="M6 88H194" stroke="#000" stroke-opacity=".15" stroke-width="2"/></g>`;
      const g = "M58 22H142L158 72H42Z";
      b += `<path d="M54 18H146L163 76H37Z" fill="${pv(k, c)}"/><path d="M54 18H146L163 76H37Z" fill="none" stroke="${sh(c, -0.4)}" stroke-opacity=".6"/><path d="${g}" fill="#0a0b0e"/>` +
        `<g ${k.clip(g)}>${rotor(k, 100, 46, 48, 4, blade(k, 48, "#9aa0a7", 1), { sy: 0.42, disc: "#9aa0a7", slow: 1 })}`;
      for (let i = 0; i < 7; i++) { const y = 22 + i * 7.15, x1 = 58 - i * 2.29, x2 = 142 + i * 2.29;
        b += k.on ? `<path d="M${f(x1)} ${f(y)}H${f(x2)}l.6 2.2H${f(x1 - 0.6)}Z" fill="${sh(c, 0.2)}"/>` : `<path d="M${f(x1)} ${f(y)}H${f(x2)}l2.4 7.8H${f(x1 - 2.4)}Z" fill="${k.lin("cl" + c.slice(1), [[0, sh(c, 0.25)], [1, sh(c, -0.25)]], 0, 0, 0, 1)}" stroke="#000" stroke-opacity=".25" stroke-width=".6"/>`; }
      b += `</g>` + hl(56, 19.5, 144, 19.5, 0.6);
      b += BG(frame(k, 58, 104, 84, 86, 6) + view(k, "night", 64, 110, 72, 74, { seed: 71, trees: 1, moon: 0.7 }) + rail(k, 64, 145, 72, 5)) +
        curtain(k, 40, 100, 26, 92, "#eef0f6", false, { sheer: 1, tie: 0, sway: true, folds: 3 }) + curtain(k, 134, 100, 26, 92, "#eef0f6", true, { sheer: 1, tie: 0, sway: true, folds: 3, delay: 1.3 });
      if (k.on) b += [80, 100, 120].map((x, i) => stream(k, x, 102, -90 + (i - 1) * 8, 16, i, { col: "#cfe4ff" })).join("");
      return k.svg(b); } });

  (window.HDA = window.HDA || []).push({
    id: "windowfan", tab: "Window fans", group: "Fans", kind: "fan",
    intro: "Fans that sit in a window or mount on a wall, roof or ceiling. On, blades spin (faster with the speed slider), louvers and lids open, and air streams show if the fan pulls air in or pushes it out.",
    
    css: `
.hda-windowfan-svg{overflow:visible}
.hda-windowfan-spin,.hda-windowfan-spinr{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-windowfan-spin{animation:hda-windowfan-rot 1s linear infinite}
.hda-anim .hda-windowfan-spinr{animation:hda-windowfan-rotr 1s linear infinite}
@keyframes hda-windowfan-rot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes hda-windowfan-rotr{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
.hda-windowfan-flow{opacity:.75}
.hda-anim .hda-windowfan-flow{animation:hda-windowfan-flow 2s ease-in-out infinite}
@keyframes hda-windowfan-flow{0%{opacity:0;transform:translateX(-3px)}35%{opacity:1}100%{opacity:0;transform:translateX(15px)}}
.hda-windowfan-rip,.hda-windowfan-sink{opacity:0;transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-windowfan-rip{animation:hda-windowfan-rip 2s ease-out infinite}
.hda-anim .hda-windowfan-sink{animation:hda-windowfan-sink 2s ease-in infinite}
@keyframes hda-windowfan-rip{0%{opacity:0;transform:scale(1)}25%{opacity:.8}100%{opacity:0;transform:scale(1.45)}}
@keyframes hda-windowfan-sink{0%{opacity:0;transform:scale(1.5)}60%{opacity:.8}100%{opacity:0;transform:scale(1.02)}}
.hda-windowfan-sway{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-windowfan-sway{animation:hda-windowfan-sway 4.5s ease-in-out infinite}
@keyframes hda-windowfan-sway{0%,100%{transform:skewX(0deg)}50%{transform:skewX(3.5deg)}}
.hda-windowfan-osc{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-windowfan-osc{animation:hda-windowfan-osc 7s ease-in-out infinite}
@keyframes hda-windowfan-osc{0%,100%{transform:translateX(0) scaleX(1)}25%{transform:translateX(-5px) scaleX(.84)}75%{transform:translateX(5px) scaleX(.84)}}
.hda-anim .hda-windowfan-pulse{animation:hda-windowfan-pulse 2.4s ease-in-out infinite}
@keyframes hda-windowfan-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-windowfan-tw{animation:hda-windowfan-tw 2.6s ease-in-out infinite}
@keyframes hda-windowfan-tw{0%,100%{opacity:.25}50%{opacity:1}}
.hda-anim .hda-windowfan-rain{animation:hda-windowfan-rain .9s linear infinite}
@keyframes hda-windowfan-rain{0%{transform:translateY(-12px);opacity:0}20%{opacity:1}100%{transform:translateY(14px);opacity:0}}
.hda-windowfan-steam{opacity:.6;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-windowfan-steam{animation:hda-windowfan-steam 3.4s ease-out infinite}
@keyframes hda-windowfan-steam{0%{opacity:0;transform:translateY(8px) scaleX(.8)}30%{opacity:.8}100%{opacity:0;transform:translateY(-22px) scaleX(1.3)}}
.hda-windowfan-flut{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-windowfan-flut{animation:hda-windowfan-flut 1.1s ease-in-out infinite}
@keyframes hda-windowfan-flut{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.35)}}
.hda-anim .hda-windowfan-slide{animation:hda-windowfan-slide .6s linear infinite}
@keyframes hda-windowfan-slide{from{transform:translateX(0)}to{transform:translateX(8px)}}
.hda-windowfan-rays{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-windowfan-rays{animation:hda-windowfan-rot 40s linear infinite}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-windowfan-spin,.hda-anim .hda-windowfan-spinr,.hda-anim .hda-windowfan-flow,.hda-anim .hda-windowfan-rip,.hda-anim .hda-windowfan-sink,.hda-anim .hda-windowfan-sway,.hda-anim .hda-windowfan-osc,.hda-anim .hda-windowfan-pulse,.hda-anim .hda-windowfan-tw,.hda-anim .hda-windowfan-rain,.hda-anim .hda-windowfan-steam,.hda-anim .hda-windowfan-flut,.hda-anim .hda-windowfan-slide,.hda-anim .hda-windowfan-rays{animation:none}}
`,
    icons,
  });
})();
