(function () {
  const P = "hda-popcorn-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const RED = "#c0262d", BLK = "#2a2b30", SST = "#b9bfc5", TEAL = "#5fbfb2", YEL = "#e9b62a", CRM = "#efe3c4", BLU = "#2f5fb0";
  const WARM = "#ffcf6b";
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const cp = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const kitchen = (...a) => BGW(kitchen_(...a));
  const gameroom = (...a) => BGW(gameroom_(...a));

  function ctx(o) {
    const u = o.uid, on = !!o.on, lv = o.level == null ? .7 : Math.max(0, Math.min(1, o.level)), c = o.color || RED, h = N();
    return { o, u, on, lv, c, p: { l: h.shade(c, .38), m: c, d: h.shade(c, -.3), k: h.shade(c, -.58) }, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, n: 0 };
  }
  const gid = (x, s) => x.id(s + (x.n++));
  function defs(x) {
    const p = x.p, id = x.id;
    return `<defs>
${lg(id("bd"), [[0, p.l], [.35, p.m], [1, p.d]], 0, 0, 1, 0)}
${lg(id("bv"), [[0, p.l], [.45, p.m], [1, p.k]], 0, 0, 0, 1)}
${lg(id("ss"), [[0, "#6f767d"], [.3, "#e9edf0"], [.55, "#aab1b8"], [.8, "#d9dee2"], [1, "#5c636a"]])}
${lg(id("ssv"), [[0, "#eef1f3"], [.5, "#a9b0b7"], [1, "#5c636a"]], 0, 0, 0, 1)}
${lg(id("in"), [[0, "#3a2814"], [1, "#160f08"]], 0, 0, 0, 1)}
${lg(id("gl"), [[0, "#fff", .32], [.35, "#fff", .04], [.36, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("dn"), [[0, "#000", .5], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("wd"), [[0, "#b07a45"], [1, "#6a4424"]], 0, 0, 0, 1)}
${rg(id("wm"), [[0, WARM, .85], [.4, WARM, .35], [1, WARM, 0]])}
${rg(id("cs"), [[0, "#000", .6], [1, "#000", 0]])}
${rg(id("fl"), [[0, "#bfe6ff", .95], [.5, "#3a7bff", .6], [1, "#3a7bff", 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .48]], .5, .45, .75)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter></defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  function kitchen_(x, cy, tile, top) {
    tile = tile || "#e9e4da"; top = top || "#8b8f94"; const h = N(), g = gid(x, "bs"), t = gid(x, "ct");
    let d = ""; for (let y = 14, i = 0; y < cy; y += 9, i++) { d += `M8 ${y}H192`; for (let xx = 8 + (i % 2) * 9; xx < 192; xx += 18) d += `M${xx} ${y - 9}v9`; }
    return `${lg(g, [[0, h.shade(tile, .05)], [1, h.shade(tile, -.2)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${cy - 8}" fill="url(#${g})"/><path d="${d}" stroke="#000" stroke-opacity=".12"/>
${lg(t, [[0, h.shade(top, .25)], [1, h.shade(top, -.2)]], 0, 0, 0, 1)}<rect x="8" y="${cy}" width="184" height="12" fill="url(#${t})"/><path d="M8 ${cy}H192" stroke="#fff" stroke-opacity=".4"/><rect x="8" y="${cy + 12}" width="184" height="${180 - cy}" fill="#3d3127"/><rect x="8" y="${cy + 12}" width="184" height="5" fill="${x.url("dn")}"/>`;
  }
  function gameroom_(x, fy, wall, carpet) {
    wall = wall || "#2a1f3a"; carpet = carpet || "#4a1420"; const h = N(), g = gid(x, "wl"), r = rnd(fy);
    let s = `${lg(g, [[0, h.shade(wall, .1)], [1, h.shade(wall, -.35)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="url(#${g})"/><rect x="8" y="${fy - 26}" width="184" height="3" fill="#000" fill-opacity=".25"/>`;
    let d = ""; for (let xx = 20; xx < 192; xx += 22) d += `M${xx} 8V${fy - 26}`;
    s += `<path d="${d}" stroke="#000" stroke-opacity=".15"/><rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="${carpet}"/><rect x="8" y="${fy}" width="184" height="6" fill="${x.url("dn")}"/>`;
    for (let i = 0; i < 30; i++) s += `<circle cx="${f(8 + r() * 184)}" cy="${f(fy + 4 + r() * (192 - fy))}" r="1.2" fill="${["#e8b923", "#1a0a10", "#c9a050"][(r() * 3) | 0]}" opacity=".5"/>`;
    return s;
  }

  function puffs(seed, X, Y0, W, top, n, mound) {
    const r = rnd(seed); let a = "", b = "", k = "";
    const H = Y0 - top;
    if (H <= .5) return "";
    for (let i = 0; i < n; i++) {
      const u = r(), px = X + 2 + u * (W - 4), peak = mound ? Math.sin(Math.PI * u) : 1, py = Y0 - 2 - r() * Math.max(1, H * (mound ? (.75 + .25 * peak) : 1) - 2), s = 1.6 + r() * 1.2;
      b += cp(px + .6, py + .8, s) + cp(px + s * .8 + .6, py - s * .4 + .8, s * .8);
      a += cp(px, py, s) + cp(px + s * .8, py - s * .4, s * .8) + cp(px - s * .5, py - s * .7, s * .7);
      if (r() > .7) k += cp(px + .4, py + .3, .6);
    }
    return `<path d="${b}" fill="#c99a4a"/><path d="${a}" fill="#fff3d4"/><path d="${k}" fill="#e2a73a"/>`;
  }
  function flyers(x, cx, cy, spread, n) {
    if (!x.on) return "";
    const r = rnd(Math.round(cx * 7 + cy)); let s = "";
    for (let i = 0; i < n; i++) {
      const px = cx + (r() - .5) * spread, py = cy + (r() - .5) * spread * .4, sz = 1.4 + r();
      s += `<g class="${P}fly${i % 3}" style="animation-delay:${(r() * 1.2).toFixed(2)}s"><path d="${cp(px, py, sz)}${cp(px + sz * .8, py - sz * .4, sz * .8)}" fill="#fff3d4"/><circle cx="${f(px + .3)}" cy="${f(py + .4)}" r=".5" fill="#e2a73a"/></g>`;
    }
    return s;
  }
  function kettle(x, cx, cy, w, hang) {
    const on = x.on, kh = w * .55;
    let s = hang ? `<path d="M${cx} ${cy - kh * .5}V${cy - kh * .5 - hang}" stroke="#9aa1a8" stroke-width="2"/><rect x="${f(cx - 5)}" y="${f(cy - kh * .5 - hang)}" width="10" height="5" rx="1.5" fill="#55595e"/>` : "";
    s += `<g class="${on ? P + "tilt" : ""}">`;
    s += `<rect x="${f(cx - w * .14)}" y="${f(cy - kh * .5 - 6)}" width="${f(w * .28)}" height="6" rx="1.5" fill="#3a3d42"/>`;
    s += `<path d="M${f(cx - w / 2)} ${f(cy - kh * .3)}H${f(cx + w / 2)}L${f(cx + w * .44)} ${f(cy + kh * .45)}Q${cx} ${f(cy + kh * .65)} ${f(cx - w * .44)} ${f(cy + kh * .45)}Z" fill="url(#${x.u}-ss)"/>`;
    s += `<path d="M${f(cx - w * .52)} ${f(cy - kh * .3)}H${f(cx + w * .52)}" stroke="#e9edf0" stroke-width="2"/><path d="M${f(cx - w * .5)} ${f(cy - kh * .5)}Q${cx} ${f(cy - kh * .85)} ${f(cx + w * .5)} ${f(cy - kh * .5)}V${f(cy - kh * .32)}H${f(cx - w * .5)}Z" fill="url(#${x.u}-ssv)" opacity=".9"/>`;
    s += `<path d="M${f(cx + w * .5)} ${f(cy - kh * .1)}h${f(w * .14)}" stroke="#2a2b30" stroke-width="2.4" stroke-linecap="round"/>`;
    if (on || x.lv > .1) s += puffs(9, cx - w * .45, cy - kh * .3, w * .9, cy - kh * .55, 6, true);
    s += `</g>`;
    return s;
  }
  function glassCase(x, X, Y, W, H, o) {
    o = o || {}; const on = x.on, h = N(), fill = x.lv, k = gid(x, "cc"), fr = o.frame || x.url("bd"), pileTop = Y + H - 6 - (H - 22) * fill * .78;
    let s = `<clipPath id="${k}"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath><rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("in")}"/><g clip-path="url(#${k})">`;
    if (on) s += `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${WARM}" opacity=".22"/><ellipse class="${P}glow" cx="${X + W / 2}" cy="${Y + 4}" rx="${W * .65}" ry="${H * .55}" fill="${x.url("wm")}"/>`;
    s += puffs(Math.round(X + W + H), X, Y + H - 4, W, pileTop, Math.round(W * (H * fill) / 22) + 4, true);
    s += kettle(x, X + W * (o.kx || .5), Y + H * .3, Math.min(W * .5, o.kw || 40), H * .12);
    s += flyers(x, X + W * (o.kx || .5), Y + H * .48, W * .7, o.fly || 8);
    s += `</g>`;
    s += `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("gl")}"/><path d="M${f(X + W * .12)} ${Y + H}L${f(X + W * .42)} ${Y}H${f(X + W * .5)}L${f(X + W * .2)} ${Y + H}Z" fill="#fff" opacity=".07"/>`;
    s += `<path d="M${X + W / 2} ${Y}V${Y + H}" stroke="#d7dce0" stroke-opacity=".5" stroke-width="1"/><circle cx="${X + W / 2 - 3}" cy="${Y + H * .55}" r="1.4" fill="#2a2b30"/><circle cx="${X + W / 2 + 3}" cy="${Y + H * .55}" r="1.4" fill="#2a2b30"/>`;
    const post = o.post || 4;
    s += `<rect x="${X - post}" y="${Y}" width="${post}" height="${H}" fill="${fr}"/><rect x="${X + W}" y="${Y}" width="${post}" height="${H}" fill="${fr}"/><rect x="${X + W}" y="${Y}" width="${post}" height="${H}" fill="#000" opacity=".25"/>`;
    return s;
  }
  function header(x, X, Y, W, H, o) {
    o = o || {}; const on = x.on;
    let s = `<path d="${rr(X, Y, W, H, o.r || 2)}" fill="${x.url("bv")}"/><path d="M${X + 2} ${Y + 1}H${X + W - 2}" stroke="#fff" stroke-opacity=".45"/>`;
    if (o.bulbs) for (let i = 0; i < o.bulbs; i++) { const cx = X + 6 + i * (W - 12) / (o.bulbs - 1); s += `<circle cx="${f(cx)}" cy="${f(Y + H / 2)}" r="2" fill="${on ? "#fff2b8" : "#7a6a4a"}"${on ? ` class="${P}chase" style="animation-delay:${((i % 3) * .25).toFixed(2)}s"` : ""}/>`; }
    if (o.panel) s += `<path d="${rr(X + W * .15, Y + 3, W * .7, H - 6, 2)}" fill="${on ? "#ffe6a0" : "#5a4a30"}"/><path d="${rr(X + W * .15, Y + 3, W * .7, H - 6, 2)}" fill="none" stroke="#fff" stroke-opacity=".4"/>${popIcon(X + W / 2, Y + H / 2, H * .35, on)}`;
    return s;
  }
  const popIcon = (cx, cy, s, on) => `<path d="M${f(cx - s * .7)} ${f(cy - s * .2)}L${f(cx - s * .5)} ${f(cy + s)}H${f(cx + s * .5)}L${f(cx + s * .7)} ${f(cy - s * .2)}Z" fill="${on ? "#d6262d" : "#6a2a2a"}"/><path d="M${f(cx - s * .2)} ${f(cy - s * .2)}L${f(cx - s * .15)} ${f(cy + s)}M${f(cx + s * .2)} ${f(cy - s * .2)}L${f(cx + s * .15)} ${f(cy + s)}" stroke="#fff" stroke-width="${f(s * .18)}"/><path d="${cp(cx - s * .4, cy - s * .3, s * .3)}${cp(cx, cy - s * .5, s * .35)}${cp(cx + s * .4, cy - s * .3, s * .3)}" fill="#fff3d4"/>`;
  function wheel(x, cx, cy, r, spokes) {
    let sp = ""; for (let i = 0; i < (spokes || 0); i++) { const a = i / spokes * Math.PI; sp += `M${f(cx + r * .85 * Math.cos(a))} ${f(cy + r * .85 * Math.sin(a))}L${f(cx - r * .85 * Math.cos(a))} ${f(cy - r * .85 * Math.sin(a))}`; }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#16171a"/><circle cx="${cx}" cy="${cy}" r="${f(r * .82)}" fill="none" stroke="${spokes ? "#c9a050" : "#3a3c40"}" stroke-width="${spokes ? 1.6 : 1}"/>${sp ? `<path d="${sp}" stroke="#c9a050" stroke-width="1.1"/>` : ""}<circle cx="${cx}" cy="${cy}" r="${f(r * .25)}" fill="url(#${x.u}-ss)"/>`;
  }
  const shadow = (x, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .14)}" fill="${x.url("cs")}"/>`;
  const floorGlow = (x, cx, cy, rx) => x.on ? `<ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .2)}" fill="${x.url("wm")}" opacity=".5"/>` : "";
  function bowl(x, cx, cy, w, fill, col) {
    const top = cy - w * .3 - fill * w * .28, k = gid(x, "bw");
    return `<ellipse cx="${cx}" cy="${f(cy + 2)}" rx="${f(w * .55)}" ry="${f(w * .08)}" fill="${x.url("cs")}"/>${puffs(cx * 3, cx - w * .45, cy - w * .26, w * .9, top, Math.round(10 + fill * 22), true)}
${lg(k, [[0, N().shade(col, .3)], [.5, col], [1, N().shade(col, -.4)]])}<path d="M${f(cx - w / 2)} ${f(cy - w * .3)}Q${f(cx - w * .45)} ${cy} ${cx} ${cy}Q${f(cx + w * .45)} ${cy} ${f(cx + w / 2)} ${f(cy - w * .3)}Z" fill="url(#${k})"/><path d="M${f(cx - w / 2)} ${f(cy - w * .3)}H${f(cx + w / 2)}" stroke="#fff" stroke-opacity=".5" stroke-width="1.2"/><path d="M${f(cx - w * .32)} ${f(cy - w * .2)}Q${f(cx - w * .3)} ${f(cy - w * .08)} ${f(cx - w * .15)} ${f(cy - w * .04)}" stroke="#fff" stroke-opacity=".3" stroke-width="1.6" fill="none"/>`;
  }
  function seg(str, x0, y0, w, hh, col, dim) {
    const S = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" }; let s = "", xx = x0;
    String(str).split("").forEach((ch) => {
      if (ch === ":") { s += `<circle cx="${f(xx)}" cy="${f(y0 + hh * .3)}" r=".6" fill="${col}"/><circle cx="${f(xx)}" cy="${f(y0 + hh * .7)}" r=".6" fill="${col}"/>`; xx += w * .7; return; }
      const on = S[ch] || "", L = { a: [xx, y0, xx + w, y0], b: [xx + w, y0, xx + w, y0 + hh / 2], c: [xx + w, y0 + hh / 2, xx + w, y0 + hh], d: [xx, y0 + hh, xx + w, y0 + hh], e: [xx, y0 + hh / 2, xx, y0 + hh], f: [xx, y0, xx, y0 + hh / 2], g: [xx, y0 + hh / 2, xx + w, y0 + hh / 2] };
      Object.keys(L).forEach((k) => { const q = L[k]; s += `<path d="M${f(q[0])} ${f(q[1])}L${f(q[2])} ${f(q[3])}" stroke="${on.indexOf(k) >= 0 ? col : dim}" stroke-width="1" stroke-linecap="round"/>`; });
      xx += w * 1.6;
    });
    return s;
  }

  const icons = [];
  const G = (id, name, colors, fn) => icons.push({ id, name, colors, picker: true, colorLabel: "Body", render(o) { return fn(ctx(o)); } });

  G("theater", "Theater cart", [RED, BLK, BLU, YEL, SST], (x) => {
    const X = 60, Y = 50, W = 80, H = 66;
    return svg(x, gameroom(x, 150, "#2b1d30") + shadow(x, 100, 184, 60) + floorGlow(x, 100, 182, 60) +
      header(x, X - 6, Y - 18, W + 12, 14, { panel: true }) + `<path d="M${X - 8} ${Y - 18}H${X + W + 8}L${X + W + 2} ${Y - 26}H${X - 2}Z" fill="${x.p.d}"/>` +
      glassCase(x, X, Y, W, H) + `<rect x="${X - 6}" y="${Y + H}" width="${W + 12}" height="6" fill="${x.p.k}"/>` +
      `<rect x="${X - 2}" y="${Y + H + 6}" width="${W + 4}" height="44" fill="${x.url("bd")}"/><path d="${rr(X + 6, Y + H + 12, W / 2 - 10, 32, 2)}" fill="none" stroke="#000" stroke-opacity=".3"/><path d="${rr(X + W / 2 + 4, Y + H + 12, W / 2 - 10, 32, 2)}" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="${X + W / 2 - 4}" cy="${Y + H + 28}" r="1.6" fill="url(#${x.u}-ss)"/><circle cx="${X + W / 2 + 4}" cy="${Y + H + 28}" r="1.6" fill="url(#${x.u}-ss)"/>` +
      `<path d="M${X + W + 2} ${Y + H + 12}h12v30" fill="none" stroke="url(#${x.u}-ss)" stroke-width="2.4"/>` + wheel(x, X + 6, 178, 8) + wheel(x, X + W - 6, 178, 8));
  });
  G("tabletop", "Tabletop kettle", [RED, BLK, YEL, BLU, SST], (x) => {
    const X = 56, Y = 62, W = 88, H = 78;
    return svg(x, kitchen(x, 150) + shadow(x, 100, 152, 54) +
      header(x, X - 5, Y - 16, W + 10, 12, { panel: true }) + `<path d="M${X - 7} ${Y - 16}H${X + W + 7}L${X + W + 1} ${Y - 22}H${X - 1}Z" fill="${x.p.d}"/>` +
      glassCase(x, X, Y, W, H, { kw: 40 }) + `<rect x="${X - 5}" y="${Y + H}" width="${W + 10}" height="8" fill="${x.url("bv")}"/><path d="${rr(X + W - 22, Y + H + 2, 16, 4, 1)}" fill="#1a1b1e"/><circle cx="${X + W - 26}" cy="${Y + H + 4}" r="1.2" fill="${x.on ? "#ff4a3a" : "#4a1a16"}"/>` +
      `<rect x="${X}" y="${Y + H + 8}" width="5" height="3" fill="#16171a"/><rect x="${X + W - 5}" y="${Y + H + 8}" width="5" height="3" fill="#16171a"/>` + bowl(x, 34, 148, 26, x.lv, "#d6262d"));
  });
  G("carnival", "Carnival cart", [RED, "#2e6a4a", BLU, YEL, BLK], (x) => {
    const X = 58, Y = 66, W = 84, H = 56;
    let aw = ""; for (let i = 0; i < 8; i++) { const ax = 40 + i * 15; aw += `<path d="M${ax} 30H${ax + 15}L${ax + 15} 44Q${ax + 7.5} 50 ${ax} 44Z" fill="${i % 2 ? "#f4efe6" : x.c}"/>`; }
    return svg(x, gameroom(x, 152, "#1e2a3a", "#2a3a2a") + shadow(x, 100, 186, 66) + floorGlow(x, 100, 184, 64) +
      `<path d="M50 30L100 14L150 30Z" fill="${x.p.d}"/><path d="M50 30L100 14L150 30" fill="none" stroke="#c9a050" stroke-width="1.6"/>` + aw + `<path d="M40 30H160" stroke="#c9a050" stroke-width="2"/>` +
      `<path d="M52 44V${Y}M148 44V${Y}" stroke="#c9a050" stroke-width="2.6"/>` + glassCase(x, X, Y, W, H, { frame: "#c9a050", post: 3 }) +
      `<path d="${rr(X - 10, Y + H, W + 20, 30, 3)}" fill="${x.url("bd")}"/><path d="M${X - 6} ${Y + H + 6}H${X + W + 6}M${X - 6} ${Y + H + 24}H${X + W + 6}" stroke="#c9a050" stroke-width="1.6"/>${[0, 1, 2, 3].map((i) => `<circle cx="${X + 8 + i * 22}" cy="${Y + H + 15}" r="4" fill="none" stroke="#c9a050" stroke-width="1.2"/>`).join("")}` +
      `<path d="M${X + W + 10} ${Y + H + 10}L${X + W + 28} ${Y + H + 2}" stroke="#2a2b30" stroke-width="2.4" stroke-linecap="round"/>` + wheel(x, X + 6, 172, 15, 8) + wheel(x, X + W - 6, 172, 15, 8));
  });
  G("hotair", "Hot-air popper", [RED, YEL, "#e9e6df", TEAL, BLK], (x) => {
    const on = x.on, bx = 72, by = 150;
    let stream = "";
    if (on) { const r = rnd(4); for (let i = 0; i < 8; i++) stream += `<g transform="translate(${f(i * 3.4)} ${f(i * i * .55)})"><g class="${P}chute" style="animation-delay:${(i * .12).toFixed(2)}s"><path d="${cp(0, 0, 2.2)}${cp(1.8, -1, 1.8)}" fill="#fff3d4"/><circle cx=".4" cy=".4" r=".6" fill="#e2a73a"/></g></g>`; }
    return svg(x, kitchen(x, 152, "#dfe6e9", "#5a5d62") + shadow(x, bx, 154, 30) +
      `<path d="M${bx - 22} ${by}L${bx - 18} ${by - 62}Q${bx} ${by - 70} ${bx + 18} ${by - 62}L${bx + 22} ${by}Z" fill="${x.url("bd")}"/><path d="M${bx - 16} ${by - 58}Q${bx - 18} ${by - 30} ${bx - 18} ${by - 4}" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>` +
      `${[0, 1, 2, 3, 4].map((i) => `<rect x="${bx - 12 + i * 5.4}" y="${by - 16}" width="2.4" height="10" rx="1" fill="#000" opacity=".35"/>`).join("")}<rect x="${bx + 8}" y="${by - 36}" width="8" height="5" rx="1.5" fill="#1a1b1e"/><circle cx="${bx + 12}" cy="${by - 33.5}" r="1.2" fill="${on ? "#ff4a3a" : "#4a1a16"}"/>` +
      `<path d="M${bx - 20} ${by - 62}Q${bx} ${by - 92} ${bx + 20} ${by - 62}Z" fill="#fff" opacity=".18"/><path d="M${bx + 10} ${by - 70}L${bx + 42} ${by - 64}L${bx + 42} ${by - 54}L${bx + 14} ${by - 60}Z" fill="#fff" opacity=".22"/><path d="M${bx - 20} ${by - 62}Q${bx} ${by - 92} ${bx + 20} ${by - 62}" fill="none" stroke="#fff" stroke-opacity=".6"/><path d="M${bx + 10} ${by - 70}L${bx + 42} ${by - 64}M${bx + 14} ${by - 60}L${bx + 42} ${by - 54}" stroke="#fff" stroke-opacity=".55"/>` +
      `<path d="${rr(bx - 9, by - 90, 18, 8, 3)}" fill="#f2c94c" opacity=".85"/><path d="M${bx - 7} ${by - 89}h14" stroke="#fff" stroke-opacity=".6"/>` +
      (on ? puffs(5, bx - 14, by - 64, 28, by - 76, 8, true) : "") + `<g transform="translate(${bx + 40} ${by - 59})">${stream}</g>` + bowl(x, 140, 150, 50, x.lv, "#2f5fb0"));
  });
  G("stovetop", "Stovetop crank", [SST, RED, BLK, TEAL, YEL], (x) => {
    const on = x.on, cx = 100, base = 140, lift = x.lv * 10, flame = on ? `<g class="${P}glow">${[-24, -12, 0, 12, 24].map((d) => `<path d="M${cx + d - 3} ${base + 6}Q${cx + d} ${base - 4} ${cx + d + 3} ${base + 6}Z" fill="${x.url("fl")}"/>`).join("")}</g>` : "";
    return svg(x, kitchen(x, 146, "#d7d0c4", "#2a2b30") + `<rect x="30" y="146" width="140" height="12" fill="#17181b"/><path d="M40 150H160M60 146v10M140 146v10" stroke="#3a3c40" stroke-width="2"/>` + flame +
      `<path d="M${cx - 38} ${base - 40}V${base}Q${cx} ${base + 8} ${cx + 38} ${base}V${base - 40}Z" fill="${x.url("bd")}"/><path d="M${cx - 34} ${base - 36}V${base - 4}" stroke="#fff" stroke-opacity=".4" stroke-width="3"/>` +
      `<path d="M${cx - 38} ${base - 22}H${cx - 66}" stroke="#7a4b28" stroke-width="5" stroke-linecap="round"/><path d="M${cx - 38} ${base - 22}H${cx - 66}" stroke="#b07a45" stroke-width="2" stroke-linecap="round"/>` +
      (lift > 1 ? puffs(17, cx - 36, base - 38, 72, base - 40 - lift, 14, true) : "") +
      `<g transform="translate(0 ${f(-lift)})"><path d="M${cx - 40} ${base - 40}Q${cx} ${base - 52} ${cx + 40} ${base - 40}Z" fill="url(#${x.u}-ssv)"/><path d="M${cx - 18} ${base - 44}h6M${cx + 12} ${base - 44}h6" stroke="#333" stroke-width="1.4"/>
<path d="M${cx} ${base - 47}V${base - 60}" stroke="#55595e" stroke-width="2.4"/><g class="${on ? P + "crank" : ""}"><path d="M${cx} ${base - 60}H${cx + 22}V${base - 74}" fill="none" stroke="url(#${x.u}-ss)" stroke-width="2.6"/><rect x="${cx + 18.5}" y="${base - 84}" width="7" height="12" rx="3" fill="url(#${x.u}-wd)"/></g></g>` +
      flyers(x, cx, base - 62 - lift, 50, 5));
  });
  G("electric", "Stir popper dome", [RED, BLK, YEL, TEAL, "#e9e6df"], (x) => {
    const on = x.on, cx = 100, by = 148, fill = x.lv, k = gid(x, "dm");
    return svg(x, kitchen(x, 150, "#e6dfd2", "#9a8f80") + shadow(x, cx, 154, 52) +
      `<clipPath id="${k}"><path d="M${cx - 44} ${by - 16}A44 50 0 0 1 ${cx + 44} ${by - 16}Z"/></clipPath><g clip-path="url(#${k})"><rect x="${cx - 46}" y="${by - 70}" width="92" height="56" fill="${on ? "#ffe2a0" : "#d8d2c4"}" opacity=".25"/>${puffs(23, cx - 42, by - 16, 84, by - 18 - 44 * fill, Math.round(10 + 50 * fill), true)}
<g class="${on ? P + "stir" : ""}"><path d="M${cx} ${by - 16}V${by - 40}" stroke="#9aa1a8" stroke-width="2"/><path d="M${cx - 30} ${by - 20}H${cx + 30}" stroke="#9aa1a8" stroke-width="2"/></g>${flyers(x, cx, by - 46, 50, 6)}</g>
<path d="M${cx - 44} ${by - 16}A44 50 0 0 1 ${cx + 44} ${by - 16}Z" fill="${x.url("gl")}"/><path d="M${cx - 44} ${by - 16}A44 50 0 0 1 ${cx + 44} ${by - 16}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.4"/><path d="M${cx - 32} ${by - 30}Q${cx - 28} ${by - 52} ${cx - 10} ${by - 60}" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none"/>
<circle cx="${cx}" cy="${by - 66}" r="5" fill="#fff" opacity=".18"/><path d="${rr(cx - 10, by - 72, 20, 6, 3)}" fill="#fff" opacity=".2"/>` +
      `<path d="M${cx - 50} ${by - 16}H${cx + 50}L${cx + 46} ${by}H${cx - 46}Z" fill="${x.url("bd")}"/><path d="M${cx - 50} ${by - 16}H${cx + 50}" stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/><path d="M${cx - 56} ${by - 10}h6M${cx + 50} ${by - 10}h6" stroke="#1a1b1e" stroke-width="3" stroke-linecap="round"/><circle cx="${cx + 34}" cy="${by - 8}" r="1.5" fill="${on ? "#ff4a3a" : "#4a1a16"}"/>`);
  });
  G("silicone", "Microwave bowl", [RED, TEAL, YEL, BLU, BLK], (x) => {
    const on = x.on, mx = 26, my = 50, mw = 148, mh = 92, ix = mx + 8, iy = my + 8, iw = 100, ih = mh - 16, cx = ix + iw / 2, fill = x.lv, bh = 18 + fill * 16, k = gid(x, "mw");
    let bel = ""; for (let i = 0; i < 4; i++) { const y0 = 128 - i * bh / 4, w0 = 22 + i * 3; bel += `<path d="M${f(cx - w0)} ${f(y0)}L${f(cx - w0 - 3)} ${f(y0 - bh / 4)}H${f(cx + w0 + 3)}L${f(cx + w0)} ${f(y0)}Z" fill="${i % 2 ? x.p.m : x.p.d}"/>`; }
    const top = 128 - bh;
    return svg(x, kitchen(x, 150, "#e3ded5", "#6d7176") +
      `<path d="${rr(mx, my, mw, mh, 5)}" fill="#2a2b30"/><path d="${rr(mx, my, mw, mh, 5)}" fill="url(#${x.u}-gl)" opacity=".5"/><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="3" fill="${on ? "#e8c06a" : "#1b1c20"}"/>` +
      `<clipPath id="${k}"><rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="3"/></clipPath><g clip-path="url(#${k})">${on ? `<ellipse class="${P}glow" cx="${cx}" cy="${iy}" rx="70" ry="40" fill="${x.url("wm")}"/>` : ""}
<ellipse cx="${cx}" cy="130" rx="40" ry="5" fill="#d9e4ea" opacity="${on ? .6 : .2}"/><g class="${on ? P + "turn" : ""}">${bel}${puffs(31, cx - 26, top + 2, 52, top - 8 - fill * 6, Math.round(8 + fill * 14), true)}<path d="M${cx - 27} ${top}H${cx + 27}" stroke="${x.p.k}" stroke-width="2.4"/><path d="M${cx - 26} ${top - 1}Q${cx} ${top - 16 - fill * 6} ${cx + 26} ${top - 1}" fill="#fff" opacity=".18" stroke="#fff" stroke-opacity=".5"/></g></g>` +
      `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="3" fill="url(#${x.u}-gl)"/><rect x="${ix + iw + 6}" y="${iy}" width="${mw - iw - 22}" height="16" rx="2" fill="#0a0b0d"/>${seg("1:45", ix + iw + 11, iy + 4, 4, 8, on ? "#4aff8a" : "#1a2a1e", on ? "#14301e" : "#14181a")}` +
      [0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect x="${ix + iw + 8 + c * 9}" y="${iy + 24 + r * 9}" width="6" height="5" rx="1" fill="#3a3c42"/>`).join("")).join("") + `<rect x="${ix + iw + 8}" y="${iy + 62}" width="24" height="6" rx="1.5" fill="#55595e"/>`);
  });
  G("retro", "Retro 50s", [TEAL, "#e8a0a8", YEL, RED, CRM], (x) => {
    const X = 58, Y = 58, W = 84, H = 64;
    return svg(x, kitchen(x, 156, "#f2eee4", "#c0392b") + BGW(`<path d="M8 156H192" stroke="#fff" stroke-opacity=".6"/>`) + shadow(x, 100, 158, 54) +
      `<path d="M${X - 8} ${Y}V${Y - 10}Q${X + W / 2} ${Y - 36} ${X + W + 8} ${Y - 10}V${Y}Z" fill="${x.url("bd")}"/><path d="M${X - 6} ${Y - 10}Q${X + W / 2} ${Y - 33} ${X + W + 6} ${Y - 10}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/><path d="M${X - 8} ${Y - 2}H${X + W + 8}" stroke="url(#${x.u}-ss)" stroke-width="3"/>${popIcon(X + W / 2, Y - 18, 6, x.on)}` +
      glassCase(x, X, Y, W, H, { kw: 34, post: 6 }) + `<path d="M${X - 6} ${Y}v${H}M${X + W + 6} ${Y}v${H}" stroke="url(#${x.u}-ss)" stroke-width="1.4"/>` +
      `<path d="${rr(X - 8, Y + H, W + 16, 18, 8)}" fill="${x.url("bd")}"/><path d="M${X} ${Y + H + 7}H${X + W - 20}M${X} ${Y + H + 11}H${X + W - 30}" stroke="url(#${x.u}-ss)" stroke-width="1.6"/><circle cx="${X + W - 6}" cy="${Y + H + 9}" r="4" fill="url(#${x.u}-ss)"/><circle cx="${X + W - 6}" cy="${Y + H + 9}" r="1.4" fill="${x.on ? "#ff4a3a" : "#4a1a16"}"/>` +
      `<path d="M${X} ${Y + H + 18}l-4 9M${X + W} ${Y + H + 18}l4 9" stroke="url(#${x.u}-ss)" stroke-width="3" stroke-linecap="round"/>`);
  });
  G("lobby", "Cinema lobby", [RED, BLK, "#7a1f2a", YEL, SST], (x) => {
    const X = 26, Y = 52, W = 148, H = 60;
    return svg(x, gameroom(x, 160, "#3a1420", "#5a1018") + shadow(x, 100, 186, 86) + floorGlow(x, 100, 182, 84) +
      header(x, X - 6, Y - 26, W + 12, 22, { bulbs: 12 }) + `<path d="${rr(X + 40, Y - 22, W - 80, 14, 2)}" fill="${x.on ? "#ffe6a0" : "#4a3a28"}"/>${popIcon(X + W / 2, Y - 15, 6, x.on)}` +
      glassCase(x, X, Y, W, H, { kx: .35, kw: 44, fly: 12 }) + `<rect x="${X + W * .7}" y="${Y + 8}" width="${W * .22}" height="${H - 14}" rx="2" fill="#000" opacity=".2"/><path d="M${X + W * .7} ${Y + 20}h${W * .22}M${X + W * .7} ${Y + 34}h${W * .22}" stroke="#d7dce0" stroke-opacity=".4"/>${[0, 1, 2].map((i) => `<path d="M${X + W * .73 + i * 9} ${Y + 32}l1.5 -10h6l1.5 10z" fill="#d6262d"/><path d="M${X + W * .735 + i * 9} ${Y + 22}h7" stroke="#fff3d4" stroke-width="2.4"/>`).join("")}` +
      `<rect x="${X - 6}" y="${Y + H}" width="${W + 12}" height="66" fill="${x.url("bd")}"/><rect x="${X - 6}" y="${Y + H}" width="${W + 12}" height="5" fill="url(#${x.u}-ss)"/>${[0, 1, 2].map((i) => `<path d="${rr(X + 2 + i * (W / 3), Y + H + 12, W / 3 - 8, 46, 2)}" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="${X + W / 3 - 10 + i * (W / 3)}" cy="${Y + H + 35}" r="1.6" fill="url(#${x.u}-ss)"/>`).join("")}`);
  });
  G("snackcart", "Snack cart", [BLK, RED, BLU, TEAL, YEL], (x) => {
    const X = 50, Y = 50, W = 62, H = 54;
    let jars = ""; [["#ff4a6e", 128], ["#3fd0ff", 146], ["#ffd23f", 164]].forEach(([c, jx], i) => { const r = rnd(i + 3); let b = ""; for (let k = 0; k < 9; k++) b += `<circle cx="${f(jx - 5 + r() * 10)}" cy="${f(96 - r() * 14)}" r="1.8" fill="${c}"/>`; jars += `<path d="${rr(jx - 7, 78, 14, 20, 3)}" fill="#fff" opacity=".12"/>${b}<path d="${rr(jx - 7, 78, 14, 20, 3)}" fill="none" stroke="#fff" stroke-opacity=".5"/><rect x="${jx - 5}" y="75" width="10" height="4" rx="1" fill="#c9a050"/>`; });
    return svg(x, gameroom(x, 152, "#1d2a38", "#232a3a") + shadow(x, 104, 186, 74) + floorGlow(x, 90, 182, 50) +
      header(x, X - 4, Y - 14, W + 8, 11, { panel: true }) + glassCase(x, X, Y, W, H, { kw: 30, fly: 6 }) +
      `<rect x="40" y="104" width="138" height="6" fill="${x.p.k}"/><rect x="118" y="100" width="58" height="4" fill="url(#${x.u}-ss)"/>` + jars +
      `<rect x="42" y="110" width="134" height="52" fill="${x.url("bd")}"/><path d="${rr(48, 116, 58, 40, 2)}" fill="#000" opacity=".25"/>${[0, 1, 2, 3].map((i) => `<path d="M${54 + i * 13} 150l2 -18h8l2 18z" fill="#d6262d"/><path d="M${55 + i * 13} 132h10" stroke="#fff" stroke-width="1.2"/>`).join("")}` +
      `<path d="${rr(112, 116, 58, 40, 2)}" fill="#a8dcef" opacity=".35"/><path d="M112 130H170M112 144H170" stroke="#fff" stroke-opacity=".4"/>${[0, 1, 2, 3].map((i) => `<rect x="${116 + i * 13}" y="${120}" width="7" height="9" rx="2" fill="${["#ff4a6e", "#3fa8ff", "#7bff6a", "#ffd23f"][i]}"/>`).join("")}` +
      `<path d="M176 118h10v34" fill="none" stroke="url(#${x.u}-ss)" stroke-width="2.4"/>` + wheel(x, 52, 172, 9) + wheel(x, 166, 172, 9));
  });

  const css = `
.hda-popcorn-tilt,.hda-popcorn-fly0,.hda-popcorn-fly1,.hda-popcorn-fly2,.hda-popcorn-crank,.hda-popcorn-stir,.hda-popcorn-turn{transform-box:fill-box}
.hda-popcorn-tilt{transform-origin:50% 0}
.hda-anim .hda-popcorn-tilt{animation:hda-popcorn-tilt 2.4s ease-in-out infinite}
@keyframes hda-popcorn-tilt{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(7deg)}}
.hda-anim .hda-popcorn-fly0{animation:hda-popcorn-fly0 1.3s ease-out infinite}
@keyframes hda-popcorn-fly0{0%{transform:translate(0,6px);opacity:0}15%{opacity:1}50%{transform:translate(-8px,-12px)}100%{transform:translate(-14px,10px);opacity:.2}}
.hda-anim .hda-popcorn-fly1{animation:hda-popcorn-fly1 1.1s ease-out infinite}
@keyframes hda-popcorn-fly1{0%{transform:translate(0,6px);opacity:0}15%{opacity:1}50%{transform:translate(9px,-14px)}100%{transform:translate(15px,9px);opacity:.2}}
.hda-anim .hda-popcorn-fly2{animation:hda-popcorn-fly2 .9s ease-out infinite}
@keyframes hda-popcorn-fly2{0%{transform:translate(0,4px);opacity:0}20%{opacity:1}55%{transform:translate(2px,-16px)}100%{transform:translate(-3px,8px);opacity:.2}}
.hda-anim .hda-popcorn-chute{animation:hda-popcorn-chute .5s linear infinite}
@keyframes hda-popcorn-chute{0%{transform:translate(-3px,-2px)}100%{transform:translate(3px,4px)}}
.hda-anim .hda-popcorn-glow{animation:hda-popcorn-glow 2s ease-in-out infinite}
@keyframes hda-popcorn-glow{0%,100%{opacity:1}50%{opacity:.72}}
.hda-anim .hda-popcorn-chase{animation:hda-popcorn-chase .75s ease-in-out infinite}
@keyframes hda-popcorn-chase{0%,100%{opacity:1}50%{opacity:.25}}
.hda-popcorn-crank{transform-origin:0 100%}
.hda-anim .hda-popcorn-crank{animation:hda-popcorn-crank 1.2s ease-in-out infinite}
@keyframes hda-popcorn-crank{0%,100%{transform:scaleX(1)}50%{transform:scaleX(-1)}}
.hda-popcorn-stir{transform-origin:50% 100%}
.hda-anim .hda-popcorn-stir{animation:hda-popcorn-stir 1.6s ease-in-out infinite}
@keyframes hda-popcorn-stir{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.2)}}
.hda-popcorn-turn{transform-origin:50% 100%}
.hda-anim .hda-popcorn-turn{animation:hda-popcorn-turn 3s ease-in-out infinite}
@keyframes hda-popcorn-turn{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.9)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-popcorn-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "popcorn",
    tab: "Popcorn makers",
    group: "Appliances",
    kind: "device",
    levelLabel: "Fill",
    onWord: "Popping",
    offWord: "Off",
    intro: "Ten popcorn makers, from theater and carnival carts to a hot-air popper, stovetop crank and microwave bowl. Popping makes kernels pop and fly, the kettle tilts and the warming light glows; the slider sets how full the case or bowl is. The color is the body.",
    
    css,
    icons,
  });
})();
