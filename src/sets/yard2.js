(function () {
  const P = "hda-yard2-";
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


  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css = `
.hda-yard2-flow{stroke-dashoffset:0}
.hda-anim .hda-yard2-flow{animation:hda-yard2-flow 1s linear infinite}
@keyframes hda-yard2-flow{to{stroke-dashoffset:-18}}
.hda-yard2-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-yard2-flk{animation:hda-yard2-flk .5s ease-in-out infinite alternate}
@keyframes hda-yard2-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-yard2-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-yard2-spin{animation:hda-yard2-spin 1s linear infinite}
@keyframes hda-yard2-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-yard2-blink{animation:hda-yard2-blink 1.2s steps(1,end) infinite}
@keyframes hda-yard2-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-yard2-chase{opacity:.18}
.hda-anim .hda-yard2-chase{animation:hda-yard2-chase 4s linear infinite}
@keyframes hda-yard2-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-yard2-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-yard2-bub{animation:hda-yard2-bub 2s ease-in infinite}
@keyframes hda-yard2-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-yard2-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-yard2-rip{animation:hda-yard2-rip 2.2s ease-out infinite}
@keyframes hda-yard2-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-yard2-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-yard2-mist{animation:hda-yard2-mist 1.6s ease-in-out infinite}
@keyframes hda-yard2-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-yard2-heat{opacity:0}
.hda-anim .hda-yard2-heat{animation:hda-yard2-heat 2.6s ease-out infinite}
@keyframes hda-yard2-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-yard2-heat.hda-yard2-still{opacity:.4}
.hda-anim .hda-yard2-heat.hda-yard2-still{opacity:0}
`;
  const css2 = css + `
.hda-anim .hda-yard2-drive{animation:hda-yard2-drive 7s ease-in-out infinite alternate}
@keyframes hda-yard2-drive{0%{transform:translate(-24px,0)}100%{transform:translate(24px,0)}}
.hda-yard2-steam{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-yard2-steam{animation:hda-yard2-steam 4s ease-out infinite}
@keyframes hda-yard2-steam{0%{transform:translate(0,6px) scale(.5);opacity:0}30%{opacity:.75}100%{transform:translate(4px,-30px) scale(1.8);opacity:0}}
.hda-yard2-steam.hda-yard2-still{opacity:.35}
.hda-anim .hda-yard2-steam.hda-yard2-still{opacity:0}
.hda-anim .hda-yard2-caus{animation:hda-yard2-caus 4s ease-in-out infinite alternate}
@keyframes hda-yard2-caus{to{transform:translate(9px,3px)}}
.hda-anim .hda-yard2-roll{animation:hda-yard2-roll 1.4s linear infinite}
@keyframes hda-yard2-roll{to{transform:translate(0,-12px)}}
`;
  const DECK = ["#d8cdb8", "#a99c84"];

  function pextra(o) {
    const u = o.uid;
    return lg(u + "-cv", 1, [[0, pal(o.color).k], [.22, pal(o.color).m], [.42, pal(o.color).l], [.65, pal(o.color).m], [1, pal(o.color).k]]) +
      lg(u + "-pw", 1, [[0, "#5fd3e8"], [.5, "#1f8fc4"], [1, "#0b4a86"]]) + lg(u + "-pwn", 1, [[0, "#1b4a6e"], [1, "#071c33"]]) +
      lg(u + "-uw", 1, [[0, "#3fb6d8"], [.45, "#14709f"], [1, "#062f52"]]) + lg(u + "-stone", 1, [[0, "#cfc6b5"], [1, "#8f8574"]]) +
      lg(u + "-cop", 1, [[0, "#efe8da"], [1, "#b8ad98"]]) + lg(u + "-plas", 0, [[0, "#16191d"], [.4, "#4a5058"], [1, "#101215"]]) +
      `<pattern id="${u}-tile" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#1d5d8f"/><rect x=".6" y=".6" width="5.8" height="5.8" fill="#2f7fb8"/><path d="M1 1.4H5" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/></pattern>` +
      `<pattern id="${u}-pav" width="22" height="12" patternUnits="userSpaceOnUse"><rect width="22" height="12" fill="${DECK[0]}" fill-opacity=".5"/><path d="M0 .5H22M0 6.5H22M.5 0V6.5M11.5 6.5V12" stroke="#6b604f" stroke-opacity=".5" fill="none"/></pattern>` +
      `<pattern id="${u}-stn" width="30" height="16" patternUnits="userSpaceOnUse"><rect width="30" height="16" fill="#8e8576"/><path d="M1 1H13V7H1ZM15 1H29V7H15ZM1 9H8V15H1ZM10 9H22V15H10ZM24 9H29V15H24Z" fill="#b3a996"/><path d="M1 1H13M15 1H29M1 9H8M10 9H22M24 9H29" stroke="#ece4d4" stroke-opacity=".55"/></pattern>` +
      `<pattern id="${u}-fen" width="14" height="200" patternUnits="userSpaceOnUse"><rect width="13" height="200" fill="#8a6a4a" fill-opacity=".38"/><rect width="2" height="200" fill="#fff" fill-opacity=".06"/><path d="M13.5 0V200" stroke="#000" stroke-opacity=".4"/></pattern>` +
      `<pattern id="${u}-dk" width="200" height="9" patternUnits="userSpaceOnUse"><rect width="200" height="9" fill="#9a7550" fill-opacity=".55"/><path d="M0 8.5H200" stroke="#2b190c" stroke-opacity=".5"/><path d="M0 1H200" stroke="#fff" stroke-opacity=".1"/></pattern>` +
      `<pattern id="${u}-wav" width="40" height="14" patternUnits="userSpaceOnUse"><path d="M0 7C6 3 12 3 18 7S30 11 40 7" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1"/><path d="M8 13C14 10 20 11 26 13" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/></pattern>`;
  }
  const svgP = (o, body, extra) => svg(o, body, pextra(o) + (extra || ""));
  const yard = (o, fy, wall, floor) => `<g class="hda-bg">${yard0(o, fy, wall, floor)}</g>`;
  function yard0(o, fy, wall, floor) {
    const u = o.uid;
    let s = `<rect width="200" height="${fy}" fill="url(#${u}-wall)"/>`;
    if (wall === "fence") s += `<rect width="200" height="${fy}" fill="url(#${u}-fen)"/><path d="M0 ${n1(fy * .3)}H200M0 ${n1(fy * .78)}H200" stroke="#5a4028" stroke-opacity=".55" stroke-width="3"/>`;
    if (wall === "siding") s += `<rect width="200" height="${fy}" fill="url(#${u}-sid)"/>`;
    if (wall === "stone") s += `<rect width="200" height="${fy}" fill="url(#${u}-stn)" opacity=".7"/>`;
    const fl = `M0 ${fy}H200V200H0Z`;
    if (floor === "deck") s += `<path d="${fl}" fill="url(#${u}-dk)"/>`;
    else if (floor === "grass") s += `<path d="${fl}" fill="url(#${u}-grass)"/><path d="${fl}" fill="url(#${u}-bld)"/>`;
    else if (floor === "pav") s += `<path d="${fl}" fill="url(#${u}-pav)"/>`;
    else s += `<path d="${fl}" fill="url(#${u}-flr)"/>`;
    return s + `<path d="M0 ${fy}H200" stroke="#000" stroke-opacity=".35"/>`;
  }
  const steam = (o, pts) => o.on ? pts.map((p, i) => `<ellipse class="${P}steam${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .9)}s" cx="${p[0]}" cy="${p[1]}" rx="${p[2] || 10}" ry="${n1((p[2] || 10) * .6)}" fill="url(#${o.uid}-mist)"/>`).join("") : "";
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const quad = (q) => `M${q.map((p) => n1(p[0]) + " " + n1(p[1])).join("L")}Z`;
  const inset = (q, t) => { const c = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4]; return q.map((p) => lerp(p, c, t)); };

  const css3 = css2 + `
.hda-yard2-drop{opacity:0}
.hda-anim .hda-yard2-drop{animation:hda-yard2-drop 1.4s ease-in infinite}
@keyframes hda-yard2-drop{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,14px);opacity:0}}
.hda-yard2-clip{opacity:0}
.hda-anim .hda-yard2-clip{animation:hda-yard2-clip 1.2s ease-out infinite}
@keyframes hda-yard2-clip{0%{transform:translate(0,0);opacity:.9}100%{transform:translate(-14px,-10px);opacity:0}}
.hda-yard2-tail{transform-box:fill-box;transform-origin:0% 0%}
.hda-anim .hda-yard2-tail{animation:hda-yard2-tail 1.6s ease-in-out infinite alternate}
@keyframes hda-yard2-tail{0%{transform:rotate(-14deg)}100%{transform:rotate(16deg)}}
.hda-yard2-dl,.hda-yard2-dr{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-yard2-dl{animation:hda-yard2-dia 1s ease-in-out infinite}
.hda-anim .hda-yard2-dr{animation:hda-yard2-dia 1s ease-in-out infinite;animation-delay:-.5s}
@keyframes hda-yard2-dia{0%,100%{transform:scale(1,1)}50%{transform:scale(.86,1)}}
.hda-anim .hda-yard2-hum{animation:hda-yard2-hum .14s linear infinite}
@keyframes hda-yard2-hum{50%{transform:translate(.4px,-.3px)}}
`;
  const bg = (s) => `<g class="hda-bg">${s}</g>`;
  function yextra(o) {
    const u = o.uid;
    return lg(u + "-wd", 0, [[0, "#6b4426"], [.3, "#c08454"], [.6, "#a46a3c"], [1, "#5a381e"]]) + lg(u + "-wdv", 1, [[0, "#c99560"], [1, "#7a4c28"]]) +
      lg(u + "-gal", 0, [[0, "#6f777f"], [.3, "#e2e6ea"], [.55, "#a9b1b9"], [.8, "#d6dbe0"], [1, "#5a6168"]]) + lg(u + "-ir", 1, [[0, "#50565e"], [1, "#22262b"]]) +
      lg(u + "-yel", 1, [[0, "#ffd34a"], [1, "#d99a10"]]) + lg(u + "-alu", 0, [[0, "#7a828a"], [.4, "#e6e9ec"], [1, "#6a7178"]]) +
      `<pattern id="${u}-cor" width="6" height="40" patternUnits="userSpaceOnUse"><rect width="3" height="40" fill="#fff" fill-opacity=".22"/><rect x="3" width="3" height="40" fill="#000" fill-opacity=".14"/></pattern>` +
      `<pattern id="${u}-qlt" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 6H12M6 0V12" stroke="#000" stroke-opacity=".25"/><circle cx="6" cy="6" r="1.2" fill="#000" fill-opacity=".3"/></pattern>` +
      `<pattern id="${u}-stv" width="9" height="40" patternUnits="userSpaceOnUse"><path d="M8.5 0V40" stroke="#3a2210" stroke-opacity=".5"/><path d="M1 0V40" stroke="#fff" stroke-opacity=".12"/></pattern>`;
  }
  const svgY = (o, body, extra) => svgP(o, body, yextra(o) + (extra || ""));
  const lawnBg = (o, gy) => { const u = o.uid; return bg(`<rect width="200" height="${gy}" fill="url(#${u}-sky)"/><path d="M0 ${gy - 24}Q24 ${gy - 42} 48 ${gy - 28}Q76 ${gy - 46} 104 ${gy - 30}Q132 ${gy - 44} 160 ${gy - 30}Q182 ${gy - 40} 200 ${gy - 30}V${gy + 2}H0Z" fill="url(#${u}-hedge)"/><path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-grass)"/><path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-bld)"/>`); };
  const uwBg = (o) => { const u = o.uid; let g = ""; for (let i = -6; i <= 6; i++) g += `<path d="M${100 + i * 16} 116L${100 + i * 34} 200" stroke="#9fe3ff" stroke-opacity=".16"/>`;
    return bg(`<rect width="200" height="200" fill="url(#${u}-uw)"/><rect width="200" height="16" fill="#9fe3ff" opacity=".22"/><rect y="16" width="200" height="12" fill="url(#${u}-tile)"/><path d="M0 116H200V200H0Z" fill="#7cc6e0" fill-opacity=".22"/>${g}<g class="${P}caus"><rect x="-20" y="110" width="240" height="96" fill="url(#${u}-wav)"/></g>`); };
  const fan = (o, cx, cy, rx, ry, sp) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#0d0f12"/><g transform="translate(${cx} ${cy}) scale(${n1(rx / ry)} 1)"><g class="${o.on ? P + "spin" : ""}" style="animation-duration:${sp || dur(o, .7, .5)}s">` +
    [0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 0L${n1(-ry * .2)} ${n1(-ry * .85)}Q${n1(ry * .2)} ${n1(-ry * .95)} ${n1(ry * .3)} ${n1(-ry * .7)}Z" fill="#aab2ba" transform="rotate(${a})"/>`).join("") + `<circle r="${n1(ry * .2)}" fill="#5a6168"/></g></g>`;
  const ic = (id, name, colors, label, render, extra) => Object.assign({ id, name, colors, picker: true, colorLabel: label, render }, extra || {});

  function poolPump(o, sp) {
    const u = o.uid, p = pal(o.color), ind = "M-4 140H30", outd = "M64 112V-4";
    let s = bg(yard0(o, 152, "fence", "pad")) + sh(o, 104, 170, 80, 5) + tube(ind, 11, PVC) + flow(o, ind, 2.4, "#7fd8ff") + tube(outd, 11, PVC) + flow(o, "M64 112V-4", 2.4, "#7fd8ff") + band(64, 60, 16, 7, PVC);
    const pot = sp.potCol || "url(#" + u + "-plas)";
    s += `<path d="M26 108H62V160Q62 166 56 166H32Q26 166 26 160Z" fill="${pot}"/>` + (sp.potCol ? `<path d="M26 108H62V166H26Z" fill="url(#${u}-fx)"/>` : "") +
      `<ellipse cx="44" cy="106" rx="20" ry="6.5" fill="#15171a"/><ellipse cx="44" cy="104" rx="17" ry="5" fill="${o.on ? "#6cc6e8" : "#9fb3bf"}" fill-opacity=".55"/><ellipse cx="40" cy="102.5" rx="7" ry="1.5" fill="#fff" opacity=".6"/>` +
      bubbles(o, [[38, 106, 1], [48, 105, 1.1]]) +
      `<circle cx="70" cy="138" r="20" fill="${sp.potCol || "url(#" + u + "-plas)"}"/><circle cx="70" cy="138" r="20" fill="url(#${u}-fx)"/><path d="M60 162H82V168H60Z" fill="#202328"/>`;
    s += `<g class="${o.on ? P + "hum" : ""}">`;
    if (sp.kind === "vs") s += `<path d="${rr(86, 106, 70, 54, 20)}" fill="url(#${u}-cv)"/><path d="${rr(86, 106, 70, 54, 20)}" fill="url(#${u}-g)" opacity=".3"/>` +
      [0, 1, 2, 3, 4].map((i) => `<path d="M${100 + i * 10} 110V156" stroke="#000" stroke-opacity=".16" stroke-width="2"/>`).join("") +
      `<path d="M98 106L104 84H150L154 106Z" fill="url(#${u}-cv)"/><path d="M106 88L148 88L150 100H104Z" fill="#1b1e23"/>` + lcd(o, 112, 89, 30, 9, o.on ? String(Math.round((450 + o.level * 3000) / 10) * 10) : "0", 5.5, CYAN) +
      led(o, 146, 96, 1.1, o.on, GREEN, "hg") + fan(o, 160, 133, 8, 22);
    else if (sp.kind === "ss") s += `<path d="${rr(86, 112, 62, 44, 6)}" fill="url(#${u}-cv)"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M88 ${117 + i * 6.5}H146" stroke="#000" stroke-opacity=".22"/>`).join("") +
      `<path d="M94 116H140" stroke="#fff" stroke-opacity=".3" stroke-width="2"/><ellipse cx="152" cy="134" rx="10" ry="24" fill="url(#${u}-cv)"/>` + fan(o, 154, 134, 6, 18) +
      `<path d="${rr(106, 100, 22, 12, 2)}" fill="#2a2e34"/><rect x="112" y="96" width="6" height="5" rx="1" fill="${o.on ? "#ff5257" : "#552a2c"}"/>`;
    return s + `<path d="M88 160L84 168H150L146 160Z" fill="#202328"/></g>`;
  }

  function squareSpa(o) {
    const u = o.uid, p = pal(o.color), A = [24, 96], B = [110, 68], C = [178, 94], D = [90, 124], dn = 54;
    const q = [A, B, C, D], rim = inset(q, .12), shell = inset(q, .18), wtr = inset(q, .25);
    const left = quad([A, D, [D[0], D[1] + dn], [A[0], A[1] + dn]]), right = quad([D, C, [C[0], C[1] + dn], [D[0], D[1] + dn]]);
    let pan = "";
    for (let i = 1; i < 4; i++) { const a = lerp(A, D, i / 4), b = lerp(D, C, i / 4); pan += `<path d="M${n1(a[0])} ${n1(a[1] + 8)}V${n1(a[1] + dn - 6)}M${n1(b[0])} ${n1(b[1] + 8)}V${n1(b[1] + dn - 6)}" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>`; }
    const wq = quad(wtr);
    return bg(yard0(o, 118, "fence", "deck")) + sh(o, 102, 170, 88, 16) +
      `<path d="${left}" fill="${p.m}"/><path d="${left}" fill="url(#${u}-v)" opacity=".8"/><path d="${right}" fill="url(#${u}-sd)"/>` + pan +
      `<path d="M${A[0]} ${A[1] + dn - 6}L${D[0]} ${D[1] + dn - 6}L${C[0]} ${C[1] + dn - 6}" fill="none" stroke="#1a1c20" stroke-width="5"/>` +
      `<path d="${quad(q)}" fill="#6a7078"/><path d="${quad(rim)}" fill="#e9edf0"/><path d="${quad(shell)}" fill="#c6ced5"/><path d="${wq}" fill="url(#${u}-pw)"/>` +
      (o.on ? `<path d="${wq}" fill="#7ff0ff" opacity=".35"/>` : "") +
      `<clipPath id="${u}-sw"><path d="${wq}"/></clipPath><g clip-path="url(#${u}-sw)"><g class="${o.on ? P + "caus" : ""}"><rect x="40" y="60" width="140" height="80" fill="url(#${u}-wav)"/></g>` +
      (o.on ? [[70, 96], [92, 86], [120, 90], [138, 100], [100, 106], [80, 108]].map((b, i) => `<circle class="${P}rip" style="animation-delay:-${n1(i * .3)}s" cx="${b[0]}" cy="${b[1]}" r="5" fill="none" stroke="#fff" stroke-width="1"/>`).join("") : "") + `</g>` +
      `<path d="M${n1(shell[0][0] + 12)} ${n1(shell[0][1])}L${n1(shell[1][0] - 8)} ${n1(shell[1][1] + 6)}" stroke="#9aa6b0" stroke-width="5" stroke-linecap="round" opacity=".6"/>` +
      steam(o, [[80, 82, 14], [112, 74, 16], [134, 88, 12]]) + `<path d="M${A[0]} ${A[1]}L${B[0]} ${B[1]}" stroke="#fff" stroke-opacity=".35"/>`;
  }

  function dolphin(o) { const u = o.uid, p = pal(o.color);
    const bot = `<path d="M54 152L60 112Q62 100 76 100H128Q142 100 144 112L150 152Z" fill="url(#${u}-bk)"/><path d="M66 112Q70 104 80 104H124Q134 104 136 112L138 124H62Z" fill="url(#${u}-v)"/><path d="M66 112Q70 104 80 104H124" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.5"/>` +
      `<path d="M82 100Q102 74 122 100" fill="none" stroke="#14161a" stroke-width="7" stroke-linecap="round"/><path d="M84 98Q102 78 120 98" fill="none" stroke="${p.l}" stroke-opacity=".5" stroke-width="1.5"/>` +
      `<path d="${rr(76, 128, 52, 8, 2)}" fill="#05070a"/>` + led(o, 128, 116, 1.4, o.on, CYAN, "hb") +
      `<path d="${rr(48, 146, 108, 16, 6)}" fill="#14161a"/><path class="${o.on ? P + "flow" : ""}" style="animation-duration:.6s" d="M54 154H150" stroke="#3a4048" stroke-width="12" stroke-dasharray="2 3"/><path d="${rr(48, 146, 108, 16, 6)}" fill="none" stroke="#000" stroke-width="1.2"/>` +
      `<path d="M102 90C104 60 70 50 86 -4" fill="none" stroke="${p.m}" stroke-width="2.6"/>`;
    return svgY(o, uwBg(o) + `<g class="${o.on ? P + "drive" : ""}" style="animation-duration:${dur(o, 9, 5)}s">` + sh(o, 102, 164, 60, 5) + bot + bubbles(o, [[56, 150], [148, 148], [52, 140]]) + `</g>`); }
  function polaris(o) { const u = o.uid, p = pal(o.color);
    const body = `<path d="M60 150Q58 118 84 112H120Q142 116 144 150Z" fill="#eef1f3"/><path d="M60 150Q58 118 84 112H120Q142 116 144 150Z" fill="url(#${u}-fx)"/>` +
      `<path d="M76 112Q80 86 104 84Q126 86 128 112" fill="#e2e6ea"/><path d="M84 106Q90 92 104 90" stroke="#fff" stroke-width="2" fill="none" stroke-opacity=".8"/>` +
      `<circle cx="70" cy="150" r="11" fill="${p.m}"/><circle cx="70" cy="150" r="5" fill="#eef1f3"/><circle cx="136" cy="150" r="11" fill="${p.m}"/><circle cx="136" cy="150" r="5" fill="#eef1f3"/>` +
      `<path d="M102 84C102 60 120 40 140 30" fill="none" stroke="#eef1f3" stroke-width="5"/><path d="M140 30C150 24 160 22 170 -4" fill="none" stroke="#eef1f3" stroke-width="3"/>` +
      `<path d="M88 112Q78 70 92 40L106 44Q96 74 104 112Z" fill="#f4f6f8" opacity=".9"/><path d="M90 50Q96 60 100 80" stroke="${p.m}" stroke-width="1.2" fill="none"/>`;
    return svgY(o, uwBg(o) + `<g class="${o.on ? P + "drive" : ""}" style="animation-duration:${dur(o, 9, 5)}s">` + sh(o, 102, 162, 50, 5) + body +
      `<g class="${o.on ? P + "tail" : ""}"><path d="M60 140C40 140 30 150 14 146" fill="none" stroke="#eef1f3" stroke-width="3" stroke-linecap="round"/><path d="M14 146l-6 -2" stroke="${p.m}" stroke-width="3" stroke-linecap="round"/></g>` +
      (o.on ? `<ellipse cx="20" cy="150" rx="12" ry="4" fill="#d9f2ff" opacity=".25"/>` : "") + `</g>`); }

  function mower(o, sp) {
    const u = o.uid, p = pal(o.color), cols = sp.trim || "#1b1e23";
    let m = sh(o, 100, 162, 56, 6);
    if (sp.kind === "husq") m += `<path d="M48 156L54 128Q60 112 80 108L130 106Q148 108 154 126L158 156Z" fill="url(#${u}-v)"/><path d="M60 128L80 114H128L146 128L140 140H66Z" fill="#000" opacity=".22"/>` +
      `<path d="M80 114L96 108H118L128 114" fill="none" stroke="#fff" stroke-opacity=".4"/><path d="M58 146H150" stroke="#e8752a" stroke-width="3"/>` + `<path d="${rr(92, 116, 22, 8, 2)}" fill="#14161a"/>` +
      `<circle cx="62" cy="156" r="12" fill="#14161a"/><circle cx="62" cy="156" r="5" fill="#3a3f46"/><circle cx="144" cy="156" r="12" fill="#14161a"/><circle cx="144" cy="156" r="5" fill="#3a3f46"/>`;
    else if (sp.kind === "worx") m += `<path d="M46 154L52 124Q58 110 76 108H132Q150 110 154 124L160 154Z" fill="url(#${u}-v)"/><path d="M70 108L76 96H130L136 108Z" fill="#1d2025"/><path d="M60 140H150V152H60Z" fill="#1d2025"/>` +
      `<path d="M78 98H128" stroke="#fff" stroke-opacity=".25"/><path d="${rr(96, 99, 14, 6, 2)}" fill="#3a3f46"/>` +
      `<circle cx="58" cy="152" r="15" fill="#14161a"/>` + [0, 45, 90, 135].map((a) => `<path d="M58 139V165" stroke="#2a2e34" stroke-width="3" transform="rotate(${a} 58 152)"/>`).join("") + `<circle cx="58" cy="152" r="5" fill="${p.m}"/>` +
      `<circle cx="146" cy="152" r="15" fill="#14161a"/>` + [0, 45, 90, 135].map((a) => `<path d="M146 139V165" stroke="#2a2e34" stroke-width="3" transform="rotate(${a} 146 152)"/>`).join("") + `<circle cx="146" cy="152" r="5" fill="${p.m}"/>`;
    else m += `<path d="M50 154Q48 120 78 112H126Q154 118 154 154Z" fill="#1d2025"/><path d="M56 140Q56 118 80 114H124Q148 118 148 140Z" fill="url(#${u}-v)"/><path d="M68 122Q80 116 100 116" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>` +
      `<path d="M96 114V100H110V114" fill="#2a2e34"/><circle cx="103" cy="100" r="5" fill="#15171a"/><circle cx="103" cy="100" r="2" fill="#3a6ad8"/>` +
      `<circle cx="64" cy="154" r="11" fill="#14161a"/><circle cx="64" cy="154" r="5" fill="#e8752a"/><circle cx="140" cy="154" r="11" fill="#14161a"/><circle cx="140" cy="154" r="5" fill="#e8752a"/>`;
    m += led(o, sp.kind === "worx" ? 118 : 120, sp.kind === "navi" ? 128 : 120, 1.4, true, o.on ? GREEN : AMB, o.on ? "hg" : "ho");
    const clips = o.on ? [0, 1, 2, 3].map((i) => `<path class="${P}clip" style="animation-delay:-${n1(i * .3)}s" d="M${46 + (i % 2) * 4} ${150 + i * 2}l3 -2" stroke="#7fc56e" stroke-width="1.6"/>`).join("") : "";
    const dock = `<path d="M150 170L156 150H196V170Z" fill="#2a2e34" opacity=".9"/><path d="M160 150V128Q160 122 168 122H190V150Z" fill="#1d2025"/>` + led(o, 176, 134, 1.6, !o.on, GREEN, "hg");
    return svgY(o, lawnBg(o, 96) + dock + `<g class="${o.on ? P + "drive" : ""}" style="animation-duration:${dur(o, 10, 5)}s"><g transform="${o.on ? "" : "translate(26 4) scale(.92)"}">${m}${clips}</g></g>`);
  }

  function plants(o, x1, x2, y, kinds) {
    const lv = o.level, g = H().mix("#9a8a3a", "#3f9a3a", Math.min(1, lv * 1.4)), g2 = H().mix("#b0a050", "#6fc45a", Math.min(1, lv * 1.4)), s = .55 + .45 * lv;
    let out = ""; const n = kinds.length;
    kinds.forEach((k, i) => { const cx = x1 + (x2 - x1) * (i + .5) / n;
      if (k === "let") out += [[-7, 0], [7, 0], [0, -5], [-4, -9], [4, -9], [0, 2]].map((q) => `<ellipse cx="${n1(cx + q[0] * s)}" cy="${n1(y + q[1] * s - 4)}" rx="${n1(7 * s)}" ry="${n1(5 * s)}" fill="${q[1] < -4 ? g2 : g}"/>`).join("");
      if (k === "tom") out += `<path d="M${cx} ${y}V${n1(y - 34 * s)}M${cx} ${n1(y - 14 * s)}l${n1(-9 * s)} ${n1(-8 * s)}M${cx} ${n1(y - 24 * s)}l${n1(9 * s)} ${n1(-7 * s)}" stroke="${g}" stroke-width="2"/>` +
        [[-6, -16], [7, -22], [-3, -30], [5, -10]].map((q) => `<circle cx="${n1(cx + q[0] * s)}" cy="${n1(y + q[1] * s)}" r="${n1(5 * s)}" fill="${g2}"/>`).join("") + (lv > .35 ? [[-7, -10], [6, -16], [-2, -24]].map((q) => `<circle cx="${n1(cx + q[0] * s)}" cy="${n1(y + q[1] * s)}" r="2.6" fill="#d9362b"/>`).join("") : "");
      if (k === "flw") out += [-8, 0, 8].map((d, j) => `<path d="M${cx + d} ${y}V${n1(y - (16 + j * 3) * s)}" stroke="${g}" stroke-width="1.6"/><circle cx="${cx + d}" cy="${n1(y - (16 + j * 3) * s)}" r="${n1(4 * s)}" fill="${lv > .25 ? ["#f2c84a", "#e8566a", "#b06cff"][j] : "#8a7a5a"}"/>`).join("") + `<ellipse cx="${cx}" cy="${y - 3}" rx="${n1(10 * s)}" ry="4" fill="${g}"/>`;
      if (k === "herb") out += [-6, -2, 2, 6].map((d) => `<path d="M${cx + d} ${y}Q${cx + d * 1.6} ${n1(y - 12 * s)} ${n1(cx + d * 2)} ${n1(y - 20 * s)}" stroke="${g2}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join("");
    });
    return out;
  }
  const drips = (o, xs, y) => o.on ? xs.map((x, i) => `<circle class="${P}drop" style="animation-delay:-${n1(i * .35)}s" cx="${x}" cy="${y}" r="1.6" fill="#bfeaff"/>`).join("") : "";

  const icons = [
    ic("variable-speed-pool-pump", "Variable-speed pool pump", ["#d9cfb4", "#2b2e33", "#8a949e"], "Body", (o) => svgY(o, poolPump(o, { kind: "vs", potCol: "url(#" + o.uid + "-c)" }))),
    ic("classic-pool-pump", "Classic pool pump", ["#2b2e33", "#c9a24a", "#8a949e"], "Motor", (o) => svgY(o, poolPump(o, { kind: "ss" }))),
    ic("above-ground-filter-pump", "Above-ground filter pump", ["#9aa1a9", "#2b2e33", "#5a7fa8"], "Body", (o) => { const u = o.uid, h1 = "M120 136C150 136 160 130 204 128", h2 = "M120 160C150 160 160 156 204 154";
      return svgY(o, bg(yard0(o, 120, "fence", "grass") + `<path d="M176 60H200V176H176Z" fill="url(#${u}-c)" opacity=".6"/><path d="M176 60H200" stroke="#c9ced4" stroke-width="4"/>`) + sh(o, 96, 176, 60, 5) +
        tube(h1, 7, ["#0f2a44", "#2a6aa8", "#9cc8ef"]) + tube(h2, 7, ["#0f2a44", "#2a6aa8", "#9cc8ef"]) + flow(o, h1, 2) + flow(o, "M204 154C160 156 150 160 120 160", 2) +
        `<path d="M40 176L44 164H150L154 176Z" fill="url(#${u}-sd)"/>` + `<path d="M48 164V70Q48 56 70 56Q92 56 92 70V164Z" fill="url(#${u}-c)"/><path d="M48 164V70Q48 56 70 56Q92 56 92 70V164Z" fill="url(#${u}-g)" opacity=".3"/>` +
        `<ellipse cx="70" cy="60" rx="18" ry="5" fill="url(#${u}-tp)"/><path d="M62 52H78V58H62Z" fill="#3a3f46"/>` + [80, 100, 120, 140].map((y) => `<path d="M48 ${y}H92" stroke="#000" stroke-opacity=".14"/>`).join("") +
        `<g class="${o.on ? P + "hum" : ""}"><path d="${rr(92, 116, 34, 48, 6)}" fill="url(#${u}-c)"/>` + fan(o, 109, 132, 9, 9) + `<path d="${rr(98, 146, 22, 12, 2)}" fill="#2a2e34"/>` + led(o, 109, 152, 1.4, o.on, GREEN, "hg") + `</g>`); }),

    ic("square-acrylic-spa", "Square acrylic spa", ["#6f7378", "#4a3a2e", "#a49a88", "#2b2e33"], "Cabinet", (o) => svgY(o, squareSpa(o))),
    ic("inflatable-spa", "Inflatable spa", ["#2c3e5a", "#6d7074", "#c8b08a"], "Body", (o) => { const u = o.uid, cx = 92, top = 92, bot = 150, rx = 72, ry = 20;
      const wall = `M${cx - rx} ${top}V${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}V${top}A${rx} ${ry} 0 0 1 ${cx - rx} ${top}Z`;
      return svgY(o, bg(yard0(o, 116, "fence", "deck")) + `<ellipse cx="${cx}" cy="${bot + 6}" rx="${rx + 8}" ry="${ry + 4}" fill="#000" opacity=".35"/>` +
        `<path d="${wall}" fill="url(#${u}-c)"/><path d="${wall}" fill="url(#${u}-qlt)"/><ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="url(#${u}-c)"/>` +
        `<ellipse cx="${cx}" cy="${top + 1}" rx="${rx - 12}" ry="${ry - 6}" fill="url(#${u}-pw)"/>` + (o.on ? `<ellipse cx="${cx}" cy="${top + 1}" rx="${rx - 12}" ry="${ry - 6}" fill="#fff" opacity=".25"/>` : "") +
        `<clipPath id="${u}-ps"><ellipse cx="${cx}" cy="${top + 1}" rx="${rx - 12}" ry="${ry - 6}"/></clipPath><g clip-path="url(#${u}-ps)">` +
        (o.on ? [[60, 92], [80, 96], [100, 90], [118, 96], [92, 100], [130, 90], [70, 86]].map((b, i) => `<circle class="${P}rip" style="animation-delay:-${n1(i * .2)}s;animation-duration:${dur(o, 1.4, .8)}s" cx="${b[0]}" cy="${b[1]}" r="4" fill="none" stroke="#fff" stroke-width="1"/>`).join("") : "") + `</g>` +
        `<path d="M${cx - rx + 6} ${top + 4}A${rx - 6} ${ry - 4} 0 0 0 ${cx + rx - 6} ${top + 4}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/>` +
        `<path d="${rr(160, 118, 30, 36, 5)}" fill="#e9edf0"/><path d="${rr(160, 118, 30, 36, 5)}" fill="url(#${u}-fx)"/><path d="${rr(164, 122, 22, 10, 2)}" fill="#0b0d10"/>` + lcd(o, 165, 123, 20, 8, o.on ? String(Math.round(90 + 14 * o.level)) : "--", 5, ORNG) +
        tube(`M160 140H${cx + rx - 2}`, 5, ["#555", "#cfd4d9", "#fff"]) + steam(o, [[70, 80, 12], [100, 74, 14], [124, 82, 10]])); }),
    ic("cedartub", "Cedar hot tub", ["#b07a4a", "#6a4428", "#d8b48a"], "Wood", (o) => { const u = o.uid, cx = 92, top = 96, bot = 156, rx = 62, ry = 17;
      const wall = `M${cx - rx} ${top}V${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}V${top}A${rx} ${ry} 0 0 1 ${cx - rx} ${top}Z`;
      return svgY(o, lawnBg(o, 120) + `<ellipse cx="${cx}" cy="${bot + 6}" rx="${rx + 8}" ry="${ry + 4}" fill="#000" opacity=".35"/>` +
        `<ellipse cx="${cx}" cy="${top + 2}" rx="${rx - 4}" ry="${ry - 3}" fill="url(#${u}-pw)"/>` +
        `<clipPath id="${u}-ct2"><ellipse cx="${cx}" cy="${top + 2}" rx="${rx - 4}" ry="${ry - 3}"/></clipPath><g clip-path="url(#${u}-ct2)"><g class="${o.on ? P + "caus" : ""}"><rect x="20" y="80" width="150" height="30" fill="url(#${u}-wav)"/></g></g>` +
        `<path d="${wall}" fill="url(#${u}-c)"/><path d="${wall}" fill="url(#${u}-stv)"/>` + [top + 12, bot - 10].map((y) => `<path d="M${cx - rx} ${y}A${rx} ${ry} 0 0 0 ${cx + rx} ${y}" fill="none" stroke="#2a2e34" stroke-width="3"/>`).join("") +
        `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="${pal(o.color).d}" stroke-width="5"/>` +
        `<path d="M146 92V30" stroke="#2a2e34" stroke-width="8"/><path d="M144 92V30" stroke="#5a6168" stroke-width="2"/><path d="M140 30H152V26H140Z" fill="#1a1c20"/><path d="${rr(132, 96, 26, 40, 3)}" fill="#22252a"/>` +
        (o.on ? `<path d="${rr(136, 120, 18, 10, 2)}" fill="#ff7a2a" opacity=".85" class="${P}glow"/>` + steam(o, [[146, 24, 8], [150, 16, 10]]) + steam(o, [[70, 86, 12], [100, 82, 14]]) : "") +
        `<path d="M30 160L36 140H46L50 160" fill="none" stroke="${pal(o.color).d}" stroke-width="3"/>`); }),

    ic("brushed-pool-robot", "Brushed pool robot", ["#2f6fd6", "#3fb5c9", "#8a949e"], "Accent", dolphin),
    ic("pressure-side-pool-cleaner", "Pressure-side pool cleaner", ["#2f5fb5", "#3fb5c9", "#2b2e33"], "Accent", polaris),

    ic("robot-mower-gray", "Robot mower, gray", ["#5a5f66", "#3a3d42", "#8a949e"], "Body", (o) => mower(o, { kind: "husq" })),
    ic("robot-mower-orange", "Robot mower, orange", ["#f47c20", "#c8a020", "#5a5f66"], "Body", (o) => mower(o, { kind: "worx" })),
    ic("wire-free-robot-mower", "Wire-free robot mower", ["#e9ecef", "#8a949e", "#2b2e33"], "Body", (o) => mower(o, { kind: "navi" })),

    ic("cedarbed", "Cedar box bed", ["#b07a4a", "#6a4428", "#9aa1a9"], "Wood", (o) => { const u = o.uid;
      return svgY(o, lawnBg(o, 90) + sh(o, 100, 168, 84, 6) + `<path d="M22 120L36 104H176L164 120Z" fill="#4a3424"/>` + plants(o, 30, 170, 116, ["let", "tom", "let", "herb", "tom"]) +
        `<path d="M22 120H164V164H22Z" fill="url(#${u}-c)"/><path d="M22 120H164V164H22Z" fill="url(#${u}-stv)" opacity=".2"/>` + [134, 149].map((y) => `<path d="M22 ${y}H164" stroke="#3a2210" stroke-opacity=".5"/>`).join("") +
        [22, 158].map((x) => `<rect x="${x - 3}" y="116" width="9" height="50" fill="url(#${u}-c)"/><rect x="${x - 3}" y="116" width="9" height="50" fill="url(#${u}-fx)"/>`).join("") + `<path d="M164 120L176 104V148L164 164Z" fill="url(#${u}-sd)"/><path d="M22 120H164L176 104" fill="none" stroke="#fff" stroke-opacity=".25"/>` + drips(o, [50, 90, 130], 112)); }),
    ic("galvbed", "Galvanized oval bed", ["#b9c0c7", "#5a7a6a", "#2b2e33"], "Metal", (o) => { const u = o.uid, cx = 100, top = 112, bot = 158, rx = 78, ry = 16;
      const wall = `M${cx - rx} ${top}V${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}V${top}A${rx} ${ry} 0 0 1 ${cx - rx} ${top}Z`;
      return svgY(o, lawnBg(o, 92) + `<ellipse cx="${cx}" cy="${bot + 4}" rx="${rx + 6}" ry="${ry + 3}" fill="#000" opacity=".3"/>` + `<ellipse cx="${cx}" cy="${top}" rx="${rx - 2}" ry="${ry - 2}" fill="#4a3424"/>` +
        plants(o, 36, 164, top + 4, ["flw", "herb", "flw", "let", "flw"]) + `<path d="${wall}" fill="url(#${u}-c)"/><path d="${wall}" fill="url(#${u}-cor)"/>` +
        `<path d="M${cx - rx} ${top}A${rx} ${ry} 0 0 0 ${cx + rx} ${top}" fill="none" stroke="#e6e9ec" stroke-width="3"/>` + drips(o, [60, 100, 140], top - 4)); }),
    ic("elevated", "Elevated planter", ["#c9a070", "#eceef0", "#5a5f66", "#8a5a34"], "Wood", (o) => { const u = o.uid, d = pal(o.color).d;
      return svgY(o, bg(yard0(o, 150, "siding", "deck")) + sh(o, 100, 180, 74, 4) +
        `<path d="M38 150H158M42 168H154" stroke="${d}" stroke-width="4"/><path d="M40 160H156V166H40Z" fill="url(#${u}-c)" opacity=".85"/>` +
        `<path d="M40 82H160L168 74H48Z" fill="#4a3424"/>` + plants(o, 46, 160, 80, ["herb", "let", "herb", "flw"]) +
        `<path d="M40 82H160V118H40Z" fill="url(#${u}-c)"/><path d="M40 82H160V118H40Z" fill="url(#${u}-stv)" opacity=".2"/>` + [94, 106].map((y) => `<path d="M40 ${y}H160" stroke="#000" stroke-opacity=".22"/>`).join("") +
        `<path d="M160 82L168 74V110L160 118Z" fill="url(#${u}-sd)"/>` +
        [36, 156].map((x) => `<rect x="${x}" y="78" width="8" height="102" fill="url(#${u}-c)"/><rect x="${x}" y="78" width="8" height="102" fill="url(#${u}-fx)"/>`).join("") +
        `<rect x="164" y="72" width="7" height="100" fill="url(#${u}-sd)"/>` + drips(o, [70, 110, 145], 76)); }),

    ic("jetpump", "Shallow-well jet", ["#c8322b", "#2f6db5", "#3c7a52", "#8a949e"], "Paint", (o) => { const u = o.uid, pin = "M-4 150H40", pout = "M40 118V100H204";
      return svgY(o, room(o, 170, "block") + sh(o, 104, 172, 72, 5) + tube(pin, 9, GALV) + flow(o, pin, 2.4) + tube(pout, 9, GALV) + flow(o, "M40 118V100H204", 2.4) +
        `<path d="M36 166H176V172H36Z" fill="#3a3f46"/><path d="${rr(36, 122, 50, 44, 12)}" fill="url(#${u}-c)"/><circle cx="60" cy="146" r="16" fill="url(#${u}-c)"/><circle cx="60" cy="146" r="16" fill="none" stroke="#000" stroke-opacity=".4"/>` +
        `<rect x="54" y="110" width="12" height="12" fill="url(#${u}-c)"/>` + gauge(o, 60, 104, 7, o.on ? .3 + .5 * o.level : .55) +
        `<g class="${o.on ? P + "hum" : ""}"><path d="${rr(86, 122, 70, 42, 10)}" fill="url(#${u}-cv)"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M${96 + i * 11} 124V162" stroke="#000" stroke-opacity=".16" stroke-width="2"/>`).join("") +
        fan(o, 160, 143, 7, 19) + `<path d="${rr(100, 108, 26, 14, 2)}" fill="#9aa1a9"/><path d="${rr(100, 108, 26, 14, 2)}" fill="url(#${u}-fx)"/></g>` + led(o, 120, 115, 1.3, o.on, GREEN, "hg")); }),
    ic("booster", "Booster + tank", ["#3a6ad8", "#2b2e33", "#d0312d", "#e0b21a"], "Body", (o) => { const u = o.uid, pin = "M-4 150H44", po = "M116 104V92H204";
      return svgY(o, room(o, 172, "board") + sh(o, 100, 176, 72, 5) + tube(pin, 8, CU) + flow(o, pin, 2) + tube(po, 8, CU) + flow(o, po, 2) +
        `<path d="M34 170H170V176H34Z" fill="#2a2e34"/>` +
        `<path d="${rr(40, 128, 40, 40, 6)}" fill="url(#${u}-mt)"/>` + [0, 1, 2, 3].map((i) => `<path d="M${44 + i * 10} 130V166" stroke="#000" stroke-opacity=".15"/>`).join("") + `<circle cx="60" cy="150" r="7" fill="url(#${u}-mtv)"/>` +
        `<path d="M104 104H128V122H104Z" fill="url(#${u}-mt)"/><path d="M98 64Q98 54 116 54Q134 54 134 64V104H98Z" fill="#9aa3ad"/><path d="M98 64Q98 54 116 54Q134 54 134 64V104H98Z" fill="url(#${u}-fx)"/><ellipse cx="116" cy="58" rx="14" ry="4" fill="#c3c9cf"/>` +
        `<g class="${o.on ? P + "hum" : ""}"><path d="${rr(80, 122, 74, 46, 10)}" fill="url(#${u}-cv)"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M${92 + i * 11} 124V166" stroke="#000" stroke-opacity=".16" stroke-width="2"/>`).join("") +
        fan(o, 158, 145, 6, 18) + `</g>` + `<path d="${rr(84, 110, 18, 14, 2)}" fill="url(#${u}-bk)"/>` + lcd(o, 86, 112, 14, 8, o.on ? (2 + o.level * 2.5).toFixed(1) : "0.0", 4.4, CYAN) + led(o, 98, 120, 1, o.on, GREEN, "hg") +
        gauge(o, 140, 80, 7, o.on ? .3 + .5 * o.level : .5)); }),

    ic("endsuction", "End-suction skid", ["#2f5f9e", "#3c7a52", "#c8323a", "#8a949e"], "Paint", (o) => { const u = o.uid, pin = "M-4 140H34", pout = "M52 104V-4";
      return svgY(o, room(o, 170, "") + sh(o, 104, 174, 92, 5) + tube(pin, 14, IRON) + flow(o, pin, 3) + tube(pout, 12, IRON) + flow(o, pout, 3) + band(52, 40, 18, 7, IRON) + band(26, 140, 7, 20, IRON) +
        `<path d="M14 168H190V176H14Z" fill="url(#${u}-ir)"/><path d="M14 168H190" stroke="#fff" stroke-opacity=".2"/>` +
        `<circle cx="54" cy="138" r="24" fill="url(#${u}-c)"/><circle cx="54" cy="138" r="24" fill="url(#${u}-g)" opacity=".3"/><path d="M40 160V168H70V160Z" fill="url(#${u}-sd)"/>` +
        `<path d="${rr(76, 128, 18, 20, 3)}" fill="url(#${u}-c)"/><path d="M94 124H118V152H94Z" fill="url(#${u}-yel)"/><path d="M98 128V148M104 128V148M110 128V148" stroke="#000" stroke-opacity=".25"/>` +
        `<g class="${o.on ? P + "hum" : ""}"><path d="${rr(118, 116, 64, 48, 8)}" fill="url(#${u}-cv)"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${124 + i * 9} 118V162" stroke="#000" stroke-opacity=".18" stroke-width="2"/>`).join("") +
        `<path d="${rr(136, 104, 22, 12, 2)}" fill="url(#${u}-c)"/><path d="M126 164V168M174 164V168" stroke="#22262b" stroke-width="5"/></g>` + led(o, 147, 110, 1.3, o.on, GREEN, "hg") + gauge(o, 52, 82, 7, o.on ? .3 + .5 * o.level : .1)); }),
    ic("inline", "Vertical inline pump", ["#2f5f9e", "#3c7a52", "#c8323a", "#8a949e"], "Paint", (o) => { const u = o.uid, pd = "M-4 150H204";
      return svgY(o, room(o, 176, "block") + sh(o, 100, 178, 60, 4) + tube(pd, 18, IRON) + flow(o, pd, 3.4) + band(64, 150, 8, 26, IRON) + band(136, 150, 8, 26, IRON) +
        `<path d="M76 134H124V166H76Z" fill="url(#${u}-c)"/><path d="M70 140H130V160H70Z" fill="url(#${u}-c)"/><path d="M70 140H130V160H70Z" fill="url(#${u}-fx)"/>` +
        `<path d="M86 124H114V134H86Z" fill="url(#${u}-yel)"/>` +
        `<g class="${o.on ? P + "hum" : ""}"><path d="${rr(80, 42, 40, 82, 10)}" fill="url(#${u}-c)"/>` + [0, 1, 2, 3].map((i) => `<path d="M84 ${56 + i * 16}H116" stroke="#000" stroke-opacity=".2" stroke-width="2"/>`).join("") +
        `<path d="M82 36H118V48H82Z" fill="url(#${u}-c)"/>` + [86, 92, 98, 104, 110].map((x) => `<path d="M${x + 2} 38V46" stroke="#000" stroke-opacity=".45" stroke-width="2"/>`).join("") + `<ellipse cx="100" cy="36" rx="18" ry="4" fill="url(#${u}-tp)"/>` + `<path d="${rr(118, 70, 16, 14, 2)}" fill="url(#${u}-c)"/></g>` + led(o, 126, 77, 1.3, o.on, GREEN, "hg") + gauge(o, 40, 128, 7, o.on ? .3 + .5 * o.level : .1)); }),
    ic("diaphragm", "AODD pump", ["#c9ced4", "#2b2e33", "#e9ecef", "#3a6ad8"], "Body", (o) => { const u = o.uid, pin = "M-4 162H100", pout = "M100 52V40H204", air = "M100 106C130 106 150 100 204 96";
      const ch = (x, cls) => `<g class="${o.on ? P + cls : ""}"><circle cx="${x}" cy="108" r="26" fill="url(#${u}-c)"/><circle cx="${x}" cy="108" r="26" fill="url(#${u}-g)" opacity=".3"/><circle cx="${x}" cy="108" r="17" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` +
        [0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${n1(x + Math.cos(a * Math.PI / 180) * 22)}" cy="${n1(108 + Math.sin(a * Math.PI / 180) * 22)}" r="1.6" fill="#555"/>`).join("") + `</g>`;
      return svgY(o, room(o, 176, "") + sh(o, 100, 178, 66, 4) + tube(pin, 10, BLKP) + flow(o, pin, 2.4, "#9fd4ef") + tube(pout, 10, BLKP) + flow(o, pout, 2.4, "#9fd4ef") + tube(air, 3, ["#1a3a6a", "#3a6ad8", "#9cc8ef"]) +
        `<path d="M58 150H142V168H58Z" fill="url(#${u}-c)"/><path d="M58 52H142V68H58Z" fill="url(#${u}-c)"/><path d="M60 68V150M140 68V150" stroke="${pal(o.color).d}" stroke-width="8"/>` +
        ch(66, "dl") + ch(134, "dr") + `<path d="${rr(88, 90, 24, 34, 3)}" fill="url(#${u}-mtv)"/><rect x="94" y="96" width="12" height="8" rx="1" fill="#2a2e34"/>` +
        `<path d="M52 174H148V178H52Z" fill="#2a2e34"/>` + (o.on ? `<path class="${P}flow" style="animation-duration:.5s" d="M100 106H130" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 4" fill="none"/>` : "")); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "yard2", tab: "Pool, spa & yard", group: "Outdoor", kind: "device",
    intro: "Real pool pumps, spas, pool robots, robot mowers, raised garden beds and pumps. Running = pump fans spin and water moves, spas bubble and steam, robots drive the pool floor or the lawn (off: the mower sits in its dock), garden beds get drip water, and the diaphragm pump's chambers pulse. On the beds the slider is soil moisture (lush to dry); on pumps it is speed.",
    
    css: css3, icons,
  });
})();
