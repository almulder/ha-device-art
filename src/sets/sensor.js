(function () {
  const P = "hda-sensor-";
  const H = () => window.HDAH;
  const WH = "#f2f3f5", BK = "#2c2f36", GY = "#9ba3ad", BG = "#dccdb0", SG = "#b7c6b2";
  const SW = [WH, BK, GY, BG, SG];
  const sw = (f) => [f].concat(SW.filter((c) => c !== f));
  const C = { r: "#ff4d4f", g: "#34d399", b: "#60a5fa", a: "#ffb020", c: "#7dd3fc", w: "#ffd27a" };
  const n1 = (v) => (+v).toFixed(1);
  const R = Math.PI / 180;

  function pal(c) { const h = H(); return { l: h.shade(c, .55), m: c, d: h.shade(c, -.26), k: h.shade(c, -.5), e: h.shade(c, -.42) }; }
  const halo = (id, c, a) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a || .85}"/><stop offset=".42" stop-color="${c}" stop-opacity=".3"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const lin = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
${lin(u + "-v", [[0, p.l], [.5, p.m], [1, p.d]], 1)}
${lin(u + "-c", [[0, p.d], [.28, p.l], [.62, p.m], [1, p.k]])}
${lin(u + "-tp", [[0, p.m], [.45, p.l], [1, p.m]])}
<radialGradient id="${u}-s" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></radialGradient>
${lin(u + "-fx", [[0, "#fff", .22], [.18, "#fff", 0], [.8, "#000", 0], [1, "#000", .22]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
${lin(u + "-wl", [[0, "#c4bde6", .15], [1, "#c4bde6", .03]], 1)}
${lin(u + "-wr", [[0, "#c4bde6", .24], [1, "#c4bde6", .06]], 1)}
${lin(u + "-fl", [[0, "#c4bde6", .03], [1, "#c4bde6", .14]], 1)}
<radialGradient id="${u}-lens" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#e3e8ef"/><stop offset="1" stop-color="#8f9aa8"/></radialGradient>
${lin(u + "-dk", [[0, "#0f1116"], [1, "#2c3139"]], 1)}
${lin(u + "-st", [[0, "#6f767e"], [.5, "#e2e6ea"], [1, "#5a6067"]])}
${lin(u + "-cr", [[0, "#fdfeff"], [.35, "#8f969e"], [.55, "#e9ecef"], [1, "#5d636b"]], 1)}
${lin(u + "-br", [[0, "#8a5f22"], [.45, "#f1cf7a"], [1, "#7b521b"]])}
${lin(u + "-cu", [[0, "#7a3e1e"], [.45, "#f0a070"], [1, "#6e3418"]])}
${lin(u + "-en", [[0, "#7d7a92"], [.3, "#ecebf3"], [.65, "#bdbacb"], [1, "#67637d"]])}
${lin(u + "-env", [[0, "#f4f3f8"], [.6, "#d4d1e0"], [1, "#a29eb6"]], 1)}
${lin(u + "-trim", [[0, "#b7b1cb"], [.4, "#e6e3ef"], [1, "#a39dba"]])}
${lin(u + "-trv", [[0, "#ebe8f3"], [1, "#b3adc8"]], 1)}
${lin(u + "-paint", [[0, "#a29cbb"], [1, "#77718f"]], 1)}
${lin(u + "-wood", [[0, "#c8996a"], [.5, "#a87a4e"], [1, "#6a4528"]], 1)}
${lin(u + "-wh", [[0, "#6e4a2c"], [.35, "#b4845a"], [.7, "#8d6140"], [1, "#5e3d22"]])}
${lin(u + "-sky", [[0, "#151c38"], [1, "#2f3b68"]], 1)}
${lin(u + "-day", [[0, "#6fa8e0"], [1, "#d6ecfa"]], 1)}
${lin(u + "-gls", [[0, "#fff", .2], [.4, "#fff", 0], [.6, "#fff", .06], [1, "#fff", 0]])}
<radialGradient id="${u}-wt" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#bfe6ff" stop-opacity=".75"/><stop offset=".6" stop-color="#5aa3e6" stop-opacity=".55"/><stop offset="1" stop-color="#2a63b0" stop-opacity=".25"/></radialGradient>
${lin(u + "-beam", [[0, C.c, .5], [1, C.c, 0]], 1)}
${lin(u + "-sun", [[0, C.w, .55], [1, C.w, 0]], 1)}
${lin(u + "-smk", [[0, "#d9d6e4", 0], [.4, "#d9d6e4", .55], [1, "#d9d6e4", 0]], 1)}
${halo(u + "-hr", C.r)}${halo(u + "-hg", C.g)}${halo(u + "-hb", C.b)}${halo(u + "-ha", C.a)}${halo(u + "-hc", C.c)}${halo(u + "-hw", C.w)}
<pattern id="${u}-mesh" width="4.4" height="4.4" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="#fff" fill-opacity=".16"/><circle cx="2.2" cy="2.2" r="1" fill="#000" fill-opacity=".5"/></pattern>
<pattern id="${u}-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".6"/></pattern>
<pattern id="${u}-vgrain" width="6" height="40" patternUnits="userSpaceOnUse"><path d="M2 0C1 10 3 20 2 40M4.6 0C5.4 14 3.8 26 4.8 40" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".6"/></pattern>
<radialGradient id="${u}-wv" cx=".5" cy=".45" r=".62"><stop offset="0" stop-color="#c4bde6" stop-opacity=".17"/><stop offset=".7" stop-color="#c4bde6" stop-opacity=".07"/><stop offset="1" stop-color="#c4bde6" stop-opacity="0"/></radialGradient>
${lin(u + "-fdh", [[0, "#000"], [.22, "#fff"], [.78, "#fff"], [1, "#000"]])}
<mask id="${u}-fade" maskContentUnits="userSpaceOnUse"><rect width="200" height="200" fill="url(#${u}-fdh)"/></mask>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="overflow:hidden">${defs(o, extra)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry, op) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"${op ? ` opacity="${op}"` : ""}/>`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
  const band = (x1, x2, y1, y2, ry) => { const rx = (x2 - x1) / 2; return `M${x1} ${y1}V${y2}A${rx} ${ry} 0 0 0 ${x2} ${y2}V${y1}A${rx} ${ry} 0 0 1 ${x1} ${y1}Z`; };
  const bandUp = (x1, x2, y1, y2, ry) => { const rx = (x2 - x1) / 2; return `M${x1} ${y1}A${rx} ${ry} 0 0 1 ${x2} ${y1}V${y2}A${rx} ${ry} 0 0 0 ${x1} ${y2}Z`; };
  const part = (o, d, gl) => `<path d="${d}" fill="url(#${o.uid}-v)"/><path d="${d}" fill="url(#${o.uid}-fx)"/>${gl === false ? "" : `<path d="${d}" fill="url(#${o.uid}-g)" opacity=".35"/>`}<path d="${d}" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".7" stroke-width=".7"/>`;
  const rpart = (o, x, y, w, h, r, depth) => (depth ? `<path d="${rr(x + depth * .6, y + depth, w, h, r)}" fill="${pal(o.color).k}"/>` : "") + part(o, rr(x, y, w, h, r)) + `<path d="M${x + r} ${y + .8}H${x + w - r}" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>`;

  function led(o, x, y, r, k, on, cls) {
    const c = C[k];
    if (!on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="${H().shade(c, -.68)}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".3"/>`;
    return `<g class="${cls == null ? P + "blink" : cls}"><circle cx="${x}" cy="${y}" r="${n1(r * 5.5)}" fill="url(#${o.uid}-h${k})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${n1(x - r * .25)}" cy="${n1(y - r * .25)}" r="${n1(r * .45)}" fill="#fff" fill-opacity=".9"/></g>`;
  }
  function arcs(cx, cy, deg, n, r0, dr, sp, col, w, dur) {
    dur = dur || 1.6; let s = "";
    for (let i = 0; i < n; i++) {
      const r = r0 + dr * i, a1 = (deg - sp) * R, a2 = (deg + sp) * R;
      s += `<path class="${P}chase" style="animation-delay:${n1(-dur + i * dur / n)}s;animation-duration:${dur}s" d="M${n1(cx + r * Math.cos(a1))} ${n1(cy + r * Math.sin(a1))}A${r} ${r} 0 0 1 ${n1(cx + r * Math.cos(a2))} ${n1(cy + r * Math.sin(a2))}" fill="none" stroke="${col}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
    }
    return s;
  }
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", " ": "" };
  function seg7(str, x, y, h, on, ghost) {
    const w = h * .54, t = Math.max(1, h * .13), gp = h * .2, hf = h / 2; let s = "", cx = x;
    for (const ch of String(str)) {
      if (ch === "°") { s += `<circle cx="${n1(cx + t)}" cy="${n1(y + t)}" r="${n1(t * .9)}" fill="none" stroke="${on}" stroke-width="${n1(t * .6)}"/>`; cx += t * 3; continue; }
      const on1 = SEG[ch] || "", g = {
        a: [cx + t, y, w - 2 * t, t], d: [cx + t, y + h - t, w - 2 * t, t], g: [cx + t, y + hf - t / 2, w - 2 * t, t],
        b: [cx + w - t, y + t * .9, t, hf - t * 1.4], c: [cx + w - t, y + hf + t * .5, t, hf - t * 1.4],
        f: [cx, y + t * .9, t, hf - t * 1.4], e: [cx, y + hf + t * .5, t, hf - t * 1.4] };
      for (const k of "abcdefg") { const q = g[k], lit = on1.indexOf(k) >= 0; if (!lit && !ghost) continue;
        s += `<rect x="${n1(q[0])}" y="${n1(q[1])}" width="${n1(q[2])}" height="${n1(q[3])}" rx="${n1(t * .45)}" fill="${lit ? on : ghost}"/>`; }
      cx += w + gp;
    }
    return `<g transform="translate(${n1(y * .1)} 0) skewX(-5.7)">${s}</g>`;
  }
  function quad(Q) { return (u, v) => { const t = [Q[0][0] + (Q[1][0] - Q[0][0]) * u, Q[0][1] + (Q[1][1] - Q[0][1]) * u], b = [Q[3][0] + (Q[2][0] - Q[3][0]) * u, Q[3][1] + (Q[2][1] - Q[3][1]) * u]; return [t[0] + (b[0] - t[0]) * v, t[1] + (b[1] - t[1]) * v]; }; }
  const qr = (m, u1, v1, u2, v2) => { const a = m(u1, v1), b = m(u2, v1), c = m(u2, v2), d = m(u1, v2); return `M${n1(a[0])} ${n1(a[1])}L${n1(b[0])} ${n1(b[1])}L${n1(c[0])} ${n1(c[1])}L${n1(d[0])} ${n1(d[1])}Z`; };
  function rings(o, cx, cy, rx, ry, col, n, w) {
    let s = "";
    for (let i = 0; i < n; i++) {
      if (o.anim) s += `<ellipse class="${P}ring" style="animation-delay:${n1(-i * 2.4 / n)}s" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${col}" stroke-width="${w || 2}"/>`;
      else { const k = (i + 1) / n; s += `<ellipse cx="${cx}" cy="${cy}" rx="${n1(rx * k)}" ry="${n1(ry * k)}" fill="none" stroke="${col}" stroke-opacity="${n1(.9 - .6 * k)}" stroke-width="${w || 2}"/>`; }
    }
    return s;
  }
  const drop = (x, y, s, cls, dl) => `<path class="${cls || ""}" style="animation-delay:${dl || 0}s" d="M${x} ${y}c${n1(-2.4 * s)} ${n1(3.4 * s)} ${n1(-3 * s)} ${n1(5 * s)} 0 ${n1(6.4 * s)}c${n1(3 * s)} ${n1(-1.4 * s)} ${n1(2.4 * s)} ${n1(-3 * s)} 0 ${n1(-6.4 * s)}Z" fill="#9fd8ff"/>`;

  const css = `
.hda-sensor-blink{opacity:1}
.hda-anim .hda-sensor-blink{animation:hda-sensor-blink 1s steps(1,end) infinite}
@keyframes hda-sensor-blink{0%,49%{opacity:1}50%,100%{opacity:.18}}
.hda-anim .hda-sensor-pulse{animation:hda-sensor-pulse 2.4s ease-in-out infinite}
@keyframes hda-sensor-pulse{50%{opacity:.45}}
.hda-sensor-chase{opacity:.7}
.hda-anim .hda-sensor-chase{animation:hda-sensor-chase 1.6s linear infinite}
@keyframes hda-sensor-chase{0%,100%{opacity:.08}18%{opacity:1}50%{opacity:.08}}
.hda-sensor-ring{transform-box:fill-box;transform-origin:center;opacity:0}
.hda-anim .hda-sensor-ring{animation:hda-sensor-ring 2.4s ease-out infinite}
@keyframes hda-sensor-ring{0%{transform:scale(.18);opacity:0}15%{opacity:.85}100%{transform:scale(1);opacity:0}}
.hda-sensor-wisp{opacity:.8}
.hda-anim .hda-sensor-wisp{animation:hda-sensor-wisp 3.6s ease-in infinite}
@keyframes hda-sensor-wisp{0%{transform:translateY(26px);opacity:0}30%{opacity:.9}100%{transform:translateY(-22px);opacity:0}}
.hda-sensor-drip{opacity:.9}
.hda-anim .hda-sensor-drip{animation:hda-sensor-drip 1.4s cubic-bezier(.55,0,1,.45) infinite}
@keyframes hda-sensor-drip{0%{transform:translateY(0);opacity:0}12%{opacity:1}85%{opacity:1}100%{transform:translateY(28px);opacity:0}}
.hda-sensor-fall{opacity:.75}
.hda-anim .hda-sensor-fall{animation:hda-sensor-fall .9s linear infinite}
@keyframes hda-sensor-fall{0%{transform:translate(4px,-22px);opacity:0}20%{opacity:.85}100%{transform:translate(-4px,22px);opacity:0}}
.hda-sensor-shard{opacity:.8}
.hda-anim .hda-sensor-shard{animation:hda-sensor-shard 1.8s ease-in infinite}
@keyframes hda-sensor-shard{0%{transform:translateY(-10px);opacity:0}20%{opacity:.9}100%{transform:translateY(26px);opacity:0}}
.hda-sensor-breeze{opacity:.6}
.hda-anim .hda-sensor-breeze{animation:hda-sensor-breeze 2.6s ease-in-out infinite}
@keyframes hda-sensor-breeze{0%{transform:translate(0,6px);opacity:0}40%{opacity:.7}100%{transform:translate(-26px,-10px);opacity:0}}
.hda-sensor-rise{opacity:.7}
.hda-anim .hda-sensor-rise{animation:hda-sensor-rise 3s linear infinite}
@keyframes hda-sensor-rise{0%{transform:translate(0,22px);opacity:0}25%{opacity:.9}100%{transform:translate(0,-10px);opacity:0}}
.hda-sensor-shake{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-sensor-shake{animation:hda-sensor-shake .22s linear infinite}
@keyframes hda-sensor-shake{0%,100%{transform:translate(0,0)}25%{transform:translate(-1.2px,.4px)}50%{transform:translate(1px,-.5px)}75%{transform:translate(-.6px,-.3px)}}
.hda-sensor-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-sensor-spin{animation:hda-sensor-spin 1.1s linear infinite}
@keyframes hda-sensor-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-sensor-beam{animation:hda-sensor-beam 3.4s ease-in-out infinite}
@keyframes hda-sensor-beam{50%{opacity:.6}}
.hda-sensor-dots{opacity:.8}
.hda-anim .hda-sensor-dots{animation:hda-sensor-dots 1.6s ease-in-out infinite}
@keyframes hda-sensor-dots{0%,100%{opacity:.35}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-sensor-"]{animation:none!important}}
`;

  const ic = (id, name, first, render, more) => Object.assign({ id, name, colors: sw(first), picker: true, colorLabel: "Body", render }, more || {});
  const wallBg = (u) => `<g class="hda-bg"><rect x="0" y="0" width="200" height="200" fill="url(#${u}-wv)"/></g>`;

  const icons = [
    ic("pir", "Corner motion", WH, (o) => { const u = o.uid, p = pal(o.color); let fx = "";
      if (o.on) { for (let i = 0; i < 6; i++) { const x1 = -6 + i * 36; fx += `<path class="${P}chase" style="animation-delay:${n1(-1.6 + i * .27)}s" d="M100 98L${x1} 198H${x1 + 20}Z" fill="url(#${u}-beam)"/>`; }
        fx = `<g opacity="${n1(.35 + .65 * o.level)}">${fx}</g>`; }
      const F = "M70 50L100 58L130 50L128 80Q125 101 100 108Q75 101 72 80Z";
      return svg(o,
      `<g class="hda-bg"><path d="M0 6H200V30L100 54L0 30Z" fill="url(#${u}-wr)"/><path d="M0 30L100 54V198H0Z" fill="url(#${u}-wl)" opacity=".6"/><path d="M100 54L200 30V198H100Z" fill="url(#${u}-wl)"/></g>` +
      `<g class="hda-bg"><path d="M0 30L100 54L200 30M100 54V198" fill="none" stroke="#fff" stroke-opacity=".14"/></g>` + fx +
      sh(o, 100, 112, 26, 5, .8) + part(o, F) +
      `<path d="M100 58L130 50L128 80Q125 101 100 108Z" fill="#000" fill-opacity=".12"/><path d="M72 51L100 58.5L128 51" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>` +
      `<ellipse cx="100" cy="87" rx="17.5" ry="14.5" fill="#000" fill-opacity=".25"/><ellipse cx="100" cy="86" rx="15.5" ry="12.6" fill="url(#${u}-lens)"/>` +
      `<g clip-path="url(#${u}-lc)" fill="none" stroke-width=".7"><path d="M91 73Q88 86 91 99M100 73V99M109 73Q112 86 109 99" stroke="#6b7684" stroke-opacity=".35"/><path d="M84 80Q100 77 116 80M84 92Q100 95 116 92" stroke="#6b7684" stroke-opacity=".3"/><path d="M92 73Q89 86 92 99M101 73V99M110 73Q113 86 110 99" stroke="#fff" stroke-opacity=".5"/></g>` +
      `<path d="M89 79Q94 75 101 75" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="2" stroke-linecap="round"/>` + led(o, 100, 67, 1.6, "r", o.on),
      `<clipPath id="${u}-lc"><ellipse cx="100" cy="86" rx="15.5" ry="12.6"/></clipPath>`); }),

    ic("ceiling", "Ceiling motion", WH, (o) => { const u = o.uid; let fx = "";
      if (o.on) fx = `<path d="M84 74L12 176Q100 194 188 176L116 74Z" fill="url(#${u}-beam)" opacity="${n1(.35 + .5 * o.level)}"/>` + rings(o, 100, 178, 86, 15, C.c, 3, 2.2);
      return svg(o,
      `<g class="hda-bg"><path d="M0 6H200V60Q100 76 0 60Z" fill="url(#${u}-wr)"/><path d="M0 60Q100 76 200 60" fill="none" stroke="#fff" stroke-opacity=".14"/></g>` +
      (o.on ? `<ellipse cx="100" cy="178" rx="92" ry="16" fill="#c4bde6" fill-opacity=".07"/>` : "") + fx +
      `<ellipse cx="100" cy="44" rx="40" ry="14" fill="#000" fill-opacity=".22"/>` +
      `<path d="${bandUp(66, 134, 44, 54, 13)}" fill="url(#${u}-c)"/>` +
      `<ellipse cx="100" cy="54" rx="34" ry="13" fill="url(#${u}-s)"/><ellipse cx="100" cy="54" rx="34" ry="13" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".7"/>` +
      `<path d="M70 50Q84 42 100 42" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>` +
      (o.on ? `<ellipse cx="100" cy="57" rx="23" ry="10" fill="none" stroke="${C.b}" stroke-width="2" class="${P}pulse"/><ellipse cx="100" cy="60" rx="34" ry="14" fill="url(#${u}-hb)" opacity=".6"/>` : `<ellipse cx="100" cy="57" rx="23" ry="10" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.4"/>`) +
      `<ellipse cx="100" cy="59" rx="19" ry="11" fill="url(#${u}-lens)"/>` +
      `<ellipse cx="100" cy="59.5" rx="13" ry="7.4" fill="none" stroke="#6b7684" stroke-opacity=".35" stroke-width=".7"/><ellipse cx="100" cy="60" rx="7" ry="4" fill="none" stroke="#6b7684" stroke-opacity=".35" stroke-width=".7"/>` +
      `<path d="M86 55Q92 50 100 50" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="1.8" stroke-linecap="round"/>`); }),

    ic("radar", "Presence radar", WH, (o) => { const u = o.uid; let fx = "";
      if (o.on) { const n = 3 + Math.round(o.level * 2);
        fx = arcs(78, 114, 0, n, 20, 18, 30, C.c, 2.2, 1.8);
        const pts = [[150, 84], [156, 88], [147, 92], [153, 96], [160, 98], [144, 102], [150, 106], [157, 108], [146, 114], [153, 118], [160, 122], [148, 126], [142, 132], [158, 132]];
        fx += `<g class="${P}dots">` + pts.map((q, i) => `<circle cx="${q[0]}" cy="${q[1]}" r="${i % 3 ? 1.6 : 2.2}" fill="${C.c}"/>`).join("") + `<circle cx="152" cy="108" r="26" fill="url(#${u}-hc)" opacity=".35"/></g>`; }
      return svg(o,
      `<g class="hda-bg"><path d="M10 140H120V150H10Z" fill="url(#${u}-wood)"/><path d="M10 140H120V150H10Z" fill="url(#${u}-grain)"/><path d="M10 140H120" stroke="#fff" stroke-opacity=".3"/><path d="M10 150H120V153H10Z" fill="#000" fill-opacity=".3"/></g>` +
      `<g class="hda-bg"><path d="M28 153V168L40 153" fill="#3a3540"/></g>` + fx +
      sh(o, 56, 140, 30, 3) +
      `<path d="M50 140C50 150 44 152 44 164S52 180 46 196" fill="none" stroke="#1d2026" stroke-width="2.4" stroke-linecap="round"/>` +
      rpart(o, 32, 92, 46, 48, 10, 3) +
      `<path d="${rr(38, 100, 34, 22, 6)}" fill="url(#${u}-dk)"/><path d="${rr(38, 100, 34, 22, 6)}" fill="url(#${u}-gls)"/>` +
      `<path d="M42 104Q54 101 66 104" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.2" stroke-linecap="round"/>` +
      led(o, 55, 130, 1.4, "b", o.on, P + "pulse")); }),

    ic("door", "Door contact", WH, (o) => { const u = o.uid;
      const m = quad(o.on ? [[22, 16], [104, 24], [104, 192], [22, 200]] : [[22, 16], [136, 16], [136, 200], [22, 200]]);
      const kn = m(.9, .56), ld = m(.875, .2);
      const gap = o.on ? `<path d="M104 16H137V200H104Z" fill="#0b0a14"/><g opacity="${n1(.5 + .4 * o.level)}"><path d="M104 16H137V200H104Z" fill="url(#${u}-sun)" class="${P}beam"/></g><path d="M104 24L110 24.6V191.4L104 192Z" fill="#cfc9df"/>` +
        `<path d="M136 200L186 200L160 186L136 186Z" fill="${C.w}" fill-opacity=".14"/>` : "";
      return svg(o,
      `<g class="hda-bg"><path d="M158 0H200V200H158Z" fill="url(#${u}-wl)"/>` + gap +
      `<path d="${qr(m, 0, 0, 1, 1)}" fill="url(#${u}-paint)"/>` +
      [[.12, .07, .88, .42], [.12, .5, .88, .94]].map((b) => `<path d="${qr(m, b[0], b[1], b[2], b[3])}" fill="#fff" fill-opacity=".06"/><path d="${qr(m, b[0] + .03, b[1] + .015, b[2] - .03, b[3] - .015)}" fill="#000" fill-opacity=".06" stroke="#fff" stroke-opacity=".14" stroke-width=".8"/>`).join("") +
      `<path d="${qr(m, 0, 0, 1, 1)}" fill="url(#${u}-fx)" opacity=".6"/>` +
      `<circle cx="${n1(kn[0])}" cy="${n1(kn[1] + 2)}" r="6" fill="#000" fill-opacity=".3"/><circle cx="${n1(kn[0])}" cy="${n1(kn[1])}" r="5.5" fill="url(#${u}-br)"/><circle cx="${n1(kn[0] - 1.6)}" cy="${n1(kn[1] - 1.8)}" r="1.6" fill="#fff" fill-opacity=".8"/>` +
      `<path d="M10 4H158V16H10Z" fill="url(#${u}-trv)"/><path d="M10 4H22V200H10Z" fill="url(#${u}-trim)"/><path d="M136 4H158V200H136Z" fill="url(#${u}-trim)"/><path d="M10 16H158" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="M136 16V200" stroke="#000" stroke-opacity=".3"/></g>` +
      sh(o, 144, 76, 6, 3, .7) + rpart(o, 139.5, 46, 8, 28, 3) +
      `<path d="${qr(m, .8, .155, .94, .345)}" fill="#000" fill-opacity=".28" transform="translate(1.4 2)"/>` + part(o, qr(m, .8, .15, .94, .34)) +
      led(o, n1(ld[0]), n1(ld[1]), 1.4, "r", o.on)); }),

    ic("window", "Window contact", WH, (o) => { const u = o.uid, y0 = o.on ? 70 : 102;
      const sash = (y, h) => `<path d="M42 ${y}H158V${y + h}H42Z" fill="url(#${u}-trv)"/><path d="M50 ${y + 8}H150V${y + h - 8}H50Z" fill="url(#${u}-sky)"/><path d="M50 ${y + 8}H150V${y + h - 8}H50Z" fill="url(#${u}-gls)"/><path d="M99 ${y + 8}H101V${y + h - 8}H99Z" fill="url(#${u}-trim)"/><path d="M50 ${y + 8}H150" stroke="#000" stroke-opacity=".35"/><path d="M42 ${y + .5}H158" stroke="#fff" stroke-opacity=".5"/>`;
      return svg(o, wallBg(u) +
      `<g class="hda-bg"><path d="${rr(28, 12, 144, 172, 3)}" fill="url(#${u}-trim)"/><path d="M42 24H158V176H42Z" fill="#0d0c18"/>` +
      `<circle cx="70" cy="${y0 + 90}" r=".9" fill="#fff" fill-opacity=".7"/><circle cx="120" cy="${y0 + 84}" r=".7" fill="#fff" fill-opacity=".6"/>` +
      sash(24, 80) + `<circle cx="130" cy="44" r="1" fill="#fff" fill-opacity=".7"/><circle cx="70" cy="58" r=".8" fill="#fff" fill-opacity=".5"/>` +
      sash(y0, 74) + `<path d="M42 ${y0 + 74}H158V${y0 + 77}H42Z" fill="#000" fill-opacity=".35"/></g>` +
      (o.on ? [0, 1, 2].map((i) => `<path class="${P}breeze" style="animation-delay:${n1(-i * .85)}s" d="M${70 + i * 22} ${154 + i * 5}q8 -5 16 0t16 0" fill="none" stroke="#cfe8ff" stroke-width="1.6" stroke-linecap="round"/>`).join("") : "") +
      `<g class="hda-bg"><path d="M20 176H180V186H20Z" fill="url(#${u}-trv)"/><path d="M20 176H180" stroke="#fff" stroke-opacity=".6"/><path d="M20 186H180V189H20Z" fill="#000" fill-opacity=".3"/></g>` +
      rpart(o, 150.5, y0 + 16, 6, 20, 2.5) + sh(o, 166, 152, 7, 3, .6) + rpart(o, 160, 118, 9, 32, 3) + led(o, 164.5, 123, 1.2, "r", o.on)); }),

    ic("garage", "Garage tilt", WH, (o) => { const u = o.uid, lift = o.on ? 40 : 0; let pan = "";
      const panel = (y) => `<path d="M24 ${y}H176V${y + 34}H24Z" fill="url(#${u}-env)"/>` + [28, 102].map((x) => `<path d="M${x + 4} ${y + 6}H${x + 66}V${y + 28}H${x + 4}Z" fill="#000" fill-opacity=".07"/><path d="M${x + 4} ${y + 28}V${y + 6}H${x + 66}" fill="none" stroke="#fff" stroke-opacity=".7"/><path d="M${x + 66} ${y + 6}V${y + 28}H${x + 4}" fill="none" stroke="#000" stroke-opacity=".22"/>`).join("") + `<path d="M24 ${y + 34}H176" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>`;
      for (let i = o.on ? 1 : 0; i < 4; i++) pan += panel(48 + 34 * i - lift);
      const top = o.on ? `<g class="hda-bg"><path d="M34 24H166L176 42H24Z" fill="url(#${u}-env)"/><path d="M34 24H166L176 42H24Z" fill="#000" fill-opacity=".12"/><path d="M34 24.5H166" stroke="#fff" stroke-opacity=".5"/></g>` +
        sh(o, 102, 39, 13, 2.5, .7) + rpart(o, 90, 28, 24, 9, 3) + led(o, 108, 32.5, 1.2, "r", true) + arcs(102, 26, -90, 3, 8, 7, 32, C.c, 1.6) : "";
      return svg(o, wallBg(u) +
      `<g class="hda-bg"><path d="M6 10H194V24H6Z" fill="url(#${u}-wood)"/><path d="M6 10H194V24H6Z" fill="url(#${u}-grain)"/></g>` +
      (o.on ? `<g class="hda-bg"><path d="M24 144H176V184H24Z" fill="url(#${u}-day)"/><path d="M24 168H176V184H24Z" fill="#9a8f7c" fill-opacity=".6"/><path d="M24 184H176L198 200H2Z" fill="${C.w}" fill-opacity=".22" class="${P}beam"/></g>` : "") +
      `<g class="hda-bg">${pan}</g>` + top + `<g class="hda-bg"><path d="M24 ${184 - lift}H176V${187 - lift}H24Z" fill="#1d1f24"/>` +
      `<path d="M14 ${o.on ? 30 : 40}H22V188H14Z" fill="url(#${u}-st)"/><path d="M178 ${o.on ? 30 : 40}H186V188H178Z" fill="url(#${u}-st)"/>` +
      [0, 1, 2, 3].map((i) => { const y = 82 + 34 * i - lift; return y > 48 && y < 186 ? `<circle cx="18" cy="${y}" r="3" fill="#2a2d33"/><circle cx="182" cy="${y}" r="3" fill="#2a2d33"/>` : ""; }).join("") + `</g>` +
      (o.on ? "" : sh(o, 101, 80, 10, 3, .6) + rpart(o, 92, 54, 16, 24, 3) + led(o, 100, 59, 1.2, "r", false) + `<path d="M96 66H104M96 70H104" stroke="#000" stroke-opacity=".18"/>`)); }),

    ic("leak", "Water leak", WH, (o) => { const u = o.uid, L = o.level; let tiles = "", wet = "";
      [-80, -20, 40, 100, 160, 220, 280].forEach((xb) => { tiles += `<path d="M${n1(100 + (xb - 100) * .5)} 120L${xb} 200" stroke="#fff" stroke-opacity=".07"/>`; });
      [134, 154, 182].forEach((y) => { tiles += `<path d="M0 ${y}H200" stroke="#fff" stroke-opacity=".07"/>`; });
      if (o.on) { const cx = 118, cy = 162, Rx = 42 + 30 * L, Ry = 12 + 6 * L;
        const bl = `M${n1(cx - Rx)} ${cy}C${n1(cx - Rx)} ${n1(cy - Ry * 1.3)} ${n1(cx - Rx * .3)} ${n1(cy - Ry * 1.1)} ${n1(cx + Rx * .1)} ${n1(cy - Ry)}C${n1(cx + Rx * .7)} ${n1(cy - Ry * .9)} ${n1(cx + Rx)} ${n1(cy - Ry * .6)} ${n1(cx + Rx)} ${n1(cy + Ry * .1)}C${n1(cx + Rx)} ${n1(cy + Ry * .9)} ${n1(cx + Rx * .2)} ${n1(cy + Ry * 1.1)} ${n1(cx - Rx * .3)} ${n1(cy + Ry)}C${n1(cx - Rx * .8)} ${n1(cy + Ry * .9)} ${n1(cx - Rx)} ${n1(cy + Ry * .5)} ${n1(cx - Rx)} ${cy}Z`;
        wet = `<path d="M74 136Q80 146 92 150L84 154Q72 146 70 136Z" fill="url(#${u}-wt)"/><path d="${bl}" fill="url(#${u}-wt)"/><path d="${bl}" fill="none" stroke="#cfeeff" stroke-opacity=".45" stroke-width=".8"/>` +
          `<path d="M${n1(cx - Rx * .6)} ${n1(cy - Ry * .5)}Q${cx - 10} ${n1(cy - Ry * .8)} ${cx + 10} ${n1(cy - Ry * .7)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>` +
          rings(o, 85, 138, 12, 4, "#cfeeff", 2, 1.2) + rings(o, 124, 164, 40, 10, "#cfeeff", 3, 1.2) + drop(85, 98, .9, P + "drip", 0) + drop(85, 98, .9, P + "drip", -.7); }
      return svg(o,
      `<g class="hda-bg"><path d="M0 0H200V120H0Z" fill="url(#${u}-wl)"/><path d="M0 120H200V200H0Z" fill="url(#${u}-fl)"/>` + tiles +
      sh(o, 40, 128, 58, 7) + `<path d="${band(-14, 94, 0, 118, 10)}" fill="url(#${u}-en)"/><path d="${band(-16, 96, 112, 124, 10)}" fill="#2a2638"/>` +
      `<path d="M-14 40A54 10 0 0 0 94 40" fill="none" stroke="#000" stroke-opacity=".18"/>` + hl(4, 4, 4, 112, 3, .3) +
      `<path d="M58 92H70V100H58Z" fill="url(#${u}-br)"/><path d="M68 94H76V98H68Z" fill="url(#${u}-br)"/><circle cx="62" cy="88" r="4" fill="url(#${u}-br)"/>` +
      `<path d="M82 0H88V94H82Z" fill="url(#${u}-cu)"/><path d="M81 92H89V97H81Z" fill="url(#${u}-cu)"/></g>` + wet +
      sh(o, 124, 166, 34, 7) + `<ellipse cx="112" cy="161" rx="2.4" ry="1.2" fill="url(#${u}-br)"/><ellipse cx="136" cy="161" rx="2.4" ry="1.2" fill="url(#${u}-br)"/>` +
      `<path d="${band(98, 150, 148, 158, 9)}" fill="url(#${u}-c)"/><ellipse cx="124" cy="148" rx="26" ry="9" fill="url(#${u}-s)"/><ellipse cx="124" cy="148" rx="26" ry="9" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>` +
      `<ellipse cx="124" cy="148.5" rx="17" ry="5.6" fill="none" stroke="#000" stroke-opacity=".12"/>` + led(o, 124, 148.5, 1.8, "r", o.on) +
      (o.on ? arcs(124, 140, -90, 3, 12, 9, 40, C.r, 1.8, 1.2) : "")); }),

    ic("smoke", "Smoke alarm", WH, (o) => { const u = o.uid; let vents = "", fx = "";
      for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
        vents += `<path d="M${n1(100 + c * 40)} ${n1(54 + s * 14.2)}L${n1(100 + c * 49)} ${n1(54 + s * 17.4)}" stroke="#000" stroke-opacity=".38" stroke-width="2.4" stroke-linecap="round"/>`; }
      if (o.on) { const n = 2 + Math.round(o.level * 2);
        for (let i = 0; i < n; i++) { const x = 60 + i * (80 / Math.max(1, n - 1)) + (i % 2 ? 6 : -4);
          fx += `<path class="${P}wisp" style="animation-delay:${n1(-i * 3.6 / n)}s" d="M${n1(x)} 190C${n1(x - 14)} 168 ${n1(x + 14)} 150 ${n1(x)} 128S${n1(x - 10)} 100 ${n1(x + 4)} 82" fill="none" stroke="url(#${u}-smk)" stroke-width="${12 + i % 2 * 5}" stroke-linecap="round"/>`; }
        fx = `<ellipse cx="100" cy="120" rx="80" ry="40" fill="#d9d6e4" fill-opacity="${n1(.04 + .07 * o.level)}"/>` + fx + arcs(52, 62, 180, 3, 10, 9, 34, C.r, 2, 1.1) + arcs(148, 62, 0, 3, 10, 9, 34, C.r, 2, 1.1); }
      return svg(o,
      `<g class="hda-bg"><path d="M0 6H200V44Q100 58 0 44Z" fill="url(#${u}-wr)"/></g>` + fx +
      `<ellipse cx="100" cy="38" rx="60" ry="20" fill="#000" fill-opacity=".22"/>` +
      `<path d="${bandUp(44, 156, 38, 54, 20)}" fill="url(#${u}-c)"/>` +
      `<ellipse cx="100" cy="54" rx="56" ry="20" fill="url(#${u}-s)"/><ellipse cx="100" cy="54" rx="56" ry="20" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".7"/>` + vents +
      `<ellipse cx="100" cy="55" rx="28" ry="10" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1.2"/>` +
      `<ellipse cx="100" cy="57" rx="18" ry="6.6" fill="#000" fill-opacity=".2"/><ellipse cx="100" cy="55.5" rx="17" ry="6.2" fill="url(#${u}-v)"/><path d="M88 54Q94 51 102 51" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path d="M58 44Q76 36 98 35" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` + led(o, 132, 60, 1.7, "r", o.on)); }),

    ic("co", "CO alarm", WH, (o) => { const u = o.uid, ppm = o.on ? String(Math.round(40 + 360 * o.level)) : "0";
      const lcd = o.on ? `<path d="${rr(69, 55, 62, 24, 3)}" fill="url(#${u}-lcdr)"/>` : `<path d="${rr(69, 55, 62, 24, 3)}" fill="#7e8a80"/>`;
      let slots = ""; for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) slots += `<path d="${rr(68 + i * 9 + (r % 2) * 4, 32 + r * 6, 5, 2.6, 1.3)}" fill="#000" fill-opacity=".42"/>`;
      return svg(o, wallBg(u) +
      sh(o, 102, 172, 40, 4) + `<path d="${rr(66, 26, 68, 146, 7)}" fill="url(#${u}-trim)"/><path d="M68 27H132" stroke="#fff" stroke-opacity=".6"/>` +
      `<path d="${rr(80, 126, 40, 32, 9)}" fill="#cbc6da"/><path d="${rr(80, 126, 40, 32, 9)}" fill="url(#${u}-fx)"/><path d="M91 134h3v10h-3zM106 134h3v12h-3z" fill="#1a1820"/><path d="M97 152a3 3 0 0 1 6 0v2h-6z" fill="#1a1820"/>` +
      `<circle cx="100" cy="164" r="2" fill="url(#${u}-st)"/>` +
      `<path d="${rr(57, 25, 92, 96, 16)}" fill="#000" fill-opacity=".3"/>` + rpart(o, 54, 20, 92, 96, 16) + slots +
      `<path d="${rr(66, 52, 68, 30, 5)}" fill="url(#${u}-dk)"/>` + lcd +
      seg7(ppm.padStart(3, " "), 79, 59, 15, o.on ? "#2a1608" : "#1c241e", o.on ? "rgba(0,0,0,.08)" : "rgba(0,0,0,.07)") +
      `<text x="128" y="77" text-anchor="end" font-family="Arial,sans-serif" font-size="5.5" font-weight="700" fill="${o.on ? "#2a1608" : "#1c241e"}">PPM</text>` +
      `<path d="${rr(69, 55, 62, 10, 3)}" fill="#fff" fill-opacity=".12"/>` +
      `<circle cx="100" cy="100" r="8.5" fill="#000" fill-opacity=".2"/><circle cx="100" cy="99" r="7.5" fill="url(#${u}-s)"/><path d="M95.5 96Q98 93.5 102 94" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/>` +
      led(o, 76, 99, 1.6, "g", true, "") + led(o, 124, 99, 1.6, "r", o.on) +
      (o.on ? arcs(54, 66, 180, 3, 8, 9, 34, C.r, 2, 1.1) + arcs(146, 66, 0, 3, 8, 9, 34, C.r, 2, 1.1) : ""),
      lin(u + "-lcdr", [[0, "#ffd08a"], [1, "#ff8a3c"]], 1)); }),

    ic("temp", "Temp & humidity", WH, (o) => { const u = o.uid, t = o.on ? Math.round(60 + 30 * o.level) : 70, hm = o.on ? Math.round(30 + 50 * o.level) : 45;
      const ink = o.on ? "#24170a" : "#1a2019", gh = "rgba(0,0,0,.07)";
      return svg(o,
      `<g class="hda-bg"><path d="M14 150H186V160H14Z" fill="url(#${u}-wood)"/><path d="M14 150H186V160H14Z" fill="url(#${u}-grain)"/><path d="M14 150H186" stroke="#fff" stroke-opacity=".3"/><path d="M14 160H186V163H14Z" fill="#000" fill-opacity=".3"/></g>` +
      sh(o, 102, 151, 54, 4) + `<path d="M78 146L72 151H132L126 146Z" fill="${pal(o.color).k}"/>` +
      rpart(o, 50, 48, 100, 100, 20, 4) +
      `<path d="${rr(60, 58, 80, 70, 9)}" fill="url(#${u}-dk)"/>` +
      `<path d="${rr(63, 61, 74, 64, 7)}" fill="${o.on ? `url(#${u}-lcdt)` : "#a3ad9f"}"/>` +
      seg7(String(t), 70, 68, 26, ink, gh) + `<circle cx="113" cy="70" r="2.4" fill="none" stroke="${ink}" stroke-width="1.4"/><text x="118" y="78" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="${ink}">F</text>` +
      `<path d="M66 99H134" stroke="${ink}" stroke-opacity=".25"/>` +
      `<path d="M72 104c-2 3 -3 5 -3 6.6a3 3 0 0 0 6 0c0 -1.6 -1 -3.6 -3 -6.6z" fill="${ink}"/>` + seg7(String(hm), 92, 103, 14, ink, gh) +
      `<text x="116" y="116" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="${ink}">%</text>` +
      (o.on ? `<g class="${P}blink"><path d="M124 64L131 76H117Z" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linejoin="round"/><path d="M124 68V72M124 74V74.6" stroke="${ink}" stroke-width="1.3" stroke-linecap="round"/></g>` : "") +
      `<path d="${rr(63, 61, 74, 22, 7)}" fill="#fff" fill-opacity=".12"/>` +
      led(o, 100, 137, 1.4, "a", o.on, P + "pulse") + (o.on ? arcs(146, 52, -45, 3, 7, 6, 30, C.c, 1.6) : ""),
      lin(u + "-lcdt", [[0, "#ffe2a8"], [1, "#ffb25a"]], 1)); }),

    ic("outdoor", "Outdoor sensor", WH, (o) => { const u = o.uid; let plates = "", rain = "";
      for (let i = 5; i >= 0; i--) { const y = 66 + i * 12;
        plates += `<path d="${band(82, 158, y, y + 4, 9)}" fill="url(#${u}-c)"/><ellipse cx="120" cy="${y}" rx="38" ry="9" fill="url(#${u}-tp)"/><ellipse cx="120" cy="${y}" rx="38" ry="9" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".5" stroke-width=".6"/>`;
        if (o.on) plates += `<circle cx="${100 + i * 7}" cy="${y + 3}" r="1.2" fill="#cfeeff"/><circle cx="${132 - i * 4}" cy="${y + 5}" r="1" fill="#cfeeff"/>`; }
      if (o.on) { const n = 8 + Math.round(o.level * 8);
        for (let i = 0; i < n; i++) { const x = 8 + (i * 47) % 188, y = 20 + (i * 71) % 160;
          rain += `<path class="${P}fall" style="animation-delay:${n1(-(i * .37) % .9)}s" d="M${x} ${y}l-3 9" stroke="#bfe0ff" stroke-width="1.4" stroke-linecap="round"/>`; }
        rain = `<path d="M30 30C20 30 18 18 28 15C30 4 48 4 52 12C60 6 74 12 70 22C78 24 76 32 68 32H30Z" fill="#4c4a62" fill-opacity=".85"/>` + rain; }
      return svg(o, rain +
      `<g class="hda-bg"><path d="M18 36H46V200H18Z" fill="url(#${u}-wh)"/><path d="M18 36H46V200H18Z" fill="url(#${u}-vgrain)"/><path d="M15 30H49L46 38H18Z" fill="url(#${u}-wood)"/></g>` +
      `<path d="M46 100H86V106H46Z" fill="url(#${u}-st)"/><path d="M44 92H52V114H44Z" fill="url(#${u}-st)"/>` +
      `<path d="${band(98, 142, 66, 132, 6)}" fill="#14161c"/>` + plates +
      `<path d="M82 66Q82 52 120 50Q158 52 158 66A38 9 0 0 1 82 66Z" fill="url(#${u}-s)"/><path d="M92 58Q104 52 120 52" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="M146 56V24" stroke="#1d2026" stroke-width="2.2" stroke-linecap="round"/><circle cx="146" cy="23" r="2.6" fill="#2a2d33"/>` +
      `<path d="M114 140H126V148H114Z" fill="url(#${u}-dk)"/>` + led(o, 120, 144, 1.2, "g", o.on, P + "pulse") +
      (o.on ? arcs(146, 24, -30, 3, 7, 6, 34, C.c, 1.6) : "")); }),

    ic("lux", "Light sensor", WH, (o) => { const u = o.uid, L = o.level;
      const sky = o.on ? `<path d="M46 20H154V118H46Z" fill="url(#${u}-day)"/><circle cx="78" cy="48" r="26" fill="url(#${u}-hw)"/><circle cx="78" cy="48" r="12" fill="#fff6d6"/>`
        : `<path d="M46 20H154V118H46Z" fill="url(#${u}-sky)"/><path d="M80 36a11 11 0 1 0 8 18a9 9 0 1 1 -8 -18z" fill="#f2efe0"/><circle cx="128" cy="40" r=".9" fill="#fff"/><circle cx="112" cy="90" r=".7" fill="#fff"/><circle cx="60" cy="96" r=".8" fill="#fff"/>`;
      return svg(o, wallBg(u) +
      `<g class="hda-bg"><path d="${rr(36, 10, 128, 118, 3)}" fill="url(#${u}-trim)"/>` + sky + `<path d="M46 20H154V118H46Z" fill="url(#${u}-gls)"/>` +
      `<path d="M98 20H102V118H98ZM46 67H154V71H46Z" fill="url(#${u}-trv)"/></g>` +
      `<g class="hda-bg"><path d="M24 126H176V136H24Z" fill="url(#${u}-trv)"/><path d="M24 126H176" stroke="#fff" stroke-opacity=".6"/><path d="M24 136H176V139H24Z" fill="#000" fill-opacity=".3"/></g>` +
      (o.on ? `<g class="${P}beam" opacity="${n1(.4 + .6 * L)}"><path d="M54 26L100 26L186 132L126 132Z" fill="url(#${u}-sun)"/><path d="M60 64L82 64L150 132L116 132Z" fill="url(#${u}-sun)" opacity=".7"/></g><ellipse cx="142" cy="130" rx="34" ry="4" fill="${C.w}" fill-opacity=".35"/>` : "") +
      sh(o, 142, 127, 20, 3) + `<path d="${band(126, 158, 118, 125, 5)}" fill="url(#${u}-c)"/><ellipse cx="142" cy="118" rx="16" ry="5" fill="url(#${u}-tp)"/>` +
      `<path d="M133 118A9 9 0 0 1 151 118A9 3 0 0 1 133 118Z" fill="#dff1ff" fill-opacity=".35"/><path d="M133 118A9 9 0 0 1 151 118" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><ellipse cx="142" cy="116" rx="3" ry="2" fill="#2a2d33"/>` +
      (o.on ? `<circle cx="138.5" cy="112.5" r="5" fill="url(#${u}-hw)"/><circle cx="138.5" cy="112.5" r="1.4" fill="#fff"/>` : `<path d="M136.5 113Q138 111 140.5 110.6" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1" stroke-linecap="round"/>`) +
      led(o, 152, 121.5, 1, "g", o.on, P + "pulse")); }),

    ic("washer", "Vibration sensor", WH, (o) => { const u = o.uid, p = pal(o.color); let fx = "";
      if (o.on) { const n = 2 + Math.round(o.level * 2);
        for (let k = 0; k < n; k++) { const off = 10 + k * 11, op = n1(.85 - k * .18);
          fx += [-1, 1].map((sd) => `<path class="${P}pulse" style="animation-delay:${n1(-k * .25)}s" d="M${100 + sd * (40 + off)} 86l${sd * 5} 6l${-sd * 5} 6l${sd * 5} 6l${-sd * 5} 6l${sd * 5} 6" fill="none" stroke="${C.a}" stroke-opacity="${op}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`).join(""); }
        fx += `<path d="M72 150q8 -3 16 0M112 150q8 -3 16 0" fill="none" stroke="${C.a}" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>`; }
      return svg(o, wallBg(u) + fx + sh(o, 100, 146, 46, 6, .8) +
      `<g class="${o.on ? P + "shake" : ""}">` +
      `<path d="${rr(62, 70, 76, 72, 18)}" fill="${p.k}" transform="translate(0 5)"/>` + part(o, rr(62, 70, 76, 72, 18)) +
      `<path d="${rr(70, 78, 60, 56, 13)}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/><path d="M76 76Q92 72 118 74" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M88 108l5 -8l5 12l5 -14l5 10l4 -5" fill="none" stroke="${o.on ? C.a : p.k}" stroke-opacity="${o.on ? 1 : .35}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` +
      led(o, 100, 126, 1.6, "a", o.on) + `</g>`); }),

    ic("glass", "Glass break", WH, (o) => { const u = o.uid; let crack = "";
      if (o.on) { const cx = 150, cy = 84; let d = "";
        [[0, 34], [42, 30], [95, 40], [140, 28], [185, 34], [230, 40], [280, 30], [320, 36]].forEach((a, i) => { const t = a[0] * R, j = (i % 2 ? 5 : -5) * R;
          d += `M${cx} ${cy}L${n1(cx + Math.cos(t + j) * a[1] * .45)} ${n1(cy + Math.sin(t + j) * a[1] * .45)}L${n1(cx + Math.cos(t) * a[1])} ${n1(cy + Math.sin(t) * a[1])}`; });
        crack = `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="1" stroke-linejoin="round"/><path d="M141 80L148 74L158 79L156 90L146 92Z" fill="#05050c"/><path d="M141 80L148 74L158 79" fill="none" stroke="#fff" stroke-opacity=".7"/>` +
          `<ellipse cx="150" cy="84" rx="18" ry="16" fill="none" stroke="#fff" stroke-opacity=".35" stroke-dasharray="6 5"/>` +
          [[132, 170], [150, 176], [168, 168], [140, 182]].map((q, i) => `<path class="${P}shard" style="animation-delay:${n1(-i * .45)}s" d="M${q[0]} ${q[1]}l5 -6l3 8z" fill="#dff1ff" fill-opacity=".6"/>`).join("") +
          arcs(134, 88, 180, 4, 14, 11, 26, C.a, 2, 1.2); }
      return svg(o, wallBg(u) +
      `<g class="hda-bg"><path d="${rr(102, 22, 88, 150, 3)}" fill="url(#${u}-trim)"/><path d="M112 32H180V162H112Z" fill="url(#${u}-sky)"/><path d="M112 32H180V162H112Z" fill="url(#${u}-gls)"/>` +
      `<path d="M112 32H180" stroke="#000" stroke-opacity=".4"/><path d="M96 170H196V178H96Z" fill="url(#${u}-trv)"/>` + crack + `</g>` +
      `<circle cx="54" cy="100" r="29" fill="#000" fill-opacity=".28"/><circle cx="52" cy="97" r="28" fill="url(#${u}-s)"/><circle cx="52" cy="97" r="28" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".7"/>` +
      `<circle cx="52" cy="99" r="18" fill="#000" fill-opacity=".1"/><circle cx="52" cy="99" r="17" fill="url(#${u}-mesh)"/><circle cx="52" cy="99" r="3" fill="#1a1c22"/>` +
      `<path d="M32 84Q40 72 54 70" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>` + led(o, 52, 77, 1.5, "r", o.on)); }),

    ic("mailbox", "Mailbox sensor", GY, (o) => { const u = o.uid, p = pal(o.color);
      const front = o.on ? `<path d="M140 118V90A18 18 0 0 1 176 90V116Z" fill="#0c0b15"/><path d="M146 118L150 98H162L160 117Z" fill="#f3efe6"/><path d="M154 117L160 102H170L168 116Z" fill="#e7f0ff"/>` +
        `<path d="M140 118L176 116L186 142A20 10 0 0 1 150 148Z" fill="${p.d}"/><path d="M140 118L176 116L186 142A20 10 0 0 1 150 148Z" fill="url(#${u}-g)" opacity=".25"/><path d="M140 118L176 116" stroke="#000" stroke-opacity=".4"/>` +
        `<path d="${rr(150, 76, 14, 8, 2)}" fill="${WH}"/>` + led(o, 161, 80, 1.1, "r", true)
        : `<path d="M140 118V90A18 18 0 0 1 176 90V116Z" fill="url(#${u}-c)"/><path d="M144 116V91A14 14 0 0 1 172 91V114Z" fill="none" stroke="#000" stroke-opacity=".25"/><path d="M154 76H162V82H154Z" fill="url(#${u}-st)"/>`;
      return svg(o,
      sh(o, 102, 196, 30, 4) + `<path d="M93 120H111V198H93Z" fill="url(#${u}-wh)"/><path d="M93 120H111V198H93Z" fill="url(#${u}-vgrain)"/><path d="M50 118H160V126H50Z" fill="url(#${u}-wood)"/>` +
      `<path d="M30 92C30 78 38 74 50 74L158 72A18 18 0 0 0 140 90Z" fill="url(#${u}-v)"/>` +
      [80, 85].map((y) => `<path d="M40 ${y}L148 ${y - 3}" stroke="#fff" stroke-opacity=".22"/>`).join("") +
      `<path d="M30 92L140 90V118L30 120Z" fill="url(#${u}-v)"/><path d="M30 92L140 90V118L30 120Z" fill="#000" fill-opacity=".14"/><path d="M30 92L140 90" stroke="#fff" stroke-opacity=".35"/>` +
      `<path d="M30 92C30 82 36 76 44 75" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` + front +
      (o.on ? `<path d="M118 100V60" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/><path d="M118 60H134V72H118Z" fill="#e0453a"/>` : `<path d="M120 102H92" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/><path d="M92 97H80V107H92Z" fill="#e0453a"/>`) +
      `<circle cx="119" cy="101" r="2.4" fill="url(#${u}-st)"/>` +
      (o.on ? arcs(158, 66, -90, 3, 8, 7, 34, C.c, 1.8) : ""),
      ""); }, { colorLabel: "Mailbox", colors: ["#9ba3ad", "#2c2f36", "#f2f3f5", "#3f6b4a", "#8f2f2a"] }),

    ic("bed", "Bed sensor", WH, (o) => { const u = o.uid;
      const blanket = o.on ? "M66 112C84 94 116 98 138 104C158 109 172 104 188 110V146H66Q60 128 66 112Z" : "M78 110H184Q188 110 188 116V146H78Q72 128 78 110Z";
      return svg(o, `<g class="hda-bg"><path d="M0 166H200V200H0Z" fill="url(#${u}-fl)"/></g>` + sh(o, 104, 178, 92, 6) +
      `<path d="M36 156H46V178H36ZM172 156H182V178H172Z" fill="url(#${u}-wh)"/>` +
      `<path d="M28 142H190V158H28Z" fill="url(#${u}-wood)"/><path d="M28 142H190V158H28Z" fill="url(#${u}-grain)"/>` +
      `<path d="${rr(12, 60, 28, 118, 6)}" fill="url(#${u}-wh)"/><path d="${rr(12, 60, 28, 118, 6)}" fill="url(#${u}-vgrain)"/><path d="M14 62H38" stroke="#fff" stroke-opacity=".35"/>` +
      `<path d="${rr(54, 139, 120, 5, 2)}" fill="url(#${u}-v)"/>` + (o.on ? `<path d="${rr(54, 139, 120, 5, 2)}" fill="${C.c}" fill-opacity=".55" class="${P}pulse"/><ellipse cx="114" cy="141" rx="70" ry="7" fill="url(#${u}-hc)" opacity=".5"/>` : "") +
      `<path d="${rr(32, 112, 158, 30, 9)}" fill="url(#${u}-env)"/><path d="M40 127H186" stroke="#000" stroke-opacity=".08"/>` +
      `<path d="${rr(42, 96, 46, 20, 10)}" fill="url(#${u}-env)"/><path d="M48 100Q64 96 80 100" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.4"/>` +
      (o.on ? `<circle cx="64" cy="100" r="10" fill="#d9ad8c"/><path d="M54 100C54 90 66 86 74 94C70 92 62 94 58 102Z" fill="#4a3426"/>` : "") +
      `<path d="${blanket}" fill="#6f7fb2"/><path d="${blanket}" fill="url(#${u}-g)" opacity=".25"/><path d="${blanket}" fill="url(#${u}-fx)" opacity=".6"/>` +
      `<path d="${o.on ? "M66 112Q60 128 66 146" : "M78 110Q72 128 78 146"}" fill="none" stroke="#e8ecf8" stroke-width="5" stroke-opacity=".6"/>` +
      `<path d="M174 142C178 150 166 158 168 170" fill="none" stroke="#1d2026" stroke-width="1.6"/>` +
      sh(o, 168, 184, 12, 2.5) + rpart(o, 158, 170, 20, 13, 3) + led(o, 172, 176.5, 1.1, "c", o.on, P + "pulse")); }),

    ic("soil", "Soil probe", WH, (o) => { const u = o.uid, dry = o.on;
      const lf = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0C-12 -10 -11 -30 0 -42C11 -30 12 -10 0 0Z" fill="url(#${u}-${dry ? "lfd" : "lf"})"/><path d="M0 -2V-38" stroke="#fff" stroke-opacity=".3" stroke-width="1"/></g>`;
      const leaves = dry ? [[78, 104, -110, .85], [90, 98, -60, .9], [104, 102, 70, .85], [112, 112, 120, .8], [86, 110, -140, .75]] : [[76, 100, -42, .95], [90, 92, -12, 1.05], [106, 96, 22, 1], [116, 106, 52, .9], [80, 110, -70, .85]];
      const stems = dry ? "M92 124C90 114 82 108 78 104M94 124C94 110 92 102 90 98M96 124C98 112 102 104 104 102M98 124C104 120 110 116 112 112M92 124C90 118 88 112 86 110" : "M92 124C88 114 80 106 76 100M94 124C92 110 90 98 90 92M96 124C100 112 104 102 106 96M98 124C106 120 112 112 116 106M92 124C86 120 82 114 80 110";
      return svg(o, sh(o, 100, 192, 44, 5) +
      `<path d="M52 134L148 134L136 190L64 190Z" fill="url(#${u}-tc)"/><path d="M52 134L148 134L136 190L64 190Z" fill="url(#${u}-fx)" opacity=".7"/>` +
      `<path d="M46 122H154V136H46Z" fill="url(#${u}-tc)"/><path d="M46 122H154" stroke="#fff" stroke-opacity=".35"/><path d="M48 136H152" stroke="#000" stroke-opacity=".3"/>` +
      `<ellipse cx="100" cy="124" rx="50" ry="7" fill="${dry ? "#8f7254" : "#3b2516"}"/>` +
      (dry ? `<path d="M64 124l10 -2l6 3M110 122l8 3l10 -2M90 127l6 -2" fill="none" stroke="#5a4330" stroke-width=".9"/>` : `<ellipse cx="96" cy="123" rx="34" ry="3.4" fill="#000" fill-opacity=".2"/><circle cx="72" cy="124" r=".9" fill="#fff" fill-opacity=".3"/><circle cx="118" cy="125" r=".9" fill="#fff" fill-opacity=".3"/>`) +
      `<path d="${stems}" fill="none" stroke="${dry ? "#8b8f52" : "#3f7a3c"}" stroke-width="2" stroke-linecap="round"/>` + leaves.map((l) => lf(l[0], l[1], l[2], l[3])).join("") +
      `<path d="M127 90H133V125H127Z" fill="url(#${u}-st)"/><ellipse cx="130" cy="125" rx="5" ry="1.6" fill="#000" fill-opacity=".45"/>` +
      sh(o, 131, 98, 12, 2.5, .6) + rpart(o, 116, 54, 28, 40, 9) +
      `<path d="${rr(121, 60, 18, 22, 5)}" fill="url(#${u}-dk)"/>` +
      `<path class="${dry ? P + "blink" : ""}" d="M130 64c-3 4 -4.5 6.6 -4.5 8.6a4.5 4.5 0 0 0 9 0c0 -2 -1.5 -4.6 -4.5 -8.6z" fill="${dry ? C.a : C.c}" fill-opacity="${dry ? 1 : .8}"/>` +
      led(o, 130, 88, 1.3, dry ? "r" : "g", true, dry ? null : ""),
      lin(u + "-tc", [[0, "#7a3c22"], [.3, "#e08a5c"], [.65, "#b8643c"], [1, "#6a321c"]]) + lin(u + "-lf", [[0, "#8fcf8a"], [1, "#3f8a4c"]], 1) + lin(u + "-lfd", [[0, "#c6c27a"], [1, "#7f8a46"]], 1)); }),

    ic("air", "Air monitor", WH, (o) => { const u = o.uid, rc = o.on ? H().mix(C.a, C.r, o.level) : C.g, aq = o.on ? String(Math.round(60 + 190 * o.level)) : "12";
      let pts = ""; if (o.on) for (let i = 0; i < 12; i++) { const x = 66 + (i * 37) % 70, y = 26 + (i * 23) % 30; pts += `<circle class="${P}rise" style="animation-delay:${n1(-(i * .41) % 3)}s" cx="${x}" cy="${y}" r="${i % 3 ? 1.2 : 1.8}" fill="#c9c2a8" fill-opacity=".8"/>`; }
      return svg(o, `<g class="hda-bg"><g mask="url(#${u}-fade)"><path d="M0 164H200V200H0Z" fill="url(#${u}-wood)" opacity=".75"/><path d="M0 164H200V200H0Z" fill="url(#${u}-grain)"/><path d="M0 164H200" stroke="#fff" stroke-opacity=".25"/></g></g>` +
      (o.on ? `<ellipse cx="100" cy="166" rx="66" ry="10" fill="url(#${u}-hx)"/>` : "") + sh(o, 100, 166, 40, 5) +
      `<path d="${band(64, 136, 60, 158, 10)}" fill="url(#${u}-c)"/>` +
      `<path d="${band(64, 136, 140, 146, 10)}" fill="${rc}" fill-opacity="${o.on ? 1 : .55}"${o.on ? ` class="${P}pulse"` : ""}/><path d="M64 140A36 10 0 0 0 136 140" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>` +
      (o.on ? `<ellipse cx="100" cy="148" rx="52" ry="18" fill="url(#${u}-hx)" opacity=".7"/>` : "") +
      `<ellipse cx="100" cy="60" rx="36" ry="10" fill="url(#${u}-tp)"/><ellipse cx="100" cy="60" rx="30" ry="7.6" fill="url(#${u}-dk)"/><ellipse cx="100" cy="60" rx="30" ry="7.6" fill="url(#${u}-mesh)"/>` +
      `<path d="${rr(82, 90, 36, 20, 5)}" fill="url(#${u}-dk)"/>` + seg7(aq.padStart(3, " "), 87, 94, 11, rc, H().rgba(rc, .1)) +
      hl(70, 70, 70, 152, 3, .32) + pts,
      halo(u + "-hx", rc, .6)); }),

    ic("freezer", "Freezer probe", WH, (o) => { const u = o.uid, t = o.on ? Math.round(10 + 25 * o.level) : -2, ink = o.on ? "#2a0d08" : "#16202a";
      return svg(o, sh(o, 100, 196, 76, 4) +
      `<path d="${rr(28, 4, 144, 190, 10)}" fill="url(#${u}-st)"/><path d="${rr(28, 4, 144, 190, 10)}" fill="url(#${u}-fx)"/><path d="M28 98H172" stroke="#1d2026" stroke-width="2"/><path d="M28 100H172" stroke="#fff" stroke-opacity=".25"/>` +
      [[30, 56], [110, 70]].map((h) => `<path d="M156 ${h[0]}V${h[0] + h[1]}" stroke="#000" stroke-opacity=".35" stroke-width="10" stroke-linecap="round" transform="translate(1.5 2)"/><path d="M156 ${h[0]}V${h[0] + h[1]}" stroke="url(#${u}-cr)" stroke-width="8" stroke-linecap="round"/>`).join("") +
      (o.on ? [50, 82, 120].map((x, i) => drop(x, 100, .8, P + "drip", n1(-i * .5))).join("") : `<path d="M44 96l2 -4l2 4l-2 4zM96 96l1.6 -3l1.6 3l-1.6 3zM128 97l1.4 -3l1.4 3l-1.4 3z" fill="#e8f6ff" fill-opacity=".8"/>`) +
      `<path d="M86 78C86 90 60 92 28 93" fill="none" stroke="#f2f3f5" stroke-width="2.4"/>` +
      `<path d="${rr(54, 32, 72, 48, 10)}" fill="#000" fill-opacity=".28"/>` + rpart(o, 52, 28, 72, 48, 10) +
      `<path d="${rr(59, 34, 58, 32, 5)}" fill="url(#${u}-dk)"/><path d="${rr(61, 36, 54, 28, 4)}" fill="${o.on ? `url(#${u}-lcdf)` : "#9fb0bd"}"${o.on ? ` class="${P}pulse"` : ""}/>` +
      seg7(String(t).padStart(2, " "), 72, 41, 18, ink, "rgba(0,0,0,.07)") +
      `<circle cx="103" cy="43" r="1.8" fill="none" stroke="${ink}" stroke-width="1.1"/><text x="106" y="50" font-family="Arial,sans-serif" font-size="7" font-weight="700" fill="${ink}">F</text>` +
      (o.on ? `<path class="${P}blink" d="M108 54L113 62H103Z" fill="${ink}"/>` : `<path d="M108 53V63M103.6 55.5L112.4 60.5M103.6 60.5L112.4 55.5" stroke="${ink}" stroke-width="1"/>`) +
      `<path d="${rr(61, 36, 54, 10, 4)}" fill="#fff" fill-opacity=".14"/>` + led(o, 70, 71, 1.2, "r", o.on),
      lin(u + "-lcdf", [[0, "#ffb2a0"], [1, "#ff5a48"]], 1)); }),

    ic("button", "Scene button", WH, (o) => { const u = o.uid, d = o.on ? 3 : 0, p = pal(o.color);
      return svg(o, `<g class="hda-bg"><g mask="url(#${u}-fade)"><path d="M0 112H200V200H0Z" fill="url(#${u}-wood)" opacity=".7"/><path d="M0 112H200V200H0Z" fill="url(#${u}-grain)"/><path d="M0 112H200" stroke="#fff" stroke-opacity=".2"/></g></g>` +
      (o.on ? rings(o, 100, 134, 96, 34, C.c, 3, 1.6) : "") + sh(o, 100, 142, 64, 16) +
      `<path d="${band(48, 152, 112, 132, 22)}" fill="url(#${u}-c)"/><path d="M48 132A52 22 0 0 0 152 132" fill="none" stroke="#000" stroke-opacity=".3"/>` +
      (o.on ? `<ellipse cx="100" cy="${112 + d}" rx="53" ry="23" fill="none" stroke="${C.c}" stroke-width="2.6"/><ellipse cx="100" cy="${118 + d}" rx="64" ry="30" fill="url(#${u}-hc)" opacity=".55"/>` : `<ellipse cx="100" cy="112" rx="52.5" ry="22.5" fill="none" stroke="${p.k}" stroke-width="1.6"/>`) +
      `<ellipse cx="100" cy="${112 + d}" rx="50" ry="20.6" fill="url(#${u}-s)"/><ellipse cx="100" cy="${112 + d}" rx="50" ry="20.6" fill="${o.on ? "#000" : "#fff"}" fill-opacity="${o.on ? .08 : .06}"/>` +
      `<ellipse cx="100" cy="${112 + d}" rx="13" ry="5.4" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.4"/><ellipse cx="100" cy="${112 + d}" rx="3" ry="1.3" fill="#000" fill-opacity=".25"/>` +
      `<path d="M62 ${106 + d}Q76 ${96 + d} 98 ${95 + d}" fill="none" stroke="#fff" stroke-opacity="${o.on ? .4 : .75}" stroke-width="2.2" stroke-linecap="round"/>`); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "sensor", tab: "Sensors", group: "More", kind: "device",
    intro: "Twenty sensors, each drawn where it lives. On means triggered: motion seen, door or window open, water, smoke, a hot or cold reading, a button pressed; off means idle and all clear. The slider sets how strong the event is (beams, puddle size, smoke, the reading on the display).",
    
    css, icons,
  });
})();
