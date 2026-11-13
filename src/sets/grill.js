(function () {
  const P = "hda-grill-";
  const G = (s) => s ? `<g class="hda-bg">${s}</g>` : "";
  const H = () => window.HDAH;
  const BK = "#26282c", SS = "#c4c9ce", RD = "#b3302b", BL = "#2c5b8f", GN = "#2f6b45", GY = "#6e7277", CU = "#b87333";
  const STD = [BK, SS, RD, BL, GN, GY, CU];
  const sw = (first, list) => [first].concat((list || STD).filter((c) => c !== first));
  const n1 = (v) => (+v).toFixed(1);
  const Lv = (o) => (o.on ? .4 + .6 * o.level : 0);
  const g2 = (o, k) => (Lv(o) * (k == null ? 1 : k)).toFixed(2);
  const dur = (o, a, b) => (a - b * o.level).toFixed(2);
  const tG = (o) => Math.round((250 + 250 * o.level) / 5) * 5;
  const tS = (o) => Math.round((125 + 125 * o.level) / 5) * 5;
  const metal = (o) => { const c = String(o.color || "").toLowerCase(); return c === SS ? 1 : c === CU ? 3 : 0; };
  function pal(c) { const h = H(); return { l: h.shade(c, .42), m: c, d: h.shade(c, -.26), k: h.shade(c, -.5), e: h.shade(c, -.45) }; }
  const halo = (id, c, a) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a || .8}"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const lg = (id, stops, v) => `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</linearGradient>`;
  const rg = (id, stops, cx, cy, r) => `<radialGradient id="${id}"${cx != null ? ` cx="${cx}" cy="${cy}" r="${r}"` : ""}>${stops.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"${s[2] != null ? ` stop-opacity="${s[2]}"` : ""}/>`).join("")}</radialGradient>`;
  const flU = (id, a, b, c) => `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${a}" stop-opacity=".95"/><stop offset=".55" stop-color="${b}" stop-opacity=".8"/><stop offset="1" stop-color="${c || b}" stop-opacity="0"/></linearGradient>`;

  function defs(o, extra) {
    const u = o.uid, p = pal(o.color), m = metal(o), h = H();
    const vl = m ? h.shade(o.color, .6) : p.l;
    return `<defs>
${lg(u + "-v", [[0, vl], [.2, p.m], [.72, p.m], [1, p.d]], 1)}
${lg(u + "-c", [[0, p.k], [.25, p.l], [.6, p.m], [1, p.k]])}
${lg(u + "-cv", [[0, p.d], [.16, vl], [.45, p.m], [.85, p.d], [1, p.k]], 1)}
${rg(u + "-s", [[0, vl], [.45, p.m], [.85, p.d], [1, p.k]], .36, .28, .8)}
<linearGradient id="${u}-fx" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".1" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${m ? ".12" : ".04"}"/><stop offset=".88" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<linearGradient id="${u}-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="${u}-br" width="37" height="2.2" patternUnits="userSpaceOnUse"><path d="M0 .5H14M18 .5H37" stroke="#fff" stroke-opacity="${m === 3 ? ".12" : ".18"}" stroke-width=".35"/><path d="M5 1.6H27M30 1.6H35" stroke="#000" stroke-opacity=".1" stroke-width=".35"/></pattern>
${lg(u + "-st", [[0, "#6f767e"], [.45, "#e8ecef"], [.7, "#aab1b8"], [1, "#5a6067"]])}
${lg(u + "-stv", [[0, "#f2f5f7"], [.45, "#a9b0b7"], [1, "#5a6067"]], 1)}
${lg(u + "-sst", [[0, "#9aa1a8"], [.5, "#d4d8dc"], [1, "#eef1f3"]], 1)}
${lg(u + "-cr", [[0, "#fdfeff"], [.35, "#8f969e"], [.55, "#e9ecef"], [1, "#5d636b"]], 1)}
${lg(u + "-bk", [[0, "#4a4d53"], [.25, "#2a2c30"], [1, "#0e0f11"]], 1)}
${lg(u + "-bkc", [[0, "#0e0f11"], [.3, "#44474d"], [.62, "#24262a"], [1, "#0a0b0c"]])}
${lg(u + "-int", [[0, "#1a1b1e"], [.6, "#2b2c30"], [1, "#121214"]], 1)}
${lg(u + "-ci", [[0, "#3e3f43"], [1, "#121315"]], 1)}
${rg(u + "-sh", [[0, "#000", .62], [1, "#000", 0]])}
${flU(u + "-fb", "#2f5dff", "#6ab0ff", "#ffb04a")}
<linearGradient id="${u}-fbt" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3a6bff" stop-opacity=".95"/><stop offset=".45" stop-color="#7ab8ff" stop-opacity=".75"/><stop offset=".7" stop-color="#ff9a3a" stop-opacity=".8"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></linearGradient>
${flU(u + "-fo", "#ff5a1a", "#ff8a2a")}${flU(u + "-fm", "#ffc24a", "#ffb03a")}${flU(u + "-fc", "#fff4cc", "#fff0c0")}
${halo(u + "-ho", "#ff8a3d")}${halo(u + "-hb", "#4f9dff")}${halo(u + "-hw", "#ffe2a8", .7)}${halo(u + "-hr", "#ff4a1a", .9)}
${rg(u + "-emb", [[0, "#fff2b0"], [.3, "#ffb347"], [.62, "#ff5a1a"], [.9, "#8a1e08"], [1, "#3a0e05"]], .45, .4, .7)}
${rg(u + "-coal", [[0, "#5e6064"], [.6, "#2a2b2e"], [1, "#121314"]], .4, .35, .75)}
${rg(u + "-smk", [[0, "#d6d8dd", .55], [.5, "#b8bbc2", .25], [1, "#9a9da3", 0]])}
${rg(u + "-stm", [[0, "#fff", .7], [.5, "#eef4f8", .3], [1, "#fff", 0]])}
${rg(u + "-mt", [[0, "#9a5a2e"], [.45, "#6e3416"], [.85, "#46200c"], [1, "#2e1406"]], .42, .4, .7)}
${rg(u + "-stk", [[0, "#a85a34"], [.5, "#7a3218"], [1, "#3e170a"]], .4, .4, .75)}
${lg(u + "-dg", [[0, "#d87a48"], [.5, "#a64a22"], [1, "#5e2410"]], 1)}
${lg(u + "-crn", [[0, "#ffe68a"], [.5, "#e9b23a"], [1, "#9a6a12"]], 1)}
${rg(u + "-ckn", [[0, "#f0b86a"], [.45, "#c9782e"], [.85, "#8a4416"], [1, "#5a2a0c"]], .4, .32, .75)}
${lg(u + "-grd", [[0, "#2c2d30"], [.5, "#1d1e21"], [1, "#2a2b2e"]], 1)}
<linearGradient id="${u}-grs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".35" stop-color="#fff" stop-opacity=".02"/><stop offset=".6" stop-color="#ffd8a8" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
${rg(u + "-ir", [[0, "#ffe6a8"], [.35, "#ff8a3a"], [.75, "#d8341a"], [1, "#7a160a"]], .5, .5, .7)}
${lg(u + "-tank", [[0, "#7d848c"], [.3, "#f4f6f8"], [.65, "#cfd4d9"], [1, "#6a7178"]])}
${lg(u + "-wd", [[0, "#9a7250"], [1, "#5e4028"]], 1)}
${lg(u + "-bam", [[0, "#6e5a2e"], [.4, "#c9b276"], [1, "#5a4824"]])}
${lg(u + "-sky", [[0, "#121735"], [.45, "#2f2b58"], [.75, "#7e4a6e"], [1, "#e0875a"]], 1)}
${lg(u + "-nit", [[0, "#0f1530"], [1, "#2a3158"]], 1)}
${lg(u + "-sid", [[0, "#3a4152"], [1, "#232836"]], 1)}
${lg(u + "-brk", [[0, "#6a3e32"], [1, "#3e241e"]], 1)}
${lg(u + "-stc", [[0, "#7a6a58"], [1, "#4a3f34"]], 1)}
${lg(u + "-fnc", [[0, "#6e5038"], [1, "#3e2c1e"]], 1)}
${lg(u + "-slt", [[0, "#7a5a3c"], [1, "#4e3826"]], 1)}
${lg(u + "-hdg", [[0, "#2f5a34"], [1, "#16301a"]], 1)}
${lg(u + "-gr", [[0, "#3f6e36"], [1, "#1c361b"]], 1)}
${lg(u + "-dk", [[0, "#8a6446"], [1, "#4a3220"]], 1)}
${lg(u + "-pv", [[0, "#7a7268"], [1, "#4a443e"]], 1)}
${lg(u + "-cn", [[0, "#8a8d91"], [1, "#55585c"]], 1)}
${lg(u + "-gran", [[0, "#3a3c40"], [.5, "#5a5c60"], [1, "#2a2c30"]], 1)}
${lg(u + "-glass", [[0, "#fff", .28], [.35, "#fff", .04], [.7, "#fff", 0], [1, "#fff", .1]])}
${lg(u + "-win", [[0, "#ffe2a8"], [.5, "#ff9a4a"], [1, "#6a2a10"]], 1)}
<pattern id="${u}-brkp" width="16" height="8" patternUnits="userSpaceOnUse"><path d="M0 .4H16M0 4.4H16M.4 .4V4.4M8.4 4.4V8.4" stroke="#1e110c" stroke-opacity=".7" stroke-width=".9"/><path d="M1 1.4H7.5M9 5.4H15.5" stroke="#fff" stroke-opacity=".07" stroke-width=".6"/></pattern>
<pattern id="${u}-stn" width="22" height="12" patternUnits="userSpaceOnUse"><rect width="22" height="12" fill="#6a6258"/><path d="M1 1h9v4.4h-9z" fill="#8a8276"/><path d="M11 1h10v4.4h-10z" fill="#7a7266"/><path d="M1 6.6h5v4.4h-5z" fill="#958c80"/><path d="M7 6.6h9v4.4h-9z" fill="#6f675c"/><path d="M17 6.6h4v4.4h-4z" fill="#857c70"/><path d="M1 1h9M11 1h10M1 6.6h5M7 6.6h9M17 6.6h4" stroke="#fff" stroke-opacity=".14" stroke-width=".6"/></pattern>
<pattern id="${u}-hex" width="3.4" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#000" fill-opacity=".55"/><circle cx="2.7" cy="2.5" r=".6" fill="#000" fill-opacity=".55"/></pattern>
${extra || ""}</defs>`;
  }
  const svg = (o, body, extra) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(o, (extra || "") + `<clipPath id="${o.uid}-box"><rect x="4" y="4" width="192" height="192" rx="6"/></clipPath>`)}<g clip-path="url(#${o.uid}-box)">${body}</g></svg>`;
  const sh = (o, cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry || 5}" fill="url(#${o.uid}-sh)"/>`;
  const rr = (x, y, w, h, r) => `M${n1(x + r)} ${n1(y)}H${n1(x + w - r)}A${r} ${r} 0 0 1 ${n1(x + w)} ${n1(y + r)}V${n1(y + h - r)}A${r} ${r} 0 0 1 ${n1(x + w - r)} ${n1(y + h)}H${n1(x + r)}A${r} ${r} 0 0 1 ${n1(x)} ${n1(y + h - r)}V${n1(y + r)}A${r} ${r} 0 0 1 ${n1(x + r)} ${n1(y)}Z`;
  const hl = (x1, y1, x2, y2, w, op) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#fff" stroke-opacity="${op || .35}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
  const ln = (d, c, w, op) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w || 1}"${op != null ? ` stroke-opacity="${op}"` : ""} stroke-linecap="round" stroke-linejoin="round"/>`;

  function pnt(o, d, g) {
    const u = o.uid, m = metal(o);
    return `<path d="${d}" fill="url(#${u}-${g || "v"})"/>` + (m ? `<path d="${d}" fill="url(#${u}-br)"/>` : "") +
      `<path d="${d}" fill="url(#${u}-fx)"/><path d="${d}" fill="none" stroke="${pal(o.color).e}" stroke-opacity=".6" stroke-width=".8"/>`;
  }
  const gloss = (o, d, k) => metal(o) ? "" : `<path d="${d}" fill="url(#${o.uid}-g)" opacity="${k || .3}"/>`;
  const blk = (o, d, g) => `<path d="${d}" fill="url(#${o.uid}-${g || "bk"})"/><path d="${d}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width=".7"/>`;
  const steel = (o, d, g) => `<path d="${d}" fill="url(#${o.uid}-${g || "sst"})"/><path d="${d}" fill="url(#${o.uid}-br)"/><path d="${d}" fill="none" stroke="#5a6067" stroke-width=".7"/>`;

  function scene(o, wall, ground, gy) { return G(scene0(o, wall, ground, gy)); }
  function scene0(o, wall, ground, gy) {
    const u = o.uid; gy = gy || 150;
    const W = `M10 4H190A6 6 0 0 1 196 10V${gy}H4V10A6 6 0 0 1 10 4Z`;
    let s = "";
    const sky = (g) => `<path d="${W}" fill="url(#${u}-${g})"/>`;
    const stars = (pts) => pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="${p[2] || .7}" fill="#fff" fill-opacity=".7"/>`).join("");
    if (wall === "dusk") {
      s += sky("sky") + stars([[26, 16], [62, 11], [118, 20, .5], [158, 13], [180, 26, .5]]) + `<circle cx="164" cy="30" r="5" fill="#f6ecd2" fill-opacity=".85"/><circle cx="166.5" cy="28.6" r="4.4" fill="#26244a"/>` +
        `<path d="M4 ${gy - 14}C14 ${gy - 30} 22 ${gy - 22} 30 ${gy - 34}S46 ${gy - 26} 52 ${gy - 30}S70 ${gy - 18} 82 ${gy - 24}S108 ${gy - 16} 120 ${gy - 22}S140 ${gy - 34} 150 ${gy - 28}S172 ${gy - 20} 182 ${gy - 30}S192 ${gy - 22} 196 ${gy - 24}V${gy}H4Z" fill="#141228" fill-opacity=".92"/>` +
        `<path d="M4 ${gy - 6}C40 ${gy - 12} 80 ${gy - 8} 120 ${gy - 11}S180 ${gy - 8} 196 ${gy - 10}V${gy}H4Z" fill="#0d0c1c"/>`;
    } else if (wall === "hedge") {
      s += sky("nit") + stars([[30, 14], [90, 10, .5], [140, 18], [176, 12, .5]]);
      let b = `M4 ${gy}V${gy - 44}`; for (let x = 4; x < 196; x += 16) b += `Q${x + 8} ${gy - 58 + (x % 3) * 3} ${x + 16} ${gy - 44 - (x % 2) * 3}`; b += `V${gy}Z`;
      s += `<path d="${b}" fill="url(#${u}-hdg)"/>`;
      for (let i = 0; i < 26; i++) { const x = 8 + (i * 37) % 186, y = gy - 40 + (i * 13) % 36; s += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="1.8" fill="${i % 2 ? "#3f7a44" : "#244a28"}" fill-opacity=".8" transform="rotate(${(i * 47) % 90 - 45} ${x} ${y})"/>`; }
    } else if (wall === "fence") {
      s += sky("sky") + stars([[40, 14], [120, 10, .5], [170, 18]]);
      const ft = gy - 62; s += `<rect x="4" y="${ft}" width="192" height="${gy - ft}" fill="url(#${u}-fnc)"/>`;
      for (let x = 4; x < 196; x += 12) s += `<path d="M${x} ${ft}V${gy}" stroke="#1e140c" stroke-width="1"/><path d="M${x + 1.2} ${ft + 2}V${gy}" stroke="#fff" stroke-opacity=".07" stroke-width=".7"/><path d="M${x + 5} ${ft + 8 + (x % 5) * 3}c1 6 -1 12 0 18" fill="none" stroke="#2a1c10" stroke-opacity=".4" stroke-width=".5"/>`;
      s += `<rect x="4" y="${ft - 3}" width="192" height="4" fill="#5a4030"/><path d="M4 ${ft - 3}H196" stroke="#fff" stroke-opacity=".15"/><path d="M4 ${ft + 18}H196M4 ${gy - 12}H196" stroke="#1e140c" stroke-opacity=".5" stroke-width="1.6"/>`;
    } else if (wall === "brick") {
      s += `<path d="${W}" fill="url(#${u}-brk)"/><path d="${W}" fill="url(#${u}-brkp)"/>`;
    } else if (wall === "stucco") {
      s += `<path d="${W}" fill="url(#${u}-stc)"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${8 + (i * 53) % 186}" cy="${8 + (i * 29) % (gy - 12)}" r="${.6 + (i % 3) * .4}" fill="#fff" fill-opacity=".05"/>`).join("") +
        `<rect x="22" y="22" width="12" height="18" rx="2" fill="#1a1612"/><path d="M24 40L28 34L32 40Z" fill="#000" fill-opacity=".3"/><rect x="24" y="24" width="8" height="12" rx="1" fill="#ffd28a" fill-opacity=".85"/><circle cx="28" cy="30" r="18" fill="url(#${u}-hw)" opacity=".6"/><path d="M28 18V22" stroke="#1a1612" stroke-width="2"/>`;
    } else if (wall === "slats") {
      s += `<path d="${W}" fill="#14161c"/>`;
      for (let y = 8; y < gy - 2; y += 9) s += `<rect x="4" y="${y}" width="192" height="7" fill="url(#${u}-slt)"/><path d="M4 ${y + .5}H196" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/><path d="M${20 + (y * 7) % 60} ${y + 3}h40M${110 + (y * 3) % 50} ${y + 4.5}h30" stroke="#2a1c10" stroke-opacity=".35" stroke-width=".5"/>`;
    } else if (wall === "bamboo") {
      s += sky("nit");
      for (let x = 6; x < 196; x += 9) s += `<rect x="${x}" y="${gy - 70 + (x % 4) * 2}" width="8" height="${70 - (x % 4) * 2}" rx="1.5" fill="url(#${u}-bam)"/><path d="M${x} ${gy - 52 + (x % 3) * 4}h8M${x} ${gy - 26 - (x % 2) * 5}h8" stroke="#3a2e14" stroke-width="1"/>`;
      s += `<path d="M4 ${gy - 46}H196M4 ${gy - 18}H196" stroke="#2a2010" stroke-width="2"/>`;
      s += `<path d="M30 4V18" stroke="#111" stroke-width=".8"/><ellipse cx="30" cy="28" rx="9" ry="11" fill="#c8402a"/><ellipse cx="30" cy="28" rx="9" ry="11" fill="url(#${u}-g)" opacity=".4"/><path d="M21.5 24h17M21 28h18M21.5 32h17" stroke="#7a1e12" stroke-width=".6"/><rect x="26" y="16" width="8" height="2.4" fill="#1a1a1a"/><rect x="26" y="38" width="8" height="2.4" fill="#1a1a1a"/><circle cx="30" cy="28" r="20" fill="url(#${u}-hw)" opacity=".35"/>`;
    } else {
      s += `<path d="${W}" fill="url(#${u}-sid)"/>`;
      for (let y = 10; y < gy; y += 7) s += `<path d="M4 ${y}H196" stroke="#12151d" stroke-width="1"/><path d="M4 ${y + 1}H196" stroke="#fff" stroke-opacity=".06" stroke-width=".6"/>`;
      s += `<rect x="166" y="22" width="12" height="18" rx="2" fill="#15171c"/><rect x="168" y="24" width="8" height="12" rx="1" fill="#ffd28a" fill-opacity=".85"/><circle cx="172" cy="30" r="18" fill="url(#${u}-hw)" opacity=".55"/>`;
    }
    const G = `M4 ${gy}H196V190A6 6 0 0 1 190 196H10A6 6 0 0 1 4 190Z`;
    const ys = [0, 5, 11, 18.5, 27.5, 38.5, 52].map((d) => gy + d).filter((y) => y < 196).concat([196]);
    if (ground === "deck") {
      s += `<path d="${G}" fill="url(#${u}-dk)"/>`;
      ys.forEach((y, i) => { if (i) s += `<path d="M4 ${n1(y)}H196" stroke="#1e130a" stroke-width="${n1(.8 + i * .2)}"/><path d="M4 ${n1(y + .9)}H196" stroke="#fff" stroke-opacity=".08" stroke-width=".6"/>`;
        if (i < ys.length - 1) { const x = 20 + (i * 61) % 150; s += `<path d="M${x} ${n1(y)}V${n1(ys[i + 1])}" stroke="#1e130a" stroke-width=".8"/><path d="M${x + 14} ${n1(y + (ys[i + 1] - y) / 2)}h${30 + i * 4}" stroke="#2a1a0e" stroke-opacity=".35" stroke-width=".5"/>`; } });
    } else if (ground === "grass") {
      s += `<path d="${G}" fill="url(#${u}-gr)"/>`;
      for (let i = 0; i < 46; i++) { const x = 6 + (i * 41) % 188, y = gy + 2 + ((i * 17) % (196 - gy - 4)); const c = i % 3 ? "#5f9a4c" : "#2c5226";
        s += `<path d="M${x} ${y}l-1.4 -4M${x + 1} ${y}l.4 -5M${x + 2} ${y}l1.8 -3.6" stroke="${c}" stroke-width=".8" stroke-linecap="round"/>`; }
      s += `<path d="M4 ${gy}H196" stroke="#6aa858" stroke-opacity=".35"/>`;
    } else if (ground === "concrete") {
      s += `<path d="${G}" fill="url(#${u}-cn)"/>` + [-60, 0, 60].map((d) => `<path d="M${100 + d} ${gy}L${100 + d * 1.5} 196" stroke="#2e3034" stroke-width="1"/>`).join("") + `<path d="M4 ${gy + 22}H196" stroke="#2e3034" stroke-width="1"/>` +
        Array.from({ length: 24 }, (_, i) => `<circle cx="${8 + (i * 47) % 186}" cy="${gy + 3 + (i * 19) % (196 - gy - 5)}" r=".6" fill="#000" fill-opacity=".25"/>`).join("") + `<path d="M4 ${gy}H196" stroke="#fff" stroke-opacity=".18"/>`;
    } else {
      s += `<path d="${G}" fill="url(#${u}-pv)"/>`;
      ys.forEach((y, i) => { if (!i || y >= 196) return; s += `<path d="M4 ${n1(y)}H196" stroke="#2a2622" stroke-width="${n1(.7 + i * .15)}"/><path d="M4 ${n1(y + .8)}H196" stroke="#fff" stroke-opacity=".08" stroke-width=".5"/>`; });
      ys.forEach((y, i) => { if (i >= ys.length - 1) return; const bw = 14 + i * 7, off = (i % 2) * bw / 2; for (let x = 4 + off; x < 196; x += bw) s += `<path d="M${n1(x)} ${n1(y)}V${n1(ys[i + 1])}" stroke="#2a2622" stroke-width=".8"/>`; });
    }
    return s;
  }

  const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  function dig(x, y, h, ch) {
    const w = h * .56, t = Math.max(.5, h * .15), hh = h / 2;
    const R = { a: [x + t * .6, y, w - t * 1.2, t], b: [x + w - t, y + t * .6, t, hh - t * .9], c: [x + w - t, y + hh + t * .3, t, hh - t * .9],
      d: [x + t * .6, y + h - t, w - t * 1.2, t], e: [x, y + hh + t * .3, t, hh - t * .9], f: [x, y + t * .6, t, hh - t * .9], g: [x + t * .6, y + hh - t / 2, w - t * 1.2, t] };
    return (SEG[ch] || "").split("").map((k) => { const r = R[k]; return `<rect x="${n1(r[0])}" y="${n1(r[1])}" width="${n1(r[2])}" height="${n1(r[3])}" rx="${n1(t * .35)}"/>`; }).join("");
  }
  function lcd(o, x, y, w, h, val, col) {
    col = col || "#ff5a3a"; const v = String(val), dh = h * .62, dw = dh * .56, g = dh * .2;
    const tw = v.length * dw + (v.length - 1) * g + dh * .36, x0 = x + (w - tw) / 2, y0 = y + (h - dh) / 2;
    let ghost = "", lit = "", cx = x0;
    for (const ch of v) { ghost += dig(cx, y0, dh, 8); lit += dig(cx, y0, dh, ch); cx += dw + g; }
    const dx = cx - g + dh * .2, deg = (c) => `<circle cx="${n1(dx)}" cy="${n1(y0 + dh * .14)}" r="${n1(dh * .11)}" fill="none" stroke="${c}" stroke-width="${n1(dh * .08)}"/>`;
    let s = `<path d="${rr(x - 1.2, y - 1.2, w + 2.4, h + 2.4, 2)}" fill="#0b0c0e"/><path d="${rr(x, y, w, h, 1.4)}" fill="#120a0a"/><g fill="#fff" fill-opacity=".06">${ghost}</g>`;
    if (o.on) s += `<ellipse class="${P}pulse" cx="${n1(x + w / 2)}" cy="${n1(y + h / 2)}" rx="${n1(w * .55)}" ry="${n1(h * .7)}" fill="${col}" fill-opacity=".18"/><g fill="${col}">${lit}</g>` + deg(col);
    return s + `<path d="M${n1(x + 1)} ${n1(y + 1)}H${n1(x + w * .6)}L${n1(x + w * .4)} ${n1(y + h * .45)}H${n1(x + 1)}Z" fill="#fff" fill-opacity=".06"/>`;
  }
  function wifi(o, x, y, s, col) {
    col = col || "#7dd3fc"; s = s || 1; const on = o.on;
    const a = (r, i) => `<path class="${on ? P + "wf" : ""}" d="M${n1(x - r * s)} ${n1(y - r * s * .2)}Q${x} ${n1(y - r * s * 1.25)} ${n1(x + r * s)} ${n1(y - r * s * .2)}" fill="none" stroke="${on ? col : "#fff"}" stroke-opacity="${on ? 1 : .12}" stroke-width="${n1(.8 * s)}" stroke-linecap="round" style="animation-delay:-${(i * .4).toFixed(1)}s"/>`;
    return `<circle cx="${x}" cy="${n1(y + .4 * s)}" r="${n1(.7 * s)}" fill="${on ? col : "#fff"}" fill-opacity="${on ? 1 : .12}"/>` + a(1.8, 2) + a(3.2, 1) + a(4.6, 0);
  }
  const led = (o, x, y, c) => o.on ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="3" fill="${c || "#34d399"}" fill-opacity=".3"/><circle cx="${x}" cy="${y}" r="1.1" fill="${c || "#34d399"}"/>` : `<circle cx="${x}" cy="${y}" r="1.1" fill="#fff" fill-opacity=".14"/>`;

  function knob(o, x, y, r, opt) {
    opt = opt || {}; const u = o.uid, a = (o.on && opt.lit !== false ? -40 - 100 * o.level : 0) * Math.PI / 180;
    return (opt.ring && o.on && opt.lit !== false ? `<circle class="${P}pulse" cx="${x}" cy="${y}" r="${n1(r + 3.6)}" fill="url(#${u}-${opt.ring === "b" ? "hb" : "ho"})"/><circle cx="${x}" cy="${y}" r="${n1(r + 1.3)}" fill="none" stroke="${opt.ring === "b" ? "#6ab0ff" : "#ff8a3d"}" stroke-width="1"/>` : "") +
      `<circle cx="${x}" cy="${n1(y + r * .3)}" r="${n1(r + 1)}" fill="#000" fill-opacity=".4"/><circle cx="${x}" cy="${y}" r="${n1(r + .9)}" fill="url(#${u}-cr)"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}-${opt.ss ? "stv" : "bk"})"/>` +
      `<circle cx="${n1(x - r * .3)}" cy="${n1(y - r * .35)}" r="${n1(r * .35)}" fill="#fff" fill-opacity=".14"/>` +
      `<path d="M${n1(x + Math.sin(a) * r * .2)} ${n1(y - Math.cos(a) * r * .2)}L${n1(x + Math.sin(a) * r * .85)} ${n1(y - Math.cos(a) * r * .85)}" stroke="${opt.ss ? "#2a2e35" : "#e8ecef"}" stroke-width="${n1(Math.max(.8, r * .22))}" stroke-linecap="round"/>`;
  }
  function bar(o, x1, x2, y, t, post) {
    const u = o.uid; t = t || 3; post = post == null ? 4 : post;
    return `<rect x="${x1 + 2}" y="${n1(y)}" width="3" height="${n1(post + t)}" rx="1" fill="#2a2c30"/><rect x="${x2 - 5}" y="${n1(y)}" width="3" height="${n1(post + t)}" rx="1" fill="#2a2c30"/>` +
      `<rect x="${x1}" y="${n1(y + t * .7)}" width="${x2 - x1}" height="${t}" rx="${n1(t / 2)}" fill="#000" fill-opacity=".3"/><rect x="${x1}" y="${y}" width="${x2 - x1}" height="${t}" rx="${n1(t / 2)}" fill="url(#${u}-stv)"/>` +
      `<path d="M${x1 + 2} ${n1(y + t * .3)}H${x2 - 2}" stroke="#fff" stroke-opacity=".7" stroke-width="${n1(t * .22)}" stroke-linecap="round"/>`;
  }
  function dial(o, cx, cy, r, f) {
    const u = o.uid, a = (-120 + 240 * (o.on ? f : 0)) * Math.PI / 180;
    let t = ""; for (let i = 0; i <= 8; i++) { const b = (-120 + i * 30) * Math.PI / 180; t += `M${n1(cx + Math.sin(b) * r * .62)} ${n1(cy - Math.cos(b) * r * .62)}L${n1(cx + Math.sin(b) * r * .8)} ${n1(cy - Math.cos(b) * r * .8)}`; }
    return `<circle cx="${cx}" cy="${n1(cy + .8)}" r="${n1(r + 1.4)}" fill="#000" fill-opacity=".35"/><circle cx="${cx}" cy="${cy}" r="${n1(r + 1.2)}" fill="url(#${u}-cr)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#f2efe6"/>` +
      `<path d="M${n1(cx - r * .7)} ${n1(cy + r * .3)}A${n1(r * .78)} ${n1(r * .78)} 0 0 1 ${n1(cx + r * .7)} ${n1(cy + r * .3)}" fill="none" stroke="#e05a2a" stroke-opacity=".35" stroke-width="${n1(r * .14)}"/>` +
      `<path d="${t}" stroke="#333" stroke-width="${n1(Math.max(.4, r * .08))}"/><path d="M${cx} ${cy}L${n1(cx + Math.sin(a) * r * .78)} ${n1(cy - Math.cos(a) * r * .78)}" stroke="#c8231b" stroke-width="${n1(Math.max(.6, r * .14))}" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${n1(r * .14)}" fill="#222"/><path d="M${n1(cx - r * .6)} ${n1(cy - r * .5)}Q${cx} ${n1(cy - r * .95)} ${n1(cx + r * .5)} ${n1(cy - r * .6)}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${n1(r * .1)}"/>`;
  }
  function wheel(o, x, y, r, spokes) {
    const u = o.uid; let s = `<circle cx="${x}" cy="${n1(y + 1)}" r="${n1(r + .6)}" fill="#000" fill-opacity=".4"/><circle cx="${x}" cy="${y}" r="${r}" fill="#121315"/><circle cx="${x}" cy="${y}" r="${n1(r * .92)}" fill="none" stroke="#3a3c40" stroke-width="${n1(r * .14)}"/>`;
    if (spokes) { s += `<circle cx="${x}" cy="${y}" r="${n1(r * .7)}" fill="none" stroke="#2a2c30" stroke-width="1"/>`; for (let i = 0; i < spokes; i++) { const a = i * Math.PI * 2 / spokes; s += `<path d="M${x} ${y}L${n1(x + Math.cos(a) * r * .72)} ${n1(y + Math.sin(a) * r * .72)}" stroke="#4a4c52" stroke-width="1.2"/>`; } }
    return s + `<circle cx="${x}" cy="${y}" r="${n1(r * .38)}" fill="url(#${u}-cr)"/><circle cx="${x}" cy="${y}" r="${n1(r * .12)}" fill="#222"/>`;
  }
  const tube = (x1, y1, x2, y2, w, c) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#08090a" stroke-width="${w + 1}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c || "#2c2e33"}" stroke-width="${w}" stroke-linecap="round"/><path d="M${n1(x1 - w * .2)} ${y1}L${n1(x2 - w * .2)} ${y2}" stroke="#fff" stroke-opacity=".16" stroke-width="${n1(w * .25)}" stroke-linecap="round"/>`;
  function tank(o, x, y, w, h) {
    const u = o.uid;
    return `<path d="${rr(x, y + 4, w, h - 4, w * .32)}" fill="url(#${u}-tank)"/><path d="M${x + 2} ${y + h * .55}H${x + w - 2}" stroke="#000" stroke-opacity=".18"/><path d="${rr(x + w * .18, y, w * .64, 7, 2)}" fill="url(#${u}-tank)"/><path d="M${n1(x + w * .26)} ${y + 2}h${n1(w * .48)}" stroke="#000" stroke-opacity=".3" stroke-width="2"/>` +
      `<circle cx="${n1(x + w / 2)}" cy="${y + 1}" r="2.6" fill="#b8902e"/><rect x="${n1(x + w * .2)}" y="${y + h - 3}" width="${n1(w * .6)}" height="3" fill="#8a9097"/>` + hl(x + w * .3, y + 10, x + w * .3, y + h - 6, 1.6, .5);
  }

  function surf(x1, x2, yb, yf, ins) {
    return { x1, x2, yb, yf, ins, d: `M${n1(x1 + ins)} ${yb}H${n1(x2 - ins)}L${x2} ${yf}H${x1}Z`,
      at(u, v) { const l = x1 + ins * (1 - v), r = x2 - ins * (1 - v); return [l + (r - l) * u, yb + (yf - yb) * v]; }, s(v) { return .76 + .24 * v; } };
  }
  function grate(o, S, m, opt) {
    opt = opt || {}; let d = "";
    for (let k = 0; k <= m; k++) { const u = k / m, a = S.at(u, .02), b = S.at(u, .98); d += `M${n1(a[0])} ${n1(a[1])}L${n1(b[0])} ${n1(b[1])}`; }
    const r0 = S.at(0, .04), r1 = S.at(1, .04), f0 = S.at(0, .96), f1 = S.at(1, .96);
    d += `M${n1(r0[0])} ${n1(r0[1])}H${n1(r1[0])}M${n1(f0[0])} ${n1(f0[1])}H${n1(f1[0])}`;
    const w = opt.w || 1.8;
    return `<path d="${d}" stroke="#08090a" stroke-width="${n1(w + .9)}" fill="none"/><path d="${d}" stroke="${opt.c || "#55585e"}" stroke-width="${n1(w * .42)}" fill="none" transform="translate(-.3 -.5)"/>`;
  }
  const flameD = (cx, by, w, h, lnn) => `M${n1(cx - w / 2)} ${n1(by)}C${n1(cx - w / 2)} ${n1(by - h * .38)} ${n1(cx - w * .14 + lnn * .3)} ${n1(by - h * .55)} ${n1(cx + lnn)} ${n1(by - h)}C${n1(cx + w * .12 + lnn * .4)} ${n1(by - h * .62)} ${n1(cx + w / 2)} ${n1(by - h * .42)} ${n1(cx + w / 2)} ${n1(by)}Q${n1(cx)} ${n1(by + w * .14)} ${n1(cx - w / 2)} ${n1(by)}Z`;
  function gasFire(o, S, n, vs) {
    if (!o.on) return ""; const u = o.uid, L = .45 + .55 * o.level;
    let s = `<path class="${P}pulse" d="${S.d}" fill="url(#${u}-ho)" fill-opacity="${g2(o, .85)}"/>`;
    for (let i = 0; i < n; i++) { const uu = (i + .5) / n;
      const a = S.at(uu, 0), b = S.at(uu, 1); s += `<path d="M${n1(a[0])} ${n1(a[1])}L${n1(b[0])} ${n1(b[1])}" stroke="#ff7a2a" stroke-opacity="${g2(o, .6)}" stroke-width="2.4" stroke-linecap="round"/>`;
      (vs || [.12, .34, .56, .78, .96]).forEach((v, j) => { const p = S.at(uu, v), sc = S.s(v), hh = (5 + 6 * L) * sc, ww = 3.4 * sc;
        [-1, 1].forEach((sd, k) => { const d = (.6 + ((i + j + k) % 4) * .11).toFixed(2), del = (((i * 5 + j * 3 + k) * .13) % .8).toFixed(2);
          s += `<path class="${P}flk" d="${flameD(p[0] + sd * ww * .55, p[1], ww, hh, sd * .8)}" fill="url(#${u}-fbt)" style="animation-duration:${d}s;animation-delay:-${del}s"/>`; }); }); }
    return s;
  }
  function fire(o, x1, x2, by, hm, n, lean) {
    if (!o.on) return ""; const u = o.uid, L = .5 + .5 * o.level, step = (x2 - x1) / n, w0 = step * 1.6; lean = lean || 0;
    let s = `<ellipse class="${P}pulse" cx="${(x1 + x2) / 2}" cy="${n1(by - hm * .3)}" rx="${n1((x2 - x1) / 2 + 10)}" ry="${n1(hm * .7)}" fill="url(#${u}-ho)" fill-opacity="${g2(o)}"/>`;
    [["fo", 1, 1, 1.2], ["fm", .64, .72, .95], ["fc", .34, .42, .7]].forEach(([gid, wk, hk, tb], li) => {
      for (let i = 0; i < n; i++) { const cx = x1 + step * (i + .5), sv = Math.sin(i * 2.3 + 1), hv = hm * L * (.6 + .4 * sv * sv) * hk, l2 = ((((i * 37) % 9) - 4) * .9 + lean) * (1 - li * .3);
        s += `<path class="${P}flk" d="${flameD(cx, by, w0 * wk, hv, l2)}" fill="url(#${u}-${gid})" style="animation-duration:${(tb + (i % 3) * .21).toFixed(2)}s;animation-delay:-${((i * .29 + li * .17) % 1.2).toFixed(2)}s"/>`; }
    });
    return s;
  }
  function logs(o, pts, glow) {
    return pts.map(([a, b, c, d, r]) => `<path d="M${a} ${b}L${c} ${d}" stroke="#1e1208" stroke-width="${2 * r + 1.4}" stroke-linecap="round"/><path d="M${a} ${b}L${c} ${d}" stroke="${o.on && glow ? "#4a2a16" : "#6e4628"}" stroke-width="${2 * r}" stroke-linecap="round"/><circle cx="${c}" cy="${d}" r="${r}" fill="${o.on && glow ? "#ff8a3a" : "#c89a62"}"/><circle cx="${c}" cy="${d}" r="${n1(r * .55)}" fill="none" stroke="${o.on && glow ? "#ffd27a" : "#8a5a32"}" stroke-width=".6"/>` +
      (o.on && glow ? `<path class="${P}emb" d="M${a} ${n1(b + r * .4)}L${c} ${n1(d + r * .4)}" stroke="#ff7a2a" stroke-width="${n1(r * .7)}" stroke-dasharray="2 4 1 5" stroke-linecap="round" stroke-opacity="${g2(o)}"/>` : "")).join("");
  }
  function coals(o, cx, cy, rx, ry, n, cs, shape) {
    const u = o.uid; let pts = [];
    for (let i = 0; i < n; i++) { const a = i * 2.39996, r = Math.sqrt((i + .5) / n); pts.push([cx + Math.cos(a) * r * rx * .9, cy + Math.sin(a) * r * ry * .8, cs * (.8 + ((i * 7) % 5) * .1), i]); }
    pts.sort((p, q) => p[1] - q[1]);
    let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${o.on ? "#2a0e06" : "#1a1a1b"}"/>` + (o.on ? `<ellipse class="${P}pulse" cx="${cx}" cy="${cy}" rx="${n1(rx * 1.05)}" ry="${n1(ry * 1.1)}" fill="url(#${u}-hr)" fill-opacity="${g2(o)}"/>` : "");
    pts.forEach(([x, y, r, i]) => {
      const pr = shape === "stick" ? `<rect x="${n1(x - r * 2.2)}" y="${n1(y - r * .5)}" width="${n1(r * 4.4)}" height="${n1(r * 1.1)}" rx="${n1(r * .5)}"` : `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(r)}" ry="${n1(r * .72)}"`;
      s += pr + ` fill="url(#${u}-coal)"/>`;
      if (o.on) s += pr.replace(/^<(\w+)/, `<$1 class="${P}emb" style="animation-duration:${(1.8 + (i % 4) * .5).toFixed(1)}s;animation-delay:-${(i * .37 % 2).toFixed(2)}s"`) + ` fill="url(#${u}-emb)" fill-opacity="${g2(o)}"/>`;
      else if (i % 3 === 0) s += `<circle cx="${n1(x - r * .2)}" cy="${n1(y - r * .2)}" r="${n1(r * .35)}" fill="#8a8a88" fill-opacity=".35"/>`;
    });
    return s;
  }
  function smoke(o, x, y, n, big, left) {
    if (!o.on) return ""; big = big || 1; const u = o.uid, d0 = +dur(o, 7, 3); n = n || 4;
    let s = `<g opacity="${(.5 + .45 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) { const r = (5 + (i % 3) * 1.4) * big, d = n1(d0 + (i % 3) * .7);
      s += `<g class="${P}${left ? "smk2" : "smk"}" style="animation-duration:${d}s;animation-delay:-${n1(i * d0 / n)}s"><circle cx="${x}" cy="${n1(y - r)}" r="${n1(r)}" fill="url(#${u}-smk)"/><circle cx="${n1(x + r * .7)}" cy="${n1(y - r * 1.6)}" r="${n1(r * .75)}" fill="url(#${u}-smk)"/><circle cx="${n1(x - r * .6)}" cy="${n1(y - r * 1.4)}" r="${n1(r * .6)}" fill="url(#${u}-smk)"/></g>`; }
    s += `<g class="${P}still">`; for (let i = 0; i < 4; i++) { const r = (4 + i * 2.4) * big, dx = (left ? -1 : 1) * i * i * 1.6 * big;
      s += `<circle cx="${n1(x + dx)}" cy="${n1(y - 4 - i * 10 * big)}" r="${n1(r)}" fill="url(#${u}-smk)" opacity="${(.9 - i * .16).toFixed(2)}"/>`; }
    return s + `</g></g>`;
  }
  function steam(o, x, y, w, n, big) {
    if (!o.on) return ""; n = n || 3; big = big || 1; const d = +dur(o, 4, 1.8), u = o.uid; let s = `<g opacity="${(.5 + .5 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) { const xi = x - w / 2 + w * (i + .5) / n, r = (4 + (i % 2) * 2) * big;
      s += `<g class="${P}stm" style="animation-duration:${n1(d + (i % 3) * .5)}s;animation-delay:-${n1(i * d / n)}s"><circle cx="${n1(xi)}" cy="${n1(y - r)}" r="${n1(r)}" fill="url(#${u}-stm)"/><circle cx="${n1(xi + r * .6)}" cy="${n1(y - r * 1.9)}" r="${n1(r * .8)}" fill="url(#${u}-stm)"/></g>`;
      s += `<circle class="${P}still" cx="${n1(xi + (i % 2) * 2)}" cy="${n1(y - r * 2 - (i % 2) * 6)}" r="${n1(r * 1.2)}" fill="url(#${u}-stm)" opacity=".6"/>`; }
    return s + `</g>`;
  }
  function shimmer(o, x, y, w, h, n) {
    if (!o.on) return ""; n = n || 4; const d = +dur(o, 3.4, 1.6), q = h / 4;
    let s = `<g opacity="${(.35 + .5 * o.level).toFixed(2)}">`;
    for (let i = 0; i < n; i++) {
      const xi = x - w / 2 + w * (i + .5) / n, sg = i % 2 ? 1 : -1, del = ((i * .41 * d) % d).toFixed(2);
      const pd = `d="M${n1(xi)} ${y}c${2.2 * sg} ${n1(-q * .5)} ${-2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${-2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}s${-2.2 * sg} ${n1(-q * .5)} 0 ${n1(-q)}" fill="none" stroke-linecap="round"`;
      s += `<g class="${P}shim" style="animation-duration:${d}s;animation-delay:-${del}s"><path ${pd} stroke="#ffcfa0" stroke-opacity=".1" stroke-width="3.5"/><path ${pd} stroke="#fff0dc" stroke-opacity=".45" stroke-width=".9" stroke-dasharray="${n1(h * .45)} ${n1(h * .3)}"/></g>`;
    }
    return s + `</g>`;
  }
  const sparks = (o, pts) => o.on ? pts.map((p, i) => `<circle class="${P}spark" cx="${p[0]}" cy="${p[1]}" r="${p[2] || .9}" fill="#ffd27a" style="animation-duration:${(2 + (i % 3) * .5).toFixed(1)}s;animation-delay:-${(i * .7).toFixed(1)}s"/>`).join("") : "";
  const pops = (o, pts) => o.on ? pts.map((p, i) => `<circle class="${P}pop" cx="${p[0]}" cy="${p[1]}" r="${p[2] || .8}" fill="#fff4d6" style="animation-duration:${(1.1 + (i % 4) * .3).toFixed(1)}s;animation-delay:-${(i * .37).toFixed(2)}s"/>`).join("") : "";

  const mk = (x1, y1, x2, y2, w) => `<path d="M${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}" stroke="#1a0a03" stroke-opacity=".8" stroke-width="${n1(w)}" stroke-linecap="round"/>`;
  function patty(o, x, y, s, opt) {
    opt = opt || {}; const u = o.uid;
    let r = `<ellipse cx="${n1(x)}" cy="${n1(y + 1.4 * s)}" rx="${n1(9.6 * s)}" ry="${n1(4 * s)}" fill="#000" fill-opacity=".45"/><ellipse cx="${n1(x)}" cy="${n1(y + .8 * s)}" rx="${n1(9 * s)}" ry="${n1(4 * s)}" fill="#33160a"/><ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(8.6 * s)}" ry="${n1(3.6 * s)}" fill="url(#${u}-mt)"/>`;
    if (opt.smash) r += `<ellipse cx="${n1(x)}" cy="${n1(y + .4 * s)}" rx="${n1(9.4 * s)}" ry="${n1(4.1 * s)}" fill="none" stroke="#8a4a1e" stroke-width="${n1(1.1 * s)}" stroke-dasharray="${n1(1.4 * s)} ${n1(1 * s)}"/>`;
    else for (let i = -1; i <= 1; i++) r += mk(x + i * 4 * s - 2 * s, y - 2.4 * s, x + i * 4 * s + 1.6 * s, y + 2.4 * s, 1.1 * s);
    if (opt.cheese) r += `<path d="M${n1(x - 7 * s)} ${n1(y - .6 * s)}L${n1(x - .4 * s)} ${n1(y - 3.6 * s)}L${n1(x + 7 * s)} ${n1(y - .8 * s)}L${n1(x + .6 * s)} ${n1(y + 2.6 * s)}Z" fill="#f7c33c"/><path d="M${n1(x + 2 * s)} ${n1(y + 1.8 * s)}q${n1(.4 * s)} ${n1(2.8 * s)} ${n1(1.6 * s)} ${n1(.2 * s)}M${n1(x - 4 * s)} ${n1(y + .6 * s)}q${n1(.2 * s)} ${n1(2 * s)} ${n1(1.2 * s)} ${n1(.4 * s)}" fill="#f2b42a"/><path d="M${n1(x - 4 * s)} ${n1(y - 1.6 * s)}L${n1(x - .4 * s)} ${n1(y - 3.2 * s)}" stroke="#fff" stroke-opacity=".5" stroke-width="${n1(.6 * s)}"/>`;
    return r + `<ellipse cx="${n1(x - 2.5 * s)}" cy="${n1(y - 1.4 * s)}" rx="${n1(3 * s)}" ry="${n1(.8 * s)}" fill="#fff" fill-opacity=".16"/>`;
  }
  function steak(o, x, y, s, flip) {
    const u = o.uid, f = flip ? -1 : 1, X = (v) => n1(x + v * s * f), Y = (v) => n1(y + v * s);
    const d = `M${X(-11)} ${Y(0)}C${X(-11)} ${Y(-4)} ${X(-3)} ${Y(-5)} ${X(3)} ${Y(-4.4)}C${X(10)} ${Y(-4)} ${X(12)} ${Y(-1)} ${X(10)} ${Y(2)}C${X(7)} ${Y(5)} ${X(-2)} ${Y(4.6)} ${X(-7)} ${Y(3.6)}C${X(-10)} ${Y(3)} ${X(-11)} ${Y(1.6)} ${X(-11)} ${Y(0)}Z`;
    let r = `<path d="${d}" fill="#000" fill-opacity=".45" transform="translate(0 ${n1(1.4 * s)})"/><path d="${d}" fill="#2e1206" transform="translate(0 ${n1(.8 * s)})"/><path d="${d}" fill="url(#${u}-stk)"/>`;
    r += `<path d="M${X(-10.4)} ${Y(-.6)}C${X(-10)} ${Y(-3.6)} ${X(-3)} ${Y(-4.6)} ${X(3)} ${Y(-4)}" fill="none" stroke="#e8cfa2" stroke-width="${n1(1.4 * s)}" stroke-linecap="round"/>`;
    for (let i = -2; i <= 2; i++) r += mk(x + (i * 4 - 2) * s * f, y - 3 * s, x + (i * 4 + 1.6) * s * f, y + 3 * s, 1 * s);
    return r;
  }
  function dog(o, x, y, s) {
    const u = o.uid; let r = `<rect x="${n1(x - 10 * s)}" y="${n1(y - 1.2 * s)}" width="${n1(20 * s)}" height="${n1(4.6 * s)}" rx="${n1(2.3 * s)}" fill="#000" fill-opacity=".45"/><rect x="${n1(x - 10 * s)}" y="${n1(y - 2.4 * s)}" width="${n1(20 * s)}" height="${n1(4.6 * s)}" rx="${n1(2.3 * s)}" fill="url(#${u}-dg)"/>`;
    for (let i = -3; i <= 3; i += 2) r += mk(x + i * 2.4 * s - s, y - 2 * s, x + i * 2.4 * s + s, y + 1.8 * s, .9 * s);
    return r + hl(n1(x - 8 * s), n1(y - 1.4 * s), n1(x + 8 * s), n1(y - 1.4 * s), n1(.7 * s), .4);
  }
  function corn(o, x, y, s) {
    const u = o.uid; let r = `<rect x="${n1(x - 11 * s)}" y="${n1(y - 1.4 * s)}" width="${n1(22 * s)}" height="${n1(5.4 * s)}" rx="${n1(2.7 * s)}" fill="#000" fill-opacity=".4"/><rect x="${n1(x - 9 * s)}" y="${n1(y - 2.8 * s)}" width="${n1(19 * s)}" height="${n1(5.4 * s)}" rx="${n1(2.7 * s)}" fill="url(#${u}-crn)"/>`;
    r += `<path d="M${n1(x - 8 * s)} ${n1(y - 1.2 * s)}H${n1(x + 9 * s)}M${n1(x - 8 * s)} ${n1(y + .6 * s)}H${n1(x + 9 * s)}" stroke="#a87a1a" stroke-opacity=".6" stroke-width="${n1(.5 * s)}" stroke-dasharray="${n1(1.2 * s)} ${n1(.5 * s)}"/>`;
    r += [-5, 0, 5].map((d) => `<ellipse cx="${n1(x + d * s)}" cy="${n1(y)}" rx="${n1(1.4 * s)}" ry="${n1(2 * s)}" fill="#3a1e08" fill-opacity=".55"/>`).join("");
    return r + `<path d="M${n1(x - 9 * s)} ${n1(y - 2.6 * s)}L${n1(x - 15 * s)} ${n1(y - 4 * s)}L${n1(x - 13 * s)} ${n1(y)}L${n1(x - 15 * s)} ${n1(y + 3.6 * s)}L${n1(x - 9 * s)} ${n1(y + 2.6 * s)}Z" fill="#9ab05a"/><path d="M${n1(x - 9 * s)} ${n1(y)}L${n1(x - 14 * s)} ${n1(y)}" stroke="#5a7030" stroke-width="${n1(.6 * s)}"/>`;
  }
  function kebab(o, x1, y1, x2, y2, n, s) {
    let r = `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#d8c08a" stroke-width="${n1(1 * s)}" stroke-linecap="round"/>`; const cols = ["#8a4220", "#3f8a3a", "#7a3a1a", "#d63a26", "#f0e2c6", "#8a4220"];
    for (let i = 0; i < n; i++) { const t = (i + 1) / (n + 1), x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t, c = cols[i % cols.length];
      r += `<rect x="${n1(x - 2.6 * s)}" y="${n1(y - 2.2 * s)}" width="${n1(5.2 * s)}" height="${n1(4.6 * s)}" rx="${n1(1.4 * s)}" fill="#000" fill-opacity=".35" transform="translate(0 ${n1(1 * s)})"/><rect x="${n1(x - 2.6 * s)}" y="${n1(y - 2.4 * s)}" width="${n1(5.2 * s)}" height="${n1(4.6 * s)}" rx="${n1(1.4 * s)}" fill="${c}"/><path d="M${n1(x - 1.6 * s)} ${n1(y - 1.6 * s)}h${n1(2.6 * s)}" stroke="#fff" stroke-opacity=".3" stroke-width="${n1(.6 * s)}"/>`;
      if (c !== "#f0e2c6") r += mk(x - 1.6 * s, y + 1.4 * s, x + 1.2 * s, y - 1 * s, .7 * s); }
    return r;
  }
  function ribs(o, x, y, w, h) {
    let r = `<path d="${rr(x, y + 1.6, w, h, h * .4)}" fill="#000" fill-opacity=".45"/><path d="${rr(x, y, w, h, h * .4)}" fill="#4a1c0c"/><path d="${rr(x + 1, y + .6, w - 2, h * .55, h * .3)}" fill="#7a3416"/>`;
    for (let i = 1; i < 6; i++) { const xx = x + w * i / 6; r += `<path d="M${n1(xx)} ${y + 1}V${y + h - 1}" stroke="#2a0e04" stroke-width=".7"/><rect x="${n1(xx - .9)}" y="${y + h - 1.4}" width="1.8" height="2.6" rx=".8" fill="#e9dcc2"/>`; }
    return r + `<path d="M${x + 2} ${y + 1.4}H${x + w - 3}" stroke="#ffb07a" stroke-opacity=".35" stroke-width=".8"/>`;
  }
  function fillet(x, y, w, h) {
    return `<path d="M${x} ${y + h}Q${x} ${y} ${x + w * .3} ${y}H${x + w}Q${x + w} ${y + h} ${x + w * .7} ${y + h}Z" fill="#e8784a"/><path d="M${x} ${y + h}Q${x} ${y} ${x + w * .3} ${y}H${x + w}" fill="none" stroke="#a8401e" stroke-width=".8"/>` +
      [.3, .5, .7].map((t) => `<path d="M${n1(x + w * t)} ${y + .6}q-2 ${n1(h / 2)} 0 ${n1(h - 1)}" fill="none" stroke="#ffc2a0" stroke-opacity=".7" stroke-width=".6"/>`).join("");
  }
  const sausage = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="3.4" rx="1.7" fill="#9a3e1c"/><path d="M${x + 1.4} ${y + .9}H${x + w - 1.4}" stroke="#fff" stroke-opacity=".3" stroke-width=".6"/>`;

  function hoodPath(a, b, yf, h) {
    const t = yf - h;
    return `M${n1(a)} ${n1(yf)}V${n1(yf - h * .28)}C${n1(a)} ${n1(yf - h * .86)} ${n1(a + h * .22)} ${n1(t)} ${n1(a + h * .62)} ${n1(t)}H${n1(b - h * .62)}C${n1(b - h * .22)} ${n1(t)} ${n1(b)} ${n1(yf - h * .86)} ${n1(b)} ${n1(yf - h * .28)}V${n1(yf)}Z`;
  }
  function hoodC(o, x1, x2, yf, h, opt) {
    opt = opt || {}; const cap = opt.cap == null ? 7 : opt.cap, cx = (x1 + x2) / 2;
    let s = cap ? blk(o, hoodPath(x1 - 1, x2 + 1, yf, h)) : "";
    const face = hoodPath(x1 + cap, x2 - cap, yf, h - (cap ? 1.5 : 0));
    s += pnt(o, face, "cv") + gloss(o, face, .22) + `<path d="M${n1(x1 + cap + h * .5)} ${n1(yf - h + 3)}H${n1(x2 - cap - h * .5)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" stroke-linecap="round"/>`;
    if (opt.window) s += opt.window;
    s += bar(o, x1 + 12, x2 - 12, yf - h * .42, 3.2) + (opt.dial === false ? "" : dial(o, cx, +(yf - h * .72).toFixed(1), opt.dr || 5, opt.f == null ? (tG(o) - 100) / 600 : opt.f));
    return s;
  }
  function hoodO(o, x1, x2, yb, h, opt) {
    opt = opt || {}; const u = o.uid, t = yb - h, p = pal(o.color);
    const ip = (a, b, tt) => `M${n1(a)} ${yb}V${n1(yb - h * .5)}C${n1(a)} ${n1(yb - h * .92)} ${n1(a + h * .2)} ${n1(tt)} ${n1(a + h * .5)} ${n1(tt)}H${n1(b - h * .5)}C${n1(b - h * .2)} ${n1(tt)} ${n1(b)} ${n1(yb - h * .92)} ${n1(b)} ${n1(yb - h * .5)}V${yb}Z`;
    let s = blk(o, ip(x1, x2, t)) + `<path d="${ip(x1 + 3, x2 - 3, t + 3)}" fill="url(#${u}-int)"/>`;
    if (o.on) s += `<path class="${P}pulse" d="${ip(x1 + 3, x2 - 3, t + 3)}" fill="url(#${u}-ho)" fill-opacity="${g2(o, .45)}"/>`;
    s += `<path d="M${n1(x1 + 1.5)} ${n1(yb - h * .5)}C${n1(x1 + 1.5)} ${n1(yb - h * .92)} ${n1(x1 + h * .2)} ${n1(t + 1.5)} ${n1(x1 + h * .5)} ${n1(t + 1.5)}H${n1(x2 - h * .5)}C${n1(x2 - h * .2)} ${n1(t + 1.5)} ${n1(x2 - 1.5)} ${n1(yb - h * .92)} ${n1(x2 - 1.5)} ${n1(yb - h * .5)}" fill="none" stroke="${metal(o) ? "#d4d8dc" : p.m}" stroke-width="3.4"/>` +
      `<path d="M${n1(x1 + h * .5)} ${n1(t + .6)}H${n1(x2 - h * .5)}" stroke="#fff" stroke-opacity=".35" stroke-width=".8"/>`;
    if (opt.rack !== false) { const ry = yb - h * .22; s += `<path d="M${x1 + 6} ${n1(ry)}H${x2 - 6}" stroke="#9aa1a8" stroke-width="1"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${n1(x1 + 8 + i * (x2 - x1 - 16) / 11)} ${n1(ry - 3)}V${n1(ry + 1)}" stroke="#8a9097" stroke-width=".6"/>`).join(""); }
    s += bar(o, x1 + 14, x2 - 14, t - 8, 3, 5);
    return s;
  }

  const css = `
.hda-grill-flk{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-grill-flk{animation:hda-grill-flk .8s ease-in-out infinite}
@keyframes hda-grill-flk{0%,100%{transform:scale(1,1)}30%{transform:scale(.88,1.22)}60%{transform:scale(1.06,.82)}80%{transform:scale(.95,1.1)}}
.hda-anim .hda-grill-pulse{animation:hda-grill-pulse 2.6s ease-in-out infinite}
@keyframes hda-grill-pulse{0%,100%{opacity:1}50%{opacity:.6}}
.hda-anim .hda-grill-emb{animation:hda-grill-emb 2.2s ease-in-out infinite}
@keyframes hda-grill-emb{0%,100%{opacity:.45}50%{opacity:1}}
.hda-grill-smk,.hda-grill-smk2{opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-grill-smk{animation:hda-grill-smk 5s ease-out infinite}
.hda-anim .hda-grill-smk2{animation:hda-grill-smk2 5s ease-out infinite}
@keyframes hda-grill-smk{0%{transform:translate(0,4px) scale(.4);opacity:0}18%{opacity:.8}100%{transform:translate(12px,-46px) scale(2.1);opacity:0}}
@keyframes hda-grill-smk2{0%{transform:translate(0,4px) scale(.4);opacity:0}18%{opacity:.8}100%{transform:translate(-12px,-46px) scale(2.1);opacity:0}}
.hda-grill-stm{opacity:0;transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-grill-stm{animation:hda-grill-stm 3.4s ease-out infinite}
@keyframes hda-grill-stm{0%{transform:translate(0,4px) scale(.45);opacity:0}25%{opacity:.85}100%{transform:translate(4px,-26px) scale(1.6);opacity:0}}
.hda-anim .hda-grill-still{display:none}
.hda-grill-shim{opacity:.5}
.hda-anim .hda-grill-shim{animation:hda-grill-shim 2.6s linear infinite}
@keyframes hda-grill-shim{0%{transform:translateY(6px);opacity:0}30%{opacity:.9}100%{transform:translateY(-12px);opacity:0}}
.hda-grill-spark{opacity:0}
.hda-anim .hda-grill-spark{animation:hda-grill-spark 2.4s ease-out infinite}
@keyframes hda-grill-spark{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-26px);opacity:0}}
.hda-grill-pop{opacity:.7;transform-box:fill-box;transform-origin:center}
.hda-anim .hda-grill-pop{animation:hda-grill-pop 1.3s ease-out infinite}
@keyframes hda-grill-pop{0%,60%{transform:scale(.2);opacity:0}75%{transform:scale(1);opacity:1}100%{transform:translateY(-3px) scale(1.4);opacity:0}}
.hda-anim .hda-grill-wf{animation:hda-grill-wf 1.6s ease-in-out infinite}
@keyframes hda-grill-wf{0%,100%{opacity:.25}50%{opacity:1}}
.hda-anim .hda-grill-sheen{animation:hda-grill-sheen 3s ease-in-out infinite alternate}
@keyframes hda-grill-sheen{0%{transform:translateX(-14px)}100%{transform:translateX(14px)}}
.hda-anim .hda-grill-bob{animation:hda-grill-bob 3s ease-in-out infinite}
@keyframes hda-grill-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-.8px)}}
.hda-grill-drip{opacity:0}
.hda-anim .hda-grill-drip{animation:hda-grill-drip 1.8s ease-in infinite}
@keyframes hda-grill-drip{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(14px);opacity:0}}
.hda-grill-spin{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-grill-spin{animation:hda-grill-spin 4s linear infinite}
@keyframes hda-grill-spin{to{transform:rotate(360deg)}}
.hda-grill-haze{opacity:.55}
.hda-anim .hda-grill-haze{animation:hda-grill-haze 6s linear infinite}
@keyframes hda-grill-haze{0%{transform:translateY(10px);opacity:0}30%{opacity:.7}100%{transform:translateY(-22px);opacity:0}}
@media (prefers-reduced-motion:reduce){.hda-anim .hda-grill-flk,.hda-anim .hda-grill-pulse,.hda-anim .hda-grill-emb,.hda-anim .hda-grill-smk,.hda-anim .hda-grill-smk2,.hda-anim .hda-grill-stm,.hda-anim .hda-grill-shim,.hda-anim .hda-grill-spark,.hda-anim .hda-grill-pop,.hda-anim .hda-grill-wf,.hda-anim .hda-grill-sheen,.hda-anim .hda-grill-bob,.hda-anim .hda-grill-drip,.hda-anim .hda-grill-spin,.hda-anim .hda-grill-haze{animation:none!important}.hda-anim .hda-grill-still{display:inline}}
`;

  const ic = (id, name, first, render, list) => ({ id, name, colors: sw(first, list), picker: true, colorLabel: "Finish", render });

  const icons = [
    ic("gas3", "Gas grill", BK, (o) => {
      const u = o.uid, S = surf(50, 150, 78, 96, 9);
      let s = scene(o, "siding", "patio", 150) + sh(o, 100, 168, 84, 5);
      s += tube(56, 114, 56, 160, 4) + tube(144, 114, 144, 160, 4) + `<rect x="54" y="144" width="92" height="4" fill="#1a1b1e"/><path d="M58 144.6H142" stroke="#fff" stroke-opacity=".12"/>` + tank(o, 66, 116, 26, 28);
      s += `<path d="M140 128h8v30h-8z" fill="#1e1f22"/>` + wheel(o, 56, 162, 6) + wheel(o, 144, 162, 6);
      s += `<path d="M30 99l-2 20M28 119h6l-1 5h-4z" stroke="#9aa1a8" stroke-width="1.2" fill="#9aa1a8"/><path d="M38 99v14" stroke="#9aa1a8" stroke-width="1.2"/><circle cx="38" cy="115" r="2.6" fill="none" stroke="#9aa1a8"/>`;
      s += blk(o, "M24 90H50V96H20Z") + `<rect x="20" y="96" width="30" height="3" fill="#0e0f11"/>` + blk(o, "M150 90H176L180 96H150Z") + `<rect x="150" y="96" width="30" height="3" fill="#0e0f11"/><path d="M24 90.5H50M150 90.5H176" stroke="#fff" stroke-opacity=".2"/>`;
      if (o.on) s += hoodO(o, 50, 150, 78, 46) + `<path d="${S.d}" fill="#0a0a0b"/>` + gasFire(o, S, 3) + grate(o, S, 22) +
        steak(o, 72, 84, .78) + steak(o, 94, 90, .9, true) + patty(o, 120, 84, .8) + patty(o, 132, 91, .9) + corn(o, 76, 92, .7) + pops(o, [[90, 85], [118, 80], [134, 87], [70, 80]]) + smoke(o, 100, 70, 4, .9) + shimmer(o, 100, 66, 80, 26, 5);
      s += `<path d="M52 114H148L140 124H60Z" fill="url(#${u}-ci)"/>` + pnt(o, "M50 96H150V114H50Z") + `<path d="M50 96.5H150" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/>` +
        [68, 90, 112].map((x) => knob(o, x, 105, 4.4)).join("") + `<circle cx="134" cy="105" r="3.2" fill="url(#${u}-cr)"/><circle cx="134" cy="105" r="2.2" fill="#b3302b"/>`;
      if (!o.on) s += hoodC(o, 50, 150, 96, 44);
      return svg(o, s);
    }),

    ic("gas4", "Stainless grill", SS, (o) => {
      const u = o.uid, S = surf(36, 146, 76, 94, 9);
      let s = scene(o, "brick", "deck", 146) + sh(o, 96, 166, 92, 5);
      s += steel(o, "M14 88H36V94H10Z") + `<rect x="10" y="94" width="26" height="3" fill="#6a7178"/>` + steel(o, "M146 88H182L188 94H146Z") + `<rect x="146" y="94" width="42" height="12" fill="url(#${u}-st)"/><path d="M146 94H188" stroke="#fff" stroke-opacity=".5"/>`;
      s += knob(o, 167, 100, 3.6, { ring: "b" });
      if (o.on) {
        s += steel(o, "M150 62H184V88H150Z", "stv") + `<path d="M152 64H182V86H152Z" fill="#000" fill-opacity=".25"/>` + `<ellipse cx="167" cy="91" rx="11" ry="2.6" fill="#0c0d0f"/><ellipse class="${P}pulse" cx="167" cy="90" rx="14" ry="5" fill="url(#${u}-hb)" fill-opacity="${g2(o)}"/>`;
        for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, x = 167 + Math.cos(a) * 7, y = 90.6 + Math.sin(a) * 1.8; s += `<path class="${P}flk" d="${flameD(x, y, 2.4, 3 + 3 * o.level, Math.cos(a) * .8)}" fill="url(#${u}-fb)" style="animation-duration:${(.6 + (i % 3) * .1).toFixed(2)}s;animation-delay:-${(i * .13).toFixed(2)}s"/>`; }
        s += `<ellipse cx="167" cy="90" rx="4" ry="1" fill="#1a1b1e"/>`;
      } else s += steel(o, "M150 84H184L186 88H148Z", "stv");
      s += pnt(o, "M36 112H146V160H36Z") + `<path d="M91 114V158" stroke="#000" stroke-opacity=".4"/>` + gloss(o, "M38 114H89V158H38Z", .18) + gloss(o, "M93 114H144V158H93Z", .18) +
        `<rect x="84" y="122" width="3" height="28" rx="1.5" fill="url(#${u}-stv)"/><rect x="95" y="122" width="3" height="28" rx="1.5" fill="url(#${u}-stv)"/><rect x="36" y="160" width="110" height="4" fill="#111"/>` + wheel(o, 42, 165, 3.4) + wheel(o, 140, 165, 3.4);
      if (o.on) s += hoodO(o, 36, 146, 76, 44) + `<path d="${S.d}" fill="#0a0a0b"/>` + gasFire(o, S, 4) + grate(o, S, 26) +
        patty(o, 58, 82, .78) + patty(o, 66, 90, .9, { cheese: 1 }) + dog(o, 92, 82, .8) + dog(o, 96, 89, .9) + kebab(o, 112, 92, 138, 80, 5, .9) + kebab(o, 120, 94, 144, 84, 5, .9) +
        pops(o, [[60, 78], [94, 79], [120, 82], [70, 86]]) + smoke(o, 90, 68, 4, .9, 1) + shimmer(o, 92, 64, 90, 24, 6);
      s += `<path d="M38 94H144V112H38Z" fill="url(#${u}-ci)"/>` + pnt(o, "M36 94H146V112H36Z") + `<path d="M36 94.5H146" stroke="#fff" stroke-opacity=".5" stroke-width=".8"/>` + [52, 74, 96, 118].map((x) => knob(o, x, 103, 4.2, { ss: 1, ring: "b" })).join("") + `<circle cx="136" cy="103" r="2.6" fill="url(#${u}-cr)"/>`;
      if (!o.on) s += hoodC(o, 36, 146, 94, 44);
      return svg(o, s);
    }),

    ic("island", "Grill island", SS, (o) => {
      const u = o.uid, S = surf(60, 140, 88, 102, 7);
      let s = scene(o, "dusk", "patio", 150);
      let bulbs = ""; for (let i = 0; i < 9; i++) { const t = i / 8, x = 8 + 184 * t, y = 18 + 22 * Math.sin(t * Math.PI) * .6 + (t * 8);
        bulbs += `<circle cx="${n1(x)}" cy="${n1(y + 4)}" r="6" fill="url(#${u}-hw)" opacity=".6"/><path d="M${n1(x)} ${n1(y)}v2" stroke="#111"/><ellipse cx="${n1(x)}" cy="${n1(y + 4)}" rx="1.8" ry="2.4" fill="#ffe2a8"/>`; }
      s += G(`<path d="M4 18Q100 44 196 26" fill="none" stroke="#0b0b12" stroke-width=".9"/>` + bulbs) + sh(o, 100, 162, 96, 5);
      s += `<rect x="10" y="106" width="180" height="54" fill="url(#${u}-stn)"/><rect x="10" y="106" width="180" height="54" fill="#000" fill-opacity=".18"/><path d="M10 106H190" stroke="#000" stroke-opacity=".5" stroke-width="2"/><rect x="10" y="158" width="180" height="4" fill="#1a1816"/>`;
      s += `<path d="M18 94H182L190 102H10Z" fill="url(#${u}-gran)"/><rect x="10" y="102" width="180" height="5" fill="#2a2c30"/><path d="M10 102.5H190" stroke="#fff" stroke-opacity=".3"/>` + Array.from({ length: 16 }, (_, i) => `<circle cx="${16 + (i * 37) % 170}" cy="${95.5 + (i * 7) % 6}" r=".7" fill="#fff" fill-opacity=".25"/>`).join("");
      s += `<path d="M22 96.2H48L50 99.6H20Z" fill="#a8774a"/><path d="M20 99.6H50V101H20Z" fill="#6e4628"/><ellipse cx="30" cy="97.6" rx="3" ry="1.4" fill="#d63a26"/><ellipse cx="38" cy="98" rx="2.6" ry="1.2" fill="#3f8a3a"/><path d="M156 99l22 -3" stroke="#c4c9ce" stroke-width="1.6" stroke-linecap="round"/>`;
      s += steel(o, "M56 100H144V102H56Z", "st") + pnt(o, "M60 107H140V122H60Z") + [76, 92, 108, 124].map((x) => knob(o, x, 114.5, 3.6, { ss: 1, ring: "o" })).join("");
      s += pnt(o, rr(66, 128, 68, 28, 1.5)) + `<path d="M100 129V155" stroke="#000" stroke-opacity=".4"/><rect x="92" y="134" width="2.6" height="16" rx="1.3" fill="url(#${u}-stv)"/><rect x="105.4" y="134" width="2.6" height="16" rx="1.3" fill="url(#${u}-stv)"/>` + gloss(o, rr(66, 128, 68, 28, 1.5), .16);
      if (o.on) s += hoodO(o, 60, 140, 88, 40) + `<path d="${S.d}" fill="#0a0a0b"/>` + gasFire(o, S, 3, [.15, .45, .8]) + grate(o, S, 20) + steak(o, 82, 94, .72) + steak(o, 104, 98, .8, true) + steak(o, 124, 93, .7) + pops(o, [[84, 90], [106, 93], [126, 88]]) + smoke(o, 104, 82, 4, .8) + shimmer(o, 100, 78, 70, 22, 4);
      else s += hoodC(o, 60, 140, 102, 38, { dr: 4.6 });
      return svg(o, s);
    }),

    ic("kettle", "Kettle grill", BK, (o) => {
      const u = o.uid, p = pal(o.color), cx = 100, cy = 98;
      let s = scene(o, "fence", "grass", 146) + sh(o, 100, 172, 62, 5);
      s += tube(70, 128, 54, 170, 3.4) + tube(100, 140, 100, 166, 3.4) + tube(130, 128, 148, 162, 3.4) + wheel(o, 150, 164, 7) + `<path d="M50 170h8" stroke="#111" stroke-width="3" stroke-linecap="round"/>`;
      s += `<path d="M62 152L100 158L138 150" fill="none" stroke="#7d848c" stroke-width="1.2"/><ellipse cx="100" cy="150" rx="20" ry="3.6" fill="url(#${u}-st)"/><ellipse cx="100" cy="149" rx="18" ry="2.6" fill="#5a6067"/>`;
      const bowl = `M54 ${cy}A46 44 0 0 0 146 ${cy}Z`;
      s += pnt(o, bowl, "s") + gloss(o, bowl, .2) + `<path d="M60 108Q68 132 90 140" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2.2" stroke-linecap="round"/>` + [-1, 0, 1].map((k) => `<path d="M${94 + k * 6} 134l2 4" stroke="#0b0b0c" stroke-width="2" stroke-linecap="round"/>`).join("");
      s += `<path d="M44 96h12v5h-12z" fill="#151618"/><path d="M144 96h12v5h-12z" fill="#151618"/><path d="M44 96.5h12M144 96.5h12" stroke="#fff" stroke-opacity=".2"/>`;
      if (o.on) {
        s += `<ellipse cx="${cx}" cy="${cy}" rx="46" ry="11" fill="${p.k}"/><ellipse cx="${cx}" cy="${cy + .6}" rx="44" ry="10" fill="#0a0a0b"/>` + coals(o, cx, cy + 2.4, 34, 6.4, 26, 3.2);
        let d = ""; for (let x = 60; x <= 140; x += 5.5) { const dy = 9.4 * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / 43, 2))); d += `M${n1(x)} ${n1(cy - dy)}V${n1(cy + dy)}`; }
        s += `<path d="${d}" stroke="#08090a" stroke-width="2"/><path d="${d}" stroke="#7d848c" stroke-width=".7"/><ellipse cx="${cx}" cy="${cy}" rx="43" ry="9.4" fill="none" stroke="#8a9097" stroke-width="1.2"/>`;
        s += patty(o, 80, 96, .8) + patty(o, 102, 101, .9) + dog(o, 118, 94, .8) + dog(o, 124, 99, .85) + pops(o, [[80, 92], [104, 96], [122, 91]]);
        s += `<path d="M160 64A20 44 0 0 1 160 152Z" fill="${p.k}"/>` + pnt(o, "M161 64A20 44 0 0 1 161 152Z", "s") + `<path d="M166 74Q178 108 166 142" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="1.6"/><path d="M180 104h6v8h-6z" fill="#151618"/><path d="M160 64V152" stroke="#000" stroke-opacity=".5" stroke-width="1.4"/>`;
        s += smoke(o, 96, 86, 4, 1) + shimmer(o, 100, 82, 70, 26, 5);
      } else {
        const lid = `M54 ${cy}A46 40 0 0 1 146 ${cy}Z`;
        s += `<ellipse cx="${cx}" cy="${cy}" rx="47" ry="3" fill="#000" fill-opacity=".5"/>` + pnt(o, lid, "s") + gloss(o, lid, .28) + `<path d="M64 84Q74 64 98 60" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round"/>` +
          `<ellipse cx="${cx}" cy="${cy - 1}" rx="46" ry="2" fill="none" stroke="${p.l}" stroke-opacity=".5"/><path d="M84 54h32v4h-32z" fill="#e8ecef" opacity=".85"/><path d="M84 54h32" stroke="#fff"/><rect x="82" y="50" width="36" height="5" rx="2.5" fill="#151618"/>` +
          `<circle cx="118" cy="64" r="5" fill="url(#${u}-cr)"/>` + [0, 1, 2].map((k) => `<path d="M${115 + k * 2.4} 62v4" stroke="#222" stroke-width="1"/>`).join("") + dial(o, 82, 72, 4, 0);
      }
      return svg(o, s);
    }),

    ic("kamado", "Kamado grill", GN, (o) => {
      const u = o.uid, p = pal(o.color), cy = 96;
      let s = scene(o, "hedge", "concrete", 148) + sh(o, 100, 166, 64, 5);
      s += tube(66, 134, 62, 160, 3) + tube(134, 134, 138, 160, 3) + `<path d="M64 150H136" stroke="#2a2c30" stroke-width="2.4"/>` + wheel(o, 62, 162, 4) + wheel(o, 138, 162, 4);
      [[22, 58], [142, 178]].forEach(([a, b]) => { s += `<path d="M${a} 100H${b}L${b + 2} 104H${a - 2}Z" fill="url(#${u}-wd)"/>` + [0, 1, 2, 3].map((k) => `<path d="M${a + k * 9 + 6} 100.4V104" stroke="#3a2614" stroke-width=".6"/>`).join("") + `<rect x="${a - 2}" y="104" width="${b - a + 4}" height="2.4" fill="#4a3220"/>`; });
      if (o.on) { const dome = `M62 ${cy - 4}C60 62 76 40 100 38C124 40 140 62 138 ${cy - 4}Z`, inn = `M66 ${cy - 6}C66 66 80 46 100 44C120 46 134 66 134 ${cy - 6}Z`;
        s += pnt(o, dome, "s") + `<path d="${inn}" fill="url(#${u}-int)"/><path class="${P}pulse" d="${inn}" fill="url(#${u}-ho)" fill-opacity="${g2(o, .5)}"/><path d="${inn}" fill="none" stroke="#e8e0d0" stroke-opacity=".35" stroke-width="1.6"/>` +
          `<circle cx="100" cy="36" r="8" fill="url(#${u}-bk)"/><path d="M93 36h14M100 29v14" stroke="#4a4d53"/><rect x="86" y="24" width="28" height="4" rx="2" fill="url(#${u}-wd)"/><path d="M90 28v5M110 28v5" stroke="#2a2c30" stroke-width="2"/>`; }
      const body = `M60 ${cy}C58 128 76 150 100 150C124 150 142 128 140 ${cy}Z`;
      s += pnt(o, body, "s") + `<path d="${body}" fill="url(#${u}-g)" opacity=".35"/><path d="M66 106Q70 132 90 144" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.4" stroke-linecap="round"/>`;
      s += `<path d="${rr(91, 128, 18, 11, 2)}" fill="url(#${u}-st)"/><path d="${rr(94, 131, 12, 5, 1)}" fill="#0b0b0c"/>` + (o.on ? `<path class="${P}emb" d="${rr(94.5, 131.5, 11, 4, 1)}" fill="#ff6a1a" fill-opacity="${g2(o)}"/>` : "");
      s += `<rect x="58" y="${cy - 2}" width="84" height="6" rx="1.5" fill="url(#${u}-bkc)"/>` + [66, 84, 116, 134].map((x) => `<circle cx="${x}" cy="${cy + 1}" r="1" fill="#9aa1a8"/>`).join("");
      if (o.on) {
        s += `<ellipse cx="100" cy="${cy}" rx="40" ry="9" fill="#141414"/><ellipse cx="100" cy="${cy + .4}" rx="37" ry="8" fill="#0a0a0b"/>` + coals(o, 100, cy + 2, 30, 5.6, 24, 3);
        let d = ""; for (let x = 68; x <= 132; x += 5) { const dy = 7.6 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 100) / 35, 2))); d += `M${x} ${n1(cy - dy)}V${n1(cy + dy)}`; }
        s += `<path d="${d}" stroke="#08090a" stroke-width="2"/><path d="${d}" stroke="#7d848c" stroke-width=".7"/><ellipse cx="100" cy="${cy}" rx="35" ry="7.6" fill="none" stroke="#8a9097"/>` +
          steak(o, 86, 96, .7) + steak(o, 112, 99, .78, true) + pops(o, [[86, 92], [112, 95]]) + smoke(o, 100, 86, 4, 1) + shimmer(o, 100, 82, 56, 24, 4);
      } else {
        const dome = `M60 ${cy}C60 64 78 46 100 46C122 46 140 64 140 ${cy}Z`;
        s += pnt(o, dome, "s") + `<path d="${dome}" fill="url(#${u}-g)" opacity=".4"/><path d="M68 84Q72 60 94 52" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round"/><circle cx="84" cy="58" r="2.2" fill="#fff" fill-opacity=".5"/>` +
          `<rect x="58" y="${cy - 3}" width="84" height="6" rx="1.5" fill="url(#${u}-bkc)"/><path d="M90 40h20l-2 6h-16z" fill="url(#${u}-ci)"/><circle cx="100" cy="40" r="6" fill="url(#${u}-bk)"/>` + [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${n1(100 + Math.cos(i * 1.047) * 3.4)}" cy="${n1(40 + Math.sin(i * 1.047) * 3.4)}" r=".9" fill="#000"/>`).join("") +
          dial(o, 100, 64, 4.4, 0) + `<path d="M90 80v6M110 80v6" stroke="#2a2c30" stroke-width="2"/><rect x="84" y="84" width="32" height="4.6" rx="2.3" fill="url(#${u}-wd)"/>`;
      }
      return svg(o, s);
    }, [GN, RD, BK, BL, GY, SS, CU]),

    ic("portable", "Portable grill", RD, (o) => {
      const u = o.uid, S = surf(48, 142, 96, 108, 7);
      let s = scene(o, "hedge", "deck", 130);
      s += `<path d="M10 126H190L194 146H6Z" fill="url(#${u}-wd)"/>` + [0, 1, 2, 3].map((k) => `<path d="M${n1(9 - k)} ${126 + k * 5}H${n1(191 + k)}" stroke="#2a1a0e" stroke-opacity=".7" stroke-width=".9"/>`).join("") + `<rect x="6" y="146" width="188" height="6" fill="#4a3220"/><path d="M6 146.5H194" stroke="#fff" stroke-opacity=".2"/><path d="M30 152L18 194M170 152L182 194M30 152L44 194M170 152L156 194" stroke="#3a2818" stroke-width="5"/>`;
      s += sh(o, 96, 137, 56, 4) + `<path d="M56 128l-6 9M136 128l6 9" stroke="#1a1b1e" stroke-width="2.6" stroke-linecap="round"/>`;
      s += `<path d="${rr(146, 92, 13, 40, 5)}" fill="#2f63a8"/><path d="${rr(146, 92, 13, 40, 5)}" fill="url(#${u}-fx)"/><path d="M149 98V126" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/><rect x="148" y="86" width="9" height="7" rx="1" fill="#b8902e"/><path d="M146 113h-6" stroke="#b8902e" stroke-width="3"/>`;
      const tub = "M48 108H142L138 126Q136 131 130 131H60Q54 131 52 126Z";
      s += pnt(o, tub) + gloss(o, tub, .2) + `<path d="${rr(70, 114, 50, 10, 2)}" fill="#000" fill-opacity=".22"/><path d="M48 108.6H142" stroke="#fff" stroke-opacity=".35"/>` + knob(o, 136, 118, 3.6);
      if (o.on) s += hoodO(o, 48, 142, 96, 34, { rack: false }) + `<path d="${S.d}" fill="#0a0a0b"/>` + gasFire(o, S, 2, [.2, .55, .9]) + grate(o, S, 20) + patty(o, 66, 101, .7) + patty(o, 86, 104, .78) + dog(o, 112, 100, .7) + dog(o, 118, 105, .74) + pops(o, [[66, 97], [88, 100], [114, 97]]) + smoke(o, 94, 92, 3, .8) + shimmer(o, 96, 90, 70, 20, 4);
      else { const lid = "M48 108C48 88 60 78 78 78H112C130 78 142 88 142 108Z";
        s += pnt(o, lid, "cv") + gloss(o, lid, .3) + `<path d="M58 92Q62 82 78 81H112" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.8" stroke-linecap="round"/>` + `<rect x="74" y="92" width="42" height="5" rx="2.5" fill="#151618"/><path d="M76 93h38" stroke="#fff" stroke-opacity=".2"/>` + dial(o, 95, 86, 3.6, 0); }
      return svg(o, s);
    }),

    ic("griddle36", "Flat-top griddle", BK, (o) => {
      const u = o.uid, S = surf(32, 168, 84, 102, 10);
      let s = scene(o, "fence", "patio", 146) + sh(o, 100, 166, 92, 5);
      s += tube(38, 118, 38, 160, 3.6) + tube(162, 118, 162, 160, 3.6) + `<rect x="36" y="140" width="128" height="4" fill="#1a1b1e"/>` + tank(o, 50, 112, 24, 28) + wheel(o, 38, 162, 5) + wheel(o, 162, 162, 5);
      s += `<rect x="168" y="98" width="20" height="3" fill="#1a1b1e"/><path d="${rr(170, 104, 16, 8, 4)}" fill="#f2efe6"/><path d="M171 106h14" stroke="#000" stroke-opacity=".1"/><path d="M170 101v4M186 101v4" stroke="#1a1b1e" stroke-width="1.2"/>`;
      s += pnt(o, "M10 92H32V98H6Z") + pnt(o, "M168 92H190L194 98H168Z") + `<rect x="6" y="98" width="26" height="3" fill="#0e0f11"/><rect x="168" y="98" width="26" height="3" fill="#0e0f11"/>`;
      s += `<path d="M10 92l1-12h6l1 12z" fill="#d6362a"/><path d="M12 80l2-4 2 4" fill="#e8e8e8"/><path d="M20 92l1-11h6l1 11z" fill="#f2c230"/><path d="M22 81l2-4 2 4" fill="#e8e8e8"/><path d="M11.4 82v8M21.4 83v7" stroke="#fff" stroke-opacity=".4"/>`;
      s += `<rect x="32" y="102" width="136" height="3" fill="#0a0a0b"/>`;
      if (o.on) {
        s += `<rect class="${P}pulse" x="36" y="102" width="128" height="3" fill="#4f9dff" fill-opacity="${g2(o, .7)}"/>` + Array.from({ length: 14 }, (_, i) => `<path class="${P}flk" d="${flameD(40 + i * 9, 105, 3, 2.4, 0)}" fill="url(#${u}-fb)" style="animation-duration:${(.5 + (i % 3) * .1).toFixed(2)}s;animation-delay:-${(i * .11).toFixed(2)}s"/>`).join("");
        s += steel(o, "M42 74H158V84H42Z", "stv") + steel(o, "M42 74L32 92V102L42 84Z", "st") + steel(o, "M158 74L168 92V102L158 84Z", "st");
        s += `<path d="${S.d}" fill="url(#${u}-grd)"/><path d="${S.d}" fill="url(#${u}-grs)"/><path class="${P}pulse" d="${S.d}" fill="url(#${u}-ho)" fill-opacity="${g2(o, .22)}"/>`;
        s += `<ellipse cx="62" cy="91" rx="14" ry="4" fill="#d9b88a" fill-opacity=".9"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${54 + (i * 7) % 16} ${88 + (i % 3) * 2}q2 -1.6 4 0" fill="none" stroke="#f4e2b8" stroke-width=".8"/>`).join("") + `<ellipse cx="62" cy="90" rx="10" ry="2" fill="#8a5a24" fill-opacity=".4"/>`;
        s += patty(o, 92, 88, .8, { smash: 1 }) + patty(o, 116, 88, .8, { smash: 1, cheese: 1 }) + patty(o, 100, 97, .95, { smash: 1, cheese: 1 }) + patty(o, 128, 97, .95, { smash: 1 });
        s += `<path d="M146 92L160 86" stroke="#2a2c30" stroke-width="2.4" stroke-linecap="round"/><path d="M138 93l8 -1.6 1.4 3 -8 1.8z" fill="url(#${u}-st)"/>`;
        s += pops(o, [[90, 84], [104, 92], [118, 84], [126, 93], [64, 87], [96, 94]]) + steam(o, 106, 86, 50, 4, 1) + shimmer(o, 100, 76, 120, 22, 6);
      } else {
        s += pnt(o, "M42 76H158L168 94H32Z", "v") + pnt(o, "M32 94H168V102H32Z") + `<path d="M42 76.5H158" stroke="#fff" stroke-opacity=".35"/>` + gloss(o, "M42 76H158L168 94H32Z", .2) + bar(o, 84, 116, 80, 2.6, 2);
      }
      s += pnt(o, "M32 105H168V118H32Z") + [56, 82, 108, 134].map((x) => knob(o, x, 111.5, 4, { ring: "b" })).join("") + `<circle cx="154" cy="111.5" r="2.6" fill="url(#${u}-cr)"/><circle cx="154" cy="111.5" r="1.6" fill="#b3302b"/>`;
      return svg(o, s);
    }),

    ic("griddle22", "Tabletop griddle", GY, (o) => {
      const u = o.uid, S = surf(50, 150, 100, 116, 8);
      let s = scene(o, "dusk", "grass", 132);
      s += `<path d="M14 126H186L190 134H10Z" fill="url(#${u}-sst)"/><rect x="10" y="134" width="180" height="4" fill="#7d848c"/><path d="M28 138L60 194M60 138L28 194M140 138L172 194M172 138L140 194" stroke="#9aa1a8" stroke-width="2.2"/>`;
      s += sh(o, 100, 130, 58, 3.6) + `<path d="M56 126v4M144 126v4" stroke="#111" stroke-width="3"/>`;
      s += `<path d="${rr(28, 115, 22, 9, 4.5)}" fill="#3a8a4a"/><path d="M31 117H46" stroke="#fff" stroke-opacity=".3"/><rect x="24" y="117" width="5" height="5" rx="1" fill="#b8902e"/>`;
      s += pnt(o, "M50 116H150V126H50Z") + knob(o, 140, 121, 3.2, { ring: "b" }) + `<path d="M62 120h50" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;
      if (o.on) {
        s += hoodO(o, 50, 150, 100, 30, { rack: false }) + `<path d="${S.d}" fill="url(#${u}-grd)"/><path d="${S.d}" fill="url(#${u}-grs)"/><path class="${P}pulse" d="${S.d}" fill="url(#${u}-ho)" fill-opacity="${g2(o, .25)}"/>`;
        s += `<ellipse cx="72" cy="106" rx="11" ry="3.4" fill="#000" fill-opacity=".4"/><ellipse cx="72" cy="105" rx="11" ry="3.4" fill="#d9a050"/><ellipse cx="72" cy="104.4" rx="8" ry="2.2" fill="#e8bc6a"/><rect x="70" y="102.4" width="4" height="1.6" fill="#ffe28a"/>`;
        s += `<ellipse cx="84" cy="112" rx="11" ry="3.4" fill="#000" fill-opacity=".4"/><ellipse cx="84" cy="111" rx="11" ry="3.4" fill="#d9a050"/><ellipse cx="84" cy="110.4" rx="8" ry="2.2" fill="#e8bc6a"/>`;
        s += [[106, 105], [118, 111]].map(([x, y]) => `<path d="M${x - 8} ${y}q2 -4 7 -3t8 2q1 3 -6 3.6t-9 -2.6z" fill="#fbf8f0"/><ellipse cx="${x}" cy="${y - 1}" rx="2.6" ry="1.6" fill="#f6b21e"/><ellipse cx="${x - .7}" cy="${y - 1.6}" rx=".9" ry=".5" fill="#fff" fill-opacity=".6"/>`).join("");
        s += [0, 1, 2].map((k) => `<path d="M${130 + k * 3} 104q3 2 0 4t0 4" fill="none" stroke="#9a3a22" stroke-width="2.2" stroke-linecap="round"/><path d="M${130 + k * 3} 104q3 2 0 4t0 4" fill="none" stroke="#f0c8a8" stroke-width=".7" stroke-dasharray="1.4 1.4"/>`).join("");
        s += pops(o, [[106, 102], [120, 108], [132, 102], [78, 108]]) + steam(o, 100, 102, 60, 4, .9) + shimmer(o, 100, 96, 80, 16, 5);
      } else s += hoodC(o, 50, 150, 116, 26, { cap: 0, dial: false });
      return svg(o, s);
    }),

    ic("builtgrid", "Built-in griddle", SS, (o) => {
      const u = o.uid, S = surf(52, 148, 90, 104, 7);
      let s = scene(o, "stucco", "concrete", 150) + sh(o, 100, 162, 94, 5);
      s += `<rect x="10" y="110" width="180" height="50" fill="#b8a48a"/><rect x="10" y="110" width="180" height="50" fill="url(#${u}-fx)"/>` + Array.from({ length: 30 }, (_, i) => `<circle cx="${14 + (i * 37) % 172}" cy="${114 + (i * 13) % 42}" r=".7" fill="#000" fill-opacity=".1"/>`).join("") + `<rect x="10" y="158" width="180" height="3" fill="#2a2420"/>`;
      s += `<path d="M22 84H178L190 106H10Z" fill="#8f8a84"/><path d="M22 84H178L190 106H10Z" fill="url(#${u}-grs)"/><rect x="10" y="106" width="180" height="5" fill="#6e6a64"/><path d="M10 106.5H190M22 84.5H178" stroke="#fff" stroke-opacity=".3"/>`;
      s += `<path d="M58 87H142L151 106H49Z" fill="url(#${u}-st)"/><path d="M58 87H142L151 106H49Z" fill="url(#${u}-br)"/>`;
      s += pnt(o, rr(52, 114, 96, 13, 2)) + [68, 90, 112, 134].map((x) => knob(o, x, 120.5, 3.6, { ss: 1, ring: "b" })).join("");
      s += pnt(o, rr(64, 132, 72, 24, 1.5)) + gloss(o, rr(64, 132, 72, 24, 1.5), .16) + `<rect x="84" y="136" width="32" height="2.6" rx="1.3" fill="url(#${u}-stv)"/>`;
      if (o.on) {
        s += steel(o, "M58 50H142V88H58Z", "stv") + `<path d="M60 52H140V86H60Z" fill="#000" fill-opacity=".18"/><rect x="80" y="44" width="40" height="3" rx="1.5" fill="url(#${u}-stv)"/><path d="M82 47v3M118 47v3" stroke="#5a6067" stroke-width="2"/>`;
        s += `<path d="${S.d}" fill="url(#${u}-grd)"/><path d="${S.d}" fill="url(#${u}-grs)"/><path class="${P}pulse" d="${S.d}" fill="url(#${u}-ho)" fill-opacity="${g2(o, .25)}"/>`;
        const strips = [["#c8352a", 70, 94], ["#3f8a3a", 80, 98], ["#f2c230", 92, 94], ["#c8352a", 86, 101], ["#f0e2c6", 74, 100], ["#3f8a3a", 98, 99], ["#f0e2c6", 102, 94]];
        s += strips.map(([c, x, y], i) => `<path d="M${x} ${y}q5 -${2 + i % 2} 10 0" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="2.6" stroke-linecap="round" transform="translate(0 1)"/><path d="M${x} ${y}q5 -${2 + i % 2} 10 0" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`).join("");
        s += [[118, 94], [128, 98], [122, 101], [134, 93]].map(([x, y]) => `<path d="M${x} ${y}a4 3 0 1 1 6 1.6" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="3.4" stroke-linecap="round" transform="translate(0 1)"/><path d="M${x} ${y}a4 3 0 1 1 6 1.6" fill="none" stroke="#f08a6a" stroke-width="3" stroke-linecap="round"/><path d="M${x + 1} ${y - 1.4}a3 2 0 0 1 4 -.4" fill="none" stroke="#ffd2c0" stroke-width=".7"/>`).join("");
        s += pops(o, [[76, 92], [94, 92], [120, 91], [130, 96], [86, 98]]) + steam(o, 100, 90, 64, 5, 1) + shimmer(o, 100, 86, 80, 20, 5);
      } else s += steel(o, "M58 86H142L151 104H49Z", "stv") + `<path d="M49 104H151V107H49Z" fill="#7d848c"/><rect x="84" y="99" width="32" height="2.6" rx="1.3" fill="url(#${u}-cr)"/>`;
      return svg(o, s);
    }),

    ic("pellet", "Pellet grill", BK, (o) => {
      const u = o.uid;
      let s = scene(o, "siding", "deck", 152) + sh(o, 96, 168, 84, 5);
      s += tube(58, 124, 58, 162, 3.6) + tube(150, 124, 150, 164, 3.6) + `<rect x="56" y="146" width="96" height="3.4" fill="#1a1b1e"/>` + wheel(o, 58, 163, 5) + `<path d="M146 166h8" stroke="#111" stroke-width="3"/>`;
      s += `<path d="M64 146l2 -14h16l2 14z" fill="#8a6a3a"/><path d="M66 132h16" stroke="#5a4020"/><path d="M70 138h8" stroke="#fff" stroke-opacity=".3"/>`;
      s += blk(o, "M159 84H168V30H160V84Z", "bkc") + `<rect x="156" y="26" width="15" height="5" rx="1.4" fill="url(#${u}-bk)"/><rect x="158" y="22" width="11" height="3" rx="1" fill="#0e0f11"/>`;
      s += smoke(o, 163, 22, 5, 1.1) + shimmer(o, 163, 20, 14, 18, 2);
      const box = "M50 92V112Q50 124 62 124H146Q158 124 158 112V92Z", lid = "M50 92V84C50 66 62 58 76 58H132C146 58 158 66 158 84V92Z";
      s += pnt(o, box) + pnt(o, lid, "cv") + gloss(o, lid, .2) + `<path d="M62 62H146" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/><path d="M50 92H158" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/><path d="M50 93.2H158" stroke="#fff" stroke-opacity=".12"/>`;
      if (o.on) s += `<path class="${P}pulse" d="M52 92H156" stroke="#ff8a3d" stroke-opacity="${g2(o, .5)}" stroke-width="1"/>` + smoke(o, 56, 92, 2, .5, 1);
      s += bar(o, 66, 142, 78, 3.2) + dial(o, 104, 68, 4.6, (tS(o) - 100) / 400) + `<path d="M50 100H158" stroke="#000" stroke-opacity=".2"/>`;
      s += pnt(o, "M18 72H50V126H18Z") + `<path d="M16 66H50L52 72H18Z" fill="url(#${u}-bk)"/><path d="M18 66.5H50" stroke="#fff" stroke-opacity=".25"/>` + gloss(o, "M18 72H50V126H18Z", .16);
      s += `<path d="${rr(21, 80, 26, 30, 2)}" fill="#0e0f11"/>` + lcd(o, 23, 83, 22, 10, tS(o)) + wifi(o, 40, 101, .7) + led(o, 26, 100, "#34d399") + knob(o, 34, 117, 4);
      return svg(o, s);
    }),

    ic("vpellet", "Vertical smoker", BK, (o) => {
      const u = o.uid, win = rr(82, 46, 52, 74, 3), cl = `${u}-vw`;
      let s = scene(o, "fence", "concrete", 150) + sh(o, 104, 162, 54, 5);
      s += tube(78, 146, 78, 158, 3) + tube(144, 146, 144, 158, 3) + wheel(o, 78, 160, 4) + wheel(o, 144, 160, 4);
      s += blk(o, "M124 12H132V28H124Z", "bkc") + `<rect x="122" y="10" width="12" height="3" fill="#0e0f11"/>` + smoke(o, 128, 10, 4, .9, 1);
      s += `<path d="M72 30L80 24H156L150 30Z" fill="url(#${u}-bk)"/>` + `<path d="M150 30L156 24V144L150 148Z" fill="${pal(o.color).k}"/>` + pnt(o, "M72 30H150V148H72Z") + gloss(o, "M72 30H150V148H72Z", .18);
      s += `<path d="${win}" fill="#0b0908"/><clipPath id="${cl}"><path d="${win}"/></clipPath><g clip-path="url(#${cl})">`;
      if (o.on) s += `<g opacity="${g2(o)}"><path class="${P}pulse" d="${win}" fill="url(#${u}-win)" fill-opacity=".55"/></g>`;
      s += [62, 84, 106].map((y) => `<path d="M82 ${y}H134" stroke="#7d848c" stroke-width="1"/>`).join("") + ribs(o, 88, 55, 40, 6) + Array.from({ length: 5 }, (_, i) => sausage(88 + i * 8.4, 78, 6.4)).join("") + `<path d="M90 99q4 -4 8 0M104 99q4 -4 8 0M118 99q4 -4 8 0" fill="#b86a2a" stroke="#6a3010"/>`;
      if (o.on) s += [0, 1, 2].map((i) => `<ellipse class="${P}haze" cx="${96 + i * 14}" cy="${100 - i * 14}" rx="20" ry="9" fill="url(#${u}-smk)" style="animation-delay:-${i * 2}s"/>`).join("");
      else s += `<path d="${win}" fill="#000" opacity=".55"/>`;
      s += `</g><path d="${win}" fill="url(#${u}-glass)"/><path d="${win}" fill="none" stroke="#000" stroke-opacity=".7" stroke-width="1.6"/>`;
      s += `<rect x="139" y="58" width="4" height="48" rx="2" fill="url(#${u}-stv)"/><path d="M140 58v48" stroke="#fff" stroke-opacity=".5" stroke-width=".7"/><path d="M76 126H146" stroke="#000" stroke-opacity=".3"/>` + [0, 1, 2, 3].map((k) => `<path d="M${84 + k * 16} 134h10" stroke="#000" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>`).join("");
      s += pnt(o, "M42 66H72V130H42Z") + `<path d="M40 60H72V66H42Z" fill="url(#${u}-bk)"/>` + `<path d="${rr(45, 74, 24, 28, 2)}" fill="#0e0f11"/>` + lcd(o, 47, 76, 20, 9, tS(o)) + wifi(o, 63, 95, .65) + led(o, 50, 94) + knob(o, 57, 114, 4);
      return svg(o, s);
    }),

    ic("offset", "Offset smoker", BK, (o) => {
      const u = o.uid, p = pal(o.color);
      let s = scene(o, "dusk", "grass", 140) + sh(o, 100, 166, 88, 5);
      s += tube(150, 116, 150, 158, 3.4) + tube(96, 116, 96, 158, 3.4) + `<path d="M60 146H156" stroke="#2a2c30" stroke-width="2.4"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${64 + i * 10} 144v4" stroke="#2a2c30"/>`).join("") + `<path d="M146 160h8" stroke="#111" stroke-width="3"/>`;
      s += logs({ on: false }, [[100, 142, 140, 140, 3], [106, 136, 146, 135, 2.8], [112, 141, 150, 142, 2.6]]);
      s += pnt(o, "M159 80H168V22H160V80Z", "c") + `<rect x="156" y="18" width="15" height="5" rx="1.4" fill="url(#${u}-bk)"/>` + smoke(o, 164, 18, 6, 1.3);
      s += `<ellipse cx="170" cy="96" rx="6" ry="22" fill="${p.k}"/>` + pnt(o, "M60 74H170V118H60Z", "cv") + `<path d="M60 96H170" stroke="#000" stroke-opacity=".6" stroke-width="1.2"/><path d="M62 77H168" stroke="#fff" stroke-opacity=".3" stroke-width="1.4" stroke-linecap="round"/>` + gloss(o, "M60 74H170V96H60Z", .16);
      s += `<ellipse cx="60" cy="96" rx="4" ry="22" fill="${p.d}"/>` + [80, 150].map((x) => `<rect x="${x}" y="71" width="5" height="4" fill="#111"/>`).join("");
      s += `<rect x="80" y="89" width="62" height="4" rx="2" fill="#111"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M${82 + i * 4.2} 88.4v5.2" stroke="#8a9097" stroke-width=".8"/>`).join("") + `<path d="M82 89v-4M140 89v-4" stroke="#222" stroke-width="2"/>` + dial(o, 112, 82, 5, (tS(o) - 100) / 400);
      if (o.on) s += smoke(o, 64, 96, 2, .5, 1) + shimmer(o, 116, 72, 80, 18, 5);
      s += wheel(o, 34, 150, 11, 8) + tube(30, 126, 34, 150, 3);
      s += `<path d="M18 92L24 86H62L60 92Z" fill="url(#${u}-bk)"/>` + pnt(o, "M18 92H60V128H18Z") + `<path d="${rr(22, 96, 34, 28, 2)}" fill="#000" fill-opacity=".25"/>`;
      if (o.on) s += `<path class="${P}pulse" d="${rr(22, 96, 34, 28, 2)}" fill="none" stroke="#ff7a2a" stroke-opacity="${g2(o, .9)}" stroke-width="1.2"/><circle class="${P}pulse" cx="40" cy="113" r="12" fill="url(#${u}-ho)" fill-opacity="${g2(o)}"/>`;
      s += `<circle cx="40" cy="113" r="8" fill="url(#${u}-ci)"/>` + [0, 1, 2, 3, 4].map((i) => { const a = i * 1.2566, x = n1(40 + Math.cos(a) * 4.6), y = n1(113 + Math.sin(a) * 4.6); return `<circle cx="${x}" cy="${y}" r="1.6" fill="${o.on ? "#ff8a3a" : "#0b0b0c"}"/>` + (o.on ? `<circle class="${P}emb" cx="${x}" cy="${y}" r="1.6" fill="#ffd27a" style="animation-delay:-${i * .4}s"/>` : ""); }).join("") +
        `<circle cx="40" cy="113" r="2" fill="url(#${u}-cr)"/><rect x="28" y="99" width="24" height="3" rx="1.5" fill="#111"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${29 + i * 4} 98.4v4.2" stroke="#8a9097" stroke-width=".7"/>`).join("") + sparks(o, [[36, 92], [44, 90, .7], [40, 88]]);
      return svg(o, s);
    }),

    ic("bullet", "Bullet smoker", BK, (o) => {
      const u = o.uid;
      let s = scene(o, "brick", "patio", 150) + sh(o, 100, 170, 46, 5);
      s += tube(74, 140, 60, 172, 2.8) + tube(126, 140, 140, 172, 2.8) + tube(100, 148, 100, 174, 2.8);
      const bowl = "M66 126C66 140 80 150 100 150C120 150 134 140 134 126Z";
      s += pnt(o, bowl, "s") + [86, 100, 114].map((x) => `<circle cx="${x}" cy="138" r="2.4" fill="#0b0b0c"/>` + (o.on ? `<circle class="${P}emb" cx="${x}" cy="138" r="1.8" fill="#ff6a1a" style="animation-delay:-${(x % 3) * .5}s"/>` : "")).join("");
      s += pnt(o, "M66 70H134V127H66Z", "c") + `<path d="M66 126.5H134" stroke="#000" stroke-opacity=".6" stroke-width="1.4"/>`;
      s += `<path d="${rr(88, 96, 24, 22, 2)}" fill="${pal(o.color).d}"/><path d="${rr(88, 96, 24, 22, 2)}" fill="url(#${u}-fx)"/><path d="${rr(88, 96, 24, 22, 2)}" fill="none" stroke="#000" stroke-opacity=".5"/><rect x="96" y="104" width="8" height="3" rx="1.5" fill="url(#${u}-stv)"/>` +
        (o.on ? `<path class="${P}pulse" d="${rr(87.4, 95.4, 25.2, 23.2, 2.2)}" fill="none" stroke="#ff7a2a" stroke-opacity="${g2(o, .7)}" stroke-width=".9"/>` : "");
      s += [60, 140].map((x) => `<rect x="${x - 4}" y="80" width="8" height="12" rx="2" fill="#151618"/>`).join("") + `<circle cx="78" cy="84" r="1.6" fill="#9aa1a8"/><circle cx="122" cy="84" r="1.6" fill="#9aa1a8"/>`;
      const dome = "M66 70C66 48 82 36 100 36C118 36 134 48 134 70Z";
      s += pnt(o, dome, "s") + gloss(o, dome, .3) + `<path d="M72 60Q76 44 94 40" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="2.2" stroke-linecap="round"/><path d="M66 70H134" stroke="#000" stroke-opacity=".5" stroke-width="1.6"/>`;
      s += `<rect x="90" y="28" width="20" height="4" rx="2" fill="#151618"/><path d="M93 32v4M107 32v4" stroke="#151618" stroke-width="2"/><circle cx="116" cy="42" r="3.6" fill="url(#${u}-cr)"/><circle cx="116" cy="42" r="1.4" fill="#111"/>` + dial(o, 100, 54, 5, (tS(o) - 100) / 400);
      if (o.on) s += smoke(o, 116, 38, 5, 1) + smoke(o, 68, 70, 2, .5, 1) + smoke(o, 132, 70, 2, .5) + shimmer(o, 100, 30, 50, 18, 3);
      return svg(o, s);
    }),

    ic("electric", "Electric smoker", SS, (o) => {
      const u = o.uid, win = rr(76, 64, 46, 60, 3), cl = `${u}-ew`;
      let s = scene(o, "slats", "deck", 150) + sh(o, 104, 156, 50, 4);
      s += `<path d="M64 156Q40 160 24 170" fill="none" stroke="#111" stroke-width="1.8"/><path d="M68 148v8M132 148v8" stroke="#111" stroke-width="4" stroke-linecap="round"/>`;
      s += `<path d="M64 34L72 28H146L136 34Z" fill="url(#${u}-sst)"/><path d="M136 34L146 28V142L136 148Z" fill="${metal(o) ? "#7d848c" : pal(o.color).k}"/>` + pnt(o, "M64 34H136V148H64Z") + gloss(o, "M64 34H136V148H64Z", .18);
      s += `<rect x="118" y="24" width="10" height="5" rx="1" fill="#2a2c30"/>` + smoke(o, 123, 24, 4, .8);
      s += `<path d="${rr(70, 38, 60, 18, 2.4)}" fill="#0b0c0e"/>` + lcd(o, 74, 41, 30, 12, tS(o), "#5ab0ff") + wifi(o, 112, 51, .75) + `<circle cx="121" cy="47" r="2.6" fill="#1e2024" stroke="#3a3c40" stroke-width=".6"/><circle cx="126.6" cy="47" r="2.6" fill="#1e2024" stroke="#3a3c40" stroke-width=".6"/><path d="M120 47h2M126.6 46v2M125.6 47h2" stroke="#9aa1a8" stroke-width=".6"/>`;
      s += `<path d="M68 60H132V144H68Z" fill="#000" fill-opacity=".14"/><path d="${win}" fill="#0b0908"/><clipPath id="${cl}"><path d="${win}"/></clipPath><g clip-path="url(#${cl})">`;
      if (o.on) s += `<g opacity="${g2(o)}"><path class="${P}pulse" d="${win}" fill="url(#${u}-win)" fill-opacity=".5"/></g>`;
      s += [80, 98, 116].map((y) => `<path d="M76 ${y}H122" stroke="#9aa1a8" stroke-width=".9"/>`).join("") + fillet(80, 73, 16, 6) + fillet(100, 73, 16, 6) + ribs(o, 80, 90, 38, 7) + Array.from({ length: 4 }, (_, i) => sausage(80 + i * 10, 111, 8)).join("");
      if (o.on) s += [0, 1, 2].map((i) => `<ellipse class="${P}haze" cx="${90 + i * 12}" cy="${112 - i * 16}" rx="18" ry="8" fill="url(#${u}-smk)" style="animation-delay:-${i * 2}s"/>`).join("");
      else s += `<path d="${win}" fill="#000" opacity=".55"/>`;
      s += `</g><path d="${win}" fill="url(#${u}-glass)"/><path d="${win}" fill="none" stroke="#000" stroke-opacity=".7" stroke-width="1.4"/>`;
      s += `<rect x="126" y="76" width="3.4" height="36" rx="1.7" fill="url(#${u}-stv)"/><rect x="66" y="70" width="3" height="8" rx="1" fill="#2a2c30"/><rect x="66" y="126" width="3" height="8" rx="1" fill="#2a2c30"/>`;
      s += `<path d="M140 104h14v8h-14z" fill="url(#${u}-st)"/><circle cx="156" cy="108" r="4" fill="#151618"/><path d="M152 108h8" stroke="#3a3c40"/>`;
      return svg(o, s);
    }, [SS, BK, GY, RD, BL, CU]),

    ic("drum", "Drum smoker", RD, (o) => {
      const u = o.uid, p = pal(o.color);
      let s = scene(o, "stucco", "concrete", 150) + sh(o, 100, 152, 46, 5);
      s += pnt(o, "M64 64H136V150H64Z", "c") + gloss(o, "M64 64H136V150H64Z", .14) + `<path d="M64 150H136" stroke="#000" stroke-opacity=".6" stroke-width="1.6"/>`;
      [92, 122].forEach((y) => { s += `<rect x="63" y="${y - 2}" width="74" height="4" fill="url(#${u}-c)"/><path d="M63 ${y - 2}H137" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/><path d="M63 ${y + 2}H137" stroke="#000" stroke-opacity=".45" stroke-width=".8"/>`; });
      s += [58, 142].map((x) => `<path d="M${x} 74h${x < 100 ? 6 : -6}M${x} 86h${x < 100 ? 6 : -6}M${x} 74v12" fill="none" stroke="url(#${u}-st)" stroke-width="2.4" stroke-linecap="round"/>`).join("") + dial(o, 88, 78, 5, (tS(o) - 100) / 400);
      [78, 100, 122].forEach((x, i) => { s += `<rect x="${x - 3}" y="134" width="6" height="7" fill="#b8902e"/><rect x="${x - 3}" y="134" width="6" height="7" fill="url(#${u}-fx)"/><circle cx="${x}" cy="137.6" r="2.2" fill="#d8b04a"/>`;
        s += i === 2 ? `<rect x="${x - 3.6}" y="133" width="7.2" height="9" rx="1.6" fill="#8a9097"/>` : `<path d="M${x} 137.6L${o.on ? x : x + 7} ${o.on ? 130 : 137.6}" stroke="#c8231b" stroke-width="2" stroke-linecap="round"/>` + (o.on ? `<circle class="${P}pulse" cx="${x}" cy="142" r="4" fill="url(#${u}-ho)" fill-opacity="${g2(o, .7)}"/>` : ""); });
      s += `<ellipse cx="100" cy="64" rx="38" ry="6" fill="${p.k}"/><path d="M62 64V60H138V64Z" fill="url(#${u}-c)"/><ellipse cx="100" cy="60" rx="38" ry="6" fill="url(#${u}-cv)"/><ellipse cx="100" cy="60" rx="38" ry="6" fill="url(#${u}-g)" opacity=".25"/><ellipse cx="100" cy="60" rx="32" ry="4" fill="none" stroke="#000" stroke-opacity=".25"/>`;
      s += `<rect x="84" y="50" width="22" height="4" rx="2" fill="url(#${u}-st)"/><path d="M86 54v4M104 54v4" stroke="#5a6067" stroke-width="2"/><rect x="118" y="44" width="7" height="14" fill="url(#${u}-st)"/><rect x="116" y="42" width="11" height="3" fill="#2a2c30"/>`;
      if (o.on) s += smoke(o, 121, 42, 5, 1, 1) + shimmer(o, 100, 50, 60, 16, 4);
      return svg(o, s);
    }, [RD, BK, BL, GN, GY, SS, CU]),

    ic("gravity", "Gravity smoker", BK, (o) => {
      const u = o.uid;
      let s = scene(o, "siding", "patio", 150) + sh(o, 100, 166, 86, 5);
      s += tube(30, 148, 30, 160, 3.4) + tube(80, 130, 80, 160, 3.4) + tube(164, 130, 164, 160, 3.4) + `<rect x="78" y="140" width="88" height="3.4" fill="#1a1b1e"/>` + wheel(o, 30, 162, 4.4) + wheel(o, 80, 162, 4.4) + `<path d="M160 162h8" stroke="#111" stroke-width="3"/>`;
      s += blk(o, "M154 70H162V38H154Z", "bkc") + `<rect x="151" y="34" width="14" height="5" rx="1.4" fill="url(#${u}-bk)"/>` + smoke(o, 158, 34, 5, 1.1);
      const ch = "M72 96V86Q72 70 88 70H156Q170 70 170 86V96Z";
      s += pnt(o, "M72 96H170V130H72Z") + pnt(o, ch, "cv") + gloss(o, ch, .2) + `<path d="M72 96H170" stroke="#000" stroke-opacity=".6" stroke-width="1.2"/>` + bar(o, 90, 156, 82, 3) + `<path d="M84 104H160" stroke="#000" stroke-opacity=".25"/>` + [96, 112, 128, 144].map((x) => `<path d="M${x} 112h8" stroke="#000" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>`).join("");
      if (o.on) s += shimmer(o, 120, 70, 70, 14, 4);
      s += `<path d="M24 30L32 24H78L74 30Z" fill="url(#${u}-bk)"/>` + pnt(o, "M24 30H74V150H24Z") + gloss(o, "M24 30H74V150H24Z", .16) + `<rect x="34" y="26" width="30" height="2.6" rx="1.3" fill="url(#${u}-stv)"/>`;
      s += `<path d="${rr(30, 46, 38, 30, 2.4)}" fill="#0b0c0e"/>` + lcd(o, 33, 49, 32, 13, tS(o)) + wifi(o, 60, 71, .75) + led(o, 38, 70) + knob(o, 49, 88, 5);
      s += `<path d="${rr(32, 114, 34, 28, 2)}" fill="#000" fill-opacity=".25"/><path d="M36 122H62" stroke="#0b0b0c" stroke-width="3" stroke-linecap="round"/>` + (o.on ? `<path class="${P}emb" d="M37 122H61" stroke="#ff6a1a" stroke-width="1.6" stroke-linecap="round" stroke-opacity="${g2(o)}"/>` : "") + `<rect x="42" y="132" width="14" height="3" rx="1.5" fill="url(#${u}-stv)"/>`;
      return svg(o, s);
    }),

    ic("infrared", "Infrared grill", SS, (o) => {
      const u = o.uid, S = surf(46, 154, 80, 98, 9);
      let s = scene(o, "slats", "patio", 150) + sh(o, 100, 166, 70, 5);
      s += `<path d="M52 114V162M148 114V162" stroke="#1a1b1e" stroke-width="4"/><path d="M53 114V162" stroke="#fff" stroke-opacity=".15"/><rect x="50" y="146" width="100" height="3" fill="#1a1b1e"/>`;
      s += steel(o, "M18 92H46V98H14Z") + `<rect x="14" y="98" width="32" height="3" fill="#6a7178"/>`;
      if (o.on) {
        s += hoodO(o, 46, 154, 80, 42) + `<path d="${S.d}" fill="#0a0a0b"/>`;
        [[0, .48], [.52, 1]].forEach(([a, b]) => { const p0 = S.at(a + .02, .08), p1 = S.at(b - .02, .08), p2 = S.at(b - .02, .94), p3 = S.at(a + .02, .94), d = `M${n1(p0[0])} ${n1(p0[1])}L${n1(p1[0])} ${n1(p1[1])}L${n1(p2[0])} ${n1(p2[1])}L${n1(p3[0])} ${n1(p3[1])}Z`;
          s += `<path d="${d}" fill="#3a2a26"/><g opacity="${(.55 + .45 * o.level).toFixed(2)}"><path class="${P}emb" d="${d}" fill="url(#${u}-ir)"/></g><path d="${d}" fill="url(#${u}-hex)" opacity=".7"/>`; });
        s += `<path class="${P}pulse" d="${S.d}" fill="url(#${u}-hr)" fill-opacity="${g2(o, .5)}"/>` + grate(o, S, 14, { c: "#6a6d72", w: 1.5 }) + steak(o, 76, 88, .95) + steak(o, 120, 89, 1, true) + pops(o, [[74, 84], [118, 84], [100, 88], [134, 90]]) + shimmer(o, 100, 70, 90, 30, 6) + smoke(o, 100, 74, 3, .8);
      }
      s += pnt(o, "M46 98H154V114H46Z") + `<path d="M46 98.5H154" stroke="#fff" stroke-opacity=".45" stroke-width=".8"/>` + [74, 100, 126].map((x) => knob(o, x, 106, 4, { ss: 1, ring: "o" })).join("");
      if (!o.on) s += hoodC(o, 46, 154, 98, 40, { cap: 3 });
      return svg(o, s);
    }),

    ic("rotisserie", "Rotisserie grill", CU, (o) => {
      const u = o.uid, S = surf(42, 158, 82, 100, 9), ck = `${u}-ck`;
      let s = scene(o, "brick", "patio", 150) + sh(o, 100, 166, 88, 5);
      s += pnt(o, "M42 118H158V160H42Z") + `<path d="M100 120V158" stroke="#000" stroke-opacity=".4"/><rect x="93" y="126" width="2.6" height="26" rx="1.3" fill="url(#${u}-stv)"/><rect x="104.4" y="126" width="2.6" height="26" rx="1.3" fill="url(#${u}-stv)"/><rect x="42" y="160" width="116" height="4" fill="#111"/>` + gloss(o, "M42 118H158V160H42Z", .14);
      s += steel(o, "M20 94H42V100H16Z") + steel(o, "M158 94H180L184 100H158Z") + `<rect x="16" y="100" width="26" height="3" fill="#6a7178"/><rect x="158" y="100" width="26" height="3" fill="#6a7178"/>`;
      if (o.on) {
        s += hoodO(o, 42, 158, 82, 48, { rack: false }) + `<path d="M50 74H150" stroke="#2a0e06" stroke-width="5" stroke-linecap="round"/><path class="${P}emb" d="M52 74H148" stroke="#ff6a2a" stroke-width="3.4" stroke-linecap="round" stroke-opacity="${g2(o)}"/><path d="M52 74H148" stroke="url(#${u}-hex)" stroke-width="3.4"/><ellipse class="${P}pulse" cx="100" cy="76" rx="56" ry="9" fill="url(#${u}-hr)" fill-opacity="${g2(o, .6)}"/>`;
        s += `<path d="${S.d}" fill="#0a0a0b"/>` + gasFire(o, S, 4, [.3, .7]) + grate(o, S, 26);
        s += `<rect x="20" y="52" width="16" height="14" rx="2" fill="url(#${u}-bk)"/><path d="M28 66V94" stroke="#2a2c30" stroke-width="2.4"/>` + led(o, 32, 56, "#ff9a4a") + `<path d="M36 60H172" stroke="url(#${u}-cr)" stroke-width="2"/><circle cx="172" cy="60" r="2.4" fill="#151618"/>`;
        s += `<clipPath id="${ck}"><ellipse cx="100" cy="62" rx="22" ry="15"/></clipPath><g class="${P}bob"><ellipse cx="100" cy="64" rx="22" ry="15" fill="#000" fill-opacity=".35"/><ellipse cx="100" cy="62" rx="22" ry="15" fill="url(#${u}-ckn)"/>` +
          `<path d="M80 66q-8 2 -10 8q6 2 12 -3z" fill="url(#${u}-ckn)"/><path d="M120 66q8 2 10 8q-6 2 -12 -3z" fill="url(#${u}-ckn)"/><ellipse cx="72" cy="72" rx="3" ry="2" fill="#f0e2c6"/><ellipse cx="128" cy="72" rx="3" ry="2" fill="#f0e2c6"/><path d="M84 54q16 -6 32 0" fill="none" stroke="#5a2a0c" stroke-opacity=".5"/>` +
          `<g clip-path="url(#${ck})"><rect class="${P}sheen" x="88" y="44" width="10" height="40" fill="#fff" fill-opacity=".22" transform="rotate(14 93 64)"/></g><path d="M86 52Q96 47 108 50" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="1.6" stroke-linecap="round"/></g>`;
        s += [76, 124].map((x) => `<path d="M${x} 56L${x + (x < 100 ? 8 : -8)} 60L${x} 64" fill="none" stroke="url(#${u}-st)" stroke-width="1.6"/>`).join("");
        s += [90, 100, 110].map((x, i) => `<ellipse class="${P}drip" cx="${x}" cy="78" rx=".8" ry="1.3" fill="#ffd27a" style="animation-delay:-${(i * .6).toFixed(1)}s"/>`).join("") + smoke(o, 100, 44, 4, .9) + shimmer(o, 100, 46, 80, 18, 5);
      }
      s += `<path d="M44 100H156V118H44Z" fill="url(#${u}-ci)"/>` + pnt(o, "M42 100H158V118H42Z") + [60, 80, 100, 120, 140].map((x, i) => knob(o, x, 109, 3.8, { ss: 1, ring: i === 0 ? "o" : "b" })).join("");
      if (!o.on) s += hoodC(o, 42, 158, 100, 48);
      return svg(o, s);
    }, [CU, SS, BK, RD, BL, GY]),

    ic("santamaria", "Santa Maria grill", BK, (o) => {
      const u = o.uid, gy = o.on ? 84 + 18 * o.level : 70, S = surf(40, 160, gy - 12, gy, 8);
      let s = scene(o, "dusk", "grass", 150) + sh(o, 100, 172, 86, 5);
      s += tube(34, 150, 30, 172, 3.6) + tube(166, 150, 170, 172, 3.6) + tube(28, 34, 28, 128, 4) + tube(172, 34, 172, 128, 4) + `<path d="M24 34H176" stroke="#08090a" stroke-width="5" stroke-linecap="round"/><path d="M24 34H176" stroke="#2c2e33" stroke-width="4" stroke-linecap="round"/><path d="M26 32.6H174" stroke="#fff" stroke-opacity=".2"/>`;
      const ch = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${n1(x2)} ${n1(y2)}" stroke="#7d848c" stroke-width="1.2" stroke-dasharray="1.6 1"/>`;
      s += [40, 160].map((x) => `<circle cx="${x}" cy="36" r="2.4" fill="url(#${u}-cr)"/>`).join("") + ch(40, 38, S.at(0, 0)[0], gy - 12) + ch(160, 38, S.at(1, 0)[0], gy - 12) + ch(40, 38, 40, gy) + ch(160, 38, 160, gy);
      s += `<path d="M40 36H172" stroke="#9aa1a8" stroke-width=".7"/>`;
      s += `<path d="M36 116H164L172 128H28Z" fill="#0b0908"/>` + (o.on ? `<path class="${P}pulse" d="M36 116H164L172 128H28Z" fill="url(#${u}-ho)" fill-opacity="${g2(o)}"/>` : `<path d="M36 124Q60 118 100 122T164 124L170 127H30Z" fill="#5a5856"/>`);
      s += logs(o, [[50, 126, 96, 120, 3.4], [104, 125, 152, 121, 3.4], [76, 123, 128, 118, 3]], 1) + fire(o, 52, 100, 122, 18 + 14 * o.level, 4, -2) + fire(o, 104, 150, 122, 14 + 12 * o.level, 4, 2) + sparks(o, [[70, 100], [100, 96], [126, 104], [88, 92, .7], [140, 98, .7]]);
      s += `<path d="${S.d}" fill="none"/>`;
      let vb = ""; for (let k = 0; k <= 14; k++) { const a = S.at(k / 14, 0), b = S.at(k / 14, 1); vb += `M${n1(a[0])} ${n1(a[1])}L${n1(b[0])} ${n1(b[1])}`; }
      s += `<path d="${vb}" stroke="#08090a" stroke-width="3"/><path d="${vb}" stroke="#5a5d63" stroke-width="1.1" transform="translate(-.4 -.5)"/><path d="${S.d}" fill="none" stroke="#2c2e33" stroke-width="2.2"/>`;
      if (o.on) s += steak(o, 70, gy - 6, .9) + steak(o, 100, gy - 4, 1, true) + `<path d="M118 ${gy - 9}h30l-2 7h-30z" fill="#7a3218"/><path d="M118 ${gy - 9}h30" stroke="#e8cfa2" stroke-width="1.2"/>` + [122, 130, 138, 146].map((x) => mk(x - 1, gy - 8, x - 3, gy - 3, .9)).join("") + smoke(o, 90, gy - 12, 5, 1.1) + smoke(o, 130, gy - 12, 3, .9, 1);
      s += pnt(o, "M28 128H172V150H28Z") + gloss(o, "M28 128H172V150H28Z", .14) + `<path d="M28 128.5H172" stroke="#fff" stroke-opacity=".35"/>` + [52, 100, 148].map((x) => `<path d="M${x - 8} 138h16" stroke="#000" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>`).join("");
      s += `<circle cx="172" cy="72" r="16" fill="none" stroke="#08090a" stroke-width="3.6"/><circle cx="172" cy="72" r="16" fill="none" stroke="#3a3c42" stroke-width="2.4"/>` + [0, 1, 2, 3, 4, 5].map((i) => { const a = i * Math.PI / 3 + (o.on ? o.level * 2 : 0); return `<path d="M172 72L${n1(172 + Math.cos(a) * 15)} ${n1(72 + Math.sin(a) * 15)}" stroke="#3a3c42" stroke-width="1.6"/>`; }).join("") +
        `<circle cx="172" cy="72" r="3.4" fill="url(#${u}-cr)"/><path d="M186 72h6" stroke="#6e4628" stroke-width="3.4" stroke-linecap="round"/>`;
      return svg(o, s);
    }),

    ic("hibachi", "Yakitori grill", GY, (o) => {
      const u = o.uid;
      let s = scene(o, "bamboo", "concrete", 140) + sh(o, 100, 156, 84, 5);
      s += `<path d="M26 146v6M174 146v6M40 146v6M160 146v6" stroke="#111" stroke-width="4" stroke-linecap="round"/>`;
      const top = "M30 96H170L178 118H22Z";
      s += `<path d="${top}" fill="#141414"/>` + (o.on ? `<path class="${P}pulse" d="${top}" fill="url(#${u}-hr)" fill-opacity="${g2(o)}"/>` : "");
      s += coals(o, 100, 108, 72, 8, 26, 3.2, "stick") + `<path d="M30 96H170" stroke="#4a4c50" stroke-width="1.4"/>`;
      let handles = "";
      if (o.on) { for (let i = 0; i < 6; i++) { const x = 47 + i * 21;
          s += `<path d="M${x + 2} 96L${x - 1} 118" stroke="#d8c08a" stroke-width="1.3" stroke-linecap="round"/>`;
          handles += `<path d="M${x - 1} 116L${x - 2.4} 136" stroke="#5a4626" stroke-width="3.6" stroke-linecap="round"/><path d="M${x - 1} 116L${x - 2.4} 136" stroke="#d2b47a" stroke-width="2.6" stroke-linecap="round"/><path d="M${x - 1.6} 118L${x - 2.8} 134" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`;
          for (let k = 0; k < 4; k++) { const y = 99.6 + k * 4.6, xx = x + 1.6 - k * .6, sc = .85 + k * .08, c = i === 2 && k % 2 ? "#3f8a3a" : i === 4 && k % 2 ? "#f0e2c6" : k % 2 ? "#b8682e" : "#c97c3a";
            s += `<ellipse cx="${n1(xx)}" cy="${n1(y + 1.3)}" rx="${n1(5.4 * sc)}" ry="${n1(2.6 * sc)}" fill="#000" fill-opacity=".45"/><ellipse cx="${n1(xx)}" cy="${n1(y)}" rx="${n1(5.2 * sc)}" ry="${n1(2.6 * sc)}" fill="${c}"/><ellipse cx="${n1(xx)}" cy="${n1(y + .6)}" rx="${n1(5.2 * sc)}" ry="${n1(2 * sc)}" fill="#5a2208" fill-opacity=".35"/>` +
              mk(xx - 3 * sc, y - .4, xx + 1 * sc, y - 1.6, .8) + `<ellipse cx="${n1(xx - 1.4)}" cy="${n1(y - 1)}" rx="${n1(2 * sc)}" ry=".6" fill="#fff" fill-opacity=".35"/>`; } }
        s += smoke(o, 72, 96, 4, 1) + smoke(o, 128, 96, 4, 1, 1) + sparks(o, [[60, 98], [96, 94], [132, 97], [150, 92, .7]]) + shimmer(o, 100, 92, 130, 20, 7) + pops(o, [[58, 100], [100, 104], [142, 100]]);
      }
      s += pnt(o, "M22 118H178V146H22Z") + gloss(o, "M22 118H178V146H22Z", .14) + `<path d="M22 118.5H178" stroke="#fff" stroke-opacity=".45"/><path d="M22 96L30 96L22 118Z" fill="${pal(o.color).k}"/><path d="M178 118L170 96H178Z" fill="${pal(o.color).k}"/>` + handles;
      [[50, 128], [134, 128]].forEach(([x, y]) => { s += `<path d="${rr(x - 14, y, 28, 10, 1.6)}" fill="#0b0b0c"/>` + (o.on ? `<path class="${P}emb" d="${rr(x - 12, y + 2, 24 * (.4 + .6 * o.level), 6, 1)}" fill="#ff5a1a" fill-opacity="${g2(o)}"/>` : "") + `<path d="${rr(x - 14 + (o.on ? 24 * (.4 + .6 * o.level) : 0), y - .5, 14, 11, 1.4)}" fill="url(#${u}-st)"/>`; });
      return svg(o, s);
    }, [GY, BK, RD, CU, SS, BL]),
  ];

  (window.HDA = window.HDA || []).push({
    id: "grill", tab: "Grills & smokers", group: "Appliances", kind: "device",
    intro: "Twenty outdoor grills, griddles and smokers on patios, decks and lawns. When running, lids open on gas grills (blue-orange burner flames, food with grill marks), charcoal glows, griddles sizzle and steam, smokers puff smoke from the chimney, and smart controllers show the pit temperature in segment digits (the slider sets the heat: 225° smoke, 450° grill at 80%).",
    
    css, icons,
  });
})();
