(function () {
  const P = "hda-humidifier-";
  const H = () => window.HDAH;
  const W = "#eef0ef", CH = "#3d4148", SG = "#a7b79c", SD = "#dac9a9", BL = "#e8c5c0", SK = "#bcd4e6";
  const SW = [W, CH, SG, SD, BL, SK];
  const sw = (first) => [first].concat(SW.filter((c) => c !== first)).slice(0, 6);
  const NL = ["#ffb36b", "#ffd27a", "#c4b5fd", "#7dd3fc", "#ffc9de", "#a7f3d0"];
  const FL = ["#ff8a3d", "#ffb347", "#ff5e3a", "#7dd3fc", "#c4b5fd"];
  const JAR = ["#9cc8e8", "#a8d8b9", "#e3edf2", "#e8c48a", "#e8b8cc"];
  const CY = "#67e8f9";
  const n1 = (v) => (+v).toFixed(1);
  const FONT = 'font-family="Segoe UI,Roboto,Arial,sans-serif"';

  function pal(c) { const h = H(); return { l: h.shade(c, .55), m: c, d: h.shade(c, -.26), k: h.shade(c, -.5), e: h.shade(c, -.42) }; }

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color), h = H(), c = o.color, cl = h.mix(c, "#ffffff", .55);
    return `<defs>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".3" stop-color="${p.l}"/><stop offset=".62" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" x2="1"><stop offset="0" stop-color="${p.m}"/><stop offset=".45" stop-color="${p.l}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-sd" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<radialGradient id="${u}-s" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></radialGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-edge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".36"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
<linearGradient id="${u}-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11141a"/><stop offset="1" stop-color="#2c313a"/></linearGradient>
<linearGradient id="${u}-pw" x1="0" x2="1"><stop offset="0" stop-color="#a3a8b0"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".62" stop-color="#e6e8ec"/><stop offset="1" stop-color="#8b9098"/></linearGradient>
<linearGradient id="${u}-pwv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e9ebef"/><stop offset="1" stop-color="#b9bdc5"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-wood" x1="0" x2="1"><stop offset="0" stop-color="#6e4a2c"/><stop offset=".35" stop-color="#c8996a"/><stop offset=".7" stop-color="#a87a4e"/><stop offset="1" stop-color="#5e3d22"/></linearGradient>
<pattern id="${u}-grain" width="44" height="7" patternUnits="userSpaceOnUse"><path d="M0 3.5Q11 1.5 22 3.5T44 3.5" fill="none" stroke="#4a2d16" stroke-opacity=".28" stroke-width=".8"/><path d="M0 6Q14 5 26 6.4T44 6" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width=".6"/></pattern>
<pattern id="${u}-fab" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0L3 3M3 0L0 3" stroke="#000" stroke-opacity=".16" stroke-width=".6"/><path d="M0 1.5H3" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/></pattern>
<pattern id="${u}-slot" width="6" height="5" patternUnits="userSpaceOnUse"><rect y=".6" width="6" height="2" fill="#fff" fill-opacity=".1"/><rect width="6" height="2" fill="#000" fill-opacity=".5"/></pattern>
<pattern id="${u}-hc" width="6" height="5.2" patternUnits="userSpaceOnUse"><path d="M0 2.6L1.5 0H4.5L6 2.6L4.5 5.2H1.5Z" fill="none" stroke="#7a5a32" stroke-opacity=".55" stroke-width=".7"/></pattern>
<linearGradient id="${u}-wick" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe1c2"/><stop offset=".55" stop-color="#d8bf8f"/><stop offset="1" stop-color="#8a7a5c"/></linearGradient>
<linearGradient id="${u}-wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe9ff" stop-opacity=".6"/><stop offset=".35" stop-color="#5aa9e6" stop-opacity=".62"/><stop offset="1" stop-color="#22579e" stop-opacity=".85"/></linearGradient>
<linearGradient id="${u}-gls" x1="0" x2="1"><stop offset="0" stop-color="#e8f6ff" stop-opacity=".3"/><stop offset=".22" stop-color="#e8f6ff" stop-opacity=".05"/><stop offset=".7" stop-color="#e8f6ff" stop-opacity=".03"/><stop offset="1" stop-color="#e8f6ff" stop-opacity=".2"/></linearGradient>
<radialGradient id="${u}-jet" cx=".5" cy="1" fx=".5" fy="1" r="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset=".55" stop-color="#ffffff" stop-opacity=".3"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-jetc" cx=".5" cy="1" fx=".5" fy="1" r="1"><stop offset="0" stop-color="${h.mix(c, "#ffffff", .7)}" stop-opacity="1"/><stop offset=".45" stop-color="${h.mix(c, "#ffffff", .2)}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-mp"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".5" stop-color="#e2ebf7" stop-opacity=".45"/><stop offset="1" stop-color="#d4e0f0" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-mpw"><stop offset="0" stop-color="#fffaf3" stop-opacity=".85"/><stop offset=".5" stop-color="#fff1e2" stop-opacity=".4"/><stop offset="1" stop-color="#ffe8d2" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-mpc"><stop offset="0" stop-color="${h.mix(c, "#ffffff", .72)}" stop-opacity="1"/><stop offset=".45" stop-color="${h.mix(c, "#ffffff", .25)}" stop-opacity=".62"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-nl"><stop offset="0" stop-color="${cl}" stop-opacity=".85"/><stop offset=".4" stop-color="${c}" stop-opacity=".38"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-ledh"><stop offset="0" stop-color="${CY}" stop-opacity=".7"/><stop offset=".45" stop-color="${CY}" stop-opacity=".22"/><stop offset="1" stop-color="${CY}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-heat"><stop offset="0" stop-color="#ffe2a8" stop-opacity="1"/><stop offset=".4" stop-color="#ff8a3d" stop-opacity=".75"/><stop offset="1" stop-color="#ff5e3a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-lf" x1="0" x2="1"><stop offset="0" stop-color="#2f7a3f"/><stop offset=".5" stop-color="#8fcf8a"/><stop offset="1" stop-color="#2a6b38"/></linearGradient>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const cylP = (x1, x2, yt, yb, ry) => `M${x1} ${yt}V${yb}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${yb}V${yt}Z`;
  const cylF = (x1, x2, yt, yb, ry) => `M${x1} ${yt}A${(x2 - x1) / 2} ${ry} 0 0 1 ${x2} ${yt}V${yb}A${(x2 - x1) / 2} ${ry} 0 0 1 ${x1} ${yb}Z`;
  const band = (x1, x2, y1, y2, ry) => { const rx = (x2 - x1) / 2; return `M${x1} ${y1}V${y2}A${rx} ${ry} 0 0 0 ${x2} ${y2}V${y1}A${rx} ${ry} 0 0 1 ${x1} ${y1}Z`; };
  const arcF = (x1, x2, y, ry) => `M${x1} ${y}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${y}`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (x, y1, y2, w, op) => `<path d="M${x} ${y1}V${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 3}" stroke-linecap="round"/>`;
  const seam = (x1, x2, y, ry) => `<path d="${arcF(x1, x2, y, ry)}" fill="none" stroke="#000" stroke-opacity=".24" stroke-width="1.1"/><path d="${arcF(x1, x2, y + 1.4, ry)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>`;
  const k1 = (o) => .35 + .65 * o.level;

  function mist(o, x, y, a) {
    if (!o.on) return ""; a = a || {};
    const u = o.uid, lv = o.level, s = a.s || 1, k = k1(o) * (a.k || 1), xs = a.xs || [0], n = a.n || (xs.length > 1 ? 7 : 10);
    const d = a.fast ? 3.4 - 1.5 * lv : 5 - 2.4 * lv, g = a.col === "c" ? "mpc" : a.col === "w" ? "mpw" : "mp", Hh = 44 + 26 * lv, wd = a.wd || 1;
    let out = `<g transform="translate(${x} ${y})${a.rot ? ` rotate(${a.rot})` : ""} scale(${s})"><g${a.flk ? ` class="${P}flk"` : ""}>`;
    xs.forEach((xo, ci) => {
      const jw = (2.6 + 2.6 * lv) * wd, vw = (9 + 9 * lv) * wd, vt = -Hh - 10, sg = ci % 2 ? -1 : 1;
      out += `<g opacity="${n1(k * .32)}"><path class="${P}jet" d="M${xo - 3} 0C${n1(xo - vw * .5)} -14 ${n1(xo - vw - 4 * sg)} ${n1(vt * .55)} ${n1(xo - vw * .7 + 6 * sg)} ${n1(vt)}L${n1(xo + vw * .7 + 6 * sg)} ${n1(vt)}C${n1(xo + vw - 4 * sg)} ${n1(vt * .55)} ${n1(xo + vw * .5)} -14 ${xo + 3} 0Z" fill="url(#${u}-jet${a.col === "c" ? "c" : ""})" style="animation-delay:-${(ci * .7 + .9).toFixed(2)}s"/></g>`;
      out += `<g opacity="${n1(k * .85)}"><path class="${P}jet" d="M${xo - 2.2} 0C${xo - 2.6} -6 ${n1(xo - jw)} -11 ${n1(xo - jw - 1.5)} -18L${n1(xo + jw + 1.5)} -18C${n1(xo + jw)} -11 ${xo + 2.6} -6 ${xo + 2.2} 0Z" fill="url(#${u}-jet${a.col === "c" ? "c" : ""})" style="animation-delay:-${(ci * .5).toFixed(2)}s"/></g>`;
      for (let i = 0; i < n; i++) {
        const t = (i + .5) / n, cy = -6 - t * Hh, r = (4.6 + t * 12) * (.72 + .38 * lv) * wd, sd = i % 2 ? -1 : 1;
        const cx = xo + Math.sin(i * 2.3 + ci * 1.7 + 1) * (1.2 + t * 6) * wd, op = (.85 - t * .45) * k;
        const del = ((i + ci * .45) * d / n).toFixed(2);
        out += `<g class="${P}pf ${P}pf${sd > 0 ? "R" : "L"}" style="animation-duration:${d.toFixed(2)}s;animation-delay:-${del}s">` +
          `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(r)}" ry="${n1(r * .8)}" fill="url(#${u}-${g})" opacity="${op.toFixed(2)}"/>` +
          `<ellipse cx="${n1(cx + sd * r * .55)}" cy="${n1(cy - r * .35)}" rx="${n1(r * .62)}" ry="${n1(r * .5)}" fill="url(#${u}-${g})" opacity="${(op * .8).toFixed(2)}"/></g>`;
      }
    });
    return out + `</g></g>`;
  }
  function tank(o, d, x1, x2, wl, yb, a) {
    a = a || {}; const u = o.uid;
    let s = `<clipPath id="${u}-tk"><path d="${d}"/></clipPath><path d="${d}" fill="#0b1626" fill-opacity="${a.dark == null ? .4 : a.dark}"/><g clip-path="url(#${u}-tk)">`;
    s += `<rect x="${x1}" y="${wl}" width="${x2 - x1}" height="${yb - wl}" fill="url(#${u}-wt)"/>`;
    let wv = `M${x1 - 16} ${wl}`; for (let x = x1 - 16; x < x2 + 16; x += 16) wv += `q4 -1.7 8 0t8 0`;
    s += `<path class="${o.on ? P + "wave" : ""}" d="${wv}V${wl + 3.2}H${x1 - 16}Z" fill="#e3f6ff" opacity=".55"/>`;
    s += `<rect x="${x1}" y="${wl + 3}" width="${x2 - x1}" height="5" fill="#fff" opacity=".07"/>`;
    if (a.bub && o.on) {
      const pts = a.bub; s += pts.map((p, i) => `<circle class="${P}bub" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.6}" fill="none" stroke="#f2fbff" stroke-opacity=".85" stroke-width=".8" style="animation-delay:-${(i * .61 % 3).toFixed(2)}s"/>`).join("");
    }
    if (a.ch) { const c = a.ch; s += `<path d="${rr(c[0] - c[2], c[1], c[2] * 2, yb - c[1] + 10, Math.min(c[2], 4))}" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".28" stroke-width=".8"/><path d="M${c[0] - c[2] + 2} ${c[1] + 4}V${yb}" stroke="#fff" stroke-opacity=".3" stroke-width="1.2"/>`; }
    if (a.ch && o.on) s += `<g opacity=".5"><ellipse class="${P}pulse" cx="${a.ch[0]}" cy="${wl - 2}" rx="${a.ch[2] + 3}" ry="2" fill="#fff"/></g>`;
    s += `</g><path d="${d}" fill="url(#${u}-gls)" stroke="#e8f6ff" stroke-opacity=".5" stroke-width="1"/>`;
    if (a.hl) s += `<path d="M${a.hl[0]} ${a.hl[1]}V${a.hl[2]}" stroke="#fff" stroke-opacity=".42" stroke-width="2.4" stroke-linecap="round"/><path d="M${a.hl[0] + 5} ${a.hl[1] + 4}V${a.hl[1] + 14}" stroke="#fff" stroke-opacity=".25" stroke-width="1.2" stroke-linecap="round"/>`;
    return s;
  }
  function led(o, x, y, r, col) {
    r = r || 1.8; col = col || CY;
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#4b5058"/>`;
    const hh = col === CY ? `url(#${o.uid}-ledh)` : col;
    return `<g opacity=".25"><circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 5}" fill="${hh}"${col === CY ? "" : ``}/></g><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${n1(r * .4)}" fill="#f0feff"/>`;
  }
  const disp = (o, x, y, txt, size) => o.on ? `<text x="${x}" y="${y}" text-anchor="middle" ${FONT} font-weight="600" font-size="${size || 10}" fill="${CY}" stroke="${CY}" stroke-opacity=".25" stroke-width="1.6" paint-order="stroke">${txt}</text>` : "";
  const nl = (o, cx, cy, rx, ry, m) => o.on ? `<g opacity="${((.3 + .7 * o.level) * (m || 1)).toFixed(2)}"><ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${o.uid}-nl)"/></g>` : "";
  const lit = (o, base, m) => o.on ? H().mix(base, o.color, (.55 + .45 * o.level) * (m || 1)) : base;
  const nozzle = (o, x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1b1f26"/><ellipse cx="${x}" cy="${y + ry * .25}" rx="${n1(rx * .55)}" ry="${n1(ry * .5)}" fill="#05070a"/><path d="${arcF(x - rx, x + rx, y, ry)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
  const knob = (o, x, y, r) => `<circle cx="${x}" cy="${y + 1}" r="${r + 1}" fill="#000" fill-opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${o.uid}-st)"/><circle cx="${x}" cy="${y}" r="${n1(r * .7)}" fill="url(#${o.uid}-pwv)" opacity=".5"/><path d="M${x} ${y - r * .75}V${y - r * .3}" stroke="#2a2e35" stroke-width="1.2" stroke-linecap="round"/>`;
  function leaf(x, y, a, L, u) {
    return `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C-${n1(L * .32)} -${n1(L * .3)} -${n1(L * .3)} -${n1(L * .78)} 0 -${L}C${n1(L * .3)} -${n1(L * .78)} ${n1(L * .32)} -${n1(L * .3)} 0 0Z" fill="url(#${u}-lf)"/><path d="M0 -2V-${n1(L * .9)}" stroke="#d9f5cf" stroke-opacity=".45" stroke-width=".8"/></g>`;
  }

  const css = `
.hda-humidifier-pf{transform-box:fill-box;transform-origin:50% 70%}
.hda-anim .hda-humidifier-pfR{animation:hda-humidifier-curlR 4s ease-out infinite}
.hda-anim .hda-humidifier-pfL{animation:hda-humidifier-curlL 4s ease-out infinite}
@keyframes hda-humidifier-curlR{0%{transform:translate(0,12px) scale(.5);opacity:0}22%{opacity:1}60%{transform:translate(4px,-8px) scale(1.12)}100%{transform:translate(-3px,-26px) scale(1.5);opacity:0}}
@keyframes hda-humidifier-curlL{0%{transform:translate(0,12px) scale(.5);opacity:0}22%{opacity:1}60%{transform:translate(-4px,-8px) scale(1.12)}100%{transform:translate(3px,-26px) scale(1.5);opacity:0}}
.hda-anim .hda-humidifier-jet{animation:hda-humidifier-jet 1.8s ease-in-out infinite}
@keyframes hda-humidifier-jet{50%{opacity:.45}}
.hda-anim .hda-humidifier-wave{animation:hda-humidifier-wave 2.6s linear infinite}
@keyframes hda-humidifier-wave{to{transform:translateX(-16px)}}
.hda-anim .hda-humidifier-bub{animation:hda-humidifier-bub 3s linear infinite}
@keyframes hda-humidifier-bub{0%{transform:translateY(4px);opacity:0}15%{opacity:1}85%{opacity:.8}100%{transform:translateY(-26px);opacity:0}}
.hda-anim .hda-humidifier-pulse{animation:hda-humidifier-pulse 3.2s ease-in-out infinite}
@keyframes hda-humidifier-pulse{50%{opacity:.45}}
.hda-humidifier-glow{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-humidifier-glow{animation:hda-humidifier-glow 5s ease-in-out infinite}
@keyframes hda-humidifier-glow{50%{transform:scale(1.06);opacity:.7}}
.hda-anim .hda-humidifier-flk{animation:hda-humidifier-flk 1.7s ease-in-out infinite}
@keyframes hda-humidifier-flk{0%,100%{opacity:1}30%{opacity:.78}55%{opacity:.95}75%{opacity:.82}}
.hda-humidifier-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-humidifier-spin{animation:hda-humidifier-spin 1s linear infinite}
@keyframes hda-humidifier-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-humidifier-pfR,.hda-anim .hda-humidifier-pfL,.hda-anim .hda-humidifier-jet,.hda-anim .hda-humidifier-wave,.hda-anim .hda-humidifier-bub,.hda-anim .hda-humidifier-pulse,.hda-anim .hda-humidifier-glow,.hda-anim .hda-humidifier-flk,.hda-anim .hda-humidifier-spin{animation:none!important}}
`;

  const ic = (id, name, first, render, label, colors) => ({ id, name, colors: colors || sw(first), picker: true, colorLabel: label || "Body", render });
  // (multi-function) parts: o.parts holds only the parts the user ticked; a part left out follows the one device as a
  // Device Image (no o.mf, as today) and stays off, never animated, as a Multi-Function Image (o.mf). A part's level is
  // o.plevel[id], a light's color o.pcolor[id], a stage part's value o.pval[id] (one of its stage ids; left out = none).
  const MF = {
    has: (o, k) => !!(o.parts && o.parts[k] != null),
    on: (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on),
    lv: (o, k) => (o.plevel && o.plevel[k] != null && isFinite(+o.plevel[k]) ? +o.plevel[k] : o.level),
    col: (o, k, d) => (o.pcolor && /^#[0-9a-fA-F]{6}$/.test(o.pcolor[k] || "") ? o.pcolor[k] : d),
    st: (o, k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" ? String(o.pval[k]) : null),
    // the drawing as one part: on = that part, level = its level
    as: (o, k) => Object.assign({}, o, { on: MF.on(o, k), level: MF.lv(o, k) }),
  };
  // (parts) Mist (the mist, the tank's bubbles) and Night light (the drawing's glow, in the light's color: o.pcolor.light,
  // else the drawing's light color). render(o, L): o = the mist's view, L = the light's. A Device Image (no o.mf, no parts)
  // gets the one device for both, so it is drawn exactly as before. own = the picker color is the light's color.
  const HP = [{ id: "mist", name: "Mist" }, { id: "light", name: "Night light" }];
  const lv1 = (v) => (v == null || !isFinite(+v) ? 1 : Math.max(0, Math.min(1, +v)));
  const MH = (render, own) => (o) => {
    if (!o.mf && !o.parts) return render(o, o);
    const lc = MF.col(o, "light", null), mo = Object.assign({}, o, { on: MF.on(o, "mist"), level: lv1(MF.lv(o, "mist")) });
    const L = Object.assign({}, o, { on: MF.on(o, "light"), level: lv1(MF.lv(o, "light")), mf: true });
    if (lc && own) mo.color = L.color = lc; else if (lc) L.lc = lc;
    return render(mo, L);
  };
  const icm = (id, name, first, render, own, label, colors) => Object.assign(ic(id, name, first, MH(render, own), label, colors), { parts: HP });
  // a night-light glow with its own gradient (drawings whose picker color is the body)
  const glowL = (L, key, cx, cy, rx, ry, col, m) => L.on ? `<defs><radialGradient id="${L.uid}-${key}"><stop offset="0" stop-color="${col}" stop-opacity=".9"/><stop offset=".5" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs>` +
    `<g opacity="${((.3 + .7 * L.level) * (m || 1)).toFixed(2)}"><ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${L.uid}-${key})"/></g>` : "";

  const icons = [
    icm("cleartank", "Clear tank", W, (o, L) => { const u = o.uid, p = pal(o.color), td = "M62 136V80A17 17 0 0 1 79 63H121A17 17 0 0 1 138 80V136Z"; return svg(o,
      sh(o, 100, 182, 56, 7) +
      tank(o, td, 62, 138, 100, 136, { ch: [100, 66, 6], hl: [68, 76, 128], bub: [[84, 132], [118, 130, 1.2], [92, 126, 1]] }) +
      `<path d="${rr(54, 132, 92, 48, 15)}" fill="url(#${u}-v)"/><path d="${rr(54, 132, 92, 48, 15)}" fill="url(#${u}-edge)" opacity=".75"/>` +
      `<path d="M60 134H140" stroke="#000" stroke-opacity=".28" stroke-width="2"/><path d="M62 137H138" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>` +
      `<path d="${rr(78, 148, 44, 20, 10)}" fill="#000" fill-opacity=".14"/>` + (L.mf ? glowL(L, "ctg", 100, 182, 64, 9, L.lc || NL[0], .9) + glowL(L, "ctb", 100, 137, 44, 9, L.lc || NL[0], .8) + `<path d="M64 137.6H136" stroke="${L.on ? H().mix(L.lc || NL[0], "#ffffff", .35) : "#000"}" stroke-opacity="${L.on ? (.55 + .45 * L.level).toFixed(2) : .18}" stroke-width="2.2" stroke-linecap="round"/>` : "") + knob(o, 92, 158, 7) + led(o, 112, 158, 1.8) +
      `<path d="${rr(68, 55, 64, 11, 5.5)}" fill="url(#${u}-c)" stroke="${p.e}" stroke-width=".5"/><path d="M73 57H127" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>` +
      nozzle(o, 100, 56, 9, 2.8) + mist(o, 100, 54)); }, false),

    icm("teardrop", "Teardrop", SK, (o, L) => { const u = o.uid, p = pal(o.color), d = "M100 36C122 66 144 94 144 128A44 44 0 0 1 56 128C56 94 78 66 100 36Z"; return svg(o,
      sh(o, 100, 182, 54, 7) +
      tank(o, d, 56, 144, 118, 172, { ch: [100, 52, 4.5], hl: [70, 104, 146], bub: [[82, 160], [116, 156, 1.2]] }) +
      `<path d="M74 72C66 86 60 100 59 116" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="${cylF(62, 138, 158, 172, 8)}" fill="url(#${u}-c)"/><ellipse cx="100" cy="158" rx="38" ry="8" fill="none" stroke="${p.e}" stroke-opacity=".6" stroke-width="1"/>` +
      `<path d="${arcF(62, 138, 158, 8)}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>` +
      (L.on ? `<g opacity="${k1(L).toFixed(2)}"><path class="${P}pulse" d="${arcF(68, 132, 167, 6.5)}" fill="none" stroke="${L.lc || CY}" stroke-width="1.8"/></g>` + (L.mf ? glowL(L, "tdg", 100, 172, 50, 9, L.lc || CY, .7) : "") : `<path d="${arcF(68, 132, 167, 6.5)}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1.6"/>`) +
      `<ellipse cx="100" cy="38.5" rx="5.5" ry="2.4" fill="url(#${u}-tp)"/><ellipse cx="100" cy="38" rx="2.4" ry="1" fill="#05070a"/>` + mist(o, 100, 36, { s: .95 })); }, false),

    ic("woodbase", "Wood base", W, (o) => { const u = o.uid, cone = "M64 136C66 108 84 84 92 66H108C116 84 134 108 136 136Z"; let spk = "";
      for (let i = 0; i < 26; i++) { const t = (i * .618 + .1) % 1, y = 72 + t * 60, hw = 8 + 28 * t, fr = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5) % 1, x = 100 + (fr * 2 - 1) * hw * .82; spk += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${i % 3 ? .55 : .8}" fill="#3a3330" opacity=".45"/>`; }
      return svg(o,
      sh(o, 100, 180, 52, 7) +
      `<path d="${cylP(60, 140, 132, 168, 8)}" fill="url(#${u}-wood)"/><path d="${cylP(60, 140, 132, 168, 8)}" fill="url(#${u}-grain)"/><path d="${cylP(60, 140, 132, 168, 8)}" fill="url(#${u}-edge)" opacity=".6"/>` +
      seam(60, 140, 160, 8) + hl(67, 140, 164, 2.4, .25) +
      `<ellipse cx="100" cy="132" rx="40" ry="8" fill="#5e3d22"/>` +
      `<path d="${cone}" fill="url(#${u}-c)"/>${spk}<path d="${cone}" fill="url(#${u}-edge)" opacity=".55"/>` +
      `<path d="M64 136A36 7 0 0 0 136 136" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>` +
      `<path d="M90 72C82 90 72 108 70 128" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2.6" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="66" rx="8" ry="2.4" fill="url(#${u}-tp)"/>` + nozzle(o, 100, 66, 5.5, 1.7) +
      `<circle cx="100" cy="150" r="5.5" fill="#f4efe6" stroke="#3a2414" stroke-opacity=".4" stroke-width=".8"/>` +
      (o.on ? `<g opacity="${k1(o).toFixed(2)}"><circle class="${P}pulse" cx="100" cy="150" r="7" fill="none" stroke="${CY}" stroke-width="1.3"/></g>` : "") +
      mist(o, 100, 64, { s: .95 })); }),

    ic("evaporative", "Evaporative", W, (o) => { const u = o.uid, p = pal(o.color), dd = (1.3 - .9 * o.level).toFixed(2); let gr = "";
      for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; gr += `<line x1="${n1(100 + Math.cos(a) * 11)}" y1="${n1(77 + Math.sin(a) * 2.5)}" x2="${n1(100 + Math.cos(a) * 42)}" y2="${n1(77 + Math.sin(a) * 9.2)}" stroke="${p.l}" stroke-opacity=".7" stroke-width=".9"/>`; }
      const blades = [0, 72, 144, 216, 288].map((a) => `<path d="M0 0C10 -6 26 -10 32 -2C24 2 10 4 0 0Z" fill="#59606b" transform="rotate(${a})"/>`).join("");
      return svg(o,
      sh(o, 100, 183, 70, 7) +
      `<path d="${rr(34, 76, 132, 104, 16)}" fill="url(#${u}-v)"/><path d="${rr(34, 76, 132, 104, 16)}" fill="url(#${u}-edge)" opacity=".7"/>` +
      `<ellipse cx="100" cy="77" rx="62" ry="12" fill="url(#${u}-tp)"/><ellipse cx="100" cy="77" rx="46" ry="10.2" fill="url(#${u}-dk)"/>` +
      `<g transform="translate(100 77) scale(1 .22)"><g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dd}s">${blades}<circle r="9" fill="#2a2e35"/></g></g>` +
      gr + `<ellipse cx="100" cy="77" rx="46" ry="10.2" fill="none" stroke="${p.d}" stroke-width="1.4"/><ellipse cx="100" cy="77" rx="10" ry="2.2" fill="${p.m}"/>` +
      `<path d="${rr(46, 98, 66, 66, 8)}" fill="#0c1018"/>` +
      `<clipPath id="${u}-wk"><path d="${rr(48, 100, 62, 62, 6)}"/></clipPath><g clip-path="url(#${u}-wk)"><rect x="48" y="100" width="62" height="62" fill="url(#${u}-wick)"/><rect x="48" y="100" width="62" height="62" fill="url(#${u}-hc)"/>` +
      `<rect x="48" y="128" width="62" height="34" fill="#4a86c8" opacity=".42"/><rect x="48" y="146" width="62" height="16" fill="url(#${u}-wt)"/><path class="${o.on ? P + "wave" : ""}" d="M32 146q4 -1.5 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0V149H32Z" fill="#e3f6ff" opacity=".55"/></g>` +
      `<path d="${rr(48, 100, 62, 62, 6)}" fill="url(#${u}-gls)" stroke="#e8f6ff" stroke-opacity=".45"/><path d="M54 106V136" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="${rr(120, 100, 34, 30, 6)}" fill="url(#${u}-dk)"/>` + disp(o, 137, 119, "50%", 10) + knob(o, 137, 150, 9) + led(o, 126, 172, 1.4) +
      `<path d="M40 90V168" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>` +
      mist(o, 100, 72, { xs: [-26, 0, 26], s: 1, k: .7, wd: 1.2 })); }),

    ic("warmmist", "Warm mist", W, (o) => { const u = o.uid, p = pal(o.color), body = "M50 178V128C50 102 72 88 100 88C128 88 150 102 150 128V178Z"; return svg(o,
      sh(o, 100, 182, 60, 7) +
      `<path d="${body}" fill="url(#${u}-c)"/><path d="${body}" fill="url(#${u}-edge)" opacity=".6"/>` +
      `<path d="M62 116C66 102 80 94 96 92" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round"/>` +
      tank(o, rr(60, 118, 52, 52, 12), 60, 112, 140, 170, { hl: [65, 124, 160], dark: .3 }) +
      `<circle cx="132" cy="138" r="12" fill="#1a1d23" stroke="${p.e}" stroke-width="1"/>` +
      (o.on ? `<g opacity="${k1(o).toFixed(2)}"><circle class="${P}flk" cx="132" cy="138" r="16" fill="url(#${u}-heat)"/></g><circle cx="132" cy="138" r="5" fill="#ffe2a8" opacity="${k1(o).toFixed(2)}"/>` : `<circle cx="132" cy="138" r="5" fill="#3a2f2a"/>`) +
      `<path d="M126 132a8 8 0 0 1 12 0" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` +
      `<path d="M50 172H150" stroke="#000" stroke-opacity=".25" stroke-width="2"/>` + led(o, 132, 162, 1.6, "#ff9a4a") +
      `<ellipse cx="100" cy="91" rx="16" ry="4" fill="url(#${u}-tp)"/>` + nozzle(o, 100, 90, 10, 2.8) + mist(o, 100, 88, { col: "w", fast: true, s: 1.02 })); }),

    ic("tower", "Display tower", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 184, 38, 6) +
      `<path d="${rr(72, 44, 56, 138, 26)}" fill="url(#${u}-c)"/><path d="${rr(72, 44, 56, 138, 26)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<ellipse cx="100" cy="52" rx="20" ry="5" fill="#000" fill-opacity=".22"/>` + nozzle(o, 100, 51, 11, 3) +
      `<path d="${rr(80, 70, 40, 26, 8)}" fill="url(#${u}-dk)" stroke="#000" stroke-opacity=".4"/>` +
      (o.on ? `<path d="M88 77q-2.4 3.4 0 5.4q2.4 -2 0 -5.4z" fill="${CY}"/>` : "") + disp(o, 104, 88, "45%", 12) +
      `<path d="M82 72H118" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>` +
      tank(o, rr(86, 108, 28, 60, 13), 86, 114, 132, 168, { hl: [90, 114, 160], dark: .3 }) +
      `<path d="M76 174H124" stroke="#000" stroke-opacity=".35" stroke-width="2"/>` + hl(77, 64, 166, 2.4, .3) + led(o, 100, 102, 1.4) +
      mist(o, 100, 49)); }),

    ic("turnnozzle", "360 nozzle", W, (o) => { const u = o.uid, p = pal(o.color); return svg(o,
      sh(o, 100, 182, 60, 7) +
      `<path d="${cylP(54, 146, 140, 172, 10)}" fill="url(#${u}-c)"/>` + seam(54, 146, 140, 10) + hl(60, 146, 168, 2.4, .3) +
      tank(o, cylP(60, 140, 94, 140, 9), 60, 140, 116, 150, { ch: [100, 96, 6], hl: [66, 104, 140], bub: [[80, 146], [124, 144, 1.2]] }) +
      `<ellipse cx="100" cy="94" rx="40" ry="9" fill="url(#${u}-tp)" stroke="${p.e}" stroke-width=".6"/><ellipse cx="100" cy="94" rx="30" ry="6" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="2"/>` +
      `<g transform="rotate(-26 100 92)"><path d="${rr(92, 66, 16, 28, 6)}" fill="url(#${u}-c)"/><path d="M95 70V90" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="67" rx="8" ry="2.6" fill="url(#${u}-tp)"/>${nozzle(o, 100, 67, 6, 2)}</g>` +
      `<ellipse cx="100" cy="94" rx="10" ry="2.6" fill="${p.d}"/>` +
      `<path d="M64 88A40 9 0 0 1 82 84.6" fill="none" stroke="${CY}" stroke-opacity="${o.on ? .8 : .2}" stroke-width="1.2" stroke-dasharray="2 2"/>` +
      knob(o, 100, 158, 7) + led(o, 124, 158, 1.6) +
      mist(o, 88.6, 69, { rot: -18 })); }),

    ic("usbcup", "USB cup", BL, (o) => { const u = o.uid, p = pal(o.color), cup = "M76 112H124L119 174A19 5 0 0 1 81 174Z"; return svg(o,
      sh(o, 104, 181, 46, 6) +
      `<path d="M120 168C140 176 150 158 164 168C172 174 170 180 178 182" fill="none" stroke="#2a2e35" stroke-width="2.6" stroke-linecap="round"/>` +
      `<path d="${rr(170, 176, 16, 9, 2)}" fill="url(#${u}-st)" transform="rotate(14 178 180)"/><path d="${rr(172, 177, 6, 7, 1)}" fill="#2a2e35" transform="rotate(14 178 180)"/>` +
      `<path d="${cup}" fill="url(#${u}-c)"/><path d="${cup}" fill="url(#${u}-edge)" opacity=".6"/>` +
      `<path d="M78 134H122M79 140H121" stroke="#000" stroke-opacity=".12" stroke-width="2"/><path d="M78 135.2H122" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>` +
      `<path d="M83 118L86 168" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="112" rx="24" ry="5.5" fill="url(#${u}-tp)" stroke="${p.e}" stroke-width=".6"/><ellipse cx="100" cy="112" rx="17" ry="3.6" fill="#000" fill-opacity=".12"/>` + nozzle(o, 100, 111, 6, 1.8) +
      (o.on ? `<g opacity="${k1(o).toFixed(2)}"><path class="${P}pulse" d="${arcF(82, 118, 164, 4.6)}" fill="none" stroke="${CY}" stroke-width="1.6"/></g>` : "") +
      mist(o, 100, 109, { s: .82 })); }),

    icm("flame", "Flame mist", FL[0], (o, L) => { const u = o.uid, c = o.color, k = k1(L); return svg(o,
      sh(o, 100, 182, 66, 7) +
      `<path d="${rr(38, 104, 124, 74, 12)}" fill="#24272e"/><path d="${rr(38, 104, 124, 74, 12)}" fill="url(#${u}-edge)" opacity=".8"/>` +
      `<path d="M44 108H156" stroke="#fff" stroke-opacity=".22" stroke-width="1"/>` +
      `<path d="M40 150H160V166A12 12 0 0 1 148 178H52A12 12 0 0 1 40 166Z" fill="url(#${u}-wood)"/><path d="M40 150H160V166A12 12 0 0 1 148 178H52A12 12 0 0 1 40 166Z" fill="url(#${u}-grain)"/><path d="M40 150H160" stroke="#000" stroke-opacity=".4" stroke-width="1.2"/><path d="M40 151.4H160" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>` +
      `<path d="M46 112V146" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/>` +
      (L.on ? `<g opacity="${(.35 * k).toFixed(2)}"><path class="${P}flk" d="${rr(40, 104, 120, 44, 12)}" fill="url(#${u}-nl)"/></g>` : "") +
      `<path d="${rr(54, 98, 92, 10, 5)}" fill="#08090c"/>` +
      (L.on ? `<g opacity="${k.toFixed(2)}"><path class="${P}flk" d="${rr(56, 100, 88, 6, 3)}" fill="${H().mix(c, "#ffffff", .45)}"/></g><g opacity="${(.9 * k).toFixed(2)}"><ellipse class="${P}flk" cx="100" cy="102" rx="60" ry="14" fill="url(#${u}-nl)"/></g>` : `<path d="${rr(56, 100, 88, 6, 3)}" fill="#1a1c22"/>`) +
      `<circle cx="146" cy="128" r="2.4" fill="#15171c"/><circle cx="136" cy="128" r="2.4" fill="#15171c"/>` + (L.on ? `<circle cx="146" cy="128" r="1.7" fill="${c}"/>` : "") +
      nl(L, 100, 72, 64, 50, .5) + mist(o, 100, 102, { col: L.on ? "c" : "", xs: [-30, -10, 10, 30], flk: true, k: 1.15, wd: .9 })); }, true, "Flame", FL),

    icm("cloud", "Cloud light", NL[2], (o, L) => { const u = o.uid, cl = "M58 152A24 24 0 0 1 58 106A30 30 0 0 1 104 84A31 31 0 0 1 148 106A23 23 0 0 1 144 152Z", body = lit(L, "#f4f2fb", .45);
      return svg(o,
      nl(L, 100, 168, 70, 14, .9) + sh(o, 100, 168, 48, 5) +
      `<ellipse cx="78" cy="156" rx="7" ry="4" fill="#cfcbe0"/><ellipse cx="124" cy="156" rx="7" ry="4" fill="#cfcbe0"/>` +
      `<path d="${cl}" fill="${body}"/>` +
      (L.on ? `<g opacity="${(.55 + .4 * L.level).toFixed(2)}"><path class="${P}glow" d="${cl}" fill="url(#${u}-nl)"/></g>` : "") +
      `<path d="${cl}" fill="url(#${u}-g)" opacity=".5"/><path d="M58 152A24 24 0 0 1 58 106A30 30 0 0 1 104 84A31 31 0 0 1 148 106A23 23 0 0 1 144 152Z" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1"/>` +
      `<path d="M60 146C48 138 48 116 62 110M80 92C88 86 98 85 106 86" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>` +
      `<path d="M58 152H144" stroke="#000" stroke-opacity=".18" stroke-width="3"/>` +
      `<ellipse cx="108" cy="86" rx="7" ry="2.4" fill="#e6e3f0"/>` + nozzle(o, 108, 86, 4.5, 1.5) + led(o, 128, 140, 1.4) +
      mist(o, 108, 84, { s: .95 })); }, true, "Night light", NL),

    icm("ledring", "LED ring", NL[0], (o, L) => { const u = o.uid, dome = "M58 128C58 94 78 76 100 76C122 76 142 94 142 128Z"; return svg(o,
      nl(L, 100, 176, 76, 12) + sh(o, 100, 178, 52, 5) +
      tank(o, dome, 58, 142, 104, 130, { ch: [100, 80, 5], hl: [66, 104, 124], bub: [[84, 126], [116, 124, 1.1]] }) +
      `<path d="${cylP(56, 144, 128, 162, 10)}" fill="url(#${u}-pw)"/>` + seam(56, 144, 128, 10) +
      `<path d="M64 140V156" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="${band(58, 142, 162, 170, 9)}" fill="${lit(L, "#5a5f69", .9)}"/>` +
      (L.on ? `<g opacity="${(.5 + .5 * L.level).toFixed(2)}"><path class="${P}pulse" d="${band(58, 142, 162, 170, 9)}" fill="${H().mix(L.color, "#ffffff", .4)}"/></g><ellipse class="${P}glow" cx="100" cy="170" rx="62" ry="14" fill="url(#${u}-nl)"/>` : "") +
      `<ellipse cx="100" cy="77" rx="7.5" ry="2.6" fill="url(#${u}-pwv)"/>` + nozzle(o, 100, 76.5, 5, 1.7) + led(o, 100, 146, 1.5) +
      mist(o, 100, 75)); }, true, "Night light", NL),

    ic("console", "Console", SD, (o) => { const u = o.uid; return svg(o,
      sh(o, 100, 184, 64, 6) +
      `<rect x="50" y="176" width="10" height="6" rx="2" fill="#1b1d22"/><rect x="140" y="176" width="10" height="6" rx="2" fill="#1b1d22"/>` +
      `<path d="${rr(44, 70, 112, 108, 8)}" fill="url(#${u}-v)"/><path d="${rr(44, 70, 112, 108, 8)}" fill="url(#${u}-edge)" opacity=".75"/>` +
      `<path d="${rr(40, 62, 120, 13, 4)}" fill="url(#${u}-wood)"/><path d="${rr(40, 62, 120, 13, 4)}" fill="url(#${u}-grain)"/><path d="M43 63.5H157" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` +
      `<path d="${rr(58, 65, 84, 7, 3)}" fill="#14161b"/><path d="${rr(58, 65, 84, 7, 3)}" fill="url(#${u}-slot)"/>` +
      `<path d="${rr(56, 84, 88, 20, 5)}" fill="url(#${u}-dk)"/>` + disp(o, 82, 98, "50%", 11) + led(o, 112, 94, 1.5) + led(o, 122, 94, 1.5, o.on ? "#34d399" : null) + led(o, 132, 94, 1.5) +
      `<path d="${rr(56, 112, 88, 56, 6)}" fill="#000" fill-opacity=".14"/><path d="${rr(56, 112, 88, 56, 6)}" fill="url(#${u}-fab)"/><path d="${rr(56, 112, 88, 56, 6)}" fill="url(#${u}-g)" opacity=".25"/>` +
      `<path d="M49 80V170" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>` +
      mist(o, 100, 64, { xs: [-26, 0, 26], k: .9, wd: 1.1 })); }),

    icm("plantpot", "Plant pot", "#c86f4a", (o, L) => { const u = o.uid, p = pal(o.color), pot = "M64 120H136L128 174A28 6 0 0 1 72 174Z"; return svg(o,
      sh(o, 100, 182, 50, 6) +
      leaf(84, 116, -56, 44, u) + leaf(118, 116, 60, 42, u) + leaf(90, 114, -26, 40, u) + leaf(112, 114, 30, 38, u) + leaf(96, 113, -8, 30, u) +
      `<path d="${pot}" fill="url(#${u}-c)"/><path d="${pot}" fill="url(#${u}-edge)" opacity=".5"/>` +
      `<path d="${rr(60, 112, 80, 12, 5)}" fill="url(#${u}-c)"/><path d="M63 114H137" stroke="#fff" stroke-opacity=".4" stroke-width="1"/><path d="M62 124H138" stroke="#000" stroke-opacity=".25" stroke-width="1.4"/>` +
      `<path d="M72 130L76 168" stroke="#fff" stroke-opacity=".3" stroke-width="2.6" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="113" rx="34" ry="4.5" fill="#2a1d15"/><ellipse cx="100" cy="113" rx="8" ry="2.2" fill="#d9dcdf"/>` + nozzle(o, 100, 112.6, 5, 1.5) +
      leaf(76, 115, -84, 30, u) + leaf(125, 115, 86, 28, u) +
      `<path d="M92 160H108" stroke="${p.k}" stroke-opacity=".5" stroke-width="2"/>` + (L.mf ? glowL(L, "ppg", 100, 181, 58, 8, L.lc || NL[0], .9) + `<path d="M73 172.6A28 5 0 0 0 127 172.6" fill="none" stroke="${L.on ? H().mix(L.lc || NL[0], "#ffffff", .35) : "#000"}" stroke-opacity="${L.on ? (.55 + .45 * L.level).toFixed(2) : .2}" stroke-width="2" stroke-linecap="round"/>` : "") + led(o, 100, 150, 1.4) +
      mist(o, 100, 111, { s: .92 })); }, false, "Pot", ["#c86f4a", "#eef0ef", "#3d4148", "#a7b79c", "#dac9a9"]),

    ic("cordless", "Cordless", SG, (o) => { const u = o.uid, p = pal(o.color); let bat = "";
      for (let i = 0; i < 4; i++) bat += `<rect x="${90 + i * 5.5}" y="100" width="4" height="7" rx="1" fill="${o.on && i < 3 ? CY : "#3a3f47"}"${o.on && i < 3 ? ` opacity=".9"` : ""}/>`;
      return svg(o,
      sh(o, 100, 180, 30, 5) +
      `<path d="M84 76C70 58 58 66 62 82C64 90 72 92 80 88" fill="none" stroke="${p.k}" stroke-width="5" stroke-linecap="round"/><path d="M84 76C70 58 58 66 62 82" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path d="${cylP(80, 120, 72, 174, 6)}" fill="url(#${u}-c)"/>` +
      tank(o, band(81, 119, 122, 166, 5.5), 80, 120, 140, 172, { ch: [100, 120, 4], hl: [85, 128, 160], bub: [[92, 164], [110, 162, 1]] }) +
      seam(80, 120, 120, 6) + seam(80, 120, 166, 6) +
      `<ellipse cx="100" cy="72" rx="20" ry="6" fill="url(#${u}-tp)" stroke="${p.e}" stroke-width=".6"/>` + nozzle(o, 100, 72, 7, 2.2) +
      `<path d="${rr(86, 96, 28, 15, 4)}" fill="url(#${u}-dk)"/>` + bat +
      `<circle cx="100" cy="86" r="4" fill="${p.d}"/><circle cx="100" cy="86" r="2.6" fill="${p.l}"/>` + hl(85, 80, 116, 2.4, .35) +
      mist(o, 100, 70, { s: .9 })); }),

    ic("dual", "Dual nozzle", W, (o) => { const u = o.uid, p = pal(o.color); return svg(o,
      sh(o, 100, 182, 66, 7) +
      tank(o, rr(46, 82, 108, 62, 18), 46, 154, 112, 146, { hl: [53, 92, 136], bub: [[66, 140], [100, 138, 1.2], [136, 140]] }) +
      `<path d="${rr(73, 84, 6, 60, 3)}" fill="#fff" fill-opacity=".14"/><path d="${rr(121, 84, 6, 60, 3)}" fill="#fff" fill-opacity=".14"/>` +
      `<path d="${rr(40, 138, 120, 40, 16)}" fill="url(#${u}-v)"/><path d="${rr(40, 138, 120, 40, 16)}" fill="url(#${u}-edge)" opacity=".7"/><path d="M48 141H152" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>` +
      `<path d="${rr(80, 148, 40, 18, 6)}" fill="url(#${u}-dk)"/>` + disp(o, 100, 161, "52%", 10) + led(o, 64, 158, 1.6) + led(o, 136, 158, 1.6) +
      `<path d="${rr(52, 74, 96, 12, 6)}" fill="url(#${u}-c)" stroke="${p.e}" stroke-width=".5"/><path d="M58 76H142" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>` +
      `<ellipse cx="76" cy="75" rx="9" ry="2.8" fill="url(#${u}-tp)"/><ellipse cx="124" cy="75" rx="9" ry="2.8" fill="url(#${u}-tp)"/>` + nozzle(o, 76, 75, 6, 1.9) + nozzle(o, 124, 75, 6, 1.9) +
      mist(o, 76, 73, { rot: -10, s: .9 }) + mist(o, 124, 73, { rot: 10, s: .9 })); }),

    icm("smartring", "Smart ring", CH, (o, L) => { const u = o.uid, p = pal(o.color), lv = L.on ? L.level : 0, CR = L.lc || CY, dev = { on: o.on || L.on }; let arc = "";
      const a0 = Math.PI * .75, a1 = a0 + Math.PI * 1.5 * Math.max(.04, lv), pt = (a) => `${n1(100 + Math.cos(a) * 34)} ${n1(104 + Math.sin(a) * 8.6)}`;
      let dtr = `M${pt(a0)}`; for (let i = 1; i <= 24; i++) dtr += `L${pt(a0 + Math.PI * 1.5 * i / 24)}`;
      if (L.on) { arc = `M${pt(a0)}`; for (let i = 1; i <= 24; i++) arc += `L${pt(a0 + (a1 - a0) * i / 24)}`; }
      return svg(o,
      sh(o, 100, 182, 56, 7) +
      `<path d="${cylP(54, 146, 104, 172, 12)}" fill="url(#${u}-c)"/><path d="${cylP(54, 146, 104, 172, 12)}" fill="url(#${u}-g)" opacity=".2"/>` + seam(54, 146, 162, 12) +
      `<ellipse cx="100" cy="104" rx="46" ry="12" fill="url(#${u}-tp)" stroke="${p.e}" stroke-width=".6"/>` +
      `<path d="${dtr}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>` +
      (L.on ? `<path d="${arc}" fill="none" stroke="${CR}" stroke-opacity=".3" stroke-width="7" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="${CR}" stroke-width="3" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="#effdff" stroke-width="1" stroke-linecap="round"/>` : "") +
      `<ellipse cx="100" cy="104" rx="12" ry="3.2" fill="${p.d}"/>` + nozzle(o, 100, 104, 7, 2) +
      `<path d="${rr(84, 128, 32, 16, 8)}" fill="url(#${u}-dk)"/>` + disp(dev, 100, 140, "48%", 9.5) +
      (dev.on ? `<path d="M126 136a6 6 0 0 1 8 0M128 139a3 3 0 0 1 4 0" fill="none" stroke="${CY}" stroke-width="1.2" stroke-linecap="round"/>` : "") + hl(61, 114, 164, 2.4, .25) +
      mist(o, 100, 102)); }, false),

    ic("vaporizer", "Vaporizer", JAR[0], (o) => { const u = o.uid, h = H(), jar = "M66 120C63 138 63 160 68 172A32 6 0 0 0 132 172C137 160 137 138 134 120Z", cap = "M60 122C60 102 80 92 100 92C120 92 140 102 140 122Z"; return svg(o,
      sh(o, 100, 182, 52, 6) +
      `<path d="M138 108C162 112 162 156 134 160" fill="none" stroke="#d9dce2" stroke-width="7" stroke-linecap="round"/><path d="M140 112C156 116 156 152 136 156" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>` +
      `<path d="${jar}" fill="${o.color}" fill-opacity=".5"/>` +
      tank(o, jar, 62, 138, 138, 180, { ch: [100, 122, 3.5], hl: [71, 130, 166], dark: 0 }) +
      `<path d="${jar}" fill="${h.shade(o.color, -.3)}" fill-opacity=".18"/>` +
      `<path d="${cap}" fill="url(#${u}-pw)"/><path d="M60 122H140" stroke="#000" stroke-opacity=".25" stroke-width="2"/><path d="M70 110C76 100 86 96 96 95" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="${rr(90, 76, 20, 20, 5)}" fill="url(#${u}-pw)"/><ellipse cx="100" cy="77" rx="10" ry="3" fill="#dfe2e7"/>` +
      `<ellipse cx="94" cy="77.6" rx="5" ry="1.8" fill="#c98a3a"/><ellipse cx="93" cy="77.2" rx="2.4" ry=".7" fill="#ffd79a" opacity=".8"/>` +
      `<ellipse cx="104.5" cy="77" rx="3.2" ry="1.3" fill="#05070a"/>` +
      `<circle cx="120" cy="110" r="3" fill="#c9ccd3"/>` + led(o, 120, 110, 1.6, "#ff9a4a") +
      mist(o, 104.5, 76, { col: "w", fast: true, s: .9 })); }, "Jar", JAR),

    ic("glasstank", "Glass tank", CH, (o) => { const u = o.uid, p = pal(o.color); return svg(o,
      sh(o, 100, 182, 46, 6) +
      tank(o, cylP(66, 134, 62, 152, 7), 66, 134, 104, 160, { ch: [100, 64, 5.5], hl: [72, 70, 146], bub: [[78, 150, 1.4], [88, 140, 1], [114, 152, 1.8], [124, 146, 1.1], [96, 132, 1.2], [118, 128, 1]] }) +
      `<path d="${cylP(62, 138, 150, 174, 8)}" fill="url(#${u}-c)"/>` + seam(62, 138, 150, 8) + hl(68, 156, 170, 2.2, .3) +
      `<path d="${rr(88, 158, 24, 9, 4.5)}" fill="#000" fill-opacity=".25"/>` + led(o, 100, 162.5, 1.5) +
      `<path d="${cylP(64, 136, 54, 64, 7)}" fill="url(#${u}-c)"/><ellipse cx="100" cy="54" rx="36" ry="7" fill="url(#${u}-tp)" stroke="${p.e}" stroke-width=".6"/>` +
      nozzle(o, 100, 54, 8, 2.4) + mist(o, 100, 52)); }),

    ic("fabricband", "Fabric band", "#8c9bb0", (o) => { const u = o.uid, p = pal(o.color); return svg(o,
      sh(o, 100, 182, 44, 6) +
      `<path d="${cylP(66, 134, 66, 174, 8)}" fill="url(#${u}-pw)"/>` +
      `<path d="${band(66, 134, 104, 152, 8)}" fill="url(#${u}-c)"/><path d="${band(66, 134, 104, 152, 8)}" fill="url(#${u}-fab)"/><path d="${band(66, 134, 104, 152, 8)}" fill="url(#${u}-edge)"/>` +
      `<path d="${arcF(68, 132, 107, 7.4)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7" stroke-dasharray="2 2"/><path d="${arcF(68, 132, 149, 7.4)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7" stroke-dasharray="2 2"/>` +
      `<path d="M118 110V160" stroke="#6b4426" stroke-width="7" stroke-linecap="round"/><path d="M116.6 112V158" stroke="#c08a5a" stroke-opacity=".55" stroke-width="1.4"/><circle cx="118" cy="114" r="1.2" fill="#d9b68c"/><circle cx="118" cy="156" r="1.2" fill="#d9b68c"/>` +
      tank(o, rr(95, 158, 10, 16, 5), 95, 105, 164, 174, { dark: .5 }) +
      `<ellipse cx="100" cy="66" rx="34" ry="8" fill="url(#${u}-pwv)" stroke="#a7adb4" stroke-width=".6"/><ellipse cx="100" cy="66" rx="24" ry="5" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2"/>` +
      nozzle(o, 100, 66, 8, 2.2) + hl(72, 74, 100, 2.6, .55) + led(o, 100, 86, 1.4) +
      mist(o, 100, 64)); }),

    ic("desksquare", "Desk square", W, (o) => { const u = o.uid, p = pal(o.color), side = "M134 112L148 104V152L134 162Z"; return svg(o,
      sh(o, 106, 180, 58, 6) +
      `<path d="M134 96L154 84V164L134 176Z" fill="url(#${u}-sd)"/>` +
      tank(o, side, 134, 148, 128, 164, { dark: .5 }) +
      `<path d="M54 96H134V176H54Z" fill="url(#${u}-v)"/><path d="M54 96H134V176H54Z" fill="url(#${u}-edge)" opacity=".5"/>` +
      `<path d="M54 96L74 84H154L134 96Z" fill="url(#${u}-tp)"/><path d="M54 96H134L154 84" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>` +
      `<ellipse cx="104" cy="90" rx="16" ry="3.6" fill="#000" fill-opacity=".15"/>` + nozzle(o, 104, 90, 9, 2.2) +
      `<path d="${rr(64, 108, 60, 26, 6)}" fill="url(#${u}-dk)"/><path d="M66 110H122" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>` + disp(o, 94, 126, "50%", 12) +
      [76, 94, 112].map((x) => `<circle cx="${x}" cy="152" r="4.2" fill="${p.d}"/><circle cx="${x}" cy="151.4" r="3.2" fill="url(#${u}-s)"/>`).join("") + led(o, 94, 166, 1.4) +
      `<path d="M58 100V170" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>` +
      mist(o, 104, 88)); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "humidifier", tab: "Humidifiers", group: "Air", kind: "device",
    intro: "Twenty humidifiers. When on, soft mist rises and curls from the nozzle, the water in clear tanks ripples and night lights glow; the slider sets the mist output.",
    
    css, icons,
  });
})();
