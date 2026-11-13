(function () {
  const P = "hda-water-";
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
.hda-water-flow{stroke-dashoffset:0}
.hda-anim .hda-water-flow{animation:hda-water-flow 1s linear infinite}
@keyframes hda-water-flow{to{stroke-dashoffset:-18}}
.hda-water-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-water-flk{animation:hda-water-flk .5s ease-in-out infinite alternate}
@keyframes hda-water-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-water-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-water-spin{animation:hda-water-spin 1s linear infinite}
@keyframes hda-water-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-water-blink{animation:hda-water-blink 1.2s steps(1,end) infinite}
@keyframes hda-water-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-water-chase{opacity:.18}
.hda-anim .hda-water-chase{animation:hda-water-chase 4s linear infinite}
@keyframes hda-water-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-water-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-water-bub{animation:hda-water-bub 2s ease-in infinite}
@keyframes hda-water-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-water-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-water-rip{animation:hda-water-rip 2.2s ease-out infinite}
@keyframes hda-water-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-water-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-water-mist{animation:hda-water-mist 1.6s ease-in-out infinite}
@keyframes hda-water-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-water-heat{opacity:0}
.hda-anim .hda-water-heat{animation:hda-water-heat 2.6s ease-out infinite}
.hda-anim .hda-water-hum{animation:hda-water-hum .16s linear infinite}
@keyframes hda-water-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-water-bob{animation:hda-water-bob 1.6s ease-in-out infinite}
@keyframes hda-water-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-water-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-water-heat.hda-water-still{opacity:.4}
.hda-anim .hda-water-heat.hda-water-still{opacity:0}
`;
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  function pitScene(o, x0, x1) {
    const u = o.uid, wy = +n1(186 - 52 * o.level), id = u + "-pt", c = (x0 + x1) / 2;
    const s = room(o, 112, "block") + `<clipPath id="${id}"><path d="M${x0} 112H${x1}V196H${x0}Z"/></clipPath>` +
      `<g class="hda-bg"><path d="M0 112H200V200H0Z" fill="url(#${u}-soil)"/><path d="M0 112H200V120H0Z" fill="#9aa0a6" fill-opacity=".55"/><path d="M0 112H200" stroke="#fff" stroke-opacity=".2"/>` +
      [[16, 150], [176, 140], [24, 182], [182, 176], [10, 130]].map((p) => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="4" ry="2.5" fill="#7a6650" opacity=".6"/>`).join("") + `</g>` +
      `<path d="M${x0 - 4} 112H${x1 + 4}V198H${x0 - 4}Z" fill="#111317"/><g clip-path="url(#${id})"><rect x="${x0}" y="112" width="${x1 - x0}" height="88" fill="#1c1f24"/>` +
      `<path d="M${x0} ${wy}H${x1}V200H${x0}Z" fill="url(#${u}-wt)"/><path d="M${x0} ${wy}H${x1}" stroke="#cfefff" stroke-opacity=".6"/>` +
      (o.on ? [0, 1.1].map((d) => `<ellipse class="${P}rip" style="animation-delay:-${d}s" cx="${c}" cy="${wy}" rx="${n1((x1 - x0) * .22)}" ry="2" fill="none" stroke="#e8f8ff" stroke-width=".8"/>`).join("") : "") + `</g>` +
      `<path d="M${x0 - 4} 112V198M${x1 + 4} 112V198" stroke="#3a3f46" stroke-width="2"/>`;
    return { s, wy };
  }
  const subPump = (o, cx, by, plain) => { const u = o.uid;
    return `<path d="M${cx - 20} ${by}V${by - 32}Q${cx - 20} ${by - 42} ${cx - 10} ${by - 42}H${cx + 10}Q${cx + 20} ${by - 42} ${cx + 20} ${by - 32}V${by}Z" fill="url(#${u}-c)"/>` +
      `<path d="M${cx - 22} ${by - 6}H${cx + 22}V${by + 2}H${cx - 22}Z" fill="url(#${u}-sd)"/>` +
      [0, 1, 2, 3].map((i) => `<rect x="${cx - 17 + i * 9}" y="${by - 11}" width="5" height="3" rx="1" fill="#000" opacity=".6"/>`).join("") +
      `<path d="M${cx - 14} ${by - 36}Q${cx} ${by - 40} ${cx + 14} ${by - 36}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>` +
      (o.on && !plain ? bubbles(o, [[cx - 12, by - 16], [cx + 6, by - 22], [cx - 4, by - 10], [cx + 12, by - 14]]) : ""); };
  const tfloat = (o, x, wy) => `<g class="${o.on ? P + "bob" : ""}"><path d="${rr(x - 6, wy - 9, 12, 14, 4)}" fill="#e8eaec"/><path d="${rr(x - 6, wy - 9, 12, 14, 4)}" fill="url(#${o.uid}-fx)"/></g>` +
    `<path d="M${x} ${wy + 5}Q${x - 4} ${wy + 20} ${x - 18} ${Math.min(196, wy + 30)}" fill="none" stroke="#111" stroke-width="1.6"/>`;
  const check = (x, y) => band(x, y, 16, 18, ["#3a3f46", "#22252a", "#6c737b"]) + `<path d="M${x - 4} ${y - 5}H${x + 4}V${y + 5}H${x - 4}Z" fill="#9fd4ef" fill-opacity=".35"/><path d="M${x - 4} ${y}L${x + 4} ${y - 3}" stroke="#ddd" stroke-width="1"/>`;
  const pct = (o) => String(Math.round(o.level * 100));

  const ic = (id, name, colors, label, render) => ({ id, name, colors, picker: true, colorLabel: label, render });

  const icons = [
    ic("ball", "Valve actuator", ["#2b2f36", "#eceef0", "#2f6db5", "#c7372f", "#8a949e"], "Body", (o) => { const u = o.uid, pd = "M-4 132H164Q178 132 178 118V-4";
      const lever = o.on ? `<path d="M96 110H138" stroke="#c9332c" stroke-width="6" stroke-linecap="round"/><path d="M98 108.5H136" stroke="#ff8a7a" stroke-opacity=".6" stroke-width="1.5" stroke-linecap="round"/>`
        : `<path d="M96 110L112 128" stroke="#7a1c18" stroke-width="7.5" stroke-linecap="round"/><path d="M96 110L112 128" stroke="#c9332c" stroke-width="6" stroke-linecap="round"/><path d="M97 108.5L111 125" stroke="#ff8a7a" stroke-opacity=".6" stroke-width="1.5" stroke-linecap="round"/>`;
      return svg(o, room(o, 176, "block") + sh(o, 100, 182, 80, 4) +
        `<g class="hda-bg"><path d="M0 142H200" stroke="#000" stroke-opacity=".18" stroke-width="10"/></g>` + tube(pd, 14, CU) + flow(o, pd, 3) +
        band(30, 132, 7, 17, CU) + band(164, 132, 7, 17, CU) + `<rect x="40" y="122" width="5" height="20" rx="1" fill="#8b929a"/><rect x="150" y="122" width="5" height="20" rx="1" fill="#8b929a"/>` +
        ballValve(o, 96, 132, 1.05) + `<rect x="91" y="104" width="10" height="14" fill="url(#${u}-mt)"/>` + lever +
        `<path d="M66 102H126L122 108H70Z" fill="url(#${u}-mt)"/>` +
        `<path d="M62 50L70 42H130L126 50Z" fill="url(#${u}-tp)"/><path d="M126 50L130 42V94L126 102Z" fill="url(#${u}-sd)"/>` +
        face(o, rr(62, 50, 64, 52, 6)) + `<path d="M62 64H126" stroke="#000" stroke-opacity=".25"/><path d="M62 65H126" stroke="#fff" stroke-opacity=".12"/>` +
        `<circle cx="94" cy="83" r="13" fill="#15181d"/><circle cx="94" cy="83" r="11" fill="url(#${u}-bk)"/>` +
        `<path d="M${o.on ? "84 83H104" : "94 73V93"}" stroke="${o.on ? GREEN : RED}" stroke-width="4" stroke-linecap="round"/>` +
        `<circle cx="94" cy="83" r="13" fill="none" stroke="${o.on ? GREEN : RED}" stroke-opacity=".5" stroke-width="1.2"/>` +
        state(o, 116, 57, 1.8) + screw(68, 56) + screw(120, 96) + screw(68, 96) +
        tube("M128 76C150 76 150 30 170 20", 4, BLKP) + hl(66, 53, 108, 53, 1.5, .5)); }),

    ic("main", "Smart shutoff", ["#eceef0", "#2a2d33", "#1f6fb8", "#7a8590", "#2e6b4f"], "Body", (o) => { const u = o.uid, pd = "M100 204V30Q100 18 112 18H204", gpm = o.on ? (o.level * 7.5 + .3).toFixed(1) : "0.0";
      const ring = 2 * Math.PI * 21, frac = o.on ? .1 + .85 * o.level : 0;
      return svg(o, room(o, 180, "board") + sh(o, 100, 186, 40, 4) + tube(pd, 16, CU) + flow(o, pd, 3.2) +
        band(100, 172, 20, 7, CU) + band(100, 34, 20, 7, CU) +
        `<path d="${rr(78, 136, 44, 22, 5)}" fill="url(#${u}-bs)" stroke="#5e3f10" stroke-width=".7"/><path d="${rr(84, 140, 10, 14, 2)}" fill="#fff" opacity=".25"/>` +
        `<path d="${rr(118, 140, 14, 14, 3)}" fill="url(#${u}-bk)"/>` + state(o, 125, 147, 1.6) +
        `<path d="M70 52L76 46H128L124 52Z" fill="url(#${u}-tp)"/><path d="M124 52L128 46V128L124 134Z" fill="url(#${u}-sd)"/>` +
        face(o, rr(70, 52, 54, 82, 10)) +
        `<circle cx="97" cy="92" r="27" fill="#0d1014"/><circle cx="97" cy="92" r="25" fill="url(#${u}-lcd)"/>` +
        `<circle cx="97" cy="92" r="21" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="3"/>` +
        (frac ? `<circle cx="97" cy="92" r="21" fill="none" stroke="${CYAN}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${n1(ring * frac)} ${n1(ring)}" transform="rotate(-90 97 92)"/>` : "") +
        digits(gpm, 84, 84, 11, o.on ? CYAN : "#33454d") +
        `<g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, 1.6, 1.2)}s"><path d="M97 106l3 3-3 3-3-3z M97 109m-4 0h8" fill="none" stroke="${o.on ? CYAN : "#33454d"}" stroke-width="1"/></g>` +
        `<path d="M76 58Q96 54 118 58" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/>` +
        tube("M124 70C150 70 160 90 176 96", 3.5, BLKP) + `<path d="${rr(170, 90, 14, 20, 2)}" fill="#e6e8eb"/>` + `<rect x="173" y="96" width="8" height="3" rx="1" fill="#555"/>`); }),

    ic("gas", "Gas valve robot", ["#2b2f36", "#eceef0", "#d9a514", "#c0392b", "#6b7682"], "Body", (o) => { const u = o.uid, pd = "M-4 120H150Q160 120 160 130V204";
      const lever = o.on ? `<path d="M90 102H128" stroke="#9a7a00" stroke-width="7" stroke-linecap="round"/><path d="M90 102H128" stroke="#f2c230" stroke-width="5.4" stroke-linecap="round"/>`
        : `<path d="M90 102L90 140" stroke="#9a7a00" stroke-width="7" stroke-linecap="round"/><path d="M90 102L90 140" stroke="#f2c230" stroke-width="5.4" stroke-linecap="round"/>`;
      const chev = [0, 1, 2].map((i) => `<path class="${o.on ? P + "chase" : ""}" style="animation-delay:${i * .25}s;animation-duration:1s" d="M${30 + i * 7} 115l4 5-4 5" fill="none" stroke="${o.on ? "#1b1d22" : "#7a6a2a"}" stroke-width="1.6"/>`).join("");
      return svg(o, room(o, 172, "block") + sh(o, 160, 178, 22, 3) +
        `<rect x="0" y="108" width="6" height="24" fill="#5c6168"/>` + tube(pd, 12, IRON) +
        band(16, 120, 8, 15, IRON) + band(160, 160, 15, 8, IRON) + `<rect x="24" y="112" width="30" height="16" rx="2" fill="#f2c230"/>` + chev +
        `<path d="M70 108H112V132H70Z" fill="url(#${u}-bsv)" stroke="#5e3f10" stroke-width=".7"/><path d="M74 112H86V128H74Z" fill="#fff" opacity=".25"/>` + lever +
        `<path d="M84 96H96V108H84Z" fill="url(#${u}-mt)"/>` +
        `<path d="M66 72H120V96H66Z" fill="url(#${u}-mt)"/><path d="M66 72H120" stroke="#fff" stroke-opacity=".6"/>` +
        (o.on ? `<path d="${rr(112, 84, 8, 22, 2)}" fill="#5a6168"/><path d="${rr(110, 100, 24, 6, 2)}" fill="#4a5058"/>` : `<path d="${rr(78, 84, 8, 22, 2)}" fill="#5a6168"/><path d="${rr(82, 100, 16, 6, 2)}" fill="#4a5058"/>`) +
        `<path d="M60 40L66 34H118L114 40Z" fill="url(#${u}-tp)"/><path d="M114 40L118 34V68L114 74Z" fill="url(#${u}-sd)"/>` +
        face(o, rr(60, 40, 54, 34, 8)) + `<circle cx="87" cy="57" r="9" fill="url(#${u}-bk)"/><circle cx="87" cy="57" r="9" fill="none" stroke="#fff" stroke-opacity=".25"/>` +
        `<path d="M87 51V57L${o.on ? "93 57" : "87 63"}" stroke="#d6dadf" stroke-width="1.6" fill="none" stroke-linecap="round"/>` + state(o, 106, 47, 1.7) +
        hl(64, 43, 100, 43, 1.4, .5) + tube("M60 60C40 60 40 20 20 14", 3.5, BLKP)); }),

    ic("gastank", "Gas water heater", ["#e9eaec", "#d9cfb8", "#2f5f9e", "#8e98a2", "#2b2e33"], "Body", (o) => { const u = o.uid, ub = "M120 34V0", hot = "M80 34V0";
      return svg(o, room(o, 176, "block") + sh(o, 100, 180, 52, 5) +
        tube(hot, 8, CU) + tube(ub, 8, CU) + flow(o, hot, 2, "#ffd2b0") + band(80, 14, 11, 5, CU) + band(120, 14, 11, 5, CU) +
        `<rect x="74" y="20" width="12" height="7" rx="1" fill="#c33"/><rect x="114" y="20" width="12" height="7" rx="1" fill="#2a6dd9"/>` +
        tube("M100 30V-4", 12, GALV) + `<path d="M88 34L92 24H108L112 34Z" fill="url(#${u}-mt)"/>` +
        tank(o, 58, 34, 84, 172) +
        `<path d="M142 58H152V146" fill="none" stroke="#5e3f10" stroke-width="6"/>` + tube("M142 58H150V150", 4.5, CU) + `<rect x="140" y="53" width="8" height="10" rx="1.5" fill="url(#${u}-bsv)"/><rect x="146" y="50" width="6" height="4" fill="#c9973a"/>` +
        `<path d="${rr(72, 62, 28, 18, 1.5)}" fill="#f4eecf" opacity=".9"/><path d="M75 67H97M75 71H93M75 75H95" stroke="#555" stroke-width=".9" opacity=".6"/><rect x="72" y="62" width="28" height="3" fill="#e5a50a"/>` +
        `<path d="M10 140H66" fill="none" stroke="#08090b" stroke-width="7"/>` + tube("M-4 140H70", 6, IRON) + tube("M26 140V156", 6, IRON) +
        `<path d="${rr(68, 128, 26, 22, 3)}" fill="url(#${u}-bk)"/><circle cx="81" cy="139" r="5.5" fill="#c62828"/><circle cx="81" cy="139" r="5.5" fill="none" stroke="#fff" stroke-opacity=".3"/><path d="M78 139H84" stroke="#fff" stroke-width="1.4"/>` +
        `<path d="${rr(102, 146, 32, 20, 3)}" fill="#0b0d10" stroke="#555b62" stroke-width="1.5"/>` +
        `<clipPath id="${u}-bw"><path d="${rr(103, 147, 30, 18, 2)}"/></clipPath><g clip-path="url(#${u}-bw)">${flames(o, 118, 164, 26, 6)}</g>` +
        `<path d="M104 149L114 149" stroke="#fff" stroke-opacity=".25"/>`); }),

    ic("elec", "Electric heater", ["#eceef0", "#9aa3ad", "#2b2e33", "#d9cfb8", "#3b6e8f"], "Body", (o) => { const u = o.uid, t = Math.round(110 + 30 * o.level);
      return svg(o, room(o, 176, "board") + sh(o, 96, 180, 54, 5) +
        tube("M78 40V0", 8, CU) + tube("M116 40V0", 8, CU) + flow(o, "M78 40V0", 2, "#ffd2b0") +
        tube("M116 24H150", 7, CU) + `<path d="M150 8C164 8 172 14 172 30V56C172 64 164 68 150 68C136 68 128 64 128 56V30C128 14 136 8 150 8Z" fill="url(#${u}-mt)"/>` +
        `<path d="M128 40H172" stroke="#000" stroke-opacity=".3"/><path d="M130 36H170" stroke="#fff" stroke-opacity=".25"/>` +
        tank(o, 52, 40, 88, 172) +
        `<path d="${rr(84, 34, 18, 10, 2)}" fill="url(#${u}-mtv)"/>` + tube("M93 34C93 14 60 18 40 8", 5, ["#3c3f44", "#8d939b", "#d6dade"]) +
        [[70, 66], [70, 128]].map((p) => `<path d="${rr(p[0], p[1], 24, 22, 2)}" fill="none" stroke="#000" stroke-opacity=".3"/><path d="${rr(p[0], p[1], 24, 22, 2)}" fill="#fff" opacity=".05"/>` + screw(p[0] + 4, p[1] + 4, 1.2) + screw(p[0] + 20, p[1] + 18, 1.2)).join("") +
        `<path d="${rr(104, 92, 28, 30, 4)}" fill="url(#${u}-bk)"/>` + lcd(o, 107, 96, 22, 12, o.on ? String(t) : "---", 6.5, ORNG) +
        [0, 1, 2, 3].map((i) => led(o, 110 + i * 5.5, 116, 1.2, o.on && i < 1 + o.level * 3, ORNG, "ho")).join("") +
        heat(o, [72, 82, 92], 64) + `<path d="M106 94H128" stroke="#fff" stroke-opacity=".15"/>`); }),

    ic("tankless", "Tankless heater", ["#eceef0", "#c3c8ce", "#2b2e33", "#8a949e", "#a8463c"], "Body", (o) => { const u = o.uid, t = Math.round(105 + 35 * o.level), hot = "M118 150V200";
      return svg(o, room(o, 186, "board") +
        tube("M100 34V-4", 14, PVC) + band(100, 22, 18, 6, PVC) +
        tube("M82 150V200", 7, CU) + tube(hot, 7, CU) + flow(o, hot, 2, "#ffd2b0") + tube("M100 150V200", 7, ["#6a5500", "#e8c22a", "#fff2a8"]) +
        `<rect x="76" y="166" width="12" height="7" rx="1" fill="#2a6dd9"/><rect x="112" y="166" width="12" height="7" rx="1" fill="#c33"/><rect x="94" y="164" width="12" height="7" rx="1" fill="#e2b400"/>` +
        sh(o, 102, 150, 46, 4) +
        `<path d="M134 40L140 36V146L134 150Z" fill="url(#${u}-sd)"/>` + face(o, rr(64, 36, 72, 114, 6)) +
        `<path d="M64 128H136" stroke="#000" stroke-opacity=".22"/><path d="M64 129H136" stroke="#fff" stroke-opacity=".1"/>` +
        `<path d="${rr(78, 58, 44, 34, 5)}" fill="#0b0d10"/>` + lcd(o, 81, 61, 38, 20, o.on ? String(t) : "   ", 11, ORNG) +
        `<path d="M86 85q2 -5 4 -2q1 -4 3 -6q2 4 2 8z" fill="${o.on ? "#3d8bff" : "#2b3a40"}"/>` +
        [92, 100, 108].map((x) => `<circle cx="${x + 8}" cy="86" r="1.4" fill="#3a4148"/>`).join("") +
        `<path d="${rr(82, 100, 36, 18, 3)}" fill="#000" fill-opacity=".25"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M86 ${103 + i * 3}H114" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/>`).join("") +
        (o.on ? `<path d="${rr(82, 100, 36, 18, 3)}" fill="url(#${u}-warm)" opacity="${n1(.4 + .5 * o.level)}"/>` : "") +
        hl(70, 40, 128, 40, 1.4, .5) + screw(70, 142) + screw(130, 142)); }),

    ic("heatpump", "Heat-pump heater", ["#eceef0", "#b9bfc6", "#2c3036", "#3d6d8f", "#d9cfb8"], "Body", (o) => { const u = o.uid;
      const blades = [0, 72, 144, 216, 288].map((a) => `<path d="M100 40C106 33 112 34 112 38C112 42 106 43 100 40Z" fill="#9aa3ad" transform="rotate(${a} 100 40)"/>`).join("");
      return svg(o, room(o, 178, "block") + sh(o, 100, 182, 50, 5) +
        tube("M80 40V0", 8, CU) + tube("M120 40V0", 8, CU) + flow(o, "M80 40V0", 2, "#ffd2b0") +
        tank(o, 58, 70, 84, 174) +
        `<path d="M60 70V22Q60 12 72 12H128Q140 12 140 22V70Z" fill="url(#${u}-c)"/><path d="M60 22Q100 16 140 22" fill="none" stroke="#fff" stroke-opacity=".35"/>` +
        `<path d="M60 70H140" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>` +
        `<circle cx="100" cy="40" r="20" fill="#0e1014"/><g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, 1.3, 1)}s">${blades}<circle cx="100" cy="40" r="3" fill="#5a6168"/></g>` +
        [-14, -7, 0, 7, 14].map((d) => `<path d="M${100 + d} 21V59" stroke="#c9ced4" stroke-opacity=".55" stroke-width="1.2"/>`).join("") +
        `<circle cx="100" cy="40" r="20" fill="none" stroke="#5a6168" stroke-width="2"/>` +
        `<path d="${rr(80, 84, 40, 22, 4)}" fill="#0b0d10"/>` + lcd(o, 83, 87, 24, 16, o.on ? String(Math.round(115 + 25 * o.level)) : "---", 8, "#7ee08a") +
        led(o, 113, 91, 1.4, o.on, "#7ee08a", "hg") + led(o, 113, 99, 1.4, o.on && o.level > .6, ORNG, "ho") +
        (o.on ? [0, 1, 2].map((i) => `<path class="${P}heat" style="animation-delay:-${i * .8}s" d="M${148 + i * 8} 50q5 -2 10 0t10 0" fill="none" stroke="#bfe6ff" stroke-width="1.2"/>`).join("") : "") +
        tube("M140 160C150 160 152 176 160 186", 2.5, ["#3a3f46", "#c9ced4", "#fff"])); }),

    ic("sump", "Sump pump", ["#2b2e33", "#3c6b4a", "#e0b21a", "#2f5f9e", "#c25a1d"], "Body", (o) => { const u = o.uid, wy = n1(186 - 52 * o.level), pd = "M98 150V40Q98 30 108 30H204";
      return svg(o, `<clipPath id="${u}-pit"><path d="M50 112H150V196H50Z"/></clipPath>` + room(o, 112, "block") +
        `<g class="hda-bg"><path d="M0 112H200V200H0Z" fill="url(#${u}-soil)"/><path d="M0 112H200V120H0Z" fill="#9aa0a6" fill-opacity=".55"/><path d="M0 112H200" stroke="#fff" stroke-opacity=".2"/>` +
        [[20, 150], [170, 140], [30, 182], [176, 176], [14, 130]].map((p) => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="4" ry="2.5" fill="#7a6650" opacity=".6"/>`).join("") + `</g>` +
        `<path d="M46 112H154V198H46Z" fill="#111317"/><g clip-path="url(#${u}-pit)"><rect x="50" y="112" width="100" height="88" fill="#1c1f24"/>` +
        `<path d="M50 ${wy}H150V200H50Z" fill="url(#${u}-wt)"/>` +
        `<path d="M50 ${wy}H150" stroke="#cfefff" stroke-opacity=".6"/>` +
        (o.on ? `<ellipse class="${P}rip" cx="98" cy="${wy}" rx="22" ry="2" fill="none" stroke="#e8f8ff" stroke-width=".8"/><ellipse class="${P}rip" style="animation-delay:-1.1s" cx="98" cy="${wy}" rx="22" ry="2" fill="none" stroke="#e8f8ff" stroke-width=".8"/>` : "") +
        `<path d="M78 192V160Q78 150 88 150H108Q118 150 118 160V192Z" fill="url(#${u}-c)"/><path d="M76 186H120V194H76Z" fill="url(#${u}-sd)"/>` +
        [0, 1, 2, 3].map((i) => `<rect x="${81 + i * 9}" y="181" width="5" height="3" rx="1" fill="#000" opacity=".6"/>`).join("") +
        `<path d="M84 156Q98 152 112 156" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>` +
        bubbles(o, [[86, 176], [104, 170], [94, 182], [110, 178]]) +
        `<path d="M130 196V120" stroke="#9aa1a9" stroke-width="1.6"/><path d="M126 124H134" stroke="#9aa1a9" stroke-width="2"/>` +
        `<path d="${rr(124, +wy - 9, 12, 14, 4)}" fill="#e8eaec"/><path d="${rr(124, +wy - 9, 12, 14, 4)}" fill="url(#${u}-fx)"/></g>` +
        `<path d="M46 112V198M154 112V198" stroke="#3a3f46" stroke-width="2"/>` +
        tube(pd, 11, PVC) + flow(o, pd, 3, "#8fd3ff", 1, .7) + band(98, 82, 16, 18, ["#4a4f56", "#2a2d33", "#7c838b"]) +
        `<path d="M94 77H102V87H94Z" fill="#1c1f24"/>` + band(98, 116, 15, 6, PVC) +
        tube("M118 154C132 158 140 140 150 132", 3, BLKP) + `<path d="${rr(150, 120, 22, 16, 3)}" fill="#e6e8eb"/><rect x="154" y="125" width="14" height="5" rx="1" fill="#6a7078"/>` +
        led(o, 166, 102, 1.6, true, o.on ? GREEN : AMB, o.on ? "hg" : "ho") + `<path d="${rr(158, 94, 16, 16, 2)}" fill="none" stroke="#6a7078"/>`); }),

    ic("pedestal", "Pedestal sump", ["#2b2e33", "#3c6b4a", "#e0b21a", "#2f5f9e", "#8a949e"], "Body", (o) => { const u = o.uid, P0 = pitScene(o, 66, 134), wy = P0.wy, pd = "M110 180V36Q110 26 120 26H204";
      return svg(o, P0.s +
        `<path d="M84 196V184Q84 178 92 178H108Q116 178 116 184V196Z" fill="url(#${u}-bkh)"/>` +
        `<rect x="96" y="56" width="8" height="124" fill="url(#${u}-mt)"/>` +
        `<path d="M90 186V60" stroke="#c9ced4" stroke-width="1.4"/><circle cx="90" cy="96" r="2" fill="#c9ced4"/><circle cx="90" cy="150" r="2" fill="#c9ced4"/>` +
        `<g class="${o.on ? P + "bob" : ""}">${`<path d="${rr(84, wy - 6, 12, 10, 4)}" fill="#e8eaec"/><path d="${rr(84, wy - 6, 12, 10, 4)}" fill="url(#${u}-fx)"/>`}</g>` +
        tube(pd, 9, PVC) + flow(o, pd, 2.4, "#8fd3ff", 1, .7) + check(110, 84) +
        `<g class="${o.on ? P + "hum" : ""}"><path d="${rr(78, 20, 44, 38, 8)}" fill="url(#${u}-c)"/><path d="${rr(78, 20, 44, 38, 8)}" fill="url(#${u}-g)" opacity=".3"/>` +
        [0, 1, 2, 3].map((i) => `<path d="M80 ${28 + i * 7}H120" stroke="#000" stroke-opacity=".22"/>`).join("") +
        `<path d="${rr(84, 12, 32, 10, 3)}" fill="url(#${u}-bk)"/>` + [0, 1, 2].map((i) => `<rect x="${90 + i * 7}" y="15" width="4" height="4" rx="1" fill="#000"/>`).join("") + `</g>` +
        `<path d="${rr(64, 40, 12, 18, 2)}" fill="#c9ced4"/>` + tube("M76 48C84 48 84 52 88 52", 2, BLKP) + tube("M64 50C40 50 40 30 20 30", 3, BLKP) +
        led(o, 70, 46, 1.4, o.on, GREEN, "hg")); }),

    ic("sealed", "Sealed sump pit", ["#2f5f9e", "#2b2e33", "#3c6b4a", "#e0b21a", "#c25a1d"], "Body", (o) => { const u = o.uid, P0 = pitScene(o, 50, 150, 1), wy = P0.wy, pd = "M98 150V40Q98 30 108 30H204";
      return svg(o, P0.s + subPump(o, 98, 192) + tfloat(o, 126, wy) +
        `<path d="M44 106H156V116H44Z" fill="#cfe7f2" fill-opacity=".3"/><path d="M44 106H156" stroke="#fff" stroke-opacity=".7"/><path d="M48 108H100" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>` +
        [50, 70, 130, 150].map((x) => `<circle cx="${x}" cy="111" r="1.8" fill="url(#${u}-mt)"/>`).join("") + `<path d="M44 115.5H156" stroke="#1b1e23" stroke-width="2"/>` +
        tube(pd, 11, PVC) + flow(o, pd, 3, "#8fd3ff", 1, .7) + check(98, 74) + band(98, 104, 18, 6, BLKP) +
        tube("M140 106V40Q140 26 152 20", 7, PVC) + band(140, 96, 12, 5, BLKP) +
        tube("M118 160C134 140 156 128 166 104", 2.6, BLKP) + `<path d="${rr(158, 88, 18, 14, 2)}" fill="#e6e8eb"/>` + state(o, 167, 95, 1.5)); }),

    ic("backup", "Backup sump", ["#2b2e33", "#3c6b4a", "#2f5f9e", "#e0b21a", "#8a949e"], "Body", (o) => { const u = o.uid, P0 = pitScene(o, 34, 128), wy = P0.wy, a = "M66 152V58", b = "M104 132V70Q104 58 92 58H66", m = "M66 58V34Q66 24 76 24H204";
      return svg(o, P0.s + subPump(o, 66, 192) + `<rect x="88" y="150" width="34" height="4" fill="#9aa1a9"/>` +
        `<g transform="translate(104 0) scale(.75 1) translate(-104 0)">${subPump(o, 104, 150, 1)}</g>` + tfloat(o, 50, wy) +
        tube(a, 9, PVC) + tube(b, 8, PVC) + tube(m, 10, PVC) + flow(o, a + "M66 58V34Q66 24 76 24H204", 2.6, "#8fd3ff", 1, .7) + check(66, 86) + check(104, 100) +
        `<path d="${rr(142, 120, 48, 40, 4)}" fill="#1f5fa8"/><path d="${rr(142, 120, 48, 40, 4)}" fill="url(#${u}-fx)"/><path d="M142 128H190" stroke="#000" stroke-opacity=".3"/>` +
        `<rect x="150" y="114" width="7" height="6" fill="#c33"/><rect x="175" y="114" width="7" height="6" fill="#222"/>` +
        `<path d="${rr(146, 72, 40, 30, 4)}" fill="url(#${u}-bk)"/>` + lcd(o, 150, 76, 32, 12, o.on ? pct(o) : "100", 7, GREEN) +
        led(o, 154, 96, 1.5, true, GREEN, "hg") + `<g class="${o.on ? P + "blink" : ""}">${led(o, 162, 96, 1.5, o.on, AMB, "ho")}</g>` +
        tube("M166 102V114", 2.6, BLKP) + tube("M146 92C124 92 120 110 112 128", 2.4, BLKP)); }),

    ic("waterpow", "Water backup sump", ["#c9973a", "#2b2e33", "#8a949e", "#2f5f9e", "#eceef0"], "Body", (o) => { const u = o.uid, P0 = pitScene(o, 50, 150), wy = P0.wy, sup = "M-4 46H60Q72 46 72 58V150", dis = "M112 160V40Q112 30 122 30H204";
      return svg(o, P0.s + tube(sup, 9, CU) + flow(o, sup, 2.4, "#bfeaff") + ballValve(o, 30, 46, .7) +
        `<path d="${rr(62, 150, 60, 30, 6)}" fill="url(#${u}-c)"/><path d="${rr(62, 150, 60, 30, 6)}" fill="url(#${u}-g)" opacity=".3"/><path d="M66 158H118" stroke="#000" stroke-opacity=".25"/>` +
        `<path d="M76 180V192H108V180" fill="url(#${u}-bkh)"/>` + tfloat(o, 134, wy) +
        tube(dis, 10, PVC) + flow(o, dis, 2.8, "#8fd3ff", 1, .7) + check(112, 80) +
        `<path d="${rr(60, 62, 24, 16, 3)}" fill="url(#${u}-bsv)" stroke="#5e3f10" stroke-width=".7"/><path d="M72 62V54" stroke="#333" stroke-width="3"/>` +
        `<path d="M84 70H96" stroke="#9aa1a9" stroke-width="2"/>` + led(o, 92, 64, 1.4, o.on, CYAN, "hb")); }),

    ic("alarm", "High-water alarm", ["#eceef0", "#2b2e33", "#e0b21a", "#c7372f", "#8a949e"], "Body", (o) => { const u = o.uid, P0 = pitScene(o, 50, 150), wy = P0.wy, hi = o.level > .7, fx = 112;
      const flash = o.on && hi;
      return svg(o, P0.s + subPump(o, 80, 192) + tube("M80 150V40Q80 30 90 30H204", 9, PVC) + check(80, 80) +
        `<path d="${rr(126, 44, 24, 30, 3)}" fill="#f2f2ee"/>` + screw(138, 70, 1.3) +
        (flash ? `<circle cx="140" cy="58" r="40" fill="url(#${u}-hr)" class="${P}blink"/>` : "") +
        `<path d="${rr(128, 40, 32, 34, 6)}" fill="url(#${u}-v)"/><path d="${rr(128, 40, 32, 34, 6)}" fill="url(#${u}-fx)"/>` +
        `<circle cx="144" cy="54" r="8" fill="url(#${u}-bk)"/>` + [0, 1, 2].map((i) => `<path d="M140 ${51 + i * 3}H148" stroke="#000" stroke-width="1"/>`).join("") +
        `<g class="${flash ? P + "blink" : ""}">${led(o, 144, 67, 2, true, flash ? RED : GREEN, flash ? "hr" : "hg")}</g>` +
        (flash ? [0, 1].map((i) => `<path class="${P}blink" d="M${164 + i * 6} ${46 - i * 2}q6 8 0 16" fill="none" stroke="${RED}" stroke-width="1.6" stroke-linecap="round"/>`).join("") : "") +
        tube(`M140 74C140 96 ${fx} 96 ${fx} ${n1(Math.min(wy, 176) - 12)}`, 2.4, BLKP) +
        `<g class="${o.on ? P + "bob" : ""}"><path d="${rr(fx - 7, Math.min(wy, 176) - 12, 14, 18, 6)}" fill="#e0b21a"/><path d="${rr(fx - 7, Math.min(wy, 176) - 12, 14, 18, 6)}" fill="url(#${u}-fx)"/></g>` +
        `<path d="M50 ${n1(186 - 52 * .7)}H150" stroke="${RED}" stroke-opacity=".55" stroke-dasharray="4 3"/>`); }),

    ic("well", "Well pump & tank", ["#2f6db5", "#9aa3ad", "#eceef0", "#2b2e33", "#c9b48a"], "Body", (o) => { const u = o.uid, pd = "M104 150H130V128H170";
      const fan = [0, 90, 180, 270].map((a) => `<path d="M178 122L184 117L186 121Z" fill="#aab2ba" transform="rotate(${a} 180 122)"/>`).join("");
      return svg(o, room(o, 176, "block") + sh(o, 72, 180, 40, 5) + sh(o, 156, 168, 34, 4) +
        tank(o, 36, 46, 68, 168) + `<path d="M40 168H100L96 178H44Z" fill="url(#${u}-sd)"/><path d="M36 64H104" stroke="#000" stroke-opacity=".18"/>` +
        tube("M104 150H124", 9, GALV) + tube("M114 150V112", 7, GALV) + band(114, 150, 10, 12, GALV) +
        gauge(o, 114, 102, 8, o.on ? .25 + .5 * o.level : .55) +
        `<path d="${rr(120, 132, 18, 16, 2)}" fill="#9aa1a9"/><path d="${rr(120, 132, 18, 16, 2)}" fill="url(#${u}-fx)"/>` +
        tube("M130 150V160H200", 9, PVC) + flow(o, "M130 160H200", 2.6, "#8fd3ff") +
        `<path d="M140 166V152H172V166Z" fill="#4a4f56"/>` +
        `<path d="${rr(132, 112, 26, 30, 6)}" fill="url(#${u}-bk)"/><path d="M158 114H180V140H158Z" fill="url(#${u}-mtv)"/><path d="M158 114H180V140H158Z" fill="url(#${u}-fx)"/>` +
        [0, 1, 2, 3, 4].map((i) => `<path d="M160 ${118 + i * 5}H178" stroke="#000" stroke-opacity=".2"/>`).join("") +
        `<circle cx="180" cy="127" r="8" fill="#1b1e23"/><g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, .8, .6)}s">${fan.replace(/122/g, "127").replace(/117/g, "122").replace(/121Z/g, "126Z")}</g>` +
        `<path d="M144 112V100H152V112" fill="#6a7078"/>` + tube("M148 100C148 80 170 70 196 70", 3, BLKP) +
        led(o, 129, 140, 1.4, o.on, GREEN, "hg") + hl(42, 60, 42, 150, 2, .2)); }),

    ic("softener", "Water softener", ["#2b2e33", "#2f5f9e", "#e3dac6", "#8a949e", "#eceef0"], "Body", (o) => { const u = o.uid, bt = "M78 50C78 40 110 30 136 88";
      return svg(o, room(o, 178, "block") + sh(o, 70, 182, 34, 4) + sh(o, 142, 182, 38, 4) +
        tube("M62 36V-4", 8, CU) + tube("M88 36V-4", 8, CU) + flow(o, "M62 36V-4", 2) + flow(o, "M88 -4V36", 2) +
        tank(o, 46, 62, 56, 178) +
        `<path d="${rr(44, 30, 60, 34, 7)}" fill="url(#${u}-bk)"/><path d="M48 33H100" stroke="#fff" stroke-opacity=".3"/>` +
        lcd(o, 54, 38, 30, 14, o.on ? (o.level * 9.9).toFixed(1) : "12", 8, CYAN) + led(o, 92, 45, 1.5, o.on, CYAN, "hb") +
        `<path d="M108 92Q108 84 116 84H172Q180 84 180 92V176Q180 180 176 180H112Q108 180 108 176Z" fill="url(#${u}-pvc)"/>` +
        `<path d="M108 92Q108 84 116 84H172Q180 84 180 92V176Q180 180 176 180H112Q108 180 108 176Z" fill="url(#${u}-fx)"/>` +
        `<path d="M112 ${n1(124)}H176V176H112Z" fill="#fff" opacity=".35"/><path d="M112 124Q144 118 176 124" fill="none" stroke="#8a9098" stroke-opacity=".5"/>` + [[118, 126], [132, 122], [150, 128], [166, 124], [126, 140], [158, 142]].map((p) => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="5" ry="2.5" fill="#fff" opacity=".18"/>`).join("") +
        `<path d="M106 82H182V90H106Z" fill="${H().shade(o.color, pal(o.color).lt ? -.1 : .1)}"/><path d="M106 82H182" stroke="#fff" stroke-opacity=".35"/>` +
        tube(bt, 3, ["#666", "#e8eaec", "#fff"]) + flow(o, bt, 1.4, "#7dd3fc", 1.6, .8) +
        tube("M100 56C112 56 112 120 104 196", 2.4, BLKP) + hl(52, 80, 52, 168, 2.4, .25)); }),

    ic("filter", "Whole-house filter", ["#5fb2e6", "#dfe8ee", "#eceef0", "#2b2e33", "#7cc5b8"], "Housing", (o) => { const u = o.uid, H_ = H(), clr = o.color;
      const housing = (x) => { const d = `M${x - 16} 72V146Q${x - 16} 160 ${x} 160Q${x + 16} 160 ${x + 16} 146V72Z`;
        return `<path d="${rr(x - 8, 78, 16, 76, 4)}" fill="#f4ecd8"/><path d="${rr(x - 8, 78, 16, 76, 4)}" fill="url(#${u}-plt)"/><rect x="${x - 3}" y="78" width="6" height="76" fill="#d8c7a2" opacity=".5"/>` +
          `<path d="${d}" fill="${clr}" fill-opacity=".45"/><path d="${d}" fill="url(#${u}-fx)"/><path d="M${x - 11} 78V144" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/>` +
          `<path d="${d}" fill="none" stroke="${H_.shade(clr, -.4)}" stroke-opacity=".7"/>` + bubbles(o, [[x - 4, 150], [x + 5, 146], [x, 140], [x - 6, 132]], "#ffffff") +
          `<path d="${rr(x - 19, 62, 38, 12, 3)}" fill="${clr}"/><path d="${rr(x - 19, 62, 38, 12, 3)}" fill="url(#${u}-v)"/><path d="M${x - 17} 64H${x + 17}" stroke="#fff" stroke-opacity=".4"/>`; };
      return svg(o, room(o, 180, "board") + sh(o, 100, 186, 60, 4) +
        tube("M-4 50H204", 12, CU) + flow(o, "M-4 50H204", 3) + band(20, 50, 7, 16, CU) + band(180, 50, 7, 16, CU) +
        `<path d="${rr(54, 40, 92, 24, 4)}" fill="url(#${u}-mtv)"/><path d="${rr(54, 40, 92, 24, 4)}" fill="url(#${u}-fx)"/>` +
        housing(76) + housing(124) + gauge(o, 100, 34, 8, o.on ? .3 + .4 * o.level : .62) +
        `<path d="M96 42H104V46H96Z" fill="#8b929a"/>` + screw(60, 52) + screw(140, 52) +
        led(o, 172, 30, 1.6, true, o.on ? GREEN : "#5a636d", "hg")); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "water", tab: "Water & valves", group: "Utility", kind: "device",
    levelLabel: "Flow", onWord: "Open", offWord: "Closed",
    intro: "Sixteen valves, water heaters, pumps and sumps in the utility room. Open = valve handles line up with the pipe, the LED goes green and water moves through the pipes; gas heaters show a blue flame and sump pumps push water up through the check valve while the float rides the pit. The slider sets the flow (on sumps: the pit water level).",
    
    css, icons,
  });
})();
