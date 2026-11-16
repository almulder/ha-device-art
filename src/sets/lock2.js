(function () {
  const P = "hda-lock2-";
  const H = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const GRN = "#3ee08f", RED = "#ff5a5f", LIT = "#eef5ff";

  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  const BS = "#2b2a2c", SN = "#a8aaa9", ORB = "#3a2a20", PB = "#d4af55", SNOW = "#e6e9e6", MBK = "#303235", ASH = "#8e95a0", SIL = "#b8bbbe";
  const MODE = {}; [[BS, "matte"], [MBK, "matte"], [SN, "satin"], [SIL, "satin"], [ORB, "bronze"], [PB, "polish"], [SNOW, "plastic"], [ASH, "plastic"]].forEach(([c, m]) => MODE[c] = m);
  function metal(c) {
    const s = H().shade, m = MODE[c.toLowerCase()] || "satin";
    if (m === "polish") return { m, c, k: s(c, -.72), d: s(c, -.42), l: s(c, .55), hi: "#ffffff", rim: "#ffffff" };
    if (m === "matte") return { m, c, k: s(c, -.55), d: s(c, -.22), l: s(c, .18), hi: s(c, .32), rim: s(c, .3) };
    if (m === "bronze") return { m, c, k: "#170f0a", d: s(c, -.38), l: s(c, .14), hi: "#c38652", rim: "#a86d43" };
    if (m === "plastic") return { m, c, k: s(c, -.45), d: s(c, -.18), l: s(c, .3), hi: s(c, .6), rim: s(c, .5) };
    return { m, c, k: s(c, -.6), d: s(c, -.32), l: s(c, .42), hi: s(c, .72), rim: s(c, .6) };
  }
  const AMB = "#ffb020", JAM = "#ff3b30";
  const LSTATE = [["auto", "From on/off"], ["locked", "Locked"], ["unlocked", "Unlocked"], ["locking", "Locking"], ["unlocking", "Unlocking"], ["jammed", "Jammed"]];
  function lockState(o) {
    const s = o.opt && o.opt.state, ls = s && s !== "auto" ? s : (o.on ? "locked" : "unlocked");
    const mv = ls === "locking" ? 1 : ls === "unlocking" ? -1 : 0, jam = ls === "jammed", on = ls !== "unlocked";
    return { ls, on, mv, jam, mid: !!mv || jam, fr: ls === "locked" ? 1 : ls === "unlocked" ? 0 : .5,
      st: jam ? JAM : mv ? AMB : on ? GRN : RED, hk: jam ? "hj" : mv ? "ha" : on ? "hg" : "hr", cls: P + (jam ? "jblink" : mv ? "mblink" : on ? "breath" : "blink") };
  }
  const stDefs = (x) => x.mid ? rg(x.id("ha"), [[0, AMB, .85], [.45, AMB, .28], [1, AMB, 0]]) + rg(x.id("hj"), [[0, JAM, .9], [.45, JAM, .32], [1, JAM, 0]]) : "";
  function arrows(x, cx, cy, dir) {
    if (!x.mv) return "";
    let s = ""; for (let i = 0; i < 3; i++) s += `<path class="${P}chev${i}" d="M${f(-4.6 + i * 3.4)} -2.8L${f(-1.8 + i * 3.4)} 0L${f(-4.6 + i * 3.4)} 2.8"/>`;
    const t = `translate(${f(cx)} ${f(cy)}) rotate(${dir === "l" ? 180 : 0})`;
    return `<g transform="${t}" fill="none" stroke="#000" stroke-opacity=".55" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${s.replace(/ class="[^"]*"/g, "")}</g><g transform="${t}" fill="none" stroke="${AMB}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${s}</g>`;
  }
  function mark(x, cx, cy, s) {
    if (x.jam) return `<g class="${P}jblink"><path d="M${f(cx)} ${f(cy - s * .48)}L${f(cx + s * .52)} ${f(cy + s * .42)}H${f(cx - s * .52)}Z" fill="${JAM}" stroke="${JAM}" stroke-width="${f(s * .1)}" stroke-linejoin="round"/></g>` +
      `<path d="M${f(cx)} ${f(cy - s * .16)}V${f(cy + s * .1)}" stroke="#fff" stroke-width="${f(s * .11)}" stroke-linecap="round"/><circle cx="${f(cx)}" cy="${f(cy + s * .26)}" r="${f(s * .065)}" fill="#fff"/>`;
    const r = s * .36, cw = x.mv > 0, a0 = -Math.PI / 2 + (cw ? .5 : -.5), a1 = a0 + (cw ? 1 : -1) * Math.PI * 1.45;
    const ex = cx + r * Math.cos(a1), ey = cy + r * Math.sin(a1), tx2 = -Math.sin(a1) * (cw ? 1 : -1), ty2 = Math.cos(a1) * (cw ? 1 : -1), hs = s * .2;
    const head = `M${f(ex + tx2 * hs)} ${f(ey + ty2 * hs)}L${f(ex - ty2 * hs * .9)} ${f(ey + tx2 * hs * .9)}L${f(ex + ty2 * hs * .9)} ${f(ey - tx2 * hs * .9)}Z`;
    return `<g class="${P}${cw ? "spin" : "spinr"}"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * .5)}" fill="none"/><path d="M${f(cx + r * Math.cos(a0))} ${f(cy + r * Math.sin(a0))}A${f(r)} ${f(r)} 0 1 ${cw ? 1 : 0} ${f(ex)} ${f(ey)}" fill="none" stroke="${AMB}" stroke-width="${f(s * .11)}" stroke-linecap="round"/><path d="${head}" fill="${AMB}"/></g>`;
  }
  const markDisc = (x, cx, cy, r) => x.mid ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#141418"/>${mark(x, cx, cy, r * 1.7)}` : "";
  const badge = (x) => x.jam ? `<g class="${P}badge"><circle cx="26" cy="26" r="11" fill="#000" fill-opacity=".45" transform="translate(1 1.6)"/><circle cx="26" cy="26" r="11" fill="#1c1416"/><circle cx="26" cy="26" r="10.3" fill="none" stroke="${JAM}" stroke-width="1.3"/>` +
    `<path d="M26 19.2L32.4 30.6H19.6Z" fill="${AMB}" stroke="${AMB}" stroke-width="1.2" stroke-linejoin="round"/><path d="M26 23.2V27" stroke="#1c1416" stroke-width="1.6" stroke-linecap="round"/><circle cx="26" cy="29" r=".95" fill="#1c1416"/></g>` : "";
  function ctx(o) {
    const u = o.uid, S = lockState(o), on = S.on, lv = o.level == null ? 1 : o.level, p = metal(o.color || BS);
    const light = p.m === "satin" || p.m === "polish" || p.m === "plastic";
    const glass = light ? H().shade(p.c, p.m === "plastic" ? -.12 : -.42) : (p.m === "bronze" ? "#120c09" : "#0c0c0e");
    return Object.assign({ o, u, on, B: .4 + .6 * lv, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, p, light, glass, n: 0 }, S);
  }

  function defs(x, extra) {
    const p = x.p, id = x.id, face = {
      polish: [[0, p.k], [.06, p.l], [.18, p.hi], [.3, p.c], [.48, p.d], [.6, p.c], [.8, p.hi], [.93, p.d], [1, p.k]],
      matte: [[0, p.k], [.08, p.d], [.35, p.l], [.65, p.c], [.92, p.d], [1, p.k]],
      bronze: [[0, p.k], [.035, p.hi], [.1, p.d], [.32, p.c], [.5, p.l], [.72, p.c], [.9, p.d], [.965, p.hi], [1, p.k]],
      plastic: [[0, p.d], [.12, p.c], [.4, p.l], [.7, p.c], [.92, p.d], [1, p.k]],
      satin: [[0, p.k], [.08, p.d], [.24, p.l], [.5, p.c], [.78, H().shade(p.c, -.08)], [.92, p.d], [1, p.k]],
    }[p.m];
    const g = x.glass;
    return `<defs>
${lg(id("m"), face)}
${lg(id("mv"), [[0, "#fff", p.m === "polish" ? .3 : .18], [.3, "#fff", 0], [.72, "#000", 0], [1, "#000", .3]], 0, 0, 0, 1)}
${lg(id("mr"), [[0, p.rim], [.45, p.c], [1, p.k]], 0, 0, 1, 1)}
${rg(id("ms"), [[0, p.hi], [.35, p.l], [.75, p.c], [1, p.d]], .36, .3, .8)}
${lg(id("scr"), [[0, H().shade(g, .12)], [.5, g], [1, H().shade(g, -.3)]], 0, 0, 0, 1)}
${lg(id("gl"), [[0, "#fff", .3], [.4, "#fff", .04], [.41, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("bolt"), [[0, "#f3f5f7"], [.42, "#aeb5bd"], [.56, "#cfd5db"], [1, "#565d65"]], 0, 0, 0, 1)}
${lg(id("stv"), [[0, "#e2e6ea"], [.5, "#9aa1a9"], [1, "#5a6067"]], 0, 0, 0, 1)}
${lg(id("gap"), [[0, "#000", .9], [1, "#14121c", .9]])}
${rg(id("hg"), [[0, GRN, .9], [.45, GRN, .3], [1, GRN, 0]])}
${rg(id("hr"), [[0, RED, .8], [.45, RED, .25], [1, RED, 0]])}${stDefs(x)}
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .06], [1, "#000", .5]], .5, .48, .74)}
${p.m === "satin" || p.m === "bronze" ? `<pattern id="${id("br")}" width="2.6" height="40" patternUnits="userSpaceOnUse"><path d="M.6 0V40" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/><path d="M1.9 0V40" stroke="#000" stroke-opacity=".07" stroke-width=".4"/></pattern>` : ""}
${p.m === "matte" ? `<pattern id="${id("br")}" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="#fff" fill-opacity=".05"/><circle cx="2.3" cy="2.2" r=".4" fill="#000" fill-opacity=".12"/></pattern>` : ""}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="${id("gw")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.3"/></filter>
${extra || ""}</defs>`;
  }
  const tex = (x) => x.p.m === "plastic" || x.p.m === "polish" ? "" : `fill="${x.url("br")}"`;

  const DOOR = {
    blue: ["#3d6688", "#244259"], white: ["#c9ccd2", "#9ca1aa"], oak: ["#a9784a", "#714828"], gray: ["#56606c", "#363d47"],
    green: ["#2f4a3a", "#1a2c22"], red: ["#8a2f37", "#561821"], sage: ["#6b7a62", "#45523e"], navy: ["#2d3c5e", "#19223a"],
    walnut: ["#5e3e28", "#362213"], black: ["#2c2d33", "#17181c"], teal: ["#2f6266", "#1a3d40"], cream: ["#cfc4ae", "#a59a83"],
    maple: ["#c09868", "#8e6a42"], slate: ["#4a5465", "#2c333f"], yellow: ["#c9a94a", "#94782a"], plum: ["#5a3550", "#341d2e"],
    glassdoor: ["#2a3640", "#151c22"], cedar: ["#a06e46", "#6a4529"],
  };
  function grain(seed) {
    const r = rnd(seed); let s = "";
    for (let a = 8; a < 192; a += 7 + r() * 8) { const w = 1.5 + r() * 3; s += `<path d="M${f(a)} 8C${f(a + w)} 60 ${f(a - w)} 130 ${f(a + w * .5)} 192" fill="none" stroke="#1d0f06" stroke-opacity="${(.1 + r() * .16).toFixed(2)}" stroke-width="${(.5 + r() * .9).toFixed(1)}"/>`; }
    return s;
  }
  const speck = (seed, n) => { const r = rnd(seed); let s = ""; for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * .7)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`; return s; };
  const panel = (x, y, w, h) => `<path d="M${x} ${y + h}V${y}H${x + w}" fill="none" stroke="#000" stroke-opacity=".32" stroke-width="1.6"/><path d="M${x + w} ${y}V${y + h}H${x}" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="1.6"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="#fff" fill-opacity=".04"/>`;
  const PANELS = (seed) => panel(14, 18, 26, 74) + panel(14, 110, 26, 74) + speck(seed, 30);
  const WOOD = (seed) => grain(seed) + speck(seed + 1, 16);
  const LITE = (seed) => `<rect x="16" y="16" width="22" height="168" fill="#9fb6c8" fill-opacity=".25"/><path d="M16 16H38V184H16Z" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.5"/><path d="M20 30L34 20M20 60L34 40" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>` + speck(seed, 24);
  function scene(x, kind, t, hw) {
    const c = DOOR[kind];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, lg(x.id("dg"), [[0, c[0]], [1, c[1]]], 0, 0, .3, 1))}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("dg")}"/>${t || ""}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${hw}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g>${badge(x)}</svg>`;
  }
  const E = 164;
  function jamb(x) {
    const g = x.id("jb");
    return `<defs>${lg(g, [[0, "#7f848c"], [.12, "#cfd2d7"], [.5, "#aeb2b9"], [1, "#7f848c"]])}</defs>
<rect x="${E}" y="0" width="5" height="200" fill="${x.url("gap")}"/><rect x="${E + 5}" y="0" width="${195 - E}" height="200" fill="url(#${g})"/>
<path d="M${E + 5.5} 0V200" stroke="#fff" stroke-opacity=".25"/><path d="M${E + 16} 0V200" stroke="#000" stroke-opacity=".28" stroke-width="1.4"/>`;
  }
  function strike(x, y, h) {
    h = h || 30;
    return `<path d="${rr(E + 5, y - h / 2, 12, h, 1.5)}" fill="${x.url("stv")}"/><path d="${rr(E + 5, y - h / 2, 12, h, 1.5)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>
<circle cx="${E + 11}" cy="${y - h / 2 + 3.5}" r="1.4" fill="#4b5158"/><circle cx="${E + 11}" cy="${y + h / 2 - 3.5}" r="1.4" fill="#4b5158"/><rect x="${E + 5}" y="${f(y - 6)}" width="9" height="12" rx="1" fill="#050508"/>`;
  }
  function bolt(x, y, latch) {
    const k = x.id("bc" + (x.n++)), fr = latch ? 1 : x.fr, out = fr >= 1, L = latch ? 12 : 15, h = latch ? 9 : 10, y0 = y - h / 2;
    const body = latch ? `<path d="M${E - 2} ${f(y0)}H${E + L - 5}L${E + L} ${f(y + h / 2)}H${E - 2}Z" fill="${x.url("bolt")}"/>`
      : `<path d="${rr(E - 2, y0, L + 2, h, 1.6)}" fill="${x.url("bolt")}"/><path d="M${E} ${f(y0 + .9)}H${E + L - 1.5}" stroke="#fff" stroke-opacity=".7" stroke-width=".9"/>`;
    const cls = latch ? "" : ` class="${P}${x.mid ? (x.jam ? "jx" : x.mv > 0 ? "mxo" : "mxi") : out ? "bo" : "bi"}"`;
    return `<clipPath id="${k}"><rect x="${E}" y="0" width="${200 - E}" height="200"/></clipPath><g clip-path="url(#${k})"><g${out ? "" : ` transform="translate(${fr ? f(-(L + 3) * (1 - fr)) : -L - 3} 0)"`}><g${cls}>${body}</g></g></g>` + (latch ? "" : arrows(x, E + 11, y - h / 2 - 8, x.mv > 0 ? "r" : "l"));
  }
  const edge = (x, y, latch) => `<g class="hda-bg">${jamb(x) + strike(x, y, latch ? 26 : 30)}</g>${bolt(x, y, latch)}`;

  const DG = [
    "M3 0C1.3 0 .5 2.2 .5 5S1.3 10 3 10 5.5 7.8 5.5 5 4.7 0 3 0Z", "M1.5 1.9L3.4 .2V10",
    "M.8 2.4C1.2.8 2.2 0 3.2 0 4.6 0 5.4 1 5.4 2.4 5.4 4.4 2.6 6.6.6 10H5.6",
    "M.9 1.2C1.6.4 2.4 0 3.2 0 4.6 0 5.3.9 5.3 2.3 5.3 3.8 4.2 4.7 2.6 4.8 4.4 4.8 5.6 6 5.6 7.4 5.6 9 4.4 10 2.9 10 1.9 10 1.1 9.6.5 8.8",
    "M4.2 10V0L.3 7H5.8", "M5 0H1.4L.9 4.4C1.6 3.9 2.3 3.7 3 3.7 4.6 3.7 5.6 4.9 5.6 6.8 5.6 8.8 4.4 10 2.8 10 1.8 10 1 9.6.5 9",
    "M4.9.6C4.4.2 3.8 0 3.2 0 1.4 0 .4 2.2.4 5.6.4 8.6 1.4 10 3 10 4.6 10 5.6 8.8 5.6 7 5.6 5.2 4.6 4.1 3.1 4.1 1.9 4.1 1 4.8.5 6",
    "M.4 0H5.6L2.2 10", "M3 4.7C1.6 4.7.8 3.8.8 2.4.8 1 1.7 0 3 0S5.2 1 5.2 2.4C5.2 3.8 4.4 4.7 3 4.7ZM3 4.7C1.4 4.7.4 5.8.4 7.3.4 8.9 1.5 10 3 10S5.6 8.9 5.6 7.3C5.6 5.8 4.6 4.7 3 4.7Z",
    "M1.1 9.4C1.6 9.8 2.2 10 2.8 10 4.6 10 5.6 7.8 5.6 4.4 5.6 1.4 4.6 0 3 0 1.4 0 .4 1.2.4 3 .4 4.8 1.4 5.9 2.9 5.9 4.1 5.9 5 5.2 5.5 4",
  ];
  function dig(n, cx, cy, s, col, op, w) {
    const k = s / 10;
    return `<g transform="translate(${f(cx - 3 * k)} ${f(cy - 5 * k)}) scale(${k.toFixed(3)})" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${((w || 1) / k).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"><path d="${DG[n]}"/></g>`;
  }
  const check = (cx, cy, s, c, op) => `<path d="M${f(cx - s * .42)} ${f(cy + s * .02)}l${f(s * .28)} ${f(s * .3)}l${f(s * .56)} ${f(-s * .62)}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(Math.max(.9, s * .12))}" stroke-linecap="round" stroke-linejoin="round"/>`;
  function gear(cx, cy, s, c, op) {
    let t = ""; const R = s * .55, r = s * .3;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; t += `<rect x="${f(cx - s * .09)}" y="${f(cy - R)}" width="${f(s * .22)}" height="${f(s * .26)}" transform="rotate(${i * 45} ${f(cx)} ${f(cy)})"/>`; void a; }
    return `<g fill="${c}" fill-opacity="${op}">${t}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(s * .17)}"/>`;
  }
  const halo = (x, cx, cy, r, g) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url(g ? "hg" : "hr")}"/>`;

  function keypad(x, cx, y0, gx, gy, s, style, order, opt) {
    opt = opt || {};
    const on = x.on, B = x.B, glassy = style === "ring" || style === "bare";
    const dark = !x.light || glassy;
    const col = on ? LIT : (dark ? "#ffffff" : "#ffffff"), op = on ? f(.7 + .3 * B) : (glassy ? (opt.hide ? 0 : .55) : .85);
    let s1 = "", glow = "", btn = "";
    const R = s * .95;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) {
      const px = cx + (i - 1) * gx, py = y0 + j * gy, n = j * 3 + i;
      if (style === "ring") btn += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(R)}" fill="none" stroke="${on ? LIT : "#fff"}" stroke-opacity="${on ? f(.6 + .3 * B) : (opt.hide ? 0 : .4)}" stroke-width=".55"/>`;
      if (style === "btn" || style === "sq") {
        const bf = x.light ? H().shade(x.p.c, -.3) : "#1a1a1c", d = style === "btn" ? circ(px, py, R) : rr(px - R, py - R * .85, R * 2, R * 1.7, R * .35);
        btn += `<path d="${d}" fill="#000" fill-opacity=".45" transform="translate(0 .8)"/><path d="${d}" fill="${bf}"/><path d="${d}" fill="${x.url("mv")}" opacity=".8"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity="${on ? .5 : .12}" stroke-width=".45"/>`;
      }
      if (on) glow += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(R * .7)}" fill="#cfe2ff"/>`;
      const L = order === "gc" ? ["gear", 0, "check"] : ["check", 0, "gear"];
      const k = n < 9 ? n + 1 : L[n - 9];
      if (typeof k === "number") s1 += dig(k, px, py, s, col, op, opt.w || .85);
      else if (k === "gear") s1 += gear(px, py, s * .78, col, op);
      else s1 += (x.ls === "locked" ? halo(x, px, py, R * 1.25, 1) : "") + check(px, py, s * .9, on ? "#f2fff7" : col, on ? 1 : op);
    }
    return btn + (on ? `<g opacity="${f(.4 * B)}"><g class="${P}pulse" filter="${x.url("gw")}">${glow}</g></g>` : "") + s1;
  }
  function logo(x, cx, cy, r, onGlass) {
    const fill = onGlass ? (x.light ? H().shade(x.p.c, .2) : "#d9d9db") : H().shade(x.p.c, x.light ? -.25 : .25);
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" fill-opacity="${onGlass ? .9 : 1}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url("mv")}" opacity=".6"/>` +
      `<g class="${x.cls}"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r + 1.3)}" fill="none" stroke="${x.st}" stroke-width="1" stroke-opacity="${x.on ? .95 : .8}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.7)}" fill="${x.url(x.hk)}"/></g>` + markDisc(x, cx, cy, r);
  }
  const press = (x, cx, cy, r) => x.on ? `<circle class="${P}press" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#ffffff" fill-opacity="0"/>` : "";
  const shd = (x, d, dx, dy, op) => `<path d="${d}" transform="translate(${dx == null ? 2.5 : dx} ${dy == null ? 4.5 : dy})" fill="#000" opacity="${op || .55}" filter="${x.url("bl")}"/>`;
  function body(x, d, dIn, faceGlass) {
    const p = x.p;
    return `${shd(x, d)}<path d="${d}" fill="${x.url("m")}"/><path d="${d}" fill="${x.url("mv")}"/><path d="${d}" fill="none" stroke="${p.k}" stroke-width=".7"/>
<path d="${d}" fill="none" stroke="${p.hi}" stroke-opacity="${p.m === "matte" ? .2 : .45}" stroke-width=".6" transform="translate(.3 .5)"/>` +
      (faceGlass ? `<path d="${dIn}" fill="#000" fill-opacity=".5" transform="translate(0 -.5)"/><path d="${dIn}" fill="${x.url("scr")}"/>` + (x.on ? `<path class="${P}wake" d="${dIn}" fill="#9cc4ff" fill-opacity="${f(.05 * x.B)}"/>` : "") + `<path d="${dIn}" fill="${x.url("gl")}" opacity=".55"/><path d="${dIn}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width=".5"/>`
        : `<path d="${dIn}" fill="${x.url("m")}"/><path d="${dIn}" fill="${x.url("mv")}" opacity=".7"/>${tex(x) ? `<path d="${dIn}" ${tex(x)}/>` : ""}<path d="${dIn}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`);
  }
  function keyway(x, cx, cy, r) {
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r + 1.2)}" fill="#000" fill-opacity=".4"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url("ms")}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .62)}" fill="${H().shade(x.p.c, -.15)}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .62)}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".5"/>` +
      `<path d="M${f(cx - r * .12)} ${f(cy - r * .45)}h${f(r * .24)}v${f(r * .45)}l${f(r * .14)} ${f(r * .22)}v${f(r * .2)}h${f(-r * .52)}v${f(-r * .2)}l${f(r * .14)} ${f(-r * .22)}Z" fill="#050608"/>`;
  }

  function assure2(x, kind, style, opt) {
    opt = opt || {};
    const keyed = kind === "keyed", W = keyed ? 76 : 74, Hh = keyed ? 148 : 110, cx = 94, y0 = keyed ? 26 : 45, x0 = cx - W / 2, r = W * .2;
    const glass = style === "ring", d = rr(x0, y0, W, Hh, r), dIn = rr(x0 + 3.2, y0 + 3.2, W - 6.4, Hh - 6.4, r - 3);
    let s = body(x, d, dIn, glass) + logo(x, cx, y0 + 14, 5.6, glass);
    if (opt.plus) s += `<g fill="none" stroke="${x.on ? LIT : "#fff"}" stroke-opacity="${x.on ? .8 : .4}" stroke-width=".6" stroke-linecap="round"><path d="M${cx + 9} ${y0 + 11}a4 4 0 0 1 0 6"/><path d="M${cx + 11.5} ${y0 + 9}a7 7 0 0 1 0 10"/></g>`;
    const gx = W * .27, gy = 17.5, s0 = 7.2, top = y0 + 32;
    s += keypad(x, cx, top, gx, gy, s0, style, "gc") + press(x, cx + gx, top + gy, 7);
    let by;
    if (keyed) { by = y0 + Hh - 18; s += keyway(x, cx, by, 7.5); }
    else { by = y0 + Hh * .5; s += `<rect x="${cx - 9}" y="${y0 + Hh - 1.6}" width="5" height="2" rx=".6" fill="#111"/><rect x="${cx + 4}" y="${y0 + Hh - 1.6}" width="5" height="2" rx=".6" fill="#111"/>`; }
    return { s, by };
  }
  function sl(x, cx, y0, W, Hh) {
    const x0 = cx - W / 2, r = W * .26, d = rr(x0, y0, W, Hh, r), dIn = rr(x0 + 3.5, y0 + 3.5, W - 7, Hh - 7, r - 3.2);
    const k = Hh / 122;
    x.glass = x.p.m === "bronze" ? "#120c09" : "#0c0c0e"; x.light = false; 
    let s = body(x, d, dIn, true) + logo(x, cx, y0 + 16 * k, 6.5 * k, true);
    const gx = W * .26, gy = 19 * k, top = y0 + 36 * k;
    s += keypad(x, cx, top, gx, gy, 9 * k, "bare", "cg", { w: .9 }) + press(x, cx, top + gy * 2, 7 * k);
    return { s, by: y0 + Hh * .55 };
  }
  function lever(x, style) {
    const cx = 110, W = 60, y0 = 14, Hh = 176, x0 = cx - W / 2, d = `M${x0} ${y0 + W / 2}A${W / 2} ${W / 2} 0 0 1 ${x0 + W} ${y0 + W / 2}V${y0 + Hh - 14}Q${x0 + W} ${y0 + Hh} ${x0 + W - 14} ${y0 + Hh}H${x0 + 14}Q${x0} ${y0 + Hh} ${x0} ${y0 + Hh - 14}Z`;
    const pW = W - 12, py0 = y0 + 8, pH = 98, pd = `M${cx - pW / 2} ${py0 + pW / 2}A${pW / 2} ${pW / 2} 0 0 1 ${cx + pW / 2} ${py0 + pW / 2}V${py0 + pH - 8}Q${cx + pW / 2} ${py0 + pH} ${cx + pW / 2 - 8} ${py0 + pH}H${cx - pW / 2 + 8}Q${cx - pW / 2} ${py0 + pH} ${cx - pW / 2} ${py0 + pH - 8}Z`;
    let s = shd(x, d) + `<path d="${d}" fill="${x.url("m")}"/><path d="${d}" fill="${x.url("mv")}"/>${tex(x) ? `<path d="${d}" ${tex(x)}/>` : ""}<path d="${d}" fill="none" stroke="${x.p.k}" stroke-width=".7"/><path d="${d}" fill="none" stroke="${x.p.hi}" stroke-opacity=".35" stroke-width=".6" transform="translate(.3 .5)"/>`;
    s += `<path d="${pd}" fill="#000" fill-opacity=".5" transform="translate(0 -.5)"/><path d="${pd}" fill="${x.url("scr")}"/><path d="${pd}" fill="${x.url("gl")}" opacity=".45"/>` + (x.on ? `<path class="${P}wake" d="${pd}" fill="#9cc4ff" fill-opacity="${f(.05 * x.B)}"/>` : "");
    s += logo(x, cx, py0 + 12, 4.2, true);
    const gx = 13.5, gy = 15, top = py0 + 28;
    s += keypad(x, cx, top, gx, gy, 6.4, style === "touch" ? "bare" : "sq", "cg", { w: .8 }) + press(x, cx, top, 5.5);
    const ly = top + gy * 3 + 12;
    s += [-1, 1].map((sg) => `<rect x="${f(cx + sg * 7 - 3.5)}" y="${f(ly)}" width="7" height="1.6" rx=".8" fill="${x.on ? "#fff" : "#9aa0a8"}" fill-opacity="${x.on ? .95 : .45}"/>`).join("");
    const hy = 156;
    const lv = `M${cx} ${hy - 5}C${cx - 30} ${hy - 4} ${cx - 62} ${hy - 1} ${cx - 88} ${hy - 8}Q${cx - 91} ${hy - 6} ${cx - 88} ${hy - 4}C${cx - 62} ${hy + 4} ${cx - 30} ${hy + 6} ${cx} ${hy + 6}Z`;
    s += shd(x, circ(cx, hy, 11), 2, 3) + `<circle cx="${cx}" cy="${hy}" r="11" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${hy}" r="11" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` +
      shd(x, lv, 2, 6) + `<path d="${lv}" fill="${x.url("m")}"/><path d="${lv}" fill="${x.url("mv")}"/><path d="${lv}" fill="none" stroke="${x.p.k}" stroke-width=".6"/><path d="M${cx - 4} ${hy - 3.6}C${cx - 32} ${hy - 2.6} ${cx - 62} ${hy + .4} ${cx - 86} ${hy - 6}" fill="none" stroke="${x.p.hi}" stroke-opacity=".55" stroke-width=".9" stroke-linecap="round"/>` +
      keyway(x, cx, hy, 7);
    return { s, by: hy };
  }
  function pill(x) {
    const cx = 94, W = 68, Hh = 150, y0 = 24, x0 = cx - W / 2, d = rr(x0, y0, W, Hh, W / 2), dIn = rr(x0 + 3, y0 + 3, W - 6, Hh - 6, W / 2 - 3);
    let s = body(x, d, dIn, false);
    s += logo(x, cx, y0 + 15, 6, false);
    const gx = 17, gy = 17, top = y0 + 36;
    const on = x.on, ringC = x.light ? H().shade(x.p.c, -.55) : "#e4e6e8", digC = on ? (x.light ? "#2a6df4" : LIT) : ringC;
    let k = "", glow = "";
    for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) {
      const px = cx + (i - 1) * gx, py = top + j * gy, n = j * 3 + i;
      k += `<circle cx="${px}" cy="${py}" r="7.4" fill="${H().shade(x.p.c, x.light ? .2 : .08)}"/><circle cx="${px}" cy="${py}" r="7.4" fill="none" stroke="${ringC}" stroke-opacity="${on ? .9 : .55}" stroke-width=".6"/>`;
      if (on) glow += `<circle cx="${px}" cy="${py}" r="6" fill="${x.light ? "#9cc0ff" : "#cfe2ff"}"/>`;
      if (n < 9) k += dig(n + 1, px, py, 6.4, digC, 1, .8);
      else if (n === 10) k += dig(0, px, py, 6.4, digC, 1, .8);
      else if (n === 9) k += gear(px, py, 5, digC, 1);
      else k += (x.ls === "locked" ? halo(x, px, py, 11, 1) : "") + check(px, py, 6, on ? "#f2fff7" : digC, 1);
    }
    s += (on ? `<g opacity="${f(.4 * x.B)}"><g class="${P}pulse" filter="${x.url("gw")}">${glow}</g></g>` : "") + k + press(x, cx, top + gy, 6.5);
    const by = y0 + Hh - 27; s += keyway(x, cx, by, 8);
    return { s, by };
  }
  function unity(x) {
    const cx = 112, W = 50, y0 = 14, Hh = 174, x0 = cx - W / 2, d = rr(x0, y0, W, Hh, 9), dIn = rr(x0 + 3, y0 + 3, W - 6, Hh - 6, 7);
    let s = body(x, d, dIn, true) + logo(x, cx, y0 + 15, 5.2, true);
    s += `<g fill="none" stroke="#fff" stroke-opacity="${x.on ? .35 : .7}" stroke-width=".7"><rect x="${cx - 3.6}" y="${y0 + 36}" width="7.2" height="10" rx="1"/><path d="M${cx - 5} ${y0 + 33.5}a7 5 0 0 1 10 0"/></g>`;
    s += keypad(x, cx, y0 + 56, 12, 14, 6, "bare", "cg", { hide: true, w: .8 });
    s += `<rect x="${cx - 7}" y="${y0 + 118}" width="14" height="1.8" rx=".9" fill="${x.st}" class="${x.cls}"/>`;
    const hy = 152, lv = rr(cx - 76, hy - 5.5, 76, 11, 5);
    s += shd(x, circ(cx, hy, 15), 2, 3) + `<circle cx="${cx}" cy="${hy}" r="15" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${hy}" r="15" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` +
      shd(x, lv, 2, 6) + `<path d="${lv}" fill="${x.url("m")}"/><path d="${lv}" fill="${x.url("mv")}"/><path d="${lv}" fill="none" stroke="${x.p.k}" stroke-width=".6"/><path d="M${cx - 4} ${hy - 4}H${cx - 72}" stroke="${x.p.hi}" stroke-opacity=".5" stroke-width=".9" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${hy}" r="9" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${hy}" r="9" fill="none" stroke="${x.p.k}" stroke-width=".5"/>`;
    return { s, by: hy };
  }
  function approach(x) {
    const cx = 128, cy = 112;
    let s = shd(x, circ(cx, cy, 24), 2, 4) + `<circle cx="${cx}" cy="${cy}" r="24" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${cy}" r="24" fill="none" stroke="${x.p.k}" stroke-width=".7"/><circle cx="${cx}" cy="${cy}" r="17" fill="${x.url("m")}"/><circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="#000" stroke-opacity=".3"/>` + keyway(x, cx, cy, 10);
    const kx = 58, ky = 62, kW = 46, kH = 80, d = rr(kx - kW / 2, ky, kW, kH, 9), dIn = rr(kx - kW / 2 + 2.5, ky + 2.5, kW - 5, kH - 5, 7);
    s += body(x, d, dIn, false) + logo(x, kx, ky + 10, 3.6, false) + keypad(x, kx, ky + 23, 12, 13.5, 5.2, "btn", "gc", { w: .75 });
    return { s, by: cy };
  }
  function handleset(x) {
    const lock = sl(x, 100, 12, 72, 94);
    const cx = 100, g = `M${cx - 6} 128H${cx + 6}V192H${cx - 6}Z`;
    const plate = rr(cx - 14, 116, 28, 90, 4);
    const s = shd(x, plate) + `<path d="${plate}" fill="${x.url("m")}"/><path d="${plate}" fill="${x.url("mv")}"/><path d="${plate}" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` +
      `<path d="${rr(cx - 3, 120, 6, 12, 2)}" fill="${x.url("m")}"/><path d="${rr(cx - 3, 120, 6, 12, 2)}" fill="none" stroke="${x.p.k}" stroke-width=".5"/>` +
      shd(x, g, 3, 5) + `<path d="${g}" fill="${x.url("m")}"/><path d="${g}" fill="${x.url("mv")}"/><path d="${g}" fill="none" stroke="${x.p.k}" stroke-width=".6"/><path d="M${cx - 3.5} 131V190" stroke="${x.p.hi}" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>` +
      `<rect x="${cx - 9}" y="125" width="18" height="5" rx="1.5" fill="${x.url("ms")}"/><rect x="${cx - 9}" y="188" width="18" height="5" rx="1.5" fill="${x.url("ms")}"/>`;
    return { s: s + lock.s, by: lock.by, latch: 170 };
  }

  const icons = [];
  const add = (id, name, colors, fn) => icons.push({ id, name, colors, picker: true, colorLabel: "Finish", options: [{ id: "state", name: "State", values: LSTATE }], render: (o) => fn(ctx(o)) });
  const put = (x, kind, t, lock) => scene(x, kind, t, (lock.latch ? `<g class="hda-bg">${jamb(x) + strike(x, lock.by) + strike(x, lock.latch, 26)}</g>${bolt(x, lock.by) + bolt(x, lock.latch, true)}` : edge(x, lock.by, lock.lever)) + lock.s);
  const A2 = [BS, SN, ORB];

  add("glass-touchscreen", "Glass touchscreen", A2, (x) => put(x, "blue", PANELS(11), assure2(x, "keyed", "ring")));
  add("a2touchsn", "Touchscreen Nickel", [SN, BS, ORB], (x) => put(x, "white", PANELS(13), assure2(x, "keyed", "ring")));
  add("a2touchorb", "Touchscreen Bronze", [ORB, BS, SN], (x) => put(x, "cream", PANELS(15), assure2(x, "keyed", "ring")));
  add("push-button-keypad", "Push-button keypad", A2, (x) => put(x, "oak", WOOD(17), assure2(x, "keyed", "btn")));
  add("a2keypadsn", "Keypad Nickel", [SN, BS, ORB], (x) => put(x, "slate", speck(19, 50), assure2(x, "keyed", "btn")));
  add("a2kftouch", "Key-free Touch", A2, (x) => put(x, "green", PANELS(21), assure2(x, "kf", "ring")));
  add("a2kftouchsn", "Key-free Nickel", [SN, BS, ORB], (x) => put(x, "navy", PANELS(23), assure2(x, "kf", "ring")));
  add("a2kfkeypad", "Key-free Keypad", A2, (x) => put(x, "red", PANELS(25), assure2(x, "kf", "btn")));
  add("touchscreen-plus", "Touchscreen plus", [BS, SN, ORB], (x) => put(x, "glassdoor", LITE(27), assure2(x, "kf", "ring", { plus: true })));
  add("slim-touchscreen", "Slim touchscreen", [BS, SN, ORB, PB], (x) => put(x, "sage", PANELS(29), sl(x, 94, 38, 92, 122)));
  add("slim-touchscreen-brass", "Slim touchscreen, brass", [PB, SN, ORB, BS], (x) => put(x, "walnut", WOOD(31), sl(x, 94, 38, 92, 122)));
  add("levertouch", "Lever Touch", [SN, ORB, BS], (x) => { const l = lever(x, "touch"); l.lever = 1; return scene(x, "gray", PANELS(33), edge(x, l.by, true) + l.s); });
  add("leverkeypad", "Lever Keypad", [BS, SN, ORB], (x) => { const l = lever(x, "keypad"); return scene(x, "teal", PANELS(35), edge(x, l.by, true) + l.s); });
  add("retrofit-lock", "Retrofit lock", [BS, SN], (x) => put(x, "yellow", PANELS(37), approach(x)));
  add("smart-lock-white", "Smart lock, white", [SNOW, MBK, ASH], (x) => put(x, "maple", WOOD(39), pill(x)));
  add("smart-lock-black", "Smart lock, black", [MBK, SNOW, ASH], (x) => put(x, "plum", PANELS(41), pill(x)));
  add("entrance-handle-lock", "Entrance handle lock", [MBK, SIL], (x) => { const l = unity(x); return scene(x, "black", LITE(43), edge(x, l.by, true) + l.s); });
  add("slim-handleset", "Slim handleset", [SN, PB, ORB, BS], (x) => put(x, "cedar", WOOD(45), handleset(x)));

  const css = `
.hda-lock2-bo,.hda-lock2-bi{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-lock2-bo{animation:hda-lock2-bo .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-lock2-bo{from{transform:translateX(-100%)}to{transform:translateX(0)}}
.hda-anim .hda-lock2-bi{animation:hda-lock2-bi .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-lock2-bi{from{transform:translateX(100%)}to{transform:translateX(0)}}
.hda-anim .hda-lock2-wake{animation:hda-lock2-wake 1.1s ease-out .2s both}
@keyframes hda-lock2-wake{from{opacity:0}to{opacity:1}}
.hda-anim .hda-lock2-pulse{animation:hda-lock2-pulse 3.2s ease-in-out infinite}
@keyframes hda-lock2-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-lock2-breath{animation:hda-lock2-breath 2.8s ease-in-out infinite}
@keyframes hda-lock2-breath{0%,100%{opacity:1}50%{opacity:.45}}
.hda-anim .hda-lock2-blink{animation:hda-lock2-blink 1.6s steps(1,end) infinite}
@keyframes hda-lock2-blink{0%,60%{opacity:1}61%,100%{opacity:.15}}
.hda-anim .hda-lock2-press{animation:hda-lock2-press 4s ease-out infinite}
@keyframes hda-lock2-press{0%,70%{fill-opacity:0}74%{fill-opacity:.5}100%{fill-opacity:0}}
.hda-lock2-mxo,.hda-lock2-mxi,.hda-lock2-jx,.hda-lock2-spin,.hda-lock2-spinr{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-lock2-mxo{animation:hda-lock2-mxo 1.8s ease-in-out infinite}
@keyframes hda-lock2-mxo{0%{transform:translateX(-50%)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-lock2-mxi{animation:hda-lock2-mxi 1.8s ease-in-out infinite}
@keyframes hda-lock2-mxi{0%{transform:translateX(50%)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-lock2-jx{animation:hda-lock2-jx 2.2s linear infinite}
@keyframes hda-lock2-jx{0%,40%,100%{transform:translateX(0)}8%,24%{transform:translateX(1.2px)}16%,32%{transform:translateX(-1.2px)}}
.hda-anim .hda-lock2-mblink{animation:hda-lock2-mblink .9s steps(1,end) infinite}
@keyframes hda-lock2-mblink{0%,55%{opacity:1}56%,100%{opacity:.2}}
.hda-anim .hda-lock2-jblink{animation:hda-lock2-jblink .5s steps(1,end) infinite}
@keyframes hda-lock2-jblink{0%,50%{opacity:1}51%,100%{opacity:.25}}
.hda-anim .hda-lock2-chev0,.hda-anim .hda-lock2-chev1,.hda-anim .hda-lock2-chev2{animation:hda-lock2-chev 1.2s ease-in-out infinite}
.hda-anim .hda-lock2-chev1{animation-delay:.2s}.hda-anim .hda-lock2-chev2{animation-delay:.4s}
@keyframes hda-lock2-chev{0%,100%{opacity:.25}35%{opacity:1}}
.hda-anim .hda-lock2-spin{animation:hda-lock2-spin 1.4s linear infinite}
@keyframes hda-lock2-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.hda-anim .hda-lock2-spinr{animation:hda-lock2-spinr 1.4s linear infinite}
@keyframes hda-lock2-spinr{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-lock2-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "lock2",
    tab: "Smart deadbolts: keypad & glass",
    group: "More",
    kind: "device",
    intro: "Smart deadbolts with glass touchscreens and keypads, redrawn from product photos (outside face only, no logos): keyed and key-free, slim and lever versions, a retrofit, a smart-standard lock, an entrance handle lock and a handleset. On means LOCKED: bolt out, check lit green, digits backlit; off means UNLOCKED: bolt in, red status. The color is that model's real finishes. The State menu also shows Locking and Unlocking (bolt part-way, amber light, arrows) and Jammed (red warning light and badge).",
    onWord: "Locked", offWord: "Unlocked",
    css,
    icons,
  });
})();
