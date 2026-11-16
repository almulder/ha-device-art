(function () {
  const P = "hda-smallkitchen-";
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  const H = () => window.HDAH;
  const SS = "#c3c8ce", BS = "#4b4f56", BK = "#26292e", WH = "#f1f2f0", SL = "#67707b", COP = "#b87355",
    RED = "#c8323a", MINT = "#a6d8c4", CREAM = "#efe2c2", NAVY = "#2f3f66", PINK = "#f2b8c8", SAGE = "#a3b597", ICE = "#a9c8e6";
  const METAL = [SS, BS, COP];
  const isM = (c) => METAL.indexOf(String(c).toLowerCase()) >= 0;
  const BLU = "#7dd3fc", GRN = "#34d399", ORNG = "#ff9a4a", AMB = "#ffb547", REDL = "#ff5257";
  const n1 = (v) => (+v).toFixed(1);
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);

  function pal(c) {
    const h = H(), x = h.hx(c), lt = (x[0] * .3 + x[1] * .59 + x[2] * .11) / 255 > .7;
    return { l: h.shade(c, lt ? .7 : .42), m: c, d: h.shade(c, lt ? -.14 : -.3), k: h.shade(c, lt ? -.32 : -.55), e: h.shade(c, lt ? -.42 : -.5), lt };
  }
  const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".8"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const lg = (id, v, st) => `<linearGradient id="${id}" ${v ? 'x1="0" y1="0" x2="0" y2="1"' : 'x1="0" x2="1"'}>${st.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color);
    return `<defs>
${lg(u + "-v", 1, [[0, p.l], [.42, p.m], [1, p.d]])}${lg(u + "-c", 0, [[0, p.k], [.18, p.d], [.38, p.l], [.62, p.m], [.9, p.d], [1, p.k]])}
${lg(u + "-tp", 0, [[0, p.d], [.45, p.l], [1, p.m]])}${lg(u + "-sd", 0, [[0, p.d], [1, p.k]])}
${lg(u + "-fx", 0, [[0, "#fff", .18], [.12, "#fff", 0], [.86, "#000", 0], [1, "#000", .24]])}
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}-ms" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".2" stop-color="#fff" stop-opacity=".3"/><stop offset=".33" stop-color="#fff" stop-opacity="0"/><stop offset=".64" stop-color="#fff" stop-opacity="0"/><stop offset=".73" stop-color="#fff" stop-opacity=".16"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/></linearGradient>
${lg(u + "-edge", 0, [[0, "#000", .36], [.3, "#000", 0], [.68, "#000", 0], [1, "#000", .42]])}
${lg(u + "-blk", 1, [[0, "#2c3139"], [.5, "#13161b"], [1, "#07080b"]])}${lg(u + "-blc", 0, [[0, "#0b0c10"], [.35, "#3a3f48"], [.6, "#1c1f25"], [1, "#07080b"]])}
${lg(u + "-st", 0, [[0, "#6f767e"], [.5, "#e6e9ec"], [1, "#5a6067"]])}${lg(u + "-stv", 1, [[0, "#eef0f2"], [.5, "#9aa1a9"], [1, "#5a6067"]])}
${lg(u + "-cr", 1, [[0, "#fdfeff"], [.35, "#8f969e"], [.55, "#eceef1"], [1, "#5d636b"]])}${lg(u + "-crh", 0, [[0, "#50565e"], [.22, "#fdfeff"], [.45, "#8f969e"], [.7, "#eceef1"], [1, "#4a5058"]])}
${lg(u + "-wh", 0, [[0, "#b9bdc2"], [.35, "#ffffff"], [1, "#c9ccd0"]])}
<linearGradient id="${u}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2f3ff" stop-opacity=".34"/><stop offset=".45" stop-color="#e2f3ff" stop-opacity=".03"/><stop offset="1" stop-color="#e2f3ff" stop-opacity=".14"/></linearGradient>
${lg(u + "-glb", 0, [[0, "#dff1ff", .42], [.16, "#dff1ff", .1], [.3, "#ffffff", .3], [.4, "#dff1ff", .04], [.85, "#dff1ff", .1], [1, "#dff1ff", .45]])}
${lg(u + "-cof", 1, [[0, "#7a4523"], [.25, "#4a2512"], [1, "#1d0d05"]])}${lg(u + "-crm", 1, [[0, "#e6b479"], [1, "#9a5a2a"]])}
${lg(u + "-wt", 1, [[0, "#bfe6ff", .4], [1, "#3f8fd8", .62]])}${lg(u + "-wd", 1, [[0, "#9a6338"], [.45, "#c88d57"], [1, "#5b3418"]])}
${lg(u + "-wood", 1, [[0, "#c8996a"], [.5, "#a87a4e"], [1, "#6a4528"]])}${lg(u + "-wall", 1, [[0, "#fff", .07], [1, "#fff", .025]])}
${lg(u + "-ctr", 1, [[0, "#000", .3], [.35, "#000", .05], [1, "#fff", .06]])}${lg(u + "-lip", 1, [[0, "#fff", .22], [.25, "#fff", .05], [1, "#000", .3]])}
${lg(u + "-cab", 1, [[0, "#000", .45], [1, "#000", .25]])}
${lg(u + "-tst", 1, [[0, "#f2c47c"], [.5, "#d0893f"], [1, "#9a5a22"]])}${lg(u + "-brd", 1, [[0, "#f6e7c6"], [1, "#e1c48e"]])}
${lg(u + "-dgh", 1, [[0, "#f7e6c0"], [1, "#d8b67c"]])}${lg(u + "-crs", 1, [[0, "#c7813c"], [1, "#8a4f1d"]])}
<radialGradient id="${u}-sh"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-stm"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".6" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-warm" cx=".5" cy=".5"><stop offset="0" stop-color="#ffc06a" stop-opacity=".9"/><stop offset=".5" stop-color="#ff8a3c" stop-opacity=".38"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}-cl" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></radialGradient>
${halo(u + "-hb", BLU)}${halo(u + "-hg", GRN)}${halo(u + "-ho", ORNG)}${halo(u + "-hr", REDL)}${halo(u + "-ha", AMB)}
<pattern id="${u}-br" width="40" height="5" patternUnits="userSpaceOnUse"><path d="M0 .5H40" stroke="#fff" stroke-opacity=".16" stroke-width=".5"/><path d="M0 2.1H40" stroke="#000" stroke-opacity=".09" stroke-width=".6"/><path d="M0 3.5H40" stroke="#fff" stroke-opacity=".08" stroke-width=".4"/><path d="M0 4.5H40" stroke="#000" stroke-opacity=".06" stroke-width=".4"/></pattern>
<pattern id="${u}-sub" width="22" height="10" patternUnits="userSpaceOnUse"><path d="M0 .4H22M0 5.4H22M11 .4V5.4M.4 5.4V10.4" stroke="#fff" stroke-opacity=".1" stroke-width=".8" fill="none"/></pattern>
<pattern id="${u}-zel" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#7fb5a8" fill-opacity=".1"/><rect x="7" y="7" width="7" height="7" fill="#fff" fill-opacity=".03"/><path d="M0 .4H14M.4 0V14" stroke="#000" stroke-opacity=".22" stroke-width=".8"/></pattern>
<pattern id="${u}-spk" width="9" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".55" fill="#fff" fill-opacity=".22"/><circle cx="6.5" cy="4.6" r=".45" fill="#000" fill-opacity=".35"/><circle cx="4" cy="6" r=".35" fill="#fff" fill-opacity=".14"/></pattern>
<pattern id="${u}-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2C10 1 20 3 40 2M0 4.6C14 5.4 26 3.8 40 4.8" fill="none" stroke="#3a2414" stroke-opacity=".35" stroke-width=".6"/></pattern>
<pattern id="${u}-grt" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#15181d"/><rect x=".6" width="1.6" height="4" fill="#9aa1a9" fill-opacity=".55"/></pattern>
<pattern id="${u}-vent" width="4" height="3" patternUnits="userSpaceOnUse"><rect width="4" height="1.3" fill="#000" fill-opacity=".45"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, `<clipPath id="${o.uid}-all"><rect width="200" height="200" rx="6"/></clipPath>`)}<g clip-path="url(#${o.uid}-all)">${body}</g></svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(x + r)} ${n1(y)}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2.5}" stroke-linecap="round"/>`;
  const groove = (d) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".32" stroke-width="1.1"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width=".5" transform="translate(0 1)"/>`;
  const wob = (o, s) => `<g class="${o.on ? P + "wob" : ""}">${s}</g>`;
  const foot = (x, y, w) => `<rect x="${x}" y="${y}" width="${w || 8}" height="3" rx="1.4" fill="#16181c"/>`;
  const ed = (d, op) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${op || .35}" stroke-width=".8"/>`;

  function face(o, d, g) {
    const u = o.uid;
    return `<path d="${d}" fill="url(#${u}-${g || "v"})"/><path d="${d}" fill="url(#${u}-fx)"/>` +
      (isM(o.color) ? `<path d="${d}" fill="url(#${u}-br)"/><path d="${d}" fill="url(#${u}-ms)"/>` : `<path d="${d}" fill="url(#${u}-g)" opacity=".32"/>`);
  }
  const mat = (o, d, g, br) => `<path d="${d}" fill="url(#${o.uid}-${g})"/>` + (br ? `<path d="${d}" fill="url(#${o.uid}-br)"/>` : "");
  const glass = (o, d) => `<path d="${d}" fill="url(#${o.uid}-glb)"/><path d="${d}" fill="url(#${o.uid}-gl)"/><path d="${d}" fill="none" stroke="#e8f6ff" stroke-opacity=".45" stroke-width=".9"/>`;

  const W = 146, L = 172;
  function room(o, wall, ctr) { return G(room0(o, wall, ctr)); }
  function room0(o, wall, ctr) {
    const u = o.uid; let s = `<rect width="200" height="${W}" fill="url(#${u}-wall)"/>`;
    if (wall === "sub") s += `<rect width="200" height="${W}" fill="url(#${u}-sub)"/>`;
    else if (wall === "zel") s += `<rect width="200" height="${W}" fill="url(#${u}-zel)"/>`;
    else if (wall === "dark") s += `<rect width="200" height="${W}" fill="#000" fill-opacity=".2"/><rect width="200" height="${W}" fill="url(#${u}-sub)" opacity=".6"/>`;
    const top = `M0 ${W}H200V${L}H0Z`, lip = `M0 ${L}H200V${L + 8}H0Z`;
    if (ctr === "wood") s += `<path d="${top}" fill="url(#${u}-wood)" fill-opacity=".75"/><path d="${top}" fill="url(#${u}-grain)"/>` + [18, 52, 88, 121, 160, 186].map((x, i) => `<path d="M${x} ${W}L${x + (x - 100) * .12} ${L}" stroke="#3a2414" stroke-opacity=".3" stroke-width=".7"/>`).join("") +
      `<path d="${lip}" fill="url(#${u}-wood)"/><path d="${lip}" fill="url(#${u}-grain)"/>`;
    else if (ctr === "granite") s += `<path d="${top}" fill="#2d3035" fill-opacity=".8"/><path d="${top}" fill="url(#${u}-spk)"/><path d="${lip}" fill="#24272b"/><path d="${lip}" fill="url(#${u}-spk)"/>`;
    else if (ctr === "marble") s += `<path d="${top}" fill="#efede8" fill-opacity=".34"/><path d="M0 ${W + 8}C30 ${W + 4} 50 ${W + 18} 90 ${W + 14}S150 ${W + 22} 200 ${W + 12}M40 ${L}C60 ${W + 16} 110 ${W + 20} 130 ${W + 6}M150 ${L}Q170 ${W + 14} 200 ${W + 18}" fill="none" stroke="#8a8f99" stroke-opacity=".35" stroke-width=".7"/>` +
      `<path d="${lip}" fill="#e6e3dd" fill-opacity=".42"/>`;
    else s += `<path d="${top}" fill="#e9e5dc" fill-opacity=".28"/><path d="${top}" fill="url(#${u}-spk)" opacity=".7"/><path d="${lip}" fill="#e9e5dc" fill-opacity=".36"/>`;
    s += `<path d="${top}" fill="url(#${u}-ctr)"/><path d="${lip}" fill="url(#${u}-lip)"/><path d="M0 ${L}H200" stroke="#fff" stroke-opacity=".3" stroke-width=".8"/><path d="M0 ${W}H200" stroke="#000" stroke-opacity=".4"/>`;
    return s + `<rect y="${L + 8}" width="200" height="${200 - L - 8}" fill="url(#${u}-cab)"/><path d="M100 ${L + 8}V200" stroke="#000" stroke-opacity=".5"/><path d="M86 ${L + 14}H94M106 ${L + 14}H114" stroke="#c3c8ce" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>`;
  }
  function plug(o, x, y, to) {
    const u = o.uid; let s = G(`<path d="${rr(x - 9, y - 15, 18, 30, 2.4)}" fill="#e9e7e2" fill-opacity=".85"/><path d="${rr(x - 9, y - 15, 18, 30, 2.4)}" fill="url(#${u}-edge)"/><path d="${rr(x - 4, y + 4, 8, 8, 2)}" fill="#000" fill-opacity=".14"/>`);
    if (to) s += `<path d="M${x} ${y + 3}C${x} ${y + 26} ${to[0]} ${to[1] - 22} ${to[0]} ${to[1]}" fill="none" stroke="#111317" stroke-width="2"/><path d="M${x} ${y + 3}C${x} ${y + 26} ${to[0]} ${to[1] - 22} ${to[0]} ${to[1]}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`;
    s += `<path d="${rr(x - 7.5, y - 13, 15, 15, 4)}" fill="url(#${u}-wh)"/><path d="${rr(x - 7.5, y - 13, 15, 15, 4)}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".6"/>`;
    s += o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y - 5.5}" r="6" fill="url(#${u}-hb)"/><circle cx="${x}" cy="${y - 5.5}" r="2.4" fill="none" stroke="${BLU}" stroke-width="1.1"/>` : `<circle cx="${x}" cy="${y - 5.5}" r="2.4" fill="none" stroke="#9aa1a9" stroke-width=".9"/>`;
    return s;
  }
  function board(o, x, y, w, h) { return G(board0(o, x, y, w, h)); }
  function board0(o, x, y, w, h) {
    const u = o.uid, d = rr(x, y, w, h, 7);
    return `<path d="${rr(x + 3, y + 3, w, h, 7)}" fill="#000" fill-opacity=".25"/><path d="${d}" fill="url(#${u}-wood)"/><path d="${d}" fill="url(#${u}-grain)"/><path d="${d}" fill="url(#${u}-edge)" opacity=".6"/>` +
      `<circle cx="${x + w / 2}" cy="${y + 9}" r="3" fill="#000" fill-opacity=".45"/>`;
  }
  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.55, h * .14), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return (SEG[ch] || "").split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  const dW = (h, str) => str.split("").reduce((a, c) => a + (c === ":" ? h * .34 : h * .76), 0) - h * .2;
  function digits(o, cx, cy, h, str, col, win) {
    col = col || AMB; const w = dW(h, str); let x = cx - w / 2, y = cy - h / 2, g = "", l = "", c = "";
    str.split("").forEach((ch) => {
      if (ch === ":") { const q = h * .13; c += `<rect x="${n1(x)}" y="${n1(y + h * .24)}" width="${n1(q)}" height="${n1(q)}"/><rect x="${n1(x)}" y="${n1(y + h * .64)}" width="${n1(q)}" height="${n1(q)}"/>`; x += h * .34; return; }
      g += dig(x, y, h, "8"); l += dig(x, y, h, ch); x += h * .76;
    });
    let s = win !== false ? `<path d="${rr(cx - w / 2 - 3, y - 2.4, w + 6, h + 4.8, 2)}" fill="#0b0d11"/><path d="${rr(cx - w / 2 - 3, y - 2.4, w + 6, h + 4.8, 2)}" fill="url(#${o.uid}-gl)"/>` : "";
    s += `<g fill="#fff" fill-opacity=".06">${g}${c}</g>`;
    if (!o.on) return s;
    return s + `<g opacity=".16"><ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${n1(w * .75)}" ry="${n1(h * .9)}" fill="${col}"/></g><g fill="${col}">${l}</g><g fill="${col}" class="${P}blink">${c}</g>`;
  }
  const mm = (m) => Math.floor(m / 60) + ":" + ("0" + (m % 60)).slice(-2);
  function led(o, x, y, r, c, id) {
    r = r || 1.6; c = c || BLU; id = id || "hb";
    if (!o.on) return `<circle cx="${x}" cy="${y}" r="${r}" fill="#454a52"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".25"/>`;
    return `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${r + 4.5}" fill="url(#${o.uid}-${id})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .3)}" r="${n1(r * .4)}" fill="#fff" fill-opacity=".85"/>`;
  }
  const btn = (x, y, r, dark) => `<circle cx="${x}" cy="${n1(y + .5)}" r="${r}" fill="#000" fill-opacity=".3"/><circle cx="${x}" cy="${y}" r="${n1(r - .4)}" fill="${dark ? "#2a2e35" : "#e8eaed"}"/><circle cx="${n1(x - r * .25)}" cy="${n1(y - r * .35)}" r="${n1(r * .35)}" fill="#fff" fill-opacity="${dark ? .18 : .7}"/>`;
  function knob(o, cx, cy, r, dark, ticks) {
    const u = o.uid, a = (o.on ? -135 + 270 * o.level : -135) * Math.PI / 180; let s = "";
    if (ticks) for (let i = 0; i < ticks; i++) { const t = (-135 + 270 * i / (ticks - 1)) * Math.PI / 180, R = r + 2.6;
      s += `<circle cx="${n1(cx + Math.sin(t) * R)}" cy="${n1(cy - Math.cos(t) * R)}" r=".6" fill="${o.on && i <= Math.round(o.level * (ticks - 1)) ? AMB : "#000"}" fill-opacity="${o.on ? .9 : .35}"/>`; }
    return s + `<circle cx="${cx}" cy="${n1(cy + .9)}" r="${n1(r + .6)}" fill="#000" fill-opacity=".32"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${u}-${dark ? "blc" : "cr"})"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${n1(r * .74)}" fill="url(#${u}-${dark ? "blk" : "stv"})"/><circle cx="${cx}" cy="${cy}" r="${n1(r * .74)}" fill="url(#${u}-gl)"/>` +
      `<path d="M${n1(cx + Math.sin(a) * r * .25)} ${n1(cy - Math.cos(a) * r * .25)}L${n1(cx + Math.sin(a) * r * .66)} ${n1(cy - Math.cos(a) * r * .66)}" stroke="${dark ? (o.on ? AMB : "#9aa1a9") : "#2a2e35"}" stroke-width="${n1(Math.max(.9, r * .16))}" stroke-linecap="round"/>`;
  }
  function steam(o, x, y, n, s, k) {
    if (!o.on) return ""; s = s || 4; n = n || 3;
    if (!o.anim) return `<path d="M${x} ${y}c-4 -6 4 -10 0 -16s4 -10 0 -16" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="${n1(s * .9)}" stroke-linecap="round"/>`;
    const d = dur(o, 3.8, 1.8); let r = "";
    for (let i = 0; i < n; i++) r += `<circle class="${P}${k || "stm"}" cx="${n1(x + (i % 2 ? 1.5 : -1.5))}" cy="${y}" r="${s}" fill="url(#${o.uid}-stm)" style="animation-duration:${d}s;animation-delay:-${(i * d / n).toFixed(2)}s"/>`;
    return r;
  }
  function stream(o, d, c, w, hi) {
    if (!o.on) return "";
    return `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity=".92"/>` +
      `<path class="${P}flow" d="${d}" fill="none" stroke="${hi || "#fff"}" stroke-opacity=".45" stroke-width="${n1(w * .45)}" stroke-dasharray="2 4" stroke-linecap="round" style="animation-duration:${dur(o, .8, .45)}s"/>`;
  }
  const drips = (o, d, c, w) => o.on ? `<path class="${P}flow" d="${d}" fill="none" stroke="${c}" stroke-width="${w || 2}" stroke-dasharray="1.6 6" stroke-linecap="round" style="animation-duration:${dur(o, 1.1, .6)}s"/>` : "";
  function bubbles(o, pts, k) {
    if (!o.on) return ""; const d = dur(o, 2.2, 1.2), n = Math.max(3, Math.round(pts.length * (.45 + .55 * o.level)));
    return pts.slice(0, n).map((p, i) => `<circle class="${P}${k || "bub"}" cx="${p[0]}" cy="${p[1]}" r="${p[2] || 1.4}" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-opacity=".8" stroke-width=".5" style="animation-duration:${d}s;animation-delay:-${(i * .37 % +d).toFixed(2)}s"/>`).join("");
  }
  const shimmer = (o, x, y, w) => o.on ? [0, 1, 2].map((i) => `<path class="${P}shim" d="M${n1(x + w * (.2 + i * .3))} ${y}c-3 -5 3 -8 0 -13" fill="none" stroke="#ffd2a0" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round" style="animation-delay:-${i * .5}s"/>`).join("") : "";
  const warmPool = (o, cx, cy, rx, ry, a) => o.on ? `<g opacity="${n1((a || .5) * (.5 + .5 * o.level))}"><ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${o.uid}-warm)"/></g>` : "";
  function mug(o, x, y, w, h, c, fill) {
    const u = o.uid, d = `M${x} ${y}H${x + w}V${y + h - 5}Q${x + w} ${y + h} ${x + w - 5} ${y + h}H${x + 5}Q${x} ${y + h} ${x} ${y + h - 5}Z`;
    return `<path d="M${x + w - 1} ${y + 5}h4a5 5 0 0 1 0 ${n1(h * .5)}h-4" fill="none" stroke="${H().shade(c, -.2)}" stroke-width="3"/>` +
      `<path d="${d}" fill="${c}"/><path d="${d}" fill="url(#${u}-edge)"/><path d="${d}" fill="url(#${u}-g)" opacity=".35"/>` +
      `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="2.4" fill="${H().shade(c, -.35)}"/>` + (fill ? `<ellipse cx="${x + w / 2}" cy="${y + .6}" rx="${n1(w / 2 - 1.4)}" ry="1.7" fill="url(#${u}-crm)"/>` : "") +
      `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="2.4" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>`;
  }

  const css = `
.hda-smallkitchen-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smallkitchen-spin{animation:hda-smallkitchen-spin 1s linear infinite}
@keyframes hda-smallkitchen-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-smallkitchen-flow{animation:hda-smallkitchen-flow .6s linear infinite}
@keyframes hda-smallkitchen-flow{to{stroke-dashoffset:-12}}
.hda-anim .hda-smallkitchen-pulse{animation:hda-smallkitchen-pulse 2.6s ease-in-out infinite}
@keyframes hda-smallkitchen-pulse{50%{opacity:.45}}
.hda-anim .hda-smallkitchen-blink{animation:hda-smallkitchen-blink 1s steps(1,end) infinite}
@keyframes hda-smallkitchen-blink{0%,49%{opacity:1}50%,100%{opacity:.15}}
.hda-anim .hda-smallkitchen-wob{animation:hda-smallkitchen-wob .36s linear infinite}
@keyframes hda-smallkitchen-wob{0%,100%{transform:translate(0,0)}25%{transform:translate(.4px,-.3px)}50%{transform:translate(-.35px,.25px)}75%{transform:translate(.3px,.3px)}}
.hda-smallkitchen-stm,.hda-smallkitchen-stl,.hda-smallkitchen-jet{opacity:.3;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smallkitchen-stm{animation:hda-smallkitchen-stm 3.4s ease-out infinite}
@keyframes hda-smallkitchen-stm{0%{transform:translate(0,4px) scale(.45);opacity:0}25%{opacity:.85}100%{transform:translate(3px,-30px) scale(2);opacity:0}}
.hda-anim .hda-smallkitchen-stl{animation:hda-smallkitchen-stl 3.4s ease-out infinite}
@keyframes hda-smallkitchen-stl{0%{transform:translate(0,3px) scale(.45);opacity:0}25%{opacity:.85}100%{transform:translate(-14px,-24px) scale(2);opacity:0}}
.hda-anim .hda-smallkitchen-jet{animation:hda-smallkitchen-jet 1.6s ease-out infinite}
@keyframes hda-smallkitchen-jet{0%{transform:translate(0,0) scale(.4);opacity:0}15%{opacity:.95}100%{transform:translate(6px,-40px) scale(2.6);opacity:0}}
.hda-anim .hda-smallkitchen-bub{animation:hda-smallkitchen-bub 2s ease-in infinite}
@keyframes hda-smallkitchen-bub{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-26px);opacity:0}}
.hda-anim .hda-smallkitchen-fiz{animation:hda-smallkitchen-fiz 2s linear infinite}
@keyframes hda-smallkitchen-fiz{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-44px);opacity:.1}}
.hda-smallkitchen-fill{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-smallkitchen-fill{animation:hda-smallkitchen-fill 9s ease-in-out infinite}
@keyframes hda-smallkitchen-fill{0%{transform:scaleY(.25)}85%,96%{transform:scaleY(1)}100%{transform:scaleY(.25)}}
.hda-smallkitchen-rise{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-smallkitchen-rise{animation:hda-smallkitchen-rise 12s ease-in-out infinite}
@keyframes hda-smallkitchen-rise{0%,100%{transform:scale(.92,.62)}55%,90%{transform:scale(1,1)}}
.hda-anim .hda-smallkitchen-pop{animation:hda-smallkitchen-pop 5s ease-in-out infinite}
@keyframes hda-smallkitchen-pop{0%,72%{transform:translateY(0)}76%{transform:translateY(-19px)}79%{transform:translateY(-15px)}82%,95%{transform:translateY(-16px)}100%{transform:translateY(0)}}
.hda-smallkitchen-jig{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-smallkitchen-jig{animation:hda-smallkitchen-jig 1.3s ease-in-out infinite}
@keyframes hda-smallkitchen-jig{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(-1.2deg) translateY(-.8px)}80%{transform:rotate(1deg) translateY(-.6px)}90%{transform:rotate(-.5deg)}}
.hda-smallkitchen-twist{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-smallkitchen-twist{animation:hda-smallkitchen-twist .5s linear infinite}
@keyframes hda-smallkitchen-twist{0%,100%{transform:scaleX(1)}25%{transform:scaleX(.15)}50%{transform:scaleX(-1)}75%{transform:scaleX(.15)}}
.hda-anim .hda-smallkitchen-orb{animation:hda-smallkitchen-orb 1s linear infinite}
@keyframes hda-smallkitchen-orb{0%{transform:translate(-13px,4px)}25%{transform:translate(0,7px)}50%{transform:translate(13px,-2px)}75%{transform:translate(0,-12px)}100%{transform:translate(-13px,4px)}}
.hda-anim .hda-smallkitchen-shim{animation:hda-smallkitchen-shim 1.6s ease-in-out infinite}
@keyframes hda-smallkitchen-shim{0%{transform:translateY(2px);opacity:0}50%{opacity:.9}100%{transform:translateY(-8px);opacity:0}}
.hda-anim .hda-smallkitchen-swirl{animation:hda-smallkitchen-swirl 1s linear infinite}
@keyframes hda-smallkitchen-swirl{to{stroke-dashoffset:-30}}
.hda-anim .hda-smallkitchen-glow{animation:hda-smallkitchen-glow 1.8s ease-in-out infinite}
@keyframes hda-smallkitchen-glow{0%,100%{opacity:1}40%{opacity:.7}60%{opacity:.92}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-smallkitchen-spin,.hda-anim .hda-smallkitchen-flow,.hda-anim .hda-smallkitchen-pulse,.hda-anim .hda-smallkitchen-blink,.hda-anim .hda-smallkitchen-wob,.hda-anim .hda-smallkitchen-stm,.hda-anim .hda-smallkitchen-stl,.hda-anim .hda-smallkitchen-jet,.hda-anim .hda-smallkitchen-bub,.hda-anim .hda-smallkitchen-fiz,.hda-anim .hda-smallkitchen-fill,.hda-anim .hda-smallkitchen-rise,.hda-anim .hda-smallkitchen-pop,.hda-anim .hda-smallkitchen-jig,.hda-anim .hda-smallkitchen-twist,.hda-anim .hda-smallkitchen-orb,.hda-anim .hda-smallkitchen-shim,.hda-anim .hda-smallkitchen-swirl,.hda-anim .hda-smallkitchen-glow{animation:none!important}}
`;

  const ic = (id, name, colors, render, lbl, parts) => { if (Array.isArray(lbl)) { parts = lbl; lbl = null; } return Object.assign({ id, name, colors, picker: true, colorLabel: lbl || "Finish", render }, parts ? { parts } : {}); };
  const PARTS_DRIP = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }, { id: "plate", name: "Warming plate" }], PARTS_POD = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }],
    PARTS_ESP = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }, { id: "plate", name: "Cup warmer" }], PARTS_BEAN = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["brewing", "Brewing"], ["ready", "Ready"]], def: "brewing" }],
    PARTS_GOOSE = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["ready", "Ready"]], def: "heating" }, { id: "temp", name: "Water temperature", type: "value", unit: "°F", min: 50, max: 212, def: 190 }], PARTS_GLASSK = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["ready", "Ready"]], def: "heating" }, { id: "water", name: "Water level", type: "value", unit: "%", min: 0, max: 100, def: 70 }], PARTS_RETROK = [{ id: "state", name: "State", type: "stage", values: [["idle", "Off"], ["heating", "Heating"], ["ready", "Ready"]], def: "heating" }, { id: "temp", name: "Water temperature", type: "value", unit: "°F", min: 50, max: 212, def: 190 }];
  // (multi-function) coffee makers and kettles: State (stage: off / heating / brewing / ready; kettles off / heating /
  // ready), Water level (value, %) where the drawing has a window, Warming plate / Cup warmer (switch), the kettle's
  // Water temperature (value, °F) where it has a readout. As a Device Image (no o.mf) every drawing is exactly as today.
  // As a Multi-Function Image (o.mf): heating = the display and light on (a kettle's water bubbling); brewing = the
  // coffee pours, the carafe or cup fills, steam; ready = a full carafe or cup, steam; a part left out = off / blank.
  function CF(o) {
    if (!o.mf) return { D: o, B: o, S: o, H: o, PL: o, cup: o.on, wl: null, t: null, mf: false };
    const s = o.pval && o.pval.state != null ? String(o.pval.state) : "", brew = s === "brewing", rdy = s === "ready", heat = s === "heating";
    const num = (k) => (o.pval && o.pval[k] != null && o.pval[k] !== "" && isFinite(+o.pval[k]) ? +o.pval[k] : null), w = num("water");
    const v = (on, lv) => Object.assign({}, o, { on }, lv == null ? {} : { level: lv });
    return { D: v(!!s && s !== "idle"), B: v(brew), S: v(brew || rdy || heat && false), H: v(heat), K: v(heat || rdy), PL: v(!!(o.parts && o.parts.plate)), C: v(brew || rdy, rdy ? 1 : .5),
      cup: brew || rdy, wl: w == null ? null : Math.max(0, Math.min(1, w / 100)), t: num("temp"), mf: true };
  }
  const fillCls = (o) => o.on ? `class="${P}fill" style="animation-duration:${dur(o, 12, 6)}s"` : "";

  function toastSet(o, xs, y, w, up) {
    const u = o.uid; let s = "";
    xs.forEach((x, i) => { const yy = y - (up ? 16 : 8) - (i % 2 ? 1.5 : 0), d = `M${x} ${yy + 16}V${yy + 5}Q${x} ${yy} ${x + 5} ${yy}Q${x + w / 2} ${yy - 3} ${x + w - 5} ${yy}Q${x + w} ${yy} ${x + w} ${yy + 5}V${yy + 16}Z`;
      s += `<path d="${d}" fill="url(#${u}-crs)"/><path d="${d}" fill="none" stroke="#5a3010" stroke-opacity=".5" stroke-width=".7"/><path d="M${x + 2} ${yy + 4}Q${x + w / 2} ${yy + .5} ${x + w - 2} ${yy + 4}" fill="none" stroke="#f6d39a" stroke-opacity=".55" stroke-width=".9"/>`; });
    return s;
  }
  function slotGlow(o, d) {
    return o.on ? `<path class="${P}glow" d="${d}" fill="${ORNG}"/><path d="${d}" fill="url(#${o.uid}-warm)"/>` : `<path d="${d}" fill="#07080a"/>`;
  }
  function chamber(o, x, y, w, h, food, k) {
    const u = o.uid, id = `${u}-ch${k || 0}`, lv = .55 + .45 * o.level;
    let s = `<clipPath id="${id}"><path d="${rr(x, y, w, h, 3)}"/></clipPath><path d="${rr(x, y, w, h, 3)}" fill="#0b0a0a"/><g clip-path="url(#${id})">`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${u}-blc)" opacity=".4"/>`;
    if (o.on) s += `<g opacity="${n1(.22 * lv)}"><rect class="${P}glow" x="${x}" y="${y}" width="${w}" height="${h}" fill="#ff7a2a"/></g><g opacity="${n1(.7 * lv)}"><ellipse class="${P}pulse" cx="${x + w / 2}" cy="${y + 4}" rx="${w * .6}" ry="${h * .45}" fill="url(#${u}-warm)"/></g><ellipse cx="${x + w / 2}" cy="${y + h - 3}" rx="${w * .55}" ry="${h * .3}" fill="url(#${u}-warm)" opacity="${n1(.55 * lv)}"/>`;
    [y + 5, y + h - 5].forEach((ey) => { s += `<path d="M${x + 4} ${ey}H${x + w - 4}" stroke="${o.on ? "#ff9548" : "#3b3f46"}" stroke-width="2.2" stroke-linecap="round"${o.on ? ` class="${P}glow"` : ""}/>` + (o.on ? `<path d="M${x + 4} ${ey}H${x + w - 4}" stroke="#ffe0b0" stroke-width=".7" stroke-linecap="round"/>` : ""); });
    s += `<path d="M${x} ${y + h * .66}H${x + w}" stroke="#8f969e" stroke-width=".8"/>` + food + `</g><path d="${rr(x, y, w, h, 3)}" fill="url(#${u}-gl)"/><path d="M${x + 4} ${y + h - 4}L${x + w * .35} ${y + 3}" stroke="#fff" stroke-opacity=".12" stroke-width="5"/>`;
    return s;
  }
  function pizza(o, cx, cy, rx) {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${n1(rx * .22)}" fill="#c7813c"/><ellipse cx="${cx}" cy="${n1(cy - .6)}" rx="${n1(rx - 2.5)}" ry="${n1(rx * .17)}" fill="${o.on ? "#e0632f" : "#c9532a"}"/>` +
      [[-.5, 0], [-.1, -.3], [.3, .1], [.6, -.2], [0, .4]].map((p) => `<ellipse cx="${n1(cx + p[0] * rx)}" cy="${n1(cy + p[1] * rx * .12)}" rx="2.2" ry=".9" fill="#f3e0a6"/>`).join("") +
      [[-.3, .1], [.15, -.15], [.45, .25]].map((p) => `<ellipse cx="${n1(cx + p[0] * rx)}" cy="${n1(cy + p[1] * rx * .12)}" rx="1.6" ry=".7" fill="#7a1c18"/>`).join("");
  }
  const fries = (o, x, y, w) => { let s = ""; for (let i = 0; i < 11; i++) { const fx = x + 3 + (i * 7.3) % (w - 6), a = (i * 37) % 50 - 25; s += `<rect x="${n1(fx)}" y="${n1(y - 7 + (i % 3) * 2)}" width="2.4" height="11" rx=".8" fill="${i % 2 ? "#e9b84e" : "#f5cf66"}" transform="rotate(${a} ${n1(fx + 1)} ${n1(y)})"/>`; } return s; };

  const icons = [
    ic("drip", "Drip coffee maker", [BK, SS, WH, RED, CREAM], (o) => { const V = CF(o), wy = !o.mf ? (o.on ? .55 : .2) : 1 - (V.wl || 0), wh = !o.mf ? (o.on ? .45 : .8) : V.wl || 0, u = o.uid, car = "M64 100H104L106 106Q115 122 111 140Q109 150 99 150H69Q59 150 57 140Q53 122 62 106Z", cid = u + "-car";
      return svg(o, room(o, "sub", "quartz") + plug(o, 170, 104, [150, 160]) + sh(o, 100, 164, 64, 5) +
        face(o, rr(42, 148, 116, 16, 5)) + `<ellipse cx="84" cy="151" rx="30" ry="3.5" fill="${V.PL.on ? REDL : "#1a1c20"}" opacity="${V.PL.on ? .5 : 1}"/>` + warmPool(V.PL, 84, 151, 36, 6, .9) +
        face(o, rr(116, 40, 40, 112, 7), "c") + `<path d="${rr(124, 50, 7, 34, 3)}" fill="#0c0f14"/>${o.mf && V.wl == null ? "" : `<path d="${rr(124.6, 50 + 34 * wy, 5.8, 34 * wh, 2.6)}" fill="url(#${u}-wt)"/>`}<path d="${rr(124, 50, 7, 34, 3)}" fill="url(#${u}-gl)"/>` +
        face(o, rr(40, 32, 116, 36, 10)) + `<path d="M46 36H150" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>` + groove("M44 56H152") +
        mat(o, "M58 68H110L104 80H64Z", "blk") + `<rect x="80" y="80" width="8" height="3" rx="1" fill="#0c0d10"/>` +
        digits(V.D, 136, 98, 6, "7:30", AMB) + btn(130, 116, 3.3, true) + btn(142, 116, 3.3, true) + led(V.D, 136, 128, 1.5, REDL, "hr") +
        `<clipPath id="${cid}"><path d="${car}"/></clipPath>` + drips(V.B, "M84 83V118", "#3a1d0c", 2.4) +
        `<g clip-path="url(#${cid})">${(V.mf ? V.cup : o.on) ? `<rect ${fillCls(V.B)} x="50" y="${n1(150 - 36 * (.4 + .6 * (V.mf ? V.C.level : o.level)))}" width="70" height="${n1(36 * (.4 + .6 * (V.mf ? V.C.level : o.level)))}" fill="url(#${u}-cof)"/>` : `<rect x="50" y="144" width="70" height="8" fill="url(#${u}-cof)" opacity=".8"/>`}</g>` +
        glass(o, car) + `<path d="M61 112Q57 126 60 140" stroke="#fff" stroke-opacity=".45" stroke-width="2" fill="none" stroke-linecap="round"/>` +
        mat(o, rr(60, 94, 50, 9, 3), "blk") + `<path d="M62 96H108" stroke="#fff" stroke-opacity=".25"/>` +
        `<path d="M58 104Q42 106 43 120Q44 134 58 136" fill="none" stroke="#14161a" stroke-width="6" stroke-linecap="round"/><path d="M56 106Q46 108 46 120" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.2"/>` +
        hl(119, 46, 119, 148, 1.4, .3)); }, PARTS_DRIP),

    ic("pod", "Pod brewer", [BK, WH, RED, NAVY, SAGE, SS], (o) => { const V = CF(o), u = o.uid;
      return svg(o, room(o, "zel", "wood") + plug(o, 30, 96, [62, 158]) + sh(o, 104, 165, 52, 5) +
        `<path d="${rr(140, 46, 18, 106, 6)}" fill="url(#${u}-glb)"/>${!o.mf ? `<path d="${rr(141, 70, 16, 81, 5)}" fill="url(#${u}-wt)"/>` : V.wl == null ? "" : `<path d="${rr(141, +n1(151 - 100 * Math.max(.1, V.wl)), 16, +n1(100 * Math.max(.1, V.wl)), 5)}" fill="url(#${u}-wt)"/>`}<path d="${rr(140, 46, 18, 106, 6)}" fill="none" stroke="#e8f6ff" stroke-opacity=".4"/>` + (V.B.on ? bubbles(V.B, [[146, 140, 1], [151, 130, 1.2], [148, 118, .9]]) : "") +
        face(o, rr(66, 30, 80, 132, 14), "c") + face(o, "M60 44Q60 28 76 28H138Q150 28 150 42V58H60Z") + groove("M60 58H150") +
        `<path d="${rr(86, 32, 40, 6, 3)}" fill="#000" fill-opacity=".22"/>` +
        face(o, rr(60, 58, 90, 24, 9)) + `<path d="M66 60H144" stroke="#fff" stroke-opacity=".35"/>` +
        `<circle cx="105" cy="70" r="7" fill="#0c0e12"/>` + (V.D.on ? `<circle class="${P}pulse" cx="105" cy="70" r="12" fill="url(#${u}-hb)"/>` : "") + `<circle cx="105" cy="70" r="5.2" fill="none" stroke="${V.D.on ? BLU : "#4a5059"}" stroke-width="1.4"/><circle cx="105" cy="70" r="3" fill="url(#${u}-blc)"/>` +
        btn(80, 70, 2.6, true) + btn(130, 70, 2.6, true) +
        mat(o, rr(72, 82, 66, 66, 6), "blk") + `<path d="${rr(72, 82, 66, 66, 6)}" fill="url(#${u}-gl)" opacity=".5"/>` + `<path d="${rr(100, 82, 10, 6, 2)}" fill="url(#${u}-st)"/>` +
        stream(V.B, "M105 88V124", "#5a2d12", 2.6, "#c98a55") + mug(o, 90, 124, 30, 24, "#e9e3d6", V.cup) +
        mat(o, rr(70, 148, 70, 10, 3), "st", 1) + `<path d="${rr(76, 149, 58, 4, 1.5)}" fill="url(#${u}-grt)"/>` +
        steam(V.S, 105, 120, 3, 3.5) + hl(70, 64, 70, 156, 1.3, .3)); }, PARTS_POD),

    ic("espresso", "Espresso machine", [SS, BK, CREAM, RED, MINT, WH], (o) => { const V = CF(o), u = o.uid, ga = !o.mf ? (o.on ? -110 + 180 * (.55 + .4 * o.level) : -110) : V.D.on ? -110 + 180 * (V.B.on ? .9 : V.H.on ? .35 : .65) : -110;
      return svg(o, room(o, "dark", "granite") + sh(o, 100, 165, 66, 5) +
        face(o, rr(40, 50, 120, 108, 6)) + `<path d="M44 52H156" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>` +
        `<path d="M40 42H160" stroke="url(#${u}-crh)" stroke-width="3" stroke-linecap="round"/><path d="M46 42V50M154 42V50" stroke="#a7adb4" stroke-width="2"/>` +
        (o.mf && V.PL.on ? `<path d="M48 41H152" stroke="#ff7a3a" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>` + warmPool(V.PL, 76, 40, 30, 6, .8) : "") + mug(o, 60, 38, 13, 8, "#f4f2ee") + mug(o, 80, 38, 13, 8, "#f4f2ee") +
        `<circle cx="132" cy="76" r="13" fill="url(#${u}-cr)"/><circle cx="132" cy="76" r="10.5" fill="#f6f4ee"/><path d="M124.5 83.5A10.5 10.5 0 0 1 132 65.5" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="3"/>` +
        `<path d="M139.4 70.6A10.5 10.5 0 0 1 141.8 79" fill="none" stroke="#d94a3e" stroke-width="2"/>` + [-110, -65, -20, 25, 70].map((a) => { const t = a * Math.PI / 180; return `<path d="M${n1(132 + Math.sin(t) * 8)} ${n1(76 - Math.cos(t) * 8)}L${n1(132 + Math.sin(t) * 10)} ${n1(76 - Math.cos(t) * 10)}" stroke="#333" stroke-width=".7"/>`; }).join("") +
        `<path d="M132 76L132 67" stroke="#c8323a" stroke-width="1.3" stroke-linecap="round" transform="rotate(${n1(ga)} 132 76)"/><circle cx="132" cy="76" r="1.6" fill="#333"/><circle cx="132" cy="76" r="10.5" fill="url(#${u}-gl)"/>` +
        btn(56, 66, 3.2) + btn(68, 66, 3.2) + led(V.D, 80, 66, 1.4, ORNG, "ho") +
        mat(o, rr(74, 82, 34, 12, 3), "crh") + mat(o, "M70 94H112L108 102H74Z", "crh") +
        `<path d="M74 98L36 110L38 116L76 104Z" fill="#111317"/><path d="${"M40 108L22 114Q18 116 20 120Q22 122 26 121L44 116Z"}" fill="url(#${u}-wd)"/><path d="M24 116L42 110" stroke="#fff" stroke-opacity=".3"/>` +
        mat(o, rr(84, 102, 14, 5, 1.5), "crh") + stream(V.B, "M87.5 107V132", "#7a4322", 1.8, "#e6b479") + stream(V.B, "M94.5 107V132", "#7a4322", 1.8, "#e6b479") +
        `<path d="M80 126H102L100 146Q99 148 97 148H85Q83 148 82 146Z" fill="url(#${u}-glb)"/><path d="M81.4 ${V.cup ? 132 : 141}H100.6L100 146Q99 148 97 148H85Q83 148 82 146Z" fill="url(#${u}-cof)"/><path d="M81.4 ${V.cup ? 132 : 141}H100.6V${V.cup ? 135 : 142.5}H81.6Z" fill="url(#${u}-crm)"/><path d="M80 126H102L100 146Q99 148 97 148H85Q83 148 82 146Z" fill="none" stroke="#e8f6ff" stroke-opacity=".5" stroke-width=".8"/>` +
        `<path d="M142 92V102Q142 108 146 112L150 136" fill="none" stroke="url(#${u}-crh)" stroke-width="3.4" stroke-linecap="round"/>` + knob(o, 142, 92, 4.5) +
        (V.B.on ? (o.anim ? [0, 1, 2].map((i) => `<circle class="${P}stl" cx="150" cy="138" r="4" fill="url(#${u}-stm)" style="animation-duration:${dur(o, 2.4, 1)}s;animation-delay:-${i * .8}s"/>`).join("") : `<path d="M150 138c-6 -3 -6 -9 -12 -12" stroke="#fff" stroke-opacity=".3" stroke-width="3" fill="none" stroke-linecap="round"/>`) : "") +
        mat(o, rr(48, 148, 104, 10, 3), "st", 1) + `<path d="${rr(54, 149, 92, 4, 1.5)}" fill="url(#${u}-grt)"/>` + steam(V.S, 91, 124, 2, 3) + hl(43, 56, 43, 154, 1.4, .3)); }, PARTS_ESP),

    ic("bean", "Bean-to-cup", [BK, SS, WH, SL], (o) => { const V = CF(o), D = V.D, u = o.uid, act = Math.min(3, Math.floor(o.level * 4)), cup = "M88 108H112L110 148H90Z", cid = u + "-lt";
      return svg(o, room(o, "sub", "marble") + plug(o, 26, 100, [52, 158]) + sh(o, 100, 165, 58, 5) +
        face(o, rr(50, 30, 100, 132, 10)) + `<path d="M56 32H144" stroke="#fff" stroke-opacity=".5"/>` +
        `<path d="M62 30Q62 18 82 18H118Q138 18 138 30Z" fill="#2a1a10" fill-opacity=".85"/>` + [[70, 26], [78, 24], [86, 27], [94, 23], [102, 26], [110, 24], [118, 27], [126, 26], [74, 21], [90, 20], [106, 20], [122, 22]].map((p, i) => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="3" ry="2" fill="${i % 2 ? "#6b3c1d" : "#4e2a12"}" transform="rotate(${i * 30} ${p[0]} ${p[1]})"/>`).join("") +
        `<path d="M62 30Q62 18 82 18H118Q138 18 138 30Z" fill="url(#${u}-gl)" stroke="#fff" stroke-opacity=".3"/>` +
        mat(o, rr(60, 40, 80, 32, 5), "blk") + `<path d="${rr(60, 40, 80, 32, 5)}" fill="url(#${u}-gl)"/>` +
        [0, 1, 2, 3].map((i) => { const x = 70 + i * 20, lit = D.on && i === act, c = D.on ? (lit ? "#ffffff" : "#8fb6d8") : "#3d434c";
          return (lit ? `<circle class="${P}pulse" cx="${x}" cy="52" r="9" fill="url(#${u}-hb)"/>` : "") + `<path d="M${x - 4} ${48 - i % 2}H${x + 4}L${x + 3} 56H${x - 3}Z" fill="none" stroke="${c}" stroke-width="1"/><path d="M${x + 4} 50h1.5a1.5 1.5 0 0 1 0 3H${x + 3.5}" fill="none" stroke="${c}" stroke-width=".8"/>`; }).join("") +
        [0, 1, 2, 3, 4].map((i) => `<rect x="${86 + i * 6}" y="63" width="4" height="3" rx="1" fill="${D.on && i <= Math.round(o.level * 4) ? AMB : "#2c3138"}"/>`).join("") +
        mat(o, rr(58, 78, 84, 72, 5), "blk") + `<path d="${rr(58, 78, 84, 72, 5)}" fill="url(#${u}-gl)" opacity=".4"/>` +
        mat(o, rr(84, 80, 32, 12, 3), "crh") + mat(o, rr(90, 92, 6, 4, 1), "crh") + mat(o, rr(104, 92, 6, 4, 1), "crh") +
        stream(V.B, "M93 96V128", "#6b3a1e", 1.8, "#e6b479") + stream(V.B, "M107 96V128", "#6b3a1e", 1.8, "#e6b479") +
        `<clipPath id="${cid}"><path d="${cup}"/></clipPath><g clip-path="url(#${cid})">` +
        (V.cup ? `<g ${fillCls(V.B)}><rect x="86" y="118" width="28" height="32" fill="#f4ead8"/><rect x="86" y="128" width="28" height="22" fill="#c08454"/><rect x="86" y="138" width="28" height="12" fill="url(#${u}-cof)"/></g>` : `<rect x="86" y="140" width="28" height="10" fill="#f4ead8"/><rect x="86" y="144" width="28" height="6" fill="#c08454"/>`) +
        `</g>` + glass(o, cup) + `<path d="M91 112L92 144" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>` +
        mat(o, rr(62, 150, 76, 10, 3), "st", 1) + `<path d="${rr(68, 151, 64, 4, 1.5)}" fill="url(#${u}-grt)"/>` + steam(V.S, 100, 106, 2, 3) + hl(53, 36, 53, 156, 1.4, .3)); }, PARTS_BEAN),

    ic("goose", "Gooseneck kettle", [BK, WH, SS, PINK, SAGE, COP], (o) => { const V = CF(o), u = o.uid, t = !o.mf ? String(Math.round(160 + 52 * o.level)) : V.t == null ? "" : String(Math.round(V.t)), D = o.mf ? Object.assign({}, V.D, { on: V.D.on && V.t != null }) : o;
      return svg(o, room(o, "zel", "quartz") + sh(o, 100, 165, 58, 5) + board(o, 132, 70, 40, 72) +
        mat(o, rr(56, 146, 92, 16, 6), "blk") + `<path d="M60 147H144" stroke="#fff" stroke-opacity=".2"/>` + digits(D, 92, 154, 6, t || "888", "#f4f1ea") + knob(o.mf ? V.D : o, 128, 154, 5.5, true) +
        ((o.mf ? V.H.on : o.on) ? `<g opacity=".9"><path class="${P}pulse" d="M60 146H144" stroke="${ORNG}" stroke-width="1.6"/></g>` : "") +
        `<path d="M76 140C52 140 50 112 56 98C60 88 54 80 40 80" fill="none" stroke="${pal(o.color).k}" stroke-width="6" stroke-linecap="round"/><path d="M76 140C52 140 50 112 56 98C60 88 54 80 40 80" fill="none" stroke="${pal(o.color).m}" stroke-width="4" stroke-linecap="round"/><path d="M70 138C54 136 52 114 57 100" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>` +
        `<path d="M126 98H140Q150 98 150 108V128Q150 140 136 140H128" fill="none" stroke="${pal(o.color).k}" stroke-width="7.5" stroke-linecap="round"/><path d="M126 98H140Q150 98 150 108V128Q150 140 136 140H128" fill="none" stroke="${pal(o.color).d}" stroke-width="5.5" stroke-linecap="round"/>` +
        face(o, "M72 146L74 100Q74 92 82 92H118Q126 92 126 100L128 146Z", "c") + `<path d="M74 140H128" stroke="#000" stroke-opacity=".2"/>` +
        face(o, rr(80, 86, 40, 8, 3), "tp") + `<path d="${rr(96, 79, 8, 8, 3)}" fill="url(#${u}-wd)"/>` + hl(80, 100, 79, 140, 2.6, .35) +
        `<circle cx="100" cy="108" r="5.5" fill="url(#${u}-cr)"/><circle cx="100" cy="108" r="4" fill="#f6f4ee"/><path d="M100 108L${(o.mf ? V.K.on : o.on) ? 103 : 97.5} ${(o.mf ? V.K.on : o.on) ? 105 : 105.5}" stroke="#c8323a" stroke-width=".9"/>` +
        steam(o.mf ? V.K : o, 40, 76, 3, 3.2, "stl")); }, PARTS_GOOSE),

    ic("glasskettle", "Glass kettle", [SS, BK, WH, RED, MINT], (o) => { const V = CF(o), wdy = o.mf ? n1(52 * (1 - (V.wl == null ? 0 : V.wl))) : null, u = o.uid, k = "M68 146L72 80Q100 72 128 80L132 146Z", kid = u + "-gk", p = pal(o.color);
      return svg(o, room(o, "sub", "wood") + plug(o, 176, 100, [146, 158]) + sh(o, 100, 165, 54, 5) +
        face(o, rr(58, 148, 84, 14, 6)) + `<path d="M62 149H138" stroke="#fff" stroke-opacity=".4"/>` + led(V.D, 100, 155, 1.5) +
        `<path d="M128 84H140Q150 84 150 96V126Q150 138 138 138H132" fill="none" stroke="${p.k}" stroke-width="8" stroke-linecap="round"/><path d="M128 84H140Q150 84 150 96V126Q150 138 138 138H132" fill="none" stroke="${p.d}" stroke-width="6" stroke-linecap="round"/><path d="M144 92V128" stroke="#fff" stroke-opacity=".3" stroke-width="1.3" stroke-linecap="round"/>` +
        `<clipPath id="${kid}"><path d="${k}"/></clipPath><g clip-path="url(#${kid})">` + (o.mf && V.wl == null ? "" : (wdy ? `<g transform="translate(0 ${wdy})">` : "") + `<rect x="60" y="92" width="80" height="56" fill="url(#${u}-wt)"/>` +
        ((o.mf ? V.K.on : o.on) ? `<rect x="60" y="92" width="80" height="56" fill="${BLU}" opacity="${n1(.12 + .2 * o.level)}"/><ellipse class="${P}pulse" cx="100" cy="146" rx="40" ry="22" fill="url(#${u}-hb)"/>` : "") +
        `<path d="M60 92q5 -2 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0" fill="none" stroke="#e6f6ff" stroke-opacity=".7" stroke-width=".9"/>` + (wdy ? `</g>` : "") +
        bubbles(o.mf ? V.H : o, [[80, 136, 1.6], [92, 140, 2], [104, 134, 1.4], [116, 138, 1.8], [86, 126, 1.2], [110, 124, 1.5], [98, 118, 1.1], [120, 128, 1], [76, 130, 1.3], [102, 142, 1.7]])) + `</g>` +
        glass(o, k) + `<path d="M76 86L75 136" stroke="#fff" stroke-opacity=".45" stroke-width="2.2" stroke-linecap="round"/>` + [100, 110, 120, 130].map((y) => `<path d="M118 ${y}H124" stroke="#fff" stroke-opacity=".4" stroke-width=".6"/>`).join("") +
        `<path d="M72 82L52 76L56 84L72 92Z" fill="url(#${u}-glb)" stroke="#e8f6ff" stroke-opacity=".4" stroke-width=".7"/>` +
        mat(o, "M70 140H130L132 148H68Z", "crh") + face(o, "M70 80Q100 70 130 80V84Q100 76 70 84Z", "tp") + `<path d="M88 76Q100 68 112 76" fill="url(#${u}-crh)"/>` + `<path d="${rr(96, 68, 8, 5, 2)}" fill="${p.d}"/>` +
        steam(o.mf ? V.K : o, 52, 72, 3, 3.2, "stl")); }, "Color", PARTS_GLASSK),

    ic("retrokettle", "Retro kettle", [CREAM, RED, MINT, NAVY, PINK, BK], (o) => { const V = CF(o), u = o.uid, ga = !o.mf ? (o.on ? -70 + 140 * o.level : -70) : V.t == null ? -70 : -70 + 140 * Math.max(0, Math.min(1, (V.t - 50) / 162));
      return svg(o, room(o, "sub", "wood") + sh(o, 100, 165, 54, 5) +
        mat(o, rr(56, 152, 88, 10, 5), "crh") +
        `<path d="M78 98Q72 70 100 62Q128 70 122 98" fill="none" stroke="#1a1c20" stroke-width="7" stroke-linecap="round"/><path d="M80 94Q76 72 100 66" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.3"/>` +
        `<path d="M72 128Q52 124 46 100" fill="none" stroke="${pal(o.color).k}" stroke-width="9" stroke-linecap="round"/><path d="M72 128Q52 124 46 100" fill="none" stroke="${pal(o.color).m}" stroke-width="7" stroke-linecap="round"/><path d="M66 124Q52 120 48 104" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="46" cy="99" rx="4" ry="1.6" fill="#1a1c20" transform="rotate(-20 46 99)"/>` +
        face(o, "M60 152Q56 104 100 88Q144 104 140 152Z", "c") + `<path d="M70 120Q74 100 96 92" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>` +
        mat(o, "M58 140Q100 136 142 140L142 148Q100 144 58 148Z", "crh") + mat(o, "M84 92Q100 86 116 92V96Q100 90 84 96Z", "crh") + `<circle cx="100" cy="86" r="5" fill="#1a1c20"/><circle cx="98.5" cy="84.5" r="1.4" fill="#fff" fill-opacity=".3"/>` +
        `<circle cx="100" cy="118" r="11" fill="url(#${u}-cr)"/><circle cx="100" cy="118" r="8.6" fill="#f7f4ec"/><path d="M93 121A8 8 0 0 1 107 121" fill="none" stroke="#7fb5e0" stroke-width="1.6"/><path d="M103.4 113A8 8 0 0 1 107 121" fill="none" stroke="#d94a3e" stroke-width="1.6"/>` +
        `<path d="M100 118V111.5" stroke="#222" stroke-width="1" stroke-linecap="round" transform="rotate(${n1(ga)} 100 118)"/><circle cx="100" cy="118" r="1.2" fill="#222"/><circle cx="100" cy="118" r="8.6" fill="url(#${u}-gl)"/>` +
        led(o.mf ? V.H : o, 128, 146, 1.3, REDL, "hr") + steam(o.mf ? V.K : o, 45, 95, 3, 3.4, "stl")); }, PARTS_RETROK),

    ic("toaster2", "2-slice toaster", [SS, BK, WH, RED, MINT, CREAM], (o) => { const u = o.uid, b = rr(54, 96, 92, 66, 14), cid = u + "-ts";
      return svg(o, room(o, "sub", "quartz") + plug(o, 26, 100, [56, 158]) + sh(o, 100, 165, 54, 5) +
        `<clipPath id="${cid}"><rect x="40" y="40" width="120" height="58"/></clipPath><g clip-path="url(#${cid})"><g class="${o.on ? P + "pop" : ""}">${toastSet(o, [70, 72], 98, 58, !o.on)}</g></g>` +
        face(o, "M58 98Q58 90 70 90H130Q142 90 142 98Z", "tp") + `<path d="${rr(68, 92.4, 64, 2.6, 1.2)}" fill="#07080a"/><path d="${rr(70, 95.6, 60, 2.4, 1.2)}" fill="#07080a"/>` +
        (o.on ? slotGlow(o, rr(68, 92.4, 64, 2.6, 1.2)) + slotGlow(o, rr(70, 95.6, 60, 2.4, 1.2)) : "") + shimmer(o, 70, 88, 60) +
        face(o, b, "c") + `<path d="M62 100H138" stroke="#fff" stroke-opacity=".55"/>` + hl(64, 104, 64, 152, 2.2, .35) +
        `<path d="${rr(126, 104, 5, 40, 2.4)}" fill="#0b0c10"/>` + mat(o, rr(122, o.on ? 136 : 104, 14, 6, 3), "blc") +
        knob(o, 78, 132, 6, true, 7) + `<path d="${rr(92, 140, 10, 5, 2)}" fill="#1a1c20"/><path d="${rr(106, 140, 10, 5, 2)}" fill="#1a1c20"/>` + led(o, 97, 135, 1.1, AMB, "ha") + led(o, 111, 135, 1.1, BLU) +
        foot(62, 161) + foot(130, 161)); }),

    ic("toaster4", "Retro 4-slice", [CREAM, RED, MINT, NAVY, PINK, SS], (o) => { const u = o.uid, b = "M48 96H152Q170 96 170 116V144Q170 162 152 162H48Q30 162 30 144V116Q30 96 48 96Z", cid = u + "-t4";
      return svg(o, room(o, "zel", "marble") + sh(o, 100, 165, 76, 5) +
        `<clipPath id="${cid}"><rect x="24" y="30" width="152" height="62"/></clipPath><g clip-path="url(#${cid})"><g class="${o.on ? P + "pop" : ""}">${toastSet(o, [44, 46], 94, 48, !o.on)}</g><g class="${o.on ? P + "pop" : ""}" style="animation-delay:-.3s">${toastSet(o, [106, 108], 94, 48, !o.on)}</g></g>` +
        face(o, "M36 98Q38 86 56 86H144Q162 86 164 98Z", "tp") +
        [[44, 88.4, 50], [46, 92, 46], [106, 88.4, 50], [108, 92, 46]].map((q) => o.on ? slotGlow(o, rr(q[0], q[1], q[2], 2.4, 1.1)) : `<path d="${rr(q[0], q[1], q[2], 2.4, 1.1)}" fill="#07080a"/>`).join("") + shimmer(o, 44, 84, 112) +
        face(o, b, "c") + `<path d="M46 97H154" stroke="#fff" stroke-opacity=".6"/>` +
        mat(o, "M30.5 122H169.5V126H30.5Z", "cr") + mat(o, "M30.5 130H169.5V131.6H30.5Z", "cr") + `<path d="M31 122H169" stroke="#fff" stroke-opacity=".75" stroke-width=".6"/>` +
        `<path d="M44 104Q40 112 40 122" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" stroke-linecap="round"/>` +
        `<path d="${rr(37, 104, 4, 40, 2)}" fill="#0b0c10"/><path d="${rr(159, 104, 4, 40, 2)}" fill="#0b0c10"/>` + mat(o, rr(33, o.on ? 138 : 104, 12, 7, 3.5), "cr") + mat(o, rr(155, o.on ? 138 : 104, 12, 7, 3.5), "cr") +
        knob(o, 100, 146, 6.5, true, 7) + led(o, 80, 146, 1.2, AMB, "ha") + led(o, 120, 146, 1.2, AMB, "ha") +
        `<path d="${rr(46, 160, 14, 5, 2.5)}" fill="#14161a"/><path d="${rr(140, 160, 14, 5, 2.5)}" fill="#14161a"/>`); }),

    ic("toasteroven", "Toaster oven", [SS, BK, WH, RED, SL], (o) => { const u = o.uid;
      return svg(o, room(o, "dark", "quartz") + plug(o, 178, 92, [162, 158]) + sh(o, 100, 165, 74, 5) + warmPool(o, 80, 166, 50, 6, .5) +
        face(o, rr(30, 66, 140, 94, 6)) + `<path d="M34 68H166" stroke="#fff" stroke-opacity=".5"/>` + `<path d="${rr(40, 64, 60, 3, 1.5)}" fill="url(#${u}-vent)"/>` +
        `<path d="${rr(36, 72, 94, 82, 4)}" fill="#000" fill-opacity=".25"/>` + chamber(o, 40, 82, 86, 66, pizza(o, 83, 124, 30)) +
        mat(o, rr(44, 75, 78, 4, 2), "crh") + `<path d="M48 79V82M118 79V82" stroke="#8f969e" stroke-width="2"/>` +
        groove("M132 68V160") + digits(o, 150, 84, 6, mm(Math.round(4 + 26 * o.level)), AMB) + knob(o, 150, 104, 6.5, true, 7) + knob(o, 150, 124, 6.5, true) + knob(o, 150, 143, 6.5, true) +
        foot(36, 159) + foot(156, 159) + hl(33, 72, 33, 156, 1.4, .3)); }),

    ic("airfryer", "Air fryer", [BK, WH, SAGE, CREAM, SS, PINK], (o) => { const u = o.uid, t = String(Math.round(300 + 10 * Math.round(10 * o.level)));
      return svg(o, room(o, "sub", "wood") + plug(o, 170, 98, [140, 158]) + sh(o, 100, 165, 54, 5) +
        face(o, "M58 160V70Q58 46 84 44H116Q142 46 142 70V160Z", "c") + `<path d="M66 50Q74 46 90 46" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
        `<path d="${rr(84, 44, 32, 3, 1.5)}" fill="url(#${u}-vent)"/>` + shimmer(o, 84, 42, 32) +
        mat(o, rr(70, 56, 60, 32, 10), "blk") + `<path d="${rr(70, 56, 60, 32, 10)}" fill="url(#${u}-gl)"/>` + digits(o, 92, 70, 8, t, REDL, false) +
        `<g transform="translate(118 64)"><g class="${o.on ? P + "spin" : ""}" style="animation-duration:${dur(o, 1.2, .8)}s">` + [0, 90, 180, 270].map((a) => `<path d="M0 0Q2 -3 0 -4.5Q-2 -3 0 0Z" fill="${o.on ? ORNG : "#3d434c"}" transform="rotate(${a})"/>`).join("") + `</g></g>` +
        btn(80, 81, 2, true) + btn(92, 81, 2, true) + btn(104, 81, 2, true) + led(o, 118, 80, 1.3, ORNG, "ho") +
        groove("M60 98H140") + face(o, rr(62, 100, 76, 56, 10), "v") + groove("M64 152H136") +
        mat(o, "M88 112H112Q116 112 116 116V140Q116 146 110 146H90Q84 146 84 140V116Q84 112 88 112Z", "blc") + `<path d="M88 114H112" stroke="#fff" stroke-opacity=".3"/>` + `<path d="${rr(94, 116, 12, 4, 2)}" fill="#3a3f48"/>` +
        hl(62, 72, 62, 150, 1.6, .3) + foot(64, 159) + foot(128, 159)); }),

    ic("dualfryer", "Dual-basket fryer", [BK, SS, WH, SL, SAGE], (o) => { const u = o.uid;
      return svg(o, room(o, "dark", "granite") + sh(o, 100, 165, 74, 5) +
        face(o, rr(30, 54, 140, 108, 14)) + `<path d="M40 56H160" stroke="#fff" stroke-opacity=".5"/>` + `<path d="${rr(70, 54, 60, 3, 1.5)}" fill="url(#${u}-vent)"/>` + shimmer(o, 74, 52, 52) +
        mat(o, rr(44, 62, 112, 20, 5), "blk") + `<path d="${rr(44, 62, 112, 20, 5)}" fill="url(#${u}-gl)"/>` +
        digits(o, 66, 72, 7, String(Math.round(330 + 70 * o.level)), BLU, false) + digits(o, 134, 72, 7, "1:" + ("0" + Math.round(5 + 50 * o.level)).slice(-2), BLU, false) + led(o, 100, 72, 1.6, GRN, "hg") +
        [36, 102].map((x, i) => `<path d="${rr(x, 88, 62, 68, 9)}" fill="#000" fill-opacity=".3"/>` + face(o, rr(x + .5, 88.5, 61, 67, 9)) +
          chamber(o, x + 8, 94, 46, 28, fries(o, x + 8, 120, 46), i) + mat(o, rr(x + 14, 128, 34, 16, 5), "blc") + `<path d="M${x + 18} 130H${x + 44}" stroke="#fff" stroke-opacity=".25"/>`).join("") +
        foot(38, 161) + foot(154, 161) + hl(33, 60, 33, 156, 1.4, .3)); }),

    ic("mixer", "Stand mixer", [RED, MINT, CREAM, NAVY, PINK, BK], (o) => { const u = o.uid, d = dur(o, .9, .6), sp = o.on ? 124 + 12 * o.level : 124;
      return svg(o, room(o, "sub", "wood") + plug(o, 178, 96, [158, 158]) + sh(o, 104, 165, 70, 5) +
        face(o, "M38 162Q38 150 52 148H148Q164 150 164 162Z", "tp") + `<path d="M44 151H158" stroke="#fff" stroke-opacity=".4"/>` +
        face(o, "M118 150Q114 112 122 92H152Q158 124 158 150Z", "c") +
        `<path d="M50 112H118" stroke="url(#${u}-st)" stroke-width="2"/>` +
        `<ellipse cx="84" cy="110" rx="32" ry="6" fill="#2a2e35"/><ellipse cx="84" cy="111" rx="29" ry="4.6" fill="#e9dcc0"/>` +
        `<ellipse class="${o.on ? P + "swirl" : ""}" cx="84" cy="111" rx="20" ry="3" fill="none" stroke="#c8b48a" stroke-width="1" stroke-dasharray="8 6" style="animation-duration:${d}s"/>` +
        `<rect x="82" y="94" width="4" height="12" fill="url(#${u}-st)"/><g class="${o.on ? P + "twist" : ""}" style="animation-duration:${d}s"><path d="M84 104L72 112Q70 116 74 116H94Q98 116 96 112Z" fill="url(#${u}-stv)" stroke="#5a6067" stroke-width=".6"/><path d="M78 112H90" stroke="#5a6067" stroke-width="1.6"/></g>` +
        `<path d="M52 110Q52 142 70 150H98Q116 142 116 110Q100 116 84 116Q68 116 52 110Z" fill="url(#${u}-st)"/><path d="M52 110Q52 142 70 150H98Q116 142 116 110Q100 116 84 116Q68 116 52 110Z" fill="url(#${u}-br)"/>` +
        `<path d="M60 118Q62 138 74 146" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/><path d="M116 116Q128 116 126 128Q124 136 112 136" fill="none" stroke="url(#${u}-st)" stroke-width="3"/><path d="M52 110A32 6 0 0 0 116 110" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>` +
        `<g class="${o.on ? P + "wob" : ""}">` + face(o, "M44 72Q42 96 66 98H152Q164 96 164 78Q164 56 140 52H74Q46 52 44 72Z", "v") +
        `<path d="M54 60Q66 54 90 54H138" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>` + groove("M60 98Q100 100 150 98") +
        mat(o, "M44 70Q43 82 48 90L54 89Q50 80 51 70Z", "crh") + `<circle cx="47" cy="78" r="5" fill="url(#${u}-cr)"/>` +
        `<path d="M146 70L${n1(146 + Math.cos(sp * Math.PI / 180) * 14)} ${n1(70 - Math.sin(sp * Math.PI / 180) * 14)}" stroke="url(#${u}-st)" stroke-width="2.6" stroke-linecap="round"/><circle cx="146" cy="70" r="3" fill="url(#${u}-cr)"/>` + `</g>` +
        led(o, 140, 88, 1.1, "#ffffff", "hb")); }),

    ic("blender", "Blender", [BK, SS, RED, WH, NAVY], (o) => { const u = o.uid, jar = "M66 40H134L127 124H73Z", jid = u + "-jr", d = dur(o, .7, .45);
      const fruit = [[86, 104, "#e2364a", 4], [104, 98, "#f4d35e", 3.6], [114, 110, "#7a3fb0", 3.2], [94, 114, "#e2364a", 3.4], [100, 108, "#6cbf4c", 3]];
      return svg(o, room(o, "zel", "quartz") + plug(o, 28, 96, [62, 158]) + sh(o, 100, 165, 50, 5) +
        `<clipPath id="${jid}"><path d="${jar}"/></clipPath><g clip-path="url(#${jid})">` +
        (o.on ? `<path d="M66 ${n1(80 - 20 * o.level)}Q100 ${n1(96 - 10 * o.level)} 134 ${n1(80 - 20 * o.level)}V126H66Z" fill="#c2385c" opacity=".85"/><path d="M66 ${n1(80 - 20 * o.level)}Q100 ${n1(96 - 10 * o.level)} 134 ${n1(80 - 20 * o.level)}V126H66Z" fill="url(#${u}-edge)"/>` +
          `<path class="${P}swirl" d="M78 ${n1(84 - 18 * o.level)}Q100 118 100 120Q100 118 122 ${n1(84 - 18 * o.level)}" fill="none" stroke="#f7a6bd" stroke-opacity=".7" stroke-width="1.6" stroke-dasharray="6 4" style="animation-duration:${d}s"/>` +
          fruit.map((f, i) => `<circle class="${P}orb" cx="${f[0]}" cy="${f[1] - 6}" r="${f[3] * .8}" fill="${f[2]}" style="animation-duration:${d}s;animation-delay:-${n1(i * .19)}s"/>`).join("")
          : `<rect x="66" y="108" width="68" height="18" fill="#f2e4c8" opacity=".55"/>` + fruit.map((f) => `<circle cx="${f[0]}" cy="${f[1] + 8}" r="${f[3]}" fill="${f[2]}"/><circle cx="${f[0] - 1}" cy="${f[1] + 7}" r="${f[3] * .35}" fill="#fff" fill-opacity=".35"/>`).join("")) +
        `<g transform="translate(100 120)"><g class="${o.on ? P + "twist" : ""}" style="animation-duration:${(d / 3).toFixed(2)}s"><path d="M-14 -1L0 1L14 -3L0 3Z" fill="url(#${u}-stv)"/></g></g><rect x="98" y="120" width="4" height="6" fill="#8f969e"/></g>` +
        glass(o, jar) + `<path d="M72 46L77 118" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/>` + [60, 74, 88, 102].map((y) => `<path d="M118 ${y}H126" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/>`).join("") +
        `<path d="M132 52H142Q148 52 148 58V102Q148 110 140 110H128" fill="none" stroke="#14161a" stroke-width="6" stroke-linecap="round"/>` +
        mat(o, rr(64, 32, 72, 10, 4), "blk") + mat(o, rr(90, 26, 20, 7, 3), "blc") +
        mat(o, rr(70, 122, 60, 8, 2), "blk") +
        face(o, "M66 130H134L140 162H60Z", "v") + `<path d="M68 132H132" stroke="#fff" stroke-opacity=".45"/>` +
        (o.on ? `<circle class="${P}pulse" cx="100" cy="147" r="13" fill="url(#${u}-hb)"/>` : "") + `<circle cx="100" cy="147" r="9.5" fill="none" stroke="${o.on ? BLU : "#1a1c20"}" stroke-width="1.3" stroke-opacity="${o.on ? 1 : .5}"/>` + knob(o, 100, 147, 7, true) +
        btn(76, 148, 2.4, true) + btn(124, 148, 2.4, true)); }),

    ic("bullet", "Personal blender", [SS, BK, PINK, SAGE, NAVY], (o) => { const u = o.uid, cup = "M80 126L78 50Q78 38 90 38H110Q122 38 122 50L120 126Z", cid = u + "-bc", d = dur(o, .7, .45);
      return svg(o, room(o, "sub", "wood") + sh(o, 100, 165, 34, 4.5) +
        `<path d="M138 158Q138 148 146 150Q154 148 154 158Q150 166 146 166Q140 166 138 158Z" fill="#e2364a"/><path d="M141 150L146 146L151 150" fill="none" stroke="#3f8f3a" stroke-width="2"/><circle cx="143" cy="156" r="1.3" fill="#fff" fill-opacity=".4"/>` +
        `<path d="M44 164Q50 150 66 146" fill="none" stroke="#e8c94e" stroke-width="6" stroke-linecap="round"/><path d="M44 164Q50 150 66 146" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.6" stroke-linecap="round"/>` +
        `<clipPath id="${cid}"><path d="${cup}"/></clipPath><g clip-path="url(#${cid})">` +
        (o.on ? `<rect x="76" y="36" width="48" height="92" fill="#6f9f3a"/><rect x="76" y="36" width="48" height="92" fill="url(#${u}-edge)"/>` + [50, 66, 82, 98, 114].map((y, i) => `<path class="${P}swirl" d="M78 ${y}Q100 ${y + 10} 122 ${y - 4}" fill="none" stroke="#b9e07a" stroke-opacity=".6" stroke-width="2" stroke-dasharray="7 5" style="animation-duration:${d}s;animation-delay:-${i * .1}s"/>`).join("")
          : `<rect x="76" y="98" width="48" height="22" fill="#cfe6a0" opacity=".55"/>` + [[88, 112, "#e2364a"], [104, 114, "#f4d35e"], [96, 104, "#6cbf4c"], [112, 106, "#e2364a"], [86, 100, "#f4d35e"], [108, 96, "#6cbf4c"]].map((f) => `<circle cx="${f[0]}" cy="${f[1]}" r="4.5" fill="${f[2]}"/>`).join("")) + `</g>` +
        glass(o, cup) + `<path d="M84 48L85 120" stroke="#fff" stroke-opacity=".45" stroke-width="2.4" stroke-linecap="round"/>` +
        mat(o, rr(78, 118, 44, 12, 3), "blk") + `<path d="M76 124H82M118 124H124" stroke="#2a2e35" stroke-width="4" stroke-linecap="round"/>` +
        `<g class="${o.on ? P + "wob" : ""}">` + face(o, "M76 130H124L128 162H72Z", "c") + `<path d="M78 132H122" stroke="#fff" stroke-opacity=".5"/>` + (o.on ? `<path class="${P}pulse" d="M74 152H126" stroke="${BLU}" stroke-width="1.6"/>` : `<path d="M74 152H126" stroke="#000" stroke-opacity=".3" stroke-width="1.2"/>`) + `</g>`); }),

    ic("slowcooker", "Slow cooker", [SS, BK, RED, CREAM, SAGE], (o) => { const u = o.uid, lid = "M36 100Q38 78 100 74Q162 78 164 100Z", lid2 = u + "-ld";
      return svg(o, room(o, "sub", "granite") + plug(o, 186, 80, [160, 158]) + sh(o, 100, 165, 74, 5) +
        `<path d="M30 106Q24 106 24 112Q24 116 32 116" fill="none" stroke="#1a1c20" stroke-width="5" stroke-linecap="round"/><path d="M170 106Q176 106 176 112Q176 116 168 116" fill="none" stroke="#1a1c20" stroke-width="5" stroke-linecap="round"/>` +
        face(o, "M34 100Q30 150 52 158H148Q170 150 166 100Z", "c") + `<path d="M40 112Q42 140 58 150" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>` +
        `<ellipse cx="100" cy="100" rx="66" ry="9" fill="#1a1716"/><ellipse cx="100" cy="100" rx="60" ry="7" fill="#7a3a1c"/>` +
        [[76, 99, "#e8731f"], [96, 101, "#c94b25"], [116, 98, "#e8731f"], [130, 101, "#8a5a2a"], [86, 102, "#f2c14e"], [108, 103, "#6ca14a"]].map((c) => `<ellipse cx="${c[0]}" cy="${c[1]}" rx="4" ry="1.8" fill="${c[2]}"/>`).join("") +
        (o.on ? bubbles(o, [[90, 100, 1], [104, 99, 1.2], [118, 101, .9], [80, 101, 1.1]], "pulse") : "") +
        `<g class="${o.on ? P + "jig" : ""}" style="animation-duration:${dur(o, 2.2, 1.2)}s"><path d="${lid}" fill="url(#${u}-glb)"/><path d="${lid}" fill="url(#${u}-gl)"/>` +
        (o.on ? [[60, 92], [72, 86], [88, 83], [118, 84], [134, 88], [146, 94], [104, 82], [80, 90], [126, 91]].map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="${i % 3 ? .9 : 1.3}" fill="#fff" fill-opacity=".55"/>`).join("") : "") +
        `<path d="M48 94Q60 82 90 78" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.8" stroke-linecap="round"/>` + mat(o, "M34 98Q100 94 166 98V102Q100 98 34 102Z", "crh") +
        mat(o, rr(90, 66, 20, 9, 4), "blc") + `<path d="M93 68H107" stroke="#fff" stroke-opacity=".25"/></g>` +
        steam(o, 92, 66, 3, 4) + mat(o, rr(74, 120, 52, 22, 6), "blk") + knob(o, 92, 131, 6.5, true) +
        led(o, 108, 126, 1.2, ORNG, "ho") + led(o, 116, 126, 1.2, AMB, "ha") + `<path d="M104 136H120" stroke="#fff" stroke-opacity=".15" stroke-width="2" stroke-linecap="round"/>`); }),

    ic("multicooker", "Pressure cooker", [SS, BK, WH, RED, SL], (o) => { const u = o.uid;
      return svg(o, room(o, "zel", "quartz") + plug(o, 176, 96, [150, 158]) + sh(o, 100, 165, 62, 5) +
        `<path d="M44 104H34Q30 104 30 108V112H46Z M156 104H166Q170 104 170 108V112H154Z" fill="#14161a"/>` +
        face(o, rr(44, 84, 112, 78, 14), "c") + groove("M46 96H154") + hl(54, 102, 54, 150, 2.2, .35) +
        mat(o, "M42 88Q44 66 100 62Q156 66 158 88Z", "blc") + `<path d="M52 82Q60 70 96 66" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>` +
        mat(o, "M64 72Q100 58 136 72L134 76Q100 64 66 76Z", "blk") + `<rect x="${o.on ? 82 : 82}" y="${o.on ? 62 : 65}" width="3" height="5" rx="1" fill="${o.on ? "#e0473f" : "#8a2b26"}"/>` +
        `<path d="${rr(122, 62, 10, 8, 3)}" fill="#22252b"/><path d="${rr(124, 58, 6, 5, 2)}" fill="#3a3f48"/>` +
        (o.on ? (o.anim ? [0, 1, 2, 3].map((i) => `<circle class="${P}jet" cx="127" cy="56" r="4" fill="url(#${u}-stm)" style="animation-duration:${dur(o, 2, .9)}s;animation-delay:-${(i * .45).toFixed(2)}s"/>`).join("") : `<path d="M127 56c-4 -8 4 -14 0 -22" stroke="#fff" stroke-opacity=".35" stroke-width="4" fill="none" stroke-linecap="round"/>`) : "") +
        mat(o, rr(66, 104, 68, 44, 6), "blk") + `<path d="${rr(66, 104, 68, 44, 6)}" fill="url(#${u}-gl)"/>` + digits(o, 100, 118, 9, mm(Math.round(5 + 40 * o.level)), REDL, false) +
        [74, 86, 114, 126].map((x, i) => `<path d="${rr(x - 4, 134, 8, 3, 1.5)}" fill="${o.on && i === 1 ? AMB : "#3a3f48"}"/>`).join("") + led(o, 100, 140, 1.2, GRN, "hg") +
        foot(52, 161) + foot(140, 161)); }),

    ic("rice", "Rice cooker", [WH, CREAM, BK, PINK, SAGE], (o) => { const u = o.uid;
      return svg(o, room(o, "sub", "wood") + sh(o, 100, 165, 56, 5) + mug(o, 152, 140, 16, 20, "#3b6ea8") +
        face(o, "M50 160Q46 112 58 92Q100 80 142 92Q154 112 150 160Z", "c") + groove("M52 104Q100 96 148 104") +
        face(o, "M56 96Q58 70 100 66Q142 70 144 96Q100 88 56 96Z", "tp") + `<path d="M64 86Q72 72 100 70" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>` +
        `<path d="M78 80Q100 62 122 80" fill="none" stroke="${pal(o.color).d}" stroke-width="4" stroke-linecap="round"/>` +
        `<ellipse cx="120" cy="76" rx="6" ry="2.6" fill="#2a2e35"/><ellipse cx="120" cy="75.6" rx="4" ry="1.6" fill="#555b63"/>` + steam(o, 120, 72, 3, 3.6) +
        mat(o, rr(90, 98, 20, 6, 3), "blc") +
        mat(o, rr(70, 112, 60, 30, 8), "blk") + `<path d="${rr(70, 112, 60, 30, 8)}" fill="url(#${u}-gl)"/>` + digits(o, 100, 122, 7, mm(Math.round(20 + 40 * o.level)), AMB, false) +
        led(o, 84, 135, 1.3, REDL, "hr") + led(o, 116, 135, 1.3, AMB, "ha") + `<path d="M90 135H110" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/>` +
        (o.on ? `<g opacity=".28"><ellipse class="${P}pulse" cx="100" cy="150" rx="44" ry="10" fill="url(#${u}-warm)"/></g>` : "") + hl(56, 108, 58, 150, 2.2, .35)); }),

    ic("bread", "Bread machine", [WH, SS, BK, CREAM], (o) => { const u = o.uid, win = "M66 60H134L142 72H58Z", wid = u + "-bw";
      return svg(o, room(o, "dark", "wood") + plug(o, 22, 90, [40, 158]) + sh(o, 100, 165, 70, 5) +
        face(o, rr(38, 74, 124, 86, 12), "v") + face(o, "M42 76L56 52H144L158 76Z", "tp") + `<path d="M56 53H144" stroke="#fff" stroke-opacity=".5"/>` +
        `<clipPath id="${wid}"><path d="${win}"/></clipPath><path d="${win}" fill="#0c0b0a"/><g clip-path="url(#${wid})">` +
        (o.on ? `<g opacity="${n1(.2 + .2 * o.level)}"><rect class="${P}glow" x="56" y="58" width="90" height="16" fill="#ff8a3c"/></g>` : "") +
        `<g class="${o.on ? P + "rise" : ""}" style="animation-duration:${dur(o, 16, 8)}s"><path d="M70 74Q72 60 88 60Q100 54 112 60Q128 60 130 74Z" fill="url(#${u}-${o.level > .6 && o.on ? "tst" : "dgh"})"/><path d="M78 66Q88 60 100 60" stroke="#fff" stroke-opacity=".4" fill="none"/></g></g>` +
        `<path d="${win}" fill="url(#${u}-gl)"/><path d="${win}" fill="none" stroke="#000" stroke-opacity=".4"/>` + `<path d="${rr(140, 58, 8, 3, 1.5)}" fill="url(#${u}-vent)"/>` + steam(o, 144, 56, 2, 3) +
        mat(o, rr(52, 88, 96, 30, 6), "blk") + `<path d="${rr(52, 88, 96, 30, 6)}" fill="url(#${u}-gl)"/>` + digits(o, 82, 103, 8, mm(Math.round(60 + 120 * o.level)), BLU, false) +
        btn(116, 98, 2.6, true) + btn(128, 98, 2.6, true) + btn(116, 109, 2.6, true) + btn(128, 109, 2.6, true) + led(o, 140, 96, 1.2, GRN, "hg") +
        mat(o, rr(70, 126, 60, 4, 2), "crh") + `<path d="${rr(56, 138, 88, 12, 4)}" fill="#000" fill-opacity=".1"/>` +
        hl(42, 80, 42, 154, 1.6, .35) + foot(46, 159) + foot(146, 159)); }),

    ic("waffle", "Waffle maker", [SS, BK, RED, CREAM, MINT, NAVY], (o) => { const u = o.uid, lid = "M42 128Q42 92 100 88Q158 92 158 128Q100 142 42 128Z";
      return svg(o, room(o, "zel", "marble") + plug(o, 22, 92, [40, 158]) + sh(o, 104, 165, 70, 5) +
        face(o, "M44 130V148Q44 160 100 160Q156 160 156 148V130Z", "c") + groove("M46 148Q100 158 154 148") +
        `<path d="M42 129Q100 144 158 129" fill="none" stroke="#a8692a" stroke-width="4.6"/><path d="M42 129Q100 144 158 129" fill="none" stroke="#e7b062" stroke-width="3" stroke-dasharray="4 1.4"/>` + warmPool(o, 100, 134, 62, 6, .6) +
        `<path d="M156 118L180 126Q186 128 184 133Q182 137 176 135L152 128Z" fill="url(#${u}-blc)"/><path d="M160 121L180 128" stroke="#fff" stroke-opacity=".25"/>` +
        face(o, lid, "v") + `<path d="M58 110Q70 96 98 93" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.4" stroke-linecap="round"/>` +
        `<ellipse cx="100" cy="112" rx="34" ry="12" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="1.4"/><ellipse cx="100" cy="111" rx="34" ry="12" fill="none" stroke="#fff" stroke-opacity=".14"/>` +
        mat(o, "M142 112L154 116L154 126L142 124Z", "crh") +
        led(o, 84, 146, 1.4, REDL, "hr") + led(o, 96, 147, 1.4, GRN, "hg") + knob(o, 120, 146, 5, true, 6) +
        steam(o, 50, 124, 2, 3.4, "stl") + steam(o, 140, 132, 2, 3.4)); }),
  ];

  (window.HDA = window.HDA || []).push({
    id: "smallkitchen", tab: "Small kitchen", group: "Appliances", kind: "device",
    intro: "Twenty countertop appliances, most of them on a smart plug. When running, coffee drips and streams, kettles boil and steam, toasters glow and pop, ovens and fryers heat, mixers and blenders turn, cookers jiggle and vent; displays show segment digits and the slider sets the speed, heat or time.",
    
    css, icons,
  });
})();
