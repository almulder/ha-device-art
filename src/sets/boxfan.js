(function () {
  const H = window.HDAH, sh = (c, a) => H.shade(c, a), mix = (a, b, t) => H.mix(a, b, t);
  const P = "hda-boxfan-";
  const f = (n) => Math.round(n * 100) / 100;
  const dark = (c) => { const h = H.hx(c); return h[0] * .3 + h[1] * .59 + h[2] * .11 < 110; };
  const PI = Math.PI, cos = Math.cos, sin = Math.sin;
  const WH = "#eeeeea", BK = "#2e3035", GR = "#9ba1a8", SG = "#a9b9a0", MT = "#a6dcc8", CR = "#efe3c4", TL = "#4fa9a3",
    RD = "#c9483f", YL = "#e6bf55", BL = "#8fc3d6", PK = "#e7a6b6", OR = "#e2782c", SD = "#d8c3a5";
  const CHR = "#d3d9df", BRASS = "#c99a4a", ALU = "#bcc3cb", AIR = "#d6ecff";

  function K(o) {
    const u = o.uid, defs = [], seen = {};
    const stops = (a) => a.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] == null ? "" : ` stop-opacity="${s[2]}"`}/>`).join("");
    const k = {
      u, o, on: !!o.on, lv: Math.max(0.05, Math.min(1, +o.level || 0)), c: o.color || WH,
      def(n, s) { if (!seen[n]) { seen[n] = 1; defs.push(s); } return `url(#${u}-${n})`; },
      lin(n, a, x1, y1, x2, y2) { return k.def(n, `<linearGradient id="${u}-${n}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`); },
      rad(n, a, cx, cy, r) { return k.def(n, `<radialGradient id="${u}-${n}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`); },
      clip(n, d) { k.def(n, `<clipPath id="${u}-${n}"><path d="${d}"/></clipPath>`); return `clip-path="url(#${u}-${n})"`; },
      svg(body) { return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"><defs>${defs.join("")}</defs>${body}</svg>`; },
    };
    return k;
  }

  const MAT = {
    plas: (c) => [[0, sh(c, -.32)], [.16, sh(c, .18)], [.45, c], [.82, sh(c, -.13)], [1, sh(c, -.4)]],
    face: (c) => [[0, sh(c, .2)], [.5, c], [1, sh(c, -.24)]],
    metal: (c) => [[0, sh(c, -.55)], [.22, sh(c, .35)], [.4, sh(c, .8)], [.58, c], [.82, sh(c, -.28)], [1, sh(c, -.6)]],
    blade: (c) => [[0, sh(c, -.32)], [.35, sh(c, .28)], [.6, c], [1, sh(c, -.38)]],
    wood: (c) => [[0, sh(c, -.4)], [.3, sh(c, .16)], [.65, c], [1, sh(c, -.42)]],
  };
  const G = (k, kind, c, v) => k.lin(kind + (v ? "V" : "H") + c.slice(1), MAT[kind](c), 0, 0, v ? 0 : 1, v ? 1 : 0);
  const RG = (k, c) => k.rad("rg" + c.slice(1), [[0, sh(c, .45)], [.55, c], [1, sh(c, -.5)]], .36, .3, .75);
  const sheen = (k) => k.lin("sheen", [[0, "#fff", .22], [.45, "#fff", .04], [1, "#fff", 0]], 0, 0, 0, 1);

  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const circ = (r, x, y) => { x = x || 0; y = y || 0; return `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`; };
  const ellP = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0`;
  const ring = (r1, r2) => circ(r2) + circ(r1);
  function shadow(k, cx, cy, rx, ry, a) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || f(rx * .1)}" fill="${k.rad("sh", [[0, "#000", .6], [.55, "#000", .25], [1, "#000", 0]])}" opacity="${a || .85}"/>`;
  }
  function box(k, x, y, w, h, dx, dy, r, c, front) {
    const t = `M${x + r * .6} ${y}L${x + w - 2} ${y}L${x + w + dx - 2} ${y - dy}L${x + r * .6 + dx} ${y - dy}Z`;
    const s = `M${x + w} ${y + 2}L${x + w + dx} ${y - dy + 2}L${x + w + dx} ${y + h - dy - r * .6}L${x + w} ${y + h - r * .6}Z`;
    return `<path d="${t}" fill="${k.lin("top" + c.slice(1), [[0, sh(c, .05)], [1, sh(c, .32)]], 0, 1, 0, 0)}" stroke="${sh(c, .15)}" stroke-width="${f(r * .5)}" stroke-linejoin="round"/>` +
      `<path d="${s}" fill="${k.lin("side" + c.slice(1), [[0, sh(c, -.22)], [1, sh(c, -.45)]], 0, 0, 0, 1)}" stroke="${sh(c, -.3)}" stroke-width="${f(r * .5)}" stroke-linejoin="round"/>` +
      `<path d="${rr(x, y, w, h, r)}" fill="${front || G(k, "face", c, 1)}"/><path d="${rr(x, y, w, h, r)}" fill="${sheen(k)}"/>` +
      `<path d="M${x + r} ${y + .8}H${x + w - r}" stroke="#fff" stroke-opacity=".45" stroke-width="1.1" stroke-linecap="round"/>` +
      `<path d="M${x + w - .6} ${y + r}V${y + h - r}" stroke="#000" stroke-opacity=".25" stroke-width="1"/>`;
  }
  function knob(k, x, y, r, c, ang) {
    return `<circle cx="${x}" cy="${f(y + 1.4)}" r="${f(r + .8)}" fill="#000" fill-opacity=".4"/><circle cx="${x}" cy="${y}" r="${r}" fill="${RG(k, c)}"/>` +
      `<circle cx="${x}" cy="${y}" r="${f(r * .66)}" fill="${G(k, "plas", c)}"/><path d="M${x} ${y}V${f(y - r * .82)}" stroke="${sh(c, dark(c) ? .7 : -.6)}" stroke-width="1.2" stroke-linecap="round" transform="rotate(${ang || -35} ${x} ${y})"/>`;
  }
  function knobTop(k, x, y, r, c) {
    return `<path d="M${x - r} ${y}v-4a${r} ${f(r * .45)} 0 0 1 ${2 * r} 0v4a${r} ${f(r * .45)} 0 0 1 ${-2 * r} 0Z" fill="${G(k, "plas", c)}"/>` +
      `<ellipse cx="${x}" cy="${y - 4}" rx="${r}" ry="${f(r * .45)}" fill="${sh(c, .3)}"/><path d="M${x} ${y - 4}L${f(x + r * .7)} ${f(y - 4 - r * .2)}" stroke="${sh(c, -.55)}" stroke-width="1"/>`;
  }
  function led(k, x, y, r, col, on) {
    if (!on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3f444c"/>`;
    return `<circle class="${P}glow" cx="${x}" cy="${y}" r="${f(r * 3.4)}" fill="${k.rad("lg" + col.slice(1), [[0, col, .7], [1, col, 0]])}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${f(x - r * .3)}" cy="${f(y - r * .3)}" r="${f(r * .4)}" fill="#fff" fill-opacity=".8"/>`;
  }
  const tube = (k, d, w, c) => `<path d="${d}" fill="none" stroke="${sh(c, -.45)}" stroke-width="${w + 1.2}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f(w * .28)}" stroke-linecap="round" stroke-linejoin="round" transform="translate(-${f(w * .2)} -${f(w * .2)})"/>`;

  const BT = { box: [.2, .42, .3], prop: [.18, .26, .22], wide: [.16, .56, .38], oval: [.34, .34, .04], paddle: [.2, .3, .14], mini: [.28, .5, .3] };
  function blade(k, type, R, c, op) {
    const T = BT[type], r0 = T[0] * R, W = T[1] * R, S = T[2] * R;
    const d = `M${f(-W * .3)} ${f(-r0)}C${f(-W * 1.05)} ${f(-R * .42)} ${f(-W * .8 + S)} ${f(-R * .98)} ${f(S * .55)} ${f(-R)}C${f(W * .9 + S)} ${f(-R * .97)} ${f(W * .95)} ${f(-R * .45)} ${f(W * .3)} ${f(-r0)}Z`;
    let s = "";
    if (type === "oval") s += `<path d="M-2.2 ${f(-R * .1)}L-2.6 ${f(-r0 - 4)}H2.6L2.2 ${f(-R * .1)}Z" fill="${G(k, "metal", c)}"/>`;
    s += `<path d="${d}" fill="${k.lin("bl" + c.slice(1), MAT.blade(c))}" fill-opacity="${op == null ? 1 : op}" stroke="${sh(c, -.5)}" stroke-opacity=".55" stroke-width=".6"/>` +
      `<path d="M${f(-W * .12)} ${f(-r0 - 2)}C${f(-W * .6)} ${f(-R * .45)} ${f(-W * .35 + S)} ${f(-R * .88)} ${f(S * .45)} ${f(-R * .94)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1"/>`;
    if (type === "oval") s += `<circle cx="-1.4" cy="${f(-r0 - 1)}" r=".9" fill="${sh(c, .5)}"/><circle cx="1.4" cy="${f(-r0 - 1)}" r=".9" fill="${sh(c, .5)}"/>`;
    return s;
  }
  function rotor(k, q) {
    const u = k.u, on = k.on, lv = k.lv, R = q.R, n = q.n || 5, key = q.key || "r", c = q.bc || "#dddddd";
    k.def(key + "b", `<g id="${u}-${key}b">${blade(k, q.type || "box", R, c, q.op)}</g>`);
    let set = "";
    for (let i = 0; i < n; i++) set += `<use xlink:href="#${u}-${key}b" transform="rotate(${f((q.phase || 0) + i * 360 / n)})"/>`;
    k.def(key + "s", `<g id="${u}-${key}s">${set}</g>`);
    let mid = "";
    if (on) {
      const a = BT[q.type || "box"][0];
      mid += `<circle r="${R}" fill="${k.rad(key + "disc", [[0, c, 0], [a, c, 0], [a + .12, c, f(.1 + .14 * lv)], [.9, c, f(.08 + .12 * lv)], [1, c, 0]])}"/>`;
      const step = Math.min(14, 360 / n * .17) * (.5 + .7 * lv);
      [.32, .18, .09].forEach((g, i) => { mid += `<use xlink:href="#${u}-${key}s" transform="rotate(${f(-step * (i + 1))})" opacity="${f(g * (.6 + .5 * lv))}"/>`; });
    }
    mid += `<use xlink:href="#${u}-${key}s"${on ? ` opacity="${f(1 - .24 * lv)}"` : ""}/>`;
    const spin = on ? ` class="${P}spin" style="animation-duration:${(1.45 - lv).toFixed(2)}s"` : "";
    return `<g transform="translate(${q.cx} ${q.cy}) scale(${q.sx || 1} ${q.sy || 1})"><g${spin}><circle r="${R + 2}" fill="none"/>${mid}</g>${q.hub || ""}</g>`;
  }
  function cavity(k, R, rearC) {
    let d = ""; for (let i = 0; i < 8; i++) { const a = i * PI / 4 + .2; d += `M${f(cos(a) * R * .24)} ${f(sin(a) * R * .24)}L${f(cos(a) * R * .96)} ${f(sin(a) * R * .96)}`; }
    return `<circle r="${R}" fill="${k.rad("cav", [[0, "#353a42"], [.6, "#1b1e23"], [1, "#08090b"]])}"/><path d="${d}${circ(R * .62)}" fill="none" stroke="${rearC || "#5d646e"}" stroke-opacity=".42" stroke-width=".8"/>` +
      `<circle r="${f(R * .24)}" fill="${k.rad("motor", [[0, "#4a5058"], [1, "#16181c"]], .4, .35, .7)}"/><circle r="${f(R - .7)}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.6"/>`;
  }
  function wire(k, R, q) {
    q = q || {};
    const rings = q.rings == null ? 6 : q.rings, sp = q.spokes == null ? 24 : q.spokes, col = q.col || "#c9ced6", w = q.w || .75,
      dome = q.dome || 0, r0 = q.r0 || R * .16, spi = q.spiral || 0;
    let d = "";
    for (let i = 1; i <= rings; i++) { const r = r0 + (R - r0) * i / rings; d += circ(r, 0, dome * (1 - i / rings)); }
    for (let i = 0; i < sp; i++) {
      const a = i / sp * 2 * PI, x1 = cos(a) * r0, y1 = sin(a) * r0 + dome, x2 = cos(a + spi) * R, y2 = sin(a + spi) * R;
      if (spi) { const am = a + spi * .42, rm = (r0 + R) * .5; d += `M${f(x1)} ${f(y1)}Q${f(cos(am) * rm * 1.08)} ${f(sin(am) * rm * 1.08 + dome * .5)} ${f(x2)} ${f(y2)}`; }
      else d += `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
    }
    return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="${f(w + .5)}" transform="translate(.5 .8)"/>` +
      `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}"/>` +
      (q.hl === false ? "" : `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${f(w * .4)}" transform="translate(-.2 -.3)"/>`);
  }
  function ribs(k, clipName, clipD, x1, x2, y1, y2, step, col, w) {
    let d = ""; for (let y = y1 + step / 2; y < y2; y += step) d += `M${x1} ${f(y)}H${x2}`;
    return `<g ${k.clip(clipName, clipD)}><path d="${d}" stroke="#000" stroke-opacity=".5" stroke-width="${f(w + .6)}" transform="translate(0 .9)"/><path d="${d}" stroke="${col}" stroke-width="${w}"/><path d="${d}" stroke="#fff" stroke-opacity=".3" stroke-width="${f(w * .35)}" transform="translate(0 -.3)"/></g>`;
  }
  function badge(k, r, c, x, y) {
    x = x || 0; y = y || 0;
    return `<circle cx="${x}" cy="${f(y + 1)}" r="${f(r + .6)}" fill="#000" fill-opacity=".45"/><circle cx="${x}" cy="${y}" r="${r}" fill="${RG(k, c)}"/><circle cx="${x}" cy="${y}" r="${f(r * .62)}" fill="none" stroke="${sh(c, -.35)}" stroke-opacity=".6" stroke-width=".7"/>` +
      `<ellipse cx="${f(x - r * .3)}" cy="${f(y - r * .38)}" rx="${f(r * .42)}" ry="${f(r * .22)}" fill="#fff" fill-opacity=".45"/>`;
  }
  const rim = (k, R1, R2, c, kind) => `<path d="${ring(R1, R2)}" fill-rule="evenodd" fill="${G(k, kind || "metal", c, 1)}"/><path d="${circ(R2 - .5)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><path d="${circ(R1 + .4)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".9"/>`;
  function face(k, q) {
    const T = `translate(${q.cx} ${q.cy}) scale(${q.sx || 1} ${q.sy || 1})`;
    return `<g transform="${T}">${cavity(k, q.R, q.rearC)}</g>` + rotor(k, Object.assign({}, q, { R: q.bR || q.R * .93 })) + `<g transform="${T}">${q.grille || ""}${q.rim || ""}</g>`;
  }

  function air(k, cx, cy, R, angs, sx, sy, len) {
    if (!k.on) return "";
    const d = 2.6 - 1.4 * k.lv; len = len || 20;
    return angs.map((a, i) => {
      const r = a * PI / 180, x = cx + cos(r) * R * (sx || 1), y = cy + sin(r) * R * (sy || 1), b = i % 2 ? 3 : -3;
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${a})"><g class="${P}air" style="animation-duration:${d.toFixed(2)}s;animation-delay:-${(i * .53 * d % d).toFixed(2)}s" fill="none" stroke-linecap="round"><path d="M2 0c${f(len * .33)} ${b} ${f(len * .66)} ${-b} ${len} 0" stroke="#3d6f99" stroke-opacity=".35" stroke-width="2.8"/><path d="M2 0c${f(len * .33)} ${b} ${f(len * .66)} ${-b} ${len} 0" stroke="${AIR}" stroke-width="1.4"/></g></g>`;
    }).join("");
  }
  function waves(k, cx, cy, rx, ry) {
    if (!k.on) return "";
    const d = 3 - 1.5 * k.lv;
    return [0, 1].map((i) => `<ellipse class="${P}wave" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || rx}" fill="none" stroke="${AIR}" stroke-width="1.3" style="animation-duration:${d.toFixed(2)}s;animation-delay:-${(i * d / 2).toFixed(2)}s"/>`).join("");
  }
  const osc = (k, body, ox, oy) => k.on ? `<g class="${P}osc" style="transform-origin:${ox}px ${oy}px">${body}</g>` : body;
  const blC = (c, t) => mix(c, "#ffffff", t == null ? .22 : t);

  const CSS = `
.hda-boxfan-spin{transform-box:fill-box;transform-origin:50% 50%}
.hda-anim .hda-boxfan-spin{animation:hda-boxfan-rot 1s linear infinite}
@keyframes hda-boxfan-rot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.hda-boxfan-air{opacity:.3}
.hda-anim .hda-boxfan-air{animation:hda-boxfan-air 2s linear infinite}
@keyframes hda-boxfan-air{0%{transform:translateX(-4px);opacity:0}35%{opacity:.8}100%{transform:translateX(15px);opacity:0}}
.hda-boxfan-wave{transform-box:fill-box;transform-origin:50% 50%;opacity:.22}
.hda-anim .hda-boxfan-wave{animation:hda-boxfan-wave 2.4s ease-out infinite}
@keyframes hda-boxfan-wave{0%{transform:scale(.92);opacity:0}30%{opacity:.45}100%{transform:scale(1.25);opacity:0}}
.hda-boxfan-osc{transform-box:view-box}
.hda-anim .hda-boxfan-osc{animation:hda-boxfan-osc 9s ease-in-out infinite}
@keyframes hda-boxfan-osc{0%,100%{transform:translateX(-5px) skewY(2.5deg) scaleX(.86)}25%,75%{transform:translateX(0) skewY(0deg) scaleX(1)}50%{transform:translateX(5px) skewY(-2.5deg) scaleX(.86)}}
.hda-boxfan-mist{transform-box:fill-box;transform-origin:50% 50%;opacity:.35}
.hda-anim .hda-boxfan-mist{animation:hda-boxfan-mist 2.6s ease-out infinite}
@keyframes hda-boxfan-mist{0%{transform:translateX(0) scale(.4);opacity:0}25%{opacity:.75}100%{transform:translateX(38px) scale(1.7);opacity:0}}
.hda-anim .hda-boxfan-glow{animation:hda-boxfan-glow 3s ease-in-out infinite}
@keyframes hda-boxfan-glow{50%{opacity:.55}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-boxfan-spin,.hda-anim .hda-boxfan-air,.hda-anim .hda-boxfan-wave,.hda-anim .hda-boxfan-osc,.hda-anim .hda-boxfan-mist,.hda-anim .hda-boxfan-glow{animation:none!important}}
`;

  const ic = (id, name, colors, render) => ({ id, name, colors, picker: true, colorLabel: "Body", render });

  const icons = [
    ic("classic", "Classic box fan", [WH, GR, BK, SG, MT], (o) => {
      const k = K(o), c = k.c, cx = 96, cy = 104;
      let s = shadow(k, 104, 171, 76, 7) + `<rect x="44" y="159" width="13" height="10" rx="2" fill="#202226"/><rect x="134" y="159" width="13" height="10" rx="2" fill="#202226"/>`;
      s += box(k, 34, 42, 124, 124, 14, 9, 8, c);
      s += `<path d="M90 37.2L114 37.2L118 34.4L94 34.4Z" fill="#000" fill-opacity=".55" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linejoin="round"/>`;
      s += `<path d="${rr(42, 50, 108, 108, 5)}" fill="${G(k, "face", sh(c, -.14), 1)}"/><path d="${rr(42, 50, 108, 108, 5)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>`;
      s += face(k, { cx, cy, R: 51, n: 3, type: "wide", bc: blC(c, c === BK ? .3 : .15), op: .92, phase: 20 });
      s += ribs(k, "cA", rr(42, 50, 108, 108, 5), 42, 150, 50, 158, 5, sh(c, .08), 1.1);
      s += `<rect x="94.6" y="50" width="2.8" height="108" fill="${sh(c, .05)}"/>` + badge(k, 10, c, cx, cy);
      s += knobTop(k, 147, 38, 6.5, sh(c, c === BK ? .15 : -.08));
      s += waves(k, cx, cy, 58) + air(k, cx, cy, 60, [-160, -130, 160, 130, -20, 20]);
      return k.svg(s);
    }),

    ic("handle", "Carry-handle fan", [BK, WH, GR, SG, MT], (o) => {
      const k = K(o), c = k.c, cx = 96, cy = 110;
      let s = shadow(k, 106, 173, 74, 7);
      s += tube(k, "M72 46C72 20 136 16 140 40", 6.5, sh(c, c === BK ? .12 : -.08));
      s += box(k, 38, 52, 116, 116, 18, 11, 14, c);
      s += `<ellipse cx="74" cy="47.5" rx="6" ry="2.4" fill="#000" fill-opacity=".4"/><ellipse cx="139" cy="42.5" rx="6" ry="2.4" fill="#000" fill-opacity=".4"/>`;
      const g = c === BK ? sh(c, .4) : sh(c, .1);
      s += face(k, { cx, cy, R: 50, n: 5, type: "box", bc: blC(c, c === BK ? .35 : .1), phase: 8,
        grille: wire(k, 50, { rings: 7, spokes: 8, col: g, w: 1.1, dome: 2, r0: 11 }) + badge(k, 10, c),
        rim: rim(k, 50, 53, c, "plas") });
      s += knob(k, 143, 157, 6.5, sh(c, c === BK ? .2 : -.15), 25);
      s += [-1, 0, 1].map((i) => `<circle cx="${f(143 + 10 * sin(i * .7))}" cy="${f(157 - 10 * cos(i * .7))}" r=".9" fill="#fff" fill-opacity=".6"/>`).join("");
      s += waves(k, cx, cy, 57) + air(k, cx, cy, 60, [-150, -120, 150, 120, -30, 30]);
      return k.svg(s);
    }),

    ic("drum", "Drum fan", [GR, BK, RD, WH, SG], (o) => {
      const k = K(o), c = k.c, cx = 90, cy = 92, R = 60, sx = .88, rx = f(R * sx);
      const yc = "#3b3e44";
      let s = shadow(k, 102, 180, 80, 7);
      s += tube(k, "M34 92V150Q34 168 54 168H150Q170 168 170 150V92", 6, yc);
      s += `<circle cx="46" cy="172" r="8.5" fill="#15171a"/><circle cx="46" cy="172" r="3.5" fill="${CHR}"/><circle cx="158" cy="172" r="8.5" fill="#15171a"/><circle cx="158" cy="172" r="3.5" fill="${CHR}"/>`;
      s += `<ellipse cx="${cx + 20}" cy="${cy}" rx="${rx}" ry="${R}" fill="${sh(c, -.4)}"/>`;
      s += `<path d="M${cx} ${cy - R}L${cx + 20} ${cy - R}A${rx} ${R} 0 0 1 ${cx + 20} ${cy + R}L${cx} ${cy + R}A${rx} ${R} 0 0 0 ${cx} ${cy - R}Z" fill="${G(k, "face", c, 1)}"/>`;
      s += [7, 14].map((d) => `<path d="M${cx + d} ${cy - R}A${rx} ${R} 0 0 1 ${cx + d} ${cy + R}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/><path d="M${cx + d + 1.2} ${cy - R + 1}A${rx} ${R} 0 0 1 ${cx + d + 1.2} ${cy + R - 1}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>`).join("");
      s += face(k, { cx, cy, R: 54, sx, n: 3, type: "box", bc: ALU, phase: 15,
        grille: wire(k, 54, { rings: 9, spokes: 40, col: CHR, w: .6, dome: 0, r0: 9 }) + badge(k, 9, CHR),
        rim: rim(k, 54, 60, CHR) });
      s += `<circle cx="34" cy="92" r="8" fill="${RG(k, "#2b2d31")}"/><circle cx="34" cy="92" r="3" fill="${CHR}"/><circle cx="170" cy="92" r="8" fill="${RG(k, "#2b2d31")}"/><circle cx="170" cy="92" r="3" fill="${CHR}"/>`;
      s += waves(k, cx, cy, 62) + air(k, cx, cy, 64, [-165, -140, 165, 140, -25, 25], sx);
      return k.svg(s);
    }),

    ic("tilt", "Floor tilt fan", [GR, BK, WH, TL, RD], (o) => {
      const k = K(o), c = k.c, cx = 100, cy = 92, sy = .93;
      let s = shadow(k, 100, 178, 66, 6);
      s += tube(k, "M30 92C30 146 52 174 100 174C148 174 170 146 170 92", 5.5, sh(c, -.1));
      s += `<rect x="54" y="171" width="18" height="6" rx="3" fill="#1a1b1e"/><rect x="128" y="171" width="18" height="6" rx="3" fill="#1a1b1e"/>`;
      s += `<ellipse cx="${cx + 4}" cy="${cy + 3}" rx="62" ry="${f(62 * sy)}" fill="${sh(c, -.45)}"/>`;
      s += face(k, { cx, cy, R: 56, sy, n: 3, type: "box", bc: "#c7cdd4", phase: 40,
        grille: wire(k, 56, { rings: 7, spokes: 20, col: "#c4cad1", w: .7, dome: 3, r0: 10 }) + badge(k, 10, c, 0, 3),
        rim: rim(k, 56, 63, c) });
      s += `<circle cx="30" cy="92" r="6.5" fill="${RG(k, sh(c, -.35))}"/><circle cx="170" cy="92" r="6.5" fill="${RG(k, sh(c, -.35))}"/>`;
      s += knob(k, 100, 166, 5.5, "#2a2c30", 40);
      s += waves(k, cx, cy, 64, f(64 * sy)) + air(k, cx, cy, 66, [-160, -135, 160, 135, -45, -20, 20], 1, sy);
      return k.svg(s);
    }),

    ic("circulator", "Air circulator", [BK, WH, GR, SG, MT], (o) => {
      const k = K(o), c = k.c, cx = 90, cy = 84;
      let s = shadow(k, 104, 176, 52, 6);
      s += `<path d="M78 172a26 6 0 0 0 52 0v-5a26 6 0 0 0 -52 0Z" fill="${G(k, "plas", c)}"/><ellipse cx="104" cy="167" rx="26" ry="6" fill="${sh(c, .22)}"/>`;
      s += `<path d="M98 168C96 150 104 136 114 124L126 128C118 140 112 154 110 168Z" fill="${G(k, "plas", sh(c, -.08))}"/>`;
      s += `<path d="M${cx} 30Q120 34 132 66Q138 86 132 104Q120 136 ${cx} 138Z" fill="${G(k, "plas", c)}"/><path d="M${cx} 30Q120 34 132 66Q138 86 132 104Q120 136 ${cx} 138Z" fill="${sheen(k)}"/>`;
      s += `<ellipse cx="134" cy="85" rx="5" ry="17" fill="${sh(c, -.35)}"/><path d="M124 120l7 4" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`;
      s += face(k, { cx, cy, R: 50, n: 4, type: "wide", bc: mix(c, "#5a6068", .5), phase: 30, rearC: "#444a52",
        grille: wire(k, 50, { rings: 2, spokes: 20, col: sh(c, c === BK ? .3 : -.05), w: 1.4, spiral: .95, r0: 11 }) + badge(k, 11, c),
        rim: rim(k, 50, 55, c, "plas") });
      s += waves(k, cx, cy, 58) + air(k, cx, cy, 60, [-160, -135, 160, 135, -40, 40]);
      return k.svg(s);
    }),

    ic("desk", "Desk circulator", [WH, BK, MT, PK, YL], (o) => {
      const k = K(o), c = k.c, cx = 98, cy = 96, R = 40;
      let s = shadow(k, 102, 176, 50, 6);
      s += `<path d="M62 170a40 8 0 0 0 80 0v-10a40 8 0 0 0 -80 0Z" fill="${G(k, "plas", c)}"/><ellipse cx="102" cy="160" rx="40" ry="8" fill="${sh(c, .2)}"/><ellipse cx="102" cy="160" rx="40" ry="8" fill="${sheen(k)}"/>`;
      s += tube(k, "M56 96Q56 152 76 158M146 96Q146 152 128 158", 5, sh(c, -.12));
      s += `<ellipse cx="${cx + 7}" cy="${cy + 1}" rx="${R + 5}" ry="${R + 5}" fill="${sh(c, -.4)}"/>`;
      s += face(k, { cx, cy, R, n: 3, type: "prop", bc: blC(c, .2), phase: 50,
        grille: wire(k, R, { rings: 4, spokes: 6, col: sh(c, c === BK ? .3 : .08), w: 1.3, r0: 9 }) + badge(k, 9, c),
        rim: rim(k, R, R + 6, c, "plas") });
      s += `<circle cx="56" cy="96" r="5.5" fill="${RG(k, sh(c, -.2))}"/><circle cx="146" cy="96" r="5.5" fill="${RG(k, sh(c, -.2))}"/>`;
      s += knob(k, 102, 168, 4.2, sh(c, -.25), 0);
      s += waves(k, cx, cy, 48) + air(k, cx, cy, 50, [-155, -125, 155, 125, -30, 30], 1, 1, 17);
      return k.svg(s);
    }),

    ic("clip", "Clip-on fan", [WH, BK, GR, MT, PK], (o) => {
      const k = K(o), c = k.c, cx = 98, cy = 74, R = 38;
      let s = `<path d="M12 150H188V162H12Z" fill="${G(k, "wood", "#a7784c", 1)}"/><path d="M12 150H188" stroke="#fff" stroke-opacity=".3"/><path d="M12 162H188V166H12Z" fill="#000" fill-opacity=".35"/>`;
      s += `<path d="M30 155C60 154 90 157 120 155S170 154 188 156M14 158C50 159 80 157 110 159" stroke="#5b3b20" stroke-opacity=".45" stroke-width=".7" fill="none"/>`;
      s += `<path d="M84 162h34l6 10h-38Z" fill="${G(k, "plas", sh(c, -.1))}"/><path d="M80 141h44a4 4 0 0 1 4 4v5h-52v-5a4 4 0 0 1 4-4Z" fill="${G(k, "plas", c)}"/>`;
      s += `<path d="M124 146C142 148 142 168 124 172" fill="none" stroke="${CHR}" stroke-width="2.4"/><path d="M128 150a6 3 0 0 1 0 6M130 156a6 3 0 0 1 0 6" stroke="#8a9098" stroke-width="1.6" fill="none"/>`;
      s += `<rect x="94" y="114" width="8" height="28" rx="3" fill="${G(k, "plas", sh(c, -.05))}"/><circle cx="98" cy="114" r="6" fill="${RG(k, c)}"/>`;
      s += `<ellipse cx="${cx + 6}" cy="${cy}" rx="${R + 2}" ry="${R + 2}" fill="${sh(c, -.42)}"/>`;
      s += face(k, { cx, cy, R, sx: .92, n: 4, type: "box", bc: blC(c, .25), phase: 10,
        grille: wire(k, R, { rings: 5, spokes: 18, col: sh(c, c === BK ? .35 : .05), w: .8, dome: 1.5, r0: 7 }) + badge(k, 7, c),
        rim: rim(k, R, R + 3.5, c, "plas") });
      s += waves(k, cx, cy, 44) + air(k, cx, cy, 46, [-160, -130, 160, 130, -30, 30], .92, 1, 17);
      return k.svg(s);
    }),

    ic("usb", "USB mini fan", [WH, PK, MT, BK, YL], (o) => {
      const k = K(o), c = k.c, cx = 90, cy = 72, R = 32;
      let s = shadow(k, 104, 178, 44, 5);
      s += `<path d="M132 172C150 172 160 170 168 160" fill="none" stroke="#2a2c30" stroke-width="2.6" stroke-linecap="round"/><g transform="rotate(-50 170 157)"><rect x="166" y="150" width="8" height="12" rx="1.5" fill="#33363b"/><rect x="167" y="142" width="6" height="9" fill="${CHR}"/></g>`;
      s += `<path d="${rr(70, 164, 64, 12, 6)}" fill="${G(k, "face", c, 1)}"/><path d="M76 165H128" stroke="#fff" stroke-opacity=".5"/>`;
      const neck = "M102 166C102 146 124 138 114 122C106 110 92 116 90 104";
      s += `<path d="${neck}" fill="none" stroke="#2c2f34" stroke-width="7" stroke-linecap="round"/><path d="${neck}" fill="none" stroke="#6c727a" stroke-width="5" stroke-dasharray="1.6 1.2"/><path d="${neck}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" transform="translate(-1 -1)"/>`;
      s += `<ellipse cx="${cx + 5}" cy="${cy + 1}" rx="${R + 6}" ry="${R + 6}" fill="${sh(c, -.38)}"/>`;
      s += face(k, { cx, cy, R, n: 5, type: "mini", bc: blC(c, .45), op: .95, phase: 0,
        grille: wire(k, R, { rings: 3, spokes: 8, col: sh(c, c === BK ? .3 : .06), w: 1.6, r0: 8 }) + badge(k, 8, c),
        rim: rim(k, R, R + 6, c, "plas") });
      s += led(k, 102, 170, 1.5, "#7fd7ff", k.on);
      s += waves(k, cx, cy, 40) + air(k, cx, cy, 42, [-160, -130, 160, 130, -25, 25], 1, 1, 15);
      return k.svg(s);
    }),

    ic("deco", "Art deco fan", [CR, TL, RD, BK, "#c7ccd2"], (o) => {
      const k = K(o), c = k.c, cx = 98, cy = 78, R = 46;
      let s = shadow(k, 102, 178, 60, 6);
      s += `<path d="M48 172a54 9 0 0 0 108 0v-8a54 9 0 0 0 -108 0Z" fill="${G(k, "plas", c)}"/><ellipse cx="102" cy="164" rx="54" ry="9" fill="${sh(c, .2)}"/>`;
      s += `<path d="M48 170a54 9 0 0 0 108 0" fill="none" stroke="${CHR}" stroke-width="1.6"/>`;
      s += `<path d="M66 162a36 7 0 0 0 72 0v-8a36 7 0 0 0 -72 0Z" fill="${G(k, "plas", c)}"/><ellipse cx="102" cy="154" rx="36" ry="7" fill="${sh(c, .25)}"/>`;
      s += [0, 1, 2].map((i) => `<path d="M${82 + i * 2} ${163.5 + i * 2.6}H${122 - i * 2}" stroke="${CHR}" stroke-width="1.1"/>`).join("");
      s += `<rect x="98" y="104" width="8" height="50" fill="${G(k, "metal", CHR)}"/><ellipse cx="102" cy="152" rx="8" ry="2.5" fill="${CHR}"/>`;
      let h = `<path d="M118 60C150 58 158 74 156 82C154 94 140 104 118 102Z" fill="${G(k, "plas", c)}"/><path d="M126 70H152M124 78H156M126 86H153M128 94H146" stroke="${CHR}" stroke-width="1.3" stroke-linecap="round"/>`;
      h += `<circle cx="150" cy="56" r="3.2" fill="${RG(k, CHR)}"/><rect x="149" y="56" width="2" height="6" fill="${CHR}"/>`;
      h += `<path d="M96 120C98 108 104 100 116 98L122 104C112 106 108 112 106 120Z" fill="${G(k, "metal", CHR)}"/>`;
      let g = ""; for (let y = -R + 6; y < R; y += 6.5) { const x = Math.sqrt(R * R - y * y); g += `M${f(-x)} ${f(y)}H${f(x)}`; }
      const grille = `<path d="${g}" stroke="#000" stroke-opacity=".45" stroke-width="1.6" transform="translate(0 .9)"/><path d="${g}" stroke="${CHR}" stroke-width="1.1"/><path d="M0 ${-R}V${R}M${-R} 0H${R}" stroke="${CHR}" stroke-width="1.4"/>` + badge(k, 11, CHR);
      h += face(k, { cx, cy, R, sx: .94, n: 4, type: "oval", bc: CHR, phase: 45, grille, rim: rim(k, R, R + 3.5, CHR) });
      s += osc(k, h, 102, 100);
      s += waves(k, cx, cy, 52) + air(k, cx, cy, 54, [-160, -130, 160, 130, -30, 30], .94);
      return k.svg(s);
    }),

    ic("brass", "Vintage brass fan", ["#2c2b29", "#34463a", "#5a2f2a", CR, GR], (o) => {
      const k = K(o), c = k.c, cx = 96, cy = 76, R = 50;
      let s = shadow(k, 102, 179, 58, 6);
      s += `<path d="M90 120C92 146 66 160 52 172a50 7 0 0 0 100 0C138 160 112 146 114 120Z" fill="${G(k, "plas", c)}"/><path d="M90 120C92 146 66 160 52 172a50 7 0 0 0 100 0C138 160 112 146 114 120Z" fill="${sheen(k)}"/>`;
      s += `<path d="M52 172a50 7 0 0 0 100 0" fill="none" stroke="${BRASS}" stroke-width="1.6"/><rect x="90" y="150" width="24" height="9" rx="1.5" fill="${G(k, "metal", BRASS)}"/>`;
      s += `<path d="M120 152l10 -8" stroke="${BRASS}" stroke-width="2.4" stroke-linecap="round"/><circle cx="130.5" cy="143.5" r="2.6" fill="${RG(k, BRASS)}"/>`;
      let h = `<ellipse cx="${cx + 42}" cy="${cy + 6}" rx="22" ry="26" fill="${RG(k, c)}"/><path d="M${cx + 30} ${cy - 12}a14 26 0 0 0 0 36" fill="none" stroke="#fff" stroke-opacity=".18"/>`;
      h += `<rect x="${cx + 40}" y="${cy - 28}" width="5" height="10" fill="${G(k, "metal", BRASS)}"/><circle cx="${cx + 42.5}" cy="${cy - 29}" r="4" fill="${RG(k, BRASS)}"/>`;
      h += `<path d="M94 122C96 110 104 104 120 102L128 110C116 112 110 116 110 122Z" fill="${G(k, "plas", c)}"/>`;
      h += face(k, { cx, cy, R, sx: .95, n: 4, type: "oval", bc: BRASS, phase: 0, rearC: "#6a5a3a",
        grille: wire(k, R, { rings: 4, spokes: 16, col: BRASS, w: .9, dome: 2, r0: 10 }) + badge(k, 10, BRASS),
        rim: rim(k, R, R + 3, BRASS) });
      s += osc(k, h, 104, 112);
      s += waves(k, cx, cy, 56) + air(k, cx, cy, 58, [-160, -130, 160, 130, -30, 30], .95);
      return k.svg(s);
    }),

    ic("table", "Table fan", [WH, BL, MT, CR, BK], (o) => {
      const k = K(o), c = k.c, cx = 100, cy = 78, R = 52;
      let s = shadow(k, 100, 179, 58, 6);
      s += `<path d="M52 170a48 8 0 0 0 96 0v-10a48 8 0 0 0 -96 0Z" fill="${G(k, "plas", c)}"/><ellipse cx="100" cy="160" rx="48" ry="8" fill="${sh(c, .22)}"/><ellipse cx="100" cy="160" rx="48" ry="8" fill="${sheen(k)}"/>`;
      s += [0, 1, 2, 3].map((i) => { const x = 74 + i * 14, p = k.on && i === 1 + Math.min(2, Math.floor(k.lv * 2.99)); return `<rect x="${x}" y="${p ? 167 : 165}" width="11" height="${p ? 5 : 7}" rx="1.5" fill="${i === 0 ? sh(c, -.25) : sh(c, .3)}" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>`; }).join("");
      s += `<path d="M93 158L95 128H105L107 158Z" fill="${G(k, "plas", c)}"/>`;
      let h = `<rect x="96" y="${cy - R - 12}" width="8" height="9" rx="2" fill="${G(k, "plas", sh(c, -.1))}"/><ellipse cx="100" cy="${cy - R - 12}" rx="4" ry="1.6" fill="${sh(c, .3)}"/>`;
      h += `<ellipse cx="${cx + 5}" cy="${cy + 3}" rx="${R + 5}" ry="${R + 5}" fill="${sh(c, -.4)}"/>`;
      h += face(k, { cx, cy, R, n: 3, type: "box", bc: "#bfe0f0", op: .72, phase: 25,
        grille: wire(k, R, { rings: 10, spokes: 32, col: blC(c, .25), w: .55, dome: 2, r0: 13, hl: false }) + badge(k, 13, c),
        rim: rim(k, R, R + 4, c, "plas") });
      s += osc(k, h, 100, 130);
      s += waves(k, cx, cy, 58) + air(k, cx, cy, 60, [-160, -130, 160, 130, -30, 30]);
      return k.svg(s);
    }),

    ic("slim", "Ultra-slim fan", [WH, GR, BK, SG, SD], (o) => {
      const k = K(o), c = k.c, cx = 98, cy = 96;
      let s = shadow(k, 100, 180, 60, 5);
      s += `<ellipse cx="100" cy="176" rx="50" ry="6" fill="none" stroke="${sh(c, -.3)}" stroke-width="4"/><ellipse cx="100" cy="175" rx="50" ry="6" fill="none" stroke="${sh(c, .2)}" stroke-width="1.2"/>`;
      s += `<path d="M84 160L80 176M112 160L116 176" stroke="${sh(c, -.25)}" stroke-width="3.5" stroke-linecap="round"/>`;
      s += box(k, 38, 34, 120, 130, 5, 3, 26, c);
      s += face(k, { cx, cy, R: 50, n: 7, type: "prop", bc: blC(c, c === BK ? .3 : .08), phase: 5,
        grille: wire(k, 50, { rings: 13, spokes: 4, col: sh(c, c === BK ? .35 : .04), w: .5, r0: 9, hl: false }) + badge(k, 9, c),
        rim: `<path d="${circ(50.5)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/><path d="${circ(52.5)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>` });
      s += [0, 1, 2].map((i) => led(k, 132 + i * 6, 152, 1.3, i < Math.ceil(k.lv * 3) ? "#bff3ff" : "#3f444c", k.on && i < Math.ceil(k.lv * 3))).join("");
      s += waves(k, cx, cy, 56) + air(k, cx, cy, 64, [-160, -135, 160, 135, -25, 25]);
      return k.svg(s);
    }),

    ic("shop", "Shop fan", [BK, OR, GR, RD, YL], (o) => {
      const k = K(o), c = k.c, cx = 100, cy = 100, R = 58;
      let s = shadow(k, 100, 184, 80, 6);
      s += `<path d="M38 168L24 182M162 168L176 182" stroke="#1d1f22" stroke-width="5" stroke-linecap="round"/>`;
      s += `<path d="${rr(36, 38, 128, 128, 6)}" fill="${G(k, "face", "#4b5057", 1)}"/>`;
      s += face(k, { cx, cy, R: 56, n: 3, type: "paddle", bc: ALU, phase: 35,
        grille: wire(k, 56, { rings: 6, spokes: 16, col: "#a3aab2", w: 1.4, dome: 4, r0: 11 }) + badge(k, 11, "#3a3d42", 0, 4),
        rim: rim(k, 56, 60, "#8d949c") });
      s += `<path d="${rr(30, 32, 140, 140, 10)}" fill="none" stroke="${sh(c, -.5)}" stroke-width="9.5"/><path d="${rr(30, 32, 140, 140, 10)}" fill="none" stroke="${c}" stroke-width="8"/><path d="${rr(30, 32, 140, 140, 10)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" transform="translate(-1.5 -1.5)"/>`;
      s += `<path d="${rr(78, 26, 44, 12, 5)}" fill="${G(k, "face", "#25272b", 1)}"/><path d="M84 30H116M84 33H116" stroke="#000" stroke-opacity=".5"/>`;
      s += knob(k, 170, 128, 7, "#26282c", 50);
      s += waves(k, cx, cy, 64) + air(k, cx, cy, 70, [-165, -140, 165, 140, -40, 40]);
      return k.svg(s);
    }),

    ic("bladeless", "Bladeless fan", [WH, GR, BK, "#d8b4c8", SG], (o) => {
      const k = K(o), c = k.c, cx = 100, cy = 76;
      let s = shadow(k, 100, 180, 40, 5);
      const ringD = ellP(cx, cy, 44, 58) + ellP(cx, cy, 34, 47);
      if (k.on) {
        s += `<ellipse cx="${cx}" cy="${cy}" rx="34" ry="47" fill="${k.rad("stream", [[0, AIR, .18], [.7, AIR, .07], [1, AIR, 0]])}"/>`;
        const d = (2.4 - 1.2 * k.lv).toFixed(2);
        s += [0, 1, 2].map((i) => `<ellipse class="${P}wave" cx="${cx}" cy="${cy}" rx="36" ry="49" fill="none" stroke="${AIR}" stroke-width="1.6" style="animation-duration:${d}s;animation-delay:-${(i * d / 3).toFixed(2)}s"/>`).join("");
      }
      s += `<path d="${ringD}" fill-rule="evenodd" fill="${sh(c, -.45)}" transform="translate(4 1)"/>`;
      s += `<path d="${ringD}" fill-rule="evenodd" fill="${G(k, "plas", c)}"/><path d="${ringD}" fill-rule="evenodd" fill="${sheen(k)}"/>`;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="34.6" ry="47.6" fill="none" stroke="${CHR}" stroke-width="2"/><ellipse cx="${cx}" cy="${cy}" rx="43.5" ry="57.5" fill="none" stroke="#fff" stroke-opacity=".3"/>`;
      s += `<path d="M78 136V174a22 5 0 0 0 44 0V136Z" fill="${G(k, "plas", c)}"/>`;
      s += `<path d="M78 142H122V166H78Z" fill="#000" fill-opacity=".18"/>`;
      let dots = ""; for (let y = 145; y < 165; y += 3.2) for (let x = 80; x < 121; x += 3.2) dots += `M${f(x)} ${f(y)}h.01`;
      s += `<path d="${dots}" stroke="#000" stroke-opacity=".55" stroke-width="1.5" stroke-linecap="round"/><path d="M78 142H122V166H78Z" fill="${k.lin("cyl", [[0, "#000", .4], [.3, "#000", 0], [.7, "#000", 0], [1, "#000", .45]])}"/>`;
      s += `<ellipse cx="100" cy="136" rx="22" ry="5" fill="${sh(c, .2)}"/><ellipse cx="100" cy="136" rx="9" ry="2.2" fill="${sh(c, -.3)}"/>`;
      s += led(k, 100, 170, 1.5, "#bff3ff", k.on);
      s += air(k, cx, cy, 50, [-170, -145, 170, 145, -35, 35], .9, 1);
      return k.svg(s);
    }),

    ic("remote", "Remote box fan", [GR, BK, WH, SG, MT], (o) => {
      const k = K(o), c = k.c, cx = 95, cy = 91;
      let s = shadow(k, 102, 170, 70, 6);
      s += box(k, 40, 36, 110, 128, 12, 8, 16, c);
      const inner = rr(48, 44, 94, 94, 12);
      s += `<path d="${inner}" fill="${G(k, "face", sh(c, -.12), 1)}"/>`;
      s += face(k, { cx, cy, R: 44, n: 5, type: "box", bc: blC(c, c === BK ? .32 : .1), phase: 12 });
      let g = ""; for (let i = 1; i <= 8; i++) { const t = i * 5.6; g += rr(48 + t, 44 + t, 94 - 2 * t, 94 - 2 * t, Math.max(3, 12 - t * .25)); }
      const gc = sh(c, c === BK ? .3 : .06);
      s += `<g ${k.clip("rC", inner)}><path d="${g}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.5" transform="translate(0 .9)"/><path d="${g}" fill="none" stroke="${gc}" stroke-width="1"/><path d="M95 44V138M48 91H142" stroke="${gc}" stroke-width="1.2"/></g>`;
      s += `<path d="${inner}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>` + badge(k, 8, c, cx, cy);
      s += `<path d="${rr(72, 143, 46, 13, 3)}" fill="#0b0d10"/><path d="${rr(72, 143, 46, 13, 3)}" fill="none" stroke="#fff" stroke-opacity=".18"/>`;
      if (k.on) {
        const sp = Math.max(1, Math.round(k.lv * 9));
        s += `<rect class="${P}glow" x="70" y="141" width="50" height="17" rx="4" fill="#7fe8ff" fill-opacity=".14"/><text x="84" y="153.2" text-anchor="middle" font-family="Consolas,Menlo,monospace" font-weight="700" font-size="10" fill="#8ff0ff">${sp}</text>`;
        s += `<circle cx="99" cy="149.5" r="1.3" fill="#8ff0ff"/><path d="M104 147h9M104 152h6" stroke="#8ff0ff" stroke-width="1.4" stroke-linecap="round"/>`;
      }
      s += `<g transform="rotate(-14 166 174)"><path d="${rr(156, 166, 24, 13, 4)}" fill="${G(k, "face", "#2d3035", 1)}"/><circle cx="162" cy="172.5" r="2.4" fill="#c9483f"/><circle cx="169" cy="172.5" r="1.6" fill="#8a9098"/><circle cx="174.5" cy="172.5" r="1.6" fill="#8a9098"/></g>`;
      s += waves(k, cx, cy, 52) + air(k, cx, cy, 58, [-160, -130, 160, 130, -25, 25]);
      return k.svg(s);
    }),

    ic("wood", "Wood frame fan", [WH, BK, SG, MT, CR], (o) => {
      const k = K(o), c = k.c, cx = 98, cy = 98, wd = "#8a5a34";
      let s = shadow(k, 102, 182, 66, 5);
      s += tube(k, "M58 158L48 180M138 158L148 180", 5, wd);
      s += box(k, 36, 36, 124, 124, 10, 6, 10, wd, G(k, "wood", wd));
      s += `<path d="M40 50C70 47 120 52 156 48M40 120C80 124 120 118 156 122M42 150C80 148 120 152 154 149" stroke="#3e2410" stroke-opacity=".35" stroke-width=".8" fill="none"/>`;
      s += `<path d="${rr(46, 46, 104, 104, 4)}" fill="${G(k, "face", c, 1)}"/><path d="${rr(46, 46, 104, 104, 4)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="1.6"/>`;
      s += face(k, { cx, cy, R: 46, n: 7, type: "prop", bc: mix(c, "#7c838c", .45), phase: 18,
        grille: wire(k, 46, { rings: 12, spokes: 4, col: "#40454c", w: .55, r0: 8, hl: false }) + badge(k, 8, wd),
        rim: `<path d="${circ(47)}" fill="none" stroke="${sh(c, -.25)}" stroke-width="2.2"/><path d="${circ(48.6)}" fill="none" stroke="#fff" stroke-opacity=".35"/>` });
      s += knob(k, 140, 141, 5, wd, 30);
      s += waves(k, cx, cy, 54) + air(k, cx, cy, 64, [-160, -135, 160, 135, -25, 25]);
      return k.svg(s);
    }),

    ic("cube", "Cube fan", [WH, MT, PK, BK, YL], (o) => {
      const k = K(o), c = k.c, cx = 99, cy = 113;
      let s = shadow(k, 108, 170, 60, 6);
      s += `<path d="${rr(60, 160, 82, 8, 3)}" fill="#1e2024"/>`;
      s += box(k, 50, 64, 98, 98, 18, 12, 16, c);
      s += face(k, { cx, cy, R: 42, n: 5, type: "box", bc: blC(c, c === BK ? .3 : .12), phase: 22 });
      const hc = sh(c, c === BK ? .3 : .05), hd = "M0 2.6L4.5 0L9 2.6V7.8L4.5 10.4L0 7.8ZM4.5 10.4V15.6";
      k.def("hex", `<pattern id="${k.u}-hex" width="9" height="15.6" patternUnits="userSpaceOnUse" x="1" y="2"><path d="${hd}" fill="none" stroke="${hc}" stroke-width="1.1"/></pattern>`);
      k.def("hexd", `<pattern id="${k.u}-hexd" width="9" height="15.6" patternUnits="userSpaceOnUse" x="1.5" y="3"><path d="${hd}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="1.5"/></pattern>`);
      const inner = rr(57, 71, 84, 84, 12);
      s += `<path d="${inner}" fill="url(#${k.u}-hexd)"/><path d="${inner}" fill="url(#${k.u}-hex)"/><path d="${inner}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`;
      s += `<path d="${circ(43, cx, cy)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>` + badge(k, 7, c, cx, cy);
      s += led(k, 99, 158.5, 1.3, "#9ff7c8", k.on);
      s += waves(k, cx, cy, 50) + air(k, cx, cy, 56, [-165, -140, 165, 140, -25, 25], 1, 1, 16);
      return k.svg(s);
    }),

    ic("mist", "Misting fan", [WH, MT, BL, PK, GR], (o) => {
      const k = K(o), c = k.c, cx = 100, cy = 66, R = 34;
      let s = shadow(k, 100, 178, 42, 5);
      const lvl = k.on ? 140 : 146;
      s += `<path d="M68 122V172a32 6 0 0 0 64 0V122Z" fill="#cfe9ff" fill-opacity=".14"/>`;
      s += `<path d="M70 ${lvl}V171a30 5.4 0 0 0 60 0V${lvl}Z" fill="${k.lin("water", [[0, "#7cc8f0", .75], [1, "#2a7fb8", .85]], 0, 0, 0, 1)}"/><ellipse cx="100" cy="${lvl}" rx="30" ry="5" fill="#bfe8ff" fill-opacity=".55"/>`;
      s += `<path d="M68 122V172a32 6 0 0 0 64 0V122" fill="none" stroke="#e8f6ff" stroke-opacity=".5" stroke-width="1.2"/><path d="M75 128V168" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/>`;
      s += `<path d="M66 112v10a34 6 0 0 0 68 0v-10Z" fill="${G(k, "plas", c)}"/><ellipse cx="100" cy="112" rx="34" ry="6" fill="${sh(c, .22)}"/>`;
      s += `<rect x="95" y="98" width="10" height="14" fill="${G(k, "plas", c)}"/>` + led(k, 120, 120, 1.5, "#7fd7ff", k.on);
      s += `<ellipse cx="${cx + 5}" cy="${cy + 1}" rx="${R + 6}" ry="${R + 6}" fill="${sh(c, -.4)}"/>`;
      s += face(k, { cx, cy, R, n: 5, type: "box", bc: blC(c, .35), op: .92, phase: 30,
        grille: wire(k, R, { rings: 4, spokes: 10, col: sh(c, c === GR ? .3 : .05), w: 1.2, r0: 8 }) + badge(k, 8, c),
        rim: rim(k, R, R + 6, c, "plas") });
      s += `<circle cx="${cx - 2}" cy="${cy - 1.5}" r=".9" fill="#2b5d80"/><circle cx="${cx + 2}" cy="${cy - 1.5}" r=".9" fill="#2b5d80"/><circle cx="${cx}" cy="${cy + 2}" r=".9" fill="#2b5d80"/>`;
      if (k.on) {
        const d = (3 - 1.4 * k.lv).toFixed(2), mg = k.rad("mist", [[0, "#ffffff", .9], [.5, "#e6f6ff", .45], [1, "#e6f6ff", 0]]);
        s += [-150, -110, -70, -30, 20, 160, 200].map((a, i) => `<g transform="translate(${cx} ${cy}) rotate(${a})"><circle class="${P}mist" cx="8" cy="0" r="7" fill="${mg}" style="animation-duration:${d}s;animation-delay:-${(i * .41 * d % d).toFixed(2)}s"/></g>`).join("");
      }
      s += air(k, cx, cy, 46, [-160, -130, 160, 130, -30, 30], 1, 1, 15);
      return k.svg(s);
    }),

    ic("camping", "Camping fan", ["#7c8a63", BK, OR, GR, MT], (o) => {
      const k = K(o), c = k.c, cx = 100, cy = 96, R = 42;
      let s = shadow(k, 100, 182, 52, 5);
      s += tube(k, "M88 140L70 180M112 140L130 180", 4.5, "#3a3d42");
      s += tube(k, "M95 36C93 16 116 12 116 26C116 31 110 32 108 28", 3.2, CHR);
      s += `<rect x="92" y="32" width="16" height="8" rx="2" fill="${G(k, "plas", sh(c, -.2))}"/>`;
      if (k.on) s += `<circle class="${P}glow" cx="${cx}" cy="${cy}" r="${f(78 + 6 * k.lv)}" fill="${k.rad("lan", [[0, "#ffe2a8", 0], [.62, "#ffe2a8", f(.12 + .2 * k.lv)], [1, "#ffe2a8", 0]])}"/>`;
      s += face(k, { cx, cy, R, n: 5, type: "box", bc: "#9aa1a9", phase: 8,
        grille: wire(k, R, { rings: 4, spokes: 12, col: "#555b63", w: 1.1, r0: 8 }) + badge(k, 8, c),
        rim: rim(k, R, R + 4, "#3a3e44", "plas") +
          `<path d="${ring(R + 4, R + 10)}" fill-rule="evenodd" fill="${k.on ? k.rad("lr", [[0, "#fff8ea"], [.86, "#fff4dc"], [.93, "#ffd98a"], [1, "#e9b45a"]]) : k.rad("lro", [[0, "#e7e5df"], [.86, "#d9d6cf"], [1, "#8e8a82"]])}" opacity="${k.on ? f(.55 + .45 * k.lv) : 1}"/>` +
          rim(k, R + 10, R + 18, c, "plas") });
      s += [0, 1, 2, 3].map((i) => `<rect x="${89 + i * 6}" y="153" width="4" height="2.4" rx="1" fill="${k.on && i < 3 ? "#52d98a" : "#2b2e33"}"/>`).join("");
      s += air(k, cx, cy, 64, [-160, -135, 160, 135, -25, 25], 1, 1, 15);
      return k.svg(s);
    }),

    ic("pullcord", "Pull-cord fan", [WH, BK, GR, CR, BL], (o) => {
      const k = K(o), c = k.c, cx = 98, cy = 78, R = 54;
      let s = shadow(k, 102, 180, 56, 5);
      s += box(k, 62, 160, 76, 14, 10, 6, 4, c);
      s += `<path d="M94 160V128H104V160Z" fill="${G(k, "plas", c)}"/>`;
      let h = `<ellipse cx="${cx + 5}" cy="${cy + 3}" rx="${R + 6}" ry="${R + 6}" fill="${sh(c, -.42)}"/>`;
      h += `<path d="${rr(116, 128, 22, 12, 4)}" fill="${G(k, "plas", c)}"/><path d="M119 129H135" stroke="#fff" stroke-opacity=".5"/>`;
      h += `<path d="M123 140V150M132 140V146" stroke="#e8e2d2" stroke-width=".9"/><path d="M121.6 149h2.8l.8 5h-4.4Z" fill="${G(k, "wood", "#b78a58")}"/><path d="M130.6 145h2.8l.8 5h-4.4Z" fill="${G(k, "wood", "#b78a58")}"/>`;
      h += face(k, { cx, cy, R, n: 5, type: "box", bc: blC(c, c === BK ? .3 : .1), phase: 40,
        grille: wire(k, R, { rings: 5, spokes: 36, col: sh(c, c === BK ? .35 : .05), w: .6, r0: 14 }) + badge(k, 14, c),
        rim: rim(k, R, R + 4, c, "plas") });
      s += osc(k, h, 99, 140);
      s += waves(k, cx, cy, 60) + air(k, cx, cy, 62, [-160, -130, 160, 130, -30, 30]);
      return k.svg(s);
    }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "boxfan",
    tab: "Box fans",
    group: "Fans",
    kind: "fan",
    intro: "Box, drum and table-top fans that sit on the floor or a table. On, the blades spin behind the grille with a motion blur (faster with the speed slider), air streams out the front, and the table fans turn their head side to side.",
    
    css: CSS,
    icons,
  });
})();
