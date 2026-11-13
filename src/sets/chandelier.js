(function () {
  const H = window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const PI = Math.PI;

  const BRASS = ["#5e3f12", "#b8893a", "#fbe7a6"], GOLD = ["#6b4a0e", "#d4a63c", "#fff0b8"], IRON = ["#09090d", "#2b2c37", "#6d6f84"],
    RUST = ["#110c0a", "#3a2b23", "#a8673e"], CHROME = ["#3a3e4a", "#9aa0b2", "#f4f6fb"], NICKEL = ["#4a4d58", "#a9acb8", "#e8eaf0"],
    BRONZE = ["#2a1a0e", "#6e4a2a", "#c9965e"], WPAINT = ["#7d7788", "#ddd7e3", "#ffffff"], CHAMP = ["#6e5a3a", "#cdb488", "#fff4dc"];

  function ctx(o) {
    const c = o.color || "#ffc477", on = !!o.on, lv = o.level == null ? 1 : o.level;
    const L = on ? .3 + .7 * lv : 0;
    const id = (s) => `${o.uid}-${s}`, url = (s) => `url(#${o.uid}-${s})`;
    return { c, on, L, id, url, hot: H.mix(c, "#ffffff", .6), op: (k) => (k * L).toFixed(2), tint: (col, k) => (on ? H.mix(col, c, k * L) : col) };
  }
  const stops = (s) => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a == null ? "" : ` stop-opacity="${a}"`}/>`).join("");
  const lg = (id, s, x2 = 1, y2 = 0) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops(s)}</linearGradient>`;
  const rg = (id, s, cx = .5, cy = .5, r = .5) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(s)}</radialGradient>`;
  const metal = (id, P) => lg(id, [[0, P[0]], [.28, P[2]], [.5, P[1]], [.8, P[0]], [1, H.shade(P[0], -.3)]]);

  function defs(x, extra) {
    const { c, id, hot, tint } = x;
    return `<defs>
${rg(id("halo"), [[0, c, .8], [.45, c, .26], [1, c, 0]])}
${rg(id("pool"), [[0, c, .55], [1, c, 0]])}
${lg(id("cone"), [[0, c, .55], [.5, c, .18], [1, c, 0]], 0, 1)}
${rg(id("fill"), [[0, "#ffffff", 1], [.4, hot, 1], [1, c, .85]], .5, .6, .62)}
${rg(id("gl"), [[0, "#ffffff", .5], [.35, "#ffffff", .1], [.85, "#ffffff", .03], [1, "#ffffff", .22]], .34, .28, .75)}
${metal(id("brs"), BRASS)}${metal(id("gld"), GOLD)}${metal(id("blk"), IRON)}${metal(id("chr"), CHROME)}${metal(id("nkl"), NICKEL)}${metal(id("rst"), RUST)}${metal(id("wpt"), WPAINT)}${metal(id("chp"), CHAMP)}
${lg(id("ivo"), [[0, "#a99e88"], [.32, "#fffaf0"], [.6, "#eee6d6"], [1, "#8f846f"]])}
${lg(id("wax"), [[0, "#6a3c12"], [.32, "#f2c27e"], [.6, "#cf9550"], [1, "#55300c"]])}
${lg(id("xt"), [[0, "#ffffff", .95], [.33, tint("#bcd6ff", .6), .5], [.55, "#ffffff", .9], [.8, tint("#7f9cc8", .55), .55], [1, "#ffffff", .75]], 1, 1)}
${rg(id("bd"), [[0, "#ffffff"], [.45, tint("#d6e6ff", .6)], [1, tint("#56688f", .5)]], .35, .3, .7)}
${extra || ""}</defs>`;
  }
  const svg = (x, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}${body}</svg>`;

  const hl = (d, a, w) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${a}" stroke-width="${w}" stroke-linecap="round"/>`;
  const tube = (d, w, P, cap) => { cap = cap || "round"; return `<path d="${d}" fill="none" stroke="${P[0]}" stroke-width="${w}" stroke-linecap="${cap}"/><path d="${d}" fill="none" stroke="${P[1]}" stroke-width="${f(w * .6)}" stroke-linecap="${cap}"/><path d="${d}" fill="none" stroke="${P[2]}" stroke-opacity=".8" stroke-width="${f(w * .22)}" stroke-linecap="${cap}" transform="translate(-${f(w * .14)} -${f(w * .14)})"/>`; };
  const canopy = (x, cx, w, m) => `<rect x="${cx - w / 2}" y="2" width="${w}" height="3.4" rx="1.4" fill="${x.url(m)}"/>
<path d="M${cx - w / 2} 5 h${w} l-2.4 5.6 h-${w - 4.8} Z" fill="${x.url(m)}"/><path d="M${cx - w / 2 + 2.4} 10.6 h${w - 4.8}" stroke="#000" stroke-opacity=".35"/>
<rect x="${cx - 2.6}" y="10.4" width="5.2" height="5" rx="1" fill="${x.url(m)}"/>`;
  function chain(cx, y0, y1, P) {
    let s = "";
    for (let y = y0, i = 0; y < y1 - 1; y += 4.4, i++) s += i % 2
      ? `<rect x="${f(cx - .9)}" y="${f(y - .4)}" width="1.8" height="5.4" rx=".9" fill="${P[1]}"/>`
      : `<ellipse cx="${cx}" cy="${f(y + 2.2)}" rx="2.3" ry="3" fill="none" stroke="${P[0]}" stroke-width="1.7"/><ellipse cx="${cx}" cy="${f(y + 2.2)}" rx="2.3" ry="3" fill="none" stroke="${P[2]}" stroke-opacity=".75" stroke-width=".6"/>`;
    return s;
  }
  const chainLine = (x1, y1, x2, y2, P) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${P[0]}" stroke-width="2.2" stroke-dasharray="3.4 1.2"/><path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${P[2]}" stroke-opacity=".7" stroke-width=".8" stroke-dasharray="3.4 1.2"/>`;
  const cable = (x1, y1, x2, y2, a) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="#c9cbd8" stroke-opacity="${a || .55}" stroke-width=".7"/>`;
  const halo = (x, cx, cy, r, k) => x.on ? `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url("halo")}" opacity="${x.op(k || .6)}"/>` : "";
  const pool = (x, cx, rx, k) => x.on ? `<ellipse cx="${cx}" cy="191" rx="${rx}" ry="6" fill="${x.url("pool")}" opacity="${x.op(k || .6)}"/>` : "";
  function beam(x, cx, y, hw, sp, k) {
    if (!x.on) return ""; k = k || 1; const y2 = 196;
    return `<path d="M${f(cx - hw)} ${y} L${f(cx - hw - sp)} ${y2} L${f(cx + hw + sp)} ${y2} L${f(cx + hw)} ${y} Z" fill="${x.url("cone")}" opacity="${x.op(.45 * k)}"/>` + pool(x, cx, hw + sp + 8, .8 * k);
  }
  function cr(p) {
    let d = `M${f(p[0][0])} ${f(p[0][1])}`;
    for (let i = 0; i < p.length - 1; i++) { const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ` C${f(b[0] + (c[0] - a[0]) / 6)} ${f(b[1] + (c[1] - a[1]) / 6)} ${f(c[0] - (e[0] - b[0]) / 6)} ${f(c[1] - (e[1] - b[1]) / 6)} ${f(c[0])} ${f(c[1])}`; }
    return d;
  }
  const lathe = (cx, pr) => cr(pr.map(([y, w]) => [cx + w, y])) + cr(pr.slice().reverse().map(([y, w]) => [cx - w, y])).replace(/^M/, " L") + " Z";
  const ring = (n, cx, cy, rx, ry, off) => Array.from({ length: n }, (_, i) => { const a = i / n * 2 * PI + (off || 0); return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), d: Math.sin(a), c: Math.cos(a), i }; });
  const byD = (a, b) => a.d - b.d;
  const backs = (a) => a.filter((p) => p.d < 0).sort(byD), fronts = (a) => a.filter((p) => p.d >= 0).sort(byD);

  const FT = "M0 -15 C2.7 -10.6 4.3 -7.2 4.3 -4.3 C4.3 -1.3 2.4 .4 0 .4 C-2.4 .4 -4.3 -1.3 -4.3 -4.3 C-4.3 -7.2 -2.7 -10.6 0 -15 Z";
  function bulb(x, cx, by, s, i) {
    const lit = x.on ? `<g class="hda-chandelier-flk" style="animation-delay:-${f((i * .53) % 2.2)}s"><path d="${FT}" fill="${x.url("fill")}" opacity="${x.op(1)}"/><path d="M0 -7.5 V-2.4" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity="${x.op(1)}"/></g>`
      : `<path d="${FT}" fill="#fff" fill-opacity=".07"/><path d="M-.9 -8 L0 -6.8 L.9 -8 M0 -6.8 V-1" fill="none" stroke="#8a7a62" stroke-width=".5"/>`;
    return `<g transform="translate(${f(cx)} ${f(by)}) scale(${f(s)})"><rect x="-2.6" y="-1" width="5.2" height="2.2" rx=".6" fill="#d8cfbe"/>${lit}<path d="${FT}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".5" stroke-width=".5"/><path d="M-2.4 -8 C-3.2 -6 -3.2 -3.6 -2 -2" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".7" stroke-linecap="round"/></g>`;
  }
  function candle(x, px, py, h, P, s, i, sl) {
    s = s || 1; const w = 3.2 * s;
    return `<path d="M${f(px - 7 * s)} ${f(py)} C${f(px - 6 * s)} ${f(py + 4.2 * s)} ${f(px + 6 * s)} ${f(py + 4.2 * s)} ${f(px + 7 * s)} ${f(py)} Z" fill="${P[0]}"/>
<ellipse cx="${f(px)}" cy="${f(py)}" rx="${f(7 * s)}" ry="${f(1.9 * s)}" fill="${P[1]}"/><ellipse cx="${f(px - s)}" cy="${f(py - .3 * s)}" rx="${f(4.4 * s)}" ry="${f(.9 * s)}" fill="${P[2]}" fill-opacity=".55"/>
<rect x="${f(px - w)}" y="${f(py - h)}" width="${f(2 * w)}" height="${f(h)}" rx="${f(.7 * s)}" fill="${x.url(sl || "ivo")}"/>
<path d="M${f(px - w)} ${f(py - h + .6)} q${f(w * .5)} ${f(3.4 * s)} ${f(w * .9)} 0 q${f(w * .3)} ${f(5.6 * s)} ${f(w * .7)} 0" fill="#fff" fill-opacity=".3"/>` + bulb(x, px, py - h, .95 * s, i);
  }
  const flameHalo = (x, px, py, h, s, r, k) => halo(x, px, py - h - 7 * s, r * s, k || .75);

  const PR = {
    tear: { d: "M0 0 C3.2 4.5 4.4 9 2.6 13 C1.6 15.4 -1.6 15.4 -2.6 13 C-4.4 9 -3.2 4.5 0 0 Z", fc: "M0 1 V15 M-3.6 8 L0 15 L3.6 8 M-3.6 8 L0 4 L3.6 8", c: 9 },
    spear: { d: "M0 0 L2.3 3.4 L1.7 21 L0 27 L-1.7 21 L-2.3 3.4 Z", fc: "M0 0 V27 M-2.3 3.4 H2.3 M-1.7 21 H1.7", c: 12 },
    oct: { d: "M-1.6 0 H1.6 L4 2.6 V6.4 L1.6 9 H-1.6 L-4 6.4 V2.6 Z", fc: "M-4 2.6 L4 6.4 M4 2.6 L-4 6.4 M0 0 V9", c: 4.5 },
    diamond: { d: "M0 0 L3.6 8 L0 17 L-3.6 8 Z", fc: "M-3.6 8 H3.6 M0 0 V17", c: 8 },
  };
  function spark(x, cx, cy, r, i) {
    if (!x.on) return "";
    const q = r * .18;
    return `<g opacity="${x.op(1)}"><path class="hda-chandelier-tw" style="animation-delay:-${f((i * .61) % 2.8)}s" d="M${f(cx)} ${f(cy - r)} L${f(cx + q)} ${f(cy - q)} L${f(cx + r)} ${f(cy)} L${f(cx + q)} ${f(cy + q)} L${f(cx)} ${f(cy + r)} L${f(cx - q)} ${f(cy + q)} L${f(cx - r)} ${f(cy)} L${f(cx - q)} ${f(cy - q)} Z" fill="#fff"/></g>`;
  }
  function prism(x, cx, y, s, k, i, sp, pin) {
    pin = pin == null ? 3 : pin; const p = PR[k], ty = y + pin * s;
    return `<path d="M${f(cx)} ${f(y)} V${f(ty)}" stroke="#ddd6c2" stroke-opacity=".7" stroke-width=".5"/><g transform="translate(${f(cx)} ${f(ty)}) scale(${f(s)})"><path d="${p.d}" fill="none" stroke="#2a2348" stroke-opacity=".3" stroke-width="${f(1.4 / s)}"/><path d="${p.d}" fill="${x.url("xt")}" stroke="#fff" stroke-opacity="${x.on ? .85 : .55}" stroke-width="${f(.5 / s)}"/><path d="${p.fc}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f(.4 / s)}"/></g>` + (sp ? spark(x, cx + s * .6, ty + p.c * s, 3 + s * 1.8, i) : "");
  }
  function festoon(x, ax, ay, bx, by, sag, r, n) {
    const mx = (ax + bx) / 2, my = (ay + by) / 2 + sag * 2; let s = "";
    for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t, px = u * u * ax + 2 * u * t * mx + t * t * bx, py = u * u * ay + 2 * u * t * my + t * t * by;
      s += `<circle cx="${f(px)}" cy="${f(py)}" r="${r}" fill="${x.url("bd")}"/>`; }
    return s;
  }
  const beads = (d, col, w, gap, a) => `<path d="${d}" fill="none" stroke="#2a2348" stroke-opacity="${f(.3 * (a == null ? 1 : a))}" stroke-width="${f(w + .9)}" stroke-dasharray="0 ${gap}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-opacity="${a == null ? 1 : a}" stroke-width="${w}" stroke-dasharray="0 ${gap}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity="${f(.65 * (a == null ? 1 : a))}" stroke-width="${f(w * .38)}" stroke-dasharray="0 ${gap}" stroke-linecap="round" transform="translate(-${f(w * .14)} -${f(w * .16)})"/>`;
  const globe = (x, cx, cy, r, i) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.on ? x.url("fill") : "rgba(255,255,255,.07)"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>${x.on ? "" : `<path d="M${f(cx - r * .4)} ${f(cy + r * .1)} q${f(r * .2)} ${f(-r * .5)} ${f(r * .4)} 0 q${f(r * .2)} ${f(r * .5)} ${f(r * .4)} 0" fill="none" stroke="#8a7a62" stroke-width=".5"/>`}
<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".5" stroke-width=".5"/><ellipse cx="${f(cx - r * .35)}" cy="${f(cy - r * .4)}" rx="${f(r * .28)}" ry="${f(r * .18)}" fill="#fff" fill-opacity=".7"/>`;
  const PEAR = "M-3.6 0 C-3.6 5 -9 7 -9 15 C-9 21.5 -5 25 0 25 C5 25 9 21.5 9 15 C9 7 3.6 5 3.6 0 Z";
  const PFIL = "M-1.4 1 L-4 13 M1.4 1 L4 13 M-4.2 14 C-4.2 19 -2.4 19 -1.4 14.4 C-.8 19 .8 19 1.4 14.4 C2.4 19 4.2 19 4.2 14";
  function pear(x, cx, cy, s, up, i) {
    const lit = x.on ? `<path d="${PEAR}" fill="${x.c}" fill-opacity="${x.op(.3)}"/><g class="hda-chandelier-flk" style="animation-delay:-${f((i * .7) % 2.2)}s"><path d="${PFIL}" fill="none" stroke="${x.c}" stroke-width="2.6" stroke-opacity="${x.op(.6)}" stroke-linecap="round"/><path d="${PFIL}" fill="none" stroke="${H.mix(x.hot, "#fff", .5)}" stroke-width=".9" stroke-linecap="round"/></g>`
      : `<path d="${PEAR}" fill="#fff" fill-opacity=".05"/><path d="${PFIL}" fill="none" stroke="#6b4e2e" stroke-width=".7"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s} ${up ? -s : s})"><rect x="-4.4" y="-8" width="8.8" height="8.4" rx="1.4" fill="${x.url("brs")}"/><path d="M-4.4 -5.4 H4.4 M-4.4 -3 H4.4" stroke="#3d2a10" stroke-opacity=".6" stroke-width=".6"/>${lit}
<path d="${PEAR}" fill="${x.url("gl")}" stroke="#fff" stroke-opacity=".42" stroke-width=".6"/><path d="M-6 12 C-6.6 15 -6 18 -4 20" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round"/></g>`;
  }
  const curl = (cx, cy, r, dir, P) => tube(`M${f(cx)} ${f(cy)} c${f(dir * r)} 0 ${f(dir * r)} ${f(r * 1.4)} 0 ${f(r * 1.4)} c${f(-dir * r * .7)} 0 ${f(-dir * r * .7)} ${f(-r * .9)} ${f(-dir * r * .1)} ${f(-r * .9)}`, 1.6, P);

  const WARM = "#ffc477", SOFT = "#ffe2b8", DAY = "#eef4ff", CANDLE = "#ffb35c";
  const C1 = [WARM, SOFT, DAY, CANDLE, "#ff9fb6"], C2 = [SOFT, WARM, DAY, "#8fd0ff", "#b9a6ff"], C3 = [WARM, SOFT, DAY, "#ffa94d", "#9ef0c4"];
  const base = (o) => Object.assign({ picker: true, colorLabel: "Light", cast: "around" }, o);

  const icons = [
    base({ id: "crystal", name: "Classic crystal", colors: [SOFT, WARM, DAY, "#b9a6ff", "#ff9fb6"], glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), P = BRASS, lo = ring(6, 100, 120, 64, 15, PI / 6), up = ring(5, 100, 80, 32, 7, -PI / 2 + .6);
      const sc = (p) => .86 + .14 * (p.d + 1) / 2;
      const low = (p) => tube(`M${f(100 + (p.x - 100) * .16)} 117 C${f(100 + (p.x - 100) * .6)} 136 ${f(p.x)} ${f(p.y + 16)} ${f(p.x)} ${f(p.y + 2)}`, 3.2 * sc(p), P) + candle(x, p.x, p.y, 13 * sc(p), P, sc(p), p.i);
      const upp = (p) => tube(`M100 90 C${f(100 + (p.x - 100) * .6)} 98 ${f(p.x)} ${f(p.y + 10)} ${f(p.x)} ${f(p.y + 2)}`, 2.6, P) + candle(x, p.x, p.y, 11, P, .8, p.i + 6);
      let sw = ["", ""], dr = "";
      lo.forEach((a, i) => { const b = lo[(i + 1) % 6], k = (a.d + b.d) / 2 < 0 ? 0 : 1, sag = 9 + 3 * (a.d + b.d);
        sw[k] += festoon(x, a.x, a.y + 4, b.x, b.y + 4, sag, k ? 1.6 : 1.3, 10);
        if (k) { dr += prism(x, (a.x + b.x) / 2, (a.y + b.y) / 2 + 4 + sag, .8, "tear", i, true); } });
      fronts(lo).forEach((p) => { dr += prism(x, p.x, p.y + 4, .62, "spear", p.i + 3, p.i % 2 === 0); });
      let du = ""; fronts(up).forEach((p) => { du += prism(x, p.x, p.y + 3, .42, "tear", p.i, false, 2); });
      const bowl = lathe(100, [[112, 9], [115, 20], [120, 25], [126, 21], [131, 12], [134, 5]]);
      return svg(x, halo(x, 100, 104, 98, .42) + pool(x, 100, 74, .45) + lo.concat(up).map((p) => flameHalo(x, p.x, p.y, 13, 1, 17)).join("") +
        canopy(x, 100, 26, "brs") + chain(100, 15, 38, P) + backs(lo).map(low).join("") + sw[0] +
        `<path d="${lathe(100, [[37, 3], [42, 6.5], [48, 9], [54, 6], [60, 4.4], [68, 7], [76, 4], [96, 4], [104, 7.5], [112, 4]])}" fill="${x.url("brs")}"/>${hl("M96 46 V52 M97.6 70 V74", .5, 1.2)}
<ellipse cx="100" cy="90" rx="8" ry="2" fill="${P[1]}"/>` + backs(up).map(upp).join("") + fronts(up).map(upp).join("") + du +
        `<path d="${bowl}" fill="${x.url("xt")}" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/>${[-16, -8, 0, 8, 16].map((k) => `<path d="M${100 + k} 115 Q${f(100 + k * 1.2)} 124 ${f(100 + k * .5)} 133" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/>`).join("")}
<ellipse cx="100" cy="115" rx="20" ry="3.6" fill="none" stroke="${x.url("brs")}" stroke-width="2.4"/>` + fronts(lo).map(low).join("") + sw[1] + dr +
        `<path d="${lathe(100, [[134, 3], [138, 5], [142, 2.6]])}" fill="${x.url("brs")}"/><circle cx="100" cy="148" r="5.4" fill="${x.url("bd")}"/>` + prism(x, 100, 151, 1.35, "tear", 9, true, 1.4) +
        spark(x, 88, 125, 5, 2) + spark(x, 113, 119, 4, 5));
    } }),

    base({ id: "candle", name: "Candle arms", colors: C1, glow: { x: .5, y: .45, r: 1.2 }, render(o) {
      const x = ctx(o), P = IRON, A = ["#0b0a0c", "#2e2a2a", "#9b8656"], pts = ring(6, 100, 112, 72, 16, PI / 6);
      const sc = (p) => .86 + .14 * (p.d + 1) / 2;
      const arm = (p) => { const s = sc(p), mx = 100 + (p.x - 100) * .5;
        return tube(`M100 64 C${f(100 + (p.x - 100) * .45)} 62 ${f(100 + (p.x - 100) * .6)} ${f(p.y - 2)} ${f(100 + (p.x - 100) * .78)} ${f(p.y + 9)}`, 2.1 * s, A) +
          (p.d >= -.2 ? curl(100 + (p.x - 100) * .3, 66, 3 * s, p.x > 100 ? 1 : -1, A) : "") +
          tube(`M${f(100 + (p.x - 100) * .05)} 126 C${f(100 + (p.x - 100) * .7)} 140 ${f(p.x)} ${f(p.y + 24)} ${f(p.x)} ${f(p.y + 2)}`, 3.4 * s, A) +
          (p.d >= -.2 ? curl(100 + (p.x - 100) * .5, p.y + 15 + 6 * p.d, 3.4 * s, p.x > 100 ? -1 : 1, A) : "") + candle(x, p.x, p.y, 19 * s, P, s, p.i); };
      return svg(x, halo(x, 100, 96, 98, .42) + pool(x, 100, 80, .45) + pts.map((p) => flameHalo(x, p.x, p.y, 19, 1, 18)).join("") +
        canopy(x, 100, 26, "blk") + chain(100, 15, 36, A) + backs(pts).map(arm).join("") +
        `<path d="${lathe(100, [[35, 2.6], [39, 5.4], [44, 3], [58, 3], [64, 6.4], [70, 3], [108, 3], [117, 8], [125, 9.5], [131, 6], [137, 3], [145, 5.4], [151, 2], [160, .5]])}" fill="${x.url("blk")}"/>
${hl("M97.6 72 V106 M95 120 V128 M96.6 63 V66", .22, 1.1)}<ellipse cx="100" cy="125" rx="9.4" ry="2.4" fill="none" stroke="${A[2]}" stroke-opacity=".5" stroke-width=".7"/>` +
        fronts(pts).map(arm).join(""));
    } }),

    base({ id: "wagon", name: "Wagon wheel", colors: C3, glow: { x: .5, y: .45, r: 1.25 }, render(o) {
      const x = ctx(o), P = IRON, cy = 106, pts = ring(8, 100, cy, 72, 18.4, PI / 8), ch = ring(4, 100, cy, 70, 18, PI / 4);
      const ex = lg(x.id("wd"), [[0, "#d9a466"], [.45, "#9a6436"], [1, "#5c3517"]], 0, 1) + lg(x.id("wds"), [[0, "#4a2a12"], [.5, "#7a4a24"], [1, "#2e1a0a"]]);
      let sp = ""; for (let k = 0; k < 12; k++) { const a = k / 12 * 2 * PI + .13, c = Math.cos(a), s = Math.sin(a);
        const d = `M${f(100 + 9 * c)} ${f(cy + 1 + 3 * s)} L${f(100 + 68 * c)} ${f(cy + 2 + 16.5 * s)}`;
        sp += `<path d="${d}" stroke="#4a2a12" stroke-width="3.6" stroke-linecap="round"/><path d="${d}" stroke="#b07a46" stroke-width="2.2"/><path d="${d}" stroke="#f0c48a" stroke-opacity=".5" stroke-width=".7" transform="translate(0 -.7)"/>`; }
      const cdl = (p) => candle(x, p.x, p.y - 1, 12, P, .9 + .1 * p.d, p.i);
      const top = (p) => [100 + (p.x - 100) * .12, 36 + (p.y - cy) * .1];
      return svg(x, halo(x, 100, 90, 98, .42) + pool(x, 100, 84, .5) + pts.map((p) => flameHalo(x, p.x, p.y - 1, 12, 1, 17)).join("") +
        canopy(x, 100, 24, "blk") + chain(100, 15, 32, P) + `<ellipse cx="100" cy="35" rx="5" ry="2" fill="none" stroke="${P[1]}" stroke-width="2"/>` +
        backs(ch).map((p) => chainLine(...top(p), p.x, p.y - 1, P)).join("") +
        `<path d="M22 ${cy} A78 20 0 0 0 178 ${cy} V${cy + 6} A78 20 0 0 1 22 ${cy + 6} Z" fill="url(#${x.id("wds")})"/>
<path d="M32 ${cy} A68 16 0 0 1 168 ${cy} V${cy + 5} A68 16 0 0 0 32 ${cy + 5} Z" fill="#2a170a"/>` + sp +
        `<path d="M89 ${cy} V${cy + 7} A11 3.4 0 0 0 111 ${cy + 7} V${cy} Z" fill="#5c3517"/><ellipse cx="100" cy="${cy}" rx="11" ry="3.4" fill="url(#${x.id("wd")})"/><ellipse cx="100" cy="${cy}" rx="4.4" ry="1.4" fill="${x.url("blk")}"/>
<path d="M22 ${cy} a78 20 0 1 0 156 0 a78 20 0 1 0 -156 0 Z M32 ${cy} a68 16 0 1 1 136 0 a68 16 0 1 1 -136 0 Z" fill-rule="evenodd" fill="url(#${x.id("wd")})"/>
<ellipse cx="100" cy="${cy}" rx="73" ry="18" fill="none" stroke="#3a200c" stroke-opacity=".35" stroke-width=".6" stroke-dasharray="14 6 30 8"/>
<path d="M22 ${cy} A78 20 0 0 0 178 ${cy}" fill="none" stroke="#17171d" stroke-width="2.4"/><path d="M22 ${cy + 6} A78 20 0 0 0 178 ${cy + 6}" fill="none" stroke="#17171d" stroke-width="2"/>
${hl(`M30 ${cy - 6} A76 19 0 0 1 120 ${cy - 19}`, .22, 1.2)}` + backs(pts).map(cdl).join("") + fronts(pts).map(cdl).join("") +
        fronts(ch).map((p) => chainLine(...top(p), p.x, p.y - 1, P)).join(""), ex);
    } }),

    base({ id: "farmhouse", name: "Farmhouse cage", colors: C1, glow: { x: .5, y: .55, r: 1.1 }, render(o) {
      const x = ctx(o), P = IRON, c4 = ring(4, 100, 134, 19, 4.4, PI / 4);
      const bar = (d, w) => `<path d="${d}" fill="none" stroke="#08080b" stroke-width="${w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#4a4c5c" stroke-width="${f(w * .35)}" stroke-linejoin="round" transform="translate(-.5 -.3)"/>`;
      const cdl = (p) => tube(`M100 144 L${f(p.x)} ${f(p.y + 6)} V${f(p.y + 1)}`, 1.8, P) + candle(x, p.x, p.y, 14, P, 1, p.i);
      return svg(x, halo(x, 100, 106, 92, .45) + pool(x, 100, 70, .5) + c4.map((p) => flameHalo(x, p.x, p.y, 14, 1, 18)).join("") +
        canopy(x, 100, 24, "blk") + chain(100, 15, 34, P) +
        `<path d="M54 64 L92 37 L108 37 L146 64 L100 56 Z" fill="#0c0c10"/>` + bar("M100 56 V142 M54 64 L100 56 L146 64 M54 150 L100 142 L146 150", 1.4) +
        backs(c4).map(cdl).join("") + `<path d="${lathe(100, [[136, 1.8], [142, 3.4], [148, 1.8]])}" fill="${x.url("blk")}"/>` + fronts(c4).map(cdl).join("") +
        `<path d="M54 64 L92 37 L100 39 L100 72 Z" fill="${x.url("blk")}"/><path d="M146 64 L108 37 L100 39 L100 72 Z" fill="#111117"/>
${hl("M58 63 L92 39.4", .25, 1)}<ellipse cx="100" cy="37" rx="9" ry="2.6" fill="${x.url("blk")}"/><circle cx="100" cy="33" r="3.4" fill="none" stroke="#1a1a22" stroke-width="2"/>` +
        bar("M54 64 V150 M100 72 V158 M146 64 V150 M54 64 L100 72 L146 64 M54 150 L100 158 L146 150", 3) +
        bar("M54 150 L100 172 L146 150 M100 158 V172", 1.6) + `<circle cx="100" cy="175" r="3.6" fill="${x.url("blk")}"/>` +
        [[54, 64], [100, 72], [146, 64], [54, 150], [100, 158], [146, 150]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.3" fill="#1a1a22"/><circle cx="${a - .6}" cy="${b - .6}" r=".8" fill="#8a8ca0"/>`).join(""));
    } }),

    base({ id: "sputnik", name: "Sputnik", colors: C2, glow: { x: .5, y: .52, r: 1.25 }, render(o) {
      const x = ctx(o), P = BRASS, cx = 100, cy = 106, R = 70, n = 22; const pts = [];
      for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + .5) / n, r = Math.sqrt(1 - y * y), th = i * 2.39996 + .5;
        let px = r * Math.cos(th), pz = r * Math.sin(th); const py = y * .96;
        if (py < -.8 && Math.abs(px) < .3) continue; pts.push({ px, py: -py, pz }); }
      pts.sort((a, b) => a.pz - b.pz);
      const rod = (p, i) => { const s = .78 + .22 * (p.pz + 1) / 2, ex = cx + R * p.px, ey = cy + R * p.py;
        return `<g ${p.pz < 0 ? 'opacity=".82"' : ""}>${tube(`M${cx} ${cy} L${f(cx + R * .86 * p.px)} ${f(cy + R * .86 * p.py)}`, 2 * s, P)}<circle cx="${f(cx + R * .87 * p.px)}" cy="${f(cy + R * .87 * p.py)}" r="${f(2.4 * s)}" fill="${x.url("brs")}"/>${globe(x, ex, ey, 5.6 * s, i)}</g>`; };
      return svg(x, halo(x, cx, cy, 98, .45) + pts.map((p) => halo(x, cx + R * p.px, cy + R * p.py, 14, .7)).join("") +
        canopy(x, 100, 24, "brs") + `<rect x="98.4" y="15" width="3.2" height="82" fill="${x.url("brs")}"/>` +
        pts.filter((p) => p.pz < 0).map(rod).join("") +
        `<circle cx="${cx}" cy="${cy}" r="12" fill="${x.url("brs")}"/><circle cx="${cx}" cy="${cy}" r="12" fill="${x.url("gl")}"/><ellipse cx="${cx - 4}" cy="${cy - 5}" rx="4" ry="2.4" fill="#fff" fill-opacity=".55"/>` +
        pts.filter((p) => p.pz >= 0).map((p, i) => rod(p, i + 9)).join(""));
    } }),

    base({ id: "linear", name: "Linear crystal", colors: [SOFT, WARM, DAY, "#8fd0ff", "#b9a6ff"], cast: "down", glow: { x: .5, y: .5, r: 1.35 }, render(o) {
      const x = ctx(o); let back = "", front = "";
      const len = (cx) => 34 + 50 * (1 - Math.pow((cx - 100) / 80, 2));
      for (let cx = 29.5, i = 0; cx < 172; cx += 7.6, i++) { const L = len(cx) - 8;
        back += `<g opacity=".62">${beads(`M${f(cx)} 66 V${f(66 + L)}`, x.tint("#dfe9ff", .5), 2.2, 3.6)}${prism(x, cx, 66 + L, .5, "spear", i, false, 0)}</g>`; }
      for (let cx = 26, i = 0; cx < 176; cx += 7.6, i++) { const L = len(cx);
        front += beads(`M${f(cx)} 70 V${f(70 + L)}`, x.tint("#eef4ff", .5), 2.6, 4) + prism(x, cx, 70 + L, .6, "spear", i, i % 3 === 0, 0); }
      return svg(x, (x.on ? `<ellipse cx="100" cy="100" rx="98" ry="52" fill="${x.url("halo")}" opacity="${x.op(.45)}"/>
<path d="M24 72 L4 196 L196 196 L176 72 Z" fill="${x.url("cone")}" opacity="${x.op(.36)}"/>` : "") + pool(x, 100, 92, .75) +
        `<rect x="40" y="2" width="20" height="4" rx="1.6" fill="${x.url("chr")}"/><rect x="140" y="2" width="20" height="4" rx="1.6" fill="${x.url("chr")}"/>` +
        cable(50, 6, 50, 58, .8) + cable(150, 6, 150, 58, .8) + back +
        `<path d="M30 57 H170 L178 63 H22 Z" fill="#dfe2ea"/><rect x="22" y="63" width="156" height="7" rx="1" fill="${x.url("chr")}"/>${hl("M24 64 H176", .6, .8)}
<rect x="26" y="69.4" width="148" height="2" rx="1" fill="${x.on ? x.hot : "#6c7284"}" opacity="${x.on ? x.op(1) : 1}"/>` + front +
        spark(x, 72, 108, 5, 1) + spark(x, 124, 120, 5.5, 3) + spark(x, 98, 146, 6, 5));
    } }),

    base({ id: "empire", name: "Empire basket", colors: [SOFT, WARM, DAY, "#b9a6ff", "#ffc9de"], glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), P = GOLD, N = 18, cd = ring(6, 100, 100, 32, 7, PI / 6);
      const st = ring(N, 0, 0, 1, 1, .1); let tb = "", tf = "", dr = "";
      st.forEach((p) => { const c = p.c, s = p.d, a = s < 0 ? .5 : 1, col = x.tint("#e6f0ff", .5);
        const t = `M${f(100 + 15 * c)} ${f(40 + 3.4 * s)} Q${f(100 + 54 * c)} ${f(54 + 9 * s)} ${f(100 + 60 * c)} ${f(98 + 13 * s)} Q${f(100 + 52 * c)} ${f(150 + 6 * s)} 100 158`;
        if (s < 0) tb += beads(t, col, 2.1, 3.4, a); else tf += beads(t, col, 2.4, 3.6);
        if (s >= -.3) dr += prism(x, 100 + 60 * c, 99 + 13 * s, .62, "tear", p.i, s > .3 && p.i % 2 === 0, 2); });
      return svg(x, halo(x, 100, 96, 96, .5) + pool(x, 100, 70, .45) + cd.map((p) => flameHalo(x, p.x, p.y, 9, .85, 18)).join("") +
        canopy(x, 100, 24, "gld") + chain(100, 15, 37, P) + tb +
        `<ellipse cx="100" cy="98" rx="60" ry="13" fill="none" stroke="${P[0]}" stroke-width="3"/><ellipse cx="100" cy="98" rx="60" ry="13" fill="none" stroke="${P[2]}" stroke-width="1"/>
<rect x="98.6" y="40" width="2.8" height="62" fill="${x.url("gld")}"/>` +
        backs(cd).map((p) => tube(`M100 102 L${f(p.x)} ${f(p.y + 2)}`, 1.6, P) + candle(x, p.x, p.y, 9, P, .85, p.i)).join("") +
        fronts(cd).map((p) => tube(`M100 102 L${f(p.x)} ${f(p.y + 2)}`, 1.6, P) + candle(x, p.x, p.y, 9, P, .85, p.i)).join("") + tf +
        `<path d="M40 98 A60 13 0 0 0 160 98" fill="none" stroke="${P[0]}" stroke-width="3.2"/><path d="M40 97.4 A60 13 0 0 0 160 97.4" fill="none" stroke="${P[2]}" stroke-width="1.1"/>` + dr +
        `<ellipse cx="100" cy="40" rx="15" ry="3.4" fill="none" stroke="${x.url("gld")}" stroke-width="2.6"/>` +
        [-12, -6, 0, 6, 12].map((k, i) => `<g transform="translate(${100 + k} ${f(40 + 2.6 - Math.abs(k) * .1)}) scale(.5 -.5)"><path d="${PR.spear.d}" fill="${x.url("xt")}" stroke="#fff" stroke-opacity=".7"/></g>`).join("") +
        `<circle cx="100" cy="158" r="5" fill="${x.url("bd")}"/>` + prism(x, 100, 161, 1.2, "tear", 4, true, 1) + spark(x, 74, 76, 4.4, 3) + spark(x, 130, 134, 5, 6));
    } }),

    base({ id: "halo", name: "Halo ring", colors: C2, cast: "down", glow: { x: .5, y: .6, r: 1.3 }, render(o) {
      const x = ctx(o), cy = 110;
      return svg(x, (x.on ? `<ellipse cx="100" cy="${cy + 8}" rx="76" ry="22" fill="${x.url("halo")}" opacity="${x.op(.5)}"/>
<path d="M24 ${cy + 8} L6 196 L194 196 L176 ${cy + 8} Z" fill="${x.url("cone")}" opacity="${x.op(.3)}"/>` : "") + pool(x, 100, 92, .75) +
        canopy(x, 100, 22, "nkl") + cable(100, 15, 100, cy - 20) +
        `<ellipse cx="100" cy="${cy + 3}" rx="76" ry="20" fill="none" stroke="#14141a" stroke-width="7.5"/>
<ellipse cx="100" cy="${cy}" rx="76" ry="20" fill="none" stroke="${x.url("nkl")}" stroke-width="4.6"/>
<path d="M28 ${cy - 6} A76 20 0 0 1 150 ${cy - 15}" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width=".9"/>
<ellipse cx="100" cy="${cy + 6}" rx="76" ry="20" fill="none" stroke="${x.on ? x.c : "#3a3c4a"}" stroke-width="${x.on ? 6 : 2.4}" stroke-opacity="${x.on ? x.op(.35) : 1}"/>
<ellipse cx="100" cy="${cy + 6}" rx="76" ry="20" fill="none" stroke="${x.on ? x.hot : "#8c8fa0"}" stroke-width="2" stroke-opacity="${x.on ? x.op(1) : .5}"/>
${x.on ? `<path d="M40 ${cy + 17} A76 20 0 0 0 160 ${cy + 17}" fill="none" stroke="#fff" stroke-width="1" opacity="${x.op(.9)}"/>` : ""}` +
        cable(100, 15, 34, cy + 10) + cable(100, 15, 166, cy + 10) + `<circle cx="34" cy="${cy + 10}" r="1.4" fill="#c9cbd8"/><circle cx="166" cy="${cy + 10}" r="1.4" fill="#c9cbd8"/>`);
    } }),

    base({ id: "rings", name: "Stacked rings", colors: [SOFT, WARM, DAY, "#ffa94d", "#b9a6ff"], cast: "down", glow: { x: .5, y: .58, r: 1.3 }, render(o) {
      const x = ctx(o), R = [[74, 36, 7.5, PI / 2], [108, 56, 11.5, PI / 6], [144, 76, 15.5, -PI / 6]];
      let cb = "", cf = "", rings = "";
      R.forEach(([cy, rx, ry, off]) => { ring(3, 100, cy, rx, ry, off).forEach((p) => { (p.d < 0 ? (cb += cable(100, 14, p.x, p.y, .45)) : (cf += cable(100, 14, p.x, p.y, .6))); });
        rings += `<ellipse cx="100" cy="${cy + 2}" rx="${rx}" ry="${ry}" fill="none" stroke="#1a160f" stroke-width="5"/>
<ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${x.url("chp")}" stroke-width="3.4"/>
<path d="M${100 - rx + 4} ${f(cy - ry * .4)} A${rx} ${ry} 0 0 1 ${f(100 + rx * .5)} ${f(cy - ry * .86)}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".7"/>
<ellipse cx="100" cy="${cy + 3.6}" rx="${rx}" ry="${ry}" fill="none" stroke="${x.on ? x.c : "#3a3426"}" stroke-width="${x.on ? 5 : 1.6}" stroke-opacity="${x.on ? x.op(.35) : 1}"/>
<ellipse cx="100" cy="${cy + 3.6}" rx="${rx}" ry="${ry}" fill="none" stroke="${x.on ? x.hot : "#8e8670"}" stroke-width="1.5" stroke-opacity="${x.on ? x.op(1) : .55}"/>`; });
      return svg(x, (x.on ? `<ellipse cx="100" cy="116" rx="90" ry="62" fill="${x.url("halo")}" opacity="${x.op(.45)}"/><path d="M24 150 L8 196 L192 196 L176 150 Z" fill="${x.url("cone")}" opacity="${x.op(.3)}"/>` : "") + pool(x, 100, 88, .7) +
        canopy(x, 100, 22, "chp") + cb + rings + cf);
    } }),

    base({ id: "drum", name: "Crystal drum", colors: [SOFT, WARM, DAY, "#ffc9de", "#8fd0ff"], cast: "down", glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), P = "M34 58 A66 8 0 0 0 166 58 L166 104 A66 12 0 0 1 34 104 Z";
      const stc = [[0, "#57586a"], [.3, "#c6c6d2"], [.55, "#a3a3b2"], [1, "#4a4a5a"]];
      const ex = lg(x.id("fb"), stc) + lg(x.id("fbo"), stc.map(([a, c]) => [a, H.mix(H.mix(c, x.c, .5), "#fff", .2)])) + rg(x.id("fbr"), [[0, "#fff", .8], [.55, x.hot, .35], [1, x.hot, 0]], .5, .6, .55);
      let tex = ""; for (let y = 62; y < 112; y += 3) tex += `<path d="M34 ${y} H166" stroke="${y % 2 ? "#fff" : "#000"}" stroke-opacity=".05" stroke-width=".7"/>`;
      const st = ring(16, 100, 108, 52, 9, .2); let sb = "", sf = "";
      st.forEach((p) => { const L = 22 + 10 * Math.cos(p.i * 1.7) * .4 + 12 * (1 - Math.abs(p.c)), d = `M${f(p.x)} ${f(p.y)} V${f(p.y + L)}`;
        if (p.d < 0) sb += `<g opacity=".6">${beads(d, x.tint("#e6efff", .5), 2.2, 3.6)}${prism(x, p.x, p.y + L, .55, "oct", p.i, false, 0)}</g>`;
        else sf += beads(d, x.tint("#eef4ff", .5), 2.5, 3.8) + prism(x, p.x, p.y + L, .62, "oct", p.i, p.i % 3 === 0, 0); });
      return svg(x, halo(x, 100, 96, 96, .48) + beam(x, 100, 112, 50, 34, .8) + canopy(x, 100, 24, "chr") + `<rect x="98.2" y="15" width="3.6" height="40" fill="${x.url("chr")}"/>` + sb +
        `<clipPath id="${x.id("dc")}"><path d="${P}"/></clipPath><path d="${P}" fill="url(#${x.id(x.on ? "fbo" : "fb")})"/>${x.on ? `<path d="${P}" fill="url(#${x.id("fbr")})" opacity="${x.op(1)}"/>` : ""}
<g clip-path="url(#${x.id("dc")})">${tex}</g><path d="M34 58 A66 8 0 0 0 166 58" fill="none" stroke="#2c2c38" stroke-width="2.4"/><path d="M34 104 A66 12 0 0 0 166 104" fill="none" stroke="#2c2c38" stroke-width="2.4"/>
<ellipse cx="100" cy="104" rx="64" ry="11" fill="${x.on ? x.url("fill") : "#d9d4e2"}" opacity="${x.on ? x.op(.95) : ".28"}"/>${hl("M44 64 V100", .16, 3)}` +
        sf + `<circle cx="100" cy="150" r="4.6" fill="${x.url("bd")}"/>` + prism(x, 100, 153, 1.15, "tear", 2, true, 1) + spark(x, 64, 124, 4.4, 4), ex);
    } }),

    base({ id: "beads", name: "Wood beads", colors: C1, glow: { x: .5, y: .45, r: 1.2 }, render(o) {
      const x = ctx(o), P = IRON, R = ring(8, 100, 92, 54, 11.5, PI / 8), cd = ring(5, 100, 92, 54, 11.5, PI / 10 + .2), W = "#d8b07a";
      let tb = "", tf = "", sw = ["", ""];
      ring(16, 0, 0, 1, 1, .2).forEach((p) => { const d = `M${f(100 + 13 * p.c)} ${f(40 + 3 * p.d)} Q${f(100 + 50 * p.c)} ${f(56 + 8 * p.d)} ${f(100 + 54 * p.c)} ${f(92 + 11.5 * p.d)}`;
        if (p.d < 0) tb += beads(d, "#9a6c3e", 3, 4.2, .75); else tf += beads(d, W, 3.4, 4.4); });
      [8, 17, 27].forEach((sag, L) => R.forEach((a, i) => { const b = R[(i + 1) % 8], mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + 2 * (sag + L * 2), k = (a.d + b.d) / 2 < 0 ? 0 : 1;
        sw[k] += beads(`M${f(a.x)} ${f(a.y + 1)} Q${f(mx)} ${f(my)} ${f(b.x)} ${f(b.y + 1)}`, k ? (L === 1 ? "#f2dcb6" : W) : "#8a5f36", k ? 3.4 : 2.8, 4.2, k ? 1 : .7); }));
      const tas = `${beads("M100 92 V146", W, 3.6, 4.6)}<path d="M96 148 h8 l1 4 h-10 Z" fill="#c99a62"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${96 + i} 152 L${f(94 + i * 1.5)} 176" stroke="${i % 2 ? "#e9cfa4" : "#b98a52"}" stroke-width="1.1"/>`).join("")}`;
      return svg(x, halo(x, 100, 86, 96, .42) + pool(x, 100, 70, .45) + cd.map((p) => flameHalo(x, p.x, p.y, 10, .85, 18)).join("") +
        canopy(x, 100, 22, "blk") + chain(100, 15, 38, P) + tb + sw[0] +
        `<ellipse cx="100" cy="92" rx="54" ry="11.5" fill="none" stroke="#0b0b10" stroke-width="2.6"/><ellipse cx="100" cy="91.5" rx="54" ry="11.5" fill="none" stroke="#5a5c6e" stroke-width=".7"/>` +
        backs(cd).map((p) => candle(x, p.x, p.y, 10, P, .85, p.i)).join("") + tas + fronts(cd).map((p) => candle(x, p.x, p.y, 10, P, .85, p.i)).join("") + tf + sw[1] +
        `<ellipse cx="100" cy="40" rx="13" ry="3" fill="none" stroke="${x.url("blk")}" stroke-width="2.4"/>`);
    } }),

    base({ id: "branch", name: "Brass branch", colors: C3, glow: { x: .5, y: .45, r: 1.3 }, render(o) {
      const x = ctx(o), P = BRONZE;
      const tw = [[42, 86, 30, 66, 22, 54], [56, 84, 60, 102, 52, 120], [76, 92, 72, 70, 80, 52], [92, 90, 96, 112, 88, 130], [112, 86, 118, 68, 112, 48], [124, 84, 130, 104, 138, 122], [146, 90, 150, 70, 162, 58], [160, 86, 172, 100, 178, 118], [34, 89, 26, 104, 18, 112]];
      const lf = (cx, cy, r) => `<path d="M0 0 C3 -3 8 -2 10 0 C8 2 3 3 0 0 Z" fill="${x.url("gld")}" transform="translate(${cx} ${cy}) rotate(${r})"/>`;
      return svg(x, halo(x, 100, 90, 98, .4) + tw.map(([, , , , ex, ey]) => halo(x, ex, ey, 15, .75)).join("") + pool(x, 100, 82, .45) +
        canopy(x, 100, 24, "brs") + tube("M100 15 V86", 3, BRASS) +
        tw.map(([sx, sy, cx, cy, ex, ey]) => tube(`M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`, 2, P)).join("") +
        tube("M18 96 C40 80 60 98 84 90 C108 82 126 98 150 86 C162 80 172 84 182 80", 4.4, P) +
        tube("M18 96 C40 80 60 98 84 90 C108 82 126 98 150 86 C162 80 172 84 182 80", 1.2, ["#3a2414", "#5a3a20", "#8a6040"]) +
        lf(64, 93, 30) + lf(104, 86, -150) + lf(136, 92, 20) + lf(70, 80, -60) + lf(150, 76, -110) + lf(30, 100, 140) +
        tw.map(([, , , , ex, ey], i) => `<circle cx="${ex}" cy="${ey}" r="2.6" fill="${x.url("brs")}"/>` + globe(x, ex, ey + (ey > 90 ? 6 : -6), 6, i)).join(""));
    } }),

    base({ id: "orb", name: "Orb cage", colors: C1, glow: { x: .5, y: .56, r: 1.15 }, render(o) {
      const x = ctx(o), P = RUST, cx = 100, cy = 108, R = 54, cd = ring(5, 100, 120, 24, 5.5, PI / 10);
      let bk = "", fr = "";
      [30, 60, 90, 120, 150].forEach((deg) => { const ph = deg * PI / 180, rx = Math.abs(R * Math.cos(ph)), side = Math.cos(ph) >= 0 ? 1 : 0;
        if (rx < .5) { fr += tube(`M${cx} ${cy - R} V${cy + R}`, 2.2, P); return; }
        bk += `<path d="M${cx} ${cy - R} A${f(rx)} ${R} 0 0 ${side ? 0 : 1} ${cx} ${cy + R}" fill="none" stroke="#3a2b23" stroke-opacity=".65" stroke-width="1.3"/>`;
        fr += tube(`M${cx} ${cy - R} A${f(rx)} ${R} 0 0 ${side} ${cx} ${cy + R}`, 2.2, P); });
      [-28, 0, 28].forEach((dy) => { const rx = Math.sqrt(R * R - dy * dy), ry = rx * .2, y = cy + dy;
        bk += `<path d="M${f(cx - rx)} ${y} A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${y}" fill="none" stroke="#3a2b23" stroke-opacity=".65" stroke-width="1.3"/>`;
        fr += tube(`M${f(cx - rx)} ${y} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${y}`, 2.2, P); });
      return svg(x, halo(x, cx, 104, 92, .45) + halo(x, cx, 104, 50, .45) + pool(x, 100, 70, .45) + canopy(x, 100, 24, "rst") + chain(100, 15, 50, P) + bk +
        `<path d="${lathe(100, [[106, 1.6], [124, 1.6], [128, 3.6], [131, 1.6]])}" fill="${x.url("rst")}"/>` +
        cd.map((p) => tube(`M100 128 Q${f(p.x)} 130 ${f(p.x)} ${f(p.y + 2)}`, 1.5, P)).join("") +
        backs(cd).concat(fronts(cd)).map((p) => candle(x, p.x, p.y, 10, P, .8, p.i)).join("") +
        tube(`M${cx - R} ${cy} A${R} ${R} 0 1 0 ${cx + R} ${cy} A${R} ${R} 0 1 0 ${cx - R} ${cy}`, 2.6, P) + fr +
        `<ellipse cx="100" cy="${cy - R}" rx="7" ry="2.4" fill="${x.url("rst")}"/><path d="${lathe(100, [[cy + R - 1, 6], [cy + R + 4, 3], [cy + R + 9, 4.4], [cy + R + 14, .6]])}" fill="${x.url("rst")}"/>`);
    } }),

    base({ id: "bubble", name: "Bubble cluster", colors: C2, glow: { x: .5, y: .52, r: 1.2 }, render(o) {
      const x = ctx(o), B = [[56, 132, 11], [146, 126, 12], [96, 74, 11], [68, 98, 15], [134, 92, 16], [120, 150, 13], [82, 150, 14], [104, 118, 21], [146, 158, 9], [50, 160, 8], [160, 100, 8]];
      const ex = rg(x.id("bub"), [[0, "#ffffff", .03], [.7, "#dfe6ff", .07], [.95, "#ffffff", .3], [1, "#ffffff", .5]], .45, .42, .55);
      const bub = ([cx, cy, r], i) => `<path d="M${f(100 + (cx - 100) * .35)} 16 L${cx} ${cy - r}" stroke="#d6d8e2" stroke-opacity=".6" stroke-width=".6"/>
<rect x="${cx - 2}" y="${cy - r - 3}" width="4" height="4" rx="1" fill="${x.url("chr")}"/>${x.on ? `<circle cx="${cx}" cy="${cy}" r="${f(r * .95)}" fill="${x.url("halo")}" opacity="${x.op(.6)}"/>` : ""}
<rect x="${f(cx - 1.4)}" y="${f(cy - r + 1)}" width="2.8" height="${f(r * .7)}" rx="1.2" fill="${x.on ? x.hot : "#cfd2dc"}" opacity="${x.on ? x.op(1) : .5}"/>${x.on ? `<circle cx="${cx}" cy="${f(cy - r * .2)}" r="${f(1.6 + r * .08)}" fill="#fff" opacity="${x.op(1)}"/>` : ""}
<circle cx="${cx}" cy="${cy}" r="${f(r + .5)}" fill="none" stroke="#3b335f" stroke-opacity=".25" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${x.id("bub")})" stroke="#fff" stroke-opacity=".55" stroke-width=".7"/>
${hl(`M${f(cx - r * .7)} ${f(cy - r * .2)} A${f(r * .74)} ${f(r * .74)} 0 0 1 ${f(cx - r * .1)} ${f(cy - r * .72)}`, .6, f(.6 + r * .06))}<circle cx="${f(cx + r * .45)}" cy="${f(cy + r * .5)}" r="${f(r * .08)}" fill="#fff" fill-opacity=".6"/>`;
      return svg(x, halo(x, 100, 112, 96, .45) + pool(x, 100, 70, .45) + `<ellipse cx="100" cy="11" rx="30" ry="5" fill="${x.url("chr")}"/><path d="M70 11 V14 A30 5 0 0 0 130 14 V11" fill="${x.url("chr")}"/><ellipse cx="100" cy="10" rx="28" ry="3.6" fill="#fff" fill-opacity=".25"/>` +
        B.map(bub).join("") + spark(x, 110, 108, 4, 1) + spark(x, 74, 92, 3.4, 4));
    } }),

    base({ id: "raindrop", name: "Raindrop cascade", colors: [DAY, SOFT, WARM, "#8fd0ff", "#b9a6ff"], cast: "down", glow: { x: .5, y: .4, r: 1.2 }, render(o) {
      const x = ctx(o), S = [];
      [[48, 18, 46], [34, 12, 76], [20, 8, 108], [0, 1, 136]].forEach(([r, n, L], k) => ring(n, 100, 24, r, r * .17, k * .3).forEach((p) => S.push({ x: p.x, y: p.y + 1, z: r * p.d, L: L + 6 * Math.cos(p.i * 2.1), k })));
      S.sort((a, b) => a.z - b.z);
      const strand = (s, i) => { const a = s.z < 0 ? .55 : 1, y2 = s.y + s.L;
        return `<g ${a < 1 ? `opacity="${a}"` : ""}>${beads(`M${f(s.x)} ${f(s.y)} V${f(y2)}`, x.tint("#eaf2ff", .5), 2.4, 4.2)}${prism(x, s.x, y2, .66, "tear", i, a === 1 && i % 3 === 0, 0)}</g>`; };
      return svg(x, halo(x, 100, 60, 90, .5) + (x.on ? `<ellipse cx="100" cy="34" rx="44" ry="12" fill="${x.url("halo")}" opacity="${x.op(.9)}"/>` : "") + pool(x, 100, 60, .6) +
        `<path d="M48 16 V22 A52 9 0 0 0 152 22 V16 Z" fill="${x.url("chr")}"/><ellipse cx="100" cy="16" rx="52" ry="9" fill="${x.url("nkl")}"/><ellipse cx="100" cy="15" rx="40" ry="5" fill="#fff" fill-opacity=".18"/><rect x="94" y="4" width="12" height="9" rx="2" fill="${x.url("chr")}"/>
<ellipse cx="100" cy="23" rx="46" ry="7" fill="${x.on ? x.hot : "#5a5f70"}" opacity="${x.on ? x.op(.9) : .8}"/>` + S.map(strand).join("") + spark(x, 86, 120, 5, 2) + spark(x, 114, 92, 4.4, 5));
    } }),

    base({ id: "spanish", name: "Spanish iron", colors: [CANDLE, WARM, SOFT, "#ff8a5c", DAY], glow: { x: .5, y: .48, r: 1.25 }, render(o) {
      const x = ctx(o), P = RUST, cy = 120, pts = ring(8, 100, cy, 72, 17, PI / 8);
      const sc = (p) => .86 + .14 * (p.d + 1) / 2;
      const strut = (p) => tube(`M100 60 C${f(100 + (p.x - 100) * .3)} 64 ${f(p.x)} ${f(p.y - 30)} ${f(p.x)} ${f(p.y - 2)}`, 1.4, P);
      const spoke = (p) => tube(`M100 132 Q${f(100 + (p.x - 100) * .6)} ${f(p.y + 14)} ${f(p.x)} ${f(p.y + 1)}`, 2.2, P);
      const spike = (p) => `<path d="M${f(p.x - 2.6)} ${f(p.y + 2)} L${f(p.x)} ${f(p.y + 12)} L${f(p.x + 2.6)} ${f(p.y + 2)} Z" fill="${x.url("rst")}"/>`;
      const cdl = (p) => candle(x, p.x, p.y - 1, 16 * sc(p), P, sc(p), p.i, "wax");
      let tw = ""; for (let y = 66; y < 114; y += 3.6) tw += `<path d="M97 ${f(y)} L103 ${f(y + 3)}" stroke="${P[2]}" stroke-opacity=".55" stroke-width=".8"/>`;
      let hm = ""; pts.forEach((p) => { hm += `<circle cx="${f(p.x + 6)}" cy="${f(p.y + 1)}" r=".8" fill="#c08050" fill-opacity=".6"/>`; });
      return svg(x, halo(x, 100, 98, 98, .42) + pool(x, 100, 80, .45) + pts.map((p) => flameHalo(x, p.x, p.y - 1, 16, 1, 18)).join("") +
        canopy(x, 100, 26, "rst") + chain(100, 15, 34, P) + backs(pts).map((p) => strut(p) + spoke(p)).join("") +
        `<path d="M28 ${cy} A72 17 0 0 1 172 ${cy}" fill="none" stroke="${P[0]}" stroke-width="5"/><path d="M28 ${cy - 1} A72 17 0 0 1 172 ${cy - 1}" fill="none" stroke="${P[2]}" stroke-opacity=".45" stroke-width="1"/>` +
        backs(pts).map((p) => spike(p) + cdl(p)).join("") +
        `<path d="${lathe(100, [[34, 2.6], [38, 5], [42, 2.8], [52, 2.8], [57, 7], [62, 3], [116, 3], [124, 9], [132, 13], [138, 10], [143, 4], [148, 2], [162, .6]])}" fill="${x.url("rst")}"/>${tw}
<path d="M88 132 Q100 136 112 132" fill="none" stroke="${P[2]}" stroke-opacity=".5" stroke-width=".8"/>` +
        fronts(pts).map((p) => strut(p) + spoke(p)).join("") +
        `<path d="M28 ${cy} A72 17 0 0 0 172 ${cy}" fill="none" stroke="${P[0]}" stroke-width="5.4"/><path d="M28 ${cy - 1.2} A72 17 0 0 0 172 ${cy - 1.2}" fill="none" stroke="${P[1]}" stroke-width="2.4"/><path d="M30 ${cy - 2} A72 17 0 0 0 170 ${cy - 2}" fill="none" stroke="${P[2]}" stroke-opacity=".6" stroke-width=".7"/>${hm}` +
        fronts(pts).map((p) => spike(p) + cdl(p)).join("") + [-1, 1].map((d) => curl(100 + d * 5, 128, 4.4, d, P)).join(""));
    } }),

    base({ id: "midcentury", name: "Mid-century arms", colors: C3, glow: { x: .5, y: .42, r: 1.3 }, render(o) {
      const x = ctx(o), cx = 100, cy = 70;
      const A = [[36, 64, 24], [164, 56, 200], [62, 118, 8], [140, 122, -12], [52, 30, 150], [150, 96, 52], [100, 140, 0]];
      const ex = lg(x.id("en"), [[0, "#8e8a9c"], [.3, "#ffffff"], [.55, "#e8e4f0"], [1, "#7a7688"]]);
      const shade = ([ex2, ey, rot], i) => { const beamL = x.on ? `<path d="M-9 15 L-26 60 L26 60 L9 15 Z" fill="${x.url("cone")}" opacity="${x.op(.42)}"/>` : "";
        return `<g transform="translate(${ex2} ${ey}) rotate(${rot})">${beamL}<rect x="-2.4" y="-5" width="4.8" height="5" fill="${x.url("brs")}"/>
<path d="M-3.4 0 L3.4 0 L10 15 L-10 15 Z" fill="url(#${x.id("en")})"/><path d="M3.4 0 L10 15 L5 15 L1.4 0 Z" fill="#000" fill-opacity=".12"/>
<ellipse cx="0" cy="15" rx="10" ry="2.8" fill="${x.url("brs")}"/><ellipse cx="0" cy="15.3" rx="8.6" ry="2.1" fill="${x.on ? x.url("fill") : "#3a3446"}" ${x.on ? `opacity="${x.op(1)}"` : ""}/>${hl("M-2.6 1.6 L-8 13", .5, 1)}</g>`; };
      return svg(x, halo(x, cx, 84, 98, .4) + A.map(([a, b, r]) => halo(x, a + 15 * Math.sin(-r * PI / 180), b + 15 * Math.cos(r * PI / 180), 16, .7)).join("") +
        canopy(x, 100, 22, "brs") + tube(`M100 15 V${cy - 4}`, 2.6, BRASS) +
        A.map(([a, b]) => tube(`M${cx} ${cy} L${a} ${b}`, 2, BRASS)).join("") + A.map(shade).join("") +
        `<circle cx="${cx}" cy="${cy}" r="6" fill="${x.url("brs")}"/><circle cx="${cx - 2}" cy="${cy - 2}" r="1.8" fill="#fff" fill-opacity=".6"/>`, ex);
    } }),

    base({ id: "edison", name: "Edison pipe", colors: [CANDLE, WARM, SOFT, "#ffa94d", DAY], glow: { x: .5, y: .45, r: 1.25 }, render(o) {
      const x = ctx(o), P = IRON;
      const pipe = (d) => `<path d="${d}" fill="none" stroke="#050507" stroke-width="7" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#2d2e3a" stroke-width="5" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#7c7f94" stroke-opacity=".6" stroke-width="1.2" stroke-linejoin="round" transform="translate(-.8 -1.4)"/>`;
      const fit = (cx, cy, w, h) => `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="1.6" fill="${x.url("blk")}"/><rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="1.4" fill="#fff" fill-opacity=".18"/>`;
      const B = [[30, 102, 0], [170, 102, 0], [80, 96, 0], [120, 96, 0], [60, 58, 1], [140, 58, 1]];
      return svg(x, halo(x, 100, 90, 98, .42) + B.map(([a, b, u]) => halo(x, a, b + (u ? -14 : 14), 20, .8)).join("") + pool(x, 100, 82, .5) +
        canopy(x, 100, 26, "blk") + pipe("M100 15 V68") + pipe("M30 96 V68 H170 V96") + pipe("M80 68 V90 M120 68 V90") +
        fit(100, 68, 12, 12) + fit(30, 68, 11, 11) + fit(170, 68, 11, 11) + fit(80, 68, 10, 10) + fit(120, 68, 10, 10) + fit(100, 40, 9, 6) +
        fit(60, 66, 9, 5) + fit(140, 66, 9, 5) +
        B.map(([a, b, u], i) => pear(x, a, b, .95, u, i)).join(""));
    } }),

    base({ id: "capiz", name: "Capiz shell", colors: [SOFT, WARM, DAY, "#ffc9de", "#9ef0c4"], glow: { x: .5, y: .5, r: 1.2 }, render(o) {
      const x = ctx(o), T = [[30, 40, 4, 12], [46, 70, 5, 17], [62, 106, 6, 23]];
      const ex = rg(x.id("cz"), [[0, "#ffffff"], [.45, "#f3eef8"], [.75, "#d9e6f0"], [1, "#c7b8d6"]], .4, .35, .7) +
        rg(x.id("czo"), [[0, "#ffffff"], [.4, x.hot], [1, H.mix(x.c, "#ffd0e0", .25)]], .45, .4, .7);
      let back = "", front = "";
      T.forEach(([R, y0, rows, n]) => { for (let r = 0; r < rows; r++) ring(n, 100, y0 + r * 6, R, R * .2, (r % 2) * PI / n + .1).forEach((p) => {
        const w = 5.4 * Math.max(.3, Math.abs(p.d)), s = `<ellipse cx="${f(p.x)}" cy="${f(p.y)}" rx="${f(w)}" ry="5.4"`;
        if (p.d < 0) back += `${s} fill="#cfc4dc" fill-opacity="${x.on ? x.op(.55) : .28}"/>`;
        else front += `${s} fill="url(#${x.id(x.on ? "czo" : "cz")})" ${x.on ? `opacity="${(.55 + .45 * x.L).toFixed(2)}"` : 'opacity=".92"'} stroke="#8c7ea6" stroke-opacity=".7" stroke-width=".45"/>${s} fill="#1b1636" fill-opacity="${f(.4 * (1 - Math.abs(p.d)))}"/>${w > 3 ? `<path d="M${f(p.x - w * .5)} ${f(p.y - 1.6)} q${f(w * .5)} -2 ${f(w)} 0" fill="none" stroke="#a89cc0" stroke-opacity=".5" stroke-width=".4"/>` : ""}`; });
        front += `<ellipse cx="100" cy="${y0 - 4}" rx="${R}" ry="${f(R * .2)}" fill="none" stroke="${x.url("brs")}" stroke-width="1.4"/>`; });
      return svg(x, halo(x, 100, 96, 98, .5) + halo(x, 100, 100, 54, .6) + pool(x, 100, 74, .45) + canopy(x, 100, 24, "brs") + chain(100, 15, 32, BRASS) +
        T.map(([R, y0]) => cable(100, 34, 100 - R, y0 - 4, .4) + cable(100, 34, 100 + R, y0 - 4, .4)).join("") + back +
        (x.on ? `<ellipse cx="100" cy="98" rx="40" ry="34" fill="${x.url("halo")}" opacity="${x.op(.7)}"/>` : "") + front +
        spark(x, 78, 84, 3.6, 1) + spark(x, 128, 116, 4, 4), ex);
    } }),

    base({ id: "venetian", name: "Venetian glass", colors: [SOFT, WARM, DAY, "#ffc9de", "#9ef0c4"], glow: { x: .5, y: .45, r: 1.2 }, render(o) {
      const x = ctx(o), pts = ring(6, 100, 104, 66, 15, PI / 6), G = ["#9aa0c0", "#e6ebff", "#ffffff"];
      const ex = lg(x.id("vg"), [[0, "#c8d0f0", .55], [.25, "#ffffff", .2], [.5, x.tint("#e6ecff", .4), .12], [.78, "#ffffff", .35], [1, "#b8c0e0", .6]]) +
        rg(x.id("pk"), [[0, "#ffffff"], [.5, "#ffc2d8"], [1, "#d86a96"]], .4, .35, .7);
      const glass = (d, w) => `<path d="${d}" fill="none" stroke="#3b335f" stroke-opacity=".22" stroke-width="${f(w + 1.2)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#c8d0f0" stroke-opacity=".38" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="${f(w * .5)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width=".7" stroke-linecap="round" transform="translate(-${f(w * .2)} -${f(w * .2)})"/>`;
      const sc = (p) => .86 + .14 * (p.d + 1) / 2;
      const arm = (p) => { const s = sc(p);
        return glass(`M100 118 C${f(100 + (p.x - 100) * .3)} 138 ${f(p.x)} ${f(p.y + 30)} ${f(p.x + (p.x > 100 ? 8 : -8))} ${f(p.y + 12)} C${f(p.x + (p.x > 100 ? 10 : -10))} ${f(p.y + 4)} ${f(p.x)} ${f(p.y + 4)} ${f(p.x)} ${f(p.y + 2)}`, 4.4 * s) +
          `<ellipse cx="${f(p.x)}" cy="${f(p.y + 1)}" rx="${f(9 * s)}" ry="${f(2.6 * s)}" fill="url(#${x.id("vg")})" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>` +
          candle(x, p.x, p.y, 14 * s, G, s, p.i) +
          (p.d > -.3 ? `<circle cx="${f(100 + (p.x - 100) * .55)}" cy="${f(p.y + 25)}" r="${f(3 * s)}" fill="url(#${x.id("pk")})"/>` : ""); };
      const col = lathe(100, [[30, 2.6], [36, 6], [42, 3.6], [50, 8], [58, 4.4], [66, 10], [76, 5], [86, 3.6], [96, 11], [106, 14], [114, 8], [120, 4], [128, 7], [134, 3], [142, .6]]);
      const horn = (d) => glass(`M100 66 C${100 + d * 14} 60 ${100 + d * 20} 46 ${100 + d * 14} 36 C${100 + d * 10} 30 ${100 + d * 4} 34 ${100 + d * 8} 40`, 3.2);
      return svg(x, halo(x, 100, 92, 98, .42) + pool(x, 100, 76, .45) + pts.map((p) => flameHalo(x, p.x, p.y, 14, 1, 17)).join("") +
        canopy(x, 100, 22, "chr") + `<path d="M100 15 V30" stroke="#c8d0f0" stroke-opacity=".6" stroke-width="2.4"/>` +
        backs(pts).map(arm).join("") + horn(-1) + horn(1) +
        `<path d="${col}" fill="none" stroke="#3b335f" stroke-opacity=".25" stroke-width="2"/><path d="${col}" fill="url(#${x.id("vg")})" stroke="#fff" stroke-opacity=".55" stroke-width=".7"/>${x.on ? `<path d="${col}" fill="${x.c}" fill-opacity="${x.op(.12)}"/>` : ""}
${hl("M95 52 C94 56 94 60 96 62 M93 100 C91 104 91 110 94 113", .7, 1.1)}` +
        fronts(pts).map(arm).join("") + spark(x, 92, 104, 4, 2) + spark(x, 106, 72, 3.4, 5));
    } }),
  ];

  const C2T = {"crystal": {"l": "Frame", "ids": ["brs"], "hex": ["#5e3f12", "#b8893a", "#fbe7a6"], "c": ["#b8893a", "#9aa0b2", "#2b2c37", "#d4a63c", "#6e4a2a", "#ddd7e3"]}, "candle": {"l": "Frame", "ids": ["blk"], "hex": ["#09090d", "#2b2c37", "#6d6f84"], "c": ["#2b2c37", "#b8893a", "#9aa0b2", "#6e4a2a", "#ddd7e3"]}, "wagon": {"l": "Frame", "ids": ["blk"], "hex": ["#09090d", "#2b2c37", "#6d6f84"], "c": ["#2b2c37", "#6e4a2a", "#9aa0b2", "#b8893a"]}, "farmhouse": {"l": "Frame", "ids": ["blk"], "hex": ["#09090d", "#2b2c37", "#6d6f84"], "c": ["#2b2c37", "#ddd7e3", "#6e4a2a", "#9aa0b2", "#b8893a"]}, "sputnik": {"l": "Frame", "ids": ["brs"], "hex": ["#5e3f12", "#b8893a", "#fbe7a6"], "c": ["#b8893a", "#2b2c37", "#9aa0b2", "#ddd7e3", "#6e4a2a"]}, "linear": {"l": "Frame", "ids": ["chr"], "hex": ["#3a3e4a", "#9aa0b2", "#f4f6fb"], "c": ["#9aa0b2", "#b8893a", "#2b2c37", "#d4a63c"]}, "empire": {"l": "Frame", "ids": ["gld"], "hex": ["#6b4a0e", "#d4a63c", "#fff0b8"], "c": ["#d4a63c", "#9aa0b2", "#2b2c37", "#b8893a"]}, "halo": {"l": "Frame", "ids": ["nkl"], "hex": ["#4a4d58", "#a9acb8", "#e8eaf0"], "c": ["#a9acb8", "#2b2c37", "#b8893a", "#ddd7e3"]}, "rings": {"l": "Frame", "ids": ["chp"], "hex": ["#6e5a3a", "#cdb488", "#fff4dc"], "c": ["#cdb488", "#2b2c37", "#9aa0b2", "#ddd7e3"]}, "drum": {"l": "Frame", "ids": ["chr"], "hex": ["#3a3e4a", "#9aa0b2", "#f4f6fb"], "c": ["#9aa0b2", "#b8893a", "#2b2c37", "#d4a63c"]}, "beads": {"l": "Frame", "ids": ["blk"], "hex": ["#09090d", "#2b2c37", "#6d6f84"], "c": ["#2b2c37", "#b8893a", "#ddd7e3", "#9aa0b2"]}, "branch": {"l": "Frame", "ids": ["brs", "gld"], "hex": ["#5e3f12", "#b8893a", "#fbe7a6", "#6b4a0e", "#d4a63c", "#fff0b8"], "c": ["#b8893a", "#2b2c37", "#9aa0b2", "#ddd7e3"]}, "orb": {"l": "Frame", "ids": ["rst"], "hex": ["#110c0a", "#3a2b23", "#a8673e"], "c": ["#3a2b23", "#2b2c37", "#b8893a", "#9aa0b2", "#ddd7e3"]}, "bubble": {"l": "Frame", "ids": ["chr"], "hex": ["#3a3e4a", "#9aa0b2", "#f4f6fb"], "c": ["#9aa0b2", "#b8893a", "#2b2c37", "#d4a63c"]}, "raindrop": {"l": "Frame", "ids": ["chr", "nkl"], "hex": ["#3a3e4a", "#9aa0b2", "#f4f6fb", "#4a4d58", "#a9acb8", "#e8eaf0"], "c": ["#9aa0b2", "#b8893a", "#2b2c37", "#d4a63c"]}, "spanish": {"l": "Frame", "ids": ["rst"], "hex": ["#110c0a", "#3a2b23", "#a8673e"], "c": ["#3a2b23", "#2b2c37", "#b8893a", "#ddd7e3"]}, "midcentury": {"l": "Frame", "ids": ["brs"], "hex": ["#5e3f12", "#b8893a", "#fbe7a6"], "c": ["#b8893a", "#2b2c37", "#9aa0b2", "#ddd7e3"]}, "edison": {"l": "Frame", "ids": ["blk"], "hex": ["#09090d", "#2b2c37", "#6d6f84"], "c": ["#2b2c37", "#b8893a", "#9aa0b2", "#6e4a2a"]}, "capiz": {"l": "Frame", "ids": ["brs"], "hex": ["#5e3f12", "#b8893a", "#fbe7a6"], "c": ["#b8893a", "#2b2c37", "#ddd7e3", "#9aa0b2"]}};
  const H2 = window.HDAH;
  function retint(svg, uid, t, c2, on) {
    if (!c2 || c2.toLowerCase() === t.c[0].toLowerCase() || (t.off && on)) return svg;
    const lum = (h) => { const v = H2.hx(h); return (0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2]) / 255; };
    const map = (cols) => { const m = cols.reduce((a, c) => a + lum(c), 0) / cols.length; return (h) => H2.shade(c2, Math.max(-0.78, Math.min(0.78, (lum(h) - m) * 1.3))); };
    (t.ids || []).forEach((gid) => {
      const re = new RegExp("(<(linear|radial)Gradient id=\"" + uid + "-" + gid + "\"[^>]*>)([\\s\\S]*?)(</\\2Gradient>)");
      svg = svg.replace(re, (all, open, kind, body, close) => {
        const cols = (body.match(/stop-color="#[0-9a-fA-F]{6}"/g) || []).map((q) => q.slice(12, 19)); if (!cols.length) return all;
        const fn = map(cols); return open + body.replace(/stop-color="(#[0-9a-fA-F]{6})"/g, (q, h) => 'stop-color="' + fn(h) + '"') + close;
      });
    });
    if (t.hex && t.hex.length) { const fn = map(t.hex); t.hex.forEach((h) => { svg = svg.split('"' + h + '"').join('"' + fn(h) + '"'); }); }
    return svg;
  }
  icons.forEach((ic) => { const t = C2T[ic.id]; if (!t) return; const r = ic.render; ic.colors2 = t.c; ic.picker2 = true; ic.colorLabel2 = t.l;
    ic.render = (o) => retint(r(o), o.uid, t, o.color2, o.on); });
  (window.HDA = window.HDA || []).push({
    id: "chandelier",
    tab: "Chandeliers",
    group: "Lights",
    kind: "light",
    intro: "Twenty chandeliers, from crystal and candle arms to wagon wheels, sputniks and LED rings. Bulbs glow in the light color, crystals sparkle while lit, and the warm halo dims with brightness.",
    
    css: `.hda-chandelier-tw{opacity:.6;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-chandelier-tw{animation:hda-chandelier-tw 2.8s ease-in-out infinite}
.hda-anim .hda-chandelier-flk{animation:hda-chandelier-flk 2.2s ease-in-out infinite}
@keyframes hda-chandelier-tw{0%,100%{opacity:0;transform:scale(.3) rotate(0deg)}45%{opacity:1;transform:scale(1) rotate(20deg)}70%{opacity:.15;transform:scale(.5) rotate(30deg)}}
@keyframes hda-chandelier-flk{0%,100%{opacity:1}30%{opacity:.88}48%{opacity:.97}62%{opacity:.84}80%{opacity:.95}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-chandelier-tw,.hda-anim .hda-chandelier-flk{animation:none}}`,
    icons,
  });
})();
