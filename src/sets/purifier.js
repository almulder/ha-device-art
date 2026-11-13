(function () {
  const P = "hda-purifier-";
  const H = () => window.HDAH;
  const W = "#eef0ef", CH = "#3d4148", SG = "#a7b79c", SD = "#dac9a9", BL = "#e8c5c0";
  const SW = [W, CH, SG, SD, BL];
  const sw = (first) => [first].concat(SW.filter((c) => c !== first));
  const GREEN = "#34d399", AIRC = "#d6f3ff";
  const n1 = (v) => (+v).toFixed(1);

  function pal(c) { const h = H(); return { l: h.shade(c, .55), m: c, d: h.shade(c, -.26), k: h.shade(c, -.5), e: h.shade(c, -.42) }; }

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".3" stop-color="${p.l}"/><stop offset=".62" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" x2="1"><stop offset="0" stop-color="${p.m}"/><stop offset=".45" stop-color="${p.l}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-sd" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<radialGradient id="${u}-s" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></radialGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-edge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
<linearGradient id="${u}-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121419"/><stop offset="1" stop-color="#2f343c"/></linearGradient>
<linearGradient id="${u}-dc" x1="0" x2="1"><stop offset="0" stop-color="#101216"/><stop offset=".35" stop-color="#3c414a"/><stop offset="1" stop-color="#0d0f13"/></linearGradient>
<linearGradient id="${u}-pw" x1="0" x2="1"><stop offset="0" stop-color="#9aa0a7"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".62" stop-color="#e3e6ea"/><stop offset="1" stop-color="#868c93"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-wood" x1="0" x2="1"><stop offset="0" stop-color="#6e4a2c"/><stop offset=".4" stop-color="#c8996a"/><stop offset=".7" stop-color="#a87a4e"/><stop offset="1" stop-color="#6a4528"/></linearGradient>
<linearGradient id="${u}-wv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7ab7c"/><stop offset="1" stop-color="#8f6240"/></linearGradient>
<linearGradient id="${u}-lf" x1="0" x2="1"><stop offset="0" stop-color="#2f7a3f"/><stop offset=".5" stop-color="#8fcf8a"/><stop offset="1" stop-color="#2a6b38"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-halo"><stop offset="0" stop-color="${GREEN}" stop-opacity=".75"/><stop offset=".45" stop-color="${GREEN}" stop-opacity=".24"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-col" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9fe3ff" stop-opacity=".3"/><stop offset="1" stop-color="#9fe3ff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfefff" stop-opacity=".28"/><stop offset=".45" stop-color="#cfefff" stop-opacity=".05"/><stop offset="1" stop-color="#cfefff" stop-opacity=".14"/></linearGradient>
<pattern id="${u}-mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.9" cy="2.9" r="1.15" fill="#fff" fill-opacity=".14"/><circle cx="2.5" cy="2.5" r="1.15" fill="#000" fill-opacity=".42"/></pattern>
<pattern id="${u}-slot" width="6" height="5" patternUnits="userSpaceOnUse"><rect y=".5" width="6" height="2" fill="#fff" fill-opacity=".12"/><rect width="6" height="2" fill="#000" fill-opacity=".45"/></pattern>
<pattern id="${u}-vs" width="5" height="6" patternUnits="userSpaceOnUse"><rect x=".5" width="2" height="6" fill="#fff" fill-opacity=".12"/><rect width="2" height="6" fill="#000" fill-opacity=".45"/></pattern>
<pattern id="${u}-fab" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0L3 3M3 0L0 3" stroke="#000" stroke-opacity=".16" stroke-width=".6"/><path d="M0 1.5H3" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/></pattern>
<pattern id="${u}-pl" width="8" height="10" patternUnits="userSpaceOnUse"><rect width="4" height="10" fill="#fbfbf4"/><rect x="4" width="4" height="10" fill="#c3c7bd"/><rect x="3.6" width=".8" height="10" fill="#fff"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const cylP = (x1, x2, yt, yb, ry) => `M${x1} ${yt}V${yb}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${yb}V${yt}Z`;
  const band = (x1, x2, y1, y2, ry) => { const rx = (x2 - x1) / 2; return `M${x1} ${y1}V${y2}A${rx} ${ry} 0 0 0 ${x2} ${y2}V${y1}A${rx} ${ry} 0 0 1 ${x1} ${y1}Z`; };
  const arcF = (x1, x2, y, ry) => `M${x1} ${y}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${y}`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (x, y1, y2, w, op) => `<path d="M${x} ${y1}V${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 3}" stroke-linecap="round"/>`;
  const seam = (x1, x2, y, ry) => `<path d="${arcF(x1, x2, y, ry)}" fill="none" stroke="#000" stroke-opacity=".24" stroke-width="1.1"/><path d="${arcF(x1, x2, y + 1.4, ry)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>`;
  const mesh = (o, d, kind) => `<path d="${d}" fill="#000" fill-opacity=".1"/><path d="${d}" fill="url(#${o.uid}-${kind || "mesh"})"/><path d="${d}" fill="url(#${o.uid}-edge)"/>`;
  function grille(o, cx, cy, rx, ry, n) {
    n = n || 18; let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${o.uid}-dk)"/>`;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, c = Math.cos(a), si = Math.sin(a);
      s += `<line x1="${n1(cx + c * rx * .28)}" y1="${n1(cy + si * ry * .28)}" x2="${n1(cx + c * rx * .92)}" y2="${n1(cy + si * ry * .92)}" stroke="#636a75" stroke-width=".8" stroke-opacity=".75"/>`; }
    return s + `<ellipse cx="${cx}" cy="${cy}" rx="${n1(rx * .24)}" ry="${n1(ry * .24)}" fill="#2a2e35" stroke="#7a818c" stroke-width=".5"/>`;
  }
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);
  function ring(o, cx, cy, rx, ry, w) {
    w = w || 2.2;
    if (!o.on) return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#596069" stroke-opacity=".6" stroke-width="${w}"/>`;
    const k = (.55 + .45 * o.level).toFixed(2);
    return `<g opacity="${k}"><ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${rx + 12}" ry="${n1(ry + 5 + 10 * ry / rx)}" fill="url(#${o.uid}-halo)"/></g>
<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${GREEN}" stroke-width="${w}" opacity="${k}"/>
<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e4fff3" stroke-width="${n1(w * .35)}"/>`;
  }
  function led(o, x, y, r) {
    r = r || 2;
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#4b5058"/>`;
    return `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 5}" fill="url(#${o.uid}-halo)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${GREEN}"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${n1(r * .4)}" fill="#eafff5"/>`;
  }
  function gbar(o, x, y, w, h) {
    const r = Math.min(w, h) / 2;
    if (!o.on) return `<path d="${rr(x, y, w, h, r)}" fill="#4a4f57"/>`;
    const k = (.55 + .45 * o.level).toFixed(2);
    return `<g opacity="${(.18 * k).toFixed(2)}"><path class="${P}pulse" d="${rr(x - 6, y - 6, w + 12, h + 12, r + 6)}" fill="${GREEN}"/></g><path d="${rr(x, y, w, h, r)}" fill="${GREEN}" opacity="${k}"/><path d="${rr(x + w * .1, y + h * .3, w * .8, h * .4, Math.min(w * .8, h * .4) / 2)}" fill="#e8fff4" opacity=".8"/>`;
  }
  function air(o, x, y, a) {
    if (!o.on) return ""; a = a || {};
    const n = a.n || 5, w = a.w || 50, h = a.h || 40, d = +dur(o, 3.2, 2.2), lv = o.level;
    let s = `<g transform="translate(${x} ${y})${a.rot ? ` rotate(${a.rot})` : ""}"><path d="M${-w / 2} 0L${w / 2} 0L${w / 2 + 8} ${-h}L${-w / 2 - 8} ${-h}Z" fill="url(#${o.uid}-col)" opacity="${((.4 + .6 * lv) * (a.col == null ? 1 : a.col)).toFixed(2)}"/>`;
    for (let i = 0; i < n; i++) {
      const xi = -w / 2 + w * (i + .5) / n, xe = xi * 1.25, sg = i % 2 ? 1 : -1;
      const del = ((i * .37 * d) % d).toFixed(2);
      const pd = `d="M${n1(xi)} -2C${n1(xi - 5 * sg)} ${n1(-h * .35)} ${n1(xe + 5 * sg)} ${n1(-h * .65)} ${n1(xe)} ${n1(-h + 4)}" fill="none" stroke-linecap="round" stroke-dasharray="${n1(h * .45)} ${n1(h * .2)}"`;
      s += `<g class="${P}fl" style="animation-duration:${d}s;animation-delay:-${del}s"><path ${pd} stroke="#2f86c0" stroke-opacity=".35" stroke-width="3.2"/><path ${pd} stroke="${AIRC}" stroke-width="1.6"/></g>`;
    }
    return s + `</g>`;
  }
  function dust(o, x, y, rot) {
    if (!o.on) return ""; const d = dur(o, 3.4, 2);
    const pts = [[-24, -8, 1.2], [-14, 5, 1], [-30, 9, 1.4], [-10, -14, .9], [-20, 1, 1.1], [-34, -3, .8]];
    return `<g transform="translate(${x} ${y})${rot ? ` rotate(${rot})` : ""}">` + pts.map((p, i) => `<circle class="${P}dust" cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#efe3cf" style="animation-duration:${d}s;animation-delay:-${(i * .53 % d).toFixed(2)}s"/>`).join("") + `</g>`;
  }
  function waves(o, cx, cy, rx, ry) {
    if (!o.on) return ""; const d = +dur(o, 3.2, 2);
    let s = ""; for (let i = 0; i < 3; i++) s += `<ellipse class="${P}wave" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${AIRC}" stroke-width="1.6" style="animation-duration:${d}s;animation-delay:-${(i * d / 3).toFixed(2)}s"/>`;
    return s;
  }
  const disp = (o, x, y, txt, size) => o.on ? `<text x="${x}" y="${y}" text-anchor="middle" font-family="Segoe UI,Roboto,Arial,sans-serif" font-weight="600" font-size="${size || 10}" fill="${GREEN}">${txt}</text>` : "";

  const css = `
.hda-purifier-fl{opacity:.6}
.hda-anim .hda-purifier-fl{animation:hda-purifier-rise 2s linear infinite}
@keyframes hda-purifier-rise{0%{transform:translateY(9px);opacity:0}35%{opacity:.9}100%{transform:translateY(-9px);opacity:0}}
.hda-anim .hda-purifier-pulse{animation:hda-purifier-pulse 3.2s ease-in-out infinite}
@keyframes hda-purifier-pulse{50%{opacity:.5}}
.hda-purifier-dust{opacity:.55}
.hda-anim .hda-purifier-dust{animation:hda-purifier-dust 2.4s linear infinite}
@keyframes hda-purifier-dust{0%{transform:translateX(-4px);opacity:0}30%{opacity:.9}100%{transform:translateX(16px);opacity:0}}
.hda-purifier-wave{opacity:.45;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-purifier-wave{animation:hda-purifier-wave 2s ease-out infinite}
@keyframes hda-purifier-wave{0%{transform:scale(.35);opacity:0}30%{opacity:.85}100%{transform:scale(1.3);opacity:0}}
.hda-purifier-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-purifier-spin{animation:hda-purifier-spin 1s linear infinite}
@keyframes hda-purifier-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-purifier-scan{animation:hda-purifier-scan 2.6s ease-in-out infinite}
@keyframes hda-purifier-scan{0%{transform:translateY(0);opacity:0}20%{opacity:1}80%{opacity:1}100%{transform:translateY(-100px);opacity:0}}
.hda-purifier-scan{opacity:0}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-purifier-fl,.hda-anim .hda-purifier-pulse,.hda-anim .hda-purifier-dust,.hda-anim .hda-purifier-wave,.hda-anim .hda-purifier-spin,.hda-anim .hda-purifier-scan{animation:none!important}}
`;

  const ic = (id, name, first, render) => ({ id, name, colors: sw(first), picker: true, colorLabel: "Body", render });

  const icons = [
    ic("cylinder", "Mesh cylinder", W, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 182, 56, 7) +
      `<path d="${cylP(62, 138, 46, 178, 8)}" fill="url(#${u}-c)"/>` +
      mesh(o, band(62, 138, 94, 176, 8)) + seam(62, 138, 94, 8) + seam(62, 138, 172, 8) +
      `<path d="${band(62, 138, 46, 92, 8)}" fill="url(#${u}-g)" opacity=".45"/>` + hl(71, 54, 170, 3, .3) +
      `<ellipse cx="100" cy="46" rx="38" ry="8" fill="url(#${u}-tp)" stroke="${pal(o.color).e}" stroke-width=".6"/>` +
      grille(o, 100, 46, 30, 6) + ring(o, 100, 46, 33.5, 6.9, 1.8) +
      `<path d="${rr(89, 62, 22, 10, 5)}" fill="#000" fill-opacity=".2"/>` + led(o, 100, 67, 1.8) +
      air(o, 100, 42, { w: 52, h: 34 })); }),

    ic("sleeve", "Fabric sleeve", SG, (o) => { const u = o.uid, p = pal(o.color); return svg(o,
      sh(o, 100, 183, 52, 7) +
      `<path d="${cylP(64, 136, 84, 178, 8)}" fill="url(#${u}-pw)"/>` +
      `<path d="${band(64, 136, 102, 178, 8)}" fill="url(#${u}-c)"/><path d="${band(64, 136, 102, 178, 8)}" fill="url(#${u}-fab)"/><path d="${band(64, 136, 102, 178, 8)}" fill="url(#${u}-edge)"/>` +
      [76, 88, 112, 124].map((x) => `<path d="M${x} 108V181" stroke="#000" stroke-opacity=".07" stroke-width="3"/>`).join("") +
      `<path d="${arcF(64, 136, 103, 8)}" fill="none" stroke="${p.k}" stroke-width="1.6"/><path d="${arcF(66, 134, 107, 7)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".7" stroke-dasharray="2 2"/>` +
      `<path d="M134 92c10 0 12 14 2 16" fill="none" stroke="${p.d}" stroke-width="4" stroke-linecap="round"/>` +
      hl(72, 90, 98, 2.5, .5) + hl(72, 112, 170, 3, .18) +
      `<ellipse cx="100" cy="84" rx="36" ry="7.5" fill="#f4f6f8" stroke="#a7adb4" stroke-width=".6"/>` +
      [27, 21, 15].map((r) => `<ellipse cx="100" cy="84" rx="${r}" ry="${n1(r * .2)}" fill="none" stroke="#9aa1a9" stroke-width="2.2"/>`).join("") +
      `<ellipse cx="100" cy="84" rx="9" ry="2.2" fill="#2a2e35"/>` + ring(o, 100, 84, 9, 2.2, 1.4) +
      air(o, 100, 80, { w: 46, h: 46 })); }),

    ic("loop", "Loop fan", W, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 183, 40, 6) +
      `<path d="${rr(70, 18, 60, 106, 30)} ${rr(82, 32, 36, 80, 18)}" fill="url(#${u}-c)" fill-rule="evenodd"/>` +
      `<path d="${rr(82, 32, 36, 80, 18)}" fill="none" stroke="#1d2027" stroke-opacity=".55" stroke-width="2.6"/>` +
      `<path d="${rr(83.5, 33.5, 33, 77, 16.5)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>` +
      `<path d="M76 46C76 32 86 22 98 21" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>` + hl(75, 50, 108, 2.5, .3) +
      waves(o, 100, 72, 15, 36) +
      `<path d="${cylP(76, 124, 120, 178, 6)}" fill="url(#${u}-c)"/>` + mesh(o, band(76, 124, 132, 176, 6)) + seam(76, 124, 132, 6) +
      `<ellipse cx="100" cy="120" rx="24" ry="5.5" fill="url(#${u}-tp)"/>` + hl(81, 124, 172, 2, .3) +
      led(o, 100, 127, 1.5)); }),

    ic("ringpanel", "Ring panel", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 183, 62, 6) +
      `<path d="${rr(44, 40, 112, 142, 14)}" fill="url(#${u}-v)"/><path d="${rr(44, 40, 112, 142, 14)}" fill="url(#${u}-edge)" opacity=".7"/>` +
      `<path d="${rr(56, 46, 88, 9, 4.5)}" fill="url(#${u}-dk)"/><path d="${rr(56, 46, 88, 9, 4.5)}" fill="url(#${u}-vs)"/>` +
      `<circle cx="100" cy="116" r="46" fill="#000" fill-opacity=".22"/><circle cx="100" cy="116" r="42" fill="url(#${u}-dk)"/><circle cx="100" cy="116" r="42" fill="url(#${u}-mesh)"/>` +
      `<circle cx="100" cy="116" r="42" fill="url(#${u}-g)" opacity=".25"/>` + ring(o, 100, 116, 45, 45, 2.4) +
      `<circle cx="100" cy="116" r="12" fill="#23272e" stroke="#59606a" stroke-width=".8"/>` + disp(o, 100, 120, "AQ", 9) +
      `<path d="M52 44H148" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>` + hl(49, 54, 170, 2, .25) +
      air(o, 100, 40, { w: 80, n: 6, h: 32 })); }),

    ic("woodcube", "Wood cube", W, (o) => { const u = o.uid; let slats = "";
      for (let i = 0; i < 9; i++) slats += `<rect x="${60 + i * 8.6}" y="84" width="6" height="90" rx="1.2" fill="url(#${u}-wood)"/>`;
      return svg(o,
      sh(o, 108, 184, 64, 7) +
      `<path d="M52 74L76 58H162L138 74Z" fill="url(#${u}-tp)"/><path d="M138 74L162 58V166L138 182Z" fill="url(#${u}-sd)"/>` +
      `<path d="M52 74H138V182H52Z" fill="url(#${u}-v)"/>` +
      `<path d="M58 80H132V176H58Z" fill="#17191d"/>` + slats + `<path d="M58 80H132V176H58Z" fill="url(#${u}-edge)" opacity=".5"/>` +
      `<path d="M70 69L82 61H148L136 69Z" fill="url(#${u}-dk)"/><path d="M70 69L82 61H148L136 69Z" fill="url(#${u}-slot)"/>` +
      `<path d="M52 74H138L162 58" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>` +
      led(o, 150, 72, 1.6) +
      air(o, 109, 62, { w: 62, h: 46 })); }),

    ic("wallpanel", "Wall panel", W, (o) => { const u = o.uid; return svg(o,
      `<path d="${rr(42, 40, 128, 112, 12)}" fill="#000" opacity=".18"/><path d="${rr(39, 36, 128, 112, 12)}" fill="#000" opacity=".22"/>` +
      `<path d="M100 150C100 166 92 172 96 192" fill="none" stroke="#2b2f36" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="${rr(36, 34, 128, 112, 11)}" fill="url(#${u}-sd)"/><path d="${rr(36, 30, 128, 112, 11)}" fill="url(#${u}-v)"/>` +
      `<path d="${rr(48, 44, 104, 72, 7)}" fill="#000" fill-opacity=".1"/><path d="${rr(48, 44, 104, 72, 7)}" fill="url(#${u}-fab)"/>` +
      `<path d="${rr(48, 44, 104, 72, 7)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<path d="${rr(42, 32, 116, 4, 2)}" fill="url(#${u}-dk)"/><path d="${rr(42, 32, 116, 4, 2)}" fill="url(#${u}-vs)"/>` +
      gbar(o, 56, 128, 64, 3) + `<circle cx="140" cy="129.5" r="5" fill="#000" fill-opacity=".2"/>` + led(o, 140, 129.5, 1.6) +
      `<path d="M44 31H156" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>` +
      air(o, 100, 28, { w: 104, n: 7, h: 22 }) + dust(o, 80, 168, -90) + dust(o, 124, 170, -90)); }),

    ic("room", "Room HEPA", W, (o) => { const u = o.uid; return svg(o,
      sh(o, 104, 184, 66, 6) +
      `<path d="M46 34L70 24H158L134 34Z" fill="url(#${u}-tp)"/><path d="M134 34L158 24V168L134 178Z" fill="url(#${u}-sd)"/>` +
      `<path d="M139 42L153 36V158L139 166Z" fill="url(#${u}-vs)"/>` +
      `<path d="M58 31L72 26H146L132 31Z" fill="url(#${u}-dk)"/><path d="M58 31L72 26H146L132 31Z" fill="url(#${u}-slot)"/>` +
      `<path d="M46 34H134V178H46Z" fill="url(#${u}-v)"/>` +
      `<path d="${rr(54, 42, 72, 20, 5)}" fill="#14171c"/><path d="${rr(54, 42, 72, 20, 5)}" fill="url(#${u}-gl)"/>` + disp(o, 72, 56, "PM 6", 9) + led(o, 112, 52, 1.6) +
      [72, 88, 104, 120, 136, 152, 166].map((y) => `<path d="M52 ${y}H128" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/><path d="M52 ${y + 1.2}H128" stroke="#fff" stroke-opacity=".18" stroke-width=".7"/>`).join("") +
      `<path d="M46 34H134L158 24" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>` + hl(50, 70, 170, 2, .25) +
      [[56, 182], [124, 182], [150, 172]].map((c) => `<rect x="${c[0] - 5}" y="${c[1] - 5}" width="10" height="7" rx="3" fill="#1a1c21"/><circle cx="${c[0]}" cy="${c[1]}" r="3" fill="#2c3037"/>`).join("") +
      air(o, 102, 28, { w: 74, n: 6, h: 22 })); }),

    ic("desk", "Desk round", BL, (o) => { const u = o.uid, d = "M50 124Q50 98 100 98Q150 98 150 124V158Q150 180 100 180Q50 180 50 158Z"; return svg(o,
      `<path d="M10 176H190" stroke="#c8996a" stroke-opacity=".35" stroke-width="1"/>` + sh(o, 100, 180, 58, 6) +
      `<path d="${d}" fill="url(#${u}-c)"/>` +
      `<path d="M54 128Q100 140 146 128V156Q146 174 100 176Q54 174 54 156Z" fill="url(#${u}-mesh)"/><path d="${d}" fill="url(#${u}-edge)"/>` +
      `<path d="M50 124Q100 138 150 124" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1"/>` +
      `<path d="M50 124Q50 98 100 98Q150 98 150 124Q100 138 50 124Z" fill="url(#${u}-tp)"/>` +
      grille(o, 100, 112, 30, 7, 20) + ring(o, 100, 112, 33, 7.8, 1.6) +
      (o.on ? `<g opacity="${(.5 + .5 * o.level).toFixed(2)}"><path d="M56 160Q100 172 144 160" fill="none" stroke="${GREEN}" stroke-width="2" class="${P}pulse"/></g>` : `<path d="M56 160Q100 172 144 160" fill="none" stroke="#596069" stroke-width="2"/>`) +
      `<path d="M58 108Q66 100 90 99" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      air(o, 100, 106, { w: 50, h: 52 })); }),

    ic("planter", "Planter top", SD, (o) => { const u = o.uid; const blade = (x0, xt, yt, w) => `<path d="M${x0 - w} 104Q${x0 - w - 2} ${(104 + yt) / 2} ${xt} ${yt}Q${x0 + w + 2} ${(104 + yt) / 2} ${x0 + w} 104Z" fill="url(#${u}-lf)"/><path d="M${x0} 102Q${x0} ${(104 + yt) / 2} ${xt} ${yt + 4}" stroke="#d9efb0" stroke-opacity=".45" stroke-width=".8" fill="none"/>`;
      return svg(o,
      sh(o, 100, 183, 54, 7) +
      `<path d="${cylP(64, 136, 104, 178, 8)}" fill="url(#${u}-c)"/>` + mesh(o, band(64, 136, 116, 176, 8)) + seam(64, 136, 116, 8) + hl(72, 120, 170, 3, .25) +
      `<path d="${band(64, 136, 96, 110, 8)}" fill="url(#${u}-wood)"/>` +
      `<ellipse cx="100" cy="96" rx="36" ry="7.5" fill="url(#${u}-wv)"/><ellipse cx="100" cy="96" rx="30" ry="5.5" fill="#3a2416"/><ellipse cx="100" cy="95" rx="27" ry="4" fill="#6a4630"/>` +
      blade(88, 80, 40, 4) + blade(100, 104, 26, 5) + blade(110, 122, 46, 4) + blade(94, 70, 62, 3.5) + blade(106, 132, 64, 3.5) +
      `<ellipse cx="100" cy="104" rx="1" ry="1" fill="none"/>` +
      led(o, 100, 124, 1.6) +
      air(o, 70, 98, { w: 10, n: 2, h: 40 }) + air(o, 130, 98, { w: 10, n: 2, h: 40 })); }),

    ic("sidetable", "Side table", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 184, 60, 7) +
      `<path d="${cylP(58, 142, 74, 178, 9)}" fill="url(#${u}-c)"/>` + mesh(o, band(58, 142, 82, 172, 9)) + seam(58, 142, 172, 9) + hl(68, 88, 168, 3, .2) +
      `<ellipse cx="100" cy="76" rx="42" ry="9" fill="#0f1114"/>` +
      `<path d="M42 64V70A58 12 0 0 0 158 70V64Z" fill="url(#${u}-wood)"/>` +
      `<ellipse cx="100" cy="64" rx="58" ry="12" fill="url(#${u}-wv)"/><ellipse cx="100" cy="64" rx="58" ry="12" fill="url(#${u}-g)" opacity=".4"/>` +
      `<path d="M50 62Q80 56 110 58" stroke="#6e4a2c" stroke-opacity=".3" stroke-width=".8" fill="none"/><path d="M70 69Q100 66 140 64" stroke="#6e4a2c" stroke-opacity=".3" stroke-width=".8" fill="none"/>` +
      `<ellipse cx="128" cy="62" rx="12" ry="3" fill="#000" opacity=".25"/><path d="${cylP(118, 136, 44, 60, 3)}" fill="url(#${u}-pw)"/><ellipse cx="127" cy="44" rx="9" ry="2.6" fill="#5a3a22"/><path d="M136 48c6 0 6 9 0 9" fill="none" stroke="#d8dce0" stroke-width="2"/>` +
      `<rect x="66" y="54" width="34" height="5" rx="1" fill="#8a3b3b"/><rect x="70" y="49" width="28" height="5" rx="1" fill="#3b5e8a"/>` +
      led(o, 100, 90, 1.6) +
      air(o, 50, 76, { rot: -78, w: 10, n: 2, h: 32 }) + air(o, 150, 76, { rot: 78, w: 10, n: 2, h: 32 })); }),

    ic("carmini", "Car mini", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 102, 176, 34, 5) +
      `<path d="M116 168C130 178 150 170 160 182" fill="none" stroke="#24272d" stroke-width="3" stroke-linecap="round"/><rect x="158" y="178" width="14" height="8" rx="1.5" fill="url(#${u}-st)"/>` +
      `<path d="M78 66L84 168A16 4 0 0 0 116 168L122 66Z" fill="url(#${u}-c)"/>` +
      `<path d="M81 120L84 168A16 4 0 0 0 116 168L119 120A19 4.5 0 0 1 81 120Z" fill="url(#${u}-mesh)"/>` + seam(81, 119, 120, 4.5) +
      `<path d="M78 66L84 168A16 4 0 0 0 116 168L122 66Z" fill="url(#${u}-edge)"/>` + hl(86, 74, 160, 2.5, .35) +
      `<ellipse cx="100" cy="66" rx="22" ry="5" fill="url(#${u}-tp)"/>` + grille(o, 100, 66, 17, 3.8, 14) + ring(o, 100, 66, 19.5, 4.4, 1.4) +
      `<circle cx="100" cy="92" r="4" fill="#000" fill-opacity=".25"/>` + led(o, 100, 92, 1.4) +
      air(o, 100, 62, { w: 30, n: 4, h: 50 })); }),

    ic("lightbar", "Light bar", W, (o) => { const u = o.uid; let segs = "";
      for (let i = 0; i < 5; i++) segs += gbar(o, 70 + i * 12, 54, 9, 5);
      return svg(o,
      sh(o, 104, 184, 52, 6) +
      `<path d="M60 40L70 32H150L140 40Z" fill="url(#${u}-tp)"/><path d="M140 40L150 32V174L140 182Z" fill="url(#${u}-sd)"/>` +
      `<path d="M70 38L76 34H142L136 38Z" fill="url(#${u}-dk)"/><path d="M70 38L76 34H142L136 38Z" fill="url(#${u}-slot)"/>` +
      `<path d="M60 40H140V182H60Z" fill="url(#${u}-v)"/>` +
      `<path d="${rr(66, 48, 68, 17, 4)}" fill="#15181d"/>` + segs +
      `<path d="${rr(68, 76, 64, 98, 6)}" fill="#000" fill-opacity=".1"/><path d="${rr(68, 76, 64, 98, 6)}" fill="url(#${u}-slot)"/>` +
      `<path d="M60 40H140L150 32" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>` + hl(63, 48, 176, 2, .3) +
      air(o, 105, 34, { w: 64, n: 5, h: 28 })); }),

    ic("pet", "Pet hair", SD, (o) => { const u = o.uid; let fib = "";
      [[66, 120], [82, 150], [104, 132], [124, 156], [114, 112], [74, 162], [134, 128]].forEach((f, i) => { fib += `<path d="M${f[0]} ${f[1]}q4 -3 8 0t8 0" fill="none" stroke="#e2cfae" stroke-opacity=".75" stroke-width="${i % 2 ? .9 : 1.2}"/>`; });
      const paw = o.on ? GREEN : "#596069";
      return svg(o,
      sh(o, 100, 183, 64, 7) +
      `<path d="${rr(42, 54, 116, 126, 22)}" fill="url(#${u}-c)"/><path d="${rr(42, 54, 116, 126, 22)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<path d="${rr(58, 58, 84, 6, 3)}" fill="url(#${u}-dk)"/><path d="${rr(58, 58, 84, 6, 3)}" fill="url(#${u}-vs)"/>` +
      `<path d="${rr(56, 98, 88, 74, 16)}" fill="#000" fill-opacity=".25"/><path d="${rr(58, 100, 84, 70, 14)}" fill="url(#${u}-dk)"/>` +
      [70, 80, 90, 100, 110, 120, 130].map((x) => `<rect x="${x - 2}" y="102" width="4" height="66" rx="2" fill="url(#${u}-c)" opacity=".85"/>`).join("") + fib +
      (o.on ? `<circle class="${P}pulse" cx="100" cy="80" r="14" fill="url(#${u}-halo)"/>` : "") +
      `<ellipse cx="100" cy="84" rx="5" ry="4" fill="${paw}"/>` + [[92, 77], [97, 74], [103, 74], [108, 77]].map((c) => `<circle cx="${c[0]}" cy="${c[1]}" r="1.8" fill="${paw}"/>`).join("") +
      hl(48, 78, 160, 2.5, .3) +
      dust(o, 40, 134, 0) + dust(o, 160, 134, 180) +
      air(o, 100, 54, { w: 70, n: 5, h: 42 })); }),

    ic("egg", "Egg dome", W, (o) => { const u = o.uid, d = "M100 32C138 32 150 98 150 126C150 162 128 176 100 176C72 176 50 162 50 126C50 98 62 32 100 32Z";
      return svg(o,
      sh(o, 100, 183, 50, 6) +
      `<ellipse cx="100" cy="176" rx="40" ry="8" fill="url(#${u}-dc)"/>` + ring(o, 100, 176, 38, 7.4, 1.6) +
      `<path d="${d}" fill="url(#${u}-s)"/>` +
      `<g clip-path="url(#${u}-cp)"><rect x="40" y="118" width="120" height="60" fill="url(#${u}-mesh)"/><rect x="40" y="118" width="120" height="60" fill="url(#${u}-edge)" opacity=".6"/></g>` +
      `<path d="M50.5 118Q100 132 149.5 118" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/>` +
      `<path d="M66 70C70 50 82 40 96 38" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="40" rx="15" ry="4" fill="url(#${u}-dk)"/>` + [-8, -3, 2, 7].map((x) => `<path d="M${100 + x} 37.5V42.5" stroke="#5c636e" stroke-width=".9"/>`).join("") +
      led(o, 100, 96, 1.7) +
      air(o, 100, 36, { w: 28, n: 4, h: 30 }), `<clipPath id="${u}-cp"><path d="${d}"/></clipPath>`); }),

    ic("display", "Display tower", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 184, 40, 5) +
      `<ellipse cx="100" cy="180" rx="32" ry="5" fill="url(#${u}-dc)"/>` +
      `<path d="${rr(72, 34, 56, 146, 20)}" fill="url(#${u}-c)"/>` +
      `<path d="${rr(82, 48, 36, 32, 7)}" fill="#0f1115"/><path d="${rr(82, 48, 36, 32, 7)}" fill="url(#${u}-gl)"/>` +
      disp(o, 100, 69, "12", 15) + (o.on ? `<text x="100" y="76.5" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="5" fill="#9fe3c6">PM2.5</text>` : "") +
      led(o, 112, 53, 1.3) +
      [90, 100, 110].map((x) => `<circle cx="${x}" cy="90" r="2.4" fill="#000" fill-opacity=".25"/><circle cx="${x}" cy="89.6" r="1.2" fill="#fff" fill-opacity="${o.on ? .55 : .2}"/>`).join("") +
      `<path d="${rr(80, 100, 40, 70, 8)}" fill="#000" fill-opacity=".12"/><path d="${rr(80, 100, 40, 70, 8)}" fill="url(#${u}-vs)"/>` +
      `<path d="M80 50C80 42 86 37 94 36" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>` + hl(78, 60, 168, 2.5, .25) +
      air(o, 100, 32, { w: 32, n: 4, h: 26 })); }),

    ic("retro", "Retro fabric", SD, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 186, 66, 5) +
      `<path d="M50 156L42 186M150 156L158 186M66 156L62 182M134 156L138 182" stroke="url(#${u}-wv)" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="${rr(38, 62, 124, 98, 12)}" fill="url(#${u}-v)"/><path d="${rr(38, 62, 124, 98, 12)}" fill="url(#${u}-edge)" opacity=".5"/>` +
      `<path d="${rr(50, 74, 76, 74, 6)}" fill="#8f8371"/><path d="${rr(50, 74, 76, 74, 6)}" fill="url(#${u}-fab)"/><path d="${rr(50, 74, 76, 74, 6)}" fill="url(#${u}-g)" opacity=".2"/>` +
      [88, 111, 134].map((y) => `<rect x="50" y="${y}" width="76" height="2.6" fill="url(#${u}-st)"/>`).join("") +
      `<circle cx="144" cy="96" r="10" fill="#000" fill-opacity=".25"/><circle cx="144" cy="95" r="9" fill="url(#${u}-st)"/><path d="M144 88V93" stroke="#3b4048" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="${rr(136, 116, 16, 10, 3)}" fill="#1a1c21"/>` + led(o, 144, 121, 1.8) +
      `<path d="M50 63H150" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>` +
      `<path d="${rr(60, 66, 80, 4, 2)}" fill="#000" fill-opacity=".28"/>` +
      air(o, 100, 64, { w: 72, n: 6, h: 46 })); }),

    ic("ceiling", "Ceiling disc", W, (o) => { const u = o.uid, sd = dur(o, 1.4, 1.05); return svg(o,
      `<rect x="30" y="6" width="140" height="4" rx="2" fill="#fff" fill-opacity=".07"/>` +
      `<path d="${cylP(90, 110, 10, 16, 3)}" fill="url(#${u}-c)"/><rect x="97" y="16" width="6" height="32" fill="url(#${u}-st)"/>` +
      `<path d="M34 70V60A66 14 0 0 1 166 60V70Z" fill="url(#${u}-c)"/><path d="M36 69V61A64 13 0 0 1 164 61V69Z" fill="url(#${u}-mesh)"/>` +
      `<ellipse cx="100" cy="70" rx="66" ry="14" fill="url(#${u}-v)"/>` +
      `<ellipse cx="100" cy="70" rx="56" ry="11" fill="url(#${u}-dk)"/>` +
      `<g transform="translate(100 70) scale(1 .2)"><g class="${P}spin" style="animation-duration:${sd}s">${[0, 120, 240].map((a) => `<path transform="rotate(${a})" d="M0 -4C18 -14 40 -12 50 -2C40 6 18 6 0 4Z" fill="#9aa1aa" fill-opacity=".55"/>`).join("")}</g></g>` +
      [48, 38, 28].map((r) => `<ellipse cx="100" cy="70" rx="${r}" ry="${n1(r * .2)}" fill="none" stroke="#7b828d" stroke-opacity=".6" stroke-width="1"/>`).join("") +
      `<ellipse cx="100" cy="70" rx="12" ry="2.6" fill="#2a2e35"/>` + ring(o, 100, 70, 16, 3.4, 1.6) +
      `<path d="M44 74Q70 82 104 83" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>` +
      air(o, 100, 88, { rot: 180, w: 96, n: 6, h: 76, col: .3 })); }),

    ic("column", "LED column", SG, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 184, 40, 5) +
      `<path d="${cylP(70, 130, 172, 178, 5)}" fill="url(#${u}-dc)"/><ellipse cx="100" cy="172" rx="30" ry="5" fill="#2d3138"/>` +
      `<path d="${cylP(84, 116, 42, 172, 4)}" fill="url(#${u}-c)"/>` + mesh(o, band(84, 116, 50, 170, 4)) +
      `<ellipse cx="100" cy="42" rx="16" ry="4" fill="url(#${u}-tp)"/>` + grille(o, 100, 42, 12, 2.8, 12) +
      gbar(o, 98.5, 52, 3, 112) +
      (o.on ? `<rect class="${P}scan" x="97.5" y="150" width="5" height="14" rx="2.5" fill="#f0fff8" style="animation-duration:${dur(o, 3.6, 2)}s"/>` : "") +
      hl(89, 50, 166, 2, .3) +
      air(o, 100, 38, { w: 24, n: 3, h: 30 })); }),

    ic("window", "Filter window", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 104, 184, 58, 6) +
      `<path d="M48 40L62 30H156L142 40Z" fill="url(#${u}-tp)"/><path d="M142 40L156 30V172L142 182Z" fill="url(#${u}-sd)"/>` +
      `<path d="M60 37L68 32H146L138 37Z" fill="url(#${u}-dk)"/><path d="M60 37L68 32H146L138 37Z" fill="url(#${u}-slot)"/>` +
      `<path d="M48 40H142V182H48Z" fill="url(#${u}-v)"/>` +
      `<path d="${rr(58, 46, 74, 12, 4)}" fill="#15181d"/>` + led(o, 66, 52, 1.5) + gbar(o, 74, 51, 30, 2.4) + disp(o, 120, 55.5, "Auto", 6.5) +
      `<path d="${rr(58, 66, 74, 106, 8)}" fill="#0e1014"/><path d="${rr(62, 70, 66, 98, 5)}" fill="url(#${u}-pl)"/>` +
      `<rect x="62" y="70" width="66" height="98" fill="url(#${u}-edge)" opacity=".6"/>` + (o.on ? "" : `<rect x="62" y="70" width="66" height="98" fill="#000" opacity=".18"/>`) +
      `<path d="${rr(58, 66, 74, 106, 8)}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>` +
      `<path d="M66 160L100 74" stroke="#fff" stroke-opacity=".18" stroke-width="6"/>` +
      `<path d="M48 40H142L156 30" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>` +
      dust(o, 46, 130, 0) +
      air(o, 103, 34, { w: 70, n: 5, h: 26 })); }),

    ic("cone", "Cone tower", BL, (o) => { const u = o.uid, body = "M80 44L56 176A44 9 0 0 0 144 176L120 44Z"; let ribs = "";
      for (let i = 1; i < 9; i++) { const y = 44 + i * 15, hw = 20 + 24 * (i * 15) / 132; ribs += `<path d="${arcF(100 - hw, 100 + hw, y, 3 + i * .7)}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.2"/><path d="${arcF(100 - hw, 100 + hw, y + 1.3, 3 + i * .7)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".7"/>`; }
      return svg(o,
      sh(o, 100, 184, 60, 7) +
      `<path d="${body}" fill="url(#${u}-c)"/><path d="M68 110L56 176A44 9 0 0 0 144 176L132 110A32 6 0 0 1 68 110Z" fill="url(#${u}-mesh)"/>` +
      ribs + `<path d="${body}" fill="url(#${u}-edge)"/>` +
      `<path d="M83 52L64 168" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="44" rx="20" ry="4.5" fill="url(#${u}-tp)"/>` + grille(o, 100, 44, 15, 3.3, 14) + ring(o, 100, 44, 17.5, 3.9, 1.5) +
      led(o, 100, 74, 1.6) +
      air(o, 100, 40, { w: 30, n: 4, h: 32 })); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "purifier", tab: "Air purifiers", group: "Air", kind: "device",
    intro: "Twenty air purifiers. When on, clean air rises from the top, the air-quality light glows green and dust drifts in; the slider sets the fan speed.",
    
    css, icons,
  });
})();
