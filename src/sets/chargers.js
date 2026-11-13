(function () {
  const P = "hda-chargers-";
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
.hda-chargers-flow{stroke-dashoffset:0}
.hda-anim .hda-chargers-flow{animation:hda-chargers-flow 1s linear infinite}
@keyframes hda-chargers-flow{to{stroke-dashoffset:-18}}
.hda-chargers-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-chargers-flk{animation:hda-chargers-flk .5s ease-in-out infinite alternate}
@keyframes hda-chargers-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-chargers-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-chargers-spin{animation:hda-chargers-spin 1s linear infinite}
@keyframes hda-chargers-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-chargers-blink{animation:hda-chargers-blink 1.2s steps(1,end) infinite}
@keyframes hda-chargers-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-chargers-chase{opacity:.18}
.hda-anim .hda-chargers-chase{animation:hda-chargers-chase 4s linear infinite}
@keyframes hda-chargers-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-chargers-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-chargers-bub{animation:hda-chargers-bub 2s ease-in infinite}
@keyframes hda-chargers-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-chargers-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-chargers-rip{animation:hda-chargers-rip 2.2s ease-out infinite}
@keyframes hda-chargers-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-chargers-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-chargers-mist{animation:hda-chargers-mist 1.6s ease-in-out infinite}
@keyframes hda-chargers-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-chargers-heat{opacity:0}
.hda-anim .hda-chargers-heat{animation:hda-chargers-heat 2.6s ease-out infinite}
@keyframes hda-chargers-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-chargers-heat.hda-chargers-still{opacity:.4}
.hda-anim .hda-chargers-heat.hda-chargers-still{opacity:0}
`;
  const css2 = css + `
.hda-anim .hda-chargers-sweep{animation:hda-chargers-sweep 1.6s linear infinite}
@keyframes hda-chargers-sweep{0%,100%{opacity:.25}30%{opacity:1}60%{opacity:.25}}
`;
  const BR = ["#f5b800", "#c8102e", "#00a3ad", "#8dc63f", "#f47c20", "#1f5fbf", "#7d868f"];
  const brand = (k) => BR.slice(k % 7).concat(BR.slice(0, k % 7));
  const full = (o) => o.level >= .995;
  const pct = (o) => String(Math.round(o.level * 100));

  function cextra(o) {
    const u = o.uid;
    return lg(u + "-cylv", 0, [[0, "#000", .45], [.22, "#fff", .32], [.4, "#fff", .05], [.8, "#000", .12], [1, "#000", .5]]) +
      lg(u + "-cylh", 1, [[0, "#000", .4], [.25, "#fff", .35], [.45, "#fff", .05], [.8, "#000", .15], [1, "#000", .5]]) +
      lg(u + "-wood", 1, [[0, "#c8996a"], [.35, "#a87a4e"], [1, "#5e3d22"]]) + lg(u + "-stn2", 1, [[0, "#e6e3dc"], [1, "#a9a49a"]]) +
      lg(u + "-hs", 1, [[0, "#3c4148"], [.35, "#24282d"], [1, "#0c0e11"]]) + lg(u + "-hst", 0, [[0, "#30353c"], [.5, "#4a5058"], [1, "#2a2e34"]]) +
      `<pattern id="${u}-peg" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#b08b5c" fill-opacity=".42"/><circle cx="6" cy="6" r="1.4" fill="#1a120a" fill-opacity=".75"/><circle cx="6.3" cy="6.5" r="1.4" fill="#fff" fill-opacity=".08"/></pattern>` +
      `<pattern id="${u}-grn" width="60" height="7" patternUnits="userSpaceOnUse"><path d="M0 2C14 1 30 3.4 60 2M0 5C20 6 40 4 60 5.4" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".7"/></pattern>` +
      `<pattern id="${u}-sub" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="20" height="10" fill="#fff" fill-opacity=".09"/><path d="M0 .5H20M0 5.5H20M10.5 .5V5.5M.5 5.5V10.5" stroke="#000" stroke-opacity=".28" fill="none"/><path d="M1 1.6H9M11 6.6H19" stroke="#fff" stroke-opacity=".12"/></pattern>` +
      `<pattern id="${u}-mesh" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".8" fill="#000" fill-opacity=".65"/></pattern>`;
  }
  const svgC = (o, body, extra) => svg(o, body, cextra(o) + (extra || ""));
  const bench = (o, fy, wall) => `<g class="hda-bg">${bench0(o, fy, wall)}</g>`;
  const bench0 = (o, fy, wall) => { const u = o.uid;
    return (wall === "block" ? room(o, fy, "block") : `<rect width="200" height="${fy}" fill="url(#${u}-peg)"/>`) +
      `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-wood)"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-grn)"/><path d="M0 ${fy}H200" stroke="#ffe2bd" stroke-opacity=".35"/><path d="M0 ${fy + 3}H200" stroke="#000" stroke-opacity=".15"/>`; };
  const counter = (o, fy) => `<g class="hda-bg">${counter0(o, fy)}</g>`;
  const counter0 = (o, fy) => { const u = o.uid;
    return `<rect width="200" height="${fy}" fill="url(#${u}-sub)"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-stn2)" opacity=".75"/>` +
      [[24, .3], [70, .6], [120, .25], [160, .7], [100, .85], [40, .8], [180, .4]].map((p) => `<circle cx="${p[0]}" cy="${n1(fy + (200 - fy) * p[1])}" r="1" fill="#555" opacity=".35"/>`).join("") +
      `<path d="M0 ${fy}H200" stroke="#fff" stroke-opacity=".5"/>`; };

  const chg = (o, x, y, r, done, col) => !o.on ? led(o, x, y, r, false) : done ? led(o, x, y, r, true, GREEN, "hg") :
    `<g class="${P}blink">${led(o, x, y, r, true, col || RED, col === AMB ? "ho" : "hr")}</g>`;
  function bars(o, x, y, n, bw, bh, gap, f, vert) {
    f = f == null ? o.level : f; x = +x; y = +y; bw = +bw;
    const c = Math.max(f > 0 ? 1 : 0, Math.ceil(f * n - .001)), fl = f >= .995, col = c <= 1 && n > 2 ? (f < .2 ? RED : AMB) : GREEN; let s = "";
    for (let i = 0; i < n; i++) {
      const X = vert ? x : x + i * (bw + gap), Y = vert ? y - (i + 1) * (bh + gap) : y, lit = i < c, bl = lit && i === c - 1 && o.on && !fl;
      s += `<g${bl ? ` class="${P}blink"` : ""}>` + (lit ? `<rect x="${n1(X - 1.2)}" y="${n1(Y - 1.2)}" width="${n1(bw + 2.4)}" height="${n1(bh + 2.4)}" rx="1.5" fill="${col}" opacity=".3"/>` : "") +
        `<rect x="${n1(X)}" y="${n1(Y)}" width="${bw}" height="${bh}" rx=".7" fill="${lit ? col : "#2b3037"}"/></g>`;
    }
    return s;
  }
  const cellV = (o, x, by, w, h, wrap, band) => `<rect x="${x}" y="${by - h}" width="${w}" height="${h}" rx="1.6" fill="${wrap}"/>` +
    (band ? `<rect x="${x}" y="${n1(by - h * .62)}" width="${w}" height="${n1(h * .22)}" fill="${band}"/>` : "") +
    `<rect x="${x}" y="${by - h}" width="${w}" height="${h}" rx="1.6" fill="url(#${o.uid}-cylv)"/><rect x="${n1(x + w * .3)}" y="${n1(by - h - 2.6)}" width="${n1(w * .4)}" height="3" rx=".8" fill="url(#${o.uid}-mt)"/>` +
    `<path d="M${x + 1} ${by - h + 1.5}H${x + w - 1}" stroke="#d6dade" stroke-width="1.2"/>`;
  const cellH = (o, x, cy, len, dia, wrap, band) => `<rect x="${x}" y="${n1(cy - dia / 2)}" width="${len}" height="${dia}" rx="${n1(dia * .22)}" fill="${wrap}"/>` +
    (band ? `<rect x="${n1(x + len * .2)}" y="${n1(cy - dia / 2)}" width="${n1(len * .25)}" height="${dia}" fill="${band}"/>` : "") +
    `<rect x="${x}" y="${n1(cy - dia / 2)}" width="${len}" height="${dia}" rx="${n1(dia * .22)}" fill="url(#${o.uid}-cylh)"/><rect x="${x + len - .5}" y="${n1(cy - dia * .2)}" width="2.6" height="${n1(dia * .4)}" rx=".6" fill="url(#${o.uid}-mtv)"/>` +
    `<path d="M${x + len - 2} ${n1(cy - dia / 2 + 1)}V${n1(cy + dia / 2 - 1)}" stroke="#c9ced4" stroke-width="1.2"/>`;
  const box = (o, x, y, w, h, d, r) => { const u = o.uid, dy = d * .6;
    return (d ? `<path d="M${x + 2} ${y}L${x + d + 2} ${y - dy}H${x + w + d}L${x + w} ${y}Z" fill="url(#${u}-tp)"/><path d="M${x + w} ${y}L${x + w + d} ${y - dy}V${y + h - dy - 2}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>` : "") +
      face(o, rr(x, y, w, h, r || 4)) + `<path d="M${x + 3} ${y + 1.2}H${x + w - 3}" stroke="#fff" stroke-opacity=".35"/>`; };

  function pack(o, x, y, w, h, d, f, nb) {
    const u = o.uid, dy = d * .55, cap = h * .38, n = nb || 4, bw = Math.max(2.6, w * .085), tot = n * bw + (n - 1) * 1.6;
    return `<path d="M${x} ${y}L${x + d} ${n1(y - dy)}H${x + w + d}L${x + w} ${y}Z" fill="url(#${u}-hst)"/>` +
      `<path d="M${n1(x + w * .25)} ${n1(y - dy * .5)}H${n1(x + w * .8)}" stroke="#000" stroke-opacity=".45" stroke-width="1.6"/>` +
      `<path d="M${x + w} ${y}L${x + w + d} ${n1(y - dy)}V${n1(y - dy + cap)}L${x + w} ${n1(y + cap)}Z" fill="#101215"/>` +
      `<path d="M${x + w} ${n1(y + cap)}L${x + w + d} ${n1(y - dy + cap)}V${n1(y + h - dy - 2)}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>` +
      `<path d="${rr(x, y, w, cap + 3, 2.5)}" fill="url(#${u}-hs)"/>` +
      `<path d="M${x} ${n1(y + cap)}H${x + w}V${y + h - 3}Q${x + w} ${y + h} ${x + w - 3} ${y + h}H${x + 3}Q${x} ${y + h} ${x} ${y + h - 3}Z" fill="url(#${u}-v)"/>` +
      `<path d="M${x} ${n1(y + cap)}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-fx)"/><path d="M${x} ${n1(y + cap)}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-g)" opacity=".3"/>` +
      `<path d="M${x + 3} ${n1(y + cap + (h - cap) * .45)}H${x + w - 3}M${x + 3} ${n1(y + cap + (h - cap) * .7)}H${x + w - 3}" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>` +
      `<path d="M${x} ${y + h - 3}H${x + w}" stroke="#000" stroke-opacity=".5" stroke-width="2.5"/>` +
      bars(o, n1(x + w / 2 - tot / 2 - 3), n1(y + cap * .42), n, n1(bw), 2.6, 1.6, f) +
      `<circle cx="${n1(x + w / 2 + tot / 2 + 2.5)}" cy="${n1(y + cap * .42 + 1.3)}" r="1.9" fill="#3a3f46" stroke="#000" stroke-width=".5"/>` +
      `<path d="M${n1(x + d * .3 + w * .18)} ${n1(y - dy * .3)}L${n1(x + d * .7 + w * .18)} ${n1(y - dy * .75)}M${n1(x + d * .3 + w * .82)} ${n1(y - dy * .3)}L${n1(x + d * .7 + w * .82)} ${n1(y - dy * .75)}" stroke="#55606a" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="${rr(x + w * .36, y + cap - 2.5, w * .28, 5, 2)}" fill="url(#${u}-v)" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>` +
      `<path d="${rr(x - 1, y + h - 7, 6, 7, 2)}" fill="#14161a"/><path d="${rr(x + w - 5, y + h - 7, 6, 7, 2)}" fill="#14161a"/>` +
      `<path d="M${x + 2} ${y + 1}H${x + w - 2}" stroke="#fff" stroke-opacity=".25"/>`;
  }
  function charger(o, x, y, w, h, d, vents) {
    const u = o.uid, dy = d * .55;
    let v = "";
    for (let i = 0; i < (vents || 5); i++) v += `<rect x="${x + 6 + i * 4}" y="${n1(y + h * .22)}" width="2" height="${n1(h * .32)}" rx="1" fill="#000" opacity=".7"/>`;
    return sh(o, x + w / 2 + d / 2, y + h + 2, w * .62, 5) +
      `<path d="M${x} ${y}L${x + d} ${n1(y - dy)}H${x + w + d}L${x + w} ${y}Z" fill="url(#${u}-hst)"/><path d="M${x + w} ${y}L${x + w + d} ${n1(y - dy)}V${n1(y + h - dy - 2)}L${x + w} ${y + h}Z" fill="#0c0e11"/>` +
      `<path d="${rr(x, y, w, h, 4)}" fill="url(#${u}-hs)"/><path d="M${x} ${n1(y + h * .64)}H${x + w}V${n1(y + h * .8)}H${x}Z" fill="url(#${u}-v)"/>` +
      `<path d="M${x + w} ${n1(y + h * .64)}L${x + w + d} ${n1(y + h * .64 - dy)}V${n1(y + h * .8 - dy)}L${x + w} ${n1(y + h * .8)}Z" fill="url(#${u}-sd)"/>` + v +
      `<path d="M${x + 3} ${y + 1}H${x + w - 3}" stroke="#fff" stroke-opacity=".2"/>`;
  }
  const fan = (o, cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r + 1.5}" fill="#0b0d10"/><g class="${o.on && !full(o) ? P + "spin" : ""}" style="animation-duration:.45s">` +
    [0, 72, 144, 216, 288].map((a) => `<path d="M${cx} ${cy}L${n1(cx - r * .3)} ${n1(cy - r * .92)}Q${n1(cx + r * .3)} ${n1(cy - r)} ${n1(cx + r * .35)} ${n1(cy - r * .7)}Z" fill="#6a717a" transform="rotate(${a} ${cx} ${cy})"/>`).join("") +
    `<circle cx="${cx}" cy="${cy}" r="${n1(r * .25)}" fill="#3a3f46"/></g>` +
    [-.6, -.2, .2, .6].map((t) => `<path d="M${n1(cx - r * Math.sqrt(1 - t * t))} ${n1(cy + t * r)}H${n1(cx + r * Math.sqrt(1 - t * t))}" stroke="#2a2e34" stroke-width="1.6"/>`).join("") +
    `<circle cx="${cx}" cy="${cy}" r="${r + 1.5}" fill="none" stroke="#4a5058" stroke-width="1.5"/>`;
  const seq = (o, n, i) => Math.max(0, Math.min(1, o.level * n - i));

  const ic = (id, name, colors, label, render) => ({ id, name, colors, picker: true, colorLabel: label, render });
  const WH = "#eceef0", BK = "#2b2e33", GY = "#8a949e", BL = "#2f6db5", RD = "#b8323a", GN = "#3c7a52";
  const WR = ["#2f7d4f", "#e8eaec", "#2f7d4f", "#e8eaec"], WB = ["#e8eaec", "#2f6db5", "#e8eaec", "#2f6db5"];

  const icons = [
    ic("aa4", "4-bay AA charger", [WH, BK, GY, BL, GN], "Body", (o) => { const th = [.86, 1, .93, .97];
      return svgC(o, counter(o, 150) + sh(o, 104, 160, 64, 5) + box(o, 44, 122, 108, 32, 10, 5) +
        [0, 1, 2, 3].map((i) => `<path d="${rr(57 + i * 24, 110, 18, 9, 3)}" fill="#0d0f12"/>` + cellV(o, 59 + i * 24, 117, 14, 56, WR[i], i % 2 ? "#2f7d4f" : "#e8eaec") +
          chg(o, 66 + i * 24, 138, 2, o.level >= th[i])).join("") +
        `<path d="M50 148H146" stroke="#000" stroke-opacity=".15"/>` + `<g class="hda-bg">` + cellH(o, 150, 176, 34, 10, "#2f7d4f", "#e8eaec") + `</g>`); }),

    ic("aalcd", "LCD AA charger", [BK, WH, GY, BL, RD], "Body", (o) => { const u = o.uid, off = [0, -9, 5, -4];
      const pc = off.map((d) => Math.max(0, Math.min(100, Math.round(o.level * 100 + d * (1 - o.level) * 2))));
      return svgC(o, counter(o, 158) + sh(o, 100, 170, 70, 5) + box(o, 32, 70, 130, 96, 8, 6) +
        [0, 1, 2, 3].map((i) => `<path d="${rr(42, 77 + i * 15, 104, 13, 4)}" fill="#0d0f12"/><path d="M128 ${80 + i * 15}H144" stroke="url(#${u}-mt)" stroke-width="6"/>` + cellH(o, 50, 83.5 + i * 15, 70, 11, WB[i], i % 2 ? "#e8eaec" : "#2f6db5") + `<rect x="123" y="${78 + i * 15}" width="4" height="11" rx="1" fill="url(#${u}-mtv)"/>`).join("") +
        `<path d="${rr(40, 138, 114, 22, 3)}" fill="#0b0d10"/>` + `<path d="${rr(42, 140, 110, 18, 2)}" fill="url(#${u}-lcd)"/>` +
        pc.map((v, i) => digits(o.on ? String(v) : "--", 46 + i * 27 + (String(v).length < 3 && o.on ? 5.8 : 0), 144, 8, o.on ? (v >= 100 ? GREEN : CYAN) : "#2b3a40")).join("")); }),

    ic("wall2", "Wall-plug charger", [WH, BK, GY, BL, "#d8cfbd"], "Body", (o) => { const u = o.uid;
      return svgC(o, counter(o, 164) + `<path d="${rr(68, 40, 64, 104, 4)}" fill="#f2f2ee"/><path d="${rr(68, 40, 64, 104, 4)}" fill="url(#${u}-fx)"/>` + screw(100, 136, 1.6) +
        sh(o, 102, 134, 36, 4) + box(o, 72, 50, 56, 82, 6, 8) +
        `<path d="${rr(78, 64, 44, 54, 4)}" fill="#0d0f12"/>` + cellV(o, 82, 114, 16, 48, "#2f6db5", "#e8eaec") + cellV(o, 102, 114, 16, 48, "#2f6db5", "#e8eaec") +
        chg(o, 90, 58, 1.8, full(o)) + chg(o, 110, 58, 1.8, o.level > .95) + `<path d="M78 124H122" stroke="#000" stroke-opacity=".2"/>` +
        `<g class="hda-bg">` + cellH(o, 30, 184, 34, 10, "#2f6db5", "#e8eaec") + cellH(o, 140, 180, 34, 10, "#2f6db5", "#e8eaec") + `</g>`); }),

    ic("univ", "Universal charger", [GY, BK, WH, BL, GN], "Body", (o) => { const u = o.uid;
      return svgC(o, bench(o, 150) + sh(o, 100, 168, 74, 5) + box(o, 24, 92, 150, 70, 10, 6) +
        `<path d="${rr(32, 98, 70, 26, 5)}" fill="#0d0f12"/>` + cellH(o, 36, 111, 56, 22, "#1d1f24", "#d9a514") + `<rect x="94" y="100" width="5" height="22" rx="1" fill="url(#${u}-mtv)"/>` +
        `<path d="${rr(32, 128, 62, 20, 5)}" fill="#0d0f12"/>` + cellH(o, 36, 138, 48, 17, "#1d1f24", "#c8102e") + `<rect x="87" y="130" width="5" height="17" rx="1" fill="url(#${u}-mtv)"/>` +
        `<path d="${rr(110, 98, 30, 40, 4)}" fill="#0d0f12"/><path d="${rr(113, 104, 24, 32, 2.5)}" fill="#e3e6ea"/><path d="${rr(113, 104, 24, 32, 2.5)}" fill="url(#${u}-cylv)"/><rect x="113" y="112" width="24" height="10" fill="#2f6db5"/>` +
        `<path d="M118 99h6v6h-6zM127 99h6v6h-6z" fill="url(#${u}-mt)"/>` +
        `<path d="${rr(146, 100, 22, 40, 3)}" fill="#0b0d10"/>` + bars(o, 152, 136, 5, 10, 4.5, 2, null, true) +
        chg(o, 124, 150, 1.8, full(o)) + chg(o, 64, 156, 1.8, full(o))); }),

    ic("li", "18650 charger", [BK, WH, GY, "#4a6f8f", RD], "Body", (o) => { const u = o.uid;
      return svgC(o, bench(o, 150, "block") + sh(o, 100, 170, 70, 5) + box(o, 30, 82, 140, 82, 8, 6) +
        [0, 1].map((i) => { const y = 92 + i * 30, v = Math.min(100, Math.round(o.level * 100 + (i ? -6 : 0) * (1 - o.level)));
          return `<path d="${rr(38, y, 96, 24, 6)}" fill="#0d0f12"/><path d="M120 ${y + 12}H132" stroke="#9aa1a9" stroke-width="3"/><rect x="112" y="${y + 2}" width="8" height="20" rx="2" fill="url(#${u}-mtv)"/>` +
            cellH(o, 42, y + 12, 68, 20, i ? "#7a3fd8" : "#2f6db5", i ? "#5a2fb0" : "#1f4f9f") +
            `<path d="${rr(140, y + 1, 24, 22, 2)}" fill="url(#${u}-lcd)"/>` + digits(o.on ? (v >= 100 ? "99" : String(v)) : "--", 145, y + 7, 9, o.on ? (v >= 100 ? GREEN : CYAN) : "#2b3a40"); }).join("") +
        chg(o, 152, 150, 1.6, full(o))); }),

    ic("usbc", "USB-C AA charger", [WH, BK, BL, GY, "#e8752a"], "Body", (o) => { const u = o.uid, cd = "M144 140C170 140 176 160 204 158";
      return svgC(o, counter(o, 150) + sh(o, 100, 166, 52, 5) + tube(cd, 4, BLKP) + box(o, 56, 112, 84, 50, 14, 8) +
        [0, 1, 2, 3].map((i) => { const x = 70 + i * 16;
          return `<ellipse cx="${x + 7}" cy="106" rx="9" ry="3.2" fill="#0d0f12"/>` + cellV(o, x, 106, 14, 46, i % 2 ? "#e8eaec" : "#3a3f46", i % 2 ? "#2f6db5" : "#d9a514"); }).join("") +
        [0, 1, 2, 3].map((i) => o.on && !full(o) ? `<g class="${P}sweep" style="animation-delay:${n1(i * .4)}s">${led(o, 74 + i * 14, 140, 1.8, true, CYAN, "hb")}</g>` : led(o, 74 + i * 14, 140, 1.8, o.on, GREEN, "hg")).join("") +
        `<rect x="138" y="136" width="8" height="5" rx="2" fill="#15171a"/>`); }),

    ic("camera", "Camera charger", [BK, GY, WH, "#4a5058", BL], "Body", (o) => { const u = o.uid;
      return svgC(o, counter(o, 140) + sh(o, 84, 164, 54, 5) + box(o, 36, 128, 96, 30, 10, 8) +
        `<path d="M52 128L60 98H124L118 128Z" fill="#1d2025"/><path d="M60 98H124L132 92H68Z" fill="#3a3f46"/><path d="M118 128L124 98L132 92L126 122Z" fill="#0f1114"/>` +
        `<path d="M64 104H118L114 120H60Z" fill="#9aa1a9" opacity=".55"/><path d="M68 108H110M66 113H104" stroke="#1d2025" stroke-width="1.4" opacity=".6"/>` +
        chg(o, 52, 143, 2.2, full(o), ORNG) + `<path d="M58 141H74M58 145H70" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>` +
        `<path d="${rr(140, 112, 50, 40, 6)}" fill="#24272c"/><path d="M146 112L152 104H170L174 112Z" fill="#2c3036"/><circle cx="162" cy="134" r="15" fill="#15171a"/><circle cx="162" cy="134" r="10" fill="#3b4250"/><circle cx="159" cy="131" r="3.5" fill="#9fb6d8" opacity=".6"/><rect x="176" y="116" width="8" height="5" rx="1" fill="#555"/>`); }),

    ic("drone", "Drone battery hub", [GY, BK, WH, "#4a5058", "#d8cfbd"], "Body", (o) => { const u = o.uid;
      return svgC(o, bench(o, 150) + sh(o, 100, 168, 78, 5) + box(o, 22, 138, 156, 24, 8, 6) +
        [0, 1, 2, 3].map((i) => { const x = 30 + i * 36, f = seq(o, 4, i);
          return `<path d="M${x} 140V86Q${x} 78 ${x + 8} 78H${x + 24}Q${x + 32} 78 ${x + 32} 86V140Z" fill="#c9ced4"/><path d="M${x} 140V86Q${x} 78 ${x + 8} 78H${x + 24}Q${x + 32} 78 ${x + 32} 86V140Z" fill="url(#${u}-cylv)" opacity=".7"/>` +
            `<path d="M${x + 4} 102H${x + 28}" stroke="#000" stroke-opacity=".2"/><path d="${rr(x + 6, 84, 20, 12, 2)}" fill="#2a2e34"/>` + bars({ on: o.on && f > 0 && f < 1, level: f, anim: o.anim }, x + 8, 88.5, 4, 3, 3, 1.5, f) +
            chg(o, x + 16, 150, 1.6, f >= 1, f > 0 ? RED : AMB); }).join("") +
        `<path d="M28 154H172" stroke="#000" stroke-opacity=".15"/>`); }),

    ic("ebike", "E-bike battery dock", [BK, GY, WH, BL, RD], "Body", (o) => { const u = o.uid, cd = "M150 150C150 170 120 180 96 176";
      return svgC(o, room(o, 150, "block") + sh(o, 96, 178, 70, 6) +
        `<path d="M40 166L48 150H148L142 166Z" fill="#2a2e34"/><path d="M40 166H142V174H40Z" fill="#15171a"/>` +
        `<g transform="rotate(-8 96 110)"><path d="${rr(40, 108, 116, 44, 18)}" fill="url(#${u}-v)"/><path d="${rr(40, 108, 116, 44, 18)}" fill="url(#${u}-cylh)" opacity=".7"/>` +
        `<path d="${rr(40, 108, 26, 44, 14)}" fill="#1a1d22"/><path d="${rr(130, 108, 26, 44, 14)}" fill="#1a1d22"/><path d="M70 118H126" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="${rr(78, 136, 40, 9, 3)}" fill="#0b0d10"/>` + bars(o, 81, 138.5, 5, 5.4, 4, 1.8) + `<circle cx="52" cy="130" r="4" fill="#3a3f46"/></g>` +
        `<path d="${rr(150, 160, 40, 20, 4)}" fill="url(#${u}-hs)"/>` + tube(cd, 3, BLKP) + tube("M190 168C200 168 196 150 204 146", 3, BLKP) + chg(o, 182, 166, 1.8, full(o)) +
        sh(o, 170, 182, 22, 3)); }),

    ic("p12", "12V compact", brand(0), "Brand color", (o) => svgC(o, bench(o, 140) + charger(o, 62, 132, 66, 26, 10) +
      pack(o, 70, 96, 48, 38, 9) + chg(o, 120, 148, 1.8, full(o)) +
      `<g class="hda-bg"><path d="${rr(146, 126, 30, 22, 4)}" fill="#e8b400" transform="rotate(-6 160 136)"/><circle cx="158" cy="137" r="6" fill="#1d1f24" transform="rotate(-6 160 136)"/>` +
      [24, 32, 38].map((x, i) => `<path d="M${x} ${168 + i * 4}l8 -2" stroke="#9aa1a9" stroke-width="2" stroke-linecap="round"/>`).join("") + `</g>`)),

    ic("p18", "18V charger", brand(1), "Brand color", (o) => svgC(o, bench(o, 136) + charger(o, 44, 128, 100, 30, 14) +
      pack(o, 54, 82, 74, 48, 13) + chg(o, 130, 147, 2, false) + led(o, 122, 147, 2, o.on && full(o), GREEN, "hg") +
      `<path d="${rr(138, 150, 10, 4, 2)}" fill="#0c0e11"/>` + tube("M152 150C176 150 170 176 204 178", 3.5, BLKP))),

    ic("rapid", "Rapid charger", brand(2), "Brand color", (o) => svgC(o, bench(o, 134) + charger(o, 34, 124, 124, 38, 14, 0) +
      fan(o, 56, 141, 11) + `<path d="${rr(118, 134, 30, 12, 2)}" fill="url(#${o.uid}-lcd)"/>` + digits(o.on ? pct(o) : "--", 122, 136.5, 7, o.on ? (full(o) ? GREEN : ORNG) : "#2b3a40") +
      pack(o, 72, 78, 70, 48, 13) + chg(o, 106, 150, 1.8, full(o)) +
      (o.on && !full(o) ? [0, 1, 2].map((i) => `<path class="${P}heat" style="animation-delay:-${n1(i * .8)}s" d="M${30 - i * 6} 140q-6 -2 -12 0" fill="none" stroke="#cfe8ff" stroke-width="1.2"/>`).join("") : ""))),

    ic("dual", "Dual-bay charger", brand(3), "Brand color", (o) => { const f1 = seq(o, 2, 0), f2 = seq(o, 2, 1);
      return svgC(o, bench(o, 138, "block") + charger(o, 16, 130, 164, 30, 12) +
        pack(o, 24, 86, 66, 46, 12, f1) + pack(o, 100, 86, 66, 46, 12, f2) +
        chg(o, 56, 152, 1.8, f1 >= 1) + chg(o, 132, 152, 1.8, f2 >= 1, f1 < 1 ? AMB : RED)); }),

    ic("six", "6-port charger", brand(4), "Brand color", (o) => { const u = o.uid, has = [1, 1, 1, 0, 1, 1], N = 5; let k = 0, s = "";
      for (let i = 0; i < 6; i++) { const x = 14 + i * 29;
        s += `<path d="${rr(x, 128, 25, 5, 1.5)}" fill="#0c0e11"/>`;
        if (has[i]) { const f = seq(o, N, k); k++; s += pack(o, x + 1, 98, 22, 30, 5, f, 3) + chg(o, x + 12, 150, 1.6, f >= 1, f > 0 ? RED : AMB); }
        else s += led(o, x + 12, 150, 1.6, false); }
      return svgC(o, bench(o, 130) + charger(o, 8, 132, 180, 28, 6, 0) + s); }),

    ic("big", "40V outdoor pack", brand(5), "Brand color", (o) => svgC(o, bench(o, 150, "block") + charger(o, 40, 140, 108, 32, 16) +
      pack(o, 52, 66, 82, 76, 16, null, 5) + chg(o, 136, 160, 2, full(o)) +
      `<path d="M58 60Q94 44 128 60" fill="none" stroke="#14161a" stroke-width="7" stroke-linecap="round" transform="translate(4 -2)"/>` +
      `<g class="hda-bg"><path d="M150 186a14 14 0 1 1 28 0" fill="#1a1c20" stroke="#333" stroke-width="3"/></g>`)),

    ic("rack", "Wall charger rack", brand(6), "Brand color", (o) => { const u = o.uid;
      return svgC(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-peg)"/>` + `<path d="M8 40H192" stroke="#000" stroke-opacity=".35" stroke-width="10"/></g>` +
        `<path d="${rr(8, 26, 184, 26, 5)}" fill="url(#${u}-hs)"/><path d="M8 44H192V48H8Z" fill="url(#${u}-v)"/><path d="M12 27H188" stroke="#fff" stroke-opacity=".2"/>` +
        [0, 1, 2].map((i) => { const x = 20 + i * 58, f = seq(o, 3, i);
          return sh(o, x + 26, 128, 26, 4) + pack(o, x, 60, 48, 62, 0, f) + `<path d="M${x + 6} 52V60M${x + 42} 52V60" stroke="#0c0e11" stroke-width="5"/>` + chg(o, x + 24, 36, 1.8, f >= 1, f > 0 ? RED : AMB); }).join("") +
        tube("M188 40C200 40 196 90 204 100", 3, BLKP)); }),

    ic("stem", "Stem charger", brand(0).slice(1).concat(brand(0)[0]), "Brand color", (o) => { const u = o.uid;
      return svgC(o, counter(o, 150) + sh(o, 100, 176, 50, 6) +
        `<ellipse cx="100" cy="166" rx="44" ry="11" fill="url(#${u}-hs)"/><path d="M56 154V166A44 11 0 0 0 144 166V154Z" fill="url(#${u}-bkh)"/><ellipse cx="100" cy="154" rx="44" ry="11" fill="url(#${u}-hst)"/>` +
        `<path d="M58 160A44 11 0 0 0 142 160" fill="none" stroke="${o.color}" stroke-width="3"/>` +
        `<path d="M74 152V112H126V152Z" fill="url(#${u}-bkh)"/><ellipse cx="100" cy="112" rx="26" ry="6" fill="#30353c"/>` +
        `<path d="M78 112V58Q78 50 86 50H114Q122 50 122 58V112Z" fill="url(#${u}-c)"/><path d="M78 112V58Q78 50 86 50H114Q122 50 122 58V112Z" fill="url(#${u}-g)" opacity=".3"/>` +
        `<path d="M78 64H122V50H78Z" fill="#1b1e23"/><path d="M86 50H114Q122 50 122 58V64H78V58Q78 50 86 50Z" fill="url(#${u}-hs)"/>` +
        `<path d="M78 92H122M78 100H122" stroke="#000" stroke-opacity=".28"/>` + bars(o, 86, 56, 3, 7, 3, 2.5) +
        chg(o, 100, 140, 2, full(o)) + `<path d="M84 60V106" stroke="#fff" stroke-opacity=".3" stroke-width="2.5" stroke-linecap="round"/>`); }),

    ic("radio", "Radio charger", brand(1).slice(2).concat(brand(1).slice(0, 2)), "Brand color", (o) => { const u = o.uid, p = pal(o.color);
      return svgC(o, bench(o, 160, "block") + sh(o, 100, 172, 82, 6) +
        `<path d="${rr(30, 82, 140, 80, 10)}" fill="url(#${u}-hs)"/>` +
        [[54, 124], [146, 124]].map((c) => `<circle cx="${c[0]}" cy="${c[1]}" r="20" fill="#14161a"/><circle cx="${c[0]}" cy="${c[1]}" r="18" fill="url(#${u}-mesh)"/><circle cx="${c[0]}" cy="${c[1]}" r="18" fill="none" stroke="#3a3f46" stroke-width="2"/><circle cx="${c[0]}" cy="${c[1]}" r="5" fill="#2a2e34"/>`).join("") +
        `<path d="${rr(78, 104, 44, 18, 2)}" fill="url(#${u}-lcd)"/>` + digits(o.on ? pct(o) : "--", 86, 108, 10, o.on ? (full(o) ? GREEN : ORNG) : "#2b3a40") +
        [84, 94, 106, 116].map((x) => `<circle cx="${x}" cy="134" r="2.8" fill="#2a2e34"/>`).join("") + chg(o, 100, 150, 1.8, full(o)) +
        pack(o, 72, 62, 50, 22, 6, null, 4).replace(/fill="url\(#[^"]*-v\)"/, `fill="url(#${u}-v)"`) +
        `<path d="M26 170V80Q26 66 40 66H160Q174 66 174 80V170" fill="none" stroke="${p.k}" stroke-width="9" stroke-linecap="round"/>` +
        `<path d="M26 170V80Q26 66 40 66H160Q174 66 174 80V170" fill="none" stroke="${o.color}" stroke-width="6.5" stroke-linecap="round"/>` +
        `<path d="M24 168V80Q24 64 40 64H160" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>` +
        `<path d="M34 170H48M152 170H166" stroke="#0c0e11" stroke-width="6" stroke-linecap="round"/>`); }),

    ic("pack", "Battery pack", brand(2).slice(3).concat(brand(2).slice(0, 3)), "Brand color", (o) => svgC(o, bench(o, 150) + sh(o, 102, 168, 66, 7) +
      pack(o, 42, 72, 104, 92, 20, null, 4) +
      (o.on ? `<circle cx="${n1(42 + 52 + (4 * 8.84 + 4.8) / 2 + 2.5)}" cy="${n1(72 + 92 * .38 * .42 + 1.3)}" r="5" fill="#fff" opacity=".18"/>` : "") +
      "")),
  ];

  (window.HDA = window.HDA || []).push({
    id: "chargers", tab: "Battery chargers", group: "Utility", kind: "device",
    levelLabel: "Charge", onWord: "Charging", offWord: "Idle",
    intro: "Nineteen battery chargers: AA, 9V, 18650, camera, drone and e-bike chargers, plus brand-neutral power-tool chargers you can color to match your tools. The slider is the charge: fuel-gauge bars fill, displays count the percent, and at 100% the lights turn green. While charging, the active light blinks and the rapid charger's fan spins.",
    
    css: css2, icons,
  });
})();
