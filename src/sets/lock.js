(function () {
  const P = "hda-lock-";
  const H = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const BLK = "#2b2d31", NIC = "#b6babe", BRS = "#c9a14a", BRZ = "#5e4432", WHT = "#eceef0";
  const SW = [BLK, NIC, BRS, BRZ, WHT];
  const sw = (a) => [a].concat(SW.filter((c) => c !== a));
  const GRN = "#34d399", RED = "#ff5a5f", KEY = "#9fd8ff";
  const FONT = `font-family="Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle"`;

  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  function pal(c) { const h = H(); return { l: h.shade(c, .55), m: c, d: h.shade(c, -.3), k: h.shade(c, -.58), e: h.shade(c, -.45) }; }
  const AMB = "#ffb020", JAM = "#ff3b30";
  const LSTATE = [["auto", "From on/off"], ["locked", "Locked"], ["unlocked", "Unlocked"], ["locking", "Locking"], ["unlocking", "Unlocking"], ["jammed", "Jammed"]];
  const lockState = (o) => { const s = o.opt && o.opt.state; return s && s !== "auto" ? s : (o.on ? "locked" : "unlocked"); };
  function ctx(o) {
    const u = o.uid, ls = lockState(o), on = ls !== "unlocked", lv = o.level == null ? 1 : o.level;
    const mv = ls === "locking" ? 1 : ls === "unlocking" ? -1 : 0, jam = ls === "jammed", mid = !!mv || jam;
    return { o, u, on, ls, mv, jam, mid, fr: ls === "locked" ? 1 : ls === "unlocked" ? 0 : .5, B: .35 + .65 * lv, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, p: pal(o.color || BLK),
      st: jam ? JAM : mv ? AMB : on ? GRN : RED, hk: jam ? "hj" : mv ? "ha" : on ? "hg" : "hr", cls: jam ? P + "jblink" : mv ? P + "mblink" : on ? P + "breath" : "", n: 0 };
  }
  const mcls = (x, a, b, m1, m2, j) => x.mid ? `${P}${x.jam ? j : x.mv > 0 ? m1 : m2}` : `${P}${x.on ? a : b}`;
  function arrows(x, cx, cy, dir) {
    if (!x.mv) return "";
    let s = ""; for (let i = 0; i < 3; i++) s += `<path class="${P}chev${i}" d="M${f(-4.6 + i * 3.4)} -2.8L${f(-1.8 + i * 3.4)} 0L${f(-4.6 + i * 3.4)} 2.8"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${{ r: 0, d: 90, l: 180, u: 270 }[dir]})" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${s.replace(/ class="[^"]*"/g, "")}</g>` +
      `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${{ r: 0, d: 90, l: 180, u: 270 }[dir]})" fill="none" stroke="${AMB}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${s}</g>`;
  }
  function mark(x, cx, cy, s) {
    if (x.jam) return `<g class="${P}jblink"><path d="M${f(cx)} ${f(cy - s * .48)}L${f(cx + s * .52)} ${f(cy + s * .42)}H${f(cx - s * .52)}Z" fill="${JAM}" stroke="${JAM}" stroke-width="${f(s * .1)}" stroke-linejoin="round"/></g>` +
      `<path d="M${f(cx)} ${f(cy - s * .16)}V${f(cy + s * .1)}" stroke="#fff" stroke-width="${f(s * .11)}" stroke-linecap="round"/><circle cx="${f(cx)}" cy="${f(cy + s * .26)}" r="${f(s * .065)}" fill="#fff"/>`;
    const r = s * .36, cw = x.mv > 0, a0 = -Math.PI / 2 + (cw ? .5 : -.5), a1 = a0 + (cw ? 1 : -1) * Math.PI * 1.45;
    const ex = cx + r * Math.cos(a1), ey = cy + r * Math.sin(a1), tx2 = -Math.sin(a1) * (cw ? 1 : -1), ty2 = Math.cos(a1) * (cw ? 1 : -1), hs = s * .2;
    const head = `M${f(ex + tx2 * hs)} ${f(ey + ty2 * hs)}L${f(ex - ty2 * hs * .9)} ${f(ey + tx2 * hs * .9)}L${f(ex + ty2 * hs * .9)} ${f(ey - tx2 * hs * .9)}Z`;
    return `<g class="${P}${cw ? "spin" : "spinr"}"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * .5)}" fill="none"/><path d="M${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))}A${f(r)} ${f(r)} 0 1 ${cw ? 1 : 0} ${f(ex)} ${f(ey)}" fill="none" stroke="${AMB}" stroke-width="${f(s * .11)}" stroke-linecap="round"/><path d="${head}" fill="${AMB}"/></g>`;
  }
  const word = (x, cx, cy, s) => x.mid ? tx(cx, cy, s, x.jam ? JAM : AMB, x.jam ? "JAMMED" : x.mv > 0 ? "LOCKING" : "UNLOCKING") : "";
  const badge = (x) => x.jam ? `<g class="${P}badge"><circle cx="26" cy="26" r="11" fill="#000" fill-opacity=".45" transform="translate(1 1.6)"/><circle cx="26" cy="26" r="11" fill="#1c1416"/><circle cx="26" cy="26" r="10.3" fill="none" stroke="${JAM}" stroke-width="1.3"/>` +
    `<path d="M26 19.2L32.4 30.6H19.6Z" fill="${AMB}" stroke="${AMB}" stroke-width="1.2" stroke-linejoin="round"/><path d="M26 23.2V27" stroke="#1c1416" stroke-width="1.6" stroke-linecap="round"/><circle cx="26" cy="29" r=".95" fill="#1c1416"/></g>` : "";

  function defs(x, extra) {
    const p = x.p, id = x.id;
    return `<defs>
${lg(id("f"), [[0, p.k], [.16, p.d], [.4, p.l], [.64, p.m], [1, p.k]])}
${lg(id("fv"), [[0, p.l], [.45, p.m], [1, p.d]], 0, 0, 0, 1)}
${lg(id("fd"), [[0, p.l], [.42, p.m], [.78, p.d], [1, p.k]], 0, 0, 1, 1)}
${rg(id("fs"), [[0, p.l], [.55, p.m], [1, p.d]], .36, .3, .75)}
${lg(id("fx"), [[0, "#fff", .2], [.14, "#fff", 0], [.84, "#000", 0], [1, "#000", .28]])}
${lg(id("gl"), [[0, "#fff", .5], [.5, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("bolt"), [[0, "#f3f5f7"], [.42, "#aeb5bd"], [.56, "#cfd5db"], [1, "#565d65"]], 0, 0, 0, 1)}
${lg(id("bv"), [[0, "#565d65"], [.45, "#e6eaee"], [1, "#6a7179"]])}
${lg(id("stl"), [[0, "#6f767e"], [.5, "#e2e6ea"], [1, "#5a6067"]])}
${lg(id("stv"), [[0, "#e2e6ea"], [.5, "#9aa1a9"], [1, "#5a6067"]], 0, 0, 0, 1)}
${lg(id("scr"), [[0, "#1f2533"], [1, "#06080c"]], 0, 0, 0, 1)}
${lg(id("rub"), [[0, "#454a53"], [.5, "#25282e"], [1, "#141619"]], 0, 0, 0, 1)}
${lg(id("gap"), [[0, "#000", .9], [1, "#14121c", .9]])}
${rg(id("sh"), [[0, "#000", .55], [.6, "#000", .2], [1, "#000", 0]])}
${rg(id("hg"), [[0, GRN, .85], [.45, GRN, .28], [1, GRN, 0]])}
${rg(id("hr"), [[0, RED, .85], [.45, RED, .28], [1, RED, 0]])}
${rg(id("hk"), [[0, KEY, .55], [.6, KEY, .18], [1, KEY, 0]])}${x.mid ? rg(id("ha"), [[0, AMB, .85], [.45, AMB, .28], [1, AMB, 0]]) + rg(id("hj"), [[0, JAM, .9], [.45, JAM, .32], [1, JAM, 0]]) : ""}
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .06], [1, "#000", .5]], .5, .48, .74)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
${extra || ""}</defs>`;
  }

  const DOOR = {
    red: ["#8a2f37", "#561821"], oak: ["#a9784a", "#714828"], white: ["#c3c7ce", "#979ca6"], slate: ["#4a5465", "#2c333f"],
    navy: ["#2d3c5e", "#19223a"], walnut: ["#5e3e28", "#362213"], steel: ["#3d4148", "#202328"], locker: ["#68717d", "#454c56"],
    brick: ["#6a4030", "#45291f"], cedar: ["#a06e46", "#6a4529"], maple: ["#c09868", "#8e6a42"], teal: ["#2f6266", "#1a3d40"],
    upvc: ["#d2d5da", "#a9adb5"], barn: ["#74392b", "#45201a"], veneer: ["#4e372a", "#2a1c14"], concrete: ["#5d6064", "#3e4145"],
    gunwall: ["#35313f", "#1f1c27"], plaster: ["#6a6470", "#4a4552"], gray: ["#56606c", "#363d47"],
  };
  function grain(seed, x0, x1, dense, vert) {
    const r = rnd(seed); let s = ""; const step = dense ? 5 : 9;
    for (let a = x0; a < x1; a += step + r() * step) {
      const w = 1.5 + r() * 3, op = (.1 + r() * .18).toFixed(2), sw2 = (.5 + r() * .9).toFixed(1);
      s += vert === false
        ? `<path d="M8 ${f(a)}C60 ${f(a + w)} 130 ${f(a - w)} 192 ${f(a + w * .5)}" fill="none" stroke="#1d0f06" stroke-opacity="${op}" stroke-width="${sw2}"/>`
        : `<path d="M${f(a)} 8C${f(a + w)} 60 ${f(a - w)} 130 ${f(a + w * .5)} 192" fill="none" stroke="#1d0f06" stroke-opacity="${op}" stroke-width="${sw2}"/>`;
      if (r() > .7) s += vert === false
        ? `<path d="M8 ${f(a + 2)}C70 ${f(a + 2 + w)} 120 ${f(a + 2 - w)} 192 ${f(a + 2)}" fill="none" stroke="#ffe2bf" stroke-opacity=".07" stroke-width="1.6"/>`
        : `<path d="M${f(a + 2)} 8C${f(a + 2 + w)} 70 ${f(a + 2 - w)} 120 ${f(a + 2)} 192" fill="none" stroke="#ffe2bf" stroke-opacity=".07" stroke-width="1.6"/>`;
    }
    return s;
  }
  const speck = (seed, n, big) => { const r = rnd(seed); let s = ""; for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * (big || .7))}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .08).toFixed(2)}"/>`; return s; };
  const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#000" fill-opacity=".1"/>
<path d="M${x} ${y + h}V${y}H${x + w}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.6"/><path d="M${x + w} ${y}V${y + h}H${x}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.6"/>
<rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" rx="1.5" fill="#fff" fill-opacity=".05"/>
<path d="M${x + 6} ${y + h - 6}V${y + 6}H${x + w - 6}" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="1.2"/><path d="M${x + w - 6} ${y + 6}V${y + h - 6}H${x + 6}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`;
  function surface(x, kind, tex) {
    const c = DOOR[kind];
    return `${lg(x.id("dg"), [[0, c[0]], [1, c[1]]], 0, 0, .3, 1)}<rect x="8" y="8" width="184" height="184" fill="${x.url("dg")}"/>${tex || ""}`;
  }
  function scene(x, kind, tex, hw, extra, after) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}
<g class="hda-bg"><g clip-path="${x.url("wc")}">${surface(x, kind, tex)}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/>${after || ""}</g>
<rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g>
${hw}${badge(x)}</svg>`;
  }
  function jamb(x, E, c1, c2) {
    c1 = c1 || "#c9ccd2"; c2 = c2 || "#8c919a"; const g = x.id("jb" + (x.n++));
    return `<g class="hda-bg">${lg(g, [[0, c2], [.12, c1], [.5, H().mix(c1, c2, .4)], [1, c2]])}
<rect x="${E}" y="0" width="5" height="200" fill="${x.url("gap")}"/><rect x="${E + 5}" y="0" width="${195 - E}" height="200" fill="url(#${g})"/>
<path d="M${E + 5.5} 0V200" stroke="#fff" stroke-opacity=".25"/><path d="M${E + 16} 0V200" stroke="#000" stroke-opacity=".28" stroke-width="1.4"/><path d="M${E + 17.4} 0V200" stroke="#fff" stroke-opacity=".12"/></g>`;
  }
  function strike(x, E, y, h) {
    h = h || 30;
    return `<g class="hda-bg"><path d="${rr(E + 5, y - h / 2, 12, h, 1.5)}" fill="${x.url("stv")}"/><path d="${rr(E + 5, y - h / 2, 12, h, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>
<circle cx="${E + 11}" cy="${y - h / 2 + 3.5}" r="1.4" fill="#4b5158"/><circle cx="${E + 11}" cy="${y + h / 2 - 3.5}" r="1.4" fill="#4b5158"/></g>`;
  }
  const hole = (E, y, hh) => `<g class="hda-bg"><rect x="${E + 5}" y="${f(y - hh / 2 - 1.2)}" width="10" height="${f(hh + 2.4)}" rx="1" fill="#050508"/></g>`;

  function bolt(x, E, y, L, h, shape, steady) {
    const k = x.id("bc" + (x.n++)), fr = steady ? 1 : x.fr, out = fr >= 1, y0 = y - h / 2;
    let body;
    if (shape === "latch") body = `<path d="M${E - 2} ${f(y0)}H${E + L - 5}L${E + L} ${f(y + h / 2)}H${E - 2}Z" fill="${x.url("bolt")}"/><path d="M${E + L - 5} ${f(y0)}L${E + L} ${f(y + h / 2)}" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>`;
    else if (shape === "hook") body = `<path d="M${E - 2} ${f(y0)}H${E + L}V${f(y0 + h + 5)}H${E + L - 5}V${f(y0 + h)}H${E - 2}Z" fill="${x.url("bolt")}"/><path d="M${E} ${f(y0 + .6)}H${E + L - .6}" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/>`;
    else body = `<path d="${rr(E - 2, y0, L + 2, h, 1.6)}" fill="${x.url("bolt")}"/><path d="M${E} ${f(y0 + .9)}H${E + L - 1.5}" stroke="#fff" stroke-opacity=".7" stroke-width=".9"/><path d="M${E + L - .6} ${f(y0 + 1.5)}V${f(y0 + h - 1.5)}" stroke="#000" stroke-opacity=".3"/>`;
    const cls = steady ? "" : ` class="${mcls(x, "bo", "bi", "mxo", "mxi", "jx")}"`;
    const bt = `${hole(E, y, h + (shape === "hook" ? 5 : 0))}<clipPath id="${k}"><rect x="${E}" y="0" width="${200 - E}" height="200"/></clipPath>
<g clip-path="url(#${k})"><g${out ? "" : ` transform="translate(${fr ? f(-(L + 3) * (1 - fr)) : -L - 3} 0)"`}><g${cls}>${body}</g></g></g>` + (steady ? "" : arrows(x, E + 11, y - h / 2 - 8, x.mv > 0 ? "r" : "l"));
    return bt;
  }
  function boltUp(x, cx, edgeY, L, w) {
    const k = x.id("bc" + (x.n++)), out = x.fr >= 1, dy = out ? 0 : x.fr ? f((L + 3) * (1 - x.fr)) : L + 3;
    return `<rect x="${f(cx - w / 2 - 1.2)}" y="${edgeY - L - 1}" width="${f(w + 2.4)}" height="${L + 1}" rx="1" fill="#050508"/><clipPath id="${k}"><rect x="0" y="0" width="200" height="${edgeY}"/></clipPath>
<g clip-path="url(#${k})"><g${out ? "" : ` transform="translate(0 ${dy})"`}><g class="${mcls(x, "buo", "bui", "myo", "myi", "jy")}"><path d="${rr(cx - w / 2, edgeY - L, w, L + 2, 1.4)}" fill="${x.url("bv")}"/><path d="M${f(cx - w / 2 + .9)} ${edgeY - L + 1}V${edgeY}" stroke="#fff" stroke-opacity=".6" stroke-width=".8"/></g></g></g>` + arrows(x, cx + w / 2 + 7, edgeY - L / 2, x.mv > 0 ? "u" : "d");
  }

  const shd = (x, d, dx, dy, op) => `<path d="${d}" transform="translate(${dx == null ? 2.5 : dx} ${dy == null ? 4 : dy})" fill="#000" opacity="${op || .5}" filter="${x.url("bl")}"/>`;
  function plate(x, d, opt) {
    opt = opt || {};
    return `${shd(x, d)}<path d="${d}" fill="${x.url(opt.fill || "fd")}"/><path d="${d}" fill="${x.url("fx")}"/><path d="${d}" fill="${x.url("gl")}" opacity="${opt.gloss || .3}"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="1.1"/><path d="${d}" fill="none" stroke="${x.p.e}" stroke-width=".7"/>`;
  }
  const tx = (cx, cy, s, fill, t, op) => `<text x="${f(cx)}" y="${f(cy + s * .36)}" font-size="${f(s)}" ${FONT} fill="${fill}"${op == null ? "" : ` fill-opacity="${op}"`}>${t}</text>`;
  function pad(x, x0, y0, cols, labs, kw, kh, gx, gy, style) {
    const rows = Math.ceil(labs.length / cols), W = cols * kw + (cols - 1) * gx, Hh = rows * kh + (rows - 1) * gy, lit = x.on, B = x.B;
    let keys = "", glow = "", fsz = Math.min(kh * .62, kw * .5);
    labs.forEach((t, i) => {
      const c = i % cols, r = (i / cols) | 0, kx = x0 + c * (kw + gx), ky = y0 + r * (kh + gy), mx = kx + kw / 2, my = ky + kh / 2, kr = Math.min(kh, kw) * .34;
      if (style !== "touch") {
        keys += `<path d="${rr(kx, ky + .9, kw, kh, kr)}" fill="#000" fill-opacity=".45"/><path d="${rr(kx, ky, kw, kh, kr)}" fill="${x.url(style === "metal" ? "fv" : "rub")}"/>` +
          `<path d="M${f(kx + kr)} ${f(ky + .6)}H${f(kx + kw - kr)}" stroke="#fff" stroke-opacity="${style === "metal" ? .55 : .22}" stroke-width=".8" stroke-linecap="round"/>`;
        if (lit) keys += `<path d="${rr(kx, ky, kw, kh, kr)}" fill="${KEY}" fill-opacity="${f(.12 * B)}"/>`;
      }
      if (!t) return;
      if (lit) { glow += `<circle cx="${f(mx)}" cy="${f(my)}" r="${f(Math.max(kw, kh) * .55)}" fill="${x.url("hk")}"/>`; keys += tx(mx, my, fsz, "#eaf8ff", t); }
      else keys += tx(mx, my, fsz, style === "touch" ? "#fff" : (style === "metal" ? x.p.k : "#9aa0a8"), t, style === "touch" ? .07 : .55);
    });
    const halo = lit ? `<g class="${P}pulse" opacity="${f(.9 * B)}">${glow}</g>` : "";
    return halo + keys;
  }
  function led(x, cx, cy, r) {
    r = r || 1.8; const c = x.st;
    return `<circle class="${x.cls}" cx="${cx}" cy="${cy}" r="${f(r + 6)}" fill="${x.url(x.hk)}"/><circle${x.mid ? ` class="${x.cls}"` : ""} cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .4)}" fill="#fff" fill-opacity=".85"/>`;
  }
  function ring(x, cx, cy, r, w) {
    const c = x.st;
    return `<g class="${x.cls}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-opacity=".28" stroke-width="${f(w + 5)}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-opacity=".18" stroke-width="${f(w + 10)}"/></g>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="${w}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${f(w * .3)}"/>`;
  }
  function glyph(x, cx, cy, s, c) {
    if (x.mid) return mark(x, cx, cy, s * 1.15);
    c = c || x.st; const lk = x.on, ly = lk ? 0 : -s * .16;
    return `<path d="M${f(cx - s * .28)} ${f(cy - s * .05 + ly)}V${f(cy - s * .3 + ly)}A${f(s * .28)} ${f(s * .28)} 0 0 1 ${f(cx + s * .28)} ${f(cy - s * .3 + ly)}V${f(cy - s * (lk ? .05 : .2) + ly)}" fill="none" stroke="${c}" stroke-width="${f(s * .12)}" stroke-linecap="round"/>
<path d="${rr(cx - s * .42, cy - s * .08, s * .84, s * .62, s * .1)}" fill="${c}"/><circle cx="${f(cx)}" cy="${f(cy + s * .2)}" r="${f(s * .08)}" fill="#000" fill-opacity=".45"/>`;
  }
  function keyway(x, cx, cy, r) {
    return `${shd(x, circ(cx, cy, r), 1.5, 2.5, .45)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("fs")}"/><circle cx="${cx}" cy="${cy}" r="${f(r - .5)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .62)}" fill="${x.url("fd")}"/><circle cx="${cx}" cy="${cy}" r="${f(r * .62)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".7"/>
<path d="M${f(cx - r * .09)} ${f(cy - r * .42)}h${f(r * .18)}v${f(r * .55)}l${f(r * .1)} ${f(r * .18)}h${f(-r * .38)}l${f(r * .1)} ${f(-r * .18)}Z" fill="#06070a"/>`;
  }
  function lever(x, cx, cy, len, rose, noRose) {
    const r = rose || 12, t = 9, y0 = cy - t / 2, d = `M${cx} ${f(y0)}H${f(cx - len + 6)}Q${f(cx - len)} ${f(y0)} ${f(cx - len)} ${f(y0 + 6)}V${f(y0 + t + 3)}Q${f(cx - len)} ${f(y0 + t + 5)} ${f(cx - len + 3)} ${f(y0 + t + 4)}L${f(cx - len + 4)} ${f(y0 + t)}H${cx}Z`;
    return `${noRose ? "" : `${shd(x, circ(cx, cy, r), 2, 3)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("fs")}"/><circle cx="${cx}" cy="${cy}" r="${f(r - .6)}" fill="none" stroke="#fff" stroke-opacity=".3"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.p.e}" stroke-width=".6"/>`}
${shd(x, d, 2, 6, .55)}<path d="${d}" fill="${x.url("fv")}"/><path d="${d}" fill="none" stroke="${x.p.e}" stroke-width=".6"/>
<path d="M${f(cx - 2)} ${f(y0 + 1.2)}H${f(cx - len + 6)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="${f(t * .75)}" fill="${x.url("fs")}"/><circle cx="${f(cx - 1.5)}" cy="${f(cy - 1.8)}" r="${f(t * .25)}" fill="#fff" fill-opacity=".35"/>`;
  }
  const screw = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r || 1.6}" fill="#000" fill-opacity=".35"/><circle cx="${cx}" cy="${f(cy - .3)}" r="${f((r || 1.6) - .3)}" fill="#c4cad0"/><path d="M${f(cx - (r || 1.6) * .6)} ${cy}h${f((r || 1.6) * 1.2)}" stroke="#555b62" stroke-width=".6"/>`;
  const fingerprint = (x, cx, cy, r) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("scr")}"/>`;
    for (let i = 1; i <= 4; i++) { const q = r * i / 5; s += `<path d="M${f(cx - q)} ${f(cy + q * .5)}A${f(q)} ${f(q * 1.15)} 0 1 1 ${f(cx + q)} ${f(cy + q * .4)}" fill="none" stroke="${x.on ? KEY : "#8b93a0"}" stroke-opacity="${x.on ? f(.4 + .4 * x.B) : .28}" stroke-width=".7"/>`; }
    return s + `<circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .4)}" r="${f(r * .25)}" fill="#fff" fill-opacity=".12"/>`;
  };
  const N12 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  const N10 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  const icons = [];
  const add = (id, name, def, fn) => icons.push({ id, name, colors: sw(def), picker: true, colorLabel: "Finish", options: [{ id: "state", name: "State", values: LSTATE }], render: (o) => fn(ctx(o)) });

  add("keypad", "Keypad deadbolt", NIC, (x) => {
    const E = 164, d = rr(98, 38, 46, 116, 15);
    const tex = panel(22, 22, 58, 70) + panel(22, 108, 58, 72) + speck(11, 40);
    const hw = jamb(x, E) + strike(x, E, 134) + bolt(x, E, 134, 15, 9) + plate(x, d) +
      `<path d="${rr(103, 47, 36, 72, 9)}" fill="#000" fill-opacity=".22"/>` + pad(x, 105, 50, 2, N10, 14, 10, 4, 3.6, "btn") +
      keyway(x, 121, 136, 9.5) + led(x, 121, 43.5, 1.5);
    return scene(x, "red", tex, hw);
  });

  add("touch", "Touchscreen lock", BLK, (x) => {
    const E = 166, d = rr(90, 28, 48, 132, 10);
    const tex = grain(31, 8, 190) + speck(3, 20);
    const glass = rr(94.5, 32.5, 39, 123, 6.5);
    const hw = jamb(x, E, "#b48a5e", "#6e4b2c") + strike(x, E, 100) + bolt(x, E, 100, 15, 9) + plate(x, d) +
      `<path d="${glass}" fill="${x.url("scr")}"/>` + (x.on ? `<path d="${glass}" fill="${KEY}" fill-opacity="${f(.07 * x.B)}"/>` : "") +
      pad(x, 96, 46, 3, N12, 11, 11, 2.5, 6, "touch") + ring(x, 114, 136, 8, 1.6) + glyph(x, 114, 136, 9) + word(x, 114, 40, 5.2) +
      `<path d="M94.5 39C104 34 120 33 133.5 36V60C118 52 104 51 94.5 56Z" fill="#fff" fill-opacity=".08"/><path d="${glass}" fill="none" stroke="#fff" stroke-opacity=".14"/>`;
    return scene(x, "oak", tex, hw);
  });

  add("retrofit", "Retrofit lock", WHT, (x) => {
    const E = 166, cx = 106, cy = 100;
    const tex = panel(20, 20, 50, 70) + panel(20, 110, 50, 70) + speck(5, 30);
    const knob = `<g transform="rotate(${90 * x.fr} ${cx} ${cy})"><g class="${mcls(x, "rl", "ru", "mrl", "mru", "jr")}">
<path d="${rr(cx - 6.5, cy - 24, 13, 48, 6.5)}" fill="#000" opacity=".35" transform="translate(1.5 2)"/><path d="${rr(cx - 6.5, cy - 24, 13, 48, 6.5)}" fill="${x.url("f")}"/>
<path d="M${cx - 3} ${cy - 21}V${cy + 21}" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy - 17}" r="1.6" fill="${x.st}"/></g></g>`;
    const hw = jamb(x, E, "#d6d9de", "#9da2ab") + strike(x, E, cy) + bolt(x, E, cy, 15, 9) +
      plate(x, rr(cx - 20, cy - 50, 40, 100, 14), { fill: "fv" }) +
      `${shd(x, circ(cx, cy + 3, 37), 3, 6, .6)}<circle cx="${cx}" cy="${cy + 4}" r="37" fill="${x.p.k}"/><circle cx="${cx}" cy="${cy}" r="37" fill="${x.url("fs")}"/><circle cx="${cx}" cy="${cy}" r="36.4" fill="none" stroke="#fff" stroke-opacity=".3"/>
<circle cx="${cx}" cy="${cy}" r="29" fill="${x.url("fd")}"/><circle cx="${cx}" cy="${cy}" r="29" fill="${x.url("gl")}" opacity=".35"/><circle cx="${cx}" cy="${cy}" r="29" fill="none" stroke="#000" stroke-opacity=".25"/>` +
      ring(x, cx, cy, 32.6, 1.8) + knob;
    return scene(x, "white", tex, hw);
  });

  add("fingerprint", "Fingerprint lever", BLK, (x) => {
    const E = 164, d = rr(107, 30, 26, 144, 13);
    const tex = speck(17, 60, .5) + `<path d="M8 150H192" stroke="#000" stroke-opacity=".12"/>`;
    const hw = jamb(x, E, "#8e96a3", "#58606c") + strike(x, E, 122, 62) + bolt(x, E, 104, 13, 8, "latch", true) + bolt(x, E, 142, 15, 9) + plate(x, d) +
      fingerprint(x, 120, 56, 8) + ring(x, 120, 56, 10, 1.4) + lever(x, 120, 104, 58, 0, true) + keyway(x, 120, 142, 7);
    return scene(x, "slate", tex, hw);
  });

  add("handleset", "Handle set", BRS, (x) => {
    const E = 164;
    const tex = panel(20, 20, 50, 66) + panel(20, 104, 50, 78) + speck(23, 30);
    const grip = `M110 116H99Q90 116 90 126V154Q90 164 99 164H110`;
    const hw = jamb(x, E) + strike(x, E, 60) + bolt(x, E, 60, 15, 9) + strike(x, E, 140) + bolt(x, E, 140, 12, 8, "latch", true) +
      plate(x, rr(103, 24, 38, 72, 11)) + pad(x, 109, 31, 2, ["1", "2", "3", "4", "5", "6", "7", "8"], 12, 9, 2.5, 4, "btn") + led(x, 122, 88, 1.5) +
      plate(x, rr(109, 104, 25, 74, 11)) +
      `<path d="${grip}" transform="translate(2 5)" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="9" filter="${x.url("bl")}"/>
<path d="${grip}" fill="none" stroke="${x.p.k}" stroke-width="9" stroke-linecap="round"/><path d="${grip}" fill="none" stroke="${x.p.m}" stroke-width="7" stroke-linecap="round"/>
<path d="M108 114H99Q88 114 88 126V150" fill="none" stroke="${x.p.l}" stroke-width="2" stroke-linecap="round" stroke-opacity=".9"/>
<path d="M104 112Q112 107 121 110L120 114Q112 112 106 116Z" fill="${x.url("fv")}" stroke="${x.p.e}" stroke-width=".5"/>` + keyway(x, 121.5, 160, 6);
    return scene(x, "navy", tex, hw);
  });

  add("mortise", "Mortise lock", BRZ, (x) => {
    const E = 160, d = rr(108, 18, 22, 164, 4);
    const tex = grain(47, 8, 190, false) + `<path d="M8 8H192" stroke="#000"/>`;
    const hw = jamb(x, E, "#7a5438", "#3c2616") + strike(x, E, 116, 54) + bolt(x, E, 98, 12, 8, "latch", true) + bolt(x, E, 132, 16, 10) + plate(x, d) +
      screw(119, 23, 1.4) + screw(119, 177, 1.4) + pad(x, 111, 30, 2, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], 7, 6, 2, 3, "metal") + led(x, 119, 79, 1.4) +
      lever(x, 119, 98, 60, 0, true) + keyway(x, 119, 132, 6.5) + `<path d="M115 152h8v10h-8z" fill="#000" fill-opacity=".35"/><path d="${rr(116, 153, 6, 8, 2)}" fill="${x.url("f")}"/>`;
    return scene(x, "walnut", tex, hw);
  });

  const VPARTS = [{ id: "lock", name: "Lock", type: "switch" }, { id: "bell", name: "Doorbell", type: "stage", values: [["idle", "Idle"], ["ringing", "Ringing"]], def: "idle" },
    { id: "door", name: "Door", type: "contact" }];
  add("video", "Video doorbell lock", NIC, (x0) => {
    const o = x0.o, mf = !!o.mf, x = mf ? ctx(Object.assign({}, o, { on: !!(o.parts && o.parts.lock) })) : x0;
    const rng = mf && o.pval && o.pval.bell === "ringing", open = mf && !!(o.parts && o.parts.door);
    const E = 164, d = rr(92, 20, 48, 160, 16);
    let tex = ""; for (let y = 30; y < 192; y += 26) tex += `<path d="M8 ${y}H192" stroke="#000" stroke-opacity=".55" stroke-width="2"/><path d="M8 ${y + 1.6}H192" stroke="#fff" stroke-opacity=".08"/>`;
    const sc = rr(98, 60, 36, 54, 7);
    const jb = jamb(x, E, "#4a4f57", "#25282d") + strike(x, E, 150), hw0 = bolt(x, E, 150, 15, 9) + plate(x, d) +
      `<circle cx="116" cy="40" r="11" fill="#06070a"/><circle cx="116" cy="40" r="11" fill="none" stroke="#fff" stroke-opacity=".15"/><circle cx="116" cy="40" r="6.5" fill="#15233a"/><circle cx="116" cy="40" r="3.6" fill="#03050a"/><circle cx="114" cy="38" r="1.8" fill="#9fd8ff" fill-opacity=".55"/><circle cx="106" cy="40" r="1" fill="#3a1a1a"/><circle cx="126" cy="40" r="1" fill="#3a1a1a"/>` +
      `<path d="${sc}" fill="${x.url("scr")}"/>` + pad(x, 100, 63, 3, N12, 9.4, 9, 2, 4, "touch") +
      `<path d="M98 66C110 61 122 61 134 63V80C122 76 110 76 98 79Z" fill="#fff" fill-opacity=".07"/>` +
      `<circle cx="116" cy="132" r="10" fill="${x.url("fs")}"/><circle cx="116" cy="132" r="7.5" fill="${x.url("rub")}"/>` + ring(x, 116, 132, 10.5, 1.5) +
      `<path d="M112.5 132.5L116 129L119.5 132.5V136H112.5Z" fill="#fff" fill-opacity=".5"/>` + keyway(x, 116, 158, 6.5) +
      (rng ? `<g class="${P}breath"><circle cx="116" cy="132" r="15" fill="none" stroke="${KEY}" stroke-opacity=".55" stroke-width="3"/><circle cx="116" cy="40" r="15" fill="none" stroke="${KEY}" stroke-opacity=".4" stroke-width="2"/>` +
        [18, 24].map((r, i) => [0, 180].map((a) => { const a1 = (a - 32) * Math.PI / 180, a2 = (a + 32) * Math.PI / 180;
          return `<path d="M${f(116 + r * Math.cos(a1))} ${f(132 + r * Math.sin(a1))}A${r} ${r} 0 0 1 ${f(116 + r * Math.cos(a2))} ${f(132 + r * Math.sin(a2))}" fill="none" stroke="${KEY}" stroke-width="${2 - i * .6}" stroke-linecap="round" opacity="${.9 - i * .3}"/>`; }).join("")).join("") + `</g>` : "");
    const hw = jb + (open ? `<rect x="${E - 18}" y="0" width="23" height="200" fill="#07080b"/><g transform="translate(-18 0)">${hw0}</g>` : hw0);
    return scene(x, "steel", tex, hw);
  });

  icons[icons.length - 1].parts = VPARTS;

  add("btpadlock", "Bluetooth padlock", NIC, (x) => {
    let tex = ""; for (let i = 0; i < 6; i++) tex += `<path d="${rr(40 + i * 21, 20, 9, 30, 4.5)}" fill="#000" fill-opacity=".38"/><path d="M${44 + i * 21} 22V48" stroke="#fff" stroke-opacity=".08"/>`;
    tex += `<path d="M8 176H192" stroke="#000" stroke-opacity=".3" stroke-width="2"/>` + speck(9, 50, .5);
    const lift = -10 * (1 - x.fr), shk = `M98 116V86A13.5 13.5 0 0 1 125 86V116`;
    const hw = `<path d="${rr(88, 60, 46, 50, 6)}" fill="#000" fill-opacity=".3"/><path d="${rr(90, 62, 42, 46, 5)}" fill="${x.url("stv")}"/><path d="${rr(90, 62, 42, 46, 5)}" fill="none" stroke="#000" stroke-opacity=".3"/>
<path d="${rr(104, 58, 14, 34, 3)}" fill="${x.url("stl")}"/><rect x="107.5" y="72" width="7" height="12" rx="3" fill="#0a0a0d"/>` +
      `<g transform="translate(0 ${lift})"><g class="${mcls(x, "sl", "su", "msl", "msu", "jy")}"><path d="${shk}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="7.5" transform="translate(2 3)"/>
<path d="${shk}" fill="none" stroke="#5d646c" stroke-width="7.5"/><path d="${shk}" fill="none" stroke="#e6eaee" stroke-width="4"/><path d="M96.5 112V86A15 15 0 0 1 104 73" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.2"/></g></g>` +
      plate(x, rr(82, 108, 59, 58, 14), { fill: "fv", gloss: .45 }) + `<path d="${rr(82, 108, 59, 58, 14)}" fill="${x.url("f")}" opacity=".35"/>` +
      led(x, 111.5, 124, 2) + `<circle cx="111.5" cy="145" r="7.5" fill="#000" fill-opacity=".3"/><circle cx="111.5" cy="144.4" r="7" fill="${x.url("fs")}"/>` + glyph(x, 111.5, 144, 7, x.p.k) +
      `<ellipse cx="111" cy="170" rx="24" ry="3" fill="${x.url("sh")}"/>`;
    return scene(x, "locker", tex, hw);
  });

  add("garage", "Garage keypad", BLK, (x) => {
    let tex = "";
    const r = rnd(71);
    for (let row = 0, y = 8; y < 192; y += 11, row++) {
      for (let bx = 8 - (row % 2) * 12; bx < 134; bx += 24) { const v = r(); tex += `<rect x="${f(bx + .8)}" y="${f(y + .8)}" width="22.4" height="9.4" rx="1" fill="${v > .5 ? "#000" : "#e09a7c"}" fill-opacity="${(.04 + v * .1).toFixed(2)}"/><path d="M${bx} ${y}v11" stroke="#c9b8a8" stroke-opacity=".16" stroke-width="1.5"/>`; }
      tex += `<path d="M8 ${y}H134" stroke="#c9b8a8" stroke-opacity=".18" stroke-width="1.5"/>`;
    }
    const lift = -20 * (1 - x.fr);
    let gd = `<rect x="146" y="20" width="50" height="172" fill="#c8ccd2"/>`;
    for (let y = 20; y < 191; y += 34.4) gd += `<rect x="146" y="${f(y)}" width="50" height="34" fill="url(#${x.u}-gdp)"/><rect x="154" y="${f(y + 7)}" width="42" height="20" rx="1.5" fill="#000" fill-opacity=".08"/><path d="M154 ${f(y + 27)}h42" stroke="#fff" stroke-opacity=".4"/><path d="M146 ${f(y + 33)}h50" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>`;
    const after = `<rect x="134" y="8" width="66" height="192" fill="#050508"/><rect x="146" y="150" width="50" height="50" fill="#16151c"/><path d="M146 176H196" stroke="#2c2a35"/><rect x="150" y="186" width="46" height="6" fill="#3a3842"/>` +
      `<g transform="translate(0 ${lift})"><g class="${mcls(x, "gl", "gu", "mgl", "mgu", "jy")}">${gd}</g></g>` +
      `<rect x="134" y="8" width="12" height="192" fill="url(#${x.u}-trim)"/><path d="M146 8V200" stroke="#000" stroke-opacity=".4"/><rect x="134" y="8" width="66" height="12" fill="url(#${x.u}-trim2)"/>`;
    const extra = lg(x.id("gdp"), [[0, "#e4e7eb"], [1, "#a6abb3"]], 0, 0, 0, 1) + lg(x.id("trim"), [[0, "#d9dce0"], [1, "#9298a1"]]) + lg(x.id("trim2"), [[0, "#d9dce0"], [1, "#9298a1"]], 0, 0, 0, 1);
    const box = rr(52, 50, 54, 112, 10);
    const hw = `<path d="M56 50L60 20H98L102 50Z" fill="${x.p.d}" fill-opacity=".55"/><path d="M60 20H98" stroke="#fff" stroke-opacity=".3"/><path d="M56 50L60 20H98L102 50" fill="none" stroke="${x.p.e}" stroke-width=".7"/>` +
      plate(x, box, { fill: "fv" }) + `<path d="${rr(58, 58, 42, 82, 6)}" fill="#000" fill-opacity=".28"/>` + pad(x, 61, 62, 2, N10, 16, 11, 4, 4, "btn") +
      led(x, 72, 150, 1.8) + glyph(x, 86, 150, 7, x.on ? GRN : "#9aa0a8") + screw(79, 55, 1.2);
    return scene(x, "brick", tex, hw, extra, after);
  });

  add("gate", "Gate lock", BLK, (x) => {
    const E = 150;
    let tex = ""; const r = rnd(5);
    for (let y = 8; y < 192; y += 20) tex += `<rect x="8" y="${y}" width="${E - 8}" height="18.5" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.03 + r() * .06).toFixed(2)}"/><path d="M8 ${y + 19}H${E}" stroke="#120a05" stroke-opacity=".75" stroke-width="2.2"/>`;
    tex += grain(83, 8, 190, false) + `<path d="M24 30L130 172" stroke="#3a2412" stroke-opacity=".0"/>`;
    const post = lg(x.id("post"), [[0, "#3e2a1a"], [.2, "#7a5434"], [.6, "#5e3f25"], [1, "#2e1e12"]]);
    const after = `<rect x="${E}" y="0" width="5" height="200" fill="${x.url("gap")}"/><rect x="${E + 5}" y="0" width="45" height="200" fill="${x.url("post")}"/>` + `<g opacity=".8">${grain(9, E + 6, 196, true)}</g>` +
      `<path d="M22 40H70" stroke="#16171a" stroke-width="7" stroke-linecap="round"/><path d="M22 160H70" stroke="#16171a" stroke-width="7" stroke-linecap="round"/><circle cx="34" cy="40" r="1.6" fill="#555"/><circle cx="58" cy="40" r="1.6" fill="#555"/><circle cx="34" cy="160" r="1.6" fill="#555"/><circle cx="58" cy="160" r="1.6" fill="#555"/>`;
    const hw = `<g class="hda-bg"><path d="${rr(E + 6, 88, 14, 26, 2)}" fill="${x.url("fv")}"/><path d="${rr(E + 6, 88, 14, 26, 2)}" fill="none" stroke="${x.p.e}" stroke-width=".6"/></g>` + bolt(x, E, 101, 16, 10) +
      plate(x, rr(126, 84, 24, 34, 5), { fill: "fv" }) + screw(132, 89, 1.2) + screw(132, 113, 1.2) +
      plate(x, rr(76, 54, 42, 92, 9), { fill: "fv" }) + `<path d="${rr(80, 60, 34, 70, 5)}" fill="#000" fill-opacity=".3"/>` +
      pad(x, 83, 63, 2, N10, 12, 10.5, 4, 3, "btn") + led(x, 97, 137, 1.6) + `<path d="M76 70H118" stroke="#fff" stroke-opacity=".0"/>`;
    return scene(x, "cedar", tex, hw, post, after);
  });

  add("sliding", "Sliding door lock", WHT, (x) => {
    const E = 142;
    const glass = lg(x.id("gls"), [[0, "#3e5a78"], [.5, "#1d2a3c"], [1, "#2b3f56"]], 0, 0, 1, 1) + lg(x.id("alu"), [[0, "#6a7179"], [.3, "#d9dde2"], [.7, "#b4bac1"], [1, "#5f666e"]]);
    const after = `<rect x="8" y="8" width="104" height="184" fill="url(#${x.u}-gls)"/><path d="M8 60L60 8H84L8 84Z" fill="#fff" fill-opacity=".09"/><path d="M8 120L96 32V48L8 136Z" fill="#fff" fill-opacity=".05"/>
<path d="M18 150c14-8 30-8 44 0v42H18z" fill="#000" fill-opacity=".18"/><rect x="104" y="8" width="${E - 104}" height="184" fill="url(#${x.u}-alu)"/><path d="M112 8V192" stroke="#000" stroke-opacity=".3"/><path d="M104 8V192" stroke="#000" stroke-opacity=".5" stroke-width="2"/>
<rect x="${E}" y="8" width="6" height="184" fill="${x.url("gap")}"/><rect x="148" y="8" width="18" height="184" fill="url(#${x.u}-alu)"/><path d="M166 8V192" stroke="#000" stroke-opacity=".45" stroke-width="1.6"/>`;
    const hw = `<g class="hda-bg"><path d="${rr(E + 6, 92, 12, 34, 2)}" fill="${x.url("stv")}"/></g>` + bolt(x, E, 104, 17, 9, "hook") +
      plate(x, rr(116, 44, 22, 116, 8), { fill: "f" }) + led(x, 127, 56, 1.8) +
      `<path d="${rr(120, 70, 14, 44, 7)}" fill="#000" fill-opacity=".35"/><path d="${rr(121, 71, 12, 42, 6)}" fill="${x.p.k}"/>` +
      `<g transform="translate(0 ${-16 * (1 - x.fr)})"><g class="${mcls(x, "tl", "tu", "mtl", "mtu", "jy")}"><path d="${rr(121.5, 92, 11, 20, 5.5)}" fill="${x.url("fs")}"/><path d="M124.5 95v14" stroke="#fff" stroke-opacity=".55" stroke-width="1.2" stroke-linecap="round"/></g></g>` +
      `<path d="${rr(121, 124, 12, 26, 6)}" fill="#000" fill-opacity=".4"/>` + glyph(x, 127, 137, 8, x.on ? GRN : "#9aa0a8");
    return scene(x, "plaster", speck(19, 90, 1), hw, glass, after);
  });

  add("office", "Office lever", NIC, (x) => {
    const E = 164;
    const lite = lg(x.id("lite"), [[0, "#c7d3df", .55], [1, "#7f8ea0", .45]], 0, 0, 1, 1);
    const tex = grain(61, 8, 190) + `<rect x="22" y="22" width="26" height="156" fill="#000" fill-opacity=".45"/><rect x="25" y="25" width="20" height="150" fill="url(#${x.u}-lite)"/><path d="M25 70L45 46V60L25 84Z" fill="#fff" fill-opacity=".25"/><rect x="25" y="25" width="20" height="150" fill="none" stroke="#3a2a1a" stroke-width="1.5"/>`;
    const sc = rr(101.5, 46.5, 23, 26, 3);
    const hw = jamb(x, E, "#d1b48c", "#8c6b45") + strike(x, E, 112, 26) + bolt(x, E, 112, 13, 9, "latch") +
      plate(x, rr(97, 40, 32, 46, 6)) + `<path d="${sc}" fill="${x.url("scr")}"/>` + pad(x, 102.5, 48, 3, ["1", "2", "3", "4", "5", "6", "7", "8", "9"], 6, 6.5, 2, 2, "touch") +
      `<rect x="103" y="77" width="20" height="3" rx="1.5" fill="${x.st}"/><rect class="${x.cls}" x="99" y="74" width="28" height="9" rx="4.5" fill="${x.url(x.hk)}"/>` +
      ring(x, 113, 112, 15.5, 1.4) + lever(x, 113, 112, 58, 13);
    return scene(x, "maple", tex, hw, lite);
  });

  add("cylinder", "Key deadbolt", BRS, (x) => {
    const E = 164, cy = 76;
    const tex = panel(20, 20, 54, 72) + panel(20, 108, 54, 74) + speck(41, 30);
    const hw = jamb(x, E) + strike(x, E, cy) + bolt(x, E, cy, 15, 9) + strike(x, E, 142, 24) + bolt(x, E, 142, 11, 7, "latch", true) +
      `${shd(x, circ(114, cy, 25), 2.5, 4)}<circle cx="114" cy="${cy}" r="25" fill="${x.url("fs")}"/><circle cx="114" cy="${cy}" r="24.4" fill="none" stroke="#fff" stroke-opacity=".3"/><circle cx="114" cy="${cy}" r="25" fill="none" stroke="${x.p.e}" stroke-width=".6"/>` +
      ring(x, 114, cy, 19.5, 1.6) + keyway(x, 114, cy, 14) +
      `${shd(x, circ(114, 142, 20), 2.5, 4)}<circle cx="114" cy="142" r="20" fill="${x.url("fs")}"/><circle cx="114" cy="142" r="20" fill="none" stroke="${x.p.e}" stroke-width=".6"/>` +
      `${shd(x, circ(114, 142, 15), 2, 6, .6)}<circle cx="114" cy="142" r="15" fill="${x.url("fs")}"/><circle cx="114" cy="142" r="15" fill="${x.url("gl")}" opacity=".4"/><path d="M104 134A13 13 0 0 1 116 128.5" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>`;
    return scene(x, "teal", tex, hw);
  });

  add("euro", "Euro cylinder", WHT, (x) => {
    const E = 164;
    const gl = lg(x.id("frost"), [[0, "#dfe6ee", .75], [1, "#9aa8b8", .65]], 0, 0, 1, 1);
    const tex = `<rect x="18" y="16" width="132" height="70" rx="3" fill="#000" fill-opacity=".18"/><rect x="22" y="20" width="124" height="62" fill="url(#${x.u}-frost)"/><path d="M22 60L62 20H86L22 84Z" fill="#fff" fill-opacity=".25"/><rect x="22" y="20" width="124" height="62" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
<rect x="22" y="104" width="124" height="70" rx="2" fill="#000" fill-opacity=".07"/><path d="M22 174V104H146" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.4"/><path d="M146 104V174H22" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4"/>`;
    let knurl = ""; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; knurl += `<path d="M${f(122 + Math.cos(a) * 12)} ${f(150 + Math.sin(a) * 12)}L${f(122 + Math.cos(a) * 15)} ${f(150 + Math.sin(a) * 15)}" stroke="#000" stroke-opacity=".35" stroke-width="1"/>`; }
    const hw = jamb(x, E, "#dde0e4", "#a6aab2") + strike(x, E, 44, 20) + bolt(x, E, 44, 12, 7, "hook") + strike(x, E, 150, 26) + bolt(x, E, 150, 15, 9) + strike(x, E, 112, 20) + bolt(x, E, 112, 10, 7, "latch", true) +
      plate(x, rr(114, 96, 16, 86, 8)) + lever(x, 122, 112, 52, 0, true) +
      `${shd(x, circ(122, 150, 16), 2.5, 5, .6)}<circle cx="122" cy="154" r="15.5" fill="${x.p.k}"/><circle cx="122" cy="150" r="15.5" fill="${x.url("fs")}"/>${knurl}<circle cx="122" cy="150" r="11" fill="${x.url("fd")}"/><circle cx="122" cy="150" r="11" fill="${x.url("gl")}" opacity=".4"/>` + led(x, 122, 150, 1.8);
    return scene(x, "upvc", tex, hw, gl);
  });

  add("cabinet", "Cabinet lock", BLK, (x) => {
    const tex = `<rect x="8" y="8" width="184" height="60" fill="#000" fill-opacity=".18"/>` + grain(13, 8, 68, false) + grain(29, 74, 192, false) +
      `<rect x="8" y="68" width="184" height="6" fill="${x.url("gap")}"/><path d="M8 74.5H192" stroke="#fff" stroke-opacity=".18"/><path d="M8 67.5H192" stroke="#fff" stroke-opacity=".1"/>`;
    const pull = `M60 158V166H140V158`;
    const hw = `<g class="hda-bg"><path d="${rr(130, 56, 20, 12, 1.5)}" fill="${x.url("stv")}"/></g>${boltUp(x, 140, 74, 12, 7)}` +
      `${shd(x, circ(100, 118, 19), 2, 4)}<circle cx="100" cy="118" r="19" fill="${x.url("fs")}"/><circle cx="100" cy="118" r="18.4" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
      `<circle cx="100" cy="118" r="13" fill="${x.url("scr")}"/>` + ring(x, 100, 118, 15.8, 1.4) + glyph(x, 100, 118, 10, x.on ? GRN : "#cfd3d8") +
      `<path d="${pull}" transform="translate(2 4)" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="5" filter="${x.url("bl")}"/><path d="${pull}" fill="none" stroke="${x.p.k}" stroke-width="5" stroke-linejoin="round"/><path d="${pull}" fill="none" stroke="${x.p.m}" stroke-width="3.4" stroke-linejoin="round"/><path d="M62 164.4H138" stroke="${x.p.l}" stroke-width="1"/>`;
    return scene(x, "oak", tex, hw);
  });

  add("parcel", "Package box", BLK, (x) => {
    let tex = `<path d="M8 104H192M100 8V104" stroke="#000" stroke-opacity=".25"/>` + speck(57, 90, .9) + `<rect x="8" y="176" width="184" height="16" fill="#000" fill-opacity=".25"/>`;
    const side = `M152 34L166 26V172L152 182Z`;
    const hw = `<ellipse cx="102" cy="183" rx="72" ry="6" fill="${x.url("sh")}"/>` +
      `<path d="${side}" fill="${x.p.k}"/><path d="M38 34L52 26H166L152 34Z" fill="${x.p.l}" fill-opacity=".85"/><path d="M38 34L52 26H166" fill="none" stroke="#fff" stroke-opacity=".4"/>` +
      plate(x, rr(38, 34, 114, 148, 3), { fill: "fv" }) +
      `<path d="M46 42H144V86H46Z" fill="#000" fill-opacity=".1"/><path d="M46 86V42H144" fill="none" stroke="#000" stroke-opacity=".35"/><path d="M144 42V86H46" fill="none" stroke="#fff" stroke-opacity=".2"/>` +
      `<path d="M70 52H120" stroke="#000" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/><path d="M70 54.5H120" stroke="#fff" stroke-opacity=".2" stroke-linecap="round"/>` +
      `<rect x="46" y="86" width="98" height="5" fill="#050508"/>` + boltUp(x, 128, 91, 9, 6) +
      `<path d="M46 91H144V174H46Z" fill="#fff" fill-opacity=".03"/><path d="M144 91V174H46" fill="none" stroke="#000" stroke-opacity=".35"/><path d="M46 174V91" stroke="#fff" stroke-opacity=".2"/>` +
      `<path d="${rr(74, 100, 44, 52, 5)}" fill="${x.url("scr")}"/>` + pad(x, 78, 104, 3, N12, 10, 8, 3, 3.6, "touch") + led(x, 96, 146, 1.5) +
      `<path d="${rr(78, 160, 36, 6, 3)}" fill="#000" fill-opacity=".55"/><path d="M80 165.5H112" stroke="#fff" stroke-opacity=".2"/>`;
    return scene(x, "concrete", tex, hw);
  });

  add("safe", "Safe keypad", NIC, (x) => {
    const body = lg(x.id("sb"), [[0, "#4a4e57"], [.5, "#30333a"], [1, "#1c1e23"]], 0, 0, 1, 1) + lg(x.id("sd"), [[0, "#5a5f69"], [.5, "#3c4048"], [1, "#2a2d33"]], 0, 0, 1, 1);
    const E = 156; x.keepBolt = 1;
    let spokes = ""; [0, 120, 240].forEach((a) => { spokes += `<g transform="rotate(${a} 82 144)"><path d="${rr(79.5, 120, 5, 22, 2.5)}" fill="${x.url("f")}"/><circle cx="82" cy="119" r="4.6" fill="${x.url("fs")}"/></g>`; });
    const hw = `<ellipse cx="100" cy="188" rx="84" ry="5" fill="${x.url("sh")}"/>` + `${shd(x, rr(16, 14, 168, 172, 10), 3, 5)}<path d="${rr(16, 14, 168, 172, 10)}" fill="url(#${x.u}-sb)"/><path d="${rr(16, 14, 168, 172, 10)}" fill="none" stroke="#fff" stroke-opacity=".12"/>` +
      `<path d="${rr(26, 24, 148, 152, 6)}" fill="#0c0d10"/>` +
      bolt(x, E, 58, 14, 10) + bolt(x, E, 100, 14, 10) + bolt(x, E, 142, 14, 10) +
      `${shd(x, rr(28, 26, E - 28, 148, 5), 2, 3)}<path d="${rr(28, 26, E - 28, 148, 5)}" fill="url(#${x.u}-sd)"/><path d="${rr(28, 26, E - 28, 148, 5)}" fill="none" stroke="#fff" stroke-opacity=".18"/>` +
      `<path d="${rr(36, 34, E - 44, 132, 3)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><path d="${rr(37, 35, E - 44, 132, 3)}" fill="none" stroke="#fff" stroke-opacity=".08"/>` +
      `<rect x="22" y="44" width="8" height="24" rx="3" fill="${x.url("stl")}"/><rect x="22" y="132" width="8" height="24" rx="3" fill="${x.url("stl")}"/>` +
      plate(x, rr(56, 40, 74, 66, 8)) + `<path d="${rr(62, 46, 62, 48, 4)}" fill="#000" fill-opacity=".3"/>` + pad(x, 64.5, 48, 4, N12, 12, 9, 2.5, 3, "btn") + led(x, 93, 100, 1.6) +
      `${shd(x, circ(82, 144, 24), 2, 4)}${spokes}<circle cx="82" cy="144" r="10" fill="${x.url("fs")}"/><circle cx="82" cy="144" r="10" fill="none" stroke="${x.p.e}" stroke-width=".7"/><circle cx="79" cy="141" r="3" fill="#fff" fill-opacity=".3"/>` +
      `<g class="${x.cls}"><rect x="112" y="136" width="26" height="16" rx="3" fill="${x.url(x.hk)}"/></g><path d="${rr(114, 139, 22, 10, 2)}" fill="${x.url("scr")}"/>` + glyph(x, 125, 144.5, 7);
    return scene(x, "gunwall", "", hw, body);
  });

  add("shed", "Shed padlock", BLK, (x) => {
    let tex = ""; const r = rnd(33);
    for (let bx = 8; bx < 192; bx += 26) tex += `<rect x="${bx}" y="8" width="26" height="184" fill="${r() > .5 ? "#fff" : "#000"}" fill-opacity="${(.02 + r() * .06).toFixed(2)}"/><path d="M${bx} 8V192" stroke="#1a0b06" stroke-opacity=".7" stroke-width="2"/>`;
    tex += grain(77, 8, 190);
    const lift = -10 * (1 - x.fr), shk = `M101 118V90A12 12 0 0 1 125 90V118`;
    const hasp = lg(x.id("galv"), [[0, "#c9ced3"], [.5, "#8d949b"], [1, "#5a6067"]], 0, 0, 0, 1);
    const hw = `${shd(x, rr(30, 74, 84, 22, 3))}<path d="${rr(30, 74, 84, 22, 3)}" fill="url(#${x.u}-galv)"/><path d="M30 74.6H114" stroke="#fff" stroke-opacity=".5"/><rect x="26" y="72" width="8" height="26" rx="3" fill="url(#${x.u}-galv)"/>` + screw(44, 85) + screw(64, 85) +
      `<path d="${rr(102, 70, 22, 30, 3)}" fill="#000" fill-opacity=".35"/><path d="${rr(104, 68, 18, 30, 3)}" fill="url(#${x.u}-galv)"/><rect x="109" y="74" width="8" height="12" rx="3.5" fill="#0a0a0d"/>` +
      `<g transform="translate(0 ${lift})"><g class="${mcls(x, "sl", "su", "msl", "msu", "jy")}"><path d="${shk}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="9" transform="translate(2 3)"/><path d="${shk}" fill="none" stroke="#4c5259" stroke-width="9"/><path d="${shk}" fill="none" stroke="#d3d8dd" stroke-width="5"/><path d="M99.5 114V90A13.5 13.5 0 0 1 106 79" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.3"/></g></g>` +
      `${shd(x, rr(84, 110, 58, 66, 10), 3, 5, .6)}<path d="${rr(84, 110, 58, 66, 10)}" fill="${x.url("rub")}"/>` +
      `<path d="${rr(90, 114, 46, 58, 7)}" fill="${x.url("fv")}"/><path d="${rr(90, 114, 46, 58, 7)}" fill="${x.url("fx")}"/><path d="${rr(90, 114, 46, 58, 7)}" fill="${x.url("gl")}" opacity=".3"/><path d="${rr(90, 114, 46, 58, 7)}" fill="none" stroke="${x.p.e}" stroke-width=".7"/>` +
      fingerprint(x, 113, 136, 9) + ring(x, 113, 136, 11, 1.4) + led(x, 113, 160, 1.6) + `<path d="M86 122V164M140 122V164" stroke="#fff" stroke-opacity=".1" stroke-width="1.4"/>`;
    return scene(x, "barn", tex, hw, hasp);
  });

  add("strike", "Electric strike", NIC, (x) => {
    const Dn = 92;
    const fr = lg(x.id("casing"), [[0, "#3c2a1c"], [.1, "#c79a6c"], [.5, "#a77c52"], [1, "#6b4a2e"]]);
    const after = `<rect x="${Dn}" y="0" width="6" height="200" fill="${x.url("gap")}"/><rect x="98" y="0" width="54" height="200" fill="url(#${x.u}-casing)"/>${grain(15, 100, 150, true)}
<rect x="152" y="0" width="14" height="200" fill="url(#${x.u}-casing)"/><path d="M152 0V200" stroke="#000" stroke-opacity=".4" stroke-width="1.4"/><rect x="166" y="0" width="34" height="200" fill="#4c4652"/>${speck(3, 20, .6)}<path d="M166 0V200" stroke="#000" stroke-opacity=".45" stroke-width="2"/>`;
    const keeper = `<path d="${rr(105, 88, 12, 30, 1.5)}" fill="${x.url("fd")}"/><path d="M105.5 88.5H116.5" stroke="#fff" stroke-opacity=".45"/><path d="${rr(105, 88, 12, 30, 1.5)}" fill="none" stroke="${x.p.e}" stroke-width=".6"/>`;
    const hw = plate(x, rr(102, 50, 22, 106, 3)) + screw(113, 57) + screw(113, 149) +
      `<path d="${rr(104, 86, 15, 34, 1.5)}" fill="#050508"/>` +
      `<g transform="translate(${7 * (1 - x.fr)} 0)"><g class="${mcls(x, "kl", "ku", "mkl", "mku", "jx")}">${keeper}</g></g>` + arrows(x, 111, 80, x.mv > 0 ? "l" : "r") +
      `<path d="M${Dn - 2} 97H108L112 103H${Dn - 2}Z" fill="${x.url("bolt")}"/><path d="M108 97L112 103" stroke="#fff" stroke-opacity=".5"/>` +
      plate(x, rr(170, 72, 18, 50, 5), { fill: "fv" }) + led(x, 179, 82, 1.6) +
      `<path d="M174 100a7 7 0 0 1 10 0M176 104a4 4 0 0 1 6 0" fill="none" stroke="${x.on ? KEY : "#8b93a0"}" stroke-width="1.1" stroke-linecap="round" stroke-opacity="${x.on ? .9 : .5}"/><circle cx="179" cy="108" r="1" fill="${x.on ? KEY : "#8b93a0"}"/>` +
      lever(x, 72, 104, 46, 11);
    return scene(x, "gray", speck(8, 50, .5), hw, fr, after);
  });

  add("card", "Card key lock", BRS, (x) => {
    const E = 164;
    const tex = grain(91, 8, 190, true) + `<rect x="8" y="8" width="184" height="184" fill="url(#${x.u}-sheen)"/>`;
    const sheen = lg(x.id("sheen"), [[0, "#fff", .1], [.4, "#fff", 0], [.6, "#fff", .04], [1, "#fff", 0]], 0, 0, 1, 1);
    const rd = rr(106.5, 38.5, 25, 44, 6);
    const arcs = (c, op) => `<g fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="1.4" stroke-linecap="round"><path d="M114 52a7 7 0 0 1 0 10"/><path d="M118 49a11 11 0 0 1 0 16"/><path d="M122 46a15 15 0 0 1 0 22"/></g><circle cx="110" cy="57" r="1.6" fill="${c}" fill-opacity="${op}"/>`;
    const hw = jamb(x, E, "#6a4c38", "#2e1f16") + strike(x, E, 114, 22) + bolt(x, E, 114, 10, 7, "latch", true) + strike(x, E, 150) + bolt(x, E, 150, 15, 9) +
      `<g class="hda-bg">${plate(x, rr(42, 28, 38, 18, 3)) + tx(61, 37, 10, x.p.k, "214")}</g>` +
      plate(x, rr(102, 28, 34, 150, 10)) + `<path d="${rd}" fill="${x.url("scr")}"/>` + (x.on ? `<g class="${P}pulse">${arcs(KEY, f(.5 + .5 * x.B))}</g>` : arcs("#8b93a0", .35)) +
      `<g class="${x.cls}"><rect x="104" y="86" width="30" height="10" rx="5" fill="${x.url(x.hk)}"/></g><rect x="108" y="89.5" width="22" height="3" rx="1.5" fill="${x.st}"/>` +
      lever(x, 119, 114, 58, 0, true) + `<path d="${rr(113, 144, 12, 14, 6)}" fill="#000" fill-opacity=".35"/><path d="${rr(114, 144, 10, 12, 5)}" fill="${x.url("f")}"/><path d="M119 147v6" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/>`;
    return scene(x, "veneer", tex, hw, sheen);
  });

  const css = `
.hda-lock-bo,.hda-lock-bi,.hda-lock-buo,.hda-lock-bui,.hda-lock-rl,.hda-lock-ru{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-lock-bo{animation:hda-lock-bo .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-lock-bo{from{transform:translateX(-100%)}to{transform:translateX(0)}}
.hda-anim .hda-lock-bi{animation:hda-lock-bi .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-lock-bi{from{transform:translateX(100%)}to{transform:translateX(0)}}
.hda-anim .hda-lock-buo{animation:hda-lock-buo .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-lock-buo{from{transform:translateY(100%)}to{transform:translateY(0)}}
.hda-anim .hda-lock-bui{animation:hda-lock-bui .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-lock-bui{from{transform:translateY(-100%)}to{transform:translateY(0)}}
.hda-anim .hda-lock-rl{animation:hda-lock-rl .8s cubic-bezier(.5,0,.2,1) .2s both}
@keyframes hda-lock-rl{from{transform:rotate(-90deg)}to{transform:rotate(0)}}
.hda-anim .hda-lock-ru{animation:hda-lock-ru .8s cubic-bezier(.5,0,.2,1) .2s both}
@keyframes hda-lock-ru{from{transform:rotate(90deg)}to{transform:rotate(0)}}
.hda-anim .hda-lock-sl{animation:hda-lock-sl .6s cubic-bezier(.5,0,.3,1.3) .25s both}
@keyframes hda-lock-sl{from{transform:translateY(-10px)}to{transform:translateY(0)}}
.hda-anim .hda-lock-su{animation:hda-lock-su .6s cubic-bezier(.5,0,.3,1.3) .25s both}
@keyframes hda-lock-su{from{transform:translateY(10px)}to{transform:translateY(0)}}
.hda-anim .hda-lock-tl{animation:hda-lock-tl .5s ease-out .25s both}
@keyframes hda-lock-tl{from{transform:translateY(-16px)}to{transform:translateY(0)}}
.hda-anim .hda-lock-tu{animation:hda-lock-tu .5s ease-out .25s both}
@keyframes hda-lock-tu{from{transform:translateY(16px)}to{transform:translateY(0)}}
.hda-anim .hda-lock-gl{animation:hda-lock-gl 1.4s ease-in-out .2s both}
@keyframes hda-lock-gl{from{transform:translateY(-20px)}to{transform:translateY(0)}}
.hda-anim .hda-lock-gu{animation:hda-lock-gu 1.4s ease-in-out .2s both}
@keyframes hda-lock-gu{from{transform:translateY(20px)}to{transform:translateY(0)}}
.hda-anim .hda-lock-kl{animation:hda-lock-kl .5s ease-out .3s both}
@keyframes hda-lock-kl{from{transform:translateX(7px)}to{transform:translateX(0)}}
.hda-anim .hda-lock-ku{animation:hda-lock-ku .5s ease-out .3s both}
@keyframes hda-lock-ku{from{transform:translateX(-7px)}to{transform:translateX(0)}}
.hda-anim .hda-lock-pulse{animation:hda-lock-pulse 3.2s ease-in-out infinite}
@keyframes hda-lock-pulse{0%,100%{opacity:1}50%{opacity:.55}}
.hda-anim .hda-lock-breath{animation:hda-lock-breath 2.8s ease-in-out infinite}
@keyframes hda-lock-breath{0%,100%{opacity:1}50%{opacity:.4}}
.hda-lock-mxo,.hda-lock-mxi,.hda-lock-jx,.hda-lock-myo,.hda-lock-myi,.hda-lock-jy,.hda-lock-mrl,.hda-lock-mru,.hda-lock-jr,.hda-lock-spin,.hda-lock-spinr{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-lock-mxo{animation:hda-lock-mxo 1.8s ease-in-out infinite}
@keyframes hda-lock-mxo{0%{transform:translateX(-50%)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-lock-mxi{animation:hda-lock-mxi 1.8s ease-in-out infinite}
@keyframes hda-lock-mxi{0%{transform:translateX(50%)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-lock-myo{animation:hda-lock-myo 1.8s ease-in-out infinite}
@keyframes hda-lock-myo{0%{transform:translateY(50%)}65%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-myi{animation:hda-lock-myi 1.8s ease-in-out infinite}
@keyframes hda-lock-myi{0%{transform:translateY(-50%)}65%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-mrl{animation:hda-lock-mrl 1.8s ease-in-out infinite}
@keyframes hda-lock-mrl{0%{transform:rotate(-45deg)}65%,100%{transform:rotate(0)}}
.hda-anim .hda-lock-mru{animation:hda-lock-mru 1.8s ease-in-out infinite}
@keyframes hda-lock-mru{0%{transform:rotate(45deg)}65%,100%{transform:rotate(0)}}
.hda-anim .hda-lock-msl{animation:hda-lock-msl 1.8s ease-in-out infinite}
@keyframes hda-lock-msl{0%{transform:translateY(-5px)}65%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-msu{animation:hda-lock-msu 1.8s ease-in-out infinite}
@keyframes hda-lock-msu{0%{transform:translateY(5px)}65%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-mgl{animation:hda-lock-mgl 2.4s ease-in-out infinite}
@keyframes hda-lock-mgl{0%{transform:translateY(-10px)}70%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-mgu{animation:hda-lock-mgu 2.4s ease-in-out infinite}
@keyframes hda-lock-mgu{0%{transform:translateY(10px)}70%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-mtl{animation:hda-lock-mtl 1.8s ease-in-out infinite}
@keyframes hda-lock-mtl{0%{transform:translateY(-8px)}65%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-mtu{animation:hda-lock-mtu 1.8s ease-in-out infinite}
@keyframes hda-lock-mtu{0%{transform:translateY(8px)}65%,100%{transform:translateY(0)}}
.hda-anim .hda-lock-mkl{animation:hda-lock-mkl 1.8s ease-in-out infinite}
@keyframes hda-lock-mkl{0%{transform:translateX(3.5px)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-lock-mku{animation:hda-lock-mku 1.8s ease-in-out infinite}
@keyframes hda-lock-mku{0%{transform:translateX(-3.5px)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-lock-jx{animation:hda-lock-jx 2.2s linear infinite}
@keyframes hda-lock-jx{0%,40%,100%{transform:translateX(0)}8%,24%{transform:translateX(1.2px)}16%,32%{transform:translateX(-1.2px)}}
.hda-anim .hda-lock-jy{animation:hda-lock-jy 2.2s linear infinite}
@keyframes hda-lock-jy{0%,40%,100%{transform:translateY(0)}8%,24%{transform:translateY(1.2px)}16%,32%{transform:translateY(-1.2px)}}
.hda-anim .hda-lock-jr{animation:hda-lock-jr 2.2s linear infinite}
@keyframes hda-lock-jr{0%,40%,100%{transform:rotate(0)}8%,24%{transform:rotate(4deg)}16%,32%{transform:rotate(-4deg)}}
.hda-anim .hda-lock-mblink{animation:hda-lock-mblink .9s steps(1,end) infinite}
@keyframes hda-lock-mblink{0%,55%{opacity:1}56%,100%{opacity:.2}}
.hda-anim .hda-lock-jblink{animation:hda-lock-jblink .5s steps(1,end) infinite}
@keyframes hda-lock-jblink{0%,50%{opacity:1}51%,100%{opacity:.25}}
.hda-anim .hda-lock-chev0,.hda-anim .hda-lock-chev1,.hda-anim .hda-lock-chev2{animation:hda-lock-chev 1.2s ease-in-out infinite}
.hda-anim .hda-lock-chev1{animation-delay:.2s}.hda-anim .hda-lock-chev2{animation-delay:.4s}
@keyframes hda-lock-chev{0%,100%{opacity:.25}35%{opacity:1}}
.hda-anim .hda-lock-spin{animation:hda-lock-spin 1.4s linear infinite}
@keyframes hda-lock-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.hda-anim .hda-lock-spinr{animation:hda-lock-spinr 1.4s linear infinite}
@keyframes hda-lock-spinr{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-lock-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "lock",
    tab: "Smart locks",
    group: "More",
    kind: "device",
    intro: "Twenty smart locks, each on its own bit of door, gate or frame. On means LOCKED: the bolt slides out into the strike, the status light turns green and keypads light up; off means UNLOCKED: bolt pulled back, red light. The State menu also shows Locking and Unlocking (bolt part-way, amber light blinking, arrows) and Jammed (bolt stuck half out, red warning light and badge). The slider sets keypad brightness; the color is the hardware finish.",
    css,
    icons,
  });
})();
