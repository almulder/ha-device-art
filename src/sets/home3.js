(function () {
  const P = "hda-home3-";
  const H = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const GRN = "#3ee08f", RED = "#ff5a5f", BLU = "#5aa9ff", AMB = "#ffb84d";
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx + r)} ${f(cy)}A${r} ${r} 0 1 0 ${f(cx - r)} ${f(cy)}Z`;
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");

  function ctx(o) {
    const u = o.uid, D = [];
    const x = {
      o, u, D, on: !!o.on, L: o.level == null ? 1 : Math.max(0, Math.min(1, o.level)), c: o.color || "#888888", n: 0,
      id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`,
      lg(a, x1, y1, x2, y2) { const id = `${u}-g${this.n++}`; D.push(`<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 == null ? 0 : y2}">${stops(a)}</linearGradient>`); return `url(#${id})`; },
      rg(a, cx, cy, r) { const id = `${u}-g${this.n++}`; D.push(`<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`); return `url(#${id})`; },
    };
    x.B = .3 + .7 * x.L;
    return x;
  }
  const sh = (c, a) => H().shade(c, a);
  const plas = (x, c, vert) => x.lg([[0, sh(c, vert ? .35 : -.3)], [.18, sh(c, .25)], [.5, c], [.85, sh(c, -.2)], [1, sh(c, -.45)]], 0, 0, vert ? 0 : 1, vert ? 1 : 0);
  const steel = (x, vert) => x.lg([[0, "#6c7178"], [.2, "#e6e9ec"], [.45, "#b7bcc2"], [.7, "#eef0f2"], [1, "#6c7178"]], 0, 0, vert ? 0 : 1, vert ? 1 : 0);
  const gloss = (x) => x.lg([[0, "#fff", .45], [.35, "#fff", .05], [.36, "#fff", 0]], 0, 0, 1, 1);
  const shadow = (x, cx, cy, rx, ry, op) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry || 4)}" fill="${x.rg([[0, "#000", op || .5], [.6, "#000", (op || .5) * .4], [1, "#000", 0]])}"/>`;
  const glow = (x, cx, cy, r, col, op) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${x.rg([[0, col, op == null ? .9 : op], [.45, col, (op == null ? .9 : op) * .35], [1, col, 0]])}"/>`;
  function led(x, cx, cy, col, r) {
    r = r || 1.4;
    return x.on ? `<g class="${P}breath">${glow(x, cx, cy, r * 5, col)}</g><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${col}"/><circle cx="${f(cx - r * .3)}" cy="${f(cy - r * .3)}" r="${f(r * .4)}" fill="#fff" fill-opacity=".8"/>`
      : `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="#000" fill-opacity=".45"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * .55)}" fill="#fff" fill-opacity=".15"/>`;
  }
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcfgd", "-": "g" };
  function seg(str, x0, y0, w, h, col, op) {
    let s = ""; const t = Math.max(.9, w * .17), gap = w * 1.7;
    let cur = x0;
    String(str).split("").forEach((ch) => {
      if (ch === ".") { s += `<circle cx="${f(cur - gap * .18)}" cy="${f(y0 + h)}" r="${f(t * .6)}" fill="${col}"/>`; cur += gap * .2; return; }
      const X = cur, on = SEG[ch] || "", hh = h / 2; cur += gap;
      const p = { a: [X, y0, X + w, y0], b: [X + w, y0, X + w, y0 + hh], c: [X + w, y0 + hh, X + w, y0 + h], d: [X, y0 + h, X + w, y0 + h], e: [X, y0 + hh, X, y0 + h], f: [X, y0, X, y0 + hh], g: [X, y0 + hh, X + w, y0 + hh] };
      Object.keys(p).forEach((k) => { const q = p[k]; s += `<path d="M${f(q[0])} ${f(q[1])}L${f(q[2])} ${f(q[3])}" stroke="${col}" stroke-opacity="${on.indexOf(k) >= 0 ? (op == null ? 1 : op) : .07}" stroke-width="${f(t)}" stroke-linecap="round"/>`; });
    });
    return s;
  }

  function scene(x, back, body) {
    const vig = x.rg([[0, "#000", 0], [.62, "#000", .06], [1, "#000", .48]], .5, .46, .76);
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="${x.id("c")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${x.id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter>${x.D.join("")}</defs>
<g clip-path="url(#${x.id("c")})"><g class="hda-bg">${back}<rect x="8" y="8" width="184" height="184" fill="${vig}"/></g>${body}</g>
<g class="hda-bg"><rect x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></g></svg>`;
  }
  const speck = (seed, n, y0, y1) => { const r = rnd(seed); let s = ""; for (let i = 0; i < n; i++) s += `<circle cx="${f(10 + r() * 180)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(.3 + r() * .7)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.03 + r() * .06).toFixed(2)}"/>`; return s; };
  const wall = (x, c1, c2, y1, seed) => `<rect x="8" y="8" width="184" height="${y1 - 8}" fill="${x.lg([[0, c1], [1, c2]], 0, 0, .2, 1)}"/>` + speck(seed || 3, 40, 8, y1);
  function tiles(x, y0, y1, c, size) {
    let s = `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="${x.lg([[0, sh(c, .08)], [1, sh(c, -.12)]], 0, 0, 0, 1)}"/>`;
    for (let y = y0; y < y1; y += size) s += `<path d="M8 ${y}H192" stroke="#000" stroke-opacity=".14" stroke-width=".8"/><path d="M8 ${y + 1}H192" stroke="#fff" stroke-opacity=".12" stroke-width=".5"/>`;
    for (let xx = 8 + size; xx < 192; xx += size) s += `<path d="M${xx} ${y0}V${y1}" stroke="#000" stroke-opacity=".12" stroke-width=".8"/>`;
    return s;
  }
  function floorWood(x, y0, tone) {
    tone = tone || "#9a6d48"; let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, sh(tone, -.25)], [1, sh(tone, .08)]], 0, 0, 0, 1)}"/>`;
    const r = rnd(y0 * 7 + 11);
    for (let y = y0 + 6; y < 192; y += 7 + (y - y0) * .12) s += `<path d="M8 ${f(y)}H192" stroke="#2a1608" stroke-opacity=".35" stroke-width=".7"/><path d="M${f(20 + r() * 150)} ${f(y)}v${f(6 + (y - y0) * .1)}" stroke="#2a1608" stroke-opacity=".3" stroke-width=".6"/>`;
    return s;
  }
  function floorTile(x, y0, c) {
    let s = `<rect x="8" y="${y0}" width="184" height="${192 - y0}" fill="${x.lg([[0, sh(c, -.18)], [1, sh(c, .06)]], 0, 0, 0, 1)}"/>`;
    for (let i = -4; i <= 8; i++) s += `<path d="M${f(100 + i * 18)} ${y0}L${f(100 + i * 34)} 192" stroke="#000" stroke-opacity=".12"/>`;
    for (let y = y0 + 8, k = 8; y < 192; k *= 1.35, y += k) s += `<path d="M8 ${f(y)}H192" stroke="#000" stroke-opacity=".12"/>`;
    return s;
  }
  const base = (x, y, c) => `<rect x="8" y="${y - 9}" width="184" height="9" fill="${x.lg([[0, sh(c || "#eeeae2", .1)], [1, sh(c || "#eeeae2", -.15)]], 0, 0, 0, 1)}"/><path d="M8 ${y - 9}H192" stroke="#fff" stroke-opacity=".5"/><path d="M8 ${y}H192" stroke="#000" stroke-opacity=".3"/>`;
  function counter(x, y, c) {
    c = c || "#d8d4cc";
    return `<rect x="8" y="${y}" width="184" height="${192 - y}" fill="${x.lg([[0, sh(c, .12)], [.12, c], [.14, sh(c, -.35)], [1, sh(c, -.5)]], 0, 0, 0, 1)}"/><path d="M8 ${y}H192" stroke="#fff" stroke-opacity=".5"/>`;
  }

  function steam(x, cx, cy, n, spread) {
    if (!x.on) return "";
    let s = "";
    for (let i = 0; i < n; i++) s += `<circle class="${P}rise" style="animation-delay:${f(-i * .55)}s;animation-duration:${f(2.4 - x.L)}s" cx="${f(cx + (i - (n - 1) / 2) * spread)}" cy="${cy}" r="${f(5 + i % 2 * 2)}" fill="#ffffff" fill-opacity="${f(.25 + .3 * x.L)}" filter="${x.url("bl")}"/>`;
    return s;
  }
  function airflow(x, x0, cy, len, dir, h) {
    if (!x.on) return "";
    let s = ""; const d = dir || -1;
    for (let i = 0; i < 5; i++) { const y = cy + (i - 2) * (h || 6); s += `<path class="${P}flow" style="animation-delay:${f(-i * .17)}s;animation-duration:${f(1.1 - .6 * x.L)}s" d="M${x0} ${f(y)}q${f(d * len * .3)} ${f(-3)} ${f(d * len * .55)} 0t${f(d * len * .45)} 0" fill="none" stroke="#dff1ff" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/>`; }
    return s;
  }
  const kibbleBits = (x, cx, cy, w, n, seed) => { const r = rnd(seed || 7); let s = ""; for (let i = 0; i < n; i++) { const px = cx - w / 2 + r() * w, py = cy - r() * 5; s += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="2.2" ry="1.6" fill="${r() > .5 ? "#8a5a2b" : "#a66f38"}" transform="rotate(${f(r() * 180)} ${f(px)} ${f(py)})"/>`; } return s; };

  const boardBack = (x, y) => wall(x, "#cfd8d6", "#a9b5b2", 192, 5) + `<path d="M8 ${y}H192V${y + 9}H8Z" fill="${x.lg([[0, "#e8ecef"], [1, "#9aa3ab"]], 0, 0, 0, 1)}"/>` +
    [...Array(12)].map((_, i) => `<path d="M${14 + i * 16} ${y}l6 9" stroke="#7aa0b8" stroke-opacity=".35" stroke-width="2"/>`).join("") + `<path d="M8 ${y + 9}H192V${y + 12}H8Z" fill="#000" fill-opacity=".35"/><path d="M60 ${y + 12}L120 192M140 ${y + 12}L80 192" stroke="#8d949c" stroke-width="3"/>`;
  function ironSide(x, X, Y, W, Hh, bodyC, handleC, tank) {
    const sole = `M${X} ${Y + Hh}L${X + W * .18} ${Y + Hh - 6}H${X + W}V${Y + Hh}Z`;
    const body = `M${X + 4} ${Y + Hh - 5}C${X + W * .25} ${Y + Hh - 20} ${X + W * .45} ${Y + Hh * .35} ${X + W * .7} ${Y + Hh * .3}C${X + W * .9} ${Y + Hh * .28} ${X + W} ${Y + Hh * .45} ${X + W} ${Y + Hh - 6}Z`;
    const handle = `M${X + W * .3} ${Y + Hh * .5}C${X + W * .32} ${Y} ${X + W * .55} ${Y - 4} ${X + W * .8} ${Y + 2}C${X + W * .96} ${Y + 6} ${X + W} ${Y + Hh * .3} ${X + W * .95} ${Y + Hh * .45}L${X + W * .85} ${Y + Hh * .4}C${X + W * .86} ${Y + 14} ${X + W * .62} ${Y + 8} ${X + W * .45} ${Y + 12}C${X + W * .4} ${Y + 14} ${X + W * .38} ${Y + Hh * .45} ${X + W * .38} ${Y + Hh * .5}Z`;
    let s = shadow(x, X + W * .55, Y + Hh + 1, W * .55, 3.5, .55);
    if (x.on) s += `<ellipse cx="${f(X + W * .5)}" cy="${Y + Hh + 1}" rx="${f(W * .5)}" ry="3" fill="${AMB}" fill-opacity="${f(.25 * x.L)}" filter="${x.url("bl")}"/>`;
    s += `<path d="${sole}" fill="${steel(x, true)}"/><path d="${sole}" fill="none" stroke="#4a4f55" stroke-width=".6"/>`;
    s += `<path d="${body}" fill="${plas(x, bodyC, true)}"/><path d="${body}" fill="none" stroke="${sh(bodyC, -.5)}" stroke-width=".6"/>`;
    if (tank) s += `<path d="M${X + W * .14} ${Y + Hh - 8}C${X + W * .25} ${Y + Hh - 18} ${X + W * .35} ${Y + Hh * .55} ${X + W * .48} ${Y + Hh * .5}V${Y + Hh - 7}Z" fill="${tank}" fill-opacity=".55"/><path d="M${X + W * .2} ${Y + Hh - 9}H${X + W * .45}" stroke="#bfe6ff" stroke-opacity=".7" stroke-width="1.2"/>`;
    s += `<path d="${handle}" fill="${plas(x, handleC, true)}"/><path d="${handle}" fill="none" stroke="${sh(handleC, -.45)}" stroke-width=".6"/><path d="M${X + W * .5} ${Y + 4}C${X + W * .62} ${Y + 1} ${X + W * .75} ${Y + 2} ${X + W * .85} ${Y + 6}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>`;
    s += `<path d="${body}" fill="${gloss(x)}" opacity=".5"/>`;
    return s;
  }
  function ironFocus(x) {
    const X = 30, Y = 70, W = 132, Hh = 74;
    let s = ironSide(x, X, Y, W, Hh, x.c, "#f1f0ec", "#8fc7ea");
    s += `<ellipse cx="${X + W * .62}" cy="${Y + Hh * .62}" rx="9" ry="6" fill="${steel(x)}"/><path d="M${X + W * .62} ${Y + Hh * .62}l${f(6 * Math.cos(-2.6 + 2.4 * x.L))} ${f(4 * Math.sin(-2.6 + 2.4 * x.L))}" stroke="#333" stroke-width="1.2"/>`;
    s += `<circle cx="${X + W * .36}" cy="${Y + 10}" r="2.6" fill="${sh(x.c, -.2)}"/><circle cx="${X + W * .42}" cy="${Y + 7}" r="2.6" fill="${sh(x.c, -.2)}"/>`;
    s += led(x, X + W * .75, Y + Hh * .5, AMB, 1.3) + `<path d="M${X + W} ${Y + Hh * .55}C${X + W + 14} ${Y + Hh * .6} ${X + W + 14} ${Y + Hh + 20} ${X + W + 30} 200" fill="none" stroke="#e8e8e8" stroke-width="3"/>`;
    s += steam(x, X + W * .35, Y + Hh + 2, 4, 14);
    return scene(x, boardBack(x, Y + Hh + 1), s);
  }
  function ironTravel(x) {
    const X = 52, Y = 92, W = 92, Hh = 52;
    let s = ironSide(x, X, Y, W, Hh, x.c, sh(x.c, .55), null);
    s += `<rect x="${X + W * .48}" y="${Y + Hh * .55}" width="12" height="6" rx="3" fill="#222"/>` + led(x, X + W * .7, Y + Hh * .6, RED, 1.2);
    s += `<path d="M${X + W} ${Y + Hh * .6}C${X + W + 10} ${Y + Hh * .7} ${X + W + 12} 190 ${X + W + 22} 200" fill="none" stroke="#333" stroke-width="2.4"/>`;
    s += steam(x, X + W * .35, Y + Hh + 2, 3, 12);
    return scene(x, boardBack(x, Y + Hh + 1), s);
  }
  function ironStation(x) {
    const bx = 34, by = 112, bw = 132, bh = 52;
    const b = `M${bx + 10} ${by}H${bx + bw - 6}Q${bx + bw} ${by} ${bx + bw} ${by + 8}V${by + bh - 6}Q${bx + bw} ${by + bh} ${bx + bw - 6} ${by + bh}H${bx + 6}Q${bx} ${by + bh} ${bx} ${by + bh - 6}V${by + 20}Q${bx} ${by} ${bx + 10} ${by}Z`;
    let s = shadow(x, 100, by + bh + 2, 72, 5, .55);
    s += `<path d="M${bx + bw - 10} ${by + 10}C${bx + bw + 20} ${by - 10} ${bx + bw + 8} ${by - 60} ${bx + bw - 30} ${by - 58}" fill="none" stroke="#2a2b2e" stroke-width="4"/>`;
    s += `<path d="${b}" fill="${plas(x, x.c, true)}"/><path d="${b}" fill="none" stroke="${sh(x.c, -.5)}" stroke-width=".6"/>`;
    s += `<path d="${rr(bx + 8, by + 14, 58, 30, 6)}" fill="#7fb8de" fill-opacity=".45"/><path d="${rr(bx + 8, by + 14 + 30 * (1 - .3 - .6 * x.L), 58, 30 * (.3 + .6 * x.L), 5)}" fill="#5aa6d8" fill-opacity=".55"/><path d="${rr(bx + 8, by + 14, 58, 30, 6)}" fill="none" stroke="#fff" stroke-opacity=".4"/>`;
    s += `<path d="${rr(bx + 80, by + 18, 40, 14, 3)}" fill="#111"/>` + (x.on ? seg("4.5", bx + 86, by + 21, 5, 8, "#7fe0ff") : "") + led(x, bx + 100, by + 40, x.on ? GRN : RED, 1.4);
    s += `<path d="M${bx + 20} ${by + 2}H${bx + bw - 14}" stroke="#5c6066" stroke-width="3" stroke-linecap="round"/>`;
    s += ironSide(x, bx + 22, by - 52, 104, 52, sh(x.c, .1), "#e9e8e4", null).replace(/<ellipse[^>]*\/>/, "");
    s += steam(x, bx + 60, by - 2, 4, 12);
    return scene(x, wall(x, "#d9d3c8", "#b6ad9e", 170, 9) + counter(x, by + bh, "#bfa98c"), s);
  }

  const bathBack = (x, y, c) => tiles(x, 8, y, c || "#dfe6ea", 23) + counter(x, y, "#e4e0d8");
  function loopdryer(x) {
    const cx = 100, cy = 64, R = 24, L = 58, x0 = cx - L / 2;
    let s = airflow(x, x0 - 6, cy, 46, -1, 7) + shadow(x, cx, 180, 30, 4, .45);
    const hd = rr(cx - 10, cy + 10, 20, 104, 9);
    s += `<path d="${hd}" fill="${plas(x, x.c)}"/><path d="${rr(cx - 10, cy + 74, 20, 40, 9)}" fill="${plas(x, sh(x.c, -.25))}"/>`;
    for (let i = 0; i < 8; i++) s += `<path d="M${cx - 7} ${cy + 78 + i * 4.2}H${cx + 7}" stroke="#000" stroke-opacity=".45" stroke-width="1.2" stroke-dasharray="1.4 1.2"/>`;
    s += `<path d="${hd}" fill="none" stroke="${sh(x.c, -.5)}" stroke-width=".6"/><path d="M${cx - 6} ${cy + 16}V${cy + 70}" stroke="#fff" stroke-opacity=".3" stroke-width="1.6" stroke-linecap="round"/>`;
    s += `<path d="M${cx + 10} ${cy + 30}v10" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>` + [0, 1, 2].map((i) => `<circle cx="${cx + 4}" cy="${cy + 48 + i * 5}" r="1" fill="${x.on && i < 1 + Math.round(2 * x.L) ? "#fff" : "#333"}"/>`).join("");
    s += `<path d="M${cx} ${cy + 114}C${cx} 190 ${cx + 16} 184 ${cx + 26} 200" fill="none" stroke="#1d1e22" stroke-width="2.6"/>`;
    const head = rr(x0, cy - R, L, 2 * R, R * .35);
    s += `<path d="${head}" fill="${plas(x, x.c, true)}"/><path d="${head}" fill="none" stroke="${sh(x.c, -.5)}" stroke-width=".6"/><path d="M${x0 + 8} ${cy - R + 4}H${x0 + L - 6}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>`;
    s += `<rect x="${x0 + L - 5}" y="${cy - R + 3}" width="5" height="${2 * R - 6}" rx="2" fill="${sh(x.c, -.3)}"/>`;
    s += `<ellipse cx="${x0 + 2}" cy="${cy}" rx="9" ry="${R}" fill="${steel(x)}"/><ellipse cx="${x0 + 2}" cy="${cy}" rx="5" ry="${R * .58}" fill="#1a1b1f"/><ellipse cx="${x0 + 2}" cy="${cy}" rx="9" ry="${R}" fill="none" stroke="#4a4e55" stroke-width=".6"/>`;
    if (x.on) s += `<ellipse cx="${x0 + 2}" cy="${cy}" rx="7" ry="${R * .78}" fill="none" stroke="${AMB}" stroke-opacity="${f(.3 + .4 * x.L)}" stroke-width="2" class="${P}breath"/>`;
    return scene(x, bathBack(x, 178), s);
  }
  function revlon(x) {
    const cx = 100, cy = 62;
    let s = shadow(x, cx, 180, 30, 4, .45);
    const r = rnd(41);
    for (let i = 0; i < 46; i++) { const t = i / 46 * Math.PI * 2, ex = Math.cos(t), ey = Math.sin(t), bx = cx + ex * 22, by = cy + ey * 34, ox = cx + ex * (31 + r() * 3), oy = cy + ey * (43 + r() * 3);
      s += `<path d="M${f(bx)} ${f(by)}L${f(ox)} ${f(oy)}" stroke="#141416" stroke-width="1.1"/><circle cx="${f(ox)}" cy="${f(oy)}" r="1.2" fill="${i % 3 ? "#1d1d20" : x.c}"/>`; }
    s += `<ellipse cx="${cx}" cy="${cy}" rx="24" ry="36" fill="${plas(x, "#25262b")}"/>`;
    for (let rr2 = -28; rr2 <= 28; rr2 += 7) for (let c = -16; c <= 16; c += 8) { const px = cx + c + ((rr2 / 7) % 2 ? 4 : 0), py = cy + rr2; if (((px - cx) / 20) ** 2 + ((py - cy) / 32) ** 2 > 1) continue; s += `<circle cx="${f(px)}" cy="${f(py)}" r="1.3" fill="${(px + py) % 3 < 1 ? x.c : "#0e0e10"}"/>`; }
    s += `<path d="M${cx - 18} ${cy - 20}Q${cx - 20} ${cy} ${cx - 16} ${cy + 18}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2.4" stroke-linecap="round"/>`;
    if (x.on) s += `<g class="${P}breath" opacity="${f(.3 + .4 * x.L)}">${glow(x, cx, cy, 34, AMB, .3)}</g>`;
    s += `<path d="${rr(cx - 12, cy + 38, 24, 7, 3)}" fill="${plas(x, x.c, true)}"/>`;
    const hd = `M${cx - 11} ${cy + 45}H${cx + 11}L${cx + 9} ${cy + 118}Q${cx} ${cy + 124} ${cx - 9} ${cy + 118}Z`;
    s += `<path d="${hd}" fill="${plas(x, "#25262b")}"/><path d="${rr(cx - 4, cy + 60, 8, 22, 4)}" fill="#0c0c0e"/><rect x="${cx - 3}" y="${f(cy + 61 + (x.on ? 12 * (1 - x.L) : 15))}" width="6" height="6" rx="2" fill="${x.c}"/>`;
    s += `<path d="M${cx - 7} ${cy + 50}V${cy + 112}" stroke="#fff" stroke-opacity=".22" stroke-width="1.4" stroke-linecap="round"/>` + led(x, cx, cy + 92, x.c, 1.1);
    s += `<path d="M${cx} ${cy + 122}C${cx} 192 ${cx + 20} 186 ${cx + 30} 200" fill="none" stroke="#1d1e22" stroke-width="3"/>`;
    s += airflow(x, cx - 40, cy, 26, -1, 9) + airflow(x, cx + 40, cy, 26, 1, 9);
    return scene(x, bathBack(x, 178, "#e6dde5"), s);
  }
  function hotel(x) {
    const wx = 70, wy = 46;
    let s = shadow(x, 104, 150, 50, 5, .3);
    const box = rr(wx, wy, 60, 64, 8);
    s += `<path d="${box}" fill="#000" opacity=".35" transform="translate(2 4)" filter="${x.url("bl")}"/><path d="${box}" fill="${plas(x, x.c, true)}"/><path d="${box}" fill="none" stroke="${sh(x.c, -.45)}" stroke-width=".6"/>`;
    s += `<path d="${rr(wx + 8, wy + 8, 22, 10, 3)}" fill="#222"/>` + led(x, wx + 44, wy + 13, x.on ? GRN : "#888", 1.3);
    s += `<ellipse cx="${wx + 30}" cy="${wy + 52}" rx="26" ry="9" fill="${sh(x.c, -.25)}"/>`;
    const dr = `M${wx - 22} ${wy + 30}H${wx + 50}Q${wx + 62} ${wy + 30} ${wx + 62} ${wy + 42}Q${wx + 62} ${wy + 54} ${wx + 50} ${wy + 54}H${wx - 22}Z`;
    s += `<path d="${dr}" fill="${plas(x, x.c, true)}"/><path d="${dr}" fill="none" stroke="${sh(x.c, -.45)}" stroke-width=".6"/><ellipse cx="${wx - 22}" cy="${wy + 42}" rx="4" ry="12" fill="#222"/>`;
    s += `<path d="${rr(wx + 22, wy + 50, 18, 46, 7)}" fill="${plas(x, x.c)}"/><path d="${rr(wx + 22, wy + 50, 18, 46, 7)}" fill="none" stroke="${sh(x.c, -.45)}" stroke-width=".6"/><rect x="${wx + 27}" y="${wy + 60}" width="8" height="10" rx="2" fill="#222"/>`;
    let coil = `M${wx + 31} ${wy + 96}`; for (let i = 0; i < 9; i++) coil += `c-6 2 -6 6 0 7c6 1 6 -3 0 -2`;
    s += `<path d="${coil}" fill="none" stroke="#333" stroke-width="1.6"/><path d="M${wx + 31} ${wy + 96 + 9 * 7}C${wx + 31} 168 ${wx + 44} 160 ${wx + 48} ${wy + 58}" fill="none" stroke="#333" stroke-width="1.6"/>`;
    s += airflow(x, wx - 28, wy + 42, 40, -1, 5);
    return scene(x, tiles(x, 8, 192, "#e9e3d6", 30), s);
  }

  const scaleBack = (x) => wall(x, "#e8e4dc", "#c9c2b6", 92, 13) + base(x, 92, "#f2efe8") + floorTile(x, 92, "#cfc9c0");
  function slab(x, cx, cy, w, h, top, edge) {
    const k = 8, d = `M${cx - w / 2 + k} ${cy - h / 2}H${cx + w / 2 - k}Q${cx + w / 2} ${cy - h / 2} ${cx + w / 2 + 2} ${cy - h / 2 + k}L${cx + w / 2 + 6} ${cy + h / 2 - k}Q${cx + w / 2 + 7} ${cy + h / 2} ${cx + w / 2 - k} ${cy + h / 2}H${cx - w / 2 + k}Q${cx - w / 2 - 7} ${cy + h / 2} ${cx - w / 2 - 6} ${cy + h / 2 - k}L${cx - w / 2 - 2} ${cy - h / 2 + k}Q${cx - w / 2} ${cy - h / 2} ${cx - w / 2 + k} ${cy - h / 2}Z`;
    return shadow(x, cx, cy + h / 2 + 6, w * .6, 6, .5) + `<path d="${d}" fill="${edge}" transform="translate(0 5)"/><path d="${d}" fill="${top}"/><path d="${d}" fill="${gloss(x)}" opacity=".6"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".6"/>`;
  }
  const weight = (x) => String(Math.round(110 + 100 * x.L));
  function withings(x) {
    const cx = 100, cy = 138, light = H().hx(x.c).reduce((a, b) => a + b, 0) > 380, ln = light ? "#9aa0a6" : "#5c636b";
    let s = slab(x, cx, cy, 120, 62, x.lg([[0, sh(x.c, .12)], [1, sh(x.c, -.1)]], 0, 0, 0, 1), sh(x.c, -.4));
    s += `<path d="M${cx} ${cy - 31}V${cy + 31}M${cx - 62} ${cy + 2}H${cx + 62}" stroke="${ln}" stroke-opacity=".6" stroke-width=".6"/><ellipse cx="${cx}" cy="${cy + 2}" rx="5" ry="3" fill="${x.c}" stroke="${ln}" stroke-width=".6"/>`;
    s += `<path d="${rr(cx - 12, cy - 27, 24, 10, 2)}" fill="${light ? "#e9e9e6" : "#050506"}"/>`;
    if (x.on) s += seg(weight(x), cx - 9, cy - 25, 3, 6, light ? "#111" : "#f2f2f2") + `<g class="${P}breath">${glow(x, cx, cy - 22, 20, "#ffffff", .22)}</g>`;
    return scene(x, scaleBack(x), s);
  }
  function slimScale(x) {
    const cx = 100, cy = 138, light = H().hx(x.c).reduce((a, b) => a + b, 0) > 380, ln = light ? "#a9b0b6" : "#4c535b";
    let s = slab(x, cx, cy, 116, 64, x.lg([[0, sh(x.c, .1)], [1, sh(x.c, -.08)]], 0, 0, 0, 1), sh(x.c, -.4));
    s += `<path d="M${cx} ${cy - 18}V${cy + 32}M${cx - 60} ${cy + 4}H${cx + 60}" stroke="${ln}" stroke-opacity=".7" stroke-width=".6"/><path d="${rr(cx - 6, cy, 12, 8, 3)}" fill="${sh(x.c, -.2)}"/>`;
    s += `<path d="${rr(cx - 16, cy - 29, 32, 11, 2)}" fill="${light ? "#d6d9dc" : "#060607"}"/>`;
    s += x.on ? seg(weight(x), cx - 11, cy - 27, 3.4, 7, light ? "#202326" : "#ffffff") + `<g class="${P}breath">${glow(x, cx, cy - 23, 20, "#ffffff", .25)}</g>` : "";
    return scene(x, scaleBack(x), s);
  }
  function dialScale(x) {
    const cx = 100, cy = 140;
    let s = slab(x, cx, cy, 112, 58, x.lg([[0, sh(x.c, .15)], [1, sh(x.c, -.12)]], 0, 0, 0, 1), sh(x.c, -.4));
    s += `<path d="${rr(cx - 46, cy - 24, 92, 26, 6)}" fill="#3a3b3f"/>`; for (let i = 0; i < 14; i++) s += `<path d="M${cx - 42 + i * 6.3} ${cy - 22}v22" stroke="#000" stroke-opacity=".35" stroke-width="1.6"/>`;
    s += `<ellipse cx="${cx}" cy="${cy + 14}" rx="22" ry="12" fill="#f4f1e8"/><ellipse cx="${cx}" cy="${cy + 14}" rx="22" ry="12" fill="none" stroke="#000" stroke-opacity=".4"/>`;
    for (let i = 0; i <= 20; i++) { const a = Math.PI * (1.05 + i / 20 * .9); s += `<path d="M${f(cx + Math.cos(a) * 19)} ${f(cy + 16 + Math.sin(a) * 10)}L${f(cx + Math.cos(a) * (i % 5 ? 17 : 15))} ${f(cy + 16 + Math.sin(a) * (i % 5 ? 9 : 8))}" stroke="#222" stroke-width=".6"/>`; }
    const t = x.on ? .15 + .7 * x.L : 0, a = Math.PI * (1.05 + t * .9);
    s += `<path d="M${cx} ${cy + 16}L${f(cx + Math.cos(a) * 17)} ${f(cy + 16 + Math.sin(a) * 9)}" stroke="${RED}" stroke-width="1.2" stroke-linecap="round" class="${x.on ? P + "needle" : ""}"/><circle cx="${cx}" cy="${cy + 16}" r="1.4" fill="#333"/>`;
    s += `<ellipse cx="${cx - 6}" cy="${cy + 8}" rx="12" ry="3" fill="#fff" fill-opacity=".5"/>`;
    return scene(x, scaleBack(x), s);
  }

  const petBack = (x, c) => wall(x, c || "#c9d4c0", sh(c || "#c9d4c0", -.2), 120, 17) + base(x, 120) + floorWood(x, 120, "#a37750");
  function bowl(x, cx, cy, w, fill) {
    return `<ellipse cx="${cx}" cy="${cy + 6}" rx="${w / 2}" ry="${w * .14}" fill="${steel(x, true)}"/><path d="M${cx - w / 2} ${cy}A${w / 2} ${w * .14} 0 0 0 ${cx + w / 2} ${cy}L${cx + w / 2 - 4} ${cy + 8}A${w / 2 - 4} ${w * .12} 0 0 1 ${cx - w / 2 + 4} ${cy + 8}Z" fill="${steel(x)}"/>` +
      `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${w * .14}" fill="#5c6168"/><ellipse cx="${cx}" cy="${cy + .6}" rx="${w / 2 - 3}" ry="${w * .11}" fill="${steel(x, true)}"/>` + (fill ? kibbleBits(x, cx, cy + 2, w * .55, fill, cx) : "");
  }
  function granary(x) {
    const cx = 100, X = 66, W = 64, top = 44, bot = 150;
    const body = rr(X, top, W, bot - top, 14);
    let s = shadow(x, cx, bot + 2, 52, 5, .5);
    s += `<path d="${rr(X - 8, bot - 18, W + 16, 22, 6)}" fill="${plas(x, x.c, true)}"/>`;
    s += `<path d="${body}" fill="${plas(x, x.c)}"/><path d="${body}" fill="none" stroke="${sh(x.c, -.45)}" stroke-width=".6"/>`;
    s += `<path d="${rr(X - 1, top - 6, W + 2, 14, 7)}" fill="${plas(x, sh(x.c, .06), true)}"/><path d="M${X + 8} ${top - 4}H${X + W - 8}" stroke="#fff" stroke-opacity=".6"/>`;
    const wy = top + 14, wh = 62, lvl = wh * (.2 + .75 * x.L);
    s += `<path d="${rr(cx - 7, wy, 14, wh, 7)}" fill="#1c1e22" fill-opacity=".5"/><path d="${rr(cx - 6, wy + wh - lvl, 12, lvl, 6)}" fill="#a06a35"/>` + kibbleBits(x, cx, wy + wh - lvl + 4, 10, 6, 3);
    s += `<path d="${rr(cx - 7, wy, 14, wh, 7)}" fill="none" stroke="#fff" stroke-opacity=".4"/><path d="M${cx - 4} ${wy + 4}V${wy + wh - 6}" stroke="#fff" stroke-opacity=".3" stroke-width="1.4"/>`;
    s += led(x, cx, top + 6, x.on ? GRN : "#888", 1.2);
    s += `<path d="${rr(cx - 10, bot - 30, 20, 10, 3)}" fill="#1a1b1e"/>`;
    if (x.on) for (let i = 0; i < 4; i++) s += `<ellipse class="${P}fall" style="animation-delay:${f(-i * .3)}s" cx="${cx - 3 + i * 2}" cy="${bot - 18}" rx="2" ry="1.5" fill="#9c6633"/>`;
    s += bowl(x, cx, bot - 4, 54, x.on ? 10 : 3);
    return scene(x, petBack(x), s);
  }
  function smartfeed(x) {
    const cx = 100, X = 56, W = 88, top = 50, bot = 156;
    const body = `M${X + 10} ${top}H${X + W - 10}Q${X + W} ${top} ${X + W} ${top + 12}V${bot - 6}Q${X + W} ${bot} ${X + W - 8} ${bot}H${X + 8}Q${X} ${bot} ${X} ${bot - 6}V${top + 12}Q${X} ${top} ${X + 10} ${top}Z`;
    let s = shadow(x, cx, bot + 2, 56, 5, .5);
    s += `<path d="${body}" fill="${plas(x, x.c)}"/><path d="${body}" fill="none" stroke="${sh(x.c, -.5)}" stroke-width=".6"/>`;
    s += `<path d="M${X + 2} ${top + 10}H${X + W - 2}" stroke="${sh(x.c, -.4)}" stroke-width="1.2"/><path d="M${X + 12} ${top + 3}H${X + W - 12}" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>`;
    s += `<path d="${rr(X + 10, bot - 46, W - 20, 42, 10)}" fill="${sh(x.c, -.45)}"/><path d="${rr(cx - 9, bot - 46, 18, 8, 2)}" fill="#111"/>`;
    if (x.on) for (let i = 0; i < 4; i++) s += `<ellipse class="${P}fall" style="animation-delay:${f(-i * .3)}s" cx="${cx - 3 + i * 2}" cy="${bot - 34}" rx="2" ry="1.5" fill="#9c6633"/>`;
    s += bowl(x, cx, bot - 16, 56, x.on ? 10 : 3);
    s += `<path d="${rr(cx - 12, top + 18, 24, 8, 4)}" fill="${sh(x.c, -.25)}"/>` + led(x, cx + 8, top + 22, x.on ? BLU : "#888", 1.1) + `<circle cx="${cx - 6}" cy="${top + 22}" r="2" fill="${sh(x.c, .2)}"/>`;
    return scene(x, petBack(x, "#c3c9d6"), s);
  }
  function gravity(x) {
    const cx = 100, bot = 160;
    let s = shadow(x, cx, bot + 2, 60, 5, .5);
    const tray = `M${cx - 58} ${bot - 18}H${cx + 58}L${cx + 52} ${bot}H${cx - 52}Z`;
    s += `<path d="${tray}" fill="${plas(x, x.c, true)}"/><path d="${tray}" fill="none" stroke="${sh(x.c, -.45)}" stroke-width=".6"/><ellipse cx="${cx + 18}" cy="${bot - 18}" rx="36" ry="5" fill="${sh(x.c, -.35)}"/>`;
    const bt = `M${cx - 46} ${bot - 22}V${bot - 100}Q${cx - 46} ${bot - 116} ${cx - 30} ${bot - 116}H${cx - 14}Q${cx + 2} ${bot - 116} ${cx + 2} ${bot - 100}V${bot - 34}L${cx - 6} ${bot - 22}Z`;
    const fill = x.on ? .25 + .7 * x.L : .04, fy = bot - 22 - 92 * fill;
    s += `<clipPath id="${x.id("bt")}"><path d="${bt}"/></clipPath><g clip-path="url(#${x.id("bt")})"><rect x="${cx - 48}" y="${f(fy)}" width="52" height="${f(bot - fy)}" fill="#9c6633"/>${kibbleBits(x, cx - 22, fy + 6, 44, 16, 9)}${kibbleBits(x, cx - 22, fy + 26, 44, 14, 19)}</g>`;
    s += `<path d="${bt}" fill="#e8f2f8" fill-opacity=".22"/><path d="${bt}" fill="none" stroke="#fff" stroke-opacity=".6"/><path d="M${cx - 40} ${bot - 104}V${bot - 30}" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linecap="round"/>`;
    s += x.on ? kibbleBits(x, cx + 18, bot - 16, 50, 14, 5) : kibbleBits(x, cx + 10, bot - 16, 14, 2, 5);
    return scene(x, petBack(x, "#d8cbb6"), s);
  }

  function water(x, d) { return `<path d="${d}" fill="${x.lg([[0, "#bfe6ff", .75], [1, "#5aa9e6", .55]], 0, 0, 0, 1)}"/>`; }
  function catit(x) {
    const cx = 100, by = 160, top = 92, wt = 52, wb = 46;
    let s = shadow(x, cx, by + 3, 56, 5, .5);
    const body = `M${cx - wt} ${top}A${wt} 10 0 0 0 ${cx + wt} ${top}L${cx + wb} ${by - 6}A${wb} 8 0 0 1 ${cx - wb} ${by - 6}Z`;
    s += `<path d="${body}" fill="${x.lg([[0, "#c9ccd0"], [.25, "#ffffff"], [.6, "#f2f3f2"], [1, "#b9bdc2"]])}"/><path d="${body}" fill="none" stroke="#9aa0a6" stroke-width=".6"/>`;
    s += `<path d="${rr(cx - 4, top + 22, 8, 26, 4)}" fill="#cfe9f6"/><path d="${rr(cx - 4, top + 22 + 26 * (1 - x.L), 8, 26 * x.L, 4)}" fill="#7cc3ec"/>`;
    s += `<ellipse cx="${cx}" cy="${top}" rx="${wt + 2}" ry="12" fill="${plas(x, x.c, true)}"/><ellipse cx="${cx}" cy="${top + 1}" rx="${wt - 6}" ry="8.5" fill="${sh(x.c, -.2)}"/><ellipse cx="${cx}" cy="${top + 2}" rx="${wt - 10}" ry="6.5" fill="#bfe3f4" fill-opacity=".8"/>`;
    if (x.on) s += `<ellipse class="${P}ripple" cx="${cx}" cy="${top + 2}" rx="${wt - 14}" ry="5" fill="none" stroke="#fff" stroke-opacity=".7"/>`;
    s += `<path d="M${cx} ${top}V${top - 12}" stroke="${sh(x.c, -.15)}" stroke-width="4"/>`;
    for (let i = 0; i < 10; i++) { const t = i / 10 * Math.PI * 2; s += `<ellipse cx="${f(cx + Math.cos(t) * 8)}" cy="${f(top - 14 + Math.sin(t) * 3.2)}" rx="5" ry="2.2" fill="#ffffff" stroke="#c9ccd0" stroke-width=".4" transform="rotate(${f(t * 180 / Math.PI)} ${f(cx + Math.cos(t) * 8)} ${f(top - 14 + Math.sin(t) * 3.2)})"/>`; }
    s += `<ellipse cx="${cx}" cy="${top - 14.5}" rx="4.2" ry="2.4" fill="#ffd23e"/>`;
    if (x.on) s += `<path class="${P}bubble" d="M${cx - 3} ${top - 16}q3 ${f(-6 - 6 * x.L)} 6 0" fill="#dff3ff" fill-opacity=".85"/>` + [-1, 1].map((sd) => `<path class="${P}flowv" d="M${cx + sd * 10} ${top - 13}q${sd * 6} 3 ${sd * 10} 12" fill="none" stroke="#d8f0ff" stroke-width="1.6" stroke-opacity="${f(.4 + .5 * x.L)}"/>`).join("");
    s += led(x, cx + 30, by - 14, BLU, 1.1);
    return scene(x, petBack(x, "#d6cde0"), s);
  }
  function drinkwell(x) {
    const cx = 100, by = 152;
    let s = shadow(x, cx, by + 6, 60, 6, .5);
    s += `<path d="M${cx - 54} ${by - 50}A54 12 0 0 0 ${cx + 54} ${by - 50}L${cx + 50} ${by}A50 10 0 0 1 ${cx - 50} ${by}Z" fill="#e8f4fb" fill-opacity=".25"/>`;
    s += water(x, `M${cx - 52} ${by - 30}A52 11 0 0 0 ${cx + 52} ${by - 30}L${cx + 50} ${by}A50 10 0 0 1 ${cx - 50} ${by}Z`) + `<ellipse cx="${cx}" cy="${by - 30}" rx="52" ry="11" fill="#9fd6f5" fill-opacity=".7"/>`;
    s += `<ellipse cx="${cx}" cy="${by - 50}" rx="54" ry="12" fill="none" stroke="#fff" stroke-opacity=".7"/><path d="M${cx - 54} ${by - 50}L${cx - 50} ${by}M${cx + 54} ${by - 50}L${cx + 50} ${by}" stroke="#fff" stroke-opacity=".5"/>`;
    s += `<path d="M${cx - 16} ${by - 30}V${by - 70}A16 5 0 0 1 ${cx + 16} ${by - 70}V${by - 30}Z" fill="${x.lg([[0, "#d9dde2", .6], [.5, "#ffffff", .7], [1, "#c9ced4", .6]])}"/><rect x="${cx - 16}" y="${by - 56}" width="32" height="6" fill="${x.c}"/>`;
    s += `<ellipse cx="${cx}" cy="${by - 70}" rx="16" ry="5" fill="${plas(x, "#cfd4da")}"/><ellipse cx="${cx}" cy="${by - 72}" rx="7" ry="2.4" fill="#9aa1a9"/>`;
    if (x.on) { for (let i = 0; i < 6; i++) { const a = -150 + i * 24, ex = cx + Math.cos(a * Math.PI / 180) * 44, ey = by - 32; s += `<path class="${P}flowv" style="animation-delay:${f(-i * .2)}s" d="M${cx} ${by - 72}Q${f(cx + Math.cos(a * Math.PI / 180) * 30)} ${f(by - 96 - 14 * x.L)} ${f(ex)} ${ey}" fill="none" stroke="#d8f0ff" stroke-width="1.6" stroke-opacity="${f(.4 + .5 * x.L)}"/>`; } s += `<ellipse class="${P}ripple" cx="${cx}" cy="${by - 30}" rx="38" ry="8" fill="none" stroke="#fff" stroke-opacity=".6"/>`; }
    s += `<path d="M${cx - 46} ${by - 46}C${cx - 48} ${by - 30} ${cx - 46} ${by - 14} ${cx - 42} ${by - 4}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
    return scene(x, petBack(x, "#cfd9de"), s);
  }
  function dockstream(x) {
    const cx = 100, by = 156, X = 52, W = 96;
    let s = shadow(x, cx, by + 4, 60, 5, .5);
    s += `<path d="${rr(X - 6, by - 10, W + 12, 12, 4)}" fill="${x.lg([[0, "#c99b6a"], [1, "#8d6440"]], 0, 0, 0, 1)}"/><path d="M${X} ${by - 6}H${X + W}" stroke="#6b4a2e" stroke-opacity=".4"/>`;
    const tank = rr(X, by - 66, W, 58, 14);
    s += `<path d="${tank}" fill="${plas(x, x.c)}"/><path d="${tank}" fill="none" stroke="${sh(x.c, -.45)}" stroke-width=".6"/>`;
    s += `<path d="${rr(X + 10, by - 50, 20, 34, 6)}" fill="#cfe9f6" fill-opacity=".5"/><path d="${rr(X + 10, by - 50 + 34 * (1 - x.L), 20, 34 * x.L, 6)}" fill="#7cc3ec" fill-opacity=".6"/>`;
    s += `<path d="M${X + 4} ${by - 66}H${X + W - 4}" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/><ellipse cx="${cx}" cy="${by - 64}" rx="40" ry="6" fill="${sh(x.c, -.25)}"/><ellipse cx="${cx}" cy="${by - 64}" rx="34" ry="4.5" fill="#bfe3f6"/>`;
    s += `<path d="M${cx - 4} ${by - 64}V${by - 80}H${cx + 8}V${by - 74}H${cx + 2}V${by - 64}Z" fill="#1d1e22"/><ellipse cx="${cx + 5}" cy="${by - 74}" rx="3" ry="1.2" fill="#000"/>`;
    if (x.on) s += `<path class="${P}flowv" d="M${cx + 5} ${by - 73}V${by - 64}" stroke="#d8f0ff" stroke-width="${f(1.2 + 1.2 * x.L)}" stroke-linecap="round"/><ellipse class="${P}ripple" cx="${cx + 5}" cy="${by - 64}" rx="12" ry="2" fill="none" stroke="#fff" stroke-opacity=".7"/>`;
    s += led(x, X + W - 12, by - 20, x.on ? GRN : "#888", 1.2);
    return scene(x, petBack(x, "#e2d6c3"), s);
  }

  function scapeAndFish(x, X, Y, W, Hh, seed) {
    const r = rnd(seed || 5), lit = x.aq ? x.aq.light : x.on, L = lit ? x.L : .15;
    let s = `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.lg([[0, H().mix("#0a2a3a", "#4fb3d9", .25 + .55 * L)], [1, H().mix("#04121c", "#1d6c8c", .2 + .5 * L)]], 0, 0, 0, 1)}"/>`;
    s += `<path d="M${X} ${Y + Hh - 10}Q${X + W * .3} ${Y + Hh - 16} ${X + W * .6} ${Y + Hh - 11}T${X + W} ${Y + Hh - 12}V${Y + Hh}H${X}Z" fill="#c9b48a"/>`;
    s += `<path d="M${X + W * .62} ${Y + Hh - 11}l8 -18l12 -4l8 14l4 8Z" fill="#6d6a64"/><path d="M${X + W * .15} ${Y + Hh - 12}l6 -9l9 2l3 7Z" fill="#7a756c"/>`;
    for (let i = 0; i < 9; i++) { const px = X + 6 + r() * (W - 12), h = Hh * (.3 + r() * .5); s += `<path class="${P}sway" style="animation-delay:${f(-r() * 3)}s" d="M${f(px)} ${Y + Hh - 10}q${f(-4 + r() * 8)} ${f(-h / 2)} ${f(-2 + r() * 4)} ${f(-h)}" fill="none" stroke="${r() > .5 ? "#3fa34d" : "#2d7d3a"}" stroke-width="${f(1.4 + r() * 1.6)}" stroke-linecap="round"/>`; }
    const fishes = [["#ff7a2e", .3, .35], ["#ffd23e", .62, .5], ["#4fd2ff", .45, .22], ["#ff4f6d", .78, .3]];
    fishes.forEach(([c, fx, fy], i) => { const px = X + W * fx, py = Y + Hh * fy; s += `<g class="${x.on ? P + "swim" : ""}" style="animation-delay:${f(-i * 1.3)}s"><path d="M${f(px)} ${f(py)}q5 -3.4 9 0q-4 3.4 -9 0Zm9 0l4 -3v6Z" fill="${c}"/></g>`; });
    if (x.aq ? x.aq.filter : x.on) for (let i = 0; i < 5; i++) s += `<circle class="${P}bubble" style="animation-delay:${f(-i * .5)}s" cx="${f(X + W * .88)}" cy="${f(Y + Hh - 14)}" r="${f(1 + i % 2)}" fill="none" stroke="#e6f7ff" stroke-opacity=".8" stroke-width=".6"/>`;
    if (lit) s += `<path d="M${X} ${Y}H${X + W}L${X + W * .8} ${Y + Hh}H${X + W * .2}Z" fill="#fff" fill-opacity="${f(.06 * x.L)}"/>`;
    return s + (x.aq ? aqGear(x, X, Y, W, Hh) : "");
  }
  // (multi-function) an aquarium's parts: Light (the hood light, the bright water), Filter (the bubbles and the current),
  // Heater (a glass heater on the back pane, its element glowing) and the water temperature (a stick-on readout).
  // As a Multi-Function Image a part left out is off; the heater and the readout are drawn only when ticked.
  function aqMF(x) {
    if (!x.o.mf) return;
    const p = x.o.parts || {}, t = x.o.pval && x.o.pval.temp;
    x.aq = { light: !!p.light, filter: !!p.filter, heater: p.heater != null ? !!p.heater : null, temp: t != null && t !== "" && isFinite(+t) ? Math.round(+t) : null };
  }
  function aqGear(x, X, Y, W, Hh) {
    const a = x.aq; let s = "";
    if (a.heater !== null) { const hx = X + 9, y0 = Y + 7, y1 = Y + Hh * .66;
      s += `<rect x="${f(hx - 3)}" y="${f(y0)}" width="6" height="${f(y1 - y0)}" rx="3" fill="#dff4ff" fill-opacity=".22" stroke="#e8f7ff" stroke-opacity=".55" stroke-width=".6"/>` +
        (a.heater ? `<g class="${P}breath"><rect x="${f(hx - 4.5)}" y="${f(y0 + 8)}" width="9" height="${f(y1 - y0 - 12)}" rx="4.5" fill="#ff7a2a" fill-opacity=".25"/></g><rect x="${f(hx - 1.2)}" y="${f(y0 + 9)}" width="2.4" height="${f(y1 - y0 - 14)}" rx="1.2" fill="#ffb066"/>`
          : `<rect x="${f(hx - 1.2)}" y="${f(y0 + 9)}" width="2.4" height="${f(y1 - y0 - 14)}" rx="1.2" fill="#5a5f66"/>`) +
        `<rect x="${f(hx - 3.2)}" y="${f(y0 - 2)}" width="6.4" height="6" rx="1.4" fill="#1d1f23"/><circle cx="${f(hx)}" cy="${f(y0 + 1)}" r="1" fill="${a.heater ? "#ff7a2a" : "#3a3d42"}"/>` +
        [y0 + 10, y1 - 8].map((cy) => `<circle cx="${f(hx + 4.6)}" cy="${f(cy)}" r="1.8" fill="#e8f7ff" fill-opacity=".35"/>`).join("");
    }
    if (a.temp !== null) { const str = String(Math.max(-9, Math.min(199, a.temp))), w = 3, tw = str.length * w * 1.7 + 7, tx = X + W - tw - 6, ty = Y + 6;
      s += `<rect x="${f(tx)}" y="${f(ty)}" width="${f(tw)}" height="11" rx="2" fill="#0d1014" fill-opacity=".9" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/>` +
        seg(str, tx + 3, ty + 2.5, w, 6, "#8ff0c8") + `<circle cx="${f(tx + tw - 2.6)}" cy="${f(ty + 3)}" r=".8" fill="none" stroke="#8ff0c8" stroke-width=".5"/>`;
    }
    return s;
  }
  const roomBack = (x, y, c) => wall(x, c || "#3d4656", sh(c || "#3d4656", -.25), y, 23) + floorWood(x, y, "#6e4d35");
  function rimless(x) {
    aqMF(x);
    const X = 40, Y = 54, W = 120, Hh = 70;
    let s = shadow(x, 100, Y + Hh + 4, 70, 4, .5);
    s += scapeAndFish(x, X, Y, W, Hh, 11);
    s += `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="none" stroke="#dff4ff" stroke-opacity=".75" stroke-width="1.4"/><rect x="${X + 2}" y="${Y + 2}" width="${W - 4}" height="${Hh - 4}" fill="none" stroke="#8fd3ff" stroke-opacity=".25"/>`;
    s += `<path d="M${X + 4} ${Y + 4}L${X + 30} ${Y + 4}L${X + 4} ${Y + 40}Z" fill="#fff" fill-opacity=".08"/>`;
    s += `<rect x="${X + 6}" y="${Y - 8}" width="${W - 12}" height="4" rx="2" fill="${plas(x, x.c, true)}"/><path d="M${X + 8} ${Y - 4}V${Y + 2}M${X + W - 8} ${Y - 4}V${Y + 2}" stroke="${x.c}" stroke-width="1.6"/>`;
    if (x.aq ? x.aq.light : x.on) s += `<rect x="${X + 8}" y="${Y - 4.6}" width="${W - 16}" height="1.4" fill="#f4fbff" fill-opacity="${f(.5 + .5 * x.L)}"/>`;
    s += `<path d="${rr(X - 4, Y + Hh, W + 8, 50, 2)}" fill="${x.lg([[0, "#f2f1ee"], [1, "#c9c6bf"]], 0, 0, 0, 1)}"/><path d="M100 ${Y + Hh + 4}V${Y + Hh + 48}" stroke="#000" stroke-opacity=".15"/><circle cx="94" cy="${Y + Hh + 24}" r="1.4" fill="#888"/><circle cx="106" cy="${Y + Hh + 24}" r="1.4" fill="#888"/>`;
    return scene(x, roomBack(x, Y + Hh + 50), s);
  }
  function fluval(x) {
    aqMF(x);
    const X = 26, Y = 50, W = 148, Hh = 78, k = 14;
    let s = shadow(x, 100, Y + Hh + 8, 84, 5, .55);
    s += `<clipPath id="${x.id("fv")}"><path d="M${X + k} ${Y}H${X + W - k}Q${X + W} ${Y} ${X + W} ${Y + k}V${Y + Hh}H${X}V${Y + k}Q${X} ${Y} ${X + k} ${Y}Z"/></clipPath><g clip-path="url(#${x.id("fv")})">${scapeAndFish(x, X, Y, W, Hh, 21)}</g>`;
    s += `<path d="M${X + k} ${Y}H${X + W - k}Q${X + W} ${Y} ${X + W} ${Y + k}V${Y + Hh}H${X}V${Y + k}Q${X} ${Y} ${X + k} ${Y}Z" fill="none" stroke="${x.c}" stroke-width="3"/>`;
    s += `<rect x="${X - 1}" y="${Y - 7}" width="${W + 2}" height="9" rx="4" fill="${plas(x, x.c, true)}"/><rect x="${X - 2}" y="${Y + Hh - 2}" width="${W + 4}" height="10" rx="2" fill="${plas(x, x.c, true)}"/>`;
    if (x.aq ? x.aq.light : x.on) s += `<rect x="${X + 10}" y="${Y + 1}" width="${W - 20}" height="1.6" fill="#f4fbff" fill-opacity="${f(.5 + .5 * x.L)}"/>`;
    s += `<path d="M${X + 3} ${Y + 6}Q${X + 6} ${Y + 4} ${X + 14} ${Y + 4}" stroke="#fff" stroke-opacity=".5" fill="none"/><path d="M${X + W - 26} ${Y + 8}V${Y + Hh - 8}" stroke="#fff" stroke-opacity=".08" stroke-width="10"/>`;
    s += led(x, X + W - 10, Y - 2.5, BLU, 1);
    s += `<rect x="${X + 2}" y="${Y + Hh + 8}" width="${W - 4}" height="48" fill="${plas(x, x.c, true)}"/><path d="M100 ${Y + Hh + 10}V${Y + Hh + 54}" stroke="#000" stroke-opacity=".4"/>`;
    return scene(x, roomBack(x, Y + Hh + 56, "#4a4f45"), s);
  }
  function tank55(x) {
    aqMF(x);
    const X = 22, Y = 58, W = 156, Hh = 62;
    let s = shadow(x, 100, Y + Hh + 6, 88, 5, .55);
    s += scapeAndFish(x, X, Y, W, Hh, 31);
    s += `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="none" stroke="#bfe6ff" stroke-opacity=".4"/>`;
    s += `<rect x="${X - 2}" y="${Y + Hh - 2}" width="${W + 4}" height="6" fill="#151618"/><path d="${rr(X - 3, Y - 14, W + 6, 15, 3)}" fill="${x.lg([[0, "#3a3c40"], [1, "#0f1012"]], 0, 0, 0, 1)}"/><path d="M${X} ${Y - 12}H${X + W}" stroke="#fff" stroke-opacity=".2"/>`;
    if (x.aq ? x.aq.light : x.on) s += `<rect x="${X + 4}" y="${Y}" width="${W - 8}" height="2" fill="#f4fbff" fill-opacity="${f(.4 + .5 * x.L)}"/>`;
    s += `<path d="M${X + W - 22} ${Y - 14}v-10h14v10" fill="#222"/>`;
    s += `<path d="${rr(X, Y + Hh + 4, W, 54, 2)}" fill="${plas(x, x.c, true)}"/><path d="${rr(X + 6, Y + Hh + 10, W / 2 - 9, 42, 2)}" fill="none" stroke="#000" stroke-opacity=".25"/><path d="${rr(100 + 3, Y + Hh + 10, W / 2 - 9, 42, 2)}" fill="none" stroke="#000" stroke-opacity=".25"/><circle cx="96" cy="${Y + Hh + 31}" r="1.4" fill="#d9c08a"/><circle cx="104" cy="${Y + Hh + 31}" r="1.4" fill="#d9c08a"/>`;
    return scene(x, roomBack(x, Y + Hh + 58, "#5a4a3e"), s);
  }

  const trapBack = (x) => wall(x, "#d8d2c6", "#b8b0a2", 128, 29) + base(x, 128, "#f1ede4") + floorWood(x, 128, "#8a6a4a");
  function victor(x) {
    const X = 40, Y = 116, W = 120, Hh = 40;
    const b = `M${X} ${Y + Hh}V${Y + 18}Q${X} ${Y + 12} ${X + 8} ${Y + 10}L${X + W - 12} ${Y}Q${X + W} ${Y} ${X + W} ${Y + 10}V${Y + Hh}Z`;
    let s = shadow(x, 100, Y + Hh + 2, 66, 5, .55);
    s += `<path d="${b}" fill="${plas(x, x.c, true)}"/><path d="${b}" fill="none" stroke="#000" stroke-width=".6"/><path d="M${X + 8} ${Y + 12}L${X + W - 12} ${Y + 2}" stroke="#fff" stroke-opacity=".25" stroke-width="1.4"/>`;
    s += `<path d="${rr(X + 2, Y + 20, 18, 18, 4)}" fill="#050506"/><path d="M${X + 44} ${Y + 22}H${X + 84}" stroke="#000" stroke-opacity=".3" stroke-width="7" stroke-linecap="round"/>`;
    s += led(x, X + W - 16, Y + 14, x.on ? GRN : RED, 1.5);
    if (!x.on) s += `<g class="${P}blink">${glow(x, X + W - 16, Y + 14, 8, RED, .7)}</g><path d="M${X - 2} ${Y + 34}q-8 2 -12 -4" fill="none" stroke="#9a8f86" stroke-width="1.6" stroke-linecap="round"/>`;
    if (x.on) s += `<path d="M${X + W - 26} ${Y - 6}a6 6 0 0 1 10 0M${X + W - 28} ${Y - 10}a9 9 0 0 1 14 0" fill="none" stroke="${GRN}" stroke-opacity=".7" stroke-width="1" class="${P}breath"/>`;
    return scene(x, trapBack(x), s);
  }
  function liveTrap(x) {
    const X = 40, Y = 116, W = 124, Hh = 38;
    let s = shadow(x, 102, Y + Hh + 2, 70, 5, .5);
    const box = `M${X} ${Y + Hh}V${Y + 14}Q${X} ${Y} ${X + 16} ${Y}H${X + W - 16}Q${X + W} ${Y} ${X + W} ${Y + 14}V${Y + Hh}Z`;
    s += `<path d="${box}" fill="${x.c}" fill-opacity=".55"/><path d="${box}" fill="${gloss(x)}" opacity=".6"/><path d="${box}" fill="none" stroke="${sh(x.c, -.4)}" stroke-width=".8"/>`;
    for (let i = 1; i < 10; i++) s += `<path d="M${X + i * 12.4} ${Y + 1}V${Y + 10}" stroke="${sh(x.c, -.45)}" stroke-opacity=".6" stroke-width="1.6"/>`;
    s += `<path d="M${X} ${Y + Hh - 6}H${X + W}" stroke="${sh(x.c, -.35)}" stroke-width="1.2"/><rect x="${X + W - 30}" y="${Y + Hh - 10}" width="14" height="4" rx="2" fill="#e8c86a"/>`;
    if (!x.on) s += `<g transform="translate(${X + 64} ${Y + Hh - 10})"><ellipse rx="10" ry="6" fill="#8d847b"/><circle cx="-9" cy="-3" r="4" fill="#8d847b"/><circle cx="-10" cy="-7" r="2.4" fill="#b3a79c"/><path d="M10 0q10 2 12 -6" fill="none" stroke="#c9a59a" stroke-width="1.2"/></g>`;
    s += x.on ? `<path d="M${X - 1} ${Y + 4}L${X - 22} ${Y - 14}L${X - 18} ${Y - 18}L${X + 3} ${Y + 1}Z" fill="${sh(x.c, -.2)}" fill-opacity=".8" stroke="${sh(x.c, -.45)}" stroke-width=".6"/>`
      : `<path d="${rr(X - 4, Y + 2, 6, Hh - 2, 2)}" fill="${sh(x.c, -.2)}" fill-opacity=".85" stroke="${sh(x.c, -.45)}" stroke-width=".6" class="${P}snap"/>`;
    s += `<path d="M${X + 6} ${Y + 14}V${Y + Hh - 8}" stroke="#fff" stroke-opacity=".4" stroke-width="1.4"/>` + led(x, X + W - 10, Y + 16, x.on ? GRN : AMB, 1.2);
    return scene(x, trapBack(x), s);
  }
  const icons = [];
  const add = (id, name, colors, label, fn) => icons.push({ id, name, colors, picker: true, colorLabel: label, render: (o) => fn(ctx(o)) });
  add("steam-iron", "Steam iron", ["#8a6a55", "#6c7178", "#2a2a2d", "#2e5aa8"], "Body", ironFocus);
  add("iron_station", "Steam station", ["#23324a", "#2a2a2d", "#5b3d6b", "#e9e8e4"], "Body", ironStation);
  add("iron_travel", "Travel iron", ["#2aa7a0", "#2a2a2d", "#d9578b", "#f1f0ec"], "Body", ironTravel);
  add("round-head-hair-dryer", "Round-head hair dryer", ["#c4366d", "#2c4a8a", "#4a4a52", "#c08a5a"], "Accent", loopdryer);
  add("hot-air-brush", "Hot-air brush", ["#7b4bb3", "#2aa7a0", "#c99582", "#d23c5a"], "Accent", revlon);
  add("hotel_dryer", "Wall hotel dryer", ["#f2f2ef", "#2a2a2d", "#b9bdc2"], "Body", hotel);
  add("smart-glass-scale", "Smart glass scale", ["#1d1e21", "#f4f4f2"], "Glass", withings);
  add("slim-smart-scale", "Slim smart scale", ["#f4f4f2", "#1d1e21"], "Glass", slimScale);
  add("dial_scale", "Analog dial scale", ["#f1ece0", "#b8d8c8", "#9a9ea4", "#c9a0a8"], "Body", dialScale);
  add("tall-pet-feeder", "Tall pet feeder", ["#f2f2ef", "#2a2a2d"], "Body", granary);
  add("wide-pet-feeder", "Wide pet feeder", ["#2f3a4d", "#4a4d52", "#f2f2ef"], "Body", smartfeed);
  add("gravity_feeder", "Gravity feeder", ["#5f8fd0", "#9aa0a8", "#e58fae", "#f2f2ef"], "Base", gravity);
  add("flower-pet-fountain", "Flower pet fountain", ["#7cc576", "#5aa9ff", "#f28fb0", "#f2f2ef"], "Flower", catit);
  add("tiered-pet-fountain", "Tiered pet fountain", ["#3d7fd1", "#7cc576", "#9aa0a8"], "Band", drinkwell);
  add("clear-tank-pet-fountain", "Clear-tank pet fountain", ["#f2f2ef", "#2a2a2d"], "Body", dockstream);
  add("rimless20", "20 gal rimless", ["#2a2a2d", "#c9ccd0", "#f2f2ef"], "Light", rimless);
  add("curved-nano-aquarium", "Curved nano aquarium", ["#18191b", "#f2f2ef"], "Frame", fluval);
  add("tank55", "55 gal on stand", ["#6e4a2e", "#2a2a2d", "#a37a52", "#f2f2ef"], "Stand", tank55);
  // (parts) the aquariums: Light, Filter, Heater and the water temperature
  const AQP = [{ id: "light", name: "Light" }, { id: "filter", name: "Filter" }, { id: "heater", name: "Heater" }, { id: "temp", name: "Water temperature", type: "value", unit: "°", min: 60, max: 90, def: 78 }];
  icons.forEach((ic) => { if (["rimless20", "curved-nano-aquarium", "tank55"].indexOf(ic.id) >= 0) ic.parts = AQP; });
  add("electronic-mouse-trap", "Electronic mouse trap", ["#1d1e21", "#4a4d52"], "Body", victor);
  add("live_trap", "Live-catch trap", ["#5fbf5a", "#5aa9e6", "#c08a4a", "#9aa3ab"], "Body", liveTrap);

  const css = `
.hda-home3-rise,.hda-home3-flow,.hda-home3-fall,.hda-home3-bubble,.hda-home3-swim,.hda-home3-sway,.hda-home3-ripple,.hda-home3-flowv{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-home3-rise{animation:hda-home3-rise 2s ease-out infinite}
@keyframes hda-home3-rise{0%{transform:translateY(0) scale(.6);opacity:0}30%{opacity:1}100%{transform:translateY(-34px) scale(1.6);opacity:0}}
.hda-anim .hda-home3-flow{animation:hda-home3-flow .8s linear infinite}
@keyframes hda-home3-flow{0%{opacity:0;transform:translateX(6px)}40%{opacity:1}100%{opacity:0;transform:translateX(-10px)}}
.hda-anim .hda-home3-fall{animation:hda-home3-fall .9s ease-in infinite}
@keyframes hda-home3-fall{0%{transform:translateY(-4px);opacity:0}20%{opacity:1}100%{transform:translateY(14px);opacity:0}}
.hda-anim .hda-home3-bubble{animation:hda-home3-bubble 2.2s ease-in infinite}
@keyframes hda-home3-bubble{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(-40px);opacity:0}}
.hda-anim .hda-home3-swim{animation:hda-home3-swim 6s ease-in-out infinite}
@keyframes hda-home3-swim{0%,100%{transform:translateX(0)}50%{transform:translateX(-18px)}}
.hda-anim .hda-home3-sway{animation:hda-home3-sway 3.4s ease-in-out infinite;transform-origin:bottom}
@keyframes hda-home3-sway{0%,100%{transform:skewX(0)}50%{transform:skewX(6deg)}}
.hda-anim .hda-home3-ripple{animation:hda-home3-ripple 1.8s ease-out infinite}
@keyframes hda-home3-ripple{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.1);opacity:0}}
.hda-anim .hda-home3-flowv{animation:hda-home3-flowv 1s linear infinite}
@keyframes hda-home3-flowv{0%,100%{opacity:1}50%{opacity:.55}}
.hda-anim .hda-home3-breath{animation:hda-home3-breath 2.8s ease-in-out infinite}
@keyframes hda-home3-breath{0%,100%{opacity:1}50%{opacity:.45}}
.hda-anim .hda-home3-blink{animation:hda-home3-blink 1.4s steps(1,end) infinite}
@keyframes hda-home3-blink{0%,55%{opacity:1}56%,100%{opacity:.15}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-home3-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "home3",
    tab: "Bath, pets & small things",
    group: "Home",
    kind: "device",
    intro: "Real models of irons, hair dryers, bathroom scales, pet feeders, pet fountains, aquariums and smart mouse traps, each in a bit of its room (no logos). On means heating, blowing, weighing, dispensing, flowing, lit or armed; the slider sets heat, speed, weight, fill, flow or light.",
    
    levelLabel: "Level",
    css,
    icons,
  });
})();
