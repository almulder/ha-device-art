(function () {
  const P = "hda-sprinklers-";
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
.hda-sprinklers-flow{stroke-dashoffset:0}
.hda-anim .hda-sprinklers-flow{animation:hda-sprinklers-flow 1s linear infinite}
@keyframes hda-sprinklers-flow{to{stroke-dashoffset:-18}}
.hda-sprinklers-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-sprinklers-flk{animation:hda-sprinklers-flk .5s ease-in-out infinite alternate}
@keyframes hda-sprinklers-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-sprinklers-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-sprinklers-spin{animation:hda-sprinklers-spin 1s linear infinite}
@keyframes hda-sprinklers-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-sprinklers-blink{animation:hda-sprinklers-blink 1.2s steps(1,end) infinite}
@keyframes hda-sprinklers-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-sprinklers-chase{opacity:.18}
.hda-anim .hda-sprinklers-chase{animation:hda-sprinklers-chase 4s linear infinite}
@keyframes hda-sprinklers-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-sprinklers-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-sprinklers-bub{animation:hda-sprinklers-bub 2s ease-in infinite}
@keyframes hda-sprinklers-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-sprinklers-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-sprinklers-rip{animation:hda-sprinklers-rip 2.2s ease-out infinite}
@keyframes hda-sprinklers-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-sprinklers-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-sprinklers-mist{animation:hda-sprinklers-mist 1.6s ease-in-out infinite}
@keyframes hda-sprinklers-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-sprinklers-heat{opacity:0}
.hda-anim .hda-sprinklers-heat{animation:hda-sprinklers-heat 2.6s ease-out infinite}
.hda-anim .hda-sprinklers-hum{animation:hda-sprinklers-hum .16s linear infinite}
@keyframes hda-sprinklers-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-sprinklers-bob{animation:hda-sprinklers-bob 1.6s ease-in-out infinite}
@keyframes hda-sprinklers-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-sprinklers-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-sprinklers-heat.hda-sprinklers-still{opacity:.4}
.hda-anim .hda-sprinklers-heat.hda-sprinklers-still{opacity:0}
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

  const css2 = css + `
.hda-sprinklers-sx{transform-origin:0 0}
.hda-anim .hda-sprinklers-sx{animation:hda-sprinklers-sx 5s ease-in-out infinite alternate}
@keyframes hda-sprinklers-sx{0%{transform:scale(1,1)}100%{transform:scale(-1,1)}}
.hda-anim .hda-sprinklers-tick{animation:hda-sprinklers-sx 6s steps(14,end) infinite alternate}
.hda-sprinklers-arm{transform-box:fill-box;transform-origin:0% 50%}
.hda-anim .hda-sprinklers-arm{animation:hda-sprinklers-arm .43s ease-in-out infinite}
@keyframes hda-sprinklers-arm{0%,100%{transform:rotate(0deg)}40%{transform:rotate(-24deg)}}
.hda-sprinklers-rock{transform-origin:0 0}
.hda-anim .hda-sprinklers-rock{animation:hda-sprinklers-rock 4s ease-in-out infinite alternate}
@keyframes hda-sprinklers-rock{0%{transform:skewX(-28deg)}100%{transform:skewX(28deg)}}
.hda-sprinklers-drop{opacity:.85}
.hda-anim .hda-sprinklers-drop{animation:hda-sprinklers-drop 1.6s ease-in infinite}
@keyframes hda-sprinklers-drop{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,12px);opacity:0}}
.hda-anim .hda-sprinklers-rain{animation:hda-sprinklers-rain .7s linear infinite}
@keyframes hda-sprinklers-rain{0%{transform:translate(0,-14px)}100%{transform:translate(-3px,14px)}}
`;
  const lawn = (o, gy) => `<g class="hda-bg">${lawn0(o, gy)}</g>`;
  const lawn0 = (o, gy) => { const u = o.uid;
    return `<rect width="200" height="${gy}" fill="url(#${u}-sky)"/><path d="M0 ${gy - 26}Q20 ${gy - 44} 40 ${gy - 30}Q60 ${gy - 48} 84 ${gy - 32}Q104 ${gy - 46} 128 ${gy - 32}Q150 ${gy - 46} 170 ${gy - 32}Q186 ${gy - 42} 200 ${gy - 32}V${gy + 4}H0Z" fill="url(#${u}-hedge)"/>` +
      `<path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-grass)"/><path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-bld)"/><path d="M0 ${gy}H200V200H0Z" fill="url(#${u}-bld)" transform="translate(4 3)"/>`; };
  const stream = (o, dx, h, drop, w) => { const d = `M0 0Q${n1(dx * .45)} ${n1(-h)} ${dx} ${drop}`;
    return `<path d="${d}" fill="none" stroke="#dff4ff" stroke-opacity=".25" stroke-width="${(w || 1.6) * 2}"/><path class="${P}flow" style="animation-duration:${dur(o, .9, .5)}s" d="${d}" fill="none" stroke="#eef9ff" stroke-width="${w || 1.6}" stroke-linecap="round" stroke-dasharray="2 4"/>`; };
  const ring = (o, cx, cy, r, n, act, w) => { let s = "";
    for (let i = 0; i < n; i++) { const a0 = (i * 360 / n - 90 + 5) * Math.PI / 180, a1 = ((i + 1) * 360 / n - 90 - 5) * Math.PI / 180;
      const d = `M${n1(cx + Math.cos(a0) * r)} ${n1(cy + Math.sin(a0) * r)}A${r} ${r} 0 0 1 ${n1(cx + Math.cos(a1) * r)} ${n1(cy + Math.sin(a1) * r)}`;
      const lit = ZA ? ZA.indexOf(i) >= 0 : o.on && (o.anim || i === act);
      s += `<path d="${d}" fill="none" stroke="#2a3038" stroke-width="${w || 4}" stroke-linecap="round"/>` +
        (lit ? `<path${o.anim ? ` class="${P}chase" style="animation-delay:${n1(i * 4 / n)}s"` : ""} d="${d}" fill="none" stroke="${CYAN}" stroke-width="${w || 4}" stroke-linecap="round"/>` : ""); }
    return s; };
  // (parts) ZA = the running zones (0-based) while a Multi-Function Image renders, null otherwise (today's look)
  let ZA = null;
  const zon = (o, i, z) => (ZA ? ZA.indexOf(i) >= 0 : o.on && i === z - 1);
  const zone = (o, n) => (ZA ? 1 + Math.min(n - 1, ZA.length ? ZA[0] : 0) : 1 + Math.min(n - 1, Math.floor(o.level * n)));
  const zleds = (o, x, y, n, gap, r, col) => { let s = "", z = zone(o, n);
    for (let i = 0; i < n; i++) s += o.on && o.anim ? `<g class="${P}chase" style="animation-delay:${n1(i * 4 / n)}s">${led(o, x + i * gap, y, r, true, col || GREEN, "hg")}</g>` : led(o, x + i * gap, y, r, zon(o, i, z), col || GREEN, "hg");
    return s; };
  const spigot = (o, x, y) => { const u = o.uid;
    return `<circle cx="${x}" cy="${y}" r="12" fill="url(#${u}-bsv)"/><circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#5e3f10"/>` +
      tube(`M${x} ${y}H${x + 30}V${y + 10}`, 11, ["#5e3f10", "#c9973a", "#f9e09a"]) +
      `<path d="M${x + 30} ${y - 8}V${y - 20}" stroke="#5e3f10" stroke-width="3"/><ellipse cx="${x + 30}" cy="${y - 22}" rx="11" ry="3.5" fill="url(#${u}-bs)" stroke="#5e3f10" stroke-width=".7"/>`; };
  const coupling = (o, x, y, w) => `<path d="${rr(x - w / 2, y, w, 9, 2)}" fill="url(#${o.uid}-bs)" stroke="#5e3f10" stroke-width=".7"/>` + [1, 2, 3].map((i) => `<path d="M${n1(x - w / 2 + i * w / 4)} ${y + 1}V${y + 8}" stroke="#5e3f10" stroke-opacity=".5"/>`).join("");

  const ic = (id, name, colors, label, render) => ({ id, name, colors, picker: true, colorLabel: label, render });

  const icons = [
    ic("controller", "Sprinkler timer", ["#8e98a2", "#d8cfbd", "#eceef0", "#2b2e33", "#4d7a52"], "Body", (o) => { const u = o.uid, z = ZA ? zone(o, 8) : 1 + Math.floor(o.level * 7.99);
      const leds = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => o.on && o.anim
        ? `<g class="${P}chase" style="animation-delay:${n1(i * .5)}s">${led(o, 66 + i * 9.7, 114, 1.8, true, GREEN, "hg")}</g>`
        : led(o, 66 + i * 9.7, 114, 1.8, zon(o, i, z), GREEN, "hg")).join("");
      return svg(o, room(o, 186, "siding") + sh(o, 100, 160, 56, 4) +
        tube("M86 156V204", 10, ["#3a3f46", "#8d939b", "#c9ced4"]) + tube("M116 156V204", 10, ["#3a3f46", "#8d939b", "#c9ced4"]) +
        ["#c33", "#2a6dd9", "#e2b400", "#2f9e4e", "#f5f5f5"].map((c, i) => `<path d="M${96 + i * 2.5} 154C${96 + i * 2.5} 170 ${80 + i * 10} 176 ${76 + i * 12} 204" stroke="${c}" stroke-width="1.6" fill="none"/>`).join("") +
        `<path d="M148 42L154 38V150L148 156Z" fill="url(#${u}-sd)"/>` + face(o, rr(52, 42, 96, 114, 8)) +
        `<path d="M52 140H148" stroke="#000" stroke-opacity=".22"/>` +
        `<path d="${rr(64, 54, 72, 40, 4)}" fill="#0c0f12"/><path d="${rr(67, 57, 66, 34, 2)}" fill="${o.on ? "url(#" + u + "-lcdg)" : "#5d6b5a"}"/>` +
        digits(o.on ? z + " " + (5 + Math.round(o.level * 25)) : "  -- ", 72, 64, 17, o.on ? "#1c2b16" : "#3e4a3c") +
        `<path d="M68 58H120" stroke="#fff" stroke-opacity=".25"/>` + leds +
        `<circle cx="100" cy="128" r="9" fill="url(#${u}-bk)"/><circle cx="100" cy="128" r="9" fill="none" stroke="#fff" stroke-opacity=".25"/><path d="M100 128L${o.on ? "106 123" : "100 120"}" stroke="#ddd" stroke-width="1.6" stroke-linecap="round"/>` +
        `<circle cx="74" cy="128" r="3.5" fill="url(#${u}-bk)"/><circle cx="126" cy="128" r="3.5" fill="url(#${u}-bk)"/>` +
        hl(58, 46, 142, 46, 1.5, .45) + screw(58, 150) + screw(142, 150)); }),

    ic("hose", "Hose timer", ["#3f8f4f", "#2f6db5", "#e8752a", "#7b858f", "#2b2e33"], "Body", (o) => { const u = o.uid, hd = "M86 140V150Q86 168 108 172Q150 178 150 186Q150 194 110 194";
      return svg(o, `<g class="hda-bg"><rect width="200" height="186" fill="url(#${u}-wall)"/><rect width="200" height="186" fill="url(#${u}-brk)"/><path d="M0 186H200V200H0Z" fill="#7d858c" fill-opacity=".45"/></g>` +
        `<ellipse cx="128" cy="190" rx="40" ry="8" fill="#000" opacity=".35"/>` +
        tube("M110 194Q70 194 70 186Q70 176 120 180Q168 184 168 190Q168 198 124 198", 9, HOSE) + tube(hd, 9, HOSE) + flow(o, hd, 2.4, "#c5f0ff") +
        `<circle cx="56" cy="44" r="13" fill="url(#${u}-bsv)"/><circle cx="56" cy="44" r="13" fill="none" stroke="#5e3f10"/>` +
        tube("M56 44H88V54", 11, ["#5e3f10", "#c9973a", "#f9e09a"]) +
        `<path d="M86 36V24" stroke="#5e3f10" stroke-width="3"/><ellipse cx="86" cy="22" rx="11" ry="3.5" fill="url(#${u}-bs)" stroke="#5e3f10" stroke-width=".7"/>` +
        `<path d="${rr(78, 52, 18, 10, 2)}" fill="url(#${u}-bs)" stroke="#5e3f10" stroke-width=".7"/>` +
        `<path d="M66 64Q66 58 74 58H98Q106 58 106 64V128Q106 136 98 136H74Q66 136 66 128Z" fill="url(#${u}-c)"/><path d="M66 64Q66 58 74 58H98Q106 58 106 64V128Q106 136 98 136H74Q66 136 66 128Z" fill="url(#${u}-g)" opacity=".3"/>` +
        `<circle cx="86" cy="90" r="13" fill="#e8eaec"/><circle cx="86" cy="90" r="13" fill="url(#${u}-dial)"/>` +
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i * 45 * Math.PI / 180; return `<circle cx="${n1(86 + Math.sin(a) * 9.5)}" cy="${n1(90 - Math.cos(a) * 9.5)}" r=".9" fill="#555"/>`; }).join("") +
        `<path d="M86 90L${o.on ? n1(86 + Math.sin(o.level * 5.5) * 8) + " " + n1(90 - Math.cos(o.level * 5.5) * 8) : "86 82"}" stroke="#333" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="${rr(76, 110, 20, 8, 3)}" fill="#1b1e23"/>` + led(o, 86, 124, 1.8, true, o.on ? CYAN : "#5a636d", "hb") +
        `<path d="${rr(78, 134, 16, 8, 1.5)}" fill="url(#${u}-bs)" stroke="#5e3f10" stroke-width=".7"/>` +
        (o.on ? `<path class="${P}flow" d="M64 200Q60 190 56 196" stroke="#bfeaff" stroke-width="1.5" stroke-dasharray="2 4" fill="none"/>` : "") +
        hl(70, 66, 70, 126, 2, .3)); }),

    ic("popup", "Pop-up spray", ["#2b2e33", "#3f7a3a", "#8a4fbf", "#8a949e", "#2f6db5"], "Body", (o) => { const u = o.uid, up = o.on ? 22 : 0, ny = 146 - up;
      const arcs = o.on ? [-88, -64, -40, 40, 64, 88].map((dx, i) => { const h = 38 + 30 * o.level - Math.abs(dx) * .15, d = `M100 ${ny}Q${100 + dx * .45} ${n1(ny - h)} ${100 + dx} ${n1(156 + Math.abs(dx) * .12)}`;
        return `<path d="${d}" fill="none" stroke="#dff4ff" stroke-opacity=".22" stroke-width="3"/><path class="${P}flow" style="animation-duration:${dur(o, .9, .5)}s;animation-delay:-${n1(i * .13)}s" d="${d}" fill="none" stroke="#e8f7ff" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1.5 4.5"/>`; }).join("") : "";
      return svg(o, `<g class="hda-bg"><rect width="200" height="96" fill="url(#${u}-sky)"/>` +
        `<path d="M0 70Q20 52 40 66Q60 48 84 64Q104 50 128 64Q150 50 170 64Q186 54 200 64V100H0Z" fill="url(#${u}-hedge)"/>` +
        `<path d="M0 96H200V200H0Z" fill="url(#${u}-grass)"/><path d="M0 96H200V200H0Z" fill="url(#${u}-bld)"/><path d="M0 96H200V200H0Z" fill="url(#${u}-bld)" transform="translate(4 3)"/></g>` +
        (o.on ? `<ellipse cx="100" cy="160" rx="96" ry="22" fill="#9fd6ff" opacity=".12"/>` : "") +
        `<ellipse cx="100" cy="148" rx="15" ry="5" fill="#0d1a0d" opacity=".7"/>` +
        (up ? `<rect x="95" y="${ny}" width="10" height="${up + 2}" fill="url(#${u}-pvc)"/><path d="M95 ${ny + 4}H105" stroke="#000" stroke-opacity=".2"/>` : "") +
        `<ellipse cx="100" cy="${ny + 1}" rx="10" ry="3.6" fill="url(#${u}-sd)"/><path d="M90 ${ny + 1}V${ny - 3}A10 3.6 0 0 0 110 ${ny - 3}V${ny + 1}" fill="url(#${u}-c)"/>` +
        `<ellipse cx="100" cy="${ny - 3}" rx="10" ry="3.6" fill="url(#${u}-tp)"/><ellipse cx="97" cy="${ny - 4}" rx="4" ry="1.2" fill="#fff" opacity=".4"/>` +
        `<path d="M86 152l3 -8M92 154l1 -9M108 154l-1 -9M114 152l-3 -8" stroke="#5aa64a" stroke-width="1.3"/>` +
        (o.on ? `<ellipse class="${P}mist" cx="100" cy="${ny - 20}" rx="70" ry="26" fill="url(#${u}-mist)"/>` : "") + arcs +
        (o.on ? [30, 58, 142, 170].map((x, i) => `<circle cx="${x}" cy="${164 + (i % 2) * 6}" r="1.2" fill="#e8f7ff" opacity=".7"/>`).join("") : "")); }),

    ic("smart", "Smart controller", ["#eceef0", "#2b2e33", "#8a949e", "#4d7a52", "#2f5f9e"], "Body", (o) => { const u = o.uid, z = zone(o, 8);
      return svg(o, room(o, 186, "") + sh(o, 102, 150, 50, 4) + tube("M100 146V204", 9, ["#3a3f46", "#c9ced4", "#fff"]) +
        `<path d="M146 50L152 46V134L146 140Z" fill="url(#${u}-sd)"/>` + face(o, rr(54, 46, 92, 94, 24)) +
        `<circle cx="100" cy="92" r="33" fill="#0d1014"/><circle cx="100" cy="92" r="33" fill="none" stroke="#fff" stroke-opacity=".15"/>` + ring(o, 100, 92, 27, 8, z - 1, 4.5) +
        digits(o.on ? String(z) : "-", 96, 84, 14, o.on ? CYAN : "#2b3a40") +
        `<path d="M62 52Q100 46 138 52" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6"/>` + led(o, 138, 132, 1.3, true, o.on ? GREEN : "#5a636d", "hg")); }),

    ic("dial", "Dial controller", ["#d8cfbd", "#8e98a2", "#eceef0", "#2b2e33", "#4d7a52"], "Body", (o) => { const u = o.uid, z = zone(o, 6), ang = o.on ? 40 + z * 26 : -60;
      let ticks = "";
      for (let i = 0; i < 12; i++) { const a = (-150 + i * 27) * Math.PI / 180; ticks += `<circle cx="${n1(100 + Math.sin(a) * 34)}" cy="${n1(112 - Math.cos(a) * 34)}" r="1.5" fill="${(ZA ? ZA.some((k) => i === Math.round((66 + k * 26 + 150) / 27)) : i === Math.round((ang + 150) / 27) && o.on) ? GREEN : "#444"}"/>`; }
      return svg(o, room(o, 186, "block") + sh(o, 100, 168, 56, 4) + tube("M84 164V204", 8, ["#3a3f46", "#8d939b", "#c9ced4"]) + tube("M116 164V204", 8, ["#3a3f46", "#8d939b", "#c9ced4"]) +
        `<path d="M152 40L158 36V158L152 164Z" fill="url(#${u}-sd)"/>` + face(o, rr(48, 40, 104, 124, 7)) +
        lcd(o, 66, 50, 68, 22, o.on ? z + " " + (5 + Math.round(o.level * 25)) : "6 00", 13, "#9fe08a") + ticks +
        `<circle cx="100" cy="112" r="26" fill="#1b1e23"/><circle cx="100" cy="112" r="24" fill="url(#${u}-bk)"/>` +
        [0, 30, 60, 90, 120, 150].map((a) => `<path d="M100 89V93" stroke="#5a6068" stroke-width="2" transform="rotate(${a} 100 112)"/><path d="M100 131V135" stroke="#5a6068" stroke-width="2" transform="rotate(${a} 100 112)"/>`).join("") +
        `<path d="M100 112V94" stroke="#e6e9ec" stroke-width="3" stroke-linecap="round" transform="rotate(${ang} 100 112)"/><circle cx="100" cy="112" r="6" fill="#30353c"/>` +
        `<path d="M86 100Q92 94 100 93" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" fill="none"/>` +
        [62, 138].map((x) => `<path d="${rr(x - 6, 146, 12, 8, 2)}" fill="url(#${u}-bk)"/>`).join("") + led(o, 100, 150, 1.6, o.on, GREEN, "hg")); }),

    ic("touch", "Touch controller", ["#2b2e33", "#eceef0", "#8a949e", "#c3c8ce", "#4a6f8f"], "Body", (o) => { const u = o.uid, z = zone(o, 8);
      let tiles = "";
      for (let i = 0; i < 8; i++) { const x = 58 + (i % 4) * 22, y = 72 + Math.floor(i / 4) * 24, on = zon(o, i, z);
        tiles += `<path d="${rr(x, y, 19, 20, 3)}" fill="${on ? CYAN : o.on ? "#1d2a33" : "#12171c"}" fill-opacity="${on ? .9 : 1}"/>` + (on ? `<path d="${rr(x - 2, y - 2, 23, 24, 4)}" fill="none" stroke="${CYAN}" stroke-opacity=".4"/>` : "") +
          `<path d="M${x + 6} ${y + 8}q3.5 -6 7 0q-3.5 6 -7 0z" fill="${on ? "#0b2a3a" : "#33424d"}"/>`; }
      return svg(o, room(o, 186, "") + sh(o, 100, 152, 58, 4) +
        `<path d="M156 46L162 42V144L156 148Z" fill="url(#${u}-sd)"/>` + face(o, rr(44, 46, 112, 102, 10)) +
        `<path d="${rr(50, 52, 100, 90, 6)}" fill="#07090c"/><path d="${rr(52, 54, 96, 86, 5)}" fill="${o.on ? "#0e1a22" : "#0a0d10"}"/>` + tiles +
        (o.on ? `<path d="M58 62H${n1(58 + 84 * o.level)}" stroke="${GREEN}" stroke-width="3" stroke-linecap="round"/><path d="M58 62H142" stroke="#fff" stroke-opacity=".1" stroke-width="3" stroke-linecap="round"/>` : "") +
        `<path d="M52 54L112 54L72 140H52Z" fill="#fff" opacity=".05"/>`); }),

    ic("outdoor", "Outdoor controller", ["#8e98a2", "#d8cfbd", "#eceef0", "#2b2e33", "#4d7a52"], "Body", (o) => { const u = o.uid, p = pal(o.color), z = zone(o, 6);
      return svg(o, room(o, 186, "brick") + sh(o, 108, 156, 50, 4) + tube("M104 150V204", 10, ["#3a3f46", "#8d939b", "#c9ced4"]) +
        `<path d="M70 40L34 30V154L70 150Z" fill="${p.d}"/><path d="M70 40L34 30V154L70 150Z" fill="url(#${u}-fx)" opacity=".6"/><path d="M66 46L40 40V146L66 144Z" fill="#000" opacity=".22"/>` +
        `<path d="M150 42L156 38V146L150 150Z" fill="url(#${u}-sd)"/>` + face(o, rr(70, 40, 80, 110, 4)) +
        `<path d="${rr(76, 46, 68, 98, 3)}" fill="#000" opacity=".35"/><path d="${rr(80, 50, 60, 52, 3)}" fill="#e3e6ea"/>` + lcd(o, 86, 56, 48, 18, o.on ? z + " " + (5 + Math.round(o.level * 25)) : "  --", 10, "#9fe08a") +
        zleds(o, 88, 84, 6, 9, 1.6) + [92, 108, 124].map((x) => `<rect x="${x - 3}" y="92" width="8" height="5" rx="1.5" fill="#3a4048"/>`).join("") +
        `<rect x="80" y="108" width="60" height="10" fill="#2f7d4f"/>` + [0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${84 + i * 8.5}" cy="113" r="1.8" fill="url(#${u}-mt)"/>`).join("") +
        ["#c33", "#2a6dd9", "#e2b400", "#2f9e4e", "#f5f5f5", "#8a4fbf"].map((c, i) => `<path d="M${85 + i * 8.5} 116C${85 + i * 8.5} 130 ${100 + i * 2} 136 ${100 + i * 2} 150" stroke="${c}" stroke-width="1.6" fill="none"/>`).join("") +
        `<path d="${rr(148, 88, 10, 14, 2)}" fill="url(#${u}-mtv)"/><path d="M151 96a3 3 0 0 1 4 0v6h-4z" fill="#333"/>`); }),

    ic("modular", "Pro controller", ["#8e98a2", "#2b2e33", "#eceef0", "#d8cfbd", "#4d7a52"], "Body", (o) => { const u = o.uid, z = zone(o, 3);
      const mods = [0, 1, 2].map((i) => { const x = 104 + i * 22, act = ZA ? ZA.some((k) => (k >> 2) === i) : o.on && (o.anim || i === z - 1);
        return `<path d="${rr(x, 62, 18, 70, 2)}" fill="url(#${u}-bk)"/><path d="M${x + 2} 64H${x + 16}" stroke="#fff" stroke-opacity=".2"/>` +
          (act ? `<g${o.anim ? ` class="${P}chase" style="animation-delay:${n1(i * 1.33)}s"` : ""}>${led(o, x + 9, 70, 1.6, true, GREEN, "hg")}</g>` : led(o, x + 9, 70, 1.6, false)) +
          [0, 1, 2, 3].map((k) => (ZA && ZA.indexOf(i * 4 + k) >= 0 ? `<circle cx="${x + 9}" cy="${84 + k * 11}" r="6" fill="url(#${u}-hg)"/><circle cx="${x + 9}" cy="${84 + k * 11}" r="3.7" fill="none" stroke="${GREEN}" stroke-width="1"/>` : "") + `<circle cx="${x + 9}" cy="${84 + k * 11}" r="2.6" fill="url(#${u}-mt)"/><path d="M${x + 7} ${84 + k * 11}H${x + 11}" stroke="#555" stroke-width=".8"/>`).join(""); }).join("");
      return svg(o, room(o, 186, "block") + sh(o, 102, 156, 74, 4) +
        ["#c33", "#2a6dd9", "#e2b400", "#2f9e4e", "#f5f5f5", "#8a4fbf", "#ff8a3c"].map((c, i) => `<path d="M${108 + i * 8} 146C${108 + i * 8} 166 ${96 + i * 4} 176 ${96 + i * 4} 204" stroke="${c}" stroke-width="1.6" fill="none"/>`).join("") +
        `<path d="M174 54L180 50V146L174 150Z" fill="url(#${u}-sd)"/>` + face(o, rr(26, 54, 148, 96, 6)) +
        `<path d="${rr(32, 58, 136, 88, 3)}" fill="#000" opacity=".28"/><path d="${rr(36, 62, 62, 70, 3)}" fill="url(#${u}-bk)"/>` +
        lcd(o, 40, 66, 54, 20, o.on ? (ZA && ZA.length ? ZA[0] + 1 : z) + " " + (5 + Math.round(o.level * 25)) : " --", 11, CYAN) +
        `<circle cx="66" cy="110" r="13" fill="#2a2e34"/><circle cx="66" cy="110" r="11" fill="url(#${u}-mtv)"/><path d="M66 110L${o.on ? "74 104" : "66 100"}" stroke="#333" stroke-width="2" stroke-linecap="round"/>` +
        `<circle cx="44" cy="124" r="2.6" fill="#3a4048"/><circle cx="88" cy="124" r="2.6" fill="#3a4048"/>` + mods + hl(30, 57, 170, 57, 1.4, .5)); }),

    ic("basic4", "4-zone timer", ["#eceef0", "#8e98a2", "#2b2e33", "#d8cfbd", "#2f5f9e"], "Body", (o) => { const u = o.uid, z = zone(o, 4);
      return svg(o, room(o, 176, "") + sh(o, 100, 146, 40, 4) +
        `<path d="${rr(150, 120, 22, 30, 3)}" fill="#f2f2ee"/><path d="${rr(154, 126, 14, 18, 2)}" fill="#2a2e34"/>` + tube("M161 135C150 160 110 160 100 140", 3, BLKP) +
        `<path d="M136 64L141 60V138L136 142Z" fill="url(#${u}-sd)"/>` + face(o, rr(64, 64, 72, 78, 6)) +
        lcd(o, 72, 72, 56, 22, o.on ? z + "-" + (5 + Math.round(o.level * 25)) : "12 00", 11, "#9fe08a") +
        zleds(o, 77, 104, 4, 15.3, 1.8) + [0, 1, 2, 3].map((i) => `<path d="${rr(71 + i * 15.3, 112, 12, 8, 2)}" fill="url(#${u}-bk)"/>`).join("") +
        `<path d="${rr(84, 126, 32, 8, 3)}" fill="#3a4048"/>` + hl(68, 67, 132, 67, 1.3, .5)); }),

    ic("hdial", "Dial hose timer", ["#3f8f4f", "#e8752a", "#2f6db5", "#e0b21a", "#7b858f"], "Body", (o) => { const u = o.uid, hd = "M86 144Q86 172 120 178Q170 184 170 200", a = o.on ? -140 + 280 * o.level : -150;
      let tk = "";
      for (let i = 0; i < 10; i++) { const b = (-140 + i * 31) * Math.PI / 180; tk += `<path d="M${n1(86 + Math.sin(b) * 17)} ${n1(104 - Math.cos(b) * 17)}L${n1(86 + Math.sin(b) * 20)} ${n1(104 - Math.cos(b) * 20)}" stroke="#333" stroke-width="1.2"/>`; }
      return svg(o, `<g class="hda-bg"><rect width="200" height="186" fill="url(#${u}-wall)"/><rect width="200" height="186" fill="url(#${u}-sid)"/><path d="M0 186H200V200H0Z" fill="url(#${u}-grass)"/></g>` +
        tube(hd, 9, HOSE) + flow(o, hd, 2.4, "#c5f0ff") + spigot(o, 56, 48) + coupling(o, 86, 56, 18) +
        `<circle cx="86" cy="104" r="34" fill="url(#${u}-c)"/><circle cx="86" cy="104" r="34" fill="url(#${u}-g)" opacity=".3"/><circle cx="86" cy="104" r="34" fill="none" stroke="#000" stroke-opacity=".3"/>` +
        `<circle cx="86" cy="104" r="23" fill="url(#${u}-dial)"/>` + tk +
        `<path d="M86 104V86" stroke="#c62828" stroke-width="5" stroke-linecap="round" transform="rotate(${n1(a)} 86 104)"/><circle cx="86" cy="104" r="7" fill="#e8eaec" stroke="#aaa"/>` +
        coupling(o, 86, 136, 18)); }),

    ic("hdual", "2-outlet timer", ["#3f8f4f", "#2f6db5", "#7b858f", "#2b2e33", "#e8752a"], "Body", (o) => { const u = o.uid, h1 = "M74 146Q70 176 30 186Q4 192 -4 200", h2 = "M102 146Q106 176 150 184Q190 190 204 200", two = ZA ? ZA.indexOf(1) >= 0 : o.level > .5;
      return svg(o, `<g class="hda-bg"><rect width="200" height="186" fill="url(#${u}-wall)"/><rect width="200" height="186" fill="url(#${u}-brk)"/><path d="M0 186H200V200H0Z" fill="#7d858c" fill-opacity=".45"/></g>` +
        tube(h1, 8, HOSE) + tube(h2, 8, ["#0f2a44", "#2a6aa8", "#9cc8ef"]) + (ZA && ZA.indexOf(0) < 0 ? "" : flow(o, h1, 2.2, "#c5f0ff")) + (two ? flow(o, h2, 2.2, "#c5f0ff") : "") +
        spigot(o, 58, 40) + coupling(o, 88, 48, 18) +
        `<path d="M60 64Q60 56 70 56H106Q116 56 116 64V128Q116 138 106 138H70Q60 138 60 128Z" fill="url(#${u}-c)"/><path d="M60 64Q60 56 70 56H106Q116 56 116 64V128Q116 138 106 138H70Q60 138 60 128Z" fill="url(#${u}-g)" opacity=".3"/>` +
        lcd(o, 66, 70, 44, 22, o.on ? String(5 + Math.round(o.level * 55)) : "--", 12, "#9fe08a") +
        led(o, 74, 102, 1.8, ZA ? ZA.indexOf(0) >= 0 : o.on, CYAN, "hb") + led(o, 102, 102, 1.8, o.on && two, CYAN, "hb") +
        `<path d="${rr(66, 110, 16, 8, 3)}" fill="#1b1e23"/><path d="${rr(94, 110, 16, 8, 3)}" fill="#1b1e23"/>` +
        coupling(o, 74, 138, 14) + coupling(o, 102, 138, 14)); }),

    ic("hhub", "Wi-Fi hose timer", ["#7b858f", "#2b2e33", "#eceef0", "#3f8f4f", "#2f6db5"], "Body", (o) => { const u = o.uid, hd = "M76 146Q76 176 110 180Q150 186 150 200";
      return svg(o, `<g class="hda-bg"><rect width="200" height="186" fill="url(#${u}-wall)"/><rect width="200" height="186" fill="url(#${u}-sid)"/><path d="M0 186H200V200H0Z" fill="url(#${u}-grass)"/></g>` +
        tube(hd, 9, HOSE) + flow(o, hd, 2.4, "#c5f0ff") + spigot(o, 46, 44) + coupling(o, 76, 52, 18) +
        `<path d="${rr(62, 62, 28, 76, 12)}" fill="url(#${u}-c)"/><path d="${rr(62, 62, 28, 76, 12)}" fill="url(#${u}-g)" opacity=".3"/>` +
        `<circle cx="76" cy="90" r="9" fill="#15181c"/>` + ring(o, 76, 90, 7, 6, 0, 2) + led(o, 76, 118, 1.6, o.on, GREEN, "hg") + coupling(o, 76, 138, 16) +
        `<path d="${rr(136, 70, 40, 54, 4)}" fill="#9aa1a9"/><path d="${rr(136, 70, 40, 54, 4)}" fill="url(#${u}-fx)"/><path d="${rr(140, 74, 32, 46, 3)}" fill="#c9ced4"/>` +
        `<path d="${rr(144, 80, 24, 32, 6)}" fill="#f4f5f6"/><path d="${rr(144, 80, 24, 32, 6)}" fill="url(#${u}-fx)"/>` + led(o, 156, 92, 1.6, true, o.on ? CYAN : "#5a636d", "hb") +
        (o.on ? [0, 1, 2].map((i) => `<path class="${P}chase" style="animation-delay:${n1(i * .4)}s;animation-duration:1.4s" d="M${n1(132 - i * 6)} ${n1(84 - i * 4)}a${12 + i * 7} ${12 + i * 7} 0 0 0 0 ${n1(16 + i * 8)}" fill="none" stroke="${CYAN}" stroke-width="1.6" stroke-linecap="round" transform="rotate(20 132 92)"/>`).join("") : "")); }),

    ic("valve", "Smart faucet valve", ["#2b2e33", "#eceef0", "#3f8f4f", "#7b858f", "#e8752a"], "Body", (o) => { const u = o.uid, hd = "M134 124Q160 130 160 160Q160 186 120 188Q80 190 60 200";
      return svg(o, lawn(o, 104) + sh(o, 96, 176, 40, 6) +
        tube("M88 190V58", 12, ["#2b2f36", "#5b636d", "#a9b1ba"]) + `<path d="${rr(78, 40, 20, 22, 4)}" fill="url(#${u}-bk)"/><path d="M98 48L120 34" stroke="#2b2f36" stroke-width="6" stroke-linecap="round"/>` +
        tube("M88 96H104", 10, ["#5e3f10", "#c9973a", "#f9e09a"]) +
        tube(hd, 9, HOSE) + flow(o, hd, 2.4, "#c5f0ff") +
        `<path d="${rr(102, 82, 34, 48, 14)}" fill="url(#${u}-c)"/><path d="${rr(102, 82, 34, 48, 14)}" fill="url(#${u}-g)" opacity=".3"/>` +
        `<circle cx="119" cy="102" r="10" fill="#15181c"/>` + ring(o, 119, 102, 7, 8, 0, 2.2) +
        `<path d="${rr(106, 118, 26, 6, 2)}" fill="#1f3b5a"/>` + [0, 1, 2, 3].map((i) => `<path d="M${109 + i * 6} 119V123" stroke="#4a7aa8" stroke-width=".8"/>`).join("") +
        coupling(o, 134, 120, 10)); }),

    ic("rotor", "Gear-drive rotor", ["#2b2e33", "#3f7a3a", "#8a4fbf", "#8a949e", "#2f6db5"], "Body", (o) => { const u = o.uid, up = o.on ? 26 : 0, ny = 150 - up, reach = 44 + 40 * o.level;
      return svg(o, lawn(o, 96) + (o.on ? `<ellipse cx="100" cy="164" rx="96" ry="20" fill="#9fd6ff" opacity=".1"/>` : "") +
        `<ellipse cx="100" cy="152" rx="14" ry="5" fill="#0d1a0d" opacity=".7"/>` +
        (up ? `<rect x="94" y="${ny}" width="12" height="${up + 2}" fill="url(#${u}-c)"/><rect x="94" y="${ny}" width="12" height="${up + 2}" fill="url(#${u}-fx)"/>` : "") +
        `<path d="M92 ${ny + 1}V${ny - 6}Q92 ${ny - 10} 100 ${ny - 10}Q108 ${ny - 10} 108 ${ny - 6}V${ny + 1}Z" fill="url(#${u}-c)"/><ellipse cx="100" cy="${ny - 9}" rx="8" ry="2.6" fill="url(#${u}-tp)"/>` +
        `<rect x="104" y="${ny - 7}" width="5" height="4" rx="1" fill="#15171a"/>` +
        (o.on ? `<g transform="translate(108 ${ny - 5})"><g class="${P}sx">${stream(o, n1(reach), n1(34 + 20 * o.level), n1(160 - ny + 12), 2.2)}<ellipse cx="${n1(reach)}" cy="${n1(160 - ny + 10)}" rx="10" ry="4" fill="url(#${u}-mist)"/></g></g>` : "") +
        `<path d="M88 156l3 -8M112 156l-3 -8" stroke="#5aa64a" stroke-width="1.3"/>`); }),

    ic("impact", "Impact sprinkler", ["#c9973a", "#8a949e", "#2b2e33", "#3f7a3a", "#c7372f"], "Body", (o) => { const u = o.uid, reach = 46 + 34 * o.level;
      return svg(o, lawn(o, 100) + sh(o, 96, 176, 26, 4) +
        `<path d="M96 178V146" stroke="#5a6168" stroke-width="5"/><path d="M84 164H108" stroke="#5a6168" stroke-width="3"/>` +
        `<g transform="translate(96 128)"><g class="${o.on ? P + "tick" : ""}" style="transform-origin:0 0">` +
        `<path d="M-6 18V4Q-6 -2 0 -2Q6 -2 6 4V18Z" fill="url(#${u}-c)"/><path d="M0 0L18 -8" stroke="${pal(o.color).m}" stroke-width="5" stroke-linecap="round"/><path d="M0 -1L18 -9" stroke="#fff" stroke-opacity=".4" stroke-width="1.2"/>` +
        `<g class="${o.on ? P + "arm" : ""}"><path d="M0 -6L22 -14L28 -10" fill="none" stroke="${pal(o.color).d}" stroke-width="2.4" stroke-linecap="round"/></g>` +
        `<path d="M-3 -6q3 -4 6 0" stroke="#999" stroke-width="1.4" fill="none"/>` +
        (o.on ? `<g transform="translate(18 -8)">${stream(o, n1(reach), 30, 52, 2)}</g>` : "") + `</g></g>` +
        (o.on ? `<ellipse class="${P}mist" cx="150" cy="168" rx="40" ry="12" fill="url(#${u}-mist)"/>` : "")); }),

    ic("osc", "Oscillating sprinkler", ["#3f8f4f", "#e0b21a", "#2f6db5", "#e8752a", "#8a949e"], "Body", (o) => { const u = o.uid, h = 50 + 40 * o.level, hd = "M156 176Q176 186 204 180";
      let fan = "";
      for (let i = 0; i < 9; i++) { const x = -40 + i * 10; fan += `<path class="${P}flow" style="animation-duration:${dur(o, .9, .5)}s;animation-delay:-${n1(i * .1)}s" d="M${x} 0Q${n1(x * 1.3)} ${n1(-h)} ${n1(x * 1.7)} ${n1(-h * .2)}" fill="none" stroke="#eef9ff" stroke-width="1.3" stroke-dasharray="2 4"/>`; }
      return svg(o, lawn(o, 92) + tube(hd, 7, HOSE) + flow(o, hd, 2, "#c5f0ff") + sh(o, 100, 176, 60, 5) +
        `<path d="M50 170L58 160H142L150 170Z" fill="url(#${u}-sd)"/><path d="M46 170H154V176H46Z" fill="url(#${u}-v)"/>` +
        `<path d="M58 160L64 150M142 160L136 150" stroke="${pal(o.color).d}" stroke-width="5"/><path d="${rr(136, 160, 22, 12, 3)}" fill="url(#${u}-v)"/>` +
        `<path d="M60 148H140" stroke="#5a6168" stroke-width="7" stroke-linecap="round"/><path d="M60 146.5H140" stroke="#d6dade" stroke-width="2" stroke-linecap="round"/>` +
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<circle cx="${62 + i * 9.5}" cy="146" r="1" fill="#15171a"/>`).join("") +
        (o.on ? `<g transform="translate(100 146)"><g class="${P}rock">${fan}</g></g><ellipse class="${P}mist" cx="100" cy="${n1(146 - h * .7)}" rx="70" ry="24" fill="url(#${u}-mist)"/>` : "")); }),

    ic("drip", "Drip emitter", ["#5b3a22", "#2b2e33", "#3f8f4f", "#7b858f", "#8a4fbf"], "Body", (o) => { const u = o.uid, dl = "M-4 150Q50 146 100 150T204 148";
      const plant = (x, s) => [[-14, -20], [-6, -28], [4, -30], [12, -22], [0, -18]].map((l, i) => `<path d="M${x} 150Q${x + l[0] * s * .5} ${n1(150 + l[1] * s * .6)} ${n1(x + l[0] * s)} ${n1(150 + l[1] * s)}" fill="none" stroke="${i % 2 ? "#3f8a3a" : "#5fae4e"}" stroke-width="${n1(4 * s)}" stroke-linecap="round"/>`).join("");
      const ems = [40, 100, 160];
      return svg(o, `<g class="hda-bg"><rect width="200" height="120" fill="url(#${u}-wall)"/><rect width="200" height="120" fill="url(#${u}-sid)"/><path d="M0 116H200V122H0Z" fill="#8a7a66"/>` +
        `<path d="M0 122H200V200H0Z" fill="#4a3424"/><path d="M0 122H200V200H0Z" fill="url(#${u}-bld)" opacity=".25"/>` +
        [[20, 170], [60, 186], [130, 176], [170, 190], [90, 132], [150, 134]].map((p) => `<path d="M${p[0]} ${p[1]}l8 -2l6 3" stroke="#7a5536" stroke-width="2" fill="none"/>`).join("") + `</g>` +
        ems.map((x) => `<ellipse cx="${x}" cy="160" rx="${n1(8 + 18 * o.level)}" ry="${n1(3 + 5 * o.level)}" fill="#1e140c" opacity="${o.on ? .75 : .3}"/>`).join("") +
        `<g class="hda-bg">` + plant(70, 1.1) + plant(130, .9) + plant(18, .8) + plant(186, .8) + `</g>` +
        tube(dl, 6, ["#1a1208", o.color, "#a88a6a"]) + flow(o, dl, 1.4, "#bfeaff") +
        ems.map((x, i) => `<path d="${rr(x - 4, 146, 8, 8, 2)}" fill="#2a2e34"/><path d="M${x} 154v3" stroke="#555" stroke-width="2"/>` +
          (o.on ? [0, 1].map((k) => `<circle class="${P}drop" style="animation-delay:-${n1(k * .8 + i * .3)}s;animation-duration:${dur(o, 2, 1.2)}s" cx="${x}" cy="158" r="1.6" fill="#bfeaff"/>`).join("") : "")).join("")); }),

    ic("vbox", "Valve box", ["#3f7a3a", "#2b2e33", "#8a4fbf", "#c9b48a", "#7b858f"], "Body", (o) => { const u = o.uid, p = pal(o.color), z = zone(o, 3);
      return svg(o, lawn(o, 60) +
        `<path d="M24 92L176 92L186 186H14Z" fill="${p.k}"/><path d="M30 98H170L178 180H22Z" fill="#6b5a48"/>` +
        [[40, 172], [60, 166], [150, 170], [168, 162], [100, 176], [130, 160]].map((q) => `<circle cx="${q[0]}" cy="${q[1]}" r="2.6" fill="#9a8a76"/>`).join("") +
        tube("M14 150H186", 9, PVC) +
        [0, 1, 2].map((i) => { const x = 52 + i * 48, act = zon(o, i, z), out = `M${x} 150V114`;
          return tube(out, 7, PVC) + (act ? flow(o, `M${x} 150V108`, 2) : "") +
            `<path d="${rr(x - 13, 126, 26, 20, 5)}" fill="#1b1e23"/><path d="${rr(x - 13, 126, 26, 20, 5)}" fill="url(#${u}-fx)"/>` +
            `<rect x="${x + 4}" y="110" width="10" height="16" rx="2" fill="#2a2e34"/><rect x="${x + 4}" y="110" width="10" height="16" rx="2" fill="url(#${u}-fx)"/>` +
            `<path d="M${x + 7} 110C${x + 6} 100 ${x + 2} 100 ${x} 96M${x + 11} 110C${x + 12} 100 ${x + 16} 102 ${x + 18} 96" stroke="${["#c33", "#2a6dd9", "#e2b400"][i]}" stroke-width="1.4" fill="none"/>` +
            `<circle cx="${x - 3}" cy="122" r="3.5" fill="#e8eaec"/>` + led(o, x + 9, 132, 1.4, act, GREEN, "hg"); }).join("") +
        `<path d="M24 92L36 40H188L176 92Z" fill="url(#${u}-v)"/><path d="M24 92L36 40H188L176 92Z" fill="url(#${u}-g)" opacity=".3"/>` +
        [0, 1, 2, 3].map((i) => `<path d="M${40 - i * 2.4} ${52 + i * 10}H${184 - i * 2.4}" stroke="#000" stroke-opacity=".2"/>`).join("") +
        `<path d="M24 92H176" stroke="#000" stroke-opacity=".4" stroke-width="2"/>`); }),

    ic("rain", "Rain sensor", ["#c9b48a", "#8a949e", "#eceef0", "#2b2e33", "#3f7a3a"], "Body", (o) => { const u = o.uid, n = Math.round(6 + 14 * o.level);
      let drops = "";
      for (let i = 0; i < n; i++) { const x = (i * 37) % 196 + 4, y = (i * 53) % 150 + 20; drops += `<path d="M${x} ${y}l-2 7" stroke="#cfeaff" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>`; }
      return svg(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-sky)"/><rect width="200" height="200" fill="#0b1422" opacity=".3"/></g>` +
        (o.on ? `<g class="${P}rain">${drops}</g>` : "") +
        `<g class="hda-bg"><path d="M0 40H200V60H0Z" fill="#5a4a3a"/><path d="M0 60H200V68H0Z" fill="#3d3127"/>` +
        `<path d="M0 66H200L196 92Q194 98 186 98H14Q6 98 4 92Z" fill="url(#${u}-mtv)"/><path d="M0 66H200" stroke="#fff" stroke-opacity=".6" stroke-width="2"/><path d="M6 90H194" stroke="#000" stroke-opacity=".2"/></g>` +
        `<path d="M96 66V108H112" fill="none" stroke="url(#${u}-mt)" stroke-width="6"/><path d="M90 62H104V74H90Z" fill="#9aa1a9"/>` +
        `<path d="${rr(108, 98, 44, 22, 6)}" fill="url(#${u}-v)"/><path d="${rr(108, 98, 44, 22, 6)}" fill="url(#${u}-fx)"/>` +
        `<path d="M120 98V84Q120 78 130 78Q140 78 140 84V98Z" fill="url(#${u}-c)"/>` + [0, 1, 2, 3].map((i) => `<path d="M122 ${84 + i * 3.5}H138" stroke="#7a5a3a" stroke-width="2"/>`).join("") +
        `<ellipse cx="130" cy="79" rx="10" ry="2.5" fill="url(#${u}-tp)"/>` + led(o, 146, 109, 1.4, o.on, CYAN, "hb") +
        tube("M152 110C176 110 170 160 190 204", 2.4, BLKP) +
        (o.on ? [0, 1].map((i) => `<ellipse class="${P}rip" style="animation-delay:-${i * 1.1}s" cx="60" cy="82" rx="10" ry="2" fill="none" stroke="#cfeaff" stroke-width=".8"/>`).join("") : "")); }),

    ic("flowsens", "Flow sensor", ["#2b2e33", "#eceef0", "#2f6db5", "#3f7a3a", "#7b858f"], "Body", (o) => { const u = o.uid, pd = "M-4 146H204";
      const pw = [0, 60, 120, 180, 240, 300].map((a) => `<path d="M100 98V88" stroke="#e8eaec" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 100 98)"/>`).join("");
      return svg(o, `<g class="hda-bg"><rect width="200" height="56" fill="url(#${u}-grass)"/><path d="M0 56H200V200H0Z" fill="url(#${u}-soil)"/><path d="M0 56H200" stroke="#2a4a20" stroke-width="3"/>` +
        [[20, 90], [170, 80], [30, 180], [178, 176], [150, 186]].map((q) => `<ellipse cx="${q[0]}" cy="${q[1]}" rx="4" ry="2.5" fill="#7a6650" opacity=".6"/>`).join("") + `</g>` +
        tube(pd, 16, PVC) + flow(o, pd, 3.2, "#8fd3ff") +
        `<path d="M76 140V124H124V140Z" fill="url(#${u}-pvc)"/><path d="${rr(72, 132, 56, 28, 4)}" fill="url(#${u}-pvc)"/>` +
        `<path d="${rr(78, 72, 44, 54, 6)}" fill="url(#${u}-c)"/><path d="${rr(78, 72, 44, 54, 6)}" fill="url(#${u}-g)" opacity=".3"/>` +
        `<circle cx="100" cy="98" r="15" fill="#0f2e44"/><circle cx="100" cy="98" r="15" fill="#9fd4ef" fill-opacity=".25"/>` +
        `<g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, 1.4, 1.1)}s">${pw}<circle cx="100" cy="98" r="2.5" fill="#9aa1a9"/></g>` +
        `<path d="M90 88Q96 84 104 85" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" fill="none"/>` +
        tube("M122 80C150 80 150 60 170 40", 3, BLKP) + led(o, 114, 118, 1.4, o.on, GREEN, "hg")); }),
  ];

  // ---------- (parts) Multi-Function: zones z1..zN (switches; the 2-outlet timer: outlets a + b) ----------
  // o.mf: o.parts holds only the ticked zones; each running zone lights its own LED / tile / ring segment / terminal and the
  // display shows the first running zone. A zone left out stays dark. A Device Image (no o.mf) is exactly today's.
  const ZN = { controller: 8, smart: 8, touch: 8, modular: 8, dial: 6, outdoor: 6, basic4: 4 };
  icons.forEach((ic) => {
    const n = ZN[ic.id], ab = ic.id === "hdual"; if (!n && !ab) return;
    const ids = ab ? ["a", "b"] : Array.from({ length: n }, (_, i) => "z" + (i + 1));
    ic.parts = ids.map((id, i) => ({ id, name: ab ? (i ? "Outlet B" : "Outlet A") : "Zone " + (i + 1), type: "switch" }));
    const R = ic.render;
    ic.render = (o) => {
      if (!o.mf) return R(o);
      const p = o.parts || {}, act = []; ids.forEach((id, i) => { if (p[id]) act.push(i); });
      ZA = act; try { return R(Object.assign({}, o, { on: act.length > 0, anim: false })); } finally { ZA = null; }
    };
  });

  (window.HDA = window.HDA || []).push({
    id: "sprinklers", tab: "Sprinklers & timers", group: "Outdoor", kind: "device",
    levelLabel: "Flow", onWord: "Watering", offWord: "Off",
    intro: "Twenty sprinkler controllers, hose timers, heads and gear. Watering = the active zone LED steps along, hose timers push water through the hose, spray heads and rotors throw water (the rotor and impact head sweep around), drip emitters drip and the flow sensor spins. The slider sets the flow: spray reach, drip size, and which zone is shown when animation is off.",
    
    css: css2, icons,
  });
})();
