(function () {
  const P = "hda-pool-";
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
.hda-pool-flow{stroke-dashoffset:0}
.hda-anim .hda-pool-flow{animation:hda-pool-flow 1s linear infinite}
@keyframes hda-pool-flow{to{stroke-dashoffset:-18}}
.hda-pool-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-pool-flk{animation:hda-pool-flk .5s ease-in-out infinite alternate}
@keyframes hda-pool-flk{0%{transform:scale(1,1)}50%{transform:scale(.9,.78)}100%{transform:scale(1.06,1.08)}}
.hda-pool-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-pool-spin{animation:hda-pool-spin 1s linear infinite}
@keyframes hda-pool-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-pool-blink{animation:hda-pool-blink 1.2s steps(1,end) infinite}
@keyframes hda-pool-blink{0%,59%{opacity:1}60%,100%{opacity:.2}}
.hda-pool-chase{opacity:.18}
.hda-anim .hda-pool-chase{animation:hda-pool-chase 4s linear infinite}
@keyframes hda-pool-chase{0%,100%{opacity:.18}6%{opacity:1}24%{opacity:1}30%{opacity:.18}}
.hda-pool-bub{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-pool-bub{animation:hda-pool-bub 2s ease-in infinite}
@keyframes hda-pool-bub{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}100%{transform:translate(0,-26px);opacity:0}}
.hda-pool-rip{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-pool-rip{animation:hda-pool-rip 2.2s ease-out infinite}
@keyframes hda-pool-rip{0%{transform:scale(.3);opacity:.8}100%{transform:scale(1.4);opacity:0}}
.hda-pool-mist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-pool-mist{animation:hda-pool-mist 1.6s ease-in-out infinite}
@keyframes hda-pool-mist{50%{opacity:.45;transform:scale(1.08)}}
.hda-pool-heat{opacity:0}
.hda-anim .hda-pool-heat{animation:hda-pool-heat 2.6s ease-out infinite}
@keyframes hda-pool-heat{0%{transform:translate(0,4px);opacity:0}35%{opacity:.6}100%{transform:translate(0,-16px);opacity:0}}
.hda-pool-heat.hda-pool-still{opacity:.4}
.hda-anim .hda-pool-heat.hda-pool-still{opacity:0}
`;
  const css2 = css + `
.hda-anim .hda-pool-drive{animation:hda-pool-drive 7s ease-in-out infinite alternate}
@keyframes hda-pool-drive{0%{transform:translate(-24px,0)}100%{transform:translate(24px,0)}}
.hda-pool-steam{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-pool-steam{animation:hda-pool-steam 4s ease-out infinite}
@keyframes hda-pool-steam{0%{transform:translate(0,6px) scale(.5);opacity:0}30%{opacity:.75}100%{transform:translate(4px,-30px) scale(1.8);opacity:0}}
.hda-pool-steam.hda-pool-still{opacity:.35}
.hda-anim .hda-pool-steam.hda-pool-still{opacity:0}
.hda-anim .hda-pool-caus{animation:hda-pool-caus 4s ease-in-out infinite alternate}
@keyframes hda-pool-caus{to{transform:translate(9px,3px)}}
.hda-anim .hda-pool-roll{animation:hda-pool-roll 1.4s linear infinite}
@keyframes hda-pool-roll{to{transform:translate(0,-12px)}}
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
  // (parts) PS = the Multi-Function part states while a Multi-Function Image renders ({pump, jets, heater, light, spa: bool,
  // temp: number|null, lc / ll: the light's color / level}), else null; pon / po = a part's on state / o with on = that part
  let PS = null;
  const pon = (o, k) => (PS ? !!PS[k] : o.on), po = (o, k) => (PS ? Object.assign({}, o, { on: !!PS[k] }) : o);
  // a floating pool thermometer with a digital readout (the water temperature part)
  const floatT = (o, cx, cy, t) => `<ellipse cx="${cx}" cy="${cy + 6}" rx="15" ry="3" fill="#000" opacity=".25"/><path d="${rr(cx - 14, cy - 7, 28, 14, 7)}" fill="#f2f4f6"/><path d="${rr(cx - 14, cy - 7, 28, 14, 7)}" fill="url(#${o.uid}-fx)" opacity=".5"/>` +
    lcd(Object.assign({}, o, { on: true }), cx - 10, cy - 4.5, 20, 9, String(Math.round(t)), 5.5, CYAN) + `<path d="M${cx - 12} ${cy - 5}Q${cx} ${cy - 8} ${cx + 12} ${cy - 5}" fill="none" stroke="#fff" stroke-opacity=".8"/>`;
  const quad = (q) => `M${q.map((p) => n1(p[0]) + " " + n1(p[1])).join("L")}Z`;
  const inset = (q, t) => { const c = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4]; return q.map((p) => lerp(p, c, t)); };

  const ic = (id, name, colors, label, render) => ({ id, name, colors, picker: true, colorLabel: label, render });

  const icons = [
    ic("pump", "Pool pump", ["#2b2e33", "#eceef0", "#4a6f8f", "#8a949e", "#3c6b4a", "#d9cfb8"], "Body", (o) => { const u = o.uid, rpm = o.on ? String(Math.round((600 + o.level * 2850) / 10) * 10) : "0";
      const blades = [0, 60, 120, 180, 240, 300].map((a) => `<path d="M0 0L-3 -15Q3 -17 5 -13Z" fill="#b9c0c7" transform="rotate(${a})"/>`).join("");
      const ind = "M-4 132H34", outd = "M72 104V-4";
      return svgP(o, yard(o, 150, "fence", "pad") + sh(o, 100, 168, 80, 6) +
        `<path d="M14 156H186L192 170H8Z" fill="#b3b7bc" fill-opacity=".35"/>` +
        tube(ind, 12, PVC) + flow(o, ind, 2.6, "#7fd8ff") + tube(outd, 12, PVC) + flow(o, "M72 104V-4", 2.6, "#7fd8ff") + band(72, 60, 18, 8, PVC) + band(12, 132, 8, 18, PVC) +
        `<path d="M30 104H66V160Q66 166 60 166H36Q30 166 30 160Z" fill="url(#${u}-plas)"/>` +
        `<ellipse cx="48" cy="104" rx="20" ry="6.5" fill="#1b1e23"/><ellipse cx="48" cy="102" rx="17" ry="5.2" fill="${o.on ? "#6cc6e8" : "#9fb3bf"}" fill-opacity=".55"/>` +
        bubbles(o, [[42, 104, 1], [52, 103, 1.1], [47, 105, .9]]) + `<ellipse cx="44" cy="100.5" rx="7" ry="1.6" fill="#fff" opacity=".6"/>` +
        `<path d="M28 102H32M64 102H68" stroke="#111" stroke-width="5" stroke-linecap="round"/>` +
        `<circle cx="74" cy="132" r="22" fill="url(#${u}-plas)"/><circle cx="74" cy="132" r="22" fill="none" stroke="#fff" stroke-opacity=".12"/>` +
        `<path d="M66 162H86V168H66Z" fill="#202328"/>` +
        `<path d="${rr(88, 104, 66, 52, 6)}" fill="url(#${u}-cv)"/>` + [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M92 ${110 + i * 6.5}H150" stroke="#000" stroke-opacity=".2"/>`).join("") +
        `<path d="M94 110H148" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>` +
        `<ellipse cx="160" cy="130" rx="12" ry="27" fill="url(#${u}-cv)"/><ellipse cx="162" cy="130" rx="8" ry="21" fill="#0d0f12"/>` +
        `<g transform="translate(162 130) scale(.38 1)"><g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, .7, .55)}s">${blades}<circle r="3" fill="#6a7078"/></g></g>` +
        [-14, -7, 0, 7, 14].map((d) => `<path d="M156 ${130 + d}H168" stroke="#5a6168" stroke-opacity=".7" stroke-width="1.2"/>`).join("") +
        `<path d="M104 104L108 82H146L150 104Z" fill="url(#${u}-bk)"/>` + lcd(o, 112, 86, 32, 11, rpm, 6.5, CYAN) +
        led(o, 144, 98, 1.2, o.on, GREEN, "hg") + [116, 124, 132].map((x) => `<rect x="${x}" y="97" width="5" height="3" rx="1" fill="#3a4048"/>`).join("") +
        `<path d="M88 156L84 166H158L152 156Z" fill="#202328"/>`); }),

    ic("heater", "Pool heater", ["#8e98a2", "#d8cfbd", "#2b2e33", "#eceef0", "#4a6f8f"], "Body", (o) => { const u = o.uid, t = Math.round(78 + 16 * o.level);
      const louv = [0, 1, 2, 3, 4, 5].map((i) => `<path d="M58 ${44 + i * 5}H142" stroke="#0b0d10" stroke-width="2.6"/><path d="M58 ${45.6 + i * 5}H142" stroke="#fff" stroke-opacity=".2" stroke-width=".8"/>`).join("");
      return svgP(o, yard(o, 160, "fence", "pad") + sh(o, 102, 172, 66, 5) +
        tube("M150 150H204", 10, PVC) + tube("M150 136H204", 10, PVC) + flow(o, "M150 136H204", 2.4, "#ffc79a") + flow(o, "M204 150H150", 2.4, "#7fd8ff") +
        tube("M-4 156H48", 6, ["#6a5500", "#e8c22a", "#fff2a8"]) +
        `<path d="M148 40L156 34V164L148 170Z" fill="url(#${u}-sd)"/><path d="M50 40L58 34H156L148 40Z" fill="url(#${u}-tp)"/>` +
        face(o, `M50 40H148V170H50Z`) +
        `<path d="M54 40H144V74H54Z" fill="#1a1d22"/>` + (o.on ? `<path d="M56 42H142V72H56Z" fill="url(#${u}-warm)" opacity="${n1(.5 + .5 * o.level)}"/>` : "") + louv +
        heat(o, [70, 88, 106, 124], 30) +
        `<path d="M50 80H148" stroke="#000" stroke-opacity=".25"/>` +
        `<path d="${rr(70, 92, 58, 40, 4)}" fill="#000" fill-opacity=".18"/><path d="${rr(76, 98, 46, 22, 3)}" fill="#0b0d10"/>` + lcd(o, 79, 101, 40, 16, o.on ? String(t) : "--", 10, ORNG) +
        [84, 96, 108].map((x) => `<circle cx="${x + 2}" cy="126" r="2.4" fill="#2a2f36"/>`).join("") + led(o, 120, 126, 1.5, o.on, ORNG, "ho") +
        [0, 1, 2, 3, 4].map((i) => `<path d="M58 ${142 + i * 5}H140" stroke="#000" stroke-opacity=".3" stroke-width="1.6"/>`).join("") +
        hl(54, 78, 54, 166, 1.5, .3)); }),

    ic("salt", "Salt chlorinator", ["#2b2e33", "#eceef0", "#8a949e", "#3f7fb8", "#d8cfbd"], "Body", (o) => { const u = o.uid, pd = "M-4 138H204", out = Math.round(o.level * 5);
      return svgP(o, yard(o, 164, "siding", "pad") + sh(o, 100, 168, 90, 4) +
        tube(pd, 14, PVC) + flow(o, pd, 3, "#7fd8ff") +
        `<path d="${rr(56, 120, 88, 36, 10)}" fill="#cfe7f2" fill-opacity=".22"/>` +
        [126, 132, 138, 144, 150].map((y) => `<path d="M64 ${y}H136" stroke="#9aa3ad" stroke-width="2.4"/><path d="M64 ${y - .9}H136" stroke="#e6eaee" stroke-width=".6"/>`).join("") +
        `<clipPath id="${u}-cell"><path d="${rr(56, 120, 88, 36, 10)}"/></clipPath><g clip-path="url(#${u}-cell)">` +
        bubbles(o, [[68, 152], [80, 150, 1], [92, 154], [104, 150, 1.1], [116, 153], [128, 151, 1], [74, 146, .8], [110, 146, .9], [122, 144, .8], [86, 144, .9]]) + `</g>` +
        `<path d="${rr(56, 120, 88, 36, 10)}" fill="url(#${u}-fx)"/><path d="M62 125H138" stroke="#fff" stroke-opacity=".6" stroke-width="2.4" stroke-linecap="round"/>` +
        `<path d="${rr(56, 120, 88, 36, 10)}" fill="none" stroke="#e6eef3" stroke-opacity=".6"/>` +
        [44, 148].map((x) => `<path d="${rr(x, 116, 10, 44, 2)}" fill="url(#${u}-plas)"/>` + [0, 1, 2, 3].map((i) => `<path d="M${x} ${122 + i * 10}H${x + 10}" stroke="#fff" stroke-opacity=".12"/>`).join("")).join("") +
        `<path d="${rr(92, 110, 16, 12, 2)}" fill="#1b1e23"/>` + tube("M100 110C100 86 122 92 128 80", 4, BLKP) +
        `<path d="M168 22L174 18V82L168 88Z" fill="url(#${u}-sd)"/>` + face(o, rr(116, 22, 52, 66, 5)) +
        `<path d="${rr(124, 30, 36, 18, 2)}" fill="#0b0d10"/>` + lcd(o, 126, 32, 32, 14, o.on ? String(3000 + Math.round(o.level * 500)).slice(0, 4) : "  ", 7, CYAN) +
        [0, 1, 2, 3, 4].map((i) => led(o, 127 + i * 7.5, 58, 1.6, o.on && i < Math.max(1, out), GREEN, "hg")).join("") +
        `<path d="M124 66H160" stroke="#000" stroke-opacity=".2"/>` + led(o, 130, 76, 1.6, true, o.on ? CYAN : "#5a636d", "hb") + `<circle cx="146" cy="76" r="4" fill="url(#${u}-bk)"/>` +
        hl(120, 25, 162, 25, 1.4, .5)); }),

    ic("robot", "Pool robot", ["#2f6db5", "#3fb5c9", "#2b2e33", "#eceef0", "#8a4fbf"], "Body", (o) => { const u = o.uid, p = pal(o.color);
      let grid = "";
      for (let i = -6; i <= 6; i++) grid += `<path d="M${100 + i * 16} 116L${100 + i * 34} 200" stroke="#9fe3ff" stroke-opacity=".16"/>`;
      [124, 136, 152, 174].forEach((y) => { grid += `<path d="M0 ${y}H200" stroke="#9fe3ff" stroke-opacity=".14"/>`; });
      const robot = `<path d="M58 150L66 108Q68 98 80 98H124Q136 98 138 108L146 150Z" fill="url(#${u}-v)"/><path d="M58 150L66 108Q68 98 80 98H124Q136 98 138 108L146 150Z" fill="url(#${u}-g)" opacity=".3"/>` +
        `<path d="M72 112H132" stroke="#000" stroke-opacity=".25"/><path d="M84 98Q102 74 120 98" fill="none" stroke="${p.d}" stroke-width="6" stroke-linecap="round"/><path d="M86 96Q102 78 118 96" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>` +
        `<path d="${rr(78, 118, 48, 10, 3)}" fill="#0d0f12"/>` + led(o, 120, 106, 1.4, o.on, CYAN, "hb") +
        `<path d="${rr(52, 146, 100, 14, 6)}" fill="#1a1c20"/>` +
        `<path class="${o.on ? P + "flow" : ""}" style="animation-duration:${dur(o, .9, .5)}s" d="M58 153H146" stroke="#4a5058" stroke-width="10" stroke-dasharray="2 3"/>` +
        `<path d="${rr(52, 146, 100, 14, 6)}" fill="none" stroke="#000" stroke-width="1.2"/>` + `<path d="M56 148H148" stroke="#fff" stroke-opacity=".15"/>` +
        `<path d="M102 92C104 60 70 52 84 -4" fill="none" stroke="#1d2024" stroke-width="2.4"/><path d="M102 92C104 60 70 52 84 -4" fill="none" stroke="#5a6068" stroke-width="1"/>`;
      return svgP(o, `<g class="hda-bg"><rect width="200" height="200" fill="url(#${u}-uw)"/><rect y="0" width="200" height="16" fill="#9fe3ff" opacity=".22"/>` +
        `<rect y="16" width="200" height="12" fill="url(#${u}-tile)"/><path d="M0 116L0 28H200V116Z" fill="#1a6a9a" opacity=".25"/>` +
        `<path d="M0 116H200V200H0Z" fill="#7cc6e0" fill-opacity=".22"/>` + grid +
        `<g class="${P}caus"><rect x="-20" y="110" width="240" height="96" fill="url(#${u}-wav)"/></g>` +
        [[30, 0], [96, 0], [150, 0]].map((r, i) => `<path d="M${r[0]} 0L${r[0] + 18} 0L${r[0] + 40} 200L${r[0] + 26} 200Z" fill="#dff7ff" opacity="${i === 1 ? .08 : .05}"/>`).join("") + `</g>` +
        `<g class="${o.on ? P + "drive" : ""}" style="animation-duration:${dur(o, 9, 5)}s">` + sh(o, 102, 162, 58, 5) + robot +
        (o.on ? bubbles(o, [[60, 150], [146, 148], [52, 140], [150, 138]]) + `<ellipse cx="40" cy="156" rx="12" ry="4" fill="#d9f2ff" opacity=".18"/>` : "") + `</g>`); }),

    ic("hottub", "Hot tub", ["#6b4a2e", "#a8774a", "#5a5f66", "#8e7a66", "#2b2e33"], "Cabinet", (o) => { const u = o.uid, p = pal(o.color);
      const A = [26, 96], B = [110, 70], C = [176, 94], D = [90, 122], dn = 54;
      const q = [A, B, C, D], rim = inset(q, .14), shell = inset(q, .2), wtr = inset(q, .26);
      const left = quad([A, D, [D[0], D[1] + dn], [A[0], A[1] + dn]]), right = quad([D, C, [C[0], C[1] + dn], [D[0], D[1] + dn]]);
      let slats = "";
      for (let i = 1; i < 8; i++) { const t = i / 8, a = lerp(A, D, t), b = lerp(D, C, t); slats += `<path d="M${n1(a[0])} ${n1(a[1] + 6)}V${n1(a[1] + dn - 2)}" stroke="#000" stroke-opacity=".28"/><path d="M${n1(b[0])} ${n1(b[1] + 6)}V${n1(b[1] + dn - 2)}" stroke="#000" stroke-opacity=".3"/>`; }
      const wc = PS ? PS.lc || "#7ff0ff" : o.on ? "#7ff0ff" : "#4aa6c8", wq = quad(wtr), wcx = (wtr[0][0] + wtr[2][0]) / 2, wcy = (wtr[1][1] + wtr[3][1]) / 2;
      return svgP(o, yard(o, 120, "fence", "deck") + sh(o, 100, 168, 86, 16) +
        `<path d="${left}" fill="${p.m}"/><path d="${left}" fill="url(#${u}-v)" opacity=".8"/><path d="${right}" fill="url(#${u}-sd)"/>` + slats +
        `<path d="M${A[0]} ${A[1] + 6}L${D[0]} ${D[1] + 6}L${C[0]} ${C[1] + 6}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>` +
        `<path d="M${A[0]} ${A[1] + dn - 4}L${D[0]} ${D[1] + dn - 4}L${C[0]} ${C[1] + dn - 4}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3"/>` +
        `<path d="M${D[0]} ${D[1]}V${D[1] + dn}" stroke="#fff" stroke-opacity=".25"/>` +
        `<path d="${quad(q)}" fill="#4f555c"/><path d="${quad(q)}" fill="url(#${u}-g)" opacity=".35"/><path d="${quad(rim)}" fill="#e9edf0"/><path d="${quad(shell)}" fill="#cdd5db"/>` +
        `<path d="${wq}" fill="url(#${u}-pw)"/>` + (pon(o, "light") ? `<path d="${wq}" fill="${wc}" opacity=".35"/>` : "") +
        `<clipPath id="${u}-wt2"><path d="${wq}"/></clipPath><g clip-path="url(#${u}-wt2)"><g class="${pon(o, "jets") ? P + "caus" : ""}"><rect x="40" y="60" width="140" height="80" fill="url(#${u}-wav)"/></g>` +
        (pon(o, "jets") ? [[70, 96], [92, 86], [118, 90], [134, 100], [100, 104], [80, 106], [126, 108]].map((b, i) => `<circle class="${P}rip" style="animation-delay:-${n1(i * .3)}s;animation-duration:${dur(o, 1.8, 1)}s" cx="${b[0]}" cy="${b[1]}" r="5" fill="none" stroke="#fff" stroke-width="1"/>`).join("") +
          `<ellipse cx="${n1(wcx)}" cy="${n1(wcy)}" rx="24" ry="9" fill="#fff" opacity=".18"/>` : "") + `</g>` +
        [lerp(shell[0], shell[1], .5), lerp(shell[1], shell[2], .4), lerp(shell[0], shell[3], .5)].map((j) => `<circle cx="${n1(j[0])}" cy="${n1(j[1] + 2)}" r="1.6" fill="#8a949e"/>`).join("") +
        steam(po(o, "heater"), [[80, 82, 14], [112, 76, 16], [132, 88, 12], [96, 90, 12]]) + (PS && PS.temp != null ? floatT(o, 76, 100, PS.temp) : "") +
        `<path d="M${A[0]} ${A[1]}L${B[0]} ${B[1]}" stroke="#fff" stroke-opacity=".35"/>`); }),

    ic("inground", "In-ground pool", ["#3fb8ff", "#2ee6c5", "#b06cff", "#ff5a8a", "#ffd27a", "#7cff6b"], "Light", (o) => { const u = o.uid, c = (PS && PS.lc) || o.color, lon = pon(o, "light"), k = lon ? .35 + .65 * (PS && PS.ll != null ? PS.ll : o.level) : 0;
      const pool = "M40 88C40 80 48 76 60 76H140C156 76 164 82 162 94L176 164C178 178 170 184 154 184H46C30 184 22 178 24 164Z";
      const inner = "M46 92C46 86 52 84 62 84H138C150 84 156 88 155 96L168 162C170 172 164 176 152 176H48C36 176 30 172 32 162Z";
      const lit = H().mix(c, "#ffffff", .35);
      return svgP(o, `<g class="hda-bg"><rect width="200" height="60" fill="url(#${u}-sky)"/><path d="M0 40Q30 24 56 38Q84 22 110 36Q140 20 166 36Q186 26 200 34V64H0Z" fill="url(#${u}-hedge)"/>` +
        `<path d="M0 60H200V200H0Z" fill="url(#${u}-pav)"/><path d="M0 60H200" stroke="#000" stroke-opacity=".3"/></g>` +
        `<path d="${pool}" fill="url(#${u}-cop)"/><path d="${inner}" fill="url(#${u}-pwn)"/>` +
        `<path d="M62 84H138C150 84 156 88 155 96L155.6 99H45.6L46 92C46 86 52 84 62 84Z" fill="url(#${u}-tile)"/>` +
        `<clipPath id="${u}-pl"><path d="${inner}"/></clipPath><g clip-path="url(#${u}-pl)">` +
        (k ? `<radialGradient id="${u}-lg" cx=".5" cy=".12" r=".95"><stop offset="0" stop-color="#fff" stop-opacity="${n1(.9 * k)}"/><stop offset=".18" stop-color="${lit}" stop-opacity="${n1(.95 * k)}"/><stop offset=".6" stop-color="${c}" stop-opacity="${n1(.6 * k)}"/><stop offset="1" stop-color="${H().shade(c, -.5)}" stop-opacity="${n1(.5 * k)}"/></radialGradient><path d="${inner}" fill="url(#${u}-lg)"/>` : `<path d="${inner}" fill="#1b5f8a" opacity=".35"/>`) +
        `<g class="${pon(o, "pump") ? P + "caus" : ""}"><rect x="10" y="90" width="190" height="90" fill="url(#${u}-wav)" opacity="${pon(o, "pump") ? 1 : .5}"/></g>` +
        (PS && PS.pump ? [[56, 100], [146, 102]].map((b, i) => `<ellipse class="${P}rip" style="animation-delay:-${n1(i * .8)}s" cx="${b[0]}" cy="${b[1]}" rx="9" ry="3" fill="none" stroke="#fff" stroke-width="1"/>`).join("") : "") +
        `<path d="M120 176L132 150H170V176Z" fill="#fff" opacity=".1"/><path d="M128 162H168M134 150H166" stroke="#fff" stroke-opacity=".22" stroke-width="2"/></g>` +
        `<circle cx="100" cy="104" r="${lon ? 5 : 4}" fill="${lon ? "#fff" : "#4a5a66"}"/><circle cx="100" cy="104" r="${lon ? 5 : 4}" fill="none" stroke="#c9d0d6" stroke-width="1.4"/>` +
        (lon ? `<circle cx="100" cy="104" r="16" fill="${lit}" opacity="${n1(.45 * k)}"/>` : "") +
        `<path d="${pool}" fill="none" stroke="#fff" stroke-opacity=".25"/>` + (PS ? steam(po(o, "heater"), [[74, 128, 18], [122, 140, 16], [96, 158, 18]]) + (PS.temp != null ? floatT(o, 62, 140, PS.temp) : "") : "") +
        `<path d="M168 96V64M180 96V64M168 72H180M168 82H180" stroke="#d6dade" stroke-width="2.4" stroke-linecap="round" transform="translate(-4 10)"/>`); }),

    ic("above", "Above-ground pool", ["#2f6db5", "#eceef0", "#8a949e", "#a8774a", "#2b2e33"], "Wall", (o) => { const u = o.uid, cx = 104, top = 86, bot = 146, rx = 76, ry = 20, hd = "M48 166C40 166 30 160 24 150", hr = "M38 150C30 150 26 132 34 112";
      const wall = `M${cx - rx} ${top}V${bot}A${rx} ${ry} 0 0 0 ${cx + rx} ${bot}V${top}A${rx} ${ry} 0 0 1 ${cx - rx} ${top}Z`;
      let ups = "";
      [-.92, -.6, -.2, .2, .6, .92].forEach((s) => { const x = cx + s * rx, y = top + Math.sqrt(1 - s * s) * ry; ups += `<path d="M${n1(x)} ${n1(y + 2)}V${n1(y + bot - top)}" stroke="#d6dade" stroke-width="5"/><path d="M${n1(x - 1.5)} ${n1(y + 2)}V${n1(y + bot - top)}" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`; });
      return svgP(o, yard(o, 112, "fence", "grass") + `<ellipse cx="${cx}" cy="${bot + 6}" rx="${rx + 10}" ry="${ry + 4}" fill="#000" opacity=".35"/>` +
        `<ellipse cx="${cx}" cy="${top + 2}" rx="${rx - 4}" ry="${ry - 3}" fill="url(#${u}-pw)"/>` +
        `<clipPath id="${u}-ab"><ellipse cx="${cx}" cy="${top + 2}" rx="${rx - 4}" ry="${ry - 3}"/></clipPath><g clip-path="url(#${u}-ab)"><g class="${pon(o, "pump") ? P + "caus" : ""}"><rect x="20" y="64" width="170" height="44" fill="url(#${u}-wav)"/></g>` +
        (PS && PS.light ? `<ellipse cx="${cx}" cy="${top + 2}" rx="${rx - 4}" ry="${ry - 3}" fill="${PS.lc || "#7fe0ff"}" opacity="${n1(.2 + .3 * (PS.ll == null ? o.level : PS.ll))}"/><ellipse cx="${cx - 30}" cy="${top + 6}" rx="22" ry="7" fill="#fff" opacity=".3"/>` : "") +
        (pon(o, "pump") ? `<ellipse class="${P}rip" cx="${cx + 40}" cy="${top + 6}" rx="12" ry="3" fill="none" stroke="#fff" stroke-width="1"/><ellipse class="${P}rip" style="animation-delay:-1.1s" cx="${cx + 40}" cy="${top + 6}" rx="12" ry="3" fill="none" stroke="#fff" stroke-width="1"/>` : "") + `</g>` +
        `<path d="${wall}" fill="url(#${u}-c)"/><path d="${wall}" fill="url(#${u}-g)" opacity=".25"/>` + ups +
        `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="none" stroke="#c9ced4" stroke-width="5"/><ellipse cx="${cx}" cy="${top - 1}" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>` +
        `<path d="M160 64L170 150M176 64L186 150M162 82L174 80M164 100L177 98M166 118L180 116M152 74L160 64M168 74L176 64" stroke="#e6e9ec" stroke-width="2.6" stroke-linecap="round"/>` +
        tube(hd, 5, ["#0f2a44", "#2a6aa8", "#9cc8ef"]) + tube(hr, 5, ["#0f2a44", "#2a6aa8", "#9cc8ef"]) + flow(po(o, "pump"), hr, 1.6) + flow(po(o, "pump"), hd, 1.6) + (PS ? steam(po(o, "heater"), [[84, 76, 16], [124, 72, 14]]) + (PS.temp != null ? floatT(o, cx - 34, top + 1, PS.temp) : "") : "") +
        sh(o, 40, 186, 24, 4) + `<path d="${rr(22, 154, 22, 30, 5)}" fill="url(#${u}-plas)"/><path d="${rr(44, 160, 22, 22, 4)}" fill="#1a1d22"/><ellipse cx="33" cy="154" rx="11" ry="3.5" fill="#3a4048"/>` +
        `<path d="${rr(44, 164, 20, 14, 3)}" fill="#3a4048"/>` + led(o, 54, 171, 1.4, pon(o, "pump"), GREEN, "hg")); }),

    ic("falls", "Sheer waterfall", ["#7fd8ff", "#2ee6c5", "#b06cff", "#ff5a8a", "#ffd27a", "#eaf6ff"], "Light", (o) => { const u = o.uid, c = o.color, lit = H().mix(c, "#ffffff", .5), sheet = "M50 92Q48 114 54 142H146Q152 114 150 92Z";
      const streaks = [58, 70, 82, 94, 106, 118, 130, 142].map((x, i) => `<path class="${P}flow" style="animation-duration:${dur(o, .9, .5)}s;animation-delay:-${n1(i * .11)}s" d="M${x} 93Q${x - 1} 116 ${x + (x - 100) * .08} 141" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2" stroke-dasharray="4 6"/>`).join("");
      return svgP(o, `<g class="hda-bg"><rect width="200" height="40" fill="url(#${u}-sky)"/><path d="M0 26Q30 12 60 24Q96 8 130 22Q164 10 200 22V40H0Z" fill="url(#${u}-hedge)"/></g>` +
        `<path d="M0 40H200V142H0Z" fill="url(#${u}-stn)"/><path d="M0 40H200V142H0Z" fill="url(#${u}-fx)" opacity=".6"/><path d="M0 36H200V46H0Z" fill="url(#${u}-cop)"/><path d="M0 46H200" stroke="#000" stroke-opacity=".35"/>` +
        `<path d="M44 86H156V92H44Z" fill="url(#${u}-mtv)"/><path d="M44 92H156" stroke="#000" stroke-opacity=".5"/>` +
        `<path d="M0 140H200V200H0Z" fill="url(#${u}-pw)"/><path d="M0 140H200V146H0Z" fill="url(#${u}-tile)"/>` +
        (o.on ? `<radialGradient id="${u}-fg" cx=".5" cy=".2" r=".7"><stop offset="0" stop-color="${lit}" stop-opacity=".8"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><ellipse cx="100" cy="160" rx="90" ry="40" fill="url(#${u}-fg)" opacity="${n1(.4 + .5 * o.level)}"/>` +
          `<path d="${sheet}" fill="${lit}" fill-opacity=".5"/><path d="${sheet}" fill="url(#${u}-fx)" opacity=".7"/>` + streaks +
          `<path d="M50 93H150" stroke="#fff" stroke-opacity=".9" stroke-width="1.6"/>` +
          `<ellipse cx="100" cy="146" rx="54" ry="5" fill="#fff" opacity=".7"/>` +
          [0, 1, 2].map((i) => `<ellipse class="${P}rip" style="animation-delay:-${n1(i * .7)}s" cx="100" cy="150" rx="60" ry="6" fill="none" stroke="#fff" stroke-width="1"/>`).join("") +
          bubbles(o, [[64, 156], [90, 160], [118, 158], [138, 156]])
          : `<path d="M60 92v5M100 92v4M140 92v6" stroke="#bfe9ff" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`) +
        `<g class="${P}caus"><rect x="-10" y="150" width="220" height="50" fill="url(#${u}-wav)"/></g>` +
        `<path d="M44 86H156" stroke="#fff" stroke-opacity=".6"/>`); }),

    ic("cover", "Auto cover", ["#3d6fa8", "#8a949e", "#c9b48a", "#3c6b4a", "#2b2e33"], "Cover", (o) => { const u = o.uid, p = pal(o.color), f = .12 + .82 * o.level;
      const yFar = 52, yNear = 186, xl = (y) => 64 - (y - yFar) * 54 / 134, xr = (y) => 136 + (y - yFar) * 54 / 134;
      const ye = yFar + (yNear - yFar) * f;
      const cov = `M${n1(xl(yFar))} ${yFar}H${n1(xr(yFar))}L${n1(xr(ye))} ${n1(ye)}H${n1(xl(ye))}Z`;
      let ribs = "";
      for (let y = yFar + 5; y < 200; y += 6) ribs += `<path d="M0 ${y}H200" stroke="#000" stroke-opacity=".22" stroke-width="1"/><path d="M0 ${y + 1.2}H200" stroke="#fff" stroke-opacity=".14" stroke-width=".8"/>`;
      return svgP(o, `<g class="hda-bg"><rect width="200" height="40" fill="url(#${u}-sky)"/><path d="M0 40V20Q20 10 40 18Q70 6 100 16Q140 4 170 16Q188 10 200 16V40Z" fill="url(#${u}-hedge)"/>` +
        `<path d="M0 36H200V200H0Z" fill="url(#${u}-pav)"/></g>` +
        `<path d="M${n1(xl(yFar) - 6)} ${yFar - 5}H${n1(xr(yFar) + 6)}L${n1(xr(yNear) + 8)} ${yNear + 6}H${n1(xl(yNear) - 8)}Z" fill="url(#${u}-cop)"/>` +
        `<path d="M${n1(xl(yFar))} ${yFar}H${n1(xr(yFar))}L${n1(xr(yNear))} ${yNear}H${n1(xl(yNear))}Z" fill="url(#${u}-pw)"/>` +
        `<clipPath id="${u}-pc"><path d="M${n1(xl(yFar))} ${yFar}H${n1(xr(yFar))}L${n1(xr(yNear))} ${yNear}H${n1(xl(yNear))}Z"/></clipPath><g clip-path="url(#${u}-pc)"><rect x="0" y="50" width="200" height="140" fill="url(#${u}-wav)"/></g>` +
        `<clipPath id="${u}-cv2"><path d="${cov}"/></clipPath><path d="${cov}" fill="url(#${u}-v)"/><g clip-path="url(#${u}-cv2)"><g class="${o.on ? P + "roll" : ""}" style="animation-duration:${dur(o, 2, 1.3)}s">${ribs}</g></g>` +
        `<path d="M${n1(xl(ye))} ${n1(ye)}H${n1(xr(ye))}" stroke="${p.k}" stroke-width="3"/><path d="M${n1(xl(ye))} ${n1(ye - 1.5)}H${n1(xr(ye))}" stroke="#fff" stroke-opacity=".4"/>` +
        `<path d="${rr(54, 40, 92, 12, 3)}" fill="url(#${u}-stone)"/><path d="M56 42H144" stroke="#fff" stroke-opacity=".5"/>` +
        (o.on ? `<path d="M100 ${n1(ye + 10)}l-5 6M100 ${n1(ye + 10)}l5 6" stroke="#fff" stroke-width="2" stroke-linecap="round" class="${P}blink"/>` : "") +
        `<path d="${rr(170, 52, 16, 22, 3)}" fill="#c9ced4"/><path d="${rr(170, 52, 16, 22, 3)}" fill="url(#${u}-fx)"/><circle cx="178" cy="60" r="3.2" fill="#3a4048"/>` + led(o, 178, 69, 1.4, true, o.on ? AMB : GREEN, o.on ? "ho" : "hg")); }),

    ic("panel", "Pool controller", ["#eceef0", "#8e98a2", "#d8cfbd", "#2b2e33", "#4a6f8f"], "Body", (o) => { const u = o.uid, t = Math.round(78 + 16 * o.level);
      const btn = [[0, 0, 1], [1, 0, 1], [2, 0, o.level > .3], [0, 1, o.level > .55], [1, 1, o.level > .75], [2, 1, 0]];
      return svgP(o, yard(o, 166, "siding", "pav") + `<g class="hda-bg"><path d="M0 182H200V200H0Z" fill="url(#${u}-pw)"/><path d="M0 178H200V184H0Z" fill="url(#${u}-cop)"/><g class="${P}caus"><rect x="-10" y="184" width="220" height="16" fill="url(#${u}-wav)"/></g></g>` +
        tube("M78 148V170", 9, ["#3a3f46", "#8d939b", "#c9ced4"]) + tube("M100 148V170", 9, ["#3a3f46", "#8d939b", "#c9ced4"]) + tube("M122 148V170", 9, ["#3a3f46", "#8d939b", "#c9ced4"]) +
        sh(o, 100, 152, 54, 4) + `<path d="M150 30L156 26V144L150 148Z" fill="url(#${u}-sd)"/>` + face(o, rr(50, 26, 100, 122, 7)) +
        `<path d="M50 40H150" stroke="#000" stroke-opacity=".18"/><path d="M50 41H150" stroke="#fff" stroke-opacity=".12"/>` +
        `<path d="${rr(62, 50, 76, 36, 4)}" fill="#0b0d10"/>` + (PS ? lcd(Object.assign({}, o, { on: PS.temp != null }), 65, 53, 46, 30, PS.temp != null ? String(Math.round(PS.temp)) : "--", 18, CYAN) : lcd(o, 65, 53, 46, 30, o.on ? String(t) : "--", 18, CYAN)) +
        (pon(o, "heater") ? `<path d="M118 60q4 -6 8 0q-4 6 -8 0z" fill="${CYAN}" opacity=".85"/><path d="M118 72h10M118 76h7" stroke="${CYAN}" stroke-width="1.6" opacity=".7"/>` : "") +
        btn.map((b) => { const x = 66 + b[0] * 24, y = 98 + b[1] * 22, pk = PBTN[b[0] + b[1] * 3], on = PS ? !!(pk && PS[pk]) : o.on && b[2];
          return `<path d="${rr(x, y, 20, 16, 3)}" fill="url(#${u}-bk)"/><path d="M${x + 2} ${y + 2}H${x + 18}" stroke="#fff" stroke-opacity=".2"/>` + led(o, x + 10, y + 9, 1.6, on, GREEN, "hg") + (PS && pk ? glyph(pk, x + 4.6, y + 8.5, on) : ""); }).join("") +
        `<g class="${o.on ? P + "blink" : ""}">${led(o, 140, 34, 1.4, true, o.on ? CYAN : "#5a636d", "hb")}</g>` + hl(56, 30, 140, 30, 1.4, .5) + screw(56, 142) + screw(144, 142)); }),
  ];

  // ---------- (parts) Multi-Function: pump / jets, heater, light, spa (switches) + the water temperature (value) ----------
  // o.mf: o.parts holds only the ticked parts; the pump moves the water (ripples, hoses), the jets churn the spa, the heater
  // steams, the light colors the water (o.pcolor / o.plevel .light), the temperature floats on a pool thermometer (the
  // controller: on its display, each circuit lit on its own button with a small symbol). A part left out stays off.
  // A Device Image (no o.mf) is exactly today's.
  const PBTN = ["pump", "heater", "light", "spa"];
  function glyph(k, x, y, on) {
    const c = on ? "#d9f7ea" : "#8a949e";
    if (k === "pump") return `<circle cx="${x}" cy="${y}" r="2.1" fill="none" stroke="${c}" stroke-width=".7"/><path d="M${x} ${y}l1.4 -1M${x} ${y}l-1.4 -1M${x} ${y}v1.7" stroke="${c}" stroke-width=".7"/>`;
    if (k === "heater") return `<path d="M${x} ${y + 2.2}c-1.8 0 -2.2 -1.6 -1.2 -2.8c.4 .7 .9 .8 .9 .1c0 -1 .6 -1.6 .9 -2.2c.3 1 1.8 1.8 1.2 3.6c-.3 .8 -1 1.3 -1.8 1.3z" fill="${on ? "#ffb35c" : c}"/>`;
    if (k === "light") return `<circle cx="${x}" cy="${y - .5}" r="1.7" fill="${on ? "#ffe9a8" : "none"}" stroke="${c}" stroke-width=".6"/><path d="M${x - .8} ${y + 1.6}h1.6" stroke="${c}" stroke-width=".6"/>`;
    return `<circle cx="${x - 1.1}" cy="${y + .8}" r=".9" fill="none" stroke="${c}" stroke-width=".55"/><circle cx="${x + 1}" cy="${y - .2}" r=".75" fill="none" stroke="${c}" stroke-width=".55"/><circle cx="${x - .2}" cy="${y - 1.6}" r=".6" fill="none" stroke="${c}" stroke-width=".55"/>`;
  }
  const PT = { id: "temp", name: "Water temperature", type: "value", unit: "°F", min: 40, max: 106, def: 82 };
  const sw = (id, name) => ({ id, name, type: "switch" });
  const PP = {
    panel: [sw("pump", "Pump"), sw("heater", "Heater"), sw("light", "Pool light"), sw("spa", "Spa"), PT],
    hottub: [sw("jets", "Jets"), sw("heater", "Heater"), sw("light", "Light"), Object.assign({}, PT, { def: 102 })],
    inground: [sw("pump", "Pump"), sw("heater", "Heater"), sw("light", "Pool light"), PT],
    above: [sw("pump", "Pump"), sw("heater", "Heater"), sw("light", "Pool light"), PT],
  };
  icons.forEach((ic) => {
    const ps = PP[ic.id]; if (!ps) return;
    ic.parts = ps; const R = ic.render;
    ic.render = (o) => {
      if (!o.mf) return R(o);
      const p = o.parts || {}, pv = o.pval || {}, s = {}; let any = false;
      ps.forEach((q) => { if (q.type === "switch") { s[q.id] = !!p[q.id]; any = any || s[q.id]; } });
      const t = pv.temp; s.temp = t == null || t === "" || !isFinite(+t) ? null : +t;
      s.lc = o.pcolor && o.pcolor.light; s.ll = o.plevel && o.plevel.light != null ? +o.plevel.light : null;
      PS = s; try { return R(Object.assign({}, o, { on: any })); } finally { PS = null; }
    };
  });

  (window.HDA = window.HDA || []).push({
    id: "pool", tab: "Pool & hot tub", group: "Outdoor", kind: "device",
    levelLabel: "Speed", onWord: "Running", offWord: "Off",
    intro: "Ten pool and spa pieces at the poolside and on the equipment pad. Running = the pump fan spins and water moves in the pipes, the heater glows, the salt cell fizzes, the robot drives the floor, the hot tub bubbles and steams, the waterfall pours and the pool light colors the water. The slider sets the speed (on the pool, waterfall and light: brightness; on the cover: how far it is closed).",
    
    css: css2, icons,
  });
})();
