(function () {
  const P = "hda-fitness-";
  const N = () => window.HDAH;
  const f = (n) => (+n).toFixed(1);
  const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const BLK = "#232428", WHT = "#e6e6e3", GRA = "#55595f", WAL = "#7a4f2e", ASH = "#c9a77a", CHE = "#8e4a2e", RED = "#c8202f", SIL = "#b9bec4";
  const FONT = `font-family="Arial,Helvetica,sans-serif"`;
  const stops = (a) => a.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}"${op == null ? "" : ` stop-opacity="${op}"`}/>`).join("");
  const lg = (id, a, x1, y1, x2, y2) => `<linearGradient id="${id}" x1="${x1 || 0}" y1="${y1 || 0}" x2="${x2 == null ? 1 : x2}" y2="${y2 || 0}">${stops(a)}</linearGradient>`;
  const rg = (id, a, cx, cy, r) => `<radialGradient id="${id}" cx="${cx == null ? .5 : cx}" cy="${cy == null ? .5 : cy}" r="${r || .5}">${stops(a)}</radialGradient>`;
  const rr = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`;
  const BGW = (t) => `<g class="hda-bg">${t}</g>`;
  const gym = (...a) => BGW(gym_(...a));

  function ctx(o) {
    const u = o.uid, on = !!o.on, lv = o.level == null ? .6 : o.level, c = o.color || BLK, h = N();
    return { o, u, on, lv, c, dur: (1.7 - 1.3 * lv), p: { l: h.shade(c, .3), m: c, d: h.shade(c, -.3), k: h.shade(c, -.6) }, id: (s) => `${u}-${s}`, url: (s) => `url(#${u}-${s})`, n: 0 };
  }
  const gid = (x, s) => x.id(s + (x.n++));
  const sp = (x, k) => `style="animation-duration:${f((x.dur * (k || 1)))}s"`;
  function defs(x) {
    const p = x.p, id = x.id;
    return `<defs>
${lg(id("fr"), [[0, p.l], [.5, p.m], [1, p.d]], 0, 0, 0, 1)}
${lg(id("frh"), [[0, p.d], [.4, p.l], [1, p.k]])}
${lg(id("blk"), [[0, "#3c3d42"], [.5, "#1d1e22"], [1, "#0b0b0d"]], 0, 0, 0, 1)}
${lg(id("belt"), [[0, "#2a2b2f"], [1, "#121315"]], 0, 0, 0, 1)}
${lg(id("ss"), [[0, "#6f767d"], [.4, "#eceff2"], [.6, "#aab1b8"], [1, "#5c636a"]], 0, 0, 0, 1)}
${lg(id("gl"), [[0, "#fff", .2], [.4, "#fff", .03], [.41, "#fff", 0]], 0, 0, 1, 1)}
${lg(id("dn"), [[0, "#000", .5], [1, "#000", 0]], 0, 0, 0, 1)}
${lg(id("wd"), [[0, N().shade(x.c, .25)], [.5, x.c], [1, N().shade(x.c, -.35)]], 0, 0, 0, 1)}
${lg(id("sc"), [[0, "#14213a"], [1, "#070a12"]], 0, 0, 1, 1)}
${rg(id("cs"), [[0, "#000", .55], [1, "#000", 0]])}
${rg(id("wt"), [[0, "#7fd0ff", .9], [.6, "#2a7ab8", .8], [1, "#0d2a44", .9]], .4, .35, .7)}
${rg(id("vig"), [[0, "#000", 0], [.66, "#000", .06], [1, "#000", .45]], .5, .45, .75)}
<clipPath id="${id("wc")}"><rect x="8" y="8" width="184" height="184" rx="16"/></clipPath>
<filter id="${id("bl")}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2"/></filter></defs>`;
  }
  const svg = (x, body) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs(x)}<g clip-path="${x.url("wc")}">${body}<g class="hda-bg"><rect x="8" y="8" width="184" height="184" fill="${x.url("vig")}"/></g></g><rect class="hda-bg" x="8.5" y="8.5" width="183" height="183" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".08"/></svg>`;

  function gym_(x, fy, wall, floor) {
    wall = wall || "#c9c6c0"; const h = N(), g = gid(x, "wl"); let d = "";
    if (floor === "wood") { for (let y = fy + 6; y < 192; y += 7) d += `M8 ${y}H192`; }
    else for (let xx = 8; xx < 192; xx += 30) d += `M${xx} ${fy}L${xx - 10} 192`;
    return `${lg(g, [[0, h.shade(wall, -.2)], [1, h.shade(wall, .03)]], 0, 0, 0, 1)}<rect x="8" y="8" width="184" height="${fy - 8}" fill="url(#${g})"/><rect x="8" y="${fy - 5}" width="184" height="5" fill="${h.shade(wall, .25)}"/>
<rect x="8" y="${fy}" width="184" height="${192 - fy}" fill="${floor === "wood" ? "#8a6440" : "#2c2d31"}"/><path d="${d}" stroke="${floor === "wood" ? "#000" : "#000"}" stroke-opacity=".25"/><rect x="8" y="${fy}" width="184" height="5" fill="${x.url("dn")}"/>`;
  }
  const shadow = (x, cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(Math.max(3, rx * .1))}" fill="${x.url("cs")}"/>`;
  const tube = (x1, y1, x2, y2, w, col, hi) => `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>${hi === false ? "" : `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}" stroke="#fff" stroke-opacity=".22" stroke-width="${f(w * .3)}" stroke-linecap="round" transform="translate(${f(-w * .2)} ${f(-w * .2)})"/>`}`;
  const tubeP = (d, w, col) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="${f(w * .3)}" stroke-linecap="round" transform="translate(-.6 -.6)"/>`;

  function ui(x, kind) {
    if (!x.on) return `<rect width="100" height="62" fill="#08090b"/><path d="M0 62L0 30Q40 6 100 4V0H0Z" fill="${x.url("gl")}"/>`;
    const g = gid(x, "u"); let s = "";
    if (kind === "road") s = `${lg(g, [[0, "#6fb6ff"], [1, "#ffd9a8"]], 0, 0, 0, 1)}<rect width="100" height="30" fill="url(#${g})"/><path d="M0 30L20 18L36 26L58 14L80 24L100 16V30Z" fill="#4a6a5a"/><rect y="30" width="100" height="32" fill="#4f8a3a"/><path d="M46 30H54L80 62H20Z" fill="#6a6a6a"/><path class="${P}dash" ${sp(x)} d="M50 30V62" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 4"/>`;
    else if (kind === "coach") s = `${lg(g, [[0, "#2a2140"], [1, "#0d0a18"]], 0, 0, 0, 1)}<rect width="100" height="62" fill="url(#${g})"/><circle cx="50" cy="40" r="22" fill="#ff3c6e" opacity=".2"/><g class="${P}bob" ${sp(x, 1.2)}><circle cx="50" cy="16" r="5" fill="#e8c8a8"/><path d="M44 24h12l2 20h-5l-3 14h-2l-3 -14h-5Z" fill="#ff3c6e"/><path d="M44 26l-8 10M56 26l8 10" stroke="#e8c8a8" stroke-width="2.6" stroke-linecap="round"/></g>`;
    else if (kind === "water") s = `${lg(g, [[0, "#9ed4ff"], [.5, "#3a7ab8"], [1, "#0d2a44"]], 0, 0, 0, 1)}<rect width="100" height="62" fill="url(#${g})"/><path d="M0 34Q25 30 50 34T100 34V62H0Z" fill="#1d4a70"/><path d="M30 44L44 38L70 40L58 46Z" fill="#e8e0d0"/><path d="M44 41l-14 8M58 42l12 6" stroke="#c9b28a" stroke-width="1.2"/><g class="${P}dash" ${sp(x)}><path d="M0 50h100M0 56h100" stroke="#fff" stroke-opacity=".3" stroke-dasharray="6 9"/></g>`;
    else s = `<rect width="100" height="62" fill="${x.url("sc")}"/>`;
    const L = 2 * Math.PI * 9, pct = .3 + .6 * x.lv;
    s += `<rect x="0" y="0" width="100" height="9" fill="#000" opacity=".45"/><text x="3" y="6.6" ${FONT} font-size="5" fill="#fff">12:48</text><text x="34" y="6.6" ${FONT} font-size="5" fill="#ff6a4a">♥ 142</text><text x="64" y="6.6" ${FONT} font-size="5" fill="#ffd36b">${Math.round(120 + x.lv * 160)} W</text>`;
    s += `<circle cx="88" cy="50" r="9" fill="#000" opacity=".45"/><circle cx="88" cy="50" r="9" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2"/><circle cx="88" cy="50" r="9" fill="none" stroke="#3fe08a" stroke-width="2" stroke-dasharray="${f(L * pct)} ${f(L)}" transform="rotate(-90 88 50)"/><text x="88" y="52" ${FONT} font-size="5" fill="#fff" text-anchor="middle">${Math.round(pct * 100)}%</text>`;
    return s;
  }
  function portrait(x, X, Y, W, H) {
    if (!x.on) return `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="#08090b"/><path d="M${X} ${Y + H}L${X} ${Y + H * .5}L${X + W} ${Y}H${X}Z" fill="${x.url("gl")}"/>`;
    const g = gid(x, "pt"), s = W / 40, cx = X + W / 2, cy = Y + H * .55, L = 2 * Math.PI * 5 * s, pct = .3 + .6 * x.lv;
    return `${lg(g, [[0, "#2a2140"], [1, "#0d0a18"]], 0, 0, 0, 1)}<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="url(#${g})"/><ellipse cx="${cx}" cy="${cy}" rx="${f(W * .4)}" ry="${f(H * .3)}" fill="#ff3c6e" opacity=".18"/>
<g class="${P}bob" ${sp(x, 1.2)}><g transform="translate(${f(cx)} ${f(cy)}) scale(${f(s * 1.3)})"><circle cx="0" cy="-14" r="3.4" fill="#e8c8a8"/><path d="M-4 -9h8l1.4 13h-3l-2 10h-1.4l-2 -10h-3Z" fill="#ff3c6e"/><path d="M-4 -8l-6 7M4 -8l6 7" stroke="#e8c8a8" stroke-width="1.8" stroke-linecap="round"/></g></g>
<rect x="${X}" y="${Y}" width="${W}" height="${f(8 * s)}" fill="#000" opacity=".45"/><text x="${f(X + 2 * s)}" y="${f(Y + 5.6 * s)}" ${FONT} font-size="${f(4.4 * s)}" fill="#fff">12:48</text><text x="${f(X + W - 2 * s)}" y="${f(Y + 5.6 * s)}" ${FONT} font-size="${f(4.4 * s)}" fill="#ff6a4a" text-anchor="end">♥ 142</text>
<circle cx="${cx}" cy="${f(Y + H - 8 * s)}" r="${f(5 * s)}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="${f(1.4 * s)}"/><circle cx="${cx}" cy="${f(Y + H - 8 * s)}" r="${f(5 * s)}" fill="none" stroke="#3fe08a" stroke-width="${f(1.4 * s)}" stroke-dasharray="${f(L * pct)} ${f(L)}" transform="rotate(-90 ${cx} ${f(Y + H - 8 * s)})"/><text x="${cx}" y="${f(Y + H - 6.6 * s)}" ${FONT} font-size="${f(3.6 * s)}" fill="#fff" text-anchor="middle">${Math.round(pct * 100)}%</text>`;
  }
  function screen(x, X, Y, W, H, kind, tilt) {
    return `<g transform="translate(${f(X)} ${f(Y)})${tilt ? ` rotate(${tilt})` : ""}"><path d="${rr(-2, -2, W + 4, H + 4, 2.4)}" fill="#0b0b0d"/><g transform="scale(${f(W / 100)} ${f(H / 62)})">${ui(x, kind)}</g><path d="${rr(-2, -2, W + 4, H + 4, 2.4)}" fill="none" stroke="#3a3b40" stroke-width=".8"/></g>`;
  }
  function wheel(x, cx, cy, r, col, spokes, rim) {
    let d = ""; const n = spokes || 6;
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; d += `M${cx} ${cy}L${f(cx + r * .85 * Math.cos(a))} ${f(cy + r * .85 * Math.sin(a))}`; }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col || "#1a1b1e"}"/>${rim ? `<circle cx="${cx}" cy="${cy}" r="${f(r - 1)}" fill="none" stroke="${rim}" stroke-width="2"/>` : ""}<g class="${x.on ? P + "spin" : ""}" ${sp(x, .6)}><path d="${d}" stroke="#55585e" stroke-width="1.6"/><circle cx="${f(cx + r * .6)}" cy="${cy}" r="1.2" fill="#9aa0a6"/></g><circle cx="${cx}" cy="${cy}" r="${f(r * .18)}" fill="url(#${x.u}-ss)"/>`;
  }
  function deck(x, x1, y1, x2, y2, t) {
    return `<path d="M${x1} ${y1}L${x2} ${y2}L${x2} ${y2 + t}L${x1} ${y1 + t}Z" fill="${x.url("fr")}"/><path d="M${x1 + 2} ${y1 - 2}L${x2 - 2} ${y2 - 2}" stroke="#141518" stroke-width="4.4"/><path class="${x.on ? P + "belt" : ""}" ${sp(x, .7)} d="M${x2 - 2} ${y2 - 2.6}L${x1 + 2} ${y1 - 2.6}" stroke="#34363c" stroke-width="1.6" stroke-dasharray="5 5"/><path d="M${x1 + 2} ${y1 - .4}L${x2 - 2} ${y2 - .4}" stroke="#fff" stroke-opacity=".15"/><circle cx="${x1 + 2}" cy="${y1 + t / 2}" r="${f(t / 2)}" fill="#111"/><circle cx="${x2 - 2}" cy="${y2 + t / 2}" r="${f(t / 2)}" fill="#111"/>`;
  }
  function crank(x, cx, cy, r) {
    return `<g class="${x.on ? P + "spin" : ""}" ${sp(x, 1.2)}><path d="M${cx} ${cy - r}V${cy + r}" stroke="#2a2b30" stroke-width="2.4"/><rect x="${cx - 4}" y="${cy - r - 1.4}" width="8" height="2.8" rx="1" fill="#111"/><rect x="${cx - 4}" y="${cy + r - 1.4}" width="8" height="2.8" rx="1" fill="#111"/></g><circle cx="${cx}" cy="${cy}" r="3.4" fill="url(#${x.u}-ss)"/>`;
  }
  const seat = (sx, sy, w, col) => `<path d="M${sx - w / 2} ${sy}Q${sx} ${sy - 4} ${sx + w / 2 + 2} ${sy - 1}L${sx + w / 2} ${sy + 3}H${sx - w / 2}Z" fill="${col || "#1a1b1e"}"/><path d="M${sx - w / 2 + 2} ${sy - .6}Q${sx} ${sy - 3.6} ${sx + w / 2} ${sy - 1}" stroke="#fff" stroke-opacity=".2" fill="none"/>`;

  const icons = [];
  const G = (id, name, colors, fn) => icons.push({ id, name, colors, picker: true, colorLabel: "Finish", render(o) { return fn(ctx(o)); } });

  G("connected-treadmill-big", "Connected treadmill, big screen", [BLK, GRA], (x) => svg(x, gym(x, 168, "#d3cfc8", "wood") + shadow(x, 100, 170, 80) + deck(x, 26, 160, 174, 160, 7) +
    `<path d="M160 160L172 152H180V167H172Z" fill="${x.url("fr")}"/>` + tubeP("M168 158C160 120 150 100 128 84", 5, x.c) + tubeP("M128 84H112", 4, x.c) + screen(x, 126, 52, 44, 28, "coach", 0) + `<path d="M146 80v6" stroke="#111" stroke-width="3"/>`));
  G("folding-treadmill", "Folding treadmill", [BLK, GRA], (x) => {
    const inc = x.lv * 6;
    return svg(x, gym(x, 168, "#cfcbc4") + shadow(x, 100, 170, 82) + `<g transform="rotate(${f(-inc)} 160 166)">` + deck(x, 24, 160, 168, 160, 8) + `</g>` +
      `<path d="M150 168L156 140Q176 138 182 150L184 168Z" fill="${x.url("fr")}"/><path d="M156 142Q176 140 181 151" stroke="#fff" stroke-opacity=".25" fill="none"/>` + tubeP("M168 146L150 86", 6, x.c) + tubeP("M150 100H122", 4, x.c) + `<path d="${rr(126, 86, 36, 14, 3)}" fill="${x.url("fr")}"/>` + screen(x, 128, 50, 44, 28, "road", 0) + `<path d="M150 78v8" stroke="#111" stroke-width="3"/>`);
  });
  G("heavy-duty-treadmill", "Heavy-duty treadmill", [BLK], (x) => svg(x, gym(x, 168, "#d8d2c6") + shadow(x, 100, 170, 80) + deck(x, 22, 158, 166, 158, 9) +
    `<path d="M152 167L156 146H180L184 167Z" fill="${x.url("fr")}"/>` + tubeP("M168 150L156 92", 6, x.c) + tubeP("M150 116H112", 4, "#2a2b30") +
    `<path d="M136 84L178 80L182 98L140 102Z" fill="#26272b"/><path d="M144 86L170 84L172 94L146 96Z" fill="${x.on ? "#3a0b0e" : "#100808"}"/>${x.on ? `<text x="158" y="93" ${FONT} font-size="6" fill="#ff4a3a" text-anchor="middle" transform="rotate(-4 158 92)">${(2 + x.lv * 6).toFixed(1)} mph</text>` : ""}<path d="M138 98L180 94" stroke="${RED}" stroke-width="1.6"/>`));
  G("walkpad", "Walking pad", [GRA, BLK, WHT], (x) => svg(x, gym(x, 160, "#e2ddd3", "wood") + BGW(`<rect x="30" y="74" width="140" height="6" rx="1" fill="#c9a77a"/><path d="M40 80V160M160 80V160" stroke="#2a2b30" stroke-width="4"/><rect x="30" y="160" width="20" height="4" fill="#2a2b30"/><rect x="150" y="160" width="20" height="4" fill="#2a2b30"/>` +
    `<path d="${rr(64, 52, 52, 22, 2)}" fill="#1a1b1e"/>${x.on ? `<rect x="66" y="54" width="48" height="18" fill="#2a4a7a"/><path d="M70 60h30M70 65h22" stroke="#fff" stroke-opacity=".6"/>` : ""}<path d="M84 74l-4 0l2 -2z" fill="#111"/>`) + shadow(x, 100, 176, 66) +
    `<path d="${rr(38, 166, 124, 10, 4)}" fill="${x.url("fr")}"/><path d="M44 165.4H156" stroke="#111" stroke-width="3"/><path class="${x.on ? P + "belt" : ""}" ${sp(x, .8)} d="M156 165.4H44" stroke="#34363c" stroke-width="1.4" stroke-dasharray="5 5"/><circle cx="150" cy="171" r="1.2" fill="${x.on ? "#3fe08a" : "#333"}"/>`));
  G("curve", "Curved manual", [BLK, GRA], (x) => svg(x, gym(x, 168) + shadow(x, 100, 170, 76) +
    `<path d="M28 136Q90 178 160 140L162 150Q90 188 26 146Z" fill="${x.url("fr")}"/><path d="M30 134Q90 175 158 138" fill="none" stroke="#111" stroke-width="4"/><path class="${x.on ? P + "belt" : ""}" ${sp(x, .8)} d="M158 138Q90 175 30 134" fill="none" stroke="#34363c" stroke-width="2" stroke-dasharray="3 3"/>` +
    `<path d="M40 150L36 168M150 152L156 168" stroke="#1a1b1e" stroke-width="5"/>` + tubeP("M156 140L150 82", 5, x.c) + tubeP("M150 100H116M150 104L120 120", 3.6, x.c) + `<path d="${rr(140, 70, 20, 14, 2)}" fill="#111"/><rect x="142" y="72" width="16" height="9" fill="${x.on ? "#1a3a2a" : "#0a0c0b"}"/>${x.on ? `<text x="150" y="79" ${FONT} font-size="5.4" fill="#4aff8a" text-anchor="middle">${(3 + x.lv * 7).toFixed(1)}</text>` : ""}`));
  G("swivel-screen-bike", "Swivel-screen bike", [BLK, GRA], (x) => svg(x, gym(x, 170, "#d6d1c8", "wood") + shadow(x, 104, 172, 64) +
    `<path d="M50 170H120M110 170H160" stroke="#1a1b1e" stroke-width="5" stroke-linecap="round"/>` + `<path d="M118 112A30 30 0 0 1 148 142L146 160H118Z" fill="${x.url("fr")}"/>` + wheel(x, 134, 146, 15, "#2a2b30", 5) +
    tubeP("M70 170L92 120L132 96M92 120L126 150", 7, x.c) + tubeP("M84 104L92 120", 5, "#bfc4c9") + seat(80, 101, 22) + tubeP("M132 96L136 72", 5, x.c) + tubeP("M130 72H150Q156 72 156 78", 3.6, "#1a1b1e") + crank(x, 112, 150, 12) +
    `<g class="${x.on ? P + "swivel" : ""}">` + screen(x, 128, 34, 52, 32, "coach", 0) + `</g>`));
  G("studio-bike", "Studio bike", [BLK, WHT], (x) => svg(x, gym(x, 170) + shadow(x, 104, 172, 64) + `<path d="M48 170H118M108 170H164" stroke="#1a1b1e" stroke-width="5" stroke-linecap="round"/>` +
    wheel(x, 140, 140, 20, "#1a1b1e", 6, RED) + tubeP("M68 170L92 116L136 96M92 116L132 146", 7, x.c) + tubeP("M84 100L92 116", 5, "#bfc4c9") + seat(78, 97, 22) + tubeP("M136 96L138 72", 5, x.c) + tubeP("M130 74H154", 4, "#1a1b1e") + crank(x, 114, 146, 12) +
    `<path d="M120 52h40v26h-40z" fill="none" stroke="#2a2b30" stroke-width="2"/>` + screen(x, 122, 54, 36, 22, "road", 0)));
  G("recumbent", "Recumbent bike", [BLK, GRA, WHT], (x) => svg(x, gym(x, 170) + shadow(x, 100, 172, 72) + `<path d="M30 170H170" stroke="#1a1b1e" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M128 170L134 128Q150 120 166 130L170 170Z" fill="${x.url("fr")}"/>` + tubeP("M44 168L60 138H134", 8, x.c) + `<path d="M46 132Q44 100 56 92L66 92Q60 110 62 134Z" fill="#1a1b1e"/><path d="${rr(50, 130, 36, 8, 3)}" fill="#1a1b1e"/>` + crank(x, 150, 148, 11) + tubeP("M136 130L132 88", 5, x.c) + tubeP("M74 132L96 132M96 132L104 122", 4, "#1a1b1e") +
    `<path d="${rr(118, 72, 30, 18, 2)}" fill="#111"/><rect x="120" y="74" width="26" height="14" fill="${x.on ? "#14304a" : "#08090b"}"/>${x.on ? `<path d="M123 84l4 -4l3 2l5 -5l5 3" stroke="#3fe08a" fill="none"/>` : ""}`));
  G("screen-rower", "Screen rower", [BLK, "#2a2c30"], (x) => svg(x, gym(x, 170, "#d9d4ca", "wood") + shadow(x, 100, 172, 84) +
    `<path d="M20 166L150 132" stroke="${x.c}" stroke-width="6" stroke-linecap="round"/><path d="M20 166L150 132" stroke="#fff" stroke-opacity=".2" stroke-width="1.6"/><path d="M18 170h12M120 170h30" stroke="#1a1b1e" stroke-width="4"/><path d="M150 132L176 150L170 170H140Z" fill="${x.url("fr")}"/><circle cx="160" cy="152" r="9" fill="#1a1b1e"/>` +
    `<g class="${x.on ? P + "row" : ""}" ${sp(x, 2)}>${seat(70, 149, 22)}</g>` + `<path d="M138 140l-8 6" stroke="#2a2b30" stroke-width="2.4"/><rect x="128" y="144" width="12" height="3" fill="#1a1b1e" transform="rotate(-15 134 145)"/>` +
    tubeP("M150 134L156 92", 4, x.c) + screen(x, 136, 62, 44, 28, "water", 0)));
  G("wood-water-rower", "Wood water rower", [WAL, CHE, ASH], (x) => svg(x, gym(x, 170, "#e3ddd2", "wood") + shadow(x, 100, 172, 84) +
    `<path d="M18 160L140 140L142 148L20 168Z" fill="${x.url("wd")}"/><path d="M18 160L140 140" stroke="#fff" stroke-opacity=".3"/><path d="M40 156L120 143" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/>` +
    `<path d="M136 128h40v40h-40z" fill="${x.url("wd")}"/><ellipse cx="156" cy="146" rx="15" ry="15" fill="${x.url("wt")}" opacity=".9"/><g class="${x.on ? P + "spin" : ""}" ${sp(x, .8)}><path d="M146 146h20M156 136v20" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/></g><ellipse cx="156" cy="146" rx="15" ry="15" fill="none" stroke="#2a1a10" stroke-width="2"/>` +
    `<g class="${x.on ? P + "row" : ""}" ${sp(x, 2)}>${seat(66, 151, 22)}</g>` + tubeP("M136 130L130 96", 3, "#2a2b30") + screen(x, 110, 70, 40, 25, "water", 0)));
  G("air-rower", "Air rower", [BLK, GRA], (x) => svg(x, gym(x, 170) + shadow(x, 100, 172, 86) +
    `<path d="M16 156H140" stroke="#1a1b1e" stroke-width="5"/><path d="M16 156H140" stroke="url(#${x.u}-ss)" stroke-width="2"/><path d="M18 156V170M128 160L132 170" stroke="#1a1b1e" stroke-width="4"/>` +
    `<path d="M136 170L140 124Q150 116 168 122L176 170Z" fill="#1a1b1e"/>` + wheel(x, 160, 146, 16, "#26272b", 10) + `<circle cx="160" cy="146" r="16" fill="none" stroke="#3a3b40" stroke-width="3" stroke-dasharray="2 2"/>` +
    `<g class="${x.on ? P + "row" : ""}" ${sp(x, 2)}>${seat(70, 151, 20)}</g>` + tubeP("M142 128L124 98", 3, "#1a1b1e") + `<path d="${rr(108, 78, 26, 22, 3)}" fill="#1a1b1e"/><rect x="111" y="81" width="20" height="14" fill="${x.on ? "#c9d2b8" : "#4a5040"}"/>${x.on ? `<text x="121" y="87" ${FONT} font-size="4.6" fill="#111" text-anchor="middle">2:0${Math.round(8 - x.lv * 6)}</text><text x="121" y="93" ${FONT} font-size="4" fill="#111" text-anchor="middle">${Math.round(18 + x.lv * 14)} spm</text>` : ""}`));
  G("elliptical", "Elliptical", [BLK, GRA], (x) => svg(x, gym(x, 170) + shadow(x, 100, 172, 78) + `<path d="M24 170H176" stroke="#1a1b1e" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M24 170L30 150H62L66 170Z" fill="${x.url("fr")}"/>` + tubeP("M40 152L136 162", 4, x.c) + tubeP("M140 170L136 80", 6, x.c) +
    `<g class="${x.on ? P + "swing" : ""}" style="transform-origin:136px 96px;animation-duration:${f(x.dur * 1.4)}s">` + tubeP("M124 64L136 96L110 150", 4, "#2a2b30") + `<path d="M98 148h22v4h-22z" fill="#1a1b1e"/></g>` +
    `<path d="M40 152a10 10 0 1 1 1 0" fill="#1a1b1e"/>` + wheel(x, 42, 146, 10, "#1a1b1e", 5) + screen(x, 122, 52, 36, 22, "road", 0)));
  G("stair-climber", "Stair climber", [BLK], (x) => {
    let st = ""; for (let i = 0; i < 8; i++) st += `<path d="M${74 + i * 9} ${160 - i * 9}h12v3h-12z" fill="#3a3c42"/><path d="M${74 + i * 9} ${160 - i * 9}h12" stroke="#fff" stroke-opacity=".25"/>`;
    return svg(x, gym(x, 170) + shadow(x, 110, 172, 70) + `<path d="M56 170L66 110L150 70L168 76L170 170Z" fill="${x.url("fr")}"/>` +
      `<clipPath id="${x.u}-stc"><path d="M70 166L144 86L160 92V166Z"/></clipPath><path d="M70 166L144 86L160 92V166Z" fill="#111"/><g clip-path="url(#${x.u}-stc)"><g class="${x.on ? P + "steps" : ""}" ${sp(x, 1.6)}>${st}<g transform="translate(-9 9)">${st}</g></g></g>` +
      tubeP("M74 120L62 108L64 80", 4, "#2a2b30") + tubeP("M160 90L166 60", 5, x.c) + screen(x, 148, 40, 30, 20, "road", 0) + `<path d="M58 170L66 112" stroke="#fff" stroke-opacity=".2"/>`);
  });
  G("wall-strength-trainer", "Wall strength trainer", [BLK, WHT], (x) => {
    const arm = x.on ? 0 : 1;
    return svg(x, gym(x, 172, "#e6e2da", "wood") + `<path d="${rr(78, 30, 44, 110, 4)}" fill="#000" opacity=".3" filter="${x.url("bl")}" transform="translate(2 4)"/><path d="${rr(78, 30, 44, 110, 4)}" fill="${x.c}"/><path d="${rr(82, 36, 36, 92, 2)}" fill="#0b0b0d"/>` +
      portrait(x, 83, 37, 34, 90) +
      (arm ? `<path d="M76 92v40M124 92v40" stroke="#1a1b1e" stroke-width="6" stroke-linecap="round"/>` : `<path d="M76 94L44 70M124 94L156 70" stroke="#1a1b1e" stroke-width="6" stroke-linecap="round"/><g class="${P}pull" ${sp(x, 1.6)}><path d="M44 70L60 120M156 70L140 120" stroke="#9aa0a6" stroke-width="1"/><rect x="54" y="118" width="12" height="4" rx="2" fill="#2a2b30"/><rect x="134" y="118" width="12" height="4" rx="2" fill="#2a2b30"/></g>`) +
      `<path d="M78 140h44" stroke="#000" stroke-opacity=".2"/>`);
  });
  G("mirror", "Fitness mirror", [BLK, "#c9a96a", SIL], (x) => svg(x, gym(x, 172, "#d8d0c2", "wood") + `<path d="${rr(68, 22, 64, 150, 3)}" fill="${x.url("fr")}"/>` +
    `${lg(x.id("mr"), [[0, "#a9b6be"], [1, "#5a666e"]], 0, 0, 1, 1)}<rect x="71" y="25" width="58" height="144" fill="${x.url("mr")}"/>` + (x.on ? `<g opacity=".92">${portrait(x, 71, 25, 58, 144)}</g>` : `<path d="M90 60h20v60h-20z" fill="#000" opacity=".08"/>`) + `<path d="M71 169L129 60V25L71 120Z" fill="#fff" opacity=".1"/><circle cx="100" cy="29" r="1.2" fill="#222"/>` +
    BGW(`<path d="M136 172v-18h18v18" fill="#3a6a4a"/><circle cx="145" cy="146" r="11" fill="#2a5a3a"/>`)));
  G("vibe", "Vibration plate", [BLK, WHT], (x) => svg(x, gym(x, 168, "#cfcac2", "wood") + shadow(x, 100, 172, 50) +
    `<g class="${x.on ? P + "buzz" : ""}" ${sp(x, .1)}><path d="${rr(56, 156, 88, 12, 5)}" fill="${x.url("fr")}"/><path d="${rr(62, 152, 76, 6, 3)}" fill="#1a1b1e"/>${x.on ? `<path d="M64 150h72" stroke="#3fd0ff" stroke-opacity=".5" stroke-dasharray="3 3"/>` : ""}</g>` +
    tubeP("M112 156L104 70", 6, x.c) + tubeP("M84 70H124", 4, "#1a1b1e") + `<path d="${rr(94, 60, 20, 10, 2)}" fill="#111"/><rect x="96" y="62" width="16" height="6" fill="${x.on ? "#3a0b0e" : "#100808"}"/>${x.on ? `<text x="104" y="67" ${FONT} font-size="4.6" fill="#ff4a3a" text-anchor="middle">L${Math.round(1 + x.lv * 98)}</text>` : ""}`));
  G("massagegun", "Massage gun + dock", [BLK, WHT, "#9aa0a6"], (x) => svg(x, gym(x, 152, "#d9d3c8") + BGW(`<rect x="8" y="152" width="184" height="40" fill="#b8a080"/><path d="M8 152H192" stroke="#fff" stroke-opacity=".3"/>`) + shadow(x, 100, 156, 44) +
    `<path d="M70 156L80 112H116L126 156Z" fill="#26272b"/><path d="M80 112H116" stroke="#fff" stroke-opacity=".2"/>` +
    `<path d="M88 112L96 74L122 52L136 72L112 88L104 112Z" fill="${x.url("fr")}"/><path d="M96 74L122 52" stroke="#fff" stroke-opacity=".3"/><circle cx="116" cy="66" r="11" fill="none" stroke="${x.p.d}" stroke-width="4"/>` +
    `<g class="${x.on ? P + "punch" : ""}" ${sp(x, .08)}><path d="M120 62L140 46" stroke="#1a1b1e" stroke-width="5"/><circle cx="142" cy="44" r="5" fill="#1a1b1e"/></g><circle cx="${f(114)}" cy="${f(84)}" r="1.4" fill="${x.on ? "#3fd0ff" : "#333"}"/>${x.on ? `<path d="M100 100h${f(10 * x.lv + 2)}" stroke="#3fd0ff" stroke-width="1.6"/>` : ""}`));
  G("cable-gym-station", "Cable gym station", [BLK, WHT], (x) => svg(x, gym(x, 170, "#d6d2ca", "wood") + shadow(x, 100, 172, 78) +
    `<path d="${rr(84, 30, 34, 140, 3)}" fill="${x.url("fr")}"/>` + `<path d="${rr(86, 38, 30, 46, 2)}" fill="#0b0b0d"/>` + portrait(x, 88, 40, 26, 42) +
    `<path d="M84 104L56 92M118 104L146 92" stroke="#1a1b1e" stroke-width="5" stroke-linecap="round"/><g class="${x.on ? P + "pull" : ""}" ${sp(x, 1.6)}><path d="M56 92L64 136M146 92L138 136" stroke="#9aa0a6" stroke-width="1"/><rect x="58" y="134" width="12" height="4" rx="2" fill="#2a2b30"/><rect x="132" y="134" width="12" height="4" rx="2" fill="#2a2b30"/></g>` +
    `<path d="M24 150h50v6h-50z" fill="#1a1b1e"/><path d="M28 156v14M70 156v14" stroke="#2a2b30" stroke-width="3"/><path d="M80 170h44" stroke="#1a1b1e" stroke-width="6"/>`));

  const css = `
.hda-fitness-spin,.hda-fitness-swivel,.hda-fitness-row,.hda-fitness-buzz,.hda-fitness-punch,.hda-fitness-pull,.hda-fitness-bob{transform-box:fill-box;transform-origin:center}
.hda-anim .hda-fitness-belt{animation:hda-fitness-belt .6s linear infinite}
@keyframes hda-fitness-belt{to{stroke-dashoffset:-10}}
.hda-anim .hda-fitness-dash{animation:hda-fitness-dash .6s linear infinite}
@keyframes hda-fitness-dash{to{stroke-dashoffset:-14}}
.hda-anim .hda-fitness-spin{animation:hda-fitness-spin .8s linear infinite}
@keyframes hda-fitness-spin{to{transform:rotate(360deg)}}
.hda-anim .hda-fitness-row{animation:hda-fitness-row 2s ease-in-out infinite alternate}
@keyframes hda-fitness-row{from{transform:translate(0,0)}to{transform:translate(38px,-10px)}}
.hda-anim .hda-fitness-steps{animation:hda-fitness-steps 1.6s linear infinite}
@keyframes hda-fitness-steps{from{transform:translate(0,0)}to{transform:translate(-9px,9px)}}
.hda-anim .hda-fitness-swing{animation:hda-fitness-swing 1.4s ease-in-out infinite alternate}
@keyframes hda-fitness-swing{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
.hda-anim .hda-fitness-swivel{animation:hda-fitness-swivel 6s ease-in-out infinite}
@keyframes hda-fitness-swivel{0%,60%,100%{transform:scaleX(1)}75%{transform:scaleX(.7)}}
.hda-anim .hda-fitness-buzz{animation:hda-fitness-buzz .1s linear infinite alternate}
@keyframes hda-fitness-buzz{from{transform:translateY(0)}to{transform:translateY(-1px)}}
.hda-anim .hda-fitness-punch{animation:hda-fitness-punch .1s linear infinite alternate}
@keyframes hda-fitness-punch{from{transform:translate(0,0)}to{transform:translate(2.4px,-2px)}}
.hda-anim .hda-fitness-pull{animation:hda-fitness-pull 1.6s ease-in-out infinite alternate}
@keyframes hda-fitness-pull{from{transform:translateY(0)}to{transform:translateY(-14px)}}
.hda-anim .hda-fitness-bob{animation:hda-fitness-bob 1.2s ease-in-out infinite alternate}
@keyframes hda-fitness-bob{from{transform:translateY(0)}to{transform:translateY(-3px)}}
@media (prefers-reduced-motion:reduce){.hda-anim [class*="hda-fitness-"]{animation:none!important}}`;

  (window.HDA = window.HDA || []).push({
    id: "fitness",
    tab: "Workout equipment",
    group: "Home",
    kind: "device",
    levelLabel: "Speed",
    onWord: "Workout",
    offWord: "Off",
    intro: "Eighteen connected and electric machines drawn from the real models: treadmills, bikes, rowers, an elliptical, a stair climber, wall trainers, a fitness mirror, a vibration plate and a massage gun. Workout lights the screen with an original class (progress ring, metrics, coach or scenic road) and sets belts, flywheels, seats and treads moving; the slider is speed. The color is the frame finish.",
    
    css,
    icons,
  });
})();
