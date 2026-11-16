(function () {
  "use strict";
  const P = "hda-buttons-";
  const H = () => window.HDAH;
  const f = (v) => (Math.round(v * 10) / 10).toString();
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const FONT = `font-family="Segoe UI, Roboto, Arial, sans-serif"`;

  function X(o, d1, d2) {
    const d = []; let n = 0;
    const st = (a) => a.map(([of, c, op]) => `<stop offset="${of}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
    const x = { o, d,
      opt: (k, def) => (o.opt && o.opt[k]) || def,
      c1: o.color || d1, c2: o.color2 || d2,
      lv: cl(o.level == null ? .6 : +o.level || 0, 0, 1),
      lg(a, x1, y1, x2, y2) { const id = `${o.uid}-g${n++}`; d.push(`<linearGradient id="${id}" x1="${x1 == null ? 0 : x1}" y1="${y1 == null ? 0 : y1}" x2="${x2 == null ? 0 : x2}" y2="${y2 == null ? 1 : y2}">${st(a)}</linearGradient>`); return `url(#${id})`; },
      rg(a, cx, cy, r) { const id = `${o.uid}-g${n++}`; d.push(`<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r == null ? .5 : r}">${st(a)}</radialGradient>`); return `url(#${id})`; },
      blur(sd) { const id = `${o.uid}-b${n++}`; d.push(`<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `url(#${id})`; } };
    x.on = !!o.on; x.anim = !!o.anim;
    x.hot = H().mix(x.c1, "#ffffff", .55);
    return x;
  }
  function pal(c) {
    const h = H(), m = /^#?([0-9a-f]{6})$/i.exec(c || ""), n = m ? parseInt(m[1], 16) : 0xdddddd;
    const lum = (((n >> 16) & 255) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11) / 255, lt = lum > .7;
    return { l: h.shade(c, lt ? .5 : .32), m: c, d: h.shade(c, lt ? -.14 : -.3), k: h.shade(c, lt ? -.34 : -.55), lt, dark: lum < .3 };
  }
  const shadow = (x, cx, cy, rx, ry, op) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${x.rg([[0, "#000", op == null ? .5 : op], [1, "#000", 0]])}"/>`;
  const drop = (x, shape, dx, dy, op, sd) => `<g transform="translate(${dx} ${dy})" opacity="${op}" filter="${x.blur(sd || 3)}" fill="#000">${shape}</g>`;
  function wrap(x, bg, item) {
    const c = `${x.o.uid}-card`, vig = x.rg([[0, "#000", 0], [.65, "#000", .06], [1, "#000", .42]], .5, .46, .75);
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${c}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>${x.d.join("")}</defs>` +
      `<g clip-path="url(#${c})"><g class="hda-bg">${bg}<rect width="200" height="200" fill="${vig}"/></g>${item}</g>` +
      `<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".07"/></g></svg>`;
  }
  const firstIs = (op, v) => Object.assign({}, op, { values: [op.values.find((p) => p[0] === v)].concat(op.values.filter((p) => p[0] !== v)) });

  function wall(x, tone, seed) {
    const w = tone || "#8d8796"; let s = `<rect width="200" height="200" fill="${x.lg([[0, H().shade(w, .1)], [1, H().shade(w, -.24)]])}"/>`, k = seed || 7;
    for (let i = 0; i < 120; i++) { k = (k * 16807) % 2147483647; const a = k % 200; k = (k * 16807) % 2147483647; const b = k % 200; s += `<circle cx="${a}" cy="${b}" r="${f(.4 + (k % 7) / 10)}" fill="${k % 2 ? "#fff" : "#000"}" opacity=".07"/>`; }
    return s + `<rect width="200" height="200" fill="${x.rg([[0, "#fff", .12], [1, "#fff", 0]], .35, .2, .7)}"/>`;
  }
  function desk(x, y, tone, wood) {
    const wd = wood || "#8a5a36";
    let s = wall(x, tone || "#7f8794", 3) + `<rect y="${y}" width="200" height="${200 - y}" fill="${x.lg([[0, H().shade(wd, .12)], [1, H().shade(wd, -.4)]])}"/>`;
    for (let i = 0; i < 9; i++) { const yy = y + 6 + i * i * 1.3 + i * 4; s += `<path d="M0 ${f(yy)}C50 ${f(yy - 2)} 120 ${f(yy + 3)} 200 ${f(yy - 1)}" fill="none" stroke="${i % 2 ? "#000" : "#fff"}" stroke-opacity="${i % 2 ? .12 : .07}" stroke-width="${f(.8 + i * .15)}"/>`; }
    return s + `<rect y="${y}" width="200" height="2" fill="#fff" opacity=".22"/><rect y="${y - 3}" width="200" height="3" fill="#000" opacity=".18"/>`;
  }
  function tiles(x) {
    let s = `<rect width="200" height="200" fill="#d9dcd8"/>`;
    for (let row = 0, y = 0; y < 200; y += 16, row++) for (let bx = -(row % 2) * 17; bx < 200; bx += 34)
      s += `<rect x="${bx + 1}" y="${y + 1}" width="32" height="14" rx="2" fill="${x.lg([[0, "#f4f5f2"], [1, "#d3d6d2"]])}"/><path d="M${bx + 4} ${y + 3.5}H${bx + 20}" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`;
    return s + `<rect width="200" height="200" fill="${x.lg([[0, "#000", .05], [1, "#000", .35]])}"/>`;
  }

  const halo = (x, cx, cy, r, c, op) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, c, op == null ? .6 : op], [.45, c, (op == null ? .6 : op) * .35], [1, c, 0]])}"/>`;
  const led = (x, cx, cy, r, c, lit, blink) => lit
    ? `<g${blink ? ` class="${P}blink"` : ""}>${halo(x, cx, cy, r * 4.5, c, .7)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${H().mix(c, "#fff", .5)}"/></g>`
    : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000" opacity=".35"/>`;
  function waves(x, cx, cy, ang, spread, c, n, r0, step) {
    let s = ""; const a0 = (ang - spread / 2) * Math.PI / 180, a1 = (ang + spread / 2) * Math.PI / 180;
    for (let i = 0; i < (n || 3); i++) {
      const r = (r0 || 10) + i * (step || 8);
      s += `<path class="${P}wave" style="animation-delay:${(i * .3).toFixed(2)}s" d="M${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))}A${r} ${r} 0 0 1 ${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))}" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" opacity="${(.95 - i * .22).toFixed(2)}"/>`;
    }
    return `<g>${s}</g>`;
  }
  const ACTION = { id: "act", name: "Action", values: [["single", "Single press"], ["double", "Double press"], ["long", "Long press"]] };
  const ACT_TAG = { single: "1×", double: "2×", long: "Hold" };
  function chip(x, txt, c) {
    const w = 10 + txt.length * 5.6;
    return `<g><rect x="${f(182 - w)}" y="18" width="${f(w)}" height="15" rx="7.5" fill="#000" opacity=".55"/><rect x="${f(182 - w)}" y="18" width="${f(w)}" height="15" rx="7.5" fill="none" stroke="${c}" stroke-opacity=".7"/>` +
      `<text x="${f(182 - w / 2)}" y="28.8" text-anchor="middle" ${FONT} font-size="9" font-weight="600" fill="#fff">${txt}</text></g>`;
  }

  function dialSwitch(o) {
    const x = X(o, "#ffb347", "#f2f1ee"), p = pal(x.c2), lv = x.lv, cx = 100, cy = 100;
    const bg = wall(x, "#7b8790", 5);
    let s = drop(x, `<rect x="52" y="52" width="96" height="96" rx="18"/>`, 3, 6, .55, 4);
    s += `<rect x="52" y="52" width="96" height="96" rx="18" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}"/>` +
      `<rect x="52.6" y="52.6" width="94.8" height="94.8" rx="17.4" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .9 : .25}" stroke-width="1.2"/>` +
      `<rect x="55" y="55" width="90" height="90" rx="15.5" fill="none" stroke="#000" stroke-opacity=".12"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="42.5" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="4.4"/>` +
      `<circle cx="${cx}" cy="${cy}" r="42.5" fill="none" stroke="${x.c1}" stroke-opacity="${x.on ? .14 : .06}" stroke-width="2.6"/>`;
    if (x.on) {
      const dash = `pathLength="100" stroke-dasharray="${f(Math.max(lv * 100, 1.5))} 100" transform="rotate(-90 ${cx} ${cy})"`;
      s += `<g class="${P}breathe"><circle cx="${cx}" cy="${cy}" r="42.5" fill="none" stroke="${x.c1}" stroke-width="9" opacity=".45" filter="${x.blur(2.6)}" ${dash}/></g>` +
        `<circle cx="${cx}" cy="${cy}" r="42.5" fill="none" stroke="${x.c1}" stroke-width="3" stroke-linecap="round" ${dash}/>` +
        `<circle cx="${cx}" cy="${cy}" r="42.5" fill="none" stroke="${x.hot}" stroke-width="1.2" stroke-linecap="round" ${dash}/>`;
    }
    const ang = lv * 300 - 150;
    let ticks = ""; for (let i = 0; i < 48; i++) ticks += `<path d="M${cx} ${cy - 39.4}V${cy - 35.6}" transform="rotate(${i * 7.5} ${cx} ${cy})"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="40" fill="${x.lg([[0, p.l], [.45, p.m], [1, p.k]], 0, 0, .3, 1)}"/>` +
      `<g class="${x.on ? P + "nudge" : ""}"><g transform="rotate(${f(ang)} ${cx} ${cy})"><g stroke="${p.k}" stroke-opacity=".55" stroke-width="1.1">${ticks}</g>` +
      `<path d="M${cx} ${cy - 39.6}V${cy - 34}" stroke="${x.on ? x.c1 : p.k}" stroke-width="2.4" stroke-linecap="round"/></g></g>` +
      `<circle cx="${cx}" cy="${cy}" r="40" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .7 : .2}" stroke-width=".8"/>`;
    s += `<circle cx="${cx}" cy="${cy + 1.4}" r="33" fill="#000" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="32.6" fill="${x.rg([[0, p.l], [.75, p.m], [1, p.d]], .4, .35, .75)}"/>` +
      `<g stroke="${p.k}" stroke-opacity=".5" stroke-width="1.4"><path d="M${cx - 31} ${cy}H${cx + 31}M${cx} ${cy - 31}V${cy + 31}"/></g>` +
      `<g stroke="#fff" stroke-opacity="${p.lt ? .8 : .15}" stroke-width=".7"><path d="M${cx - 31} ${cy + 1}H${cx + 31}M${cx + 1} ${cy - 31}V${cy + 31}"/></g>`;
    const dots = [[-14, -14, 1], [14, -14, 2], [-14, 14, 3], [14, 14, 4]];
    s += dots.map(([dx, dy, k]) => { let g = ""; for (let i = 0; i < k; i++) g += `<circle cx="${f(cx + dx + (i - (k - 1) / 2) * 3.4)}" cy="${cy + dy}" r="1.1"/>`; return g; }).join("").replace(/^/, `<g fill="${p.k}" opacity=".55">`) + `</g>`;
    s += `<path d="M${cx - 24} ${cy - 16}A28 28 0 0 1 ${cx + 6} ${cy - 29}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="${p.lt ? .85 : .3}"/>`;
    return wrap(x, bg, s);
  }

  function knob(o) {
    const x = X(o, "#7cc4ff", "#2c2e33"), p = pal(x.c2), lv = x.lv, cx = 100, ty = 90, by = 122, rx = 38, ry = 13;
    const bg = desk(x, 112, "#6f7a86", "#7a5233");
    let s = shadow(x, cx, 132, 58, 13, .6);
    const N = 28, bR = 45, bRy = 15.5, bY = 127;
    const dot = (i, front) => { const th = Math.PI / 2 + (i / N) * Math.PI * 2, sn = Math.sin(th); if ((sn > 0) !== front) return "";
      const px = cx + bR * Math.cos(th), py = bY + bRy * sn, lit = x.on && i / N < lv - .001;
      return lit ? `<circle cx="${f(px)}" cy="${f(py)}" r="2.6" fill="${x.c1}" opacity=".5" filter="${x.blur(1.6)}"/><circle cx="${f(px)}" cy="${f(py)}" r="1.4" fill="${x.hot}"/>`
        : `<circle cx="${f(px)}" cy="${f(py)}" r="1.2" fill="#fff" opacity="${front ? .18 : .1}"/>`; };
    s += `<ellipse cx="${cx}" cy="${bY + 2}" rx="${bR + 2}" ry="${bRy + 1.5}" fill="${x.lg([[0, "#d7dbe0"], [1, "#7d838b"]])}"/><ellipse cx="${cx}" cy="${bY}" rx="${bR + 2}" ry="${bRy + 1}" fill="${x.lg([[0, "#eef1f4"], [1, "#a9afb7"]])}"/>`;
    if (x.on) s += `<g class="${P}breathe"><ellipse cx="${cx}" cy="${bY + 3}" rx="${bR + 10}" ry="${bRy + 7}" fill="${x.rg([[.55, x.c1, .5], [1, x.c1, 0]])}"/></g>`;
    let back = "", front = ""; for (let i = 0; i < N; i++) { back += dot(i, false); front += dot(i, true); }
    s += back;
    s += `<path d="M${cx - rx} ${ty}V${by}A${rx} ${ry} 0 0 0 ${cx + rx} ${by}V${ty}Z" fill="${x.lg([[0, p.k], [.18, p.d], [.38, p.l], [.6, p.m], [1, p.k]], 0, 0, 1, 0)}"/>`;
    let ribs = ""; const rot = lv * 5.2;
    for (let k = 0; k < 40; k++) { const th = k / 40 * Math.PI * 2 + rot, sn = Math.sin(th); if (sn <= .05) continue;
      const px = cx + rx * Math.cos(th), o1 = (sn * .45).toFixed(2);
      ribs += `<path d="M${f(px)} ${f(ty + ry * sn + 3)}V${f(by + ry * sn - 2)}" stroke="#000" stroke-opacity="${o1}" stroke-width="1"/><path d="M${f(px + .9)} ${f(ty + ry * sn + 3)}V${f(by + ry * sn - 2)}" stroke="#fff" stroke-opacity="${(sn * .14).toFixed(2)}" stroke-width=".6"/>`; }
    s += ribs + front;
    const ma = -Math.PI / 2 + lv * Math.PI * 1.66 - Math.PI * .83;
    s += `<ellipse cx="${cx}" cy="${ty}" rx="${rx}" ry="${ry}" fill="${x.lg([[0, p.l], [1, p.m]])}"/><ellipse cx="${cx}" cy="${ty + .8}" rx="${rx - 6}" ry="${ry - 4}" fill="${x.lg([[0, p.d], [1, p.l]])}" opacity=".7"/>` +
      `<circle cx="${f(cx + 24 * Math.cos(ma))}" cy="${f(ty + 7.6 * Math.sin(ma))}" r="2" fill="${x.on ? x.hot : (p.lt ? p.k : p.l)}"/>` +
      `<path d="M${cx - 30} ${ty - 5}Q${cx - 6} ${ty - 13} ${cx + 18} ${ty - 11}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`;
    return wrap(x, bg, s);
  }

  const PIPS = { 1: [[20, 20]], 2: [[11, 11], [29, 29]], 3: [[10, 10], [20, 20], [30, 30]], 4: [[11, 11], [29, 11], [11, 29], [29, 29]],
    5: [[10, 10], [30, 10], [20, 20], [10, 30], [30, 30]], 6: [[11, 9], [29, 9], [11, 20], [29, 20], [11, 31], [29, 31]] };
  function cube(o) {
    const x = X(o, "#f2f1ee"), p = pal(x.c1), g = x.opt("gest", "flip"), face = x.opt("face", "1");
    const bg = desk(x, 120, "#857c8c", "#6b4a33");
    const act = x.on, mv = act ? { flip: "flip", rotate: "", shake: "shake", tap: "tapc" }[g] : "";
    let s = `<g class="${act && g === "flip" ? P + "flipsh" : ""}">${shadow(x, 100, 150, 52, 10, .6)}</g>`;
    if (act && g === "rotate") {
      const arr = (a) => `<path d="M${f(62 * Math.cos(-1))} ${f(62 * Math.sin(-1))}A62 62 0 0 1 ${f(62 * Math.cos(.3))} ${f(62 * Math.sin(.3))}" transform="rotate(${a})" fill="none" stroke="${x.hot}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M0 -10L12 0L0 10Z" transform="rotate(${a}) rotate(${f(.3 * 57.3)}) translate(62 0) rotate(90)" fill="${x.hot}"/>`;
      s += `<g transform="translate(100 112) scale(1 .38)"><g class="${P}spin">${arr(0)}${arr(180)}</g></g>`;
    }
    const top = "M100 60L140 82L100 104L60 82Z", left = "M60 82L100 104L100 148L60 126Z", right = "M100 104L140 82L140 126L100 148Z";
    let c = `<path d="M100 60L140 82L140 126L100 148L60 126L60 82Z" fill="${p.d}" stroke="${p.d}" stroke-width="12" stroke-linejoin="round"/>` +
      `<path d="${top}" fill="${x.lg([[0, p.l], [1, H().mix(p.l, p.m, .5)]])}" stroke="${p.l}" stroke-width="10" stroke-linejoin="round"/>` +
      `<path d="${left}" fill="${x.lg([[0, p.m], [1, p.d]], 0, 0, 1, 1)}" stroke="${p.m}" stroke-width="8" stroke-linejoin="round" stroke-opacity=".6"/>` +
      `<path d="${right}" fill="${x.lg([[0, p.d], [1, p.k]], 0, 0, 1, 1)}" stroke="${p.d}" stroke-width="8" stroke-linejoin="round" stroke-opacity=".6"/>` +
      `<path d="M60 82L100 104L140 82" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .75 : .25}" stroke-width="1.6" stroke-linejoin="round"/>` +
      `<path d="M100 104V148" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>`;
    c += `<g transform="matrix(1 .55 -1 .55 100 60)">${(PIPS[face] || PIPS[1]).map(([u, v]) => `<circle cx="${u}" cy="${v}" r="3.6" fill="${p.k}" opacity=".35"/><circle cx="${u - .5}" cy="${v - .5}" r="3" fill="${p.d}" opacity=".6"/>`).join("")}</g>` +
      `<g transform="matrix(1 .55 0 1.15 60 82)"><circle cx="20" cy="20" r="8" fill="none" stroke="${p.k}" stroke-opacity=".35" stroke-width="1.6"/><circle cx="20" cy="20" r="2" fill="${p.k}" opacity=".3"/></g>` +
      `<g transform="matrix(1 -.55 0 1.15 100 104)"><rect x="17" y="34" width="6" height="2" rx="1" fill="${act ? x.hot : "#000"}" opacity="${act ? 1 : .3}"/></g>` +
      `<path d="M72 80L100 64.6" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="${p.lt ? .7 : .3}"/>`;
    s += `<g class="${mv ? P + mv : ""}">${c}</g>`;
    if (act && g === "shake") s += `<g stroke="${x.hot}" stroke-width="3" stroke-linecap="round" fill="none" class="${P}blink"><path d="M44 86Q38 104 44 122M34 92Q29 104 34 116M156 86Q162 104 156 122M166 92Q171 104 166 116"/></g>`;
    if (act && g === "flip") s += `<g fill="none" stroke="${x.hot}" stroke-width="4" stroke-linecap="round"><path d="M58 50Q100 18 142 50"/></g><path d="M134 40L146 54L130 56Z" fill="${x.hot}"/>`;
    if (act && g === "tap") {
      s += [0, 1, 2].map((i) => `<ellipse class="${P}rip" style="animation-delay:${(i * .35).toFixed(2)}s" cx="100" cy="82" rx="${16 + i * 9}" ry="${f((16 + i * 9) * .55)}" fill="none" stroke="${x.hot}" stroke-width="2.4" opacity="${(.9 - i * .25).toFixed(2)}"/>`).join("");
    }
    if (act) s += chip(x, { flip: "Flip", rotate: "Rotate", shake: "Shake", tap: "Tap" }[g], x.hot);
    return wrap(x, bg, s);
  }

  function rippleSet(x, a, shape) {
    if (a === "long") return "";
    const n = a === "double" ? 2 : 1;
    let s = ""; for (let i = 0; i < n; i++) s += shape(i).replace("<", `<`).replace(/^<(\w+)/, `<$1 class="${P}rip${a === "double" ? "2" : ""}" style="animation-delay:${(i * .3).toFixed(2)}s"`);
    return s;
  }
  function puck(o) {
    const x = X(o, "#ffffff", "#f2f1ee"), p = pal(x.c2), a = x.opt("act", "single"), cx = 100, ty = 100, rx = 46, ry = 16, h = 14;
    const bg = desk(x, 104, "#7a8696", "#9a7048");
    let s = shadow(x, cx, ty + h + 10, 64, 16, .6);
    if (x.on) s += `<ellipse cx="${cx}" cy="${ty + h + 4}" rx="62" ry="17" fill="${x.rg([[.5, x.c1, .55], [1, x.c1, 0]])}"/>`;
    s += `<path d="M${cx - rx} ${ty}V${ty + h}A${rx} ${ry} 0 0 0 ${cx + rx} ${ty + h}V${ty}Z" fill="${x.lg([[0, p.k], [.25, p.d], [.45, p.l], [.7, p.m], [1, p.k]], 0, 0, 1, 0)}"/>` +
      `<path d="M${cx - rx + 2} ${ty + h - 1}A${rx - 2} ${ry - 1} 0 0 0 ${cx + rx - 2} ${ty + h - 1}" fill="none" stroke="#000" stroke-opacity=".25"/>`;
    s += `<ellipse cx="${cx}" cy="${ty + 2}" rx="${rx}" ry="${ry}" fill="none" stroke="${x.on ? x.c1 : "#000"}" stroke-opacity="${x.on ? .9 : .25}" stroke-width="2.6"/>`;
    if (x.on && a === "long") s += `<ellipse class="${P}fill" cx="${cx}" cy="${ty + 2}" rx="${rx}" ry="${ry}" pathLength="100" stroke-dasharray="100 100" fill="none" stroke="${x.hot}" stroke-width="3.2" stroke-linecap="round" transform="rotate(180 ${cx} ${ty + 2})"/>`;
    if (x.on) s += `<ellipse cx="${cx}" cy="${ty + 2}" rx="${rx}" ry="${ry}" fill="none" stroke="${x.c1}" stroke-width="9" opacity=".35" filter="${x.blur(2.4)}"/>`;
    const topG = `<ellipse cx="${cx}" cy="${ty + 1}" rx="${rx - 3}" ry="${ry - 1.5}" fill="${p.d}"/><ellipse cx="${cx}" cy="${ty}" rx="${rx - 3.5}" ry="${ry - 2}" fill="${x.rg([[0, "#fff", p.lt ? 1 : .35], [.35, p.l], [1, p.m]], .42, .3, .7)}"/>` +
      `<path d="M${cx - 30} ${ty - 6}Q${cx - 4} ${ty - 14} ${cx + 20} ${ty - 11}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${p.lt ? .9 : .3}"/>` +
      `<ellipse cx="${cx}" cy="${ty}" rx="8" ry="2.8" fill="none" stroke="${p.k}" stroke-opacity=".25"/>`;
    s += `<g transform="translate(0 ${x.on && !x.anim ? 1.6 : 0})"><g class="${x.on ? P + "p-" + a : ""}">${topG}</g></g>`;
    if (x.on) s += rippleSet(x, a, (i) => `<ellipse cx="${cx}" cy="${ty + 2}" rx="${rx + 8 + i * 10}" ry="${f(ry + 3 + i * 3.5)}" fill="none" stroke="${x.hot}" stroke-width="2" opacity="${(.8 - i * .25).toFixed(2)}"/>`) + chip(x, ACT_TAG[a], x.c1);
    return wrap(x, bg, s);
  }
  function ringBtn(o) {
    const x = X(o, "#5ad1ff", "#f2f1ee"), p = pal(x.c2), a = x.opt("act", "single"), cx = 100, cy = 100;
    const bg = tiles(x);
    let s = drop(x, `<rect x="62" y="62" width="76" height="76" rx="18"/>`, 3, 6, .5, 3.5);
    s += `<rect x="62" y="62" width="76" height="76" rx="18" fill="${x.lg([[0, p.l], [.55, p.m], [1, p.d]], 0, 0, 1, 1)}"/>` +
      `<rect x="62.6" y="62.6" width="74.8" height="74.8" rx="17.4" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .9 : .25}" stroke-width="1.2"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="30" fill="#000" opacity=".28"/><circle cx="${cx}" cy="${cy}" r="28.6" fill="none" stroke="${x.on ? x.c1 : "#fff"}" stroke-opacity="${x.on ? 1 : .2}" stroke-width="2.4"/>`;
    if (x.on) s += `<g class="${P}breathe">${halo(x, cx, cy, 44, x.c1, .45)}</g><circle cx="${cx}" cy="${cy}" r="28.6" fill="none" stroke="${x.hot}" stroke-width="1"/>`;
    if (x.on && a === "long") s += `<circle class="${P}fill" cx="${cx}" cy="${cy}" r="28.6" pathLength="100" stroke-dasharray="100 100" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>`;
    const btn = `<circle cx="${cx}" cy="${cy + 1.6}" r="25" fill="${p.k}" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="25" fill="${x.rg([[0, "#fff", p.lt ? 1 : .3], [.45, p.l], [1, p.d]], .4, .32, .75)}"/>` +
      `<path d="M${cx - 17} ${cy - 11}A21 21 0 0 1 ${cx + 4} ${cy - 21}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${p.lt ? .9 : .3}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="5" fill="none" stroke="${p.k}" stroke-opacity=".28" stroke-width="1.2"/>`;
    s += `<g transform="${x.on && !x.anim ? `translate(${cx} ${cy}) scale(.95) translate(${-cx} ${-cy})` : ""}"><g class="${x.on ? P + "s-" + a : ""}">${btn}</g></g>`;
    if (x.on) s += rippleSet(x, a, (i) => `<circle cx="${cx}" cy="${cy}" r="${36 + i * 9}" fill="none" stroke="${x.c1}" stroke-width="2.2" opacity="${(.8 - i * .25).toFixed(2)}"/>`) + chip(x, ACT_TAG[a], x.c1);
    return wrap(x, bg, s);
  }

  function remote(o) {
    const x = X(o, "#7dff9a", "#f2f1ee"), p = pal(x.c2), st = x.opt("style", "light");
    const bg = desk(x, 150, "#6d6878", "#5a3d2a") + `<ellipse cx="160" cy="50" rx="60" ry="46" fill="${x.rg([[0, "#ffe2a8", .25], [1, "#ffe2a8", 0]])}"/>`;
    const ink = p.dark ? "#cfd2d8" : "#4a4d55";
    const bodyFill = x.lg([[0, p.k], [.12, p.d], [.32, p.l], [.6, p.m], [1, p.k]], 0, 0, 1, 0);
    const key = (kx, ky, w, h2, r, lit) => `<rect x="${kx}" y="${ky + 1.2}" width="${w}" height="${h2}" rx="${r}" fill="#000" opacity=".3"/>` +
      `<rect x="${kx}" y="${ky}" width="${w}" height="${h2}" rx="${r}" fill="${x.lg([[0, p.l], [1, p.d]])}" stroke="${lit ? x.c1 : "#000"}" stroke-opacity="${lit ? 1 : .15}" stroke-width="${lit ? 1.6 : .8}"/>`;
    let r = "", tip = [100, 30];
    if (st === "tv") {
      tip = [100, 24];
      r += `<rect x="82" y="24" width="36" height="150" rx="17" fill="${bodyFill}"/><rect x="82.5" y="24.5" width="35" height="149" rx="16.5" fill="none" stroke="#fff" stroke-opacity=".18"/>` +
        `<circle cx="91" cy="37" r="3.6" fill="#c8343a"/><circle cx="90.4" cy="36.3" r="1.2" fill="#fff" opacity=".5"/><circle cx="110" cy="37" r="1.6" fill="#000" opacity=".4"/>` +
        `<circle cx="100" cy="68" r="15" fill="#000" opacity=".3"/><circle cx="100" cy="67" r="15" fill="${x.lg([[0, p.l], [1, p.d]])}" stroke="#000" stroke-opacity=".2"/>` +
        `<g fill="${ink}" opacity=".7"><path d="M100 54.6l2.6 3h-5.2zM100 79.4l2.6-3h-5.2zM87.6 67l3-2.6v5.2zM112.4 67l-3-2.6v5.2z"/></g>` +
        `<circle cx="100" cy="67" r="7" fill="${x.lg([[0, p.l], [1, p.m]])}" stroke="${x.on ? x.c1 : "#000"}" stroke-opacity="${x.on ? 1 : .2}" stroke-width="${x.on ? 1.8 : .8}"/>` +
        [89, 100, 111].map((bx) => `<circle cx="${bx}" cy="94" r="4.2" fill="#000" opacity=".3"/><circle cx="${bx}" cy="93.4" r="4.2" fill="${x.lg([[0, p.l], [1, p.d]])}"/>`).join("") +
        `<rect x="86" y="106" width="9" height="30" rx="4.5" fill="${x.lg([[0, p.l], [1, p.d]])}" stroke="#000" stroke-opacity=".2"/><rect x="105" y="106" width="9" height="30" rx="4.5" fill="${x.lg([[0, p.l], [1, p.d]])}" stroke="#000" stroke-opacity=".2"/>` +
        `<g stroke="${ink}" stroke-width="1.2" stroke-linecap="round" opacity=".7"><path d="M88.4 111H92.6M90.5 109V113M88.4 131H92.6M107.4 111l2.1 -2l2.1 2M107.4 130l2.1 2l2.1 -2"/></g>` +
        [146, 154, 162].map((y) => `<circle cx="100" cy="${y}" r=".8" fill="#000" opacity=".5"/>`).join("");
    } else if (st === "scene") {
      tip = [100, 52];
      r += `<rect x="68" y="52" width="64" height="100" rx="15" fill="${bodyFill}"/><rect x="68.5" y="52.5" width="63" height="99" rx="14.5" fill="none" stroke="#fff" stroke-opacity=".3"/>`;
      const cells = [[74, 66, 1], [102, 66, 2], [74, 106, 3], [102, 106, 4]];
      r += cells.map(([kx, ky, k]) => key(kx, ky, 24, 36, 7, x.on && k === 2) + `<text x="${kx + 12}" y="${ky + 22.5}" text-anchor="middle" ${FONT} font-size="13" font-weight="600" fill="${x.on && k === 2 ? x.c1 : ink}" opacity=".8">${k}</text>`).join("");
    } else {
      tip = [100, 40];
      r += `<rect x="78" y="40" width="44" height="122" rx="13" fill="${bodyFill}"/><rect x="78.5" y="40.5" width="43" height="121" rx="12.5" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
        key(85, 52, 30, 20, 5, x.on) + key(85, 79, 30, 16, 4) + key(85, 118, 30, 16, 4) + key(85, 140, 30, 16, 5) +
        `<circle cx="100" cy="106.4" r="5.6" fill="#000" opacity=".3"/><circle cx="100" cy="106" r="5.6" fill="${x.lg([[0, p.l], [1, p.d]])}"/>` +
        `<g stroke="${ink}" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".75"><path d="M96 89.4l4-3.6l4 3.6M96 123.6l4 3.6l4-3.6M96.4 148H103.6"/>` +
        `<path d="M96.6 59.2A4.8 4.8 0 1 0 103.4 59.2M100 56.6V62" stroke="${x.on ? x.c1 : ink}"/></g>`;
    }
    const sh = drop(x, r.match(/<rect [^>]*>/)[0].replace(/fill="[^"]*"/, ""), 4, 8, .5, 4);
    let s = `<g transform="rotate(-8 100 100)${st === "tv" ? " translate(12 22) scale(.86)" : ""}">${sh}${r}${led(x, tip[0], tip[1] + 6, 1.4, x.c1, x.on, true)}`;
    if (x.on) s += waves(x, tip[0], tip[1] - 2, -90, 70, x.hot, 3, 9, 8);
    s += `</g>`;
    return wrap(x, bg, s);
  }

  function irBlaster(o) {
    const x = X(o, "#ff5a7a", "#1e1f24"), p = pal(x.c2), cx = 100, ty = 92, by = 140, rx = 34, ry = 11;
    const bg = desk(x, 140, "#5f6672", "#4a3426") +
      `<rect x="14" y="20" width="62" height="40" rx="2" fill="#0b0c10"/><rect x="16" y="22" width="58" height="34" fill="${x.lg([[0, "#1d2433"], [1, "#0b0f18"]], 0, 0, 1, 1)}"/><path d="M18 24L50 24L22 50Z" fill="#fff" opacity=".05"/><rect x="40" y="60" width="10" height="8" fill="#15161a"/>`;
    let s = shadow(x, cx, by + 4, 50, 9, .65);
    s += `<path d="M${cx - rx} ${ty}V${by - 4}Q${cx - rx} ${by + ry - 2} ${cx} ${by + ry - 1}Q${cx + rx} ${by + ry - 2} ${cx + rx} ${by - 4}V${ty}Z" fill="${x.lg([[0, p.k], [.25, p.d], [.42, p.l], [.6, p.m], [1, p.k]], 0, 0, 1, 0)}"/>`;
    s += `<path d="M${cx - rx} 100A${rx} ${ry} 0 0 0 ${cx + rx} 100V120A${rx} ${ry} 0 0 1 ${cx - rx} 120Z" fill="${x.lg([[0, "#000", .85], [.4, "#3a1820", .9], [.55, "#5a2430", .85], [1, "#000", .9]], 0, 0, 1, 0)}"/>` +
      `<path d="M${cx - 18} 104V128" stroke="#fff" stroke-opacity=".18" stroke-width="4"/>`;
    if (x.on) s += `<path d="M${cx - rx} 100A${rx} ${ry} 0 0 0 ${cx + rx} 100V120A${rx} ${ry} 0 0 1 ${cx - rx} 120Z" fill="${x.c1}" opacity=".22" class="${P}blink"/>`;
    s += `<ellipse cx="${cx}" cy="${ty}" rx="${rx}" ry="${ry}" fill="${x.lg([[0, p.l], [1, p.k]])}"/><ellipse cx="${cx - 8}" cy="${ty - 3}" rx="16" ry="4" fill="#fff" opacity=".22"/>` +
      `<path d="M${cx - rx + 2} ${ty + 1}A${rx - 2} ${ry - 1} 0 0 0 ${cx + rx - 2} ${ty + 1}" fill="none" stroke="#fff" stroke-opacity=".2"/>`;
    s += led(x, cx + 14, 132, 1.2, "#5ab8ff", x.on, false);
    if (x.on) s += waves(x, cx - rx - 2, 110, 180, 70, x.hot, 3, 6, 9) + waves(x, cx + rx + 2, 110, 0, 70, x.hot, 3, 6, 9) + waves(x, cx, ty - 8, -90, 60, x.hot, 3, 6, 9);
    return wrap(x, bg, s);
  }
  function rfBridge(o) {
    const x = X(o, "#ff8a3d", "#f2f1ee"), p = pal(x.c2);
    const bg = desk(x, 150, "#7d8590", "#7a5233");
    let s = shadow(x, 100, 152, 52, 8, .6);
    s += `<path d="M126 74L132 30" stroke="#16171b" stroke-width="7" stroke-linecap="round"/><path d="M125 70L131 32" stroke="#fff" stroke-opacity=".18" stroke-width="1.4" stroke-linecap="round"/>` +
      `<rect x="120" y="68" width="12" height="8" rx="2" fill="${x.lg([[0, "#d0d3d8"], [1, "#6b7079"]], 0, 0, 1, 0)}"/>`;
    s += `<rect x="58" y="74" width="84" height="78" rx="11" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}"/>` +
      `<rect x="58" y="74" width="84" height="12" rx="11" fill="#fff" opacity="${p.lt ? .5 : .12}"/><rect x="58.6" y="74.6" width="82.8" height="76.8" rx="10.4" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .9 : .2}" stroke-width="1.2"/>` +
      `<path d="M62 144H138" stroke="#000" stroke-opacity=".1" stroke-width="3"/>` +
      `<rect x="70" y="112" width="60" height="22" rx="4" fill="#15171c"/><rect x="72" y="114" width="56" height="18" rx="3" fill="${x.lg([[0, "#22252d"], [1, "#0d0f13"]])}"/>` +
      `<g fill="#6a7180" opacity=".75"><rect x="78" y="120" width="20" height="2" rx="1"/><rect x="78" y="125" width="30" height="2" rx="1"/></g>`;
    s += led(x, 76, 96, 1.6, "#5ab8ff", true, false) + led(x, 88, 96, 1.6, x.c1, x.on, true);
    s += [0, 1, 2, 3].map((i) => `<rect x="${104 + i * 7}" y="94" width="4" height="4" rx="1" fill="#000" opacity=".12"/>`).join("");
    if (x.on) s += waves(x, 132, 30, 0, 80, x.hot, 3, 9, 9) + waves(x, 132, 30, 180, 80, x.hot, 3, 9, 9);
    return wrap(x, bg, s);
  }

  const LABELS = { scenes: ["Morning", "Movie", "Dinner", "Night", "Away", "All off"], rooms: ["Kitchen", "Living", "Bedroom", "Office", "Porch", "Garage"] };
  function ico(k, cx, cy, c) {
    const st = `fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"`;
    switch (k) {
      case 0: return `<g ${st}><circle cx="${cx}" cy="${cy}" r="3"/><path d="M${cx} ${cy - 6}v1.4M${cx} ${cy + 4.6}v1.4M${cx - 6} ${cy}h1.4M${cx + 4.6} ${cy}h1.4"/></g>`;
      case 1: return `<g ${st}><rect x="${cx - 5}" y="${cy - 3.5}" width="10" height="7" rx="1"/><path d="M${cx - 1.4} ${cy - 1.6}l3 1.6l-3 1.6z" fill="${c}"/></g>`;
      case 2: return `<g ${st}><path d="M${cx - 3} ${cy - 5}v10M${cx - 4.6} ${cy - 5}v3q1.6 2 3.2 0v-3M${cx + 3} ${cy + 5}v-10q-2.4 2-1 5h1"/></g>`;
      case 3: return `<g ${st}><path d="M${cx + 2} ${cy - 5}a5 5 0 1 0 3 8a4 4 0 0 1 -3 -8z"/></g>`;
      case 4: return `<g ${st}><path d="M${cx - 5} ${cy}l5 -4.6l5 4.6M${cx - 3.4} ${cy - 1}v5h6.8v-5"/></g>`;
      default: return `<g ${st}><path d="M${cx - 2.6} ${cy - 3.4}a4.6 4.6 0 1 0 5.2 0M${cx} ${cy - 5.4}v4.4"/></g>`;
    }
  }
  function eink(o) {
    const x = X(o, "#7dff9a", "#f2f1ee"), p = pal(x.c2), n = +x.opt("layout", "4"), lab = LABELS[x.opt("labels", "scenes")] || LABELS.scenes;
    const bg = wall(x, "#8c8478", 9);
    const X0 = 42, Y0 = 44, W = 116, Hh = 112, rows = n / 2;
    let s = drop(x, `<rect x="${X0}" y="${Y0}" width="${W}" height="${Hh}" rx="12"/>`, 3, 6, .5, 4);
    s += `<rect x="${X0}" y="${Y0}" width="${W}" height="${Hh}" rx="12" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}"/>` +
      `<rect x="${X0 + .6}" y="${Y0 + .6}" width="${W - 1.2}" height="${Hh - 1.2}" rx="11.4" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .9 : .2}" stroke-width="1.2"/>`;
    const sx = 62, sy = 54, sw = 76, sh = 92;
    s += `<rect x="${sx - 1.5}" y="${sy - 1.5}" width="${sw + 3}" height="${sh + 3}" rx="3" fill="#000" opacity=".35"/><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="2" fill="${x.lg([[0, "#ecebe4"], [1, "#d4d3cb"]], 0, 0, 1, 1)}"/>`;
    const rh = sh / rows, active = 0;
    for (let i = 0; i < n; i++) {
      const col = i % 2, row = Math.floor(i / 2), cy = sy + rh * row + rh / 2, isA = x.on && i === active;
      const zx = col ? sx + sw / 2 + 1 : sx + 2, zw = sw / 2 - 3;
      const inkc = isA ? "#ecebe4" : "#24252a";
      if (isA) s += `<rect x="${zx}" y="${f(sy + rh * row + 2)}" width="${zw}" height="${f(rh - 4)}" rx="2" fill="#1d1e22"/>`;
      if (row > 0 && col === 0) s += `<path d="M${sx + 4} ${f(sy + rh * row)}H${sx + sw - 4}" stroke="#24252a" stroke-opacity=".35" stroke-width=".6"/>`;
      s += ico(i, f(col ? zx + zw - 8 : zx + 8), f(cy - (rows > 2 ? 4 : 6)), inkc) +
        `<text x="${f(col ? zx + zw - 3 : zx + 3)}" y="${f(cy + (rows > 2 ? 8 : 10))}" text-anchor="${col ? "end" : "start"}" ${FONT} font-size="${rows > 2 ? 6.6 : 7.6}" font-weight="600" fill="${inkc}">${lab[i]}</text>`;
      const kx = col ? X0 + W - 15 : X0 + 4, lit = isA, pressed = lit;
      s += `<rect x="${kx}" y="${f(cy - rh / 2 + 6)}" width="11" height="${f(rh - 12)}" rx="4" fill="#000" opacity=".22"/>` +
        `<rect x="${kx + (pressed ? .4 : 0)}" y="${f(cy - rh / 2 + 5 + (pressed ? 1 : 0))}" width="11" height="${f(rh - 12)}" rx="4" fill="${x.lg([[0, p.l], [1, p.d]], 0, 0, 1, 0)}" stroke="#000" stroke-opacity=".12"/>`;
      s += led(x, col ? X0 + W - 9.5 : X0 + 9.5, f(cy + rh / 2 - 4), 1, x.c1, lit, false);
    }
    s += `<rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="2" fill="${x.lg([[0, "#fff", .25], [.4, "#fff", 0]], 0, 0, 1, 1)}"/>`;
    if (x.on) s += `<rect class="${P}ink" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="2" fill="#111" opacity="0"/>`;
    return wrap(x, bg, s);
  }

  function touch(o) {
    const x = X(o, "#5ad1ff", "#1b1c21"), p = pal(x.c2), cx = 100, cy = 100;
    const bg = wall(x, "#6f7e7a", 13);
    let s = drop(x, `<rect x="62" y="62" width="76" height="76" rx="14"/>`, 3, 6, .55, 3.5);
    s += `<rect x="62" y="62" width="76" height="76" rx="14" fill="${x.lg([[0, p.l], [.45, p.m], [1, p.k]], 0, 0, 1, 1)}"/>` +
      `<path d="M66 66H124L66 118Z" fill="#fff" opacity="${p.lt ? .35 : .08}"/><rect x="62.6" y="62.6" width="74.8" height="74.8" rx="13.4" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="21" fill="none" stroke="${x.on ? x.c1 : (p.lt ? "#000" : "#fff")}" stroke-opacity="${x.on ? 1 : .22}" stroke-width="1.6"/>`;
    let fp = ""; for (let i = 0; i < 5; i++) { const r = 3 + i * 2.6; fp += `<path d="M${f(cx - r)} ${cy + 2}A${r} ${f(r * 1.15)} 0 1 1 ${f(cx + r)} ${cy + 2}"/>`; }
    if (x.on) {
      s += `<g class="${P}breathe">${halo(x, cx, cy, 46, x.c1, .5)}</g>` +
        `<g fill="none" stroke="${x.hot}" stroke-width="1.3" stroke-linecap="round" opacity=".95">${fp}</g>` +
        [0, 1].map((i) => `<circle class="${P}rip" style="animation-delay:${(i * .5).toFixed(2)}s" cx="${cx}" cy="${cy}" r="${27 + i * 8}" fill="none" stroke="${x.c1}" stroke-width="2" opacity="${(.8 - i * .3).toFixed(2)}"/>`).join("");
    } else s += `<g fill="none" stroke="${p.lt ? "#000" : "#fff"}" stroke-width="1" stroke-linecap="round" opacity=".1">${fp}</g>`;
    s += led(x, cx, 128, 1.2, x.c1, x.on, false);
    return wrap(x, bg, s);
  }
  function hand(x, cx, cy) {
    const parts = [`<rect x="-14" y="-34" width="8.4" height="28" rx="4.2"/>`, `<rect x="-4.6" y="-39" width="8.8" height="33" rx="4.4"/>`, `<rect x="5" y="-35" width="8.4" height="29" rx="4.2"/>`,
      `<rect x="14" y="-27" width="7.4" height="23" rx="3.7"/>`, `<rect x="-22" y="-12" width="8.6" height="24" rx="4.3" transform="rotate(-38 -18 6)"/>`,
      `<rect x="-15" y="-12" width="37" height="34" rx="12"/>`, `<rect x="-9" y="16" width="26" height="22" rx="5"/>`].join("");
    const skin = x.lg([[0, "#f6c9a4"], [.6, "#e7a982"], [1, "#c98a66"]], 0, 0, 1, 1);
    return `<g transform="translate(${cx} ${cy})"><g fill="#6b3f2a" stroke="#6b3f2a" stroke-width="3" stroke-linejoin="round">${parts}</g><g fill="${skin}">${parts}</g>` +
      `<g fill="none" stroke="#a8684a" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round"><path d="M-12 -14h4.6M-2.6 -16h4.8M7 -14h4.6M15.6 -9h4"/><path d="M-11 4Q-3 6 -1 20"/></g>` +
      `<path d="M-11 -30v14M-1 -35v16" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/></g>`;
  }
  function gesture(o) {
    const x = X(o, "#b07cff", "#f2f1ee"), p = pal(x.c2), dir = x.opt("wave", "right");
    const bg = wall(x, "#7d7590", 17) + `<rect y="150" width="200" height="50" fill="${x.lg([[0, "#d9d3c7"], [1, "#a39b8c"]])}"/><rect y="150" width="200" height="3" fill="#fff" opacity=".35"/>`;
    let s = shadow(x, 100, 152, 70, 6, .6);
    if (x.on) s += `<path d="M78 128L46 40H154L122 128Z" fill="${x.lg([[0, x.c1, 0], [1, x.c1, .28]])}"/>`;
    s += `<rect x="36" y="124" width="128" height="26" rx="13" fill="${x.lg([[0, p.l], [.55, p.m], [1, p.d]])}"/>` +
      `<rect x="36.6" y="124.6" width="126.8" height="24.8" rx="12.4" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .9 : .2}" stroke-width="1.2"/>` +
      `<rect x="68" y="130" width="64" height="14" rx="7" fill="${x.lg([[0, "#1a1b22"], [1, "#07080b"]])}"/>` +
      `<circle cx="88" cy="137" r="3.4" fill="${x.rg([[0, "#6a5a8a"], [1, "#0b0b10"]], .35, .35)}"/><circle cx="112" cy="137" r="3.4" fill="${x.rg([[0, "#6a5a8a"], [1, "#0b0b10"]], .35, .35)}"/>` +
      `<path d="M72 132H118" stroke="#fff" stroke-opacity=".15" stroke-width="1.2" stroke-linecap="round"/>` + led(x, 150, 137, 1.4, x.c1, x.on, true);
    if (x.on) {
      const mcls = { right: "swr", left: "swl", updown: "swu" }[dir] || "swr";
      const lines = dir === "updown"
        ? `<path d="M140 50V76M148 56V72M60 50V76M52 56V72"/>`
        : `<path d="M${dir === "left" ? "136 54h22M140 64h26M136 74h22" : "64 54h-22M60 64h-26M64 74h-22"}"/>`;
      s += `<g fill="none" stroke="${x.hot}" stroke-width="2.6" stroke-linecap="round" class="${P}blink">${lines}</g>`;
      s += `<g class="${P}${mcls}">${hand(x, 100, 66)}</g>`;
    }
    return wrap(x, bg, s);
  }

  function keyShape(x, metal, tx, ty, rot) {
    const m = metal === "brass" ? ["#fbe6a2", "#c9a04c", "#7a5a20"] : ["#f2f4f7", "#a9afb8", "#5c626b"];
    const g = x.lg([[0, m[0]], [.5, m[1]], [1, m[2]]], 0, 0, 1, 1);
    return `<g transform="translate(${tx} ${ty}) rotate(${rot})"><path d="M-9 -9A12 12 0 1 1 -9 9L-6 6A8 8 0 1 0 -6 -6Z" fill="${g}"/><circle r="12" fill="${g}"/><circle cx="-4" r="3.4" fill="#000" opacity=".55"/>` +
      `<path d="M10 -4H48L52 0L48 4H44L42 7L39 4H35L33 8L30 4H10Z" fill="${g}" stroke="${m[2]}" stroke-width=".6"/><path d="M12 -1.2H46" stroke="${m[2]}" stroke-opacity=".6"/>` +
      `<path d="M-6 -7A9 9 0 0 1 6 -8" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.2" stroke-linecap="round"/></g>`;
  }
  function keytag(o) {
    const x = X(o, "#2b2d33"), p = pal(x.c1), home = x.on, gc = "#5ef08a";
    const bg = desk(x, 70, "#6f7684", "#8a6040");
    let s = shadow(x, 104, 150, 50, 10, .55) + shadow(x, 60, 128, 36, 8, .45);
    s += keyShape(x, "brass", 64, 112, 150) + keyShape(x, "steel", 58, 92, 200);
    s += `<circle cx="78" cy="86" r="15" fill="none" stroke="#5c626b" stroke-width="4.4"/><circle cx="78" cy="86" r="15" fill="none" stroke="${x.lg([[0, "#f4f6f9"], [1, "#8d939c"]], 0, 0, 1, 1)}" stroke-width="3"/>`;
    const tag = "M92 80C104 72 122 74 134 86C150 102 148 128 130 140C114 150 94 146 86 130C78 116 80 92 92 80Z";
    s += `<path d="${tag}" fill="${p.k}" transform="translate(1.5 3)"/><path d="${tag}" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}"/>` +
      `<path d="M96 84C106 78 120 79 130 88" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${p.lt ? .9 : .35}"/>` +
      `<circle cx="96" cy="88" r="5" fill="${p.k}"/><circle cx="96" cy="88" r="3.4" fill="#000" opacity=".6"/>` +
      `<path d="M78 101A15 15 0 0 0 93 86" fill="none" stroke="#8d939c" stroke-width="3"/>` +
      `<circle cx="116" cy="114" r="14" fill="${p.d}" opacity=".7"/><circle cx="116" cy="113" r="13" fill="${x.rg([[0, p.l], [1, p.m]], .4, .35, .7)}"/>`;
    s += led(x, 116, 134, 1.6, gc, home, true);
    if (home) s += waves(x, 136, 84, -45, 70, gc, 3, 8, 8);
    s += `<g class="hda-bg"><rect x="18" y="18" width="${home ? 46 : 44}" height="16" rx="8" fill="#000" opacity=".5"/><circle cx="28" cy="26" r="3.4" fill="${home ? gc : "#9aa0a8"}"/>` +
      `<text x="35" y="29.6" ${FONT} font-size="9.5" font-weight="600" fill="#fff">${home ? "Home" : "Away"}</text></g>`;
    return wrap(x, bg, s);
  }
  function beacon(o) {
    const x = X(o, "#f2f1ee"), p = pal(x.c1), cx = 92, cy = 98;
    const bg = wall(x, "#88808f", 21) + `<rect x="150" y="0" width="22" height="200" fill="${x.lg([[0, "#f2efe8"], [.6, "#d8d3c8"], [1, "#a8a296"]], 0, 0, 1, 0)}"/><rect x="150" width="2" height="200" fill="#000" opacity=".2"/>` +
      `<rect x="172" width="28" height="200" fill="${x.lg([[0, "#6a4a32"], [1, "#4a3020"]], 0, 0, 1, 0)}"/>`;
    let s = drop(x, `<circle cx="${cx}" cy="${cy}" r="33"/>`, 3, 6, .55, 3.5);
    s += `<circle cx="${cx + 1.5}" cy="${cy + 3}" r="32" fill="${p.k}"/><circle cx="${cx}" cy="${cy}" r="32" fill="${x.lg([[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 1, 1)}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="1.4"/><circle cx="${cx}" cy="${cy + .8}" r="24" fill="none" stroke="#fff" stroke-opacity="${p.lt ? .7 : .15}" stroke-width=".8"/>` +
      `<path d="M${cx - 22} ${cy - 14}A26 26 0 0 1 ${cx + 2} ${cy - 27}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="${p.lt ? .85 : .3}"/>` +
      `<circle cx="${cx}" cy="${cy + 10}" r="4" fill="${p.d}" opacity=".6"/>`;
    s += led(x, cx, cy - 6, 1.6, "#5ab8ff", x.on, true);
    if (x.on) s += waves(x, cx - 36, cy, 180, 80, "#7cc4ff", 3, 6, 9) + waves(x, cx + 36, cy, 0, 80, "#7cc4ff", 3, 6, 9);
    return wrap(x, bg, s);
  }

  const LEDS = ["#ffb347", "#ffffff", "#7cc4ff", "#7dff9a", "#ff6b9a", "#b07cff"];
  const BODY = ["#f2f1ee", "#2c2e33", "#b8bdc3", "#d9c7a8"];
  const icons = [
    { id: "dial", name: "Dial switch", colors: LEDS, picker: true, colorLabel: "Ring light", colors2: BODY, picker2: true, colorLabel2: "Body", render: dialSwitch },
    { id: "knob", name: "Puck knob", colors: ["#7cc4ff", "#ffb347", "#7dff9a", "#ff6b9a", "#ffffff"], picker: true, colorLabel: "Ring light", colors2: ["#2c2e33", "#f2f1ee", "#5a6a5a", "#8a4a3a"], picker2: true, colorLabel2: "Body", render: knob },
    { id: "cube", name: "Gesture cube", colors: ["#f2f1ee", "#b8bdc3", "#2c2e33", "#a8c8e8", "#f2c4c4"], picker: true, colorLabel: "Body",
      options: [{ id: "gest", name: "Gesture", values: [["flip", "Flip"], ["rotate", "Rotate"], ["shake", "Shake"], ["tap", "Tap"]] },
        { id: "face", name: "Face up", values: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]] }], render: cube },
    { id: "puck", name: "Puck button", colors: ["#ffffff", "#ffb347", "#7cc4ff", "#7dff9a", "#ff6b9a"], picker: true, colorLabel: "Light ring", colors2: BODY, picker2: true, colorLabel2: "Body", options: [ACTION], render: puck },
    { id: "ring", name: "Ring button", colors: ["#5ad1ff", "#ffffff", "#ffb347", "#7dff9a", "#ff6b9a"], picker: true, colorLabel: "Light ring", colors2: BODY, picker2: true, colorLabel2: "Plate", options: [firstIs(ACTION, "double")], render: ringBtn },
    { id: "remote", name: "Handheld remote", colors: ["#7dff9a", "#ff5a5a", "#7cc4ff", "#ffb347"], picker: true, colorLabel: "LED", colors2: ["#f2f1ee", "#2a2b30", "#8d939a", "#d9c7a8"], picker2: true, colorLabel2: "Body",
      options: [{ id: "style", name: "Style", values: [["light", "Light remote"], ["tv", "TV remote"], ["scene", "Multi-scene"]] }], render: remote },
    { id: "ir", name: "IR blaster", colors: ["#ff5a7a", "#b07cff", "#ff8a3d", "#5ad1ff"], picker: true, colorLabel: "Beam", colors2: ["#1e1f24", "#f2f1ee", "#3a3d48"], picker2: true, colorLabel2: "Body", render: irBlaster },
    { id: "rf", name: "RF bridge", colors: ["#ff8a3d", "#ff5a7a", "#7dff9a", "#5ad1ff"], picker: true, colorLabel: "Signal", colors2: ["#f2f1ee", "#2c2e33", "#b8bdc3"], picker2: true, colorLabel2: "Body", render: rfBridge },
    { id: "eink", name: "E-paper scene panel", colors: ["#7dff9a", "#ffb347", "#7cc4ff", "#ffffff"], picker: true, colorLabel: "LED", colors2: ["#f2f1ee", "#2c2e33", "#b8bdc3", "#c8a878"], picker2: true, colorLabel2: "Frame",
      options: [{ id: "layout", name: "Buttons", values: [["4", "4 buttons"], ["6", "6 buttons"]] }, { id: "labels", name: "Labels", values: [["scenes", "Scenes"], ["rooms", "Rooms"]] }], render: eink },
    { id: "touch", name: "Touch sensor", colors: ["#5ad1ff", "#ffffff", "#ffb347", "#7dff9a", "#ff6b9a"], picker: true, colorLabel: "Glow", colors2: ["#1b1c21", "#f2f1ee", "#3a4a5a"], picker2: true, colorLabel2: "Glass", render: touch },
    { id: "gesture", name: "Gesture sensor", colors: ["#b07cff", "#5ad1ff", "#7dff9a", "#ffb347"], picker: true, colorLabel: "Glow", colors2: ["#f2f1ee", "#2c2e33", "#b8bdc3"], picker2: true, colorLabel2: "Body",
      options: [{ id: "wave", name: "Wave", values: [["right", "Left to right"], ["left", "Right to left"], ["updown", "Up and down"]] }], render: gesture },
    { id: "keytag", name: "Key tag", colors: ["#2b2d33", "#f2f1ee", "#d8443c", "#3a6fd8", "#f0b429"], picker: true, colorLabel: "Tag", render: keytag },
    { id: "beacon", name: "BLE beacon", colors: ["#f2f1ee", "#2c2e33", "#3a6fd8", "#d8443c"], picker: true, colorLabel: "Body", render: beacon },
  ];

  const css = `
.hda-buttons-breathe,.hda-buttons-nudge,.hda-buttons-spin,.hda-buttons-rip,.hda-buttons-rip2,.hda-buttons-wave,.hda-buttons-shake,.hda-buttons-flip,.hda-buttons-flipsh,.hda-buttons-tapc,.hda-buttons-s-single,.hda-buttons-s-double,.hda-buttons-s-long,.hda-buttons-swr,.hda-buttons-swl,.hda-buttons-swu{transform-box:fill-box;transform-origin:center}
@keyframes hda-buttons-breathe{0%,100%{opacity:1}50%{opacity:.55}}
.hda-anim .hda-buttons-breathe{animation:hda-buttons-breathe 2.6s ease-in-out infinite}
@keyframes hda-buttons-nudge{0%,100%{transform:rotate(0deg)}50%{transform:rotate(7deg)}}
.hda-anim .hda-buttons-nudge{animation:hda-buttons-nudge 2.4s ease-in-out infinite}
@keyframes hda-buttons-blink{0%,55%{opacity:1}65%,100%{opacity:.25}}
.hda-anim .hda-buttons-blink{animation:hda-buttons-blink 1.1s steps(1) infinite}
@keyframes hda-buttons-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-buttons-spin{animation:hda-buttons-spin 2.4s linear infinite}
@keyframes hda-buttons-rip{0%{opacity:.9;transform:scale(.7)}45%,100%{opacity:0;transform:scale(1.35)}}
.hda-anim .hda-buttons-rip{animation:hda-buttons-rip 1.6s ease-out infinite}
@keyframes hda-buttons-rip2{0%{opacity:.9;transform:scale(.7)}30%,100%{opacity:0;transform:scale(1.3)}}
.hda-anim .hda-buttons-rip2{animation:hda-buttons-rip2 1.6s ease-out infinite}
@keyframes hda-buttons-wave{0%{opacity:0;transform:scale(.6)}30%{opacity:1}100%{opacity:0;transform:scale(1.25)}}
.hda-anim .hda-buttons-wave{animation:hda-buttons-wave 1.4s ease-out infinite}
@keyframes hda-buttons-p-single{0%,30%,100%{transform:translateY(0)}10%,18%{transform:translateY(3px)}}
@keyframes hda-buttons-p-double{0%,40%,100%{transform:translateY(0)}7%{transform:translateY(3px)}14%{transform:translateY(0)}21%{transform:translateY(3px)}28%{transform:translateY(0)}}
@keyframes hda-buttons-p-long{0%,85%,100%{transform:translateY(0)}8%,75%{transform:translateY(3px)}}
.hda-anim .hda-buttons-p-single{animation:hda-buttons-p-single 1.6s ease-in-out infinite}
.hda-anim .hda-buttons-p-double{animation:hda-buttons-p-double 1.6s ease-in-out infinite}
.hda-anim .hda-buttons-p-long{animation:hda-buttons-p-long 2s ease-in-out infinite}
@keyframes hda-buttons-s-single{0%,30%,100%{transform:scale(1)}10%,18%{transform:scale(.93)}}
@keyframes hda-buttons-s-double{0%,40%,100%{transform:scale(1)}7%{transform:scale(.93)}14%{transform:scale(1)}21%{transform:scale(.93)}28%{transform:scale(1)}}
@keyframes hda-buttons-s-long{0%,85%,100%{transform:scale(1)}8%,75%{transform:scale(.93)}}
.hda-anim .hda-buttons-s-single{animation:hda-buttons-s-single 1.6s ease-in-out infinite}
.hda-anim .hda-buttons-s-double{animation:hda-buttons-s-double 1.6s ease-in-out infinite}
.hda-anim .hda-buttons-s-long{animation:hda-buttons-s-long 2s ease-in-out infinite}
@keyframes hda-buttons-fill{0%,8%{stroke-dashoffset:100}75%,100%{stroke-dashoffset:0}}
.hda-anim .hda-buttons-fill{animation:hda-buttons-fill 2s linear infinite}
@keyframes hda-buttons-shake{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-6deg)}40%{transform:rotate(6deg)}60%{transform:rotate(-4deg)}80%{transform:rotate(4deg)}}
.hda-anim .hda-buttons-shake{animation:hda-buttons-shake .5s ease-in-out infinite}
@keyframes hda-buttons-flip{0%,15%,100%{transform:translateY(0) rotate(0deg)}40%{transform:translateY(-20px) rotate(-16deg)}60%{transform:translateY(-14px) rotate(10deg)}80%{transform:translateY(0) rotate(0deg)}}
.hda-anim .hda-buttons-flip{animation:hda-buttons-flip 1.8s ease-in-out infinite}
@keyframes hda-buttons-flipsh{0%,15%,80%,100%{transform:scale(1);opacity:1}45%{transform:scale(.7);opacity:.5}}
.hda-anim .hda-buttons-flipsh{animation:hda-buttons-flipsh 1.8s ease-in-out infinite}
@keyframes hda-buttons-tapc{0%,20%,100%{transform:translateY(0)}8%{transform:translateY(2px)}}
.hda-anim .hda-buttons-tapc{animation:hda-buttons-tapc 1.05s ease-out infinite}
@keyframes hda-buttons-ink{0%,88%,100%{opacity:0}91%{opacity:.85}94%{opacity:0}96%{opacity:.6}}
.hda-anim .hda-buttons-ink{animation:hda-buttons-ink 3.4s linear infinite}
@keyframes hda-buttons-swr{0%,100%{transform:translateX(-30px) rotate(-8deg)}50%{transform:translateX(30px) rotate(8deg)}}
@keyframes hda-buttons-swl{0%,100%{transform:translateX(30px) rotate(8deg)}50%{transform:translateX(-30px) rotate(-8deg)}}
@keyframes hda-buttons-swu{0%,100%{transform:translateY(-12px)}50%{transform:translateY(14px)}}
.hda-anim .hda-buttons-swr{animation:hda-buttons-swr 1.6s ease-in-out infinite}
.hda-anim .hda-buttons-swl{animation:hda-buttons-swl 1.6s ease-in-out infinite}
.hda-anim .hda-buttons-swu{animation:hda-buttons-swu 1.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-buttons-breathe,.hda-anim .hda-buttons-nudge,.hda-anim .hda-buttons-blink,.hda-anim .hda-buttons-spin,.hda-anim .hda-buttons-rip,.hda-anim .hda-buttons-rip2,.hda-anim .hda-buttons-wave,.hda-anim .hda-buttons-shake,.hda-anim .hda-buttons-flip,.hda-anim .hda-buttons-flipsh,.hda-anim .hda-buttons-tapc,.hda-anim .hda-buttons-ink,.hda-anim .hda-buttons-swr,.hda-anim .hda-buttons-swl,.hda-anim .hda-buttons-swu{animation:none}}`;

  (window.HDA = window.HDA || []).push({
    id: "buttons", tab: "Buttons & remotes", group: "Home", kind: "device", levelLabel: "Dial", onWord: "Active", offWord: "Idle",
    intro: "Wireless buttons, dials, remotes, bridges and tags. On means pressed, sending or present. The slider turns the dial and fills its light ring. Menus pick the cube gesture and face, the button action (single, double or long press), the remote style, the panel buttons and labels, and the wave direction.",
    css, icons,
  });
})();
