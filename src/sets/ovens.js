(function () {
  const P = "hda-ovens-";
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
      if (ch === ":") { out += `<circle cx="${n1(X - t * .2)}" cy="${n1(y + s * .3)}" r="${n1(t * .5)}" fill="${col}"/><circle cx="${n1(X - t * .2)}" cy="${n1(y + s * .72)}" r="${n1(t * .5)}" fill="${col}"/>`; X += t * 1.4; return; }
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
.hda-ovens-flow{stroke-dashoffset:0}
.hda-anim .hda-ovens-flow{animation:hda-ovens-flow 1s linear infinite}
@keyframes hda-ovens-flow{to{stroke-dashoffset:-18}}
.hda-ovens-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-ovens-flk{animation:hda-ovens-flk .5s ease-in-out infinite alternate}
@keyframes hda-ovens-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-ovens-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-ovens-spin{animation:hda-ovens-spin 1s linear infinite}
@keyframes hda-ovens-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-ovens-blink{animation:hda-ovens-blink 1.2s steps(1,end) infinite}
@keyframes hda-ovens-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-ovens-chase{opacity:.18}
.hda-anim .hda-ovens-chase{animation:hda-ovens-chase 4s linear infinite}
@keyframes hda-ovens-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-ovens-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-ovens-bub{animation:hda-ovens-bub 2s ease-in infinite}
@keyframes hda-ovens-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-ovens-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-ovens-rip{animation:hda-ovens-rip 2.2s ease-out infinite}
@keyframes hda-ovens-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-ovens-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-ovens-mist{animation:hda-ovens-mist 1.6s ease-in-out infinite}
@keyframes hda-ovens-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-ovens-heat{opacity:0}
.hda-anim .hda-ovens-heat{animation:hda-ovens-heat 2.6s ease-out infinite}
.hda-anim .hda-ovens-hum{animation:hda-ovens-hum .16s linear infinite}
@keyframes hda-ovens-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-ovens-bob{animation:hda-ovens-bob 1.6s ease-in-out infinite}
@keyframes hda-ovens-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-ovens-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-ovens-heat.hda-ovens-still{opacity:.4}
.hda-anim .hda-ovens-heat.hda-ovens-still{opacity:0}
`;
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css2 = css + `
.hda-anim .hda-ovens-turn{animation:hda-ovens-turn 4s ease-in-out infinite alternate}
@keyframes hda-ovens-turn{0%{transform:translate(-8px,0)}100%{transform:translate(8px,0)}}
.hda-ovens-up{opacity:.5}
.hda-anim .hda-ovens-up{animation:hda-ovens-up 2.4s ease-in infinite}
@keyframes hda-ovens-up{0%{transform:translate(0,10px);opacity:0}30%{opacity:.8}100%{transform:translate(0,-12px);opacity:0}}
.hda-ovens-stm{opacity:.4;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-ovens-stm{animation:hda-ovens-stm 3.2s ease-out infinite}
@keyframes hda-ovens-stm{0%{transform:translate(0,4px) scale(.5);opacity:0}25%{opacity:.8}100%{transform:translate(3px,-20px) scale(1.5);opacity:0}}
.hda-anim .hda-ovens-glow{animation:hda-ovens-glow 3s ease-in-out infinite}
@keyframes hda-ovens-glow{50%{opacity:.8}}
`;
  const SS = "#c4c9ce", BSS = "#4e5156", WH = "#eef0f1", BK = "#232529", MWH = "#efece4", MBK = "#2e2e30", SL = "#6f716c", FPS = "#b9bec4";
  const metal = (o) => { const c = String(o.color).toLowerCase(); return c === SS || c === BSS || c === FPS ? 1 : 0; };
  const sub = (o, v) => Object.assign({}, o, { on: !!v });
  // (parts) o.mf = a Multi-Function Image: o.parts holds only the ticked parts, a part left out is off (a Device Image: o.on, as today)
  const part = (o, id) => sub(o, o.parts && o.parts[id] != null ? o.parts[id] : o.mf ? false : o.on);
  const L = (o, k) => n1((o.on ? .35 + .65 * o.level : 0) * (k == null ? 1 : k));

  function oextra(o) {
    const u = o.uid;
    return `<pattern id="${u}-brs" width="41" height="2.2" patternUnits="userSpaceOnUse"><path d="M0 .5H15M19 .5H41" stroke="#fff" stroke-opacity="${String(o.color).toLowerCase() === BSS ? ".07" : ".2"}" stroke-width=".35"/><path d="M5 1.6H28M31 1.6H38" stroke="#000" stroke-opacity=".1" stroke-width=".35"/></pattern>` +
      lg(u + "-gls", 1, [[0, "#2a2e35"], [.5, "#101216"], [1, "#050608"]]) + lg(u + "-wd", 1, [[0, "#8a6440"], [1, "#5a3e24"]]) +
      lg(u + "-cab", 1, [[0, "#5d6874"], [1, "#46505b"]]) + lg(u + "-ct", 1, [[0, "#e8e4dc"], [1, "#b9b3a8"]]) +
      lg(u + "-bz", 0, [[0, "#6b4a26"], [.4, "#d9a86a"], [.6, "#b07c44"], [1, "#5a3c1c"]]) + lg(u + "-tb", 0, [[0, "#5a6067"], [.4, "#f4f6f8"], [.65, "#b9bfc6"], [1, "#4a5056"]]) +
      lg(u + "-tbv", 1, [[0, "#f4f6f8"], [.5, "#a9b0b8"], [1, "#4a5056"]]) +
      rg(u + "-mwg", [[0, "#fff4c8", .95], [.6, "#ffd36a", .7], [1, "#c98a20", .5]], 'cx=".5" cy=".6" r=".7"') +
      rg(u + "-ovg", [[0, "#ffd08a"], [.55, "#ff8a3a", .85], [1, "#a8401a", .7]], 'cx=".5" cy=".55" r=".75"') +
      lg(u + "-cone", 1, [[0, "#fff1d0", .55], [1, "#fff1d0", 0]]) + rg(u + "-pool", [[0, "#fff1d0", .45], [1, "#fff1d0", 0]]) +
      rg(u + "-stm", [[0, "#fff", .6], [.6, "#fff", .2], [1, "#fff", 0]]) +
      `<pattern id="${u}-sub" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="20" height="10" fill="#fff" fill-opacity=".08"/><path d="M0 .5H20M0 5.5H20M10.5 .5V5.5M.5 5.5V10.5" stroke="#000" stroke-opacity=".28" fill="none"/></pattern>` +
      `<pattern id="${u}-msh" width="2.6" height="2.6" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r=".6" fill="#000" fill-opacity=".55"/></pattern>` +
      `<pattern id="${u}-sl" width="4" height="10" patternUnits="userSpaceOnUse"><rect x=".8" width="2.2" height="10" fill="#000" fill-opacity=".7"/></pattern>`;
  }
  const svgO = (o, body, extra) => svg(o, body, oextra(o) + (extra || ""));
  const fin = (o, d) => `<path d="${d}" fill="url(#${o.uid}-v)"/>` + (metal(o) ? `<path d="${d}" fill="url(#${o.uid}-brs)"/>` : `<path d="${d}" fill="url(#${o.uid}-g)" opacity=".22"/>`) + `<path d="${d}" fill="url(#${o.uid}-fx)"/>`;
  const glass = (o, d) => `<path d="${d}" fill="url(#${o.uid}-gls)"/>`;
  function hbar(o, x1, x2, y, kind) {
    const u = o.uid, g = kind === "bz" ? "bz" : "tbv";
    let s = `<rect x="${x1 + 4}" y="${y - 3}" width="3" height="5" fill="#2a2e34"/><rect x="${x2 - 7}" y="${y - 3}" width="3" height="5" fill="#2a2e34"/>` +
      `<rect x="${x1}" y="${y - 5}" width="${x2 - x1}" height="4" rx="2" fill="url(#${u}-${g})"/><path d="M${x1 + 2} ${y - 4.2}H${x2 - 2}" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/>`;
    if (kind === "ka") s += `<rect x="${x1 - 2}" y="${y - 6}" width="5" height="6" rx="1.4" fill="url(#${u}-tbv)"/><rect x="${x2 - 3}" y="${y - 6}" width="5" height="6" rx="1.4" fill="url(#${u}-tbv)"/>`;
    return s;
  }
  const vbar = (o, x, y1, y2) => `<rect x="${x - 2}" y="${y1 + 4}" width="5" height="3" fill="#2a2e34"/><rect x="${x - 2}" y="${y2 - 7}" width="5" height="3" fill="#2a2e34"/><rect x="${x + 2}" y="${y1}" width="4" height="${y2 - y1}" rx="2" fill="url(#${o.uid}-tb)"/><path d="M${x + 3} ${y1 + 2}V${y2 - 2}" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/>`;
  function mwin(o, x, y, w, h, solid) {
    const u = o.uid, id = u + "-mw" + x, d = rr(x, y, w, h, 2), cx = x + w / 2, by = y + h * .82;
    let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#07080a"/><g clip-path="url(#${id})">`;
    if (o.on) s += `<g opacity="${L(o)}"><path class="${P}glow" d="${d}" fill="url(#${u}-mwg)"/></g>`;
    s += `<ellipse cx="${cx}" cy="${by}" rx="${n1(w * .36)}" ry="${n1(h * .08)}" fill="#dfe4ea" fill-opacity="${o.on ? .75 : .1}"/>` +
      `<g class="${o.on ? P + "turn" : ""}"><path d="M${n1(cx - w * .1)} ${n1(by - 1)}Q${cx} ${n1(by + h * .08)} ${n1(cx + w * .1)} ${n1(by - 1)}L${n1(cx + w * .085)} ${n1(by - h * .2)}H${n1(cx - w * .085)}Z" fill="#c8402e"/><ellipse cx="${cx}" cy="${n1(by - h * .2)}" rx="${n1(w * .085)}" ry="${n1(h * .04)}" fill="#e86a3e"/></g>` +
      (o.on ? steam(o, cx, by - h * .24, w * .16, 2) : "") +
      `<path d="${d}" fill="url(#${u}-msh)" opacity="${solid ? .2 : .55}"/>` + (o.on ? "" : `<path d="${d}" fill="#000" opacity=".6"/>`) + `</g>` +
      `<path d="M${n1(x + w * .55)} ${y}L${n1(x + w * .4)} ${y + h}H${n1(x + w * .48)}L${n1(x + w * .63)} ${y}Z" fill="#fff" fill-opacity=".05"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".7"/>`;
    return s;
  }
  function dishAt(dish, cx, ry) {
    let s = "";
    if (dish === "roast") s += `<path d="M${n1(cx - 14)} ${n1(ry - 3)}H${n1(cx + 14)}L${n1(cx + 12)} ${n1(ry)}H${n1(cx - 12)}Z" fill="#3a3f45"/><ellipse cx="${cx}" cy="${n1(ry - 7)}" rx="10" ry="6" fill="#b5622a"/><ellipse cx="${cx - 2}" cy="${n1(ry - 9)}" rx="5" ry="2.6" fill="#e09a52"/>`;
    if (dish === "cookie") s += `<rect x="${n1(cx - 18)}" y="${n1(ry - 1.5)}" width="36" height="1.5" fill="#8f969e"/>` + [-13, -6.5, 0, 6.5, 13].map((dd) => `<ellipse cx="${n1(cx + dd)}" cy="${n1(ry - 3)}" rx="2.6" ry="1.3" fill="#c98a3e"/>`).join("");
    if (dish === "pizza") s += `<ellipse cx="${cx}" cy="${n1(ry - 1.5)}" rx="16" ry="3" fill="#d9a35a"/><ellipse cx="${cx}" cy="${n1(ry - 1.9)}" rx="13" ry="2.3" fill="#c43a22"/>`;
    if (dish === "bread") s += `<path d="M${n1(cx - 12)} ${n1(ry - 1)}C${n1(cx - 12)} ${n1(ry - 12)} ${n1(cx + 12)} ${n1(ry - 12)} ${n1(cx + 12)} ${n1(ry - 1)}Z" fill="#c07a34"/>`;
    if (dish === "veg") s += `<rect x="${n1(cx - 17)}" y="${n1(ry - 3)}" width="34" height="3" fill="#c9ced4"/>` + ["#3f9a4a", "#e8662a", "#3f9a4a", "#f2c84a", "#e8662a"].map((c, i) => `<ellipse cx="${n1(cx - 12 + i * 6)}" cy="${n1(ry - 4.5)}" rx="2.6" ry="1.6" fill="${c}"/>`).join("");
    return s;
  }
  function owin(o, x, y, w, h, dish, cool, lt) {
    const u = o.uid, id = u + "-ow" + x + "-" + y, d = rr(x, y, w, h, 2), cx = x + w / 2, ry = y + h * .74;
    let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#050607"/><g clip-path="url(#${id})">`;
    if (o.on) s += `<g opacity="${L(o)}"><path class="${P}glow" d="${d}" fill="${cool ? "#bfe6ff" : `url(#${u}-ovg)`}" ${cool ? 'fill-opacity=".45"' : ""}/></g>` +
      (cool ? "" : `<path d="M${x + 4} ${y + 4}${[1, 2, 3, 4, 5, 6].map((i) => `L${n1(x + 4 + (w - 8) * i / 6.5)} ${y + (i % 2 ? 7 : 4)}`).join("")}" fill="none" stroke="#ff5a1a" stroke-width="1.4"/>`);
    s += `<path d="M${x} ${n1(ry)}H${x + w}M${x} ${n1(y + h * .45)}H${x + w}" stroke="${o.on ? "#fff" : "#2a2e34"}" stroke-opacity="${o.on ? .55 : 1}" stroke-width="1"/>`;
    s += dishAt(dish, cx, ry);
    if (o.on && cool) s += steam(o, cx, ry - 6, w * .6, 4);
    s += (o.on ? `<path d="${d}" fill="#000" opacity="${n1(.4 - .4 * o.level)}"/>` : lt ? `<path d="${d}" fill="#fff1c8" opacity=".34"/><path d="${d}" fill="#000" opacity=".12"/>` : `<path d="${d}" fill="#020304" opacity=".86"/>`) + `</g>` +
      `<path d="M${n1(x + w * .6)} ${y}L${n1(x + w * .45)} ${y + h}H${n1(x + w * .52)}L${n1(x + w * .67)} ${y}Z" fill="#fff" fill-opacity="${o.on ? .04 : .07}"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".6"/>`;
    return s;
  }
  function steam(o, x, y, w, n) {
    if (!o.on) return ""; let s = "";
    for (let i = 0; i < n; i++) { const xi = x - w / 2 + w * (i + .5) / n, r = 2.6 + (i % 2) * 1.4;
      s += `<circle class="${P}stm" style="animation-delay:-${n1(i * 1.1)}s" cx="${n1(xi)}" cy="${n1(y - r)}" r="${n1(r)}" fill="url(#${o.uid}-stm)"/>`; }
    return s;
  }
  const read = (o, cx, cy, h, str, col) => { const w = str.replace(/[.:]/g, "").length * h * .82; return digits(str, cx - w / 2, cy - h / 2, h, o.on ? col : "#2b3a40", o.on ? H().rgba(col, .08) : null); };
  const keys = (x, y, c, r, gx, gy, col) => { let s = ""; for (let j = 0; j < r; j++) for (let i = 0; i < c; i++) s += `<rect x="${n1(x + i * gx)}" y="${n1(y + j * gy)}" width="${n1(gx * .7)}" height="${n1(gy * .6)}" rx=".8" fill="${col || "#fff"}" fill-opacity=".22"/>`; return s; };
  const clock = (o) => { const m = Math.round(1 + o.level * 9); return "" + m + ":" + String(Math.round(o.level * 59)).padStart(2, "0"); };
  const tmp = (o) => String(Math.round((250 + 200 * o.level) / 25) * 25);

  const otrScene = (o, y2) => `<g class="hda-bg">${otrScene0(o, y2)}</g>`;
  function otrScene0(o, y2) {
    const u = o.uid;
    return `<rect width="200" height="200" fill="url(#${u}-sub)"/>` +
      `<rect x="0" y="0" width="200" height="30" fill="url(#${u}-cab)"/><path d="${rr(36, 4, 60, 22, 1.5)}${rr(104, 4, 60, 22, 1.5)}" fill="none" stroke="#000" stroke-opacity=".3"/>` +
      [[0, 26], [174, 26]].map((c) => `<rect x="${c[0]}" y="0" width="${c[1]}" height="${y2 + 4}" fill="url(#${u}-cab)"/><path d="${rr(c[0] + 4, 6, c[1] - 8, y2 - 8, 1.5)}" fill="none" stroke="#000" stroke-opacity=".3"/><rect x="${c[0] + (c[0] ? 5 : c[1] - 8)}" y="${y2 - 20}" width="2.4" height="12" rx="1.2" fill="url(#${u}-tbv)"/>`).join("") +
      `<rect x="0" y="${y2 + 4}" width="26" height="2" fill="#000" opacity=".4"/><rect x="174" y="${y2 + 4}" width="26" height="2" fill="#000" opacity=".4"/>` +
      `<path d="M0 150H200V158H0Z" fill="url(#${u}-ct)"/><path d="M0 158H200V200H0Z" fill="url(#${u}-cab)"/>` +
      `<path d="M38 148L42 140H158L162 148Z" fill="#14161a"/><path d="M34 158L38 148H162L166 158Z" fill="#1b1d21"/><path d="M34 158H166V200H34Z" fill="url(#${u}-mtv)"/><path d="M34 158H166V200H34Z" fill="url(#${u}-brs)"/>` +
      `<path d="M36 160H164V168H36Z" fill="#000" opacity=".2"/>` + [50, 64, 136, 150].map((x) => `<circle cx="${x}" cy="164" r="3" fill="url(#${u}-tbv)"/>`).join("") +
      `<path d="M44 147H156M100 141V156M70 141L68 156M130 141L132 156" stroke="#050607" stroke-width="2"/>` +
      `<path d="${rr(56, 172, 88, 24, 2)}" fill="#050607" opacity=".85"/>` +
      `<path d="M62 146V136Q62 133 72 133Q82 133 82 136V146Q82 149 72 149Q62 149 62 146Z" fill="url(#${u}-tb)"/><ellipse cx="72" cy="134" rx="10" ry="2.4" fill="#8a4a24"/>` +
      `<ellipse cx="130" cy="152" rx="13" ry="3" fill="#232529"/><path d="M143 152L156 156" stroke="#15171a" stroke-width="3" stroke-linecap="round"/>`;
  }
  function otr(o, sp) {
    const u = o.uid, om = part(o, "mw"), ol = part(o, "light"), of = part(o, "fan");
    const x1 = 28, x2 = 172, y1 = 32, y2 = 32 + (sp.h || 68), dy = y1 + 11, pw = sp.pw || 38, px = x2 - pw - 4;
    let s = otrScene(o, y2);
    if (ol.on) s += [62, 138].map((x) => `<path d="M${x - 7} ${y2 + 4}L${x - 30} 150H${x + 30}L${x + 7} ${y2 + 4}Z" fill="url(#${u}-cone)" opacity="${L(ol)}"/>`).join("") +
      `<ellipse cx="100" cy="146" rx="80" ry="10" fill="url(#${u}-pool)" opacity="${L(ol)}"/>`;
    s += of.on ? [0, 1, 2, 3].map((i) => `<path class="${P}up" style="animation-delay:-${n1(i * .6)}s;animation-duration:${n1(2.6 - 1.4 * of.level)}s" d="M${66 + i * 4} 130C${62 + i * 6} 120 ${84 + i * 5} 116 ${86 + i * 6} ${y2 + 8}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/>`).join("")
      : `<circle class="${P}stm" cx="72" cy="126" r="4" fill="url(#${u}-stm)"/><circle class="${P}stm" style="animation-delay:-1.4s" cx="76" cy="124" r="3" fill="url(#${u}-stm)"/>`;
    s += sh(o, 100, y2 + 6, 76, 3) + fin(o, rr(x1, y1, x2 - x1, y2 - y1, 2));
    s += `<rect x="${x1 + 4}" y="${y1 + 3}" width="${x2 - x1 - 8}" height="6" fill="#0a0b0d" opacity=".35"/>` +
      (sp.grille === "perf" ? `<rect x="${x1 + 6}" y="${y1 + 3.5}" width="${x2 - x1 - 12}" height="5" fill="url(#${u}-msh)"/>` : `<rect x="${x1 + 6}" y="${y1 + 3.5}" width="${x2 - x1 - 12}" height="5" fill="url(#${u}-sl)"/>`);
    if (of.on) s += [50, 80, 120, 150].map((x, i) => `<path class="${P}up" style="animation-delay:-${n1(i * .5)}s" d="M${x - 4} ${y1 - 2}l4 -4l4 4" fill="none" stroke="#dfe8ef" stroke-width="1.2" stroke-linecap="round"/>`).join("");
    const dx1 = x1 + 4, dx2 = px - 3, dh = y2 - dy - 4, hb = sp.handle !== "vbar" && sp.handle !== "pocket", wo = hb ? 10 : 5;
    if (sp.door === "glass") s += glass(o, rr(dx1, dy, x2 - 4 - dx1, dh, 1.5)) + mwin(om, dx1 + 8, dy + wo, dx2 - dx1 - 18, dh - wo - 5, true) + `<path d="M${px - 1} ${dy}V${dy + dh}" stroke="#000" stroke-opacity=".6"/>`;
    else s += fin(o, rr(dx1, dy, dx2 - dx1, dh, 1.5)) + `<path d="${rr(dx1, dy, dx2 - dx1, dh, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/>` + mwin(om, dx1 + 6, dy + wo, dx2 - dx1 - 18, dh - wo - 5);
    if (sp.handle === "vbar") s += vbar(o, dx2 - 9, dy + 4, dy + dh - 4);
    else if (sp.handle === "pocket") s += `<path d="M${dx2 - 6} ${dy + 6}V${dy + dh - 6}" stroke="#000" stroke-opacity=".55" stroke-width="2.4"/><path d="M${dx2 - 4.6} ${dy + 6}V${dy + dh - 6}" stroke="#fff" stroke-opacity=".35"/>`;
    else s += hbar(o, dx1 + 10, sp.door === "glass" ? x2 - 14 : dx2 - 8, dy + 7, sp.handle);
    const pt = sp.handle === "vbar" || sp.handle === "pocket" ? dy : dy + 4;
    if (sp.panel === "glass") s += (sp.door === "glass" ? "" : glass(o, rr(px, pt, pw, y2 - 4 - pt, 1.5))) +
      `<path d="${rr(px + 4, pt + 4, pw - 8, 11, 1.5)}" fill="#000"/>` + read(om, px + pw / 2, pt + 9.5, 6, om.on ? clock(om) : "12:00", CYAN) +
      keys(px + 6, pt + 20, 3, 4, (pw - 10) / 3, 7.6) + led(o, px + 8, y2 - 9, 1.2, ol.on, AMB, "ho") + led(o, px + 16, y2 - 9, 1.2, of.on, CYAN, "hb");
    else s += `<path d="${rr(px, pt, pw, y2 - 4 - pt, 1.5)}" fill="#000" fill-opacity=".25"/><path d="${rr(px + 3, pt + 3, pw - 6, 12, 1.5)}" fill="#05070a"/>` + read(om, px + pw / 2, pt + 9, 6, om.on ? clock(om) : "12:00", GREEN) +
      keys(px + 5, pt + 19, 3, 5, (pw - 8) / 3, 7, "#000") + led(o, px + 8, y2 - 8, 1.2, ol.on, AMB, "ho") + led(o, px + 16, y2 - 8, 1.2, of.on, CYAN, "hb");
    s += `<rect x="${x1}" y="${y2}" width="${x2 - x1}" height="4" fill="#1a1c20"/>` + [80, 104].map((x) => `<rect x="${x}" y="${y2 + .6}" width="18" height="2.6" fill="url(#${u}-msh)"/>`).join("") +
      [62, 138].map((x) => `<rect x="${x - 6}" y="${y2 + .8}" width="12" height="2.6" rx="1" fill="${ol.on ? "#fff6dc" : "#555a60"}"/>` + (ol.on ? `<ellipse cx="${x}" cy="${y2 + 3}" rx="14" ry="5" fill="url(#${u}-pool)"/>` : "")).join("");
    return s + hl(x1 + 3, y1 + 1.5, x2 - 3, y1 + 1.5, 1, .45);
  }

  const tallScene = (o, x1, x2) => `<g class="hda-bg">${tallScene0(o, x1, x2)}</g>`;
  function tallScene0(o, x1, x2) {
    const u = o.uid;
    return `<rect width="200" height="178" fill="url(#${u}-sub)"/><rect x="0" y="178" width="200" height="22" fill="url(#${u}-flr)"/>` +
      `<rect x="${x1 - 12}" y="0" width="${x2 - x1 + 24}" height="178" fill="url(#${u}-wd)"/><path d="M${x1 - 12} 0V178M${x2 + 12} 0V178" stroke="#000" stroke-opacity=".45"/><path d="M${x1 - 11} 0V178" stroke="#fff" stroke-opacity=".12"/>` +
      `<rect x="0" y="100" width="${x1 - 12}" height="4" fill="url(#${u}-ct)"/><rect x="0" y="104" width="${x1 - 12}" height="74" fill="url(#${u}-cab)"/><rect x="${x2 + 12}" y="100" width="${188 - x2}" height="4" fill="url(#${u}-ct)"/><rect x="${x2 + 12}" y="104" width="${188 - x2}" height="74" fill="url(#${u}-cab)"/>` +
      `<rect x="0" y="0" width="${x1 - 12}" height="40" fill="url(#${u}-cab)"/><rect x="${x2 + 12}" y="0" width="${188 - x2}" height="40" fill="url(#${u}-cab)"/>` +
      `<rect x="0" y="172" width="200" height="6" fill="#0c0d0f"/>`;
  }
  function unit(o, q, x1, x2, y, h, sp) {
    const u = o.uid, w = x2 - x1, ch = sp.ch == null ? 12 : sp.ch, kind = sp.kind || "oven";
    let s = `<rect x="${x1 - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" fill="#08090b"/>` + fin(o, rr(x1, y, w, h, 1.5));
    if (ch) { s += glass(o, rr(x1 + 2, y + 2, w - 4, ch - 2, 1));
      const col = kind === "mw" ? CYAN : kind === "steam" ? "#9ad7ff" : ORNG;
      s += read(q, x1 + w / 2, y + ch / 2 + 1, Math.min(7, ch * .5), q.on ? (kind === "mw" || kind === "speed" ? clock(q) : kind === "steam" ? String(Math.round(120 + 90 * q.level)) : tmp(q)) : "12:00", col) +
        keys(x1 + 8, y + ch / 2 - .5, 3, 1, 6, 4) + keys(x2 - 26, y + ch / 2 - .5, 3, 1, 6, 4);
      if (sp.knob) s += `<circle cx="${x2 - 14}" cy="${y + ch / 2 + 1}" r="${ch * .36}" fill="url(#${u}-tbv)"/><circle cx="${x2 - 14}" cy="${y + ch / 2 + 1}" r="${ch * .36}" fill="none" stroke="#000" stroke-opacity=".4"/>`;
    }
    const dy = y + ch + 1, dh = h - ch - 3, full = sp.door === "glass";
    if (sp.open) return s + ovCav(q, sp, x1 + 2, dy, w - 4, dh) + `<path d="M${x1 + 2} ${y + 1}H${x2 - 2}" stroke="#fff" stroke-opacity=".3"/>`;
    if (full) s += glass(o, rr(x1 + 2, dy, w - 4, dh, 1.5));
    const wx = x1 + (full ? 10 : 12), ww = w - (full ? 20 : 24), wy = dy + (sp.handle === "none" ? 6 : 12), wh = dh - (sp.handle === "none" ? 12 : 18);
    s += kind === "microwave-drawer" ? `<path d="${rr(wx, wy, ww, wh, 2)}" fill="#000" opacity=".25"/>` : kind === "mw" ? mwin(q, wx, wy, ww, wh, full) : owin(q, wx, wy, ww, wh, sp.dish, kind === "steam", sp.lt);
    if (sp.handle === "vbar") s += vbar(o, x2 - 14, dy + 6, dy + dh - 6);
    else if (sp.handle !== "none") s += hbar(o, x1 + 12, x2 - 12, dy + 7, sp.handle);
    return s + `<path d="M${x1 + 2} ${y + 1}H${x2 - 2}" stroke="#fff" stroke-opacity=".3"/>`;
  }
  const gaps = (o, x1, x2, t, b) => `<g class="hda-bg">${gaps0(o, x1, x2, t, b)}</g>`;
  const gaps0 = (o, x1, x2, t, b) => [[4, t - 6], [b + 6, 170]].filter((g) => g[1] - g[0] > 16).map((g) => `<path d="${rr(x1 - 6, g[0], x2 - x1 + 12, g[1] - g[0], 1.5)}" fill="none" stroke="#000" stroke-opacity=".35"/><path d="${rr(x1, g[0] + 6, x2 - x1, g[1] - g[0] - 12, 1)}" fill="none" stroke="#000" stroke-opacity=".2"/><rect x="${(x1 + x2) / 2 - 12}" y="${g[0] < 50 ? g[1] - 8 : g[0] + 5}" width="24" height="2.4" rx="1.2" fill="url(#${o.uid}-tbv)"/>`).join("");
  // (parts) an open door (un.dc: its contact part; a Device Image: the device's contact o.open) shows the lit cavity, an oven
  // door folded down below it, a microwave door swung open to the left. The Oven light part lights the window and the cavity.
  function ovCav(q, sp, X, Y, W, H) {
    const bx = X + W * .1, bw = W * .8, by = Y + H * .1, bh = H * .78, heat = q.on, mw = sp.kind === "mw", lit = heat || (!mw && sp.lt);
    let s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#1d2129"/><rect x="${n1(bx)}" y="${n1(by)}" width="${n1(bw)}" height="${n1(bh)}" fill="#272c36"/>` +
      `<path d="M${X} ${Y}L${n1(bx)} ${n1(by)}V${n1(by + bh)}L${X} ${Y + H}Z" fill="#2e3440"/><path d="M${X + W} ${Y}L${n1(bx + bw)} ${n1(by)}V${n1(by + bh)}L${X + W} ${Y + H}Z" fill="#232831"/>` +
      `<path d="M${X} ${Y + H}L${n1(bx)} ${n1(by + bh)}H${n1(bx + bw)}L${X + W} ${Y + H}Z" fill="#15181e"/>`;
    if (mw) s += `<ellipse cx="${n1(X + W / 2)}" cy="${n1(by + bh - 2)}" rx="${n1(bw * .36)}" ry="${n1(bh * .07)}" fill="#dfe4ea" fill-opacity=".7"/>`;
    else s += `<path d="M${n1(bx + 3)} ${n1(by + 3)}${[1, 2, 3, 4, 5, 6].map((i) => `L${n1(bx + 3 + (bw - 6) * i / 6.5)} ${n1(by + (i % 2 ? 6 : 3))}`).join("")}" fill="none" stroke="${heat ? "#ff5a1a" : "#4a505a"}" stroke-width="1.3"/>` +
      [.55, .82].map((k) => `<path d="M${X + 2} ${n1(Y + H * k)}H${X + W - 2}" stroke="#a9b0b8" stroke-width=".9"/>`).join("") + dishAt(sp.dish, X + W / 2, Y + H * .55) +
      (heat ? `<ellipse cx="${n1(X + W / 2)}" cy="${n1(by + 4)}" rx="${n1(bw / 2)}" ry="${n1(H * .3)}" fill="#ff7a2a" opacity=".22"/>` : "");
    s += lit ? `<ellipse cx="${n1(X + W / 2)}" cy="${n1(Y + 3)}" rx="${n1(W * .5)}" ry="${n1(H * .7)}" fill="#fff1c8" opacity=".22"/><rect x="${n1(bx + bw - 8)}" y="${n1(by + 1)}" width="4" height="3" rx="1" fill="#fff4d6"/>` : `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#05060a" opacity=".4"/>`;
    const cid = `${q.uid}-oc${Math.round(Y)}`;
    return `<clipPath id="${cid}"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath><g clip-path="url(#${cid})">${s}</g>` + `<rect x="${X + .4}" y="${Y + .4}" width="${W - .8}" height="${H - .8}" fill="none" stroke="#5d656d" stroke-width=".7"/>`;
  }
  function ovDoor(o, un, x1, x2) {
    const u = o.uid, ch = un.ch == null ? 12 : un.ch, dy = un.y + ch + 1, dh = un.h - ch - 3, X = x1 + 2, W = x2 - x1 - 4;
    if (un.kind === "mw") { const ow = W * .3, e = 4, d = `M${X} ${dy}L${n1(X - ow)} ${dy - e}V${dy + dh + e}L${X} ${dy + dh}Z`;
      return `<path d="${d}" fill="#c9ced4"/><path d="${d}" fill="#000" opacity=".22"/><path d="M${n1(X - ow * .15)} ${dy + 6}L${n1(X - ow * .85)} ${dy + 3}V${dy + dh - 3}L${n1(X - ow * .15)} ${dy + dh - 6}Z" fill="#0d0f13" opacity=".8"/>` +
        `<path d="M${n1(X - ow)} ${dy - e}l-3 1v${dh + 2 * e - 2}l3 1z" fill="url(#${u}-v)"/>`; }
    const Yb = dy + dh, dp = Math.min(16, 196 - Yb), g = 6, d = `M${X} ${Yb}H${X + W}L${X + W + g} ${Yb + dp}H${X - g}Z`, gl = `M${X + 12} ${Yb + 2}H${X + W - 12}L${X + W - 8} ${Yb + dp - 3}H${X + 8}Z`;
    return `<ellipse cx="${X + W / 2}" cy="${Math.min(198, Yb + dp + 2)}" rx="${W / 2 + 10}" ry="2.4" fill="#000" opacity=".3"/><path d="${d}" fill="#3a3f46"/>` +
      `<path d="${gl}" fill="#14171c"/><path d="${gl}" fill="url(#${u}-gls)" opacity=".5"/>` +
      `<rect x="${X - g}" y="${Yb + dp}" width="${W + 2 * g}" height="3.4" rx="1" fill="url(#${u}-v)"/><path d="M${X - g} ${Yb + dp + 3.4}H${X + W + g}" stroke="#000" stroke-opacity=".5" stroke-width=".6"/>`;
  }
  const wallIcon = (o, units, x1, x2) => {
    const p = o.parts || {}, op = (id) => !!id && (o.mf ? !!p[id] : !!o.open), lt = !!o.mf && !!p.light;
    const us = units.map((un) => (un.dc ? Object.assign({}, un, { lt, open: op(un.dc) }) : un));
    return svgO(o, tallScene(o, x1, x2) + gaps(o, x1, x2, Math.min.apply(null, us.map((u) => u.y)), Math.max.apply(null, us.map((u) => u.y + u.h))) + us.map((un) => unit(o, part(o, un.part || "x"), x1, x2, un.y, un.h, un)).join("") +
      us.filter((un) => un.open).sort((a, b) => b.y - a.y).map((un) => ovDoor(o, un, x1, x2)).join(""));
  };

  const ic = (id, name, colors, render, parts) => ({ id, name, colors, picker: true, colorLabel: "Finish", render, parts: parts ? parts.map((p) => Object.assign({ id: p[0], name: p[1] }, p[2] ? { type: p[2] } : {})) : undefined });
  const OTRP = [["mw", "Microwave"], ["light", "Light"], ["fan", "Fan"]];
  // (parts) each oven's door its own contact, each oven's heat, the oven light (o.mf: a Multi-Function Image)
  const DBLP = [["ud", "Upper door", "contact"], ["ld", "Lower door", "contact"], ["oven", "Upper oven"], ["oven2", "Lower oven"], ["light", "Oven light"]];
  const CMBP = [["md", "Microwave door", "contact"], ["od", "Oven door", "contact"], ["mw", "Microwave"], ["oven", "Oven"], ["light", "Oven light"]];
  const STD = [SS, BSS, WH, BK, FPS];

  const icons = [
    ic("steel-otr-glass-touch", "Steel OTR, glass touch", [SS, BSS, WH, BK], (o) => svgO(o, otr(o, { door: "glass", handle: "hbar", panel: "glass", grille: "slots" })), OTRP),
    ic("classic-otr", "Classic OTR", [SS, WH, BK, FPS], (o) => svgO(o, otr(o, { door: "win", handle: "vbar", panel: "keys", grille: "slots" })), OTRP),
    ic("black-glass-otr", "Black-glass OTR", [BSS, SS, WH, BK], (o) => svgO(o, otr(o, { door: "glass", handle: "vbar", panel: "glass", grille: "perf" })), OTRP),
    ic("low-profile-otr", "Low-profile OTR", [SS, BSS, BK, WH], (o) => svgO(o, otr(o, { door: "glass", handle: "pocket", panel: "glass", grille: "slots", h: 50, pw: 34 })), OTRP),
    ic("pro-handle-otr", "Pro-handle OTR", [SS, BSS, WH, BK], (o) => svgO(o, otr(o, { door: "win", handle: "ka", panel: "glass", grille: "perf" })), OTRP),
    ic("bronze-handle-otr", "Bronze-handle OTR", [MWH, SS, MBK, BSS], (o) => svgO(o, otr(o, { door: "glass", handle: "bz", panel: "glass", grille: "slots" })), OTRP),

    ic("single-wall-oven", "Single wall oven", [SS, BSS, BK, WH], (o) => wallIcon(o, [{ y: 46, h: 104, ch: 16, dish: "roast", handle: "hbar", door: "glass" }], 42, 158)),
    ic("flush-wall-oven", "Flush wall oven", [SS, BK, BSS], (o) => wallIcon(o, [{ y: 46, h: 104, ch: 14, dish: "bread", handle: "hbar", knob: true }], 42, 158)),
    ic("pro-double-oven", "Pro double oven", [SS, BSS, WH, BK], (o) => wallIcon(o, [{ y: 12, h: 78, ch: 14, dish: "cookie", handle: "ka", part: "oven", dc: "ud" }, { y: 94, h: 74, ch: 0, dish: "roast", handle: "ka", part: "oven2", dc: "ld" }], 42, 158), DBLP),
    ic("classic-double-oven", "Classic double oven", [SS, WH, BK, FPS], (o) => wallIcon(o, [{ y: 12, h: 78, ch: 12, dish: "pizza", handle: "hbar", part: "oven", dc: "ud" }, { y: 94, h: 74, ch: 0, dish: "bread", handle: "hbar", part: "oven2", dc: "ld" }], 42, 158), DBLP),
    ic("glass-double-oven", "Glass double oven", [BSS, SS, BK, WH], (o) => wallIcon(o, [{ y: 12, h: 78, ch: 13, dish: "veg", handle: "hbar", door: "glass", part: "oven", dc: "ud" }, { y: 94, h: 74, ch: 0, dish: "roast", handle: "hbar", door: "glass", part: "oven2", dc: "ld" }], 42, 158), DBLP),
    ic("combo-wall-glass", "Combo wall, glass", [SS, BSS, BK], (o) => wallIcon(o, [{ y: 12, h: 66, ch: 12, kind: "mw", handle: "hbar", door: "glass", part: "mw", dc: "md" }, { y: 82, h: 86, ch: 12, dish: "pizza", handle: "hbar", part: "oven", dc: "od" }], 42, 158), CMBP),
    ic("combo-wall-pro", "Combo wall, pro", [SS, BSS, WH, BK], (o) => wallIcon(o, [{ y: 12, h: 66, ch: 12, kind: "mw", handle: "ka", part: "mw", dc: "md" }, { y: 82, h: 86, ch: 12, dish: "roast", handle: "ka", part: "oven", dc: "od" }], 42, 158), CMBP),
    ic("speed-oven", "Speed oven", [SS, BSS, BK, WH], (o) => wallIcon(o, [{ y: 34, h: 74, ch: 14, kind: "speed", dish: "pizza", handle: "hbar", door: "glass", knob: true }, { y: 112, h: 56, ch: 0, kind: "microwave-drawer", handle: "hbar", door: "glass" }].map((un, i) => i ? Object.assign(un, { h: 30 }) : un), 42, 158)),
    ic("steam-oven", "Steam oven", [SS, BK, BSS], (o) => wallIcon(o, [{ y: 40, h: 88, ch: 14, kind: "steam", dish: "veg", handle: "hbar", door: "glass" }], 42, 158)),

    ic("microwave-drawer", "Microwave drawer", [SS, BK, BSS], (o) => { const u = o.uid, on = o.on;
      return svgO(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-sub)" opacity=".6"/><path d="M0 60H200V70H0Z" fill="url(#${u}-ct)"/><path d="M0 70H200V188H0Z" fill="url(#${u}-cab)"/><rect x="0" y="188" width="200" height="12" fill="url(#${u}-flr)"/>` +
        `<path d="M4 76H40V180H4ZM160 76H196V180H160Z" fill="none" stroke="#000" stroke-opacity=".3"/><rect x="0" y="182" width="200" height="6" fill="#0c0d0f"/></g>` +
        `<rect x="44" y="80" width="112" height="70" fill="#08090b"/>` + fin(o, rr(46, 82, 108, 66, 1.5)) +
        `<path d="M48 84H152L150 96H50Z" fill="url(#${u}-gls)"/>` + read(o, 100, 90, 5.5, on ? clock(o) : "12:00", CYAN) + keys(56, 88, 4, 1, 6, 4) + keys(126, 88, 4, 1, 6, 4) +
        glass(o, rr(50, 99, 100, 45, 1.5)) + `<path d="M52 101L84 101L66 142H52Z" fill="#fff" opacity=".05"/>` +
        (on ? `<path class="${P}glow" d="M50 99H150" stroke="#ffd36a" stroke-width="1.6" opacity="${L(o)}"/><ellipse cx="100" cy="99" rx="50" ry="3" fill="#ffd36a" opacity="${L(o, .35)}"/>` : "") +
        `<rect x="92" y="138" width="16" height="2" rx="1" fill="#fff" fill-opacity=".2"/>` + steam(o, 100, 78, 40, 3) +
        `<g class="hda-bg"><ellipse cx="150" cy="60" rx="18" ry="4" fill="#000" opacity=".25"/><path d="M140 58V48Q140 44 150 44Q160 44 160 48V58Z" fill="#e9eef2" opacity=".9"/></g>`); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "ovens", tab: "Wall ovens & OTR microwaves", group: "Appliances", kind: "device",
    intro: "Sixteen real models: over-the-range microwaves, single and double wall ovens, microwave-oven combos, a speed oven, a steam oven and a microwave drawer. OTR microwaves have separate Microwave, Light and Fan chips: the light shines on the cooktop, the fan pulls the steam up through the vent, and the microwave lights its window with the plate turning. Double ovens and combos switch each cavity on its own; as a Multi-Function Image each door is its own contact (open shows the cavity, the door folded down) with an oven light.",
    
    css: css2, icons,
  });
})();
