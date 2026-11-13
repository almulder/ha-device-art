(function () {
  const P = "hda-laundrycfg-";
  const H = () => window.HDAH;
  const WH = "#f1f2f0", SS = "#c3c8ce", BS = "#4b4f56", BK = "#26292e", SL = "#67707b", MINT = "#a5d6c2", CREAM = "#ede0bf",
    RED = "#c23a3f", NAVY = "#2e4063", CHAMP = "#c8b693", SKY = "#9ab6d8", PINK = "#f0b9c6";
  const BBK = "#35373b", DST = "#6b6f75", IVORY = "#ece4cf", BST = "#4b4d52", GRPH = "#5d6168";
  const METAL = [SS, BS, BBK, DST, BST, GRPH];
  const isM = (c) => METAL.indexOf(String(c).toLowerCase()) >= 0;
  const DISP = "#7dd3fc", GREEN = "#34d399", ORNG = "#ff9a4a", AMB = "#ffb547", REDL = "#ff5257";
  const n1 = (v) => (+v).toFixed(1);
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);
  const CT = { fill: 6, wash: 48, rinse: 18, spin: 9, dry: 52, cool: 8 };
  const mins = (o) => Math.max(1, Math.round((CT[o.cyc] || 40) * (.35 + .65 * o.level)));

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .7;
    return { l: h.shade(c, lt ? .7 : .45), m: c, d: h.shade(c, lt ? -.13 : -.28), k: h.shade(c, lt ? -.3 : -.52), e: h.shade(c, lt ? -.42 : -.45), lt };
  }
  const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".8"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const lg = (id, v, st) => `<linearGradient id="${id}" ${v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"'}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
${lg(u + "-v", 1, [[0, p.l], [.45, p.m], [1, p.d]])}${lg(u + "-c", 0, [[0, p.d], [.3, p.l], [.65, p.m], [1, p.k]])}
${lg(u + "-tp", 0, [[0, p.m], [.45, p.l], [1, p.m]])}${lg(u + "-sd", 0, [[0, p.d], [1, p.k]])}
${lg(u + "-fx", 0, [[0, "#fff", .2], [.12, "#fff", 0], [.86, "#000", 0], [1, "#000", .22]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-ms" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".2" stop-color="#fff" stop-opacity=".3"/><stop offset=".33" stop-color="#fff" stop-opacity="0"/><stop offset=".64" stop-color="#fff" stop-opacity="0"/><stop offset=".73" stop-color="#fff" stop-opacity=".16"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(u + "-edge", 0, [[0, "#000", .36], [.3, "#000", 0], [.68, "#000", 0], [1, "#000", .42]])}
${lg(u + "-dk", 1, [[0, "#0f1116"], [1, "#2a2f37"]])}${lg(u + "-blk", 1, [[0, "#2a2f37"], [.5, "#12151a"], [1, "#07080b"]])}
${lg(u + "-st", 0, [[0, "#6f767e"], [.5, "#e6e9ec"], [1, "#5a6067"]])}${lg(u + "-stv", 1, [[0, "#eef0f2"], [.5, "#9aa1a9"], [1, "#5a6067"]])}
${lg(u + "-cr", 1, [[0, "#fdfeff"], [.35, "#8f969e"], [.55, "#eceef1"], [1, "#5d636b"]])}
${lg(u + "-ring", 1, [[0, "#6b727c"], [.45, "#2c3037"], [1, "#14161a"]])}${lg(u + "-wr", 1, [[0, "#ffffff"], [.5, "#dde0e4"], [1, "#9aa1a9"]])}
${lg(u + "-wt", 1, [[0, "#9fdcff", .7], [1, "#1f63b5", .85]])}${lg(u + "-ws", 1, [[0, "#f4fbff", .95], [.5, "#cfe6f6", .9], [1, "#7fb0d8", .9]])}
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2f3ff" stop-opacity=".32"/><stop offset=".45" stop-color="#e2f3ff" stop-opacity=".03"/><stop offset="1" stop-color="#e2f3ff" stop-opacity=".14"/></linearGradient>
${lg(u + "-wood", 1, [[0, "#c8996a"], [.5, "#a87a4e"], [1, "#6a4528"]])}${lg(u + "-wall", 1, [[0, "#fff", .07], [1, "#fff", .02]])}
${lg(u + "-fl", 1, [[0, "#000", .35], [1, "#000", 0]])}${lg(u + "-cab", 0, [[0, "#4f6159"], [.4, "#6f857a"], [1, "#43534c"]])}
${lg(u + "-ctr", 1, [[0, "#f1efea"], [1, "#b9b5ad"]])}${lg(u + "-col", 1, [[0, "#ffc58a", 0], [1, "#ffc58a", .22]])}
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-drum" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#626a74"/><stop offset=".55" stop-color="#2a3038"/><stop offset="1" stop-color="#08090d"/></radialGradient>
<radialGradient id="${u}-rub"><stop offset="0" stop-color="#000"/><stop offset=".84" stop-color="#15181c"/><stop offset=".91" stop-color="#5b626b"/><stop offset="1" stop-color="#1e2126"/></radialGradient>
<radialGradient id="${u}-gls"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="${u}-warm" cx=".5" cy=".55"><stop offset="0" stop-color="#ffbe6a" stop-opacity=".85"/><stop offset=".55" stop-color="#ff8a3c" stop-opacity=".35"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-cl" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></radialGradient>
<radialGradient id="${u}-stm"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-lamp" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff4dc" stop-opacity=".55"/><stop offset="1" stop-color="#fff4dc" stop-opacity="0"/></radialGradient>
${halo(u + "-hb", DISP)}${halo(u + "-hg", GREEN)}${halo(u + "-ho", ORNG)}${halo(u + "-hr", REDL)}
<pattern id="${u}-br" width="40" height="5" patternUnits="userSpaceOnUse"><path d="M0 .5H40" stroke="#fff" stroke-opacity=".16" stroke-width=".5"/><path d="M0 2.1H40" stroke="#000" stroke-opacity=".09" stroke-width=".6"/><path d="M0 3.5H40" stroke="#fff" stroke-opacity=".08" stroke-width=".4"/><path d="M0 4.5H40" stroke="#000" stroke-opacity=".06" stroke-width=".4"/></pattern>
<pattern id="${u}-perf" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r=".75" fill="#000" fill-opacity=".55"/><circle cx="2.8" cy="2.9" r=".6" fill="#fff" fill-opacity=".1"/></pattern>
<pattern id="${u}-slot" width="6" height="4" patternUnits="userSpaceOnUse"><rect y=".4" width="6" height="1.6" fill="#fff" fill-opacity=".14"/><rect width="6" height="1.6" fill="#000" fill-opacity=".5"/></pattern>
<pattern id="${u}-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".6"/></pattern>
<pattern id="${u}-sub" width="16" height="8" patternUnits="userSpaceOnUse"><path d="M0 .4H16M0 4.4H16M8 .4V4.4M.4 4.4V8.4" stroke="#fff" stroke-opacity=".09" stroke-width=".8" fill="none"/></pattern>
<pattern id="${u}-weave" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#b88b55"/><path d="M0 1.5H6M0 4.5H6" stroke="#7a5630" stroke-width="1"/><path d="M1.5 0V3M4.5 3V6" stroke="#e1b97f" stroke-width="1.2"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, `<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath>` + (extra || ""))}<g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 6}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + r)} ${n1(y)}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2.5}" stroke-linecap="round"/>`;
  const groove = (d) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".32" stroke-width="1.1"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".5" transform="translate(0 1)"/>`;
  const wob = (o, s) => `<g class="${o.on ? P + "wob" : ""}">${s}</g>`;
  const foot = (x, y, w) => `<rect x="${x}" y="${y}" width="${w || 9}" height="3.5" rx="1.5" fill="#1d2025"/>`;

  function face(o, d, g) {
    const u = o.uid;
    return `<path d="${d}" fill="url(#${u}-${g || "v"})"/><path d="${d}" fill="url(#${u}-fx)"/>` +
      (isM(o.color) ? `<path d="${d}" fill="url(#${u}-br)"/><path d="${d}" fill="url(#${u}-ms)"/>` : `<path d="${d}" fill="url(#${u}-g)" opacity=".3"/>`);
  }
  function box3(o, x, y, w, h, dx, dy) {
    const u = o.uid, e = pal(o.color).e;
    let s = dx ? `<path d="M${x} ${y}L${x + dx} ${y - dy}H${x + w + dx}L${x + w} ${y}Z" fill="url(#${u}-tp)"/><path d="M${x + w} ${y}L${x + w + dx} ${y - dy}V${y + h - dy}L${x + w} ${y + h}Z" fill="url(#${u}-sd)"/>` : "";
    s += face(o, `M${x} ${y}H${x + w}V${y + h}H${x}Z`);
    return s + `<path d="M${x} ${y + h}H${x + w}${dx ? `L${x + w + dx} ${y + h - dy}` : ""}" fill="none" stroke="${e}" stroke-width=".8"/>` +
      `<path d="M${x} ${y + .5}H${x + w}${dx ? `L${x + w + dx} ${y - dy + .5}` : ""}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>` + (dx ? `<path d="M${x + w} ${y}V${y + h}" stroke="#fff" stroke-opacity=".2" stroke-width=".8"/>` : "");
  }

  const room = (o, fy, kind, tiles) => `<g class="hda-bg">${room0(o, fy, kind, tiles)}</g>`;
  function room0(o, fy, kind, tiles) {
    const u = o.uid, D = 200 - fy, xa = (i, y) => n1(100 + i * (20 + 30 * (y - fy) / D));
    let s = `<rect width="200" height="${fy}" fill="url(#${u}-wall)"/>` + (tiles ? `<rect width="200" height="${fy}" fill="url(#${u}-sub)"/>` : "");
    if (kind === "wood") {
      s += `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-wood)" fill-opacity=".55"/><path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-grain)" opacity=".7"/>`;
      for (let i = -7; i <= 7; i++) s += `<path d="M${xa(i * .8, fy)} ${fy}L${xa(i * .8, 200)} 200" stroke="#2b190c" stroke-opacity=".35" stroke-width=".8"/>`;
      [[-3, .3], [1, .55], [4, .2], [-1, .8]].forEach((j) => { const y = fy + D * j[1]; s += `<path d="M${xa(j[0] * .8, y)} ${n1(y)}L${xa((j[0] + 1) * .8, y)} ${n1(y)}" stroke="#2b190c" stroke-opacity=".35" stroke-width=".7"/>`; });
    } else if (kind === "conc") {
      s += `<path d="M0 ${fy}H200V200H0Z" fill="#8f949a" fill-opacity=".24"/>` + [[30, .3], [70, .6], [128, .4], [160, .75], [96, .85], [14, .7]].map((p) => `<circle cx="${p[0]}" cy="${n1(fy + D * p[1])}" r=".8" fill="#fff" fill-opacity=".15"/>`).join("") +
        `<path d="M0 ${n1(fy + D * .55)}H200" stroke="#000" stroke-opacity=".25"/>`;
    } else {
      const rows = [0, .14, .32, .56, .88, 1.3].map((t) => fy + D * t);
      s += `<path d="M0 ${fy}H200V200H0Z" fill="#b3aea5" fill-opacity="${kind === "check" ? .1 : .26}"/>`;
      if (kind === "check") for (let r = 0; r < 5; r++) for (let i = -6; i < 6; i++) { if ((r + i) & 1) continue;
        const y1 = rows[r], y2 = rows[r + 1]; s += `<path d="M${xa(i, y1)} ${n1(y1)}L${xa(i + 1, y1)} ${n1(y1)}L${xa(i + 1, y2)} ${n1(y2)}L${xa(i, y2)} ${n1(y2)}Z" fill="#f4f0e4" fill-opacity=".34"/>`; }
      else { rows.slice(1).forEach((y) => { s += `<path d="M0 ${n1(y)}H200" stroke="#000" stroke-opacity=".28" stroke-width=".8"/>`; });
        for (let i = -6; i <= 6; i++) s += `<path d="M${xa(i, fy)} ${fy}L${xa(i, 200)} 200" stroke="#000" stroke-opacity=".28" stroke-width=".8"/>`; }
    }
    return s + `<path d="M0 ${fy}H200V200H0Z" fill="url(#${u}-fl)"/><rect y="${fy - 4}" width="200" height="4" fill="#fff" fill-opacity=".1"/><path d="M0 ${fy}H200" stroke="#000" stroke-opacity=".35"/>`;
  }
  function jug(o, x, y, c) {
    const d = `M${x} ${y}V${y - 16}Q${x} ${y - 22} ${x + 6} ${y - 22}H${x + 12}V${y - 26}H${x + 16}V${y - 22}Q${x + 18} ${y - 20} ${x + 18} ${y - 16}V${y}Z`;
    return `<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#${o.uid}-edge)"/><path d="${rr(x + 3, y - 14, 12, 8, 1.5)}" fill="#fff" fill-opacity=".75"/><path d="M${x + 2} ${y - 16}Q${x + 2} ${y - 20} ${x + 6} ${y - 20}" stroke="#fff" stroke-opacity=".5" stroke-width="1.2" fill="none"/><rect x="${x + 11}" y="${y - 28}" width="6" height="3" rx="1" fill="#f2f2f2"/>`;
  }
  const towels = (o, x, y, cs) => `<g class="hda-bg">${towels0(o, x, y, cs)}</g>`;
  function towels0(o, x, y, cs) {
    return cs.map((c, i) => { const yy = y - 6 * (i + 1); return `<path d="${rr(x + i % 2, yy, 30, 6, 2.6)}" fill="${c}"/><path d="${rr(x + i % 2, yy, 30, 6, 2.6)}" fill="url(#${o.uid}-cl)"/><path d="M${x + i % 2 + 3} ${yy + 4.4}H${x + i % 2 + 27}" stroke="#000" stroke-opacity=".15" stroke-width=".6"/>`; }).join("");
  }
  const shelf = (o, x, y, w, jugs) => `<g class="hda-bg">${shelf0(o, x, y, w, jugs)}</g>`;
  function shelf0(o, x, y, w, jugs) {
    const u = o.uid;
    return `<path d="M${x + 10} ${y + 5}V${y + 14}L${x + 18} ${y + 5}Z M${x + w - 10} ${y + 5}V${y + 14}L${x + w - 18} ${y + 5}Z" fill="#1d2025"/>` +
      (jugs || "") + `<rect x="${x}" y="${y}" width="${w}" height="5" fill="url(#${u}-wood)"/><rect x="${x}" y="${y}" width="${w}" height="5" fill="url(#${u}-grain)"/><rect x="${x}" y="${y}" width="${w}" height="1.2" fill="#fff" fill-opacity=".3"/>`;
  }
  const basket = (o, x, y, w, h) => `<g class="hda-bg">${basket0(o, x, y, w, h)}</g>`;
  function basket0(o, x, y, w, h) {
    const u = o.uid, d = `M${x} ${y}H${x + w}L${x + w - 5} ${y + h}H${x + 5}Z`;
    return sh(o, x + w / 2, y + h, w * .6, 4) + `<path d="M${x + 4} ${y + 2}Q${x + 10} ${y - 12} ${x + 22} ${y - 6}Q${x + 30} ${y - 14} ${x + w - 4} ${y + 1}Z" fill="#5aa9e6"/><path d="M${x + 4} ${y + 2}Q${x + 10} ${y - 12} ${x + 22} ${y - 6}Q${x + 30} ${y - 14} ${x + w - 4} ${y + 1}Z" fill="url(#${u}-cl)"/>` +
      `<path d="M${x + 16} ${y}Q${x + 24} ${y - 9} ${x + 34} ${y}" fill="#f4f4f2"/><path d="${d}" fill="url(#${u}-weave)"/><path d="${d}" fill="url(#${u}-edge)"/>` +
      `<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="4" rx="2" fill="#c99a62"/><rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="1.3" rx=".6" fill="#fff" fill-opacity=".35"/>`;
  }

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg", E: "adefg", n: "ceg", d: "bcdeg" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.6, h * .14), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return SEG[ch].split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  const clockW = (h) => h * 2.32;
  function clock(o, x, y, h, col) {
    col = col || DISP; const w = h * .56, xc = x + w + h * .2, x1 = xc + h * .32, x2 = x1 + w + h * .22, cw = h * .13;
    const colon = (f, c) => `<g fill="${f}"${c ? ` class="${c}"` : ""}><rect x="${n1(xc)}" y="${n1(y + h * .24)}" width="${n1(cw)}" height="${n1(cw)}" rx=".3"/><rect x="${n1(xc)}" y="${n1(y + h * .64)}" width="${n1(cw)}" height="${n1(cw)}" rx=".3"/></g>`;
    let s = `<g fill="#fff" fill-opacity=".06">${dig(x, y, h, 8)}${dig(x1, y, h, 8)}${dig(x2, y, h, 8)}</g>` + colon("rgba(255,255,255,.06)");
    if (!o.on) return s;
    if (o.cyc === "done") return s + `<g fill="${col}">${dig(x, y, h, "E")}${dig(x1, y, h, "n")}${dig(x2, y, h, "d")}</g>`;
    const m = mins(o), v = String(Math.floor(m / 60)) + ("0" + (m % 60)).slice(-2);
    return s + `<g opacity=".15"><ellipse class="${P}pulse" cx="${n1(x + h * 1.16)}" cy="${n1(y + h / 2)}" rx="${n1(h * 1.9)}" ry="${n1(h * .9)}" fill="${col}"/></g>` +
      `<g fill="${col}">${dig(x, y, h, v[0])}${dig(x1, y, h, v[1])}${dig(x2, y, h, v[2])}</g>` + colon(col, P + "blink");
  }
  function screen(o, cx, cy, h, col) {
    const w = clockW(h), x = cx - w / 2;
    return `<path d="${rr(x - 3, cy - h / 2 - 2.4, w + 6, h + 4.8, 2)}" fill="#0d1014"/><path d="${rr(x - 3, cy - h / 2 - 2.4, w + 6, h + 4.8, 2)}" fill="url(#${o.uid}-gl)"/>` + clock(o, x, cy - h / 2, h, col);
  }
  function led(o, x, y, r, c, id) {
    r = r || 1.6; c = c || DISP; id = id || "hb";
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#454a52"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".25"/>`;
    return `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 4.5}" fill="url(#${o.uid}-${id})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .4)}" fill="#fff" fill-opacity=".85"/>`;
  }
  const btn = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" fill-opacity=".25"/><circle cx="${x}" cy="${n1(y - .3)}" r="${n1(r - .5)}" fill="#2a2e35"/><circle cx="${n1(x - r * .25)}" cy="${n1(y - r * .35)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".18"/>`;
  function knob(o, cx, cy, r, opt) {
    opt = opt || {}; const u = o.uid, n = opt.n || 8, act = Math.min(n - 1, Math.floor(o.level * n)), R = r + (opt.gap || r * .4 + 1.4); let s = "";
    for (let i = 0; i < n; i++) { const a = (-135 + 270 * i / (n - 1)) * Math.PI / 180, x = n1(cx + Math.sin(a) * R), y = n1(cy - Math.cos(a) * R);
      s += o.on && i === act ? `<circle cx="${x}" cy="${y}" r="3" fill="url(#${u}-hb)"/><circle cx="${x}" cy="${y}" r="${n1(Math.max(.7, r * .12))}" fill="${DISP}"/>` : `<circle cx="${x}" cy="${y}" r="${n1(Math.max(.5, r * .08))}" fill="#000" fill-opacity=".4"/>`; }
    const pa = (o.on ? -135 + 270 * act / (n - 1) : -135) * Math.PI / 180;
    return s + `<circle cx="${cx}" cy="${n1(cy + .8)}" r="${n1(r + .6)}" fill="#000" fill-opacity=".3"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}-${opt.dark ? "ring" : "cr"})"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${n1(r * .78)}" fill="url(#${u}-${opt.dark ? "blk" : "stv"})"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .78)}" fill="url(#${u}-gl)"/>` +
      `<path d="M${n1(cx + Math.sin(pa) * r * .3)} ${n1(cy - Math.cos(pa) * r * .3)}L${n1(cx + Math.sin(pa) * r * .68)} ${n1(cy - Math.cos(pa) * r * .68)}" stroke="${opt.dark ? (o.on ? DISP : "#9aa1a9") : "#2a2e35"}" stroke-width="${n1(r * .16)}" stroke-linecap="round"/>`;
  }
  function pills(o, x, y, n, gap, w) {
    let s = ""; w = w || 5;
    for (let i = 0; i < n; i++) { const xx = x + i * gap, lit = o.on && i === Math.min(n - 1, Math.floor(o.level * n));
      s += `<path d="${rr(xx, y, w, 2.6, 1.3)}" fill="#000" fill-opacity=".35"/><path d="${rr(xx + .3, y + .2, w - .6, 2, 1)}" fill="${lit ? DISP : "#3a3f47"}"/>` + (lit ? `<ellipse cx="${n1(xx + w / 2)}" cy="${n1(y + 1.3)}" rx="${n1(w)}" ry="3" fill="url(#${o.uid}-hb)"/>` : ""); }
    return s;
  }
  function drawer(o, x, y, w, h, m) {
    const u = o.uid; let s = `<path d="${rr(x, y, w, h, 2)}" fill="#000" fill-opacity=".28"/>` + face(o, rr(x + .7, y + .7, w - 1.4, h - 1.4, 1.6)) +
      `<path d="${rr(x + w * .22, y + h - 3.4, w * .56, 2.1, 1)}" fill="#000" fill-opacity=".38"/><path d="M${n1(x + 1.5)} ${n1(y + 1.2)}H${n1(x + w - 1.5)}" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>`;
    if (m === "dose") { const wx = x + w * .1, wy = y + h * .16, ww = w * .8, wh = h * .5, f = .35 + .45 * o.level;
      s += `<path d="${rr(wx, wy, ww, wh, 1.5)}" fill="#0b0e12"/>` +
        `<rect x="${n1(wx + 1)}" y="${n1(wy + wh * (1 - f))}" width="${n1(ww * .58 - 1.5)}" height="${n1(wh * f - .6)}" fill="#3f8de0" fill-opacity=".9"/>` +
        `<rect x="${n1(wx + ww * .58 + .5)}" y="${n1(wy + wh * (1 - f * .8))}" width="${n1(ww * .42 - 1.5)}" height="${n1(wh * f * .8 - .6)}" fill="#e98ab4" fill-opacity=".9"/>` +
        `<path d="M${n1(wx + ww * .58)} ${n1(wy)}V${n1(wy + wh)}" stroke="#555b63" stroke-width=".6"/><path d="${rr(wx, wy, ww, wh, 1.5)}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".25" stroke-width=".5"/>`; }
    if ((m === "lit" || m === "dose") && o.on) s += `<ellipse class="${P}pulse" cx="${n1(x + w / 2)}" cy="${n1(y + h + .5)}" rx="${n1(w * .62)}" ry="3.5" fill="url(#${u}-hb)"/><rect x="${n1(x + 1)}" y="${n1(y + h - .9)}" width="${n1(w - 2)}" height="1.1" rx=".5" fill="${DISP}"/>`;
    return s;
  }

  const CL = ["#e0566a", "#f3c75b", "#4f9fe0", "#f4f4f2", "#6cc285", "#a982d4", "#3a5f9e"];
  const SHP = ["M-9 -6L-4 -8Q0 -6 4 -8L9 -6L11 -1L6 0V8H-6V0L-11 -1Z", "M-10 -5Q0 -8 10 -5L9 6Q0 9 -9 6Z", "M-3 -8H3V2Q3 8 -3 8Q-9 8 -9 4Q-9 1 -3 1Z", "M-6 -8H6L7 8H2L0 -1L-2 8H-7Z"];
  function cloth(o, i, x, y, s, a) {
    const d = SHP[i % SHP.length];
    return `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${a}) scale(${n1(s)})"><path d="${d}" fill="${CL[i % CL.length]}"/><path d="${d}" fill="url(#${o.uid}-cl)"/></g>`;
  }
  function tumble(o, cx, cy, r, mode) {
    const s0 = r / 26, u = o.uid;
    let lift = ""; [0, 120, 240].forEach((a) => { lift += `<path transform="rotate(${a} ${cx} ${cy})" d="M${n1(cx - 3.4 * s0)} ${n1(cy + r)}L${n1(cx - 2 * s0)} ${n1(cy + r * .8)}H${n1(cx + 2 * s0)}L${n1(cx + 3.4 * s0)} ${n1(cy + r)}Z" fill="url(#${u}-stv)"/>`; });
    if (!o.on) {
      const px = [-.52, -.18, .16, .46, -.02], py = [.6, .68, .64, .56, .44], pa = [-24, 8, -6, 28, 2];
      return lift + px.map((x, i) => cloth(o, i + 1, cx + x * r, cy + py[i] * r, s0 * (.95 + (i % 2) * .15), pa[i])).join("");
    }
    const A = [0, 62, 128, 185, 240, 300], F = [.52, .28, .56, .36, .54, .16];
    const d = mode === "dry" ? dur(o, 2.4, 1.3) : dur(o, 3.4, 1.9);
    return `<g class="${P}spin" style="animation-duration:${d}s"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#000" fill-opacity="0"/>` + lift +
      `<path d="M${n1(cx - r * .78)} ${n1(cy + r * .1)}A${n1(r * .78)} ${n1(r * .78)} 0 0 1 ${n1(cx + r * .1)} ${n1(cy - r * .78)}M${n1(cx + r * .78)} ${n1(cy - r * .1)}A${n1(r * .78)} ${n1(r * .78)} 0 0 1 ${n1(cx - r * .1)} ${n1(cy + r * .78)}" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="${n1(r * .08)}" stroke-linecap="round"/>` +
      A.map((a, i) => { const t = a * Math.PI / 180; return cloth(o, i, cx + Math.cos(t) * F[i] * r, cy + Math.sin(t) * F[i] * r, s0 * (.9 + (i % 3) * .1), a + 90); }).join("") + `</g>`;
  }
  function water(o, cx, cy, r) {
    const u = o.uid, wy = cy + r * .26, x0 = cx - r - 14, q = r * .2, n = Math.ceil((2 * r + 28) / (2 * q)) + 1;
    let wave = `M${n1(x0)} ${n1(wy)}`; for (let i = 0; i < n; i++) wave += `q${n1(q / 2)} ${n1(-q * .32)} ${n1(q)} 0t${n1(q)} 0`;
    let s = `<g class="${P}slosh" style="animation-duration:${dur(o, 3, 1.4)}s"><path d="${wave}V${n1(cy + r + 4)}H${n1(x0)}Z" fill="url(#${u}-wt)"/><path d="${wave}" fill="none" stroke="#e6f6ff" stroke-opacity=".65" stroke-width="1"/>`;
    for (let i = 0; i < 7; i++) { const x = cx - r * .7 + i * r * .23, rr2 = r * (.05 + (i % 3) * .025); s += `<circle cx="${n1(x)}" cy="${n1(wy - rr2 * .4)}" r="${n1(rr2)}" fill="#fff" fill-opacity=".6"/>`; }
    s += `</g>`;
    const k = Math.round(3 + 4 * o.level);
    for (let i = 0; i < k; i++) { const x = cx - r * .55 + (i * 37 % 100) / 100 * r * 1.1, b = r * (.04 + (i % 3) * .02);
      s += `<circle class="${P}suds" cx="${n1(x)}" cy="${n1(wy + r * .3)}" r="${n1(b)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".6" style="animation-delay:-${(i * .37).toFixed(2)}s"/>`; }
    return s;
  }
  function door(o, k, cx, cy, R, opt) {
    opt = opt || {}; const u = o.uid, t = opt.t || "wash", gr = R * (opt.win || .74), id = `${u}-dr${k}`, on = o.on,
      wet = t === "wash" || (t === "combo" && o.level >= .5), dry = t === "dry" || (t === "combo" && !wet), ring = opt.ring || "chrome";
    let s = `<circle cx="${cx}" cy="${n1(cy + R * .07)}" r="${n1(R + 1.2)}" fill="#000" fill-opacity=".34"/>`;
    if (ring === "chrome") s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}-cr)"/><circle cx="${cx}" cy="${cy}" r="${n1(R * .93)}" fill="url(#${u}-stv)"/>`;
    else if (ring === "body") s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}-c)"/>` + (isM(o.color) ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}-ms)"/>` : `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}-g)" opacity=".35"/>`);
    else s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${u}-${ring === "white" ? "wr" : "ring"})"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${n1(R * .955)}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width=".8"/>`;
    if (opt.win) s += `<circle cx="${cx}" cy="${cy}" r="${n1(gr + 2.4)}" fill="url(#${u}-cr)"/>`;
    else s += `<circle cx="${cx}" cy="${cy}" r="${n1(R * .86)}" fill="url(#${u}-rub)"/>`;
    s += `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${n1(gr)}"/></clipPath><g clip-path="url(#${id})"><circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="url(#${u}-drum)"/><circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="url(#${u}-perf)"/>`;
    s += drum(o, cx, cy, gr);
    s += `</g><circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="url(#${u}-gls)"/>` + (opt.tint || (o.kind === "combo" && /dry|cool/.test(o.cyc)) ? `<circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="#1b130c" fill-opacity=".22"/>` : "") + (opt.smoke ? `<circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="#0a0c10" fill-opacity=".28"/>` : "") + `<circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="url(#${u}-gl)"/>` +
      `<path d="M${n1(cx - gr * .72)} ${n1(cy + gr * .05)}A${n1(gr * .74)} ${n1(gr * .74)} 0 0 1 ${n1(cx - gr * .05)} ${n1(cy - gr * .72)}" fill="none" stroke="#fff" stroke-opacity="${on ? .26 : .5}" stroke-width="${n1(gr * .09)}" stroke-linecap="round"/>` +
      (on ? "" : `<path d="M${n1(cx + gr * .22)} ${n1(cy + gr * .6)}L${n1(cx + gr * .6)} ${n1(cy + gr * .22)}" stroke="#fff" stroke-opacity=".2" stroke-width="${n1(gr * .07)}" stroke-linecap="round"/>`) +
      `<circle cx="${cx}" cy="${cy}" r="${n1(gr)}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width=".7"/>`;
    if (opt.handle !== false) s += `<path d="${rr(cx + R * .8, cy - R * .26, R * .13, R * .52, R * .06)}" fill="#000" fill-opacity=".4"/><path d="M${n1(cx + R * .86)} ${n1(cy - R * .22)}V${n1(cy + R * .22)}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
    return s;
  }
  function ledRing(o, cx, cy, r) {
    const c = 2 * Math.PI * r, p = .12 + .82 * (1 - o.level);
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="2.6"/>`;
    if (!o.on) return s;
    return s + `<circle class="${P}pulse" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${DISP}" stroke-opacity=".25" stroke-width="7" stroke-dasharray="${n1(c * p)} ${n1(c)}" transform="rotate(-90 ${cx} ${cy})"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${DISP}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="${n1(c * p)} ${n1(c)}" transform="rotate(-90 ${cx} ${cy})"/>`;
  }

  function fl(o, k, x, y, w, h, opt) {
    opt = opt || {}; const u = o.uid, t = opt.t || "wash", dx = opt.dx == null ? Math.round(w * .09) : opt.dx, dy = Math.round(dx * .7);
    const ch = opt.ch || Math.round(Math.min(26, h * .17)), kick = opt.kick == null ? Math.round(h * .07) : opt.kick, cy = y + ch / 2, dh = Math.max(4.4, ch * .34), kr = Math.max(3.4, ch * .27);
    let s = box3(o, x, y, w, h, dx, dy);
    if (opt.glass) s += `<path d="${rr(x + 3, y + 3, w - 6, ch - 5, 2.5)}" fill="url(#${u}-blk)"/><path d="${rr(x + 3, y + 3, w - 6, ch - 5, 2.5)}" fill="url(#${u}-gl)"/>` +
      clock(o, x + w / 2 - clockW(dh) / 2, cy - dh / 2 - 1, dh) + pills(o, x + w * .1, cy - 2.3, 3, 7) + pills(o, x + w * .68, cy - 2.3, 3, 7) +
      `<path d="M${x + 6} ${y + 4.4}H${x + w - 6}" stroke="#fff" stroke-opacity=".25" stroke-width=".6"/>`;
    else if (t === "dry") {
      s += opt.hp ? hpTank(o, x + w * .06, y + ch * .18, w * .3, ch * .64) : knob(o, x + w * .15, cy, kr);
      s += screen(o, x + w * (opt.hp ? .58 : .5), cy, dh, opt.hp ? DISP : AMB) + (opt.hp ? knob(o, x + w * .87, cy, kr * .85, { n: 6 }) : pills(o, x + w * .7, cy - 1.3, 3, w * .075, w * .055));
    } else {
      s += drawer(o, x + w * .06, y + ch * .2, w * (opt.dose ? .34 : .27), ch * .6, opt.dose ? "dose" : opt.lit ? "lit" : "");
      s += screen(o, x + w * (opt.dose ? .6 : .585), cy, dh) + knob(o, x + w * .86, cy, kr);
    }
    s += groove(`M${x} ${y + ch}H${x + w}`);
    const ay = y + ch, ah = h - ch - kick, R = Math.min(w * .36, ah * .43) * (opt.R || 1), dcx = x + w / 2, dcy = ay + ah / 2;
    if (opt.led) s += ledRing(o, dcx, dcy, R + 3.4);
    s += door(o, k, dcx, dcy, R, { t, ring: opt.ring, tint: t === "dry", mild: opt.hp });
    if (kick) {
      s += groove(`M${x} ${y + h - kick}H${x + w}`) + `<path d="${rr(x + w * .07, y + h - kick + kick * .2, w * .15, kick * .6, 1.4)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
      if (opt.hp) s += `<path d="${rr(x + w * .3, y + h - kick + kick * .22, w * .62, kick * .56, 1.4)}" fill="#000" fill-opacity=".18"/><path d="${rr(x + w * .3, y + h - kick + kick * .22, w * .62, kick * .56, 1.4)}" fill="url(#${u}-slot)"/>`;
    }
    return s + hl(x + 2.4, y + 3, x + 2.4, y + h - 3, 1.5, .3);
  }
  function hpTank(o, x, y, w, h) {
    const u = o.uid, f = o.on ? .3 + .5 * (1 - o.level) : .25, wx = x + w * .55, ww = w * .36, wy = y + h * .18, wh = h * .64;
    return drawer(o, x, y, w, h, "") + `<path d="${rr(wx, wy, ww, wh, 1.2)}" fill="#0b141c"/><rect class="${o.on ? P + "rise" : ""}" x="${n1(wx + .6)}" y="${n1(wy + wh * (1 - f))}" width="${n1(ww - 1.2)}" height="${n1(wh * f - .5)}" fill="url(#${u}-wt)"/><path d="${rr(wx, wy, ww, wh, 1.2)}" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".3" stroke-width=".4"/>`;
  }

  function tub(o, k, cx, cy, rx, ry, opt) {
    opt = opt || {}; const u = o.uid, id = `${u}-tb${k}`, sc = (ry / rx).toFixed(3), on = o.on, by = cy + ry * .12;
    let s = `<clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath><g clip-path="url(#${id})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}-drum)"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}-perf)"/>` +
      `<ellipse cx="${cx}" cy="${n1(cy - ry * .25)}" rx="${n1(rx * 1.02)}" ry="${n1(ry * .8)}" fill="#000" fill-opacity=".3"/>`;
    s += `<g transform="translate(${cx} ${n1(by)}) scale(1 ${sc})">`;
    if (on && !opt.basket) s += `<circle r="${n1(rx * .9)}" fill="url(#${u}-wt)" opacity=".75"/>`;
    s += `<g class="${on ? P + "spin" : ""}" style="animation-duration:${opt.basket ? dur(o, 1.2, .8) : dur(o, 4.4, 2.6)}s"><circle r="${n1(rx * .92)}" fill="#000" fill-opacity="0"/>`;
    if (opt.imp) { s += `<circle r="${n1(rx * .46)}" fill="url(#${u}-stv)"/>`; for (let i = 0; i < 6; i++) { const a = i * 60; s += `<path transform="rotate(${a})" d="M0 -${n1(rx * .1)}Q${n1(rx * .12)} -${n1(rx * .28)} 0 -${n1(rx * .44)}" fill="none" stroke="#5a6067" stroke-width="${n1(rx * .05)}" stroke-linecap="round"/>`; } s += `<circle r="${n1(rx * .1)}" fill="url(#${u}-cr)"/>`; }
    if (opt.agit) s += `<circle r="${n1(rx * .3)}" fill="url(#${u}-wr)"/>` + [0, 60, 120, 180, 240, 300].map((a) => `<path transform="rotate(${a})" d="M0 -${n1(rx * .1)}V-${n1(rx * .3)}" stroke="#8b929b" stroke-width="${n1(rx * .05)}"/>`).join("");
    if (opt.basket) for (let i = 0; i < 16; i++) s += `<path transform="rotate(${i * 22.5})" d="M0 -${n1(rx * .5)}V-${n1(rx * .86)}" stroke="#d8dde2" stroke-opacity="${i % 2 ? .25 : .55}" stroke-width="${n1(rx * .07)}"/>`;
    else { [0, 70, 140, 205, 280].forEach((a, i) => { const t = a * Math.PI / 180, f = opt.agit || opt.imp ? .62 : .5; s += cloth(o, i + 2, Math.cos(t) * rx * f, Math.sin(t) * rx * f, rx / 30, a + 90); });
      if (on) { s += `<path d="M-${n1(rx * .75)} 0A${n1(rx * .75)} ${n1(rx * .75)} 0 0 1 0 -${n1(rx * .75)}M${n1(rx * .75)} 0A${n1(rx * .75)} ${n1(rx * .75)} 0 0 1 0 ${n1(rx * .75)}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="${n1(rx * .05)}" stroke-linecap="round"/>`;
        for (let i = 0; i < 9; i++) { const a = i * 40 * Math.PI / 180, d = rx * (.38 + (i % 3) * .15); s += `<circle cx="${n1(Math.cos(a) * d)}" cy="${n1(Math.sin(a) * d)}" r="${n1(rx * (.03 + (i % 2) * .025))}" fill="#fff" fill-opacity=".7"/>`; } } }
    s += `</g></g>`;
    if (opt.agit) { const top = by - rx * .5, w2 = rx * .085;
      s += `<g class="${on ? P + "twist" : ""}"><path d="M${n1(cx - w2)} ${n1(by)}V${n1(top)}H${n1(cx + w2)}V${n1(by)}Z" fill="url(#${u}-wr)"/>` + [.25, .5, .75].map((f) => `<path d="M${n1(cx - w2)} ${n1(by - (by - top) * f)}H${n1(cx + w2)}" stroke="#8b929b" stroke-width=".8"/>`).join("") +
        `<ellipse cx="${cx}" cy="${n1(top)}" rx="${n1(w2 * 1.6)}" ry="${n1(w2 * .7)}" fill="#f4f6f8" stroke="#9aa1a9" stroke-width=".5"/></g>`; }
    return s + `</g><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.2"/>`;
  }
  const glassLid = (o, d, tint) => `<path d="${d}" fill="${tint || "#16212b"}" fill-opacity=".35"/><path d="${d}" fill="url(#${o.uid}-gl)"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".9"/>`;

  function steam(o, pts, s) {
    if (!o.on) return ""; const d = dur(o, 4.2, 1.6);
    return pts.map((p, i) => `<circle class="${P}puff" cx="${p[0]}" cy="${p[1]}" r="${s || 7}" fill="url(#${o.uid}-stm)" style="animation-duration:${d}s;animation-delay:-${(i * d / pts.length).toFixed(2)}s"/>`).join("");
  }
  function chase(o, pts, c, r) {
    if (!o.on) return ""; const d = dur(o, 2.6, 1.4);
    return pts.map((p, i) => `<circle class="${P}chase" cx="${p[0]}" cy="${p[1]}" r="${r || 1.6}" fill="${c}" style="animation-duration:${d}s;animation-delay:-${(i / pts.length * d).toFixed(2)}s"/>`).join("");
  }
  function hose(d, c, w, ribs) {
    return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="${w + 2}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
      (ribs ? `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="${w}" stroke-dasharray="1 1.6"/>` : "") +
      `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="${n1(w * .28)}" stroke-linecap="round"/>`;
  }
  function shirt(o, x, y, c, s) {
    s = s || 1; const d = `M${x - 14 * s} ${y}L${x - 21 * s} ${y + 7 * s}L${x - 17 * s} ${y + 12 * s}L${x - 12 * s} ${y + 8 * s}V${y + 34 * s}H${x + 12 * s}V${y + 8 * s}L${x + 17 * s} ${y + 12 * s}L${x + 21 * s} ${y + 7 * s}L${x + 14 * s} ${y}Q${x} ${y + 6 * s} ${x - 14 * s} ${y}Z`;
    return `<path d="M${x} ${y - 3 * s}Q${x} ${y - 8 * s} ${x + 3 * s} ${y - 7 * s}M${x} ${y - 3 * s}L${x - 14 * s} ${y}H${x + 14 * s}Z" fill="none" stroke="url(#${o.uid}-st)" stroke-width="1.2"/><path d="${d}" fill="${c}"/><path d="${d}" fill="url(#${o.uid}-edge)"/><path d="M${x} ${y + 4 * s}V${y + 34 * s}" stroke="#000" stroke-opacity=".18"/>`;
  }

  const css = `
.hda-laundrycfg-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-spin{animation:hda-laundrycfg-spin 3s linear infinite}
@keyframes hda-laundrycfg-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-laundrycfg-slosh{animation:hda-laundrycfg-slosh 2.4s ease-in-out infinite}
@keyframes hda-laundrycfg-slosh{0%,100%{transform:translate(-5px,0)}50%{transform:translate(5px,-1.5px)}}
.hda-laundrycfg-suds{opacity:0}
.hda-anim .hda-laundrycfg-suds{animation:hda-laundrycfg-suds 2.2s ease-out infinite}
@keyframes hda-laundrycfg-suds{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-14px);opacity:0}}
.hda-anim .hda-laundrycfg-pulse{animation:hda-laundrycfg-pulse 3s ease-in-out infinite}
@keyframes hda-laundrycfg-pulse{50%{opacity:.5}}
.hda-anim .hda-laundrycfg-blink{animation:hda-laundrycfg-blink 1s steps(1,end) infinite}
@keyframes hda-laundrycfg-blink{0%,49%{opacity:1}50%,100%{opacity:.15}}

@keyframes hda-laundrycfg-wob{0%,100%{transform:translate(0,0)}25%{transform:translate(.45px,-.3px)}50%{transform:translate(-.35px,.25px)}75%{transform:translate(.3px,.35px)}}
.hda-laundrycfg-puff{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-puff{animation:hda-laundrycfg-puff 3.4s ease-out infinite}
@keyframes hda-laundrycfg-puff{0%{transform:translateY(6px) scale(.5);opacity:0}30%{opacity:.85}100%{transform:translateY(-26px) scale(1.7);opacity:0}}
.hda-laundrycfg-chase{opacity:.3}
.hda-anim .hda-laundrycfg-chase{animation:hda-laundrycfg-chase 2s linear infinite}
@keyframes hda-laundrycfg-chase{0%,100%{opacity:.12}15%{opacity:.95}40%{opacity:.12}}
.hda-laundrycfg-sway{transform-box:fill-box;transform-origin:50% 0}
.hda-anim .hda-laundrycfg-sway{animation:hda-laundrycfg-sway 4s ease-in-out infinite}
@keyframes hda-laundrycfg-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
.hda-laundrycfg-twist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-twist{animation:hda-laundrycfg-twist .9s ease-in-out infinite}
@keyframes hda-laundrycfg-twist{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.7)}}
.hda-anim .hda-laundrycfg-flow{animation:hda-laundrycfg-flow .6s linear infinite}
@keyframes hda-laundrycfg-flow{to{stroke-dashoffset:-12}}
.hda-laundrycfg-ripple{opacity:0;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-ripple{animation:hda-laundrycfg-ripple 1.6s ease-out infinite}
@keyframes hda-laundrycfg-ripple{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1.4);opacity:0}}
.hda-laundrycfg-rise{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-laundrycfg-rise{animation:hda-laundrycfg-rise 20s linear infinite}
@keyframes hda-laundrycfg-rise{0%{transform:scaleY(.85)}92%{transform:scaleY(1.05)}100%{transform:scaleY(.85)}}
.hda-anim .hda-laundrycfg-shim{animation:hda-laundrycfg-shim 1.4s ease-in-out infinite}
@keyframes hda-laundrycfg-shim{0%,100%{transform:translateX(-4px);opacity:.3}50%{transform:translateX(4px);opacity:.85}}
.hda-laundrycfg-rock{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-rock{animation:hda-laundrycfg-rock 2s ease-in-out infinite}
@keyframes hda-laundrycfg-rock{0%,100%{transform:rotate(-38deg)}50%{transform:rotate(38deg)}}
.hda-laundrycfg-rockT,.hda-laundrycfg-rockS{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-rockT{animation:hda-laundrycfg-rockT 1.4s ease-in-out infinite}
@keyframes hda-laundrycfg-rockT{0%,100%{transform:rotate(-30deg)}50%{transform:rotate(30deg)}}
.hda-anim .hda-laundrycfg-rockS{animation:hda-laundrycfg-rockT 1.1s ease-in-out infinite}
.hda-anim .hda-laundrycfg-fill{animation:hda-laundrycfg-fill 7s ease-out infinite}
@keyframes hda-laundrycfg-fill{0%{transform:translateY(14px)}85%,100%{transform:translateY(0)}}
.hda-laundrycfg-swell{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-laundrycfg-swell{animation:hda-laundrycfg-swell 7s ease-out infinite}
@keyframes hda-laundrycfg-swell{0%{transform:scale(.4)}85%,100%{transform:scale(1)}}

@media (prefers-reduced-motion:reduce){.hda-anim .hda-laundrycfg-rock,.hda-anim .hda-laundrycfg-rockT,.hda-anim .hda-laundrycfg-rockS,.hda-anim .hda-laundrycfg-fill,.hda-anim .hda-laundrycfg-swell,.hda-anim .hda-laundrycfg-wobS,.hda-anim .hda-laundrycfg-spin,.hda-anim .hda-laundrycfg-slosh,.hda-anim .hda-laundrycfg-suds,.hda-anim .hda-laundrycfg-pulse,.hda-anim .hda-laundrycfg-blink,.hda-anim .hda-laundrycfg-wob,.hda-anim .hda-laundrycfg-puff,.hda-anim .hda-laundrycfg-chase,.hda-anim .hda-laundrycfg-sway,.hda-anim .hda-laundrycfg-twist,.hda-anim .hda-laundrycfg-flow,.hda-anim .hda-laundrycfg-ripple,.hda-anim .hda-laundrycfg-rise,.hda-anim .hda-laundrycfg-shim{animation:none!important}}
`;

  const WCY = [["wash", "Wash"], ["fill", "Fill"], ["rinse", "Rinse"], ["spin", "Spin"], ["done", "Done"]];
  const DCY = [["dry", "Dry"], ["cool", "Cool down"], ["done", "Done"]];
  const CCY = [["wash", "Wash"], ["fill", "Fill"], ["rinse", "Rinse"], ["spin", "Spin"], ["dry", "Dry"], ["cool", "Cool down"], ["done", "Done"]];
  function M(o, part, opt, kind) {
    const on = !!o.on && (!part || !o.parts || o.parts[part] !== false);
    const cyc = (o.opt && o.opt[opt]) || (kind === "dry" ? "dry" : "wash");
    return Object.assign({}, o, { on, cyc, kind, run: on && cyc !== "done" });
  }
  const wob2 = (m, s) => `<g class="${m.run ? P + (m.cyc === "spin" ? "wobS" : "wob") : ""}">${s}</g>`;
  const tstr = (o) => { const m = mins(o); return Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2); };
  function tclock(x, y, h, str) {
    let s = "", xx = x; const w = h * .56;
    for (const ch of str) { if (ch === ":") { s += `<rect x="${n1(xx)}" y="${n1(y + h * .25)}" width="${n1(h * .13)}" height="${n1(h * .13)}"/><rect x="${n1(xx)}" y="${n1(y + h * .65)}" width="${n1(h * .13)}" height="${n1(h * .13)}"/>`; xx += h * .32; }
      else { s += dig(xx, y, h, ch); xx += w + h * .2; } }
    return s;
  }
  function icon(c, x, y, r, col, sw) {
    sw = sw || r * .22; const st = `fill="none" stroke="${col}" stroke-width="${n1(sw)}" stroke-linecap="round" stroke-linejoin="round"`;
    const drop = (dx, dy, k) => `<path d="M${n1(x + dx)} ${n1(y + dy - r * k)}C${n1(x + dx + r * .55 * k)} ${n1(y + dy - r * .1 * k)} ${n1(x + dx + r * .55 * k)} ${n1(y + dy + r * .7 * k)} ${n1(x + dx)} ${n1(y + dy + r * .7 * k)}C${n1(x + dx - r * .55 * k)} ${n1(y + dy + r * .7 * k)} ${n1(x + dx - r * .55 * k)} ${n1(y + dy - r * .1 * k)} ${n1(x + dx)} ${n1(y + dy - r * k)}Z" ${st}/>`;
    switch (c) {
      case "wash": return `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" ${st}/><path d="M${n1(x - r * .6)} ${n1(y + r * .15)}q${n1(r * .3)} ${n1(-r * .25)} ${n1(r * .6)} 0t${n1(r * .6)} 0" ${st}/>`;
      case "fill": return drop(0, r * .1, .95);
      case "rinse": return drop(-r * .45, r * .15, .6) + drop(r * .45, r * .15, .6);
      case "spin": return `<path d="M${n1(x + r)} ${n1(y)}A${n1(r)} ${n1(r)} 0 1 1 ${n1(x)} ${n1(y - r)}" ${st}/><path d="M${n1(x - r * .35)} ${n1(y - r * 1.3)}L${n1(x)} ${n1(y - r)}L${n1(x - r * .35)} ${n1(y - r * .65)}" ${st}/>`;
      case "dry": return [-.5, 0, .5].map((d) => `<path d="M${n1(x + r * d)} ${n1(y + r)}q${n1(r * .3)} ${n1(-r * .5)} 0 ${n1(-r)}t0 ${n1(-r)}" ${st}/>`).join("");
      case "cool": return [0, 60, 120].map((a) => `<path transform="rotate(${a} ${n1(x)} ${n1(y)})" d="M${n1(x)} ${n1(y - r)}V${n1(y + r)}" ${st}/>`).join("");
      default: return `<path d="M${n1(x - r * .7)} ${n1(y)}L${n1(x - r * .15)} ${n1(y + r * .55)}L${n1(x + r * .8)} ${n1(y - r * .6)}" ${st}/>`;
    }
  }
  const WST = ["wash", "rinse", "spin", "done"], DSTG = ["dry", "cool", "done"], CST = ["wash", "rinse", "spin", "dry", "done"];
  function stages(o, x, y, gap, list, r) {
    r = r || 2; const cur = o.cyc === "fill" ? "wash" : o.cyc;
    return list.map((c, i) => { const lit = o.on && c === cur, xx = x + i * gap;
      return (lit ? `<circle class="${P}pulse" cx="${n1(xx)}" cy="${n1(y)}" r="${n1(r * 2.4)}" fill="url(#${o.uid}-hb)"/>` : "") + icon(c, xx, y, r, lit ? "#bfe9ff" : "#000", r * .34) + (lit ? "" : icon(c, xx, y + .5, r, "#fff", r * .2).replace(/stroke="#fff"/g, 'stroke="#fff" stroke-opacity=".12"')); }).join("");
  }
  function ui(o, x, y, w, h, ac) {
    ac = ac || "#73c2ff"; const u = o.uid;
    let s = `<path d="${rr(x - .6, y - .6, w + 1.2, h + 1.2, Math.min(3, h * .2))}" fill="#050608"/><path d="${rr(x, y, w, h, Math.min(2.6, h * .18))}" fill="url(#${u}-blk)"/>`;
    if (o.on) {
      const ix = x + h * .5, iy = y + h * .46, ir = h * .26, th = h * .36, prog = o.cyc === "done" ? 1 : .2 + .7 * (1 - o.level);
      s += `<path d="${rr(x + .8, y + .8, w - 1.6, h - 1.6, 2)}" fill="${ac}" fill-opacity=".1"/><circle cx="${n1(ix)}" cy="${n1(iy)}" r="${n1(ir * 1.55)}" fill="${ac}" fill-opacity=".22"/>` +
        icon(o.cyc, ix, iy, ir, "#eaf6ff", ir * .28) +
        (o.cyc === "done" ? `<g fill="#eaf6ff">${dig(x + h * 1.05, y + h * .18, th, "E")}${dig(x + h * 1.05 + th * .76, y + h * .18, th, "n")}${dig(x + h * 1.05 + th * 1.52, y + h * .18, th, "d")}</g>`
          : `<g fill="#eaf6ff">${tclock(x + h * 1.05, y + h * .18, th, tstr(o))}</g>`) +
        `<rect x="${n1(x + h * 1.05)}" y="${n1(y + h * .72)}" width="${n1(w - h * 1.05 - 2)}" height="${n1(h * .08)}" rx=".4" fill="#fff" fill-opacity=".16"/><rect x="${n1(x + h * 1.05)}" y="${n1(y + h * .72)}" width="${n1((w - h * 1.05 - 2) * prog)}" height="${n1(h * .08)}" rx=".4" fill="${ac}"/>` +
        `<g opacity=".18"><ellipse class="${P}pulse" cx="${n1(x + w / 2)}" cy="${n1(y + h / 2)}" rx="${n1(w * .7)}" ry="${n1(h)}" fill="${ac}"/></g>`;
    }
    return s + `<path d="M${n1(x + 1)} ${n1(y + 1)}H${n1(x + w * .42)}L${n1(x + w * .28)} ${n1(y + h - 1)}H${n1(x + 1)}Z" fill="#fff" fill-opacity=".05"/>`;
  }

  function lifters(o, cx, cy, r) {
    const s0 = r / 26, u = o.uid; let s = "";
    [0, 120, 240].forEach((a) => { s += `<path transform="rotate(${a} ${cx} ${cy})" d="M${n1(cx - 3.4 * s0)} ${n1(cy + r)}L${n1(cx - 2 * s0)} ${n1(cy + r * .8)}H${n1(cx + 2 * s0)}L${n1(cx + 3.4 * s0)} ${n1(cy + r)}Z" fill="url(#${u}-stv)"/>`; });
    return s;
  }
  function settled(o, cx, cy, r) {
    const s0 = r / 26, px = [-.52, -.18, .16, .46, -.02], py = [.6, .68, .64, .56, .44], pa = [-24, 8, -6, 28, 2];
    return px.map((x, i) => cloth(o, i + 1, cx + x * r, cy + py[i] * r, s0 * (.95 + (i % 2) * .15), pa[i])).join("");
  }
  const ghost = (cx, cy, r) => `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="#000" fill-opacity="0"/>`;
  function tumbling(o, cx, cy, r, d) {
    const s0 = r / 26, A = [0, 62, 128, 185, 240, 300], F = [.52, .28, .56, .36, .54, .16];
    return `<g class="${P}spin" style="animation-duration:${d}s">${ghost(cx, cy, r)}${lifters(o, cx, cy, r)}` +
      A.map((a, i) => { const t = a * Math.PI / 180; return cloth(o, i, cx + Math.cos(t) * F[i] * r, cy + Math.sin(t) * F[i] * r, s0 * (.9 + (i % 3) * .1), a + 90); }).join("") + `</g>`;
  }
  function waveD(cx, r, wy) { const q = r * .2, x0 = cx - r - 14, n = Math.ceil((2 * r + 28) / (2 * q)) + 1; let d = `M${n1(x0)} ${n1(wy)}`; for (let i = 0; i < n; i++) d += `q${n1(q / 2)} ${n1(-q * .32)} ${n1(q)} 0t${n1(q)} 0`; return d; }
  function waterBody(o, cx, cy, r, c) {
    const u = o.uid, wy = cy + r * (c === "wash" ? .02 : c === "rinse" ? .1 : .2), w = waveD(cx, r, wy), x0 = cx - r - 14;
    let s = `<g class="${P}slosh" style="animation-duration:${dur(o, 3, 1.4)}s"><path d="${w}V${n1(cy + r + 4)}H${n1(x0)}Z" fill="url(#${u}-${c === "wash" ? "ws" : "wt"})" opacity="${c === "wash" ? .93 : .55}"/><path d="${w}" fill="none" stroke="#e6f6ff" stroke-opacity=".8" stroke-width="${n1(Math.max(.7, r * .04))}"/>`;
    if (c === "wash") for (let i = 0; i < 12; i++) { const b = r * (.1 + (i % 3) * .04); s += `<circle cx="${n1(cx - r * 1.05 + i * r * .19)}" cy="${n1(wy - b * .25 - (i % 2) * r * .05)}" r="${n1(b)}" fill="#fff" fill-opacity=".95"/><circle cx="${n1(cx - r * 1.05 + i * r * .19 - b * .3)}" cy="${n1(wy - b * .5)}" r="${n1(b * .35)}" fill="#fff"/>`; }
    s += `</g>`;
    const k = c === "wash" ? 7 : c === "rinse" ? 4 : 0;
    for (let i = 0; i < k; i++) { const x = cx - r * .6 + (i * 37 % 100) / 100 * r * 1.2, b = r * (.035 + (i % 3) * .02);
      s += `<circle class="${P}suds" cx="${n1(x)}" cy="${n1(wy + r * .45)}" r="${n1(b)}" fill="${c === "wash" ? "#fff" : "none"}" fill-opacity=".6" stroke="#fff" stroke-opacity=".75" stroke-width=".5" style="animation-delay:-${(i * .37).toFixed(2)}s"/>`; }
    if (c === "fill") s += `<path class="${P}flow" d="M${n1(cx - r * .35)} ${n1(cy - r)}Q${n1(cx - r * .2)} ${n1(cy - r * .4)} ${n1(cx - r * .3)} ${n1(wy)}" fill="none" stroke="#cdeeff" stroke-opacity=".85" stroke-width="${n1(r * .09)}" stroke-dasharray="3 2.4" stroke-linecap="round"/>`;
    return s;
  }
  function spinRing(o, cx, cy, r) {
    const rr2 = r * .8, sw = r * .26, C = 2 * Math.PI * rr2; let ring = "";
    [[0, .17], [.2, .12], [.35, .19], [.58, .13], [.75, .18]].forEach((g, i) => { ring += `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(rr2)}" fill="none" stroke="${CL[i]}" stroke-width="${n1(sw)}" stroke-dasharray="${n1(C * g[1])} ${n1(C)}" stroke-dashoffset="${n1(-C * g[0])}"/>`; });
    return `<g class="${P}spin" style="animation-duration:${(.6 - .32 * o.level).toFixed(2)}s">${ghost(cx, cy, r)}<g opacity=".16" transform="rotate(-30 ${n1(cx)} ${n1(cy)})">${ring}</g><g opacity=".38" transform="rotate(-15 ${n1(cx)} ${n1(cy)})">${ring}</g>${ring}` +
      `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(rr2)}" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="${n1(sw)}"/></g>` +
      `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * .5)}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="${n1(r * .04)}" stroke-dasharray="${n1(r * .25)} ${n1(r * .18)}"/><circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * .32)}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="${n1(r * .03)}" stroke-dasharray="${n1(r * .16)} ${n1(r * .14)}"/>`;
  }
  function drum(o, cx, cy, r) {
    const c = o.on ? o.cyc : "off", u = o.uid;
    if (c === "off" || c === "done") return lifters(o, cx, cy, r) + settled(o, cx, cy, r);
    if (c === "fill") return lifters(o, cx, cy, r) + settled(o, cx, cy, r) + `<g class="${P}fill" style="animation-duration:${dur(o, 8, 4)}s">${waterBody(o, cx, cy, r, "fill")}</g>`;
    if (c === "wash" || c === "rinse") return `<g class="${P}rock" style="animation-duration:${dur(o, 2.6, 1.2)}s">${ghost(cx, cy, r)}${lifters(o, cx, cy, r)}${settled(o, cx, cy - r * .14, r)}</g>` + waterBody(o, cx, cy, r, c);
    if (c === "spin") return spinRing(o, cx, cy, r);
    const dry = c === "dry";
    return (dry ? `<g opacity="${(.7 + .3 * o.level).toFixed(2)}"><circle class="${P}pulse" cx="${cx}" cy="${cy}" r="${n1(r * 1.1)}" fill="url(#${u}-warm)"/></g>` : "") +
      tumbling(o, cx, cy, r, dry ? dur(o, 2.4, 1.3) : dur(o, 4.6, 2.2)) + `<circle cx="${cx}" cy="${cy}" r="${n1(r)}" fill="${dry ? ORNG : "#a9dcff"}" opacity="${dry ? .12 : .1}"/>`;
  }
  function tub2(o, k, cx, cy, rx, ry, opt) {
    opt = opt || {}; const u = o.uid, id = `${u}-tb${k}`, sc = (ry / rx).toFixed(3), c = o.on ? o.cyc : "off", by = cy + ry * .12;
    const wet = c === "fill" || c === "wash" || c === "rinse", moving = c === "wash" || c === "rinse";
    let s = `<ellipse cx="${cx}" cy="${cy}" rx="${n1(rx + 3.5)}" ry="${n1(ry + 2)}" fill="url(#${u}-wr)"/><clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath><g clip-path="url(#${id})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}-drum)"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${u}-perf)"/>` +
      `<ellipse cx="${cx}" cy="${n1(cy - ry * .25)}" rx="${n1(rx * 1.02)}" ry="${n1(ry * .8)}" fill="#000" fill-opacity=".3"/><g transform="translate(${cx} ${n1(by)}) scale(1 ${sc})">`;
    let core = "";
    if (opt.imp) { core += `<circle r="${n1(rx * .46)}" fill="url(#${u}-stv)"/>`; for (let i = 0; i < 6; i++) core += `<path transform="rotate(${i * 60})" d="M0 -${n1(rx * .1)}Q${n1(rx * .12)} -${n1(rx * .28)} 0 -${n1(rx * .44)}" fill="none" stroke="#5a6067" stroke-width="${n1(rx * .05)}" stroke-linecap="round"/>`; core += `<circle r="${n1(rx * .1)}" fill="url(#${u}-cr)"/>`; }
    if (opt.agit) core += `<circle r="${n1(rx * .3)}" fill="url(#${u}-wr)"/>` + [0, 60, 120, 180, 240, 300].map((a) => `<path transform="rotate(${a})" d="M0 -${n1(rx * .1)}V-${n1(rx * .3)}" stroke="#8b929b" stroke-width="${n1(rx * .05)}"/>`).join("");
    if (c === "spin") s += core + spinRing(o, 0, 0, rx * .98);
    else {
      let cl = ""; [0, 70, 140, 205, 280].forEach((a, i) => { const t = a * Math.PI / 180, f = c === "off" || c === "done" ? .55 : .62; cl += cloth(o, i + 2, Math.cos(t) * rx * f, Math.sin(t) * rx * f, rx / 30, a + 90); });
      s += `<g class="${moving ? P + (opt.imp ? "rockS" : "rockT") : ""}" style="animation-duration:${dur(o, 1.8, .8)}s">${ghost(0, 0, rx * .92)}${core}${cl}</g>`;
    }
    if (wet) {
      s += `<g class="${c === "fill" ? P + "swell" : ""}" style="animation-duration:${dur(o, 8, 4)}s"><circle r="${n1(rx * (c === "fill" ? .82 : .95))}" fill="url(#${u}-${c === "wash" ? "ws" : "wt"})" opacity="${c === "wash" ? .86 : .45}"/></g>`;
      if (c === "wash") for (let i = 0; i < 16; i++) { const a = i * 22.5 * Math.PI / 180, d = rx * (i % 2 ? .78 : .5); s += `<circle cx="${n1(Math.cos(a) * d)}" cy="${n1(Math.sin(a) * d)}" r="${n1(rx * (.08 + (i % 3) * .03))}" fill="#fff" fill-opacity=".92"/>`; }
      if (c === "rinse") for (let i = 0; i < 6; i++) { const a = i * 60 * Math.PI / 180; s += `<circle cx="${n1(Math.cos(a) * rx * .55)}" cy="${n1(Math.sin(a) * rx * .55)}" r="${n1(rx * .04)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width=".6"/>`; }
      if (c === "fill") s += `<path class="${P}flow" d="M-${n1(rx * .2)} -${n1(rx * .95)}V-${n1(rx * .45)}" stroke="#cdeeff" stroke-width="${n1(rx * .07)}" stroke-dasharray="3 2.4" stroke-linecap="round" opacity=".9"/>`;
    }
    s += `</g></g>`;
    if (opt.agit) { const top = by - rx * .5, w2 = rx * .085;
      s += `<g class="${moving ? P + "twist" : ""}"><path d="M${n1(cx - w2)} ${n1(by)}V${n1(top)}H${n1(cx + w2)}V${n1(by)}Z" fill="url(#${u}-wr)"/>` + [.25, .5, .75].map((f) => `<path d="M${n1(cx - w2)} ${n1(by - (by - top) * f)}H${n1(cx + w2)}" stroke="#8b929b" stroke-width=".8"/>`).join("") +
        `<ellipse cx="${cx}" cy="${n1(top)}" rx="${n1(w2 * 1.6)}" ry="${n1(w2 * .7)}" fill="#f4f6f8" stroke="#9aa1a9" stroke-width=".5"/></g>`; }
    return s + `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.2"/>`;
  }

  function fl2(o, k, x, y, w, h, opt) {
    const u = o.uid, dx = opt.dx || 0, dy = Math.round(dx * .7), ch = opt.ch || Math.round(h * .15), kick = opt.kick == null ? Math.round(h * .06) : opt.kick;
    let s = box3(o, x, y, w, h, dx, dy);
    if (opt.strip) s += `<path d="${rr(x + 2, y + 2, w - 4, ch - 3.5, 2)}" fill="url(#${u}-blk)"/><path d="${rr(x + 2, y + 2, w - 4, ch - 3.5, 2)}" fill="url(#${u}-gl)"/>`;
    s += opt.panel(o, x, y, w, ch) + groove(`M${x} ${y + ch}H${x + w}`);
    const ay = y + ch, ah = h - ch - kick, R = Math.min(w * (opt.Rw || .37), ah * .46), dcx = x + w / 2, dcy = ay + ah / 2;
    if (opt.led) s += ledRing(o, dcx, dcy, R + 3.2);
    s += door(o, k, dcx, dcy, R, { ring: opt.ring, tint: o.kind === "dry", smoke: opt.smoke, handle: opt.handle });
    if (kick) s += groove(`M${x} ${y + h - kick}H${x + w}`);
    if (opt.hatch) s += `<path d="${rr(x + w * .06, y + h - kick - 9, w * .14, 7, 1.4)}" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>`;
    return s + hl(x + 2.4, y + 3, x + 2.4, y + h - 3, 1.5, isM(o.color) ? .18 : .3);
  }
  function top2(o, k, x, y, w, h, opt) {
    const u = o.uid, cH = opt.cH || 24, dk = 44, ty = y + cH, by = ty + dk, cx = x + w / 2;
    let s = box3(o, x + 6, y, w - 12, cH, 0, 0) + `<path d="M${x + 6} ${y}L${x + 10} ${y - 6}H${x + w - 10}L${x + w - 6} ${y}Z" fill="url(#${u}-tp)"/>` + opt.console(o, x + 6, y, w - 12, cH);
    s += `<path d="M${x} ${by}L${x + 6} ${ty}H${x + w - 6}L${x + w} ${by}Z" fill="url(#${u}-tp)"/><path d="M${x} ${by}L${x + 6} ${ty}H${x + w - 6}L${x + w} ${by}Z" fill="url(#${u}-fx)"/>`;
    const lid = `M${x + 12} ${ty + 4}H${x + w - 12}L${x + w - 7} ${by - 4}H${x + 7}Z`;
    if (opt.solid) s += face(o, lid, "tp") + `<path d="${lid}" fill="none" stroke="#000" stroke-opacity=".3"/><path d="M${x + 9} ${by - 6}H${x + w - 9}" stroke="#fff" stroke-opacity=".45"/><path d="${rr(cx - 14, by - 9, 28, 3.4, 1.7)}" fill="#000" fill-opacity=".3"/>`;
    else if (opt.flex) {
      const lb = `M${x + 12} ${ty + 4}H${x + w - 12}L${x + w - 9} ${ty + 27}H${x + 9}Z`, lf = `M${x + 9} ${ty + 28}H${x + w - 9}L${x + w - 7} ${by - 4}H${x + 7}Z`;
      s += `<path d="${lb}" fill="#0b0e12"/>` + tub2(o, k, cx, ty + 15, w * .32, 9, opt.tub) + glassLid(o, lb);
      const wet = o.on && /fill|wash|rinse/.test(o.cyc);
      s += `<path d="${lf}" fill="#0b0e12"/>` + (wet ? `<path d="M${x + 12} ${by - 11}H${x + w - 12}V${by - 6}H${x + 12}Z" fill="url(#${u}-${o.cyc === "wash" ? "ws" : "wt"})" opacity=".8"/>` : "") +
        cloth(o, 1, cx - 14, by - 9, .32, 70) + cloth(o, 4, cx + 10, by - 8.5, .3, -20) + glassLid(o, lf) + `<path d="M${x + 9} ${ty + 27.5}H${x + w - 9}" stroke="#9aa1a9" stroke-width="1.2"/>`;
    } else s += `<path d="${lid}" fill="#0b0e12"/>` + tub2(o, k, cx, (ty + by) / 2 + 1, w * .37, (dk - 11) / 2, opt.tub) + glassLid(o, lid) + hl(x + 15, ty + 9, x + 30, ty + 8, 2, .3);
    s += box3(o, x, by, w, h - cH - dk, 0, 0) + `<path d="${rr(cx - 16, by + 2, 32, 4, 2)}" fill="#000" fill-opacity=".3"/>` + groove(`M${x} ${by + 10}H${x + w}`) +
      foot(x + 5, y + h - 1) + foot(x + w - 14, y + h - 1) + hl(x + 3, by + 4, x + 3, y + h - 4, 1.5, .3);
    return s;
  }

  function pBes(scr) {
    return (o, x, y, w, ch) => { const cy = y + ch / 2;
      let s = o.kind !== "dry" ? `<path d="${rr(x + 4, y + 2.5, w * .2, ch - 5, 1.2)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width=".7"/>` : "";
      s += knob(o, x + w * (scr ? .36 : .42), cy, ch * .2, { n: 8, gap: ch * .13 });
      s += scr ? ui(o, x + w * .5, y + 2, w * .44, ch - 4) : clock(o, x + w * .54, cy - ch * .15, ch * .3) + stages(o, x + w * .8, cy, 4.2, o.kind === "dry" ? DSTG : WST.slice(0, 3), 1.3);
      return s; };
  }
  function pSam(o, x, y, w, ch) { const cy = y + ch / 2;
    return (o.kind === "dry" ? knob(o, x + w * .2, cy, ch * .25) : drawer(o, x + w * .05, y + ch * .2, w * .28, ch * .6, "")) + screen(o, x + w * .56, cy, ch * .28) + (o.kind === "dry" ? stages(o, x + w * .76, cy, 6, DSTG, 1.6) : knob(o, x + w * .85, cy, ch * .25)); }
  function pLG(o, x, y, w, ch) { const cy = y + ch / 2, dr = o.kind === "dry";
    return (dr ? "" : drawer(o, x + w * .04, y + ch * .2, w * .25, ch * .6, "")) + knob(o, x + w * (dr ? .2 : .42), cy, ch * .26, { dark: isM(o.color) }) +
      screen(o, x + w * (dr ? .52 : .68), cy - ch * .08, ch * .26) + stages(o, x + w * (dr ? .45 : .6), cy + ch * .3, 4.2, dr ? DSTG : WST, 1.2); }
  function pLGcombo(o, x, y, w, ch) { const cy = y + ch / 2;
    return knob(o, x + w * .4, cy, ch * .27, { dark: true }) + ui(o, x + w * .55, y + ch * .2, w * .36, ch * .55, "#9fd3ff") + `<path d="${rr(x + w * .06, y + ch * .22, w * .2, ch * .5, 1.5)}" fill="none" stroke="#fff" stroke-opacity=".12"/>`; }
  function pBosch(o, x, y, w, ch) { const cy = y + ch / 2, dr = o.kind === "dry";
    return (dr ? "" : drawer(o, x + w * .04, y + ch * .2, w * .24, ch * .6, "")) + knob(o, x + w * (dr ? .25 : .45), cy, ch * .27) + `<path d="${rr(x + w * .6, y + ch * .2, w * .34, ch * .6, 1.5)}" fill="#0d1014"/>` + clock(o, x + w * .64, cy - ch * .16, ch * .32); }
  function pElux(o, x, y, w, ch) { const cy = y + ch / 2, dr = o.kind === "dry";
    return (dr ? "" : drawer(o, x + w * .04, y + ch * .2, w * .26, ch * .6, "lit")) + knob(o, x + w * (dr ? .22 : .42), cy, ch * .27, { dark: true }) + screen(o, x + w * .68, cy, ch * .28) + pills(o, x + w * .56, cy + ch * .3, 4, 5, 3.6); }
  function pMiele(o, x, y, w, ch) { const cy = y + ch / 2, dr = o.kind === "dry";
    let s = (dr ? "" : drawer(o, x + w * .04, y + ch * .2, w * .24, ch * .6, "")) + knob(o, x + w * (dr ? .22 : .38), cy, ch * .26) + `<path d="${rr(x + w * .5, y + ch * .25, w * .44, ch * .5, 1.2)}" fill="#0d1014"/>` + clock(o, x + w * .53, cy - ch * .13, ch * .26);
    for (let i = 0; i < 3; i++) s += btn(x + w * (.8 + i * .055), cy, 1.4);
    return s; }
  function pGE(o, x, y, w, ch) { return ui(o, x + w * .28, y + ch * .16, w * .44, ch * .62, "#8fd0ff") + knob(o, x + w * .84, y + ch / 2, ch * .24, { dark: true }) + `<path d="${rr(x + w * .06, y + ch * .22, w * .16, ch * .5, 1.5)}" fill="none" stroke="#fff" stroke-opacity=".14"/>`; }
  const cLG = (o, x, y, w, h) => knob(o, x + w * .16, y + h / 2, h * .22) + screen(o, x + w * .5, y + h * .42, h * .22) + stages(o, x + w * .38, y + h * .78, 6.5, WST, 1.5) + pills(o, x + w * .74, y + h * .45, 3, 7);
  const cFlex = (o, x, y, w, h) => `<path d="${rr(x + 3, y + 3, w - 6, h - 6, 3)}" fill="url(#${o.uid}-blk)"/><path d="${rr(x + 3, y + 3, w - 6, h - 6, 3)}" fill="url(#${o.uid}-gl)"/>` + knob(o, x + w * .5, y + h / 2, h * .2, { dark: true }) + clock(o, x + w * .14, y + h * .38, h * .24) + stages(o, x + w * .7, y + h / 2, 6, WST, 1.5);
  const cWhirl = (o, x, y, w, h) => knob(o, x + w * .16, y + h / 2, h * .24) + stages(o, x + w * .36, y + h / 2, 7.5, WST, 1.8) + knob(o, x + w * .84, y + h / 2, h * .24, { n: 5 });
  const cGE = (o, x, y, w, h) => `<path d="${rr(x + w * .25, y + 4, w * .5, h - 8, 2.5)}" fill="url(#${o.uid}-blk)"/>` + clock(o, x + w * .4, y + h * .3, h * .22) + stages(o, x + w * .34, y + h * .74, 6, WST, 1.3) + knob(o, x + w * .13, y + h / 2, h * .22) + pills(o, x + w * .8, y + h * .45, 2, 6, 4);
  const cSQ = (o, x, y, w, h) => knob(o, x + w * .15, y + h / 2, h * .25, { n: 4 }) + knob(o, x + w * .85, y + h / 2, h * .25, { n: 6 }) + `<path d="${rr(x + w * .3, y + 4, w * .4, h - 8, 2)}" fill="#0d1014"/>` + clock(o, x + w * .37, y + h * .27, h * .2) + stages(o, x + w * .38, y + h * .7, 6, WST, 1.2);

  function tower(o, wsh, dry, k, x, y, w, h, opt) {
    const u = o.uid, mid = y + h * .47, bh = opt.bh || 16, R = w * (opt.Rw || .4);
    let s = box3(o, x, y, w, h, opt.dx || 0, Math.round((opt.dx || 0) * .7));
    s += `<path d="M${x} ${mid}H${x + w}V${mid + bh}H${x}Z" fill="url(#${u}-blk)"/><path d="M${x} ${mid}H${x + w}V${mid + bh}H${x}Z" fill="url(#${u}-gl)"/>` + opt.band(x, mid, w, bh);
    s += door(dry, k, x + w / 2, y + (mid - y) / 2 + 1, R, { ring: opt.ring, tint: true, smoke: opt.smoke, handle: opt.handle });
    s += door(wsh, k + 1, x + w / 2, mid + bh + (y + h - 7 - mid - bh) / 2, R, { ring: opt.ring, smoke: opt.smoke, handle: opt.handle });
    return s + groove(`M${x} ${y + h - 7}H${x + w}`) + hl(x + 2.4, y + 3, x + 2.4, y + h - 3, 1.5, .25);
  }
  function pedestal(o, x, y, w, h, dx) {
    const u = o.uid;
    return box3(o, x, y, w, h, dx || 0, Math.round((dx || 0) * .7)) + `<path d="${rr(x + 4, y + 3, w - 8, h - 6, 2)}" fill="none" stroke="#000" stroke-opacity=".3"/><path d="${rr(x + w * .3, y + 7, w * .4, 3.4, 1.7)}" fill="url(#${u}-st)"/>`;
  }

  const FS = [WH, CHAMP, BBK, NAVY, IVORY], LGF = [BST, WH, GRPH, IVORY], BESF = [BBK, DST, WH, IVORY];
  const PARTS2 = [{ id: "washer", name: "Washer" }, { id: "dryer", name: "Dryer" }];
  const OPT2 = [{ id: "wcyc", name: "Washer cycle", values: WCY }, { id: "dcyc", name: "Dryer cycle", values: DCY }];
  const PAIR = { parts: PARTS2, options: OPT2 };
  const W1 = { options: [{ id: "cycle", name: "Cycle", values: WCY }] }, C1 = { options: [{ id: "cycle", name: "Cycle", values: CCY }] };
  const ic = (id, name, colors, extra, render) => Object.assign({ id, name, colors, picker: true, colorLabel: "Finish", render }, extra);
  const pairM = (o) => [M(o, "washer", "wcyc", "wash"), M(o, "dryer", "dcyc", "dry")];

  const MACH = { id: "mach", name: "Machines", values: [["both", "Washer + dryer"], ["washer", "Washer"], ["dryer", "Dryer"]] };
  const LAY = { id: "layout", name: "Layout", values: [["side", "Side by side"], ["stack", "Stacked"]] };
  const PED = { id: "ped", name: "Pedestal", values: [["none", "None"], ["yes", "Pedestal with drawer"]] };
  const WC = { id: "wcyc", name: "Washer cycle", values: WCY }, DC = { id: "dcyc", name: "Dryer cycle", values: DCY };
  const PARTS = [{ id: "washer", name: "Washer" }, { id: "dryer", name: "Dryer" }];
  const opt = (o, k, d) => (o.opt && o.opt[k]) || d;
  const card = (id, name, colors, extra, render) => Object.assign({ id, name, colors, picker: true, colorLabel: "Finish", render }, extra);
  function ped(o, x, y, w, h, dx) { return pedestal(o, x, y, w, h, dx || 0); }

  function arrange(o, fam) {
    const F = 178, mach = opt(o, "mach", "both"), lay = fam.noStack ? "side" : opt(o, "layout", "side"), hasPed = opt(o, "ped", "none") === "yes";
    const w0 = M(o, "washer", "wcyc", "wash"), d0 = M(o, "dryer", "dcyc", "dry");
    const one = mach !== "both", Hp = hasPed ? (lay === "stack" && !one ? 18 : 26) : 0;
    let s = "";
    const put = (m, k, x, w, h, top) => { const y = F - Hp - h - (top || 0);
      let t = ""; if (hasPed && !top) t += ped(o, x, F - Hp, w, Hp, fam.dx || 0);
      return t + wob2(m, fam.draw(m, k, x, y, w, h)); };
    if (one) { const m = mach === "washer" ? w0 : d0, w = fam.w1, h = Math.min(fam.h1, F - Hp - 26);
      s += sh(o, 100, F + 1, w * .62, 5) + put(m, 1, 100 - w / 2, w, h); }
    else if (lay === "side") { const w = fam.w2, h = Math.min(fam.h2, F - Hp - 30), g = fam.gap == null ? 8 : fam.gap;
      s += sh(o, 100 - w / 2 - g / 2, F + 1, w * .55, 5) + sh(o, 100 + w / 2 + g / 2, F + 1, w * .55, 5);
      s += put(w0, 1, 100 - w - g / 2, w, h) + put(d0, 2, 100 + g / 2, w, h); }
    else { const w = fam.wS, h = Math.min(fam.hS, (F - Hp - 14 - 5) / 2), x = 100 - w / 2;
      s += sh(o, 100, F + 1, w * .6, 4) + put(w0, 1, x, w, h);
      const ky = F - Hp - h - 5; s += `<rect x="${n1(x - 1)}" y="${n1(ky)}" width="${w + 2}" height="5" rx="1" fill="url(#${o.uid}-st)"/><rect x="${n1(x - 1)}" y="${n1(ky + 3.6)}" width="${w + 2}" height="1.4" fill="#000" fill-opacity=".4"/>`;
      s += put(d0, 2, x, w, h, h + 5); }
    return s;
  }
  const FL = { gap: 8 };
  const famScreen = Object.assign({}, FL, { w1: 100, h1: 122, w2: 84, h2: 112, wS: 82, hS: 80,
    draw: (m, k, x, y, w, h) => fl2(m, k, x, y, w, h, { ch: Math.round(h * .13), Rw: .43, ring: "dark", smoke: true, handle: false, hatch: m.kind === "wash", kick: Math.round(h * .045), panel: pBes(m.kind === "dry") }) });
  const famDial = Object.assign({}, FL, { dx: 6, w1: 100, h1: 118, w2: 82, h2: 106, wS: 80, hS: 80,
    draw: (m, k, x, y, w, h) => fl2(m, k, x, y, w, h, { dx: 6, ch: Math.round(h * .17), panel: pLG }) });
  const famCompact = Object.assign({}, FL, { w1: 78, h1: 100, w2: 72, h2: 90, wS: 72, hS: 78,
    draw: (m, k, x, y, w, h) => fl2(m, k, x, y, w, h, { ch: Math.round(h * .17), kick: Math.round(h * .06), panel: pBosch }) });
  const cDry = (o, x, y, w, h) => knob(o, x + w * .16, y + h / 2, h * .22) + screen(o, x + w * .5, y + h * .42, h * .22, AMB) + stages(o, x + w * .4, y + h * .78, 6.5, DSTG, 1.5) + pills(o, x + w * .74, y + h * .45, 3, 7);
  function topDryer(m, k, x, y, w, h) {
    const u = m.uid, cH = 24;
    let s = box3(m, x + 6, y, w - 12, cH, 0, 0) + `<path d="M${x + 6} ${y}L${x + 10} ${y - 6}H${x + w - 10}L${x + w - 6} ${y}Z" fill="url(#${u}-tp)"/>` + cDry(m, x + 6, y, w - 12, cH);
    s += `<path d="M${x} ${y + cH + 8}L${x + 6} ${y + cH}H${x + w - 6}L${x + w} ${y + cH + 8}Z" fill="url(#${u}-tp)"/>`;
    s += fl2(m, k, x, y + cH + 8, w, h - cH - 8, { ch: 10, kick: 7, ring: "chrome", panel: (q, px, py, pw, pch) => `<path d="${rr(px + pw * .3, py + 3, pw * .4, 3.4, 1.7)}" fill="#000" fill-opacity=".35"/>` });
    return s;
  }
  const famTop = { noStack: true, gap: 6, w1: 96, h1: 146, w2: 86, h2: 140,
    draw: (m, k, x, y, w, h) => m.kind === "dry" ? topDryer(m, k, x, y, w, h) : top2(m, k, x, y, w, h, { console: cLG, tub: { agit: true } }) };

  const FIN = { screen: [BBK, DST, WH, IVORY], dial: [WH, BST, GRPH, CHAMP, NAVY], top: [WH, GRPH, BST, CHAMP], compact: [WH, SS, GRPH] };
  const std = (lay) => ({ parts: PARTS, options: [MACH].concat(lay ? [LAY] : []).concat([PED, WC, DC]) });
  const icons = [
    card("cfgscreen", "Front-load, screen", FIN.screen, std(true), (o) => svg(o, room(o, 150, "tile") + arrange(o, famScreen))),
    card("cfgdial", "Front-load, dial", FIN.dial, std(true), (o) => svg(o, room(o, 150, "wood") + arrange(o, famDial))),
    card("cfgtop", "Top-load, glass lid", FIN.top, std(false), (o) => svg(o, room(o, 150, "tile") + arrange(o, famTop))),
    card("cfgcompact", "Compact 24-inch", FIN.compact, std(true), (o) => svg(o, room(o, 152, "wood") + arrange(o, famCompact))),
    card("cfgtower", "Laundry tower", [BST, WH, GRPH, IVORY], { parts: PARTS, options: [PED, WC, DC] }, (o) => {
      const w = M(o, "washer", "wcyc", "wash"), d = M(o, "dryer", "dcyc", "dry"), hasPed = opt(o, "ped", "none") === "yes", Hp = hasPed ? 18 : 0, F = 178, h = F - Hp - 8;
      return svg(o, room(o, 174, "tile") + sh(o, 100, F + 1, 44, 4) + (hasPed ? ped(o, 62, F - Hp, 76, Hp, 6) : "") +
        wob2(w.run ? w : d, tower(o, w, d, 1, 62, F - Hp - h, 76, h, { dx: 6, Rw: .39, ring: "chrome", bh: 15,
          band: (x, y, ww, bh) => screen(d, x + ww * .24, y + bh / 2, bh * .3, AMB) + knob(w.on ? w : d, x + ww * .5, y + bh / 2, bh * .27, { dark: true }) + screen(w, x + ww * .76, y + bh / 2, bh * .3) }))); }),
    card("cfgcombo", "All-in-one combo", [BST, WH, GRPH, BBK], { options: [PED, { id: "cycle", name: "Cycle", values: CCY }] }, (o) => {
      const m = M(o, null, "cycle", "combo"), hasPed = opt(o, "ped", "none") === "yes", Hp = hasPed ? 28 : 0, F = 178, h = Math.min(140, F - Hp - 24);
      return svg(o, room(o, 156, "conc") + sh(o, 102, F + 1, 62, 6) + (hasPed ? ped(o, 50, F - Hp, 100, Hp, 8) : "") +
        wob2(m, fl2(m, 1, 50, F - Hp - h, 100, h, { dx: 8, ch: Math.round(h * .14), strip: true, Rw: .42, ring: "dark", hatch: true, kick: hasPed ? 0 : 6, panel: pLGcombo }))); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "laundrycfg", tab: "Washer & dryer builder", group: "Appliances", kind: "device",
    intro: "One card per look: pick a washer, a dryer or both, side by side or stacked, with or without a pedestal, and a cycle for each machine. Washer and dryer switch on their own.",
    
    css, icons,
  });
})();
