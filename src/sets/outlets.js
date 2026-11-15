(function () {
  const P = "hda-outlets-";
  const H = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const GRN = "#3ee08f", RED = "#ff5a5f", BLU = "#5aa9ff", WARM = "#ffe2a8";

  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;

  const WH = "#f3f2ee", LA = "#e6d9c0", IV = "#eee4c9", GY = "#8f9296", BK = "#26272a", BN = "#a9aaa6";
  const BRASS = "#c8a24e", NICK = "#b4b6b5", BRZ = "#5a4130", SS = "#c3c6c9";
  const METAL = {}; [BN, BRASS, NICK, BRZ, SS].forEach((c) => METAL[c] = 1);
  const PLATES = [WH, LA, IV, GY, BK, BN];
  function ctx(o) {
    const u = o.uid, c = o.color || WH, h = H();
    const metal = !!METAL[c.toLowerCase()];
    const lum = (() => { const v = h.hx(c); return (v[0] * .3 + v[1] * .59 + v[2] * .11) / 255; })();
    const dev = metal ? h.mix(c, "#d8d9d6", .35) : c;
    return { o, u, on: !!o.on, B: .35 + .65 * (o.level == null ? 1 : o.level), id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, c, dev, metal, dark: lum < .4, n: 0 };
  }
  function defs(x, wall, extra) {
    const h = H(), c = x.c, d = x.dev, id = x.id;
    const plate = x.metal ? [[0, h.shade(c, -.35)], [.1, h.shade(c, .35)], [.45, c], [.7, h.shade(c, .2)], [.92, h.shade(c, -.2)], [1, h.shade(c, -.45)]]
      : [[0, h.shade(c, .25)], [.5, c], [1, h.shade(c, -.12)]];
    return `<defs>
${lg(id("pl"), plate, 0, 0, x.metal ? 1 : .35, x.metal ? 0 : 1)}
${lg(id("pv"), [[0, "#fff", .35], [.25, "#fff", 0], [.75, "#000", 0], [1, "#000", .22]], 0, 0, 0, 1)}
${lg(id("dv"), [[0, h.shade(d, .3)], [.5, d], [1, h.shade(d, -.18)]], 0, 0, .3, 1)}
${lg(id("wl"), [[0, wall[0]], [1, wall[1]]], 0, 0, .25, 1)}
${rg(id("vig"), [[0, "#000", 0], [.62, "#000", .05], [1, "#000", .45]], .5, .48, .74)}
${rg(id("hg"), [[0, GRN, .9], [.45, GRN, .3], [1, GRN, 0]])}
${rg(id("hb"), [[0, BLU, .9], [.45, BLU, .3], [1, BLU, 0]])}
${rg(id("hr"), [[0, RED, .85], [.45, RED, .25], [1, RED, 0]])}
${rg(id("lt"), [[0, x.o.color || WARM, .85], [.4, x.o.color || WARM, .35], [1, x.o.color || WARM, 0]])}
${rg(id("wm"), [[0, WARM, .9], [.4, WARM, .35], [1, WARM, 0]])}
${lg(id("cord"), [[0, "#3a3c40"], [.5, "#6b6e74"], [1, "#2a2b2e"]])}
${lg(id("brass"), [[0, "#6b5326"], [.15, "#e8cf87"], [.45, "#c8a24e"], [.75, "#f0db9a"], [1, "#6b5326"]])}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="${id("gw")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3"/></filter>
${x.metal ? `<pattern id="${id("br")}" width="40" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 .6H40" stroke="#fff" stroke-opacity=".08" stroke-width=".5"/><path d="M0 1.8H40" stroke="#000" stroke-opacity=".07" stroke-width=".4"/></pattern>` : ""}
${extra || ""}</defs>`;
  }
  const WALL = {
    sage: ["#a6b49c", "#7e8d75"], blue: ["#8ea9c2", "#67829b"], beige: ["#d9ccb4", "#b4a58a"], gray: ["#a9adb3", "#7f848c"], terra: ["#c48a6a", "#9a6347"],
    navy: ["#3d4f6e", "#27344b"], cream: ["#e7dfcc", "#c1b79f"], mint: ["#b5d3c4", "#8aac9b"], plum: ["#7a5a72", "#563f51"], white: ["#dfe1e4", "#b9bdc3"],
    charcoal: ["#4a4d53", "#2f3135"], olive: ["#8a8a5e", "#646640"], sky: ["#bcd2e2", "#94acbe"], rose: ["#d7a8a8", "#b07f7f"],
  };
  const speck = (seed, n) => { const r = rnd(seed); let s = ""; for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(10 + r() * 180)}" r="${f(.3 + r() * .7)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.03 + r() * .06).toFixed(2)}"/>`; return s; };
  function scene(x, wall, tex, hw, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, WALL[wall] || wall, extra)}
<g clip-path="${x.url("wc")}"><g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("wl")}"/>${tex == null ? speck(x.u.length * 7 + 3, 60) : tex}<rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g>${hw}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }
  const shd = (x, d, dx, dy, op) => `<path d="${d}" transform="translate(${dx == null ? 1.5 : dx} ${dy == null ? 3 : dy})" fill="#000" opacity="${op || .4}" filter="${x.url("bl")}"/>`;

  function plate(x, X, Y, W, Hh, r, screws) {
    const d = rr(X, Y, W, Hh, r == null ? 3 : r);
    let s = shd(x, d) + `<path d="${d}" fill="${x.url("pl")}"/>` + (x.metal ? `<path d="${d}" fill="${x.url("br")}"/>` : "") + `<path d="${d}" fill="${x.url("pv")}"/>` +
      `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7"/><path d="${rr(X + 1.2, Y + 1.2, W - 2.4, Hh - 2.4, Math.max(.5, (r == null ? 3 : r) - 1))}" fill="none" stroke="#fff" stroke-opacity="${x.dark ? .15 : .5}" stroke-width=".6"/>`;
    (screws || []).forEach(([sx, sy]) => s += screw(x, sx, sy));
    return s;
  }
  const screw = (x, cx, cy) => `<circle cx="${cx}" cy="${cy}" r="2.6" fill="${x.url("dv")}"/><circle cx="${cx}" cy="${cy}" r="2.6" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/><path d="M${cx - 1.8} ${cy}H${cx + 1.8}" stroke="#000" stroke-opacity=".5" stroke-width=".7"/>`;
  function face(x, d) {
    return `<path d="${d}" fill="#000" fill-opacity=".35" transform="translate(0 -.6)"/><path d="${d}" fill="${x.url("dv")}"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".28" stroke-width=".6"/><path d="${d}" fill="${x.url("pv")}" opacity=".5"/>`;
  }
  const REGIONS = [["us", "US"], ["eu", "EU (Schuko)"], ["uk", "UK"], ["au", "Australia"], ["ch", "Switzerland"], ["it", "Italy"]];
  const REG_OPT = { id: "region", name: "Region", values: REGIONS };
  let REG = "us";
  const RS = (c, a) => window.HDAH.shade(c, a);
  const rC = (x0, y0, r, fill, extra) => `<circle cx="${f(x0)}" cy="${f(y0)}" r="${f(r)}" fill="${fill}"${extra || ""}/>`;
  const rR = (x0, y0, w, h, r, fill, rot, extra) => `<rect x="${f(x0 - w / 2)}" y="${f(y0 - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${fill}"${rot ? ` transform="rotate(${rot} ${f(x0)} ${f(y0)})"` : ""}${extra || ""}/>`;
  function rsock(cx, cy, k, col, reg) {
    reg = reg || REG; const hole = "#141416", met = "#cfd3d8", lip = RS(col, -.28), deep = RS(col, -.2);
    if (reg === "eu") return rC(cx, cy + .6 * k, 17.5 * k, "#000", ` fill-opacity=".25"`) + rC(cx, cy, 17.5 * k, lip) + rC(cx, cy + .8 * k, 15.6 * k, deep) +
      rC(cx, cy + 1.2 * k, 14.2 * k, RS(col, -.12)) + rC(cx - 8 * k, cy + 1 * k, 2.5 * k, hole) + rC(cx + 8 * k, cy + 1 * k, 2.5 * k, hole) +
      rR(cx, cy - 14.6 * k, 7 * k, 2.8 * k, .8 * k, met) + rR(cx, cy + 15.6 * k, 7 * k, 2.8 * k, .8 * k, met) +
      `<path d="M${f(cx - 12 * k)} ${f(cy + 9 * k)}A${f(15 * k)} ${f(15 * k)} 0 0 0 ${f(cx + 12 * k)} ${f(cy + 9 * k)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f(.8 * k)}"/>`;
    if (reg === "uk") return rR(cx, cy - 7 * k, 3.2 * k, 8.5 * k, .6 * k, hole) + rR(cx - 7.8 * k, cy + 6 * k, 8.5 * k, 3.2 * k, .6 * k, hole) + rR(cx + 7.8 * k, cy + 6 * k, 8.5 * k, 3.2 * k, .6 * k, hole);
    if (reg === "au") return rR(cx - 5.8 * k, cy - 2 * k, 2.6 * k, 8.5 * k, .6 * k, hole, 30) + rR(cx + 5.8 * k, cy - 2 * k, 2.6 * k, 8.5 * k, .6 * k, hole, -30) + rR(cx, cy + 8.5 * k, 2.6 * k, 7.5 * k, .6 * k, hole);
    if (reg === "ch") { const hx = `M${f(cx - 9 * k)} ${f(cy - 11 * k)}H${f(cx + 9 * k)}L${f(cx + 13.5 * k)} ${f(cy - 2 * k)}L${f(cx + 4.5 * k)} ${f(cy + 12 * k)}H${f(cx - 4.5 * k)}L${f(cx - 13.5 * k)} ${f(cy - 2 * k)}Z`;
      return `<path d="${hx}" fill="${lip}" stroke="${lip}" stroke-width="${f(3 * k)}" stroke-linejoin="round"/><path d="${hx}" fill="${deep}" transform="translate(0 ${f(.8 * k)})"/>` +
        rC(cx - 7 * k, cy - 3 * k, 2.1 * k, hole) + rC(cx + 7 * k, cy - 3 * k, 2.1 * k, hole) + rC(cx, cy + 5 * k, 2.1 * k, hole); }
    if (reg === "it") return rR(cx, cy, 16 * k, 34 * k, 3 * k, lip) + rR(cx, cy + .6 * k, 14 * k, 31 * k, 2.4 * k, RS(col, -.08)) +
      [-9, 0, 9].map((dy) => rR(cx, cy + dy * k, 2.6 * k, dy ? 5.4 * k : 2.6 * k, 1.3 * k, hole)).join("");
    return "";
  }
  function rplugHead(cx, cy, k, col, reg) {
    reg = reg || REG; const lt = RS(col, .35), dk = RS(col, -.35);
    let body;
    if (reg === "eu") body = rC(cx, cy, 15.5 * k, col) + rC(cx, cy, 15.5 * k, "none", ` stroke="${dk}" stroke-width="${f(.8 * k)}"`) + rC(cx, cy, 11 * k, lt, ` fill-opacity=".35"`) + rC(cx, cy, 7 * k, col) +
      `<path d="M${f(cx + 8 * k)} ${f(cy + 9 * k)}l${f(6 * k)} ${f(8 * k)}" stroke="${col}" stroke-width="${f(7 * k)}" stroke-linecap="round"/>`;
    else if (reg === "uk") body = rR(cx, cy + 2 * k, 24 * k, 27 * k, 4 * k, col) + rR(cx, cy - 4 * k, 18 * k, 10 * k, 3 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 16 * k, 8 * k, 6 * k, 2 * k, col);
    else if (reg === "au") body = rR(cx, cy + 1 * k, 21 * k, 19 * k, 3.5 * k, col) + rR(cx, cy - 2 * k, 15 * k, 7 * k, 2.4 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 11 * k, 7 * k, 5 * k, 2 * k, col);
    else if (reg === "ch") body = rR(cx, cy, 20 * k, 15 * k, 5 * k, col) + rR(cx, cy - 2 * k, 14 * k, 6 * k, 2.4 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 8.5 * k, 6 * k, 5 * k, 2 * k, col);
    else body = rR(cx, cy, 13 * k, 28 * k, 5 * k, col) + rR(cx, cy - 6 * k, 8 * k, 10 * k, 3 * k, lt, 0, ` fill-opacity=".35"`) + rR(cx, cy + 15 * k, 6 * k, 5 * k, 2 * k, col);
    return `<g transform="translate(${f(1.5 * k)} ${f(3 * k)})" opacity=".35">${body.replace(/fill="[^"]*"/g, 'fill="#000"').replace(/stroke="[^"]*"/g, 'stroke="#000"')}</g>` + body;
  }
  function rswitch(cx, cy, k, col, on) {
    return rR(cx, cy + .6 * k, 10 * k, 14 * k, 2 * k, "#000", 0, ` fill-opacity=".3"`) + rR(cx, cy, 10 * k, 14 * k, 2 * k, RS(col, -.08)) +
      rR(cx, on ? cy - 3 * k : cy + 3 * k, 8 * k, 6 * k, 1.5 * k, RS(col, on ? -.2 : .2)) + (on ? rR(cx, cy - 4.6 * k, 5 * k, 1.8 * k, .8 * k, "#e2402f") : "");
  }
  function slots(x, cx, cy, s, kind) {
    if (REG !== "us" && kind === "std") return rsock(cx, cy + .2 * s, s / 30, x.dev);
    const hole = x.dark ? "#000" : "#141416", sh = "#ffb35a";
    const nW = .085 * s, nH = .31 * s, hH = .25 * s, dx = .25 * s;
    let t = `<rect x="${f(cx - dx - nW / 2)}" y="${f(cy - nH / 2)}" width="${f(nW)}" height="${f(nH)}" rx=".4" fill="${hole}"/>`;
    if (kind === "tslot") t += `<rect x="${f(cx - dx - nW / 2 - .16 * s)}" y="${f(cy - nW / 2)}" width="${f(.16 * s + nW / 2)}" height="${f(nW)}" rx=".3" fill="${hole}"/>`;
    t += `<rect x="${f(cx + dx - nW / 2)}" y="${f(cy - hH / 2)}" width="${f(nW)}" height="${f(hH)}" rx=".4" fill="${hole}"/>`;
    const gy = cy + .47 * s, gr = .095 * s;
    t += `<path d="M${f(cx - gr)} ${f(gy + gr * .6)}V${f(gy)}A${f(gr)} ${f(gr)} 0 0 1 ${f(cx + gr)} ${f(gy)}V${f(gy + gr * .6)}Z" fill="${hole}"/>`;
    if (kind === "tr") t += `<rect x="${f(cx - dx - nW / 2 + .4)}" y="${f(cy - nH / 2 + .8)}" width="${f(nW - .8)}" height="${f(nH - 1.6)}" fill="${H().shade(x.dev, -.2)}"/><rect x="${f(cx + dx - nW / 2 + .4)}" y="${f(cy - hH / 2 + .8)}" width="${f(nW - .8)}" height="${f(hH - 1.6)}" fill="${H().shade(x.dev, -.2)}"/>`;
    void sh;
    return t;
  }
  const ovalFace = (x, cx, cy, s) => { const rx = .66 * s, ry = .58 * s; return face(x, `M${f(cx - rx)} ${f(cy)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy)}V${f(cy + ry * .15)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy + ry * .15)}Z`); };
  const LT = { T: "M0 0H3M1.5 0V5", E: "M3 0H0V5H3M0 2.5H2.4", S: "M3 .6C2.6 0 .4 0 .2 1.1 0 2.2 3 2.4 3 3.7 3 5 .4 5 0 4.3", R: "M0 5V0H2C3.2 0 3.2 2.6 2 2.6H0M1.6 2.6L3 5" };
  function word(x, w, cx, cy, s, col, op) {
    const k = s / 5, adv = 4.2 * k, x0 = cx - (w.length * adv - 1.2 * k) / 2;
    return w.split("").map((ch, i) => `<path d="${LT[ch]}" transform="translate(${f(x0 + i * adv)} ${f(cy - s / 2)}) scale(${k.toFixed(3)})" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${(.7 / k).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
  }
  const halo = (x, cx, cy, r, g) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url(g)}"/>`;
  function led(x, cx, cy, col, grad, r) {
    r = r || 1.3;
    return x.on ? `<g class="${P}breath">${halo(x, cx, cy, r * 5, grad)}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${col}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .4)}" fill="#fff" fill-opacity=".8"/>`
      : `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#000" fill-opacity=".45"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .6)}" fill="#fff" fill-opacity=".15"/>`;
  }
  const usbc = (x, cx, cy, w) => { w = w || 7; const h = w * .36; return `<path d="${rr(cx - w / 2, cy - h / 2, w, h, h / 2)}" fill="#0b0b0d"/><path d="${rr(cx - w * .32, cy - h * .16, w * .64, h * .32, h * .16)}" fill="#555a60"/><path d="${rr(cx - w / 2, cy - h / 2, w, h, h / 2)}" fill="none" stroke="#9aa0a6" stroke-opacity=".6" stroke-width=".4"/>`; };
  const usba = (x, cx, cy, w) => { w = w || 9; const h = w * .4; return `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx=".5" fill="#0b0b0d"/><rect x="${f(cx - w * .38)}" y="${f(cy - h * .32)}" width="${f(w * .76)}" height="${f(h * .3)}" fill="#3d73d9"/><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" rx=".5" fill="none" stroke="#9aa0a6" stroke-opacity=".6" stroke-width=".4"/>`; };
  // (bd = where the cord ends up at the bottom, from the plug's center; a top plug's cord swings past the lower outlet)
  function plug(x, cx, cy, s, col, bend) {
    if (!x.on) return "";
    const bd = bend == null ? 6 : bend;
    col = col || "#f2f2f0";
    if (REG !== "us") { const k = s / 30, yb = cy + 14 * k;
      return `<path d="M${f(cx)} ${f(yb)}C${f(cx)} ${f(yb + 16)} ${f(cx + bd)} ${f(yb + 20)} ${f(cx + bd)} 200" fill="none" stroke="${col}" stroke-width="4"/><path d="M${f(cx - 1)} ${f(yb)}C${f(cx - 1)} ${f(yb + 16)} ${f(cx + bd - 1)} ${f(yb + 20)} ${f(cx + bd - 1)} 200" fill="none" stroke="#fff" stroke-opacity=".35"/>` + rplugHead(cx, cy + .2 * s, k, col) + led(x, cx + 7 * k, cy + .2 * s - 6 * k, GRN, "hg", 1.1); }
    const w = .78 * s, h = .7 * s, d = rr(cx - w / 2, cy - h * .45, w, h, w * .2);
    return shd(x, d, 1.5, 3, .45) + `<path d="M${f(cx)} ${f(cy + h * .5)}C${f(cx)} ${f(cy + h + 10)} ${f(cx + bd)} ${f(cy + h + 14)} ${f(cx + bd)} 200" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="5" transform="translate(1.5 2)"/><path d="M${f(cx)} ${f(cy + h * .5)}C${f(cx)} ${f(cy + h + 10)} ${f(cx + bd)} ${f(cy + h + 14)} ${f(cx + bd)} 200" fill="none" stroke="${col}" stroke-width="4"/><path d="M${f(cx)} ${f(cy + h * .5)}C${f(cx)} ${f(cy + h + 10)} ${f(cx + bd)} ${f(cy + h + 14)} ${f(cx + bd)} 200" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1" transform="translate(-1 0)"/>` +
      `<path d="${d}" fill="${col}"/><path d="${d}" fill="${x.url("pv")}"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>` +
      `<path d="M${f(cx - w * .3)} ${f(cy - h * .2)}V${f(cy + h * .3)}M${f(cx - w * .12)} ${f(cy - h * .2)}V${f(cy + h * .3)}" stroke="#000" stroke-opacity=".12" stroke-width=".8"/>` + led(x, cx + w * .22, cy - h * .15, GRN, "hg", 1.1);
  }
  // ---------- (parts) Multi-Function: two receptacles = parts top + bottom (a floor box: left + right), each with its own
  // plug in and lit when on; outlet + USB / night light as two parts. A Device Image (no o.mf, no parts) is drawn as before;
  // as a Multi-Function Image (o.mf) o.parts holds only the ticked parts, a part left out is drawn off (no plug, no glow)
  // and the drawing's own LED follows any part on.
  const MFM = (o) => !!(o.mf || o.parts);
  const pon = (o, k) => (o.parts && o.parts[k] != null ? !!o.parts[k] : !o.mf && !!o.on);
  const xs = (x, on) => (on === x.on ? x : Object.assign({}, x, { on }));
  const pp = (x, k) => pon(x.o, k);
  const TB = [{ id: "top", name: "Top outlet", type: "switch" }, { id: "bottom", name: "Bottom outlet", type: "switch" }];
  const PARTS = { duplex: TB, "rocker-style-outlet": TB, gfci: TB, tamper: TB, tslot: TB, weather: TB, popup: TB, tvbox: TB, smart: TB,
    floor: [{ id: "left", name: "Left outlet", type: "switch" }, { id: "right", name: "Right outlet", type: "switch" }],
    usb: [{ id: "outlet", name: "Outlet", type: "switch" }, { id: "usb", name: "USB ports", type: "switch" }],
    night: [{ id: "outlet", name: "Outlet", type: "switch" }, { id: "light", name: "Night light", type: "switch" }] };
  const anyOn = (o, ps) => { let t = 0, a = 0; ps.forEach((p) => { if (o.parts && o.parts[p.id] != null) { t = 1; if (o.parts[p.id]) a = 1; } }); return t ? !!a : !o.mf && !!o.on; };
  // the two receptacles' plugs as a Multi-Function Image (top plug's cord swings left of the lower outlet)
  const plugs2 = (x, cx, yt, yb, s, col) => plug(xs(x, pp(x, "top")), cx, yt, s, col, -26) + plug(xs(x, pp(x, "bottom")), cx, yb, s, col);
  const downGlow = (x, cx, y, w, grad, op) => x.on ? `<g class="${P}breath" opacity="${f((op || .9) * x.B)}"><ellipse cx="${f(cx)}" cy="${f(y + 12)}" rx="${f(w * .75)}" ry="22" fill="${x.url(grad)}" filter="${x.url("gw")}"/></g>` : "";

  function invis(x, usbC, aura) {
    const X = 52, Y = 26, W = 96, Hh = 148, cx = 100;
    let s = downGlow(x, cx, Y + Hh, W, aura ? "lt" : "wm", 1);
    s += plate(x, X, Y, W, Hh, 7);
    [X + 12, X + W - 12].forEach((vx) => [0, 1, 2].forEach((i) => s += `<rect x="${vx - 3.5}" y="${Y + 12 + i * 3.2}" width="7" height="1.3" rx=".6" fill="#1a1b1d" fill-opacity="${x.dark ? .9 : .8}"/>`));
    const fx = cx - 23, fy = Y + 32, fw = 46, fh = 84;
    s += face(x, rr(fx, fy, fw, fh, 2.5));
    const S = 30; s += slots(x, cx, fy + 18, S, "std") + slots(x, cx, fy + 58, S, "std");
    const my = fy + fh / 2 + 1.5;
    s += `<rect x="${cx - 4.5}" y="${my - 1.8}" width="9" height="3.6" rx="1" fill="${x.on ? (aura ? "#fff" : "#eaf2ff") : "#000"}" fill-opacity="${x.on ? .9 : .18}"/>`;
    if (usbC) s += usbc(x, cx - 13, my, 6.2) + usbc(x, cx + 13, my, 6.2);
    s += plug(x, cx, fy + 60, S);
    const ly = Y + Hh - 16, cols = aura ? ["#ff5a5f", "#ffa94d", "#ffe066", "#69db7c", "#4dabf7", "#9775fa", "#f783ac"] : null;
    const n = 7;
    for (let i = 0; i < n; i++) {
      const lx = cx - 16 + i * (32 / (n - 1));
      const col = aura ? (x.on ? cols[i] : "#888") : (x.on ? "#ffffff" : "#999");
      s += `<rect x="${f(lx - 1.7)}" y="${ly - .7}" width="3.4" height="1.4" rx=".7" fill="${col}" fill-opacity="${x.on ? 1 : .45}"/>`;
    }
    if (!aura) s += `<circle cx="${cx + 1}" cy="${ly}" r="1" fill="${x.on ? BLU : "#777"}"/>`;
    if (x.on) s += `<rect class="${P}breath" x="${cx - 20}" y="${ly - 2.5}" width="40" height="5" rx="2.5" fill="${aura ? (x.o.color || "#f0f") : WARM}" fill-opacity=".35" filter="${x.url("gw")}"/>`;
    if (x.on) s += `<rect x="${X + 8}" y="${Y + Hh - 1.5}" width="${W - 16}" height="2" rx="1" fill="${aura ? (x.o.color || "#f0f") : WARM}" fill-opacity="${f(.8 * x.B)}"/>`;
    return s;
  }
  const STD = { X: 58, Y: 30, W: 84, Hh: 140, S: 31 };
  function regional(x, kind) {
    const dbl = kind === "double", r = REG, col = x.dev;
    let W, Hh, socks;
    if (r === "uk") { W = dbl ? 152 : 88; Hh = 88; socks = dbl ? [[58, 106, 82, 80], [128, 106, 152, 80]] : [[92, 106, 124, 80]]; }
    else if (r === "au") { W = dbl ? 124 : 116; Hh = 76; socks = dbl ? [[72, 108, 72, 80], [128, 108, 128, 80]] : [[80, 100, 124, 100]]; }
    else if (r === "it") { W = dbl ? 132 : 120; Hh = 80; socks = dbl ? [[82, 100], [118, 100]] : [[100, 100]]; }
    else { W = dbl ? 156 : 84; Hh = dbl ? 82 : 84; socks = dbl ? [[61, 100], [139, 100]] : [[100, 100]]; }
    if (kind === "usb" && r !== "au" && r !== "it") Hh += 18;
    const X = 100 - W / 2, Y = 100 - Hh / 2 + (kind === "usb" && r !== "au" && r !== "it" ? 9 : 0);
    let s = "";
    // (parts) each socket's own on: a double = top (first) + bottom (second), a single = the outlet part (else any part)
    const so = (i) => (!x.mf ? x.on : dbl ? pp(x, i ? "bottom" : "top") : kind === "usb" || kind === "night" ? pp(x, "outlet") : x.on);
    const uo = x.mf ? pp(x, "usb") : x.on, lo = x.mf ? pp(x, "light") : x.on;
    if (kind === "night") s += downGlow(xs(x, lo), 100, Y + Hh, W, "wm", .9);
    s += plate(x, X, Y, W, Hh, r === "uk" ? 3 : 6, r === "uk" ? [[X + 8, 100], [X + W - 8, 100]] : []);
    socks.forEach(([cx, cy, sx, sy], i) => {
      if (r === "eu" || r === "ch") s += `<path d="${rr(cx - 33, cy - 33, 66, 66, 5)}" fill="none" stroke="#000" stroke-opacity=".15" stroke-width=".8"/><path d="${rr(cx - 32, cy - 32, 64, 64, 4.5)}" fill="#fff" fill-opacity="${x.dark ? .04 : .25}"/>`;
      if (r === "it") s += face(x, rr(cx - 13, cy - 28, 26, 56, 2));
      s += rsock(cx, cy, r === "it" ? 1.25 : 1.3, col);
      if (sx != null) s += rswitch(sx, sy, 1.15, col, so(i));
    });
    const [px, py] = socks[0];
    if (kind === "usb") { const uy = r === "au" || r === "it" ? Y + Hh - 10 : Y + Hh - 12, ux = r === "au" ? socks[0][2] : 100;
      s += usba(x, ux - 9, uy, 9) + usbc(x, ux + 9, uy, 7) + (uo ? `<path d="M${ux + 1} ${uy - 6}l-2 3h2l-1.2 2.6" fill="none" stroke="${GRN}" stroke-width=".8" stroke-linecap="round"/>` : ""); }
    if (kind === "smart") s += led(x, X + W - 10, Y + Hh - 10, BLU, "hb", 1.2);
    if (kind === "night") { const ly = Y + Hh - 8; s += `<path d="${rr(100 - 22, ly - 2.5, 44, 5, 2.5)}" fill="${lo ? "#fff7e0" : "#d8d8d4"}" fill-opacity="${lo ? 1 : .55}"/>` + (lo ? `<rect class="${P}breath" x="74" y="${ly - 6}" width="52" height="12" rx="6" fill="${WARM}" fill-opacity="${f(.55 * x.B)}" filter="${x.url("gw")}"/>` : ""); }
    if (x.mf) return s + socks.map(([cx, cy], i) => plug(xs(x, so(i)), cx, cy - .2 * 30 * 1.3, 30 * 1.3, x.dark ? "#2e2f33" : "#f2f2f0")).join("");
    return s + plug(x, px, py - .2 * 30 * 1.3, 30 * 1.3, x.dark ? "#2e2f33" : "#f2f2f0");
  }
  function duplex(x, kind) {
    if (REG !== "us") return regional(x, "double");
    const { X, Y, W, Hh, S } = STD, cx = 100;
    let s = plate(x, X, Y, W, Hh, 3, [[cx, Y + Hh / 2]]);
    s += ovalFace(x, cx, Y + 40, S) + ovalFace(x, cx, Y + 98, S) + slots(x, cx, Y + 36, S, kind) + slots(x, cx, Y + 94, S, kind);
    if (kind === "tr") s += word(x, "TR", cx, Y + 64, 4.2, H().shade(x.dev, -.4), .8) + word(x, "TR", cx, Y + 122, 4.2, H().shade(x.dev, -.4), .8);
    return s + (x.mf ? plugs2(x, cx, Y + 39, Y + 97, S) : plug(x, cx, Y + 97, S));
  }
  function decora(x, kind, opt) {
    if (REG !== "us") return regional(x, kind === "usb" || kind === "smart" || kind === "night" ? kind : "plain");
    opt = opt || {};
    const { X, Y, W, Hh, S } = STD, cx = 100, fx = cx - 21, fy = Y + 28, fw = 42, fh = 84;
    const one = kind === "usb" || kind === "night", xo = x.mf && one ? xs(x, pp(x, "outlet")) : x;
    const xu = x.mf ? xs(x, pp(x, "usb")) : x, xl = x.mf ? xs(x, pp(x, "light")) : x;
    let s = "";
    if (kind === "night") s += downGlow(xl, cx, Y + Hh, W, "wm", .9);
    s += plate(x, X, Y, W, Hh, 3, kind === "night" ? [[cx, Y + 13]] : [[cx, Y + 13], [cx, Y + Hh - 13]]);
    s += face(x, rr(fx, fy, fw, fh, 2));
    const top = fy + 15, bot = fy + 61, kd = kind === "tslot" ? "tslot" : "std";
    s += slots(x, cx, top, S, kd) + slots(x, cx, bot, S, kd);
    const my = fy + 42;
    if (kind === "usb") {
      s += `<g transform="rotate(90 ${cx - 11} ${my})">${usba(x, cx - 11, my, 10)}</g><g transform="rotate(90 ${cx + 11} ${my})">${usbc(x, cx + 11, my, 8)}</g>`;
      s += xu.on ? `<path d="M${cx + 1} ${my - 4.6}l-2 3h2l-1.2 2.6" fill="none" stroke="${GRN}" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round"/>` + led(xu, cx, my + 5, GRN, "hg", .8) : led(xu, cx, my + 5, GRN, "hg", .8);
    } else if (kind === "gfci") {
      const b1 = rr(cx - 11, my - 8, 22, 6.5, 1), b2 = rr(cx - 11, my + 1, 22, 6.5, 1);
      s += `<path d="${b1}" fill="${H().shade(x.dev, -.08)}"/><path d="${b1}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/>` + word(x, "TEST", cx, my - 4.75, 2.6, "#000", .55);
      s += `<path d="${b2}" fill="${H().shade(x.dev, -.08)}"/><path d="${b2}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".5"/>` + word(x, "RESET", cx, my + 4.25, 2.6, "#000", .55);
      s += x.on ? led(x, cx + 16, fy + fh - 5, GRN, "hg", .9) : `<g class="${P}blink">${halo(x, cx + 16, fy + fh - 5, 4, "hr")}<circle cx="${cx + 16}" cy="${f(fy + fh - 5)}" r=".9" fill="${RED}"/></g>`;
    } else if (kind === "smart") {
      const b = rr(cx - 6, my - 4, 12, 8, 2);
      s += `<path d="${b}" fill="${H().shade(x.dev, -.06)}"/><path d="${b}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>` + led(x, cx, my, BLU, "hb", 1.1);
      s += `<path d="M${cx - 2.5} ${my + 6.5}a3 3 0 0 1 5 0M${cx - 4} ${my + 5}a5 5 0 0 1 8 0" fill="none" stroke="#000" stroke-opacity="${x.on ? .25 : .12}" stroke-width=".5"/>`;
    } else if (kind === "night") {
      const ly = Y + Hh - 14;
      s += `<path d="${rr(cx - 22, ly - 3, 44, 6, 3)}" fill="${xl.on ? "#fff7e0" : "#d8d8d4"}" fill-opacity="${xl.on ? 1 : .55}"/><path d="${rr(cx - 22, ly - 3, 44, 6, 3)}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"/>`;
      if (xl.on) s += `<rect class="${P}breath" x="${cx - 26}" y="${ly - 6}" width="52" height="12" rx="6" fill="${WARM}" fill-opacity="${f(.55 * x.B)}" filter="${x.url("gw")}"/>`;
      s += `<circle cx="${cx + 30}" cy="${ly}" r="1.4" fill="#1a1a1a" fill-opacity=".55"/><circle cx="${cx}" cy="${Y + Hh - 26}" r="2.2" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"/>`;
    }
    return s + (!x.mf ? plug(x, cx, bot + 3, S) : one ? plug(xo, cx, bot + 3, S) : plugs2(x, cx, top + 3, bot + 3, S));
  }

  const icons = [];
  const REG_IDS = { duplex: 1, "rocker-style-outlet": 1, usb: 1, smart: 1, night: 1, floor: 1, popup: 1, weather: 1, tvbox: 1 };
  const add = (id, name, colors, label, fn) => icons.push(Object.assign({ id, name, colors, picker: true, colorLabel: label,
    render: (o) => { REG = REG_IDS[id] && o.opt && o.opt.region || "us";
      const mf = !!PARTS[id] && MFM(o); if (mf) o = Object.assign({}, o, { on: anyOn(o, PARTS[id]) });
      try { const x = ctx(o); x.mf = mf; return fn(x); } finally { REG = "us"; } } }, REG_IDS[id] ? { options: [REG_OPT] } : {}, PARTS[id] ? { parts: PARTS[id] } : {}));
  const RGB = ["#ff4fd8", "#4dabf7", "#69db7c", "#ffa94d", "#9775fa", "#ffffff"];
  const auraCtx = (o) => { const x = ctx(Object.assign({}, o, { color: o.color2 || WH })); x.o = o; return x; };
  icons.push({ id: "hidden-plug-outlet", name: "Hidden plug outlet", colors: [WH, LA, IV, GY, BK, BN], picker: true, colorLabel: "Plate", render: (o) => { const x = ctx(o); return scene(x, "beige", null, invis(x, false, false)); } });
  icons.push({ id: "hidden-plug-light-ring", name: "Hidden plug, light ring", colors: RGB, picker: true, colorLabel: "Light", colors2: [WH, LA, IV, GY, BK, BN], picker2: true, colorLabel2: "Plate", render: (o) => { const x = auraCtx(o); return scene(x, "charcoal", null, invis(x, false, true)); } });
  icons.push({ id: "hidden-plug-usb-c", name: "Hidden plug, USB-C", colors: [WH, LA, IV, GY, BK, BN], picker: true, colorLabel: "Plate", render: (o) => { const x = ctx(o); return scene(x, "gray", null, invis(x, true, false)); } });
  icons.push({ id: "hidden-plug-usb-c-ring", name: "Hidden plug, USB-C ring", colors: RGB, picker: true, colorLabel: "Light", colors2: [WH, LA, IV, GY, BK, BN], picker2: true, colorLabel2: "Plate", render: (o) => { const x = auraCtx(o); return scene(x, "navy", null, invis(x, true, true)); } });

  add("duplex", "Standard duplex", PLATES, "Plate", (x) => scene(x, "sage", null, duplex(x, "std")));
  add("rocker-style-outlet", "Rocker-style outlet", [BK, WH, LA, IV, GY, BN], "Plate", (x) => scene(x, "blue", null, decora(x, "plain")));
  add("usb", "USB-A/C outlet", [BN, WH, BK, GY, LA, IV], "Plate", (x) => scene(x, "cream", null, decora(x, "usb")));
  add("gfci", "GFCI outlet", [WH, LA, IV, GY, BK, BN], "Plate", (x) => scene(x, "mint", null, decora(x, "gfci")));
  add("smart", "Smart outlet", [WH, BK, GY, LA, IV, BN], "Plate", (x) => scene(x, "plum", null, decora(x, "smart")));
  add("tamper", "Tamper-resistant", [LA, WH, IV, GY, BK, BN], "Plate", (x) => scene(x, "sky", null, duplex(x, "tr")));
  add("tslot", "20A T-slot", [GY, WH, IV, LA, BK, BN], "Plate", (x) => scene(x, "white", null, decora(x, "tslot")));
  add("night", "Night-light outlet", [WH, LA, IV, BK, GY, BN], "Plate", (x) => scene(x, "olive", null, decora(x, "night")));

  add("station", "Outlet shelf", [WH, BK, GY, LA, IV, BN], "Plate", (x) => {
    const { X, Y, W, S } = STD, cx = 100, Hh = 112;
    let s = plate(x, X, Y - 4, W, Hh, 3);
    s += ovalFace(x, cx, Y + 26, S) + slots(x, cx, Y + 22, S, "std") + ovalFace(x, cx, Y + 74, S) + slots(x, cx, Y + 70, S, "std");
    const sy = Y + Hh - 4, sd = `M${X - 4} ${sy}H${X + W + 4}L${X + W} ${sy + 9}H${X}Z`;
    s += shd(x, sd, 0, 4, .45) + `<path d="${sd}" fill="${x.url("dv")}"/><path d="M${X - 4} ${sy}H${X + W + 4}" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/><path d="${sd}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`;
    s += usba(x, cx - 26, sy + 4.5, 8) + usbc(x, cx + 26, sy + 4.5, 6.5);
    const pd = rr(cx + 6, sy - 64, 34, 64, 5);
    s += shd(x, pd, 2, 3, .45) + `<path d="${pd}" fill="#141518"/><path d="${rr(cx + 8, sy - 62, 30, 60, 4)}" fill="${x.on ? "#0f2235" : "#08090b"}"/>`;
    if (x.on) s += `<g class="${P}breath"><path d="M${cx + 24} ${sy - 40}l-5 9h4l-3 8 8-11h-4l3-6z" fill="${GRN}"/></g><rect x="${cx + 13}" y="${sy - 18}" width="20" height="3" rx="1.5" fill="#2b3a46"/><rect x="${cx + 13}" y="${sy - 18}" width="${f(20 * x.B)}" height="3" rx="1.5" fill="${GRN}"/>`;
    s += `<path d="M${cx + 8} ${sy - 62}L${cx + 22} ${sy - 62}L${cx + 8} ${sy - 30}Z" fill="#fff" fill-opacity=".06"/>`;
    s += `<path d="M${cx + 26} ${sy + 4}C${cx + 26} ${sy - 1} ${cx + 23} ${sy - 1} ${cx + 23} ${sy - 3}" fill="none" stroke="#e8e8e8" stroke-width="1.6"/>`;
    return scene(x, "rose", null, s);
  });

  add("dryer", "240V dryer outlet", [WH, IV, GY, BK, LA, BN], "Plate", (x) => {
    const cx = 100, cy = 98, X = 48, Y = 46;
    let s = plate(x, X, Y, 104, 104, 4, [[X + 10, Y + 10], [X + 94, Y + 94]]);
    s += face(x, circ(cx, cy, 30)) + `<circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;
    const k = "#121214";
    s += `<rect x="${cx - 19}" y="${cy - 5}" width="3.4" height="14" rx=".6" fill="${k}"/><rect x="${cx + 15.6}" y="${cy - 5}" width="3.4" height="14" rx=".6" fill="${k}"/>`;
    s += `<path d="M${cx - 3.6} ${cy - 23}H${cx + 3.6}V${cy - 17}A3.6 3.6 0 0 1 ${cx - 3.6} ${cy - 17}Z" fill="${k}"/>`;
    s += `<path d="M${cx - 6} ${cy + 10}H${cx + 2}V${cy + 23}H${cx - 1.4}V${cy + 13.4}H${cx - 6}Z" fill="${k}"/><circle cx="${cx}" cy="${cy}" r="1.6" fill="${k}" fill-opacity=".6"/>`;
    if (x.on) {
      const pd = circ(cx, cy, 25);
      s += shd(x, pd, 2, 4, .5) + `<path d="${pd}" fill="#2c2d31"/><path d="${pd}" fill="${x.url("pv")}"/><circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="#000" stroke-opacity=".35"/>` +
        `<path d="M${cx - 9} ${cy + 22}C${cx - 9} 170 ${cx - 2} 180 ${cx - 2} 200" fill="none" stroke="#2a2b2e" stroke-width="10"/><path d="M${cx - 12} ${cy + 22}C${cx - 12} 170 ${cx - 5} 180 ${cx - 5} 200" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="1.5"/>` + led(x, cx + 10, cy - 10, "#ffb84d", "wm", 1.3);
    }
    return scene(x, "gray", null, s);
  });

  add("weather", "In-use cover", [GY, WH, LA, BK], "Cover", (x) => {
    let tex = ""; for (let y = 16; y < 200; y += 18) tex += `<path d="M8 ${y}H192" stroke="#000" stroke-opacity=".3" stroke-width="2"/><path d="M8 ${y + 1.5}H192" stroke="#fff" stroke-opacity=".12"/><rect x="8" y="${y + 2}" width="184" height="16" fill="#000" fill-opacity=".04"/>`;
    const cx = 100, X = 56, Y = 26, W = 88, Hh = 146, h = H();
    let s = plate(x, X, Y, W, Hh, 6);
    const g = rr(cx - 19, Y + 24, 38, 80, 2);
    s += `<path d="${g}" fill="#f1f1ee"/><path d="${g}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`;
    const xx = Object.assign({}, x, { dev: "#f1f1ee", dark: false });
    s += slots(xx, cx, Y + 38, 28, "std") + slots(xx, cx, Y + 80, 28, "std") + `<rect x="${cx - 8}" y="${Y + 57}" width="16" height="5" rx="1" fill="#e2e2de" stroke="#000" stroke-opacity=".3" stroke-width=".4"/>`;
    s += x.on ? led(xx, cx + 13, Y + 59.5, GRN, "hg", .9) : `<g class="${P}blink"><circle cx="${cx + 13}" cy="${Y + 59.5}" r=".9" fill="${RED}"/></g>`;
    // (parts) a plug in each receptacle that is on, the top one's cord beside the lower one, both out through the notch
    const wp = (yy, dx) => `<path d="M${cx + dx} ${yy + 14}V${Y + Hh - 12}C${cx + dx} ${Y + Hh + 6} ${cx + 10 + dx} 186 ${cx + 10 + dx} 200" fill="none" stroke="#e57a2b" stroke-width="4.5"/><path d="M${cx - 1 + dx} ${yy + 16}V${Y + Hh - 12}" stroke="#fff" stroke-opacity=".3"/><path d="${rr(cx - 10, yy, 20, 16, 3)}" fill="#e57a2b" fill-opacity=".8"/>`;
    const lid = rr(X + 6, Y + 8, W - 12, Hh - 26, 8);
    s += `<path d="${lid}" fill="${h.mix(x.c, "#ffffff", .3)}" fill-opacity=".28"/><path d="${lid}" fill="none" stroke="${h.shade(x.c, -.35)}" stroke-width="1.4"/><path d="M${X + 14} ${Y + 14}V${Y + Hh - 30}" stroke="#fff" stroke-opacity=".45" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<path d="${rr(cx - 10, Y + 1, 20, 7, 2)}" fill="${x.url("dv")}" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>`;
    const ny = Y + Hh - 12;
    s += `<path d="${rr(cx - 9, ny - 4, 18, 8, 3)}" fill="#000" fill-opacity=".45"/>`;
    if (x.mf) s += (pp(x, "top") ? wp(Y + 28, -5) : "") + (pp(x, "bottom") ? wp(Y + 70, 0) : "");
    else if (x.on) s += `<path d="M${cx} ${Y + 84}V${ny}C${cx} ${ny + 18} ${cx + 10} 186 ${cx + 10} 200" fill="none" stroke="#e57a2b" stroke-width="4.5"/><path d="M${cx - 1} ${Y + 86}V${ny}" stroke="#fff" stroke-opacity=".3"/><path d="${rr(cx - 10, Y + 70, 20, 16, 3)}" fill="#e57a2b" fill-opacity=".8"/>`;
    return scene(x, ["#c7c3b8", "#a19c8f"], tex + speck(5, 30), s);
  });

  add("popup", "Pop-up counter", [SS, BK, WH], "Finish", (x) => {
    const cx = 100, top = 132, h = H();
    let tex = `<rect x="8" y="${top}" width="184" height="68" fill="#4d4a46"/><rect x="8" y="${top}" width="184" height="68" fill="url(#${x.id("stone")})"/><path d="M8 ${top}H192" stroke="#fff" stroke-opacity=".25"/>`;
    const r = rnd(9); for (let i = 0; i < 40; i++) tex += `<circle cx="${f(10 + r() * 180)}" cy="${f(top + 2 + r() * 64)}" r="${f(.4 + r() * 1.2)}" fill="${r() > .5 ? "#d9d3c7" : "#1e1c1a"}" fill-opacity=".4"/>`;
    for (let y = 18; y < top; y += 14) for (let xx = (y / 14) % 2 ? 8 : 22; xx < 192; xx += 28) tex += `<rect x="${xx}" y="${y}" width="27" height="13" fill="#fff" fill-opacity=".06" stroke="#000" stroke-opacity=".12" stroke-width=".6"/>`;
    const ring = `<ellipse cx="${cx}" cy="${top + 22}" rx="26" ry="7" fill="${x.url("pl")}"/><ellipse cx="${cx}" cy="${top + 22}" rx="26" ry="7" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>`;
    let s = ring;
    const extra = lg(x.id("stone"), [[0, "#6b665f"], [1, "#2e2b28"]], 0, 0, 0, 1) + lg(x.id("tw"), [[0, h.shade(x.c, -.4)], [.2, h.shade(x.c, .3)], [.55, x.c], [.85, h.shade(x.c, -.15)], [1, h.shade(x.c, -.45)]]);
    if (x.on) {
      const tH = 78 * (.7 + .3 * x.B), y0 = top + 22 - tH;
      s += `<path d="M${cx - 21} ${top + 22}V${y0}A21 6 0 0 1 ${cx + 21} ${y0}V${top + 22}Z" fill="url(#${x.id("tw")})"/><path d="M${cx - 21} ${top + 22}V${y0}A21 6 0 0 1 ${cx + 21} ${y0}V${top + 22}Z" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>`;
      s += `<ellipse cx="${cx}" cy="${y0}" rx="21" ry="6" fill="${x.url("pl")}"/><ellipse cx="${cx}" cy="${y0}" rx="21" ry="6" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>`;
      const xx = Object.assign({}, x, { dev: x.c === BK ? "#2a2b2e" : "#f1f1ee", dark: x.c === BK });
      [y0 + 16, y0 + 44].forEach((fy) => { if (fy + 14 < top + 18) s += `<path d="${rr(cx - 13, fy - 6, 26, 24, 3)}" fill="${xx.dev}"/><path d="${rr(cx - 13, fy - 6, 26, 24, 3)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".5"/>` + slots(xx, cx, fy + 2, 22, "std") + (x.mf ? led(xs(x, pp(x, fy < y0 + 30 ? "top" : "bottom")), cx + 17, fy - 1, GRN, "hg", .8) : ""); });
      s += led(x, cx + 15, y0 + 6, GRN, "hg", .9);
    } else s += `<ellipse cx="${cx}" cy="${top + 21}" rx="21" ry="5.4" fill="${x.url("pl")}"/><ellipse cx="${cx - 6}" cy="${top + 19.5}" rx="9" ry="1.6" fill="#fff" fill-opacity=".4"/><circle cx="${cx}" cy="${top + 21}" r="1.6" fill="#000" fill-opacity=".35"/>`;
    return scene(x, ["#e6e1d6", "#c4bdaf"], tex, s, extra);
  });

  add("floor", "Floor outlet", [BRASS, NICK, BRZ], "Finish", (x) => {
    let tex = ""; const r = rnd(21);
    for (let i = 0; i < 9; i++) { const y = 8 + i * 22; tex += `<rect x="8" y="${y}" width="184" height="22" fill="${["#8a5a33", "#9b6a3e", "#7d4f2c"][i % 3]}"/><path d="M8 ${y}H192" stroke="#000" stroke-opacity=".35"/>`; for (let k = 0; k < 4; k++) tex += `<path d="M8 ${f(y + 3 + r() * 16)}C60 ${f(y + 4 + r() * 14)} 130 ${f(y + 3 + r() * 16)} 192 ${f(y + 4 + r() * 14)}" fill="none" stroke="#2a1608" stroke-opacity=".18" stroke-width=".7"/>`; tex += `<path d="M${f(30 + r() * 140)} ${y}V${y + 22}" stroke="#000" stroke-opacity=".3"/>`; }
    const cx = 100, cy = 100, R = 52;
    let s = shd(x, circ(cx, cy, R), 1, 2, .5) + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${x.url("pl")}"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width=".8"/><circle cx="${cx}" cy="${cy}" r="${R - 4}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
    s += screw(x, cx, cy - R + 8) + screw(x, cx, cy + R - 8);
    const lid = (lx, open) => {
      const d = circ(lx, cy, 15);
      if (!open) return `<path d="${d}" fill="${x.url("pl")}"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".8"/><circle cx="${lx}" cy="${cy}" r="12" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/><path d="M${lx - 5} ${cy + 11}H${lx + 5}" stroke="#000" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/>`;
      const xx = Object.assign({}, x, { dev: "#2b2c30", dark: true });
      return `<path d="${d}" fill="#111"/>` + slots(xx, lx, cy - 3, 24, "std") + `<path d="M${lx - 15} ${cy - 15}A15 5 0 0 1 ${lx + 15} ${cy - 15}L${lx + 13} ${cy - 22}A13 4 0 0 0 ${lx - 13} ${cy - 22}Z" fill="${x.url("pl")}" stroke="#000" stroke-opacity=".4" stroke-width=".6"/>`;
    };
    const lo = x.mf ? pp(x, "left") : x.on, ro = x.mf && pp(x, "right");
    s += lid(cx - 20, lo) + lid(cx + 20, ro);
    if (lo) s += plug(xs(x, true), cx - 20, cy - 3, 24, "#2e2f33");
    if (ro) s += plug(xs(x, true), cx + 20, cy - 3, 24, "#2e2f33");
    return scene(x, ["#8a5a33", "#6b4426"], tex, s);
  });

  add("tvbox", "Recessed TV box", [WH, BK, GY, LA, IV, BN], "Plate", (x) => {
    const X = 44, Y = 50, W = 112, Hh = 100, cx = 100;
    let s = plate(x, X, Y, W, Hh, 4);
    const inn = rr(X + 9, Y + 9, W - 18, Hh - 18, 3);
    s += `<path d="${inn}" fill="#000" fill-opacity=".55"/><path d="${rr(X + 13, Y + 13, W - 26, Hh - 26, 2)}" fill="${H().shade(x.dev, -.25)}"/><path d="${rr(X + 13, Y + 13, W - 26, Hh - 26, 2)}" fill="url(#${x.id("pv")})"/>`;
    s += `<path d="M${X + 9} ${Y + 9}H${X + W - 9}L${X + W - 13} ${Y + 13}H${X + 13}Z" fill="#000" fill-opacity=".35"/>`;
    const dx = X + 36;
    s += face(x, rr(dx - 14, Y + 20, 28, 60, 2)) + slots(x, dx, Y + 32, 24, "std") + slots(x, dx, Y + 62, 24, "std");
    const bx = X + 78, br = rr(bx - 14, Y + 26, 28, 48, 4);
    s += `<path d="${br}" fill="#151517"/>`; for (let i = 0; i < 18; i++) s += `<path d="M${f(bx - 13 + i * 1.5)} ${Y + 27}V${Y + 73}" stroke="#3a3b3f" stroke-width=".6"/>`;
    s += `<path d="M${bx - 14} ${Y + 50}H${bx + 14}" stroke="#000" stroke-width="1.4"/>`;
    // (parts) a flat plug in each receptacle that is on, each cord into the brush plate, the TV cables up out of it
    const tvp = (yy) => `<path d="${rr(dx - 9, yy, 18, 9, 2)}" fill="#2a2b2f"/><path d="M${dx + 9} ${yy + 4}C${dx + 22} ${yy + 4} ${bx - 6} ${yy + 4} ${bx - 2} ${yy < Y + 40 ? yy + 12 : yy - 2}" fill="none" stroke="#2a2b2f" stroke-width="3"/>` + led(x, dx + 6, yy + 3, GRN, "hg", .9);
    if (x.mf && x.on) s += (pp(x, "top") ? tvp(Y + 24) : "") + (pp(x, "bottom") ? tvp(Y + 54) : "") + `<path d="M${bx - 2} ${Y + 50}C${bx + 4} ${Y + 30} ${bx + 6} ${Y + 20} ${bx + 6} 0" fill="none" stroke="#1d1e21" stroke-width="3.5"/><path d="M${bx + 5} ${Y + 50}C${bx + 10} ${Y + 30} ${bx + 12} ${Y + 20} ${bx + 12} 0" fill="none" stroke="#3a3c42" stroke-width="2"/>`;
    else if (x.on) s += `<path d="${rr(dx - 9, Y + 54, 18, 9, 2)}" fill="#2a2b2f"/><path d="M${dx + 9} ${Y + 58}C${dx + 22} ${Y + 58} ${bx - 6} ${Y + 58} ${bx - 2} ${Y + 52}" fill="none" stroke="#2a2b2f" stroke-width="3"/><path d="M${bx - 2} ${Y + 50}C${bx + 4} ${Y + 30} ${bx + 6} ${Y + 20} ${bx + 6} 0" fill="none" stroke="#1d1e21" stroke-width="3.5"/><path d="M${bx + 5} ${Y + 50}C${bx + 10} ${Y + 30} ${bx + 12} ${Y + 20} ${bx + 12} 0" fill="none" stroke="#3a3c42" stroke-width="2"/>` + led(x, dx + 6, Y + 57, GRN, "hg", .9);
    return scene(x, "charcoal", null, s);
  });

  const css = `
.hda-anim .hda-outlets-breath{animation:hda-outlets-breath 3s ease-in-out infinite}
@keyframes hda-outlets-breath{0%,100%{opacity:1}50%{opacity:.55}}
.hda-anim .hda-outlets-blink{animation:hda-outlets-blink 1.4s steps(1,end) infinite}
@keyframes hda-outlets-blink{0%,55%{opacity:1}56%,100%{opacity:.15}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-outlets-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "outlets",
    tab: "Outlets",
    group: "More",
    kind: "device",
    intro: "In-wall outlets: the InvisOutlet line (Pro, Aura, C Pro with USB-C, C Aura) plus common outlets from a plain duplex to GFCI, smart, floor and pop-up types. On means power on: LEDs and night-lights glow, a plug is in and its lamp is lit. The color is the plate or finish (the light on Aura models).",
    
    onWord: "On", offWord: "Off",
    css,
    icons,
  });
})();
