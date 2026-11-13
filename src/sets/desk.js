(function () {
  const P = "hda-desk-";
  const WARM = ["#ffd8a8", "#fff3e0", "#e7f5ff", "#ffc9de", "#b197fc"];
  const DAY = ["#e7f5ff", "#fff3e0", "#ffd8a8", "#d0ebff", "#fff9db"];
  const RGB = ["#b197fc", "#ff6bcb", "#4dabf7", "#63e6be", "#ff922b"];

  function C(o) {
    const H = window.HDAH, c = o.color || "#ffd8a8", on = !!o.on;
    const L = on ? Math.max(0.05, o.level == null ? 1 : o.level) : 0;
    const k = (v) => (v * (0.15 + 0.85 * L)).toFixed(3);
    return { H, u: o.uid, c, on, L, k, hot: H.mix(c, "#ffffff", 0.72), lite: H.mix(c, "#ffffff", 0.35), deep: H.shade(c, -0.3) };
  }
  const st = (off, col, op) => `<stop offset="${off}" stop-color="${col}"${op == null ? "" : ` stop-opacity="${op}"`}/>`;
  const lg = (u, id, x1, y1, x2, y2, s) => `<linearGradient id="${u}-${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${s}</linearGradient>`;
  const rg = (u, id, a, s) => `<radialGradient id="${u}-${id}" ${a}>${s}</radialGradient>`;
  function defs(x, extra) {
    const { u, c, hot, lite, deep, H } = x;
    return `<defs>
${rg(u, "halo", "", st(0, c, 0.7) + st(0.45, c, 0.24) + st(1, c, 0))}
${rg(u, "pool", "", st(0, hot, 0.85) + st(0.35, c, 0.5) + st(1, c, 0))}
${rg(u, "fill", 'cx=".5" cy=".55" r=".6"', st(0, "#fff", 0.97) + st(0.4, hot, 0.95) + st(1, c, 0.75))}
${lg(u, "dn", 0, 0, 0, 1, st(0, c, 0.62) + st(1, c, 0))}
${lg(u, "side", 0, 0, 1, 0, st(0, c, 0.62) + st(1, c, 0))}
${lg(u, "ls", 0, 0, 1, 0, st(0, H.shade(c, -0.12)) + st(0.32, hot) + st(0.62, lite) + st(1, deep))}
${lg(u, "lsv", 0, 0, 0, 1, st(0, hot) + st(0.6, lite) + st(1, c))}
${rg(u, "lopal", 'cx=".42" cy=".38" r=".66"', st(0, "#fff") + st(0.3, hot) + st(0.78, c) + st(1, deep))}
${rg(u, "opal", 'cx=".38" cy=".32" r=".72"', st(0, "#fbf8f2") + st(0.55, "#d6d0c7") + st(1, "#857f79"))}
${rg(u, "gloss", 'cx=".34" cy=".28" r=".7"', st(0, "#fff", 0.6) + st(0.4, "#fff", 0.1) + st(1, "#fff", 0))}
${lg(u, "cyl", 0, 0, 1, 0, st(0, "#000", 0.28) + st(0.17, "#fff", 0.2) + st(0.4, "#fff", 0) + st(0.68, "#000", 0) + st(1, "#000", 0.34))}
${lg(u, "brass", 0, 0, 1, 0, st(0, "#6b4515") + st(0.32, "#f3d483") + st(0.56, "#c99a3e") + st(1, "#5e3d12"))}
${lg(u, "brassv", 0, 0, 0, 1, st(0, "#f6dc92") + st(0.35, "#d4a548") + st(0.75, "#8a5f22") + st(1, "#5e3d12"))}
${lg(u, "steel", 0, 0, 1, 0, st(0, "#4f555c") + st(0.34, "#eef1f4") + st(0.6, "#9aa1a8") + st(1, "#474c53"))}
${lg(u, "steelv", 0, 0, 0, 1, st(0, "#f2f4f6") + st(0.45, "#aab1b8") + st(1, "#5a6067"))}
${lg(u, "alu", 0, 0, 1, 0, st(0, "#8d939a") + st(0.3, "#fbfcfd") + st(0.62, "#d7dbe0") + st(1, "#858b92"))}
${lg(u, "aluv", 0, 0, 0, 1, st(0, "#ffffff") + st(0.5, "#d9dde2") + st(1, "#8f959c"))}
${lg(u, "blk", 0, 0, 1, 0, st(0, "#0e0f12") + st(0.32, "#555a64") + st(0.58, "#24262d") + st(1, "#0b0c0f"))}
${lg(u, "blkv", 0, 0, 0, 1, st(0, "#5a5f69") + st(0.25, "#2c2f36") + st(0.75, "#17181c") + st(1, "#0b0c0f"))}
${lg(u, "wood", 0, 0, 1, 0, st(0, "#5a3519") + st(0.33, "#cf9d6a") + st(0.62, "#a06e43") + st(1, "#4f2e15"))}
${lg(u, "woodv", 0, 0, 0, 1, st(0, "#d8a978") + st(1, "#8c5a32"))}
${lg(u, "cer", 0, 0, 1, 0, st(0, "#a9a39b") + st(0.3, "#fbf9f5") + st(0.62, "#e4dfd7") + st(1, "#8f8981"))}
${lg(u, "cerv", 0, 0, 0, 1, st(0, "#ffffff") + st(0.55, "#e6e2dc") + st(1, "#a7a29a"))}
${lg(u, "copper", 0, 0, 1, 0, st(0, "#5a2410") + st(0.33, "#f3a878") + st(0.6, "#b8622f") + st(1, "#4e1f0c"))}
${lg(u, "ggl", 0, 0, 0, 1, st(0, "#4cc07c") + st(0.4, "#177040") + st(1, "#06331c"))}
${rg(u, "sh", "", st(0, "#000", 0.55) + st(0.6, "#000", 0.22) + st(1, "#000", 0))}
${lg(u, "vig", 0, 0, 1, 0, st(0, "#000", 0.55) + st(0.18, "#000", 0) + st(0.82, "#000", 0) + st(1, "#000", 0.55))}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${defs(x, extra)}${body}</svg>`;
  const F = (x, id) => `url(#${x.u}-${id})`;
  const n1 = (v) => (+v).toFixed(1);
  const shadow = (x, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 4}" fill="${F(x, "sh")}"/>`;
  const halo = (x, cx, cy, r, kk, ry) => x.on ? `<g class="${P}breath"><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${ry || r}" fill="${F(x, "halo")}" opacity="${x.k(kk == null ? 0.8 : kk)}"/></g>` : "";
  const pool = (x, cx, cy, rx, ry, kk) => x.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 7}" fill="${F(x, "pool")}" opacity="${x.k(kk == null ? 0.9 : kk)}"/>` : "";
  const beam = (x, d, kk, id) => x.on ? `<g class="${P}beam"><path d="${d}" fill="${F(x, id || "dn")}" opacity="${x.k(kk == null ? 0.45 : kk)}"/></g>` : "";
  const TUBE = { brass: ["#5e3d12", "#d9b45e"], steel: ["#40464d", "#c3c9cf"], black: ["#0b0c0f", "#3c4048"], white: ["#7d838a", "#eef1f4"], copper: ["#4e1f0c", "#d98a55"] };
  function tube(d, m, w) {
    const t = TUBE[m];
    return `<path d="${d}" fill="none" stroke="${t[0]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${t[1]}" stroke-width="${n1(w * 0.5)}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${n1(w * 0.16)}" stroke-linecap="round" transform="translate(${n1(-w * 0.17)} ${n1(-w * 0.1)})"/>`;
  }
  const rod = (x, cx, y1, y2, w, m) => `<rect x="${cx - w / 2}" y="${y1}" width="${w}" height="${y2 - y1}" fill="${F(x, m)}"/>`;
  function disk(x, cx, y, rx, h, m, top) {
    const ry = +(rx * 0.24).toFixed(1);
    return `<path d="M${cx - rx} ${y - h} V${y} A${rx} ${ry} 0 0 0 ${cx + rx} ${y} V${y - h} Z" fill="${F(x, m)}"/>
<ellipse cx="${cx}" cy="${y - h}" rx="${rx}" ry="${ry}" fill="${top || F(x, m)}"/>
<ellipse cx="${cx}" cy="${y - h}" rx="${rx}" ry="${ry}" fill="${F(x, "gloss")}" opacity=".7"/>
<path d="M${n1(cx - rx * 0.7)} ${n1(y - h + ry * 0.55)} A${rx} ${ry} 0 0 0 ${n1(cx + rx * 0.2)} ${n1(y - h + ry)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>`;
  }
  function leg(x1, y1, x2, y2, w1, w2, fill, hi) {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
    const p = (x, y, w, s) => `${n1(x + nx * w / 2 * s)} ${n1(y + ny * w / 2 * s)}`;
    return `<path d="M${p(x1, y1, w1, 1)} L${p(x2, y2, w2, 1)} L${p(x2, y2, w2, -1)} L${p(x1, y1, w1, -1)} Z" fill="${fill}"/>` +
      (hi === false ? "" : `<path d="M${p(x1, y1, w1 * 0.4, -1)} L${p(x2, y2, w2 * 0.4, -1)}" stroke="#fff" stroke-opacity="${hi || 0.32}" stroke-width=".8"/>`);
  }
  function spring(x1, y1, x2, y2, n, r) {
    const dx = x2 - x1, dy = y2 - y1, a = Math.atan2(dy, dx) * 180 / Math.PI;
    let s = `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#2a2e33" stroke-width="${r * 1.6}" stroke-linecap="round" opacity=".55"/>`;
    for (let i = 0; i <= n; i++) {
      const t = i / n, cx = x1 + dx * t, cy = y1 + dy * t;
      s += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(r * 0.42)}" ry="${r}" transform="rotate(${n1(a)} ${n1(cx)} ${n1(cy)})" fill="none" stroke="#c9ced4" stroke-width=".9"/>`;
    }
    return s;
  }
  function opening(x, cx, cy, rx, ry, dark) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${dark || "#22252b"}"/>` + (x.on ?
      `<ellipse cx="${cx}" cy="${cy}" rx="${rx - 1.6}" ry="${Math.max(1, ry - 0.8)}" fill="${F(x, "fill")}" opacity="${x.k(1)}"/><ellipse cx="${cx}" cy="${cy + ry * 0.2}" rx="${n1(rx * 0.35)}" ry="${n1(ry * 0.6)}" fill="#fff" opacity="${x.k(0.9)}"/>` : "");
  }
  const strip = (x, X, Y, w, h, offCol) => `<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="${h / 2}" fill="${x.on ? F(x, "fill") : (offCol || "#c9ced4")}" opacity="${x.on ? x.k(1) : 0.6}"/>` +
    (x.on ? `<rect x="${X + 3}" y="${n1(Y + h * 0.3)}" width="${w - 6}" height="${n1(h * 0.4)}" rx="${n1(h * 0.2)}" fill="#fff" opacity="${x.k(0.9)}"/>` : "");

  const DESK = {
    walnut: ["#7d5233", "#563520", "#2e1b0d", 1],
    oak: ["#a87f53", "#7c5532", "#4a2f17", 1],
    maple: ["#c9a877", "#9c7546", "#5e4022", 1],
    white: ["#d6d3ce", "#aca79f", "#77736c", 0],
    black: ["#41444c", "#26282e", "#111216", 0],
    mat: ["#2f6f55", "#1f5240", "#12291f", 2]
  };
  function desk0(x, kind) {
    const d = DESK[kind || "walnut"], u = x.u, top = "M14 158 L186 158 L196 176 L4 176 Z";
    let s = `<defs>${lg(u, "dk", 0, 0, 0, 1, st(0, d[0]) + st(1, d[1]))}${lg(u, "dkf", 0, 0, 0, 1, st(0, d[1]) + st(1, d[2]))}</defs>
<path d="${top}" fill="${F(x, "dk")}"/>`;
    if (d[3] === 1) s += `<g fill="none" stroke-width=".7"><path d="M16 162 C50 160 80 164 120 161 S170 163 188 161" stroke="#000" stroke-opacity=".16"/><path d="M10 168 C40 166 70 171 110 168 S160 170 192 168" stroke="#fff" stroke-opacity=".09"/><path d="M8 172.5 C46 171 90 175 130 172 S176 174 194 172.5" stroke="#000" stroke-opacity=".14"/></g>`;
    if (d[3] === 2) {
      let g = "";
      for (let i = 1; i < 12; i++) { const t = i / 12; g += `M${n1(14 + 172 * t)} 158 L${n1(4 + 192 * t)} 176 `; }
      g += "M11.5 162.5 L188.5 162.5 M9 167 L191 167 M6.5 171.5 L193.5 171.5";
      s += `<path d="${g}" fill="none" stroke="#bfe3cf" stroke-opacity=".22" stroke-width=".5"/>`;
    }
    s += `<path d="M14 158 L186 158" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>
<rect x="4" y="176" width="192" height="10" rx="1.5" fill="${F(x, "dkf")}"/>
<path d="M4.5 176.4 L195.5 176.4" stroke="#fff" stroke-opacity=".28" stroke-width=".8"/>
<path d="${top} M4 176 H196 V186 H4 Z" fill="${F(x, "vig")}"/>`;
    return s;
  }
  function notebook0(x, cx, cy, w, h, cover) {
    const t = cy - h / 2, b = cy + h / 2;
    return `<path d="M${cx - w / 2 + 3} ${t} L${cx + w / 2 - 3} ${t} L${cx + w / 2} ${b} L${cx - w / 2} ${b} Z" fill="${cover}"/>
<rect x="${cx - w / 2}" y="${b}" width="${w}" height="1.6" fill="${x.H.shade(cover, -0.4)}"/>
<path d="M${cx - w / 2 + 6} ${t + 1.2} L${cx + w / 2 - 4} ${t + 1.2} L${cx + w / 2 - 2} ${b - 1} L${cx - w / 2 + 5} ${b - 1} Z" fill="#f4f0e6"/>
<path d="M${cx - w / 2 + 8} ${t + 3.5} H${cx + w / 2 - 6} M${cx - w / 2 + 7.5} ${t + 5.6} H${cx + w / 2 - 5} M${cx - w / 2 + 7} ${t + 7.7} H${cx + w / 2 - 4.5}" stroke="#8fa8c8" stroke-opacity=".7" stroke-width=".5"/>
<path d="M${cx - w / 2 + 3.5} ${t + 1} L${cx - w / 2 + 2} ${b - 1}" stroke="#9aa1a8" stroke-width="1.6" stroke-dasharray=".8 1.2"/>`;
  }
  const pencil0 = (x1, y1, x2, y2, col) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${col || "#f2b632"}" stroke-width="2.2" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#fff" stroke-opacity=".35" stroke-width=".6" transform="translate(0 -.6)"/><circle cx="${x2}" cy="${y2}" r="1" fill="#3a2a1a"/>`;
  function mug0(x, cx, cy, col) {
    return `${shadow(x, cx, cy + 1, 10, 2.4)}<path d="M${cx - 7} ${cy - 15} L${cx + 7} ${cy - 15} L${cx + 6.4} ${cy} L${cx - 6.4} ${cy} Z" fill="${col}"/>
<path d="M${cx - 7} ${cy - 15} L${cx + 7} ${cy - 15} L${cx + 6.4} ${cy} L${cx - 6.4} ${cy} Z" fill="${F(x, "cyl")}"/>
<ellipse cx="${cx}" cy="${cy - 15}" rx="7" ry="1.8" fill="${x.H.shade(col, -0.35)}"/><ellipse cx="${cx}" cy="${cy - 14.6}" rx="5.6" ry="1.1" fill="#3b2314"/>
<path d="M${cx + 6.6} ${cy - 12} C${cx + 12} ${cy - 12} ${cx + 12} ${cy - 4} ${cx + 6.4} ${cy - 4}" fill="none" stroke="${col}" stroke-width="2"/>`;
  }
  function keyboard0(x, cx, cy, w, keyCol) {
    const t = cy - 4.5, b = cy + 4.5, kc = keyCol || "#4a4e57";
    let rows = "";
    for (let i = 0; i < 3; i++) { const y = t + 1.8 + i * 2.5, s = 2 - i * 0.4; rows += `<path d="M${n1(cx - w / 2 + 4 - s)} ${n1(y)} H${n1(cx + w / 2 - 4 + s)}" stroke="${kc}" stroke-width="1.7" stroke-dasharray="3.6 1"/>`; }
    return `${shadow(x, cx, b + 1, w / 2 + 4, 2.4)}<path d="M${cx - w / 2 + 2} ${t} L${cx + w / 2 - 2} ${t} L${cx + w / 2} ${b} L${cx - w / 2} ${b} Z" fill="#1c1e23"/>${rows}
<rect x="${cx - w / 2}" y="${b}" width="${w}" height="2" rx=".8" fill="#0d0e11"/><path d="M${cx - w / 2 + 2} ${t + 0.3} H${cx + w / 2 - 2}" stroke="#fff" stroke-opacity=".2" stroke-width=".5"/>`;
  }
  function book0(x, cx, cy, w) {
    const t = cy - 5, b = cy + 5, hw = w / 2;
    return `${shadow(x, cx, b + 1, hw + 4, 2.4)}<path d="M${cx - hw - 2} ${t + 0.6} L${cx + hw + 2} ${t + 0.6} L${cx + hw + 3} ${b + 1.6} L${cx - hw - 3} ${b + 1.6} Z" fill="#7a2f2a"/>
<path d="M${cx} ${t + 1} Q${cx - hw * 0.5} ${t - 1.6} ${cx - hw + 2} ${t} L${cx - hw} ${b} Q${cx - hw * 0.5} ${b - 1.4} ${cx} ${b + 0.6} Z" fill="#f3eee2"/>
<path d="M${cx} ${t + 1} Q${cx + hw * 0.5} ${t - 1.6} ${cx + hw - 2} ${t} L${cx + hw} ${b} Q${cx + hw * 0.5} ${b - 1.4} ${cx} ${b + 0.6} Z" fill="#e6dfcf"/>
<path d="M${cx - hw + 5} ${t + 2.6} Q${cx - hw * 0.5} ${t + 1.2} ${cx - 3} ${t + 3.2} M${cx - hw + 4.5} ${t + 5} Q${cx - hw * 0.5} ${t + 3.6} ${cx - 3} ${t + 5.6} M${cx - hw + 4} ${t + 7.4} Q${cx - hw * 0.5} ${t + 6} ${cx - 3} ${t + 8}
M${cx + 3} ${t + 3.2} Q${cx + hw * 0.5} ${t + 1.2} ${cx + hw - 5} ${t + 2.6} M${cx + 3} ${t + 5.6} Q${cx + hw * 0.5} ${t + 3.6} ${cx + hw - 4.5} ${t + 5} M${cx + 3} ${t + 8} Q${cx + hw * 0.5} ${t + 6} ${cx + hw - 4} ${t + 7.4}" fill="none" stroke="#8a8478" stroke-opacity=".6" stroke-width=".55"/>
<path d="M${cx} ${t + 1} L${cx} ${b + 0.6}" stroke="#000" stroke-opacity=".25" stroke-width=".8"/>`;
  }

  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const desk = (...a) => BG(desk0(...a));
  const notebook = (...a) => BG(notebook0(...a));
  const mug = (...a) => BG(mug0(...a));
  const keyboard = (...a) => BG(keyboard0(...a));
  const book = (...a) => BG(book0(...a));
  const pencil = (...a) => BG(pencil0(...a));
  const icons = [
    {
      id: "architect", name: "Architect lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.73, y: 0.4, r: 1 }, cast: "down",
      render(o) {
        const x = C(o);
        return svg(x, `${desk(x, "walnut")}${notebook(x, 116, 167, 56, 10, "#2f4f7a")}${pencil(140, 170, 156, 164)}
${pool(x, 116, 167, 54, 7.5)}${shadow(x, 46, 171, 26, 4)}
<g transform="translate(146 66) rotate(18)">${beam(x, "M-19 17 L-44 104 L44 104 L19 17 Z", 0.48)}</g>
${disk(x, 46, 170, 20, 7, "blk")}
<rect x="42" y="148" width="8" height="16" rx="2" fill="${F(x, "blk")}"/>
${spring(37, 148, 60, 104, 14, 2.6)}
${tube("M44 154 L74 92", "black", 2.6)}${tube("M50 155 L80 93", "black", 2.6)}
<circle cx="46" cy="153" r="4.6" fill="${F(x, "steel")}"/><circle cx="46" cy="153" r="1.5" fill="#2a2e33"/>
<circle cx="78" cy="91" r="5" fill="${F(x, "steel")}"/><circle cx="78" cy="91" r="1.6" fill="#2a2e33"/>
${spring(86, 82, 124, 62, 12, 2.2)}
${tube("M78 88 L140 57", "black", 2.4)}${tube("M80 95 L142 63", "black", 2.2)}
<circle cx="142" cy="59" r="4" fill="${F(x, "steel")}"/>
<g transform="translate(146 66) rotate(18)">
${x.on ? `<ellipse cx="0" cy="24" rx="40" ry="30" fill="${F(x, "halo")}" opacity="${x.k(0.75)}"/>` : ""}
<rect x="-4" y="-18" width="8" height="7" rx="2" fill="${F(x, "steel")}"/><rect x="-9" y="-17" width="5" height="4" rx="1" fill="#1a1c20"/>
<path d="M-5 -12 L5 -12 L7 -5 C17 -1 22 7 22 16 L-22 16 C-22 7 -17 -1 -7 -5 Z" fill="${F(x, "blk")}"/>
<path d="M-5 -12 L5 -12 L7 -5 C17 -1 22 7 22 16 L-22 16 C-22 7 -17 -1 -7 -5 Z" fill="${F(x, "gloss")}" opacity=".55"/>
<path d="M-8 -3 C-15 1 -19 7 -20 13" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>
${opening(x, 0, 16, 22, 4.5)}<ellipse cx="0" cy="16" rx="22" ry="4.5" fill="none" stroke="#6a707a" stroke-width=".9"/></g>`);
      }
    },
    {
      id: "banker", name: "Banker's lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.46, r: 1 }, cast: "down",
      render(o) {
        const x = C(o), sh = "M46 92 C48 74 70 63 100 63 C130 63 152 74 154 92 Z";
        return svg(x, `${desk(x, "walnut")}${notebook(x, 60, 167, 44, 9, "#6e2a24")}${pencil(84, 171, 100, 168, "#1d2a3a")}
${pool(x, 100, 167, 70, 8)}
${beam(x, "M50 93 L24 168 L176 168 L150 93 Z", 0.42)}
${shadow(x, 100, 172, 44, 4)}
<path d="M68 160 L132 160 L138 165 L62 165 Z" fill="${F(x, "brassv")}"/><rect x="62" y="165" width="76" height="7" rx="1" fill="${F(x, "brass")}"/>
<path d="M62 165.5 H138" stroke="#fff3c4" stroke-opacity=".6" stroke-width=".7"/><path d="M64 170 H136" stroke="#5e3d12" stroke-opacity=".6" stroke-width=".6"/>
${rod(x, 100, 96, 161, 5, "brass")}<rect x="96" y="128" width="8" height="5" rx="1.5" fill="${F(x, "brass")}"/><rect x="95" y="152" width="10" height="8" rx="2" fill="${F(x, "brass")}"/>
${tube("M100 108 C90 108 80 102 76 92", "brass", 2.4)}${tube("M100 108 C110 108 120 102 124 92", "brass", 2.4)}
<path d="M128 93 L128 116" stroke="#c99a3e" stroke-width="1.1" stroke-dasharray="1.4 1"/><circle cx="128" cy="118" r="2.4" fill="${F(x, "brass")}"/>
${halo(x, 100, 92, 74, 0.55, 42)}
<rect x="97.5" y="57" width="5" height="7" rx="1.5" fill="${F(x, "brass")}"/>
<path d="${sh}" fill="${F(x, "ggl")}"/>
${x.on ? `<path d="${sh}" fill="${x.H.mix(x.c, "#7ff0a8", 0.55)}" opacity="${x.k(0.32)}"/>` : ""}
<path d="${sh}" fill="${F(x, "cyl")}"/>
<path d="M58 84 C62 74 76 68 92 67" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>
<path d="M108 66 C122 67 134 71 142 78" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.2" stroke-linecap="round"/>
${opening(x, 100, 92, 54, 5, "#e7e1d1")}
<ellipse cx="100" cy="92" rx="54" ry="5" fill="none" stroke="${F(x, "brass")}" stroke-width="2.2"/>`);
      }
    },
    {
      id: "monitor-bar", name: "Monitor light bar", colors: DAY, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.22, r: 1.1 }, cast: "down",
      render(o) {
        const x = C(o);
        let ui = `<rect x="40" y="56" width="58" height="34" rx="2" fill="#2b3a52" opacity=".8"/><rect x="104" y="56" width="56" height="16" rx="2" fill="#24324a" opacity=".8"/><rect x="104" y="76" width="56" height="42" rx="2" fill="#1f2b40" opacity=".8"/><rect x="40" y="94" width="58" height="24" rx="2" fill="#253247" opacity=".8"/>`;
        ui += `<path d="M45 62 H80 M45 67 H90 M45 72 H74 M109 82 H150 M109 88 H140 M109 94 H146" stroke="#8fb3e8" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>`;
        return svg(x, `${desk(x, "black")}
${pool(x, 100, 167, 74, 8)}
${shadow(x, 100, 163, 30, 3)}
<path d="M80 164 C80 160 120 160 120 164 Z" fill="${F(x, "steelv")}"/><ellipse cx="100" cy="161.5" rx="20" ry="2.6" fill="${F(x, "steel")}"/>
<path d="M92 132 L108 132 L106 161 L94 161 Z" fill="${F(x, "steel")}"/>
<rect x="28" y="44" width="144" height="90" rx="4" fill="#0d0e12"/><rect x="28" y="44" width="144" height="90" rx="4" fill="none" stroke="#3a3e46" stroke-width="1"/>
<rect x="33" y="49" width="134" height="76" rx="1.5" fill="#0f1520"/>${ui}
<path d="M33 49 L90 49 L48 125 L33 125 Z" fill="#fff" opacity=".05"/>
<rect x="28" y="125" width="144" height="9" rx="2" fill="#16181d"/><circle cx="160" cy="129.5" r="1.1" fill="${x.on ? "#e7f5ff" : "#3a3e46"}"/>
${beam(x, "M64 44 L30 168 L170 168 L136 44 Z", 0.28)}
${x.on ? `<path d="M30 44.5 H170" stroke="${x.hot}" stroke-width="1.2" opacity="${x.k(0.9)}"/>` : ""}
${keyboard(x, 100, 169, 92)}
<path d="M88 36 L112 36 L112 50 L106 50 L106 40 L94 40 L94 50 L88 50 Z" fill="#1d1f24"/>
<rect x="60" y="34" width="80" height="9" rx="4.5" fill="${F(x, "blkv")}"/><rect x="60" y="34" width="80" height="9" rx="4.5" fill="${F(x, "cyl")}" opacity=".6"/>
<path d="M64 35.5 H136" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>
<circle cx="134" cy="38.5" r="1.4" fill="${x.on ? x.c : "#454952"}"/>
${strip(x, 64, 41, 72, 3, "#3a3e46")}
${halo(x, 100, 46, 54, 0.75, 18)}`);
      }
    },
    {
      id: "gooseneck", name: "Gooseneck LED", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.71, y: 0.32, r: 0.9 }, cast: "down",
      render(o) {
        const x = C(o), neck = "M54 160 C52 112 56 66 88 46 C110 32 134 36 141 54";
        let dots = "";
        if (x.on) for (let i = -2; i <= 2; i++) dots += `<circle cx="${142 + i * 4.6}" cy="${65.4 + Math.abs(i) * -0.2}" r="1.2" fill="#fff" opacity="${x.k(0.95)}"/>`;
        return svg(x, `${desk(x, "oak")}${book(x, 136, 166, 46)}
${pool(x, 140, 167, 46, 7.5)}${shadow(x, 54, 171, 24, 4)}
${beam(x, "M128 66 L100 168 L184 168 L156 66 Z", 0.5)}
${disk(x, 54, 170, 19, 7, "blk")}
<rect x="50" y="150" width="8" height="12" rx="2" fill="${F(x, "steel")}"/>
<path d="${neck}" fill="none" stroke="#1a1c20" stroke-width="5.2" stroke-linecap="round"/>
<path d="${neck}" fill="none" stroke="#8a9198" stroke-width="3.8" stroke-dasharray="1.2 1.4"/>
<path d="${neck}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".9" transform="translate(-1 -1)"/>
<rect x="137" y="52" width="8" height="6" rx="1.5" fill="${F(x, "steel")}"/>
${halo(x, 142, 68, 34, 0.9, 24)}
<path d="M126 60 C126 56 158 56 158 60 L158 64 C158 68 126 68 126 64 Z" fill="${F(x, "blk")}"/>
<ellipse cx="142" cy="60" rx="16" ry="3.6" fill="${F(x, "blkv")}"/><path d="M130 59 C136 57 148 57 154 59" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>
<ellipse cx="142" cy="65.6" rx="14.6" ry="2.2" fill="${x.on ? F(x, "fill") : "#3a3e46"}" opacity="${x.on ? x.k(1) : 1}"/>${dots}
<rect x="51" y="140" width="6" height="7" rx="1.5" fill="#24262c"/><circle cx="54" cy="143.5" r="1.3" fill="${x.on ? x.c : "#55606b"}"/>`);
      }
    },
    {
      id: "clamp-task", name: "Clamp task light", colors: DAY, picker: true, colorLabel: "Light", glow: { x: 0.29, y: 0.33, r: 1 }, cast: "down",
      render(o) {
        const x = C(o);
        return svg(x, `${desk(x, "white")}${notebook(x, 62, 167, 50, 10, "#3f6b5a")}${pencil(30, 171, 46, 165, "#d9480f")}
${pool(x, 60, 167, 56, 7.5)}
<g transform="translate(58 62) rotate(-8)">${beam(x, "M-32 6 L-46 104 L48 104 L32 6 Z", 0.46)}</g>
<rect x="163" y="150" width="17" height="8" rx="1.5" fill="${F(x, "aluv")}"/>
<rect x="178" y="150" width="7" height="42" rx="2" fill="${F(x, "alu")}"/>
<rect x="165" y="186" width="20" height="5" rx="1.5" fill="${F(x, "aluv")}"/>
<rect x="169" y="191" width="6" height="3" rx="1" fill="#55606b"/>
${rod(x, 172, 46, 152, 5, "alu")}
<circle cx="172" cy="46" r="5.4" fill="${F(x, "alu")}"/><circle cx="172" cy="46" r="1.8" fill="#7d838a"/>
${tube("M170 43 L118 22", "white", 2.4)}${tube("M174 49 L122 28", "white", 2.4)}
<circle cx="120" cy="25" r="5" fill="${F(x, "alu")}"/><circle cx="120" cy="25" r="1.7" fill="#7d838a"/>
${tube("M118 23 L72 54", "white", 2.4)}${tube("M122 28 L76 59", "white", 2.4)}
<circle cx="74" cy="56" r="4.2" fill="${F(x, "alu")}"/>
<g transform="translate(58 62) rotate(-8)">
${x.on ? `<ellipse cx="0" cy="12" rx="46" ry="18" fill="${F(x, "halo")}" opacity="${x.k(0.75)}"/>` : ""}
<rect x="-36" y="-5" width="72" height="10" rx="5" fill="${F(x, "aluv")}"/>
<path d="M-32 -3.6 H30" stroke="#fff" stroke-opacity=".9" stroke-width=".9"/>
<circle cx="26" cy="-1" r="1.3" fill="${x.on ? x.c : "#9aa1a8"}"/>
${strip(x, -32, 3, 64, 3.4, "#b9bec4")}</g>`);
      }
    },
    {
      id: "charger", name: "Charging base", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.66, y: 0.27, r: 1 }, cast: "down",
      render(o) {
        const x = C(o), n = x.on ? Math.max(1, Math.round(x.L * 5)) : 0;
        let leds = "";
        for (let i = 0; i < 5; i++) leds += `<rect x="${112 + i * 5}" y="165.4" width="3.2" height="1.4" rx=".7" fill="${i < n ? x.hot : "#a7a29a"}" opacity="${i < n ? 1 : 0.6}"/>`;
        return svg(x, `${desk(x, "maple")}
${pool(x, 128, 167, 60, 8)}
${beam(x, "M104 55 L76 168 L190 168 L164 55 Z", 0.44)}
${shadow(x, 100, 170, 50, 3.4)}
<path d="M60 154 L140 154 L146 163 L54 163 Z" fill="${F(x, "cerv")}"/><rect x="54" y="163" width="92" height="6" rx="1.2" fill="${F(x, "cer")}"/>
<path d="M54.5 163.3 H145.5" stroke="#fff" stroke-width=".7"/>${leds}
${x.on ? `<g opacity=".75"><ellipse cx="100" cy="158.4" rx="19" ry="3.6" fill="none" stroke="#66d9ff" stroke-width="1.2" class="${P}pulse"/></g>` : ""}
<path d="M86 155.5 L114 155.5 L116.5 161.2 L83.5 161.2 Z" fill="#14161b"/><path d="M88 156.3 L112 156.3 L114 160.4 L86 160.4 Z" fill="#1f2a3d"/>
<path d="M89 156.6 L100 156.6 L94 160.2 L87 160.2 Z" fill="#fff" opacity=".12"/>
${leg(66, 156, 66, 88, 7, 7, F(x, "alu"), 0.5)}
<circle cx="66" cy="88" r="5" fill="${F(x, "alu")}"/><circle cx="66" cy="88" r="1.6" fill="#8d939a"/>
${leg(66, 88, 102, 50, 7, 7, F(x, "aluv"), 0.6)}
<circle cx="102" cy="50" r="5" fill="${F(x, "alu")}"/><circle cx="102" cy="50" r="1.6" fill="#8d939a"/>
${halo(x, 134, 58, 50, 0.75, 18)}
<rect x="100" y="45" width="68" height="9" rx="3" fill="${F(x, "aluv")}"/><path d="M103 46.2 H165" stroke="#fff" stroke-width=".8"/>
${strip(x, 104, 52.5, 60, 3, "#b9bec4")}`);
      }
    },
    {
      id: "copper-pipe", name: "Copper pipe", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.64, y: 0.48, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), g = "M120 76 C122 76 123 79 124 81 C134 84 142 92 142 102 C142 113 133 121 122 121 C111 121 102 113 102 102 C102 92 110 84 120 81 C121 79 122 76 124 76 Z";
        const glb = "M118 78 C118 81 104 86 104 102 C104 112 112 120 122 120 C132 120 140 112 140 102 C140 86 126 81 126 78 Z";
        const fil = `<path d="M119 80 L115 98 M125 80 L129 98 M115 98 C116 104 118 96 119 102 C120 106 122 96 123 102 C124 106 126 96 127 102 C128 104 129 98 129 98" fill="none" stroke="${x.on ? "#fff" : "#8a6a3a"}" stroke-width="${x.on ? 1.2 : 0.8}" stroke-linecap="round"/>`;
        return svg(x, `${desk(x, "walnut")}${pool(x, 116, 167, 62, 8, 0.75)}
${shadow(x, 54, 171, 30, 3.6)}
<path d="M34 156 L74 156 L78 160 L30 160 Z" fill="${F(x, "woodv")}"/><rect x="30" y="160" width="48" height="11" rx="1" fill="${F(x, "wood")}"/>
<path d="M33 163 C44 162 52 166 64 164 S74 166 76 165 M34 167.5 C46 166 58 169 74 167" fill="none" stroke="#3e230e" stroke-opacity=".4" stroke-width=".6"/>
<ellipse cx="54" cy="157" rx="10" ry="2.6" fill="#4e1f0c"/><ellipse cx="54" cy="156" rx="9" ry="2.2" fill="${F(x, "copper")}"/>
${halo(x, 122, 102, 58, 0.85)}
${tube("M54 156 L54 56 Q54 46 64 46 L114 46 Q122 46 122 54 L122 62", "copper", 7.5)}
<rect x="48.5" y="104" width="11" height="9" rx="1.5" fill="${F(x, "copper")}"/><path d="M48.5 105.5 H59.5 M48.5 111.5 H59.5" stroke="#4e1f0c" stroke-opacity=".5" stroke-width=".7"/>
<rect x="49" y="150" width="10" height="6" rx="1.2" fill="${F(x, "copper")}"/>
<rect x="110" y="40.5" width="16" height="11" rx="3" fill="${F(x, "copper")}"/>
<rect x="49" y="42" width="11" height="11" rx="3" fill="${F(x, "copper")}"/>
<rect x="116.5" y="60" width="11" height="16" rx="1.5" fill="${F(x, "brass")}"/><path d="M116.5 64 H127.5 M116.5 68 H127.5 M116.5 72 H127.5" stroke="#5e3d12" stroke-opacity=".55" stroke-width=".7"/>
<path d="${glb}" fill="${x.on ? F(x, "fill") : "#fff"}" fill-opacity="${x.on ? x.k(1) : 0.08}" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
${fil}${x.on ? `<path d="${glb}" fill="${x.c}" opacity="${x.k(0.22)}"/>` : ""}
<path d="M110 92 C108 98 108 106 112 112" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>
<path d="M30 160 H78" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>`);
      }
    },
    {
      id: "piano", name: "Piano lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.38, r: 1.1 }, cast: "down",
      render(o) {
        const x = C(o);
        let staff = "";
        for (let g = 0; g < 2; g++) for (let i = 0; i < 5; i++) { const y = 161.4 + g * 6.6 + i * 1.05; staff += `M${n1(62 - (y - 160) * 0.3)} ${n1(y)} H${n1(130 + (y - 160) * 0.3)} `; }
        return svg(x, `${desk(x, "black")}
<path d="M64 159.5 L128 159.5 L132 174 L60 174 Z" fill="#f4efe2"/><path d="${staff}" stroke="#4a463e" stroke-opacity=".6" stroke-width=".35"/>
<g fill="#2a2620"><ellipse cx="74" cy="163" rx="1.2" ry=".8"/><ellipse cx="84" cy="162" rx="1.2" ry=".8"/><ellipse cx="96" cy="164" rx="1.2" ry=".8"/><ellipse cx="108" cy="169.6" rx="1.2" ry=".8"/><ellipse cx="118" cy="170.6" rx="1.2" ry=".8"/></g>
${pool(x, 98, 167, 68, 8)}
${beam(x, "M50 78 L28 168 L172 168 L150 78 Z", 0.42)}
${shadow(x, 156, 171, 22, 3.6)}
${disk(x, 156, 170, 18, 5, "brass")}
${tube("M156 165 L156 118 C156 92 144 78 116 74", "brass", 3.8)}
<rect x="152" y="140" width="8" height="5" rx="1.5" fill="${F(x, "brass")}"/>
${halo(x, 100, 82, 74, 0.6, 30)}
<path d="M48 58 L152 58 A6 9 0 0 1 152 76 L48 76 A6 9 0 0 1 48 58 Z" fill="${F(x, "brassv")}"/>
<path d="M48 58 L152 58 A6 9 0 0 1 152 76 L48 76 A6 9 0 0 1 48 58 Z" fill="${F(x, "gloss")}" opacity=".5"/>
<path d="M50 61.5 H150" stroke="#fff6d0" stroke-opacity=".8" stroke-width="1.4" stroke-linecap="round"/>
<ellipse cx="152" cy="67" rx="5" ry="9" fill="${F(x, "brass")}"/><ellipse cx="152" cy="67" rx="3" ry="6" fill="none" stroke="#5e3d12" stroke-opacity=".5" stroke-width=".7"/>
<ellipse cx="48" cy="67" rx="5" ry="9" fill="#8a5f22"/>
<path d="M50 75 L150 75 L148 79.5 L52 79.5 Z" fill="#2a241a"/>
${x.on ? `<path d="M53 75.6 L147 75.6 L145.5 78.8 L54.5 78.8 Z" fill="${F(x, "fill")}" opacity="${x.k(1)}"/><path d="M60 77 H140" stroke="#fff" stroke-width="1" opacity="${x.k(0.9)}"/>` : ""}`);
      }
    },
    {
      id: "ring-light", name: "Ring light", colors: DAY, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.36, r: 1.2 }, cast: "around",
      render(o) {
        const x = C(o);
        return svg(x, `${desk(x, "white")}${pool(x, 100, 167, 62, 8, 0.6)}
${x.on ? `<g class="${P}breath"><circle cx="100" cy="72" r="44" fill="none" stroke="${x.c}" stroke-width="26" opacity="${x.k(0.16)}"/><circle cx="100" cy="72" r="43" fill="none" stroke="${x.c}" stroke-width="10" opacity="${x.k(0.32)}"/></g>
<circle cx="100" cy="72" r="38" fill="${F(x, "halo")}" opacity="${x.k(0.3)}"/>` : ""}
${shadow(x, 100, 170, 30, 3)}
${leg(100, 146, 100, 166, 2.6, 2.2, "#2a2d33", 0.15)}${leg(100, 146, 74, 172, 2.8, 2.4, "#1b1d22")}${leg(100, 146, 126, 172, 2.8, 2.4, "#1b1d22")}
<circle cx="100" cy="146" r="4" fill="${F(x, "blk")}"/>
${rod(x, 100, 112, 146, 3.6, "blk")}<rect x="96.5" y="128" width="7" height="5" rx="1.5" fill="${F(x, "blk")}"/>
<circle cx="100" cy="72" r="43" fill="none" stroke="#141519" stroke-width="10"/>
<circle cx="100" cy="72" r="48" fill="none" stroke="#565b64" stroke-width="1.2"/>
<path d="M60 52 A44 44 0 0 1 92 29" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.4" stroke-linecap="round"/>
<circle cx="100" cy="72" r="43" fill="none" stroke="${x.on ? x.hot : "#d9dce1"}" stroke-width="5" opacity="${x.on ? x.k(1) : 0.35}"/>
${x.on ? `<circle cx="100" cy="72" r="43" fill="none" stroke="#fff" stroke-width="2" opacity="${x.k(0.85)}"/>` : ""}
<path d="M100 115 L100 96" stroke="#25272d" stroke-width="3"/>
<rect x="88" y="44" width="24" height="46" rx="4" fill="#111216"/><rect x="90" y="47" width="20" height="40" rx="2.5" fill="#1b2232"/>
<path d="M90 47 L104 47 L90 70 Z" fill="#fff" opacity=".07"/><circle cx="104" cy="51" r="1.6" fill="#2c3445"/><circle cx="104" cy="51" r=".7" fill="#4a5a7a"/>
<rect x="86" y="88" width="28" height="4" rx="1.5" fill="#25272d"/><rect x="86" y="42" width="28" height="4" rx="1.5" fill="#25272d"/>
<rect x="118" y="112" width="12" height="7" rx="2" fill="#24262c" transform="rotate(-20 124 115)"/><circle cx="124" cy="115" r="1.2" fill="${x.on ? x.c : "#55606b"}"/>`);
      }
    },
    {
      id: "magnifier", name: "Magnifier lamp", colors: DAY, picker: true, colorLabel: "Light", glow: { x: 0.65, y: 0.48, r: 1 }, cast: "down",
      render(o) {
        const x = C(o), u = x.u;
        const pcb = (cx, cy, s) => `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M-22 -5 L22 -5 L24 5 L-24 5 Z" fill="#1d6b45"/><rect x="-24" y="5" width="48" height="1.4" fill="#0e3a24"/>
<rect x="-12" y="-3" width="9" height="5" rx=".6" fill="#15171b"/><rect x="5" y="-2.6" width="6" height="4" rx=".6" fill="#15171b"/><rect x="-20" y="-1" width="4" height="2.4" fill="#c9a24a"/><circle cx="15" cy="2" r="1.8" fill="#2c3445"/>
<path d="M-3 -1 H5 M-12 2.6 L-16 3.6 M11 -1 L18 -3 M-6 2 L2 3.4 L14 3.6" fill="none" stroke="#e0c070" stroke-opacity=".8" stroke-width=".5"/></g>`;
        const lens = "M98 98 A30 11 0 1 0 158 98 A30 11 0 1 0 98 98 Z";
        return svg(x, `${desk(x, "mat")}${pcb(124, 166, 1.15)}
${pool(x, 124, 167, 50, 7.5)}
${beam(x, "M98 104 L84 168 L168 168 L158 104 Z", 0.4)}
${shadow(x, 38, 171, 22, 3.6)}
${disk(x, 38, 170, 18, 8, "cer")}
${rod(x, 38, 70, 162, 5, "alu")}<rect x="34" y="120" width="8" height="6" rx="1.5" fill="${F(x, "alu")}"/>
${spring(44, 76, 90, 82, 14, 2)}
${tube("M38 72 L96 84", "white", 3.4)}
<circle cx="38" cy="70" r="4.6" fill="${F(x, "alu")}"/><circle cx="97" cy="85" r="4.4" fill="${F(x, "alu")}"/>
${halo(x, 128, 104, 44, 0.75, 24)}
<path d="M92 98 A36 15 0 1 0 164 98 A36 15 0 1 0 92 98 Z" fill="${F(x, "aluv")}"/>
<path d="M92 98 A36 15 0 0 0 164 98 L164 101.5 A36 15 0 0 1 92 101.5 Z" fill="#9aa1a8"/>
${x.on ? `<path d="M96 101 A32 12 0 0 0 160 101" fill="none" stroke="${x.hot}" stroke-width="3" stroke-dasharray="2 1.6" opacity="${x.k(1)}"/>` : ""}
<defs><clipPath id="${u}-lens"><path d="${lens}"/></clipPath></defs>
<path d="${lens}" fill="#14261c"/>
<g clip-path="url(#${u}-lens)">${pcb(126, 100, 2.2)}<path d="${lens}" fill="${x.on ? x.c : "#000"}" opacity="${x.on ? x.k(0.18) : 0.25}"/></g>
<path d="${lens}" fill="${F(x, "gloss")}" opacity=".85"/>
<path d="M104 94 A26 8 0 0 1 128 88" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.4" stroke-linecap="round"/>
<path d="${lens}" fill="none" stroke="#5a6067" stroke-width="1"/>
<rect x="160" y="94" width="18" height="6" rx="3" fill="${F(x, "aluv")}" transform="rotate(8 160 97)"/>`);
      }
    },
    {
      id: "arc-slab", name: "LED slab", colors: DAY, picker: true, colorLabel: "Light", glow: { x: 0.35, y: 0.24, r: 1 }, cast: "down",
      render(o) {
        const x = C(o), arm = "M150 162 L150 76 C150 52 138 42 116 42";
        return svg(x, `${desk(x, "oak")}${mug(x, 60, 166, "#e8e2d6")}${notebook(x, 96, 168, 40, 8, "#c44d3a")}
${pool(x, 72, 167, 58, 8)}
${beam(x, "M34 47 L14 168 L132 168 L112 47 Z", 0.44)}
${shadow(x, 150, 170, 26, 3.4)}
<path d="M130 160 L170 160 L174 166 L126 166 Z" fill="${F(x, "aluv")}"/><rect x="126" y="166" width="48" height="4" rx="1" fill="${F(x, "alu")}"/>
<path d="M126.5 166.3 H173.5" stroke="#fff" stroke-width=".7"/>
<path d="${arm}" fill="none" stroke="#7d838a" stroke-width="5" stroke-linecap="round"/>
<path d="${arm}" fill="none" stroke="#eef1f4" stroke-width="3"/>
<path d="${arm}" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width=".8" transform="translate(-1 -.6)"/>
${halo(x, 72, 48, 52, 0.75, 18)}
<rect x="30" y="38" width="88" height="7.5" rx="2" fill="${F(x, "aluv")}"/><path d="M32 39.2 H116" stroke="#fff" stroke-width=".8"/>
<circle cx="110" cy="41.6" r="1.4" fill="${x.on ? x.c : "#9aa1a8"}"/>
${strip(x, 34, 44.5, 80, 2.8, "#b9bec4")}`);
      }
    },
    {
      id: "mushroom", name: "Mushroom lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.47, r: 1.1 }, cast: "around",
      render(o) {
        const x = C(o), cap = "M58 110 C58 80 76 62 100 62 C124 62 142 80 142 110 C128 115 72 115 58 110 Z";
        return svg(x, `${desk(x, "oak")}${pool(x, 100, 167, 70, 8, 0.75)}
${halo(x, 100, 96, 80, 0.62, 60)}
${shadow(x, 100, 167, 26, 3.4)}
<path d="M90 111 C92 130 90 150 82 164 L118 164 C110 150 108 130 110 111 Z" fill="${F(x, "wood")}"/>
<path d="M95 116 C96 132 94 148 90 160 M104 116 C104 134 106 150 110 160" fill="none" stroke="#3e230e" stroke-opacity=".35" stroke-width=".6"/>
<path d="M93 116 C94 132 92 150 87 162" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>
<ellipse cx="100" cy="164" rx="18" ry="3" fill="#6a4222"/>
${x.on ? `<ellipse cx="100" cy="112" rx="40" ry="5" fill="${F(x, "fill")}" opacity="${x.k(0.9)}"/>` : `<ellipse cx="100" cy="112" rx="40" ry="5" fill="#8a847c"/>`}
<path d="${cap}" fill="${x.on ? F(x, "lopal") : F(x, "opal")}"/>
${x.on ? `<path d="${cap}" fill="${F(x, "opal")}" opacity="${(0.7 - 0.6 * x.L).toFixed(2)}"/>` : ""}
<path d="${cap}" fill="${F(x, "gloss")}" opacity=".8"/>
<path d="M68 96 C72 80 84 70 98 67" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/>
<path d="M58.5 110 C72 114.6 128 114.6 141.5 110" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".8"/>`);
      }
    },
    {
      id: "lantern", name: "Cordless lantern", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.53, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), n = x.on ? Math.max(1, Math.round(x.L * 4)) : 0;
        let bat = "";
        for (let i = 0; i < 4; i++) bat += `<circle cx="${93 + i * 4.6}" cy="160" r="1" fill="${i < n ? "#63e6be" : "#3a3e46"}"/>`;
        return svg(x, `${desk(x, "white")}${book(x, 150, 167, 34)}
${pool(x, 100, 167, 64, 8, 0.75)}
${halo(x, 100, 108, 70, 0.7, 64)}
${shadow(x, 100, 168, 30, 3.6)}
<path d="M84 64 C84 34 116 34 116 64" fill="none" stroke="#0b0c0f" stroke-width="4.4" stroke-linecap="round"/>
<path d="M84 64 C84 34 116 34 116 64" fill="none" stroke="#4a4e55" stroke-width="2" stroke-linecap="round"/>
<path d="M86 56 C87 42 96 38 104 38" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
<path d="M74 72 C74 64 126 64 126 72 Z" fill="${F(x, "blk")}"/><rect x="72" y="71" width="56" height="6" rx="2" fill="${F(x, "blk")}"/>
<path d="M80 66.5 C90 64.6 110 64.6 120 66.5" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>
<rect x="77" y="77" width="46" height="72" fill="${x.on ? F(x, "ls") : F(x, "cer")}"/>
${x.on ? `<rect x="77" y="77" width="46" height="72" fill="${F(x, "cer")}" opacity="${(0.55 - 0.5 * x.L).toFixed(2)}"/><rect x="94" y="84" width="12" height="58" rx="6" fill="#fff" opacity="${x.k(0.55)}"/>` : `<rect x="96" y="84" width="8" height="58" rx="4" fill="#a39d95" opacity=".35"/>`}
<rect x="77" y="77" width="46" height="72" fill="${F(x, "cyl")}" opacity="${x.on ? 0.5 : 1}"/>
<path d="M82 82 L82 144" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>
<rect x="72" y="149" width="56" height="15" rx="2.5" fill="${F(x, "blk")}"/><path d="M73 150 H127" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>
${bat}<rect x="118" y="157.5" width="5" height="2" rx="1" fill="#0b0c0f"/>`);
      }
    },
    {
      id: "robot", name: "Robot lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.4, r: 1 }, cast: "down",
      render(o) {
        const x = C(o), n = x.on ? Math.max(1, Math.round(x.L * 4)) : 0, eye = x.on ? x.hot : "#3a3e46";
        let bars = "";
        for (let i = 0; i < 4; i++) bars += `<rect x="${86 + i * 7.5}" y="134" width="5" height="4" rx="1" fill="${i < n ? x.c : "#2c3036"}"/>`;
        return svg(x, `${desk(x, "maple")}
${pool(x, 100, 167, 70, 8)}
${beam(x, "M74 102 L44 168 L156 168 L126 102 Z", 0.42)}
${shadow(x, 100, 167, 40, 3.6)}
${tube("M72 130 C58 134 56 148 60 158", "white", 5)}${tube("M128 130 C142 134 144 148 140 158", "white", 5)}
<circle cx="60" cy="160" r="4.4" fill="${F(x, "cer")}"/><circle cx="140" cy="160" r="4.4" fill="${F(x, "cer")}"/>
<rect x="72" y="120" width="56" height="44" rx="9" fill="${F(x, "cer")}"/><rect x="72" y="120" width="56" height="44" rx="9" fill="${F(x, "gloss")}" opacity=".6"/>
<rect x="82" y="129" width="36" height="14" rx="3" fill="#15171c"/>${bars}
<circle cx="100" cy="153" r="3.2" fill="${F(x, "steel")}"/><circle cx="100" cy="153" r="1.4" fill="${x.on ? x.c : "#55606b"}"/>
<rect x="78" y="162" width="16" height="4" rx="2" fill="#7d776f"/><rect x="106" y="162" width="16" height="4" rx="2" fill="#7d776f"/>
${spring(100, 120, 100, 101, 7, 4)}
${halo(x, 100, 82, 56, 0.6, 40)}
<rect x="58" y="72" width="8" height="16" rx="3" fill="${F(x, "steel")}"/><rect x="134" y="72" width="8" height="16" rx="3" fill="${F(x, "steel")}"/>
<rect x="64" y="58" width="72" height="44" rx="11" fill="${F(x, "cer")}"/><rect x="64" y="58" width="72" height="44" rx="11" fill="${F(x, "gloss")}" opacity=".7"/>
<rect x="72" y="66" width="56" height="25" rx="8" fill="#14161b"/><path d="M76 70 C86 67 104 67 114 68" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.2" stroke-linecap="round"/>
${x.on ? `<circle cx="88" cy="78.5" r="9" fill="${F(x, "halo")}" opacity="${x.k(0.9)}"/><circle cx="112" cy="78.5" r="9" fill="${F(x, "halo")}" opacity="${x.k(0.9)}"/>` : ""}
<g class="${P}blink"><ellipse cx="88" cy="78.5" rx="5" ry="5.4" fill="${eye}"/><ellipse cx="112" cy="78.5" rx="5" ry="5.4" fill="${eye}"/></g>
<circle cx="86.4" cy="76.6" r="1.4" fill="#fff" opacity=".8"/><circle cx="110.4" cy="76.6" r="1.4" fill="#fff" opacity=".8"/>
<path d="M95 86 Q100 89 105 86" fill="none" stroke="${x.on ? x.hot : "#3a3e46"}" stroke-width="1.4" stroke-linecap="round"/>
<path d="M100 58 L100 44" stroke="#55606b" stroke-width="1.8"/>
${x.on ? `<circle cx="100" cy="41" r="9" fill="${F(x, "halo")}" opacity="${x.k(0.9)}"/>` : ""}
<circle cx="100" cy="41" r="4" fill="${x.on ? F(x, "fill") : "#c9c4bd"}"/><circle cx="98.6" cy="39.6" r="1.2" fill="#fff" opacity=".8"/>
<path d="M74 101 L126 101 L122 105 L78 105 Z" fill="#2a2d33"/>
${strip(x, 79, 101.4, 42, 3, "#55606b")}`);
      }
    },
    {
      id: "clip-on", name: "Clip-on lamp", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.36, y: 0.42, r: 0.9 }, cast: "down",
      render(o) {
        const x = C(o);
        const bk = (x0, y0, w, h, col, d) => `<path d="M${x0 + d} ${y0 - 4} L${x0 + w + d} ${y0 - 4} L${x0 + w} ${y0} L${x0} ${y0} Z" fill="#efe9db"/>
<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${col}"/><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${F(x, "cyl")}" opacity=".5"/>
<path d="M${x0 + 4} ${y0 + h / 2} H${x0 + w - 4}" stroke="#e8c870" stroke-opacity=".6" stroke-width=".8"/>`;
        return svg(x, `${desk(x, "white")}${notebook(x, 54, 167, 48, 10, "#7048a8")}
${pool(x, 56, 167, 50, 7.5)}
<g transform="translate(76 80) rotate(28)">${beam(x, "M-16 11 L-40 96 L40 96 L16 11 Z", 0.5)}</g>
${shadow(x, 146, 170, 38, 3.6)}
${bk(112, 152, 66, 16, "#2f5d8a", -3)}${bk(116, 140, 58, 12, "#a8432f", 2)}${bk(110, 130, 62, 10, "#3e7a55", -2)}
<path d="M114 126 L128 126 L128 132 L114 140 Z" fill="#1d1f24"/><path d="M114 126 L128 126" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>
<path d="M110 136 L124 136 L124 142 L110 144 Z" fill="#26282e"/>
<circle cx="126" cy="131" r="3" fill="none" stroke="#9aa1a8" stroke-width="1.2"/>
<path d="M120 126 C120 104 104 84 84 80" fill="none" stroke="#1a1c20" stroke-width="4.6" stroke-linecap="round"/>
<path d="M120 126 C120 104 104 84 84 80" fill="none" stroke="#8a9198" stroke-width="3.2" stroke-dasharray="1.2 1.3"/>
<g transform="translate(76 80) rotate(28)">
${x.on ? `<ellipse cx="0" cy="16" rx="30" ry="22" fill="${F(x, "halo")}" opacity="${x.k(0.85)}"/>` : ""}
<path d="M-18 10 C-18 -4 -10 -13 0 -13 C10 -13 18 -4 18 10 Z" fill="${F(x, "cer")}"/>
<path d="M-18 10 C-18 -4 -10 -13 0 -13 C10 -13 18 -4 18 10 Z" fill="${F(x, "gloss")}" opacity=".7"/>
<path d="M-13 2 C-12 -6 -7 -10 -2 -11" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>
<rect x="-3.5" y="-17" width="7" height="5" rx="1.5" fill="#2a2d33"/>
${opening(x, 0, 10, 18, 3.6, "#8f8981")}</g>`);
      }
    },
    {
      id: "bauhaus", name: "Opal dome", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.4, r: 1.1 }, cast: "around",
      render(o) {
        const x = C(o), dome = "M58 94 C58 64 78 46 100 46 C122 46 142 64 142 94 Z";
        return svg(x, `${desk(x, "walnut")}${pool(x, 100, 168, 72, 8)}
${beam(x, "M58 96 L30 168 L170 168 L142 96 Z", 0.3)}
${halo(x, 100, 82, 80, 0.62, 58)}
${shadow(x, 100, 170, 30, 3)}
<ellipse cx="100" cy="168" rx="26" ry="5" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>
<path d="M74 165 L74 168 A26 5 0 0 0 126 168 L126 165" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>
<ellipse cx="100" cy="165" rx="26" ry="5" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>
<path d="M80 164 A22 3.6 0 0 1 104 161.6" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>
<ellipse cx="100" cy="164" rx="7" ry="2" fill="${F(x, "steel")}"/>
<rect x="95" y="96" width="10" height="68" rx="2" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-opacity=".4" stroke-width=".8"/>
<path d="M100 98 C98 120 102 140 100 164" fill="none" stroke="#26282e" stroke-width="1"/>
<path d="M97 98 V162" stroke="#fff" stroke-opacity=".55" stroke-width=".9"/>
<rect x="94" y="94" width="12" height="5" rx="1.5" fill="${F(x, "steel")}"/>
${x.on ? `<ellipse cx="100" cy="94" rx="40" ry="4.5" fill="${F(x, "fill")}" opacity="${x.k(0.95)}"/>` : ""}
<path d="${dome}" fill="${x.on ? F(x, "lopal") : F(x, "opal")}"/>
${x.on ? `<path d="${dome}" fill="${F(x, "opal")}" opacity="${(0.7 - 0.6 * x.L).toFixed(2)}"/>` : ""}
<path d="${dome}" fill="${F(x, "gloss")}" opacity=".8"/>
<path d="M68 82 C70 66 82 54 96 51" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="100" cy="94" rx="42" ry="4.5" fill="none" stroke="${x.on ? x.hot : "#b9b2a8"}" stroke-width="1.2" opacity="${x.on ? x.k(1) : 1}"/>
<rect x="96" y="41" width="8" height="6" rx="2" fill="${F(x, "steel")}"/><circle cx="100" cy="40" r="2.6" fill="${F(x, "steel")}"/>`);
      }
    },
    {
      id: "daylight", name: "Daylight panel", colors: DAY, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.42, r: 1.3 }, cast: "around",
      render(o) {
        const x = C(o), u = x.u;
        const ex = `<pattern id="${u}-prism" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#fff" fill-opacity=".35"/></pattern>`;
        return svg(x, `${desk(x, "white")}${pool(x, 100, 167, 80, 8, 0.75)}
${halo(x, 100, 84, 96, 0.55, 86)}
${mug(x, 168, 166, "#4f7a9a")}
${shadow(x, 100, 167, 42, 3.4)}
<path d="M70 160 L130 160 L136 166 L64 166 Z" fill="${F(x, "cerv")}"/><rect x="64" y="166" width="72" height="3" rx="1" fill="#a7a29a"/>
<rect x="93" y="140" width="14" height="21" fill="${F(x, "cer")}"/>
<rect x="42" y="24" width="116" height="120" rx="10" fill="${F(x, "cerv")}"/><rect x="42" y="24" width="116" height="120" rx="10" fill="${F(x, "cyl")}" opacity=".6"/>
<path d="M50 26 H150" stroke="#fff" stroke-width="1"/>
<rect x="50" y="32" width="100" height="100" rx="5" fill="${x.on ? F(x, "lsv") : "#c9cdd2"}"/>
${x.on ? `<rect x="50" y="32" width="100" height="100" rx="5" fill="#d0d4d8" opacity="${(0.5 - 0.48 * x.L).toFixed(2)}"/><rect x="58" y="40" width="84" height="84" rx="4" fill="#fff" opacity="${x.k(0.5)}"/>` : ""}
<rect x="50" y="32" width="100" height="100" rx="5" fill="url(#${u}-prism)"/>
<path d="M50 32 L96 32 L56 132 L50 132 Z" fill="#fff" opacity="${x.on ? 0.1 : 0.18}"/>
<rect x="50" y="32" width="100" height="100" rx="5" fill="none" stroke="#000" stroke-opacity=".15" stroke-width=".8"/>
<circle cx="140" cy="138" r="1.8" fill="${x.on ? "#63e6be" : "#a7a29a"}"/><circle cx="132" cy="138" r="1.8" fill="#bdb8b0"/>`, ex);
      }
    },
    {
      id: "shelf-bar", name: "Under-shelf bar", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.25, r: 1.2 }, cast: "down",
      render(o) {
        const x = C(o);
        const books = [[16, 9, "#8e3b46", 22], [26, 7, "#c9a14a", 24], [34, 10, "#2f5d8a", 20], [45, 6, "#e8e2d6", 23], [52, 9, "#3e7a55", 21], [150, 8, "#5b4a8a", 22], [159, 10, "#b85c38", 24], [170, 7, "#2a2d33", 20]];
        const bk = books.map((b) => `<rect x="${b[0]}" y="${34 - b[3]}" width="${b[1]}" height="${b[3]}" rx=".8" fill="${b[2]}"/><rect x="${b[0]}" y="${34 - b[3]}" width="${b[1]}" height="${b[3]}" fill="${F(x, "cyl")}" opacity=".6"/><path d="M${b[0] + 1.5} ${34 - b[3] * 0.7} H${b[0] + b[1] - 1.5}" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`).join("");
        return svg(x, `${desk(x, "oak")}
${pool(x, 100, 167, 82, 8)}
${beam(x, "M44 49 L16 168 L184 168 L156 49 Z", 0.36)}
${shadow(x, 96, 166, 40, 3)}
<path d="M60 159 L132 159 L138 166 L54 166 Z" fill="${F(x, "aluv")}"/><path d="M68 160.5 L124 160.5 L127 164 L65 164 Z" fill="#2c3036" opacity=".7"/>
<rect x="54" y="166" width="84" height="2" rx="1" fill="#8d939a"/>
<path d="M62 159 L130 159 L126 116 L66 116 Z" fill="#c2c7cd"/><path d="M65 156.5 L127 156.5 L123.6 119 L68.4 119 Z" fill="#111722"/>
<path d="M70 124 H100 M70 130 H112 M70 136 H92" stroke="#7fa3d8" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
<path d="M68.4 119 L94 119 L74 156.5 L65 156.5 Z" fill="#fff" opacity=".05"/>
${shadow(x, 162, 167, 16, 2.6)}
<path d="M150 146 L174 146 L171 166 L153 166 Z" fill="#b5653f"/><path d="M150 146 L174 146 L171 166 L153 166 Z" fill="${F(x, "cyl")}"/><rect x="148.5" y="144" width="27" height="4" rx="1" fill="#c97a58"/>
<path d="M162 144 C156 130 148 128 144 122 M162 144 C162 128 166 122 170 116 M162 144 C168 134 176 134 180 128 M162 144 C158 134 156 124 158 114" fill="none" stroke="#4f9a5a" stroke-width="3.2" stroke-linecap="round"/>
<path d="M162 144 C162 128 166 122 170 116 M162 144 C168 134 176 134 180 128" fill="none" stroke="#9fe0a0" stroke-opacity=".4" stroke-width="1"/>
${bk}
<path d="M8 34 L192 34 L192 44 L8 44 Z" fill="${F(x, "woodv")}"/><path d="M8 34.5 H192" stroke="#f1cfa3" stroke-opacity=".8" stroke-width=".8"/><path d="M8 44 H192" stroke="#4f2e15" stroke-width=".8"/>
<path d="M28 44 L34 44 L34 62 Z M166 44 L172 44 L166 62 Z" fill="#26282e"/>
${halo(x, 100, 50, 80, 0.6, 16)}
<rect x="44" y="44" width="112" height="5" rx="1.5" fill="${F(x, "aluv")}"/>
${strip(x, 47, 47.6, 106, 2.4, "#b9bec4")}`);
      }
    },
    {
      id: "rgb-bars", name: "Gaming light bars", colors: RGB, picker: true, colorLabel: "Light", glow: { x: 0.5, y: 0.45, r: 1.4 }, cast: "around",
      render(o) {
        const x = C(o);
        const bar = (cx) => {
          let seg = "";
          if (x.on) for (let i = 0; i < 4; i++) seg += `<g opacity="${x.k(0.75)}"><rect class="${P}chase" style="animation-delay:-${(i * 0.45).toFixed(2)}s" x="${cx - 1.6}" y="${140 - i * 15}" width="3.2" height="12" rx="1.6" fill="#fff"/></g>`;
          return `${shadow(x, cx, 167, 12, 2.4)}${disk(x, cx, 167, 10, 4, "blk")}
<rect x="${cx - 5}" y="82" width="10" height="82" rx="5" fill="${F(x, "blk")}"/>
<rect x="${cx - 3}" y="85" width="6" height="74" rx="3" fill="${x.on ? F(x, "lsv") : "#2a2d33"}" opacity="${x.on ? x.k(1) : 1}"/>${seg}
<path d="M${cx - 3.6} 86 V158" stroke="#fff" stroke-opacity=".25" stroke-width=".7"/>`;
        };
        const kc = x.on ? x.H.mix(x.c, "#ffffff", 0.2) : "#4a4e57";
        return svg(x, `${x.on ? `<g class="${P}breath"><ellipse cx="34" cy="110" rx="56" ry="80" fill="${F(x, "halo")}" opacity="${x.k(0.75)}"/><ellipse cx="166" cy="110" rx="56" ry="80" fill="${F(x, "halo")}" opacity="${x.k(0.75)}"/></g><ellipse cx="100" cy="96" rx="80" ry="54" fill="${F(x, "halo")}" opacity="${x.k(0.35)}"/>` : ""}
${desk(x, "black")}
${pool(x, 34, 167, 30, 6)}${pool(x, 166, 167, 30, 6)}${pool(x, 100, 168, 52, 6, 0.4)}
${shadow(x, 100, 163, 24, 3)}
<path d="M84 164 C84 160 116 160 116 164 Z" fill="#1d1f24"/><rect x="95" y="130" width="10" height="32" fill="#25272d"/>
<rect x="50" y="62" width="100" height="70" rx="3" fill="#0d0e12"/><rect x="50" y="62" width="100" height="70" rx="3" fill="none" stroke="#33363d" stroke-width="1"/>
<rect x="54" y="66" width="92" height="58" rx="1.5" fill="#0c1018"/>
<path d="M54 106 L80 88 L96 100 L118 80 L146 98 L146 124 L54 124 Z" fill="#1e2a44" opacity=".9"/><circle cx="128" cy="76" r="5" fill="#ffb36b" opacity=".55"/>
${x.on ? `<rect x="54" y="66" width="92" height="58" rx="1.5" fill="${x.c}" opacity="${x.k(0.08)}"/>` : ""}
<path d="M54 66 L92 66 L64 124 L54 124 Z" fill="#fff" opacity=".05"/>
${bar(30)}${bar(170)}
${keyboard(x, 100, 170, 78, kc)}
${x.on ? `<path d="M64 170.5 H136" stroke="${x.c}" stroke-width="5" opacity="${x.k(0.25)}"/>` : ""}`);
      }
    },
    {
      id: "cube", name: "Glass cube", colors: WARM, picker: true, colorLabel: "Light", glow: { x: 0.51, y: 0.58, r: 1 }, cast: "around",
      render(o) {
        const x = C(o), fr = "M72 96 L122 96 L122 150 L72 150 Z", tp = "M72 96 L84 86 L134 86 L122 96 Z", sd = "M122 96 L134 86 L134 140 L122 150 Z";
        const face = (d, sh) => `<path d="${d}" fill="${x.on ? F(x, "lopal") : F(x, "opal")}"/>${x.on ? `<path d="${d}" fill="${F(x, "opal")}" opacity="${(0.62 - 0.56 * x.L).toFixed(2)}"/>` : ""}${sh ? `<path d="${d}" fill="#000" opacity="${sh}"/>` : ""}`;
        return svg(x, `${desk(x, "walnut")}${pool(x, 102, 168, 66, 8, 0.8)}
${halo(x, 102, 118, 70, 0.7, 62)}
${shadow(x, 100, 167, 42, 3.4)}
<path d="M70 150 L130 150 L136 156 L64 156 Z" fill="${F(x, "woodv")}"/><rect x="64" y="156" width="72" height="10" rx="1" fill="${F(x, "wood")}"/>
<path d="M66 159 C80 158 92 162 110 160 S130 162 134 161 M66 163 C84 162 100 165 134 163" fill="none" stroke="#3e230e" stroke-opacity=".35" stroke-width=".6"/>
<path d="M64 156 H136" stroke="#f1cfa3" stroke-opacity=".5" stroke-width=".6"/>
${x.on ? `<path d="M74 151 L124 151 L132 145 L128 149" fill="none" stroke="${x.hot}" stroke-width="1.4" opacity="${x.k(0.8)}"/>` : ""}
${face(fr)}${face(tp, x.on ? 0 : -0)}${face(sd, 0.16)}
${x.on ? `<path d="${tp}" fill="#fff" opacity="${x.k(0.4)}"/>` : `<path d="${tp}" fill="#fff" opacity=".25"/>`}
<path d="${fr}" fill="${F(x, "gloss")}" opacity=".6"/>
<path d="M72 96 L122 96 L134 86 M122 96 L122 150" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>
<path d="M72 96 L84 86 L134 86 L134 140 L122 150 L72 150 Z" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8"/>
<path d="M77 102 L77 144" stroke="#fff" stroke-opacity=".45" stroke-width="1.8" stroke-linecap="round"/>`);
      }
    }
  ];

  const C2T = {"architect": {"l": "Housing", "ids": ["blk"], "c": ["#1e1f26", "#eceae6", "#c9a24a", "#b23a3a", "#2f6f6a", "#e8c44a"]}, "banker": {"l": "Glass", "ids": ["ggl"], "c": ["#177040", "#d4a548", "#2a5aa8", "#a8322a", "#e8e2d6"]}, "monitor-bar": {"l": "Housing", "ids": ["blkv"], "c": ["#2c2f36", "#d9dde2", "#eceae6", "#5a6067"]}, "gooseneck": {"l": "Housing", "ids": ["blk", "blkv"], "c": ["#2c2f36", "#eceae6", "#c9a24a", "#3a5a8a", "#9aa1a8"]}, "clamp-task": {"l": "Housing", "ids": ["alu", "aluv"], "c": ["#d7dbe0", "#2a2c31", "#eceae6", "#e8833a", "#3a6a8a"]}, "charger": {"l": "Body", "ids": ["cer", "cerv"], "c": ["#e4dfd7", "#2a2c31", "#a8c4b0", "#e8c4c8", "#c9b48a"]}, "copper-pipe": {"l": "Finish", "ids": ["copper"], "c": ["#b8622f", "#c99a3e", "#2a2c31", "#9aa1a8", "#5a4636"]}, "piano": {"l": "Finish", "ids": ["brass", "brassv"], "c": ["#c99a3e", "#9aa1a8", "#2a2c31", "#2f5a3a", "#5a4636"]}, "magnifier": {"l": "Housing", "ids": ["alu", "aluv"], "c": ["#d7dbe0", "#2a2c31", "#eceae6", "#3a6a8a"]}, "arc-slab": {"l": "Housing", "ids": ["alu", "aluv"], "c": ["#d7dbe0", "#2a2c31", "#c9a24a", "#eceae6"]}, "mushroom": {"l": "Glass", "ids": ["opal"], "c": ["#d6d0c7", "#e0b06a", "#8a8f99", "#e8b4c0", "#9fc8a8", "#f4efe6"]}, "lantern": {"l": "Body", "ids": ["cer"], "c": ["#e4dfd7", "#2a2c31", "#a8c4b0", "#e8833a", "#3a5a8a"]}, "robot": {"l": "Body", "ids": ["cer"], "c": ["#e4dfd7", "#2a2c31", "#e8c44a", "#6ab0e8", "#e86a6a"]}, "clip-on": {"l": "Shade", "ids": ["cer"], "c": ["#e4dfd7", "#2a2c31", "#a8322a", "#2f5d8a", "#3e7a55", "#e8c870"]}, "bauhaus": {"l": "Glass", "ids": ["opal"], "c": ["#d6d0c7", "#e0b06a", "#8a8f99", "#e8b4c0", "#9fc8a8", "#f4efe6"]}, "daylight": {"l": "Housing", "ids": ["cer", "cerv"], "c": ["#e4dfd7", "#2a2c31", "#a8b0b8", "#c9b48a"]}, "cube": {"l": "Glass", "ids": ["opal"], "c": ["#d6d0c7", "#e0b06a", "#8a8f99", "#e8b4c0", "#9fc8a8"]}};
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
    id: "desk", tab: "Desk lamps", group: "Lights", kind: "light",
    intro: "Twenty desk lamps for the study, office and workbench, each on its own bit of desk so you can see the pool of light it throws.",
    
    css: `.hda-desk-breath{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-desk-breath{animation:hda-desk-breath 4.2s ease-in-out infinite}
.hda-anim .hda-desk-beam{animation:hda-desk-beam 3.6s ease-in-out infinite}
.hda-anim .hda-desk-pulse{animation:hda-desk-pulse 2.4s ease-in-out infinite}
.hda-desk-blink{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-desk-blink{animation:hda-desk-blink 5s ease-in-out infinite}
.hda-anim .hda-desk-chase{animation:hda-desk-chase 1.8s ease-in-out infinite}
@keyframes hda-desk-breath{50%{transform:scale(1.05);opacity:.72}}
@keyframes hda-desk-beam{50%{opacity:.72}}
@keyframes hda-desk-pulse{50%{opacity:.25}}
@keyframes hda-desk-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes hda-desk-chase{0%,100%{opacity:.1}50%{opacity:.85}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-desk-breath,.hda-anim .hda-desk-beam,.hda-anim .hda-desk-pulse,.hda-anim .hda-desk-blink,.hda-anim .hda-desk-chase{animation:none!important}}`,
    icons
  });
})();
