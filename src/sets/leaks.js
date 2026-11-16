(function () {
  const P = "hda-leaks-";
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
.hda-leaks-flow{stroke-dashoffset:0}
.hda-anim .hda-leaks-flow{animation:hda-leaks-flow 1s linear infinite}
@keyframes hda-leaks-flow{to{stroke-dashoffset:-18}}
.hda-leaks-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-leaks-flk{animation:hda-leaks-flk .5s ease-in-out infinite alternate}
@keyframes hda-leaks-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-leaks-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-leaks-spin{animation:hda-leaks-spin 1s linear infinite}
@keyframes hda-leaks-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-leaks-blink{animation:hda-leaks-blink 1.2s steps(1,end) infinite}
@keyframes hda-leaks-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-leaks-chase{opacity:.18}
.hda-anim .hda-leaks-chase{animation:hda-leaks-chase 4s linear infinite}
@keyframes hda-leaks-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-leaks-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-leaks-bub{animation:hda-leaks-bub 2s ease-in infinite}
@keyframes hda-leaks-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-leaks-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-leaks-rip{animation:hda-leaks-rip 2.2s ease-out infinite}
@keyframes hda-leaks-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-leaks-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-leaks-mist{animation:hda-leaks-mist 1.6s ease-in-out infinite}
@keyframes hda-leaks-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-leaks-heat{opacity:0}
.hda-anim .hda-leaks-heat{animation:hda-leaks-heat 2.6s ease-out infinite}
.hda-anim .hda-leaks-hum{animation:hda-leaks-hum .16s linear infinite}
@keyframes hda-leaks-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-leaks-bob{animation:hda-leaks-bob 1.6s ease-in-out infinite}
@keyframes hda-leaks-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-leaks-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-leaks-heat.hda-leaks-still{opacity:.4}
.hda-anim .hda-leaks-heat.hda-leaks-still{opacity:0}
`;
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css2 = css + `
.hda-leaks-ring{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-leaks-ring{animation:hda-leaks-ring 1.6s ease-out infinite}
@keyframes hda-leaks-ring{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.3);opacity:0}}
.hda-leaks-ring.hda-leaks-still{opacity:.6}
.hda-anim .hda-leaks-ring.hda-leaks-still{opacity:0}
.hda-leaks-drop{opacity:.8}
.hda-anim .hda-leaks-drop{animation:hda-leaks-drop 1.5s ease-in infinite}
@keyframes hda-leaks-drop{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,22px);opacity:0}}
`;
  const BG = (s) => `<g class="hda-bg">${s}</g>`;
  const WH = "#eef0f1", BK = "#2a2d32", GY = "#9aa1a9";
  const TEMPS = [["68", "68°F"], ["50", "50°F"], ["38", "38°F"], ["30", "30°F"], ["20", "20°F"]];
  const TOPT = [{ id: "temp", name: "Temperature", values: TEMPS }];

  function lextra(o) {
    const u = o.uid;
    return lg(u + "-pud", 1, [[0, "#8fd0f2", .75], [1, "#3a8ac8", .6]]) + lg(u + "-wd", 1, [[0, "#b98a5a"], [1, "#7a5232"]]) +
      lg(u + "-tile2", 1, [[0, "#d9d6cf"], [1, "#a9a49a"]]) + lg(u + "-cab", 1, [[0, "#6a7480"], [1, "#4a525c"]]) + lg(u + "-rope", 0, [[0, "#c9a210"], [.5, "#ffe25a"], [1, "#a8840a"]]) +
      lg(u + "-hw", 0, [[0, "#9aa1a9"], [.4, "#f2f4f6"], [1, "#7a8189"]]) +
      `<pattern id="${u}-tl" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M0 .5H30M.5 0V30" stroke="#000" stroke-opacity=".22"/></pattern>` +
      `<pattern id="${u}-plank" width="200" height="12" patternUnits="userSpaceOnUse"><path d="M0 11.5H200" stroke="#3a2414" stroke-opacity=".45"/><path d="M60 0V12M150 0V12" stroke="#3a2414" stroke-opacity=".3"/></pattern>` +
      `<pattern id="${u}-braid" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0M-1 1L1 -1M5 7L7 5" stroke="#8a6a00" stroke-opacity=".6"/></pattern>`;
  }
  const svgL = (o, body) => svg(o, body, lextra(o));
  function floor(o, kind, fy) {
    const u = o.uid; fy = fy || 120;
    let s = `<rect width="200" height="${fy}" fill="url(#${u}-wall)"/><rect y="${fy - 8}" width="200" height="8" fill="#e9e6df" opacity=".6"/>`;
    if (kind === "wood") s += `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-wd)" opacity=".75"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-plank)"/>`;
    else if (kind === "conc") s += `<path d="M0 ${fy}H200V200H0Z" fill="#8f949a" opacity=".45"/>` + [[30, 150], [90, 180], [150, 140], [176, 186]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="1" fill="#fff" fill-opacity=".2"/>`).join("");
    else s += `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-tile2)" opacity=".75"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-tl)"/>`;
    return BG(s + `<path d="M0 ${fy}H200" stroke="#000" stroke-opacity=".3"/>`);
  }
  function puddle(o, cx, cy, rx) {
    if (!o.on) return "";
    const ry = rx * .3;
    return `<path d="M${n1(cx - rx)} ${cy}Q${n1(cx - rx * 1.05)} ${n1(cy - ry * 1.1)} ${n1(cx - rx * .3)} ${n1(cy - ry)}Q${n1(cx + rx * .2)} ${n1(cy - ry * 1.3)} ${n1(cx + rx * .8)} ${n1(cy - ry * .9)}Q${n1(cx + rx * 1.15)} ${n1(cy - ry * .2)} ${n1(cx + rx * .9)} ${n1(cy + ry * .7)}Q${n1(cx + rx * .2)} ${n1(cy + ry * 1.2)} ${n1(cx - rx * .5)} ${n1(cy + ry)}Q${n1(cx - rx * 1.1)} ${n1(cy + ry * .8)} ${n1(cx - rx)} ${cy}Z" fill="url(#${o.uid}-pud)"/>` +
      `<ellipse cx="${n1(cx - rx * .35)}" cy="${n1(cy - ry * .3)}" rx="${n1(rx * .3)}" ry="${n1(ry * .2)}" fill="#fff" opacity=".45"/>` +
      [0, 1].map((i) => `<ellipse class="${P}rip" style="animation-delay:-${i * 1.1}s" cx="${n1(cx + rx * .4)}" cy="${n1(cy + ry * .2)}" rx="${n1(rx * .25)}" ry="${n1(ry * .25)}" fill="none" stroke="#e8f8ff" stroke-width=".8"/>`).join("");
  }
  const alarm = (o, x, y, r) => o.on ? [0, 1, 2].map((i) => `<circle class="${P}ring${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .5)}s" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${RED}" stroke-width="1.6"/>`).join("") : "";
  const sled = (o, x, y, r) => o.on ? `<g class="${P}blink">${led(o, x, y, r || 1.6, true, RED, "hr")}</g>` : led(o, x, y, r || 1.6, true, GREEN, "hg");
  const drops = (o, pts) => o.on ? pts.map((p, i) => `<path class="${P}drop" style="animation-delay:-${n1(i * .5)}s" d="M${p[0]} ${p[1]}q-2 3 0 4.4q2 -1.4 0 -4.4Z" fill="#9fdcff"/>`).join("") : "";
  function battery(o, x, y) {
    const lv = o.level, col = lv < .2 ? RED : lv < .4 ? AMB : "#7ee08a";
    return `<path d="${rr(x, y, 18, 9, 2)}" fill="#0a0d10" stroke="#e9ecef" stroke-width="1"/><rect x="${x + 18}" y="${y + 3}" width="2" height="3" fill="#e9ecef"/><rect x="${x + 2}" y="${y + 2}" width="${n1(Math.max(.6, 14 * lv))}" height="5" rx="1" fill="${col}"/>`;
  }
  function temp(o, x, y) {
    const t = +((o.opt && o.opt.temp) || 68), col = t < 40 ? "#6fb8ff" : "#7ee08a";
    return `<path d="${rr(x, y, 28, 14, 2)}" fill="#0a0d10" stroke="#e9ecef"/>` + digits(String(t), x + 5, y + 4, 6, col, "rgba(255,255,255,.05)") +
      `<circle cx="${x + 18}" cy="${y + 4.6}" r=".9" fill="none" stroke="${col}" stroke-width=".6"/>` + (t < 40 ? `<path d="M${x + 22} ${y + 3}v8M${x + 19} ${y + 5}l6 4M${x + 25} ${y + 5}l-6 4" stroke="${col}" stroke-width=".8"/>` : "");
  }
  const body = (o, d) => `<path d="${d}" fill="url(#${o.uid}-v)"/><path d="${d}" fill="url(#${o.uid}-fx)"/><path d="${d}" fill="url(#${o.uid}-g)" opacity=".35"/>`;
  const cord = (d) => `<path d="${d}" fill="none" stroke="#1a1c20" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#5a6068" stroke-width=".8"/>`;
  const probe = (o, x, y) => `<path d="${rr(x - 8, y - 4, 16, 6, 2)}" fill="url(#${o.uid}-v)"/><path d="${rr(x - 8, y - 4, 16, 6, 2)}" fill="url(#${o.uid}-fx)"/><rect x="${x - 5}" y="${y + 1.6}" width="2" height="1.6" fill="url(#${o.uid}-mt)"/><rect x="${x + 3}" y="${y + 1.6}" width="2" height="1.6" fill="url(#${o.uid}-mt)"/>`;

  const ic = (id, name, colors, temp, render) => Object.assign({ id, name, colors, picker: true, colorLabel: "Body", render }, temp ? { options: TOPT } : {});

  const SHAPE = {
    square: (o, x, y, s) => `<path d="M${x - 34 * s} ${y - 10 * s}L${x - 24 * s} ${y - 26 * s}H${x + 44 * s}L${x + 34 * s} ${y - 10 * s}Z" fill="url(#${o.uid}-tp)"/>` + body(o, rr(x - 34 * s, y - 20 * s, 68 * s, 20 * s, 6 * s)) +
      `<path d="M${x + 34 * s} ${y - 10 * s}L${x + 44 * s} ${y - 26 * s}V${y - 14 * s}L${x + 34 * s} ${y}Z" fill="url(#${o.uid}-sd)"/><circle cx="${x + 12 * s}" cy="${y - 12 * s}" r="${2.4 * s}" fill="#d9dde2" stroke="#9aa1a9" stroke-width=".6"/>`,
    teardrop: (o, x, y, s) => { const d = `M${x} ${y - 64 * s}C${x + 10 * s} ${y - 50 * s} ${x + 36 * s} ${y - 36 * s} ${x + 36 * s} ${y - 18 * s}C${x + 36 * s} ${y - 2 * s} ${x + 20 * s} ${y + 4 * s} ${x} ${y + 4 * s}C${x - 20 * s} ${y + 4 * s} ${x - 36 * s} ${y - 2 * s} ${x - 36 * s} ${y - 18 * s}C${x - 36 * s} ${y - 36 * s} ${x - 10 * s} ${y - 50 * s} ${x} ${y - 64 * s}Z`;
      return `<path d="${d}" fill="url(#${o.uid}-v)"/><path d="${d}" fill="url(#${o.uid}-fx)"/><path d="${d}" fill="none" stroke="#8a9096" stroke-width="1.6" transform="translate(${n1(x * .12)} ${n1((y - 18 * s) * .12)}) scale(.88)"/>` +
        `<path d="M${x - 16 * s} ${y - 36 * s}Q${x - 8 * s} ${y - 46 * s} ${x - 2 * s} ${y - 50 * s}" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>`; },
    slim: (o, x, y, s) => `<path d="M${x - 46 * s} ${y - 8 * s}L${x - 38 * s} ${y - 18 * s}H${x + 54 * s}L${x + 46 * s} ${y - 8 * s}Z" fill="url(#${o.uid}-tp)"/>` + body(o, rr(x - 46 * s, y - 12 * s, 92 * s, 12 * s, 5 * s)) + `<path d="M${x + 20 * s} ${y - 6 * s}h${14 * s}" stroke="#9aa1a9" stroke-width="1.4" stroke-linecap="round"/>`,
    round: (o, x, y, s) => `<ellipse cx="${x}" cy="${y - 2 * s}" rx="${28 * s}" ry="${9 * s}" fill="url(#${o.uid}-sd)"/><path d="M${x - 28 * s} ${y - 8 * s}V${y - 4 * s}A${28 * s} ${9 * s} 0 0 0 ${x + 28 * s} ${y - 4 * s}V${y - 8 * s}Z" fill="url(#${o.uid}-c)"/>` +
      `<path d="M${x - 28 * s} ${y - 8 * s}Q${x - 26 * s} ${y - 22 * s} ${x} ${y - 22 * s}Q${x + 26 * s} ${y - 22 * s} ${x + 28 * s} ${y - 8 * s}A${28 * s} ${9 * s} 0 0 1 ${x - 28 * s} ${y - 8 * s}Z" fill="url(#${o.uid}-tp)"/><ellipse cx="${x - 8 * s}" cy="${y - 17 * s}" rx="${10 * s}" ry="${2.6 * s}" fill="#fff" opacity=".55"/>` +
      `<path d="M${x} ${y - 18 * s}q${-3 * s} ${4 * s} 0 ${6 * s}q${3 * s} ${-2 * s} 0 ${-6 * s}Z" fill="#c9ced4"/>`,
    standing: (o, x, y, s) => { const d = `M${x} ${y - 70 * s}C${x + 10 * s} ${y - 54 * s} ${x + 22 * s} ${y - 42 * s} ${x + 22 * s} ${y - 24 * s}C${x + 22 * s} ${y - 8 * s} ${x + 12 * s} ${y} ${x} ${y}C${x - 12 * s} ${y} ${x - 22 * s} ${y - 8 * s} ${x - 22 * s} ${y - 24 * s}C${x - 22 * s} ${y - 42 * s} ${x - 10 * s} ${y - 54 * s} ${x} ${y - 70 * s}Z`;
      return `<path d="${d}" fill="url(#${o.uid}-v)"/><path d="${d}" fill="url(#${o.uid}-fx)"/><circle cx="${x}" cy="${y - 26 * s}" r="${5 * s}" fill="#d9dde2"/><path d="M${x - 12 * s} ${y - 40 * s}Q${x - 6 * s} ${y - 54 * s} ${x - 2 * s} ${y - 58 * s}" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>`; },
    floodsq: (o, x, y, s) => `<ellipse cx="${x}" cy="${y - 2 * s}" rx="${32 * s}" ry="${10 * s}" fill="url(#${o.uid}-sd)"/><path d="M${x - 32 * s} ${y - 6 * s}Q${x - 30 * s} ${y - 30 * s} ${x} ${y - 30 * s}Q${x + 30 * s} ${y - 30 * s} ${x + 32 * s} ${y - 6 * s}A${32 * s} ${10 * s} 0 0 1 ${x - 32 * s} ${y - 6 * s}Z" fill="url(#${o.uid}-v)"/>` +
      `<path d="M${x - 32 * s} ${y - 6 * s}Q${x - 30 * s} ${y - 30 * s} ${x} ${y - 30 * s}Q${x + 30 * s} ${y - 30 * s} ${x + 32 * s} ${y - 6 * s}A${32 * s} ${10 * s} 0 0 1 ${x - 32 * s} ${y - 6 * s}Z" fill="url(#${o.uid}-fx)"/><ellipse cx="${x - 10 * s}" cy="${y - 24 * s}" rx="${10 * s}" ry="${2.6 * s}" fill="#fff" opacity=".55"/>` +
      `<ellipse cx="${x}" cy="${y - 22 * s}" rx="${7 * s}" ry="${2.6 * s}" fill="none" stroke="${o.on ? RED : "#4aa8ff"}" stroke-width="${1.6 * s}"/>`,
    zround: (o, x, y, s) => body(o, rr(x - 13 * s, y - 40 * s, 26 * s, 36 * s, 4 * s)) + `<path d="M${x - 9 * s} ${y - 36 * s}H${x + 9 * s}" stroke="#fff" stroke-opacity=".6"/>`,
  };
  const LEDPOS = { square: [-4, -12], teardrop: [0, -18], slim: [-30, -6], round: [16, -12], standing: [0, -26], floodsq: [18, -12], zround: [0, -14] };
  const PLACE = {
    floor: { spot: [100, 162], mount: [54, 66], bg: (o) => floor(o, "tile", 112) },
    sink: { spot: [104, 166], mount: [160, 70], bg: (o) => { const u = o.uid; return BG(`<rect width="200" height="200" fill="url(#${u}-cab)"/><path d="M16 16H184V176H16Z" fill="#2a2e34"/><path d="M16 150H184V176H16Z" fill="#4a525c"/>` +
      `<path d="M70 16V70Q70 96 100 96Q124 96 124 76V60" fill="none" stroke="#e6e9ec" stroke-width="7"/><path d="M60 16V40M144 16V40" stroke="#c9ced4" stroke-width="4"/><circle cx="60" cy="44" r="5" fill="#c33"/><circle cx="144" cy="44" r="5" fill="#2a6dd9"/><path d="M0 0H16V200H0ZM184 0H200V200H184Z" fill="url(#${u}-cab)"/>`); }, drip: [[100, 102], [104, 116]] },
    pan: { spot: [136, 166], mount: [168, 92], bg: (o) => { const u = o.uid; return floor(o, "conc", 150) + BG(`<path d="M30 30H150V156H30Z" fill="url(#${u}-hw)"/><path d="M30 30Q90 18 150 30" fill="url(#${u}-hw)"/><path d="M76 30V0M104 30V0" stroke="#b8693a" stroke-width="6"/>` +
      `<path d="${rr(70, 120, 40, 24, 3)}" fill="#14161a"/><path d="M14 156L20 172H170L176 156Z" fill="#8a949e"/><path d="M14 156H176" stroke="#c9ced4" stroke-width="2"/>`); }, drip: [[50, 140], [130, 146]] },
    sump: { spot: [140, 150], mount: [50, 60], bg: (o) => { const u = o.uid; return BG(`<rect width="200" height="110" fill="url(#${u}-wall)"/><rect width="200" height="110" fill="url(#${u}-blk)"/><path d="M0 110H200V200H0Z" fill="url(#${u}-soil)"/><path d="M0 110H200V118H0Z" fill="#9aa0a6" fill-opacity=".55"/>`) +
      `<path d="M110 110H170V198H110Z" fill="#14161a"/><path d="M114 ${o.on ? 140 : 176}H166V198H114Z" fill="url(#${u}-wt)"/>`; } },
    toilet: { spot: [146, 168], mount: [170, 66], drip: [[124, 126], [126, 138]], bg: (o) => { const u = o.uid; return floor(o, "tile", 124) + BG(`<rect width="200" height="124" fill="url(#${u}-tl)" opacity=".5"/>` +
      `<path d="${rr(34, 46, 78, 50, 6)}" fill="#f4f5f6"/><path d="${rr(30, 40, 86, 10, 4)}" fill="#e9ecef"/><path d="M40 96H106Q110 126 92 136V170H54V136Q36 126 40 96Z" fill="#f2f3f4"/><ellipse cx="73" cy="100" rx="36" ry="9" fill="#e6e9ec"/><path d="M50 170H96" stroke="#c9ced4" stroke-width="3"/>` +
      `<path d="M124 118h8v8h-8z" fill="url(#${u}-mt)"/><path d="M128 126V140" stroke="#9aa1a9" stroke-width="3"/><path d="M128 140Q128 150 112 152H100" fill="none" stroke="#c9ced4" stroke-width="2.4"/><circle cx="136" cy="122" r="3.4" fill="#c9ced4"/>`); } },
    dishwasher: { spot: [100, 174], mount: [176, 100], drip: [[80, 160], [118, 160]], bg: (o) => { const u = o.uid; return BG(`<rect width="200" height="200" fill="url(#${u}-wall)"/><rect y="30" width="200" height="8" fill="url(#${u}-ct)"/><rect y="38" width="200" height="138" fill="url(#${u}-cab)"/>` +
      `<path d="M50 40H150V160H50Z" fill="url(#${u}-hw)"/><path d="M54 46H146V56H54Z" fill="#14161a"/><rect x="70" y="62" width="60" height="4" rx="2" fill="#c9ced4"/><path d="M50 160H150V176H50Z" fill="#0c0d10"/><path d="M0 176H200V200H0Z" fill="url(#${u}-tile2)" opacity=".7"/>`); } },
    washer: { spot: [130, 172], mount: [178, 104], drip: [[150, 70], [156, 84]], bg: (o) => { const u = o.uid; return floor(o, "tile", 124) + BG(`<path d="${rr(132, 40, 44, 34, 3)}" fill="#f2f2ee"/><circle cx="144" cy="54" r="5" fill="#c33"/><circle cx="164" cy="54" r="5" fill="#2a6dd9"/><path d="M150 62v10" stroke="#555" stroke-width="5"/>` +
      `<path d="M10 70H96V176H10Z" fill="#eceef0"/><path d="M96 70L108 62V168L96 176Z" fill="#c9ced4"/><path d="M10 70L22 62H108L96 70Z" fill="#f4f5f6"/>` +
      `<path d="M144 60C130 80 120 90 108 96M164 60C150 86 128 100 108 106" fill="none" stroke="#1a1c20" stroke-width="3"/>`); } },
    fridge: { spot: [128, 172], mount: [178, 96], drip: [[134, 132], [136, 144]], bg: (o) => { const u = o.uid; return floor(o, "wood", 124) + BG(`<path d="M8 20H84V176H8Z" fill="url(#${u}-hw)"/><path d="M84 20L96 14V170L84 176Z" fill="#8a9096"/><path d="M8 96H84" stroke="#000" stroke-opacity=".25"/>` +
      `<path d="${rr(126, 120, 18, 14, 2)}" fill="#f2f2ee"/><circle cx="135" cy="127" r="3" fill="#c9973a"/><path d="M135 134C135 160 120 150 110 160S96 170 96 166" fill="none" stroke="#c9733a" stroke-width="1.6"/><path d="M112 170c8 -6 16 -6 22 0s-16 6 -22 0" fill="none" stroke="#c9733a" stroke-width="1.4"/>`); } },
    hvac: { spot: [100, 154], mount: [178, 70], drip: [[90, 132], [110, 136]], bg: (o) => { const u = o.uid; return floor(o, "conc", 166) + BG(`<path d="M52 12H148V136H52Z" fill="#9aa1a9"/><path d="M52 12H148V136H52Z" fill="url(#${u}-fx)"/><path d="M60 24H140V60H60Z" fill="#8a9096" stroke="#000" stroke-opacity=".2"/><path d="M60 70H140V128H60Z" fill="#8a9096" stroke="#000" stroke-opacity=".2"/>` +
      `<path d="M30 136L36 160H164L170 136Z" fill="url(#${u}-hw)"/><path d="M30 136H170" stroke="#c9ced4" stroke-width="2"/><path d="M148 110H170V176" fill="none" stroke="#e6e9ec" stroke-width="5"/>`); } },
    tub: { spot: [104, 168], mount: [176, 70], drip: [[96, 112], [100, 126]], bg: (o) => { const u = o.uid; return BG(`<rect width="200" height="200" fill="url(#${u}-wall)"/><rect width="200" height="200" fill="url(#${u}-tl)" opacity=".4"/>` +
      `<path d="M30 56H170V178H30Z" fill="#1a1c20"/><path d="M30 56H170V178H30Z" fill="none" stroke="#f2f0ea" stroke-width="4"/><path d="M36 150H164V176H36Z" fill="#3a3530"/>` +
      `<path d="M60 56V96Q60 104 70 104H120V118" fill="none" stroke="#e6e9ec" stroke-width="5"/><path d="M120 118V150" stroke="#e6e9ec" stroke-width="6"/><path d="M110 64h20" stroke="#9aa1a9" stroke-width="5"/><path d="M0 178H200V200H0Z" fill="url(#${u}-tile2)" opacity=".7"/>`); } },
    softener: { spot: [146, 172], mount: [180, 84], drip: [[60, 50], [70, 58]], bg: (o) => { const u = o.uid; return floor(o, "conc", 130) + BG(`<path d="M24 60Q24 48 40 48Q56 48 56 60V176H24Z" fill="#26282c"/><path d="M28 34H52V50H28Z" fill="#14161a"/><path d="M64 96H116V176H64Z" fill="#e9e6df"/><path d="M62 92H118V98H62Z" fill="#c9ced4"/>` +
      `<path d="M34 34V10M46 34V10" stroke="#b8693a" stroke-width="5"/>`); } },
    floordrain: { spot: [100, 166], mount: [40, 70], bg: (o) => { const u = o.uid; return floor(o, "conc", 110) + BG(`<rect width="200" height="110" fill="url(#${u}-blk)"/><ellipse cx="120" cy="170" rx="22" ry="7" fill="#5a6068"/><ellipse cx="120" cy="170" rx="18" ry="5.4" fill="#2a2e34"/>` +
      [-12, -6, 0, 6, 12].map((d) => `<path d="M${120 + d} 165.4V174.6" stroke="#8a9096" stroke-width="1.2"/>`).join("") + `<path d="M60 150Q100 156 140 168" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="10"/>`); } },
    crawl: { spot: [100, 172], mount: [56, 44], drip: [[120, 52], [124, 64]], bg: (o) => { const u = o.uid; return BG(`<rect width="200" height="200" fill="#1a1612"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M${-10 + i * 50} 0V30" stroke="url(#${u}-wd)" stroke-width="14"/>`).join("") + `<rect y="0" width="200" height="8" fill="#7a5232"/>` +
      `<path d="M0 40H200" stroke="#e6e9ec" stroke-width="5"/><path d="M0 130L200 120V200H0Z" fill="#e9ecef" opacity=".85"/><path d="M0 130L200 120" stroke="#fff" stroke-opacity=".5"/><path d="M30 150Q70 140 110 156M120 170Q160 160 196 176" stroke="#c9ced4" fill="none"/>` +
      `<path d="M160 60H176V128H160Z" fill="#7a7a72"/>`); } },
    vanity: { spot: [100, 168], mount: [158, 76], drip: [[96, 104], [98, 118]], bg: (o) => { const u = o.uid; return BG(`<rect width="200" height="200" fill="#f2f0ea"/><path d="M24 24H176V180H24Z" fill="#2a2e34"/><path d="M24 150H176V180H24Z" fill="#4a525c"/>` +
      `<path d="M96 24V60Q96 82 112 82Q124 82 124 70V60" fill="none" stroke="#e6e9ec" stroke-width="6"/><path d="M124 60H176" stroke="#e6e9ec" stroke-width="6"/><path d="M60 24V50M140 24V40" stroke="#c9ced4" stroke-width="3"/><circle cx="60" cy="52" r="4" fill="#c9ced4"/>` +
      `<path d="M0 0H24V200H0ZM176 0H200V200H176Z" fill="#e9e6df"/>`); } },
  };
  const PROBE = [["none", "None"], ["short", "Short cord"], ["long", "Long cord"], ["rope", "Rope cable"]];
  const PLACEV = [["floor", "Floor"], ["toilet", "Behind toilet"], ["sink", "Under kitchen sink"], ["vanity", "Under bathroom vanity"], ["dishwasher", "Under dishwasher"], ["washer", "Behind washer"], ["fridge", "Behind fridge (ice maker)"], ["pan", "Water heater pan"], ["hvac", "AC / furnace drain pan"], ["tub", "Tub / shower access"], ["softener", "Water softener"], ["floordrain", "Basement floor drain"], ["sump", "Sump"], ["crawl", "Crawlspace"]];
  const TEMPV = [["off", "Off"]].concat(TEMPS);
  const lead = (v, list) => list.filter((x) => x[0] === v).concat(list.filter((x) => x[0] !== v));
  function leakCard(o, shape) {
    const op = o.opt || {}, pr = op.probe || "none", pl = PLACE[op.place || "floor"] || PLACE.floor, sp = pl.spot, wallMount = pr !== "none";
    let s = pl.bg(o);
    if (pr === "rope") { const rd = `M${sp[0] - 80} ${sp[1] + 6}C${sp[0] - 40} ${sp[1] - 2} ${sp[0]} ${sp[1] + 10} ${sp[0] + 40} ${sp[1] + 2}S${sp[0] + 80} ${sp[1] - 4} ${sp[0] + 96} ${sp[1] + 6}`;
      s += puddle(o, sp[0], sp[1] + 2, 52) + `<path d="${rd}" fill="none" stroke="#7a6200" stroke-width="6" stroke-linecap="round"/><path d="${rd}" fill="none" stroke="url(#${o.uid}-rope)" stroke-width="4.6" stroke-linecap="round"/><path d="${rd}" fill="none" stroke="url(#${o.uid}-braid)" stroke-width="4.6"/>`; }
    else s += puddle(o, sp[0], sp[1], wallMount ? 50 : 66);
    s += drops(o, pl.drip || [[sp[0] - 40, 100], [sp[0] + 20, 92]]);
    let bx = sp[0], by = sp[1], sc = 1;
    if (wallMount) { bx = pl.mount[0]; by = pl.mount[1] + 20; sc = .62;
      const px = pr === "short" ? (bx + sp[0]) / 2 + (sp[0] > bx ? -6 : 6) : sp[0], py = pr === "short" ? Math.min(sp[1], by + 50) : sp[1];
      if (pr !== "rope") s += cord(`M${bx} ${by}C${bx} ${by + 40} ${n1((bx + px) / 2)} ${py} ${px} ${py}`) + probe(o, px, py + 2);
      else s += cord(`M${bx} ${by}C${bx} ${by + 40} ${sp[0] - 90} ${sp[1] - 10} ${sp[0] - 80} ${sp[1] + 6}`); }
    else s += sh(o, bx, by + 2, 40, 5);
    s += SHAPE[shape](o, bx, by, sc);
    const lp = LEDPOS[shape]; s += sled(o, n1(bx + lp[0] * sc), n1(by + lp[1] * sc), 1.6) + alarm(o, bx, by - 30 * sc, 14);
    if (op.temp && op.temp !== "off") s += temp(o, 20, 16);
    return svgL(o, s + battery(o, 160, 16));
  }
  const leakOpts = (probe, temp) => [{ id: "probe", name: "Probe", values: lead(probe, PROBE) }, { id: "place", name: "Placement", values: PLACEV }].concat(temp ? [{ id: "temp", name: "Temperature", values: lead(temp, TEMPV) }] : []);
  const lc = (id, name, shape, probe, temp) => ({ id, name, colors: [WH, BK, GY], picker: true, colorLabel: "Body", options: leakOpts(probe, temp), render: (o) => leakCard(o, shape) });

  const icons = [
    lc("squarepuck", "Square leak puck", "square", "none", "off"),
    lc("teardrop", "Teardrop leak sensor", "teardrop", "none", null),
    lc("slim", "Slim leak sensor", "slim", "none", null),
    lc("roundmini", "Round leak sensor", "round", "none", null),
    lc("dropdetector", "Smart leak detector", "standing", "rope", "68"),
    lc("floodfreeze", "Flood & freeze", "floodsq", "none", "68"),
    lc("zprobe", "Z-Wave probe sensor", "zround", "short", "off"),
    { id: "gateway", name: "Sensor & gateway", colors: [WH, BK, GY], picker: true, colorLabel: "Body", render: (o) => { const u = o.uid;
      return svgL(o, floor(o, "tile", 120) + BG(`<path d="M120 92H186V98H120Z" fill="url(#${u}-wd)"/>`) + puddle(o, 70, 166, 50) +
        `<ellipse cx="153" cy="90" rx="22" ry="5" fill="#000" opacity=".25"/><path d="M131 90Q131 70 153 70Q175 70 175 90Z" fill="url(#${u}-v)"/><path d="M131 90Q131 70 153 70Q175 70 175 90Z" fill="url(#${u}-fx)"/><path d="M131 90H175" stroke="#000" stroke-opacity=".2"/>` +
        sled(o, 153, 80, 1.8) + (o.on ? `<path class="${P}blink" d="M180 70q6 6 0 12M184 66q10 10 0 20" fill="none" stroke="${RED}" stroke-width="1.4"/>` : "") +
        sh(o, 72, 166, 18, 4) + body(o, rr(60, 122, 24, 44, 6)) + `<circle cx="72" cy="134" r="6" fill="#d9dde2" stroke="#9aa1a9" stroke-width=".6"/>` + sled(o, 72, 148, 1.3) + alarm(o, 72, 120, 12) + drops(o, [[50, 96], [100, 104]]) + battery(o, 160, 16)); } },
  ];


  (window.HDA = window.HDA || []).push({
    id: "leaks", tab: "Water leak sensors", group: "Utility", kind: "device", onWord: "Wet", offWord: "Dry", levelLabel: "Battery",
    intro: "Eight water leak sensors, each built from menus: Probe (none, short cord, long cord, rope cable), Placement (14 spots: floor, behind the toilet, under the kitchen sink or vanity, dishwasher, washer, fridge, AC/furnace pan, tub, water softener, water heater pan, floor drain, crawlspace, sump) and a Temperature readout where the real one has it. Wet = a puddle spreads, the LED blinks red and alarm rings pulse; dry = a green LED on a dry floor. The slider is the battery; temperatures below 40°F turn blue.",
    css: css2, icons,
  });
})();
