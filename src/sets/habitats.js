
(function () {
  const P = "hda-habitats-";
  const H = () => window.HDAH;
  const n1 = (v) => (+v).toFixed(1);
  const GREEN = "#34d399", RED = "#ff5257", ORNG = "#ff9a4a", CYAN = "#7dd3fc", AMB = "#ffb547";
  const CU = ["#4f2410", "#b8693a", "#ffd2ae"], PVC = ["#7f868e", "#e4e7ea", "#ffffff"], IRON = ["#08090b", "#34373d", "#8d939b"],
    GALV = ["#4b5158", "#a9b0b7", "#eef1f3"], HOSE = ["#123d1a", "#2f8a3e", "#9be3a6"], BLKP = ["#050608", "#24272c", "#6f757d"];
  const dur = (o, a, b) => n1(Math.max(.25, a - b * o.level));

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .7;
    return { l: h.shade(c, lt ? .6 : .38), m: c, d: h.shade(c, lt ? -.16 : -.32), k: h.shade(c, lt ? -.36 : -.58), lt };
  }
  const st = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("");
  const lg = (id, v, a) => `<linearGradient id="${id}" ${v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"'}>${st(a)}</linearGradient>`;
  const rg = (id, a, at) => `<radialGradient id="${id}" ${at || ""}>${st(a)}</radialGradient>`;
  const halo = (id, c) => rg(id, [[0, c, .85], [.45, c, .28], [1, c, 0]]);

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
${lg(u + "-v", 1, [[0, p.l], [.5, p.m], [1, p.d]])}${lg(u + "-c", 0, [[0, p.k], [.2, p.m], [.4, p.l], [.62, p.m], [1, p.k]])}
${lg(u + "-tp", 0, [[0, p.d], [.4, p.l], [1, p.d]])}${lg(u + "-sd", 0, [[0, p.d], [1, p.k]])}
${lg(u + "-fx", 0, [[0, "#fff", .2], [.14, "#fff", 0], [.84, "#000", 0], [1, "#000", .3]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1">${st([[0, "#fff", .5], [.42, "#fff", 0]])}</linearGradient>
${lg(u + "-wall", 1, [[0, "#fff", .085], [1, "#fff", .035]])}${lg(u + "-flr", 1, [[0, "#a3a8ae", .34], [1, "#5d6369", .2]])}
${lg(u + "-mt", 0, [[0, "#525960"], [.35, "#eef0f2"], [.6, "#b9bfc6"], [1, "#454b52"]])}${lg(u + "-mtv", 1, [[0, "#f2f4f6"], [.5, "#a2a9b1"], [1, "#545a61"]])}
${lg(u + "-bs", 0, [[0, "#5e3f10"], [.35, "#f6d886"], [.6, "#c9973a"], [1, "#4e340c"]])}${lg(u + "-bsv", 1, [[0, "#f9e09a"], [.5, "#c18f34"], [1, "#5e3f10"]])}
${lg(u + "-bk", 1, [[0, "#41464e"], [.5, "#1b1e23"], [1, "#08090c"]])}${lg(u + "-bkh", 0, [[0, "#08090c"], [.38, "#454a52"], [1, "#0b0d10"]])}
${lg(u + "-lcd", 1, [[0, "#081014"], [1, "#16242b"]])}${lg(u + "-lcdg", 1, [[0, "#b9d7a3"], [1, "#8fb37c"]])}
${lg(u + "-wt", 1, [[0, "#86d4f6", .8], [.3, "#3d8fd0", .85], [1, "#123f7a", .95]])}
${lg(u + "-soil", 1, [[0, "#5b4431"], [1, "#2a1e14"]])}${lg(u + "-grass", 1, [[0, "#2f6a2a"], [1, "#48923c"]])}
${lg(u + "-sky", 1, [[0, "#0d1a2e", 0], [1, "#3a5a7a", .35]])}${lg(u + "-hedge", 1, [[0, "#2e5a2a"], [1, "#16301a"]])}
${lg(u + "-pvc", 0, [[0, "#80878f"], [.35, "#ffffff"], [.7, "#d9dde1"], [1, "#7a8189"]])}
${rg(u + "-sh", [[0, "#000", .6], [1, "#000", 0]])}
${halo(u + "-hg", GREEN)}${halo(u + "-hr", RED)}${halo(u + "-ho", ORNG)}${halo(u + "-hb", CYAN)}
${rg(u + "-fl", [[0, "#f2fbff"], [.3, "#7ab8ff"], [.75, "#2a5cff", .85], [1, "#1b3fd6", 0]], 'cx=".5" cy=".85" r=".8"')}
${rg(u + "-warm", [[0, "#ffb35c", .8], [.5, "#ff8a3c", .3], [1, "#ff7a2a", 0]])}
${rg(u + "-dial", [[0, "#ffffff"], [.8, "#e9ecef"], [1, "#9aa1a9"]], 'cx=".4" cy=".35" r=".75"')}
${rg(u + "-mist", [[0, "#dff4ff", .5], [1, "#dff4ff", 0]])}
<pattern id="${u}-blk" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 .5H40M0 10.5H40M.5 0V10.5M20.5 10.5V20" stroke="#000" stroke-opacity=".32" fill="none"/><path d="M0 1.5H40M0 11.5H40" stroke="#fff" stroke-opacity=".06" fill="none"/></pattern>
<pattern id="${u}-brk" width="24" height="10" patternUnits="userSpaceOnUse"><rect width="24" height="10" fill="#9a4a32" fill-opacity=".55"/><rect x="1" y="1" width="22" height="3.6" fill="#b85d40" fill-opacity=".45"/><path d="M0 .5H24M0 5.5H24M.5 0V5.5M12.5 5.5V10" stroke="#d8cfc4" stroke-opacity=".45" fill="none"/></pattern>
<pattern id="${u}-sid" width="40" height="11" patternUnits="userSpaceOnUse"><rect width="40" height="11" fill="#c9cfd4" fill-opacity=".16"/><path d="M0 10.5H40" stroke="#000" stroke-opacity=".35"/><path d="M0 9H40" stroke="#fff" stroke-opacity=".1" stroke-width="2"/></pattern>
<pattern id="${u}-bld" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M1 9L2 3M4 9L5.5 1.5M7 9L6.5 4" stroke="#7fc56e" stroke-opacity=".5" stroke-width=".8" fill="none"/><path d="M2.5 9L3.5 5" stroke="#16361a" stroke-opacity=".6" stroke-width=".8"/></pattern>
<pattern id="${u}-plt" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M2.5 0V5" stroke="#000" stroke-opacity=".18"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, `<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath>` + (extra || ""))}<g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${r} ${r} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${r} ${r} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${r} ${r} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${r} ${r} 0 0 1 ${n1(x + r)} ${n1(y)}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .4}" stroke-width="${w || 2}" stroke-linecap="round"/>`;

  
  const tube = (d, w, c, cap) => `<path d="${d}" fill="none" stroke="${c[0]}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="${cap || "butt"}"/>` +
    `<path d="${d}" fill="none" stroke="${c[1]}" stroke-width="${n1(w * .66)}" stroke-linejoin="round" stroke-linecap="${cap || "butt"}"/>` +
    `<path d="${d}" fill="none" stroke="${c[2]}" stroke-opacity=".7" stroke-width="${n1(w * .2)}" stroke-linejoin="round" transform="translate(${n1(-w * .17)} ${n1(-w * .17)})"/>`;
  
  const band = (x, y, w, h, c) => `<rect x="${n1(x - w / 2)}" y="${n1(y - h / 2)}" width="${w}" height="${h}" rx="1.2" fill="${c[1]}" stroke="${c[0]}" stroke-width=".8"/><rect x="${n1(x - w / 2 + 1)}" y="${n1(y - h / 2 + 1)}" width="${n1(w * .3)}" height="${n1(h - 2)}" rx=".8" fill="${c[2]}" opacity=".5"/>`;
  
  const flow = (o, d, w, col, a, b) => o.on ? `<path class="${P}flow" d="${d}" fill="none" stroke="${col || "#bfeaff"}" stroke-opacity=".75" stroke-width="${w || 2.4}" stroke-linecap="round" stroke-dasharray="2.5 7" style="animation-duration:${dur(o, a || 1.2, b || .85)}s"/>` : "";
  const led = (o, x, y, r, on, col, hid) => (on ? `<circle cx="${x}" cy="${y}" r="${r * 4.5}" fill="url(#${o.uid}-${hid})"/>` : "") +
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${on ? col : "#353a41"}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .35)}" r="${n1(r * .4)}" fill="#fff" opacity="${on ? .8 : .3}"/>`;
  const state = (o, x, y, r) => led(o, x, y, r, true, o.on ? GREEN : RED, o.on ? "hg" : "hr");
  const screw = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 1.6}" fill="#8b929a"/><path d="M${n1(x - (r || 1.6) * .7)} ${y}H${n1(x + (r || 1.6) * .7)}" stroke="#3a3f46" stroke-width=".6"/>`;

  
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgecd", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function digits(str, x, y, s, col, dim) {
    const w = s * .52, t = Math.max(.7, s * .14); let out = "", X = x;
    String(str).split("").forEach((ch) => {
      if (ch === ".") { out += `<circle cx="${n1(X - t * .4)}" cy="${n1(y + s)}" r="${n1(t * .55)}" fill="${col}"/>`; X += t * .9; return; }
      const sg = { a: [X + t * .6, y, X + w - t * .6, y], b: [X + w, y + t * .6, X + w, y + s / 2 - t * .5], c: [X + w, y + s / 2 + t * .5, X + w, y + s - t * .6],
        d: [X + t * .6, y + s, X + w - t * .6, y + s], e: [X, y + s / 2 + t * .5, X, y + s - t * .6], f: [X, y + t * .6, X, y + s / 2 - t * .5], g: [X + t * .6, y + s / 2, X + w - t * .6, y + s / 2] };
      const on = SEG[ch] || "";
      for (const k in sg) { const q = sg[k], lit = on.indexOf(k) >= 0; if (!lit && !dim) continue;
        out += `<path d="M${n1(q[0])} ${n1(q[1])}L${n1(q[2])} ${n1(q[3])}" stroke="${lit ? col : dim}" stroke-width="${n1(t)}" stroke-linecap="round"/>`; }
      X += w + t * 2.2;
    });
    return out;
  }
  const lcd = (o, x, y, w, h, str, s, col) => `<path d="${rr(x, y, w, h, 2)}" fill="url(#${o.uid}-lcd)" stroke="#000" stroke-opacity=".5"/>` +
    (o.on ? `<path d="${rr(x, y, w, h, 2)}" fill="${col}" fill-opacity=".08"/>` : "") +
    digits(str, x + (w - str.replace(".", "").length * s * .82) / 2 + s * .1, y + (h - s) / 2, s, o.on ? col : "#2b3a40", o.on ? H().rgba(col, .1) : null) +
    `<path d="M${x + 1.5} ${y + 1.5}H${x + w * .6}" stroke="#fff" stroke-opacity=".12"/>`;

  
  const room = (o, fy, wall) => `<g class="hda-bg">${room0(o, fy, wall)}</g>`;
  function room0(o, fy, wall) {
    const u = o.uid;
    let s = `<rect width="200" height="${fy}" fill="url(#${u}-wall)"/>`;
    if (wall === "block") s += `<rect width="200" height="${fy}" fill="url(#${u}-blk)"/>`;
    if (wall === "brick") s += `<rect width="200" height="${fy}" fill="url(#${u}-brk)"/>`;
    if (wall === "siding") s += `<rect width="200" height="${fy}" fill="url(#${u}-sid)"/>`;
    if (wall === "board") s += `<rect x="18" y="8" width="164" height="${fy - 28}" fill="#c9a77a" fill-opacity=".16" stroke="#000" stroke-opacity=".3"/>` + [20, 34, 52, 75, 96, 118, 136].map((y, i) => `<path d="M18 ${y}C60 ${y + (i % 2 ? 3 : -3)} 120 ${y + (i % 2 ? -2 : 3)} 182 ${y}" fill="none" stroke="#6a4a2a" stroke-opacity=".22" stroke-width=".8"/>`).join("") + [40, 80, 120, 160].map((x) => `<circle cx="${x}" cy="${fy / 2}" r=".9" fill="#000" fill-opacity=".4"/>`).join("");
    if (wall === "grass") return s + `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-grass)"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-bld)"/>`;
    s += `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-flr)"/><path d="M0 ${fy}H200" stroke="#000" stroke-opacity=".35"/><path d="M0 ${fy + 1}H200" stroke="#fff" stroke-opacity=".08"/>`;
    [[30, .3], [72, .62], [128, .4], [164, .78], [100, .88], [14, .72]].forEach((p) => { s += `<circle cx="${p[0]}" cy="${n1(fy + (200 - fy) * p[1])}" r=".8" fill="#fff" fill-opacity=".14"/>`; });
    return s;
  }
  
  const face = (o, d, g) => `<path d="${d}" fill="url(#${o.uid}-${g || "v"})"/><path d="${d}" fill="url(#${o.uid}-fx)"/><path d="${d}" fill="url(#${o.uid}-g)" opacity=".28"/>`;
  
  function tank(o, x, y, w, b, g) {
    const u = o.uid, r = w / 2, d = `M${x} ${y + 8}Q${x} ${y - 4} ${x + r} ${y - 5}Q${x + w} ${y - 4} ${x + w} ${y + 8}V${b - 4}Q${x + w} ${b} ${x + w - 4} ${b}H${x + 4}Q${x} ${b} ${x} ${b - 4}Z`;
    return `<path d="${d}" fill="url(#${u}-${g || "c"})"/><path d="${d}" fill="url(#${u}-g)" opacity=".2"/>` +
      `<path d="M${x} ${y + 8}Q${x + r} ${y + 13} ${x + w} ${y + 8}" fill="none" stroke="#000" stroke-opacity=".25"/>` +
      `<path d="M${x + w * .3} ${y + 14}V${b - 8}" stroke="#fff" stroke-opacity=".22" stroke-width="${n1(w * .05)}" stroke-linecap="round"/>`;
  }
  
  function flames(o, cx, by, w, n) {
    if (!o.on) return "";
    const u = o.uid, s = .6 + .55 * o.level; let f = `<ellipse cx="${cx}" cy="${by - 3}" rx="${n1(w * .8)}" ry="${n1(9 * s)}" fill="url(#${u}-warm)" opacity=".55"/>`;
    for (let i = 0; i < n; i++) {
      const x = cx - w / 2 + (i + .5) * w / n, h = (i % 2 ? 7 : 10) * s;
      f += `<path class="${P}flk" style="animation-delay:-${n1(i * .17)}s" d="M${n1(x - 2.6)} ${by}Q${n1(x - 2.4)} ${n1(by - h * .55)} ${n1(x)} ${n1(by - h)}Q${n1(x + 2.4)} ${n1(by - h * .55)} ${n1(x + 2.6)} ${by}Z" fill="url(#${u}-fl)"/>`;
    }
    return f;
  }
  
  function gauge(o, x, y, r, v) {
    const a = (-130 + 260 * v) * Math.PI / 180, nx = x + Math.sin(a) * r * .72, ny = y - Math.cos(a) * r * .72;
    let t = "";
    for (let i = 0; i <= 8; i++) { const b = (-130 + 32.5 * i) * Math.PI / 180; t += `<path d="M${n1(x + Math.sin(b) * r * .62)} ${n1(y - Math.cos(b) * r * .62)}L${n1(x + Math.sin(b) * r * .8)} ${n1(y - Math.cos(b) * r * .8)}" stroke="#2a2f36" stroke-width=".6"/>`; }
    return `<circle cx="${x}" cy="${y}" r="${r + 1.6}" fill="url(#${o.uid}-mtv)"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${o.uid}-dial)"/>${t}` +
      `<path d="M${x} ${y}L${n1(nx)} ${n1(ny)}" stroke="#d12f2f" stroke-width="1.1" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="1.3" fill="#222"/>` +
      `<path d="M${n1(x - r * .7)} ${n1(y - r * .45)}A${r} ${r} 0 0 1 ${n1(x + r * .2)} ${n1(y - r * .85)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>`;
  }
  
  const ballValve = (o, cx, cy, s) => { const u = o.uid; s = s || 1;
    const hx = (x) => `<path d="M${n1(x - 5 * s)} ${n1(cy - 9 * s)}H${n1(x + 5 * s)}L${n1(x + 6 * s)} ${cy}L${n1(x + 5 * s)} ${n1(cy + 9 * s)}H${n1(x - 5 * s)}L${n1(x - 6 * s)} ${cy}Z" fill="url(#${u}-bsv)" stroke="#5e3f10" stroke-width=".7"/><path d="M${n1(x - 6 * s)} ${cy}H${n1(x + 6 * s)}" stroke="#5e3f10" stroke-opacity=".5" stroke-width=".6"/>`;
    return hx(cx - 16 * s) + hx(cx + 16 * s) + `<path d="${rr(cx - 11 * s, cy - 11 * s, 22 * s, 22 * s, 7 * s)}" fill="url(#${u}-bsv)" stroke="#5e3f10" stroke-width=".7"/>` +
      `<ellipse cx="${n1(cx - 3 * s)}" cy="${n1(cy - 5 * s)}" rx="${n1(5 * s)}" ry="${n1(2.5 * s)}" fill="#fff" opacity=".45"/>`; };

  const css = `
.hda-habitats-flow{stroke-dashoffset:0}
.hda-anim .hda-habitats-flow{animation:hda-habitats-flow 1s linear infinite}
@keyframes hda-habitats-flow{to{stroke-dashoffset:-18}}
.hda-habitats-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-habitats-flk{animation:hda-habitats-flk .5s ease-in-out infinite alternate}
@keyframes hda-habitats-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-habitats-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-habitats-spin{animation:hda-habitats-spin 1s linear infinite}
@keyframes hda-habitats-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-habitats-blink{animation:hda-habitats-blink 1.2s steps(1,end) infinite}
@keyframes hda-habitats-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-habitats-chase{opacity:.18}
.hda-anim .hda-habitats-chase{animation:hda-habitats-chase 4s linear infinite}
@keyframes hda-habitats-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-habitats-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-habitats-bub{animation:hda-habitats-bub 2s ease-in infinite}
@keyframes hda-habitats-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-habitats-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-habitats-rip{animation:hda-habitats-rip 2.2s ease-out infinite}
@keyframes hda-habitats-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-habitats-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-habitats-mist{animation:hda-habitats-mist 1.6s ease-in-out infinite}
@keyframes hda-habitats-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-habitats-heat{opacity:0}
.hda-anim .hda-habitats-heat{animation:hda-habitats-heat 2.6s ease-out infinite}
.hda-anim .hda-habitats-hum{animation:hda-habitats-hum .16s linear infinite}
@keyframes hda-habitats-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-habitats-bob{animation:hda-habitats-bob 1.6s ease-in-out infinite}
@keyframes hda-habitats-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-habitats-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-habitats-heat.hda-habitats-still{opacity:.4}
.hda-anim .hda-habitats-heat.hda-habitats-still{opacity:0}
`;
  
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css2 = css + `
.hda-habitats-fog{opacity:.55}
.hda-anim .hda-habitats-fog{animation:hda-habitats-fog 6s ease-in-out infinite alternate}
@keyframes hda-habitats-fog{0%{transform:translate(-10px,0);opacity:.35}100%{transform:translate(10px,-3px);opacity:.75}}
.hda-habitats-drop{opacity:0}
.hda-anim .hda-habitats-drop{animation:hda-habitats-drop 1.3s ease-in infinite}
@keyframes hda-habitats-drop{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(4px,22px);opacity:0}}
.hda-habitats-br{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-habitats-br{animation:hda-habitats-br 3s ease-in-out infinite}
@keyframes hda-habitats-br{50%{transform:scale(1.03,.97)}}
.hda-anim .hda-habitats-swim{animation:hda-habitats-swim 7s ease-in-out infinite alternate}
@keyframes hda-habitats-swim{0%{transform:translate(-12px,2px)}100%{transform:translate(12px,-2px)}}
.hda-anim .hda-habitats-hop{animation:hda-habitats-hop 2.4s ease-in-out infinite}
@keyframes hda-habitats-hop{0%,70%,100%{transform:translate(0,0)}80%{transform:translate(0,-4px)}}
.hda-anim .hda-habitats-caus{animation:hda-habitats-caus 4s ease-in-out infinite alternate}
@keyframes hda-habitats-caus{to{transform:translate(9px,3px)}}
.hda-habitats-sway{transform-box:fill-box;transform-origin:0% 50%}
.hda-anim .hda-habitats-sway{animation:hda-habitats-sway 2.6s ease-in-out infinite alternate}
@keyframes hda-habitats-sway{0%{transform:rotate(-6deg)}100%{transform:rotate(6deg)}}
`;
  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const part = (o, id) => Object.assign({}, o, { on: !!(o.parts && o.parts[id] != null ? o.parts[id] : o.on) });
  const WD = "#9a6a40", BLK = "#26282c", WHT = "#eceef0", GRY = "#7d858d";
  const HUM = [["20", "20%"], ["40", "40%"], ["60", "60%"], ["80", "80%"], ["95", "95%"]];
  const humOpt = (d) => [{ id: "hum", name: "Humidity", values: HUM.filter((x) => x[0] === d).concat(HUM.filter((x) => x[0] !== d)) }];
  const tempF = (o) => Math.round(60 + 45 * o.level);

  function hextra(o) {
    const u = o.uid;
    return `<pattern id="${u}-msh" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5H3M.5 0V3" stroke="#000" stroke-opacity=".55" stroke-width=".5"/></pattern>` +
      `<pattern id="${u}-wav" width="40" height="14" patternUnits="userSpaceOnUse"><path d="M0 7C6 3 12 3 18 7S30 11 40 7" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/></pattern>` +
      `<pattern id="${u}-wire" width="5" height="40" patternUnits="userSpaceOnUse"><path d="M2.5 0V40" stroke="#c9ced4" stroke-width=".8"/></pattern>` +
      `<pattern id="${u}-cork" width="14" height="10" patternUnits="userSpaceOnUse"><rect width="14" height="10" fill="#6b4a2e"/><circle cx="3" cy="3" r="1.6" fill="#4a321e"/><circle cx="10" cy="7" r="2" fill="#7e5a38"/><circle cx="8" cy="2" r="1" fill="#3e2a18"/></pattern>` +
      lg(u + "-sub", 1, [[0, "#8a6440"], [1, "#4a321e"]]) + lg(u + "-sand", 1, [[0, "#e6cf9a"], [1, "#b8995e"]]) + lg(u + "-aq", 1, [[0, "#6fc4dc", .75], [1, "#1f5f86", .9]]) +
      lg(u + "-uvb", 1, [[0, "#e6f2ff", .55], [1, "#bcd6ff", 0]]) + rg(u + "-heat", [[0, "#ffb05a", .75], [.5, "#ff7a2a", .3], [1, "#ff6a1a", 0]]) +
      lg(u + "-day", 1, [[0, "#fff8e6", .35], [1, "#fff8e6", .05]]) + lg(u + "-gl2", 0, [[0, "#fff", .14], [.3, "#fff", .02], [.6, "#fff", 0], [1, "#fff", .08]]) +
      lg(u + "-rock", 1, [[0, "#8d8a84"], [1, "#4f4c47"]]) + lg(u + "-leaf", 1, [[0, "#6fc45a"], [1, "#2f7a2e"]]) + lg(u + "-wdg", 1, [[0, "#c08a58"], [1, "#7a4c28"]]);
  }
  const svgH = (o, body) => svg(o, body, hextra(o));

  
  const A = {
    gecko: (x, y, s, c) => `<g class="hda-habitats-br"><path d="M${x - 14 * s} ${y}Q${x - 6 * s} ${y - 5 * s} ${x + 6 * s} ${y - 4 * s}Q${x + 13 * s} ${y - 4 * s} ${x + 15 * s} ${y - 1 * s}Q${x + 10 * s} ${y + 1 * s} ${x + 4 * s} ${y}Z" fill="${c || "#e8c25a"}"/>` +
      `<path d="M${x - 13 * s} ${y - 3.4 * s}Q${x - 20 * s} ${y - 4 * s} ${x - 25 * s} ${y - 1 * s}Q${x - 20 * s} ${y + 1.4 * s} ${x - 13 * s} ${y + .4 * s}Z" fill="${c || "#e8c25a"}"/>` +
      [[-6, -3], [-1, -4], [4, -3]].map((q) => `<circle cx="${n1(x + q[0] * s)}" cy="${n1(y + q[1] * s)}" r="${n1(1 * s)}" fill="#5a3a1a"/>`).join("") + `<circle cx="${n1(x + 12 * s)}" cy="${n1(y - 3 * s)}" r="${n1(.9 * s)}" fill="#111"/>` +
      `<path d="M${x - 8 * s} ${y}l-2 ${2 * s}M${x + 6 * s} ${y - 1}l2 ${2.4 * s}" stroke="${c || "#e8c25a"}" stroke-width="${1.6 * s}"/></g>`,
    dragon: (x, y, s) => `<g class="hda-habitats-br"><path d="M${x - 16 * s} ${y}Q${x - 4 * s} ${y - 10 * s} ${x + 10 * s} ${y - 8 * s}Q${x + 18 * s} ${y - 7 * s} ${x + 19 * s} ${y - 3 * s}Q${x + 12 * s} ${y + 1} ${x} ${y}Z" fill="#c9a060"/>` +
      `<path d="M${x - 16 * s} ${y}Q${x - 30 * s} ${y} ${x - 34 * s} ${y - 2 * s}" stroke="#b08850" stroke-width="${3 * s}" fill="none" stroke-linecap="round"/><path d="M${x + 10 * s} ${y - 2 * s}l3 ${3 * s}l3 ${-2 * s}" fill="#8a6a3a"/>` +
      [-8, -3, 2].map((d) => `<path d="M${x + d * s} ${y - 8 * s}l1.5 ${-2.5 * s}l1.5 ${2.5 * s}" fill="#a07840"/>`).join("") + `<circle cx="${n1(x + 15 * s)}" cy="${n1(y - 6 * s)}" r="${n1(1 * s)}" fill="#111"/></g>`,
    python: (x, y, s) => `<g class="hda-habitats-br"><ellipse cx="${x}" cy="${n1(y - 3 * s)}" rx="${n1(18 * s)}" ry="${n1(6 * s)}" fill="#6a4a26"/><ellipse cx="${x}" cy="${n1(y - 7 * s)}" rx="${n1(13 * s)}" ry="${n1(4.6 * s)}" fill="#7a5630"/><ellipse cx="${n1(x - 2 * s)}" cy="${n1(y - 10 * s)}" rx="${n1(8 * s)}" ry="${n1(3.4 * s)}" fill="#6a4a26"/>` +
      [[-10, -3], [6, -4], [-2, -7], [9, -8], [-6, -10]].map((q) => `<ellipse cx="${n1(x + q[0] * s)}" cy="${n1(y + q[1] * s)}" rx="${n1(2.6 * s)}" ry="${n1(1.3 * s)}" fill="#d9b06a"/>`).join("") +
      `<path d="M${n1(x + 4 * s)} ${n1(y - 11 * s)}q${n1(6 * s)} ${n1(-3 * s)} ${n1(10 * s)} ${n1(-1 * s)}" stroke="#5a3a1a" stroke-width="${n1(3.4 * s)}" stroke-linecap="round" fill="none"/></g>`,
    frog: (x, y, s, c) => `<g class="hda-habitats-hop"><ellipse cx="${x}" cy="${n1(y - 4 * s)}" rx="${n1(7 * s)}" ry="${n1(4.6 * s)}" fill="${c || "#2f8fd6"}"/>` +
      [[-4, -7], [4, -7]].map((q) => `<circle cx="${n1(x + q[0] * s)}" cy="${n1(y + q[1] * s)}" r="${n1(2 * s)}" fill="${c || "#2f8fd6"}"/><circle cx="${n1(x + q[0] * s)}" cy="${n1(y + q[1] * s)}" r="${n1(1 * s)}" fill="#111"/>`).join("") +
      `<circle cx="${n1(x - 2 * s)}" cy="${n1(y - 4 * s)}" r="${n1(1.2 * s)}" fill="#111"/><circle cx="${n1(x + 3 * s)}" cy="${n1(y - 3 * s)}" r="${n1(1 * s)}" fill="#111"/><path d="M${n1(x - 7 * s)} ${y}l${n1(-3 * s)} 1M${n1(x + 7 * s)} ${y}l${n1(3 * s)} 1" stroke="${c || "#2f8fd6"}" stroke-width="${n1(1.6 * s)}"/></g>`,
    tortoise: (x, y, s) => `<g class="hda-habitats-br"><path d="M${n1(x - 14 * s)} ${y}Q${n1(x - 13 * s)} ${n1(y - 14 * s)} ${x} ${n1(y - 14 * s)}Q${n1(x + 13 * s)} ${n1(y - 14 * s)} ${n1(x + 14 * s)} ${y}Z" fill="#8a6a3a"/>` +
      [[-7, -6], [0, -9], [7, -6], [-3, -3], [4, -3]].map((q) => `<path d="M${n1(x + q[0] * s - 3 * s)} ${n1(y + q[1] * s)}l${n1(3 * s)} ${n1(-2.4 * s)}l${n1(3 * s)} ${n1(2.4 * s)}l${n1(-3 * s)} ${n1(2.4 * s)}Z" fill="#c9a060" opacity=".8"/>`).join("") +
      `<ellipse cx="${n1(x + 17 * s)}" cy="${n1(y - 3 * s)}" rx="${n1(4 * s)}" ry="${n1(3 * s)}" fill="#9a8a5a"/><circle cx="${n1(x + 18.5 * s)}" cy="${n1(y - 4 * s)}" r="${n1(.8 * s)}" fill="#111"/>` +
      `<path d="M${n1(x - 10 * s)} ${y}v${n1(2 * s)}M${n1(x + 10 * s)} ${y}v${n1(2 * s)}" stroke="#9a8a5a" stroke-width="${n1(3 * s)}" stroke-linecap="round"/></g>`,
    cham: (x, y, s) => `<g class="hda-habitats-br"><path d="M${x} ${y}Q${n1(x + 4 * s)} ${n1(y - 12 * s)} ${n1(x + 16 * s)} ${n1(y - 10 * s)}Q${n1(x + 22 * s)} ${n1(y - 8 * s)} ${n1(x + 20 * s)} ${n1(y - 2 * s)}Q${n1(x + 12 * s)} ${y} ${x} ${y}Z" fill="#4cae4a"/>` +
      `<path d="M${x} ${y}q${n1(-8 * s)} ${n1(2 * s)} ${n1(-8 * s)} ${n1(8 * s)}q0 ${n1(4 * s)} ${n1(4 * s)} ${n1(3 * s)}q${n1(2 * s)} ${n1(-2 * s)} 0 ${n1(-3 * s)}" stroke="#4cae4a" stroke-width="${n1(2.4 * s)}" fill="none"/>` +
      `<path d="M${n1(x + 13 * s)} ${n1(y - 10 * s)}L${n1(x + 17 * s)} ${n1(y - 17 * s)}L${n1(x + 21 * s)} ${n1(y - 8 * s)}Z" fill="#3f9a3f"/><circle cx="${n1(x + 17 * s)}" cy="${n1(y - 6 * s)}" r="${n1(1.8 * s)}" fill="#f2d24a"/><circle cx="${n1(x + 17 * s)}" cy="${n1(y - 6 * s)}" r="${n1(.8 * s)}" fill="#111"/>` +
      `<path d="M${n1(x + 6 * s)} ${n1(y - 6 * s)}h${n1(8 * s)}" stroke="#e8e04a" stroke-width="${n1(1.2 * s)}" opacity=".7"/></g>`,
    turtle: (x, y, s) => `<g class="hda-habitats-br"><ellipse cx="${x}" cy="${n1(y - 4 * s)}" rx="${n1(12 * s)}" ry="${n1(5 * s)}" fill="#3e5a2a"/><ellipse cx="${x}" cy="${n1(y - 5 * s)}" rx="${n1(9 * s)}" ry="${n1(3.4 * s)}" fill="#5a7a3a"/>` +
      `<ellipse cx="${n1(x + 14 * s)}" cy="${n1(y - 4 * s)}" rx="${n1(3.6 * s)}" ry="${n1(2.6 * s)}" fill="#6a8a4a"/><path d="M${n1(x + 12 * s)} ${n1(y - 5 * s)}h${n1(4 * s)}" stroke="#d9362b" stroke-width="${n1(1 * s)}"/></g>`,
    axo: (x, y, s) => `<g class="hda-habitats-swim"><path d="M${n1(x - 14 * s)} ${y}Q${x} ${n1(y - 6 * s)} ${n1(x + 10 * s)} ${n1(y - 3 * s)}Q${n1(x + 14 * s)} ${n1(y - 1 * s)} ${n1(x + 10 * s)} ${n1(y + 2 * s)}Q${x} ${n1(y + 3 * s)} ${n1(x - 14 * s)} ${y}Z" fill="#f2b6c2"/>` +
      [-4, 0, 4].map((d) => `<path d="M${n1(x + 8 * s)} ${n1(y - 4 * s)}l${n1(d * .6 * s)} ${n1(-5 * s)}" stroke="#e86a8a" stroke-width="${n1(1.4 * s)}" stroke-linecap="round"/>`).join("") +
      `<circle cx="${n1(x + 10 * s)}" cy="${n1(y - 1 * s)}" r="${n1(.8 * s)}" fill="#222"/><path d="M${n1(x - 14 * s)} ${y}q${n1(-6 * s)} ${n1(-3 * s)} ${n1(-10 * s)} 0" stroke="#f2b6c2" stroke-width="${n1(2.6 * s)}" fill="none"/></g>`,
    tarantula: (x, y, s) => `<g class="hda-habitats-br">` + [-1, 1].map((k) => [0, 1, 2, 3].map((i) => `<path d="M${x} ${n1(y - 4 * s)}l${n1(k * (6 + i * 1.5) * s)} ${n1((-4 + i * 2.4) * s)}l${n1(k * 3 * s)} ${n1(4 * s)}" stroke="#2a1e18" stroke-width="${n1(1.6 * s)}" fill="none" stroke-linecap="round"/>`).join("")).join("") +
      `<ellipse cx="${n1(x - 5 * s)}" cy="${n1(y - 4 * s)}" rx="${n1(5 * s)}" ry="${n1(4 * s)}" fill="#3a2a22"/><ellipse cx="${n1(x + 3 * s)}" cy="${n1(y - 4 * s)}" rx="${n1(3.6 * s)}" ry="${n1(3 * s)}" fill="#4a3a2e"/><ellipse cx="${n1(x - 5 * s)}" cy="${n1(y - 5 * s)}" rx="${n1(2 * s)}" ry="${n1(1.4 * s)}" fill="#c8662a" opacity=".7"/></g>`,
    crab: (x, y, s) => `<g class="hda-habitats-br"><path d="M${n1(x - 8 * s)} ${y}Q${n1(x - 9 * s)} ${n1(y - 14 * s)} ${n1(x + 2 * s)} ${n1(y - 13 * s)}Q${n1(x + 10 * s)} ${n1(y - 10 * s)} ${n1(x + 6 * s)} ${y}Z" fill="#d9a46a"/><path d="M${n1(x - 4 * s)} ${n1(y - 9 * s)}q${n1(4 * s)} ${n1(-3 * s)} ${n1(7 * s)} 0" stroke="#a8743e" fill="none"/>` +
      `<ellipse cx="${n1(x + 9 * s)}" cy="${n1(y - 2 * s)}" rx="${n1(3 * s)}" ry="${n1(2.4 * s)}" fill="#c84a2a"/><path d="M${n1(x + 10 * s)} ${n1(y - 4 * s)}v${n1(-3 * s)}M${n1(x + 12 * s)} ${n1(y - 4 * s)}v${n1(-3 * s)}" stroke="#222" stroke-width=".8"/></g>`,
    bird: (x, y, s) => `<g class="hda-habitats-hop"><ellipse cx="${x}" cy="${n1(y - 7 * s)}" rx="${n1(5 * s)}" ry="${n1(7 * s)}" fill="#6fc45a" transform="rotate(-15 ${x} ${n1(y - 7 * s)})"/><circle cx="${n1(x + 3 * s)}" cy="${n1(y - 14 * s)}" r="${n1(3.6 * s)}" fill="#f2e24a"/>` +
      `<path d="M${n1(x + 6 * s)} ${n1(y - 14 * s)}l${n1(2 * s)} ${n1(1.4 * s)}l${n1(-2 * s)} ${n1(.6 * s)}" fill="#e8a040"/><circle cx="${n1(x + 4 * s)}" cy="${n1(y - 15 * s)}" r="${n1(.7 * s)}" fill="#111"/><path d="M${n1(x - 3 * s)} ${n1(y - 2 * s)}l${n1(-4 * s)} ${n1(8 * s)}" stroke="#3a7a8a" stroke-width="${n1(2 * s)}"/></g>`,
    hamster: (x, y, s) => `<g class="hda-habitats-br"><ellipse cx="${x}" cy="${n1(y - 5 * s)}" rx="${n1(9 * s)}" ry="${n1(6 * s)}" fill="#e0a560"/><ellipse cx="${n1(x + 1 * s)}" cy="${n1(y - 3 * s)}" rx="${n1(6 * s)}" ry="${n1(3.4 * s)}" fill="#f6e2c4"/>` +
      `<circle cx="${n1(x + 6 * s)}" cy="${n1(y - 10 * s)}" r="${n1(2 * s)}" fill="#e0a560"/><circle cx="${n1(x + 7 * s)}" cy="${n1(y - 6 * s)}" r="${n1(.9 * s)}" fill="#111"/><circle cx="${n1(x + 9.5 * s)}" cy="${n1(y - 4.6 * s)}" r="${n1(.7 * s)}" fill="#d97a8a"/></g>`,
    rabbit: (x, y, s) => `<g class="hda-habitats-br"><ellipse cx="${x}" cy="${n1(y - 7 * s)}" rx="${n1(12 * s)}" ry="${n1(8 * s)}" fill="#9a9590"/><circle cx="${n1(x + 11 * s)}" cy="${n1(y - 12 * s)}" r="${n1(5.4 * s)}" fill="#a8a39e"/>` +
      `<ellipse cx="${n1(x + 9 * s)}" cy="${n1(y - 22 * s)}" rx="${n1(1.8 * s)}" ry="${n1(6 * s)}" fill="#a8a39e"/><ellipse cx="${n1(x + 13 * s)}" cy="${n1(y - 21 * s)}" rx="${n1(1.8 * s)}" ry="${n1(6 * s)}" fill="#a8a39e" transform="rotate(14 ${n1(x + 13 * s)} ${n1(y - 21 * s)})"/>` +
      `<circle cx="${n1(x + 13 * s)}" cy="${n1(y - 13 * s)}" r="${n1(1 * s)}" fill="#111"/><circle cx="${n1(x - 12 * s)}" cy="${n1(y - 8 * s)}" r="${n1(3 * s)}" fill="#f4f2ee"/></g>`,
    chick: (x, y, s) => `<g class="hda-habitats-hop"><ellipse cx="${x}" cy="${n1(y - 4 * s)}" rx="${n1(5 * s)}" ry="${n1(4 * s)}" fill="#f6d84a"/><circle cx="${n1(x + 4 * s)}" cy="${n1(y - 8 * s)}" r="${n1(3 * s)}" fill="#f8e06a"/><path d="M${n1(x + 7 * s)} ${n1(y - 8 * s)}l${n1(2 * s)} ${n1(.8 * s)}l${n1(-2 * s)} ${n1(.8 * s)}" fill="#e88a2a"/><circle cx="${n1(x + 5 * s)}" cy="${n1(y - 9 * s)}" r="${n1(.6 * s)}" fill="#111"/></g>`,
  };
  
  const leafy = (x, y, s, c) => [[-8, -10], [-3, -16], [3, -14], [8, -9], [0, -6]].map((q) => `<path d="M${x} ${y}Q${n1(x + q[0] * s * .4)} ${n1(y + q[1] * s * .6)} ${n1(x + q[0] * s)} ${n1(y + q[1] * s)}Q${n1(x + q[0] * s * .7)} ${n1(y + q[1] * s * .3)} ${x} ${y}Z" fill="${c || "url(#" + "U-leaf)"}"/>`).join("");
  const rock = (o, x, y, w, h) => `<path d="M${x} ${y}Q${n1(x + w * .1)} ${n1(y - h)} ${n1(x + w * .5)} ${n1(y - h)}Q${n1(x + w * .9)} ${n1(y - h * .9)} ${x + w} ${y}Z" fill="url(#${o.uid}-rock)"/><path d="M${n1(x + w * .2)} ${n1(y - h * .6)}q${n1(w * .2)} ${n1(-h * .3)} ${n1(w * .4)} ${n1(-h * .2)}" stroke="#fff" stroke-opacity=".2" fill="none"/>`;
  const hide = (o, x, y, w, h) => `<path d="M${x} ${y}V${n1(y - h * .5)}Q${x} ${y - h} ${n1(x + w * .5)} ${y - h}Q${x + w} ${y - h} ${x + w} ${n1(y - h * .5)}V${y}Z" fill="url(#${o.uid}-wdg)"/><path d="M${n1(x + w * .3)} ${y}V${n1(y - h * .45)}Q${n1(x + w * .5)} ${n1(y - h * .7)} ${n1(x + w * .7)} ${n1(y - h * .45)}V${y}Z" fill="#1a120a"/>`;
  const branch = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 8} ${x2} ${y2}" stroke="#6a4a2a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 8} ${x2} ${y2}" stroke="#a07a50" stroke-width="1.2" fill="none" transform="translate(0 -1)"/>`;

  
  function meter(o, x, y, safe) {
    const t = tempF(o), h = +((o.opt && o.opt.hum) || 60);
    const dt = t < safe[0] ? safe[0] - t : t > safe[1] ? t - safe[1] : 0, dh = h < safe[2] ? safe[2] - h : h > safe[3] ? h - safe[3] : 0;
    const bad = dt > 5 || dh > 10 ? 2 : dt > 0 || dh > 0 ? 1 : 0, col = ["#7ee08a", AMB, RED][bad];
    const lit = o.on || true;
    return `<path d="${rr(x, y, 34, 18, 2.5)}" fill="#e9ecef"/><path d="${rr(x + 2, y + 2, 30, 14, 1.5)}" fill="#0a0d10"/>` +
      digits(String(t), x + 4, y + 5, 7, col, "rgba(255,255,255,.05)") + `<circle cx="${x + 16.4}" cy="${y + 5.4}" r=".9" fill="none" stroke="${col}" stroke-width=".6"/>` +
      digits(String(Math.min(99, h)), x + 19, y + 5, 7, CYAN, "rgba(255,255,255,.05)") + `<path d="M${x + 31.6} ${y + 6}l-1.6 4" stroke="${CYAN}" stroke-width=".6"/><circle cx="${x + 30.2}" cy="${y + 6.2}" r=".5" fill="${CYAN}"/><circle cx="${x + 31.6}" cy="${y + 10}" r=".5" fill="${CYAN}"/>` +
      (bad ? `<circle cx="${x + 32}" cy="${y + 1.5}" r="2" fill="${col}"${bad === 2 && lit ? ` class="${P}blink"` : ""}/>` : "");
  }

  
  function enclosure(o, sp, inner, lights) {
    const u = o.uid, { x, y, w, h } = sp, d = sp.d == null ? 10 : sp.d, dy = d * .6, ix = x + 4, iy = y + 4, iw = w - 8, ih = h - 8, id = `${u}-in${x}${y}`, din = rr(ix, iy, iw, ih, 1);
    let s = sh(o, x + w / 2 + d / 2, y + h + 2, w * .6, 5);
    if (sp.stand) s += `<path d="M${x - 2} ${y + h}H${x + w + 2}V${y + h + 6}H${x - 2}Z" fill="url(#${u}-v)"/><path d="M${x + 2} ${y + h + 6}V${y + h + 34}M${x + w - 2} ${y + h + 6}V${y + h + 34}" stroke="${pal(o.color).d}" stroke-width="5"/><path d="M${x + 2} ${y + h + 26}H${x + w - 2}" stroke="${pal(o.color).d}" stroke-width="3"/>`;
    s += `<path d="M${x} ${y}L${x + d} ${y - dy}H${x + w + d}L${x + w} ${y}Z" fill="${sp.kind === "pvc" ? `url(#${u}-tp)` : "#20242a"}"/>` + (sp.kind !== "pvc" ? `<path d="M${x + 3} ${y - 1}L${x + d + 2} ${y - dy + 1}H${x + w + d - 3}L${x + w - 2} ${y - 1}Z" fill="url(#${u}-msh)"/>` : "") +
      `<path d="M${x + w} ${y}L${x + w + d} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="${sp.kind === "pvc" ? `url(#${u}-sd)` : "#1a1e24"}" opacity="${sp.kind === "pvc" ? 1 : .55}"/>`;
    s += `<clipPath id="${id}"><path d="${din}"/></clipPath><g clip-path="url(#${id})"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="${sp.back || "#1e2428"}"/>` +
      (sp.cork ? `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${u}-cork)" opacity=".85"/>` : "") + inner(ix, iy, iw, ih) +
      lights(ix, iy, iw, ih) + (o.on ? "" : `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#000" opacity=".5"/>`) + `</g>`;
    if (sp.kind === "mesh") s += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${u}-msh)" opacity=".6"/>`;
    else s += `<path d="${din}" fill="url(#${u}-gl2)"/><path d="M${n1(ix + iw * .62)} ${iy}L${n1(ix + iw * .44)} ${iy + ih}H${n1(ix + iw * .5)}L${n1(ix + iw * .68)} ${iy}Z" fill="#fff" fill-opacity=".05"/>`;
    
    const fc = sp.kind === "pvc" ? `url(#${u}-v)` : `url(#${u}-v)`, t = sp.kind === "pvc" ? 6 : 3;
    s += `<path d="M${x} ${y}H${x + w}V${y + h}H${x}Z M${x + t} ${y + t}V${y + h - t}H${x + w - t}V${y + t}Z" fill="${fc}" fill-rule="evenodd"/>`;
    if (sp.kind === "pvc") s += `<path d="M${x} ${y}H${x + w}V${y + 12}H${x}Z" fill="url(#${u}-v)"/><rect x="${x + 10}" y="${y + 4}" width="${w - 20}" height="4" fill="url(#${u}-msh)"/>` +
      `<path d="M${x + w / 2} ${y + 12}V${y + h - 6}" stroke="${pal(o.color).k}" stroke-width="1.6"/><path d="M${x + 6} ${y + h - 10}H${x + w - 6}" stroke="${pal(o.color).d}" stroke-width="3"/>`;
    if (sp.doors === "front2") s += `<path d="M${x + w / 2} ${y + 3}V${y + h - 3}" stroke="${pal(o.color).d}" stroke-width="2.4"/><rect x="${x + w / 2 - 5}" y="${y + h * .45}" width="2" height="10" rx="1" fill="#9aa1a9"/><rect x="${x + w / 2 + 3}" y="${y + h * .45}" width="2" height="10" rx="1" fill="#9aa1a9"/>` +
      `<path d="M${x + 3} ${y + h - 16}H${x + w - 3}" stroke="${pal(o.color).d}" stroke-width="3"/><rect x="${x + 8}" y="${y + h - 14}" width="${w - 16}" height="4" fill="url(#${u}-msh)"/>`;
    if (sp.kind === "mesh") s += [.33, .66].map((k) => `<path d="M${n1(x + w * k)} ${y}V${y + h}" stroke="${pal(o.color).d}" stroke-width="2"/>`).join("") + `<path d="M${x} ${y + h * .55}H${x + w}" stroke="${pal(o.color).d}" stroke-width="2"/><rect x="${x + w - 12}" y="${y + h * .35}" width="3" height="12" rx="1" fill="#9aa1a9"/>`;
    return s;
  }
  
  const FX = {
    heat: (o, cx, iy, ih) => o.on ? `<ellipse cx="${cx}" cy="${iy + 4}" rx="${n1(ih * .55)}" ry="${n1(ih * .7)}" fill="url(#${o.uid}-heat)" opacity="${n1(.5 + .5 * o.level)}"/><ellipse cx="${cx}" cy="${iy + ih - 6}" rx="22" ry="5" fill="#ffb05a" opacity=".35"/>` : "",
    uvb: (o, ix, iy, iw, ih) => o.on ? `<rect x="${ix}" y="${iy}" width="${iw}" height="${n1(ih * .8)}" fill="url(#${o.uid}-uvb)"/>` : "",
    day: (o, ix, iy, iw, ih) => o.on ? `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="url(#${o.uid}-day)"/>` : "",
    mist: (o, x, y) => o.on ? `<ellipse class="${P}mist" cx="${x + 18}" cy="${y + 18}" rx="26" ry="16" fill="url(#${o.uid}-mist)"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle class="${P}drop" style="animation-delay:-${n1(i * .22)}s" cx="${x + 2 + i * 5}" cy="${y + 4}" r="1" fill="#dff4ff"/>`).join("") : "",
    fog: (o, ix, by, iw) => o.on ? [0, 1, 2].map((i) => `<ellipse class="${P}fog" style="animation-delay:-${i * 2}s" cx="${n1(ix + iw * (.25 + i * .25))}" cy="${by - 6 - (i % 2) * 4}" rx="${n1(iw * .3)}" ry="7" fill="url(#${o.uid}-mist)"/>`).join("") : "",
    mat: (o, x, by, w) => o.on ? `<rect x="${x}" y="${by - 5}" width="${w}" height="5" fill="#ff6a2a" opacity=".55"/><rect x="${x}" y="${by - 14}" width="${w}" height="10" fill="#ff8a3a" opacity=".12"/>` + heat(o, [x + w * .3, x + w * .7], by - 8) : "",
  };
  const lampDome = (o, x, y, on) => `<path d="M${x - 9} ${y}Q${x - 9} ${y - 10} ${x} ${y - 10}Q${x + 9} ${y - 10} ${x + 9} ${y}Z" fill="#2a2e34"/><path d="M${x - 9} ${y}H${x + 9}" stroke="#555" stroke-width="1.4"/>` + (on ? `<ellipse cx="${x}" cy="${y + 1}" rx="6" ry="2" fill="#ffb05a"/><ellipse cx="${x}" cy="${y + 2}" rx="12" ry="4" fill="url(#${o.uid}-heat)"/>` : "");
  const uvbBar = (o, x, y, w, on) => `<rect x="${x}" y="${y - 5}" width="${w}" height="5" rx="1.5" fill="#d9dde2"/><rect x="${x + 3}" y="${y - 1.5}" width="${w - 6}" height="2" rx="1" fill="${on ? "#e6f2ff" : "#7a8590"}"/>` + (on ? `<rect x="${x}" y="${y}" width="${w}" height="3" fill="#bcd6ff" opacity=".5"/>` : "");
  const pcs = (list) => list.map((p) => ({ id: p[0], name: p[1] }));
  const ic = (id, name, colors, safe, hum, parts, render) => ({ id, name, colors, picker: true, colorLabel: "Frame", parts: parts.length ? pcs(parts) : undefined, options: humOpt(hum), safe, render });
  const scene = (o, fy, wall) => room(o, fy, wall || "board");

  const icons = [
    
    ic("frontglass", "Front-opening terrarium", [BLK, WHT, GRY], [75, 88, 60, 80], "60", [["heat", "Heat lamp"], ["uvb", "UVB"], ["mist", "Mister"]], (o) => { const ph = part(o, "heat"), pu = part(o, "uvb"), pm = part(o, "mist");
      return svgH(o, scene(o, 160) + enclosure(o, { x: 44, y: 60, w: 104, h: 96, kind: "glass", doors: "front2", back: "#2a2420", cork: true },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 10}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${o.uid}-sub)"/>` + branch(ix + 6, iy + 60, ix + iw - 10, iy + 34) + leafy(ix + 14, iy + ih - 10, 1.2).replace(/U-leaf/g, o.uid + "-leaf") + A.gecko(ix + 58, iy + 44, 1.2, "#4cc35a"),
        (ix, iy, iw, ih) => FX.heat(ph, ix + 26, iy, ih) + FX.uvb(pu, ix, iy, iw, ih) + FX.mist(pm, ix + iw - 36, iy)) +
        lampDome(o, 70, 56, ph.on) + uvbBar(o, 96, 57, 40, pu.on) + meter(o, 108, 66, [75, 88, 60, 80])); }),

    
    ic("tallviv", "Tall vivarium", [BLK, WHT, GRY], [70, 80, 60, 80], "80", [["uvb", "UVB"], ["mist", "Mister"], ["day", "Day light"]], (o) => { const pu = part(o, "uvb"), pm = part(o, "mist"), pd = part(o, "day");
      return svgH(o, scene(o, 180) + enclosure(o, { x: 58, y: 34, w: 80, h: 140, kind: "glass", doors: "front2", back: "#22302a", cork: true },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 12}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${o.uid}-sub)"/>` + branch(ix + 4, iy + 90, ix + iw - 4, iy + 50) + branch(ix + iw - 4, iy + 110, ix + 10, iy + 70) +
          leafy(ix + 12, iy + ih - 12, 1.4).replace(/U-leaf/g, o.uid + "-leaf") + leafy(ix + iw - 12, iy + ih - 12, 1.1).replace(/U-leaf/g, o.uid + "-leaf") + A.gecko(ix + 40, iy + 54, 1.1, "#d98a4a"),
        (ix, iy, iw, ih) => FX.uvb(pu, ix, iy, iw, ih) + FX.day(pd, ix, iy, iw, ih) + FX.mist(pm, ix + 6, iy)) +
        uvbBar(o, 62, 31, 34, pu.on) + uvbBar(o, 100, 31, 34, pd.on) + meter(o, 98, 40, [70, 80, 60, 80])); }),

    
    ic("meshcham", "Mesh chameleon cage", [BLK, WHT, GRY], [72, 85, 50, 70], "60", [["heat", "Heat lamp"], ["uvb", "UVB"], ["mist", "Mister"]], (o) => { const ph = part(o, "heat"), pu = part(o, "uvb"), pm = part(o, "mist");
      return svgH(o, scene(o, 182) + enclosure(o, { x: 56, y: 36, w: 86, h: 142, kind: "mesh", back: "#26302a" },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 10}H${ix + iw}V${iy + ih}H${ix}Z" fill="#3a2a1e"/>` + `<path d="M${ix + 40} ${iy + ih - 10}V${iy + 40}" stroke="#6a4a2a" stroke-width="3"/>` +
          leafy(ix + 40, iy + 70, 2).replace(/U-leaf/g, o.uid + "-leaf") + leafy(ix + 40, iy + 110, 1.6).replace(/U-leaf/g, o.uid + "-leaf") + branch(ix + 4, iy + 58, ix + iw - 4, iy + 40) + A.cham(ix + 24, iy + 52, .9),
        (ix, iy, iw, ih) => FX.heat(ph, ix + 24, iy, ih) + FX.uvb(pu, ix, iy, iw, ih) + FX.mist(pm, ix + iw - 34, iy)) +
        lampDome(o, 80, 32, ph.on) + uvbBar(o, 100, 33, 36, pu.on) + meter(o, 102, 42, [72, 85, 50, 70])); }),

    
    ic("pvcpython", "PVC enclosure", [BLK, WHT, GRY, WD], [78, 92, 50, 70], "60", [["heat", "Heat lamp"], ["day", "Day light"]], (o) => { const ph = part(o, "heat"), pd = part(o, "day");
      return svgH(o, scene(o, 150) + enclosure(o, { x: 22, y: 72, w: 156, h: 74, kind: "pvc", back: "#1e1a18", d: 12 },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 12}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${o.uid}-sub)"/>` + hide(o, ix + iw - 46, iy + ih - 10, 34, 22) + A.python(ix + 50, iy + ih - 10, 1.15) +
          `<ellipse cx="${ix + 96}" cy="${iy + ih - 9}" rx="10" ry="3" fill="#6fa8c8"/>` + leafy(ix + 10, iy + ih - 10, .9, "#3f8a3a"),
        (ix, iy, iw, ih) => FX.heat(ph, ix + 40, iy + 8, ih) + FX.day(pd, ix, iy, iw, ih)) +
        meter(o, 138, 86, [78, 92, 50, 70])); }),

    
    ic("pvcdragon", "4x2x2 enclosure", [BLK, WD, WHT, GRY], [76, 100, 20, 40], "40", [["heat", "Heat lamp"], ["uvb", "UVB"], ["day", "Day light"]], (o) => { const ph = part(o, "heat"), pu = part(o, "uvb"), pd = part(o, "day");
      return svgH(o, scene(o, 178) + enclosure(o, { x: 14, y: 70, w: 172, h: 74, kind: "pvc", back: "#2a2018", d: 10, stand: true },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 12}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${o.uid}-sand)"/>` + rock(o, ix + 12, iy + ih - 10, 50, 24) + A.dragon(ix + 40, iy + ih - 32, .85) +
          `<path d="M${ix + iw - 50} ${iy + ih - 10}l10 -20l14 6l8 14Z" fill="#7a5a3a"/>`,
        (ix, iy, iw, ih) => FX.heat(ph, ix + 40, iy + 8, ih) + FX.uvb(pu, ix, iy, iw, ih) + FX.day(pd, ix, iy, iw, ih)) +
        meter(o, 146, 84, [76, 100, 20, 40])); }),

    
    ic("bioactive", "Bioactive vivarium", [BLK, GRY, WHT], [70, 80, 80, 95], "80", [["day", "Day light"], ["mist", "Mister"], ["pump", "Water pump"]], (o) => { const pd = part(o, "day"), pm = part(o, "mist"), pp = part(o, "pump"), u = o.uid;
      return svgH(o, scene(o, 176) + enclosure(o, { x: 40, y: 48, w: 120, h: 124, kind: "glass", doors: "front2", back: "#121a14" },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 18}H${ix + iw}V${iy + ih}H${ix}Z" fill="#3a2a1e"/><path d="M${ix} ${iy + ih - 18}Q${ix + 30} ${iy + ih - 24} ${ix + 60} ${iy + ih - 18}T${ix + iw} ${iy + ih - 18}" fill="#4f8a3a"/>` +
          `<path d="M${ix} ${iy + 30}Q${ix + 30} ${iy + 20} ${ix + iw} ${iy + 34}V${iy + 44}Q${ix + 50} ${iy + 30} ${ix} ${iy + 44}Z" fill="#3f7a34" opacity=".8"/>` + [[ix + 70, iy + 70, 3], [ix + 100, iy + 40, 2], [ix + 50, iy + 90, 2.4]].map((m) => `<ellipse cx="${m[0]}" cy="${m[1]}" rx="${m[2] * 6}" ry="${m[2] * 3}" fill="#4f9a3a" opacity=".85"/>`).join("") +
          rock(o, ix + 6, iy + ih - 18, 40, 70) + `<path d="M${ix + 8} ${iy + ih - 40}Q${ix + 20} ${iy + ih - 60} ${ix + 30} ${iy + ih - 50}" stroke="#4f9a3a" stroke-width="5" fill="none"/>` + `<path d="M${ix + 26} ${iy + 40}V${iy + ih - 14}" stroke="#7fd8ff" stroke-opacity=".35" stroke-width="6"/>` + (pp.on ? `<path class="${P}flow" d="M${ix + 26} ${iy + 40}V${iy + ih - 14}" stroke="#e6f8ff" stroke-width="3" stroke-dasharray="3 5" fill="none"/>` + `<ellipse class="${P}rip" cx="${ix + 26}" cy="${iy + ih - 13}" rx="10" ry="2" fill="none" stroke="#e6f8ff"/>` : "") +
          `<ellipse cx="${ix + 34}" cy="${iy + ih - 13}" rx="18" ry="4" fill="url(#${u}-aq)"/>` + leafy(ix + 70, iy + ih - 18, 2).replace(/U-leaf/g, u + "-leaf") + leafy(ix + 100, iy + ih - 18, 1.6).replace(/U-leaf/g, u + "-leaf") +
          leafy(ix + 90, iy + 50, 1.2).replace(/U-leaf/g, u + "-leaf") + leafy(ix + iw - 10, iy + 80, 1.4).replace(/U-leaf/g, u + "-leaf") + leafy(ix + 46, iy + ih - 18, 1.2).replace(/U-leaf/g, u + "-leaf") + A.frog(ix + 62, iy + ih - 20, 1.3, "#2f8fd6"),
        (ix, iy, iw, ih) => FX.day(pd, ix, iy, iw, ih) + FX.mist(pm, ix + iw - 36, iy)) +
        uvbBar(o, 50, 45, 100, pd.on) + meter(o, 120, 54, [70, 80, 80, 95])); }),

    
    ic("paludarium", "Frog paludarium", [BLK, GRY, WHT], [70, 80, 70, 95], "95", [["day", "Day light"], ["fog", "Fogger"], ["pump", "Water pump"]], (o) => { const pd = part(o, "day"), pf = part(o, "fog"), pp = part(o, "pump"), u = o.uid;
      return svgH(o, scene(o, 172) + enclosure(o, { x: 30, y: 64, w: 140, h: 104, kind: "glass", back: "#121a14" },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + 50}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${u}-aq)"/><g class="${P}caus"><rect x="${ix - 10}" y="${iy + 52}" width="${iw + 20}" height="40" fill="url(#${u}-wav)" opacity=".4"/></g>` +
          `<path d="M${ix} ${iy + 46}L${ix + 60} ${iy + 40}L${ix + 70} ${iy + ih}H${ix}Z" fill="#3a2a1e"/><path d="M${ix} ${iy + 46}L${ix + 60} ${iy + 40}L${ix + 62} ${iy + 46}" fill="#4f8a3a"/>` + leafy(ix + 20, iy + 44, 1.6).replace(/U-leaf/g, u + "-leaf") + leafy(ix + 50, iy + 42, 1.2).replace(/U-leaf/g, u + "-leaf") + `<path d="M${ix} ${iy + 4}Q${ix + 40} ${iy + 14} ${ix + iw} ${iy + 6}V${iy + 18}Q${ix + 60} ${iy + 26} ${ix} ${iy + 16}Z" fill="#3f7a34" opacity=".75"/>` + `<path d="M${ix + 80} ${iy + 50}v-18M${ix + 86} ${iy + 50}v-14" stroke="#4f9a3a" stroke-width="2.4"/>` +
          rock(o, ix + iw - 40, iy + 54, 36, 40) + (pp.on ? `<path class="${P}flow" d="M${ix + iw - 22} ${iy + 16}V${iy + 52}" stroke="#e6f8ff" stroke-width="3" stroke-dasharray="3 5" fill="none"/><ellipse class="${P}rip" cx="${ix + iw - 22}" cy="${iy + 52}" rx="10" ry="2" fill="none" stroke="#e6f8ff"/>` : "") +
          A.frog(ix + 44, iy + 42, 1, "#4cc35a") + bubbles(pp, [[ix + 90, iy + 90], [ix + 100, iy + 84]]),
        (ix, iy, iw, ih) => FX.day(pd, ix, iy, iw, ih) + FX.fog(pf, ix, iy + 50, iw)) +
        uvbBar(o, 40, 61, 120, pd.on) + meter(o, 130, 70, [70, 80, 70, 95])); }),

    
    ic("tortoise", "Tortoise table", [WD, BLK, WHT, GRY], [70, 95, 30, 60], "40", [["heat", "Heat lamp"], ["uvb", "UVB"]], (o) => { const ph = part(o, "heat"), pu = part(o, "uvb"), u = o.uid;
      return svgH(o, scene(o, 176) + sh(o, 100, 178, 84, 5) + `<path d="M24 178V160M168 178V160" stroke="${pal(o.color).d}" stroke-width="6"/>` +
        `<path d="M28 128V108H184V128Z" fill="url(#${u}-v)"/><path d="M28 108H184" stroke="#fff" stroke-opacity=".3"/><path d="M16 150L28 128H184L172 150Z" fill="url(#${u}-sand)"/>` + (ph.on ? `<ellipse cx="70" cy="138" rx="34" ry="8" fill="url(#${u}-heat)" opacity="${n1(.5 + .5 * ph.level)}"/>` : "") + (pu.on ? `<path d="M100 132H170L176 146H96Z" fill="#cfe2ff" opacity=".25"/>` : "") +
        rock(o, 130, 142, 30, 10) + A.tortoise(76, 144, .9) + `<path d="M108 144l4 -6l4 6Z" fill="#6fc45a"/><path d="M114 146l4 -5l4 5Z" fill="#4f9a3a"/>` +
        `<path d="M150 150L158 128H184L176 150Z" fill="#3a2a1a" opacity=".55"/><path d="M146 132L154 112H186L178 132Z" fill="url(#${u}-wdg)"/><path d="M146 132H178" stroke="#000" stroke-opacity=".3"/>` + `<path d="M16 150H172V168H16Z" fill="url(#${u}-v)"/><path d="M172 150L184 128V146L172 168Z" fill="url(#${u}-sd)"/><path d="M16 150L28 128H184" fill="none" stroke="${pal(o.color).d}" stroke-width="3"/>` +
        `<path d="M30 128V60H70" stroke="#2a2e34" stroke-width="3" fill="none"/>` + lampDome(o, 70, 70, ph.on) + `<path d="M150 128V64H120" stroke="#2a2e34" stroke-width="3" fill="none"/>` + uvbBar(o, 96, 70, 50, pu.on) +
        (o.on ? "" : `<path d="M16 150L28 128H184L172 150Z" fill="#000" opacity=".45"/>`) + meter(o, 130, 152, [70, 95, 30, 60])); }),

    
    ic("rack", "Snake rack", [BLK, WHT, GRY, WD], [78, 92, 50, 70], "60", [["mat", "Heat mat"]], (o) => { const pm = part(o, "mat"), u = o.uid;
      let s = scene(o, 184) + sh(o, 100, 186, 80, 5) + `<path d="M30 28H170V182H30Z" fill="url(#${u}-v)"/><path d="M170 28L180 22V176L170 182Z" fill="url(#${u}-sd)"/><path d="M30 28L40 22H180L170 28Z" fill="url(#${u}-tp)"/>`;
      for (let r = 0; r < 5; r++) { const y = 34 + r * 29;
        s += `<rect x="36" y="${y}" width="128" height="24" fill="#0e1012"/>` + (pm.on ? `<rect x="36" y="${y + 21}" width="128" height="3" fill="#ff6a2a" opacity=".55"/>` : "") +
          `<path d="${rr(40, y + 2, 120, 21, 2)}" fill="#e8ecef" opacity=".35"/>` + (r % 2 ? A.python(100, y + 20, .55) : "") + `<rect x="92" y="${y + 9}" width="16" height="5" rx="2" fill="#cfd4d9"/>` +
          (o.on ? "" : `<rect x="36" y="${y}" width="128" height="24" fill="#000" opacity=".35"/>`); }
      return svgH(o, s + meter(o, 132, 4, [78, 92, 50, 70])); }),

    
    ic("leotank", "Leopard gecko tank", [BLK, GRY, WHT], [75, 90, 20, 40], "40", [["mat", "Heat mat"], ["day", "Day light"]], (o) => { const pm = part(o, "mat"), pd = part(o, "day"), u = o.uid;
      return svgH(o, scene(o, 150) + enclosure(o, { x: 28, y: 80, w: 144, h: 66, kind: "glass", back: "#2a2420" },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 10}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${u}-sand)"/>` + hide(o, ix + 10, iy + ih - 8, 34, 22) + rock(o, ix + iw - 40, iy + ih - 8, 30, 14) +
          `<ellipse cx="${ix + 90}" cy="${iy + ih - 8}" rx="9" ry="2.6" fill="#6fa8c8"/>` + A.gecko(ix + 70, iy + ih - 10, 1.25),
        (ix, iy, iw, ih) => FX.mat(pm, ix, iy + ih, iw * .4) + FX.day(pd, ix, iy, iw, ih)) +
        uvbBar(o, 40, 77, 120, pd.on) + `<rect x="32" y="146" width="56" height="3" fill="${pm.on ? "#ff6a2a" : "#3a3f46"}"/>` + meter(o, 132, 86, [75, 90, 20, 40])); }),

    
    ic("turtle", "Turtle aquarium", [BLK, GRY, WHT], [75, 90, 40, 95], "60", [["heat", "Heat lamp"], ["uvb", "UVB"], ["pump", "Water pump"]], (o) => { const ph = part(o, "heat"), pu = part(o, "uvb"), pp = part(o, "pump"), u = o.uid;
      return svgH(o, scene(o, 176) + enclosure(o, { x: 22, y: 76, w: 156, h: 68, kind: "glass", back: "#18262c", stand: true },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + 22}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${u}-aq)"/><g class="${P}caus"><rect x="${ix - 10}" y="${iy + 24}" width="${iw + 20}" height="40" fill="url(#${u}-wav)" opacity=".4"/></g>` +
          `<path d="M${ix} ${iy + ih - 6}H${ix + iw}V${iy + ih}H${ix}Z" fill="#9a8a6a"/><path d="M${ix + 20} ${iy + 20}H${ix + 70}L${ix + 64} ${iy + 26}H${ix + 26}Z" fill="#8a7a5a"/><path d="M${ix + 70} ${iy + 20}L${ix + 96} ${iy + 40}L${ix + 92} ${iy + 43}L${ix + 66} ${iy + 25}Z" fill="#7a6a4a"/><path d="M${ix + 20} ${iy + 20}V${iy + 8}" stroke="#7a6a4a" stroke-width="2"/>` + A.turtle(ix + 44, iy + 21, 1.2) +
          (pp.on ? bubbles(pp, [[ix + iw - 20, iy + 60], [ix + iw - 26, iy + 54], [ix + iw - 16, iy + 48]]) + `<path class="${P}flow" d="M${ix + iw - 10} ${iy + 22}q-10 4 -20 2" stroke="#e6f8ff" stroke-width="2" stroke-dasharray="3 4" fill="none"/>` : "") +
          leafy(ix + 110, iy + ih - 6, 1.3, "#3f8a3a"),
        (ix, iy, iw, ih) => FX.heat(ph, ix + 44, iy, ih) + FX.uvb(pu, ix, iy, iw, ih)) +
        lampDome(o, 66, 72, ph.on) + uvbBar(o, 96, 73, 60, pu.on) + `<path d="${rr(164, 100, 10, 30, 2)}" fill="#2a2e34"/>` + meter(o, 138, 82, [75, 90, 40, 95])); }),

    
    ic("hermit", "Hermit crab tank", [BLK, GRY, WHT], [75, 85, 70, 95], "80", [["mat", "Heat mat"], ["mist", "Mister"]], (o) => { const pm = part(o, "mat"), ps = part(o, "mist"), u = o.uid;
      return svgH(o, scene(o, 150) + enclosure(o, { x: 30, y: 78, w: 140, h: 68, kind: "glass", back: "#2a2a24" },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 16}Q${ix + 40} ${iy + ih - 22} ${ix + iw} ${iy + ih - 14}V${iy + ih}H${ix}Z" fill="url(#${u}-sand)"/>` +
          `<path d="M${ix + 10} ${iy + ih - 14}Q${ix + 26} ${iy + ih - 40} ${ix + 44} ${iy + ih - 14}Z" fill="#6a4a2a"/><path d="M${ix + 20} ${iy + ih - 14}Q${ix + 27} ${iy + ih - 26} ${ix + 34} ${iy + ih - 14}Z" fill="#1a120a"/>` +
          A.crab(ix + 66, iy + ih - 14, 1.3) + A.crab(ix + 100, iy + ih - 12, 1) + `<ellipse cx="${ix + 120}" cy="${iy + ih - 12}" rx="10" ry="3" fill="#6fa8c8"/>` + `<circle cx="${ix + 90}" cy="${iy + ih - 12}" r="3" fill="#e8c8a0"/>`,
        (ix, iy, iw, ih) => FX.mat(pm, ix + iw * .1, iy + ih, iw * .5) + FX.mist(ps, ix + iw - 40, iy)) + meter(o, 130, 84, [75, 85, 70, 95])); }),

    
    ic("tarantula", "Tarantula enclosure", [BLK, WHT, GRY], [70, 82, 60, 80], "60", [["mat", "Heat mat"]], (o) => { const pm = part(o, "mat"), u = o.uid;
      return svgH(o, scene(o, 150) + enclosure(o, { x: 56, y: 70, w: 88, h: 76, kind: "acrylic", back: "#262018", d: 8 },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + ih - 22}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${u}-sub)"/>` + `<path d="M${ix + 50} ${iy + ih - 20}l6 -16l20 0l6 16Z" fill="#6a4a2a"/>` + A.tarantula(ix + 30, iy + ih - 20, 1.5) +
          `<path d="M${ix + 50} ${iy + 10}q10 20 30 10M${ix + 56} ${iy + 6}l14 20" stroke="#fff" stroke-opacity=".2" fill="none"/>`,
        (ix, iy, iw, ih) => FX.mat(pm, ix + iw - 30, iy + ih, 30)) +
        [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${64 + i * 14}" cy="76" r="1.4" fill="#000" opacity=".6"/>`).join("") + meter(o, 104, 80, [70, 82, 60, 80])); }),

    
    ic("axolotl", "Axolotl tank", [BLK, GRY, WHT], [60, 68, 40, 95], "60", [["day", "Day light"], ["pump", "Water pump"], ["chill", "Chiller"]], (o) => { const pd = part(o, "day"), pp = part(o, "pump"), pc = part(o, "chill"), u = o.uid;
      return svgH(o, scene(o, 176) + enclosure(o, { x: 18, y: 70, w: 140, h: 74, kind: "glass", back: "#16242a", stand: true },
        (ix, iy, iw, ih) => `<path d="M${ix} ${iy + 6}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${u}-aq)"/>` + (pc.on ? `<path d="M${ix} ${iy + 6}H${ix + iw}V${iy + ih}H${ix}Z" fill="#9fd8ff" opacity=".15"/>` : "") +
          `<g class="${P}caus"><rect x="${ix - 10}" y="${iy + 10}" width="${iw + 20}" height="50" fill="url(#${u}-wav)" opacity=".35"/></g><path d="M${ix} ${iy + ih - 7}H${ix + iw}V${iy + ih}H${ix}Z" fill="#c9b48a"/>` +
          leafy(ix + 20, iy + ih - 7, 1.4, "#3f8a3a") + `<path d="${rr(ix + iw - 46, iy + ih - 18, 30, 12, 6)}" fill="#c0663a"/><ellipse cx="${ix + iw - 44}" cy="${iy + ih - 12}" rx="3" ry="6" fill="#4a2414"/>` + A.axo(ix + 70, iy + 40, 1.1) + bubbles(pp, [[ix + iw - 12, iy + 50], [ix + iw - 16, iy + 40], [ix + iw - 10, iy + 30]]),
        (ix, iy, iw, ih) => FX.day(pd, ix, iy, iw, ih)) +
        uvbBar(o, 28, 67, 120, pd.on) + `<path d="${rr(162, 120, 30, 50, 4)}" fill="#2a2e34"/><path d="${rr(165, 126, 24, 10, 2)}" fill="#0a0d10"/>` + digits(pc.on ? "62" : "--", 170, 128, 6, pc.on ? CYAN : "#2b3a40") +
        [0, 1, 2, 3].map((i) => `<path d="M166 ${142 + i * 6}H188" stroke="#000" stroke-opacity=".5"/>`).join("") + tube("M168 120C168 100 150 96 144 90", 3, ["#1a3a6a", "#3a6ad8", "#9cc8ef"]) + meter(o, 118, 78, [60, 68, 40, 95])); }),

    
    ic("birdcage", "Bird cage", [WHT, BLK, GRY], [65, 80, 40, 70], "60", [["day", "Day light"]], (o) => { const pd = part(o, "day"), u = o.uid;
      const cage = `M50 172V72Q50 40 100 40Q150 40 150 72V172Z`;
      return svgH(o, scene(o, 182) + sh(o, 100, 184, 60, 4) + (pd.on ? `<path d="${cage}" fill="#fff8e6" opacity=".18"/>` : "") +
        `<path d="M70 100H130" stroke="#8a6a3a" stroke-width="3"/><path d="M60 140H140" stroke="#8a6a3a" stroke-width="3"/>` + A.bird(96, 99, 1) + `<path d="${rr(118, 146, 16, 8, 2)}" fill="#e9dcb8"/>` +
        `<path d="${cage}" fill="url(#${u}-wire)"/><path d="${cage}" fill="none" stroke="url(#${u}-v)" stroke-width="3"/><path d="M50 72H150M50 120H150" stroke="url(#${u}-v)" stroke-width="2"/>` +
        `<path d="M44 160H156V174H44Z" fill="url(#${u}-v)"/><circle cx="100" cy="34" r="6" fill="none" stroke="url(#${u}-v)" stroke-width="2.4"/>` + (o.on ? "" : `<path d="${cage}" fill="#000" opacity=".35"/>`) + meter(o, 152, 50, [65, 80, 40, 70])); }),

    
    ic("hamster", "Hamster cage", [WHT, BLK, GRY], [65, 75, 40, 60], "40", [], (o) => { const u = o.uid, p = pal(o.color);
      return svgH(o, scene(o, 172) + sh(o, 100, 174, 80, 4) + `<path d="M24 136H176V170H24Z" fill="#8fc0e6" opacity=".55"/><path d="M24 152H176V170H24Z" fill="#e8dcc0"/>` +
        `<g transform="translate(140 118)"><circle r="22" fill="none" stroke="#c9ced4" stroke-width="3"/><g class="${o.on ? P + "spin" : ""}" style="animation-duration:1.2s">` + [0, 30, 60, 90, 120, 150].map((a) => `<path d="M0 -21V21" stroke="#c9ced4" stroke-width=".8" transform="rotate(${a})"/>`).join("") + `</g></g>` +
        A.hamster(70, 154, 1.1) + `<path d="M24 64H176V136H24Z" fill="url(#${u}-wire)"/><path d="M24 64H176V136H24Z" fill="none" stroke="#c9ced4" stroke-width="2"/>` +
        `<path d="M24 136H176V170H24Z" fill="none" stroke="${p.d}" stroke-width="3"/><path d="M24 136H176V142H24Z" fill="url(#${u}-v)"/>` + meter(o, 30, 70, [65, 75, 40, 60])); }),

    
    ic("rabbitpen", "Indoor rabbit pen", [WHT, BLK, GRY, WD], [60, 72, 30, 60], "40", [], (o) => { const u = o.uid;
      return svgH(o, scene(o, 120, "board") + `<path d="M14 172L40 124H160L186 172Z" fill="#c9b48a" opacity=".7"/>` + A.rabbit(96, 160, 1.3) + `<path d="${rr(130, 150, 24, 10, 3)}" fill="#7fbf5a"/><path d="M40 140h14l-4 14H44Z" fill="#c9a060"/>` +
        `<path d="M14 172V124M58 172V112M100 172V108M142 172V112M186 172V124" stroke="url(#${u}-v)" stroke-width="3"/><path d="M14 124L58 112L100 108L142 112L186 124M14 172H186" fill="none" stroke="url(#${u}-v)" stroke-width="3"/>` +
        `<path d="M14 124L58 112V172H14Z M58 112L100 108V172H58Z M100 108L142 112V172H100Z M142 112L186 124V172H142Z" fill="url(#${u}-wire)" opacity=".7"/>` + meter(o, 150, 84, [60, 72, 30, 60])); }),

    
    ic("incubator", "Egg incubator", [WHT, GRY, BLK], [82, 88, 80, 95], "80", [], (o) => { const u = o.uid;
      return svgH(o, scene(o, 150) + sh(o, 100, 152, 76, 5) + `<path d="${rr(30, 100, 140, 50, 6)}" fill="url(#${u}-v)"/><path d="M30 100L42 86H182L170 100Z" fill="#cfe7f2" fill-opacity=".35"/><path d="M170 100L182 86V136L170 150Z" fill="url(#${u}-sd)"/>` +
        (o.on ? `<path d="M34 92L44 88H178L170 98H40Z" fill="#ffb05a" opacity="${n1(.2 + .3 * o.level)}"/>` : "") +
        [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${56 + i * 24}" cy="94" rx="7" ry="4.6" fill="#f2ead8"/><ellipse cx="${54 + i * 24}" cy="92.6" rx="2.4" ry="1.4" fill="#fff" opacity=".7"/>`).join("") +
        `<path d="M30 100L42 86H182L170 100Z" fill="none" stroke="#fff" stroke-opacity=".5"/><path d="${rr(40, 112, 60, 26, 3)}" fill="#0a0d10"/>` + digits(String(tempF(o)), 46, 117, 9, o.on ? AMB : "#2b3a40") + digits(String(+((o.opt && o.opt.hum) || 80)), 72, 117, 9, o.on ? CYAN : "#2b3a40") +
        [120, 134, 148].map((x) => `<circle cx="${x}" cy="124" r="4" fill="#3a3f46"/>`).join("") + led(o, 160, 124, 1.6, o.on, GREEN, "hg") + meter(o, 124, 54, [82, 88, 80, 95])); }),

    
    ic("brooder", "Chick brooder", [WD, WHT, GRY], [85, 100, 40, 60], "40", [["plate", "Heat plate"]], (o) => { const pp = part(o, "plate"), u = o.uid;
      return svgH(o, scene(o, 176) + sh(o, 100, 178, 86, 5) + `<path d="M18 120H182V174H18Z" fill="url(#${u}-v)"/><path d="M26 126H174V168H26Z" fill="#d9c48a"/>` +
        [[40, 160], [60, 166], [150, 162], [130, 166]].map((q) => `<path d="M${q[0]} ${q[1]}l6 -2" stroke="#b89a5a" stroke-width="2"/>`).join("") +
        (pp.on ? `<ellipse cx="96" cy="160" rx="44" ry="8" fill="url(#${u}-heat)" opacity="${n1(.5 + .5 * pp.level)}"/>` : "") + A.chick(80, 164, 1) + A.chick(104, 166, 1.1) + A.chick(140, 162, .9) +
        `<path d="M58 136L62 162M134 136L130 162" stroke="#3a3f46" stroke-width="2.4"/><path d="${rr(54, 130, 84, 8, 2)}" fill="#3a4a3a"/><path d="M56 131H136" stroke="#fff" stroke-opacity=".25"/>` +
        `<path d="M18 120H182" stroke="${pal(o.color).d}" stroke-width="3"/>` + (o.on ? "" : `<path d="M26 126H174V168H26Z" fill="#000" opacity=".35"/>`) + meter(o, 144, 98, [85, 100, 40, 60])); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "habitats", tab: "Reptile & pet habitats", group: "Home", kind: "device", levelLabel: "Temperature", onWord: "Running", offWord: "Off",
    intro: "Nineteen reptile, amphibian, bird and small-pet enclosures, each with a thermo-hygrometer. The slider sets the temperature (60-105°F) and the Humidity menu the humidity; the reading turns amber, then red, outside that animal's safe range. Heat lamps glow orange, UVB tubes wash blue-white, misters spray, foggers roll, heat mats glow under the floor and pumps run the waterfalls. Off = lights off and a darker tank.",
    css: css2, icons,
  });
})();
