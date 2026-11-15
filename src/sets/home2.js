(function () {
  "use strict";
  const P = "hda-home2-";
  const H = () => window.HDAH;
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const lvl = (o) => cl(o.level == null ? .8 : +o.level || 0, 0, 1);
  const amt = (o) => (o.on ? lvl(o) : 0);
  function rnd(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  function X(o) {
    const d = []; let n = 0;
    const st = (a) => a.map(([of, c, op]) => `<stop offset="${of}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
    return { o, d, id: (k) => `${o.uid}-${k}`,
      lg(a, x1, y1, x2, y2) { const id = `${o.uid}-g${n++}`; d.push(`<linearGradient id="${id}" x1="${x1 == null ? 0 : x1}" y1="${y1 == null ? 0 : y1}" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${st(a)}</linearGradient>`); return `url(#${id})`; },
      rg(a, cx, cy, r) { const id = `${o.uid}-g${n++}`; d.push(`<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r == null ? .5 : r}">${st(a)}</radialGradient>`); return `url(#${id})`; } };
  }
  function scene(x, back, body) {
    const vig = x.rg([[0, "#000", 0], [.65, "#000", .06], [1, "#000", .5]], .5, .46, .75), c = x.id("clip");
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${c}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>${x.d.join("")}</defs>
<g clip-path="url(#${c})"><g class="hda-bg">${back}<rect x="8" y="8" width="184" height="184" fill="${vig}"/></g>${body}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g></svg>`;
  }
  const shadow = (cx, cy, rx, ry) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx + 6)}" ry="${f((ry || 5) + 1.6)}" fill="#000" opacity=".16"/><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry || 5)}" fill="#000" opacity=".3"/>`;
  const metal = (x, c, gl) => x.lg([[0, H().shade(c, -.45)], [.18, H().shade(c, gl ? .35 : .12)], [.5, c], [.85, H().shade(c, -.25)], [1, H().shade(c, -.55)]], 0, 0, 1, 0);
  const vmetal = (x, c) => x.lg([[0, H().shade(c, .3)], [.5, c], [1, H().shade(c, -.4)]]);
  const brass = (x) => x.lg([[0, "#6a4a1c"], [.3, "#f2d48a"], [.55, "#c0913f"], [1, "#5a3c12"]], 0, 0, 1, 0);
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g" };
  function digits(x0, y, h, str, col) {
    const w = h * .56, t = Math.max(.5, h * .15), hh = h / 2; let s = "";
    String(str).split("").forEach((ch, i) => { const x = x0 + i * (w + h * .22), R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9], d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
      (SEG[ch] || "").split("").forEach((k) => { const r = R[k]; s += `<rect x="${f(r[0])}" y="${f(r[1])}" width="${f(r[2])}" height="${f(r[3])}" rx="${f(t * .35)}"/>`; }); });
    return `<g fill="${col}">${s}</g>`;
  }
  const led = (o, x, y, c) => o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="3.6" fill="${c || "#34d399"}" opacity=".3"/><circle cx="${x}" cy="${y}" r="1.3" fill="${c || "#5ef0b4"}"/>` : `<circle cx="${x}" cy="${y}" r="1.2" fill="#555b63"/>`;

  function room(x, fy, wall, floor) {
    const w = wall || "#6a5f58", r = rnd(fy * 3 + 7);
    let s = `<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.lg([[0, H().shade(w, .12)], [1, H().shade(w, -.3)]])}"/>`;
    if (floor === "brick") { for (let row = 0, y = 8; y < fy - 12; y += 9, row++) for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) s += `<rect x="${bx + .6}" y="${y + .6}" width="24.8" height="7.8" rx=".8" fill="${H().mix("#8a4a36", "#a65e44", r())}" opacity=".9"/>`;
      s += `<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.lg([[0, "#000", .2], [1, "#000", .45]])}"/>`; }
    s += `<rect x="8" y="${fy - 6}" width="184" height="6" fill="#d9d3c8"/><rect x="8" y="${fy - 6}" width="184" height="1" fill="#fff" opacity=".5"/>`;
    s += `<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="${x.lg([[0, "#6e4a33"], [1, "#3a271b"]])}"/>`;
    for (let y = fy + 7; y < 192; y += 7) s += `<path d="M8 ${y}H192" stroke="#000" stroke-opacity=".28" stroke-width=".6"/>`;
    return s;
  }
  const hearth = (x, cx, y, w, h, c) => `<path d="M${cx - w / 2} ${y}H${cx + w / 2}L${cx + w / 2 + 8} ${y + h}H${cx - w / 2 - 8}Z" fill="${x.lg([[0, H().shade(c || "#7b7f86", .2)], [1, H().shade(c || "#7b7f86", -.3)]])}"/><path d="M${cx - w / 2} ${y}H${cx + w / 2}" stroke="#fff" stroke-opacity=".3"/>`;
  function exterior(x, kind, col) {
    const r = rnd(kind.length * 31 + 5); let s = "";
    if (kind === "brick") { s += `<rect x="8" y="8" width="184" height="184" fill="#6a3a2c"/>`;
      for (let row = 0, y = 8; y < 192; y += 9, row++) for (let bx = 8 - (row % 2) * 13; bx < 192; bx += 26) s += `<rect x="${bx + .7}" y="${y + .7}" width="24.6" height="7.6" rx=".8" fill="${H().mix("#8e4c38", "#b56a4c", r())}"/>`; }
    else if (kind === "siding") { const c = col || "#c9cfd3"; s += `<rect x="8" y="8" width="184" height="184" fill="${c}"/>`; for (let y = 8; y < 192; y += 10) s += `<rect x="8" y="${y}" width="184" height="4" fill="#fff" opacity=".14"/><path d="M8 ${y + 9.5}H192" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`; }
    else { const c = col || "#d8cdb8"; s += `<rect x="8" y="8" width="184" height="184" fill="${c}"/>`; for (let i = 0; i < 160; i++) s += `<circle cx="${f(8 + r() * 184)}" cy="${f(8 + r() * 184)}" r="${f(.4 + r() * .8)}" fill="${r() > .5 ? "#fff" : "#000"}" opacity=".08"/>`; }
    return s + `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#fff", .06], [1, "#000", .3]])}"/>`;
  }
  function view(x, wx, wy, ww, wh) {
    const c = x.id("vw" + Math.round(wx + wy));
    return `<clipPath id="${c}"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}"/></clipPath><g clip-path="url(#${c})"><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${x.lg([[0, "#3a8ad8"], [.65, "#8ac4ee"], [1, "#d6edf8"]])}"/>` +
      `<ellipse cx="${f(wx + ww * .62)}" cy="${f(wy + wh * .22)}" rx="${f(ww * .14)}" ry="${f(wh * .05)}" fill="#fff" opacity=".9"/><path d="M${wx} ${f(wy + wh * .72)}Q${f(wx + ww / 2)} ${f(wy + wh * .62)} ${wx + ww} ${f(wy + wh * .7)}V${wy + wh}H${wx}Z" fill="${x.lg([[0, "#84c465"], [1, "#4a883b"]])}"/>` +
      `<rect x="${f(wx + ww * .22)}" y="${f(wy + wh * .45)}" width="${f(ww * .04)}" height="${f(wh * .35)}" fill="#6a4a30"/><circle cx="${f(wx + ww * .24)}" cy="${f(wy + wh * .42)}" r="${f(Math.min(ww, wh) * .16)}" fill="${x.rg([[0, "#98d870"], [.6, "#4d9c40"], [1, "#2b6328"]], .38, .3, .75)}"/>` +
      `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${x.lg([[0, "#fff", .28], [.35, "#fff", 0], [.6, "#fff", .1], [.7, "#fff", 0]], 0, 0, 1, 1)}"/></g>`;
  }
  function glassOut(x, wx, wy, ww, wh) {
    return `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${x.lg([[0, "#1a1e26"], [1, "#3a3f4a"]])}"/><path d="M${wx} ${wy}H${f(wx + ww * .55)}L${wx} ${f(wy + wh * .7)}Z" fill="#bfe2fa" opacity=".35"/><path d="M${f(wx + ww * .7)} ${wy}H${f(wx + ww * .82)}L${f(wx + ww * .2)} ${wy + wh}H${f(wx + ww * .08)}Z" fill="#fff" opacity=".08"/>`;
  }
  const frameOut = (x, wx, wy, ww, wh, col) => `<rect x="${wx - 6}" y="${wy - 6}" width="${ww + 12}" height="${wh + 12}" fill="${col || "#f1efe9"}"/><rect x="${wx - 6}" y="${wy - 6}" width="${ww + 12}" height="${wh + 12}" fill="none" stroke="#000" stroke-opacity=".2"/>` + glassOut(x, wx, wy, ww, wh) +
    `<path d="M${wx + ww / 2} ${wy}V${wy + wh}M${wx} ${wy + wh / 2}H${wx + ww}" stroke="${col || "#f1efe9"}" stroke-width="3"/><rect x="${wx - 10}" y="${wy + wh + 6}" width="${ww + 20}" height="6" fill="#e9e6df"/><rect x="${wx - 10}" y="${wy + wh + 12}" width="${ww + 20}" height="3" fill="#000" opacity=".25"/>`;

  function fire(x, o, cx, by, w, h, kind) {
    if (!o.on) return kind === "pellet" ? `<rect x="${f(cx - w * .28)}" y="${f(by - 5)}" width="${f(w * .56)}" height="5" rx="1.5" fill="#2a2420"/>` :
      `<path d="M${f(cx - w * .42)} ${by}Q${f(cx - w * .2)} ${f(by - 8)} ${cx} ${f(by - 4)}Q${f(cx + w * .25)} ${f(by - 9)} ${f(cx + w * .42)} ${by}Z" fill="#3a2a20"/><path d="M${f(cx - w * .35)} ${f(by - 3)}L${f(cx + w * .3)} ${f(by - 6)}" stroke="#5a3a24" stroke-width="4" stroke-linecap="round"/>`;
    const L = lvl(o), hh = h * (.45 + .55 * L);
    const grow = x.rg([[0, "#ffd27a", .95], [.45, "#ff8a2a", .5], [1, "#ff6a00", 0]], .5, .8, .7);
    let s = `<ellipse class="${P}pulse" cx="${cx}" cy="${f(by - hh * .4)}" rx="${f(w * .75)}" ry="${f(hh * .9)}" fill="${grow}"/>`;
    if (kind !== "pellet") s += `<path d="M${f(cx - w * .4)} ${f(by - 2)}L${f(cx + w * .32)} ${f(by - 7)}M${f(cx - w * .2)} ${f(by - 6)}L${f(cx + w * .42)} ${f(by - 1)}" stroke="#4a2a18" stroke-width="5" stroke-linecap="round"/><path d="M${f(cx - w * .4)} ${f(by - 2)}L${f(cx + w * .32)} ${f(by - 7)}" stroke="#ff7a2a" stroke-width="1.2" stroke-dasharray="2 3" opacity=".9"/>`;
    else s += `<rect x="${f(cx - w * .28)}" y="${f(by - 5)}" width="${f(w * .56)}" height="5" rx="1.5" fill="#3a2a22"/><rect x="${f(cx - w * .24)}" y="${f(by - 6)}" width="${f(w * .48)}" height="2.4" rx="1" fill="#ff9a3a"/>`;
    const tongues = kind === "pellet" ? [[-.18, .85, .16], [0, 1, .2], [.18, .8, .16]] : [[-.3, .7, .2], [-.1, 1, .24], [.12, .9, .22], [.3, .65, .18]];
    tongues.forEach((t, i) => { const tx = cx + t[0] * w, th = hh * t[1], tw = w * t[2];
      const d = `M${f(tx - tw)} ${f(by - 3)}C${f(tx - tw)} ${f(by - th * .45)} ${f(tx - tw * .2)} ${f(by - th * .7)} ${f(tx + tw * .15)} ${f(by - th)}C${f(tx + tw * .5)} ${f(by - th * .6)} ${f(tx + tw * 1.1)} ${f(by - th * .4)} ${f(tx + tw)} ${f(by - 3)}Z`;
      s += `<g class="${P}flick" style="animation-delay:-${(i * .37).toFixed(2)}s;animation-duration:${(1.1 + i * .17).toFixed(2)}s"><path d="${d}" fill="#ff7a1a"/><path d="${d}" fill="#ffd36a" transform="translate(${f(tx)} ${f(by - 3)}) scale(.55 .62) translate(${f(-tx)} ${f(-(by - 3))})"/></g>`; });
    return s;
  }
  let clipN = 0; const clipG = (x, d, inner) => { const id = x.id("fc" + (clipN++)); return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`; };
  function glass(x, o, d) {
    return `<path d="${d}" fill="${x.rg([[0, "#000", 0], [.75, "#000", .2], [1, "#000", .65]], .5, .5, .65)}"/><path d="${d}" fill="${x.lg([[0, "#fff", .22], [.35, "#fff", 0], [.6, "#fff", .08], [.7, "#fff", 0]], 0, 0, 1, 1)}"/>`;
  }
  const pipe = (x, cx, y, w) => `<rect x="${cx - w / 2}" y="8" width="${w}" height="${y - 8}" fill="${metal(x, "#2a2b2f")}"/>` + [30, 60].map((yy) => yy < y ? `<rect x="${cx - w / 2 - 1}" y="${yy}" width="${w + 2}" height="2.4" fill="#1a1b1e"/>` : "").join("");
  function heat(o, x0, y0, w) { if (!o.on) return ""; return [0, 1, 2].map((i) => `<path class="${P}haze" style="animation-delay:-${(i * .6).toFixed(1)}s" d="M${f(x0 + w * (.2 + i * .3))} ${y0}q4 -6 0 -12t0 -12" fill="none" stroke="#ffe2b0" stroke-opacity=".35" stroke-width="1.4"/>`).join(""); }

  function rollSlats(x, c, wx, top, ww, bot, pitch, vents) {
    if (bot - top < 1) return "";
    const id = x.id("rs" + Math.round(wx + top)); let s = `<clipPath id="${id}"><rect x="${wx}" y="${top}" width="${ww}" height="${f(bot - top)}"/></clipPath><g clip-path="url(#${id})"><rect x="${wx}" y="${top}" width="${ww}" height="${f(bot - top)}" fill="${H().shade(c, -.2)}"/>`;
    const g = x.lg([[0, H().shade(c, .25)], [.45, c], [.8, H().shade(c, -.18)], [1, H().shade(c, -.45)]]);
    for (let y = bot - pitch; y > top - pitch; y -= pitch) { s += `<rect x="${wx}" y="${f(y)}" width="${ww}" height="${pitch}" fill="${g}"/>`;
      if (vents) for (let vx = wx + 6; vx < wx + ww - 4; vx += 9) s += `<rect x="${f(vx)}" y="${f(y + pitch * .38)}" width="4" height="1" rx=".5" fill="#000" opacity=".45"/>`; }
    return s + `</g>`;
  }
  function vSlats(x, c, wx, top, ww, bot, pitch, t, alu) {
    let s = ""; if (bot - top < 2) return s;
    const hs = pitch * (.25 + .87 * t), g = x.lg(alu ? [[0, H().shade(c, .55)], [.3, H().shade(c, .2)], [.7, c], [1, H().shade(c, -.45)]] : [[0, H().shade(c, .35)], [.5, c], [1, H().shade(c, -.38)]]);
    for (let y = top; y < bot - 1; y += pitch) { const yy = y + (pitch - hs) / 2;
      if (t < .9) s += `<rect x="${wx}" y="${f(yy + hs)}" width="${ww}" height="${f(Math.min(2, pitch - hs + .2))}" fill="#000" opacity=".15"/>`;
      s += `<rect x="${wx}" y="${f(yy)}" width="${ww}" height="${f(hs)}" rx="${alu ? .4 : .9}" fill="${g}"/><rect x="${wx}" y="${f(yy + hs - .5)}" width="${ww}" height=".5" fill="#000" opacity=".35"/>`; }
    return s;
  }
  function leaf(x, o, hx, y, w, h, dir, ang, c, style) {
    const cs = Math.cos(ang), pw = w * cs, xx = dir > 0 ? hx : hx - pw;
    const x0 = Math.min(xx, xx + pw), wd = Math.abs(pw); if (wd < 1.5) return `<rect x="${f(hx - 1)}" y="${y}" width="2" height="${h}" fill="${H().shade(c, -.4)}"/>`;
    const persp = Math.sin(ang) * 6, top = y - (pw * dir > 0 ? 0 : 0);
    const facing = cs > 0 ? 1 : .78; const cc = H().shade(c, cs > 0 ? 0 : -.15);
    const id = x.id("lf" + Math.round(hx * 10 + dir));
    const near = dir > 0 ? x0 : x0 + wd, far = dir > 0 ? x0 + wd : x0, p = cs > 0 ? persp : -persp * .6;
    const outline = `M${f(near)} ${y}L${f(far)} ${f(y + Math.abs(p) * (cs > 0 ? 1 : .6))}L${f(far)} ${f(y + h - Math.abs(p) * (cs > 0 ? 1 : .6))}L${f(near)} ${y + h}Z`;
    let s = `<clipPath id="${id}"><path d="${outline}"/></clipPath><path d="${outline}" fill="${metal(x, cc)}"/><g clip-path="url(#${id})">`;
    if (style === "board") { for (let k = 1; k < 4; k++) s += `<path d="M${f(x0 + wd * k / 4)} ${y}V${y + h}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>`; [.2, .8].forEach((t) => { s += `<rect x="${f(x0 + 1)}" y="${f(y + h * t - 3)}" width="${f(wd - 2)}" height="6" fill="${H().shade(cc, .12)}" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>`; }); s += `<path d="M${f(x0 + 2)} ${f(y + h * .8 - 3)}L${f(x0 + wd - 2)} ${f(y + h * .2 + 3)}" stroke="${H().shade(cc, .12)}" stroke-width="4"/><path d="M${f(x0 + 2)} ${f(y + h * .8 - 3)}L${f(x0 + wd - 2)} ${f(y + h * .2 + 3)}" stroke="#000" stroke-opacity=".25" stroke-width="4.6" fill="none" stroke-dasharray="0"/>`; }
    else if (style === "louver") { s += `<rect x="${f(x0)}" y="${y}" width="${f(wd)}" height="${h}" fill="none" stroke="${H().shade(cc, .15)}" stroke-width="${f(Math.max(1, wd * .14))}"/>`; for (let yy = y + 6; yy < y + h - 4; yy += 4.4) s += `<rect x="${f(x0 + wd * .14)}" y="${f(yy)}" width="${f(wd * .72)}" height="3" fill="${H().shade(cc, .18)}"/><rect x="${f(x0 + wd * .14)}" y="${f(yy + 3)}" width="${f(wd * .72)}" height="1" fill="#000" opacity=".4"/>`; s += `<rect x="${f(x0)}" y="${f(y + h / 2 - 2)}" width="${f(wd)}" height="4" fill="${H().shade(cc, .1)}"/>`; }
    else { [[.06, .44], [.54, .4]].forEach((p2) => { const py = y + h * p2[0], ph = h * p2[1]; s += `<rect x="${f(x0 + wd * .16)}" y="${f(py)}" width="${f(wd * .68)}" height="${f(ph)}" fill="${H().shade(cc, .12)}" stroke="#000" stroke-opacity=".3"/><rect x="${f(x0 + wd * .24)}" y="${f(py + 4)}" width="${f(wd * .52)}" height="${f(ph - 8)}" fill="${H().shade(cc, -.06)}"/><path d="M${f(x0 + wd * .24)} ${f(py + 4)}H${f(x0 + wd * .76)}" stroke="#fff" stroke-opacity=".3"/>`; }); }
    s += `</g><path d="${outline}" fill="#000" opacity="${f((1 - Math.abs(cs)) * .35)}"/><path d="${outline}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".8"/>`;
    [.18, .82].forEach((t) => { const hy = y + h * t; s += `<path d="M${f(hx)} ${f(hy)}H${f(hx + dir * Math.max(4, pw * dir * .45))}" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>`; });
    return s;
  }

  const css = `
.hda-anim .hda-home2-pulse{animation:hda-home2-pulse 2.4s ease-in-out infinite}
@keyframes hda-home2-pulse{50%{opacity:.6}}
.hda-home2-flick{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-home2-flick{animation:hda-home2-flick 1.2s ease-in-out infinite alternate}
@keyframes hda-home2-flick{0%{transform:scale(1,1) skewX(0)}50%{transform:scale(.92,1.08) skewX(-3deg)}100%{transform:scale(1.05,.93) skewX(3deg)}}
.hda-home2-haze{opacity:.4}
.hda-anim .hda-home2-haze{animation:hda-home2-haze 2.2s ease-in-out infinite}
@keyframes hda-home2-haze{0%{transform:translateY(4px);opacity:0}40%{opacity:.6}100%{transform:translateY(-10px);opacity:0}}
.hda-home2-puff{opacity:.45;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-home2-puff{opacity:0;animation:hda-home2-puff 3.4s ease-out infinite}
@keyframes hda-home2-puff{0%{transform:translateY(6px) scale(.5);opacity:0}30%{opacity:.8}100%{transform:translateY(-22px) scale(1.6);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-home2-pulse,.hda-anim .hda-home2-flick,.hda-anim .hda-home2-haze,.hda-anim .hda-home2-puff{animation:none!important}}
`;
  const steam = (o, x, pts) => o.on ? pts.map((p, i) => `<circle class="${P}puff" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 7}" fill="${x.rg([[0, "#fff", .6], [.6, "#fff", .18], [1, "#fff", 0]])}" style="animation-delay:-${(i * .9).toFixed(1)}s"/>`).join("") : "";
  const tempF = (o, lo, hi) => Math.round((lo + (hi - lo) * lvl(o)) / 5) * 5;
  // (parts) Multi-Function: Tilt (slats open, %) and Lift (raised, %) as readings, like the shades set's blinds
  const TILT = { options: [{ id: "tilt", name: "Slats", values: [["open", "Tilted open"], ["half", "Half open"], ["closed", "Tilted shut"]] }],
    parts: [{ id: "tilt", name: "Tilt (open)", type: "value", unit: "%", min: 0, max: 100, def: 50 }, { id: "lift", name: "Lift (raised)", type: "value", unit: "%", min: 0, max: 100, def: 40 }] };
  const tiltOf = (o) => ({ open: 0, half: .5, closed: 1 })[(o.opt && o.opt.tilt) || "open"];
  const icons = [];
  const add = (id, name, colors, label, render, extra) => icons.push(Object.assign({ id, name, colors, picker: true, colorLabel: label, render }, extra || {}));

  add("black-pellet-stove", "Black pellet stove", ["#232428", "#3f4247", "#4a3a2e", "#2e3b4f"], "Finish", (o) => { const x = X(o), c = o.color;
    const back = room(x, 162, "#7a6a5e", "brick") + hearth(x, 100, 162, 104, 26, "#5e6168");
    const body = pipe(x, 100, 46, 12) + shadow(100, 178, 44, 4) +
      `<path d="M58 46H142V54H58Z" fill="${vmetal(x, c)}"/><path d="M62 54H138V172H62Z" fill="${metal(x, c)}"/><path d="M66 172H134V178H66Z" fill="${H().shade(c, -.4)}"/>` +
      `<path d="M70 64H130V124H70Z" fill="${brass(x)}"/><path d="M74 68H126V120H74Z" fill="#1a1412"/>` + clipG(x, "M74 68H126V120H74Z", fire(x, o, 100, 114, 40, 40, "pellet")) + glass(x, o, "M74 68H126V120H74Z") +
      `<path d="M70 132H130V164H70Z" fill="${H().shade(c, -.15)}"/>` + [138, 144, 150, 156].map((y) => `<rect x="76" y="${y}" width="48" height="2.6" rx="1.3" fill="#000" opacity=".45"/>`).join("") +
      `<rect x="122" y="48" width="14" height="5" rx="1" fill="#0b0c0e"/>` + digits(124, 49, 3.2, o.on ? String(Math.round(1 + 4 * lvl(o))) : "-", o.on ? "#ff6a3a" : "#3a3f47") + led(o, 66, 50, "#ff8a3a") + heat(o, 62, 44, 76);
    return scene(x, back, body); });
  add("compact-pellet-stove", "Compact pellet stove", ["#1e1f23", "#6a1f24", "#4a4c52", "#2e3b4f"], "Finish", (o) => { const x = X(o), c = o.color;
    const back = room(x, 162, "#5e6670") + hearth(x, 100, 162, 120, 26, "#8a8d94");
    const bay = "M76 74H124L132 80V126L124 132H76L68 126V80Z";
    const body = pipe(x, 100, 52, 12) + shadow(100, 178, 52, 4) +
      `<path d="M54 64Q100 44 146 64V172H54Z" fill="${metal(x, c, 1)}"/><path d="M54 64Q100 44 146 64" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/><rect x="58" y="172" width="84" height="6" fill="${H().shade(c, -.45)}"/>` +
      `<path d="${bay}" fill="#0f0c0b"/>` + clipG(x, bay, fire(x, o, 100, 124, 44, 44, "pellet")) + glass(x, o, bay) + `<path d="M76 74V132M124 74V132" stroke="${H().shade(c, -.4)}" stroke-width="2.4"/><path d="${bay}" fill="none" stroke="${H().shade(c, -.5)}" stroke-width="3"/>` +
      `<path d="M62 142H138V164H62Z" fill="${H().shade(c, -.2)}"/>` + [146, 152, 158].map((y) => `<rect x="70" y="${y}" width="60" height="2.4" rx="1.2" fill="#000" opacity=".45"/>`).join("") +
      `<rect x="88" y="56" width="24" height="7" rx="1.5" fill="#0b0c0e"/>` + digits(91, 57.5, 4, o.on ? String(tempF(o, 60, 85)) : "--", o.on ? "#7dd3fc" : "#3a3f47") + led(o, 106, 59.5) + heat(o, 60, 50, 80);
    return scene(x, back, body); });
  add("budget-pellet-stove", "Budget pellet stove", ["#1f2024", "#3f4247", "#5a4a30"], "Finish", (o) => { const x = X(o), c = o.color;
    const back = room(x, 164, "#6f6a62") + hearth(x, 100, 164, 92, 24, "#6c6f75");
    const body = pipe(x, 100, 62, 10) + shadow(100, 178, 38, 4) +
      `<path d="M64 62H136V70H64Z" fill="${vmetal(x, c)}"/><path d="M66 70H134V172H66Z" fill="${metal(x, c)}"/><path d="M66 70H78V172H66ZM122 70H134V172H122Z" fill="${x.lg([[0, "#8a6a2a"], [.5, "#e6c27a"], [1, "#6a4c1a"]], 0, 0, 1, 0)}" opacity=".85"/>` +
      `<path d="M80 80H120V124H80Z" fill="${H().shade(c, -.5)}"/><path d="M84 84H116V120H84Z" fill="#120e0c"/>` + clipG(x, "M84 84H116V120H84Z", fire(x, o, 100, 116, 28, 32, "pellet")) + glass(x, o, "M84 84H116V120H84Z") +
      `<rect x="117" y="96" width="3" height="14" rx="1.5" fill="#c9ccd0"/><path d="M80 132H120V166H80Z" fill="${H().shade(c, -.15)}"/><rect x="92" y="148" width="16" height="3" rx="1.5" fill="#c9ccd0"/>` + led(o, 128, 66, "#ff8a3a") + heat(o, 66, 60, 68);
    return scene(x, back, body); });

  add("cast-iron-wood-stove", "Cast-iron wood stove", ["#24252a", "#1f2a3d", "#e8e0cc", "#3a2f2a"], "Enamel", (o) => { const x = X(o), c = o.color;
    const back = room(x, 164, "#6a5a50", "brick") + hearth(x, 100, 164, 100, 24, "#4f5258");
    const arch = "M78 132V100Q78 82 100 82Q122 82 122 100V132Z";
    const body = pipe(x, 100, 66, 13) + shadow(100, 180, 40, 4) +
      `<rect x="60" y="66" width="80" height="9" rx="2" fill="${vmetal(x, c)}"/><path d="M64 75H136V160H64Z" fill="${metal(x, c)}"/>` +
      `<path d="M64 160H136L132 166H68Z" fill="${H().shade(c, -.3)}"/><path d="M70 166L66 180H74L76 166ZM130 166L134 180H126L124 166Z" fill="${H().shade(c, -.35)}"/>` +
      `<path d="M74 136V98Q74 77 100 77Q126 77 126 98V136Z" fill="${H().shade(c, -.25)}"/><path d="${arch}" fill="#120d0a"/>` + clipG(x, arch, fire(x, o, 100, 128, 36, 38)) + glass(x, o, arch) +
      `<path d="M100 82V132M78 108H122M88 84Q100 96 100 108Q100 96 112 84" fill="none" stroke="${H().shade(c, -.3)}" stroke-width="2.2"/><path d="${arch}" fill="none" stroke="${H().shade(c, -.4)}" stroke-width="2"/>` +
      `<path d="M70 142H130V156H70Z" fill="${H().shade(c, -.15)}"/><path d="M80 146H120" stroke="#000" stroke-opacity=".3"/><rect x="128" y="104" width="5" height="12" rx="2" fill="${H().shade(c, -.5)}"/>` + heat(o, 64, 64, 72);
    return scene(x, back, body); });
  add("steel-wood-stove", "Steel wood stove", ["#202125", "#3f4247"], "Finish", (o) => { const x = X(o), c = o.color;
    const back = room(x, 166, "#5f6870") + hearth(x, 100, 166, 120, 22, "#7b7f86");
    const win = "M66 104H134V140H66Z";
    const body = pipe(x, 112, 88, 13) + shadow(100, 182, 52, 4) +
      `<path d="M50 88H150V94H50Z" fill="${vmetal(x, c)}"/><path d="M52 94H148V152H52Z" fill="${metal(x, c)}"/>` +
      `<path d="M60 152Q58 166 54 180M140 152Q142 166 146 180M64 152Q66 162 72 168M136 152Q134 162 128 168" stroke="${H().shade(c, -.3)}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M60 98H140V148H60Z" fill="${H().shade(c, -.25)}"/><path d="${win}" fill="#120d0a"/>` + clipG(x, win, fire(x, o, 100, 138, 60, 32)) + glass(x, o, win) + `<path d="${win}" fill="none" stroke="#c9ccd0" stroke-width="1.4" opacity=".6"/>` +
      `<path d="M148 112h6v16h-6" fill="none" stroke="#c9ccd0" stroke-width="2.4"/><rect x="96" y="143" width="8" height="3" rx="1" fill="#c9ccd0"/>` + heat(o, 52, 86, 96);
    return scene(x, back, body); });

  add("finnish", "Finnish sauna", ["#e2c08a", "#c98f5a", "#8a5a3a", "#f0dcb4"], "Wood", (o) => { const x = X(o), c = o.color, L = amt(o);
    const back = room(x, 176, "#4e5560");
    const wood = x.lg([[0, H().shade(c, .2)], [.5, c], [1, H().shade(c, -.25)]], 0, 0, 1, 0);
    let boards = ""; for (let y = 34; y < 176; y += 7) boards += `<path d="M30 ${y}H170" stroke="${H().shade(c, -.35)}" stroke-opacity=".6" stroke-width=".7"/>`;
    const door = "M58 66H104V174H58Z";
    let inside = `<rect x="58" y="66" width="46" height="108" fill="${H().shade(c, -.55)}"/><rect x="58" y="118" width="46" height="8" fill="${H().shade(c, -.2)}"/><rect x="58" y="148" width="46" height="8" fill="${H().shade(c, -.25)}"/>` +
      `<path d="M84 128H102V156H84Z" fill="${metal(x, "#b9bec4")}"/>` + [0, 1, 2, 3, 4].map((i) => `<circle cx="${86 + i * 3.6}" cy="${126 - (i % 2) * 1.6}" r="2.4" fill="${o.on ? H().mix("#6a6870", "#ff7a3a", .25 + .5 * L) : "#6a6870"}"/>`).join("") +
      (o.on ? `<ellipse class="${P}pulse" cx="93" cy="124" rx="18" ry="10" fill="${x.rg([[0, "#ffb36a", .7], [1, "#ff8a3a", 0]])}"/>` : "");
    const body = shadow(100, 178, 70, 4) + `<path d="M30 30H170V176H30Z" fill="${wood}"/>${boards}<path d="M30 30H170V36H30Z" fill="${H().shade(c, -.3)}"/>` +
      `<path d="M54 62H108V176H54Z" fill="${H().shade(c, -.35)}"/>` + inside + `<path d="${door}" fill="#5a3a1a" opacity="${o.on ? .25 : .45}"/>` + glass(x, o, door) + `<rect x="98" y="112" width="3" height="16" rx="1.5" fill="${H().shade(c, -.5)}"/>` +
      `<path d="M120 70H160V98H120Z" fill="${H().shade(c, -.25)}"/><path d="M124 74H156V94H124Z" fill="${x.lg([[0, "#cfe7f6", .5], [1, "#8ab0c8", .3]])}"/>` +
      `<rect x="128" y="112" width="26" height="14" rx="2" fill="#0b0c0e"/>` + digits(131, 115, 7, o.on ? String(tempF(o, 140, 195)) : "---", o.on ? "#ff7a3a" : "#30353c") +
      `<rect x="16" y="132" width="10" height="44" rx="2" fill="${metal(x, "#7a5232")}"/>` + steam(o, x, [[82, 96, 6], [96, 90, 7], [70, 100, 5]]);
    return scene(x, back, body); });
  add("cube", "Cube sauna", ["#6a4a32", "#b98250", "#2b2b2e", "#9a7a5a"], "Wood", (o) => { const x = X(o), c = o.color, L = amt(o);
    const back = `<rect x="8" y="8" width="184" height="184" fill="${x.lg([[0, "#4a86c8"], [.6, "#9fcaea"], [1, "#d6edf8"]])}"/><path d="M8 150Q100 140 192 150V192H8Z" fill="${x.lg([[0, "#6aa84a"], [1, "#3a6a2a"]])}"/>` +
      `<g fill="#3a6a3a"><circle cx="24" cy="132" r="18"/><circle cx="180" cy="128" r="20"/></g><path d="M30 168H170L178 180H22Z" fill="#8a6a4a"/>` + [0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${30 + i * 22} 168L${26 + i * 24} 180" stroke="#5a4028" stroke-width=".8"/>`).join("");
    const wood = x.lg([[0, H().shade(c, .15)], [.5, c], [1, H().shade(c, -.35)]], 0, 0, 1, 0);
    const shell = "M44 60Q44 44 60 44H140Q156 44 156 60V168H44Z";
    let boards = ""; for (let y = 50; y < 168; y += 6) boards += `<path d="M44 ${y}H156" stroke="#000" stroke-opacity=".22" stroke-width=".7"/>`;
    const win = "M60 60H140V164H60Z", id = x.id("cw");
    const body = shadow(100, 170, 62, 4) + `<path d="${shell}" fill="${wood}"/><clipPath id="${id}"><path d="${shell}"/></clipPath><g clip-path="url(#${id})">${boards}</g>` +
      `<path d="M52 56Q52 52 56 52H144Q148 52 148 56V168H52Z" fill="${H().shade(c, -.45)}"/><rect x="60" y="60" width="80" height="104" fill="${o.on ? H().mix("#2a1a10", "#a8602a", .3 + .4 * L) : "#1e1812"}"/>` +
      `<rect x="62" y="124" width="76" height="8" fill="${H().shade(c, -.1)}"/><rect x="62" y="146" width="76" height="8" fill="${H().shade(c, -.15)}"/><path d="M110 126H130V146H110Z" fill="#3a3a3e"/>` +
      (o.on ? `<ellipse class="${P}pulse" cx="100" cy="74" rx="40" ry="10" fill="${x.rg([[0, "#ffc27a", .8], [1, "#ffb060", 0]])}"/>` : "") +
      glass(x, o, win) + `<path d="M100 60V164" stroke="${H().shade(c, -.5)}" stroke-width="2.4"/><rect x="95" y="104" width="2.4" height="18" rx="1.2" fill="#c9ccd0"/><rect x="103" y="104" width="2.4" height="18" rx="1.2" fill="#c9ccd0"/>` +
      `<rect x="146" y="30" width="6" height="16" fill="${metal(x, "#3a3b40")}"/>` + steam(o, x, [[149, 26, 6], [151, 18, 7]]);
    return scene(x, back, body); });

  const ROLL = (o, x, wx, wy, ww, wh, c, opt) => { const a = amt(o), bot = wy + (wh - 2) * (1 - a) + 2;
    let s = `<rect x="${wx - 5}" y="${wy}" width="5" height="${wh}" fill="${vmetal(x, H().shade(c, -.1))}"/><rect x="${wx + ww}" y="${wy}" width="5" height="${wh}" fill="${vmetal(x, H().shade(c, -.1))}"/>`;
    s += rollSlats(x, c, wx, wy, ww, bot, opt.pitch || 5, opt.vents) + `<rect x="${wx}" y="${f(bot - 3)}" width="${ww}" height="${opt.bar || 4}" rx="1" fill="${metal(x, H().shade(c, -.25))}"/>`;
    s += `<rect x="${wx - 7}" y="${wy - opt.box}" width="${ww + 14}" height="${opt.box}" rx="1.5" fill="${vmetal(x, c)}"/><rect x="${wx - 7}" y="${wy - opt.box}" width="${ww + 14}" height="1.6" fill="#fff" opacity=".35"/><rect x="${wx - 7}" y="${wy - 2}" width="${ww + 14}" height="2" fill="#000" opacity=".25"/>`;
    return s; };
  add("alubox", "Aluminum roller", ["#f1f0ec", "#3c4046", "#d9cbb0", "#8d939a", "#5a4636"], "Finish", (o) => { const x = X(o), c = o.color, wx = 56, wy = 60, ww = 88, wh = 92;
    const back = exterior(x, "brick") + frameOut(x, wx, wy, ww, wh);
    return scene(x, back, ROLL(o, x, wx, wy, ww, wh, c, { box: 16, pitch: 5, vents: true })); });
  add("motorized-roller", "Motorized roller", ["#3a3e44", "#f1f0ec", "#7a7f86", "#4a3a2e"], "Finish", (o) => { const x = X(o), c = o.color, wx = 54, wy = 56, ww = 92, wh = 96;
    const back = exterior(x, "render", "#e3ddd2") + frameOut(x, wx, wy, ww, wh, "#3a3e44");
    const sw = `<rect x="160" y="112" width="18" height="28" rx="3" fill="#f4f4f2"/><rect x="160" y="112" width="18" height="28" rx="3" fill="none" stroke="#000" stroke-opacity=".2"/><path d="M169 118l-3.4 4h6.8ZM169 134l-3.4 -4h6.8Z" fill="${o.on ? "#34d399" : "#9aa1a9"}"/><rect x="164" y="125" width="10" height="2" rx="1" fill="#9aa1a9"/>`;
    return scene(x, back + sw, ROLL(o, x, wx, wy, ww, wh, c, { box: 14, pitch: 4.6 }) + led(o, wx + ww + 1, wy - 7)); });
  add("hurricane", "Hurricane roller", ["#f4f1e8", "#d8c8a6", "#5a4a3a", "#8d939a"], "Finish", (o) => { const x = X(o), c = o.color, wx = 28, wy = 62, ww = 144, wh = 112;
    const back = exterior(x, "render", "#e6d2b0") + `<rect x="8" y="8" width="184" height="18" fill="#b8543a"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<path d="M${8 + i * 22} 26q11 -12 22 0" fill="#c86a4a" stroke="#8a3a2a" stroke-width=".8"/>`).join("") +
      glassOut(x, wx, wy, ww, wh) + `<path d="M${wx + ww / 2} ${wy}V${wy + wh}" stroke="#d8d8d8" stroke-width="3"/><rect x="8" y="${wy + wh}" width="184" height="${192 - wy - wh}" fill="#b8b2a6"/>`;
    return scene(x, back, ROLL(o, x, wx, wy, ww, wh, c, { box: 22, pitch: 7, bar: 6 }) + `<rect x="${wx + ww / 2 - 6}" y="${f(wy + (wh - 2) * (1 - amt(o)) + 2)}" width="12" height="3" rx="1.5" fill="#6a6f76"/>`); });

  function venetian(o, x, c, alu) {
    // (multi-function) Tilt (slats open %) and Lift (raised %) readings in o.pval; a reading left out: slats shut, blind down
    const rd = (k) => { const v = o.pval && o.pval[k]; return v != null && v !== "" && isFinite(+v) ? Math.max(0, Math.min(1, +v / 100)) : 0; };
    const wx = 50, wy = 40, ww = 100, wh = 100, a = o.mf ? rd("lift") : amt(o), t = o.mf ? 1 - rd("tilt") : o.on ? tiltOf(o) : 1;
    const back = room(x, 180, "#5f6a72") + `<rect x="${wx - 7}" y="${wy - 7}" width="${ww + 14}" height="${wh + 14}" fill="#f1efe9"/>` + view(x, wx, wy, ww, wh) + `<path d="M${wx + ww / 2} ${wy}V${wy + wh}" stroke="#f1efe9" stroke-width="3"/><rect x="${wx - 11}" y="${wy + wh + 6}" width="${ww + 22}" height="6" fill="#ece9e2"/>`;
    const pitch = alu ? 4.4 : 8, stackH = (wh / pitch) * (alu ? .9 : 1.5) * a * .5 + 3;
    const bot = wy + 6 + (wh - 6 - stackH) * (1 - a) + stackH;
    let s = `<rect x="${wx - 3}" y="${wy - 2}" width="${ww + 6}" height="${alu ? 6 : 9}" rx="1.2" fill="${vmetal(x, c)}"/>`;
    const liftTop = wy + (alu ? 4 : 7), stackEnd = liftTop + (a > 0 ? stackH - 3 : 0);
    if (a > 0) s += vSlats(x, c, wx - 2, liftTop, ww + 4, stackEnd, alu ? 1.6 : 2.6, 1, alu);
    s += vSlats(x, c, wx - 2, stackEnd, ww + 4, bot, pitch, t, alu);
    s += `<rect x="${wx - 3}" y="${f(bot)}" width="${ww + 6}" height="${alu ? 3.4 : 5}" rx="1" fill="${vmetal(x, H().shade(c, -.08))}"/>`;
    if (!alu) [wx + 18, wx + ww - 18].forEach((tx) => { s += `<rect x="${tx - 3}" y="${wy + 6}" width="6" height="${f(bot - wy - 6)}" fill="${H().shade(c, -.06)}" opacity=".92"/>`; });
    else [wx + 22, wx + ww - 22].forEach((tx) => { s += `<path d="M${tx} ${wy + 4}V${f(bot)}" stroke="#eee" stroke-opacity=".55" stroke-width=".5"/>`; });
    if (alu) s += `<rect x="${wx + ww - 10}" y="${wy - 1}" width="10" height="4" rx="1" fill="#1d2025"/>` + led(o, wx + ww - 6, wy + 1);
    else s += `<path d="M${wx + 4} ${wy + 6}V${wy + 62}" stroke="#f4f4f2" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/>`;
    return scene(x, back, s);
  }
  add("fauxwood", "Faux wood 2-inch", ["#f6f4ef", "#ece4d4", "#a7a9a8", "#4a3326", "#c39563"], "Slats", (o) => venetian(o, X(o), o.color, false), TILT);
  add("smart-faux-wood-blinds", "Smart faux-wood blinds", ["#c9ced3", "#2c2f33", "#f4f4f1", "#b8a27a"], "Slats", (o) => venetian(o, X(o), o.color, true), TILT);

  function swing(o, x, c, style, wall) {
    const wx = 62, wy = 46, ww = 76, wh = 104, a = amt(o), ang = Math.PI * a * .97;
    const back = exterior(x, wall, wall === "siding" ? "#d9d4c8" : null) + frameOut(x, wx, wy, ww, wh);
    const lw = ww / 2;
    let s = leaf(x, o, wx, wy, lw, wh, 1, ang, c, style) + leaf(x, o, wx + ww, wy, lw, wh, -1, ang, c, style);
    if (a > .85) s += `<path d="M${wx - lw - 4} ${wy + wh * .55}q-3 2 0 4" stroke="#1a1a1a" stroke-width="1.8" fill="none"/><path d="M${wx + ww + lw + 4} ${wy + wh * .55}q3 2 0 4" stroke="#1a1a1a" stroke-width="1.8" fill="none"/>`;
    return scene(x, back, s);
  }
  add("boardbatten", "Board & batten", ["#2f3b2c", "#1f2a3a", "#7a2a24", "#2a2a2c", "#b98a5a", "#f1efe9"], "Finish", (o) => swing(o, X(o), o.color, "board", "siding"));
  add("louvered", "Louvered pair", ["#1f2a3a", "#2a2a2c", "#2f4a34", "#f1efe9", "#7a2a24"], "Finish", (o) => swing(o, X(o), o.color, "louver", "brick"));
  add("raisedpanel", "Raised panel", ["#2a2a2c", "#1f2a3a", "#4a5a3a", "#f1efe9", "#6a2a2a"], "Finish", (o) => swing(o, X(o), o.color, "panel", "siding"));

  (window.HDA = window.HDA || []).push({
    id: "home2", tab: "Stoves, saunas & shutters", group: "Home", kind: "device", levelLabel: "Open / heat",
    intro: "Real pellet and wood stoves, saunas, exterior roller shutters, venetian blinds and swing shutters. Stoves and saunas: on = burning or heating, the slider sets the heat. Shutters and blinds: off = closed, on = open as far as the slider (venetian blinds also tilt with the Slats menu).",
    
    css, icons,
  });
})();
