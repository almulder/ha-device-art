(function () {
  const P = "hda-floor-";
  const WARM = ["#ffd8a8", "#fff3e0", "#e7f5ff", "#ffc9de", "#b197fc"];
  const RGB = ["#b197fc", "#ff6bcb", "#4dabf7", "#63e6be", "#ffd8a8"];

  function C(o) {
    const H = window.HDAH, c = o.color || "#ffd8a8", on = !!o.on;
    const L = on ? Math.max(0.05, o.level == null ? 1 : o.level) : 0;
    const k = (v) => (v * (0.15 + 0.85 * L)).toFixed(3);
    return { H, u: o.uid, c, on, L, k, hot: H.mix(c, "#ffffff", 0.72), lite: H.mix(c, "#ffffff", 0.35), deep: H.shade(c, -0.3), c2: o.color2 };
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
${lg(u, "dn", 0, 0, 0, 1, st(0, c, 0.62) + st(1, c, 0))}
${lg(u, "up", 0, 1, 0, 0, st(0, c, 0.62) + st(1, c, 0))}
${lg(u, "side", 0, 0, 1, 0, st(0, c, 0.62) + st(1, c, 0))}
${lg(u, "ls", 0, 0, 1, 0, st(0, H.shade(c, -0.12)) + st(0.32, hot) + st(0.62, lite) + st(1, deep))}
${rg(u, "lopal", 'cx=".42" cy=".38" r=".66"', st(0, "#fff") + st(0.3, hot) + st(0.78, c) + st(1, deep))}
${rg(u, "opal", 'cx=".38" cy=".32" r=".72"', st(0, "#fbf8f2") + st(0.55, x.op2 ? H.mix("#d6d0c7", x.op2, 0.7) : "#d6d0c7") + st(1, x.op2 ? H.shade(H.mix("#857f79", x.op2, 0.6), -0.1) : "#857f79"))}
${x.f2 ? lg(u, "lin2", 0, 0, 1, 0, st(0, H.shade(x.f2, -0.32)) + st(0.3, H.shade(x.f2, 0.12)) + st(0.64, H.shade(x.f2, -0.04)) + st(1, H.shade(x.f2, -0.38))) : ""}
${x.m2 ? lg(u, "met2", 0, 0, 1, 0, st(0, H.shade(x.m2, -0.55)) + st(0.32, H.shade(x.m2, 0.5)) + st(0.58, H.shade(x.m2, -0.05)) + st(1, H.shade(x.m2, -0.6))) : ""}
${rg(u, "gloss", 'cx=".34" cy=".28" r=".7"', st(0, "#fff", 0.6) + st(0.4, "#fff", 0.1) + st(1, "#fff", 0))}
${lg(u, "cyl", 0, 0, 1, 0, st(0, "#000", 0.28) + st(0.17, "#fff", 0.2) + st(0.4, "#fff", 0) + st(0.68, "#000", 0) + st(1, "#000", 0.34))}
${lg(u, "brass", 0, 0, 1, 0, st(0, "#6b4515") + st(0.32, "#f3d483") + st(0.56, "#c99a3e") + st(1, "#5e3d12"))}
${lg(u, "steel", 0, 0, 1, 0, st(0, "#4f555c") + st(0.34, "#eef1f4") + st(0.6, "#9aa1a8") + st(1, "#474c53"))}
${lg(u, "blk", 0, 0, 1, 0, st(0, "#0e0f12") + st(0.32, "#555a64") + st(0.58, "#24262d") + st(1, "#0b0c0f"))}
${lg(u, "blkv", 0, 0, 0, 1, st(0, "#5a5f69") + st(0.25, "#2c2f36") + st(0.75, "#17181c") + st(1, "#0b0c0f"))}
${lg(u, "wood", 0, 0, 1, 0, st(0, "#5a3519") + st(0.33, "#cf9d6a") + st(0.62, "#a06e43") + st(1, "#4f2e15"))}
${lg(u, "woodv", 0, 0, 0, 1, st(0, "#d8a978") + st(1, "#8c5a32"))}
${lg(u, "lin", 0, 0, 1, 0, st(0, "#a3967f") + st(0.3, "#f4eee3") + st(0.64, "#ddd3c3") + st(1, "#958871"))}
${lg(u, "cer", 0, 0, 1, 0, st(0, "#a9a39b") + st(0.3, "#fbf9f5") + st(0.62, "#e4dfd7") + st(1, "#8f8981"))}
${lg(u, "marble", 0, 0, 1, 1, st(0, "#fbfaf8") + st(0.5, "#dedad4") + st(1, "#a7a29b"))}
${rg(u, "sh", "", st(0, "#000", 0.55) + st(0.6, "#000", 0.22) + st(1, "#000", 0))}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${defs(x, extra)}${body}</svg>`;
  const F = (x, id) => `url(#${x.u}-${id})`;
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="${F(x, "sh")}"/>`;
  const halo = (x, cx, cy, r, kk, ry) => x.on ? `<g class="${P}breath"><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry || r}" fill="${F(x, "halo")}" opacity="${x.k(kk == null ? 0.8 : kk)}"/></g>` : "";
  const pool = (x, cx, cy, rx, ry, kk) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${F(x, "pool")}" opacity="${x.k(kk == null ? 0.75 : kk)}"/>` : "";
  const beam = (x, d, id, kk) => x.on ? `<g class="${P}beam"><path d="${d}" fill="${F(x, id || "dn")}" opacity="${x.k(kk == null ? 0.5 : kk)}"/></g>` : "";
  const TUBE = { brass: ["#5e3d12", "#d9b45e"], steel: ["#40464d", "#c3c9cf"], black: ["#0b0c0f", "#3c4048"], iron: ["#0d0e10", "#4a4e55"] };
  function tube(d, m, w) {
    const t = TUBE[m];
    return `<path d="${d}" fill="none" stroke="${t[0]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${t[1]}" stroke-width="${(w * 0.5).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${(w * 0.16).toFixed(2)}" stroke-linecap="round" transform="translate(${(-w * 0.17).toFixed(2)} ${(-w * 0.1).toFixed(2)})"/>`;
  }
  const rod = (x, cx, y1, y2, w, m) => `<rect x="${cx - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" fill="${F(x, m)}"/>`;
  function disk(x, cx, y, rx, h, m, top) {
    const ry = +(rx * 0.24).toFixed(1);
    return `<path d="M${cx - rx} ${y - h} V${y} A${rx} ${ry} 0 0 0 ${cx + rx} ${y} V${y - h} Z" fill="${F(x, m)}"/>
<ellipse cx="${cx}" cy="${y - h}" rx="${rx}" ry="${ry}" fill="${top || F(x, m)}"/>
<ellipse cx="${cx}" cy="${y - h}" rx="${rx}" ry="${ry}" fill="${F(x, "gloss")}" opacity=".7"/>
<path d="M${cx - rx * 0.7} ${y - h + ry * 0.55} A${rx} ${ry} 0 0 0 ${cx + rx * 0.2} ${y - h + ry}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>`;
  }
  function leg(x1, y1, x2, y2, w1, w2, fill, hi) {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    const p = (x, y, w, s) => `${(x + nx * w / 2 * s).toFixed(1)} ${(y + ny * w / 2 * s).toFixed(1)}`;
    return `<path d="M${p(x1, y1, w1, 1)} L${p(x2, y2, w2, 1)} L${p(x2, y2, w2, -1)} L${p(x1, y1, w1, -1)} Z" fill="${fill}"/>` +
      (hi === false ? "" : `<path d="M${p(x1, y1, w1 * 0.4, -1)} L${p(x2, y2, w2 * 0.4, -1)}" stroke="#fff" stroke-opacity="${hi || 0.32}" stroke-width=".8"/>`);
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
        s += `<path d="M${xt.toFixed(1)} ${yT.toFixed(1)} L${xb.toFixed(1)} ${yB.toFixed(1)}" stroke="${i % 2 ? "#000" : "#fff"}" stroke-opacity="${i % 2 ? 0.16 : 0.22}" stroke-width="${o.ribW || 1.1}"/>`;
      }
    }
    s += `<path d="${body}" fill="${F(x, "cyl")}" opacity="${x.on && !o.opaque ? 0.55 : 1}"/>`;
    s += `<ellipse cx="${cx}" cy="${yt}" rx="${rt}" ry="${ryt}" fill="${x.on ? x.hot : (o.lining || "#4b443c")}"/>`;
    if (x.on) s += `<ellipse cx="${cx}" cy="${yt}" rx="${rt * 0.8}" ry="${ryt * 0.6}" fill="#fff" opacity="${x.k(0.7)}"/>`;
    s += `<ellipse cx="${cx}" cy="${yt}" rx="${rt}" ry="${ryt}" fill="none" stroke="${o.trim || "#000"}" stroke-opacity="${o.trim ? 1 : 0.25}" stroke-width="${o.trimW || 0.9}"/>`;
    s += `<path d="M${cx - rb} ${yb} A${rb} ${ryb} 0 0 0 ${cx + rb} ${yb}" fill="none" stroke="${x.on ? x.hot : (o.trim || "#000")}" stroke-opacity="${x.on ? x.k(1) : (o.trim ? 1 : 0.3)}" stroke-width="${x.on ? 2 : (o.trimW || 1)}"/>`;
    return s;
  }
  function globe(x, cx, cy, r, kk) {
    return `${halo(x, cx, cy, r * (kk || 2.6), 0.85)}
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.on ? F(x, "lopal") : F(x, "opal")}"/>
${x.on ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${F(x, "opal")}" opacity="${(0.72 - 0.62 * x.L).toFixed(2)}"/>` : ""}
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${F(x, "gloss")}" opacity=".75"/>
<path d="M${cx - r * 0.62} ${cy - r * 0.42} A${r * 0.8} ${r * 0.8} 0 0 1 ${cx - r * 0.1} ${cy - r * 0.78}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${Math.max(1.2, r * 0.08).toFixed(1)}" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="${r - 0.4}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`;
  }
  function opening(x, cx, cy, rx, ry, dark) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${dark || "#22252b"}"/>` + (x.on ?
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 1.6}" ry="${Math.max(1, ry - 0.8)}" fill="${F(x, "fill")}" opacity="${x.k(1)}"/><ellipse cx="${cx}" cy="${cy + ry * 0.2}" rx="${rx * 0.35}" ry="${ry * 0.6}" fill="#fff" opacity="${x.k(0.9)}"/>` : "");
  }
  const motes = (x, pts) => x.on ? `<g fill="#fff">${pts.map((p, i) => `<g opacity=".7"><circle class="${P}mote" style="animation-delay:-${(i * 1.3).toFixed(1)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1}"/></g>`).join("")}</g>` : "";

  const icons = [
    {
      id: "arc", name: "Arc lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.8, y: 0.42, r: 1 }, cast: "down", colors2: ["#c3c9cf", "#26282e", "#c99a3e", "#f2f0ea", "#b8774f", "#2b3c63"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o); x.m2 = x.c2 || "#c3c9cf"; const arc = "M49 166 C46 70 68 16 116 15 C148 14 160 32 160 50";
        return svg(x, `${shadow(x, 49, 188, 32, 4.5)}${shadow(x, 160, 188, 26, 3)}
${beam(x, "M139 81 L106 186 L194 186 L181 81 Z", "dn", 0.5)}${pool(x, 152, 185, 42, 6)}
${tube(arc, "steel", 4.6)}
<path d="M26 171 L33 164 L73 164 L66 171 Z" fill="#f4f2ee"/><rect x="26" y="171" width="40" height="16" fill="${F(x, "marble")}"/>
<path d="M66 171 L73 164 L73 180 L66 187 Z" fill="#9c968e"/>
<path d="M30 176 C38 174 42 181 50 178 S60 182 64 179 M34 184 C40 181 46 185 52 183" fill="none" stroke="#7d776f" stroke-opacity=".55" stroke-width=".8"/>
<path d="M40 166 C48 165 56 168 66 166" fill="none" stroke="#8d877f" stroke-opacity=".45" stroke-width=".7"/>
<rect x="44" y="160" width="10" height="7" rx="2" fill="${F(x, "steel")}"/>
${halo(x, 160, 84, 40, 0.75)}
<rect x="156" y="46" width="8" height="8" rx="2" fill="${F(x, "steel")}"/>
<path d="M136 80 C136 63 146 52 160 52 C174 52 184 63 184 80 Z" fill="${F(x, "met2")}"/>
<path d="M136 80 C136 63 146 52 160 52 C174 52 184 63 184 80 Z" fill="${F(x, "gloss")}" opacity=".7"/>
<path d="M141 72 C142 62 149 56 157 55" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
${opening(x, 160, 80, 24, 4)}`);
      }
    },
    {
      id: "torchiere", name: "Torchiere", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.17, r: 1 }, cast: "up", colors2: ["#f4f2ee", "#ecd9b8", "#efc4cc", "#bcd8c0", "#b9c8e0", "#9a9aa6"], picker2: true, colorLabel2: "Glass",
      render(o) {
        const x = C(o); x.op2 = x.c2 || null; const _t = 0, bowl = "M58 34 C60 46 80 57 100 57 C120 57 140 46 142 34 Z";
        return svg(x, `${shadow(x, 100, 188, 36, 5)}
${beam(x, "M58 33 L14 8 L186 8 L142 33 Z", "up", 0.62)}${halo(x, 100, 30, 70, 0.7, 40)}
${disk(x, 100, 184, 28, 6, "blk")}
${rod(x, 100, 58, 179, 4.4, "blk")}
<rect x="95.5" y="112" width="9" height="7" rx="1.5" fill="${F(x, "brass")}"/><rect x="95.5" y="150" width="9" height="4" rx="1" fill="${F(x, "brass")}"/>
<path d="M90 56 L110 56 L105 63 L95 63 Z" fill="${F(x, "brass")}"/>
<path d="${bowl}" fill="${x.on ? F(x, "lopal") : F(x, "opal")}"/>
${x.on ? `<path d="${bowl}" fill="${F(x, "opal")}" opacity="${(0.7 - 0.6 * x.L).toFixed(2)}"/>` : ""}
<path d="${bowl}" fill="${F(x, "cyl")}" opacity=".7"/>
<path d="M66 40 C74 48 84 52 94 53" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>
<ellipse cx="100" cy="34" rx="42" ry="5.5" fill="${x.on ? x.hot : "#6a635b"}"/>
${x.on ? `<ellipse cx="100" cy="34" rx="30" ry="3" fill="#fff" opacity="${x.k(0.85)}"/>` : `<ellipse cx="100" cy="35" rx="34" ry="3.4" fill="#4a443e"/>`}
<ellipse cx="100" cy="34" rx="42" ry="5.5" fill="none" stroke="#c99a3e" stroke-width="1.6"/>`);
      }
    },
    {
      id: "tripod-drum", name: "Tripod drum", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.28, r: 1 }, cast: "both", colors2: ["#2b2833", "#e6dccb", "#2b3c63", "#9fb39a", "#f4f2ec"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o);
        return svg(x, `${shadow(x, 100, 188, 52, 5)}
${beam(x, "M60 28 L26 8 L174 8 L140 28 Z", "up", 0.5)}${beam(x, "M60 86 L30 186 L170 186 L140 86 Z", "dn", 0.45)}${pool(x, 100, 185, 62, 7)}
${leg(100, 88, 102, 180, 3, 2.4, "#16171b", 0.15)}
${leg(100, 88, 56, 186, 3.4, 3, "#202228")}${leg(100, 88, 144, 186, 3.4, 3, "#202228")}
<circle cx="100" cy="89" r="4.5" fill="${F(x, "brass")}"/>
${halo(x, 100, 56, 64, 0.5)}
${shadeBody(x, 100, 28, 42, 84, 42, x.c2 || "#2b2833", { opaque: true, lining: "#a07a2c", trim: "#c99a3e", trimW: 1.4, ryt: 6, ryb: 6 })}
<path d="M64 34 C66 52 66 68 64 80" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="5" stroke-linecap="round"/>
${x.on ? `<ellipse cx="100" cy="85" rx="38" ry="4" fill="${F(x, "fill")}" opacity="${x.k(0.95)}"/>` : ""}`);
      }
    },
    {
      id: "wood-tripod", name: "Wood tripod", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.28, r: 1 }, cast: "both", colors2: ["#e6dccb", "#f4f2ec", "#3a3a40", "#2b3c63", "#9fb39a", "#d9b8a8"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o); x.f2 = x.c2 || "#e6dccb"; const _t = 0;
        return svg(x, `${shadow(x, 100, 188, 56, 5)}
${beam(x, "M76 26 L58 8 L142 8 L124 26 Z", "up", 0.55)}${beam(x, "M54 88 L26 186 L174 186 L146 88 Z", "dn", 0.42)}${pool(x, 100, 185, 66, 7)}
${leg(100, 80, 104, 178, 4, 3.4, "#7a4c27", 0.18)}
${leg(100, 80, 50, 186, 5.4, 4.2, "#b5834f")}${leg(100, 80, 150, 186, 5.4, 4.2, "#a87444")}
<circle cx="100" cy="88" r="4.5" fill="${F(x, "brass")}"/><circle cx="99" cy="87" r="1.6" fill="#fff" opacity=".5"/>
${halo(x, 100, 56, 62, 0.65)}
${shadeBody(x, 100, 26, 26, 88, 46, F(x, "lin2"), { ryt: 3.6, ryb: 6.4 })}`);
      }
    },
    {
      id: "tree", name: "Tree lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.35, r: 1.2 }, cast: "down", colors2: ["#26282e", "#c99a3e", "#f2f0ea", "#c3c9cf", "#2b3c63"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o); x.m2 = x.c2 || "#26282e"; const _t = 0;
        const head = (cx, cy, r) => `<g transform="translate(${cx} ${cy}) rotate(${r})">
${beam(x, "M-11 8 L-30 76 L30 76 L11 8 Z", "dn", 0.5)}
<rect x="-3" y="-14" width="6" height="6" rx="1.5" fill="${F(x, "brass")}"/>
<path d="M-6 -9 L6 -9 L12.5 7 L-12.5 7 Z" fill="${F(x, "met2")}"/><path d="M-6 -9 L-1 -9 L-8 7 L-12.5 7 Z" fill="#fff" opacity=".12"/>
${opening(x, 0, 7, 12.5, 2.6)}${x.on ? `<circle cx="0" cy="10" r="14" fill="${F(x, "halo")}" opacity="${x.k(0.8)}"/>` : ""}</g>`;
        return svg(x, `${shadow(x, 100, 188, 34, 4.5)}${pool(x, 100, 184, 80, 8, 0.6)}
${tube("M100 46 L74 38", "black", 3)}${tube("M100 70 L128 62", "black", 3)}${tube("M100 100 L72 96", "black", 3)}
${disk(x, 100, 184, 26, 6, "blk")}${rod(x, 100, 24, 179, 4.4, "blk")}
<circle cx="100" cy="22" r="3.6" fill="${F(x, "brass")}"/>
${[46, 70, 100].map((y) => `<rect x="96" y="${y - 3}" width="8" height="6" rx="1.5" fill="${F(x, "brass")}"/>`).join("")}
${head(70, 42, 26)}${head(132, 64, -28)}${head(68, 100, 22)}`);
      }
    },
    {
      id: "paper", name: "Paper column", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.48, r: 1.1 }, cast: "around", colors2: ["#f4f0ea", "#ecdcc0", "#f2d0d4", "#d0e0f0", "#e0e8d0"], picker2: true, colorLabel2: "Paper",
      render(o) {
        const x = C(o); x.f2 = x.c2 || "#f4f0ea"; const _t = 0;
        let ribs = "";
        for (let y = 33; y < 172; y += 11) ribs += `<path d="M73 ${y} Q100 ${y + 4} 127 ${y}" fill="none" stroke="${x.on ? x.H.rgba(x.deep, 0.5) : "rgba(110,90,70,.32)"}" stroke-width="1.1"/>`;
        return svg(x, `${shadow(x, 100, 188, 44, 5)}${halo(x, 100, 98, 92, 0.6, 100)}${pool(x, 100, 184, 70, 8, 0.6)}
<rect x="72" y="22" width="56" height="152" rx="2" fill="${x.on ? F(x, "ls") : F(x, "lin2")}"/>
${x.on ? `<rect x="72" y="22" width="56" height="152" rx="2" fill="${F(x, "lin2")}" opacity="${(0.6 - 0.55 * x.L).toFixed(2)}"/>` : ""}
${ribs}
<path d="M84 40 C86 70 82 100 86 130 M114 56 C112 86 116 120 112 158" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".7"/>
<rect x="72" y="22" width="56" height="152" rx="2" fill="${F(x, "cyl")}" opacity="${x.on ? 0.55 : 1}"/>
<rect x="70" y="17" width="60" height="6" rx="1.5" fill="${F(x, "wood")}"/><rect x="70" y="171" width="60" height="6" rx="1.5" fill="${F(x, "wood")}"/>
<rect x="74" y="177" width="7" height="10" rx="1" fill="#6a4222"/><rect x="119" y="177" width="7" height="10" rx="1" fill="#6a4222"/>
<rect x="94" y="177" width="12" height="7" rx="1" fill="#4f3018"/>`);
      }
    },
    {
      id: "corner-bar", name: "LED corner bar", colors: RGB, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.46, r: 1.2 }, cast: "side",
      render(o) {
        const x = C(o), ex = `${lg(x.u, "strip", 0, 0, 0, 1, st(0, x.c) + st(0.5, x.hot) + st(1, x.c))}`;
        return svg(x, `<path d="M100 8 V150 M10 170 L100 150 L190 170" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="1"/>
${halo(x, 100, 86, 96, 0.55, 92)}${halo(x, 100, 92, 24, 0.95, 86)}${pool(x, 100, 182, 60, 8, 0.7)}
${shadow(x, 100, 187, 24, 4)}
${disk(x, 100, 184, 17, 5, "blk")}
<rect x="95.5" y="16" width="9" height="164" rx="3" fill="${F(x, "steel")}"/>
<rect x="98" y="20" width="4" height="156" rx="2" fill="${x.on ? `url(#${x.u}-strip)` : "#e2e6eb"}" opacity="${x.on ? 1 : 0.55}"/>
${x.on ? `<rect x="99" y="22" width="2" height="152" rx="1" fill="#fff" opacity="${x.k(0.9)}"/>` : ""}
<rect x="95.5" y="16" width="9" height="5" rx="2" fill="#2a2d33"/>`, ex);
      }
    },
    {
      id: "mid-century", name: "Brass cone", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.68, y: 0.36, r: 1 }, cast: "down", colors2: ["#d6a23a", "#26282e", "#f2f0ea", "#2f4a3c", "#b8774f", "#c3c9cf"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o);
        return svg(x, `${shadow(x, 92, 188, 30, 4.5)}${pool(x, 146, 184, 44, 6)}
${tube("M92 179 L92 74 C92 54 100 44 116 41", "brass", 4.2)}
${disk(x, 92, 184, 24, 7, "blk")}
<circle cx="92" cy="128" r="3.4" fill="${F(x, "brass")}"/>
<g transform="translate(128 52) rotate(-34)">
${beam(x, "M-24 17 L-58 158 L58 158 L24 17 Z", "dn", 0.48)}
${x.on ? `<ellipse cx="0" cy="22" rx="40" ry="26" fill="${F(x, "halo")}" opacity="${x.k(0.7)}"/>` : ""}
<rect x="-4.5" y="-24" width="9" height="8" rx="2" fill="${F(x, "brass")}"/>
<path d="M-7 -17 L7 -17 L26 16 L-26 16 Z" fill="${x.c2 || "#d6a23a"}"/><path d="M-7 -17 L7 -17 L26 16 L-26 16 Z" fill="${F(x, "cyl")}"/>
<path d="M-5 -14 L-21 13" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>
${opening(x, 0, 16, 26, 5, "#2a241a")}
<ellipse cx="0" cy="16" rx="26" ry="5" fill="none" stroke="#f1cf7a" stroke-width="1.4"/></g>`);
      }
    },
    {
      id: "gooseneck", name: "Reading lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.63, y: 0.28, r: 0.9 }, cast: "down", colors2: ["#c3c9cf", "#26282e", "#c99a3e", "#f2f0ea", "#b8774f", "#2b3c63"], picker2: true, colorLabel2: "Head",
      render(o) {
        const x = C(o); x.m2 = x.c2 || "#c3c9cf"; const _t = 0, neck = "M60 54 C60 22 98 12 118 32 C122 37 124 41 124 45";
        return svg(x, `${shadow(x, 60, 188, 28, 4.5)}${pool(x, 138, 184, 34, 5, 0.85)}
<g transform="translate(124 52) rotate(-12)">${beam(x, "M-8 9 L-34 134 L34 134 L8 9 Z", "dn", 0.6)}</g>
${motes(x, [[132, 120, 1.1], [144, 150, 0.9], [126, 160, 1], [150, 132, 0.8]])}
${disk(x, 60, 184, 22, 6, "steel")}${rod(x, 60, 52, 179, 4, "steel")}
<path d="${neck}" fill="none" stroke="#2c3036" stroke-width="5.4" stroke-linecap="round"/>
<path d="${neck}" fill="none" stroke="#9aa1a8" stroke-width="4" stroke-dasharray="1.3 1.5"/>
<path d="${neck}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1" transform="translate(-1 -1)"/>
<g transform="translate(124 52) rotate(-12)">
${x.on ? `<circle cx="0" cy="12" r="22" fill="${F(x, "halo")}" opacity="${x.k(0.9)}"/>` : ""}
<rect x="-9" y="-9" width="18" height="18" rx="3" fill="${F(x, "met2")}"/><rect x="-9" y="-9" width="18" height="18" rx="3" fill="${F(x, "cyl")}"/>
<rect x="-9" y="-3" width="18" height="1.2" fill="#3a3f46" opacity=".6"/>
${opening(x, 0, 9, 9, 2.6)}</g>
<rect x="56" y="140" width="8" height="10" rx="2" fill="#2c3036"/><rect x="58" y="142" width="4" height="3" rx="1" fill="${x.on ? x.c : "#55606b"}"/>`);
      }
    },
    {
      id: "globe", name: "Globe on stem", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.22, r: 1 }, cast: "around", colors2: ["#f4f2ee", "#ecd9b8", "#efc4cc", "#bcd8c0", "#b9c8e0", "#9a9aa6"], picker2: true, colorLabel2: "Globe",
      render(o) {
        const x = C(o); x.op2 = x.c2 || null; const _t = 0;
        return svg(x, `${shadow(x, 100, 188, 32, 4.5)}${pool(x, 100, 184, 54, 6, 0.5)}
${disk(x, 100, 185, 26, 4, "blk")}${disk(x, 100, 180, 16, 4, "brass")}
${rod(x, 100, 76, 176, 3.6, "brass")}
<rect x="96" y="120" width="8" height="5" rx="1.5" fill="${F(x, "brass")}"/>
<path d="M90 70 L110 70 L106 80 L94 80 Z" fill="${F(x, "brass")}"/>
${globe(x, 100, 44, 30, 2.8)}`);
      }
    },
    {
      id: "pharmacy", name: "Swing arm", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.73, y: 0.38, r: 1 }, cast: "down", colors2: ["#c99a3e", "#26282e", "#2f4a3c", "#f2f0ea", "#c3c9cf"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o); x.m2 = x.c2 || "#c99a3e"; const _t = 0;
        return svg(x, `${shadow(x, 68, 188, 28, 4.5)}
${beam(x, "M131 77 L108 186 L188 186 L161 77 Z", "dn", 0.5)}${pool(x, 148, 185, 38, 6)}
${disk(x, 68, 184, 22, 6, "brass")}${rod(x, 68, 34, 179, 4, "brass")}
<circle cx="68" cy="30" r="4.5" fill="${F(x, "brass")}"/><circle cx="66.6" cy="28.6" r="1.4" fill="#fff" opacity=".6"/>
${tube("M68 46 L146 46 L146 58", "brass", 3.6)}
<rect x="62" y="41" width="12" height="10" rx="2.5" fill="${F(x, "brass")}"/><circle cx="78" cy="46" r="3.4" fill="#5e3d12"/><circle cx="78" cy="46" r="2" fill="#c99a3e"/>
${halo(x, 146, 80, 36, 0.7)}
<rect x="142" y="56" width="8" height="6" rx="1.5" fill="${F(x, "brass")}"/>
<path d="M139 61 L153 61 C157 64 162 70 164 77 L128 77 C130 70 135 64 139 61 Z" fill="${F(x, "met2")}"/>
<path d="M139 61 L153 61 C157 64 162 70 164 77 L128 77 C130 70 135 64 139 61 Z" fill="${F(x, "gloss")}" opacity=".6"/>
${opening(x, 146, 77, 18, 3.4, "#3a2a12")}
<rect x="66" y="150" width="4" height="3" fill="#5e3d12" opacity=".6"/>`);
      }
    },
    {
      id: "shelf", name: "Shelf lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.3, r: 1 }, cast: "both", colors2: ["#e6dccb", "#f4f2ec", "#3a3a40", "#2b3c63", "#9fb39a", "#d9b8a8"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o); x.f2 = x.c2 || "#e6dccb"; const _t = 0;
        const slab = (y) => `<path d="M68 ${y} L132 ${y} L125 ${y - 7} L75 ${y - 7} Z" fill="${F(x, "woodv")}"/><rect x="68" y="${y}" width="64" height="4" fill="#7a4c27"/><rect x="68" y="${y}" width="64" height="1" fill="#e2b585" opacity=".6"/>`;
        return svg(x, `${shadow(x, 100, 188, 44, 5)}
${beam(x, "M70 30 L52 8 L148 8 L130 30 Z", "up", 0.5)}${beam(x, "M66 88 L58 96 L142 96 L134 88 Z", "dn", 0.55)}
${rod(x, 76, 90, 180, 2.4, "blk")}${rod(x, 124, 90, 180, 2.4, "blk")}
${slab(98)}
${x.on ? `<ellipse cx="100" cy="94" rx="30" ry="3" fill="${F(x, "pool")}" opacity="${x.k(0.9)}"/>` : ""}
<rect x="80" y="117" width="10" height="13" rx="1.5" fill="#a85a3c"/><rect x="80" y="117" width="10" height="2" fill="#c97a58"/>
<path d="M85 117 C80 108 76 108 74 104 M85 117 C86 106 90 104 92 100 M85 117 C90 110 96 110 97 106" fill="none" stroke="#5fae63" stroke-width="2.4" stroke-linecap="round"/>
<rect x="104" y="124" width="22" height="3" fill="#4a6fa5"/><rect x="106" y="121" width="19" height="3" fill="#c9a14a"/><rect x="103" y="118" width="21" height="3" fill="#8e3b46"/>
${slab(130)}
<path d="M106 162 C100 162 98 152 102 146 L104 140 L108 140 L110 146 C114 152 112 162 106 162 Z" fill="${F(x, "cer")}"/>
<rect x="84" y="152" width="12" height="10" rx="1" fill="#2f4f4a"/><rect x="84" y="152" width="12" height="2" fill="#4f7a72"/>
${slab(162)}
${rod(x, 70, 92, 186, 2.8, "blk")}${rod(x, 130, 92, 186, 2.8, "blk")}
${halo(x, 100, 58, 56, 0.6)}
${shadeBody(x, 100, 30, 32, 88, 36, F(x, "lin2"), { ryt: 4, ryb: 5 })}`);
      }
    },
    {
      id: "mushroom", name: "Mushroom", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.3, r: 1.1 }, cast: "down", colors2: ["#f4f2ee", "#ecd9b8", "#efc4cc", "#bcd8c0", "#b9c8e0", "#9a9aa6"], picker2: true, colorLabel2: "Glass",
      render(o) {
        const x = C(o); x.op2 = x.c2 || null; const _t = 0, cap = "M42 72 C42 40 70 20 100 20 C130 20 158 40 158 72 C130 77 70 77 42 72 Z";
        return svg(x, `${shadow(x, 100, 188, 38, 5)}
${beam(x, "M46 74 L18 186 L182 186 L154 74 Z", "dn", 0.42)}${pool(x, 100, 185, 74, 8)}${halo(x, 100, 52, 84, 0.65, 64)}
<ellipse cx="100" cy="183" rx="22" ry="4.5" fill="${F(x, "cer")}"/>
<path d="M86 183 C90 150 94 110 94 74 L106 74 C106 110 110 150 114 183 Z" fill="${F(x, "cer")}"/>
<path d="M97 80 C97 120 94 150 91 178" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>
${opening(x, 100, 73, 56, 5.5, "#7a736b")}
<path d="${cap}" fill="${x.on ? F(x, "lopal") : F(x, "opal")}"/>
${x.on ? `<path d="${cap}" fill="${F(x, "opal")}" opacity="${(0.7 - 0.6 * x.L).toFixed(2)}"/>` : ""}
<path d="${cap}" fill="${F(x, "gloss")}" opacity=".8"/>
<path d="M54 56 C60 38 76 28 94 25" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/>`);
      }
    },
    {
      id: "linen-drum", name: "Linen drum", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.25, r: 1 }, cast: "both", colors2: ["#e6dccb", "#f4f2ec", "#3a3a40", "#2b3c63", "#9fb39a", "#d9b8a8"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o); x.f2 = x.c2 || "#e6dccb"; const _t = 0;
        return svg(x, `${shadow(x, 100, 188, 30, 4)}
${beam(x, "M54 28 L24 8 L176 8 L146 28 Z", "up", 0.5)}${beam(x, "M54 70 L36 186 L164 186 L146 70 Z", "dn", 0.4)}${pool(x, 100, 185, 60, 7)}
${disk(x, 100, 185, 22, 3, "brass")}${rod(x, 100, 66, 182, 2.8, "brass")}
<path d="M100 66 L100 56 M84 62 L100 50 L116 62" fill="none" stroke="#c99a3e" stroke-width="1.2" opacity="${x.on ? 0.3 : 0.6}"/>
<rect x="96.5" y="130" width="7" height="4" rx="1" fill="${F(x, "brass")}"/>
${halo(x, 100, 48, 66, 0.6, 52)}
${shadeBody(x, 100, 28, 48, 70, 48, F(x, "lin2"), { ryt: 6.5, ryb: 6.5 })}
<path d="M54 30 L54 68" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>`);
      }
    },
    {
      id: "pipe", name: "Pipe lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.68, y: 0.44, r: 1 }, cast: "around", colors2: ["#1d1f23", "#c99a3e", "#b8774f", "#c3c9cf", "#8a2a1e"], picker2: true, colorLabel2: "Cage",
      render(o) {
        const x = C(o), bulb = "M136 70 C140 70 141 74 143 78 C149 84 151 90 151 96 C151 104 144 110 136 110 C128 110 121 104 121 96 C121 90 123 84 129 78 C131 74 132 70 136 70 Z";
        const fil = `<path d="M132 76 L131 96 M140 76 L141 96 M131 96 C131 100 141 100 141 96 M132 90 C134 86 138 86 140 90" fill="none" stroke="${x.on ? "#fff" : "#7a5a30"}" stroke-width="${x.on ? 1.3 : 0.9}" stroke-linecap="round"/>`;
        return svg(x, `${shadow(x, 70, 188, 24, 4)}${pool(x, 120, 184, 56, 7, 0.6)}${halo(x, 136, 92, 56, 0.85)}
<ellipse cx="70" cy="185" rx="15" ry="3.6" fill="#16171a"/><path d="M55 182 L85 182 L85 185 L55 185 Z" fill="#2a2c30"/><ellipse cx="70" cy="182" rx="15" ry="3.6" fill="#3a3d43"/>
<rect x="65.5" y="44" width="9" height="138" fill="${F(x, "blk")}"/>
<rect x="64" y="96" width="12" height="7" rx="1" fill="${F(x, "blk")}"/>
<path d="M65.5 44 L65.5 40 Q65.5 30 76 30 L80 30 L80 39 L76 39 Q74.5 39 74.5 44 Z" fill="#25272c"/>
<rect x="78" y="30" width="54" height="9" fill="url(#${x.u}-ironv)"/>
<rect x="84" y="28.5" width="7" height="12" rx="1" fill="url(#${x.u}-ironv)"/>
<path d="M130 30 L134 30 Q140.5 30 140.5 38 L140.5 46 L131.5 46 L131.5 39 L130 39 Z" fill="#25272c"/>
<rect x="131.5" y="44" width="9" height="14" fill="${F(x, "blk")}"/>
<rect x="129" y="57" width="14" height="13" rx="1.5" fill="${F(x, "brass")}"/><rect x="129" y="61" width="14" height="1" fill="#5e3d12" opacity=".6"/>
<circle cx="70" cy="120" r="8.5" fill="none" stroke="#8a2a1e" stroke-width="2.6"/><path d="M62 120 H78 M70 112 V128" stroke="#8a2a1e" stroke-width="1.6"/><circle cx="70" cy="120" r="2.2" fill="#b8b1a6"/>
<path d="${bulb}" fill="${x.on ? F(x, "fill") : "#fff"}" fill-opacity="${x.on ? x.k(1) : 0.08}" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
${fil}${x.on ? `<path d="${bulb}" fill="${x.c}" opacity="${x.k(0.25)}"/>` : ""}
<path d="M126 86 C125 92 126 98 129 102" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.3" stroke-linecap="round"/>
<g fill="none" stroke="${x.c2 || "#1d1f23"}" stroke-width="1.3"><path d="M129 70 C118 80 116 100 126 112 L146 112 C156 100 154 80 143 70"/><path d="M136 70 V113 M122 92 C128 95 144 95 150 92"/><path d="M126 112 C130 116 142 116 146 112"/></g>`,
          lg(x.u, "ironv", 0, 0, 0, 1, st(0, "#0e0f12") + st(0.3, "#5a5f68") + st(0.6, "#25272c") + st(1, "#0b0c0f")));
      }
    },
    {
      id: "rattan", name: "Rattan lantern", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.52, r: 1.1 }, cast: "around", colors2: ["#8c5e2e", "#2a2a2e", "#e8e0d0", "#5a3a1e", "#8a9a7e"], picker2: true, colorLabel2: "Weave",
      render(o) {
        const x = C(o), body = "M100 22 C128 22 140 50 140 92 C140 136 128 164 116 174 L84 174 C72 164 60 136 60 92 C60 50 72 22 100 22 Z";
        const r2 = x.c2 || "#8c5e2e", strand = x.on ? x.H.shade(r2, 0.25) : r2;
        const ex = `<pattern id="${x.u}-wv" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 -1 L8 8 M8 -1 L-1 8" stroke="${strand}" stroke-width="2.6"/><path d="M-1 -1 L8 8" stroke="#f0c48a" stroke-opacity=".35" stroke-width=".8"/></pattern>
${lg(x.u, "rat", 0, 0, 1, 0, st(0, x.H.shade(r2, -0.45)) + st(0.35, r2) + st(1, x.H.shade(r2, -0.55)))}`;
        const dots = x.on ? [[30, 60], [22, 110], [40, 150], [170, 70], [178, 120], [160, 158], [48, 36], [154, 34]].map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${1.4 + (i % 3) * 0.6}" fill="${x.hot}" opacity="${x.k(0.5)}"/>`).join("") : "";
        return svg(x, `${shadow(x, 100, 188, 40, 5)}${halo(x, 100, 98, 88, 0.6, 96)}${pool(x, 100, 184, 64, 8, 0.6)}${dots}
<path d="${body}" fill="${x.on ? F(x, "lopal") : F(x, "rat")}"/>
<path d="${body}" fill="url(#${x.u}-wv)"/>
<path d="${body}" fill="${F(x, "cyl")}" opacity="${x.on ? 0.6 : 1}"/>
<path d="M100 22 C128 22 140 50 140 92 C140 136 128 164 116 174 L84 174 C72 164 60 136 60 92 C60 50 72 22 100 22 Z" fill="none" stroke="#5a3a1a" stroke-width="1.4"/>
<ellipse cx="100" cy="24" rx="16" ry="4" fill="#6e4520"/><ellipse cx="100" cy="23" rx="12" ry="2.6" fill="${x.on ? x.hot : "#2a1a0c"}"/>
<rect x="82" y="172" width="36" height="7" rx="2" fill="${F(x, "wood")}"/><rect x="86" y="179" width="6" height="8" rx="1" fill="#5a3519"/><rect x="108" y="179" width="6" height="8" rx="1" fill="#5a3519"/>
<path d="M72 60 C68 80 68 110 74 136" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>`, ex);
      }
    },
    {
      id: "ring", name: "LED ring", colors: RGB, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.48, r: 1.2 }, cast: "around",
      render(o) {
        const x = C(o);
        return svg(x, `${shadow(x, 100, 188, 32, 4.5)}${pool(x, 100, 184, 70, 8, 0.7)}
${x.on ? `<g class="${P}breath"><circle cx="100" cy="96" r="62" fill="none" stroke="${x.c}" stroke-width="30" opacity="${x.k(0.14)}"/><circle cx="100" cy="96" r="61" fill="none" stroke="${x.c}" stroke-width="12" opacity="${x.k(0.3)}"/></g>
<circle cx="100" cy="96" r="54" fill="${F(x, "halo")}" opacity="${x.k(0.22)}"/>` : ""}
<rect x="96.5" y="156" width="7" height="18" fill="${F(x, "blk")}"/>
<path d="M80 186 L82 174 L118 174 L120 186 Z" fill="${F(x, "blk")}"/><path d="M82 174 L118 174 L117 177 L83 177 Z" fill="#6a6f78"/>
<circle cx="100" cy="96" r="64" fill="none" stroke="#14151a" stroke-width="9"/>
<circle cx="100" cy="96" r="65.5" fill="none" stroke="#5a5f68" stroke-width="2"/>
<path d="M44 66 A64 64 0 0 1 96 32" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="100" cy="96" r="60" fill="none" stroke="${x.on ? x.hot : "#454952"}" stroke-width="3" opacity="${x.on ? x.k(1) : 1}"/>
${x.on ? `<circle class="${P}spin" cx="100" cy="96" r="60" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="46 331" stroke-linecap="round" opacity="${x.k(0.8)}"/>` : ""}`);
      }
    },
    {
      id: "spotlight", name: "Studio spotlight", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.66, y: 0.3, r: 1.1 }, cast: "side", colors2: ["#26282e", "#f2f0ea", "#c3c9cf", "#7a1f2a", "#2b3c63"], picker2: true, colorLabel2: "Housing",
      render(o) {
        const x = C(o); x.m2 = x.c2 || null; const _t = 0;
        return svg(x, `${shadow(x, 98, 188, 48, 4.5)}${pool(x, 168, 184, 30, 5, 0.5)}
${leg(96, 124, 100, 180, 2.6, 2.2, "#3a3f46", 0.15)}
${leg(96, 124, 52, 186, 3.2, 2.6, "#9aa1a8")}${leg(96, 124, 144, 186, 3.2, 2.6, "#8a9198")}
<path d="M70 158 L96 140 L122 158" fill="none" stroke="#7d848b" stroke-width="1.6"/>
${rod(x, 96, 82, 128, 5, "steel")}<rect x="92" y="118" width="8" height="8" rx="2" fill="#2a2d33"/>
<g transform="translate(96 64) rotate(-6)">
${x.on ? `<g class="${P}beam"><path d="M28 -15 L120 -46 L120 46 L28 15 Z" fill="${F(x, "side")}" opacity="${x.k(0.55)}"/></g><ellipse cx="32" cy="0" rx="22" ry="30" fill="${F(x, "halo")}" opacity="${x.k(0.9)}"/>` : ""}
<path d="M-10 16 L-10 26 L10 26 L10 16" fill="none" stroke="#2a2d33" stroke-width="3"/>
<rect x="-30" y="-19" width="56" height="38" rx="6" fill="${x.c2 ? F(x, "met2") : F(x, "blkv")}"/>
${[-20, -12, -4, 4, 12].map((v) => `<rect x="${v}" y="-19" width="4" height="5" fill="#0b0c0f"/>`).join("")}
<ellipse cx="-30" cy="0" rx="5" ry="18" fill="#1d1f24"/><rect x="-26" y="-14" width="10" height="10" rx="2" fill="#2f333a"/><circle cx="-21" cy="-9" r="2" fill="${x.on ? "#ff5a4a" : "#552"}"/>
<path d="M-28 -17 L22 -17" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>
<ellipse cx="27" cy="0" rx="6" ry="18" fill="${x.on ? F(x, "fill") : "#3a3f46"}"/>
<ellipse cx="27" cy="0" rx="4" ry="12" fill="none" stroke="#fff" stroke-opacity="${x.on ? 0.7 : 0.25}" stroke-width=".8"/><ellipse cx="27" cy="0" rx="2" ry="6" fill="none" stroke="#fff" stroke-opacity="${x.on ? 0.7 : 0.25}" stroke-width=".8"/>
<path d="M28 -19 L48 -31 L50 -26 L30 -17 Z" fill="#2a2d33"/><path d="M28 19 L48 31 L50 26 L30 17 Z" fill="#1d1f24"/>
<path d="M28 -19 L48 -31" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/></g>`);
      }
    },
    {
      id: "orbs", name: "Orb cluster", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.32, r: 1.1 }, cast: "around", colors2: ["#f4f2ee", "#ecd9b8", "#efc4cc", "#bcd8c0", "#b9c8e0", "#9a9aa6"], picker2: true, colorLabel2: "Globes",
      render(o) {
        const x = C(o); x.op2 = x.c2 || null; const _t = 0;
        return svg(x, `${shadow(x, 100, 188, 32, 4.5)}${pool(x, 100, 184, 56, 6, 0.5)}
${tube("M100 112 C98 92 82 84 72 72", "brass", 3)}${tube("M100 112 C102 84 120 70 128 58", "brass", 3)}${tube("M100 128 C110 124 122 118 130 110", "brass", 3)}
${disk(x, 100, 185, 24, 5, "brass")}${rod(x, 100, 110, 181, 3.6, "brass")}
<circle cx="100" cy="112" r="3.4" fill="${F(x, "brass")}"/><circle cx="100" cy="128" r="3" fill="${F(x, "brass")}"/>
${globe(x, 66, 56, 21, 2.4)}${globe(x, 132, 40, 23, 2.4)}${globe(x, 138, 100, 16, 2.4)}
<rect x="68" y="71" width="8" height="5" rx="1.5" fill="${F(x, "brass")}" transform="rotate(30 72 73)"/>
<rect x="124" y="58" width="8" height="5" rx="1.5" fill="${F(x, "brass")}" transform="rotate(-25 128 60)"/>`);
      }
    },
    {
      id: "pleated", name: "Pleated lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.22, r: 1 }, cast: "both", colors2: ["#ece2d2", "#f4f2ec", "#3a3a40", "#2b3c63", "#9fb39a", "#e3c0b8"], picker2: true, colorLabel2: "Shade",
      render(o) {
        const x = C(o);
        const prof = [[186, 22], [180, 22], [177, 15], [172, 17], [168, 10], [150, 8], [140, 15], [128, 18], [116, 9], [104, 6.5], [96, 10], [92, 6], [84, 4.5]];
        const col = "M" + prof.map((p) => `${(100 - p[1])} ${p[0]}`).join(" L") + " L" + prof.slice().reverse().map((p) => `${100 + p[1]} ${p[0]}`).join(" L") + " Z";
        let sc = "";
        for (let i = 0; i < 12; i++) { const a0 = Math.PI * i / 12, a1 = Math.PI * (i + 1) / 12; sc += `<path d="M${(100 - 44 * Math.cos(a0)).toFixed(1)} ${(76 + 6.4 * Math.sin(a0)).toFixed(1)} Q${(100 - 44 * Math.cos((a0 + a1) / 2)).toFixed(1)} ${(80 + 6.4 * Math.sin((a0 + a1) / 2)).toFixed(1)} ${(100 - 44 * Math.cos(a1)).toFixed(1)} ${(76 + 6.4 * Math.sin(a1)).toFixed(1)}" fill="none" stroke="${x.on ? x.hot : "#b6a68e"}" stroke-width="1.6"/>`; }
        return svg(x, `${shadow(x, 100, 188, 30, 4.5)}
${beam(x, "M78 24 L60 8 L140 8 L122 24 Z", "up", 0.55)}${beam(x, "M56 78 L34 186 L166 186 L144 78 Z", "dn", 0.4)}${pool(x, 100, 185, 60, 7)}
<path d="${col}" fill="${F(x, "wood")}"/>
${[172, 140, 128, 96].map((y) => `<path d="M${y === 128 ? 83 : 88} ${y} L${y === 128 ? 117 : 112} ${y}" stroke="#3e230e" stroke-opacity=".5" stroke-width=".8"/>`).join("")}
<path d="M95 100 L95 150 M88 120 L88 136" stroke="#fff" stroke-opacity=".28" stroke-width="1.2"/>
${halo(x, 100, 52, 60, 0.6)}
${shadeBody(x, 100, 24, 22, 76, 44, x.c2 || "#ece2d2", { ribs: 18, ribW: 1.4, ryt: 3.4, ryb: 6.4 })}${sc}`);
      }
    }
  ];

  (window.HDA = window.HDA || []).push({
    id: "floor", tab: "Floor lamps", group: "Lights", kind: "light",
    intro: "Twenty real floor lamps, from arcs and torchieres to paper columns and LED bars. Each one glows in your color and throws its light the way the real lamp does.",
    
    css: `.hda-floor-breath{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-floor-breath{animation:hda-floor-breath 4.2s ease-in-out infinite}
.hda-anim .hda-floor-beam{animation:hda-floor-beam 3.6s ease-in-out infinite}
.hda-floor-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-floor-spin{animation:hda-floor-spin 7s linear infinite}
.hda-floor-mote{opacity:0}
.hda-still .hda-floor-mote{opacity:.6}
.hda-anim .hda-floor-mote{animation:hda-floor-mote 5.2s ease-in-out infinite}
@keyframes hda-floor-breath{50%{transform:scale(1.05);opacity:.72}}
@keyframes hda-floor-beam{50%{opacity:.72}}
@keyframes hda-floor-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes hda-floor-mote{0%{opacity:0;transform:translate(0,0)}30%{opacity:.8}70%{opacity:.6}100%{opacity:0;transform:translate(6px,-18px)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-floor-breath,.hda-anim .hda-floor-beam,.hda-anim .hda-floor-spin,.hda-anim .hda-floor-mote{animation:none!important}.hda-anim .hda-floor-mote{opacity:.6}}`,
    icons
  });
})();
