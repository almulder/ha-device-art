(function () {
  const P = "hda-fireplace-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const ORG = "#ff7a1a", BLU = "#3a8bff", PUR = "#a54bff", MULTI = "#ff3fa4", AMB = "#ffb02e";
  const EC = [ORG, BLU, PUR, MULTI, AMB];
  const BLKF = "#24252a", BRZ = "#5a4632", NIC = "#a8adb2", MAJ = "#6a3a2a", ENR = "#8c1f22", ENB = "#2a4a7a", IVY = "#e8e0cc";
  const MULTICOLS = ["#ff4a2a", "#a54bff", "#3a8bff", "#ff3fa4"];
  const EL = [{ id: "flame", name: "Flame" }, { id: "heat", name: "Heat" }, { id: "lights", name: "Lights" }];
  const GAS = [{ id: "flame", name: "Flame" }, { id: "blower", name: "Blower" }];
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const room = (...a) => BGW(room_(...a));
  const patio = (...a) => BGW(patio_(...a));

  function ctx(o, gas) {
    const u = o.uid, on = !!o.on, lv = o.level == null ? .7 : o.level, c = o.color || ORG, h = N();
    const pt = (id) => (o.parts ? !!o.parts[id] : on);
    return { o, u, on, lv, c, gas, multi: c.toLowerCase() === MULTI, fl: pt("flame"), heat: pt("heat"), lights: pt("lights"), blower: pt("blower"),
      p: { l: h.shade(c, .38), m: c, d: h.shade(c, -.3), k: h.shade(c, -.58) }, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, n: 0 };
  }
  const gid = (x, s) => x.id(s + (x.n++));
  function defs(x) {
    const id = x.id, h = N();
    const fg = (name, c) => lg(id(name), [[0, c, .95], [.35, c, .85], [.7, h.mix(c, "#ffe9a8", .6), .7], [1, "#fff6d0", 0]], 0, 1, 0, 0);
    let extra = "";
    if (x.multi) MULTICOLS.forEach((c, i) => { extra += fg("fm" + i, c); });
    return `<defs>
${fg("fe", x.gas ? ORG : x.c)}
${lg(id("fg"), [[0, "#3a6bff", .85], [.15, "#ff7a1a", .9], [.6, "#ffc23a", .75], [1, "#fff6d0", 0]], 0, 1, 0, 0)}
${lg(id("fc"), [[0, "#fffbe8", .9], [.6, "#ffe9a0", .5], [1, "#fff", 0]], 0, 1, 0, 0)}
${lg(id("fin"), [[0, x.p.l], [.5, x.p.m], [1, x.p.d]], 0, 0, 0, 1)}
${lg(id("finh"), [[0, x.p.d], [.3, x.p.l], [.6, x.p.m], [1, x.p.k]])}
${lg(id("blk"), [[0, "#3a3b40"], [1, "#121316"]], 0, 0, 0, 1)}
${lg(id("box"), [[0, "#0b0b0d"], [1, "#1c1716"]], 0, 0, 0, 1)}
${lg(id("gl"), [[0, "#fff", .22], [.4, "#fff", .03], [.41, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("dn"), [[0, "#000", .5], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("log"), [[0, "#8a5a36"], [.5, "#5a3820"], [1, "#2a180c"]], 0, 0, 0, 1)}
${lg(id("ss"), [[0, "#6f767d"], [.4, "#e9edf0"], [.6, "#aab1b8"], [1, "#5c636a"]])}
${lg(id("wd"), [[0, "#a87448"], [1, "#6a4426"]], 0, 0, 0, 1)}
${rg(id("glow"), [[0, x.gas ? "#ffb04a" : (x.multi ? "#ff6ad0" : x.c), .7], [.5, x.gas ? "#ff9a3a" : (x.multi ? "#a54bff" : x.c), .22], [1, "#000", 0]])}
${rg(id("emb"), [[0, x.gas ? "#ff8a2a" : (x.multi ? "#ff4a2a" : x.c), .9], [1, x.gas ? "#ff8a2a" : (x.multi ? "#ff4a2a" : x.c), 0]])}
${rg(id("cs"), [[0, "#000", .6], [1, "#000", 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .48]], .5, .45, .75)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter>${extra}</defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  function room_(x, fy, wall, floor) {
    wall = wall || "#cfc6b8"; floor = floor || "#7a5638"; const h = N(), g = gid(x, "wl"), fg = gid(x, "fl"), r = rnd(fy);
    let d = ""; for (let y = fy + 6; y < 192; y += 7) d += `M8 ${y}H192`; for (let y = fy, i = 0; y < 192; y += 7, i++) for (let xx = 8 + (i * 23) % 40; xx < 192; xx += 40 + r() * 20) d += `M${f(xx)} ${y}v7`;
    return `${lg(g, [[0, h.shade(wall, -.25)], [1, h.shade(wall, -.05)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="url(#${g})"/><rect x="8" y="${fy - 6}" width="184" height="6" fill="${h.shade(wall, .25)}"/>
${lg(fg, [[0, h.shade(floor, -.35)], [1, h.shade(floor, .05)]], 0, 0, 0, 1)}<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="url(#${fg})"/><path d="${d}" stroke="#000" stroke-opacity=".2"/><rect x="8" y="${fy}" width="184" height="5" fill="${x.url("dn")}"/>`;
  }
  function patio_(x, fy) {
    const r = rnd(7); let st = "", d = "";
    for (let i = 0; i < 26; i++) st += `<circle cx="${f(8 + r() * 184)}" cy="${f(10 + r() * (fy - 40))}" r="${f(.4 + r() * .6)}" fill="#fff" opacity="${(.3 + r() * .6).toFixed(2)}"/>`;
    for (let y = fy + 6; y < 192; y += 9) d += `M8 ${y}H192`; for (let y = fy, i = 0; y < 192; y += 9, i++) for (let xx = 8 + (i % 2) * 12; xx < 192; xx += 24) d += `M${xx} ${y}v9`;
    return `${lg(x.id("sky"), [[0, "#0c1230"], [1, "#2c2c52"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="${x.url("sky")}"/>${st}<path d="M8 ${fy}L8 ${fy - 22}Q30 ${fy - 40} 52 ${fy - 26}Q74 ${fy - 46} 100 ${fy - 28}Q130 ${fy - 44} 156 ${fy - 24}Q176 ${fy - 36} 192 ${fy - 22}V${fy}Z" fill="#101a16"/>
<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="#6e665c"/><path d="${d}" stroke="#000" stroke-opacity=".25"/><rect x="8" y="${fy}" width="184" height="6" fill="${x.url("dn")}"/>`;
  }
  function brick(x, X, Y, W, H, c, seed) {
    c = c || "#8a4a36"; const h = N(), r = rnd(seed || 5); let s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${c}"/>`, d = "";
    for (let y = Y, i = 0; y < Y + H; y += 5, i++) { d += `M${X} ${y}h${W}`; for (let xx = X + (i % 2 ? 0 : 6); xx < X + W; xx += 12) { d += `M${xx} ${y}v5`; if (r() > .55) s += `<rect x="${xx + .5}" y="${y + .5}" width="11" height="4" fill="${r() > .5 ? "#000" : "#fff"}" opacity="${(.05 + r() * .1).toFixed(2)}"/>`; } }
    return s + `<path d="${d}" stroke="#d8cdbd" stroke-opacity=".35" stroke-width=".7"/>`;
  }
  function stone(x, X, Y, W, H, c, seed) {
    c = c || "#8d8476"; const h = N(), r = rnd(seed || 3); let s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#2b2824"/>`;
    for (let y = Y; y < Y + H; y += 5) for (let xx = X - r() * 10; xx < X + W;) { const w = 10 + r() * 18; s += `<rect x="${f(Math.max(X, xx) + .5)}" y="${f(y + .5)}" width="${f(Math.max(0, Math.min(w, X + W - Math.max(X, xx)) - 1))}" height="4" rx="1" fill="${h.shade(c, r() * .34 - .2)}"/>`; xx += w; }
    return s;
  }
  function mantelShelf(x, X, Y, W, c) {
    const g = gid(x, "ms"), h = N(); c = c || "#6a4426";
    return `${lg(g, [[0, h.shade(c, .3)], [1, h.shade(c, -.3)]], 0, 0, 0, 1)}<rect x="${X}" y="${Y}" width="${W}" height="7" rx="1" fill="url(#${g})"/><path d="M${X} ${Y + .5}h${W}" stroke="#fff" stroke-opacity=".35"/><rect x="${X}" y="${Y + 7}" width="${W}" height="5" fill="${x.url("dn")}"/>`;
  }
  const roomGlow = (x, cx, cy, rx, ry) => x.fl ? `<ellipse class="${P}glow" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${x.url("glow")}" opacity="${f(.5 + .5 * x.lv)}"/>` : "";
  const shadow = (x, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .14)}" fill="${x.url("cs")}"/>`;

  function flames(x, X, by, W, H, o) {
    if (!x.fl) return "";
    o = o || {}; const r = rnd(o.seed || Math.round(X * 3 + W)), n = o.n || Math.max(4, Math.round(W / 9)), h = H * (.3 + .7 * x.lv);
    let back = "", front = "";
    const tongue = (cx, w, hh, grad, cls, dl, op, core) => { const t = (r() - .5) * w * .9, k = (r() - .5) * w * .5; return `<g class="${P}${cls}" style="animation-delay:${dl}s"><path d="M${f(cx - w / 2)} ${f(by)}C${f(cx - w * .75)} ${f(by - hh * .35)} ${f(cx + k)} ${f(by - hh * .6)} ${f(cx + t)} ${f(by - hh)}C${f(cx + k + w * .45)} ${f(by - hh * .55)} ${f(cx + w * .75)} ${f(by - hh * .3)} ${f(cx + w / 2)} ${f(by)}Z" fill="url(#${grad})" opacity="${op}"/>${core ? `<path d="M${f(cx - w * .22)} ${f(by)}Q${f(cx - w * .3)} ${f(by - hh * .3)} ${f(cx + t * .4)} ${f(by - hh * .55)}Q${f(cx + w * .3)} ${f(by - hh * .3)} ${f(cx + w * .22)} ${f(by)}Z" fill="url(#${x.u}-fc)"/>` : ""}</g>`; };
    for (let i = 0; i < n; i++) {
      const cx = X + (i + .5) * W / n + (r() - .5) * W / n * .5, w = W / n * (1.4 + r() * .6), grad = o.gas ? x.id("fg") : x.multi ? x.id("fm" + (i % 4)) : x.id("fe");
      back += tongue(cx, w * 1.15, h * (.75 + r() * .35), grad, "f" + (i % 3), (r() * 1.2).toFixed(2), .55);
      if (r() > .2) front += tongue(cx + (r() - .5) * 4, w * .7, h * (.4 + r() * .35), o.gas ? x.id("fg") : grad, "f" + ((i + 1) % 3), (r() * 1.2).toFixed(2), .95, true);
    }
    const halo = `<ellipse class="${P}glow" cx="${X + W / 2}" cy="${f(by - h * .3)}" rx="${f(W * .6)}" ry="${f(h * .8)}" fill="${x.url("glow")}"/>`;
    return halo + back + front;
  }
  function mist(x, X, by, W, H) {
    if (!x.fl) return "";
    const r = rnd(Math.round(X + W)), h = H * (.35 + .65 * x.lv); let s = "";
    const col = x.multi ? MULTICOLS : [x.c];
    for (let i = 0; i < 12; i++) { const cx = X + 4 + r() * (W - 8), w = 8 + r() * 8, hh = h * (.5 + r() * .5), c = col[i % col.length]; s += `<g class="${P}mist" style="animation-delay:${(r() * 2).toFixed(2)}s"><path d="M${f(cx - w / 2)} ${f(by)}C${f(cx - w)} ${f(by - hh * .4)} ${f(cx + w * .6)} ${f(by - hh * .6)} ${f(cx + w * .1)} ${f(by - hh)}C${f(cx + w)} ${f(by - hh * .55)} ${f(cx + w * .2)} ${f(by - hh * .3)} ${f(cx + w / 2)} ${f(by)}Z" fill="${N().mix(c, "#ffe2a0", .5)}" opacity=".8"/></g>`; }
    return `<ellipse class="${P}glow" cx="${X + W / 2}" cy="${f(by - h * .3)}" rx="${f(W * .6)}" ry="${f(h)}" fill="${x.url("glow")}"/><g filter="${x.url("bl")}">${s}</g>`;
  }
  function embers(x, X, by, W, kind, lit, cyc) {
    const r = rnd(Math.round(X * 7 + W)); let s = "", g = "";
    lit = lit == null ? x.lights : lit;
    const n = Math.round(W / 2.6);
    for (let i = 0; i < n; i++) {
      const cx = X + 2 + r() * (W - 4), cy = by - r() * 4, sz = 1 + r() * 1.8;
      if (kind === "crystal") s += `<path d="M${f(cx - sz)} ${f(cy + sz * .6)}L${f(cx)} ${f(cy - sz)}L${f(cx + sz)} ${f(cy + sz * .6)}Z" fill="${lit ? (x.multi ? MULTICOLS[i % 4] : N().mix(x.c, "#fff", .4)) : "#cfd6dc"}" opacity="${lit ? .9 : .55}"/>`;
      else if (kind === "bead") s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(sz * .8)}" fill="${N().mix(x.c, "#3a6bff", .7)}" opacity=".85"/><circle cx="${f(cx - .4)}" cy="${f(cy - .4)}" r=".4" fill="#fff"/>`;
      else if (kind === "lava") s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(sz)}" fill="${r() > .5 ? "#3a3532" : "#2a2522"}"/>`;
      else s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(sz)}" fill="${lit ? (r() > .5 ? "#ff8a2a" : "#ffcf5a") : "#3a302a"}"/>`;
      if (lit && r() > .6) g += `<circle class="${P}tw" style="animation-delay:${(r() * 2).toFixed(2)}s" cx="${f(cx)}" cy="${f(cy)}" r="${f(sz * 1.6)}" fill="${x.url("emb")}"/>`;
    }
    const bed = lit ? `<ellipse cx="${X + W / 2}" cy="${by - 1}" rx="${W * .55}" ry="5" fill="${x.url("emb")}" opacity=".7"${cyc ? ` class="${P}hue"` : ""}/>` : "";
    return bed + s + g;
  }
  function logs(x, arr, burning) {
    let s = "";
    arr.forEach(([x1, y1, x2, y2, r]) => {
      const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * r, ny = Math.cos(a) * r;
      s += `<path d="M${f(x1 + nx)} ${f(y1 + ny)}L${f(x2 + nx)} ${f(y2 + ny)}A${r} ${r} 0 0 0 ${f(x2 - nx)} ${f(y2 - ny)}L${f(x1 - nx)} ${f(y1 - ny)}Z" fill="url(#${x.u}-log)"/><ellipse cx="${f(x1)}" cy="${f(y1)}" rx="${f(r * .55)}" ry="${f(r)}" fill="#c69a6a" transform="rotate(${f(a * 57.3)} ${f(x1)} ${f(y1)})"/><ellipse cx="${f(x1)}" cy="${f(y1)}" rx="${f(r * .25)}" ry="${f(r * .5)}" fill="#8a5a36" transform="rotate(${f(a * 57.3)} ${f(x1)} ${f(y1)})"/>`;
      s += `<path d="M${f(x1 + nx * .3)} ${f(y1 + ny * .3)}L${f(x2 + nx * .3)} ${f(y2 + ny * .3)}" stroke="#1a0e06" stroke-opacity=".5" stroke-width=".8"/>`;
      if (burning) s += `<path class="${P}tw" d="M${f(x1 + nx * .8 + (x2 - x1) * .3)} ${f(y1 + ny * .8 + (y2 - y1) * .3)}l${f((x2 - x1) * .25)} ${f((y2 - y1) * .25)}" stroke="#ff8a2a" stroke-width="1.2"/>`;
    });
    return s;
  }
  function shimmer(x, X, Y, W) {
    if (!x.heat && !x.blower) return "";
    // (multi-function) as its own part the heater reads plainly: a warm haze over the vent and brighter shimmer
    const mf = !!x.o.mf;
    let s = (mf ? `<ellipse class="${P}glow" cx="${f(X + W / 2)}" cy="${Y - 7}" rx="${f(W / 2 + 4)}" ry="10" fill="#ff8a3a" opacity=".2"/>` : "") + `<rect x="${X}" y="${Y - 1}" width="${W}" height="2" fill="#ff7a3a" opacity="${mf ? ".8" : ".55"}"/>`;
    for (let i = 0; i < 4; i++) { const sx = X + W * (.15 + i * .22); s += `<path class="${P}shim" style="animation-delay:${(i * .35).toFixed(2)}s" d="M${f(sx)} ${Y - 2}q-2.4 -5 0 -10t0 -10" fill="none" stroke="${mf ? "#ffd2a8" : "#fff"}" stroke-opacity="${mf ? ".55" : ".2"}" stroke-width="${mf ? "1.3" : "1"}"/>`; }
    return s;
  }
  function firebox(x, X, Y, W, H, inner) {
    return `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("box")}"/>${inner}<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("gl")}"/><path d="M${X + W * .1} ${Y + H}L${X + W * .35} ${Y}H${X + W * .42}L${X + W * .17} ${Y + H}Z" fill="#fff" opacity=".05"/>`;
  }
  function vent(x, X, Y, W, n) { let d = ""; for (let i = 0; i < (n || 12); i++) d += `M${f(X + 2 + i * (W - 4) / (n || 12))} ${Y}v3`; return `<rect x="${X}" y="${Y - .5}" width="${W}" height="4" rx="1" fill="#0b0b0d"/><path d="${d}" stroke="#3a3b40" stroke-width="1.2"/>` + shimmer(x, X, Y, W); }

  const SURS = [["brick", "Brick"], ["stone", "Stacked stone"], ["tile", "Tile"], ["paint", "Painted"], ["wood", "Wood mantel"], ["marble", "Marble"]];
  const MANS = [["none", "None"], ["beam", "Wood beam"], ["painted", "Painted mantel"]];
  const first = (all, d) => { const i = all.findIndex((a) => a[0] === d); return [all[i]].concat(all.filter((_, k) => k !== i)); };
  const C2 = ["#9b5136", "#8d8476", "#e8e5de", "#3a3b40", "#b08a62", "#cfc8bc"];
  function surround(x, X, Y, W, H, seed) {
    const k = x.opt.sur, c = x.c2, h = N(), r = rnd(seed || 9), g = gid(x, "su");
    if (k === "brick") return brick(x, X, Y, W, H, c, seed);
    if (k === "stone") return stone(x, X, Y, W, H, c, seed);
    if (k === "tile") {
      let s = `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${h.shade(c, .35)}"/>`, d = "";
      for (let y = Y; y < Y + H; y += 18) for (let xx = X; xx < X + W; xx += 18) s += `<rect x="${f(xx + .7)}" y="${f(y + .7)}" width="${f(Math.min(16.6, X + W - xx - .7))}" height="${f(Math.min(16.6, Y + H - y - .7))}" fill="${h.shade(c, r() * .12 - .06)}"/>`;
      for (let y = Y + 18; y < Y + H; y += 18) d += `M${X} ${y}h${W}`;
      for (let xx = X + 18; xx < X + W; xx += 18) d += `M${xx} ${Y}v${H}`;
      return s + `${lg(g, [[0, "#fff", .22], [.45, "#fff", .02], [1, "#000", .12]], 0, 0, 1, 1)}<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="url(#${g})"/><path d="${d}" stroke="${h.shade(c, .5)}" stroke-opacity=".7" stroke-width=".9"/>`;
    }
    if (k === "marble") {
      let v = "";
      for (let i = 0; i < 7; i++) { const x0 = X + r() * W, y0 = Y + r() * H * .4; v += `M${f(x0)} ${f(y0)}C${f(x0 + 18 - r() * 36)} ${f(y0 + H * .3)} ${f(x0 + 20 - r() * 40)} ${f(y0 + H * .55)} ${f(x0 + 24 - r() * 48)} ${f(Math.min(Y + H, y0 + H * .9))}`; }
      return `${lg(g, [[0, h.shade(c, .3)], [.5, c], [1, h.shade(c, -.12)]], 0, 0, 1, 1)}<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="url(#${g})"/><path d="${v}" fill="none" stroke="${h.shade(c, -.35)}" stroke-opacity=".45" stroke-width=".8"/><path d="${v}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" transform="translate(1.5 0)"/><rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("gl")}" opacity=".5"/>`;
    }
    if (k === "wood") {
      const pw = W * .16, hh = H * .2;
      const grainV = (x0, w) => { let d = ""; for (let xx = x0 + 2; xx < x0 + w - 1; xx += 2.6 + r() * 2) d += `M${f(xx)} ${f(Y + hh)}C${f(xx + 1)} ${f(Y + H * .5)} ${f(xx - 1)} ${f(Y + H * .8)} ${f(xx)} ${Y + H}`; return d; };
      let gh = ""; for (let y = Y + 2; y < Y + hh - 1; y += 2.4 + r() * 1.6) gh += `M${X} ${f(y)}C${f(X + W * .3)} ${f(y + 1)} ${f(X + W * .6)} ${f(y - 1)} ${X + W} ${f(y)}`;
      const s2 = `<rect x="${f(X + pw)}" y="${f(Y + hh)}" width="${f(W - 2 * pw)}" height="${f(H - hh)}" fill="#2a2a2e"/><path d="M${f(X + pw)} ${f(Y + hh + (H - hh) / 2)}h${f(W - 2 * pw)}" stroke="#000" stroke-opacity=".3"/>`;
      return s2 + `${lg(g, [[0, h.shade(c, .2)], [.5, c], [1, h.shade(c, -.3)]])}<path d="M${X} ${Y}H${X + W}V${Y + H}H${f(X + W - pw)}V${f(Y + hh)}H${f(X + pw)}V${Y + H}H${X}Z" fill="url(#${g})"/>` +
        `<path d="${grainV(X, pw)}${grainV(X + W - pw, pw)}${gh}" fill="none" stroke="#2a1606" stroke-opacity=".22" stroke-width=".6"/><path d="M${f(X + pw)} ${Y + H}V${f(Y + hh)}H${f(X + W - pw)}V${Y + H}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><path d="M${X + 3} ${Y + 3}H${X + W - 3}" stroke="#fff" stroke-opacity=".25"/>`;
    }
    return `${lg(g, [[0, h.shade(c, .12)], [1, h.shade(c, -.12)]], 0, 0, 0, 1)}<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="url(#${g})"/><rect x="${X + 4}" y="${Y + 4}" width="${W - 8}" height="${H - 4}" fill="none" stroke="#000" stroke-opacity=".12"/><path d="M${X + 5} ${Y + H}V${Y + 5}H${X + W - 5}" fill="none" stroke="#fff" stroke-opacity=".3"/>`;
  }
  function mantel(x, X, Y, W) {
    const m = x.opt.man, h = N(), g = gid(x, "mn");
    if (m === "beam") {
      const r = rnd(X + W); let gr = ""; for (let y = Y + 2; y < Y + 10; y += 2 + r() * 1.4) gr += `M${X - 6} ${f(y)}C${f(X + W * .3)} ${f(y + 1)} ${f(X + W * .7)} ${f(y - 1)} ${X + W + 6} ${f(y)}`;
      return `${lg(g, [[0, "#8a5a34"], [.5, "#6a4426"], [1, "#3e2614"]], 0, 0, 0, 1)}<rect x="${X - 6}" y="${Y}" width="${W + 12}" height="11" rx="1.5" fill="url(#${g})"/><path d="${gr}" fill="none" stroke="#1d0f06" stroke-opacity=".35" stroke-width=".6"/><path d="M${X - 6} ${Y + .6}h${W + 12}" stroke="#fff" stroke-opacity=".25"/><rect x="${X - 6}" y="${Y + 11}" width="${W + 12}" height="6" fill="${x.url("dn")}"/>`;
    }
    if (m === "painted") {
      const c = "#efece4";
      return `<rect x="${X - 8}" y="${Y}" width="${W + 16}" height="5" rx="1" fill="#fbf9f4"/><rect x="${X - 5}" y="${Y + 5}" width="${W + 10}" height="3" fill="${h.shade(c, -.06)}"/><rect x="${X - 3}" y="${Y + 8}" width="${W + 6}" height="3" fill="${h.shade(c, -.14)}"/><path d="M${X - 8} ${Y + .5}h${W + 16}" stroke="#fff"/><rect x="${X - 3}" y="${Y + 11}" width="${W + 6}" height="5" fill="${x.url("dn")}"/>`;
    }
    return "";
  }
  function hearth(x, X, y, W) {
    const k = x.opt.sur, h = N(), c = k === "paint" || k === "wood" ? "#4a4a50" : h.shade(x.c2, -.15);
    return `<rect x="${X}" y="${y}" width="${W}" height="8" fill="${c}"/><path d="M${X} ${y + .5}h${W}" stroke="#fff" stroke-opacity=".3"/><rect x="${X}" y="${y + 6}" width="${W}" height="2" fill="#000" opacity=".2"/>`;
  }

  const icons = [];
  const G = (id, name, colors, label, parts, gas, fn, extra) => icons.push(Object.assign({ id, name, colors, picker: true, colorLabel: label, render(o) {
    const x = ctx(o, gas);
    x.c2 = o.color2 || (extra && extra.colors2 && extra.colors2[0]) || C2[0];
    x.opt = {}; ((extra && extra.options) || []).forEach((op) => { x.opt[op.id] = (o.opt && o.opt[op.id]) || op.values[0][0]; });
    return fn(x);
  } }, parts ? { parts } : {}, extra || {}));
  const SX = (sur, man, more, c2) => ({ options: [{ id: "sur", name: "Surround", values: first(SURS, sur) }, { id: "man", name: "Mantel", values: first(MANS, man) }].concat(more || []), colors2: c2 || C2, picker2: true, colorLabel2: "Surround" });
  const ELC = "Ember / flame color";

  G("wall", "Wall-mount linear", EC, ELC, EL, false, (x) => {
    const X = 22, Y = 82, W = 156, H = 46;
    return svg(x, room(x, 160, "#bfc4c8") + BGW(`<rect x="64" y="22" width="72" height="44" fill="#e9e4da" stroke="#2a2b30" stroke-width="2"/><path d="M68 60L88 40L100 50L116 34L132 60Z" fill="#7a9ab0"/><circle cx="118" cy="34" r="4" fill="#f4d58a"/>`) + roomGlow(x, 100, 150, 110, 40) + shadow(x, 100, 132, 80) +
      `<path d="${rr(X - 3, Y - 7, W + 6, H + 10, 2)}" fill="${x.url("blk")}"/>` + vent(x, X + 20, Y - 5, W - 40, 20) +
      firebox(x, X, Y, W, H, flames(x, X + 4, Y + H - 9, W - 8, 34) + embers(x, X + 2, Y + H - 2, W - 4, "crystal")) + `<path d="M${X - 3} ${Y + H + 3}h${W + 6}" stroke="#fff" stroke-opacity=".15"/>`);
  });

  G("insert", "Built-in electric", EC, ELC, EL, false, (x) => {
    let s = room(x, 166, "#d8cdbb") + surround(x, 30, 58, 140, 108, 3) + mantel(x, 30, 50, 140) + hearth(x, 24, 166, 152);
    if (x.opt.style === "logset") {
      const X = 52, Y = 84, W = 96, H = 70; let hb = "";
      for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) hb += `<path d="M${X + i * 11 - (j % 2) * 5} ${Y + j * 10}l11 0l0 9l-11 0z" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>`;
      s += `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#2a1a14"/>${hb}<path d="M${X} ${Y}h${W}L${X + W - 10} ${Y + 10}H${X + 10}Z" fill="#000" opacity=".4"/>` + roomGlow(x, 100, 150, 70, 34) +
        `<path d="M${X + 14} ${Y + H - 6}h${W - 28}v4h${-(W - 28)}z" fill="#111"/><rect x="${X + 22}" y="${Y + H - 10}" width="${W - 44}" height="5" rx="1" fill="#1a1b1e"/>` + shimmer(x, X + 30, Y + H - 10, W - 60) +
        `<path d="M${X + 10} ${Y + H}L${X + 16} ${Y + 22}H${X + W - 16}L${X + W - 10} ${Y + H}Z" fill="#141416"/><path d="M${X + 16} ${Y + 22}H${X + W - 16}" stroke="#3a3b40"/>` +
        logs(x, [[X + 18, Y + H - 14, X + W - 18, Y + H - 16, 5], [X + 30, Y + H - 21, X + W - 26, Y + H - 26, 4]], x.fl) + flames(x, X + 18, Y + H - 18, W - 36, 34) + embers(x, X + 16, Y + H - 9, W - 32, "ember") +
        `<path d="M${X + 10} ${Y + H}V${Y + H - 9}H${X + W - 10}V${Y + H}Z" fill="${x.url("blk")}"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${X + 16 + i * 9} ${Y + H - 7}v5" stroke="#3a3b40" stroke-width="1.6"/>`).join("")}`;
    } else {
      const X = 58, Y = 92, W = 84, H = 50;
      s += roomGlow(x, 100, 166, 90, 30) + `<rect x="${X - 8}" y="${Y - 8}" width="${W + 16}" height="${H + 16}" fill="${x.url("blk")}"/>` + vent(x, X, Y - 6, W, 14) +
        firebox(x, X, Y, W, H, (() => { let hb = ""; for (let i = -6; i < 16; i++) for (let j = 0; j < 8; j++) { const bx = X + i * 7, by = Y + j * 7; hb += `M${bx} ${by}l7 7M${bx + 7} ${by}l-7 7`; } return `<clipPath id="${x.u}-hbc"><rect x="${X}" y="${Y}" width="${W}" height="${H}"/></clipPath><g clip-path="url(#${x.u}-hbc)"><rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.fl ? "#5a3426" : "#3a2219"}"/><path d="${hb}" stroke="#1a0e0a" stroke-opacity=".6" stroke-width=".8"/><path d="M${X} ${Y}L${X + 10} ${Y + 8}V${Y + H}H${X}ZM${X + W} ${Y}L${X + W - 10} ${Y + 8}V${Y + H}H${X + W}Z" fill="#000" opacity=".35"/></g>`; })() + logs(x, [[X + 14, Y + H - 9, X + W - 14, Y + H - 11, 4], [X + 24, Y + H - 14, X + W - 30, Y + H - 18, 3.4]], x.fl) + flames(x, X + 10, Y + H - 12, W - 20, 30) + embers(x, X + 6, Y + H - 3, W - 12, "ember"));
    }
    return svg(x, s);
  }, SX("brick", "beam", [{ id: "style", name: "Style", values: [["insert", "Insert"], ["logset", "Log set"]] }]));

  G("linear", "Built-in linear", EC, ELC, EL, false, (x) => {
    const three = x.opt.glass === "three", ember = x.opt.media === "ember", X = 34, Y = 104, W = 132, H = 34, d = 12;
    let s = room(x, 172, "#c9c8c4") + surround(x, 14, 64, 172, 108, 7) + mantel(x, 14, 56, 172) + hearth(x, 10, 172, 180) + roomGlow(x, 100, 170, 100, 26);
    let cyc = "";
    if (ember && x.lights) { const r = rnd(9); for (let i = 0; i < 22; i++) cyc += `<circle class="${P}hue" style="animation-delay:${(r() * 3).toFixed(2)}s" cx="${f(X + 4 + r() * (W - 8))}" cy="${f(Y + H - 3 - r() * 5)}" r="${f(1.6 + r() * 1.6)}" fill="${x.multi ? MULTICOLS[i % 4] : x.c}"/>`; }
    const inner = (ember ? flames(x, X + 6, Y + H - 9, W - 12, 18, { n: 16 }) + embers(x, X + 2, Y + H - 2, W - 4, "crystal", x.lights, true) + cyc : flames(x, X + 4, Y + H - 8, W - 8, 26) + embers(x, X + 2, Y + H - 2, W - 4, "crystal"));
    if (three) {
      s += shadow(x, 100, Y + H + 12, 80) + `<path d="M${X - 6} ${Y - 10}H${X + W + 6}L${X + W + 6 + d} ${Y - 15}H${X - 6 - d}Z" fill="#2a2b30"/><rect x="${X - 6}" y="${Y - 10}" width="${W + 12}" height="10" fill="${x.url("blk")}"/>` + vent(x, X + 10, Y - 7, W - 20, 14) +
        `<path d="M${X - d} ${Y - 4}L${X} ${Y}V${Y + H}L${X - d} ${Y + H + 4}Z" fill="${x.url("box")}"/><path d="M${X + W + d} ${Y - 4}L${X + W} ${Y}V${Y + H}L${X + W + d} ${Y + H + 4}Z" fill="${x.url("box")}"/>` +
        (x.fl ? `<path d="M${X - d} ${Y + H + 4}L${X} ${Y + H}V${Y + H - 16}L${X - d} ${Y + H - 12}Z" fill="${x.url("glow")}"/><path d="M${X + W + d} ${Y + H + 4}L${X + W} ${Y + H}V${Y + H - 16}L${X + W + d} ${Y + H - 12}Z" fill="${x.url("glow")}"/>` : "") +
        firebox(x, X, Y, W, H, inner) + `<path d="M${X - d} ${Y - 4}L${X} ${Y}V${Y + H}L${X - d} ${Y + H + 4}ZM${X + W + d} ${Y - 4}L${X + W} ${Y}V${Y + H}L${X + W + d} ${Y + H + 4}Z" fill="#fff" opacity=".1" stroke="#9aa0a6" stroke-width=".8"/>` +
        `<path d="M${X - 6 - d} ${Y + H + 4}L${X} ${Y + H}H${X + W}L${X + W + 6 + d} ${Y + H + 4}V${Y + H + 9}H${X - 6 - d}Z" fill="#1a1b1e"/>`;
    } else {
      s += `<rect x="${X - 3}" y="${Y - 3}" width="${W + 6}" height="${H + 6}" fill="#0b0b0d"/>` + firebox(x, X, Y, W, H, inner) + vent(x, X + 30, Y + H + 6, W - 60, 16);
    }
    if (ember && x.lights) s += `<path d="M${X} ${Y + H + 3}H${X + W}L${X + W + 10} ${Y + H + 20}H${X - 10}Z" fill="${x.url("emb")}" opacity=".3" class="${P}hue"/>`;
    return svg(x, s);
  }, SX("tile", "none", [{ id: "media", name: "Media", values: [["crystal", "Crystals"], ["ember", "Color embers"]] }, { id: "glass", name: "Glass", values: [["front", "Front"], ["three", "3-sided"]] }], ["#5a5a60", "#8d8476", "#e8e5de", "#9b5136", "#b08a62", "#cfc8bc"]));

  G("mist", "Water-vapor 3D", EC, ELC, EL, false, (x) => {
    const X = 50, Y = 96, W = 100, H = 48;
    return svg(x, room(x, 166, "#e6e0d4") + `<path d="M28 60H172V166H28Z" fill="#f4f1ea"/><path d="M22 54H178V62H22Z" fill="#fbf9f4"/><path d="M22 62H178" stroke="#000" stroke-opacity=".12"/><path d="M28 62V166M172 62V166" stroke="#000" stroke-opacity=".1"/>` + roomGlow(x, 100, 166, 90, 30) +
      `<rect x="${X - 6}" y="${Y - 6}" width="${W + 12}" height="${H + 12}" fill="${x.url("blk")}"/>` + vent(x, X + 10, Y + H + 1.5, W - 20, 14) +
      firebox(x, X, Y, W, H, embers(x, X + 8, Y + H - 4, W - 16, "ember") + logs(x, [[X + 14, Y + H - 8, X + W - 14, Y + H - 10, 4.4], [X + 22, Y + H - 15, X + W / 2, Y + H - 20, 3.6], [X + W / 2 + 4, Y + H - 19, X + W - 22, Y + H - 14, 3.4]], x.lights) + mist(x, X + 10, Y + H - 12, W - 20, 38)));
  });
  G("tvstand", "TV-stand fireplace", EC, ELC, EL, false, (x) => {
    const X = 74, Y = 132, W = 52, H = 30;
    return svg(x, room(x, 172, "#b9bcc0") + BGW(`<rect x="34" y="40" width="132" height="76" fill="#0b0c0f" stroke="#1a1b1e" stroke-width="3"/><path d="M37 113L110 43H140L67 113Z" fill="#fff" opacity=".04"/><rect x="94" y="116" width="12" height="6" fill="#222"/>`) + roomGlow(x, 100, 176, 80, 18) + shadow(x, 100, 180, 86) +
      `<path d="${rr(18, 122, 164, 52, 2)}" fill="url(#${x.u}-wd)"/><path d="M18 123H182" stroke="#fff" stroke-opacity=".3"/><path d="M28 128h40v40h-40zM132 128h40v40h-40z" fill="none" stroke="#000" stroke-opacity=".3"/><circle cx="64" cy="148" r="1.4" fill="url(#${x.u}-ss)"/><circle cx="136" cy="148" r="1.4" fill="url(#${x.u}-ss)"/>` +
      `<rect x="${X - 3}" y="${Y - 6}" width="${W + 6}" height="${H + 9}" fill="#111"/>` + firebox(x, X, Y, W, H, flames(x, X + 4, Y + H - 6, W - 8, 22) + embers(x, X + 2, Y + H - 1, W - 4, "crystal")) + vent(x, X + 6, Y - 5, W - 12, 8) +
      `<rect x="22" y="174" width="6" height="6" fill="#2a1a10"/><rect x="172" y="174" width="6" height="6" fill="#2a1a10"/>`);
  });
  G("estove", "Electric stove", EC, ELC, EL, false, (x) => {
    const X = 66, Y = 92, W = 68, H = 50;
    return svg(x, room(x, 160, "#c8bfae") + roomGlow(x, 100, 166, 70, 26) + shadow(x, 100, 172, 52) +
      `<rect x="${X - 14}" y="${Y - 20}" width="${W + 28}" height="8" rx="2" fill="${x.url("blk")}"/><path d="M${X - 12} ${Y - 19}h${W + 24}" stroke="#fff" stroke-opacity=".2"/>` +
      `<path d="M${X - 10} ${Y - 12}H${X + W + 10}V${Y + H + 12}H${X - 10}Z" fill="${x.url("blk")}"/><path d="M${X + W + 10} ${Y - 12}l8 -4V${Y + H + 8}l-8 4Z" fill="#141416"/>` + vent(x, X + 6, Y - 9, W - 12, 10) +
      `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("box")}"/>` + logs(x, [[X + 12, Y + H - 7, X + W - 12, Y + H - 9, 3.6]], x.fl) + flames(x, X + 8, Y + H - 9, W - 16, 30) + embers(x, X + 6, Y + H - 2, W - 12, "ember") +
      `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("gl")}" stroke="#2c2d31" stroke-width="3"/><path d="M${X + W / 3} ${Y}V${Y + H}M${X + 2 * W / 3} ${Y}V${Y + H}M${X} ${Y + H / 2}H${X + W}" stroke="#2c2d31" stroke-width="2"/>` +
      `<rect x="${X - 10}" y="${Y + H + 12}" width="${W + 20}" height="6" rx="1" fill="#141416"/><path d="M${X - 6} ${Y + H + 18}v6M${X + W + 6} ${Y + H + 18}v6" stroke="#141416" stroke-width="5"/>`);
  });

  G("gasfp", "Gas fireplace", [BLKF, BRZ, NIC, "#2e3134"], "Finish", GAS, true, (x) => {
    const st = x.opt.style;
    let s = room(x, 166, "#cfc5b5") + surround(x, 26, 56, 148, 110, 5) + mantel(x, 26, 48, 148) + hearth(x, 20, 166, 160);
    if (st === "open") {
      const X = 50, Y = 82, W = 100, H = 72; let fb = "";
      for (let j = 0; j < 7; j++) fb += `<path d="M${X} ${Y + j * 10 + 10}h${W}" stroke="#000" stroke-opacity=".35"/>`;
      s += `<path d="M${X} ${Y + H}V${Y + 10}Q${X + W / 2} ${Y - 8} ${X + W} ${Y + 10}V${Y + H}Z" fill="#2a1712"/>${fb}` + roomGlow(x, 100, 160, 80, 40) +
        `<path d="M${X + 18} ${Y + H - 4}h${W - 36}" stroke="#111" stroke-width="3"/>` + logs(x, [[X + 16, Y + H - 9, X + W - 16, Y + H - 11, 5.4], [X + 26, Y + H - 18, X + W - 22, Y + H - 23, 4.4], [X + 40, Y + H - 26, X + W - 36, Y + H - 28, 3.4]], x.fl) + flames(x, X + 18, Y + H - 14, W - 36, 40, { gas: true }) +
        `<path d="M${X} ${Y + 12}H${X + W}" stroke="#2a2b30" stroke-width="2"/><path d="M${X + 2} ${Y + 12}V${Y + H}M${X + W - 2} ${Y + 12}V${Y + H}" stroke="#1a1b1e" stroke-width="5" opacity=".75"/><g opacity=".35">${Array.from({ length: 8 }, (_, i) => `<path d="M${X + 4 + i * 1.6} ${Y + 12}V${Y + H}M${X + W - 4 - i * 1.6} ${Y + 12}V${Y + H}" stroke="#000"/>`).join("")}</g>` +
        `<path d="M${X} ${Y + H}V${Y + 10}Q${X + W / 2} ${Y - 8} ${X + W} ${Y + 10}V${Y + H}" fill="none" stroke="${x.p.m}" stroke-width="3"/>`;
    } else if (st === "see") {
      const X = 40, Y = 90, W = 120, H = 50;
      s += roomGlow(x, 100, 166, 100, 30) + `<rect x="${X - 8}" y="${Y - 8}" width="${W + 16}" height="${H + 16}" fill="${x.url("fin")}"/>` +
        `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#3a3024"/><rect x="${X + 10}" y="${Y + 6}" width="26" height="30" fill="#6a8aa8" opacity=".6"/><path d="M${X + 23} ${Y + 6}v30M${X + 10} ${Y + 21}h26" stroke="#2a2018" stroke-width="1.4"/><path d="M${X + 86} ${Y + 4}l8 12h-16z" fill="#f4d58a" opacity=".8"/><rect x="${X + 89}" y="${Y + 16}" width="2" height="18" fill="#2a2018"/><rect x="${X}" y="${Y + 34}" width="${W}" height="${H - 34}" fill="#2a2018"/>` +
        logs(x, [[X + 18, Y + H - 8, X + W - 18, Y + H - 10, 4.4], [X + 34, Y + H - 15, X + W - 34, Y + H - 17, 3.4]], x.fl) + flames(x, X + 16, Y + H - 11, W - 32, 32, { gas: true }) + embers(x, X + 10, Y + H - 2, W - 20, "ember", x.fl) +
        `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${x.url("gl")}"/>` + vent(x, X + 10, Y + H + 3, W - 20, 18);
    } else if (st === "linear") {
      const X = 36, Y = 104, W = 128, H = 32;
      s += roomGlow(x, 100, 166, 100, 30) + `<rect x="${X - 5}" y="${Y - 5}" width="${W + 10}" height="${H + 10}" fill="${x.url("fin")}"/>` +
        firebox(x, X, Y, W, H, flames(x, X + 4, Y + H - 8, W - 8, 30, { gas: true, n: 12 }) + embers(x, X + 2, Y + H - 2, W - 4, "bead")) + vent(x, X + 10, Y + H + 8, W - 20, 20);
    } else {
      const X = 60, Y = 92, W = 80, H = 48;
      s += roomGlow(x, 100, 166, 90, 30) + `<rect x="${X - 14}" y="${Y - 14}" width="${W + 28}" height="${H + 30}" fill="${x.url("fin")}"/><rect x="${X - 14}" y="${Y - 14}" width="${W + 28}" height="${H + 30}" fill="${x.url("gl")}" opacity=".6"/>` +
        vent(x, X - 4, Y - 9, W + 8, 18) + firebox(x, X, Y, W, H, logs(x, [[X + 12, Y + H - 8, X + W - 12, Y + H - 10, 4.4], [X + 20, Y + H - 15, X + W - 24, Y + H - 19, 3.6]], x.fl) + flames(x, X + 10, Y + H - 11, W - 20, 30, { gas: true }) + embers(x, X + 6, Y + H - 2, W - 12, "ember", x.fl)) +
        `<rect x="${X - 4}" y="${Y + H + 3}" width="${W + 8}" height="7" rx="1" fill="#0b0b0d"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${X + i * 11} ${Y + H + 5}h7" stroke="#3a3b40" stroke-width="1.2"/>`).join("")}` + (x.blower ? `<path d="M${X} ${Y + H + 12}h${W}" stroke="#ff9a3a" stroke-opacity=".3" stroke-width="3"/>` : "");
    }
    return svg(x, s);
  }, SX("stone", "beam", [{ id: "style", name: "Style", values: [["dv", "Direct-vent insert"], ["open", "Open gas logs"], ["see", "See-through"], ["linear", "Linear with beads"]] }], ["#958a7a", "#9b5136", "#e8e5de", "#3a3b40", "#b08a62", "#cfc8bc"]));

  G("gasstove", "Gas stove", [BLKF, MAJ, ENR, ENB, IVY], "Finish", GAS, true, (x) => {
    const X = 70, Y = 96, W = 60, H = 42;
    return svg(x, room(x, 160, "#c9c0ae") + `<rect x="90" y="8" width="20" height="58" fill="#1e1f23"/>` + `<path d="M40 168h120l8 10H32Z" fill="#5e564c"/>` + roomGlow(x, 100, 168, 70, 24) + shadow(x, 100, 172, 50) +
      `<rect x="86" y="62" width="28" height="10" fill="${x.url("fin")}"/><path d="${rr(X - 14, Y - 22, W + 28, H + 44, 6)}" fill="${x.url("fin")}"/><path d="${rr(X - 14, Y - 22, W + 28, H + 44, 6)}" fill="${x.url("gl")}" opacity=".7"/><rect x="${X - 18}" y="${Y - 26}" width="${W + 36}" height="7" rx="2" fill="${x.url("finh")}"/>` +
      `<path d="M${X} ${Y + H}V${Y + 8}Q${X + W / 2} ${Y - 10} ${X + W} ${Y + 8}V${Y + H}Z" fill="${x.url("box")}"/>` + logs(x, [[X + 10, Y + H - 6, X + W - 10, Y + H - 8, 3.4]], x.fl) + flames(x, X + 8, Y + H - 8, W - 16, 28, { gas: true }) +
      `<path d="M${X} ${Y + H}V${Y + 8}Q${X + W / 2} ${Y - 10} ${X + W} ${Y + 8}V${Y + H}Z" fill="${x.url("gl")}" stroke="${x.p.k}" stroke-width="3"/><rect x="${X - 6}" y="${Y + H + 6}" width="${W + 12}" height="6" rx="1" fill="#0b0b0d"/>` + (x.blower ? shimmer(Object.assign({}, x, { heat: true }), X, Y + H + 6, W) : "") +
      `<path d="M${X - 10} ${Y + H + 22}v10M${X + W + 10} ${Y + H + 22}v10" stroke="${x.p.k}" stroke-width="5" stroke-linecap="round"/>`);
  });
  G("pittable", "Fire pit table", ["#8d8a84", "#4a4a4c", "#b08a5a", "#d8d2c4"], "Finish", null, true, (x) => {
    const X = 40, Y = 124, W = 120;
    return svg(x, patio(x, 140) + roomGlow(x, 100, 140, 100, 40) + shadow(x, 100, 182, 76) +
      `<path d="M${X - 8} ${Y}H${X + W + 8}L${X + W + 2} ${Y + 52}H${X - 2}Z" fill="${x.url("fin")}"/><path d="M${X - 8} ${Y}H${X + W + 8}L${X + W + 2} ${Y + 52}H${X - 2}Z" fill="${x.url("gl")}" opacity=".5"/><rect x="${X - 10}" y="${Y - 6}" width="${W + 20}" height="8" rx="1" fill="${x.url("finh")}"/>` +
      `<rect x="${X + 22}" y="${Y - 8}" width="${W - 44}" height="5" fill="#1a1b1e"/>` + embers(x, X + 24, Y - 4, W - 48, "lava") + flames(x, X + 26, Y - 6, W - 52, 40, { gas: true }) +
      `<rect x="${X + 20}" y="${Y - 26}" width="${W - 40}" height="21" fill="#fff" opacity=".08" stroke="#cfe6f0" stroke-opacity=".5"/><path d="M${X + 26} ${Y - 6}L${X + 40} ${Y - 26}" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>` +
      `<rect x="${X + W - 18}" y="${Y + 18}" width="8" height="8" rx="4" fill="#1a1b1e"/>`);
  });
  G("firebowl", "Gas fire bowl", ["#9a958c", "#5a5652", "#c0a27a", "#3a4a4a"], "Finish", null, true, (x) => {
    const cx = 100, Y = 140;
    let gl = ""; const r = rnd(4); for (let i = 0; i < 30; i++) gl += `<circle cx="${f(cx - 44 + r() * 88)}" cy="${f(Y - 2 + r() * 4)}" r="${f(.8 + r())}" fill="${["#3fa8ff", "#7fd0ff", "#2a6bc8"][(r() * 3) | 0]}"/>`;
    return svg(x, patio(x, 146) + roomGlow(x, cx, 140, 90, 40) + shadow(x, cx, 182, 50) +
      `<path d="M${cx - 30} ${Y + 24}L${cx - 32} 180H${cx + 32}L${cx + 30} ${Y + 24}Z" fill="${x.url("fin")}"/><path d="M${cx - 30} ${Y + 24}L${cx - 32} 180H${cx + 32}L${cx + 30} ${Y + 24}Z" fill="#000" opacity=".3"/><path d="M${cx - 56} ${Y}Q${cx - 50} ${Y + 26} ${cx} ${Y + 28}Q${cx + 50} ${Y + 26} ${cx + 56} ${Y}Z" fill="${x.url("fin")}"/>` +
      `<ellipse cx="${cx}" cy="${Y}" rx="56" ry="8" fill="${x.p.l}"/><ellipse cx="${cx}" cy="${Y}" rx="48" ry="6" fill="#1d1e21"/>${gl}` + flames(x, cx - 36, Y, 72, 46, { gas: true }) + `<path d="M${cx - 56} ${Y}Q${cx - 50} ${Y + 26} ${cx} ${Y + 28}" stroke="#fff" stroke-opacity=".15" stroke-width="3" fill="none"/>`);
  });
  G("woodhearth", "Wood hearth", [ORG, "#ff9a3a", AMB, "#ff5a2a"], "Flame color", null, false, (x) => {
    const X = 46, Y = 76, W = 108, H = 80;
    let sp = ""; if (x.fl) { const r = rnd(3); for (let i = 0; i < 8; i++) sp += `<circle class="${P}spark" style="animation-delay:${(r() * 2).toFixed(2)}s" cx="${f(X + 30 + r() * 48)}" cy="${Y + H - 30}" r=".9" fill="#ffd27a"/>`; }
    return svg(x, room(x, 168, "#d9cdb6") + surround(x, 22, 40, 156, 128, 21) + mantel(x, 22, 32, 156) +
      `<path d="M${X} ${Y + H}V${Y + 12}Q${X + W / 2} ${Y - 10} ${X + W} ${Y + 12}V${Y + H}Z" fill="#1a0e0a"/><path d="M${X + 8} ${Y + H}V${Y + 20}H${X + W - 8}V${Y + H}" fill="#2a1712"/>` + roomGlow(x, 100, 160, 90, 46) +
      `<path d="M${X + 22} ${Y + H - 3}l4 -14M${X + W - 22} ${Y + H - 3}l-4 -14" stroke="#111" stroke-width="3"/><path d="M${X + 22} ${Y + H - 6}H${X + W - 22}" stroke="#111" stroke-width="2"/>` +
      logs(x, [[X + 20, Y + H - 12, X + W - 20, Y + H - 14, 6], [X + 30, Y + H - 22, X + W / 2 + 6, Y + H - 34, 4.6], [X + W / 2 - 6, Y + H - 34, X + W - 28, Y + H - 22, 4.6]], x.fl) + embers(x, X + 22, Y + H - 4, W - 44, "ember", x.fl) + flames(x, X + 26, Y + H - 18, W - 52, 50) + sp +
      `<path d="M${X} ${Y + H}V${Y + 12}Q${X + W / 2} ${Y - 10} ${X + W} ${Y + 12}V${Y + H}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="3"/>` + hearth(x, 18, 168, 164));
  }, SX("brick", "beam"));

  const css = `
.hda-fireplace-f0,.hda-fireplace-f1,.hda-fireplace-f2,.hda-fireplace-mist{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-fireplace-f0{animation:hda-fireplace-f0 .9s ease-in-out infinite alternate}
@keyframes hda-fireplace-f0{from{transform:scale(1,1)}to{transform:scale(.88,1.18) translateX(1px)}}
.hda-anim .hda-fireplace-f1{animation:hda-fireplace-f1 .7s ease-in-out infinite alternate}
@keyframes hda-fireplace-f1{from{transform:scale(1,.9)}to{transform:scale(1.08,1.12) translateX(-1px)}}
.hda-anim .hda-fireplace-f2{animation:hda-fireplace-f2 1.1s ease-in-out infinite alternate}
@keyframes hda-fireplace-f2{from{transform:scale(.95,1.1)}to{transform:scale(1.05,.85)}}
.hda-anim .hda-fireplace-mist{animation:hda-fireplace-mist 2.4s ease-in-out infinite}
@keyframes hda-fireplace-mist{0%{transform:translateY(2px) scale(.9,.7);opacity:0}30%{opacity:1}100%{transform:translateY(-8px) scale(1.1,1.2);opacity:0}}
.hda-anim .hda-fireplace-glow{animation:hda-fireplace-glow 1.8s ease-in-out infinite}
@keyframes hda-fireplace-glow{0%,100%{opacity:1}40%{opacity:.75}70%{opacity:.9}}
.hda-anim .hda-fireplace-tw{animation:hda-fireplace-tw 1.6s ease-in-out infinite}
@keyframes hda-fireplace-tw{0%,100%{opacity:1}50%{opacity:.3}}
.hda-anim .hda-fireplace-shim{animation:hda-fireplace-shim 2s linear infinite}
@keyframes hda-fireplace-shim{0%{transform:translateY(0);opacity:0}30%{opacity:1}100%{transform:translateY(-12px);opacity:0}}
.hda-anim .hda-fireplace-hue{animation:hda-fireplace-hue 6s linear infinite}
@keyframes hda-fireplace-hue{0%,100%{fill:#ff5a2a}25%{fill:#a54bff}50%{fill:#3a8bff}75%{fill:#3fe08a}}
.hda-anim .hda-fireplace-spark{animation:hda-fireplace-spark 2s ease-out infinite}
@keyframes hda-fireplace-spark{0%{transform:translate(0,0);opacity:1}100%{transform:translate(4px,-40px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-fireplace-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "fireplace",
    tab: "Fireplaces",
    group: "Home",
    kind: "device",
    levelLabel: "Flame",
    onWord: "Burning",
    offWord: "Off",
    intro: "Eleven fireplace cards. Built-in models (electric insert or log set, linear electric, gas fireplace, wood hearth) pick their surround (brick, stacked stone, tile, painted, wood mantel, marble) and mantel from menus, with a second color for the surround. Electric and LED models switch Flame, Heat and Lights on their own; gas models switch Flame and Blower. The slider sets flame height.",
    
    css,
    icons,
  });
})();
