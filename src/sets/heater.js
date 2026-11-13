(function () {
  const P = "hda-heater-";
  const H = () => window.HDAH;
  const WH = "#eceff1", GR = "#a3abb4", CH = "#3b4049", CR = "#e6dbc4", RD = "#b8352c", SG = "#8fa58a", YE = "#d9a62e", BZ = "#8a6a4a";
  const SW = [WH, GR, CH, CR, RD, SG];
  const sw = (first, list) => [first].concat((list || SW).filter((c) => c !== first));
  const FL = ["#ff8a2a", "#ffb84a", "#ff5a3c", "#4da3ff", "#a66bff", "#3ee0b0"];
  const fsw = (first) => [first].concat(FL.filter((c) => c !== first));
  const HOT = "#ff9a4a";
  const n1 = (v) => (+v).toFixed(1);
  const G = (o) => (o.on ? .3 + .7 * o.level : 0);
  const g2 = (o, k) => (G(o) * (k == null ? 1 : k)).toFixed(2);
  const tmp = (o) => Math.round(62 + 16 * o.level);
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);

  function pal(c) { const h = H(); return { l: h.shade(c, .5), m: c, d: h.shade(c, -.26), k: h.shade(c, -.5), e: h.shade(c, -.42) }; }

  function defs(o) {
    const u = o.uid, p = pal(o.color), h = H(), F = o.color;
    const fm = h.mix(F, "#ffd27a", .5), fc = h.mix(F, "#ffffff", .75), fe = h.mix(F, "#ff5a1a", .35);
    return `<defs>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".3" stop-color="${p.l}"/><stop offset=".62" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".45" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" x2="1"><stop offset="0" stop-color="${p.m}"/><stop offset=".45" stop-color="${p.l}"/><stop offset="1" stop-color="${p.m}"/></linearGradient>
<linearGradient id="${u}-sd" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-fx" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".16" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0b0c"/><stop offset="1" stop-color="#2a2326"/></linearGradient>
<linearGradient id="${u}-bk" x1="0" x2="1"><stop offset="0" stop-color="#15171b"/><stop offset=".3" stop-color="#4a4f57"/><stop offset=".6" stop-color="#2a2e34"/><stop offset="1" stop-color="#0e0f12"/></linearGradient>
<linearGradient id="${u}-bkv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4f57"/><stop offset=".5" stop-color="#2a2e34"/><stop offset="1" stop-color="#121418"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfeff"/><stop offset=".35" stop-color="#8f969e"/><stop offset=".55" stop-color="#e9ecef"/><stop offset="1" stop-color="#5d636b"/></linearGradient>
<radialGradient id="${u}-rf" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".2" stop-color="#8d949c"/><stop offset=".38" stop-color="#e6e9ec"/><stop offset=".56" stop-color="#7d848c"/><stop offset=".74" stop-color="#dfe3e7"/><stop offset=".9" stop-color="#6c737b"/><stop offset="1" stop-color="#c4c9ce"/></radialGradient>
<radialGradient id="${u}-hr" cx=".5" cy=".55" r=".62"><stop offset="0" stop-color="#fff0c4"/><stop offset=".3" stop-color="#ffae4a"/><stop offset=".72" stop-color="#ff5a1a" stop-opacity=".9"/><stop offset="1" stop-color="#a8240a" stop-opacity=".75"/></radialGradient>
<radialGradient id="${u}-hh"><stop offset="0" stop-color="#ff9a4a" stop-opacity=".75"/><stop offset=".45" stop-color="#ff7a2a" stop-opacity=".28"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-ht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a1a"/><stop offset=".5" stop-color="#fff2c8"/><stop offset="1" stop-color="#ff5a1a"/></linearGradient>
<linearGradient id="${u}-tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#b9c1ca" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient>
<radialGradient id="${u}-fl"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".55"/><stop offset=".5" stop-color="#ff8a3d" stop-opacity=".18"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-col" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb070" stop-opacity=".26"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".34"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fo" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${fe}" stop-opacity=".95"/><stop offset=".55" stop-color="${F}" stop-opacity=".75"/><stop offset="1" stop-color="${F}" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${fm}"/><stop offset=".6" stop-color="${fm}" stop-opacity=".8"/><stop offset="1" stop-color="${fm}" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-fc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${fc}"/><stop offset=".7" stop-color="${fc}" stop-opacity=".7"/><stop offset="1" stop-color="${fc}" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-fg"><stop offset="0" stop-color="${fm}" stop-opacity=".6"/><stop offset=".5" stop-color="${F}" stop-opacity=".2"/><stop offset="1" stop-color="${F}" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-fw" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${F}" stop-opacity=".28"/><stop offset="1" stop-color="${F}" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a40"/><stop offset=".5" stop-color="#6a4428"/><stop offset="1" stop-color="#2e1a0e"/></linearGradient>
<linearGradient id="${u}-mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8996a"/><stop offset=".5" stop-color="#9a6c44"/><stop offset="1" stop-color="#5e3d22"/></linearGradient>
<linearGradient id="${u}-cn" x1="0" x2="1"><stop offset="0" stop-color="#6e6b68"/><stop offset=".3" stop-color="#bdb8b2"/><stop offset=".65" stop-color="#97928c"/><stop offset="1" stop-color="#4c4946"/></linearGradient>
<linearGradient id="${u}-tw" x1="0" x2="1"><stop offset="0" stop-color="#7fa6bd"/><stop offset=".4" stop-color="#b6d2e1"/><stop offset="1" stop-color="#5f869e"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-kn" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#f2f4f6"/><stop offset=".55" stop-color="#9aa1a9"/><stop offset="1" stop-color="#4a5058"/></radialGradient>
<pattern id="${u}-hx" width="7" height="12" patternUnits="userSpaceOnUse"><path d="M3.5 0L7 2V6L3.5 8L0 6V2Z M3.5 8V12 M0 6L-3.5 8 M7 6L10.5 8" fill="none" stroke="#1d1719" stroke-width="1.5"/></pattern>
<pattern id="${u}-sl" width="6" height="4" patternUnits="userSpaceOnUse"><rect y="1.6" width="6" height=".7" fill="#fff" fill-opacity=".16"/><rect width="6" height="1.8" fill="#000" fill-opacity=".62"/></pattern>
<pattern id="${u}-vs" width="5" height="6" patternUnits="userSpaceOnUse"><rect width="2.6" height="6" fill="${p.m}"/><rect width=".7" height="6" fill="#fff" fill-opacity=".35"/></pattern>
<pattern id="${u}-hs" width="6" height="5" patternUnits="userSpaceOnUse"><rect width="6" height="2.6" fill="${p.d}"/><rect width="6" height=".6" fill="#fff" fill-opacity=".3"/></pattern>
<pattern id="${u}-pf" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0H5V5H0Z M2.5 1.2A1.3 1.3 0 1 0 2.501 1.2Z" fill-rule="evenodd" fill="${p.m}"/></pattern>
<pattern id="${u}-ms" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H4M0 0V4" stroke="#1d1a1a" stroke-width=".9"/></pattern>
<pattern id="${u}-ls" width="44" height="12" patternUnits="userSpaceOnUse"><rect width="44" height="12" fill="#6d6863"/><rect x=".5" y=".5" width="20" height="5" fill="#8e8882"/><rect x="21.5" y=".5" width="22" height="5" fill="#7a746e"/><rect x=".5" y="6.5" width="12" height="5" fill="#76706a"/><rect x="13.5" y="6.5" width="18" height="5" fill="#948e88"/><rect x="32.5" y="6.5" width="11" height="5" fill="#827c76"/></pattern>
<pattern id="${u}-gr" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".6"/></pattern>
</defs>`;
  }
  const svg = (o, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2.5}" stroke-linecap="round"/>`;
  const circ = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;

  function bx(o, x, y, w, h, r, fill) {
    const u = o.uid, d = rr(x, y, w, h, r);
    return `<path d="${d}" fill="${fill || `url(#${u}-v)`}"/><path d="${d}" fill="url(#${u}-fx)"/><path d="${d}" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".8"/>` +
      `<path d="M${x + r} ${y + 1.2}H${x + w - r}" stroke="#fff" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/>`;
  }
  const knob = (o, x, y, r, a) => { const t = (a == null ? -40 + 80 * o.level : a) * Math.PI / 180;
    return `<circle cx="${x}" cy="${y + .8}" r="${r + .8}" fill="#000" fill-opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${o.uid}-kn)"/><circle cx="${x}" cy="${y}" r="${n1(r * .62)}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width=".7"/>` +
      `<path d="M${x} ${y}L${n1(x + Math.sin(t) * r * .8)} ${n1(y - Math.cos(t) * r * .8)}" stroke="#2a2e35" stroke-width="1.2" stroke-linecap="round"/>`; };
  const led = (o, x, y, c) => o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="6" fill="url(#${o.uid}-hh)"/><circle cx="${x}" cy="${y}" r="1.7" fill="${c || "#ffb347"}"/><circle cx="${x - .5}" cy="${y - .5}" r=".6" fill="#fff"/>` : `<circle cx="${x}" cy="${y}" r="1.7" fill="#4a3a36"/>`;
  const digits = (o, x, y, s) => o.on ? `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="${s}" fill="${HOT}">${tmp(o)}°</text>` : "";
  const wall = (y) => `<g class="hda-bg"><rect x="4" y="4" width="192" height="${y - 4}" rx="6" fill="#fff" fill-opacity=".035"/><path d="M4 ${y}H196" stroke="#fff" stroke-opacity=".12"/></g>`;
  const floorGlow = (o, cx, cy, rx, ry, fire) => o.on ? `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 10}" fill="url(#${o.uid}-${fire ? "fg" : "fl"})" opacity="${g2(o)}"/>` : "";
  const wallGlow = (o, x, y, w, h, fire) => o.on ? `<ellipse class="hda-bg" cx="${x + w / 2}" cy="${y + h}" rx="${w / 2 + 10}" ry="${h}" fill="url(#${o.uid}-${fire ? "fg" : "fl"})" opacity="${g2(o, .8)}"/>` : "";
  const glass = (o, d, x, y, w, h) => `<path d="${d}" fill="url(#${o.uid}-g)" opacity=".2"/><path d="M${n1(x + w * .1)} ${y + h}L${n1(x + w * .3)} ${y}" stroke="#fff" stroke-opacity=".08" stroke-width="${n1(w * .07)}"/>`;

  function el(o, d, w) {
    let s = `<path d="${d}" fill="none" stroke="#5a4642" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (!o.on) return s + `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="${n1(w * .3)}" stroke-linecap="round"/>`;
    return s + `<g opacity="${g2(o)}"><g class="${P}pulse" style="animation-duration:${dur(o, 3.6, 1.6)}s"><path d="${d}" fill="none" stroke="#ff5a1a" stroke-opacity=".3" stroke-width="${n1(w * 2.8)}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${d}" fill="none" stroke="#ff8a2a" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff1c2" stroke-width="${n1(w * .36)}" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  }
  function hot(o, d, k) {
    const u = o.uid; return `<path d="${d}" fill="url(#${u}-dk)"/>` + (o.on ? `<g opacity="${g2(o, k)}"><path class="${P}pulse" d="${d}" fill="url(#${u}-hr)" style="animation-duration:${dur(o, 3.4, 1.4)}s"/></g>` : "");
  }
  function shimmer(o, x, y, w, h, n) {
    if (!o.on) return ""; n = n || 4; const d = +dur(o, 3.6, 1.6), q = h / 4;
    let s = `<g opacity="${(.45 + .55 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) {
      const xi = x - w / 2 + w * (i + .5) / n, sg = i % 2 ? 1 : -1, del = ((i * .37 * d) % d).toFixed(2);
      const pd = `d="M${n1(xi)} ${y}c${2.4 * sg} ${n1(-q * .5)} ${-2.4 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${-2.4 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${2.4 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${-2.4 * sg} ${n1(-q * .5)} 0 ${n1(-q)}" fill="none" stroke-linecap="round"`;
      s += `<g class="${P}shim" style="animation-duration:${d}s;animation-delay:-${del}s"><path ${pd} stroke="#ffb878" stroke-opacity=".12" stroke-width="4"/><path ${pd} stroke="#ffe2c2" stroke-opacity=".55" stroke-width="1.1" stroke-dasharray="${n1(h * .45)} ${n1(h * .3)}"/></g>`;
    }
    return s + `</g>`;
  }
  const flameD = (cx, by, w, h, ln) => `M${n1(cx - w / 2)} ${by}C${n1(cx - w / 2)} ${n1(by - h * .38)} ${n1(cx - w * .14 + ln * .3)} ${n1(by - h * .55)} ${n1(cx + ln)} ${n1(by - h)}C${n1(cx + w * .12 + ln * .4)} ${n1(by - h * .62)} ${n1(cx + w / 2)} ${n1(by - h * .42)} ${n1(cx + w / 2)} ${by}Q${cx} ${n1(by + w * .14)} ${n1(cx - w / 2)} ${by}Z`;
  function flames(o, x1, x2, by, hm, n, wk) {
    if (!o.on) return ""; const u = o.uid, L = .5 + .5 * o.level, step = (x2 - x1) / n, w0 = step * (wk || 1.55);
    let s = `<ellipse cx="${(x1 + x2) / 2}" cy="${by}" rx="${n1((x2 - x1) / 2 + 8)}" ry="${n1(Math.min(14, hm * .25))}" fill="url(#${u}-fg)" opacity="${g2(o)}"/>`;
    const lay = [["fo", 1, 1, 1.25], ["fm", .64, .72, .95], ["fc", .34, .42, .7]];
    lay.forEach(([gid, wk2, hk, tb], li) => {
      for (let i = 0; i < n; i++) {
        const cx = x1 + step * (i + .5), sv = Math.sin(i * 2.3 + 1), hv = hm * L * (.62 + .38 * sv * sv) * hk, ln = (((i * 37) % 9) - 4) * .9 * (1 - li * .3);
        const d = (tb + (i % 3) * .21).toFixed(2), del = ((i * .29 + li * .17) % 1.2).toFixed(2);
        s += `<path class="${P}flk" d="${flameD(+cx.toFixed(1), by, w0 * wk2, hv, ln)}" fill="url(#${u}-${gid})" style="animation-duration:${d}s;animation-delay:-${del}s"/>`;
      }
    });
    return s;
  }
  function sparks(o, pts) {
    if (!o.on) return ""; const c = H().mix(o.color, "#ffe0a0", .5);
    return pts.map((p, i) => `<circle class="${P}spark" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1}" fill="${c}" style="animation-duration:${(2 + (i % 3) * .5).toFixed(1)}s;animation-delay:-${(i * .7).toFixed(1)}s"/>`).join("");
  }
  function log(o, x1, y1, x2, y2, r) {
    const ec = H().mix(o.color, "#ff6a1a", .5), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#24150b" stroke-width="${2 * r + 1.6}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="#6e4628" stroke-width="${2 * r}" stroke-linecap="round"/>` +
      `<path d="M${n1(x1 + nx * r * .45)} ${n1(y1 + ny * r * .45)}L${n1(x2 + nx * r * .45)} ${n1(y2 + ny * r * .45)}" stroke="#a37346" stroke-width="${n1(r * .5)}" stroke-linecap="round" stroke-opacity=".8"/>` +
      `<path d="M${n1(x1 - nx * r * .4)} ${n1(y1 - ny * r * .4)}L${n1(x2 - nx * r * .4)} ${n1(y2 - ny * r * .4)}" stroke="#2e1a0e" stroke-width="${n1(r * .45)}" stroke-dasharray="5 3 9 4" stroke-opacity=".6"/>` +
      `<circle cx="${x2}" cy="${y2}" r="${r}" fill="#c89a62"/><circle cx="${x2}" cy="${y2}" r="${n1(r * .62)}" fill="none" stroke="#8a5a32" stroke-width=".7"/><circle cx="${x2}" cy="${y2}" r="${n1(r * .28)}" fill="none" stroke="#8a5a32" stroke-width=".6"/>` +
      (o.on ? `<g opacity="${g2(o)}"><path class="${P}emb" d="M${n1(x1 - nx * r * .7)} ${n1(y1 - ny * r * .7)}L${n1(x2 - nx * r * .7)} ${n1(y2 - ny * r * .7)}" stroke="${ec}" stroke-width="${n1(r * .7)}" stroke-dasharray="2 4 1 5" stroke-linecap="round"/></g>` : "");
  }
  function bed(o, x1, x2, y, rows, seed) {
    const h = H(), lit = o.on; let s = "";
    for (let r = 0; r < rows; r++) for (let x = x1 + (r % 2) * 3; x < x2 - 2; x += 6.5) {
      const k = Math.sin((x + r * 13 + (seed || 0)) * 1.7), rx = 3 + k * .8, yy = y - r * 3.2;
      const base = lit ? h.mix(o.color, "#ffffff", .25 + .3 * Math.abs(k)) : h.mix("#7a8088", "#c9ced4", Math.abs(k));
      s += `<ellipse cx="${n1(x)}" cy="${n1(yy)}" rx="${n1(rx)}" ry="2.2" fill="${base}" fill-opacity="${lit ? (.55 + .4 * o.level).toFixed(2) : ".7"}"/><ellipse cx="${n1(x - .8)}" cy="${n1(yy - .8)}" rx="1.1" ry=".6" fill="#fff" fill-opacity=".6"/>`;
    }
    return s;
  }

  const css = `
.hda-heater-shim{opacity:.55}
.hda-anim .hda-heater-shim{animation:hda-heater-shim 2.6s linear infinite}
@keyframes hda-heater-shim{0%{transform:translateY(8px);opacity:0}30%{opacity:.9}100%{transform:translateY(-14px);opacity:0}}
.hda-anim .hda-heater-pulse{animation:hda-heater-pulse 3s ease-in-out infinite}
@keyframes hda-heater-pulse{0%,100%{opacity:1}50%{opacity:.7}}
.hda-heater-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-heater-flk{animation:hda-heater-flk 1.3s ease-in-out infinite}
@keyframes hda-heater-flk{0%,100%{transform:scale(1,1) skewX(0deg)}25%{transform:scale(.93,1.12) skewX(-4deg)}50%{transform:scale(1.05,.88) skewX(2deg)}75%{transform:scale(.96,1.06) skewX(4deg)}}
.hda-anim .hda-heater-emb{animation:hda-heater-emb 2.2s ease-in-out infinite}
@keyframes hda-heater-emb{0%,100%{opacity:.35}50%{opacity:1}}
.hda-heater-spark{opacity:0}
.hda-anim .hda-heater-spark{animation:hda-heater-spark 2.4s ease-out infinite}
@keyframes hda-heater-spark{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-26px);opacity:0}}
.hda-heater-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-heater-spin{animation:hda-heater-spin 1s linear infinite}
@keyframes hda-heater-spin{to{transform:rotate(360deg)}}
.hda-heater-ring{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-heater-ring{animation:hda-heater-ring 2.4s ease-out infinite}
@keyframes hda-heater-ring{0%{transform:scale(.6);opacity:0}25%{opacity:.7}100%{transform:scale(1.35);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-heater-shim,.hda-anim .hda-heater-pulse,.hda-anim .hda-heater-flk,.hda-anim .hda-heater-emb,.hda-anim .hda-heater-spark,.hda-anim .hda-heater-spin,.hda-anim .hda-heater-ring{animation:none!important}}
`;

  const ic = (id, name, first, render, list) => ({ id, name, colors: sw(first, list), picker: true, colorLabel: "Body", render });
  const fi = (id, name, first, render) => ({ id, name, colors: fsw(first), picker: true, colorLabel: "Flame", render });
  const RAIL = ["#c9ced4", "#2f3237", "#c9a34e", "#eceff1", "#8a6a4a"];
  const MET = ["#9aa1a9", "#3b4049", "#8a6a4a", "#5f7a5a", "#eceff1"];
  const INDU = ["#d9a62e", "#b8352c", "#7b838c", "#3b4049", "#4f7a4f"];
  const RETRO = ["#b8352c", "#e6dbc4", "#9fd3c0", "#2f3237", "#e8b04a"];

  const icons = [
    ic("oil", "Oil radiator", WH, (o) => { const u = o.uid; let fd = "", fins = "";
      for (let i = 0; i < 9; i++) { const x = 36 + i * 11.6; fd += rr(x, 46, 9.6, 114, 4.8) + " ";
        fins += `<path d="${rr(x, 46, 9.6, 114, 4.8)}" fill="url(#${u}-c)"/><path d="M${n1(x + 2.6)} 53V153" stroke="#fff" stroke-opacity=".38" stroke-width="1.1" stroke-linecap="round"/><path d="M${n1(x + .4)} 100H${n1(x + 9.2)}" stroke="#000" stroke-opacity=".12" stroke-width=".8"/>`; }
      return svg(o, sh(o, 100, 180, 72, 6) + floorGlow(o, 100, 178, 78, 12) +
      `<rect x="38" y="58" width="104" height="5" fill="url(#${u}-sd)"/><rect x="38" y="143" width="104" height="5" fill="url(#${u}-sd)"/>` + fins +
      (o.on ? `<g opacity="${g2(o, .45)}"><path class="${P}pulse" d="${fd}" fill="url(#${u}-hh)"/></g>` : "") +
      bx(o, 141, 62, 24, 86, 5) + knob(o, 153, 80, 6.5) + knob(o, 153, 103, 4.6, 30) +
      `<path d="${rr(147, 116, 12, 16, 2)}" fill="#14171c"/><path d="M149 124H157" stroke="#fff" stroke-opacity=".25" stroke-width="1"/>` + led(o, 153, 139) +
      `<rect x="46" y="158" width="34" height="5" rx="2.5" fill="#24282e"/><rect x="104" y="158" width="34" height="5" rx="2.5" fill="#24282e"/>` +
      [52, 74, 110, 132].map((x) => `<rect x="${x - 2}" y="161" width="4" height="7" fill="#2b2f35"/><circle cx="${x}" cy="172" r="5" fill="#16181c"/><circle cx="${x}" cy="172" r="2.2" fill="url(#${u}-st)"/>`).join("") +
      shimmer(o, 88, 42, 96, 34, 6)); }),

    ic("cube", "Ceramic cube", CH, (o) => { const u = o.uid, gd = rr(66, 88, 68, 52, 8); return svg(o, sh(o, 100, 176, 50, 6) + floorGlow(o, 100, 180, 70, 12) +
      `<rect x="64" y="166" width="14" height="6" rx="3" fill="#15171b"/><rect x="122" y="166" width="14" height="6" rx="3" fill="#15171b"/>` +
      bx(o, 56, 62, 88, 108, 16) + `<path d="${rr(56, 62, 88, 30, 16)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<path d="${rr(82, 70, 36, 8, 4)}" fill="#0d0b0c"/><path d="M85 77.4H115" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>` +
      `<path d="${rr(63, 85, 74, 58, 10)}" fill="#000" fill-opacity=".35"/>` + hot(o, gd) + `<path d="${gd}" fill="url(#${u}-hx)"/>` +
      `<path d="${gd}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>` + glass(o, gd, 66, 88, 68, 52) +
      knob(o, 80, 156, 6) + knob(o, 120, 156, 6, 0) + led(o, 100, 156) +
      hl(60, 80, 60, 158, 2, .25) + shimmer(o, 100, 60, 64, 34, 4)); }),

    ic("tower", "Ceramic tower", GR, (o) => { const u = o.uid, gd = rr(84, 64, 32, 90, 10); return svg(o, sh(o, 100, 178, 44, 6) + floorGlow(o, 100, 180, 64, 12) +
      `<ellipse cx="100" cy="172" rx="34" ry="7" fill="#15171b"/><ellipse cx="100" cy="169" rx="32" ry="6" fill="url(#${u}-bk)"/><path d="M70 169A30 5 0 0 1 130 169" fill="none" stroke="#fff" stroke-opacity=".25"/>` +
      `<path d="${rr(74, 24, 52, 146, 24)}" fill="url(#${u}-c)"/><path d="${rr(74, 24, 52, 146, 24)}" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".8"/>` +
      `<path d="${rr(82, 34, 36, 18, 7)}" fill="#0f1114"/>` + digits(o, 100, 46.5, 9.5) + (o.on ? "" : `<path d="M92 43H108" stroke="#2c3036" stroke-width="2"/>`) +
      `<circle cx="88" cy="58" r="1.6" fill="#000" fill-opacity=".35"/><circle cx="100" cy="58" r="1.6" fill="#000" fill-opacity=".35"/><circle cx="112" cy="58" r="1.6" fill="#000" fill-opacity=".35"/>` +
      hot(o, gd) + `<path d="${gd}" fill="url(#${u}-vs)"/><path d="${gd}" fill="none" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="M80 40Q80 30 90 27" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>` + hl(79, 62, 79, 160, 2.4, .28) +
      shimmer(o, 100, 24, 40, 22, 3)); }),

    ic("dish", "Parabolic dish", GR, (o) => { const u = o.uid; let sp = "";
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; sp += `M${n1(100 + Math.cos(a) * 7)} ${n1(82 + Math.sin(a) * 7)}L${n1(100 + Math.cos(a) * 53)} ${n1(82 + Math.sin(a) * 53)}`; }
      return svg(o, sh(o, 100, 180, 54, 6) + floorGlow(o, 100, 176, 84, 14) +
      `<path d="M100 148L62 178M100 148L138 178M100 148L100 182" stroke="#1d2025" stroke-width="5" stroke-linecap="round"/><path d="M100 148L62 178M100 148L138 178" stroke="url(#${u}-st)" stroke-width="2.6" stroke-linecap="round"/>` +
      `<rect x="96" y="128" width="8" height="22" fill="url(#${u}-st)"/><path d="${rr(90, 132, 20, 8, 3)}" fill="url(#${u}-c)"/>` +
      `<circle cx="100" cy="82" r="60" fill="url(#${u}-c)"/><circle cx="100" cy="82" r="55" fill="url(#${u}-rf)"/>` +
      (o.on ? `<g opacity="${g2(o, .9)}"><circle class="${P}pulse" cx="100" cy="82" r="55" fill="url(#${u}-hh)"/></g>` : "") +
      el(o, `${circ(100, 82, 15)}${circ(100, 82, 10.5)}${circ(100, 82, 6)}`, 2.4) + `<circle cx="100" cy="82" r="3" fill="url(#${u}-kn)"/>` +
      `<path d="${sp}" stroke="#d8dde2" stroke-opacity=".75" stroke-width=".8"/><circle cx="100" cy="82" r="53" fill="none" stroke="#d8dde2" stroke-width="1.6"/><circle cx="100" cy="82" r="36" fill="none" stroke="#d8dde2" stroke-opacity=".75" stroke-width=".9"/><circle cx="100" cy="82" r="20" fill="none" stroke="#d8dde2" stroke-opacity=".7" stroke-width=".8"/>` +
      `<path d="M52 56A56 56 0 0 1 112 26" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      knob(o, 100, 136, 3.4) + shimmer(o, 100, 22, 70, 18, 5)); }),

    ic("quartz", "Quartz tubes", CH, (o) => { const u = o.uid; let t = "";
      [88, 100, 112].forEach((y, i) => { t += `<rect x="38" y="${y - 3.5}" width="110" height="7" rx="3.5" fill="#2a1f1e"/>` +
        (o.on ? `<g opacity="${g2(o)}"><g class="${P}pulse" style="animation-delay:-${i * .8}s"><rect x="34" y="${y - 9}" width="118" height="18" rx="9" fill="url(#${u}-hh)"/><rect x="39" y="${y - 2.6}" width="108" height="5.2" rx="2.6" fill="url(#${u}-ht)"/></g></g>` : `<path d="M40 ${y}H146" stroke="#7a5a50" stroke-width="1.2" stroke-dasharray="1.2 1"/>`) +
        `<rect x="38" y="${y - 3.5}" width="110" height="7" rx="3.5" fill="url(#${u}-tg)"/><rect x="35" y="${y - 4}" width="5" height="8" rx="1" fill="#c9a34e"/><rect x="146" y="${y - 4}" width="5" height="8" rx="1" fill="#c9a34e"/>`; });
      let gv = ""; for (let x = 42; x <= 146; x += 8) gv += `M${x} 76V124`;
      return svg(o, sh(o, 100, 178, 70, 6) + floorGlow(o, 96, 174, 86, 14) +
      `<path d="M44 132L36 172M150 132L158 172" stroke="#1d2025" stroke-width="5" stroke-linecap="round"/><rect x="26" y="170" width="22" height="5" rx="2.5" fill="#1d2025"/><rect x="146" y="170" width="22" height="5" rx="2.5" fill="#1d2025"/>` +
      `<path d="M72 64Q72 48 100 48Q128 48 128 64" fill="none" stroke="#1a1d22" stroke-width="5" stroke-linecap="round"/><path d="M72 64Q72 48 100 48Q128 48 128 64" fill="none" stroke="url(#${u}-st)" stroke-width="3"/>` +
      bx(o, 26, 62, 148, 72, 9) + `<path d="${rr(33, 72, 120, 56, 4)}" fill="url(#${u}-cr)"/><path d="${rr(33, 72, 120, 56, 4)}" fill="#000" fill-opacity=".18"/>` + t +
      `<path d="${gv}" stroke="#cfd5db" stroke-opacity=".8" stroke-width=".9"/><path d="${rr(33, 72, 120, 56, 4)}" fill="none" stroke="#000" stroke-opacity=".4"/>` +
      knob(o, 163, 88, 5) + knob(o, 163, 110, 4, 20) + led(o, 163, 124) + shimmer(o, 92, 60, 100, 26, 6)); }),

    ic("utility", "Garage utility", YE, (o) => { const u = o.uid, cx = 90, cy = 102; let rib = "", bl = "", sp = "";
      for (let i = 0; i < 7; i++) rib += `<path d="M${136 + i * 2.6} ${n1(60 - i * 1.9)}V${n1(148 - i * 1.9)}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
      for (let i = 0; i < 4; i++) { const a = i * 90; bl += `<path d="M${cx} ${cy}C${cx + 4} ${cy - 10} ${cx + 18} ${cy - 22} ${cx + 8} ${cy - 27}C${cx - 2} ${cy - 22} ${cx - 3} ${cy - 10} ${cx} ${cy}Z" fill="#3a3f46" transform="rotate(${a} ${cx} ${cy})"/>`; }
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; sp += `M${n1(cx + Math.cos(a) * 6)} ${n1(cy + Math.sin(a) * 6)}L${n1(cx + Math.cos(a) * 34)} ${n1(cy + Math.sin(a) * 34)}`; }
      return svg(o, sh(o, 100, 180, 70, 6) + floorGlow(o, 84, 176, 80, 14) +
      `<path d="M40 102V174M160 92V174" stroke="#1d2025" stroke-width="5"/><path d="M40 102V174M160 92V174" stroke="url(#${u}-st)" stroke-width="2.6"/><rect x="30" y="172" width="140" height="6" rx="3" fill="#1d2025"/>` +
      `<path d="M48 54L68 40H156L134 54Z" fill="url(#${u}-tp)"/><path d="M134 54L156 40V136L134 150Z" fill="url(#${u}-sd)"/>` + rib +
      bx(o, 46, 54, 90, 96, 4) + `<path d="M64 47H128" stroke="#15171b" stroke-width="5" stroke-linecap="round"/><path d="M64 46H128" stroke="url(#${u}-st)" stroke-width="2.4" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="38" fill="#000" fill-opacity=".3"/><circle cx="${cx}" cy="${cy}" r="36" fill="url(#${u}-dk)"/>` +
      (o.on ? `<g opacity="${g2(o)}"><circle class="${P}pulse" cx="${cx}" cy="${cy}" r="36" fill="url(#${u}-hh)"/></g>` : "") +
      el(o, `${circ(cx, cy, 29)}${circ(cx, cy, 23)}`, 2.2) +
      `<g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, 1.2, .9)}s">${bl}<circle cx="${cx}" cy="${cy}" r="27" fill="none" stroke="none"/></g>` +
      `<circle cx="${cx}" cy="${cy}" r="6" fill="url(#${u}-kn)"/><path d="${sp}" stroke="#cfd5db" stroke-opacity=".8" stroke-width=".9"/>` +
      `<circle cx="${cx}" cy="${cy}" r="35" fill="none" stroke="#cfd5db" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="#cfd5db" stroke-opacity=".8" stroke-width=".9"/><circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="#cfd5db" stroke-opacity=".7" stroke-width=".8"/>` +
      `<circle cx="42" cy="102" r="5" fill="url(#${u}-kn)"/><circle cx="158" cy="92" r="5" fill="url(#${u}-kn)"/>` + knob(o, 145, 120, 4.6) + led(o, 145, 136) +
      shimmer(o, 90, 52, 70, 30, 5)); }, INDU),

    ic("baseboard", "Baseboard", WH, (o) => { const u = o.uid; return svg(o, wall(164) + wallGlow(o, 22, 64, 156, 66) +
      `<path d="${rr(150, 98, 14, 20, 2)}" fill="#e7e9ec" fill-opacity=".55"/><rect x="155" y="102" width="4" height="4" rx="1" fill="#000" fill-opacity=".5"/><rect x="155" y="110" width="4" height="4" rx="1" fill="#000" fill-opacity=".5"/>` +
      sh(o, 100, 166, 92, 4) + floorGlow(o, 100, 172, 92, 12) +
      `<path d="${rr(12, 124, 14, 42, 3)}" fill="url(#${u}-sd)"/><path d="${rr(174, 124, 14, 42, 3)}" fill="url(#${u}-sd)"/>` +
      bx(o, 22, 128, 156, 36, 3) + `<rect x="28" y="131" width="144" height="7" fill="url(#${u}-dk)"/>` +
      (o.on ? `<g opacity="${g2(o, .8)}"><rect class="${P}pulse" x="28" y="131" width="144" height="7" fill="url(#${u}-hr)"/></g>` : "") +
      `<rect x="28" y="131" width="144" height="7" fill="url(#${u}-sl)"/><rect x="28" y="156" width="144" height="4" fill="url(#${u}-sl)"/>` +
      hl(26, 142, 172, 142, 1.2, .3) + knob(o, 181, 140, 3.6) + `<path d="M174 150H188" stroke="#000" stroke-opacity=".2"/>` +
      shimmer(o, 100, 126, 148, 48, 7)); }),

    ic("panel", "Wall panel", WH, (o) => { const u = o.uid, d = rr(34, 44, 132, 94, 8); return svg(o, wall(176) + wallGlow(o, 34, 6, 132, 40) +
      `<path d="${rr(37, 49, 132, 94, 8)}" fill="#000" fill-opacity=".35"/>` + bx(o, 34, 44, 132, 94, 8) +
      `<path d="${rr(42, 48, 116, 6, 3)}" fill="url(#${u}-sl)"/><path d="${rr(42, 128, 116, 5, 2.5)}" fill="url(#${u}-sl)"/>` +
      `<path d="M34 64L84 44H106L34 104Z" fill="#fff" fill-opacity=".1"/><path d="M34 112L120 44H128L34 120Z" fill="#fff" fill-opacity=".06"/>` +
      (o.on ? `<g opacity="${g2(o, .3)}"><path class="${P}pulse" d="${d}" fill="url(#${u}-hh)"/></g>` : "") +
      `<path d="${rr(126, 112, 30, 12, 3)}" fill="#0f1114"/>` + digits(o, 141, 121.5, 8.5) + led(o, 47, 118) +
      `<path d="M150 138C152 156 168 158 172 170" fill="none" stroke="#e6e8eb" stroke-opacity=".5" stroke-width="2"/><path d="${rr(166, 164, 12, 10, 2)}" fill="#e7e9ec" fill-opacity=".4"/>` +
      floorGlow(o, 100, 182, 70, 8) + shimmer(o, 100, 42, 116, 34, 6)); }),

    fi("insert", "Fireplace insert", "#ff8a2a", (o) => { const u = o.uid, ib = rr(52, 82, 96, 72, 2); return svg(o,
      `<rect x="22" y="44" width="156" height="128" fill="url(#${u}-ls)"/><rect x="22" y="44" width="156" height="128" fill="url(#${u}-fx)"/><rect x="22" y="44" width="156" height="128" fill="#000" fill-opacity=".15"/>` +
      `<path d="${rr(14, 32, 172, 13, 2)}" fill="url(#${u}-mw)"/><path d="${rr(14, 32, 172, 13, 2)}" fill="url(#${u}-gr)"/><path d="M16 33.2H184" stroke="#fff" stroke-opacity=".35"/><rect x="18" y="45" width="164" height="3" fill="#000" fill-opacity=".35"/>` +
      `<path d="${rr(44, 74, 112, 88, 3)}" fill="url(#${u}-bk)"/>` + `<path d="${ib}" fill="url(#${u}-dk)"/>` +
      `<path d="M52 98H148M52 114H148M52 130H148M76 82V98M100 98V114M124 82V98M88 114V130M112 114V130" stroke="#fff" stroke-opacity=".05"/>` +
      (o.on ? `<g opacity="${g2(o, .8)}"><rect class="${P}pulse" x="52" y="82" width="96" height="72" fill="url(#${u}-fg)"/></g>` : "") +
      flames(o, 62, 138, 140, 50, 6) + log(o, 60, 146, 128, 140, 5) + log(o, 140, 147, 78, 141, 4.5) + bed(o, 56, 146, 152, 1, 3) +
      glass(o, ib, 52, 82, 96, 72) + `<path d="${ib}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/>` +
      `<rect x="10" y="170" width="180" height="10" fill="url(#${u}-ls)"/><path d="M10 170H190" stroke="#fff" stroke-opacity=".3"/>` + floorGlow(o, 100, 172, 70, 8, 1) +
      sh(o, 100, 184, 92, 4)); }),

    fi("stove", "Stove heater", "#ff8a2a", (o) => { const u = o.uid, win = "M74 136V100Q74 86 100 86Q126 86 126 100V136Z"; return svg(o,
      `<path d="${rr(28, 170, 144, 10, 2)}" fill="#2a2d33"/><path d="M30 170.6H170" stroke="#fff" stroke-opacity=".18"/>` + floorGlow(o, 100, 172, 72, 10, 1) +
      `<rect x="92" y="4" width="16" height="52" fill="url(#${u}-bk)"/><rect x="89" y="40" width="22" height="5" rx="1" fill="url(#${u}-bk)"/>` +
      `<path d="M62 156Q60 168 56 172M138 156Q140 168 144 172" stroke="#15171b" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="${rr(54, 64, 92, 94, 6)}" fill="url(#${u}-bk)"/><path d="${rr(46, 54, 108, 10, 2)}" fill="url(#${u}-bkv)"/><path d="M48 55H152" stroke="#fff" stroke-opacity=".25"/>` +
      `<path d="${rr(50, 152, 100, 8, 2)}" fill="url(#${u}-bkv)"/>` +
      `<path d="M66 142V100Q66 80 100 80Q134 80 134 100V142Z" fill="#101114"/><path d="M66 142V100Q66 80 100 80Q134 80 134 100V142Z" fill="none" stroke="#5a5f67" stroke-width="1"/>` +
      `<path d="${win}" fill="url(#${u}-dk)"/>` + (o.on ? `<g opacity="${g2(o)}"><path class="${P}pulse" d="${win}" fill="url(#${u}-fg)"/></g>` : "") +
      flames(o, 80, 120, 128, 38, 4) + log(o, 78, 132, 116, 128, 4) + log(o, 122, 133, 86, 129, 3.6) + sparks(o, [[92, 116], [104, 120, 1.2], [110, 112], [98, 122]]) +
      glass(o, win, 74, 86, 52, 50) + `<path d="${win}" fill="none" stroke="#000" stroke-opacity=".7" stroke-width="1.6"/>` +
      `<path d="M138 98V124" stroke="#15171b" stroke-width="4" stroke-linecap="round"/><path d="M138 98V124" stroke="url(#${u}-st)" stroke-width="2" stroke-dasharray="1.6 1" stroke-linecap="round"/>` +
      `<path d="M62 70H138" stroke="#fff" stroke-opacity=".12"/>` + hl(58, 72, 58, 150, 1.8, .2)); }),

    fi("linear", "Linear wall fire", "#4da3ff", (o) => { const u = o.uid, ib = rr(18, 84, 164, 42, 2); return svg(o, wall(176) + wallGlow(o, 14, 20, 172, 58, 1) +
      `<path d="${rr(14, 82, 176, 56, 4)}" fill="#000" fill-opacity=".35"/><path d="${rr(12, 78, 176, 54, 4)}" fill="url(#${u}-bkv)"/>` + `<path d="${ib}" fill="url(#${u}-dk)"/>` +
      (o.on ? `<g opacity="${g2(o, .7)}"><rect class="${P}pulse" x="18" y="84" width="164" height="42" fill="url(#${u}-fg)"/></g>` : "") +
      flames(o, 24, 176, 118, 30, 11, 1.8) + bed(o, 22, 180, 124, 2, 7) +
      glass(o, ib, 18, 84, 164, 42) + `<path d="${ib}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.2"/><path d="M14 79.2H186" stroke="#fff" stroke-opacity=".3"/>` +
      led(o, 172, 129.5, o.color) + `<rect x="162" y="128" width="4" height="3" rx="1" fill="#5a5f67"/>` + floorGlow(o, 100, 178, 88, 10, 1)); }),

    ic("patio", "Patio heater", GR, (o) => { const u = o.uid, em = rr(86, 46, 28, 30, 3); let dots = "";
      if (o.on) for (let i = 0; i < 9; i++) dots += `<circle class="${P}emb" cx="${89 + (i * 7) % 22}" cy="${50 + (i * 11) % 24}" r="1" fill="#ffe0a0" style="animation-delay:-${(i * .4).toFixed(1)}s"/>`;
      return svg(o, (o.on ? `<path d="M34 46L10 178H190L166 46Z" fill="url(#${u}-cone)" opacity="${g2(o)}"/>` : "") + sh(o, 100, 182, 50, 5) + floorGlow(o, 100, 178, 90, 12) +
      `<path d="M22 42Q100 4 178 42Z" fill="url(#${u}-c)"/><path d="M40 36Q100 10 140 22" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="42" rx="78" ry="5" fill="url(#${u}-sd)"/><ellipse cx="100" cy="43" rx="74" ry="3" fill="#0f1114"/>` + (o.on ? `<ellipse cx="100" cy="43" rx="60" ry="3" fill="#ff8a3d" opacity="${g2(o, .5)}"/>` : "") +
      `<circle cx="100" cy="12" r="4" fill="url(#${u}-kn)"/>` +
      (o.on ? `<g opacity="${g2(o)}"><circle class="${P}pulse" cx="100" cy="62" r="40" fill="url(#${u}-hh)"/></g>` : "") +
      hot(o, em, 1) + `<path d="${em}" fill="url(#${u}-ms)"/>` + dots + `<path d="${em}" fill="none" stroke="url(#${u}-st)" stroke-width="1.6"/>` +
      `<rect x="96" y="76" width="8" height="70" fill="url(#${u}-c)"/><rect x="93" y="76" width="14" height="4" rx="1" fill="url(#${u}-c)"/>` +
      `<path d="M78 178L84 142H116L122 178Z" fill="url(#${u}-c)"/><path d="M78 178L84 142H116L122 178Z" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".8"/>` +
      `<path d="M90 150H110V170H90Z" fill="#000" fill-opacity=".15"/><path d="M90 150H110" stroke="#fff" stroke-opacity=".25"/>` + knob(o, 100, 160, 4) +
      `<path d="${rr(70, 176, 60, 6, 3)}" fill="url(#${u}-sd)"/>`); }, MET),

    fi("bowl", "Tabletop fire bowl", "#ffb84a", (o) => { const u = o.uid; return svg(o,
      `<g class="hda-bg"><rect x="6" y="150" width="188" height="12" rx="2" fill="url(#${u}-mw)"/><rect x="6" y="150" width="188" height="12" rx="2" fill="url(#${u}-gr)"/><path d="M8 150.6H192" stroke="#fff" stroke-opacity=".3"/><rect x="6" y="162" width="188" height="5" fill="#000" fill-opacity=".35"/></g>` +
      floorGlow(o, 100, 152, 90, 10, 1) + sh(o, 100, 151, 56, 4) +
      `<ellipse cx="100" cy="104" rx="62" ry="12" fill="#5a5753"/><ellipse cx="100" cy="105" rx="56" ry="9" fill="#262422"/>` +
      bed(o, 50, 152, 107, 2, 2) + flames(o, 66, 134, 104, 56, 5, 1.7) + sparks(o, [[86, 76], [104, 70, 1.3], [116, 80], [96, 64]]) +
      `<path d="M38 104Q40 148 72 150H128Q160 148 162 104A62 12 0 0 1 38 104Z" fill="url(#${u}-cn)"/>` +
      `<path d="M38 104A62 12 0 0 0 162 104" fill="none" stroke="#d8d3cc" stroke-width="1.4"/><path d="M46 112Q50 140 74 146" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2.4" stroke-linecap="round"/>` +
      (o.on ? `<path d="M40 106A60 11 0 0 0 160 106" fill="none" stroke="${H().mix(o.color, "#ffe0a0", .4)}" stroke-opacity="${g2(o, .5)}" stroke-width="1.2"/>` : "")); }),

    ic("towel", "Towel warmer", "#c9ced4", (o) => { const u = o.uid; let bars = "", warm = "";
      for (let i = 0; i < 8; i++) { const y = 34 + i * 17; bars += `<rect x="60" y="${y}" width="80" height="5" rx="2.5" fill="url(#${u}-v)"/><path d="M62 ${y + 1.2}H138" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>`; warm += rr(60, y, 80, 5, 2.5) + " "; }
      return svg(o, wall(182) + wallGlow(o, 52, 8, 96, 30) +
      `<path d="M60 32V172M140 32V172" stroke="#000" stroke-opacity=".3" stroke-width="9" transform="translate(3 3)"/>` + bars +
      (o.on ? `<g opacity="${g2(o, .22)}"><path class="${P}pulse" d="${warm}" fill="#ff8a3d"/></g>` : "") +
      `<rect x="54" y="26" width="10" height="150" rx="5" fill="url(#${u}-c)"/><rect x="136" y="26" width="10" height="150" rx="5" fill="url(#${u}-c)"/>` +
      [[59, 22], [141, 22], [59, 178], [141, 178]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="url(#${u}-sd)"/>`).join("") +
      `<path d="M72 70H128V122Q114 128 100 122Q86 116 72 122Z" fill="url(#${u}-tw)"/><path d="M72 70H128V78H72Z" fill="#000" fill-opacity=".14"/><path d="M76 82V118M124 82V120" stroke="#000" stroke-opacity=".12" stroke-width="2"/>` +
      `<path d="M72 110Q86 104 100 110Q114 116 128 110" fill="none" stroke="#e8f2f7" stroke-opacity=".7" stroke-width="1.6"/><path d="M72 114Q86 108 100 114Q114 120 128 114" fill="none" stroke="#e8f2f7" stroke-opacity=".7" stroke-width="1.6"/>` +
      `<path d="M72 67Q100 63 128 67V71H72Z" fill="#cfe2ec"/>` +
      `<path d="M146 164Q160 166 162 158" fill="none" stroke="#d6d9dd" stroke-opacity=".6" stroke-width="2"/><path d="${rr(156, 146, 18, 14, 2)}" fill="#e7e9ec" fill-opacity=".55"/>` + led(o, 165, 153) +
      shimmer(o, 100, 30, 70, 26, 4)); }, RAIL),

    ic("mica", "Mica panel", CH, (o) => { const u = o.uid, fr = rr(54, 54, 92, 92, 6); return svg(o, sh(o, 100, 178, 66, 5) + floorGlow(o, 100, 178, 80, 12) +
      `<path d="M46 174Q62 156 80 174M120 174Q138 156 154 174" fill="none" stroke="#15171b" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M146 42L154 38V156L146 162Z" fill="url(#${u}-sd)"/>` + bx(o, 44, 40, 104, 122, 10) +
      `<path d="${rr(56, 45, 22, 5, 2.5)} ${rr(114, 45, 22, 5, 2.5)}" fill="#0d0b0c"/>` +
      hot(o, fr, .75) + `<path d="${fr}" fill="url(#${u}-pf)"/><path d="${fr}" fill="none" stroke="#000" stroke-opacity=".35"/>` +
      `<path d="${rr(80, 150, 40, 8, 4)}" fill="#0f1114"/>` + led(o, 88, 154) + `<circle cx="100" cy="154" r="1.6" fill="#5a5f67"/><circle cx="110" cy="154" r="1.6" fill="#5a5f67"/>` +
      hl(48, 52, 48, 152, 2, .25) + shimmer(o, 100, 38, 84, 30, 5)); }),

    ic("vintage", "Vintage radiant", RD, (o) => { const u = o.uid, ref = rr(56, 74, 88, 62, 6); let gv = "", rods = "";
      for (let x = 60; x <= 140; x += 8) gv += `M${x} 72V138`;
      [90, 105, 120].forEach((y) => { rods += `<rect x="62" y="${y - 3}" width="76" height="6" rx="3" fill="#e6dccb"/><rect x="62" y="${y - 3}" width="76" height="2" rx="1" fill="#fff" fill-opacity=".5"/>` + el(o, `M64 ${y}H136`, 3.4).replace(/stroke-linecap="round"/g, `stroke-dasharray="1.5 1.2"`); });
      return svg(o, sh(o, 100, 172, 62, 6) + floorGlow(o, 100, 176, 84, 14) +
      `<path d="M66 52Q66 30 100 30Q134 30 134 52" fill="none" stroke="#1a1d22" stroke-width="6" stroke-linecap="round"/><path d="M66 52Q66 30 100 30Q134 30 134 52" fill="none" stroke="url(#${u}-cr)" stroke-width="3.8"/>` +
      `<ellipse cx="60" cy="166" rx="10" ry="5" fill="url(#${u}-kn)"/><ellipse cx="140" cy="166" rx="10" ry="5" fill="url(#${u}-kn)"/>` +
      bx(o, 40, 52, 120, 112, 18) + `<path d="${rr(40, 52, 120, 40, 18)}" fill="url(#${u}-g)" opacity=".35"/>` +
      `<path d="${rr(49, 66, 102, 78, 11)}" fill="url(#${u}-cr)"/><path d="${ref}" fill="url(#${u}-rf)"/>` +
      (o.on ? `<g opacity="${g2(o)}"><path class="${P}pulse" d="${ref}" fill="url(#${u}-hh)"/></g>` : "") + rods +
      `<path d="${gv}" stroke="#eef1f4" stroke-opacity=".85" stroke-width="1"/><path d="${ref}" fill="none" stroke="#000" stroke-opacity=".3"/>` +
      `<path d="M84 150H116" stroke="url(#${u}-cr)" stroke-width="3" stroke-linecap="round"/>` + knob(o, 100, 156, 5) + hl(46, 74, 46, 150, 2, .3)); }, RETRO),

    ic("loop", "Bladeless loop", GR, (o) => { const u = o.uid, ring = `M70 70A30 50 0 1 0 130 70A30 50 0 1 0 70 70ZM78 70A22 42 0 1 1 122 70A22 42 0 1 1 78 70Z`; return svg(o,
      sh(o, 100, 178, 34, 5) + floorGlow(o, 100, 180, 80, 14) +
      (o.on ? `<g opacity="${g2(o)}"><ellipse cx="100" cy="70" rx="22" ry="42" fill="url(#${u}-hh)"/>` +
        [0, 1, 2].map((i) => `<ellipse class="${P}ring" cx="100" cy="70" rx="26" ry="46" fill="none" stroke="#ffb070" stroke-opacity=".5" stroke-width="1.2" style="animation-duration:${dur(o, 3, 1.4)}s;animation-delay:-${i * .8}s"/>`).join("") + `</g>` : "") +
      `<path d="${ring}" fill-rule="evenodd" fill="url(#${u}-c)"/><ellipse cx="100" cy="70" rx="22" ry="42" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>` +
      `<path d="M74 52A28 46 0 0 1 96 22" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>` +
      (o.on ? `<ellipse cx="100" cy="70" rx="22.6" ry="42.6" fill="none" stroke="#ff9a4a" stroke-opacity="${g2(o, .6)}" stroke-width="1.6"/>` : "") +
      `<path d="M82 120V168A18 5 0 0 0 118 168V120Z" fill="url(#${u}-c)"/><ellipse cx="100" cy="120" rx="18" ry="4" fill="url(#${u}-tp)"/>` +
      `<path d="M83 128H117V150H83Z" fill="url(#${u}-pf)"/><path d="M83 128H117V150H83Z" fill="#000" fill-opacity=".15"/>` +
      `<path d="${rr(90, 154, 20, 9, 3)}" fill="#0f1114"/>` + digits(o, 100, 161.5, 7) + hl(86, 124, 86, 166, 1.6, .3) +
      shimmer(o, 100, 24, 40, 18, 3)); }),

    ic("smart", "Smart display", WH, (o) => { const u = o.uid, gd = rr(70, 122, 60, 34, 10), C = 2 * Math.PI * 21; return svg(o, sh(o, 100, 178, 46, 5) + floorGlow(o, 100, 180, 72, 12) +
      `<path d="${rr(64, 168, 72, 8, 4)}" fill="#15171b"/>` + bx(o, 56, 38, 88, 132, 24) + `<path d="${rr(56, 38, 88, 48, 24)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<circle cx="100" cy="82" r="28" fill="#000" fill-opacity=".3"/><circle cx="100" cy="81" r="27" fill="#0d0f12"/><circle cx="100" cy="81" r="21" fill="none" stroke="#252a31" stroke-width="3"/>` +
      (o.on ? `<g opacity="${(.6 + .4 * o.level).toFixed(2)}"><circle class="${P}pulse" cx="100" cy="81" r="30" fill="url(#${u}-hh)"/><circle cx="100" cy="81" r="21" fill="none" stroke="${HOT}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${n1(C * (.15 + .8 * o.level))} ${n1(C)}" transform="rotate(-90 100 81)"/></g>` : "") +
      digits(o, 100, 86, 14) + (o.on ? `<path d="M96 96Q100 92 104 96M97.6 98.4Q100 96.4 102.4 98.4" fill="none" stroke="#7dd3fc" stroke-width=".9" stroke-linecap="round"/>` : "") +
      `<path d="M78 66A27 27 0 0 1 104 54" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="86" cy="114" r="1.8" fill="#000" fill-opacity=".3"/><circle cx="100" cy="114" r="1.8" fill="#000" fill-opacity=".3"/><circle cx="114" cy="114" r="1.8" fill="#000" fill-opacity=".3"/>` +
      hot(o, gd) + `<path d="${gd}" fill="url(#${u}-hs)"/><path d="${gd}" fill="none" stroke="#000" stroke-opacity=".3"/>` +
      hl(60, 64, 60, 150, 2, .25) + shimmer(o, 100, 36, 60, 26, 4)); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "heater", tab: "Space heaters", group: "Air", kind: "device",
    intro: "Eighteen space heaters and electric fireplaces. When on, coils, tubes and ceramic grilles glow orange and pulse, heat shimmer rises, the floor picks up a warm glow, and fireplaces dance with layered flames in the picked flame color; the slider sets the heat output.",
    
    css, icons,
  });
})();
