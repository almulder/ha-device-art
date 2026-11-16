(function () {
  const P = "hda-deadbolts-";
  const H = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const GRN = "#3ee08f", RED = "#ff5a5f";

  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  const SN = "#a9aaa5", AB = "#3c2a1e", MB = "#2c2c2f", BC = "#dfe4ea", BB = "#d6ae55", ANB = "#9b7a46", SC = "#c3c6c9", SBR = "#c6a86c";
  const MODE = {}; [[SN, "satin"], [SC, "satin"], [SBR, "satin"], [ANB, "satin"], [AB, "bronze"], [MB, "matte"], [BC, "polish"], [BB, "polish"]].forEach(([c, m]) => MODE[c] = m);
  function metal(c) {
    const h = H(), m = MODE[c.toLowerCase()] || "satin", s = h.shade;
    if (m === "polish") return { m, c, k: s(c, -.72), d: s(c, -.42), l: s(c, .55), hi: "#ffffff", rim: "#ffffff", ink: s(c, -.75) };
    if (m === "matte") return { m, c, k: s(c, -.55), d: s(c, -.25), l: s(c, .2), hi: s(c, .34), rim: s(c, .3), ink: "#0b0b0c" };
    if (m === "bronze") return { m, c, k: "#1a110b", d: s(c, -.38), l: s(c, .14), hi: "#c98d57", rim: "#b8794a", ink: "#120b07" };
    return { m, c, k: s(c, -.6), d: s(c, -.32), l: s(c, .42), hi: s(c, .72), rim: s(c, .6), ink: s(c, -.7) };
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
    const u = o.uid, S = lockState(o), on = S.on, lv = o.level == null ? 1 : o.level;
    return Object.assign({ o, u, on, B: .4 + .6 * lv, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, p: metal(o.color || SN), n: 0 }, S);
  }

  function defs(x, extra) {
    const p = x.p, id = x.id, face = {
      polish: [[0, p.k], [.06, p.l], [.18, p.hi], [.3, p.c], [.48, p.d], [.6, p.c], [.8, p.hi], [.93, p.d], [1, p.k]],
      matte: [[0, p.k], [.1, p.d], [.35, p.l], [.65, p.c], [.9, p.d], [1, p.k]],
      bronze: [[0, p.k], [.035, p.hi], [.1, p.d], [.32, p.c], [.5, p.l], [.72, p.c], [.9, p.d], [.965, p.hi], [1, p.k]],
      satin: [[0, p.k], [.08, p.d], [.24, p.l], [.5, p.c], [.78, H().shade(p.c, -.08)], [.92, p.d], [1, p.k]],
    }[p.m];
    const brush = p.m === "satin" || p.m === "bronze";
    return `<defs>
${lg(id("m"), face)}
${lg(id("mv"), [[0, "#fff", p.m === "polish" ? .3 : .2], [.3, "#fff", 0], [.72, "#000", 0], [1, "#000", .32]], 0, 0, 0, 1)}
${lg(id("mr"), p.m === "bronze" ? [[0, p.rim], [.18, p.d], [.6, p.c], [1, p.k]] : [[0, p.rim], [.45, p.c], [1, p.k]], 0, 0, 1, 1)}
${rg(id("ms"), [[0, p.hi], [.35, p.l], [.75, p.c], [1, p.d]], .36, .3, .8)}
${rg(id("dome"), [[0, p.hi], [.22, p.l], [.6, p.c], [.88, p.d], [1, p.k]], .38, .3, .75)}
${lg(id("scr"), [[0, "#1b1e26"], [.5, "#07080b"], [1, "#020203"]], 0, 0, 0, 1)}
${lg(id("gl"), [[0, "#fff", .34], [.38, "#fff", .05], [.39, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("bolt"), [[0, "#f3f5f7"], [.42, "#aeb5bd"], [.56, "#cfd5db"], [1, "#565d65"]], 0, 0, 0, 1)}
${lg(id("stv"), [[0, "#e2e6ea"], [.5, "#9aa1a9"], [1, "#5a6067"]], 0, 0, 0, 1)}
${lg(id("gap"), [[0, "#000", .9], [1, "#14121c", .9]])}
${rg(id("hg"), [[0, GRN, .9], [.45, GRN, .3], [1, GRN, 0]])}
${rg(id("hr"), [[0, RED, .8], [.45, RED, .25], [1, RED, 0]])}${stDefs(x)}
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .06], [1, "#000", .5]], .5, .48, .74)}
${brush ? `<pattern id="${id("br")}" width="2.6" height="40" patternUnits="userSpaceOnUse"><path d="M.6 0V40" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/><path d="M1.9 0V40" stroke="#000" stroke-opacity=".07" stroke-width=".4"/></pattern>` : ""}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="${id("gw")}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>
${extra || ""}</defs>`;
  }

  const DOOR = {
    red: ["#8a2f37", "#561821"], oak: ["#a9784a", "#714828"], white: ["#c3c7ce", "#979ca6"], slate: ["#4a5465", "#2c333f"],
    navy: ["#2d3c5e", "#19223a"], walnut: ["#5e3e28", "#362213"], teal: ["#2f6266", "#1a3d40"], maple: ["#c09868", "#8e6a42"],
    cedar: ["#a06e46", "#6a4529"], upvc: ["#d2d5da", "#a9adb5"], barn: ["#74392b", "#45201a"], veneer: ["#4e372a", "#2a1c14"],
    gray: ["#56606c", "#363d47"], sage: ["#5d6b55", "#3a4535"], black: ["#2c2d33", "#17181c"], cream: ["#cfc4ae", "#a59a83"],
    blue: ["#3d6688", "#244259"], plum: ["#5a3550", "#341d2e"], green: ["#2f4a3a", "#1a2c22"], steel: ["#3d4148", "#202328"],
  };
  function grain(seed, x0, x1) {
    const r = rnd(seed); let s = "";
    for (let a = x0; a < x1; a += 7 + r() * 8) {
      const w = 1.5 + r() * 3;
      s += `<path d="M${f(a)} 8C${f(a + w)} 60 ${f(a - w)} 130 ${f(a + w * .5)} 192" fill="none" stroke="#1d0f06" stroke-opacity="${(.1 + r() * .16).toFixed(2)}" stroke-width="${(.5 + r() * .9).toFixed(1)}"/>`;
    }
    return s;
  }
  const speck = (seed, n) => { const r = rnd(seed); let s = ""; for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * .7)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .07).toFixed(2)}"/>`; return s; };
  const panel = (x, y, w, h) => `<path d="M${x} ${y + h}V${y}H${x + w}" fill="none" stroke="#000" stroke-opacity=".32" stroke-width="1.6"/><path d="M${x + w} ${y}V${y + h}H${x}" fill="none" stroke="#fff" stroke-opacity=".13" stroke-width="1.6"/>
<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" fill="#fff" fill-opacity=".04"/>`;
  const PANELS = (seed) => panel(14, 18, 26, 74) + panel(14, 110, 26, 74) + speck(seed, 30);
  const WOOD = (seed) => grain(seed, 8, 192) + speck(seed + 1, 16);
  function scene(x, kind, tex, hw) {
    const c = DOOR[kind];
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, lg(x.id("dg"), [[0, c[0]], [1, c[1]]], 0, 0, .3, 1))}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("dg")}"/>${tex || ""}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${hw}</g>
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
    const body = latch
      ? `<path d="M${E - 2} ${f(y0)}H${E + L - 5}L${E + L} ${f(y + h / 2)}H${E - 2}Z" fill="${x.url("bolt")}"/>`
      : `<path d="${rr(E - 2, y0, L + 2, h, 1.6)}" fill="${x.url("bolt")}"/><path d="M${E} ${f(y0 + .9)}H${E + L - 1.5}" stroke="#fff" stroke-opacity=".7" stroke-width=".9"/>`;
    const cls = latch ? "" : ` class="${P}${x.mid ? (x.jam ? "jx" : x.mv > 0 ? "mxo" : "mxi") : out ? "bo" : "bi"}"`;
    return `<clipPath id="${k}"><rect x="${E}" y="0" width="${200 - E}" height="200"/></clipPath>
<g clip-path="url(#${k})"><g${out ? "" : ` transform="translate(${fr ? f(-(L + 3) * (1 - fr)) : -L - 3} 0)"`}><g${cls}>${body}</g></g></g>` + (latch ? "" : arrows(x, E + 11, y - h / 2 - 8, x.mv > 0 ? "r" : "l"));
  }
  const doorEdge = (x, y, latch) => `<g class="hda-bg">${jamb(x) + strike(x, y, latch ? 26 : 30)}</g>${bolt(x, y, latch)}`;

  function cam(x0, y0, x1, y1, a, b, notch) {
    const w = x1 - x0, cx = (x0 + x1) / 2, e = Math.min(13, w * .16), n = notch == null ? 1 : notch, ny = y1 - b - w * .22;
    const top = `M${f(x0)} ${f(y0 + a + 6)}Q${f(x0)} ${f(y0 + a)} ${f(x0 + 4)} ${f(y0 + a - 1)}C${f(x0 + e * .6)} ${f(y0 + a - 2)} ${f(x0 + e * .8)} ${f(y0 + a + 1.5)} ${f(x0 + e)} ${f(y0 + a - .5)}` +
      `C${f(x0 + w * .3)} ${f(y0 + a * .25)} ${f(cx - w * .16)} ${f(y0)} ${f(cx)} ${f(y0)}C${f(cx + w * .16)} ${f(y0)} ${f(x1 - w * .3)} ${f(y0 + a * .25)} ${f(x1 - e)} ${f(y0 + a - .5)}` +
      `C${f(x1 - e * .8)} ${f(y0 + a + 1.5)} ${f(x1 - e * .6)} ${f(y0 + a - 2)} ${f(x1 - 4)} ${f(y0 + a - 1)}Q${f(x1)} ${f(y0 + a)} ${f(x1)} ${f(y0 + a + 6)}`;
    const side = (sx, dir) => n ? `L${f(sx)} ${f(ny - 8)}C${f(sx)} ${f(ny - 3)} ${f(sx - dir * 3 * n)} ${f(ny - 3)} ${f(sx - dir * 3 * n)} ${f(ny + 2)}C${f(sx - dir * 3 * n)} ${f(ny + 6)} ${f(sx)} ${f(ny + 6)} ${f(sx)} ${f(ny + 11)}` : "";
    const bot = `L${f(x1)} ${f(y1 - b - 6)}Q${f(x1)} ${f(y1 - b)} ${f(x1 - 4)} ${f(y1 - b + 1)}C${f(x1 - e * .6)} ${f(y1 - b + 2)} ${f(x1 - e * .8)} ${f(y1 - b - 1.5)} ${f(x1 - e)} ${f(y1 - b + .5)}` +
      `C${f(x1 - w * .3)} ${f(y1 - b * .25)} ${f(cx + w * .16)} ${f(y1)} ${f(cx)} ${f(y1)}C${f(cx - w * .16)} ${f(y1)} ${f(x0 + w * .3)} ${f(y1 - b * .25)} ${f(x0 + e)} ${f(y1 - b + .5)}` +
      `C${f(x0 + e * .8)} ${f(y1 - b - 1.5)} ${f(x0 + e * .6)} ${f(y1 - b + 2)} ${f(x0 + 4)} ${f(y1 - b + 1)}Q${f(x0)} ${f(y1 - b)} ${f(x0)} ${f(y1 - b - 6)}`;
    const sideL = n ? `L${f(x0)} ${f(ny + 11)}C${f(x0)} ${f(ny + 6)} ${f(x0 + 3 * n)} ${f(ny + 6)} ${f(x0 + 3 * n)} ${f(ny + 2)}C${f(x0 + 3 * n)} ${f(ny - 3)} ${f(x0)} ${f(ny - 3)} ${f(x0)} ${f(ny - 8)}` : "";
    return top + side(x1, 1) + bot + sideL + "Z";
  }
  const ply = (x0, y0, x1, y1) => { const r = (x1 - x0) / 2, rb = r * .92; return `M${f(x0)} ${f(y0 + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y0 + r)}V${f(y1 - rb)}A${f(r)} ${f(rb)} 0 0 1 ${f(x0)} ${f(y1 - rb)}Z`; };
  const grw = (x0, y0, x1, y1) => { const w = x1 - x0; return `M${f(x0)} ${f(y0 + w * .34)}C${f(x0)} ${f(y0 + w * .06)} ${f(x0 + w * .22)} ${f(y0)} ${f((x0 + x1) / 2)} ${f(y0)}C${f(x1 - w * .22)} ${f(y0)} ${f(x1)} ${f(y0 + w * .06)} ${f(x1)} ${f(y0 + w * .34)}V${f(y1 - 5)}Q${f(x1)} ${f(y1)} ${f(x1 - 5)} ${f(y1)}H${f(x0 + 5)}Q${f(x0)} ${f(y1)} ${f(x0)} ${f(y1 - 5)}Z`; };
  const camScr = (x0, y0, x1, y1, a, r) => { const w = x1 - x0, cx = (x0 + x1) / 2; return `M${f(x0)} ${f(y1 - r)}V${f(y0 + a)}C${f(x0 + w * .3)} ${f(y0 + a * .12)} ${f(cx - w * .2)} ${f(y0)} ${f(cx)} ${f(y0)}C${f(cx + w * .2)} ${f(y0)} ${f(x1 - w * .3)} ${f(y0 + a * .12)} ${f(x1)} ${f(y0 + a)}V${f(y1 - r)}Q${f(x1)} ${f(y1)} ${f(x1 - r)} ${f(y1)}H${f(x0 + r)}Q${f(x0)} ${f(y1)} ${f(x0)} ${f(y1 - r)}Z`; };

  const shd = (x, d, dx, dy, op) => `<path d="${d}" transform="translate(${dx == null ? 2.5 : dx} ${dy == null ? 4.5 : dy})" fill="#000" opacity="${op || .55}" filter="${x.url("bl")}"/>`;
  function esc(x, outer, inner) {
    const p = x.p;
    return `${shd(x, outer)}<path d="${outer}" fill="${x.url("mr")}"/><path d="${outer}" fill="none" stroke="${p.k}" stroke-width=".7"/>
<path d="${inner}" fill="${x.url("m")}"/><path d="${inner}" fill="${x.url("mv")}"/>${p.m === "satin" || p.m === "bronze" ? `<path d="${inner}" fill="${x.url("br")}"/>` : ""}
<path d="${inner}" fill="none" stroke="${p.k}" stroke-opacity=".45" stroke-width=".7"/><path d="${inner}" fill="none" stroke="${p.hi}" stroke-opacity="${p.m === "matte" ? .18 : .4}" stroke-width=".6" transform="translate(.4 .6)"/>`;
  }
  function century(x, x0, y0, w, h, bev) {
    const p = x.p, b = bev || 6, X1 = x0 + w, Y1 = y0 + h, ix = x0 + b, iy = y0 + b, iX = X1 - b, iY = Y1 - b;
    return `${shd(x, rr(x0, y0, w, h, 2))}<path d="${rr(x0, y0, w, h, 2)}" fill="${x.url("m")}"/>
<path d="M${x0} ${y0}H${X1}L${iX} ${iy}H${ix}Z" fill="#fff" fill-opacity="${p.m === "matte" ? .12 : .32}"/><path d="M${x0} ${Y1}H${X1}L${iX} ${iY}H${ix}Z" fill="#000" fill-opacity=".34"/>
<path d="M${x0} ${y0}V${Y1}L${ix} ${iY}V${iy}Z" fill="#fff" fill-opacity=".1"/><path d="M${X1} ${y0}V${Y1}L${iX} ${iY}V${iy}Z" fill="#000" fill-opacity=".2"/>
<rect x="${ix}" y="${iy}" width="${w - 2 * b}" height="${h - 2 * b}" fill="${x.url("m")}"/><rect x="${ix}" y="${iy}" width="${w - 2 * b}" height="${h - 2 * b}" fill="${x.url("mv")}"/>${p.m === "satin" || p.m === "bronze" ? `<rect x="${ix}" y="${iy}" width="${w - 2 * b}" height="${h - 2 * b}" fill="${x.url("br")}"/>` : ""}
<path d="${rr(x0, y0, w, h, 2)}" fill="none" stroke="${p.k}" stroke-width=".7"/><path d="M${x0 + .8} ${y0 + .8}H${X1 - .8}" stroke="${p.hi}" stroke-opacity=".6" stroke-width=".7"/>
<path d="M${ix} ${iy}H${iX}V${iY}H${ix}Z" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".5"/>`;
  }
  const plate = (x, cx, cy, w, h, dark) => `<path d="${rr(cx - w / 2, cy - h / 2, w, h, h * .3)}" fill="${dark ? "#2a2d33" : x.url("mr")}"/><path d="${rr(cx - w / 2, cy - h / 2, w, h, h * .3)}" fill="none" stroke="${dark ? "#8b919a" : x.p.k}" stroke-opacity="${dark ? .7 : .6}" stroke-width=".5"/><path d="M${f(cx - w / 2 + 1.5)} ${f(cy - h / 2 + .7)}H${f(cx + w / 2 - 1.5)}" stroke="#fff" stroke-opacity=".5" stroke-width=".5"/>`;
  function plug(x, cx, cy, r, rot) {
    return `<circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${cy}" r="${f(r)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".6"/>
<g transform="rotate(${rot || 0} ${cx} ${cy})"><path d="M${f(cx - r * .14)} ${f(cy - r * .62)}h${f(r * .28)}v${f(r * .62)}l${f(r * .16)} ${f(r * .28)}v${f(r * .22)}h${f(-r * .6)}v${f(-r * .22)}l${f(r * .16)} ${f(-r * .28)}Z" fill="#050608"/></g>`;
  }
  function cylRound(x, cx, cy, r) {
    return `${shd(x, circ(cx, cy, r), 1.4, 2.6, .5)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${cy}" r="${f(r - .4)}" fill="none" stroke="${x.p.hi}" stroke-opacity=".5" stroke-width=".7"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .8)}" fill="${x.url("m")}"/><circle cx="${cx}" cy="${cy}" r="${f(r * .8)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>
${plate(x, cx, cy - r * .38, r * .9, r * .24)}${plug(x, cx, cy + r * .2, r * .36)}`;
  }
  function dome(x, cx, cy, r) {
    return `${shd(x, circ(cx, cy, r), 2, 4, .55)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("dome")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.p.k}" stroke-width=".7"/>
<ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .42)}" rx="${f(r * .34)}" ry="${f(r * .16)}" fill="#fff" fill-opacity="${x.p.m === "matte" ? .1 : .35}" transform="rotate(-30 ${f(cx - r * .3)} ${f(cy - r * .42)})"/>
<circle cx="${cx}" cy="${cy}" r="${f(r * .46)}" fill="#000" fill-opacity=".3"/>${plug(x, cx, cy, r * .42, -25)}`;
  }
  const keyFlush = (x, cx, cy, r) => `<circle cx="${cx}" cy="${f(cy + .7)}" r="${f(r + 1.6)}" fill="#000" fill-opacity=".3"/><circle cx="${cx}" cy="${cy}" r="${f(r + 1.6)}" fill="${x.url("mr")}"/>${plug(x, cx, cy, r)}`;

  const DG = [
    "M3 0C1.3 0 .5 2.2 .5 5S1.3 10 3 10 5.5 7.8 5.5 5 4.7 0 3 0Z",
    "M1.5 1.9L3.4 .2V10",
    "M.8 2.4C1.2.8 2.2 0 3.2 0 4.6 0 5.4 1 5.4 2.4 5.4 4.4 2.6 6.6.6 10H5.6",
    "M.9 1.2C1.6.4 2.4 0 3.2 0 4.6 0 5.3.9 5.3 2.3 5.3 3.8 4.2 4.7 2.6 4.8 4.4 4.8 5.6 6 5.6 7.4 5.6 9 4.4 10 2.9 10 1.9 10 1.1 9.6.5 8.8",
    "M4.2 10V0L.3 7H5.8",
    "M5 0H1.4L.9 4.4C1.6 3.9 2.3 3.7 3 3.7 4.6 3.7 5.6 4.9 5.6 6.8 5.6 8.8 4.4 10 2.8 10 1.8 10 1 9.6.5 9",
    "M4.9.6C4.4.2 3.8 0 3.2 0 1.4 0 .4 2.2.4 5.6.4 8.6 1.4 10 3 10 4.6 10 5.6 8.8 5.6 7 5.6 5.2 4.6 4.1 3.1 4.1 1.9 4.1 1 4.8.5 6",
    "M.4 0H5.6L2.2 10",
    "M3 4.7C1.6 4.7.8 3.8.8 2.4.8 1 1.7 0 3 0S5.2 1 5.2 2.4C5.2 3.8 4.4 4.7 3 4.7ZM3 4.7C1.4 4.7.4 5.8.4 7.3.4 8.9 1.5 10 3 10S5.6 8.9 5.6 7.3C5.6 5.8 4.6 4.7 3 4.7Z",
    "M1.1 9.4C1.6 9.8 2.2 10 2.8 10 4.6 10 5.6 7.8 5.6 4.4 5.6 1.4 4.6 0 3 0 1.4 0 .4 1.2.4 3 .4 4.8 1.4 5.9 2.9 5.9 4.1 5.9 5 5.2 5.5 4",
  ];
  const SERIF = { 1: "M1.6 10H5.2", 4: "M3 10H5.4", 7: "M.4 0V1.4", 2: "M5.6 10V8.8" };
  function dig(n, cx, cy, s, col, op, opt) {
    opt = opt || {}; const k = s / 10, sw = (opt.w || 1.05) / k;
    const sk = opt.italic ? ` skewX(-12)` : "";
    return `<g transform="translate(${f(cx - 3 * k + (opt.italic ? s * .1 : 0))} ${f(cy - 5 * k)}) scale(${k.toFixed(3)})${sk}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${sw.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"><path d="${DG[n]}"/>${opt.serif && SERIF[n] ? `<path d="${SERIF[n]}"/>` : ""}</g>`;
  }
  const ico = {
    check: (cx, cy, s, c, op) => `<path d="M${f(cx - s * .45)} ${f(cy)}l${f(s * .3)} ${f(s * .32)}l${f(s * .6)} ${f(-s * .7)}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(s * .13)}" stroke-linecap="round" stroke-linejoin="round"/>`,
    x: (cx, cy, s, c, op) => `<path d="M${f(cx - s * .35)} ${f(cy - s * .35)}l${f(s * .7)} ${f(s * .7)}M${f(cx + s * .35)} ${f(cy - s * .35)}l${f(-s * .7)} ${f(s * .7)}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(s * .12)}" stroke-linecap="round"/>`,
    house: (cx, cy, s, c, op) => `<path d="M${f(cx - s * .45)} ${f(cy - s * .05)}L${f(cx)} ${f(cy - s * .5)}L${f(cx + s * .45)} ${f(cy - s * .05)}V${f(cy + s * .48)}H${f(cx - s * .45)}Z" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(s * .1)}" stroke-linejoin="round"/>`,
    lock: (cx, cy, s, c, op, open) => `<path d="M${f(cx - s * .26)} ${f(cy - s * (open ? .2 : .05))}V${f(cy - s * (open ? .38 : .22))}A${f(s * .26)} ${f(s * .26)} 0 0 1 ${f(cx + s * .26)} ${f(cy - s * (open ? .38 : .22))}V${f(cy - s * (open ? .3 : .05))}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(s * .1)}" stroke-linecap="round"/><path d="${rr(cx - s * .4, cy - s * .05, s * .8, s * .55, s * .08)}" fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="${f(s * .1)}"/>`,
  };
  const halo = (x, cx, cy, r, grn) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url(grn ? "hg" : "hr")}"/>`;

  function grid(x, cx, y0, gx, gy, s, style, bottom) {
    const on = x.on, B = x.B, glass = style === "conn" || style === "sense" || style === "plus";
    const litC = style === "sense" ? "#ffd9a0" : style === "conn" ? "#eaf2ff" : "#fffaf0";
    const offC = glass ? "#ffffff" : x.p.ink, offOp = glass ? (style === "conn" ? .62 : .48) : (x.p.m === "matte" ? .6 : .8);
    const col = on ? litC : offC, op = on ? f(.6 + .4 * B) : offOp;
    const opt = { serif: style === "conn" || style === "sense", italic: style === "sense", w: style === "enc" || style === "plus" ? .8 : 1.05 };
    let s1 = "", glow = "";
    const cell = (i, j) => [cx + (i - 1) * gx, y0 + j * gy];
    for (let n = 1; n <= 9; n++) { const [px, py] = cell((n - 1) % 3, ((n - 1) / 3) | 0); s1 += dig(n, px, py, s, col, op, opt); }
    const [zx, zy] = cell(1, 3); s1 += dig(0, zx, zy, s, col, op, opt);
    if (style === "plus") { s1 +=`<path d="M${f(cx - s * .55)} ${f(y0 + gy - s * .55)}a${f(s * .9)} ${f(s * .9)} 0 0 0 0 ${f(s * 1.1)}M${f(cx + s * .55)} ${f(y0 + gy - s * .55)}a${f(s * .9)} ${f(s * .9)} 0 0 1 0 ${f(s * 1.1)}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width=".7" stroke-linecap="round"/>`; }
    const [lx, ly] = cell(0, 3), [rx, ry] = cell(2, 3);
    if (x.mid && bottom === "connect") s1 += ico.check(lx, ly + s * .1, s * .95, "#fff", .2) + mark(x, rx, ry, s * 1.15);
    else if (x.mid && bottom === "encode") s1 += ico.house(lx, ly, s * .95, col, op) + mark(x, rx, ry, s * 1.15);
    else if (x.mid) s1 += mark(x, rx, ry, s * 1.1);
    else if (bottom === "connect") {
      s1 += (on ? halo(x, lx, ly, s * 1.05, 1) : "") + ico.check(lx, ly + s * .1, s * .95, on ? GRN : "#fff", on ? 1 : .2);
      s1 += (!on ? halo(x, rx, ry, s * .9, 0) : "") + ico.x(rx, ry, s * .75, on ? "#fff" : RED, on ? .2 : .85);
      s1 += `<circle cx="${f((zx + rx) / 2)}" cy="${f(ry + s * .25)}" r=".8" fill="#fff" fill-opacity="${on ? .7 : .25}"/>`;
    } else if (bottom === "encode") {
      s1 += ico.house(lx, ly, s * .95, col, op);
      s1 += `<g class="${on ? P + "breath" : P + "blink"}">${halo(x, rx, ry, s * .95, on)}</g>` + ico.lock(rx, ry, s * .95, on ? GRN : RED, on ? 1 : .85, !on);
    }
    if (on) glow = `<g opacity="${f(.55 * B)}"><g class="${P}pulse" filter="${x.url("gw")}">${s1}</g></g>`;
    return glow + s1;
  }
  function screen(x, d) {
    return `<path d="${d}" fill="#000" fill-opacity=".6" transform="translate(0 .8)"/><path d="${d}" fill="${x.url("scr")}"/>` +
      (x.on ? `<path class="${P}wake" d="${d}" fill="#7fb4ff" fill-opacity="${f(.05 * x.B)}"/>` : "") +
      `<path d="${d}" fill="${x.url("gl")}" opacity=".5"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`;
  }
  function encPanel(x, d) {
    const p = x.p, h = H();
    return `<path d="${d}" fill="#000" fill-opacity=".35" transform="translate(0 -.6)"/><path d="${d}" fill="${p.m === "matte" ? "#202124" : h.shade(p.c, .12)}"/><path d="${d}" fill="${x.url("mv")}" opacity=".6"/>` +
      (x.on ? `<path d="${d}" fill="#000" fill-opacity="${p.m === "matte" ? 0 : .22}"/><path class="${P}wake" d="${d}" fill="#fff6e0" fill-opacity="${f(.06 * x.B)}"/>` : "") +
      `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/><path d="${d}" fill="${x.url("gl")}" opacity=".25"/>`;
  }
  const press = (x, cx, cy, r) => x.on ? `<circle class="${P}press" cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="#ffffff" fill-opacity=".0"/>` : "";

  function arrivePad(x, cx, y0, bw, bh, gx, gy) {
    const on = x.on, B = x.B, p = x.p; let s = "", glow = "";
    const btnFill = p.m === "matte" ? "#26272a" : H().shade(p.c, .25), digC = on ? "#ffffff" : (p.m === "matte" ? "#8a8d92" : p.ink), dOp = on ? 1 : .6;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) {
      const kx = cx + (i - 1) * (bw + gx) - bw / 2, ky = y0 + j * (bh + gy), mx = kx + bw / 2, my = ky + bh / 2;
      s += `<path d="${rr(kx, ky + .9, bw, bh, 2.6)}" fill="#000" fill-opacity=".4"/><path d="${rr(kx, ky, bw, bh, 2.6)}" fill="${btnFill}"/><path d="${rr(kx, ky, bw, bh, 2.6)}" fill="${x.url("mv")}" opacity=".7"/>`;
      s += `<path d="${rr(kx + .5, ky + .5, bw - 1, bh - 1, 2.2)}" fill="none" stroke="${on ? "#ffffff" : "#000"}" stroke-opacity="${on ? f(.75 * B) : .25}" stroke-width="${on ? .9 : .5}"/>`;
      if (on) glow += `<path d="${rr(kx, ky, bw, bh, 2.6)}" fill="none" stroke="#fff" stroke-width="2.2"/>`;
      const n = j * 3 + i;
      if (n < 9) s += dig(n + 1, mx, my, bh * .52, digC, dOp, { w: .9 });
      else if (n === 10) s += dig(0, mx, my, bh * .52, digC, dOp, { w: .9 });
      else if (n === 9) s += ico.house(mx, my, bh * .55, digC, dOp);
      else if (x.mid) s += markDisc(x, mx, my, bh * .42);
      else s += `<g class="${on ? P + "breath" : P + "blink"}">${halo(x, mx, my, bh * .75, on)}</g>` + ico.lock(mx, my, bh * .55, on ? GRN : RED, 1, !on);
    }
    return (on ? `<g opacity="${f(.5 * B)}"><g class="${P}pulse" filter="${x.url("gw")}">${glow}</g></g>` : "") + s;
  }
  function roundPad(x, cx, y0, r, pitch, gy) {
    const on = x.on, B = x.B, p = x.p; let s = "", glow = "";
    for (let j = 0; j < 2; j++) for (let i = 0; i < 5; i++) {
      const bx = cx + (i - 2) * pitch, by = y0 + j * gy, n = (j * 5 + i + 1) % 10;
      s += `<circle cx="${f(bx)}" cy="${f(by + .8)}" r="${f(r + .7)}" fill="#000" fill-opacity=".45"/><circle cx="${f(bx)}" cy="${f(by)}" r="${f(r + .6)}" fill="${p.k}" fill-opacity=".6"/><circle cx="${f(bx)}" cy="${f(by)}" r="${f(r)}" fill="${x.url("ms")}"/>`;
      s += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(r - .3)}" fill="none" stroke="#fff" stroke-opacity="${p.m === "matte" ? .15 : .4}" stroke-width=".4"/>`;
      if (on) glow += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(r * .8)}" fill="#cfe6ff"/>`;
      s += dig(n, bx, by, r * 1.15, on ? "#eef6ff" : p.ink, on ? .95 : .75, { w: .85 });
    }
    return (on ? `<g opacity="${f(.45 * B)}"><g class="${P}pulse" filter="${x.url("gw")}">${glow}</g></g>` : "") + s;
  }
  function logoBtn(x, cx, cy, w, h) {
    const c = x.st;
    return `<g class="${x.cls}"><ellipse cx="${cx}" cy="${cy}" rx="${f(w / 2 + 4)}" ry="${f(h / 2 + 4)}" fill="${x.url(x.hk)}"/></g>
<ellipse cx="${cx}" cy="${f(cy + .7)}" rx="${f(w / 2 + .8)}" ry="${f(h / 2 + .8)}" fill="#000" fill-opacity=".45"/><ellipse cx="${cx}" cy="${cy}" rx="${f(w / 2 + .8)}" ry="${f(h / 2 + .8)}" fill="${c}"/>
<ellipse cx="${cx}" cy="${cy}" rx="${f(w / 2)}" ry="${f(h / 2)}" fill="${x.url("ms")}"/><path d="M${f(cx - w * .3)} ${f(cy - h * .2)}H${f(cx + w * .3)}" stroke="#fff" stroke-opacity=".5" stroke-width=".5"/>`;
  }

  function hub(x, cx, cy, r) {
    return `${shd(x, circ(cx, cy, r), 2, 3)}<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${cy}" r="${f(r - .6)}" fill="none" stroke="${x.p.hi}" stroke-opacity=".45"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.p.k}" stroke-width=".6"/>`;
  }
  function accent(x, cx, cy, L) {
    const d = `M${cx} ${f(cy - 7.5)}C${f(cx - L * .3)} ${f(cy - 7)} ${f(cx - L * .55)} ${f(cy + 5)} ${f(cx - L * .78)} ${f(cy + 3)}C${f(cx - L * .9)} ${f(cy + 2)} ${f(cx - L * .96)} ${f(cy - 5)} ${f(cx - L)} ${f(cy - 9)}Q${f(cx - L - 4)} ${f(cy - 7)} ${f(cx - L + .5)} ${f(cy - 1)}C${f(cx - L * .9)} ${f(cy + 10)} ${f(cx - L * .7)} ${f(cy + 13)} ${f(cx - L * .5)} ${f(cy + 10)}C${f(cx - L * .3)} ${f(cy + 7.5)} ${f(cx - L * .15)} ${f(cy + 8)} ${cx} ${f(cy + 8)}Z`;
    return `${shd(x, d, 2, 7, .55)}<path d="${d}" fill="${x.url("m")}"/><path d="${d}" fill="${x.url("mv")}"/><path d="${d}" fill="none" stroke="${x.p.k}" stroke-width=".6"/>
<path d="M${f(cx - 3)} ${f(cy - 5.8)}C${f(cx - L * .3)} ${f(cy - 5.4)} ${f(cx - L * .55)} ${f(cy + 6.4)} ${f(cx - L * .8)} ${f(cy + 4.4)}C${f(cx - L * .9)} ${f(cy + 3.4)} ${f(cx - L * .95)} ${f(cy - 3)} ${f(cx - L + 1.5)} ${f(cy - 7)}" fill="none" stroke="${x.p.hi}" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>`;
  }
  function latitude(x, cx, cy, L) {
    const d = rr(cx - L, cy - 4.5, L, 9, 1.6);
    return `${shd(x, d, 2, 7, .55)}<path d="${d}" fill="${x.url("m")}"/><path d="${d}" fill="${x.url("mv")}"/><path d="${d}" fill="none" stroke="${x.p.k}" stroke-width=".6"/><path d="M${cx - 2} ${cy - 3.3}H${cx - L + 2}" stroke="${x.p.hi}" stroke-opacity=".6" stroke-width=".9" stroke-linecap="round"/>`;
  }
  const boss = (x, cx, cy, r, key) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${x.url("ms")}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` + (key ? plug(x, cx, cy, r * .62) : `<circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .35)}" r="${f(r * .3)}" fill="#fff" fill-opacity=".3"/>`);

  function connect(x, trim, cx, y0, W, Hh, sense) {
    const x0 = cx - W / 2, x1 = cx + W / 2, y1 = y0 + Hh, k = W / 88;
    let s;
    if (trim === "cam") s = esc(x, cam(x0, y0, x1, y1, 16 * k, 10 * k), cam(x0 + 3.5 * k, y0 + 3.5 * k, x1 - 3.5 * k, y1 - 3.5 * k, 15 * k, 9 * k));
    else s = century(x, x0, y0, W, Hh, 6 * k);
    const sx0 = x0 + 8 * k, sx1 = x1 - 8 * k, sy0 = y0 + (trim === "cam" ? 9 : 9) * k, sy1 = y0 + Hh * .66;
    const sd = trim === "cam" ? camScr(sx0, sy0, sx1, sy1, 12 * k, 6 * k) : rr(sx0, sy0, sx1 - sx0, sy1 - sy0, 2);
    s += screen(x, sd) + plate(x, cx, sy0 + 8 * k, 26 * k, 5.5 * k, true);
    if (sense) s += `<path d="M${f(cx - 9 * k)} ${f(sy0 + 13 * k)}H${f(cx + 9 * k)}" stroke="${x.st}" stroke-width="${f(1.1 * k)}" stroke-linecap="round" stroke-opacity="${x.on ? 1 : .75}" class="${x.cls}"/>`;
    const gy = (sy1 - sy0 - 22 * k) / 4, gTop = sy0 + 20 * k;
    if (sense) {
      s += grid(x, cx, gTop + gy * .1, 20 * k, gy, 9 * k, "sense", "none");
    } else s += grid(x, cx, gTop, 20 * k, gy, 8.6 * k, "conn", "connect") + press(x, cx, gTop + gy, 6 * k);
    const cy = y1 - (Hh - (sy1 - y0)) / 2 + (trim === "cam" ? 0 : 0);
    s += cylRound(x, cx, cy, 16 * k);
    return { s, by: cy };
  }
  function encode(x, trim, cx, y0, W, Hh, plus) {
    const x0 = cx - W / 2, x1 = cx + W / 2, y1 = y0 + Hh, k = W / 84;
    let s, pd;
    if (trim === "cam") { s = esc(x, cam(x0, y0, x1, y1, 15 * k, 10 * k), cam(x0 + 3.5 * k, y0 + 3.5 * k, x1 - 3.5 * k, y1 - 3.5 * k, 14 * k, 9 * k)); pd = camScr(x0 + 9 * k, y0 + 9 * k, x1 - 9 * k, y0 + Hh * .64, 11 * k, 5 * k); }
    else if (trim === "cen") { s = century(x, x0, y0, W, Hh, 7 * k); pd = rr(x0 + 10 * k, y0 + 10 * k, W - 20 * k, Hh * .64 - 10 * k, 1.5); }
    else { s = esc(x, grw(x0, y0, x1, y1), grw(x0 + 3.5, y0 + 3.5, x1 - 3.5, y1 - 3.5)); pd = rr(x0 + 7.5, y0 + 22, W - 15, Hh * .6 - 16, 3); }
    s += plus ? screen(x, pd) : encPanel(x, pd);
    const top = trim === "grw" ? y0 + 22 : y0 + 9 * k, bot = trim === "grw" ? y0 + Hh * .6 + 6 : y0 + Hh * .64;
    s += plate(x, cx, top + 7 * k, (trim === "grw" ? 20 : 24) * k, 5 * k, plus);
    const gy = (bot - top - 22 * k) / 4, gx = trim === "grw" ? W * .25 : 20 * k;
    s += grid(x, cx, top + 20 * k, gx, gy, (trim === "grw" ? 8 : 8.4) * k, plus ? "plus" : "enc", "encode") + press(x, cx - gx, top + 20 * k + gy, 5 * k);
    if (trim === "cen") s += `<path d="M${f(x0 + 7 * k)} ${f(bot + 7 * k)}H${f(x1 - 7 * k)}" stroke="#000" stroke-opacity=".25" stroke-width=".7"/><path d="M${f(x0 + 7 * k)} ${f(bot + 7.8 * k)}H${f(x1 - 7 * k)}" stroke="#fff" stroke-opacity=".18" stroke-width=".6"/>`;
    const cy = trim === "cen" ? (bot + 7 * k + y1 - 7 * k) / 2 : (bot + y1) / 2 - 2 * k;
    s += keyFlush(x, cx, cy, 7.5 * k);
    return { s, by: cy };
  }
  function arrive(x, trim, cx, y0, W, Hh) {
    const x0 = cx - W / 2, x1 = cx + W / 2, y1 = y0 + Hh, k = W / 80;
    let s;
    if (trim === "cam") s = esc(x, cam(x0, y0, x1, y1, 14 * k, 10 * k), cam(x0 + 3.5 * k, y0 + 3.5 * k, x1 - 3.5 * k, y1 - 3.5 * k, 13 * k, 9 * k));
    else if (trim === "cen") s = century(x, x0, y0, W, Hh, 5 * k);
    else s = esc(x, rr(x0, y0, W, Hh, W / 2), rr(x0 + 3.5, y0 + 3.5, W - 7, Hh - 7, W / 2 - 3.5));
    const ty = trim === "rmn" ? y0 + 24 * k : y0 + 17 * k;
    s += plate(x, cx, ty, 24 * k, 5.5 * k);
    const bw = 15 * k, bh = 12.5 * k, gx = 4 * k, gy = 4.4 * k, py = ty + 8 * k;
    s += arrivePad(x, cx, py, bw, bh, gx, gy) + press(x, cx, py + bh * .5, 6 * k);
    const cy = trim === "rmn" ? y1 - 26 * k : y1 - 22 * k;
    s += keyFlush(x, cx, cy, 7 * k);
    return { s, by: cy };
  }
  function be365(x, trim, cx, y0, W, Hh) {
    const x0 = cx - W / 2, x1 = cx + W / 2, y1 = y0 + Hh, k = W / 80;
    const s0 = trim === "cam" ? esc(x, cam(x0, y0, x1, y1, 15 * k, 9 * k, 0), cam(x0 + 3.5 * k, y0 + 3.5 * k, x1 - 3.5 * k, y1 - 3.5 * k, 14 * k, 8 * k, 0))
      : esc(x, ply(x0, y0, x1, y1), ply(x0 + 3.5 * k, y0 + 3.5 * k, x1 - 3.5 * k, y1 - 3.5 * k));
    const by = y0 + Hh * .71;
    const s = s0 + logoBtn(x, cx, y0 + 22 * k, 13 * k, 6 * k) + roundPad(x, cx, y0 + 37 * k, 5.4 * k, 13 * k, 13.5 * k) + press(x, cx, y0 + 37 * k, 5 * k) + dome(x, cx, by, 24 * k);
    return { s, by };
  }

  const icons = [];
  const add = (id, name, colors, fn) => icons.push({ id, name, colors, picker: true, colorLabel: "Finish", options: [{ id: "state", name: "State", values: LSTATE }], render: (o) => fn(ctx(o)) });
  const dead = (x, kind, tex, lock) => scene(x, kind, tex, doorEdge(x, lock.by) + lock.s);

  add("arched-push-button", "Arched push-button", [SN, AB, MB, BB, ANB, SC], (x) => dead(x, "red", PANELS(11), be365(x, "cam", 94, 30, 82, 140)));
  add("round-push-button", "Round push-button", [SN, AB, MB, BB, ANB, SC], (x) => dead(x, "teal", PANELS(13), be365(x, "ply", 94, 28, 80, 144)));
  add("arched-touch-alarm", "Arched touch, alarm", [BC, SN, AB, MB], (x) => dead(x, "navy", PANELS(15), connect(x, "cam", 94, 26, 88, 148)));
  add("arched-touch-deadbolt", "Arched touch deadbolt", [SN, AB, BB, MB, BC], (x) => dead(x, "oak", WOOD(31), connect(x, "cam", 94, 26, 88, 148)));
  add("slim-touch-deadbolt", "Slim touch deadbolt", [SN, MB, BC, SC, AB], (x) => dead(x, "slate", speck(19, 60), connect(x, "cen", 94, 28, 86, 144)));
  add("arched-wi-fi-touch", "Arched Wi-Fi touch", [SN, AB, MB, SC], (x) => dead(x, "cream", PANELS(17), connect(x, "cam", 94, 26, 88, 148, true)));
  add("slim-wi-fi-touch", "Slim Wi-Fi touch", [AB, SN, MB, SC], (x) => dead(x, "walnut", WOOD(47), connect(x, "cen", 94, 28, 86, 144, true)));
  add("arched-touchscreen", "Arched touchscreen", [SN, AB, MB, BC, SBR], (x) => dead(x, "sage", PANELS(21), encode(x, "cam", 94, 26, 84, 148)));
  add("slim-touchscreen", "Slim touchscreen", [SN, MB, AB, BC, SBR], (x) => dead(x, "blue", PANELS(23), encode(x, "cen", 94, 28, 84, 144)));
  add("square-touchscreen", "Square touchscreen", [SN, MB, SBR, AB], (x) => dead(x, "green", PANELS(25), encode(x, "grw", 96, 20, 58, 164)));
  add("arched-fingerprint", "Arched fingerprint", [MB, SN, AB], (x) => dead(x, "white", PANELS(27), encode(x, "cam", 94, 26, 84, 148, true)));
  add("slim-fingerprint", "Slim fingerprint", [SN, MB, AB], (x) => dead(x, "maple", WOOD(61), encode(x, "cen", 94, 28, 84, 144, true)));
  add("slim-keypad-deadbolt", "Slim keypad deadbolt", [SN, MB], (x) => dead(x, "steel", speck(41, 50), arrive(x, "cen", 94, 26, 80, 146)));
  add("arched-keypad-deadbolt", "Arched keypad deadbolt", [SN, MB, BC], (x) => dead(x, "cedar", WOOD(53), arrive(x, "cam", 94, 24, 80, 150)));
  add("round-keypad-deadbolt", "Round keypad deadbolt", [MB, SN, SBR], (x) => dead(x, "barn", WOOD(77), arrive(x, "rmn", 94, 22, 80, 154)));

  function fe595(x, trim) {
    const cx = 108, W = 54, y0 = 16, Hh = 170, x0 = cx - W / 2, x1 = cx + W / 2, y1 = y0 + Hh, ly = 128;
    const s0 = trim === "cam" ? esc(x, cam(x0, y0, x1, y1, 12, 8, 0), cam(x0 + 3, y0 + 3, x1 - 3, y1 - 3, 11, 7, 0)) : esc(x, ply(x0, y0, x1, y1), ply(x0 + 3, y0 + 3, x1 - 3, y1 - 3));
    return scene(x, trim === "cam" ? "veneer" : "upvc", trim === "cam" ? WOOD(91) : PANELS(29),
      doorEdge(x, ly, true) + s0 + logoBtn(x, cx, y0 + 18, 10, 4.6) + roundPad(x, cx, y0 + 30, 3.9, 9.2, 10.5) + press(x, cx, y0 + 30, 4) +
      keyFlush(x, cx, y0 + 58, 4.6) + hub(x, cx, ly, 12) + accent(x, cx, ly, 78) + boss(x, cx, ly, 7.5));
  }
  add("round-keypad-lever", "Round keypad lever", [AB, SN, SC, BB], (x) => fe595(x, "ply"));
  add("arched-keypad-lever", "Arched keypad lever", [SN, AB, BB], (x) => fe595(x, "cam"));

  function fe789(x, trim) {
    const cx = 108, W = 60, y0 = 14, Hh = 174, x0 = cx - W / 2, x1 = cx + W / 2, y1 = y0 + Hh, ly = 136, k = W / 84;
    let s0, pd;
    if (trim === "cam") { s0 = esc(x, cam(x0, y0, x1, y1, 12, 8, 0), cam(x0 + 3, y0 + 3, x1 - 3, y1 - 3, 11, 7, 0)); pd = camScr(x0 + 7, y0 + 8, x1 - 7, y0 + 92, 9, 4); }
    else { s0 = century(x, x0, y0, W, Hh, 5); pd = rr(x0 + 8, y0 + 8, W - 16, 84, 1.5); }
    const top = y0 + 8, gy = (92 - 8 - 22) / 4 + 1;
    const s = s0 + encPanel(x, pd) + plate(x, cx, top + 7, 20, 4.4) + grid(x, cx, top + 19, 14.5, gy, 7.2, "enc", "encode") + press(x, cx, top + 19 + gy * 2, 4.5) +
      hub(x, cx, ly, 12) + (trim === "cam" ? accent(x, cx, ly, 82) : latitude(x, cx, ly, 80)) + boss(x, cx, ly, 8.5, true);
    void k;
    return scene(x, trim === "cam" ? "gray" : "plum", PANELS(trim === "cam" ? 33 : 35), doorEdge(x, ly, true) + s);
  }
  add("arched-touch-lever", "Arched touch lever", [AB, SN, MB, BC], (x) => fe789(x, "cam"));
  add("slim-touch-lever", "Slim touch lever", [MB, SN, AB, BC], (x) => fe789(x, "cen"));

  add("arched-smart-lever", "Arched smart lever", [AB, SN, MB], (x) => {
    const cx = 100, lock = connect(x, "cam", cx, 12, 64, 108);
    const gx0 = cx - 17, gx1 = cx + 17, gy0 = 128, gy1 = 222;
    const grip = `M${cx - 6} 142C${cx - 11} 156 ${cx - 11} 178 ${cx - 7} 196L${cx + 7} 196C${cx + 11} 178 ${cx + 11} 156 ${cx + 6} 142Z`;
    const handle = esc(x, cam(gx0, gy0, gx1, gy1, 8, 6, 0), cam(gx0 + 2.5, gy0 + 2.5, gx1 - 2.5, gy1 - 2.5, 7, 5, 0)) +
      `<path d="${rr(cx - 4, 131, 8, 12, 3.5)}" fill="${x.url("m")}"/><path d="${rr(cx - 4, 131, 8, 12, 3.5)}" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` +
      `<ellipse cx="${cx}" cy="143" rx="10" ry="6" fill="${x.url("ms")}"/><ellipse cx="${cx}" cy="143" rx="10" ry="6" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` +
      shd(x, grip, 3, 5, .55) + `<path d="${grip}" fill="${x.url("m")}"/><path d="${grip}" fill="${x.url("mv")}"/><path d="${grip}" fill="none" stroke="${x.p.k}" stroke-width=".6"/>` +
      `<path d="M${cx - 3} 148C${cx - 6} 160 ${cx - 6} 178 ${cx - 3.5} 192" fill="none" stroke="${x.p.hi}" stroke-opacity=".6" stroke-width="1.1" stroke-linecap="round"/>`;
    return scene(x, "black", PANELS(37), `<g class="hda-bg">${jamb(x) + strike(x, lock.by) + strike(x, 170, 26)}</g>${bolt(x, lock.by) + bolt(x, 170, true)}` + handle + lock.s);
  });

  const css = `
.hda-deadbolts-bo,.hda-deadbolts-bi{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-deadbolts-bo{animation:hda-deadbolts-bo .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-deadbolts-bo{from{transform:translateX(-100%)}to{transform:translateX(0)}}
.hda-anim .hda-deadbolts-bi{animation:hda-deadbolts-bi .7s cubic-bezier(.5,0,.2,1) .25s both}
@keyframes hda-deadbolts-bi{from{transform:translateX(100%)}to{transform:translateX(0)}}
.hda-anim .hda-deadbolts-pulse{animation:hda-deadbolts-pulse 3.2s ease-in-out infinite}
@keyframes hda-deadbolts-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.hda-anim .hda-deadbolts-breath{animation:hda-deadbolts-breath 2.8s ease-in-out infinite}
@keyframes hda-deadbolts-breath{0%,100%{opacity:1}50%{opacity:.45}}
.hda-anim .hda-deadbolts-blink{animation:hda-deadbolts-blink 1.6s steps(1,end) infinite}
@keyframes hda-deadbolts-blink{0%,60%{opacity:1}61%,100%{opacity:.15}}
.hda-anim .hda-deadbolts-press{animation:hda-deadbolts-press 4s ease-out infinite}
@keyframes hda-deadbolts-press{0%,70%{fill-opacity:0}74%{fill-opacity:.55}100%{fill-opacity:0}}
.hda-deadbolts-mxo,.hda-deadbolts-mxi,.hda-deadbolts-jx,.hda-deadbolts-spin,.hda-deadbolts-spinr{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-deadbolts-mxo{animation:hda-deadbolts-mxo 1.8s ease-in-out infinite}
@keyframes hda-deadbolts-mxo{0%{transform:translateX(-50%)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-deadbolts-mxi{animation:hda-deadbolts-mxi 1.8s ease-in-out infinite}
@keyframes hda-deadbolts-mxi{0%{transform:translateX(50%)}65%,100%{transform:translateX(0)}}
.hda-anim .hda-deadbolts-jx{animation:hda-deadbolts-jx 2.2s linear infinite}
@keyframes hda-deadbolts-jx{0%,40%,100%{transform:translateX(0)}8%,24%{transform:translateX(1.2px)}16%,32%{transform:translateX(-1.2px)}}
.hda-anim .hda-deadbolts-mblink{animation:hda-deadbolts-mblink .9s steps(1,end) infinite}
@keyframes hda-deadbolts-mblink{0%,55%{opacity:1}56%,100%{opacity:.2}}
.hda-anim .hda-deadbolts-jblink{animation:hda-deadbolts-jblink .5s steps(1,end) infinite}
@keyframes hda-deadbolts-jblink{0%,50%{opacity:1}51%,100%{opacity:.25}}
.hda-anim .hda-deadbolts-chev0,.hda-anim .hda-deadbolts-chev1,.hda-anim .hda-deadbolts-chev2{animation:hda-deadbolts-chev 1.2s ease-in-out infinite}
.hda-anim .hda-deadbolts-chev1{animation-delay:.2s}.hda-anim .hda-deadbolts-chev2{animation-delay:.4s}
@keyframes hda-deadbolts-chev{0%,100%{opacity:.25}35%{opacity:1}}
.hda-anim .hda-deadbolts-spin{animation:hda-deadbolts-spin 1.4s linear infinite}
@keyframes hda-deadbolts-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.hda-anim .hda-deadbolts-spinr{animation:hda-deadbolts-spinr 1.4s linear infinite}
@keyframes hda-deadbolts-spinr{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-deadbolts-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "deadbolts",
    tab: "Smart deadbolts: arched & slim",
    group: "More",
    kind: "device",
    intro: "Electronic deadbolts and levers by model and trim (arched, slim, round and square), redrawn from product photos (outside face only, no logos). On means LOCKED: bolt out, check or padlock lit green, keypad backlit; off means UNLOCKED: bolt in, status dim red. The color is that model's real finishes. The State menu also shows Locking and Unlocking (bolt part-way, amber light, arrows) and Jammed (red warning light and badge).",
    onWord: "Locked", offWord: "Unlocked",
    css,
    icons,
  });
})();
