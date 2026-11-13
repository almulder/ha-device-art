(function () {
  const P = "hda-nightstand-";
  const WARM = ["#ffd8a8", "#fff1dc", "#eef6ff", "#ffc9de", "#b197fc"];
  const RGB = ["#b197fc", "#ff6bcb", "#4dabf7", "#63e6be", "#ffd8a8"];

  function C(o) {
    const H = window.HDAH, c = o.color || "#ffd8a8", on = !!o.on;
    const L = on ? Math.max(0.05, o.level == null ? 1 : o.level) : 0;
    const k = (v) => (v * (0.15 + 0.85 * L)).toFixed(3);
    return { H, u: o.uid, c, on, L, k, hot: H.mix(c, "#ffffff", 0.72), lite: H.mix(c, "#ffffff", 0.35), deep: H.shade(c, -0.3), c2: o._c2 ? (o.color2 || o._c2) : null };
  }
  const st = (off, col, op) => `<stop offset="${off}" stop-color="${col}"${op == null ? "" : ` stop-opacity="${op}"`}/>`;
  const lg = (u, id, x1, y1, x2, y2, s) => `<linearGradient id="${u}-${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
  const rg = (u, id, a, s) => `<radialGradient id="${u}-${id}" ${a}>${s}</radialGradient>`;
  function defs(x, extra) {
    const { u, c, hot, lite, deep, H } = x;
    return `<defs>
${rg(u, "halo", "", st(0, c, 0.7) + st(0.45, c, 0.24) + st(1, c, 0))}
${rg(u, "pool", "", st(0, c, 0.62) + st(0.5, c, 0.2) + st(1, c, 0))}
${rg(u, "fill", 'cx=".5" cy=".55" r=".6"', st(0, "#fff", 0.97) + st(0.4, hot, 0.95) + st(1, c, 0.75))}
${lg(u, "dn", 0, 0, 0, 1, st(0, c, 0.6) + st(1, c, 0))}
${lg(u, "up", 0, 1, 0, 0, st(0, c, 0.6) + st(1, c, 0))}
${(() => { const t = (v) => x.c2 ? H.mix(v, x.c2, 0.3) : v; return lg(u, "ls", 0, 0, 1, 0, st(0, t(H.shade(c, -0.12))) + st(0.32, t(hot)) + st(0.62, t(lite)) + st(1, t(deep))); })()}
${x.c2 ? (() => { const c2 = x.c2, S = H.shade; return lg(u, "c2f", 0, 0, 1, 0, st(0, S(c2, -0.32)) + st(0.3, S(c2, 0.12)) + st(0.64, S(c2, -0.06)) + st(1, S(c2, -0.38))) +
  lg(u, "c2m", 0, 0, 1, 0, st(0, S(c2, -0.55)) + st(0.32, S(c2, 0.45)) + st(0.56, c2) + st(1, S(c2, -0.6))) +
  lg(u, "c2c", 0, 0, 1, 0, st(0, S(c2, -0.3)) + st(0.3, S(c2, 0.3)) + st(0.62, S(c2, 0.08)) + st(1, S(c2, -0.35))) +
  rg(u, "c2o", 'cx=".38" cy=".32" r=".72"', st(0, S(c2, 0.6)) + st(0.55, c2) + st(1, S(c2, -0.45))) +
  rg(u, "c2lo", 'cx=".42" cy=".38" r=".66"', st(0, "#fff") + st(0.3, H.mix(hot, c2, 0.3)) + st(0.78, H.mix(c, c2, 0.4)) + st(1, H.mix(deep, c2, 0.4))); })() : ""}
${rg(u, "lopal", 'cx=".42" cy=".38" r=".66"', st(0, "#fff") + st(0.3, hot) + st(0.78, c) + st(1, deep))}
${rg(u, "opal", 'cx=".38" cy=".32" r=".72"', st(0, "#fbf8f2") + st(0.55, "#d6d0c7") + st(1, "#857f79"))}
${rg(u, "gloss", 'cx=".34" cy=".28" r=".7"', st(0, "#fff", 0.6) + st(0.4, "#fff", 0.1) + st(1, "#fff", 0))}
${lg(u, "cyl", 0, 0, 1, 0, st(0, "#000", 0.28) + st(0.17, "#fff", 0.2) + st(0.4, "#fff", 0) + st(0.68, "#000", 0) + st(1, "#000", 0.34))}
${lg(u, "brass", 0, 0, 1, 0, st(0, "#6b4515") + st(0.32, "#f3d483") + st(0.56, "#c99a3e") + st(1, "#5e3d12"))}
${lg(u, "bronze", 0, 0, 1, 0, st(0, "#2a180c") + st(0.34, "#a8743c") + st(0.6, "#6a4422") + st(1, "#21130a"))}
${lg(u, "steel", 0, 0, 1, 0, st(0, "#4f555c") + st(0.34, "#eef1f4") + st(0.6, "#9aa1a8") + st(1, "#474c53"))}
${lg(u, "blk", 0, 0, 1, 0, st(0, "#0e0f12") + st(0.32, "#555a64") + st(0.58, "#24262d") + st(1, "#0b0c0f"))}
${lg(u, "wood", 0, 0, 1, 0, st(0, "#5a3519") + st(0.33, "#cf9d6a") + st(0.62, "#a06e43") + st(1, "#4f2e15"))}
${lg(u, "woodv", 0, 0, 0, 1, st(0, "#d8a978") + st(1, "#8c5a32"))}
${lg(u, "lin", 0, 0, 1, 0, st(0, "#a3967f") + st(0.3, "#f4eee3") + st(0.64, "#ddd3c3") + st(1, "#958871"))}
${lg(u, "cer", 0, 0, 1, 0, st(0, "#a9a39b") + st(0.3, "#fbf9f5") + st(0.62, "#e4dfd7") + st(1, "#8f8981"))}
${rg(u, "sh", "", st(0, "#000", 0.55) + st(0.6, "#000", 0.22) + st(1, "#000", 0))}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${defs(x, extra)}${body}</svg>`;
  const F = (x, id) => `url(#${x.u}-${id})`;
  const f1 = (n) => (+n).toFixed(1);
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 3}" fill="${F(x, "sh")}"/>`;
  const halo = (x, cx, cy, r, kk, ry, cls) => x.on ? `<g class="${P}${cls || "breath"}"><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry || r}" fill="${F(x, "halo")}" opacity="${x.k(kk == null ? 0.8 : kk)}"/></g>` : "";
  const beam = (x, d, id, kk) => x.on ? `<g class="${P}beam"><path d="${d}" fill="${F(x, id || "dn")}" opacity="${x.k(kk == null ? 0.45 : kk)}"/></g>` : "";
  const T = (dx, s) => `<g transform="translate(${dx} 0)">${s}</g>`;
  const hi = (d, op, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${op || 0.5}" stroke-width="${w || 1.4}" stroke-linecap="round"/>`;
  function tube(d, m, w) {
    const t = { brass: ["#5e3d12", "#d9b45e"], steel: ["#40464d", "#c3c9cf"], black: ["#0b0c0f", "#3c4048"], bronze: ["#21130a", "#8a5c2e"] }[m];
    return `<path d="${d}" fill="none" stroke="${t[0]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${t[1]}" stroke-width="${f1(w * 0.5)}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f1(Math.max(0.5, w * 0.16))}" stroke-linecap="round" transform="translate(${f1(-w * 0.17)} ${f1(-w * 0.1)})"/>`;
  }
  function disk(x, cx, y, rx, h, m, top) {
    const ry = +(rx * 0.24).toFixed(1);
    return `<path d="M${cx - rx} ${y - h} V${y} A${rx} ${ry} 0 0 0 ${cx + rx} ${y} V${y - h} Z" fill="${F(x, m)}"/>
<ellipse cx="${cx}" cy="${y - h}" rx="${rx}" ry="${ry}" fill="${top || F(x, m)}"/>
<ellipse cx="${cx}" cy="${y - h}" rx="${rx}" ry="${ry}" fill="${F(x, "gloss")}" opacity=".7"/>`;
  }
  function shadeBody(x, cx, yt, rt, yb, rb, fab, o) {
    o = o || {};
    const ryt = o.ryt || +(rt * 0.15).toFixed(1), ryb = o.ryb || +(rb * 0.15).toFixed(1);
    const body = `M${cx - rt} ${yt} A${rt} ${ryt} 0 0 1 ${cx + rt} ${yt} L${cx + rb} ${yb} A${rb} ${ryb} 0 0 1 ${cx - rb} ${yb} Z`;
    let s = `<path d="${body}" fill="${fab}"/>`;
    if (x.on && !o.opaque) s += `<path d="${body}" fill="${F(x, "ls")}" opacity="${x.k(o.lk || 0.92)}"/>`;
    if (o.ribs) {
      for (let i = 1; i < o.ribs; i++) {
        const t = i / o.ribs, a = Math.PI * t, xt = cx - rt * Math.cos(a), xb = cx - rb * Math.cos(a);
        const yT = yt + ryt * Math.sin(a), yB = yb + ryb * Math.sin(a);
        s += `<path d="M${f1(xt)} ${f1(yT)} L${f1(xb)} ${f1(yB)}" stroke="${i % 2 ? "#000" : "#fff"}" stroke-opacity="${i % 2 ? 0.16 : 0.22}" stroke-width="${o.ribW || 1.1}"/>`;
      }
    }
    if (o.weave) s += `<path d="${body}" fill="url(#${x.u}-${o.weave})" opacity="${x.on ? 0.5 : 0.8}"/>`;
    s += `<path d="${body}" fill="${F(x, "cyl")}" opacity="${x.on && !o.opaque ? 0.55 : 1}"/>`;
    s += `<ellipse cx="${cx}" cy="${yt}" rx="${rt}" ry="${ryt}" fill="${x.on ? x.hot : (o.lining || "#4b443c")}"/>`;
    if (x.on) s += `<ellipse cx="${cx}" cy="${yt}" rx="${f1(rt * 0.8)}" ry="${f1(ryt * 0.6)}" fill="#fff" opacity="${x.k(0.7)}"/>`;
    s += `<ellipse cx="${cx}" cy="${yt}" rx="${rt}" ry="${ryt}" fill="none" stroke="${o.trim || "#000"}" stroke-opacity="${o.trim ? 1 : 0.25}" stroke-width="${o.trimW || 0.9}"/>`;
    s += `<path d="M${cx - rb} ${yb} A${rb} ${ryb} 0 0 0 ${cx + rb} ${yb}" fill="none" stroke="${x.on ? x.hot : (o.trim || "#000")}" stroke-opacity="${x.on ? x.k(1) : (o.trim ? 1 : 0.3)}" stroke-width="${x.on ? 1.8 : (o.trimW || 1)}"/>`;
    if (x.on) s += `<ellipse cx="${cx}" cy="${yb + 0.6}" rx="${f1(rb * 0.86)}" ry="${f1(ryb * 0.55)}" fill="${F(x, "fill")}" opacity="${x.k(0.8)}"/>`;
    return s;
  }
  function opening(x, cx, cy, rx, ry, dark) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${dark || "#22252b"}"/>` + (x.on ?
      `<ellipse cx="${cx}" cy="${cy}" rx="${f1(rx - 1.6)}" ry="${f1(Math.max(1, ry - 0.8))}" fill="${F(x, "fill")}" opacity="${x.k(1)}"/><ellipse cx="${cx}" cy="${f1(cy + ry * 0.2)}" rx="${f1(rx * 0.35)}" ry="${f1(ry * 0.6)}" fill="#fff" opacity="${x.k(0.9)}"/>` : "");
  }
  function opal(x, d, gl) {
    const lo = x.c2 ? "c2lo" : "lopal", of = x.c2 ? "c2o" : "opal";
    return `<path d="${d}" fill="${x.on ? F(x, lo) : F(x, of)}"/>` +
      (x.on ? `<path d="${d}" fill="${F(x, of)}" opacity="${(0.7 - 0.6 * x.L).toFixed(2)}"/>` : "") +
      `<path d="${d}" fill="${F(x, "gloss")}" opacity="${gl == null ? 0.75 : gl}"/>`;
  }

  const SM = {
    walnut: { t1: "#a3714a", t2: "#6a4226", e: "#3f2514", f1: "#7a4d2c", f2: "#4a2d18", lip: "#55341c", grain: 1, k: "brass" },
    oak: { t1: "#e8c896", t2: "#b98d5c", e: "#8a643c", f1: "#cfa673", f2: "#94704a", lip: "#a87e50", grain: 1, k: "black" },
    white: { t1: "#faf8f4", t2: "#d4cfc7", e: "#a29c93", f1: "#eeeae3", f2: "#bdb7ae", lip: "#d9d4cc", k: "brass" },
    black: { t1: "#50545e", t2: "#25272d", e: "#0e0f12", f1: "#33363d", f2: "#191a1f", lip: "#2a2c32", k: "brass" },
    sage: { t1: "#c3d1ba", t2: "#8ea385", e: "#5c6f55", f1: "#a7ba9e", f2: "#71866a", lip: "#8b9e83", k: "wood" },
    navy: { t1: "#56688f", t2: "#2b3858", e: "#18223d", f1: "#3a4b72", f2: "#222d4a", lip: "#2f3d60", k: "brass" },
    cane: { t1: "#e6cfa4", t2: "#b9976a", e: "#7a5c38", f1: "#c9a979", f2: "#8d6c45", lip: "#a8875c", grain: 1, k: "brass", cane: 1 }
  };
  function stand0(x, s) {
    const m = SM[s.m || "walnut"], u = x.u, a = s.x0 == null ? 20 : s.x0, b = s.x1 == null ? 180 : s.x1, w = b - a;
    const top = `M${a} 152 L${b} 152 L${b - 7} 142 L${a + 7} 142 Z`;
    let g = "";
    if (m.grain) for (let i = 0; i < 4; i++) { const y = 143.8 + i * 2.1; g += `<path d="M${a + 10 + i * 9} ${f1(y)} C${a + w * 0.3} ${f1(y - 0.9)} ${b - w * 0.4} ${f1(y + 1)} ${b - 12 - i * 7} ${f1(y)}" fill="none" stroke="${m.e}" stroke-opacity=".3" stroke-width=".6"/>`; }
    const rx = s.rx || 50;
    const pool = x.on && s.cx != null ? `<g clip-path="url(#${u}-tc)"><ellipse cx="${s.cx}" cy="147" rx="${rx}" ry="${s.ry || 8}" fill="${F(x, "pool")}" opacity="${x.k(s.kk || 0.95)}"/></g>
<ellipse cx="${s.cx}" cy="152.5" rx="${f1(rx * 0.85)}" ry="1.2" fill="${x.hot}" opacity="${x.k(0.45)}"/>
<ellipse cx="${s.cx}" cy="159" rx="${f1(rx * 0.7)}" ry="3" fill="${F(x, "pool")}" opacity="${x.k(0.35)}"/>` : "";
    let knob = "";
    const kx = a + w / 2;
    if (m.k === "brass") knob = `<circle cx="${kx}" cy="176" r="3" fill="${F(x, "brass")}"/><circle cx="${kx - 0.9}" cy="175" r="1" fill="#fff" opacity=".6"/><ellipse cx="${kx}" cy="179.4" rx="3" ry="1" fill="#000" opacity=".25"/>`;
    else if (m.k === "black") knob = `<rect x="${kx - 12}" y="173.5" width="24" height="3.4" rx="1.7" fill="${F(x, "blk")}"/><rect x="${kx - 11}" y="173.8" width="22" height=".8" rx=".4" fill="#fff" opacity=".25"/><rect x="${kx - 12}" y="177.4" width="24" height="1" fill="#000" opacity=".25"/>`;
    else knob = `<rect x="${kx - 4}" y="171" width="8" height="8" rx="4" fill="${F(x, "wood")}"/><circle cx="${kx - 1.2}" cy="173.8" r="1.2" fill="#fff" opacity=".4"/>`;
    let cane = "";
    if (m.cane) {
      cane = `<rect x="${a + 14}" y="166" width="${w - 28}" height="21" rx="1" fill="url(#${u}-canep)" opacity=".9"/><rect x="${a + 14}" y="166" width="${w - 28}" height="21" rx="1" fill="none" stroke="${m.e}" stroke-width="1.4"/>`;
    }
    return `<defs>${lg(u, "stt", 0, 0, 0, 1, st(0, m.t2) + st(1, m.t1))}${lg(u, "stf", 0, 0, 0, 1, st(0, m.f1) + st(1, m.f2))}
<clipPath id="${u}-tc"><path d="${top}"/></clipPath>
${m.cane ? `<pattern id="${u}-canep" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#6e5230"/><circle cx="2.5" cy="2.5" r="1.5" fill="#2a1d10"/><path d="M0 0 L5 5 M5 0 L0 5" stroke="#e8cf9e" stroke-width=".9"/></pattern>` : ""}</defs>
<path d="${top}" fill="${F(x, "stt")}"/>${g}${pool}
<path d="M${a + 7} 142 L${b - 7} 142" stroke="#fff" stroke-opacity=".14" stroke-width=".8"/>
<rect x="${a}" y="152" width="${w}" height="6" fill="${m.lip}"/>
<rect x="${a}" y="152" width="${w}" height=".9" fill="#fff" opacity=".3"/>
<rect x="${a + 4}" y="158" width="${w - 8}" height="38" fill="${m.f2}"/>
<rect x="${a + 4}" y="158" width="${w - 8}" height="3" fill="#000" opacity=".32"/>
<rect x="${a + 10}" y="163" width="${w - 20}" height="27" rx="1.6" fill="${F(x, "stf")}"/>
<rect x="${a + 10}" y="163" width="${w - 20}" height="1" fill="#fff" opacity=".22"/>
<rect x="${a + 10}" y="189" width="${w - 20}" height="1" fill="#000" opacity=".3"/>
<rect x="${a + 4}" y="158" width="5" height="38" fill="#000" opacity=".18"/><rect x="${b - 9}" y="158" width="5" height="38" fill="#000" opacity=".26"/>
${cane}${knob}`;
  }

  function bed0(x, b) {
    const u = x.u, w = b.w || 42, top = b.top || 62, c = b.col || "#7d86a8", H = x.H;
    const hb = `M2 ${top + 9} Q2 ${top} 11 ${top} L${w - 9} ${top} Q${w} ${top} ${w} ${top + 9} L${w} 196 L2 196 Z`;
    let tex = "";
    if (b.style === "wood") {
      for (let xx = 8; xx < w - 2; xx += 9) tex += `<rect x="${xx}" y="${top + 2}" width="1" height="${190 - top}" fill="#000" opacity=".3"/><rect x="${xx + 1}" y="${top + 2}" width=".7" height="${190 - top}" fill="#fff" opacity=".12"/>`;
    } else if (b.style === "channel") {
      for (let xx = 10; xx < w - 2; xx += 10) tex += `<path d="M${xx} ${top + 3} V190" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/><path d="M${xx + 1.4} ${top + 4} V190" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>`;
    } else {
      let r = 0;
      for (let y = top + 14; y < 120; y += 15, r++) for (let xx = r % 2 ? 9 : 16; xx < w - 4; xx += 14) {
        tex += `<path d="M${xx - 6} ${y - 6} L${xx} ${y} M${xx + 6} ${y - 6} L${xx} ${y} M${xx - 6} ${y + 6} L${xx} ${y} M${xx + 6} ${y + 6} L${xx} ${y}" stroke="#000" stroke-opacity=".14" stroke-width=".8"/><circle cx="${xx}" cy="${y}" r="1.4" fill="${H.shade(c, -0.45)}"/><circle cx="${xx - 0.4}" cy="${y - 0.5}" r=".5" fill="#fff" opacity=".4"/>`;
      }
    }
    const fab = b.style === "wood" ? F(x, "wood") : `url(#${u}-hb)`;
    const duv = b.duv || H.mix(c, "#ffffff", 0.25);
    const lit = x.on && b.lit != null ? `<ellipse cx="${w + 2}" cy="${b.ly || 112}" rx="${b.lr || 36}" ry="${b.lry || 58}" fill="${F(x, "pool")}" opacity="${x.k(0.55)}"/>` : "";
    return `<defs>${lg(u, "hb", 0, 0, 1, 0, st(0, H.shade(c, -0.35)) + st(0.4, c) + st(0.75, H.shade(c, 0.1)) + st(1, H.shade(c, -0.25)))}
${lg(u, "pil", 0, 0, 0, 1, st(0, "#fbfaff") + st(0.7, "#e2deec") + st(1, "#b9b3c9"))}
${lg(u, "duv", 0, 0, 0, 1, st(0, H.shade(duv, 0.1)) + st(1, H.shade(duv, -0.3)))}
${lg(u, "cus", 0, 0, 0, 1, st(0, H.shade(duv, 0.05)) + st(1, H.shade(duv, -0.3)))}</defs>
<path d="${hb}" fill="${fab}"/>${tex}
<path d="M3 ${top + 8} Q3 ${top + 1} 11 ${top + 1} L${w - 9} ${top + 1}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>
<path d="M${w - 0.6} ${top + 8} V196" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>
<path d="M0 120 C0 112 6 109 14 109 L${w - 8} 110 C${w - 1} 110 ${w + 1} 118 ${w - 1} 128 C${w - 2} 137 ${w - 6} 141 ${w - 12} 141 L6 141 C1 141 0 130 0 120 Z" fill="url(#${u}-pil)"/>
<path d="M4 114 C14 111 26 111 ${w - 8} 113" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.2"/>
<path d="M${w - 16} 112 C${w - 12} 120 ${w - 13} 130 ${w - 16} 138" fill="none" stroke="#8f88a6" stroke-opacity=".35" stroke-width="1"/>
<path d="M0 132 C0 126 4 124 10 124 L${w - 12} 125 C${w - 6} 125 ${w - 4} 130 ${w - 5} 136 C${w - 6} 142 ${w - 9} 145 ${w - 14} 145 L4 145 C1 145 0 138 0 132 Z" fill="url(#${u}-cus)"/>
<path d="M0 132 C0 126 4 124 10 124 L${w - 12} 125 C${w - 6} 125 ${w - 4} 130 ${w - 5} 136 C${w - 6} 142 ${w - 9} 145 ${w - 14} 145 L4 145" fill="none" stroke="${H.shade(duv, -0.45)}" stroke-width="1"/>
<path d="M3 127 C12 125.5 22 125.5 ${w - 14} 127" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
<path d="M0 145 L${w + 2} 143 C${w + 4} 156 ${w + 3} 174 ${w + 4} 196 L0 196 Z" fill="url(#${u}-duv)"/>
<path d="M0 143 L${w + 2} 141 L${w + 2.6} 148 L0 150 Z" fill="#f4f1f8"/><path d="M0 150 L${w + 2.6} 148" stroke="#000" stroke-opacity=".2" stroke-width="1"/>
<path d="M0 143 L${w + 2} 141" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>
<path d="M${w - 10} 152 C${w - 6} 164 ${w - 9} 178 ${w - 6} 194 M8 158 C16 162 22 170 24 190" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="2"/>
<path d="M${w + 2.6} 148 C${w + 4} 160 ${w + 3} 176 ${w + 4} 196" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>
${lit}`;
  }

  function books0(x, cx, cols) {
    cols = cols || ["#6b3a4a", "#2f5a6e", "#c9a14a"];
    const W = [34, 30, 26], off = [0, 2, -1];
    let s = shadow(x, cx, 148, 20, 2.4), y = 148;
    W.forEach((w, i) => {
      y -= 5.6; const l = cx - w / 2 + off[i];
      s += `<rect x="${l}" y="${y}" width="${w}" height="5.6" rx="1" fill="${cols[i]}"/><rect x="${l + w - 4.4}" y="${y + 0.9}" width="3.6" height="3.8" fill="#efe6d2"/>
<path d="M${l + w - 4.2} ${y + 2.1} H${l + w - 1} M${l + w - 4.2} ${y + 3.3} H${l + w - 1}" stroke="#b8ab92" stroke-width=".4"/>
<rect x="${l}" y="${y}" width="${w}" height="1" fill="#fff" opacity=".22"/><rect x="${l}" y="${y + 4.6}" width="${w}" height="1" fill="#000" opacity=".25"/>
<rect x="${l + 4}" y="${y + 2.2}" width="${f1(w * 0.36)}" height="1.1" fill="#e9d48a" opacity=".55"/>`;
    });
    return s;
  }
  function glasses0(x, cx, y) {
    y = y || 147;
    const lens = (lx) => `<ellipse cx="${lx}" cy="${y}" rx="7.2" ry="3.6" fill="#cfe3ff" fill-opacity=".12" stroke="#1d1f24" stroke-width="1.5"/>` +
      (x.on ? `<path d="M${lx - 4} ${y - 1.4} Q${lx} ${y - 3} ${lx + 3} ${y - 1.8}" fill="none" stroke="${x.hot}" stroke-opacity="${x.k(0.9)}" stroke-width="1"/>` : `<path d="M${lx - 4} ${y - 1.4} Q${lx} ${y - 3} ${lx + 3} ${y - 1.8}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`);
    return `${shadow(x, cx, y + 2.4, 17, 1.6)}<path d="M${cx - 14} ${y - 2} L${cx - 20} ${y - 6} M${cx + 14} ${y - 2} L${cx + 19} ${y - 6}" stroke="#1d1f24" stroke-width="1.2" stroke-linecap="round"/>
${lens(cx - 8)}${lens(cx + 8)}<path d="M${cx - 1} ${y - 1} Q${cx} ${y - 2.6} ${cx + 1} ${y - 1}" fill="none" stroke="#1d1f24" stroke-width="1.3"/>`;
  }
  function phone0(x, cx, chg, y) {
    y = y || 149;
    return `${shadow(x, cx, y + 0.5, 15, 1.6)}<path d="M${cx - 14} ${y} L${cx + 12} ${y} L${cx + 9} ${y - 5} L${cx - 11} ${y - 5} Z" fill="#141519"/>
<path d="M${cx - 12.4} ${y - 0.7} L${cx + 10.6} ${y - 0.7} L${cx + 8.4} ${y - 4.3} L${cx - 10} ${y - 4.3} Z" fill="${chg && x.on ? "#1c2a3b" : "#22252c"}"/>
${chg ? `<path d="M${cx - 1} ${y - 3.9} L${cx - 2.6} ${y - 2.2} L${cx - 0.6} ${y - 2.2} L${cx - 1.6} ${y - 1}" fill="none" stroke="#5ff0a0" stroke-width=".9" stroke-linejoin="round" opacity="${x.on ? 1 : 0.75}"/>` : ""}
<path d="M${cx - 11} ${y - 5} L${cx + 9} ${y - 5}" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;
  }
  function mug0(x, cx) {
    return `${shadow(x, cx, 148, 11, 2)}<path d="M${cx + 6} 136 C${cx + 13} 136 ${cx + 13} 145 ${cx + 6} 144" fill="none" stroke="#c9c1d6" stroke-width="2.4"/>
<path d="M${cx - 7} 133 V146 A7 2 0 0 0 ${cx + 7} 146 V133 Z" fill="${F(x, "cer")}"/><ellipse cx="${cx}" cy="133" rx="7" ry="2" fill="#efe9e0"/><ellipse cx="${cx}" cy="133.3" rx="5.6" ry="1.4" fill="#5a3824"/>`;
  }

  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const bed = (...a) => BG(bed0(...a));
  const stand = (...a) => BG(stand0(...a));
  const books = (...a) => BG(books0(...a));
  const glasses = (...a) => BG(glasses0(...a));
  const phone = (...a) => BG(phone0(...a));
  const mug = (...a) => BG(mug0(...a));
  const icons = [
    {
      id: "gourd", name: "Ceramic gourd", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.27, r: 1 }, cast: "both",
      render(o) {
        const x = C(o), dx = 14;
        const g = "M90 148 L110 148 C118 146 124 138 124 126 C124 114 114 108 108 104 C114 100 113 88 105 84 L105 79 L95 79 L95 84 C87 88 86 100 92 104 C86 108 76 114 76 126 C76 138 82 146 90 148 Z";
        const ex = lg(x.u, "glz", 0, 0, 1, 0, st(0, "#2f5249") + st(0.3, "#a9d3c3") + st(0.58, "#6fa392") + st(1, "#264640"));
        return svg(x, `${bed(x, { w: 42, col: "#7d86a8", style: "tufted", lit: 1 })}
${stand(x, { m: "walnut", x0: 46, x1: 192, cx: 100 + dx, rx: 56 })}
${books(x, 172, ["#3f5f7a", "#8e3b46", "#d8c9a6"])}
${T(dx, `${beam(x, "M62 34 L34 2 L166 2 L138 34 Z", "up", 0.5)}${beam(x, "M63 74 L42 147 L158 147 L137 74 Z", "dn", 0.3)}
${halo(x, 100, 56, 64, 0.55, 52)}
${shadow(x, 100, 148, 22, 3)}
<path d="${g}" fill="url(#${x.u}-glz)"/><path d="${g}" fill="${F(x, "gloss")}" opacity=".6"/>
${hi("M84 115 C81 124 82 134 88 141", 0.55, 1.8)}${hi("M92 90 C90 95 91 99 93 101", 0.5, 1.2)}
<path d="M90 147.6 L110 147.6" stroke="#18302a" stroke-width="1.4" opacity=".7"/>
<rect x="95.5" y="70" width="9" height="10" rx="1.5" fill="${F(x, "brass")}"/>
${shadeBody(x, 100, 34, 40, 74, 40, F(x, "c2f"), { ryt: 5.5, ryb: 5.5 })}
<circle cx="100" cy="31" r="3" fill="${F(x, "brass")}"/>${hi("M62 36 L62 72", 0.16, 3)}`)}`, ex);
      }
    },
    {
      id: "candlestick", name: "Brass candlestick", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.27, r: 1 }, cast: "both",
      render(o) {
        const x = C(o), dx = -10;
        return svg(x, `${stand(x, { m: "white", cx: 90, rx: 58 })}
${glasses(x, 150, 146)}
${T(dx, `${beam(x, "M80 28 L60 2 L140 2 L120 28 Z", "up", 0.55)}${beam(x, "M58 82 L38 147 L162 147 L142 82 Z", "dn", 0.3)}
${halo(x, 100, 54, 58, 0.55, 50)}
${shadow(x, 100, 148, 20, 3)}
${disk(x, 100, 148, 17, 4, "brass")}
<path d="M88 144 C92 141 96 139 96 134 L104 134 C104 139 108 141 112 144 Z" fill="${F(x, "brass")}"/>
<rect x="96.8" y="92" width="6.4" height="42" fill="${F(x, "brass")}"/>
${[[128, 6, 2.4], [110, 5.4, 2], [96, 6.4, 2.4]].map((r) => `<ellipse cx="100" cy="${r[0]}" rx="${r[1]}" ry="${r[2]}" fill="${F(x, "brass")}"/><ellipse cx="98.6" cy="${r[0] - 0.6}" rx="${f1(r[1] * 0.4)}" ry=".7" fill="#fff" opacity=".55"/>`).join("")}
<path d="M90 92 L110 92 L106 86 L94 86 Z" fill="${F(x, "brass")}"/>
${hi("M98.4 100 V132", 0.55, 0.9)}
<rect x="96" y="80" width="8" height="7" rx="1.4" fill="#e9e3d6"/>
${shadeBody(x, 100, 28, 21, 82, 43, x.c2, { ribs: 22, ribW: 1.3, ryt: 3.2, ryb: 6.4 })}
<circle cx="100" cy="25.5" r="2.4" fill="${F(x, "brass")}"/>`)}`);
      }
    },
    {
      id: "glass-jug", name: "Glass jug", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.29, r: 1 }, cast: "both",
      render(o) {
        const x = C(o), dx = 14;
        const jug = "M84 148 L116 148 C126 145 128 136 128 124 C128 108 118 100 108 96 L108 88 L92 88 L92 96 C82 100 72 108 72 124 C72 136 74 145 84 148 Z";
        return svg(x, `${bed(x, { w: 44, col: "#b8a58f", duv: "#6f8fb0", style: "channel", lit: 1 })}
${stand(x, { m: "oak", x0: 48, x1: 192, cx: 100 + dx, rx: 56 })}
${phone(x, 170, true)}
${T(dx, `${beam(x, "M64 38 L38 2 L162 2 L136 38 Z", "up", 0.5)}${beam(x, "M64 80 L44 147 L156 147 L136 80 Z", "dn", 0.3)}
${halo(x, 100, 60, 62, 0.55, 50)}
${shadow(x, 100, 148, 24, 3)}
<path d="${jug}" fill="${x.on ? x.c : "#dfe9f4"}" fill-opacity="${x.on ? x.k(0.16) : 0.08}"/>
${x.on ? `<ellipse cx="100" cy="128" rx="20" ry="14" fill="${F(x, "halo")}" opacity="${x.k(0.4)}"/>` : ""}
<path d="M100 88 C100 104 92 118 96 132 C99 142 106 144 112 147" fill="none" stroke="#e8e2d8" stroke-opacity=".7" stroke-width="1.2"/>
<path d="${jug}" fill="none" stroke="#e4eef8" stroke-opacity=".55" stroke-width="1.6"/>
<path d="M86 146 C80 142 78 136 78 124 C78 112 86 104 94 101" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>
<path d="M122 112 C125 118 125 128 123 136" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/>
<ellipse cx="100" cy="145.6" rx="15" ry="2" fill="#fff" fill-opacity=".25"/>
<rect x="91" y="86" width="18" height="4" rx="1.4" fill="${F(x, "brass")}"/><rect x="96" y="77" width="8" height="9" rx="1.4" fill="${F(x, "brass")}"/>
${shadeBody(x, 100, 38, 38, 80, 38, F(x, "c2f"), { ryt: 5.2, ryb: 5.2, lining: "#57524c" })}
${hi("M64 40 L64 78", 0.18, 3)}<circle cx="100" cy="35" r="2.6" fill="${F(x, "brass")}"/>`)}`);
      }
    },
    {
      id: "mushroom", name: "Opal mushroom", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.4, r: 1.1 }, cast: "around",
      render(o) {
        const x = C(o), dx = -10;
        const cap = "M54 98 C54 66 76 48 100 48 C124 48 146 66 146 98 C124 103 76 103 54 98 Z";
        const stem = "M86 148 C90 132 93 116 93 100 L107 100 C107 116 110 132 114 148 Z";
        return svg(x, `${stand(x, { m: "black", cx: 90, rx: 64 })}
${books(x, 156, ["#d4c3a1", "#3a6b5c", "#a8475a"])}
${T(dx, `${beam(x, "M58 100 L30 147 L170 147 L142 100 Z", "dn", 0.4)}${halo(x, 100, 82, 84, 0.65, 66)}
${shadow(x, 100, 148, 22, 3)}
<ellipse cx="100" cy="147" rx="20" ry="3.4" fill="${x.on ? x.lite : "#d8d2c9"}"/>
${opal(x, stem, 0.6)}${hi("M97 104 C97 120 94 136 91 145", 0.5, 1.4)}
<ellipse cx="100" cy="99" rx="46" ry="4.4" fill="${x.on ? x.c : "#8e877e"}" opacity="${x.on ? x.k(0.9) : 1}"/>
${opal(x, cap, 0.8)}
${hi("M64 82 C70 64 84 55 98 53", 0.6, 2.4)}`)}`);
      }
    },
    {
      id: "crystal", name: "Crystal touch", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.56, y: 0.3, r: 0.9 }, cast: "both",
      render(o) {
        const x = C(o), dx = 12;
        const glassF = x.on ? x.H.mix("#dfe8f2", x.c, 0.35) : "#dfe8f2";
        let facets = "";
        for (let i = 0; i < 6; i++) { const y = 86 + i * 5; facets += `<path d="M86 ${y} L100 ${y - 2.5} L114 ${y}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`; }
        const sp = x.on ? [[93, 96, 1.5], [107, 104, 1.2], [96, 124, 1.3], [104, 140, 1.1], [90, 108, 1]].map((p, i) => `<g opacity="${x.k(0.9)}"><path class="${P}twinkle" style="animation-delay:-${i * 0.7}s" d="M${p[0]} ${p[1] - p[2] * 2.4} L${p[0] + p[2] * 0.5} ${p[1]} L${p[0]} ${p[1] + p[2] * 2.4} L${p[0] - p[2] * 0.5} ${p[1]} Z M${p[0] - p[2] * 2.4} ${p[1]} L${p[0]} ${p[1] - p[2] * 0.5} L${p[0] + p[2] * 2.4} ${p[1]} L${p[0]} ${p[1] + p[2] * 0.5} Z" fill="#fff"/></g>`).join("") : "";
        return svg(x, `${bed(x, { w: 40, col: "#e6ddd0", duv: "#b9a6c9", style: "tufted", lit: 1 })}
${stand(x, { m: "white", x0: 44, x1: 192, cx: 100 + dx, rx: 52 })}
${glasses(x, 168, 146)}
${T(dx, `${beam(x, "M80 46 L60 4 L140 4 L120 46 Z", "up", 0.45)}${beam(x, "M66 82 L46 147 L154 147 L134 82 Z", "dn", 0.3)}
${halo(x, 100, 64, 52, 0.55, 44)}${x.on ? `<ellipse cx="100" cy="112" rx="26" ry="30" fill="${F(x, "halo")}" opacity="${x.k(0.35)}"/>` : ""}
${shadow(x, 100, 148, 18, 3)}
<path d="M83 148 L87 139 L113 139 L117 148 Z" fill="${glassF}" fill-opacity=".55"/><path d="M87 139 L95 148 L105 148 L113 139" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".7"/>
<path d="M83 148 L117 148" stroke="#9fb0c4" stroke-width="1"/><path d="M87 139 L113 139" stroke="#fff" stroke-opacity=".8" stroke-width=".8"/>
<rect x="94" y="118" width="12" height="21" fill="${glassF}" fill-opacity=".5"/>
<rect x="94" y="118" width="3" height="21" fill="#fff" opacity=".45"/><rect x="101" y="118" width="2" height="21" fill="#fff" opacity=".25"/><rect x="104" y="118" width="2" height="21" fill="#5d6f86" opacity=".35"/>
<ellipse cx="100" cy="118" rx="9" ry="2" fill="${F(x, "steel")}"/>
<path d="M100 80 L116 90 L116 108 L100 118 L84 108 L84 90 Z" fill="${glassF}" fill-opacity=".55"/>
<path d="M100 80 L92 99 L100 118 L108 99 Z" fill="#fff" opacity=".28"/><path d="M84 90 L92 99 L84 108 Z" fill="#fff" opacity=".42"/><path d="M116 90 L108 99 L116 108 Z" fill="#4c5d74" opacity=".35"/>
<path d="M100 80 L116 90 L116 108 L100 118 L84 108 L84 90 Z M84 99 H116" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>${facets}
${sp}
<rect x="96.5" y="74" width="7" height="7" rx="1.4" fill="${F(x, "steel")}"/>
${shadeBody(x, 100, 46, 22, 82, 34, x.c2, { ryt: 3.2, ryb: 5, trim: "#d8d2c8", trimW: 1.2 })}
<circle cx="100" cy="43.5" r="2.4" fill="${F(x, "steel")}"/>`)}`);
      }
    },
    {
      id: "edison", name: "Edison cylinder", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.47, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), dx = -10;
        const bulb = "M100 66 C108 66 114 72 114 82 C114 92 108 98 106 106 L106 118 L94 118 L94 106 C92 98 86 92 86 82 C86 72 92 66 100 66 Z";
        const fil = `<path d="M96 110 L95 84 C95 78 105 78 105 84 L104 110 M95 90 C97 86 103 86 105 90 M95 96 C97 92 103 92 105 96" fill="none" stroke="${x.on ? "#fff" : "#8a6a3a"}" stroke-width="${x.on ? 1.2 : 0.8}" stroke-linecap="round"/>`;
        return svg(x, `${stand(x, { m: "walnut", cx: 90, rx: 56 })}
${glasses(x, 152, 146)}
${T(dx, `${halo(x, 100, 88, 60, 0.75, 62)}
${shadow(x, 100, 148, 30, 3)}
<path d="M72 148 L128 148 L128 134 L72 134 Z" fill="${F(x, "wood")}"/><path d="M72 134 L128 134 L124 129 L76 129 Z" fill="${F(x, "woodv")}"/>
<path d="M76 140 C90 138 108 142 124 139 M76 144 C92 143 104 146 126 144" fill="none" stroke="#3e230e" stroke-opacity=".35" stroke-width=".6"/>
${x.on ? `<ellipse cx="100" cy="131.5" rx="22" ry="2.6" fill="${F(x, "pool")}" opacity="${x.k(1)}"/>` : ""}
<rect x="81" y="56" width="38" height="76" fill="${x.on ? x.c : "#dfe9f4"}" fill-opacity="${x.on ? x.k(0.12) : 0.06}"/>
<rect x="93" y="117" width="14" height="14" rx="1.5" fill="${F(x, "brass")}"/><rect x="93" y="121" width="14" height="1" fill="#5e3d12" opacity=".6"/><rect x="93" y="125" width="14" height="1" fill="#5e3d12" opacity=".6"/>
<path d="${bulb}" fill="${x.on ? F(x, "fill") : "#fff"}" fill-opacity="${x.on ? x.k(1) : 0.1}" stroke="#fff" stroke-opacity=".4" stroke-width=".9"/>
${x.on ? `<path d="${bulb}" fill="${x.c}" opacity="${x.k(0.25)}"/>` : ""}${fil}
${hi("M90 76 C89 82 90 88 92 92", 0.55, 1.2)}
<rect x="81" y="56" width="38" height="76" fill="${F(x, "cyl")}" opacity=".55"/>
<path d="M85 58 V130" stroke="#fff" stroke-opacity=".55" stroke-width="2.2"/><path d="M114 58 V130" stroke="#fff" stroke-opacity=".2" stroke-width="1.2"/>
<path d="M81 56 V132 M119 56 V132" stroke="#e4eef8" stroke-opacity=".4" stroke-width="1"/>
<rect x="79" y="50" width="42" height="7" rx="1.5" fill="${F(x, "brass")}"/><rect x="79" y="50" width="42" height="1.2" fill="#fff" opacity=".4"/>
<circle cx="100" cy="47" r="3" fill="${F(x, "brass")}"/>`)}`);
      }
    },
    {
      id: "tripod", name: "Wood tripod", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.28, r: 1 }, cast: "both",
      render(o) {
        const x = C(o), dx = 14;
        const leg = (x2, y2, w, col) => `<path d="M${100 - w / 2} 82 L${x2 - w * 0.55} ${y2} L${x2 + w * 0.55} ${y2} L${100 + w / 2} 82 Z" fill="${col}"/><path d="M${100 - w / 4} 82 L${x2 - w * 0.3} ${y2}" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`;
        return svg(x, `${bed(x, { w: 44, col: "#9b8a7a", duv: "#c98f5f", style: "wood", lit: 1 })}
${stand(x, { m: "sage", x0: 48, x1: 192, cx: 100 + dx, rx: 54 })}
${mug(x, 172)}
${T(dx, `${beam(x, "M68 36 L44 2 L156 2 L132 36 Z", "up", 0.5)}${beam(x, "M68 78 L48 147 L152 147 L132 78 Z", "dn", 0.32)}
${halo(x, 100, 58, 58, 0.55, 48)}
${shadow(x, 100, 148, 30, 3)}
${leg(101, 145, 2.6, "#7a4c27")}${leg(74, 148, 3.4, "#b5834f")}${leg(126, 148, 3.4, "#a87444")}
<circle cx="100" cy="86" r="3.6" fill="${F(x, "brass")}"/><circle cx="99" cy="85" r="1.2" fill="#fff" opacity=".5"/>
${shadeBody(x, 100, 36, 32, 78, 32, F(x, "c2f"), { ryt: 4.6, ryb: 4.6 })}
${hi("M70 38 L70 76", 0.16, 3)}`)}`);
      }
    },
    {
      id: "rattan", name: "Rattan dome", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.4, r: 1 }, cast: "down",
      render(o) {
        const x = C(o), dx = -10;
        const dome = "M52 98 C52 64 74 46 100 46 C126 46 148 64 148 98 Z";
        const ex = `<pattern id="${x.u}-wv" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M-1 -1 L7 7 M7 -1 L-1 7" stroke="${x.on ? x.H.mix(x.c2, "#ffd8a0", 0.35) : x.H.shade(x.c2, 0.04)}" stroke-width="2.3"/><path d="M-1 -1 L7 7" stroke="#f0c48a" stroke-opacity=".35" stroke-width=".7"/></pattern>
${lg(x.u, "rat", 0, 0, 1, 0, st(0, x.H.shade(x.c2, -0.45)) + st(0.35, x.c2) + st(1, x.H.shade(x.c2, -0.55)))}`;
        const dots = x.on ? [[30, 62], [22, 96], [44, 34], [170, 60], [180, 92], [156, 30], [66, 22], [134, 20], [34, 128], [168, 124]].map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${1.2 + (i % 3) * 0.5}" fill="${x.hot}" opacity="${x.k(0.45)}"/>`).join("") : "";
        return svg(x, `${stand(x, { m: "oak", cx: 90, rx: 66 })}
${phone(x, 156, false)}
${T(dx, `${beam(x, "M54 99 L28 147 L172 147 L146 99 Z", "dn", 0.45)}${halo(x, 100, 74, 80, 0.5, 60)}${dots}
${shadow(x, 100, 148, 22, 3)}
${disk(x, 100, 148, 18, 4, "blk")}<rect x="98" y="98" width="4" height="46" fill="${F(x, "blk")}"/>
${x.on ? `<ellipse cx="100" cy="106" rx="34" ry="12" fill="${F(x, "halo")}" opacity="${x.k(0.7)}"/>` : ""}
<path d="${dome}" fill="${x.on ? F(x, "lopal") : F(x, "rat")}"/>
<path d="${dome}" fill="url(#${x.u}-wv)"/>
<path d="${dome}" fill="${F(x, "cyl")}" opacity="${x.on ? 0.55 : 1}"/>
<path d="${dome}" fill="none" stroke="#5a3a1a" stroke-width="1.2"/>
${opening(x, 100, 98, 48, 5, "#3a240f")}
<path d="M52 98 A48 5 0 0 0 148 98" fill="none" stroke="#6e4520" stroke-width="2.4"/>
<ellipse cx="100" cy="47" rx="8" ry="2.4" fill="#6e4520"/>
${hi("M62 82 C64 68 74 56 88 51", 0.22, 3)}`)}`, ex);
      }
    },
    {
      id: "paper", name: "Paper globe", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.45, r: 1.1 }, cast: "around",
      render(o) {
        const x = C(o), dx = 14;
        let ribs = "";
        for (let i = -3; i <= 3; i++) { const yy = 90 + i * 9.5, w = Math.sqrt(Math.max(0, 36 * 36 - (i * 9.5) ** 2)); ribs += `<path d="M${f1(100 - w)} ${f1(yy)} Q100 ${f1(yy + 5 - Math.abs(i) * 0.4)} ${f1(100 + w)} ${f1(yy)}" fill="none" stroke="${x.on ? x.H.rgba(x.deep, 0.45) : "rgba(120,100,80,.3)"}" stroke-width="1"/>`; }
        return svg(x, `${bed(x, { w: 44, col: "#c7a6a0", duv: "#a96f78", style: "channel", lit: 1, ly: 100 })}
${stand(x, { m: "white", x0: 48, x1: 192, cx: 100 + dx, rx: 54, kk: 0.8 })}
${books(x, 172, ["#c78f9a", "#4b6a8c", "#ece2cc"])}
${T(dx, `${halo(x, 100, 90, 78, 0.65, 72)}
${shadow(x, 100, 148, 18, 3)}
${disk(x, 100, 148, 14, 6, "wood")}<rect x="97" y="124" width="6" height="18" fill="${F(x, "wood")}"/>
<circle cx="100" cy="90" r="36" fill="${x.on ? F(x, "c2lo") : F(x, "c2c")}"/>
${x.on ? `<circle cx="100" cy="90" r="36" fill="${F(x, "c2c")}" opacity="${(0.62 - 0.55 * x.L).toFixed(2)}"/>` : ""}
${ribs}
<path d="M80 70 C88 82 84 100 90 114 M112 64 C108 84 116 100 110 120" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>
<circle cx="100" cy="90" r="36" fill="${F(x, "gloss")}" opacity=".45"/>
<circle cx="100" cy="90" r="36" fill="${F(x, "cyl")}" opacity="${x.on ? 0.35 : 0.8}"/>
<ellipse cx="100" cy="55" rx="6" ry="1.8" fill="${x.on ? x.deep : "#8e877e"}"/>`)}`);
      }
    },
    {
      id: "tulip", name: "Tulip lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.3, r: 1 }, cast: "up",
      render(o) {
        const x = C(o), dx = -10;
        const cup = "M68 54 C68 78 82 94 100 96 C118 94 132 78 132 54 Z";
        return svg(x, `${stand(x, { m: "walnut", cx: 90, rx: 46, kk: 0.6 })}
${mug(x, 156)}
${T(dx, `${beam(x, "M68 54 L40 2 L160 2 L132 54 Z", "up", 0.6)}${halo(x, 100, 64, 62, 0.65, 50)}
${shadow(x, 100, 148, 22, 3)}
${disk(x, 100, 148, 19, 5, "wood")}
<path d="M98 143 C98 130 97 112 96 98 L104 98 C103 112 102 130 102 143 Z" fill="${F(x, "brass")}"/>
${hi("M99 102 C99.4 116 99.6 130 99.6 140", 0.5, 0.8)}
<ellipse cx="100" cy="97" rx="6" ry="2.2" fill="${F(x, "brass")}"/>
${opal(x, cup, 0.8)}
${hi("M74 62 C76 76 84 86 94 90", 0.55, 2)}
<ellipse cx="100" cy="54" rx="32" ry="6" fill="${x.on ? x.hot : "#b8b1a7"}"/>
${x.on ? `<ellipse cx="100" cy="54.6" rx="22" ry="3.6" fill="#fff" opacity="${x.k(0.9)}"/>` : `<ellipse cx="100" cy="55" rx="26" ry="4" fill="#8e877e"/>`}
<ellipse cx="100" cy="54" rx="32" ry="6" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2"/>`)}`);
      }
    },
    {
      id: "tiffany", name: "Stained glass", colors: ["#f0a93b", "#d9534f", "#4a90c2", "#7fb069", "#b197fc"], picker: true, colorLabel: "Glass", glow: { x: 0.45, y: 0.36, r: 1.1 }, cast: "down",
      render(o) {
        const x = C(o), H = x.H, dx = -10;
        const dome = "M44 96 C46 62 72 40 100 40 C128 40 154 62 156 96 Z";
        const wd = (y) => 112 * Math.pow(Math.max(0, (y - 39) / 57), 0.5) / 2;
        const pal = [x.c, x.c, "#4f9a5e", x.c, "#c2384a", x.c, "#3f7f9e", x.c];
        const tint = (c) => x.on ? H.mix(c, "#ffffff", 0.18 + 0.12 * x.L) : H.shade(c, -0.55);
        const bands = [[40, 58], [58, 76], [76, 96]], N = 9;
        let cells = "";
        bands.forEach((bd, bi) => {
          for (let j = 0; j < N; j++) {
            const a0 = j / N - 0.5, a1 = (j + 1) / N - 0.5, w0 = wd(bd[0]), w1 = wd(bd[1]);
            const col = pal[(j * 3 + bi * 5) % pal.length];
            cells += `<path d="M${f1(100 + a0 * 2 * w0)} ${bd[0]} L${f1(100 + a1 * 2 * w0)} ${bd[0]} L${f1(100 + a1 * 2 * w1)} ${bd[1]} L${f1(100 + a0 * 2 * w1)} ${bd[1]} Z" fill="${tint(col)}" stroke="#24180c" stroke-width="1.3" stroke-linejoin="round"/>`;
          }
        });
        let skirt = "";
        for (let j = 0; j < 12; j++) {
          const a = 44 + j * (112 / 12), b = a + 112 / 12, col = j % 2 ? "#4f9a5e" : x.c;
          skirt += `<path d="M${f1(a)} 96 L${f1(b)} 96 L${f1(b - 0.6)} ${j % 3 === 1 ? 106 : 103} L${f1(a + 0.6)} ${j % 3 === 1 ? 106 : 103} Z" fill="${tint(col)}" stroke="#24180c" stroke-width="1.2"/>`;
        }
        const ex = `<clipPath id="${x.u}-dome"><path d="${dome}"/></clipPath>
${rg(x.u, "tg1", "", st(0, "#5fd07a", 0.8) + st(1, "#5fd07a", 0))}${rg(x.u, "tg2", "", st(0, "#ff5a6e", 0.8) + st(1, "#ff5a6e", 0))}
${rg(x.u, "tglow", 'cx=".5" cy=".95" r=".7"', st(0, "#fff", 0.75) + st(0.5, x.hot, 0.25) + st(1, x.hot, 0))}`;
        const extra = x.on ? `<ellipse cx="62" cy="62" rx="44" ry="38" fill="url(#${x.u}-tg1)" opacity="${x.k(0.35)}"/><ellipse cx="140" cy="76" rx="40" ry="34" fill="url(#${x.u}-tg2)" opacity="${x.k(0.3)}"/>` : "";
        return svg(x, `${stand(x, { m: "black", cx: 90, rx: 62 })}
${books(x, 156, ["#5a3a28", "#2f4f3e", "#7a2a34"])}
${T(dx, `${beam(x, "M48 104 L28 147 L172 147 L152 104 Z", "dn", 0.4)}${halo(x, 100, 72, 80, 0.6, 62)}${extra}
${shadow(x, 100, 148, 24, 3)}
<ellipse cx="100" cy="146" rx="22" ry="4" fill="${F(x, "bronze")}"/>
<path d="M78 146 C80 136 92 132 96 128 L104 128 C108 132 120 136 122 146 Z" fill="${F(x, "bronze")}"/>
<path d="M84 142 C88 136 94 134 97 131 M116 142 C112 136 106 134 103 131" fill="none" stroke="#e0b070" stroke-opacity=".45" stroke-width=".8"/>
<rect x="96.8" y="100" width="6.4" height="29" fill="${F(x, "bronze")}"/>
${[112, 120].map((y) => `<ellipse cx="100" cy="${y}" rx="5" ry="1.8" fill="${F(x, "bronze")}"/>`).join("")}
<path d="M112 104 V120 M88 104 V116" stroke="#b8925a" stroke-width=".8" stroke-dasharray="1 1"/><circle cx="112" cy="121.5" r="1.6" fill="${F(x, "brass")}"/><circle cx="88" cy="117.5" r="1.6" fill="${F(x, "brass")}"/>
<g clip-path="url(#${x.u}-dome)">${cells}${x.on ? `<path d="${dome}" fill="url(#${x.u}-tglow)" opacity="${x.k(0.6)}"/>` : ""}</g>
<path d="${dome}" fill="${F(x, "cyl")}" opacity=".55"/>
${skirt}
<path d="M44 96 L156 96" stroke="#24180c" stroke-width="1.8"/>
${x.on ? `<ellipse cx="100" cy="104" rx="44" ry="3" fill="${F(x, "fill")}" opacity="${x.k(0.7)}"/>` : ""}
<path d="${dome}" fill="${F(x, "gloss")}" opacity=".45"/>
${hi("M56 80 C60 62 74 50 90 45", 0.35, 2)}
<ellipse cx="100" cy="41" rx="7" ry="2.4" fill="${F(x, "bronze")}"/><circle cx="100" cy="37" r="2.6" fill="${F(x, "bronze")}"/>`)}`, ex);
      }
    },
    {
      id: "salt", name: "Salt lamp", colors: ["#ff9a4a", "#ffb877", "#ff7d5e", "#ffd8a8", "#ffc9de"], picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.5, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), H = x.H, dx = 14;
        const rock = "M80 132 L73 116 L75 96 L84 78 L95 66 L108 62 L118 72 L127 90 L130 110 L126 126 L118 133 Z";
        const ex = rg(x.u, "salt", 'cx=".48" cy=".6" r=".62"', x.on ? st(0, "#fff8ee") + st(0.35, x.hot) + st(0.75, x.c) + st(1, x.deep) : st(0, "#e4a283") + st(0.6, "#b86a4c") + st(1, "#6e3a28"));
        const facets = `<path d="M84 78 L96 96 L95 66 M96 96 L118 72 M96 96 L106 120 L130 110 M96 96 L75 96 M106 120 L80 132 M106 120 L118 133" fill="none" stroke="${x.on ? H.shade(x.c, -0.35) : "#5a2c1c"}" stroke-opacity=".45" stroke-width=".9"/>
<path d="M84 78 L95 66 L96 96 Z" fill="#fff" opacity=".16"/><path d="M118 72 L127 90 L130 110 L106 120 L96 96 Z" fill="#000" opacity=".12"/><path d="M75 96 L96 96 L106 120 L80 132 L73 116 Z" fill="#fff" opacity=".06"/>`;
        return svg(x, `${bed(x, { w: 44, col: "#5f6b8c", duv: "#c48a5a", style: "tufted", lit: 1, ly: 120 })}
${stand(x, { m: "cane", x0: 48, x1: 192, cx: 100 + dx, rx: 56, kk: 0.8 })}
${glasses(x, 170, 146)}
${T(dx, `${x.on ? `<g class="${P}salt"><ellipse cx="100" cy="100" rx="74" ry="66" fill="${F(x, "halo")}" opacity="${x.k(0.7)}"/></g>` : ""}
${shadow(x, 100, 148, 28, 3)}
<path d="M74 148 L126 148 L126 136 L74 136 Z" fill="${F(x, "wood")}"/><path d="M74 136 L126 136 L122 131 L78 131 Z" fill="${F(x, "woodv")}"/>
<path d="M78 141 C92 139 108 143 122 140" fill="none" stroke="#3e230e" stroke-opacity=".35" stroke-width=".6"/>
<path d="${rock}" fill="url(#${x.u}-salt)"/>
${x.on ? `<g class="${P}salt"><ellipse cx="100" cy="106" rx="18" ry="20" fill="#fff" opacity="${x.k(0.35)}"/></g>` : ""}
${facets}
<path d="M80 128 L76 114 L78 98" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" stroke-linecap="round"/>
<g fill="#fff" opacity="${x.on ? 0.5 : 0.3}"><circle cx="90" cy="86" r=".7"/><circle cx="112" cy="104" r=".6"/><circle cx="100" cy="118" r=".7"/><circle cx="84" cy="108" r=".5"/></g>`)}`, ex);
      }
    },
    {
      id: "sunrise", name: "Sunrise alarm", colors: ["#ffb35c", "#ffd8a8", "#fff1dc", "#ff8a5c", "#b197fc"], picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.46, r: 1.1 }, cast: "around",
      render(o) {
        const x = C(o), dx = 14;
        const ex = rg(x.u, "face", 'cx=".5" cy=".45" r=".55"', x.on ? st(0, "#fff") + st(0.45, x.hot) + st(1, x.c) : st(0, "#f7f5f1") + st(0.7, "#dcd8d1") + st(1, "#b4afa7")) +
          rg(x.u, "shell", 'cx=".4" cy=".35" r=".7"', st(0, "#ffffff") + st(0.7, "#e2dfe8") + st(1, "#9a96a6"));
        return svg(x, `${bed(x, { w: 44, col: "#8a7aa8", duv: "#d39a6a", style: "channel", lit: 1, ly: 108 })}
${stand(x, { m: "navy", x0: 48, x1: 192, cx: 100 + dx, rx: 60, kk: 0.8 })}
${phone(x, 170, true)}
${T(dx, `${x.on ? `<g class="${P}dawn"><ellipse cx="100" cy="92" rx="82" ry="70" fill="${F(x, "halo")}" opacity="${x.k(0.75)}"/></g>` : ""}
${shadow(x, 100, 148, 30, 3)}
<path d="M70 148 C70 136 78 132 100 132 C122 132 130 136 130 148 Z" fill="url(#${x.u}-shell)"/>
<rect x="85" y="137" width="30" height="9" rx="2" fill="#15161b"/>
<text x="100" y="144.4" text-anchor="middle" font-family="Consolas,Menlo,monospace" font-size="7.4" font-weight="700" fill="${x.on ? x.hot : "#ff9a5c"}" opacity="${x.on ? 1 : 0.8}">6:30</text>
<circle cx="100" cy="88" r="44" fill="url(#${x.u}-shell)"/>
<circle cx="100" cy="88" r="44" fill="${F(x, "cyl")}" opacity=".45"/>
<circle cx="100" cy="88" r="36" fill="#2a2834"/>
<circle cx="100" cy="88" r="34" fill="url(#${x.u}-face)"/>
${x.on ? `<g class="${P}ring"><circle cx="100" cy="88" r="34" fill="none" stroke="${x.c}" stroke-width="6" opacity="${x.k(0.55)}"/><circle cx="100" cy="88" r="34" fill="none" stroke="#fff" stroke-width="1.6" opacity="${x.k(0.9)}"/></g>
<circle cx="100" cy="88" r="24" fill="#fff" opacity="${x.k(0.4)}"/>` : `<circle cx="100" cy="88" r="34" fill="none" stroke="#c8c3bb" stroke-width="2"/>`}
${hi("M66 66 C72 54 84 46 98 44", 0.8, 2.2)}
<rect x="84" y="41.5" width="9" height="3" rx="1.5" fill="#cfcbd6"/><rect x="107" y="41.5" width="9" height="3" rx="1.5" fill="#cfcbd6"/>`)}`, ex);
      }
    },
    {
      id: "smart-globe", name: "Smart globe", colors: RGB, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.47, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), dx = -10;
        const bulb = "M100 76 C110 76 117 83 117 93 C117 101 111 105 109 112 L91 112 C89 105 83 101 83 93 C83 83 90 76 100 76 Z";
        return svg(x, `${stand(x, { m: "oak", cx: 90, rx: 58 })}
${glasses(x, 154, 146)}
${T(dx, `${halo(x, 100, 96, 72, 0.75, 66)}
${shadow(x, 100, 148, 24, 3)}
${disk(x, 100, 148, 22, 9, "cer")}
${x.on ? `<ellipse cx="100" cy="144" rx="20" ry="2.6" fill="none" stroke="${x.c}" stroke-width="2" opacity="${x.k(1)}"/><ellipse cx="100" cy="144" rx="20" ry="2.6" fill="none" stroke="#fff" stroke-width=".6" opacity="${x.k(0.9)}"/>` : `<ellipse cx="100" cy="144" rx="20" ry="2.6" fill="none" stroke="#b5b0a8" stroke-width="1.2"/>`}
<path d="M90 112 L110 112 L108 124 L92 124 Z" fill="${F(x, "steel")}"/>
${[115, 118, 121].map((y) => `<path d="M91 ${y} L109 ${y}" stroke="#5a6067" stroke-width=".7"/>`).join("")}
<path d="${bulb}" fill="${x.on ? F(x, "fill") : F(x, "opal")}" opacity="${x.on ? x.k(1) : 1}"/>
${x.on ? `<path d="${bulb}" fill="${x.c}" opacity="${x.k(0.3)}"/>` : ""}
<circle cx="100" cy="94" r="34" fill="${x.on ? x.c : "#dfe9f4"}" fill-opacity="${x.on ? x.k(0.12) : 0.07}"/>
<circle cx="100" cy="94" r="34" fill="${F(x, "gloss")}" opacity=".5"/>
<circle cx="100" cy="94" r="34" fill="none" stroke="#e4eef8" stroke-opacity=".5" stroke-width="1.3"/>
${hi("M74 76 C80 66 90 61 100 60", 0.7, 2.2)}${hi("M128 104 C126 112 120 118 114 121", 0.3, 1.2)}
<path d="M86 125 L114 125 L112 134 L88 134 Z" fill="#e7e2da"/><rect x="86" y="124" width="28" height="2" rx="1" fill="#fff" opacity=".7"/>`)}`);
      }
    },
    {
      id: "moon", name: "Moon lamp", colors: ["#fff1dc", "#ffd8a8", "#eef6ff", "#b197fc", "#ffc9de"], picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.43, r: 1.1 }, cast: "around",
      render(o) {
        const x = C(o), H = x.H, dx = 14;
        const base = x.on ? x.hot : "#d4d1ca", mid = x.on ? x.lite : "#a9a59d", dk = x.on ? H.shade(x.c, -0.35) : "#5e5a55";
        const ex = rg(x.u, "moon", 'cx=".38" cy=".34" r=".72"', st(0, x.on ? "#fff" : "#ecebe6") + st(0.45, base) + st(0.82, mid) + st(1, dk)) +
          `<clipPath id="${x.u}-mc"><circle cx="100" cy="88" r="40"/></clipPath>`;
        const cr = [[84, 72, 6], [112, 66, 4], [118, 96, 7], [92, 104, 5], [74, 92, 3.4], [104, 84, 3], [126, 78, 3], [100, 118, 4]];
        const craters = cr.map((c) => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${dk}" opacity=".32"/><path d="M${c[0] - c[2] * 0.8} ${f1(c[1] + c[2] * 0.4)} A${c[2]} ${c[2]} 0 0 0 ${f1(c[0] + c[2] * 0.6)} ${f1(c[1] + c[2] * 0.8)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".9"/>`).join("");
        return svg(x, `${bed(x, { w: 44, col: "#3f4a6e", duv: "#8a96c4", style: "tufted", lit: 1, ly: 106 })}
${stand(x, { m: "black", x0: 48, x1: 192, cx: 100 + dx, rx: 58, kk: 0.75 })}
${books(x, 172, ["#d8c9a6", "#2f3e64", "#9a6a3a"])}
${T(dx, `${halo(x, 100, 88, 78, 0.65, 70)}
${shadow(x, 100, 148, 22, 3)}
${disk(x, 100, 148, 16, 5, "wood")}
<path d="M72 112 C76 130 88 136 100 136 C112 136 124 130 128 112" fill="none" stroke="#5a3519" stroke-width="5" stroke-linecap="round"/>
<path d="M72 112 C76 130 88 136 100 136 C112 136 124 130 128 112" fill="none" stroke="#c08a54" stroke-width="2.4" stroke-linecap="round"/>
<rect x="97.5" y="134" width="5" height="10" fill="${F(x, "wood")}"/>
<circle cx="100" cy="88" r="40" fill="url(#${x.u}-moon)"/>
<g clip-path="url(#${x.u}-mc)"><path d="M70 70 C80 62 96 64 100 76 C104 88 88 96 78 92 C68 88 64 78 70 70 Z M106 100 C116 96 132 102 130 114 C128 124 112 124 106 116 C102 110 100 104 106 100 Z" fill="${dk}" opacity=".18"/>${craters}
<circle cx="112" cy="100" r="40" fill="none" stroke="#000" stroke-opacity="${x.on ? 0.08 : 0.18}" stroke-width="12"/></g>
${hi("M72 66 C78 56 88 50 98 49", 0.6, 1.8)}`)}`, ex);
      }
    },
    {
      id: "usb", name: "USB charging", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.3, r: 1 }, cast: "both",
      render(o) {
        const x = C(o), dx = -10;
        return svg(x, `${stand(x, { m: "black", cx: 90, rx: 58 })}
${T(dx, `${beam(x, "M64 40 L38 2 L162 2 L136 40 Z", "up", 0.45)}${beam(x, "M64 82 L44 147 L156 147 L136 82 Z", "dn", 0.3)}
${halo(x, 100, 62, 60, 0.5, 48)}
${shadow(x, 100, 148, 22, 3)}
<path d="M84 148 L116 148 L116 100 L84 100 Z" fill="${F(x, "cer")}"/>
<path d="M116 148 L122 145 L122 98 L116 100 Z" fill="#8f8981"/><path d="M84 100 L90 97 L122 97 L116 100 Z" fill="#fbf9f5"/>
<rect x="89" y="128" width="8" height="3.4" rx=".6" fill="#26282e"/><rect x="90" y="129" width="6" height="1.2" fill="${x.on ? "#8fd0ff" : "#4a5260"}"/>
<rect x="101" y="128" width="8" height="3.4" rx="1.7" fill="#26282e"/><rect x="103" y="129.2" width="4" height="1" rx=".5" fill="${x.on ? "#8fd0ff" : "#4a5260"}"/>
<circle cx="100" cy="137" r="1.2" fill="#5ff0a0" opacity="${x.on ? 1 : 0.7}"/>
<path d="M105 130 C116 136 126 148 138 146 C148 144 150 146 156 146" fill="none" stroke="#e8e6ee" stroke-width="1.4"/>
${hi("M87 104 V145", 0.5, 1.6)}
<rect x="96" y="82" width="8" height="16" rx="1.5" fill="${F(x, "steel")}"/>
${shadeBody(x, 100, 40, 36, 82, 36, F(x, "c2f"), { ryt: 5, ryb: 5, lining: "#2e3038", lk: 0.6 })}
${hi("M66 42 L66 80", 0.12, 3)}<circle cx="100" cy="37.5" r="2.6" fill="${F(x, "steel")}"/>`)}
${phone(x, 160, true)}`);
      }
    },
    {
      id: "swing-arm", name: "Swing arm", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.64, y: 0.36, r: 1 }, cast: "down",
      render(o) {
        const x = C(o);
        return svg(x, `${bed(x, { w: 50, col: "#6e5a7e", duv: "#a58fbf", style: "channel", top: 74, lit: 1, ly: 124, lr: 30 })}
${stand(x, { m: "walnut", x0: 54, x1: 194, cx: 128, rx: 50 })}
<path d="M70 70 C68 96 74 120 72 142" fill="none" stroke="#2c2620" stroke-width="1.2"/>
${beam(x, "M108 84 L80 147 L176 147 L148 84 Z", "dn", 0.5)}${halo(x, 128, 80, 40, 0.75, 30)}
<rect x="62" y="36" width="12" height="30" rx="3" fill="${F(x, "brass")}"/><rect x="62" y="36" width="12" height="30" rx="3" fill="${F(x, "cyl")}" opacity=".6"/>
<circle cx="68" cy="51" r="3" fill="#5e3d12"/><circle cx="68" cy="51" r="1.6" fill="#d9b45e"/>
${tube("M72 50 L102 50", "brass", 3.6)}${tube("M102 50 L128 50 L128 58", "brass", 3.2)}
<circle cx="102" cy="50" r="3.6" fill="${F(x, "brass")}"/><circle cx="101" cy="49" r="1.2" fill="#fff" opacity=".6"/>
<rect x="123" y="56" width="10" height="7" rx="1.5" fill="${F(x, "brass")}"/>
<path d="M120 62 L136 62 C142 68 146 76 148 84 L108 84 C110 76 114 68 120 62 Z" fill="${F(x, "c2m")}"/>
<path d="M120 62 L136 62 C142 68 146 76 148 84 L108 84 C110 76 114 68 120 62 Z" fill="${F(x, "gloss")}" opacity=".6"/>
${hi("M117 68 C114 72 112 77 111 81", 0.6, 1.6)}
${opening(x, 128, 84, 20, 3.6, "#3a2a12")}
<g transform="translate(108 0)">
<path d="M40 148 L74 148 L72 141 L42 141 Z" fill="#f4efe4"/><path d="M57 141 L57 148" stroke="#b8ab92" stroke-width=".6"/>
<path d="M40 148 C48 146 52 147 57 148 C62 147 66 146 74 148" fill="none" stroke="#7a2a34" stroke-width="1.6"/>
<path d="M44 143.5 H54 M60 143.5 H70 M45 145.5 H53 M61 145.5 H69" stroke="#8e8577" stroke-width=".5"/>
${x.on ? `<path d="M42 141 L72 141 L74 148 L40 148 Z" fill="${x.c}" opacity="${x.k(0.18)}"/>` : ""}</g>`);
      }
    },
    {
      id: "cordless", name: "Cordless mushroom", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.45, y: 0.46, r: 0.9 }, cast: "down",
      render(o) {
        const x = C(o), dx = -10;
        const cap = "M68 94 C68 72 82 60 100 60 C118 60 132 72 132 94 Z";
        const ex = lg(x.u, "mt", 0, 0, 1, 0, st(0, "#3f5546") + st(0.3, "#a9c4ac") + st(0.6, "#73917a") + st(1, "#33473a")) +
          rg(x.u, "mts", 'cx=".38" cy=".3" r=".75"', st(0, x.H.shade(x.c2, 0.5)) + st(0.55, x.c2) + st(1, x.H.shade(x.c2, -0.5)));
        return svg(x, `${stand(x, { m: "white", cx: 90, rx: 50 })}
${phone(x, 152, false)}
${T(dx, `${beam(x, "M70 95 L46 147 L154 147 L130 95 Z", "dn", 0.55)}${halo(x, 100, 98, 50, 0.6, 34)}
${shadow(x, 100, 148, 22, 3)}
<path d="M80 148 C81 140 90 137 100 137 C110 137 119 140 120 148 Z" fill="url(#${x.u}-mts)"/>
<ellipse cx="100" cy="148" rx="20" ry="1.6" fill="#33473a"/>
${[94, 98, 102].map((cx, i) => `<circle cx="${cx + 2}" cy="143.6" r=".9" fill="${i < 2 || x.on ? "#5ff0a0" : "#4a6a54"}" opacity="${x.on || i < 2 ? 1 : 0.6}"/>`).join("")}
<rect x="97.6" y="94" width="4.8" height="44" fill="url(#${x.u}-mt)"/>
${opening(x, 100, 94, 32, 4.2, "#2c3a30")}
<path d="${cap}" fill="url(#${x.u}-mts)"/>
<path d="${cap}" fill="${F(x, "gloss")}" opacity=".55"/>
${hi("M76 82 C80 70 90 64 100 63", 0.65, 2)}
<path d="M68 94 A32 4.2 0 0 0 132 94" fill="none" stroke="#2c3a30" stroke-width="1"/>`)}`, ex);
      }
    },
    {
      id: "lava", name: "Lava lamp", colors: ["#ff9a4a", "#ff5fa2", "#7be0ff", "#b197fc", "#9dff7a"], picker: true, colorLabel: "Light", glow: { x: 0.57, y: 0.42, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), H = x.H, dx = 14;
        const glass = "M88 118 C84 102 86 86 90 70 L94 52 L106 52 L110 70 C114 86 116 102 112 118 Z";
        const wax = x.on ? H.shade(H.mix(x.c, "#ff3d6a", 0.3), -0.05) : H.shade(H.mix(x.c, "#ff3d6a", 0.3), -0.45);
        const ex = `<clipPath id="${x.u}-lv"><path d="${glass}"/></clipPath>
${lg(x.u, "liq", 0, 1, 0, 0, x.on ? st(0, x.hot, 0.95) + st(0.5, x.c, 0.55) + st(1, x.c, 0.3) : st(0, H.mix(x.c, "#2a2834", 0.6), 0.7) + st(1, H.mix(x.c, "#2a2834", 0.75), 0.5))}
${rg(x.u, "wax", 'cx=".42" cy=".6" r=".65"', st(0, x.on ? H.mix(wax, "#fff", 0.45) : wax) + st(0.6, wax) + st(1, H.shade(wax, -0.35)))}`;
        const blobs = x.on ? [[100, 112, 8, 7, 0], [96, 106, 5.4, 6, 3.5], [104, 100, 6.4, 7.4, 7], [99, 110, 4.4, 5, 10.5]].map((b) => `<g class="${P}blob" style="animation-delay:-${b[4]}s"><ellipse cx="${b[0]}" cy="${b[1]}" rx="${b[2]}" ry="${b[3]}" fill="url(#${x.u}-wax)"/></g>`).join("") : "";
        return svg(x, `${bed(x, { w: 44, col: "#4f6a7a", duv: "#d9a65a", style: "wood", lit: 1, ly: 100 })}
${stand(x, { m: "navy", x0: 48, x1: 192, cx: 100 + dx, rx: 48, kk: 0.7 })}
${mug(x, 168)}
${T(dx, `${halo(x, 100, 86, 58, 0.7, 70)}
${shadow(x, 100, 148, 22, 3)}
<path d="M80 148 L88 118 L112 118 L120 148 Z" fill="${F(x, "steel")}"/>
<path d="M80 148 L88 118 L112 118 L120 148 Z" fill="${F(x, "cyl")}" opacity=".6"/>
<ellipse cx="100" cy="148" rx="20" ry="1.8" fill="#3a3f46"/><rect x="87" y="116" width="26" height="3" rx="1" fill="#c3c9cf"/>
<path d="M85 140 L115 140" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/>
${x.on ? `<ellipse cx="100" cy="119" rx="16" ry="4" fill="${F(x, "pool")}" opacity="${x.k(1)}"/>` : ""}
<path d="${glass}" fill="url(#${x.u}-liq)"/>
<g clip-path="url(#${x.u}-lv)"><ellipse cx="100" cy="120" rx="16" ry="${x.on ? 6 : 9}" fill="url(#${x.u}-wax)"/>
${x.on ? "" : `<ellipse cx="100" cy="56" rx="7" ry="3" fill="url(#${x.u}-wax)" opacity=".8"/>`}${blobs}</g>
<path d="${glass}" fill="${F(x, "cyl")}" opacity=".5"/>
${hi("M91 112 C88 98 90 84 93 72", 0.55, 1.6)}
<path d="${glass}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>
<path d="M93 52 L107 52 L104 36 L96 36 Z" fill="${F(x, "steel")}"/><path d="M93 52 L107 52 L104 36 L96 36 Z" fill="${F(x, "cyl")}" opacity=".5"/>
<rect x="92" y="51" width="16" height="2.4" rx="1" fill="#c3c9cf"/>`)}`, ex);
      }
    },
    {
      id: "clamp", name: "Headboard clamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.52, y: 0.3, r: 0.9 }, cast: "down",
      render(o) {
        const x = C(o);
        const neck = "M70 30 C76 16 100 14 110 30 C113 36 114 42 113 48";
        return svg(x, `${bed(x, { w: 76, top: 40, col: "#8c7f9e", duv: "#6f8a7a", style: "channel", lit: 1, ly: 128, lr: 40 })}
${stand(x, { m: "oak", x0: 80, x1: 194, cx: 120, rx: 40, kk: 0.55 })}
${glasses(x, 116, 147)}${books(x, 168, ["#2f5a6e", "#c9a14a", "#6b3a4a"])}
${x.on ? `<g class="${P}beam"><path d="M106 60 L30 120 L78 146 L122 62 Z" fill="${F(x, "dn")}" opacity="${x.k(0.5)}"/></g>
<ellipse cx="50" cy="128" rx="34" ry="12" fill="${F(x, "pool")}" opacity="${x.k(0.85)}"/>` : ""}
<rect x="64" y="34" width="16" height="22" rx="2" fill="${F(x, "blk")}"/><rect x="64" y="34" width="16" height="3" rx="1.5" fill="#6a6f78"/>
<rect x="70" y="56" width="4" height="8" fill="#2a2d33"/><circle cx="72" cy="66" r="4" fill="${F(x, "blk")}"/><circle cx="71" cy="65" r="1.2" fill="#fff" opacity=".4"/>
<rect x="66" y="27" width="10" height="8" rx="2" fill="${F(x, "blk")}"/>
<path d="${neck}" fill="none" stroke="#1d1f24" stroke-width="5"/>
<path d="${neck}" fill="none" stroke="#5a5f68" stroke-width="3.6" stroke-dasharray="1.2 1.4"/>
<path d="${neck}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".8" transform="translate(-1 -1)"/>
<g transform="translate(113 52) rotate(38)">
${x.on ? `<circle cx="0" cy="8" r="18" fill="${F(x, "halo")}" opacity="${x.k(0.9)}"/>` : ""}
<rect x="-8" y="-6" width="16" height="14" rx="3" fill="${F(x, "c2m")}"/><rect x="-8" y="-6" width="16" height="14" rx="3" fill="${F(x, "cyl")}"/>
<path d="M-6 -3 H6" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>
${opening(x, 0, 8, 8, 2.4)}</g>`);
      }
    }
  ];

  const C2 = {"gourd": {"l": "Shade", "c": ["#e9e1d2", "#f6f3ee", "#4a4a50", "#3a4a6a", "#a9b89a", "#c27a5a"]}, "candlestick": {"l": "Shade", "c": ["#efe6d6", "#ffffff", "#e8c7c0", "#2f3a4a", "#c9b48a", "#7d9b84"]}, "glass-jug": {"l": "Shade", "c": ["#c8c2ba", "#f2eee6", "#3a3d44", "#6a7d9a", "#b88a6a", "#8a9a7a"]}, "mushroom": {"l": "Glass", "c": ["#f4efe6", "#e0b06a", "#8a8f99", "#e8b4c0", "#9fc8a8", "#ffffff"]}, "crystal": {"l": "Shade", "c": ["#f3f0ea", "#e9dcc8", "#2a2c31", "#c9b4d8", "#a8c4d8"]}, "tripod": {"l": "Shade", "c": ["#e9e1d2", "#f6f3ee", "#4a4a50", "#3a4a6a", "#a9b89a", "#c27a5a"]}, "rattan": {"l": "Rattan", "c": ["#8a5a2b", "#c9a06a", "#2e2a26", "#e8dcc4", "#5a3a22"]}, "paper": {"l": "Paper", "c": ["#f1ece2", "#ffffff", "#e8c4c8", "#c4d4e8", "#d8c49a"]}, "tulip": {"l": "Glass", "c": ["#f4efe6", "#e0b06a", "#8a8f99", "#e8b4c0", "#9fc8a8", "#ffffff"]}, "usb": {"l": "Shade", "c": ["#4b4f5a", "#e9e1d2", "#f6f3ee", "#3a4a6a", "#7a2a2a", "#a9b89a"]}, "swing-arm": {"l": "Shade", "c": ["#c99a3e", "#2a2c31", "#e8e6e2", "#4a6a5a", "#9aa1a8", "#2f3a5a"]}, "cordless": {"l": "Shade", "c": ["#7d9b84", "#f4efe6", "#2a2c31", "#e8b4c0", "#d8c49a", "#6a8ab8"]}, "clamp": {"l": "Head", "c": ["#2a2d33", "#e8e6e2", "#c99a3e", "#4a6a5a", "#9aa1a8"]}};
  icons.forEach((ic) => { const t = C2[ic.id]; if (!t) return; const r = ic.render; ic.colors2 = t.c; ic.picker2 = true; ic.colorLabel2 = t.l; ic.render = (o) => r(Object.assign({}, o, { _c2: t.c[0] })); });
  (window.HDA = window.HDA || []).push({
    id: "nightstand", tab: "Nightstand lamps", group: "Lights", kind: "light",
    intro: "Twenty bedside lamps, each on its own nightstand, many next to the bed with a book, glasses or a phone. When on, the shade glows in your color, light pools on the nightstand and washes up the wall.",
    
    css: `.hda-nightstand-breath,.hda-nightstand-salt,.hda-nightstand-dawn,.hda-nightstand-ring,.hda-nightstand-blob,.hda-nightstand-twinkle{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-nightstand-breath{animation:hda-nightstand-breath 4.2s ease-in-out infinite}
.hda-anim .hda-nightstand-beam{animation:hda-nightstand-beam 3.6s ease-in-out infinite}
.hda-anim .hda-nightstand-salt{animation:hda-nightstand-salt 5.5s ease-in-out infinite}
.hda-anim .hda-nightstand-dawn{animation:hda-nightstand-dawn 9s ease-in-out infinite}
.hda-anim .hda-nightstand-ring{animation:hda-nightstand-ring 9s ease-in-out infinite}
.hda-anim .hda-nightstand-blob{animation:hda-nightstand-blob 14s ease-in-out infinite}
.hda-anim .hda-nightstand-twinkle{animation:hda-nightstand-twinkle 2.8s ease-in-out infinite}
.hda-still .hda-nightstand-blob{transform:translate(0,-26px)}
@keyframes hda-nightstand-breath{50%{transform:scale(1.05);opacity:.72}}
@keyframes hda-nightstand-beam{50%{opacity:.72}}
@keyframes hda-nightstand-salt{0%,100%{opacity:.62;transform:scale(.97)}50%{opacity:1;transform:scale(1.04)}}
@keyframes hda-nightstand-dawn{0%{opacity:.25;transform:scale(.9)}70%,100%{opacity:1;transform:scale(1)}}
@keyframes hda-nightstand-ring{0%{opacity:.2}70%,100%{opacity:1}}
@keyframes hda-nightstand-blob{0%{transform:translate(0,0) scale(1,1)}25%{transform:translate(-1px,-22px) scale(.92,1.1)}50%{transform:translate(1px,-56px) scale(.85,1.18)}75%{transform:translate(0,-30px) scale(.95,1.05)}100%{transform:translate(0,0) scale(1,1)}}
@keyframes hda-nightstand-twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.1)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-nightstand-breath,.hda-anim .hda-nightstand-beam,.hda-anim .hda-nightstand-salt,.hda-anim .hda-nightstand-dawn,.hda-anim .hda-nightstand-ring,.hda-anim .hda-nightstand-blob,.hda-anim .hda-nightstand-twinkle{animation:none!important}.hda-anim .hda-nightstand-blob{transform:translate(0,-26px)}}`,
    icons
  });
})();
