(function () {
  const P = "hda-dehumidifier-";
  const H = () => window.HDAH;
  const WH = "#eceff1", GR = "#a3abb4", CH = "#3b4049", BE = "#d8c6a2", BL = "#86a9d4", YE = "#f0b52c";
  const SW = [WH, GR, CH, BE, BL];
  const sw = (first) => [first].concat(SW.filter((c) => c !== first));
  const DISP = "#7dd3fc", RED = "#ff5257", GREEN = "#34d399", WARM = "#ffe4c2", ORNG = "#ff9a4a";
  const n1 = (v) => (+v).toFixed(1);
  const full = (o) => o.level < .15;
  const hum = (o) => Math.round(55 - 20 * o.level);
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);

  function pal(c) { const h = H(); return { l: h.shade(c, .55), m: c, d: h.shade(c, -.26), k: h.shade(c, -.5), e: h.shade(c, -.42) }; }
  const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".8"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".28" stop-color="${p.l}"/><stop offset=".62" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".5" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" x2="1"><stop offset="0" stop-color="${p.m}"/><stop offset=".45" stop-color="${p.l}"/><stop offset="1" stop-color="${p.m}"/></linearGradient>
<linearGradient id="${u}-sd" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-fx" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".16" stop-color="#fff" stop-opacity="0"/><stop offset=".82" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-edge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".36"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
<linearGradient id="${u}-dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1116"/><stop offset="1" stop-color="#2c3139"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-stv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2e6ea"/><stop offset=".5" stop-color="#9aa1a9"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfeff"/><stop offset=".35" stop-color="#8f969e"/><stop offset=".55" stop-color="#e9ecef"/><stop offset="1" stop-color="#5d636b"/></linearGradient>
<linearGradient id="${u}-wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fdcff" stop-opacity=".9"/><stop offset="1" stop-color="#2468b8" stop-opacity=".95"/></linearGradient>
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8f1ff" stop-opacity=".34"/><stop offset=".45" stop-color="#d8f1ff" stop-opacity=".04"/><stop offset="1" stop-color="#d8f1ff" stop-opacity=".16"/></linearGradient>
<linearGradient id="${u}-tk" x1="0" x2="1"><stop offset="0" stop-color="#0a1824"/><stop offset=".4" stop-color="#16303f"/><stop offset="1" stop-color="#07121b"/></linearGradient>
<linearGradient id="${u}-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8996a"/><stop offset=".5" stop-color="#a87a4e"/><stop offset="1" stop-color="#6a4528"/></linearGradient>
<linearGradient id="${u}-wh" x1="0" x2="1"><stop offset="0" stop-color="#6e4a2c"/><stop offset=".35" stop-color="#b4845a"/><stop offset=".7" stop-color="#8d6140"/><stop offset="1" stop-color="#5e3d22"/></linearGradient>
<linearGradient id="${u}-col" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffc58a" stop-opacity=".22"/><stop offset="1" stop-color="#ffc58a" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-tire" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#4a4f57"/><stop offset=".7" stop-color="#1c1f24"/><stop offset="1" stop-color="#0b0c0f"/></radialGradient>
${halo(o.uid + "-hb", DISP)}${halo(o.uid + "-hr", RED)}${halo(o.uid + "-hg", GREEN)}${halo(o.uid + "-ho", ORNG)}
<pattern id="${u}-slot" width="6" height="4" patternUnits="userSpaceOnUse"><rect y=".4" width="6" height="1.6" fill="#fff" fill-opacity=".14"/><rect width="6" height="1.6" fill="#000" fill-opacity=".5"/></pattern>
<pattern id="${u}-vs" width="4" height="6" patternUnits="userSpaceOnUse"><rect x=".4" width="1.5" height="6" fill="#fff" fill-opacity=".14"/><rect width="1.5" height="6" fill="#000" fill-opacity=".48"/></pattern>
<pattern id="${u}-mesh" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><circle cx="2.6" cy="2.6" r="1" fill="#fff" fill-opacity=".14"/><circle cx="2.25" cy="2.25" r="1" fill="#000" fill-opacity=".45"/></pattern>
<pattern id="${u}-hex" width="7" height="12" patternUnits="userSpaceOnUse"><path d="M3.5 0L7 2V6L3.5 8L0 6V2Z M3.5 8V12 M0 6L-3.5 8 M7 6L10.5 8" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".9"/></pattern>
<pattern id="${u}-pl" width="7" height="10" patternUnits="userSpaceOnUse"><rect width="3.5" height="10" fill="#f6f7ef"/><rect x="3.5" width="3.5" height="10" fill="#b9bdb3"/><rect x="3.1" width=".7" height="10" fill="#fff"/></pattern>
<pattern id="${u}-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".6"/></pattern>
<pattern id="${u}-hc" width="5.2" height="9" patternUnits="userSpaceOnUse"><path d="M2.6 0L5.2 1.5V4.5L2.6 6L0 4.5V1.5Z M2.6 6V9 M0 4.5L-2.6 6 M5.2 4.5L7.8 6" fill="#d8c79a" stroke="#6b5a35" stroke-width=".7"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2.5}" stroke-linecap="round"/>`;
  const groove = (d) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.1"/>`;
  const cylP = (x1, x2, yt, yb, ry) => `M${x1} ${yt}V${yb}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${yb}V${yt}Z`;
  const band = (x1, x2, y1, y2, ry) => { const rx = (x2 - x1) / 2; return `M${x1} ${y1}V${y2}A${rx} ${ry} 0 0 0 ${x2} ${y2}V${y1}A${rx} ${ry} 0 0 1 ${x1} ${y1}Z`; };
  const arcF = (x1, x2, y, ry) => `M${x1} ${y}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${y}`;

  function box3(o, x, y, w, h, dx, dy) {
    const u = o.uid, e = pal(o.color).e;
    return `<path d="M${x} ${y}L${x + dx} ${y - dy}H${x + w + dx}L${x + w} ${y}Z" fill="url(#${u}-tp)"/>
<path d="M${x + w} ${y}L${x + w + dx} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>
<path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-v)"/><path d="M${x} ${y}H${x + w}V${y + h}H${x}Z" fill="url(#${u}-fx)"/>
<path d="M${x} ${y + h}H${x + w}L${x + w + dx} ${y + h - dy}" fill="none" stroke="${e}" stroke-width=".8"/>
<path d="M${x} ${y + .5}H${x + w}L${x + w + dx} ${y - dy + .5}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>
<path d="M${x + w} ${y}V${y + h}" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>`;
  }
  function louv(o, x, y, w, h, n) {
    const p = pal(o.color), st = h / n; let s = `<path d="${rr(x, y, w, h, Math.min(4, h / 3))}" fill="url(#${o.uid}-dk)"/>`;
    for (let i = 0; i < n; i++) { const yy = y + st * i + st * .3;
      s += `<rect x="${x + 2}" y="${n1(yy)}" width="${w - 4}" height="${n1(st * .5)}" rx="${n1(st * .2)}" fill="${p.m}"/><rect x="${x + 2}" y="${n1(yy)}" width="${w - 4}" height="${n1(st * .16)}" fill="#fff" fill-opacity=".45"/><rect x="${x + 2}" y="${n1(yy + st * .42)}" width="${w - 4}" height="${n1(st * .12)}" fill="#000" fill-opacity=".3"/>`; }
    return s + `<path d="${rr(x, y, w, h, Math.min(4, h / 3))}" fill="url(#${o.uid}-fx)"/>`;
  }
  const area = (o, d, pat) => `<path d="${d}" fill="#000" fill-opacity=".14"/><path d="${d}" fill="url(#${o.uid}-${pat || "mesh"})"/>`;

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", F: "aefg", L: "def" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.7, h * .14), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return SEG[ch].split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  function lcd(o, x, y, h, col) {
    col = col || DISP; const w = h * .56, g = h * .24, t = Math.max(.7, h * .14), x2 = x + w + g, xp = x2 + w + h * .16;
    const pct = (f) => `<g fill="none" stroke="${f}" stroke-width="${n1(t * .6)}"><circle cx="${n1(xp + h * .1)}" cy="${n1(y + h * .2)}" r="${n1(h * .09)}"/><circle cx="${n1(xp + h * .34)}" cy="${n1(y + h * .8)}" r="${n1(h * .09)}"/><path d="M${n1(xp + h * .4)} ${n1(y + h * .06)}L${n1(xp + h * .04)} ${n1(y + h * .94)}"/></g>`;
    let s = `<g fill="#fff" fill-opacity=".06">${dig(x, y, h, 8)}${dig(x2, y, h, 8)}</g>` + pct("rgba(255,255,255,.06)");
    if (!o.on) return s;
    const F = full(o), c = F ? RED : col, v = F ? "FL" : String(hum(o));
    return s + `<g opacity=".16"><ellipse class="${P}pulse" cx="${n1(x + h * .9)}" cy="${n1(y + h / 2)}" rx="${n1(h * 1.5)}" ry="${n1(h * .95)}" fill="${c}"/></g>` +
      `<g fill="${c}">${dig(x, y, h, v[0])}${dig(x2, y, h, v[1])}</g>` + (F ? "" : pct(c));
  }
  function led(o, x, y, r, c, id) {
    r = r || 1.8; c = c || DISP; id = id || "hb";
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#454a52"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".25"/>`;
    return `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 5}" fill="url(#${o.uid}-${id})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .4)}" fill="#fff" fill-opacity=".85"/>`;
  }
  function fullLed(o, x, y, r) {
    r = r || 1.8;
    if (!(o.on && full(o))) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#4a2f33"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".2"/>`;
    return `<g class="${P}blink"><circle cx="${x}" cy="${y}" r="${r + 6}" fill="url(#${o.uid}-hr)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${RED}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .4)}" fill="#ffe1e1"/></g>`;
  }
  const btn = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" fill-opacity=".25"/><circle cx="${x}" cy="${y - .3}" r="${r - .5}" fill="#2a2e35"/><circle cx="${x - r * .25}" cy="${y - r * .35}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".18"/>`;

  const drop = (x, y, s) => `<path d="M${n1(x)} ${n1(y - 3 * s)}C${n1(x + 1.6 * s)} ${n1(y - .6 * s)} ${n1(x + 2 * s)} ${n1(y + .6 * s)} ${n1(x + 2 * s)} ${n1(y + 1.3 * s)}A${n1(2 * s)} ${n1(2 * s)} 0 0 1 ${n1(x - 2 * s)} ${n1(y + 1.3 * s)}C${n1(x - 2 * s)} ${n1(y + .6 * s)} ${n1(x - 1.6 * s)} ${n1(y - .6 * s)} ${n1(x)} ${n1(y - 3 * s)}Z" fill="#bfe8ff"/>`;
  function tank(o, k, d, x, y, w, h, base, opt) {
    opt = opt || {}; const u = o.uid, id = `${u}-tw${k}`, f = full(o) ? .93 : base, wy = y + h * (1 - f), live = o.on && !full(o);
    let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#${u}-tk)"/><g clip-path="url(#${id})">`;
    s += `<g class="${live ? P + "rise" : ""}"><rect x="${x - 2}" y="${n1(wy)}" width="${w + 4}" height="${n1(h * f + 4)}" fill="url(#${u}-wt)"/>` +
      `<rect x="${x - 2}" y="${n1(wy)}" width="${w + 4}" height="1.4" fill="#e6f7ff" fill-opacity=".75"/><rect x="${x - 2}" y="${n1(wy + 1.4)}" width="${w + 4}" height="${n1(h * .12)}" fill="#fff" fill-opacity=".12"/></g>`;
    if (live) {
      const n = opt.drops || 2;
      for (let i = 0; i < n; i++) { const dx = x + w * (i + 1) / (n + 1) + (i % 2 ? 2 : -2), sy = Math.max(y + 3, wy - 15);
        s += `<g class="${P}drip" style="animation-delay:-${(i * .9).toFixed(1)}s">${drop(dx, sy, opt.ds || .9)}</g>`; }
      s += `<ellipse class="${P}ripple" cx="${n1(x + w * .5)}" cy="${n1(wy + .6)}" rx="${n1(Math.min(8, w * .2))}" ry="1.2" fill="none" stroke="#e6f7ff" stroke-width=".7"/>`;
    }
    s += `</g>`;
    if (!opt.noTicks) s += [.25, .5, .75].map((t) => `<path d="M${x + 1.5} ${n1(y + h * (1 - t))}h${n1(Math.min(5, w * .14))}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`).join("") +
      `<path d="M${x + 1.5} ${n1(y + h * .07)}h${n1(Math.min(9, w * .26))}" stroke="${RED}" stroke-opacity=".7" stroke-width=".8"/>`;
    return s + `<path d="${d}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".3" stroke-width=".9"/>`;
  }

  function heat(o, x, y, a) {
    if (!o.on) return ""; a = a || {};
    const n = a.n || 4, w = a.w || 50, h = a.h || 30, d = +dur(o, 3.4, 2);
    let s = `<g transform="translate(${x} ${y})${a.rot ? ` rotate(${a.rot})` : ""}"><path d="M${-w / 2} 0L${w / 2} 0L${w / 2 + 6} ${-h}L${-w / 2 - 6} ${-h}Z" fill="url(#${o.uid}-col)" opacity="${(.5 + .5 * o.level).toFixed(2)}"/>`;
    for (let i = 0; i < n; i++) {
      const xi = -w / 2 + w * (i + .5) / n, q = h / 4, sg = i % 2 ? 1 : -1, del = ((i * .41 * d) % d).toFixed(2);
      const pd = `d="M${n1(xi)} -1q${1.8 * sg} ${-q / 2} 0 ${-q}t0 ${-q}t0 ${-q}t0 ${-q}" fill="none" stroke-linecap="round"`;
      s += `<g class="${P}shim" style="animation-duration:${d}s;animation-delay:-${del}s"><path ${pd} stroke="#ffc690" stroke-opacity=".13" stroke-width="3"/><path ${pd} stroke="${WARM}" stroke-opacity=".6" stroke-width="1.1" stroke-dasharray="${n1(h * .5)} ${n1(h * .25)}"/></g>`;
    }
    return s + `</g>`;
  }
  function chase(o, pts, c, r) {
    if (!o.on || full(o) && c !== WARM) return ""; const d = dur(o, 2.6, 1.4);
    return pts.map((p, i) => `<circle class="${P}chase" cx="${p[0]}" cy="${p[1]}" r="${r || 1.6}" fill="${c}" style="animation-duration:${d}s;animation-delay:-${(i / pts.length * d).toFixed(2)}s"/>`).join("");
  }
  function hose(d, c, w, ribs) {
    return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
      (ribs ? `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="${w}" stroke-dasharray="1 2"/>` : "") +
      `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${n1(w * .28)}" stroke-linecap="round"/>`;
  }
  const wheel = (o, x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${o.uid}-tire)"/><circle cx="${x}" cy="${y}" r="${n1(r * .45)}" fill="url(#${o.uid}-st)"/><circle cx="${x}" cy="${y}" r="${n1(r * .14)}" fill="#2a2e35"/>`;
  const caster = (o, x, y) => `<rect x="${x - 4}" y="${y - 7}" width="8" height="5" rx="1.5" fill="#24282e"/>` + wheel(o, x, y, 4.2);
  const foot = (x, y, w) => `<rect x="${x}" y="${y}" width="${w || 10}" height="4" rx="2" fill="#1d2025"/>`;

  const css = `
.hda-dehumidifier-shim{opacity:.6}
.hda-anim .hda-dehumidifier-shim{animation:hda-dehumidifier-shim 2.4s linear infinite}
@keyframes hda-dehumidifier-shim{0%{transform:translateY(7px);opacity:0}35%{opacity:.9}100%{transform:translateY(-9px);opacity:0}}
.hda-dehumidifier-drip{opacity:.8}
.hda-anim .hda-dehumidifier-drip{animation:hda-dehumidifier-drip 1.8s cubic-bezier(.55,0,1,.45) infinite}
@keyframes hda-dehumidifier-drip{0%{transform:translateY(0);opacity:0}12%{opacity:.95}80%{opacity:.95}100%{transform:translateY(14px);opacity:0}}
.hda-dehumidifier-ripple{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-dehumidifier-ripple{animation:hda-dehumidifier-ripple 1.8s ease-out infinite}
@keyframes hda-dehumidifier-ripple{0%,78%{transform:scale(.2);opacity:0}84%{opacity:.8}100%{transform:scale(1.2);opacity:0}}
.hda-dehumidifier-rise{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-dehumidifier-rise{animation:hda-dehumidifier-rise 30s linear infinite}
@keyframes hda-dehumidifier-rise{0%{transform:scaleY(.9)}92%{transform:scaleY(1.03)}100%{transform:scaleY(.9)}}
.hda-anim .hda-dehumidifier-pulse{animation:hda-dehumidifier-pulse 3.2s ease-in-out infinite}
@keyframes hda-dehumidifier-pulse{50%{opacity:.45}}
.hda-anim .hda-dehumidifier-blink{animation:hda-dehumidifier-blink 1.1s steps(1,end) infinite}
@keyframes hda-dehumidifier-blink{0%,49%{opacity:1}50%,100%{opacity:.2}}
.hda-dehumidifier-chase{opacity:.25}
.hda-anim .hda-dehumidifier-chase{animation:hda-dehumidifier-chase 2s linear infinite}
@keyframes hda-dehumidifier-chase{0%,100%{opacity:.12}15%{opacity:.95}40%{opacity:.12}}
.hda-dehumidifier-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-dehumidifier-spin{animation:hda-dehumidifier-spin 9s linear infinite}
@keyframes hda-dehumidifier-spin{to{transform:rotate(360deg)}}
.hda-dehumidifier-sway{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-dehumidifier-sway{animation:hda-dehumidifier-sway 6s ease-in-out infinite}
@keyframes hda-dehumidifier-sway{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}
.hda-dehumidifier-flap{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-dehumidifier-flap{animation:hda-dehumidifier-flap 5s ease-in-out infinite}
@keyframes hda-dehumidifier-flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.62)}}
.hda-dehumidifier-mote{opacity:.5}
.hda-anim .hda-dehumidifier-mote{animation:hda-dehumidifier-mote 2.8s linear infinite}
@keyframes hda-dehumidifier-mote{0%{transform:translateX(-10px);opacity:0}30%{opacity:.9}100%{transform:translateX(6px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-dehumidifier-shim,.hda-anim .hda-dehumidifier-drip,.hda-anim .hda-dehumidifier-ripple,.hda-anim .hda-dehumidifier-rise,.hda-anim .hda-dehumidifier-pulse,.hda-anim .hda-dehumidifier-blink,.hda-anim .hda-dehumidifier-chase,.hda-anim .hda-dehumidifier-spin,.hda-anim .hda-dehumidifier-sway,.hda-anim .hda-dehumidifier-flap,.hda-anim .hda-dehumidifier-mote{animation:none!important}}
`;

  const ic = (id, name, first, render, swatches) => ({ id, name, colors: swatches || sw(first), picker: true, colorLabel: "Body", render });
  // (multi-function) parts: o.parts holds only the parts the owner ticked; a part left out follows the one device as a
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

  const icons = [
    ic("upright", "Classic upright", WH, (o) => { const u = o.uid; return svg(o,
      sh(o, 108, 182, 64, 7) + caster(o, 60, 181) + caster(o, 132, 181) + caster(o, 152, 170) +
      box3(o, 50, 42, 88, 136, 22, 16) +
      `<path d="M60 39L72 30H152L140 39Z" fill="url(#${u}-dk)"/><path d="M60 39L72 30H152L140 39Z" fill="url(#${u}-slot)"/>` +
      `<path d="M78 29L80.5 27.5H143L140.5 29Z" fill="#14171c"/>` +
      area(o, "M142 52L156 41V160L142 172Z", "vs") +
      `<path d="${rr(58, 50, 72, 20, 5)}" fill="#12151a"/><path d="${rr(58, 50, 72, 20, 5)}" fill="url(#${u}-gl)"/>` + lcd(o, 64, 54, 12) +
      btn(102, 60, 3.4) + btn(112, 60, 3.4) + led(o, 122, 56, 1.4) + fullLed(o, 122, 64, 1.4) +
      area(o, rr(58, 78, 72, 36, 5), "slot") + `<path d="${rr(58, 78, 72, 36, 5)}" fill="url(#${u}-fx)"/>` +
      groove("M50 120H138") + `<path d="${rr(82, 123, 24, 5, 2.5)}" fill="#000" fill-opacity=".35"/>` +
      tank(o, 1, rr(64, 134, 60, 34, 5), 64, 134, 60, 34, .45) +
      hl(54, 48, 54, 170, 2, .3) + heat(o, 106, 30, { w: 72, h: 28, n: 5 })); }),

    ic("compact", "Compact 35-pint", GR, (o) => { const u = o.uid, b = rr(46, 58, 108, 122, 18); return svg(o,
      sh(o, 100, 182, 60, 6) + foot(54, 177) + foot(136, 177) +
      `<path d="${b}" fill="url(#${u}-c)"/><path d="${rr(46, 58, 108, 40, 18)}" fill="url(#${u}-g)" opacity=".35"/>` +
      louv(o, 60, 64, 80, 16, 4) +
      `<path d="${rr(48, 92, 4, 22, 2)} ${rr(148, 92, 4, 22, 2)}" fill="#000" fill-opacity=".3"/>` +
      `<path d="${rr(64, 88, 72, 20, 10)}" fill="#12151a"/><path d="${rr(64, 88, 72, 20, 10)}" fill="url(#${u}-gl)"/>` + lcd(o, 74, 92, 12) +
      led(o, 110, 98, 1.4) + fullLed(o, 120, 98, 1.4) + btn(129, 98, 3) +
      groove(arcF(46, 154, 118, 2)) + `<path d="M84 122H116" stroke="#000" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>` +
      tank(o, 2, rr(56, 130, 88, 30, 7), 56, 130, 88, 30, .55, { drops: 3 }) +
      `<path d="M52 72Q52 62 64 61" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>` + hl(51, 90, 51, 166, 2, .25) +
      heat(o, 100, 62, { w: 72, h: 36, n: 5 })); }),

    ic("small", "Small room", WH, (o) => { const u = o.uid, b = "M68 96Q68 74 100 74Q132 74 132 96V164Q132 178 118 178H82Q68 178 68 164Z"; return svg(o,
      sh(o, 100, 182, 42, 5) +
      `<path d="M76 88Q76 50 100 50Q124 50 124 88" fill="none" stroke="#1a1d22" stroke-width="5.4" stroke-linecap="round"/><path d="M76 88Q76 50 100 50Q124 50 124 88" fill="none" stroke="url(#${u}-st)" stroke-width="3.6" stroke-linecap="round"/><path d="M84 62Q92 53 100 52.5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>` +
      `<path d="${b}" fill="url(#${u}-c)"/>` +
      [80, 84.5, 89].map((y, i) => `<path d="M${80 - i * 2} ${y}Q100 ${y - 3} ${120 + i * 2} ${y}" fill="none" stroke="#000" stroke-opacity=".42" stroke-width="2" stroke-linecap="round"/><path d="M${80 - i * 2} ${y + 1}Q100 ${y - 2} ${120 + i * 2} ${y + 1}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>`).join("") +
      `<circle cx="100" cy="110" r="10" fill="#000" fill-opacity=".18"/><circle cx="100" cy="109.5" r="8.5" fill="url(#${u}-v)"/>` +
      (o.on ? `<circle class="${P}pulse" cx="100" cy="109.5" r="16" fill="url(#${u}-hb)"/><circle cx="100" cy="109.5" r="8.5" fill="none" stroke="${DISP}" stroke-width="1.6"/>` : `<circle cx="100" cy="109.5" r="8.5" fill="none" stroke="#6a717b" stroke-width="1"/>`) +
      `<path d="M100 104.5V109M96.6 106.4A4.4 4.4 0 1 0 103.4 106.4" fill="none" stroke="${o.on ? DISP : "#7a818b"}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<path d="${rr(86, 122, 28, 11, 3)}" fill="#12151a"/>` + lcd(o, 89, 124.5, 6.5) +
      tank(o, 3, rr(72, 140, 56, 36, 10), 72, 140, 56, 36, .5) +
      fullLed(o, 124, 128, 1.3) + `<path d="M73 98Q73 82 90 78" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      heat(o, 100, 76, { w: 44, h: 30, n: 3 })); }),

    ic("basement", "Basement casters", CH, (o) => { const u = o.uid, hz = "M156 150C170 152 170 172 160 178C146 186 126 184 134 178C142 172 176 176 192 184"; return svg(o,
      sh(o, 104, 184, 66, 6) + `<path d="M8 186H192" stroke="#fff" stroke-opacity=".06" stroke-width="1"/>` +
      hose(hz, "#3f8a4c", 4.5, true) + chase(o, [[164, 160], [161, 175], [146, 182], [139, 178], [158, 176], [178, 179]], "#bfe8ff", 1.4) +
      `<path d="${rr(150, 145, 10, 9, 2)}" fill="url(#${u}-st)"/>` +
      box3(o, 44, 54, 96, 116, 20, 14) +
      louv(o, 52, 62, 80, 20, 4) +
      `<path d="${rr(52, 88, 80, 14, 3)}" fill="#12151a"/>` + lcd(o, 57, 90.5, 9) + led(o, 104, 95, 1.3, GREEN, "hg") + fullLed(o, 112, 95, 1.3) + btn(124, 95, 2.6) +
      area(o, rr(52, 108, 80, 54, 4)) + `<path d="${rr(52, 108, 80, 54, 4)}" fill="url(#${u}-fx)"/>` + `<path d="${rr(86, 104, 12, 4, 2)}" fill="#000" fill-opacity=".35"/>` +
      area(o, "M144 62L156 53V150L144 160Z", "vs") +
      wheel(o, 56, 176, 6.5) + wheel(o, 126, 176, 6.5) + wheel(o, 152, 164, 5) +
      `<rect x="50" y="167" width="12" height="4" fill="#22262c"/><rect x="120" y="167" width="12" height="4" fill="#22262c"/>` +
      hl(47, 60, 47, 166, 2, .25) + heat(o, 92, 62, { w: 74, h: 30, n: 5 })); }),

    ic("crawl", "Crawlspace unit", BL, (o) => { const u = o.uid; let j = "";
      for (let i = 0; i < 4; i++) { const x = 8 + i * 52; j += `<rect x="${x}" y="8" width="16" height="30" fill="url(#${u}-wh)"/><rect x="${x}" y="8" width="16" height="30" fill="url(#${u}-grain)"/><path d="M${x} 38H${x + 16}" stroke="#000" stroke-opacity=".35"/>`; }
      const flex = "M24 136C10 136 6 150 -4 156", up = "M162 118C176 104 172 70 190 48";
      return svg(o,
      `<g class="hda-bg"><rect x="0" y="4" width="200" height="6" fill="#4a3020"/>` + j +
      `<path d="M0 172Q30 166 60 172T120 171T200 172V196H0Z" fill="#cfd6dd" fill-opacity=".16"/><path d="M0 172Q30 166 60 172T120 171T200 172" fill="none" stroke="#fff" stroke-opacity=".2"/></g>` +
      sh(o, 100, 172, 80, 6) +
      hose(flex, "#c3c9cf", 18, true) + hose(up, "#c3c9cf", 18, true) + chase(o, [[176, 98], [178, 84], [181, 70], [186, 58]], WARM, 2) +
      `<ellipse cx="25" cy="140" rx="5" ry="13" fill="url(#${u}-stv)"/><ellipse cx="24" cy="140" rx="3" ry="10" fill="#0e1014"/>` +
      box3(o, 30, 128, 128, 40, 14, 10) +
      `<path d="M158 128L172 118" stroke="#000" stroke-opacity=".001"/><ellipse cx="164" cy="120" rx="9" ry="4" fill="url(#${u}-stv)"/><ellipse cx="164" cy="120" rx="6.5" ry="2.6" fill="#0e1014"/>` +
      `<path d="M60 125Q60 116 68 116H82Q90 116 90 125" fill="none" stroke="url(#${u}-st)" stroke-width="3"/><path d="M104 125Q104 116 112 116H126Q134 116 134 125" fill="none" stroke="url(#${u}-st)" stroke-width="3"/>` +
      area(o, rr(36, 134, 56, 28, 3), "slot") +
      `<path d="${rr(102, 136, 46, 22, 3)}" fill="#12151a"/><path d="${rr(102, 136, 46, 22, 3)}" fill="url(#${u}-gl)"/>` + lcd(o, 106, 141, 10) + led(o, 140, 142, 1.3, GREEN, "hg") + fullLed(o, 140, 151, 1.3) +
      `<path d="M150 168V182" stroke="#e8ecef" stroke-width="2.4"/>` + foot(36, 168, 12) + foot(140, 168, 12)); }),

    ic("whole", "Whole-house", GR, (o) => { const u = o.uid; return svg(o,
      `<g class="hda-bg"><rect x="22" y="6" width="156" height="184" fill="#1b1e27"/><rect x="22" y="6" width="156" height="184" fill="url(#${u}-edge)" opacity=".7"/>` +
      `<rect x="14" y="6" width="9" height="184" fill="#d9dde2"/><rect x="177" y="6" width="9" height="184" fill="#b9bec5"/><rect x="14" y="2" width="172" height="6" fill="#e7eaee"/>` +
      `<path d="M22 186H178" stroke="#000" stroke-opacity=".3" stroke-width="3"/></g>` +
      `<rect x="70" y="8" width="26" height="104" fill="url(#${u}-st)"/>` + [30, 56, 82].map((y) => `<path d="M70 ${y}H96" stroke="#000" stroke-opacity=".3"/><path d="M70 ${y + 1.5}H96" stroke="#fff" stroke-opacity=".3"/>`).join("") +
      `<rect x="112" y="8" width="24" height="108" fill="url(#${u}-st)" opacity=".85"/>` + [40, 76].map((y) => `<path d="M112 ${y}H136" stroke="#000" stroke-opacity=".3"/>`).join("") +
      chase(o, [[83, 100], [83, 80], [83, 60], [83, 40], [83, 20]], WARM, 2) + chase(o, [[124, 22], [124, 44], [124, 66], [124, 88]], "#9fdcff", 1.8) +
      `<path d="M150 150H164V186" fill="none" stroke="#eef0f2" stroke-width="3"/>` +
      sh(o, 104, 186, 58, 5) + box3(o, 56, 126, 92, 58, 14, 12) +
      `<path d="${rr(62, 132, 60, 46, 3)}" fill="none" stroke="#000" stroke-opacity=".25"/>` + [[66, 136], [118, 136], [66, 174], [118, 174]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="1.2" fill="url(#${u}-st)"/>`).join("") +
      area(o, rr(70, 140, 44, 30, 3), "slot") + led(o, 136, 140, 1.5, GREEN, "hg") + fullLed(o, 136, 148, 1.5) +
      `<path d="${rr(34, 70, 22, 30, 4)}" fill="#e9ecef"/><path d="${rr(34, 70, 22, 30, 4)}" fill="url(#${u}-fx)"/><path d="${rr(37, 74, 16, 12, 2)}" fill="#12151a"/>` + lcd(o, 38.5, 76.5, 6.5) +
      `<circle cx="45" cy="93" r="3" fill="none" stroke="#a2a9b2" stroke-width="1"/>` +
      `<path d="M57 124H147L161 114" fill="none" stroke="#fff" stroke-opacity=".001"/>`); }),

    ic("desiccant", "Desiccant mini", WH, (o) => { const u = o.uid, b = rr(52, 40, 96, 140, 24); return svg(o,
      sh(o, 100, 183, 52, 5) +
      `<path d="${b}" fill="url(#${u}-c)"/><path d="${rr(52, 40, 96, 60, 24)}" fill="url(#${u}-g)" opacity=".35"/>` +
      `<path d="${rr(66, 47, 68, 9, 4.5)}" fill="url(#${u}-dk)"/><path d="${rr(66, 47, 68, 9, 4.5)}" fill="url(#${u}-vs)"/>` +
      `<circle cx="100" cy="100" r="33" fill="#000" fill-opacity=".2"/><circle cx="100" cy="99" r="31" fill="url(#${u}-stv)"/><circle cx="100" cy="99" r="27" fill="#0d1014"/>` +
      `<clipPath id="${u}-rot"><circle cx="100" cy="99" r="25"/></clipPath><g clip-path="url(#${u}-rot)">` +
      `<g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, 14, 8)}s"><circle cx="100" cy="99" r="25" fill="url(#${u}-hc)"/><path d="M100 74V124M75 99H125" stroke="#3a3f47" stroke-width="2"/><circle cx="100" cy="99" r="4" fill="url(#${u}-st)"/></g>` +
      (o.on ? `<g opacity="${(.3 + .25 * o.level).toFixed(2)}"><path d="M100 99L100 74A25 25 0 0 1 121.7 86.5Z" fill="${ORNG}" class="${P}pulse"/></g>` : "") +
      `<circle cx="100" cy="99" r="25" fill="url(#${u}-edge)"/></g>` +
      `<circle cx="100" cy="99" r="27" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".3"/><path d="M80 84Q86 76 96 74" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="${rr(76, 136, 48, 12, 6)}" fill="#12151a"/>` + lcd(o, 82, 138.5, 7) + led(o, 112, 142, 1.2) + fullLed(o, 118.5, 142, 1.2) +
      tank(o, 7, rr(64, 154, 72, 18, 7), 64, 154, 72, 18, .4, { noTicks: true }) +
      `<path d="M57 64Q57 46 74 44" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      heat(o, 100, 46, { w: 60, h: 32, n: 4 })); }),

    ic("cube", "Closet cube", WH, (o) => { const u = o.uid; let g = "";
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g += `<path d="M${n1(94 + Math.cos(a) * 3)} ${n1(112 + Math.sin(a) * 3)}L${n1(94 + Math.cos(a) * 11)} ${n1(112 + Math.sin(a) * 11)}" stroke="#5b626c" stroke-width=".9"/>`; }
      const shirt = (x, c) => { const d = `M${x - 21} 46L${x - 31} 55L${x - 26} 62L${x - 19} 57V86H${x + 19}V57L${x + 26} 62L${x + 31} 55L${x + 21} 46Q${x} 54 ${x - 21} 46Z`; return `<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#${u}-edge)"/><path d="M${x} 52V86" stroke="#000" stroke-opacity=".18"/><path d="M${x - 16} 52Q${x - 14} 70 ${x - 15} 84" stroke="#fff" stroke-opacity=".2" stroke-width="2" fill="none"/>`; };
      const hanger = (x) => `<path d="M${x} 24Q${x} 18 ${x + 4} 19Q${x + 7} 21 ${x + 4} 26L${x} 32L${x - 22} 46H${x + 22}Z" fill="none" stroke="url(#${u}-st)" stroke-width="1.6" stroke-linejoin="round"/>`;
      return svg(o,
      `<g class="hda-bg"><rect x="0" y="20" width="200" height="4" rx="2" fill="url(#${u}-stv)"/>` + hanger(40) + hanger(160) +
      shirt(40, "#8a6f9e") + shirt(160, "#6f8f7f") +
      `<rect x="0" y="160" width="200" height="12" fill="url(#${u}-wood)"/><rect x="0" y="160" width="200" height="12" fill="url(#${u}-grain)"/><rect x="0" y="160" width="200" height="1.5" fill="#fff" fill-opacity=".25"/></g>` +
      sh(o, 104, 160, 42, 4) + box3(o, 68, 94, 56, 64, 16, 12) +
      `<circle cx="94" cy="112" r="13" fill="#000" fill-opacity=".2"/><circle cx="94" cy="112" r="12" fill="url(#${u}-dk)"/>` + g + `<circle cx="94" cy="112" r="3" fill="#2a2e35" stroke="#7a818c" stroke-width=".5"/>` +
      `<circle cx="116" cy="102" r="2.6" fill="#000" fill-opacity=".25"/>` + led(o, 116, 102, 1.4) +
      (o.on ? `<ellipse class="${P}pulse" cx="96" cy="146" rx="22" ry="8" fill="url(#${u}-hb)"/>` : "") +
      tank(o, 8, rr(73, 128, 46, 26, 4), 73, 128, 46, 26, .4, { drops: 1 }) +
      (o.on ? `<rect x="78" y="151" width="36" height="2" rx="1" fill="${DISP}" opacity=".7"/>` : "") +
      `<path d="M126 92L138 85" stroke="#fff" stroke-opacity=".001"/>` + heat(o, 104, 86, { w: 40, h: 26, n: 3 })); }),

    ic("pod", "Crystal pod", BL, (o) => { const u = o.uid, wet = 1 - o.level; let beads = "";
      for (let r = 0; r < 12; r++) for (let c = 0; c < 8; c++) {
        const x = 82 + c * 5.2 + (r % 2 ? 2.6 : 0), y = 74 + r * 5.2, t = (y - 74) / 58;
        const c2 = (1 - t) < wet ? "#5bc06e" : ORNG; beads += `<circle cx="${n1(x)}" cy="${n1(y)}" r="2.4" fill="${c2}"/><circle cx="${n1(x - .8)}" cy="${n1(y - .8)}" r=".8" fill="#fff" fill-opacity=".55"/>`; }
      const body = "M100 40C134 40 144 74 144 110C144 150 128 178 100 178C72 178 56 150 56 110C56 74 66 40 100 40Z";
      return svg(o,
      `<rect class="hda-bg" x="0" y="178" width="200" height="10" fill="url(#${u}-wood)" opacity=".8"/>` + sh(o, 100, 179, 46, 4) +
      `<rect x="142" y="104" width="12" height="3" rx="1" fill="url(#${u}-st)"/><rect x="142" y="114" width="12" height="3" rx="1" fill="url(#${u}-st)"/>` +
      `<path d="${body}" fill="url(#${u}-c)"/><path d="M100 40C80 40 68 56 64 76C76 58 88 50 100 50Z" fill="#fff" fill-opacity=".3"/>` +
      [52, 56, 60].map((y, i) => `<path d="M${84 - i * 3} ${y}Q100 ${y - 3} ${116 + i * 3} ${y}" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="1.6" stroke-linecap="round"/>`).join("") +
      `<clipPath id="${u}-bw"><ellipse cx="100" cy="104" rx="24" ry="34"/></clipPath><ellipse cx="100" cy="104" rx="26" ry="36" fill="#000" fill-opacity=".25"/><ellipse cx="100" cy="104" rx="24" ry="34" fill="#1a1d22"/>` +
      `<g clip-path="url(#${u}-bw)">${beads}${o.on ? `<g opacity=".25"><rect class="${P}pulse" x="70" y="${n1(132 - wet * 58 - 4)}" width="60" height="8" fill="#eafff0"/></g>` : ""}</g>` +
      `<ellipse cx="100" cy="104" rx="24" ry="34" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".35"/><path d="M84 84Q86 76 92 72" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
      `<circle cx="100" cy="152" r="4" fill="#000" fill-opacity=".2"/>` + (full(o) ? fullLed(o, 100, 152, 2) : led(o, 100, 152, 2, GREEN, "hg")) +
      (o.on ? [[46, 92], [40, 108], [48, 124], [154, 96], [160, 128]].map((p, i) => `<g${p[0] > 100 ? ` transform="rotate(180 ${p[0]} ${p[1]})"` : ""}><g class="${P}mote" style="animation-delay:-${(i * .55).toFixed(2)}s"><circle cx="${p[0]}" cy="${p[1]}" r="1.5" fill="#bfe8ff"/></g></g>`).join("") : "")); }),

    ic("bag", "Hanging bag", BE, (o) => { const u = o.uid, p = pal(o.color), f = full(o) ? .92 : .2 + .5 * (1 - o.level);
      const bag = "M70 108H130L134 168Q134 180 122 180H78Q66 180 66 168Z", wy = 108 + 72 * (1 - f); let cr = "";
      for (let i = 0; i < 26; i++) { const x = 76 + (i * 37 % 48), y = 64 + (i * 23 % 38); cr += `<path d="M${x} ${y}l2.4 -1.4l2.2 1.6l-1 2.4h-2.8Z" fill="#ffffff" fill-opacity="${(.5 + (i % 3) * .2).toFixed(2)}"/>`; }
      return svg(o,
      `<rect x="0" y="12" width="200" height="5" rx="2.5" fill="url(#${u}-stv)"/>` +
      `<g class="${o.on ? P + "sway" : ""}"><path d="M100 14Q94 14 94 20Q94 26 100 26V40" fill="none" stroke="url(#${u}-st)" stroke-width="2.2" stroke-linecap="round"/>` +
      `<path d="${rr(70, 38, 60, 18, 4)}" fill="url(#${u}-v)"/><path d="${rr(70, 38, 60, 18, 4)}" fill="url(#${u}-fx)"/><circle cx="100" cy="44" r="2.4" fill="#1a1d22"/><path d="M76 51H124" stroke="${p.d}" stroke-width="1.2"/>` +
      `<path d="M72 56H128V108H72Z" fill="#e8ece9"/><path d="M72 56H128V108H72Z" fill="url(#${u}-mesh)" opacity=".7"/>` + cr + `<path d="M72 56H128V108H72Z" fill="url(#${u}-edge)"/>` +
      `<path d="M70 106H130" stroke="${p.d}" stroke-width="3"/>` +
      `<clipPath id="${u}-bg"><path d="${bag}"/></clipPath><path d="${bag}" fill="#cfe7f5" fill-opacity=".1"/>` +
      `<g clip-path="url(#${u}-bg)"><g class="${o.on ? P + "rise" : ""}"><rect x="60" y="${n1(wy)}" width="80" height="80" fill="url(#${u}-wt)"/><rect x="60" y="${n1(wy)}" width="80" height="1.4" fill="#e6f7ff" fill-opacity=".7"/></g>` +
      (o.on && !full(o) ? [86, 112].map((x, i) => `<g class="${P}drip" style="animation-delay:-${i * .9}s">${drop(x, Math.max(113, wy - 15), .9)}</g>`).join("") : "") + `</g>` +
      `<path d="${bag}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".4"/><path d="M74 116L72 166" stroke="#fff" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>` +
      [126, 144, 162].map((y) => `<path d="M68 ${y}h5" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/>`).join("") +
      (full(o) && o.on ? `<g class="${P}blink"><path d="${rr(110, 112, 16, 6, 3)}" fill="${RED}" opacity=".9"/></g>` : "") + `</g>`); }),

    ic("pump", "Pump drain", WH, (o) => { const u = o.uid, tb = "M128 46C128 20 168 18 172 50C176 80 172 140 170 180"; return svg(o,
      `<path d="M0 186H200" stroke="#fff" stroke-opacity=".06"/><ellipse cx="170" cy="186" rx="16" ry="4.5" fill="url(#${u}-stv)"/><ellipse cx="170" cy="186" rx="12.5" ry="3.2" fill="#0d0f13"/>` +
      [-8, -4, 0, 4, 8].map((d) => `<path d="M${170 + d} 183.3V188.7" stroke="url(#${u}-st)" stroke-width="1.4"/>`).join("") +
      sh(o, 86, 184, 54, 6) + box3(o, 40, 56, 82, 124, 16, 12) +
      hose(tb, "#e9eef2", 2.6) + `<path d="${tb}" fill="none" stroke="#9fdcff" stroke-opacity=".35" stroke-width="1"/>` +
      chase(o, [[129, 34], [138, 22], [152, 20], [165, 28], [172, 46], [173, 70], [172, 96], [171, 122], [171, 148], [170, 172]], "#bfe8ff", 1.5) +
      (o.on && !full(o) ? `<g class="${P}drip">${drop(170, 182, .8)}</g>` : "") +
      `<path d="${rr(124, 44, 9, 8, 2)}" fill="url(#${u}-st)"/>` +
      `<path d="M50 53L58 47H134L126 53Z" fill="url(#${u}-dk)"/><path d="M50 53L58 47H134L126 53Z" fill="url(#${u}-slot)"/>` +
      `<path d="${rr(48, 64, 66, 22, 5)}" fill="#12151a"/><path d="${rr(48, 64, 66, 22, 5)}" fill="url(#${u}-gl)"/>` + lcd(o, 53, 69, 11) +
      led(o, 92, 70, 1.3, GREEN, "hg") + fullLed(o, 100, 70, 1.3) + btn(108, 70, 2.4) +
      (o.on ? `<path d="M90 79H110" stroke="${GREEN}" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` : `<path d="M90 79H110" stroke="#454a52" stroke-width="1.6" stroke-linecap="round"/>`) +
      area(o, rr(48, 92, 66, 30, 4), "mesh") + groove("M40 128H122") + `<path d="${rr(70, 131, 22, 4.5, 2.2)}" fill="#000" fill-opacity=".35"/>` +
      tank(o, 11, rr(52, 140, 58, 30, 5), 52, 140, 58, 30, .3) + area(o, "M126 62L136 54V164L126 174Z", "vs") +
      hl(44, 62, 44, 172, 2, .3) + foot(46, 179, 12) + foot(104, 179, 12) + heat(o, 92, 48, { w: 64, h: 26, n: 4 })); }),

    ic("ring", "Smart ring", WH, (o) => { const u = o.uid, b = rr(50, 36, 100, 144, 20), fr = hum(o) / 100, R = 27, C = 2 * Math.PI * R;
      return svg(o,
      sh(o, 100, 183, 56, 5) + foot(58, 178, 12) + foot(130, 178, 12) +
      `<path d="${b}" fill="url(#${u}-c)"/><path d="${rr(50, 36, 100, 56, 20)}" fill="url(#${u}-g)" opacity=".3"/>` +
      louv(o, 64, 42, 72, 10, 3) +
      `<circle cx="100" cy="94" r="34" fill="#000" fill-opacity=".14"/><circle cx="100" cy="93" r="32" fill="#11141a"/><circle cx="100" cy="93" r="32" fill="url(#${u}-gl)"/>` +
      `<circle cx="100" cy="93" r="${R}" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="4"/>` +
      (o.on ? `<circle class="${P}pulse" cx="100" cy="93" r="${R}" fill="none" stroke="${full(o) ? RED : DISP}" stroke-opacity=".25" stroke-width="9"/>` +
        `<circle cx="100" cy="93" r="${R}" fill="none" stroke="${full(o) ? RED : DISP}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${n1(C * (full(o) ? 1 : fr))} ${n1(C)}" transform="rotate(-90 100 93)"/>` : "") +
      lcd(o, 86, 85, 15) + `<circle cx="88" cy="111" r="1.4" fill="${o.on ? GREEN : "#454a52"}"/>` + fullLed(o, 112, 111, 1.4) +
      groove("M50 130H150") + `<path d="M86 134H114" stroke="#000" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>` +
      tank(o, 12, rr(62, 142, 76, 28, 8), 62, 142, 76, 28, .5, { drops: 2 }) +
      `<path d="M55 58Q55 42 70 40" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      heat(o, 100, 42, { w: 64, h: 32, n: 4 })); }),

    ic("tower", "Tall tower", CH, (o) => { const u = o.uid; return svg(o,
      sh(o, 102, 184, 40, 5) + box3(o, 74, 32, 44, 150, 14, 10) +
      `<path d="M80 29L86 25H128L122 29Z" fill="url(#${u}-dk)"/><path d="M80 29L86 25H128L122 29Z" fill="url(#${u}-slot)"/>` +
      area(o, rr(80, 40, 32, 58, 4), "vs") + `<path d="${rr(80, 40, 32, 58, 4)}" fill="url(#${u}-fx)"/>` +
      `<path d="${rr(80, 104, 32, 14, 3)}" fill="#11141a"/>` + lcd(o, 83, 107, 8) +
      led(o, 86, 124, 1.2) + fullLed(o, 106, 124, 1.2) +
      tank(o, 13, rr(82, 130, 28, 44, 6), 82, 130, 28, 44, .4, { drops: 1 }) +
      area(o, "M122 40L128 36V168L122 172Z", "vs") + hl(77, 38, 77, 176, 1.6, .3) +
      heat(o, 100, 28, { w: 34, h: 24, n: 3 })); }),

    // (parts) Dehumidify (the compressor: warm air out the top, the tank fills, the humidity readout) and Purify (the filter
    // panel lit, the air-quality bar); the louvers move with either. A Device Image (no o.mf, no parts) is drawn as before.
    Object.assign(ic("combo", "Purifier combo", WH, (o0) => { const mf = !!(o0.mf || o0.parts), lv = (k) => { const v = MF.lv(o0, k); return v == null || !isFinite(+v) ? 1 : +v; };
      const o = mf ? Object.assign({}, o0, { on: MF.on(o0, "dehum"), level: lv("dehum") }) : o0, pu = mf ? Object.assign({}, o0, { on: MF.on(o0, "purify"), level: lv("purify") }) : o0;
      const fan = mf ? Object.assign({}, o, { on: o.on || pu.on }) : o0, u = o.uid, b = rr(40, 44, 120, 136, 14); return svg(o,
      sh(o, 100, 183, 64, 5) + foot(50, 178, 12) + foot(138, 178, 12) +
      `<path d="${b}" fill="url(#${u}-c)"/>` + louv(fan, 54, 50, 92, 10, 3) +
      `<path d="${rr(52, 66, 96, 50, 6)}" fill="#0e1014"/><path d="${rr(55, 69, 90, 44, 4)}" fill="url(#${u}-pl)"/><path d="${rr(55, 69, 90, 44, 4)}" fill="url(#${u}-edge)" opacity=".6"/>` +
      (pu.on ? "" : `<path d="${rr(55, 69, 90, 44, 4)}" fill="#000" opacity=".18"/>`) +
      `<path d="${rr(52, 66, 96, 50, 6)}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".25"/><path d="M60 110L84 70" stroke="#fff" stroke-opacity=".15" stroke-width="7"/>` +
      `<path d="${rr(52, 122, 96, 14, 4)}" fill="#11141a"/>` + lcd(o, 57, 125, 8) +
      (pu.on ? `<g opacity=".25"><rect class="${P}pulse" x="80" y="125.5" width="${n1(20 + 20 * pu.level)}" height="7" rx="3.5" fill="${GREEN}"/></g><rect x="82" y="128" width="${n1(16 + 20 * pu.level)}" height="2.4" rx="1.2" fill="${GREEN}"/>` : `<rect x="82" y="128" width="30" height="2.4" rx="1.2" fill="#454a52"/>`) +
      led(o, 132, 129, 1.3) + fullLed(o, 140, 129, 1.3) +
      groove("M40 142H160") + tank(o, 14, rr(58, 148, 84, 24, 6), 58, 148, 84, 24, .45, { drops: 3 }) +
      `<path d="M45 60Q45 48 56 47" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      heat(o, 100, 50, { w: 84, h: 30, n: 5 })); }), { parts: [{ id: "dehum", name: "Dehumidify" }, { id: "purify", name: "Purify" }] }),

    ic("rugged", "Heavy-duty", YE, (o) => { const u = o.uid; return svg(o,
      sh(o, 104, 184, 70, 6) +
      `<path d="M150 170V28H166V158" fill="none" stroke="#14161a" stroke-width="5.6" stroke-linejoin="round"/><path d="M150 170V28H166V158" fill="none" stroke="url(#${u}-st)" stroke-width="4" stroke-linejoin="round"/>` +
      `<rect x="146" y="24" width="24" height="7" rx="3.5" fill="#1d2025"/><path d="M149 26H167" stroke="#fff" stroke-opacity=".15"/>` +
      box3(o, 40, 68, 100, 100, 18, 14) +
      `<path d="M40 68H140V168H40Z" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3"/>` +
      [[40, 68], [140, 68], [40, 168], [140, 168]].map((p) => `<rect x="${p[0] - 5}" y="${p[1] - 5}" width="10" height="10" rx="3" fill="#24272d"/>`).join("") +
      louv(o, 50, 76, 80, 16, 3) +
      `<path d="${rr(50, 98, 80, 46, 4)}" fill="#14161a"/><path d="${rr(50, 98, 80, 46, 4)}" fill="url(#${u}-hex)"/><path d="${rr(50, 98, 80, 46, 4)}" fill="url(#${u}-fx)"/>` +
      `<path d="${rr(54, 148, 46, 14, 2)}" fill="#0b0c0f" stroke="#555b63" stroke-width=".8"/>` + lcd(o, 58, 150.5, 9, RED) +
      `<circle cx="112" cy="155" r="5.5" fill="#24272d"/><circle cx="112" cy="155" r="3.4" fill="${o.on ? "#2fbf6a" : "#3c5a46"}"/>` + fullLed(o, 124, 155, 1.6) +
      `<path d="M40 170H140" stroke="#111" stroke-width="5"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<path d="M${42 + i * 10} 172.5l5 -5" stroke="#f0b52c" stroke-width="3"/>`).join("") +
      wheel(o, 152, 172, 11) + foot(48, 172, 14) + hl(44, 76, 44, 160, 2, .35) +
      heat(o, 90, 76, { w: 74, h: 30, n: 5 })); }, [YE, WH, GR, CH, BL]),

    ic("wall", "Wall-mounted", WH, (o) => { const u = o.uid; return svg(o,
      `<path class="hda-bg" d="M0 186H200" stroke="#fff" stroke-opacity=".06"/>` +
      `<path d="M138 140V196" stroke="#000" stroke-opacity=".35" stroke-width="7"/><path d="M138 140V196" stroke="url(#${u}-st)" stroke-width="5"/><rect x="134" y="168" width="8" height="4" fill="#cfd5db"/>` +
      `<path d="${rr(46, 46, 112, 98, 10)}" fill="#000" opacity=".3"/>` +
      `<path d="${rr(42, 40, 112, 98, 10)}" fill="url(#${u}-sd)"/><path d="${rr(42, 36, 112, 98, 10)}" fill="url(#${u}-v)"/><path d="${rr(42, 36, 112, 98, 10)}" fill="url(#${u}-fx)"/>` +
      `<path d="${rr(52, 42, 92, 8, 4)}" fill="url(#${u}-dk)"/><path d="${rr(52, 42, 92, 8, 4)}" fill="url(#${u}-vs)"/>` +
      `<path d="${rr(56, 58, 84, 24, 6)}" fill="#11141a"/><path d="${rr(56, 58, 84, 24, 6)}" fill="url(#${u}-gl)"/>` + lcd(o, 64, 63, 14) +
      led(o, 112, 66, 1.4) + fullLed(o, 112, 74, 1.4) + btn(124, 70, 3) + btn(133, 70, 3) +
      groove("M44 96H152") +
      `<path d="${rr(50, 116, 96, 14, 4)}" fill="url(#${u}-dk)"/>` + [0, 1, 2, 3].map((i) => `<path d="M52 ${119 + i * 3}L144 ${119 + i * 3}" stroke="${pal(o.color).m}" stroke-width="1.6"/><path d="M52 ${118.4 + i * 3}H144" stroke="#fff" stroke-opacity=".4" stroke-width=".5"/>`).join("") +
      `<path d="M44 38H152" stroke="#fff" stroke-opacity=".55"/>` +
      heat(o, 98, 132, { rot: 180, w: 88, h: 34, n: 5 })); }),

    ic("laundry", "Laundry dryer", GR, (o) => { const u = o.uid; return svg(o,
      `<g class="hda-bg"><path d="M0 16Q100 26 200 16" fill="none" stroke="#c9ced4" stroke-opacity=".6" stroke-width="1.2"/>` +
      `<path d="M30 19L60 21L64 58Q46 62 28 58Z" fill="#e7ecf2"/><path d="M30 19L60 21L64 58Q46 62 28 58Z" fill="url(#${u}-edge)"/><path d="M36 22V56M44 22V58M52 23V58" stroke="#9fb0c4" stroke-opacity=".5" stroke-width="1.6"/>` +
      `<path d="M134 22L170 22L172 48Q160 52 150 48L152 62Q142 64 136 60Z" fill="#9ec5e8"/><path d="M134 22L170 22L172 48Q160 52 150 48L152 62Q142 64 136 60Z" fill="url(#${u}-edge)"/>` +
      [[44, 19], [130, 21], [160, 22]].map((p) => `<rect x="${p[0] - 1.5}" y="${p[1] - 4}" width="3" height="7" rx="1" fill="#d7a35b"/>`).join("") + `</g>` +
      sh(o, 100, 183, 56, 5) + foot(58, 178, 12) + foot(130, 178, 12) +
      `<path d="${rr(50, 78, 100, 102, 14)}" fill="url(#${u}-c)"/>` +
      `<path d="${rr(56, 82, 88, 10, 3)}" fill="#0e1014"/>` +
      `<g class="${o.on ? P + "flap" : ""}"><path d="M54 92L60 70H140L146 92Z" fill="url(#${u}-v)"/><path d="M54 92L60 70H140L146 92Z" fill="url(#${u}-fx)"/><path d="M60 70.5H140" stroke="#fff" stroke-opacity=".6"/></g>` +
      `<path d="${rr(64, 100, 72, 16, 8)}" fill="#11141a"/>` + lcd(o, 70, 103.5, 9) +
      `<path d="M104 104h10v8h-10z M106 104v-2h6v2" fill="none" stroke="${o.on ? DISP : "#454a52"}" stroke-width="1"/>` + led(o, 122, 108, 1.3) + fullLed(o, 129, 108, 1.3) +
      groove("M50 124H150") + `<path d="M86 128H114" stroke="#000" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>` +
      tank(o, 17, rr(60, 136, 80, 34, 7), 60, 136, 80, 34, .5, { drops: 3 }) +
      hl(54, 96, 54, 170, 2, .25) + heat(o, 100, 66, { w: 92, h: 28, n: 6 })); }),

    ic("rv", "RV compact", BE, (o) => { const u = o.uid, b = rr(34, 112, 132, 58, 22); return svg(o,
      `<g class="hda-bg"><rect x="0" y="170" width="200" height="22" fill="url(#${u}-wood)"/><rect x="0" y="170" width="200" height="22" fill="url(#${u}-grain)"/><rect x="0" y="170" width="200" height="1.5" fill="#fff" fill-opacity=".25"/></g>` +
      hose("M164 150C182 150 186 160 178 164C170 168 172 172 184 172", "#1a1d22", 2.6) + `<path d="${rr(180, 168, 16, 7, 3)}" fill="#2a2e35"/><rect x="194" y="170" width="6" height="3" fill="url(#${u}-st)"/>` +
      sh(o, 100, 171, 70, 4) +
      `<path d="M60 112V100Q60 92 68 92H132Q140 92 140 100V112" fill="none" stroke="${pal(o.color).k}" stroke-width="7"/><path d="M60 112V100Q60 92 68 92H132Q140 92 140 100V112" fill="none" stroke="url(#${u}-c)" stroke-width="5"/><path d="M68 94H132" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>` +
      `<path d="${b}" fill="url(#${u}-v)"/><path d="${b}" fill="url(#${u}-fx)"/><path d="${rr(34, 112, 132, 26, 22)}" fill="url(#${u}-g)" opacity=".3"/>` +
      `<path d="${rr(46, 118, 70, 6, 3)}" fill="url(#${u}-dk)"/><path d="${rr(46, 118, 70, 6, 3)}" fill="url(#${u}-vs)"/>` +
      `<circle cx="66" cy="148" r="14" fill="#000" fill-opacity=".18"/><circle cx="66" cy="147.5" r="12.5" fill="url(#${u}-dk)"/><circle cx="66" cy="147.5" r="12.5" fill="url(#${u}-mesh)"/>` +
      `<path d="${rr(86, 132, 34, 13, 4)}" fill="#11141a"/>` + lcd(o, 90, 134.5, 8) + led(o, 112, 152, 1.3) + fullLed(o, 120, 152, 1.3) +
      tank(o, 18, rr(128, 124, 28, 38, 9), 128, 124, 28, 38, .45, { drops: 1, noTicks: true }) +
      `<path d="M44 128Q46 118 56 115" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>` +
      heat(o, 81, 116, { w: 64, h: 28, n: 4 })); }),

    ic("drum", "Round cylinder", BL, (o) => { const u = o.uid; let v = "";
      for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; v += `<path d="M${n1(100 + Math.cos(a) * 12)} ${n1(58 + Math.sin(a) * 2.6)}L${n1(100 + Math.cos(a) * 31)} ${n1(58 + Math.sin(a) * 6.6)}" stroke="#000" stroke-opacity=".45" stroke-width="1.4"/>`; }
      return svg(o,
      sh(o, 100, 182, 52, 7) +
      `<path d="${cylP(62, 138, 58, 174, 9)}" fill="url(#${u}-c)"/>` +
      `<ellipse cx="100" cy="58" rx="38" ry="9" fill="url(#${u}-tp)" stroke="${pal(o.color).e}" stroke-width=".6"/><ellipse cx="100" cy="58" rx="33" ry="7.4" fill="url(#${u}-dk)"/>` + v +
      `<ellipse cx="100" cy="58" rx="10" ry="2.4" fill="url(#${u}-tp)"/>` +
      `<path d="${band(62, 138, 82, 102, 9)}" fill="#12151a"/><path d="${band(62, 138, 82, 102, 9)}" fill="url(#${u}-edge)"/>` + lcd(o, 86, 87, 11) +
      led(o, 70, 94, 1.2) + fullLed(o, 130, 94, 1.2) +
      tank(o, 19, band(62, 138, 128, 166, 9), 62, 128, 76, 47, .45, { drops: 3, noTicks: true }) +
      `<path d="${band(62, 138, 128, 166, 9)}" fill="url(#${u}-edge)"/>` +
      `<path d="${arcF(62, 138, 120, 9)}" fill="none" stroke="#000" stroke-opacity=".25"/>` + hl(69, 66, 69, 168, 3, .3) +
      heat(o, 100, 52, { w: 56, h: 32, n: 4 })); }),

    ic("retro", "Retro beige", BE, (o) => { const u = o.uid, a = (-70 + 140 * (hum(o) - 20) / 60) * Math.PI / 180, nd = o.on ? a : -70 * Math.PI / 180;
      const knob = (x, y) => `<circle cx="${x}" cy="${y + 1}" r="8" fill="#000" fill-opacity=".35"/><circle cx="${x}" cy="${y}" r="7.5" fill="url(#${u}-cr)"/><circle cx="${x}" cy="${y}" r="5" fill="url(#${u}-st)"/><path d="M${x} ${y - 5}V${y - 1.5}" stroke="#222" stroke-width="1.2"/>`;
      return svg(o,
      sh(o, 106, 184, 66, 6) + foot(52, 177, 12) + foot(124, 177, 12) +
      box3(o, 46, 54, 98, 124, 18, 12) +
      `<path d="M56 51L64 45H156L148 51Z" fill="url(#${u}-dk)"/>` + [47, 49].map((y) => `<path d="M${60 + (51 - y)} ${y}H${152 - (51 - y) * .3}" stroke="url(#${u}-st)" stroke-width="1"/>`).join("") +
      `<path d="M54 60H136V88H54Z" fill="#1a1d22"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<rect x="55" y="${62 + i * 4.4}" width="80" height="2.4" rx="1.2" fill="url(#${u}-cr)"/>`).join("") +
      `<path d="M54 94H136V122H54Z" fill="url(#${u}-wh)"/><path d="M54 94H136V122H54Z" fill="url(#${u}-grain)"/><path d="M54 94H136" stroke="#fff" stroke-opacity=".25"/><path d="M54 122H136" stroke="#000" stroke-opacity=".4"/>` +
      knob(66, 108) + knob(124, 108) +
      `<path d="M82 116A13 13 0 0 1 108 116Z" fill="#f2ead6"/><path d="M82 116A13 13 0 0 1 108 116" fill="none" stroke="#2a2e35" stroke-width="1.2"/>` +
      [-60, -30, 0, 30, 60].map((d) => { const r = d * Math.PI / 180; return `<path d="M${n1(95 + Math.sin(r) * 10.5)} ${n1(116 - Math.cos(r) * 10.5)}L${n1(95 + Math.sin(r) * 12.5)} ${n1(116 - Math.cos(r) * 12.5)}" stroke="#2a2e35" stroke-width=".8"/>`; }).join("") +
      `<path d="M95 116L${n1(95 + Math.sin(nd) * 11)} ${n1(116 - Math.cos(nd) * 11)}" stroke="#c0392b" stroke-width="1.2" stroke-linecap="round"/><circle cx="95" cy="116" r="1.6" fill="#2a2e35"/>` +
      (full(o) && o.on ? fullLed(o, 112, 100, 2) : o.on ? `<circle class="${P}pulse" cx="112" cy="100" r="7" fill="url(#${u}-ho)"/><circle cx="112" cy="100" r="2.2" fill="#ffb347"/><circle cx="111.3" cy="99.3" r=".8" fill="#fff"/>` : `<circle cx="112" cy="100" r="2.2" fill="#5a4030"/>`) +
      groove("M46 128H144") + `<path d="${rr(80, 132, 30, 6, 3)}" fill="#000" fill-opacity=".35"/>` +
      tank(o, 20, rr(122, 140, 14, 32, 4), 122, 140, 14, 32, .45, { drops: 1, ds: .7, noTicks: true }) +
      area(o, "M148 60L158 52V164L148 172Z", "slot") + hl(50, 58, 50, 172, 2, .3) +
      heat(o, 108, 46, { w: 72, h: 26, n: 5 })); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "dehumidifier", tab: "Dehumidifiers", group: "Air", kind: "device",
    intro: "Twenty dehumidifiers. When on, warm dry air shimmers out of the louvers, drops fall into the bucket and the water creeps up, and the display shows the room humidity; at a very low slider the bucket is full and the red light blinks.",
    
    css, icons,
  });
})();
