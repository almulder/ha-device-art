(function () {
  const H = window.HDAH, sh = H.shade, rgba = H.rgba, mix = H.mix;
  const P = "hda-ac-";
  const f = (n) => Math.round(n * 100) / 100;
  const ICE = "#9fdcff", CW = "#eef6ff", WARM = "#ff9a4a", DRY = "#8fe3b0", FANG = "#b8c0c8";
  const AIRS = [ICE, CW, WARM, DRY, FANG];
  const sw = (a) => [a].concat(AIRS.filter((c) => c !== a));
  const WH = "#eceef0", OFF = "#e3e1da", GY = "#a7adb4", DG = "#4a4f57", TR = "#f1efe9";

  function modeOf(c) {
    const x = H.hx(c), mx = Math.max(x[0], x[1], x[2]), mn = Math.min(x[0], x[1], x[2]);
    if (x[0] - x[2] > 50 && x[0] >= x[1]) return "heat";
    if (x[1] > x[0] + 25 && x[1] > x[2] + 10) return "dry";
    if (mx - mn < 28 && (x[0] + x[1] + x[2]) / 3 < 215) return "fan";
    return "cool";
  }

  function K(o) {
    const u = o.uid, defs = [], seen = {}; let n = 0;
    const st = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] == null ? "" : ` stop-opacity="${s[2]}"`}/>`).join("");
    const c = o.color || ICE;
    const k = {
      u, o, on: !!o.on, lv: Math.max(0.05, Math.min(1, +o.level || 0)), c, mode: modeOf(c),
      def(nm, s) { if (!seen[nm]) { seen[nm] = 1; defs.push(s); } return `url(#${u}-${nm})`; },
      lin(nm, a, x1 = 0, y1 = 0, x2 = 1, y2 = 0) { return k.def(nm, `<linearGradient id="${u}-${nm}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st(a)}</linearGradient>`); },
      linU(nm, a, x1, y1, x2, y2) { return k.def(nm, `<linearGradient id="${u}-${nm}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st(a)}</linearGradient>`); },
      rad(nm, a, cx = 0.5, cy = 0.5, r = 0.5) { return k.def(nm, `<radialGradient id="${u}-${nm}" cx="${cx}" cy="${cy}" r="${r}">${st(a)}</radialGradient>`); },
      pat(nm, w, h, b) { return k.def(nm, `<pattern id="${u}-${nm}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">${b}</pattern>`); },
      clip(d) { const id = "cp" + n++; defs.push(`<clipPath id="${u}-${id}"><path d="${d}"/></clipPath>`); return ` clip-path="url(#${u}-${id})"`; },
      dur(a, b) { return Math.max(0.25, a - b * k.lv).toFixed(2); },
      svg(body) {
        const tile = rr(6, 6, 188, 188, 16), cp = k.clip(tile);
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="${P}svg" aria-hidden="true"><defs>${defs.join("")}</defs>` +
          `<g${cp}>${body}</g><path class="hda-bg" d="${tile}" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1"/></svg>`;
      },
    };
    return k;
  }

  const rr = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return r <= 0 ? `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z` :
    `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`; };
  const R = (x, y, w, h, r, fill, ex = "") => `<path d="${rr(x, y, w, h, r)}" fill="${fill}"${ex}/>`;
  const pv = (k, c) => k.lin("pv" + c.slice(1), [[0, sh(c, 0.35)], [0.45, c], [1, sh(c, -0.3)]], 0, 0, 0, 1);
  const ph = (k, c) => k.lin("ph" + c.slice(1), [[0, sh(c, -0.3)], [0.25, sh(c, 0.3)], [0.6, c], [1, sh(c, -0.4)]]);
  const metal = (k, c) => k.lin("mt" + c.slice(1), [[0, sh(c, -0.5)], [0.25, sh(c, 0.4)], [0.45, sh(c, 0.7)], [0.62, c], [0.85, sh(c, -0.25)], [1, sh(c, -0.55)]]);
  const edge = (k) => k.lin("edg", [[0, "#000", 0.26], [0.08, "#000", 0], [0.92, "#000", 0], [1, "#000", 0.32]]);
  const vfade = (k) => k.lin("vfd", [[0, "#fff", 0.28], [0.12, "#fff", 0], [0.85, "#000", 0], [1, "#000", 0.22]], 0, 0, 0, 1);
  const hl = (x1, y1, x2, y2, op = 0.5, w = 1.2) => `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
  const line = (d, c = "#000", op = 0.3, w = 1) => `<path d="${d}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
  function shadow(k, cx, cy, rx, ry = 5, a = 0.5) { return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${k.rad("sh", [[0, "#000", 0.65], [1, "#000", 0]])}" opacity="${a}"/>`; }
  function drop(k, x, y, w, h, a = 0.4) { return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${k.lin("dsh", [[0, "#000", 0.55], [1, "#000", 0]], 0, 0, 0, 1)}" opacity="${a}"/>`; }
  function rng(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  function box(k, x, y, w, h, r, c, q = {}) {
    return R(x, y, w, h, r, pv(k, c)) + `<path d="${rr(x, y, w, h, r)}" fill="${edge(k)}"/>` + (q.noFade ? "" : `<path d="${rr(x, y, w, h, r)}" fill="${vfade(k)}"/>`) +
      hl(x + r, y + 1, x + w - r, y + 1, 0.6) + `<path d="${rr(x, y, w, h, r)}" fill="none" stroke="${sh(c, -0.6)}" stroke-opacity=".45" stroke-width=".7"/>`;
  }
  function box3(k, x, y, w, h, dx, dy, c, r = 2) {
    return `<path d="M${x} ${y}L${x + dx} ${y - dy}H${x + w + dx}L${x + w} ${y}Z" fill="${k.lin("tp" + c.slice(1), [[0, sh(c, 0.1)], [0.5, sh(c, 0.45)], [1, sh(c, 0.05)]])}"/>` +
      `<path d="M${x + w} ${y}L${x + w + dx} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="${k.lin("sd" + c.slice(1), [[0, sh(c, -0.22)], [1, sh(c, -0.45)]])}"/>` +
      box(k, x, y, w, h, r, c) + hl(x + w + 0.6, y, x + w + dx, y - dy, 0.4, 0.8);
  }
  function slats(k, x, y, w, h, gap = 3.2, c = WH, q = {}) {
    const p = k.pat("sl" + c.slice(1) + gap, 8, gap, `<rect width="8" height="${gap}" fill="${sh(c, -0.62)}"/><rect y="${f(gap * 0.12)}" width="8" height="${f(gap * 0.5)}" fill="${sh(c, -0.05)}"/><rect y="${f(gap * 0.12)}" width="8" height=".5" fill="#fff" fill-opacity=".5"/>`);
    return R(x - 0.8, y - 0.8, w + 1.6, h + 1.6, q.r || 1.5, sh(c, -0.7)) + R(x, y, w, h, q.r || 1, p) + R(x, y, w, h, q.r || 1, k.lin("slsh", [[0, "#000", 0.35], [0.25, "#000", 0], [1, "#000", 0.15]], 0, 0, 0, 1));
  }
  function vslats(k, x, y, w, h, gap = 3.4, c = WH) {
    const p = k.pat("vs" + c.slice(1) + gap, gap, 8, `<rect width="${gap}" height="8" fill="${sh(c, -0.62)}"/><rect x="${f(gap * 0.15)}" width="${f(gap * 0.5)}" height="8" fill="${sh(c, -0.08)}"/><rect x="${f(gap * 0.15)}" width=".5" height="8" fill="#fff" fill-opacity=".45"/>`);
    return R(x - 0.8, y - 0.8, w + 1.6, h + 1.6, 1.5, sh(c, -0.7)) + R(x, y, w, h, 1, p) + R(x, y, w, h, 1, k.lin("vssh", [[0, "#000", 0.3], [0.3, "#000", 0], [1, "#000", 0.2]], 0, 0, 0, 1));
  }
  function mesh(k, x, y, w, h, c = WH, r = 1.5) {
    const p = k.pat("ms" + c.slice(1), 3, 3, `<rect width="3" height="3" fill="${sh(c, -0.08)}"/><circle cx="1.5" cy="1.5" r=".8" fill="${sh(c, -0.62)}"/>`);
    return R(x, y, w, h, r, p) + R(x, y, w, h, r, "none", ` stroke="${sh(c, -0.4)}" stroke-opacity=".5" stroke-width=".6"`);
  }
  function fins(k, x, y, w, h) {
    const p = k.pat("fin", 2, 6, `<rect width="2" height="6" fill="#59626c"/><rect width=".8" height="6" fill="#aeb8c2"/>`);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${p}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.lin("fsh", [[0, "#000", 0.1], [0.5, "#fff", 0.08], [1, "#000", 0.35]], 0, 0, 0, 1)}"/>`;
  }

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function dispCol(k) { return { heat: "#ffb070", cool: "#8fd8ff", dry: "#9ef0c0", fan: "#e8eef5" }[k.mode]; }
  function temp(k) { return k.mode === "heat" ? 68 + Math.round(6 * k.lv) : k.mode === "cool" ? 76 - Math.round(10 * k.lv) : k.mode === "dry" ? 74 : 75; }
  function digW(h, str) { const w = h * 0.56, t = Math.max(0.6, h * 0.15), g = h * 0.24; let s = 0; for (const ch of String(str)) s += ch === "°" ? t * 3.2 : w + g; return s; }
  function digits(x, y, h, str, col) {
    const w = h * 0.56, t = Math.max(0.6, h * 0.15), g = h * 0.24; let s = "", cx = x;
    for (const ch of String(str)) {
      if (ch === "°") { s += `<circle cx="${f(cx + t * 1.2)}" cy="${f(y + t * 1.1)}" r="${f(t * 0.85)}" fill="none" stroke="${col}" stroke-width="${f(t * 0.6)}"/>`; cx += t * 3.2; continue; }
      const on = SEG[ch] || "", a = t * 0.55, hh = h / 2 - t * 0.8;
      const sg = { a: [cx + a, y, w - 2 * a, t], g: [cx + a, y + h / 2 - t / 2, w - 2 * a, t], d: [cx + a, y + h - t, w - 2 * a, t],
        f: [cx, y + a, t, hh], b: [cx + w - t, y + a, t, hh], e: [cx, y + h / 2 + t * 0.3, t, hh], c: [cx + w - t, y + h / 2 + t * 0.3, t, hh] };
      for (const key in sg) { const r = sg[key], lit = on.indexOf(key) >= 0;
        s += `<rect x="${f(r[0])}" y="${f(r[1])}" width="${f(r[2])}" height="${f(r[3])}" rx="${f(t / 2)}" fill="${lit ? col : "#fff"}" opacity="${lit ? 1 : 0.05}"/>`; }
      cx += w + g;
    }
    return s;
  }
  function glyph(k, x, y, s, col) {
    const m = k.mode;
    if (m === "heat") { let r = `<circle cx="${x}" cy="${y}" r="${f(s * 0.32)}" fill="${col}"/>`; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; r += line(`M${f(x + Math.cos(a) * s * 0.5)} ${f(y + Math.sin(a) * s * 0.5)}L${f(x + Math.cos(a) * s * 0.75)} ${f(y + Math.sin(a) * s * 0.75)}`, col, 1, s * 0.1); } return r; }
    if (m === "dry") return `<path d="M${x} ${f(y - s * 0.7)}C${f(x + s * 0.45)} ${f(y - s * 0.1)} ${f(x + s * 0.5)} ${f(y + s * 0.2)} ${x} ${f(y + s * 0.6)}C${f(x - s * 0.5)} ${f(y + s * 0.2)} ${f(x - s * 0.45)} ${f(y - s * 0.1)} ${x} ${f(y - s * 0.7)}Z" fill="${col}"/>`;
    if (m === "fan") { let r = ""; for (let i = 0; i < 3; i++) r += `<path transform="translate(${x} ${y}) rotate(${i * 120})" d="M0 0C${f(s * 0.2)} ${f(-s * 0.2)} ${f(s * 0.2)} ${f(-s * 0.6)} 0 ${f(-s * 0.7)}C${f(-s * 0.25)} ${f(-s * 0.5)} ${f(-s * 0.15)} ${f(-s * 0.2)} 0 0Z" fill="${col}"/>`; return r + `<circle cx="${x}" cy="${y}" r="${f(s * 0.12)}" fill="${col}"/>`; }
    let r = ""; for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3 + Math.PI / 2, dx = Math.cos(a) * s * 0.7, dy = Math.sin(a) * s * 0.7; r += line(`M${f(x - dx)} ${f(y - dy)}L${f(x + dx)} ${f(y + dy)}`, col, 1, s * 0.13); }
    return r;
  }
  function display(k, x, y, w, h, q = {}) {
    const col = dispCol(k);
    let s = R(x - 0.8, y - 0.8, w + 1.6, h + 1.6, 2, "#9aa0a6", ` opacity=".5"`) + R(x, y, w, h, 1.6, k.lin("dsp", [[0, "#05070b"], [1, "#1a2028"]], 0, 0, 0, 1));
    if (k.on) {
      const str = q.str != null ? q.str : temp(k) + "°", dh = h * (q.dh || 0.6), gw = q.glyph ? dh * 1.2 : 0, tw = digW(dh, str) + gw;
      const x0 = x + (w - tw) / 2 + gw, y0 = y + (h - dh) / 2;
      s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.6" fill="${k.rad("dgl" + col.slice(1), [[0, col, 0.35], [1, col, 0]])}"/>` + digits(x0, y0, dh, str, col);
      if (q.glyph) s += glyph(k, x0 - gw * 0.6, y + h / 2, dh * 0.62, col);
    }
    return s + `<path d="M${f(x + 1)} ${f(y + h - 1)}L${f(x + w * 0.45)} ${f(y + 1)}H${f(x + w * 0.62)}L${f(x + 1 + w * 0.17)} ${f(y + h - 1)}Z" fill="#fff" opacity=".07"/>`;
  }
  function led(k, x, y, col, r = 1.3, q = {}) {
    if (!k.on && !q.always) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#20252b"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.35)}" fill="#fff" opacity=".25"/>`;
    return `<circle cx="${x}" cy="${y}" r="${f(r * 4)}" fill="${k.rad("lh" + col.slice(1), [[0, col, 0.7], [0.4, col, 0.2], [1, col, 0]])}"/><circle class="${P}pulse" cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.4)}" fill="#fff" opacity=".8"/>`;
  }
  function button(k, x, y, r = 2.2, c = WH) { return `<circle cx="${x}" cy="${f(y + 0.6)}" r="${r}" fill="#000" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${k.rad("bt" + c.slice(1), [[0, sh(c, 0.4)], [1, sh(c, -0.25)]], 0.35, 0.3, 0.8)}"/>`; }
  function knob(k, x, y, r, ang) { return `<circle cx="${x}" cy="${f(y + 1)}" r="${f(r + 0.6)}" fill="#000" opacity=".3"/><circle cx="${x}" cy="${y}" r="${r}" fill="${k.rad("kn", [[0, "#f6f7f8"], [0.7, "#c9cdd2"], [1, "#8a9097"]], 0.35, 0.3, 0.8)}"/>` +
    `<path transform="translate(${x} ${y}) rotate(${ang})" d="M-.8 ${f(-r * 0.9)}h1.6v${f(r * 0.6)}h-1.6Z" fill="#3a3f46"/>`; }

  function air(k, x, y, ang, q = {}) {
    if (!k.on) return "";
    const n = q.n || (2 + Math.round(k.lv * 2)), L = q.len || 40, sp = q.sp || 9, cu = q.cu == null ? 5 : q.cu, col = k.c, d = k.dur(q.d0 || 3.6, q.d1 || 2.2), fan = q.fan || 0;
    const g = k.linU("ar" + col.slice(1) + L, [[0, col, 0], [0.22, col, 0.9], [0.7, col, 0.5], [1, col, 0]], 0, 0, L, 0);
    const sc = sh(col, -0.55), gs = k.linU("as" + col.slice(1) + L, [[0, sc, 0], [0.25, sc, 0.22], [0.7, sc, 0.12], [1, sc, 0]], 0, 0, L, 0);
    let s = "";
    for (let i = 0; i < n; i++) {
      const oy = (i - (n - 1) / 2) * sp, s1 = (i % 2 ? 1 : -1) * cu, ey = oy + oy * fan;
      const p = `M0 ${f(oy)}C${f(L * 0.3)} ${f(oy + s1 + (ey - oy) * 0.2)} ${f(L * 0.62)} ${f(oy - s1 + (ey - oy) * 0.6)} ${L} ${f(ey + s1 * 0.4)}`;
      s += `<g class="${P}flow" style="animation-duration:${d}s;animation-delay:-${f((i * 0.37 % 1) * d)}s"><path d="${p}" fill="none" stroke="${gs}" stroke-width="${(q.w || 5) + 2}" stroke-linecap="round" transform="translate(.6 1.2)"/><path d="${p}" fill="none" stroke="${g}" stroke-width="${q.w || 5}" stroke-opacity=".5" stroke-linecap="round"/><path d="${p}" fill="none" stroke="${g}" stroke-width="${q.tw || 1.6}" stroke-linecap="round"/></g>`;
      if (q.mist) for (let j = 0; j < 2; j++) s += `<g opacity=".8"><circle class="${P}flow" style="animation-duration:${d}s;animation-delay:-${f(((i * 0.37 + j * 0.5) % 1) * d)}s" cx="${f(L * (0.35 + j * 0.25))}" cy="${f(oy + s1 * 0.5)}" r=".9" fill="#fff"/></g>`;
    }
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${ang})">${s}</g>`;
  }
  function wash(k, cx, cy, rx, ry, a = 0.45) { if (!k.on) return ""; return `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${k.rad("ws" + k.c.slice(1), [[0, k.c, a], [1, k.c, 0]])}"/>`; }
  function shimmer(k, x, y, w, n = 3) {
    if (!k.on) return ""; let s = "";
    for (let i = 0; i < n; i++) { const xx = x + (w * (i + 0.5)) / n;
      s += `<path class="${P}rise" style="animation-delay:-${f(i * 0.9)}s;animation-duration:${k.dur(3.4, 1.4)}s" d="M${f(xx)} ${y}c-3 -5 3 -9 0 -14s3 -9 0 -14" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/>`; }
    return s;
  }

  function flap(k, x, y, w, q = {}) {
    const c = q.c || WH, h = (q.h || 7) * (0.6 + 0.4 * k.lv);
    if (!k.on) return `<path d="M${x + 2} ${y}H${x + w - 2}" stroke="#000" stroke-opacity=".35" stroke-width=".9"/>` + hl(x + 3, y + 1, x + w - 3, y + 1, 0.5, 0.7);
    return R(x, y - 1.6, w, 4, 2, "#0b0e12") + `<g class="${P}swing" style="animation-duration:${q.sd || 6}s"><path d="M${x + 1} ${y + 1.6}H${x + w - 1}L${f(x + w - 4)} ${f(y + 1.6 + h)}H${f(x + 4)}Z" fill="${k.lin("flp" + c.slice(1), [[0, sh(c, -0.35)], [1, sh(c, 0.25)]], 0, 0, 0, 1)}"/>` +
      hl(x + 5, y + 1.6 + h, x + w - 5, y + 1.6 + h, 0.6, 0.8) + `</g>`;
  }

  function rotor(k, cx, cy, r, q = {}) {
    const n = q.n || 3, bc = q.col || "#3a3f46";
    const bg = k.rad("bl" + bc.slice(1), [[0, sh(bc, 0.45)], [1, sh(bc, -0.35)]], 0.25, 0.3, 0.9);
    let b = `<circle r="${r}" fill="#000" opacity="0"/>`;
    for (let i = 0; i < n; i++) b += `<path transform="rotate(${f(i * 360 / n)})" d="M0 0C${f(r * 0.25)} ${f(-r * 0.38)} ${f(r * 0.72)} ${f(-r * 0.56)} ${f(r * 0.95)} ${f(-r * 0.16)}C${f(r * 0.92)} ${f(r * 0.18)} ${f(r * 0.5)} ${f(r * 0.24)} 0 0Z" fill="${bg}"/>`;
    b += `<circle r="${f(r * 0.2)}" fill="${k.rad("hub", [[0, "#cfd4d9"], [1, "#3c4148"]], 0.35, 0.3, 0.8)}"/>`;
    const sp = k.on ? ` class="${P}spin" style="animation-duration:${k.dur(1.15, 0.9)}s"` : "";
    const blur = k.on ? `<circle r="${f(r * 0.96)}" fill="${k.rad("blr", [[0, "#9aa3ad", 0], [0.55, "#9aa3ad", 0.12], [0.9, "#c9d0d7", 0.22], [1, "#9aa3ad", 0]])}"/>` : "";
    return `<g transform="translate(${f(cx)} ${f(cy)})${q.sy ? ` scale(1 ${q.sy})` : ""}"><circle r="${f(r * 1.02)}" fill="#0c0f13"/><g${sp}>${b}</g>${blur}</g>`;
  }
  function guard(cx, cy, r, q = {}) {
    const c = q.c || "#1d2126", sy = q.sy || 1; let s = "";
    for (let i = 1; i <= (q.rings || 5); i++) { const rr2 = (r * i) / (q.rings || 5); s += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rr2)}" ry="${f(rr2 * sy)}" fill="none" stroke="${c}" stroke-width="${i === (q.rings || 5) ? 1.6 : 0.9}"/>`; }
    for (let i = 0; i < (q.spokes || 8); i++) { const a = (i * Math.PI * 2) / (q.spokes || 8); s += `<path d="M${f(cx + Math.cos(a) * r * 0.2)} ${f(cy + Math.sin(a) * r * 0.2 * sy)}L${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r * sy)}" stroke="${c}" stroke-width=".8"/>`; }
    return s + `<ellipse cx="${f(cx - r * 0.25)}" cy="${f(cy - r * 0.35 * sy)}" rx="${f(r * 0.45)}" ry="${f(r * 0.18 * sy)}" fill="#fff" opacity=".06"/>`;
  }

  function wall(k, c, q = {}) {
    return `<rect x="0" y="0" width="200" height="200" fill="${k.rad("wl" + c.slice(1), [[0, sh(c, 0.12)], [0.7, c], [1, sh(c, -0.35)]], q.cx || 0.5, q.cy || 0.38, 0.8)}"/>` +
      `<rect x="0" y="0" width="200" height="200" fill="${k.pat("wtx", 6, 6, `<circle cx="1" cy="2" r=".5" fill="#000" fill-opacity=".04"/><circle cx="4" cy="5" r=".5" fill="#fff" fill-opacity=".05"/>`)}"/>`;
  }
  function floor(k, y, kind = "wood") {
    if (kind === "tile") return `<rect x="0" y="${y}" width="200" height="${200 - y}" fill="${k.pat("tile", 22, 22, `<rect width="22" height="22" fill="#c9c3b8"/><rect width="22" height="1" fill="#9d978c"/><rect width="1" height="22" fill="#9d978c"/>`)}"/>` + drop(k, 0, y, 200, 14, 0.35);
    if (kind === "carpet") return `<rect x="0" y="${y}" width="200" height="${200 - y}" fill="${k.lin("crp", [[0, "#6b6f7e"], [1, "#4b4f5d"]], 0, 0, 0, 1)}"/><rect x="0" y="${y}" width="200" height="${200 - y}" fill="${k.pat("crt", 3, 3, `<circle cx="1" cy="1" r=".6" fill="#fff" fill-opacity=".06"/>`)}"/>` + drop(k, 0, y, 200, 10, 0.35);
    return `<rect x="0" y="${y}" width="200" height="${200 - y}" fill="${k.lin("wd", [[0, "#a77b52"], [1, "#6e4a2e"]], 0, 0, 0, 1)}"/>` +
      `<rect x="0" y="${y}" width="200" height="${200 - y}" fill="${k.pat("wdp", 60, 9, `<rect width="60" height=".7" fill="#3c2414" fill-opacity=".5"/><rect x="38" width=".7" height="9" fill="#3c2414" fill-opacity=".4"/><path d="M0 4C15 3 30 5 60 4" stroke="#3c2414" stroke-opacity=".2" stroke-width=".5" fill="none"/>`)}"/>` +
      `<rect x="0" y="${y}" width="200" height="1" fill="#fff" fill-opacity=".15"/>` + drop(k, 0, y, 200, 12, 0.3);
  }
  function baseboard(k, y, c = TR) { return `<rect x="0" y="${y - 7}" width="200" height="7" fill="${pv(k, c)}"/>` + hl(0, y - 6.5, 200, y - 6.5, 0.5, 0.8) + `<rect x="0" y="${y - 1}" width="200" height="1" fill="#000" opacity=".25"/>`; }
  function cloud(x, y, s, col, op) {
    return `<g fill="${col}" opacity="${op}"><ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(13 * s)}" ry="${f(4.5 * s)}"/><ellipse cx="${f(x - 5 * s)}" cy="${f(y - 3 * s)}" rx="${f(6 * s)}" ry="${f(5 * s)}"/><ellipse cx="${f(x + 4 * s)}" cy="${f(y - 4.5 * s)}" rx="${f(7.5 * s)}" ry="${f(6.2 * s)}"/></g>`;
  }
  const SKY = { day: ["#3d8bd8", "#8ac2ee", "#d6edfb"], hot: ["#2f7fd6", "#7cc0f2", "#ffe9b8"], dusk: ["#232c66", "#6b4f98", "#f0957a"], night: ["#05081a", "#121a40", "#2a3466"], snow: ["#8a9bb2", "#b8c6d6", "#e4ebf2"] };
  function sky(k, kind, x, y, w, h, q = {}) {
    const s = SKY[kind], r = rng(q.seed || 5), X = (t) => f(x + w * t), Y = (t) => f(y + h * t), m = Math.min(w, h), hz = q.hz || 0.78;
    let b = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${k.lin("sky" + kind, [[0, s[0]], [0.62, s[1]], [1, s[2]]], 0, 0, 0, 1)}"/>`;
    const glow = (cx, cy, rad, col, a) => `<circle cx="${cx}" cy="${cy}" r="${f(rad)}" fill="${k.rad("sg" + col.slice(1), [[0, col, a], [0.4, col, a * 0.35], [1, col, 0]])}"/>`;
    if (kind === "day" || kind === "hot") b += glow(X(q.sx || 0.78), Y(0.24), m * (kind === "hot" ? 0.8 : 0.5), "#fff4c4", 0.85) + `<circle cx="${X(q.sx || 0.78)}" cy="${Y(0.24)}" r="${f(m * 0.08)}" fill="#fffbe8"/>` + cloud(x + w * 0.3, y + h * 0.3, m / 60, "#fff", 0.85) + (kind === "day" ? cloud(x + w * 0.6, y + h * 0.5, m / 90, "#fff", 0.7) : "");
    if (kind === "dusk") b += glow(X(0.4), Y(hz), m * 0.8, "#ffb38a", 0.6);
    if (kind === "night" || kind === "dusk") for (let i = 0; i < 12; i++) b += `<circle cx="${X(r())}" cy="${f(y + h * r() * hz * 0.8)}" r="${f(0.4 + r() * 0.6)}" fill="#fff" opacity="${f(0.4 + r() * 0.5)}"/>`;
    if (kind === "night") { const mx = X(0.75), my = Y(0.22), mr = m * 0.08; b += glow(mx, my, mr * 5, "#dfe6ff", 0.4) + `<circle cx="${mx}" cy="${my}" r="${f(mr)}" fill="#f4f1de"/><circle cx="${f(+mx + mr * 0.5)}" cy="${f(+my - mr * 0.25)}" r="${f(mr * 0.88)}" fill="${s[0]}" opacity=".93"/>`; }
    if (kind === "snow") b += cloud(x + w * 0.3, y + h * 0.2, m / 40, "#eef2f6", 0.7) + cloud(x + w * 0.75, y + h * 0.28, m / 50, "#dde4ec", 0.6);
    if (q.city) { let cx = x - 2; const by = y + h * (hz + 0.08);
      while (cx < x + w) { const bw = 6 + r() * 10, bh = h * (0.14 + r() * 0.26);
        b += `<rect x="${f(cx)}" y="${f(by - bh)}" width="${f(bw)}" height="${f(bh + 40)}" fill="${kind === "night" ? "#0d1130" : "#2a2148"}"/>`;
        for (let wy = by - bh + 3; wy < by - 2; wy += 4) for (let wx = cx + 1.5; wx < cx + bw - 2; wx += 3) if (r() < 0.3) b += `<rect x="${f(wx)}" y="${f(wy)}" width="1.2" height="1.6" fill="#ffd27a" opacity="${f(0.5 + r() * 0.5)}"/>`;
        cx += bw + 1; } }
    else if (!q.noHills) {
      const hc = kind === "snow" ? ["#f4f7fa", "#c9d3dd"] : kind === "night" ? ["#141a33", "#080b1a"] : kind === "dusk" ? ["#3a2f5c", "#1d1734"] : ["#6fae62", "#3f7a46"];
      b += `<path d="M${x} ${Y(hz)}C${X(0.25)} ${Y(hz - 0.1)} ${X(0.45)} ${Y(hz + 0.03)} ${X(0.65)} ${Y(hz - 0.04)}S${X(0.9)} ${Y(hz - 0.08)} ${x + w} ${Y(hz - 0.02)}V${y + h}H${x}Z" fill="${k.lin("hl" + kind, [[0, hc[0]], [1, hc[1]]], 0, 0, 0, 1)}"/>`;
      if (q.trees) for (let i = 0; i < 4; i++) { const tx = x + w * (0.08 + r() * 0.85), ty = y + h * (hz - 0.01), ts = m * (0.06 + r() * 0.05);
        b += `<path d="M${f(tx)} ${f(ty - ts * 2.4)}L${f(tx + ts * 0.7)} ${f(ty)}H${f(tx - ts * 0.7)}Z" fill="${kind === "snow" ? "#5d7466" : sh(hc[1], -0.2)}"/>` + (kind === "snow" ? `<path d="M${f(tx)} ${f(ty - ts * 2.4)}L${f(tx + ts * 0.35)} ${f(ty - ts * 1.3)}H${f(tx - ts * 0.35)}Z" fill="#fff" opacity=".85"/>` : ""); }
    }
    if (kind === "snow") for (let i = 0; i < 16; i++) b += `<circle cx="${X(r())}" cy="${f(y + h * r())}" r="${f(0.6 + r() * 0.8)}" fill="#fff" opacity="${f(0.6 + r() * 0.4)}"/>`;
    b += `<path d="M${x} ${f(y + h * 0.65)}L${f(x + w * 0.5)} ${y}H${f(x + w * 0.64)}L${x} ${f(y + h)}Z" fill="#fff" opacity=".07"/>` +
      `<rect x="${x}" y="${y}" width="${w}" height="4" fill="${k.lin("ish", [[0, "#000", 0.45], [1, "#000", 0]], 0, 0, 0, 1)}"/>`;
    return `<g${k.clip(rr(x, y, w, h, q.r || 0))}>${b}</g>`;
  }
  function frame(k, x, y, w, h, t, c = TR) {
    return `<path d="${rr(x - 2, y - 2, w + 4, h + 4, 3)}" fill="#000" opacity=".28"/>` + R(x, y, w, h, 1.5, pv(k, c)) + `<path d="${rr(x, y, w, h, 1.5)}" fill="${edge(k)}"/>` +
      hl(x + 2, y + 1, x + w - 2, y + 1, 0.55) + R(x + t - 1.2, y + t - 1.2, w - 2 * t + 2.4, h - 2 * t + 2.4, 1, sh(c, -0.55));
  }
  function rail(k, x, y, w, h, c = TR) { return R(x, y, w, h, 0.6, pv(k, c)) + hl(x + 1, y + 0.8, x + w - 1, y + 0.8, 0.55, 0.9) + `<path d="M${x} ${f(y + h)}h${w}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`; }
  function sill(k, x, y, w, c = TR) {
    return drop(k, x + 3, y + 8, w - 6, 9, 0.5) + `<path d="M${f(x + 3)} ${y}H${f(x + w - 3)}L${x + w} ${y + 3}H${x}Z" fill="${sh(c, 0.25)}"/>` + R(x, y + 3, w, 5.5, 1, pv(k, sh(c, -0.08))) + hl(x + 1, y + 3.6, x + w - 1, y + 3.6, 0.45, 0.8);
  }
  function siding(k, c, y0 = 0, y1 = 200, x0 = 0, x1 = 200) {
    return `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="${k.pat("sd" + c.slice(1), 40, 11, `<rect width="40" height="11" fill="${c}"/><rect width="40" height="5" fill="${sh(c, 0.08)}"/><rect y="9.6" width="40" height="1.4" fill="${sh(c, -0.4)}"/><rect y="0" width="40" height=".6" fill="#fff" fill-opacity=".3"/>`)}"/>`;
  }
  function brick(k, x0, y0, w, h) {
    return `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${k.pat("brk", 24, 12, `<rect width="24" height="12" fill="#8a8178"/><rect x=".6" y=".6" width="22.8" height="4.8" fill="#9b4f3a"/><rect x="-11.4" y="6.6" width="22.8" height="4.8" fill="#8d4634"/><rect x="12.6" y="6.6" width="22.8" height="4.8" fill="#a5583f"/><rect x=".6" y=".6" width="22.8" height="1" fill="#fff" fill-opacity=".12"/>`)}"/>`;
  }
  function grass(k, y, seed = 3) {
    const r = rng(seed); let s = `<rect x="0" y="${y}" width="200" height="${200 - y}" fill="${k.lin("grs", [[0, "#5f9e52"], [1, "#2f6234"]], 0, 0, 0, 1)}"/>`;
    for (let i = 0; i < 46; i++) { const gx = r() * 200, gy = y + 2 + r() * (196 - y), gh = 3 + r() * 5; s += `<path d="M${f(gx)} ${f(gy)}q1 ${f(-gh * 0.6)} ${f(r() * 3 - 1)} ${f(-gh)}" stroke="${mix("#8fd07a", "#3d7a3e", r())}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`; }
    return s;
  }
  function plant(k, x, y, s = 1) {
    let lv = ""; [[-14, -26, -0.4], [12, -30, 0.3], [-4, -36, -0.1], [18, -18, 0.7], [-20, -12, -0.8]].forEach(([dx, dy, t], i) => {
      lv += `<path d="M${x} ${y}Q${f(x + dx * s * 0.3)} ${f(y + dy * s * 0.7)} ${f(x + dx * s)} ${f(y + dy * s)}Q${f(x + dx * s * 0.5 + 5 * s * t)} ${f(y + dy * s * 0.4)} ${x} ${y}Z" fill="${i % 2 ? "#3f8a4c" : "#5aa85a"}"/>`; });
    return lv + `<path d="M${f(x - 9 * s)} ${f(y - 1)}H${f(x + 9 * s)}L${f(x + 7 * s)} ${f(y + 14 * s)}H${f(x - 7 * s)}Z" fill="${k.lin("pot", [[0, "#8a4a2e"], [0.35, "#d48a5e"], [1, "#7a3e24"]])}"/>` + shadow(k, x, y + 14 * s, 10 * s, 2.5, 0.6);
  }
  function pipe(d, w = 4, c = "#e9ebed") { return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="${w + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${f(w * 0.25)}" stroke-linecap="round" transform="translate(-.6 -.8)"/>`; }
  function hose(k, d, w = 11, c = "#dfe2e5") {
    return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sh(c, -0.2)}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<path d="${d}" fill="none" stroke="${sh(c, 0.15)}" stroke-width="${w - 2}" stroke-dasharray="2.2 1.6"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${f(w * 0.2)}" transform="translate(-1 -1.6)"/>`;
  }

  const BG = (x) => `<g class="hda-bg">${x}</g>`, bgw = (fn) => (...a) => BG(fn(...a));
  wall = bgw(wall); floor = bgw(floor); baseboard = bgw(baseboard); sky = bgw(sky); siding = bgw(siding); brick = bgw(brick); grass = bgw(grass); plant = bgw(plant); cloud = bgw(cloud);
  const icons = [];

  icons.push({ id: "window", name: "Window unit", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = WH;
      const pl = k.pat("pleat", 5, 10, `<rect width="2.5" height="10" fill="#f2f1ec"/><rect x="2.5" width="2.5" height="10" fill="#bdbbb3"/><rect x="2.2" width=".6" height="10" fill="#fff"/>`);
      let b = wall(k, "#cdbfae") + frame(k, 30, 12, 140, 152, 8) + sky(k, "day", 38, 20, 124, 70, { seed: 4, trees: 1 }) +
        rail(k, 38, 86, 124, 6) + rail(k, 38, 92, 124, 8) + drop(k, 38, 100, 124, 6, 0.35);
      b += `<rect x="38" y="102" width="20" height="54" fill="${pl}"/><rect x="142" y="102" width="20" height="54" fill="${pl}"/>` + rail(k, 38, 100, 20, 3) + rail(k, 142, 100, 20, 3);
      b += box3(k, 56, 104, 88, 54, 0, 0, B, 3) + slats(k, 62, 110, 56, 42, 3.4, B) + R(122, 110, 17, 42, 2, pv(k, sh(B, -0.06))) + display(k, 124, 113, 13, 9) +
        button(k, 127, 129) + button(k, 134, 129) + button(k, 127, 137) + button(k, 134, 137) + led(k, 130.5, 146, "#34d399", 1.1);
      b += sill(k, 24, 160, 152) + wash(k, 90, 150, 40, 12) + air(k, 90, 153, 90, { len: 34, sp: 11, cu: 4, fan: 0.6 }) + air(k, 66, 132, 160, { n: 2, len: 26, sp: 10 });
      return k.svg(b); } });

  icons.push({ id: "ushape", name: "U-shaped", colors: sw(CW), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f4f5f6";
      let b = wall(k, "#b9c4c9") + frame(k, 34, 10, 132, 138, 8) + sky(k, "dusk", 42, 18, 116, 58, { seed: 9, city: 1, hz: 0.8 }) + rail(k, 42, 74, 116, 6) + rail(k, 42, 80, 116, 6);
      b += sky(k, "dusk", 42, 86, 116, 34, { seed: 2, city: 1, hz: 0.1 }) + `<path d="${rr(64, 98, 72, 30, 4)}" fill="#3a3f48" opacity=".85"/>` + vslats(k, 70, 104, 60, 18, 3, "#7d848c") + `<rect x="42" y="86" width="116" height="34" fill="#cfe3f2" opacity=".12"/>`;
      b += rail(k, 42, 118, 116, 8) + sill(k, 28, 144, 144);
      b += shadow(k, 100, 186, 52, 4, 0.5) + box(k, 52, 122, 96, 60, 14, B) + R(60, 128, 80, 6, 3, "#0b0e12", ` opacity="${k.on ? 0.9 : 0.25}"`) + `<path d="${rr(52, 122, 96, 22, 11)}" fill="#fff" opacity=".12"/>` +
        mesh(k, 62, 152, 76, 22, B, 4) + display(k, 86, 139, 28, 10, { glyph: 1 }) + led(k, 140, 140, "#7dd3fc", 1);
      b += wash(k, 100, 126, 46, 10) + air(k, 100, 126, -90, { len: 30, sp: 14, cu: 5, fan: 0.5, n: 3 + Math.round(k.lv * 2) });
      return k.svg(b); } });

  icons.push({ id: "saddle", name: "Saddle unit", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = WH;
      let b = wall(k, "#d4c8b8", { cx: 0.25 }) + sky(k, "hot", 108, 0, 92, 200, { seed: 7, hz: 0.72, sx: 0.6 });
      b += siding(k, "#c7ccd2", 0, 200, 100, 112) + `<rect x="88" y="0" width="12" height="200" fill="${ph(k, "#e6e0d6")}"/>` + `<rect x="98" y="0" width="16" height="200" fill="#000" opacity=".1"/>`;
      b += `<rect x="96" y="14" width="10" height="72" fill="${pv(k, TR)}"/><rect x="99" y="20" width="4" height="60" fill="#bfe0f5" opacity=".7"/>` + hl(100, 22, 100, 76, 0.7, 0.8) + `<rect x="94" y="84" width="14" height="6" fill="${pv(k, TR)}"/>`;
      b += `<path d="M84 102H120L124 108H80Z" fill="${pv(k, TR)}"/>` + R(80, 108, 44, 6, 1, pv(k, sh(TR, -0.1)));
      b += box(k, 84, 90, 36, 12, 3, sh(B, -0.05)) + pipe("M90 96H114", 2.4, "#c98d58") + pipe("M90 99H114", 2, "#d9dde1");
      b += shadow(k, 58, 168, 36, 4, 0.45) + box3(k, 26, 112, 60, 52, 0, 0, B, 4) + R(32, 118, 48, 4, 2, "#0b0e12", ` opacity="${k.on ? 0.85 : 0.2}"`) + slats(k, 32, 126, 34, 30, 3.2, B);
      b += R(69, 126, 13, 30, 2, pv(k, sh(B, -0.08))) + display(k, 70, 128, 11, 7, { str: temp(k) + "", dh: 0.62 }) + button(k, 75.5, 141, 1.8) + button(k, 75.5, 148, 1.8) + led(k, 34, 160, "#34d399", 1);
      b += box(k, 118, 106, 60, 54, 3, "#b9bfc6") + fins(k, 124, 112, 48, 42) + `<path d="M118 160H178V164H118Z" fill="#000" opacity=".25"/>` + rotor(k, 148, 133, 17, { n: 4 }) + guard(148, 133, 18, { rings: 4, c: "#2b3036" });
      b += air(k, 56, 120, 155, { len: 30, sp: 9, n: 2 + Math.round(k.lv * 2) }) + wash(k, 40, 122, 26, 10) + shimmer(k, 130, 104, 36);
      return k.svg(b); } });

  icons.push({ id: "portable", name: "Portable", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f3f4f5";
      let b = wall(k, "#c9d0c3", { cx: 0.35 }) + baseboard(k, 158) + floor(k, 158);
      b += frame(k, 124, 18, 66, 128, 6) + sky(k, "day", 130, 24, 54, 116, { seed: 12, hz: 0.8, sx: 0.4 }) + rail(k, 130, 78, 54, 4);
      b += `<rect x="130" y="104" width="54" height="20" fill="${pv(k, "#dcdedf")}"/><rect x="130" y="104" width="54" height="20" fill="${edge(k)}"/>` + `<circle cx="157" cy="114" r="7" fill="#9aa0a6"/><circle cx="157" cy="114" r="5" fill="#33383f"/>` + sill(k, 120, 142, 74);
      b += hose(k, "M96 74C122 66 152 76 157 106", 12);
      b += shadow(k, 66, 166, 36, 5, 0.6) + box(k, 36, 32, 62, 128, 12, B) + `<path d="${rr(36, 32, 62, 30, 12)}" fill="#fff" opacity=".18"/>`;
      b += R(42, 40, 50, 5, 2, "#0b0e12", ` opacity="${k.on ? 0.9 : 0.3}"`) + flap(k, 42, 44, 50, { c: B, h: 6 }) + R(50, 58, 34, 10, 3, pv(k, sh(B, -0.08))) + display(k, 55, 59.5, 24, 7, { glyph: 1 });
      b += mesh(k, 44, 80, 46, 56, B, 6) + `<rect x="62" y="146" width="10" height="4" rx="1" fill="#2c3036"/>` + led(k, 88, 63, "#7dd3fc", 0.9);
      b += `<ellipse cx="46" cy="161" rx="5" ry="3" fill="#2b2f35"/><ellipse cx="88" cy="161" rx="5" ry="3" fill="#2b2f35"/>`;
      b += wash(k, 67, 40, 32, 9) + air(k, 67, 38, -100, { len: 34, sp: 13, cu: 6, fan: 0.5, n: 3 + Math.round(k.lv) }) + shimmer(k, 178, 98, 10, 1);
      return k.svg(b); } });

  icons.push({ id: "dualhose", name: "Dual-hose", colors: sw(CW), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#b9bfc6";
      let b = wall(k, "#d6cdbf", { cx: 0.6 }) + baseboard(k, 162) + floor(k, 162, "tile");
      b += frame(k, 8, 14, 56, 136, 6, "#3c3f44") + sky(k, "night", 14, 20, 44, 124, { seed: 3, hz: 0.75, city: 1 }) + `<rect x="14" y="86" width="44" height="40" fill="${pv(k, "#2e3237")}"/>` + `<circle cx="26" cy="106" r="7" fill="#15181c"/><circle cx="46" cy="106" r="7" fill="#15181c"/><circle cx="26" cy="106" r="7" fill="none" stroke="#5b6168" stroke-width="2"/><circle cx="46" cy="106" r="7" fill="none" stroke="#5b6168" stroke-width="2"/>`;
      b += hose(k, "M112 70C96 50 52 66 46 104", 11, "#cfd3d7") + hose(k, "M120 78C110 92 40 80 26 104", 11, "#cfd3d7") + R(42, 100, 8, 4, 1, "#3f84d8") + R(22, 100, 8, 4, 1, "#e0653f");
      b += shadow(k, 128, 170, 46, 5, 0.6) + box3(k, 90, 54, 76, 108, 10, 8, B, 6);
      b += R(96, 60, 64, 22, 3, pv(k, sh(B, 0.25))) + vslats(k, 99, 63, 58, 16, 3.6, sh(B, 0.2)) + `<g class="${k.on ? P + "vane" : ""}">${k.on ? `<rect x="99" y="63" width="58" height="16" fill="#0b0e12" opacity=".2"/>` : ""}</g>`;
      b += R(104, 88, 48, 12, 3, k.lin("blk", [[0, "#2b2f35"], [1, "#16191d"]], 0, 0, 0, 1)) + display(k, 108, 90, 26, 8, { glyph: 1 }) + led(k, 140, 94, "#34d399", 1) + led(k, 146, 94, "#7dd3fc", 1);
      b += slats(k, 100, 108, 56, 46, 3.6, B) + `<ellipse cx="98" cy="164" rx="5" ry="3" fill="#25292e"/><ellipse cx="160" cy="164" rx="5" ry="3" fill="#25292e"/>`;
      b += wash(k, 128, 72, 40, 12) + air(k, 128, 72, -80, { len: 34, sp: 14, cu: 5, fan: 0.5, n: 3 + Math.round(k.lv) });
      return k.svg(b); } });

  icons.push({ id: "minisplit", name: "Mini-split", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f6f7f8";
      let b = wall(k, "#c8c3d6", { cy: 0.2 }) + `<g class="hda-bg"><rect x="0" y="0" width="200" height="16" fill="${pv(k, "#e9e6f0")}"/><rect x="0" y="16" width="200" height="2" fill="#000" opacity=".15"/></g>`;
      b += BG(`<rect x="20" y="118" width="54" height="66" fill="#000" opacity=".25"/>` + R(18, 116, 54, 66, 1, pv(k, "#c9a46e")) + sky(k, "dusk", 24, 122, 42, 54, { seed: 15, hz: 0.7 }));
      b += plant(k, 160, 168, 1.15);
      b += `<path d="M28 74C30 84 170 84 172 74" fill="#000" opacity=".2"/>` + `<path d="M24 46C24 38 30 34 40 34H160C170 34 176 38 176 46V66C176 76 170 82 160 82H40C30 82 24 76 24 66Z" fill="${pv(k, B)}"/>` +
        `<path d="M24 46C24 38 30 34 40 34H160C170 34 176 38 176 46V66C176 76 170 82 160 82H40C30 82 24 76 24 66Z" fill="${edge(k)}"/>` + hl(40, 35.5, 160, 35.5, 0.8, 1.2) + `<path d="M28 44C28 40 34 38 42 38H158" stroke="#fff" stroke-opacity=".6" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      b += `<path d="M24 66H176" stroke="#000" stroke-opacity=".12" stroke-width=".8"/>` + display(k, 132, 50, 24, 10, { glyph: 1 }) + led(k, 124, 55, "#34d399", 0.9) + R(30, 38, 140, 3, 1.5, k.pat("top", 3, 3, `<rect width="2" height="3" fill="#000" fill-opacity=".14"/>`));
      if (k.on) b += R(34, 76, 132, 5, 2, "#0b0e12") + `<g class="${P}swing" style="animation-duration:7s"><path d="M34 80H166L162 ${f(90 + 4 * k.lv)}H38Z" fill="${k.lin("flp2", [[0, "#c3c7cc"], [1, "#fdfdfe"]], 0, 0, 0, 1)}"/>` + hl(40, f(89 + 4 * k.lv), 160, f(89 + 4 * k.lv), 0.7, 0.8) + `</g>`;
      else b += `<path d="M36 79H164" stroke="#000" stroke-opacity=".3" stroke-width=".9"/>`;
      b += wash(k, 100, 90, 70, 12) + air(k, 100, 92, 100, { len: 54, sp: 22, cu: 6, fan: 0.4, n: 3 + Math.round(k.lv * 2), w: 6 });
      return k.svg(b); } });

  icons.push({ id: "condenser", name: "Split outdoor", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#e4e6e2";
      let b = siding(k, "#9fb3a6") + `<rect x="0" y="176" width="200" height="24" fill="${k.lin("gr2", [[0, "#7c7468"], [1, "#4f483f"]], 0, 0, 0, 1)}"/>`;
      b += pipe("M168 96C182 96 184 84 184 70V20", 6, "#f2f3f4") + pipe("M168 104C186 104 190 92 190 76V20", 4, "#f2f3f4") + R(178, 14, 16, 10, 2, pv(k, "#e8e9e6"));
      b += `<path d="M34 150L40 172H48L44 150Z M150 150L154 172H162L158 150Z" fill="${metal(k, "#8a9097")}"/>` + R(26, 148, 148, 5, 1, metal(k, "#9aa0a6"));
      b += drop(k, 26, 152, 148, 22, 0.4) + box3(k, 22, 60, 146, 88, 0, 0, B, 4);
      b += rotor(k, 74, 104, 34, { n: 3 }) + guard(74, 104, 36, { rings: 6, spokes: 10 }) + `<circle cx="74" cy="104" r="38" fill="none" stroke="${sh(B, -0.3)}" stroke-width="2"/>`;
      b += slats(k, 122, 68, 38, 50, 3.4, B) + R(124, 124, 34, 18, 2, pv(k, sh(B, -0.06))) + `<circle cx="134" cy="133" r="3" fill="${metal(k, "#b88a3c")}"/><circle cx="148" cy="133" r="3" fill="${metal(k, "#b88a3c")}"/>`;
      b += fins(k, 22, 62, 4, 84) + air(k, 74, 104, 90, { n: 2, len: 20, sp: 24 }) + shimmer(k, 50, 58, 50, 3);
      if (k.on) b += `<circle class="${P}drip" cx="150" cy="156" r="1.4" fill="#bfe3ff" style="animation-duration:2.4s"/>`;
      return k.svg(b); } });

  icons.push({ id: "cassette", name: "Ceiling cassette", colors: sw(CW), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f7f8f9";
      let b = `<rect x="0" y="0" width="200" height="200" fill="${k.pat("ctile", 50, 50, `<rect width="50" height="50" fill="#d9d6cf"/><rect width="50" height="2" fill="#f2f1ec"/><rect width="2" height="50" fill="#f2f1ec"/><rect y="2" width="50" height="1" fill="#000" fill-opacity=".12"/><circle cx="14" cy="20" r=".7" fill="#000" fill-opacity=".1"/><circle cx="34" cy="36" r=".7" fill="#000" fill-opacity=".1"/><circle cx="30" cy="12" r=".6" fill="#000" fill-opacity=".08"/>`)}"/>` +
        `<rect x="0" y="0" width="200" height="200" fill="${k.rad("cv", [[0, "#fff", 0.1], [1, "#000", 0.35]], 0.5, 0.5, 0.75)}"/>`;
      b += R(30, 32, 142, 142, 6, "#000", ` opacity=".25"`) + box(k, 28, 28, 144, 144, 6, B, { noFade: 1 }) + `<path d="${rr(28, 28, 144, 144, 6)}" fill="${k.rad("cs", [[0, "#fff", 0.2], [1, "#000", 0.08]], 0.4, 0.35, 0.8)}"/>`;
      b += slats(k, 68, 68, 64, 64, 3, B) + R(64, 64, 72, 72, 3, "none", ` stroke="${sh(B, -0.2)}" stroke-width="1.2"`);
      const sl = [[48, 42, 104, 9, 0], [149, 48, 9, 104, 90], [48, 149, 104, 9, 180], [42, 48, 9, 104, 270]];
      sl.forEach(([x, y, w, h]) => { b += R(x, y, w, h, 3, k.on ? "#252b33" : sh(B, -0.12)) + (k.on ? "" : `<path d="${rr(x, y, w, h, 3)}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".7"/>`); });
      if (k.on) { const fl = (x, y, w, h) => `<rect class="${P}swing" style="animation-duration:6s" x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${k.lin("cfl", [[0, "#c7cbd0"], [1, "#fdfdfe"]], 0, 0, 0, 1)}"/>`;
        b += fl(50, 44, 100, 5) + fl(50, 151, 100, 5) + fl(44, 50, 5, 100) + fl(151, 50, 5, 100); }
      b += led(k, 160, 162, "#34d399", 1.1) + display(k, 34, 157, 20, 9) + hl(34, 30, 166, 30, 0.7, 1);
      const a = { len: 26, sp: 26, cu: 4, n: 3, fan: 0.3 };
      b += air(k, 100, 40, -90, a) + air(k, 100, 160, 90, a) + air(k, 40, 100, 180, a) + air(k, 160, 100, 0, a);
      return k.svg(b); } });

  icons.push({ id: "console", name: "Floor console", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f2f2ef";
      let b = wall(k, "#a9b8c4", { cy: 0.3 }) + baseboard(k, 164) + floor(k, 164);
      b += BG(frame(k, 46, 10, 108, 62, 6) + sky(k, "day", 52, 16, 96, 50, { seed: 21, trees: 1, hz: 0.72 }) + sill(k, 40, 70, 120));
      b += shadow(k, 100, 168, 64, 4, 0.6) + box(k, 40, 96, 120, 66, 6, B) + `<path d="${rr(40, 96, 120, 20, 6)}" fill="#fff" opacity=".2"/>`;
      b += R(48, 102, 104, 5, 2, "#0b0e12", ` opacity="${k.on ? 0.9 : 0.25}"`) + flap(k, 48, 106, 104, { c: B, h: 6, sd: 7 });
      b += mesh(k, 52, 118, 96, 28, B, 3) + R(54, 150, 92, 4, 2, "#0b0e12", ` opacity="${k.on ? 0.85 : 0.2}"`) + `<rect x="40" y="158" width="120" height="4" fill="#000" opacity=".1"/>`;
      b += R(124, 108, 22, 8, 2, "#14181c") + display(k, 125, 109, 20, 6) + led(k, 56, 112, "#34d399", 0.9);
      b += wash(k, 100, 100, 52, 9) + air(k, 100, 100, -90, { len: 46, sp: 20, cu: 6, fan: 0.4, n: 3 + Math.round(k.lv * 2) }) + air(k, 100, 154, 90, { len: 10, sp: 26, n: 3, cu: 2, w: 4 });
      return k.svg(b); } });

  icons.push({ id: "ptac", name: "Hotel PTAC", colors: sw(CW), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#e9e8e2";
      let b = wall(k, "#cdb79a") + floor(k, 172, "carpet");
      b += `<g class="hda-bg"><rect x="18" y="8" width="20" height="96" fill="${pv(k, "#7a5a6e")}"/><rect x="162" y="8" width="20" height="96" fill="${pv(k, "#7a5a6e")}"/></g>`;
      b += BG(frame(k, 36, 10, 128, 76, 6, "#9aa0a6") + sky(k, "night", 42, 16, 116, 64, { seed: 8, city: 1, hz: 0.62 }) + `<rect x="98" y="16" width="4" height="64" fill="${pv(k, "#9aa0a6")}"/>` + sill(k, 30, 84, 140, "#e2ddd2"));
      b += shadow(k, 100, 174, 82, 4, 0.6) + `<path d="M20 106L26 98H174L180 106Z" fill="${k.lin("pt", [[0, "#cfcec8"], [0.5, "#fbfaf6"], [1, "#cfcec8"]])}"/>`;
      b += `<path d="M30 99H170L174 104H26Z" fill="${k.pat("pslat", 4, 6, `<rect width="4" height="6" fill="#262a30"/><rect width="2" height="6" fill="#c9c8c2"/>`)}"/>`;
      b += box(k, 20, 106, 160, 64, 3, B) + slats(k, 28, 114, 104, 48, 3.6, B) + R(138, 114, 34, 48, 2, pv(k, sh(B, -0.06)));
      b += display(k, 142, 118, 26, 10) + knob(k, 148, 140, 5.5, k.on ? 40 : -60) + knob(k, 162, 140, 5.5, k.on ? -20 + 80 * k.lv : -90) + led(k, 155, 155, "#34d399", 1);
      b += `<rect x="20" y="166" width="160" height="4" fill="#000" opacity=".2"/>` + wash(k, 100, 100, 70, 8) + air(k, 100, 98, -90, { len: 40, sp: 24, cu: 7, fan: 0.3, n: 3 + Math.round(k.lv * 2) });
      return k.svg(b); } });

  icons.push({ id: "wall", name: "Through-wall", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#e8e9e9";
      let b = wall(k, "#b6c2b0", { cy: 0.4 }) + baseboard(k, 170) + floor(k, 170);
      b += `<rect x="30" y="44" width="140" height="94" rx="3" fill="#000" opacity=".25"/>` + R(32, 40, 136, 94, 3, pv(k, "#f4f3ef")) + R(38, 46, 124, 82, 2, "#4b5058");
      b += box(k, 40, 48, 120, 78, 2, B) + `<rect x="46" y="54" width="108" height="20" fill="${k.pat("dg", 6, 4, `<rect width="6" height="4" fill="#1a1d22"/><path d="M0 3L6 1" stroke="#d9dbdc" stroke-width="1.4"/>`)}"/><rect x="46" y="54" width="108" height="20" fill="none" stroke="#9aa0a6" stroke-width=".8"/>`;
      b += mesh(k, 46, 80, 78, 40, B, 2) + R(128, 80, 26, 40, 2, pv(k, sh(B, -0.08))) + display(k, 131, 84, 20, 9) + button(k, 135, 102) + button(k, 147, 102) + button(k, 135, 112) + button(k, 147, 112);
      b += R(150, 150, 12, 18, 1.5, pv(k, "#f4f3ef")) + `<rect x="153" y="154" width="2" height="4" fill="#333"/><rect x="157" y="154" width="2" height="4" fill="#333"/>` + `<path d="M154 162C150 168 132 160 140 128" stroke="#e8e8e8" stroke-width="1.6" fill="none"/>`;
      b += `<rect x="20" y="140" width="62" height="6" rx="1" fill="${pv(k, "#8a6446")}"/>` + `<path d="M28 140V120Q36 112 44 120V140Z" fill="${pv(k, "#d7c7b1")}"/>` + plant(k, 62, 126, 0.8);
      b += wash(k, 100, 70, 56, 10) + air(k, 100, 72, 70, { len: 40, sp: 24, cu: 5, fan: 0.4, n: 3 + Math.round(k.lv * 2) });
      return k.svg(b); } });

  icons.push({ id: "central", name: "Central AC", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o);
      let b = siding(k, "#cbbfa8", 0, 120) + `<rect x="0" y="112" width="200" height="8" fill="${pv(k, "#8b8478")}"/>` + grass(k, 120, 5);
      b += R(156, 40, 18, 26, 2, pv(k, "#9aa0a6")) + `<rect x="162" y="66" width="6" height="40" fill="${metal(k, "#8a9097")}"/>` + pipe("M148 132C160 132 165 120 165 110V100", 4, "#2c2f33") + pipe("M150 138C166 138 172 124 172 110V60", 6, "#1e2125");
      b += `<path d="M30 174L44 146H164L176 174Z" fill="${k.lin("pad", [[0, "#c8c4bb"], [1, "#8f8a80"]], 0, 0, 0, 1)}"/>` + `<path d="M30 174H176V180H30Z" fill="#6e6a62"/>`;
      b += shadow(k, 104, 162, 62, 6, 0.6);
      const x0 = 50, x1 = 154, yt = 82, yb = 162;
      b += R(x0 - 2, yt, x1 - x0 + 4, yb - yt, 3, metal(k, "#9aa0a6")) + fins(k, x0 + 4, yt + 8, x1 - x0 - 8, yb - yt - 18);
      b += `<rect x="${x0 + 4}" y="${yt + 8}" width="${x1 - x0 - 8}" height="${yb - yt - 18}" fill="${k.pat("wg", 6, 200, `<rect width="1" height="200" fill="#1d2025"/>`)}"/>` + `<rect x="${x0 - 2}" y="${yb - 10}" width="${x1 - x0 + 4}" height="10" fill="${pv(k, "#5b6067")}"/>`;
      b += `<rect x="${x0 - 2}" y="${yt}" width="10" height="${yb - yt}" fill="${ph(k, "#a8aeb5")}"/><rect x="${x1 - 8}" y="${yt}" width="10" height="${yb - yt}" fill="${ph(k, "#a8aeb5")}"/>` + R(118, 128, 22, 14, 1.5, pv(k, "#b8bdc3"));
      b += `<path d="M${x0 - 2} ${yt}L${x0 + 12} ${yt - 22}H${x1 - 12}L${x1 + 2} ${yt}Z" fill="${k.lin("ctop", [[0, "#5c6168"], [0.5, "#b4bac1"], [1, "#5c6168"]])}"/>` + hl(x0, yt - 0.5, x1, yt - 0.5, 0.5, 1);
      b += rotor(k, 102, yt - 11, 36, { sy: 0.28, n: 4 }) + guard(102, yt - 11, 38, { sy: 0.28, rings: 5, spokes: 12 }) + `<ellipse cx="102" cy="${yt - 11}" rx="10" ry="3" fill="${metal(k, "#40454c")}"/>`;
      b += shimmer(k, 64, yt - 16, 76, 4) + (k.on ? air(k, 102, yt - 14, -90, { n: 3, len: 26, sp: 22, cu: 4, fan: 0.6 }) : "");
      return k.svg(b); } });

  icons.push({ id: "swamp", name: "Swamp cooler", colors: sw(CW), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#eef0f1";
      let b = wall(k, "#d9c9a8", { cx: 0.35 }) + BG(`<rect x="0" y="160" width="200" height="40" fill="${k.lin("pat", [[0, "#a3876a"], [1, "#6a5240"]], 0, 0, 0, 1)}"/>` + drop(k, 0, 160, 200, 10, 0.35));
      b += shadow(k, 106, 170, 48, 5, 0.6) + box3(k, 62, 36, 76, 128, 16, 12, B, 6);
      b += `<path d="M138 42L152 32V150L138 162Z" fill="${k.pat("hc", 5.2, 9, `<path d="M2.6 0L5.2 1.5V4.5L2.6 6L0 4.5V1.5Z M2.6 6V9" fill="#d8c79a" stroke="#6b5a35" stroke-width=".6"/>`)}"/><path d="M138 42L152 32V150L138 162Z" fill="#000" opacity=".25"/>`;
      if (k.on) b += `<g opacity=".18"><path class="${P}pulse" d="M138 42L152 32V150L138 162Z" fill="#7dc8ff"/></g>`;
      b += R(70, 44, 60, 14, 3, k.lin("blk2", [[0, "#2b2f35"], [1, "#16191d"]], 0, 0, 0, 1)) + display(k, 74, 47, 26, 8, { glyph: 1 }) + led(k, 108, 51, "#34d399", 1) + led(k, 115, 51, "#7dd3fc", 1) + led(k, 122, 51, "#7dd3fc", 1);
      b += R(70, 64, 60, 50, 4, "#0b0e12", ` opacity=".85"`);
      for (let i = 0; i < 7; i++) b += `<g${k.on ? ` class="${P}swing" style="animation-duration:5s;animation-delay:-${i * 0.12}s"` : ""}><rect x="71" y="${65 + i * 7}" width="58" height="${k.on ? 3.5 : 6}" rx="1.2" fill="${pv(k, B)}"/></g>`;
      b += vslats(k, 72, 120, 56, 10, 4, B);
      const wl = 0.55; b += R(78, 136, 44, 22, 3, "#c7d7e4", ` opacity=".5"`) + `<g${k.clip(rr(78, 136, 44, 22, 3))}><rect x="76" y="${f(136 + 22 * (1 - wl))}" width="52" height="22" fill="${k.lin("wt", [[0, "#9fdcff", 0.9], [1, "#2468b8", 0.95]], 0, 0, 0, 1)}"/>` +
        `<path class="${k.on ? P + "wave" : ""}" d="M70 ${f(136 + 22 * (1 - wl))}q4 -2 8 0t8 0t8 0t8 0t8 0t8 0t8 0v3h-56Z" fill="#d6f0ff" opacity=".7"/></g>` + R(78, 136, 44, 22, 3, "none", ` stroke="#fff" stroke-opacity=".5" stroke-width=".8"`) + hl(81, 139, 81, 154, 0.5, 1);
      b += `<ellipse cx="70" cy="166" rx="5" ry="3" fill="#2b2f35"/><ellipse cx="130" cy="166" rx="5" ry="3" fill="#2b2f35"/>`;
      b += wash(k, 100, 90, 36, 26, 0.3) + air(k, 100, 90, 175, { len: 50, sp: 12, cu: 5, fan: 0.4, mist: 1, n: 3 + Math.round(k.lv * 2) });
      return k.svg(b); } });

  icons.push({ id: "remote", name: "Smart controller", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f6f7f8";
      let b = wall(k, "#c6bfb2", { cx: 0.6, cy: 0.6 }) + `<rect x="0" y="0" width="200" height="12" fill="${pv(k, "#e8e3da")}"/>`;
      b += `<path d="M-10 22C-10 16 -6 14 0 14H120C128 14 132 18 132 24V40C132 46 128 50 120 50H0Z" fill="${pv(k, B)}"/>` + `<path d="M-10 22C-10 16 -6 14 0 14H120C128 14 132 18 132 24V40C132 46 128 50 120 50H0Z" fill="${edge(k)}"/>` + hl(0, 15.5, 120, 15.5, 0.8) + display(k, 92, 24, 20, 8);
      if (k.on) b += R(4, 46, 122, 4, 2, "#0b0e12") + `<g class="${P}swing" style="animation-duration:7s"><path d="M4 50H126L122 58H8Z" fill="${k.lin("flp3", [[0, "#c3c7cc"], [1, "#fdfdfe"]], 0, 0, 0, 1)}"/></g>`; else b += line("M6 48H124", "#000", 0.3, 0.9);
      b += air(k, 64, 60, 100, { len: 36, sp: 22, cu: 5, n: 3 + Math.round(k.lv) });
      b += `<rect x="80" y="92" width="84" height="84" rx="16" fill="#000" opacity=".3" transform="translate(2 3)"/>` + box(k, 80, 90, 84, 84, 16, B) + R(88, 98, 68, 68, 11, k.lin("cg", [[0, "#1d232b"], [1, "#07090c"]], 0, 0, 0, 1));
      if (k.on) { const col = dispCol(k), t = temp(k) + "", tw = digW(26, t); b += `<circle cx="122" cy="132" r="32" fill="${k.rad("cgl" + col.slice(1), [[0, col, 0.22], [1, col, 0]])}"/>` + digits(122 - tw / 2 - 2, 116, 26, t, col) + `<circle cx="${f(122 + tw / 2 + 2)}" cy="118" r="2.2" fill="none" stroke="${col}" stroke-width="1.4"/>` + glyph(k, 104, 155, 6, col) + `<rect x="114" y="154" width="${f(24 * k.lv + 4)}" height="2.4" rx="1.2" fill="${col}"/><rect x="114" y="154" width="28" height="2.4" rx="1.2" fill="${col}" opacity=".2"/>`; }
      b += `<path d="M88 112L114 98H156V106L88 140Z" fill="#fff" opacity=".05"/>` + `<circle cx="122" cy="94" r="1.6" fill="#1a1f25"/>`;
      if (k.on) for (let i = 0; i < 3; i++) b += `<path class="${P}chase" style="animation-delay:-${f((2 - i) * 0.4)}s" d="M${f(100 - i * 9)} ${f(86 - i * 6)}A${14 + i * 10} ${14 + i * 10} 0 0 1 ${f(126 - i * 2)} ${f(80 - i * 10)}" fill="none" stroke="#e6b3ff" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round" transform="rotate(-18 122 94)"/>`;
      return k.svg(b); } });

  icons.push({ id: "rv", name: "RV rooftop", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f3f4f4";
      let b = sky(k, "hot", 0, 0, 200, 200, { seed: 31, hz: 0.6, trees: 1, sx: 0.18 });
      b += `<path d="M-4 128C40 116 160 116 204 128V200H-4Z" fill="${k.lin("rvb", [[0, "#f6f6f4"], [0.25, "#e2e2de"], [1, "#b9b9b4"]], 0, 0, 0, 1)}"/>` + `<path d="M-4 128C40 116 160 116 204 128" stroke="#fff" stroke-width="1.6" fill="none"/>` +
        `<path d="M-4 152H204V160H-4Z" fill="#3f6fa8"/><path d="M-4 162H204V165H-4Z" fill="#8a5a3a"/>` + `<rect x="150" y="170" width="40" height="22" rx="3" fill="#2a3442"/><rect x="150" y="170" width="40" height="22" rx="3" fill="${k.lin("rvw", [[0, "#7fa6c8", 0.5], [1, "#1c2532", 0]], 0, 0, 1, 1)}"/>`;
      b += `<path d="M180 112V130 M188 112V130" stroke="${metal(k, "#9aa0a6")}" stroke-width="2"/><path d="M180 116H188M180 122H188" stroke="#9aa0a6" stroke-width="1.4"/>`;
      b += shadow(k, 98, 124, 66, 5, 0.55);
      b += `<path d="M30 122C32 98 56 84 92 82H128C152 82 168 96 170 122Z" fill="${pv(k, B)}"/><path d="M30 122C32 98 56 84 92 82H128C152 82 168 96 170 122Z" fill="${edge(k)}"/>` + `<path d="M40 104C50 92 70 86 92 86H126" stroke="#fff" stroke-opacity=".8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 6; i++) b += `<path d="M${54 + i * 9} 104L${58 + i * 9} 118" stroke="#262a30" stroke-width="2.6" stroke-linecap="round"/>`;
      b += `<path d="M122 98C140 98 154 104 160 116H122Z" fill="${k.pat("rvg", 3, 3, `<rect width="3" height="3" fill="#2a2e34"/><rect width="1.5" height="3" fill="#b9bdc2"/>`)}"/>` + rotor(k, 142, 108, 10, { n: 4, sy: 0.5 });
      b += `<path d="M28 120H172V126H28Z" fill="${pv(k, "#c9cac6")}"/>` + shimmer(k, 126, 92, 34, 3) + air(k, 160, 112, -20, { n: 2, len: 24, sp: 8 });
      return k.svg(b); } });

  icons.push({ id: "desk", name: "Desk cooler", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#f4f5f6";
      let b = wall(k, "#3b3a55", { cx: 0.4, cy: 0.3 }) + `<g class="hda-bg"><rect x="0" y="146" width="200" height="54" fill="${k.lin("dsk", [[0, "#c79c6e"], [1, "#7d5634"]], 0, 0, 0, 1)}"/><rect x="0" y="146" width="200" height="54" fill="${k.pat("grn", 50, 6, `<path d="M0 2C12 1 26 3 50 2M0 4.6C14 5.4 30 3.8 50 4.8" fill="none" stroke="#3a2414" stroke-opacity=".3" stroke-width=".6"/>`)}"/>` + hl(0, 146.5, 200, 146.5, 0.3, 1) + `</g>`;
      b += `<g class="hda-bg"><path d="M138 146L150 112H196L200 146Z" fill="#23262c"/><path d="M142 144L152 116H192L196 144Z" fill="${k.lin("lap", [[0, "#3c5f94"], [1, "#182742"]], 0, 0, 1, 1)}"/>`;
      b += `<path d="M20 120H40V146H20Z" fill="${ph(k, "#e9e4dc")}"/><path d="M40 126C48 126 48 140 40 140" stroke="#e9e4dc" stroke-width="3" fill="none"/>` + `<ellipse cx="30" cy="120" rx="10" ry="2.4" fill="#3a2414"/>` + shimmer(k, 22, 116, 16, 2) + `</g>`;
      b += shadow(k, 100, 150, 40, 4, 0.7) + `<path d="${rr(66, 52, 68, 26, 6)}" fill="#cfe7f7" opacity=".45"/>` + `<g${k.clip(rr(66, 52, 68, 26, 6))}><rect x="66" y="62" width="68" height="20" fill="${k.lin("wt2", [[0, "#9fdcff", 0.75], [1, "#2a70c0", 0.85]], 0, 0, 0, 1)}"/><path class="${k.on ? P + "wave" : ""}" d="M58 62q4 -2 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0v3h-72Z" fill="#e1f3ff" opacity=".7"/></g>` +
        hl(70, 56, 70, 74, 0.6, 1.4) + R(64, 48, 72, 6, 3, pv(k, B));
      b += box(k, 62, 76, 76, 72, 12, B) + `<circle cx="100" cy="110" r="25" fill="${sh(B, -0.2)}"/>` + rotor(k, 100, 110, 21, { n: 5, col: "#cfd4da" }) + guard(100, 110, 22, { rings: 4, spokes: 12, c: "#e8eaec" });
      if (k.on) b += `<circle cx="100" cy="110" r="25" fill="none" stroke="${k.c}" stroke-width="2.4" opacity=".9"/><circle cx="100" cy="110" r="30" fill="none" stroke="${k.c}" stroke-width="6" opacity=".18"/>`;
      b += button(k, 88, 140, 2, B) + button(k, 100, 140, 2, B) + button(k, 112, 140, 2, B) + led(k, 124, 140, dispCol(k), 1);
      b += air(k, 100, 120, 100, { len: 30, sp: 14, mist: 1, fan: 0.5, n: 3 + Math.round(k.lv) });
      return k.svg(b); } });

  icons.push({ id: "heatpump", name: "Heat pump", colors: sw(WARM), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#e7e9e6";
      let b = sky(k, "snow", 0, 0, 112, 200, { seed: 41, hz: 0.55, trees: 1 }) + `<rect class="hda-bg" x="0" y="150" width="112" height="50" fill="${k.lin("snw", [[0, "#ffffff"], [1, "#cfd8e2"]], 0, 0, 0, 1)}"/>`;
      b += `<rect class="hda-bg" x="112" y="0" width="88" height="200" fill="${k.rad("in", [[0, "#e8d2b8"], [1, "#a8876a"]], 0.5, 0.3, 0.9)}"/>` + `<rect class="hda-bg" x="104" y="0" width="12" height="200" fill="${ph(k, "#b9b2a6")}"/>` + floor(k, 172).replace(/x="0"/g, 'x="116"');
      b += `<path d="M14 150L18 158H90L94 150Z" fill="#8f9399"/>` + `<rect x="18" y="144" width="4" height="10" fill="#555"/><rect x="86" y="144" width="4" height="10" fill="#555"/>`;
      b += shadow(k, 54, 156, 44, 4, 0.4) + box(k, 12, 86, 84, 60, 3, B) + rotor(k, 42, 116, 22, { n: 3 }) + guard(42, 116, 23, { rings: 4 }) + slats(k, 70, 94, 20, 44, 3.2, B);
      b += `<path d="M10 88C10 80 30 78 54 79C78 78 98 80 98 88C98 92 90 90 84 92C76 90 70 92 62 90C52 92 44 90 36 92C26 90 18 92 10 88Z" fill="#fff"/>` + `<path d="M24 92v6M44 92v4M70 92v7" stroke="#e6f3ff" stroke-width="2" stroke-linecap="round"/>`;
      b += pipe("M96 112H110", 4, "#f2f3f4") + shimmer(k, 26, 82, 32, 2);
      b += `<path d="M122 34C122 28 126 26 132 26H186C192 26 196 28 196 34V52C196 58 192 62 186 62H132C126 62 122 58 122 52Z" fill="${pv(k, "#f7f8f9")}"/>` + hl(132, 27.5, 186, 27.5, 0.8) + display(k, 166, 36, 22, 9, { glyph: 1 });
      if (k.on) b += R(126, 58, 66, 4, 2, "#0b0e12") + `<g class="${P}swing" style="animation-duration:7s"><path d="M126 62H192L189 69H129Z" fill="${k.lin("flp4", [[0, "#c3c7cc"], [1, "#fdfdfe"]], 0, 0, 0, 1)}"/></g>`; else b += line("M128 60H190", "#000", 0.3, 0.9);
      b += wash(k, 158, 74, 40, 12, 0.55) + air(k, 158, 70, 100, { len: 60, sp: 18, cu: 6, fan: 0.4, n: 2 + Math.round(k.lv * 2) });
      const SO = "#5f7c8c"; b += `<g class="hda-bg">` + shadow(k, 166, 176, 44, 3, 0.6) + R(136, 120, 70, 34, 8, pv(k, sh(SO, 0.08))) + `<path d="M144 126C156 122 176 122 196 126" stroke="#000" stroke-opacity=".18" stroke-width="1" fill="none"/>` + R(132, 144, 72, 24, 5, pv(k, SO)) + hl(138, 145, 198, 145, 0.35, 1.4) + R(126, 136, 16, 34, 6, pv(k, sh(SO, -0.06))) + hl(130, 138, 138, 138, 0.4, 1.2) + R(150, 132, 22, 16, 5, pv(k, "#e7c27a")) + `<rect x="134" y="168" width="4" height="6" fill="#3a2a1c"/><rect x="194" y="168" width="4" height="6" fill="#3a2a1c"/></g>`;
      return k.svg(b); } });

  icons.push({ id: "smart", name: "Smart slider", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#dfe2e5";
      let b = wall(k, "#d3d9de", { cx: 0.3 }) + frame(k, 14, 14, 172, 116, 6, "#f4f4f2") + sky(k, "day", 20, 20, 104, 104, { seed: 17, trees: 1, hz: 0.75, sx: 0.3 }) + `<rect x="78" y="20" width="5" height="104" fill="${pv(k, "#f4f4f2")}"/>`;
      b += R(124, 20, 56, 30, 1, pv(k, "#dddcd7")) + R(124, 106, 56, 18, 1, pv(k, "#dddcd7"));
      b += box(k, 128, 48, 48, 60, 6, B) + vslats(k, 134, 56, 22, 44, 3.4, B) + R(160, 56, 12, 44, 3, k.lin("blk3", [[0, "#2b2f35"], [1, "#16191d"]], 0, 0, 0, 1));
      b += k.on ? `<rect x="128" y="104" width="48" height="2" rx="1" fill="${k.c}"/><rect x="128" y="102" width="48" height="6" fill="${k.rad("strp" + k.c.slice(1), [[0, k.c, 0.6], [1, k.c, 0]])}"/>` : "";
      b += display(k, 161, 60, 10, 12, { str: temp(k) + "", dh: 0.5 }) + led(k, 166, 92, "#7dd3fc", 1);
      if (k.on) b += `<g class="${P}vane" style="animation-duration:6s"><rect x="134" y="56" width="22" height="44" fill="${k.c}" opacity=".08"/></g>`;
      b += sill(k, 8, 128, 184) + floor(k, 178);
      b += `<g transform="rotate(-8 60 160)"><rect x="40" y="132" width="40" height="66" rx="7" fill="#15181d"/><rect x="43" y="138" width="34" height="56" rx="4" fill="${k.lin("ph", [[0, "#1f2a3c"], [1, "#0c1220"]], 0, 0, 0, 1)}"/>`;
      if (k.on) { const col = dispCol(k), t = temp(k) + "", tw = digW(14, t); b += `<circle cx="60" cy="160" r="12" fill="none" stroke="${col}" stroke-opacity=".25" stroke-width="2.4"/><path d="M60 148A12 12 0 ${k.lv > 0.5 ? 1 : 0} 1 ${f(60 + 12 * Math.sin(k.lv * 6.28))} ${f(160 - 12 * Math.cos(k.lv * 6.28))}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>` + digits(60 - tw / 2, 153, 14, t, col) + `<rect x="48" y="180" width="24" height="6" rx="3" fill="${col}" opacity=".85"/>`; }
      else b += `<circle cx="60" cy="160" r="12" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2.4"/>`;
      b += `<path d="M43 150L77 140V146L43 168Z" fill="#fff" opacity=".06"/></g>`;
      if (k.on) for (let i = 0; i < 3; i++) b += `<path class="${P}chase" style="animation-delay:-${f((2 - i) * 0.4)}s" d="M${f(92 - i * 3)} ${f(124 - i * 6)}a${8 + i * 6} ${8 + i * 6} 0 0 1 ${f(10 + i * 7)} ${f(-4 - i * 4)}" fill="none" stroke="#c4b5fd" stroke-width="1.6" stroke-linecap="round" transform="rotate(10 100 120)"/>`;
      b += air(k, 145, 78, 170, { len: 40, sp: 12, cu: 5, n: 2 + Math.round(k.lv * 2) });
      return k.svg(b); } });

  icons.push({ id: "attic", name: "Attic air handler", colors: sw(ICE), picker: true, colorLabel: "Air",
    render(o) { const k = K(o), B = "#c9ced3";
      let b = `<g class="hda-bg"><rect x="0" y="0" width="200" height="200" fill="#2a2018"/>` + `<path d="M100 -6L-20 120V0Z M100 -6L220 120V0Z" fill="#1b140f"/>`;
      for (let i = 0; i < 6; i++) b += `<path d="M${100 - i * 26} ${f(-6 + i * 27)}L${100 - i * 26} 140" stroke="#8a6440" stroke-width="5"/><path d="M${100 + i * 26} ${f(-6 + i * 27)}L${100 + i * 26} 140" stroke="#8a6440" stroke-width="5"/>`;
      b += `<path d="M100 -8L-24 124" stroke="${k.lin("raf", [[0, "#c69a66"], [1, "#7c5634"]])}" stroke-width="10"/><path d="M100 -8L224 124" stroke="${k.lin("raf", [[0, "#c69a66"], [1, "#7c5634"]])}" stroke-width="10"/>`;
      b += `<rect x="0" y="0" width="200" height="200" fill="${k.rad("bulb", [[0, "#ffd9a0", 0.35], [1, "#ffd9a0", 0]], 0.75, 0.2, 0.5)}"/><circle cx="150" cy="40" r="3" fill="#fff4d6"/></g>`;
      b += `<g class="hda-bg"><rect x="0" y="140" width="200" height="60" fill="${k.lin("ins", [[0, "#e7c47c"], [1, "#a8853e"]], 0, 0, 0, 1)}"/><rect x="0" y="140" width="200" height="60" fill="${k.pat("fluff", 14, 8, `<path d="M0 4Q3.5 0 7 4T14 4" fill="none" stroke="#fff3cc" stroke-opacity=".5" stroke-width="1.2"/><path d="M0 7Q3.5 3 7 7T14 7" fill="none" stroke="#7a5a26" stroke-opacity=".35" stroke-width="1"/>`)}"/>`;
      b += `<path d="M8 140H190V146H8Z" fill="${pv(k, "#b48a5a")}"/></g>`;
      const fx = (d) => hose(k, d, 14, "#c8ccd1");
      b += fx("M130 104C160 104 170 120 196 120") + fx("M118 92C140 80 160 64 196 64") + fx("M60 104C34 108 20 124 2 126");
      b += shadow(k, 92, 140, 56, 4, 0.6) + box3(k, 46, 90, 82, 48, 12, 10, B, 2) + R(52, 96, 48, 36, 1, "none", ` stroke="#000" stroke-opacity=".3" stroke-width=".8"`) + `<circle cx="56" cy="100" r="1.2" fill="#555"/><circle cx="96" cy="100" r="1.2" fill="#555"/><circle cx="56" cy="128" r="1.2" fill="#555"/><circle cx="96" cy="128" r="1.2" fill="#555"/>`;
      b += R(104, 98, 18, 30, 1, "#15181c") + rotor(k, 113, 113, 7, { n: 6, col: "#9aa0a6" }) + led(k, 70, 112, "#34d399", 1.2) + led(k, 78, 112, k.on ? "#fbbf24" : "#fbbf24", 1.2);
      b += R(64, 104, 24, 4, 1, "#fff", ` opacity=".7"`) + R(64, 116, 24, 10, 1, "#0b0e12") + (k.on ? `<rect x="66" y="118" width="${f(20 * k.lv)}" height="6" fill="${dispCol(k)}" opacity=".85"/>` : "");
      if (k.on) { const col = k.c, d = k.dur(2.4, 1.4); [[[150, 109], [170, 116], [190, 120]], [[140, 80], [162, 70], [186, 65]], [[40, 110], [22, 120], [6, 125]]].forEach((pts) => pts.forEach((p, i) => {
        b += `<circle class="${P}chase" style="animation-duration:${d}s;animation-delay:-${f(d - (i * d) / 3)}s" cx="${p[0]}" cy="${p[1]}" r="3.2" fill="${col}"/>`; })); }
      return k.svg(b); } });

  (window.HDA = window.HDA || []).push({
    id: "ac", tab: "Air conditioners", group: "Air", kind: "device",
    intro: "Window, portable, split, central and rooftop units, each in its own spot. On, flaps open and swing, air ribbons flow out in the air color (cool, heat, dry or fan), outdoor fans spin and the display shows the set temperature. Speed sets the fan speed.",
    
    css: `
.hda-ac-svg{overflow:hidden}
.hda-ac-spin{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-ac-spin{animation:hda-ac-rot 1s linear infinite}
@keyframes hda-ac-rot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.hda-ac-flow{opacity:.75}
.hda-anim .hda-ac-flow{animation:hda-ac-flow 3s ease-in-out infinite}
@keyframes hda-ac-flow{0%{opacity:0;transform:translateX(-6px)}30%{opacity:1}100%{opacity:0;transform:translateX(12px)}}
.hda-ac-swing{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-ac-swing{animation:hda-ac-swing 6s ease-in-out infinite}
@keyframes hda-ac-swing{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.5)}}
.hda-ac-vane{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-ac-vane{animation:hda-ac-vane 6s ease-in-out infinite}
@keyframes hda-ac-vane{0%,100%{transform:skewX(-8deg)}50%{transform:skewX(8deg)}}
.hda-anim .hda-ac-pulse{animation:hda-ac-pulse 2.4s ease-in-out infinite}
@keyframes hda-ac-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.hda-anim .hda-ac-chase{animation:hda-ac-chase 1.2s ease-in-out infinite}
@keyframes hda-ac-chase{0%,100%{opacity:.15}40%{opacity:1}}
.hda-ac-rise{opacity:.5;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-ac-rise{animation:hda-ac-rise 3s ease-out infinite}
@keyframes hda-ac-rise{0%{opacity:0;transform:translateY(6px)}35%{opacity:.8}100%{opacity:0;transform:translateY(-16px)}}
.hda-ac-drip{opacity:0}
.hda-anim .hda-ac-drip{animation:hda-ac-drip 2.4s ease-in infinite}
@keyframes hda-ac-drip{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(16px)}}
.hda-anim .hda-ac-wave{animation:hda-ac-wave 2.2s linear infinite}
@keyframes hda-ac-wave{from{transform:translateX(0)}to{transform:translateX(8px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-ac-spin,.hda-anim .hda-ac-flow,.hda-anim .hda-ac-swing,.hda-anim .hda-ac-vane,.hda-anim .hda-ac-pulse,.hda-anim .hda-ac-chase,.hda-anim .hda-ac-rise,.hda-anim .hda-ac-drip,.hda-anim .hda-ac-wave{animation:none}}
`,
    icons,
  });
})();
