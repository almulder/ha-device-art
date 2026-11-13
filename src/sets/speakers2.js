(function () {
  const P = "hda-speakers2-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const CHAR = "#3b3d42", GW = "#e4e5e1", DSB = "#2d4a6c", LAV = "#b9a8d8", MT = "#2e5d5f", SAND = "#d6c8b0", TWB = "#3e5170", HGR = "#9a9c9e", PLUM = "#5a3a4e", BLK = "#1d1e21", OCB = "#5f86a8", CLB = "#a8c4d8";
  const CYAN = "#16d6ff", BLUE = "#1c5cff";
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const ell = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx + rx)} ${f(cy)}A${rx} ${ry} 0 1 0 ${f(cx - rx)} ${f(cy)}`;
  const FONT = `font-family="Arial,Helvetica,sans-serif"`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const shelf = (...a) => BGW(shelf_(...a));
  const counter = (...a) => BGW(counter_(...a));
  const wallBg = (...a) => BGW(wallBg_(...a));

  function ctx(o) {
    const u = o.uid, on = !!o.on, lv = o.level == null ? .5 : o.level, c = o.color || CHAR, h = N();
    return { o, u, on, lv, c, p: { l: h.shade(c, .32), m: c, d: h.shade(c, -.32), k: h.shade(c, -.6) }, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, n: 0 };
  }
  const gid = (x, s) => x.id(s + (x.n++));
  function defs(x) {
    const p = x.p, id = x.id;
    return `<defs>
${rg(id("sph"), [[0, p.l], [.45, p.m], [.85, p.d], [1, p.k]], .36, .3, .75)}
${lg(id("cyl"), [[0, p.d], [.25, p.l], [.55, p.m], [1, p.k]])}
${lg(id("top"), [[0, p.l], [1, p.m]], 0, 0, 0, 1)}
${lg(id("blk"), [[0, "#3a3b40"], [.4, "#1e1f23"], [1, "#0c0c0e"]])}
${lg(id("scr"), [[0, "#14161c"], [1, "#050608"]], 0, 0, 0, 1)}
${lg(id("gl"), [[0, "#fff", .2], [.4, "#fff", .03], [.41, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("dn"), [[0, "#000", .5], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("wd"), [[0, "#b8874f"], [1, "#7a5230"]], 0, 0, 0, 1)}
${rg(id("cy"), [[0, CYAN, .85], [.5, BLUE, .35], [1, BLUE, 0]])}
${rg(id("cs"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .45]], .5, .45, .75)}
<pattern id="${id("fab")}" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><circle cx="1.1" cy="1.1" r=".5" fill="#000" opacity=".22"/></pattern>
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter></defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  function shelf_(x, sy, wall) {
    wall = wall || "#cfc8bc"; const h = N(), g = gid(x, "wl");
    return `${lg(g, [[0, h.shade(wall, -.2)], [1, h.shade(wall, .02)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="184" fill="url(#${g})"/><rect x="8" y="${sy}" width="184" height="10" fill="${x.url("wd")}"/><path d="M8 ${sy}H192" stroke="#fff" stroke-opacity=".35"/><rect x="8" y="${sy + 10}" width="184" height="12" fill="${x.url("dn")}"/>`;
  }
  function counter_(x, cy, wall, top) {
    wall = wall || "#e6e2da"; top = top || "#d9d6cf"; const h = N(), g = gid(x, "bs"); let d = "";
    for (let y = 14, i = 0; y < cy; y += 9, i++) { d += `M8 ${y}H192`; for (let xx = 8 + (i % 2) * 9; xx < 192; xx += 18) d += `M${xx} ${y - 9}v9`; }
    return `${lg(g, [[0, h.shade(wall, -.12)], [1, h.shade(wall, .02)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${cy - 8}" fill="url(#${g})"/><path d="${d}" stroke="#000" stroke-opacity=".08"/><rect x="8" y="${cy}" width="184" height="${192 - cy}" fill="${top}"/><path d="M8 ${cy}H192" stroke="#fff" stroke-opacity=".5"/><rect x="8" y="${cy}" width="184" height="4" fill="${x.url("dn")}" opacity=".5"/>`;
  }
  function wallBg_(x, wall) { const h = N(), g = gid(x, "wl"); return `${lg(g, [[0, h.shade(wall, -.15)], [1, h.shade(wall, .03)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="184" fill="url(#${g})"/>`; }
  const shadow = (x, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * .16)}" fill="${x.url("cs")}"/>`;
  const fab = (x, d) => `<path d="${d}" fill="url(#${x.u}-fab)"/>`;

  function ring(x, cx, cy, rx, ry, w, under) {
    const d = ell(cx, cy, rx, ry);
    if (!x.on) return `<path d="${d}" fill="none" stroke="#1a1b1e" stroke-width="${w}" opacity=".55"/>`;
    const g = under ? `<ellipse cx="${cx}" cy="${f(cy + ry * 1.2)}" rx="${f(rx * 1.6)}" ry="${f(ry * 2 + 4)}" fill="${x.url("cy")}" opacity=".7"/>` : `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx * 1.4)}" ry="${f(ry * 1.8 + 6)}" fill="${x.url("cy")}" opacity=".6"/>`;
    return g + `<path d="${d}" fill="none" stroke="${BLUE}" stroke-width="${w}" pathLength="100"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w}" pathLength="100" stroke-dasharray="${f(x.lv * 100)} 100" opacity=".9"/>` +
      `<path class="${P}swirl" d="${d}" fill="none" stroke="${CYAN}" stroke-width="${f(w * .8)}" pathLength="100" stroke-dasharray="16 34"/>`;
  }
  function bar(x, x0, y0, x1, y1, w) {
    if (!x.on) return `<path d="M${x0} ${y0}L${x1} ${y1}" stroke="#141518" stroke-width="${w}" stroke-linecap="round" opacity=".6"/>`;
    const d = `M${x0} ${y0}L${x1} ${y1}`;
    return `<path d="${d}" stroke="${CYAN}" stroke-width="${w * 4}" stroke-linecap="round" opacity=".2"/><path d="${d}" stroke="${BLUE}" stroke-width="${w}" stroke-linecap="round" pathLength="100"/><path d="${d}" stroke="#fff" stroke-width="${w}" pathLength="100" stroke-dasharray="${f(x.lv * 100)} 100" opacity=".85"/><path class="${P}swirl" d="${d}" stroke="${CYAN}" stroke-width="${w * .8}" pathLength="100" stroke-dasharray="20 30"/>`;
  }
  function card(x, kind) {
    if (!x.on) return `<rect width="160" height="100" fill="${x.url("scr")}"/><path d="M0 100L0 50Q60 10 160 6V0H0Z" fill="${x.url("gl")}"/>`;
    const g = gid(x, "sc"); let s = "";
    if (kind === "photo") {
      s = `${lg(g, [[0, "#ffb26b"], [.55, "#ff7a8a"], [1, "#6a4ab0"]], 0, 0, 0, 1)}<rect width="160" height="100" fill="url(#${g})"/><circle cx="110" cy="48" r="16" fill="#ffe2a0"/><path d="M0 100L0 70L30 52L56 68L84 46L118 70L142 58L160 66V100Z" fill="#3a2a5a"/><path d="M0 100L0 82L40 72L80 86L120 76L160 84V100Z" fill="#241a3c"/><text x="10" y="22" ${FONT} font-size="15" font-weight="300" fill="#fff">7:42</text>`;
    } else if (kind === "home") {
      s = `<rect width="160" height="100" fill="#10141c"/>`;
      const tiles = [["#2a3a52", "Lights"], ["#3a2e1e", "Front door"], ["#203a34", "Thermostat"], ["#2a2a3a", "Camera"], ["#3a2430", "Scenes"], ["#24323a", "Blinds"]];
      tiles.forEach(([c, t], i) => { const tx = 8 + (i % 3) * 50, ty = 26 + ((i / 3) | 0) * 36; s += `<path d="${rr(tx, ty, 46, 32, 4)}" fill="${c}"/><circle cx="${tx + 9}" cy="${ty + 10}" r="4" fill="${["#ffd36b", "#7bd389", "#ff9a5a", "#7ab8ff", "#d98aff", "#9ad8ff"][i]}"/><text x="${tx + 5}" y="${ty + 26}" ${FONT} font-size="6.4" fill="#e8eef6">${t}</text>`; });
      s += `<text x="8" y="17" ${FONT} font-size="10" font-weight="700" fill="#fff">Home</text><text x="152" y="17" ${FONT} font-size="9" fill="#cfd8e4" text-anchor="end">7:42</text>`;
    } else if (kind === "widgets") {
      s = `${lg(g, [[0, "#1d3a5a"], [1, "#0d1a2a"]], 0, 0, 1, 1)}<rect width="160" height="100" fill="url(#${g})"/><text x="10" y="30" ${FONT} font-size="22" font-weight="300" fill="#fff">7:42</text><text x="10" y="42" ${FONT} font-size="6.5" fill="#cfe0f0">Tuesday, Nov 12</text>
<path d="${rr(84, 8, 68, 38, 5)}" fill="#fff" opacity=".12"/><circle cx="100" cy="24" r="7" fill="#ffd36b"/><text x="114" y="30" ${FONT} font-size="13" fill="#fff">54°</text>
<path d="${rr(8, 52, 68, 40, 5)}" fill="#fff" opacity=".12"/><text x="14" y="64" ${FONT} font-size="6.5" fill="#fff">Shopping list</text><path d="M14 72h40M14 79h30M14 86h36" stroke="#cfe0f0" stroke-width="1.6" opacity=".7"/>
<path d="${rr(84, 52, 68, 40, 5)}" fill="#fff" opacity=".12"/><path d="${rr(90, 58, 22, 28, 3)}" fill="#ff8a6a"/><text x="118" y="66" ${FONT} font-size="6" fill="#fff">Now playing</text><path d="M118 74h28" stroke="#fff" stroke-width="1.4" opacity=".5"/>`;
    } else {
      s = `${lg(g, [[0, "#2a5a8a"], [1, "#0e2238"]], 0, 0, 0, 1)}<rect width="160" height="100" fill="url(#${g})"/><text x="12" y="52" ${FONT} font-size="34" font-weight="300" fill="#fff">7:42</text><text x="12" y="66" ${FONT} font-size="8" fill="#d6e6f6">Tuesday, November 12</text><circle cx="128" cy="32" r="10" fill="#ffd36b"/><path d="M118 42a8 8 0 0 1 14 -4a6 6 0 0 1 10 6H118Z" fill="#e8eef4"/><text x="114" y="62" ${FONT} font-size="13" fill="#fff">54°</text><path d="M12 84H148" stroke="#fff" stroke-opacity=".2"/>`;
    }
    return s + `<path d="M0 100L0 60Q60 20 160 12V0H0Z" fill="#fff" opacity=".05"/>`;
  }
  function screen(x, X, Y, W, H, kind, bez, frame) {
    bez = bez == null ? 4 : bez;
    return `<path d="${rr(X, Y, W, H, 3)}" fill="${frame || "#0b0b0d"}"/><g transform="translate(${f(X + bez)} ${f(Y + bez)}) scale(${(W - 2 * bez) / 160} ${(H - 2 * bez) / 100})">${card(x, kind)}</g><circle cx="${f(X + W - bez * 2)}" cy="${f(Y + bez * .55)}" r="${f(Math.max(.6, bez * .22))}" fill="#2a2d33"/>`;
  }

  const icons = [];
  const G = (id, name, colors, fn) => icons.push({ id, name, colors, picker: true, colorLabel: "Color", render(o) { return fn(ctx(o)); } });

  G("tall-cylinder-speaker", "Tall cylinder speaker", [BLK, GW], (x) => {
    const cx = 100, t = 34, b = 160, rx = 21, ry = 5; let gr = "";
    for (let y = b - 6; y > b - 66; y -= 3) for (let xx = cx - rx + 3; xx < cx + rx - 2; xx += 3) gr += `M${f(xx + (y % 6 ? 1.5 : 0))} ${y}h.6`;
    return svg(x, shelf(x, 160, "#c9c3b8") + shadow(x, cx, 162, 30) +
      `<path d="M${cx - rx} ${t}V${b}A${rx} ${ry} 0 0 0 ${cx + rx} ${b}V${t}Z" fill="${x.url("cyl")}"/><path d="${gr}" stroke="#000" stroke-opacity=".55" stroke-width="1.4"/>` +
      `<path d="${ell(cx, t, rx, ry)}" fill="${x.url("top")}"/><path d="${ell(cx, t, rx - 4, ry - 1)}" fill="#141518"/><circle cx="${cx - 4}" cy="${t}" r="1.2" fill="#3a3b40"/><circle cx="${cx + 4}" cy="${t}" r="1.2" fill="#3a3b40"/>` + ring(x, cx, t, rx - 1, ry - .3, 2.2) + `<path d="M${cx - rx + 4} ${t + 8}V${b - 8}" stroke="#fff" stroke-opacity=".15" stroke-width="3"/>`);
  });
  G("fabric-puck-speaker", "Fabric puck speaker", [CHAR, HGR, SAND, PLUM], (x) => {
    const cx = 100, t = 128, hgt = 18, rx = 38, ry = 10, h = N();
    const side = `M${cx - rx} ${t}V${t + hgt}A${rx} ${ry} 0 0 0 ${cx + rx} ${t + hgt}V${t}Z`;
    const btn = (bx, s) => `<ellipse cx="${bx}" cy="${t}" rx="3.4" ry="1.4" fill="${h.shade(x.c, -.2)}"/><path d="${s}" stroke="${h.shade(x.c, -.55)}" stroke-width=".7" fill="none"/>`;
    return svg(x, shelf(x, 150) + shadow(x, cx, 150, 46) + `<path d="${side}" fill="${x.url("cyl")}"/>` + fab(x, side) +
      `<path d="${ell(cx, t, rx, ry)}" fill="${h.shade(x.c, .1)}"/><path d="${ell(cx, t, rx, ry)}" fill="${x.url("gl")}"/>` + btn(cx - 18, `M${cx - 19.5} ${t}h3`) + btn(cx - 6, `M${cx - 7.5} ${t}h3M${cx - 6} ${t - .9}v1.8`) + btn(cx + 6, `M${cx + 5} ${t - .6}l1 .6l1 -.6`) + btn(cx + 18, `M${cx + 17.6} ${t}h.8`) +
      ring(x, cx, t, rx - .5, ry - .2, 1.8));
  });
  const sphere = (x, cx, cy, r, flat) => {
    const d = `M${f(cx - r * .62)} ${f(cy + r * .78)}A${r} ${r} 0 1 1 ${f(cx + r * .62)} ${f(cy + r * .78)}Z`;
    return `<path d="${d}" fill="${x.url("sph")}"/>` + fab(x, d) + `<ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .45)}" rx="${f(r * .35)}" ry="${f(r * .2)}" fill="#fff" opacity=".12"/>`;
  };
  const topButtons = (x, cx, cy, r) => { const h = N(); return [-1, 1].map((k) => `<ellipse cx="${f(cx + k * r * .2)}" cy="${f(cy - r * .9)}" rx="${f(r * .06)}" ry="${f(r * .025)}" fill="${h.shade(x.c, -.4)}"/>`).join(""); };
  G("small-ball-speaker", "Small ball speaker", [CHAR, GW, DSB], (x) => {
    const cx = 100, cy = 120, r = 36;
    return svg(x, shelf(x, 150) + ring(x, cx, cy + r * .78 + 1, r * .62, 4, 2.6, true) + shadow(x, cx, 151, 30) + sphere(x, cx, cy, r) + topButtons(x, cx, cy, r) + (x.on ? `<path d="M${f(cx - r * .6)} ${f(cy + r * .74)}A${r * .6} 4 0 0 0 ${f(cx + r * .6)} ${f(cy + r * .74)}" stroke="${CYAN}" stroke-width="1" opacity=".6" fill="none"/>` : ""));
  });
  G("ball-speaker-with-clock", "Ball speaker with clock", [GW, CHAR, DSB, CLB], (x) => {
    const cx = 100, cy = 120, r = 36; let dm = "";
    const digits = { "1": "010110010010111", "0": "111101101101111", "8": "111101111101111", "7": "111001001001001", "4": "101101111001001", "2": "111001111100111" };
    ["7", "4", "2"].forEach((ch, i) => { const m = digits[ch], x0 = cx - 16 + i * 11 + (i > 0 ? 4 : 0); for (let k = 0; k < 15; k++) if (m[k] === "1") dm += `<circle cx="${f(x0 + (k % 3) * 2.6)}" cy="${f(cy - 2 + ((k / 3) | 0) * 2.6)}" r="1.5" fill="#000" opacity=".3"/><circle cx="${f(x0 + (k % 3) * 2.6)}" cy="${f(cy - 2 + ((k / 3) | 0) * 2.6)}" r="1" fill="#fff"/>`; });
    dm += `<circle cx="${cx - 6.6}" cy="${cy + 1}" r=".9" fill="#fff"/><circle cx="${cx - 6.6}" cy="${cy + 6}" r=".9" fill="#fff"/>`;
    return svg(x, counter(x, 150) + ring(x, cx, cy + r * .78 + 1, r * .62, 4, 2.6, true) + shadow(x, cx, 151, 30) + sphere(x, cx, cy, r) + topButtons(x, cx, cy, r) + `<g opacity="${N().hx(x.c)[0] > 150 ? .9 : .95}">${dm.replace(/#fff/g, N().hx(x.c)[0] > 150 ? "#f4f6f8" : "#ffffff")}</g>`);
  });
  G("large-ball-speaker", "Large ball speaker", [CHAR, GW, TWB], (x) => {
    const cx = 100, cy = 116, r = 48;
    return svg(x, shelf(x, 156, "#d2cbbf") + ring(x, cx, cy + r * .78 + 1, r * .62, 5, 3, true) + shadow(x, cx, 158, 40) + sphere(x, cx, cy, r) + topButtons(x, cx, cy, r));
  });
  G("half-ball-speaker", "Half-ball speaker", [CHAR, GW, LAV, MT], (x) => {
    const cx = 100, by = 150, h = N();
    const dome = `M${cx - 40} ${by}Q${cx - 44} ${by - 46} ${cx - 6} ${by - 58}Q${cx + 34} ${by - 62} ${cx + 42} ${by - 20}L${cx + 40} ${by}Z`;
    const face = `M${cx - 40} ${by - 2}Q${cx - 40} ${by - 40} ${cx - 8} ${by - 50}Q${cx + 26} ${by - 54} ${cx + 30} ${by - 26}Q${cx + 30} ${by - 2} ${cx - 4} ${by}Z`;
    return svg(x, shelf(x, 150, "#cdc5d0") + shadow(x, cx, 152, 46) + `<path d="${dome}" fill="${h.shade(x.c, -.15)}"/><path d="${dome}" fill="${x.url("sph")}" opacity=".6"/>` +
      `<path d="${face}" fill="${x.url("sph")}"/>` + fab(x, face) + `<path d="${face}" fill="none" stroke="${h.shade(x.c, -.4)}" stroke-width=".8"/>` +
      bar(x, cx - 18, by - 47, cx + 8, by - 51, 2.2) + `<ellipse cx="${cx + 20}" cy="${by - 52}" rx="3" ry="1.2" fill="${h.shade(x.c, -.35)}"/>`);
  });
  G("studio-speaker-drum", "Studio speaker drum", [CHAR, GW], (x) => {
    const cx = 100, t = 60, b = 156, rx = 40, ry = 9, h = N();
    const side = `M${cx - rx} ${t}V${b}A${rx} ${ry} 0 0 0 ${cx + rx} ${b}V${t}Z`;
    return svg(x, shelf(x, 156, "#c8c1b5") + shadow(x, cx, 158, 50) + `<path d="${side}" fill="${x.url("cyl")}"/>` + fab(x, side) +
      `<path d="M${cx - 22} ${b - 6}Q${cx} ${b - 2} ${cx + 22} ${b - 6}V${b - 1}Q${cx} ${b + 3} ${cx - 22} ${b - 1}Z" fill="#0b0b0d"/>` +
      `<path d="${ell(cx, t, rx, ry)}" fill="${h.shade(x.c, .08)}"/><path d="${ell(cx, t, rx - 7, ry - 2)}" fill="${h.shade(x.c, -.15)}"/><path d="${ell(cx, t, rx - 7, ry - 2)}" fill="url(#${x.u}-fab)"/>${[-14, -5, 5, 14].map((d) => `<ellipse cx="${cx + d}" cy="${t + 4.6 + Math.abs(d) * -.08}" rx="2.6" ry="1" fill="${h.shade(x.c, -.35)}"/>`).join("")}` + ring(x, cx, t, rx - 3.5, ry - 1, 2.2));
  });
  G("round-alarm-display", "Round alarm display", [BLK, GW, OCB], (x) => {
    const cx = 100, cy = 120, r = 38, k = gid(x, "sp");
    const scr = `M${f(cx - r * .95)} ${f(cy - r * .31)}A${r} ${r} 0 0 1 ${f(cx + r * .95)} ${f(cy - r * .31)}Q${cx} ${f(cy + r * .12)} ${f(cx - r * .95)} ${f(cy - r * .31)}Z`;
    return svg(x, counter(x, 150, "#ece6dc") + shadow(x, cx, 151, 32) + sphere(x, cx, cy, r) +
      `<path d="${scr}" fill="#060708"/><clipPath id="${k}"><path d="${scr}"/></clipPath><g clip-path="url(#${k})">${x.on ? `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${r}" fill="#0b1830"/><text x="${cx}" y="${f(cy - 12)}" ${FONT} font-size="17" font-weight="300" fill="#fff" text-anchor="middle">7:42</text><text x="${cx}" y="${f(cy - 3)}" ${FONT} font-size="5" fill="#9fc6ff" text-anchor="middle">TUE 12 · 54°</text><path d="M${cx - 14} ${f(cy - 1)}h${f(28 * x.lv)}" stroke="#fff" stroke-width="1.2"/>` : ""}<path d="M${cx - r} ${cy}L${cx + 10} ${cy - r}H${cx + 20}L${cx - r + 10} ${cy}Z" fill="#fff" opacity=".07"/></g>` + topButtons(x, cx, cy, r) + (x.on ? `<path d="M${cx - 18} ${f(cy + r * .82)}h36" stroke="${CYAN}" stroke-width="1.6" opacity=".7" class="${P}swirl" stroke-dasharray="10 6"/>` : ""));
  });
  G("plug-in-mini-speaker", "Plug-in mini speaker", [GW], (x) => {
    const X = 82, Y = 82, W = 36, H = 48;
    return svg(x, wallBg(x, "#d9d3c8") + `<path d="${rr(76, 70, 48, 76, 4)}" fill="#f2f1ec"/><path d="${rr(76, 70, 48, 76, 4)}" fill="none" stroke="#000" stroke-opacity=".12"/><rect x="92" y="132" width="4" height="7" rx="1" fill="#333"/><rect x="104" y="132" width="4" height="7" rx="1" fill="#333"/>` +
      `<path d="${rr(X, Y, W, H, 7)}" fill="#000" opacity=".3" filter="${x.url("bl")}" transform="translate(2 3)"/><path d="${rr(X, Y, W, H, 7)}" fill="${x.c}"/><path d="${rr(X, Y, W, H, 7)}" fill="${x.url("gl")}"/><path d="${rr(X, Y, W, H, 7)}" fill="none" stroke="#000" stroke-opacity=".15"/>` +
      `${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${X + 9 + (i % 3) * 9}" cy="${Y + 22 + ((i / 3) | 0) * 7}" r="1.2" fill="#000" opacity=".25"/>`).join("")}<circle cx="${X + W / 2}" cy="${Y + 38}" r="2.6" fill="none" stroke="#000" stroke-opacity=".35"/><rect x="${X + W / 2 - 3}" y="${Y + H - 1}" width="6" height="3" rx="1" fill="#555"/>` + bar(x, X + 10, Y + 8, X + W - 10, Y + 8, 2.2));
  });
  G("car-voice-puck", "Car voice puck", [BLK], (x) => {
    const cx = 100;
    return svg(x, BGW(`${lg(x.id("car"), [[0, "#6a7a8a"], [1, "#2a3440"]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="184" fill="${x.url("car")}"/><path d="M8 70Q100 54 192 70V8H8Z" fill="#8aa4bc" opacity=".6"/>` +
      `<path d="M8 120Q100 96 192 120V192H8Z" fill="#26272b"/><path d="M8 120Q100 96 192 120" stroke="#3e4046" stroke-width="3" fill="none"/><path d="M8 140Q100 118 192 140" stroke="#1a1b1e" stroke-width="1.4" fill="none"/>`) +
      `<path d="M90 110h20l-2 6h-16z" fill="#1a1b1e"/><path d="${rr(86, 66, 28, 46, 6)}" fill="#000" opacity=".4" filter="${x.url("bl")}" transform="translate(2 3)"/><path d="${rr(86, 66, 28, 46, 6)}" fill="${x.url("blk")}"/><path d="${rr(86, 66, 28, 46, 6)}" fill="url(#${x.u}-gl)"/><path d="M90 67.5H110" stroke="#fff" stroke-opacity=".2"/>${[0, 1, 2].map((i) => `<circle cx="${95 + i * 5}" cy="96" r=".9" fill="#000" opacity=".7"/>`).join("")}<circle cx="100" cy="104" r="2" fill="none" stroke="#3a3b40"/>` + bar(x, 91, 71, 109, 71, 1.8) +
      `<path d="M100 112q2 10 30 24" stroke="#111" stroke-width="2" fill="none"/>`);
  });
  const showWedge = (x, X, Y, W, H, kind, color) => {
    const h = N(), c = color || x.c, d = Math.min(W * .22, 22);
    return `<path d="M${X + 4} ${Y + H}L${X + W + d * .6} ${Y + H}L${X + W + d * .5} ${Y + 6}L${X + W - 4} ${Y}Z" fill="${h.shade(c, -.25)}"/><path d="M${X + W - 2} ${Y + 2}L${X + W + d * .5} ${Y + 8}V${Y + H}H${X + W}Z" fill="${c}"/><path d="M${X + W - 2} ${Y + 2}L${X + W + d * .5} ${Y + 8}V${Y + H}H${X + W}Z" fill="url(#${x.u}-fab)"/>` +
      screen(x, X, Y, W, H, kind, 4) + bar(x, X + W * .3, Y + H - 2.4, X + W * .7, Y + H - 2.4, 1.6);
  };
  G("5-inch-smart-display", "5-inch smart display", [CHAR, GW, CLB], (x) => svg(x, shelf(x, 150, "#cfc6b6") + shadow(x, 104, 152, 50) + showWedge(x, 54, 102, 84, 48, "clock")));
  G("8-inch-smart-display", "8-inch smart display", [CHAR, GW], (x) => svg(x, counter(x, 152) + shadow(x, 104, 154, 66) + showWedge(x, 36, 84, 118, 68, "widgets")));
  G("8-inch-photo-display", "8-inch photo display", [GW, CHAR], (x) => svg(x, shelf(x, 152, "#d7cfc2") + shadow(x, 104, 154, 66) + showWedge(x, 36, 84, 118, 68, "photo") + BGW(`<path d="M162 152v-24h14v24" fill="#6a8a5a" opacity=".85"/><circle cx="169" cy="122" r="9" fill="#4a7a3a"/>`)));
  G("swivel-smart-display", "Swivel smart display", [CHAR, GW], (x) => {
    const cx = 100, t = 128, b = 156, rx = 34, ry = 8, h = N();
    const side = `M${cx - rx} ${t}V${b}A${rx} ${ry} 0 0 0 ${cx + rx} ${b}V${t}Z`;
    return svg(x, counter(x, 156) + shadow(x, cx, 158, 46) + `<path d="${side}" fill="${x.url("cyl")}"/>` + fab(x, side) + `<path d="${ell(cx, t, rx, ry)}" fill="${h.shade(x.c, .05)}"/>` +
      `<g class="${x.on ? P + "turn" : ""}"><path d="M${cx - 6} ${t - 2}V${t - 12}H${cx + 6}V${t - 2}Z" fill="#1a1b1e"/>` + screen(x, cx - 60, 52, 120, 76, "clock", 4) + bar(x, cx - 20, 125.6, cx + 20, 125.6, 1.6) + `</g>`);
  });
  G("15-inch-wall-display", "15-inch wall display", [BLK, GW], (x) => svg(x, counter(x, 176, "#e9e4da") + `` + shadow(x, 100, 140, 70).replace("ry=", "ry=") +
    `<path d="${rr(22, 44, 156, 92, 3)}" fill="#000" opacity=".3" filter="${x.url("bl")}" transform="translate(2 4)"/><path d="${rr(22, 44, 156, 92, 3)}" fill="${x.c}"/>` + screen(x, 28, 50, 144, 80, "widgets", 2, "#0b0b0d") + bar(x, 70, 133, 130, 133, 1.4)));
  G("21-inch-wall-display", "21-inch wall display", [BLK], (x) => svg(x, counter(x, 160, "#3a3c42", "#c9c4ba") + shadow(x, 100, 162, 80) +
    `<path d="M70 160l10 -20h40l10 20Z" fill="#26272b"/><path d="${rr(16, 46, 168, 98, 3)}" fill="${x.c}"/>` + screen(x, 20, 50, 160, 90, "photo", 2) + bar(x, 70, 141.5, 130, 141.5, 1.6)));
  G("wall-control-panel", "Wall control panel", [GW, CHAR], (x) => {
    const X = 52, Y = 54, W = 96, H = 64;
    return svg(x, wallBg(x, "#cbd0d2") + BGW(`<path d="${rr(156, 74, 22, 36, 2)}" fill="#f0f0ec"/><path d="${rr(162, 80, 10, 24, 1.5)}" fill="#e2e2dd"/>`) +
      `<path d="${rr(X, Y, W, H, 6)}" fill="#000" opacity=".3" filter="${x.url("bl")}" transform="translate(2 4)"/><path d="${rr(X, Y, W, H, 6)}" fill="${x.c}"/><path d="${rr(X, Y, W, H, 6)}" fill="${x.url("gl")}"/>` + screen(x, X + 5, Y + 5, W - 10, H - 10, "home", 1.5) + bar(x, X + 30, Y + H - 2.4, X + W - 30, Y + H - 2.4, 1.3));
  });
  G("kids-glow-lamp", "Kids glow lamp", ["#ff9a5a", "#6ad0ff", "#c77bff", "#7bff9a", "#ffe08a"], (x) => {
    const cx = 100, cy = 120, s = 30, on = x.on, g = gid(x, "gw");
    const c = on ? x.c : "#d9dcdf";
    return svg(x, shelf(x, 152, "#2a2e3a") + (on ? `<circle class="${P}pulse" cx="${cx}" cy="${cy}" r="70" fill="url(#${g})"/>` : "") + `${rg(g, [[0, x.c, .55], [.5, x.c, .15], [1, x.c, 0]])}` + shadow(x, cx, 154, 36) +
      (() => { const dome = `M${cx - s} ${cy + s}V${cy + 6}Q${cx - s} ${cy - s * .55} ${cx} ${cy - s * .55}Q${cx + s} ${cy - s * .55} ${cx + s} ${cy + 6}V${cy + s}Z`, mg = gid(x, "gm");
        return `${lg(mg, on && x.c ? [[0, N().mix(x.c, "#fff", .55)], [.6, x.c], [1, N().shade(x.c, -.2)]] : [[0, "#f2f4f5"], [1, "#c9cdd0"]], 0, 0, 0, 1)}<path d="${dome}" fill="url(#${mg})" opacity="${on ? .97 : .9}"/><path d="${dome}" fill="#fff" opacity="${on ? .2 : .1}"/><ellipse cx="${cx - s * .35}" cy="${cy - s * .1}" rx="${s * .3}" ry="${s * .18}" fill="#fff" opacity=".45"/><path d="${dome}" fill="none" stroke="#fff" stroke-opacity=".5"/>` +
          `<path d="M${cx - s} ${cy + s - 6}H${cx + s}V${cy + s}H${cx - s}Z" fill="#e6e8ea"/><path d="M${cx - s} ${cy + s - 6}H${cx + s}" stroke="#000" stroke-opacity=".12"/>`; })());
  });
  G("streaming-stick-remote", "Streaming stick + remote", [BLK], (x) => {
    const on = x.on;
    return svg(x, wallBg(x, "#2a2c34") + `<path d="${rr(18, 20, 164, 98, 3)}" fill="#0b0b0d"/>` + `<g transform="translate(22 24) scale(1.0 .9)">${on ? `<rect width="156" height="90" fill="#151a26"/>${[0, 1, 2, 3, 4].map((i) => `<path d="${rr(8 + i * 30, 40, 26, 34, 3)}" fill="${["#c0392b", "#2a6ab0", "#e0a020", "#3a8a5a", "#8a3ab0"][i]}"/>`).join("")}<text x="8" y="24" ${FONT} font-size="9" fill="#fff" font-weight="700">Home</text><rect x="0" y="86" width="156" height="4" fill="${BLUE}"/><rect class="${P}swirl2" x="0" y="86" width="40" height="4" fill="${CYAN}"/>` : `<rect width="156" height="90" fill="url(#${x.u}-scr)"/>`}</g>` +
      `<path d="M182 92h6v20h-6z" fill="#111"/><path d="${rr(184, 108, 8, 40, 2)}" fill="#1a1b1e"/>` +
      BGW(`<rect x="8" y="150" width="184" height="42" fill="#6a4a30"/><path d="M8 150H192" stroke="#fff" stroke-opacity=".25"/>`) +
      `<g transform="rotate(-62 100 172)"><path d="${rr(74, 164, 56, 15, 7)}" fill="#000" opacity=".35" filter="${x.url("bl")}" transform="translate(2 3)"/><path d="${rr(74, 164, 56, 15, 7)}" fill="${x.url("blk")}"/><circle cx="${86}" cy="171.5" r="4.4" fill="none" stroke="#5a5c62" stroke-width="1.6"/><circle cx="${86}" cy="171.5" r="1.8" fill="#2a2b30"/><circle cx="78" cy="171.5" r="1.8" fill="${on ? CYAN : "#3a5a8a"}"/>${[0, 1, 2, 3].map((i) => `<circle cx="${98 + i * 7}" cy="171.5" r="1.4" fill="#3a3c42"/>`).join("")}</g>` + (on ? `<circle class="${P}pulse" cx="113" cy="178" r="8" fill="${x.url("cy")}"/>` : ""));
  });
  G("earbuds-case", "Earbuds case", [BLK, GW], (x) => {
    const cx = 100, cy = 128, h = N();
    return svg(x, counter(x, 146, "#e3ddd2", "#bdb6aa") + shadow(x, cx, 150, 34) +
      `<path d="${rr(cx - 30, cy - 18, 60, 36, 18)}" fill="${x.url("sph")}"/><path d="M${cx - 29} ${cy - 2}H${cx + 29}" stroke="${h.shade(x.c, -.45)}" stroke-width="1"/><path d="${rr(cx - 30, cy - 18, 60, 36, 18)}" fill="${x.url("gl")}"/>` +
      `<circle cx="${cx}" cy="${cy + 6}" r="1.6" fill="${x.on ? CYAN : "#555"}"/>${x.on ? `<circle class="${P}pulse" cx="${cx}" cy="${cy + 6}" r="6" fill="${x.url("cy")}"/>` : ""}` +
      `<g transform="translate(140 118)"><circle r="9" fill="${x.url("sph")}"/><circle cx="2" cy="-1" r="4" fill="${h.shade(x.c, -.3)}"/><path d="M-7 4q3 8 10 6" fill="${h.shade(x.c, -.15)}"/>${x.on ? `<circle cx="-3" cy="-4" r="1" fill="${CYAN}"/>` : ""}</g>`);
  });

  const css = `
.hda-speakers2-turn{transform-box:fill-box;transform-origin:50% 100%}
.hda-anim .hda-speakers2-swirl{animation:hda-speakers2-swirl 1.4s linear infinite}
@keyframes hda-speakers2-swirl{to{stroke-dashoffset:-50}}
.hda-anim .hda-speakers2-swirl2{animation:hda-speakers2-swirl2 1.6s ease-in-out infinite alternate}
@keyframes hda-speakers2-swirl2{from{transform:translateX(0)}to{transform:translateX(116px)}}
.hda-anim .hda-speakers2-pulse{animation:hda-speakers2-pulse 2.4s ease-in-out infinite}
@keyframes hda-speakers2-pulse{0%,100%{opacity:1}50%{opacity:.6}}
.hda-anim .hda-speakers2-turn{animation:hda-speakers2-turn 5s ease-in-out infinite}
@keyframes hda-speakers2-turn{0%,100%{transform:scaleX(1)}35%{transform:scaleX(.86) translateX(4px)}70%{transform:scaleX(.9) translateX(-4px)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-speakers2-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "speakers2",
    tab: "Smart home speakers & displays B",
    group: "Home",
    kind: "device",
    levelLabel: "Volume",
    onWord: "Listening",
    offWord: "Off",
    intro: "Twenty voice-assistant devices drawn from real shapes, from the first tall speaker to the wall control panel. Listening lights the cyan-on-blue ring or light bar and the screens show a clock, weather, photo or home card; the slider is volume, shown as the ring filling white. The color is the device's real finish.",
    
    css,
    icons,
  });
})();
