(function () {
  const H = window.HDAH, sh = H.shade, rgba = H.rgba, mix = H.mix;
  const P = "hda-standfan-";
  const f = (n) => Math.round(n * 100) / 100;
  const C = { white: "#eeede9", black: "#2d2e33", silver: "#b9bfc7", wood: "#8a5a3b", oak: "#b88a5a", mint: "#a9dcc9", pink: "#f3c3d0",
    sky: "#b9d3f0", butter: "#f3e2a6", lav: "#cdbff0", sage: "#9fb59a", brass: "#c4954a", chrome: "#dfe4ea", steel: "#9aa2aa", alu: "#c9ced4", rubber: "#26272b" };
  const WOODS = { "#8a5a3b": 1, "#b88a5a": 1, "#6e4a30": 1 };
  const isWood = (c) => !!WOODS[String(c).toLowerCase()];
  const AIR = "#d6ebff", LEDC = "#7dd3fc", GREEN = "#34d399";
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

  function K(o) {
    const u = o.uid, defs = [], seen = {};
    const st = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] == null ? "" : ` stop-opacity="${s[2]}"`}/>`).join("");
    const k = {
      u, on: !!o.on, lv: Math.max(0.05, Math.min(1, +o.level || 0)), c: o.color || C.white, pre: "",
      def(n, s) { if (!seen[n]) { seen[n] = 1; defs.push(s); } return `url(#${u}-${n})`; },
      lin(n, a, x1 = 0, y1 = 0, x2 = 1, y2 = 0) { return k.def(n, `<linearGradient id="${u}-${n}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st(a)}</linearGradient>`); },
      linU(n, a, x1, y1, x2, y2) { return k.def(n, `<linearGradient id="${u}-${n}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${st(a)}</linearGradient>`); },
      rad(n, a, cx = 0.5, cy = 0.5, r = 0.5) { return k.def(n, `<radialGradient id="${u}-${n}" cx="${cx}" cy="${cy}" r="${r}">${st(a)}</radialGradient>`); },
      svg(b) { return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="${P}svg" aria-hidden="true"><defs>${defs.join("")}</defs>${k.pre}${b}</svg>`; },
    };
    return k;
  }

  const MAT = {
    plastic: (c) => [[0, sh(c, -0.45)], [0.2, sh(c, -0.04)], [0.36, sh(c, 0.42)], [0.52, sh(c, 0.1)], [0.8, sh(c, -0.2)], [1, sh(c, -0.5)]],
    metal: (c) => [[0, sh(c, -0.55)], [0.18, sh(c, 0.2)], [0.38, sh(c, 0.75)], [0.55, c], [0.8, sh(c, -0.25)], [1, sh(c, -0.6)]],
    chrome: (c) => [[0, sh(c, -0.7)], [0.14, sh(c, 0.55)], [0.3, sh(c, -0.4)], [0.47, "#ffffff"], [0.62, sh(c, -0.15)], [0.84, sh(c, -0.6)], [1, sh(c, 0.15)]],
    matte: (c) => [[0, sh(c, -0.5)], [0.3, sh(c, 0.14)], [0.6, c], [1, sh(c, -0.55)]],
    wood: (c) => [[0, sh(c, -0.42)], [0.28, sh(c, 0.2)], [0.62, c], [1, sh(c, -0.42)]],
  };
  const mg = (k, c, kind = "plastic") => k.lin(kind + c.slice(1), MAT[kind](c));
  const mv = (k, c, kind = "plastic") => k.lin("v" + kind + c.slice(1), MAT[kind](c), 0, 0, 0, 1);
  const sph = (k, c, n = "") => k.rad("s" + n + c.slice(1), [[0, sh(c, 0.55)], [0.5, c], [1, sh(c, -0.55)]], 0.36, 0.3, 0.75);
  const bk = (c, d = "plastic") => (isWood(c) ? "wood" : d);
  const gloss = (k) => k.lin("gloss", [[0, "#fff", 0.5], [0.45, "#fff", 0.08], [1, "#fff", 0]], 0, 0, 1, 1);
  const dur = (k, a, b) => (a - b * k.lv).toFixed(2);

  function shadow(k, cx, y, rx) { k.pre += `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${f(rx * 0.15)}" fill="${k.rad("shd", [[0, "#000", 0.5], [0.6, "#000", 0.2], [1, "#000", 0]])}"/>`; return ""; }
  function puck(k, cx, yT, yB, rx, ry, c, kind = "plastic", top = true) {
    let s = `<path d="M${f(cx - rx)} ${f(yT)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(yT)}L${f(cx + rx)} ${f(yB)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(yB)}Z" fill="${mg(k, c, kind)}"/>` +
      `<path d="M${f(cx - rx)} ${f(yB)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(yB)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
    if (top) s += `<ellipse cx="${f(cx)}" cy="${f(yT)}" rx="${f(rx)}" ry="${f(ry)}" fill="${k.rad("tp" + kind + c.slice(1), [[0, sh(c, 0.38)], [0.7, sh(c, 0.06)], [1, sh(c, -0.22)]], 0.42, 0.3, 0.72)}"/>` +
      `<path d="M${f(cx - rx * 0.98)} ${f(yT + ry * 0.12)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx * 0.98)} ${f(yT + ry * 0.12)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>`;
    return s;
  }
  function dome(k, cx, yT, rx, ry, hg, c) {
    return `<path d="M${f(cx - rx)} ${f(yT)}A${f(rx)} ${f(ry + hg)} 0 0 1 ${f(cx + rx)} ${f(yT)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(yT)}Z" fill="${sph(k, c, "d")}"/>` +
      `<path d="M${f(cx - rx * 0.62)} ${f(yT - hg * 0.55)}Q${f(cx - rx * 0.2)} ${f(yT - ry - hg * 0.95)} ${f(cx + rx * 0.25)} ${f(yT - ry - hg * 0.9)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.6" stroke-linecap="round"/>`;
  }
  function roundBase(k, cx, yF, rx, h, c, kind, hg = 0) {
    const ry = rx * 0.26, yB = yF - ry, yT = yB - h;
    return puck(k, cx, yT, yB, rx, ry, c, kind) + (hg ? dome(k, cx, yT, rx * 0.96, ry * 0.96, hg, c) : "");
  }
  function bar(x1, y1, x2, y2, w1, w2, fill, x = "") {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, px = -dy / L, py = dx / L;
    return `<path d="M${f(x1 + (px * w1) / 2)} ${f(y1 + (py * w1) / 2)}L${f(x2 + (px * w2) / 2)} ${f(y2 + (py * w2) / 2)}L${f(x2 - (px * w2) / 2)} ${f(y2 - (py * w2) / 2)}L${f(x1 - (px * w1) / 2)} ${f(y1 - (py * w1) / 2)}Z" fill="${fill}"${x}/>`;
  }
  function crossBase(k, cx, yF, len, c, kind) {
    const hy = yF - 8, s = [];
    const leg = (x, y, dark) => bar(cx, hy + 3, x, y + 3, 8, 5, sh(c, -0.55)) + bar(cx, hy, x, y, 8, 5, dark ? mv(k, sh(c, -0.25), kind) : mv(k, c, kind)) +
      `<ellipse cx="${f(x)}" cy="${f(y + 3.4)}" rx="4.2" ry="1.8" fill="${C.rubber}"/>`;
    s.push(leg(cx - len * 0.56, yF - 17, 1), leg(cx + len * 0.56, yF - 17, 1), leg(cx - len, yF - 2), leg(cx + len, yF - 2));
    return s.join("") + puck(k, cx, hy - 5, hy + 2, 9, 3, c, kind);
  }
  function squareBase(k, cx, yF, w, d, h, c, kind) {
    const yT = yF - h - d;
    return `<path d="M${f(cx - w)} ${f(yT + d)}L${f(cx + w)} ${f(yT + d)}L${f(cx + w)} ${f(yT + d + h)}Q${f(cx + w)} ${f(yF + 1)} ${f(cx + w - 3)} ${f(yF + 1)}L${f(cx - w + 3)} ${f(yF + 1)}Q${f(cx - w)} ${f(yF + 1)} ${f(cx - w)} ${f(yT + d + h)}Z" fill="${mg(k, c, kind)}"/>` +
      `<path d="M${f(cx - w)} ${f(yT + d)}L${f(cx - w * 0.8)} ${f(yT)}L${f(cx + w * 0.8)} ${f(yT)}L${f(cx + w)} ${f(yT + d)}Z" fill="${k.lin("sqt" + c.slice(1), [[0, sh(c, 0.06)], [1, sh(c, 0.4)]], 0, 1, 0, 0)}" stroke="${sh(c, 0.5)}" stroke-opacity=".5" stroke-width=".7" stroke-linejoin="round"/>`;
  }
  function grain(cx, y1, y2, w, c) { return [-0.25, 0.12, 0.3].map((t, i) => `<path d="M${f(cx + w * t)} ${f(y1)}Q${f(cx + w * t + (i - 1) * 0.6)} ${f((y1 + y2) / 2)} ${f(cx + w * t)} ${f(y2)}" stroke="${sh(c, -0.5)}" stroke-opacity=".35" stroke-width=".5" fill="none"/>`).join(""); }
  function pole(k, cx, y1, y2, w, c, kind = "plastic") {
    return `<rect x="${f(cx - w / 2)}" y="${f(y1)}" width="${f(w)}" height="${f(y2 - y1)}" fill="${mg(k, c, kind)}"/>` + (kind === "wood" ? grain(cx, y1, y2, w, c) : "") +
      `<rect x="${f(cx - w * 0.3)}" y="${f(y1)}" width="${f(w * 0.16)}" height="${f(y2 - y1)}" fill="#fff" fill-opacity="${kind === "matte" ? 0.12 : 0.28}"/>`;
  }
  const collar = (k, cx, y, rx, h, c, kind) => puck(k, cx, y, y + h, rx, rx * 0.3, c, kind);
  function neck(k, cx, y1, y2, w, c, kind) {
    return `<rect x="${f(cx - w / 2)}" y="${f(y1)}" width="${f(w)}" height="${f(y2 - y1)}" rx="${f(w * 0.3)}" fill="${mg(k, c, kind)}"/>` +
      `<circle cx="${f(cx + w / 2 + 2.6)}" cy="${f(y1 + (y2 - y1) * 0.5)}" r="3.1" fill="${sph(k, sh(c, -0.15), "kn")}"/>`;
  }
  function pod(k, cx, y, c, kind, w = 26, h = 15) {
    const x = cx - w / 2, on = k.on, sel = Math.min(3, 1 + Math.floor(k.lv * 2.99));
    let s = `<rect x="${f(x)}" y="${y}" width="${w}" height="${h}" rx="5" fill="${mg(k, c, kind)}"/><rect x="${f(x + 2)}" y="${y + 1}" width="${w - 4}" height="2" rx="1" fill="#fff" fill-opacity=".3"/>`;
    const kw = (w - 8) / 4;
    for (let i = 0; i < 4; i++) { const down = on ? i === sel : i === 0;
      s += `<rect x="${f(x + 4 + i * kw + 0.4)}" y="${y + (down ? 4.6 : 3.6)}" width="${f(kw - 0.8)}" height="5.6" rx="1.2" fill="${k.lin("key", [[0, "#ffffff"], [1, "#b9bcc4"]], 0, 0, 0, 1)}" fill-opacity="${down ? 0.7 : 1}" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`; }
    return s + `<circle cx="${cx}" cy="${y + h - 3}" r="1.3" fill="${on ? GREEN : "#555a62"}"${on ? ` class="${P}pulse"` : ""}/>`;
  }

  function bladeD(t, R, w) {
    const r0 = R * 0.17;
    if (t === "slim") return `M-2.5 ${f(-r0)}C${f(-w * 0.9)} ${f(-R * 0.35)} ${f(-w)} ${f(-R * 0.8)} ${f(-w * 0.3)} ${f(-R * 0.98)}C${f(w * 0.3)} ${f(-R)} ${f(w * 0.75)} ${f(-R * 0.86)} ${f(w * 0.6)} ${f(-R * 0.6)}C${f(w * 0.5)} ${f(-R * 0.4)} ${f(w * 0.25)} ${f(-R * 0.25)} 2.5 ${f(-r0)}Z`;
    if (t === "petal") return `M-2.5 ${f(-r0)}C${f(-w * 1.1)} ${f(-R * 0.3)} ${f(-w * 1.05)} ${f(-R * 0.96)} 0 ${f(-R * 0.98)}C${f(w * 1.05)} ${f(-R * 0.96)} ${f(w * 1.1)} ${f(-R * 0.3)} 2.5 ${f(-r0)}Z`;
    if (t === "sickle") return `M-3 ${f(-r0)}C${f(-w * 0.9)} ${f(-R * 0.4)} ${f(-w * 0.3)} ${f(-R * 0.85)} ${f(w * 0.55)} ${f(-R * 0.99)}C${f(w * 0.75)} ${f(-R * 0.82)} ${f(w * 0.55)} ${f(-R * 0.45)} 3 ${f(-r0)}Z`;
    if (t === "paddle") return `M-4 ${f(-r0)}L${f(-w)} ${f(-R * 0.55)}Q${f(-w)} ${f(-R * 0.97)} 0 ${f(-R * 0.98)}Q${f(w * 0.95)} ${f(-R * 0.96)} ${f(w * 0.9)} ${f(-R * 0.6)}L4 ${f(-r0)}Z`;
    return `M-3 ${f(-r0)}C${f(-w)} ${f(-R * 0.32)} ${f(-w * 1.05)} ${f(-R * 0.78)} ${f(-w * 0.35)} ${f(-R * 0.97)}C${f(w * 0.2)} ${f(-R)} ${f(w * 0.85)} ${f(-R * 0.9)} ${f(w * 0.9)} ${f(-R * 0.66)}C${f(w * 0.9)} ${f(-R * 0.45)} ${f(w * 0.45)} ${f(-R * 0.25)} 3 ${f(-r0)}Z`;
  }
  function blade(k, t, R, w, c, a = 1, key = "b", kind = "plastic") {
    const d = bladeD(t, R, w);
    const g = kind === "metal" || kind === "chrome" ? k.lin(key + "m" + c.slice(1), MAT[kind](c), 0, 0, 1, 0.25) : k.lin(key + "g" + c.slice(1), [[0, sh(c, -0.35)], [0.35, sh(c, 0.35)], [0.6, c], [1, sh(c, -0.4)]], 0, 0, 1, 0.3);
    return `<path d="${d}" fill="${g}"${a < 1 ? ` fill-opacity="${a}"` : ""} stroke="${sh(c, -0.5)}" stroke-opacity=".5" stroke-width=".7"/><path d="${d}" fill="${gloss(k)}" opacity=".7"/>` +
      `<path d="M0 ${f(-R * 0.2)}Q${f(w * 0.18)} ${f(-R * 0.55)} ${f(w * 0.05)} ${f(-R * 0.88)}" stroke="#000" stroke-opacity=".14" stroke-width="1" fill="none"/>`;
  }
  function rotor(k, q) {
    const { R, n, bl, phase = 0, key = "r", disc = "#cccccc", hub = R * 0.2 } = q, u = k.u, on = k.on, lv = k.lv;
    k.def(key + "b", `<g id="${u}-${key}b">${bl}</g>`);
    let set = "";
    for (let i = 0; i < n; i++) set += `<use xlink:href="#${u}-${key}b" transform="rotate(${f(phase + (i * 360) / n)})"/>`;
    k.def(key + "s", `<g id="${u}-${key}s">${set}</g>`);
    let mid = "";
    if (on) {
      const a = Math.min(0.85, hub / R);
      mid += `<circle r="${f(R)}" fill="${k.rad(key + "disc", [[0, disc, 0], [a, disc, 0], [a + 0.08, disc, f(0.12 + 0.16 * lv)], [0.9, disc, f(0.08 + 0.14 * lv)], [1, disc, 0]])}"/>`;
      const step = Math.min(14, (360 / n) * 0.16) * (0.5 + 0.7 * lv);
      [0.34, 0.2, 0.1].forEach((g, i) => { mid += `<use xlink:href="#${u}-${key}s" transform="rotate(${f(-step * (i + 1))})" opacity="${f(g * (0.55 + 0.5 * lv))}"/>`; });
    }
    mid += `<use xlink:href="#${u}-${key}s"${on ? ` opacity="${f(1 - 0.25 * lv)}"` : ""}/>`;
    const spin = on ? ` class="${P}spin" style="animation-duration:${(1.4 - lv).toFixed(2)}s"` : "";
    return `<g${spin}><circle r="${f(R + 1)}" fill="none"/>${mid}</g>`;
  }
  const pt = (r, a) => `${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`;
  function grille(k, R, q = {}) {
    const { style = "rings", c = "#d8dbe0", n = 28, rings = [0.34, 0.56, 0.78], w = 0.8, hub = R * 0.24, rimW = 3, rim = c, alpha = 1, hi = true } = q;
    const rr = Math.round(R);
    const wg = k.linU("w" + c.slice(1) + rr, [[0, sh(c, 0.6)], [0.45, c], [1, sh(c, -0.5)]], -R, -R, R, R);
    let d = "";
    if (style === "deco") {
      for (let y = -R + 6; y < R - 3; y += 6) { const x = Math.sqrt(R * R - y * y) - 0.5; d += `M${f(-x)} ${f(y)}H${f(x)}`; }
      d += `M0 ${-R}V${R}`;
    } else {
      for (let i = 0; i < n; i++) { const a = (i * 2 * Math.PI) / n;
        d += style === "spiral" ? `M${pt(hub, a)}Q${pt(R * 0.64, a + 0.5)} ${pt(R, a + 0.95)}` : `M${pt(hub, a)}L${pt(R, a)}`; }
    }
    let s = `<g fill="none" stroke="${wg}" opacity="${alpha}"><path d="${d}" stroke-width="${w}"/>` + rings.map((t) => `<circle r="${f(R * t)}" stroke-width="${f(w * 1.3)}"/>`).join("") +
      (style === "deco" ? "" : `<circle r="${f(hub)}" stroke-width="${f(w * 1.6)}"/>`) + `</g>`;
    s += `<circle r="${f(R)}" fill="none" stroke="${k.linU("rim" + rim.slice(1) + rr, [[0, sh(rim, 0.55)], [0.5, rim], [1, sh(rim, -0.55)]], -R, -R, R, R)}" stroke-width="${rimW}" opacity="${alpha}"/>`;
    if (hi) s += `<path d="M${pt(R, Math.PI * 1.08)}A${R} ${R} 0 0 1 ${pt(R, Math.PI * 1.55)}" stroke="#fff" stroke-opacity=".5" stroke-width="${f(Math.max(0.7, rimW * 0.35))}" fill="none" stroke-linecap="round"/>`;
    return s;
  }
  function badge(k, r, c, kind = "plastic", ring = true) {
    return `<circle r="${f(r)}" fill="${sph(k, c, "b")}"/>` + (ring ? `<circle r="${f(r * 0.66)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>` : "") +
      `<ellipse cx="${f(-r * 0.32)}" cy="${f(-r * 0.4)}" rx="${f(r * 0.38)}" ry="${f(r * 0.22)}" fill="#fff" fill-opacity=".45" transform="rotate(-30 ${f(-r * 0.32)} ${f(-r * 0.4)})"/>`;
  }
  function head(k, q) {
    const { R, n = 3, bt = "broad", bw = R * 0.42, bc = "#cfe0f2", ba = 0.8, bkind = "plastic", phase = 0, cage = {}, body, kind = "plastic", motor, key = "r", back = true, bd = true } = q;
    let s = "";
    if (back) s += `<g transform="translate(${f(R * 0.07)} ${f(-R * 0.045)})">${grille(k, R * 0.97, Object.assign({}, cage, { rings: [], alpha: 0.38, hi: false, rimW: (cage.rimW || 3) * 0.8 }))}</g>`;
    s += `<circle cx="${f(R * 0.06)}" cy="${f(-R * 0.03)}" r="${f(R * 0.42)}" fill="${sph(k, motor || sh(body, -0.3), "m")}"/>`;
    s += rotor(k, { R: R - 3, n, phase, key, disc: bc, hub: R * 0.2, bl: blade(k, bt, R - 4, bw, bc, ba, key, bkind) });
    s += grille(k, R, cage);
    if (bd) s += badge(k, R * 0.19, body, kind);
    return s;
  }
  function osc(k, inner, cls = "osc", delay = 0) {
    return k.on ? `<g class="${P}${cls}"${delay ? ` style="animation-delay:-${delay}s"` : ""}>${inner}</g>` : `<g>${inner}</g>`;
  }
  const at = (cx, cy, s) => `<g transform="translate(${cx} ${cy})">${s}</g>`;
  function air(k, cx, cy, R, n = 3, sides = [-1, 1]) {
    if (!k.on) return "";
    const d = dur(k, 2.8, 1.3); let s = "";
    for (let i = 0; i < n; i++) { const y = cy - R * 0.45 + (i * R * 0.9) / Math.max(1, n - 1);
      sides.forEach((sd) => { const x = cx + sd * (R + 5);
        s += `<path class="${P}air${sd < 0 ? "l" : "r"}" style="animation-duration:${d}s;animation-delay:-${f(i * 0.62 + (sd > 0 ? 0.31 : 0))}s" d="M${f(x)} ${f(y)}c${sd * 5} -3 ${sd * 9} 3 ${sd * 14} 0" fill="none" stroke="${AIR}" stroke-opacity="${f(0.28 + 0.22 * k.lv)}" stroke-width="1.3" stroke-linecap="round"/>`; }); }
    return s;
  }
  function seg(x, y, dg, col, on) {
    const M = ["abcdef", "bc", "abged", "abgcd", "fgbc", "afgcd", "afgedc", "abc", "abcdefg", "abcdfg"][dg] || "";
    const S = { a: [1, 0, 4, 1.2], g: [1, 4.4, 4, 1.2], d: [1, 8.8, 4, 1.2], f: [0, 0.8, 1.2, 3.8], b: [4.8, 0.8, 1.2, 3.8], e: [0, 5.2, 1.2, 3.8], c: [4.8, 5.2, 1.2, 3.8] };
    return Object.keys(S).map((s) => { const r = S[s], lit = on && M.indexOf(s) >= 0;
      return `<rect x="${f(x + r[0])}" y="${f(y + r[1])}" width="${r[2]}" height="${r[3]}" rx=".5" fill="${lit ? col : "#ffffff"}" fill-opacity="${lit ? 1 : 0.06}"/>`; }).join("");
  }

  const icons = [];
  const sw = (a) => a;

  icons.push({ id: "classic", name: "Classic 16-inch", colors: sw([C.white, C.black, C.silver, C.mint, C.pink]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 46, kd = bk(c);
      const b = shadow(k, cx, 188, 46) + roundBase(k, cx, 188, 38, 7, c, kd, 5) + pole(k, cx, 112, 176, 6.5, c, kd) + collar(k, cx, 170, 6, 3, c, kd) +
        pod(k, cx, 128, c, kd) + osc(k, neck(k, cx, 92, 116, 10, c, kd) + at(cx, cy, head(k, { R, n: 3, bt: "broad", bc: "#bcd6f2", ba: 0.72, body: c, kind: kd, cage: { c: sh(c, 0.1), n: 30, rimW: 3.2 } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "remote", name: "Remote control", colors: sw([C.black, C.white, C.silver, C.wood]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 58, R = 45, kd = bk(c, "matte"), on = k.on;
      const lvl = Math.min(9, Math.max(1, Math.round(k.lv * 9)));
      const panel = `<rect x="${cx - 11}" y="120" width="22" height="30" rx="5" fill="${mg(k, c, kd)}"/><rect x="${cx - 8}" y="124" width="16" height="13" rx="2.5" fill="#101114" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>` +
        seg(cx - 3, 125.6, lvl, "#ff6b5b", on) + `<circle cx="${cx - 4}" cy="143" r="1.6" fill="${on ? "#ff6b5b" : "#4a4d55"}"/><circle cx="${cx + 4}" cy="143" r="1.6" fill="#6b6f78"/>` +
        (on ? `<rect x="${cx - 8}" y="124" width="16" height="13" rx="2.5" fill="#ff6b5b" fill-opacity=".1" class="${P}pulse"/>` : "");
      const rem = `<g transform="translate(146 181) rotate(-8)"><rect x="-13" y="-3.5" width="26" height="7" rx="3.5" fill="${sh(c, -0.5)}"/><rect x="-13" y="-4.6" width="26" height="6.4" rx="3.2" fill="${mv(k, c, kd)}"/>` +
        `<circle cx="-7" cy="-1.4" r="1.2" fill="${on ? "#ff6b5b" : "#777"}"/><circle cx="-2" cy="-1.4" r="1" fill="#999"/><circle cx="2" cy="-1.4" r="1" fill="#999"/><circle cx="6" cy="-1.4" r="1" fill="#999"/></g>`;
      const b = shadow(k, cx, 188, 50) + `<ellipse cx="146" cy="183" rx="15" ry="2.5" fill="#000" fill-opacity=".3"/>` + roundBase(k, cx, 188, 42, 5, c, kd) + pole(k, cx, 110, 178, 6, c, kd) + panel + collar(k, cx, 150, 6, 3, c, kd) +
        osc(k, neck(k, cx, 90, 114, 10, c, kd) + at(cx, cy, head(k, { R, n: 5, bt: "slim", bw: R * 0.34, bc: "#5d6670", ba: 0.82, body: c, kind: kd, motor: "#2b2d33", cage: { c: sh(c, 0.18), n: 40, w: 0.7, rings: [0.32, 0.5, 0.68, 0.86], rimW: 3.6 } }))) + rem + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "cross", name: "Cross base", colors: sw([C.silver, C.white, C.black, C.sky]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 58, R = 44, kd = bk(c, "metal");
      const b = shadow(k, cx, 186, 58) + crossBase(k, cx, 186, 50, c, kd) + pole(k, cx, 106, 174, 5, C.chrome, "chrome") + collar(k, cx, 140, 4.6, 6, c, kd) +
        osc(k, neck(k, cx, 88, 110, 9, c, kd) + at(cx, cy, head(k, { R, n: 3, bt: "petal", bw: R * 0.36, bc: "#e8eef6", ba: 0.6, body: c, kind: kd, cage: { c: C.alu, n: 26, rimW: 2.6 } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "chrome", name: "Retro chrome", colors: sw(["#a8c8c0", C.black, C.white, C.pink, C.sky]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 48;
      const b = shadow(k, cx, 188, 44) + roundBase(k, cx, 188, 36, 8, C.chrome, "chrome") + dome(k, cx, 172, 30, 7.4, 9, c) + pole(k, cx, 112, 168, 6, C.chrome, "chrome") +
        collar(k, cx, 158, 6, 4, c, "plastic") +
        osc(k, `<path d="M${cx - 9} 116Q${cx} 104 ${cx + 9} 116Z" fill="${sph(k, c, "n")}"/>` + neck(k, cx, 90, 116, 9, C.chrome, "chrome") +
          at(cx, cy, head(k, { R, n: 4, bt: "broad", bw: R * 0.4, bc: C.chrome, ba: 1, bkind: "chrome", body: c, motor: sh(c, -0.25), cage: { c: C.chrome, n: 18, w: 1.2, rings: [0.42, 0.7], rimW: 4.2 } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "vintage", name: "Wood and brass", colors: sw([C.wood, C.oak, "#6e4a30", C.black, "#3f5a4a"]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 46, kd = bk(c, "matte"), br = C.brass;
      const b = shadow(k, cx, 188, 44) + roundBase(k, cx, 188, 38, 6, c, kd, 3) + collar(k, cx, 170, 14, 3, br, "metal") + pole(k, cx, 112, 172, 8, c, kd) +
        collar(k, cx, 112, 6, 3, br, "metal") + collar(k, cx, 148, 5.5, 2.5, br, "metal") +
        osc(k, neck(k, cx, 92, 114, 9, br, "metal") + at(cx, cy, head(k, { R, n: 4, bt: "broad", bw: R * 0.44, bc: br, ba: 1, bkind: "metal", body: br, kind: "metal", motor: sh(c, -0.1),
          cage: { c: br, n: 12, w: 1.4, rings: [0.5], hub: R * 0.26, rimW: 3.6 } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "dc7", name: "Quiet DC", colors: sw([C.white, C.black, C.silver, C.sage]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 58, R = 48, kd = bk(c), on = k.on;
      let dots = ""; for (let i = 0; i < 4; i++) dots += `<circle cx="${cx}" cy="${136 + i * 5}" r="1" fill="${on && i <= Math.round(k.lv * 3) ? LEDC : "#8a8f98"}" fill-opacity="${on ? 1 : 0.6}"/>`;
      const b = shadow(k, cx, 188, 40) + roundBase(k, cx, 188, 32, 3.5, c, kd) + pole(k, cx, 112, 180, 4.5, c, kd) + `<rect x="${cx - 3.4}" y="132" width="6.8" height="20" rx="3.4" fill="${mg(k, sh(c, -0.12), kd)}"/>` + dots +
        osc(k, neck(k, cx, 98, 116, 7, c, kd) + at(cx, cy, head(k, { R, n: 7, bt: "sickle", bw: R * 0.3, bc: mix(c, "#cfd8e4", 0.6), ba: 0.62, body: c, kind: kd, cage: { c: sh(c, 0.12), n: 56, w: 0.5, rings: [0.3, 0.46, 0.62, 0.78, 0.9], rimW: 2.4 } }) + `<circle cy="${f(R * 0.1)}" r="1.4" fill="${on ? LEDC : "#7a7f88"}"/>`)) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "bladeless", name: "Bladeless loop", colors: sw([C.silver, C.white, C.black, C.pink]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 64, kd = bk(c, "metal"), on = k.on, rx = 31, ry = 46, t = 8;
      const loop = (x, y, a, b2, fill) => `<path d="M${x - a} ${y}A${a} ${b2} 0 1 0 ${x + a} ${y}A${a} ${b2} 0 1 0 ${x - a} ${y}ZM${x - a + t} ${y}A${a - t} ${b2 - t} 0 1 1 ${x + a - t} ${y}A${a - t} ${b2 - t} 0 1 1 ${x - a + t} ${y}Z" fill-rule="evenodd" fill="${fill}"/>`;
      let holes = ""; for (let r = 0; r < 6; r++) for (let i = -2; i <= 2; i++) holes += `<circle cx="${f(cx + i * 3.2 + (r % 2) * 1.6 - 0.8)}" cy="${128 + r * 3.4}" r=".8" fill="#000" fill-opacity=".45"/>`;
      let waves = "";
      if (on) { const d = dur(k, 3, 1.4); [0, 1, 2].forEach((i) => { waves += `<ellipse class="${P}wave" style="animation-duration:${d}s;animation-delay:-${f(i * d / 3)}s" cx="${cx}" cy="${cy}" rx="${rx - t - 2}" ry="${ry - t - 2}" fill="none" stroke="${AIR}" stroke-opacity=".5" stroke-width="1.2"/>`; }); }
      const ring = loop(cx + 2, cy - 1.5, rx, ry, sh(c, -0.45)) + loop(cx, cy, rx, ry, k.lin("loop" + c.slice(1), MAT[kd](c), 0, 0, 1, 0.2)) +
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx - t}" ry="${ry - t}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>` +
        `<path d="M${cx - rx + 2} ${cy + 8}A${rx - 2} ${ry - 2} 0 0 1 ${cx - 8} ${cy - ry + 2.6}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>` +
        `<path d="M${cx - rx + t + 1} ${cy}A${rx - t - 1} ${ry - t - 1} 0 0 1 ${cx} ${cy - ry + t + 1}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>` + waves +
        `<rect x="${cx - 9}" y="${cy + ry - 4}" width="18" height="10" rx="3" fill="${mg(k, c, kd)}"/>`;
      const col = `<path d="M${cx - 12} 118L${cx - 13} 176L${cx + 13} 176L${cx + 12} 118Z" fill="${mg(k, c, kd)}"/>` + holes + `<ellipse cx="${cx}" cy="118" rx="12" ry="3.2" fill="${sph(k, c, "t")}"/>` +
        `<rect x="${cx - 13}" y="160" width="26" height="2" fill="#000" fill-opacity=".25"/><circle cx="${cx}" cy="167" r="1.6" fill="${on ? LEDC : "#6a6f78"}"/>`;
      const b = shadow(k, cx, 188, 36) + roundBase(k, cx, 188, 26, 5, c, kd) + col + osc(k, ring) +
        (on ? air(k, cx, cy, rx - 2, 3) : "");
      return k.svg(b); } });

  icons.push({ id: "misting", name: "Outdoor misting", colors: sw([C.black, C.white, C.sky, C.silver]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 58, R = 50, kd = bk(c, "matte"), on = k.on;
      let noz = "", mist = "";
      const md = dur(k, 2.6, 1);
      [-2.5, -2.05, -1.6, -1.1, -0.65].forEach((a, i) => { const x = f(Math.cos(a) * (R + 1)), y = f(Math.sin(a) * (R + 1));
        noz += `<circle cx="${x}" cy="${y}" r="2.4" fill="${k.lin("nz", MAT.metal(C.brass))}"/><circle cx="${x}" cy="${y}" r=".8" fill="#2a2620"/>`;
        if (on) [0, 1].forEach((j) => { mist += `<circle class="${P}mist" style="animation-duration:${md}s;animation-delay:-${f(i * 0.37 + j * md / 2)}s" cx="${f(Math.cos(a) * (R + 9))}" cy="${f(Math.sin(a) * (R + 9))}" r="7" fill="${k.rad("mp", [[0, "#ffffff", 0.7], [0.5, "#e6f4ff", 0.3], [1, "#e6f4ff", 0]])}"/>`; }); });
      const tube = `<path d="M${pt(R + 1, -2.5)}A${R + 1} ${R + 1} 0 0 1 ${pt(R + 1, -0.65)}" fill="none" stroke="#1e2024" stroke-width="1.6"/>`;
      const tank = `<path d="M${cx - 34} 154L${cx + 34} 154L${cx + 32} 180L${cx - 32} 180Z" fill="${mg(k, c, kd)}"/><path d="M${cx - 34} 154L${cx - 28} 148L${cx + 28} 148L${cx + 34} 154Z" fill="${sh(c, 0.25)}"/>` +
        `<rect x="${cx - 22}" y="158" width="20" height="17" rx="3" fill="#0d2a44" fill-opacity=".7" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>` +
        `<rect x="${cx - 22}" y="${f(175 - 14 * (on ? 0.5 + 0.4 * k.lv : 0.7))}" width="20" height="${f(14 * (on ? 0.5 + 0.4 * k.lv : 0.7))}" rx="2" fill="${k.lin("wat", [[0, "#9fd8ff", 0.85], [1, "#2a63b0", 0.85]], 0, 0, 0, 1)}"/>` +
        `<rect x="${cx - 20}" y="159" width="3" height="15" rx="1.5" fill="#fff" fill-opacity=".3"/><rect x="${cx + 6}" y="160" width="20" height="3" rx="1.5" fill="#000" fill-opacity=".3"/><rect x="${cx + 6}" y="166" width="20" height="3" rx="1.5" fill="#000" fill-opacity=".3"/>` +
        [cx - 26, cx + 26].map((x) => `<circle cx="${x}" cy="182" r="5" fill="${sph(k, C.rubber, "wh")}"/><circle cx="${x}" cy="182" r="1.8" fill="${C.alu}"/>`).join("");
      const b = shadow(k, cx, 188, 50) + tank + pole(k, cx, 112, 150, 7, c, kd) + `<path d="M${cx + 6} 150C${cx + 14} 140 ${cx + 6} 128 ${cx + 4} 118" fill="none" stroke="#1e2024" stroke-width="1.8"/>` +
        osc(k, neck(k, cx, 92, 116, 11, c, kd) + at(cx, cy, head(k, { R, n: 3, bt: "paddle", bw: R * 0.4, bc: C.steel, ba: 1, bkind: "metal", body: c, kind: kd, cage: { c: sh(c, 0.2), n: 32, w: 1, rimW: 4 } }) + tube + noz + mist)) + (on ? air(k, cx, cy + 10, R, 2) : "");
      return k.svg(b); } });

  icons.push({ id: "industrial", name: "High velocity", colors: sw([C.black, C.silver, "#c8a24a", "#3f5f4a", C.sky]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 64, R = 54, kd = bk(c, "matte");
      const legs = bar(cx + 1, 132, cx + 12, 174, 4, 3, mg(k, sh(c, -0.25), kd)) + bar(cx - 2, 132, cx - 52, 184, 5, 4, mg(k, c, kd)) + bar(cx + 2, 132, cx + 52, 184, 5, 4, mg(k, c, kd)) +
        [[cx + 12, 175], [cx - 52, 185], [cx + 52, 185]].map((p) => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="4.4" ry="1.8" fill="${C.rubber}"/>`).join("");
      const b = shadow(k, cx, 187, 60) + legs + collar(k, cx, 126, 7, 9, c, kd) + pole(k, cx, 112, 128, 7, C.chrome, "chrome") +
        osc(k, neck(k, cx, 100, 118, 13, c, kd) + at(cx, cy, head(k, { R, n: 3, bt: "paddle", bw: R * 0.44, bc: C.alu, ba: 1, bkind: "metal", body: c, kind: kd, motor: c,
          cage: { c: C.chrome, n: 44, w: 0.9, rings: [0.3, 0.48, 0.66, 0.84], rimW: 4.6, rim: C.chrome } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "circulator", name: "Air circulator", colors: sw([C.white, C.black, C.silver, C.mint]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 42, kd = bk(c);
      const shroud = `<circle cx="3.5" cy="-2.5" r="${R + 6}" fill="${sph(k, sh(c, -0.25), "sr")}"/><circle r="${R + 6}" fill="${sph(k, c, "sf")}"/>` +
        [R + 4, R + 2].map((r) => `<circle r="${r}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".8"/>`).join("") + `<circle r="${R + 0.5}" fill="#17181c"/>`;
      const b = shadow(k, cx, 188, 40) + roundBase(k, cx, 188, 32, 6, c, kd, 4) + pole(k, cx, 112, 176, 6, c, kd) + pod(k, cx, 140, c, kd, 22, 13) +
        osc(k, neck(k, cx, 94, 116, 12, c, kd) + at(cx, cy, shroud + head(k, { R, n: 5, bt: "broad", bw: R * 0.36, bc: sh(c, -0.1), ba: 0.95, body: c, kind: kd, back: false,
          cage: { style: "spiral", c: sh(c, 0.08), n: 22, w: 1.3, rings: [], hub: R * 0.3, rimW: 2 } }))) + air(k, cx, cy, R + 6);
      return k.svg(b); } });

  icons.push({ id: "double", name: "Double head", colors: sw([C.white, C.black, C.silver, C.sky]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 56, R = 30, kd = bk(c), L = 64, Rr = 136;
      const hd = (x, key) => neck(k, x, 70, 96, 7, c, kd) + at(x, cy, head(k, { R, n: 3, key, bt: "broad", bw: R * 0.42, bc: "#bcd6f2", ba: 0.72, body: c, kind: kd, cage: { c: sh(c, 0.1), n: 24, w: 0.7, rings: [0.4, 0.7], rimW: 2.6 } }));
      const tbar = `<rect x="${L}" y="94" width="${Rr - L}" height="7" rx="3.5" fill="${mv(k, c, kd)}"/><rect x="${L + 3}" y="95" width="${Rr - L - 6}" height="1.5" rx=".75" fill="#fff" fill-opacity=".35"/>`;
      const b = shadow(k, cx, 188, 44) + roundBase(k, cx, 188, 36, 6, c, kd, 4) + pole(k, cx, 100, 176, 6.5, c, kd) + pod(k, cx, 134, c, kd) + tbar +
        osc(k, hd(L, "ra")) + osc(k, hd(Rr, "rb"), "osc", 4.5) + air(k, L, cy, R, 3, [-1]) + air(k, Rr, cy, R, 3, [1]);
      return k.svg(b); } });

  icons.push({ id: "telescope", name: "Telescoping", colors: sw([C.black, C.white, C.silver, C.mint]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 62, R = 42, kd = bk(c, "matte");
      const clamp = collar(k, cx, 132, 6.8, 7, c, kd) + `<path d="M${cx + 6} 135.5H${cx + 13}" stroke="${mg(k, C.steel, "metal")}" stroke-width="2.4"/><rect x="${cx + 12}" y="131.5" width="6" height="8" rx="2" fill="${sph(k, sh(c, 0.1), "ck")}"/>`;
      const marks = [112, 117, 122, 127].map((y) => `<path d="M${cx - 1.6} ${y}H${cx + 1.6}" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>`).join("");
      const b = shadow(k, cx, 188, 46) + squareBase(k, cx, 188, 34, 9, 7, c, kd) + pole(k, cx, 138, 174, 9, c, kd) + pole(k, cx, 106, 134, 5, C.chrome, "chrome") + marks + clamp +
        osc(k, neck(k, cx, 92, 110, 9, c, kd) + at(cx, cy, head(k, { R, n: 5, bt: "slim", bw: R * 0.34, bc: mix(c, "#9aa6b4", 0.5), ba: 0.85, body: c, kind: kd, cage: { c: sh(c, 0.2), n: 34, w: 0.8, rimW: 3 } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  // (parts) Fan (the blades, the swing, the air, the pole dot) and Light (the ring round the head and the base ring, in
  // the light's color, dimmed by its level); the app screen lights with either. As a Device Image both follow the one device.
  icons.push({ id: "smart", name: "Smart ring light", colors: sw([C.white, C.black, C.silver, C.lav]), picker: true, colorLabel: "Body",
    parts: [{ id: "fan", name: "Fan" }, { id: "light", name: "Ring light" }],
    render(o) { const k = K(MF.as(o, "fan")), c = k.c, cx = 100, cy = 58, R = 46, kd = bk(c), on = MF.on(o, "light"), fon = k.on, LEDC = MF.col(o, "light", "#7dd3fc");
      const llv = Math.max(0.05, Math.min(1, +MF.lv(o, "light") || 0));
      const ringL = on ? `<circle r="${R + 2}" fill="none" stroke="${LEDC}" stroke-opacity=".22" stroke-width="7"/><g opacity="${f(0.6 + 0.4 * llv)}"><circle class="${P}pulse" r="${R + 1.5}" fill="none" stroke="${LEDC}" stroke-width="1.8"/></g>` +
        `<circle r="${R + 1.5}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".6"/>` : `<circle r="${R + 1.5}" fill="none" stroke="#9aa0aa" stroke-opacity=".55" stroke-width="1.4"/>`;
      const app = `<g transform="translate(140 174) rotate(-10)"><rect x="-8" y="-3" width="16" height="6" rx="1.6" fill="#15161a"/><rect x="-8" y="-4" width="16" height="5.6" rx="1.6" fill="#202228"/><rect x="-6.6" y="-3.2" width="13.2" height="4" rx="1" fill="${on || fon ? k.lin("scr", [[0, "#7dd3fc"], [1, "#a78bfa"]]) : "#33363e"}"/></g>`;
      const baseGlow = on ? `<ellipse cx="${cx}" cy="183" rx="30" ry="6" fill="${k.rad("bg", [[0, LEDC, 0.45], [1, LEDC, 0]])}"/>` : "";
      const b = shadow(k, cx, 188, 40) + baseGlow + roundBase(k, cx, 188, 30, 5, c, kd) + `<path d="M${cx - 29} 180A30 7.8 0 0 0 ${cx + 29} 180" fill="none" stroke="${on ? LEDC : "#777b84"}" stroke-width="1.2" opacity="${on ? 0.9 : 0.5}"/>` +
        pole(k, cx, 108, 176, 5.5, c, kd) + `<circle cx="${cx}" cy="140" r="2.6" fill="${mg(k, sh(c, -0.2), kd)}"/><circle cx="${cx}" cy="140" r="1" fill="${fon ? "#7dd3fc" : "#888"}"/>` +
        osc(k, neck(k, cx, 92, 112, 9, c, kd) + at(cx, cy, ringL + head(k, { R, n: 5, bt: "sickle", bw: R * 0.32, bc: mix(c, "#cdd7e6", 0.55), ba: 0.65, body: c, kind: kd, cage: { c: sh(c, 0.12), n: 40, w: 0.6, rings: [0.38, 0.62, 0.84], rimW: 3 } }))) + app + air(k, cx, cy, R + 3);
      return k.svg(b); } });

  icons.push({ id: "minimal", name: "Minimalist", colors: sw([C.white, C.oak, C.black, C.sage, "#e9dcc8"]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 62, R = 42, kd = bk(c, "matte");
      const b = shadow(k, cx, 188, 30) + roundBase(k, cx, 188, 23, 4, c, kd, 2.4) + pole(k, cx, 112, 180, 3.6, c, kd) + `<circle cx="${cx}" cy="152" r="1.4" fill="${k.on ? "#ffb26b" : "#8a8f98"}"/>` +
        osc(k, neck(k, cx, 98, 114, 6, c, kd) + at(cx, cy, head(k, { R, n: 5, bt: "petal", bw: R * 0.28, bc: "#f4f3ef", ba: 0.94, body: c, kind: kd, motor: sh(c === C.black ? "#55585f" : c, -0.2), cage: { c: C.white, n: 20, w: 0.5, rings: [0.6], hub: R * 0.22, rimW: 1.8 } }))) + air(k, cx, cy, R, 2);
      return k.svg(b); } });

  icons.push({ id: "kids", name: "Kids soft blade", colors: sw([C.mint, C.pink, C.sky, C.butter, C.lav]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 62, R = 44;
      const star = (r) => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? "L" : "M") + pt(rr, a); } return `<path d="${d}Z" fill="#fff" fill-opacity=".9"/>`; };
      const b = shadow(k, cx, 188, 44) + roundBase(k, cx, 188, 36, 8, c, "plastic", 8) + pole(k, cx, 112, 172, 10, c) + collar(k, cx, 150, 9, 5, sh(c, 0.4), "plastic") +
        osc(k, neck(k, cx, 96, 116, 14, c, "plastic") + at(cx, cy, head(k, { R, n: 3, bt: "petal", bw: R * 0.42, bc: mix(c, "#ffffff", 0.45), ba: 1, body: c,
          cage: { c: sh(c, 0.35), n: 60, w: 0.45, rings: [0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.93], rimW: 7, rim: c } }) + star(R * 0.12))) + air(k, cx, cy, R + 3);
      return k.svg(b); } });

  icons.push({ id: "swivel", name: "3D swivel", colors: sw([C.black, C.white, C.silver, C.sky]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 42, kd = bk(c, "matte");
      const yoke = `<path d="M${cx - R - 5} ${cy}C${cx - R - 6} ${cy + R + 14} ${cx + R + 6} ${cy + R + 14} ${cx + R + 5} ${cy}" fill="none" stroke="${sh(c, -0.5)}" stroke-width="7.5" stroke-linecap="round" transform="translate(1 1.2)"/>` +
        `<path d="M${cx - R - 5} ${cy}C${cx - R - 6} ${cy + R + 14} ${cx + R + 6} ${cy + R + 14} ${cx + R + 5} ${cy}" fill="none" stroke="${mg(k, c, kd)}" stroke-width="6.5" stroke-linecap="round"/>` +
        `<path d="M${cx - R - 6} ${cy + 8}C${cx - R - 4} ${cy + R + 6} ${cx - 20} ${cy + R + 11} ${cx - 6} ${cy + R + 12}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.4" stroke-linecap="round"/>`;
      const knobs = [cx - R - 5, cx + R + 5].map((x) => `<circle cx="${x}" cy="${cy}" r="5.2" fill="${sph(k, c, "yk")}"/><circle cx="${x}" cy="${cy}" r="2" fill="${sh(c, -0.4)}"/>`).join("");
      const b = shadow(k, cx, 188, 44) + roundBase(k, cx, 188, 36, 6, c, kd, 3) + pole(k, cx, 112, 176, 6, c, kd) + pod(k, cx, 138, c, kd) +
        osc(k, `<circle cx="${cx}" cy="${cy + R + 11}" r="6" fill="${sph(k, c, "ball")}"/>` + yoke + at(cx, cy, head(k, { R, n: 5, bt: "broad", bw: R * 0.36, bc: "#5d6670", ba: 0.85, body: c, kind: kd, motor: "#2b2d33", cage: { c: sh(c, 0.25), n: 36, w: 0.8, rimW: 3.4 } })) + knobs, "osc3") + air(k, cx, cy, R + 6);
      return k.svg(b); } });

  icons.push({ id: "deco", name: "Art deco", colors: sw([C.black, "#2f4f46", C.white, C.wood, "#7a2e2a"]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 44, kd = bk(c, "plastic"), br = C.brass;
      const shell = `<circle cx="3" cy="-2" r="${R + 8}" fill="${sh(c, -0.5)}"/><circle r="${R + 8}" fill="${sph(k, c, "sh")}"/>` +
        [R + 6, R + 3.5].map((r) => `<circle r="${r}" fill="none" stroke="${mg(k, br, "metal")}" stroke-width="1.2"/>`).join("") + `<circle r="${R}" fill="#141418"/>`;
      const b = shadow(k, cx, 188, 44) + roundBase(k, cx, 188, 38, 6, c, kd) + roundBase(k, cx, 177, 26, 5, c, kd) + collar(k, cx, 166, 12, 2.4, br, "metal") +
        pole(k, cx, 112, 168, 7, c, kd) + [124, 128, 132].map((y) => collar(k, cx, y, 4.6, 1.6, br, "metal")).join("") +
        osc(k, neck(k, cx, 96, 116, 10, br, "metal") + at(cx, cy, shell + head(k, { R, n: 4, bt: "broad", bw: R * 0.42, bc: br, ba: 1, bkind: "metal", body: br, kind: "metal", back: false, motor: sh(c, 0.05),
          cage: { style: "deco", c: br, w: 1.1, rings: [], rimW: 2.6 } }))) + air(k, cx, cy, R + 8);
      return k.svg(b); } });

  icons.push({ id: "cordless", name: "Cordless", colors: sw([C.white, C.sky, C.black, C.mint]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 64, R = 40, kd = bk(c), on = k.on;
      let bars = ""; for (let i = 0; i < 4; i++) bars += `<rect x="${cx - 9 + i * 4.8}" y="168" width="3.6" height="5" rx=".8" fill="${on ? GREEN : "#3a3d44"}"${on && i === 3 ? ` class="${P}blink"` : ""}/>`;
      const pack = `<rect x="${cx - 16}" y="160" width="32" height="17" rx="4" fill="${mv(k, sh(c, -0.12), kd)}"/><rect x="${cx - 12}" y="166" width="24" height="9" rx="2" fill="#121317"/>` + bars +
        `<path d="M${cx - 13} 162H${cx + 13}" stroke="#fff" stroke-opacity=".35" stroke-width="1" stroke-linecap="round"/>`;
      const handle = `<path d="M${cx - 16} ${cy - R + 2}C${cx - 16} ${cy - R - 14} ${cx + 16} ${cy - R - 14} ${cx + 16} ${cy - R + 2}" fill="none" stroke="${sh(c, -0.5)}" stroke-width="5.5" transform="translate(.8 1)"/>` +
        `<path d="M${cx - 16} ${cy - R + 2}C${cx - 16} ${cy - R - 14} ${cx + 16} ${cy - R - 14} ${cx + 16} ${cy - R + 2}" fill="none" stroke="${mg(k, c, kd)}" stroke-width="4.6"/>`;
      const b = shadow(k, cx, 188, 40) + roundBase(k, cx, 188, 32, 6, c, kd) + pack + pole(k, cx, 112, 160, 5, c, kd) + pole(k, cx, 140, 160, 7, c, kd) +
        osc(k, handle + neck(k, cx, 98, 114, 9, c, kd) + at(cx, cy, head(k, { R, n: 5, bt: "slim", bw: R * 0.34, bc: mix(c, "#cfe0f2", 0.5), ba: 0.75, body: c, kind: kd, cage: { c: sh(c, 0.12), n: 30, w: 0.7, rimW: 3 } }))) + air(k, cx, cy, R);
      return k.svg(b); } });

  icons.push({ id: "hidden", name: "Hidden blade", colors: sw([C.white, C.black, C.silver, C.pink]), picker: true, colorLabel: "Body",
    render(o) { const k = K(o), c = k.c, cx = 100, cy = 60, R = 46, kd = bk(c), on = k.on, F = R - 6;
      const perf = k.def("perf", `<pattern id="${k.u}-perf" width="3.6" height="3.6" patternUnits="userSpaceOnUse"><circle cx="1.8" cy="1.8" r="1.05" fill="#000" fill-opacity=".55"/></pattern>`);
      const inner = `<circle cx="3.5" cy="-2.6" r="${R}" fill="${sh(c, -0.5)}"/><circle r="${R}" fill="${sph(k, c, "hs")}"/><circle r="${F + 1.2}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/><circle r="${F}" fill="#16171b"/>` +
        rotor(k, { R: F - 2, n: 5, key: "rh", disc: "#8a909a", hub: F * 0.25, bl: blade(k, "slim", F - 3, F * 0.36, "#8a909a", 0.9, "rh") }) +
        `<circle r="${F}" fill="${rgba(c, 0.5)}"/><circle r="${F}" fill="${perf}"/><circle r="${F}" fill="${k.rad("hsg", [[0, "#fff", 0], [0.8, "#fff", 0], [1, "#000", 0.3]])}"/>` +
        `<circle r="${F * 0.3}" fill="${sph(k, c, "hc")}"/>` + (on ? `<circle class="${P}pulse" r="${f(F * 0.3 + 1.6)}" fill="none" stroke="${LEDC}" stroke-width="1.6"/><circle r="${f(F * 0.3 + 1.6)}" fill="none" stroke="${LEDC}" stroke-opacity=".25" stroke-width="5"/>` : `<circle r="${f(F * 0.3 + 1.6)}" fill="none" stroke="#9aa0aa" stroke-opacity=".5" stroke-width="1"/>`) +
        `<path d="M${pt(R - 1, Math.PI * 1.05)}A${R - 1} ${R - 1} 0 0 1 ${pt(R - 1, Math.PI * 1.55)}" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
      const b = shadow(k, cx, 188, 38) + roundBase(k, cx, 188, 30, 5, c, kd, 3) + pole(k, cx, 112, 176, 7, c, kd) + `<rect x="${cx - 3.5}" y="134" width="7" height="14" rx="3.5" fill="#15161a"/><circle cx="${cx}" cy="138" r="1" fill="${on ? LEDC : "#666"}"/><circle cx="${cx}" cy="144" r="1" fill="#666"/>` +
        osc(k, neck(k, cx, 96, 114, 10, c, kd) + at(cx, cy, inner)) + air(k, cx, cy, R);
      return k.svg(b); } });

  (window.HDA = window.HDA || []).push({
    id: "standfan", tab: "Stand fans", group: "Fans", kind: "fan",
    intro: "Stand and pedestal fans. On, the blades spin with a motion blur (faster with the speed slider), the head turns slowly side to side and air drifts out.",
    
    css: `
.hda-standfan-svg{overflow:visible}
.hda-standfan-spin{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-standfan-spin{animation:hda-standfan-rot 1s linear infinite}
@keyframes hda-standfan-rot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.hda-standfan-osc,.hda-standfan-osc3{transform-box:fill-box;transform-origin:50% 80%}
.hda-anim .hda-standfan-osc{animation:hda-standfan-osc 9s ease-in-out infinite}
@keyframes hda-standfan-osc{0%,50%,100%{transform:translateX(0) scaleX(1) skewY(0deg)}25%{transform:translateX(-3px) scaleX(.86) skewY(3deg)}75%{transform:translateX(3px) scaleX(.86) skewY(-3deg)}}
.hda-anim .hda-standfan-osc3{animation:hda-standfan-osc3 11s ease-in-out infinite}
@keyframes hda-standfan-osc3{0%,100%{transform:scale(1,1) skewY(0deg)}20%{transform:translateX(-3px) scale(.86,1) skewY(3deg)}40%{transform:scale(1,.9) skewX(0deg)}60%{transform:translateX(3px) scale(.86,1) skewY(-3deg)}80%{transform:scale(1,.93) translateY(2px)}}
.hda-standfan-airl,.hda-standfan-airr{opacity:.8}
.hda-anim .hda-standfan-airl{animation:hda-standfan-airl 2s ease-out infinite}
.hda-anim .hda-standfan-airr{animation:hda-standfan-airr 2s ease-out infinite}
@keyframes hda-standfan-airl{0%{opacity:0;transform:translateX(2px)}35%{opacity:1}100%{opacity:0;transform:translateX(-12px)}}
@keyframes hda-standfan-airr{0%{opacity:0;transform:translateX(-2px)}35%{opacity:1}100%{opacity:0;transform:translateX(12px)}}
.hda-standfan-mist{transform-box:fill-box;transform-origin:50% 50%;opacity:.6}
.hda-anim .hda-standfan-mist{animation:hda-standfan-mist 2s ease-out infinite}
@keyframes hda-standfan-mist{0%{opacity:0;transform:scale(.3)}30%{opacity:.9}100%{opacity:0;transform:translateY(5px) scale(1.7)}}
.hda-standfan-wave{transform-box:fill-box;transform-origin:50% 50%;opacity:.4}
.hda-anim .hda-standfan-wave{animation:hda-standfan-wave 2.4s ease-out infinite}
@keyframes hda-standfan-wave{0%{opacity:0;transform:scale(.55)}35%{opacity:.8}100%{opacity:0;transform:scale(1.12)}}
.hda-anim .hda-standfan-pulse{animation:hda-standfan-pulse 3s ease-in-out infinite}
@keyframes hda-standfan-pulse{50%{opacity:.5}}
.hda-anim .hda-standfan-blink{animation:hda-standfan-blink 1.6s steps(2,start) infinite}
@keyframes hda-standfan-blink{50%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-standfan-spin,.hda-anim .hda-standfan-osc,.hda-anim .hda-standfan-osc3,.hda-anim .hda-standfan-airl,.hda-anim .hda-standfan-airr,.hda-anim .hda-standfan-mist,.hda-anim .hda-standfan-wave,.hda-anim .hda-standfan-pulse,.hda-anim .hda-standfan-blink{animation:none!important}}
`,
    icons,
  });
})();
