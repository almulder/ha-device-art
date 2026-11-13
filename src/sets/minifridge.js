(function () {
  const P = "hda-minifridge-";
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
.hda-minifridge-flow{stroke-dashoffset:0}
.hda-anim .hda-minifridge-flow{animation:hda-minifridge-flow 1s linear infinite}
@keyframes hda-minifridge-flow{to{stroke-dashoffset:-18}}
.hda-minifridge-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-minifridge-flk{animation:hda-minifridge-flk .5s ease-in-out infinite alternate}
@keyframes hda-minifridge-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-minifridge-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-minifridge-spin{animation:hda-minifridge-spin 1s linear infinite}
@keyframes hda-minifridge-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-minifridge-blink{animation:hda-minifridge-blink 1.2s steps(1,end) infinite}
@keyframes hda-minifridge-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-minifridge-chase{opacity:.18}
.hda-anim .hda-minifridge-chase{animation:hda-minifridge-chase 4s linear infinite}
@keyframes hda-minifridge-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-minifridge-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-minifridge-bub{animation:hda-minifridge-bub 2s ease-in infinite}
@keyframes hda-minifridge-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-minifridge-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-minifridge-rip{animation:hda-minifridge-rip 2.2s ease-out infinite}
@keyframes hda-minifridge-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-minifridge-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-minifridge-mist{animation:hda-minifridge-mist 1.6s ease-in-out infinite}
@keyframes hda-minifridge-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-minifridge-heat{opacity:0}
.hda-anim .hda-minifridge-heat{animation:hda-minifridge-heat 2.6s ease-out infinite}
.hda-anim .hda-minifridge-hum{animation:hda-minifridge-hum .16s linear infinite}
@keyframes hda-minifridge-hum{0%,100%{transform:translate(0,0)}50%{transform:translate(.5px,-.3px)}}
.hda-anim .hda-minifridge-bob{animation:hda-minifridge-bob 1.6s ease-in-out infinite}
@keyframes hda-minifridge-bob{50%{transform:translate(0,-2px)}}
@keyframes hda-minifridge-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-minifridge-heat.hda-minifridge-still{opacity:.4}
.hda-anim .hda-minifridge-heat.hda-minifridge-still{opacity:0}
`;
  const heat = (o, xs, y, col) => o.on ? xs.map((x, i) => `<path class="${P}heat${o.anim ? "" : " " + P + "still"}" style="animation-delay:-${n1(i * .8)}s" d="M${x} ${y}q-3 -5 0 -10t0 -10" fill="none" stroke="${col || "#ffc58a"}" stroke-width="1.3" stroke-linecap="round"/>`).join("") : "";
  const bubbles = (o, pts, col) => o.on ? pts.map((p, i) => `<circle class="${P}bub" style="animation-delay:-${n1(i * .45)}s;animation-duration:${dur(o, 2.6, 1.4)}s" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.3}" fill="none" stroke="${col || "#e6f7ff"}" stroke-width=".7"/>`).join("") : "";

  const css2 = css + `
.hda-minifridge-frost{opacity:.5}
.hda-anim .hda-minifridge-frost{animation:hda-minifridge-frost 4s ease-in-out infinite}
@keyframes hda-minifridge-frost{50%{opacity:.85}}
`;
  const SS = "#c4c9ce", BSS = "#4e5156", WH = "#eef0f1", BK = "#26282c", RD = "#c8323a", MI = "#a6d9c4", BB = "#9cc3e0", CR = "#efe2c2", PK = "#f1b9c8", NV = "#2e3d5e", YL = "#f0cf6a";
  const metal = (o) => { const c = String(o.color).toLowerCase(); return c === SS || c === BSS ? 1 : 0; };
  const sub = (o, v) => Object.assign({}, o, { on: !!v });
  const part = (o, id) => sub(o, o.parts && o.parts[id] != null ? o.parts[id] : o.on);
  const Lt = (o) => n1(o.on ? .45 + .55 * o.level : 0);
  const tF = (o) => String(Math.round(54 - 20 * o.level));
  const FILL = [["soda", "Soda cans"], ["wine", "Wine bottles"], ["beer", "Beer bottles"], ["mixed", "Mixed"], ["empty", "Empty"]];
  const WINEF = [FILL[1], FILL[0], FILL[2], FILL[3], FILL[4]];

  function mextra(o) {
    const u = o.uid;
    return `<pattern id="${u}-brs" width="41" height="2.2" patternUnits="userSpaceOnUse"><path d="M0 .5H15M19 .5H41" stroke="#fff" stroke-opacity="${String(o.color).toLowerCase() === BSS ? ".07" : ".2"}" stroke-width=".35"/><path d="M5 1.6H28M31 1.6H38" stroke="#000" stroke-opacity=".1" stroke-width=".35"/></pattern>` +
      lg(u + "-ssf", 0, [[0, "#6f767e"], [.3, "#eef0f2"], [.6, "#b9bfc6"], [1, "#5a6067"]]) + lg(u + "-blf", 0, [[0, "#121316"], [.4, "#3a3d43"], [1, "#0d0e10"]]) +
      lg(u + "-int", 1, [[0, "#161b22"], [1, "#07090c"]]) + lg(u + "-litc", 1, [[0, "#e6f3ff", .9], [.5, "#9fd0ff", .55], [1, "#5aa0e6", .45]]) +
      lg(u + "-litw", 1, [[0, "#fff1d6", .9], [.5, "#ffd9a0", .55], [1, "#e0a060", .45]]) + lg(u + "-gls2", 0, [[0, "#fff", .1], [.25, "#fff", .02], [.5, "#fff", 0], [1, "#fff", .06]]) +
      lg(u + "-wood", 1, [[0, "#e2b98a"], [1, "#a8743e"]]) + lg(u + "-wd", 1, [[0, "#7a5536"], [1, "#4a321e"]]) +
      lg(u + "-ct", 1, [[0, "#ebe7df"], [1, "#b9b3a8"]]) + lg(u + "-cab", 1, [[0, "#5d6874"], [1, "#46505b"]]) + lg(u + "-chr", 0, [[0, "#6b737c"], [.35, "#ffffff"], [.6, "#c3c9cf"], [1, "#5a6067"]]) +
      lg(u + "-frs", 1, [[0, "#fff", 0], [1, "#e8f6ff", .45]]) + rg(u + "-pool", [[0, "#cfe8ff", .4], [1, "#cfe8ff", 0]]) +
      `<pattern id="${u}-sub" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="20" height="10" fill="#fff" fill-opacity=".08"/><path d="M0 .5H20M0 5.5H20M10.5 .5V5.5M.5 5.5V10.5" stroke="#000" stroke-opacity=".28" fill="none"/></pattern>` +
      `<pattern id="${u}-pnl" width="16" height="200" patternUnits="userSpaceOnUse"><rect width="16" height="200" fill="#5a3a22" fill-opacity=".55"/><path d="M15.5 0V200" stroke="#000" stroke-opacity=".45"/><path d="M1 0V200" stroke="#fff" stroke-opacity=".06"/></pattern>` +
      `<pattern id="${u}-slt" width="5" height="4" patternUnits="userSpaceOnUse"><rect x="1" y=".8" width="3" height="2.4" rx=".6" fill="#000" fill-opacity=".65"/></pattern>`;
  }
  const svgM = (o, body, extra) => svg(o, body, mextra(o) + (extra || ""));
  const fin = (o, d) => `<path d="${d}" fill="url(#${o.uid}-v)"/>` + (metal(o) ? `<path d="${d}" fill="url(#${o.uid}-brs)"/>` : `<path d="${d}" fill="url(#${o.uid}-g)" opacity=".25"/>`) + `<path d="${d}" fill="url(#${o.uid}-fx)"/>`;

  const scene = (o, kind, fy) => `<g class="hda-bg">${scene0(o, kind, fy)}</g>`;
  function scene0(o, kind, fy) {
    const u = o.uid; fy = fy || 176;
    let s = "";
    if (kind === "bar") s += `<rect width="200" height="${fy}" fill="url(#${u}-pnl)"/><rect y="${fy - 14}" width="200" height="14" fill="#2a1a10" opacity=".6"/>`;
    else if (kind === "game") s += `<rect width="200" height="${fy}" fill="#120c22" opacity=".6"/><path d="M0 8H200" stroke="#b06cff" stroke-width="3"/><rect y="8" width="200" height="40" fill="#b06cff" opacity=".08"/><path d="${rr(130, 30, 52, 34, 2)}" fill="#1a1530" stroke="#3a2e60"/><path d="M140 52l8 -10l8 6l10 -12l6 16" fill="none" stroke="#5ad1ff" stroke-opacity=".6"/>`;
    else if (kind === "patio") s += `<rect width="200" height="${fy}" fill="url(#${u}-sid)"/>`;
    else if (kind === "vanity") s += `<rect width="200" height="${fy}" fill="#f1b9c8" opacity=".14"/><ellipse cx="60" cy="40" rx="26" ry="30" fill="#e9eef2" opacity=".18" stroke="#d9b98a" stroke-opacity=".5" stroke-width="2"/>`;
    else if (kind === "dorm") s += `<rect width="200" height="${fy}" fill="#8a9bb0" opacity=".14"/><path d="${rr(16, 24, 40, 50, 1)}" fill="#e9c46a" opacity=".25"/><path d="${rr(140, 34, 36, 28, 1)}" fill="#5aa0e6" opacity=".2"/>`;
    else s += `<rect width="200" height="${fy}" fill="url(#${u}-sub)"/>`;
    if (kind === "patio") s += `<path d="M0 ${fy}H200V200H0Z" fill="#8a6a4a" opacity=".5"/>` + [0, 1, 2].map((i) => `<path d="M0 ${fy + 6 + i * 7}H200" stroke="#3a2818" stroke-opacity=".6"/>`).join("");
    else if (kind === "dorm" || kind === "game") s += `<path d="M0 ${fy}H200V200H0Z" fill="#3a3f55" opacity=".6"/>`;
    else s += `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-flr)"/>`;
    return s + `<path d="M0 ${fy}H200" stroke="#000" stroke-opacity=".35"/>`;
  }
  const counterTop = (o, y, gap) => `<g class="hda-bg">${counterTop0(o, y, gap)}</g>`;
  const counterTop0 = (o, y, gap) => { const u = o.uid, cab = (x, w) => `<rect x="${x}" y="${y + 6}" width="${w}" height="${170 - y}" fill="url(#${u}-cab)"/><path d="${rr(x + 4, y + 12, w - 8, 158 - y - 12, 1.5)}" fill="none" stroke="#000" stroke-opacity=".3"/>`;
    return (gap ? cab(0, gap[0] - 2) + cab(gap[1] + 2, 198 - gap[1]) : cab(0, 200)) + `<rect x="0" y="${y}" width="200" height="6" fill="url(#${u}-ct)"/><path d="M0 ${y + 6}H200" stroke="#000" stroke-opacity=".3"/><rect x="0" y="170" width="200" height="6" fill="#0c0d0f"/>`; };

  function box(o, x, y, w, h, d, r, nofin) {
    const u = o.uid, dy = d * .6;
    return sh(o, x + w / 2 + d / 2, y + h + 1, w * .62, 4) +
      (d ? `<path d="M${x + 1} ${y}L${x + d + 1} ${y - dy}H${x + w + d}L${x + w} ${y}Z" fill="url(#${u}-tp)"/><path d="M${x + w} ${y}L${x + w + d} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>` : "") +
      (nofin ? "" : fin(o, rr(x, y, w, h, r || 2)));
  }
  const kickVent = (o, x, y, w, h) => `<path d="${rr(x, y, w, h, 1)}" fill="#0c0d10"/><rect x="${x + 3}" y="${y + 1.5}" width="${w - 6}" height="${h - 3}" fill="url(#${o.uid}-slt)"/>`;
  const vhandle = (o, x, y1, y2, g) => `<rect x="${x - 1}" y="${y1 + 3}" width="4" height="3" fill="#202226"/><rect x="${x - 1}" y="${y2 - 6}" width="4" height="3" fill="#202226"/><rect x="${x + 2}" y="${y1}" width="3.4" height="${y2 - y1}" rx="1.7" fill="url(#${o.uid}-${g || "ssf"})"/>`;
  const tdisp = (o, cx, cy, q, col) => `<path d="${rr(cx - 11, cy - 5, 22, 10, 2)}" fill="#05070a"/>` + digits(q.on ? tF(q) : "--", cx - 6, cy - 3.2, 6.4, q.on ? (col || CYAN) : "#2b3a40", q.on ? "rgba(125,211,252,.08)" : null);

  const CANS = ["#d92b2b", "#2f6fd6", "#c9ced4", "#2fa35a", "#f08a24", "#e8d43a", "#7a3fd8"];
  function row(kind, x1, x2, yb, h, i) {
    let s = "";
    if (kind === "mixed") kind = ["soda", "beer", "wine"][i % 3];
    if (kind === "soda") { const w = h * .58, n = Math.floor((x2 - x1) / (w + 1.2));
      for (let k = 0; k < n; k++) { const x = x1 + 1 + k * (w + 1.2), c = CANS[(k * 3 + i * 2) % CANS.length];
        s += `<rect x="${n1(x)}" y="${n1(yb - h)}" width="${n1(w)}" height="${n1(h)}" rx="${n1(w * .2)}" fill="${c}"/><rect x="${n1(x)}" y="${n1(yb - h)}" width="${n1(w)}" height="${n1(h * .14)}" rx="${n1(w * .2)}" fill="#e6e9ec"/><rect x="${n1(x + w * .15)}" y="${n1(yb - h * .8)}" width="${n1(w * .2)}" height="${n1(h * .7)}" fill="#fff" opacity=".35"/>`; } }
    else if (kind === "beer") { const w = h * .42, n = Math.floor((x2 - x1) / (w + 1.6));
      for (let k = 0; k < n; k++) { const x = x1 + 1 + k * (w + 1.6), c = k % 4 === 3 ? "#2f6b35" : "#6b3a12";
        s += `<path d="M${n1(x)} ${yb}V${n1(yb - h * .55)}Q${n1(x)} ${n1(yb - h * .66)} ${n1(x + w * .32)} ${n1(yb - h * .72)}V${n1(yb - h)}H${n1(x + w * .68)}V${n1(yb - h * .72)}Q${n1(x + w)} ${n1(yb - h * .66)} ${n1(x + w)} ${n1(yb - h * .55)}V${yb}Z" fill="${c}"/><rect x="${n1(x)}" y="${n1(yb - h * .45)}" width="${n1(w)}" height="${n1(h * .22)}" fill="#e9dcb8" opacity=".85"/><rect x="${n1(x + w * .3)}" y="${n1(yb - h - 1)}" width="${n1(w * .4)}" height="1.6" fill="#d9b34a"/>`; } }
    else if (kind === "wine") { const r = h * .36, n = Math.floor((x2 - x1) / (2 * r + 1));
      for (let k = 0; k < n; k++) { const cx = x1 + r + 1 + k * (2 * r + 1), cy = yb - r - .5, neck = (k + i) % 2;
        s += neck ? `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="#1d2a1c"/><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * .42)}" fill="${["#8a1c2c", "#d9b34a", "#2a2a2a", "#c8c8c8"][(k + i * 2) % 4]}"/>`
          : `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="${(k + i) % 3 ? "#26361f" : "#3a1420"}"/><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * .55)}" fill="#000" opacity=".45"/><circle cx="${n1(cx - r * .35)}" cy="${n1(cy - r * .35)}" r="${n1(r * .22)}" fill="#fff" opacity=".25"/>`; } }
    else if (kind === "skin") { const cs = ["#f6d6de", "#fff", "#cfe9e1", "#e9d8ff", "#ffe2b8"];
      for (let k = 0, x = x1 + 1; x < x2 - 6; k++) { const w = 5 + (k % 3), hh = h * (.6 + (k % 2) * .35); s += `<rect x="${n1(x)}" y="${n1(yb - hh)}" width="${w}" height="${n1(hh)}" rx="1.5" fill="${cs[k % 5]}"/><rect x="${n1(x + 1)}" y="${n1(yb - hh - 2)}" width="${w - 2}" height="2.4" rx=".6" fill="${["#d9b34a", "#888", "#e8a0b4"][k % 3]}"/>`; x += w + 1.6; } }
    return s;
  }
  function gdoor(o, x, y, w, h, sp) {
    const u = o.uid, oc = part(o, "cool"), ol = part(o, "light"), id = `${u}-gd${x}${y}`, f = sp.fw || 5;
    const ix = x + f, iy = y + f, iw = w - 2 * f, ih = h - 2 * f, d = rr(ix, iy, iw, ih, 1.5), kind = sp.fill || (o.opt && o.opt.fill) || "soda";
    let s = sp.frame === "ss" ? `<path d="${rr(x, y, w, h, 2)}" fill="url(#${u}-ssf)"/><path d="${rr(x, y, w, h, 2)}" fill="url(#${u}-brs)"/>` : sp.frame === "blk" ? `<path d="${rr(x, y, w, h, 2)}" fill="url(#${u}-blf)"/>` : fin(o, rr(x, y, w, h, 2));
    s += `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${u}-int)"/><g clip-path="url(#${id})">`;
    if (ol.on) s += `<path d="${d}" fill="url(#${u}-${sp.warm ? "litw" : "litc"})" opacity="${Lt(ol)}"/>`;
    const zones = sp.zones || [[iy, iy + ih]];
    zones.forEach((z, zi) => { const n = sp.rows || Math.max(2, Math.round((z[1] - z[0]) / 22)), rh = (z[1] - z[0]) / n;
      for (let r = 0; r < n; r++) { const yb = z[0] + rh * (r + 1) - 2;
        s += sp.wood ? `<rect x="${ix}" y="${n1(yb)}" width="${iw}" height="3" fill="url(#${u}-wood)"/>` : `<path d="M${ix} ${n1(yb + 1)}H${ix + iw}" stroke="#9aa3ad" stroke-opacity=".7" stroke-width="1.2"/>`;
        if (kind !== "empty") s += row(kind, ix + 1, ix + iw - 1, yb, Math.min(rh - 4, sp.wood ? rh * .8 : rh * .78), r + zi * 2); }
      if (zi) s += `<rect x="${ix}" y="${n1(z[0] - 3)}" width="${iw}" height="4" fill="#15171b"/>`; });
    if (!ol.on) s += `<path d="${d}" fill="#000" opacity=".62"/>`;
    if (oc.on) s += `<path class="${P}frost" d="M${ix} ${n1(iy + ih * .7)}H${ix + iw}V${iy + ih}H${ix}Z" fill="url(#${u}-frs)"/>`;
    s += `</g><path d="${d}" fill="url(#${u}-gls2)"/><path d="M${n1(ix + iw * .62)} ${iy}L${n1(ix + iw * .42)} ${iy + ih}H${n1(ix + iw * .5)}L${n1(ix + iw * .7)} ${iy}Z" fill="#fff" fill-opacity=".06"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".6"/>`;
    return s;
  }
  function sdoor(o, x, y, w, h, sp) {
    const u = o.uid, ol = part(o, "light"), id = `${u}-sd${x}${y}`;
    let s = "";
    if (ol.on) { const d = rr(x + 2, y + 2, w - 4, h - 4, 1.5);
      s += `<path d="${d}" fill="url(#${u}-int)"/><clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})"><path d="${d}" fill="url(#${u}-litc)" opacity="${Lt(ol)}"/>`;
      if (sp.freezer) s += `<rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${n1(h * .22)}" rx="2" fill="#dfe8ef" opacity=".9"/><rect x="${x + 8}" y="${n1(y + 8 + h * .14)}" width="${w - 16}" height="3" rx="1" fill="#9aa3ad"/>`;
      const top = sp.freezer ? y + h * .3 : y + 6, n = Math.max(1, Math.round((y + h - top) / 24)), rh = (y + h - 4 - top) / n;
      for (let r = 0; r < n; r++) { const yb = top + rh * (r + 1); s += `<path d="M${x + 3} ${n1(yb)}H${x + w - 3}" stroke="#cfd6dd" stroke-width="1.4"/>` + row(sp.inner || (r % 2 ? "beer" : "soda"), x + 4, x + w - 6, yb - 1, Math.min(rh - 3, 14), r); }
      s += `</g>`;
      const dw = w * .5, sk = 5;
      s += `<path d="M${x} ${y}L${n1(x - dw * .25)} ${y - sk}V${y + h + sk}L${x} ${y + h}Z" fill="#000" opacity=".25"/>` +
        `<path d="M${x} ${y}L${n1(x + dw)} ${y - sk}V${y + h + sk}L${x} ${y + h}Z" fill="url(#${u}-v)"/>` + (metal(o) ? `<path d="M${x} ${y}L${n1(x + dw)} ${y - sk}V${y + h + sk}L${x} ${y + h}Z" fill="url(#${u}-brs)"/>` : "") +
        `<path d="M${x} ${y}L${n1(x + dw)} ${y - sk}V${y + h + sk}L${x} ${y + h}Z" fill="#000" opacity=".22"/><path d="M${n1(x + dw)} ${y - sk}V${y + h + sk}" stroke="#fff" stroke-opacity=".35"/>` +
        `<ellipse cx="${x + w / 2}" cy="${y + h + 8}" rx="${w * .6}" ry="5" fill="url(#${u}-pool)" opacity="${Lt(ol)}"/>`;
    } else s += (sp.panel ? `<path d="${rr(x, y, w, h, sp.r || 2)}" fill="url(#${u}-v)"/><path d="${rr(x, y, w, h, sp.r || 2)}" fill="url(#${u}-g)" opacity=".35"/><path d="${rr(x, y, w, h, sp.r || 2)}" fill="url(#${u}-fx)"/>` : fin(o, rr(x, y, w, h, sp.r || 2))) +
      `<path d="${rr(x, y, w, h, sp.r || 2)}" fill="none" stroke="#000" stroke-opacity=".35"/>` + (sp.handle === "recess" ? `<path d="M${x + w - 6} ${y + h * .3}V${y + h * .7}" stroke="#000" stroke-opacity=".5" stroke-width="2.4"/>` : sp.handle === "chrome" ? `<path d="M${x + w - 8} ${y + 10}V${y + 34}" stroke="url(#${u}-chr)" stroke-width="4" stroke-linecap="round"/><circle cx="${x + w - 8}" cy="${y + 10}" r="3" fill="url(#${u}-chr)"/>` : sp.handle === "v" ? vhandle(o, x + w - 9, y + 6, y + h - 6) : "");
    return s;
  }
  const P2 = (z) => [["cool", "Cooling"], ["light", "Interior light"]].concat(z ? [["up", "Upper zone"], ["low", "Lower zone"]] : []).map((p) => ({ id: p[0], name: p[1] }));
  const ic = (id, name, colors, render, o2) => Object.assign({ id, name, colors, picker: true, colorLabel: "Finish", render, parts: P2() }, o2 || {});
  const glassOpt = (wine) => ({ options: [{ id: "fill", name: "Contents", values: wine ? WINEF : FILL }] });
  const led2 = (o, x, y) => { const oc = part(o, "cool"); return led(o, x, y, 1.3, oc.on, CYAN, "hb"); };

  const icons = [
    ic("white-cube-fridge", "White cube fridge", [BK, WH, SS, RD, NV], (o) => svgM(o, scene(o, "kitchen", 176) + counterTop(o, 118) +
      box(o, 64, 52, 66, 66, 14, 4) + sdoor(o, 66, 54, 62, 58, { handle: "recess", inner: "soda" }) + `<rect x="66" y="112" width="62" height="5" fill="#000" opacity=".35"/>` + led2(o, 72, 115))),
    ic("3-1-cu-ft-mini", "3.1 cu ft mini", [BK, SS, WH, RD], (o) => svgM(o, scene(o, "dorm", 176) +
      box(o, 58, 54, 82, 120, 16, 3) + sdoor(o, 60, 56, 78, 106, { handle: "v", freezer: true }) + kickVent(o, 62, 164, 74, 8) + led2(o, 132, 168))),
    ic("retro-mini-fridge", "Retro mini fridge", [MI, RD, BB, CR, PK, BK], (o) => { const u = o.uid, body = "M56 176V72Q56 44 84 44H116Q144 44 144 72V176Z";
      return svgM(o, scene(o, "kitchen", 176) + sh(o, 102, 178, 50, 4) + `<path d="${body}" fill="url(#${u}-c)"/><path d="${body}" fill="url(#${u}-g)" opacity=".3"/>` +
        sdoor(o, 62, 52, 76, 112, { handle: "chrome", r: 18, panel: true }) + `<path d="M66 60Q72 52 86 51" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>` +
        `<rect x="88" y="150" width="24" height="5" rx="2.5" fill="url(#${u}-chr)"/>` + `<path d="M56 166H144" stroke="url(#${u}-chr)" stroke-width="2"/>` + [64, 136].map((x) => `<rect x="${x - 4}" y="174" width="8" height="5" rx="1.5" fill="url(#${u}-chr)"/>`).join("") + led2(o, 100, 170)); }),
    ic("2-door-dorm-fridge", "2-door dorm fridge", [BK, WH, SS, BSS], (o) => { const ol = part(o, "light");
      return svgM(o, scene(o, "dorm", 176) + box(o, 58, 44, 82, 130, 16, 3) +
        fin(o, rr(60, 46, 78, 34, 2)) + `<path d="${rr(60, 46, 78, 34, 2)}" fill="none" stroke="#000" stroke-opacity=".35"/>` + vhandle(o, 129, 50, 76) +
        sdoor(o, 60, 82, 78, 82, { handle: "v" }) + kickVent(o, 62, 166, 74, 7) + led2(o, 68, 169)); }),
    ic("panel-cube-fridge", "Panel cube fridge", [BB, WH, "#3a3d44", PK, NV], (o) => svgM(o, scene(o, "kitchen", 176) +
      box(o, 54, 56, 90, 112, 16, 4, true) + `<path d="${rr(54, 56, 90, 112, 4)}" fill="#2a2d33"/>` + sdoor(o, 57, 59, 84, 104, { panel: true, r: 3 }) +
      `<rect x="57" y="164" width="84" height="3" fill="#000" opacity=".4"/><rect x="62" y="168" width="8" height="8" fill="#1a1c20"/><rect x="128" y="168" width="8" height="8" fill="#1a1c20"/>` + led2(o, 99, 165.5))),

    ic("15-inch-under-counter", "15-inch under-counter", [BK, SS, BSS], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "kitchen", 176) + counterTop(o, 30, [70, 130]) + `<rect x="70" y="36" width="60" height="134" fill="#08090b"/>` +
        gdoor(o, 72, 38, 56, 122, { frame: "ss" }) + vhandle(o, 120, 46, 150) + tdisp(o, 100, 44, oc) + kickVent(o, 72, 161, 56, 8)); }, glassOpt()),
    ic("beverage-center", "Beverage center", [BK, SS, WH], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "bar", 176) + box(o, 50, 44, 96, 130, 16, 3) +
        gdoor(o, 54, 48, 88, 110, { frame: "ss" }) + vhandle(o, 132, 56, 150) + tdisp(o, 98, 54, oc) + kickVent(o, 54, 162, 88, 8)); }, glassOpt()),
    ic("countertop-cooler", "Countertop cooler", [BK, SS, WH, RD], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "kitchen", 176) + counterTop(o, 132) + box(o, 60, 62, 76, 70, 14, 3) +
        gdoor(o, 63, 65, 70, 56, { frame: "blk", rows: 2 }) + `<rect x="63" y="122" width="70" height="8" fill="#0c0d10"/>` + tdisp(o, 98, 126, oc) + vhandle(o, 124, 70, 116, "blf")); }, glassOpt()),
    ic("dual-zone-beverage", "Dual-zone beverage", [BK, SS, BSS], (o) => { const ou = part(o, "up"), ow = part(o, "low"), oc = part(o, "cool");
      return svgM(o, scene(o, "bar", 176) + box(o, 50, 40, 96, 134, 16, 3) +
        gdoor(o, 54, 44, 88, 116, { frame: "ss", zones: [[49, 98], [102, 155]] }) + vhandle(o, 132, 52, 152) +
        tdisp(o, 84, 54, sub(o, oc.on && ou.on)) + tdisp(o, 84, 108, sub(o, oc.on && ow.on), "#7ee08a") + kickVent(o, 54, 163, 88, 8)); }, Object.assign({ parts: P2(1) }, glassOpt())),
    ic("outdoor-fridge", "Outdoor fridge", [SS, BSS, BK], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "patio", 176) + `<g class="hda-bg"><rect x="30" y="40" width="140" height="8" fill="url(#${o.uid}-ct)"/><rect x="30" y="48" width="140" height="122" fill="#8a949e" opacity=".35"/></g>` +
        `<rect x="56" y="50" width="88" height="120" fill="#0a0b0d"/>` + fin(o, rr(58, 52, 84, 116, 2)) + gdoor(o, 62, 56, 76, 96, { frame: "ss" }) + vhandle(o, 128, 62, 146) +
        `<circle cx="70" cy="146" r="2.4" fill="url(#${o.uid}-chr)"/><rect x="69" y="146" width="2" height="2.6" fill="#333"/>` + tdisp(o, 100, 160, oc) + `<rect x="62" y="154" width="76" height="12" fill="url(#${o.uid}-slt)" opacity=".7"/>`); }, glassOpt()),

    ic("12-bottle-wine-cooler", "12-bottle wine cooler", [BK, SS, BSS], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "kitchen", 176) + counterTop(o, 140) + box(o, 66, 48, 64, 92, 12, 3) +
        gdoor(o, 68, 50, 60, 76, { frame: "blk", rows: 4, warm: false }) + `<rect x="68" y="127" width="60" height="11" fill="#0c0d10"/>` + tdisp(o, 98, 132, oc) + kickVent(o, 70, 132, 14, 5)); }, glassOpt(1)),
    ic("18-bottle-wine-cooler", "18-bottle wine cooler", [BK, SS, BSS], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "bar", 176) + box(o, 60, 50, 76, 124, 14, 3) +
        gdoor(o, 63, 53, 70, 106, { frame: "ss", rows: 6, wood: true, warm: true }) + vhandle(o, 124, 60, 150) + tdisp(o, 98, 60, oc, AMB) + kickVent(o, 63, 162, 70, 8)); }, glassOpt(1)),
    ic("46-bottle-dual-zone", "46-bottle dual-zone", [SS, BK, BSS], (o) => { const ou = part(o, "up"), ow = part(o, "low"), oc = part(o, "cool");
      return svgM(o, scene(o, "kitchen", 176) + counterTop(o, 30, [56, 144]) + `<rect x="56" y="36" width="88" height="134" fill="#08090b"/>` +
        gdoor(o, 58, 38, 84, 122, { frame: "ss", wood: true, warm: true, zones: [[43, 92], [96, 155]], rows: 4 }) + vhandle(o, 132, 46, 152) +
        tdisp(o, 82, 47, sub(o, oc.on && ou.on), AMB) + tdisp(o, 82, 101, sub(o, oc.on && ow.on), AMB) + kickVent(o, 58, 161, 84, 8)); }, Object.assign({ parts: P2(1) }, glassOpt(1))),
    ic("wine-column", "Wine column", [SS, BK, BSS], (o) => { const oc = part(o, "cool");
      return svgM(o, scene(o, "kitchen", 180) + `<g class="hda-bg"><rect x="54" y="4" width="92" height="174" fill="url(#${o.uid}-wd)"/><path d="M54 4V178M146 4V178" stroke="#000" stroke-opacity=".45"/></g>` +
        `<rect x="66" y="10" width="68" height="164" fill="#08090b"/>` + gdoor(o, 68, 12, 64, 152, { frame: "ss", wood: true, warm: true, rows: 9 }) + vhandle(o, 122, 20, 156) + tdisp(o, 100, 18, oc, AMB) + kickVent(o, 68, 165, 64, 7) +
        `<g class="hda-bg"><rect x="0" y="100" width="54" height="4" fill="url(#${o.uid}-ct)"/><rect x="0" y="104" width="54" height="72" fill="url(#${o.uid}-cab)"/><rect x="146" y="100" width="54" height="4" fill="url(#${o.uid}-ct)"/><rect x="146" y="104" width="54" height="72" fill="url(#${o.uid}-cab)"/></g>`); }, glassOpt(1)),

    ic("skincare", "Skincare fridge", [WH, PK, MI, BK], (o) => { const u = o.uid, ol = part(o, "light"), body = rr(66, 70, 64, 72, 10);
      return svgM(o, scene(o, "vanity", 176) + `<g class="hda-bg"><rect x="0" y="142" width="200" height="8" fill="#f4f1ec" opacity=".85"/><rect x="0" y="150" width="200" height="26" fill="#d9d2c6" opacity=".35"/></g>` +
        sh(o, 100, 143, 40, 3) + `<path d="${body}" fill="url(#${u}-c)"/><path d="${body}" fill="url(#${u}-g)" opacity=".35"/>` +
        gdoor(o, 70, 74, 56, 58, { frame: "fin", fw: 4, rows: 2, fill: "skin", warm: true }) +
        (ol.on ? `<path d="${rr(72, 76, 52, 54, 6)}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".9"/><path d="${rr(68, 72, 60, 62, 8)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="5"/>` : `<path d="${rr(72, 76, 52, 54, 6)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.6"/>`) +
        led2(o, 98, 137) + `<rect x="86" y="62" width="24" height="6" rx="3" fill="url(#${u}-c)"/>`); }, { parts: P2() }),
    ic("gamer", "Gaming fridge", [BK, WH, "#3a1f5c"], (o) => { const u = o.uid, ol = part(o, "light"), oc = part(o, "cool");
      const cols = ["#ff3b6b", "#ffb547", "#7ee08a", "#5ad1ff", "#b06cff"], d = rr(56, 52, 88, 112, 4);
      let rgb = "";
      if (ol.on) for (let i = 0; i < 10; i++) { const t = i / 10, pt = t < .25 ? [56 + 352 * t, 52] : t < .5 ? [144, 52 + 448 * (t - .25)] : t < .75 ? [144 - 352 * (t - .5), 164] : [56, 164 - 448 * (t - .75)];
        rgb += `<circle class="${o.anim ? P + "chase" : ""}" style="animation-delay:${n1(i * .4)}s" cx="${n1(pt[0])}" cy="${n1(pt[1])}" r="7" fill="${cols[i % 5]}" opacity=".5"/>`; }
      return svgM(o, scene(o, "game", 176) + box(o, 52, 48, 96, 126, 14, 4) + rgb +
        `<path d="${d}" fill="none" stroke="${ol.on ? "url(#" + u + "-rgb)" : "#2a2d33"}" stroke-width="3"/>` +
        gdoor(o, 58, 54, 84, 108, { frame: "blk", fw: 4 }) + vhandle(o, 132, 62, 152, "blf") + tdisp(o, 100, 168, oc, "#b06cff"),
        `<linearGradient id="${u}-rgb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3b6b"/><stop offset=".33" stop-color="#ffb547"/><stop offset=".66" stop-color="#5ad1ff"/><stop offset="1" stop-color="#b06cff"/></linearGradient>`); }, glassOpt()),
  ];

  (window.HDA = window.HDA || []).push({
    id: "minifridge", tab: "Mini fridges & wine", group: "Appliances", kind: "device",
    intro: "Sixteen mini fridges, beverage centers and wine coolers. Each has a Cooling chip (temperature display, frost on the glass) and an Interior light chip (glass doors light their shelves; solid doors swing ajar to show the lit inside). Dual-zone units switch each zone. Glass doors take a Contents menu: soda cans, wine bottles, beer, mixed or empty. The slider sets how cold it runs.",
    
    css: css2, icons,
  });
})();
