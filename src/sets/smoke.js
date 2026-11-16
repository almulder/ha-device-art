(function () {
  const P = "hda-smoke-";
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
.hda-smoke-flow{stroke-dashoffset:0}
.hda-anim .hda-smoke-flow{animation:hda-smoke-flow 1s linear infinite}
@keyframes hda-smoke-flow{to{stroke-dashoffset:-18}}
.hda-smoke-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-smoke-flk{animation:hda-smoke-flk .5s ease-in-out infinite alternate}
@keyframes hda-smoke-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-smoke-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smoke-spin{animation:hda-smoke-spin 1s linear infinite}
@keyframes hda-smoke-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-smoke-blink{animation:hda-smoke-blink 1.2s steps(1,end) infinite}
@keyframes hda-smoke-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-smoke-chase{opacity:.18}
.hda-anim .hda-smoke-chase{animation:hda-smoke-chase 4s linear infinite}
@keyframes hda-smoke-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-smoke-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smoke-bub{animation:hda-smoke-bub 2s ease-in infinite}
@keyframes hda-smoke-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-smoke-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-smoke-rip{animation:hda-smoke-rip 2.2s ease-out infinite}
@keyframes hda-smoke-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-smoke-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smoke-mist{animation:hda-smoke-mist 1.6s ease-in-out infinite}
@keyframes hda-smoke-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-smoke-heat{opacity:0}
.hda-anim .hda-smoke-heat{animation:hda-smoke-heat 2.6s ease-out infinite}
.hda-anim .hda-smoke-hum{animation:hda-smoke-hum .16s linear infinite}
@keyframes hda-smoke-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-smoke-bob{animation:hda-smoke-bob 1.6s ease-in-out infinite}
@keyframes hda-smoke-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-smoke-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-smoke-heat.hda-smoke-still{opacity:.4}
.hda-anim .hda-smoke-heat.hda-smoke-still{opacity:0}
`;
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css2 = css + `
.hda-smoke-puff{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smoke-puff{animation:hda-smoke-puff 4s ease-out infinite}
@keyframes hda-smoke-puff{0%{transform:translate(0,20px) scale(.5);opacity:0}30%{opacity:.75}100%{transform:translate(6px,-30px) scale(1.6);opacity:0}}
.hda-smoke-puff.hda-smoke-still{opacity:.45}
.hda-anim .hda-smoke-puff.hda-smoke-still{opacity:0}
.hda-smoke-wave{opacity:.7}
.hda-anim .hda-smoke-wave{animation:hda-smoke-wave 1s ease-out infinite}
@keyframes hda-smoke-wave{0%{opacity:0}30%{opacity:1}100%{opacity:0}}
.hda-anim .hda-smoke-strobe{animation:hda-smoke-strobe .6s steps(1,end) infinite}
@keyframes hda-smoke-strobe{0%,49%{opacity:1}50%,100%{opacity:.05}}
.hda-anim .hda-smoke-slow{animation:hda-smoke-strobe 2s steps(1,end) infinite}
`;
  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const WH = "#f0f0ec", AL = "#e8dfc8", GY = "#c9ced4";
  const TYPE = (list) => ({ id: "atype", name: "Alarm type", values: list.map((k) => [k, { smoke: "Smoke", co: "CO", heat: "Heat" }[k]]) });
  const MODE = { id: "mode", name: "Mode", values: [["normal", "Normal"], ["test", "Test"], ["hush", "Hush"]] };

  function sextra(o) {
    const u = o.uid;
    return lg(u + "-ceil", 1, [[0, "#fff", .1], [1, "#fff", .04]]) + rg(u + "-strb", [[0, "#ff4a4a", .7], [.5, "#ff2a2a", .25], [1, "#ff2a2a", 0]]) +
      rg(u + "-co", [[0, "#d9e05a", .45], [1, "#d9e05a", 0]]) + rg(u + "-smk", [[0, "#cfd4d9", .8], [.6, "#aab0b6", .35], [1, "#9aa0a6", 0]]) +
      rg(u + "-disc", [[0, "#fff", .5], [.7, "#fff", 0], [1, "#000", .25]], 'cx=".38" cy=".32" r=".8"') + rg(u + "-glow", [[0, "#ffe2a0", .7], [1, "#ffe2a0", 0]]) +
      `<pattern id="${u}-pop" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#fff" fill-opacity=".1"/><circle cx="6" cy="5" r=".6" fill="#000" fill-opacity=".12"/></pattern>` +
      `<pattern id="${u}-grill" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#000" fill-opacity=".35"/></pattern>`;
  }
  const svgS = (o, body) => svg(o, body, sextra(o));
  const ceiling = (o) => BG(`<rect width="200" height="200" fill="url(#${o.uid}-ceil)"/><rect width="200" height="200" fill="url(#${o.uid}-pop)"/>`);
  const wall = (o, fy) => BG(`<rect width="200" height="${fy}" fill="url(#${o.uid}-wall)"/><rect y="${fy - 10}" width="200" height="10" fill="#f2f0ea" opacity=".7"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${o.uid}-flr)"/>`);
  const mode = (o) => (o.opt && o.opt.mode) || "normal";
  const atype = (o, d) => (o.opt && o.opt.atype) || d;

  function effects(o, cx, cy, r, kind) {
    const m = mode(o), alarm = o.on && m !== "hush";
    let s = "";
    if (alarm) {
      s += `<circle class="${P}strobe" cx="${cx}" cy="${cy}" r="${r * 2}" fill="url(#${o.uid}-strb)"/>` +
        [0, 1, 2].map((i) => [-1, 1].map((k) => `<path class="${P}wave" style="animation-delay:${n1(i * .2)}s" d="M${n1(cx + k * (r + 8 + i * 8))} ${n1(cy - 10 - i * 4)}q${n1(k * 6)} ${n1(10 + i * 4)} 0 ${n1(20 + i * 8)}" fill="none" stroke="#ff6a6a" stroke-width="1.8" stroke-linecap="round"/>`).join("")).join("");
      if (kind === "co") s += `<ellipse cx="${cx}" cy="${cy + r + 40}" rx="80" ry="34" fill="url(#${o.uid}-co)"/>` + [0, 1, 2].map((i) => `<circle class="${P}puff${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * 1.3)}s" cx="${cx - 30 + i * 30}" cy="${cy + r + 44}" r="16" fill="url(#${o.uid}-co)"/>`).join("") +
        `<text x="0" y="0" font-size="0"></text>`;
      else if (kind === "heat") s += heat(o, [cx - 30, cx - 10, cx + 10, cx + 30], cy + r + 50, "#ff9a4a") + `<ellipse cx="${cx}" cy="${cy + r + 52}" rx="60" ry="16" fill="#ff7a2a" opacity=".12"/>`;
      else s += [0, 1, 2, 3].map((i) => `<circle class="${P}puff${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * 1)}s" cx="${cx - 36 + i * 24}" cy="${cy + r + 40}" r="${14 + (i % 2) * 4}" fill="url(#${o.uid}-smk)"/>`).join("");
    }
    return s.replace(`<text x="0" y="0" font-size="0"></text>`, "");
  }
  function lights(o, x, y, gap) {
    const m = mode(o), alarm = o.on && m !== "hush", test = m === "test";
    const g = test ? `<g class="${P}strobe">${led(o, x, y, 1.6, true, GREEN, "hg")}</g>` : led(o, x, y, 1.6, !alarm, GREEN, "hg");
    const r = alarm || test ? `<g class="${P}strobe">${led(o, x + gap, y, 1.6, true, RED, "hr")}</g>` : led(o, x + gap, y, 1.6, false);
    const a = m === "hush" || test ? `<g class="${test ? P + "strobe" : P + "slow"}">${led(o, x + 2 * gap, y, 1.6, true, AMB, "ho")}</g>` : led(o, x + 2 * gap, y, 1.6, false);
    return g + r + a;
  }
  function battery(o, x, y) {
    const lv = o.level, col = lv < .2 ? RED : lv < .4 ? AMB : "#7ee08a";
    return `<path d="${rr(x, y, 18, 9, 2)}" fill="#0a0d10" stroke="#e9ecef" stroke-width="1"/><rect x="${x + 18}" y="${y + 3}" width="2" height="3" fill="#e9ecef"/><rect x="${x + 2}" y="${y + 2}" width="${n1(Math.max(.6, 14 * lv))}" height="5" rx="1" fill="${col}"/>`;
  }
  function disc(o, cx, cy, r, sp) {
    const u = o.uid; sp = sp || {};
    let s = sh(o, cx + 3, cy + r * .9, r * .95, r * .2) + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}-v)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}-disc)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".18"/>`;
    if (sp.slots) for (let i = 0; i < sp.slots; i++) { const a = i * 360 / sp.slots; s += `<path d="M${cx} ${n1(cy - r * .92)}V${n1(cy - r * .72)}" stroke="#000" stroke-opacity=".28" stroke-width="2.4" stroke-linecap="round" transform="rotate(${a} ${cx} ${cy})"/>`; }
    if (sp.ring) s += `<circle cx="${cx}" cy="${cy}" r="${n1(r * sp.ring)}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/>`;
    if (sp.grill) s += `<circle cx="${cx}" cy="${cy}" r="${n1(r * sp.grill)}" fill="url(#${u}-grill)"/>`;
    if (sp.btn) s += `<circle cx="${cx}" cy="${cy}" r="${n1(r * sp.btn)}" fill="url(#${u}-v)"/><circle cx="${cx}" cy="${cy}" r="${n1(r * sp.btn)}" fill="url(#${u}-disc)"/><circle cx="${cx}" cy="${cy}" r="${n1(r * sp.btn)}" fill="none" stroke="#000" stroke-opacity=".25"/>`;
    return s;
  }
  const ic = (id, name, kinds, render) => Object.assign({ id, name, colors: [WH, AL, GY], picker: true, colorLabel: "Body", render }, { options: (kinds.length > 1 ? [TYPE(kinds)] : []).concat([MODE]) });

  const SENS = [["combo", "Smoke + CO"], ["smoke", "Smoke"], ["co", "CO"], ["heat", "Heat"]];
  const lead = (v, list) => list.filter((x) => x[0] === v).concat(list.filter((x) => x[0] !== v));
  const EVT = { id: "atype", name: "Alarm type", values: [["smoke", "Smoke"], ["co", "CO"]], when: { opt: "sensor", is: "combo" } };
  const evKind = (o, d) => { const sn = (o.opt && o.opt.sensor) || d; return sn === "combo" ? atype(o, "smoke") : sn; };
  const ic2 = (id, name, options, render) => ({ id, name, render });

  const looks = [
    ic2("roundfamily", "Round smoke & CO alarm", [{ id: "power", name: "Power", values: [["hardwired", "Hardwired"], ["battery", "Battery"]] }, { id: "sensor", name: "Sensor", values: SENS }, EVT,
      { id: "voice", name: "Voice", values: [["no", "No"], ["yes", "Yes"]] }], (o) => { const u = o.uid, op = o.opt || {}, hw = (op.power || "hardwired") === "hardwired", sn = op.sensor || "combo", voice = op.voice === "yes", k = evKind(o, "combo");
      let s = ceiling(o) + effects(o, 100, 80, 46, k) + (hw ? `<circle cx="100" cy="80" r="52" fill="url(#${u}-v)" opacity=".7"/><circle cx="100" cy="80" r="52" fill="none" stroke="#000" stroke-opacity=".2"/>` : "") +
        disc(o, 100, 80, 46, { slots: hw ? 24 : 16, ring: .66 });
      if (sn === "heat") s += `<circle cx="100" cy="80" r="20" fill="url(#${u}-v)" stroke="#000" stroke-opacity=".2"/>` + [0, 45, 90, 135].map((a) => `<path d="M100 62V98" stroke="#000" stroke-opacity=".15" stroke-width="2" transform="rotate(${a} 100 80)"/>`).join("") + `<circle cx="100" cy="80" r="5" fill="#2a2e34"/>`;
      else s += `<circle cx="100" cy="80" r="17" fill="url(#${u}-v)"/><circle cx="100" cy="80" r="17" fill="url(#${u}-disc)"/><circle cx="100" cy="80" r="17" fill="none" stroke="#000" stroke-opacity=".25"/>`;
      if (voice) s += `<circle cx="80" cy="66" r="7" fill="url(#${u}-grill)"/>`;
      if (sn === "co" || sn === "combo") s += `<path d="${rr(114, 60, 14, 6, 2)}" fill="#000" opacity=".22"/>`;
      if (hw) s += `<path d="M96 132h8" stroke="#e8c84a" stroke-width="2"/>`;
      return svgS(o, s + lights(o, 86, 108, 14) + battery(o, 168, 172)); }),

    ic2("sealed10", "10-year sealed alarm", [{ id: "sensor", name: "Sensor", values: SENS.slice(0, 2) }, EVT], (o) => svgS(o, ceiling(o) + effects(o, 100, 80, 44, evKind(o, "combo")) + disc(o, 100, 80, 44, { slots: 30, ring: .5 }) +
      `<circle cx="100" cy="80" r="16" fill="#000" opacity=".12"/><circle cx="100" cy="80" r="13" fill="url(#${o.uid}-v)"/>` + lights(o, 86, 102, 14) + `<path d="M84 60h32" stroke="#e8c84a" stroke-width="2.4" opacity=".7"/>` + battery(o, 168, 172))),

    ic2("photohush", "Photoelectric with hush", [], (o) => { const u = o.uid, hush = mode(o) === "hush";
      return svgS(o, ceiling(o) + effects(o, 100, 80, 46, "smoke") + disc(o, 100, 80, 46, { slots: 12 }) +
        `<path d="${rr(78, 66, 44, 26, 13)}" fill="${hush ? AMB : "url(#" + u + "-v)"}" opacity="${hush ? .85 : 1}"/><path d="${rr(78, 66, 44, 26, 13)}" fill="none" stroke="#000" stroke-opacity=".25"/><path d="M88 79h24" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` + lights(o, 86, 104, 14) + battery(o, 168, 172)); }),

    ic2("linked", "Linked alarm & base", [{ id: "sensor", name: "Sensor", values: SENS.slice(0, 3) }, EVT], (o) => { const u = o.uid;
      return svgS(o, wall(o, 150) + effects(o, 70, 60, 38, evKind(o, "combo")) + disc(o, 70, 60, 38, { slots: 20, btn: .32 }) + lights(o, 58, 84, 12) +
        `<path d="${rr(130, 104, 44, 44, 12)}" fill="url(#${u}-v)"/><path d="${rr(130, 104, 44, 44, 12)}" fill="url(#${u}-fx)"/><circle cx="152" cy="126" r="12" fill="none" stroke="${o.on && mode(o) !== "hush" ? RED : GREEN}" stroke-width="2.4"${o.on ? ` class="${P}strobe"` : ""}/><circle cx="152" cy="126" r="4" fill="#d9dde2"/>` +
        (o.on ? `<path class="${P}wave" d="M180 120q6 8 0 16M186 116q10 12 0 24" fill="none" stroke="#ff6a6a" stroke-width="1.4"/>` : "") + `<path d="M110 76q14 18 20 34" fill="none" stroke="#7dd3fc" stroke-width="1" stroke-dasharray="2 3"/>` + battery(o, 168, 172)); }),

    ic2("squarewl", "Square wireless alarm", [{ id: "sensor", name: "Sensor", values: SENS.slice(0, 2) }, EVT], (o) => { const u = o.uid;
      return svgS(o, ceiling(o) + effects(o, 100, 80, 44, evKind(o, "combo")) + sh(o, 104, 122, 40, 6) + `<path d="${rr(56, 36, 88, 88, 22)}" fill="url(#${u}-v)"/><path d="${rr(56, 36, 88, 88, 22)}" fill="url(#${u}-disc)"/>` +
        `<path d="${rr(66, 46, 68, 68, 16)}" fill="none" stroke="#000" stroke-opacity=".18"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M76 ${58 + i * 8}H124" stroke="#000" stroke-opacity=".18" stroke-width="2.4" stroke-linecap="round"/>`).join("") + lights(o, 86, 106, 14) + battery(o, 168, 172)); }),

    ic2("zwavepair", "Z-Wave smoke & CO", [{ id: "atype", name: "Alarm type", values: [["smoke", "Smoke"], ["co", "CO"]] }], (o) => { const k = atype(o, "smoke"), oS = Object.assign({}, o, { on: o.on && k === "smoke" }), oC = Object.assign({}, o, { on: o.on && k === "co" });
      return svgS(o, ceiling(o) + effects(oS, 60, 70, 32, "smoke") + effects(oC, 140, 110, 30, "co") + disc(o, 60, 70, 32, { slots: 16, btn: .3 }) + lights(oS, 48, 90, 12) +
        disc(o, 140, 110, 30, { ring: .78, grill: .45 }) + `<rect x="128" y="88" width="24" height="5" rx="2" fill="#000" opacity=".2"/>` + lights(oC, 128, 128, 12) + battery(o, 168, 172)); }),

    ic2("coppm", "Digital CO alarm", [{ id: "power", name: "Mount", values: [["wall", "Wall (battery)"], ["plug", "Plug-in"]] }], (o) => { const u = o.uid, plug = (o.opt && o.opt.power) === "plug", alarm = o.on && mode(o) !== "hush";
      let s = wall(o, plug ? 170 : 160);
      if (plug) s += BG(`<path d="${rr(78, 70, 44, 66, 4)}" fill="#f2f2ee"/><path d="${rr(84, 104, 32, 26, 3)}" fill="#e6e6e0"/>`) + effects(o, 100, 70, 34, "co") + sh(o, 102, 108, 28, 4) +
        `<path d="${rr(76, 40, 48, 64, 10)}" fill="url(#${u}-v)"/><path d="${rr(76, 40, 48, 64, 10)}" fill="url(#${u}-fx)"/><path d="${rr(82, 48, 36, 18, 2)}" fill="#c9d4b4"/>` +
        digits(o.on ? "85" : "0", 92, 52, 10, alarm ? "#7a1a1a" : "#1c2b16") + `<path d="M86 74h28M86 78h28M86 82h28" stroke="#000" stroke-opacity=".2" stroke-width="2"/>` + lights(o, 86, 94, 14);
      else s += effects(o, 100, 86, 40, "co") + sh(o, 102, 126, 66, 5) + `<path d="${rr(36, 52, 128, 70, 12)}" fill="url(#${u}-v)"/><path d="${rr(36, 52, 128, 70, 12)}" fill="url(#${u}-fx)"/>` +
        [0, 1, 2, 3, 4].map((i) => `<path d="M46 ${64 + i * 9}H62M138 ${64 + i * 9}H154" stroke="#000" stroke-opacity=".25" stroke-width="2.4" stroke-linecap="round"/>`).join("") +
        `<path d="${rr(72, 60, 56, 30, 3)}" fill="#c9d4b4"/>` + digits(o.on ? "185" : "0", 82, 66, 16, alarm ? "#7a1a1a" : "#1c2b16", "rgba(0,0,0,.06)") +
        `<path d="${rr(78, 98, 18, 8, 3)}" fill="url(#${u}-v)" stroke="#000" stroke-opacity=".25"/><path d="${rr(104, 98, 18, 8, 3)}" fill="url(#${u}-v)" stroke="#000" stroke-opacity=".25"/>` + lights(o, 86, 114, 14);
      return svgS(o, s + battery(o, 168, 172)); }),

    ic2("nightring", "Night-light alarm", [{ id: "sensor", name: "Sensor", values: SENS.slice(0, 2) }, EVT], (o) => { const u = o.uid, m = mode(o), col = o.on && m !== "hush" ? RED : m === "hush" ? AMB : m === "test" ? CYAN : "#ffe2a0";
      return svgS(o, ceiling(o) + effects(o, 100, 80, 46, evKind(o, "combo")) + disc(o, 100, 80, 46, { grill: .5 }) +
        `<circle cx="100" cy="80" r="38" fill="none" stroke="${col}" stroke-width="4"${o.on || m !== "normal" ? ` class="${P}strobe"` : ""} opacity="${o.on || m !== "normal" ? 1 : .7}"/>` + (o.on || m !== "normal" ? "" : `<circle cx="100" cy="80" r="60" fill="url(#${u}-glow)" opacity=".5"/>`) +
        `<circle cx="100" cy="80" r="12" fill="url(#${u}-v)" stroke="#000" stroke-opacity=".2"/>` + battery(o, 168, 172)); }),
  ];


  const R = {}; looks.forEach((l) => { R[l.id] = l.render; });
  const ALL = looks.map((l) => l.id);
  const is = (list) => ({ opt: "style", is: list });
  const options = [
    { id: "style", name: "Style", values: looks.map((l) => [l.id, l.name]) },
    { id: "power", name: "Power", values: [["hardwired", "Hardwired"], ["battery", "Battery"]], when: is("roundfamily") },
    { id: "sensor", name: "Sensor", values: SENS, when: is("roundfamily") },
    { id: "sensor3", name: "Sensor", values: SENS.slice(0, 3), when: is("linked") },
    { id: "sensor2", name: "Sensor", values: SENS.slice(0, 2), when: is(["sealed10", "squarewl", "nightring"]) },
    { id: "atype", name: "Alarm type", values: [["smoke", "Smoke"], ["co", "CO"]], when: is(["roundfamily", "sealed10", "linked", "squarewl", "zwavepair", "nightring"]) },
    { id: "voice", name: "Voice", values: [["no", "No"], ["yes", "Yes"]], when: is("roundfamily") },
    MODE,
    { id: "mount", name: "Mount", values: [["wall", "Wall (battery)"], ["plug", "Plug-in"]], when: is("coppm") },
  ];
  function oldOpt(op) {
    const k = op.style || "roundfamily", m = { mode: op.mode || "normal", atype: op.atype || "smoke" };
    if (k === "roundfamily") Object.assign(m, { power: op.power || "hardwired", sensor: op.sensor || "combo", voice: op.voice || "no" });
    else if (k === "linked") m.sensor = op.sensor3 || "combo";
    else if (k === "sealed10" || k === "squarewl" || k === "nightring") m.sensor = op.sensor2 || "combo";
    else if (k === "coppm") m.power = op.mount === "plug" ? "plug" : "wall";
    return m;
  }
  const icons = [{ id: "alarm", name: "Smoke & CO alarm", colors: [WH, AL, GY], picker: true, colorLabel: "Body", options,
    render(o) { const op = o.opt || {}, k = R[op.style] ? op.style : ALL[0]; return R[k](Object.assign({}, o, { opt: oldOpt(op) })); } }];

  (window.HDA = window.HDA || []).push({
    id: "smoke", tab: "Smoke & CO alarms", group: "Security", kind: "device", onWord: "Alarm", offWord: "Normal", levelLabel: "Battery",
    intro: "One smoke & CO alarm builder: pick the Style (eight looks), then only the menus that style has: Power, Sensor (smoke + CO, smoke, CO, heat), Alarm type (which alarm a smoke + CO unit is sounding), Voice, Mode (Normal, Test, Hush) and Mount, then the body color. Alarm = flashing red strobe, sound waves and smoke (or a CO cloud, or heat). Normal = a green pilot light; Test flashes every light; Hush shows the amber light. The slider is the battery.",
    css: css2, icons,
  });
})();
