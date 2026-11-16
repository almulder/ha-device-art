(function () {
  const P = "hda-diffuser-";
  const H = () => window.HDAH;
  const n1 = (v) => (+v).toFixed(1);
  const n2 = (v) => (+v).toFixed(2);

  const MOOD = ["#ffb36b", "#ffd27a", "#c4b5fd", "#7dd3fc", "#ffc9de", "#a7f3d0"];
  const sw = (first, list) => [first].concat((list || MOOD).filter((c) => c !== first)).slice(0, 6);
  const BODY = ["#eef0ef", "#3d4148", "#a7b79c", "#dac9a9", "#e8c5c0", "#bcd4e6"];
  const OIL = ["#e9a13b", "#b8d8a0", "#c9a7e8", "#f2b8c8", "#8fc7e8", "#e8d27a"];

  function pal(c) { const h = H(); return { l: h.shade(c, .5), m: c, d: h.shade(c, -.28), k: h.shade(c, -.52), e: h.shade(c, -.42) }; }

  function defs(o, extra) {
    const u = o.uid, h = H(), c = o.color, p = pal(c), cl = h.mix(c, "#ffffff", .6);
    return `<defs>
<linearGradient id="${u}-c" x1="0" x2="1"><stop offset="0" stop-color="${p.d}"/><stop offset=".3" stop-color="${p.l}"/><stop offset=".62" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></linearGradient>
<linearGradient id="${u}-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<linearGradient id="${u}-tp" x1="0" x2="1"><stop offset="0" stop-color="${p.m}"/><stop offset=".45" stop-color="${p.l}"/><stop offset="1" stop-color="${p.d}"/></linearGradient>
<radialGradient id="${u}-s" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="${p.l}"/><stop offset=".55" stop-color="${p.m}"/><stop offset="1" stop-color="${p.k}"/></radialGradient>
<linearGradient id="${u}-edge" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".68" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-wood" x1="0" x2="1"><stop offset="0" stop-color="#5e3d22"/><stop offset=".32" stop-color="#c8996a"/><stop offset=".68" stop-color="#a87a4e"/><stop offset="1" stop-color="#4f321b"/></linearGradient>
<linearGradient id="${u}-woodt" x1="0" x2="1"><stop offset="0" stop-color="#9a6d43"/><stop offset=".45" stop-color="#d9b083"/><stop offset="1" stop-color="#8a5f38"/></linearGradient>
<pattern id="${u}-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 3Q10 1.2 20 3T40 3" fill="none" stroke="#3e2410" stroke-opacity=".3" stroke-width=".8"/><path d="M0 5.4Q13 4.4 24 5.6T40 5.4" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width=".6"/></pattern>
<linearGradient id="${u}-cer" x1="0" x2="1"><stop offset="0" stop-color="#a9a49b"/><stop offset=".3" stop-color="#fbf8f2"/><stop offset=".64" stop-color="#e6e1d7"/><stop offset="1" stop-color="#8e897f"/></linearGradient>
<linearGradient id="${u}-cert" x1="0" x2="1"><stop offset="0" stop-color="#ddd8ce"/><stop offset=".45" stop-color="#ffffff"/><stop offset="1" stop-color="#c9c4ba"/></linearGradient>
<linearGradient id="${u}-blk" x1="0" x2="1"><stop offset="0" stop-color="#0c0e12"/><stop offset=".3" stop-color="#4a4f58"/><stop offset=".62" stop-color="#2a2e35"/><stop offset="1" stop-color="#08090c"/></linearGradient>
<linearGradient id="${u}-st" x1="0" x2="1"><stop offset="0" stop-color="#6f767e"/><stop offset=".5" stop-color="#e2e6ea"/><stop offset="1" stop-color="#5a6067"/></linearGradient>
<linearGradient id="${u}-brass" x1="0" x2="1"><stop offset="0" stop-color="#7b521b"/><stop offset=".45" stop-color="#f1cf7a"/><stop offset="1" stop-color="#6e4a18"/></linearGradient>
<linearGradient id="${u}-gls" x1="0" x2="1"><stop offset="0" stop-color="#e8f6ff" stop-opacity=".34"/><stop offset=".22" stop-color="#e8f6ff" stop-opacity=".06"/><stop offset=".7" stop-color="#e8f6ff" stop-opacity=".03"/><stop offset="1" stop-color="#e8f6ff" stop-opacity=".24"/></linearGradient>
<linearGradient id="${u}-amb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c15a" stop-opacity=".85"/><stop offset="1" stop-color="#9a4f0e" stop-opacity=".95"/></linearGradient>
<linearGradient id="${u}-oil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h.mix(c, "#ffffff", .3)}" stop-opacity=".8"/><stop offset="1" stop-color="${h.shade(c, -.45)}" stop-opacity=".95"/></linearGradient>
<radialGradient id="${u}-halo"><stop offset="0" stop-color="${cl}" stop-opacity=".85"/><stop offset=".42" stop-color="${c}" stop-opacity=".34"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-pool"><stop offset="0" stop-color="${cl}" stop-opacity=".7"/><stop offset=".5" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cl}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-up" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${cl}" stop-opacity=".75"/><stop offset=".6" stop-color="${c}" stop-opacity=".2"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>
<radialGradient id="${u}-mp"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".5" stop-color="#e6ecf6" stop-opacity=".42"/><stop offset="1" stop-color="#d8e0ee" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-mpc"><stop offset="0" stop-color="${h.mix(c, "#ffffff", .7)}" stop-opacity="1"/><stop offset=".45" stop-color="${h.mix(c, "#ffffff", .25)}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-jet" cx=".5" cy="1" fx=".5" fy="1" r="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset=".55" stop-color="#ffffff" stop-opacity=".28"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-jetc" cx=".5" cy="1" fx=".5" fy="1" r="1"><stop offset="0" stop-color="${h.mix(c, "#ffffff", .65)}" stop-opacity="1"/><stop offset=".45" stop-color="${h.mix(c, "#ffffff", .15)}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-warm"><stop offset="0" stop-color="#fff3d0" stop-opacity=".95"/><stop offset=".35" stop-color="#ffb347" stop-opacity=".45"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-fl" cx=".5" cy=".78" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#fff1b8"/><stop offset=".65" stop-color="#ffb347"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-ember"><stop offset="0" stop-color="#fff2c4"/><stop offset=".35" stop-color="#ff8a3d"/><stop offset="1" stop-color="#ff3d1a" stop-opacity="0"/></radialGradient>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, extra)}${body}</svg>`;

  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const cylP = (x1, x2, yt, yb, ry) => `M${x1} ${yt}V${yb}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${yb}V${yt}Z`;
  const band = (x1, x2, y1, y2, ry) => { const rx = (x2 - x1) / 2; return `M${x1} ${y1}V${y2}A${rx} ${ry} 0 0 0 ${x2} ${y2}V${y1}A${rx} ${ry} 0 0 1 ${x1} ${y1}Z`; };
  const arcF = (x1, x2, y, ry) => `M${x1} ${y}A${(x2 - x1) / 2} ${ry} 0 0 0 ${x2} ${y}`;
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const seam = (x1, x2, y, ry) => `<path d="${arcF(x1, x2, y, ry)}" fill="none" stroke="#000" stroke-opacity=".26" stroke-width="1.1"/><path d="${arcF(x1, x2, y + 1.3, ry)}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/>`;
  const hlp = (d, w, op) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${op || .4}" stroke-width="${w || 2.4}" stroke-linecap="round"/>`;
  const kl = (o) => .6 + .4 * o.level;
  const km = (o) => .4 + .6 * o.level;
  const rnd = (i, s) => { const v = Math.sin(i * 12.9898 + (s || 0) * 78.233) * 43758.5453; return v - Math.floor(v); };

  const pool = (o, cx, cy, rx, ry, m) => o.on ? `<g opacity="${n2(kl(o) * (m || 1))}"><ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${o.uid}-pool)"/></g>` : "";
  const halo = (o, cx, cy, rx, ry, m) => o.on ? `<g opacity="${n2(kl(o) * (m || 1))}"><ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || rx}" fill="url(#${o.uid}-halo)"/></g>` : "";
  const lit = (o, base, m) => o.on ? H().mix(base, o.color, (.55 + .45 * o.level) * (m || 1)) : base;
  const nozzle = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#1b1f26"/><ellipse cx="${x}" cy="${y + ry * .25}" rx="${n1(rx * .55)}" ry="${n1(ry * .5)}" fill="#05070a"/><path d="${arcF(x - rx, x + rx, y, ry)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
  const dot = (o, x, y, r, col) => o.on ? `<g opacity=".25"><circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 3.5}" fill="${col}"/></g><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${n1(r * .4)}" fill="#fff" opacity=".8"/>` : `<circle cx="${x}" cy="${y}" r="${r}" fill="#4b5058"/>`;

  function wisp(o, x, y, a) {
    if (!o.on) return ""; a = a || {};
    const u = o.uid, lv = o.level, s = a.s || 1, k = km(o) * (a.k || 1), n = a.n || 9, wd = a.wd || .7;
    const d = (a.d || 6.2) - 2.4 * lv, Hh = (a.h || 40) + 26 * lv, g = a.tint ? "mpc" : "mp", j = a.tint ? "jetc" : "jet", ln = a.lean || 0;
    const vw = (7 + 6 * lv) * wd;
    let out = `<g transform="translate(${x} ${y}) scale(${s})">`;
    out += `<g opacity="${n2(k * .36)}"><path class="${P}jet" d="M-1.6 0C-3 -10 ${n1(-vw + ln * 10)} ${n1(-Hh * .5)} ${n1(-vw * .6 + 3 + ln * Hh)} ${n1(-Hh - 6)}L${n1(vw * .6 + 3 + ln * Hh)} ${n1(-Hh - 6)}C${n1(vw + ln * 10)} ${n1(-Hh * .5)} 3 -10 1.6 0Z" fill="url(#${u}-${j})" style="animation-delay:-1.1s"/></g>`;
    out += `<g opacity="${n2(k * .9)}"><path class="${P}jet" d="M-1.4 0C-1.8 -5 -3.4 -9 -4.2 -15L4.2 -15C3.4 -9 1.8 -5 1.4 0Z" fill="url(#${u}-${j})"/></g>`;
    for (let i = 0; i < n; i++) {
      const t = (i + .5) / n, cy = -5 - t * Hh, r = (3.2 + t * 8.5) * wd * (.8 + .35 * lv), sd = i % 2 ? -1 : 1;
      const cx = Math.sin(i * 2.1 + 1) * (1 + t * 7) * wd + ln * t * Hh, op = (.85 - t * .5) * k;
      out += `<g class="${P}pf ${P}pf${sd > 0 ? "R" : "L"}" style="animation-duration:${n2(d)}s;animation-delay:-${n2(i * d / n)}s">` +
        `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(r)}" ry="${n1(r * .8)}" fill="url(#${u}-${g})" opacity="${n2(op)}"/>` +
        `<ellipse cx="${n1(cx + sd * r * .55)}" cy="${n1(cy - r * .35)}" rx="${n1(r * .6)}" ry="${n1(r * .5)}" fill="url(#${u}-${g})" opacity="${n2(op * .8)}"/></g>`;
    }
    return out + `</g>`;
  }

  function smoke(o, x, y, a) {
    if (!o.on) return ""; a = a || {};
    const k = .45 + .55 * o.level, Hh = a.h || 70, d = 7.5 - 2.5 * o.level, n = a.n || 7;
    const rib = "M0 0C-3 -7 3 -13 0 -20C-3 -27 4 -32 1 -40";
    let out = `<g transform="translate(${x} ${y})"><g class="${P}sway"><path d="${rib}" fill="none" stroke="#efecf6" stroke-opacity="${n2(.12 * k)}" stroke-width="5" stroke-linecap="round"/><path d="${rib}" fill="none" stroke="#f4f2fa" stroke-opacity="${n2(.6 * k)}" stroke-width="1.3" stroke-linecap="round"/></g>`;
    for (let i = 0; i < n; i++) {
      const t = i / n, yy = -22 - t * (Hh - 34), xo = Math.sin(i * 1.9 + .4) * (2 + t * 8), rot = (i % 2 ? -1 : 1) * (8 + t * 22), sc = .8 + t * .8;
      const c = "M0 0C-5 -5 5 -9 0 -15C-4 -19 2 -23 4 -26";
      out += `<g transform="translate(${n1(xo)} ${n1(yy)}) rotate(${n1(rot)}) scale(${n2(sc)})"><g class="${P}smk ${P}smk${i % 2 ? "L" : "R"}" style="animation-duration:${n2(d)}s;animation-delay:-${n2(i * d / n)}s">` +
        `<path d="${c}" fill="none" stroke="#efecf6" stroke-opacity="${n2(.1 * k)}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="${c}" fill="none" stroke="#f4f2fa" stroke-opacity="${n2((.62 - .3 * t) * k)}" stroke-width="1.4" stroke-linecap="round"/></g></g>`;
    }
    return out + `</g>`;
  }

  function fall(o, pts) {
    if (!o.on) return "";
    const u = o.uid, k = .5 + .5 * o.level, D = 5.4 - 2 * o.level, pp = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], L = Math.hypot(x2 - x1, y2 - y1), st = Math.max(1, Math.round(L / 4.5));
      for (let j = 0; j < st; j++) pp.push([x1 + (x2 - x1) * j / st, y1 + (y2 - y1) * j / st]);
    }
    const N = pp.length, d = "M" + pts.map((p) => p.join(" ")).join("L");
    let out = `<path d="${d}" fill="none" stroke="#f2f0f8" stroke-opacity="${n2(.2 * k)}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#f2f0f8" stroke-opacity="${n2(.45 * k)}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    pp.forEach((p, i) => {
      const t = i / (N - 1), r = 3.4 + t * 3.6;
      out += `<g class="${P}fall" style="animation-duration:${n2(D)}s;animation-delay:-${n2(((N - i) * D / 9) % D)}s"><ellipse cx="${n1(p[0])}" cy="${n1(p[1])}" rx="${n1(r * 1.15)}" ry="${n1(r)}" fill="url(#${u}-mp)" opacity="${n2(.95 * k)}"/></g>`;
    });
    return out;
  }

  function waves(o, x, y, i) {
    if (!o.on) return ""; const k = km(o), d = 5.2 - 1.8 * o.level, w = "M-6 0q3 -3 6 0t6 0";
    return `<g transform="translate(${x} ${y})">` + [0, 1, 2].map((j) => `<g class="${P}sw" style="animation-duration:${n2(d)}s;animation-delay:-${n2((j / 3 + i * .23) * d)}s"><path d="${w}" transform="translate(0 ${-j * 9})" fill="none" stroke="${H().mix(o.color, "#ffffff", .55)}" stroke-opacity="${n2(.7 * k)}" stroke-width="1.5" stroke-linecap="round"/></g>`).join("") + `</g>`;
  }

  const css = `
.hda-diffuser-pf{transform-box:fill-box;transform-origin:50% 80%}
.hda-anim .hda-diffuser-pfR{animation:hda-diffuser-curlR 5s ease-out infinite}
.hda-anim .hda-diffuser-pfL{animation:hda-diffuser-curlL 5s ease-out infinite}
@keyframes hda-diffuser-curlR{0%{transform:translate(0,10px) scale(.45);opacity:0}24%{opacity:1}60%{transform:translate(3px,-6px) scale(1.1)}100%{transform:translate(-2px,-22px) scale(1.55);opacity:0}}
@keyframes hda-diffuser-curlL{0%{transform:translate(0,10px) scale(.45);opacity:0}24%{opacity:1}60%{transform:translate(-3px,-6px) scale(1.1)}100%{transform:translate(2px,-22px) scale(1.55);opacity:0}}
.hda-anim .hda-diffuser-jet{animation:hda-diffuser-jet 2s ease-in-out infinite}
@keyframes hda-diffuser-jet{50%{opacity:.4}}
.hda-diffuser-smk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-diffuser-smkR{animation:hda-diffuser-smkR 7s linear infinite}
.hda-anim .hda-diffuser-smkL{animation:hda-diffuser-smkL 7s linear infinite}
@keyframes hda-diffuser-smkR{0%{transform:translate(0,12px) scale(.7);opacity:0}20%{opacity:1}100%{transform:translate(5px,-22px) scale(1.35);opacity:0}}
@keyframes hda-diffuser-smkL{0%{transform:translate(0,12px) scale(.7);opacity:0}20%{opacity:1}100%{transform:translate(-5px,-22px) scale(1.35);opacity:0}}
.hda-diffuser-sway{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-diffuser-sway{animation:hda-diffuser-sway 4.4s ease-in-out infinite}
@keyframes hda-diffuser-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}
.hda-diffuser-fall{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-diffuser-fall{animation:hda-diffuser-fall 5s ease-in-out infinite}
@keyframes hda-diffuser-fall{0%{transform:translate(0,-3px) scale(.65);opacity:.15}40%{opacity:1}100%{transform:translate(0,5px) scale(1.35);opacity:.15}}
.hda-diffuser-spray{transform-box:fill-box;transform-origin:0% 50%}
.hda-anim .hda-diffuser-spray{animation:hda-diffuser-spray 4.5s ease-out infinite}
@keyframes hda-diffuser-spray{0%{transform:scale(.2);opacity:0}3%{opacity:1}26%{transform:scale(1.2);opacity:0}100%{transform:scale(1.2);opacity:0}}
.hda-anim .hda-diffuser-blink{animation:hda-diffuser-blink 4.5s linear infinite}
@keyframes hda-diffuser-blink{0%,7%{opacity:1}12%,100%{opacity:.18}}
.hda-anim .hda-diffuser-sw{animation:hda-diffuser-sw 5s ease-in-out infinite}
@keyframes hda-diffuser-sw{0%{transform:translate(0,8px);opacity:0}30%{opacity:1}100%{transform:translate(3px,-16px);opacity:0}}
.hda-anim .hda-diffuser-airR{animation:hda-diffuser-airR 2.4s linear infinite}
.hda-anim .hda-diffuser-airL{animation:hda-diffuser-airL 2.4s linear infinite}
@keyframes hda-diffuser-airR{0%{transform:translate(0,0);opacity:0}25%{opacity:1}100%{transform:translate(20px,4px);opacity:0}}
@keyframes hda-diffuser-airL{0%{transform:translate(0,0);opacity:0}25%{opacity:1}100%{transform:translate(-20px,4px);opacity:0}}
.hda-diffuser-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-diffuser-flk{animation:hda-diffuser-flk 1.3s ease-in-out infinite}
@keyframes hda-diffuser-flk{0%,100%{transform:scale(1,1)}22%{transform:scale(.9,1.1) skewX(3deg)}48%{transform:scale(1.06,.92)}74%{transform:scale(.95,1.05) skewX(-3deg)}}
.hda-anim .hda-diffuser-pulse{animation:hda-diffuser-pulse 3.2s ease-in-out infinite}
@keyframes hda-diffuser-pulse{50%{opacity:.45}}
.hda-diffuser-glow{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-diffuser-glow{animation:hda-diffuser-glow 5s ease-in-out infinite}
@keyframes hda-diffuser-glow{50%{transform:scale(1.06);opacity:.72}}
.hda-anim .hda-diffuser-cyc{animation:hda-diffuser-cyc 9s linear infinite}
@keyframes hda-diffuser-cyc{0%,100%{opacity:1}50%{opacity:.55}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-diffuser-pfR,.hda-anim .hda-diffuser-pfL,.hda-anim .hda-diffuser-jet,.hda-anim .hda-diffuser-smkR,.hda-anim .hda-diffuser-smkL,.hda-anim .hda-diffuser-sway,.hda-anim .hda-diffuser-fall,.hda-anim .hda-diffuser-spray,.hda-anim .hda-diffuser-blink,.hda-anim .hda-diffuser-sw,.hda-anim .hda-diffuser-airR,.hda-anim .hda-diffuser-airL,.hda-anim .hda-diffuser-flk,.hda-anim .hda-diffuser-pulse,.hda-anim .hda-diffuser-glow,.hda-anim .hda-diffuser-cyc{animation:none!important}}
`;

  const ic = (id, name, colors, label, render) => ({ id, name, colors, picker: true, colorLabel: label, render });
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
  // (parts) Mist (the mist) and Light (the LED glow, in the light's color: o.pcolor.light, else the drawing's light color,
  // dimmed by its level). render(o, L): o = the mist's view, L = the light's; a Device Image (no o.mf, no parts) gets the
  // one device for both, so it is drawn exactly as before. A tinted mist takes the light's color only while the light is on.
  const DP = [{ id: "mist", name: "Mist" }, { id: "light", name: "Light" }];
  const lv1 = (v) => (v == null || !isFinite(+v) ? 1 : Math.max(0, Math.min(1, +v)));
  const icm = (id, name, colors, label, render) => Object.assign(ic(id, name, colors, label, (o) => {
    if (!o.mf && !o.parts) return render(o, o);
    const lc = MF.col(o, "light", o.color);
    return render(Object.assign({}, o, { on: MF.on(o, "mist"), level: lv1(MF.lv(o, "mist")), color: lc }), Object.assign({}, o, { on: MF.on(o, "light"), level: lv1(MF.lv(o, "light")), color: lc }));
  }), { parts: DP });

  const icons = [
    icm("woodcone", "Wood cone", sw("#ffb36b"), "Light", (o, L) => {
      const u = o.uid, cone = "M85 62C83 90 67 124 58 150A42 8 0 0 0 142 150C133 124 117 90 115 62Z";
      return svg(o,
        sh(o, 100, 176, 56, 7) + pool(L, 100, 170, 78, 12) +
        `<path d="${cylP(60, 140, 152, 164, 8)}" fill="url(#${u}-blk)"/><path d="${arcF(60, 140, 164, 8)}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1"/>` +
        `<path d="${band(59, 141, 149, 154, 8)}" fill="${L.on ? H().mix(o.color, "#ffffff", .35) : "#22262d"}" opacity="${L.on ? n2(kl(L)) : 1}"/>` + halo(L, 100, 156, 58, 12, .8) +
        `<path d="${cone}" fill="url(#${u}-wood)"/><path d="${cone}" fill="url(#${u}-grain)"/><path d="${cone}" fill="url(#${u}-edge)" opacity=".65"/>` +
        `<path d="M58 150A42 8 0 0 0 142 150" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.3"/>` +
        hlp("M89 70C87 96 76 122 68 144", 2.6, .28) + hlp("M95 70C94 84 91 96 88 104", 1.2, .18) +
        `<ellipse cx="100" cy="62" rx="15" ry="3.6" fill="url(#${u}-cert)"/>` + nozzle(100, 62, 6.5, 1.9) +
        `<circle cx="100" cy="158" r="2.6" fill="#15181d" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>` + dot(o, 112, 158, 1.2, "#7dd3fc") +
        wisp(o, 100, 60));
    }),

    icm("speckled", "Ceramic vase", sw("#ffd27a"), "Light", (o, L) => {
      const u = o.uid, vase = "M90 58H110C110 70 108 78 114 88C128 104 142 118 142 140C142 160 124 168 100 168C76 168 58 160 58 140C58 118 72 104 86 88C92 78 90 70 90 58Z";
      let spk = ""; for (let i = 0; i < 46; i++) { const y = 64 + rnd(i, 1) * 100, hw = y < 90 ? 10 + (y - 64) * .3 : 40, x = 100 + (rnd(i, 2) * 2 - 1) * hw; spk += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${i % 3 ? .6 : .95}" fill="#3a3330" opacity="${n2(.3 + rnd(i, 3) * .35)}"/>`; }
      let holes = ""; for (let i = 0; i < 9; i++) { const t = i / 8, x = 70 + t * 60, y = 150 + Math.sin(t * Math.PI) * 7; holes += L.on ? `<circle cx="${n1(x)}" cy="${n1(y)}" r="3.6" fill="url(#${u}-halo)" opacity="${n2(kl(L))}"/><circle cx="${n1(x)}" cy="${n1(y)}" r="1.4" fill="${H().mix(o.color, "#ffffff", .5)}"/>` : `<circle cx="${n1(x)}" cy="${n1(y)}" r="1.4" fill="#4a423b"/><circle cx="${n1(x)}" cy="${n1(y + .4)}" r="1" fill="#211c18"/>`; }
      return svg(o,
        `<clipPath id="${u}-vc"><path d="${vase}"/></clipPath>` +
        sh(o, 100, 172, 50, 6) + pool(L, 100, 168, 66, 10) +
        `<path d="${vase}" fill="url(#${u}-cer)"/><g clip-path="url(#${u}-vc)">${spk}<rect x="50" y="160" width="100" height="10" fill="#7a6f60" opacity=".55"/></g>` +
        `<path d="${vase}" fill="url(#${u}-edge)" opacity=".55"/>` +
        hlp("M84 96C72 110 64 122 63 138", 2.8, .45) + hlp("M95 64V80", 1.4, .4) +
        `<path d="M60 140C60 156 78 164 100 164C122 164 140 156 140 140" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="4"/>` + holes +
        `<ellipse cx="100" cy="58" rx="10" ry="2.6" fill="url(#${u}-cert)"/>` + nozzle(100, 58, 6, 1.7) +
        wisp(o, 100, 56, { s: .95 }));
    }),

    icm("glassdome", "Glass dome", sw("#c4b5fd"), "Light", (o, L) => {
      const u = o.uid, h = H(), dome = "M62 148V112A38 40 0 0 1 138 112V148Z", c = o.color, cl = h.mix(c, "#ffffff", .55);
      const fr = L.on ? `<radialGradient id="${u}-fr" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="${cl}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity=".55"/></radialGradient>`
        : `<radialGradient id="${u}-fr" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".42"/><stop offset="1" stop-color="#c9d2e0" stop-opacity=".16"/></radialGradient>`;
      return svg(o,
        sh(o, 100, 178, 58, 7) + halo(L, 100, 118, 66, 62, .55) + pool(L, 100, 170, 80, 12, .7) +
        `<path d="${cylP(54, 146, 150, 168, 8)}" fill="url(#${u}-wood)"/><path d="${cylP(54, 146, 150, 168, 8)}" fill="url(#${u}-grain)"/><path d="${cylP(54, 146, 150, 168, 8)}" fill="url(#${u}-edge)" opacity=".5"/>` +
        `<ellipse cx="100" cy="150" rx="46" ry="8" fill="url(#${u}-woodt)"/>` + seam(54, 146, 160, 8) +
        `<ellipse cx="100" cy="149" rx="39" ry="6.2" fill="#000" fill-opacity=".3"/>` +
        `<path d="${cylP(86, 114, 116, 148, 4)}" fill="url(#${u}-cer)" opacity=".85"/><ellipse cx="100" cy="116" rx="14" ry="4" fill="#fff" opacity=".7"/>` +
        `<path d="${dome}" fill="url(#${u}-fr)"/><path d="${dome}" fill="url(#${u}-gls)" stroke="#f4f8ff" stroke-opacity=".55" stroke-width="1"/>` +
        (L.on ? `<g opacity="${n2(.35 * kl(L))}"><ellipse class="${P}glow" cx="100" cy="122" rx="20" ry="16" fill="#ffffff"/></g>` : "") +
        `<path d="M62 148A38 6 0 0 0 138 148" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/>` +
        hlp("M70 140V112C70 98 76 86 86 79", 3, .5) + hlp("M78 136V116", 1.4, .3) +
        `<ellipse cx="100" cy="72.5" rx="7" ry="2" fill="#f4f8ff" fill-opacity=".6"/>` + nozzle(100, 72.5, 4.6, 1.4) +
        wisp(o, 100, 71, { tint: L.on, s: .95 }));
    }),

    icm("marble", "Marble stone", sw("#7dd3fc"), "Light", (o, L) => {
      const u = o.uid, peb = "M50 138C50 104 76 92 100 92C124 92 150 104 150 138C150 160 128 170 100 170C72 170 50 160 50 138Z";
      const mb = `<radialGradient id="${u}-mb" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e4e3ea"/><stop offset="1" stop-color="#9c9aa8"/></radialGradient>`;
      const veins = ["M54 120C70 126 78 112 92 118S118 140 136 128", "M66 104C74 112 84 104 96 110", "M110 98C118 108 134 104 146 116", "M60 150C76 144 92 158 112 150S138 142 148 148", "M92 118C96 128 90 134 98 142"];
      const lc = H().mix(o.color, "#ffffff", .45);
      return svg(o,
        `<clipPath id="${u}-pc"><path d="${peb}"/></clipPath>` +
        sh(o, 100, 174, 56, 6) + pool(L, 100, 168, 76, 12, .9) +
        `<path d="${peb}" fill="url(#${u}-mb)"/><g clip-path="url(#${u}-pc)">` +
        veins.map((d, i) => `<path d="${d}" fill="none" stroke="#7e7a8e" stroke-opacity="${i % 2 ? .3 : .45}" stroke-width="${i % 2 ? .7 : 1.3}"/>`).join("") +
        `<path d="M50 160H150V172H50Z" fill="#000" opacity=".14"/></g>` +
        `<path d="${peb}" fill="url(#${u}-edge)" opacity=".4"/>` +
        (L.on ? `<path d="${arcF(51, 149, 138, 12)}" fill="none" stroke="url(#${u}-halo)" stroke-width="10" opacity="${n2(kl(L) * .8)}"/><path d="${arcF(51, 149, 138, 12)}" fill="none" stroke="${lc}" stroke-width="2.2" opacity="${n2(kl(L))}"/>` + halo(L, 100, 148, 60, 14, .6)
          : `<path d="${arcF(51, 149, 138, 12)}" fill="none" stroke="#2a2a33" stroke-opacity=".6" stroke-width="1.6"/>`) +
        `<path d="${arcF(51, 149, 139.6, 12)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>` +
        hlp("M64 112C72 102 84 97 96 96", 3, .7) +
        `<ellipse cx="100" cy="94" rx="8" ry="2.2" fill="#d6d5de"/>` + nozzle(100, 94, 5, 1.5) +
        wisp(o, 100, 93), mb);
    }),

    icm("nebulizer", "Glass nebulizer", sw("#ffd27a"), "Light", (o, L) => {
      const u = o.uid, gl = "M92 138C80 134 72 124 72 110C72 94 84 85 94 82C95 74 96 68 97 58H103C104 68 105 74 106 82C116 85 128 94 128 110C128 124 120 134 108 138Z";
      return svg(o,
        `<clipPath id="${u}-gc"><path d="${gl}"/></clipPath>` +
        sh(o, 100, 178, 46, 6) + pool(L, 100, 172, 62, 10, .8) +
        `<path d="${cylP(66, 134, 140, 172, 8)}" fill="url(#${u}-wood)"/><path d="${cylP(66, 134, 140, 172, 8)}" fill="url(#${u}-grain)"/><path d="${cylP(66, 134, 140, 172, 8)}" fill="url(#${u}-edge)" opacity=".55"/>` +
        `<ellipse cx="100" cy="140" rx="34" ry="8" fill="url(#${u}-woodt)"/>` + seam(66, 134, 164, 8) +
        `<ellipse cx="100" cy="140" rx="20" ry="4.6" fill="none" stroke="${L.on ? H().mix(o.color, "#ffffff", .4) : "#3a3f47"}" stroke-width="2" opacity="${L.on ? n2(kl(L)) : 1}"/>` +
        `<path d="M86 140V134H114V140Z" fill="url(#${u}-st)"/><ellipse cx="100" cy="134" rx="14" ry="3" fill="#cfd5db"/>` +
        `<path d="${gl}" fill="#0b1626" fill-opacity=".3"/><g clip-path="url(#${u}-gc)">` +
        `<rect x="70" y="120" width="60" height="22" fill="url(#${u}-amb)"/><path d="M70 120q5 -1.6 10 0t10 0t10 0t10 0t10 0t10 0V123H70Z" fill="#ffe2a8" opacity=".5"/>` +
        (L.on ? `<rect x="70" y="56" width="60" height="84" fill="url(#${u}-up)" opacity="${n2(kl(L) * .8)}"/>` : "") +
        `<path d="M99 136V66" stroke="#fff" stroke-opacity=".35" stroke-width="1.6"/></g>` +
        `<path d="${gl}" fill="url(#${u}-gls)" stroke="#e8f6ff" stroke-opacity=".6" stroke-width="1"/>` +
        hlp("M80 100C82 94 86 90 91 88", 2.6, .55) + hlp("M78 116C78 112 78 110 79 107", 1.6, .3) +
        `<ellipse cx="100" cy="58" rx="3" ry="1" fill="#e8f6ff" opacity=".8"/>` +
        dot(o, 100, 160, 1.3, H().mix(o.color, "#ffffff", .3)) +
        wisp(o, 100, 57, { wd: .45, s: .9, h: 46, n: 8 }));
    }),

    ic("reed", "Reed bottle", OIL, "Oil", (o) => {
      const u = o.uid, h = H(), bt = "M70 170Q66 170 66 164V124Q66 114 78 112H92V100H108V112H122Q134 114 134 124V164Q134 170 130 170Z";
      const reeds = [-26, -17, -9, -2, 6, 14, 23].map((a, i) => { const r = a * Math.PI / 180, L = 104 + (i % 3) * 8, x = 100 + Math.sin(r) * L, y = 150 - Math.cos(r) * L; return [x, y, a]; });
      const rc = o.on ? h.mix("#c9a57a", o.color, .25) : "#c9a57a";
      let rd = "", rin = "";
      reeds.forEach(([x, y], i) => {
        const nx = 100 + (x - 100) * (50 / 140), ny = 150 + (y - 150) * (50 / 140);
        rd += `<path d="M${n1(nx)} ${n1(ny)}L${n1(x)} ${n1(y)}" stroke="#3b2a1a" stroke-opacity=".45" stroke-width="2.6" stroke-linecap="round"/><path d="M${n1(nx)} ${n1(ny)}L${n1(x)} ${n1(y)}" stroke="${rc}" stroke-width="1.8" stroke-linecap="round"/>` +
          `<path d="M${n1(x + (nx - x) * .14)} ${n1(y + (ny - y) * .14)}L${n1(x)} ${n1(y)}" stroke="${h.shade(o.color, -.25)}" stroke-opacity="${n2(.3 + .5 * o.level)}" stroke-width="1.8" stroke-linecap="round"/>`;
        rin += `<path d="M100 150L${n1(nx)} ${n1(ny)}" stroke="${rc}" stroke-opacity=".5" stroke-width="1.6"/>`;
      });
      return svg(o,
        `<clipPath id="${u}-bc"><path d="${bt}"/></clipPath>` +
        sh(o, 100, 174, 48, 6) +
        `<path d="${bt}" fill="#0b1626" fill-opacity=".35"/><g clip-path="url(#${u}-bc)">` +
        `<rect x="64" y="134" width="72" height="40" fill="url(#${u}-oil)"/><path d="M64 134q6 -1.8 12 0t12 0t12 0t12 0t12 0t12 0V137H64Z" fill="#fff" opacity=".35"/>` + rin +
        `<rect x="64" y="163" width="72" height="8" fill="#fff" opacity=".18"/></g>` +
        `<path d="${bt}" fill="url(#${u}-gls)" stroke="#e8f6ff" stroke-opacity=".55" stroke-width="1"/>` +
        hlp("M72 126V160", 2.6, .45) + hlp("M78 118C82 116 86 115 90 115", 1.4, .35) +
        `<path d="${rr(90, 94, 20, 8, 2)}" fill="url(#${u}-brass)"/><path d="M91 96H109" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/>` +
        rd + reeds.filter((r, i) => i % 2 === 0).map((r, i) => waves(o, n1(r[0]), n1(r[1] - 6), i)).join(""));
    }),

    icm("plugin", "Plug-in", sw("#ffd27a"), "Light", (o, L) => {
      const u = o.uid, h = H(), body = "M76 50C76 42 84 38 100 38C116 38 124 42 124 50V108C124 116 116 120 100 120C84 120 76 116 76 108Z", bot = "M84 122H116V150Q116 160 106 160H94Q84 160 84 150Z";
      let vents = ""; for (let i = 0; i < 6; i++) vents += `<path d="M${88 + i * 5} 54V72" stroke="#000" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/><path d="M${89 + i * 5} 54V72" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>`;
      return svg(o,
        `<path d="${rr(58, 18, 84, 168, 10)}" fill="url(#${u}-cert)"/><path d="${rr(58, 18, 84, 168, 10)}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/><path d="M62 22H138" stroke="#fff" stroke-opacity=".8" stroke-width="1"/>` +
        `<circle cx="100" cy="28" r="2.6" fill="#d4d0c8" stroke="#000" stroke-opacity=".2" stroke-width=".5"/><path d="M98.4 28H101.6" stroke="#8a857c" stroke-width=".8"/>` +
        `<path d="${rr(80, 164, 40, 18, 7)}" fill="#e2ddd3" stroke="#000" stroke-opacity=".15" stroke-width=".8"/><path d="M93 168V175M107 168V175" stroke="#2a2a2a" stroke-width="1.8" stroke-linecap="round"/><path d="M98.5 177Q100 179 101.5 177" stroke="#2a2a2a" stroke-width="1.4" fill="none"/>` +
        halo(L, 100, 92, 46, 40, .5) +
        `<path d="${body}" transform="translate(4 5)" fill="#000" opacity=".2"/>` +
        `<path d="${bot}" fill="#0b1626" fill-opacity=".35"/><clipPath id="${u}-oc"><path d="${bot}"/></clipPath><g clip-path="url(#${u}-oc)"><rect x="82" y="126" width="36" height="36" fill="url(#${u}-amb)"/><path d="M99 120V160" stroke="#f2ead8" stroke-opacity=".55" stroke-width="3"/></g>` +
        `<path d="${bot}" fill="url(#${u}-gls)" stroke="#e8f6ff" stroke-opacity=".55" stroke-width="1"/>` + hlp("M88 128V150", 2, .45) +
        `<path d="${body}" fill="url(#${u}-cer)"/><path d="${body}" fill="url(#${u}-edge)" opacity=".4"/>` + vents +
        `<path d="M80 50C82 44 90 42 100 42" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>` +
        `<circle cx="100" cy="94" r="12" fill="${L.on ? h.mix("#ffffff", o.color, .5 + .4 * L.level) : "#d9d5cc"}" stroke="#000" stroke-opacity=".15" stroke-width="1"/>` +
        (L.on ? `<g opacity="${n2(kl(L))}"><circle class="${P}glow" cx="100" cy="94" r="20" fill="url(#${u}-halo)"/></g><circle cx="100" cy="94" r="6" fill="#fff" opacity=".7"/>` : `<circle cx="100" cy="94" r="8" fill="#fff" opacity=".35"/>`) +
        `<path d="${rr(92, 110, 16, 5, 2.5)}" fill="#b9b4aa"/>` +
        wisp(o, 100, 48, { s: .7, wd: .6, h: 26, n: 7 }));
    }),

    ic("autospray", "Auto spray", sw("#eef0ef", BODY), "Body", (o) => {
      const u = o.uid, p = pal(o.color), body = "M72 46C72 34 84 28 100 28C116 28 128 34 128 46V160C128 166 124 170 118 170H82C76 170 72 166 72 160Z";
      const per = (6.5 - 3.5 * o.level).toFixed(2);
      let spray = "";
      if (o.on) {
        let dots = ""; for (let i = 0; i < 26; i++) { const t = rnd(i, 4), x = 6 + t * 60, y = (rnd(i, 5) * 2 - 1) * (2 + t * 13); dots += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n2(.5 + rnd(i, 6) * .9)}" fill="#f4f8ff" opacity="${n2(.9 - t * .5)}"/>`; }
        spray = `<g transform="translate(130 46) rotate(-28)"><g opacity="${n2(km(o))}"><g class="${P}spray" style="animation-duration:${per}s">` +
          `<rect x="0" y="-18" width="70" height="36" fill="none" opacity="0"/>` +
          `<path d="M0 -1.5L62 -15C68 -6 68 6 62 15L0 1.5Z" fill="url(#${u}-mp)" opacity=".5"/>` +
          `<ellipse cx="22" cy="0" rx="14" ry="6" fill="url(#${u}-mp)" opacity=".9"/><ellipse cx="40" cy="-2" rx="16" ry="9" fill="url(#${u}-mp)" opacity=".75"/><ellipse cx="54" cy="2" rx="14" ry="10" fill="url(#${u}-mp)" opacity=".55"/>` +
          dots + `</g></g></g>`;
      }
      return svg(o,
        `<path d="${body}" transform="translate(5 6)" fill="#000" opacity=".28"/>` +
        `<path d="${body}" fill="url(#${u}-c)"/><path d="${body}" fill="url(#${u}-edge)" opacity=".4"/>` +
        `<path d="M76 46C76 38 86 32 100 32" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.8" stroke-linecap="round"/>` +
        `<path d="M74 66H126" stroke="#000" stroke-opacity=".22" stroke-width="1.4"/><path d="M74 67.6H126" stroke="#fff" stroke-opacity=".25" stroke-width=".8"/>` +
        `<path d="${rr(119, 41, 12, 10, 3)}" fill="#1b1f26"/><circle cx="128" cy="46" r="1.6" fill="#05070a"/>` +
        `<path d="${rr(84, 84, 32, 62, 8)}" fill="#0b1626" fill-opacity=".55" stroke="${p.e}" stroke-width=".8"/>` +
        `<clipPath id="${u}-wc"><path d="${rr(84, 84, 32, 62, 8)}"/></clipPath><g clip-path="url(#${u}-wc)"><rect x="88" y="88" width="24" height="70" rx="4" fill="url(#${u}-st)" opacity=".8"/><rect x="88" y="104" width="24" height="22" fill="${o.color === "#eef0ef" ? "#7aa6c9" : H().mix(o.color, "#ffffff", .3)}" opacity=".55"/><path d="M84 86L116 120" stroke="#fff" stroke-opacity=".14" stroke-width="10"/></g>` +
        `<circle cx="100" cy="76" r="3" fill="#15181d" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/>` +
        (o.on ? `<g class="${P}blink" style="animation-duration:${per}s"><circle cx="100" cy="158" r="5" fill="#34d399" opacity=".28"/><circle cx="100" cy="158" r="1.8" fill="#34d399"/></g>` : `<circle cx="100" cy="158" r="1.8" fill="#4b5058"/>`) +
        spray);
    }),

    icm("scentpod", "Smart pod", sw("#c4b5fd"), "Light", (o, L) => {
      const u = o.uid, h = H(), lc = h.mix(o.color, "#ffffff", .4);
      return svg(o,
        sh(o, 100, 172, 54, 7) + halo(L, 100, 112, 62, 26, .55) +
        `<path d="${cylP(56, 144, 112, 160, 10)}" fill="url(#${u}-blk)"/><path d="${cylP(56, 144, 112, 160, 10)}" fill="#fff" opacity=".04"/>` +
        `<path d="M62 120V152" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>` + seam(56, 144, 150, 10) +
        `<ellipse cx="100" cy="112" rx="44" ry="10" fill="#2e333b"/><ellipse cx="100" cy="112" rx="38" ry="8" fill="#1a1d23"/>` +
        `<ellipse cx="100" cy="112" rx="41" ry="9" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="3"/>` +
        (L.on ? `<ellipse cx="100" cy="112" rx="41" ry="9" fill="none" stroke="url(#${u}-halo)" stroke-width="9" opacity="${n2(kl(L) * .7)}"/>` +
          `<ellipse cx="100" cy="112" rx="41" ry="9" fill="none" stroke="${lc}" stroke-width="2.4" pathLength="100" stroke-dasharray="${n1(18 + 82 * L.level)} 100" stroke-linecap="round"/>` : "") +
        `<path d="${cylP(84, 116, 98, 112, 4)}" fill="url(#${u}-st)"/><ellipse cx="100" cy="98" rx="16" ry="4" fill="#d5dade"/>` +
        `<ellipse cx="100" cy="98" rx="10" ry="2.4" fill="url(#${u}-amb)"/>` +
        [-8, -4, 0, 4, 8].map((x) => `<path d="M${100 + x} 96.4V99.6" stroke="#0b0d10" stroke-width="1.2" stroke-linecap="round"/>`).join("") +
        dot(o, 100, 146, 1.4, lc) +
        wisp(o, 94, 95, { s: .7, wd: .5, h: 30, n: 7, k: .7 }) + wisp(o, 106, 95, { s: .7, wd: .5, h: 34, n: 7, k: .6, d: 7 }));
    }),

    ic("candlewarmer", "Candle warmer", sw("#ffd27a"), "Light", (o) => {
      const u = o.uid, h = H(), jar = "M74 122H126V162Q126 168 120 168H80Q74 168 74 162Z", shade = "M74 88C76 70 86 60 100 60C114 60 124 70 126 88Z";
      const wax = o.on ? h.mix("#f3e6cf", o.color, .18) : "#efe6d6";
      return svg(o,
        sh(o, 104, 180, 60, 6) +
        (o.on ? `<path d="M76 88L66 166H134L124 88Z" fill="url(#${u}-cone)" opacity="${n2(kl(o) * .7)}"/>` : "") + pool(o, 100, 174, 64, 8) +
        `<path d="${cylP(60, 150, 170, 176, 5)}" fill="url(#${u}-brass)"/><ellipse cx="105" cy="170" rx="45" ry="5" fill="#c99a3e"/>` +
        `<path d="M142 170V56C142 44 134 40 124 40H112" fill="none" stroke="url(#${u}-brass)" stroke-width="5" stroke-linecap="round"/><path d="M140.6 168V56C140.6 46 134 42 124 42" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>` +
        `<path d="M112 40H104V60" fill="none" stroke="url(#${u}-brass)" stroke-width="4"/>` +
        `<path d="${jar}" fill="#0b1626" fill-opacity=".4"/><clipPath id="${u}-jc"><path d="${jar}"/></clipPath><g clip-path="url(#${u}-jc)"><rect x="74" y="128" width="52" height="40" fill="${wax}"/><rect x="74" y="128" width="52" height="40" fill="url(#${u}-edge)" opacity=".5"/>` +
        `<ellipse cx="100" cy="128" rx="26" ry="5" fill="${o.on ? h.mix("#fff8e6", o.color, .35) : "#f7efe2"}"/>` +
        (o.on ? `<g opacity=".5"><ellipse class="${P}pulse" cx="100" cy="128" rx="18" ry="3" fill="#fff"/></g>` : `<ellipse cx="100" cy="128" rx="5" ry="1.6" fill="#e2d4bb"/>`) + `</g>` +
        `<path d="M99 128V122" stroke="#2a2420" stroke-width="1.2" stroke-linecap="round"/>` +
        `<path d="${jar}" fill="url(#${u}-gls)" stroke="#e8f6ff" stroke-opacity=".5" stroke-width="1"/>` + hlp("M80 126V160", 2.4, .45) +
                `<path d="${shade}" fill="url(#${u}-blk)"/><path d="M80 82C82 70 90 64 100 63" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>` +
        `<ellipse cx="100" cy="88" rx="26" ry="5" fill="${o.on ? h.mix(o.color, "#ffffff", .3) : "#2a2f35"}"/>` +
        (o.on ? `<g opacity="${n2(kl(o))}"><ellipse class="${P}glow" cx="100" cy="90" rx="18" ry="4.4" fill="#fff8e6"/></g>` + halo(o, 100, 90, 44, 22, .7) : "") +
        `<path d="M74 88H126" stroke="#c99a3e" stroke-width="1.6"/>` +
        wisp(o, 100, 124, { s: .55, wd: .6, h: 20, n: 6, k: .55 }));
    }),

    ic("waxmelt", "Wax burner", ["#c9a7e8", "#f2b8c8", "#a7f3d0", "#ffd27a", "#8fc7e8", "#f6efe2"], "Wax", (o) => {
      const u = o.uid, h = H(), bd = "M64 98C64 98 66 160 68 166Q70 170 76 170H124Q130 170 132 166C134 160 136 98 136 98Z", arch = "M86 170V144A14 14 0 0 1 114 144V170Z";
      const wax = h.shade(o.color, -.05), cubes = [[86, 86], [98, 84], [110, 87], [104, 90]];
      return svg(o,
        sh(o, 100, 176, 52, 6) + (o.on ? `<ellipse cx="100" cy="174" rx="34" ry="6" fill="url(#${u}-warm)" opacity=".6"/>` : "") +
        `<path d="${bd}" fill="#2f343d"/><path d="${bd}" fill="url(#${u}-blk)" opacity=".75"/><path d="${bd}" fill="#5a6a80" opacity=".18"/>` +
        hlp("M70 104C70 130 71 150 73 162", 2.4, .3) +
        `<path d="${arch}" fill="#0a0806"/>` +
        (o.on ? `<path d="${arch}" fill="url(#${u}-warm)" opacity=".9"/>` : "") +
        `<path d="M90 170V164H110V170Z" fill="url(#${u}-st)"/><ellipse cx="100" cy="164" rx="10" ry="2.2" fill="#e8e1d2"/>` +
        (o.on ? `<g class="${P}flk"><path d="M100 152C96 157 97 162 100 163C103 162 104 157 100 152Z" fill="url(#${u}-fl)"/></g><path d="M100 160V163" stroke="#2a2420" stroke-width=".8"/>` : `<path d="M100 159V163" stroke="#2a2420" stroke-width="1"/>`) +
        [[78, 120], [122, 120], [78, 136], [122, 136], [100, 118]].map(([x, y], i) => o.on
          ? `<circle class="${P}flk" cx="${x}" cy="${y}" r="2.6" fill="#ffc46a" style="animation-delay:-${i * .3}s"/><circle cx="${x}" cy="${y}" r="6" fill="url(#${u}-warm)" opacity=".5"/>`
          : `<circle cx="${x}" cy="${y}" r="2.6" fill="#0a0806"/>`).join("") +
        `<path d="M58 96Q60 80 100 80Q140 80 142 96Q140 104 100 104Q60 104 58 96Z" fill="url(#${u}-blk)"/><path d="M58 96Q60 80 100 80Q140 80 142 96Q140 104 100 104Q60 104 58 96Z" fill="#5a6a80" opacity=".18"/>` +
        `<ellipse cx="100" cy="88" rx="38" ry="7.6" fill="#1a1d23"/>` +
        (o.on ? `<ellipse cx="100" cy="89" rx="34" ry="6.2" fill="${wax}"/><ellipse cx="100" cy="89" rx="34" ry="6.2" fill="url(#${u}-edge)" opacity=".4"/><g opacity=".5"><ellipse class="${P}pulse" cx="92" cy="87.6" rx="16" ry="2" fill="#fff"/></g>`
          : `<ellipse cx="100" cy="90" rx="30" ry="5" fill="${h.shade(wax, -.2)}" opacity=".6"/>` + cubes.map(([x, y]) => `<path d="M${x - 5} ${y}L${x} ${y - 3}L${x + 5} ${y}L${x} ${y + 3}Z" fill="${h.shade(wax, .3)}"/><path d="M${x - 5} ${y}L${x} ${y + 3}V${y + 7}L${x - 5} ${y + 4}Z" fill="${wax}"/><path d="M${x} ${y + 3}L${x + 5} ${y}V${y + 4}L${x} ${y + 7}Z" fill="${h.shade(wax, -.25)}"/>`).join("")) +
        `<path d="M62 92Q66 84 90 82" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>` +
        wisp(o, 96, 86, { s: .7, wd: .6, h: 28, n: 7, k: .6 }) + wisp(o, 108, 87, { s: .6, wd: .5, h: 24, n: 6, k: .5, d: 7.4 }));
    }),

    ic("carvent", "Car vent clip", sw("#3d4148", ["#3d4148", "#b8d8a0", "#e8c5c0", "#bcd4e6", "#dac9a9", "#c9a7e8"]), "Body", (o) => {
      const u = o.uid, p = pal(o.color), d = (2.8 - 1.4 * o.level).toFixed(2);
      let sl = ""; for (let i = 0; i < 6; i++) { const y = 66 + i * 12; sl += `<path d="M30 ${y}H170V${y + 7}H30Z" fill="url(#${u}-sl)"/><path d="M30 ${y + .6}H170" stroke="#fff" stroke-opacity=".12" stroke-width=".8"/>`; }
      let air = "";
      if (o.on) [[44, 70], [40, 94], [46, 120], [156, 72], [160, 98], [154, 124]].forEach(([x, y], i) => {
        const R = x > 100; air += `<g class="${P}air${R ? "R" : "L"}" style="animation-duration:${d}s;animation-delay:-${n2(i * .41)}s"><path d="M${x - 8} ${y}q4 -3 8 0t8 0" fill="none" stroke="${H().mix(o.color, "#e8f0ff", .7)}" stroke-opacity="${n2(.65 * km(o))}" stroke-width="1.6" stroke-linecap="round"/></g>`;
      });
      let perf = ""; for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; perf += `<circle cx="${n1(100 + Math.cos(a) * 19)}" cy="${n1(98 + Math.sin(a) * 19)}" r="1.3" fill="#000" fill-opacity=".45"/>`; }
      return svg(o,
        `<path d="${rr(22, 56, 156, 84, 14)}" fill="#14171c"/><path d="${rr(22, 56, 156, 84, 14)}" fill="none" stroke="#3a3f48" stroke-width="3"/><path d="${rr(24, 58, 152, 80, 12)}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1"/>` +
        `<clipPath id="${u}-vc"><path d="${rr(26, 60, 148, 76, 10)}"/></clipPath><g clip-path="url(#${u}-vc)">${sl}</g>` +
        `<path d="M96 132V146" stroke="#2a2e35" stroke-width="6"/><circle cx="104" cy="104" r="34" fill="#000" opacity=".35"/>` +
        air +
        `<circle cx="100" cy="98" r="34" fill="url(#${u}-st)"/><circle cx="100" cy="98" r="34" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1"/>` +
        `<circle cx="100" cy="98" r="29" fill="url(#${u}-s)"/><circle cx="100" cy="98" r="29" fill="none" stroke="${p.e}" stroke-width="1"/>` + perf +
        `<circle cx="100" cy="98" r="8" fill="url(#${u}-st)"/><circle cx="100" cy="98" r="5" fill="url(#${u}-amb)"/><circle cx="98.4" cy="96.4" r="1.6" fill="#fff" opacity=".8"/>` +
        hlp("M76 84C80 76 88 70 98 68", 2.6, .55),
        `<linearGradient id="${u}-sl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a505a"/><stop offset=".5" stop-color="#2a2e35"/><stop offset="1" stop-color="#101216"/></linearGradient>`);
    }),

    ic("usbmini", "USB mini", sw("#7dd3fc"), "Light", (o) => {
      const u = o.uid, h = H();
      return svg(o,
        sh(o, 106, 174, 52, 5) + pool(o, 96, 170, 52, 8) +
        `<path d="M118 160C134 170 140 168 150 166" fill="none" stroke="#1b1f26" stroke-width="3.4" stroke-linecap="round"/><path d="M118 159C134 168 140 166 150 164.6" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="1"/>` +
        `<path d="${rr(148, 158, 16, 12, 2)}" fill="url(#${u}-blk)"/><path d="${rr(163, 159, 14, 10, 1)}" fill="url(#${u}-st)"/><path d="M166 162H174M166 166H174" stroke="#3a3f47" stroke-width="1.2"/>` +
        `<path d="${cylP(76, 116, 104, 164, 6)}" fill="url(#${u}-cer)"/><path d="${cylP(76, 116, 104, 164, 6)}" fill="url(#${u}-edge)" opacity=".4"/>` +
        `<path d="${band(76, 116, 150, 155, 6)}" fill="${o.on ? h.mix(o.color, "#ffffff", .35) : "#b9b4aa"}" opacity="${o.on ? n2(kl(o)) : .8}"/>` + halo(o, 96, 156, 34, 8, .8) +
        hlp("M81 110V146", 2.4, .55) +
        `<ellipse cx="96" cy="104" rx="20" ry="6" fill="url(#${u}-cert)"/><ellipse cx="96" cy="104" rx="14" ry="4" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="1.6"/>` +
        nozzle(96, 104, 5, 1.6) +
        `<circle cx="96" cy="134" r="3" fill="#e4dfd5" stroke="#000" stroke-opacity=".2" stroke-width=".6"/>` +
        wisp(o, 96, 102, { s: .8, wd: .6, n: 8 }));
    }),

    ic("saltlamp", "Salt lamp", ["#ff9b5e", "#ffb36b", "#ffc9de", "#ffd27a", "#c4b5fd"], "Light", (o) => {
      const u = o.uid, h = H(), rock = "M70 152L60 122L66 94L82 76L104 68L122 74L136 90L142 118L134 152Z", c = o.color;
      const rg = o.on ? `<radialGradient id="${u}-rk" cx=".48" cy=".6" r=".65"><stop offset="0" stop-color="${h.mix(c, "#ffffff", .7)}"/><stop offset=".45" stop-color="${h.mix(c, "#ffffff", .15)}"/><stop offset="1" stop-color="${h.shade(c, -.4)}"/></radialGradient>`
        : `<radialGradient id="${u}-rk" cx=".42" cy=".4" r=".7"><stop offset="0" stop-color="#cfa89a"/><stop offset=".55" stop-color="#9a7266"/><stop offset="1" stop-color="#5a4038"/></radialGradient>`;
      const fac = [["M66 94L82 76L92 100L72 116Z", .12], ["M82 76L104 68L106 96L92 100Z", .2], ["M104 68L122 74L118 100L106 96Z", .06], ["M122 74L136 90L128 110L118 100Z", -.12], ["M136 90L142 118L128 110Z", -.22], ["M60 122L72 116L80 140L70 152Z", -.1], ["M92 100L106 96L118 100L112 124L96 126Z", .14], ["M128 110L142 118L134 152L120 140Z", -.18], ["M80 140L96 126L112 124L120 140L104 152Z", .04]];
      return svg(o,
        rg + sh(o, 100, 176, 54, 6) + halo(o, 100, 116, 74, 70, .65) + pool(o, 100, 170, 72, 10) +
        `<path d="${cylP(62, 138, 152, 168, 7)}" fill="url(#${u}-wood)"/><path d="${cylP(62, 138, 152, 168, 7)}" fill="url(#${u}-grain)"/><ellipse cx="100" cy="152" rx="38" ry="7" fill="url(#${u}-woodt)"/>` +
        `<path d="${rock}" fill="url(#${u}-rk)"/>` +
        fac.map(([d, v]) => `<path d="${d}" fill="${v > 0 ? "#fff" : "#000"}" fill-opacity="${n2(Math.abs(v) * (o.on ? .8 : 1))}" stroke="#fff" stroke-opacity="${o.on ? .25 : .12}" stroke-width=".6"/>`).join("") +
        (o.on ? `<g opacity="${n2(.25 * kl(o))}"><ellipse class="${P}glow" cx="100" cy="122" rx="20" ry="18" fill="#fff"/></g>` : "") +
        `<path d="${cylP(86, 114, 66, 72, 3)}" fill="url(#${u}-brass)"/><ellipse cx="100" cy="66" rx="14" ry="3.4" fill="#c99a3e"/><ellipse cx="100" cy="66.4" rx="10" ry="2.2" fill="url(#${u}-amb)"/>` +
        wisp(o, 100, 65, { s: .6, wd: .5, h: 22, n: 6, k: .55 }));
    }),

    ic("flame", "Flame effect", ["#ff8a3d", "#ffb347", "#ff5e3a", "#7dd3fc", "#c4b5fd", "#a7f3d0"], "Light", (o) => {
      const u = o.uid, h = H(), c = o.color, top = "M62 96L74 88H138L126 96Z";
      const fc = `<radialGradient id="${u}-fc" cx=".5" cy=".85" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="${h.mix(c, "#ffffff", .55)}"/><stop offset=".6" stop-color="${c}" stop-opacity=".75"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
      const fl = (x, s, del, k) => `<g transform="translate(${x} 92) scale(${s})"><g class="${P}flk" style="animation-delay:-${del}s;animation-duration:${n2(1.1 + del * .3)}s"><path d="M0 0C-12 -6 -12 -22 -4 -34C-4 -26 2 -24 1 -36C8 -28 12 -16 10 -8C10 -4 6 0 0 0Z" fill="url(#${u}-fc)" opacity="${n2(k * kl(o))}"/></g></g>`;
      return svg(o,
        fc + sh(o, 100, 178, 52, 6) + pool(o, 100, 172, 60, 8, .4) +
        `<path d="M126 96L138 88V160L126 170Z" fill="#14171c"/>` +
        `<path d="M62 96H126V170H62Z" fill="url(#${u}-blk)"/><path d="M62 96H126V170H62Z" fill="url(#${u}-grain)" opacity=".5"/>` +
        `<path d="${top}" fill="#3a3f48"/><path d="M62 96H126L138 88" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` +
        `<path d="${rr(84, 90, 32, 4, 2)}" fill="#05070a"/>` +
        (o.on ? `<path d="M84 92H116" stroke="${h.mix(c, "#ffffff", .4)}" stroke-width="2" opacity="${n2(kl(o))}"/>` + halo(o, 100, 74, 46, 40, .6) : "") +
        `<path d="M66 100V166" stroke="#fff" stroke-opacity=".16" stroke-width="2.4" stroke-linecap="round"/>` +
        `<circle cx="94" cy="154" r="3" fill="#2a2e35" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/><circle cx="106" cy="154" r="3" fill="#2a2e35" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/>` +
        dot(o, 100, 142, 1.2, h.mix(c, "#ffffff", .3)) +
        (o.on ? wisp(o, 100, 74, { tint: true, s: 1, wd: .8, n: 8, h: 30 }) + fl(92, .85, .2, .8) + fl(108, .75, .55, .7) + fl(100, 1.05, 0, 1) : ""));
    }),

    ic("backflow", "Backflow falls", ["#4a4e57", "#7d9c8f", "#b9a58a", "#e8e4dc", "#8a6a5a"], "Body", (o) => {
      const u = o.uid, p = pal(o.color), gz = `<linearGradient id="${u}-gz" x1="0" x2="1"><stop offset="0" stop-color="${p.k}"/><stop offset=".32" stop-color="${H().mix(p.m, "#ffffff", .18)}"/><stop offset=".6" stop-color="${p.d}"/><stop offset="1" stop-color="${H().shade(p.m, -.7)}"/></linearGradient>`, mt = "M48 160C52 130 60 104 70 86C76 72 80 58 88 48C96 40 106 44 110 54C116 70 128 86 136 104C144 122 150 140 152 160Z";
      const ledge = (x, y, w) => `<path d="M${x - w} ${y}Q${x} ${y + 6} ${x + w} ${y}Q${x} ${y + 2} ${x - w} ${y}Z" fill="#000" opacity=".35"/><path d="M${x - w} ${y}Q${x} ${y - 3.4} ${x + w} ${y}Q${x} ${y + 2} ${x - w} ${y}Z" fill="${p.l}" opacity=".7"/>`;
      return svg(o,
        sh(o, 100, 178, 64, 7) +
        `<path d="${cylP(40, 160, 160, 170, 9)}" fill="url(#${u}-c)"/><ellipse cx="100" cy="160" rx="60" ry="9" fill="url(#${u}-tp)"/><ellipse cx="102" cy="161" rx="48" ry="6" fill="${p.k}"/>` +
        gz + `<path d="${mt}" fill="url(#${u}-gz)"/><path d="${mt}" fill="url(#${u}-edge)" opacity=".5"/>` +
        `<path d="M74 84C70 100 62 120 58 140" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round"/><path d="M92 50C96 46 102 46 106 52" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>` +
        `<path d="M120 90C126 104 132 120 136 138" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>` +
        ledge(94, 66, 9) + ledge(112, 92, 11) + ledge(92, 118, 12) + ledge(110, 142, 13) +
        `<path d="M93 60L97 46L101 60Z" fill="#7a4a30"/><path d="M95 54L97 46L99 54Z" fill="${o.on ? "#9a9590" : "#5a3a28"}"/>` +
        (o.on ? `<circle cx="97" cy="47" r="5" fill="url(#${u}-ember)" class="${P}pulse"/><circle cx="97" cy="47" r="1.3" fill="#fff2c4"/>` : "") +
        fall(o, [[97, 50], [94, 64], [104, 70], [112, 90], [104, 96], [92, 116], [100, 124], [110, 140], [104, 150], [102, 160]]) +
        (o.on ? `<g opacity="${n2(.6 + .4 * o.level)}"><ellipse class="${P}glow" cx="102" cy="160" rx="34" ry="5" fill="url(#${u}-mp)"/></g><g opacity=".35"><ellipse class="${P}pulse" cx="96" cy="161" rx="22" ry="3" fill="#fff"/></g>` : ""));
    }),

    ic("incense", "Incense stick", ["#8a5a36", "#3d4148", "#e8e4dc", "#7d9c8f", "#b98a5a"], "Body", (o) => {
      const u = o.uid, p = pal(o.color), top = "M24 160Q60 150 100 150Q140 150 176 140Q172 148 150 152Q120 158 100 158Q60 158 30 164Z", side = "M30 164Q60 158 100 158Q120 158 150 152Q172 148 176 140Q176 148 152 158Q124 166 100 166Q62 166 32 170Z";
      const tip = [118, 70], bs = [52, 155];
      const ash = o.on ? [tip[0] - (tip[0] - bs[0]) * .1, tip[1] - (tip[1] - bs[1]) * .1] : tip;
      return svg(o,
        sh(o, 100, 172, 80, 6) +
        `<path d="${side}" fill="url(#${u}-c)"/><path d="${top}" fill="url(#${u}-v)"/><path d="${top}" fill="url(#${u}-grain)" opacity=".6"/>` +
        `<path d="M32 160Q62 152 100 152Q140 152 170 143" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` +
        `<ellipse cx="52" cy="155" rx="3" ry="1.4" fill="#120c08"/>` +
        (o.on ? [[96, 153], [104, 152], [110, 154], [118, 151], [100, 155]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? .9 : 1.3}" fill="#9a9590" opacity=".8"/>`).join("") + `<path d="M108 152.6l6 -1" stroke="#a8a39d" stroke-width="1.6" stroke-linecap="round"/>` : "") +
        `<path d="M${bs[0]} ${bs[1]}L${bs[0] + (tip[0] - bs[0]) * .3} ${bs[1] + (tip[1] - bs[1]) * .3}" stroke="#7a2e22" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M${bs[0] + (tip[0] - bs[0]) * .3} ${bs[1] + (tip[1] - bs[1]) * .3}L${n1(ash[0])} ${n1(ash[1])}" stroke="#5e3a2a" stroke-width="3.2" stroke-linecap="round"/><path d="M${bs[0] + (tip[0] - bs[0]) * .3 - .8} ${bs[1] + (tip[1] - bs[1]) * .3}L${n1(ash[0] - .8)} ${n1(ash[1])}" stroke="#a26a4a" stroke-opacity=".6" stroke-width="1"/>` +
        (o.on ? `<path d="M${n1(ash[0])} ${n1(ash[1])}L${tip[0]} ${tip[1]}" stroke="#b5b0aa" stroke-width="3" stroke-linecap="round"/><circle class="${P}pulse" cx="${tip[0]}" cy="${tip[1]}" r="7" fill="url(#${u}-ember)"/><circle cx="${tip[0]}" cy="${tip[1]}" r="1.6" fill="#ffe2a8"/>` : "") +
        smoke(o, tip[0], tip[1] - 2, { h: 64 }));
    }),

    ic("bamboo", "Bamboo", sw("#a7f3d0"), "Light", (o) => {
      const u = o.uid, bam = `<linearGradient id="${u}-bm" x1="0" x2="1"><stop offset="0" stop-color="#6e6a2c"/><stop offset=".3" stop-color="#d8c97c"/><stop offset=".65" stop-color="#b3a457"/><stop offset="1" stop-color="#5e5a24"/></linearGradient>`;
      const node = (y) => `<path d="${band(73, 127, y - 2, y + 2, 7)}" fill="#8a7e3a"/><path d="${arcF(73, 127, y + 2.4, 7)}" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1"/><path d="${arcF(73, 127, y - 2.4, 7)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1"/>`;
      const lf = (x, y, a, L) => `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C${L * .14} -${L * .1} ${L * .7} -${L * .14} ${L} 0C${L * .7} ${L * .1} ${L * .14} ${L * .08} 0 0Z" fill="#4f8a3c"/><path d="M2 0H${L * .9}" stroke="#bfe3a5" stroke-opacity=".5" stroke-width=".7"/></g>`;
      return svg(o,
        bam + sh(o, 100, 176, 46, 6) + pool(o, 100, 170, 64, 10) +
        `<path d="${cylP(72, 128, 158, 166, 7)}" fill="url(#${u}-blk)"/>` +
        (o.on ? `<path d="${band(72, 128, 156, 159, 7)}" fill="${H().mix(o.color, "#ffffff", .35)}" opacity="${n2(kl(o))}"/>` + halo(o, 100, 162, 44, 10, .8) : "") +
        `<path d="${cylP(74, 126, 70, 156, 7)}" fill="url(#${u}-bm)"/><path d="${cylP(74, 126, 70, 156, 7)}" fill="url(#${u}-edge)" opacity=".4"/>` +
        [0, 1, 2, 3, 4].map((i) => `<path d="M${80 + i * 10} 76V152" stroke="#5e5a24" stroke-opacity=".18" stroke-width=".8"/>`).join("") +
        node(102) + node(132) + hlp("M80 76V98M80 106V128M80 136V152", 2.4, .35) +
        `<ellipse cx="100" cy="70" rx="26" ry="7" fill="#c9b871"/><ellipse cx="100" cy="70" rx="21" ry="5.4" fill="#f2ece0"/><ellipse cx="100" cy="70" rx="21" ry="5.4" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1.6"/>` +
        nozzle(100, 70, 6, 1.8) +
        `<path d="M126 102C134 98 138 92 140 84" fill="none" stroke="#6e7a2c" stroke-width="1.6"/>` + lf(140, 84, -60, 26) + lf(136, 92, -20, 22) + lf(130, 99, 20, 18) +
        dot(o, 100, 146, 1.2, H().mix(o.color, "#ffffff", .3)) +
        wisp(o, 100, 68));
    }),

    icm("cloud", "Cloud night", sw("#c4b5fd"), "Light", (o, L) => {
      const u = o.uid, h = H(), c = o.color, cl = h.mix(c, "#ffffff", .45);
      const cs = [[66, 126, 26], [94, 104, 32], [128, 112, 27], [148, 136, 18], [52, 144, 16], [100, 140, 26]];
      const cg = `<linearGradient id="${u}-cg" gradientUnits="userSpaceOnUse" x1="0" y1="72" x2="0" y2="162"><stop offset="0" stop-color="${L.on ? "#ffffff" : "#f4f2f8"}"/><stop offset=".55" stop-color="${L.on ? cl : "#dcd8e6"}"/><stop offset="1" stop-color="${L.on ? h.shade(c, -.12) : "#aaa5b8"}"/></linearGradient>`;
      const shape = (f, dy) => `<g clip-path="url(#${u}-cc)">` + cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y + (dy || 0)}" r="${r}" fill="${f}"/>`).join("") + `<rect x="52" y="${130 + (dy || 0)}" width="96" height="30" fill="${f}"/></g>`;
      return svg(o,
        cg + `<clipPath id="${u}-cc"><rect x="20" y="40" width="160" height="120"/></clipPath>` +
        sh(o, 100, 164, 64, 6) + halo(L, 100, 120, 84, 62, .6) + pool(L, 100, 162, 80, 10, .8) +
        shape("#000", 2).replace("<g ", `<g opacity=".18" `) + shape(`url(#${u}-cg)`) +
        [[80, 100, 22], [110, 86, 22], [134, 100, 16]].map(([x, y, r]) => `<path d="M${x - r * .7} ${y}A${r} ${r} 0 0 1 ${x + r * .2} ${y - r * .66}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2.4" stroke-linecap="round"/>`).join("") +
        `<path d="M52 158H148" stroke="#000" stroke-opacity=".12" stroke-width="3"/>` +
        `<path d="M84 128Q88 132 92 128M108 128Q112 132 116 128" fill="none" stroke="#3b335f" stroke-width="2" stroke-linecap="round"/><path d="M96 138Q100 141 104 138" fill="none" stroke="#3b335f" stroke-width="1.8" stroke-linecap="round"/>` +
        `<ellipse cx="80" cy="136" rx="5" ry="3" fill="#ff8fb0" opacity=".45"/><ellipse cx="120" cy="136" rx="5" ry="3" fill="#ff8fb0" opacity=".45"/>` +
        `<ellipse cx="96" cy="73" rx="6" ry="1.8" fill="#e8e4ef"/>` + nozzle(96, 73, 4, 1.3) +
        wisp(o, 96, 72, { tint: L.on, s: .9 }));
    }),

    ic("cabinet", "Room cabinet", sw("#7dd3fc"), "Light", (o) => {
      const u = o.uid, h = H(), lc = h.mix(o.color, "#ffffff", .4);
      let gr = ""; for (let i = 0; i < 7; i++) gr += `<path d="M${80 + i * 6.6} 38L${84 + i * 6.6} 34" stroke="#05070a" stroke-width="1.8" stroke-linecap="round"/>`;
      return svg(o,
        sh(o, 106, 182, 50, 6) + pool(o, 100, 178, 50, 6, .6) +
        `<path d="M130 40L142 32V170L130 178Z" fill="#14171c"/><path d="M130 40L142 32V170L130 178Z" fill="url(#${u}-st)" opacity=".12"/>` +
        `<path d="M70 40H130V178H70Z" fill="url(#${u}-blk)"/>` +
        `<path d="M70 40L82 32H142L130 40Z" fill="#3a3f48"/><path d="M70 40H130L142 32" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>` + gr +
        `<path d="M74 44V174" stroke="#fff" stroke-opacity=".14" stroke-width="2.4" stroke-linecap="round"/>` +
        `<path d="${rr(97, 52, 6, 76, 3)}" fill="#05070a"/>` +
        (o.on ? `<g opacity="${n2(kl(o))}"><rect class="${P}glow" x="86" y="48" width="28" height="84" rx="14" fill="url(#${u}-halo)"/></g><path class="${P}cyc" d="${rr(98, 54, 4, 72, 2)}" fill="${lc}"/>` : "") +
        `<path d="${rr(84, 138, 32, 26, 6)}" fill="#0b1626" fill-opacity=".7" stroke="#000" stroke-opacity=".5" stroke-width="1"/>` +
        `<clipPath id="${u}-wc"><path d="${rr(84, 138, 32, 26, 6)}"/></clipPath><g clip-path="url(#${u}-wc)"><rect x="92" y="142" width="16" height="30" rx="3" fill="url(#${u}-amb)"/><path d="M84 140L116 166" stroke="#fff" stroke-opacity=".12" stroke-width="8"/></g>` +
        `<path d="M74 178V182H82V178M118 178V182H126V178" fill="#05070a"/>` +
        (o.on ? `<text x="100" y="47.5" text-anchor="middle" font-family="Segoe UI,Roboto,Arial,sans-serif" font-size="5" font-weight="600" fill="${lc}">${Math.round(1 + o.level * 4)}</text>` : "") +
        wisp(o, 110, 34, { wd: .55, n: 8, h: 34, lean: .08 }));
    }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "diffuser", tab: "Aroma diffusers", group: "Air", kind: "device",
    intro: "Twenty aroma diffusers and air fresheners. When on, thin scented mist or incense smoke curls up (or pours down the backflow falls), mood lights glow in the color you pick, the wall spray puffs every few seconds and candles flicker; the slider sets the output.",
    
    css, icons,
  });
})();
