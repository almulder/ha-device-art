
(function () {
  const P = "hda-coops-";
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
.hda-coops-flow{stroke-dashoffset:0}
.hda-anim .hda-coops-flow{animation:hda-coops-flow 1s linear infinite}
@keyframes hda-coops-flow{to{stroke-dashoffset:-18}}
.hda-coops-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-coops-flk{animation:hda-coops-flk .5s ease-in-out infinite alternate}
@keyframes hda-coops-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-coops-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-coops-spin{animation:hda-coops-spin 1s linear infinite}
@keyframes hda-coops-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-coops-blink{animation:hda-coops-blink 1.2s steps(1,end) infinite}
@keyframes hda-coops-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-coops-chase{opacity:.18}
.hda-anim .hda-coops-chase{animation:hda-coops-chase 4s linear infinite}
@keyframes hda-coops-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-coops-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-coops-bub{animation:hda-coops-bub 2s ease-in infinite}
@keyframes hda-coops-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-coops-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-coops-rip{animation:hda-coops-rip 2.2s ease-out infinite}
@keyframes hda-coops-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-coops-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-coops-mist{animation:hda-coops-mist 1.6s ease-in-out infinite}
@keyframes hda-coops-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-coops-heat{opacity:0}
.hda-anim .hda-coops-heat{animation:hda-coops-heat 2.6s ease-out infinite}
.hda-anim .hda-coops-hum{animation:hda-coops-hum .16s linear infinite}
@keyframes hda-coops-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-coops-bob{animation:hda-coops-bob 1.6s ease-in-out infinite}
@keyframes hda-coops-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-coops-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-coops-heat.hda-coops-still{opacity:.4}
.hda-anim .hda-coops-heat.hda-coops-still{opacity:0}
`;
  
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css2 = css + `
.hda-coops-peck{transform-box:fill-box;transform-origin:20% 90%}
.hda-anim .hda-coops-peck{animation:hda-coops-peck 2.6s ease-in-out infinite}
@keyframes hda-coops-peck{0%,55%,100%{transform:rotate(0deg)}65%,80%{transform:rotate(38deg)}}
.hda-anim .hda-coops-walk{animation:hda-coops-walk 9s ease-in-out infinite alternate}
@keyframes hda-coops-walk{0%{transform:translate(-8px,0)}100%{transform:translate(8px,0)}}
.hda-coops-drip{opacity:0}
.hda-anim .hda-coops-drip{animation:hda-coops-drip 1.8s ease-in infinite}
@keyframes hda-coops-drip{0%{transform:translate(0,0);opacity:0}20%{opacity:.9}100%{transform:translate(0,10px);opacity:0}}
`;
  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const RED_B = "#a8322c", WHT = "#ecebe6", GRY = "#8a9096", WOOD = "#b07a4a", GRN = "#5a7a4a";
  // (multi-function) o.parts holds only the parts the owner ticked. A part left out follows the one device as a Device
  // Image (no o.mf, as today: the auto door, light and heaters follow o.on) and stays off / closed, never animated, as a
  // Multi-Function Image (o.mf). The readings come from o.pval when o.mf (temp = the coop temperature, water = the
  // waterer level in %), else from the Temperature menu and the slider (as today); a reading left out is blank.
  const has = (o, k) => !!(o.parts && o.parts[k] != null);
  const part = (o, id) => Object.assign({}, o, { on: has(o, id) ? !!o.parts[id] : !o.mf && !!o.on });
  const val = (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" && isFinite(+o.pval[k]) ? Math.round(+o.pval[k]) : null);
  const wlev = (o) => (o.mf ? (val(o, "water") == null ? null : Math.max(0, Math.min(1, val(o, "water") / 100))) : o.level);
  const TEMPS = [["40", "40°F"], ["20", "20°F"], ["60", "60°F"], ["80", "80°F"], ["95", "95°F"]];
  const OPTS = [{ id: "temp", name: "Temperature", values: TEMPS }];
  const tval = (o) => (o.mf ? val(o, "temp") : +((o.opt && o.opt.temp) || 40));

  function cextra(o) {
    const u = o.uid;
    return lg(u + "-day", 1, [[0, "#6fa8dc", .55], [1, "#bcd8ee", .25]]) + lg(u + "-dusk", 1, [[0, "#2a2a5a", .8], [.7, "#a85a6a", .5], [1, "#f0a060", .4]]) +
      lg(u + "-wd", 1, [[0, "#c08a58"], [1, "#7a4c28"]]) + lg(u + "-roof", 1, [[0, "#5a5f66"], [1, "#2e3238"]]) + lg(u + "-gal", 0, [[0, "#7a828a"], [.4, "#e6e9ec"], [.7, "#aab1b8"], [1, "#6a7178"]]) +
      lg(u + "-wat", 1, [[0, "#9fdcff", .9], [1, "#2f7fc4", .95]]) + rg(u + "-heat", [[0, "#ff8a3a", .7], [.5, "#ff5a1a", .25], [1, "#ff4a1a", 0]]) +
      `<pattern id="${u}-mesh" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 0L6 6M6 0L0 6" stroke="#c9ced4" stroke-opacity=".55" stroke-width=".5"/></pattern>` +
      `<pattern id="${u}-sidp" width="40" height="7" patternUnits="userSpaceOnUse"><path d="M0 6.5H40" stroke="#000" stroke-opacity=".28"/><path d="M0 5.5H40" stroke="#fff" stroke-opacity=".1"/></pattern>` +
      `<pattern id="${u}-shg" width="10" height="6" patternUnits="userSpaceOnUse"><path d="M0 5.5H10M5 0V5.5" stroke="#000" stroke-opacity=".35" stroke-width=".6"/></pattern>`;
  }
  const svgC = (o, body) => svg(o, body, cextra(o));
  
  const yard = (o, gy, dusk) => { const u = o.uid; return BG(`<rect width="200" height="${gy}" fill="url(#${u}-${dusk ? "dusk" : "day"})"/>` + (dusk ? `<circle cx="160" cy="24" r="7" fill="#f4ecd0" opacity=".85"/>` : "") +
    `<path d="M0 ${gy - 18}Q24 ${gy - 34} 50 ${gy - 22}Q80 ${gy - 38} 110 ${gy - 22}Q140 ${gy - 36} 170 ${gy - 22}Q186 ${gy - 30} 200 ${gy - 22}V${gy + 2}H0Z" fill="url(#${u}-hedge)"/>` +
    `<path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-grass)"/><path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-bld)"/>` + (dusk ? `<rect width="200" height="200" fill="#0a0a2a" opacity=".25"/>` : "")); };

  
  function hen(x, y, s, breed, peck, flip) {
    const C = { buff: ["#e0b060", "#c08a3a"], black: ["#1e2024", "#3a5a4a"], speck: ["#7a3a1e", "#5a2a14"], duck: ["#f4f2ec", "#d9d5cc"], quail: ["#8a6a4a", "#5a4430"] }[breed] || ["#e0b060", "#c08a3a"];
    const tr = flip ? `transform="translate(${2 * x} 0) scale(-1 1)"` : "";
    let b = `<g ${tr}><g class="hda-coops-walk">`;
    if (breed === "duck") b += `<path d="M${x - 12 * s} ${y - 6 * s}Q${x - 10 * s} ${y - 14 * s} ${x + 2 * s} ${y - 13 * s}Q${x + 10 * s} ${y - 11 * s} ${x + 10 * s} ${y - 5 * s}Q${x + 2 * s} ${y} ${x - 8 * s} ${y - 2 * s}Z" fill="${C[0]}"/><path d="M${x - 12 * s} ${y - 6 * s}l${-4 * s} ${-3 * s}l${2 * s} ${4 * s}Z" fill="${C[1]}"/>` +
      `<g class="${peck ? "hda-coops-peck" : ""}"><path d="M${x + 6 * s} ${y - 11 * s}Q${x + 6 * s} ${y - 22 * s} ${x + 10 * s} ${y - 22 * s}Q${x + 14 * s} ${y - 22 * s} ${x + 13 * s} ${y - 17 * s}L${x + 10 * s} ${y - 11 * s}Z" fill="${C[0]}"/><path d="M${x + 13 * s} ${y - 19 * s}l${5 * s} ${1 * s}l${-5 * s} ${1.4 * s}Z" fill="#f0a030"/><circle cx="${x + 11 * s}" cy="${y - 19.5 * s}" r="${.8 * s}" fill="#111"/></g>` +
      `<path d="M${x - 2 * s} ${y - 1 * s}v${2 * s}M${x + 3 * s} ${y - 1 * s}v${2 * s}" stroke="#f0a030" stroke-width="${1.6 * s}"/>`;
    else if (breed === "quail") b += `<ellipse cx="${x}" cy="${y - 4 * s}" rx="${7 * s}" ry="${4.6 * s}" fill="${C[0]}"/><circle cx="${x + 6 * s}" cy="${y - 8 * s}" r="${2.6 * s}" fill="${C[1]}"/>` + [[-3, -5], [0, -3], [3, -5], [-1, -6]].map((q) => `<circle cx="${x + q[0] * s}" cy="${y + q[1] * s}" r="${.6 * s}" fill="#f4ecd8"/>`).join("") + `<path d="M${x + 8 * s} ${y - 8 * s}l${1.6 * s} ${.6 * s}" stroke="#333" stroke-width="${s}"/>`;
    else {
      b += `<path d="M${x - 12 * s} ${y - 8 * s}Q${x - 18 * s} ${y - 20 * s} ${x - 12 * s} ${y - 22 * s}Q${x - 8 * s} ${y - 16 * s} ${x - 6 * s} ${y - 12 * s}Z" fill="${C[1]}"/>` +
        `<path d="M${x - 13 * s} ${y - 8 * s}Q${x - 12 * s} ${y - 17 * s} ${x - 2 * s} ${y - 16 * s}Q${x + 8 * s} ${y - 15 * s} ${x + 9 * s} ${y - 9 * s}Q${x + 6 * s} ${y - 1 * s} ${x - 4 * s} ${y - 1 * s}Q${x - 12 * s} ${y - 2 * s} ${x - 13 * s} ${y - 8 * s}Z" fill="${C[0]}"/>` +
        `<path d="M${x - 9 * s} ${y - 9 * s}Q${x - 2 * s} ${y - 13 * s} ${x + 4 * s} ${y - 8 * s}" fill="none" stroke="${C[1]}" stroke-width="${1.6 * s}"/>`;
      if (breed === "speck") b += [[-8, -8], [-4, -11], [0, -7], [3, -11], [-6, -4], [2, -4], [-10, -12]].map((q) => `<circle cx="${x + q[0] * s}" cy="${y + q[1] * s}" r="${.8 * s}" fill="#f4ecd8"/>`).join("");
      if (breed === "black") b += `<path d="M${x - 14 * s} ${y - 12 * s}Q${x - 14 * s} ${y - 18 * s} ${x - 11 * s} ${y - 20 * s}" stroke="#4a8a6a" stroke-width="${s}" fill="none" opacity=".7"/>`;
      b += `<g class="${peck ? "hda-coops-peck" : ""}"><path d="M${x + 4 * s} ${y - 13 * s}Q${x + 5 * s} ${y - 22 * s} ${x + 9 * s} ${y - 22 * s}Q${x + 13 * s} ${y - 22 * s} ${x + 12 * s} ${y - 16 * s}L${x + 9 * s} ${y - 11 * s}Z" fill="${C[0]}"/>` +
        `<path d="M${x + 6 * s} ${y - 22 * s}q${1 * s} ${-3 * s} ${2 * s} 0q${1 * s} ${-3 * s} ${2 * s} 0q${1.4 * s} ${-2 * s} ${2 * s} ${1 * s}Z" fill="#d9302a"/><path d="M${x + 11 * s} ${y - 16 * s}q${1 * s} ${3 * s} ${-1 * s} ${3 * s}" fill="#d9302a"/>` +
        `<path d="M${x + 12 * s} ${y - 19 * s}l${3 * s} ${1 * s}l${-3 * s} ${1 * s}Z" fill="#e8b030"/><circle cx="${x + 10 * s}" cy="${y - 19 * s}" r="${.8 * s}" fill="#111"/></g>` +
        `<path d="M${x - 3 * s} ${y - 1 * s}v${3 * s}l${-2 * s} ${1 * s}M${x + 2 * s} ${y - 1 * s}v${3 * s}l${2 * s} ${1 * s}" stroke="#e0a030" stroke-width="${1.2 * s}" fill="none"/>`;
    }
    return b + `</g></g>`;
  }
  
  function fount(o, x, y, s) {
    const lv = wlev(o), h = 24 * s, w = 16 * s, wl = lv == null || lv < .05 ? 0 : lv, col = lv == null ? null : lv < .05 ? RED : lv < .25 ? AMB : null;
    return `<ellipse cx="${x}" cy="${y}" rx="${w * .9}" ry="${3 * s}" fill="#000" opacity=".3"/><path d="M${x - w * .8} ${y}L${x - w * .7} ${y - 4 * s}H${x + w * .7}L${x + w * .8} ${y}Z" fill="#c8323a"/>` +
      `<path d="M${x - w / 2} ${y - 4 * s}V${y - h + 4 * s}Q${x - w / 2} ${y - h} ${x} ${y - h}Q${x + w / 2} ${y - h} ${x + w / 2} ${y - h + 4 * s}V${y - 4 * s}Z" fill="#eef0f1"/>` +
      `<path d="M${x - w / 2} ${y - 4 * s}V${y - h + 4 * s}Q${x - w / 2} ${y - h} ${x} ${y - h}Q${x + w / 2} ${y - h} ${x + w / 2} ${y - h + 4 * s}V${y - 4 * s}Z" fill="url(#${o.uid}-fx)"/>` +
      `<rect x="${n1(x - 1.6 * s)}" y="${n1(y - h + 5 * s)}" width="${n1(3.2 * s)}" height="${n1(h - 10 * s)}" rx="${s}" fill="#1a2a3a" opacity=".5"/>` +
      `<rect x="${n1(x - 1.6 * s)}" y="${n1(y - 5 * s - (h - 10 * s) * wl)}" width="${n1(3.2 * s)}" height="${n1((h - 10 * s) * wl)}" rx="${s}" fill="${col || "#5ab4ec"}"/>` +
      (col ? `<rect x="${n1(x - 2.6 * s)}" y="${n1(y - h + 4 * s)}" width="${n1(5.2 * s)}" height="${n1(h - 8 * s)}" rx="${s}" fill="none" stroke="${col}" stroke-width=".8"${lv < .05 ? ` class="${P}blink"` : ""}/>` : "");
  }
  
  function ctemp(o, x, y) {
    const t = tval(o), col = t <= 32 ? "#6fb8ff" : t >= 90 ? RED : "#7ee08a";
    if (t == null) return `<path d="${rr(x, y, 30, 15, 2)}" fill="#e9ecef"/><path d="${rr(x + 2, y + 2, 26, 11, 1.5)}" fill="#0a0d10"/>`;
    return `<path d="${rr(x, y, 30, 15, 2)}" fill="#e9ecef"/><path d="${rr(x + 2, y + 2, 26, 11, 1.5)}" fill="#0a0d10"/>` + digits(String(t), x + 6, y + 4.4, 6.4, col, "rgba(255,255,255,.05)") +
      `<circle cx="${x + 19.4}" cy="${y + 4.8}" r=".9" fill="none" stroke="${col}" stroke-width=".6"/><path d="M${x + 21.4} ${y + 4.4}v6.2M${x + 21.4} ${y + 4.4}h3M${x + 21.4} ${y + 7.4}h2.4" stroke="${col}" stroke-width=".8"/>`;
  }
  
  function house(o, x, y, w, h, roofH, opt) {
    const u = o.uid, p = pal(o.color); opt = opt || {};
    let s = `<path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-v)"/><path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-sidp)"/><path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-fx)"/>` +
      `<path d="M${x - 5} ${y + 2}L${x + w / 2} ${y - roofH}L${x + w + 5} ${y + 2}Z" fill="url(#${u}-roof)"/><path d="M${x - 5} ${y + 2}L${x + w / 2} ${y - roofH}L${x + w + 5} ${y + 2}Z" fill="url(#${u}-shg)"/>` +
      `<path d="M${x - 5} ${y + 2}L${x + w / 2} ${y - roofH}L${x + w + 5} ${y + 2}" fill="none" stroke="#1e2226" stroke-width="1.6"/>` +
      `<path d="M${x} ${y}V${y + h}M${x + w} ${y}V${y + h}M${x} ${y + h}H${x + w}" stroke="${opt.trim || "#f2f0ea"}" stroke-width="2"/>`;
    if (opt.vent) s += `<path d="${rr(x + w / 2 - 6, y + 4, 12, 6, 1)}" fill="url(#${u}-mesh)" stroke="#f2f0ea"/>`;
    return s;
  }
  
  function popdoor(o, x, y, w, h, open, auto) {
    let s = `<path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="#14100c"/>`;
    s += open ? `<rect x="${x}" y="${y - h + 2}" width="${w}" height="${h - 2}" fill="url(#${o.uid}-gal)"/>` : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${o.uid}-gal)"/><path d="M${x + 2} ${y + h / 2}H${x + w - 2}" stroke="#000" stroke-opacity=".2"/>`;
    s += `<path d="M${x - 2} ${y - h}V${y + h}M${x + w + 2} ${y - h}V${y + h}" stroke="#5a6068" stroke-width="1.6"/>`;
    if (auto) s += `<path d="${rr(x - 3, y - h - 9, w + 6, 9, 1.5)}" fill="#2a2e34"/>` + led(o, x + w - 1, y - h - 4.5, 1.1, true, open ? GREEN : AMB, open ? "hg" : "ho");
    return s;
  }
  const ramp = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#8a5a34" stroke-width="5" stroke-linecap="round"/>` + [.2, .4, .6, .8].map((t) => `<path d="M${n1(x1 + (x2 - x1) * t - 2)} ${n1(y1 + (y2 - y1) * t - 1)}l4 1" stroke="#5a3a1e" stroke-width="1.4"/>`).join("");
  const runBox = (o, x, y, w, h, roof) => `<path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="url(#${o.uid}-mesh)"/><path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="none" stroke="url(#${o.uid}-wd)" stroke-width="3"/>` +
    `<path d="M${x + w / 2} ${y}V${y + h}" stroke="url(#${o.uid}-wd)" stroke-width="2.4"/>` + (roof ? `<path d="M${x - 3} ${y}L${x + 6} ${y - 8}H${x + w - 6}L${x + w + 3} ${y}Z" fill="url(#${o.uid}-roof)"/>` : "");
  const lampGlow = (o, x, y) => o.on ? `<circle cx="${x}" cy="${y}" r="22" fill="url(#${o.uid}-heat)"/><circle cx="${x}" cy="${y}" r="3" fill="#ff6a2a"/>` : `<circle cx="${x}" cy="${y}" r="3" fill="#5a2a1a"/>`;
  const winLight = (o, x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.on ? "#ffe2a0" : "#2a2e34"}"/>` + (o.on ? `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="#ffe2a0" opacity=".25"/>` : "") + `<path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="#f2f0ea" stroke-width="1"/>`;

  // parts: [id, name, type?, unit, min, max, def] (no type = switch); every drawing with parts also gets its readings
  const READS = [["temp", "Coop temperature", "value", "°F", -20, 110, 40], ["water", "Water level", "value", "%", 0, 100, 80]];
  const pcs = (list) => list.map((p) => Object.assign({ id: p[0], name: p[1] }, p[2] ? { type: p[2] } : {}, p[3] ? { unit: p[3], min: p[4], max: p[5], def: p[6] } : {}));
  const ic = (id, name, colors, parts, render) => ({ id, name, colors, picker: true, colorLabel: "Paint", parts: parts.length ? pcs(parts.concat(READS)) : undefined, options: OPTS, render });
  const DOOR = ["door", "Auto door"], LIGHT = ["light", "Light"], HEAT = ["heat", "Heat lamp"], WHEAT = ["wheat", "Waterer heater"];

  const icons = [
    
    ic("backyard", "Coop with run", [RED_B, WHT, GRY, WOOD, GRN], [DOOR, LIGHT], (o) => { const od = part(o, "door"), ol = part(o, "light"), open = od.on;
      return svgC(o, yard(o, 120, !open) + sh(o, 104, 172, 90, 5) +
        `<path d="M24 120V160M86 120V160" stroke="url(#${o.uid}-wd)" stroke-width="5"/>` + house(o, 20, 74, 70, 46, 24, { vent: true }) + winLight(ol, 34, 88, 14, 12) +
        `<path d="M90 92H104V120H90Z" fill="url(#${o.uid}-v)"/><path d="M88 92L106 86V92Z" fill="url(#${o.uid}-roof)"/>` + popdoor(od, 60, 104, 12, 14, open, true) + ramp(66, 120, 94, 162) +
        runBox(o, 88, 112, 98, 52, true) + (open ? hen(130, 160, .9, "buff", true) + hen(160, 158, .8, "speck", false, true) + hen(112, 162, .7, "black", true) : "") + fount(o, 176, 162, .8) +
        `<path d="M86 164H188" stroke="url(#${o.uid}-wd)" stroke-width="3"/>` + ctemp(o, 22, 128)); }),

    
    ic("walkin", "Walk-in shed coop", [RED_B, WHT, GRY, WOOD, GRN], [DOOR, LIGHT, HEAT], (o) => { const u = o.uid, od = part(o, "door"), ol = part(o, "light"), oh = part(o, "heat"), open = od.on;
      return svgC(o, yard(o, 130, !open) + sh(o, 100, 172, 80, 5) +
        `<path d="M34 170V96L50 70H150L166 96V170Z" fill="url(#${u}-v)"/><path d="M34 170V96L50 70H150L166 96V170Z" fill="url(#${u}-sidp)"/>` +
        `<path d="M30 98L48 66H152L170 98" fill="none" stroke="url(#${u}-roof)" stroke-width="7"/><path d="M34 96L50 70H150L166 96" fill="none" stroke="#f2f0ea" stroke-width="2"/>` +
        `<path d="${rr(76, 112, 48, 58, 1)}" fill="url(#${u}-v)" stroke="#f2f0ea" stroke-width="2.4"/><path d="M76 112L124 170M124 112L76 170M100 112V170" stroke="#f2f0ea" stroke-width="2"/>` +
        winLight(ol, 92, 82, 16, 12) + (oh.on ? `<circle cx="100" cy="88" r="10" fill="url(#${u}-heat)"/>` : "") + popdoor(od, 140, 152, 14, 16, open, true) + ramp(147, 168, 166, 178) +
        (open ? hen(48, 180, .8, "buff", true) + hen(184, 182, .75, "black", false, true) + hen(70, 186, .7, "speck", true) : "") + fount(o, 26, 184, .75) + ctemp(o, 40, 100)); }),

    
    ic("tractor", "A-frame tractor", [WOOD, GRN, WHT, RED_B, GRY], [], (o) => { const u = o.uid, open = o.on;
      return svgC(o, yard(o, 110, !open) + sh(o, 100, 170, 84, 5) +
        `<path d="M22 166L100 74L178 166Z" fill="url(#${u}-mesh)"/>` + (open ? hen(76, 162, .85, "buff", true) + hen(118, 164, .8, "speck", true, true) : "") + fount(o, 150, 164, .7) +
        `<path d="M100 74L60 120H140Z" fill="url(#${u}-v)"/><path d="M100 74L60 120H140Z" fill="url(#${u}-sidp)"/><path d="M84 106H96V120H84Z" fill="#14100c"/>` +
        `<path d="M22 166L100 74L178 166" fill="none" stroke="url(#${u}-wd)" stroke-width="4"/><path d="M18 166H182" stroke="url(#${u}-wd)" stroke-width="5"/>` +
        [36, 164].map((x) => `<circle cx="${x}" cy="168" r="9" fill="#1a1c20"/><circle cx="${x}" cy="168" r="3.6" fill="#8a9096"/>`).join("") + `<path d="M182 160L196 150" stroke="url(#${u}-wd)" stroke-width="4" stroke-linecap="round"/>` + ctemp(o, 85, 128)); }),

    
    ic("raised", "Raised coop & ramp", [WHT, RED_B, GRY, WOOD, GRN], [DOOR], (o) => { const u = o.uid, od = part(o, "door"), open = od.on;
      return svgC(o, yard(o, 130, !open) + sh(o, 96, 176, 60, 5) + `<path d="M56 116V176M136 116V176" stroke="url(#${u}-wd)" stroke-width="6"/>` +
        house(o, 50, 70, 92, 50, 28, { vent: true }) + `<path d="M142 84H164V112H142Z" fill="url(#${u}-v)"/><path d="M140 84L166 76V84Z" fill="url(#${u}-roof)"/><path d="M142 94H164" stroke="#000" stroke-opacity=".25"/>` +
        popdoor(od, 64, 102, 14, 16, open, true) + ramp(71, 120, 40, 172) + (open ? hen(30, 176, .8, "black", true) + hen(110, 182, .85, "buff", true, true) : "") + fount(o, 160, 180, .8) + ctemp(o, 92, 84)); }),

    
    ic("plastic", "Plastic coop", [GRN, WHT, GRY, "#c8323a", "#4a6aa8"], [DOOR], (o) => { const u = o.uid, od = part(o, "door"), open = od.on;
      return svgC(o, yard(o, 118, !open) + sh(o, 104, 172, 90, 5) + `<path d="M24 120V166M84 120V166" stroke="#3a3f46" stroke-width="4"/>` +
        `<path d="M18 120Q16 76 54 72Q92 76 90 120Z" fill="url(#${u}-c)"/><path d="M18 120Q16 76 54 72Q92 76 90 120Z" fill="url(#${u}-g)" opacity=".35"/>` + [84, 96, 108].map((y) => `<path d="M22 ${y}Q54 ${y - 6} 86 ${y}" fill="none" stroke="#000" stroke-opacity=".18"/>`).join("") +
        popdoor(od, 84, 108, 10, 12, open, false) + `<path d="M90 120H186V166H90Z" fill="url(#${u}-mesh)"/><path d="M90 120H186V166H90Z" fill="none" stroke="#3a3f46" stroke-width="2"/>` +
        `<path d="M90 120Q138 100 186 120" fill="none" stroke="#3a3f46" stroke-width="2"/>` + (open ? hen(128, 162, .85, "speck", true) + hen(160, 160, .8, "buff", false, true) : "") + fount(o, 104, 164, .7) +
        [30, 78].map((x) => `<circle cx="${x}" cy="168" r="6" fill="#1a1c20"/>`).join("") + ctemp(o, 38, 96)); }),

    
    ic("fenced", "Coop & fenced run", [RED_B, WHT, GRY, WOOD, GRN], [DOOR, LIGHT], (o) => { const u = o.uid, od = part(o, "door"), ol = part(o, "light"), open = od.on;
      let fence = ""; for (let i = 0; i < 9; i++) fence += `<path d="M${10 + i * 23} 118V174" stroke="url(#${u}-wd)" stroke-width="3"/>`;
      return svgC(o, yard(o, 110, !open) + sh(o, 60, 132, 46, 4) + house(o, 30, 92, 56, 38, 20) + winLight(ol, 42, 102, 10, 9) + popdoor(od, 66, 116, 10, 12, open, true) +
        `<path d="M8 130H196V174H8Z" fill="url(#${u}-mesh)"/>` + fence + `<path d="M8 130H196M8 174H196" stroke="url(#${u}-wd)" stroke-width="2.4"/><path d="M150 132H172V172H150Z" fill="none" stroke="url(#${u}-wd)" stroke-width="2"/><path d="M150 132L172 172M172 132L150 172" stroke="url(#${u}-wd)" stroke-width="1.4"/>` +
        (open ? hen(60, 168, .8, "buff", true) + hen(100, 170, .85, "black", false, true) + hen(130, 166, .75, "speck", true) : "") + fount(o, 186, 168, .7) + ctemp(o, 96, 92)); }),

    
    ic("quail", "Quail hutch", [WOOD, WHT, GRY, RED_B], [LIGHT, HEAT], (o) => { const u = o.uid, ol = part(o, "light"), oh = part(o, "heat");
      return svgC(o, yard(o, 120, !o.on) + sh(o, 100, 176, 76, 5) + `<path d="M36 140V176M164 140V176" stroke="url(#${u}-wd)" stroke-width="5"/>` +
        `<path d="M28 80H172V142H28Z" fill="url(#${u}-v)"/><path d="M22 82L36 66H164L178 82Z" fill="url(#${u}-roof)"/>` +
        `<path d="M36 88H118V136H36Z" fill="#2a2018"/>` + (ol.on ? `<path d="M36 88H118V136H36Z" fill="#ffe2a0" opacity=".25"/>` : "") + (oh.on ? `<circle cx="60" cy="92" r="18" fill="url(#${u}-heat)"/>` : "") +
        hen(56, 134, .9, "quail") + hen(80, 134, .8, "quail", false, true) + hen(100, 134, .85, "quail") + fount(o, 110, 134, .5) +
        `<path d="M36 88H118V136H36Z" fill="url(#${u}-mesh)"/><path d="M36 88H118V136H36Z" fill="none" stroke="#f2f0ea" stroke-width="2"/>` +
        `<path d="M124 88H164V136H124Z" fill="url(#${u}-v)" stroke="#000" stroke-opacity=".3"/><circle cx="158" cy="112" r="2" fill="#9aa1a9"/>` + ctemp(o, 128, 94)); }),

    
    ic("duckhouse", "Duck house", [WOOD, WHT, GRN, GRY, RED_B], [DOOR], (o) => { const u = o.uid, od = part(o, "door"), open = od.on;
      return svgC(o, yard(o, 112, !open) + BG(`<ellipse cx="148" cy="166" rx="50" ry="16" fill="url(#${u}-wat)" opacity=".85"/><ellipse cx="140" cy="162" rx="24" ry="4" fill="#fff" opacity=".2"/>`) + sh(o, 64, 158, 48, 4) +
        house(o, 26, 112, 76, 44, 26, { vent: true }) + popdoor(od, 54, 136, 18, 20, open, true) + ramp(62, 156, 70, 170) +
        (open ? hen(150, 168, .9, "duck") + hen(176, 164, .8, "duck", true, true) + hen(110, 176, .85, "duck", true) : "") + fount(o, 22, 176, .7) + ctemp(o, 30, 120)); }),

    
    ic("autodoor", "Automatic coop door", [GRY, WHT, RED_B, WOOD], [DOOR], (o) => { const u = o.uid, od = part(o, "door"), open = od.on;
      return svgC(o, BG(`<rect width="200" height="200" fill="url(#${u}-v)"/><rect width="200" height="200" fill="url(#${u}-sidp)"/>`) + sh(o, 100, 170, 60, 4) +
        `<path d="M64 168V58M136 168V58" stroke="url(#${u}-gal)" stroke-width="6"/><path d="M70 110H130V168H70Z" fill="#14100c"/>` +
        `<rect x="70" y="${open ? 52 : 110}" width="60" height="58" fill="url(#${u}-gal)"/><path d="M74 ${open ? 80 : 138}H126" stroke="#000" stroke-opacity=".2"/>` +
        `<path d="${rr(58, 38, 84, 18, 3)}" fill="#2a2e34"/><path d="${rr(64, 42, 30, 10, 1.5)}" fill="#0a0d10"/>` + digits(open ? "6.30" : "8.15", 66, 44, 6, open ? "#7ee08a" : AMB) + led(o, 132, 47, 1.6, true, open ? GREEN : AMB, open ? "hg" : "ho") +
        `<path d="M150 20L190 30L184 54L144 44Z" fill="#1a2a4a"/><path d="M150 20L190 30L184 54L144 44Z" fill="url(#${u}-mesh)" opacity=".5"/><path d="M164 50V72H142" stroke="#2a2e34" stroke-width="2" fill="none"/>` +
        (open ? hen(100, 182, .9, "speck", true) : "") + ctemp(o, 22, 60) + fount(o, 26, 180, .7)); }),

    
    ic("heatwaterer", "Heated waterer", [WHT, GRY, RED_B], [WHEAT], (o) => { const u = o.uid, oh = part(o, "wheat"), lv = wlev(o), t = tval(o), ice = t != null && t <= 32 && !oh.on;
      const col = lv == null ? null : lv < .05 ? RED : lv < .25 ? AMB : null, wl = lv == null || lv < .05 ? 0 : lv;
      return svgC(o, yard(o, 130, false) + sh(o, 100, 176, 60, 6) + `<path d="M48 174L56 156H144L152 174Z" fill="#c8323a"/><path d="M48 174H152V178H48Z" fill="#8a1e1a"/>` +
        `<ellipse cx="100" cy="158" rx="42" ry="5" fill="${ice ? "#e6f6ff" : "url(#" + u + "-wat)"}"/>` + (oh.on ? `<ellipse cx="100" cy="170" rx="54" ry="8" fill="url(#${u}-heat)" opacity=".7"/>` : "") +
        `<path d="M64 156V64Q64 46 100 46Q136 46 136 64V156Z" fill="url(#${u}-c)"/><path d="M64 156V64Q64 46 100 46Q136 46 136 64V156Z" fill="url(#${u}-g)" opacity=".3"/>` +
        `<path d="${rr(92, 66, 16, 84, 4)}" fill="#1a2a3a" opacity=".55"/><path d="${rr(92, 150 - 84 * wl, 16, Math.max(.1, 84 * wl), 4)}" fill="${col || "#5ab4ec"}"/>` +
        (col ? `<path d="${rr(89, 63, 22, 90, 5)}" fill="none" stroke="${col}" stroke-width="1.6"${lv < .05 ? ` class="${P}blink"` : ""}/>` : "") + [80, 108, 136].map((y) => `<path d="M94 ${y - 14}H100" stroke="#fff" stroke-opacity=".5"/>`).join("") +
        `<path d="M86 46Q100 36 114 46" fill="none" stroke="#3a3f46" stroke-width="4"/>` + tube("M152 172C170 172 176 180 204 182", 3, BLKP) + led(o, 138, 168, 1.4, oh.on, ORNG, "ho") + ctemp(o, 150, 60)); }),

    
    ic("nipple", "Nipple waterer bucket", [WHT, GRY, RED_B], [WHEAT], (o) => { const u = o.uid, oh = part(o, "wheat"), lv = wlev(o), col = lv == null ? null : lv < .05 ? RED : lv < .25 ? AMB : null, wl = lv == null || lv < .05 ? 0 : lv;
      return svgC(o, yard(o, 130, false) + `<path d="M100 4V34" stroke="#555" stroke-width="2"/><path d="M70 50Q100 24 130 50" fill="none" stroke="#5a6068" stroke-width="2"/>` +
        `<path d="M66 48H134L128 130H72Z" fill="#f2f2ee" fill-opacity=".85"/><path d="M66 48H134L128 130H72Z" fill="url(#${u}-fx)"/>` +
        `<path d="M${n1(72 + 6 * (1 - wl))} ${n1(130 - 80 * wl)}H${n1(128 - 6 * (1 - wl))}L128 130H72Z" fill="${col || "#5ab4ec"}" opacity=".55"/>` + (col ? `<path d="M66 48H134L128 130H72Z" fill="none" stroke="${col}" stroke-width="1.6"${lv < .05 ? ` class="${P}blink"` : ""}/>` : "") +
        `<path d="M64 46H136V52H64Z" fill="url(#${u}-c)"/>` + [80, 100, 120].map((x, i) => `<rect x="${x - 2.4}" y="130" width="4.8" height="7" fill="#c8323a"/>` + (lv > .05 ? `<circle class="${P}drip" style="animation-delay:-${i * .5}s" cx="${x}" cy="139" r="1.4" fill="#9fdcff"/>` : "")).join("") +
        (oh.on ? `<path d="${rr(90, 110, 20, 10, 2)}" fill="#ff7a2a" opacity=".7"/>` : "") + hen(70, 180, .9, "buff", true, true) + hen(124, 182, .85, "black", true) + ctemp(o, 150, 60)); }),

    
    ic("feeder", "Gravity feeder", [GRY, RED_B, WHT], [], (o) => { const u = o.uid;
      return svgC(o, yard(o, 130, false) + `<path d="M100 4V30" stroke="#555" stroke-width="2"/><path d="M80 30H120L124 40H76Z" fill="url(#${u}-gal)"/>` +
        `<path d="M78 40H122V128H78Z" fill="url(#${u}-gal)"/><path d="M78 60H122M78 100H122" stroke="#000" stroke-opacity=".18"/>` +
        `<path d="M58 140Q100 152 142 140L134 128H66Z" fill="url(#${u}-gal)"/><ellipse cx="100" cy="132" rx="34" ry="5" fill="#c8a050"/>` + [-20, -8, 4, 16].map((d) => `<circle cx="${100 + d}" cy="131" r="1.2" fill="#8a6a2a"/>`).join("") +
        hen(48, 176, .9, "speck", true) + hen(130, 180, .85, "buff", true, true) + fount(o, 172, 178, .9) + ctemp(o, 150, 60)); }),

    
    ic("heatpanel", "Coop heat panel", [WOOD, WHT, GRY, RED_B], [HEAT, LIGHT], (o) => { const u = o.uid, oh = part(o, "heat"), ol = part(o, "light");
      return svgC(o, BG(`<rect width="200" height="200" fill="url(#${u}-v)"/><rect width="200" height="200" fill="url(#${u}-sidp)"/><path d="M0 170H200V200H0Z" fill="#c9b48a" opacity=".6"/>`) +
        (ol.on ? `<rect width="200" height="200" fill="#ffe2a0" opacity=".12"/>` : "") +
        `<path d="${rr(40, 40, 70, 46, 3)}" fill="#e9ecef"/><path d="${rr(44, 44, 62, 38, 2)}" fill="${oh.on ? "#ff8a4a" : "#c9ced4"}" opacity="${oh.on ? .55 : 1}"/>` + (oh.on ? `<path d="${rr(30, 30, 90, 66, 8)}" fill="url(#${u}-heat)" opacity=".6"/>` : "") +
        `<path d="M150 20V50" stroke="#555" stroke-width="2"/><path d="M138 50Q150 40 162 50L166 62H134Z" fill="#c9ced4"/>` + lampGlow(oh, 150, 64) +
        `<path d="M20 132H180" stroke="url(#${u}-wd)" stroke-width="6"/>` + hen(60, 132, .9, "buff") + hen(96, 132, .9, "black", false, true) + hen(132, 132, .85, "speck") +
        fount(o, 40, 186, .8) + ctemp(o, 150, 150)); }),

    
    ic("sensor", "Coop sensor", [WHT, GRY, WOOD], [], (o) => { const u = o.uid, t = tval(o), col = t <= 32 ? "#6fb8ff" : t >= 90 ? RED : "#7ee08a";
      return svgC(o, BG(`<rect width="200" height="200" fill="url(#${u}-v)"/><rect width="200" height="200" fill="url(#${u}-sidp)"/>`) + sh(o, 100, 152, 40, 4) +
        `<path d="${rr(56, 50, 88, 100, 10)}" fill="#f4f5f6"/><path d="${rr(56, 50, 88, 100, 10)}" fill="url(#${u}-fx)"/><path d="${rr(64, 60, 72, 50, 4)}" fill="#0a0d10"/>` +
        digits(String(t), 72, 68, 22, col, "rgba(255,255,255,.05)") + `<circle cx="${t >= 100 ? 132 : 120}" cy="70" r="2.6" fill="none" stroke="${col}" stroke-width="1.4"/>` +
        `<path d="${rr(64, 116, 72, 22, 3)}" fill="#0a0d10"/>` + fount(o, 80, 136, .5) + digits(String(Math.round(o.level * 99)), 98, 122, 10, CYAN) + `<path d="M126 124l-4 10M120 125h1M127 133h1" stroke="${CYAN}" stroke-width="1.2"/>` +
        led(o, 136, 56, 1.4, true, o.on ? GREEN : "#5a636d", "hg") + `<circle cx="100" cy="46" r="3" fill="#9aa1a9"/>`); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "coops", tab: "Chicken coops", group: "Outdoor", kind: "device", levelLabel: "Water", onWord: "Open", offWord: "Closed",
    intro: "Fourteen chicken coops and coop gear. The slider is the waterer level, shown in each waterer's window (amber below 25%, red and blinking when empty). The Temperature menu sets the coop temp readout: blue when freezing, red when too hot. Auto door up = hens out pecking in the daylight; door down = hens inside and dusk. Heat lamps glow, lights warm the windows, and waterer heaters keep the water from icing over.",
    css: css2, icons,
  });
})();
