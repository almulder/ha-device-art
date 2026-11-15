(function () {
  const P = "hda-garage-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const WHT = "#eceeec", ALM = "#e0d4ba", SND = "#c3a983", BRZ = "#4d3c2f", BLK = "#27292d", CDR = "#a86f3e", WAL = "#6b4529",
    GAL = "#9aa3a9", GRN = "#34513f", RED = "#8c2f2a", CHA = "#4a4f56";
  const AMB = "#ffb347", WARM = "#ffd89c", LEDG = "#3ee08f";

  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;

  function pal(c) { const h = N(); return { l: h.shade(c, .38), m: c, d: h.shade(c, -.28), k: h.shade(c, -.55) }; }
  function ctx(o) {
    const u = o.uid, on = !!o.on, lv = o.level == null ? 1 : o.level;
    return { o, u, on, lv, op: on ? Math.max(.12, Math.min(1, lv)) : 0, c: o.color || WHT, p: pal(o.color || WHT),
      id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, n: 0, lt: on, mf: false };
  }

  function defs(x, extra) {
    const p = x.p, id = x.id;
    return `<defs>
${lg(id("fin"), [[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 0, 1)}
${lg(id("sec"), [[0, p.l], [.2, p.m], [.82, p.d], [1, p.k]], 0, 0, 0, 1)}
${lg(id("sec2"), [[0, "#f6f6f4"], [.2, "#e4e5e2"], [.82, "#c2c5c5"], [1, "#9a9ea0"]], 0, 0, 0, 1)}
${lg(id("sh"), [[0, "#fff", .18], [.3, "#fff", 0], [.68, "#000", 0], [1, "#000", .26]])}
${lg(id("dn"), [[0, "#000", .55], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("in"), [[0, "#1b1815"], [1, "#0a0908"]], 0, 0, 0, 1)}
${lg(id("bw"), [[0, "#5a5046"], [1, "#2e2822"]], 0, 0, 0, 1)}
${lg(id("fl"), [[0, "#24201c"], [1, "#4a443c"]], 0, 0, 0, 1)}
${rg(id("lp"), [[0, WARM, .95], [.35, WARM, .42], [1, WARM, 0]])}
${rg(id("amb"), [[0, AMB, .95], [.4, AMB, .35], [1, AMB, 0]])}
${rg(id("lg"), [[0, LEDG, .9], [.45, LEDG, .3], [1, LEDG, 0]])}
${lg(id("cone"), [[0, WARM, .6], [1, WARM, 0]], 0, 0, 0, 1)}
${lg(id("spill"), [[0, WARM, .55], [1, WARM, 0]], 0, 0, 0, 1)}
${lg(id("drv"), [[0, "#56585a"], [1, "#8b8c8a"]], 0, 0, 0, 1)}
${lg(id("chr"), [[0, "#5f666d"], [.45, "#eef1f3"], [.6, "#b6bcc2"], [1, "#4e545b"]])}
${lg(id("gls"), [[0, "#41566a"], [.5, "#1a232d"], [1, "#0c1117"]], 0, 0, 0, 1)}
${lg(id("glr"), [[0, "#fff", .4], [.45, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("fr"), [[0, "#e6ecef", .94], [1, "#a9b6bf", .94]], 0, 0, 0, 1)}
${lg(id("sky"), [[0, "#0e1530"], [.55, "#26325c"], [1, "#6f5f78"]], 0, 0, 0, 1)}
${lg(id("lawn"), [[0, "#1c2b1a"], [1, "#3b5530"]], 0, 0, 0, 1)}
${lg(id("pav"), [[0, "#5a5650"], [1, "#a29a8e"]], 0, 0, 0, 1)}
${rg(id("bu"), [[0, "#6c9a52"], [.6, "#33552c"], [1, "#16291a"]], .38, .32, .7)}
${rg(id("cs"), [[0, "#000", .6], [1, "#000", 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .48]], .5, .45, .75)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter>
${extra || ""}</defs>`;
  }
  function svg(x, body, extra) {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x, extra)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;
  }

  function wall_(x, kind, c, y0, y1, seed) {
    y0 = y0 || 8; y1 = y1 || 192; const h = N(), g = x.id("wl" + x.n++), r = rnd(seed || 11);
    let s = `${lg(g, [[0, h.shade(c, .1)], [1, h.shade(c, -.2)]], 0, 0, 0, 1)}<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="url(#${g})"/>`;
    let d = "", e = "", t = "";
    if (kind === "siding") {
      for (let y = y0 + 7; y < y1; y += 7.5) { d += `M8 ${f(y)}H192`; e += `M8 ${f(y + 1.3)}H192`; }
      s += `<path d="${d}" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/><path d="${e}" stroke="#fff" stroke-opacity=".12"/>`;
    } else if (kind === "brick") {
      for (let y = y0, i = 0; y < y1; y += 6, i++) {
        d += `M8 ${f(y)}H192`;
        for (let xx = 8 - (i % 2 ? 0 : 7); xx < 192; xx += 14) {
          e += `M${f(xx)} ${f(y)}v6`;
          if (r() > .55) t += `<rect x="${f(xx + .7)}" y="${f(y + .7)}" width="12.6" height="4.6" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.04 + r() * .12).toFixed(2)}"/>`;
        }
      }
      s += t + `<path d="${d}${e}" stroke="#d9d2c6" stroke-opacity=".38"/>`;
    } else if (kind === "stone") {
      for (let y = y0; y < y1; y += 9) {
        for (let xx = 8 - r() * 10; xx < 192;) {
          const w = 10 + r() * 14, hh = 7 + r() * 3;
          t += `<path d="${rr(xx + .8, y + .8, w - 1.6, hh - 1, 2.5)}" fill="${h.shade(c, r() * .36 - .2)}" stroke="#000" stroke-opacity=".38"/>`;
          t += `<path d="M${f(xx + 2.5)} ${f(y + 1.6)}H${f(xx + w - 3)}" stroke="#fff" stroke-opacity=".16"/>`;
          xx += w;
        }
      }
      s += `<rect x="8" y="${y0}" width="184" height="${y1 - y0}" fill="#2b2824"/>` + t;
    } else if (kind === "stucco") {
      for (let i = 0; i < 160; i++) t += `<circle cx="${f(8 + r() * 184)}" cy="${f(y0 + r() * (y1 - y0))}" r="${f(.3 + r() * .7)}" fill="${r() > .5 ? "#000" : "#fff"}" fill-opacity="${(.05 + r() * .08).toFixed(2)}"/>`;
      s += t;
    } else if (kind === "batten") {
      for (let xx = 12; xx < 192; xx += 15) { d += `M${xx} ${y0}V${y1}`; e += `M${xx + 2.6} ${y0}V${y1}`; }
      s += `<path d="${d}" stroke="#fff" stroke-opacity=".22" stroke-width="2.2"/><path d="${e}" stroke="#000" stroke-opacity=".28" stroke-width="1.2"/>`;
    } else if (kind === "metal") {
      for (let xx = 9; xx < 192; xx += 7) { d += `M${xx} ${y0}V${y1}`; e += `M${xx + 2.2} ${y0}V${y1}`; }
      s += `<path d="${d}" stroke="#fff" stroke-opacity=".2" stroke-width="1.6"/><path d="${e}" stroke="#000" stroke-opacity=".3" stroke-width="1.6"/>`;
    } else if (kind === "panel") {
      for (let xx = 8 + 46; xx < 192; xx += 46) d += `M${xx} ${y0}V${y1}`;
      for (let y = y0 + 44; y < y1; y += 44) d += `M8 ${y}H192`;
      s += `<path d="${d}" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/>`;
      for (let i = 0; i < 70; i++) t += `<circle cx="${f(8 + r() * 184)}" cy="${f(y0 + r() * (y1 - y0))}" r=".5" fill="#fff" fill-opacity=".06"/>`;
      s += t;
    }
    return s;
  }
  function eave_(x, y, c, roof) {
    const h = N(), g = x.id("ev" + x.n++);
    let s = "";
    if (roof !== false) {
      let d = "", e = "";
      s += `<rect x="8" y="8" width="184" height="${y - 14}" fill="${roof || "#3a3532"}"/>`;
      for (let yy = 12, i = 0; yy < y - 14; yy += 4.5, i++) { d += `M8 ${f(yy)}H192`; for (let xx = 8 + (i % 2) * 6; xx < 192; xx += 12) e += `M${xx} ${f(yy)}v-4.5`; }
      s += `<path d="${d}" stroke="#000" stroke-opacity=".5"/><path d="${e}" stroke="#000" stroke-opacity=".3"/>`;
    }
    s += `${lg(g, [[0, h.shade(c, .12)], [1, h.shade(c, -.22)]], 0, 0, 0, 1)}<rect x="8" y="${y - 14}" width="184" height="8" fill="url(#${g})"/><path d="M8 ${y - 13.5}H192" stroke="#fff" stroke-opacity=".5"/>
<rect x="8" y="${y - 6}" width="184" height="6" fill="${h.shade(c, -.38)}"/><rect x="8" y="${y}" width="184" height="14" fill="${x.url("dn")}" opacity=".6"/>`;
    return s;
  }
  function drive_(x, y, vx) {
    vx = vx || 100; let d = "";
    [30, 70, 130, 170].forEach((jx) => { d += `M${jx} ${y}L${f(vx + (jx - vx) * 1.9)} 192`; });
    const my = y + (192 - y) * .55; d += `M8 ${f(my)}H192`;
    return `<rect x="8" y="${y}" width="184" height="${192 - y}" fill="${x.url("drv")}"/><rect x="8" y="${y}" width="184" height="5" fill="${x.url("dn")}" opacity=".7"/>
<path d="${d}" stroke="#000" stroke-opacity=".22"/><path d="M8 ${f(my + 1)}H192" stroke="#fff" stroke-opacity=".07"/>`;
  }
  function bush_(x, cx, cy, r) {
    return `<ellipse cx="${cx}" cy="${cy + r * .55}" rx="${f(r * 1.2)}" ry="${f(r * .3)}" fill="${x.url("cs")}"/>
<circle cx="${f(cx - r * .55)}" cy="${f(cy + r * .1)}" r="${f(r * .7)}" fill="${x.url("bu")}"/><circle cx="${f(cx + r * .55)}" cy="${f(cy + r * .15)}" r="${f(r * .68)}" fill="${x.url("bu")}"/><circle cx="${cx}" cy="${f(cy - r * .25)}" r="${f(r * .8)}" fill="${x.url("bu")}"/>`;
  }
  function lantern_(x, cx, cy, lit) {
    return `<rect x="${cx - 3}" y="${cy - 20}" width="6" height="30" rx="1.5" fill="#1b1c1e"/>${lit ? `<circle class="${P}glow" cx="${cx}" cy="${cy}" r="24" fill="${x.url("lp")}" opacity=".6"/>` : ""}
<path d="M${cx - 7.5} ${cy - 11}L${cx} ${cy - 17.5}L${cx + 7.5} ${cy - 11}Z" fill="#26272a"/><path d="M${cx - 7.5} ${cy - 11}L${cx} ${cy - 17.5}" stroke="#fff" stroke-opacity=".25"/>
<rect x="${cx - 5.5}" y="${cy - 11}" width="11" height="17" fill="${lit ? "#ffe2a4" : "#39414a"}"/>${lit ? `<circle cx="${cx}" cy="${cy - 3}" r="3" fill="#fff"/>` : `<path d="M${cx - 4.5} ${cy - 10}L${cx - 1} ${cy + 4}" stroke="#fff" stroke-opacity=".18" stroke-width="1.5"/>`}
<path d="M${cx - 5.5} ${cy - 11}v17M${cx} ${cy - 11}v17M${cx + 5.5} ${cy - 11}v17M${cx - 5.5} ${cy - 2.5}h11" stroke="#1b1c1e" stroke-width="1.2"/><rect x="${cx - 6.5}" y="${cy + 6}" width="13" height="2.6" rx="1" fill="#1b1c1e"/>`;
  }
  function beacon(x, cx, cy) {
    const on = x.on;
    return `${on ? `<circle class="${P}blink" cx="${cx}" cy="${cy}" r="11" fill="${x.url("amb")}"/>` : ""}<rect x="${cx - 4.5}" y="${cy + 1}" width="9" height="2.6" rx="1" fill="#2a2a2c"/>
<path d="M${cx - 3.4} ${cy + 1}A3.4 3.4 0 0 1 ${cx + 3.4} ${cy + 1}Z" fill="${on ? AMB : "#6e5634"}"${on ? ` class="${P}blink"` : ""}/><path d="M${cx - 2} ${cy - .4}A2 2 0 0 1 ${cx} ${cy - 1.8}" stroke="#fff" stroke-opacity=".7" fill="none"/>`;
  }
  const eye = (cx, cy, c) => `<rect x="${cx - 2}" y="${cy - 2.5}" width="4" height="5" rx="1" fill="#26272a"/><circle cx="${cx}" cy="${cy - .6}" r=".9" fill="${c}"/>`;

  function car(x, cx, by, w, kind, col) {
    const s = w / 100, g = x.id("cb" + x.n++), h = N(), t = kind === "suv" ? 1.2 : 1;
    col = col || "#5d6b7a";
    return `${lg(g, [[0, h.shade(col, .45)], [.4, col], [1, h.shade(col, -.6)]], 0, 0, 0, 1)}<g transform="translate(${f(cx)} ${f(by)}) scale(${s.toFixed(3)} ${(s * t).toFixed(3)})">
<ellipse cx="0" cy="-1" rx="56" ry="5" fill="#000" opacity=".6"/><rect x="-46" y="-13" width="15" height="13" rx="3" fill="#0b0b0c"/><rect x="31" y="-13" width="15" height="13" rx="3" fill="#0b0b0c"/>
<path d="M-49 -9Q-51 -28 -44 -32L-36 -34H36L44 -32Q51 -28 49 -9Z" fill="url(#${g})"/><path d="M-35 -34L-27 -52Q-25 -55 -19 -55H19Q25 -55 27 -52L35 -34Z" fill="${h.shade(col, -.32)}"/>
<path d="M-30 -35.5L-23.5 -50H23.5L30 -35.5Z" fill="#0d1318"/><path d="M-27 -37L-21 -49H-6L-17 -37Z" fill="#fff" opacity=".12"/>
<rect x="-46" y="-28" width="17" height="5" rx="2" fill="#b3262a"/><rect x="29" y="-28" width="17" height="5" rx="2" fill="#b3262a"/><path d="M-44 -26.8h11M33 -26.8h11" stroke="#ff9a9a" stroke-opacity=".8"/>
<rect x="-9" y="-21" width="18" height="7" rx="1" fill="#d6dade"/><rect x="-50" y="-13" width="100" height="5" rx="2" fill="#151719"/><path d="M-44 -32.5H44" stroke="#fff" stroke-opacity=".4"/></g>`;
  }
  function interior(x, X, Y, W, Hh, carKind, carCol) {
    const bx = X + W * .13, bw = W * .74, by = Y + Hh * .1, bh = Hh * .52, cx = X + W / 2;
    let s = `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.url("in")}"/>
<path d="M${X} ${Y}L${f(bx)} ${f(by)}V${f(by + bh)}L${X} ${Y + Hh}Z" fill="#3a332c"/><path d="M${X + W} ${Y}L${f(bx + bw)} ${f(by)}V${f(by + bh)}L${X + W} ${Y + Hh}Z" fill="#2a2520"/>
<rect x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${f(bh)}" fill="${x.url("bw")}"/><path d="M${X} ${Y + Hh}L${f(bx)} ${f(by + bh)}H${f(bx + bw)}L${X + W} ${Y + Hh}Z" fill="${x.url("fl")}"/>`;
    const sx = bx + 3, sw = bw * .3, r = rnd(Math.round(X + W));
    let bxs = "";
    [.35, .7].forEach((t) => {
      const yy = by + bh * t;
      for (let xx = sx; xx < sx + sw - 5;) { const w = 4 + r() * 5, hh = 3 + r() * 5; bxs += `<rect x="${f(xx)}" y="${f(yy - hh)}" width="${f(w)}" height="${f(hh)}" fill="${["#8a6b45", "#5e6f80", "#7b3b33", "#6c7a55"][(r() * 4) | 0]}"/>`; xx += w + 1; }
      bxs += `<rect x="${f(sx - 1)}" y="${f(yy)}" width="${f(sw)}" height="1.6" fill="#8b847a"/>`;
    });
    s += bxs + `<rect x="${f(bx + bw * .72)}" y="${f(by + bh * .3)}" width="${f(bw * .2)}" height="${f(bh * .45)}" fill="#3b4148" opacity=".9"/><path d="M${f(bx + bw * .74)} ${f(by + bh * .4)}h${f(bw * .16)}M${f(bx + bw * .74)} ${f(by + bh * .55)}h${f(bw * .16)}" stroke="#6b737c" stroke-width=".8"/>`;
    s += `<ellipse class="${P}glow" cx="${f(cx)}" cy="${f(Y + Hh * .2)}" rx="${f(W * .6)}" ry="${f(Hh * .55)}" fill="${x.url("lp")}" opacity=".7"/>
<ellipse cx="${f(cx)}" cy="${f(Y + Hh * .86)}" rx="${f(W * .42)}" ry="${f(Hh * .12)}" fill="${x.url("lp")}" opacity=".45"/><rect x="${f(cx - 6)}" y="${f(by - 3)}" width="12" height="3.5" rx="1" fill="#fff6dc"/>`;
    if (carKind) s += car(x, cx, Y + Hh - 1, W * .66, carKind, carCol);
    else {
      const wy = Y + Hh * .66, wx = cx - W * .28, ww = W * .56;
      s += `<rect x="${f(wx)}" y="${f(wy)}" width="${f(ww)}" height="4" fill="#8a6440"/><path d="M${f(wx + 2)} ${f(wy + 4)}V${f(Y + Hh - 4)}M${f(wx + ww - 2)} ${f(wy + 4)}V${f(Y + Hh - 4)}" stroke="#3a3530" stroke-width="2.4"/>
<rect x="${f(wx + 6)}" y="${f(wy - 18)}" width="${f(ww - 12)}" height="16" fill="#4d5560"/><g fill="#1c1d1f"><rect x="${f(wx + 10)}" y="${f(wy - 15)}" width="2" height="10"/><rect x="${f(wx + 16)}" y="${f(wy - 14)}" width="3" height="8"/><circle cx="${f(wx + 26)}" cy="${f(wy - 10)}" r="3" fill="none" stroke="#1c1d1f" stroke-width="1.4"/><rect x="${f(wx + 34)}" y="${f(wy - 15)}" width="9" height="2"/></g>
<rect x="${f(wx + ww * .6)}" y="${f(wy - 6)}" width="10" height="6" rx="1" fill="#b8402f"/><ellipse cx="${f(cx + W * .3)}" cy="${f(Y + Hh - 6)}" rx="8" ry="6" fill="#2f6a3a"/><rect x="${f(cx + W * .3 - 8)}" y="${f(Y + Hh - 16)}" width="2" height="12" fill="#222"/>`;
    }
    return s;
  }
  function bay(x, s) {
    const X = s.X, Y = s.Y, W = s.W, Hh = s.H, op = x.op, k = x.id("bc" + x.n++), tr = s.trim || "#ecebe6", cls = `${P}${x.on ? "up" : "dn"}`;
    let o = `<rect x="${X - 6}" y="${Y - 6}" width="${W + 12}" height="${Hh + 6}" fill="${tr}"/><path d="M${X - 6} ${Y + Hh}V${Y - 6}H${X + W + 6}" fill="none" stroke="#fff" stroke-opacity=".35"/>
<path d="M${X + W + 6} ${Y - 6}V${Y + Hh}" stroke="#000" stroke-opacity=".3"/><rect x="${X - 1.6}" y="${Y - 1.6}" width="${W + 3.2}" height="${Hh + 1.6}" fill="#000" fill-opacity=".5"/>
<clipPath id="${k}"><rect x="${X}" y="${Y}" width="${W}" height="${Hh}"/></clipPath><g clip-path="url(#${k})">`;
    if (op > 0) o += interior(x, X, Y, W, Hh, s.car, s.carCol) + (x.mf && !x.lt ? `<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="#000" opacity=".55"/>` : "");
    if (s.mode === "tilt") {
      const sy = 1 - op * .86;
      o += `<g transform="translate(${X} ${Y}) scale(1 ${sy.toFixed(3)})"><g class="${cls}">${s.door}<rect width="${W}" height="${Hh}" fill="#000" opacity="${f(op * .5)}"/></g></g>`;
      if (op > 0) o += `<rect x="${X}" y="${f(Y + Hh * sy)}" width="${W}" height="9" fill="${x.url("dn")}" opacity=".8"/>`;
    } else {
      const dy = Y - op * Hh;
      o += `<g transform="translate(${X} ${f(dy)})"><g class="${cls}">${s.door}</g></g>`;
      if (op > 0) o += `<rect x="${X}" y="${f(dy + Hh)}" width="${W}" height="8" fill="${x.url("dn")}" opacity=".75"/>`;
    }
    o += `</g><rect x="${X}" y="${Y}" width="${W}" height="3" fill="#000" fill-opacity=".35"/>`;
    if (op > 0) o += `<path d="M${X} ${Y + Hh}H${X + W}L${X + W + 24} 192H${X - 24}Z" fill="${x.url("spill")}" opacity="${f((.3 + .5 * op) * (x.mf && !x.lt ? .3 : 1))}"/>`;
    o += eye(X - 3.5, Y + Hh - 7, LEDG) + eye(X + W + 3.5, Y + Hh - 7, x.on ? AMB : "#c08a3a");
    if (s.beacon !== false) o += beacon(x, X + W / 2, Y - 13);
    return o;
  }

  function secBase(x, W, Hh, n, key) {
    let s = ""; const h = Hh / n, g = x.url(key || "sec");
    for (let i = 0; i < n; i++) s += `<rect x="0" y="${f(i * h)}" width="${W}" height="${f(h)}" fill="${g}"/>`;
    for (let i = 1; i < n; i++) s += `<path d="M0 ${f(i * h)}H${W}" stroke="#000" stroke-opacity=".5" stroke-width="1.3"/><path d="M0 ${f(i * h + 1.2)}H${W}" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`;
    return s;
  }
  function rp(px, py, pw, ph, d) {
    d = d || 1.8;
    return `<path d="M${f(px)} ${f(py + ph)}V${f(py)}H${f(px + pw)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/><path d="M${f(px + pw)} ${f(py)}V${f(py + ph)}H${f(px)}" fill="none" stroke="#000" stroke-opacity=".42" stroke-width="1"/>
<rect x="${f(px + d)}" y="${f(py + d)}" width="${f(pw - 2 * d)}" height="${f(ph - 2 * d)}" fill="#fff" fill-opacity=".07"/><path d="M${f(px + d)} ${f(py + ph - d)}V${f(py + d)}H${f(px + pw - d)}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".8"/><path d="M${f(px + pw - d)} ${f(py + d)}V${f(py + ph - d)}H${f(px + d)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/>`;
  }
  function pane(x, px, py, pw, ph, lit) {
    return `<rect x="${f(px - 1)}" y="${f(py - 1)}" width="${f(pw + 2)}" height="${f(ph + 2)}" fill="#000" fill-opacity=".35"/><rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="${x.url("gls")}"/>${lit ? `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="${WARM}" opacity=".55"/>` : ""}
<path d="M${f(px)} ${f(py + ph * .9)}L${f(px + pw * .55)} ${f(py)}H${f(px + pw * .8)}L${f(px)} ${f(py + ph)}Z" fill="#fff" opacity=".13"/><rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
  }
  const sheen = (x, W, Hh) => `<rect width="${W}" height="${Hh}" fill="${x.url("sh")}"/><rect y="${Hh - 2.6}" width="${W}" height="2.6" fill="#131313"/>`;
  function grainH(seed, x0, y0, w, hh, step) {
    const r = rnd(seed); let d = "";
    for (let y = y0 + 1; y < y0 + hh; y += step + r() * step) { const a = r() * 1.6 - .8; d += `M${f(x0)} ${f(y)}C${f(x0 + w * .3)} ${f(y + a)} ${f(x0 + w * .6)} ${f(y - a)} ${f(x0 + w)} ${f(y + a * .5)}`; }
    return `<path d="${d}" fill="none" stroke="#2a1606" stroke-opacity=".2" stroke-width=".7"/>`;
  }
  function grainV(seed, x0, y0, w, hh, step) {
    const r = rnd(seed); let d = "";
    for (let xx = x0 + 1; xx < x0 + w; xx += step + r() * step) { const a = r() * 1.6 - .8; d += `M${f(xx)} ${f(y0)}C${f(xx + a)} ${f(y0 + hh * .3)} ${f(xx - a)} ${f(y0 + hh * .6)} ${f(xx + a * .5)} ${f(y0 + hh)}`; }
    return `<path d="${d}" fill="none" stroke="#2a1606" stroke-opacity=".22" stroke-width=".7"/>`;
  }
  function doorRaised(x, W, Hh, cols, rows, win, key) {
    let s = secBase(x, W, Hh, rows, key); const m = W * .05, gx = W * .028, pw = (W - 2 * m - (cols - 1) * gx) / cols, sh = Hh / rows, ph = sh * .6;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const px = m + c * (pw + gx), py = r * sh + sh * .2;
      s += win && r === 0 ? pane(x, px, py, pw, ph, !!(x.mf && x.lt)) : rp(px, py, pw, ph);
    }
    return s + sheen(x, W, Hh);
  }
  function doorLong(x, W, Hh) {
    let s = secBase(x, W, Hh, 4); const m = W * .05, gx = W * .04, pw = (W - 2 * m - gx) / 2, sh = Hh / 4, ph = sh * .6;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) {
      const px = m + c * (pw + gx), py = r * sh + sh * .2;
      if (r === 0) { const ww = (pw - 3) / 2; s += pane(x, px, py, ww, ph) + pane(x, px + ww + 3, py, ww, ph); } else s += rp(px, py, pw, ph, 2.4);
    }
    return s + sheen(x, W, Hh);
  }
  function doorCarriage(x, W, Hh) {
    let s = secBase(x, W, Hh, 4); const sh = Hh / 4, half = W / 2;
    let g = "";
    for (let xx = W / 16; xx < W; xx += W / 16) if (Math.abs(xx - half) > 1) g += `M${f(xx)} ${f(sh)}V${Hh}`;
    s += `<path d="${g}" stroke="#000" stroke-opacity=".3"/><path d="${g.replace(/M([\d.]+)/g, (a, v) => "M" + f(+v + 1))}" stroke="#fff" stroke-opacity=".14"/>`;
    s += grainV(7, 0, 0, W, Hh, 3);
    s += `<path d="M${f(half)} 0V${Hh}" stroke="#000" stroke-opacity=".6" stroke-width="1.6"/><rect x="2" y="2" width="${f(half - 4)}" height="${Hh - 6}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/><rect x="${f(half + 2)}" y="2" width="${f(half - 4)}" height="${Hh - 6}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="3"/>`;
    const ww = (half - 16) / 2;
    [0, 1, 2, 3].forEach((i) => {
      const px = (i < 2 ? 6 : half + 6) + (i % 2) * (ww + 4), py = sh * .16, ph = sh * .7;
      const d = `M${f(px)} ${f(py + ph)}V${f(py + ph * .4)}Q${f(px + ww / 2)} ${f(py - ph * .25)} ${f(px + ww)} ${f(py + ph * .4)}V${f(py + ph)}Z`;
      s += `<path d="${d}" fill="#000" fill-opacity=".4" transform="translate(.8 .8)"/><path d="${d}" fill="${x.url("gls")}"/><path d="M${f(px + ww / 2)} ${f(py + ph * .1)}V${f(py + ph)}M${f(px)} ${f(py + ph * .55)}H${f(px + ww)}" stroke="${x.p.l}" stroke-width="1.2"/><path d="${d}" fill="none" stroke="${x.p.l}" stroke-width="1.2"/><path d="M${f(px + 1.5)} ${f(py + ph * .9)}L${f(px + ww * .45)} ${f(py + ph * .2)}" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>`;
    });
    const strap = (y, l) => `<path d="M2 ${f(y - 2.4)}H${f(l)}L${f(l + 4)} ${f(y)}L${f(l)} ${f(y + 2.4)}H2Z" fill="#1c1c1e"/><path d="M${f(W - 2)} ${f(y - 2.4)}H${f(W - l)}L${f(W - l - 4)} ${f(y)}L${f(W - l)} ${f(y + 2.4)}H${f(W - 2)}Z" fill="#1c1c1e"/><path d="M2 ${f(y - 1.8)}H${f(l)}M${f(W - 2)} ${f(y - 1.8)}H${f(W - l)}" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>`;
    s += strap(sh * 1.5, W * .18) + strap(sh * 3.4, W * .18);
    s += `<rect x="${f(half - 7)}" y="${f(sh * 2.2)}" width="2.6" height="${f(sh * .8)}" rx="1.2" fill="#1c1c1e"/><rect x="${f(half + 4.4)}" y="${f(sh * 2.2)}" width="2.6" height="${f(sh * .8)}" rx="1.2" fill="#1c1c1e"/>`;
    return s + sheen(x, W, Hh);
  }
  function doorGlass(x, W, Hh) {
    let s = `<rect width="${W}" height="${Hh}" fill="${x.url("fin")}"/>`; const rows = 4, cols = 4, fw = 3.4, sh = Hh / rows, pw = (W - fw * (cols + 1)) / cols, ph = sh - fw * 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const px = fw + c * (pw + fw), py = r * sh + fw;
      s += `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="${x.url("fr")}"/>${x.lt ? `<rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="${WARM}" opacity=".45"/>` : ""}
<path d="M${f(px)} ${f(py)}H${f(px + pw)}M${f(px)} ${f(py)}V${f(py + ph)}" stroke="#000" stroke-opacity=".35"/><rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph * .45)}" fill="#fff" opacity=".18"/><path d="M${f(px + pw * .1)} ${f(py + ph)}L${f(px + pw * .55)} ${f(py)}" stroke="#fff" stroke-opacity=".18" stroke-width="3"/>`;
    }
    for (let r = 1; r < rows; r++) s += `<path d="M0 ${f(r * sh)}H${W}" stroke="#000" stroke-opacity=".6"/>`;
    return s + sheen(x, W, Hh);
  }
  function doorFlush(x, W, Hh) {
    let s = secBase(x, W, Hh, 4); const sh = Hh / 4; let d = "";
    for (let r = 0; r < 4; r++) for (let k = 1; k < 6; k++) d += `M0 ${f(r * sh + k * sh / 6)}H${W}`;
    s += `<path d="${d}" stroke="#000" stroke-opacity=".1"/><path d="${d.replace(/H/g, "H").replace(/M0 ([\d.]+)/g, (a, v) => "M0 " + f(+v + .7))}" stroke="#fff" stroke-opacity=".07"/>`;
    s += `<rect x="${f(W * .1)}" y="${f(sh * .4)}" width="${f(W * .8)}" height="${f(sh * .22)}" fill="${x.url("gls")}"/><rect x="${f(W * .1)}" y="${f(sh * .4)}" width="${f(W * .8)}" height="${f(sh * .22)}" fill="none" stroke="#000" stroke-opacity=".5"/><path d="M${f(W * .12)} ${f(sh * .45)}H${f(W * .5)}" stroke="#fff" stroke-opacity=".3"/>`;
    return s + sheen(x, W, Hh);
  }
  function doorPlank(x, W, Hh) {
    const h = N(), n = 15, ph = Hh / n, r = rnd(23); let s = "";
    for (let i = 0; i < n; i++) {
      const c = h.shade(x.c, r() * .24 - .12);
      s += `<rect x="0" y="${f(i * ph)}" width="${W}" height="${f(ph)}" fill="${c}"/><rect x="0" y="${f(i * ph)}" width="${W}" height="${f(ph * .35)}" fill="#fff" fill-opacity=".07"/><path d="M0 ${f(i * ph + ph - .4)}H${W}" stroke="#000" stroke-opacity=".55" stroke-width=".9"/>`;
    }
    s += grainH(5, 0, 0, W, Hh, 1.4) + grainH(9, 0, 0, W, Hh, 2.2);
    s += `<rect x="${f(W * .4)}" y="${f(Hh * .55)}" width="${f(W * .2)}" height="2.6" rx="1.2" fill="#18191b"/><path d="M${f(W * .4)} ${f(Hh * .55 + .5)}h${f(W * .2)}" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;
    return s + sheen(x, W, Hh);
  }
  function doorRoll(x, W, Hh) {
    let s = `<rect width="${W}" height="${Hh}" fill="${x.url("fin")}"/>`; let d = "", e = "";
    for (let y = 2; y < Hh - 6; y += 4.4) { d += `M0 ${f(y)}H${W}`; e += `M0 ${f(y + 1.6)}H${W}`; }
    s += `<path d="${e}" stroke="#fff" stroke-opacity=".3" stroke-width="1.4"/><path d="${d}" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>`;
    s += `<rect y="${Hh - 8}" width="${W}" height="8" fill="${x.p.d}"/><path d="M0 ${Hh - 7.5}H${W}" stroke="#fff" stroke-opacity=".35"/><rect x="${f(W / 2 - 9)}" y="${Hh - 6.5}" width="18" height="3" rx="1.5" fill="${x.url("chr")}"/><rect x="${f(W * .82)}" y="${Hh - 7}" width="5" height="5" rx="1" fill="#2a2b2d"/>`;
    return s + sheen(x, W, Hh);
  }
  function doorTilt(x, W, Hh) {
    let s = `<rect width="${W}" height="${Hh}" fill="${x.url("fin")}"/>`; let d = "", e = "";
    for (let xx = W / 14; xx < W - 1; xx += W / 14) { d += `M${f(xx)} ${f(Hh * .22)}V${Hh}`; e += `M${f(xx + 1)} ${f(Hh * .22)}V${Hh}`; }
    s += `<path d="${d}" stroke="#000" stroke-opacity=".32" stroke-width="1.2"/><path d="${e}" stroke="#fff" stroke-opacity=".2"/>`;
    s += rp(3, 3, W - 6, Hh - 8, 2.4) + rp(8, Hh * .04, W - 16, Hh * .15, 1.6);
    for (let i = 0; i < 4; i++) { const pw = (W - 40) / 4; s += pane(x, 14 + i * (pw + 4), Hh * .06, pw, Hh * .11); }
    s += `<rect x="${f(W / 2 - 8)}" y="${f(Hh * .7)}" width="16" height="4" rx="2" fill="${x.url("chr")}"/><circle cx="${f(W / 2)}" cy="${f(Hh * .7 + 2)}" r="1.2" fill="#222"/>`;
    return s + sheen(x, W, Hh);
  }

  function proj(hx, gy, dir, th, hz) {
    const F = 240, c = Math.cos(th), sn = Math.sin(th);
    return (u, v) => { const X = hx + dir * u * c, Z = u * sn, Y = gy - v, k = F / (F + Z); return [100 + (X - 100) * k, hz + (Y - hz) * k]; };
  }
  const flat = (x0, gy) => (u, v) => [x0 + u, gy - v];
  const pt = (m, u, v) => { const q = m(u, v); return f(q[0]) + " " + f(q[1]); };
  const qd = (m, u0, v0, u1, v1) => `M${pt(m, u0, v0)}L${pt(m, u1, v0)}L${pt(m, u1, v1)}L${pt(m, u0, v1)}Z`;
  const pl = (m, a, z) => a.map((q, i) => (i ? "L" : "M") + pt(m, q[0], q[1])).join("") + (z ? "Z" : "");
  const ln = (m, u0, v0, u1, v1) => `M${pt(m, u0, v0)}L${pt(m, u1, v1)}`;
  const ringM = (m, cu, cv, r) => { const a = []; for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 2; a.push([cu + r * Math.cos(t), cv + r * Math.sin(t)]); } return pl(m, a, true); };
  const gshadow = (x, m, W) => `<path d="${qd(m, -1, -2, W + 1, 2)}" fill="#000" opacity=".45" filter="${x.url("bl")}"/>`;
  function leafCols(x) { const h = N(), m = h.shade(x.c, -x.op * .22); return { m, l: h.shade(m, .45), d: h.shade(m, -.4) }; }
  const swingCls = (x, dir) => `${P}${x.on ? "swo" : "swc"} ${P}${dir > 0 ? "swl" : "swr"}`;

  function yard_(x, hz, o) {
    o = o || {}; const r = rnd(o.seed || 5);
    let s = `<rect x="8" y="8" width="184" height="${hz}" fill="${x.url("sky")}"/><circle cx="${o.moon || 160}" cy="30" r="12" fill="#fff4d6" opacity=".08"/><circle cx="${o.moon || 160}" cy="30" r="4.5" fill="#fbf1d6" opacity=".85"/>`;
    let d = `M8 ${hz + 2}L8 ${hz - 6}`;
    for (let xx = 8; xx < 192; xx += 9) { const hh = 6 + r() * 16; d += `Q${f(xx + 4.5)} ${f(hz - hh - 8)} ${f(xx + 9)} ${f(hz - 3 - r() * 5)}`; }
    s += `<path d="${d}L192 ${hz + 2}Z" fill="#14211c"/>`;
    s += `<rect x="8" y="${hz}" width="184" height="${192 - hz}" fill="${x.url(o.ground === "gravel" ? "pav" : "lawn")}"/>`;
    if (o.far === "house" || o.far === "cottage") {
      const fx = o.farX || 100, w = o.far === "cottage" ? 26 : 36;
      s += `<rect x="${fx - w / 2}" y="${hz - 13}" width="${w}" height="13" fill="#2b2d38"/><path d="M${fx - w / 2 - 3} ${hz - 13}L${fx} ${hz - 25}L${fx + w / 2 + 3} ${hz - 13}Z" fill="#1c1d26"/>
<rect x="${fx - w / 2 + 4}" y="${hz - 10}" width="5" height="4.5" fill="#ffcf7a"/><rect x="${fx + w / 2 - 9}" y="${hz - 10}" width="5" height="4.5" fill="#ffcf7a"/><rect x="${fx - 2.5}" y="${hz - 8}" width="5" height="8" fill="#ffb95c"/><circle cx="${fx}" cy="${hz - 6}" r="14" fill="${x.url("lp")}" opacity=".35"/>`;
    }
    if (o.far === "barn") {
      const fx = o.farX || 70;
      s += `<path d="M${fx - 16} ${hz}V${hz - 13}L${fx - 11} ${hz - 21}L${fx} ${hz - 26}L${fx + 11} ${hz - 21}L${fx + 16} ${hz - 13}V${hz}Z" fill="#4a1f1c"/><path d="M${fx - 16} ${hz - 13}L${fx - 11} ${hz - 21}L${fx} ${hz - 26}L${fx + 11} ${hz - 21}L${fx + 16} ${hz - 13}" fill="none" stroke="#2a1110" stroke-width="2"/>
<path d="M${fx - 5} ${hz}V${hz - 10}H${fx + 5}V${hz}" fill="#2a1311"/><rect x="${fx - 2.5}" y="${hz - 20}" width="5" height="4" fill="#ffcf7a"/><circle cx="${fx}" cy="${hz - 18}" r="9" fill="${x.url("lp")}" opacity=".4"/>`;
    }
    if (o.drive) {
      const w0 = 5, w1 = 66; let j = "";
      for (let i = 1; i < 9; i++) { const t = Math.pow(i / 9, 1.7), y = hz + (192 - hz) * t, hw = w0 + (w1 - w0) * t; j += `M${f(100 - hw)} ${f(y)}H${f(100 + hw)}`; }
      s += `<path d="M${100 - w0} ${hz}H${100 + w0}L${100 + w1} 192H${100 - w1}Z" fill="${x.url("pav")}"/><path d="${j}" stroke="#000" stroke-opacity=".22"/><path d="M${100 - w0} ${hz}L${100 - w1} 192M${100 + w0} ${hz}L${100 + w1} 192" stroke="#d9d2c4" stroke-opacity=".45" stroke-width="1.4"/>`;
    }
    if (o.path) {
      let st = "";
      for (let i = 0; i < 7; i++) { const t = i / 6, y = hz + 6 + (192 - hz - 6) * Math.pow(t, 1.5), w = 3 + 13 * t, xo = (i % 2 ? 4 : -4) * t; st += `<ellipse cx="${f(100 + xo)}" cy="${f(y)}" rx="${f(w)}" ry="${f(w * .32)}" fill="#8e877b"/><ellipse cx="${f(100 + xo)}" cy="${f(y - w * .06)}" rx="${f(w * .8)}" ry="${f(w * .2)}" fill="#fff" opacity=".1"/>`; }
      s += st;
    }
    return s;
  }
  function pillar(x, px, w, top, bot, mat, lamp) {
    const h = N(), g = x.id("pl" + x.n++), c = mat === "brick" ? "#7a3f2e" : mat === "render" ? "#d9d5cc" : "#8d8476", r = rnd(px + 3);
    let s = `<ellipse cx="${px + w / 2}" cy="${bot}" rx="${f(w * .8)}" ry="3.5" fill="${x.url("cs")}"/>${lg(g, [[0, h.shade(c, .2)], [.3, c], [1, h.shade(c, -.45)]])}<rect x="${px}" y="${top}" width="${w}" height="${bot - top}" fill="url(#${g})"/>`;
    let d = "";
    if (mat === "brick") {
      for (let y = top + 4.5, i = 0; y < bot; y += 4.5, i++) { d += `M${px} ${f(y)}h${w}`; for (let xx = px + (i % 2 ? 4 : 8); xx < px + w; xx += 8) d += `M${f(xx)} ${f(y)}v-4.5`; }
      s += `<path d="${d}" stroke="#d4c8b8" stroke-opacity=".35" stroke-width=".7"/>`;
    } else if (mat === "stone") {
      for (let y = top + 1; y < bot - 3; y += 7) for (let xx = px - r() * 6; xx < px + w;) { const ww = 6 + r() * 7; s += `<path d="${rr(Math.max(px, xx) + .6, y, Math.min(ww, px + w - Math.max(px, xx)) - 1.2, 6, 1.8)}" fill="${h.shade(c, r() * .3 - .25)}" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>`; xx += ww; }
      s += `<rect x="${px}" y="${top}" width="${w}" height="${bot - top}" fill="url(#${g})" opacity=".45"/>`;
    } else s += `<path d="M${px + w * .3} ${top}V${bot}" stroke="#fff" stroke-opacity=".2"/>`;
    s += `<rect x="${px}" y="${top}" width="${w}" height="4" fill="#000" fill-opacity=".3"/><rect x="${px - 3}" y="${top - 6}" width="${w + 6}" height="6.5" rx="1" fill="${mat === "render" ? "#ecebe6" : "#cfc6b6"}"/><path d="M${px - 3} ${top - 5.6}h${w + 6}" stroke="#fff" stroke-opacity=".6"/>`;
    if (lamp) {
      const cx = px + w / 2, y = top - 6, lit = x.on;
      s += `${lit ? `<circle class="${P}glow" cx="${cx}" cy="${y - 9}" r="22" fill="${x.url("lp")}" opacity=".7"/>` : ""}<rect x="${cx - 4}" y="${y - 3}" width="8" height="3" fill="#1b1c1e"/><rect x="${cx - 4}" y="${y - 15}" width="8" height="12" fill="${lit ? "#ffe2a4" : "#39414a"}"/>${lit ? `<circle cx="${cx}" cy="${y - 9}" r="2.4" fill="#fff"/>` : ""}
<path d="M${cx - 4} ${y - 15}v12M${cx + 4} ${y - 15}v12M${cx} ${y - 15}v12" stroke="#1b1c1e"/><path d="M${cx - 6} ${y - 15}L${cx} ${y - 20}L${cx + 6} ${y - 15}Z" fill="#1b1c1e"/>`;
    }
    return s;
  }
  function boards_(x, x0, x1, gy, hh, col, kind, seed) {
    const h = N(), r = rnd(seed || 3); let s = "";
    if (kind === "picket") {
      s += `<rect x="${x0}" y="${gy - hh * .78}" width="${x1 - x0}" height="3" fill="${h.shade(col, -.35)}"/><rect x="${x0}" y="${gy - hh * .25}" width="${x1 - x0}" height="3" fill="${h.shade(col, -.35)}"/>`;
      for (let xx = x0 + 1; xx < x1 - 3; xx += 7.5) s += `<path d="M${f(xx)} ${gy}V${gy - hh + 4}L${f(xx + 2.5)} ${gy - hh}L${f(xx + 5)} ${gy - hh + 4}V${gy}Z" fill="${h.shade(col, r() * .1 - .12)}"/><path d="M${f(xx + .6)} ${gy}V${gy - hh + 4}" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/><path d="M${f(xx + 5)} ${gy}V${gy - hh + 4}" stroke="#000" stroke-opacity=".3" stroke-width=".7"/>`;
    } else {
      for (let xx = x0; xx < x1; xx += 8) s += `<rect x="${f(xx)}" y="${gy - hh}" width="7.6" height="${hh}" fill="${h.shade(col, r() * .2 - .14)}"/><path d="M${f(xx + 7.6)} ${gy - hh}V${gy}" stroke="#000" stroke-opacity=".5"/>`;
      s += grainV(seed || 3, x0, gy - hh, x1 - x0, hh, 2.6) + `<rect x="${x0}" y="${gy - hh - 3}" width="${x1 - x0}" height="3.4" fill="${h.shade(col, -.3)}"/><path d="M${x0} ${gy - hh - 2.6}H${x1}" stroke="#fff" stroke-opacity=".3"/>`;
    }
    return s;
  }

  const wall = (...a) => BGW(wall_(...a));
  const eave = (...a) => BGW(eave_(...a));
  const drive = (...a) => BGW(drive_(...a));
  const bush = (...a) => BGW(bush_(...a));
  const lantern = (...a) => BGW(lantern_(...a));
  const yard = (...a) => BGW(yard_(...a));
  const boards = (...a) => BGW(boards_(...a));
  const icons = [];
  // (parts) Multi-Function: each door / gate is its own part (a contact: open = up / swung or slid open) and the Light (a
  // switch: the opener light inside, lanterns and sconces, a door's windows) is another. o.mf = only the ticked parts in o.parts:
  // a door left out stays closed, the light off (an open door then shows a dim garage). Side-by-side: d1 + d2 (n258 pilot).
  // A Device Image (no o.mf) is exactly today's (on = open, the lights follow it); a device contact (o.open) lifts the door.
  function mfx(x, o) {
    if (!o.mf) { if (o.open === true && !x.on) { x.on = true; x.op = 1; } return x; }
    const p = o.parts || {}, sub = (k, n0) => { const y = Object.create(x); y.on = !!p[k]; y.op = y.on ? 1 : 0; y.n = n0; return y; };
    x.mf = true; x.lt = !!p.light; x.on = !!(p.door || p.gate || p.d1 || p.d2); x.op = x.on ? 1 : 0;
    if (p.d1 != null || p.d2 != null) { x.d1 = sub("d1", 100); x.d2 = sub("d2", 300); }
    return x;
  }
  const G = (id, name, colors, colorLabel, fn) => icons.push({ id, name, colors, picker: true, colorLabel, render(o) { return fn(mfx(ctx(o), o)); } });
  const DOOR = "Door", GATE = "Gate";

  G("raised", "Raised panel", [WHT, ALM, SND, BRZ, BLK], DOOR, (x) => {
    const X = 42, Y = 62, W = 116, Hh = 96;
    return svg(x, wall(x, "siding", "#7c8a96") + eave(x, 34, "#e9e7e1") + drive(x, Y + Hh) +
      bay(x, { X, Y, W, H: Hh, door: doorRaised(x, W, Hh, 4, 4), car: "sedan", carCol: "#8a2329" }) +
      lantern(x, 24, 96, x.lt) + lantern(x, 176, 96, x.lt) + bush(x, 16, 184, 13) + bush(x, 186, 186, 12));
  });
  G("double", "Two-car raised", [ALM, WHT, SND, BRZ, BLK], DOOR, (x) => {
    const X = 22, Y = 66, W = 156, Hh = 90;
    return svg(x, wall(x, "brick", "#83483a", 8, 192, 4) + eave(x, 36, "#efece4", "#2f2b2a") + drive(x, Y + Hh) +
      bay(x, { X, Y, W, H: Hh, door: doorRaised(x, W, Hh, 8, 4), car: "suv", carCol: "#3d5568" }));
  });
  G("carriage", "Carriage house", [CDR, WAL, SND, BLK, WHT, "#3e5a4b"], DOOR, (x) => {
    const X = 40, Y = 60, W = 120, Hh = 98;
    return svg(x, wall(x, "stucco", "#c8b79a") + eave(x, 32, "#5a3b26", "#3d3330") + drive(x, Y + Hh) +
      bay(x, { X, Y, W, H: Hh, door: doorCarriage(x, W, Hh), car: "sedan", carCol: "#c9ccd0", trim: "#5c4130" }) +
      lantern(x, 22, 94, x.lt) + lantern(x, 178, 94, x.lt) + bush(x, 18, 186, 12) + bush(x, 184, 185, 13));
  });
  G("glass", "Frosted glass", [BLK, CHA, "#b9bec3", BRZ, WHT], DOOR, (x) => {
    const X = 34, Y = 54, W = 132, Hh = 104;
    let slats = ""; for (let xx = 8; xx < 192; xx += 5) slats += `<rect x="${xx}" y="8" width="3.6" height="22" fill="${xx % 10 ? "#9a6a43" : "#8a5c38"}"/>`;
    return svg(x, BGW(wall_(x, "panel", "#3b3f45") + slats + `<rect x="8" y="30" width="184" height="10" fill="${x.url("dn")}" opacity=".7"/>`) +
      (x.lt ? `<path d="M40 30L28 70H172L160 30Z" fill="${x.url("cone")}" opacity=".35"/>` : "") + `<path d="M38 29.5H162" stroke="${x.lt ? "#fff3d0" : "#5b5f66"}" stroke-width="2"/>` +
      drive(x, Y + Hh) + bay(x, { X, Y, W, H: Hh, door: doorGlass(x, W, Hh), car: "sedan", carCol: "#e7e7e4", trim: "#2a2d31" }) + bush(x, 16, 184, 10) + bush(x, 186, 184, 10));
  });
  G("flush", "Flush modern", [CHA, BLK, WHT, BRZ, SND], DOOR, (x) => {
    const X = 30, Y = 58, W = 124, Hh = 100;
    return svg(x, BGW(wall_(x, "stucco", "#e4e1da", 8, 192, 7) + `<rect x="8" y="8" width="184" height="18" fill="#2c2e33"/><rect x="8" y="26" width="184" height="12" fill="${x.url("dn")}" opacity=".5"/>` +
      `<rect x="164" y="40" width="22" height="118" fill="#8f6440"/>${grainV(3, 164, 40, 22, 118, 2)}<path d="M164 40v118" stroke="#000" stroke-opacity=".3"/>`) +
      drive(x, Y + Hh) + bay(x, { X, Y, W, H: Hh, door: doorFlush(x, W, Hh), car: "sedan", carCol: "#1f5f9c", trim: "#dcd9d2" }) +
      BGW(`<rect x="168" y="78" width="14" height="4" rx="1" fill="#1b1c1e"/>${x.lt ? `<path d="M168 82L160 120H190L182 82Z" fill="${x.url("cone")}" opacity=".7"/>` : ""}`));
  });
  G("longpanel", "Long panel", [WHT, ALM, SND, "#7c7f82", BRZ], DOOR, (x) => {
    const X = 38, Y = 60, W = 124, Hh = 98;
    return svg(x, wall(x, "siding", "#b9ab92", 8, 120) + wall(x, "stone", "#8b8070", 120, 192, 17) + eave(x, 34, "#f0eee8", "#3d3a36") + drive(x, Y + Hh) +
      bay(x, { X, Y, W, H: Hh, door: doorLong(x, W, Hh), car: "suv", carCol: "#2d3136" }) + lantern(x, 22, 96, x.lt) + lantern(x, 178, 96, x.lt));
  });
  G("plank", "Cedar plank", [CDR, WAL, "#c79a6a", "#8b8b84", BLK], DOOR, (x) => {
    const X = 40, Y = 60, W = 120, Hh = 98;
    return svg(x, wall(x, "batten", "#e3e2dd") + eave(x, 32, "#1f2023", "#26272a") + drive(x, Y + Hh) +
      bay(x, { X, Y, W, H: Hh, door: doorPlank(x, W, Hh), car: "suv", carCol: "#6b7b5a", trim: "#1f2023" }) +
      BGW(`<rect x="20" y="70" width="5" height="18" rx="1" fill="#1b1c1e"/><rect x="175" y="70" width="5" height="18" rx="1" fill="#1b1c1e"/>${x.lt ? `<path d="M20 88L14 118H31L25 88ZM175 88L169 118H186L180 88Z" fill="${x.url("cone")}" opacity=".8"/><path d="M20 70L15 50H30L25 70ZM175 70L170 50H185L180 70Z" fill="${WARM}" opacity=".18"/>` : ""}`) +
      bush(x, 17, 186, 11) + bush(x, 184, 186, 11));
  });
  G("rollup", "Roll-up sheet", [GAL, WHT, "#3f6d8f", RED, BLK, ALM], DOOR, (x) => {
    const X = 44, Y = 72, W = 112, Hh = 88, h = N();
    const hood = `<rect x="${X - 8}" y="${Y - 22}" width="${W + 16}" height="18" rx="7" fill="${x.url("fin")}"/><rect x="${X - 8}" y="${Y - 22}" width="${W + 16}" height="18" rx="7" fill="${x.url("sh")}"/><path d="M${X - 4} ${Y - 19}H${X + W + 4}" stroke="#fff" stroke-opacity=".45"/><rect x="${X - 8}" y="${Y - 6}" width="${W + 16}" height="2" fill="#000" fill-opacity=".4"/>`;
    return svg(x, BGW(wall_(x, "metal", "#6c7c74") + `<rect x="8" y="8" width="184" height="12" fill="#c9ccc8"/><rect x="8" y="20" width="184" height="6" fill="${x.url("dn")}"/>`) +
      drive(x, Y + Hh) + bay(x, { X, Y, W, H: Hh, door: doorRoll(x, W, Hh), car: null, trim: h.shade("#6c7c74", -.35), beacon: false }) + hood + beacon(x, X + W + 18, Y - 14) +
      `<rect x="${X + W + 12}" y="${Y + 30}" width="9" height="14" rx="1.5" fill="#2b2d30"/><circle cx="${X + W + 16.5}" cy="${Y + 34}" r="1.6" fill="${x.on ? LEDG : "#c0392b"}"/><rect x="${X + W + 14}" y="${Y + 38}" width="5" height="3" rx="1" fill="#e9e9e9"/>`);
  });
  G("tiltup", "One-piece tilt", [ALM, WHT, SND, "#5a6b4f", BRZ], DOOR, (x) => {
    const X = 36, Y = 64, W = 128, Hh = 92;
    return svg(x, wall(x, "brick", "#9c6a4c", 8, 192, 9) + eave(x, 40, "#d9d2c3", "#45403a") + drive(x, Y + Hh) +
      bay(x, { X, Y, W, H: Hh, door: doorTilt(x, W, Hh), mode: "tilt", car: "sedan", carCol: "#a8742e", trim: "#eae4d6" }) +
      lantern(x, 21, 100, x.lt) + lantern(x, 179, 100, x.lt) + bush(x, 15, 186, 12) + bush(x, 186, 186, 12));
  });
  G("pair", "Side-by-side", [WHT, ALM, SND, "#6c7176", BLK], DOOR, (x) => {
    const Y = 70, W = 74, Hh = 86;
    if (!x.d1) x.d1 = x.d2 = x;
    return svg(x, wall(x, "siding", "#56606a") + eave(x, 36, "#f2f1ec", "#2e2c2b") + drive(x, Y + Hh) +
      bay(x.d1, { X: 18, Y, W, H: Hh, door: doorRaised(x.d1, W, Hh, 4, 4, true), car: "sedan", carCol: "#b8bec4" }) +
      bay(x.d2, { X: 108, Y, W, H: Hh, door: doorRaised(x.d2, W, Hh, 4, 4, true), car: "suv", carCol: "#5a2430" }) + lantern(x, 100, 98, x.lt));
  });

  G("swing", "Swing gate", [BLK, BRZ, "#3f4b3f", WHT, GAL], GATE, (x) => {
    const hz = 104, gy = 168, W = 64, Hh = 60, th = x.op * 1.3, c = leafCols(x);
    const leaf = (hx, dir) => {
      const m = proj(hx, gy, dir, th, hz); let d = "", hi = "", rings = "";
      d += qd(m, 0, 4, 3, Hh) + qd(m, W - 3, 4, W, Hh) + qd(m, 0, Hh - 3, W, Hh) + qd(m, 0, Hh - 13, W, Hh - 10) + qd(m, 0, 5, W, 8.5);
      for (let u = 8; u < W - 4; u += 6) { d += qd(m, u - .9, 8.5, u + .9, Hh - 3); hi += ln(m, u - .6, 8.5, u - .6, Hh - 3); }
      for (let u = 11; u < W - 4; u += 6) rings += ringM(m, u, Hh - 6.5, 2.1);
      hi += ln(m, 0, Hh - .5, W, Hh - .5);
      const arm = `<path d="M${hx + dir * 2} ${gy - 30}L${pt(m, W * .42, 30)}" stroke="#2a2c2f" stroke-width="3.4" stroke-linecap="round"/><path d="M${hx + dir * 2} ${gy - 30.8}L${pt(m, W * .42, 30.8)}" stroke="url(#${x.u}-chr)" stroke-width="1.2" opacity=".8"/>`;
      return gshadow(x, m, W) + `<g class="${swingCls(x, dir)}"><path d="${d}" fill="${c.m}"/><path d="${hi}" fill="none" stroke="${c.l}" stroke-opacity=".55" stroke-width=".6"/><path d="${rings}" fill="none" stroke="${c.m}" stroke-width="1"/></g>` + arm;
    };
    return svg(x, yard(x, hz, { drive: true, far: "house" }) + leaf(36, 1) + leaf(164, -1) +
      pillar(x, 14, 22, 96, gy + 2, "stone", true) + pillar(x, 164, 22, 96, gy + 2, "stone", true) + beacon(x, 175, 81) + bush(x, 12, 184, 10) + bush(x, 188, 184, 10));
  });
  G("slide", "Sliding gate", [BRZ, BLK, "#3c4a3e", WHT, GAL], GATE, (x) => {
    const hz = 104, gy = 166, W = 150, Hh = 58, c = leafCols(x), dx = -x.op * 118, m = flat(42 + dx, gy);
    let d = qd(m, 0, 3, W, 7) + qd(m, 0, Hh - 6, W, Hh - 2) + qd(m, 0, 24, W, 27) + qd(m, 0, 3, 3, Hh) + qd(m, W - 3, 3, W, Hh), hi = "", sp = "";
    const kick = `<path d="${qd(m, 3, 7, W - 3, 24)}" fill="${c.d}"/><path d="${ln(m, 3, 23.4, W - 3, 23.4)}" stroke="${c.l}" stroke-opacity=".5"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="${qd(m, 6 + i * 29, 10, 32 + i * 29, 21)}" fill="none" stroke="${c.l}" stroke-opacity=".3"/>`).join("");
    for (let u = 7; u < W - 3; u += 7) { d += qd(m, u - .8, 7, u + .8, Hh + 2); hi += ln(m, u - .5, 7, u - .5, Hh); sp += pl(m, [[u - 2, Hh + 2], [u, Hh + 7], [u + 2, Hh + 2]], true); }
    const wheels = [18, W - 18].map((u) => { const q = m(u, 0); return `<circle cx="${f(q[0])}" cy="${f(q[1] - 2)}" r="4.2" fill="url(#${x.u}-chr)"/><circle cx="${f(q[0])}" cy="${f(q[1] - 2)}" r="1.4" fill="#222"/>`; }).join("");
    const gate = `<g class="${P}${x.on ? "slo" : "slc"}">${kick}<path d="${d}" fill="${c.m}"/><path d="${sp}" fill="${c.m}"/><path d="${hi}" fill="none" stroke="${c.l}" stroke-opacity=".55" stroke-width=".6"/>${wheels}</g>`;
    return svg(x, yard(x, hz, { drive: true, far: "house", farX: 112, moon: 48 }) + `<rect x="8" y="${gy - 1.5}" width="184" height="3" fill="url(#${x.u}-chr)"/>` + gshadow(x, m, W) + gate +
      BGW(`<clipPath id="${x.id("lw")}"><rect x="8" y="92" width="38" height="${gy - 88}"/></clipPath><g clip-path="url(#${x.id("lw")})">${wall_(x, "brick", "#7d4534", 92, gy + 4, 31)}</g><path d="M46 92V${gy + 4}" stroke="#000" stroke-opacity=".4" stroke-width="2"/>` +
      `<rect x="8" y="88" width="40" height="5" fill="#cfc6b6"/>`) + `<rect x="176" y="96" width="8" height="${gy - 96}" fill="#3a3d41"/><path d="M177 96v${gy - 96}" stroke="#fff" stroke-opacity=".2"/>` +
      `<rect x="150" y="${gy - 22}" width="20" height="22" rx="2" fill="#7d858c"/><rect x="150" y="${gy - 22}" width="20" height="22" rx="2" fill="url(#${x.u}-sh)"/><path d="M152 ${gy - 20}h16" stroke="#fff" stroke-opacity=".35"/>` + beacon(x, 160, gy - 27) + bush(x, 186, 182, 9));
  });
  G("privacy", "Wood privacy", [CDR, WAL, "#8d8a82", "#d0b48c", BLK], GATE, (x) => {
    const hz = 100, gy = 170, W = 62, Hh = 84, th = x.op * 1.25, h = N(), m = proj(70, gy, 1, th, hz), r = rnd(41);
    let lf = "";
    for (let i = 0; i < 8; i++) { const u0 = i * W / 8; lf += `<path d="${qd(m, u0 + .3, 0, u0 + W / 8 - .3, Hh)}" fill="${h.shade(x.c, r() * .2 - .12 - x.op * .2)}"/><path d="${ln(m, u0 + W / 8 - .2, 0, u0 + W / 8 - .2, Hh)}" stroke="#000" stroke-opacity=".5"/>`; for (let k = 0; k < 2; k++) lf += `<path d="${ln(m, u0 + 2 + k * 3, 2, u0 + 2.4 + k * 3, Hh - 2)}" stroke="#2a1606" stroke-opacity=".22" stroke-width=".6"/>`; }
    lf += `<path d="${qd(m, -1, Hh, W + 1, Hh + 3.4)}" fill="${h.shade(x.c, -.35)}"/>`;
    const strap = (v) => `<path d="${pl(m, [[0, v - 2.4], [30, v - 1.2], [33, v], [30, v + 1.2], [0, v + 2.4]], true)}" fill="#1b1b1d"/>`;
    lf += strap(16) + strap(Hh - 16);
    const lq = m(W - 7, Hh * .5);
    lf += `<rect x="${f(lq[0] - 2)}" y="${f(lq[1] - 6)}" width="4" height="12" rx="1.5" fill="#1b1b1d"/><circle cx="${f(lq[0])}" cy="${f(lq[1] - 3)}" r="1.1" fill="${x.on ? AMB : LEDG}"${x.on ? ` class="${P}blink"` : ""}/>`;
    return svg(x, yard(x, hz, { path: true, far: "cottage", farX: 104 }) + boards(x, 8, 66, gy, 84, x.c, "board", 5) + boards(x, 134, 192, gy, 84, x.c, "board", 9) +
      `<rect x="64" y="${gy - 92}" width="7" height="92" fill="${h.shade(x.c, -.25)}"/><rect x="130" y="${gy - 92}" width="7" height="92" fill="${h.shade(x.c, -.3)}"/><path d="M64.6 ${gy - 92}v92M130.6 ${gy - 92}v92" stroke="#fff" stroke-opacity=".25"/>` +
      gshadow(x, m, W) + `<g class="${swingCls(x, 1)}">${lf}</g>` + BGW(`<rect x="8" y="${gy}" width="184" height="${192 - gy}" fill="#000" opacity=".15"/>`) + bush(x, 20, 182, 11) + bush(x, 182, 182, 12));
  });
  G("iron", "Wrought iron", [BLK, BRZ, "#2f4038", "#5b5e63", WHT], GATE, (x) => {
    const hz = 104, gy = 170, W = 64, th = x.op * 1.3, c = leafCols(x), GOLD = "#d4a64a";
    const top = (u) => 50 + 20 * Math.pow(u / W, 1.7);
    const leaf = (hx, dir) => {
      const m = proj(hx, gy, dir, th, hz); let d = "", hi = "", fin = "", sc = "";
      d += qd(m, 0, 3, 3.4, 56) + qd(m, 0, 3, W, 6.5) + qd(m, 0, 14, W, 17) + qd(m, 0, 38, W, 41);
      const arc = [], arc2 = []; for (let i = 0; i <= 12; i++) { const u = i / 12 * W; arc.push([u, top(u)]); arc2.unshift([u, top(u) - 3.4]); }
      d += pl(m, arc.concat(arc2), true);
      for (let u = 6; u < W - 1; u += 5.4) { const t = top(u); d += qd(m, u - .8, 6.5, u + .8, t + 3); hi += ln(m, u - .5, 6.5, u - .5, t + 3); fin += pl(m, [[u - 1.8, t + 3], [u, t + 8], [u + 1.8, t + 3]], true); }
      for (let u = 8; u < W - 4; u += 11) sc += ringM(m, u + 2.7, 27.5, 4.8) + ringM(m, u + 2.7, 27.5, 1.6);
      const hb = m(1.7, 60);
      return gshadow(x, m, W) + `<g class="${swingCls(x, dir)}"><path d="${d}" fill="${c.m}"/><path d="${sc}" fill="none" stroke="${c.m}" stroke-width="1.2"/><path d="${hi}" fill="none" stroke="${c.l}" stroke-opacity=".5" stroke-width=".6"/><path d="${fin}" fill="${GOLD}"/><circle cx="${f(hb[0])}" cy="${f(hb[1])}" r="3" fill="${GOLD}"/></g>`;
    };
    return svg(x, yard(x, hz, { drive: true, far: "house", moon: 150 }) + leaf(36, 1) + leaf(164, -1) +
      pillar(x, 12, 24, 92, gy + 2, "brick", true) + pillar(x, 164, 24, 92, gy + 2, "brick", true) + beacon(x, 176, 166) + bush(x, 186, 186, 9));
  });
  G("slat", "Modern slat", [CDR, WAL, CHA, WHT, SND], GATE, (x) => {
    const hz = 104, gy = 168, W = 112, Hh = 66, th = x.op * 1.2, h = N(), m = proj(46, gy, 1, th, hz), r = rnd(57);
    let s = "";
    for (let v = 3; v < Hh - 4; v += 8.4) { s += `<path d="${qd(m, 2.5, v, W - 2.5, v + 6.4)}" fill="${h.shade(x.c, r() * .14 - .07 - x.op * .2)}"/><path d="${ln(m, 2.5, v + 6.2, W - 2.5, v + 6.2)}" stroke="#fff" stroke-opacity=".22" stroke-width=".7"/><path d="${ln(m, 4, v + 3.4, W - 6, v + 3)}" stroke="#2a1606" stroke-opacity=".2" stroke-width=".5"/>`; }
    const fr = qd(m, 0, 0, 2.5, Hh) + qd(m, W - 2.5, 0, W, Hh) + qd(m, 0, Hh - 2.5, W, Hh) + qd(m, 0, 0, W, 2.5);
    const lights = (cx) => `<rect x="${cx - 2.5}" y="112" width="5" height="12" rx="1" fill="#1b1c1e"/>${x.lt ? `<path d="M${cx - 2.5} 124L${cx - 8} 150H${cx + 8}L${cx + 2.5} 124ZM${cx - 2.5} 112L${cx - 7} 92H${cx + 7}L${cx + 2.5} 112Z" fill="${x.url("cone")}" opacity=".8"/>` : ""}`;
    return svg(x, yard(x, hz, { drive: true, far: "house" }) + gshadow(x, m, W) + `<g class="${swingCls(x, 1)}">${s}<path d="${fr}" fill="#1e2023"/></g>` +
      pillar(x, 8, 38, 96, gy + 2, "render") + pillar(x, 158, 34, 96, gy + 2, "render") + `<path d="M8 120H46M8 146H46M158 120H192M158 146H192" stroke="#000" stroke-opacity=".18"/><path d="M8 121H46M8 147H46M158 121H192M158 147H192" stroke="#fff" stroke-opacity=".4"/><rect x="16" y="128" width="22" height="9" rx="1" fill="#2a2c30"/><text x="27" y="135" font-size="6.4" font-family="Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle" fill="#d9c49a">214</text>` + lights(27) + lights(175) +
      `<rect x="160" y="132" width="8" height="12" rx="1.5" fill="#25272a"/><circle cx="164" cy="135.5" r="1.2" fill="${x.on ? AMB : LEDG}"${x.on ? ` class="${P}blink"` : ""}/>`);
  });
  G("ranch", "Ranch tube gate", [GAL, "#2f5d3a", RED, BLK, WHT], GATE, (x) => {
    const hz = 108, gy = 166, W = 128, Hh = 56, th = x.op * 1.3, c = leafCols(x), m = proj(38, gy, 1, th, hz);
    let d = "", hi = "";
    [6, 18, 30, 42, 53].forEach((v) => { d += qd(m, 0, v, W, v + 3.2); hi += ln(m, 0, v + 2.4, W, v + 2.4); });
    d += qd(m, 0, 4, 3.4, Hh + 1) + qd(m, W - 3.4, 4, W, Hh + 1) + qd(m, W * .5 - 1.4, 6, W * .5 + 1.4, Hh) + pl(m, [[2, 7], [5.5, 7], [W * .5 + 1.4, Hh - 2], [W * .5 - 2, Hh - 2]], true);
    hi += ln(m, .8, 4, .8, Hh + 1) + ln(m, W - 2.6, 4, W - 2.6, Hh + 1);
    const post = (px) => `<rect x="${px}" y="${gy - 74}" width="11" height="76" fill="#5a4330"/><rect x="${px}" y="${gy - 74}" width="11" height="76" fill="url(#${x.u}-sh)"/><ellipse cx="${px + 5.5}" cy="${gy - 74}" rx="5.5" ry="2" fill="#7a5f45"/>`;
    const rails = (x0, x1) => [gy - 58, gy - 38, gy - 18].map((y) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="4" fill="#6b5039"/><path d="M${x0} ${y + .6}H${x1}" stroke="#fff" stroke-opacity=".15"/>`).join("");
    const arm = `<path d="M40 ${gy - 34}L${pt(m, W * .36, 32)}" stroke="#2c2e31" stroke-width="3.4" stroke-linecap="round"/><path d="M40 ${gy - 34.8}L${pt(m, W * .36, 32.8)}" stroke="url(#${x.u}-chr)" stroke-width="1" opacity=".8"/>`;
    return svg(x, yard(x, hz, { ground: "gravel", far: "barn", farX: 128, moon: 44 }) + BGW(`<rect x="8" y="${hz}" width="184" height="12" fill="#2b3d22" opacity=".85"/>` + rails(8, 30) + rails(178, 192)) + post(27) + post(170) +
      gshadow(x, m, W) + `<g class="${swingCls(x, 1)}"><path d="${d}" fill="${c.m}"/><path d="${hi}" fill="none" stroke="${c.l}" stroke-opacity=".7" stroke-width=".8"/></g>` + arm +
      `<path d="M26 ${gy - 86}L42 ${gy - 80}L42 ${gy - 76}L26 ${gy - 82}Z" fill="#1d2f52"/><path d="M30 ${gy - 84.5}L30 ${gy - 80.5}M34 ${gy - 83}L34 ${gy - 79}M38 ${gy - 81.5}L38 ${gy - 77.5}" stroke="#7fa3d6" stroke-width=".5"/><path d="M33 ${gy - 79}V${gy - 74}" stroke="#333"/>` +
      `<rect x="171" y="${gy - 46}" width="8" height="10" rx="1.5" fill="#2a2c2f"/><circle cx="175" cy="${gy - 42}" r="1.4" fill="${x.on ? AMB : LEDG}"${x.on ? ` class="${P}blink"` : ""}/>`);
  });
  G("garden", "Garden gate", [WHT, "#5f7a66", "#3a5a7d", BLK, CDR], GATE, (x) => {
    const hz = 100, gy = 172, W = 54, th = x.op * 1.3, c = leafCols(x), m = proj(73, gy, 1, th, hz);
    const top = (u) => 36 + 8 * Math.sin(Math.PI * u / W);
    let d = qd(m, 1, 8, W - 1, 11) + qd(m, 1, 25, W - 1, 28), pk = "", hi = "";
    for (let u = 1; u < W - 4; u += 7.6) { const uc = u + 2.7, t = top(uc); pk += pl(m, [[u, 2], [u + 5.4, 2], [u + 5.4, t - 3], [uc, t + 1.5], [u, t - 3]], true); hi += ln(m, u + .5, 2, u + .5, t - 3); }
    const leaf = `<path d="${d}" fill="${c.d}"/><path d="${pk}" fill="${c.m}"/><path d="${hi}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/><path d="${pk}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5"/>`;
    const r = rnd(77); let vine = "", fl = "";
    const arch = (t) => [100 + Math.cos(Math.PI * (1 - t)) * 32, 66 - Math.sin(Math.PI * t) * 20];
    for (let i = 0; i < 44; i++) { let px, py; if (i < 26) { const q = arch(r()); px = q[0] + r() * 6 - 3; py = q[1] + r() * 8 - 4; } else { const side = r() > .5 ? 67 : 133; px = side + r() * 8 - 4; py = 70 + r() * 90; } vine += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(2.2 + r() * 2.4)}" fill="${["#2f5a2a", "#3f7334", "#264a24", "#4d8a3c"][(r() * 4) | 0]}"/>`; if (r() > .55) fl += `<circle cx="${f(px + 1)}" cy="${f(py - 1)}" r="1.4" fill="${r() > .5 ? "#f2a7c3" : "#fff2f6"}"/>`; }
    const arb = `<rect x="64" y="64" width="6" height="${gy - 64}" fill="#efece4"/><rect x="130" y="64" width="6" height="${gy - 64}" fill="#d9d5cb"/><path d="M64 66A36 22 0 0 1 136 66" fill="none" stroke="#efece4" stroke-width="6"/><path d="M58 64H142" stroke="#efece4" stroke-width="3"/><path d="M64.6 64v${gy - 64}" stroke="#fff" stroke-opacity=".6"/>`;
    return svg(x, yard(x, hz, { path: true, far: "cottage", farX: 100, moon: 156 }) + boards(x, 8, 64, gy, 40, "#efeee9", "picket", 4) + boards(x, 136, 192, gy, 40, "#e6e4dd", "picket", 8) +
      gshadow(x, m, W) + `<g class="${swingCls(x, 1)}">${leaf}</g>` + arb + vine + fl + bush(x, 26, 184, 12) + bush(x, 176, 184, 12) +
      `<rect x="129" y="${gy - 30}" width="5" height="9" rx="1.5" fill="#26282b"/><circle cx="131.5" cy="${gy - 27}" r="1.1" fill="${x.on ? AMB : LEDG}"${x.on ? ` class="${P}blink"` : ""}/>`);
  });

  G("opener", "Belt opener", [WHT, ALM, SND, BRZ, BLK], DOOR, (x) => {
    const op = x.op, h = N(), L = 132, d0 = op * 112;
    const pt2 = (t) => t <= 118 ? [181, 188 - t] : t <= 140 ? (() => { const a = (t - 118) / 14; return [167 + 14 * Math.cos(a), 70 - 14 * Math.sin(a)]; })() : [167 - (t - 140), 56];
    let door = "", kn = "";
    for (let i = 0; i < 4; i++) { const a = pt2(d0 + i * L / 4 + 1), b = pt2(d0 + (i + 1) * L / 4 - 1); const seg = `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`; door += `<path d="${seg}" stroke="#1d1e20" stroke-width="10"/><path d="${seg}" stroke="${x.p.d}" stroke-width="8.4"/><path d="${seg}" stroke="${x.p.m}" stroke-width="5"/><path d="${seg}" stroke="${x.p.l}" stroke-width="1.6" transform="translate(-2 -1)" opacity=".9"/>`; const k = pt2(d0 + (i + 1) * L / 4); if (i < 3) kn += `<circle cx="${f(k[0])}" cy="${f(k[1])}" r="2.4" fill="#2c2e31"/><circle cx="${f(k[0])}" cy="${f(k[1])}" r="1" fill="#d8dcdf"/>`; }
    const tp = pt2(d0 + L - 4), tx = Math.min(166, Math.max(84, tp[0] - 6));
    const lit = x.lt;
    return svg(x, BGW(`${lg(x.id("dw"), [[0, "#7a736a"], [1, "#3e3a35"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="184" fill="${x.url("dw")}"/><rect x="8" y="8" width="184" height="26" fill="#9a948a"/><path d="M8 34H192" stroke="#000" stroke-opacity=".3"/><rect x="8" y="34" width="184" height="10" fill="${x.url("dn")}" opacity=".5"/>`) +
      `<path d="M30 34v8M70 34v8" stroke="#55595e" stroke-width="2"/>` +
      `<path d="M181 192V70A14 14 0 0 0 167 56H60" fill="none" stroke="#5a5f64" stroke-width="3"/><path d="M181 192V70A14 14 0 0 0 167 56H60" fill="none" stroke="#c4c9cd" stroke-width="1"/>` +
      (lit ? `<path d="M34 80L8 192H120L66 80Z" fill="${x.url("cone")}" opacity=".55"/>` : "") +
      BGW(`<path d="M8 160Q40 148 70 152Q96 156 112 176L118 192H8Z" fill="#3d4f63"/><path d="M8 160Q40 148 70 152Q96 156 112 176" fill="none" stroke="#9fb4c8" stroke-opacity="${lit ? .8 : .3}" stroke-width="1.4"/><path d="M20 162Q44 154 64 157" stroke="#fff" stroke-opacity="${lit ? .35 : .1}" stroke-width="3" fill="none"/>`) +
      door + kn +
      `<rect x="74" y="44" width="100" height="4.4" fill="url(#${x.u}-chr)"/><rect x="172" y="40" width="5" height="12" fill="#55595e"/>` +
      `<path d="M76 42.6H170" stroke="#1d1e20" stroke-width="1.6" stroke-dasharray="3 2" class="${x.on ? P + "belt" : ""}"/><path d="M76 49.8H170" stroke="#1d1e20" stroke-width="1.6" stroke-dasharray="3 2" class="${x.on ? P + "belt2" : ""}"/>` +
      `<rect x="${f(tx - 7)}" y="41.5" width="14" height="10" rx="2" fill="#3a3d41"/><path d="M${f(tx - 5)} 42.5h10" stroke="#fff" stroke-opacity=".3"/><path d="M${f(tx)} 51C${f(tx + 4)} 60 ${f(tp[0] - 6)} ${f(tp[1] + 2)} ${f(tp[0] - 2)} ${f(tp[1] + 4)}" fill="none" stroke="#6c7176" stroke-width="2.6"/>` +
      `<path d="${rr(22, 46, 54, 30, 7)}" fill="#000" opacity=".4" filter="${x.url("bl")}" transform="translate(2 4)"/><path d="${rr(22, 46, 54, 30, 7)}" fill="#e8e9e6"/><path d="${rr(22, 46, 54, 30, 7)}" fill="${x.url("sh")}"/><path d="M28 47.5H70" stroke="#fff" stroke-opacity=".9"/>` +
      `<path d="${rr(30, 72, 38, 8, 3)}" fill="${lit ? "#fff3cf" : "#b9bdbf"}"/>${lit ? `<ellipse class="${P}glow" cx="49" cy="78" rx="40" ry="18" fill="${x.url("lp")}"/>` : ""}<circle cx="70" cy="54" r="1.6" fill="${lit ? AMB : LEDG}"${lit ? ` class="${P}blink"` : ""}/><path d="M30 60h24M30 64h24" stroke="#000" stroke-opacity=".12"/>`);
  });
  G("keypad", "Wall keypad", [BLK, WHT, ALM, "#8d9298", BRZ], "Body", (x) => {
    const lit = x.on, X = 132, Y = 56, W = 96, Hh = 100;
    const xs = Object.assign({}, x, { c: "#ecebe6" });
    let keys = "";
    const labs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
    labs.forEach((t, i) => { const cx = 61 + (i % 3) * 11, cy = 88 + ((i / 3) | 0) * 10; keys += `<rect x="${cx - 4.4}" y="${cy - 3.6}" width="8.8" height="7.2" rx="2" fill="#000" fill-opacity=".45" transform="translate(0 .8)"/><rect x="${cx - 4.4}" y="${cy - 3.6}" width="8.8" height="7.2" rx="2" fill="#30343a"/>${lit ? `<rect x="${cx - 4.4}" y="${cy - 3.6}" width="8.8" height="7.2" rx="2" fill="#9fd8ff" opacity=".22"/>` : ""}<text x="${cx}" y="${cy + 2}" font-size="5.6" font-family="Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle" fill="${lit ? "#e8f7ff" : "#8b929a"}">${t}</text>`; });
    return svg(x, wall(x, "brick", "#7e4a39", 8, 192, 13) + eave(x, 30, "#ebe8e0") + drive(x, Y + Hh) +
      BGW(bay(xs, { X, Y, W, H: Hh, door: doorRaised(xs, W, Hh, 4, 4, false, "sec2"), car: "sedan", carCol: "#444b55", beacon: false }) + beacon(x, 116, 50)) +
      `<path d="${rr(46, 64, 44, 88, 8)}" fill="#000" opacity=".5" filter="${x.url("bl")}" transform="translate(2.5 4)"/><path d="${rr(46, 64, 44, 88, 8)}" fill="${x.url("fin")}"/><path d="${rr(46, 64, 44, 88, 8)}" fill="${x.url("sh")}"/><path d="${rr(46, 64, 44, 88, 8)}" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
      `<path d="${rr(52, 79, 32, 50, 4)}" fill="#15171a"/>${lit ? `<circle class="${P}glow" cx="68" cy="104" r="30" fill="#9fd8ff" opacity=".12"/>` : ""}${keys}` +
      `<rect x="54" y="133" width="28" height="7" rx="3" fill="#30343a"/><rect x="54" y="133" width="28" height="7" rx="3" fill="${lit ? "#9fd8ff" : "#000"}" opacity="${lit ? .25 : 0}"/>` +
      `${lit ? `<circle class="${P}blink" cx="68" cy="72" r="7" fill="${x.url("amb")}"/>` : `<circle cx="68" cy="72" r="6" fill="${x.url("lg")}" opacity=".7"/>`}<circle cx="68" cy="72" r="1.8" fill="${lit ? AMB : LEDG}"/>` +
      `<path d="M50 66H86" stroke="#fff" stroke-opacity=".35"/>` + bush(x, 20, 186, 12));
  });
  G("button", "Wall button", [WHT, ALM, BLK, "#9aa0a6", BRZ], "Body", (x) => {
    const lit = x.on, op = x.op, X = 120, Y = 40, W = 90, Hh = 140, k = x.id("dc");
    let inside = `${lg(x.id("out"), [[0, "#1a2340"], [1, "#4a4a58"]], 0, 0, 0, 1)}<rect x="${X}" y="${Y}" width="${W}" height="${Hh}" fill="${x.url("out")}"/><rect x="${X}" y="${Y + Hh - 40}" width="${W}" height="40" fill="#3c3d40"/><circle cx="160" cy="${Y + Hh - 52}" r="10" fill="${x.url("lp")}" opacity=".7"/><rect x="158.5" y="${Y + Hh - 52}" width="3" height="12" fill="#222"/>`;
    let back = `<rect width="${W}" height="${Hh}" fill="#d9dbdb"/>`;
    for (let i = 0; i < 4; i++) { const y = i * Hh / 4; back += `<rect y="${f(y)}" width="${W}" height="${f(Hh / 4)}" fill="${x.url("sec2")}"/><rect y="${f(y + Hh / 8 - 2)}" width="${W}" height="4" fill="#b8bcbe"/><path d="M0 ${f(y + Hh / 8 - 2)}H${W}" stroke="#fff" stroke-opacity=".7"/><rect x="3" y="${f(y + Hh / 8 - 5)}" width="6" height="10" rx="1" fill="#8e9396"/>`; }
    back += `<rect y="${Hh - 3}" width="${W}" height="3" fill="#151515"/>`;
    return svg(x, BGW(`${lg(x.id("dw"), [[0, "#bdb6aa"], [1, "#8d877d"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="184" fill="${x.url("dw")}"/><rect x="8" y="176" width="184" height="16" fill="#77736c"/><path d="M8 176H192" stroke="#fff" stroke-opacity=".25"/>` +
      `<clipPath id="${k}"><rect x="${X}" y="${Y}" width="${W}" height="${Hh}"/></clipPath><g clip-path="url(#${k})">${op > 0 ? inside : ""}<g transform="translate(${X} ${f(Y - op * Hh * .9)})"><g class="${P}${x.on ? "up" : "dn"}">${back}</g></g></g>` +
      `<rect x="${X - 6}" y="${Y - 6}" width="6" height="${Hh + 6}" fill="#7a6b58"/><rect x="${X - 6}" y="${Y - 6}" width="${W + 6}" height="6" fill="#7a6b58"/><path d="M${X - 6} ${Y - 6}V${Y + Hh}" stroke="#fff" stroke-opacity=".2"/>` +
      `<rect x="${X - 2}" y="${Y}" width="2.4" height="${Hh}" fill="#3a3d40"/>` +
      `<rect x="66" y="8" width="3.4" height="56" fill="url(#${x.u}-chr)"/>`) +
      `<path d="${rr(44, 62, 48, 92, 7)}" fill="#000" opacity=".45" filter="${x.url("bl")}" transform="translate(2.5 4)"/><path d="${rr(44, 62, 48, 92, 7)}" fill="${x.url("fin")}"/><path d="${rr(44, 62, 48, 92, 7)}" fill="${x.url("sh")}"/><path d="${rr(44, 62, 48, 92, 7)}" fill="none" stroke="#fff" stroke-opacity=".3"/>` +
      `${lit ? `<circle class="${P}blink" cx="68" cy="94" r="26" fill="${x.url("amb")}"/>` : ""}<circle cx="68" cy="94" r="17" fill="${lit ? AMB : "#6b6f73"}" opacity="${lit ? 1 : .5}"/><circle cx="68" cy="94" r="14.5" fill="${x.p.d}"/><circle cx="68" cy="94" r="13" fill="${x.url("fin")}"/><path d="M58 88A12 12 0 0 1 74 83" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none"/>` +
      `<path d="M62 98L68 89L74 98Z" fill="${x.p.k}" opacity=".55"/>` +
      `<path d="${rr(50, 122, 16, 22, 3)}" fill="${x.p.d}"/><path d="${rr(51, 123, 14, 20, 3)}" fill="${x.url("fin")}"/><circle cx="58" cy="131" r="3" fill="none" stroke="${lit ? "#e0a030" : x.p.k}" stroke-width="1.2"/><path d="M56.5 135h3" stroke="${x.p.k}"/>` +
      `<path d="${rr(70, 122, 16, 22, 3)}" fill="${x.p.d}"/><path d="${rr(71, 123, 14, 20, 3)}" fill="${x.url("fin")}"/><rect x="75" y="131" width="6" height="5" rx="1" fill="${x.p.k}" opacity=".7"/><path d="M76 131v-2a2 2 0 0 1 4 0v2" fill="none" stroke="${x.p.k}" stroke-opacity=".7"/>` +
      `<circle cx="86" cy="70" r="1.6" fill="${lit ? AMB : LEDG}"${lit ? ` class="${P}blink"` : ""}/>` +
      BGW(`<path d="${rr(16, 84, 18, 30, 2.5)}" fill="#ecebe6"/><path d="${rr(20, 88, 10, 22, 1.5)}" fill="#dcdad3"/><path d="M20 99h10" stroke="#000" stroke-opacity=".2"/><path d="${rr(16, 84, 18, 30, 2.5)}" fill="none" stroke="#000" stroke-opacity=".25"/>`));
  });

  const LIGHT = { id: "light", name: "Light", type: "switch" }, ct = (id, name) => ({ id, name, type: "contact" });
  const GP = { raised: 1, double: 1, carriage: 1, glass: 1, flush: 1, longpanel: 1, plank: 1, rollup: 1, tiltup: 1, opener: 1, swing: 2, garden: 2, ranch: 2, privacy: 2, iron: 2, slide: 2, slat: 3, pair: 4 };
  icons.forEach((ic) => {
    const k = GP[ic.id]; if (!k) return;
    ic.parts = k === 1 ? [ct("door", "Door"), ic.id === "opener" ? Object.assign({}, LIGHT, { name: "Opener light" }) : LIGHT] : k === 2 ? [ct("gate", "Gate")] : k === 3 ? [ct("gate", "Gate"), LIGHT]
      : [ct("d1", "Left door"), ct("d2", "Right door"), LIGHT];
  });

  const css = `
.hda-garage-up,.hda-garage-dn,.hda-garage-slo,.hda-garage-slc,.hda-garage-swo,.hda-garage-swc{transform-box:fill-box}
.hda-garage-swl{transform-origin:0 50%}.hda-garage-swr{transform-origin:100% 50%}
.hda-anim .hda-garage-up{animation:hda-garage-up 1.6s cubic-bezier(.4,0,.2,1) both}
@keyframes hda-garage-up{from{transform:translateY(16%)}to{transform:translateY(0)}}
.hda-anim .hda-garage-dn{animation:hda-garage-dn 1.3s cubic-bezier(.4,0,.2,1) both}
@keyframes hda-garage-dn{from{transform:translateY(-12%)}to{transform:translateY(0)}}
.hda-anim .hda-garage-swo{animation:hda-garage-swo 1.8s cubic-bezier(.4,0,.2,1) both}
@keyframes hda-garage-swo{from{transform:scaleX(1.3)}to{transform:scaleX(1)}}
.hda-anim .hda-garage-swc{animation:hda-garage-swc 1.4s cubic-bezier(.4,0,.2,1) both}
@keyframes hda-garage-swc{from{transform:scaleX(.8)}to{transform:scaleX(1)}}
.hda-anim .hda-garage-slo{animation:hda-garage-slo 1.8s cubic-bezier(.4,0,.2,1) both}
@keyframes hda-garage-slo{from{transform:translateX(18%)}to{transform:translateX(0)}}
.hda-anim .hda-garage-slc{animation:hda-garage-slc 1.4s cubic-bezier(.4,0,.2,1) both}
@keyframes hda-garage-slc{from{transform:translateX(-12%)}to{transform:translateX(0)}}
.hda-anim .hda-garage-blink{animation:hda-garage-blink 1s ease-in-out infinite}
@keyframes hda-garage-blink{0%,100%{opacity:1}50%{opacity:.12}}
.hda-anim .hda-garage-glow{animation:hda-garage-glow 3.6s ease-in-out infinite}
@keyframes hda-garage-glow{0%,100%{opacity:.75}50%{opacity:.5}}
.hda-anim .hda-garage-belt{animation:hda-garage-belt .5s linear infinite}
@keyframes hda-garage-belt{to{stroke-dashoffset:-5}}
.hda-anim .hda-garage-belt2{animation:hda-garage-belt2 .5s linear infinite}
@keyframes hda-garage-belt2{to{stroke-dashoffset:5}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-garage-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "garage",
    tab: "Garage doors & gates",
    group: "Outdoor",
    kind: "device",
    levelLabel: "Open",
    onWord: "Open",
    offWord: "Closed",
    intro: "Twenty garage doors, gates and openers, each on its own house front, driveway or yard. On means OPEN: doors lift (the slider sets how far) to show the lit garage and car inside, gates swing or slide back to show the drive beyond, lanterns come on and the amber warning light blinks; off means closed. The color is the door or gate finish.",
    
    css,
    icons,
  });
})();
